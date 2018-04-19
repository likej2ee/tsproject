var path = require('path')
var webpack = require('webpack')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var config = require('../config')
var utils = require('./utils')
var vueLoaderConfig = require('./vue-loader-config')

const SOURCE_CODE_ROOT = config.constants.sourceCodeRoot
const WEBPACK_PUBLISH_ROOT = config.constants.webpackPublishRoot
const ASSETS_PATH = config.constants.assetsPath
const LIB_MANIFEST = '../' + WEBPACK_PUBLISH_ROOT + '/' + config.constants.libManifest

module.exports = {
  module: {
    rules: [{
      enforce: 'pre',
      test: /\.tsx?$/,
      use: {
        loader: 'tslint-loader',
        options: {
          // tslint errors are displayed by default as warnings
          // set emitErrors to true to display them as errors
          emitErrors: true,
          // tslint does not interrupt the compilation by default
          // if you want any file with tslint errors to fail
          // set failOnHint to true
          failOnHint: true,
          // can specify a custom tsconfig file relative to current directory or with absolute path
          // to be used with type checked rules
          tsConfigFile: 'tsconfig.json',
        }
      }
    }, {
      enforce: 'pre',
      test: /\.jsx?$/,
      use: {
        loader: 'eslint-loader',
        options: {
          emitWarning: false, // (default: false) Loader will always return warnings if option is set to true.
          failOnWarning: false, // (default: false) Loader will cause the module build to fail if there are any eslint warnings.
          failOnError: false // (default: false) Loader will cause the module build to fail if there are any eslint errors.
        }
      }
    }, {
      test: /\.jsx?$/,
      use: {
        loader: 'babel-loader'
      }
    }, {
      test: /\.tsx?$/,
      use: [
        'babel-loader',
        {
          loader: 'ts-loader',
          options: {
            // 识别*.vue模块儿追加.tsx后缀
            appendTsxSuffixTo: [/\.vue$/],
            // appendTsSuffixTo: [/\.ts\.vue$/]
          }
        }
      ]
    }, {
      test: /\.vue$/,
      loader: 'vue-loader',
      // 若不配置options，vue-loader会使用默认处理方式
      options: vueLoaderConfig
    }, {
      test: /\.css$/,
      use: ExtractTextPlugin.extract({
        use: [
          utils.cssLoaderConfig,
          'postcss-loader',
        ],
        fallback: 'style-loader' // use style-loader extract css file
      })
    }, {
      test: /\.scss$/,
      use: ExtractTextPlugin.extract({
        use: [
          utils.cssLoaderConfig,
          'postcss-loader',
          utils.scssLoaderConfig
        ],
        fallback: 'style-loader' // use style-loader extract css file
      })
    }, {
      test: /\.html$/,
      use: 'html-loader'
    }, {
      test: /(\.png)|(\.jpg)|(\.jpeg)|(\.gif)$/,
      use: {
        loader: 'url-loader',
        options: {
          limit: 7000,
          name: 'staticimg/[name].[hash:7].[ext]'
        }
      }
    }, {
      test: /(\.ttf)|(\.eot)|(\.svg)|(\.woff)$/,
      include: /^(?=.*fonts)/,
      use: {
        loader: 'file-loader',
        options: {
          name: 'static/fonts/[name].[hash:7].[ext]'
        }
      }
    }]
  },
  resolve: {
    modules: [ // 解决路径问题，可简化 alias entry 的路径配置以及模块儿路径可基于项目使用绝对路径
      path.join(__dirname, '../node_modules'),
      path.join(__dirname, '../' + SOURCE_CODE_ROOT),
    ],
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.vue'],
    alias: {
      // 'element-ui': 'element-ui/lib/index.js',
      'browser-polyfill$': 'babel-polyfill/browser.js',
      'vue$': 'vue/dist/vue.esm.js',
      'vue-router$': 'vue-router/dist/vue-router.min.js',
      'vuex$': 'vuex/dist/vuex.min.js',
      'vue-lazyload$': 'vue-lazyload/vue-lazyload.js',
      'qs$': 'qs/dist/qs.js',
      'axios$': 'axios/dist/axios.min.js',
      'platform$': 'platform/platform',
      'store$': 'store/dist/store.modern.min',
      'url-search-params$': 'url-search-params/build/url-search-params.js',
      'vue-style-loader$': 'vue-style-loader/lib/addStylesClient.js',
      // 'jquery$': 'jquery/dist/jquery.js',
      // 'lodash$': 'lodash/dist/lodash.min.js',
      // 'velocity$': 'velocity/velocity.min.js',
      // 'tween$': 'tween.js/src/Tween.js',
      // 'iSlider$': 'iSlider/build/index.bundle.js',
      // 'toastr$': 'toastr/toastr.js',
      // 'toastrcss$': 'toastr/toastr.min.css',
      // 'rangeslider$': 'rangeslider.js/dist/rangeslider.js',
      // 'rangeslidercss$': 'rangeslider.js/dist/rangeslider.css',
      'logo': 'core/images/logo.png',
    }
  },
  entry: {
    'common': [
      'core/ts/env.ts',
      'core/ts/config.ts',
      'core/ts/constants.ts',
      'core/ts/vo.ts',
      'core/ts/utils.ts',
      'services/api.ts',
      'services/error-handler.ts',
      'services/websocket.ts',
      'vue-class-component',
      'vue-property-decorator',
      'css-loader/lib/css-base.js',
      'vue-style-loader/lib/listToStyles.js',
      'babel-helper-vue-jsx-merge-props/index.js',
    ],
    'ui': 'core/ui.ts', // element-ui
    'app': 'core/app.ts',
  },
  output: {
    path: path.join(__dirname, '../' + WEBPACK_PUBLISH_ROOT),
    publicPath: ASSETS_PATH,
    filename: '[name].js'
  },
  plugins: [
    new webpack.DllReferencePlugin({
      context: path.resolve(__dirname, '../' + SOURCE_CODE_ROOT),
      manifest: require(path.resolve(__dirname, LIB_MANIFEST)),
    }),
    new webpack.optimize.ModuleConcatenationPlugin()
  ]
}
