<template>
  <div class="SearchResult" @scroll="homeComp">
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
        <div class="searchBtn" @click="research">搜索</div>
      </template>
    </search-bar>
    <van-tabs
      background="#f5f5f5"
      offset-top="51"
      v-model="active"
      swipeable
      animated
      sticky
      lazy-render
      v-show="mainPageView"
      ref="tabs"
    >
      <van-tab :title="'综合'" name="allData">
        <div class="box" v-if="allResult">
          <div class="allView">
            <div class="youLike">
              <div class="title">
                <span class="text">单曲</span>
                <div class="allPlay">
                  <i class="iconfont icon-bofang bofang"></i>
                  <span class="allText">播放全部</span>
                </div>
              </div>
              <div class="mainArea">
                <detail-list
                  ref="detailList"
                  :detailListData="allSongsSmallList"
                  :playTopColor="playTopColor"
                  :minHeight="minHeight"
                  :paddingLeft="paddingLeft"
                  :paddingRight="paddingRight"
                  :paddingLeftMsg="paddingLeftMsg"
                  @changeList="changeList"
                  class="detailList"
                >
                  <div></div>
                  <template v-slot:number> <div></div> </template
                ></detail-list>
              </div>
              <div class="more" @click="toSongsTab">
                {{ allResult.song.moreText }}
                <i class="iconfont icon-arrow-right-bold"></i>
              </div>
            </div>
          </div>
          <user-play-list
            :userListData="allResult.playList.playLists"
            class="playList"
          >
            <template v-slot:title>
              <div class="title">歌单</div>
            </template>
            <template v-slot:seeAll>
              <div class="all" @click="toAllPlayList">
                <div>查看全部</div>
                <i class="iconfont icon-arrow-right-bold bold"></i>
              </div> </template
          ></user-play-list>
        </div>
      </van-tab>
      <van-tab :title="'单曲'" name="songData" class="songArea">
        <div class="box">
          <detail-list
            ref="detailList"
            :detailListData="allSongsListSlice"
            :playTopColor="playTopColor"
            :paddingLeftMsg="paddingLeftMsg"
            :ofTop="ofTop"
            @changeList="changeList"
            class="detailList"
          >
            <template v-slot:number> <div></div> </template>
          </detail-list>
        </div>
      </van-tab>
      <van-tab :title="'歌单'" name="PlayListData" class="PlayListArea">
        <div class="box">
          <search-play-list-view
            :userListData="playListSlice"
          ></search-play-list-view>
        </div>
      </van-tab>
    </van-tabs>
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
import DetailList from "@/components/DetailList.vue";
import userPlayList from "@/components/userPlayList.vue";
import SearchPlayListView from "@/components/SearchPlayListView.vue";

import { mapState } from "vuex";

import {
  getSearchDefault,
  getSearchSuggest,
  getSearchResult,
  getMusicDetail,
} from "@/api/home.js";

