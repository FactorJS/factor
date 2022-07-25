/* eslint-disable no-console */
/**
 * Since many files use this logger, be careful for
 * circular dependencies
 */
import prettyoutput from "prettyoutput"
import consola from "consola"
import { HookType, runHooks } from "../utils/hook"
import { dayjs, chalk } from "../utils/libraries"
import { isDev, isRestart, isNode, isDebug } from "../utils/vars"
import { stringify } from "../utils/utils"

type Levels = "error" | "warn" | "info" | "debug" | "trace"

export type LogHelper = Record<
  Levels,
  (description: string, data?: unknown) => void
>

interface LoggerArgs {
  level: Levels
  context?: string
  description?: string
  data?: Record<string, any> | unknown
  error?: Error | unknown
  disableOnRestart?: boolean
  priority?: number
  color?: string
}

export type FactorLogHookDictionary = {
  logServer: { args: [LoggerArgs] }
}
type FactorLogSettings = {
  hooks?: HookType<FactorLogHookDictionary>[]
}
export class FactorLog {
  hooks: HookType<FactorLogHookDictionary>[]
  constructor(settings: FactorLogSettings = {}) {
    this.hooks = settings.hooks ?? []
  }

  setup = () => {}

  logLevel = {
    trace: { color: "#5233ff", priority: 5 },
    debug: { color: "#00BD0C", priority: 5 },
    info: { color: "#00ABFF", priority: 10 },
    warn: { color: "#ffa500", priority: 30 },
    error: { color: "#FF0000", priority: 40 },
  }

  addHook(hook: HookType<FactorLogHookDictionary>): void {
    this.hooks.unshift(hook)
  }

  private logBrowser(config: LoggerArgs): void {
    const { level, description, context, color, data, error } = config
    const shouldLog =
      isDev() ||
      (typeof localStorage !== "undefined" && localStorage.getItem("klog"))
        ? true
        : false

    if (shouldLog) {
      // eslint-disable-next-line no-console
      console.log(
        `%c${level}%c(${context ?? "???"}):`,
        `color: ${color}99;`,
        `color: ${color};`,
        description,
        data ?? "",
      )

      if (error) {
        console.error(error)
      }
    }
  }

  private refineDataRecursive(
    obj: Record<string, any>,
    depth = 0,
  ): Record<string, any> {
    depth++
    return Object.fromEntries(
      Object.entries(obj).map(([k, v]) => {
        if (dayjs.isDayjs(v)) {
          v = `DAYJS: ${v.toISOString()}`
        } else if (
          typeof v === "object" &&
          v &&
          Object.keys(v as Record<string, any>).length > 0
        ) {
          const len = stringify(v)
          if (len.length > 10_000 && !process.env.DEBUG) {
            v = `LARGE OBJECT(${len.length}): ${len.slice(0, 100)}...`
          } else if (depth < 4) {
            v = this.refineDataRecursive(v as Record<string, any>, depth)
          }
        }

        return [k, v]
      }),
    )
  }

  private logServer(config: LoggerArgs): void {
    const {
      level,
      disableOnRestart,
      context,
      color = "#dddddd",
      data,
      description,
      error,
    } = config

    if (disableOnRestart && isRestart()) {
      return
    }
    const points: (string | number)[] = [chalk.hex(color).dim(level.padEnd(5))]

    points.push(chalk.hex(color)(`(${context ?? "???"}): `.padEnd(10)))

    if (description) points.push(description)

    console.log(points.join(""))

    // test

    if (data instanceof Error) {
      consola.error(data)
    } else if (
      typeof data == "object" &&
      data &&
      Object.keys(data).length > 0
    ) {
      console.log(
        prettyoutput(
          this.refineDataRecursive(data) as Record<string, any>,
          { colors: { number: "yellow" } },
          2,
        ),
      )
    }

    if (error) {
      consola.error(error)
    }

    runHooks<FactorLogHookDictionary, "logServer">({
      list: this.hooks,
      hook: "logServer",
      args: [config],
    }).catch(console.error)
  }

  l(config: LoggerArgs): void {
    const { level } = config

    config.priority = this.logLevel[level].priority
    config.color = this.logLevel[level].color

    if (isNode()) {
      if (config.priority < 10 && isDev() && !isDebug()) {
        config.data = undefined
      }

      this.logServer(config)
    } else {
      this.logBrowser(config)
    }
  }

  warn(
    context: string,
    description: string,
    config?: Omit<LoggerArgs, "level" | "context" | "description">,
  ): void {
    this.l({ level: "warn", context, description, ...config })
  }

  error(
    context: string,
    description: string,
    config?: Omit<LoggerArgs, "level" | "context" | "description">,
  ): void {
    this.l({ level: "error", context, description, ...config })
  }

  info(
    context: string,
    description: string,
    config?: Omit<LoggerArgs, "level" | "context" | "description">,
  ): void {
    this.l({ level: "info", context, description, ...config })
  }

  debug(
    context: string,
    description: string,
    config?: Omit<LoggerArgs, "level" | "context" | "description">,
  ): void {
    this.l({ level: "debug", context, description, ...config })
  }

  contextLogger = (context: string): LogHelper => {
    const out: Record<string, any> = {}

    const levels = Object.keys(this.logLevel) as Levels[]

    levels.forEach((level) => {
      out[level] = (
        description: string,
        config?: Omit<LoggerArgs, "level" | "context" | "description">,
      ): void => this.l({ level, description, context, ...config })
    })

    return out as LogHelper
  }
}

export const log = new FactorLog()
