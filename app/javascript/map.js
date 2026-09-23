const FACILITY_SEARCH_RADIUS = 10000;
const FACILITY_RESULT_COUNT = 3;
const MARKER_ICON_SIZE = 32;

function getMarkerIcon(iconName) {
  return {
    url: `/assets/${iconName}`,
    scaledSize: new google.maps.Size(
      MARKER_ICON_SIZE,
      MARKER_ICON_SIZE
    ),
    anchor: new google.maps.Point(
      MARKER_ICON_SIZE / 2,
      MARKER_ICON_SIZE
    )
  };
}

let map;
let currentLocationMarker;

let campsiteMarkers = [];
let facilityMarkers = [];

let selectedCampsiteMarker = null;
let selectedCampsite = null;

let campsiteSearchResults = [];
let currentFacilityResults = [];
let currentFacilityType = null;

function isCampsite(place) {
  const name = place.name || "";

  const excludeWords = [
    "株式会社",
    "会社",
    "ラボラトリー",
    "オペレーション",
    "小貝川リバーサイドパーク",
    "生牧草専門 中央牧草センター"
  ];

  return !excludeWords.some(word => name.includes(word));
}

function clearCampsiteMarkers() {
  campsiteMarkers.forEach(marker => {
    marker.setMap(null);
  });

  campsiteMarkers = [];
}

function clearFacilityMarkers() {
  facilityMarkers.forEach(marker => {
    marker.setMap(null);
  });

  facilityMarkers = [];
}

function showSelectedCampsiteMarker(campsite) {
  clearCampsiteMarkers();

  const marker = new google.maps.Marker({
    position: campsite.geometry.location,
    map: map,
    title: campsite.name,
    icon: getMarkerIcon("Camp-icon.png")
  });

  marker.addListener("click", () => {
    const service =
      new google.maps.places.PlacesService(map);

    openCampsiteDetails(
      campsite,
      service
    );
  });

  campsiteMarkers.push(marker);
  selectedCampsiteMarker = marker;
}

function restoreSelectedCampsiteAndFacilities() {
  if (
    !selectedCampsite ||
    !selectedCampsite.geometry ||
    !selectedCampsite.geometry.location
  ) {
    showCampsiteSearchMarkers();
    return;
  }

  showSelectedCampsiteMarker(
    selectedCampsite
  );

  if (
    currentFacilityResults.length > 0 &&
    currentFacilityType
  ) {
    showFacilityMarkers(
      currentFacilityResults,
      selectedCampsite,
      currentFacilityType
    );
  }
}

function showCampsiteSearchMarkers() {
  clearCampsiteMarkers();
  clearFacilityMarkers();

  campsiteSearchResults.forEach(campsite => {
    if (
      !campsite.geometry ||
      !campsite.geometry.location
    ) {
      return;
    }

    const marker = new google.maps.Marker({
      position: campsite.geometry.location,
      map: map,
      title: campsite.name,
      icon: getMarkerIcon("Camp-icon.png")
    });

    const service =
      new google.maps.places.PlacesService(map);

    marker.addListener("click", () => {
      openCampsiteDetails(
        campsite,
        service
      );
    });

    campsiteMarkers.push(marker);
  });

  selectedCampsiteMarker = null;
  selectedCampsite = null;
}

function showFacilityMarkers(
  facilities,
  campsite,
  facilityType
) {
  clearFacilityMarkers();

  facilities.forEach(facility => {
    if (
      !facility.geometry ||
      !facility.geometry.location
    ) {
      return;
    }

    const marker = new google.maps.Marker({
      position: facility.geometry.location,
      map: map,
      title: facility.name,
      icon: getMarkerIcon(
        facilityType === "onsen"
          ? "Onsen-icon.png"
          : "Shop-icon.png"
      )
    });

    marker.addListener("click", () => {
      const service =
        new google.maps.places.PlacesService(map);

      openFacilityDetails(
        facility,
        service,
        campsite,
        facilityType
      );
    });

    facilityMarkers.push(marker);
  });
}

function searchCampsites(center) {
  if (!map) {
    console.error("Google Mapsがまだ初期化されていません");
    return;
  }

  const service = new google.maps.places.PlacesService(map);

  const panel = document.getElementById("campsite-panel");
  const panelContent = document.getElementById("campsite-content");

  if (!panel || !panelContent) {
    console.error("キャンプ場パネルが見つかりません");
    return;
  }

  clearFacilityMarkers();

  selectedCampsite = null;
  selectedCampsiteMarker = null;
  currentFacilityResults = [];
  currentFacilityType = null;

  service.nearbySearch(
    {
      location: center,
      radius: 50000,
      type: "campground"
    },
    (results, status) => {

      if (
        status !==
        google.maps.places.PlacesServiceStatus.OK
      ) {
        panel.classList.remove("hidden");

        panelContent.innerHTML = `
          <h2>キャンプ場情報</h2>
          <p>キャンプ場が見つかりませんでした</p>
        `;

        return;
      }

      campsiteSearchResults = results.filter(
        campsite =>
          isCampsite(campsite) &&
          campsite.geometry &&
          campsite.geometry.location
      );

      campsiteSearchResults.forEach(campsite => {
        const marker = new google.maps.Marker({
          position: campsite.geometry.location,
          map: map,
          title: campsite.name,
          icon: getMarkerIcon("Camp-icon.png")
        });

        campsiteMarkers.push(marker);

        marker.addListener("click", () => {
          openCampsiteDetails(
          campsite,
            service
          );
        });
      });
    }
  );
}

