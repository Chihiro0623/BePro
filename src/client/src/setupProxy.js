const { createProxyMiddleware } = require("http-proxy-middleware");
module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "http://210.107.197.182:3400",
      changeOrigin: true,
    })
  );
};
