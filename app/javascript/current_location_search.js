import {
  getCurrentLocation
} from "geolocation";

function setupCurrentLocationSearch() {
  const button =
    document.querySelector(
      ".current-location-search-button"
    );

  if (!button) {
    return;
  }

  button.replaceWith(
    button.cloneNode(true)
  );

  const newButton =
    document.querySelector(
      ".current-location-search-button"
    );

  newButton.addEventListener(
    "click",
    event => {
      event.preventDefault();

      newButton.disabled = true;

      getCurrentLocation(
        currentLocation => {
          const params =
            new URLSearchParams({
              latitude:
                currentLocation.lat,
              longitude:
                currentLocation.lng
            });

          window.location.href =
            `/search?${params.toString()}`;
        },
        () => {
          newButton.disabled = false;
        }
      );
    }
  );
}

document.addEventListener(
  "turbo:load",
  () => {
    setupCurrentLocationSearch();
  }
);
