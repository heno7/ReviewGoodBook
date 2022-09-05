window.addEventListener("load", (event) => {
  const avatarInfo = document.querySelector("#auth #avatar");
  if (!avatarInfo) return;
  const imageSrc = avatarInfo.querySelector("p");
  const avatar = avatarInfo.querySelector("img");
  avatar.setAttribute("src", imageSrc.textContent);
  run();
});

function run() {
  const avatarInfo = document.querySelector("#auth #avatar");
  avatarInfo.addEventListener("click", handleUpload);

  function handleUpload(event) {
    function yesHandler() {
      avatarForm.dispatchEvent(new Event("submit"));
    }
    function noHandler(event) {
      const imageInfo = document.querySelector("#form-container #image-info");
      imageInfo.textContent = "No File Chosen";
      inputFile.value = "";
    }
    showUpload(yesHandler, noHandler);
  }

  function showUpload(yesHandler, noHandler) {
    const hideNotify = document.querySelector("#show-upload .modal");
    //   const messageNotify = document.querySelector("#show-notify #notify-message");
    const yesUpload = document.querySelector(
      "#show-upload #upload-button #upload"
    );
    const noUpload = document.querySelector(
      "#show-upload #upload-button #cancle"
    );

    //   messageNotify.textContent = message;

    hideNotify.classList.add("notify");

    const handleYes = function (event) {
      hideNotify.classList.remove("notify");
      yesHandler();
      yesUpload.removeEventListener("click", handleYes);
      noUpload.removeEventListener("click", handleNo);
    };
    yesUpload.addEventListener("click", handleYes);

    const handleNo = function (event) {
      hideNotify.classList.remove("notify");
      noHandler();
      yesUpload.removeEventListener("click", handleYes);
      noUpload.removeEventListener("click", handleNo);
    };
    noUpload.addEventListener("click", handleNo);
  }

  const avatarForm = document.querySelector("#avatar-form");
  const inputFile = avatarForm.querySelector("input");

  avatarForm.addEventListener("change", (event) => {
    const imageInfo = document.querySelector("#form-container #image-info");
    imageInfo.textContent = inputFile.files.item(0).name;
  });

  avatarForm.addEventListener("submit", async (event) => {
    try {
      event.preventDefault();

      if (inputFile.files.length === 0) return showNotify("Please Chose File");
      const form = event.currentTarget;
      // console.dir(form);
      // console.dir(inputFile);
      const formData = new FormData(form);

      const urlUpload = "/users/auth/avatar/upload";

      let response = await fetch(urlUpload, {
        method: "POST",
        body: formData,
      });

      if (response.status !== 200) throw Error();

      const urlImage = await response.json();
      // console.log(urlImage);
      updateAvatar(urlImage.url);
      inputFile.value = "";

      showNotify("Success to change to avatar");
    } catch (error) {
      showNotify("Failed to change avatar");
    }
  });

  function updateAvatar(url) {
    const avatar = document.querySelector("#auth #avatar img");
    avatar.setAttribute("src", url);
  }
}
