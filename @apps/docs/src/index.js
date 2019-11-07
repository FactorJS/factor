import "./extend/extension-server"
import { addFilter, setting, addRoutes } from "@factor/tools"

// Register doc routes for sitemap
addFilter("after-first-server-extend", () => {
  const base = setting("docs.base")
  const pages = setting("docs.pages")
  const canonical = pages
    .map(p => {
      return p.doc
        ? { path: `/${base}/${p.doc}`, component: () => import("./page-docs.vue") }
        : ""
    })
    .filter(_ => _)

  // Add canonical routes (sitemaps, etc)
  addRoutes(canonical)
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

  return [
    ..._,
    {
      path: "/compare",
      component: () => import("./page-compare.vue")
    },
    {
      path: "/",
      component: () => import("./home/v-home.vue")
    },
    {
      path: `/${base}`,
      component: () => import("./page-docs.vue")
    },
    {
      path: `/${base}/:doc`,
      component: () => import("./page-docs.vue")
    },
    {
      path: `/themes`,
      component: () => import("./extend/theme-wrap.vue"),
      children: [
        {
          path: `/`,
          component: () => import("./extend/theme-index.vue")
        },
        {
          path: `/theme/view`,
          component: () => import("./extend/theme-single.vue")
        }
      ]
    },
    {
      path: `/plugins`,
      component: () => import("./extend/plugin-wrap.vue"),
      children: [
        {
          path: `/`,
          component: () => import("./extend/plugin-index.vue")
        },
        {
          path: `/plugin/view`,
          component: () => import("./extend/plugin-single.vue")
        }
      ]
    }
  ]
})
