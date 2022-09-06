const searchInput = document.querySelector("#search-input");

const searchValue = searchInput.value;

const currentPlace = localStorage.getItem("current-place");

if (currentPlace === "home") {
  const reviews = getHomeSearch(searchValue);
  showLoading();
  setTimeout(() => {
    clearLoading();
    renderReviews(reviews);
    actionHandler();
  }, 1000);
}

if (currentPlace === "world") {
  const reviews = getWorldSearch(searchValue);
  showLoading();
  setTimeout(() => {
    clearLoading();
    renderReviews(reviews);
    actionHandler();
  }, 1000);
}
