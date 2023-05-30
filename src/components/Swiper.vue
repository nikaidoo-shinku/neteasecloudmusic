<template>
  <div class="swiper">
    <van-swipe
      class="my-swipe"
      :autoplay="3000"
      indicator-color="white"
      @change="onChange"
    >
      <van-swipe-item v-for="(item, index) in bannerData" :key="index">
        <img :src="item.pic" alt="" />
      </van-swipe-item>
      <template #indicator>
        <div class="point">
          <div
            :class="{ active: current === item - 1 }"
            v-for="item in bannerData.length"
            :key="item"
          ></div>
        </div>
      </template>
    </van-swipe>
  </div>
</template>
<script>
import ColorThief from "colorthief";

export default {
  props: {
    bannerData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      current: 0,
    };
  },
  methods: {
    onChange(index = 0) {
      this.current = index;
      const img = new Image();
        img.crossOrigin = "";
        img.src = this.bannerData[index].pic;
        img.onload = () => {
          const colorThief = new ColorThief();
          const color = colorThief.getColor(img);
          this.$emit('backgroundchange', color)
        };
    },
  },
  mounted() {

  },
  updated() {
    this.onChange()
  }
};
</script>
<style lang="scss" scoped>
.swiper {
  width: 100%;
  height: 137px;
  box-sizing: border-box;
  padding-left: 13px;
  padding-right: 13px;
}

.my-swipe {
  width: 100%;
  height: 100%;
  border-radius: 10px;

  .van-swipe-item {
    img {
      width: 100%;
      height: 100%;
    }
  }

  .point {
    height: 3px;
    display: flex;
    position: absolute;
    bottom: 5%;
    left: 50%;
    transform: translate(-50%);

    div {
      width: 6px;
      height: 100%;
      margin-left: 2px;
      margin-right: 2px;
      background-color: rgba(255, 255, 255, 0.4);

      &.active {
        background-color: #fff;
      }
    }
  }
}
</style>
