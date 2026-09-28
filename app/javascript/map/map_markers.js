let campsiteMarkers = [];
let facilityMarkers = [];
let selectedCampsiteMarker = null;

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

function showSelectedCampsiteMarker(
  map,
  campsite,
  openCampsiteDetails
) {
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

function showCampsiteSearchMarkers(
  map,
  campsiteSearchResults,
  openCampsiteDetails
) {
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
}

function showFacilityMarkers(
  map,
  facilities,
  campsite,
  facilityType,
  openFacilityDetails
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

function showSelectedCampsiteAndFacilities(
  map,
  selectedCampsite,
  campsiteSearchResults,
  currentFacilityResults,
  currentFacilityType,
  openCampsiteDetails,
  openFacilityDetails
) {
  if (
    !selectedCampsite ||
    !selectedCampsite.geometry ||
    !selectedCampsite.geometry.location
  ) {
    showCampsiteSearchMarkers(
      map,
      campsiteSearchResults,
      openCampsiteDetails
    );
    return;
  }

  showSelectedCampsiteMarker(
    map,
    selectedCampsite,
    openCampsiteDetails
  );

  if (
    currentFacilityResults.length > 0 &&
    currentFacilityType
  ) {
    showFacilityMarkers(
      map,
      currentFacilityResults,
      selectedCampsite,
      currentFacilityType,
      openFacilityDetails
    );
  }
}

export {
  getMarkerIcon,
  isCampsite,
  clearCampsiteMarkers,
  clearFacilityMarkers,
  showSelectedCampsiteMarker,
  showCampsiteSearchMarkers,
  showFacilityMarkers,
  showSelectedCampsiteAndFacilities
};
