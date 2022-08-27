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
    renderReview(reviews);
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
      
          <button>Edit</button>
          <button>Delete</button>
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
