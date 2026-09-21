document.addEventListener("turbo:load", () => {
  const favoriteItems = document.querySelectorAll("[data-favorite-item]");

  if (favoriteItems.length === 0) {
    return;
  }

  favoriteItems.forEach((item) => {
    const campsitePlaceId = item.dataset.campsitePlaceId;
    const onsenPlaceId = item.dataset.onsenPlaceId;

    fetchFavoritePlaceNames(
      campsitePlaceId,
      onsenPlaceId,
      item
    );
  });
});

async function fetchFavoritePlaceNames(
  campsitePlaceId,
  onsenPlaceId,
  item
) {
  try {
    const { Place } = await google.maps.importLibrary("places");

    const campsite = new Place({
      id: campsitePlaceId
    });

    const onsen = new Place({
      id: onsenPlaceId
    });

    await Promise.all([
      campsite.fetchFields({
        fields: ["displayName"]
      }),
      onsen.fetchFields({
        fields: ["displayName"]
      })
    ]);

    const campsiteNameElement =
      item.querySelector("[data-campsite-name]");

    const onsenNameElement =
      item.querySelector("[data-onsen-name]");

    campsiteNameElement.textContent =
      campsite.displayName || "施設名を取得できませんでした";

    onsenNameElement.textContent =
      onsen.displayName || "施設名を取得できませんでした";
  } catch (error) {
    console.error(
      "お気に入り施設名の取得に失敗しました:",
      error
    );

    const campsiteNameElement =
      item.querySelector("[data-campsite-name]");

    const onsenNameElement =
      item.querySelector("[data-onsen-name]");

    campsiteNameElement.textContent =
      "施設名を取得できませんでした";

    onsenNameElement.textContent =
      "施設名を取得できませんでした";
  }
}
