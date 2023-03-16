function formatDate() {
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let currentDate = new Date();
  let currentDay = days[currentDate.getDay()];
  let hours = currentDate.getHours();
  let minutes = currentDate.getMinutes();

  let formattedDate = `${currentDay}, ${hours}:${minutes}`;

  return formattedDate;
}

let dateTime = document.querySelector(".dateTime");
dateTime.innerHTML = formatDate();

function search(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#search-text-input");

  let h3 = document.querySelector("h3");
  if (searchInput.value) {
    h3.innerHTML = `Searching for ${searchInput.value}...`;
    const weather = searchCityWeather(searchInput.value);
  } else {
    h3.innerHTML = null;
    alert("Please type a city");
  }
}
let form = document.querySelector("#search-form");
// document.querySelector("#btnSubmit").addEventListener("click", search);
form.addEventListener("submit", search);

let city = "";
async function showTemperature(response) {
  console.log("showTemperature>>",response.data);

  let temperature =   response.data.main.temp;
  let icon = `<img src="http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png" width="42"/>`;
  let humidityComp = document.querySelector("#lblHumidity");
  let windComp = document.querySelector("#lblWind");
  
  celsiusTemperature = response.data.main.temp;

  humidityComp.innerHTML = response.data.main.humidity;
  windComp.innerHTML = Math.round(response.data.wind.speed * 3.6);
  
  console.log(response.data)

  let mainLabel = document.querySelector("#mainTemp");
  mainLabel.innerHTML = temperature + "°C";
  city = response.data.name;
  let message = `It is ${temperature}°C in ${city} ${icon} | ${response.data.weather[0].description}` ;
  let h1 = document.querySelector("h1");
  h1.innerHTML = message;

  //forecasting
  let latitude = response.data.coord.lat;
  let longitude = response.data.coord.lon;
  let apiKey = "e15ddd1e1139e9ce1b12520a5c0ecfeb";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
console.log(apiUrl);
  axios.get(apiUrl).then((response) => {
    console.log("forecase >>", response.data.daily);
      let days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
      for (let i=0; i < 5; i++) {
        const item = response.data.daily[i];
        //console.log(i,item);
        let d = new Date(item.dt*1000);
        let day = days[d.getDay()];
        //console.log(day);
        let icon = `<img src="http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png" width="42"/>`
        let max = Math.round(item.temp.max);
        let min = Math.round(item.temp.min);
        let cardMessage = `${day}<br/>${icon}<br/><i class="">${min}°</i>|<i class="">${max}°</i>`;
        document.querySelector("#box"+i).innerHTML = cardMessage;

      }
  });
}

function searchCityWeather(city) {
  let apiKey = "e15ddd1e1139e9ce1b12520a5c0ecfeb";
  let units = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;
  
  axios.get(apiUrl).then(showTemperature);
}

function showWeather(response) {
  let h1 = document.querySelector("h1");
  let temperature = Math.round(response.data.main.temp);
  h1.innerHTML = `It is currently ${temperature}°C in ${response.data.name}`;
}

function showPosition(position) {
  let p = document.querySelector("p");
  let apiKey = "e15ddd1e1139e9ce1b12520a5c0ecfeb";
  let apiUrl = "https://api.openweathermap.org/data/2.5/weather?lat="
    .concat(position.coords.latitude, "&lon=")
    .concat(position.coords.longitude, "&appid=")
    .concat(apiKey, "&units=metric");
  p.innerHTML = `Your Latitude is ${position.coords.latitude} and your longitude is ${position.coords.longitude}`;
  axios.get(apiUrl).then(displayWeatherCondition);
}

function getCurrentPosition() {
  navigator.geolocation.getCurrentPosition(showPosition);
}

function getCurrentLocation(event) {
  navigator.geolocation.getCurrentPosition(searchLocation);
}

let currentLoc = document.querySelector("button");
currentLoc.addEventListener("click", getCurrentPosition);

function displayFahrenheitTemperature(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#mainTemp");

  let fahrenheiTemperature = (celsiusTemperature * 9) / 5 + 32;
  temperatureElement.innerHTML = Math.round(fahrenheiTemperature) + "°F";
  let searchInput = document.querySelector("#search-text-input").value;
  document.querySelector("h1").innerHTML = `It is ${fahrenheiTemperature}°F in ${city}`;
}

function displayCelsiusTemperature(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#mainTemp");
  temperatureElement.innerHTML = Math.round(celsiusTemperature) + "°C";
  let searchInput = document.querySelector("#search-text-input").value;
  document.querySelector("h1").innerHTML = `It is ${celsiusTemperature}°C in ${city}`;
}

let celsiusTemperature = null;

document.querySelector("#fLink").addEventListener("click", displayFahrenheitTemperature);
document.querySelector("#cLink").addEventListener("click", displayCelsiusTemperature);