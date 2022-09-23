window.addEventListener("load", () => {
  const loginForm = document.querySelector("form");

  console.dir(loginForm.action);
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = loginForm[0].value;
    const password = loginForm[1].value;

    const formData = {
      email,
      password,
    };

    const url = loginForm.action;

    const response = await sendForm(url, formData);

    if (response.status === 200) return (location.href = "/home");
    showNotify("Invalid Email or Password!", null, "red");
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
    showNotify("Opp! Failed to Login!", null, "red");
  }
}
