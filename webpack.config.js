var webpack = require("webpack")
var path = require("path")
var compact = require("lodash/compact")

const views = {
  inferno: {
    alias: {
      inferno: path.resolve("./node_modules/inferno/index.js"),
      react: path.resolve("./js/views/inferno/react"),
      "react-dom": path.resolve("./js/views/inferno/react-dom"),
      "mobx-react": "inferno-mobx",
      "has-keyed-children": path.resolve(
        "./js/views/inferno/has-keyed-children"
      ),
      "real-inferno-create-element": path.resolve(
        "./node_modules/inferno-create-element/index.js"
      ),
      "inferno-create-element": path.resolve(
        "./js/views/inferno/inferno-create-element"
      ),
      "inferno-component": path.resolve("./js/views/inferno/inferno-component")
    },
    setupFile: "./js/views/inferno/initialize.js",
    babelPresets: [],
    babelPlugins: [["inferno", { imports: true }]]
  },
  react: {
    alias: {
      inferno: path.resolve("./js/views/polyfills/inferno"),
      "has-keyed-children": path.resolve(
        "./js/views/polyfills/has-keyed-children"
      )
    },
    setupFile: null,
    babelPresets: ["react"],
    babelPlugins: ["react-require", "transform-react-jsx"]
  },
  preact: {
    alias: {
      react: "preact",
      "react-dom": "preact",
      inferno: path.resolve("./js/views/polyfills/inferno"),
      "mobx-react": "mobx-preact",
      "has-keyed-children": path.resolve(
        "./js/views/polyfills/has-keyed-children"
      )
    },
    setupFile: "./js/views/preact/initialize.js",
    babelPresets: [],
    babelPlugins: ["preact-require", ["transform-react-jsx", { pragma: "h" }]]
  }
}

const nodeEnv = process.env.NODE_ENV || "development"
const environmentView = { development: "react", production: "inferno" }[nodeEnv]
const view = views[process.env.VIEW || environmentView]
const prod = nodeEnv === "production"

module.exports = {
  entry: compact([view.setupFile, "./js/index.js"]),
  output: {
    path: __dirname,
    publicPath: "/",
    filename: "bundle.js"
  },
  devtool: prod ? "source-map" : "cheap-module-source-map",
  module: {
    loaders: [
      {
        include: /\.worker.js$/,
        loader: "worker-loader"
      },
      {
        test: /\.(png)$/,
        use: "file-loader?name=./images/[name].[ext]"
      },
      {
        include: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        query: {
          presets: ["env"].concat(view.babelPresets),
          plugins: ["emotion", "transform-object-rest-spread"].concat(
            view.babelPlugins
          )
        }
      }
    ]
  },
  plugins: compact([
    new webpack.LoaderOptionsPlugin({
      debug: !prod,
      minimize: prod
    }),
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify(nodeEnv)
      }
    }),
    prod ? new webpack.optimize.UglifyJsPlugin() : null,
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ]),
  resolve: {
    alias: view.alias,
    extensions: [".js", ".json"]
  },
  devServer: {
    contentBase: "./public",
    historyApiFallback: true,
    hot: true,
    hotOnly: true
  }
}
