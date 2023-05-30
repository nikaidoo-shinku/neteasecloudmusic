<template>
  <div class="category">
    <van-swipe
      class="my-swipe"
      :loop="false"
      :show-indicators="false"
      :width="70"
    >
      <van-swipe-item
        class="item"
        v-for="item in DragonBallData"
        ref="it"
        :key="item.id"
        @click="toCategoryDetail(item.id)"
      >
        <div class="iconBorder">
          <div class="ic">
            <img :src="item.iconUrl" alt="" />
          </div>
          <span class="timeTip" v-show="item.id == -1">{{ day }}</span>
        </div>
        <span>{{ item.name }}</span>
      </van-swipe-item>
    </van-swipe>
  </div>
</template>
<script>
export default {
  components: {},
  props: {
    DragonBallData: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      day: 0,
      mon: 0,
    };
  },
  methods: {
    // 跳转到相应分类详情页
    toCategoryDetail(id) {
      if (id == -1) {
        this.$router.push("dayMusicList");
      }
      if (id == -3) {
        this.$router.push("rank");
      }
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
  },
  mounted() {
    this.getDate();
  },
};
</script>
<style lang="scss" scoped>
.category {
  width: 100%;
  height: 54px;
  margin-top: 14px;
  box-sizing: border-box;
  padding-left: 13px;

  .item {
    width: 40px !important;
    height: 54px;
    margin-right: 30px;
    display: flex;
    flex-direction: column;
    align-items: center;

    &:last-child {
      margin-right: 0px;
    }

    .iconBorder {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      position: relative;
      margin-bottom: 2px;

      .ic {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: #ff4e4e;
        overflow: hidden;

        img {
          width: 100%;
          height: 100%;
          filter: drop-shadow(40px 0 #f00101);
          margin-left: -40px;
        }
      }

      .timeTip {
        position: absolute;
        transform-origin: bottom;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0.8);
        color: #fff;
        font-weight: 550;
        font-size: 12px;
      }
    }

    span {
      display: inline-block;
      width: 120%;
      font-size: 12px;
      transform: scale(0.8);
      color: #a7a7a7;
      text-align: center;
    }
  }
}
</style>
