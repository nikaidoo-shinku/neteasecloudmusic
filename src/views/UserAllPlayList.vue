<template>
  <div class="userAllPlayList">
    <slot>
      <search-bar class="searchBar" v-if="userDetailData">
        <template v-slot:leftic>
          <div class="iconfont icon-arrow-left-bold bold" @click="toHome"></div>
        </template>
        <template v-slot:middle>
          <div class="main">
            <span>{{ userDetailData.profile.nickname }}的歌单</span>
          </div>
        </template>
        <template v-slot:rightic>
          <div></div>
        </template>
      </search-bar>
    </slot>
    <div class="playList" v-if="userListData" @scroll="lazyLoad">
      <div class="main">
        <lazy-component>
          <div
            class="item"
            v-for="item in userListDataSlice"
            :key="item.id"
            @click="toPlayListDetail(item.id)"
            v-lazy="item.coverImgUrl + '?param=60y60'"
          >
            <div class="img">
              <img :src="item.coverImgUrl + '?param=60y60'" />
            </div>
            <div class="msg one-txt-cut">
              <p class="one-txt-cut">{{ item.name }}</p>
              <div class="sub one-txt-cut">
                <span>{{ item.trackCount }}首</span>
              </div>
            </div>
          </div>
        </lazy-component>
      </div>
    </div>
  </div>
</template>
<script>
import SearchBar from "@/components/SearchBar.vue";
import { getUserDetail, getUserList } from "@/api/home.js";

export default {
  components: {
    SearchBar,
  },
  data() {
    return {
      userDetailData: null,
      userListData: null,
      sliceNum: 20,
      userListDataSlice: null,
    };
  },
  methods: {
    // 跳转到歌单详情页
    toPlayListDetail(id) {
      this.$router.push({ name: "playlistDetail", query: { id: id } });
    },
    // 返回上一页
    toHome() {
      this.$router.back();
    },
    // 触底懒加载
    lazyLoad(event) {
      if (
        event.target.scrollTop + event.target.clientHeight >=
        event.target.scrollHeight
      ) {
        this.sliceNum = this.sliceNum + 20;
        this.userListDataSlice = this.userListData.slice(0, this.sliceNum + 20);
      }
    },
    getUserDetailData() {
      getUserDetail(window.localStorage.getItem("userId")).then((data) => {
        this.userDetailData = data;
      });
    },
    getUserListData() {
      getUserList(window.localStorage.getItem("userId")).then((data) => {
        this.userListData = data.playlist;
        console.log(this.userListData);
      });
    },
  },
  watch: {
    userListData(val) {
      this.userListDataSlice = val.slice(0, 20);
    },
  },
  created() {
    // 获取用户详情
    this.getUserDetailData();
    // 获取用户歌单
    this.getUserListData();
  },
};
</script>
<style lang="scss" scoped>
.userAllPlayList {
  height: 100%;
  .searchBar {
    background-color: #2c2c2c;
    color: #fff;
    display: flex;
    font-size: 18px;

    .bold {
      font-size: 18px;
    }

    .main {
      margin-left: 15px;
    }
  }

  .playList {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding-left: 15px;
    padding-right: 15px;
    overflow: scroll;
    .main {
      width: 100%;

      .item {
        width: 100%;
        height: 52px;
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        &:first-child {
          margin-top: 5px;
        }

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
            color: #434343;
          }

          .sub {
            font-size: 12px;
            color: #8f8f8f;
            margin-top: 5px;
          }
        }
      }
    }
  }
}
</style>
