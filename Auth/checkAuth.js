const JWT = require("jsonwebtoken");

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
    // const token = req.cookies;

    // console.log(token);
    console.log(req.originalUrl);
    if (!token)
      return res.status(403).json({ message: "you do not have permission" });
    JWT.verify(
      token.access_token,
      process.env.JWT_SECRECT,
      function (err, decoded) {
        if (err) {
          // return res
          //   .status(403)
          //   .json({ message: "you do not have permission" });
          res.redirect("/users/auth/login");
        }

        if (decoded) {
          req.user = decoded;
          return next();
        }
      }
    );
  },
};
