const UserRegister = require("../../models/UserRegister");
const User = require("../../models/User");
const loginValidation = require("../../validations/login.validation");
const registerValidation = require("../../validations/register.validation");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const { ObjectId } = require("mongoose").Types;
const sendEmail = require("../../email/sendEmail");

// const randomDefaultImages = [
//   "default-image-1.png",
//   "default-image-1.png",
//   "default-image-1.png",
//   "default-image-1.png",
//   "default-image-1.png",
//   "default-image-1.png",
// ];

module.exports = {
  register: async (req, res, next) => {
    try {
      const { error, value } = registerValidation(req.body);
      if (error) {
        return res.status(400).json({ message: error.message });
      }

      const sameEmailOrUsername = await User.findOne({
        $or: [{ email: value.email }, { username: value.username }],
      });

      if (sameEmailOrUsername) {
        if (sameEmailOrUsername.email == value.email)
          return res
            .status(400)
            .json({ message: "The given email has already used." });
        if (sameEmailOrUsername.username == value.username)
          return res
            .status(400)
            .json({ message: "The given username has alraedy used." });
      }

      const tempUser = new UserRegister({
        username: value.username,
        email: value.email,
        password: value.password,
      });

      await tempUser.save();

      await sendEmail(value.email, tempUser.id);
      // bcrypt.hash(value.password, 10, async function (err, hash) {
      //   if (err) throw err;
      //   const user = new User({
      //     username: value.username,
      //     email: value.email,
      //     password: hash,
      //     avatar: "/users/avatar/default-dragon.png",
      //   });
      //   await user.save();
      //   const token = JWT.sign(
      //     { id: user._id, userName: user.username, admin: user.admin },
      //     process.env.JWT_SECRECT
      //   );
      //   return res.status(200).json({ token });
      // });

      res.send("We have seen you an email to verify. Please check your email!");
    } catch (error) {
      next(error);
    }
  },

  verifyEmail: async (req, res, next) => {
    const verifyCode = req.params.verifyCode;
    if (!ObjectId.isValid(verifyCode))
      return res.status(400).json({ message: "Failed to verify email" });
    const tempUser = await UserRegister.findById(verifyCode);
    if (!tempUser) {
      return res.status(400).json({ message: "Failed to verify email" });
    }

    bcrypt.hash(tempUser.password, 10, async function (err, hash) {
      if (err) throw err;
      const user = new User({
        username: tempUser.username,
        email: tempUser.email,
        password: hash,
        avatar: "/users/avatar/default-dragon.png",
      });
      await user.save();
      await UserRegister.deleteOne({ _id: tempUser.id });
      const token = JWT.sign(
        { id: user._id, userName: user.username, admin: user.admin },
        process.env.JWT_SECRECT
      );
      return res
        .status(200)
        .cookie("access_token", token, {
          signed: true,
          expires: new Date(Date.now() + 8 * 3600000), // cookie will be removed after 8 hours
        })
        .redirect("/home");
    });
  },

  login: async (req, res, next) => {
    try {
      const { error, value } = loginValidation(req.body);
      if (error) {
        return res.status(400).json({ message: error.message });
      }
      const user = await User.findOne({ email: value.email });
      if (user) {
        const match = await bcrypt.compare(value.password, user.password);
        if (match) {
          const token = JWT.sign(
            { id: user._id, userName: user.username, admin: user.admin },
            process.env.JWT_SECRECT
          );
          // return res.status(200).json({ token });
          return res
            .status(200)
            .cookie("access_token", token, {
              signed: true,
              expires: new Date(Date.now() + 8 * 3600000), // cookie will be removed after 8 hours
            })
            .redirect("/home");
        }
      }
      res.status(400).json({ message: "Gửi Ngu." });
    } catch (error) {
      next(error);
    }
  },

  logout: function (req, res, next) {
    res
      .status(200)
      .clearCookie("access_token", {
        signed: true,
        expires: new Date(Date.now() + 8 * 3600000), // cookie will be removed after 8 hours
      })
      .redirect("/");
  },

  uploadAvatar: async function (req, res, next) {
    try {
      if (req.file) {
        const user = await User.findById(req.user.id);
        const url = "/users/avatar/" + req.file.filename;
        user.avatar = url;
        await user.save();

        return res.status(200).json({ url });
      }
    } catch (error) {
      next(error);
    }
  },
};
