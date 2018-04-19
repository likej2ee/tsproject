// 0. 如果使用模块化机制编程，导入Vue和VueRouter，要调用 Vue.use(VueRouter)
import Vue from 'vue'
import store from 'store/index'
import Component from 'vue-class-component';
import VueRouter from 'vue-router'
import { passportService } from "../core/ts/services";

Vue.use(VueRouter)

// Register the router hooks with their names
Component.registerHooks([
  "beforeRouteEnter",
  "beforeRouteLeave",
  "beforeRouteUpdate", // for vue-router 2.2+
]);

// 1. 定义（路由）组件。
// 可以从其他文件 import 进来
// const Foo = { template: '<div>foo</div>' }
// const Bar = { template: '<div>bar</div>' }

// 2. 定义路由
// 每个路由应该映射一个组件。 其中"component" 可以是
// 通过 Vue.extend() 创建的组件构造器，
// 或者，只是一个组件配置对象。
// 我们晚点再讨论嵌套路由。
const routes = [
  { path: '*', component: () => import('../pages/not-found/not-found.vue') },
  { name: 'passport/login', path: '/passport/login', component: () => import('../pages/passport/login/login.vue') },
  {
    name: 'backend', path: '/', component: () => import('../layouts/backend/standard/main.vue'),
    beforeEnter: (to, from, next) => {
      store.dispatch('getUser')
        .then(res => {
          if (store.state.user.loginStatus) {
            next()
          } else {
            router.push({ name: 'passport/login' })
          }
        })
        .catch(err => {
          console.log(err)
          next()
        })
    },
    children: [
      { name: '/', path: '/', component: () => import('../pages/home/home.vue') },
      { name: 'demo/websocket', path: 'demo/websocket/:id', component: () => import('../pages/demo/websocket.vue') },
    ],
  },
  // { name: 'foo', path: '/foo', component: Foo },
  // { name: 'bar', path: '/bar', component: Bar },
]

// 3. 创建 router 实例，然后传 `routes` 配置
// 你还可以传别的配置参数, 不过先这么简单着吧。
const router = new VueRouter({
  mode: 'history',
  routes, // （缩写）
})

// 导出模块儿
export {
  store,
  router
}

// 4. 创建和挂载根实例。 启动入口在core.ts
// 记得要通过 router 配置参数注入路由，
// 从而让整个应用都有路由功能
// const app = new Vue({
//   store,
//   router,
// }).$mount('#app')

// 现在，应用已经启动了！
