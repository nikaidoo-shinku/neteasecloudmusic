import service from "./https.js";


// 获取轮播图数据
export function getBanner() {
    return service({
        url: "/banner",
        method: "get",
        params: {
            type: 2 //手机版本
        }
    })
}

// 获取首页-发现
export function getBlock() {
    return service({
        url: '/homepage/block/page',
        method: 'get'
    })
}

// 获取首页-发现-圆形图标入口列表
export function getDragonBall() {
    return service({
        url: "/homepage/dragon/ball",
        method: "get"
    })
}

// 获取推荐歌单
export function getPersonalized() {
    return service({
        url: "/personalized",
        method: "get",
        params: {
            limit: 6
        }
    })
}

// 歌单详情
export function getPlayListDetail(id) {
    return service({
        url: `/playlist/detail?id=${id}`,
        method: 'get',
    })
}

export function getPlayListDetailAll(id) {
    return service({
        url: `/playlist/track/all?id=${id}`,
        method: 'get',
    })
}

//  收藏歌单
export function getPlaylistSubscribe(params) {
    return service({
        url: "/playlist/subscribe",
        // url:"/DataJson/playlistDetail.json",
        method: "get",
        params
    })
}

// 每日推荐详情
export function getDayMusicList() {
    return service({
        url: '/recommend/songs',
        method: 'get',
    })
}

// 单首歌曲数据
export function getMusicDetail(id) {
    return service({
        url: `/song/detail?ids=${id}`,
        method: 'get',
    })
}

// 歌曲播放数据
export function getMusicPlay(id) {
    return service({
        url: `/song/url?id=${id}`,
        // url:"/DataJson/songUrl.json"
        method: 'get',
    })
}

// 歌词数据
export function getMusicWord(id) {
    return service({
        url: `/lyric?id=${id}`,
        // url:"/DataJson/songUrl.json"
        method: 'get',
    })
}


// 登录
// 发送验证码
// /captcha/sent?phone=13xxx
export function getCaptchaSent(data) {
    return service({
        url: "/captcha/sent",
        method: "post",
        data
    })
}

// 验证验证码
// /captcha/verify?phone=13xxx&captcha=1597
export function getCcaptchaVerify(data) {
    return service({
        url: "/captcha/verify",
        method: "post",
        data
    })
}

// 二维码调用用接口
// /login/qr/key
export function getLoginQrKey() {
    return service({
        url: "/login/qr/key",
        method: "post",
        data: {
            time: new Date().getTime() //防止缓存
        }
    })
}

// 二维码生成接口

// /login/qr/create?key=xxx
export function getLoginQrCreate(data) {
    return service({
        url: "/login/qr/create",
        method: "post",
        data
    })
}
// 二维码检测扫码状态接口
// /login/qr/check?key=xxx
export function getLoginQrCheck(data) {
    return service({
        url: "/login/qr/check",
        method: "post",
        data
    })
}

// 退出登录
// /logout

export function getLogout(data) {
    return service({
        url: "/logout",
        method: "post",
        data
    })
}



// 用户中心
// 账号信息
export function getUserAccount() {
    return service({
        url: "/user/account",
        method: "post",
    })
}

// 用户详情
export function getUserDetail(uid) {
    return service({
        url: `/user/detail?uid=${uid}`,
        method: "post",
    })
}

// 用户歌单
export function getUserList(uid) {
    return service({
        url: `/user/playlist?uid=${uid}`,
        method: "post",
        // params: {
        //     uid: `${uid}`,
        //     limit: `${limit}`,
        //     offset: `${offset}`
        // }
    })
}


// 搜索功能
//热搜榜
export function getSearchHot() {
    return service({
        url: `/search/hot/detail`,
        method: 'get',
    })
}

//默认搜索关键字
export function getSearchDefault() {
    return service({
        url: `/search/default`,
        method: 'get',
    })
}

// 搜索建议
export function getSearchSuggest(keywords) {
    return service({
        url: `/search/suggest?keywords=${keywords}&type=mobile`,
        method: 'get',
    })
}

// 搜索结果
export function getSearchResult(keywords, type = 1018, limit = 100) {
    return service({
        url: `/search?keywords=${keywords}&type=${type}&limit=${limit}`,
        method: 'get',
    })
}



// 评论
export function getComment(params) {
    return service({
        url: "/comment/playlist",
        method: "get",
        params
    })
}

// 点赞
export function getCommentLike(params) {
    return service({
        url: "/comment/like",
        method: "get",
        params
    })
}


// 排行榜
export function getSongCatlist() {
    return service({
        url: "/toplist/detail",
        // url:"/DataJson/songDetail.json",
        method: "get",
    })
}
