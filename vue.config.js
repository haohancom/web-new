const { defineConfig } = require('@vue/cli-service')



module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',

  devServer: {
    proxy: {
      
      '/api': {
        target: 'http://localhost:8080/',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      },
      
      // 代理getClassroomAttendance接口
      '/qt': {
        target: 'http://220.180.237.78:8181',
        changeOrigin: true,
        secure: false
      }

    },
    host: "0.0.0.0",
    port: 3000,
    open: true
  }
})
