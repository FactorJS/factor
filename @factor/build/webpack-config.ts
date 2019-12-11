import "@factor/build/webpack-overrides"
import { resolve } from "path"
import { applyFilters, log, ensureTrailingSlash, deepMerge } from "@factor/api"
import { getPath } from "@factor/api/paths"
import BundleAnalyzer from "webpack-bundle-analyzer"
import CopyPlugin from "copy-webpack-plugin"
import merge from "webpack-merge"
import MiniCssExtractPlugin from "mini-css-extract-plugin"
import nodeExternals from "webpack-node-externals"
import OptimizeCSSAssetsPlugin from "optimize-css-assets-webpack-plugin"
import TerserPlugin from "terser-webpack-plugin"
import VueLoaderPlugin from "vue-loader/lib/plugin"
import VueSSRClientPlugin from "vue-server-renderer/client-plugin"
import VueSSRServerPlugin from "vue-server-renderer/server-plugin"
import webpack, { Configuration, Stats, Compiler } from "webpack"
import WebpackDeepScopeAnalysisPlugin from "webpack-deep-scope-plugin"
import { configSettings } from "@factor/api/config"
import { generateLoaders } from "@factor/cli/extension-loader"
import { cssLoaders, enhancedBuild } from "./webpack-utils"

interface FactorBundleOptions {
  config?: Record<string, any>;
  beforeCompile?: (_arguments: any) => {};
  afterCompile?: (_arguments: any) => {};
}

export const getDefinedValues = (target: string): object => {
  return applyFilters("webpack-define", {
    "process.env.FACTOR_SSR": JSON.stringify(target),
    "process.env.VUE_ENV": JSON.stringify(target),
    "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
    "process.env.FACTOR_ENV": JSON.stringify(process.env.FACTOR_ENV),
    "process.env.FACTOR_APP_CONFIG": JSON.stringify(configSettings())
  })
}

const base = async ({ target }: { target: string }): Promise<Configuration> => {
  const plugins = [
    new WebpackDeepScopeAnalysisPlugin.default(),
    new VueLoaderPlugin(),
    new webpack.DefinePlugin(getDefinedValues(target)),
    function(this: Compiler): void {
      this.plugin("done", function(stats: Stats) {
        const { errors } = stats.compilation
        if (errors && errors.length > 0) {
          errors.forEach(e => {
            log.warn(e.message)
          })
        }
      })
    }
  ]

  const copyPluginConfig = applyFilters("webpack-copy-files-config", [])
  if (copyPluginConfig.length > 0) {
    plugins.push(new CopyPlugin(copyPluginConfig))
  }

  const out = {
    output: {
      path: getPath("dist"),
      filename: "js/[name].[hash:5].js"
    },
    resolve: {
      extensions: [".js", ".vue", ".json", ".ts"],
      alias: applyFilters("webpack-aliases", {})
    },
    module: {
      rules: applyFilters("webpack-loaders", [
        { test: /\.vue$/, loader: "vue-loader" },
        {
          test: /\.(png|jpg|gif|svg|mov|mp4)$/,
          loader: "file-loader",
          // esModule option introduced in v5, but breaks markdown-image-loader
          options: { name: "[name]-[hash:5].[ext]", esModule: false }
        },
        { test: /\.css/, use: cssLoaders({ target, lang: "css" }) },
        { test: /\.less/, use: cssLoaders({ target, lang: "less" }) },
        { test: /\.md$/, use: [{ loader: "markdown-image-loader" }] },
        {
          test: /\.ts$/,
          loader: "ts-loader",
          options: {
            transpileOnly: true,
            appendTsSuffixTo: [/\.vue$/],
            compilerOptions: {
              module: "es6",
              noEmit: false,
              strict: false,
              sourceMap: false
            },
            configFile: resolve(__dirname, "tsconfig.webpack.json")
          }
        }
      ])
    },
    plugins,
    stats: { children: false },
    optimization: {
      sideEffects: true,
      usedExports: true,
      minimize: true
    },
    performance: { maxEntrypointSize: 500000 },
    node: {} // removes 150kb from bundle size
  }

  // Allow for ignoring of files that should not be packaged for client
  const ignoreMods = applyFilters("webpack-ignore-modules", [])

  if (ignoreMods.length > 0) {
    out.plugins.push(new webpack.IgnorePlugin(new RegExp(`^(${ignoreMods.join("|")})$`)))
  }

  return out
}

