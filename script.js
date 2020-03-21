

// Button click event for cities
$("#find-city").on("click", function(event) {
  event.preventDefault();

  var city = $("#city-input").val();
  getAPIs(city);
});

// cities variable which will store an array
var cities = [];

// Ajax call
//first for the five day forecast
//second for the main weather forcase
function getAPIs(city) {
  const APIKey = "b1b590596ba62ec3375d8b2762bdd012";
  var fiveDayQueryURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city},us&units=imperial&appid=${APIKey}`;
  var mainQueryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city},us&units=imperial&appid=${APIKey}`;
//Five day call
  $.ajax({
      url: fiveDayQueryURL,
      method: "GET"
  }).then(function(response) {
      showFiveDayWeather(response);
      console.log(response);
  })
// Main weather call
  $.ajax({
      url: mainQueryURL,
      method: "GET"
  }).then(function(response) {
    showMainWeather(response);
    console.log(response);
  })

  if (cities.indexOf(city) === -1) {
    cities.push(city);
  }
// Calls the cityList and setCities functions which sets up the cards and the function that stringifies the cities
// listed
  cityList();
  setCities();
};
// Main weather function.  Using the dom to change elements here
function showMainWeather(response) {
    // declaring variables from the api object
  var cityName = response.name;
  var cityDate = moment().format('l');
  var cityIcon = response.weather[0].icon;
  var cityTemp = Math.round(response.main.temp);
  var cityHumid = response.main.humidity;
  var cityWind = Math.round(response.wind.speed);
  var cityCondition = response.weather[0].main;
  // Icon use
  var cityIconEl = $("<img>").attr("src", `https://openweathermap.org/img/w/${cityIcon}.png`)
  //Changing the Dom
  $("#city-name").text(cityName + ' (' + cityDate + ')').append(cityIconEl);
  $("#city-temp").text(cityTemp);
  $("#city-humid").text(cityHumid);
  $("#city-wind").text(cityWind);
  $("#city-condition").text(cityCondition);
}
// This is the five day weather forecast function
function showFiveDayWeather(response) {
   $("#five-day-deck").empty();
  for (var i = 0; i < 40; i += 8) {
    var cardDate = response.list[i].dt_txt;
    // Establishing dates
    var date = new Date(cardDate).toLocaleDateString('en-US', {
      month : 'numeric',
      day : 'numeric',
      year : 'numeric'
    });
    // Establishing elements from the api object
    var cTemp = Math.round(response.list[i].main.temp);
    var cHumid = Math.round(response.list[i].main.humidity);
    // declaring icon variable
    var icon = response.list[i].weather[0].icon;
    var cardIcon = $("<img>").attr("src", `https://openweathermap.org/img/w/${icon}.png`);
    // all weather functions 
    var cardTempEl = $("<p>").attr("class", "card-text").text(`Temp: ${cTemp} °F`);
    var cardHumidEl = $("<p>").attr("class", "card-text").text(`Humidity: ${cHumid}%`);
    var cardEl = $("<div>").attr("class", "card");
    var cardBodyEl = $("<div>").attr("class", "card-body ");
    var cardTitleEl = $("<h6>").attr("class", "card-head").text(date);
    // appending each card 
    cardEl.append(cardBodyEl);
    cardBodyEl.append(cardTitleEl).append(cardIcon).append(cardTempEl).append(cardHumidEl);
    // appending from the div
    $("#five-day-forecast").append(cardEl);
  }
}
// Putting the searched cities in to a list.
function setCities() {
  $("#city-list").empty();
  cities.forEach(city => {
     var cityCard = $("<div>").attr("class", "card");
    var cityCardDiv = $("<div>").attr("class", "city").text(city);
    cityCard.append(cityCardDiv);
    $("#city-list").prepend(cityCard);
  })
}

function initFunction() {
     var storedCities = JSON.parse(localStorage.getItem("cities"));
   if (storedCities !== null) {
      cities = storedCities;
    }
  }
  // set local storage for cities, stringify results.
  function cityList() {
    localStorage.setItem("cities", JSON.stringify(cities));
  }
  
initFunction();