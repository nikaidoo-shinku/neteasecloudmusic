import Vue from "vue";
import "lib-flexible/flexible"; // rem转换
import App from "./App.vue";
import router from "./router";
import store from "./store";

import "@/assets/font/iconfont.css";
import "@/assets/css/base.css";

import {
  Swipe,
  SwipeItem,
  Sticky,
  Icon,
  PullRefresh,
  Circle,
  ShareSheet,
  Slider,
  Popup,
  Popover,
  Lazyload,
  Tab,
  Tabs,
} from "vant";
// import "swiper/dist/css/swiper.min.css";
// import VueAwesomeSwiper from 'vue-awesome-swiper'
// import 'vue-awesome-swiper/node_modules/swiper/dist/css/swiper.css'
import "@/assets/js/rem.js";

Vue.use(Swipe)
  .use(SwipeItem)
  .use(Sticky)
  .use(Icon)
  .use(PullRefresh)
  .use(Circle)
  .use(ShareSheet)
  .use(Slider)
  .use(Popup)
  .use(Popover)
  .use(Lazyload, {
    lazyComponent: true,
  })
  .use(Tab)
  .use(Tabs);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
