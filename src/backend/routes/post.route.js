const express = require("express");
const { models } = require("../database");
const { catchAsync, ApiError } = require("../utils");
const { isAuthenticated } = require("../middleware");
const { filterPost } = require("../services/post.service");

const router = express.Router();

router.get(
  "/",
  catchAsync(async (req, res) => {
    const { title, writer, posttype } = req.query;
    const options = filterPost(title, writer, posttype);

    const posts = await models.posts
      .find(options, {
        _id: true,
        title: true,
        likes: true,
        writer: true,
        posttype: true,
        createdAt: true,
        comments: true,
        projectpage: true,
      })
      .populate(["comments", "projectpage"]);

    const result = posts.map((post) => {
      return {
        ...post.toObject(),
        postid: post._id,
        commentscount: post.comments.length,
      };
    });

    res.status(200).json(result);
  })
);

router.post(
  "/",
  isAuthenticated,
  catchAsync(async (req, res) => {
    const { title, description, posttype, projectpage, fileid } = req.body;
    let projectDocId = null;
    const writer = req.session.userid;

    const doc = {
      title,
      description,
      posttype,
      writer,
      fileid,
    };

    if (projectpage) {
      projectDocId = await models.posts.findOne({ _id: projectpage });
      doc["projectpage"] = projectDocId._id;
    }

    const postDoc = await models.posts.create(doc);
    const result = await postDoc.save();

    res.status(200).json({
      postid: result._id,
    });
  })
);

router.get(
  "/:postid",
  catchAsync(async (req, res) => {
    const result = await models.posts
      .findOne({
        _id: req.params.postid,
        deleted: false,
      })
      .populate(["comments", "participants", "fileid", "projectpage"]);

    if (!result) {
      throw new ApiError(404, "Post Not Found");
    }

    res.status(200).json(result);
  })
);

router.put(
  "/:postid",
  catchAsync(async (req, res) => {
    const result = await models.posts
      .findOne({ _id: req.params.postid })
      .populate(["comments", "participants", "fileid", "projectpage"]);

    if (result == undefined || result.deleted) {
      throw new ApiError(404, "Post Not Found");
    } else if (
      req.body.deleted != undefined ||
      req.body.postid != undefined ||
      req.body.comments != undefined ||
      req.body.participants != undefined
    ) {
      throw new ApiError(400, "Bad Request");
    } else {
      req.body.createdAt = Date.now();
      await models.posts.updateOne({ _id: req.params.postid }, req.body);
      const afterResult = await models.posts.findOne({
        _id: req.params.postid,
      });

      let newCommentArray = new Array();
      for (const commentid of afterResult.comments) {
        const comment = await models.comments.findOne({ _id: commentid });
        if (comment === null || comment.deleted) continue;
        let toPush = {
          commentid: comment._id,
          title: comment.title,
          description: comment.description,
          createdAt: comment.createdAt,
          likes: comment.likes,
          writer: comment.writer,
        };
        newCommentArray.push(toPush);
      }

      let toRes = {
        postid: afterResult._id,
        title: afterResult.title,
        projectpage: afterResult.projectpage,
        createdAt: afterResult.createdAt,
        likes: afterResult.likes,
        writer: afterResult.writer,
        posttype: afterResult.posttype,
        description: afterResult.description,
        participants: afterResult.participants,
        fileid: afterResult.fileid,
        comments: newCommentArray,
      };
      if (result.posttype == 0) {
        toRes.projectpage = result.projectpage;
      }
      return res.status(200).json(toRes);
    }
  })
);

router.delete(
  "/:postid",
  catchAsync(async (req, res) => {
    try {
      const result = await models.posts.findOne({ _id: req.params.postid });
      if (result == undefined || result.deleted) {
        return res.status(404).send("Post Not Found");
      }

      await models.posts.updateOne(
        { _id: req.params.postid },
        { deleted: true }
      );

      result.participants.map(async (participant) => {
        const user = await models.users.findOne({ userid: participant });
        await user.removeParticipant(result._id);
      });

      return res.status(200).send("Delete OK");
    } catch {
      return res.status(500).send("DB Error");
    }
  })
);

router.put(
  "/:postid/like",
  catchAsync(async (req, res) => {
    const result = await models.posts.findOne({ _id: req.params.postid });
    if (result == undefined || result.deleted) {
      throw new ApiError(404, "Post Not Found");
    }

    await models.posts.updateOne(
      { _id: req.params.postid },
      { likes: result.likes + 1 }
    );
    const afterResult = await models.posts.findOne({
      _id: req.params.postid,
    });
    let toRes = {
      likes: afterResult.likes,
    };

    res.status(200).send(toRes);
  })
);

router.post(
  "/:postid/comments",
  isAuthenticated,
  catchAsync(async (req, res) => {
    const result = await models.posts.findOne({ _id: req.params.postid });
    if (result == undefined || result.deleted) {
      throw new ApiError(404, "Post Not Found");
    }

    req.body.writer = req.session.userid;
    const toSave = await models.comments.create(req.body);
    const saved = await toSave.save();

    result.comments.push(saved._id);
    await models.posts.updateOne(
      { _id: req.params.postid },
      { comments: result.comments }
    );

    const afterResult = await models.posts.findOne({
      _id: req.params.postid,
    });

    let toRes = new Array();
    for (const commentid of afterResult.comments) {
      const comment = await models.comments.findOne({ _id: commentid });
      if (comment === null || comment.deleted) continue;
      let toPush = {
        commentid: comment._id,
        title: comment.title,
        description: comment.description,
        createdAt: comment.createdAt,
        likes: comment.likes,
        writer: comment.writer,
      };
      toRes.push(toPush);
    }
    res.status(200).send(toRes);
  })
);

router.put(
  "/:postid/participate",
  isAuthenticated,
  catchAsync(async (req, res) => {
    const result = await models.posts.findOne({ _id: req.params.postid });
    if (result == undefined || result.deleted) {
      throw new ApiError(404, "Post Not Found");
    }

    result.participants.push(req.session.userid);
    await models.posts.updateOne(
      { _id: req.params.postid },
      { participants: result.participants }
    );

    const afterResult = await models.posts.findOne({
      _id: req.params.postid,
    });

    const foundUser = await models.users.findOne(
      {
        userid: req.session.userid,
      },
      { _id: false }
    );

    foundUser.participating.push(req.params.postid);

    await models.users.updateOne(
      { userid: req.session.userid },
      {
        participating: foundUser.participating,
      }
    );

    let toRes = new Array();
    for (const participant of afterResult.participants) {
      let toPush = {
        userid: participant,
      };
      toRes.push(toPush);
    }
    return res.status(200).send(toRes);
  })
);

module.exports = router;
