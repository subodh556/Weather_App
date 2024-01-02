const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");
const locationButton = document.querySelector(".location-btn");
const currentWeatherDiv = document.querySelector(".current-weather");
const weatherCardsDiv = document.querySelector(".weather-cards");

const API_KEY = "d5eb19ca82d66687c413d4779a36c4bf"; // API key for OpenWeatherMap API


const createWeathercard=(cityName,weatherItem,index)=>{
    if(index === 0) { // HTML for the main weather card
        return `<div class="details">
                    <h2>${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h2>
                    <h6>Temperature: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h6>
                    <h6>Wind: ${weatherItem.wind.speed} M/S</h6>
                    <h6>Humidity: ${weatherItem.main.humidity}%</h6>
                </div>
                <div class="icon">
                    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon">
                    <h6>${weatherItem.weather[0].description}</h6>
                </div>`;
    } else { // HTML for the other five day forecast card
        return `<li class="card">
                    <h3>(${weatherItem.dt_txt.split(" ")[0]})</h3>
                    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon">
                    <h6>Temp: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h6>
                    <h6>Wind: ${weatherItem.wind.speed} M/S</h6>
                    <h6>Humidity: ${weatherItem.main.humidity}%</h6>
                </li>`;
    }
}
const getweather=(cityName , latitude , longitude)=>{
    const weatherapiurl=`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;
    fetch(weatherapiurl).then(res=>res.json()).then(data=>{
        const uniqueforecast=[];
        const fivedays= data.list.filter(forecast=>{
            const forecastdate=new Date(forecast.dt_txt).getDate();
            if(!uniqueforecast.includes(forecastdate)){
                return uniqueforecast.push(forecastdate);
            }
        });
    

        //clearing previous data 
        cityInput.value="";
        currentWeatherDiv.innerHTML="";
        weatherCardsDiv.innerHTML="";

        //creating the weather cards and adding them to the html dom
        fivedays.forEach((weatherItem,index)=>{
            const html=createWeathercard(cityName,weatherItem,index);
            if(index==0){
                currentWeatherDiv.insertAdjacentHTML("beforeend",html);

            }
            else{
                weatherCardsDiv.insertAdjacentHTML("beforeend",html);
            }
        });
    }).catch(()=>{
        alert("An error occcured while fectching the weather forecast");
    });


}
const getcitycoord =()=>{
    const cityName= cityInput.value.trim();
    if(cityName === "") return;
    const api_url=`https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;

    fetch(api_url).then(res=>res.json()).then(data=>{
        if(!data.length) return alert(`No coordinates found for ${cityName}`);
        const {lat , lon , name}= data[0];
        getweather(name,lat , lon);
    }).catch(()=>{
        alert("An error occuered while fetching the coordinates");
    })
}
const getusercoordinates=()=>{
    navigator.geolocation.getCurrentPosition(
        position=>{
                const { latitude ,longitude}=position.coords;
                const Apiurl=`https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`;
                fetch(Apiurl).then(res=>res.json()).then(data=>{
                    const { name}=data[0]
                    getweather(name,latitude,longitude);
                }).catch(()=>{
                    alert("An error occured while fetching the city");
                });
        },
        error=>{
            if(error.code===error.PERMISSION_DENIED){
                alert("Geolocation request denied.")
            }
            else{
                alert("Geolocation request error.")
            }
        }
    );
}
locationButton.addEventListener("click",getusercoordinates);
searchButton.addEventListener("click",getcitycoord);
cityInput.addEventListener("keyup",e=>e.key==="Enter" && getcitycoord);
