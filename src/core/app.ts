/**
 * 核心包，引入一些公共函数的兼容包、公共样式
 */

import 'browser-polyfill'
import { env } from './ts/env'
import apiService from 'services/api';
import Vue from 'vue'
import VueLazyload from 'vue-lazyload';
import { store, router } from 'core/routes'
import { formatDate, number } from './ts/filter'

// 初始化环境信息
env.init()
apiService.init()

Vue.filter('formatDate', formatDate)
Vue.filter('number', number)

// 注册懒加载组件
Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: require('./images/error.png'),
  loading: require('./images/spacer.png'),
  attempt: 1,
  adapter: {
    loaded({ el }) {
      if (el && el.parentNode) {
        el.parentNode.className = el.parentNode.className.replace('lazy', '')
        el.className = 'active'
      }
    },
    loading(listender) {
      listender.el.className = ''
    },
    error(listender) {
      listender.el.className = 'active'
    }
  },
})

// 4. 创建和挂载根实例。
let vm = new Vue({
  store,
  router,
}).$mount('#app')

env.setVm(vm)
