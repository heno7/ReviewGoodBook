window.addEventListener("load", function (event) {
  // sessionStorage.clear();
  const existReview = document.querySelector("#review-id");
  // const reviewId = existReview.textContent;
  if (existReview) {
    const reviewId = existReview.textContent;
    sessionStorage.setItem("review_id", reviewId);
    getReviewContent(reviewId, fillReviewContent);
    return;
  }
  const reviewId = sessionStorage.getItem("review_id");
  if (!reviewId) {
    return createDraftReview();
  }
  getReviewContent(reviewId, fillReviewContent);
});

function getReviewContent(id, callback) {
  fetch(`/home/reviews/api/${id}`, {
    method: "GET",
  })
    .then((response) => response.json())
    .then(callback);
}

const converter = new showdown.Converter();
converter.setFlavor("github");

const markdownContent = document.querySelector("#md-editor");
const htmlDisplay = document.querySelector("#html-display");
markdownContent.addEventListener("keyup", function () {
  html = converter.makeHtml(this.innerText);
  // console.log(html);
  htmlDisplay.innerHTML = html;
});

function fillReviewContent(review) {
  // console.log(review.content);
  document.getElementById("book-name").value =
    review.bookInfo.name === "draft book" ? "" : review.bookInfo.name;
  document.getElementById("book-author").value =
    review.bookInfo.author === "draft author" ? "" : review.bookInfo.author;
  document.getElementById("book-genre").value =
    review.bookInfo.genre === "draft genre" ? "" : review.bookInfo.genre;
  document.getElementById("review-title-input").value =
    review.title === "draft title" ? "" : review.title;
  // markdownContent.textContent = review.content;
  markdownContent.innerText = review.content;
  sessionStorage.setItem("filesURL", review.images);
  markdownContent.dispatchEvent(new Event("keyup"));
}

// const publishMode = document.querySelector("#publish-mode");
// publishMode.addEventListener("click", function () {
//   document.body.innerHTML = html;
// });

const fillBookInfoBtn = document.querySelector("#fill-book-info");
const hideBookInfo = document.querySelector("#book-info .modal");
const cancleBtn = document.querySelector("#book-cancle-btn");
const doneBtn = document.querySelector("#book-done-btn");

fillBookInfoBtn.addEventListener("click", function (event) {
  hideBookInfo.classList.add("active");
});

cancleBtn.addEventListener("click", function (event) {
  hideBookInfo.classList.remove("active");
});

doneBtn.addEventListener("click", function (event) {
  hideBookInfo.classList.remove("active");
});

const fillTitleBtn = document.querySelector("#fill-review-title");
const hideTitleInfo = document.querySelector("#review-title .modal");
const reviewCancleBtn = document.querySelector("#review-cancle-btn");
const reviewDoneBtn = document.querySelector("#review-done-btn");

fillTitleBtn.addEventListener("click", function (event) {
  hideTitleInfo.classList.add("active");
});

reviewCancleBtn.addEventListener("click", function (event) {
  hideTitleInfo.classList.remove("active");
});

reviewDoneBtn.addEventListener("click", function (event) {
  hideTitleInfo.classList.remove("active");
});

// handle images upload

const formImage = document.querySelector("#image-upload");
const fileInput = document.querySelector("#getFile");
const getImageURL = document.querySelector("#images-URL");
const uploadInfo = document.querySelector("#upload-images-info");
const displayInfo = document.querySelector(
  "#upload-images-info > #display-info"
);
let filesName = [];
let filesURL = [];

