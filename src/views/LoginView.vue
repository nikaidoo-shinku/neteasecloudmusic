<template>
  <div class="login">
    <h1>欢迎登录</h1>
    <div class="form">
      <div class="item">
        <span class="iconfont icon-jurassic_user"></span>
        <input type="text" placeholder="手机号码" v-model="phone" />
      </div>
      <div class="item">
        <span class="iconfont icon-mima"></span>
        <input type="password" placeholder="密码" v-model="password" />
      </div>
      <div class="item">
        <span class="iconfont icon-yanzhengma"></span>
        <input type="text" placeholder="验证码" v-model="code" />
        <button class="getCode" @click="getCode">发送</button>
      </div>
      <div class="item">
        <div class="submit">提交</div>
      </div>
      <div class="pic">
        <img :src="picCode" width="200" alt="" />
      </div>
    </div>
  </div>
</template>

<script>
  import { Toast } from "vant";
  import {
    getCaptchaSent,
    getLoginQrKey,
    getLoginQrCreate,
    getLoginQrCheck,
  } from "@/api/home.js";
  export default {
    data() {
      return {
        phone: "",
        password: "",
        code: "",
        picCode: "", //二维码图片
        unikey: "", //验证唯一key
        clearCheck: null,
      };
    },
    methods: {
      getCode() {
        let reg =
          /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
        if (!reg.test(this.phone)) {
          //不正确
          Toast("手机号码不正确");
          return;
        }
      },
    },
    created() {
      getLoginQrKey().then((data) => {
        console.log(data);
        this.unikey = data.data.unikey;
        getLoginQrCreate({
          key: data.data.unikey,
          qrimg: "base64",
          time: new Date().getTime(),
        }).then((pic) => {
          console.log(pic);
          this.picCode = pic.data.qrimg;
        });
      });
    },
    mounted() {
      // 检测二维码状态
      this.clearCheck = setInterval(() => {
        getLoginQrCheck({ key: this.unikey, time: new Date().getTime() }).then(
          (data) => {
            if (data.code == 803) {
              // 完成登录后清除定时器
              clearInterval(this.clearCheck);
              Toast("登录成功");
              window.localStorage.setItem("token", data.cookie);
              this.$router.push("/home");
            } else {
              console.log(data);
            }
          }
        );
      }, 1000);
    },
    beforeDestroy() {
      clearInterval(this.clearCheck);
    },
  };
</script>

<style lang="scss" scoped>
  // scoped 强制把样式设置在当前页面
  .login {
    background-color: #d4473c;
    width: 100%;
    height: 100%;
    color: #fff;
  }
  h1 {
    font-size: 48px;
    text-align: center;
    height: 48px;
    padding: 150px 0 40px 0;
  }
  .form {
    .item {
      width: 76%;
      height: 30px;
      line-height: 30px;
      margin: 0 auto;
      background-color: #f47378;
      border-radius: 30px;
      margin-bottom: 12px;
      input {
        background-color: transparent;
        border: 0px;
        outline: none;
        text-indent: 0.5em;
        font-size: 14px;
        color: #fff;
      }
      span {
        font-size: 20px;
        margin-left: 10px;
        display: inline-block;
        vertical-align: middle;
      }
      .getCode {
        border: 1px solid #fff;
        height: 20px;
        line-height: 20px;
        width: 50px;
        border-radius: 20px;
        font-size: 12px;
        color: #808080;
        float: right;
        margin: 5px;
      }
      .submit {
        font-size: 15px;
        background-color: #fff;
        text-align: center;
        color: #d4473c;
        border-radius: 15px;
      }
    }
    .pic {
      text-align: center;
      img {
        margin: 0 auto;
      }
    }
  }
</style>
