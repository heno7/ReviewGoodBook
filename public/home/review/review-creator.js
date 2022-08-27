window.addEventListener("load", function (event) {
  sessionStorage.clear();
  const existReview = document.querySelector("#review-id");
  const reviewId = existReview.textContent;
  if (existReview) {
    sessionStorage.setItem("review_id", reviewId);
    getReviewContent(reviewId, fillReviewContent);
  }
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
  document.getElementById("book-name").value = review.bookInfo.name;
  document.getElementById("book-author").value = review.bookInfo.author;
  document.getElementById("book-genre").value = review.bookInfo.genre;
  document.getElementById("review-title-input").value = review.title;
  // markdownContent.textContent = review.content;
  markdownContent.innerText = review.content;
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
  hideBookInfo.style.display = "block";
});

cancleBtn.addEventListener("click", function (event) {
  hideBookInfo.style.display = "none";
});

doneBtn.addEventListener("click", function (event) {
  hideBookInfo.style.display = "none";
});

const fillTitleBtn = document.querySelector("#fill-review-title");
const hideTitleInfo = document.querySelector("#review-title .modal");
const reviewCancleBtn = document.querySelector("#review-cancle-btn");
const reviewDoneBtn = document.querySelector("#review-done-btn");

fillTitleBtn.addEventListener("click", function (event) {
  hideTitleInfo.style.display = "block";
});

reviewCancleBtn.addEventListener("click", function (event) {
  hideTitleInfo.style.display = "none";
});

reviewDoneBtn.addEventListener("click", function (event) {
  hideTitleInfo.style.display = "none";
});

const formImage = document.querySelector("#image-upload");
const fileInput = document.querySelector("#getFile");
const displayInfo = document.querySelector("#md-editor > #display-info");
let filesName = [];
let filesURL = [];

formImage.addEventListener("submit", (e) => {
  e.preventDefault();
  const form = e.currentTarget;
  const url = "http://localhost:7777/home/reviews/images/upload";

  if (fileInput.files.length === 0) return;

  const formData = new FormData(form);
  fetch(url, {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((files) => {
      console.log(files);
      files.forEach((file) => {
        if (filesName.includes(file.originalname))
          filesURL.push({
            fileName: file.originalname,
            fileURL: `/images/${file.filename}`,
          });
      });
      filesURL.forEach((element) => {
        let info = document.createElement("div");
        info.textContent = `${element.fileName} has URL: ${element.fileURL}`;
        displayInfo.append(info);
      });
      fileInput.value = "";
      filesName = [];
      // filesURL = [];
    })
    .catch((error) => console.error(error));
});

fileInput.addEventListener("change", function (e) {
  console.dir(this.files);
  let closeBtn = document.createElement("button");
  closeBtn.textContent = "Close";
  closeBtn.addEventListener("click", function (e) {
    displayInfo.innerHTML = "";
  });
  displayInfo.append(closeBtn);
  for (let file of this.files) {
    filesName.push(file.name);
    let info = document.createElement("div");
    info.textContent = `You selected ${file.name}`;
    displayInfo.append(info);
  }
});

const getImageURL = document.querySelector("#images-URL");
getImageURL.addEventListener("click", () => {
  formImage.dispatchEvent(new Event("submit"));
});

const saveBtn = document.querySelector("#save-review");
const completeBtn = document.querySelector("#complete-review");

saveBtn.addEventListener("click", function (event) {
  function yesHandler() {
    const reviewId = sessionStorage.getItem("review_id");
    if (reviewId) {
      return updateReview(reviewId);
    }
    return createReview();
  }

  showNotify("Do you want to save this upadate review", yesHandler);
});

completeBtn.addEventListener("click", function (event) {
  function yesHandler() {
    const reviewId = sessionStorage.getItem("review_id");
    if (!reviewId) {
      return createReview("Complete");
    }
    return updateReview(reviewId, "Complete");
  }

  showNotify("Do you want to complete this review", yesHandler);
});

function showNotify(message, handler) {
  const hideNotify = document.querySelector("#show-notify .modal");
  const messageNotify = document.querySelector("#show-notify #notify-message");
  const yesNotify = document.querySelector("#show-notify #yes");
  const noNotify = document.querySelector("#show-notify #no");

  messageNotify.textContent = message;
  hideNotify.style.display = "block";

  const handleYes = function (event) {
    hideNotify.style.display = "none";
    handler();
    yesNotify.removeEventListener("click", handleYes);
  };
  yesNotify.addEventListener("click", handleYes);

  noNotify.addEventListener("click", function (event) {
    yesNotify.removeEventListener("click", handleYes);
    hideNotify.style.display = "none";
  });
}

// console.log(showNotify("This is a test message"));

function createReview(status = "In Progress") {
  const review = generateReview(status);
  console.log(review);

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

function updateReview(reviewId, status = "In Progress") {
  const review = generateReview(status);
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

function generateReview(status) {
  const review = {};
  review.book = {
    name: document.getElementById("book-name").value.trim(),
    author: document.getElementById("book-author").value.trim(),
    genre: document.getElementById("book-genre").value.trim(),
  };
  review.title = document.getElementById("review-title-input").value;
  // review.content = markdownContent.textContent.trim();
  // review.content = markdownContent.textContent;
  review.content = markdownContent.innerText;

  // console.log(review.content);
  review.status = status;
  return review;
}
