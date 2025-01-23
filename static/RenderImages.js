const images = document.querySelectorAll("[data-image-id]");
images.forEach((image, i) => {
  if (i < 4) {
    image.setAttribute("loading", "eager");
  }

  const spinner = document.querySelector(
    `[data-spinner-id="${image.getAttribute("data-image-id")}"]`
  );

  if (image.height > 0 && image.complete) {
    image.classList.remove("invisible");
    spinner.classList.add("invisible");
    return;
  } else {
    image.classList.add("invisible");
    spinner.classList.remove("invisible");
  }

  image.addEventListener("load", () => {
    console.log("image " + image.getAttribute("data-image-id") + " loaded");
    image.classList.remove("invisible");
    spinner.classList.add("invisible");
    image.removeEventListener("load", this);
  });
});
