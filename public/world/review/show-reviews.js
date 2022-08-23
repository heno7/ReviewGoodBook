const reviews = document.querySelectorAll(".review-card .action");

reviews.forEach((review) => {
  review.addEventListener("click", function (event) {
    // console.log(this.previousElementSibling);
    // console.log(event.target);
    // console.log(this.firstElementChild.textContent);
    // console.log(this.parentElement);
    console.log(this);
    const reviewId = this.firstElementChild.textContent;
    if (event.target.textContent === "Read") {
      window.location.href = `/world/reviews/${reviewId}`;
    }
  });
});
