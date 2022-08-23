const fs = require("fs/promises");
const { existsSync } = require("fs");
const path = require("path");
const showdown = require("showdown");
const Book = require("../../models/Book");
const Review = require("../../models/Review");
const User = require("../../models/User");
const checkId = require("../../validations/id.validation");

async function getReviewsByStatus(userId, statusInfo) {
  try {
    const reviews = await User.findById(userId)
      .populate({
        path: "listReviews",
        populate: { path: "bookInfo", select: "name" },
      })
      .select("listReviews")
      .exec();
    if (!statusInfo) return reviews.listReviews;
    filterReviews = reviews.listReviews.filter(function (review) {
      return review.status === statusInfo;
    });

    return filterReviews;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getReviewAPI: async function (req, res, next) {
    try {
      const isValidId = checkId(req.params.id);
      if (!isValidId)
        return res
          .status(400)
          .json({ message: "The review with given Id is not exist." });
      const review = await Review.findById(req.params.id)
        .populate({ path: "bookInfo" })
        .lean()
        .exec();

      review.content = await fs.readFile(review.pathToContent, {
        encoding: "utf8",
      });

      return res.status(200).json(review);
    } catch (error) {
      next(error);
    }
  },
  getAllReviews: async function (req, res, next) {
    try {
      const allReviews = await getReviewsByStatus(req.user.id);
      // res.status(200).json(reviews);
      res.render("home/review/show-reviews", {
        user: req.user,
        reviews: allReviews,
      });
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
      res.render("home/review/show-reviews", {
        user: req.user,
        reviews: inProgressReviews,
      });
    } catch (error) {
      next(error);
    }
  },

  getAllHideReviews: async function (req, res, next) {
    try {
      const hideReviews = await getReviewsByStatus(req.user.id, "Hide");
      res.render("home/review/show-reviews", {
        user: req.user,
        reviews: hideReviews,
      });
    } catch (error) {
      next(error);
    }
  },

  getAllPublishReviews: async function (req, res, next) {
    try {
      const publishReviews = await getReviewsByStatus(req.user.id, "Publish");

      res.render("home/review/show-reviews", {
        user: req.user,
        reviews: publishReviews,
      });
    } catch (error) {
      next(error);
    }
  },

  getAllCompleteReviews: async function (req, res, next) {
    try {
      const completeReviews = await getReviewsByStatus(req.user.id, "Complete");

      res.render("home/review/show-reviews", {
        user: req.user,
        reviews: completeReviews,
      });
    } catch (error) {
      next(error);
    }
  },

  getReview: async function (req, res, next) {
    try {
      const isValidId = checkId(req.params.id);
      if (!isValidId)
        return res
          .status(400)
          .json({ message: "The review with given Id is not exist." });
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

  getReviewCreator: function (req, res, next) {
    res.render("home/review/review-creator.ejs", { review: false });
  },

  getReviewEditor: async function (req, res, next) {
    try {
      const isValidId = checkId(req.params.id);
      if (!isValidId)
        return res
          .status(400)
          .json({ message: "The review with given Id is not exist." });
      const review = await Review.findById(req.params.id);
      if (!review)
        return res
          .status(400)
          .json({ message: "The review with given Id is not exist." });

      res.render("home/review/review-creator.ejs", { review: review });
    } catch (error) {
      next(error);
    }
  },

  uploadImages: function (req, res, next) {
    console.log(req.files);
    res.status(200).json(req.files);
  },

  createReview: async function (req, res, next) {
    try {
      const pathStore = path.join(process.cwd(), "reviews_store", req.user.id);
      const fileContent = req.user.id + Date.now() + ".md";
      const pathFile = path.join(pathStore, fileContent);
      // console.log(req.signedCookies);
      // console.log(req.body);
      let review;
      let book = await Book.findOne({
        name: req.body.book.name,
        author: req.body.book.author,
        genre: req.body.book.genre,
      });

      if (!book) {
        book = new Book({
          name: req.body.book.name,
          author: req.body.book.author,
          genre: req.body.book.genre,
        });
        await book.save();
      }

      review = new Review({
        bookInfo: book._id,
        author: req.user.id,
        title: req.body.title,
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

      book.listReviews.push(review._id);
      await book.save();

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
      let review = await Review.findById(req.params.id);
      let oldBook = await Book.findById(review.bookInfo);
      let newBook = await Book.findOne({
        name: req.body.book.name,
        author: req.body.book.author,
        genre: req.body.book.genre,
      });

      if (newBook && !newBook._id.equals(oldBook._id)) {
        review.bookInfo = newBook._id;
        oldBook.listReviews.splice(oldBook.listReviews.indexOf(review._id), 1);
        newBook.listReviews.push(review._id);
        await newBook.save();
      }

      oldBook.name = req.body.book.name;
      oldBook.author = req.body.book.author;
      oldBook.genre = req.body.book.genre;
      await oldBook.save();

      review.title = req.body.title;
      review.status = req.body.status;
      await fs.writeFile(review.pathToContent, req.body.content);

      await review.save();

      return res.status(200).json({ message: "Updated" });
    } catch (error) {
      next(error);
    }
  },

  updateReviewStatus: async function (req, res, next) {
    try {
      const review = await Review.findById(req.params.id);
      review.status = req.body.status;
      await review.save();
      return res.status(200).json({ message: "Status updated" });
    } catch (error) {
      next(error);
    }
  },

  deleteReview: async function (req, res, next) {
    const isValidId = checkId(req.params.id);
    if (!isValidId) {
      return res
        .status(400)
        .json({ message: "The review with given Id is not exist." });
    }

    const review = await Review.findById(req.params.id);
    if (!review) {
      return res
        .status(400)
        .json({ message: "The review with given Id is not exist." });
    }

    // await review.remove()
    const bookId = review.bookInfo;
    const book = await Book.findById(bookId);
    book.listReviews.splice(book.listReviews.indexOf(review._id), 1);

    const user = await User.findById(req.user.id);
    user.listReviews.splice(user.listReviews.indexOf(review._id), 1);

    await Review.deleteOne(review._id);
    await book.save();
    await user.save();

    // console.log(review, book);

    res.status(200).send();
  },
};
