class OptionPicker extends HTMLElement {
  constructor() {
    super();
  }

  get sectionId() {
    return this.dataset.sectionId;
  }

  connectedCallback() {
    this.optionPickers = this.querySelectorAll('input[type="radio"]');

    this.handleChange = this.handleChange.bind(this);

    this.optionPickers.forEach((optionPicker) => {
      optionPicker.addEventListener("change", this.handleChange);
    });
  }

  disconnectedCallback() {
    this.optionPickers.forEach((optionPicker) => {
      optionPicker.removeEventListener("change", this.handleChange);
    });
  }

  handleChange(e) {
    const selectCurrentOption = e.currentTarget;
    const url = `${window.location.pathname}?variant=${selectCurrentOption.value}&section_id=${this.sectionId}`;
    fetch(url)
      .then((response) => {
        return response.text();
      })
      .then((html) => {
        const newDiv = document.createElement("div");
        newDiv.innerHTML = html;
        document.querySelector(".product__container").innerHTML = newDiv.querySelector(".product__container").innerHTML;

        if (window.attachQuantityButtons) window.attachQuantityButtons();
        if (window.attachAddToCart) window.attachAddToCart();

        if (window.initStickyATCVisibility) window.initStickyATCVisibility();
        if (window.attachStickySubmit) window.attachStickySubmit();
        if (window.sizeOptionPopover) window.sizeOptionPopover();

        if (window.initializeSlider) window.initializeSlider();
        if (window.selectVariantThumbnail) window.selectVariantThumbnail(selectCurrentOption.value);

        const newURL = new URL(url, window.location.origin);
        newURL.searchParams.delete("section_id");
        window.history.pushState({}, "", newURL.toString());
      });
  }
}

customElements.define("option-picker", OptionPicker);
