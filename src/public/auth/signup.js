window.addEventListener("load", () => {
  const signupForm = document.querySelector("form");

  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = signupForm[0].value;
    const email = signupForm[1].value;
    const password = signupForm[2].value;
    const repeat_password = signupForm[3].value;

    const formData = {
      username,
      email,
      password,
      repeat_password,
    };

    const url = signupForm.action;

    showWaitLoading();
    const response = await sendForm(url, formData);
    clearWaitLoading();

    if (response.status === 200)
      return showNotify(response.message, () => {
        location.href = "/world";
      });

    if (response.message.includes("repeat_password")) {
      return showNotify("Repeat Password and Password must same!", null, "red");
    }

    if (response.message.includes("password")) {
      return showNotify("Invalid Password!", null, "red");
    }
    showNotify(response.message, null, "red");
  });
});

async function sendForm(url, formData) {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    return await response.json();
  } catch (error) {
    showNotify("Opp! Failed to Signup!", null, "red");
  }
}

function showWaitLoading() {
  const loadingContainer = document.querySelector("#loading-container");
  loadingContainer.classList.add("active");
  showLoading(loadingContainer.firstElementChild);
}

function clearWaitLoading() {
  const loadingContainer = document.querySelector("#loading-container");
  loadingContainer.classList.remove("active");
  clearLoading(loadingContainer.firstElementChild);
}
