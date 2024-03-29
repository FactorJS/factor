import type {
  EndpointMeta,
  EndpointResponse,
  FactorDb,
  FactorEmail,
  FactorRouter,
  FactorUser,
  MemberAccess,
  OrganizationMember,
  User,
} from '@factor/api'
import {
  Query,
} from '@factor/api'
import type { FactorTeam } from '.'

export interface TeamQuerySettings {
  factorTeam: FactorTeam
  factorUser: FactorUser
  factorDb: FactorDb
  factorEmail: FactorEmail
  factorRouter: FactorRouter
}

export abstract class TeamQuery extends Query<TeamQuerySettings> {
  factorTeam = this.settings.factorTeam
  factorDb = this.settings.factorDb
  factorUser = this.settings.factorUser
  factorEmail = this.settings.factorEmail
  factorRouter = this.settings.factorRouter
  constructor(settings: TeamQuerySettings) {
    super(settings)
  }
}

type OrgMemberParams = { organizationId: string } & (
  | { _action: 'single', memberId: string }
  | { _action: 'index', limit?: number, offset?: number }
)

export class QueryOrgMembers extends TeamQuery {
  async run(
    params: OrgMemberParams,
    _meta: EndpointMeta,
  ): Promise<EndpointResponse<OrganizationMember[]>> {
    const { organizationId, _action } = params

    const db = this.factorDb?.client()
    const base = db
      .from(this.tbl.member)
      .join(
        this.tbl.org,
        `${this.tbl.member}.organization_id`,
        '=',
        `${this.tbl.org}.organization_id`,
      )
      .join(
        this.tbl.user,
        `${this.tbl.user}.user_id`,
        '=',
        `${this.tbl.member}.user_id`,
      )
      .where(`${this.tbl.member}.organization_id`, organizationId)

    let indexMeta
    let data: OrganizationMember[] = []

    const selector = [
      `${this.tbl.member}.*`,
      `${this.tbl.user}.full_name`,
      `${this.tbl.user}.email`,
      `${this.tbl.user}.last_seen_at`,
    ]
    if (_action === 'single') {
      const r = await base
        .clone()
        .select<OrganizationMember[]>(selector)
        .where(`${this.tbl.member}.user_id`, params.memberId)

      data = r
    }
    else if (_action === 'index') {
      const { limit = 50, offset = 0 } = params
      const r = await base
        .clone()
        .select<OrganizationMember[]>(selector)
        .limit(limit)
        .offset(offset)
        .orderBy(`${this.tbl.user}.lastSeenAt`, 'desc')

      const countRows = await base.clone().count<{ count: number }[]>()
      indexMeta = { offset, limit, count: +countRows[0].count }
      data = r
    }

    return {
      status: 'success',
      data,
      indexMeta,
    }
  }
}

export class QuerySeekInviteFromUser extends TeamQuery {
  async run(
    params: {
      email: string
      requestingEmail: string
      requestingName?: string
    },
    meta: EndpointMeta,
  ): Promise<EndpointResponse<boolean>> {
    if (!this.factorUser)
      throw new Error('no user service')
    const { email, requestingEmail, requestingName } = params
    const { data: user } = await this.factorUser.queries.ManageUser.serve(
      {
        _action: 'getPublic',
        email,
      },
      meta,
    )

    if (!user)
      throw this.stop({ message: 'request invite error' })

    const { fullName } = user

    const text = `Hi ${fullName}!\n\n${
      requestingName || 'A user'
    } (${requestingEmail}) has requested access to one of your organizations.`

    if (!this.factorEmail)
      throw new Error('no email service')

    const appUrl = this.factorEmail.appUrl.value

    const path = this.factorRouter?.rawPath('teamInvite')

    await this.factorEmail.sendEmail({
      subject: `${requestingName || requestingEmail}: Request for Access`,
      text,
      linkText: 'Login and Invite',
      linkUrl: `${appUrl}${path}`,
      to: email,
    })
    return {
      status: 'success',
      message: 'Invite requested',
      more: `The user using '${email}' should get an email requesting they invite you to their account.`,
    }
  }
}

export class QueryTeamInvite extends TeamQuery {
  async run(
    params: {
      organizationId: string
      invites: { email: string, memberAccess: MemberAccess }[]
    },
    meta: EndpointMeta,
  ): Promise<EndpointResponse<boolean>> {
    if (!this.factorUser)
      throw new Error('no user service')
    if (!this.factorEmail)
      throw new Error('no email service')

    const appUrl = this.factorEmail.appUrl

    if (!appUrl)
      throw new Error('no appUrl')

    const { organizationId, invites } = params

    const { bearer } = meta

    if (!invites || invites.length === 0)
      throw this.stop({ message: 'no invites were set' })

    const { data: org }
      = await this.factorUser.queries.FindOneOrganization.serve(
        {
          organizationId,
        },
        meta,
      )

    if (!org)
      throw this.stop({ message: `couldn't find organization ` })

    const invitedById = bearer?.userId

    const _promises = invites.map(async (invite) => {
      if (!this.factorUser)
        throw new Error('no user service')
      const { memberAccess } = invite
      const email = invite.email.toLowerCase() // ensure lowercase

      const url = appUrl.value
      const redirect = encodeURIComponent(`/org/${organizationId}`)
      let linkUrl = `${url}/login?ref=email&source=invite&redirect=${redirect}`
      let linkText = 'Login'
      let message = `Login to get access.`
      // does the user already exist
      let { data: user } = await this.factorUser.queries.ManageUser.serve(
        { _action: 'getPrivate', email },
        { server: true, returnAuthority: ['hashedPassword'] },
      )
      if (!user?.hashedPassword) {
        const { data: newUser }
          = await this.factorUser.queries.ManageUser.serve(
            { _action: 'create', fields: { invitedById, email } },
            { server: true, returnAuthority: ['verificationCode'] },
          )

        linkUrl = this.factorTeam.invitationReturnUrl({
          code: newUser?.verificationCode as string,
          email,
          organizationId,
          redirect,
        })
        user = newUser
        message = `Click the link below to get access.`
        linkText = 'Get Access'
      }

      if (!user?.userId)
        throw this.stop('error creating user')

      await this.factorUser.queries.ManageMemberRelation.serve(
        {
          memberId: user.userId,
          organizationId,
          memberAccess,
          _action: 'create',
          invitedById,
        },
        meta,
      )

      const text = `Hello!\n\nGood news. ${bearer?.fullName || 'A user'} (${
        bearer?.email || 'unknown'
      }) has added you as an ${memberAccess} to the "${
        org.organizationName
      }" organization.\n\n${message}`

      await this.factorEmail?.sendEmail({
        subject: `${org.organizationName}: You've been invited!`,
        text,
        linkText,
        linkUrl,
        to: email,
      })
    })

    await Promise.all(_promises)

    let user: User | undefined
    if (bearer?.userId) {
      const r = await this.factorUser.queries.ManageUser.serve(
        {
          _action: 'getPrivate',
          userId: bearer.userId,
        },
        meta,
      )

      user = r.data
    }

    return {
      status: 'success',
      message: 'Invites sent',
      more: `New members were added based on the emails provided.`,
      user,
    }
  }
}
