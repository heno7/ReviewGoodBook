const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // cb(null, "images_store/");
    cb(null, path.join(process.cwd(), "avatar_images_store"));
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
