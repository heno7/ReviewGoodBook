const fs = require("fs/promises");
const { existsSync } = require("fs");
const path = require("path");
const showdown = require("showdown");
const Book = require("../../models/Book");
const Review = require("../../models/Review");
const User = require("../../models/User");
const checkCompleteReview = require("../../validations/completeReview.validation");
const { default: mongoose } = require("mongoose");
const createError = require("http-errors");

async function getReviewsByStatus(userId, statusInfo) {
  try {
    const reviews = await User.findById(userId)
      .populate({
        path: "listReviews",
        populate: { path: "bookInfo" },
      })
      .select("listReviews")
      .exec();
    if (!statusInfo) return reviews.listReviews;
    filterReviews = reviews.listReviews.filter(function (review) {
      return review.status === statusInfo;
    });

    return filterReviews;
  } catch (error) {
    throw createError(500, error);
  }
}

async function updateProgress(reviewId, data) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    let review = await Review.findById(reviewId).session(session);
    let book = await Book.findById(review.bookInfo).session(session);

    book.name = data.book.name;
    book.author = data.book.author;
    book.genre = data.book.genre;
    await book.save();

    review.title = data.title;
    review.status = data.status;
    review.images = data.images;
    await fs.writeFile(review.pathToContent, data.content);

    await review.save();

    await session.commitTransaction();
    session.endSession();
    return "Done";
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw createError(500, error);
  }
}

async function completeUpdate(reviewId, data) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { error } = checkCompleteReview(data);
    if (error) {
      throw error;
    }
    let review = await Review.findById(reviewId).session(session);

    review.title = data.title;
    review.status = data.status;
    review.images = data.images;
    await fs.writeFile(review.pathToContent, data.content);

    let currentBook = await Book.findById(review.bookInfo).session(session);
    let existPreviousBook = await Book.findOne(data.book).session(session);
    if (existPreviousBook) {
      if (currentBook._id.equals(existPreviousBook._id)) {
        currentBook.listReviews.push(review._id);
        await currentBook.save();
        await review.save();
        return "Done";
      }

      review.bookInfo = existPreviousBook._id;
      existPreviousBook.listReviews.push(review._id);
      await Book.deleteOne({ _id: currentBook._id }).session(session);
      await existPreviousBook.save();

      await review.save();

      await session.commitTransaction();
      session.endSession();
      return "Done";
    }

    console.log(data);
    console.log(currentBook);

    currentBook.name = data.book.name;
    currentBook.author = data.book.author;
    currentBook.genre = data.book.genre;
    currentBook.listReviews.push(review._id);
    await currentBook.save();

    await review.save();
    await session.commitTransaction();
    session.endSession();
    return "Done";
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw createError(500, error);
  }
}

