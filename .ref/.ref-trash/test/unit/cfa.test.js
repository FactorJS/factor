import { dirname, resolve } from "path"

import { removeSync } from "fs-extra"
import { spawn } from "cross-spawn"
import { waitFor } from "@test/utils"
const keys = {
  up: "\u001B\u005B\u0041",
  down: "\u001B\u005B\u0042",
  enter: "\u000D",
  space: "\u0020"
}
describe.skip("create-factor-app", () => {
  beforeAll(() => {
    removeSync(resolve(__dirname, "test-files/generated"))
  })

  describe("cli", () => {
    it("asks for app name, email, url", async () => {
      const cwd = dirname(require.resolve("./test-files/init.json"))

      const __spawned = spawn("npx", ["create-factor-app", "generated"], {
        detached: true,
        cwd
      })

      const output = []
      __spawned.stdout.on("data", data => {
        output.push(data.toString())
      })

      __spawned.stderr.on("data", data => {
        output.push(`[err] ${data.toString()}`)
      })

      await waitFor(200)

      __spawned.stdin.write(`UNIT-TEST${keys.enter}`)

      await new Promise(resolve => {
        __spawned.on("close", () => resolve())
      })

      expect(output.join(" ")).toContain("cd ./generated")
    })
    it.todo("provides guidance on how to get started")
    it.todo("logs package version (needed in case of cache)")
    it.todo("asks if minimal or recommended app is desired")
    it.todo("asks theme should be installed")
  })

  describe("generated app", () => {
    it.todo("generates app correctly")
    it.todo("renders")
  })
})
