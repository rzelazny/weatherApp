$(document).ready(function(){
    var APIKey = "781132be2cdcd5a029c15476b1b01d07"

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
        //success: function(){
        
    }).then(function(data){
        console.log(data);
        //make sure there are no previous results
        $("#today").empty();

        //store city data in history
        saveCity(searchValue);

        //creating a card to display the weather data
        var title = $("<h3>").addClass("card-title").text(data.name);
        var card = $("<div>").addClass("card");
        var wind = $("<p>").addClass("card-text").text("Wind Speed: " + data.wind.speed);
        var humidity = $("<p>").addClass("card-text").text("Humidity: " + data.humidity);
        var cardBody = $("<div>").addClass("card-body");
        

        cardBody.append(title, wind, humidity);
        console.log(cardBody);
        card.append(cardBody);
        $("#today").append(card);
    })

    
}
// .push cities to local storage
function saveCity(city){
    
}


//function to get the 5 day forecast
function forecast(){
    //use a for loop to 
}

//function to return UV Index




//set inital variables and retrive saved data from local storage
function init (){

}





})    