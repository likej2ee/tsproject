<template>
  <div class="my-header">
    <ul class="fl list-fl">
      <li class="logo p-img lazy">
        <img v-lazy="logo">
      </li>
      <li class="title">BACKSTAGE MANAGEMENT SYSTEM</li>
    </ul>
    <ul class="fr list-fr none" v-show="user.name" v-if="loginStatus">
      <!-- <li class="message" @click="handleMessage">
        <el-badge :value="messageCount" :max="99">
          <i class="el-icon-bell"></i>
        </el-badge>
      </li> -->
      <li class="user">
        <div class="portrait p-img lazy">
          <img v-lazy="user.portrait">
        </div>
        <el-dropdown trigger="click" @command="handleCommand">
          <span class="el-dropdown-link">
           {{user.name}} <i class="el-icon-caret-bottom el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <!-- <el-dropdown-item command="modifyPortrait" divided>修改头像</el-dropdown-item> -->
            <el-dropdown-item command="exit">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </li>
    </ul>
  </div>
</template>

<script lang="tsx">
import { Vue, Component, Prop } from "vue-property-decorator";
import { utils, constants, env } from "core/ts/env";
import { State, User } from "core/ts/vo";

@Component
export default class MyComponent extends Vue {
  state: State = this.$store.state;
  logo: string = require("logo");
  messageCount: number = 120;

  @Prop({ default: false })
  isShowUser?: boolean;

  get user() {
    return this.state.user.user;
  }
  get loginStatus() {
    return this.state.user.loginStatus;
  }

  // handleMessage() {
  //   this.$alert("消息总数: " + this.messageCount);
  // }
  handleCommand(command) {
    // this.$message("click on item " + command);
    if (command === "exit") {
      this.doExit();
    }
  }
  async doExit() {
    await this.$store.dispatch("exit");
    this.$router.push({ name: "passport/login" });
  }
}
</script>

<style lang="scss">
.el-header {
  background-color: #373d41;
}
.my-header {
  height: 50px;
  margin: 0 -20px;

  box-shadow: 0 1px 4px 0 rgba(238, 238, 238, 0.5);

  .list-fl,
  .list-fr {
    padding: 10px 0;
    > li {
      float: left;

      padding-left: 15px;
    }
  }
  .logo,
  .portrait {
    float: left;

    width: 30px;
    height: 30px;
    img {
      width: 30px;
      height: 30px;

      border-radius: 15px;
    }
  }
  .title {
    font-size: 20px;

    width: 400px;

    color: #bdbdbd;
  }
  .message {
    padding-top: 7px;
    padding-right: 20px;

    cursor: pointer;
    .el-icon-bell {
      font-size: 20px;

      color: #bdbdbd;
    }
  }
  .user {
    line-height: 30px;

    padding-right: 20px;

    cursor: pointer;
  }
  .el-dropdown-link {
    padding-right: 5px;
    padding-left: 10px;

    color: #bdbdbd;
    .el-icon-caret-bottom {
      color: #bdbdbd;
    }
  }
}
</style>
