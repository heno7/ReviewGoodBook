const express = require("express");
const router = express.Router();
const { reviews } = require("../../controllers/world");

const { checkUser } = require("../../Auth/checkAuth");

router.use(checkUser);

router.get("/", reviews.getAllReviews);

router.get("/best-of-day", reviews.getBestReviewsOfDay);

router.get("/best-of-week", reviews.getBestReviewsOfWeek);

router.get("/best-of-month", reviews.getBestReviewsOfMonth);

router.get("/best-of-year", reviews.getBestReviewsOfYear);

router.get("/:id", reviews.getReview);

router.patch("/:id/stars", reviews.giveStar);

module.exports = router;
