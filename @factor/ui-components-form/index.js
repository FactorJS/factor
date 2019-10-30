export default Factor => {
  return new class {
    constructor() {
      this.registerComponents()
    }

    registerComponents() {
      Factor.$filters.add("components", _ => {
        _["factor-form"] = () => import("./el/form")
        _["factor-input-email"] = () => import("./el/email")
        _["factor-input-date"] = () => import("./el/date")
        _["factor-input-password"] = () => import("./el/password")
        _["factor-input-text"] = () => import("./el/text")
        _["factor-input-textarea"] = () => import("./el/textarea")
        _["factor-input-phone"] = () => import("./el/phone")
        _["factor-input-checkbox"] = () => import("./el/checkbox")
        _["factor-input-birthday"] = () => import("./el/birthday")

        _["factor-input-image-upload"] = () => import("./el/image-upload")

        _["factor-input-select"] = () => import("./el/select")

        _["factor-input-submit"] = () => import("./el/submit")

        _["factor-input-wrap"] = () => import("./el/wrap-input")

        return _
      })
    }
  }
}
