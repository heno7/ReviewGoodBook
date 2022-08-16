const mongoose = require("mongoose");
const { Schema } = mongoose;

const reviewSchema = new Schema({
  book: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Book",
  },
  author: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  pathToContent: {
    type: String,
    required: true,
  },
  isPublished: {
    type: Boolean,
    default: false,
  },
  stars: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Review", reviewSchema);
