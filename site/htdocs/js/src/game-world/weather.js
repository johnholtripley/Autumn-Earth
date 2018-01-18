function checkWeather() {
    var previousWeather = currentWeather;
    if (thisMapData.weather.length == 1) {
        currentWeather = thisMapData.weather[0];
        if (currentWeather != "") {
            document.getElementById(currentWeather).classList.add("active");
        }
    } else {
        // check if previous weather is an option here, and use that if so:
        if (thisMapData.weather.indexOf(previousWeather) !== -1) {
            currentWeather = previousWeather;
        } else {
            currentWeather = getRandomElementFromArray[thisMapData.weather];
        }
    }
}



function changeWeather(newWeather) {
    if(newWeather != currentWeather) {

    }
}

// random change over time, if array length > 1 ###
// play sound