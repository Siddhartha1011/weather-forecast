// Weather Forecast App - Fixed Script
const apiKey = "0be264f63c6541ceb46114249251710"; // Replace with your WeatherAPI key
const baseUrl = "https://api.weatherapi.com/v1";

// DOM Elements (matching HTML)
const cityInput = document.getElementById("city-input");
const searchForm = document.getElementById("search-form");
const locBtn = document.getElementById("loc-btn");
const unitToggle = document.getElementById("unit-toggle");
const errorDiv = document.getElementById("error");
const recentBtn = document.getElementById("recent-btn");
const recentList = document.getElementById("recent-list");

const currentSection = document.getElementById("current-section");
const forecastSection = document.getElementById("forecast-section");
const forecastCards = document.getElementById("forecast-cards");

// Current weather fields
const locationName = document.getElementById("location-name");
const localTime = document.getElementById("local-time");
const tempDiv = document.getElementById("temp");
const conditionDiv = document.getElementById("condition");
const humidityDiv = document.getElementById("humidity");
const windDiv = document.getElementById("wind");
const feelsLikeDiv = document.getElementById("feelslike");
const uvDiv = document.getElementById("uv");
const alertBanner = document.getElementById("alert-banner");

// State
let recentCities = JSON.parse(localStorage.getItem("recentCities")) || [];
let showFahrenheit = false;

// ------------- Fetch Weather -------------

async function getWeather(query) {
    try {
      errorDiv.textContent = "";
      const res = await fetch(
        `${baseUrl}/forecast.json?key=${apiKey}&q=${query}&days=5&aqi=no&alerts=yes`
      );
      if (!res.ok) throw new Error("City not found!");
      const data = await res.json();
      displayWeather(data);
      displayForecast(data.forecast.forecastday);
      updateRecentCities(data.location.name);
    } catch (err) {
      errorDiv.textContent = "⚠️ " + err.message;
      currentSection.classList.add("hidden");
      forecastSection.classList.add("hidden");
    }
  }
// ------------- Display Current Weather -------------

function displayWeather(data) {
    currentSection.classList.remove("hidden");
  
    locationName.textContent = `${data.location.name}, ${data.location.country}`;
    localTime.textContent = `Local time: ${data.location.localtime}`;
    const temp = showFahrenheit ? `${data.current.temp_f}°F` : `${data.current.temp_c}°C`;
    tempDiv.textContent = temp;
  
    const icon = data.current.condition.icon;
    const text = data.current.condition.text;
    conditionDiv.innerHTML = `<img src="${icon}" class="w-8 inline-block">${text}`;
    humidityDiv.textContent = data.current.humidity;
    windDiv.textContent = data.current.wind_kph;
    feelsLikeDiv.textContent = showFahrenheit ? data.current.feelslike_f : data.current.feelslike_c;
    uvDiv.textContent = data.current.uv;
  
    // Alerts
    if (data.alerts && data.alerts.alert.length > 0) {
      alertBanner.classList.remove("hidden");
      alertBanner.textContent = data.alerts.alert[0].headline;
    } else {
      alertBanner.classList.add("hidden");
    }
  }// ------------- Display Forecast -------------

function displayForecast(days) {
    forecastSection.classList.remove("hidden");
    forecastCards.innerHTML = "";
  
    days.forEach((day) => {
      const card = document.createElement("div");
      card.className = "bg-white/80 p-3 rounded shadow text-center";
  
      const temp = showFahrenheit ? `${day.day.avgtemp_f}°F` : `${day.day.avgtemp_c}°C`;
  
      card.innerHTML = `
        <h4 class="font-semibold">${new Date(day.date).toDateString()}</h4>
        <img src="${day.day.condition.icon}" class="mx-auto">
        <p>${day.day.condition.text}</p>
        <p class="font-bold">${temp}</p>
      `;
  
      forecastCards.appendChild(card);
    });
  }
// ------------- Recent Searches -------------

function updateRecentCities(city) {
    if (!recentCities.includes(city)) {
      recentCities.unshift(city);
      if (recentCities.length > 5) recentCities.pop();
      localStorage.setItem("recentCities", JSON.stringify(recentCities));
    }
    renderRecentCities();
  }
  
  function renderRecentCities() {
    if (recentCities.length === 0) {
      recentBtn.classList.add("hidden");
      return;
    }
  
    recentBtn.classList.remove("hidden");
    recentList.innerHTML = "";
    recentCities.forEach((city) => {
      const li = document.createElement("li");
      li.textContent = city;
      li.className = "px-3 py-1 hover:bg-gray-100 cursor-pointer";
      li.addEventListener("click", () => {
        getWeather(city);
        recentList.classList.add("hidden");
      });
      recentList.appendChild(li);
    });
  }
  
  
// ------------- Event Listeners -------------

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const city = cityInput.value.trim();
    if (city) getWeather(city);
  });
  
  locBtn.addEventListener("click", () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          getWeather(`${pos.coords.latitude},${pos.coords.longitude}`);
        },
        () => {
          errorDiv.textContent = "⚠️ Location access denied.";
        }
      );
    } else {
      errorDiv.textContent = "⚠️ Geolocation not supported.";
    }
  });
  
  unitToggle.addEventListener("change", () => {
    showFahrenheit = unitToggle.checked;
    const city = cityInput.value.trim() || recentCities[0];
    if (city) getWeather(city);
  });
  
  recentBtn.addEventListener("click", () => {
    recentList.classList.toggle("hidden");
  });
  
  document.addEventListener("DOMContentLoaded", renderRecentCities);