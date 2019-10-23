const glob = require("glob").sync
import { pathExistsSync } from "fs-extra"
import { dirname, resolve } from "path"
import { addFilter } from "@factor/filters/util"
import { getExtensions } from "@factor/build/util"
export default Factor => {
  return new (class {
    constructor() {
      this.themes = getExtensions().filter(_ => _.extend == "theme")

      addFilter("webpack-aliases", _ => {
        const p =
          this.themes.length > 0
            ? dirname(require.resolve(this.themes[0].name))
            : Factor.$paths.get("source")

        return { ..._, "@theme": p }
      })

      // This allows for overriding of files from themes
      // Notes:
      // - Uses "#" as a flag to check a file, this is an alias for the theme root. The function replaces this with the app root.
      // - TODO if a file is added to app, then server needs a restart, fix should be possible
      addFilter("webpack-plugins", (_, { webpack }) => {
        _.push(this.modulePathWebpackPlugin(webpack))
        _.push(this.browserReplacement(webpack))
        return _
      })
    }

    // Server utils sometimes aren't compatible with webpack
    // Replace with polyfill if a
    browserReplacement(webpack) {
      return new webpack.NormalModuleReplacementPlugin(/util$/, resource => {
        if (resource.context.includes("@factor")) {
          const resolvedDirectory = dirname(
            require.resolve(resource.request, { paths: [resource.context] })
          )
          const clientUtil = this._fileExists(resolve(resolvedDirectory, `util-browser`))

          if (clientUtil) resource.request = clientUtil
        }
      })
    }

    modulePathWebpackPlugin(webpack) {
      return new webpack.NormalModuleReplacementPlugin(/^\#/, resource => {
        resource.request = this.handleAsOverride(resource)
      })
    }

    handleAsOverride(resource) {
      //const inApp = this.findInDirectory({ directory: src, fileName })
      const inApp = this._fileExists(
        resource.request.replace("#", Factor.$paths.get("source"))
      )
      let filePath = ""
      if (inApp) {
        filePath = inApp
      } else {
        if (this.themes.length > 0) {
          this.themes.some(_ => {
            const themeSrc = dirname(require.resolve(_.name))
            // const inTheme = this.findInDirectory({ fileName, directory: themeSrc })

            const inTheme = this._fileExists(resource.request.replace("#", themeSrc))

            if (inTheme) {
              filePath = inTheme
              return true
            }
          })
        }

        if (!filePath) {
          const relPath = this._fileExists(
            resource.request.replace("#", resource.context)
          )

          const fallbackPath = this._fileExists(
            resource.request.replace("#", Factor.$paths.get("coreApp"))
          )

          if (relPath) filePath = relPath
          else if (fallbackPath) filePath = fallbackPath
        }
      }

      return filePath ? filePath : resource.request
    }

    findInDirectory({ directory, fileName }) {
      //const baseFileName = fileName.substr(0, fileName.lastIndexOf("."))
      //console.log("baseFileName", baseFileName)
      const files = glob(`${directory}/**/${fileName}`)
      return files && files.length > 0 ? files[0] : false
    }

    _fileExists(path) {
      const basePath = path.split("?")[0]
      //const query = path.split("?")[1] || ""
      if (pathExistsSync(basePath)) {
        return path
      } else {
        const files = glob(`${basePath}.*`)

        if (files && files.length == 1) {
          return files[0]
        } else {
          return false
        }
      }
    }
  })()
}
