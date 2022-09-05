window.addEventListener("load", function (event) {
  const loadCriteria = document.querySelector("#review .criteria .active");
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
    // console.log(event.currentTarget);
    // console.dir(event.target);
    const activeEle = document.querySelector("#review .criteria .active");
    activeEle.classList.remove("active");
    event.target.classList.add("active");
    const url = event.target.href;
    showLoading();
    const reviews = await getReviews(url);
    setTimeout(() => {
      clearLoading();
      renderReview(reviews);
      handleReadReview();
    }, 1000);
  } catch (error) {
    // console.log(error);
    showNotify("Some thing went wrong when load reviews");
  }
}

function renderReview(reviews) {
  let reviewHtml = "";
  if (reviews.length === 0)
    return showNotify("Sorry we do not have any review today");
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
       <p>Published-At: ${new Date(review.publishedAt)
         .toString()
         .slice(0, 16)}</p>
        <p>Reviewer: ${review.author.username}</p>
        <p>Stars: ${review.stars}</p>
      </div>
    </div>
    <div class="review-id">
      <p style="display: none">${review._id}</p>
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
    console.log(error);
    throw error;
  }
}

function handleReadReview() {
  const reviews = document.querySelectorAll(".review-card");

  reviews.forEach((review) => {
    review.addEventListener("click", function (event) {
      // console.log(this.previousElementSibling);
      // console.log(event.target);
      // console.log(this.firstElementChild.textContent);
      // console.log(this.parentElement);
      // console.log(this);
      const reviewId = this.lastElementChild.firstElementChild.textContent;

      // console.log(this, reviewId);

      window.location.href = `/world/reviews/${reviewId}`;
    });
  });
}
