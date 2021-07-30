window.addEventListener("DOMContentLoaded", () => {
  // set background image with cookie

  // if there is no cookie, set it based off --clicked
  const cookiesArray = document.cookie.split("; ");

  let currentImage = document.querySelector(".--clicked");

  let currentURL;
  cookiesArray.forEach((cookie) => {
    if (cookie.split("=")[0] === "currentURL")
      currentURL = cookie.split("=")[1];
  });
  if (!currentURL) document.cookie = `currentURL=${currentImage.id}`;
  document.body.style.background = `url(${currentURL})`;
  document.body.style.backgroundSize = "contain";

  // if there is a cookie, set the background based off the cookie
  const backgroundImages = document.querySelectorAll(".background-image");
  backgroundImages.forEach((image) => {
    image.addEventListener("click", (e) => {
      currentImage = document.querySelector(".--clicked");
      currentImage.classList.remove("--clicked");

      const imageURL = image.id;
      document.body.style.background = `url(${imageURL})`;
      document.body.style.backgroundSize = "contain";
      document.cookie = `currentURL=${imageURL}`;
      image.classList.add("--clicked");
    });
  });
});
