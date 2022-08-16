const Review = require("../../models/Review");
const User = require("../../models/User");
const checkId = require("../../validations/id.validation");

module.exports = {
  getAllReviews: function (req, res, next) {
    User.findById(req.user.id)
      .populate("listReviews")
      .select("listReviews")
      .exec((err, reviews) => {
        if (err) return next(err);
        res.status(200).json(reviews);
      });
  },

  getReview: async function (req, res, next) {
    const isValidId = checkId(req.params.id);
    if (!isValidId)
      return res
        .status(400)
        .json({ message: "The review with given Id is not exist." });
    const review = await Review.findById(req.params.id);
    return res.status(200).json(review);
  },

  getReviewCreator: function (req, res, next) {},

  createReview: async function (req, res, next) {
    console.log(req.signedCookies);
    console.log(req.body);
  },
};
