const express = require("express");
const checkAuth = require("../../auth/checkAuth");
const checkReviewExist = require("../../middlewares/checkReviewExist");
const router = express.Router();
const { reviews } = require("../../controllers/home");
const { upload } = require("../../uploads/uploadReviewImages");

router.use(checkAuth.checkUser);

router.get("/api/:id", checkReviewExist, reviews.getReviewAPI);

router.get("/review-generator", reviews.getReviewGenerator);

router.get("/:id/review-generator", checkReviewExist, reviews.getReviewEditor);

router.get("/", reviews.getAllReviews);

router.get("/:id", checkReviewExist, reviews.getReview);

router.get("/status/in-progress", reviews.getAllInProgressReviews);

router.get("/status/hide", reviews.getAllHideReviews);

router.get("/status/publish", reviews.getAllPublishReviews);

router.get("/status/complete", reviews.getAllCompleteReviews);

router.post("/images/upload", upload.array("images"), reviews.uploadImages);

router.post("/", reviews.createReview);

router.put("/:id", checkReviewExist, reviews.updateReview);

router.put("/:id/status", checkReviewExist, reviews.updateReviewStatus);

router.put("/:id/images", checkReviewExist, reviews.updateReviewImages);

router.delete("/:id", checkReviewExist, reviews.deleteReview);

module.exports = router;
