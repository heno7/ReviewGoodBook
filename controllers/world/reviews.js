const Review = require("../../models/Review");
const User = require("../../models/User");
const checkId = require("../../validations/id.validation");

module.exports = {
  getAllReviews: function (req, res, next) {},

  getReview: async function (req, res, next) {
    const isValidId = checkId(req.params.id);
    if (!isValidId)
      return res
        .status(400)
        .json({ message: "The review with given Id is not exist." });
    const review = await Review.findById(req.params.id);
    res.status(200).json(review);
  },

  giveStar: async function (req, res, next) {},
};
