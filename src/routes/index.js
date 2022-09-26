const express = require("express");
const router = express.Router();
const path = require("path");

const fs = require("fs/promises");
const showdown = require("showdown");

const { checkUser } = require("../auth/checkAuth");

const {
  generateWorldSearchKey,
  generateHomeSearchKey,
} = require("../search/search");

router.get("/", checkUser, async (req, res) => {
  const converter = new showdown.Converter();
  converter.setFlavor("github");
  const indexPath = path.join(
    process.cwd(),
    "reviews_store",
    "admin",
    "index.md"
  );

  const indexContent = converter.makeHtml(
    await fs.readFile(indexPath, {
      encoding: "utf8",
    })
  );

  res.render("index", {
    user: req.user,
    content: indexContent,
  });
});

router.get("/search-API-key", checkUser, (req, res) => {
  const worldSearchAPIKey = generateWorldSearchKey();

  if (req.user) {
    const homeSearchAPIKey = generateHomeSearchKey(req.user.id);
    return res.status(200).json({
      worldSearchAPIKey,
      homeSearchAPIKey,
    });
  }

  return res.status(200).json({
    worldSearchAPIKey,
  });
});

module.exports = router;
