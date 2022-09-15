const mongoose = require("mongoose");
const index = require("../search/world_search");
const { Schema } = mongoose;
const wordIndex = require("../search/world_search");

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
    createdAt: {
      type: Date,
    },
    updatedAt: {
      type: Date,
    },
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

reviewSchema.post("save", async function (review) {
  if (review.status === "Publish") {
    // console.log("Here");
    const reviewInfo = await review.populate(["bookInfo", "author"]);
    const {
      id,
      bookInfo: { name, author, genre },
      title,
      stars,
    } = reviewInfo;
    const searchRecord = {
      objectID: id,
      url: `/world/reviews/${id}`,
      bookInfo: {
        name,
        author,
        genre,
      },
      title,
      stars,
      author: review.author.username,
    };
    await wordIndex.saveObject(searchRecord);
    return;
  }

  const existReview = await wordIndex.getObjects([review.id]);
  if (review.status === "Hide" && existReview.results[0]) {
    await wordIndex.deleteObject(review.id);
  }
});

module.exports = mongoose.model("Review", reviewSchema);
