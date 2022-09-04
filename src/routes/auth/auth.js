const express = require("express");
const { checkUser } = require("../../auth/checkAuth");
const router = express.Router();

const authController = require("../../controllers/auth/auth.controller");
const { upload } = require("../../uploads/uploadAvatarImage");

router.get("/register", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/register", authController.register);

router.get("/login", (req, res, next) => {
  res.render("auth/login");
});

router.post("/login", authController.login);

router.get("/logout", authController.logout);

router.post(
  "/avatar/upload",
  checkUser,
  upload.single("avatar"),
  authController.uploadAvatar
);

module.exports = router;
