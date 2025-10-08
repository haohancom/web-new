const { defineConfig } = require('@vue/cli-service')



module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,

  devServer: {
    proxy: {
      
      '/api': {
        target: 'http://192.168.6.164:8080/',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      },

    },
    host: "localhost",
    port: 3000,
    open: true
  }
})
