const copyBtn = document.querySelector("#copy");
const content = document.querySelector("#content");
const pasteArea = document.querySelector("#paste-area");

let copyContent = "";

copyBtn.addEventListener("click", function (event) {
  copyContent = content.textContent;
  navigator.clipboard.writeText(copyContent);
});