module.exports = {
  getReviewAPI: async function (req, res, next) {
    try {
      const review = await Review.findById(req.params.id)
        .populate({ path: "bookInfo" })
        .lean()
        .exec();

      review.content = await fs.readFile(review.pathToContent, {
        encoding: "utf8",
      });

      // throw Error("Hello Homie");

      return res.status(200).json(review);
    } catch (error) {
      next(createError(500, error, { message: "Change Hello world" }));
    }
  },
  getAllReviews: async function (req, res, next) {
    try {
      const allReviews = await getReviewsByStatus(req.user.id);

      res.status(200).json(allReviews);
    } catch (error) {
      next(error);
    }
  },

  getAllInProgressReviews: async function (req, res, next) {
    try {
      const inProgressReviews = await getReviewsByStatus(
        req.user.id,
        "In Progress"
      );

      res.status(200).json(inProgressReviews);
    } catch (error) {
      next(error);
    }
  },

  getAllHideReviews: async function (req, res, next) {
    try {
      const hideReviews = await getReviewsByStatus(req.user.id, "Hide");

      res.status(200).json(hideReviews);
    } catch (error) {
      next(error);
    }
  },

  getAllPublishReviews: async function (req, res, next) {
    try {
      const publishReviews = await getReviewsByStatus(req.user.id, "Publish");

      res.status(200).json(publishReviews);
    } catch (error) {
      next(error);
    }
  },

  getAllCompleteReviews: async function (req, res, next) {
    try {
      const completeReviews = await getReviewsByStatus(req.user.id, "Complete");

      res.status(200).json(completeReviews);
    } catch (error) {
      next(error);
    }
  },

  getReview: async function (req, res, next) {
    try {
      const review = await Review.findById(req.params.id)
        .populate({ path: "bookInfo" })
        .exec();

      // return res.status(200).json(review);

      const converter = new showdown.Converter();
      review.content = converter.makeHtml(
        await fs.readFile(review.pathToContent, {
          encoding: "utf8",
        })
      );
      return res.render("home/review/show-a-review", {
        user: req.user,
        review: review,
      });
    } catch (error) {
      next(error);
    }
  },

  getReviewGenerator: function (req, res, next) {
    res.render("home/review/review-creator.ejs", {
      review: false,
      userName: req.user.userName,
    });
  },

  getReviewEditor: async function (req, res, next) {
    try {
      const review = await Review.findById(req.params.id);

      res.render("home/review/review-creator.ejs", {
        review: review,
        userName: req.user.userName,
      });
    } catch (error) {
      next(error);
    }
  },

  uploadImages: function (req, res, next) {
    // console.log(req.files);
    res.status(200).json(req.files);
  },

  createReview: async function (req, res, next) {
    // const session = await mongoose.startSession();
    // session.startTransaction();
    try {
      const pathStore = path.join(process.cwd(), "reviews_store", req.user.id);
      const fileContent = req.user.id + Date.now() + ".md";
      const pathFile = path.join(pathStore, fileContent);
      // console.log(req.signedCookies);
      // console.log(req.body);
      let review;

      const book = new Book({
        name: req.body.book.name,
        author: req.body.book.author,
        genre: req.body.book.genre,
      });
      await book.save();

      review = new Review({
        bookInfo: book._id,
        author: req.user.id,
        title: req.body.title,
        images: req.body.images,
        status: req.body.status,
      });

      if (!existsSync(pathStore)) {
        const error = await fs.mkdir(pathStore);
        if (!error) {
          await fs.writeFile(pathFile, req.body.content);
          review.pathToContent = pathFile;
        }
      }

      await fs.writeFile(pathFile, req.body.content);
      review.pathToContent = pathFile;

      // await book.save();
      await review.save();

      // book.listReviews.push(review._id);
      // await book.save();

      const user = await User.findById(req.user.id);
      user.listReviews.push(review._id);
      await user.save();

      return res.status(201).json({ review_id: review._id });
    } catch (error) {
      next(error);
    }
  },

  updateReview: async function (req, res, next) {
    try {
      if (req.body.status === "Complete") {
        const done = await completeUpdate(req.reviewId, req.body);

        if (done) {
          return res.status(200).json({ message: "Completed" });
        }
      }
      if (req.body.status === "In Progress") {
        const done = await updateProgress(req.reviewId, req.body);
        if (done) {
          return res.status(200).json({ message: "Updated" });
        }
      }
    } catch (error) {
      next(error);
    }
  },

  updateReviewStatus: async function (req, res, next) {
    try {
      const defaultPublishTime = new Date("2022-08-31T17:00:00.000Z");

      const review = await Review.findById(req.params.id);

      // console.log(defaultPublishTime.toString());
      // console.log(review.publishAt.toString());
      if (
        req.body.status === "Publish" &&
        review.publishedAt.toString() === defaultPublishTime.toString()
      ) {
        review.publishedAt = review.updatedAt;
      }
      review.status = req.body.status;
      await review.save();
      return res.status(200).json({ message: "Status updated" });
    } catch (error) {
      next(error);
    }
  },

  updateReviewImages: async function (req, res, next) {
    try {
      const review = await Review.findById(req.params.id);
      // console.log(req.body.images);
      review.images = JSON.stringify(req.body.images);
      await review.save();
      return res.status(200).json({ message: "Images updated" });
    } catch (error) {
      next(error);
    }
  },

  deleteReview: async function (req, res, next) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const review = await Review.findById(req.params.id).session(session);
      let pathToContent = review.pathToContent;
      let images = JSON.parse(review.images);

      // await review.remove()
      const bookId = review.bookInfo;
      const book = await Book.findById(bookId).session(session);
      if (book.listReviews.length > 1) {
        book.listReviews.splice(book.listReviews.indexOf(review._id), 1);
        await book.save();
      } else {
        await Book.deleteOne({ _id: book._id }).session(session);
      }

      const user = await User.findById(req.user.id).session(session);
      user.listReviews.splice(user.listReviews.indexOf(review._id), 1);
      await user.save();

      await Review.deleteOne({ _id: review._id }).session(session);

      await fs.unlink(pathToContent);

      await Promise.all(
        images.map((image) => {
          return fs.unlink(
            path.join(
              process.cwd(),
              "images_store",
              image.fileURL.split("/")[2]
            )
          );
        })
      );

      // console.log(review, book);
      await session.commitTransaction();
      session.endSession();
      res.status(200).json({ message: "Deleted" });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      next(error);
    }
  },
};
