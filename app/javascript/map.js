import { campsites } from './campsites.js';

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

    const panel = document.getElementById("campsite-panel");

    campsites.forEach((campsite) => {
      const marker = new google.maps.Marker({
        position: { lat: campsite.lat, lng: campsite.lng },
        map: map,
        title: campsite.name
      });

      marker.addListener("click", () => {
        panel.innerHTML = `
          <h2>キャンプ場情報</h2>
          <h3>${campsite.name}</h3>
    
          <p><strong>住所</strong></p>
          <p>${campsite.address}</p>
    
          <p><strong>営業時間</strong></p>
          <p>${campsite.businessHours || '情報なし'}</p>
      
          <p><strong>公式サイト</strong></p>
          <p>
            ${campsite.url 
              ? `<a href="${campsite.url}" target="_blank" rel="noopener noreferrer">公式サイトを見る</a>` 
              : '公式サイト情報なし'}
          </p>
        `;
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
