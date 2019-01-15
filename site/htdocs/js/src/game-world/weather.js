function setupWeather() {

    if (!thisMapData[currentMap].isInside) {
        // check if any outside weather is stored:
        if (outsideWeather != "") {
            changeWeather(outsideWeather);
        } else {
            var previousWeather = currentWeather;
            if (thisMapData[currentMap].weather.length == 1) {
                changeWeather(thisMapData[currentMap].weather[0]);
            } else {
                // check if previous weather is an option here, and use that if so:
                if (thisMapData[currentMap].weather.indexOf(previousWeather) !== -1) {
                    changeWeather(previousWeather);
                } else {
                    changeWeather(getRandomElementFromArray(thisMapData[currentMap].weather));
                }
            }
        }
        outsideWeather = "";
    } else {
        if (outsideWeather == "") {
            // store the outside weather:
            outsideWeather = currentWeather;
            changeWeather("");
        }
    }
    weatherLastChangedTime = hero.totalGameTimePlayed;
}

function checkForWeatherChange() {
    if (!thisMapData[currentMap].isInside) {
        if (thisMapData[currentMap].weather.length > 1) {
            if ((hero.totalGameTimePlayed - weatherLastChangedTime) > minTimeBetweenWeatherChanges) {
                changeWeather(getRandomElementFromArray(thisMapData[currentMap].weather));
            }
        }
    }
}

function changeWeather(newWeather) {
    if (newWeather != currentWeather) {
        weatherLastChangedTime = hero.totalGameTimePlayed;
        if (currentWeather != "") {
            document.getElementById(currentWeather).classList.remove("active");
        }
        currentWeather = newWeather;
        if (currentWeather != "") {
            document.getElementById(currentWeather).classList.add("active");
        }

        // see if relevant sound exists:
        if (currentWeather in soundEffects) {
            // needs to fade in, loop, fade out when changed ###
            audio.playSound(soundEffects[currentWeather], 0);
        }
    }
}