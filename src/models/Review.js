const mongoose = require("mongoose");
const { Schema } = mongoose;

const reviewSchema = new Schema(
  {
    bookInfo: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Book",
    },
    author: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
    },
    // createdAt: {
    //   type: Date,
    //   default: Date.now,
    // },
    // updatedAt: {
    //   type: Date,
    //   default: Date.now,
    // },
    publishedAt: {
      type: Date,
      default: new Date("2022-08-31T17:00:00.000Z"),
    },
    pathToContent: {
      type: String,
      required: true,
    },
    images: {
      type: String,
    },
    status: {
      type: String,
      required: true,
      enum: ["In Progress", "Publish", "Hide", "Complete"],
    },
    stars: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);
