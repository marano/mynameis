var webpack = require("webpack")
var path = require("path")
var compact = require("lodash/compact")

const views = {
  inferno: {
    alias: {
      react: path.resolve("./js/views/inferno/react"),
      "react-dom": "inferno",
      recompose: "incompose",
      "@cerebral/react": "@cerebral/inferno",
      "has-keyed-children": path.resolve(
        "./js/views/inferno/has-keyed-children"
      )
    },
    setupFile: "./js/views/inferno/setup-inferno.js",
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
      "@cerebral/react": "@cerebral/preact",
      "has-keyed-children": path.resolve(
        "./js/views/polyfills/has-keyed-children"
      )
    },
    setupFile: null,
    babelPresets: [],
    babelPlugins: ["preact-require", ["transform-react-jsx", { pragma: "h" }]]
  }
}

const nodeEnv = process.env.NODE_ENV || "development"
const environmentView = { development: "inferno", production: "react" }[nodeEnv]
const view = views[process.env.VIEW || environmentView]

module.exports = {
  entry: compact([view.setupFile, "./js/index.js"]),
  output: {
    path: __dirname,
    publicPath: "/",
    filename: "bundle.js"
  },
  devtool: "source-map",
  module: {
    loaders: [
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
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify(nodeEnv)
      }
    })
  ],
  resolve: {
    alias: view.alias,
    extensions: [".js", ".json"]
  },
  devServer: {
    contentBase: "./public",
    historyApiFallback: true,
    hot: true
  }
}
