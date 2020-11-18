import {WEATHER_API_KEY as key} from "./apikey.js";
import * as fiveDay from "./fiveDay.js";


//Launch app
document.addEventListener('readystatechange', (event) => {
    if (event.target.readyState === 'complete') {
        initApp();
    }
});

//Functions that are called when the app starts
const initApp = () => {
    displayCurrentDate();
    displayCurrentTime();
    displayWeather(getDefaultCity());
    createAriaLabel(getDefaultCity());
    setCityNameLabel();
    storeCity();
}

//Creates a better aria-label for the city name label
const createAriaLabel = (city) => {
    const heading = document.getElementById('fetched-heading-location-label');
    heading.setAttribute('aria-label', city + " is the current city whose weather is being displayed");
}

//Obtain the weather data in the API and convert it to json
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

//Displays the default city as the city label initially
//If a valid city is entered, the city label changes to that text and the weather for that city is displayed
//If invalid city is entered, an Invalid message displays in the search box
const setCityNameLabel = async () => {
    const searchbox = document.getElementById('searchbox');
    const searchbutton = document.getElementById('search-button');
    const label = document.getElementById('fetched-heading-location-label');
    label.textContent = getDefaultCity();

    //Applying focus to the search box causes it to become blank
    searchbox.addEventListener('focus', function(e) {
        searchbox.value = "";
    })

    searchbutton.addEventListener('click', async function(e) {
        // console.log(searchbox.value);
        let response = await fetchCityWeather(searchbox.value);
        if (response.name) {
            label.textContent = response.name;
            displayWeather(response.name);
            storeCity(); //This allows the city to be stored in localStorage if the appropriate button is clicked
        } else {
            searchbox.value = "Invalid city.  Please try again...";
        }
    })
}

//Takes the city name from the city label and stores it in localStorage
const storeCity = () => {
    const cityLabel = document.getElementById('fetched-heading-location-label');
    const city = cityLabel.textContent;
    const defaultButton = document.getElementById('button-add-default');
    defaultButton.addEventListener('click', (e) => {
        localStorage.setItem('CityName', city);
        // console.log(city);
    })
    
}

//Retrieve the city stored in localStorage
const retrieveStoredCity = () => {
    const storedCity = localStorage.getItem('CityName');
    return storedCity;
}

//If local storage is empty, return Hays as default city
//Otherwise, the city in local storage is the defautlt city
const getDefaultCity = () => {
    if (localStorage.getItem("CityName") === null) {
        return 'Hays';
    } else {
        return retrieveStoredCity();
    }
}

//Generates the current data and then displays it in a label with proper formatting
const displayCurrentDate = () => {
    const dateLabel = document.querySelector("#dateSpace");
    const date = new Date();
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September",
    "October", "November", "December"];
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const today = `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    dateLabel.textContent = today;
}

//Displays current time with proper formatting
const displayCurrentTime = () => {
    const timeLabel = document.getElementById('timeSpace');
    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    if (minutes < 10) {
        minutes = `0${minutes}`;
    }
    let time = "";
    if (hours < 12) {
        time = `${hours}:${minutes} AM`;
    } else {
        time = `${hours-12}:${minutes} PM`;
    }
    timeLabel.textContent = time;
}

//Clear all previous weather information and display the new information on the screen
const displayWeather = (city) => {
    clearWeather();
    displayMainIcon(city);
    displayCurrentCityWeatherStats(city);
    fiveDay.display5dayIcons(city);
    fiveDay.display5dayNames();
}

//Clears all weather icons and data 
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


//This obtains the json weather icon, creates a url from this for the image, and then appends a new img
//element within a parent div
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

//This gets the weather data stats and packages them into an array
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

//creates paragraphs that act as labels for the weather stats
const createWeatherColumn1Text = () => {
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

//creates the text for the column with the actual weather data stats
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

//deletes direct descendants of a parent element
const deleteContents = (parentElement) => {
    let child = parentElement.lastElementChild;
    while (child) {
        parentElement.removeChild(child);
        child = parentElement.lastElementChild;
    }
}

