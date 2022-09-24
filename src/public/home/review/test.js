// sessionStorage.clear();

window.addEventListener("load", () => {
  sessionStorage.clear();

  const criteria = localStorage.getItem("load-instruction") || "in-progress";
  localStorage.clear();

  const loadCriteria = document.querySelector(`#review .criteria #${criteria}`);
  loadCriteria.addEventListener("click", function handler(event) {
    hanldeClick(event);
    loadCriteria.removeEventListener("click", handler);
  });
  loadCriteria.dispatchEvent(new Event("click"));
});

const mainDisplay = document.querySelector("#main-display");
const reviewNav = document.querySelectorAll("#review .criteria");

reviewNav.forEach((criteria) => {
  criteria.addEventListener("click", hanldeClick);
});

async function hanldeClick(event) {
  try {
    event.preventDefault();

    const activeEle = document.querySelector("#review .criteria .active");
    activeEle.classList.remove("active");
    event.target.classList.add("active");

    localStorage.removeItem("current-load");

    let url = event.target.href;
    const currentCriteria = event.target.getAttribute("id");
    console.log(currentCriteria);
    const reviewsCount = await getReviewsCount(url);
    console.log(reviewsCount);
    const limit = 7;
    let totalPageNumber;
    if (Number.isInteger(reviewsCount / limit)) {
      totalPageNumber = reviewsCount / limit;
    } else {
      totalPageNumber = Math.floor(reviewsCount / limit) + 1;
    }
    const currentPageNumber = 1;
    setCurrentLoad(
      currentCriteria,
      reviewsCount,
      limit,
      totalPageNumber,
      currentPageNumber
    );
    const currentLoad = getCurrentLoad();

    const pageNumber = currentLoad.currentPageNumber;

    if (currentLoad.totalPageNumber !== 1) {
      url = event.target.href + `?page=${pageNumber}&limit=${limit}`;
    }

    clearPagination();
    showLoading();
    const reviews = await getReviews(url);

    console.log(reviews);

    setTimeout(() => {
      clearLoading();
      renderReview(reviews);
      if (totalPageNumber > 1) {
        console.log(totalPageNumber);
        showPagination();
      }
      actionHandler();
    }, 1000);
  } catch (error) {
    showNotify("Failed to load reviews");
  }
}

function renderReview(reviews) {
  let reviewHtml = "";
  if (reviews.length === 0) return showNotify("Nothing Here");
  reviews.forEach((review) => {
    reviewHtml += `<div class="review-card">
    <div class="content">
      <div class="book-info">
        <p><i class="fa-solid fa-book-atlas"></i> ${review.bookInfo.name}</p>
        <p><i class="fa-solid fa-pen-nib"></i> ${review.bookInfo.author}</p>
        <p><i class="fa-solid fa-dna"></i> ${review.bookInfo.genre}</p>
      </div>
      <div class="review-title">
        <p>${review.title}</p>
      </div>
      <div class="add-info">
        <p><i class="fa-solid fa-signal"></i> ${review.status}</p>
        <p><i class="fa-solid fa-file-pen"></i> ${new Date(review.updatedAt)
          .toString()
          .slice(0, 24)}</p>
        <p><i class="fa-solid fa-star"></i> ${review.stars}</p>
      </div>
    </div>
    <div class="action">
          <p style="display: none">${review._id}</p>

          <button>View</button>
          ${
            review.status === "Hide" || review.status === "In Progress"
              ? "<button disabled>Hide</button>"
              : "<button>Hide</button>"
          }

          ${
            review.status === "Publish" || review.status === "In Progress"
              ? "<button disabled>Publish</button>"
              : "<button>Publish</button>"
          }

          ${
            review.status === "Publish"
              ? "<button disabled>Edit</button>"
              : "<button>Edit</button>"
          }

          ${
            review.status === "Publish"
              ? "<button disabled>Delete</button>"
              : "<button>Delete</button>"
          }
        </div>
    </div>
    `;
  });

  const cardContainer = document.querySelector("#card-container");
  console.log(cardContainer);
  if (cardContainer) cardContainer.innerHTML = reviewHtml;
  // mainDisplay.innerHTML = `<div id=""card-container>${reviewHtml}</div>`;
}

async function getReviews(url) {
  try {
    const response = await fetch(url, {
      method: "GET",
    });
    if (response.status !== 200) throw Error("Failed to get reviews");

    const reviews = await response.json();

    return reviews;
  } catch (error) {
    // console.log(error);
    throw error;
  }
}

function changePageNumber(number) {
  const currentLoad = JSON.parse(localStorage.getItem("current-load"));
  currentLoad.currentPageNumber = number;
  localStorage.setItem("current-load", JSON.stringify(currentLoad));
}

async function getReviewsCount(url) {
  const reviews = await getReviews(url);
  return reviews.length;
}

