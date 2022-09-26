window.addEventListener("load", () => {
  const criteria = localStorage.getItem("load-instruction") || "home";

  if (criteria === "review-generator") {
    const world = document.querySelector("#world a");
    const home = document.querySelector("#home a");
    blockBack(world, home);
    backGenerator();
  }
});

function blockBack(...elements) {
  elements.forEach((element) => {
    element.addEventListener("click", (event) => {
      event.preventDefault();
      return;
    });
  });
}

function backGenerator() {
  const container = document.querySelector("#generator");
  renderButton(container);
  const button = document.querySelector("#generator button");
  button.addEventListener("click", (event) => {
    localStorage.clear();
    container.classList.remove("display");
    const reviewId = sessionStorage.getItem("review_id");
    location.href = `/home/reviews/${reviewId}/review-generator`;
  });
}

function renderButton(container) {
  const html = `<button>Back to Review Generator</button>`;

  container.classList.add("display");
  container.innerHTML = html;
  return;
}
