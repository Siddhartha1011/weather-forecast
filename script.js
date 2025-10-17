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

