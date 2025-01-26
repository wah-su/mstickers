const images = document.querySelectorAll("[data-image-id]");

let observer = new IntersectionObserver(function(entries, self) {
  for (let entry of entries) {
    if (entry.isIntersecting) {
      let elem = entry.target;
      preload_image(elem);
      self.unobserve(elem);
    }
  }
}, {
  rootMargin: '400px 400px 400px 400px'
});

function preload_image(img) {
  img.src = img.dataset.imageSrc;
  img.setAttribute("loading", "eager")
  const id = img.dataset.imageId
  const spinner = document.querySelector(`[data-spinner-id="${id}"]`);

  console.log(`Loading ${id}`);
  img.addEventListener("load", () => {
    console.log(`image ${id} loaded`);
    img.classList.remove("invisible");
    spinner.classList.add("invisible");
    img.removeEventListener("load", this);
  });
}

images.forEach((image, i) => {
  if (i <= 5) {
    image.setAttribute("loading", "eager"); // should eager load first 6 (0-5) images
  }
  observer.observe(image)
});
