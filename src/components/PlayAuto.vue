<template>
  <div class="playAuto" @click="detailView" v-show="isShow">
    <div class="playImgArea">
      <div class="playImg" ref="playImg">
        <img :src="musicCover ? musicCover : defaultCover" alt="" />
      </div>
    </div>
    <div class="msg one-txt-cut">
      <div class="one-txt-cut">
        {{ musicName }}
        <p class="subName one-txt-cut">- {{ arName }}</p>
      </div>
    </div>
    <div class="playTodo">
      <div class="toPlay">
        <van-circle
          v-model="currentRate"
          :rate="currentRate"
          :speed="100"
          layer-color="#c9cccc"
          :color="gradientColor"
          size="24px"
          :stroke-width="50"
        />
        <i
          class="iconfont icon-bofang bofang"
          @click.stop="musicOpen"
          v-show="!isPlay"
        ></i>
        <i
          class="iconfont icon-zantingtingzhi zangting"
          @click.stop="musicOpen"
          v-show="isPlay"
        ></i>
      </div>
      <i class="iconfont icon-zanting1 zanting1" @click.stop="smallList"></i>
    </div>
    <audio ref="playMusic" :src="musicData.url" autoplay></audio>
  </div>
</template>
<script>
import { mapState } from "vuex";

export default {
  props: {
    currentRateN: {
      type: Number,
      default: 0,
    },
    playStore: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      currentRate: 0,
      duration: 0,
      currentTime: 0,
      isPlay: false,
      songPlayDetail: false,
      gradientColor: "#3f445d",
      deg: 0,
      timer: null,
      defaultCover: require("../assets/img/EqEgKAXC_400x400.png"),
      isShow: true,
    };
  },
  computed: {
    ...mapState({
      musicId: (state) => state.musicId,
      musicCover: (state) => {
        if (state.musicCover) {
          return state.musicCover + "?param=47y47";
        } else {
          return null;
        }
      },
      musicTime: (state) => state.musicTime,
      musicName: (state) => state.musicName,
      arName: (state) => state.arName,
      musicData: (state) => state.musicData,
      musicAuto: (state) => state.musicAuto,
    }),
  },
  methods: {
    // 歌曲播放与暂停
    musicOpen() {
      if (this.musicData.id) {
        if (this.$refs.playMusic.paused) {
          this.$refs.playMusic.play();
          this.isPlay = true;
          this.$emit("isplay", this.isPlay);
          this.$refs.playImg.style.animationPlayState = "running";
        } else {
          this.$refs.playMusic.pause();
          this.isPlay = false;
          this.$emit("isplay", this.isPlay);
          this.$refs.playImg.style.animationPlayState = "paused";
        }
      }
    },
    // 点击底部播放器进行歌曲播放详情页的显示
    detailView() {
      if (!this.songPlayDetail) {
        this.$emit("songPlayDetailSee", this.songPlayDetail);
      }
    },
    // 播放小列表显示与隐藏
    smallList() {
      this.$emit("smallListSee");
    },
    // 播放器显示
    showPlay() {
      this.isShow = true;
    },
    // 播放器隐藏
    hidePlay() {
      this.isShow = false;
    },
  },
  watch: {
    currentRateN(val) {
      // if(!this.$refs.playMusic.paused) {
      //   this.$refs.playMusic.pause();
      // }
      this.$refs.playMusic.currentTime = (val / 100) * this.duration;
      console.log(this.$refs.playMusic.currentTime);
    },
    // 根据播放详情页的状态更改底部播放器状态
    playStore(val) {
      if (val) {
        this.$refs.playMusic
          .play()
          .then(() => {
            audio.play();
          })
          .catch(() => {});
        this.isPlay = true;
        this.$refs.playImg.style.animationPlayState = "running";
      } else {
        this.$refs.playMusic.pause();
        this.isPlay = false;
        this.$refs.playImg.style.animationPlayState = "paused";
      }
    },
    // 监听点击切换歌曲，更改播放状态
    musicData: {
      handler(val) {
        this.$refs.playMusic.pause();
        this.isPlay = true;
        this.$emit("isplay", this.isPlay);
        // this.$refs.playImg.style.animationPlayState = "paused";
        this.$refs.playImg.style.animationPlayState = "running";
        this.duration = this.$refs.playMusic.duration;
        this.currentTime = 0;
        this.currentRate = (this.currentTime / this.duration) * 100;
        this.$emit("musicStore", {
          duration: this.duration,
          currentTime: this.currentTime,
          currentRate: this.currentRate,
        });
        // this.musicOpen();
      },
      deep: true,
    },
    musicAuto() {
      // this.musicOpen()
    },
  },
  created() {},
  mounted() {
    // 监听音乐播放进度
    this.$refs.playMusic.ontimeupdate = () => {
      // this.isPlay = true;
      this.$emit("isplay", this.isPlay);
      this.duration = this.$refs.playMusic.duration;
      this.currentTime = this.$refs.playMusic.currentTime;
      this.currentRate = (this.currentTime / this.duration) * 100;
      this.$emit("musicStore", {
        duration: this.duration,
        currentTime: this.currentTime,
        currentRate: this.currentRate,
      });
      // if (this.$refs.playMusic.onended) {
      //   this.isPlay = false;
      // }
    };
    // 监听歌曲是否在播放，如果在播放就让状态改为播放
    this.$refs.playMusic.onplay = () => {
      this.isPlay = true;
    };
    // 监听歌曲是否播放结束
    this.$refs.playMusic.onended = () => {
      this.isPlay = true;
      this.$emit("isplay", this.isPlay);
      this.$emit("isplayNextAuto");
    };

    // 初始状态为暂停时，封面动画暂停
    this.$refs.playImg.style.animationPlayState = "paused";
  },
  beforeDestroy() {},
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

.playAuto {
  width: 100%;
  height: 45px;
  // background-image: linear-gradient(to bottom right, #ed6ea0, #a6e3e9);
  background-color: #fbfefe;
  position: fixed;
  bottom: 0;
  box-sizing: border-box;
  padding-left: 15px;
  padding-top: 5px;
  padding-bottom: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .playImgArea {
    width: 47px;
    height: 47px;
    position: relative;

    .playImg {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      overflow: hidden;
      position: absolute;
      top: -15%;
      box-sizing: border-box;
      border: 6px solid #272727;
      animation: spin 15s linear infinite;

      img {
        width: 100%;
        height: 100%;
      }
    }
  }

  .msg {
    width: 100%;
    flex: 1;
    height: 100%;
    box-sizing: border-box;
    padding-left: 8px;
    overflow: hidden;
    display: flex;
    align-items: center;

    div {
      width: 100%;
      font-size: 13px;
      display: flex;
      margin-bottom: 5px;

      .mainName {
        color: #404546;
      }

      .subName {
        margin-left: 5px;
        color: #404546;
      }
    }
  }

  .playTodo {
    width: 105px;
    height: 28px;
    display: flex;
    justify-content: center;
    align-items: center;

    .toPlay {
      width: 24px;
      height: 24px;
      position: relative;

      .bofang {
        position: absolute;
        top: 50%;
        left: 50%;
        font-size: 12px;
        transform: translate(-40%, -50%);
        color: #444552;
      }

      .zangting {
        position: absolute;
        top: 50%;
        left: 50%;
        font-size: 12px;
        transform: translate(-42%, -50%);
        color: #444552;
      }
    }

    .zanting1 {
      height: 28px;
      font-size: 28px;
      line-height: 31px;
      margin-left: 20px;
      color: #444552;
    }
  }
}
</style>
