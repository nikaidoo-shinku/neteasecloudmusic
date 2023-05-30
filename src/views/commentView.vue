<template>
  <div class="comment" v-if="radarlist && playlist">
    <van-sticky>
      <div class="comment-up">
        <div>
          <span class="iconfont icon-arrow-left-bold" @click="toBack"></span>
          评论({{ radarlist.total }})
        </div>
        <div class="sonup-r">
          <span class="iconfont icon-31fenxiang"></span>
        </div>
      </div>
    </van-sticky>
    <div class="radar">
      <div class="radar-img">
        <img :src="playlist.coverImgUrl" alt="" />
      </div>
      <div class="radar-wen">
        <h4>{{ playlist.name }}</h4>
        <p>
          by: <span>{{ playlist.creator.nickname }}</span>
        </p>
      </div>
    </div>
    <div class="mark">
      <div class="item">
        <div class="item-l">
          <span>云村评分<em>9.5</em></span>
          <h3>高分必听</h3>
          <p>166223人已评价</p>
        </div>
        <div class="item-r">
          <div class="schedule">
            <div class="searc"><span>喜欢</span></div>
            <div class="tiao">
              <div class="orange"></div>
            </div>
          </div>
          <div class="schedule">
            <div class="searc"><span>一般</span></div>
            <div class="tiao">
              <div class="orange" style="width: 7%"></div>
            </div>
          </div>
          <div class="schedule">
            <div class="searc"><span>不行</span></div>
            <div class="tiao">
              <div class="orange" style="width: 3%"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="comments-section">
      <div class="section-up">
        <div class="section-l">
          <h3>评论区</h3>
        </div>
        <div class="section-r">
          <div class="recommend">
            <span :class="{ con: conid == 0 }" @click="conse(0)">推荐</span>
            <span :class="{ con: conid == 1 }" @click="conse(1)">最热</span>
            <span :class="{ con: conid == 2 }" @click="conse(2)">最新</span>
          </div>
        </div>
      </div>
      <div class="section-down">
        <div
          class="skeleton"
          v-for="item in commentslists"
          :key="item.commentId"
        >
          <div class="skeleton-l">
            <div class="img">
              <img :src="item.user.avatarUrl" alt="" />
            </div>
          </div>
          <div class="skeleton-r">
            <div class="skename">
              <div class="wen">
                <p>{{ item.user.nickname }}</p>
                <div v-if="item.user.vipType == 11">
                  <img :src="item.user.vipRights.associator.iconUrl" alt="" />
                </div>
                <span>{{ item.timeStr }}</span>
              </div>
              <div
                class="like"
                @click="upvote(item.commentId)"
                v-show="item.liked"
              >
                <em class="con" v-if="!(item.likedCount == 0)">{{
                  item.likedCount | playcountData
                }}</em>
                <van-icon name="good-job-o" class="conlike" />
              </div>
              <div
                class="like"
                @click="upvote(item.commentId)"
                v-show="!item.liked"
              >
                <em v-if="!(item.likedCount == 0)">{{
                  item.likedCount | playcountData
                }}</em>
                <van-icon name="good-job-o" class="conlikeNo" />
              </div>
            </div>
            <div class="txt-cut-tow skeping">
              {{ item.content }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getComment, getCommentLike } from "@/api/home.js";
import { getPlayListDetail } from "@/api/home.js";
export default {
  data() {
    return {
      playlist: null,
      radarlist: null,
      typeid: 2,
      pingid: null,
      tindex: 1,
      postlists: [],
      commentslists: null,
      conid: 0,
    };
  },
  methods: {
    getCommentFun() {
      getComment({
        id: this.$route.query.id,
      }).then((data) => {
        this.radarlist = data;
        if (this.conid == 1) {
          this.commentslists = data.hotComments;
        } else {
          this.commentslists = data.comments;
        }
      });
    },
    getPlaylistDetailFun(id) {
      getPlayListDetail(id).then((data) => {
        this.playlist = data.playlist;
      });
    },
    getCommentLikeFun() {
      getCommentLike({
        id: this.$route.query.id, //歌单id
        cid: this.pingid, //评论id
        t: this.tindex, //是否点赞 ,1 为点赞 ,0 为取消点赞
        type: this.typeid, //资源类型 2为歌单
      }).then((data) => {});
    },
    conse(index) {
      this.conid = index;
      this.getCommentFun();
    },
    upvote(id) {
      this.pingid = id;
      let index = this.commentslists.findIndex(
        (item) => item.commentId == this.pingid
      );
      console.log(this.commentslists[index].liked);
      if (this.commentslists[index].liked) {
        this.commentslists[index].likedCount--;
        this.commentslists[index].liked = false;
        this.tindex = 0;
      } else {
        this.commentslists[index].likedCount++;
        this.commentslists[index].liked = true;
        this.tindex = 1;
      }

      this.getCommentLikeFun();
    },
    toBack() {
      this.$router.back();
    },
  },

  created() {
    if ("id" in this.$route.query) {
      this.getCommentFun();
      this.getPlaylistDetailFun(this.$route.query.id);
    } else {
      this.$router.push("/home");
    }
  },
  filters: {
    playcountData(value) {
      if (value < 10000) {
        return value;
      }
      let w = value > 10000 ? value / 10000 : value; //万计算
      let y = w > 10000 ? parseInt(w / 10000) + "亿" : parseInt(w) + "万";

      return y;
    },
  },
};
</script>

