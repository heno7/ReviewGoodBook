const homeController = {
  getHome: function (req, res, next) {
    res.render("home/home.ejs", {
      user: req.user,
    });
  },
};

const reviews = require("./reviews");
const discussions = require("./discussions");

module.exports = {
  homeController,
  reviews,
  discussions,
};