function openCampsiteDetails(
  campsite,
  service
) {

  const panel =
    document.getElementById(
      "campsite-panel"
    );

  const panelContent =
    document.getElementById(
      "campsite-content"
    );

  if (!panel || !panelContent) {
    return;
  }

  selectedCampsite = campsite;

  const searchContainer =
    document.querySelector(
      ".search-container"
    );

  closeOnsenPanel();
  closeCampsiteImagePanel();
  closeWeatherPanel();

  panel.classList.remove("hidden");

  if (searchContainer) {
    searchContainer.classList.add(
      "campsite-open"
    );

    searchContainer.classList.remove(
      "onsen-open"
    );

    searchContainer.classList.remove(
      "campsite-image-open"
    );
  }

  const closeButton =
    document.getElementById(
      "close-campsite-panel"
    );

  if (closeButton) {
    closeButton.classList.remove(
      "hidden"
    );
  }

  setTimeout(() => {

    if (!map) {
      return;
    }

    const center = map.getCenter();

    google.maps.event.trigger(
      map,
      "resize"
    );

    map.setCenter(center);

  }, 0);

  service.getDetails(
    {
      placeId: campsite.place_id,

      fields: [
        "name",
        "formatted_address",
        "opening_hours",
        "website",
        "geometry",
        "photos",
        "place_id"
      ]
    },

    (place, status) => {

      if (
        status !==
        google.maps.places.PlacesServiceStatus.OK
      ) {

        panelContent.innerHTML = `
          <h2>キャンプ場情報</h2>
          <p>
            キャンプ場の詳細情報が取得できませんでした
          </p>
        `;

        return;
      }

      showSelectedCampsiteMarker(place);

      searchNearbyFacilities(
        place,
        service,
        "onsen"
      );
    }
  );
}

function searchNearbyFacilities(
  campsite,
  service,
  facilityType
) {
  const panelContent =
    document.getElementById(
      "campsite-content"
    );

  if (!panelContent) {
    return;
  }

  currentFacilityType = facilityType;

  const renderFacilityList = (
    facilities,
    title
  ) => {
    if (facilities.length === 0) {
      return `
        <h2>
          ${title}
        </h2>

        <p>
          近くに施設が見つかりませんでした
        </p>
      `;
    }

    let listHTML = `
      <h2>
        ${title}
      </h2>

      <div class="facility-list">
    `;

    facilities.forEach(facility => {
      const distanceKm =
        (
          facility.distance / 1000
        ).toFixed(1);

      listHTML += `
        <div
          class="facility-item detail-box"
          data-place-id="${facility.place_id}"
        >

          <h3>
            ${facility.name}
          </h3>

          <p>
            <strong>住所</strong>
          </p>

          <p>
            ${
              facility.vicinity ||
              "住所情報なし"
            }
          </p>

          <p>
            キャンプ場から約
            ${distanceKm} km
          </p>

        </div>
      `;
    });

    listHTML += `
      </div>
    `;

    return listHTML;
  };

  const renderCampsiteContent = (
    facilityListHTML,
    activeFacilityType
  ) => {
    panelContent.innerHTML = `
      <h2>
        キャンプ場情報
      </h2>

      <div class="detail-box">

        <h3>
          ${campsite.name}
        </h3>

        <p>
          <strong>住所</strong>
        </p>

        <p>
          ${
            campsite.formatted_address ||
            "情報なし"
          }
        </p>

        <p>
          <strong>営業時間</strong>
        </p>

        <p>
          ${
            campsite.opening_hours
              ? campsite.opening_hours.weekday_text.join("<br>")
              : "情報なし"
          }
        </p>

        <p>
          <strong>公式サイト</strong>
        </p>

        <p>
          ${
            campsite.website
              ? `<a href="${campsite.website}" target="_blank">ウェブサイトを見る</a>`
              : "情報なし"
          }
        </p>

        <button
          id="campsite-image-open-button"
          type="button"
          class="campsite-image-button"
        >
          キャンプ場の画像を見る
        </button>

        <button
          id="weather-open-button"
          type="button"
          class="campsite-image-button"
        >
          キャンプ場の天気を見る
        </button>

      </div>

      <div class="facility-tabs">

        <button
          type="button"
          class="facility-tab ${
            activeFacilityType === "onsen"
              ? "active"
              : ""
          }"
          data-facility-type="onsen"
        >
          温泉
        </button>

        <button
          type="button"
          class="facility-tab ${
            activeFacilityType === "commercial"
              ? "active"
              : ""
          }"
          data-facility-type="commercial"
        >
          商業施設
        </button>

      </div>

      <div id="facility-list">
        ${facilityListHTML}
      </div>
    `;

    setupCampsiteImageButton(
      campsite
    );

    setupWeatherButton(
      campsite
    );

    setupFacilityTabs(
      campsite,
      service
    );
  };

  if (facilityType === "onsen") {
    service.nearbySearch(
      {
        location:
          campsite.geometry.location,

        radius:
          FACILITY_SEARCH_RADIUS,

        keyword:
          "温泉"
      },

      (results, status) => {
        let topFacilities = [];

        if (
          status ===
            google.maps.places.PlacesServiceStatus.OK &&
          results &&
          results.length > 0
        ) {
          topFacilities =
            results
              .filter(
                facility =>
                  facility.geometry &&
                  facility.geometry.location
              )
              .map(facility => {
                const distance =
                  google.maps.geometry.spherical
                    .computeDistanceBetween(
                      campsite.geometry.location,
                      facility.geometry.location
                    );

                return {
                  ...facility,
                  distance
                };
              })
              .sort(
                (a, b) =>
                  a.distance - b.distance
              )
              .slice(
                0,
                FACILITY_RESULT_COUNT
              );
        }

        currentFacilityResults =
          topFacilities;

        const listHTML =
          renderFacilityList(
            topFacilities,
            "付近の温泉施設情報"
          );

        renderCampsiteContent(
          listHTML,
          "onsen"
        );

        showFacilityMarkers(
          topFacilities,
          campsite,
          "onsen"
        );

        setupFacilityClickEvents(
          topFacilities,
          service,
          campsite,
          "onsen"
        );
      }
    );

    return;
  }

  if (facilityType === "commercial") {
    searchCommercialFacilities(
      campsite,
      service,
      renderFacilityList,
      renderCampsiteContent
    );
  }
}

