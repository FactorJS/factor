import Factor from "vue"
import FactorStore from "vuex"
Factor.use(FactorStore)

export default Factor => {
  return new (class {
    constructor() {}
    create() {
      const root = {
        // allow direct state changes: https://vuex.vuejs.org/api/#strict
        strict: false,
        state: () => {},
        getters: {
          getItem: state => item => state[item]
        },
        mutations: {
          setItem: (state, { item, value }) => {
            Factor.set(state, item, value)
          }
        },

        modules: Factor.$filters.apply("stores", {})
      }

      const store = new FactorStore.Store(root)

      // prime the store with server-initialized state.
      // the state is determined during SSR and inlined in the page markup.
      // Make sure this is done after store modules are setup and added
      if (typeof window != "undefined" && window.__INITIAL_STATE__) {
        store.replaceState(window.__INITIAL_STATE__)
      }

      // Factor helper function for global/flat store pattern
      store.add = (item, value) => store.commit("setItem", { item, value })

      store.val = key => store.getters["getItem"](key)

      Factor.$store = store

      return store
    }
  })()
}
