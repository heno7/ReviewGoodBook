const userInfo = document.querySelector("#auth #username");

userInfo.addEventListener("click", function (event) {
  showNotify("Hello world");
});

function showNotify(message, handler) {
  const hideNotify = document.querySelector("#show-notify .modal");
  //   const messageNotify = document.querySelector("#show-notify #notify-message");
  const yesNotify = document.querySelector("#show-notify #yes");
  const noNotify = document.querySelector("#show-notify #no");

  //   messageNotify.textContent = message;
  // hideNotify.style.display = "block";

  hideNotify.classList.add("notify");

  const handleYes = function (event) {
    hideNotify.classList.remove("notify");
    handler();
    yesNotify.removeEventListener("click", handleYes);
  };
  yesNotify.addEventListener("click", handleYes);

  noNotify.addEventListener("click", function (event) {
    yesNotify.removeEventListener("click", handleYes);
    hideNotify.classList.remove("notify");
  });
}

const avatarForm = document.querySelector("#avatar");

avatarForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = event.currentTarget;
});
