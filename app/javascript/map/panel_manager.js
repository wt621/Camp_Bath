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

  if (!panelClass) {
    return;
  }

  searchContainer.classList.add(
    panelClass
  );

  if (
    [
      "onsen-open",
      "campsite-image-open",
      "weather-open"
    ].includes(panelClass)
  ) {
    searchContainer.classList.add(
      "campsite-open"
    );
  }
}

export {
  clearPanelClasses,
  setActivePanel
};
