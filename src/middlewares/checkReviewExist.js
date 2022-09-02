const checkId = require("../validations/id.validation");
const Review = require("../models/Review");
const createError = require("http-errors");

module.exports = async function (req, res, next) {
  try {
    const isValidId = checkId(req.params.id);
    if (!isValidId) {
      return res.status(400).json({ message: "The given Id is invalid." });
    }
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res
        .status(404)
        .json({ message: "The review with given Id is not exist" });
    }

    req.reviewId = review._id;
    next();
  } catch (error) {
    next(createError(500, error));
  }
};
