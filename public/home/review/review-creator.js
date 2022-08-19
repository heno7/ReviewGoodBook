window.addEventListener("load", function (event) {
  sessionStorage.clear();
});

const converter = new showdown.Converter();

const markdownContent = document.querySelector("#md-editor");
const htmlDisplay = document.querySelector("#html-display");
markdownContent.addEventListener("keyup", function () {
  html = converter.makeHtml(this.innerText);
  htmlDisplay.innerHTML = html;
});

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

const saveBtn = document.querySelector("#save");
const publishBtn = document.querySelector("#publish");

saveBtn.addEventListener("click", function (event) {
  const reviewId = sessionStorage.getItem("review_id");
  if (reviewId) {
    return updateReview(reviewId);
  }
  return createReview();
});

function createReview() {
  const review = {};
  review.book = {
    name: document.getElementById("book-name").value.trim(),
    author: document.getElementById("book-author").value.trim(),
    genre: document.getElementById("book-genre").value.trim(),
  };
  review.title = document.getElementById("review-title-input").value;
  review.content = markdownContent.textContent.trim();
  review.status = "In Progress";
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

function updateReview(reviewId) {
  const review = {};
  review.book = {
    name: document.getElementById("book-name").value.trim(),
    author: document.getElementById("book-author").value.trim(),
    genre: document.getElementById("book-genre").value.trim(),
  };
  review.title = document.getElementById("review-title-input").value;
  review.content = markdownContent.textContent.trim();
  review.status = "In Progress";
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
