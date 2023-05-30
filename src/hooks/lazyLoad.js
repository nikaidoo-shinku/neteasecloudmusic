import { ref } from "vue"
import { onMounted, onUnmounted } from "vue"

import { throttle } from 'underscore'

// 监听滚动事件
export default function useScroll(elRef) {
    let el = window
    const isReachBottom = false
    const clientHeight = 0
    const scollTop = 0
    const scollHeight = 0

    const scrollListenerHandler = throttle(() => {
        if (el === window) {
            clientHeight.value = document.documentElement.clientHeight
            scollTop.value = document.documentElement.scrollTop
            scollHeight.value = document.documentElement.scrollHeight
        } else {
            clientHeight.value = el.clientHeight
            scollTop.value = el.scrollTop
            scollHeight.value = el.scrollHeight
        }

        // 当 视口顶部距离初始顶部位置的高度 + 当前视口高度 >= 可滚动高度时发送网络请求加载更多
        if (scollTop.value + clientHeight.value >= scollHeight.value) {
            isReachBottom.value = true
        }

    }, 100)

    onMounted(() => {
        if (elRef) {
            el = elRef.value
        }
        el.addEventListener("scroll", scrollListenerHandler)
    })

    onUnmounted(() => {
        el.removeEventListener("scroll", scrollListenerHandler)
    })

    return { isReachBottom, scollTop, clientHeight, scollHeight }
}