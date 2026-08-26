let map;

function initMap() {

  const center = window.searchCenter || {
    lat: 35.681236,
    lng: 139.767125
  };

  const mapElement = document.getElementById("map");

  if (mapElement && typeof google !== "undefined" && google.maps) {
    map = new google.maps.Map(mapElement, {
      zoom: 8,
      center: center
    });

    const service = new google.maps.places.PlacesService(map);

    const isCampsite = (place) => {
      const name = place.name || '';

      const excludeWords = ['株式会社', '会社', 'ラボラトリー', 'オペレーション', '小貝川リバーサイドパーク', '生牧草専門 中央牧草センター'];
      const hasExcludeWord = excludeWords.some(word => name.includes(word));

      if (hasExcludeWord) {
        return false;
      }

      return true;
    };

    const panel = document.getElementById("campsite-panel");
    const onsenPanel = document.getElementById("onsen-panel");
    const panelContent = document.getElementById("campsite-content");

    service.nearbySearch(
      {
        location: center,
        radius: 50000,
        type: "campground"
      },
      (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {

          results.forEach((campsite) => {

            if (!isCampsite(campsite)) {
              return;
            }

            const marker = new google.maps.Marker({
              position: campsite.geometry.location,
              map: map,
              title: campsite.name
            });

            marker.addListener("click", () => {

              const searchContainer = document.querySelector(".search-container");
              panel.classList.remove("hidden");
              searchContainer.classList.add("campsite-open");

              setTimeout(() => {
                const center = map.getCenter();
                google.maps.event.trigger(map, "resize");
                map.setCenter(center);
              }, 0);

              const closeButton = document.getElementById('close-campsite-panel');
              closeButton.classList.remove('hidden');

              service.getDetails(
                {
                  placeId: campsite.place_id,
                  fields: ["name", "formatted_address", "opening_hours", "website", "geometry"]
                },
                (place, status) => {
                  if (status === google.maps.places.PlacesServiceStatus.OK) {
                    service.nearbySearch(
                      { location: place.geometry.location, radius: 10000, keyword: "温泉" },
                      (results, status) => {
                        let onsenListHTML = '';
                        let topThreeOnsens = [];
                        if (status === google.maps.places.PlacesServiceStatus.OK && results.length > 0) {
                          const resultsWithDistance = results.map(onsen => {
                            const distanceInMeters = google.maps.geometry.spherical.computeDistanceBetween(
                              place.geometry.location,
                              onsen.geometry.location
                            );
                            return {
                              ...onsen,
                              distance: distanceInMeters
                            };
                          });
                          const sortedResults = resultsWithDistance.sort((a, b) => a.distance - b.distance);
                          topThreeOnsens = sortedResults.slice(0, 3);
                          onsenListHTML = '<h2>付近の温泉施設情報</h2><ul class="onsen-list">';
                          topThreeOnsens.forEach((onsen) => {
                            const distanceKm = (onsen.distance / 1000).toFixed(1);
                            onsenListHTML += `
                              <div class="onsen-item detail-box" data-place-id="${onsen.place_id}">
                                <h3>${onsen.name}</h3>
                                <p><strong>住所</strong></p>
                                <p class="onsen-address">${onsen.vicinity || "住所情報なし"}</p>
                                <p class="onsen-distance">キャンプ場から約 ${distanceKm} km</p>
                              </div>
                            `;
                          });
                        } else {
                          onsenListHTML = '<p>近くに温泉が見つかりませんでした</p>';
                        }

                        panelContent.innerHTML = `
                          <h2>キャンプ場情報</h2>
                          <div class="detail-box">
                            <h3>${place.name}</h3>
                            <p><strong>住所</strong></p>
                            <p>${place.formatted_address || "情報なし"}</p>
                            <p><strong>営業時間</strong></p>
                            <p>${place.opening_hours ? place.opening_hours.weekday_text.join("<br>") : "情報なし"}</p>
                            <p><strong>公式サイト</strong></p>
                            <p>${place.website ? `<a href="${place.website}" target="_blank">ウェブサイトを見る</a>` : "情報なし"}</p>
                          </div>
                          ${onsenListHTML}
                        `;

                        if (topThreeOnsens.length > 0) {
                          setupOnsenClickEvents(topThreeOnsens);
                        }
                      }
                    );
                  } else {

                    panelContent.innerHTML = `
                      <h2>キャンプ場情報</h2>
                      <p>キャンプ場の詳細情報が取得できませんでした</p>
                    `;
                  }
                }
              );
            });
          });
        } else {

          panel.classList.remove("hidden");
          panelContent.innerHTML = `
            <h2>キャンプ場情報</h2>
            <p>キャンプ場が見つかりませんでした</p>
          `;
        }
      }
    );

function setupOnsenClickEvents(onsens) {
  const onsenItems = document.querySelectorAll('.onsen-item');

  onsenItems.forEach((item) => {
    item.addEventListener('click', () => {
      const placeId = item.getAttribute('data-place-id');
      const selectedOnsen = onsens.find(onsen => onsen.place_id === placeId);

      if (selectedOnsen) {
        service.getDetails(
          {
            placeId: selectedOnsen.place_id,
            fields: ["name", "formatted_address", "opening_hours", "website"]
          },
          (place, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK) {

              const searchContainer = document.querySelector(".search-container");
              onsenPanel.classList.remove("hidden");
              searchContainer.classList.add("onsen-open");

              setTimeout(() => {
                const center = map.getCenter();
                google.maps.event.trigger(map, "resize");
                map.setCenter(center);
              }, 0);

              const closeOnsenButton = document.getElementById('close-onsen-panel');
              closeOnsenButton.classList.remove('hidden');

              const onsenContent = document.getElementById('onsen-content');
              onsenContent.innerHTML = `
                <h2>温泉施設情報</h2>
                <div class="detail-box">
                  <h3>${place.name}</h3>
                  <p><strong>住所</strong></p>
                  <p>${place.formatted_address || "情報なし"}</p>
                  <p><strong>営業時間</strong></p>
                  <p>${place.opening_hours ? place.opening_hours.weekday_text.join("<br>") : "情報なし"}</p>
                  <p><strong>公式サイト</strong></p>
                  <p>${place.website ? `<a href="${place.website}" target="_blank">ウェブサイトを見る</a>` : "情報なし"}</p>
                </div>
              `;
            } else {
              console.error('温泉の詳細情報が取得できませんでした');
            }
          }
        );
      }
    });
  });
}
  } else {
    console.error("map element not found or Google Maps API not loaded");
  }
}

