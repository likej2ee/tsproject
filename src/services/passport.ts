import { constants } from '../core/ts/env';
import apiService from './api';

class PassportService {
  /**
   * 查询用户信息
   */
  getUserInfo() {
    return apiService.post('userinfo')
  }
  /**
   * 用户名密码登陆
   */
  login(loginForm) {
    return apiService.post('login/loginByPassword', {
      mobile: loginForm.loginName,
      password: loginForm.password
    })
  }
  /**
   * 退出登录
   */
  exit() {
    return apiService.post('login/loginOut')
  }
}

export default new PassportService()
