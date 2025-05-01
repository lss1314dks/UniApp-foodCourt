module.exports = {
    transpileDependencies: ['uview-ui'],
    devServer: {
            proxy: {
              '/api': {
                target: 'http://47.109.139.91:8081/',
                changeOrigin: true,
                pathRewrite: {
                  '^/api': ''
                }
              }
            },
    }
}