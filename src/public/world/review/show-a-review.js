const giveStar = document.querySelector("#give-star");

giveStar.addEventListener("click", handleClick);

async function handleClick(event) {
  const reviewId = document.querySelector("#review-id").textContent;
  const starNum = document.querySelector("#star-num");
  const listStars = localStorage.getItem("stars");

  if (!listStars) {
    localStorage.setItem("stars", JSON.stringify([]));
  }

  const arrStars = JSON.parse(localStorage.getItem("stars"));

  console.log(arrStars);

  if (arrStars.includes(reviewId)) {
    return showNotify("You can only send stars once!", null, "red");
  }

  await giveStar();

  async function giveStar() {
    try {
      const response = await fetch(`/world/reviews/${reviewId}/stars`, {
        method: "PATCH",
      });

      const data = await response.json();

      if (data.status === 401) {
        return showNotify(data.message, null, "red");
      }

      if (data.status === 400) {
        return showNotify(data.message, null, "red");
      }

      if (data.status === 200) {
        arrStars.push(reviewId);
        localStorage.setItem("stars", JSON.stringify(arrStars));
        starNum.textContent = `${Number(starNum.textContent) + 1}`;
        showNotify(data.message);
      }
    } catch (error) {
      showNotify("Opp something went wrong!");
      console.log(error);
    }
  }
}