<style lang="scss">
.comment {
  height: 100%;
  background: #f7f7f7;
  overflow: scroll;
  .comment-up {
    display: flex;
    justify-content: space-between;
    height: 40px;
    background: #fff;
    line-height: 40px;
    font-weight: 45px;
    .sonup-l {
      padding-left: 12px;
      font-size: 14px;
      span {
        font-size: 16px;
        padding-top: 5px;
      }
    }
    .sonup-r {
      padding-right: 12px;
      span {
        font-size: 20px;
        line-height: 45px;
      }
    }
  }
  .radar {
    height: 52px;
    background: #fff;
    display: flex;
    .radar-img {
      margin-left: 12px;
      width: 45px;
      height: 45px;
      border-radius: 8px;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .radar-wen {
      flex: 1;
      height: 52px;
      padding-left: 15px;
      flex-direction: column;
      justify-content: center;
      h4 {
        font-size: 12px;
        padding-top: 7px;
      }
      p {
        font-size: 12px;
        span {
          color: #8fcccb;
          font-size: 12px;
        }
      }
    }
  }
  .mark {
    margin-top: 4px;
    height: 58px;
    background: #fff;
    .item {
      margin: 0 12px;
      display: flex;
      border-bottom: 1px solid #f1f1f1;
      padding-bottom: 5px;
      padding-top: 5px;
      .item-l {
        width: 90px;
        height: 55px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        text-align: center;
        span {
          font-size: 10px;
          color: gray;
          scale: (0.8);
          em {
            color: black;
          }
        }
        h3 {
          font-size: 16px;
          color: #ff8045;
          font-weight: 700;
        }
        p {
          font-size: 8px;
          scale: (0.6);
        }
      }
      .item-r {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding-left: 15px;
        .schedule {
          font-size: 12px;

          height: 15px;
          display: flex;
          align-items: center;
          .searc {
            scale: (0.7);
            span {
              color: #ff8045;
              display: inline;
            }
          }
          .tiao {
            height: 3px;
            width: 70%;
            background: #fff8f5;
            margin-bottom: 7px;
            margin-top: 9px;
            margin-left: 20px;
            .orange {
              width: 90%;
              height: 3px;
              background: #ff8045;
            }
          }
        }
      }
    }
  }
  .comments-section {
    // background: #fff;
    margin-top: 4px;
    .section-up {
      height: 30px;
      line-height: 30px;
      display: flex;
      padding: 0 12px;
      justify-content: space-between;
      background-color: #fff;
      .section-l {
        h3 {
          font-size: 12px;
        }
      }
      .section-r {
        span {
          font-size: 10px;
          scale: (0.8);
          padding: 0 6px;
          color: #9b9b9b;
          &.con {
            color: black;
          }
        }
      }
    }
    .section-down {
      // line-height: 30px;
      padding: 0 12px;
      background-color: #fff;

      .skeleton {
        display: flex;
        justify-content: space-between;
        background-color: #fff;
        .skeleton-l {
          width: 30px;
          .img {
            margin-top: 5px;
            img {
              width: 25px;
              height: 25px;
              border-radius: 50%;
            }
          }
        }
        .skeleton-r {
          flex: 1;
          border-bottom: 1px solid #fafafa;
          .skename {
            height: 35px;
            font-size: 12px;
            display: flex;
            justify-content: space-between;
            .wen {
              padding-top: 5px;
              height: 30px;
              display: flex;
              flex-direction: column;
              position: relative;
              // align-items: center;
              div {
                position: absolute;
                right: -27px;
                top: 8px;
                img {
                  width: 25px;
                }
              }

              span {
                font-size: 12px;
                scale: (0.75);
                color: #959090;
                float: left;
                margin-left: -10px;
              }
            }
            .like {
              padding-top: 5px;
              //  height: 35px;
              line-height: 30px;
              color: #bababa;
              display: flex;

              scale: (0.8);
              em {
                font-size: 16px;
                &.con {
                  color: red;
                }
              }

              .conlike {
                font-size: 20px;
                line-height: 24px;
                color: red;
              }

              .conlikeNo {
                font-size: 20px;
                line-height: 24px;
              }
              span {
                font-size: 14px;
                display: block;
                &.con {
                  color: red;
                }
              }
            }
          }
          .skeping {
            // height: 35px;
            font-size: 12px;
            padding-top: 8px;
            padding-bottom: 20px;
            color: #424141;
            line-height: 20px;
          }
          // .skeren{
          //     height: 20px;
          //     line-height: 20px;
          //     font-size: 12px;
          //     display: flex;
          //     span{
          //         scale: (.8);
          //     }
          // }
        }
      }
    }
  }
}
</style>