<template>
  <div class="dayMusicList" ref="dayMusicList" @scroll="homeComp" v-if="detailListData">
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
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
            <span>默认推荐</span>
            <div class="iconfont icon-search search"></div>
          </div>
        </template>
        <template v-slot:rightic>
          <div
            class="iconfont icon-gengduo gengduo"
            style="transform: rotate(90deg)"
          ></div>
        </template>
      </search-bar>
      <div class="msgArea">
        <div class="time">
          <div class="date">
            <span class="day">{{ day }}</span>
            <span>/</span>
            <span>{{ mon }}</span>
          </div>
          <span class="everyDay">
            查看今日运势
            <i class="iconfont icon-arrow-right-bold bold"></i>
          </span>
        </div>
      </div>
      <detail-list
        ref="detailList"
        :detailListData="detailListData"
        :playTopColor="playTopColor"
        @changeList="changeList"
      ></detail-list>
    </van-pull-refresh>
  </div>
</template>
<script>
import SearchBar from "@/components/SearchBar.vue";
import DetailList from "@/components/DetailList.vue";

import { Toast } from "vant";

import { mapState } from "vuex";

import { getDayMusicList } from "@/api/home.js";

export default {
  components: {
    SearchBar,
    DetailList,
  },
  data() {
    return {
      mon: "01",
      day: "01",
      detailListData: null,
      playTopColor: null,
      searchBarColor: "transparent",
      searchColor: "#fdfefd",
      playTopColor:
        "linear-gradient(to bottom,rgba(241, 240, 236, 0.6) 1%,#fff)",
      isLoading: false,
      musicListClickNum: 0,
    };
  },
  computed: {
    ...mapState({
      musicListStore: (state) => state.musicListStore,
      musicListClick: (state) => state.musicListClick,
    }),
  },
  methods: {
    // 监听详情页滚动对样式做修改
    homeComp(event) {
      if (event.target.scrollTop >= 25) {
        this.searchBarColor = "blur(10px)";
        this.searchColor = "#e6ebea";
      } else {
        this.searchBarColor = "transparent";
        this.searchColor = "#fdfefd";
      }

      if (event.target.scrollTop >= 180) {
        this.searchBarColor =
          "linear-gradient(to bottom right, #d37575 1%, #67afd3)";
        this.playTopColor = "linear-gradient(to bottom,#fff,#fff)";
      } else {
        this.playTopColor =
          "linear-gradient(to bottom,rgba(241, 240, 236, 0.6) 1%,#fff)";
      }
    },
    // 返回首页
    toHome() {
      this.$router.push("home");
    },
    // 获取并格式化今日日期
    getDate() {
      // 获取并格式化今日日期
      let date = new Date();
      let day = date.getDate();
      let mon = date.getMonth() + 1;
      day = day < 10 ? `0${day}` : day;
      mon = mon < 10 ? `0${mon}` : mon;
      this.day = day;
      this.mon = mon;
    },
     // 下拉刷新
    onRefresh() {
      setTimeout(() => {
        Toast("刷新成功");
        this.isLoading = false;
        this.getDayMusicListData(); // 请求每日推荐数据
      }, 1000);
    },
    // 换歌单
    changeList() {
      this.$store.commit("musicListChange", this.detailListData);
      this.$store.commit("musucListOldChange", this.detailListData);
      this.musicListClickNum = this.musicListClick;
      this.$store.commit("musicListClickChange", ++this.musicListClickNum);
    },
    getDayMusicListData() {
      getDayMusicList().then((data) => {
        this.detailListData = data.data.dailySongs;
      });
    },
  },
  created() {
    this.getDayMusicListData(); // 请求每日推荐数据
    this.getDate(); // 调用日期方法获取并格式化今日日期
  },
};
</script>
<style lang="scss" scoped>
.dayMusicList {
  width: 100%;
  height: 100%;
  background-image: linear-gradient(to bottom right, #d37575 1%, #67afd3);
  overflow: scroll;
  .searchBar {
    color: #fff;

    .bold {
      font-size: 20px;
    }

    .main {
      height: 27px;
      flex: 1;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-sizing: border-box;
      padding-left: 13px;
      padding-right: 13px;

      span {
        font-weight: 550;
      }

      .search {
        font-size: 20px;
        line-height: 25px;
        font-weight: 600;
      }
    }

    .gengduo {
      font-size: 20px;
    }
  }

  .msgArea {
    width: 100%;
    height: 180px;
    box-sizing: border-box;
    // padding-top: 17px;
    padding-left: 15px;
    padding-right: 15px;
    display: flex;
    align-items: center;
    color: #fff;

    .time {
      width: 105px;
      height: 105px;

      .date {
        font-size: 15px;
        font-weight: 550;

        .day {
          font-size: 30px;
          font-weight: 600;
        }
      }

      .everyDay {
        height: 14px;
        font-size: 14px;
        display: flex;
        align-items: center;

        .bold {
          line-height: 14px;
        }
      }
    }
  }
}
</style>