function searchCommercialFacilities(
  campsite,
  service,
  renderFacilityList,
  renderCampsiteContent
) {

  const searchPlace = placeType => {
    return new Promise(resolve => {
      service.nearbySearch(
        {
          location:
            campsite.geometry.location,

          radius:
            FACILITY_SEARCH_RADIUS,

          type: placeType
        },

        (results, status) => {
          if (
            status !==
            google.maps.places.PlacesServiceStatus.OK
          ) {
            resolve([]);
            return;
          }

          resolve(results || []);
        }
      );
    });
  };

  Promise.all([
    searchPlace("supermarket"),
    searchPlace("convenience_store")
  ]).then(
    ([supermarkets, convenienceStores]) => {
      const allFacilities = [
        ...supermarkets,
        ...convenienceStores
      ];

      const uniqueFacilities =
        Array.from(
          new Map(
            allFacilities
              .filter(
                facility => facility.place_id
              )
              .map(
                facility => [
                  facility.place_id,
                  facility
                ]
              )
          ).values()
        );

      const facilitiesWithDistance =
        uniqueFacilities
          .filter(
            facility =>
              facility.geometry &&
              facility.geometry.location
          )
          .map(facility => {
            const distance =
              google.maps.geometry.spherical
                .computeDistanceBetween(
                  campsite.geometry.location,
                  facility.geometry.location
                );

            return {
              ...facility,
              distance
            };
          })
          .sort(
            (a, b) =>
              a.distance - b.distance
          )
          .slice(
            0,
            FACILITY_RESULT_COUNT
          );

      const listHTML =
        renderFacilityList(
          facilitiesWithDistance,
          "付近の商業施設情報"
        );

      renderCampsiteContent(
        listHTML,
        "commercial"
      );

      showFacilityMarkers(
        facilitiesWithDistance,
        campsite,
        "commercial"
      );

      setupFacilityClickEvents(
        facilitiesWithDistance,
        service,
        campsite,
        "commercial"
      );
    }
  );
}

function setupFacilityTabs(
  campsite,
  service
) {
  const tabs =
    document.querySelectorAll(
      ".facility-tab"
    );

  tabs.forEach(tab => {
    tab.addEventListener(
      "click",
      () => {
        const facilityType =
          tab.getAttribute(
            "data-facility-type"
          );

        tabs.forEach(otherTab => {
          otherTab.classList.remove(
            "active"
          );
        });

        tab.classList.add(
          "active"
        );

        searchNearbyFacilities(
          campsite,
          service,
          facilityType
        );
      }
    );
  });
}

function setupCampsiteImageButton(
  campsite
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
        campsite
      );
    }
  );
}

