import path from "path"
import { requireIfExists } from "./serverPaths"
import { deepMergeAll } from "@factor/api"
import { UserConfigServer } from "@factor/types"

const getDefaultServerVariables = (): Record<string, string> => {
  return {
    FACTOR_APP_NAME: "",
    FACTOR_APP_EMAIL: "",
    FACTOR_APP_URL: "",
    FACTOR_SERVER_URL: "",
    NODE_ENV: process.env.NODE_ENV || "",
  }
}

export const packageConfig = (): Record<string, any> => {
  return require(path.join(process.cwd(), "package.json"))
}

export const getFactorConfig = (
  config: UserConfigServer = {},
): UserConfigServer => {
  const { factor = {} } = packageConfig()

  const result = requireIfExists<{
    default: UserConfigServer
  }>(path.join(process.cwd(), "factor.config"))

  const configFile = result?.default || {}
  return deepMergeAll([
    { variables: getDefaultServerVariables },
    factor,
    configFile,
    config,
  ])
}

export const setAppGlobals = (
  config: UserConfigServer = {},
): Record<string, string> => {
  const { variables = {} } = getFactorConfig(config)

  Object.entries(variables).forEach(([key, value]) => {
    const finalValue = process.env[key] || value
    variables[key] = finalValue
    process.env[key] = finalValue
  })

  return variables
}