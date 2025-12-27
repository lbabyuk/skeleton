document.addEventListener("DOMContentLoaded", async () => {
  attachQuantityButtons();
  attachStickySubmit();
  attachAddToCart();
  initializeCartBubble();
});

async function initializeCartBubble() {
  try {
    const response = await fetch(`${window.Shopify.routes.root}cart.js`);
    const cart = await response.json();

    document.querySelectorAll(".cart-count-bubble").forEach((bubble) => {
      const sup = bubble.querySelector("sup");
      const srOnly = bubble.querySelector(".sr-only");

      if (sup) sup.textContent = cart.item_count;
      if (srOnly) srOnly.textContent = `${cart.item_count} items`;
    });
  } catch (error) {
    console.error("Cart init error:", error);
  }
}

function attachStickySubmit() {
  const stickyBtn = document.querySelector("[data-sticky-submit]");
  const productForm = document.querySelector('[data-type="add-to-cart-form"]');

  if (!stickyBtn || !productForm) return;

  stickyBtn.addEventListener("click", () => {
  productForm.requestSubmit();
  });
}

function attachAddToCart() {
  const productForm = document.querySelector('[data-type="add-to-cart-form"]');
  if (!productForm) return;

  productForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const messageBox = productForm.querySelector(".form-message");
    const variantInput = productForm.querySelector("#selected-variant-id");
    const quantityInput = productForm.querySelector('input[name="quantity"]');
    const stickyBtn = document.querySelector("[data-sticky-submit]");
    const addToCartBtn = document.querySelector(".add-to-cart-button");
    const originalATCText = addToCartBtn.dataset.addToBagText || addToCartBtn.textContent;
    const originalStickyATCText = stickyBtn.dataset.addToBagText || stickyBtn.textContent;
    const variantId = variantInput?.value;

    const quantity = quantityInput ? Number(quantityInput.value) : 1;

    if (!variantId) return;

    if (addToCartBtn) {
      addToCartBtn.disabled = true;
      addToCartBtn.textContent = "Adding...";
    }

    if (stickyBtn) {
      stickyBtn.disabled = true;
      stickyBtn.textContent = "Adding...";
    }

    try {
      const response = await fetch(`${window.Shopify.routes.root}cart/add.js`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: [{ id: variantId, quantity }]
        })
      });

      const data = await response.json();

      if (!response.ok) {
        showMessage(messageBox, data.message, "error");
        addToCartBtn.disabled = false;
        addToCartBtn.textContent = originalATCText;

        stickyBtn.disabled = false;
        stickyBtn.textContent = originalStickyATCText;

        setTimeout(resetMessages, 3000);
        unlockPage();
        return;
      }

      showMessage(messageBox, messageBox.dataset.successMessage, "success");
      setTimeout(() => {
        resetMessages();
      }, 3000);

      await initializeCartBubble();
      await refreshHeaderCartBubble();

      document.dispatchEvent(new CustomEvent("cart:change", { bubbles: true }));
      document.dispatchEvent(new CustomEvent("cart:refresh"));
      addToCartBtn.disabled = false;
      addToCartBtn.textContent = originalATCText;

      stickyBtn.disabled = false;
      stickyBtn.textContent = originalStickyATCText;

      unlockPage();
    } catch (err) {
      console.error(err);
      showMessage(messageBox, "Network error", "error");
      setTimeout(() => {
        resetMessages();
      }, 3000);
      addToCartBtn.disabled = false;
      addToCartBtn.textContent = originalATCText;

      stickyBtn.disabled = false;
      stickyBtn.textContent = originalStickyATCText;
      unlockPage();
    }
  });
}

function showMessage(el, text, type) {
  if (!el) return;
  el.textContent = text;
  el.classList.remove("text-red-500", "text-green-500", "opacity-0");
  el.classList.add(type === "error" ? "text-red-500" : "text-green-500", "opacity-100");
}

function resetMessages() {
  document.querySelectorAll(".form-message").forEach((message) => {
    message.textContent = "";
    message.classList.remove("text-red-500", "text-green-500", "opacity-100");
    message.classList.add("opacity-0");
  });
}

function unlockPage() {
  document.body.classList.remove("overflow-hidden", "lock-scroll");
  document.body.style.overflow = "";
}

function attachQuantityButtons() {
  document.querySelectorAll(".product_quantity--input").forEach((input) => {
    const container = input.closest("[data-url]");
    const minusBtn = container.querySelector('button[name="minus"]');
    const plusBtn = container.querySelector('button[name="plus"]');

    minusBtn.addEventListener("click", () => {
      let value = parseInt(input.value);
      const min = parseInt(input.min) || 1;
      if (value > min) input.value = value - 1;
    });

    plusBtn.addEventListener("click", () => {
      let value = parseInt(input.value);
      const max = parseInt(input.max) || Infinity;
      if (value < max) input.value = value + 1;
    });
  });
}

async function refreshHeaderCartBubble() {
  const sectionId = document.querySelector(".cart-count-bubble")?.closest("[data-section-id]")?.dataset.sectionId;

  if (!sectionId) return;

  const url = `${window.location.pathname}?section_id=${sectionId}`;

  const response = await fetch(url);
  const html = await response.text();

  const newDom = document.createElement("div");
  newDom.innerHTML = html;

  const newSection = newDom.querySelector(`[data-section-id="${sectionId}"]`);
  const currentSection = document.querySelector(`[data-section-id="${sectionId}"]`);
  if (newSection && currentSection) {
    currentSection.replaceWith(newSection);
  }
}

window.attachAddToCart = attachAddToCart;
window.attachQuantityButtons = attachQuantityButtons;
window.attachStickySubmit = attachStickySubmit;
