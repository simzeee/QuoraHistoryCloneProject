document.addEventListener("DOMContentLoaded", () => {
  const emailInput = document.getElementById("email-input");
  const passwordInput = document.getElementById("password-input");
  const demoButton = document.querySelector(".demo-button");

  demoButton.addEventListener("click", (e) => {
    e.preventDefault();
    console.log(emailInput, passwordInput);
    emailInput.value = "demoUser@gmail.com";
    passwordInput.value = "Password!1";

    const loginButton = document.querySelector(".login-button");
    setTimeout(() => loginButton.click(), 300);
  });
});
