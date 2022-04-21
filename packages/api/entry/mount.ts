import "tailwindcss/tailwind.css"

// @ts-ignore
// eslint-disable-next-line import/no-unresolved, import/extensions, implicit-dependencies/no-implicit
import * as mainFile from "@src/index.ts"
// eslint-disable-next-line import/no-unresolved, import/extensions, implicit-dependencies/no-implicit
import RootComponent from "@src/App.vue"
import { FactorAppEntry, MainFile } from "../config/types"

import { mountApp, factorApp } from "./setupApp"

export const runApp = (
  params: { renderUrl?: string; isSSR?: boolean } = {},
): Promise<FactorAppEntry> => {
  return factorApp({
    ...params,
    RootComponent,
    mainFile: mainFile as MainFile,
  })
}

mountApp({
  mainFile: mainFile as MainFile,
  id: "#app",
  RootComponent,
}).catch(console.error)