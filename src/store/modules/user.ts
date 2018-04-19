import { GetterTree, ActionTree, ActionContext, MutationTree } from 'vuex'
import { State } from 'store/index'
import { env } from "core/ts/env";
import { passportService } from "core/ts/services";
import User from "vo/User";
import apiService from 'services/api'

// 定义约束
export interface UserState {
  user: User,
  loginStatus: boolean
}

// initial state
const state = {
  user: {},
  loginStatus: false,
}

// getters
const getters: GetterTree<UserState, State> = {

}

// actions
const actions: ActionTree<UserState, State> = {
  /**
   * 获取用户
   * @param {any} payload装载参数，一般为ajax的请求参数，例如id，或者一个查询条件对象
   */
  async getUser({ commit }: ActionContext<UserState, State>) {
    let res = await passportService.getUserInfo()
    let data = res.data.data
    let user: User = {
      name: data.name,
      portrait: data.portrait,
    }
    commit('setUser', user)
    commit('setLoginStatus', data.whetherLogin)
  },

  async login({ commit }, loginFrom) {
    let res = await passportService.login(loginFrom);
    // let sid = res.data.data.toString();
    let sid = 'xxxsss'
    let user = {
      sid: sid
    }
    commit('setUser', user)
    commit('setLoginStatus', true)
  },

  /**
   * 退出登录
   */
  async exit({ commit }) {
    await passportService.exit()
    commit('setUser', {
      name: '',
      portrait: ''
    })
    commit('setLoginStatus', false)
  }
}

// mutations
const mutations: MutationTree<UserState> = {
  setUser(state, user: User) {
    let userMerger = Object.assign({}, env.getUser(), user)
    state.user = userMerger
    let sid = userMerger.sid || '';
    apiService.setHeader({ sid: sid })
    env.storageUser(userMerger)
  },
  setLoginStatus(state, status: boolean) {
    state.loginStatus = status
  },
}

export default {
  state,
  getters,
  actions,
  mutations,
}
