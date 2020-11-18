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
    return json.weather[0];
}

const displayMainIcon = async (city) => {
    const weather = await fetchCityWeather(city);
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

//TODO: Display weather data below main icon
//TODO: Delete any existing child nodes within a parent
//TODO: Use localStorage to store default data
//TODO: Add a button to store default data
//TODO: Display current time with the date
//TODO: Create github repository

