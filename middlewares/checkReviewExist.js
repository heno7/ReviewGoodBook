const checkId = require("../validations/id.validation");
const Review = require("../models/Review");

module.exports = async function (req, res, next) {
  try {
    const isValidId = checkId(req.params.id);
    const review = await Review.findById(req.params.id);

    if (!isValidId || !review) {
      return res
        .status(400)
        .json({ message: "The review with given Id is not exist." });
    }
    req.reviewId = review._id;
    next();
  } catch (error) {
    next(error);
  }
};
