import Factor from "vue"

import { createApp } from "@factor/app/app"
import { extendApp } from "@factor/app/extend-app"
import { pushToFilter } from "@factor/tools"
import { handleContext } from "@factor/app/ssr-context"
const { createRenderer } = require("vue-server-renderer")
const { dirname } = require("path")
const { readFileSync } = require("fs-extra")

import "../.."
import appSettings from "@factor/app/core-settings"
// import { mount, shallowMount, createLocalVue } from "@vue/test-utils"
// import { render, renderToString } from "@vue/server-test-utils"
let renderer
let App
describe("meta info server", () => {
  beforeAll(async () => {
    await extendApp({
      settings: { appSettings }
    })

    pushToFilter("routes", {
      path: "/meta",
      component: () => import("./meta.vue")
    })

    App = await createApp({ extend: false })

    const dir = dirname(require.resolve("@factor/app"))
    renderer = createRenderer({ template: readFileSync(`${dir}/index.html`, "utf-8") })
  })

  it.todo("renders default meta", async () => {
    const context = await handleContext(Factor, { context: { url: "/" }, ...App })

    const html = await renderer.renderToString(App.vm, context)

    expect(html).toContain(`charset="utf-8"`)
    expect(html).toContain(`name="viewport"`)
    expect(html).toContain(`lang="en"`)
  })

  it.todo("renders component meta", async () => {
    const context = await handleContext(Factor, { context: { url: "/meta" }, ...App })
    const html = await renderer.renderToString(App.vm, context)

    expect(html).toContain(`meta title template`)
    expect(html).toContain(`this is the description`)
    expect(html).toContain(`og:image`)
    expect(html).toContain(`lang="fr"`)
    expect(html).not.toContain(`lang="en"`)
  })
})
