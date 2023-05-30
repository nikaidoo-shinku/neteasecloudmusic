<template>
  <div class="userPlayList" v-if="userListData">
    <div class="titleArea">
      <slot name="title">
        <div class="title">创建的歌单</div>
        <div class="subTitle">({{ userListData.length }}个)</div>
      </slot>
    </div>
    <div class="main">
      <div
        class="item"
        v-for="item in userListDataSlice"
        :key="item.id"
        @click="toPlayListDetail(item.id)"
      >
        <div class="img">
          <img :src="item.coverImgUrl + '?param=60y60'" alt="" />
        </div>
        <div class="msg one-txt-cut">
          <p class="one-txt-cut">{{ item.name }}</p>
          <div class="sub one-txt-cut">
            <span>{{ item.trackCount }}首</span>
          </div>
        </div>
      </div>
    </div>
    <slot name="seeAll">
      <div class="all" @click="toUserAllPlayList">
        <div>查看全部</div>
        <i class="iconfont icon-arrow-right-bold bold"></i>
      </div>
    </slot>
  </div>
</template>
<script>
export default {
  props: {
    userListData: {
      default: null,
    },
  },
  data() {
    return {
      playListSum: 0,
      userListDataSlice: null,
    };
  },
  methods: {
    // 跳转到歌单详情页
    toPlayListDetail(id) {
      this.$router.push({ name: "playlistDetail", query: { id: id } });
    },
    // 跳转到用户所有歌单页
    toUserAllPlayList() {
      this.$router.push({ name: "userPlayList" });
    },
  },
  watch: {
    userListData: {
      handler(val) {
        if (val) {
          this.userListDataSlice = val.slice(0, 10);
        }
      },
      immediate: true,
    },
  },
};
</script>
<style lang="scss" scoped>
.userPlayList {
  width: 100%;
  background-color: #ffffff;
  box-sizing: border-box;
  padding-top: 20px;
  padding-left: 15px;
  padding-right: 15px;
  border-radius: 10px;

  .titleArea {
    width: 100%;
    height: 20px;
    display: flex;
    align-items: flex-end;
    margin-bottom: 14px;

    .title {
      height: 100%;
      font-size: 20px;
      line-height: 20px;
      color: #3c3c3c;
      font-weight: 550;
    }

    .subTitle {
      font-size: 13px;
      margin-left: 5px;
      color: #9a9a9a;
    }
  }

  .main {
    width: 100%;

    .item {
      width: 100%;
      height: 52px;
      display: flex;
      align-items: center;
      margin-bottom: 10px;

      .img {
        width: 52px;
        height: 52px;
        border-radius: 10px;
        overflow: hidden;

        img {
          width: 100%;
        }
      }

      .msg {
        flex: 1;
        margin-left: 10px;

        p {
          font-size: 14px;
          color: #312e2f;
        }

        .sub {
          font-size: 12px;
          color: #9a9a9a;
          margin-top: 5px;
        }
      }
    }
  }

  .all {
    width: 100%;
    height: 20px;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    color: #8f8f8f;
    padding-bottom: 10px;

    div {
      font-size: 14px;
    }

    .bold {
      line-height: 17px;
      font-size: 14px;
    }
  }
}
</style>
