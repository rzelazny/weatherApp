$(document).ready(function(){
    //variables
    var APIKey = configVariables.apiKey;
    var cityList = [];

    //function grabs the user input value
    $("#search-button").on("click", function(){
        var searchValue = $("#search-value").val();
        $("#search-value").val("");
        searchWeather(searchValue);
    })

function searchWeather(searchValue){
    $.ajax({
        type:"GET",
        url: "http://api.openweathermap.org/data/2.5/weather?q=" + searchValue + "&appid=" + APIKey + "&units=imperial",
        dataType: "json"
        
    }).then(function(data){
        //make sure there are no previous results
        $("#today").empty();

        //store city data in history
        saveCity(searchValue);

        //<i class="fas fa-cloud"></i>
        var faIcon = "fas fa-cloud"

        //creating a card to display the weather data
        var title = $("<h3>").addClass("card-title").text(data.name);
        var weatherIcon = $("<h2>").addClass(faIcon);
        var card = $("<div>").addClass("card");
            //card.attr("id", "resultCard");
        var temp = $("<h4>").addClass("card-text").text("Temp: " + data.main.temp + "F");
        var wind = $("<p>").addClass("card-text").text("Wind Speed: " + data.wind.speed + "MPH");
        var humidity = $("<p>").addClass("card-text").text("Humidity: " + data.main.humidity + "%");
        var cardBody = $("<div>").addClass("card-body");
            cardBody.attr("id", "resultCardBody");

        //append current stats to card
        cardBody.append(title, weatherIcon, temp, wind, humidity);
        card.append(cardBody);
        $("#today").append(card);

        //get UV Data and append to card
        getUVIndex(data.coord.lat, data.coord.lon);

        //get forecast data
        getForecast(searchValue);
    })
}
// Add last ran cities to local storage and display history log
function saveCity(city){

    //store city as the last one searched
    localStorage.setItem("savedCity", city);

    //Only append cities to the history once
    if(cityList.indexOf(city) === -1 ){
        var cityName = $("<h4>").addClass("card-title").text(city);
        cityName.attr("class", "cityHistory")

        // var card = $("<div>").addClass("card card-history");
        // card.attr("id", city)
        // var cardBody = $("<div>").addClass("card-body");

        // cardBody.append(cityName);
        // card.append(cardBody);

        $("#history").append(cityName);
        cityList.push(city)

        //function checks for user clicking city history
        cityName.on("click", function(){
            searchWeather(this.innerHTML);
        })
    }
}

//function to get the 5 day forecast
function getForecast(city){
    $.ajax({
        type:"GET",
        url: "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + APIKey + "&units=imperial",
        dataType: "json"
        
    }).then(function(data){
        console.log(data);
        $("#forecast").empty();

        for(i=0; i<data.list.length; i=i+8){ //weather updates are in 3 hour increments so we only need every 8th
            //get the date from the time string and remove the time
            var forecastDay = data.list[i].dt_txt;
            forecastDay = forecastDay.split(' ')[0]; 
            var title = $("<h3>").addClass("card-title").text(forecastDay);

            var weatherIconURL = "http://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png";
            var showIcon = $("<img>").attr("src", weatherIconURL);
            var temp = $("<h4>").addClass("card-text").text("Temp: " + data.list[i].main.temp + "F");
            var humidity = $("<p>").addClass("card-text").text("Humidity: " + data.list[i].main.humidity);
            var column = $("<div>").addClass("col-md-5ths");
            var card = $("<div>").addClass("card");
            var cardBody = $("<div>").addClass("card-body");
    
            //append current stats to card
            cardBody.append(title, showIcon, temp, humidity);
            card.append(cardBody);
            column.append(card)
            $("#forecast").append(column);
        }
    })
}

//function to find UV Index and add it to results card
function getUVIndex(lat, lon){
    $.ajax({
        type:"GET",
        url: "http://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey,
    }).then(function(data){
        var uvIndex = $("<p>").addClass("card-text").text("UV Index: " + data.value);
        
        $("#resultCardBody").append(uvIndex);
    })
}

//set inital variables and retrive saved data from local storage
function init (){
    var savedCity = localStorage.getItem("savedCity")
    searchWeather(savedCity);
}

//always load stored data
init()
})    