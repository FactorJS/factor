import type { vue } from '../utils'
import { getNakedDomain, waitFor } from '../utils'
import type { FictionUser } from '.'

declare global {
  interface Window {
    google?: typeof import('google-one-tap')
    gtag?: (...args: any[]) => void
  }
}

interface CredentialResponse {
  credential: string
  select_by: string
  client_id?: string
}

async function loadGoogleSignInLibrary(): Promise<void> {
  if (!document.querySelector('#google-signin-library')) {
    const googleScript = document.createElement('script')

    googleScript.setAttribute('src', 'https://accounts.google.com/gsi/client')
    googleScript.id = 'google-signin-library'

    document.head.append(googleScript)

    await waitFor(1000)
  }
}

interface GoogleOneTapSettings {
  autoSignIn?: boolean
  promptParentId?: string
  signinButtonId?: string
  showPrompt?: boolean
  fictionUser: FictionUser
  cookieDomain?: string
  isSending?: vue.Ref
  isDarkMode?: boolean
  callback?:
    | ((
      r: Awaited<
          ReturnType<FictionUser['requests']['UserGoogleAuth']['request']>
        >,
    ) => void)
    | undefined
}

async function handleGoogleCredentialResponse(response: CredentialResponse, settings: GoogleOneTapSettings): Promise<void> {
  const { isSending } = settings

  if (isSending)
    isSending.value = true

  const loginResponse
    = await settings.fictionUser.requests.UserGoogleAuth.request(
      {
        _action: 'loginWithCredential',
        credential: response.credential,
      },
      { debug: true },
    )
  if (settings.callback)
    settings.callback(loginResponse)

  if (isSending)
    isSending.value = false
}
// const googleAuthRequest = userEndpoints().UserGoogleAuth.request
// type CallbackResponse = Awaited<ReturnType<typeof googleAuthRequest>>
export async function googleOneTap(settings: GoogleOneTapSettings): Promise<void> {
  const { autoSignIn = false, promptParentId, signinButtonId = '#google-signin-button', cookieDomain, showPrompt = true, fictionUser, isDarkMode = false } = settings

  if (!window)
    return

  if (fictionUser.fictionEnv?.isTest.value) {
    fictionUser.log.info('googleOneTap disabled: isTest')
    return
  }

  if (!fictionUser.googleClientId) {
    fictionUser.log.error('googleOneTap disabled: no googleClientId', { data: settings })
    return
  }

  await loadGoogleSignInLibrary()

  const el = document.querySelector<HTMLElement>(signinButtonId)
  if (window.google === undefined) {
    fictionUser.log.info('Google One Tap not loaded')
  }
  else {
    const state_cookie_domain = cookieDomain || getNakedDomain()
    fictionUser.log.info('google one tap initialize', {
      data: {
        clientId: fictionUser.googleClientId,
        state_cookie_domain,
        settings,
      },
    })
    const initializeArgs = {
      client_id: fictionUser.googleClientId,
      callback: async (credentialResponse: CredentialResponse) => {
        fictionUser.log.info('google one tap callback', {
          data: credentialResponse,
        })
        await handleGoogleCredentialResponse(credentialResponse, settings)
      },
      auto_select: autoSignIn, // auto login
      cancel_on_tap_outside: true,
      context: 'signin',
      state_cookie_domain,
      prompt_parent_id: promptParentId,
    } as const

    fictionUser.log.info('initializing', {
      data: { initializeArgs, ...settings },
    })

    if (!window.google.accounts?.id)
      throw new Error('google.accounts.id not loaded')

    window.google.accounts.id.initialize(initializeArgs)

    if (el) {
      const theme = isDarkMode ? 'filled_black' : 'outline'
      window.google.accounts.id.renderButton(el, { theme, size: 'large', width: 290 })
    }
    if (showPrompt)
      window.google.accounts.id.prompt()
  }
}
