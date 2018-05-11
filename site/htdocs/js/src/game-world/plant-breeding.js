var possibleBreedablePlants = [1, 2, 3, 5, 6, 23];


/*
// make a clone of this:
var possibleBreedablePlantsRemaining = possibleBreedablePlants.slice(0);
*/

// array built so that "1-2": 3 means if species #1 and species #2 are bred, then the result is species #3
// the smaller number is a;lways first in the key (eg. 1-2, not 2-1)



// do each for flowers, herbs and trees ########





function initialisePlantBreeding() {
    const plantBreedingPRNG = new pseudoRandomNumberGenerator(characterId);
    // sort the results so that they're different for each character, so it can't be spoiled:
    // (the player can always buy a particular seed that they're after if they want)
    possibleBreedablePlants.sort(function(a, b) {
        if ((plantBreedingPRNG.nextFloat()) < 0.5) {
            return -1;
        } else {
            return 1;
        }
    });

    var plantBreeding = {}
    var thisKey;
    var arrayCounter = 0;
    var thisResultType;

    for (var i = 0; i < possibleBreedablePlants.length; i++) {
        for (var j = 0; j < possibleBreedablePlants.length; j++) {
            if (i != j) {
                if (possibleBreedablePlants[i] < possibleBreedablePlants[j]) {
                    thisKey = possibleBreedablePlants[i] + "-" + possibleBreedablePlants[j];
                } else {
                    thisKey = possibleBreedablePlants[j] + "-" + possibleBreedablePlants[i];
                }
                if (!(plantBreeding[thisKey])) {
                    do {
                        arrayCounter++;
                        if (arrayCounter > possibleBreedablePlants.length) {
                            arrayCounter = 0;
                        }
                        thisResultType = possibleBreedablePlants[arrayCounter];
                        // make sure this offspring isn't the same as either parent:

                    } while ((thisResultType == possibleBreedablePlants[j]) || (thisResultType == possibleBreedablePlants[i]));
                    plantBreeding[thisKey] = possibleBreedablePlants[arrayCounter];
                }
            }
        }
    }






    // debug
    // build output table
    var markup = '<table style="background:#fff;position:absolute;left:20%;top:20%;">';
    for (var i = 0; i <= possibleBreedablePlants.length; i++) {
        markup += '<tr>';
        for (var j = 0; j <= possibleBreedablePlants.length; j++) {
            markup += '<td style="border:1px solid #cecece;padding:6px;">';
            if (i == 0) {
                if (j == 0) {
                    markup += 'x';
                } else {
                    markup += '<img src="/images/game-world/inventory-items/' + possibleBreedablePlants[j - 1] + '.png" title="' + currentActiveInventoryItems[(possibleBreedablePlants[j - 1])].shortname + '">';
                }
            } else {
                if (j == 0) {
                    markup += '<img src="/images/game-world/inventory-items/' + possibleBreedablePlants[i - 1] + '.png" title="' + currentActiveInventoryItems[(possibleBreedablePlants[i - 1])].shortname + '">';
                } else {
                    if (i == j) {
                        markup += '<img src="/images/game-world/inventory-items/' + possibleBreedablePlants[i - 1] + '.png" title="' + currentActiveInventoryItems[(possibleBreedablePlants[i - 1])].shortname + '">';
                    } else {
                        if (possibleBreedablePlants[i - 1] < possibleBreedablePlants[j - 1]) {
                            thisKey = possibleBreedablePlants[i - 1] + "-" + possibleBreedablePlants[j - 1];
                        } else {
                            thisKey = possibleBreedablePlants[j - 1] + "-" + possibleBreedablePlants[i - 1];
                        }
                        markup += '<img src="/images/game-world/inventory-items/' + plantBreeding[thisKey] + '.png" title="' + currentActiveInventoryItems[(plantBreeding[thisKey])].shortname + '">';
                    }
                }
            }
            markup += '</td>';
        }
        markup += '</tr>';
    }
    markup += '</table>';
    document.getElementById('gameWrapper').insertAdjacentHTML('beforeend', markup);
    // end debug



}