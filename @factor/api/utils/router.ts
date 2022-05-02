export default {}

// import {
//   createMemoryHistory,
//   createRouter,
//   createWebHistory,
//   RouteRecordRedirectOption,
//   Router,
//   RouteRecordRaw,
//   RouteLocationNormalizedLoaded,
//   useRoute,
//   useRouter,
// } from "vue-router"
// import type { RouteLocation } from "vue-router"
// import type { Component } from "vue"
// import { AuthCallback } from "../plugin-user/types"
// import type { FactorPlugin } from "../plugin"
// import { getGlobal, setGlobal } from "./global"
// import { isNode } from "./vars"
// import { sortPriority, toLabel } from "./utils"

// /**
//  * Creates a vue router
//  */
// export const createFactorRouter = (): Router => {
//   const history = !isNode() ? createWebHistory() : createMemoryHistory()

//   const router = createRouter({
//     history,
//     routes: [],
//     scrollBehavior: (to, from, savedPosition) => {
//       if (savedPosition) {
//         return savedPosition
//       } else if (to != from) {
//         return { top: 0 }
//       }
//     },
//   })

//   /**
//    * Add query hook functionality
//    * uses _action param to call a hook from query
//    */
//   router.afterEach(async () => {})

//   return router
// }

// /**
//  * Gets the primary router and creates it if it doesn't exist
//  */
// export const getRouter = (): Router => {
//   let router: Router | undefined = getGlobal("router")
//   if (!router) {
//     router = createFactorRouter()
//     setGlobal("router", router)
//   }
//   return router
// }

// export { useRoute, useRouter }

// /**
//  * Adds multiple routes to the router
//  */
// export const addRoutes = (routes: RouteRecordRaw[]): Router => {
//   const router = getRouter()
//   routes.forEach((r) => {
//     router.addRoute(r)
//   })

//   return router
// }

// const convertAppRouteToRoute = (list: AppRoute<string>[]): RouteRecordRaw[] => {
//   return list
//     .map((li) => {
//       if (li.external) {
//         return
//       } else if (!li.component) {
//         throw new Error(`component missing in internal route: ${li.name}`)
//       }

//       const out: RouteRecordRaw = {
//         path: li.path,
//         name: li.name,
//         component: li.component,
//         meta: { niceName: li.niceName, menus: li.menus, ...li.meta },
//         props: { services: li.services },
//       }

//       if (li.children.length > 0) {
//         out.children = convertAppRouteToRoute(li.children) // recursive
//       }

//       return out
//     })
//     .filter(Boolean) as RouteRecordRaw[]
// }

// export const generateRoutes = (
//   routeList?: AppRoute<string>[],
// ): RouteRecordRaw[] => {
//   const list = sortPriority(routeList || [])

//   const mapped: Record<string, AppRoute<string>> = {}

//   list.forEach((r) => {
//     if (r.parent) {
//       const children = mapped[r.parent]?.children ?? []
//       mapped[r.parent].children = [...children, r]
//     } else {
//       mapped[r.name] = r
//     }
//   })

//   return convertAppRouteToRoute(Object.values(mapped))
// }

// export const setupRouter = (routeList: AppRoute<string>[]): Router => {
//   const vueRouteList = generateRoutes(routeList)

//   return addRoutes(vueRouteList)
// }

// /**
//  * @deprecated Get the current route being viewed
//  */
// export const currentRoute = (): RouteLocationNormalizedLoaded => {
//   return getRouter().currentRoute.value
// }

// /**
//  * Does the current route require authentication?
//  */
// export const routeRequiresAuth = (): boolean => {
//   const route = getRouter().currentRoute.value

//   return route
//     ? route.matched.some((_) => _.meta.auth || _.meta.authRedirect)
//     : false
// }
