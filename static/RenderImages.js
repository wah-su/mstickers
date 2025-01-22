const images = document.querySelectorAll("[data-image-id]");

images.forEach((image) => {

    const spinner = document.querySelector(`[data-spinner-id="${image.getAttribute("data-image-id")}"]`)

    if (image.height > 0) {
        image.classList.remove("hidden");
        spinner.classList.add("hidden");
        return
    }

    image.addEventListener("load", () => {
        console.log("image " + image.getAttribute("data-image-id") + " loaded");
        image.classList.remove("hidden");
        spinner.classList.add("hidden");
        image.removeEventListener("load", this);
    });

});