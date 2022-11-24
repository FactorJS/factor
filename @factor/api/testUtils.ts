import path from "path"
import { createRequire } from "module"
import { expect, it, describe } from "vitest"
import { execaCommandSync, execaCommand, ExecaChildProcess } from "execa"
import { chromium, Browser, Page } from "playwright"
import { expect as expectUi, Expect } from "@playwright/test"
import fs from "fs-extra"
import { FactorUi } from "@factor/ui"
import { version as factorVersion } from "./package.json"
import { FactorPlugin, FactorObject } from "./plugin"
import {
  safeDirname,
  randomBetween,
  stringify,
  camelToKebab,
  vue,
} from "./utils"
import { log } from "./plugin-log"
import { EnvVar, runServicesSetup } from "./plugin-env"
import { FullUser } from "./plugin-user"
import { PackageJson } from "./types"
import EmptyApp from "./resource/EmptyApp.vue"
import {
  FactorEnv,
  FactorApp,
  FactorServer,
  FactorEmail,
  FactorRouter,
  FactorDb,
  FactorUser,
} from "."
export * from "vitest"
export * as playwright from "playwright"

const require = createRequire(import.meta.url)

const repoRoot = safeDirname(import.meta.url, "../..")

const getModuleName = (cwd: string): string => {
  const pkg = require(`${cwd}/package.json`) as PackageJson
  return pkg.name
}

export const getTestCwd = (): string => {
  return path.dirname(require.resolve("@factor/www/package.json"))
}

export const getTestEmail = (): string => {
  const key = Math.random().toString().slice(2, 12)
  return `arpowers+${key}@gmail.com`
}
// regex all numbers and letters
const rep = (nm: string, val: string = "") =>
  `[${nm}:${String(val).replace(/[\dA-Za-z]/g, "*")}]`
const snapString = (
  value: unknown,
  key?: string,
  opts: { hideKeys?: string[] } = {},
): string => {
  const hideKeys = opts.hideKeys ?? []
  const val = String(value)

  let out = val

  if (key && hideKeys.includes(key)) return "hidden"

  if (key?.endsWith("Id") && val) {
    out = rep("id", val)
  } else if ((key?.endsWith("Url") || key?.endsWith("Urls")) && val) {
    out = rep("url", val)
  } else if (
    (key?.endsWith("At") ||
      key?.endsWith("Iso") ||
      key == "duration" ||
      key == "timestamp") &&
    val
  ) {
    out = rep("dateTime")
  } else if (key?.endsWith("Name") && val) {
    out = rep("name", val)
  } else if (key?.toLowerCase().endsWith("email") && val) {
    out = rep("email", val)
  } else if (val.length === 32 || key?.endsWith("Code")) {
    out = rep("hash", val)
  } else if (key == "latitude" || key == "longitude" || key == "ip") {
    out = rep("geo", val)
  }

  return out
}

export const snap = (
  obj?: Record<any, any> | Record<any, any>[] | unknown[] | undefined,
  opts: { hideKeys?: string[] } = {},
  parentKey?: string,
): Record<string, unknown> | unknown[] | undefined => {
  if (!obj) return undefined

  if (Array.isArray(obj)) {
    return obj.map((o) => {

      const res =
        typeof o === "object" && o
          ? snap(o as Record<string, unknown>, opts)
          : snapString(o, parentKey, opts)

      return res
    })
  }

  const newObj = {} as Record<string, unknown>

  for (const key in obj) {
    const value = obj[key] as unknown
    if (value && typeof value === "object" && !(value instanceof Date)) {
      newObj[key] = snap(value as Record<string, unknown>, opts, key)
    } else if (value) {
      newObj[key] = snapString(value, key, opts)
    } else {
      newObj[key] = value
    }
  }

  const out = JSON.parse(stringify(newObj)) as Record<string, any>

  return out
}

export type TestServerConfig = {
  _process: ExecaChildProcess
  appPort: number
  serverPort: number
  appUrl: string
  serverUrl: string
  destroy: () => Promise<void>
  browser: Browser
  page: Page
  expectUi: Expect
}

export type TestUtilServices = {
  factorEnv: FactorEnv
  factorApp: FactorApp
  factorRouter: FactorRouter
  factorServer: FactorServer
  factorDb: FactorDb
  factorUser: FactorUser
  factorEmail: FactorEmail
}

