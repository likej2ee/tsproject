var path = require('path');
var fs = require('fs');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HashOutput = require('webpack-plugin-hash-output');
var config = require('../config');

const ASSETS_DOMAIN = config.production.assetsDomain;
const ASSETS_PATH = config.constants.assetsPath;
const WEBPACK_PUBLISH_ROOT = config.constants.webpackPublishRoot;
const WEBPACK_MANIFEST = '../' + WEBPACK_PUBLISH_ROOT + '/' + config.constants.webpackManifest;

module.exports = {
  output: {
    publicPath: ASSETS_DOMAIN + ASSETS_PATH,
    filename: '[name]-[chunkhash].js',
    chunkFilename: '[name]-[chunkhash].js'
  },
  plugins: [
    // 生成hash文件
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
      __DEV__: false,
      __TEST__: false,
      __PRODUCTION__: true
    }),
    new ExtractTextPlugin({
      filename: '[name]-[contenthash:20].css'
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common',
      filename: 'common-[chunkhash].js',
      minChunks: Number.MAX_VALUE,
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'runtime',
      filename: 'runtime-[chunkhash].js',
      minChunks: Number.MAX_VALUE,
    }),
    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      compress: {
        warnings: false,
        drop_console: false,
      }
    }),
    new HashOutput(),
    function() {
      var publicPath = this.options.output.publicPath;

      // 获取文件后缀明
      var getFileExtension = function(fileName) {
        var array = fileName.split('.');
        return array[array.length - 1];
      }

      // 生成manifest文件
      this.plugin('done', function(stats) {

        var manifest = {};
        var assets = stats.toJson().assetsByChunkName;

        for (var key in assets) {
          var value = assets[key];
          if (value instanceof Array) {
            for (var i in value) {
              var item = value[i];
              manifest[ASSETS_PATH + key + '.' + getFileExtension(item)] = publicPath + item;
            }
          } else {
            manifest[ASSETS_PATH + key + '.' + getFileExtension(value)] = publicPath + value;
          }
        }

        // 读取动态链接库生成的hash值映射表
        var webpackManifestDll = require(path.resolve(__dirname, WEBPACK_MANIFEST));
        for (key in webpackManifestDll) {
          manifest[key] = webpackManifestDll[key];
        }

        // 写入合并后的依赖关系图表
        fs.writeFileSync(
          path.resolve(__dirname, WEBPACK_MANIFEST),
          JSON.stringify(manifest));
      });
    }
  ]
};
