import Vue from 'vue'
import Vuex from 'vuex'
import { getMusicPlay, getMusicWord } from '@/api/home.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    musicId: null, // 歌曲id
    musicCover: null, // 歌曲封面
    musicTime: null, // 歌曲时间
    musicName: null, // 歌曲名
    arName: null, // 歌手名
    musicIndex: null, // 歌单歌曲下标
    musicList: null, // 歌单列表
    musucListOld: null, // 歌单列表初始状态
    musicData: {}, // 歌曲对象
    songPlayDetailView: false,// 歌曲播放详情页的显示与隐藏
    playAutoView: true, // 底部播放器的显示与隐藏
    musicPlayStore: {}, // 歌曲播放状态
    musicAuto: 0, // 歌曲自动播放状态

    // 歌单列表状态
    musicListStore: 0, // 歌单列表状态 0: 顺序播放 1：随机播放 2: 单曲循环
    musicListStoreData: [], // 歌单更改顺序后的状态
    musicListClick: 0, // 判断歌单状态是否改变

    // 歌词部分
    musicWord: [], // 歌词
    time: [], // 歌词时间
  },
  getters: {
  },
  mutations: {
    // 根据点击的歌曲更改歌曲id
    musicIdChange(state, payload) {
      state.musicId = payload.id
      state.musicCover = payload.cover
      state.musicTime = payload.time
      state.musicName = payload.songName
      state.arName = payload.ar
      state.musicIndex = payload.ind
    },
    // 单独更改歌曲在原本顺序版本歌单的下标
    musicIndexChange(state, payload) {
      state.musicIndex = payload
    },
    musicListChange(state, payload) {
      state.musicList = payload
    },
    musucListOldChange(state, payload) {
      state.musucListOld = payload
    },
    // 修改歌曲对象状态
    musicDetail(state, payload) {
      state.musicData = payload
    },
    // 修改歌曲详情页状态
    songPlayDetailChange(state, payLoad) {
      state.musicPlayStore = payLoad
    },
    // 更改歌词状态
    musicWordChange(state, payLoad) {
      state.musicWord = payLoad
    },
    updatelyric(state, payload) {
      state.time = payload.time
      state.musicWord = payload.word
    },
    // 更改歌单列表状态
    musicListStoreChange(state, payLoad) {
      state.musicListStore = payLoad
    },
    // 改变’‘歌单改变状态’
    musicListClickChange(state, payLoad) {
      state.musicListClick = payLoad
    },
    // 歌曲自动播放状态
    musicAutoChange(state, payLoad) {
      state.musicAuto = ++state.musicAuto
    }
  },
  actions: {
    // 获取单曲数据
    getMusicDetailAction({ commit, state }) {
      return getMusicPlay(state.musicId).then(data => {
        if (data.data) {
          commit('musicDetail', data.data[0])
        }
      })
    },
    // 获取歌词数据
    async getMusicWordAction({ commit, state }) {
      return await getMusicWord(state.musicId).then(data => {
        if (data) {
          this.dispatch('formatLyr', data.lrc.lyric)
        }
      })
    },
    // 处理歌词
    formatLyr(context, lyricStr) {
      let time = []
      let word = []
      let song = []
      let reg = /\n/g
      let newLyric = lyricStr.split(reg)
      newLyric = newLyric.forEach((item) => {
        if (item !== newLyric[newLyric.length - 1]) {
          let regTime = /\d{2}:\d{2}.\d{2}/g
          let regWord = /\][\Wa-zA-Z]{0,}/g
          if (item.match(regTime)) {
            time.push(item.match(regTime).join(""))
            word.push(item.match(regWord).join("").split("]")[1])
          }
        }
      })

      let timeFomat = time.map((item) => {
        let regFomat = /:/g
        let timeArr = item.split(regFomat)
        return (Number(timeArr[0]) * 60 + Number(timeArr[1])).toFixed(2)
      })

      let newTime = timeFomat.map((item) => {
        return item = item
      })
      for (let i = 0; i < word.length; i++) {
        song.push(word[i])
      }
      context.commit('updatelyric', { time: newTime, word: song })
    },
  },
  modules: {
  }
})