export type InitializedTestUtils = {
  user: FullUser
  token: string
  email: string
  password: string
}

export type RawTestUtils = Awaited<ReturnType<typeof createTestUtilServices>>

export type TestUtils = {
  init: (
    services?: Record<string, FactorPlugin>,
  ) => Promise<InitializedTestUtils>
  initialized?: InitializedTestUtils
  close: () => void
  [key: string]: any
} & RawTestUtils

export type TestUtilSettings = {
  serverPort?: number
  appPort?: number
  cwd?: string
  mainFilePath?: string
  envFiles?: string[]
  rootComponent?: vue.Component
  uiPaths?: string[]
  envVars?: () => EnvVar<string>[]
  version?: string
}

/**
 * Runs services 'setup' functions
 * Creates a new user
 */
export const initializeTestUtils = async (
  service: TestUtilServices & { [key: string]: FactorPlugin | FactorObject },
) => {
  await runServicesSetup({ service })

  const { factorUser, factorServer, factorDb, factorEmail } = service

  const promises = [
    factorDb.init(),
    factorEmail.init(),
    factorServer.createServer({ factorUser }),
  ]

  await Promise.all(promises)

  const email = getTestEmail()
  const password = "test"

  const r = await factorUser.queries.ManageUser.serve(
    {
      fields: { email, password, emailVerified: true },
      _action: "create",
    },
    { server: true, caller: "initializeTestUtilsCreate" },
  )

  const user = r.data
  const token = r.token

  if (!token) throw new Error("token not returned")
  if (!user) throw new Error("no user created")

  factorUser.setCurrentUser({ user, token })

  factorUser.setUserInitialized()

  return { user, token, email, password }
}

export type TestBaseCompiled = {
  commands: string
  vars: string
  routes: string
  menus: string
  [key: string]: any
}

export const createTestUtilServices = async <
  S extends TestBaseCompiled = TestBaseCompiled,
>(
  opts?: TestUtilSettings,
) => {
  const {
    serverPort = randomBetween(10_000, 20_000),
    appPort = randomBetween(1000, 10_000),
    cwd = safeDirname(import.meta.url),
    mainFilePath,
    envFiles = [],
    rootComponent = EmptyApp,
    uiPaths = [],
    version = factorVersion,
  } = opts || {}

  const defaultEnvFile = path.join(repoRoot, "./.env")

  const factorEnv = new FactorEnv<S>({
    envFiles: [defaultEnvFile, ...envFiles],
    cwd,
    mainFilePath,
    appName: "Test App",
    appEmail: "arpowers@gmail.com",
    id: "test",
    version,
  })

  const factorServer = new FactorServer({
    port: serverPort,
    serverName: "testUtilServer",
    factorEnv,
  })

  const factorRouter = new FactorRouter<S>({ factorEnv })

  const factorApp = new FactorApp({
    port: appPort,
    rootComponent,
    factorRouter,
    factorServer,
    factorEnv,
    uiPaths,
    isTest: true,
  })
  const factorDb = new FactorDb({
    factorEnv,
    connectionUrl: factorEnv.var("POSTGRES_URL"),
  })

  const factorEmail = new FactorEmail({
    factorEnv,
    appUrl: factorApp.appUrl,
  })

  const factorUser = new FactorUser({
    factorEnv,
    factorDb,
    factorEmail,
    googleClientId: factorEnv.var("GOOGLE_CLIENT_ID"),
    googleClientSecret: factorEnv.var("GOOGLE_CLIENT_SECRET"),
    factorServer,
    mode: "development",
    tokenSecret: "test",
  })

  const services = {
    factorEnv,
    factorApp,
    factorRouter,
    factorServer,
    factorUser,
    factorDb,
    factorEmail,
    factorUi: new FactorUi({ factorApp, factorEnv }),
  }

  return services
}

export const createTestUtils = async (opts?: TestUtilSettings) => {
  const testUtilServices = await createTestUtilServices(opts)

  return {
    init: () => initializeTestUtils(testUtilServices),
    ...testUtilServices,
    close: () => {},
  }
}

