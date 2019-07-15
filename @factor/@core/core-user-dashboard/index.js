export default Factor => {
  return new (class {
    constructor() {
      this.filters()
    }

    filters() {
      const icon = Factor.FACTOR_TARGET == "app" ? require("./img/users.svg") : ""
      Factor.$filters.add("dashboard-routes", _ => {
        _.push({
          path: "account",
          component: () => import("./account"),
          meta: {
            postType: "user"
          }
        })

        return _
      })
      Factor.$filters.add("dashboard-menu", _ => {
        _.push({
          group: "account",
          path: "account",
          name: "Your Account",
          icon
        })

        return _
      })

      Factor.$filters.add("post-types", _ => {
        _.push({
          type: "user",
          base: "@",
          icon,
          populated: ["covers"],
          nameIndex: "Users",
          nameSingle: "User",
          namePlural: "Users",
          accessLevel: 500,
          list: () => import("./list"),
          edit: () => import("./edit.vue"),
          add: false
        })

        return _
      })
    }
  })()
}
