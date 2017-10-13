var webpack = require('webpack');
var path = require("path");
var compact = require("lodash/compact")

const libs = {
  inferno: {
    setupFile: './js/view/setup-inferno.js',
    babelPresets: [],
    babelPlugins: [
      ['inferno', { imports: true }]
    ],
    webpackPlugins: [
      new webpack.ProvidePlugin({
        View: ['inferno'],
        Component: ['inferno-component'],
        Container: ['@cerebral/inferno', 'Container'],
        connect: ['@cerebral/inferno', 'connect'],
        linkEvent: ['inferno', 'linkEvent']
      })
    ]
  },
  react: {
    setupFile: null,
    babelPresets: ['react'],
    babelPlugins: [
      'react-require',
      'transform-react-jsx'
    ],
    webpackPlugins: [
      new webpack.ProvidePlugin({
        View: ['react-dom'],
        Component: ['react', 'Component'],
        Container: ['@cerebral/react', 'Container'],
        connect: ['@cerebral/react', 'connect'],
        linkEvent: [path.resolve('./js/link-event.js'), 'default']
      })
    ]
  },
  preact: {
    setupFile: null,
    babelPresets: [],
    babelPlugins: [
      'preact-require',
      ['transform-react-jsx', { 'pragma': 'h' }]
    ],
    webpackPlugins: [
      new webpack.ProvidePlugin({
        View: ['preact'],
        Component: ['preact', 'Component'],
        Container: ['@cerebral/preact', 'Container'],
        connect: ['@cerebral/preact', 'connect'],
        linkEvent: [path.resolve('./js/link-event.js'), 'default']
      })
    ]
  }
}

const lib = libs['preact']

module.exports = {
  entry: compact([
    lib.setupFile,
    './js/index.js'
  ]),
  output: {
    path: __dirname,
    publicPath: '/',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.(png)$/,
        use: 'file-loader?name=./images/[name].[ext]'
      },
      {
        include: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['stage-3'].concat(lib.babelPresets),
          plugins: [
            'transform-object-rest-spread',
            'dynamic-import-webpack'
          ].concat(lib.babelPlugins)
        }
      }
    ]
  },
  plugins: lib.webpackPlugins,
  resolve: {
    extensions: ['.js', '.json']
  },
  devServer: {
    historyApiFallback: true,
    contentBase: './public'
  }
};
