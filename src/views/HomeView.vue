<template>
  <div class="home" @scroll="homeComp" ref="home">
    <van-pull-refresh
      v-model="isLoading"
      @refresh="onRefresh"
      style="min-height: 100vh"
    >
      <div class="homeTop" ref="homeTop">
        <search-bar
          :searchBarColor="searchBarColor"
          :searchColor="searchColor"
          @showPopupTo="showPopupTo"
        ></search-bar>
        <swiper
          :bannerData="bannerData"
          @backgroundchange="backgroundchange"
        ></swiper>
        <category-view :DragonBallData="DragonBallData"></category-view>
      </div>
      <song-list :personalizedData="personalizedData"></song-list>
      <good-music
        :goodMusicData="goodMusicData"
        @reFresh="reFresh"
      ></good-music>
    </van-pull-refresh>
    <van-popup
      v-model="show"
      position="left"
      :style="{ width: '80%', height: '100%' }"
    >
      <login-popup></login-popup>
    </van-popup>
  </div>
</template>
<script>
import CategoryView from "@/components/CategoryView.vue";
import SearchBar from "@/components/SearchBar.vue";
import Swiper from "@/components/Swiper.vue";
import SongList from "@/components/SongList.vue";
import GoodMusic from "@/components/GoodMusic.vue";
import LoginPopup from "@/components/LoginPopup.vue";

import { Toast } from "vant";
// import Swiper from "swiper"; // 注意引入的是Swiper
// import "swiper/css/swiper.min.css"; // 注意这里的引入

import {
  getBanner,
  getPersonalized,
  getDragonBall,
  getBlock,
} from "@/api/home.js";
import LoginPopupVue from "@/components/LoginPopup.vue";
import LoginViewVue from "./LoginView.vue";

// window.onload = function () {
//   var mySwiper = new Swiper(".swiper-container", {
//     pagination: ".swiper-pagination",
//     slidesPerView: 'auto',
//     paginationClickable: true,
//     spaceBetween: 30,
//     freeMode: true,
//   });
// };

export default {
  name: "homeName",
  components: {
    SearchBar,
    Swiper,
    CategoryView,
    SongList,
    GoodMusic,
    LoginPopup,
  },
  data() {
    return {
      searchBarColor: "transparent",
      searchColor: "#fdfefd",
      bannerData: [],
      personalizedData: [],
      DragonBallData: [],
      goodMusicData: null,
      container: null,
      isLoading: false,
      show: false,
    };
  },
  methods: {
    // 监听首页滚动对样式进行修改
    homeComp(event) {
      // 修改顶部搜索栏
      if (event.target.scrollTop >= 25) {
        this.searchBarColor = "blur(10px)";
        this.searchColor = "#e6ebea";
      } else {
        this.searchBarColor = "blur(0px)";
        this.searchColor = "#fdfefd";
      }
    },
    // 局部刷新GoodMusic组件数据
    reFresh() {
      this.getGoodMusicData();
    },
    // 下拉刷新
    onRefresh() {
      setTimeout(() => {
        Toast("刷新成功");
        this.isLoading = false;
        this.getBannerData(); // 请求轮播图数据
        this.getPersonalizedData(); // 请求推荐歌单数据
        this.getDragonBallData(); // 请求首页-发现-圆形图标入口列表
        this.getGoodMusicData(); // 请求首页-发现-为你精选歌曲数据
      }, 1000);
    },
    // 动态修改背景色
    backgroundchange(color) {
      this.$refs.home.style.backgroundImage = `linear-gradient(to bottom, rgb(${color[0]}, ${color[1]}, ${color[2]}) 10px, #f5f5f5 200px)`;
    },
    // 弹出层
    showPopupTo() {
      this.show = true;
    },
    getBannerData() {
      getBanner().then((data) => {
        this.bannerData = data.banners;
      });
    },
    getPersonalizedData() {
      getPersonalized().then((data) => {
        this.personalizedData = data.result;
      });
    },
    getDragonBallData() {
      getDragonBall().then((data) => {
        this.DragonBallData = data.data;
      });
    },
    getGoodMusicData() {
      getBlock().then((data) => {
        let index = data.data.blocks.findIndex((item) => {
          return item.blockCode === "HOMEPAGE_BLOCK_STYLE_RCMD";
        });
        this.goodMusicData = data.data.blocks[index];
      });
    },
  },
  created() {
    this.getBannerData(); // 请求轮播图数据
    this.getPersonalizedData(); // 请求推荐歌单数据
    this.getDragonBallData(); // 请求首页-发现-圆形图标入口列表
    this.getGoodMusicData(); // 请求首页-发现-为你精选歌曲数据
    console.log("sss");
  },
  mounted() {
    this.container = this.$refs.home;
  },
};
</script>
<style lang="scss" scoped>
.home {
  height: 100%;
  overflow: scroll;

  .van-pull-refresh {
    padding-bottom: 60px;
  }
  .homeTop {
    // background-image: linear-gradient(to bottom, #e6ebea 50%, #fff);
    padding-bottom: 10px;
  }
}
</style>
