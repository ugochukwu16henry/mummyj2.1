const WEATHER_API_KEY = "da30ce22c9b196b583ee7cdbebdc9ecc";
const CITY = "Uyo";
const COUNTRY_CODE = "NG";
const UNITS = "imperial";

const themeToggle = document.querySelector(".theme-toggle");
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    themeToggle.textContent = document.body.classList.contains("dark-mode") ? "☀️" : "🌙";
  });
}

const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
const mainNav = document.querySelector(".main-nav");

if (mobileMenuBtn && mainNav) {
  mobileMenuBtn.addEventListener("click", () => {
    mainNav.classList.toggle("active");
    mobileMenuBtn.textContent = mainNav.classList.contains("active") ? "✕" : "☰";
  });

  document.addEventListener("click", (e) => {
    if (!mobileMenuBtn.contains(e.target) && !mainNav.contains(e.target)) {
      mainNav.classList.remove("active");
      mobileMenuBtn.textContent = "☰";
    }
  });
}

let currentSlide = 0;
const slides = document.querySelectorAll(".hero-slide");
const dots = document.querySelectorAll(".dot");

function showSlide(index) {
  if (slides.length === 0) return;
  slides.forEach(slide => slide.classList.remove("active"));
  dots.forEach(dot => dot.classList.remove("active"));
  if (slides[index] && dots[index]) {
    slides[index].classList.add("active");
    dots[index].classList.add("active");
  }
}

function nextSlide() {
  if (slides.length === 0) return;
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
}

let slideInterval;
if (slides.length > 0) {
  slideInterval = setInterval(nextSlide, 5000);
  showSlide(0);
}

dots.forEach((dot, index) => {
  dot.addEventListener("click", () => {
    currentSlide = index;
    showSlide(currentSlide);
    clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, 5000);
  });
});

async function fetchWeatherData() {
  try {
    const currentResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${CITY},${COUNTRY_CODE}&appid=${WEATHER_API_KEY}&units=${UNITS}`);
    if (!currentResponse.ok) throw new Error(`Weather API Error: ${currentResponse.status}`);
    const currentData = await currentResponse.json();

    const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${CITY},${COUNTRY_CODE}&appid=${WEATHER_API_KEY}&units=${UNITS}`);
    if (!forecastResponse.ok) throw new Error(`Forecast API Error: ${forecastResponse.status}`);
    const forecastData = await forecastResponse.json();

    updateCurrentWeather(currentData);
    updateForecast(forecastData);
  } catch (error) {
    console.error("Error fetching weather data:", error);
    displayWeatherError();
  }
}

function updateCurrentWeather(data) {
  const weatherIcon = document.querySelector(".weather-icon");
  const weatherInfo = document.querySelector(".weather-info");
  if (!weatherInfo || !data?.main || !data?.weather?.[0]) return;

  const temp = Math.round(data.main.temp);
  const description = data.weather[0].description;
  const high = Math.round(data.main.temp_max);
  const low = Math.round(data.main.temp_min);
  const humidity = data.main.humidity;

  const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString("en-US", {
    hour: "numeric", minute: "2-digit", hour12: true
  });
  const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString("en-US", {
    hour: "numeric", minute: "2-digit", hour12: true
  });

  if (weatherIcon) weatherIcon.textContent = getWeatherEmoji(data.weather[0].icon);

  weatherInfo.innerHTML = `
    <p><strong>${temp}°F</strong></p>
    <p>${capitalizeWords(description)}</p>
    <p>High: ${high}°F</p>
    <p>Low: ${low}°F</p>
    <p>Humidity: ${humidity}%</p>
    <p>Sunrise: ${sunrise}</p>
    <p>Sunset: ${sunset}</p>
  `;
}

function updateForecast(data) {
  const forecastList = document.querySelector(".weather-forecast ul");
  if (!forecastList || !data?.list) return;

  const dailyForecasts = [];
  const processedDates = new Set();
  const today = new Date().toDateString();

  for (const item of data.list) {
    const forecastDate = new Date(item.dt * 1000);
    const dateString = forecastDate.toDateString();
    if (dateString !== today && !processedDates.has(dateString) && dailyForecasts.length < 3) {
      const hour = forecastDate.getHours();
      if (hour >= 11 && hour <= 14) {
        dailyForecasts.push({
          date: forecastDate,
          temp: Math.round(item.main.temp),
          description: item.weather[0].description
        });
        processedDates.add(dateString);
      }
    }
    if (dailyForecasts.length >= 3) break;
  }

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  let forecastHTML = "";
  
  dailyForecasts.forEach(forecast => {
    const dayName = days[forecast.date.getDay()];
    forecastHTML += `<li>${dayName}: <strong>${forecast.temp}°F</strong> - ${capitalizeWords(forecast.description)}</li>`;
  });

  for (let i = dailyForecasts.length; i < 3; i++) {
    forecastHTML += `<li>Day ${i + 1}: <strong>--°F</strong></li>`;
  }

  forecastList.innerHTML = forecastHTML;
}

function getWeatherEmoji(iconCode) {
  const emojiMap = {
    "01d": "☀️", "01n": "🌙", "02d": "⛅", "02n": "☁️", "03d": "☁️", "03n": "☁️",
    "04d": "☁️", "04n": "☁️", "09d": "🌧️", "09n": "🌧️", "10d": "🌦️", "10n": "🌧️",
    "11d": "⛈️", "11n": "⛈️", "13d": "❄️", "13n": "❄️", "50d": "🌫️", "50n": "🌫️"
  };
  return emojiMap[iconCode] || "🌤️";
}

