const express = require("express");
const authService = require("../services/auth.service");
const { catchAsync } = require("../utils");

const router = express.Router();

router.post(
  "/signin",
  catchAsync(async (req, res) => {
    const { userid, password } = req.body;
    const { message } = await authService.signin({ userid, password });

    req.session.userid = userid;

    await req.session.save();

    res.json({ data: message });
  })
);

router.post(
  "/signup",
  catchAsync(async (req, res) => {
    const { userid, username, password } = req.body;
    const message = await authService.signup({ userid, username, password });

    res.json({ data: message });
  })
);

router.get(
  "/logout",
  catchAsync(async (req, res) => {
    req.session.destroy();
    res.json({ message: "success" });
  })
);

module.exports = router;
