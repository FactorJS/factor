import { addFilter, addCallback, pushToFilter } from "@factor/tools"
import Factor from "@factor/core"

addCallback("ssr-context-callbacks", ({ matchedComponents }) =>
  matchedComponents.forEach(_ => setRouteClass(_))
)

addFilter("before-app", () => {
  if (process.env.FACTOR_SSR !== "server") manageClient()
})

addFilter("register-global-observables", __ => {
  return { ...__, routeClass: [] }
})

pushToFilter("observable-class-keys", "routeClass")

function setRouteClass(options) {
  if (!options) return

  const { routeClass } = options
  if (routeClass) {
    let routeClassArray =
      typeof routeClass === "function" ? routeClass.call() : routeClass

    if (typeof routeClassArray == "string") routeClassArray = [routeClassArray]
    else if (!routeClassArray) return

    Factor.$globals.routeClass.push(...routeClassArray)
  }
}

function manageClient() {
  addCallback("client-route-after", () => {
    Factor.$globals.routeClass = []
  })

  Factor.mixin({
    created() {
      setRouteClass(this.$options)
    },
    watch: {
      $route: {
        handler: function() {
          setRouteClass(this.$options)
        }
      },
      immediate: true
    }
  })
}
