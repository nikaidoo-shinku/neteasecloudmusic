<template>
  <div class="userInfo" v-if="userDetailData" @scroll="homeComp">
    <div class="backgoundCover">
      <img :src="userDetailData.profile.backgroundUrl" alt="" />
      <div class="mask"></div>
      <div class="imgMask"></div>
    </div>
    <search-bar
      class="searchBar"
      :searchBarColor="searchBarColor"
      :searchColor="searchColor"
    >
      <template v-slot:leftic>
        <div class="iconfont icon-arrow-left-bold bold" @click="toHome"></div>
      </template>
      <template v-slot:middle>
        <div></div>
      </template>
      <template v-slot:rightic>
        <div
          class="iconfont icon-gengduo gengduo"
          style="transform: rotate(90deg)"
        ></div>
      </template>
    </search-bar>
    <div class="main">
      <div class="userMsgArea">
        <div class="userMsg">
          <div class="cover">
            <img :src="userDetailData.profile.avatarUrl" alt="" />
          </div>
          <div class="mainMsg">
            <div class="userName">{{ userDetailData.profile.nickname }}</div>
            <div class="level">
              <div class="follow">
                {{ userDetailData.profile.follows }} 关注
              </div>
              <div class="followed">
                {{ userDetailData.profile.followeds }} 粉丝
              </div>
              <div class="lv">Lv.{{ userDetailData.level }}</div>
            </div>
            <div class="otherMsg">
              <div class="userIp">IP属地: {{ provinceName }}</div>
              <div class="userIp">95后 双子座</div>
              <div class="iconfont icon-arrow-right-bold userIp"></div>
            </div>
            <div class="toEdit">
              <div class="tip">完善主页，发现更多音乐好品味</div>
              <div class="edit">去填写</div>
            </div>
          </div>
        </div>
      </div>
      <div class="playListArea">
        <user-play-list :userListData="userListData"></user-play-list>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getUserAccount,
  getLogout,
  getUserDetail,
  getUserList,
} from "@/api/home.js";
import { getProvince } from "@/hooks/province.js";

import SearchBar from "@/components/SearchBar.vue";
import userPlayList from "@/components/userPlayList.vue";

export default {
  name: "homeName",
  components: {
    SearchBar,
    userPlayList,
  },
  data() {
    return {
      userDetailData: null,
      provinceName: null,
      searchBarColor: "transparent",
      searchColor: "#fdfefd",
      userListData: null,
    };
  },
  methods: {
    // 用户退出
    logout() {
      window.localStorage.setItem("userId", "");
      window.localStorage.setItem("token", "");
      getLogout().then((data) => {
        console.log("退出登录", data);
      });
      this.$router.push("/home");
    },
    // 返回首页
    toHome() {
      this.$router.push("home");
    },
    // 监听个人主页滚动对样式进行修改
    homeComp(event) {
      // 修改顶部搜索栏
      if (event.target.scrollTop >= 25) {
        this.searchBarColor = "blur(10px)";
        this.searchColor = "#e6ebea";
      } else {
        this.searchBarColor = "blur(0px)";
        this.searchColor = "#fdfefd";
      }
    },
    getUserAccountData() {
      getUserAccount().then((data) => {
        console.log("userinfo==>", data);
        window.localStorage.setItem("userId", data.profile.userId);
      });
    },
    getUserDetailData() {
      getUserDetail(window.localStorage.getItem("userId")).then((data) => {
        this.userDetailData = data;
        this.provinceName = getProvince(data.profile.province);
      });
    },
    getUserListData() {
      getUserList(window.localStorage.getItem("userId")).then((data) => {
        this.userListData = data.playlist;
      });
    },
  },
  created() {
    // 获取账号信息并保存用户id
    this.getUserAccountData();
    // 获取用户详情
    this.getUserDetailData();
    // 获取用户歌单
    this.getUserListData();
  },
  activated() {
    this.searchBarColor = "blur(0px)";
    this.searchColor = "#fdfefd";
  },
};
</script>