function openCampsiteImagePanel(campsite) {
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
  closeWeatherPanel();

  imagePanel.classList.remove(
    "hidden"
  );

  searchContainer.classList.add(
    "campsite-image-open"
  );

  searchContainer.classList.remove(
    "onsen-open"
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

function formatDateLabel(dateString, index) {

  const date = new Date(dateString);

  const dayOfWeek = [
    "日",
    "月",
    "火",
    "水",
    "木",
    "金",
    "土"
  ][date.getDay()];

  const month = date.getMonth() + 1;
  const day = date.getDate();

  if (index === 0) {

    return `昨日${month}/${day}(${dayOfWeek})`;

  } else if (index === 1) {

    return `今日${month}/${day}(${dayOfWeek})`;

  } else if (index === 2) {

    return `明日${month}/${day}(${dayOfWeek})`;

  } else {

    return `${month}/${day}(${dayOfWeek})`;

  }
}

function getWeatherDescription(weatherCode) {

  const weatherDescriptions = {

    0: {
      description: "快晴",
      icon: "☀️"
    },

    1: {
      description: "晴れ",
      icon: "🌤️"
    },

    2: {
      description: "一部曇り",
      icon: "⛅"
    },

    3: {
      description: "曇り",
      icon: "☁️"
    },

    45: {
      description: "霧",
      icon: "🌫️"
    },

    48: {
      description: "霧",
      icon: "🌫️"
    },

    51: {
      description: "弱い霧雨",
      icon: "🌦️"
    },

    53: {
      description: "霧雨",
      icon: "🌦️"
    },

    55: {
      description: "強い霧雨",
      icon: "🌧️"
    },

    61: {
      description: "弱い雨",
      icon: "🌧️"
    },

    63: {
      description: "雨",
      icon: "🌧️"
    },

    65: {
      description: "強い雨",
      icon: "🌧️"
    },

    71: {
      description: "弱い雪",
      icon: "🌨️"
    },

    73: {
      description: "雪",
      icon: "❄️"
    },

    75: {
      description: "強い雪",
      icon: "❄️"
    },

    80: {
      description: "弱いにわか雨",
      icon: "🌦️"
    },

    81: {
      description: "にわか雨",
      icon: "🌧️"
    },

    82: {
      description: "強いにわか雨",
      icon: "🌧️"
    },

    85: {
      description: "弱いにわか雪",
      icon: "🌨️"
    },

    86: {
      description: "強いにわか雪",
      icon: "❄️"
    },

    95: {
      description: "雷雨",
      icon: "⛈️"
    },

    96: {
      description: "雷雨・ひょう",
      icon: "⛈️"
    },

    99: {
      description: "強い雷雨・ひょう",
      icon: "⛈️"
    }

  };

  return (
    weatherDescriptions[weatherCode] || {
      description: "天気情報なし",
      icon: "❓"
    }
  );
}

function setupWeatherButton(campsite) {

  const button =
    document.getElementById(
      "weather-open-button"
    );

  if (!button) {
    return;
  }

  button.addEventListener(
    "click",
    () => {

      openWeatherPanel(
        campsite
      );

    }
  );
}


function openWeatherPanel(campsite) {

  const searchContainer =
    document.querySelector(
      ".search-container"
    );

  const weatherPanel =
    document.getElementById(
      "weather-panel"
    );

  const weatherContent =
    document.getElementById(
      "weather-content"
    );

  const closeButton =
    document.getElementById(
      "close-weather-panel"
    );

  if (
    !searchContainer ||
    !weatherPanel ||
    !weatherContent
  ) {

    console.error(
      "天気パネルが見つかりません"
    );

    return;
  }

  closeOnsenPanel();
  closeCampsiteImagePanel();
  closeWeatherPanel();

  weatherPanel.classList.remove(
    "hidden"
  );

  searchContainer.classList.add(
    "weather-open"
  );

  fetchWeatherForecast(
    campsite
  );

  searchContainer.classList.remove(
    "onsen-open"
  );

  searchContainer.classList.remove(
    "campsite-image-open"
  );

  if (closeButton) {

    closeButton.classList.remove(
      "hidden"
    );
  }

  resizeMap();
}

async function fetchWeatherForecast(campsite) {

  const weatherContent =
    document.getElementById(
      "weather-content"
    );

  if (!weatherContent) {
    return;
  }

  if (
    !campsite.geometry ||
    !campsite.geometry.location
  ) {

    weatherContent.innerHTML = `
      <h2>キャンプ場の天気</h2>

      <p>
        キャンプ場の位置情報を取得できませんでした。
      </p>
    `;

    return;
  }

  const latitude =
    campsite.geometry.location.lat();

  const longitude =
    campsite.geometry.location.lng();

  weatherContent.innerHTML = `
    <h2>キャンプ場の天気</h2>

    <div class="weather-loading">
      <p>天気情報を取得中です。</p>
    </div>
  `;

  try {

    const url =
      "https://api.open-meteo.com/v1/forecast" +
      `?latitude=${latitude}` +
      `&longitude=${longitude}` +
      "&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max" +
      "&timezone=Asia%2FTokyo" +
      "&past_days=1" +
      "&forecast_days=7";

    const response =
      await fetch(url);

    if (!response.ok) {

      throw new Error(
        `Open-Meteo API error: ${response.status}`
      );

    }

    const data =
      await response.json();

    if (
      !data.daily ||
      !data.daily.time ||
      data.daily.time.length === 0
    ) {

      throw new Error(
        "天気予報データが取得できませんでした"
      );

    }

    let weatherListHTML = "";

    data.daily.time.forEach(
      (date, index) => {

        const weatherCode =
          data.daily.weather_code[index];

        const maxTemperature =
          data.daily.temperature_2m_max[index];

        const minTemperature =
          data.daily.temperature_2m_min[index];

        const precipitationProbability =
          data.daily.precipitation_probability_max[index];

        const weather =
          getWeatherDescription(
            weatherCode
          );

        weatherListHTML += `
          <div class="detail-box">
            <h3>
              ${formatDateLabel(date, index)}
            </h3>

            <p>
              <strong>天気</strong>
            </p>

            <p>
              ${weather.icon}
              ${weather.description}
            </p>

            <p>
              <strong>最高気温</strong>
            </p>

            <p>
              ${
                maxTemperature !== null &&
                maxTemperature !== undefined
                  ? `${maxTemperature}℃`
                  : "情報なし"
              }
            </p>

            <p>
              <strong>最低気温</strong>
            </p>

            <p>
              ${
                minTemperature !== null &&
                minTemperature !== undefined
                  ? `${minTemperature}℃`
                  : "情報なし"
              }
            </p>

            <p>
              <strong>降水確率</strong>
            </p>

            <p>
              ${
                precipitationProbability !== null &&
                precipitationProbability !== undefined
                  ? `${precipitationProbability}%`
                  : "情報なし"
              }
            </p>

          </div>

        `;
      }
    );

    weatherContent.innerHTML = `

      <h2>キャンプ場の天気</h2>

      <div class="detail-box">

        <h3>
          ${campsite.name}
        </h3>

        <p>
          前日と１週間分の天気情報です。
        </p>

      </div>

      ${weatherListHTML}

    `;

  } catch (error) {

    console.error(
      "天気予報の取得に失敗しました:",
      error
    );

    weatherContent.innerHTML = `

      <h2>キャンプ場の天気</h2>

      <div class="detail-box">

        <h3>
          ${campsite.name}
        </h3>

        <p>
          天気予報を取得できませんでした。
        </p>

        <p>
          時間をおいてもう一度お試しください。
        </p>

      </div>

    `;
  }
}

function closeCampsiteImagePanel() {

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

function closeWeatherPanel() {

  const searchContainer =
    document.querySelector(
      ".search-container"
    );

  const weatherPanel =
    document.getElementById(
      "weather-panel"
    );

  const weatherContent =
    document.getElementById(
      "weather-content"
    );

  const closeButton =
    document.getElementById(
      "close-weather-panel"
    );

  if (searchContainer) {

    searchContainer.classList.remove(
      "weather-open"
    );

  }

  if (weatherPanel) {

    weatherPanel.classList.add(
      "hidden"
    );

  }

  if (closeButton) {

    closeButton.classList.add(
      "hidden"
    );

  }

  if (weatherContent) {

    weatherContent.innerHTML = `

      <h2>
        キャンプ場の天気
      </h2>

      <p>
        天気予報を表示するには
        ボタンを押してください
      </p>

    `;

  }

  resizeMap();
}

function openFacilityDetails(
  facility,
  service,
  campsite,
  facilityType
) {
  clearFacilityMarkers();
  if (selectedCampsiteMarker) {
    selectedCampsiteMarker.setMap(map);
  }

  service.getDetails(
    {
      placeId: facility.place_id,

      fields: [
        "name",
        "formatted_address",
        "opening_hours",
        "website",
        "geometry",
        "place_id"
      ]
    },

    async (place, status) => {
      if (
        status !==
          google.maps.places.PlacesServiceStatus.OK ||
        !place
      ) {
        console.error(
          "施設の詳細情報が取得できませんでした"
        );

        return;
      }

      clearFacilityMarkers();

      if (selectedCampsiteMarker) {
        selectedCampsiteMarker.setMap(map);
      }

      const facilityMarker =
        new google.maps.Marker({
          position: place.geometry.location,
          map: map,
          title: place.name,
          icon: getMarkerIcon(
            facilityType === "onsen"
              ? "Onsen-icon.png"
              : "Shop-icon.png"
          )
        });

      facilityMarker.addListener(
        "click",
        () => {
          openFacilityDetails(
            place,
            service,
            campsite,
            facilityType
          );
        }
      );

      facilityMarkers.push(
        facilityMarker
      );

      const searchContainer =
        document.querySelector(
          ".search-container"
        );

      const onsenPanel =
        document.getElementById(
          "onsen-panel"
        );

      const onsenContent =
        document.getElementById(
          "onsen-content"
        );

      if (
        !onsenPanel ||
        !onsenContent
      ) {
        return;
      }

      closeCampsiteImagePanel();
      closeWeatherPanel();

      onsenPanel.classList.remove(
        "hidden"
      );

      if (searchContainer) {
        searchContainer.classList.add(
          "onsen-open"
        );

        searchContainer.classList.remove(
          "campsite-image-open"
        );
      }

      const closeOnsenButton =
        document.getElementById(
          "close-onsen-panel"
        );

      if (closeOnsenButton) {
        closeOnsenButton.classList.remove(
          "hidden"
        );
      }

      resizeMap();

      let routeInfo = null;

      try {
        routeInfo =
          await fetchRouteInfo(
            campsite,
            place
          );
      } catch (error) {
        console.error(
          "ルート情報の取得に失敗しました:",
          error
        );
      }

      const title =
        facilityType === "onsen"
          ? "温泉施設情報"
          : "商業施設情報";

      onsenContent.innerHTML = `
        <h2>
          ${title}
        </h2>

        <div class="detail-box">

          <h3>
            ${place.name}
          </h3>

          <p>
            <strong>住所</strong>
          </p>

          <p>
            ${
              place.formatted_address ||
              "情報なし"
            }
          </p>

          <p>
            <strong>営業時間</strong>
          </p>

          <p>
            ${
              place.opening_hours
                ? place.opening_hours.weekday_text.join("<br>")
                : "情報なし"
            }
          </p>

          <p>
            <strong>
              キャンプ場からの距離
            </strong>
          </p>

          <p>
            ${
              routeInfo
                ? formatRouteDistance(
                    routeInfo.distance_meters
                  )
                : "取得できませんでした"
            }
          </p>

          <p>
            <strong>
              車での所要時間
            </strong>
          </p>

          <p>
            ${
              routeInfo
                ? formatRouteDuration(
                    routeInfo.duration
                  )
                : "取得できませんでした"
            }
          </p>

          <p>
            <strong>
              公式サイト
            </strong>
          </p>

          <p>
            ${
              place.website
                ? `<a href="${place.website}" target="_blank">ウェブサイトを見る</a>`
                : "情報なし"
            }
          </p>

          ${
            facilityType === "onsen"
              ? `
                <button
                  id="favorite-toggle-button"
                  type="button"
                >
                  キャンプ場・温泉情報を保存
                </button>
              `
              : ""
          }

        </div>
      `;

      if (facilityType === "onsen") {
        setupFavoriteButton(
          campsite.place_id,
          place.place_id
        );
      }
    }
  );
}

function setupFacilityClickEvents(
  facilities,
  service,
  campsite,
  facilityType
) {
  const facilityItems =
    document.querySelectorAll(
      ".facility-item"
    );

  facilityItems.forEach(item => {
    item.addEventListener(
      "click",
      () => {
        const placeId =
          item.getAttribute(
            "data-place-id"
          );

        const selectedFacility =
          facilities.find(
            facility =>
              facility.place_id === placeId
          );

        if (!selectedFacility) {
          return;
        }

        openFacilityDetails(
          selectedFacility,
          service,
          campsite,
          facilityType
        );
      }
    );
  });
}

function resizeMap() {

  setTimeout(() => {

    if (!map) {
      return;
    }

    const center =
      map.getCenter();

    google.maps.event.trigger(
      map,
      "resize"
    );

    map.setCenter(
      center
    );

  }, 0);
}

function renderFavoriteCampsitePanel(
  campsite
) {
  const searchContainer =
    document.querySelector(
      ".search-container"
    );

  const panel =
    document.getElementById(
      "campsite-panel"
    );

  const panelContent =
    document.getElementById(
      "campsite-content"
    );

  const closeButton =
    document.getElementById(
      "close-campsite-panel"
    );

  if (
    !searchContainer ||
    !panel ||
    !panelContent
  ) {
    console.error(
      "お気に入りのキャンプ場パネルが見つかりません"
    );

    return;
  }

  panel.classList.remove(
    "hidden"
  );

  searchContainer.classList.add(
    "campsite-open"
  );

  if (closeButton) {
    closeButton.classList.remove(
      "hidden"
    );
  }

  panelContent.innerHTML = `
    <h2>
      キャンプ場情報
    </h2>

    <div class="detail-box">

      <h3>
        ${campsite.name}
      </h3>

      <p>
        <strong>住所</strong>
      </p>

      <p>
        ${
          campsite.formatted_address ||
          "情報なし"
        }
      </p>

      <p>
        <strong>営業時間</strong>
      </p>

      <p>
        ${
          campsite.opening_hours
            ? campsite.opening_hours.weekday_text.join("<br>")
            : "情報なし"
        }
      </p>

      <p>
        <strong>公式サイト</strong>
      </p>

      <p>
        ${
          campsite.website
            ? `<a href="${campsite.website}" target="_blank">ウェブサイトを見る</a>`
            : "情報なし"
        }
      </p>

      <button
        id="campsite-image-open-button"
        type="button"
        class="campsite-image-button"
      >
        キャンプ場の画像を見る
      </button>

      <button
        id="weather-open-button"
        type="button"
        class="campsite-image-button"
      >
        キャンプ場の天気を見る
      </button>

    </div>
  `;

  setupCampsiteImageButton(
    campsite
  );

  setupWeatherButton(
    campsite
  );
}


async function renderFavoriteOnsenPanel(
  campsite,
  onsen
) {
  const searchContainer =
    document.querySelector(
      ".search-container"
    );

  const panel =
    document.getElementById(
      "onsen-panel"
    );

  const content =
    document.getElementById(
      "onsen-content"
    );

  const closeButton =
    document.getElementById(
      "close-onsen-panel"
    );

  if (
    !searchContainer ||
    !panel ||
    !content
  ) {
    console.error(
      "お気に入りの温泉パネルが見つかりません"
    );

    return;
  }

  panel.classList.remove(
    "hidden"
  );

  searchContainer.classList.add(
    "onsen-open"
  );

  if (closeButton) {
    closeButton.classList.remove(
      "hidden"
    );
  }

  content.innerHTML = `
    <h2>
      温泉施設情報
    </h2>

    <div class="detail-box">
      <h3>
        ${onsen.name}
      </h3>

      <p>
        <strong>住所</strong>
      </p>

      <p>
        ${
          onsen.formatted_address ||
          "情報なし"
        }
      </p>

      <p>
        <strong>営業時間</strong>
      </p>

      <p>
        ${
          onsen.opening_hours
            ? onsen.opening_hours.weekday_text.join("<br>")
            : "情報なし"
        }
      </p>

      <p>
        <strong>
          キャンプ場からの距離
        </strong>
      </p>

      <p id="favorite-route-distance">
        取得中です...
      </p>

      <p>
        <strong>
          車での所要時間
        </strong>
      </p>

      <p id="favorite-route-duration">
        取得中です...
      </p>

      <p>
        <strong>
          公式サイト
        </strong>
      </p>

      <p>
        ${
          onsen.website
            ? `<a href="${onsen.website}" target="_blank">ウェブサイトを見る</a>`
            : "情報なし"
        }
      </p>

      <button
        id="favorite-toggle-button"
        type="button"
      >
        キャンプ場・温泉情報を保存
      </button>

    </div>
  `;

  setupFavoriteButton(
    campsite.place_id,
    onsen.place_id
  );

  try {
    const routeInfo =
      await fetchRouteInfo(
        campsite,
        onsen
      );

    const distanceElement =
      document.getElementById(
        "favorite-route-distance"
      );

    const durationElement =
      document.getElementById(
        "favorite-route-duration"
      );

    if (distanceElement) {
      distanceElement.textContent =
        formatRouteDistance(
          routeInfo.distance_meters
        );
    }

    if (durationElement) {
      durationElement.textContent =
        formatRouteDuration(
          routeInfo.duration
        );
    }
  } catch (error) {
    console.error(
      "お気に入りの温泉施設のルート情報取得に失敗しました:",
      error
    );

    const distanceElement =
      document.getElementById(
        "favorite-route-distance"
      );

    const durationElement =
      document.getElementById(
        "favorite-route-duration"
      );

    if (distanceElement) {
      distanceElement.textContent =
        "取得できませんでした";
    }

    if (durationElement) {
      durationElement.textContent =
        "取得できませんでした";
    }
  }
}


function openFavoriteOnsenDetails(
  onsen,
  campsite
) {
  renderFavoriteOnsenPanel(
    campsite,
    onsen
  );
}


function showFavoritePanels(
  campsite,
  onsen
) {
  if (!campsite || !onsen) {
    console.error(
      "お気に入りの施設情報が揃っていません"
    );

    return;
  }

  renderFavoriteCampsitePanel(
    campsite
  );

  renderFavoriteOnsenPanel(
    campsite,
    onsen
  );

  resizeMap();
}


function showFavoritePlaces(
  campsitePlaceId,
  onsenPlaceId
) {
  if (!map) {
    console.error(
      "Google Mapsがまだ初期化されていません"
    );

    return;
  }

  clearCampsiteMarkers();

  const service =
    new google.maps.places.PlacesService(
      map
    );

  const bounds =
    new google.maps.LatLngBounds();

  let campsitePlace = null;
  let onsenPlace = null;

  let completedCount = 0;

  const handleCompleted = () => {
    completedCount += 1;

    if (completedCount !== 2) {
      return;
    }

    if (!campsitePlace || !onsenPlace) {
      console.error(
        "お気に入りの施設情報を取得できませんでした"
      );

      return;
    }

    if (!bounds.isEmpty()) {
      map.fitBounds(bounds);
    }

    showFavoritePanels(
      campsitePlace,
      onsenPlace
    );
  };

  service.getDetails(
    {
      placeId:
        campsitePlaceId,

      fields: [
        "name",
        "formatted_address",
        "opening_hours",
        "website",
        "geometry",
        "place_id"
      ]
    },

    (place, status) => {
      if (
        status !==
          google.maps.places.PlacesServiceStatus.OK ||
        !place ||
        !place.geometry ||
        !place.geometry.location
      ) {
        console.error(
          "お気に入りのキャンプ場情報を取得できませんでした:",
          status
        );

        handleCompleted();

        return;
      }

      campsitePlace =
        place;

      const marker =
        new google.maps.Marker({
          position:
            place.geometry.location,

          map:
            map,

          title:
            place.name,

          icon:
            getMarkerIcon("Camp-icon.png")
        });

      campsiteMarkers.push(
        marker
      );

      marker.addListener(
        "click",
        () => {
          openCampsiteDetails(
            place,
            service
          );
        }
      );

      bounds.extend(
        place.geometry.location
      );

      handleCompleted();
    }
  );

  service.getDetails(
    {
      placeId:
        onsenPlaceId,

      fields: [
        "name",
        "formatted_address",
        "opening_hours",
        "website",
        "geometry",
        "place_id"
      ]
    },

    (place, status) => {
      if (
        status !==
          google.maps.places.PlacesServiceStatus.OK ||
        !place ||
        !place.geometry ||
        !place.geometry.location
      ) {
        console.error(
          "お気に入りの温泉施設情報を取得できませんでした:",
          status
        );

        handleCompleted();

        return;
      }

      onsenPlace =
        place;

      const marker =
        new google.maps.Marker({
          position:
            place.geometry.location,

          map:
            map,

          title:
            place.name,

          icon:
            getMarkerIcon("Onsen-icon.png")
        });

      campsiteMarkers.push(
        marker
      );

      marker.addListener(
        "click",
        () => {
          openFavoriteOnsenDetails(
            place,
            campsitePlace
          );
        }
      );

      bounds.extend(
        place.geometry.location
      );

      handleCompleted();
    }
  );
}

function initMap() {

  const center =
    window.searchCenter || {
      lat: 35.681236,
      lng: 139.767125
    };

  const mapElement =
    document.getElementById(
      "map"
    );

  if (
    !mapElement ||
    typeof google === "undefined" ||
    !google.maps
  ) {
    console.error(
      "map element not found or Google Maps API not loaded"
    );

    return;
  }

  map =
    new google.maps.Map(
      mapElement,
      {
        zoom: 8,
        center: center
      }
    );

  const params =
    new URLSearchParams(
      window.location.search
    );

  const campsitePlaceId =
    params.get(
      "campsite_place_id"
    );

  const onsenPlaceId =
    params.get(
      "onsen_place_id"
    );

  if (
    campsitePlaceId &&
    onsenPlaceId
  ) {
    showFavoritePlaces(
      campsitePlaceId,
      onsenPlaceId
    );

    return;
  }

  searchCampsites(
    center
  );
}

function setupCloseButtons() {

  const closeButton =
    document.getElementById(
      "close-campsite-panel"
    );

  if (closeButton) {

    closeButton.replaceWith(
      closeButton.cloneNode(true)
    );

    const newCloseButton =
      document.getElementById(
        "close-campsite-panel"
      );

    newCloseButton.addEventListener(
      "click",
      () => {

        const searchContainer =
          document.querySelector(
            ".search-container"
          );

        if (searchContainer) {
          searchContainer.classList.remove(
            "campsite-open"
          );

          searchContainer.classList.remove(
            "onsen-open"
          );

          searchContainer.classList.remove(
            "campsite-image-open"
          );

          searchContainer.classList.remove(
            "weather-open"
          );
        }

        const campsitePanel =
          document.getElementById(
            "campsite-panel"
          );

        if (campsitePanel) {
          campsitePanel.classList.add(
            "hidden"
          );
        }

        newCloseButton.classList.add(
          "hidden"
        );

        closeOnsenPanel();
        closeCampsiteImagePanel();
        closeWeatherPanel();

        const panelContent =
          document.getElementById(
            "campsite-content"
          );

        if (panelContent) {
          panelContent.innerHTML = `
            <h2>キャンプ場情報</h2>
            <p>キャンプ場を選択してください</p>
          `;
        }

        showCampsiteSearchMarkers();

        resizeMap();
      }
    );
  }

  const closeOnsenButton =
    document.getElementById(
      "close-onsen-panel"
    );

  if (closeOnsenButton) {

    closeOnsenButton.replaceWith(
      closeOnsenButton.cloneNode(true)
    );

    const newCloseOnsenButton =
      document.getElementById(
        "close-onsen-panel"
      );

    newCloseOnsenButton.addEventListener(
      "click",
      () => {

        closeOnsenPanel();
        closeWeatherPanel();

        restoreSelectedCampsiteAndFacilities();

        resizeMap();
      }
    );
  }

  const closeImageButton =
    document.getElementById(
      "close-campsite-image-panel"
    );

  if (closeImageButton) {

    closeImageButton.replaceWith(
      closeImageButton.cloneNode(true)
    );

    const newCloseImageButton =
      document.getElementById(
        "close-campsite-image-panel"
      );

    newCloseImageButton.addEventListener(
      "click",
      () => {

        closeCampsiteImagePanel();
        closeWeatherPanel();

        restoreSelectedCampsiteAndFacilities();

        resizeMap();
      }
    );
  }

  const closeWeatherButton =
    document.getElementById(
      "close-weather-panel"
    );

  if (closeWeatherButton) {

    closeWeatherButton.replaceWith(
      closeWeatherButton.cloneNode(true)
    );

    const newCloseWeatherButton =
      document.getElementById(
        "close-weather-panel"
      );

    newCloseWeatherButton.addEventListener(
      "click",
      () => {

        closeWeatherPanel();

        restoreSelectedCampsiteAndFacilities();

        resizeMap();
      }
    );
  }
}

function closeOnsenPanel() {

  const searchContainer =
    document.querySelector(
      ".search-container"
    );

  const onsenPanel =
    document.getElementById(
      "onsen-panel"
    );

  const onsenContent =
    document.getElementById(
      "onsen-content"
    );

  const closeOnsenButton =
    document.getElementById(
      "close-onsen-panel"
    );


  if (searchContainer) {

    searchContainer.classList.remove(
      "onsen-open"
    );
  }


  if (onsenPanel) {

    onsenPanel.classList.add(
      "hidden"
    );
  }


  if (closeOnsenButton) {

    closeOnsenButton.classList.add(
      "hidden"
    );
  }


  if (onsenContent) {

    onsenContent.innerHTML = `
      <h2>温泉施設情報</h2>
      <p>温泉を選択してください</p>
    `;
  }
}

function setupCurrentLocationButton() {

  const button =
    document.getElementById(
      "current-location-button"
    );


  if (!button) {
    return;
  }


  button.replaceWith(
    button.cloneNode(true)
  );


  const newButton =
    document.getElementById(
      "current-location-button"
    );


  newButton.addEventListener(
    "click",
    () => {

      if (!navigator.geolocation) {

        alert(
          "このブラウザでは現在地を取得できません。"
        );

        return;
      }


      newButton.disabled = true;
      
      navigator.geolocation.getCurrentPosition(

        position => {

          const currentLocation = {
            lat:
              position.coords.latitude,

            lng:
              position.coords.longitude
          };


          const accuracy =
            position.coords.accuracy;

          if (accuracy > 5000) {

            alert(
              `現在地の取得精度が低いため、正確な位置ではない可能性があります。\n` +
              `推定誤差：約${Math.round(
                accuracy / 1000
              )}km`
            );
          }


          if (!map) {

            console.error(
              "Google Mapsがまだ初期化されていません"
            );

            newButton.disabled = false;

            return;
          }


          map.setCenter(
            currentLocation
          );


          map.setZoom(
            15
          );


          if (currentLocationMarker) {

            currentLocationMarker.setMap(
              null
            );
          }


          currentLocationMarker =
            new google.maps.Marker({
              position:
                currentLocation,

              map:
                map,

              title:
                "現在地"
            });

          searchCampsites(
            currentLocation
          );

          const searchContainer =
            document.querySelector(
              ".search-container"
            );


          if (searchContainer) {

            searchContainer.classList.remove(
              "campsite-open"
            );

            searchContainer.classList.remove(
              "onsen-open"
            );

            searchContainer.classList.remove(
              "campsite-image-open"
            );

            searchContainer.classList.remove(
              "weather-open"
            );
          }


          const campsitePanel =
            document.getElementById(
              "campsite-panel"
            );


          if (campsitePanel) {

            campsitePanel.classList.add(
              "hidden"
            );
          }


          const onsenPanel =
            document.getElementById(
              "onsen-panel"
            );


          if (onsenPanel) {

            onsenPanel.classList.add(
              "hidden"
            );
          }


          const imagePanel =
            document.getElementById(
              "campsite-image-panel"
            );


          if (imagePanel) {

            imagePanel.classList.add(
              "hidden"
            );
          }

          const weatherPanel =
            document.getElementById(
              "weather-panel"
            );

          if (weatherPanel) {

            weatherPanel.classList.add(
              "hidden"
            );
          }

          const closeCampsiteButton =
            document.getElementById(
              "close-campsite-panel"
            );


          if (closeCampsiteButton) {

            closeCampsiteButton.classList.add(
              "hidden"
            );
          }


          const closeOnsenButton =
            document.getElementById(
              "close-onsen-panel"
            );


          if (closeOnsenButton) {

            closeOnsenButton.classList.add(
              "hidden"
            );
          }


          const closeImageButton =
            document.getElementById(
              "close-campsite-image-panel"
            );


          if (closeImageButton) {

            closeImageButton.classList.add(
              "hidden"
            );
          }

          const closeWeatherButton =
            document.getElementById(
              "close-weather-panel"
            );

          if (closeWeatherButton) {

            closeWeatherButton.classList.add(
              "hidden"
            );
          }

          newButton.disabled = false;
        },


        error => {

          console.error(
            "現在地を取得できませんでした:",
            error
          );


          let message =
            "現在地を取得できませんでした。";


          switch (error.code) {

            case error.PERMISSION_DENIED:

              message =
                "位置情報の使用が拒否されています。ブラウザの位置情報設定を確認してください。";

              break;


            case error.POSITION_UNAVAILABLE:

              message =
                "現在地を取得できませんでした。GPSや位置情報サービスを確認してください。";

              break;


            case error.TIMEOUT:

              message =
                "現在地の取得がタイムアウトしました。もう一度お試しください。";

              break;
          }


          alert(
            message
          );


          newButton.disabled = false;
        },


        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    }
  );
}

function setupMapPage() {

  const mapElement =
    document.getElementById(
      "map"
    );


  if (!mapElement) {
    return;
  }


  if (
    typeof google !== "undefined" &&
    google.maps
  ) {

    initMap();

  } else {

    const checkGoogleMaps =
      setInterval(
        () => {

          if (
            typeof google !== "undefined" &&
            google.maps
          ) {

            clearInterval(
              checkGoogleMaps
            );

            initMap();
          }

        },
        100
      );
  }


  setupCloseButtons();

  setupCurrentLocationButton();
}

document.addEventListener(
  "turbo:load",
  () => {
    setupMapPage();
  }
);

document.addEventListener(
  "DOMContentLoaded",
  () => {
    setupMapPage();
  }
);

async function fetchRouteInfo(campsite, onsen) {
  if (
    !campsite ||
    !campsite.geometry ||
    !campsite.geometry.location ||
    !onsen ||
    !onsen.geometry ||
    !onsen.geometry.location
  ) {
    throw new Error("ルート計算に必要な位置情報がありません");
  }

  const originLat =
    campsite.geometry.location.lat();

  const originLng =
    campsite.geometry.location.lng();

  const destinationLat =
    onsen.geometry.location.lat();

  const destinationLng =
    onsen.geometry.location.lng();

  const url =
    `/routes/calculate` +
    `?origin_lat=${encodeURIComponent(originLat)}` +
    `&origin_lng=${encodeURIComponent(originLng)}` +
    `&destination_lat=${encodeURIComponent(destinationLat)}` +
    `&destination_lng=${encodeURIComponent(destinationLng)}`;

  const response = await fetch(url, {
    headers: {
      Accept: "application/json"
    }
  });

  if (!response.ok) {
    throw new Error(
      `ルート情報の取得に失敗しました: ${response.status}`
    );
  }

  const data = await response.json();

  if (
    data.distance_meters === undefined ||
    data.duration === undefined
  ) {
    throw new Error(
      "ルート情報のレスポンスが不正です"
    );
  }

  return data;
}

function formatRouteDuration(duration) {
  if (!duration) {
    return "情報なし";
  }

  const seconds =
    parseInt(
      duration.replace("s", ""),
      10
    );

  if (Number.isNaN(seconds)) {
    return "情報なし";
  }

  const minutes =
    Math.round(seconds / 60);

  if (minutes < 60) {
    return `約${minutes}分`;
  }

  const hours =
    Math.floor(minutes / 60);

  const remainingMinutes =
    minutes % 60;

  if (remainingMinutes === 0) {
    return `約${hours}時間`;
  }

  return `約${hours}時間${remainingMinutes}分`;
}

function formatRouteDistance(distanceMeters) {
  if (
    distanceMeters === undefined ||
    distanceMeters === null
  ) {
    return "情報なし";
  }

  if (distanceMeters < 1000) {
    return `約${Math.round(distanceMeters)} m`;
  }

  return `約${(distanceMeters / 1000).toFixed(1)} km`;
}

function setupFavoriteButton(
  campsitePlaceId,
  onsenPlaceId
) {
  const button =
    document.getElementById(
      "favorite-toggle-button"
    );

  if (!button) {
    return;
  }

  const csrfToken =
    document
      .querySelector('meta[name="csrf-token"]')
      ?.getAttribute("content");

  if (!csrfToken) {
    console.error(
      "CSRFトークンが取得できませんでした"
    );

    return;
  }

  const updateButton = saved => {
    button.textContent = saved
      ? "キャンプ場・温泉情報を削除"
      : "キャンプ場・温泉情報を保存";
  };

  const checkFavorite = async () => {
    try {
      const params =
        new URLSearchParams({
          campsite_place_id:
            campsitePlaceId,
          onsen_place_id:
            onsenPlaceId
        });

      const response = await fetch(
        `/favorites/check?${params.toString()}`,
        {
          headers: {
            Accept:
              "application/json"
          }
        }
      );

      if (!response.ok) {
        throw new Error(
          `お気に入り状態の取得に失敗しました: ${response.status}`
        );
      }

      const data =
        await response.json();

      updateButton(data.saved);
    } catch (error) {
      console.error(
        "お気に入り状態の取得に失敗しました:",
        error
      );
    }
  };

  button.addEventListener(
    "click",
    async () => {
      button.disabled = true;

      try {
        const response = await fetch(
          "/favorites",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
              "Accept":
                "application/json",
              "X-CSRF-Token": csrfToken
            },
            body: JSON.stringify({
              campsite_place_id:
                campsitePlaceId,
              onsen_place_id:
                onsenPlaceId
            })
          }
        );

        if (!response.ok) {
          throw new Error(
            `お気に入り処理に失敗しました: ${response.status}`
          );
        }

        const data =
          await response.json();

        updateButton(data.saved);
      } catch (error) {
        console.error(
          "お気に入り処理に失敗しました:",
          error
        );

        alert(
          "お気に入りの処理に失敗しました。"
        );
      } finally {
        button.disabled = false;
      }
    }
  );

  checkFavorite();
}
