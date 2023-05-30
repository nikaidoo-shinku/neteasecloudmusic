<template>
  <div class="searchBar">
    <van-sticky ref="vanSticky" :offset-top="0" :container="container">
      <div class="searchBarArea" ref="searchBarcode">
        <slot name="leftic">
          
          <div class="iconfont icon-fenlei fenlei" @click="toLogin"></div>
        </slot>
        <slot name="middle">
          <div class="search" ref="searchCode" @click="toSearch">
            <div class="iconfont icon-search"></div>
            {{ searchTitle }}
          </div>
        </slot>
        <slot name="rightic">
          <div class="iconfont icon-yuyin yuyin"></div>
        </slot>
      </div>
    </van-sticky>
  </div>
</template>
<script>
import LoginPopup from "./LoginPopup.vue";

export default {
  components: {
    LoginPopup,
  },
  props: {
    searchBarColor: {
      type: String,
      default: "transparent",
    },
    searchColor: {
      type: String,
      default: "#fdfefd",
    },
    container: {
      default: null,
    },
  },
  data() {
    return {
      searchTitle: "告五人",
    };
  },
  methods: {
    showPopup() {
      this.$emit('showPopupTo')
    },
    // 跳转到搜索页面
    toSearch() {
      this.$router.push({ name: "searchView" });
    },
    //跳转到登录界面
    toLogin() {
      if(!window.localStorage.getItem("token")) {
        this.$router.push({name: 'login'})
      }else {
        this.$router.push({name: 'userinfo'}).catch(err => { console.log(err) })
      }
    }
  },
  watch: {
    searchBarColor: {
      handler(val) {
        if (this.$refs.searchBarcode) {
          this.$refs.searchBarcode.style.backdropFilter = val;
          this.$refs.searchBarcode.style.background = val;
        }
      },
    },
    searchColor: {
      handler(val) {
        if (this.$refs.searchCode) {
          this.$refs.searchCode.style.background = val;
        }
      },
    },
  },
};
</script>
<style lang="scss" scoped>
.searchBar {
  width: 100%;
  padding-top: 12px;

  .searchBarArea {
    width: 100%;
    height: 51px;
    box-sizing: border-box;
    padding: 13px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 99;

    .van-popup {
      z-index: 999;
    }

    .fenlei {
      font-size: 16px;
    }

    .search {
      height: 27px;
      background-color: #fdfefd;
      font-size: 12px;
      display: flex;
      flex: 1;
      margin-left: 13px;
      margin-right: 11px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 25px;
      color: #a7a7a7;
    }

    .yuyin {
      width: 20px;
      height: 20px;
      font-size: 20px;
    }
  }
}
</style>
