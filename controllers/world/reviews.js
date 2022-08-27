const Review = require("../../models/Review");
const User = require("../../models/User");
const checkId = require("../../validations/id.validation");
const moment = require("moment");
const fs = require("fs/promises");
const showdown = require("showdown");

async function getBestReviewIn(time) {
  try {
    const start = moment().startOf(time).toDate();
    const end = moment().endOf(time).toDate();

    const reviews = await Review.find({
      status: "Publish",
      createdAt: {
        $gte: start,
        $lte: end,
      },
    })
      .populate({ path: "bookInfo" })
      .populate({ path: "author", select: "username" })
      .sort({
        stars: -1,
      })
      .limit(7)
      .exec();

    return reviews;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getAllReviews: async function (req, res, next) {
    try {
      const publishReviews = await Review.find({ status: "Publish" })
        .populate({
          path: "bookInfo",
        })
        .exec();
      res.status(200).json(publishReviews);
    } catch (error) {
      next(error);
    }
  },

  getBestReviewsOfDay: async function (req, res, next) {
    try {
      const bestDayReviews = await getBestReviewIn("day");
      res.status(200).json(bestDayReviews);

      // res.render("world/review/show-reviews", {
      //   userName: req.user.userName,
      //   reviews: bestDayReviews,
      // });
    } catch (error) {
      next(error);
    }
  },

  getBestReviewsOfWeek: async function (req, res, next) {
    try {
      const bestWeekReviews = await getBestReviewIn("week");
      res.status(200).json(bestWeekReviews);

      // res.render("world/review/show-reviews", {
      //   userName: req.user.userName,
      //   reviews: bestWeekReviews,
      // });
    } catch (error) {
      next(error);
    }
  },

  getBestReviewsOfMonth: async function (req, res, next) {
    try {
      const bestMonthReviews = await getBestReviewIn("month");
      res.status(200).json(bestMonthReviews);

      // res.render("world/review/show-reviews", {
      //   userName: req.user.userName,
      //   reviews: bestMonthReviews,
      // });
    } catch (error) {
      next(error);
    }
  },

  getBestReviewsOfYear: async function (req, res, next) {
    try {
      const bestYearReviews = await getBestReviewIn("year");
      res.status(200).json(bestYearReviews);

      // res.render("world/review/show-reviews", {
      //   userName: req.user.userName,
      //   reviews: bestYearReviews,
      // });
    } catch (error) {
      next(error);
    }
  },

  getReview: async function (req, res, next) {
    const isValidId = checkId(req.params.id);
    if (!isValidId)
      return res
        .status(400)
        .json({ message: "The review with given Id is not exist." });
    const review = await Review.findById(req.params.id)
      .populate({ path: "bookInfo" })
      .populate({ path: "author", select: "username" })
      .exec();

    const converter = new showdown.Converter();
    converter.setFlavor("github");
    review.content = converter.makeHtml(
      await fs.readFile(review.pathToContent, {
        encoding: "utf8",
      })
    );

    // res.status(200).json(review);
    res.render("world/review/show-a-review", {
      userName: req.user.userName,
      review: review,
    });
  },

  giveStar: async function (req, res, next) {},
};
