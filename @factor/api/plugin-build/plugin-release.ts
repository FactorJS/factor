import path from "path"
import fs from "fs"
import { ExecaChildProcess, ExecaError } from "execa"
import enquirer from "enquirer"
import semver, { ReleaseType } from "semver"
import { FactorEnv } from "../plugin-env"
import { log } from "../plugin-log"
import { getRequire } from "../utils"
import { PackageJson } from "../types"
import { FactorPlugin } from "../plugin"
import { isGitDirty, getPackages } from "./utils"

const { prompt } = enquirer

type FactorReleaseSettings = {
  factorEnv: FactorEnv
}

export class FactorRelease extends FactorPlugin<FactorReleaseSettings> {
  versionIncrements: ReleaseType[] = ["patch", "minor", "major", "prerelease"]
  factorEnv: FactorEnv
  constructor(settings: FactorReleaseSettings) {
    super(settings)
    this.factorEnv = settings.factorEnv
  }

  setup() {}

  currentVersion = (): string => {
    const pkg = getRequire()(
      path.resolve(process.cwd(), "./package.json"),
    ) as PackageJson
    return pkg.version
  }

  versionChoices = (): string[] => {
    const choices = this.versionIncrements.map((i) => {
      const v = semver.inc(this.currentVersion(), i, "beta") ?? ""
      return `${i} (${v})`
    })
    return [...choices, "custom"]
  }

  run = async (
    bin: string,
    args: string[],
    opts = {},
  ): Promise<ExecaChildProcess> => {
    const { execa } = await import("execa")
    return execa(bin, args, { stdio: "inherit", ...opts })
  }

  commit = async (
    ...commandArgs: [string, string[], Record<string, string>?]
  ): Promise<void | ExecaChildProcess> => {
    const [bin, args, opts] = commandArgs
    return await this.run(bin, args, opts)
  }

  updateDeps = (
    name: string,
    type: string,
    deps: Record<string, string>,
    version: string,
  ): Record<string, string> => {
    const packages = getPackages()
    Object.keys(deps).forEach((dep) => {
      if (packages.map((_) => _.name).includes(dep)) {
        this.log.info(`${name} > ${type} > ${dep}@${version}`)
        deps[dep] = version
      }
    })
    return deps
  }

  updatePackage = (cwd?: string, version?: string): void => {
    if (!cwd) throw new Error("package cwd is required")
    if (!version) throw new Error("version is required")

    const pkgPath = path.resolve(cwd, "package.json")
    const pkg = JSON.parse(fs.readFileSync(pkgPath).toString()) as PackageJson
    pkg.version = version

    const depType = ["dependencies", "devDependencies"]

    depType.map((t) => {
      const existing = pkg[t] as Record<string, string> | undefined
      if (existing) {
        pkg[t] = this.updateDeps(pkg.name, t, existing, version)
      }
    })

    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n")
  }

  updateVersions = async (version: string): Promise<void> => {
    this.log.info(`updating cross dependencies to v${version}`)
    const workspaceRoot = path.resolve(process.cwd())
    this.updatePackage(workspaceRoot, version)
    getPackages().forEach((p) => {
      if (!p.cwd) {
        log.error("updateVersions", `no package cwd`, { data: p })
      }
      this.updatePackage(p.cwd, version)
    })
  }

  publishPackage = async (pkg: PackageJson, version: string): Promise<void> => {
    if (pkg.private) return
    if (!pkg.cwd) throw new Error("package cwd is required")

    const access = pkg.publishConfig?.access ?? "restricted"

    this.log.info(`publishing ${pkg.name}...`)
    try {
      await this.commit("npm", ["publish", "--access", access], {
        cwd: pkg.cwd,
        stdio: "pipe",
      })

      this.log.info(`successfully published ${pkg.name}@${version}`)
    } catch (error: unknown) {
      const e = error as ExecaError
      if (/previously published/.test(e.stderr)) {
        this.log.info(`skipping already published: ${pkg.name}`)
      } else {
        throw e
      }
    }
  }

