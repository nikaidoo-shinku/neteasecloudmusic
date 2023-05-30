<template>
  <div class="songPlayDetail" :style="{ transform: translateY }">
    <search-bar
      class="searchBar"
      :searchBarColor="searchBarColor"
      :searchColor="searchColor"
    >
      <template v-slot:leftic>
        <div class="iconfont icon-arrow-down-bold bold" @click="down"></div>
      </template>
      <template v-slot:middle>
        <div class="mainArea one-txt-cut">
          <div class="songName one-txt-cut">
            <span>{{ musicName }}</span>
          </div>
          <div class="singer">
            <div class="name one-txt-cut">
              <span>{{ arName }}</span>
            </div>
            <div class="fo">
              <div class="follow">关注</div>
            </div>
          </div>
        </div>
      </template>
      <template v-slot:rightic>
        <div class="right">
          <div class="cover">
            <img :src="musicCover ? musicCover : defaultCover" alt="" />
          </div>
          <div
            class="iconfont icon-fenxiang1 fenxiang"
            @click="showShare = true"
          ></div>
        </div>
      </template>
    </search-bar>
    <div class="main" @click="changeWord">
      <div class="cover" ref="cover">
        <img :src="musicCover ? musicCover : defaultCover" alt="" />
      </div>
      <div class="wordArea" ref="wordArea">
        <div class="wordMove" ref="wordMove">
          <p
            :class="[{ active: index === count }]"
            v-for="(item, index) in musicWord"
            :key="index"
          >
            {{ item }}
          </p>
        </div>
      </div>
    </div>
    <div class="bottom">
      <div class="tab">
        <van-icon name="like" />
        <i class="iconfont icon-xiazai2 xiazai2"></i>
        <i class="iconfont icon-changge changge"></i>
        <i class="iconfont icon-pinglun pinglun"></i>
        <div
          class="iconfont icon-gengduo gengduo"
          style="transform: rotate(90deg)"
        ></div>
      </div>
      <div class="time">
        <div class="nowTime">{{ currentTime | formatNowTime }}</div>
        <van-slider
          active-color="#8cc4fc"
          inactive-color="rgba(0, 0, 0, .1)"
          v-model="current"
          @change="changeValue"
        >
          <template #button>
            <div class="custom-button"></div>
          </template>
        </van-slider>
        <div class="allTime">
          {{ durationTime | formatNowTime }}
        </div>
      </div>
      <div class="play">
        <i
          class="iconfont icon-xunhuan1 xunhuan1"
          v-show="musicListStore === 0"
          @click="changeMusicStore"
        ></i>
        <i
          class="iconfont icon-suiji suiji"
          v-show="musicListStore === 1"
          @click="changeMusicStore"
        ></i>
        <i
          class="iconfont icon-xunhuan7 xunhuan7"
          v-show="musicListStore === 2"
          @click="changeMusicStore"
        ></i>
        <i
          class="iconfont icon-shangyiqu-wangyiicon wangyiicon"
          @click="upSong"
        ></i>
        <van-icon name="play-circle" v-show="!isPlay" @click="changeOpen" />
        <van-icon name="pause-circle" v-show="isPlay" @click="changeOpen" />
        <i class="iconfont icon-shangyiqu shangyiqu" @click="nextSong"></i>
        <i class="iconfont icon-zanting1 zanting1" @click="smallList"></i>
      </div>
    </div>
    <van-share-sheet
      v-model="showShare"
      title="立即分享给好友"
      :options="options"
    />
  </div>
</template>
<script>
import { mapState } from "vuex";
import { mapActions } from "vuex";

import { shuffleArray } from "@/hooks/shuffleArray.js";
import { deepCopy } from "@/hooks/deepCopy.js";

import SearchBar from "@/components/SearchBar.vue";

