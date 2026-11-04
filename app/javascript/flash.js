const FLASH_DISPLAY_DURATION = 3000;
const FLASH_FADE_DURATION = 800;

function scheduleFlashRemoval(flash) {
  setTimeout(() => {
    flash.classList.add("fade-out");

    setTimeout(() => {
      flash.remove();
    }, FLASH_FADE_DURATION);
  }, FLASH_DISPLAY_DURATION);
}

function setupFlashMessages() {
  const flashMessages =
    document.querySelectorAll(".flash-message");

  flashMessages.forEach(scheduleFlashRemoval);
}

// JavaScriptからFlash通知を表示する
function showFlashMessage(message, type = "alert") {
  const flash = document.createElement("div");

  flash.className = `flash-message ${type}`;

  const content = document.createElement("div");
  content.className = "flash-content";
  content.textContent = message;

  flash.appendChild(content);
  document.body.appendChild(flash);

  scheduleFlashRemoval(flash);
}

document.addEventListener("DOMContentLoaded", setupFlashMessages);
document.addEventListener("turbo:load", setupFlashMessages);
document.addEventListener("turbo:frame-render", setupFlashMessages);
document.addEventListener("turbo:render", setupFlashMessages);

export { showFlashMessage };
