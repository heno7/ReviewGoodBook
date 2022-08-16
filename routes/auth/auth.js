const express = require("express");
const router = express.Router();

const authController = require("../../controllers/auth/auth.controller");

router.get("/register", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/register", authController.register);

router.get("/login", (req, res, next) => {
  res.render("auth/login");
});

router.post("/login", authController.login);

router.get("/logout", authController.logout);

module.exports = router;