export default {
  components: {
    SearchBar,
  },
  props: {
    currentRate: {
      type: Number,
      default: 0,
    },
    duration: {
      type: Number,
      default: 0,
    },
    currentTime: {
      type: Number,
      default: 0,
    },
    isPlay: {
      tyoe: Boolean,
      default: false,
    },
  },
  data() {
    return {
      translateY: "",
      searchBarColor: "transparent",
      searchColor: "#fdfefd",
      defaultCover: require("../assets/img/EqEgKAXC_400x400.png"),
      showShare: false,
      options: [
        [
          { name: "微信", icon: "wechat" },
          { name: "朋友圈", icon: "wechat-moments" },
          { name: "微博", icon: "weibo" },
          { name: "QQ", icon: "qq" },
        ],
        [
          { name: "复制链接", icon: "link" },
          { name: "分享海报", icon: "poster" },
          { name: "二维码", icon: "qrcode" },
          { name: "小程序码", icon: "weapp-qrcode" },
        ],
      ],
      value: 30,
      current: 0,
      durationTime: 0,
      currentTimeDetail: 0,
      noDataTime: "00:00",
      isShow: false,
      countEmp: 0,
      count: 0,
      wordMoveY: 0,
      musicListStore: 0,
      nextMusicPlay: 0,
      musicListOld: [],
      musicIndexOld: 0,
      musicListClickNum: 0,
    };
  },
  computed: {
    ...mapState({
      musicCover: (state) => {
        if (state.musicCover) {
          return state.musicCover + "?param=220y220";
        } else {
          return null;
        }
      },
      musicName: (state) => state.musicName,
      arName: (state) => state.arName,
      musicWord: (state) => state.musicWord,
      time: (state) => state.time,
      musicIndex: (state) => state.musicIndex,
      musicList: (state) => state.musicList,
      musucListOld: (state) => state.musucListOld,
      musicIndex: (state) => state.musicIndex,
      musicTime: (state) => state.musicTime,
      musicListClick: (state) => state.musicListClick,
      // musicPlayStore: (state) => {},
    }),
  },
  methods: {
    // 让歌曲详情页滑出
    changeTransform(obj) {
      this.translateY = obj.translateY;
    },
    // 收起播放详情页
    down() {
      this.translateY = "translateY(100%)";
    },
    // 根据拖动进度条将进度传给App组件，再由App传给底部播放器
    changeValue(val) {
      this.$emit("emitCurrent", val);
    },
    // 根据播放详情页状态更改底部播放器状态
    changeOpen() {
      if (!this.isPlay) {
        this.$emit("changPlayStore", true);
      } else {
        this.$emit("changPlayStore", false);
      }
    },
    // 歌词部分淡入淡出
    changeWord() {
      if (!this.isShow) {
        this.$refs.cover.style.opacity = 0;
        this.$refs.wordArea.style.opacity = 1;
        this.isShow = !this.isShow;
      } else {
        this.$refs.cover.style.opacity = 1;
        this.$refs.wordArea.style.opacity = 0;
        this.isShow = !this.isShow;
      }
    },
    // 更改歌单状态
    // 有bug，切换歌单如果当前是上一次的随机状态，会出现小列表和上个歌单一样
    changeMusicStore() {
      this.musicListClickNum = this.musicListClick;
      this.$store.commit("musicListClickChange", ++this.musicListClickNum);
      if (this.musicListStore === 0) {
        this.musicListStore = 1;
        this.musicIndexOld = this.musicIndex;
        // this.musicListOld = deepCopy(this.musicList)
        this.$store.commit("musicListChange", shuffleArray(this.musicList));
        this.$store.commit("musicListStoreChange", this.musicListStore);
      } else if (this.musicListStore === 1) {
        this.musicListStore = 2;
        this.$store.commit("musicListStoreChange", this.musicListStore);
      } else if (this.musicListStore === 2) {
        this.musicListStore = 0;
        this.$store.commit("musicListChange", this.musucListOld);
        this.$store.commit("musicIndexChange", this.musicIndexOld);
        this.$store.commit("musicListStoreChange", this.musicListStore);
      }
    },
    // 上一首歌
    upSong() {
      // this.nextMusicPlay = ++this.nextMusicPlay
      // this.$emit('nextPlay', this.nextMusicPlay)
      if (this.musicIndex === 0) {
        let item = this.musicList[this.musicList.length - 1];
        this.musicIndexOld = this.musicListOld.findIndex((it) => {
          return it.id === item.id;
        });
        this.$store.commit("musicIdChange", {
          id: item.id,
          ind: this.musicList.length - 1,
          songName: item.name,
          cover: item.al.picUrl,
          time: item.dt,
          ar: item.ar[0].name,
        });
        this.getMusicDetailAction();
        this.getMusicWordAction();
      } else {
        let item = this.musicList[this.musicIndex - 1];
        this.musicIndexOld = this.musicListOld.findIndex((it) => {
          return it.id === item.id;
        });
        this.$store.commit("musicIdChange", {
          id: item.id,
          ind: this.musicIndex - 1,
          songName: item.name,
          cover: item.al.picUrl,
          time: item.dt,
          ar: item.ar[0].name,
        });
        this.getMusicDetailAction();
        this.getMusicWordAction();
      }
    },
    // 下一首歌
    nextSong() {
      // this.nextMusicPlay = ++this.nextMusicPlay
      // this.$emit('nextPlay', this.nextMusicPlay)
      if (this.musicIndex === this.musicList.length - 1) {
        let item = this.musicList[0];
        this.musicIndexOld = this.musicListOld.findIndex((it) => {
          return it.id === item.id;
        });
        this.$store.commit("musicIdChange", {
          id: item.id,
          ind: 0,
          songName: item.name,
          cover: item.al.picUrl,
          time: item.dt,
          ar: item.ar[0].name,
        });
        this.getMusicDetailAction();
        this.getMusicWordAction();
      } else {
        let item = this.musicList[this.musicIndex + 1];
        this.musicIndexOld = this.musicListOld.findIndex((it) => {
          return it.id === item.id;
        });
        this.$store.commit("musicIdChange", {
          id: item.id,
          ind: this.musicIndex + 1,
          songName: item.name,
          cover: item.al.picUrl,
          time: item.dt,
          ar: item.ar[0].name,
        });
        this.getMusicDetailAction();
        this.getMusicWordAction();
      }
      // this.getMusicWordAction()
    },
    // 播放小列表显示与隐藏
    smallList() {
      this.$emit("smallListSee");
    },
    ...mapActions({
      getMusicDetailAction: "getMusicDetailAction",
      getMusicWordAction: "getMusicWordAction",
      // formatDt: 'formatDt'
    }),
  },
  watch: {
    // 监听歌曲进度变化
    currentRate(val) {
      this.current = val;
    },
    // 歌曲总时长
    duration(val) {
      this.durationTime = val;
    },
    // 歌曲播放时时间进度
    currentTime(val) {
      this.currentTimeDetail = val;
    },
    // 监听播放状态暂停或开启封面动画
    isPlay: {
      handler(val) {
        if (this.$refs.cover) {
          if (val) {
            this.$refs.cover.style.animationPlayState = "running";
          } else {
            this.$refs.cover.style.animationPlayState = "paused";
          }
        }
      },
      immediate: true,
    },
    // 歌词滚动
    currentTimeDetail(val) {
      this.time.forEach((item, index) => {
        if (val.toFixed(2) >= Number(item)) {
          this.countEmp = index;
          if (!this.musicWord[index]) {
            this.countEmp = index - 1;
          }
        }
      });
      this.count = this.countEmp;
      if (document.querySelector(".active")) {
        this.wordMoveY = document.querySelector(".active").offsetTop;

        this.$refs.wordMove.style.transform = `translate(-50%, ${
          -this.wordMoveY +
          document.querySelector(".wordArea").offsetHeight / 2 +
          document.querySelector(".active").offsetHeight / 2
        }px)`;
      }
    },
  },
  filters: {
    // 歌曲播放时时间格式化
    formatNowTime(val) {
      return (
        String(
          parseInt(val / 60) < 10
            ? "0" + String(parseInt(val / 60))
            : String(parseInt(val / 60))
        ) +
        ":" +
        String(
          parseInt(val % 60) < 10
            ? "0" + String(parseInt(val % 60))
            : String(parseInt(val % 60))
        )
      );
    },
    // 歌曲播放总时间格式化
    formatAllTime(val) {
      return (
        String(
          parseInt(val / 60000) < 10
            ? "0" + String(parseInt(val / 60000))
            : String(parseInt(val / 60000))
        ) +
        ":" +
        String(
          parseInt((val / 1000) % 60) < 10
            ? "0" + String(parseInt((val / 1000) % 60))
            : String(parseInt((val / 1000) % 60))
        )
      );
    },
  },
};
</script>
<style lang="scss" scoped>
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.songPlayDetail {
  width: 100%;
  height: 100%;
  position: absolute;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(30px);
  transform: translateY(100%);
  transition: 0.5s;
  z-index: 99;
  display: flex;
  flex-direction: column;

  .searchBar {
    color: #fff;
    box-sizing: border-box;
    position: relative;

    .bold {
      font-size: 22px;
    }

    .mainArea {
      flex: 1;
      box-sizing: border-box;
      padding-left: 80px;
      text-align: center;
      font-size: 14px;

      .singer {
        display: flex;
        align-items: center;
        justify-content: center;
        .name {
          flex: 1;
          text-align: end;
          color: #b8b8b8;
          height: 14px;
          line-height: 14px;
        }

        .fo {
          flex: 1;
          .follow {
            width: 38px;
            font-size: 12px;
            background-color: rgb(99, 99, 99, 0.5);
            box-sizing: border-box;
            padding: 2px 4px;
            transform-origin: left;
            transform: scale(0.8);
            border-radius: 5px;
            margin-left: 2px;
          }
        }
      }
    }

    .right {
      width: 80px;
      margin-left: 30px;
      display: flex;
      align-items: center;

      .cover {
        width: 24px;
        height: 24px;
        overflow: hidden;
        border-radius: 50%;
        border: 2px solid #9a999c;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .fenxiang {
        margin-left: 25px;
        font-size: 22px;
      }
    }
  }

  .main {
    flex: 1;
    width: 100%;
    box-sizing: border-box;
    padding-left: 13px;
    padding-right: 13px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;

    .cover {
      width: 220px;
      height: 220px;
      border: 5px solid rgba(96, 94, 92, 0.4);
      border-radius: 50%;
      overflow: hidden;
      animation: spin 15s linear infinite;
      opacity: 1;
      transition: opacity 0.5s;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .wordArea {
      width: 375px;
      height: 400px;
      overflow: hidden;
      text-align: center;
      background-color: transparent;
      position: absolute;
      opacity: 0;
      transition: 0.5s;
      box-shadow: inset 0 0 40px 10px transparent;

      &::-webkit-scrollbar {
        display: none;
      }

      .wordMove {
        position: absolute;
        left: 50%;
        transform: translate(-50%);
        transition: 0.5s;

        p {
          font-size: 14px;
          line-height: 20px;
          padding-bottom: 10px;
          color: #ccc;

          &.active {
            font-size: 20px;
            color: #fff;
          }
        }
      }
    }
  }

  .bottom {
    width: 100%;
    height: 204px;
    box-sizing: border-box;
    padding-left: 13px;
    padding-right: 13px;
    padding-bottom: 44px;

    .tab {
      width: 100%;
      height: 50px;
      font-size: 25px;
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      color: #fff;

      .xiazai2 {
        font-size: 25px;
      }

      .changge {
        font-size: 25px;
      }

      .pinglun {
        font-size: 25px;
      }

      .gengduo {
        font-size: 25px;
      }
    }

    .time {
      height: 50px;
      display: flex;
      align-items: center;

      .nowTime {
        font-size: 12px;
        margin-right: 5px;
        transform: scale(0.8);
        color: rgba(0, 0, 0, 0.5);
        font-weight: 550;
      }

      .custom-button {
        width: 10px;
        height: 10px;
        background-color: #ed6ea0;
        border-radius: 50%;
      }

      .allTime {
        font-size: 12px;
        margin-left: 5px;
        transform: scale(0.8);
        color: rgba(0, 0, 0, 0.5);
        font-weight: 550;
      }
    }

    .play {
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: space-evenly;
      font-size: 50px;
      color: #fff;

      .xunhuan1 {
        font-size: 22px;
      }

      .suiji {
        font-size: 22px;
      }

      .xunhuan7 {
        font-size: 22px;
      }

      .wangyiicon {
        font-size: 22px;
      }

      .shangyiqu {
        font-size: 22px;
      }

      .zanting1 {
        font-size: 22px;
      }
    }
  }
}
</style>
