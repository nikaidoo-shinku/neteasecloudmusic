<template>
  <div class="goodMusic" v-if="goodMusicData">
    <div class="titleArea">
      <div class="leftTitle">
        <van-icon name="replay" @click="reFreshData" ref="replay" />
        <div class="title">{{ goodMusicData.uiElement.subTitle.title }}</div>
      </div>
      <div class="more">
        <div class="iconfont icon-bofang bofang"></div>
        {{ goodMusicData.uiElement.button.text }}
      </div>
    </div>
    <van-swipe
      class="my-swipe"
      :loop="false"
      :show-indicators="false"
      :width="350"
    >
      <van-swipe-item
        class="item"
        v-for="(item, index) in goodMusicData.creatives"
        :key="index"
      >
        <div
          class="musicItem"
          v-for="it in item.resources"
          :key="it.resourceId"
        >
          <div class="img">
            <i class="iconfont icon-bofang"></i>
            <img :src="it.uiElement.image.imageUrl + '?param=40y40'" alt="" />
          </div>
          <div class="msg">
            <div class="main">
              <div class="mainTitle">
                <p class="one-txt-cut">{{ it.uiElement.mainTitle.title }}</p>
                <span class="singer one-txt-cut">
                  - {{ it.resourceExtInfo.artists[0].name }}</span
                >
              </div>
              <span class="subTitle" v-if="it.uiElement.subTitle">{{
                it.uiElement.subTitle.title
              }}</span>
            </div>
            <i class="iconfont icon-bofang1 bofang"></i>
          </div>
        </div>
      </van-swipe-item>
    </van-swipe>
  </div>
</template>
<script>
import throttle from "@/hooks/throttle.js";

export default {
  props: {
    goodMusicData: {
      default: null,
    },
  },
  data() {
    return {
      deg: 0, // 刷新按钮旋转角度
    };
  },
  methods: {
    // 点击刷新按钮利用节流函数进行局部刷新
    reFreshData: throttle(function () {
      this.deg = this.deg + 360;
      this.$refs.replay.style.transition = ".8s"
      this.$refs.replay.style.transform = `rotate(${this.deg}deg)`
      this.$emit("reFresh")
    }, 2000)
  },
  mounted() {},
};
</script>
<style lang="scss" scoped>
.goodMusic {
  width: 100%;
  background-color: #fff;
  padding-top: 15px;
  margin-top: 8px;
  border-radius: 10px;
  padding-bottom: 12px;

  .titleArea {
    width: 100%;
    box-sizing: border-box;
    padding-left: 13px;
    padding-right: 13px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .leftTitle {
      display: flex;
      align-items: center;

      .title {
        margin-left: 5px;
        font-weight: 550;
      }
    }

    .more {
      font-size: 12px;
      padding: 3px 6px;
      border: 1px solid #f1f1f1;
      border-radius: 20px;
      display: flex;
      align-items: center;

      .bofang {
        font-size: 12px;
        transform: scale(0.8);
      }
    }
  }

  .my-swipe {
    width: 100%;
    height: 136px;
    box-sizing: border-box;
    // padding-left: 13px;
    margin-top: 10px;

    .item {
      height: 136px;
      box-sizing: border-box;
      padding-left: 13px;

      .musicItem {
        width: 100%;
        height: 40px;
        padding-bottom: 4px;
        display: flex;

        .img {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          overflow: hidden;
          position: relative;

          i {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: rgba(255, 255, 255, 0.7);
            font-size: 12px;
          }

          img {
            width: 100%;
            height: 100%;
          }
        }

        .msg {
          width: 290px;
          height: 100%;
          margin-left: 9px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 2px solid #f5f5f5;

          .main {
            flex: 1;

            .mainTitle {
              width: 266px;
              display: flex;
              align-items: center;

              .one-txt-cut {
                font-size: 14px;
              }

              .singer {
                display: inline-block;
                font-size: 12px;
                color: #c2c2c2;
                transform-origin: center;
                transform: scale(0.9) translateY(2px);
              }
            }

            .subTitle {
              display: inline-block;
              box-sizing: border-box;
              border-radius: 8px;
              color: #ff884b;
              padding: 2px;
              background-color: #fff1ea;
              font-size: 12px;
              transform-origin: left;
              transform: scale(0.8);
            }
          }

          .bofang {
            font-size: 20px;
          }
        }
      }
    }
  }
}
</style>
