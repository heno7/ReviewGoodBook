const express = require("express");
const checkAuth = require("../../Auth/checkAuth");
const router = express.Router();
const { reviews } = require("../../controllers/home");
const { upload } = require("../../uploads/upload");

router.use(checkAuth.checkUser);

router.get("/api/:id", reviews.getReviewAPI);

router.get("/review-creator", reviews.getReviewCreator);

router.get("/:id/review-creator", reviews.getReviewEditor);

router.get("/", reviews.getAllReviews);

router.get("/:id", reviews.getReview);

router.get("/status/in-progress", reviews.getAllInProgressReviews);

router.get("/status/hide", reviews.getAllHideReviews);

router.get("/status/publish", reviews.getAllPublishReviews);

router.get("/status/complete", reviews.getAllCompleteReviews);

router.post("/images/upload", upload.array("images"), reviews.uploadImages);

router.post("/", reviews.createReview);

router.put("/:id", reviews.updateReview);

router.put("/:id/status", reviews.updateReviewStatus);

router.delete("/:id", reviews.deleteReview);

module.exports = router;
