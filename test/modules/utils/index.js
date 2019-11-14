/* eslint-disable jest/no-export */
import { dirname, resolve } from "path"

import { factorize } from "@factor/cli/factorize"
export { default as getPort } from "get-port"
export { default as rp } from "request-promise-native"
import { removeSync } from "fs-extra"
import { generateLoaders } from "@factor/cli/extension-loader"
import { buildProductionApp } from "@factor/build/webpack-config"
import { createApp } from "@factor/app/app"

export const waitFor = ms => {
  return new Promise(resolve => setTimeout(resolve, ms || 0))
}

export const indexHtml = ({
  head = `<title>NOT SET</title>`,
  body = `<div id="app"></div>`
} = {}) => {
  return `<!DOCTYPE html><html><head>${head}</head><body>${body}</body></html>`
}

export const buildFixture = fixture => {
  process.env.FACTOR_CWD = dirname(require.resolve(fixture))
  process.env.FACTOR_ENV = "test"

  removeSync(resolve(process.env.FACTOR_CWD, ".factor"))
  removeSync(resolve(process.env.FACTOR_CWD, "dist"))

  test(`Build ${fixture}`, async () => {
    let error

    try {
      generateLoaders()
      await factorize()

      await buildProductionApp({ testing: true })
    } catch (error_) {
      error = error_
    }

    expect(error).not.toBeTruthy()
  }, 100000)
}

export const loadFixture = async fixture => {
  process.env.FACTOR_CWD = dirname(require.resolve(fixture))

  process.env.FACTOR_ENV = "test"

  await factorize()
  await createApp()
}
