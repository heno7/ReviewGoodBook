const searchClient = algoliasearch(
  "WUZ790HWS6",
  "08a5179090e0112471147b6b6c9558ea"
);

// const currentPlace = localStorage.getItem("current-place");

const currentPlace = location.pathname;

if (currentPlace === "home") {
  const reviews = getHomeSearch(searchValue);
  showLoading();
  setTimeout(() => {
    clearLoading();
    renderReviews(reviews);
    actionHandler();
  }, 1000);
}

if (currentPlace === "/" || currentPlace.startsWith("/world")) {
  const worldSearch = instantsearch({
    searchFunction(helper) {
      const container = document.querySelector("#hits");
      container.style.display = helper.state.query === "" ? "none" : "";

      helper.search();
    },
    indexName: "world_reviews",
    searchClient,
  });

  worldSearch.addWidgets([
    instantsearch.widgets.searchBox({
      container: "#search",
    }),

    instantsearch.widgets.hits({
      container: "#hits",
      templates: {
        empty(results, { html }) {
          return html`<p>No results for <q>${results.query}</q></p>`;
        },

        item(hit, { html }) {
          return html`
            <a href="http://localhost:7777${hit.url}">
              <div class="hit-element">
                <div class="book-info">
                  <p>Book: ${hit.bookInfo.name}</p>
                  <p>${hit.title.slice(0, 400) + "..."}</p>
                </div>
                <div class="add-info">
                  <p>Reviewer: ${hit.author}</p>
                  <p>Stars: ${hit.stars}</p>
                </div>
              </div>
            </a>
          `;
        },
      },
    }),
  ]);

  worldSearch.start();
}