export default {
  components: {
    SearchBar,
    DetailList,
    userPlayList,
    SearchPlayListView,
  },
  data() {
    return {
      active: 0,
      searchBarColor: "transparent",
      searchColor: "#fdfefd",
      advertisementAreaShow: true,
      searchHotData: null,
      mainPageView: true,
      searchWord: "",
      searchSuggestData: null,
      allSongsSmallList: null,
      allSongsList: null,
      allSongsListSlice: null,
      songsListArr: [],
      allResult: null,
      playTopColor:
        "linear-gradient(to bottom,rgba(241, 240, 236, 0.6) 1%,#fff)",
      musicListClickNum: 0,
      minHeight: "0px",
      paddingLeft: "0px",
      paddingLeftMsg: "0px",
      paddingRight: "0px",
      sliceNum: 20,
      slicePlayList: 20,
      playList: null,
      playListSlice: null,
      ofTop: 0
    };
  },
  computed: {
    ...mapState({
      musicListStore: (state) => state.musicListStore,
      musicListClick: (state) => state.musicListClick,
    }),
  },
  methods: {
    // 监听首页滚动对样式进行修改
    homeComp(event) {
      // 修改顶部搜索栏
      if (event.target.scrollTop >= 25) {
        this.searchBarColor = "#f5f5f5";
        this.searchColor = "#e6ebea";
      } else {
        this.searchBarColor = "blur(0px)";
        this.searchColor = "#fdfefd";
      }

      if (
        event.target.scrollTop + event.target.clientHeight >=
          event.target.scrollHeight &&
        this.allSongsList
      ) {
        this.sliceNum = this.sliceNum + 20;
        this.allSongsListSlice = this.allSongsList.slice(0, this.sliceNum + 20);
      }

      if (
        event.target.scrollTop + event.target.clientHeight >=
          event.target.scrollHeight &&
        this.playList
      ) {
        this.slicePlayList = this.slicePlayList + 20;
        this.playListSlice = this.playList.slice(0, this.slicePlayList + 20);
      }
    },
    // 返回上一页
    toHome() {
      this.$router.back();
    },
    // 关闭广告
    closeText() {
      this.advertisementAreaShow = false;
    },
    // 搜索
    toSearch() {
      this.mainPageView = false;
      if (this.searchWord != "") {
        this.getSearchSuggestData(this.searchWord);
      }
      this.searchWord = ''
    },
    // 取消搜索
    toNoSearch() {
      this.mainPageView = true;
    },
    // 搜索关键字
    searchWordEnter() {
      if (this.searchWord != "") {
        this.getSearchSuggestData(this.searchWord);
      }
    },
    // 跳转到单曲tab
    toSongsTab() {
      this.$refs.tabs.scrollTo("songData");
      this.$refs.tabs.resize()
    },
    // 跳到歌单tab
    toAllPlayList() {
      this.$refs.tabs.scrollTo("PlayListData");
      this.$refs.tabs.resize()
    },
    // 换歌单
    changeList() {
      this.$store.commit("musicListChange", this.allSongsList);
      this.$store.commit("musucListOldChange", this.allSongsList);
      this.musicListClickNum = this.musicListClick;
      this.$store.commit("musicListClickChange", ++this.musicListClickNum);
    },
    // 重新搜索
    research() {
      this.getSearchDefaultData(); // 获取默认关键词数据
      this.getSearchResultData(this.searchWord); // 获取综合搜索结果
      this.getSearchResultSongsData(this.searchWord, 1, 100); // 获取单曲搜索结果
      this.getSearchResultPlayListData(this.searchWord, 1000, 100);
    },
    // 点击搜索建议跳转到相应结果
    toItem(keyword) {
      this.getSearchDefaultData(); // 获取默认关键词数据
      this.getSearchResultData(keyword); // 获取综合搜索结果
      this.getSearchResultSongsData(keyword, 1, 100); // 获取单曲搜索结果
      this.getSearchResultPlayListData(keyword, 1000, 100);
      this.toNoSearch()
    },
    // 触底懒加载
    lazyLoad(event) {
      if (
        event.target.scrollTop + event.target.clientHeight >=
        event.target.scrollHeight
      ) {
        this.sliceNum = this.sliceNum + 20;
        this.userListDataSlice = this.userListData.slice(0, this.sliceNum + 20);
      }
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
    getSearchResultData(keywords, type = 1018) {
      getSearchResult(keywords, type).then((data) => {
        this.allSongsSmallList = data.result.song.songs;
        this.allSongsSmallList = this.allSongsSmallList.slice(0, 6);
        this.allResult = data.result;
        this.searchWord = this.$route.query.keywords;
      });
    },
    getSearchResultSongsData(keywords, type = 1018, limit = 100) {
      getSearchResult(keywords, type, limit).then(async (data) => {
        for (let item of data.result.songs) {
          await getMusicDetail(item.id).then((data) => {
            this.songsListArr.push(data.songs[0]);
          });
        }
        this.allSongsList = this.songsListArr;
        this.allSongsListSlice = this.allSongsList.slice(0, 20);
      });
    },
    getSearchResultPlayListData(keywords, type = 1000, limit = 100) {
      getSearchResult(keywords, type, limit).then((data) => {
        this.playList = data.result.playlists;
      });
    },
  },
  created() {
    this.getSearchDefaultData(); // 获取默认关键词数据
    this.getSearchResultData(this.$route.query.keywords); // 获取综合搜索结果
    this.getSearchResultSongsData(this.$route.query.keywords, 1, 100); // 获取单曲搜索结果
    this.getSearchResultPlayListData(this.$route.query.keywords, 1000, 100); // 获取歌单搜索结果
  },
};
</script>
<style lang="scss" scoped>
.SearchResult {
  width: 100%;
  height: 100%;
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

  .van-tab__pane {
    height: 100%;

    .box {
      padding-left: 13px;
      padding-right: 13px;
      padding-bottom: 50px;
      margin-top: 10px;

      .allView {
        width: 100%;
        background-color: #fff;
        box-sizing: border-box;
        padding-left: 13px;
        padding-right: 13px;
        border-radius: 10px;
        overflow: hidden;

        .title {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 15px;
          margin-bottom: 15px;

          .text {
            color: #111111;
            font-weight: 600;
          }

          .allPlay {
            border: 1px solid #f83a35;
            border-radius: 20px;
            box-sizing: border-box;
            padding: 3px 10px;
            color: #f83a35;

            .bofang {
              font-size: 12px;
            }

            .allText {
              font-size: 12px;
            }
          }
        }

        .more {
          display: flex;
          justify-content: center;
          align-items: center;
          text-align: center;
          font-size: 12px;
          color: #c5c5c5;
          margin-bottom: 15px;

          i {
            font-size: 12px;
            color: #c5c5c5;
          }
        }
      }

      .playList {
        margin-top: 15px;
        border-radius: 10px;
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
