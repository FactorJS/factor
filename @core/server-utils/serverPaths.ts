import glob from "glob"
import path from "path"

export const cwd = (): string => process.env.FACTOR_CWD ?? process.cwd()
export const packagePath = (): string => path.resolve(cwd(), "package.json")

const mainFile = (): string => {
  const pkg = require(packagePath())
  return pkg.main ?? "index"
}
export const sourceFolder = (): string => {
  return path.dirname(path.resolve(cwd(), mainFile()))
}
export const distFolder = (): string => path.join(cwd(), "dist")
export const distServer = (): string => path.join(distFolder(), "server")
export const distClient = (): string => path.join(distFolder(), "client")

/**
 * Require a path if it exists and silence any not found errors if it doesn't
 */
export const requireIfExists = <T = unknown>(mod: string): T | undefined => {
  let result: T | undefined = undefined
  try {
    result = require(mod)
  } catch (error: any) {
    const e: NodeJS.ErrnoException = error
    if (e.code != "MODULE_NOT_FOUND") {
      throw error
    } else {
      // get module missing in error message
      // https://stackoverflow.com/a/32808869
      const m = error.message.match(/(?<=')(.*?)(?=')/g)

      if (!mod.includes(m)) {
        throw error
      }
    }
  }

  return result
}

export const resolveIfExists = (mod: string): string | undefined => {
  let result: string | undefined = undefined
  try {
    result = require.resolve(mod)
  } catch (error: any) {
    const e: NodeJS.ErrnoException = error
    if (e.code != "MODULE_NOT_FOUND") {
      throw error
    } else {
      // get module missing in error message
      // https://stackoverflow.com/a/32808869
      const m = error.message.match(/(?<=')(.*?)(?=')/g)

      if (!mod.includes(m)) {
        throw error
      }
    }
  }

  return result
}

export const resolveCwd = (p: string): string => path.resolve(cwd(), p)
export const resolveSrc = (p: string): string => path.resolve(sourceFolder(), p)
export const resolveDist = (p: string): string => path.resolve(distFolder(), p)

export const getFaviconPath = (): string => {
  let faviconPath = ""
  const paths = [
    `${sourceFolder()}/favicon*`,
    `${sourceFolder()}/**/favicon*`,
    `${sourceFolder()}/icon*`,
  ]

  paths.some((paths) => {
    const r = glob.sync(paths)

    if (r && r.length > 0) {
      faviconPath = r[0]
      return true
    } else {
      return false
    }
  })

  if (!faviconPath) {
    faviconPath = path.join(
      path.dirname(require.resolve("@factor/entry")),
      "favicon.png",
    )
  }

  return faviconPath
}