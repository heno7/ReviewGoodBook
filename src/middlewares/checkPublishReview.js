const Review = require("../models/Review");
const createError = require("http-errors");

module.exports = async function (req, res, next) {
  try {
    const review = await Review.findById(req.params.id);

    if (review.status === "Publish") {
      return res
        .status(400)
        .json({ status: 400, message: "You can't delete a publish review!" });
    }
    next();
  } catch (error) {
    next(createError(500, error));
  }
};
