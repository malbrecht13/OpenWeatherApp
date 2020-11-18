import {WEATHER_API_KEY as key} from "./apikey.js";



let date = new Date();
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September",
"October", "November", "December"];
let today = `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;

//Launch app
document.addEventListener('readystatechange', (event) => {
    if (event.target.readyState === 'complete') {
        initApp();
    }
});

const initApp = () => {
    //Add listeners

    //display date
    displayCurrentDate();
    //ID of 4272782 is for Hays, KS
    displayMainIcon('Hays');
    displayCurrentCityWeatherStats('Hays');
    //search for selected city
    //load selected city weather icon
    //displaycurrent date
    //useCurrent location as default
    //obtain current location
    //function to delete children
}

const displayCurrentDate = () => {
    let dateLabel = document.querySelector("#dateSpace");
    dateLabel.textContent = today;
}

const fetchCityWeather = async (name) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${name}&appid=${key}&units=imperial`;
    const response = await fetch(url);
    const json = await response.json();
    return json;
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
    console.log(weatherData);
    createWeatherColumn1Text();
    createWeatherColumn2TextDynamically(weatherData);

}

const getWeatherStats = async (city) => {
    const data = await fetchCityWeather(city);
    // console.log(data);
    const currentTemp = data.main.temp;
    const highTemp = data.main.temp_min;
    const lowTemp = data.main.temp_max;
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
    p5.textContent = Math.round(weatherData[4]) + "mph";
    weatherCol2.appendChild(p1);
    weatherCol2.appendChild(p2);
    weatherCol2.appendChild(p3);
    weatherCol2.appendChild(p4);
    weatherCol2.appendChild(p5);
    
}

//TODO: Display weather data below main icon
//TODO: Delete any existing child nodes within a parent
//TODO: Use localStorage to store default data
//TODO: Add a button to store default data
//TODO: Display current time with the date
//TODO: Create github repository

