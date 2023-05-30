<template>
  <div id="app">
    <keep-alive :include="['homeName', 'userInfo']">
      <router-view></router-view>
    </keep-alive>
    <play-auto
      class="playAuto"
      v-show="!$route.meta.playIsShow"
      :playStore="playStore"
      @isplay="isplay"
      @isplayNextAuto="isplayNextAuto"
      :currentRateN="currentRateN"
      @songPlayDetailSee="songPlayDetailSee"
      @smallListSee="smallListSee"
      @musicStore="musicStore"
      @nextPlay="nextPlay"
    ></play-auto>
    <song-play-detail
      ref="songPlayDetail"
      @changPlayStore="changPlayStore"
      @emitCurrent="emitCurrent"
      @nextPlay="nextPlay"
      @smallListSee="smallListSee"
      :isPlay="playStore"
      :currentRate="currentRate"
      :duration="duration"
      :currentTime="currentTime"
    ></song-play-detail>
    <van-popup
      v-model="show"
      round
      position="right"
      :style="{ width: '80%', height: '50%' }"
    >
      <detail-list :detailListData="smallListData">
        <div></div>
      </detail-list>
    </van-popup>
  </div>
</template>
<script>
import { mapState } from "vuex";

import { deepCopy } from "./hooks/deepCopy.js";

import PlayAuto from "./components/PlayAuto.vue";
import SongPlayDetail from "./components/SongPlayDetail.vue";
import DetailList from "./components/DetailList.vue";

export default {
  components: {
    PlayAuto,
    SongPlayDetail,
    DetailList,
  },
  data() {
    return {
      songPlayDetailStore: "songPlayDetailLeave",
      currentRate: 0,
      duration: 0,
      currentTime: 0,
      currentRateN: 0,
      playStore: false,
      musicInd: 0,
      musicPlayNum: 0,
      show: false,
      smallListData: null,
      shows: false,
    };
  },
  computed: {
    // songPlayDetailSee() {
    //   return this.$store.songPlayDetailView
    // }
    ...mapState({
      musicIndex: (state) => state.musicIndex,
      musicList: (state) => state.musicList,
      musicListClick: (state) => state.musicListClick,
      // musicPlayStore: (state) => {},
    }),
  },
  methods: {
    // 显示歌曲播放详情
    songPlayDetailSee(store) {
      if (!store) {
        this.$refs.songPlayDetail.changeTransform({
          translateY: "translateY(0)",
        });
      }
    },
    // 显示小播放列表
    smallListSee() {
      this.show = !this.show;
    },
    // 歌曲播放时状态数据
    musicStore(obj) {
      this.currentRate = obj.currentRate;
      this.duration = obj.duration;
      this.currentTime = obj.currentTime;
    },
    // 根据拖动更改音乐进度
    emitCurrent(val) {
      this.currentRateN = val;
    },
    // 根据播放器播放状态更改详情图标
    isplay(val) {
      console.log(val);
      this.playStore = val;
      // if()
      // this.$refs.songPlayDetail.nextSong()
    },
    isplayNextAuto() {
      this.$refs.songPlayDetail.nextSong()
    },
    changPlayStore(val) {
      this.playStore = val;
    },
    // 根据列表状态播放下一首歌
    nextPlay(val) {
      this.musicPlayNum = val;
    },
  },
  watch: {
    musicListClick(val) {
      this.smallListData = deepCopy(this.musicList);
    },
  },
  mounted() {},
};
</script>
<style lang="scss" scoped>
#app {
  height: 100vh;
  overflow: hidden;
  transform: translate3d(0, 0, 0);

  .playAuto {
    z-index: 1;
  }

  .van-popup {
    overflow: auto;
    &::-webkit-scrollbar {
      display: none;
    }
  }
}
</style>