export const createTestServer = async (
  params: {
    cwd?: string
    moduleName?: string
    headless?: boolean
    slowMo?: number
    args?: Record<string, string | number>
  } & TestUtilSettings,
): Promise<TestServerConfig> => {
  const {
    serverPort = randomBetween(10_000, 20_000),
    appPort = randomBetween(1000, 10_000),
    args = {},
  } = params || {}

  const { headless = true, slowMo } = params
  let { moduleName } = params
  const cwd = params.cwd || process.cwd()

  moduleName = moduleName || getModuleName(cwd)

  let _process: ExecaChildProcess | undefined

  const additionalArgs = Object.entries(args).map(([key, val]) => {
    return `--${camelToKebab(key)} ${val}`
  })

  const cmd = [
    `npm exec -w ${moduleName} --`,
    `factor run dev`,
    `--server-port ${serverPort}`,
    `--www-port ${appPort}`,
    ...additionalArgs,
  ]

  const runCmd = cmd.join(" ")

  log.info("createTestServer", `Creating test server for ${moduleName}`, {
    data: { cwd: process.cwd(), cmd: runCmd },
  })

  await new Promise<void>((resolve) => {
    _process = execaCommand(runCmd, {
      env: { IS_TEST: "1" },
    })
    _process.stdout?.pipe(process.stdout)
    _process.stderr?.pipe(process.stderr)

    _process.stdout?.on("data", (d: Buffer) => {
      const out = d.toString()

      if (out.includes("[ready]")) resolve()
    })
  })

  if (!_process) throw new Error("Could not start dev server")

  const browser = await chromium.launch({ headless, slowMo })
  const browserContext = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36",
  })
  const page = await browserContext?.newPage()

  return {
    _process,
    serverPort,
    appPort,
    appUrl: `http://localhost:${appPort}`,
    serverUrl: `http://localhost:${serverPort}`,
    browser,
    page,
    expectUi,
    destroy: async () => {
      if (_process) {
        _process.cancel()
        _process.kill()
      }
      await browser.close()
    },
  }
}

export const appBuildTests = (config: {
  moduleName?: string
  cwd?: string
}): void => {
  let { cwd = "", moduleName } = config
  const serverPort = String(randomBetween(1000, 9000))
  const appPort = String(randomBetween(1000, 9000))

  cwd = cwd || path.dirname(require.resolve(`${moduleName}/package.json`))

  moduleName = moduleName || getModuleName(cwd)

  if (!cwd) throw new Error("cwd is not defined")

  describe(`build app: ${moduleName}`, () => {
    it("prerenders", () => {
      const command = `npm exec -w ${moduleName} -- factor run render --server-port ${serverPort} --www-port ${appPort}`

      log.info("appBuildTests", "running render command", { data: command })
      const r = execaCommandSync(command, {
        env: { IS_TEST: "1", TEST_ENV: "unit" },
        timeout: 30_000,
      })

      if (!r.stdout.includes("built successfully")) {
        log.warn("build test", "build result", { data: { stdout: r.stdout } })
      }

      expect(r.stdout).toContain("built successfully")
      fs.existsSync(path.join(cwd, "./dist/static"))
    })

    it("runs dev", () => {
      const r = execaCommandSync(
        `npm exec -w ${moduleName} -- factor run dev --exit --server-port ${serverPort} --www-port ${appPort}`,
        {
          env: { IS_TEST: "1", TEST_ENV: "unit" },
          timeout: 20_000,
        },
      )

      expect(r.stdout).toContain(`[ ${serverPort} ]`)
      expect(r.stdout).toContain(`[ ${appPort} ]`)
      expect(r.stdout).toContain("[ready]")
    })

    it("renders", async () => {
      const { destroy, page, appUrl } = await createTestServer({ moduleName })

      const errorLogs: string[] = []
      page.on("console", (message) => {
        if (message.type() === "error") {
          errorLogs.push(message.text())
        }
      })

      page.on("pageerror", (err) => {
        errorLogs.push(err.message)
      })
      await page.goto(appUrl)

      const html = await page.innerHTML("body")

      if (errorLogs.length > 0) {
        console.error(errorLogs)
      }

      if (errorLogs.length > 0) {
        errorLogs.forEach((e) => console.error(e))
      }

      expect(errorLogs.length).toBe(0)
      expect(html).toBeTruthy()

      await destroy()
    }, 20_000)
  })
}
