const giveStar = document.querySelector("#give-star");

giveStar.addEventListener("click", handleClick);

function handleClick(event) {
  const reviewId = document.querySelector("#review-id").textContent;
  const starNum = document.querySelector("#star-num");
  const listStars = localStorage.getItem("stars");

  if (!listStars) {
    localStorage.setItem("stars", JSON.stringify([]));
  }

  const arrStars = JSON.parse(localStorage.getItem("stars"));

  console.log(arrStars);

  if (arrStars.includes(reviewId)) {
    return;
  }

  giveStar();

  async function giveStar() {
    try {
      const response = await fetch(`/world/reviews/${reviewId}/stars`, {
        method: "PATCH",
      });

      if (response.status === 200) {
        arrStars.push(reviewId);
        localStorage.setItem("stars", JSON.stringify(arrStars));
        starNum.textContent = `${Number(starNum.textContent) + 1}`;
      }
    } catch (error) {
      console.log(error);
    }
  }
}
