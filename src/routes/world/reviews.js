const express = require("express");
const router = express.Router();
const { reviews } = require("../../controllers/world");

const { checkUser } = require("../../auth/checkAuth");

const checkReviewExist = require("../../middlewares/checkReviewExist");

router.use(checkUser);

router.get("/", reviews.getAllReviews);

router.get("/best-random", reviews.getRandomReviews);

router.get("/best-of-day", reviews.getBestReviewsOfDay);

router.get("/best-of-week", reviews.getBestReviewsOfWeek);

router.get("/best-of-month", reviews.getBestReviewsOfMonth);

router.get("/best-of-year", reviews.getBestReviewsOfYear);

router.get("/:id", checkReviewExist, reviews.getReview);

// router.get("/:id/checkstar", checkReviewExist, reviews.checkGiveStar);

router.patch("/:id/stars", checkReviewExist, reviews.giveStar);

module.exports = router;
