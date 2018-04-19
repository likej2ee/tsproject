var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  // devtool: 'source-map',
  devtool: 'cheap-module-source-map', // 使用 cheap 模式可以大幅提高 souremap 生成的效率
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.DefinePlugin({
      __DEV__: true,
      __TEST__: false,
      __PRODUCTION__: false
    }),
    new ExtractTextPlugin({
      filename: '[name].css'
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common',
      filename: 'common.js',
      minChunks: Number.MAX_VALUE
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'runtime',
      filename: 'runtime.js',
      minChunks: Number.MAX_VALUE
    })
  ]
}
