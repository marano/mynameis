var webpack = require("webpack")
var path = require("path")
var compact = require("lodash/compact")

const views = {
  inferno: {
    alias: {
      react: path.resolve("./js/views/inferno/react-polyfill"),
      "react-dom": "inferno",
      recompose: "incompose",
      "mobx-react": path.resolve("./js/views/inferno/mobx-react-polyfill")
    },
    babelPresets: [],
    babelPlugins: [["inferno", { imports: true }]],
    setupFile: "./js/views/inferno/setup-inferno.js"
  },
  react: {
    alias: { inferno: "./js/views/react/inferno-polyfill" },
    setupFile: null,
    babelPresets: ["react"],
    babelPlugins: ["react-require", "transform-react-jsx"]
  },
  preact: {
    alias: {
      react: "preact",
      "react-dom": "preact",
      inferno: "./js/views/preact/inferno-polyfill",
      "mobx-react": "mobx-preact"
    },
    setupFile: null,
    babelPresets: [],
    babelPlugins: ["preact-require", ["transform-react-jsx", { pragma: "h" }]]
  }
}

const nodeEnv = process.env.NODE_ENV || "development"
const environmentView = { development: "react", production: "inferno" }[nodeEnv]
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
          plugins: [
            "emotion",
            "transform-object-rest-spread",
            "transform-decorators-legacy"
          ].concat(view.babelPlugins)
        }
      }
    ]
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
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
