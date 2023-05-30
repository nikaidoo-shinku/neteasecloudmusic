<template>
  <div class="songList">
    <div class="titleArea">
      <div class="title">{{ title }}</div>
      <div class="more">
        更多
        <div class="iconfont icon-arrow-right-bold right"></div>
      </div>
    </div>
    <div class="listArea">
      <van-swipe
        class="my-swipe"
        :loop="false"
        :show-indicators="false"
        :width="117"
      >
        <van-swipe-item v-for="item in getData" :key="item.id">
          <div class="item" @click="toPlayListDetail(item.id)">
            <div class="img">
              <img :src="item.picUrl" alt="" />
              <div class="mask">
                <div class="player">
                  <div class="num">
                    <span class="iconfont icon-bofang"></span>
                    {{ item.playCount | formatPlayer }}
                  </div>
                </div>
              </div>
            </div>
            <p class="txt-cut">
              {{ item.name }}
            </p>
          </div>
        </van-swipe-item>
      </van-swipe>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  props: {
    title: {
      type: String,
      default: "推荐歌单",
    },
    personalizedData: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      personalizedDataOwn: [],
    };
  },
  filters: {
    // 播放量格式化
    formatPlayer(val) {
      if (val >= 100000000) {
        return `${parseInt(val / 100000000)}亿`;
      }else if(val >= 10000) {
        return `${parseInt(val / 10000)}万`;
      } else {
        return val;
      }
    },
  },
  computed: {
    getData() {
      return (this.personalizedDataOwn = [...this.personalizedData]);
    }
  },
  methods: {
    // 跳转到歌单详情页
    toPlayListDetail(id) {
      this.$router.push({name: 'playlistDetail', query: {id: id}})
    }
  },
  mounted() {},
  updated() {},
};
</script>
<style lang="scss" scoped>
.songList {
  width: 100%;
  background-color: #fff;
  padding-top: 15px;
  padding-bottom: 13px;
  margin-top: 2px;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;

  .titleArea {
    width: 100%;
    box-sizing: border-box;
    padding-left: 13px;
    padding-right: 13px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .title {
      font-weight: 550;
    }

    .more {
      font-size: 12px;
      padding: 3px 6px;
      border: 1px solid #f1f1f1;
      border-radius: 20px;
      display: flex;
      align-items: center;

      .right {
        font-size: 12px;
        transform: scale(0.8);
      }
    }
  }

  .listArea {
    width: 100%;
    height: 142px;
    margin-top: 10px;
    box-sizing: border-box;
    padding-left: 13px;

    .item {
      width: 110px;
      .img {
        border-radius: 10px;
        overflow: hidden;
        width: 110px;
        height: 110px;
        position: relative;
        box-shadow: 0px -10px 4px -7px #f2f2f2;
        img {
          width: 100%;
          height: 100%;
        }
        .mask {
          width: 100%;
          height: 110px;
          position: absolute;
          top: 0;
          background-image: linear-gradient(to bottom, rgba(0, 0, 0, .4) 2%, transparent);
          .player {
          position: absolute;
          top: 2px;
          right: 2px;
          height: 14px;
          line-height: 14px;
          border-radius: 7px;
          padding: 0px 6px;
          // background: #cbcbcb;
          color: #fff;
          font-size: 10px;
          font-weight: 550;
          .iconfont {
            font-size: 10px;
          }
          .num {
            transform: scale(0.9);
          }
        }
        }
      }
      p {
        font-size: 12px;
        color: #575757;
        line-height: 14px;
        margin-top: 4px;
      }
    }
  }
}
</style>
