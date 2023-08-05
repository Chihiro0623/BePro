const express = require("express");
const userRoute = require("./user.route");
const authRoute = require("./auth.route");
const fileRoute = require("./file.route");
const postRoute = require("./post.route");

const router = express.Router();
const routes = [
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/user",
    route: userRoute,
  },
  {
    path: "/file",
    route: fileRoute,
  },
  {
    path: "/post",
    route: postRoute,
  },
];

routes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
