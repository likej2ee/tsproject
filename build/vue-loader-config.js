'use strict'
const utils = require('./utils')
const IS_PRODUCTION = process.env.NODE_ENV === 'production'

module.exports = {
  loaders: {
    // jsx: 'babel-loader',
    // ts: 'ts-loader',
    tsx: 'babel-loader!ts-loader!tslint-loader',
    scss: [
      'vue-style-loader',
      utils.cssLoaderConfig,
      'postcss-loader',
      utils.scssLoaderConfig
    ]
  },
  cssSourceMap: !IS_PRODUCTION, // 开启webpack的devtool属性配置后此选项设置true才会输出sourcemap，与其他loader是一致的行为
  cacheBusting: true,
  transformToRequire: {
    video: 'src',
    source: 'src',
    img: 'src',
    image: 'xlink:href'
  }
}
