console.log("map.js loaded");

function initMap() {
  console.log("initMap called");

  const center = {
    lat: 35.681236,
    lng: 139.767125
  };

  const mapElement = document.getElementById("map");
  console.log("map element:", mapElement);

  if (mapElement && typeof google !== "undefined" && google.maps) {
    new google.maps.Map(mapElement, {
      zoom: 8,
      center: center
    });
    console.log("Map created!");
  } else {
    console.error("map element not found or Google Maps API not loaded");
  }
}

// Turbo のイベントで地図を初期化（TOP → 検索ページ）
document.addEventListener("turbo:load", () => {
  console.log("turbo:load event fired");
  const mapElement = document.getElementById("map");
  if (mapElement) {
    // Google Maps API が読み込まれるまで待つ
    if (typeof google !== "undefined" && google.maps) {
      initMap();
    } else {
      // Google Maps API が読み込まれていない場合は待つ
      const checkGoogleMaps = setInterval(() => {
        if (typeof google !== "undefined" && google.maps) {
          clearInterval(checkGoogleMaps);
          initMap();
        }
      }, 100);
    }
  }
});

// 通常のページ読み込みでも動作するように（検索ページで F5）
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOMContentLoaded event fired");
  const mapElement = document.getElementById("map");
  if (mapElement) {
    // Google Maps API が読み込まれるまで待つ
    if (typeof google !== "undefined" && google.maps) {
      initMap();
    } else {
      // Google Maps API が読み込まれていない場合は待つ
      const checkGoogleMaps = setInterval(() => {
        if (typeof google !== "undefined" && google.maps) {
          clearInterval(checkGoogleMaps);
          initMap();
        }
      }, 100);
    }
  }
});

console.log("map.js event listeners registered");