<style lang="scss" scoped>
.userInfo {
  width: 100%;
  height: 100%;
  overflow: scroll;
  position: relative;
  background-color: #f5f5f5;

  .backgoundCover {
    width: 100%;
    height: 314px;
    overflow: hidden;
    position: relative;

    img {
      width: 100%;
      height: 100%;
    }

    .mask {
      width: 999px;
      height: 314px;
      //   background-image: linear-gradient(
      //     to bottom,
      //     rgba(0, 0, 0, 0.4) 2%,
      //     transparent
      //   );
      //   position: absolute;
      //   top: 0%;
      //   z-index: 1;
      position: absolute;
      top: 0;
      left: 50%;
      transform: translate(-50%, -2%);
      border-radius: 50%;
      box-shadow: 0px 50px 10px 10px #f5f5f5;
      z-index: 2;
    }

    .imgMask {
      width: 100%;
      height: 314px;
      background-image: linear-gradient(
        to bottom,
        rgba(0, 0, 0, 0.4) 2%,
        transparent
      );
      position: absolute;
      top: 0%;
      z-index: 1;
    }
  }

  .searchBar {
    color: #fff;
    position: absolute;
    top: 0%;
    z-index: 99;

    .bold {
      font-size: 20px;
    }

    .main {
      height: 27px;
      flex: 1;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-sizing: border-box;
      padding-left: 13px;
      padding-right: 13px;

      span {
        font-weight: 550;
      }

      .search {
        font-size: 20px;
        line-height: 25px;
        font-weight: 600;
      }
    }

    .gengduo {
      font-size: 20px;
    }
  }

  .main {
    width: 100%;
    height: 1000px;
    box-sizing: border-box;

    .userMsgArea {
      width: 100%;
      height: 190px;
      box-sizing: border-box;
      padding-left: 15px;
      padding-right: 15px;
      position: relative;
      .userMsg {
        width: 91%;
        height: 190px;
        background-image: linear-gradient(
          to bottom,
          rgba(255, 255, 255, 0.5),
          rgb(255, 255, 255)
        );
        position: absolute;
        top: -25px;
        left: 50%;
        transform: translate(-50%);
        border-radius: 10px;
        z-index: 9;

        .cover {
          width: 72px;
          height: 72px;
          overflow: hidden;
          position: absolute;
          top: 0;
          left: 50%;
          transform: translate(-50%, -60%);

          img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
          }
        }

        .mainMsg {
          margin-top: 40px;

          .userName {
            width: 100%;
            height: 25px;
            text-align: center;
            font-size: 18px;
            color: #373737;
            font-weight: 600;
          }

          .level {
            margin-top: 12px;
            width: 100%;
            height: 14px;
            font-size: 14px;
            color: #aaaaaa;
            display: flex;
            justify-content: center;
            align-items: center;

            div {
              width: 60px;
              height: 15px;
              line-height: 14px;
              text-align: center;
            }

            .followed {
              border-left: 1px solid #ececec;
              border-right: 1px solid #ececec;
            }
          }

          .otherMsg {
            margin-top: 12px;
            width: 100%;
            display: flex;
            justify-content: center;

            .userIp {
              font-size: 12px;
              box-sizing: border-box;
              padding: 5px 10px;
              background-color: #fff;
              color: #323232;
              border: 1px solid #dddddd;
              border-radius: 8px;
              line-height: 12px;

              &:nth-child(2) {
                margin-left: 5px;
                margin-right: 5px;
              }

              &:nth-child(3) {
                padding: 5px 5px;
              }
            }
          }

          .toEdit {
            width: 100%;
            height: 25px;
            box-sizing: border-box;
            padding-left: 15px;
            padding-right: 15px;
            display: flex;
            align-items: center;
            font-size: 14px;
            margin-top: 20px;

            .tip {
              color: #5f5f60;
              flex: 1;
            }

            .edit {
              width: 54px;
              height: 24px;
              color: #e73e44;
              line-height: 24px;
              border: 1px solid #d9d9d9;
              text-align: center;
              border-radius: 25px;
              font-size: 12px;
            }
          }
        }
      }
    }

    .playListArea {
      margin-top: 35px;
      box-sizing: border-box;
      padding-left: 15px;
      padding-right: 15px;
    }
  }
}
</style>
<style lang="scss">
// .father{
//     width: 100%;
//     height: 100%;
//     position: relative;
//     .遮罩{
//         position: absolute;
//         left:50%;
//         transition: transtale(-50%,-95%);
//         width: 9999px;
//         height: 9999px;
//         border-radius:99999px;
//         box-shadow: 0 999px 0 body-color;
//         z-index: 大于内容;
//     }
// }
</style>
