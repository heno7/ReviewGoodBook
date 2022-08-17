const fs = require("fs");
const path = require("path");
const Book = require("../../models/Book");
const Review = require("../../models/Review");
const User = require("../../models/User");
const checkId = require("../../validations/id.validation");

module.exports = {
  getAllReviews: function (req, res, next) {
    User.findById(req.user.id)
      .populate("listReviews")
      .select("listReviews")
      .exec((err, reviews) => {
        if (err) return next(err);
        res.status(200).json(reviews);
      });
  },

  getReview: async function (req, res, next) {
    const isValidId = checkId(req.params.id);
    if (!isValidId)
      return res
        .status(400)
        .json({ message: "The review with given Id is not exist." });
    const review = await Review.findById(req.params.id);
    return res.status(200).json(review);
  },

  getReviewCreator: function (req, res, next) {
    res.render("home/review/review-creator.ejs");
  },

  uploadImages: function (req, res, next) {
    console.log(req.files);
    res.send(req.files);
  },

  createReview: async function (req, res, next) {
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

      review = new Review({
        bookInfo: book._id,
        author: req.user.id,
      });

      const fileName = req.user.id + Date.now() + ".md";
      fs.writeFile(path.join(fileName), req.body.content, function (err) {
        if (err) throw err;
        console.log("The file has been saved!");
      });
    }
  },
};
