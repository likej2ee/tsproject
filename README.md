# 项目说明

## 必要知识点

- [node](https://nodejs.org/en/) 点击下载node
- [gulp](https://github.com/gulpjs/gulp) 构建工具介绍
- [sass](http://www.w3cplus.com/sassguide/syntax.html) Sass入门语法
- [es6](http://es6.ruanyifeng.com/) ECMAScript 6 入门
- [ts](https://www.tslang.cn/docs/home.html) TypeScript文档
- [vue](https://cn.vuejs.org/v2/guide/) vue入门指南
- [vuex](https://vuex.vuejs.org/zh-cn/) 基于vue的状态管理模式
- [vue-router](https://router.vuejs.org/zh-cn/) 基于vue的页面路由
- [element-ui](http://element-cn.eleme.io/#/zh-CN/) element-ui框架

## 运行项目

``` shell

# 安装依赖
$ npm install

# 运行开发环境(启动webserver和webpack监听任务)
$ npm run dev

```

## 构建发布版本

``` shell

# 构建生产版本
$ npm run production

# 单独启动webserver
npm start

```

## 目录结构

- 其中 src/core 目录,项目初建时规定，不可任意扩展，需团队协商后再更新内容

``` js
│  .babelrc                          babel配置文件，使用ts可移除
│  .eslintrc                         eslint配置文件，使用ts可移除
│  .gitignore                        git项目忽略文件
│  .npmrc                            npm管理工具的配置文件，可配置代理等
│  gulpfile.js                       gulp任务配置文件
│  package-lock.json                 npm自动生成
│  package.json                      gulp任务依赖的插件列表
│  postcss.config.json               css预处理配置
│  README.md                         项目说明文件
│  tsconfig.json                     typescript配置
│  tslint.json                       typescript语法检测规则配置
│  yarn.lock                         yarn自动生成
│
├─node_modules                       依赖的模块儿
│
├─www                                发布目录
│
└─src
    ├─components                     组件
    ├─core                           项目核心文件、公共定义
    ├─pages                          页面
    └─service                        服务层、对接接口
```

## 团队协作必要工具插件 → [传送门](https://github.com/likej2ee/webpack2-demo)
