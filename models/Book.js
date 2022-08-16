const mongoose = require("mongoose");
const { Schema } = mongoose;

const bookSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
  },
  author: {
    type: String,
    required: true,
  },
  published_at: {
    type: Date,
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

module.exports = mongoose.model("Book", bookSchema);
