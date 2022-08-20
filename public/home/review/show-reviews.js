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
      function yesHandler() {
        changeStatusHandler(reviewId, "Hide", statusDisplay);
        event.target.nextElementSibling.disabled = false;
        event.target.disabled = true;
      }

      showNotify("Do you want hide this review from world?", yesHandler);
    }
    if (event.target.textContent === "Publish") {
      function yesHandler() {
        changeStatusHandler(reviewId, "Publish", statusDisplay);
        event.target.previousElementSibling.disabled = false;
        event.target.disabled = true;
      }

      showNotify("Do you want to share this review with world?", yesHandler);
    }
    if (event.target.textContent === "Edit") {
      function yesHandler() {
        editHandler(reviewId);
      }
      showNotify("Do you want to share this review with world?", yesHandler);
    }

    if (event.target.textContent === "Delete") deleteHandler();
  });
});

function showNotify(message, handler) {
  const hideNotify = document.querySelector("#show-notify .modal");
  const messageNotify = document.querySelector("#show-notify #notify-message");
  const yesNotify = document.querySelector("#show-notify #yes");
  const noNotify = document.querySelector("#show-notify #no");

  messageNotify.textContent = message;
  hideNotify.style.display = "block";

  const handleYes = function (event) {
    hideNotify.style.display = "none";
    handler();
    yesNotify.removeEventListener("click", handleYes);
  };
  yesNotify.addEventListener("click", handleYes);

  noNotify.addEventListener("click", function (event) {
    yesNotify.removeEventListener("click", handleYes);
    hideNotify.style.display = "none";
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
  window.location.href = `/home/reviews/${id}/review-creator`;
}
