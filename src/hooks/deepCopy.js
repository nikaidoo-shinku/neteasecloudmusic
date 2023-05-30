export function deepCopy(obj) {
    //obj 形参就是需要被拷贝的对象
    // 判断是否为对象，如果不是对象，那么就不需要进行深拷贝
    if (typeof obj !== "object") {
        return;
    }
    // 判断 obj 的值是否为 null
    if (obj === null) {
        return;
    }
    // 判断是否为数组，如果为数组，则创建新的空数组；如果不是数组，则创建新的空对象
    var newObj = Array.isArray(obj) ? [] : {};
    // 使用 for...in 遍历 obj
    for (var attr in obj) {
        // 如果 obj [attr] 又是一个对象类型，那么我们再次进行 deepCopy () 调用
        if (typeof obj[attr] === "object") {
            newObj[attr] = deepCopy(obj[attr]);
        } else {
            // 往 newObj 中添加属性
            newObj[attr] = obj[attr];
        }
    }
    // 返回 newObj 变量
    return newObj;
}