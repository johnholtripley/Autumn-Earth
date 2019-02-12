function setupWeather() {
updatePossibleWeather();
    if (isOverWorldMap) {
        // check if any outside weather is stored:
        if (outsideWeather != "") {
            changeWeather(outsideWeather);
        } else {
            var previousWeather = currentWeather;




            if (allPossibleWeather.length == 1) {
                changeWeather(allPossibleWeather[0]);
            } else {
                // check if previous weather is an option here, and use that if so:
                if (allPossibleWeather.indexOf(previousWeather) !== -1) {
                    changeWeather(previousWeather);
                } else {
                    changeWeather(getRandomElementFromArray(allPossibleWeather));
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


function updatePossibleWeather() {
 allPossibleWeather = [];
// console.log(visibleMaps,thisMapData);
for (var m = 0; m < visibleMaps.length; m++) {
 //   console.log(visibleMaps[m],"***",thisMapData[(visibleMaps[m])]);
allPossibleWeather = allPossibleWeather.concat(thisMapData[(visibleMaps[m])].weather);
}
}

function checkForWeatherChange() {
    if (isOverWorldMap) {
        if (allPossibleWeather.length > 1) {
            if ((hero.totalGameTimePlayed - weatherLastChangedTime) > minTimeBetweenWeatherChanges) {
                changeWeather(getRandomElementFromArray(allPossibleWeather));
            }
        }
    }
}

function changeWeather(newWeather) {
    console.log(newWeather);
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