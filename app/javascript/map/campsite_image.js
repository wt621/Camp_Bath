import {
  setActivePanel
} from "panel_manager";

function setupCampsiteImageButton(
  campsite,
  closeOnsenPanel,
  closeWeatherPanel,
  resizeMap,
  map
) {
  const button =
    document.getElementById(
      "campsite-image-open-button"
    );

  if (!button) {
    return;
  }

  button.addEventListener(
    "click",
    () => {
      openCampsiteImagePanel(
        campsite,
        closeOnsenPanel,
        closeWeatherPanel,
        resizeMap,
        map
      );
    }
  );
}

function openCampsiteImagePanel(
  campsite,
  closeOnsenPanel,
  closeWeatherPanel,
  resizeMap,
  map
) {
  const searchContainer =
    document.querySelector(
      ".search-container"
    );

  const imagePanel =
    document.getElementById(
      "campsite-image-panel"
    );

  const imageContent =
    document.getElementById(
      "campsite-image-content"
    );

  const closeButton =
    document.getElementById(
      "close-campsite-image-panel"
    );

  if (
    !searchContainer ||
    !imagePanel ||
    !imageContent
  ) {
    console.error(
      "キャンプ場画像パネルが見つかりません"
    );

    return;
  }

  closeOnsenPanel();

  closeWeatherPanel(
    resizeMap
  );

  imagePanel.classList.remove(
    "hidden"
  );

  setActivePanel(
    "campsite-image-open"
  );

  if (closeButton) {
    closeButton.classList.remove(
      "hidden"
    );
  }

  imageContent.innerHTML = `
    <h2>キャンプ場画像</h2>

    <div class="campsite-image-loading">
      <p>画像を読み込んでいます...</p>
    </div>
  `;

  resizeMap();

  if (
    typeof google === "undefined" ||
    !google.maps ||
    !google.maps.places
  ) {
    console.error(
      "Google Maps Places APIが利用できません"
    );

    imageContent.innerHTML = `
      <h2>キャンプ場画像</h2>

      <p>
        画像を取得できませんでした。
      </p>
    `;

    return;
  }

  const service =
    new google.maps.places.PlacesService(
      map
    );

  service.getDetails(
    {
      placeId: campsite.place_id,

      fields: [
        "name",
        "photos"
      ]
    },

    (place, status) => {
      if (
        status !==
          google.maps.places.PlacesServiceStatus.OK ||
        !place
      ) {
        console.error(
          "キャンプ場の画像情報を取得できませんでした:",
          status
        );

        imageContent.innerHTML = `
          <h2>キャンプ場画像</h2>

          <div class="campsite-image-placeholder">
            <div class="campsite-image-placeholder-icon">
              🏕️
            </div>

            <p>
              ${campsite.name}
            </p>

            <p class="image-placeholder-text">
              画像を取得できませんでした
            </p>
          </div>
        `;

        return;
      }

      if (
        !place.photos ||
        place.photos.length === 0
      ) {
        imageContent.innerHTML = `
          <h2>キャンプ場画像</h2>

          <div class="campsite-image-placeholder">
            <div class="campsite-image-placeholder-icon">
              🏕️
            </div>

            <p>
              ${place.name || campsite.name}
            </p>

            <p class="image-placeholder-text">
              このキャンプ場の画像はありません
            </p>
          </div>
        `;

        return;
      }

      const photo =
        place.photos[0];

      const imageUrl =
        photo.getUrl({
          maxWidth: 800,
          maxHeight: 600
        });

      let attributionHTML = "";

      if (
        photo.html_attributions &&
        photo.html_attributions.length > 0
      ) {
        attributionHTML = `
          <div class="campsite-image-attribution">
            ${photo.html_attributions.join(" ")}
          </div>
        `;
      }

      imageContent.innerHTML = `
        <h2>キャンプ場画像</h2>

        <div class="campsite-image-container">

          <img
            src="${imageUrl}"
            alt="${place.name || campsite.name}"
            class="campsite-image"
          >

          <p class="campsite-image-name">
            ${place.name || campsite.name}
          </p>

          ${attributionHTML}

        </div>
      `;
    }
  );
}

function closeCampsiteImagePanel(
  resizeMap
) {
  const searchContainer =
    document.querySelector(
      ".search-container"
    );

  const imagePanel =
    document.getElementById(
      "campsite-image-panel"
    );

  const imageContent =
    document.getElementById(
      "campsite-image-content"
    );

  const closeButton =
    document.getElementById(
      "close-campsite-image-panel"
    );

  if (searchContainer) {
    searchContainer.classList.remove(
      "campsite-image-open"
    );
  }

  if (imagePanel) {
    imagePanel.classList.add(
      "hidden"
    );
  }

  if (closeButton) {
    closeButton.classList.add(
      "hidden"
    );
  }

  if (imageContent) {
    imageContent.innerHTML = `
      <h2>キャンプ場画像</h2>
      <p>画像を表示するにはボタンを押してください</p>
    `;
  }

  resizeMap();
}

export {
  setupCampsiteImageButton,
  closeCampsiteImagePanel
};
