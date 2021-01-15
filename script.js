$("#search-btn").on("click", function(event) {
    event.preventDefault();
    city = $("#city-input").val().trim();
    getCoord(city);
    history(city);
});

function getCoord() {
    var APIkey = "3be43ec06bda24e29186ff678f3318e6";
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial" + "&appid=" + APIkey;
    // var png = "";
    // var iconURL = "http://openweathermap.org/img/wn/" + png + ".png";

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
        lat = response.coord.lat;
        lon = response.coord.lon;
        console.log("latitude is " + lat + ", and longtitude is " + lon + " for " + city);

        getData(lat, lon)
    });
}

function getData() {
    var APIkey = "3be43ec06bda24e29186ff678f3318e6";
    var queryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=hourly,minutely,alerts&units=imperial&appid=" + APIkey;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
        console.log(response);
        console.log("date is " + response.current.dt);
        console.log("temperature is " + response.current.temp);
        console.log("humidity is " + response.current.humidity);
        console.log("wind speed is " + response.current.wind_speed);
        console.log("uv index is " + response.current.uvi);
        console.log("weather icon is " + response.current.weather[0].icon);
        console.log("---------------------------------------------------");
        console.log("5-day-forecast:");
        for (let i = 0; i < 5; i++) {
            console.log(response.daily[i].dt);
            console.log(response.daily[i].humidity);
            console.log(response.daily[i].temp.min);
            console.log(response.daily[i].temp.max);
            console.log(response.daily[i].weather[0].icon);
        }

        dt = response.current.dt;
        temp = response.current.temp;
        hum = response.current.humidity;
        wind = response.current.wind_speed;
        uvi = response.current.uvi;
        icon = response.current.weather[0].icon;

        colorUVI(uvi);
        convertDt(dt);
        // saveData();
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
// change the search history stuff into buttons so it can be clicked and reappear
// create the cards for 5 day forecast
// update website aesthetic 
