document.addEventListener("DOMContentLoaded", () => {
  initStickyATCVisibility();
});

function initStickyATCVisibility() {
  const fixedElement = document.querySelector(".sticky__add-to-cart");
  const scrollElement = document.querySelector(".add-to-cart-button");

  if (!fixedElement || !scrollElement) return;

  fixedElement.style.display = "none";

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        fixedElement.style.display = "none";
      } else {
        fixedElement.style.display = "grid";
      }
    },
    {
      root: null,
      threshold: 0
    }
  );

  observer.observe(scrollElement);
}

window.initStickyATCVisibility = initStickyATCVisibility;
