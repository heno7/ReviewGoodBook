const express = require("express");
const router = express.Router();
const { reviews } = require("../../controllers/world");

router.get("/", reviews.getAllReviews);

router.get("/:id", reviews.getReview);

router.patch(":/id/stars", reviews.giveStar);

module.exports = router;
