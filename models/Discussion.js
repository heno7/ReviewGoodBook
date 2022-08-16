const mongoose = require("mongoose");
const { Schema } = mongoose;

const discussionSchema = new Schema({
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
  content: {
    type: String,
    required: true,
  },
  comments: [
    new Schema({
      createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
      content: {
        type: String,
        required: true,
      },
      stars: {
        type: Number,
        default: 0,
      },
    }),
  ],
});

module.exports = mongoose.model("Discussion", discussionSchema);
