const Review = require("../../models/Review");

const moment = require("moment");
const fs = require("fs/promises");
const showdown = require("showdown");

async function getBestReviewIn(time) {
  try {
    let start = moment().startOf(time).toDate();
    let end = moment().endOf(time).toDate();

    if (time === "random") {
      const initDate = [2022, 8, 1];
      const dayCount = moment().diff(moment(initDate), "days", true);
      const startDay = Math.random() * dayCount;
      const endDay = startDay + Math.random() * (dayCount - startDay);

      start = moment(initDate).add(startDay, "days");
      end = moment(initDate).add(endDay, "days");
    }

    const reviews = await Review.find({
      status: "Publish",
      publishedAt: {
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

// async function getReviewsSearchBy(searchInput) {
//   try {
//     if (typeof sea) {
//     }
//   } catch (error) {}
// }

async function checkGiveStar(reviewId, userId) {
  try {
    const review = await Review.findById(reviewId);
    if (review.author.toString() === userId) {
      return {
        status: 400,
        message: "You can't give star to your review!",
      };
    }
    if (review.likedBy.includes(userId)) {
      return {
        status: 400,
        message: "You can only give star once!",
      };
    }
    return {
      status: 200,
      message: "Ok",
    };
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getRandomReviews: async function (req, res, next) {
    try {
      const bestRandomReviews = await getBestReviewIn("random");
      res.status(200).json(bestRandomReviews);
    } catch (error) {
      next(error);
    }
  },
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
    } catch (error) {
      next(error);
    }
  },

  getBestReviewsOfWeek: async function (req, res, next) {
    try {
      const bestWeekReviews = await getBestReviewIn("week");
      res.status(200).json(bestWeekReviews);
    } catch (error) {
      next(error);
    }
  },

  getBestReviewsOfMonth: async function (req, res, next) {
    try {
      const bestMonthReviews = await getBestReviewIn("month");
      res.status(200).json(bestMonthReviews);
    } catch (error) {
      next(error);
    }
  },

  getBestReviewsOfYear: async function (req, res, next) {
    try {
      const bestYearReviews = await getBestReviewIn("year");
      res.status(200).json(bestYearReviews);
    } catch (error) {
      next(error);
    }
  },

  getReview: async function (req, res, next) {
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
      user: req.user,
      review: review,
    });
  },

  giveStar: async function (req, res, next) {
    try {
      const response = await checkGiveStar(req.reviewId, req.user.id);

      if (response.status === 400) {
        return res.status(response.status).json(response);
      }

      const review = await Review.findById(req.params.id);
      review.likedBy.push(req.user.id);
      review.stars += 1;
      await review.save();
      res
        .status(200)
        .json({ status: 200, message: "Thank you for give star!" });
    } catch (error) {
      next(error);
    }
  },
};
