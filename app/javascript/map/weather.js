import {
  setActivePanel
} from "panel_manager";

function formatDateLabel(dateString, index) {
  const date = new Date(dateString);

  const dayOfWeek = [
    "日",
    "月",
    "火",
    "水",
    "木",
    "金",
    "土"
  ][date.getDay()];

  const month = date.getMonth() + 1;
  const day = date.getDate();

  if (index === 0) {
    return `昨日${month}/${day}(${dayOfWeek})`;
  } else if (index === 1) {
    return `今日${month}/${day}(${dayOfWeek})`;
  } else if (index === 2) {
    return `明日${month}/${day}(${dayOfWeek})`;
  } else {
    return `${month}/${day}(${dayOfWeek})`;
  }
}

function getWeatherDescription(weatherCode) {
  const weatherDescriptions = {
    0: {
      description: "快晴",
      icon: "☀️"
    },
    1: {
      description: "晴れ",
      icon: "🌤️"
    },
    2: {
      description: "一部曇り",
      icon: "⛅"
    },
    3: {
      description: "曇り",
      icon: "☁️"
    },
    45: {
      description: "霧",
      icon: "🌫️"
    },
    48: {
      description: "霧",
      icon: "🌫️"
    },
    51: {
      description: "弱い霧雨",
      icon: "🌦️"
    },
    53: {
      description: "霧雨",
      icon: "🌦️"
    },
    55: {
      description: "強い霧雨",
      icon: "🌧️"
    },
    61: {
      description: "弱い雨",
      icon: "🌧️"
    },
    63: {
      description: "雨",
      icon: "🌧️"
    },
    65: {
      description: "強い雨",
      icon: "🌧️"
    },
    71: {
      description: "弱い雪",
      icon: "🌨️"
    },
    73: {
      description: "雪",
      icon: "❄️"
    },
    75: {
      description: "強い雪",
      icon: "❄️"
    },
    80: {
      description: "弱いにわか雨",
      icon: "🌦️"
    },
    81: {
      description: "にわか雨",
      icon: "🌧️"
    },
    82: {
      description: "強いにわか雨",
      icon: "🌧️"
    },
    85: {
      description: "弱いにわか雪",
      icon: "🌨️"
    },
    86: {
      description: "強いにわか雪",
      icon: "❄️"
    },
    95: {
      description: "雷雨",
      icon: "⛈️"
    },
    96: {
      description: "雷雨・ひょう",
      icon: "⛈️"
    },
    99: {
      description: "強い雷雨・ひょう",
      icon: "⛈️"
    }
  };

  return (
    weatherDescriptions[weatherCode] || {
      description: "天気情報なし",
      icon: "❓"
    }
  );
}

function setupWeatherButton(
  campsite,
  closeOnsenPanel,
  closeCampsiteImagePanel,
  resizeMap
) {
  const button =
    document.getElementById(
      "weather-open-button"
    );

  if (!button) {
    return;
  }

  button.addEventListener(
    "click",
    () => {
      openWeatherPanel(
        campsite,
        closeOnsenPanel,
        closeCampsiteImagePanel,
        resizeMap
      );
    }
  );
}

function openWeatherPanel(
  campsite,
  closeOnsenPanel,
  closeCampsiteImagePanel,
  resizeMap
) {
  const searchContainer =
    document.querySelector(
      ".search-container"
    );

  const weatherPanel =
    document.getElementById(
      "weather-panel"
    );

  const weatherContent =
    document.getElementById(
      "weather-content"
    );

  const closeButton =
    document.getElementById(
      "close-weather-panel"
    );

  if (
    !searchContainer ||
    !weatherPanel ||
    !weatherContent
  ) {
    console.error(
      "天気パネルが見つかりません"
    );

    return;
  }

  closeOnsenPanel();
  closeCampsiteImagePanel(
    resizeMap
  );


  weatherPanel.classList.remove(
    "hidden"
  );

  setActivePanel("weather-open");

  fetchWeatherForecast(
    campsite
  );

  if (closeButton) {
    closeButton.classList.remove(
      "hidden"
    );
  }

  resizeMap();
}

