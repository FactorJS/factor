/**
 * @jest-environment jsdom
 */

import Factor from "@factor/core"
import extendApp from "@factor/extend"

import FactorStore from "@factor/app/store"
let store
describe("store", () => {
  beforeAll(async () => {
    await extendApp().extend()
  })
  it("loads correctly", () => {
    window.__INITIAL_STATE__ = { test: 123 }
    store = FactorStore(Factor).create()
    expect(Factor.$store).toBeTruthy()

    expect(store.state.test).toBe(123)
  })

  it("add/val helpers", async () => {
    store.add("something", "else")

    const v = store.val("something")

    expect(v).toBe("else")

    expect(store.state.something).toBe("else")
  })
})
