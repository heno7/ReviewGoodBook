const mainDisplay = document.querySelector("#main-display");

const reviews = document.querySelectorAll(".review-card .action");

reviews.forEach((review) => {
  review.addEventListener("click", function (event) {
    // console.log(this.previousElementSibling);
    // console.log(event.target);
    // console.log(this.firstElementChild.textContent);
    const reviewId = this.firstElementChild.textContent;
    const statusDisplay = this.previousElementSibling.lastElementChild;
    if (event.target.textContent === "View") viewHandler(reviewId);
    if (event.target.textContent === "Hide") {
      changeStatusHandler(reviewId, "Hide", statusDisplay);
      event.target.nextElementSibling.disabled = false;
      event.target.disabled = true;
    }
    if (event.target.textContent === "Publish") {
      changeStatusHandler(reviewId, "Publish", statusDisplay);
      event.target.previousElementSibling.disabled = false;
      event.target.disabled = true;
    }
    if (event.target.textContent === "Edit") editHandler();
    if (event.target.textContent === "Delete") deleteHandler();
  });
});

function viewHandler(id) {
  fetch(`/home/reviews/${id}`, {
    method: "GET",
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      mainDisplay.innerHTML = "Hello World";
    });
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
