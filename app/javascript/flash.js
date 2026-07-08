const FLASH_DISPLAY_DURATION = 3000;
const FLASH_FADE_DURATION = 800;

function setupFlashMessages() {
  const flashMessages = document.querySelectorAll(".flash-message");

  flashMessages.forEach((flash) => {
    setTimeout(() => {
      flash.classList.add("fade-out");

      setTimeout(() => {
        flash.remove();
      }, FLASH_FADE_DURATION);
    }, FLASH_DISPLAY_DURATION);
  });
}

document.addEventListener("turbo:render", setupFlashMessages);