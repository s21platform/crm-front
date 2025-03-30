const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'http://217.28.222.68:6050', // Сервер, на который будет идти проксирование
            changeOrigin: true,
            secure: false,
            logLevel: 'debug',
            onProxyReq: (proxyReq, req) => {
                console.log('🔄 Proxying:', req.method, req.url);
            },
            onProxyRes: (proxyRes, req) => {
                console.log('✅ Response:', proxyRes.statusCode, req.url);
            },
            onError: (err, req, res) => {
                console.error('❌ Proxy Error:', err);
                res.writeHead(500, {
                    'Content-Type': 'text/plain',
                });
                res.end('Произошла ошибка при выполнении запроса к серверу.');
            }
        })
    );
}; 