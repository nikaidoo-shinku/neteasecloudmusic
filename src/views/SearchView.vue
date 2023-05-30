<template>
  <div class="searchView" @scroll="homeComp">
    <search-bar
      class="searchBar"
      :searchBarColor="searchBarColor"
      :searchColor="searchColor"
    >
      <template v-slot:leftic>
        <div class="iconfont icon-arrow-left-bold bold" @click="toHome"></div>
      </template>
      <template v-slot:middle>
        <div class="main">
          <div class="mainSearch">
            <div class="iconfont icon-search"></div>
            <input
              type="text"
              @focus="toSearch"
              @keyup="searchWordEnter"
              v-model.trim="searchWord"
            />
          </div>
          <i class="iconfont icon-close closeSearch" @click="toNoSearch"></i>
        </div>
      </template>
      <template v-slot:rightic>
        <div class="searchBtn" @click="toSearchResult">搜索</div>
      </template>
    </search-bar>
    <div class="mainPage" v-show="mainPageView">
      <div class="topTip">
        <div>
          <i class="iconfont icon-geshou"></i>
          <span>歌手</span>
        </div>
        <div>
          <i class="iconfont icon-gedan"></i>
          <span>曲风</span>
        </div>
        <div>
          <i class="iconfont icon-fenlei2"></i>
          <span>专区</span>
        </div>
        <div>
          <i class="iconfont icon-tinggeshiqu"></i>
          <span>识曲</span>
        </div>
      </div>
      <div class="advertisementArea" v-if="advertisementAreaShow">
        <div class="advertisement">
          <img
            src="../assets/img/yande.re 1025642 5_nenme_no_houkago dress kantoku kurumi_(kantoku).jpg"
            alt=""
          />
          <div class="tip">
            <span class="text">广告</span>
            <span class="close" @click="closeText">X</span>
          </div>
        </div>
      </div>
      <div class="youLike">
        <div class="titleArea">
          <div class="title">猜你喜欢</div>
          <van-icon name="replay" size="14" color="#babbbf" />
        </div>
        <div class="megArea">
          <span>张杰</span>
          <span>handsome lau</span>
          <span>必杀技</span>
          <span>哪里都是你</span>
        </div>
      </div>
      <div class="moduleArea">
        <div class="swiper mySwiper">
          <div class="swiper-wrapper">
            <div class="swiper-slide" v-for="it in 8" :key="it">
              <div class="titleArea">
                <div class="title">热搜榜</div>
                <div class="btn">
                  <i class="iconfont icon-bofang bofang"></i>
                  <span>播放</span>
                </div>
              </div>
              <div class="msg" v-if="searchHotData">
                <div
                  class="item one-txt-cut"
                  v-for="(item, index) in searchHotData"
                  :key="item.score"
                >
                  <div :class="['num', { active: index + 1 <= 3 }]">
                    {{ index + 1 }}
                  </div>
                  <div class="word one-txt-cut">{{ item.searchWord }}</div>
                  <div class="hot">
                    <img :src="item.iconUrl" alt="" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="searchItemArea" v-show="!mainPageView">
      <div
        class="item one-txt-cut"
        v-for="(item, index) in searchSuggestData"
        :key="index"
        @click.stop="toItem(item.keyword)"
      >
        <i class="iconfont icon-search search"></i>
        <div class="itemWord one-txt-cut">{{ item.keyword }}</div>
      </div>
    </div>
  </div>
</template> 
<script>
import SearchBar from "@/components/SearchBar.vue";

import {
  getSearchHot,
  getSearchDefault,
  getSearchSuggest,
} from "@/api/home.js";

import Swiper from "swiper"; // 注意引入的是Swiper
import "swiper/css/swiper.min.css"; // 注意这里的引入

