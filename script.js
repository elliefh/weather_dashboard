// Get longtitude and latitude coordinates for searched city
function getCoord() {
    var APIkey = "c19b2f1f085df13be7309df32599c301";
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

// Get current and future forecast data from Open Weather API 
function getData() {
    var APIkey = "c19b2f1f085df13be7309df32599c301";
    var queryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=hourly,minutely,alerts&units=imperial&appid=" + APIkey;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
        console.log("--------------------");
        console.log("current date is " + response.current.dt);
        console.log("current temperature is " + response.current.temp);
        console.log("current humidity is " + response.current.humidity);
        console.log("current wind speed is " + response.current.wind_speed);
        console.log("current uv index is " + response.current.uvi);
        console.log("current weather icon is " + response.current.weather[0].icon);
        console.log("--------------------");

        dt = response.current.dt;
        temp = response.current.temp;
        hum = response.current.humidity;
        wind = response.current.wind_speed;
        uvi = response.current.uvi;
        icon = response.current.weather[0].icon;
        daily = response.daily;
        
        currentData(city, dt, temp, hum, wind, uvi, icon);
        forecastData(daily);
    }); 
}

// Save current forecast data to local storage 
function currentData() {

    // convert dt to DD MM YYYY format 
    var a = new Date(dt * 1000);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var time = month + ' ' + date + ' ' + year ;
    
    // save to local storage
    localStorage.setItem("city", city);
    localStorage.setItem("date", time);
    localStorage.setItem("temp", temp + " F");
    localStorage.setItem("hum", hum + " %");
    localStorage.setItem("wind", wind + " MPH");
    localStorage.setItem("uvi", uvi);
    localStorage.setItem("icon", "http://openweathermap.org/img/wn/" + icon + ".png");

    displayCurrent();
}

// Display current forecast data
function displayCurrent() {
    var getDate = localStorage.getItem("date");
    var getCity = localStorage.getItem("city");
    var getTemp = localStorage.getItem("temp");
    var getHum = localStorage.getItem("hum");
    var getWind = localStorage.getItem("wind");
    var getUvi = localStorage.getItem("uvi");
    var getIcon = localStorage.getItem("icon");

    if (getDate===null) {
        $('#current-city-info').text("City (Date)");
    }
    else {
        $('#current-city-info').text(getCity + " (" + getDate + ")");
        $('#current-temp').text(getTemp);
        $('#current-hum').text(getHum);
        $('#current-wind').text(getWind);
        $('#current-uvi').text(getUvi);
        $('#current-city-icon').attr("src",getIcon);
        console.log(getIcon);
    }
    colorUVI();
}

// Determine UVI severity and display a color to indicate conditions as "favourable", "moderate", or "severe" 
function colorUVI() {
    var uvi = localStorage.getItem("uvi");
    var currentUvi = $('#current-uvi');
    var indicator = $('<span>');
    indicator.attr('class','ml-1 p-1')

    if (uvi<3) {
        indicator.css("background-color", "#caffbf");
        indicator.text("Favourable");
    }
    else if (uvi>6) {
        indicator.css("background-color", "#ffadad");
        indicator.text("Severe");
    }
    else {
        indicator.css("background-color", "#fdffb6");
        indicator.text("Moderate");
    }
    currentUvi.append(indicator);
}

// Save future forecast data to local storage 
function forecastData() {
    for (let i = 1; i < 6; i++) {
        // convert dt to DD MM YYYY format 
        var a = new Date(daily[i].dt * 1000);
        var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        var year = a.getFullYear();
        var month = months[a.getMonth()];
        var date = a.getDate();
        var time = month + ' ' + date + ' ' + year; 

        // save to local storage
        localStorage.setItem("date-"+i, time);
        localStorage.setItem("high-"+i, daily[i].temp.max);
        localStorage.setItem("low-"+i, daily[i].temp.min);
        localStorage.setItem("humidity-"+i, daily[i].humidity);        
        localStorage.setItem("icon-"+i, "http://openweathermap.org/img/wn/" + daily[i].weather[0].icon + ".png");       
    }
    displayForecast();
}

// Display future forecast data 
function displayForecast() {
    if (localStorage.getItem("date-1")===null) {
        return;
    }
    else {
        for (let i = 1; i < 6; i++) {
            var getDate = localStorage.getItem("date-"+i);
            var getHigh = localStorage.getItem("high-"+i);
            var getLow = localStorage.getItem("low-"+i);
            var getHum = localStorage.getItem("humidity-"+i);
            var getIcon = localStorage.getItem("icon-"+i);
    
            $('.date-'+i).text(getDate);
            $('.high-'+i).text(getHigh + "F");
            $('.low-'+i).text(getLow + "F");        
            $('.humidity-'+i).text(getHum);        
            $('.icon-'+i).attr("src", getIcon); 
        }
    }
}

// Save previously searched cities
function history() {
    var searchList = $("#search-history");
    var addCity = $('<button>');
    addCity.attr('class', 'btn text-light bg-dark');
    addCity.attr('id', city);
    addCity.text(city);
    searchList.append(addCity);
}

// Run functions 
displayCurrent();
displayForecast();

// Event listeners 
$("#search-btn").on("click", function(event) {
    event.preventDefault();
    city = $("#city-input").val().trim();
    getCoord(city);
    history(city);
});

$("#search-history").on("click", "button", function(event) {
    event.preventDefault();

    city = $(this).attr('id');
    getCoord(city);
});