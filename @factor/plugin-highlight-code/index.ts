import { FactorPlugin, FactorPluginSettings } from "@factor/api"

export class FactorHighlightCode extends FactorPlugin<FactorPluginSettings> {
  constructor(settings: FactorPluginSettings) {
    super("highlightCode", settings)
  }
  setup = () => {
    return {
      name: this.constructor.name,
      paths: [this.utils.safeDirname(import.meta.url)],
      vite: {
        optimizeDeps: {
          include: ["highlight.js"],
        },
      },
    }
  }
}
