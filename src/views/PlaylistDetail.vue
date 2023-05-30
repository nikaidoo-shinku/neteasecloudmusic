<template>
  <div
    class="playlistDetail"
    v-if="PlayListDetailData"
    ref="playlistDetail"
    @scroll="homeComp">
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <search-bar
        class="searchBar"
        :searchBarColor="searchBarColor"
        :searchColor="searchColor">
        <template v-slot:leftic>
          <div class="iconfont icon-arrow-left-bold bold" @click="toHome"></div>
        </template>
        <template v-slot:middle>
          <div class="main">
            <span>歌单</span>
            <div class="iconfont icon-search search"></div>
          </div>
        </template>
        <template v-slot:rightic>
          <div
            class="iconfont icon-gengduo gengduo"
            style="transform: rotate(90deg)"></div>
        </template>
      </search-bar>
      <div class="msgArea">
        <div class="msg">
          <div class="imgArea">
            <div class="img">
              <img :src="PlayListDetailData.coverImgUrl" alt="" />
            </div>
            <div class="mask"></div>
          </div>
          <div class="text">
            <div class="msgName">
              <p class="txt-cut">{{ PlayListDetailData.name }}</p>
              <i class="iconfont icon-arrow-down-bold"></i>
            </div>
            <div class="userName">
              <div class="img">
                <img :src="PlayListDetailData.creator.avatarUrl" alt="" />
              </div>
              <span class="name">{{
                PlayListDetailData.creator.nickname
              }}</span>
              <div class="follow">+关注</div>
            </div>
            <div class="msgTag">
              <span
                v-for="(item, index) in PlayListDetailData.tags"
                :key="index">
                {{ item }}
                <i class="iconfont icon-arrow-right-bold"></i>
              </span>
            </div>
          </div>
        </div>
        <div class="des">
          <div class="one-txt" ref="des">
            {{ PlayListDetailData.description }}
          </div>
          <i class="iconfont icon-arrow-right-bold"></i>
        </div>
        <div class="todo">
          <div class="share">
            <van-icon name="share" size="22px" />
            <span>{{ PlayListDetailData.shareCount }}</span>
          </div>
          <div class="comment" @click="toComment($route.query.id)">
            <van-icon name="chat" size="22px" />
            <span>{{ PlayListDetailData.commentCount }}</span>
          </div>
          <div
            class="like"
            :style="{
              backgroundColor: t == 1 ? '#ff2559' : 'rgba(255, 255, 255, 0.1)',
            }"
            @click="subscribed">
            <van-icon name="add-square" size="22px" />
            <span>{{ PlayListDetailData.subscribedCount }}</span>
          </div>
        </div>
      </div>
      <detail-list
        ref="detailList"
        :detailListData="detailListData"
        :playTopColor="playTopColor"
        @changeList="changeList"></detail-list>
    </van-pull-refresh>
  </div>
</template>
<script>
  import ColorThief from "colorthief";

  import { Toast } from "vant";

  import SearchBar from "@/components/SearchBar.vue";
  import DetailList from "@/components/DetailList.vue";

  import { mapState } from "vuex";

  import {
    getPlayListDetail,
    getPlayListDetailAll,
    getPlaylistSubscribe,
  } from "@/api/home.js";

  import shuffleArray from "@/hooks/shuffleArray.js";

  export default {
    components: {
      SearchBar,
      DetailList,
    },
    porps: {
      musicPlay: {
        type: Number,
        default: 0,
      },
      musicInd: {
        type: Number,
        default: 0,
      },
    },
    data() {
      return {
        PlayListDetailData: null,
        detailListData: null,
        searchBarColor: "transparent",
        searchColor: "#fdfefd",
        container: null,
        playTopColor:
          "linear-gradient(to bottom,rgba(241, 240, 236, 0.6) 1%,#fff)",
        isLoading: false,
        musicListClickNum: 0,
        t: 2,
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

        if (event.target.scrollTop >= 237) {
          this.searchBarColor = this.$refs.playlistDetail.style.backgroundColor;
          this.playTopColor = "linear-gradient(to bottom,#fff,#fff)";
        } else {
          this.playTopColor =
            "linear-gradient(to bottom,rgba(241, 240, 236, 0.6) 1%,#fff)";
        }
      },
      // 返回上一页
      toHome() {
        this.$router.back();
      },
      // 下拉刷新
      onRefresh() {
        setTimeout(() => {
          Toast("刷新成功");
          this.isLoading = false;
          this.getPlayListDetailData(this.$route.query.id); // 根据歌单id请求相应歌单详情页数据
        }, 1000);
      },
      // 换歌单
      changeList() {
        this.$store.commit("musicListChange", this.detailListData);
        this.$store.commit("musucListOldChange", this.detailListData);
        this.musicListClickNum = this.musicListClick;
        this.$store.commit("musicListClickChange", ++this.musicListClickNum);
      },
      // 跳转到评论
      toComment(id) {
        this.$router.push({ name: "comment", query: { id: id } });
      },
      // 收藏歌单
      subscribed() {
        if (this.t == 1) {
          this.t = 2;
        } else if (this.t == 2) {
          this.t = 1;
        }
        this.getPlaylistSubscribeFun();
      },
      getPlayListDetailData(id) {
        getPlayListDetail(id).then((data) => {
          this.PlayListDetailData = data.playlist;

          if (this.PlayListDetailData.subscribed) {
            this.t = 1;
          } else {
            this.t = 2;
          }

          const img = new Image();
          img.crossOrigin = "";
          img.src = this.PlayListDetailData.coverImgUrl;
          img.onload = () => {
            const colorThief = new ColorThief();
            const color = colorThief.getColor(img);
            this.$refs.playlistDetail.style.backgroundColor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
            this.$refs.des.style.boxShadow = `inset -10px 0px 0px 0px rgb(${color[0]}, ${color[1]}, ${color[2]})`;
          };
        });
      },
      getPlayListDetailAllData(id) {
        getPlayListDetailAll(id).then((data) => {
          this.detailListData = data.songs;
        });
      },
      getPlaylistSubscribeFun() {
        getPlaylistSubscribe({
          t: this.t,
          id: this.$route.query.id,
        }).then((data) => {
          console.log(data);
          // this.playlist = data.playlist;
          // console.log(this.playlist);
        });
      },
    },
    watch: {
      musicPlay(val) {
        let item = this.detailListData[this.musicInd + 1];
        this.$store.commit("musicIdChange", {
          id: item.id,
          ind: this.musicInd + 1,
          songName: item.name,
          cover: item.al.picUrl,
          time: item.dt,
          ar: item.ar[0].name,
        });
        this.getMusicDetailAction();
        this.getMusicWordAction();
      },
    },
    created() {
      this.getPlayListDetailData(this.$route.query.id); // 根据歌单id请求相应歌单详情页数据
      this.getPlayListDetailAllData(this.$route.query.id); // 根据歌单id请求相应歌单详情页完整数据
    },
    mounted() {
      this.container = this.$refs.playlistDetail;
    },
  };
