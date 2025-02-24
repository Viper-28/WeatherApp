const ak ="cbca6d35fbcbf94d2350cef3adcfc199";
        const au="https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
        const searchBox=document.querySelector(".search input");
        const searchBtn=document.querySelector(".search button");
        const weatherIcons = {
                "clear": "icons/sun.svg",
                "clouds": "icons/cloud.svg",
                "rain": "icons/rain.svg",
                "drizzle": "icons/drizzle.svg",
                "thunderstorm": "icons/thunderstorm.svg",
                "snow": "icons/snow.svg",
                "mist": "icons/mist.svg",
                "fog": "icons/mist.svg",
                "haze": "icons/mist.svg"
        };     
        async function checkweather(city) {
            const apiKey = "cbca6d35fbcbf94d2350cef3adcfc199"; 
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

            try {
                const response = await fetch(url);
                const data = await response.json();

                console.log("API Response:", data); 
                if(response.status=404)
                {
                    document.querySelector(".error").style.display="block";
                    document.querySelector(".weather").style.display="none";
                }

                if (!data.weather || data.weather.length === 0) {
                    console.error("❌ No weather data available");
                    return;
                }
                document.querySelector(".location").innerHTML=data.name;
                document.querySelector(".temp").innerHTML=Math.round(data.main.temp)+"°C";
                document.querySelector(".humidity").innerHTML=data.main.humidity+"%";
                document.querySelector(".wind").innerHTML=data.wind.speed+"km/h";
                const weatherCondition = data.weather[0].main.toLowerCase();
                console.log("Weather Condition:", weatherCondition);

                const weatherIcons = {
                    "clear": "icons/sun.svg",
                    "clouds": "icons/cloud.svg",
                    "rain": "icons/rain.svg",
                    "drizzle": "icons/drizzle.svg",
                    "thunderstorm": "icons/thunderstorm.svg",
                    "snow": "icons/snow.svg",
                    "mist": "icons/mist.svg",
                    "fog": "icons/mist.svg",
                    "haze": "icons/mist.svg"
                };

                const iconElement = document.querySelector(".weather-icon");
                if (iconElement) {
                    iconElement.src = weatherIcons[weatherCondition] || weatherIcons["clear"];
                } else {
                    console.error("❌ .weather-icon element not found!");
                }
            } catch (error) {
                console.error("Error fetching weather data:", error);
            }
            document.querySelector(".error").style.display="none";
            document.querySelector(".weather").style.display = "block";
        }
        searchBtn.addEventListener("click",()=>{
            checkweather(searchBox.value);
        })
        searchBox.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                checkweather(searchBox.value);
            }
        });