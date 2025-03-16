const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
target: 'http://localhost:5001', // ✅ Backend API URL
      changeOrigin: true,
      secure: false,
      headers: {
        'Connection': 'keep-alive',
      },
      pathRewrite: {
        '^/api': '', // ✅ Removes '/api' from the forwarded path
      },
      onProxyReq: (proxyReq, req, res) => {
        proxyReq.setHeader('X-Forwarded-Proto', 'http'); // ✅ Custom headers if needed
      },
      onProxyRes: (proxyRes, req, res) => {
        // ✅ Fix potential CORS issues (optional)
        proxyRes.headers['Access-Control-Allow-Origin'] = '*';
        proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
        proxyRes.headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept, Authorization';
      },
      onError: (err, req, res) => {
        if (!res.headersSent) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
        }
        res.end(JSON.stringify({
          status: 'error',
          message: 'Proxy Error',
          details: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error'
        }));
      },
    })
  );

  // ✅ Improved logging in development mode
  if (process.env.NODE_ENV === 'development') {
    app.use((req, res, next) => {
      console.log(`[Proxy] ${req.method} ${req.path} => ${req.path.replace('/api', '')}`);
      next();
    });
  }
};