</script>
<style lang="scss" scoped>
  .playlistDetail {
    width: 100%;
    height: 100%;
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
      height: 237px;
      box-sizing: border-box;
      // padding-top: 17px;
      padding-left: 15px;
      padding-right: 15px;

      .msg {
        width: 100%;
        height: 112px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .imgArea {
          width: 105px;
          height: 105px;
          position: relative;

          .img {
            width: 100%;
            height: 100%;
            overflow: hidden;
            border-radius: 10px;
            position: absolute;
            z-index: 1;

            img {
              width: 100%;
              height: 100%;
              position: absolute;
              z-index: 1;
            }
          }

          .mask {
            width: 86px;
            height: 86px;
            border-radius: 10px;
            background-color: rgba(255, 255, 255, 0.1);
            position: absolute;
            top: -5px;
            left: 50%;
            transform: translate(-50%);
          }
        }

        .text {
          flex: 1;
          height: 100%;
          margin-left: 12px;

          .msgName {
            display: flex;
            justify-content: space-between;

            p {
              flex: 1;
              font-weight: 550;
              color: #fff;
              font-size: 15px;
            }

            i {
              display: inline-block;
              width: 22px;
              height: 22px;
              line-height: 22px;
              text-align: center;
              border-radius: 50%;
              color: #fff;
              background-color: rgba(255, 255, 255, 0.1);
            }
          }

          .userName {
            display: flex;
            align-items: center;
            margin-top: 15px;
            font-size: 12px;

            .img {
              width: 25px;
              height: 25px;
              border-radius: 50%;
              overflow: hidden;

              img {
                width: 100%;
                height: 100%;
              }
            }

            .name {
              margin-left: 5px;
              margin-right: 5px;
              color: rgba(255, 255, 255, 0.6);
            }

            .follow {
              width: 48px;
              height: 20px;
              text-align: center;
              box-sizing: border-box;
              line-height: 10px;
              padding: 6px;
              color: rgba(255, 255, 255, 0.6);
              background-color: rgba(255, 255, 255, 0.1);
              border-radius: 20px;
            }
          }

          .msgTag {
            margin-top: 10px;
            font-size: 10px;
            color: #fff;

            span {
              display: inline-block;
              box-sizing: border-box;
              padding: 4px 6px;
              line-height: 10px;
              transform-origin: top left;
              transform: scale(0.75);
              background-color: rgba(255, 255, 255, 0.1);
              border-radius: 4px;
              margin-left: -5px;

              &:first-child {
                margin-left: 0px;
              }

              i {
                font-size: 10px;
                display: inline-block;
                margin-left: -2px;
                color: #fff;
              }
            }
          }
        }
      }

      .des {
        width: 100%;
        height: 12px;
        margin-top: 15px;
        font-size: 12px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .one-txt {
          flex: 1;
          height: 12px;
          line-height: 12px;
          position: relative;
          overflow: hidden;
          white-space: nowrap;
          color: rgba(255, 255, 255, 0.6);
        }

        i {
          margin-left: 25px;
          font-size: 16px;
          color: rgba(255, 255, 255, 0.6);
        }
      }

      .todo {
        width: 100%;
        height: 42px;
        margin-top: 20px;
        display: flex;
        justify-content: space-between;

        .share {
          width: 105px;
          height: 100%;
          background-color: rgba(255, 255, 255, 0.1);
          display: flex;
          justify-content: center;
          align-items: center;
          color: #fff;
          border-radius: 20px;

          span {
            font-size: 13px;
            margin-left: 6px;
          }
        }

        .comment {
          width: 105px;
          height: 100%;
          background-color: rgba(255, 255, 255, 0.1);
          display: flex;
          justify-content: center;
          align-items: center;
          color: #fff;
          border-radius: 20px;

          span {
            font-size: 13px;
            margin-left: 6px;
          }
        }

        .like {
          width: 105px;
          height: 100%;
          background-color: #ff2559;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #fff;
          border-radius: 20px;

          span {
            font-size: 13px;
            margin-left: 6px;
          }
        }
      }
    }
  }
</style>
