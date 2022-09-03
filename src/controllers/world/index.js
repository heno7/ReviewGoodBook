const worldController = {
  getWorld: function (req, res, next) {
    res.render("world/world", {
      user: req.user,
    });
  },
};

const reviews = require("./reviews");

const discussions = require("./discussions");

module.exports = {
  worldController,
  reviews,
  discussions,
};
