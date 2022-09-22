const JWT = require("jsonwebtoken");
const User = require("../models/User");

module.exports = {
  checkAdmin: function (req, res, next) {
    JWT.verify(
      req.body.token,
      process.env.JWT_SECRECT,
      function (err, decoded) {
        if (err) return next(err);
        if (decoded.admin) return next();
        return res.status(403).json({ message: "you do not have permission" });
      }
    );
  },

  checkUser: function (req, res, next) {
    const token = req.signedCookies;

    if (!token) {
      return res.status(401).json({ message: "you do not have permission" });
    }

    JWT.verify(
      token.access_token,
      process.env.JWT_SECRECT,
      function (err, decoded) {
        if (err) {
          // return res
          //   .status(403)
          //   .json({ message: "you do not have permission" });
          if (req.originalUrl === "/" || req.originalUrl.startsWith("/world")) {
            req.user = null;
            return next();
          }

          if (req.originalUrl === "/search-API-key") {
            return next();
          }

          return res.redirect("/users/auth/login");
        }

        if (decoded) {
          User.findById(decoded.id, (error, user) => {
            if (user) {
              req.user = user;
              return next();
            }
          });
        }
      }
    );
  },
};
