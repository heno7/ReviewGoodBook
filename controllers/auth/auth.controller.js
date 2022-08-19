const User = require("../../models/User");
const loginValidation = require("../../validations/login.validation");
const registerValidation = require("../../validations/register.validation");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");

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

      bcrypt.hash(value.password, 10, async function (err, hash) {
        if (err) throw err;
        const user = new User({
          username: value.username,
          email: value.email,
          password: hash,
        });
        await user.save();
        const token = JWT.sign(
          { id: user._id, admin: user.admin },
          process.env.JWT_SECRECT
        );
        return res.status(200).json({ token });
      });
    } catch (error) {
      next(error);
    }
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
};
