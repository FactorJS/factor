import execa from "execa"
import fs from "fs-extra"
import glob from "glob"
import Handlebars from "handlebars"
import minimist, { ParsedArgs } from "minimist"

import { workspaces } from "../../package.json"

/**
 * Register a helper to print raw JS objects
 */
Handlebars.registerHelper("json", function (context) {
  return JSON.stringify(context, null, 4)
})
/**
 * Checks whether the working directory has uncommitted changes
 */
export const isGitDirty = (): boolean => {
  const { stdout } = execa.commandSync("git status --short")

  return stdout.length > 0 ? true : false
}
/**
 * Create a parsed file from it's template path and tracker config
 */
export const createFile = (
  templatePath: string,
  settings: Record<string, string> = {},
): string => {
  const html = fs.readFileSync(templatePath, "utf8")
  const template = Handlebars.compile(html)
  return template(settings)
}

/**
 * Get all workspace packages
 */
export const getPackages = (
  options: { publicOnly?: boolean } = {},
): string[] => {
  let folders: string[] = []
  const { publicOnly } = options

  workspaces.forEach((w) => {
    const files = glob
      .sync(w)
      .map((f): string => {
        const manifestPath = `../../${f}/package.json`
        if (!fs.statSync(f).isDirectory()) return ""
        else {
          const manifest = require(manifestPath)
          return publicOnly && manifest.private ? "" : manifest.name
        }
      })
      .filter((_) => _)

    folders = [...folders, ...files]
  })

  return folders
}
/**
 * Get last commit if we are in a git repository
 */
export const getCommit = (length = 100): string => {
  return fs.existsSync(`${process.cwd()}/.git`)
    ? execa.sync("git", ["rev-parse", "HEAD"]).stdout.slice(0, length)
    : "no-repo"
}
/**
 * Get CLI args
 */
export const getArgs = (): ParsedArgs => {
  return minimist(process.argv.slice(2))
}