function setupCloseButtons() {
  const closeButton = document.getElementById('close-campsite-panel');
  if (closeButton) {
    closeButton.replaceWith(closeButton.cloneNode(true));
    const newCloseButton = document.getElementById('close-campsite-panel');

    newCloseButton.addEventListener('click', () => {

      const searchContainer = document.querySelector(".search-container");
      if (searchContainer) {
        searchContainer.classList.remove('campsite-open');
        searchContainer.classList.remove('onsen-open');
      }

      const campsitePanel = document.getElementById("campsite-panel");
      if (campsitePanel) {
        campsitePanel.classList.add('hidden');
      }

      newCloseButton.classList.add('hidden');

      const onsenPanel = document.getElementById("onsen-panel");
      if (onsenPanel) {
        onsenPanel.classList.add('hidden');
      }

      const panelContent = document.getElementById("campsite-content");
      if (panelContent) {
        panelContent.innerHTML = `
          <h2>キャンプ場情報</h2>
          <p>キャンプ場を選択してください</p>
        `;
      }

      setTimeout(() => {
        const center = map.getCenter();
        google.maps.event.trigger(map, "resize");
        map.setCenter(center);
      }, 0);
    });
  }

  const closeOnsenButton = document.getElementById('close-onsen-panel');
  if (closeOnsenButton) {
    closeOnsenButton.replaceWith(closeOnsenButton.cloneNode(true));
    const newCloseOnsenButton = document.getElementById('close-onsen-panel');

    newCloseOnsenButton.addEventListener('click', () => {
      const searchContainer = document.querySelector(".search-container");
      if (searchContainer) {
        searchContainer.classList.remove("onsen-open");
      }

      newCloseOnsenButton.classList.add('hidden');

      const onsenPanel = document.getElementById("onsen-panel");
      if (onsenPanel) {
        onsenPanel.classList.add('hidden');
      }

      const onsenContent = document.getElementById('onsen-content');
      if (onsenContent) {
        onsenContent.innerHTML = `
          <h2>温泉施設情報</h2>
          <p>温泉を選択してください</p>
        `;
      }
      setTimeout(() => {
        const center = map.getCenter();
        google.maps.event.trigger(map, "resize");
        map.setCenter(center);
      }, 0);
    });
  }
}


document.addEventListener("turbo:load", () => {
  const mapElement = document.getElementById("map");
  if (mapElement) {
    if (typeof google !== "undefined" && google.maps) {
      initMap();
    } else {
      const checkGoogleMaps = setInterval(() => {
        if (typeof google !== "undefined" && google.maps) {
          clearInterval(checkGoogleMaps);
          initMap();
        }
      }, 100);
    }
  }

  setupCloseButtons();
});

document.addEventListener("DOMContentLoaded", () => {
  const mapElement = document.getElementById("map");
  if (mapElement) {
    if (typeof google !== "undefined" && google.maps) {
      initMap();
    } else {
      const checkGoogleMaps = setInterval(() => {
        if (typeof google !== "undefined" && google.maps) {
          clearInterval(checkGoogleMaps);
          initMap();
        }
      }, 100);
    }
  }

  setupCloseButtons();
});
