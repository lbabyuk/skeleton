(function () {
  function openModal() {
    const popup = document.getElementById("sizeGuideModal");
    if (!popup) return;

    popup.style.display = "flex";
    document.body.style.overflow = "hidden";
    popup.focus();
  }

  function closeModal() {
    const popup = document.getElementById("sizeGuideModal");
    if (!popup) return;

    popup.style.display = "none";
    document.body.style.overflow = "";
  }

  document.addEventListener("click", function (e) {
    const btn = e.target.closest(".open-size-guide");
    if (!btn) return;

    e.preventDefault();
    openModal();
  });

  document.addEventListener("click", function (e) {
    if (e.target.closest(".close-modal")) {
      closeModal();
    }
  });

  document.addEventListener("click", function (e) {
    const popup = document.getElementById("sizeGuideModal");
    if (!popup) return;

    if (e.target === popup) {
      closeModal();
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeModal();
    }
  });
})();
