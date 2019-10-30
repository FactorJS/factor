import { runCallbacks, applyFilters } from "@factor/tools"
export default () => {
  return {
    data() {
      return {
        scrollClass: ""
      }
    },
    mounted() {
      this.setScrollClass()
      window.addEventListener("scroll", () => this.setScrollClass())
    },
    computed: {
      ui() {
        const { meta: { ui = "app" } = {} } =
          this.$route.matched.find(_ => _.meta.ui) || {}

        return `factor-${ui}`
      },
      classes() {
        // Use observables for classes as these can change at any time
        const siteClasses = applyFilters("observable-class-keys", [])
          .map(_ => this.$globals[_])
          .filter(_ => _)
          .join(" ")

        return [...siteClasses, this.scrollClass]
      },
      injectedComponents() {
        return applyFilters("site-components", {})
      }
    },

    serverPrefetch() {
      return runCallbacks("site-prefetch")
    },
    methods: {
      setScrollClass() {
        this.scrollClass = window.pageYOffset == 0 ? "top" : "scrolled"
      }
    },
    watch: {
      ui: {
        handler: function(to, from) {
          if (typeof document != "undefined") {
            const _el = document.documentElement
            _el.classList.remove(from)
            _el.classList.add(to)
          }
        }
      }
    }
  }
}
