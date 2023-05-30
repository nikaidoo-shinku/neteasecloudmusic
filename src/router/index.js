import Vue from 'vue'
import VueRouter from 'vue-router'

import PlayAuto from '@/components/PlayAuto.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('@/views/HomeView.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
    meta: {
      playIsShow: true
    }
  },
  {
    path: '/playlistDetail',
    name: 'playlistDetail',
    component: () => import('@/views/PlaylistDetail.vue')
  },
  {
    path: '/dayMusicList',
    name: 'dayMusicList',
    component: () => import('@/views/DayMusicList.vue')
  },
  // 当用户进入个人中心，先登录后进入
  {
    path: '/userinfo',
    name: 'userinfo',
    component: () => import('@/views/UserInfo.vue'),
    // 独享路由守卫
    beforeEnter: (to, from, next) => {
      let token = window.localStorage.getItem("token");
      // 判断是否登录
      if (!token) {
        next('/login');
        return;
      } else {
        next();
      }
    }
  },
  {
    path: '/userPlayList',
    name: 'userPlayList',
    component: () => import('@/views/UserAllPlayList.vue'),
    meta: {
      playIsShow: true
    }
  },
  {
    path: '/searchView',
    name: 'searchView',
    component: () => import('@/views/SearchView.vue'),
  },
  {
    path: '/searchResult',
    name: 'searchResult',
    component: () => import('@/views/SearchResult.vue'),
  },
  {
    path: '/comment',
    name: 'comment',
    component: () => import('@/views/commentView.vue')
  },
  {
    path: '/rank',
    name: 'rank',
    component: () => import('@/views/RankView.vue')
  }
]

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
