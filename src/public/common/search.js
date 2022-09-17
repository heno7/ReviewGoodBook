window.addEventListener("load", async () => {
  await getSearchAPIKey();
  const currentPlace = location.pathname;
  if (currentPlace === "/" || currentPlace.startsWith("/world")) {
    const searchClient = algoliasearch(
      "WUZ790HWS6",
      sessionStorage.getItem("worldSearchKey")
    );
    runSearch(searchClient);
  }

  if (currentPlace.startsWith("/home")) {
    const searchClient = algoliasearch(
      "WUZ790HWS6",
      sessionStorage.getItem("homeSearchKey")
    );
    runSearch(searchClient);
  }
});

async function getSearchAPIKey() {
  try {
    const url = "/search-API-key";
    const response = await fetch(url, {
      method: "GET",
    });

    const data = await response.json();
    sessionStorage.setItem("worldSearchKey", data.worldSearchAPIKey);
    sessionStorage.setItem("homeSearchKey", data.homeSearchAPIKey);
  } catch (error) {
    console.error(error);
  }
}

function runSearch(searchClient) {
  const worldSearch = instantsearch({
    searchFunction(helper) {
      const container = document.querySelector("#hits");
      container.style.display = helper.state.query === "" ? "none" : "";

      helper.search();
    },
    indexName: "reviews",
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
          console.log("here");
          return html`<p>No results for <q>${results.query}</q></p>`;
        },

        item(hit, { html }) {
          console.log(hit);
          return html`
            <a href="${hit.url}">
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
