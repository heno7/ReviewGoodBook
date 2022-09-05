sessionStorage.clear();

window.addEventListener("load", () => {
  let currentLoad = localStorage.getItem("current-load") || "in-progress";
  // console.log(currentLoad);
  // const inProgressCriteria = document.querySelector(
  //   "#review .criteria .active"
  // );
  // inProgressCriteria.addEventListener("click", function handler(event) {
  //   hanldeClick(event);

  //   inProgressCriteria.removeEventListener("click", handler);
  // });

  // inProgressCriteria.dispatchEvent(new Event("click"));

  const loadCriteria = document.querySelector(
    `#review .criteria #${currentLoad}`
  );
  loadCriteria.addEventListener("click", function handler(event) {
    hanldeClick(event);

    loadCriteria.removeEventListener("click", handler);
    localStorage.removeItem("current-load");
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
    // console.log(event.currentTarget);
    // console.dir(event.target);
    const activeEle = document.querySelector("#review .criteria .active");
    activeEle.classList.remove("active");
    event.target.classList.add("active");
    // console.log(event.target);
    const url = event.target.href + "?page=1&limit=7";

    // console.log(url);
    showLoading();
    const reviews = await getReviews(url);
    // console.log(reviews);
    setTimeout(() => {
      clearLoading();
      renderReview(reviews);
      actionHandler();
    }, 1000);
  } catch (error) {
    // console.log(error);
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
        <p>Book: ${review.bookInfo.name}</p>
        <p>Author: ${review.bookInfo.author}</p>
        <p>Genre: ${review.bookInfo.genre}</p>
      </div>
      <div class="review-title">
        <p>${review.title}</p>
      </div>
      <div class="add-info">
        <p>Status: ${review.status}</p>
        <p>Updated-At: ${new Date(review.updatedAt)
          .toString()
          .slice(0, 24)}</p>   
        <p>Stars: ${review.stars}</p>
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
  mainDisplay.innerHTML = reviewHtml;
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

// const mainDisplay = document.querySelector("#main-display");

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
          yesHandler
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
        showDecision("Do you really want to delete this review?", yesHandler);
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