export default {
  components: {
    SearchBar,
  },
  data() {
    return {
      searchBarColor: "transparent",
      searchColor: "#fdfefd",
      advertisementAreaShow: true,
      searchHotData: null,
      mainPageView: true,
      searchWord: "",
      searchSuggestData: null,
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
    // 返回上一页
    toHome() {
      this.$router.push({ name: "home" });
    },
    // 关闭广告
    closeText() {
      this.advertisementAreaShow = false;
    },
    // 搜索
    toSearch() {
      this.mainPageView = false;
      if(this.searchWord != '') {
        this.getSearchSuggestData(this.searchWord);
      }
    },
    // 取消搜索
    toNoSearch() {
      this.mainPageView = true;
    },
    // 搜索关键字
    searchWordEnter() {
      if (this.searchWord != '') {
        this.getSearchSuggestData(this.searchWord);
      }
    },
    // 跳转到搜索结果界面
    toSearchResult() {
      this.$router.push({name: 'searchResult', query: {keywords: this.searchWord}})
    },
    // 点击搜索建议跳转到相应结果
    toItem(keyword) {
      this.$router.push({name: 'searchResult', query: {keywords: keyword}})
    },
    getSearchHotData() {
      getSearchHot().then((data) => {
        this.searchHotData = data.data;
      });
    },
    getSearchDefaultData() {
      getSearchDefault().then((data) => {
        this.searchWord = data.data.showKeyword;
      });
    },
    getSearchSuggestData(keywords) {
      getSearchSuggest(keywords).then((data) => {
        this.searchSuggestData = data.result.allMatch;
      });
    },
  },
  created() {
    this.getSearchHotData(); // 获取热搜榜数据
    this.getSearchDefaultData(); // 获取默认关键词数据
  },
  mounted() {
    // Swiper实例
    new Swiper(".mySwiper", {
      pagination: ".swiper-pagination",
      slidesPerView: "auto",
      paginationClickable: true,
      spaceBetween: 8,
      freeMode: true,
      observer: true,
      observeSlideChildren: true
    });
  },
};
</script>
<style lang="scss" scoped>
.searchView {
  height: 100%;
  background-color: #f2f3f7;
  overflow: scroll;

  .searchBar {
    .bold {
      font-size: 25px;
    }
    .main {
      width: 100%;
      height: 32px;
      border-radius: 25px;
      margin-left: 15px;
      margin-right: 15px;
      background-color: #ffffff;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-sizing: border-box;
      padding-left: 12px;
      padding-right: 12px;

      .mainSearch {
        display: flex;
        align-items: center;
        box-sizing: border-box;
        padding-left: 12px;
        padding-right: 12px;

        input {
          flex: 1;
          border: none;
          font-size: 12px;
          margin-left: 5px;
          color: #b6b6b6;
        }

        div {
          color: #828282;
        }

        span {
          font-size: 13px;
          color: #b6b6b6;
        }
      }

      .closeSearch {
        font-size: 12px;
        color: #fff;
        transform-origin: bottom;
        transform: scale(0.9);
        padding: 2px;
        background-color: #ccc;
        border-radius: 50%;
      }
    }

    .searchBtn {
      width: 30px;
      font-size: 15px;
      white-space: nowrap;
    }
  }

  .topTip {
    width: 100%;
    height: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 4px;

    div {
      flex: 1;
      font-size: 13px;
      border-right: 1px solid #eaebef;
      text-align: center;

      i {
        color: #ff3c37;
      }

      span {
        margin-left: 7px;
      }
    }
  }

  .advertisementArea {
    width: 100%;
    height: 54px;
    padding-left: 13px;
    padding-right: 13px;
    margin-top: 25px;
    box-sizing: border-box;
    .advertisement {
      width: 100%;
      height: 54px;
      overflow: hidden;
      border-radius: 10px;
      position: relative;

      img {
        width: auto;
      }

      .tip {
        position: absolute;
        top: 5px;
        right: 5px;
        display: flex;
        align-items: center;
        font-size: 12px;

        .text {
          background-color: #fff;
          padding: 2px 3px;
          margin-right: 3px;
          border-top-left-radius: 10px;
          border-bottom-left-radius: 10px;
          border-top-right-radius: 7px;
          border-bottom-right-radius: 7px;
          transform: scale(0.8);
          font-weight: 550;
        }

        .close {
          color: #f3f2e2;
          transform-origin: bottom;
          transform: scale(0.8);
        }
      }
    }
  }

  .youLike {
    width: 100%;
    box-sizing: border-box;
    padding-left: 13px;
    padding-right: 13px;
    margin-top: 12px;

    .titleArea {
      width: 100%;
      height: 14px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .title {
        font-size: 14px;
      }
    }

    .megArea {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      margin-top: 10px;

      span {
        display: inline-block;
        height: 26px;
        box-sizing: border-box;
        font-size: 12px;
        line-height: 26px;
        padding-left: 12px;
        padding-right: 12px;
        background-color: #fefefe;
        margin-right: 5px;
        border-radius: 20px;
        color: #636367;
      }
    }
  }

  .moduleArea {
    width: 100vw;
    margin-top: 20px;
    padding-bottom: 45px;
    overflow: hidden;

    .swiper {
      width: 100%;

      .swiper-slide {
        width: 240px;
        background-color: #ffffff;
        box-sizing: border-box;
        padding: 12px 15px 0px 15px;
        border-radius: 10px;
        &:first-child {
          margin-left: 13px;
        }

        .titleArea {
          display: flex;
          align-items: center;
          padding-bottom: 12px;
          border-bottom: 2px solid #f7f7f7;

          .title {
            height: 16px;
            line-height: 16px;
            font-weight: 550;
          }

          .btn {
            width: 47px;
            height: 22px;
            margin-left: 12px;
            font-size: 12px;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #f2f2f2;
            border-radius: 20px;

            .bofang {
              font-size: 12px;
            }
          }
        }

        .msg {
          margin-top: 15px;

          .item {
            height: 15px;
            font-size: 14px;
            margin-bottom: 22px;
            display: flex;
            align-items: flex-end;

            .num {
              width: 22px;
              color: #656468;
            }

            .active {
              color: #f83c33;
            }

            .word {
              display: inline-block;
              line-height: 15px;
              color: #273132;
            }

            .hot {
              width: 20px;
              height: 15px;
              margin-left: 5px;
              overflow: hidden;

              img {
                width: 100%;
              }
            }
          }
        }
      }
    }
  }

  .searchItemArea {
    width: 100%;
    height: 100%;
    background-color: #f2f3f7;

    .item {
      width: 100%;
      height: 30px;
      box-sizing: border-box;
      padding-left: 15px;
      display: flex;
      align-items: flex-start;
      margin-top: 10px;

      .search {
        line-height: 20px;
        color: #606877;
      }

      .itemWord {
        flex: 1;
        font-size: 14px;
        margin-left: 5px;
        color: #606877;
        border-bottom: 2px solid rgba(217, 218, 222, 0.5);
        padding-bottom: 10px;
      }
    }
  }
}
</style>
