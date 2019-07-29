
export default Factor => {
  return new (class {
    constructor() {
      this.registerComponents()
    }

    registerComponents() {
      Factor.$filters.add("components", _ => {
        _["factor-client-only"] = () => import('vue-client-only')
        _["factor-link"] = () => import("./el/link")
        _["factor-btn"] = () => import("./el/btn")
        _["factor-modal"] = () => import("./el/modal")
        _["factor-lightbox"] = () => import("./el/lightbox")
        _["factor-avatar"] = () => import("./el/avatar")
        _["factor-loading-ring"] = () => import("./el/loading-ring")
        _["factor-pop"] = () => import("./el/pop")

        _["factor-menu"] = () => import("./el/menu")
        _["factor-tag"] = () => import("./el/tag")
        _["factor-icon"] = () => import("./el/icon")
        return _
      })
    }
  })()
}