async function fetchWeatherForecast(campsite) {
  const weatherContent =
    document.getElementById(
      "weather-content"
    );

  if (!weatherContent) {
    return;
  }

  if (
    !campsite.geometry ||
    !campsite.geometry.location
  ) {
    weatherContent.innerHTML = `
      <h2>キャンプ場の天気</h2>

      <p>
        キャンプ場の位置情報を取得できませんでした。
      </p>
    `;

    return;
  }

  const latitude =
    campsite.geometry.location.lat();

  const longitude =
    campsite.geometry.location.lng();

  weatherContent.innerHTML = `
    <h2>キャンプ場の天気</h2>

    <div class="weather-loading">
      <p>天気情報を取得中です。</p>
    </div>
  `;

  try {
    const url =
      "https://api.open-meteo.com/v1/forecast" +
      `?latitude=${latitude}` +
      `&longitude=${longitude}` +
      "&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max" +
      "&timezone=Asia%2FTokyo" +
      "&past_days=1" +
      "&forecast_days=7";

    const response =
      await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Open-Meteo API error: ${response.status}`
      );
    }

    const data =
      await response.json();

    if (
      !data.daily ||
      !data.daily.time ||
      data.daily.time.length === 0
    ) {
      throw new Error(
        "天気予報データが取得できませんでした"
      );
    }

    let weatherListHTML = "";

    data.daily.time.forEach(
      (date, index) => {
        const weatherCode =
          data.daily.weather_code[index];

        const maxTemperature =
          data.daily.temperature_2m_max[index];

        const minTemperature =
          data.daily.temperature_2m_min[index];

        const precipitationProbability =
          data.daily.precipitation_probability_max[index];

        const weather =
          getWeatherDescription(
            weatherCode
          );

        weatherListHTML += `
          <div class="detail-box">
            <h3>
              ${formatDateLabel(date, index)}
            </h3>

            <p>
              <strong>天気</strong>
            </p>

            <p>
              ${weather.icon}
              ${weather.description}
            </p>

            <p>
              <strong>最高気温</strong>
            </p>

            <p>
              ${
                maxTemperature !== null &&
                maxTemperature !== undefined
                  ? `${maxTemperature}℃`
                  : "情報なし"
              }
            </p>

            <p>
              <strong>最低気温</strong>
            </p>

            <p>
              ${
                minTemperature !== null &&
                minTemperature !== undefined
                  ? `${minTemperature}℃`
                  : "情報なし"
              }
            </p>

            <p>
              <strong>降水確率</strong>
            </p>

            <p>
              ${
                precipitationProbability !== null &&
                precipitationProbability !== undefined
                  ? `${precipitationProbability}%`
                  : "情報なし"
              }
            </p>
          </div>
        `;
      }
    );

    weatherContent.innerHTML = `
      <h2>キャンプ場の天気</h2>

      <div class="detail-box">
        <h3>
          ${campsite.name}
        </h3>

        <p>
          前日と１週間分の天気情報です。
        </p>
      </div>

      ${weatherListHTML}
    `;
  } catch (error) {
    console.error(
      "天気予報の取得に失敗しました:",
      error
    );

    weatherContent.innerHTML = `
      <h2>キャンプ場の天気</h2>

      <div class="detail-box">
        <h3>
          ${campsite.name}
        </h3>

        <p>
          天気予報を取得できませんでした。
        </p>

        <p>
          時間をおいてもう一度お試しください。
        </p>
      </div>
    `;
  }
}

function closeWeatherPanel(resizeMap) {
  const searchContainer =
    document.querySelector(
      ".search-container"
    );

  const weatherPanel =
    document.getElementById(
      "weather-panel"
    );

  const weatherContent =
    document.getElementById(
      "weather-content"
    );

  const closeButton =
    document.getElementById(
      "close-weather-panel"
    );

  if (searchContainer) {
    searchContainer.classList.remove(
      "weather-open"
    );
  }

  if (weatherPanel) {
    weatherPanel.classList.add(
      "hidden"
    );
  }

  if (closeButton) {
    closeButton.classList.add(
      "hidden"
    );
  }

  if (weatherContent) {
    weatherContent.innerHTML = `
      <h2>
        キャンプ場の天気
      </h2>

      <p>
        天気予報を表示するには
        ボタンを押してください
      </p>
    `;
  }

  resizeMap();
}

export {
  setupWeatherButton,
  closeWeatherPanel
};
