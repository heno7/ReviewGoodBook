module.exports = {
  getWorld: function (req, res, next) {
    res.render("world/world", {
      userName: req.user.userName,
    });
  },
};
