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

    setupFavoriteDeleteButton(
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

    const campsiteNameElement = item.querySelector("[data-campsite-name]");
    const onsenNameElement = item.querySelector("[data-onsen-name]");

    campsiteNameElement.textContent = campsite.displayName || "施設名を取得できませんでした";
    onsenNameElement.textContent = onsen.displayName || "施設名を取得できませんでした";

  } catch (error) {
    console.error(
      "お気に入り施設名の取得に失敗しました:",
      error
    );

    const campsiteNameElement = item.querySelector("[data-campsite-name]");
    const onsenNameElement = item.querySelector("[data-onsen-name]");

    campsiteNameElement.textContent = "施設名を取得できませんでした";
    onsenNameElement.textContent = "施設名を取得できませんでした";
  }
}

function setupFavoriteDeleteButton(
  campsitePlaceId,
  onsenPlaceId,
  item
) {
  const deleteButton = item.querySelector("[data-favorite-delete]");

  if (!deleteButton) {
    return;
  }

  deleteButton.addEventListener("click", async (event) => {
    event.preventDefault();
    event.stopPropagation();

    deleteButton.disabled = true;

    try {
      const response = await fetch("/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": getCsrfToken()
        },
        body: JSON.stringify({
          campsite_place_id: campsitePlaceId,
          onsen_place_id: onsenPlaceId
        })
      });

      if (!response.ok) {
        throw new Error(
          `お気に入りの削除に失敗しました: ${response.status}`
        );
      }

      const result = await response.json();

      if (result.saved === false) {
        item.remove();
      } else {
        throw new Error(
          "お気に入りの削除結果を確認できませんでした"
        );
      }
    } catch (error) {
      console.error(
        "お気に入りの削除に失敗しました:",
        error
      );

      deleteButton.disabled = false;
      alert("お気に入りの削除に失敗しました。");
    }
  });
}

function getCsrfToken() {
  const meta = document.querySelector(
    'meta[name="csrf-token"]'
  );

  return meta ? meta.content : "";
}
