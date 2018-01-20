var webpack = require("webpack")
var path = require("path")
var compact = require("lodash/compact")

const libs = {
  inferno: {
    setupFile: "./js/view/setup-inferno.js",
    babelPresets: [],
    babelPlugins: [["inferno", { imports: true }]],
    webpackPlugins: [
      new webpack.ProvidePlugin({
        View: ["inferno"],
        Component: ["inferno-component"],
        Container: ["@cerebral/inferno", "Container"],
        cerebralConnect: ["@cerebral/inferno", "connect"],
        connect: [path.resolve("./js/curried-connect"), "default"],
        linkEvent: ["inferno", "linkEvent"]
      })
    ]
  },
  react: {
    setupFile: null,
    babelPresets: ["react"],
    babelPlugins: ["react-require", "transform-react-jsx"],
    webpackPlugins: [
      new webpack.ProvidePlugin({
        View: ["react-dom"],
        Component: ["react", "Component"],
        Container: ["@cerebral/react", "Container"],
        cerebralConnect: ["@cerebral/react", "connect"],
        connect: [path.resolve("./js/curried-connect"), "default"],
        linkEvent: [path.resolve("./js/link-event.js"), "default"]
      })
    ]
  },
  preact: {
    setupFile: null,
    babelPresets: [],
    babelPlugins: ["preact-require", ["transform-react-jsx", { pragma: "h" }]],
    webpackPlugins: [
      new webpack.ProvidePlugin({
        View: ["preact"],
        Component: ["preact", "Component"],
        Container: ["@cerebral/preact", "Container"],
        cerebralConnect: ["@cerebral/preact", "connect"],
        connect: [path.resolve("./js/curried-connect"), "default"],
        linkEvent: [path.resolve("./js/link-event.js"), "default"]
      })
    ]
  }
}

const lib = libs["inferno"]

module.exports = {
  entry: compact([lib.setupFile, "./js/index.js"]),
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
          presets: ["env"].concat(lib.babelPresets),
          plugins: ["emotion", "transform-object-rest-spread"].concat(
            lib.babelPlugins
          )
        }
      }
    ]
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ].concat(lib.webpackPlugins),
  resolve: {
    extensions: [".js", ".json"]
  },
  devServer: {
    contentBase: "./public",
    historyApiFallback: true,
    hot: true
  }
}
