import dataUtility from "./plugins/plugin-data"
import { addCallback, setting } from "@factor/tools"
export default Factor => {
  return new (class {
    constructor() {
      // Get plugins - try #1a
      //this.addPlugins()

      this.addFilters()

      // Get plugins - try #2
      // addCallback("site-prefetch", async () => {
      //   const list = await dataUtility().getReadme()

      //   storeItem("myPlugins", list)

      //   return list
      // })
    }

    // Get plugins - try #1b
    // addPlugins() {
    //   addCallback("site-prefetch", async () => {
    //     const list = await dataUtility().getReadme()

    //     storeItem("myPlugins", list)
    //   })
    // }

    async addFilters() {
      // Setup plugins post type
      // // Setup Plugins Post Type
      // const baseRoute = setting("plugins.postRoute")

      // addFilter("post-types", _ => {
      //   _.push({
      //     postType: "plugins",
      //     baseRoute,
      //     //icon: require("./img/posts.svg"),
      //     model: "PluginPost",
      //     nameIndex: "Plugins",
      //     nameSingle: "Plugin",
      //     namePlural: "Plugins"
      //   })

      //   return _
      // })

      // Register doc routes for sitemap
      addFilter("after-first-server-extend", () => {
        const base = setting("docs.base")
        const pages = setting("docs.pages")
        const canonical = pages
          .map(p => {
            return p.doc
              ? {
                  path: `/${base}/${p.doc}`,
                  component: () => import("./page-docs")
                }
              : ""
          })
          .filter(_ => _)

        // Add canonical routes (sitemaps, etc)
        Factor.$router.addRoutes(canonical)
      })

      addFilter("page-templates", _ => {
        return _.concat([
          {
            _id: "default",
            component: () => import("./page-template-default.vue")
          }
        ])
      })

      addFilter("content-routes", _ => {
        const base = setting("docs.base")

        //const pluginsIndex = setting("plugins.layout.index")
        //const pluginsSingle =  setting("plugins.layout.single")

        return [
          ..._,
          // {
          //   path: "/plugins",
          //   component: () => import("./page-plugins")
          // },
          {
            path: "/themes",
            component: () => import("./v-themes")
          },
          {
            path: "/compare",
            component: () => import("./page-compare")
          },
          {
            path: "/",
            component: () => import("./home/v-home")
          },
          {
            path: `/${base}`,
            component: () => import("./page-docs")
          },
          {
            path: `/${base}/:doc`,
            component: () => import("./page-docs")
          },
          {
            path: `/plugins`,
            component: () => import("./plugins/plugins-wrap"),
            children: [
              {
                path: `/`,
                component: () => import("./plugins/v-plugins")
              },
              {
                path: `/plugin/:slug`,
                component: () => import("./plugins/plugin-single")
              }
            ]
          }
        ]
      })
    }
  })()
}
