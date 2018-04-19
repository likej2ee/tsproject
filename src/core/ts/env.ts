import * as constants from './constants'
import utils from './utils'
import config, { Config } from './config'
import platform from 'platform'
import storage from 'store'
import { User } from 'core/ts/vo'
import Vue from 'vue';
import apiService from 'services/api';

/**
 * 应用信息
 */
interface AppInfo {
  uuid: string, // app设备标识
  device: string, // 设备类型
  appkey: string, // 应用key
  pt: string, // 平台系统
  ptVersion: string, // 平台系统版本
  appVersion: string // 应用版本
}

/**
 * 应用设置
 */
interface AppSetting {
  locale: string // 语言
}

/**
 * 应用级别的共享数据
 */
class Env {
  private config: Config
  private user: User
  private appInfo: AppInfo
  private appSetting: AppSetting
  private vm: Vue

  /**
   * 构造
   */
  constructor() {
    this.config = config
    this.appInfo = {
      uuid: '',
      device: '',
      appkey: '',
      pt: '',
      ptVersion: '',
      appVersion: '',
    }
    this.user = {
      sid: '',
      name: '',
      portrait: '',
    }
    this.appSetting = {
      locale: '',
    }
    this.vm = new Vue()
  }

  /**
   * 初始化
   */
  init(): void {
    this.initAppInfo()
    this.initUser()
    this.initAppSetting()
  }

  /**
   * 初始化应用信息
   */
  private initAppInfo(): void {
    let appInfo = Object.assign({}, this.getAppInfo())
    let os = platform.os
    if (os) {
      appInfo.ptVersion = os.version || ''
      appInfo.pt = os.family || ''
    }

    if (platform.product === null) {
      appInfo.device = constants.DEVICE.WEB_PC
    } else {
      if (utils.isWeChatBrowser()) {
        appInfo.device = constants.DEVICE.WEB_WECHAT
      } else {
        appInfo.device = constants.DEVICE.WEB_MOBILE
      }
    }
    this.setAppInfo(appInfo)
    // utils.log('initAppInfo ' + JSON.stringify(this.getAppInfo()))
  }

  /**
   * 初始化user
   */
  private initUser(): void {
    // 写入本地缓存
    if (storage.enabled) {
      let userCache = storage.get(constants.CACHE_KEY.USER)
      if (userCache !== undefined) {
        this.user = userCache;
      }
      let sid = this.user.sid || '';
      apiService.setHeader({ sid: sid })
    }
    // utils.log('initUser ' + JSON.stringify(this.getUser()))
  }

  /**
   * 初始化应用设置
   */
  private initAppSetting(): void {
    let appSetting = {
      locale: 'zh-CN',
    }
    // 写入本地缓存
    if (storage.enabled) {
      let appSettingCache = storage.get(constants.CACHE_KEY.SETTING)
      if (appSettingCache === undefined) {
        this.storageAppSetting(appSetting)
      }
    }
    // utils.log('initAppSetting ' + JSON.stringify(this.getAppSetting()))
  }

  /**
  * 获取环境配置
  */
  getConfig() {
    return this.config
  }

  /**
   * 设置登录用户信息
   * @param user 登录用户
   */
  setUser(user: User): void {
    this.user = user
  }

  /**
   * 获取登录用户信息
   */
  getUser(): User {
    return this.user
  }

  /**
   * 持久化user
   * @param user
   */
  storageUser(user: User): void {
    let userMerger = Object.assign({}, this.getUser(), user)
    this.setUser(userMerger) // 更新
    if (storage.enabled) {
      storage.set(constants.CACHE_KEY.USER, userMerger)
    }
  }

  /**
   * 设置应用信息
   * @param appInfo 应用信息
   */
  setAppInfo(appInfo: AppInfo): void {
    this.appInfo = appInfo
  }

  /**
   * 获取应用信息
   */
  getAppInfo(): AppInfo {
    return this.appInfo
  }

  /**
   * 设置偏好设置
   * @param appSetting 偏好设置
   */
  setAppSetting(appSetting: AppSetting): void {
    this.appSetting = appSetting
  }

  /**
   * 获取偏好设置
   */
  getAppSetting(): AppSetting {
    return this.appSetting
  }

  /**
   * 持久化偏好设置
   * @param appSetting
   */
  storageAppSetting(appSetting: AppSetting): void {
    let appSettingMerger = Object.assign({}, this.getAppSetting(), appSetting)
    this.setAppSetting(appSettingMerger) // 更新
    if (storage.enabled) {
      storage.set(constants.CACHE_KEY.SETTING, appSettingMerger)
    }
  }

  /**
   * 设置Vue实例
   * @param vm Vue实例
   */
  setVm(vm: Vue) {
    this.vm = vm
  }

  /**
   * 获取Vue实例
   */
  getVm() {
    return this.vm
  }
}

let env: Env = new Env()

export {
  env,
  constants,
  utils
}
