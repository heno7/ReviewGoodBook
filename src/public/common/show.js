// Display decision or notify

function showDecision(message, yesHandler, noHandler, color = "blue") {
  const hideNotify = document.querySelector("#show-notify .modal");
  const messageNotify = document.querySelector("#show-notify #notify-message");
  const yesNotify = document.querySelector("#show-notify #yes");
  const noNotify = document.querySelector("#show-notify #no");

  messageNotify.textContent = message;
  messageNotify.classList.add(color);

  hideNotify.classList.add("notify");

  const handleNo = function (event) {
    messageNotify.classList.remove(color);
    hideNotify.classList.remove("notify");
    if (noHandler) {
      noHandler();
    }
    yesNotify.removeEventListener("click", handleYes);
    noNotify.removeEventListener("click", handleNo);
  };
  noNotify.addEventListener("click", handleNo);

  const handleYes = function (event) {
    messageNotify.classList.remove(color);
    hideNotify.classList.remove("notify");
    yesHandler();
    yesNotify.removeEventListener("click", handleYes);
    noNotify.removeEventListener("click", handleNo);
  };
  yesNotify.addEventListener("click", handleYes);
}

function showNotify(message, callback, color = "blue") {
  const hideNotify = document.querySelector("#show-notify .modal");
  const messageNotify = document.querySelector("#show-notify #notify-message");
  const buttonContainer = document.querySelector(
    "#show-notify #button-container"
  );

  messageNotify.textContent = message;

  hideNotify.classList.add("notify");

  buttonContainer.classList.add("hidden");

  messageNotify.classList.add("full-height", color);

  function closeNotify() {
    hideNotify.classList.remove("notify");

    buttonContainer.classList.remove("hidden");

    messageNotify.classList.remove("full-height", color);

    if (callback) callback();
  }

  hideNotify.addEventListener("click", closeNotify);
}

// Show loading

function showLoading(container) {
  const html = `<div class="loadingio-spinner-spinner-6fowy36cgcc"><div class="ldio-15ylr6o1313">
  <div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>
  </div></div>`;
  if (container) {
    container.classList.add("loading");
    container.innerHTML = html;
    return;
  }
  const cardContainer = document.querySelector("#card-container");
  cardContainer.classList.add("loading");

  cardContainer.innerHTML = html;
}

function clearLoading(container) {
  if (container) {
    container.classList.remove("loading");
    container.innerHTML = "";
    return;
  }
  const cardContainer = document.querySelector("#card-container");
  cardContainer.classList.remove("loading");

  cardContainer.innerHTML = "";
}

// Show quote
window.addEventListener("load", async () => {
  try {
    const quoteContainer = document.querySelector("#quote-container");
    if (!quoteContainer) return;
    const MINUTE_TIME = 2 * 60 * 1000;
    await showQuote(quoteContainer);
    setInterval(showQuote, MINUTE_TIME, quoteContainer);
  } catch (error) {
    console.log(error);
    showNotify("Opp! Failed to get quote!");
  }
});

async function showQuote(quoteContainer) {
  try {
    const quote = await getRandomQuote();

    quoteContainer.firstElementChild.textContent = `\" ${quote.content}\ "`;
    quoteContainer.lastElementChild.textContent = quote.author;
  } catch (error) {
    throw error;
  }
}

async function getRandomQuote() {
  try {
    const url = "https://api.quotable.io/random?minLength=100&maxLength=140";
    const response = await fetch(url, {
      method: "GET",
    });

    const data = await response.json();

    return data;
  } catch (error) {
    throw error;
  }
}
