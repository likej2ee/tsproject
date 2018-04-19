<template>
  <el-container class="login">
    <el-main class="el-main">
      <transition name="fade-in-down">
        <el-card class="box-card login-card" v-show="flag">
            <ul class="form-header">
              <li class="logo p-img lazy">
                <img v-lazy="logo">
              </li>
              <li class="title">BACKSTAGE MANAGEMENT SYSTEM</li>
            </ul>
            <el-form :model="loginForm" status-icon :rules="loginRules" ref="loginForm" class="demo-ruleForm" @keyup.enter.native="submitForm('loginForm')">
              <el-form-item  prop="loginName">
                <el-input type="text" v-model="loginForm.loginName" auto-complete="off" placeholder="请输入用户名">
                  <i slot="prefix" class="ficon-username"></i>
                </el-input>
              </el-form-item>
              <el-form-item  prop="password">
                <el-input type="password" v-model="loginForm.password" auto-complete="off" placeholder="请输入密码">
                  <i slot="prefix" class="ficon-password"></i>
                </el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submitForm('loginForm')" :disabled="submitBtns.disabled">{{submitBtns.text}}</el-button>
              </el-form-item>
            </el-form>
        </el-card>
      </transition>
    </el-main>
  </el-container>
</template>

<script lang="tsx">
import { Vue, Component, Prop } from "vue-property-decorator";
import { utils, constants, env } from "core/ts/env";
import { errorHandler, passportService } from "core/ts/services";
import { User } from "core/ts/vo";
import storage from "store";

const SUBMIT_DEFAULT = "登录";
const SUBMIT_WAITING = "登录中 ...";

@Component
export default class MyComponent extends Vue {
  logo: string = require("logo");
  flag = false;

  created() {
    this.restoreLoginName();
  }
  mounted() {
    this.flag = true;
  }

  // 登陆信息
  loginForm = {
    loginName: "",
    password: ""
  };

  // 提交按钮信息
  submitBtns = {
    disabled: false,
    text: SUBMIT_DEFAULT
  };

  // 表单校验规则
  loginRules = {
    loginName: [
      {
        validator: this.validateName,
        trigger: "blur"
      }
    ],
    password: [
      {
        validator: this.validatePass,
        trigger: "blur"
      }
    ]
  };

  // 校验用户名
  validateName(rule, value, callback) {
    if (value === "") {
      callback(new Error("请输入账号"));
    } else {
      callback();
    }
  }

  // 校验密码
  validatePass(rule, value, callback) {
    if (value === "") {
      callback(new Error("请输入密码"));
    } else {
      callback();
    }
  }

  // 提交表单
  submitForm(formName) {
    // 禁用提交
    let disableSubmit = () => {
      this.submitBtns = {
        disabled: true,
        text: SUBMIT_WAITING
      };
    };
    // 允许提交
    let enableSubmit = () => {
      this.submitBtns = {
        disabled: false,
        text: SUBMIT_DEFAULT
      };
    };

    let form: any = this.$refs[formName];
    form.validate(valid => {
      disableSubmit();
      if (valid) {
        this.login()
          .catch(errorHandler())
          .finally(() => {
            enableSubmit();
          });
      } else {
        enableSubmit();
      }
    });
  }

  // 登录
  async login() {
    await this.$store.dispatch("login", this.loginForm);
    this.rememberName();
    this.$router.push({ name: "/" });
  }

  // 还原登录用户名
  restoreLoginName() {
    let name = storage.get(constants.CACHE_KEY.LOGIN_NAME) || "";
    this.loginForm.loginName = name || "";
  }

  // 记住登录用户名，方便再次登录
  rememberName() {
    let name = this.loginForm.loginName;
    storage.set(constants.CACHE_KEY.LOGIN_NAME, name);
  }
}
</script>

<style lang="scss" scoped>
.login {
  height: 100%;

  background-color: #3593c6;
  background-image: url(images/bg.jpg);
  background-repeat: no-repeat;
  background-size: cover;
}
.form-header {
  overflow: hidden;

  padding-bottom: 15px;
  > li {
    line-height: 30px;

    float: left;
  }
  .title {
    padding-left: 15px;
  }
}
.logo {
  float: left;

  width: 30px;
  height: 30px;
  img {
    width: 30px;
    height: 30px;

    border-radius: 15px;
  }
}
.box-card {
  position: fixed;
  top: 50%;
  left: 50%;

  width: 400px;
  // transform: translate(-50%, -50%);
  margin-top: -152px;
  margin-left: -211px;
  padding: 10px 10px 0 10px;

  box-shadow: 0 2px 12px rgba($color: #000, $alpha: 0.5);
  .el-input {
    i {
      font-size: 18px;
      line-height: 38px;
    }
  }
}

.el-button {
  width: 100%;
  margin-top: 20px;
}
</style>
