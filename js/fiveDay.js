//fetch5DayData
//get5DayIcons
//fetch5DayText
//append5DayIcons
//append5DayText
//get5Dayurl



export const fetch5DayData = async (city) => {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=3b5a238031f1f7198b18de4cd2da0e03`);
    const json = await response.json();
    // console.log(json);
    return json;
}
export const get5DayIcons = async (city) => {
    const data = await fetch5DayData(city);
    const iconArray = [];
    const icon1 = data.list[0].weather[0].icon;
    const icon2 = data.list[8].weather[0].icon;
    const icon3 = data.list[16].weather[0].icon;
    const icon4 = data.list[24].weather[0].icon;
    const icon5 = data.list[32].weather[0].icon;
    iconArray.push(icon1, icon2, icon3, icon4, icon5);
    return iconArray;
}

export const create5dayURLs = async (city) => {
    let iconArray = await get5DayIcons(city);
    const urls = iconArray.map(iconID => createImageURL(iconID));
    // console.log(urls);
    return urls;
}

export const get5dayDescriptions = async (city) => {
    const data = await fetch5DayData(city);
    const descArray = [];
    const desc1 = data.list[0].weather[0].description;
    const desc2 = data.list[8].weather[0].description;
    const desc3 = data.list[16].weather[0].description;
    const desc4 = data.list[24].weather[0].description;
    const desc5 = data.list[32].weather[0].description;
    descArray.push(desc1, desc2, desc3, desc4, desc5);
    return descArray;
}

//reused from main.js
const createImageURL = (iconID) => {
    const iconURL = `http://openweathermap.org/img/wn/`;
    const nextIconURL = iconURL + iconID;
    const finalIconURL = nextIconURL + '@2x.png';
    return finalIconURL;
}

export const display5dayIcons = async (city) => {
    const urls = await create5dayURLs(city);
    const descriptions = await get5dayDescriptions(city);
    const image1 = create5dayImage(urls[0], descriptions[0]);
    const image2 = create5dayImage(urls[1], descriptions[1]);
    const image3 = create5dayImage(urls[2], descriptions[2]);
    const image4 = create5dayImage(urls[3], descriptions[3]);
    const image5 = create5dayImage(urls[4], descriptions[4]);
    const slot1 = document.getElementById('img-5day-1');
    const slot2 = document.getElementById('img-5day-2');
    const slot3 = document.getElementById('img-5day-3');
    const slot4 = document.getElementById('img-5day-4');
    const slot5 = document.getElementById('img-5day-5');
    slot1.appendChild(image1);
    slot2.appendChild(image2);
    slot3.appendChild(image3);
    slot4.appendChild(image4);
    slot5.appendChild(image5);
}

export const create5dayImage = (url, description) => {
    const image = document.createElement('img');
    image.setAttribute('alt', description); 
    image.setAttribute('src', url);
    return image;
}


