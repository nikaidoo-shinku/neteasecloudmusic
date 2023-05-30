// 节流函数
export default function throttle(fn, delay) {
    // 定义一个变量存储上一次执行时间
    let prev = Date.now();
    // 返回一个新的函数
    return function () {
        // 获取当前函数的执行上下文和参数
        let context = this;
        let args = arguments;
        // 获取当前时间
        let now = Date.now();
        // 如果当前时间减去上一次执行时间大于等于延迟时间，则执行原函数，并更新上一次执行时间
        if (now - prev >= delay) {
            fn.apply(context, args);
            prev = now;
        }
    };
}