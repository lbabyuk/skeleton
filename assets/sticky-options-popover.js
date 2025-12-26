document.addEventListener("DOMContentLoaded", function () {
  sizeOptionPopover();
});

function sizeOptionPopover() {
  document.querySelectorAll("[data-size-trigger]").forEach((trigger) => {
    const popover = trigger.closest(".relative").querySelector("[data-size-popover]");
    const label = trigger.querySelector("[data-size-label]");
    const options = popover.querySelectorAll("[data-size-option]");

    function positionPopover() {
      popover.classList.remove("hidden");
      popover.style.visibility = "hidden";

      const triggerRect = trigger.getBoundingClientRect();

      const bottom = window.innerHeight - triggerRect.top + 8;

      const left = triggerRect.left + triggerRect.width / 2;

      popover.style.bottom = `${bottom}px`;
      popover.style.top = "auto";
      popover.style.left = `${left}px`;
      popover.style.transform = "translateX(-50%)";

      popover.style.visibility = "visible";
    }

    trigger.addEventListener("click", (e) => {
      e.stopPropagation();

      if (popover.classList.contains("hidden")) {
        positionPopover();
      } else {
        popover.classList.add("hidden");
      }
    });

    options.forEach((option) => {
      option.addEventListener("click", () => {
        const radio = document.getElementById(option.getAttribute("for"));

        if (radio && !radio.disabled) {
          radio.checked = true;
          label.textContent = option.textContent.trim();
          popover.classList.add("hidden");
          radio.dispatchEvent(new Event("change", { bubbles: true }));
        }
      });
    });

    document.addEventListener("click", (e) => {
      if (!popover.contains(e.target) && !trigger.contains(e.target)) {
        popover.classList.add("hidden");
      }
    });
  });
}

window.sizeOptionPopover = sizeOptionPopover;
