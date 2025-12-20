document.addEventListener("DOMContentLoaded", function () {

  const messageBox = document.querySelector(".form-message");
  const variantInput = document.querySelector("#selected-variant-id");
  const productDataEl = document.querySelector("#product-data");
  const productForm = document.querySelector('[data-type="add-to-cart-form"]');

  function showMessage(text, type = "error") {
    if (!messageBox) return;
    messageBox.textContent = text;
    messageBox.classList.remove("text-red-500", "text-green-500", "opacity-0", "invisible", "pointer-events-none");
    messageBox.classList.add(type === "error" ? "text-red-500" : "text-green-500");
    messageBox.classList.add("opacity-100");
    messageBox.classList.remove("invisible", "pointer-events-none");
  }

  productForm.addEventListener("submit", async (e) => {
    e.preventPropagation();
    const variantId = variantInput.value;
    const sectionId = productDataEl.dataset.sectionId;
    const quantityInput = document.querySelector(`#Quantity-${sectionId}`);
    const quantity = +quantityInput.value;

    try {
      const addResponse = await fetch(window.Shopify.routes.root + "cart/add.js", {
        method: "POST",
        body: JSON.stringify({ items: [{ id: variantId, quantity: quantity }] }),
        headers: { "Content-Type": "application/json" }
      });

      const data = await addResponse.json();

      if (data.status && data.status >= 400) {
        const message = data.description || data.message || "Unable to add to cart.";
        showMessage(message, "error");
        return;
      }
      showMessage("Added to cart successfully!", "success");

      const cartCountBubble = document.querySelector(".cart-count-bubble sup:first-child");
      if (cartCountBubble) cartCountBubble.textContent = cart.item_count;
    } catch (err) {
      console.error(err);
      showMessage("Network error. Please try again.", "error");
    } finally {
      showMessage("Added to cart successfully!", "success");
    }
  });
});