function capitalizeWords(str) {
  return str.replace(/\b\w/g, char => char.toUpperCase());
}

function displayWeatherError() {
  const weatherInfo = document.querySelector(".weather-info");
  if (weatherInfo) weatherInfo.innerHTML = "<p>Unable to load weather data</p>";
}

async function fetchAndDisplaySpotlights() {
  try {
    const response = await fetch("data/members.json");
    if (!response.ok) throw new Error("Failed to fetch company data");
    
    const data = await response.json();
    if (!data?.companies || !Array.isArray(data.companies)) throw new Error("Invalid company data format");

    const qualifiedMembers = data.companies.filter(company => company.membershiplevel === 2 || company.membershiplevel === 3);
    const spotlightCount = Math.random() < 0.5 ? 2 : 3;
    const selectedCompanies = getRandomCompanies(qualifiedMembers, spotlightCount);
    displaySpotlights(selectedCompanies);
  } catch (error) {
    console.error("Error fetching company data:", error);
    displaySpotlightError();
  }
}

function getRandomCompanies(companies, count) {
  if (!Array.isArray(companies) || companies.length === 0) return [];
  return [...companies].sort(() => Math.random() - 0.5).slice(0, count);
}

function displaySpotlights(companies) {
  const businessCardsContainer = document.querySelector(".business-cards");
  if (!businessCardsContainer) return;

  businessCardsContainer.innerHTML = "";
  if (!Array.isArray(companies) || companies.length === 0) {
    businessCardsContainer.innerHTML = "<p>No company spotlights available</p>";
    return;
  }

  companies.forEach(company => {
    const card = createSpotlightCard(company);
    businessCardsContainer.appendChild(card);
  });
}

function createSpotlightCard(company) {
  if (!company || typeof company !== 'object') {
    console.error('Invalid company data:', company);
    return document.createElement('div');
  }

  const article = document.createElement("article");
  article.className = "business-card";

  const membershipBadge = company.membershiplevel === 3 ? "🥇 Gold" : "🥈 Silver";
  const name = escapeHtml(company.name || "Unknown Company");
  const phone = escapeHtml(company.phone || "N/A");
  const address = escapeHtml(company.address || "N/A");
  const website = escapeHtml(company.website || "#");
  const otherinfo = escapeHtml(company.otherinfo || "No additional information");
  const imagefile = escapeHtml(company.imagefile || "placeholder.jpg");

  article.innerHTML = `
    <h3>${name}</h3>
    <p class="category">${membershipBadge} Member</p>
    <div class="business-card-content">
      <div class="business-image">
        <img src="images/${imagefile}" alt="${name} logo" onerror="this.style.display='none'; this.parentElement.innerHTML='<i class=\\'fas fa-building fa-2x\\'></i>'">
      </div>
      <div class="business-details">
        <p><strong>PHONE:</strong> ${phone}</p>
        <p><strong>ADDRESS:</strong> ${address}</p>
        <p><strong>URL:</strong> <a href="${website}" target="_blank" rel="noopener">${website.replace("https://www.", "").replace("https://", "")}</a></p>
        <p><strong>INFO:</strong> ${otherinfo}</p>
      </div>
    </div>
  `;
  return article;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function displaySpotlightError() {
  const businessCardsContainer = document.querySelector(".business-cards");
  if (businessCardsContainer) businessCardsContainer.innerHTML = "<p>Unable to load company spotlights</p>";
}

function updateLastModified() {
  const lastModified = document.getElementById("last-modified");
  if (lastModified) lastModified.textContent = "Last Modification: " + document.lastModified;
}

function setupMembershipBanner() {
  const membershipBanner = document.querySelector(".membership-banner");
  if (membershipBanner) setTimeout(() => membershipBanner.style.display = "none", 10000);
}

function setupCTAButtons() {
  document.querySelectorAll(".cta-button").forEach(button => {
    button.addEventListener("click", e => {
      e.preventDefault();
      if (button.textContent.includes("Become a Member")) window.location.href = "join.html";
      else if (button.textContent.includes("Learn More")) window.location.href = "discover.html";
    });
  });
}

function setupHeroButton() {
  const heroButton = document.querySelector(".hero button");
  if (heroButton) {
    heroButton.addEventListener("click", () => {
      const eventsSection = document.querySelector(".events-section");
      if (eventsSection) eventsSection.scrollIntoView({ behavior: "smooth" });
    });
  }
}

function setupModalFunctionality() {
  const modalLinks = document.querySelectorAll('.learn-more');
  const modals = document.querySelectorAll('.modal');
  const closeButtons = document.querySelectorAll('.close-modal');

  modalLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const modalId = link.getAttribute('data-modal');
      const modal = document.getElementById(modalId);
      if (modal) modal.classList.add('active');
    });
  });

  closeButtons.forEach(button => {
    button.addEventListener('click', () => {
      const modal = button.closest('.modal');
      if (modal) modal.classList.remove('active');
    });
  });

  modals.forEach(modal => {
    modal.addEventListener('click', e => {
      if (e.target === modal) modal.classList.remove('active');
    });
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') modals.forEach(modal => modal.classList.remove('active'));
  });
}

function setupTimestamp() {
  const timestampField = document.getElementById('timestamp');
  if (timestampField) timestampField.value = new Date().toISOString();
}

document.addEventListener("DOMContentLoaded", () => {
  try {
    fetchWeatherData();
    fetchAndDisplaySpotlights();
    updateLastModified();
    setupMembershipBanner();
    setupCTAButtons();
    setupHeroButton();
    setupModalFunctionality();
    setupTimestamp();
  } catch (error) {
    console.error("Error initializing page:", error);
  }
});