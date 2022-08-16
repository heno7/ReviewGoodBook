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

const formImage = document.querySelector("#image-upload");
const fileInput = document.querySelector("#getFile");
const displayInfo = document.querySelector("#md-editor > #display-info");
let filesName = [];
let filesURL = [];

formImage.addEventListener("submit", (e) => {
  e.preventDefault();
  const form = e.currentTarget;
  const url = "http://localhost:7777/images/upload";

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
  const review = {};
  review.book = {
    name: document.getElementById("book-name").textContent.trim(),
    author: document.getElementById("book-author").textContent.trim(),
    genre: document.getElementById("book-genre").textContent.trim(),
  };
  review.content = markdownContent.textContent.trim();
  review.publish = false;
  console.log(review);
});
