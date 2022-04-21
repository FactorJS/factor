import knex, { Knex } from "knex"
import knexStringcase from "knex-stringcase"
import { runHooks, HookType } from "@factor/api"
import { UserConfig } from "../config"
import { FactorPlugin } from "../config/plugin"

type FactorDbSettings = {
  connectionUrl?: string
  isTest?: boolean
  hooks?: HookType<HookDictionary>[]
}

export * from "./types"

export type HookDictionary = {
  onStart: { args: [FactorDb] }
}

export class FactorDb extends FactorPlugin<FactorDbSettings> {
  private db!: Knex
  connectionUrl!: URL
  isTest: boolean = false
  hooks: HookType<HookDictionary>[]
  constructor(settings: FactorDbSettings) {
    super(settings)

    this.hooks = settings.hooks || []

    if (this.utils.isBrowser()) return

    if (!settings.connectionUrl) {
      throw new Error("DB connectionUrl is required")
    }

    this.connectionUrl = new URL(settings.connectionUrl)

    const connection = {
      user: this.connectionUrl.username,
      host: this.connectionUrl.hostname,
      password: this.connectionUrl.password,
      port: Number.parseInt(this.connectionUrl.port),
      database: Number.parseInt(this.connectionUrl.pathname),
    }

    const knexOptions: Knex.Config & {
      recursiveStringcase: (obj: any, name: string) => boolean
    } = {
      client: "pg",
      version: "11.8",
      connection,
      // https://github.com/knex/knex/issues/3523#issuecomment-722574083
      pool: { min: 0, max: 4 },
      // change all nested snake_case results to camelCase
      recursiveStringcase: (_obj: any, _name: string): boolean => {
        return true
        // if (name.includes("project_events")) {
        //   return false
        // } else return true
      },
    }

    /**
     * Add stringcase lib that transforms snake_case and camelCase
     * if conflicts or issues occur, then best to change to a custom version at that time
     * https://www.npmjs.com/package/knex-stringcase
     */
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const opts: Knex.Config = knexStringcase(knexOptions) as Knex.Config

    this.db = knex(opts)
  }

  client(): Knex {
    if (this.utils.isBrowser()) {
      throw new Error("Cannot use client() in browser")
    }
    return this.db
  }

  async init(): Promise<void> {
    const imports = [
      import("./dbExtend"),
      import("./createTables"),
      import("./changeset"),
    ] as const

    const [{ extendDb }, { createTables }, { runChangeset }] =
      await Promise.all(imports)

    await extendDb(this.db)

    await createTables(this.db)

    await runChangeset(this.db)

    await runHooks<HookDictionary>({
      list: this.hooks,
      hook: "onStart",
      args: [this],
    })
  }

  public async setup(): Promise<UserConfig> {
    if (!this.isTest && !this.utils.isBrowser()) {
      await this.init()

      this.log.info("db connected", {
        data: {
          url: this.connectionUrl.hostname,
          port: `[ ${this.connectionUrl.port} ]`,
        },
      })
    }

    return { name: this.constructor.name }
  }
}