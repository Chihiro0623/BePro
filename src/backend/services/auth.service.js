const { models } = require("../database");
const { ApiError } = require("../utils");

const signup = async ({ userid, username, password }) => {
  const isExist = await models.users.findOne({ userid });

  if (isExist) {
    throw new ApiError(409, "User already exists");
  }

  const userDoc = await models.users.create({
    userid,
    username,
    password,
  });

  const result = await userDoc.save();
  return {
    message: result,
  };
};

const signin = async ({ userid, password }) => {
  const user = await models.users.findOne({ userid });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(401, "Invalid password");
  }

  return { message: "Signin successful" };
};

module.exports = {
  signup,
  signin,
};
