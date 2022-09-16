const algoliasearch = require("algoliasearch");

const client = algoliasearch(
  process.env.SEARCH_APP_ID,
  process.env.SEARCH_ADMIN_APP_API_KEY
);

const REVIEWS_INDEX = "reviews";

const reviewsIndex = client.initIndex(REVIEWS_INDEX);

(async () => {
  await reviewsIndex.setSettings({
    searchableAttributes: [
      "bookInfo.name",
      "bookInfo.author",
      "bookInfo.genre",
      "title",
    ],
    customRanking: ["desc(stars)"],

    attributesForFaceting: ["filterOnly(visible_by)"],

    unretrievableAttributes: ["visible_by"],
  });
})();

function generateWorldSearchKey(userId) {
  const publicWorldKey = client.generateSecuredApiKey(
    process.env.SEARCH_API_KEY,
    {
      filters: `visible_by:everybody`,
    }
  );

  return publicWorldKey;
}

function generateHomeSearchKey(userId) {
  const publicHomeKey = client.generateSecuredApiKey(
    process.env.SEARCH_API_KEY,
    {
      filters: `visible_by:${userId}`,
    }
  );

  return publicHomeKey;
}

module.exports = {
  reviewsIndex,
  generateWorldSearchKey,
  generateHomeSearchKey,
};