function showPagination() {
  const currentLoad = getCurrentLoad();
  let html = "";
  for (let i = 1; i <= currentLoad.totalPageNumber; i++) {
    html += `<div class=page-num>${i}</div>`;
  }

  const pagination = document.querySelector("#pagination");
  pagination.innerHTML = html;
  pagination.classList.add("show");
  const paginationBtns = document.querySelectorAll(".page-num");
  paginationBtns.forEach((pageNum) => {
    pageNum.addEventListener("click", handlePagination);
  });
}

function clearPagination() {
  const pagination = document.querySelector("#pagination");
  pagination.innerHTML = "";
  pagination.classList.remove("show");
}

async function handlePagination(event) {
  try {
    changePageNumber(event.target.textContent);

    const currentLoad = getCurrentLoad();
    const criteria = document.querySelector(`#${currentLoad.criteria}`);
    const url =
      criteria.href +
      `?page=${currentLoad.currentPageNumber}&limit=${currentLoad.limit}`;
    const cardContainer = document.querySelector("#card-container");
    cardContainer.innerHTML = "";
    showLoading();
    const reviews = await getReviews(url);
    setTimeout(() => {
      clearLoading();
      renderReview(reviews);
      actionHandler();
    });
  } catch (error) {
    showNotify("Failed to load reviews", null, "red");
  }
}

function setCurrentLoad(
  criteria,
  reviewsCount,
  limit,
  totalPageNumber,
  currentPageNumber
) {
  localStorage.setItem(
    "current-load",
    JSON.stringify({
      criteria,
      reviewsCount,
      limit,
      totalPageNumber,
      currentPageNumber,
    })
  );
}

function getCurrentLoad() {
  return JSON.parse(localStorage.getItem("current-load"));
}

function actionHandler() {
  const reviews = document.querySelectorAll(".review-card .action");

  reviews.forEach((review) => {
    review.addEventListener("click", function (event) {
      // console.log(this.previousElementSibling);
      // console.log(event.target);
      // console.log(this.firstElementChild.textContent);
      // console.log(this.parentElement);
      const reviewId = this.firstElementChild.textContent;
      const reviewCard = this.parentElement;
      const statusDisplay =
        this.previousElementSibling.lastElementChild.firstElementChild;
      console.log(reviewId, reviewCard, statusDisplay);
      if (event.target.textContent === "View") viewHandler(reviewId);
      if (event.target.textContent === "Hide") {
        function yesHandler() {
          changeStatusHandler(reviewId, "Hide", statusDisplay);
          const publishBtn = event.target.nextElementSibling;
          publishBtn.disabled = false;
          const editBtn = publishBtn.nextElementSibling;
          editBtn.disabled = false;
          const deleteBtn = editBtn.nextElementSibling;
          deleteBtn.disabled = false;
          event.target.disabled = true;
        }

        showDecision(
          "Do you really want hide this review from world?",
          yesHandler,
          null,
          "red"
        );
      }
      if (event.target.textContent === "Publish") {
        function yesHandler() {
          changeStatusHandler(reviewId, "Publish", statusDisplay);
          event.target.previousElementSibling.disabled = false;
          event.target.disabled = true;
          const editBtn = event.target.nextElementSibling;
          editBtn.disabled = true;
          const deleteBtn = editBtn.nextElementSibling;
          deleteBtn.disabled = true;
        }

        showDecision(
          "Do you really want to share this review with world?",
          yesHandler
        );
      }
      if (event.target.textContent === "Edit") {
        function yesHandler() {
          editHandler(reviewId);
        }
        showDecision("Do you really want to edit this review?", yesHandler);
      }

      if (event.target.textContent === "Delete") {
        function yesHandler() {
          deleteHandler(reviewId, reviewCard);
        }
        showDecision(
          "Do you really want to delete this review?",
          yesHandler,
          null,
          "red"
        );
      }
    });
  });
}

function viewHandler(id) {
  window.location.href = `/home/reviews/${id}`;
}

function changeStatusHandler(id, status, statusDisplay) {
  fetch(`/home/reviews/${id}/status`, {
    method: "PUT",
    body: JSON.stringify({ status: status }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.status !== 200) throw Error();

      showNotify(`Status of review has changed to ${status}`);
      statusDisplay.innerText = `Status: ${status}`;
    })
    .catch((error) => {
      showNotify("Failed to change status of review");
    });
}

function editHandler(id) {
  window.location.href = `/home/reviews/${id}/review-generator`;
}

function deleteHandler(id, reviewCard) {
  fetch(`/home/reviews/${id}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (response.status !== 200) throw Error();

      reviewCard.remove();
      showNotify("Review has deleted");
    })
    .catch((error) => {
      showNotify("Failed to delete review");
    });
}
