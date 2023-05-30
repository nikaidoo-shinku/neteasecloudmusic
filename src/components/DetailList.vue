<template>
  <div class="detailList" v-if="detailListData">
    <slot>
      <van-sticky :offset-top="ofTop">
        <slot>
          <div class="playTop" ref="playTop">
            <div class="playAll">
              <van-icon
                @click="firstSongPlay"
                name="play-circle"
                size="22px"
                color="#ff2c27"
              />
              <div class="all">播放全部</div>
              <div class="songSum">({{ detailListData.length }})</div>
            </div>
            <div class="playDown">
              <i class="iconfont icon-xiazai2 xiazai2"></i>
              <i class="iconfont icon-bofangliebiao bofangliebiao"></i>
            </div>
          </div>
        </slot>
      </van-sticky>
    </slot>
    <div
      class="songListArea"
      ref="songListArea"
      :style="{ 'min-height': minHeight }"
    >
      <slot name="songDataList">
        <div
          class="songList"
          :style="{
            'padding-left': paddingLeft,
            'padding-right': paddingRight,
          }"
          v-for="(item, index) in detailListData"
          :key="index"
          @click="
            playMusic({
              id: item.id,
              ind: index,
              songName: item.name,
              cover: item.al.picUrl,
              time: item.dt,
              ar: item.ar[0].name,
            })
          "
        >
          <slot name="number">
            <div class="num">{{ index + 1 }}</div>
          </slot>
          <div
            class="msg one-txt-cut"
            :style="{ 'padding-left': paddingLeftMsg }"
          >
            <div class="one-txt-cut">
              {{ item.name }}
              <p class="subName one-txt-cut">({{ item.al.name }})</p>
            </div>
            <p class="ar one-txt-cut">{{ item.ar[0].name }}</p>
          </div>
          <div class="todo">
            <van-icon name="play-circle-o" class="play" />
            <div
              class="iconfont icon-gengduo gengduo"
              style="transform: rotate(90deg)"
            ></div>
          </div>
        </div>
      </slot>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import { mapActions } from "vuex";

export default {
  props: {
    detailListData: {
      default: null,
    },
    playTopColor: {
      default: "linear-gradient(to bottom,rgba(241, 240, 236, 0.6) 1%,#fff)",
    },
    minHeight: {
      default: "569px",
    },
    paddingLeft: {
      default: "20px",
    },
    paddingLeftMsg: {
      default: "20px",
    },
    paddingRight: {
      default: "15px",
    },
    ofTop: {
      default: 51,
    },
  },
  computed: {},
  methods: {
    // 点击播放
    playMusic(obj) {
      this.$store.commit("musicIdChange", {
        id: obj.id,
        ind: obj.ind,
        songName: obj.songName,
        cover: obj.cover,
        time: obj.time,
        ar: obj.ar,
      });
      this.$emit("changeList");
      this.getMusicDetailAction();
      this.getMusicWordAction();
      this.$store.commit("musicAutoChange");
    },
    // 播放第一首
    firstSongPlay() {
      this.playMusic({
        id: this.detailListData[0].id,
        ind: 0,
        songName: this.detailListData[0].name,
        cover: this.detailListData[0].al.picUrl,
        time: this.detailListData[0].dt,
        ar: this.detailListData[0].ar[0].name,
      });
    },
    ...mapActions({
      getMusicDetailAction: "getMusicDetailAction",
      getMusicWordAction: "getMusicWordAction",
      // formatDt: 'formatDt'
    }),
  },
  watch: {
    playTopColor: {
      handler(val) {
        if (this.$refs.playTop) {
          this.$refs.playTop.style.backgroundImage = val;
        }
      },
    },
  },
};
</script>
<style lang="scss" scoped>
.detailList {
  width: 100%;
  position: relative;
  .playTop {
    width: 100%;
    height: 47px;
    box-sizing: border-box;
    padding: 15px;
    background-image: linear-gradient(
      to bottom,
      rgba(241, 240, 236, 0.6) 1%,
      #fff
    );
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    display: flex;
    justify-content: space-between;

    .playAll {
      display: flex;
      align-items: center;

      .all {
        height: 16px;
        line-height: 16px;
        margin-left: 15px;
        font-weight: 550;
      }

      .songSum {
        margin-left: 10px;
        font-size: 12px;
        color: #c5c5c5;
      }
    }

    .playDown {
      display: flex;
      align-items: center;

      .xiazai2 {
        font-size: 20px;
      }

      .bofangliebiao {
        font-size: 20px;
        margin-left: 18px;
      }
    }
  }

  .songListArea {
    width: 100%;
    min-height: 569px;
    background-color: #fff;
    // overflow-y: scroll;
    .songList {
      width: 100%;
      height: 68px;
      box-sizing: border-box;
      padding: 14px 15px 14px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .num {
        height: 14px;
        font-size: 14px;
        line-height: 14px;
        color: #c5c5c5;
      }

      .msg {
        width: 100%;
        flex: 1;
        height: 100%;
        box-sizing: border-box;
        padding-left: 20px;
        padding-right: 12px;
        overflow: hidden;

        div {
          width: 100%;
          font-size: 15px;
          display: flex;
          margin-bottom: 5px;

          .mainName {
            color: #272727;
          }

          .subName {
            margin-left: 5px;
            color: #c5c5c5;
          }
        }

        .ar {
          font-size: 12px;
          color: #c5c5c5;
        }
      }

      .todo {
        width: 60px;
        height: 100%;
        margin-left: 15px;
        display: flex;
        justify-content: end;
        align-items: center;
        font-size: 21px;
        color: #c5c5c5;

        .play {
          margin-right: 20px;
        }

        .gengduo {
          font-size: 21px;
        }
      }
    }
  }
}
</style>