  runTests = async (): Promise<void> => {
    this.log.info(`Running tests...`)
    await this.run("npm", ["run", "test"])
  }

  ensureCleanGit = async (
    options: {
      withChanges?: boolean
    } = {},
  ): Promise<void> => {
    const dirty = await isGitDirty()
    if (dirty && options.withChanges) {
      await this.commit("git", ["add", "-A"])
      await this.commit("git", ["commit", "-m", `chore: pre-release`])
      await this.commit("git", ["push"])
    } else if (dirty) {
      throw new Error("commit changes before publishing")
    }
  }

  deployRoutine = async (options?: {
    skipTests?: boolean
    withChanges?: boolean
  }): Promise<void> => {
    const { skipTests, withChanges } = options || {}

    await this.ensureCleanGit({ withChanges })

    if (!skipTests) {
      await this.runTests()
    }

    const targetVersion = this.currentVersion()

    await this.updateVersions(targetVersion)
    await this.commit("git", ["add", "-A"])
    await this.commit("git", ["commit", "-m", `deploy: v${targetVersion}`])
    await this.commit("git", ["push"])
    await this.commit("git", ["checkout", "deploy"])
    await this.commit("git", ["merge", "dev"])
    await this.commit("git", ["push"])
    await this.commit("git", ["checkout", "dev"])
  }

  releaseRoutine = async (options?: {
    patch?: boolean
    skipTests?: boolean
    withChanges?: boolean
  }): Promise<void> => {
    const { patch, skipTests } = options || {}

    this.log.info(`publish new version [live]`)
    this.log.info(`current version: ${this.currentVersion()}`)

    await this.ensureCleanGit(options)

    let targetVersion: string | undefined

    if (patch) {
      targetVersion = semver.inc(this.currentVersion(), "patch") as string
    }

    if (!targetVersion) {
      // no explicit version, offer suggestions
      const { release } = await prompt<{ release: string }>({
        type: "select",
        name: "release",
        message: "Select release type",
        choices: this.versionChoices(),
      })

      if (release === "custom") {
        const { version } = await prompt<{ version: string }>({
          type: "input",
          name: "version",
          message: "Input custom version",
          initial: this.currentVersion(),
        })
        targetVersion = version
      } else {
        const v = release.match(/\((.*)\)/)
        targetVersion = v ? v[1] : undefined
      }
    }

    if (!targetVersion) {
      throw new Error("no target version")
    } else if (!semver.valid(targetVersion)) {
      throw new Error(`invalid target version: ${targetVersion}`)
    }

    if (!patch) {
      const { yes } = await prompt<{ yes: boolean }>({
        type: "confirm",
        name: "yes",
        message: `Releasing v${targetVersion}. Confirm?`,
      })

      if (!yes) return
    }

    if (!skipTests) {
      await this.runTests()
    }

    await this.updateVersions(targetVersion)

    this.log.info("building packages...")
    await this.run("npm", ["exec", "--", "factor", "run", "bundle"])

    this.log.info("generate changelog...")
    await this.run("npm", ["run", "changelog"])

    // commit version change
    const { stdout } = await this.run("git", ["diff"], { stdio: "pipe" })
    if (stdout) {
      this.log.info("committing changes...")
      await this.commit("git", ["add", "-A"])
      await this.commit("git", ["commit", "-m", `release: v${targetVersion}`])
    } else {
      this.log.info("no changes to commit")
    }

    // publish to npm
    this.log.info("publishing packages...")
    const publicPackages = getPackages({ publicOnly: true })

    for (const pkg of publicPackages) {
      await this.publishPackage(pkg, targetVersion)
    }

    this.log.info("pushing to origin...")

    await this.commit("git", ["tag", `v${targetVersion}`])
    await this.commit("git", [
      "push",
      "--no-verify",
      "origin",
      `refs/tags/v${targetVersion}`,
    ])
    await this.commit("git", ["push", "--no-verify"])

    await this.commit("gh", [
      "release create",
      targetVersion,
      "--generate-notes",
    ])
  }
}