formImage.addEventListener("submit", (e) => {
  e.preventDefault();
  const form = e.currentTarget;
  console.log(form);
  const url = "/home/reviews/images/upload";

  if (fileInput.files.length === 0) return;

  const formData = new FormData(form);
  fetch(url, {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((files) => {
      const reviewId = sessionStorage.getItem("review_id");
      if (reviewId) {
        const imagesURL = sessionStorage.getItem("filesURL");

        filesURL = imagesURL.trim() ? JSON.parse(imagesURL) : [];
        // filesURL = JSON.parse(sessionStorage.getItem("filesURL"));
      }
      console.log(files);
      files.forEach((file) => {
        if (filesName.includes(file.originalname))
          filesURL.push({
            fileName: file.originalname,
            fileURL: `/images/${file.filename}`,
          });
      });

      console.log(filesName);
      console.log(filesURL);
      console.log(JSON.stringify({ images: filesURL }));

      if (reviewId) {
        fetch(`/home/reviews/${reviewId}/images`, {
          method: "PUT",
          body: JSON.stringify({ images: filesURL }),
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
          });
      }

      sessionStorage.setItem("filesURL", JSON.stringify(filesURL));
      // const images = JSON.parse(sessionStorage.getItem("filesURL"));
      // console.log(images);

      getImageURL.dispatchEvent(new Event("click"));

      fileInput.value = "";
      filesName = [];
      // filesURL = [];
    })
    .catch((error) => console.error(error));
});

fileInput.addEventListener("change", function (e) {
  // console.dir(this);
  // console.dir(this.files);
  // console.log(fileInput.files.length);

  const yesBtn = document.querySelector(
    "#upload-images-info #upload-action .yes"
  );

  const noBtn = document.querySelector(
    "#upload-images-info #upload-action .no"
  );

  const closeBtn = document.querySelector("#close-show-url");

  displayInfo.innerHTML = "";
  yesBtn.style.display = "inline-block";
  noBtn.style.display = "inline-block";
  closeBtn.style.display = "none";
  uploadInfo.classList.add("active");

  for (let file of this.files) {
    filesName.push(file.name);
    let info = document.createElement("div");
    info.textContent = `Image selected --- ${file.name}`;
    displayInfo.append(info);
  }

  function uploadHandler(event) {
    function yesHandler() {
      yesBtn.removeEventListener("click", uploadHandler);
      // noBtn.removeEventListener("click", noHandler);
      formImage.dispatchEvent(new Event("submit"));

      // fileInput.value = "";
      // filesName = [];
      displayInfo.innerHTML = "";
      uploadInfo.classList.remove("active");
    }
    console.log("Here");
    // yesBtn.removeEventListener("click", uploadHandler);
    // // noBtn.removeEventListener("click", noHandler);
    // formImage.dispatchEvent(new Event("submit"));

    showNotify(
      `Do you want to upload ${
        fileInput.files.length > 1 ? "these images" : "this image"
      }`,
      yesHandler
    );
  }
  yesBtn.addEventListener("click", uploadHandler);

  function noHandler(event) {
    fileInput.value = "";
    // console.log(fileInput.files);
    // console.log(filesName);
    filesName = [];
    noBtn.removeEventListener("click", noHandler);
    yesBtn.removeEventListener("click", uploadHandler);
    displayInfo.innerHTML = "";
    uploadInfo.classList.remove("active");
  }
  noBtn.addEventListener("click", noHandler);
});

function displayURL(filesURL) {
  let info = "";
  if (filesURL.length === 0) {
    info = "No file chosen";
  } else {
    filesURL.forEach((element) => {
      info += `<div><p>${element.fileName} URL --- <span class="image-url">${element.fileURL}</span></p><button class="copy">Copy URL</button></div>`;
    });
  }

  displayInfo.innerHTML = info;
}

getImageURL.addEventListener("click", () => {
  const yesBtn = document.querySelector(
    "#upload-images-info #upload-action .yes"
  );

  const noBtn = document.querySelector(
    "#upload-images-info #upload-action .no"
  );

  const closeBtn = document.querySelector("#close-show-url");

  yesBtn.style.display = "none";
  noBtn.style.display = "none";
  closeBtn.style.display = "inline-block";

  closeBtn.addEventListener("click", (e) => {
    closeBtn.style.display = "none";
    displayInfo.innerHTML = "";
    uploadInfo.classList.remove("active");
  });

  displayInfo.innerHTML = "";
  const imagesURL = sessionStorage.getItem("filesURL");

  const filesURL = imagesURL.trim() ? JSON.parse(imagesURL) : [];
  displayURL(filesURL);
  uploadInfo.classList.add("active");

  const copyBtns = displayInfo.querySelectorAll(".copy");
  copyBtns.forEach((copyBtn) => {
    copyBtn.addEventListener("click", function (event) {
      this.textContent = "Copied";
      let copyURL =
        this.previousElementSibling.querySelector(".image-url").textContent;
      navigator.clipboard.writeText(copyURL);

      setTimeout(() => {
        this.textContent = "Copy URL";
      }, 1000);
    });
  });
});

// Create or update review

const saveBtn = document.querySelector("#save-review");
const completeBtn = document.querySelector("#complete-review");

saveBtn.addEventListener("click", function (event) {
  function yesHandler() {
    const reviewId = sessionStorage.getItem("review_id");
    // if (reviewId) {
    //   return updateReview(reviewId);
    // }
    // return createReview();
    return saveProgressReview(reviewId);
  }

  showNotify("Do you want to save the progress review", yesHandler);
});

completeBtn.addEventListener("click", function (event) {
  function yesHandler() {
    const reviewId = sessionStorage.getItem("review_id");
    // if (!reviewId) {
    //   return createReview("Complete");
    // }
    // return updateReview(reviewId, "Complete");
    return completeReview(reviewId);
  }

  showNotify("Do you want to complete this review", yesHandler);
});

function showNotify(message, handler) {
  const hideNotify = document.querySelector("#show-notify .modal");
  const messageNotify = document.querySelector("#show-notify #notify-message");
  const yesNotify = document.querySelector("#show-notify #yes");
  const noNotify = document.querySelector("#show-notify #no");

  messageNotify.textContent = message;

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

// function createReview(status = "In Progress", type) {
//   const review = generateReview(status, type);
//   console.log(review);

//   fetch("/home/reviews/", {
//     method: "POST",
//     body: JSON.stringify(review),
//     headers: {
//       "Content-Type": "application/json",
//     },
//   })
//     .then((response) => response.json())
//     .then((data) => {
//       console.log(data);
//       sessionStorage.setItem("review_id", data.review_id);
//     })
//     .catch((error) => console.error(error));
// }

function createDraftReview() {
  const review = generateReview();
  fetch("/home/reviews/", {
    method: "POST",
    body: JSON.stringify(review),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      sessionStorage.setItem("review_id", data.review_id);
    })
    .catch((error) => console.error(error));
}

// function updateReview(reviewId, status = "In Progress") {
//   const review = generateReview(status);
//   console.log(review);

//   fetch(`/home/reviews/${reviewId}`, {
//     method: "PUT",
//     body: JSON.stringify(review),
//     headers: {
//       "Content-Type": "application/json",
//     },
//   })
//     .then((response) => response.json())
//     .then((data) => {
//       console.log(data);
//     })
//     .catch((error) => console.error(error));
// }

function saveProgressReview(reviewId) {
  const review = generateReview();
  console.log(review);

  fetch(`/home/reviews/${reviewId}`, {
    method: "PUT",
    body: JSON.stringify(review),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    })
    .catch((error) => console.error(error));
}

function completeReview(reviewId) {}

// function generateReview(status, type) {
//   const review = {};
//   if (type === "empty") {
//     review.book = {
//       name: " ",
//       author: " ",
//       genre: " ",
//     };

//     review.title = " ";
//     review.content = " ";
//     review.images = " ";
//     review.status = status;
//     return review;
//   }

//   review.book = {
//     name: document.getElementById("book-name").value.trim(),
//     author: document.getElementById("book-author").value.trim(),
//     genre: document.getElementById("book-genre").value.trim(),
//   };
//   review.title = document.getElementById("review-title-input").value;
//   // review.content = markdownContent.textContent.trim();
//   // review.content = markdownContent.textContent;
//   review.content = markdownContent.innerText;

//   const images = sessionStorage.getItem("filesURL");
//   review.images = images ? images : "";

//   // console.log(review.content);
//   review.status = status;
//   return review;
// }

function generateReview() {
  function isEmpty(value) {
    return value.trim() === "";
  }
  const review = {};
  const bookName = document.getElementById("book-name").value.trim();
  const bookAuthor = document.getElementById("book-author").value.trim();
  const bookGenre = document.getElementById("book-genre").value.trim();
  const reviewTitle = document
    .getElementById("review-title-input")
    .value.trim();

  review.book = {
    name: isEmpty(bookName) ? "draft book" : bookName,
    author: isEmpty(bookAuthor) ? "draft author" : bookAuthor,
    genre: isEmpty(bookGenre) ? "draft genre" : bookGenre,
  };

  review.title = isEmpty(reviewTitle) ? "draft title" : reviewTitle;
  review.content = markdownContent.innerText;
  review.images = " ";
  review.status = "In Progress";

  const images = sessionStorage.getItem("filesURL");
  review.images = images ? images : "[]";

  return review;
}
