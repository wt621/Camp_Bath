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

    campsites.forEach((campsite) => {
      new google.maps.Marker({
        position: { lat: campsite.lat, lng: campsite.lng },
        map: map,
        title: campsite.name
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
