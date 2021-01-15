$("#search-btn").on("click", function(event) {
    event.preventDefault();
    city = $("#city-input").val().trim();
    getCoord(city);
    history(city);
});

function getCoord() {
    var APIkey = "2442e83d9ff198cddb4f1dc9e1a50bbd";
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial" + "&appid=" + APIkey;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
        lat = response.coord.lat;
        lon = response.coord.lon;
        console.log("For " + city + ", the latitude is " + lat + ", and longtitude is " + lon);

        getData(city, lat, lon)
    });
}

function getData() {
    var APIkey = "2442e83d9ff198cddb4f1dc9e1a50bbd";
    var queryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=hourly,minutely,alerts&units=imperial&appid=" + APIkey;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
        console.log(response);
        console.log("current date is " + response.current.dt);
        console.log("current temperature is " + response.current.temp);
        console.log("current humidity is " + response.current.humidity);
        console.log("current wind speed is " + response.current.wind_speed);
        console.log("current uv index is " + response.current.uvi);
        console.log("current weather icon is " + response.current.weather[0].icon);
        console.log("--------------------");
        console.log("5-day forecast:");
        // for (let i = 1; i < 6; i++) {
        //     console.log(response.daily[i].dt);
        //     console.log(response.daily[i].humidity);
        //     console.log(response.daily[i].temp.min);
        //     console.log(response.daily[i].temp.max);
        //     console.log(response.daily[i].weather[0].icon);
        // }

        dt = response.current.dt;
        temp = response.current.temp;
        hum = response.current.humidity;
        wind = response.current.wind_speed;
        uvi = response.current.uvi;
        icon = response.current.weather[0].icon;
        forecast = response.daily;

        colorUVI(uvi);
        currentData(city, dt, temp, hum, wind, uvi, icon);
        forecastData(forecast);
    }); 
}

function colorUVI() {
    if (uvi>7) {
        console.log("Severe");
    } 
    else if (uvi<3) {
        console.log("Favorable");
    }
    else {
        console.log("Moderate");
    }
}

// Save current data to local storage 
function currentData() {

    // convert dt
    var a = new Date(dt * 1000);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var time = date + ' ' + month + ' ' + year ;
    
    // save data to local storage
    localStorage.setItem("city", city);
    localStorage.setItem("date", time);
    localStorage.setItem("temp", "Temperature: " + temp + " F");
    localStorage.setItem("hum", "Humidity: " + hum + " %");
    localStorage.setItem("wind", "Wind speed: " + wind + " MPH");
    localStorage.setItem("uvi", "UV Index: " + uvi);
    localStorage.setItem("icon", "http://openweathermap.org/img/wn/" + icon + ".png");

    displayCurrent()
}

function displayCurrent() {
    var getDate = localStorage.getItem("date");
    var getCity = localStorage.getItem("city");
    var getTemp = localStorage.getItem("temp");
    var getHum = localStorage.getItem("hum");
    var getWind = localStorage.getItem("wind");
    var getUvi = localStorage.getItem("uvi");

    if (getDate===null) {
        $('#current-city-info').text("City (Date)");
        $('.current-temp').text("Temperature: ");
        $('.current-hum').text("Humidity: ");
        $('.current-wind').text("Wind speed: ");
        $('.current-uvi').text("UV Index: ");
    }
    else {
        $('#current-city-info').text(localStorage.getItem("city") + " (" + localStorage.getItem("date") + ")");
        $('.current-temp').text(localStorage.getItem("temp"));
        $('.current-hum').text(localStorage.getItem("hum"));
        $('.current-wind').text(localStorage.getItem("wind"));
        $('.current-uvi').text(localStorage.getItem("uvi"));
    }

}

// Save forecast data to local storage and display data 
function forecastData() {
    for (let i = 0; i < 5; i++) {
        console.log(forecast[i].dt);
        console.log(forecast[i].humidity);
        console.log(forecast[i].temp.min);
        console.log(forecast[i].temp.max);
        console.log(forecast[i].weather[0].icon);
    }
}

function convertDt(){
    var a = new Date(dt * 1000);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var time = date + ' ' + month + ' ' + year ;
    console.log(time);
}

function history() {
    var searchList = $("#search-history");
    var addCity = $('<button>');
    addCity.attr('class', 'btn btn-light');
    addCity.text(city);
    searchList.append(addCity);
    // add local storage here too. 
}

// function saveData() {
//     localStorage.setItem("date", date);
//     localStorage.setItem("temp", temp);
//     localStorage.setItem("hum", hum);
//     localStorage.setItem("wind", wind);
//     localStorage.setItem("uvi", uvi);
//     localStorage.setItem("icon", icon);
// }

// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city
// WHEN I open the weather dashboard
// THEN I am presented with the last searched city forecast -->

// local storage in appropriate functions instead of creating a whole function to do it
// create a display data function calling on the local storage stuff
// create event for search history 

displayCurrent();