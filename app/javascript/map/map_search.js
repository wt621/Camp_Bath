const CAMPSITE_SEARCH_RADIUS = 50000;
const FACILITY_SEARCH_RADIUS = 10000;

function createPlacesService(map) {
  return new google.maps.places.PlacesService(map);
}

function searchCampsites(map, center, callback) {
  const service = createPlacesService(map);

  service.nearbySearch(
    {
      location: center,
      radius: CAMPSITE_SEARCH_RADIUS,
      type: "campground"
    },
    callback
  );
}

function searchNearbyFacilities(
  map,
  campsite,
  facilityType,
  callback
) {
  const service = createPlacesService(map);

  if (facilityType === "onsen") {
    service.nearbySearch(
      {
        location: campsite.geometry.location,
        radius: FACILITY_SEARCH_RADIUS,
        keyword: "温泉"
      },
      callback
    );

    return;
  }

  if (facilityType === "commercial") {
    const searchPlace = placeType => {
      return new Promise(resolve => {
        service.nearbySearch(
          {
            location: campsite.geometry.location,
            radius: FACILITY_SEARCH_RADIUS,
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
        callback(
          [
            ...supermarkets,
            ...convenienceStores
          ],
          google.maps.places.PlacesServiceStatus.OK
        );
      }
    );

    return;
  }

  callback(
    [],
    google.maps.places.PlacesServiceStatus.INVALID_REQUEST
  );
}

export {
  searchCampsites,
  searchNearbyFacilities
};
