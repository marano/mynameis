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
        test: /\.(png)$/,
        use: 'file-loader?name=./images/[name].[ext]'
      },
      {
        include: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015'],
          plugins: ['transform-object-rest-spread', 'inferno']
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
