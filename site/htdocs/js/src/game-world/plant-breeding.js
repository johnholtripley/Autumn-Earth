var possiblePlantBreedingResults = [10, 12, 16, 20, 34];
// array built so that "1-2": 3 means if species #1 and species #2 are bred, then the result is species #3
// make sure the smaller number if first in the key (eg. 1-2, not 2-1)



var plantBreeding = {
    "1-2": 0,
    "1-3": 0,
    "2-3": 0,
    "2-4": 0,
    "2-5": 0
};


// sort the results so that they're different for each character, so it can't be spoiled.
// player can always buy a particular seed that they're after if they want

const plantBreedingPRNG = new pseudoRandomNumberGenerator(characterId);

possiblePlantBreedingResults.sort(function(a, b) {
    if ((plantBreedingPRNG.nextFloat()) < 0.5) {
        return -1;
    } else {
        return 1;
    }
});
// map these values in:
var counter = 0;
for (var i in plantBreeding) {
    plantBreeding[i] = possiblePlantBreedingResults[counter];
    counter++;
}