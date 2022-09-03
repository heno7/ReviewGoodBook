window.addEventListener("load", (event) => {
  const avatarInfo = document.querySelector("#auth #avatar");
  const imageSrc = avatarInfo.querySelector("p");
  const avatar = avatarInfo.querySelector("img");
  avatar.setAttribute("src", imageSrc.textContent);
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
