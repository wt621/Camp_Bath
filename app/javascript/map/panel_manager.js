const PANEL_CLASSES = [
  "campsite-open",
  "onsen-open",
  "campsite-image-open",
  "weather-open"
];

function clearPanelClasses() {
  const searchContainer =
    document.querySelector(".search-container");

  if (!searchContainer) {
    return;
  }

  PANEL_CLASSES.forEach(panelClass => {
    searchContainer.classList.remove(panelClass);
  });
}

function setActivePanel(panelClass) {
  const searchContainer =
    document.querySelector(".search-container");

  if (!searchContainer) {
    return;
  }

  clearPanelClasses();

  if (panelClass) {
    searchContainer.classList.add(panelClass);
  }
}

export {
  clearPanelClasses,
  setActivePanel
};
