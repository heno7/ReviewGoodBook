const User = require("../models/User");
const JWT = require("jsonwebtoken");

module.exports = {
  getAllUsers: (req, res, next) => {
    res.send([]);
  },
};
