const express = require("express");
const { models } = require("../database");
const { catchAsync, ApiError } = require("../utils");
const { isAuthenticated } = require("../middleware");

const userService = require("../services/user.service");

const router = express.Router();

router.get(
  "/me",
  isAuthenticated,
  catchAsync(async (req, res) => {
    const { userid, username, contacts, email, career, field, participating } =
      await userService.getUserInfoById(req.session.userid);

    res.json({
      data: {
        user: {
          userid,
          username,
          contacts,
          email,
          career,
          field,
          participating,
        },
      },
    });
  })
);

router.get(
  "/:userid",
  isAuthenticated,
  catchAsync(async (req, res) => {
    const user = await models.users
      .findOne({ userid: req.params.userid })
      .select({
        userid: true,
        username: true,
        contact: true,
        email: true,
        career: true,
        field: true,
        position: true,
        participating: true,
        fileid: true,
      })
      .populate(["participating", "fileid"])
      .exec();

    res.json({ data: { user } });
  })
);

router.put(
  "/:userid",
  isAuthenticated,
  catchAsync(async (req, res) => {
    try {
      const { username, contact, email, position, field, career, fileid } =
        req.body;

      const result = await models.users
        .findOneAndUpdate(
          { userid: req.params.userid },
          { username, contact, email, position, field, career, fileid }
        )
        .populate("fileid");

      res.json({ data: { user: result } });
    } catch (e) {
      console.error(e);
    }

    return;
  })
);

module.exports = router;
