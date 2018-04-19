import utils from './utils'
declare let __DEV__: any
declare let __TEST__: any
declare let __PRODUCTION__: any

/**
 * 环境配置信息
 */
export interface Config {
  service: string, // 服务地址前缀
  domain: string, // 环境地址前缀
  cdnDomain: string, // 资源cdn前缀
  wsDomain?: string, // websocket地址前缀
}

let config: Config = {
  service: '',
  domain: '',
  cdnDomain: '',
  wsDomain: ''
}

if (__DEV__) {
  config = {
    service: 'http://www.yidianchina.com/',
    domain: 'http://www.yidianchina.com',
    cdnDomain: 'http://www.yidianchina.com',
    wsDomain: 'ws://123.207.167.163:9010/', // 网上随意搜索的，请替换为自家ws服务
  }
  utils.log('Current operating environment is DEV')
}
if (__TEST__) {
  config = {
    service: 'http://www.yidianchina.com/',
    domain: 'http://www.yidianchina.com',
    cdnDomain: 'http://www.yidianchina.com',
    wsDomain: 'ws://123.207.167.163:9010/',
  }
  utils.log('Current operating environment is TEST')
}
if (__PRODUCTION__) {
  config = {
    service: 'http://www.yidianchina.com/',
    domain: 'http://www.yidianchina.com',
    cdnDomain: 'http://www.yidianchina.com',
    wsDomain: 'ws://123.207.167.163:9010/',
  }
  utils.log('Current operating environment is PRODUCTION')
}

export default config
