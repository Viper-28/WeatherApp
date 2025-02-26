import { cities } from './cities.js';

let selectedIndex = -1;
let suggestions = [];

const searchBox = document.getElementById("searchBox");
const citySuggestions = document.getElementById("citySuggestions");

searchBox.addEventListener("input", function () {
    const query = this.value.toLowerCase().trim();
    selectedIndex = -1;
    citySuggestions.innerHTML = "";
    citySuggestions.style.width = `${searchBox.clientWidth}px`; // ✅ Match width of search box

    if (!query) {
        citySuggestions.style.display = "none";
        return;
    }

    // Filter cities from cities.js
    suggestions = cities
        .filter(city => city.name.toLowerCase().includes(query))
        .slice(0, 5); // ✅ Limit to 5 results

    if (suggestions.length === 0) {
        citySuggestions.style.display = "none";
        return;
    }

    showSuggestions(suggestions);
});

searchBox.addEventListener("keydown", function (e) {
    const suggestionList = document.querySelectorAll(".suggestion-item");

    if (e.key === "ArrowDown") {
        e.preventDefault();
        if (selectedIndex < suggestions.length - 1) {
            selectedIndex++;
        } else {
            selectedIndex = 0; // Wrap around to the first option
        }
        updateSelection(suggestionList);
    } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (selectedIndex > 0) {
            selectedIndex--;
        } else {
            selectedIndex = suggestions.length - 1; // Wrap around to last option
        }
        updateSelection(suggestionList);
    } else if (e.key === "Enter") {
        e.preventDefault();
        if (selectedIndex >= 0) {
            selectSuggestion(suggestions[selectedIndex]);
        }
    }
});

function showSuggestions(suggestions) {
    citySuggestions.innerHTML = "";
    citySuggestions.style.display = "block";

    suggestions.forEach((city, index) => {
        const div = document.createElement("div");
        div.classList.add("suggestion-item");
        div.textContent = `${city.name}, ${city.country}`;
        
        div.addEventListener("click", function () {
            selectSuggestion(city);
        });

        citySuggestions.appendChild(div);
    });
}

function updateSelection(suggestionList) {
    suggestionList.forEach((item, index) => {
        item.classList.toggle("selected", index === selectedIndex);
    });

    if (selectedIndex >= 0) {
        searchBox.value = `${suggestions[selectedIndex].name}, ${suggestions[selectedIndex].country}`;
        suggestionList[selectedIndex].scrollIntoView({ block: "nearest" });
    }
}

function selectSuggestion(city) {
    searchBox.value = `${city.name}, ${city.country}`;
    citySuggestions.style.display = "none";
    checkWeather(city.name); // 
}

async function checkWeather(city) {
    const apiKey = "cbca6d35fbcbf94d2350cef3adcfc199";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (response.status === 404) {
            document.querySelector(".error").style.display = "block";
            document.querySelector(".weather").style.display = "none";
            return;
        }
        
        document.querySelector(".location").innerHTML = data.name;
        document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
        document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
        document.querySelector(".wind").innerHTML = data.wind.speed + "km/h";
        
        const weatherIcons = {
            "Clear": "icons/sun.svg",
            "Clouds": "icons/cloud.svg",
            "Rain": "icons/rain.svg",
            "Drizzle": "icons/drizzle.svg",
            "Thunderstorm": "icons/thunderstorm.svg",
            "Snow": "icons/snow.svg",
            "Mist": "icons/mist.svg",
            "Fog": "icons/fog.svg",
            "Haze": "icons/haze.svg"
        };

        const weatherCondition = data.weather[0].main;
        document.querySelector(".weather-icon").src = weatherIcons[weatherCondition] || "icons/default.svg";
        
        document.querySelector(".error").style.display = "none";
        document.querySelector(".weather").style.display = "block";
    } catch (error) {
        console.error("Error fetching weather data:", error);
    }
}
