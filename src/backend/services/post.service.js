const filterPost = (title, writer, posttype) => {
  let options = {};

  if (!title && !writer && !posttype) {
    options = { deleted: false };
  }

  if (title || writer || posttype) {
    options = { $or: [], deleted: false };
  }

  if (writer && posttype) {
    options = { $and: [{ writer }, { posttype }], deleted: false };
  } else {
    if (title) {
      options.$or.push({ title: { $regex: title } });
    }

    if (writer) {
      options.$or.push({ writer });
    }

    if (posttype) {
      options.$or.push({ posttype });
    }
  }

  return options;
};

module.exports = {
  filterPost,
};
