import { onEvent, addFilter, applyFilters, setting } from "@factor/tools"
export default () => {
  return new (class {
    constructor() {
      this.configure()
      this._initializedClient = this.initializeClient()
    }

    // Allows components to definitively wait for client to init
    // otherwise we might throw hydration errors
    async client(callback) {
      await this._initializedClient

      if (callback) callback()

      return true
    }

    initializeClient() {
      return new Promise(resolve => {
        onEvent("app-mounted", () => resolve())
      })
    }

    configure() {
      const error404 = setting("app.error404")
      const content = setting("app.content")

      if (!error404 || !content) {
        throw new Error("Factor core app components are undefined.")
      }

      addFilter("components", _ => {
        _["error-404"] = error404
        return _
      })

      addFilter("routes", _ => {
        const contentRoutes = applyFilters("content-routes", [
          {
            name: "forbidden",
            path: "/forbidden",
            component: error404,
            meta: { error: 403 }
          }
        ]).filter((route, index, self) => {
          // remove duplicate paths
          const lastIndexOf = self.map(_ => _.path).lastIndexOf(route.path)
          return index === lastIndexOf
        })

        _.push({
          path: "/",
          component: content,
          children: contentRoutes
        })

        _.push({
          path: "*",
          component: content,
          children: applyFilters("content-routes-unmatched", [
            {
              name: "notFound",
              path: "*",
              component: error404,
              meta: { error: 404 }
            }
          ]),
          priority: 3000
        })

        return _
      })
    }
  })()
}
