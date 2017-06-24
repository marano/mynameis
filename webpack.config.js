module.exports = {
  entry: [
    './js/index.js'
  ],
  output: {
    path: __dirname,
    publicPath: '/',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        include: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015'],
          plugins: ['inferno']
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.json']
  },
  devServer: {
    historyApiFallback: true,
    contentBase: './public'
  }
};
