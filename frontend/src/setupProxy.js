const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        createProxyMiddleware('/geoserver', {
            target: 'http://localhost:8080/geoserver',
            changeOrigin: true,
            pathRewrite: {
                "^/geoserver": "",
            },
            headers: {
                Connection: "keep-alive"
            }
        })
    );
    app.use(
        createProxyMiddleware('/api', {
            target: 'http://localhost:44281',
            changeOrigin: true,
            headers: {
                Connection: "keep-alive"
            }
        })
    );
}