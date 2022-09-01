sessionStorage.clear();

window.addEventListener("load", () => {
  const inProgressCriteria = document.querySelector(
    "#review .criteria .active"
  );
  inProgressCriteria.addEventListener("click", function handler(event) {
    hanldeClick(event);

    inProgressCriteria.removeEventListener("click", handler);
  });

  inProgressCriteria.dispatchEvent(new Event("click"));
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
    const url = event.target.href;
    const reviews = await getReviews(url);
    // console.log(reviews);
    renderReview(reviews);
    actionHandler();
  } catch (error) {
    console.log(error);
  }
}

function renderReview(reviews) {
  let reviewHtml = "";
  if (reviews.length === 0) return (mainDisplay.innerHTML = reviewHtml);
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
        <p>Updated-at: ${new Date(review.updatedAt)
          .toString()
          .slice(0, 24)}</p>   
        <p>Stars: ${review.stars}</p>
      </div>
    </div>
    <div class="action">
          <p style="display: none">${review._id}</p>

          <button>View</button>
          ${
            review.status === "Hide"
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

    console.log(reviews[1]);
    return reviews;
  } catch (error) {
    console.log(error);
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
          event.target.nextElementSibling.disabled = false;
          event.target.disabled = true;
        }

        showNotify(
          "Do you really want hide this review from world?",
          yesHandler
        );
      }
      if (event.target.textContent === "Publish") {
        function yesHandler() {
          changeStatusHandler(reviewId, "Publish", statusDisplay);
          event.target.previousElementSibling.disabled = false;
          event.target.disabled = true;
        }

        showNotify(
          "Do you really want to share this review with world?",
          yesHandler
        );
      }
      if (event.target.textContent === "Edit") {
        function yesHandler() {
          editHandler(reviewId);
        }
        showNotify("Do you really want to edit this review?", yesHandler);
      }

      if (event.target.textContent === "Delete") {
        function yesHandler() {
          deleteHandler(reviewId, reviewCard);
        }
        showNotify("Do you really want to delete this review?", yesHandler);
      }
    });
  });
}

function showNotify(message, handler) {
  const hideNotify = document.querySelector("#show-notify .modal");
  const messageNotify = document.querySelector("#show-notify #notify-message");
  const yesNotify = document.querySelector("#show-notify #yes");
  const noNotify = document.querySelector("#show-notify #no");

  messageNotify.textContent = message;
  // hideNotify.style.display = "block";

  hideNotify.classList.add("notify");

  const handleYes = function (event) {
    // hideNotify.style.display = "none";
    hideNotify.classList.remove("notify");
    handler();
    yesNotify.removeEventListener("click", handleYes);
  };
  yesNotify.addEventListener("click", handleYes);

  noNotify.addEventListener("click", function (event) {
    yesNotify.removeEventListener("click", handleYes);
    // hideNotify.style.display = "none";
    hideNotify.classList.remove("notify");
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
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      statusDisplay.innerText = `Status: ${status}`;
    });
}

function editHandler(id) {
  window.location.href = `/home/reviews/${id}/review-generator`;
}

function deleteHandler(id, reviewCard) {
  fetch(`/home/reviews/${id}`, {
    method: "DELETE",
  }).then((response) => {
    if (response.status === 200) {
      reviewCard.remove();
    }
  });
}
