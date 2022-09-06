// Display decision or notify

function showDecision(message, yesHandler, noHandler) {
  const hideNotify = document.querySelector("#show-notify .modal");
  const messageNotify = document.querySelector("#show-notify #notify-message");
  const yesNotify = document.querySelector("#show-notify #yes");
  const noNotify = document.querySelector("#show-notify #no");

  messageNotify.textContent = message;

  hideNotify.classList.add("notify");

  const handleNo = function (event) {
    hideNotify.classList.remove("notify");
    if (noHandler) {
      noHandler();
    }
    yesNotify.removeEventListener("click", handleYes);
    noNotify.removeEventListener("click", handleNo);
  };
  noNotify.addEventListener("click", handleNo);

  const handleYes = function (event) {
    hideNotify.classList.remove("notify");
    yesHandler();
    yesNotify.removeEventListener("click", handleYes);
    noNotify.removeEventListener("click", handleNo);
  };
  yesNotify.addEventListener("click", handleYes);
}

function showNotify(message, callback) {
  const hideNotify = document.querySelector("#show-notify .modal");
  const messageNotify = document.querySelector("#show-notify #notify-message");
  const buttonContainer = document.querySelector(
    "#show-notify #button-container"
  );

  messageNotify.textContent = message;

  hideNotify.classList.add("notify");

  buttonContainer.classList.add("hidden");

  messageNotify.classList.add("full-height");

  function closeNotify() {
    hideNotify.classList.remove("notify");

    buttonContainer.classList.remove("hidden");

    messageNotify.classList.remove("full-height");

    if (callback) callback();
  }

  hideNotify.addEventListener("click", closeNotify);
}

// Show loading

function showLoading() {
  const html = `<div class="loadingio-spinner-spinner-6fowy36cgcc"><div class="ldio-15ylr6o1313">
  <div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>
  </div></div>`;
  const cardContainer = document.querySelector("#card-container");
  cardContainer.classList.add("loading");

  cardContainer.innerHTML = html;
}

function clearLoading() {
  const cardContainer = document.querySelector("#card-container");
  cardContainer.classList.remove("loading");

  cardContainer.innerHTML = "";
}
