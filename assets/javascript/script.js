$(document).ready(function(){
    //variables
    var APIKey = configVariables.apiKey;

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
        
        //creating a card to display the weather data
        var title = $("<h3>").addClass("card-title").text(data.name);
        var card = $("<div>").addClass("card");
            //card.attr("id", "resultCard");
        var temp = $("<h4>").addClass("card-text").text("Temp: " + data.main.temp + "F");
        var wind = $("<p>").addClass("card-text").text("Wind Speed: " + data.wind.speed + "MPH");
        var humidity = $("<p>").addClass("card-text").text("Humidity: " + data.main.humidity + "%");
        var cardBody = $("<div>").addClass("card-body");
            cardBody.attr("id", "resultCardBody");

        //append current stats to card
        cardBody.append(title, temp, wind, humidity);
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

    localStorage.setItem("savedCity", city);

    var cityName = $("<h4>").addClass("card-title").text(city);
    cityName.attr("class", "cityHistory")

    // var card = $("<div>").addClass("card card-history");
    // card.attr("id", city)
    // var cardBody = $("<div>").addClass("card-body");

    // cardBody.append(cityName);
    // card.append(cardBody);
    $("#history").append(cityName);

    //function checks for user clicking city history
    $(".cityHistory").on("click", function(){
        searchWeather(this.innerHTML);
    })

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
            
            var temp = $("<h4>").addClass("card-text").text("Temp: " + data.list[i].main.temp + "F");
            var humidity = $("<p>").addClass("card-text").text("Humidity: " + data.list[i].main.humidity);
            var column = $("<div>").addClass("col-md-5ths");
            var card = $("<div>").addClass("card");
            var cardBody = $("<div>").addClass("card-body");
    
            //append current stats to card
            cardBody.append(title, temp, humidity);
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

//

//always load stored data
init()
})    