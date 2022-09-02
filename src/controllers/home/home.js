const path = require("path");
module.exports = {
  getHome: function (req, res, next) {
    res.render("home/home.ejs", {
      userName: req.user.userName,
    });
  },
};
