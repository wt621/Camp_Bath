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

export {
  fetchRouteInfo,
  formatRouteDuration,
  formatRouteDistance
};
