const { createProxyMiddleware } = require('http-proxy-middleware');

const host = process.env.QUOKKA_BACKEND_URL || 'http://localhost:8100';

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: host,
      changeOrigin: true,
    })
  );
  app.use(
    '/Priv',
    createProxyMiddleware({
      target: host,
      changeOrigin: true,
    })
  );
};
