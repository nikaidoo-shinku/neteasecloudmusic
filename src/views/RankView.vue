<template>
  <div class="ranking" v-if="rankinglists">
    <div class="top">
      <div>
        <span class="iconfont icon-arrow-left-bold" @click="toback"></span>
        排行榜
      </div>
      <div class="rig">定制首页榜单</div>
    </div>
    <van-tabs scrollspy sticky background="#edf2f9" offset-top="40px">
      <div class="recommend">
        <div class="top_log">榜单推荐</div>
        <div class="recommend_list">
          <div class="network choiceness">
            <div class="item">
              <h3>编辑推荐榜</h3>
              <span>每周五更新</span>
            </div>
          </div>
          <div class="europe choiceness">
            <h3>说唱榜</h3>
            <span>每周五更新</span>
          </div>
          <div class="noon choiceness">
            <h3>ACG榜</h3>
            <span>每周四更新</span>
          </div>
        </div>
      </div>
      <van-tab title="官方">
        <div class="official">
          <div class="official_top">
            <span class="span"> <img src="" alt="" /></span>
            <span class="size">官方榜</span>
          </div>
          <!-- 热歌榜 -->
          <div class="hot_list" v-for="item in officiallists" :key="item.id">
            <div class="hot_list_top">
              <span class="size_l">{{ item.name }}</span>
              <span class="size_r">{{ item.updateFrequency }}</span>
            </div>
            <div class="hot_list_item">
              <div class="hot_flx">
                <img :src="item.coverImgUrl" alt="" />
                <div class="hot">
                  <div>
                    <span>1</span><span>{{ item.tracks[0].second }}</span
                    ><a>-{{ item.tracks[0].first }}</a>
                  </div>
                  <div>
                    <span>2</span><span>{{ item.tracks[1].second }}</span
                    ><a>-{{ item.tracks[1].first }}</a>
                  </div>
                  <div>
                    <span>3</span><span>{{ item.tracks[2].second }}</span
                    ><a>-{{ item.tracks[2].first }}</a>
                  </div>
                </div>
              </div>
              <div class="log_r">
                <span class="iconfont icon-arrow-up-bold"></span>
                <span class="iconfont icon-arrow-up-bold"></span>
                <span class="iconfont icon-arrow-up-bold see"></span>
              </div>
            </div>
          </div>
        </div>
      </van-tab>

      <van-tab title="精选">
        <div class="choiceness">
          <div class="choiceness_top">精选榜</div>
          <div class="choiceness_flx">
            <div class="flx_one">
              <div
                class="lis"
                v-for="item in choicenesslists"
                :key="item.id"
                @click="toPlayList(item.id)"
              >
                <div>{{ item.updateFrequency }}</div>
                <img :src="item.coverImgUrl" alt="" />
              </div>
            </div>
          </div>
        </div>
      </van-tab>

      <van-tab title="曲风">
        <div class="choiceness">
          <div class="choiceness_top">曲风榜</div>
          <div class="choiceness_flx">
            <div class="flx_one">
              <div
                class="lis"
                v-for="item in genrelists"
                :key="item.id"
                @click="toPlayList(item.id)"
              >
                <div>{{ item.updateFrequency }}</div>
                <img :src="item.coverImgUrl" alt="" />
              </div>
            </div>
          </div>
        </div>
      </van-tab>

      <van-tab title="全球">
        <div class="choiceness">
          <div class="choiceness_top">全球榜</div>
          <div class="choiceness_flx">
            <div class="flx_one">
              <div
                class="lis"
                v-for="item in globallists"
                :key="item.id"
                @click="toPlayList(item.id)"
              >
                <div>{{ item.updateFrequency }}</div>
                <img :src="item.coverImgUrl" alt="" />
              </div>
            </div>
          </div>
        </div>
      </van-tab>

      <van-tab title="语种">
        <div class="choiceness">
          <div class="choiceness_top">语种榜</div>
          <div class="choiceness_flx">
            <div class="flx_one">
              <div
                class="lis"
                v-for="item in languagelists"
                :key="item.id"
                @click="toPlayList(item.id)"
              >
                <div>{{ item.updateFrequency }}</div>
                <img :src="item.coverImgUrl" alt="" />
              </div>
            </div>
          </div>
        </div>
      </van-tab>

      <van-tab title="特色">
        <div class="choiceness">
          <div class="choiceness_top">特色榜</div>
          <div class="choiceness_flx">
            <div class="flx_one">
              <div
                class="lis"
                v-for="item in featurelists"
                :key="item.id"
                @click="toPlayList(item.id)"
              >
                <div>{{ item.updateFrequency }}</div>
                <img :src="item.coverImgUrl" alt="" />
              </div>
            </div>
          </div>
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>
<script>
import { getSongCatlist } from "@/api/home.js";
export default {
  data() {
    return {
      rankinglists: null,
      officiallists: [], //官方
      choicenesslists: [], //精选
      genrelists: [], //曲风
      globallists: [], //全球
      languagelists: [],
      featurelists: [],
    };
  },
  // {id:19723756}
  methods: {
    // 返回上一页
    toback() {
      this.$router.back();
    },
    // 前往歌单
    toPlayList(id) {
      this.$router.push({ name: "playlistDetail", query: { id: id } });
    },
    getSongCatlistFun() {
      getSongCatlist().then((data) => {
        // console.log(data);
        this.rankinglists = data.list;
        this.rankinglists.map((item, index) => {
          if (item.ToplistType) {
            this.officiallists.push(item);
          }
          if (4 <= index && index < 14) {
            this.choicenesslists.push(item);
          } else if (14 <= index && index < 24) {
            this.genrelists.push(item);
          } else if (24 <= index && index < 30) {
            this.globallists.push(item);
          } else if (30 <= index && index < 37) {
            this.languagelists.push(item);
          } else if (37 <= index) {
            this.featurelists.push(item);
          }
        });
      });
    },
  },
  created() {
    this.getSongCatlistFun(); //歌单分类
  },
};
</script>
<style lang="scss">
.ranking {
  background-color: #edf2f9;
  height: 100%;
  overflow: scroll;
  .top {
    // background-color: pink;
    line-height: 40px;
    position: fixed;
    top: 0;
    display: flex;
    align-items: center;
    width: 100%;
    justify-content: space-between;
    z-index: 99;
    background: #edf2f9;
    div {
      font-size: 15px;
      font-weight: 600;
      span {
        margin-right: 10px;
        margin-left: 10px;
      }
    }
    .rig {
      border: 1px solid #d7dbe3;
      border-radius: 20px;
      font-size: 10px;
      height: 15px;
      color: #404758;
      line-height: 15px;
      padding: 5px 10px;
      transform-origin: top;
      transform: scale(0.8);
      margin-top: 5px;
      // margin-right: 10px;
    }
  }

  .van-tabs__content {
    padding-bottom: 50px;
  }
  .recommend {
    // background-color: pink;
    margin-top: 40px;
    margin-bottom: 20px;
    .top_log {
      width: 95%;
      height: 40px;
      line-height: 40px;
      // background-color: red;
      margin: auto;
      font-size: 14px;
      font-weight: bold;
    }
    .recommend_list {
      width: 95%;
      // background-color: rebeccapurple;
      margin: auto;
      display: flex;
      justify-content: space-between;
      .network {
        width: 110px;
        height: 110px;
        border-radius: 10px;
        background-image: linear-gradient(to bottom right, #00b4db, #0083b0);
      }
      .europe {
        width: 110px;
        height: 110px;
        border-radius: 10px;
        background-image: linear-gradient(to bottom right, #808080, #3fada8);
      }
      .noon {
        width: 110px;
        height: 110px;
        border-radius: 10px;
        background-image: linear-gradient(to bottom right, #eacda3, #d6ae7b);
      }
      .choiceness {
        display: flex;
        flex-direction: column;
        justify-content: center;
        text-align: center;
        h3 {
          color: #fff;
          font-weight: 700;
          padding-bottom: 5px;
        }
        span {
          padding-top: 5px;
          font-size: 12px;
          color: #ccc;
        }
      }
    }
  }
  .official {
    margin-top: 20px;
    width: 95%;
    margin: auto;
    .official_top {
      // background-color: lawngreen;
      .span {
        float: left;
        line-height: 20px;
        padding-right: 5px;
        padding-top: 2px;
        img {
          width: 15px;
          height: 15px;
          border-radius: 50%;
        }
      }
      .size {
        font-size: 14px;
        font-weight: bold;
      }
    }
    .hot_list {
      margin-top: 10px;
      padding-top: 10px;
      border-radius: 10px;
      background-color: #fff;
      margin-bottom: 20px;
      padding-bottom: 10px;
      .hot_list_top {
        padding: 0px 10px;
        display: flex;
        justify-content: space-between;
        .size_l {
          font-weight: bold;
          font-size: 16px;
        }
        .size_r {
          font-size: 8px;
          color: #b8bbc2;
          transform: scale(0.8);
        }
      }
      .hot_list_item {
        padding: 0px 10px;
        // margin-top: 10px;
        display: flex;
        justify-content: space-between;
        .hot_flx {
          img {
            display: inline-block;
            border-radius: 10px;
            width: 55px;
            height: 55px;
            margin-right: 10px;
          }
          .hot {
            display: inline-block;
            div {
              margin-top: 5px;
              font-weight: 550;
              span {
                font-size: 10px;
                transform: scale(0.9);
                // font-weight: bold;
                display: inline-block;
              }
              a {
                font-size: 10px;
                display: inline-block;
                color: #3d465a;
                transform-origin: left;
                transform: scale(0.8);
              }
            }
          }
        }
        .log_r {
          // background-color: lawngreen;
          height: 60px;

          margin-top: 5px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          span {
            font-size: 6px;
            // display: block;
          }
          .see {
            color: red;
            transform: rotate(180deg);
          }
        }
      }
    }
  }
  .choiceness {
    // background-color: lawngreen;
    margin-top: 15px;
    width: 95%;
    margin: auto;
    .genre {
      margin-top: 30px;
      display: flex;
      div {
        background-color: #e3e8ef;
        margin-left: 10px;
        font-size: 12px;
        height: 18px;
        color: #404758;
        line-height: 18px;
        padding: 3px 10px;
        border-radius: 15px;
        span {
          font-size: 12px;
        }
      }
    }
    .global {
      margin-top: 20px;
    }
    .language {
      margin-top: 20px;
    }
    .feature {
      margin-top: 20px;
    }
    .choiceness_top {
      font-weight: bold;
      font-size: 14px;
    }
    .choiceness_flx {
      .flx_one {
        margin-top: 10px;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        .lis {
          padding-bottom: 30px;
          //   padding: 14px 0px;
          position: relative;
          img {
            width: 110px;
            height: 110px;
            border-radius: 10px;
          }
          div {
            position: absolute;
            // background-color: red;
            width: 80px;
            bottom: 30px;
            text-align: center;
            height: 30px;
            line-height: 30px;
            // border-top: 1px solid #d0d2f0;
            left: 15px;
            font-size: 12px;
            color: #d7dbe3;
          }
        }
      }
    }
  }
}
</style>