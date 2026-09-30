function setupCurrentLocationButton({
  getMap,
  onLocationSuccess
}) {
  const button =
    document.getElementById(
      "current-location-button"
    );

  if (!button) {
    return;
  }

  button.replaceWith(
    button.cloneNode(true)
  );

  const newButton =
    document.getElementById(
      "current-location-button"
    );

  newButton.addEventListener(
    "click",
    () => {
      if (!navigator.geolocation) {
        alert(
          "このブラウザでは現在地を取得できません。"
        );

        return;
      }

      newButton.disabled = true;

      navigator.geolocation.getCurrentPosition(
        position => {
          const currentLocation = {
            lat:
              position.coords.latitude,

            lng:
              position.coords.longitude
          };

          const accuracy =
            position.coords.accuracy;

          if (accuracy > 5000) {
            alert(
              `現在地の取得精度が低いため、正確な位置ではない可能性があります。\n` +
              `推定誤差：約${Math.round(
                accuracy / 1000
              )}km`
            );
          }

          const map = getMap();

          if (!map) {
            console.error(
              "Google Mapsがまだ初期化されていません"
            );

            newButton.disabled = false;

            return;
          }

          onLocationSuccess(
            currentLocation,
            map
          );

          newButton.disabled = false;
        },

        error => {
          console.error(
            "現在地を取得できませんでした:",
            error
          );

          let message =
            "現在地を取得できませんでした。";

          switch (error.code) {
            case error.PERMISSION_DENIED:
              message =
                "位置情報の使用が拒否されています。ブラウザの位置情報設定を確認してください。";
              break;

            case error.POSITION_UNAVAILABLE:
              message =
                "現在地を取得できませんでした。GPSや位置情報サービスを確認してください。";
              break;

            case error.TIMEOUT:
              message =
                "現在地の取得がタイムアウトしました。もう一度お試しください。";
              break;
          }

          alert(message);
          
          newButton.disabled = false;
        },

        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    }
  );
}

export {
  setupCurrentLocationButton
};
