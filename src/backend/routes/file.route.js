const express = require("express");
const { models } = require("../database");
const { catchAsync, ApiError } = require("../utils");
const { isAuthenticated } = require("../middleware");

const multer = require("multer");

const router = express.Router();

const DIR = "./uploaded/";
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: async (req, file, cb) => {
    const toCreate = {
      originalname: file.originalname,
    };

    const toSave = await models.files.create(toCreate);
    const saved = await toSave.save();
    req.saved = saved;

    cb(null, String(saved._id) + "!" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
});

router.post(
  "/",
  upload.single("file"),
  catchAsync(async (req, res) => {
    const toRes = {
      fileid: req.saved._id,
      originalname: req.saved.originalname,
    };
    res.status(200).send(toRes);
  })
);

router.get(
  "/:fileid",
  isAuthenticated,
  catchAsync(async (req, res) => {
    const result = await models.files.findOne({ _id: req.params.fileid });
    if (result == undefined || result.deleted) {
      throw new ApiError(404, "File Not Found");
    }

    const url = "/uploaded/" + req.params.fileid + "!" + result.originalname;
    req.url = url;
    req.app.handle(req, res);
  })
);

// get file's original name from database by fileid
router.get(
  "/:fileid/fullpath",
  isAuthenticated,
  catchAsync(async (req, res) => {
    const result = await models.files.findOne({ _id: req.params.fileid });

    if (result == undefined || result.deleted) {
      throw new ApiError(404, "File Not Found");
    }

    return res
      .status(200)
      .send({ originalname: result.originalname, fileid: result._id });
  })
);

module.exports = router;
