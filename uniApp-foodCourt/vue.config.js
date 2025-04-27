module.exports = {
    transpileDependencies: ['uview-ui'],
    devServer: {
            proxy: {
              '/api': {
                target: 'http://localhost:8081/',
                changeOrigin: true,
                pathRewrite: {
                  '^/api': ''
                }
              }
            },
    }
}