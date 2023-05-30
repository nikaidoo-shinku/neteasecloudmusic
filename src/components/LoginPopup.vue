<template>
  <div class="LoginPopup">
    <div class="LoginTop">
      <div class="cover">
        <img :src="imgData" alt="" />
      </div>
      <div class="justLogin" @click="toLogin">
        立即登录
        <i class="iconfont icon-arrow-right-bold"></i>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      imgData: require("../assets/img/EqEgKAXC_400x400.png"),
    };
  },
  methods: {
    toLogin() {
      if(!window.localStorage.getItem("token")) {
        this.$router.push({name: 'login'})
      }else {
        this.$router.push({name: 'userinfo'})
      }
    }
  },
};
</script>
<style lang="scss" scoped>
.LoginPopup {
  width: 100%;
  height: 100%;

  .LoginTop {
    width: 100%;
    height: 30px;
    display: flex;
    align-items: center;

    .cover {
        width: 30px;
        height: 30px;
        overflow: hidden;
        border-radius: 50%;

        img {
            width: 100%;
            height: 100%;
        }
    }

    .justLogin {
        font-size: 14px;
    }
  }
}
</style>
