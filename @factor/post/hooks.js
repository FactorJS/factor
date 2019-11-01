import { prefetchPost } from "@factor/post"
import { addFilter, addCallback, registerOnFilter } from "@factor/tools"

addCallback("site-prefetch", _ => prefetchPost(_))
addCallback("client-route-before", _ => prefetchPost({ clientOnly: true, ..._ }))
registerOnFilter("components", "factor-post-edit", () => import("./el/edit-link.vue"))

addFilter("dashboard-routes", _ => {
  return [
    ..._,
    {
      path: "posts",
      component: () => import("./view/dashboard-list.vue")
    },
    {
      path: "posts/edit",
      component: () => import("./view/dashboard-edit.vue")
    },
    {
      path: "posts/:postType/edit",
      component: () => import("./view/dashboard-edit.vue")
    },
    {
      path: "posts/:postType/add-new",
      component: () => import("./view/dashboard-edit.vue")
    },
    {
      path: "posts/:postType",
      component: () => import("./view/dashboard-list.vue")
    }
  ]
})
