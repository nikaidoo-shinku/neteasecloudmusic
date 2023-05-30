const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  // 配置代理，解决跨域请求问题
  devServer:{
    proxy:{
      "/DataJson":{
        target:"http://10.10.24.18:3000/DataJson",
        changeOrigin:true,
        ws:false,
        // pathRewrite:{
        //   "^/DataJson":"/DataJson"
        // }
      },
      "/":{
        target:"http://192.168.36.18:3000",
        changeOrigin:true,
        ws:false,
      },
    }
  }
})
