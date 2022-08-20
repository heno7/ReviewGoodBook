const express = require("express");
const checkAuth = require("../../Auth/checkAuth");
const router = express.Router();
const { reviews } = require("../../controllers/home");
const { upload } = require("../../uploads/upload");

router.use(checkAuth.checkUser);

router.get("/", reviews.getAllReviews);

router.get("/status/in-progress", reviews.getAllInProgressReviews);

router.get("/status/hide", reviews.getAllHideReviews);

router.get("/status/publish", reviews.getAllPublishReviews);

router.get("/status/complete", reviews.getAllCompleteReviews);

router.get("/review-creator", reviews.getReviewCreator);

router.post("/images/upload", upload.array("images"), reviews.uploadImages);

router.get("/:id", reviews.getReview);

router.post("/", reviews.createReview);

router.put("/:id", reviews.updateReview);

module.exports = router;
