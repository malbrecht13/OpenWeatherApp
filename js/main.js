import {WEATHER_API_KEY as key} from "./apikey.js";
import * as fiveDay from "./fiveDay.js";


//Launch app
document.addEventListener('readystatechange', (event) => {
    if (event.target.readyState === 'complete') {
        initApp();
    }
});

const initApp = () => {
    displayCurrentDate();
    displayCurrentTime();
    displayWeather(getDefaultCity());
    setCityNameLabel();
    storeCity();
}

const fetchCityWeather = async (name) => {
    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${name}&appid=${key}&units=imperial`;
        const response = await fetch(url);
        const json = await response.json();
        return json;
    } catch (error) {
        console.error(error);
    }
}

const setCityNameLabel = async () => {
    const searchbox = document.getElementById('searchbox');
    const searchbutton = document.getElementById('search-button');
    const label = document.getElementById('fetched-heading-location-label');
    label.textContent = getDefaultCity();

    searchbox.addEventListener('focus', function(e) {
        searchbox.value = "";
    })

    searchbutton.addEventListener('click', async function(e) {
        // console.log(searchbox.value);
        let response = await fetchCityWeather(searchbox.value);
        if (response.name) {
            label.textContent = response.name;
            displayWeather(response.name);
            storeCity();
        } else {
            searchbox.value = "Invalid city.  Please try again...";
        }
    })
}

const storeCity = () => {
    const cityLabel = document.getElementById('fetched-heading-location-label');
    const city = cityLabel.textContent;
    const defaultButton = document.getElementById('button-add-default');
    defaultButton.addEventListener('click', (e) => {
        localStorage.setItem('CityName', city);
        // console.log(city);
    })
    
}

const retrieveStoredCity = () => {
    const storedCity = localStorage.getItem('CityName');
    return storedCity;
}

const getDefaultCity = () => {
    if (localStorage.getItem("CityName") === null) {
        return 'Hays';
    } else {
        return retrieveStoredCity();
    }
}

const displayCurrentDate = () => {
    const dateLabel = document.querySelector("#dateSpace");
    const date = new Date();
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September",
    "October", "November", "December"];
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const today = `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    dateLabel.textContent = today;
}

const displayCurrentTime = () => {
    const timeLabel = document.getElementById('timeSpace');
    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    let time = "";
    if (hours < 12) {
        time = `${hours}:${minutes} AM`;
    } else {
        time = `${hours}:${minutes} PM`;
    }
    timeLabel.textContent = time;
}

const displayWeather = (city) => {
    clearWeather();
    displayMainIcon(city);
    displayCurrentCityWeatherStats(city);
    fiveDay.display5dayIcons(city);
    fiveDay.display5dayNames();
}

const clearWeather = () => {
    const parentDiv = document.getElementById('large-central-weather-icon');
    const weatherStatsCol1 = document.getElementById('weather-col-1');
    const weatherStatsCol2 = document.getElementById('weather-col-2');
    const fiveDayContainer = document.getElementById('five-day-container');
    const slot1 = document.getElementById('img-5day-1');
    const slot2 = document.getElementById('img-5day-2');
    const slot3 = document.getElementById('img-5day-3');
    const slot4 = document.getElementById('img-5day-4');
    const slot5 = document.getElementById('img-5day-5');
    const header5s = document.querySelectorAll('.five-day-iconAndText > h5');
    header5s.forEach(header => header.textContent = "");
    deleteContents(weatherStatsCol1);
    deleteContents(weatherStatsCol2);
    deleteContents(parentDiv);
    deleteContents(slot1);
    deleteContents(slot2);
    deleteContents(slot3);
    deleteContents(slot4);
    deleteContents(slot5);
}



const displayMainIcon = async (city) => {
    const data = await fetchCityWeather(city);
    const weather = data.weather[0];
    const parentDiv = document.getElementById('large-central-weather-icon');
    const newImage = document.createElement('img');
    //create img src url
    const iconSource = createImageURL(weather.icon);
    //set img attributes
    newImage.setAttribute('alt', weather.description); 
    newImage.setAttribute('src', iconSource);
    newImage.setAttribute('style', "width: 10vh;");
    //append image to the parent div
    parentDiv.appendChild(newImage);
}

//create a url image from the openWeatherMap json data weater.icon property
const createImageURL = (iconID) => {
    const iconURL = `http://openweathermap.org/img/wn/`;
    const nextIconURL = iconURL + iconID;
    const finalIconURL = nextIconURL + '@2x.png';
    return finalIconURL;
}

const displayCurrentCityWeatherStats = async (city) => {
    //obtain high temp, low temp, humidity, wind speed
    const weatherData = await getWeatherStats(city);
    // console.log(weatherData);
    createWeatherColumn1Text();
    createWeatherColumn2TextDynamically(weatherData);

}

const getWeatherStats = async (city) => {
    const data = await fetchCityWeather(city);
    // console.log(data);
    const currentTemp = data.main.temp;
    const highTemp = data.main.temp_max;
    const lowTemp = data.main.temp_min;
    const humidity = data.main.humidity;
    const wind = data.wind.speed;
    const weatherArray = [];
    weatherArray.push(currentTemp, highTemp, lowTemp, humidity, wind);
    return weatherArray;
}

const createWeatherColumn1Text = () => {
    //display this as column1 text below weather icon
    const weatherCol1 = document.getElementById('weather-col-1');
    const p1 = document.createElement('p');
    const p2 = document.createElement('p');
    const p3 = document.createElement('p');
    const p4 = document.createElement('p');
    const p5 = document.createElement('p');
    p1.textContent = "Current Temp: ";
    p2.textContent = "High: ";
    p3.textContent = "Low: ";
    p4.textContent = "Humidity: ";
    p5.textContent = "Wind speed: ";
    weatherCol1.appendChild(p1);
    weatherCol1.appendChild(p2);
    weatherCol1.appendChild(p3);
    weatherCol1.appendChild(p4);
    weatherCol1.appendChild(p5);
}

const createWeatherColumn2TextDynamically = (weatherData) => {
    const weatherCol2 = document.getElementById('weather-col-2');
    const p1 = document.createElement('p');
    const p2 = document.createElement('p');
    const p3 = document.createElement('p');
    const p4 = document.createElement('p');
    const p5 = document.createElement('p');
    p1.textContent = Math.round(weatherData[0]) + "℉";
    p2.textContent = Math.round(weatherData[1]) + "℉";
    p3.textContent = Math.round(weatherData[2]) + "℉";
    p4.textContent = weatherData[3] + "%";
    p5.textContent = Math.round(weatherData[4]) + " mph";
    weatherCol2.appendChild(p1);
    weatherCol2.appendChild(p2);
    weatherCol2.appendChild(p3);
    weatherCol2.appendChild(p4);
    weatherCol2.appendChild(p5);
}

const deleteContents = (parentElement) => {
    let child = parentElement.lastElementChild;
    while (child) {
        parentElement.removeChild(child);
        child = parentElement.lastElementChild;
    }
}

