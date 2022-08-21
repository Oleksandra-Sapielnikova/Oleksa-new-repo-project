function formatDate(date) {
  let today = date.getDate();
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];
  return `${day} ${today} <br /> ${hours}:${minutes}`;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `
            <div class="col-2">
              <div class="weather-forecast-day">${formatDay(
                forecastDay.dt
              )}</div>
              <img
                src="http://openweathermap.org/img/wn/${
                  forecastDay.weather[0].icon
                }@2x.png"
                alt=""
                width="42"
              />
              <div class="weather-forecast-temperature">
                <span class="weather-forecast-temperature-max">${Math.round(
                  forecastDay.temp.max
                )}°</span>
                <span class="weather-forecast-temperature-min"> ${Math.round(
                  forecastDay.temp.min
                )}°</span>
              </div>
            </div>`;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let apiKey = "ba4cb932bbb28d4f3aebad024c256729";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function showActualData(response) {
  document.querySelector("#city").innerHTML = response.data.name;
  document.querySelector("#wind-speed").innerHTML = Math.round(
    response.data.wind.speed
  );
  document.querySelector("#humidity-now").innerHTML =
    response.data.main.humidity;
  document.querySelector("#feels-temp").innerHTML = Math.round(
    response.data.main.feels_like
  );
  document.querySelector("#temperature-now").innerHTML = Math.round(
    response.data.main.temp
  );
  document.querySelector("#weather-description").innerHTML =
    response.data.weather[0].description;
  let iconElement = document.querySelector("#icon");

  celciusTemperature = response.data.main.temp;

  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);

  getForecast(response.data.coord);
}

function searchCity(city) {
  let unit = `metric`;
  let apiEndpoint = `https://api.openweathermap.org/data/2.5/weather`;
  let apiKey = "ba4cb932bbb28d4f3aebad024c256729";
  let apiUrl = `${apiEndpoint}?q=${city}&appid=${apiKey}&units=${unit}`;
  axios.get(apiUrl).then(showActualData);
}

function changeCity(event) {
  event.preventDefault();
  let city = document.querySelector("#search-city-input").value;
  searchCity(city);
  document.querySelector("#dropdownMenuButton1").innerHTML = "C";
}

function showPosition(position) {
  console.log(position);

  let unit = `metric`;
  let apiEndpoint = `https://api.openweathermap.org/data/2.5/weather`;
  let apiKey = `ba4cb932bbb28d4f3aebad024c256729`;
  let apiUrl = `${apiEndpoint}?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=${unit}`;

  document.querySelector("#dropdownMenuButton1").innerHTML = "C";
  axios.get(apiUrl).then(showActualData);
}
function showCurrentPosition(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(showPosition);
}
function showUnit(item) {
  document.getElementById("dropdownMenuButton1").innerHTML = item.innerHTML;
}

function goToFahrenheit(event) {
  event.preventDefault();
  let actualTemperature = document.querySelector("#temperature-now");
  let fahrenheitTemperature = (celciusTemperature * 9) / 5 + 32;
  actualTemperature.innerHTML = Math.round(fahrenheitTemperature);
}
function goToCelcius(event) {
  event.preventDefault();
  let actualTemperature = document.querySelector("#temperature-now");
  actualTemperature.innerHTML = Math.round(celciusTemperature);
}

let fahrenheitLink = document.querySelector("#fahrenheit-temp");
fahrenheitLink.addEventListener("click", goToFahrenheit);

let celciusLink = document.querySelector("#celcius-temp");
celciusLink.addEventListener("click", goToCelcius);

let celciusTemperature = null;

let now = new Date();
let currentDate = document.querySelector("#currentDate");
currentDate.innerHTML = formatDate(now);

let currentCity = document.querySelector("#search-form");
currentCity.addEventListener("submit", changeCity);

let currentButton = document.querySelector("#current-location-bttn");
currentButton.addEventListener("click", showCurrentPosition);

searchCity("Potsdam");
