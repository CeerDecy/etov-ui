const {createProxyMiddleware} = require('http-proxy-middleware')

module.exports = function (app)  {
    console.log("====> proxy")
    app.use(
        // 代理 1
        createProxyMiddleware('/api/**', {             // 匹配到 '/api' 前缀的请求，就会触发该代理配置
            target: 'http://127.0.0.1:8181/api',  // 请求转发地址
            changeOrigin: true,                             // 是否跨域
        }),
    )
}