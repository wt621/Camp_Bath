import { campsites } from 'campsites';

function initMap() {
  const center = {
    lat: 35.681236,
    lng: 139.767125
  };

  const mapElement = document.getElementById("map");

  if (mapElement && typeof google !== "undefined" && google.maps) {
    const map = new google.maps.Map(mapElement, {
      zoom: 8,
      center: center
    });

    const service = new google.maps.places.PlacesService(map);
    console.log(service);
    
    const panel = document.getElementById("campsite-panel");
    const onsenPanel = document.getElementById("onsen-panel");
    
    campsites.forEach((campsite) => {
      const marker = new google.maps.Marker({
        position: { lat: campsite.lat, lng: campsite.lng },
        map: map,
        title: campsite.name
      });

      marker.addListener("click", () => {
        service.nearbySearch(
          {
            location: {
              lat: campsite.lat,
              lng: campsite.lng
            },
            radius: 15000,
            keyword: "温泉"
          },
          (results, status) => {
            console.log(status);

            const campsiteLocation = new google.maps.LatLng(campsite.lat, campsite.lng);
            const resultsWithDistance = results.map(onsen => {
            
            const onsenLocation = new google.maps.LatLng(
              onsen.geometry.location.lat(),
              onsen.geometry.location.lng()
            );

            const distance = google.maps.geometry.spherical.computeDistanceBetween(
              campsiteLocation,
              onsenLocation
            );

            onsen.distance = distance;
            return onsen;
          });

          const sortedResults = resultsWithDistance.sort((a, b) => {
            return a.distance - b.distance;
          });

          const topThreeOnsens = sortedResults.slice(0, 3);

            let onsenListHtml = `
              <h3>周辺15km圏内の温泉</h3>
              <ul>
            `;

            topThreeOnsens.forEach((onsen) => {
              onsenListHtml += `
                <li>
                  <button data-place-id="${onsen.place_id}">
                    ${onsen.name}
                  </button>
                </li>
              `;
            });

            onsenListHtml += `
              </ul>
            `;

            panel.innerHTML = `
              <h2>キャンプ場情報</h2>
              <h3>${campsite.name}</h3>

              <p><strong>住所</strong></p>
              <p>${campsite.address}</p>

              <p><strong>営業時間</strong></p>
              <p>${campsite.businessHours || '情報なし'}</p>

              <p><strong>サイトURL</strong></p>
              <p>
                ${campsite.url
                  ? `<a href="${campsite.url}" target="_blank" rel="noopener noreferrer">公式サイトを見る</a>`
                  : '公式サイト情報なし'}
              </p>

              ${onsenListHtml}
            `;

            const onsenButtons = panel.querySelectorAll("button");
            onsenButtons.forEach((button) => {
              button.addEventListener("click", () => {
                const placeId = button.dataset.placeId;
                console.log(placeId);

                service.getDetails(
                  {
                    placeId: placeId,
                    fields: [
                      "name",
                      "formatted_address",
                      "website",
                      "opening_hours"
                    ]
                  },
                  (place, status) => {
                    console.log(place);
                    console.log(status);

                    onsenPanel.innerHTML = `
                      <h2>温泉施設情報</h2>

                      <h3>${place.name}</h3>

                      <p><strong>住所</strong></p>
                      <p>${place.formatted_address || "情報なし"}</p>

                      <p><strong>営業時間</strong></p>
                      <p>
                        ${
                          place.opening_hours?.weekday_text?.join("<br>")
                          || "情報なし"
                        }
                      </p>

                      <p><strong>公式サイト</strong></p>
                      <p>
                        ${
                          place.website
                            ? `<a href="${place.website}" target="_blank">公式サイトを見る</a>`
                            : "情報なし"
                        }
                      </p>
                    `;
                  }
                );
              });
            });
          }
        );
      });
    });
  } else {
    console.error("map element not found or Google Maps API not loaded");
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
});