const client = (): Configuration => {
  const entry = getPath("entry-browser")
  const filename = "factor-client.json"
  return {
    entry,
    plugins: [new VueSSRClientPlugin({ filename })]
  }
}

const development = (): Configuration => {
  // Apparently webpack expects a trailing slash on these
  const publicPath = ensureTrailingSlash(getPath("dist"))
  return {
    mode: "development",
    output: { publicPath },
    performance: { hints: false } // Warns about large dev file sizes,
  }
}

const production = (): Configuration => {
  return {
    mode: "production",
    output: { publicPath: "/" },
    plugins: [
      new MiniCssExtractPlugin({
        filename: "css/[name]-[hash:5].css",
        chunkFilename: "css/[name]-[hash:5].css"
      })
    ],
    performance: { hints: "warning" },
    optimization: {
      minimizer: [new TerserPlugin(), new OptimizeCSSAssetsPlugin({})]
    }
  }
}

const server = (): Configuration => {
  const entry = getPath("entry-server")

  const filename = "factor-server.json"
  return {
    target: "node",
    entry,
    output: { filename: "server-bundle.js", libraryTarget: "commonjs2" },

    // https://webpack.js.org/configuration/externals/#externals
    // https://github.com/liady/webpack-node-externals
    // do not externalize CSS files in case we need to import it from a dep
    externals: [nodeExternals({ whitelist: [/\.css$/, /factor/] })],
    plugins: [new VueSSRServerPlugin({ filename })]
  }
}

export const getWebpackConfig = async (
  _arguments: FactorWebpackConfig
): Promise<Configuration> => {
  const { target = "server", analyze = false, testing = false } = _arguments

  const baseConfig = await base({ target })

  const buildConfig = process.env.NODE_ENV == "production" ? production() : development()

  const targetConfig = target == "server" ? server() : client()

  const testingConfig: Configuration =
    testing || process.env.FACTOR_DEBUG ? { devtool: "source-map" } : {}

  const plugins = applyFilters("webpack-plugins", [], { ..._arguments })

  // Only run this once (server build)
  // If it runs twice it cleans it after the first
  if (analyze && target == "client") {
    plugins.push(new BundleAnalyzer.BundleAnalyzerPlugin({ generateStatsFile: true }))
  }

  const packageConfig = applyFilters("package-webpack-config", {})

  const config = merge(
    baseConfig,
    buildConfig,
    targetConfig,
    packageConfig,
    testingConfig,
    { plugins }
  )

  return config
}

interface FactorWebpackConfig {
  target?: string;
  analyze?: boolean;
  testing?: boolean;
  clean?: boolean;
}

export const generateBundles = async (
  options: FactorBundleOptions = {}
): Promise<void> => {
  generateLoaders()

  await Promise.all(
    ["server", "client"].map(async target => {
      const config = await getWebpackConfig({ ...options, target })

      const compiler = webpack(deepMerge([config, options.config || {}]))

      if (options.beforeCompile) options.beforeCompile({ compiler, config, target })

      await new Promise((resolve, reject) => {
        compiler.run((error, stats) => {
          if (error || stats.hasErrors()) reject(error)
          else {
            if (options.afterCompile) {
              options.afterCompile({ compiler, error, stats, config, target })
            }

            resolve(true)
          }
        })
      })

      return
    })
  )
}

export const buildProductionApp = async (_arguments = {}): Promise<void[]> => {
  return await Promise.all(
    ["server", "client"].map(async target => {
      const config = await getWebpackConfig({ ..._arguments, target })

      return await enhancedBuild({ config, name: target })
    })
  )
}
