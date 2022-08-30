// const copyBtn = document.querySelector("#copy");
// const content = document.querySelector("#content");
// const pasteArea = document.querySelector("#paste-area");

// let copyContent = "";

// copyBtn.addEventListener("click", function (event) {
//   copyContent = content.textContent;
//   navigator.clipboard.writeText(copyContent);
// });

window.addEventListener("beforeunload", function (event) {
  event.preventDefault();
  // alert("This is a test");
  console.log("This is a test");
  return (event.returnValue = "Are you sure you want to exit?");
});
