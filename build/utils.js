'use strict'
const path = require('path')
const config = require('../config')
const SOURCE_CODE_ROOT = config.constants.sourceCodeRoot
const INCLUDE_PATHS = path.resolve(__dirname, './' + SOURCE_CODE_ROOT + '/core')

const IS_NEED_SOURCE_MAP = process.env.NODE_ENV !== 'production'
const OUT_PUT_STYLE = process.env.NODE_ENV === 'production' ? 'compressed' : 'nested'

// css-loader
exports.cssLoaderConfig = {
  loader: 'css-loader',
  options: {
    minimize: true,
    sourceMap: IS_NEED_SOURCE_MAP
  }
}

// scss-loader
exports.scssLoaderConfig = {
  loader: 'sass-loader',
  options: {
    outputStyle: OUT_PUT_STYLE,
    includePaths: [INCLUDE_PATHS],
    sourceMap: IS_NEED_SOURCE_MAP
  }
}
