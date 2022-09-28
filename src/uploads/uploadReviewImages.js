const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // cb(null, "images_store/");
    // console.log(path.join(process.cwd(), ".."));
    // console.log(__dirname);
    // let pathStore = path.join(process.cwd(), "review_images_store");
    // let pathStore = path.join(process.cwd(), "..", "review_images_store");
    // console.log(pathStore);
    if (process.env.NODE_ENV === "production") {
      pathStore = path.join(
        path.join(process.cwd(), "..", "review_images_store")
      );
      console.log(pathStore);
      cb(null, pathStore);
    } else {
      console.log(path.join(process.cwd(), "review_images_store"));
      cb(null, path.join(process.cwd(), "review_images_store"));
    }
  },
  filename: function (req, file, cb) {
    cb(
      null,
      Date.now() +
        Math.round(Math.random() * 1e9) +
        path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

module.exports = { upload };
