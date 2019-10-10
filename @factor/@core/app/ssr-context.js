// This configures the context information needed to SSR the page
// Add lifecycle filters that allow plugins to control the context
export async function handleContext(Factor, { context, app, router, store }) {
  const { url } = context

  const { fullPath } = router.resolve(url).route

  // Account for redirects
  router.push(fullPath !== url ? fullPath : url).catch(error => console.error(error))

  context = Factor.$filters.apply("ssr-context-init", context, {
    app,
    router,
    store
  })

  // Wait until router has resolved async imports
  // https://router.vuejs.org/api/#router-onready
  await new Promise((resolve, reject) => {
    router.onReady(() => resolve(true), reject)
  })

  const ssrConfig = {
    context,
    fullPath,
    matchedComponents: router.getMatchedComponents(fullPath),
    app,
    router,
    store
  }

  await Factor.$filters.run("ssr-context-callbacks", ssrConfig)

  context = Factor.$filters.apply("ssr-context-ready", context, ssrConfig)

  // Add this last as the final "state" of the server context should always be rendered to page
  context.state = store.state

  return context
}
