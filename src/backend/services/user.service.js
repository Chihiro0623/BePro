const { ApiError } = require("../utils");
const { models } = require("../database");

const getUserInfoById = async (userId) => {
  if (!userId) throw new ApiError(400, "User ID is required");
  if (typeof userId !== "string")
    throw new ApiError(400, "User ID must be a string");

  return await models.users
    .findOne({ userid: userId })
    .populate("participating");
};

module.exports = {
  getUserInfoById,
};
