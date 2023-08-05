const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

const user = new Schema({
  userid: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
  }, // real name
  password: {
    type: String,
    required: true,
  },
  contact: {
    type: String,
  },
  email: {
    type: String,
  },
  position: {
    type: String,
  },
  career: {
    type: String,
  },
  field: {
    type: String,
  },
  participating: {
    type: Array,
    default: [],
    ref: "posts",
  },
  fileid: {
    type: Schema.Types.ObjectId,
    ref: "files"
  },
});

user.pre("save", function (next) {
  var newval = this;

  if (!newval.isModified("password")) return next();

  bcrypt.genSalt(10, function (err, salt) {
    if (err) return next(err);

    bcrypt.hash(newval.password, salt, function (err, hash) {
      if (err) return next(err);

      newval.password = hash;
      next();
    });
  });
});

user.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

user.methods.removeParticipant = function (postId) {
  this.participating.pull(postId);
  return this.save();
}

module.exports = model("users", user);
