const mongoose = require("mongoose");

const { Schema } = mongoose;

const Review = require("../models/Review");
const Discussion = require("../models/Discussion");
const Book = require("../models/Book");

const userSchema = new Schema({
  username: {
    type: String,
    minLength: 3,
    maxLength: 30,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    minLength: 8,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  avatar: {
    type: String,
  },
  admin: {
    type: Boolean,
    default: false,
  },
  listReviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  listDiscussions: [
    {
      type: Schema.Types.ObjectId,
      ref: "Discussion",
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
