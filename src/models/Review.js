const mongoose = require("mongoose");
const { Schema } = mongoose;

const { reviewsIndex } = require("../search/search");

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
  const reviewInfo = await review.populate(["bookInfo", "author"]);
  const {
    id,
    bookInfo: { name, author, genre },
    title,
    stars,
  } = reviewInfo;

  const existReview = await reviewsIndex.getObjects([review.id]);

  if (existReview.results[0] && review.status === "Publish") {
    await reviewsIndex.partialUpdateObject({
      url: `/world/reviews/${id}`,
      visible_by: [reviewInfo.author.id, "everybody"],
      objectID: review.id,
    });
    return;
  }

  if (existReview.results[0] && review.status === "Hide") {
    // await reviewsIndex.deleteObject(review.id);
    await reviewsIndex.partialUpdateObject({
      url: `/home/reviews/${id}`,
      visible_by: [reviewInfo.author.id],
      objectID: review.id,
    });
    return;
  }

  const searchRecord = {
    objectID: id,
    visible_by: [reviewInfo.author.id],
    url: `/home/reviews/${id}`,
    bookInfo: {
      name,
      author,
      genre,
    },
    title,
    stars,
    author: review.author.username,
  };
  await reviewsIndex.saveObject(searchRecord);
  return;
});

module.exports = mongoose.model("Review", reviewSchema);
