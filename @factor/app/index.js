import { setting } from "@factor/tools/settings"
import { addFilter, applyFilters, addCallback } from "@factor/tools/filters"
import { onEvent } from "@factor/tools/events"
export * from "./extend-app"

let clientIsMountedPromise = waitForMountApp()

// Allows components to definitively wait for client to init
// otherwise we might throw hydration errors
export async function appMounted(callback) {
  await clientIsMountedPromise

  if (callback) callback()

  return true
}

function waitForMountApp() {
  return new Promise(resolve => onEvent("app-mounted", () => resolve()))
}

addCallback("initialize-app", () => {
  const factorError404 = setting("app.components.error404")
  const factorContent = setting("app.components.content")

  if (!factorError404 || !factorContent) {
    throw new Error("core components missing")
  }

  addFilter("routes", _ => {
    const contentRoutes = applyFilters("content-routes", [
      {
        name: "forbidden",
        path: "/forbidden",
        component: factorError404,
        meta: { error: 403 }
      }
    ]).filter((route, index, self) => {
      // remove duplicate paths
      const lastIndexOf = self.map(_ => _.path).lastIndexOf(route.path)
      return index === lastIndexOf
    })

    _.push({
      path: "/",
      component: factorContent,
      children: contentRoutes
    })

    _.push({
      path: "*",
      component: factorContent,
      children: applyFilters("content-routes-unmatched", [
        {
          name: "notFound",
          path: "*",
          component: factorError404,
          meta: { error: 404 }
        }
      ]),
      priority: 3000
    })

    return _
  })
})
