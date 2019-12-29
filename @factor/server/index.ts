import { Server } from "http"
import { addCallback, runCallbacks, applyFilters, setting } from "@factor/api"
import {
  createBundleRenderer,
  BundleRenderer,
  BundleRendererOptions
} from "vue-server-renderer"
import { getPath } from "@factor/api/paths"
import destroyer from "destroyer"
import express from "express"
import fs from "fs-extra"
import log from "@factor/api/logger"
import LRU from "lru-cache"

import Vue from "vue"
import { developmentServer } from "./server-dev"
import { handleServerError, getServerInfo, logServerReady } from "./util"
import { loadMiddleware } from "./middleware"
import { RendererComponents } from "./types"

let __listening: Server | undefined
let __application
let __renderer: BundleRenderer // used for dev server updates

interface ServerOptions {
  static?: boolean;
  port?: string;
  renderer?: BundleRenderer;
}

const isRestarting = (): boolean => {
  return Vue.$restartingServer ? true : false
}
const setRestarting = (state: boolean): void => {
  Vue.$restartingServer = state
}

/**
 * Server render an application route
 * @param url The relative route to render
 */
export const renderRoute = async (
  url = "",
  renderer: BundleRenderer
): Promise<string> => {
  const currentRenderer = __renderer ? __renderer : renderer

  return await currentRenderer.renderToString({ url })
}

export const renderRequest = async (
  renderer: BundleRenderer,
  request: express.Request,
  response: express.Response
): Promise<void> => {
  response.setHeader("Content-Type", "text/html")
  response.setHeader("Server", getServerInfo())

  try {
    const html = await renderRoute(request.url, renderer)
    response.send(html)
  } catch (error) {
    handleServerError(request, response, error)
  }
}

const prepareListener = (): void => {
  if (__listening) {
    __listening.destroy = destroyer(__listening)
  }
}

export const closeServer = async (): Promise<void> => {
  if (__listening) {
    __listening.destroy()
  }
}

export const createServer = async (options: ServerOptions): Promise<void> => {
  const { port, renderer } = options || {}

  process.env.PORT = port || process.env.PORT || "3000"

  __application = express()

  loadMiddleware(__application)

  if (renderer) {
    __application.get("*", (request, response) => {
      return renderRequest(renderer, request, response)
    })
  }

  __listening = __application.listen(process.env.PORT, () => {
    logServerReady()
    setRestarting(false)
  })

  prepareListener()

  addCallback({
    key: "createServer",
    hook: "restart-server",
    callback: async ({ path, event }: { event: string; path: string }): Promise<void> => {
      if (!isRestarting()) {
        setRestarting(true)

        log.server(`restarting server ${event}@${path}`, { color: "yellow" })

        if (__listening) {
          try {
            __listening.destroy()

            await runCallbacks("rebuild-server-app", { path })

            await createServer(options)
          } catch (error) {
            // If an error is thrown that is subsequently fixed, don't prevent server restart
            setRestarting(false)
            throw error
          }
        }
      } else {
        log.server("waiting for restart", { color: "red" })
      }
    }
  })
}

export const htmlRenderer = ({
  bundle,
  template,
  clientManifest
}: RendererComponents): BundleRenderer => {
  // Allow for changing default options when rendering
  // particularly important for testing
  const options: BundleRendererOptions = applyFilters("server-renderer-options", {
    cache: new LRU({ max: 1000, maxAge: 1000 * 60 * 15 }),
    runInNewContext: false,
    directives: applyFilters("server-directives", {}),
    template,
    clientManifest
  })

  return createBundleRenderer(bundle, options)
}

export const createRenderServer = async (
  options: ServerOptions = {}
): Promise<BundleRenderer> => {
  let renderer: BundleRenderer

  if (process.env.NODE_ENV == "development") {
    renderer = await new Promise(resolve => {
      developmentServer({
        fileSystem: options.static ? "fs" : "memory-fs",
        onReady: async renderConfig => {
          const renderer = htmlRenderer(renderConfig)

          if (!__listening) {
            options.renderer = renderer
            await createServer(options)
          } else {
            __renderer = renderer
          }

          resolve(renderer)
        }
      })
    })
  } else {
    const paths = {
      template: setting("app.templatePath"),
      bundle: getPath("server-bundle"),
      clientManifest: getPath("client-manifest")
    }

    const renderComponents = {
      template: fs.readFileSync(paths.template, "utf-8"),
      bundle: require(paths.bundle),
      clientManifest: require(paths.clientManifest)
    }

    renderer = htmlRenderer(renderComponents)

    options.renderer = renderer
    await createServer(options)
  }

  return renderer
}

export const setup = (): void => {
  addCallback({
    key: "server",
    hook: "create-server",
    callback: (_: ServerOptions) => createRenderServer(_)
  })
  addCallback({ key: "server", hook: "close-server", callback: () => closeServer() })
}

setup()
