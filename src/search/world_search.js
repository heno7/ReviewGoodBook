const algoliasearch = require("algoliasearch");

const client = algoliasearch(
  process.env.SEARCH_APP_ID,
  process.env.SEARCH_APP_API_KEY
);

const WORLD_REVIEWS_INDEX = "world_reviews";

const index = client.initIndex(WORLD_REVIEWS_INDEX);

(async () => {
  await index.setSettings({
    searchableAttributes: [
      "bookInfo.name",
      "bookInfo.author",
      "bookInfo.genre",
      "title",
    ],
    customRanking: ["desc(stars)"],
  });
})();

module.exports = index;
