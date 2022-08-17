const express = require("express");
const checkAuth = require("../../Auth/checkAuth");
const router = express.Router();
const { reviews } = require("../../controllers/home");
const { upload } = require("../../uploads/upload");

router.use(checkAuth.checkUser);

router.get("/", reviews.getAllReviews);

router.get("/review-creator", reviews.getReviewCreator);

router.post("/images/upload", upload.array("images"), reviews.uploadImages);

router.get("/:id", reviews.getReview);

router.post("/", reviews.createReview);

module.exports = router;
