const express = require("express");
const checkAuth = require("../../Auth/checkAuth");
const router = express.Router();
const { reviews } = require("../../controllers/home");

router.use(checkAuth.checkUser);

router.get("/", reviews.getAllReviews);

router.get("/:id", reviews.getReview);

router.get("/review-creator", reviews.getReviewCreator);

router.post("/", reviews.createReview);

module.exports = router;
