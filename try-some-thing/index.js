// // const testStr = "hello";
// // console.log(testStr.test);
// sessionStorage.clear();

// window.addEventListener("load", () => {
//   const criteria = localStorage.getItem("load-instruction") || "in-progress";
//   localStorage.removeItem("load-instruction");

//   const loadCriteria = document.querySelector(`#review .criteria #${criteria}`);
//   loadCriteria.dispatchEvent(new Event("click"));
// });

// const mainDisplay = document.querySelector("#main-display");
// const reviewNav = document.querySelectorAll("#review .criteria");

// reviewNav.forEach((criteria) => {
//   criteria.addEventListener("click", hanldeClick);
// });

// async function hanldeClick(event) {
//   try {
//     event.preventDefault();

//     const activeEle = document.querySelector("#review .criteria .active");
//     activeEle.classList.remove("active");
//     event.target.classList.add("active");

//     localStorage.removeItem("current-load");

//     let url = event.target.href;
//     const currentCriteria = event.target.getAttribute("id");
//     const reviewsCount = await getReviewsCount(url);
//     const limit = 7;
//     const totalPageNumber = Math.floor(reviewsCount / limit) + 1;
//     const currentPageNumber = 1;
//     setCurrentLoad(
//       currentCriteria,
//       reviewsCount,
//       limit,
//       totalPageNumber,
//       currentPageNumber
//     );
//     const currentLoad = getCurrentLoad();

//     const pageNumber = currentLoad.currentPageNumber;

//     if (currentLoad.totalPageNumber !== 1) {
//       url = event.target.href + `?page=${pageNumber}&limit=${limit}`;
//     }

//     showLoading();
//     const reviews = await getReviews(url);

//     setTimeout(() => {
//       clearLoading();
//       renderReview(reviews);
//       if (totalPageNumber > 1) {
//         showPagination();
//       }
//       actionHandler();
//     }, 1000);
//   } catch (error) {
//     showNotify("Failed to load reviews");
//   }
// }

// function renderReview(reviews) {
//   let reviewHtml = "";
//   if (reviews.length === 0) return showNotify("Nothing Here");
//   reviews.forEach((review) => {
//     reviewHtml += `<div class="review-card">
//     <div class="content">
//       <div class="book-info">
//         <p>Book: ${review.bookInfo.name}</p>
//         <p>Author: ${review.bookInfo.author}</p>
//         <p>Genre: ${review.bookInfo.genre}</p>
//       </div>
//       <div class="review-title">
//         <p>${review.title}</p>
//       </div>
//       <div class="add-info">
//         <p>Status: ${review.status}</p>
//         <p>Updated-At: ${new Date(review.updatedAt).toString().slice(0, 24)}</p>
//         <p>Stars: ${review.stars}</p>
//       </div>
//     </div>
//     <div class="action">
//           <p style="display: none">${review._id}</p>

//           <button>View</button>
//           ${
//             review.status === "Hide" || review.status === "In Progress"
//               ? "<button disabled>Hide</button>"
//               : "<button>Hide</button>"
//           }

//           ${
//             review.status === "Publish" || review.status === "In Progress"
//               ? "<button disabled>Publish</button>"
//               : "<button>Publish</button>"
//           }

//           ${
//             review.status === "Publish"
//               ? "<button disabled>Edit</button>"
//               : "<button>Edit</button>"
//           }

//           ${
//             review.status === "Publish"
//               ? "<button disabled>Delete</button>"
//               : "<button>Delete</button>"
//           }
//         </div>
//     </div>
//     `;
//   });

//   const cardContainer = document.querySelector("#card-container");
//   if (cardContainer) cardContainer.innerHTML = reviewHtml;
//   // mainDisplay.innerHTML = `<div id=""card-container>${reviewHtml}</div>`;
// }

// async function getReviews(url) {
//   try {
//     const response = await fetch(url, {
//       method: "GET",
//     });
//     if (response.status !== 200) throw Error("Failed to get reviews");

//     const reviews = await response.json();

//     return reviews;
//   } catch (error) {
//     // console.log(error);
//     throw error;
//   }
// }

// function changePageNumber(number) {
//   const currentLoad = JSON.parse(localStorage.getItem("current-load"));
//   currentLoad.currentPageNumber = number;
//   localStorage.setItem("current-load", JSON.stringify(currentLoad));
// }

// async function getReviewsCount(url) {
//   const reviews = await getReviews(url);
//   return reviews.length;
// }

// function showPagination() {
//   const html = `<div class="page-num">1</div><div class="page-num">2</div><div class="page-num">3</div>`;
//   mainDisplay.append(html);
//   const pagination = mainDisplay.querySelectorAll(".page-num");
//   pagination.forEach((pageNum) => {
//     pageNum.addEventListener("click", handlePagination);
//   });
// }

// async function handlePagination(event) {
//   changePageNumber(event.target.textContent);

//   const currentLoad = getCurrentLoad();
//   const criteria = document.querySelector(`${currentLoad.criteria}`);
//   const url =
//     criteria.href +
//     `?page=${currentLoad.currentPageNumber}&limit=${currentLoad.limit}`;
//   const reviews = await getReviews(url);
//   const cardContainer = document.querySelector("#card-container");
//   cardContainer.innerHTML = "";
//   renderReview(reviews);
// }

// function setCurrentLoad(
//   criteria,
//   reviewsCount,
//   limit,
//   totalPageNumber,
//   currentPageNumber
// ) {
//   localStorage.setItem(
//     "current-load",
//     JSON.stringify({
//       criteria,
//       reviewsCount,
//       limit,
//       totalPageNumber,
//       currentPageNumber,
//     })
//   );
// }

// function getCurrentLoad() {
//   return JSON.parse(localStorage.getItem("current-load"));
// }

// // console.log(Math.floor(15 / 7));

// class Human {
//   _name;
//   _age;
//   constructor(name, age) {
//     this._name = name;
//     this._age = age;
//   }

//   get name() {
//     return this._name;
//   }

//   set name(name) {
//     if (typeof name === "string" && name.length > 3) {
//       this._name = name;
//     } else {
//       throw new Error("The given name is invalid");
//     }
//   }
// }

// const person = new Human("test", 20);
// console.log(person.name);
// person.name = "Na";
// console.log(person.name);

const searchClient = algoliasearch(
  "WUZ790HWS6",
  "c693d91c90706fd0baeda523917f1bbd"
);

const worldSearch = instantsearch({
  searchFunction(helper) {
    const container = document.querySelector("#hits");
    container.style.display = helper.state.query === "" ? "none" : "";

    helper.search();
  },
  indexName: "reviews",
  searchClient,
});

worldSearch.addWidgets([
  instantsearch.widgets.searchBox({
    container: "#search",
  }),

  instantsearch.widgets.hits({
    container: "#hits",
    templates: {
      empty(results, { html }) {
        return html`<p>No results for <q>${results.query}</q></p>`;
      },

      item(hit, { html }) {
        return html`
          <a href="http://localhost:7777${hit.url}">
            <div class="hit-element">
              <div class="book-info">
                <p>Book: ${hit.bookInfo.name}</p>
                <p>${hit.title.slice(0, 400) + "..."}</p>
              </div>
              <div class="add-info">
                <p>Reviewer: ${hit.author}</p>
                <p>Stars: ${hit.stars}</p>
              </div>
            </div>
          </a>
        `;
      },
    },
  }),
]);

worldSearch.start();
