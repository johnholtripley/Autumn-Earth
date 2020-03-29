'use strict';
var audioContext = null;
var soundGainNode;
//var musicGainNode;
var soundEffects = {};
var soundsToLoad = {
    'coins': '../sounds/coins-NOT_MINE-wow.mp3',
    'bookOpen': '../sounds/book-open-NOT_MINE-wow.mp3',
    'chestOpen': '../sounds/chest-open-NOT_MINE-wow.mp3',
    'bagOpen': '../sounds/bag-open-NOT_MINE-wow.mp3',
    'buttonClick': '../sounds/button-press-NOT_MINE-wow.mp3',
    'hen': '../sounds/hen-NOT_MINE.mp3',
    'horse': '../sounds/horse-NOT_MINE.mp3',
    'doe': '../sounds/doe-NOT_MINE.mp3',
    'lever': '../sounds/lever-NOT_MINE.mp3',
    'keys': '../sounds/keys-NOT_MINE-wow.mp3',
    'unlock': '../sounds/unlock-NOT_MINE-wow.mp3',
    'gather1': '../sounds/gather-herb-NOT_MINE-wow.mp3',
    'gather4': '../sounds/mining-NOT_MINE-wow.mp3',
    'rain': '../sounds/rain-NOT_MINE-youtube.mp3',
    'questComplete': '../sounds/quest-complete-NOT_MINE-wow.mp3',
    'dyeing': '../sounds/dyeing-NOT_MINE-wow.mp3',
    'weaving': '../sounds/tailoring-NOT_MINE.mp3',
    'pouring': '../sounds/pour-water-NOT_MINE.mp3',
    'digging': '../sounds/digging-NOT_MINE.mp3',
    'cardCraft': '../sounds/craft-card-NOT_MINE-hearthstone.mp3',
    'foundChest': '../sounds/found-treasure-NOT_MINE-wow.mp3'
};


var loadBuffer = function(url, name) {
    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";
    request.onload = function() {
        audioContext.decodeAudioData(
            request.response,
            function(buffer) {
                if (!buffer) {
                    console.log('error decoding file data: ' + url);
                    return;
                }
                soundEffects[name] = buffer;
            },
            function(error) {
                console.log('decodeAudioData error', error);
            }
        );
    }
    request.onerror = function() {
        console.log('audio XHR error');
    }
    request.send();
};



var audio = {
    lastTrack: "",
    playingHourChime: false,
    init: function() {
        try {
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            audioContext = new AudioContext();
            soundGainNode = audioContext.createGain();
            soundGainNode.connect(audioContext.destination);
            for (var name in soundsToLoad) {
                loadBuffer(soundsToLoad[name], name);
            }
        } catch (e) {
            // web audio API not supported
        }
    },

    initMusic: function(songName) {
        audio[songName] = new Audio();
        audio[songName].id = songName;
        var src = document.createElement("source");
        src.type = "audio/mpeg";
        src.src = "/music/game-world/" + songName + ".mp3";
        audio[songName].appendChild(src);
        audio[songName + 'Gain'] = audioContext.createGain();
        // get this from the settings:      

        audio[songName + 'Source'] = audioContext.createMediaElementSource(audio[songName]);
        audio[songName + 'Source'].connect(audio[songName + 'Gain']);
        audio[songName + 'Gain'].connect(audioContext.destination);
        audio[songName].addEventListener("ended", audio.removeMusic, false);
    },

    removeMusic: function(e) {
        var songName = e.target.id;
        audio[songName].removeEventListener("ended", audio.removeMusic, false);
        delete audio[songName];
        delete audio[songName + 'Source'];
        delete audio[songName + 'Gain'];
        if (audio.activeTrack == songName) {
            audio.activeTrack = undefined;
        }
    },

    playSound: function(buffer, delay, numberToPlay, volumeAdjustment) {
        if (typeof numberToPlay === "undefined") {
            numberToPlay = 0;
        }
        var source = audioContext.createBufferSource();
        source.buffer = buffer;
        source.numberToPlay = numberToPlay;
        if (typeof volumeAdjustment !== "undefined") {
            // don't use 100% of the main sound volume:
            var variableVolumeSoundGainNode = audioContext.createGain();
            variableVolumeSoundGainNode.gain.value = volumeAdjustment / gameSettings.soundVolume;
            variableVolumeSoundGainNode.connect(audioContext.destination);
            source.connect(variableVolumeSoundGainNode);
        } else {
            // use the main gain volume:
            source.connect(soundGainNode);
        }
        if (numberToPlay > 1) {
            source.addEventListener('ended', function soundEnded(e) {
                if (this.numberToPlay > 1) {
                    audio.playSound(this.buffer, 0, this.numberToPlay - 1);
                }
                // remove this event listener:
                return e.currentTarget.removeEventListener('ended', soundEnded, false);
            }, false);
        }
        if (!source.start) {
            source.start = source.noteOn;
        } else {
            source.start(delay);
        }

    },


    playMusic: function(newTrack) {
        if (typeof audio.activeTrack !== "undefined") {
            if (audio.activeTrack != newTrack) {

                audio.initMusic(newTrack);
                var fadeTime = 6;
                var currentTime = audioContext.currentTime;
                // fade current out:
                audio[audio.activeTrack + 'Gain'].gain.linearRampToValueAtTime(gameSettings.musicVolume, currentTime);
                audio[audio.activeTrack + 'Gain'].gain.linearRampToValueAtTime(0, currentTime + fadeTime);
                // fade new in:
                audio[newTrack + 'Gain'].gain.linearRampToValueAtTime(0, 0);
                audio[newTrack + 'Gain'].gain.linearRampToValueAtTime(gameSettings.musicVolume, fadeTime);
                audio[newTrack].play();
                audio.activeTrack = newTrack;
                audio.lastTrack = newTrack;
            }

        } else {
            // make sure it wasn't just played:
            if (newTrack != audio.lastTrack) {
                // nothing playing currently:
                audio.initMusic(newTrack);
                audio[newTrack].play();
                audio.activeTrack = newTrack;
                audio.lastTrack = newTrack;
                // set initial volume to match settings:
                audio[audio.activeTrack + 'Gain'].gain.setValueAtTime(gameSettings.musicVolume, audioContext.currentTime);
            }
        }
    },

    fadeOutMusic: function(whichTrack, fadeTime) {


        if (typeof audio[whichTrack] !== undefined) {
            //  audio[whichTrack].pause();

            var currentTime = audioContext.currentTime;
            audio[whichTrack + 'Gain'].gain.linearRampToValueAtTime(gameSettings.musicVolume, currentTime);
            audio[whichTrack + 'Gain'].gain.linearRampToValueAtTime(0, currentTime + fadeTime);
            audio[whichTrack].removeEventListener("ended", audio.removeMusic, false);
            audio.lastTrack = '';
            audio.activeTrack = undefined;
            delete audio[whichTrack];
            delete audio[whichTrack + 'Source'];
            delete audio[whichTrack + 'Gain'];
        }
    },

    adjustEffectsVolume: function() {
        gameSettings.soundVolume = soundVolume.value;
        if (typeof soundGainNode !== "undefined") {
            soundGainNode.gain.setValueAtTime(gameSettings.soundVolume, 0);
        }
    },

    adjustMusicVolume: function() {
        gameSettings.musicVolume = musicVolume.value;
        if (typeof audio.activeTrack !== "undefined") {
            audio[audio.activeTrack + 'Gain'].gain.setValueAtTime(gameSettings.musicVolume, audioContext.currentTime);
        }
    },

    loadAmbientSounds: function(soundsToLoad) {
        for (var soundName in soundsToLoad) {
            loadBuffer(soundsToLoad[soundName], soundName);
        }
    },

    checkForAmbientSounds: function() {
        var combinedVisbleAmbientSounds = [];
        for (var m = 0; m < visibleMaps.length; m++) {
            if (thisMapData[visibleMaps[m]].ambientSounds) {
                for (var thisSound in thisMapData[visibleMaps[m]].ambientSounds) {
                    if (!(thisSound in combinedVisbleAmbientSounds)) {
                        combinedVisbleAmbientSounds[thisSound] = thisMapData[visibleMaps[m]].ambientSounds[thisSound];
                    }
                }
            }
        }
        if ((hero.totalGameTimePlayed - timeSinceLastAmbientSoundWasPlayed) > minTimeBetweenAmbientSounds) {
            if (getRandomIntegerInclusive(1, 240) == 1) {
                timeSinceLastAmbientSoundWasPlayed = hero.totalGameTimePlayed;
                audio.playSound(soundEffects[getRandomKeyFromObject(combinedVisbleAmbientSounds)], 0);
            }
        }
        for (var m = 0; m < visibleMaps.length; m++) {
            if (thisMapData[visibleMaps[m]].hourChime) {
                var now = new Date();
                if (now.getMinutes() < 1) {
                    if (!audio.playingHourChime) {
                        audio.playingHourChime = true;
                        audio.playSound(soundEffects["hourChime"], 0, keepWithinRange(now.getHours(), 1, 12));
                    }
                } else {
                    audio.playingHourChime = false;
                }
            }
        }
    }
}
function updateCartographicMiniMap() {

    // cartography canvas is 246px wide
    var cartographyUnits = 246 / (mapTilesX * tileW);

    var x = hero.x * cartographyUnits;
    var y = hero.y * cartographyUnits;
    var innerRadius = 0;
    var outerRadius = 35;

    var gradient = offScreenCartographyContext.createRadialGradient(x, y, innerRadius, x, y, outerRadius);
    gradient.addColorStop(0, 'rgb(255,255,255)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');

    offScreenCartographyContext.arc(x, y, outerRadius, 0, 2 * Math.PI);
    offScreenCartographyContext.fillStyle = gradient;
    offScreenCartographyContext.fill();

    cartographyContext.clearRect(0, 0, 246, 246);
    cartographyContext.globalCompositeOperation = 'copy';
    cartographyContext.drawImage(offScreenCartographyCanvas, 0, 0);
    cartographyContext.globalCompositeOperation = 'source-atop';
    cartographyContext.drawImage(canvasMapImage, 0, 0);
}

function initCartographicMap() {
    canvasMapImage.src = "/game-world/generateCartographicMap.php?playerId=" + characterId + "&dungeonName=" + randomDungeonName + "&plotChests=true&requestedMap=" + newMap;
    canvasMapImage.onload = function() {
        // load the mask (if any) so that previously uncovered areas are revealed:
        //console.log('getting mask - /game-world/getCartographicMapMask.php?chr=' + characterId + '&dungeonName=' + randomDungeonName + '&currentMap=' + newMap);   
        canvasMapMaskImage.src = '/game-world/getCartographicMapMask.php?chr=' + characterId + '&dungeonName=' + randomDungeonName + '&currentMap=' + newMap + '&cache=' + Date.now();
        canvasMapMaskImage.onload = function() {        
            offScreenCartographyContext.clearRect(0, 0, 246, 246);
            offScreenCartographyContext.drawImage(canvasMapMaskImage, 0, 0);
            updateCartographicMiniMap();
        }
    }
}

function saveCartographyMask() {
    var dataURL = offScreenCartographyCanvas.toDataURL();
    postData('/game-world/saveCartographicMapMask.php', 'chr=' + characterId + '&dungeonName=' + randomDungeonName + '&currentMap=' + currentMap + '&data=' + dataURL);
}

/*colourNames = ["",
    "Crimson",
    "Yellow",
    "Orange",
    "Blue",
    "Purple",
    "Green",
    "Brown",
    "White",
    "Pink",
    "(light yellow/cream)",
    "(light orange/coral)",
    "Aquamarine",
    "Violet",
    "Celadon",
    "Tawny",
    "Black",
    "Ruby/Maroon",
    "(dark yellow/amber)",
    "(dark orange/sienna)",
    "(dark blue/sapphire)",
    "(indigo/imperial purple)",
    "(dark green/emerald/olive/)",
    "(dark brown/chestnut)",
    "Grey"
];
*/


function getColourName(colour, itemType) {
    var colourName = "";
    if (typeof colour !== "undefined") {
        // check it's not got an inherent colour:
        if (currentActiveInventoryItems[itemType].hasInherentColour != 1) {
            colourName = colourNames[colour];
        }
    }
    return colourName;
}



function mixColours(coloursToMix) {
    // use to get the resulting colour from an array with any number of colours passed in.
    // eg. resultingColour = mixColours([4,2,8,16,16,16,16,16,16,16,16,16]);
    // display name would then be colourNames[resultingColour]
    var colIndex = 0;
    var amountOfBlack = 0;
    var amountOfWhite = 0;
    var colourQuantities = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (var i = 0; i < coloursToMix.length; i++) {
        colourQuantities[(coloursToMix[i])]++;
        colIndex |= coloursToMix[i];
        // check for black and white bit in this colour:
        if (coloursToMix[i] == (16 | coloursToMix[i])) {
            amountOfBlack++;
        }
        if (coloursToMix[i] == (8 | coloursToMix[i])) {
            amountOfWhite++;
        }
    }
    // determine if there was one colour more prevalent than the others - if so, make the output colour this colour:
    for (var i = 0; i < colourQuantities.length; i++) {
        if (colourQuantities[i] / coloursToMix.length > 0.7) {
            colIndex = i;
            break;
        }
    }
    if (colIndex > 24) {
        // colour has both black and white - see if one outweighs the other:
        if (amountOfBlack > amountOfWhite) {
            colIndex -= 8;
        } else if (amountOfBlack < amountOfWhite) {
            colIndex -= 16;
        } else {
            // equal amounts:
            colIndex -= 24;
        }
    }
    return colIndex;
}
// frame rate:
const animationFramesPerSecond = 16;
var lastTime = 0;
var elapsed = 0;
var timeSinceLastFrameSwap = 0;
var currentAnimationFrame = 0;
const animationUpdateTime = (1000 / animationFramesPerSecond);

var gameCanvas, gameContext, gameMode, cartographyContext, cartographyCanvas, offScreenCartographyCanvas, offScreenCartographyContext, canvasMapImage, canvasMapImage, canvasMapMaskImage, heroImg, shadowImg, tilledEarth, addedWater, ocean, oceanPattern, imagesToLoad, objInitLeft, objInitTop, dragStartX, dragStartY, inventoryCheck, timeSinceLastAmbientSoundWasPlayed, gameSettings, lightMap, lightMapOverlay, lightMapContext, activeGatheredObject, questResponseNPC, cursorPositionX, cursorPositionY, whichVisibleMap, allRecipes, availableScreenWidth, availableScreenHeight, housingData, inventorySlotReference;
var chestIdOpen = -1;
var currentWeather = "";
var outsideWeather = "";
var allPossibleWeather = [""];
var weatherLastChangedTime = 0;
const minTimeBetweenWeatherChanges = 5000;

var tileImages = [];
var npcImages = [];
var itemImages = [];
var backgroundImgs = [];



var interfaceIsVisible = true;
var activeAction = "";
var dowsing = {};
var gathering = {};
var surveying = {};
var plotPlacement = {};
var postObject = {
    "active": false
};
var retinueObject = {
    "active": false
};
var craftingObject = {

};
var retinueBaseLocationX = 200;
var retinueBaseLocationY = 350;
const costToRehireFollower = 110000;
var jumpMapId = null;
const titleTagPrefix = 'Autumn Earth';


// map changes:
var mapTransition = "";
var mapTransitionCurrentFrames = 1;
const mapTransitionMaxFrames = 60;
var activeDoorX = -1;
var activeDoorY = -1;

const characterId = 999;
var currentMap = 0;
var newMap = 0;
var thisMapData = {};
var mapTilesX = 0;
var mapTilesY = 0;

var tileGraphics = [];
const tileW = 48;
const tileH = tileW / 2;
var tileGraphicsToLoad = 0;
var npcGraphicsToLoad = 0;
var itemGraphicsToLoad = 0;
var canvasWidth = 800;
var canvasHeight = 600;

var randomDungeonName = "";
var randomDungeons = ["", "the-dwarrow-mines", "the-barrow-mines"];
var previousZoneName = "";

var currentActiveInventoryItems = {};
var maxNumberOfItemsPerSlot = 20;
var isSplitStackBeingDragged = false;

var possibleTitles = [];

var inventoryInterfaceIsBuilt = false;

var whichTransitionEvent = '';
var whichAnimationEvent = '';

var activeObjectForDialogue = '';
const closeDialogueDistance = 200;
var canCloseDialogueBalloonNextClick = false;
var thisSpeech = '';

var boosterCardsRevealed = 0;
var boosterCardsToAdd = [];
var thisChallengeNPC;

var questData = [];

var hasActivePet = false;
const breadCrumbLength = 16;
var activePetImages = [];

const minTimeBetweenAmbientSounds = 1200;

var colourNames = [];

var currentRecipePanelProfession = -1;
var currentItemGroupFilters = "";

var thisMapShopItemIds = '';
var shopCurrentlyOpen = -1;
const inflationModifier = 10;
const sellPriceModifier = 0.7;
const sellPriceSpecialismModifier = 0.8;
const buyPriceSpecialismModifier = 0.9;

const baseGatheringTime = 5000;
const gatheringStabilityModifier = 0.002;
const gatheringDepletionModifier = 2000;

const dowsingRingSize = 100;
const baseDowsingRange = 10;

const baseSurveyingTime = 1000;
const surveyingDepletionModifier = 500;

const facingsPossible = ["n", "e", "s", "w"];

// key bindings
var key = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

var hero = {
    x: 0,
    y: 0,
    z: 0,
    dx: 0,
    dy: 0,

    breadcrumb: [],

    width: 20,
    length: 20,
    centreX: 51,
    centreY: 68,
    speed: 4,
    //   animationFrameIndex: 0,
    //   timeSinceLastFrameSwap: 0,
    //   animationUpdateTime: (1000 / animationFramesPerSecond),
    spriteWidth: 83,
    spriteHeight: 88,
    isMoving: false,
    facing: 's',
    currentAnimation: 'idle',
    "animation": {
        "walk": {
            "length": 19,
            "start-row": 0,
            "n": 0,
            "e": 1,
            "s": 2,
            "w": 3
        },
        "run": {
            "length": 11,
            "start-row": 4,
            "n": 0,
            "e": 1,
            "s": 2,
            "w": 3
        },
        "idle": {
            "length": 31,
            "start-row": 8,
            "n": 0,
            "e": 1,
            "s": 2,
            "w": 3
        }
    }

};

var fae = {
    particles: [],
    maxParticles: 18,
    radiusAroundHero: 35,
    angleAroundHero: 0,
    targetX: 0,
    targetY: 0,
    currentState: "hero",
    abandonRadius: 500,
    zOffset: 40,
    oscillateOffset: 0
};

var isOverWorldMap = true;

var worldMap = [];
var visibleMaps = [];
const worldMapWidthPx = 2400;
const worldMapHeightPx = 1200;
const worldMapTileLength = 50;

var visibleMapsLoading = [];
function recipeSearchAndFilter() {
    // Convert to lowercase for search. Search name and if not, then description too

    // default to showing all:
    var foundKeys = hero.crafting[currentRecipePanelProfession].sortOrder;
    if (recipeSearch.value != '') {
        var searchTerm = recipeSearch.value.toLowerCase();
        foundKeys = [];
        for (var key in hero.crafting[currentRecipePanelProfession].recipes) {
            if (hero.crafting[currentRecipePanelProfession].recipes[key]['recipeName'].toLowerCase().indexOf(searchTerm) != -1) {
                foundKeys.push(key);
            } else if (hero.crafting[currentRecipePanelProfession].recipes[key]['recipeDescription'].toLowerCase().indexOf(searchTerm) != -1) {
                foundKeys.push(key);
            }
        }
    }
    var recipeListItems = document.querySelectorAll('#createRecipeList li'),
        i;
    // hide all:
    for (i = 0; i < recipeListItems.length; ++i) {
        recipeListItems[i].classList.remove('active');
    }
    // show those that are relevant:
    var numberBeingShown = 0;
    var recipeFilterSplit = recipeFilter.value.split(",");
    for (i = 0; i < foundKeys.length; i++) {
        // only show those keys that are in this filter set:
        if (recipeFilterSplit.indexOf(foundKeys[i].toString()) != -1) {
            document.getElementById("recipe" + foundKeys[i]).classList.add('active');
            numberBeingShown++;
        }
    }
    if (numberBeingShown == 0) {
        document.getElementById("noRecipesFound").classList.add('active');
    }
    if (UI.highlightedRecipe != "") {
        // check if the highlighted one is visible or not:
        if (!(document.getElementById(UI.highlightedRecipe).classList.contains('active'))) {
            document.getElementById(UI.highlightedRecipe).classList.remove('highlighted');
            craftingRecipeCreateButton.disabled = true;
            UI.highlightedRecipe = "";
        }
    }
    // resize the scroll bar (if it's used):
    if (thisDevicesScrollBarWidth > 0) {
        recipeCustomScrollBar.init();
    }
}

function recipeSearchInput() {
    if (recipeSearch.value != '') {
        clearRecipeSearch.classList.add("active");
    } else {
        clearRecipeSearch.classList.remove("active");
    }
    recipeSearchAndFilter();
}

function recipeSearchClear() {
    recipeSearch.value = '';
    clearRecipeSearch.classList.remove("active");
    recipeSearchAndFilter();
}

function recipeSelectComponents(whichRecipe) {
    releaseLockedSlots();
    craftingTimeBarOuter.style.display = 'none';
    startCrafting.style.display = 'block';
    startCrafting.disabled = true;
    craftingSelectComponentsPanel.classList.add("active");
    var recipeId = whichRecipe.substring(6);
    var recipeRequiresADye = false;
    var previousRecipeType = "-";
    var foundItemGroups;
    // make a copy so that influences don't get stored for next time:
    var thisRecipe = JSON.parse(JSON.stringify(hero.crafting[currentRecipePanelProfession].recipes[recipeId]));
    craftingObject = {
        'componentsAdded': [],
        'whichRecipe': whichRecipe,
        'thisRecipe': thisRecipe,
        'required': [],
        'componentInfluences': [],
        'craftedItem': {
            'type': parseInt(thisRecipe.creates),
            'quantity': 1,
            'quality': 0,
            'durability': 0,
            'effectiveness': 0,
            'currentWear': 0,
            'wrapped': 0,
            'colour': 0,
            'enchanted': 0,
            'hallmark': 0 - characterId,
            'inscription': ""
        },
        'finalItemName': thisRecipe.recipeName,
        'isCreating': false,
        'optionalDyeAdded': 0
    }

    var componentsRequiredMarkup = '<h4>Requires:</h4><ul>';
    // find all components that the player has that are usable for this recipe as well:
    var availableComponentMarkup = '<h4>Available:</h4><ul>';
    var thisItemAttributes, thisItemInfluences;
    var componentsFound = 0;
    var displayItemMarkup = '<div id="craftingOutput"><div id="craftingOutputAttributes"></div><img src="/images/game-world/inventory-items/' + thisRecipe.imageId + '.png" alt="' + thisRecipe.recipeName + '"></div><h3>' + thisRecipe.recipeName + '</h3><p>' + thisRecipe.recipeDescription + '</p>';
    // complete any undefined influences:
    var influencesWithDefinedValues = {
        "durability": 0,
        "effectiveness": 0,
        "quality": 0
    };

    var totalInfluences = {
        "durability": 0,
        "effectiveness": 0,
        "quality": 0
    };


    var thisComponentDurability, thisComponentEffectiveness, thisComponentQuality, thisComponentFound;


    var thisNumberOfComponents = thisRecipe.components.length;
    for (var i in thisRecipe.components) {
        if (thisRecipe.components[i].influence != null) {
            for (var j in thisRecipe.components[i].influence) {
                totalInfluences[j] += thisRecipe.components[i].influence[j];
                influencesWithDefinedValues[j]++;
            }
        } else {
            // create the individual keys to be tested for later:
            thisRecipe.components[i].influence = {
                "durability": undefined,
                "effectiveness": undefined,
                "quality": undefined
            }
        }
    }
    //console.log(thisRecipe.components);
    for (var i in thisRecipe.components) {
        thisComponentFound = false;
        thisItemInfluences = '';
        if (typeof thisRecipe.components[i].influence["effectiveness"] !== "undefined") {
            thisComponentEffectiveness = thisRecipe.components[i].influence["effectiveness"];
        } else {
            thisComponentEffectiveness = (100 - totalInfluences["effectiveness"]) / (thisNumberOfComponents - influencesWithDefinedValues["effectiveness"]);
        }
        if (typeof thisRecipe.components[i].influence["durability"] !== "undefined") {
            thisComponentDurability = thisRecipe.components[i].influence["durability"];
        } else {
            thisComponentDurability = (100 - totalInfluences["durability"]) / (thisNumberOfComponents - influencesWithDefinedValues["durability"]);
        }
        if (typeof thisRecipe.components[i].influence["quality"] !== "undefined") {
            thisComponentQuality = thisRecipe.components[i].influence["quality"];
        } else {
            thisComponentQuality = (100 - totalInfluences["quality"]) / (thisNumberOfComponents - influencesWithDefinedValues["quality"]);
        }

        // store these values:
        craftingObject.componentInfluences[thisRecipe.components[i].type] = {
            'effectiveness': thisComponentEffectiveness,
            'durability': thisComponentDurability,
            'quality': thisComponentQuality
        };
        if (!(isNaN(thisRecipe.components[i].type))) {
            // specific item - make sure not already added this (if more than 1 quantity required):
            componentsRequiredMarkup += '<li id="componentType' + thisRecipe.components[i].type + '">' + generateAttributeGraphicMarkup(thisComponentQuality, thisComponentDurability, thisComponentEffectiveness) + '<img src="/images/game-world/inventory-items/' + thisRecipe.components[i].type + '.png" class="planImage" alt="' + currentActiveInventoryItems[thisRecipe.components[i].type].shortname + '"><p>' + thisRecipe.components[i].quantity + 'x ' + currentActiveInventoryItems[thisRecipe.components[i].type].shortname + '</p></li>';
            foundItemGroups = findSlotItemIdInInventory(thisRecipe.components[i].type);
            if (foundItemGroups.length > 0) {
                for (var j = 0; j < foundItemGroups.length; j++) {
                    availableComponentMarkup += '<li id="fromSlot' + foundItemGroups[j] + '">' + generateCraftingSlotMarkup(hero.inventory[foundItemGroups[j]]) + '</li>';
                    // 'lock' this slot:
                    document.getElementById('slot' + foundItemGroups[j]).classList.add('locked');
                    componentsFound++;
                    thisComponentFound = true;
                }
            }
        } else {
            // item group:
            componentsRequiredMarkup += '<li id="componentType' + thisRecipe.components[i].type + '">' + generateAttributeGraphicMarkup(thisComponentQuality, thisComponentDurability, thisComponentEffectiveness) + '<img class="previewSlot" src="/images/game-world/inventory-items/' + thisRecipe.components[i].type + '.png" class="planImage" alt=""><p>' + thisRecipe.components[i].quantity + 'x ' + currentItemGroupFilters[(thisRecipe.components[i].type)] + '</p></li>';
            foundItemGroups = hasItemTypeInInventory(thisRecipe.components[i].type);

            if (thisRecipe.components[i].type == "dye") {
                recipeRequiresADye = true;
            }
            if (foundItemGroups.length > 0) {
                for (var j = 0; j < foundItemGroups.length; j++) {
                    availableComponentMarkup += '<li id="fromSlot' + foundItemGroups[j] + '">' + generateCraftingSlotMarkup(hero.inventory[foundItemGroups[j]]) + '</li>';
                    // 'lock' this slot:
                    document.getElementById('slot' + foundItemGroups[j]).classList.add('locked');
                    componentsFound++;
                    thisComponentFound = true;
                }
            }
        }
        craftingObject.required.push({ 'type': thisRecipe.components[i].type, 'quantity': thisRecipe.components[i].quantity });
        if (!thisComponentFound) {
            availableComponentMarkup += '<li class="componentMissing">You\'re missing a component type</li>';
        }
        if (thisRecipe.components[i].type != previousRecipeType) {
            availableComponentMarkup += '</ul><ul>';
        }
        previousRecipeType = thisRecipe.components[i].type;

    }

    if (componentsFound == 0) {
        availableComponentMarkup += '<li id="noComponentsAvailable"><p>You don\'t have any of the required components for this recipe.</p></li></ul><ul>';
    }
    // add the dye slot, only if the created item can be dyed:
    if (currentActiveInventoryItems[thisRecipe.creates].dyeable > 0) {
        componentsRequiredMarkup += '<li id="componentTypeAdditionalDye"><img src="/images/game-world/inventory-items/dye.png" alt=""><p>Dye (optional)</p></li>';
        // try and find any dyes that could be added to the recipe:

        // don't duplicate them if the recipe has a dye in it
        if (!recipeRequiresADye) {
            foundItemGroups = hasItemTypeInInventory('dye');
            if (foundItemGroups.length > 0) {
                for (var j = 0; j < foundItemGroups.length; j++) {
                    availableComponentMarkup += '<li id="fromSlot' + foundItemGroups[j] + '">' + generateCraftingSlotMarkup(hero.inventory[foundItemGroups[j]]) + '</li>';
                    // 'lock' this slot:
                    document.getElementById('slot' + foundItemGroups[j]).classList.add('locked');
                }
            }
        }
    }
    // add the enchant slot:
    componentsRequiredMarkup += '<li id="componentTypeAdditionalImbue"><img src="/images/game-world/inventory-items/enchant.png" alt=""><p>Imbue item (optional)</p></li>';

    componentsRequiredMarkup += '</ul>';
    availableComponentMarkup += '</ul>';
    selectComponentsItemBeingCreated.innerHTML = componentsRequiredMarkup;
    componentsAvailableForThisRecipe.innerHTML = availableComponentMarkup;
    displayItemBeingCreated.innerHTML = displayItemMarkup;
}

function releaseLockedSlots() {
    // clear any locked elements:
    var allLockedSlots = document.querySelectorAll('#inventoryPanels .locked');
    for (var i = 0; i < allLockedSlots.length; i++) {
        allLockedSlots[i].classList.remove("locked");
    }
}

function addCraftingComponents(fromSlotId, isADoubleClick) {

    var slotId = fromSlotId.substring(8);
    var amountUsed, thisQuantityDisplay, addedToSlot, thisTempAddedObject, okToAddThisComponent;
    var justAddedADye = false;
    // see how many of this type are still required:
    for (var i = 0; i < craftingObject.required.length; i++) {
        // check by type and group:
        okToAddThisComponent = false;
        if ((craftingObject.required[i].type == hero.inventory[slotId].type) || (craftingObject.required[i].type == currentActiveInventoryItems[hero.inventory[slotId].type].group)) {
            if (craftingObject.required[i].quantity > 0) {
                okToAddThisComponent = true;
            } else if (isADoubleClick) {
                // see if there's just one of this type already added:
                var variantsOfThisTypeAlreadyAdded = 0;
                var indexOfLastFound = -1;
                for (var j = 0; j < craftingObject.componentsAdded.length; j++) {
                    if (craftingObject.componentsAdded[j].type == craftingObject.required[i].type) {
                        variantsOfThisTypeAlreadyAdded++;
                        indexOfLastFound = j;
                    }
                }
                // if it's just 1, then it's easy to replace with a double click:
                if (variantsOfThisTypeAlreadyAdded == 1) {
                    // make sure it's not from the same slot:
                    if (craftingObject.componentsAdded[indexOfLastFound].fromSlot != slotId) {
                        // remove visually from added component list:
                        document.querySelector('#componentType' + craftingObject.required[i].type + ' .addedItemToRecipe').remove();
                        // restore quantity visually:
                        thisQuantityDisplay = document.querySelector('#fromSlot' + craftingObject.componentsAdded[indexOfLastFound].fromSlot + ' .qty');
                        thisQuantityDisplay.classList.remove('modified');
                        thisQuantityDisplay.textContent = hero.inventory[craftingObject.componentsAdded[indexOfLastFound].fromSlot].quantity;
                        // restore the amount needed:
                        craftingObject.required[i].quantity = craftingObject.componentsAdded[indexOfLastFound].quantity;
                        // remove from added object:
                        craftingObject.componentsAdded.splice(indexOfLastFound, 1);
                        // add new: 
                        okToAddThisComponent = true;
                    }
                }
            }
            if (okToAddThisComponent) {
                if (currentActiveInventoryItems[hero.inventory[slotId].type].group == "dye") {
                    justAddedADye = true;
                }
                amountUsed = craftingObject.required[i].quantity;
                if (craftingObject.required[i].quantity > hero.inventory[slotId].quantity) {
                    amountUsed = hero.inventory[slotId].quantity;
                }
                craftingObject.required[i].quantity -= amountUsed;
                craftingObject.componentsAdded.push({ 'fromSlot': slotId, 'quantity': amountUsed, 'type': craftingObject.required[i].type });
                thisQuantityDisplay = document.querySelector('#' + fromSlotId + ' .qty');
                thisQuantityDisplay.classList.add('modified');
                thisQuantityDisplay.textContent = hero.inventory[slotId].quantity - amountUsed;
                addedToSlot = document.getElementById('componentType' + hero.inventory[slotId].type);
                if (!addedToSlot) {
                    addedToSlot = document.getElementById('componentType' + currentActiveInventoryItems[hero.inventory[slotId].type].group);
                }
                if (addedToSlot) {
                    thisTempAddedObject = JSON.parse(JSON.stringify(hero.inventory[slotId]));
                    thisTempAddedObject.quantity = amountUsed;
                    addedToSlot.innerHTML += '<div class="addedItemToRecipe">' + generateCraftingSlotMarkup(thisTempAddedObject) + '</div>';
                }
            }
        }
    }
    // see if it's an optional dye:
    if (currentActiveInventoryItems[hero.inventory[slotId].type].group == 'dye') {
        // make sure the dye wasn't just added as part of the recipe:
        if (!justAddedADye) {
            craftingObject.componentsAdded.push({ 'fromSlot': slotId, 'quantity': 1, 'type': 'dye' });
            thisQuantityDisplay = document.querySelector('#' + fromSlotId + ' .qty');
            thisQuantityDisplay.classList.add('modified');
            thisQuantityDisplay.textContent = hero.inventory[slotId].quantity - 1;
            thisTempAddedObject = JSON.parse(JSON.stringify(hero.inventory[slotId]));
            thisTempAddedObject.quantity = 1;
            document.getElementById('componentTypeAdditionalDye').innerHTML += '<div class="addedItemToRecipe">' + generateCraftingSlotMarkup(thisTempAddedObject) + '</div>';
            craftingObject.optionalDyeAdded++;
        }
    }

    var allComponentsAdded = true;
    // check if that's all of the crafting components added now:
    for (var i = 0; i < craftingObject.required.length; i++) {
        if (craftingObject.required[i].quantity > 0) {
            allComponentsAdded = false;
        }
    }

    if (allComponentsAdded) {

        // any optional dyes will only account for 10% of the attributes:   
        if (craftingObject.optionalDyeAdded > 0) {
            // adjust the already determined influences to add up to 90% to allow 10% for the dyes:
            for (var i in craftingObject.componentInfluences) {
                craftingObject.componentInfluences[i].durability *= 0.9;
                craftingObject.componentInfluences[i].effectiveness *= 0.9;
                craftingObject.componentInfluences[i].quality *= 0.9;
            }
            // add up all dye attributes, average and then * by 0.1:
            var numberOfDyesAdded = 0;
            var dyeQuality = 0;
            var dyeDurability = 0;
            var dyeEffectiveness = 0;
            for (var i in craftingObject.componentsAdded) {
                if (craftingObject.componentsAdded[i].type == "dye") {
                    numberOfDyesAdded++;
                    dyeQuality += hero.inventory[(craftingObject.componentsAdded[i].fromSlot)].quality;
                    dyeDurability += hero.inventory[(craftingObject.componentsAdded[i].fromSlot)].durability;
                    dyeEffectiveness += hero.inventory[(craftingObject.componentsAdded[i].fromSlot)].effectiveness;
                }
            }
            dyeQuality *= 0.1 / numberOfDyesAdded;
            dyeDurability *= 0.1 / numberOfDyesAdded;
            dyeEffectiveness *= 0.1 / numberOfDyesAdded;
            craftingObject.componentInfluences['dye'] = {
                'effectiveness': dyeEffectiveness,
                'durability': dyeDurability,
                'quality': dyeQuality
            };
        }

        // display attributes of what will be crafted:
        var thisType;
        var coloursAdded = [];

        for (var i = 0; i < craftingObject.componentsAdded.length; i++) {
            thisType = craftingObject.componentsAdded[i].type;

            craftingObject.craftedItem.quality += determineAttributeValue(hero.inventory[(craftingObject.componentsAdded[i].fromSlot)].quality, craftingObject.componentInfluences[thisType].quality);
            craftingObject.craftedItem.durability += determineAttributeValue(hero.inventory[(craftingObject.componentsAdded[i].fromSlot)].durability, craftingObject.componentInfluences[thisType].durability);
            craftingObject.craftedItem.effectiveness += determineAttributeValue(hero.inventory[(craftingObject.componentsAdded[i].fromSlot)].effectiveness, craftingObject.componentInfluences[thisType].effectiveness);
            if (hero.inventory[(craftingObject.componentsAdded[i].fromSlot)].colour != 0) {
                coloursAdded.push(hero.inventory[(craftingObject.componentsAdded[i].fromSlot)].colour);
            }
        }

        craftingObject.craftedItem.quality = Math.floor(craftingObject.craftedItem.quality);
        craftingObject.craftedItem.durability = Math.floor(craftingObject.craftedItem.durability);
        craftingObject.craftedItem.effectiveness = Math.floor(craftingObject.craftedItem.effectiveness);

        document.getElementById('craftingOutputAttributes').innerHTML = generateAttributeGraphicMarkup(craftingObject.craftedItem.quality, craftingObject.craftedItem.durability, craftingObject.craftedItem.effectiveness);
        // determine colour:
        craftingObject.craftedItem.colour = mixColours(coloursAdded);
        if (craftingObject.craftedItem.colour != craftingObject.thisRecipe.defaultColour) {
            // change image and name prefix:
            var newColourImageSuffix = getColourName(craftingObject.craftedItem.colour, craftingObject.craftedItem.type);
            document.querySelector('#craftingOutput img').src = '/images/game-world/inventory-items/' + craftingObject.craftedItem.type + '-' + newColourImageSuffix.toLowerCase() + '.png';
            craftingObject.finalItemName = newColourImageSuffix + ' ' + currentActiveInventoryItems[craftingObject.craftedItem.type].shortname;
            document.querySelector('#displayItemBeingCreated h3').innerText = craftingObject.finalItemName;
        } else {
            document.querySelector('#displayItemBeingCreated h3').innerText = craftingObject.thisRecipe.recipeName;
            document.querySelector('#craftingOutput img').src = '/images/game-world/inventory-items/' + craftingObject.thisRecipe.imageId + '.png';
        }
        startCrafting.disabled = false;
    } else {
        startCrafting.disabled = true;
        // restore defaults:
        document.getElementById('craftingOutputAttributes').innerHTML = '';
        document.querySelector('#displayItemBeingCreated h3').innerText = craftingObject.thisRecipe.recipeName;
        document.querySelector('#craftingOutput img').src = '/images/game-world/inventory-items/' + craftingObject.thisRecipe.imageId + '.png';
    }
}

function startCraftingTimer() {
    // show short progress timer:
    craftingObject.timeRemaining = 100;
    craftingObject.depletionSpeed = 0.5;
    craftingObject.isCreating = true;
    UI.updateCraftingPanel();
    craftingTimeBarOuter.style.display = 'block';
    // hide Create button:
    startCrafting.style.display = 'none';
    // play sound for the active profession:
    audio.playSound(soundEffects[hero.crafting[currentRecipePanelProfession].name.toLowerCase()], 0);
}

function processCrafting() {
    craftingObject.timeRemaining -= craftingObject.depletionSpeed;
    if (craftingObject.timeRemaining <= 0) {
        craftingObject.isCreating = false;
        startCraftingProcess();
    }
    UI.updateCraftingPanel();
}

function startCraftingProcess() {
    hero.stats.itemsCrafted++;
    // unlock slots so new items can be stacked:
    releaseLockedSlots();
    // add to inventory (or post if full):
    inventoryCheck = canAddItemToInventory([craftingObject.craftedItem]);
    if (inventoryCheck[0]) {
        UI.showChangeInInventory(inventoryCheck[1]);
    } else {
        // send the item by post:
        var subjectLine = "Your crafted " + craftingObject.finalItemName;
        var message = "This is fine work";
        var whichNPC = "Artisan crafter";
        sendNPCPost('{"subject":"' + subjectLine + '","message":"' + message + '","senderID":"-1","recipientID":"' + characterId + '","fromName":"' + whichNPC + '"}', [craftingObject.craftedItem]);
        UI.showNotification("<p>My crafted item is in the post</p>");
    }

    // check for hiddenResults to see if any empty containers (for example) need giving back to the player:
    if (craftingObject.thisRecipe.hiddenCreates) {
        var thisReturnedObject;
        var returnedItems = craftingObject.thisRecipe.hiddenCreates.split(",");
        for (var i = 0; i < returnedItems.length; i++) {
            thisReturnedObject = {
                "type": parseInt(returnedItems[i]),
                "quantity": 1,
                "quality": 100,
                "durability": 100,
                "currentWear": 0,
                "effectiveness": 100,
                "colour": 0,
                "enchanted": 0,
                "hallmark": 0,
                "inscription": ""
            }
        }
        inventoryCheck = canAddItemToInventory([thisReturnedObject]);
        if (inventoryCheck[0]) {
            UI.showChangeInInventory(inventoryCheck[1]);
        } else {
            // send the item by post:
            var subjectLine = "Your returned crafting items";
            var message = "Returned items";
            var whichNPC = "Artisan crafter";
            sendNPCPost('{"subject":"' + subjectLine + '","message":"' + message + '","senderID":"-1","recipientID":"' + characterId + '","fromName":"' + whichNPC + '"}', [thisReturnedObject]);
            UI.showNotification("<p>My crafted item is in the post</p>");
        }




    }

    // also check for any optional dyes and return the glass bottles for those:
    if (craftingObject.optionalDyeAdded > 0) {
        var thisReturnedObject = {
            "type": 11,
            "quantity": craftingObject.optionalDyeAdded,
            "quality": 100,
            "durability": 100,
            "currentWear": 0,
            "effectiveness": 100,
            "colour": 0,
            "enchanted": 0,
            "hallmark": 0,
            "inscription": ""
        }
        inventoryCheck = canAddItemToInventory([thisReturnedObject]);
        if (inventoryCheck[0]) {
            UI.showChangeInInventory(inventoryCheck[1]);
        } else {
            // send the item by post:
            var subjectLine = "Your returned crafting items";
            var message = "Returned items";
            var whichNPC = "Artisan crafter";
            sendNPCPost('{"subject":"' + subjectLine + '","message":"' + message + '","senderID":"-1","recipientID":"' + characterId + '","fromName":"' + whichNPC + '"}', [thisReturnedObject]);
            UI.showNotification("<p>My crafted item is in the post</p>");
        }




    }



    // remove used components:
    for (var i = 0; i < craftingObject.componentsAdded.length; i++) {
        removeFromInventory(craftingObject.componentsAdded[i].fromSlot, craftingObject.componentsAdded[i].quantity);
    }
    // update the available items:
    recipeSelectComponents(craftingObject.whichRecipe);
    // restore Create button:
    startCrafting.style.display = 'block';
    craftingTimeBarOuter.style.display = 'none';

}

function determineAttributeValue(itemValue, influenceAmount) {
    return Math.sqrt((itemValue * influenceAmount * influenceAmount) / 100);
}

function findRecipeTierLevel(toolQuality) {
    // example quality -> tier output:
    // 0->0.0, 5->0.0, 10->0.1, 15->0.1, 20->0.2, 25->0.3, 30->0.5, 35->0.6, 40->0.8, 45->1.1, 50->1.3, 55->1.6, 60->2.0, 65->2.4, 70->2.9, 75->3.4, 80->4.0, 85->4.7, 90->5.6, 95->6.9, 100->10.0
    var diff = (toolQuality / 10);
    var tierLevel = 10 - (Math.sqrt(100 - diff * diff));
    return tierLevel;
}

function gradeAttribute(attributeValue) {
    /*
    Very poor 1-10
    Poor 11-35
    Average 36-65
    Good 66-90
    Exceptional 91-100
    */
    var map = [
        { max: 91, grade: "#04752c" },
        { max: 66, grade: "#82b11e" },
        { max: 36, grade: "#b98c45" },
        { max: 11, grade: "#ab471d" }
    ];
    for (var loop = 0; loop < map.length; loop++) {
        var data = map[loop];
        if (attributeValue >= data.max) return data.grade;
    }
    return "#b41119";
}

function generateCraftingSlotMarkup(thisItemObject) {
    var slotMarkup = '<div class="attributeSlot">';
    var theColourPrefix = "";
    var thisFileColourSuffix = "";
    var imageClassName = "";
    var thisColourName = getColourName(thisItemObject.colour, thisItemObject.type);
    if (thisColourName != "") {
        theColourPrefix = thisColourName + " ";
        thisFileColourSuffix = "-" + thisColourName.toLowerCase();
    }
    // check if it's a card:
    if (currentActiveInventoryItems[thisItemObject.type].action == "card") {
        imageClassName += 'players card';
    }
    slotMarkup += generateAttributeGraphicMarkup(thisItemObject.quality, thisItemObject.durability, thisItemObject.effectiveness);
    slotMarkup += '<img src="/images/game-world/inventory-items/' + thisItemObject.type + thisFileColourSuffix + '.png" ' + 'alt="' + theColourPrefix + currentActiveInventoryItems[thisItemObject.type].shortname + '" class="' + imageClassName + '">';

    slotMarkup += '<span class="qty">' + thisItemObject.quantity + '</span></div>';
    slotMarkup += '<p>' + theColourPrefix + currentActiveInventoryItems[thisItemObject.type].shortname + '</p>';
    return slotMarkup;
}

function generateAttributeGraphicMarkup(thisQuality, thisDurability, thisEffectiveness) {
    return '<svg xmlns="http://www.w3.org/2000/svg" height="100" width="100" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="' + gradeAttribute(thisEffectiveness) + '"/><path d="M6.699 75a50 50 0 0 1 0-50A50 50 0 0 1 50 0v50z" fill="' + gradeAttribute(thisQuality) + '"/><path d="M50 0a50 50 0 0 1 43.301 25 50 50 0 0 1 0 50l-43.3-25z" fill="' + gradeAttribute(thisDurability) + '"/></svg>'
}
function scrollbarWidth() {
    // Add a temporary scrolling element to the DOM, then check the difference between its outer and inner elements
    // only need to call once as it won't change
    var testDiv = document.createElement('div');
    testDiv.style.cssText = 'width:50px;height:50px;overflow-y:scroll;top:-200px;left:-200px;position:absolute;';
    var width = 0;
    var widthMinusScrollbars = 0;
    document.body.appendChild(testDiv);
    width = testDiv.offsetWidth;
    var widthMinusScrollbars = testDiv.clientWidth;
    document.body.removeChild(testDiv);
    return (width - widthMinusScrollbars);
}

function customScrollBar(element) {
    this.element = element;
    this.scrollingContent = this.element.firstElementChild;
    this.hasMouseEventsAttached = false;
    this.init = function() {
        this.translateY = 0;
        this.isBeingDragged = false;
        // ensure it's scrolled to the top if contents change:
        this.scrollingContent.scrollTop = 0;
        this.element.classList.remove("inActive");
        // hide the native scroll bar by making the content wider by the width of the scroll bar so its pushed off to the side:
        this.scrollingContent.style.width = (this.scrollingContent.offsetWidth + thisDevicesScrollBarWidth) + 'px';
        this.paneHeight = this.element.offsetHeight;
        this.scrollContentHeight = this.scrollingContent.scrollHeight;
        if (this.scrollContentHeight > this.paneHeight) {
            this.scrollbarRatio = (this.paneHeight / this.scrollContentHeight);
            this.draggerHeight = Math.floor(this.scrollbarRatio * this.paneHeight);
            this.dragger = this.element.querySelector(".dragger");
            this.dragger.style.height = this.draggerHeight + "px";
            // reset position in case the calling this after content has changed.
            this.dragger.style.transform = 'translateY(' + this.translateY + 'px)';
            // prevent the events being attached multiple times if inti is called again after a content change:
            if (!this.hasMouseEventsAttached) {
                // update dragger position when the content is scrolled natively:
                // use bind to pass this - http://stackoverflow.com/questions/1338599/the-value-of-this-within-the-handler-using-addeventlistener#answer-19507086
                this.scrollingContent.addEventListener('scroll', this.contentScroll.bind(this));
                // allow content to be scrolled by dragging the dragger:
                this.dragger.addEventListener('mousedown', this.startScrollDrag.bind(this));
                this.hasMouseEventsAttached = true;
            }
        } else {
            this.element.classList.add("inActive");
            // restore natural width:
            this.scrollingContent.removeAttribute('style');
        }

    }

    this.contentScroll = function() {
        // prevent it from re-calculating everything during a dragged scroll:
        if (!this.isBeingDragged) {
            var scrollOffset = this.scrollingContent.scrollTop;
            var handleOffset = Math.round(this.scrollbarRatio * scrollOffset);
            this.translateY = handleOffset;
            this.dragger.style.transform = 'translateY(' + this.translateY + 'px)';
        }
    }

    this.startScrollDrag = function(e) {
        // stop the content getting highlighted during the drag:
        e.preventDefault();
        this.initialClickPosition = e.pageY - this.translateY;
        this.isBeingDragged = true;
        // http://stackoverflow.com/questions/11565471/removing-event-listener-which-was-added-with-bind#answer-22870717
        this.mouseMoveEvent = this.handleScrollDrag.bind(this);
        document.addEventListener('mousemove', this.mouseMoveEvent, false);
        this.mouseUpEvent = this.endScrollDrag.bind(this);
        document.addEventListener('mouseup', this.mouseUpEvent, false);
    }

    this.handleScrollDrag = function(e) {
        this.translateY = (e.pageY - this.initialClickPosition);
        if (this.translateY < 0) {
            this.translateY = 0;
        }
        if (this.translateY + this.draggerHeight > this.paneHeight) {
            this.translateY = this.paneHeight - this.draggerHeight;
        }
        this.dragger.style.transform = 'translateY(' + this.translateY + 'px)';
        // move content accordingly:
        this.scrollingContent.scrollTop = (this.translateY / this.scrollbarRatio);
    }

    this.endScrollDrag = function(e) {
        this.isBeingDragged = false;
        // tidy up and remove event listeners:
        document.removeEventListener('mousemove', this.mouseMoveEvent, false);
        document.removeEventListener('mouseup', this.mouseUpEvent, false);
    }

    this.init();
}




// do this globally once:
var thisDevicesScrollBarWidth = scrollbarWidth();

// eg (not touch device)
var scrollBarElements = document.getElementsByClassName("customScrollBar");
for (var i = 0; i < scrollBarElements.length; i++) {
    if (thisDevicesScrollBarWidth > 0) {
        // create a reference to the element using its id:
        window[scrollBarElements[i].id] = new customScrollBar(scrollBarElements[i]);
    } else {
        // remove styling:
        scrollBarElements[i].classList.add("inActive");
    }
}

function processDowsing() {
    var closestDistance = Infinity;
    var thisDistance = -1;
    for (var m = 0; m < visibleMaps.length; m++) {
        whichVisibleMap = visibleMaps[m];
        if (thisMapData[whichVisibleMap].hiddenResources[dowsing.category]) {
            // find the nearest node - of the correct type and react to that:
            for (var i = 0; i < thisMapData[whichVisibleMap].hiddenResources[dowsing.category].length; i++) {
                thisDistance = getPythagorasDistance(hero.tileX, hero.tileY, thisMapData[whichVisibleMap].hiddenResources[dowsing.category][i].tileX, thisMapData[whichVisibleMap].hiddenResources[dowsing.category][i].tileY);
                if (thisDistance < closestDistance) {
                    closestDistance = thisDistance;

                }
            }

        }
    }
    if (thisDistance != -1) {
        dowsing.proximity = 100 - (100 * ((closestDistance) / dowsing.range));
        dowsing.proximity = capValues(dowsing.proximity, 0, 100);
    } else {
        dowsing.proximity = 0;
    }
}

function processSurveying() {
    surveying.timeRemaining -= surveying.depletionSpeed;
    if (surveying.timeRemaining <= 0) {
        activeAction = "";
        surveyingComplete();
    }
    UI.updateSurveyingPanel();
}

function surveyingComplete() {
    var thisDistance, thisResource, sourceTileX, sourceTileY, tryFacing, facingsRemaining;
    var resourceFound = false;
    for (var m = 0; m < visibleMaps.length; m++) {
        whichVisibleMap = visibleMaps[m];
        if (thisMapData[whichVisibleMap].hiddenResources[surveying.category]) {
            for (var i = 0; i < thisMapData[whichVisibleMap].hiddenResources[surveying.category].length; i++) {
                thisResource = thisMapData[whichVisibleMap].hiddenResources[surveying.category][i];
                thisDistance = getPythagorasDistance(hero.tileX, hero.tileY, thisResource.tileX, thisResource.tileY);
                if (thisDistance < 2) {
                    tryFacing = hero.facing;
                    switch (tryFacing) {
                        case 'n':
                            facingsRemaining = ['e', 'w', 's'];
                            break;
                        case 'e':
                            facingsRemaining = ['n', 's', 'w'];
                            break;
                        case 's':
                            facingsRemaining = ['n', 's', 'e'];
                            break;
                        case 'w':
                            facingsRemaining = ['e', 'w', 'n'];
                            break;
                    }
                    do {
                        sourceTileX = hero.tileX + relativeFacing[tryFacing]["x"];
                        sourceTileY = hero.tileY + relativeFacing[tryFacing]["y"];
                        tryFacing = facingsRemaining.shift();
                    } while (!tileIsClear(sourceTileX, sourceTileY) && (facingsRemaining.length > 0));
                    if (facingsRemaining.length > 0) {
                        thisResource.tileX = sourceTileX;
                        thisResource.tileY = sourceTileY;
                        thisResource.isTemporary = true;
                        thisMapData[whichVisibleMap].items.push(thisResource);
                        initialiseItem(thisMapData[whichVisibleMap].items[thisMapData[whichVisibleMap].items.length - 1]);
                        resourceFound = true;
                        // remove it from the list now the node has been generated:

                        thisMapData[whichVisibleMap].hiddenResources[surveying.category].splice(i, 1);
                    } else {
                        console.log("Error - Couldn't place resource node");
                    }
                    break;
                }
            }
        }
    }
    if (!resourceFound) {
        UI.showNotification("<p>I couldn't find any resources</p>");
    }
    surveyingStopped();
}

function surveyingStopped() {
    activeAction = "";
    surveying = {};
    surveyingPanel.classList.remove('active');
}
function animateFae() {
    //fae.z = Math.floor((Math.sin(fae.dz) + 1) * 8 + 40);
    fae.dz += 0.2;
    // fae.y+=8;
    for (var i = 0; i < fae.particles.length; i++) {
        fae.particles[i].alpha -= 0.1;
        if (fae.particles[i].alpha <= 0) {
            fae.particles.splice(i, 1);
        }
    }

    // add particles:
    if (fae.particles.length < fae.maxParticles) {
        if (getRandomInteger(1, 2) == 1) {
            var faeIsoX = findIsoCoordsX(fae.x, fae.y);
            var faeIsoY = findIsoCoordsY(fae.x, fae.y) - fae.oscillateOffset;
            var particleIsoX = faeIsoX + getRandomInteger(0, 8) - 4;
            var particleIsoY = faeIsoY + getRandomInteger(0, 8) - 4;
            // check it's in a circle from the fae's centre:
            if (isInRange(faeIsoX, faeIsoY, particleIsoX, particleIsoY, 6)) {
                fae.particles.push({ 'depth': findIsoDepth(fae.x, fae.y, fae.z), 'isoX': particleIsoX, 'isoY': particleIsoY, 'alpha': 1 });
            }
        }
    }
    if (notificationIsShowing) {
    // update the dialogue arrow to point to the fae:
  //  notificationSpeechArrow.style.transform = "translateX("+(faeIsoX-(canvasWidth/2)+311)+"px)";
  //  notificationSpeechArrow.style.transform = "translateX(-320px)";

    }
}

function moveFae() {
    switch (fae.currentState) {
        case "away":
            moveFaeToDestination(fae.targetX, fae.targetY);
            break;
        case "wait":
            if (isInRange(fae.x, fae.y, hero.x, hero.y, tileW * 3)) {
                // hero is close, move back now
                fae.currentState = "hero";
            }
            break;
        default:
            // "hero":
            fae.angleAroundHero += 4;
            // calc new destination coords:
            var destinationX = hero.x + fae.radiusAroundHero * Math.cos(fae.angleAroundHero * (Math.PI / 180));
            var destinationY = hero.y + fae.radiusAroundHero * Math.sin(fae.angleAroundHero * (Math.PI / 180));
            moveFaeToDestination(destinationX, destinationY);
            break;
    }
}

function moveFaeToDestination(x, y) {
    // check pythagoras distance, and if more than fae speed, move as far on that vector as fae speed, otherwise move to half way to destination so fae decelerates
    var distanceToDestination = getPythagorasDistance(fae.x, fae.y, x, y);
    if (distanceToDestination > fae.speed) {
        // move as far as it can:
        var ratio = fae.speed / distanceToDestination;
        fae.x += ratio * (x - fae.x);
        fae.y += ratio * (y - fae.y);
    } else {
        if (distanceToDestination < 2) {
            // close enough:
            fae.x = x;
            fae.y = y;
            if (fae.currentState == "away") {
                fae.currentState = "wait";
            }
        } else {
            // move half way:
            fae.x += (x - fae.x) / 2;
            fae.y += (y - fae.y) / 2;
        }
    }
    
    var targetZ = hero.z;
    if (targetZ > fae.z) {
        fae.z+=0.5;
    } else if (targetZ < fae.z) {
        fae.z-=0.5;
    }
    
}

function successfullyTilledEarth(tileX, tileY) {
        var thisMap = findMapNumberFromGlobalCoordinates(tileX, tileY);
    var localTileX = getLocalCoordinatesX(tileX);
    var localTileY = getLocalCoordinatesX(tileY);
    if (typeof thisMapData[thisMap].properties[localTileY][localTileX].tilled !== "undefined") {
        if (thisMapData[thisMap].properties[localTileY][localTileX].tilled == 1) {
            // remove anything planted there
            var itemAtLocation = findItemAtTile(tileX, tileY);
            if (itemAtLocation != -1) {
                thisMapData[thisMap].items.splice(itemAtLocation, 1);
            }
        }
        if (thisMapData[thisMap].properties[localTileY][localTileX].tilled == 0) {
            thisMapData[thisMap].properties[localTileY][localTileX].tilled = 1;
        }
        audio.playSound(soundEffects['digging'], 0);
        return true;
    } else {
        return false;
    }
}

function getTileWaterAmount(tileX, tileY) {
    var waterAmount = 0;
      var thisMap = findMapNumberFromGlobalCoordinates(tileX, tileY);
    var tileX = getLocalCoordinatesX(tileX);
    var tileY = getLocalCoordinatesX(tileY);
    if (typeof thisMapData[thisMap].properties[tileY][tileX].water !== "undefined") {
        waterAmount = thisMapData[thisMap].properties[tileY][tileX].water.amount;
    }
    return waterAmount;
}

function pourLiquid(tileX, tileY) {
    var holdingItemsSlot = findSlotByHash(hero.holding.hash);
    var thisMap = findMapNumberFromGlobalCoordinates(tileX, tileY);
    var tileX = getLocalCoordinatesX(tileX);
    var tileY = getLocalCoordinatesX(tileY);
    console.log(thisMap);
    // check how much liquid in this item's contains:
    if (hero.inventory[holdingItemsSlot].contains[0].quantity > 0) {
        audio.playSound(soundEffects['pouring'], 0);
      
        console.log(thisMapData[thisMap].properties[tileY][tileX]);
        if (typeof thisMapData[thisMap].properties[tileY][tileX].water === "undefined") {
            // create object:
            thisMapData[thisMap].properties[tileY][tileX].water = {};
            thisMapData[thisMap].properties[tileY][tileX].water.amount = 1;
        } else {
            thisMapData[thisMap].properties[tileY][tileX].water.amount++;
            checkWaterRunOff();
        }
        thisMapData[thisMap].properties[tileY][tileX].water.time = hero.totalGameTimePlayed;
        hero.inventory[holdingItemsSlot].contains[0].quantity--;
        updateGauge(holdingItemsSlot);
        UI.updateHeldItemGauge();
         console.log(thisMapData[thisMap].properties[tileY][tileX]);
    } else {
        UI.showNotification("<p>I need to refill this</p>");
    }

}

function checkWaterRunOff() {
    // see if any tiles are saturated and run the water into a neighbouring tile:
    // check elevation so water runs downwards
    // do this recursively
    // do this in a worker?
    // ########
}

function successfullyPlantSeed(tileX, tileY) {
    var wasSuccessful = false;
     var thisMap = findMapNumberFromGlobalCoordinates(tileX, tileY);
      var localTileX = getLocalCoordinatesX(tileX);
    var localTileY = getLocalCoordinatesY(tileY);
    if (thisMapData[thisMap].properties[localTileY][localTileX].tilled == 1) {
        if (findItemWithinArmsLength() == null) {
            var whichSlot = findSlotByHash(hero.holding.hash);
            // create object from the seed's actionValue
            var seedObject = JSON.parse(JSON.stringify(currentActiveInventoryItems[hero.inventory[whichSlot].type].actionValue));
            seedObject.tileX = tileX;
            seedObject.tileY = tileY;
            seedObject.timeLastHarvested = hero.totalGameTimePlayed;
            if (currentActiveInventoryItems[hero.inventory[whichSlot].type].dyeable > 0) {
                seedObject.colour = hero.inventory[whichSlot].colour;
            }
            // plant will have seed's attributes:
            seedObject.quality = hero.inventory[whichSlot].quality;
            seedObject.effectiveness = hero.inventory[whichSlot].effectiveness;
            seedObject.durability = hero.inventory[whichSlot].durability;

            thisMapData[thisMap].items.push(seedObject);
            initialiseItem(thisMapData[thisMap].items[(thisMapData[thisMap].items.length - 1)]);
            // reduce seed quantity in slot:
            reducedHeldQuantity(whichSlot);
            updateQuantity(whichSlot);
            UI.updateHeldItems();
            audio.playSound(soundEffects['gather1'], 0);
            wasSuccessful = true;
        } else {
            wasSuccessful = false;
        }
    } else {
        // needs an explanation maybe? ##
        wasSuccessful = false;
    }
    return wasSuccessful;
}

function checkCrop(itemObject) {
    var plantActedUpon = false;
    // check if scythe equipped ###

    // check if pollen equipped:
    if (hero.holding.type != '') {
        if (currentActiveInventoryItems[(hero.holding.type)].action == "pollen") {
            console.log("pollinate " + itemObject.state + ":4");
            if (itemObject.state == 4) {
                // cross fertilise - check this plant hasn't already got a seed:
                if (typeof itemObject.contains.seed === "undefined") {
                    plantActedUpon = true;
                    var whichSlot = findSlotByHash(hero.holding.hash);
                    // need to find the plant for this pollen (held in actionValue):
                    var pollenSpecies = currentActiveInventoryItems[hero.inventory[whichSlot].type].actionValue;
                    var plantSpecies = itemObject.type;
                    // find resultant plant:
                    var resultantPlantSpecies = plantSpecies;
                    var resultantPlantKey = plantSpecies;
                    if (pollenSpecies != plantSpecies) {
                        console.log(pollenSpecies, plantSpecies);

                        if (pollenSpecies < plantSpecies) {
                            resultantPlantKey = pollenSpecies + '-' + plantSpecies;
                        } else {
                            resultantPlantKey = plantSpecies + '-' + pollenSpecies;
                        }
                        resultantPlantSpecies = hero.plantBreeding[resultantPlantKey];
                    }
                    console.log("result", resultantPlantSpecies);
                    // if the resultant plant can be coloured, mix pollen and parent plant colours:
                    if (currentActiveInventoryItems[resultantPlantSpecies].dyeable > 0) {
                        var pollenColour = hero.inventory[whichSlot].colour;
                        var plantColour = itemObject.colour;
                        var resultantColour;

                        if ((typeof plantColour === "undefined") && (typeof pollenColour === "undefined")) {
                            // default to white:
                            resultantColour = 9;
                        } else {
                            // if either is null, then just use the other:
                            if (typeof plantColour === "undefined") {
                                resultantColour = pollenColour;
                            } else if (typeof pollenColour === "undefined") {
                                resultantColour = plantColour;
                            } else {
                                resultantColour = mixColours([plantColour, pollenColour]);
                            }
                        }


                    }
                    // needs to be the seed type, not the plant type:
                    var seedType = currentActiveInventoryItems[resultantPlantSpecies].actionValue;
                    // need to combine quality etc of the seed and plant:
                    var pollinatedSeedObject = {
                        "type": parseInt(seedType),
                        "colour": resultantColour,
                        "quality": Math.ceil((itemObject.quality + hero.inventory[whichSlot].quality) / 2),
                        "durability": Math.ceil((itemObject.durability + hero.inventory[whichSlot].durability) / 2),
                        "effectiveness": Math.ceil((itemObject.effectiveness + hero.inventory[whichSlot].effectiveness) / 2)
                    }


                    var maxSeeds = 6;
                    // the number of seeds is an exponential amount based on the plant and pollen's quality and effectiveness:
                    pollinatedSeedObject.quantity = Math.ceil(maxSeeds * ((itemObject.quality * hero.inventory[whichSlot].quality / 20000) + (itemObject.effectiveness * hero.inventory[whichSlot].effectiveness / 20000)));

                    pollinatedSeedObject = prepareInventoryObject(pollinatedSeedObject);
                    // add this to the parent plant's contains attribute:
                    itemObject.contains.seed = JSON.parse(JSON.stringify(pollinatedSeedObject));

                    // store the parent types so when harvested, that cross can be added to known crosses:
                    itemObject.contains.seed.crossBreedParents = resultantPlantKey;

                    UI.showNotification("<p>I've successfully pollinated that</p>");
                    // remove the used pollen:
                    reducedHeldQuantity(whichSlot);
                    updateQuantity(whichSlot);
                    UI.updateHeldItems();
                } else {
                    UI.showNotification("<p>I've already pollinated that</p>");
                }
            }
        }
    }

    if (!plantActedUpon) {
        switch (itemObject.state) {
            case 4:
                // gather pollen
                if (typeof itemObject.contains.pollen !== "undefined") {
                    // receive pollen - use plant's quality, durability, effectiveness, and if dyeable, its colour
                    var thisPollenObject = {
                        "type": itemObject.contains.pollen.type,
                        "quantity": itemObject.contains.pollen.quantity,
                        "quality": itemObject.quality,
                        "durability": itemObject.durability,
                        "effectiveness": itemObject.effectiveness
                    };
                    if (currentActiveInventoryItems[itemObject.type].dyeable > 0) {
                        if (typeof itemObject.colour !== "undefined") {
                            thisPollenObject.colour = itemObject.colour;
                        }
                    }
                    thisPollenObject = prepareInventoryObject(thisPollenObject);
                    inventoryCheck = canAddItemToInventory([thisPollenObject]);
                    if (inventoryCheck[0]) {
                        UI.showChangeInInventory(inventoryCheck[1]);
                        delete itemObject.contains.pollen;
                    } else {
                        UI.showNotification("<p>I don't have room in my bags for that</p>");
                    }
                }
                break;
            case 5:
                console.log("gathering seeds/fruit", itemObject.contains.seed, itemObject.contains.fruit);
                // gather any seeds:
                if (typeof itemObject.contains.seed !== "undefined") {
                    inventoryCheck = canAddItemToInventory([itemObject.contains.seed]);
                    if (inventoryCheck[0]) {
                        UI.showChangeInInventory(inventoryCheck[1]);

                        var thisParentKey = itemObject.contains.seed.crossBreedParents;
                        // load in the world graphic for this plant so the hero can plant it straight away:
                        var thisFileColourSuffix = "";




                        var resultingPlantType;
                        if (itemObject.contains.seed.crossBreedParents.toString().indexOf("-") == -1) {
                            resultingPlantType = itemObject.contains.seed.crossBreedParents;
                        } else {
                            resultingPlantType = hero.plantBreeding[thisParentKey];
                        }

                        var thisColourName = getColourName(itemObject.contains.seed.colour, resultingPlantType);
                        if (thisColourName != "") {
                            thisFileColourSuffix = "-" + thisColourName.toLowerCase();
                        }
                        var thisItemIdentifier = "item" + resultingPlantType + thisFileColourSuffix;
                        if (typeof itemImages[thisItemIdentifier] === "undefined") {
                            var fileSource = '/images/game-world/items/' + currentActiveInventoryItems[(resultingPlantType)].worldSrc + thisFileColourSuffix + '.png';
                            Loader.preload([{ name: thisItemIdentifier, src: fileSource }], function() { itemImages[thisItemIdentifier] = Loader.getImage(thisItemIdentifier) }, function() {});
                            // (no progress indicator needed)
                        }
                        // check if it's a new cross breed and add it to the known crosses:
                        if (typeof itemObject.contains.seed.crossBreedParents !== "undefined") {
                            // checking for this twice now - could be tidied up ############## :
                            if (itemObject.contains.seed.crossBreedParents.toString().indexOf("-") != -1) {
                                if (hero.plantCrossesKnown.indexOf(thisParentKey) === -1) {
                                    hero.plantCrossesKnown.push(thisParentKey);
                                    UI.showNotification("<p>I learnt a new cross breed&hellip;</p>");
                                    // update the horticulture panel:
                                    var horticulturePanelSlotsToUpdate = document.getElementsByClassName('parent' + thisParentKey);
                                    // there will only be 2 slots:
                                    horticulturePanelSlotsToUpdate[0].innerHTML = '<img src="/images/game-world/inventory-items/' + resultingPlantType + '.png"><p>' + currentActiveInventoryItems[hero.plantBreeding[thisParentKey]].shortname + '</p>';
                                    horticulturePanelSlotsToUpdate[1].innerHTML = '<img src="/images/game-world/inventory-items/' + resultingPlantType + '.png"><p>' + currentActiveInventoryItems[hero.plantBreeding[thisParentKey]].shortname + '</p>';
                                }
                            }

                        }

                        console.log("harvested seed");
                        itemObject.contains.seed = {};
                    } else {
                        UI.showNotification("<p>I don't have room in my bags for that</p>");
                    }
                }
                // gather fruit ###
                break;
        }
    }
}
function checkForGamePadInput() {
    if (Input.isUsingGamePad) {
        // added these next 3 lines to prevent occassional errors in Chrome:
        //if (typeof navigator.getGamepads()[0] !== "undefined") {
          //  if (navigator.getGamepads()[0] !== null) {
            //    if (typeof navigator.getGamepads()[0].timestamp !== "undefined") {
                    // check if an update has happened since the last one that was acted on:
                    if (navigator.getGamepads()[0].timestamp != Input.gameLastPadTimeStamp) {
                        // chrome needs the full navigator method to get the updated details, not a reference
                        Input.gameLastPadTimeStamp = navigator.getGamepads()[0].timestamp;
                        // left:
                        key[0] = navigator.getGamepads()[0].axes[0] <= -0.5;
                        // right:
                        key[1] = navigator.getGamepads()[0].axes[0] >= 0.5;
                        // up: 
                        key[2] = navigator.getGamepads()[0].axes[1] <= -0.5;
                        // down:
                        key[3] = navigator.getGamepads()[0].axes[1] >= 0.5;
                        // action (X):
                        key[4] = navigator.getGamepads()[0].buttons[2].value > 0;
                        // shift (right shoulder 1):
                        key[5] = navigator.getGamepads()[0].buttons[7].value > 0;
                    }
                }
         //   }
     //   }
 //   }
}
function checkForRespawns() {
  //  for(var map in thisMapData) {
    for (var m = 0; m < visibleMaps.length; m++) {
        var map = visibleMaps[m];
    for (var i = 0; i < thisMapData[map].items.length; i++) {
        switch (currentActiveInventoryItems[thisMapData[map].items[i].type].action) {
            case "node":
                if (thisMapData[map].items[i].state != "active") {
                    //console.log("check re-spawn: " + hero.totalGameTimePlayed + "-" + thisMapData[map].items[i].timeLastHarvested + " (" + (hero.totalGameTimePlayed - thisMapData[map].items[i].timeLastHarvested) + ") >= " + currentActiveInventoryItems[thisMapData[map].items[i].type].respawnRate);
                    if (hero.totalGameTimePlayed - thisMapData[map].items[i].timeLastHarvested >= currentActiveInventoryItems[thisMapData[map].items[i].type].respawnRate) {
                        thisMapData[map].items[i].state = "active";
                    }
                }
                break;
            case "crop":

                if (parseInt(thisMapData[map].items[i].state) < 5) {
                    // check water level:
                    var thisPlantPreferredWaterAmount = 0;
                    if (typeof thisMapData[map].items[i].additional !== "undefined") {
                        thisPlantPreferredWaterAmount = thisMapData[map].items[i].additional;
                    }
                    var waterDifference = Math.abs(getTileWaterAmount(thisMapData[map].items[i].tileX, thisMapData[map].items[i].tileY) - thisPlantPreferredWaterAmount);
                    if (hero.totalGameTimePlayed - thisMapData[map].items[i].timeLastHarvested >= currentActiveInventoryItems[thisMapData[map].items[i].type].respawnRate) {
                        // deteriorate the plant if not at its optimum water level:
                        thisMapData[map].items[i].quality -= 4 * waterDifference;
                        thisMapData[map].items[i].effectiveness -= 4 * waterDifference;
                        thisMapData[map].items[i].durability -= 4 * waterDifference;
                        thisMapData[map].items[i].quality = capValues(thisMapData[map].items[i].quality, 1, 100);
                        thisMapData[map].items[i].effectiveness = capValues(thisMapData[map].items[i].effectiveness, 1, 100);
                        thisMapData[map].items[i].durability = capValues(thisMapData[map].items[i].durability, 1, 100);
                        thisMapData[map].items[i].state++;
                        thisMapData[map].items[i].timeLastHarvested = hero.totalGameTimePlayed;
                    }
                } else {
                    // check if pollinated and self-pollinate if not:

                    if (typeof thisMapData[map].items[i].contains.seed === "undefined") {
                       

                        var seedType = currentActiveInventoryItems[(thisMapData[map].items[i].type)].actionValue;
                        // not as efficient than if pollinated manually:
                        var pollinatedSeedObject = {
                            "type": parseInt(seedType),
                            "quality": Math.ceil(thisMapData[map].items[i].quality * 0.8),
                            "durability": Math.ceil(thisMapData[map].items[i].durability * 0.8),
                            "effectiveness": Math.ceil(thisMapData[map].items[i].effectiveness * 0.8)
                        }
                      
                        if (typeof thisMapData[map].items[i].colour !== "undefined") {
                            pollinatedSeedObject.colour = thisMapData[map].items[i].colour;
                        }

                        var maxSeeds = 6;
                        // the number of seeds is an exponential amount based on the plant's quality and effectiveness:
                        pollinatedSeedObject.quantity = Math.ceil(maxSeeds * ((thisMapData[map].items[i].quality * thisMapData[map].items[i].quality / 20000) + (thisMapData[map].items[i].effectiveness * thisMapData[map].items[i].effectiveness / 20000)));

                   

                        pollinatedSeedObject = prepareInventoryObject(pollinatedSeedObject);
                        // add this to the parent plant's contains attribute:
                        thisMapData[map].items[i].contains.seed = JSON.parse(JSON.stringify(pollinatedSeedObject));
                        thisMapData[map].items[i].contains.seed.crossBreedParents = thisMapData[map].items[i].type;

                    }
                }
                break;
        }
    }
}
}


function processGathering() {
    // tool and action need to govern the rate of extraction
    gathering.quantity -= gathering.depletionSpeed;
    gathering.stability -= gathering.stabilitySpeed;

    gathering.quality = capValues(gathering.quality, 0, 100);
    gathering.purity = capValues(gathering.purity, 0, 100);
    gathering.stability = capValues(gathering.stability, 0, 100);
    gathering.quantity = capValues(gathering.quantity, 0, 100);

    // if any of the values are 0:
    if (gathering.quality * gathering.purity * gathering.stability * gathering.quantity == 0) {
        gatheringComplete();
    }
    UI.updateGatheringPanel();
}

function gatheringComplete() {
    if (gathering.stability == 0) {
        UI.showNotification("<p>I couldn't gather anything from that</p>");
        gatheringPanel.classList.remove('active');
    } else {
        var generatedObject = gathering.node.contains[0];
        var quantityOfItem = Math.floor((gathering.purity / 100) * (gathering.node.maxQuantity - gathering.quantity));
        // console.log("gathered " + quantityOfItem + "x " + currentActiveInventoryItems[generatedObject.type].shortname + " of " + gathering.quality + " quality");
        var createdMarkup = 'Yielded: <ol><li>';
        // used in case the type or colour have any random choices:
        var possibleGatheredTypes = generatedObject.type.toString().split("/");
        var possibleGatheredColours = generatedObject.colour.toString().split("/");
        activeGatheredObject = {
            "type": parseInt(getRandomElementFromArray(possibleGatheredTypes)),
            "quantity": quantityOfItem,
            "quality": gathering.quality,
            "durability": 100,
            "currentWear": 0,
            "effectiveness": 100,
            "colour": parseInt(getRandomElementFromArray(possibleGatheredColours)),
            "enchanted": 0,
            "hallmark": 0,
            "inscription": ""
        }
        createdMarkup += '<div>';
        createdMarkup += generateCraftingSlotMarkup(activeGatheredObject);
        createdMarkup += '</div></li></ol>';
        gatheringOutputSlot.innerHTML = createdMarkup;
    }
    gatheringStopped();
}

function gatheringStopped() {
    activeAction = "";
    // save any changes to the node (even if gathering was aborted by closing the panel):
    gathering.node.stability = gathering.stability;
    gathering.node.quantity = gathering.quantity;
    if ((gathering.node.quantity == 0) || (gathering.node.stability == 0)) {
        // reset the node, and its respawn timer:
        gathering.node.stability = gathering.node.maxStability;
        gathering.node.timeLastHarvested = hero.totalGameTimePlayed;
        gathering.node.state = "inactive";
    }
    if (gathering.node.isTemporary) {
        // loop through items and remove it:
        for (var i = 0; i < thisMapData[gathering.itemMap].items.length; i++) {
            if (thisMapData[gathering.itemMap].items[i] === gathering.node) {
                thisMapData[gathering.itemMap].items.splice(i, 1);
                break;
            }
        }
    }
    gathering = {};
}
// find Iso coords from 2d coords:
function findIsoCoordsX(x, y) {
    // return Math.floor((mapTilesY * tileW/2) -y/2 + x/2);
    return Math.floor((mapTilesY * tileW - y + x) / 2);
}

function findIsoCoordsY(x, y) {
    // the -tileH/2 is because the tile centre was at 0,0, and so the tip would be off the top of the screen
    //return Math.floor((x/4) + (y/4) - tileH/2);
    return Math.floor((x + y - (tileH * 2)) / 4);
}



// find 2d coords from iso coords:
function find2DCoordsX(isoX, isoY) {
    return isoX + tileH + (2 * isoY) - (mapTilesY * tileW) / 2;
}

function find2DCoordsY(isoX, isoY) {
    return 2 * isoY + tileH - isoX + (mapTilesY * tileW) / 2;
}

function findIsoDepth(x, y, z) {
    // isoZ = 0.6 * z


    /*
    // METHOD #1 ------------------
    // works perfectly for non-z depths:
    return findIsoCoordsY(x,y);
    // ----------------------------
    */


    /*
    // METHOD #2 ------------------
    // works well with z apart from clipped around the edges of tiles
    var tilePosition = getCurrentTileX(x) + (mapTilesX * getCurrentTileY(y));
    // weight the tile heavily to allow vertical depth within that range
    var adjustedTile = (tilePosition) * 999;
    // find position across tile
    var positionWithinTileX = x%tileW;
    var positionWithinTileY = y%tileH;
    // adjust by using iso position across the tile - weighting z depth more heavily:
    return adjustedTile+findIsoCoordsX(positionWithinTileX,positionWithinTileY)+findIsoCoordsY(positionWithinTileX,positionWithinTileY)+(z*z);
    // ----------------------------
    */

    /*
    // METHOD #3 ------------------
    // works well except for the back half of raised tiles
    var depth = findIsoCoordsY(x,(y+z));
    depth += findIsoCoordsY(x,y);
    //depth *= tileH/2;
     //   depth += z;
    if(z>0) {
    // just do this if it's in the top half of the tile:
    // ###########
       // depth += tileH/2;
    }
    return depth;
    // ----------------------------
    */


    // METHOD #4 ------------------
    // works well, apart from back half of the tile
    return (findIsoCoordsY(x, y) * tileW / 2) + (z * 2);
    // ----------------------------



}


// find non-iso coords for a tile
function getTileCentreCoordX(tileX) {
    return tileX * tileW + tileW / 2;
}

function getTileCentreCoordY(tileY) {
    return tileY * tileW + tileW / 2;
}


// find iso coords for a tile
function getTileIsoCentreCoordX(tileX, tileY) {
    return tileW / 2 * (mapTilesY - tileY + tileX);
}

function getTileIsoCentreCoordY(tileX, tileY) {
    return tileH / 2 * (tileY + tileX);
}


function getTileCoordsFromScreenPosition(screenCoordinateX, screenCoordinateY) {
    // find the difference in position between the cursor and the hero (at the centre of the screen):
    var xDiff = screenCoordinateX - (canvasWidth / 2);
    var yDiff = screenCoordinateY - (canvasHeight / 2);
    var nonIsoCoordX = find2DCoordsX(hero.isox + xDiff, hero.isoy + yDiff);
    var nonIsoCoordY = find2DCoordsY(hero.isox + xDiff, hero.isoy + yDiff);
    return [getTileX(nonIsoCoordX), getTileY(nonIsoCoordY)];
}


/*
DUPLICATE
// find current tile based on non-iso coords
function getCurrentTileX(x) {
    return Math.floor(x/tileW);
}
function getCurrentTileY(y) {
    return Math.floor(y/tileW);
}
*/

// find current tile based on non-iso coords
function getTileX(x) {
    return Math.floor(x / tileW);
}

function getTileY(y) {
    return Math.floor(y / tileW);
}

function getElevation(tileX, tileY) {
    var localTileX, localTileY, thisMap;
       if (isOverWorldMap) {
        thisMap = findMapNumberFromGlobalCoordinates(tileX, tileY);
        localTileX = getLocalCoordinatesX(tileX);
        localTileY = getLocalCoordinatesY(tileY);
    } else {
        thisMap = currentMap;
        localTileX = tileX;
        localTileY = tileY;
    }
    var elevation = 0;
    if (typeof thisMapData[thisMap].properties[localTileY][localTileX].elevation != 'undefined') {
           elevation = thisMapData[thisMap].properties[localTileY][localTileX].elevation;
    }

    return elevation;
}

function checkForSlopes(object) {

     var globalTileX = object.tileX;
    var globalTileY = object.tileY;
    var tileX, tileY;
    var thisMap;
    if (isOverWorldMap) {
        tileX = getLocalCoordinatesX(globalTileX);
        tileY = getLocalCoordinatesY(globalTileY);
        thisMap = findMapNumberFromGlobalCoordinates(globalTileX, globalTileY);
    } else {
        tileX = globalTileX;
        tileY = globalTileY;
        thisMap = currentMap;
    }
    // console.log("sslope"+tileX+","+tileY+","+thisMap+" = "+thisMapData[thisMap].collisions[tileY][tileX]);



    switch (thisMapData[thisMap].collisions[tileY][tileX]) {
            case ">":
            
            // is a horizontal slope
            console.log(object.x%tileW);
            var minMax = thisMapData[thisMap].properties[tileY][tileX].elevation.split(">");
            object.z = parseInt(minMax[0])+(parseInt(minMax[1])*(tileW-(object.x%tileW))/tileW);
            break;
            case "<":
              console.log(object.x%tileW);
            var minMax = thisMapData[thisMap].properties[tileY][tileX].elevation.split(">");
             object.z = parseInt(minMax[0])+(parseInt(minMax[1])*((object.x%tileW))/tileW);
            break;
        case "v":
        // is a vertical slope 
      var minMax = thisMapData[thisMap].properties[tileY][tileX].elevation.split(">");
     console.log(object.y%tileW+" - "+minMax[0]+(parseInt(minMax[1])*(tileW-(object.y%tileW))/tileW));
      
            object.z = parseInt(minMax[0])+(parseInt(minMax[1])*(tileW-(object.y%tileW))/tileW);
            break;
case "^":
  var minMax = thisMapData[thisMap].properties[tileY][tileX].elevation.split(">");
     console.log(object.y%tileW+" - "+minMax[0]+(parseInt(minMax[1])*(tileW-(object.y%tileW))/tileW));
      
            object.z = parseInt(minMax[0])+(parseInt(minMax[1])*((object.y%tileW))/tileW);

        break;
        default:
        object.z = getElevation(object.tileX, object.tileY);
    }
}

function dataURItoBlob(dataURI) {
    // thanks https://stackoverflow.com/questions/9388412/data-uri-to-object-url-with-createobjecturl-in-chrome-ff#answer-43449212
  var mime = dataURI.split(',')[0].split(':')[1].split(';')[0];
  var binary = atob(dataURI.split(',')[1]);
  var array = [];
  for (var i = 0; i < binary.length; i++) {
     array.push(binary.charCodeAt(i));
  }
  return new Blob([new Uint8Array(array)], {type: mime});
}

function getCurrentDateTimeFormatted() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    return dd + '-' + mm + '-' + today.getFullYear() + '_' + today.getHours() + "-" + today.getMinutes() + "-"+today.getSeconds();
}

function isATerrainCollision(x, y) {
    var globalTileX = getTileX(x);
    var globalTileY = getTileY(y);
    var tileX, tileY;
    var thisMap;
    if (isOverWorldMap) {
        tileX = getLocalCoordinatesX(globalTileX);
        tileY = getLocalCoordinatesY(globalTileY);
        if ((globalTileX < 0) || (globalTileY < 0) || (globalTileX >= (worldMapTileLength * worldMap[0].length)) || (globalTileY >= (worldMapTileLength * worldMap.length))) {
            return 1;
        }
        thisMap = findMapNumberFromGlobalCoordinates(globalTileX, globalTileY);
    } else {
        tileX = globalTileX;
        tileY = globalTileY;
        if ((tileX < 0) || (tileY < 0) || (tileX >= mapTilesX) || (tileY >= mapTilesY)) {
            return 1;
        }
        thisMap = currentMap;
    }
    
    switch (thisMapData[thisMap].collisions[tileY][tileX]) {
        case 1:
            // is a collision:
            return 1;
            break;
        case "<":
        case ">":
        case "^":
        case "v":
            // stairs
            // #####
            return 0;
            break;
        case "d":
            // is a door:
            return 0;
            break;
        default:
            // not a collsiion:
            return 0;
    }
}


function findWhichWorldMap(tileX, tileY) {
    return worldMap[Math.floor(tileY/worldMapTileLength)][Math.floor(tileX/worldMapTileLength)];
}



/*
function findRelativeWorldMapPosition(mapNumber) {
    // find the relative position of the passed in map number to the current map in the worldMap array
    var currentMapPosition = findWorldMapPosition(currentMap);
    var targetMapPosition = findWorldMapPosition(mapNumber);
    var xDiff = targetMapPosition[0] - currentMapPosition[0];
    var yDiff = targetMapPosition[1] - currentMapPosition[1];
    var worldXLength = worldMap[0].length;
    var worldYLength = worldMap.length;
    // wrap around:
    if (xDiff >= worldXLength / 2) {
        xDiff -= worldXLength;
    }
    if (xDiff <= 0 - (worldXLength / 2)) {
        xDiff += worldXLength;
    }
    if (yDiff >= worldYLength / 2) {
        yDiff -= worldYLength;
    }
    if (yDiff <= 0 - (worldYLength / 2)) {
        yDiff += worldYLength;
    }
    return ([xDiff, yDiff]);
}

function findWorldMapPosition(requiredMapNumber) {
    var currentMapIndexX, currentMapIndexY;
    // find where the required map is in the array:
    for (var i = 0; i < worldMap[0].length; i++) {
        for (var j = 0; j < worldMap.length; j++) {
            if (worldMap[j][i] == requiredMapNumber) {
                currentMapIndexX = i;
                currentMapIndexY = j;
                break;
            }
        }
    }
    return [currentMapIndexX, currentMapIndexY];
}
*/


function getXOffsetFromHeight(height) {
    // for determining a shadow's offset (for example).
    return (Math.sqrt(2) / 2 * height);
}


function findItemAtTile(tileX, tileY) {
    var foundItem = -1;
    var thisItem;
    var thisMap = findMapNumberFromGlobalCoordinates(tileX, tileY);
    for (var i = 0; i < thisMapData[thisMap].items.length; i++) {
        thisItem = thisMapData[thisMap].items[i];
        if (tileX == thisItem.tileX) {
            if (tileY == thisItem.tileY) {
                foundItem = i;
                break;
            }
        }
    }
    return foundItem;
}


function findItemWithinArmsLength() {
    // check if there's a relevant item on the hero's tile, or at arm's length:
    var armsLengthXTile = hero.tileX + relativeFacing[hero.facing]["x"];
    var armsLengthYTile = hero.tileY + relativeFacing[hero.facing]["y"];
    var foundItem = null;
    var thisItem;
    for (var m = 0; m < visibleMaps.length; m++) {

        for (var i = 0; i < thisMapData[(visibleMaps[m])].items.length; i++) {
            thisItem = thisMapData[(visibleMaps[m])].items[i];
       
            if (hero.tileX == thisItem.tileX) {
                if (hero.tileY == thisItem.tileY) {
                    foundItem = thisItem;

                    break;
                }
            }
            if (armsLengthXTile == thisItem.tileX) {
                if (armsLengthYTile == thisItem.tileY) {
                    foundItem = thisItem;
                    break;
                }
            }
        }
    }
    return foundItem;
}

/*
 function getObjectKeysForValue( testObject, value ) {
    console.log("looking for "+value);
    // return an array of all keys in the object that have a value that match the one passed in
   var keysFound = [];
    for( var prop in testObject ) {
        if( testObject.hasOwnProperty( prop ) ) {
            console.log("checking:"+prop);
             if( testObject[ prop ] === value )
                 keysFound.push(prop);
        }
    }
   return keysFound;
}
*/




function capValues(value, min, max) {
    if (value < min) {
        value = min;
    }
    if (value > max) {
        value = max;
    }
    return value;
}

function keepWithinRange(value, min, max) {
       if (value < min) {
        value += max;
    }
    if (value > max) {
        value -= max;
    }
    return value;
}

function accessDynamicVariable(variableToUse) {
    var variableComponents = variableToUse.split(".");
    var currentElement = window;
    for (var i = 0; i < variableComponents.length; i++) {
        if (typeof currentElement[variableComponents[i]] !== "undefined") {
            currentElement = currentElement[variableComponents[i]];
        }
    }
    return currentElement;
}

function getNearestParentId(thisNode) {
    // find the id of the parent if the passed in element doesn't have one:
    while (!thisNode.id) {
        thisNode = thisNode.parentNode;
    }
    return thisNode;
}



function getObjectKeysForInnerValue(testObject, value, attribute) {
    // console.log("looking for "+value);
    // return an array of all keys in the object that have a value that match the one passed in
    var keysFound = [];
    for (var prop in testObject) {
        if (testObject.hasOwnProperty(prop)) {
            //     console.log("checking:"+testObject[prop][attribute]);
            if (testObject[prop][attribute] === value) {

                keysFound.push(prop);
            }
        }
    }
    return keysFound;
}


function launchFullScreen(element) {
    // https://davidwalsh.name/fullscreen
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    }
}

function exitFullScreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    }
}


function debounce(func, wait, immediate) {
    // https://davidwalsh.name/javascript-debounce-function
    var timeout;
    return function() {
        var context = this,
            args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};


function isAnObjectCollision(obj1x, obj1y, obj1w, obj1h, obj2x, obj2y, obj2w, obj2h) {
    if (obj1x + obj1w / 2 > obj2x - obj2w / 2) {
        if (obj1x - obj1w / 2 < obj2x + obj2w / 2) {
            if (obj1y - obj1h / 2 < obj2y + obj2h / 2) {
                if (obj1y + obj1h / 2 > obj2y - obj2h / 2) {
                    return true;
                }
            }
        }
    }
    return false;
}




// useful for determining relative direction based on facing:
var relativeFacing = {
    "n": {
        "x": 0,
        "y": -1
    },
    "s": {
        "x": 0,
        "y": 1
    },
    "e": {
        "x": 1,
        "y": 0
    },
    "w": {
        "x": -1,
        "y": 0
    }
};


function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomIntegerInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function rollDice(quantity, sidedDice) {
    // eg to roll 3d6, use rollDice(3,6);
    var result = 0;
    for (var i = 0; i < quantity; i++) {
        result += getRandomIntegerInclusive(1, sidedDice);
    }
    return result;
}

function getRandomKeyFromObject(object) {
    var keys = Object.keys(object)
    return keys[keys.length * Math.random() << 0];
}

function isInRange(ax, ay, bx, by, ra) {
    // determines if one sprite is within range of another
    var range = getPythagorasDistance(ax, ay, bx, by);
    if (range <= ra) {
        return true;
    } else {
        return false;
    }
}

function getPythagorasDistance(ax, ay, bx, by) {
    return Math.sqrt(((ax - bx) * (ax - bx)) + ((ay - by) * (ay - by)));
}

function turntoFace(obj1, obj2) {
    // obj1 is the one which will react and turn to face obj2
    var xDiff = obj1.x - obj2.x;
    var yDiff = obj1.y - obj2.y;
    // find the greatest difference:
    if (Math.abs(xDiff) > Math.abs(yDiff)) {
        if (xDiff > 0) {
            return "w";
        } else {
            return "e";
        }
    } else {
        if (yDiff > 0) {
            return "n";
        } else {
            return "s";
        }
    }
}

function turntoFaceTile(obj, tile2x, tile2y) {
    var xDiff = obj.x - getTileCentreCoordX(tile2x);
    var yDiff = obj.y - getTileCentreCoordY(tile2y);
    // find the greatest difference:
    if (Math.abs(xDiff) > Math.abs(yDiff)) {
        if (xDiff > 0) {
            return "w";
        } else {
            return "e";
        }
    } else {
        if (yDiff > 0) {
            return "n";
        } else {
            return "s";
        }
    }
}


function isFacing(obj1, obj2) {
    var isFacing = false;
    switch (obj1.facing) {
        case "n":
            if (obj1.y > obj2.y) {
                isFacing = true;
            }
            break;
        case "s":
            if (obj1.y < obj2.y) {
                isFacing = true;
            }
            break;
        case "w":
            if (obj1.x > obj2.x) {
                isFacing = true;
            }
            break;
        case "e":
            if (obj1.x < obj2.x) {
                isFacing = true;
            }
            break;

    }
    return isFacing;
}




function generateHash(sourceString) {
    // http://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript-jquery
    var hash = 0,
        i, chr, len;
    if (sourceString.length === 0) return hash;
    for (i = 0, len = sourceString.length; i < len; i++) {
        chr = sourceString.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}





function parseMoney(amount) {
    var isNegative = false;
    if (amount < 0) {
        amount = Math.abs(amount);
        isNegative = true;
    }
    var moneyOutput = "";
    var copper = amount % 100;
    var gold = Math.floor(amount / 10000);
    var silver = Math.floor((amount - gold * 10000) / 100);
    if (gold > 0) {
        moneyOutput = gold + '<span class="gold"></span>';
    }
    if ((silver > 0) || (gold > 0)) {
        moneyOutput += silver + '<span class="silver"></span>';
    }
    moneyOutput += copper + '<span class="copper"></span>';
    if (isNegative) {
        moneyOutput = "-" + moneyOutput;
    }
    return moneyOutput;
}



function hasLineOfSight(startX, startY, endX, endY) {

    var thisMap = findMapNumberFromGlobalCoordinates(startX, startY);
  



    var nextX = startX;
    var nextY = startY;
    var pathY = [];
    var pathX = [];
    var deltaY = endY - startY;
    var deltaX = endX - startX;
    var currentStep = 0;
    var fraction, previousX, previousY, stepX, stepY, thisInnerDoor;



    var needToCheckInnerDoors = false;
    if (typeof thisMapData[thisMap].innerDoors !== "undefined") {
        needToCheckInnerDoors = true;
    }

  var localTileX = getLocalCoordinatesX(startX);
    var localTileY = getLocalCoordinatesY(startY);
    // check the starting tile:
    if (thisMapData[thisMap].collisions[localTileY][localTileX] != 0) {
        // tile is non-walkable;
        return false;

    }
    if (needToCheckInnerDoors) {
        thisInnerDoor = thisMap + "-" + localTileX + "-" + localTileY;
        if (thisMapData[thisMap].innerDoors.hasOwnProperty(thisInnerDoor)) {
            // an Inner Door exists at this location:
            if (!thisMapData[thisMap].innerDoors[thisInnerDoor]['isOpen']) {
                return false;

            }
        }
    }

    // path direction calculation:
    if (deltaY < 0) {
        stepY = -1;
    } else {
        stepY = 1;
    }
    if (deltaX < 0) {
        stepX = -1;
    } else {
        stepX = 1;
    }

    deltaY = Math.abs(deltaY * 2);
    deltaX = Math.abs(deltaX * 2);
    previousX = startX;
    previousY = startY;
    // bresenham algorithm:
    if (deltaX > deltaY) {
        fraction = deltaY * 2 - deltaX;
        while (nextX != endX) {
            if (fraction >= 0) {
                nextY += stepY;
                fraction -= deltaX;
            }
            nextX += stepX;
            fraction += deltaY;
            thisMap = findMapNumberFromGlobalCoordinates(nextX, nextY);
              localTileX = getLocalCoordinatesX(nextX);
     localTileY = getLocalCoordinatesY(nextY);
            if (thisMapData[thisMap].collisions[localTileY][localTileX] != 0) {
                // tile is non-walkable:
                return false;
                break;
            }
            if (needToCheckInnerDoors) {
                thisInnerDoor = thisMap + "-" + localTileX + "-" + localTileY;
                if (thisMapData[thisMap].innerDoors.hasOwnProperty(thisInnerDoor)) {
                    // an Inner Door exists at this location:
                    if (!thisMapData[thisMap].innerDoors[thisInnerDoor]['isOpen']) {
                        return false;
                        break;
                    }
                }
            }
            // add relative movement to the array:                                                                                                                  
            pathY[currentStep] = nextY - previousY;
            pathX[currentStep] = nextX - previousX;
            previousY = nextY;
            previousX = nextX;
            currentStep++;
        }
    } else {
        fraction = deltaX * 2 - deltaY;
        while (nextY != endY) {
            if (fraction >= 0) {
                nextX += stepX;
                fraction -= deltaY;
            }
            nextY += stepY;
            fraction += deltaX;
            thisMap = findMapNumberFromGlobalCoordinates(nextX, nextY);
            localTileX = getLocalCoordinatesX(nextX);
     localTileY = getLocalCoordinatesY(nextY);
            if (thisMapData[thisMap].collisions[localTileY][localTileX] != 0) {
                // tile is non-walkable;
                return false;
                break;
            }
            if (needToCheckInnerDoors) {
                thisInnerDoor = thisMap + "-" + localTileX + "-" + localTileY;
                if (thisMapData[thisMap].innerDoors.hasOwnProperty(thisInnerDoor)) {
                    // an Inner Door exists at this location:
                    if (!thisMapData[thisMap].innerDoors[thisInnerDoor]['isOpen']) {
                        return false;
                        break;
                    }
                }
            }
            // add relative movement to the array:                                                                                                                  
            pathY[currentStep] = nextY - previousY;
            pathX[currentStep] = nextX - previousX;
            previousY = nextY;
            previousX = nextX;
            currentStep++;
        }
    }
    return true;
}



function determineWhichTransitionEvent() {
    // https://davidwalsh.name/css-animation-callback
    var t;
    var el = document.createElement('fakeelement');
    var transitions = {
        'transition': 'transitionend',
        'OTransition': 'oTransitionEnd',
        'MozTransition': 'transitionend',
        'WebkitTransition': 'webkitTransitionEnd'
    }
    for (t in transitions) {
        if (el.style[t] !== undefined) {
            return transitions[t];
        }
    }
    el = null;
}

function determineWhichAnimationEvent() {
    // https://davidwalsh.name/css-animation-callback
    var t;
    var el = document.createElement('fakeelement');
    var animations = {
        'animation': 'animationend',
        'OAnimation': 'oAnimationEnd',
        'MozAnimation': 'animationend',
        'WebkitAnimation': 'webkitAnimationEnd'
    }
    for (t in animations) {
        if (el.style[t] !== undefined) {
            return animations[t];
        }
    }
    el = null;
}

// http://stackoverflow.com/questions/9229645/remove-duplicates-from-javascript-array#answer-9229821
function uniqueValues(a) {
    var seen = {};
    return a.filter(function(item) {
        return seen.hasOwnProperty(item) ? false : (seen[item] = true);
    });
}

function sortByHighestValue(a, b) {
    // highest first
    if (a[0] < b[0])
        return 1;
    if (a[0] > b[0])
        return -1;
    return 0;
}

function sortByLowestValue(a, b) {
    // lowest first
    if (a[0] < b[0])
        return -1;
    if (a[0] > b[0])
        return 1;
    return 0;
}

/*
 function byPropertyLowestFirst(property) {
    // sortedObj = unsortedObj.sort(byPropertyLowestFirst("name"));
    return function(a,b) {
        if (typeof a[property] == "number") {
            return (a[property] - b[property]);
        } else {
            return ((a[property] < b[property]) ? -1 : ((a[property] > b[property]) ? 1 : 0));
        }
    };
};
*/

function removeElementFromArray(whichArray, whichElement) {
    var index = whichArray.indexOf(whichElement);
    if (index > -1) {
        whichArray.splice(index, 1);
    }
}

function getRandomElementFromArray(whichArray) {
    return whichArray[Math.floor(Math.random() * whichArray.length)];
}


function drawEllipse(ctx, x, y, w, h, filled, colour) {
    // https://stackoverflow.com/questions/14169234/the-relation-of-the-bezier-curve-and-ellipse
    var kappa = 0.5522848;
    var ox = (w / 2) * kappa, // control point offset horizontal
        oy = (h / 2) * kappa, // control point offset vertical
        xe = x + w, // x-end
        ye = y + h, // y-end
        xm = x + w / 2, // x-middle
        ym = y + h / 2; // y-middle
    ctx.beginPath();
    ctx.moveTo(x, ym);
    ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
    ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
    ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
    ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
    ctx.closePath();
    if (filled) {
        ctx.fillStyle = colour;
        ctx.fill();
    } else {
        ctx.strokeStyle = colour;
        ctx.stroke();
    }
}



function drawCircle(fillStyle, x, y, radius) {
    gameContext.fillStyle = fillStyle;
    gameContext.beginPath();
    gameContext.arc(x, y, radius, 0, 2 * Math.PI);
    gameContext.fill();
}



function drawIsoRectangle(topLeftX, topLeftY, bottomRightX, bottomRightY, filled, colour) {
    var drawnOffsetX = (canvasWidth / 2) - hero.isox;
    var drawnOffsetY = (canvasHeight / 2) - hero.isoy;
    gameContext.fillStyle = colour;
    gameContext.beginPath();
    // find iso coordinates from non-iso values passed in:
    gameContext.moveTo(findIsoCoordsX(topLeftX, topLeftY) + drawnOffsetX, findIsoCoordsY(topLeftX, topLeftY) + drawnOffsetY);
    gameContext.lineTo(findIsoCoordsX(bottomRightX, topLeftY) + drawnOffsetX, findIsoCoordsY(bottomRightX, topLeftY) + drawnOffsetY);
    gameContext.lineTo(findIsoCoordsX(bottomRightX, bottomRightY) + drawnOffsetX, findIsoCoordsY(bottomRightX, bottomRightY) + drawnOffsetY);
    gameContext.lineTo(findIsoCoordsX(topLeftX, bottomRightY) + drawnOffsetX, findIsoCoordsY(topLeftX, bottomRightY) + drawnOffsetY);
    gameContext.lineTo(findIsoCoordsX(topLeftX, topLeftY) + drawnOffsetX, findIsoCoordsY(topLeftX, topLeftY) + drawnOffsetY);
    gameContext.closePath();
    if (filled) {
        gameContext.fillStyle = colour;
        gameContext.fill();
    } else {
        gameContext.strokeStyle = colour;
        gameContext.stroke();
    }
}



// -----------------------------------------------------------

// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
// requestAnimationFrame polyfill by Erik Moller
// fixes from Paul Irish and Tino Zijdel

(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() {
                    callback(currTime + timeToCall);
                },
                timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

// -----------------------------------------------------------




var getJSONWithParams = function(url, params, successHandler, errorHandler) {
    var xhr = typeof XMLHttpRequest != 'undefined' ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
    xhr.open('POST', url, true);
    xhr.onreadystatechange = function() {
        var status;
        var data;
        // https://xhr.spec.whatwg.org/#dom-xmlhttprequest-readystate
        if (xhr.readyState == 4) { // `DONE`
            status = xhr.status;
            var wasParsedOk = true;
            if (status == 200) {
                try {
                    data = JSON.parse(xhr.responseText);
                } catch (e) {
                    // JSON parse error:
                    wasParsedOk = false;
                    errorHandler && errorHandler(status);
                }
                if (wasParsedOk) {
                    successHandler && successHandler(data);
                }
            } else {
                errorHandler && errorHandler(status);
            }
        }
    };
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send(params);
};




function sendGetData(url) {
        // send data to the server, and get a response:
    var xhr = typeof XMLHttpRequest != 'undefined' ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
    xhr.open('get', url, true);
   xhr.onreadystatechange = function() {
        var status;
        var data;
        // https://xhr.spec.whatwg.org/#dom-xmlhttprequest-readystate
        if (xhr.readyState == 4) { // `DONE`
            status = xhr.status;
            var wasParsedOk = true;
            if (status == 200) {
                    data = xhr.responseText;
                    successHandler && successHandler(data);
            } else {
                errorHandler && errorHandler(status);
            }
        }
    };
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send();
}


function sendDataWithoutNeedingAResponse(url) {
    // send data to the server, without needing to listen for a response:
    var xhr = typeof XMLHttpRequest != 'undefined' ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
    xhr.open('get', url, true);
    xhr.send();
}

function postData(url, data) {
    // send data to the server, without needing to listen for a response:
    var xhr = typeof XMLHttpRequest != 'undefined' ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');

    xhr.open('post', url, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;');
    xhr.send(data);
}






/*

function pseudoRandomNumberGenerator(seed) {
  // kudos https://gist.github.com/blixt/f17b47c62508be59987b
  // use:
  // const plantBreedingPRNG = new pseudoRandomNumberGenerator(1234);
  // console.log(plantBreedingPRNG.nextFloat());
  this._seed = seed % 2147483647;
  if (this._seed <= 0) this._seed += 2147483646;
}

pseudoRandomNumberGenerator.prototype.next = function () {
  // Returns a pseudo-random value between 1 and 2^32 - 2.
  return this._seed = this._seed * 16807 % 2147483647;
};

pseudoRandomNumberGenerator.prototype.nextFloat = function (opt_minOrMax, opt_max) {
  // Returns a pseudo-random floating point number in range [0, 1).
  // We know that result of next() will be 1 to 2147483646 (inclusive).
  return (this.next() - 1) / 2147483646;
};


*/










// -----------------------------------------------------------

// image loader 
// http://stackoverflow.com/questions/16560397/image-not-drawn-on-canvas-until-user-clicks
// http://jsfiddle.net/gfcarv/26AmY/
window.Loader = (function() {
    var imageCount = 0;
    var loading = false;
    var total = 0;

    // this object will hold all image references
    var images = {};

    function reset() {
        imageCount = 0;
        loading = false;
        total = 0;
        images = {};
    }

    // user defined callback, called each time an image is loaded (if it is not defined the empty function wil be called)
    function onProgressUpdate() {};
    // user defined callback, called when all images are loaded (if it is not defined the empty function wil be called)
    function onComplete() {};

    function onLoadImage(name) {
        ++imageCount;
        //  console.log(name + " loaded");

        // call the user defined callback when an image is loaded
        onProgressUpdate(getProgress());
        // check if all images are loaded
        if (imageCount == total) {
            loading = false;
            onComplete();
        }

    };

    function onImageError(e) {
        console.log("Error on loading the image: " + e.srcElement);
    }

    function loadImage(name, src) {
        try {
            images[name] = new Image();
            images[name].onload = function() {
                onLoadImage(name);
            };
            images[name].onerror = onImageError;
            images[name].src = src;
        } catch (e) {
            console.log(e.message);
        }
    }

    function getImage(name) {
        if (images[name]) {
            return (images[name]);
        } else {
            return undefined;
        }
    }

    // pre-load all the images and call the onComplete callback when all images are loaded
    // optionaly set the onProgressUpdate callback to be called each time an image is loaded (useful for loading screens) 
    function preload(_images, _onComplete, _onProgressUpdate) {
        reset();
        if (!loading) {

            //  console.log("Loading...");
            loading = true;

            try {
                total = _images.length;
                onProgressUpdate = _onProgressUpdate || (function() {});
                onComplete = _onComplete || (function() {});
                for (var i = 0; i < _images.length; ++i) {
                    loadImage(_images[i].name, _images[i].src);
                }
            } catch (e) {
                console.log(e.message);
            }
        } else {
            //  throw new Error("Acess denied: Cannot call the load function while there are remaining images to load.");
        }
    }

    // percentage of progress
    function getProgress() {
        return (imageCount / total) * 100;
    };

    // return only the public stuff to create our Loader object
    return {
        preload: preload,
        getProgress: getProgress,
        getImage: getImage,
        reset: reset,
        images: images
    };
})();

// -----------------------------------------------------------
function placePlotPlacement() {
    if (plotPlacement.numberOfBlockedTiles == 0) {
        document.removeEventListener("mousemove", UI.movePlotPlacementOverlay, false);
        document.removeEventListener("click", placePlotPlacement, false);
        activeAction = "";
        var mouseTilePosition = getTileCoordsFromScreenPosition(cursorPositionX, cursorPositionY);
        // get the top left corner:
        mouseTilePosition[0] -= (plotPlacement.width / 2);
        mouseTilePosition[1] -= (plotPlacement.length / 2);
        // post to server to create files for this character
        getJSON('/game-world/addPlot.php?width=' + plotPlacement.width + '&height=' + plotPlacement.length + '&tileX=' + mouseTilePosition[0] + '&tileY=' + mouseTilePosition[1] + '&chr=' + characterId, function(data) {

            if (data.success) {
                // remove plot item from inventory:
                removeItemTypeFromInventory(plotPlacement.whichType, 1);
                hero.housing.hasAPlayerHouse = true;
                hero.housing.northWestCornerTileX = mouseTilePosition[0];
                hero.housing.northWestCornerTileY = mouseTilePosition[1];
                hero.housing.southEastCornerTileX = mouseTilePosition[0] + parseInt(plotPlacement.width);
                hero.housing.southEastCornerTileY = mouseTilePosition[1] + parseInt(plotPlacement.length);

                // set the empty tile data for the ground floor:
                hero.housing.draft = [];
                hero.housing.draft[0] = [];
                // show footprint so the player knows it's worked:
                hero.settings.showFootprintInEditMode = true;
                showHousingFootprintCheckbox.checked = true;
                UI.openHousingPanel();
                UI.openHousingConstructionPanel();
            }
        }, function(status) {
            // try again 
            // ######
        });
    } else {
        UI.showNotification("<p>I can't put a plot there</p>");
    }
}

const firstTileThatWouldBeActive = document.querySelector('.housingTileGroup.active li');

var housingNameSpace = {
    'whichTileActive': '',
    'whichWorldTileActive': '',
    'whichElevationActive': 0,
    'maxElevationsPossible': 3,
    'whichDyeColourActive': 0,
    'runningCostTotal': 0,
    'costForActiveTile': 0,
    'activeTool': 'paint',
    'mousePosition': [],
    'draftHousingTilesToLoad': [],
    'whichItemIdsLoading': [],
    'whichFacingActive': 'n',
    'whichZIndexActive': 0,
    'currentTileCanBeElevated': firstTileThatWouldBeActive.getAttribute("data-canbelevated"),
    'zIndexesPerElevation': tileW * 3,
    'activeTileCanBeRotated': firstTileThatWouldBeActive.getAttribute("data-canberotated"),
    'floodFillTilesChecked': [],

    init: function() {
        // load in any graphics used in the draft but not already loaded into memory:
        if (hero.housing.hasAPlayerHouse) {
            if (hero.housing.draft) {
                var whichColour, whichWorldTile, thisFileColourSuffix, thisColourName;
                for (var i = 0; i < hero.housing.draft.length; i++) {
                    for (var j = 0; j < hero.housing.draft[i].length; j++) {
                        whichColour = 0;
                        if (typeof hero.housing.draft[i][j].colour !== "undefined") {
                            whichColour = hero.housing.draft[i][j].colour;
                        }
                        whichWorldTile = document.querySelector('#housingTileSelection li[data-id="' + hero.housing.draft[i][j].type + '"]').getAttribute('data-cleanurl');
                        thisFileColourSuffix = '';
                        if (whichColour != 0) {
                            // bypass hasInherent colour checks as won't be in inventory items
                            thisColourName = colourNames[whichColour];
                            if (thisColourName != "") {
                                thisFileColourSuffix = "-" + thisColourName.toLowerCase();
                            }
                        }
                        var itemID = "item" + hero.housing.draft[i][j].type + thisFileColourSuffix;
                        if (housingNameSpace.whichItemIdsLoading.indexOf(itemID) === -1) {
                            housingNameSpace.draftHousingTilesToLoad.push({
                                name: itemID,
                                src: '/images/game-world/items/' + whichWorldTile + '.png'
                            });
                            housingNameSpace.whichItemIdsLoading.push(itemID);
                        }
                    }
                }
            }
            Loader.preload(housingNameSpace.draftHousingTilesToLoad, housingNameSpace.prepareDraftHousingAssets, loadingProgress);
        }
    },

    prepareDraftHousingAssets: function() {
        for (var i = 0; i < housingNameSpace.whichItemIdsLoading.length; i++) {
            itemImages[housingNameSpace.whichItemIdsLoading[i]] = Loader.getImage(housingNameSpace.whichItemIdsLoading[i]);
        }
    },

    update: function() {
        if (key[12]) {
            // escape - cancel active tile
            document.getElementById('housingTile' + housingNameSpace.whichTileActive).classList.remove('active');
            housingNameSpace.whichTileActive = '';
            housingNameSpace.whichWorldTileActive = '';
            housingNameSpace.costForActiveTile = 0;
            housingNameSpace.activeTool = '';
            for (var i = 0; i < housingConstructionToolButtons.length; i++) {
                housingConstructionToolButtons[i].classList.remove('active');
            }
            key[12] = false;
        }
        if (key[7]) {
            UI.toggleUI();
            key[7] = false;
        }
        if (key[15]) {
            // cursor left:
            housingNameSpace.adjustRotation(-1);
            key[15] = false;
        }
        if (key[16]) {
            // cursor right:
            housingNameSpace.adjustRotation(1);
            key[16] = false;
        }
        if (key[13]) {
            // cursor up:
            housingNameSpace.adjustZIndex(1);
            key[13] = false;
        }
        if (key[14]) {
            // cursor down:
            housingNameSpace.adjustZIndex(-1);
            key[14] = false;
        }
    },

    worldClickHandler: function(e) {
        // if in bounds of the plot footprint:
        var xDiff = e.pageX - (canvasWidth / 2);
        var yDiff = e.pageY - (canvasHeight / 2);
        var nonIsoCoordX = find2DCoordsX(hero.isox + xDiff, hero.isoy + yDiff);
        var nonIsoCoordY = find2DCoordsY(hero.isox + xDiff, hero.isoy + yDiff);
        var clickWorldTileX = getTileX(nonIsoCoordX);
        var clickWorldTileY = getTileY(nonIsoCoordY);
        if (clickWorldTileX >= hero.housing.northWestCornerTileX) {
            if (clickWorldTileX < hero.housing.southEastCornerTileX) {
                if (clickWorldTileY >= hero.housing.northWestCornerTileY) {
                    if (clickWorldTileY < hero.housing.southEastCornerTileY) {
                        // make sure it's not a button or another UI element:
                        if (e.target.nodeName == "CANVAS") {
                            switch (housingNameSpace.activeTool) {
                                case 'paint':
                                    if (housingNameSpace.whichTileActive != '') {
                                        housingNameSpace.addTileToLocation(clickWorldTileX - hero.housing.northWestCornerTileX, clickWorldTileY - hero.housing.northWestCornerTileY);
                                    }
                                    break;
                                case 'remove':
                                    var tilesBeingRemoved = hero.housing.draft[housingNameSpace.whichElevationActive].filter(function(currentItemObject) {
                                        return ((currentItemObject.tileX == (clickWorldTileX - hero.housing.northWestCornerTileX)) && (currentItemObject.tileY == (clickWorldTileY - hero.housing.northWestCornerTileY)));
                                    });
                                    for (var i in tilesBeingRemoved) {
                                        // refund cost:
                                        housingNameSpace.runningCostTotal -= parseInt(document.getElementById("housingTile" + tilesBeingRemoved[i].type).getAttribute('data-price'));
                                    }
                                    housingNameSpace.updateRunningTotal();
                                    // find items at this tile and remove them:
                                    hero.housing.draft[housingNameSpace.whichElevationActive] = hero.housing.draft[housingNameSpace.whichElevationActive].filter(function(currentItemObject) {
                                        return (!((currentItemObject.tileX == (clickWorldTileX - hero.housing.northWestCornerTileX)) && (currentItemObject.tileY == (clickWorldTileY - hero.housing.northWestCornerTileY))));
                                    });
                                    break;
                                case 'fill':
                                    if (housingNameSpace.whichTileActive != '') {
                                        housingNameSpace.floodFillFrom(clickWorldTileX - hero.housing.northWestCornerTileX, clickWorldTileY - hero.housing.northWestCornerTileY);
                                    }
                                    break;
                            }
                        }
                    }
                }
            }
        }
    },

    addTileToLocation: function(tileX, tileY) {
        var newWallTile = {
            "type": parseInt(housingNameSpace.whichTileActive),
            "tileX": (tileX),
            "tileY": (tileY),
            "lockedToPlayerId": characterId
        }
        if (housingNameSpace.currentTileCanBeElevated) {
            newWallTile.tileZ = (housingNameSpace.whichZIndexActive / tileW);
        }
        if (housingNameSpace.whichDyeColourActive != 0) {
            newWallTile.colour = parseInt(housingNameSpace.whichDyeColourActive);
        }
        if (housingNameSpace.activeTileCanBeRotated) {
            newWallTile.facing = housingNameSpace.whichFacingActive;
        }
        // place tile:
        hero.housing.draft[housingNameSpace.whichElevationActive].push(newWallTile);
        housingNameSpace.runningCostTotal += housingNameSpace.costForActiveTile;
        housingNameSpace.updateRunningTotal();
    },

    mouseMove: function(e) {
        housingNameSpace.mousePosition = getTileCoordsFromScreenPosition(e.pageX, e.pageY);
    },

    toggleShowPlotFootprint: function(e) {
        if (e.target.checked) {
            hero.settings.showFootprintInEditMode = true;
        } else {
            hero.settings.showFootprintInEditMode = false;
        }
    },

    housingTileColourChange: function(e) {
        if (housingNameSpace.whichDyeColourActive != housingTileColour.value) {
            housingNameSpace.whichDyeColourActive = housingTileColour.value;
            housingNameSpace.loadNewTile(housingNameSpace.whichTileActive, housingNameSpace.whichWorldTileActive, housingNameSpace.whichDyeColourActive);
            // change colour of available tiles:
            var colourSuffix = "";
            if (housingTileColour.value != "0") {
                colourSuffix = '-' + colourNames[housingNameSpace.whichDyeColourActive].toLowerCase();
            }
            for (var i = 0; i < housingTileSelectionListItems.length; i++) {
                housingTileSelectionListItems[i].firstElementChild.src = '/images/game-world/items/' + housingTileSelectionListItems[i].getAttribute('data-cleanurl') + colourSuffix + '.png';
            }
        }
    },

    selectNewTile: function(e) {
        if (housingNameSpace.whichTileActive != '') {
            document.getElementById('housingTile' + housingNameSpace.whichTileActive).classList.remove('active');
        }
        var whichTile = getNearestParentId(e.target);
        whichTile.classList.add('active');
        housingNameSpace.costForActiveTile = parseInt(whichTile.getAttribute("data-price"));
        housingNameSpace.whichWorldTileActive = whichTile.getAttribute("data-cleanurl");
        if (housingNameSpace.activeTool == "remove") {
            housingNameSpace.activeTool = "paint";
        }
        housingNameSpace.activeTileCanBeRotated = whichTile.getAttribute("data-canberotated");
        housingNameSpace.currentTileCanBeElevated = whichTile.getAttribute("data-canbelevated");
        housingNameSpace.showActiveTool(document.getElementById('housingConstructToolPaint'));
        housingNameSpace.whichTileActive = whichTile.getAttribute("data-id");
        housingNameSpace.loadNewTile(housingNameSpace.whichTileActive, housingNameSpace.whichWorldTileActive, housingNameSpace.whichDyeColourActive);

    },

    loadNewTile: function(whichTile, whichWorldTile, whichColour) {
        // load world tile asset if it's not already loaded:
        // check if the wall is being dyed:
        var thisFileColourSuffix = '';
        if (whichColour != 0) {
            // bypass hasInherent colour checks as won't be in inventory items
            var thisColourName = colourNames[whichColour];
            if (thisColourName != "") {
                thisFileColourSuffix = "-" + thisColourName.toLowerCase();
            }
        }

        var itemID = "item" + whichTile + thisFileColourSuffix;
        if (typeof itemImages[itemID] === "undefined") {
            //   console.log(itemImages,itemImages[itemID],(typeof itemImages[itemID]),itemID,whichTile, whichWorldTile, whichColour);
            Loader.preload([{ name: itemID, src: '/images/game-world/items/' + whichWorldTile + thisFileColourSuffix + '.png' }], function() {
                itemImages[itemID] = Loader.getImage(itemID);
                console.log("completed laoding: " + itemID);
            }, function() {});
        }
    },

    commitDesign: function() {
        // check money and confirm 
        if (housingNameSpace.runningCostTotal > hero.currency.money) {
            UI.showYesNoDialogueBox("Not enough money&hellip;", "Save design", "Cancel design", "housingNameSpace.saveDraftDesign", "housingNameSpace.abandonLatestChanges");
        } else {
            var titleText;
            if (housingNameSpace.runningCostTotal < 0) {
                titleText = "Commit this design and be refunded " + parseMoney((0 - housingNameSpace.runningCostTotal)) + "?";
            } else {
                titleText = "Commit this design at a cost of " + parseMoney(housingNameSpace.runningCostTotal) + "?";
            }
            UI.showYesNoDialogueBox(titleText, "Commit design", "Save for later", "housingNameSpace.publishCommittedDesign", "housingNameSpace.saveDraftDesign");
        }
    },

    publishCommittedDesign: function() {
        // save json to file system:
        getJSONWithParams("/game-world/savePlot.php", 'chr=' + characterId + '&postData=' + JSON.stringify(hero.housing.draft) + '&northWestCornerTileX=' + hero.housing.northWestCornerTileX + '&northWestCornerTileY=' + hero.housing.northWestCornerTileY, function(data) {
            if (data.success) {
                // check no pet, hero, NPC etc in the way - move if so ####

                UI.hideYesNoDialogueBox();
                hero.currency.money -= housingNameSpace.runningCostTotal;
                UI.updateCurrencies();
                if (housingNameSpace.runningCostTotal != 0) {
                    audio.playSound(soundEffects['coins'], 0);
                    housingNameSpace.runningCostTotal = 0;
                }
                hero.housing.draftCost = 0;
                housingNameSpace.updateRunningTotal();
                // add data to local mapData - first, find which maps this plot is over:
                var whichMapsToUpdate = uniqueValues([findWhichWorldMap(hero.housing.northWestCornerTileX, hero.housing.northWestCornerTileY), findWhichWorldMap(hero.housing.southEastCornerTileX, hero.housing.southEastCornerTileY), findWhichWorldMap(hero.housing.southEastCornerTileX, hero.housing.northWestCornerTileY), findWhichWorldMap(hero.housing.northWestCornerTileX, hero.housing.southEastCornerTileY)]);
                // remove existing housing data for this player from these maps:
                for (var i = 0; i < whichMapsToUpdate.length; i++) {
                    // need to check if they're within the plot footprint to be safe?  ###
                    thisMapData[(whichMapsToUpdate[i])].items = thisMapData[(whichMapsToUpdate[i])].items.filter(function(currentItemObject) {
                        return currentItemObject.lockedToPlayerId !== characterId;
                    });
                }
                // loop through housing.draft[0] for the external tiles, and add those to the relevant map
                var clonedHousingItem, whichMap;
                for (var i = 0; i < hero.housing.draft[0].length; i++) {
                    clonedHousingItem = JSON.parse(JSON.stringify(hero.housing.draft[0][i]));
                    // adjust the tile coordinates:
                    clonedHousingItem.tileX += hero.housing.northWestCornerTileX;
                    clonedHousingItem.tileY += hero.housing.northWestCornerTileY;
                    // need to get inventory data for this as well #############
                    whichMap = findWhichWorldMap(clonedHousingItem.tileX, clonedHousingItem.tileY);
                    thisMapData[whichMap].items.push(clonedHousingItem);
                    initialiseItem(thisMapData[whichMap].items[thisMapData[whichMap].items.length - 1]);
                }
                UI.closeHousingConstructionPanel();
            } else {
                // try again? ########
            }
        }, function(status) {
            // try again? ########
        });
    },


    checkSaveDraftDesign: function() {
        UI.showYesNoDialogueBox("Save these latest changes to your draft version?", "Save to draft", "Abandon changes", "housingNameSpace.saveDraftDesign", "housingNameSpace.abandonLatestChanges");
    },

    abandonLatestChanges: function() {
        // revert draft object to the saved version:
        hero.housing.draft = JSON.parse(JSON.stringify(housingNameSpace.restoreDraft));
        housingNameSpace.runningCostTotal = 0;
        housingNameSpace.updateRunningTotal();
        UI.closeHousingConstructionPanel();
        UI.hideYesNoDialogueBox();
    },

    saveDraftDesign: function() {
        hero.housing.draftCost = housingNameSpace.runningCostTotal;
        getJSONWithParams("/game-world/savePlot.php", 'chr=' + characterId + '&postData=' + JSON.stringify(hero.housing.draft) + '&northWestCornerTileX=' + hero.housing.northWestCornerTileX + '&northWestCornerTileY=' + hero.housing.northWestCornerTileY + '&draft=true', function(data) {
            if (data.success) {
                UI.showNotification("<p>I've saved that design for later</p>");
                //  housingAbandonDesign.classList.remove("active");
                UI.hideYesNoDialogueBox();
                UI.closeHousingConstructionPanel();
            } else {
                // try again? ########
            }
        }, function(status) {
            // try again? ########
        });
    },

    checkAbandonDesign: function() {
        UI.showYesNoDialogueBox("Abandon this draft design entirely?", "Abandon draft", "Keep this changes for now", "housingNameSpace.abandonDesign", "UI.hideYesNoDialogueBox");
    },

    abandonDesign: function() {
        // remove all changes (make the draft like the committed) - on both the server and locally:
        getJSONWithParams("/game-world/removeDraftPlot.php", 'chr=' + characterId, function(data) {
            if (data.housing.success) {
                hero.housing.draft = JSON.parse(data.housing.draft);
                UI.showNotification("<p>I've abandoned that draft design</p>");
                UI.hideYesNoDialogueBox();
                UI.closeHousingConstructionPanel();
            } else {
                // try again? ########
            }
        }, function(status) {
            // try again? ########
        });
    },

    changeActiveTool: function(e) {
        var whichButton = getNearestParentId(e.target);
        housingNameSpace.activeTool = whichButton.getAttribute("data-action");
        housingNameSpace.showActiveTool(whichButton);
    },

    showActiveTool: function(whichButton) {
        for (var i = 0; i < housingConstructionToolButtons.length; i++) {
            housingConstructionToolButtons[i].classList.remove('active');
        }
        whichButton.classList.add('active');
    },

    updateRunningTotal: function() {
        if (housingNameSpace.runningCostTotal > hero.currency.money) {
            housingRunningTotal.classList.add('notEnough');
        } else {
            housingRunningTotal.classList.remove('notEnough');
        }
        housingRunningTotal.innerHTML = parseMoney(housingNameSpace.runningCostTotal);
    },

    toggleTileGroup: function(e) {
        for (i = 0; i < housingTileGroups.length; i++) {
            housingTileGroups[i].classList.remove('active');
        }
        document.getElementById(e.target.getAttribute("data-group")).classList.add('active');
        for (i = 0; i < housingToggleButtons.length; i++) {
            housingToggleButtons[i].classList.remove('active');
        }
        e.target.classList.add('active');
    },

    adjustRotation: function(whichDirection) {
        var currentRotationIndex = facingsPossible.indexOf(housingNameSpace.whichFacingActive);
        currentRotationIndex += whichDirection;
        if (currentRotationIndex < 0) {
            currentRotationIndex = facingsPossible.length - 1;
        }
        if (currentRotationIndex >= facingsPossible.length) {
            currentRotationIndex = 0;
        }
        housingNameSpace.whichFacingActive = facingsPossible[currentRotationIndex];
    },
    adjustZIndex: function(whichDirection) {
        housingNameSpace.whichZIndexActive += whichDirection;
        if (housingNameSpace.whichZIndexActive < 0) {
            housingNameSpace.whichZIndexActive = 0;
            if (housingNameSpace.whichElevationActive > 0) {
                housingNameSpace.whichElevationActive--;
                housingNameSpace.updateElevationDisplay();
            }
        }
        if (housingNameSpace.whichZIndexActive >= housingNameSpace.zIndexesPerElevation) {
            if (housingNameSpace.whichElevationActive < housingNameSpace.maxElevationsPossible) {
                housingNameSpace.whichZIndexActive = 0;
                housingNameSpace.whichElevationActive++;
                housingNameSpace.updateElevationDisplay();
            } else {
                housingNameSpace.whichZIndexActive = housingNameSpace.zIndexesPerElevation;
            }
        }
    },

    updateElevationDisplay: function() {
        // show which elevation
        // ghost other levels
    },

    findTileAtLocation: function(tileX, tileY) {
        var foundIndices = [];
        var indexToFillOn = '';
        for (var i = 0; i < hero.housing.draft[housingNameSpace.whichElevationActive].length; i++) {
            if (hero.housing.draft[housingNameSpace.whichElevationActive][i].tileX == tileX) {
                if (hero.housing.draft[housingNameSpace.whichElevationActive][i].tileY == tileY) {
                    foundIndices.push[i];
                    // save this in case only a single item is on this tile:
                    indexToFillOn = hero.housing.draft[housingNameSpace.whichElevationActive][i].type;
                }
            }
        }
        if (foundIndices.length > 1) {
            //find the lowest zdepth tile
            var thisZDepth;
            var lowestZDepthFound = 9999;
            for (i = 0; i < foundIndices.length; i++) {
                thisZDepth = 9999;
                if (hero.housing.draft[housingNameSpace.whichElevationActive][(foundIndices[i])].tileZ) {
                    thisZDepth = hero.housing.draft[housingNameSpace.whichElevationActive][(foundIndices[i])].tileZ;
                }
                if (thisZDepth < lowestZDepthFound) {
                    lowestZDepthFound = thisZDepth;
                    indexToFillOn = foundIndices[i];
                }
            }
        }
        return indexToFillOn;
    },

    floodFillFrom: function(startTileX, startTileY) {
        housingNameSpace.floodFillTilesChecked = [];
        housingNameSpace.floodFillTile(startTileX, startTileY, housingNameSpace.findTileAtLocation(startTileX, startTileY));
    },

    floodFillTile: function(tileX, tileY, typeToReplace) {
        // make sure it's not been checked already:
        if (housingNameSpace.floodFillTilesChecked.indexOf(tileX + "_" + tileY) == -1) {
            housingNameSpace.floodFillTilesChecked.push(tileX + "_" + tileY);
            // make sure it's valid:
            if (tileX >= 0) {
                if (tileX < (hero.housing.southEastCornerTileX - hero.housing.northWestCornerTileX)) {
                    if (tileY >= 0) {
                        if (tileY < (hero.housing.southEastCornerTileY - hero.housing.northWestCornerTileY)) {
                            if (housingNameSpace.findTileAtLocation(tileX, tileY) == typeToReplace) {
                                if (typeToReplace != '') {
                                    // remove tile of this type:
                                    var tilesBeingRemoved = hero.housing.draft[housingNameSpace.whichElevationActive].filter(function(currentItemObject) {
                                        return ((currentItemObject.tileX == tileX) && (currentItemObject.tileY == tileY) && (currentItemObject.type == typeToReplace));
                                    });
                                    for (var i in tilesBeingRemoved) {
                                        // refund cost:
                                        housingNameSpace.runningCostTotal -= parseInt(document.getElementById("housingTile" + tilesBeingRemoved[i].type).getAttribute('data-price'));
                                    }
                                    housingNameSpace.updateRunningTotal();
                                    // find items at this tile and remove them:
                                    hero.housing.draft[housingNameSpace.whichElevationActive] = hero.housing.draft[housingNameSpace.whichElevationActive].filter(function(currentItemObject) {
                                        return (!((currentItemObject.tileX == tileX) && (currentItemObject.tileY == tileY) && (currentItemObject.type == typeToReplace)));
                                    });
                                }
                                housingNameSpace.addTileToLocation(tileX, tileY);
                                // fill neighbours:
                                housingNameSpace.floodFillTile(tileX + 1, tileY, typeToReplace);
                                housingNameSpace.floodFillTile(tileX - 1, tileY, typeToReplace);
                                housingNameSpace.floodFillTile(tileX, tileY + 1, typeToReplace);
                                housingNameSpace.floodFillTile(tileX, tileY - 1, typeToReplace);
                            }
                        }
                    }
                }
            }
        }
    }
}
var allCardPacks = [
    [1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3],
    [1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3]
];

//tempCardData = '{[[null, null, null],["5", "10", "Bomb"],["5", "10", "Chocobo"],["5", "10", "Mog"],["5", "10", "Cactuar"],["5", "10", "Shiva"],["5", "10", "Tonberry"],["5", "10", "Slime"]]}';
  //  cardGameNameSpace.allCardData = tempCardData;

function cardGamePlayer2Concedes() {
  
delete thisChallengeNPC.isPlayingCards;

 processSpeech(thisChallengeNPC, thisChallengeNPC.cardGameSpeech.win[0], thisChallengeNPC.cardGameSpeech.win[1]);
    closeCardGame();
}

function cardGamePlayer2Wins() {
    // player won
    hero.stats.cardGamesWon++;
    hero.stats.cardGamesPlayed++;
    hero.currency.cardDust += 7;
    UI.updateCurrencies();UI.updateCardAlbum();
    if(typeof thisChallengeNPC.cardBackId !== "undefined") {
if(hero.cardBacks.indexOf(parseInt(thisChallengeNPC.cardBackId)) == -1) {
hero.cardBacks.push(parseInt(thisChallengeNPC.cardBackId));
UI.showNotification("<p>I've just won a new card back</p>");
UI.updateCardAlbum();
}
    }
    delete thisChallengeNPC.isPlayingCards;
    processPlayerWinSpeech(thisChallengeNPC, thisChallengeNPC.cardGameSpeech.lose[0], thisChallengeNPC.cardGameSpeech.lose[1]);
    closeCardGame();
}

function cardGamePlayer1Wins() {
    // player lost
    hero.stats.cardGamesLost++;
      hero.stats.cardGamesPlayed++;
    hero.currency.cardDust += 1;
    UI.updateCurrencies();UI.updateCardAlbum();
     delete thisChallengeNPC.isPlayingCards;
    processSpeech(thisChallengeNPC, thisChallengeNPC.cardGameSpeech.win[0], thisChallengeNPC.cardGameSpeech.win[1]);
    closeCardGame();
}

function cardGameIsDrawn() {
    console.log("DRAWN");
     console.log(thisChallengeNPC);
    hero.stats.cardGamesDrawn++;
      hero.stats.cardGamesPlayed++;
    hero.currency.cardDust += 3;
    UI.updateCurrencies();UI.updateCardAlbum();
     delete thisChallengeNPC.isPlayingCards;
    processSpeech(thisChallengeNPC, thisChallengeNPC.cardGameSpeech.draw[0], thisChallengeNPC.cardGameSpeech.draw[1]);
    closeCardGame();
}

function processPlayerWinSpeech(thisChallengeNPC, thisSpeechPassedIn, thisSpeechCode) {
    if (thisSpeechCode != "") {
        var questSpeech = thisSpeechCode.split("|");
        var questId = questSpeech[1];
        if (questData[questId].hasBeenCompleted < 1) {
            if (giveQuestRewards(questId)) {
                if (questData[questId].isRepeatable > 0) {
                    questData[questId].hasBeenCompleted = 0;
                } else {
                    questData[questId].hasBeenCompleted = 1;
                }
                UI.showDialogue(thisChallengeNPC, thisChallengeNPC.cardGameSpeech.lose[0] + questSpeech[2]);
                canCloseDialogueBalloonNextClick = true;
                checkForTitlesAwarded(questId);
            }
        } else {
            // there was a quest, but it's been completed - just show ordinary text:
            processSpeech(thisChallengeNPC, thisChallengeNPC.cardGameSpeech.lose[0], thisChallengeNPC.cardGameSpeech.lose[1]);
        }
    } else {
        // no quest associated, just show ordinary text:
        processSpeech(thisChallengeNPC, thisChallengeNPC.cardGameSpeech.lose[0], thisChallengeNPC.cardGameSpeech.lose[1]);
    }
}




function startCardGame(opponentNPC) {
    console.log(opponentNPC.name);
    if (hero.cards.length >= 12) {
        cardGameNameSpace.player2Cards = hero.cards.slice(0, 12);
        // combine the NPC's unique cards with their base pack and pick the first 12:
        cardGameNameSpace.player1Cards = opponentNPC.uniqueCards.concat(allCardPacks[opponentNPC.baseCardPack]).slice(0, 12);
        cardGameNameSpace.player1Skill = opponentNPC.cardSkill;
        if (opponentNPC.cardBackId) {
            cardGameNameSpace.NPCCardBackColour = opponentNPC.cardBackId;
        } else {
            cardGameNameSpace.NPCCardBackColour = undefined;
        }
        cardGameNameSpace.initialiseCardGame();
        cardGameWrapper.classList.add("active");
        opponentNPC.isPlayingCards = true;
        audio.playMusic('card-game-NOT_MINE-Shuffle-or-Boogie');
    } else {
        UI.showNotification('<p>I don\'t have enough cards</p>');
    }
}



function closeCardGame() {
    gameMode = "play";
    audio.fadeOutMusic('card-game-NOT_MINE-Shuffle-or-Boogie',2.5);
    cardGameWrapper.classList.remove("active");
    document.getElementById("cardGame").removeEventListener("click", cardGameNameSpace.canvasClick, false);
}

/*
function pickBestCardToTake(whichDeck) {
    // find the best opponent's card and give it to the winner
    var highestScoreSoFar = -1;
    var whichIndex = 0;
    var thisCardsScore;
    for (var i = 0; i < whichDeck.length; i++) {
        // square the results so that a 10/1 card is favoured to a 5/6 card:
        thisCardsScore = cardGameNameSpace.allCardData[whichDeck[i]][0] * cardGameNameSpace.allCardData[whichDeck[i]][0] + cardGameNameSpace.allCardData[whichDeck[i]][1] * cardGameNameSpace.allCardData[whichDeck[i]][1];
        if (thisCardsScore > highestScoreSoFar) {
            highestScoreSoFar = thisCardsScore;
            whichIndex = i;
        }
    }
    return whichIndex;
}
*/

function openBoosterPack() {
    // pick 5 random, but different, cards:
    // change this to ensure there is a set ratio of rares in each pack? #####
    boosterCardsToAdd = [];
    var thisCardToAdd;
    do {
        thisCardToAdd = getRandomInteger(1, cardGameNameSpace.allCardData.length);
        if (boosterCardsToAdd.indexOf(thisCardToAdd) == -1) {
            boosterCardsToAdd.push(thisCardToAdd);
        }
    } while (boosterCardsToAdd.length < 5);

    /*
    // randomly assign one of these to be a rare:
    // (need graphics)
    if(getRandomIntegerInclusive(1,10) == 1) {
        boosterCardsToAdd[0] = (0-boosterCardsToAdd[0]);
    }
    */
    var boosterPackCards = document.getElementsByClassName('cardFlip');
    for (var i = 0; i < boosterPackCards.length; i++) {
        boosterPackCards[i].classList.remove('active');
      
    }


    // they should all be in cache from the Card Album, so no need to wait for them to load
    var imageClass;
    for (var i = 0; i < 5; i++) {
        // check if it's a new card:
        imageClass = "";
        if (hero.cards.indexOf(boosterCardsToAdd[i]) == -1) {
            imageClass = ' class="new"';
        }
        if (boosterCardsToAdd[i] < 0) {
            // rare animated card:
            document.getElementById("boosterCard" + i).innerHTML = '<div class="rare"><div class="card players" style="background-image:url(/images/card-game/cards/' + boosterCardsToAdd[i] + '.png)"></div></div>';
        } else {
            document.getElementById("boosterCard" + i).innerHTML = '<img' + imageClass + ' src="/images/card-game/cards/' + boosterCardsToAdd[i] + '.png" alt="' + cardGameNameSpace.allCardData[(boosterCardsToAdd[i][3])] + '">';
        }

    }

    boosterPack.classList.add('active');
    boosterCardsRevealed = 0;
    boosterPack.addEventListener("click", revealBoosterCard, false);
}




function revealBoosterCard(e) {
    if (e.target.nodeName == "IMG") {
        e.target.parentNode.parentNode.parentNode.classList.add('active');
        boosterCardsRevealed++;
        if (boosterCardsRevealed >= 5) {
            hero.cards = boosterCardsToAdd.concat(hero.cards);
            UI.updateCardAlbum();
            boosterPack.classList.remove('active');

        }
    }
}

function hnefataflPlayer2Concedes() {
    delete thisChallengeNPC.isPlayingCards;
    processSpeech(thisChallengeNPC, thisChallengeNPC.hnefataflSpeech.win[0], thisChallengeNPC.hnefataflSpeech.win[1]);
    closeHnefataflGame();
}

function hnefataflPlayer2Wins() {
    // player won
    hero.stats.hnefataflGamesWon++;
    hero.stats.hnefataflGamesPlayed++;


    delete thisChallengeNPC.isPlayingCards;
    processHnefataflPlayerWinSpeech(thisChallengeNPC, thisChallengeNPC.hnefataflSpeech.lose[0], thisChallengeNPC.hnefataflSpeech.lose[1]);
    closeHnefataflGame();
}

function hnefataflPlayer1Wins() {
    // player lost
    hero.stats.hnefataflGamesLost++;
    hero.stats.hnefataflGamesPlayed++;

    delete thisChallengeNPC.isPlayingCards;
    processSpeech(thisChallengeNPC, thisChallengeNPC.hnefataflSpeech.win[0], thisChallengeNPC.hnefataflSpeech.win[1]);
    closeHnefataflGame();
}

function hnefataflIsDrawn() {

    hero.stats.hnefataflGamesDrawn++;
    hero.stats.hnefataflGamesPlayed++;


    delete thisChallengeNPC.isPlayingCards;
    processSpeech(thisChallengeNPC, thisChallengeNPC.hnefataflSpeech.draw[0], thisChallengeNPC.hnefataflSpeech.draw[1]);
    closeHnefataflGame();
}

function processHnefataflPlayerWinSpeech(thisChallengeNPC, thisSpeechPassedIn, thisSpeechCode) {
    if (thisSpeechCode != "") {
        var questSpeech = thisSpeechCode.split("|");
        var questId = questSpeech[1];
        if (questData[questId].hasBeenCompleted < 1) {
            if (giveQuestRewards(questId)) {
                if (questData[questId].isRepeatable > 0) {
                    questData[questId].hasBeenCompleted = 0;
                } else {
                    questData[questId].hasBeenCompleted = 1;
                }
                UI.showDialogue(thisChallengeNPC, thisChallengeNPC.hnefataflSpeech.lose[0] + questSpeech[2]);
                canCloseDialogueBalloonNextClick = true;
                checkForTitlesAwarded(questId);
            }
        } else {
            // there was a quest, but it's been completed - just show ordinary text:
            processSpeech(thisChallengeNPC, thisChallengeNPC.hnefataflSpeech.lose[0], thisChallengeNPC.hnefataflSpeech.lose[1]);
        }
    } else {
        // no quest associated, just show ordinary text:
        processSpeech(thisChallengeNPC, thisChallengeNPC.hnefataflSpeech.lose[0], thisChallengeNPC.hnefataflSpeech.lose[1]);
    }
}




function startHnefataflGame(opponentNPC) {
    console.log(opponentNPC.name);


    hnefataflNameSpace.initialisehnefataflGame();
    hnefataflGameWrapper.classList.add("active");
    opponentNPC.isPlayingCards = true;
    //   audio.playMusic('card-game-NOT_MINE-Shuffle-or-Boogie');

}



function closeHnefataflGame() {
    gameMode = "play";
    //   audio.fadeOutMusic('card-game-NOT_MINE-Shuffle-or-Boogie');
    hnefataflGameWrapper.classList.remove("active");
    document.getElementById("hnefataflGame").removeEventListener("click", hnefataflNameSpace.canvasClick, false);
}
const Input = {
    isUsingGamePad: false,
    gamePad: null,
    gameLastPadTimeStamp: null,
    init: function() {
        // Set up the keyboard events
        document.addEventListener('keydown', function(e) { Input.changeKey(e, 1, "down") });
        document.addEventListener('keyup', function(e) { Input.changeKey(e, 0, "up") });

        if (navigator.getGamepads || navigator.getGamepads()) {

            window.addEventListener("gamepadconnected", function() {
                Input.isUsingGamePad = true;
                //   Input.gamePad = navigator.getGamepads()[0];

            });
            window.addEventListener("gamepaddisconnected", function(e) {
                Input.isUsingGamePad = false;
                //  Input.gamePad = null;
            });
        }

        if ("ontouchstart" in document.documentElement) {
            Input.initTouchEvents();
        }


    },

    // called on key up and key down events
    changeKey: function(e, to, type) {
        var focussedTagType = document.activeElement.tagName;
        var isContentEditable = document.activeElement.hasAttribute('contenteditable');
        // don't react to key presses if the currently focussed element is an input:
        if ((focussedTagType != "INPUT") && (focussedTagType != "TEXTAREA") && (focussedTagType != "SELECT") && (!isContentEditable)) {
            switch (e.keyCode) {
                case KeyBindings.left:
                    // prevent the page from scrolling:
                    e.preventDefault();
                    key[0] = to;
                    break;
                case KeyBindings.up:
                    e.preventDefault();
                    key[2] = to;
                    break;
                case KeyBindings.right:
                    e.preventDefault();
                    key[1] = to;
                    break;
                case KeyBindings.down:
                    e.preventDefault();
                    key[3] = to;
                    break;

                case KeyBindings.action:
                    // action should only be on key Up:
                    key[4] = 0;
                    if (type === "up") {
                        key[4] = 1;
                    }
                    break;
                case KeyBindings.shift:
                    key[5] = to;
                    break;
                case KeyBindings.challenge:
                    key[6] = to;
                    break;
                case KeyBindings.toggleUI:
                    key[7] = to;
                    break;
                case KeyBindings.toggleJournal:
                    key[8] = to;
                    break;
                case KeyBindings.toggleToolLeft:
                    key[9] = to;
                    break;
                case KeyBindings.toggleToolRight:
                    key[10] = to;
                    break;
                case KeyBindings.printScreen:
                    // action should only be on key Up:
                    key[11] = 0;
                    if (type === "up") {
                        key[11] = 1;
                    }
                    break;
                case KeyBindings.escape:
                    key[12] = to;
                    break;
                    case KeyBindings.cursorUp:
                      key[13] = to;
                    break;
                    case KeyBindings.cursorDown:
                      key[14] = to;
                    break;
                    case KeyBindings.cursorLeft:
                      key[15] = to;
                    break;
                    case KeyBindings.cursorRight:
                      key[16] = to;
                    break;
            }
        }
    },
    initTouchEvents: function() {
        document.getElementById('touchTapAction').style.display = 'block';
        /*
        document.body.addEventListener("touchstart", function(e) {
            // startPointX = e.touches[0].pageX;
            // startPointY = e.touches[0].pageY;
        }, false);
        */
        document.body.addEventListener("touchmove", function(e) {
            // ignore multiple touches etc:
            if (e.touches.length > 1 || e.scale && e.scale !== 1) {
                return;
            }
            // stop the map being dragged (needs the passive: false to work):
            e.preventDefault();
            //   deltaX = e.touches[0].pageX - startPointX;
            // console.log("drag: client: " + e.touches[0].clientX + ", " + e.touches[0].clientY);
            moveHeroTowards(e.touches[0].clientX, e.touches[0].clientY);
        }, { passive: false });
        document.body.addEventListener("touchend", function(e) {
            //    console.log("tap: client: " + e.changedTouches[0].clientX + ", " + e.changedTouches[0].clientY);


            // check if was dragging, and if so:
            key[0] = false;
            key[1] = false;
            key[2] = false;
            key[3] = false;
            key[5] = false;
        }, false);
    }
}
function canAddItemToInventory(itemObj) {
    // takes an array of objects and checks if all of them can be added before adding any of them
    // make copy of inventory:
    var inventoryClone = JSON.parse(JSON.stringify(hero.inventory));
    var slotsUpdated = [];
    var allItemsAdded = true;
    var moneyToAdd = 0;
    var followersAdded = [];
    var professionsAdded = [];
    var followerMarkupToAdd;
    var anyTreasureMaps = [];
    for (var k = 0; k < itemObj.length; k++) {
        // check for any money items:
        switch (itemObj[k].type) {
            case '$':
                moneyToAdd += itemObj[k].quantity;
                break;
            case 'follower':
                followersAdded.push([itemObj[k].id, itemObj[k].name]);
                break;
            case 'profession':
                professionsAdded.push(itemObj[k].id);
                break;
            default:



                if (currentActiveInventoryItems[itemObj[k].type].action == "treasureMap") {
                    anyTreasureMaps.push(itemObj[k].contains);
                }

                var quantityAddedSoFar = 0;
                // check if this type exist in the current inventory:
                var inventoryKeysFound = getObjectKeysForInnerValue(inventoryClone, itemObj[k].type, "type");
                if (inventoryKeysFound.length > 0) {
                    // loop through keysFound and add to the slot maximum
                    for (var i = 0; i < inventoryKeysFound.length; i++) {
                        // make sure the slot isn't locked:
                        if (!(document.getElementById('slot' + inventoryKeysFound[i]).classList.contains('locked'))) {
                            if (itemAttributesMatch(inventoryClone[inventoryKeysFound[i]], itemObj[k])) {
                                var quantityOnSlotAlready = inventoryClone[inventoryKeysFound[i]].quantity;
                                var amountAddedToThisSlot = (maxNumberOfItemsPerSlot - quantityOnSlotAlready) > (itemObj[k].quantity - quantityAddedSoFar) ? (itemObj[k].quantity - quantityAddedSoFar) : maxNumberOfItemsPerSlot - quantityOnSlotAlready;
                                quantityAddedSoFar += amountAddedToThisSlot;
                                // add item to this slot:
                                if (amountAddedToThisSlot > 0) {
                                    slotsUpdated.push((inventoryKeysFound[i]));
                                    inventoryClone[inventoryKeysFound[i]].quantity += amountAddedToThisSlot;
                                }
                                if (quantityAddedSoFar >= itemObj[k].quantity) {
                                    break;
                                }
                            }
                        }
                    }
                }
                if (quantityAddedSoFar < itemObj[k].quantity) {
                    // either filled all matching slots, or couldn't find any matching slots - find an empty slot
                    outerLoop: for (var i = 0; i < hero.bags.length; i++) {
                        var thisBagNumberOfSlots = currentActiveInventoryItems[hero.bags[i].type].actionValue;
                        // loop through slots for each bag:
                        for (var j = 0; j < thisBagNumberOfSlots; j++) {
                            var thisSlotsID = i + '-' + j;
                            if (!(thisSlotsID in inventoryClone)) {
                                // empty slot:
                                var amountAddedToThisSlot = maxNumberOfItemsPerSlot > (itemObj[k].quantity - quantityAddedSoFar) ? (itemObj[k].quantity - quantityAddedSoFar) : maxNumberOfItemsPerSlot;
                                quantityAddedSoFar += amountAddedToThisSlot;
                                // add item to this slot:
                                slotsUpdated.push(thisSlotsID);

                                inventoryClone[thisSlotsID] = JSON.parse(JSON.stringify(itemObj[k]));
                                inventoryClone[thisSlotsID].hash = createItemHash(itemObj[k].type, amountAddedToThisSlot);

                                /*
                                inventoryClone[thisSlotsID] = new Object();
                                inventoryClone[thisSlotsID].type = itemObj[k].type;
                                inventoryClone[thisSlotsID].quantity = amountAddedToThisSlot;
                                inventoryClone[thisSlotsID].quality = itemObj[k].quality;
                                inventoryClone[thisSlotsID].durability = itemObj[k].durability;
                                inventoryClone[thisSlotsID].currentWear = itemObj[k].currentWear;
                                inventoryClone[thisSlotsID].effectiveness = itemObj[k].effectiveness;
                                inventoryClone[thisSlotsID].wrapped = itemObj[k].wrapped;
                                inventoryClone[thisSlotsID].colour = itemObj[k].colour;
                                inventoryClone[thisSlotsID].enchanted = itemObj[k].enchanted;
                                inventoryClone[thisSlotsID].hallmark = itemObj[k].hallmark;
                                inventoryClone[thisSlotsID].hash = createItemHash(itemObj[k].type, amountAddedToThisSlot);
                                inventoryClone[thisSlotsID].inscription = "";
                                if (typeof itemObj[k].inscription !== "undefined") {
                                    inventoryClone[thisSlotsID].inscription = {};
                                    inventoryClone[thisSlotsID].inscription.title = itemObj[k].inscription.title;
                                    inventoryClone[thisSlotsID].inscription.content = itemObj[k].inscription.content;
                                    inventoryClone[thisSlotsID].inscription.timeCreated = itemObj[k].inscription.timeCreated;
                                }
                                if (typeof itemObj[k].contains !== "undefined") {
                                    inventoryClone[thisSlotsID].contains = JSON.parse(JSON.stringify(itemObj[k].contains));
                                }
                                */
                                if (quantityAddedSoFar >= itemObj[k].quantity) {
                                    // stop both loops:
                                    break outerLoop;
                                }
                            }
                        }
                    }
                }
                if (quantityAddedSoFar != itemObj[k].quantity) {
                    allItemsAdded = false;
                }
        }
    }
    if (allItemsAdded) {
        // make the active inventory be the same as the amended one:
        hero.inventory = JSON.parse(JSON.stringify(inventoryClone));
        UI.updatePanelsAfterInventoryChange();
        if (moneyToAdd > 0) {
            hero.currency['money'] += moneyToAdd;
            UI.updateCurrencies();
            audio.playSound(soundEffects['coins'], 0);
        }
        if (followersAdded.length > 0) {
            for (var i = 0; i < followersAdded.length; i++) {
                UI.showNewFollower(followersAdded[i][0], followersAdded[i][1]);
                // update database:
                sendDataWithoutNeedingAResponse("/game-world/activateRetinueFollower.php?followerID=" + followersAdded[i][0]);
                // show in retinue panel:
                followerMarkupToAdd = '<li id="retinueFollower' + followersAdded[i][0] + '" class="available" data-locationx="200" data-locationy="350" data-activeonquest="-1"><div class="portrait"><img src="/images/retinue/' + followersAdded[i][0] + '.png" alt=""></div><h3>' + followersAdded[i][1] + '</h3><p>waiting for a quest</p></li>';
                retinueList.insertAdjacentHTML('beforeend', followerMarkupToAdd);
            }
        }
        if (professionsAdded.length > 0) {
            for (var i = 0; i < professionsAdded.length; i++) {
                if (hero.professionsKnown.indexOf(professionsAdded[i]) == -1) {
                    hero.professionsKnown.push(professionsAdded[i]);
                    UI.showNewProfession(professionsAdded[i]);
                }
            }
        }
        if (anyTreasureMaps.length > 0) {
            for (var i = 0; i < anyTreasureMaps.length; i++) {
                UI.createTreasureMap(anyTreasureMaps[i]);
            }
        }
        // return success, and the slots that were affected:
        return [true, slotsUpdated];
    } else {
        // don't change the current inventory - return false:
        return [false];
    }
}



/*
function hasItemInInventory(itemType, amountNeeded) {
    if (typeof amountNeeded === "undefined") {
        var amountNeeded = 1;
    }

    var quantityFound = 0;
    var inventoryKeysFound = getObjectKeysForInnerValue(hero.inventory, parseInt(itemType), "type");
    if (inventoryKeysFound.length > 0) {
        for (var i = 0; i < inventoryKeysFound.length; i++) {
            quantityFound += hero.inventory[inventoryKeysFound[i]].quantity;
        }
    }
    if (quantityFound >= amountNeeded) {
        return true;
    } else {
        return false;
    }
}
*/







function hasItemsInInventory(itemsToAdd) {
    // takes an array of objects and checks if all of them exist in the inventory:
    // (if any value is undefined, it can be any value)
    var allItemsFound = true;
    var quantityForThisItemFound, allOfTheseAttributesMatch;
    for (var i = 0; i < itemsToAdd.length; i++) {
        if (typeof itemsToAdd[i].quantity === "undefined") {
            itemsToAdd[i].quantity = 1;
        }
        quantityForThisItemFound = 0;
        var inventoryKeysFound = getObjectKeysForInnerValue(hero.inventory, itemsToAdd[i].type, "type");
        if (inventoryKeysFound.length > 0) {
            for (var j = 0; j < inventoryKeysFound.length; j++) {
                // check any defined values against this slot
                allOfTheseAttributesMatch = true;
                for (var k in itemsToAdd[i]) {


                    switch (k) {
                        case 'quantity':
                            // ignore quantity attributes:
                            break;
                            // these attributes can be greater than the defined values:
                        case 'durability':
                        case 'quality':
                        case 'effectiveness':
                            if (hero.inventory[(inventoryKeysFound[j])][k] < itemsToAdd[i][k]) {
                                allOfTheseAttributesMatch = false;
                            }
                            break;
                        default:
                            if (hero.inventory[(inventoryKeysFound[j])][k] != itemsToAdd[i][k]) {
                                allOfTheseAttributesMatch = false;
                            }

                    }



                }
                if (allOfTheseAttributesMatch) {
                    quantityForThisItemFound += hero.inventory[(inventoryKeysFound[j])]['quantity'];
                }
            }
        }
        if (quantityForThisItemFound < itemsToAdd[i].quantity) {
            allItemsFound = false;
        }
    }
    return allItemsFound;
}






function findSlotItemIdInInventory(itemType) {
    var slotsFound = [];
    for (var key in hero.inventory) {
        if (hero.inventory[key].type == itemType) {
            slotsFound.push(key);
        }
    }
    return slotsFound;
}

function hasItemTypeInInventory(itemGroupType) {
    var slotsFound = [];
    for (var key in hero.inventory) {
        if (currentActiveInventoryItems[hero.inventory[key].type].group == itemGroupType) {
            slotsFound.push(key);
        }
    }
    return slotsFound;
}



function removeItemTypeFromInventory(itemType, amount) {


    if (typeof amount === "undefined") {
        var amount = 1;
    }

    var quantityStillToRemove = amount;
    var quantityAvailableOnThisSlot;
    var inventoryKeysFound = getObjectKeysForInnerValue(hero.inventory, parseInt(itemType), "type");
    if (inventoryKeysFound.length > 0) {
        for (var i = 0; i < inventoryKeysFound.length; i++) {
            quantityAvailableOnThisSlot = hero.inventory[inventoryKeysFound[i]].quantity;
            if (quantityAvailableOnThisSlot > quantityStillToRemove) {
                removeFromInventory((inventoryKeysFound[i]), quantityStillToRemove);
                quantityStillToRemove = 0;
            } else {
                removeFromInventory((inventoryKeysFound[i]), quantityAvailableOnThisSlot);
                quantityStillToRemove -= quantityAvailableOnThisSlot;
            }
        }
    }
}

function addToInventory(whichSlot, itemObject, forceNewHash = false) {
    // make a copy not a reference:
    hero.inventory[whichSlot] = JSON.parse(JSON.stringify(itemObject));

    if ((typeof hero.inventory[whichSlot].hash === "undefined") || forceNewHash) {
        // create one:
        hero.inventory[whichSlot].hash = createItemHash(itemObject.type, itemObject.quantity);
        //   console.log(itemObject.type, itemObject.quantity, hero.inventory[whichSlot].hash);
    } else {
        //  console.log("already", hero.inventory[whichSlot].hash);
    }
    document.getElementById("slot" + whichSlot).innerHTML = generateSlotMarkup(whichSlot);
}

function removeFromInventory(whichSlot, amount) {
    var thisCurrentQuantity = hero.inventory[whichSlot].quantity;
    var thisSlotElem = document.getElementById("slot" + whichSlot);
    if (thisCurrentQuantity - amount > 0) {
        // just reduce quantity:
        hero.inventory[whichSlot].quantity -= amount;
        updateQuantity(whichSlot);
    } else {
        // remove the item:
        delete hero.inventory[whichSlot];
        // update visually:
        thisSlotElem.innerHTML = '';
    }
}

function updateQuantity(whichSlot) {
    // update visually:
    var thisSlotElem = document.getElementById("slot" + whichSlot);
    // would querySelector be faster here? ########
    for (var i = 0; i < thisSlotElem.childNodes.length; i++) {
        if (thisSlotElem.childNodes[i].className == "qty") {
            thisSlotElem.childNodes[i].innerHTML = hero.inventory[whichSlot].quantity;
        }
        if (thisSlotElem.childNodes[i].nodeName == "P") {
            thisSlotElem.childNodes[i].childNodes[2].innerHTML = 'Sell price: ' + parseMoney(Math.ceil(hero.inventory[whichSlot].quantity * sellPriceModifier * inflationModifier * currentActiveInventoryItems[hero.inventory[whichSlot].type].priceCode, 0));
        }
    }
}

function itemAttributesMatch(item1, item2) {
    if (item1.type == item2.type) {
        if (item1.quality == item2.quality) {
            if (item1.durability == item2.durability) {
                if (item1.currentWear == item2.currentWear) {
                    if (item1.effectiveness == item2.effectiveness) {
                        if (item1.colour == item2.colour) {
                            if (item1.enchanted == item2.enchanted) {
                                if (item1.hallmark == item2.hallmark) {
                                    if (item1.inscription.title == item2.inscription.title) {
                                        if (item1.inscription.content == item2.inscription.content) {
                                            if (item1.inscription.timeCreated == item2.inscription.timeCreated) {
                                                if (item1.contains == item2.contains) {
                                                    return true;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return false;
}



function inventoryItemAction(whichSlot, whichAction, allActionValues) {
    // remove the 'slot' prefix with the substring(4):
    var whichSlotNumber = whichSlot.parentElement.id.substring(4);
    // check if it has a cooldown:
    var canBeClicked = true;
    var whichActionValue;
    if (typeof hero.inventory[whichSlotNumber].cooldown !== "undefined") {
        if (hero.inventory[whichSlotNumber].cooldownTimer > 0) {
            canBeClicked = false;
        }
    }

    if (hero.inventory[whichSlotNumber].currentWear >= hero.inventory[whichSlotNumber].durability) {
        canBeClicked = false;
        UI.showNotification("<p>I need to repair this item first</p>");
    }

    if (canBeClicked) {
        var whichActionSplit = whichAction.split(",");
        var allActionValuesSplit = allActionValues.split(",");
        for (var i = 0; i < whichActionSplit.length; i++) {

            whichActionValue = allActionValuesSplit[i];

            switch (whichActionSplit[i]) {
                case "container":
                    // check it has contents:
                    if (typeof hero.inventory[whichSlotNumber].contains !== "undefined") {
                        if ((hero.inventory[whichSlotNumber].contains.length == 1) && (hero.inventory[whichSlotNumber].quantity == 1)) {
                            // if just a single wrapped item containing a single type of item, replace the wrapped with the contents:
                            // (need to ensure that when creating containers that they can't hold more than maxNumberOfItemsPerSlot of an item type)
                            hero.inventory[whichSlotNumber] = JSON.parse(JSON.stringify(hero.inventory[whichSlotNumber].contains[0]));
                            document.getElementById("slot" + whichSlotNumber).innerHTML = generateSlotMarkup(whichSlotNumber);
                            UI.showChangeInInventory([whichSlotNumber]);
                        } else {
                            var wrappedObject = JSON.parse(JSON.stringify(hero.inventory[whichSlotNumber]));
                            removeFromInventory(whichSlotNumber, 1);
                            var inventoryCheck = canAddItemToInventory(wrappedObject.contains);
                            if (inventoryCheck[0]) {
                                document.getElementById("slot" + whichSlotNumber).innerHTML = generateSlotMarkup(whichSlotNumber);
                                UI.showChangeInInventory(inventoryCheck[1]);
                            } else {
                                // restore the wrapped item:
                                hero.inventory[whichSlotNumber] = JSON.parse(JSON.stringify(wrappedObject));
                                UI.showNotification("<p>I don't have room for all of these items.</p>");
                            }
                        }
                    }
                    break;
                case "booster":
                    openBoosterPack();
                    removeFromInventory(whichSlotNumber, 1);
                    break;
                case "treasureMap":
                    UI.showTreasureMap(hero.inventory[whichSlotNumber].contains);
                    break;
                case "bag":
                    UI.addNewBag(hero.inventory[whichSlotNumber]);
                    audio.playSound(soundEffects['bagOpen'], 0);
                    removeFromInventory(whichSlotNumber, 1);
                    break;
                case "home":
                    var location = hero.inventory[whichSlotNumber].additional.split("|");
                    jumpToLocation(location[0], location[1], location[2]);
                    break;
                case "pet":
                inventorySlotReference = whichSlotNumber;
                    checkAddPetToWorld();
                    break;
                case "inscribe":
                    UI.openInscriptionPanel();
                    break;
                case "holdable":
                    UI.holdItem(whichSlotNumber);
                    break;
                case "collection":
                    // check if this zone key exists in the hero.collections object
                    if (hero.collections.hasOwnProperty(whichActionValue)) {
                        // find in the array and make it negative
                        var foundIndex = hero.collections[whichActionValue].required.indexOf(hero.inventory[whichSlotNumber].type);
                        if (foundIndex != -1) {
                            if (hero.collections[whichActionValue].required[foundIndex] > 0) {
                                hero.collections[whichActionValue].required[foundIndex] = 0 - (hero.collections[whichActionValue].required[foundIndex]);
                                // update the panel visually:
                                document.getElementById(whichActionValue + '-' + hero.inventory[whichSlotNumber].type).classList.remove('notCollected');
                                removeFromInventory(whichSlotNumber, 1);
                            } else {
                                UI.showNotification("<p>I already have that in a collection</p>");
                            }
                        }
                    }
                    break;
                case "catalogue":
                    var cataloguePanel = 'catalogue' + hero.inventory[whichSlotNumber].contains.catalogueName;
                    if (document.getElementById(cataloguePanel)) {
                        document.getElementById(cataloguePanel).classList.add('active');
                        audio.playSound(soundEffects['bookOpen'], 0);
                    } else {
                        // create the Catalogue if it doesn't already exist:  
                        var newCatalogue = { "ids": hero.inventory[whichSlotNumber].contains.required, "complete": false }
                        hero.catalogues[hero.inventory[whichSlotNumber].contains.catalogueName] = newCatalogue;
                        // create panel:
                        getCatalogueMarkup(hero.inventory[whichSlotNumber].contains.required.join("|"), hero.inventory[whichSlotNumber].contains.catalogueName);
                    }
                    break;
                case "card":
                    hero.cards.unshift(hero.inventory[whichSlotNumber].contains);
                    UI.updateCardAlbum();
                    removeFromInventory(whichSlotNumber, 1);
                    break;
                case "cardBack":
                    hero.cardBacks.unshift(0 - (hero.inventory[whichSlotNumber].contains['ugc-id']));
                    UI.updateCardAlbum();
                    removeFromInventory(whichSlotNumber, 1);
                    break;
                case "questSet":
                    if (!questData[whichActionValue].isUnderway) {
                        questData[whichActionValue].isUnderway = true;
                        addToJournal(whichActionValue);
                    }
                    break;
                case "book":
                    // check it's not empty:

                    if (hero.inventory[whichSlotNumber].inscription != "") {
                        document.getElementById("book" + whichActionValue).classList.add("active");
                        audio.playSound(soundEffects['bookOpen'], 0);
                        // check if this book starts a quest or learns a recipe etc:

                        if (typeof hero.inventory[whichSlotNumber].additional === "object") {

                            for (var thisProperty in hero.inventory[whichSlotNumber].additional) {


                                switch (thisProperty) {
                                    case 'quest':
                                        if (canOpenQuest(hero.inventory[whichSlotNumber].additional[thisProperty])) {
                                            openQuest(hero.inventory[whichSlotNumber].additional[thisProperty]);
                                        }
                                        break;
                                    case 'recipe':
                                        if (canLearnRecipe(hero.inventory[whichSlotNumber].additional[thisProperty])) {
                                            UI.showNotification("<p>I learned a new recipe</p>");
                                        } else {
                                            UI.showNotification("<p>I already know that&hellip;</p>");
                                        }
                                        break;
                                    case 'collection-quest':
                                        var collectionQuestZoneName = hero.inventory[whichSlotNumber].additional[thisProperty].zoneName;
                                        console.log(hero.inventory[whichSlotNumber].additional[thisProperty]);
                                        // check if this zone key exists in the hero.collections object
                                        if (!(hero.collections.hasOwnProperty(collectionQuestZoneName))) {


                                            // collection not started yet:

                                            hero.collections[collectionQuestZoneName] = {};
                                            hero.collections[collectionQuestZoneName].required = hero.inventory[whichSlotNumber].additional[thisProperty].required;
                                            hero.collections[collectionQuestZoneName].complete = false;
                                            UI.initiateCollectionQuestPanel(collectionQuestZoneName);
                                        }
                                        break;
                                }

                            }

                        }

                    }
                    break;
                case "recipe":
                    if (canLearnRecipe(hero.inventory[whichSlotNumber].contains)) {
                        removeFromInventory(whichSlotNumber, 1);
                        UI.showNotification("<p>I learned a new recipe</p>");
                    } else {
                        UI.showNotification("<p>I already know that&hellip;</p>");
                    }
                    break;
                case "craft":
                    if (hero.professionsKnown.indexOf(parseInt(whichActionValue)) != -1) {
                        audio.playSound(soundEffects['buttonClick'], 0);
                        UI.populateRecipeList(whichActionValue, hero.inventory[whichSlotNumber].quality);
                    } else {
                        UI.showNotification("<p>I don't know this profession yet.</p>");
                    }
                    break;
                case "deed":
                    if (isOverWorldMap) {
                        if (!hero.housing.hasAPlayerHouse) {
                            if (hasItemsInInventory([{ type: 86 }])) {
                                var actionValueSplit = whichActionValue.split('x');
                                plotPlacement.width = actionValueSplit[0];
                                plotPlacement.length = actionValueSplit[1];
                                plotPlacement.whichType = hero.inventory[whichSlotNumber].type;
                                activeAction = "plotPlacement";
                                document.addEventListener("mousemove", UI.movePlotPlacementOverlay, false);
                                document.addEventListener("click", placePlotPlacement, false);
                            } else {
                                UI.showNotification("<p>I need to buy a housing tool first</p>");
                            }
                        } else {
                            UI.showNotification("<p>I already have a house&hellip;</p>");
                        }
                    } else {
                        UI.showNotification("<p>I can't do that indoors&hellip;</p>");
                    }
                    break;
                case "house":
                    if (hero.housing.hasAPlayerHouse) {
                        UI.openHousingPanel();
                    } else {
                        UI.showNotification("<p>I don't have a house yet&hellip;</p>");
                    }
                    break;
            }
        }
        if (typeof hero.inventory[whichSlotNumber].cooldown !== "undefined") {
            hero.inventory[whichSlotNumber].cooldownTimer = hero.inventory[whichSlotNumber].cooldown;
        }
    }
}



function additionalTooltipDetail(thisItemObject) {
    // get any information that needs displaying in the tooltip:
    var tooltipInformationToAdd = "";
    switch (currentActiveInventoryItems[thisItemObject.type].action) {
        case "recipe":
            // check if it's known already:
            var isKnown = false;
            for (var i = 0; i < hero.recipesKnown.length; i++) {
                if (hero.recipesKnown[i] == thisItemObject.contains) {
                    isKnown = true;
                }
            }
            if (isKnown) {
                tooltipInformationToAdd += " (already known)";
            }
            break;
        case "collection":
            // see if the hero already has one in a collection:
            var isKnown = false;
            var whichZone = currentActiveInventoryItems[thisItemObject.type].actionValue;
            if (hero.collections.hasOwnProperty(whichZone)) {
                // key exists - collection is underway:
                var foundIndex = hero.collections[whichZone].required.indexOf(thisItemObject.type);
                if (foundIndex != -1) {
                    if (hero.collections[whichZone].required[foundIndex] > 0) {
                        tooltipInformationToAdd += " (needed for an active collection - double click to add)";
                    }
                } else {
                    // collection type is negative, so won't match the item type:
                    tooltipInformationToAdd += " (already added to a collection)";
                }
            }
            break;

    }


    return tooltipInformationToAdd;
}



function generateGenericSlotMarkup(thisItemObject) {

    var slotMarkup = '';
    var theColourPrefix = "";
    var thisFileColourSuffix = "";
    var imageClassName = "";
    var thisColourName = getColourName(thisItemObject.colour, thisItemObject.type);
    if (thisColourName != "") {
        theColourPrefix = thisColourName + " ";
        thisFileColourSuffix = "-" + thisColourName.toLowerCase();
    }
    var thisAction = currentActiveInventoryItems[thisItemObject.type].action;
    var isABook = false;
    var isACard = false;
    var rareCardSuffix = '';
    var rareCardText = '';

    if (thisAction) {
        if (thisAction.indexOf("book") != -1) {
            if (thisItemObject.inscription.content) {
                isABook = true;

            }
        }
    }

    var isHoldable = false;
    if (currentActiveInventoryItems[thisItemObject.type].holdable == 1) {
        isHoldable = true;
    }


    var dataActionMarkup = '';
    if (thisAction) {
        if (isABook) {
            var booksActionValue;
            // link this item up to the book panel using the unique hash:
            var thisBooksHash = generateHash(thisItemObject.inscription.title + thisItemObject.colour + thisItemObject.type + thisItemObject.inscription.timeCreated);
            // check if the item has multiple actions, and create the action value accordingly:
            if (thisAction.indexOf(",") == -1) {
                booksActionValue = thisBooksHash;
            } else {
                booksActionValue = currentActiveInventoryItems[thisItemObject.type].actionValue.replace("?", thisBooksHash);
            }
            dataActionMarkup = 'data-action="' + thisAction + '" data-action-value="' + booksActionValue + '" ';
            UI.buildBook(thisItemObject, thisBooksHash);
        } else {
            dataActionMarkup = 'data-action="' + thisAction + '" data-action-value="' + currentActiveInventoryItems[thisItemObject.type].actionValue + '" ';
        }
    }
    if (isHoldable) {
        dataActionMarkup = 'data-action="holdable" data-action-value="' + currentActiveInventoryItems[thisItemObject.type].action + '" ';
    }

    var thisCategories = currentActiveInventoryItems[thisItemObject.type].category.split(",");
    for (var i = 0; i < thisCategories.length; i++) {
        imageClassName += "itemCategory" + thisCategories[i] + " ";
    }



    // check if it's a card:
    if (currentActiveInventoryItems[thisItemObject.type].action == "card") {
        isACard = true;

        imageClassName += 'players card';
        var cardTypeId = thisItemObject.contains;
        if (cardTypeId < 0) {
            cardTypeId = Math.abs(cardTypeId);
            rareCardSuffix = '-rare';
            rareCardText = 'rare ';
        }
    }

    // check for User Generated Content:
    var isUGC = false;
    if (typeof thisItemObject.contains !== "undefined") {
        if (typeof thisItemObject.contains['ugc-id'] !== "undefined") {
            isUGC = true;
        }
    }
    var itemsDescription;
    if (!isUGC) {
        if (isACard) {
            itemsDescription = "A " + rareCardText + "'" + cardGameNameSpace.allCardData[cardTypeId][2] + "' totem card";
            slotMarkup += '<img src="/images/card-game/inventory-items/' + cardTypeId + rareCardSuffix + '.png" ' + dataActionMarkup + 'alt="' + theColourPrefix + currentActiveInventoryItems[thisItemObject.type].shortname + '" class="' + imageClassName + '">';
        } else {
            slotMarkup += '<img src="/images/game-world/inventory-items/' + thisItemObject.type + thisFileColourSuffix + '.png" ' + dataActionMarkup + 'alt="' + theColourPrefix + currentActiveInventoryItems[thisItemObject.type].shortname + '" class="' + imageClassName + '">';
            if (isABook) {
                itemsDescription = "&quot;" + thisItemObject.inscription.title + "&quot;";
            } else {
                itemsDescription = currentActiveInventoryItems[thisItemObject.type].description;
            }
        }
    } else {
        slotMarkup += '<img src="/images/user-generated/' + thisItemObject.contains['ugc-id'] + '-slot.png" ' + dataActionMarkup + 'alt="' + theColourPrefix + currentActiveInventoryItems[thisItemObject.type].shortname + '" class="' + imageClassName + '">';
        if (typeof thisItemObject.contains['ugc-title'] !== "undefined") {
            itemsDescription = thisItemObject.contains['ugc-title'];
        } else {
            itemsDescription = currentActiveInventoryItems[thisItemObject.type].description;
        }

    }
    if (itemsDescription.indexOf('##contains##') != -1) {
        // check it has got contains content:
        if (typeof thisItemObject.contains !== "undefined") {
            var containsItems = '';
            for (var i = 0; i < thisItemObject.contains.length; i++) {
                if (i != 0) {
                    containsItems += ", ";
                }
                containsItems += thisItemObject.contains[i].quantity + "x " + currentActiveInventoryItems[thisItemObject.contains[i].type].shortname;
            }
            itemsDescription = itemsDescription.replace('##contains##', 'Contains: ' + containsItems);
        }
    }


    var thisObjectsName = currentActiveInventoryItems[thisItemObject.type].shortname;
    if (currentActiveInventoryItems[thisItemObject.type].action == "recipe") {
        thisObjectsName = allRecipes[thisItemObject.contains][0] + " " + thisObjectsName;
        itemsDescription += " (for the " + allRecipes[thisItemObject.contains][1] + " profession).";
    }

    slotMarkup += '<p><em>' + theColourPrefix + thisObjectsName + ' </em>' + itemsDescription + ' ';
    slotMarkup += '<span class="price">Sell price: ' + parseMoney(Math.ceil(thisItemObject.quantity * sellPriceModifier * inflationModifier * currentActiveInventoryItems[thisItemObject.type].priceCode, 0)) + '</span>';
    slotMarkup += '<span class="price specialismPrice">Sell price: ' + parseMoney(Math.ceil(thisItemObject.quantity * sellPriceSpecialismModifier * inflationModifier * currentActiveInventoryItems[thisItemObject.type].priceCode, 0)) + '</span>';

    slotMarkup += additionalTooltipDetail(thisItemObject) + '</p>';
    slotMarkup += addGauge(thisItemObject);
    slotMarkup += '<span class="qty">' + thisItemObject.quantity + '</span>';

    return slotMarkup;
}


function generateSlotMarkup(thisSlotsId) {
    return generateGenericSlotMarkup(hero.inventory[thisSlotsId]) + '<div class="coolDown"></div><div class="lockedOverlay" id="lockedOverlay' + thisSlotsId + '"></div>';
}




function inventorySplitStackSubmit(e) {
    if (e) {
        e.preventDefault();
    }
    var enteredValue = splitStackInput.value;
    var isValid = true;
    enteredValue = parseInt(enteredValue);
    if (enteredValue < 1) {
        isValid = false;
    }
    if (!(Number.isInteger(enteredValue))) {
        isValid = false;
    }
    if (enteredValue > hero.inventory[UI.sourceSlot].quantity) {
        isValid = false;
    }
    if (isValid) {
        isSplitStackBeingDragged = true;

        var thisNode = document.getElementById("slot" + UI.sourceSlot);
        // clone this slot to draggableInventorySlot:
        UI.activeDragObject = document.getElementById('draggableInventorySlot');
        UI.activeDragObject.innerHTML = thisNode.innerHTML;
        // remove from inventory data:
        removeFromInventory(UI.sourceSlot, enteredValue);
        UI.draggedInventoryObject.quantity = enteredValue;
        // update visually to dragged clone:
        for (var i = 0; i < UI.activeDragObject.childNodes.length; i++) {
            if (UI.activeDragObject.childNodes[i].className == "qty") {
                UI.activeDragObject.childNodes[i].innerHTML = UI.draggedInventoryObject.quantity;
                break;
            }
        }
        UI.inDrag = true;
        var clickedSlotRect = thisNode.getBoundingClientRect();
        var pageScrollTopY = (window.pageYOffset || document.documentElement.scrollTop) - (document.documentElement.clientTop || 0);
        // 3px padding on the slots:
        objInitLeft = clickedSlotRect.left + 3;
        objInitTop = clickedSlotRect.top + 3 + pageScrollTopY;
        // +22 to centre the slot (half the slot width) under the cursor:
        dragStartX = objInitLeft + 22;
        dragStartY = objInitTop + 22;
        UI.activeDragObject.style.cssText = "z-index:4;top: " + objInitTop + "px; left: " + objInitLeft + "px; transform: translate(0px, 0px);";
        document.addEventListener("mousemove", UI.handleDrag, false);
        document.addEventListener("mouseup", UI.endInventoryDrag, false);
    }

    splitStackPanel.classList.remove("active");
    // remove focus
    document.activeElement.blur();
}

function inventorySplitStackCancel() {
    splitStackPanel.classList.remove("active");
    document.activeElement.blur();
}


function prepareInventoryObject(definedObject) {
    var thisObject = {
        "type": "$",
        "quantity": 1,
        "quality": 100,
        "durability": 100,
        "currentWear": 0,
        "effectiveness": 100,
        "colour": 0,
        "enchanted": 0,
        "hallmark": 0,
        "inscription": ""
    }
    // now copy in any defined attributes - this way don't need to waste space storing default values:
    for (var attrname in definedObject) {
        thisObject[attrname] = definedObject[attrname];
    }
    return thisObject;
}

function createItemHash(type, quantity) {
    return '' + type + quantity + characterId + Date.now();
}

function findSlotByHash(whichHash) {
    var foundHashSlot = -1;
    for (var key in hero.inventory) {
        if (hero.inventory[key].hash == whichHash) {
            foundHashSlot = key;
            break;
        }
    }
    return foundHashSlot;
}


function addGauge(thisItemObject) {
    var gaugeMarkupToAdd = '';
    if (currentActiveInventoryItems[thisItemObject.type].holdable > 0) {
        // check if it contains anything, and show a gauge if so:
        if (typeof thisItemObject.contains !== "undefined") {

            //    tooltipInformationToAdd += " contains "+thisItemObject.contains[0].quantity+"x "+currentActiveInventoryItems[thisItemObject.contains[0].type].shortname; 

            var gaugePercent = thisItemObject.contains[0].quantity / parseInt(currentActiveInventoryItems[thisItemObject.type].actionValue) * 100;

            gaugeMarkupToAdd += '<span class="gauge gauge' + currentActiveInventoryItems[thisItemObject.contains[0].type].shortname + '"><span style="width:' + gaugePercent + '%"></span></span>';

        }
    }
    return gaugeMarkupToAdd;
}


function updateGauge(whichSlotKey) {
    var gaugePercent = hero.inventory[whichSlotKey].contains[0].quantity / parseInt(currentActiveInventoryItems[hero.inventory[whichSlotKey].type].actionValue) * 100;
    document.getElementById('slot' + whichSlotKey).querySelector('.gauge span').style.width = gaugePercent + '%';
}


function reducedHeldQuantity(whichSlot) {
    hero.inventory[whichSlot].quantity--;
    if (hero.inventory[whichSlot].quantity == 0) {
        // stop 'holding' this now all gone:
        hero.holding.hash = '';
        hero.holding.type = '';
        // remove inventory slot as well:
        delete hero.inventory[whichSlot];
        // update visually:
        document.getElementById("slot" + whichSlot).innerHTML = '';
    }
}
var KeyBindings = {
    'left': 65,
    'right': 68,
    'up': 87,
    'down': 83,
    'pause': 80,
    'action': 17,
    'shift': 16,
    'challenge': 67,
    'toggleUI': 9,
    'toggleJournal': 81,
    'toggleToolLeft': 219,
    'toggleToolRight': 221,
    'printScreen': 44,
    'escape': 27,
    'cursorUp': 38,
    'cursorDown': 40,
    'cursorLeft': 37,
    'cursorRight': 39
}

if (window.Worker) {
    var lightMapWorker = new Worker('/js/worker-lightmap.js');
    lightMapWorker.onmessage = function(e) {
        lightMap = e.data;
    }
}

function updateLightMap() {
    lightMapWorker.postMessage([thisMapData, hero.tileX, hero.tileY, hero.lineOfSightRange, lightMap]);
}
if (window.Worker) {
    var pathfindingWorker = new Worker('/js/worker-pathfinding.js');
    pathfindingWorker.onmessage = function(e) {

        var thisAgentsName = e.data[0];
        if (thisAgentsName == 'pet') {
            var thisPet = hero.allPets[hero.activePets[e.data[1]]];
            thisPet.foundPath = e.data[2];
            if (thisPet.foundPath.join() == "-,pathEnd") {
                // couldn't find a path:
                thisPet.state = 'waiting';
                thisPet.foundPath = '';
            } else {
                // found one, so use it:
                thisPet.pathIndex = 1;
                thisPet.state = 'moving';
                thisPet.facing = e.data[2][0];
            }
        } else {
//console.log("pathfinding returned from Worker");
   


var thisNPC = null;
for (var m = 0; m < visibleMaps.length; m++) {

    for (var i = 0; i < thisMapData[(visibleMaps[m])].npcs.length; i++) {
     //   console.log("checking "+thisMapData[(visibleMaps[m])].npcs[i].uniqueIndex+" is = "+thisAgentsName);
     if(thisMapData[(visibleMaps[m])].npcs[i].uniqueIndex == thisAgentsName) {
thisNPC = thisMapData[(visibleMaps[m])].npcs[i];
//console.log(thisNPC);
     }
        }
    }

             if(thisNPC != null) {
        //     console.log(JSON.parse(JSON.stringify(thisMapData.npcs[thisNPCsIndex].movement)));
            // insert the new path:
            // http://stackoverflow.com/a/7032717/1054212
            thisNPC.movement.splice.apply(thisNPC.movement, [thisNPC.movementIndex + 2, 0].concat(e.data[1]));
    //    console.log(JSON.parse(JSON.stringify(thisMapData.npcs[thisNPCsIndex].movement)));
//console.log((e.data[1]));


            thisNPC.waitingForAPath = false;
            if (typeof e.data[2] !== "undefined") {
                // store the target tile so it doesn't try and go straight back to it after:
                thisNPC.lastTargetDestination = e.data[2];
            //    console.log("heading for "+e.data[2]);
            }

        }
        //    console.log(thisMapData.npcs[thisNPCsIndex].movementIndex);
          //  console.log(thisMapData.npcs[thisNPCsIndex].movement);
         //   console.log(thisMapData.npcs[thisNPCsIndex].movement[(thisMapData.npcs[thisNPCsIndex].movementIndex)]);
        }
    }
}
function isAPetTerrainCollision(object, x, y) {
    // check map bounds first:




    var globalTileX = getTileX(x);
    var globalTileY = getTileY(y);
    var tileX = getLocalCoordinatesX(globalTileX);
    var tileY = getLocalCoordinatesX(globalTileY);
    var thisMap = findMapNumberFromGlobalCoordinates(globalTileX, globalTileY);



    if (typeof thisMapData[thisMap].collisions[tileY] === "undefined") {
        return 1;
    }
    if (typeof thisMapData[thisMap].collisions[tileY][tileX] === "undefined") {
        return 1;
    }

    switch (thisMapData[thisMap].collisions[tileY][tileX]) {
        case 1:
            // is a collision:
            return 1;
            break;
        case "<":
        case ">":
        case "^":
        case "v":
            // stairs
            // #####
            return 0;
            break;
        case "d":
            // is a door:
            if (mapTransition != "") {
                // if the hero is going off the map:
                object.state = "door";
            }
            return 0;
            break;
        default:
            // not a collsiion:
            return 0;
    }

}


function movePet() {
    if (hasActivePet) {
        var thisNPC, thisItem, thisPetsTarget, thisOtherPet, oldPetX, oldPetY, thisPet, newTile, thisInnerDoor;
        for (var p = 0; p < hero.activePets.length; p++) {
            thisPet = hero.allPets[hero.activePets[p]];
            thisPetsTarget = thisPet.following;
            newTile = false;
            switch (thisPet.state) {
                case 'door':
                    // just keep moving:
                    switch (thisPet.facing) {
                        case 'n':
                            thisPet.y -= thisPet.speed;
                            break;
                        case 's':
                            thisPet.y += thisPet.speed;
                            break;
                        case 'w':
                            thisPet.x -= thisPet.speed;
                            break;
                        case 'e':
                            thisPet.x += thisPet.speed;
                            break;
                    }
                    break;
                case 'moving':
                    oldPetX = thisPet.x;
                    oldPetY = thisPet.y;
                    thisPet.drawnFacing = thisPet.facing;
                    switch (thisPet.facing) {
                        case 'n':
                            thisPet.y -= thisPet.speed;
                            // check for collisions:
                            if ((isAPetTerrainCollision(thisPet, thisPet.x - thisPet.width / 2, thisPet.y - thisPet.length / 2)) || (isAPetTerrainCollision(thisPet, thisPet.x + thisPet.width / 2, thisPet.y - thisPet.length / 2))) {
                                // find the tile's bottom edge
                                var tileCollidedWith = getTileY(thisPet.y - thisPet.length / 2);
                                var tileBottomEdge = (tileCollidedWith + 1) * tileW;
                                // use the +1 to make sure it's just clear of the collision tile
                                thisPet.y = tileBottomEdge + thisPet.heilengthght / 2 + 1;
                            }
                            break;
                        case 's':
                            thisPet.y += thisPet.speed;
                            // check for collisions:
                            if ((isAPetTerrainCollision(thisPet, thisPet.x - thisPet.width / 2, thisPet.y + thisPet.length / 2)) || (isAPetTerrainCollision(thisPet, thisPet.x + thisPet.width / 2, thisPet.y + thisPet.length / 2))) {
                                var tileCollidedWith = getTileY(thisPet.y + thisPet.length / 2);
                                var tileTopEdge = (tileCollidedWith) * tileW;
                                thisPet.y = tileTopEdge - thisPet.length / 2 - 1;
                            }
                            break;
                        case 'w':
                            thisPet.x -= thisPet.speed;
                            // check for collisions:
                            if ((isAPetTerrainCollision(thisPet, thisPet.x - thisPet.width / 2, thisPet.y + thisPet.length / 2)) || (isAPetTerrainCollision(thisPet, thisPet.x - thisPet.width / 2, thisPet.y - thisPet.length / 2))) {
                                var tileCollidedWith = getTileX(thisPet.x - thisPet.width / 2);
                                var tileRightEdge = (tileCollidedWith + 1) * tileW;
                                thisPet.x = tileRightEdge + thisPet.width / 2 + 1;
                            }
                            break;
                        case 'e':
                            thisPet.x += thisPet.speed;
                            // check for collisions:
                            if ((isAPetTerrainCollision(thisPet, thisPet.x + thisPet.width / 2, thisPet.y + thisPet.length / 2)) || (isAPetTerrainCollision(thisPet, thisPet.x + thisPet.width / 2, thisPet.y - thisPet.length / 2))) {
                                var tileCollidedWith = getTileX(thisPet.x + thisPet.width / 2);
                                var tileLeftEdge = (tileCollidedWith) * tileW;
                                thisPet.x = tileLeftEdge - thisPet.width / 2 - 1;
                            }
                            break;
                    }



                    // check for collisions against other pets:
                    for (var j = 0; j < hero.activePets.length; j++) {
                        if (p != j) {
                            thisOtherPet = hero.allPets[hero.activePets[j]];
                            if (isAnObjectCollision(thisPet.x, thisPet.y, thisPet.width, thisPet.length, thisOtherPet.x, thisOtherPet.y, thisOtherPet.width, thisOtherPet.length)) {
                                thisPet.x = oldPetX;
                                thisPet.y = oldPetY;
                                // push the other pet:
                                thisOtherPet.state = "moving";
                                thisOtherPet.facing = thisPet.facing;
                            }
                        }
                    }


                    for (var m = 0; m < visibleMaps.length; m++) {
                        // check for collisions against NPCs:

                        for (var j = 0; j < thisMapData[visibleMaps[m]].npcs.length; j++) {
                            thisNPC = thisMapData[visibleMaps[m]].npcs[j];
                            if (thisNPC.isCollidable) {
                                if (isAnObjectCollision(thisPet.x, thisPet.y, thisPet.width, thisPet.length, thisNPC.x, thisNPC.y, thisNPC.width, thisNPC.length)) {
                                    thisPet.x = oldPetX;
                                    thisPet.y = oldPetY;
                                }
                            }
                        }



                        // check for inner doors:
                        if (typeof thisMapData[visibleMaps[m]].innerDoors !== "undefined") {
                            for (var i in thisMapData[visibleMaps[m]].innerDoors) {
                                thisInnerDoor = thisMapData[visibleMaps[m]].innerDoors[i];
                                if (!thisInnerDoor.isOpen) {
                                    if (isAnObjectCollision(getTileCentreCoordX(thisInnerDoor.tileX), getTileCentreCoordY(thisInnerDoor.tileY), tileW, tileW, thisPet.x, thisPet.y, thisPet.width, thisPet.length)) {
                                        thisPet.x = oldPetX;
                                        thisPet.y = oldPetY;
                                    }
                                }
                            }
                        }


                        // check for collisions against items:
                        for (var j = 0; j < thisMapData[visibleMaps[m]].items.length; j++) {
                            thisItem = thisMapData[visibleMaps[m]].items[j];
                            if (thisItem.isCollidable) {
                                if (isAnObjectCollision(thisPet.x, thisPet.y, thisPet.width, thisPet.length, thisItem.x, thisItem.y, thisItem.width, thisItem.length)) {
                                    thisPet.x = oldPetX;
                                    thisPet.y = oldPetY;
                                }
                            }
                        }

                    }

                    // find the difference for this movement:
                    thisPet.dx += (thisPet.x - oldPetX);
                    thisPet.dy += (thisPet.y - oldPetY);
                    // see if it's at a new tile centre:

                    if (Math.abs(thisPet.dx) >= tileW) {
                        if (thisPet.dx > 0) {
                            thisPet.dx -= tileW;
                        } else {
                            thisPet.dx += tileW;
                        }
                        newTile = true;
                    }
                    if (Math.abs(thisPet.dy) >= tileW) {
                        if (thisPet.dy > 0) {
                            thisPet.dy -= tileW;
                        } else {
                            thisPet.dy += tileW;
                        }
                        newTile = true;
                    }



                    break;
                case 'findingPath':
                    // wait
                    break;
                case 'queuing':
                    // move onto the normal map grid after transitioning in:
                    if (!(isInRange(thisPetsTarget.x, thisPetsTarget.y, thisPet.x, thisPet.y, tileW * 2))) {
                        oldPetX = thisPet.x;
                        oldPetY = thisPet.y;
                        thisPet.drawnFacing = thisPet.facing;
                        switch (thisPet.facing) {
                            case 'n':
                                thisPet.y -= thisPet.speed;
                                break;
                            case 's':
                                thisPet.y += thisPet.speed;
                                break;
                            case 'w':
                                thisPet.x -= thisPet.speed;
                                break;
                            case 'e':
                                thisPet.x += thisPet.speed;
                                break;
                        }



                        // check for collisions against other pets:
                        for (var j = 0; j < hero.activePets.length; j++) {
                            if (p != j) {
                                thisOtherPet = hero.allPets[hero.activePets[j]];
                                if (isAnObjectCollision(thisPet.x, thisPet.y, thisPet.width, thisPet.length, thisOtherPet.x, thisOtherPet.y, thisOtherPet.width, thisOtherPet.length)) {
                                    thisPet.x = oldPetX;
                                    thisPet.y = oldPetY;
                                    /*
                                    // push the other pet:
                                    thisOtherPet.state = "moving";
                                    thisOtherPet.facing = thisPet.facing;
                                    */
                                }
                            }
                        }

                        for (var m = 0; m < visibleMaps.length; m++) {
                            // check for collisions against NPCs:
                            for (var j = 0; j < thisMapData[visibleMaps[m]].npcs.length; j++) {
                                thisNPC = thisMapData[visibleMaps[m]].npcs[j];
                                if (thisNPC.isCollidable) {
                                    if (isAnObjectCollision(thisPet.x, thisPet.y, thisPet.width, thisPet.length, thisNPC.x, thisNPC.y, thisNPC.width, thisNPC.length)) {
                                        thisPet.x = oldPetX;
                                        thisPet.y = oldPetY;
                                    }
                                }
                            }


                            // check for collisions against items:
                            for (var j = 0; j < thisMapData[visibleMaps[m]].items.length; j++) {
                                thisItem = thisMapData[visibleMaps[m]].items[j];
                                if (isAnObjectCollision(thisPet.x, thisPet.y, thisPet.width, thisPet.length, thisItem.x, thisItem.y, thisItem.width, thisItem.length)) {
                                    thisPet.x = oldPetX;
                                    thisPet.y = oldPetY;
                                }
                            }
                        }

                        // find the difference for this movement:
                        thisPet.dx += (thisPet.x - oldPetX);
                        thisPet.dy += (thisPet.y - oldPetY);
                        // see if it's at a new tile centre:
                        if (Math.abs(thisPet.dx) >= tileW) {
                            if (thisPet.dx > 0) {
                                thisPet.dx -= tileW;
                            } else {
                                thisPet.dx += tileW;
                            }
                            newTile = true;
                        }
                        if (Math.abs(thisPet.dy) >= tileW) {
                            if (thisPet.dy > 0) {
                                thisPet.dy -= tileW;
                            } else {
                                thisPet.dy += tileW;
                            }
                            newTile = true;
                        }
                        if (newTile) {
                            thisPet.tileX = getTileX(thisPet.x);
                            thisPet.tileY = getTileY(thisPet.y);
                            if ((thisPet.tileX < 0) || (thisPet.tileY < 0) || (thisPet.tileX >= mapTilesX) || (thisPet.tileY >= mapTilesY)) {
                                //not on a valid tile yet:
                                newTile = false;
                            }
                        }
                    }
                    break;
                default:
                    // not finding a path so check proximity to the hero (or pet that this pet is following) to see if pet should start moving:
                    if (!(isInRange(thisPetsTarget.x, thisPetsTarget.y, thisPet.x, thisPet.y, tileW * 2))) {
                        thisPet.state = "moving";
                    }
                    break;
            }
            if (newTile) {
                thisPet.tileX = getTileX(thisPet.x);
                thisPet.tileY = getTileY(thisPet.y);
                //  if (p != (hero.activePets.length - 1)) {
                // even the last one should drop a breadcrumb in case an escort quest NPC needs it
                thisPet.breadcrumb.pop();
                thisPet.breadcrumb.unshift([thisPet.tileX, thisPet.tileY]);
                //  }



                // check proximity to target to see if pet should stop moving:        
                if ((isInRange(thisPetsTarget.x, thisPetsTarget.y, thisPet.x, thisPet.y, tileW * 2))) {
                    thisPet.state = "wait";
                } else {
                    // check the breadcrumb for next direction:
                    var breadcrumbFound = false;
                    for (var i = 0; i < thisPetsTarget.breadcrumb.length; i++) {
                        if ((thisPet.tileY) == thisPetsTarget.breadcrumb[i][1]) {
                            if ((thisPet.tileX - 1) == thisPetsTarget.breadcrumb[i][0]) {
                                thisPet.facing = "w";
                                breadcrumbFound = true;
                                break;
                            } else if ((thisPet.tileX + 1) == thisPetsTarget.breadcrumb[i][0]) {
                                thisPet.facing = "e";
                                breadcrumbFound = true;
                                break;
                            }
                        } else if ((thisPet.tileX) == thisPetsTarget.breadcrumb[i][0]) {
                            if ((thisPet.tileY + 1) == thisPetsTarget.breadcrumb[i][1]) {
                                thisPet.facing = "s";
                                breadcrumbFound = true;
                                break;
                            } else if ((thisPet.tileY - 1) == thisPetsTarget.breadcrumb[i][1]) {
                                thisPet.facing = "n";
                                breadcrumbFound = true;
                                break;
                            }
                        }
                    }

                    if (breadcrumbFound) {
                        thisPet.state = "moving";
                        thisPet.foundPath = '';
                    } else {
                        if (thisPet.foundPath != '') {
                            // try for breadcrumbs first, but use path if not
                            thisPet.facing = thisPet.foundPath[thisPet.pathIndex];
                            thisPet.pathIndex++;
                            if (thisPet.pathIndex >= thisPet.foundPath.length) {
                                // come to end of the path, try and find a new one:
                                pathfindingWorker.postMessage(['petToHero', hero.allPets[hero.activePets[p]], thisMapData, thisPetsTarget.tileX, thisPetsTarget.tileY, p, visibleMaps, isOverWorldMap]);
                                thisPet.state = "findingPath";
                                thisPet.foundPath = '';
                            }
                        } else {
                            if (thisPet.state != 'findingPath') {
                                // pathfind to hero
                                pathfindingWorker.postMessage(['petToHero', hero.allPets[hero.activePets[p]], thisMapData, thisPetsTarget.tileX, thisPetsTarget.tileY, p, visibleMaps, isOverWorldMap]);
                                thisPet.state = "findingPath";
                            }
                        }
                    }
                }
            }
          //  if (isOverWorldMap) {
                checkForSlopes(thisPet);
            /*
            } else {
                // make sure it's on the map, and not moving in from behind the hero:
                if ((thisPet.tileX >= 0) && (thisPet.tileY >= 0) && (thisPet.tileX < mapTilesX) && (thisPet.tileY < mapTilesY)) {
                    checkForSlopes(thisPet);
                }
            }
            */
        }
    }
}

function isPetBlocked(whichPet, whichFacing) {
    var isBlocked = false;
    switch (whichFacing) {
        case 'n':
            if (isAPetTerrainCollision(whichPet, getTileCentreCoordX(whichPet.tileX), getTileCentreCoordY(whichPet.tileY - 1))) {
                isBlocked = true;
            }
            break;

        case 's':
            if (isAPetTerrainCollision(whichPet, getTileCentreCoordX(whichPet.tileX), getTileCentreCoordY(whichPet.tileY + 1))) {
                isBlocked = true;
            }
            break;

        case 'e':
            if (isAPetTerrainCollision(whichPet, getTileCentreCoordX(whichPet.tileX + 1), getTileCentreCoordY(whichPet.tileY))) {
                isBlocked = true;
            }
            break;

        case 'w':
            if (isAPetTerrainCollision(whichPet, getTileCentreCoordX(whichPet.tileX - 1), getTileCentreCoordY(whichPet.tileY))) {
                isBlocked = true;
            }
            break;

    }
    return isBlocked;
}

function pushPetAway(whichPet) {
    // hero has collided with the pet, move the pet away so they don't block the hero in:
    var thisPet = hero.allPets[hero.activePets[whichPet]];
    if (!isPetBlocked(thisPet, hero.facing)) {
        thisPet.state = "moving";
        thisPet.facing = hero.facing;
    } else {
        // try a side:
        var possibleSidewaysMoves = [];
        switch (hero.facing) {
            case 'n':
            case 's':
                possibleSidewaysMoves = ['e', 'w'];
                break;
            case 'w':
            case 'e':
                possibleSidewaysMoves = ['n', 's'];
                break;
        }
        if (!isPetBlocked(thisPet, possibleSidewaysMoves[0])) {
            thisPet.state = "moving";
            thisPet.facing = possibleSidewaysMoves[0];
        } else if (!isPetBlocked(thisPet, possibleSidewaysMoves[1])) {
            thisPet.state = "moving";
            thisPet.facing = possibleSidewaysMoves[1];
        } else {
            thisPet.state = "wait";
        }
    }
}

function addToJournal(whichQuestId) {
    // pass hero.totalGameTimePlayed to allow sorting when loading from scratch? ###
    getJSON("/game-world/getQuestJournalEntries.php?chr="+characterId+"&questID=" + whichQuestId, function(data) {
        UI.addToQuestJournal(data);
    }, function(status) {
        // error - try again:
        addToJournal(whichQuestId);
    });
}

function removeFromJournal(whichQuestId) {
    var elementToRemove = document.getElementById("quest" + whichQuestId);
    // check it exists, in case it was hidden from the Journal:
    if(elementToRemove) {
    elementToRemove.remove();
}
}

function declineQuest() {
    acceptQuestChoice.classList.remove('active');
    // show declined speech:
    processSpeech(questResponseNPC, questResponseNPC.speech[questResponseNPC.speechIndex][4], questResponseNPC.speech[questResponseNPC.speechIndex][5], false);
    canCloseDialogueBalloonNextClick = true;
    questResponseNPC = null;
}

function acceptQuest() {
    acceptQuestChoice.classList.remove('active');
    // show accepted speech:
    processSpeech(questResponseNPC, questResponseNPC.speech[questResponseNPC.speechIndex][6], questResponseNPC.speech[questResponseNPC.speechIndex][7], false);
    openQuest(questResponseNPC.speech[questResponseNPC.speechIndex][2]);
    canCloseDialogueBalloonNextClick = true;
    questResponseNPC = null;
}

function canOpenQuest(questId) {
    if (!(questData[questId].isUnderway)) {
        if ((questData[questId].hasBeenCompleted == "0") || (questData[questId].isRepeatable == "1")) {
            return true;
        }
    }
    return false;
}

function openQuest(questId) {

    var okToStartQuest = true;
    // see if any items need to be given to start the quest:
    if (questData[questId].startItemsReceived) {
        var itemsToAdd = questData[questId].startItemsReceived;
        var allItemsToGive = [];
        for (var l = 0; l < itemsToAdd.length; l++) {



            var thisRewardObject = prepareInventoryObject(itemsToAdd[l]);


            allItemsToGive.push(thisRewardObject);
        }
        inventoryCheck = canAddItemToInventory(allItemsToGive);
        if (inventoryCheck[0]) {
            UI.showChangeInInventory(inventoryCheck[1]);
        } else {
            okToStartQuest = false;
        }
    }
    if (okToStartQuest) {
        // open quest:
        switch (questData[questId].whatIsRequiredForCompletion) {
            case "possess":
            case "give":
            case "":
                // ###
                break;
            case "multi":
                // open all sub quests:
                var allSubQuestsRequired = questData[questId].subQuestsRequiredForCompletion.split(",");

                for (var k = 0; k < allSubQuestsRequired.length; k++) {
                    //questData[allSubQuestsRequired[k]].isUnderway = 1;
                    switch (questData[allSubQuestsRequired[k]].whatIsRequiredForCompletion) {
                        case "possess":
                        case "give":
                        case "":
                            //
                            break;
                        case "world":
                            //
                            break;
                        default:
                            // threshold quest:
                            questData[allSubQuestsRequired[k]].valueAtQuestStart = accessDynamicVariable(questData[allSubQuestsRequired[k]].whatIsRequiredForCompletion);
                            break;
                    }
                    questData[allSubQuestsRequired[k]].isUnderway = true;
                }
                break;
            case "world":
                // ###
                break;
            default:
                // threshold quest:
                questData[questId].valueAtQuestStart = accessDynamicVariable(questData[questId].whatIsRequiredForCompletion);      
                break;
        }
        questData[questId].isUnderway = true;
        addToJournal(questId);
    }
}


function checkForEscortQuestEnd(whichNPC) {
    var destination = whichNPC.speech[whichNPC.speechIndex][3].split("|");
    // global coordinates are passed in here:

        var destinationTileCentreX = getTileCentreCoordX(destination[0]);
        var destinationTileCentreY = getTileCentreCoordY(destination[1]);
       
        if (isInRange(whichNPC.x, whichNPC.y, destinationTileCentreX, destinationTileCentreY, destination[2] * tileW)) {
            // quest complete
        
            whichNPC.drawnFacing = turntoFace(whichNPC, hero);
            // remove the reference to it in the hero object:
            for (var i = 0; i < hero.npcsFollowing.length; i++) {
                if (hero.npcsFollowing[i] === whichNPC) {
                    hero.npcsFollowing.splice(i, 1);
                    break;
                }
            }
            // get fae to move to this NPC:
            fae.targetX = whichNPC.x;
            fae.targetY = whichNPC.y;
            fae.currentState = "away";
            //whichNPC.movement[whichNPC.movementIndex] = "-";
            whichNPC.isMoving = false;
            whichNPC.movementIndex--;
            whichNPC.forceNewMovementCheck = false;
            whichNPC.hasCompletedEscortQuest = true;
            delete whichNPC.following;
        }
    
}






function closeQuest(whichNPC, whichQuestId) {
    //  if (giveQuestRewards(whichNPC, whichQuestId)) {
    giveQuestRewards(whichNPC, whichQuestId);
    if (questData[whichQuestId].isRepeatable > 0) {
        questData[whichQuestId].hasBeenCompleted = false;
        questData[whichQuestId].isUnderway = false;
    } else {
        questData[whichQuestId].hasBeenCompleted = true;
        // remove quest text now:
        whichNPC.speech.splice(whichNPC.speechIndex, 1);
        // knock this back one so to keep it in step with the removed item:
        whichNPC.speechIndex--;
    }
    checkForTitlesAwarded(whichQuestId);
    /* } else {
         // keep the NPC on the quest dialogue:
         whichNPC.speechIndex--;
     }
     */
    audio.playSound(soundEffects['questComplete'], 0);
    removeFromJournal(whichQuestId);

}


function giveQuestRewards(whichNPC, whichQuestId) {
    // give any reward to the player:
    if (questData[whichQuestId].itemsReceivedOnCompletion) {
        var questRewards = questData[whichQuestId].itemsReceivedOnCompletion;
     
        awardQuestRewards(whichNPC, questRewards, false);
    }
    /*else {
        return true;
    }
    */
}

function awardQuestRewards(whichNPC, questRewards, isACollectionQuest) {
    var allRewardItems = [];
    for (var i = 0; i < questRewards.length; i++) {
        var questRewardToUse = questRewards[i];
        var thisRewardObject = questRewardToUse;
        if (questRewardToUse.type != "follower") {
            thisRewardObject = prepareInventoryObject(questRewardToUse);
            var rewardTypePossibilities = questRewardToUse.type.toString().split("/");
            thisRewardObject.type = parseInt(getRandomElementFromArray(rewardTypePossibilities));
        }
        // check for variation:
        if (!(isNaN(thisRewardObject.type))) {
            // might need to show the name of the item in the speech:           
            thisSpeech = thisSpeech.replace(/##itemName##/i, currentActiveInventoryItems[parseInt(thisRewardObject.type)].shortname);
        }
        allRewardItems.push(thisRewardObject);
    }

    /*
    [{"type":"19/5","quantity":6},{"type":"follower"},{"type":"34","contains":5}]
    */
    //console.log(allRewardItems);

    inventoryCheck = canAddItemToInventory(allRewardItems);

    if (inventoryCheck[0]) {
        UI.showChangeInInventory(inventoryCheck[1]);
    } else {
        // send the item(s) by post:
        var questSpeech = whichNPC.speech[whichNPC.speechIndex][0].split("|");
        if (isACollectionQuest) {
            // use zone name (replace hyphens with spaces)
            var subjectLine = whichNPC.speech[whichNPC.speechIndex][2].replace(/-/g, " ") + " collection";
        } else {
            var whichQuest = whichNPC.speech[whichNPC.speechIndex][2];
            var subjectLine = questData[whichQuest].journalTitle;
        }
        var message = questSpeech[2];
        // add in the name of the item if required:
        message = message.replace(/##itemName##/i, currentActiveInventoryItems[parseInt(allRewardItems[0].type)].shortname);
        sendNPCPost('{"subject":"' + subjectLine + '","message":"' + message + '","senderID":"-1","recipientID":"' + characterId + '","fromName":"' + whichNPC.name + '"}', allRewardItems);
        UI.showNotification("<p>My reward will be sent in the post</p>");
    }
}
function getRetinueQuestTime(followerX, followerY, destinationX, destinationY, hasToReturnToBase) {
    var thisTimerText;
    var thisTimeRequired = getPythagorasDistance(followerX, followerY, destinationX, destinationY);
    if (hasToReturnToBase == 1) {
        // (true)
        thisTimeRequired += getPythagorasDistance(retinueBaseLocationX, retinueBaseLocationY, destinationX, destinationY);
    }




    var seconds = Math.floor((thisTimeRequired * 60) % 60);
    var minutes = Math.floor(thisTimeRequired % 60);
    var hours = Math.floor((thisTimeRequired / 60) % 24);
    var days = Math.floor(thisTimeRequired / (24 * 60));

    if (days > 1) {
        thisTimerText = days + " days";
    } else if (days == 1) {
        thisTimerText = "1 day";
    } else if (hours > 1) {
        thisTimerText = hours + " hours";
    } else if (hours == 1) {
        thisTimerText = "1 hour";
    } else if (minutes > 1) {
        thisTimerText = minutes + " minutes";
    } else if (minutes == 1) {
        thisTimerText = "1 minute";
    } else {
        thisTimerText = seconds + " seconds";
    }

    return ([thisTimeRequired, thisTimerText]);
}


function retinueMissionCompleted(questId, isExplorationQuest) {
    getJSON("/game-world/getRetinueRewards.php?id=" + questId + "&chr=" + characterId, function(data) {
        if (data.item != "null") {
            // try and add to inventory:
            inventoryCheck = canAddItemToInventory(data.item);
            if (inventoryCheck[0]) {
                UI.showChangeInInventory(inventoryCheck[1]);
            } else {
                // post it 
                var subjectLine = 'Reward for ' + document.getElementById('retinueComplete' + questId).getAttribute('data-questname');
                var message = "Your followers continue to make you proud...";
                var whichNPC = "Retinue co-ordinator";
                sendNPCPost('{"subject":"' + subjectLine + '","message":"' + message + '","senderID":"-1","recipientID":"' + characterId + '","fromName":"' + whichNPC + '"}', data.item);
                UI.showNotification("<p>My reward will be sent in the post</p>");
            }
        } else {
            // no reward
        }
        if (!isExplorationQuest) {
            hero.stats.retinueMissionsCompleted++;
        } else {
            hero.stats.retinueExplorationMissionsCompleted++;
            var thisHex = document.getElementById('undiscovered_' + data.explored);


            var thisHexCoords = data.explored.split("_");



            // save this hex as being explored:
            hero.retinueMapAreasRevealed.push(thisHexCoords[0] + "," + thisHexCoords[1]);

            // needs pushing to database:
            saveGame();

            // make neighbouring hexes explorable:
            var thisNeighbouringHex;
            for (var i = -1; i <= 1; i++) {
                for (var j = -1; j <= 1; j++) {
                    thisNeighbouringHex = document.getElementById('undiscovered_' + (parseInt(thisHexCoords[0]) + i) + "_" + (parseInt(thisHexCoords[1]) + j));
                    if (thisNeighbouringHex) {
                        thisNeighbouringHex.classList.add("explorable");
                    }
                }
            }

            // create quest in that hex and plot it:
            getJSON("/game-world/generateRetinueQuest.php?forceHex=" + thisHexCoords[0] + '_' + thisHexCoords[1] + "&isAjaxRequest=true", function(data) {
                retinueAvailableQuestMap.insertAdjacentHTML('beforeend', data.mapPin);
                retinueDetailWrapper.insertAdjacentHTML('beforeend', data.panelMarkup);
            }, function(status) {
                // error ###
            });

            thisHex.classList.remove('explorable');
            // fade hex out:
            thisHex.classList.add('explored');
        }

        // release followers from this quest:
        var allFollowersOnThisQuest = data.followerIds.split(",");
        var newLocationX = (data.endLocationX / 700) * 100;
        var newLocationY = (data.endLocationY / 450) * 100;
        var thisFollower;
        for (var i = 0; i < allFollowersOnThisQuest.length; i++) {
            // set follower to be available again:
            thisFollower = document.getElementById('retinueFollower' + allFollowersOnThisQuest[i]);
            thisFollower.classList.add("available");
            // move follower to completed location:
            document.getElementById('followerLocation' + allFollowersOnThisQuest[i]).style.cssText = "left: " + newLocationX + "%; top: " + newLocationY + "%;";
            document.getElementById('followerLocationTooltip' + allFollowersOnThisQuest[i]).style.cssText = "left: " + newLocationX + "%; top: " + newLocationY + "%;";
            thisFollower.setAttribute('data-locationx', data.endLocationX);
            thisFollower.setAttribute('data-locationy', data.endLocationY);
            thisFollower.removeAttribute('data-activeonquest');
            document.querySelector('#retinueFollower' + allFollowersOnThisQuest[i] + ' p').innerHTML = 'waiting for a quest';

            if (thisFollower.classList.contains('hired')) {
                // offer the option to rehire, or remove this follower:
                document.getElementById('retinueFollowerRehire' + allFollowersOnThisQuest[i]).classList.add('active');
            }
        }
        document.getElementById('retinueComplete' + questId).classList.remove('active');
        // update database that these followers are available and with the new location:
        sendDataWithoutNeedingAResponse("/game-world/gotRetinueRewards.php?id=" + questId + "&newLocationX=" + data.endLocationX + "&newLocationY=" + data.endLocationY);
    }, function(status) {
        // error - try again:
        retinueMissionCompleted(questId);
    });
}

function hireNewFollower() {
    if (hero.currency.money >= costToRehireFollower) {
        hero.currency.money -= costToRehireFollower;
        UI.updateCurrencies();
        audio.playSound(soundEffects['coins'], 0);
        var whichNPCIndex = hireRetinueFollowerPanel.getAttribute('data-NPC');
        // find the relevant NPC:
        var thisNPC;
        var thisFollowerNPC = null;
        for (var m = 0; m < visibleMaps.length; m++) {
            for (var i = 0; i < thisMapData[(visibleMaps[m])].npcs.length; i++) {
                thisNPC = thisMapData[(visibleMaps[m])].npcs[i];
                if (thisNPC.uniqueIndex == whichNPCIndex) {
                    thisFollowerNPC = thisNPC;
                }
            }
        }
        if (thisFollowerNPC !== null) {
            // remove the hiring speech:
            thisFollowerNPC.speech.splice(thisFollowerNPC.speechIndex, 1);
            // update database:
            sendDataWithoutNeedingAResponse("/game-world/activateRetinueFollower.php?followerID=" + thisFollowerNPC.followerId);
            // show in retinue panel:
            var followerMarkupToAdd = '<li id="retinueFollower' + thisFollowerNPC.followerId + '" class="available" data-locationx="200" data-locationy="350" data-activeonquest="-1"><div class="portrait"><img src="/images/retinue/' + thisFollowerNPC.followerId + '.png" alt=""></div><h3>' + thisFollowerNPC.name + '</h3><p>waiting for a quest</p></li>';
            retinueList.insertAdjacentHTML('beforeend', followerMarkupToAdd);
        }
    } else {
        UI.showNotification('<p>I haven\'t got enough money</p>');
    }
    UI.closeHireFollowerPanel();
}

function getLocalCoordinatesX(tileX) {
    // get local map coordinates from global coordinates:
    return tileX%worldMapTileLength;
}
function getLocalCoordinatesY(tileY) {
    return tileY%worldMapTileLength;
}

function findMapNumberFromGlobalCoordinates(tileX, tileY) {
return worldMap[Math.floor(tileY/worldMapTileLength)][Math.floor(tileX/worldMapTileLength)];
}

// https://mathiasbynens.be/notes/xhr-responsetype-json
var getJSON = function(url, successHandler, errorHandler) {
    var xhr = typeof XMLHttpRequest != 'undefined' ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
    xhr.open('get', url, true);
    xhr.onreadystatechange = function() {
        var status;
        var data;
        // https://xhr.spec.whatwg.org/#dom-xmlhttprequest-readystate
        if (xhr.readyState == 4) { // `DONE`
            status = xhr.status;
            var wasParsedOk = true;
            if (status == 200) {
                try {
                    data = JSON.parse(xhr.responseText);
                } catch (e) {
                    // JSON parse error:
                    wasParsedOk = false;
                    errorHandler && errorHandler(status);
                }
                if (wasParsedOk) {
                    successHandler && successHandler(data);
                }
            } else {
                errorHandler && errorHandler(status);
            }
        }
    };
    xhr.send();
};
// global vars:
const recipeSearch = document.getElementById('recipeSearch');
const clearRecipeSearch = document.getElementById('clearRecipeSearch');
const recipeFilter = document.getElementById('recipeFilter');
const splitStackInput = document.getElementById('splitStackInput');
const splitStackPanel = document.getElementById('splitStackPanel');
const shopSplitStackInput = document.getElementById('shopSplitStackInput');
const shopSplitStackPanel = document.getElementById('shopSplitStackPanel');
const craftingRecipeCreateButton = document.getElementById('craftingRecipeCreateButton');
const craftingPanel = document.getElementById('craftingPanel');
const craftingSelectComponentsPanel = document.getElementById('craftingSelectComponentsPanel');
const selectComponentsItemBeingCreated = document.getElementById('selectComponentsItemBeingCreated');
const componentsAvailableForThisRecipe = document.getElementById('componentsAvailableForThisRecipe');
const displayItemBeingCreated = document.getElementById('displayItemBeingCreated');
const booksAndParchments = document.getElementById('booksAndParchments');
const gameWrapper = document.getElementById('gameWrapper');
const inventoryPanels = document.getElementById('inventoryPanels');
const shopPanel = document.getElementById('shopPanel');
const inscriptionPanel = document.getElementById('inscriptionPanel');
const inscriptionTextArea = document.getElementById('inscriptionTextArea');
const sourceSelection = document.getElementById('sourceSelection');
const materialsSelection = document.getElementById('materialsSelection');
const inkSelection = document.getElementById('inkSelection');
const originalText = document.getElementById('originalText');
const scribeCopyText = document.getElementById('scribeCopyText');
const scribeOriginalText = document.getElementById('scribeOriginalText');
const scribeStartInscription = document.getElementById('scribeStartInscription');
const inscriptionTitle = document.getElementById('inscriptionTitle');
const soundVolume = document.getElementById('soundVolume');
const musicVolume = document.getElementById('musicVolume');
const gameSettingsPanel = document.getElementById('gameSettings');
const toggleActiveCards = document.getElementById('toggleActiveCards');
const cardAlbum = document.getElementById('cardAlbum');
const cardAlbumTabs = document.querySelectorAll('#cardAlbum .tabs');
const toggleFullscreenSwitch = document.getElementById('toggleFullScreen');
const collectionQuestPanels = document.getElementById('collectionQuestPanels');
const chestPanel = document.getElementById('chestPanel');
const chestTitle = document.getElementById('chestTitle');
const chestSlotContents = document.getElementById('chest');
const interfaceWrapper = document.getElementById('interface');
const actionBar = document.getElementById('actionBar');
const gatheringPanel = document.getElementById('gatheringPanel');
const gatheringBarQuality = document.querySelector('#gatheringQualityBar .progressBar');
const gatheringBarPurity = document.querySelector('#gatheringPurityBar .progressBar');
const gatheringBarQuantity = document.querySelector('#gatheringQuantityBar .progressBar');
const gatheringBarStability = document.querySelector('#gatheringBarStability .progressBar');
const surveyingTimeBar = document.getElementById('surveyingTimeBar');
const craftingTimeBarOuter = document.getElementById('craftingTimeBar');
const gatheringOutputSlot = document.getElementById('gatheringOutputSlot');
const surveyingPanel = document.getElementById('surveyingPanel');
const questJournalEntries = document.getElementById('questJournalEntries');
const questJournalRegionFilter = document.getElementById('questJournalRegionFilter');
const acceptQuestChoice = document.getElementById('acceptQuestChoice');
const questDecline = document.getElementById('questDecline');
const questAccept = document.getElementById('questAccept');
const postPanel = document.getElementById('postPanel');
const sendPostTab = document.getElementById('sendPostTab');
const sendPostPanel = document.getElementById('sendPostPanel');
const receivedPostTab = document.getElementById('receivedPostTab');
const receivedPostPanel = document.getElementById('receivedPostPanel');
const sendPostSubject = document.getElementById('sendPostSubject');
const sendPostMessage = document.getElementById('sendPostMessage');
const sendPostCharacter = document.getElementById('sendPostCharacter');
const newPost = document.getElementById('newPost');
const retinuePanel = document.getElementById('retinuePanel');
const retinueAvailableQuestMap = document.getElementById('retinueAvailableQuestMap');
const retinueDetailWrapper = document.getElementById('retinueDetailWrapper');
const draggableFollower = document.getElementById('draggableFollower');
const retinueQuestStart = document.getElementById('retinueQuestStart');
const retinueQuestTimeRequired = document.getElementById('retinueQuestTimeRequired');
const retinueList = document.getElementById('retinueList');
const retinueExplorePanel = document.getElementById('retinueExplorePanel');
const startCrafting = document.getElementById('startCrafting');
const horticulturePanel = document.getElementById('horticulturePanel');
const characterPanel = document.getElementById('characterPanel');
const holdingIcon = document.getElementById('holdingIcon');
const quickHold = document.getElementById('quickHold');
const holdingGauge = document.getElementById('holdingGauge');
const cardGameConcede = document.getElementById('cardGameConcede');
const hnefataflConcede = document.getElementById('hnefataflConcede');
const treasureMapPanels = document.getElementById('treasureMapPanels');
const hireRetinueFollowerPanel = document.getElementById('hireRetinueFollowerPanel');
const hireRetinueFollowerPanelContent = document.getElementById('hireRetinueFollowerPanelContent');
const catalogueQuestPanels = document.getElementById('catalogueQuestPanels');
const housingPanel = document.getElementById('housingPanel');
const housingConstructionPanel = document.getElementById('housingConstructionPanel');
const housingTileColour = document.getElementById('housingTileColour');
const housingTileSelectionListItems = document.querySelectorAll('#housingTileSelection ul:not(#housing-items) li');
const housingConstructionToolButtons = document.querySelectorAll('#housingConstructionTools li');
const housingRunningTotal = document.getElementById('housingRunningTotal');
const housingTileGroups = document.querySelectorAll('.housingTileGroup');


const yesNoDialoguePanel = document.getElementById('yesNoDialoguePanel');
const yesNoDialogueHeading = document.getElementById('yesNoDialogueHeading');
const yesNoDialogueButton1 = document.getElementById('yesNoDialogueButton1');
const yesNoDialogueButton2 = document.getElementById('yesNoDialogueButton2');

const housingToggleButtons = document.querySelectorAll("#housingGroupTabs button");

var notificationQueue = [];
var notificationIsShowing = false;

var retinueQuestTimers = [];


var UI = {
    init: function() {
        // cache all local references to UI elements:
        const displayZoneName = document.getElementById('displayZoneName');
        const activeCartographicMap = document.getElementById('activeCartographicMap');
        const cartographicTitle = document.getElementById('cartographicTitle');
        const dialogue = document.getElementById('dialogue');
        const notification = document.getElementById('notification');
        const cardGameWrapper = document.getElementById('cardGameWrapper');
        const cardAlbumList = document.getElementById('cardAlbumList');
        const boosterPack = document.getElementById('boosterPack');
        const createRecipeList = document.getElementById('createRecipeList');
        const recipeTitleBar = document.getElementById('recipeTitleBar');
        const currencies = document.getElementById('currencies');
    },


    showZoneName: function(zoneName) {
        displayZoneName.classList.remove("active");
        displayZoneName.textContent = zoneName;
        // https://css-tricks.com/restart-css-animation/
        // -> triggering reflow:
        void displayZoneName.offsetWidth;
        displayZoneName.classList.add("active");
    },

    buildInventoryInterface: function() {
        var characterNameAndTitle = hero.characterName;
        if (hero.activeTitle != 0) {
            characterNameAndTitle += " - " + possibleTitles[hero.activeTitle];
        }
        document.getElementById('characterName').innerHTML = characterNameAndTitle;
        characterPanel.classList.add('active');
        var inventoryMarkup = '';
        var thisAction, thisBagNumberOfSlots, thisSlotsID, thisPanelName, thisPet, activeClass;

        for (var i = 0; i < hero.bags.length; i++) {
            thisPanelName = currentActiveInventoryItems[hero.bags[i].type].shortname;
            thisBagNumberOfSlots = currentActiveInventoryItems[hero.bags[i].type].actionValue;
            inventoryMarkup += '<div class="inventoryBag active" id="inventoryBag' + i + '"><div class="draggableBar">' + thisPanelName + '</div><ol id="bag' + i + '">';
            // loop through slots for each bag:
            for (var j = 0; j < thisBagNumberOfSlots; j++) {
                thisSlotsID = i + '-' + j;
                inventoryMarkup += '<li id="slot' + thisSlotsID + '">';
                // check if that key exists in inventory:
                if (thisSlotsID in hero.inventory) {

                    inventoryMarkup += generateSlotMarkup(thisSlotsID);
                    thisAction = currentActiveInventoryItems[hero.inventory[thisSlotsID].type].action;
                    // check for cooldown attribute, and add a timer if so:
                    if (typeof hero.inventory[thisSlotsID].cooldown !== "undefined") {
                        hero.inventory[thisSlotsID].cooldownTimer = 0;
                    }
                    if (thisAction == "treasureMap") {
                        UI.createTreasureMap(hero.inventory[thisSlotsID].contains);
                    }

                } else {
                    inventoryMarkup += '';
                }
                // add item there
                inventoryMarkup += '</li>';

            }
            inventoryMarkup += '</ol></div></div>';
        }
        // add pet inventory panels:
        for (var i = 0; i < hero.allPets.length; i++) {
            thisPet = hero.allPets[i];
            if (thisPet.inventorySize > 0) {
                activeClass = '';
                if (hero.activePets.indexOf(i) != -1) {
                    activeClass = ' active';
                }
                inventoryMarkup += '<div class="inventoryBag' + activeClass + '" id="petInventoryBag' + i + '"><div class="draggableBar">' + thisPet.name + '</div><ol id="bag' + i + '">';
                // loop through slots for each bag:
                for (var j = 0; j < thisPet.inventorySize; j++) {
                    thisSlotsID = 'p' + i + '-' + j;
                    inventoryMarkup += '<li id="slot' + thisSlotsID + '">';
                    // check if that key exists in inventory:
                    if (thisSlotsID in hero.inventory) {
                        inventoryMarkup += generateSlotMarkup(thisSlotsID);
                        thisAction = currentActiveInventoryItems[hero.inventory[thisSlotsID].type].action;
                    } else {
                        inventoryMarkup += '';
                    }
                    // add item there
                    inventoryMarkup += '</li>';
                }
                inventoryMarkup += '</ol></div></div>';
            }
        }

        inventoryPanels.innerHTML = inventoryMarkup;
        gameWrapper.ondblclick = UI.doubleClick;
        gameWrapper.addEventListener("contextmenu", UI.handleRightClick, false);
        createRecipeList.onclick = UI.craftingPanelSingleClick;
        postPanel.onclick = UI.postPanelSingleClick;
        retinueAvailableQuestMap.onclick = UI.openRetinueDetailPanel;
        retinueQuestStart.onclick = UI.addFollowersToQuest;
        retinuePanel.onclick = UI.retinueSingleClick;
        document.getElementById('craftingRecipeCreateButton').onclick = UI.craftingRecipeCreate;
        splitStackPanel.onsubmit = inventorySplitStackSubmit;
        shopSplitStackPanel.onsubmit = UI.shopSplitStackSubmit;
        //  toggleActiveCards.onclick = UI.toggleCardsDisplayed;
        cardAlbum.onclick = UI.cardAlbumClick;
        startCrafting.onclick = startCraftingTimer;
        cardGameConcede.onclick = cardGamePlayer2Concedes;
        hnefataflConcede.onclick = hnefataflPlayer2Concedes;
        document.getElementById('showHousingFootprintCheckbox').onchange = housingNameSpace.toggleShowPlotFootprint;
        housingTileColour.onchange = housingNameSpace.housingTileColourChange;
        document.getElementById('splitStackCancel').onclick = inventorySplitStackCancel;
        document.getElementById('shopSplitStackCancel').onclick = UI.shopSplitStackCancel;
        document.getElementById('hireRetinueFollowerNo').onclick = UI.closeHireFollowerPanel;
        document.getElementById('hireRetinueFollowerYes').onclick = hireNewFollower;
        document.getElementById('touchTapAction').onclick = UI.touchTapAction;
        document.getElementById('openHousingConstructButton').onclick = UI.openHousingConstructionPanel;
        document.getElementById('housingTileSelection').onclick = housingNameSpace.selectNewTile;
        document.getElementById('housingConstructionSaveButton').onclick = housingNameSpace.commitDesign;
        document.getElementById('housingConstructionTools').onclick = housingNameSpace.changeActiveTool;
        //document.getElementById('hasEnoughConfirm').onclick = housingNameSpace.publishCommittedDesign;
        document.getElementById('housingConstructionCancelButton').onclick = housingNameSpace.checkAbandonDesign;
        document.querySelector('#housingConstructionPanel .closePanel').onclick = housingNameSpace.checkSaveDraftDesign;
  


for (i = 0; i < housingToggleButtons.length; i++) {
    housingToggleButtons[i].onclick = housingNameSpace.toggleTileGroup;
}


        toggleFullscreenSwitch.onchange = UI.toggleFullScreen;
        document.onfullscreenchange = UI.fullScreenChangeDetected;
        //        document.onmozfullscreenchange = UI.fullScreenChangeDetected;
        document.onwebkitfullscreenchange = UI.fullScreenChangeDetected;
        soundVolume.onchange = audio.adjustEffectsVolume;
        musicVolume.onchange = audio.adjustMusicVolume;
        UI.initInventoryDrag('.inventoryBag ol');
        document.getElementById('openSettings').onclick = UI.openSettings;
        actionBar.onclick = UI.actionBarClick;
        questDecline.onclick = declineQuest;
        questAccept.onclick = acceptQuest;
        UI.initShopDrag();
        UI.updateCardAlbum();
        UI.updateCurrencies();
        UI.buildRecipePanel();
        UI.updateInscriptionPanel();
        UI.getGameSettings();
        UI.buildCollectionPanel();
        UI.buildActionBar();
        UI.initRetinueTimers();
        UI.updateHeldItems();
        UI.updateQuickHold();
        /*
                if (hero.professionsKnown.length > 0) {
                    // load and cache the first profession's recipe assets:
                    UI.populateRecipeList(hero.professionsKnown[0],100);
                    // but hide the panel initially:
                    craftingPanel.classList.remove("active");
                }
        */
        gameWrapper.onmousedown = UI.globalMouseDown;
        gameWrapper.onclick = UI.globalClick;

        inventoryInterfaceIsBuilt = true;
    },

    toggleFullScreen: function() {
        if (toggleFullscreenSwitch.checked) {
            launchFullScreen(document.documentElement);
        } else {
            exitFullScreen();
        }
    },

    fullScreenChangeDetected: function() {
        // change the Settings toggle acordingly (in case the user used another means to come out of full screen mode):
        if (document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement) {
            toggleFullscreenSwitch.checked = true;
        } else {
            toggleFullscreenSwitch.checked = false;
        }
    },

    addNewBag: function(newBagObject) {
        // add to object:
        hero.bags.push(newBagObject);
        var thisSlotsID;
        i = hero.bags.length - 1;
        var inventoryMarkup = '<div class="inventoryBag active" id="inventoryBag' + i + '"><div class="draggableBar">' + currentActiveInventoryItems[hero.bags[i].type].shortname + '</div><ol class="active" id="bag' + i + '">';
        var thisBagNumberOfSlots = currentActiveInventoryItems[hero.bags[i].type].actionValue;
        for (var j = 0; j < thisBagNumberOfSlots; j++) {
            thisSlotsID = i + '-' + j;
            inventoryMarkup += '<li id="slot' + thisSlotsID + '"></li>';
        }
        inventoryMarkup += '</ol></div></div>';
        inventoryPanels.insertAdjacentHTML('beforeend', inventoryMarkup);
        UI.initInventoryDrag('#inventoryBag' + i + ' ol');


    },

    showChangeInInventory: function(whichSlotsToUpdate) {
        // check it wasn't a follower, money or profession added:
        if (whichSlotsToUpdate.length > 0) {
            var thisSlotsId, slotMarkup, thisSlotElem;
            // add a transition end detector to just the first element that will be changed:
            document.getElementById("slot" + whichSlotsToUpdate[0]).addEventListener(whichTransitionEvent, function removeSlotStatus(e) {
                var elementList = document.querySelectorAll('#inventoryPanels .changed');
                for (var i = 0; i < elementList.length; i++) {
                    elementList[i].classList.remove("changed");
                }
                // remove the event listener now:
                return e.currentTarget.removeEventListener(whichTransitionEvent, removeSlotStatus, false);
            }, false);
            // loop through the slots that have changed and update their markup:
            for (var j = 0; j < whichSlotsToUpdate.length; j++) {
                thisSlotsId = whichSlotsToUpdate[j];
                slotMarkup = generateSlotMarkup(thisSlotsId);
                thisSlotElem = document.getElementById("slot" + thisSlotsId);
                thisSlotElem.innerHTML = slotMarkup;
                thisSlotElem.classList.add("changed")
            }
        }
    },


    handleDrag: function(e) {
        // don't access the element multiple times - do it all in one go:
        UI.activeDragObject.style.cssText = "z-index:4;top: " + objInitTop + "px; left: " + objInitLeft + "px; transform: translate(" + (e.pageX - dragStartX) + "px, " + (e.pageY - dragStartY) + "px);";
    },

    endDrag: function(e) {
        // tidy up and remove event listeners:
        document.removeEventListener("mousemove", UI.handleDrag, false);
        document.removeEventListener("mouseup", UI.endDrag, false);
        UI.activeDragObject = '';
    },

    globalMouseDown: function(e) {
        // check for starting a drag:

        if (e.target.className == "draggableBar") {
            // make sure it's not a right click:
            if (e.button != 2) {
                UI.activeDragObject = e.target.parentElement;
                var pageScrollTopY = (window.pageYOffset || document.documentElement.scrollTop) - (document.documentElement.clientTop || 0);
                var clickedSlotRect = e.target.getBoundingClientRect();
                objInitLeft = clickedSlotRect.left;
                objInitTop = clickedSlotRect.top + pageScrollTopY;
                dragStartX = e.pageX;
                dragStartY = e.pageY;
                document.addEventListener("mousemove", UI.handleDrag, false);
                document.addEventListener("mouseup", UI.endDrag, false);
                // remove z-index of other draggable elements:
                var dragTargetsInner = document.querySelectorAll('.draggableBar');
                for (var j = 0; j < dragTargetsInner.length; j++) {
                    dragTargetsInner[j].parentElement.style.zIndex = 1;
                }
            }
        } else {
            var thisNode = getNearestParentId(e.target);
            if (thisNode.id.indexOf("retinueFollower") !== -1) {
                e.preventDefault();
                // make sure it's not a right click:
                if (e.button != 2) {
                    if (thisNode.classList.contains("available")) {
                        // can be dragged:
                        thisNode.classList.add("hasDragCopy");
                        // draggableFollower.innerHTML = thisNode.innerHTML;
                        var thisFollowersId = thisNode.id.substring(15);
                        retinueObject.draggedFollower = thisFollowersId;
                        draggableFollower.innerHTML = '<div class="portrait"><img src="/images/retinue/' + thisFollowersId + '.png" alt=""></div>';
                        UI.activeDragObject = draggableFollower;
                        UI.draggedOriginal = thisNode;
                        var pageScrollTopY = (window.pageYOffset || document.documentElement.scrollTop) - (document.documentElement.clientTop || 0);
                        var clickedFollowerRect = thisNode.getBoundingClientRect();
                        objInitLeft = clickedFollowerRect.left;
                        objInitTop = clickedFollowerRect.top + pageScrollTopY;
                        dragStartX = e.pageX;
                        dragStartY = e.pageY;
                        UI.activeDragObject.style.cssText = "z-index:4;top: " + objInitTop + "px; left: " + objInitLeft + "px; transform: translate(0px, 0px);";
                        document.addEventListener("mousemove", UI.handleDrag, false);
                        document.addEventListener("mouseup", UI.endFollowerDrag, false);
                        // remove z-index of other draggable elements:
                        var dragTargetsInner = document.querySelectorAll('.draggableBar');
                        for (var j = 0; j < dragTargetsInner.length; j++) {
                            dragTargetsInner[j].parentElement.style.zIndex = 1;
                        }
                    }
                }
            }
        }
    },

    doubleClick: function(e) {
        var thisItemsAction = e.target.getAttribute('data-action');
        //    if (thisItemsAction) {
        //        inventoryItemAction(e.target, thisItemsAction, e.target.getAttribute('data-action-value'));
        //    } else {

        var thisNode = getNearestParentId(e.target);

        if (thisNode.id.substring(0, 6) == "recipe") {
            recipeSelectComponents(thisNode.id);
        } else if (thisNode.id.substring(0, 4) == "shop") {
            UI.buyFromShopSlot(thisNode.id);
        } else if (thisNode.id.substring(0, 5) == "chest") {
            UI.addFromChest(thisNode.id);
        } else if (thisNode.id.substring(0, 9) == "gathering") {
            UI.addFromGathering();
        } else if (thisNode.id.substring(0, 11) == "postMessage") {
            UI.takePostAttachments(thisNode.id);
        } else if (thisNode.id.substring(0, 4) == "post") {
            UI.readPostMessage(thisNode.id);
        } else if (thisNode.id.substring(0, 8) == "fromSlot") {
            addCraftingComponents(thisNode.id, true);
        }


        if (thisItemsAction) {
            inventoryItemAction(e.target, thisItemsAction, e.target.getAttribute('data-action-value'));
        }

        //   }
    },

    showDialogue: function(thisObjectSpeaking, text) {
        UI.showUI();
        // check for random variation in text:
        var textToShow = getRandomElementFromArray(text.split("/"));
        if (activeObjectForDialogue != '') {
            dialogue.removeEventListener(whichTransitionEvent, UI.removeActiveDialogue, false);
        }
        /*
        if(typeof thisObjectSpeaking.name !== "undefined") {
            // add NPC's name:
textToShow = '<span>'+thisObjectSpeaking.name+'</span>'+textToShow;
        }
        */
        dialogue.innerHTML = textToShow;
        dialogue.classList.remove("slowerFade");
        dialogue.classList.add("active");
        activeObjectForDialogue = thisObjectSpeaking;
        UI.updateDialogue(activeObjectForDialogue);

    },

    updateDialogue: function(thisObjectSpeaking) {



        // maybe store these values if NPCs are never going to move while a speech balloon is attached to them? #####
        var thisX = findIsoCoordsX(thisObjectSpeaking.x, thisObjectSpeaking.y);
        var thisY = findIsoCoordsY(thisObjectSpeaking.x, thisObjectSpeaking.y);
        var thisTransform;
        // check if it's an NPC or not
        if (typeof thisObjectSpeaking.speech !== "undefined") {
            // -40 x so the balloon tip is at '0' x
            thisTransform = "translate(" + Math.floor(thisX - hero.isox + (canvasWidth / 2) - 40) + "px," + Math.floor(0 - (canvasHeight - (thisY - hero.isoy - thisObjectSpeaking.centreY + (canvasHeight / 2))) - thisObjectSpeaking.z) + "px)";
        } else {
            // the -20 and the -34 are arbitary numbers to get the position working better for the Notice item - will need adjusting to suit different notice graphics
            // (although, if the notice graphics themselves are invisible, and the poster is part of the terrain wall, then the centreX and centreY could be used to get this just right for each individual poster)
            // ###############
            thisTransform = "translate(" + Math.floor(thisX - hero.isox + (canvasWidth / 2) - 20) + "px," + Math.floor(0 - (canvasHeight - (thisY - hero.isoy - thisObjectSpeaking.centreY + (canvasHeight / 2))) - thisObjectSpeaking.z - 34) + "px)";
        }





        dialogue.style.transform = thisTransform;
    },

    removeActiveDialogue: function() {
        activeObjectForDialogue = '';
        dialogue.removeEventListener(whichTransitionEvent, UI.removeActiveDialogue, false);
        //thisObjectSpeaking = {};
    },

    showNotification: function(markup) {
        if (!notificationIsShowing) {
            // don't push it to the queue if it's already there:
            if (notificationQueue.indexOf(markup) === -1) {
                notificationQueue.push(markup);
            }
            notificationIsShowing = true;
            notification.classList.remove("active");
            notification.innerHTML = markup;
            // cause re-draw to reset the animation:
            notification.offsetHeight;
            notification.classList.add('active');
            notification.addEventListener(whichAnimationEvent, UI.notificationEnded, false);
        } else {
            if (notificationQueue.indexOf(markup) === -1) {
                notificationQueue.push(markup);
            }
        }
    },

    notificationEnded: function() {
        //  console.log(notificationQueue);
        // remove the one that's just been shown:
        notificationQueue.shift();
        notificationIsShowing = false;
        dialogue.removeEventListener(whichAnimationEvent, UI.notificationEnded, false);
        // see if any more need showing now:
        if (notificationQueue.length > 0) {
            UI.showNotification(notificationQueue[0]);
        }
    },

    cardAlbumClick: function(e) {
        var thisNode = getNearestParentId(e.target);
        if (thisNode.classList.contains('craftCard')) {
            // craft new card:
            // animation ############
            var cardType = thisNode.id.substring(8);
            // create card object:
            var craftedCardObject = {
                "type": 34,
                "contains": cardType
            }
            craftedCardObject = prepareInventoryObject(craftedCardObject);
            inventoryCheck = canAddItemToInventory([craftedCardObject]);
            if (inventoryCheck[0]) {
                hero.currency.cardDust -= cardGameNameSpace.allCardData[cardType][3];
                UI.updateCurrencies();
                UI.updateCardAlbum();
                UI.showChangeInInventory(inventoryCheck[1]);
                audio.playSound(soundEffects['cardCraft'], 0);
            } else {
                UI.showNotification("<p>I've don't have room in my bags for that</p>");
            }
        } else if (thisNode.classList.contains('cardBack')) {
            // set this back to be the active one:
            hero.activeCardBack = thisNode.id.substring(8);
            UI.changeActiveCardBack()
            UI.updateCardAlbum();
        } else if (thisNode.classList.contains('tabs')) {
            for (var i = 0; i < cardAlbumTabs.length; i++) {
                cardAlbumTabs[i].classList.remove('active');
            }
            thisNode.classList.add('active');
            switch (thisNode.id) {
                case 'tabShowAlbum':
                    cardAlbumList.className = 'showAlbum';
                    break;
                case 'tabShowBacks':
                    cardAlbumList.className = 'showBacks';
                    break;
                case 'tabShowCrafting':
                    cardAlbumList.className = 'showCrafting';
                    break;
            }
        }
    },

    updateCardAlbum: function() {
        var cardAlbumMarkup = '<ul>';
        var thisCardsClass, thisCardsQuantityOutput, foundThisType, parentClass, typesFound = 0;

        // count quantities for each card:
        // http://stackoverflow.com/questions/5667888/counting-the-occurrences-of-javascript-array-elements#answer-5668029
        var counts = {};
        for (var i = 0; i < hero.cards.length; i++) {
            var num = hero.cards[i];
            counts[num] = counts[num] ? counts[num] + 1 : 1;
        }

        // first element in allCardData is null
        for (var i = 1; i < cardGameNameSpace.allCardData.length; i++) {
            foundThisType = false;
            thisCardsClass = 'card players';
            thisCardsQuantityOutput = '';
            parentClass = '';
            if (!(counts[i])) {
                parentClass = 'inactive';
            } else {
                thisCardsQuantityOutput = '<span class="quantity">' + counts[i] + '</span>';
                foundThisType = true;
            }

            // check for rares - these are the negative of the standard card type:
            if ((counts[(0 - i)])) {
                foundThisType = true;
                cardAlbumMarkup += '<li class="rare card players"><div style="background-image:url(/images/card-game/cards/' + (0 - i) + '.png)"></div><span class="quantity">' + counts[(0 - i)] + '</span></li>';
                parentClass += ' hasRare';
            }

            cardAlbumMarkup += '<li class="' + parentClass + '"><img src="/images/card-game/cards/' + i + '.png" class="' + thisCardsClass + '" alt="' + cardGameNameSpace.allCardData[i][2] + ' card">' + thisCardsQuantityOutput;

            if (hero.currency.cardDust >= cardGameNameSpace.allCardData[i][3]) {
                cardAlbumMarkup += '<button class="craftCard" id="cardCard' + i + '">Craft ' + cardGameNameSpace.allCardData[i][2] + ' (' + cardGameNameSpace.allCardData[i][3] + ')</button>';
            } else {
                cardAlbumMarkup += '<span class="craftingCost">Needs ' + cardGameNameSpace.allCardData[i][3] + '</span>';
            }
            cardAlbumMarkup += '</li>';


            if (foundThisType) {
                typesFound++;
            }
        }
        for (var i = 0; i < hero.cardBacks.length; i++) {
            cardAlbumMarkup += '<li id="cardBack' + hero.cardBacks[i] + '" class="cardBack';
            if (hero.cardBacks[i] == hero.activeCardBack) {
                cardAlbumMarkup += ' active';
            }
            if (hero.cardBacks[i] < 0) {
                // player generated content back:
                cardAlbumMarkup += '"><img src="/images/user-generated/' + Math.abs(hero.cardBacks[i]) + '-world.jpg"></li>';
            } else {
                cardAlbumMarkup += '"><img src="/images/card-game/card-backs/' + hero.cardBacks[i] + '.jpg"></li>';
            }
        }
        cardAlbumMarkup += '</ul>';

        cardAlbumMarkup += '<p id="dustCurrency">' + hero.currency.cardDust + ' dust</p>';

        cardAlbumMarkup += '<p>' + typesFound + ' types out of ' + (cardGameNameSpace.allCardData.length - 1) + '. Total individual cards: ' + hero.cards.length + '. Total backs: ' + hero.cardBacks.length + '</p>';
        cardAlbumList.innerHTML = cardAlbumMarkup;
    },

    changeActiveCardBack: function() {
        // change the CSS:
        if (hero.activeCardBack < 0) {
            document.getElementById('playersCardBack').innerHTML = '.card.players {background-image: url(/images/user-generated/' + Math.abs(hero.activeCardBack) + '-world.jpg);}';
        } else {
            document.getElementById('playersCardBack').innerHTML = '.card.players {background-image: url(/images/card-game/card-backs/' + hero.activeCardBack + '.jpg);}';
        }
    },

    populateRecipeList: function(whichProfession, toolsQuality) {
        if (currentRecipePanelProfession != whichProfession) {
            // close the main crafting panel (in case it's open):
            releaseLockedSlots();
            craftingSelectComponentsPanel.classList.remove('active');
            // clear previous searches:
            recipeSearch.value = '';
            clearRecipeSearch.classList.remove("active");
            var recipeTiersPossibleForThisTool = findRecipeTierLevel(toolsQuality);
            var recipeMarkup = '<li id="noRecipesFound"><p>No recipes found.</p></li>';
            var thisRecipe;
            var filterMarkup = '';
            var thisFilter;

            for (var i = 0; i < hero.crafting[whichProfession].sortOrder.length; i++) {
                thisRecipe = hero.crafting[whichProfession].recipes[(hero.crafting[whichProfession].sortOrder[i])];

                // check this tool's quality is sufficent for this tier of recipe:
                if (recipeTiersPossibleForThisTool >= thisRecipe.tier) {
                    recipeMarkup += '<li class="active" id="recipe' + hero.crafting[whichProfession].sortOrder[i] + '"><img src="/images/game-world/inventory-items/' + thisRecipe.imageId + '.png" alt="' + thisRecipe.recipeName + '"><h3>' + thisRecipe.recipeName + '</h3><p>' + thisRecipe.recipeDescription + '</p></li>';
                }
            }

            createRecipeList.innerHTML = recipeMarkup;

            for (var i = 0; i < hero.crafting[whichProfession].filterOrder.length; i++) {
                thisFilter = hero.crafting[whichProfession].filters[(hero.crafting[whichProfession].filterOrder[i])];
                filterMarkup += '<option value="' + thisFilter + '"';
                if (i == 0) {
                    filterMarkup += ' selected="selected"';
                }
                filterMarkup += '>' + hero.crafting[whichProfession].filterOrder[i] + '</option>';
            }
            recipeFilter.innerHTML = filterMarkup;
            currentRecipePanelProfession = whichProfession;
            UI.highlightedRecipe = "";
            craftingRecipeCreateButton.disabled = true;
            recipeTitleBar.innerHTML = hero.crafting[whichProfession].name + ' Recipes';
            // resize the scroll bar (if it's used):
            if (thisDevicesScrollBarWidth > 0) {
                recipeCustomScrollBar.init();
            }
        }

        craftingPanel.classList.add("active");
    },

    buildRecipePanel: function() {
        recipeSearch.onkeyup = recipeSearchInput;
        recipeFilter.onchange = recipeSearchAndFilter;
        clearRecipeSearch.onclick = recipeSearchClear;
    },

    endInventoryDrag: function(e) {
        var isFromAShop = false;
        if (UI.sourceSlot.substring(0, 8) == "shopSlot") {
            isFromAShop = true;
            var thisSlotImageElement = document.getElementById(UI.sourceSlot).firstElementChild;
            var thisShopPanelElement = document.getElementById(UI.sourceSlot).parentNode.parentNode;
            var buyPriceForOne = thisSlotImageElement.getAttribute('data-price');
            var thisCurrency = thisShopPanelElement.getAttribute('data-currency');
            var thisBoughtObject = {
                "type": parseInt(thisSlotImageElement.getAttribute('data-type')),
                "quantity": 1,
                "quality": 100,
                "durability": 100,
                "currentWear": 0,
                "effectiveness": 100,
                "colour": parseInt(thisSlotImageElement.getAttribute('data-colour')),
                "enchanted": 0,
                "hallmark": 0,
                "inscription": ""
            }
            if (thisSlotImageElement.hasAttribute('data-inscription')) {
                thisBoughtObject.inscription = thisSlotImageElement.getAttribute('data-inscription');
            }
            // check for User Generated Content attributes and build the contains object from those if they exist:
            if (thisSlotImageElement.hasAttribute('data-ugcid')) {
                thisBoughtObject.contains = {};
                thisBoughtObject.contains['ugc-id'] = thisSlotImageElement.getAttribute('data-ugcid');
                if (thisSlotImageElement.hasAttribute('data-ugctitle')) {
                    thisBoughtObject.contains['ugc-title'] = thisSlotImageElement.getAttribute('data-ugctitle');
                }
            } else if (thisSlotImageElement.hasAttribute('data-contains')) {
                thisBoughtObject.contains = thisSlotImageElement.getAttribute('data-contains');
            }
        }
        var thisNode = getNearestParentId(e.target);
        var droppedSlot = thisNode.id;

        if (droppedSlot.substring(0, 4) == "slot") {
            // check it's empty:
            var droppedSlotId = droppedSlot.substring(4);
            if (hero.inventory[droppedSlotId] == undefined) {
                if (isSplitStackBeingDragged) {
                    // document.getElementById("slot" + UI.sourceSlot).innerHTML = '';
                    addToInventory(droppedSlotId, UI.draggedInventoryObject, true);
                    UI.droppedSuccessfully();
                } else {
                    if (isFromAShop) {
                        if (hero.currency[thisCurrency] >= buyPriceForOne) {
                            addToInventory(droppedSlotId, thisBoughtObject);
                            hero.currency[thisCurrency] -= buyPriceForOne;
                            UI.updateCurrencies();
                            audio.playSound(soundEffects['coins'], 0);
                            UI.droppedSuccessfully();
                        } else {
                            UI.showNotification("<p>I don't have have enough money</p>");
                            UI.slideDraggedSlotBack();
                        }
                    } else {
                        if (UI.sourceSlot != droppedSlotId) {
                            document.getElementById("slot" + UI.sourceSlot).innerHTML = '';
                            addToInventory(droppedSlotId, UI.draggedInventoryObject);
                        } else {
                            hero.inventory[droppedSlotId] = JSON.parse(JSON.stringify(UI.draggedInventoryObject));
                        }
                        document.getElementById("slot" + UI.sourceSlot).classList.remove("hidden");
                        UI.droppedSuccessfully();
                    }
                }
            } else {
                if (isFromAShop) {
                    if (itemAttributesMatch(thisBoughtObject, hero.inventory[droppedSlotId])) {
                        if (parseInt(hero.inventory[droppedSlotId].quantity) < maxNumberOfItemsPerSlot) {
                            // (is room for 1 more)
                            if (hero.currency[thisCurrency] >= buyPriceForOne) {
                                hero.inventory[droppedSlotId].quantity++;
                                updateQuantity(droppedSlotId);
                                hero.currency[thisCurrency] -= buyPriceForOne;
                                UI.updateCurrencies();
                                audio.playSound(soundEffects['coins'], 0);
                                UI.droppedSuccessfully();
                            } else {
                                UI.showNotification("<p>I don't have have enough money</p>");
                                UI.slideDraggedSlotBack();
                            }
                        } else {
                            UI.slideDraggedSlotBack();
                        }
                    } else {
                        // otherwise slide it back
                        UI.slideDraggedSlotBack();
                    }
                } else {
                    if (itemAttributesMatch(UI.draggedInventoryObject, hero.inventory[droppedSlotId])) {
                        if (parseInt(UI.draggedInventoryObject.quantity) + parseInt(hero.inventory[droppedSlotId].quantity) <= maxNumberOfItemsPerSlot) {
                            hero.inventory[droppedSlotId].quantity += parseInt(UI.draggedInventoryObject.quantity);
                            updateQuantity(droppedSlotId);
                            if (!isSplitStackBeingDragged) {
                                document.getElementById("slot" + UI.sourceSlot).innerHTML = '';
                                document.getElementById("slot" + UI.sourceSlot).classList.remove("hidden");
                            }
                            UI.droppedSuccessfully();
                        } else {
                            // add in the max, and slide the remainder back:
                            var amountAddedToThisSlot = maxNumberOfItemsPerSlot - parseInt(hero.inventory[droppedSlotId].quantity);
                            hero.inventory[droppedSlotId].quantity = maxNumberOfItemsPerSlot;
                            updateQuantity(droppedSlotId);
                            // update dragged item quantity and then slide back:
                            UI.draggedInventoryObject.quantity -= amountAddedToThisSlot;
                            // update visually to drop slot:
                            var thisSlotElem = document.getElementById("slot" + UI.sourceSlot);
                            for (var i = 0; i < thisSlotElem.childNodes.length; i++) {
                                if (thisSlotElem.childNodes[i].className == "qty") {
                                    thisSlotElem.childNodes[i].innerHTML = UI.draggedInventoryObject.quantity;
                                    break;
                                }
                            }
                            // update visually to dragged clone:
                            var thisSlotElem = document.getElementById('draggableInventorySlot');
                            for (var i = 0; i < thisSlotElem.childNodes.length; i++) {
                                if (thisSlotElem.childNodes[i].className == "qty") {
                                    thisSlotElem.childNodes[i].innerHTML = UI.draggedInventoryObject.quantity;
                                    break;
                                }
                            }
                            inventorySplitStackCancel();
                            UI.slideDraggedSlotBack();
                        }
                    } else {
                        // otherwise slide it back
                        UI.slideDraggedSlotBack();
                    }
                }
            }
        } else if (droppedSlot.substring(0, 12) == "inventoryBag") {
            var thisInventoryPanelId = droppedSlot.substring(12);
            var sourceSlotHyphenPos = UI.sourceSlot.indexOf("-");
            var thisSourceInventoryPanelId = UI.sourceSlot.substring(0, sourceSlotHyphenPos);
            var thisBagNumberOfSlots = currentActiveInventoryItems[hero.bags[thisInventoryPanelId].type].actionValue;
            var emptySlotFound = -1;
            if (isFromAShop) {
                if (hero.currency[thisCurrency] >= buyPriceForOne) {
                    // find an empty slot and drop it in:
                    for (var j = 0; j < thisBagNumberOfSlots; j++) {
                        var thisSlotsID = thisInventoryPanelId + '-' + j;
                        if (!(thisSlotsID in hero.inventory)) {
                            emptySlotFound = j;
                            break;
                        }
                    }
                    if (emptySlotFound != -1) {
                        hero.currency[thisCurrency] -= buyPriceForOne;
                        UI.updateCurrencies();
                        audio.playSound(soundEffects['coins'], 0);
                        UI.droppedSuccessfully();
                        addToInventory(thisInventoryPanelId + "-" + emptySlotFound, thisBoughtObject);
                        UI.droppedSuccessfully();
                    } else {
                        UI.slideDraggedSlotBack();
                    }
                    UI.droppedSuccessfully();
                } else {
                    UI.showNotification("<p>I don't have have enough money</p>");
                    UI.slideDraggedSlotBack();
                }
            } else {
                // if it's the same panel is the slot came from, just slide back:
                if (thisInventoryPanelId == thisSourceInventoryPanelId) {
                    UI.slideDraggedSlotBack();
                } else {
                    // otherwise find an empty slot and drop it in:
                    for (var j = 0; j < thisBagNumberOfSlots; j++) {
                        var thisSlotsID = thisInventoryPanelId + '-' + j;
                        if (!(thisSlotsID in hero.inventory)) {
                            emptySlotFound = j;
                            break;
                        }
                    }
                    if (emptySlotFound != -1) {
                        if (!isSplitStackBeingDragged) {
                            document.getElementById("slot" + UI.sourceSlot).innerHTML = '';
                        }
                        addToInventory(thisInventoryPanelId + "-" + emptySlotFound, UI.draggedInventoryObject);
                        document.getElementById("slot" + UI.sourceSlot).classList.remove("hidden");
                        UI.droppedSuccessfully();
                    } else {
                        UI.slideDraggedSlotBack();
                    }
                }
            }
        } else if (droppedSlot.substring(0, 8) == "shopSlot") {
            // shop slot:
            if (isFromAShop) {

                UI.slideDraggedSlotBack();
            } else {

                UI.sellToShop(thisNode.parentNode.parentNode);
            }

        } else if (thisNode.classList.contains('shop')) {
            // shop panel:
            if (isFromAShop) {
                UI.slideDraggedSlotBack();
            } else {
                UI.sellToShop(thisNode);
            }
        } else {
            UI.slideDraggedSlotBack();
        }

        // tidy up and remove event listeners:
        document.removeEventListener("mousemove", UI.handleDrag, false);
        document.removeEventListener("mouseup", UI.endInventoryDrag, false);
    },


    sellToShop: function(thisShopPanelElement) {
        // check to see if it's being sold to a relevant specialist shop:
        var thisItemsCategories = currentActiveInventoryItems[UI.draggedInventoryObject.type].category;
        var thisShopsSpecialism = thisShopPanelElement.getAttribute('data-specialism');
        var sellPrice;
        var thisCurrency = thisShopPanelElement.getAttribute('data-currency');
        if (thisItemsCategories.indexOf(thisShopsSpecialism) != -1) {
            sellPrice = Math.ceil(UI.draggedInventoryObject.quantity * sellPriceSpecialismModifier * inflationModifier * currentActiveInventoryItems[UI.draggedInventoryObject.type].priceCode, 0);
        } else {
            sellPrice = Math.ceil(UI.draggedInventoryObject.quantity * sellPriceModifier * inflationModifier * currentActiveInventoryItems[UI.draggedInventoryObject.type].priceCode, 0);
        }
        hero.currency[thisCurrency] += sellPrice;
        UI.updateCurrencies();
        audio.playSound(soundEffects['coins'], 0);
        document.getElementById("slot" + UI.sourceSlot).classList.remove("hidden");
        document.getElementById("slot" + UI.sourceSlot).innerHTML = '';
        UI.droppedSuccessfully();
    },

    droppedSuccessfully: function() {
        // this can get fired twice for double click, so just make sure it needs tidying up:
        if (UI.activeDragObject != "") {
            // hide the clone:
            UI.activeDragObject.style.cssText = "z-index:2;";
            UI.activeDragObject = '';
            if (isSplitStackBeingDragged) {
                isSplitStackBeingDragged = false;
            }
            inventorySplitStackCancel();
            UI.updatePanelsAfterInventoryChange();
        }
    },

    initInventoryDrag: function(whichElements) {
        var dragTargets = document.querySelectorAll(whichElements);
        for (var i = 0; i < dragTargets.length; i++) {
            dragTargets[i].addEventListener("mousedown", function(e) {
                e.preventDefault();
                // make sure it's not a right click:
                if (e.button != 2) {
                    var thisNode = getNearestParentId(e.target);
                    // check if the shift key is pressed as well:
                    if (key[5]) {
                        UI.sourceSlot = thisNode.id.substring(4);
                        // make a copy of the object, not a reference:
                        UI.draggedInventoryObject = JSON.parse(JSON.stringify(hero.inventory[UI.sourceSlot]));
                        splitStackInput.setAttribute("max", hero.inventory[UI.sourceSlot].quantity);
                        // set default value to half the current slot:
                        var defaultSplitValue = Math.floor(hero.inventory[UI.sourceSlot].quantity / 2);
                        splitStackInput.value = defaultSplitValue;
                        splitStackInput.focus();


                        // can't set selection for number type input:
                        // http://stackoverflow.com/questions/21177489/selectionstart-selectionend-on-input-type-number-no-longer-allowed-in-chrome
                        //   splitStackInput.setSelectionRange(0, defaultSplitValue.toString().length);
                        var clickedSlotRect = thisNode.getBoundingClientRect();
                        var pageScrollTopY = (window.pageYOffset || document.documentElement.scrollTop) - (document.documentElement.clientTop || 0);
                        // 3px padding on the slots:
                        // -44 for the slot height:
                        objInitLeft = clickedSlotRect.left + 3;
                        objInitTop = clickedSlotRect.top + 3 + pageScrollTopY - 44;
                        splitStackPanel.style.cssText = "z-index:4;top: " + objInitTop + "px; left: " + objInitLeft + "px;";
                        splitStackPanel.classList.add("active");
                        key[5] = 0;
                    } else {
                        if (!isSplitStackBeingDragged) {
                            UI.sourceSlot = thisNode.id.substring(4);
                            UI.draggedInventoryObject = hero.inventory[UI.sourceSlot];

                            // clone this slot to draggableInventorySlot:
                            UI.activeDragObject = document.getElementById('draggableInventorySlot');
                            UI.activeDragObject.innerHTML = thisNode.innerHTML;
                            // remove from inventory data:
                            delete hero.inventory[UI.sourceSlot];
                            thisNode.classList.add("hidden");

                            var clickedSlotRect = thisNode.getBoundingClientRect();
                            var pageScrollTopY = (window.pageYOffset || document.documentElement.scrollTop) - (document.documentElement.clientTop || 0);
                            // 3px padding on the slots:
                            objInitLeft = clickedSlotRect.left + 3;
                            objInitTop = clickedSlotRect.top + 3 + pageScrollTopY;
                            dragStartX = e.pageX;
                            dragStartY = e.pageY;
                            UI.activeDragObject.style.cssText = "z-index:4;top: " + objInitTop + "px; left: " + objInitLeft + "px; transform: translate(0px, 0px);";
                            document.addEventListener("mousemove", UI.handleDrag, false);
                            document.addEventListener("mouseup", UI.endInventoryDrag, false);
                        }
                    }
                }
            }, false);
        }
    },

    slideDraggedSlotBack: function() {
        // slide it back visually - add a transition:
        UI.activeDragObject.style.cssText = "z-index:4;left: " + (objInitLeft) + "px; top: " + (objInitTop) + "px;transition: transform 0.4s ease;";
        UI.activeDragObject.addEventListener(whichTransitionEvent, function snapDraggedSlotBack(e) {
            // it's now back, so restore to the inventory:
            if (UI.sourceSlot.substring(0, 8) != 'shopSlot') {
                // not dragged from a shop
                if (!isSplitStackBeingDragged) {
                    hero.inventory[UI.sourceSlot] = JSON.parse(JSON.stringify(UI.draggedInventoryObject));
                    document.getElementById("slot" + UI.sourceSlot).classList.remove("hidden");
                } else {
                    // update quantity on the original slot
                    hero.inventory[UI.sourceSlot].quantity += UI.draggedInventoryObject.quantity;
                    var thisSlotElem = document.getElementById("slot" + UI.sourceSlot);
                    if (thisSlotElem) {
                        for (var i = 0; i < thisSlotElem.childNodes.length; i++) {
                            if (thisSlotElem.childNodes[i].className == "qty") {
                                thisSlotElem.childNodes[i].innerHTML = hero.inventory[UI.sourceSlot].quantity;
                                break;
                            }
                        }
                    }
                }
            }
            // hide the clone:
            UI.droppedSuccessfully();
            // remove this event listener now:
            return e.currentTarget.removeEventListener(whichTransitionEvent, snapDraggedSlotBack, false);
        }, false);
    },

    craftingPanelSingleClick: function(e) {
        var thisNode = getNearestParentId(e.target);
        if (thisNode.id.substring(0, 6) == "recipe") {
            if (UI.highlightedRecipe != "") {
                document.getElementById(UI.highlightedRecipe).classList.remove('highlighted');
            }
            UI.highlightedRecipe = thisNode.id;
            document.getElementById(UI.highlightedRecipe).classList.add('highlighted');
            craftingRecipeCreateButton.disabled = false;
        }
    },

    craftingRecipeCreate: function() {
        if (UI.highlightedRecipe != "") {
            recipeSelectComponents(UI.highlightedRecipe);
        }
    },

    buildBook: function(whichBookObject, thisBooksHash) {
        var markupToAdd = '';
        // var parsedDoc, numberOfPages;


        var thisBooksContent = whichBookObject.inscription.content;

        // check if the book already has been created:
        if (!document.getElementById('book' + thisBooksHash)) {
            markupToAdd += '<div class="book inkColour' + whichBookObject.colour + '" id="book' + thisBooksHash + '">';
            markupToAdd += '<div class="draggableBar">&quot;' + whichBookObject.inscription.title + '&quot;</div>';
            markupToAdd += '<button class="closePanel">close</button>';
            /*
                        // determine the number of pages (identified by the <section> elements):
                        parsedDoc = new DOMParser().parseFromString(whichBookObject.inscription.content, "text/html");
                        numberOfPages = parsedDoc.getElementsByTagName("SECTION").length;
                        if(numberOfPages>1) {

                        } else {
                             markupToAdd += whichBookObject.inscription.content;
                        }
                       */
            markupToAdd += whichBookObject.inscription.content;
            markupToAdd += '</div>';
            booksAndParchments.innerHTML += markupToAdd;
            // UI.initDrag('book' + thisBooksHash + ' .draggableBar');
        }
    },

    globalClick: function(e) {
        if (e.target.className) {
            if (e.target.className == "closePanel") {
                e.target.parentNode.classList.remove("active");
                // check if it's a shop panel:
                if (e.target.parentNode.classList.contains("shop")) {
                    shopCurrentlyOpen = -1;
                    inventoryPanels.removeAttribute('class');
                    // close shop dialogue as well:
                    if (activeObjectForDialogue != '') {
                        //  dialogue.classList.add("slowerFade");
                        dialogue.classList.remove("active");
                        activeObjectForDialogue.speechIndex = 0;
                        UI.removeActiveDialogue();

                    }

                } else {
                    switch (e.target.parentNode.id) {
                        case 'gatheringPanel':
                            if (activeAction == "gather") {
                                gatheringStopped();
                            }
                            break;
                        case 'surveyingPanel':
                            if (activeAction == "survey") {
                                surveyingStopped();
                            }
                            break;
                        case 'inscriptionPanel':
                            UI.resetInscriptionPanel();
                            break;
                        case 'chestPanel':
                            UI.closeChest();
                            break;
                        case 'postPanel':
                            UI.closePost();
                            break;
                        case 'retinuePanel':
                            UI.closeRetinuePanel();
                            break;
                        case 'craftingSelectComponentsPanel':
                            releaseLockedSlots();
                            break;
                    }
                }
            }
        }
        var thisNode = getNearestParentId(e.target);
        if (thisNode.id.substring(0, 6) == "scribe") {
            UI.processInscriptionClick(thisNode);
        }
    },


    updateCurrencies: function() {
        currencies.innerHTML = '<p>' + parseMoney(hero.currency.money) + '</p><p>' + hero.currency.cardDust + '<span class="card"><span></p><p>' + hero.currency.keys.length + '<span class="keys"><span></p>';

    },

    buildShop: function(markup) {
        //   shopPanel.innerHTML = markup;
        shopPanel.insertAdjacentHTML('beforeend', markup);
    },

    openedShopSuccessfully: function(shopHash) {
        if (document.getElementById("shop" + shopHash)) {
            UI.showUI();
            shopCurrentlyOpen = shopHash;
            document.getElementById("shop" + shopHash).classList.add("active");
            inventoryPanels.classList.add("shopSpecialism" + document.getElementById("shop" + shopHash).getAttribute('data-specialism'));
            return true;
        } else {
            return false;
        }
    },

    closeShop: function() {
        document.getElementById("shop" + shopCurrentlyOpen).classList.remove("active");
        shopCurrentlyOpen = -1;
        inventoryPanels.removeAttribute('class');

    },

    shopSplitStackCancel: function() {
        shopSplitStackPanel.classList.remove("active");
        document.activeElement.blur();
    },

    buyFromShopSlot: function(slotId) {
        var thisSlotElement = document.getElementById(slotId);
        var thisSlotImageElement = thisSlotElement.firstElementChild;
        var thisShopPanelElement = thisSlotElement.parentNode.parentNode;
        var buyPriceForOne = thisSlotImageElement.getAttribute('data-price');
        var thisCurrency = thisShopPanelElement.getAttribute('data-currency');
        if (hero.currency[thisCurrency] >= buyPriceForOne) {
            var thisBoughtObject = {
                "type": parseInt(thisSlotImageElement.getAttribute('data-type')),
                "quantity": 1,
                "quality": 100,
                "durability": 100,
                "currentWear": 0,
                "effectiveness": 100,
                "colour": parseInt(thisSlotImageElement.getAttribute('data-colour')),
                "enchanted": 0,
                "hallmark": 0,
                "inscription": ""
            }
            if (thisSlotImageElement.hasAttribute('data-inscription')) {
                thisBoughtObject.inscription = thisSlotImageElement.getAttribute('data-inscription');
            }

            // check for User Generated Content attributes and build the contains object from those if they exist:
            if (thisSlotImageElement.hasAttribute('data-ugcid')) {
                thisBoughtObject.contains = {};
                thisBoughtObject.contains['ugc-id'] = thisSlotImageElement.getAttribute('data-ugcid');
                if (thisSlotImageElement.hasAttribute('data-ugctitle')) {
                    thisBoughtObject.contains['ugc-title'] = thisSlotImageElement.getAttribute('data-ugctitle');
                }
            } else if (thisSlotImageElement.hasAttribute('data-contains')) {
                console.log("has Contains", thisSlotImageElement.getAttribute('data-contains'));
                thisBoughtObject.contains = thisSlotImageElement.getAttribute('data-contains');
            }
            // console.log(thisSlotImageElement.hasAttribute('data-contains'));
            // console.log(thisSlotImageElement);
            inventoryCheck = canAddItemToInventory([thisBoughtObject]);
            // console.log(thisBoughtObject);
            if (inventoryCheck[0]) {
                hero.currency[thisCurrency] -= buyPriceForOne;
                UI.updateCurrencies();
                audio.playSound(soundEffects['coins'], 0);
                UI.showChangeInInventory(inventoryCheck[1]);
            } else {
                UI.showNotification("<p>I don't have room in my bags for that</p>");
            }
        } else {
            UI.showNotification("<p>Oops - sorry, not enough money</p>");
        }
        // remove the drag slot that was created by the single click:
        UI.activeDragObject.innerHTML = '';
    },

    initShopDrag: function() {

        document.getElementById("shopPanel").addEventListener("mousedown", function(e) {
            if (!isSplitStackBeingDragged) {
                var thisNode = getNearestParentId(e.target);
                // check it's a slot and not the close or draggable bar:
                if (thisNode.id.substring(0, 8) == "shopSlot") {
                    e.preventDefault();
                    // make sure it's not a right click:
                    if (e.button != 2) {
                        UI.sourceSlot = thisNode;
                        // check if the shift key is pressed as well:
                        if (key[5]) {

                            var thisSlotImageElement = thisNode.firstElementChild;
                            var thisShopPanelElement = thisNode.parentNode.parentNode;
                            var buyPriceForOne = thisSlotImageElement.getAttribute('data-price');
                            var thisCurrency = thisShopPanelElement.getAttribute('data-currency');

                            // work out the max they can buy with the relevant currency:
                            var maxThatCanBeBought = Math.floor(hero.currency[thisCurrency] / buyPriceForOne);

                            if (maxThatCanBeBought > maxNumberOfItemsPerSlot) {
                                maxThatCanBeBought = maxNumberOfItemsPerSlot;
                            }
                            shopSplitStackInput.setAttribute("max", maxThatCanBeBought);
                            shopSplitStackInput.value = 1;
                            shopSplitStackInput.focus();
                            // can't set selection for number type input:
                            // http://stackoverflow.com/questions/21177489/selectionstart-selectionend-on-input-type-number-no-longer-allowed-in-chrome
                            //   splitStackInput.setSelectionRange(0, defaultSplitValue.toString().length);
                            var clickedSlotRect = thisNode.getBoundingClientRect();
                            var pageScrollTopY = (window.pageYOffset || document.documentElement.scrollTop) - (document.documentElement.clientTop || 0);
                            // 3px padding on the slots:
                            // -44 for the slot height:
                            objInitLeft = clickedSlotRect.left + 3;
                            objInitTop = clickedSlotRect.top + 3 + pageScrollTopY - 44;
                            shopSplitStackPanel.style.cssText = "z-index:4;top: " + objInitTop + "px; left: " + objInitLeft + "px;";
                            shopSplitStackPanel.classList.add("active");
                            key[5] = 0;
                        } else {
                            // this will fire for double click as well


                            UI.sourceSlot = thisNode.id;
                            UI.draggedInventoryObject = {
                                "type": parseInt(thisNode.getAttribute('data-type')),
                                "quantity": 1,
                                "quality": 100,
                                "durability": 100,
                                "currentWear": 0,
                                "effectiveness": 100,
                                "colour": parseInt(thisNode.getAttribute('data-colour')),
                                "enchanted": 0,
                                "hallmark": 0,
                                "inscription": ""
                            }
                            if (thisNode.hasAttribute('data-inscription')) {
                                UI.draggedInventoryObject.inscription = thisNode.getAttribute('data-inscription');
                            }
                            if (thisNode.hasAttribute('data-contains')) {
                                UI.draggedInventoryObject.contains = thisNode.getAttribute('data-contains');
                            }




                            // clone this slot to draggableInventorySlot:
                            UI.activeDragObject = document.getElementById('draggableShopSlot');
                            UI.activeDragObject.innerHTML = thisNode.innerHTML;


                            var clickedSlotRect = thisNode.getBoundingClientRect();
                            var pageScrollTopY = (window.pageYOffset || document.documentElement.scrollTop) - (document.documentElement.clientTop || 0);
                            // 3px padding on the slots:
                            objInitLeft = clickedSlotRect.left + 3;
                            objInitTop = clickedSlotRect.top + 3 + pageScrollTopY;
                            dragStartX = e.pageX;
                            dragStartY = e.pageY;
                            UI.activeDragObject.style.cssText = "z-index:4;top: " + objInitTop + "px; left: " + objInitLeft + "px; transform: translate(0px, 0px);";
                            document.addEventListener("mousemove", UI.handleDrag, false);
                            document.addEventListener("mouseup", UI.endInventoryDrag, false);

                        }
                    }
                }
            }
        }, false);
    },


    shopSplitStackSubmit: function(e) {
        if (e) {
            e.preventDefault();
        }
        var enteredValue = shopSplitStackInput.value;
        var isValid = true;
        enteredValue = parseInt(enteredValue);
        if (enteredValue < 1) {
            isValid = false;
        }
        if (!(Number.isInteger(enteredValue))) {
            isValid = false;
        }
        if (enteredValue > shopSplitStackInput.getAttribute("max")) {
            // this will check if they can afford it as well as not being over a single slot maximum:
            isValid = false;
        }
        if (isValid) {
            var thisSlotImageElement = UI.sourceSlot.firstElementChild;
            var thisShopPanelElement = UI.sourceSlot.parentNode.parentNode;
            var buyPriceForOne = thisSlotImageElement.getAttribute('data-price');
            var thisCurrency = thisShopPanelElement.getAttribute('data-currency');
            var thisBoughtObject = {
                "type": parseInt(thisSlotImageElement.getAttribute('data-type')),
                "quantity": enteredValue,
                "quality": 100,
                "durability": 100,
                "currentWear": 0,
                "effectiveness": 100,
                "colour": parseInt(thisSlotImageElement.getAttribute('data-colour')),
                "enchanted": 0,
                "hallmark": 0,
                "inscription": ""
            }
            if (thisSlotImageElement.hasAttribute('data-inscription')) {
                thisBoughtObject.inscription = thisSlotImageElement.getAttribute('data-inscription');
            }
            if (thisSlotImageElement.hasAttribute('data-contains')) {
                thisBoughtObject.contains = thisSlotImageElement.getAttribute('data-contains');
            }
            inventoryCheck = canAddItemToInventory([thisBoughtObject]);
            if (inventoryCheck[0]) {
                hero.currency[thisCurrency] -= (enteredValue * buyPriceForOne);
                UI.updateCurrencies();
                audio.playSound(soundEffects['coins'], 0);
                UI.showChangeInInventory(inventoryCheck[1]);
            } else {
                UI.showNotification("<p>I don't have room in my bags for that</p>");
            }
        }
        shopSplitStackPanel.classList.remove("active");
        document.activeElement.blur();
    },


    openInscriptionPanel: function() {
        audio.playSound(soundEffects['bookOpen'], 0);
        // clear previous content:
        inscriptionTextArea.innerHTML = '';
        inscriptionPanel.classList.add("active");
    },

    resetInscriptionPanel: function() {
        // remove all highlighted elements
        var itemList = document.querySelectorAll('#inscriptionPanel li'),
            i;
        // hide all:
        for (i = 0; i < itemList.length; ++i) {
            itemList[i].classList.remove('selected');
        }

    },

    updateInscriptionPanel: function() {
        var allInksMarkup = '<h3>Inks available:</h3><ol>';
        var allSourceMarkup = '<h3>Documents available:</h3><ol>';
        var allMaterialsMarkup = '<h3>Materials available:</h3><ol>';
        var thisFileColourSuffix, thisColourName, theColourPrefix;
        for (var i in hero.inventory) {
            if (hero.inventory[i].type == 40) {
                thisFileColourSuffix = '';
                theColourPrefix = "";
                thisColourName = getColourName(hero.inventory[i].colour, hero.inventory[i].type);
                if (thisColourName != "") {
                    theColourPrefix = thisColourName + " ";
                    thisFileColourSuffix = "-" + thisColourName.toLowerCase();
                }
                allInksMarkup += '<li class="scribeInk" id="scribeInkFromSlot' + i + '"><img src="/images/game-world/inventory-items/40' + thisFileColourSuffix + '.png" alt="' + theColourPrefix + currentActiveInventoryItems[40].shortname + '">' + hero.inventory[i].quantity + '<h3>' + theColourPrefix + currentActiveInventoryItems[40].shortname + '</h3><p>' + currentActiveInventoryItems[40].description + '</p></li>';
            } else {
                var thisAction = currentActiveInventoryItems[hero.inventory[i].type].action;
                var isABook = false;
                if (thisAction) {
                    if (thisAction == "book") {
                        isABook = true;
                    }
                }
                if (isABook) {
                    if (hero.inventory[i].inscription.content) {
                        // has content, so add it to the source list:
                        allSourceMarkup += '<li class="scribeSource" id="scribeSourceFromSlot' + i + '"><img src="/images/game-world/inventory-items/' + hero.inventory[i].type + '.png" alt="' + currentActiveInventoryItems[hero.inventory[i].type].shortname + '">' + hero.inventory[i].quantity + '<h3>' + currentActiveInventoryItems[hero.inventory[i].type].shortname + '</h3><p>' + hero.inventory[i].inscription.title + '</p></li>';
                    } else {
                        // no content, add it to the materials list:
                        allMaterialsMarkup += '<li class="scribeMaterial" id="scribeMaterialFromSlot' + i + '"><img src="/images/game-world/inventory-items/' + hero.inventory[i].type + '.png" alt="' + currentActiveInventoryItems[hero.inventory[i].type].shortname + '">' + hero.inventory[i].quantity + '<h3>' + currentActiveInventoryItems[hero.inventory[i].type].shortname + '</h3><p>' + currentActiveInventoryItems[hero.inventory[i].type].description + '</p></li>';
                    }
                }
            }
        }
        allInksMarkup += '</ol>';
        allSourceMarkup += '</ol>';
        allMaterialsMarkup += '</ol>';
        sourceSelection.innerHTML = allSourceMarkup;
        materialsSelection.innerHTML = allMaterialsMarkup;
        inkSelection.innerHTML = allInksMarkup;
        UI.inscription = {
            mode: 'original',
            selected: {
                source: '',
                material: '',
                ink: ''
            }

        };
        scribeStartInscription.setAttribute('disabled', 'disabled');
        inscriptionTitle.value = '';
        inscriptionTextArea.innerHTML = '';
    },

    processInscriptionClick: function(thisNode) {
        switch (thisNode.className) {
            case 'scribeSource':
                UI.inscription.selected.source = thisNode.id.substring(20);
                var itemList = document.querySelectorAll('#sourceSelection li'),
                    i;
                // hide all:
                for (i = 0; i < itemList.length; ++i) {
                    itemList[i].classList.remove('selected');
                }
                thisNode.classList.add('selected');
                break;
            case 'scribeMaterial':

                UI.inscription.selected.material = thisNode.id.substring(22);
                var itemList = document.querySelectorAll('#materialsSelection li'),
                    i;
                // hide all:
                for (i = 0; i < itemList.length; ++i) {
                    itemList[i].classList.remove('selected');
                }
                thisNode.classList.add('selected');
                break;
            case 'scribeInk':
                UI.inscription.selected.ink = thisNode.id.substring(17);
                var itemList = document.querySelectorAll('#inkSelection li'),
                    i;
                // hide all:
                for (i = 0; i < itemList.length; ++i) {
                    itemList[i].classList.remove('selected');
                }
                thisNode.classList.add('selected');
                break;
        }
        if (UI.inscription.mode == 'copy') {
            if ((UI.inscription.selected.ink != '') && (UI.inscription.selected.material != '') && (UI.inscription.selected.source != '')) {
                scribeStartInscription.removeAttribute('disabled');
            } else {
                scribeStartInscription.setAttribute('disabled', 'disabled');
            }
        } else {
            // original:
            if ((UI.inscription.selected.ink != '') && (UI.inscription.selected.material != '')) {
                scribeStartInscription.removeAttribute('disabled');
            } else {
                scribeStartInscription.setAttribute('disabled', 'disabled');
            }
        }
        switch (thisNode.id) {
            case 'scribeCopyText':
                if (UI.inscription.mode != 'copy') {
                    UI.resetInscriptionPanel();
                }
                UI.inscription.mode = 'copy';
                originalText.classList.remove('active');
                sourceSelection.classList.add('active');
                thisNode.classList.add('active');
                scribeOriginalText.classList.remove('active');
                break;
            case 'scribeOriginalText':
                if (UI.inscription.mode != 'original') {
                    UI.resetInscriptionPanel();
                }
                UI.inscription.mode = 'original';
                originalText.classList.add('active');
                sourceSelection.classList.remove('active');
                thisNode.classList.add('active');
                scribeCopyText.classList.remove('active');
                break;
            case 'scribeStartInscription':

                var newInscribedObject = JSON.parse(JSON.stringify(hero.inventory[UI.inscription.selected.material]));
                newInscribedObject.quantity = 1;
                newInscribedObject.colour = hero.inventory[UI.inscription.selected.ink].colour;
                if (UI.inscription.mode == 'copy') {
                    newInscribedObject.inscription = {
                        'title': hero.inventory[UI.inscription.selected.source].inscription.title,
                        'content': hero.inventory[UI.inscription.selected.source].inscription.content,
                        'timeCreated': Date.now()
                    }
                } else {
                    // original:
                    newInscribedObject.inscription = {
                        'title': inscriptionTitle.value,
                        'content': '<p>' + inscriptionTextArea.innerHTML + '</p>',
                        'timeCreated': Date.now()
                    }
                }
                // store these as the UI.inscription object will be cleared if the item is successfully added
                var storedSelectedMaterialSlot = UI.inscription.selected.material;
                var storedSelectedInkSlot = UI.inscription.selected.ink;

                inventoryCheck = canAddItemToInventory([newInscribedObject]);
                if (inventoryCheck[0]) {
                    document.getElementById("slot" + inventoryCheck[1]).innerHTML = generateSlotMarkup(inventoryCheck[1]);
                    UI.showChangeInInventory(inventoryCheck[1]);
                    // remove the ink and material used:

                    removeFromInventory(storedSelectedMaterialSlot, 1);

                    removeFromInventory(storedSelectedInkSlot, 1);
                    UI.updateInscriptionPanel();
                } else {
                    UI.showNotification("<p>I don't have room in my bags for that</p>");
                }
                break;
        }
    },

    updatePanelsAfterInventoryChange: function() {
        // called after any inventory add, remove or move so any panels can be updated to reflect the change
        UI.updateInscriptionPanel();
        UI.checkHeldItem();
        UI.updateQuickHold();
    },

    getGameSettings: function(e) {
        soundVolume.value = gameSettings.soundVolume;
        musicVolume.value = gameSettings.musicVolume;
        // apply these:
        audio.adjustEffectsVolume();
        audio.adjustMusicVolume();
    },

    openSettings: function(e) {
        if (e) {
            e.preventDefault();
        }
        gameSettingsPanel.classList.add('active');
    },



    buildCollectionPanel: function() {
        var collectionPanels = document.querySelectorAll('#collectionQuestPanels section');
        var thisZoneName, panelMarkup, thisCollectionItem, thisItemCollectedClass, thisParagraphNode;
        for (var i = 0; i < collectionPanels.length; i++) {
            thisZoneName = collectionPanels[i].dataset.collection;

            if (hero.collections.hasOwnProperty(thisZoneName)) {


                if (hero.collections[thisZoneName].complete) {
                    // is complete, de-obfuscate the lore:
                    var thisParagraphNode = collectionPanels[i].getElementsByTagName("P")[0];
                    thisParagraphNode.textContent = window.atob(thisParagraphNode.textContent);
                    thisParagraphNode.classList.add('active');
                }
                // if exist in hero.collections, then write in items required as well:

                panelMarkup = '';
                for (var j in hero.collections[thisZoneName].required) {
                    thisCollectionItem = hero.collections[thisZoneName].required[j];
                    thisItemCollectedClass = "notCollected";
                    if (thisCollectionItem < 0) {
                        thisItemCollectedClass = "";
                    }
                    panelMarkup += '<li class="' + thisItemCollectedClass + '"><img src="/images/game-world/inventory-items/' + Math.abs(thisCollectionItem) + '.png"></li>';
                    collectionPanels[i].getElementsByTagName("OL")[0].innerHTML = panelMarkup;
                }
            }
        }
        collectionQuestPanels.classList.add('active');
    },

    initiateCollectionQuestPanel: function(whichZone) {
        // add objects needed for this collection:
        var thisCollectionItem, thisItemCollectedClass;
        var panelMarkup = '';
        for (var j in hero.collections[whichZone].required) {
            thisCollectionItem = hero.collections[whichZone].required[j];
            thisItemCollectedClass = "notCollected";
            if (thisCollectionItem < 0) {
                thisItemCollectedClass = "";
            }
            panelMarkup += '<li class="' + thisItemCollectedClass + '" id="' + whichZone + '-' + Math.abs(thisCollectionItem) + '"><img src="/images/game-world/inventory-items/' + Math.abs(thisCollectionItem) + '.png"></li>';
            document.querySelector('#collection-' + whichZone + ' ol').innerHTML = panelMarkup;
        }
    },

    completeCollectionQuestPanel: function(whichZone) {
        // reveal lore:
        var thisParagraphNode = document.querySelector('#collection-' + whichZone + ' p');
        thisParagraphNode.textContent = window.atob(thisParagraphNode.textContent);
        thisParagraphNode.classList.add('active');
    },

    openChest: function(itemsMap, itemReference) {
        UI.showUI();
        var contents = thisMapData[itemsMap].items[itemReference].contains;
        audio.playSound(soundEffects['chestOpen'], 0);
        // open chest animation (thisMapData.items[itemReference]) ####

        // show container item name in the title:
        chestTitle.innerHTML = currentActiveInventoryItems[(thisMapData[itemsMap].items[itemReference].type)].shortname;

        // build contents:
        var chestContents = '';
        var thisChestObject;
        for (var i = 0; i < currentActiveInventoryItems[(thisMapData[itemsMap].items[itemReference].type)].actionValue; i++) {
            chestContents += '<li id="chestSlot-' + itemReference + '-' + i + '-' + itemsMap + '">';
            if (typeof contents[i] !== "undefined") {
                if (contents[i] != "") {
                    if (contents[i].type == "$") {
                        // just money
                        chestContents += '<img src="/images/game-world/inventory-items/coins.png" alt="' + contents[i].quantity + ' worth of coins">';
                        chestContents += '<p><em>' + parseMoney(contents[i].quantity) + ' worth of coins </em></p>';
                        chestContents += '<span class="qty">' + parseMoney(contents[i].quantity) + '</span>';
                    } else {
                        // create defaults:
                        thisChestObject = {
                            "quantity": 1,
                            "quality": 100,
                            "durability": 100,
                            "currentWear": 0,
                            "effectiveness": 100,
                            "colour": 0,
                            "enchanted": 0,
                            "hallmark": 0,
                            "inscription": ""
                        }
                        // add in any defined values:
                        for (var attrname in contents[i]) {
                            thisChestObject[attrname] = contents[i][attrname];
                        }
                        // save all these default values to the object for adding it to the inventory later:
                        contents[i] = thisChestObject;
                        chestContents += generateGenericSlotMarkup(thisChestObject);
                    }
                }
            }
            chestContents += '</li>';
        }
        chestSlotContents.innerHTML = chestContents;
        chestIdOpen = itemReference + "-" + itemsMap;
        chestPanel.classList.add('active');
    },

    closeChest: function() {
        // animate close ####
        chestPanel.classList.remove('active');
        audio.playSound(soundEffects['chestOpen'], 0);
        chestIdOpen = -1;
    },

    addFromChest: function(chestSlotId) {
        var itemDetails = chestSlotId.split("-");
        var whichMap = itemDetails[3];
        var chestItemContains = thisMapData[whichMap].items[(itemDetails[1])].contains;
        var whichChestItem = chestItemContains[(itemDetails[2])];
        if (typeof whichChestItem !== "undefined") {
            if (whichChestItem.type == "$") {
                // money:
                hero.currency.money += whichChestItem.quantity;
                audio.playSound(soundEffects['coins'], 0);
                UI.updateCurrencies();
                thisMapData[whichMap].items[(itemDetails[1])].contains[(itemDetails[2])] = "";
                document.getElementById(chestSlotId).innerHTML = "";
            } else {
                inventoryCheck = canAddItemToInventory([whichChestItem]);
                if (inventoryCheck[0]) {
                    thisMapData[whichMap].items[(itemDetails[1])].contains[(itemDetails[2])] = "";
                    UI.showChangeInInventory(inventoryCheck[1]);
                    document.getElementById(chestSlotId).innerHTML = "";
                } else {
                    UI.showNotification("<p>I don't have room in my bags for that</p>");
                }
            }
        }
    },

    toggleUI: function() {
        interfaceWrapper.classList.toggle('active');
        interfaceIsVisible = !interfaceIsVisible;
    },

    showUI: function() {
        interfaceWrapper.classList.add('active');
        interfaceIsVisible = true;
    },

    buildActionBar: function() {
        var actionBarMarkup = '<ol>';
        var imageSrc, toolTipText;
        for (var i = 0; i < hero.actions.length; i++) {
            if (hero.actions[i] == "-") {
                actionBarMarkup += '<li><img src="/images/game-world/interface/actions/blank.png" alt="Empty Action slot"></li>';
            } else {
                if (hero.actions[i][2] == null) {
                    imageSrc = hero.actions[i][1];
                    toolTipText = hero.actions[i][0];
                    if (typeof hero.actions[i][3]['pet-name'] !== "undefined") {
                        toolTipText += " " + hero.actions[i][3]['pet-name'];
                    }
                } else {
                    imageSrc = hero.actions[i][2] + '-' + hero.actions[i][1];
                    toolTipText = hero.actions[i][0] + ' (' + hero.actions[i][1] + ' type' + hero.actions[i][2] + ')';
                }

                actionBarMarkup += '<li class="active" data-index="' + i + '" data-category="' + hero.actions[i][2] + '" id="actionType' + hero.actions[i][1] + '"><img src="/images/game-world/interface/actions/' + imageSrc + '.png" alt="' + hero.actions[i][0] + ' action"><p>' + toolTipText + '</p></li>';
            }
        }
        actionBarMarkup += '</ol>';
        actionBar.innerHTML = actionBarMarkup;
    },

    actionBarClick: function(e) {
        var thisNode = getNearestParentId(e.target);
        if (thisNode.id.substring(0, 10) == "actionType") {
            var actionType = thisNode.id.substring(10);
            switch (actionType) {
                case "gather":
                    // make sure not already gathering:
                    if (activeAction != "gather") {
                        if (activeAction == "survey") {
                            surveyingStopped();
                        }
                        // check if there's a relevant item on the hero's tile, or at arm's length:
                        var foundItem = findItemWithinArmsLength();
                        if (foundItem != null) {
                            // found an item - check source node and the action match categories:
                            if (currentActiveInventoryItems[foundItem.type].category == thisNode.dataset.category) {
                                // check it's not still re-spawning:
                                if (foundItem.state != "inactive") {
                                    gathering.itemObject = foundItem;
                                    gathering.itemMap = findMapNumberFromGlobalCoordinates(foundItem.tileX, foundItem.tileY)
                                    gathering.quality = parseInt(foundItem.quality);
                                    gathering.quantity = 100;
                                    gathering.maxQuantity = parseInt(foundItem.quantity);
                                    gathering.purity = parseInt(foundItem.purity);
                                    gathering.stability = parseInt(foundItem.stability);
                                    gathering.node = foundItem;
                                    gathering.depletionTime = baseGatheringTime;
                                    // look for modifiers from the action:
                                    gathering.modifiers = hero.actions[thisNode.dataset.index][3];
                                    for (var modifier in gathering.modifiers) {
                                        switch (modifier) {
                                            case 'time':
                                                gathering.depletionTime += gathering.modifiers[modifier];
                                                break;
                                            case 'purity':
                                                gathering.purity += gathering.modifiers[modifier];
                                                break;
                                            case 'stability':
                                                gathering.stability += gathering.modifiers[modifier];
                                                break;
                                            case 'quality':
                                                gathering.quality += gathering.modifiers[modifier];
                                                break;
                                        }
                                    }

                                    // tool needs to modify values as well #####

                                    // make sure not too low, or negative
                                    gathering.quality = capValues(gathering.quality, 10, 100);
                                    gathering.purity = capValues(gathering.purity, 10, 100);
                                    gathering.stability = capValues(gathering.stability, 10, 100);
                                    gathering.quantity = capValues(gathering.quantity, 10, 100);
                                    // determine the stability decrease based on the quality being extracted - higher quality = more harmful, stabiity will drop faster
                                    gathering.stabilitySpeed = gathering.quality * gatheringStabilityModifier;
                                    // quantity remaining will continuously drop:
                                    gathering.depletionSpeed = gatheringDepletionModifier / gathering.depletionTime;

                                    // update the bar without the transitions, so it's all in place when the panel opens:
                                    UI.updateGatheringPanel();
                                    // trigger a reflow to push the update without the transition:
                                    gatheringPanel.offsetHeight;
                                    gatheringOutputSlot.innerHTML = '';
                                    gatheringPanel.classList.add('active');
                                    audio.playSound(soundEffects['gather' + thisNode.dataset.category], 0);
                                    activeAction = "gather";
                                }
                            } else {
                                UI.showNotification('<p>I don\'t think that\'s the right resource type for this action</p>');
                            }
                            if (activeAction == "dowse") {
                                activeAction = "";
                            }
                        }
                    }

                    break;
                case "dowse":
                    if (activeAction == "survey") {
                        surveyingStopped();
                    }
                    if (activeAction != "gather") {
                        if (activeAction != "dowse") {
                            dowsing.range = baseDowsingRange;
                            dowsing.category = thisNode.dataset.category;
                            activeAction = "dowse";
                            dowsing.modifiers = hero.actions[thisNode.dataset.index][3];
                            for (var modifier in dowsing.modifiers) {
                                switch (modifier) {
                                    case 'range':
                                        dowsing.range += dowsing.modifiers[modifier];
                                        break;
                                }
                            }
                        } else {
                            activeAction = "";
                            dowsing = {};
                        }
                    }
                    break;

                case "plant-breeding":
                    if (activeAction == "survey") {
                        surveyingStopped();
                    }
                    activeAction = "pollinating";
                    var foundItem = findItemWithinArmsLength();
                    if (foundItem != -1) {
                        // found an item - check source node and the action match categories:
                        console.log(currentActiveInventoryItems[thisMapData.items[foundItem].type].category);
                        console.log(currentActiveInventoryItems[thisMapData.items[foundItem].type].action);
                        // change the cursor to show it's targetting a plant:
                        gameWrapper.classList.add('targetingPollen');
                        // cat == 1 and action == ""
                    }
                    break;
                case "survey":
                    // ok to switch to this from Dowsing
                    if (activeAction != "gather") {
                        if (activeAction != "survey") {
                            activeAction = "survey";
                            surveying.category = thisNode.dataset.category;
                            surveying.timeRequired = baseSurveyingTime;
                            surveying.modifiers = hero.actions[thisNode.dataset.index][3];
                            for (var modifier in surveying.modifiers) {
                                switch (modifier) {
                                    case 'time':
                                        surveying.timeRequired += surveying.modifiers[modifier];
                                        break;
                                }
                            }
                            surveying.timeRequired = capValues(surveying.timeRequired, 200, 2000);
                            surveying.timeRemaining = 100;
                            surveying.depletionSpeed = surveyingDepletionModifier / surveying.timeRequired;

                            UI.updateSurveyingPanel();
                            // trigger a reflow to push the update without the transition:
                            //  surveyingPanel.offsetHeight;
                            surveyingPanel.classList.add('active');
                        } else {
                            surveyingStopped();
                        }
                    }
                    break;
                case "mount":
                    // ###
                    break;
                case "identify":
                    if (activeAction == "survey") {
                        surveyingStopped();
                    }
                    var foundItem = findItemWithinArmsLength();
                    if (foundItem != null) {
                        var additionalText = '';
                        // check if it's required for a catalogue quest:
                        for (var i in hero.catalogues) {
                            if (!hero.catalogues[i].completed) {
                                var indexPosition = hero.catalogues[i].ids.indexOf(foundItem.type);
                                if (indexPosition !== -1) {
                                    // strike off the list visually:
                                    document.querySelector("#catalogue" + i + " li[data-id='" + foundItem.type + "']").classList.add('complete');
                                    additionalText = '&mdash;I needed that for a catalogue';
                                    hero.catalogues[i].ids[indexPosition] = 0 - foundItem.type;
                                }
                            }
                        }
                        UI.showNotification("<p>That's a " + currentActiveInventoryItems[foundItem.type].shortname + additionalText + ".</p>");
                    }
                    break;
            }
        }
    },

    updateGatheringPanel: function() {
        gatheringBarQuality.style.width = gathering.quality + '%';
        gatheringBarQuantity.style.width = gathering.quantity + '%';
        gatheringBarPurity.style.width = gathering.purity + '%';
        gatheringBarStability.style.width = gathering.stability + '%';
    },

    updateSurveyingPanel: function() {
        // surveyingTimeBar.style.width = (100 - surveying.timeRemaining) + '%';


        // has 30 frames:
        var frameRequired = ((surveying.timeRemaining) / 3.3333);
        // hour glass background width is 92px for each frame:
        frameRequired = (Math.floor(frameRequired)) * 92;
        surveyingTimeBar.style.backgroundPosition = "-" + frameRequired + "px 0";
    },

    updateCraftingPanel: function() {
        // has 30 frames:
        var frameRequired = ((craftingObject.timeRemaining) / 3.3333);
        // hour glass background width is 92px for each frame:
        frameRequired = (Math.floor(frameRequired)) * 92;
        craftingTimeBar.style.backgroundPosition = "-" + frameRequired + "px 0";
    },

    addFromGathering: function() {
        inventoryCheck = canAddItemToInventory([activeGatheredObject]);
        if (inventoryCheck[0]) {
            gatheringOutputSlot.innerHTML = "";
            UI.showChangeInInventory(inventoryCheck[1]);
            hero.stats.itemsGathered++;
            gatheringPanel.classList.remove('active');
        } else {
            UI.showNotification("<p>I don't have room in my bags for that</p>");
        }
    },

    updateCooldowns: function() {
        var thisValue;
        for (var thisSlotsID in hero.inventory) {
            if (typeof hero.inventory[thisSlotsID].cooldown !== "undefined") {
                if (hero.inventory[thisSlotsID].cooldownTimer > 0) {
                    hero.inventory[thisSlotsID].cooldownTimer--;
                    //console.log(hero.inventory[thisSlotsID].cooldownTimer);
                    //update visually (scaleY uses 0 - 1):
                    thisValue = (hero.inventory[thisSlotsID].cooldownTimer / hero.inventory[thisSlotsID].cooldown);
                    // does this need vendor prefixes?            
                    document.querySelector("#slot" + thisSlotsID + " .coolDown").style.transform = 'scaleY(' + thisValue + ')';
                }
            }
        }
    },
    handleRightClick: function(e) {
        // e.preventDefault();
        // ###############
        console.log("right click");
        console.log(e);
        var thisNode = getNearestParentId(e.target);
        console.log(thisNode.id);
    },
    buildQuestJournal: function(markup, regions) {
        questJournalEntries.innerHTML = markup;
        // build region filter:
        var regionMarkup = '<option value="all">Show all</option>'
        for (var region in regions) {
            regionMarkup += '<option value="' + regions[region] + '">' + regions[region] + '</option>';
        }
        questJournalRegionFilter.innerHTML = regionMarkup;
        questJournalRegionFilter.onchange = UI.filterJournal;
        questJournal.classList.add('active');
    },
    filterJournal: function(e) {
        var journalItems = document.querySelectorAll('#questJournalEntries li'),
            i;
        if (questJournalRegionFilter.value == "all") {
            for (i = 0; i < journalItems.length; ++i) {
                journalItems[i].classList.add('active');
            }
        } else {
            // hide all:
            for (i = 0; i < journalItems.length; ++i) {
                if (journalItems[i].dataset.region == questJournalRegionFilter.value) {
                    journalItems[i].classList.add('active');
                } else {
                    journalItems[i].classList.remove('active');
                }
            }
        }
    },
    toggleJournal: function() {
        questJournal.classList.toggle('active');
    },
    addToQuestJournal: function(data) {
        // add the entry:
        questJournalEntries.innerHTML = data.markup + questJournalEntries.innerHTML;
        // check to see if a new region needs adding to the filter:
        var foundThisRegion = false;
        var storedIndex = -1;
        for (var i = 0; i < questJournalRegionFilter.length; i++) {
            if (questJournalRegionFilter.options[i].value == data.regions) {
                foundThisRegion = true;
                break;
            }
            // find the position to insert it next too (ignore the 'Show all' option as that needs to stay at the top):
            if (questJournalRegionFilter.options[i].value != "all") {
                if (questJournalRegionFilter.options[i].value > data.regions) {
                    if (storedIndex == -1) {
                        storedIndex = i;
                    }
                }
            }
        }
        if (!foundThisRegion) {
            // add it alphabetically:   
            var newOption = document.createElement("OPTION");
            newOption.innerText = data.regions;
            newOption.value = data.regions;
            questJournalRegionFilter.options.add(newOption, storedIndex);

        }
    },
    movePlotPlacementOverlay: function(e) {
        cursorPositionX = e.pageX;
        cursorPositionY = e.pageY;
    },
    openPost: function(postObjectX, postObjectY) {
        UI.showUI();
        // store the coordinates of the NPC or item that triggered this opening:
        postObject.x = postObjectX;
        postObject.y = postObjectY;
        postObject.active = true;
        postPanel.classList.add('active');
        audio.playSound(soundEffects['bookOpen'], 0);
    },
    closePost: function() {
        postObject.active = false;
        postPanel.classList.remove('active');
    },

    readPostMessage: function(whichElement) {
        var thisElement = document.getElementById(whichElement);
        if (thisElement.classList.contains('unread')) {
            thisElement.classList.remove('unread');
            // send this to the database to mark as read there:
            sendDataWithoutNeedingAResponse("/game-world/readPost.php?id=" + whichElement);
            // see if there are any unread messages left, if not, hide the 'new mail icon':
            if (document.querySelectorAll('#receivedPostPanel .unread').length == 0) {
                newPost.classList.remove('active');
            }
        }
        if (thisElement.hasAttribute('data-quest')) {
            var whichQuest = thisElement.getAttribute('data-quest');
            if (canOpenQuest(whichQuest)) {
                openQuest(whichQuest);
            }


        }
        var correspondingPostMessage = "postMessage" + whichElement.substr(4);
        document.getElementById(correspondingPostMessage).classList.add("active");
    },
    takePostAttachments: function(whichElement) {
        getJSON("/game-world/getPostAttachment.php?id=" + whichElement, function(data) {
            if (data.item != "null") {
                // try and add to inventory:
                inventoryCheck = canAddItemToInventory(data.item);
                if (inventoryCheck[0]) {
                    UI.showChangeInInventory(inventoryCheck[1]);
                    // remove attachment(s) from message:
                    var attachmentSlots = document.querySelectorAll("#postMessage" + data.id + " .postSlot");
                    for (i = 0; i < attachmentSlots.length; ++i) {
                        attachmentSlots[i].outerHTML = '';
                    }
                    // remove all from message preview list:
                    document.querySelector("#post" + data.id + " .previewSlot").innerHTML = '';
                    // send notification that it's been added to database:
                    sendDataWithoutNeedingAResponse("/game-world/gotPostAttachment.php?id=" + data.id);
                } else {
                    UI.showNotification("<p>I don't have room in my bags for that</p>");
                }
            }
        }, function(status) {
            // error - try again:
            UI.takePostAttachments(whichElement);
        });
    },
    postPanelSingleClick: function(e) {
        switch (e.target.id) {
            case 'sendPostTab':
                sendPostTab.classList.add('active');
                sendPostPanel.classList.add('active');
                receivedPostTab.classList.remove('active');
                receivedPostPanel.classList.remove('active');
                break;
            case 'receivedPostTab':
                sendPostTab.classList.remove('active');
                sendPostPanel.classList.remove('active');
                receivedPostTab.classList.add('active');
                receivedPostPanel.classList.add('active');
                break;
            case 'sendPost':
                // escape new lines in the textarea:
                sendUserPost('{"subject":"' + sendPostSubject.value + '","message":"' + sendPostMessage.value.replace(/\n/g, "\\\\n") + '","senderID":"' + characterId + '","attachments":0,"recipientCharacterName":"' + sendPostCharacter.value + '","fromName":"Eleaddai"}');
                break;
            case 'cancelPost':
                // ####
                break;
        }
    },
    initRetinueTimers: function() {
        // retinueQuestTimers
        var allRetinueQuestTimers = document.getElementsByClassName('retinueQuestTimer');
        for (var i = 0; i < allRetinueQuestTimers.length; i++) {
            retinueQuestTimers.push([allRetinueQuestTimers[i], new Date().getTime() + (allRetinueQuestTimers[i].dataset.minutes) * 60 * 1000, ""]);
        }
    },

    updateRetinueTimers: function() {
        var remainingTime, seconds, minutes, hours, days;
        var currentTime = new Date().getTime();
        var thisTimerText;
        for (var i = 0; i < retinueQuestTimers.length; i++) {
            remainingTime = retinueQuestTimers[i][1] - currentTime;

            var seconds = Math.floor((remainingTime / 1000) % 60);
            var minutes = Math.floor((remainingTime / (60 * 1000)) % 60);
            var hours = Math.floor((remainingTime / (60 * 60 * 1000)) % 24);
            var days = Math.floor(remainingTime / (24 * 60 * 60 * 1000));

            if (days > 1) {
                thisTimerText = days + " days remaining";
            } else if (days == 1) {
                thisTimerText = "1 day remaining";
            } else if (hours > 1) {
                thisTimerText = hours + " hours remaining";
            } else if (hours == 1) {
                thisTimerText = "1 hour remaining";
            } else if (minutes > 1) {
                thisTimerText = minutes + " minutes remaining";
            } else if (minutes == 1) {
                thisTimerText = "1 minute remaining";
            } else if (seconds > 1) {
                thisTimerText = seconds + " seconds remaining";
            } else if (seconds == 1) {
                thisTimerText = "1 second remaining";
            } else {
                thisTimerText = "complete";
            }
            if (thisTimerText != retinueQuestTimers[i][2]) {
                // only access the DOM if the text has changed:
                retinueQuestTimers[i][0].innerHTML = thisTimerText;
                retinueQuestTimers[i][2] = thisTimerText;
            }
            if (thisTimerText == "complete") {
                UI.retinueQuestComplete(retinueQuestTimers[i][0]);
                // remove this timer
                retinueQuestTimers.splice(i, 1);
                i--;
            }
        }
    },
    openRetinuePanel: function(passedRetinueObject) {
        UI.showUI();
        retinuePanel.classList.add("active");
        audio.playSound(soundEffects['bookOpen'], 0);
        retinueObject.active = true;
        retinueObject.x = passedRetinueObject.x;
        retinueObject.y = passedRetinueObject.y;
        retinueObject.passedObject = passedRetinueObject;
    },
    closeRetinuePanel: function() {
        retinuePanel.classList.remove("active");
        // if it's an NPC then keep them on this speech:
        if (typeof retinueObject.passedObject !== "undefined") {
            if (typeof retinueObject.passedObject.speechIndex !== "undefined") {
                retinueObject.passedObject.speechIndex--;
            }
        }
        // remove all other retinueObject content:
        retinueObject = {
            "active": false
        };
    },
    resetRetinuePanels: function() {
        var siblingPanels = document.getElementsByClassName('retinueQuestLocationDetailPanel');
        for (i = 0; i < siblingPanels.length; i++) {
            siblingPanels[i].classList.remove("active");
        }
        // reset submit and time output:
        retinueQuestStart.disabled = true;
        retinueQuestTimeRequired.innerHTML = "Time required:";
        // remove portraits from closed templates:
        var allFollowerSlots = document.getElementsByClassName('followerSlot');
        for (i = 0; i < allFollowerSlots.length; i++) {
            allFollowerSlots[i].innerHTML = '';
        }
        if (retinueObject.followersAdded) {
            // make any dragged NPCs available again:
            for (i = 0; i < retinueObject.followersAdded.length; i++) {
                if (retinueObject.followersAdded[i] != "null") {
                    document.getElementById("retinueFollower" + retinueObject.followersAdded[i]).classList.add("available");
                }
            }
        }
    },
    openRetinueDetailPanel: function(e) {


        if (e.target.classList.contains('undiscovered')) {
            if (e.target.classList.contains('explorable')) {
                UI.resetRetinuePanels();
                retinueExplorePanel.classList.add('active');
                retinueObject.openQuestDetail = 'Exploring';
                retinueObject.destinationLocationX = e.target.getAttribute('data-locationx');
                retinueObject.destinationLocationY = e.target.getAttribute('data-locationy');
                // determine distance to see how long and how many followers are required:

                // 277 is about a third of the max distance from corner to corner of the map:
                retinueObject.followersRequired = Math.ceil(getPythagorasDistance(retinueBaseLocationX, retinueBaseLocationY, retinueObject.destinationLocationX, retinueObject.destinationLocationY) / 277);

                // show the relevant follower slots:
                var followerSlots = document.querySelectorAll('#retinueExplorePanel .followerSlot');

                for (i = 0; i < followerSlots.length; ++i) {
                    followerSlots[i].style.display = 'none';
                }

                for (var i = 0; i < retinueObject.followersRequired; i++) {
                    document.getElementById('dropFollowersPanelExplore-' + i).style.display = 'block';
                }

                retinueObject.hasToReturnToBase = 1;
                retinueObject.questName = 'Exploring'
                retinueObject.followersAdded = [];
                for (var i = 0; i < retinueObject.followersRequired; i++) {
                    retinueObject.followersAdded.push("null");
                }
                var hexCoordinates = e.target.id.split("_");
                retinueObject.hexCoordX = hexCoordinates[1];
                retinueObject.hexCoordY = hexCoordinates[2];

            }
        } else {
            // get the corresponding Quest panel:
            var whichPanelId = e.target.id.substring(20);
            UI.resetRetinuePanels();
            retinueExplorePanel.classList.remove('active');
            retinueObject.openQuestDetail = whichPanelId;
            var thisPanelElement = document.getElementById("retinueQuestLocationDetail" + whichPanelId);
            retinueObject.followersRequired = thisPanelElement.getAttribute('data-requires');
            retinueObject.destinationLocationX = thisPanelElement.getAttribute('data-locationx');
            retinueObject.destinationLocationY = thisPanelElement.getAttribute('data-locationy');
            retinueObject.hasToReturnToBase = thisPanelElement.getAttribute('data-requiresreturn');
            retinueObject.questName = thisPanelElement.getAttribute('data-questname');
            retinueObject.followersAdded = [];
            for (var i = 0; i < retinueObject.followersRequired; i++) {
                retinueObject.followersAdded.push("null");
            }
            thisPanelElement.classList.add("active");
        }
    },
    endFollowerDrag: function(e) {
        var dropTargetNode = getNearestParentId(e.target);
        if (dropTargetNode.id.indexOf("dropFollowersPanel") !== -1) {
            var thisDropTargetSplit = dropTargetNode.id.split("-");
            var whichFollowerSlot = thisDropTargetSplit[1];
            // check if a follower has already been added to this slot:
            if (retinueObject.followersAdded[whichFollowerSlot] != "null") {
                // return previous
                document.getElementById("retinueFollower" + retinueObject.followersAdded[whichFollowerSlot]).classList.add("available");
            }
            retinueObject.followersAdded[whichFollowerSlot] = retinueObject.draggedFollower;
            // check if that's all follower slots filled:
            if (retinueObject.followersAdded.indexOf("null") === -1) {
                retinueQuestStart.disabled = false;
            }
            // determine the time required:
            var thisFollower, thisTimeRequired;
            var longestTimeRequired = 0;
            var longestTimeOutput = "";
            for (i = 0; i < retinueObject.followersAdded.length; i++) {
                if (retinueObject.followersAdded[i] != "null") {
                    thisFollower = document.getElementById("retinueFollower" + retinueObject.followersAdded[i]);

                    thisTimeRequired = getRetinueQuestTime(thisFollower.getAttribute('data-locationx'), thisFollower.getAttribute('data-locationy'), retinueObject.destinationLocationX, retinueObject.destinationLocationY, retinueObject.hasToReturnToBase);
                    // find the slowest time (if multiple followers) and use that:

                    if (thisTimeRequired[0] > longestTimeRequired) {
                        longestTimeRequired = thisTimeRequired[0];
                        longestTimeOutput = thisTimeRequired[1];
                    }
                }
            }
            retinueObject.timeRequired = longestTimeRequired;
            retinueQuestTimeRequired.innerHTML = "Time required: " + longestTimeOutput;
            UI.draggedOriginal.classList.remove("hasDragCopy");
            UI.activeDragObject.style.cssText = "left: -100px; top: -100px;";
            // add portrait to this slot
            dropTargetNode.innerHTML = '<img src="/images/retinue/' + retinueObject.draggedFollower + '.png">';
            // make this unavailable in the list:
            document.getElementById("retinueFollower" + retinueObject.draggedFollower).classList.remove("available");
        } else {
            // snap back:
            UI.activeDragObject.style.cssText = "z-index:4;left: " + (objInitLeft) + "px; top: " + (objInitTop) + "px;transition: transform 0.4s ease;";
            UI.activeDragObject.addEventListener(whichTransitionEvent, function snapDraggedSlotBack(e) {
                UI.draggedOriginal.classList.remove("hasDragCopy");
                e.currentTarget.style.cssText = "left: -100px; top: -100px;";
                // remove this event listener now:
                return e.currentTarget.removeEventListener(whichTransitionEvent, snapDraggedSlotBack, false);
            }, false);
        }
        // tidy up and remove event listeners:
        document.removeEventListener("mousemove", UI.handleDrag, false);
        document.removeEventListener("mouseup", UI.endFollowerDrag, false);
        UI.activeDragObject = '';
    },
    addFollowersToQuest: function() {
        var followersAssigned = [];
        for (i = 0; i < retinueObject.followersAdded.length; i++) {
            // show status in follower panel:
            document.querySelector('#retinueFollower' + retinueObject.followersAdded[i] + ' p').innerHTML = 'active on "' + retinueObject.questName + '" <span class="retinueQuestTimer" data-minutes="' + retinueObject.timeRequired + '"></span>';
            // add to timers:
            retinueQuestTimers.push([document.querySelector('#retinueFollower' + retinueObject.followersAdded[i] + ' .retinueQuestTimer'), new Date().getTime() + (retinueObject.timeRequired) * 60 * 1000, ""]);
            followersAssigned.push(retinueObject.followersAdded[i]);
            document.getElementById('retinueFollower' + retinueObject.followersAdded[i]).setAttribute('data-activeonquest', retinueObject.openQuestDetail);
        }

        if (retinueObject.openQuestDetail == "Exploring") {
            var thisHex = document.getElementById('undiscovered_' + retinueObject.hexCoordX + '_' + retinueObject.hexCoordY);
            thisHex.classList.remove('explorable');
            thisHex.classList.add('beingExplored');
            getJSON("/game-world/generateExplorationRetinueQuest.php?chr=" + characterId + "&followers=" + followersAssigned.join("|") + "&hexCoordX=" + retinueObject.hexCoordX + "&hexCoordY=" + retinueObject.hexCoordY, function(data) {
                if (data.markup) {
                    retinuePanel.insertAdjacentHTML('beforeend', data.markup);
                    // update the follower's panels with the correct quest id:
                    var thisQuestFollowers = data.followers.split(",");
                    console.log(data.followers);
                    for (i = 0; i < thisQuestFollowers.length; i++) {
                        document.getElementById('retinueFollower' + thisQuestFollowers[i]).setAttribute('data-activeonquest', data.questId);
                    }
                }
            }, function(status) {
                // error ####
            });

            retinueExplorePanel.classList.remove("active");

            delete retinueObject.hexCoordX;
            delete retinueObject.hexCoordY;
        } else {

            sendDataWithoutNeedingAResponse("/game-world/updateRetinueQuest.php?questID=" + retinueObject.openQuestDetail + "&chr=" + characterId + "&followers=" + followersAssigned.join("|"));
            document.getElementById("retinueQuestLocationDetail" + retinueObject.openQuestDetail).classList.remove("active");
            // remove from the map:
            document.getElementById("retinueQuestLocation" + retinueObject.openQuestDetail).classList.remove("active");
        }
        retinueQuestStart.disabled = true;
        retinueQuestTimeRequired.innerHTML = "Time required:";
        // clean up:
        delete retinueObject.draggedFollower;
        delete retinueObject.openQuestDetail;
        delete retinueObject.followersAdded;
        delete retinueObject.followersRequired;
        delete retinueObject.destinationLocationX;
        delete retinueObject.destinationLocationY;
        delete retinueObject.hasToReturnToBase;
        delete retinueObject.timeRequired;
        delete retinueObject.questName;
    },
    retinueSingleClick: function(e) {
        var parentPanel = getNearestParentId(e.target);
        switch (e.target.className) {
            case 'takeRewards':
                e.preventDefault();
                retinueMissionCompleted(parentPanel.id.substring(15), false);
                break;
            case 'finishExploration':
                e.preventDefault();
                retinueMissionCompleted(parentPanel.id.substring(15), true);
                break;
            case 'reHireFollowerNo':
                e.preventDefault();
                // remove follower:
                var whichFollower = e.target.getAttribute('data-follower');
                retinueList.removeChild(document.getElementById('retinueFollower' + whichFollower));
                sendDataWithoutNeedingAResponse("/game-world/removeHiredFollower.php?id=" + questId);
                // close panel:       
                parentPanel.classList.remove('active');
                break;
            case 'reHireFollowerYes':
                e.preventDefault();
                // remove money:
                if (hero.currency.money >= costToRehireFollower) {
                    hero.currency.money -= costToRehireFollower;
                    UI.updateCurrencies();
                    audio.playSound(soundEffects['coins'], 0);
                } else {
                    UI.showNotification('<p>I haven\'t got enough money</p>');
                }
                // close panel:       
                parentPanel.classList.remove('active');
                break;
        }
    },
    retinueQuestComplete: function(whichTimer) {
        var thisNode = getNearestParentId(whichTimer);
        var whichPanel = thisNode.getAttribute('data-activeonquest');
        document.getElementById("retinueComplete" + whichPanel).classList.add("active");
    },
    showNewFollower: function(id, name) {
        UI.showNotification('<p>I\'ve gained a new follower called &quot;' + name + '&quot;</p>');
    },
    showNewProfession: function(id) {
        UI.showNotification('<p>I learned a new profession - #' + id + '</p>');
    },
    buildHorticulturePanel: function(panelMarkup) {
        horticulturePanel.insertAdjacentHTML('beforeend', panelMarkup);
        horticulturePanel.classList.add('active');
    },
    holdItem: function(whichSlot) {
        hero.holding.hash = hero.inventory[whichSlot].hash;
        hero.holding.type = hero.inventory[whichSlot].type;
        UI.updateHeldItems();

        // update the quick held index:
        var allQuickHoldElements = quickHold.querySelectorAll('li');
        for (var i = 0; i < allQuickHoldElements.length; i++) {
            if (allQuickHoldElements[i].dataset.hash == hero.holding.hash) {
                hero.holding.quickHoldIndex = i;
                break;
            }
        }
        UI.updateQuickHold();

    },
    updateHeldItems: function() {
        if (hero.holding.hash != '') {
            var thisFileColourSuffix = "";
            var thisColourName = getColourName(hero.inventory[findSlotByHash(hero.holding.hash)].colour, hero.holding.type);
            if (thisColourName != "") {
                thisFileColourSuffix = "-" + thisColourName.toLowerCase();
            }
            holdingIcon.innerHTML = '<img src="/images/game-world/inventory-items/' + hero.holding.type + thisFileColourSuffix + '.png" alt="' + currentActiveInventoryItems[hero.holding.type].shortname + '">';
            // check if a gauge is needed:
            UI.updateHeldItemGauge();
        } else {
            holdingIcon.innerHTML = '';
            holdingGauge.classList.remove('active');

        }
    },
    updateHeldItemGauge: function() {
        // check if it contains anything, and show a gauge if so:
        var thisItemObject = hero.inventory[findSlotByHash(hero.holding.hash)];
        if (typeof thisItemObject.contains !== "undefined") {
            var gaugePercent = thisItemObject.contains[0].quantity / currentActiveInventoryItems[thisItemObject.type].actionValue * 100;
            holdingGauge.className = 'gauge' + currentActiveInventoryItems[thisItemObject.contains[0].type].shortname;
            holdingGauge.querySelector('span').style.width = gaugePercent + '%';
            holdingGauge.classList.add('active');
        } else {
            holdingGauge.classList.remove('active');
        }
    },
    checkHeldItem: function() {
        if (hero.holding.hash != '') {
            // check that the currently held item still exists:
            if (findSlotByHash(hero.holding.hash) == -1) {
                // lost the hash - try and find by type instead:
                var possibleSlots = findSlotItemIdInInventory(hero.holding.type);
                if (possibleSlots.length > 0) {
                    // update to this slot's hash:
                    hero.holding.hash = hero.inventory[(possibleSlots[0])].hash;
                    hero.holding.type = '';
                } else {
                    // unequip:
                    hero.holding.hash = '';
                    hero.holding.type = '';
                    UI.updateHeldItems();
                }
            }
        }
    },
    updateQuickHold: function() {
        // find all holdable items and build the selectable interface:
        var quickHoldMarkup = '<ul>';
        var counter = 1;
        // highlight the first if none selected:
        // if (hero.holding.quickHoldIndex == "") {
        //    hero.holding.quickHoldIndex = 0;
        //}
        var keysFound = [];
        for (var key in hero.inventory) {
            if (currentActiveInventoryItems[hero.inventory[key].type].holdable == 1) {
                keysFound.push(key);
            }
        }
        // sort this array so that the order is always preserved: (for ... in don't keep order)
        keysFound = keysFound.sort();

        // add unequip slot:
        quickHoldMarkup += '<li id="quickHold0" data-type="empty" data-hash=""><img src="/images/game-world/inventory-items/empty.png" alt="Empty"></li>';
        var thisFileColourSuffix, thisColourName;
        for (var i = 0; i < keysFound.length; i++) {
            key = keysFound[i];

            quickHoldMarkup += '<li id="quickHold' + counter + '" ';

            if (counter === hero.holding.quickHoldIndex) {
                quickHoldMarkup += 'class="active" ';
            }
            quickHoldMarkup += 'data-type="' + hero.inventory[key].type + '" data-hash="' + hero.inventory[key].hash + '">';

            thisFileColourSuffix = "";
            thisColourName = getColourName(hero.inventory[key].colour, hero.inventory[key].type);
            if (thisColourName != "") {
                thisFileColourSuffix = "-" + thisColourName.toLowerCase();
            }

            quickHoldMarkup += '<img src="/images/game-world/inventory-items/' + hero.inventory[key].type + thisFileColourSuffix + '.png" alt="' + currentActiveInventoryItems[hero.inventory[key].type].shortname + '"></li>';
            counter++;
        }

        quickHoldMarkup += '</ul>';
        quickHold.innerHTML = quickHoldMarkup;
        hero.quickHoldLength = counter;
    },
    moveQuickHold: function(whichDirection) {
        document.getElementById('quickHold' + hero.holding.quickHoldIndex).classList.remove('active');
        hero.holding.quickHoldIndex += whichDirection;
        if (hero.holding.quickHoldIndex < 0) {
            hero.holding.quickHoldIndex = hero.quickHoldLength - 1;
        } else if (hero.holding.quickHoldIndex >= hero.quickHoldLength) {
            hero.holding.quickHoldIndex = 0;
        }
        var newActiveElement = document.getElementById('quickHold' + hero.holding.quickHoldIndex);
        newActiveElement.classList.add('active');
        if (hero.holding.quickHoldIndex == 0) {
            // unequip:
            hero.holding.hash = "";
            hero.holding.type = "";
        } else {
            hero.holding.hash = newActiveElement.dataset.hash;
            hero.holding.type = newActiveElement.dataset.type;
        }

        UI.updateHeldItems();
        quickHold.classList.add('active');
        // remove this class as soon as it's fully faded in:
        quickHold.addEventListener(
            whichTransitionEvent,
            function uiFadeInComplete(e) {
                quickHold.classList.remove("active");
                return e.currentTarget.removeEventListener(
                    whichTransitionEvent,
                    uiFadeInComplete,
                    false
                );
            },
            false
        );
    },
    createTreasureMap: function(mapId) {
        if (hero.activeTreasureMaps.indexOf(mapId) === -1) {
            var markupToAdd = '<div class="treasureMap" id="treasureMap' + mapId + '"><div class="draggableBar">X marks the spot...</div><button class="closePanel">close</button>';
            var mapIdTiles = mapId.split("_");
            markupToAdd += '<img src="/game-world/generateMapImage.php?playerId=' + characterId + '&sepia=true&tileX=' + mapIdTiles[0] + '&tileY=' + mapIdTiles[1] + '&radius=12&scale=0.3&overlay=true">';
            markupToAdd += '</div>';
            treasureMapPanels.insertAdjacentHTML('beforeend', markupToAdd);
            hero.activeTreasureMaps.push(mapId);
        }
    },
    showTreasureMap: function(mapId) {
        document.getElementById('treasureMap' + mapId).classList.add("active");
    },
    openHireFollowerPanel: function(whichNPC) {
        hireRetinueFollowerPanelContent.innerHTML = '<img src="/images/retinue/' + whichNPC.followerId + '.png" alt="">Would you like to hire ' + whichNPC.name + '?';
        hireRetinueFollowerPanel.classList.add('active');
        hireRetinueFollowerPanel.setAttribute('data-NPC', whichNPC.uniqueIndex);
    },
    closeHireFollowerPanel: function() {
        hireRetinueFollowerPanel.classList.remove('active');
        dialogue.classList.add("slowerFade");
        dialogue.classList.remove("active");
    },
    touchTapAction: function() {
        // simulate the Action key being pressed:
        key[4] = 1;
    },
    openHousingPanel: function() {
        housingPanel.classList.add('active');
    },
    openHousingConstructionPanel: function() {
        housingConstructionPanel.classList.add('active');
        document.addEventListener("click", housingNameSpace.worldClickHandler, false);
        document.addEventListener("mousemove", housingNameSpace.mouseMove, false);
        if (hero.housing.draftCost) {
            if (hero.housing.draftCost != 0) {
                // get the cost for the stored draft version:
                housingNameSpace.runningCostTotal = hero.housing.draftCost;
            }
        }
        housingNameSpace.restoreDraft = JSON.parse(JSON.stringify(hero.housing.draft));
     // disable weather effects while in building mode:
        changeWeather("");
        gameMode = 'housing';
    },
    closeHousingConstructionPanel: function() {
        // not called anywhere yet
        housingConstructionPanel.classList.remove('active');
        document.removeEventListener("click", housingNameSpace.worldClickHandler, false);
        document.removeEventListener("mousemove", housingNameSpace.mouseMove, false);
        gameMode = 'play';
    },
    showYesNoDialogueBox: function(heading, button1Text, button2Text, button1Function, button2Function) {
        yesNoDialogueButton1.innerText = button1Text;
        var button1FunctionSplit = button1Function.split(".");
        if (button1FunctionSplit.length > 1) {
            yesNoDialogueButton1.onclick = window[button1FunctionSplit[0]][button1FunctionSplit[1]];
        } else {
            yesNoDialogueButton1.onclick = window[button1Function];
        }
        yesNoDialogueButton2.innerText = button2Text;
        var button2FunctionSplit = button2Function.split(".");
        if (button2FunctionSplit.length > 1) {
            yesNoDialogueButton2.onclick = window[button2FunctionSplit[0]][button2FunctionSplit[1]];
        } else {
            yesNoDialogueButton2.onclick = window[button2Function];
        }
        yesNoDialogueHeading.innerHTML = heading;
        yesNoDialoguePanel.classList.add('active');
    },
    hideYesNoDialogueBox: function() {
        yesNoDialoguePanel.classList.remove('active');
    }
}
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

for (var m = 0; m < visibleMaps.length; m++) {
   // console.log(visibleMaps[m],"***",thisMapData[(visibleMaps[m])]);
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
// service worker:
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/game-world/serviceWorker.min.js', {
        updateViaCache: 'imports',
        scope: '/game-world/'
    });
}

function sizeCanvasSize() {
    // size it to the screen (check to see if actual screen size is smaller for high resolution mobile)
    availableScreenWidth = window.innerWidth;
    availableScreenHeight = window.innerHeight;
    if (screen.width < window.innerWidth) {
        availableScreenWidth = screen.width;
    }
    if (screen.height < window.innerHeight) {
        availableScreenHeight = screen.height;
    }
    gameContext.canvas.width = availableScreenWidth;
    gameContext.canvas.height = availableScreenHeight;
    lightMapContext.canvas.width = availableScreenWidth / 4;
    lightMapContext.canvas.height = availableScreenHeight / 4;
    canvasWidth = availableScreenWidth;
    canvasHeight = availableScreenHeight;
}

var debouncedResize = debounce(function() {
    sizeCanvasSize();
}, 250);
window.addEventListener('resize', debouncedResize);


function loadGlobalMapData() {

    getJSON("/data/world-map.json", function(data) {

        worldMap = data.worldMap;
        init();
    }, function(status) {
        // error - try again:
        loadGlobalMapData();
    });
}


function init() {
    gameCanvas = document.getElementById("gameWorld");
    if (gameCanvas.getContext) {
        gameContext = gameCanvas.getContext('2d');
        lightMapOverlay = document.getElementById("lightMapOverlay");
        lightMapContext = lightMapOverlay.getContext('2d');
        sizeCanvasSize();
        whichTransitionEvent = determineWhichTransitionEvent();
        whichAnimationEvent = determineWhichAnimationEvent();
        gameMode = "mapLoading";
        cartographyCanvas = document.getElementById("cartographyCanvas");
        cartographyContext = cartographyCanvas.getContext('2d');
        offScreenCartographyCanvas = document.getElementById('offScreenCartographyCanvas');
        offScreenCartographyContext = offScreenCartographyCanvas.getContext('2d');
        canvasMapImage = new Image();
        canvasMapMaskImage = new Image();
        UI.init();
        audio.init();
        // detect and set up input methods:
        Input.init();
        // show loading screen while getting assets:
        gameLoop();
        getHeroGameState();
    }
}

function getHeroGameState() {
    getJSON("/game-world/getCoreData.php?chr=" + characterId, function(data) {
        //  thisMapData = data.map;
        // copy the data to the hero object:
        for (var attribute in data.gameState) {
            hero[attribute] = data.gameState[attribute];
        }
        newMap = findMapNumberFromGlobalCoordinates(data.gameState.tileX, data.gameState.tileY);
        //   visibleMaps.push(newMap);


        //visibleMapsLoading = [newMap];

        gameSettings = data.gameState.settings;

        timeSinceLastAmbientSoundWasPlayed = hero.totalGameTimePlayed + (minTimeBetweenAmbientSounds * 1.25);
        if (data.gameState.allPets) {
            if (data.gameState.activePets.length > 0) {
                hasActivePet = true;
            }
            //   hero.activePets = data.activePets;
            //   hero.allPets = data.allPets;
        }
        // copy the fae properties that will change into the main fae object:
        for (var attrname in data.gameState.fae) {
            fae[attrname] = data.gameState.fae[attrname];
        }


        // determine current map:
        currentMap = newMap;


        //  hero.inventory = data.inventory;
        if (currentMap > 0) {
            //clean old procedural maps: (don't need a response here)
            sendDataWithoutNeedingAResponse('/game-world/generateCircularDungeonMap.php?playerId=' + characterId + '&clearMaps=true');
        }

        hero.x = getTileCentreCoordX(hero.tileX);
        hero.y = getTileCentreCoordY(hero.tileY);
        hero.isox = findIsoCoordsX(hero.x, hero.y);
        hero.isoy = findIsoCoordsY(hero.x, hero.y);
        //updateVisibleMaps();




        colourNames = data.colours.colourNames;
        UI.buildHorticulturePanel(data.horticulture.markup);
        hero.plantBreeding = data.horticulture.data;
        questData = data.quests;
        possibleTitles = data.titles;

        housingData = data.housingItems;


        cardGameNameSpace.allCardData = data.cards.cards;
        hero.cardBacks = data.cards.backs;
        hero.activeCardBack = data.cards.activeBack;
        UI.changeActiveCardBack();

        hero.crafting = data.recipes.professions;
        allRecipes = data.recipes.all;
        currentItemGroupFilters = data.recipes.itemGroups;

        UI.buildQuestJournal(data.journal.markup, data.journal.regions);



        loadCoreAssets();
    }, function(status) {
        // error - try again:
        getHeroGameState();
    });
}


function loadCoreAssets() {

    var coreImagesToLoad = [];
    coreImagesToLoad.push({
        name: "heroImg",
        src: '/images/game-world/core/hero.png'
    });
    coreImagesToLoad.push({
        name: "shadowImg",
        src: '/images/game-world/core/shadow-quarter.png'
    });
    coreImagesToLoad.push({
        name: "tilledEarth",
        src: '/images/game-world/core/tilled.png'
    });
    coreImagesToLoad.push({
        name: "addedWater",
        src: '/images/game-world/core/added-water.png'
    });
    coreImagesToLoad.push({
        name: "ocean",
        src: '/images/game-world/core/ocean.png'
    });
    if (hasActivePet) {
        for (var i = 0; i < hero.activePets.length; i++) {
            coreImagesToLoad.push({
                name: "activePet" + hero.activePets[i],
                src: '/images/game-world/npcs/' + hero.allPets[hero.activePets[i]].src
            });
        }
    }
    Loader.preload(coreImagesToLoad, prepareCoreAssets, loadingProgress);
}


function prepareCoreAssets() {
    heroImg = Loader.getImage("heroImg");
    shadowImg = Loader.getImage("shadowImg");
    tilledEarth = Loader.getImage("tilledEarth");
    addedWater = Loader.getImage("addedWater");
    ocean = Loader.getImage("ocean");
    oceanPattern = gameContext.createPattern(ocean, "repeat");
    if (hasActivePet) {
        for (var i = 0; i < hero.activePets.length; i++) {
            activePetImages[i] = Loader.getImage("activePet" + hero.activePets[i]);
            console.log("activePet" + hero.activePets[i]);
        }
    }

    housingNameSpace.init();

    loadMap();
}

function initialisePet(index, tileOffsetX, tileOffsetY) {
    hero.allPets[hero.activePets[index]].tileX = hero.tileX + (tileOffsetX * (index + 1));
    hero.allPets[hero.activePets[index]].tileY = hero.tileY + (tileOffsetY * (index + 1));
    if (!isOverWorldMap) {
        // needed for Internal maps:
        if (index == 0) {
            hero.allPets[hero.activePets[index]].state = "moving";
        } else {
            // will be placed out of the normal map grid:
            hero.allPets[hero.activePets[index]].state = "queuing";
        }
    }
    hero.allPets[hero.activePets[index]].state = "moving";
    hero.allPets[hero.activePets[index]].facing = hero.facing;
}

function initialisePetObject(index) {
    var thisPet = hero.allPets[hero.activePets[index]];
    thisPet.x = getTileCentreCoordX(thisPet.tileX);
    thisPet.y = getTileCentreCoordY(thisPet.tileY);
    if (!isOverWorldMap) {
        // check if it's not actually on the map:
        if ((thisPet.tileX < 0) || (thisPet.tileY < 0) || (thisPet.tileX >= mapTilesX) || (thisPet.tileY >= mapTilesY)) {
            thisPet.z = defaultElevation;
        } else {
            thisPet.z = getElevation(thisPet.tileX, thisPet.tileY);
        }
    } else {
        thisPet.z = getElevation(thisPet.tileX, thisPet.tileY);
    }
    thisPet.dx = 0;
    thisPet.dy = 0;
    thisPet.foundPath = '';
    if (thisPet.state != "queuing") {
        thisPet.state = "wait";
    }
    if (index == 0) {
        // first pet follows the hero:
        thisPet.following = hero;
    } else {
        // subsequent pets follow the one in front:
        thisPet.following = hero.allPets[hero.activePets[i - 1]];
    }
    // even the last one should drop a breadcrumb in case an escort quest NPC needs it
    thisPet.breadcrumb = [];
    for (var j = 0; j < breadCrumbLength; j++) {
        thisPet.breadcrumb[j] = [thisPet.tileX, thisPet.tileY];
    }
}

function processInitialMap() {
    var startTileOffsetX, startTileOffsetY;
    var startTileOffsetXNum = 0;
    var startTileOffsetYNum = 0;


    // check for any "?" in the target door (for procedural levels):
    if (hero.tileX.toString().indexOf("?") != -1) {
        // check for +1 or -1 modifiers:
        startTileOffsetX = hero.tileX.toString().substring(1);
        if (startTileOffsetX.length > 0) {
            startTileOffsetXNum = parseInt(startTileOffsetX);
        }
        hero.tileX = thisMapData[currentMap].entrance[0] + startTileOffsetXNum;
    }
    if (hero.tileY.toString().indexOf("?") != -1) {
        startTileOffsetY = hero.tileY.toString().substring(1);
        if (startTileOffsetY.length > 0) {
            startTileOffsetYNum = parseInt(startTileOffsetY);
        }
        hero.tileY = thisMapData[currentMap].entrance[1] + startTileOffsetYNum;
    }



    // set up pet positions:
    if (hasActivePet) {
        var tileOffsetX = 0;
        var tileOffsetY = 0;
        switch (hero.facing) {
            case "n":
                tileOffsetY = 1;
                break
            case "s":
                tileOffsetY = -1;
                break
            case "e":
                tileOffsetX = -1;
                break
            case "w":
                tileOffsetX = 1;
                break
        }



        for (var i = 0; i < hero.activePets.length; i++) {

            initialisePet(i, tileOffsetX, tileOffsetY);

        }





    }


    mapTilesY = thisMapData[currentMap].terrain.length;
    mapTilesX = thisMapData[currentMap].terrain[0].length;
    if (previousZoneName != thisMapData[currentMap].zoneName) {
        UI.showZoneName(thisMapData[currentMap].zoneName);
        document.title = titleTagPrefix + ' - ' + thisMapData[currentMap].zoneName;
        cartographicTitle.innerHTML = thisMapData[currentMap].zoneName;
    }

    initCartographicMap();

    if (thisMapData[currentMap].showOnlyLineOfSight) {
        // initialise the lightmap with default values:
        lightMap = [];
        for (var row = mapTilesY - 1; row >= 0; row--) {
            var defaultRow = [];
            for (var col = mapTilesX - 1; col >= 0; col--) {
                defaultRow[col] = 0;
            }
            lightMap[row] = defaultRow;
        }
        updateLightMap();
    }
    if (thisMapData[currentMap].ambientSounds) {
        audio.loadAmbientSounds(thisMapData[currentMap].ambientSounds);
    }
    if (thisMapData[currentMap].hourChime) {
        audio.loadAmbientSounds({ "hourChime": thisMapData[currentMap].hourChime });
    }
    fae.recentHotspots = [];
    findInventoryItemData();
}

function loadNewVisibleMapAssets(whichMap) {
    if (whichMap < 0) {
        whichMap = 'dungeon/' + randomDungeonName;
    }
    // doesn't need full loader - don't need progress etc.:
    var newBackground = new Image();
    newBackground.onload = function() {
        backgroundImgs[whichMap] = newBackground;
    };
    newBackground.onerror = function() {
        // error handling? ####

    };
    newBackground.src = '/images/game-world/backgrounds/' + whichMap + '.png';


    // load items:
    var thisPathAndIdentifer;
    var newItemImagesToLoad = [];
    for (var i = 0; i < thisMapData[whichMap].items.length; i++) {

        thisPathAndIdentifer = getItemPathAndIdentifier(thisMapData[whichMap].items[i]);

        // only add unique images:
        if (typeof itemImages[(thisPathAndIdentifer[1])] === "undefined") {
            newItemImagesToLoad[(thisPathAndIdentifer[1])] = new Image();
            newItemImagesToLoad[(thisPathAndIdentifer[1])].identifier = thisPathAndIdentifer[1];
            newItemImagesToLoad[(thisPathAndIdentifer[1])].onload = function() {
                itemImages[this.identifier] = newItemImagesToLoad[this.identifier];
            };
            newItemImagesToLoad[(thisPathAndIdentifer[1])].onerror = function() {
                // error handling? ####
            };
            newItemImagesToLoad[(thisPathAndIdentifer[1])].src = thisPathAndIdentifer[0];
        }
    }


    // load terrain:
    var thisTerrainIdentifer;
    var newTerrainImagesToLoad = [];
    for (var i = 0; i < thisMapData[whichMap].graphics.length; i++) {
        thisTerrainIdentifer = thisMapData[whichMap].graphics[i].src;
        if (typeof tileImages[thisTerrainIdentifer] === "undefined") {
            newTerrainImagesToLoad[(thisTerrainIdentifer)] = new Image();
            newTerrainImagesToLoad[(thisTerrainIdentifer)].identifier = thisTerrainIdentifer;
            newTerrainImagesToLoad[(thisTerrainIdentifer)].onload = function() {
                tileImages[this.identifier] = newTerrainImagesToLoad[this.identifier];
            };
            newTerrainImagesToLoad[(thisTerrainIdentifer)].onerror = function() {
                // error handling? ####
            };
            //   if (thisTerrainIdentifer.indexOf('housing') !== -1) {
            //       newTerrainImagesToLoad[(thisTerrainIdentifer)].src = "/images/game-world/" + thisMapData[whichMap].graphics[i].src;
            //   } else {
            newTerrainImagesToLoad[(thisTerrainIdentifer)].src = "/images/game-world/terrain/" + thisMapData[whichMap].graphics[i].src;
            //   }

        }
    }


    // load NPCs
    var thisNPCIdentifier;
    var newNPCImagesToLoad = [];
    for (var i = 0; i < thisMapData[whichMap].npcs.length; i++) {
        thisNPCIdentifier = "npc" + thisMapData[whichMap].npcs[i].src;

        if (typeof npcImages[thisNPCIdentifier] === "undefined") {

            newNPCImagesToLoad[thisNPCIdentifier] = new Image();
            newNPCImagesToLoad[thisNPCIdentifier].identifier = thisNPCIdentifier;
            newNPCImagesToLoad[thisNPCIdentifier].onload = function() {
                npcImages[this.identifier] = newNPCImagesToLoad[this.identifier];

            };
            newNPCImagesToLoad[thisNPCIdentifier].onerror = function() {
                // error handling? ####
            };
            newNPCImagesToLoad[thisNPCIdentifier].src = "/images/game-world/npcs/" + thisMapData[whichMap].npcs[i].src;

        }
    }



    // check for nests, and get the graphics for any creatures they will spawn:
    for (var i = 0; i < thisMapData[whichMap].items.length; i++) {
        if (currentActiveInventoryItems[thisMapData[whichMap].items[i].type].action == "nest") {
            for (var j = 0; j < thisMapData[whichMap].items[i].contains.length; j++) {
                thisNPCIdentifier = "npc" + thisMapData[whichMap].items[i].contains[j].src;
                if (typeof npcImages[thisNPCIdentifier] === "undefined") {
                    newNPCImagesToLoad[thisNPCIdentifier] = new Image();
                    newNPCImagesToLoad[thisNPCIdentifier].identifier = thisNPCIdentifier;
                    newNPCImagesToLoad[thisNPCIdentifier].onload = function() {
                        npcImages[this.identifier] = newNPCImagesToLoad[this.identifier];
                    };
                    newNPCImagesToLoad[thisNPCIdentifier].onerror = function() {
                        // error handling? ####
                    };
                    newNPCImagesToLoad[thisNPCIdentifier].src = "/images/game-world/npcs/" + thisMapData[whichMap].npcs[i].src;

                }
            }
        }
    }






}


function processNewVisibleMapData(whichNewMap) {
    //console.log("processNewVisibleMapData for "+whichNewMap);
    visibleMaps.push(whichNewMap);
    removeElementFromArray(visibleMapsLoading, whichNewMap);
    for (var i = 0; i < thisMapData[whichNewMap].items.length; i++) {
        initialiseItem(thisMapData[whichNewMap].items[i]);
    }
    for (var i = 0; i < thisMapData[whichNewMap].npcs.length; i++) {

        initialiseNPC(thisMapData[whichNewMap].npcs[i]);
    }


    /*
    // look for shops:
    thisMapShopItemIds = '';
    var shopData = '{"chr": ' + characterId + ',"region":"' + thisMapData[whichNewMap].region + '","shops": [';
    var addedShopDataAlready = false;
    // loop through shops and create hashes 
    for (var i = 0; i < thisMapData[whichNewMap].shops.length; i++) {
        thisMapData[whichNewMap].shops[i].hash = generateHash(thisMapData[whichNewMap].shops[i].name);
        if (addedShopDataAlready) {
            shopData += ",";
        }
        shopData += JSON.stringify(thisMapData[whichNewMap].shops[i]);
        addedShopDataAlready = true;
    }
    shopData += ']}';

    */
    updatePossibleWeather();
    loadNewVisibleMapAssets(whichNewMap);
}

function loadNewVisibleInventoryItemData(itemIdsToLoad, whichNewMap) {

    //   console.log("loading new inv data for map#"+whichNewMap+": " + itemIdsToLoad);
    if (itemIdsToLoad.length > 0) {
        getJSON("/game-world/getInventoryItems.php?isAnUpdate=true&whichIds=" + itemIdsToLoad, function(data) {
            // currentActiveInventoryItems = data;
            // append this new data in: 
            //  console.log("inv data returned ########### "+whichNewMap);
            for (var attrname in data) {
                //     console.log(attrname, data[attrname]);
                currentActiveInventoryItems[attrname] = data[attrname];
            }
            processNewVisibleMapData(whichNewMap);
        }, function(status) {
            // try again:
            loadNewVisibleInventoryItemData(itemIdsToLoad, whichNewMap);
        });
    } else {
        processNewVisibleMapData(whichNewMap)
    }
}




function loadNewVisibleJSON(mapFilePath, whichNewMap) {
    //  console.log("loading JSON for " + whichNewMap);
    getJSON(mapFilePath, function(data) {
            thisMapData[whichNewMap] = data.mapData.map;
            //   thisMapShopItemIds = data.shops.allItemIds;
            UI.buildShop(data.shops.markup);
            // find new items that require data:
            //console.log("loadNewVisibleJSON raw "+getItemIdsForMap(whichNewMap).join("."));
            var thisMapsItemIds = uniqueValues(getItemIdsForMap(whichNewMap));
            // var newItemIds = [];
            var newItemIds = data.shops.allItemIds;
            for (var i = 0; i < thisMapsItemIds.length; i++) {
                if (!(thisMapsItemIds[i] in currentActiveInventoryItems)) {
                    newItemIds.push(thisMapsItemIds[i]);
                }
            }
            //console.log("loadNewVisibleJSON "+newItemIds.join("."));
            loadNewVisibleInventoryItemData(newItemIds.join("|"), whichNewMap)
        },
        function(status) {
            loadNewVisibleJSON(mapFilePath, whichNewMap);
        });
}

function loadNewVisibleMap(whichNewMap) {
    //console.log("loading map data for " + whichNewMap);
    if (visibleMapsLoading.indexOf(whichNewMap) === -1) {
        visibleMapsLoading.push(whichNewMap);
        var mapFilePath = '/game-world/getMap.php?chr=' + characterId + '&map=' + whichNewMap;
        loadNewVisibleJSON(mapFilePath, whichNewMap);
    }
}


function loadMapJSON(mapFilePath) {
    getJSON(mapFilePath, function(data) {
            thisMapData[data.mapData.map.mapId] = data.mapData.map;

            currentMap = data.mapData.map.mapId;


            var thisCurrentMap = currentMap;
            if (thisCurrentMap.indexOf('housing') === -1) {
                thisCurrentMap = parseInt(currentMap);
            }

            visibleMaps.push(thisCurrentMap);
            thisMapShopItemIds = data.shops.allItemIds;
            UI.buildShop(data.shops.markup);
            processInitialMap();
            isOverWorldMap = !data.mapData.map.isInside;
            if (isOverWorldMap) {
                updateVisibleMaps();
            }
        },
        function(status) {
            // try again:
            console.log("retrying..." + mapFilePath);
            loadMapJSON(mapFilePath);
        });
}

function loadMap() {
    var dungeonAppend = '';
    // check for newly entering a random dungeon:
    if ((newMap < 0) && (currentMap > 0)) {
        randomDungeonName = randomDungeons[Math.abs(newMap)];
        newMap = -1;
    }
    if (randomDungeonName != "") {
        dungeonAppend = '&dungeonName=' + randomDungeonName;
        //   dungeonAppend += '&seed=1552609714';
    }

    loadMapJSON('/game-world/getMap.php?chr=' + characterId + '&map=' + newMap + dungeonAppend);
}


function getItemPathAndIdentifier(whichItem) {
    // get colour name 
    var thisItemIdentifier, thisImagePath;
    var thisFileColourSuffix = "";
    if (whichItem.colour) {
        var thisColourName = getColourName(whichItem.colour, whichItem.type);
        if (thisColourName != "") {
            thisFileColourSuffix = "-" + thisColourName.toLowerCase();
        }
    }
    thisItemIdentifier = "item" + whichItem.type + thisFileColourSuffix;
    thisImagePath = "/images/game-world/items/" + currentActiveInventoryItems[whichItem.type].worldSrc + thisFileColourSuffix + ".png";

    // check for User Generated Content:
    if (typeof whichItem.contains !== "undefined") {
        if (typeof whichItem.contains['ugc-id'] !== "undefined") {
            thisItemIdentifier = "item" + whichItem.type + '_' + whichItem.contains['ugc-id'];
            thisImagePath = "/images/user-generated/" + whichItem.contains['ugc-id'] + "-world.png";
        }
    }
    return [thisImagePath, thisItemIdentifier];
}

function loadMapAssets() {
    imagesToLoad = [];
    var thisFileColourSuffix, thisColourName;
    var assetPath = currentMap;
    npcGraphicsToLoad = [];
    var thisNPCIdentifier, thisTerrainIdentifer;
    itemGraphicsToLoad = [];
    var thisItemIdentifier = '';
    var thisImagePath = '';
    var resultantPlantType;
    tileGraphicsToLoad = [];


    for (var m = 0; m < visibleMaps.length; m++) {
        assetPath = visibleMaps[m];

        if (visibleMaps[m] < 0) {
            assetPath = randomDungeonName;
        }
        if (newMap.toString().indexOf('housing') !== -1) {

            imagesToLoad.push({
                name: "backgroundImg" + currentMap,
                src: '/images/game-world/backgrounds/housing/bg-' + mapTilesX + 'x' + mapTilesY + '.png'
            });
        } else {
            imagesToLoad.push({
                name: "backgroundImg" + visibleMaps[m],
                src: '/images/game-world/backgrounds/' + assetPath + '.png'
            });



        }
        //  tileGraphicsToLoad = thisMapData[visibleMaps[m]].graphics;
        for (var i = 0; i < thisMapData[visibleMaps[m]].graphics.length; i++) {
            thisTerrainIdentifer = thisMapData[visibleMaps[m]].graphics[i].src;
            //   if (thisTerrainIdentifer.indexOf('housing') !== -1) {
            //       imagesToLoad.push({
            //           name: thisTerrainIdentifer,
            //            src: "/images/game-world/" + thisMapData[visibleMaps[m]].graphics[i].src
            //       });
            //    } else {

            if (tileGraphicsToLoad.indexOf(thisTerrainIdentifer) == -1) {
                imagesToLoad.push({
                    //  name: "tile" + i,
                    name: thisTerrainIdentifer,
                    src: "/images/game-world/terrain/" + thisMapData[visibleMaps[m]].graphics[i].src
                });
                tileGraphicsToLoad.push(thisTerrainIdentifer);
            }
            //    }

        }

        for (var i = 0; i < thisMapData[visibleMaps[m]].npcs.length; i++) {
            thisNPCIdentifier = "npc" + thisMapData[visibleMaps[m]].npcs[i].src;
            if (npcGraphicsToLoad.indexOf(thisNPCIdentifier) == -1) {
                imagesToLoad.push({
                    name: thisNPCIdentifier,
                    src: "/images/game-world/npcs/" + thisMapData[visibleMaps[m]].npcs[i].src
                });
                npcGraphicsToLoad.push(thisNPCIdentifier);
            }
        }

        // check for nests, and get the graphics for any creatures they will spawn:
        for (var i = 0; i < thisMapData[visibleMaps[m]].items.length; i++) {
            if (currentActiveInventoryItems[thisMapData[visibleMaps[m]].items[i].type].action == "nest") {
                for (var j = 0; j < thisMapData[visibleMaps[m]].items[i].contains.length; j++) {
                    thisNPCIdentifier = "npc" + thisMapData[visibleMaps[m]].items[i].contains[j].src;
                    if (npcGraphicsToLoad.indexOf(thisNPCIdentifier) == -1) {
                        imagesToLoad.push({
                            name: thisNPCIdentifier,
                            src: "/images/game-world/npcs/" + thisMapData[visibleMaps[m]].items[i].contains[j].src
                        });
                        npcGraphicsToLoad.push(thisNPCIdentifier);
                    }
                }
            }
        }


        var thisPathAndIdentifer;

        for (var i = 0; i < thisMapData[visibleMaps[m]].items.length; i++) {
            thisPathAndIdentifer = getItemPathAndIdentifier(thisMapData[visibleMaps[m]].items[i]);


            // only add unique images:
            if (itemGraphicsToLoad.indexOf(thisPathAndIdentifer[1]) == -1) {
                imagesToLoad.push({
                    name: thisPathAndIdentifer[1],
                    src: thisPathAndIdentifer[0]
                });
                itemGraphicsToLoad.push(thisPathAndIdentifer[1]);
            }
        }

        // check for hidden resources:
        for (var i in thisMapData[visibleMaps[m]].hiddenResources) {
            for (var j in thisMapData[visibleMaps[m]].hiddenResources[i]) {
                thisItemIdentifier = "item" + thisMapData[visibleMaps[m]].hiddenResources[i][j].type;
                if (itemGraphicsToLoad.indexOf(thisItemIdentifier) == -1) {
                    imagesToLoad.push({
                        name: thisItemIdentifier,
                        src: "/images/game-world/items/" + currentActiveInventoryItems[thisMapData[visibleMaps[m]].hiddenResources[i][j].type].worldSrc + ".png"
                    });
                    itemGraphicsToLoad.push(thisItemIdentifier);
                }
            }
        }

        // check for seeds in inventory, and load the resultant plants:

        for (var key in hero.inventory) {
            if (currentActiveInventoryItems[(hero.inventory[key].type)].action == "seed") {
                // resultant plant is held in the actionValue:
                resultantPlantType = currentActiveInventoryItems[(hero.inventory[key].type)].actionValue.type;
                // get colour name 
                thisFileColourSuffix = "";
                thisColourName = getColourName(hero.inventory[key].colour, resultantPlantType);
                if (thisColourName != "") {
                    thisFileColourSuffix = "-" + thisColourName.toLowerCase();
                }
                thisItemIdentifier = "item" + resultantPlantType + thisFileColourSuffix;

                // only add unique images:
                if (itemGraphicsToLoad.indexOf(thisItemIdentifier) == -1) {
                    imagesToLoad.push({
                        name: thisItemIdentifier,
                        src: "/images/game-world/items/" + currentActiveInventoryItems[resultantPlantType].worldSrc + thisFileColourSuffix + ".png"
                    });
                    itemGraphicsToLoad.push(thisItemIdentifier);
                }
            }
        }

    }


    Loader.preload(imagesToLoad, prepareGame, loadingProgress);
}

function getItemIdsForMap(whichMap) {
    // find items placed on this map:
    var itemChoices;
    var itemIdsToGet = [];
    for (var i = 0; i < thisMapData[whichMap].items.length; i++) {
        itemIdsToGet.push(thisMapData[whichMap].items[i].type);
        // check if any are containers or chests:
        if (typeof thisMapData[whichMap].items[i].contains !== "undefined") {

            if (Array.isArray(thisMapData[whichMap].items[i].contains)) {
                for (var j = 0; j < thisMapData[whichMap].items[i].contains.length; j++) {
                    if (typeof thisMapData[whichMap].items[i].contains[j].type !== "undefined") {
                        itemChoices = thisMapData[whichMap].items[i].contains[j].type.toString().split("/");

                        for (var k = 0; k < itemChoices.length; k++) {
                            if (itemChoices[k] != "$") {
                                // make sure it's not money in a chest:
                                itemIdsToGet.push(parseInt(itemChoices[k]));
                            }
                        }
                    }
                }
            } else {
                // make sure it's not UGC:
                if (typeof thisMapData[whichMap].items[i].contains['ugc-id'] === "undefined") {
                    // eg crop object, so get pollen, seed and fruit ids if specified:

                    for (var j in thisMapData[whichMap].items[i].contains) {
                        itemIdsToGet.push(thisMapData[whichMap].items[i].contains[j].type);
                    }
                }
            }
        }
    }

    // find items in hidden resources (and their contents):
    var containsSplit;
    for (var i in thisMapData[whichMap].hiddenResources) {
        for (var j in thisMapData[whichMap].hiddenResources[i]) {
            itemIdsToGet.push(thisMapData[whichMap].hiddenResources[i][j].type);
            if (thisMapData[whichMap].hiddenResources[i][j].contains) {
                for (var k in thisMapData[whichMap].hiddenResources[i][j].contains) {
                    containsSplit = thisMapData[whichMap].hiddenResources[i][j].contains[k].type.split("/");
                    for (var l = 0; l < containsSplit.length; l++) {
                        itemIdsToGet.push(parseInt(containsSplit[l]));
                    }

                }

            }
        }
    }
    return itemIdsToGet;
}

function findInventoryItemData() {
    var itemIdsToGet = [];
    var theseRecipeComponents;
    // find out all items in the hero's inventory:
    for (var arrkey in hero.inventory) {
        itemIdsToGet.push(hero.inventory[arrkey].type);
        // check if any are containers:
        if (typeof hero.inventory[arrkey].contains !== "undefined") {
            for (var i = 0; i < hero.inventory[arrkey].contains.length; i++) {
                itemIdsToGet.push(hero.inventory[arrkey].contains[i].type);
            }
        }

    }
    // find bag items:
    for (var i = 0; i < hero.bags.length; i++) {
        itemIdsToGet.push(hero.bags[i].type);
    }



    for (var m = 0; m < visibleMaps.length; m++) {
        itemIdsToGet = itemIdsToGet.concat(getItemIdsForMap(visibleMaps[m]));
    }


    // find items in recipes:
    for (var i in hero.crafting) {
        for (var j in hero.crafting[i].filters['All']) {
            // get what's created:
            itemIdsToGet.push(hero.crafting[i].recipes[(hero.crafting[i].filters['All'][j])].creates);
            // get components:

            for (var k in hero.crafting[i].recipes[(hero.crafting[i].filters['All'][j])].components) {
                if (!(isNaN(hero.crafting[i].recipes[(hero.crafting[i].filters['All'][j])].components[k].type))) {
                    itemIdsToGet.push(hero.crafting[i].recipes[(hero.crafting[i].filters['All'][j])].components[k].type);
                }
            }
        }
    }


    // add item available in any shops:
    if (thisMapShopItemIds != '') {
        itemIdsToGet.push(thisMapShopItemIds);
    }


    // check quest rewards ############

    // remove duplicates:
    itemIdsToGet = uniqueValues(itemIdsToGet);
    loadInventoryItemData(itemIdsToGet.join("|"));
}




function loadInventoryItemData(itemIdsToLoad) {
    getJSON("/game-world/getInventoryItems.php?whichIds=" + itemIdsToLoad, function(data) {
        currentActiveInventoryItems = data;
        if (!inventoryInterfaceIsBuilt) {
            UI.buildInventoryInterface();
        }
        loadMapAssets();
    }, function(status) {
        // try again:
        loadInventoryItemData(itemIdsToLoad);
    });
}


function initialiseNPC(whichNPC) {
    whichNPC.x = getTileCentreCoordX(whichNPC.tileX);
    whichNPC.y = getTileCentreCoordY(whichNPC.tileY);
    whichNPC.z = getElevation(whichNPC.tileX, whichNPC.tileY);
    whichNPC.drawnFacing = whichNPC.facing;
    whichNPC.dx = 0;
    whichNPC.dy = 0;
    if (typeof whichNPC.speechIndex === "undefined") {
        whichNPC.speechIndex = 0;
    }
    whichNPC.currentAnimation = 'walk';
    // set index to -1 so when it increases, it'll pick up the first (0) element:
    whichNPC.movementIndex = -1;
    // allow NPCs to pick up their facing without moving to that first tile:
    whichNPC.forceNewMovementCheck = true;
    // used for making sure that pathfinding NPCs don't head straight back to the last place they visited:
    whichNPC.lastTargetDestination = "";
    // whichNPC.index = whichNPC;

    whichNPC.uniqueIndex = generateHash("npc" + whichNPC.x + "*" + whichNPC.y);

    if (typeof whichNPC.reactionRange === "undefined") {
        whichNPC.reactionRange = 1;
    }
}

function initialiseItem(whichItem) {
    whichItem.x = getTileCentreCoordX(whichItem.tileX);
    whichItem.y = getTileCentreCoordY(whichItem.tileY);
    if (typeof whichItem.tileZ === "undefined") {
        whichItem.z = getElevation(whichItem.tileX, whichItem.tileY);
    } else {
        whichItem.z = whichItem.tileZ * tileW;
    }
    whichItem.width = currentActiveInventoryItems[whichItem.type].width;
    whichItem.length = currentActiveInventoryItems[whichItem.type].length;
    whichItem.centreX = currentActiveInventoryItems[whichItem.type].centreX;
    whichItem.centreY = currentActiveInventoryItems[whichItem.type].centreY;
    whichItem.spriteWidth = currentActiveInventoryItems[whichItem.type].spriteWidth;
    whichItem.spriteHeight = currentActiveInventoryItems[whichItem.type].spriteHeight;
    whichItem.canBeRotated = currentActiveInventoryItems[whichItem.type].canBeRotated;
    whichItem.isCollidable = true;
    if (currentActiveInventoryItems[whichItem.type].action == "gate") {
        if (whichItem.state == "open") {
            whichItem.isCollidable = false;
        }
    }
    // check for node resources:
    if (currentActiveInventoryItems[whichItem.type].action == "node") {
        // use the saved value if it has one:
        if (!whichItem.timeLastHarvested) {
            // otherwise, set it so it can be instantly harvested:
            whichItem.timeLastHarvested = hero.totalGameTimePlayed - currentActiveInventoryItems[whichItem.type].respawnRate;
        }

        // add stability and quantity values if it doesn't have them
        if (typeof whichItem.stability === "undefined") {
            whichItem.stability = whichItem.maxStability;
        }
        if (typeof whichItem.quantity === "undefined") {
            whichItem.quantity = whichItem.maxQuantity;
        }

    }
    if (currentActiveInventoryItems[whichItem.type].action == "nest") {
        whichItem.timeLastSpawned = hero.totalGameTimePlayed;
        whichItem.spawnsRemaining = whichItem.additional;
    }
}


function prepareGame() {




    // get map image references:

    for (var i = 0; i < tileGraphicsToLoad.length; i++) {
        tileImages[tileGraphicsToLoad[i]] = Loader.getImage(tileGraphicsToLoad[i]);
    }


    for (var i = 0; i < npcGraphicsToLoad.length; i++) {
        npcImages[npcGraphicsToLoad[i]] = Loader.getImage(npcGraphicsToLoad[i]);

    }

    for (var i = 0; i < itemGraphicsToLoad.length; i++) {

        itemImages[itemGraphicsToLoad[i]] = Loader.getImage(itemGraphicsToLoad[i]);
        // ####
        //  itemImages[itemGraphicsToLoad[i]].spriteWidth = Loader.getImage(itemGraphicsToLoad[i]).width;
        //  itemImages[itemGraphicsToLoad[i]].spriteHeight = Loader.getImage(itemGraphicsToLoad[i]).length;
    }
    //backgroundImg = Loader.getImage("backgroundImg");

    backgroundImgs[currentMap] = Loader.getImage("backgroundImg" + currentMap);
    for (var i = 0; i < visibleMaps.length; i++) {
        backgroundImgs[(visibleMaps[i])] = Loader.getImage("backgroundImg" + visibleMaps[i]);
    }
    // initialise and position NPCs:
    for (var m = 0; m < visibleMaps.length; m++) {
        for (var i = 0; i < thisMapData[(visibleMaps[m])].npcs.length; i++) {
            initialiseNPC(thisMapData[(visibleMaps[m])].npcs[i]);
        }
    }
    // initialise pet:
    var defaultElevation = hero.z;
    if (hasActivePet) {
        for (var i = 0; i < hero.activePets.length; i++) {

            initialisePetObject(i);
        }
    }

    if (thisMapData[currentMap].movingPlatforms) {
        // initialise moving platforms:
        var thisPlatform, thisPlatformMovements;
        for (var i = 0; i < thisMapData[currentMap].movingPlatforms.length; i++) {
            thisPlatform = thisMapData[currentMap].movingPlatforms[i];
            thisPlatform.x = getTileCentreCoordX(thisPlatform.startTileX);
            thisPlatform.y = getTileCentreCoordY(thisPlatform.startTileY);
            thisPlatform.z = thisPlatform.startZ;
            thisPlatform.movementIndex = 0;
            thisPlatform.waitingTimer = 0;
            // this will be set to false if any character is moving over an edge, so the platform will stop until they're clear:
            thisPlatform.canMove = true;
            /*
            // determine offsets from platform's x and y coords (as these won't change):
            thisPlatform.xMinEdge = -tileW / 2;
            thisPlatform.xMaxEdge = tileW / 2 + ((thisPlatform.width - 1) * tileW);
            thisPlatform.yMinEdge = -tileW / 2;
            thisPlatform.yMaxEdge = tileW / 2 + ((thisPlatform.length - 1) * tileW);
            */



            // temp:


            thisPlatformMovements = determinePlatformIncrements(thisPlatform);

            thisPlatform.dx = thisPlatformMovements[0];
            thisPlatform.dy = thisPlatformMovements[1];
            thisPlatform.dz = thisPlatformMovements[2];


        }
    }




    // fill hero breadcrumb array with herox and heroy:
    for (var i = 0; i < breadCrumbLength; i++) {
        hero.breadcrumb[i] = [hero.tileX, hero.tileY];
    }

    for (var m = 0; m < visibleMaps.length; m++) {
        // initialise items:
        for (var i = 0; i < thisMapData[(visibleMaps[m])].items.length; i++) {
            initialiseItem(thisMapData[(visibleMaps[m])].items[i]);
        }
    }
    activeObjectForDialogue = '';




    // determine tile offset to centre the hero in the centre
    hero.x = getTileCentreCoordX(hero.tileX);
    hero.y = getTileCentreCoordY(hero.tileY);
    hero.z = getElevation(hero.tileX, hero.tileY);

    // initialise fae:
    fae.x = hero.x + tileW * 2;
    fae.y = hero.y + tileH * 2;
    fae.currentState = "hero";
    fae.z = hero.z;
    fae.dz = 1;
    // fae.pulse = 0;
    setupWeather();

    timeSinceLastFrameSwap = 0;
    currentAnimationFrame = 0;
    mapTransition = "in";
    mapTransitionCurrentFrames = 1;
    gameMode = "play";


    if (thisMapData[currentMap].musicOnEnter != '') {
        audio.playMusic(thisMapData[currentMap].musicOnEnter);
    } else {
        //  if music playing - fade out
        if (typeof audio.activeTrack !== "undefined") {
            audio.fadeOutMusic(audio.activeTrack, 6);
        }
    }

    checkForHotspots();
    //  UI.showNotification("<p>I'm just thinking about what a notification looks like&hellip;</p>");

}


function removeMapAssets() {


    for (var i in tileGraphicsToLoad) {
        // remove the on error handler so it doesn't fire when the image is removed:
        tileImages[tileGraphicsToLoad[i]].onerror = '';
        tileImages[tileGraphicsToLoad[i]].src = '';
        delete tileImages[tileGraphicsToLoad[i]];
    }

    for (var i in npcGraphicsToLoad) {
        npcImages[npcGraphicsToLoad[i]].onerror = '';
        npcImages[npcGraphicsToLoad[i]].src = '';
        delete npcImages[npcGraphicsToLoad[i]];
    }
    for (var i in itemGraphicsToLoad) {
        itemImages[itemGraphicsToLoad[i]].onerror = '';
        itemImages[itemGraphicsToLoad[i]].src = '';
        delete itemImages[itemGraphicsToLoad[i]];
    }

    for (var i in backgroundImgs) {
        backgroundImgs[i].onerror = '';
        backgroundImgs[i].src = '';
        // backgroundImgs[i] = null;
        delete backgroundImgs[i];
    }



}


function loadingProgress() {
    // make this graphical where appropriate ####
    //  console.log("loading - " + Loader.getProgress());
}


function changeMaps(doorX, doorY) {
    previousZoneName = thisMapData[currentMap].zoneName;
    gameMode = "mapLoading";
    removeMapAssets();
    if (jumpMapId == null) {
        var doorData = thisMapData[currentMap].doors;
        var whichDoor = doorX + "," + doorY;
        hero.tileX = doorData[whichDoor].startX;
        hero.tileY = doorData[whichDoor].startY;

        newMap = doorData[whichDoor].map;
    } else {
        newMap = jumpMapId;
        jumpMapId = null;
        hero.tileX = doorX;
        hero.tileY = doorY;
    }
    if (hero.tileX != "?") {
        hero.tileX = parseInt(hero.tileX);
    }
    if (hero.tileY != "?") {
        hero.tileY = parseInt(hero.tileY);
    }
    visibleMaps = [];
    loadMap();
}



function tileIsClear(globalTileX, globalTileY) {
    //    var globalTileX = getTileX(x);
    //    var globalTileY = getTileY(y);
    var tileX = getLocalCoordinatesX(globalTileX);
    var tileY = getLocalCoordinatesY(globalTileY);
    if (isOverWorldMap) {
        if ((globalTileX < 0) || (globalTileY < 0) || (globalTileX >= (worldMapTileLength * worldMap[0].length)) || (globalTileY >= (worldMapTileLength * worldMap.length))) {
            return false;
        }
    } else {
        if ((tileX < 0) || (tileY < 0) || (tileX >= mapTilesX) || (tileY >= mapTilesY)) {
            return false;
        }
    }
    var thisMap = findMapNumberFromGlobalCoordinates(globalTileX, globalTileY);


    switch (thisMapData[thisMap].collisions[tileY][tileX]) {
        case 1:
            // is a collision:
            return false;
            break;
        case "<":
        case ">":
        case "^":
        case "v":
            // stairs
            return false;
            break;
        case "d":
            // is a door:
            return false;
            break;
        default:
            //
    }

    // check against hero:
    if (globalTileX == hero.tileX) {
        if (globalTileY == hero.tileY) {
            return false;
        }
    }

    // against items:
    for (var i = 0; i < thisMapData[thisMap].items.length; i++) {
        if (globalTileX == thisMapData[thisMap].items[i].tileX) {
            if (globalTileY == thisMapData[thisMap].items[i].tileY) {
                if (thisMapData[thisMap].items[i].isCollidable) {
                    return false;
                }
            }
        }
    }
    // against NPCs:
    for (var i = 0; i < thisMapData[thisMap].npcs.length; i++) {
        if (thisMapData[thisMap].npcs[i].isCollidable) {
            if (globalTileX == thisMapData[thisMap].npcs[i].tileX) {
                if (globalTileY == thisMapData[thisMap].npcs[i].tileY) {
                    return false;
                }
            }
        }
    }

    // against pets:
    if (hasActivePet) {
        for (var i = 0; i < hero.activePets.length; i++) {
            if (globalTileX == hero.allPets[hero.activePets[i]].tileX) {
                if (globalTileY == hero.allPets[hero.activePets[i]].tileY) {
                    return false;
                }
            }
        }
    }

    return true;
}



function startDoorTransition() {
    if (mapTransition == "") {
        mapTransitionCurrentFrames = 1;
        mapTransition = "out";
        if (activeObjectForDialogue != '') {
            //  dialogue.classList.add("slowerFade");
            dialogue.classList.remove("active");
            UI.removeActiveDialogue();
        }
        if (chestIdOpen != -1) {
            UI.closeChest();
        }
    }
    // if (currentMap < 0) {
    saveCartographyMask();
    // }
    // delete shops so just the new ones can load in
    shopPanel.innerHTML = '';
}



function getHeroAsCloseAsPossibleToObject(objx, objy, objw, objh) {
    switch (hero.facing) {
        case "n":
            hero.y = objy + objh / 2 + hero.length / 2 + 1;
            break;
        case "s":
            hero.y = objy - objh / 2 - hero.length / 2 - 1;
            break;
        case "w":
            hero.x = objx + objw / 2 + hero.width / 2 + 1;
            break;
        case "e":
            hero.x = objx - objw / 2 - hero.width / 2 - 1;
            break;
    }
}

function isOnAPlatform(x, y) {
    var thisPlatform;
    var whichPlatform = -1;
    if (thisMapData[currentMap].movingPlatforms) {
        for (var i = 0; i < thisMapData[currentMap].movingPlatforms.length; i++) {
            thisPlatform = thisMapData[currentMap].movingPlatforms[i];
            if (y >= (thisPlatform.y - tileW / 2)) {
                if (y <= (thisPlatform.y + tileW / 2 + (thisPlatform.length - 1) * tileW)) {
                    if (x >= (thisPlatform.x - tileW / 2)) {
                        if (x <= (thisPlatform.x + tileW / 2 + (thisPlatform.width - 1) * tileW)) {
                            whichPlatform = i;
                            break;
                        }
                    }
                }
            }
        }
    }
    return whichPlatform;
}



function checkHeroCollisions() {
    var topLeftIsOnAPlatform, topRightIsOnAPlatform, bottomLeftIsOnAPlatform, bottomRightIsOnAPlatform, platformIsClear, leadingEdge1OnAPlatform, leadingEdge2OnAPlatform;

    if (key[2]) {
        // up
        leadingEdge1OnAPlatform = isOnAPlatform(hero.x - hero.width / 2, hero.y - hero.length / 2);
        leadingEdge2OnAPlatform = isOnAPlatform(hero.x + hero.width / 2, hero.y - hero.length / 2)
        // make sure both leading edge corners are EITHER on a platform or not colliding with terrain:
        if (((leadingEdge1OnAPlatform > -1) || (!isATerrainCollision(hero.x - hero.width / 2, hero.y - hero.length / 2))) && ((leadingEdge2OnAPlatform > -1) || (!isATerrainCollision(hero.x + hero.width / 2, hero.y - hero.length / 2)))) {} else {
            // leading edge is a collision - check if trailing edge is on a platform (and leading isn't), and nudge hero back onto the platform if so:
            if ((isOnAPlatform(hero.x - hero.width / 2, hero.y + hero.length / 2) > -1) && (isOnAPlatform(hero.x + hero.width / 2, hero.y + hero.length / 2) > -1)) {
                if ((leadingEdge1OnAPlatform == -1) && (leadingEdge2OnAPlatform == -1)) {
                    hero.y = thisMapData[currentMap].movingPlatforms[isOnAPlatform(hero.x - hero.width / 2, hero.y + hero.length / 2)].y - (tileW / 2) + (hero.length / 2) + 1;
                }
            } else {
                // platform not involved - find the tile's bottom edge
                var tileCollidedWith = getTileY(hero.y - hero.length / 2);

                var tileBottomEdge = (tileCollidedWith + 1) * tileW;
                // use the +1 to make sure it's just clear of the collision tile
                hero.y = tileBottomEdge + hero.length / 2 + 1;
            }
        }
    }

    if (key[3]) {
        // down
        leadingEdge1OnAPlatform = isOnAPlatform(hero.x - hero.width / 2, hero.y + hero.length / 2);
        leadingEdge2OnAPlatform = isOnAPlatform(hero.x + hero.width / 2, hero.y + hero.length / 2);
        if (((leadingEdge1OnAPlatform > -1) || (!isATerrainCollision(hero.x - hero.width / 2, hero.y + hero.length / 2))) && ((leadingEdge2OnAPlatform > -1) || (!isATerrainCollision(hero.x + hero.width / 2, hero.y + hero.length / 2)))) {} else {
            // leading edge is a collision - check if trailing edge is on a platform, and nudge hero back onto the platform if so:
            if ((isOnAPlatform(hero.x - hero.width / 2, hero.y - hero.length / 2) > -1) && (isOnAPlatform(hero.x + hero.width / 2, hero.y - hero.length / 2) > -1)) {
                if ((leadingEdge1OnAPlatform == -1) && (leadingEdge2OnAPlatform == -1)) {
                    hero.y = (thisMapData[currentMap].movingPlatforms[isOnAPlatform(hero.x - hero.width / 2, hero.y - hero.length / 2)].y + tileW / 2 + (thisMapData[currentMap].movingPlatforms[isOnAPlatform(hero.x - hero.width / 2, hero.y - hero.length / 2)].length - 1) * tileW) - (hero.length / 2) - 1;
                }
            } else {
                // platform not involved - find the tile's bottom edge
                var tileCollidedWith = getTileY(hero.y + hero.length / 2);
                var tileTopEdge = (tileCollidedWith) * tileW;
                hero.y = tileTopEdge - hero.length / 2 - 1;
            }
        }
    }

    if (key[0]) {
        // left/west
        leadingEdge1OnAPlatform = isOnAPlatform(hero.x - hero.width / 2, hero.y + hero.length / 2);
        leadingEdge2OnAPlatform = isOnAPlatform(hero.x - hero.width / 2, hero.y - hero.length / 2);
        if (((leadingEdge1OnAPlatform > -1) || (!isATerrainCollision(hero.x - hero.width / 2, hero.y + hero.length / 2))) && ((leadingEdge2OnAPlatform > -1) || (!isATerrainCollision(hero.x - hero.width / 2, hero.y - hero.length / 2)))) {} else {
            // leading edge is a collision - check if trailing edge is on a platform, and nudge hero back onto the platform if so:
            if ((isOnAPlatform(hero.x + hero.width / 2, hero.y - hero.length / 2) > -1) && (isOnAPlatform(hero.x + hero.width / 2, hero.y + hero.length / 2) > -1)) {
                if ((leadingEdge1OnAPlatform == -1) && (leadingEdge2OnAPlatform == -1)) {
                    hero.x = thisMapData[currentMap].movingPlatforms[isOnAPlatform(hero.x + hero.width / 2, hero.y - hero.length / 2)].x - tileW / 2 + (hero.length / 2) + 1;
                }
            } else {
                // platform not involved - find the tile's bottom edge
                var tileCollidedWith = getTileX(hero.x - hero.width / 2);
                var tileRightEdge = (tileCollidedWith + 1) * tileW;
                hero.x = tileRightEdge + hero.width / 2 + 1;
            }
        }
    }

    if (key[1]) {
        //right/east
        leadingEdge1OnAPlatform = isOnAPlatform(hero.x + hero.width / 2, hero.y + hero.length / 2);
        leadingEdge2OnAPlatform = isOnAPlatform(hero.x + hero.width / 2, hero.y - hero.length / 2);
        if (((leadingEdge1OnAPlatform > -1) || (!isATerrainCollision(hero.x + hero.width / 2, hero.y + hero.length / 2))) && ((leadingEdge2OnAPlatform > -1) || (!isATerrainCollision(hero.x + hero.width / 2, hero.y - hero.length / 2)))) {} else {
            // leading edge is a collision - check if trailing edge is on a platform, and nudge hero back onto the platform if so:
            if ((isOnAPlatform(hero.x - hero.width / 2, hero.y - hero.length / 2) > -1) && (isOnAPlatform(hero.x - hero.width / 2, hero.y + hero.length / 2) > -1)) {
                if ((leadingEdge1OnAPlatform == -1) && (leadingEdge2OnAPlatform == -1)) {
                    hero.x = thisMapData[currentMap].movingPlatforms[isOnAPlatform(hero.x - hero.width / 2, hero.y - hero.length / 2)].x + tileW / 2 + ((thisMapData[currentMap].movingPlatforms[isOnAPlatform(hero.x - hero.width / 2, hero.y - hero.length / 2)].width - 1) * tileW) - (hero.length / 2) - 1;
                }
            } else {
                // platform not involved - find the tile's bottom edge
                var tileCollidedWith = getTileX(hero.x + hero.width / 2);
                var tileLeftEdge = (tileCollidedWith) * tileW;
                hero.x = tileLeftEdge - hero.width / 2 - 1;
            }
        }
    }

    // determine if platforms are free to move:
    if (thisMapData[currentMap].movingPlatforms) {
        for (var i = 0; i < thisMapData[currentMap].movingPlatforms.length; i++) {
            thisMapData[currentMap].movingPlatforms[i].canMove = true;
        }
    }
    topLeftIsOnAPlatform = isOnAPlatform(hero.x - hero.width / 2, hero.y - hero.length / 2);
    topRightIsOnAPlatform = isOnAPlatform(hero.x + hero.width / 2, hero.y - hero.length / 2);
    bottomLeftIsOnAPlatform = isOnAPlatform(hero.x - hero.width / 2, hero.y + hero.length / 2);
    bottomRightIsOnAPlatform = isOnAPlatform(hero.x + hero.width / 2, hero.y + hero.length / 2);

    if (topLeftIsOnAPlatform >= 0) {
        platformIsClear = (topLeftIsOnAPlatform == bottomLeftIsOnAPlatform && bottomLeftIsOnAPlatform == topRightIsOnAPlatform && topRightIsOnAPlatform == bottomRightIsOnAPlatform);
    }

    if (platformIsClear) {
        if (topLeftIsOnAPlatform >= 0) {
            hero.x += thisMapData[currentMap].movingPlatforms[topLeftIsOnAPlatform].dx;
            hero.y += thisMapData[currentMap].movingPlatforms[topLeftIsOnAPlatform].dy;
            hero.z += thisMapData[currentMap].movingPlatforms[topLeftIsOnAPlatform].dz;
        }
    } else {
        if (topLeftIsOnAPlatform >= 0) {
            thisMapData[currentMap].movingPlatforms[topLeftIsOnAPlatform].canMove = false;
        }
        if (topRightIsOnAPlatform >= 0) {
            thisMapData[currentMap].movingPlatforms[topRightIsOnAPlatform].canMove = false;
        }
        if (bottomLeftIsOnAPlatform >= 0) {
            thisMapData[currentMap].movingPlatforms[bottomLeftIsOnAPlatform].canMove = false;
        }
        if (bottomRightIsOnAPlatform >= 0) {
            thisMapData[currentMap].movingPlatforms[bottomRightIsOnAPlatform].canMove = false;
        }
    }


    var thisNPC, thisItem;

    for (var m = 0; m < visibleMaps.length; m++) {
        whichVisibleMap = visibleMaps[m];


        // check for collisions against NPCs:
        for (var i = 0; i < thisMapData[whichVisibleMap].npcs.length; i++) {
            thisNPC = thisMapData[whichVisibleMap].npcs[i];
            if (thisNPC.isCollidable) {
                if (isAnObjectCollision(thisNPC.x, thisNPC.y, thisNPC.width, thisNPC.length, hero.x, hero.y, hero.width, hero.length)) {
                    getHeroAsCloseAsPossibleToObject(thisNPC.x, thisNPC.y, thisNPC.width, thisNPC.length);
                }
            }
        }

        // check for collisions against items:
        for (var i = 0; i < thisMapData[whichVisibleMap].items.length; i++) {
            thisItem = thisMapData[whichVisibleMap].items[i];
            if (thisItem.isCollidable) {
                if (isAnObjectCollision(thisItem.x, thisItem.y, thisItem.width, thisItem.length, hero.x, hero.y, hero.width, hero.length)) {
                    getHeroAsCloseAsPossibleToObject(thisItem.x, thisItem.y, thisItem.width, thisItem.length);
                }
            }
        }


    }

    // check against pets:
    if (hasActivePet) {
        for (var i = 0; i < hero.activePets.length; i++) {
            if (isAnObjectCollision(hero.allPets[hero.activePets[i]].x, hero.allPets[hero.activePets[i]].y, hero.allPets[hero.activePets[i]].width, hero.allPets[hero.activePets[i]].length, hero.x, hero.y, hero.width, hero.length)) {
                getHeroAsCloseAsPossibleToObject(hero.allPets[hero.activePets[i]].x, hero.allPets[hero.activePets[i]].y, hero.allPets[hero.activePets[i]].width, hero.allPets[hero.activePets[i]].length);
                pushPetAway(i);

            }
        }
    }

    // check for inner doors:
    if (typeof thisMapData[currentMap].innerDoors !== "undefined") {
        var thisInnerDoor;
        for (var i in thisMapData[currentMap].innerDoors) {
            thisInnerDoor = thisMapData[currentMap].innerDoors[i];
            if (!thisInnerDoor.isOpen) {
                if (isAnObjectCollision(getTileCentreCoordX(thisInnerDoor.tileX), getTileCentreCoordY(thisInnerDoor.tileY), tileW, tileW, hero.x, hero.y, hero.width, hero.length)) {
                    if (thisInnerDoor.isLocked) {
                        // check for key
                        var hasInnerDoorKey = hero.currency.keys.indexOf(i);
                        if (hasInnerDoorKey != -1) {
                            unlockInnerDoor(i);
                            openInnerDoor(i);
                            hero.currency.keys.splice(hasInnerDoorKey, 1);
                            UI.updateCurrencies();
                        }
                    } else {
                        openInnerDoor(i);
                    }
                    getHeroAsCloseAsPossibleToObject(getTileCentreCoordX(thisInnerDoor.tileX), getTileCentreCoordY(thisInnerDoor.tileY), tileW, tileW);
                }
            }
        }
    }
}

function updateSurroundingGameWorld() {
    // keep the surrounding game world running:
    var now = window.performance.now();
    hero.totalGameTimePlayed++;
    var elapsed = (now - lastTime);
    lastTime = now;
    timeSinceLastFrameSwap += elapsed;
    if (timeSinceLastFrameSwap > animationUpdateTime) {
        currentAnimationFrame++;
        timeSinceLastFrameSwap = 0;
        animateFae();
    }
    moveFae();
    moveNPCs();
    movePet();
    movePlatforms();
    updateItems();
    audio.checkForAmbientSounds();
    checkForRespawns();
    UI.updateCooldowns();
    // only need to draw if the game board doesn't cover the screen: ####
    draw();
}

function gameLoop() {
    switch (gameMode) {
        case "mapLoading":
            // console.log("loading map assets...");
            break;
        case "cardGame":
            cardGameNameSpace.update();
            cardGameNameSpace.draw();
            updateSurroundingGameWorld();
            break;
        case "hnefataflGame":
            hnefataflNameSpace.update();
            hnefataflNameSpace.draw();
            updateSurroundingGameWorld();
            break;
        case "housing":
            housingNameSpace.update();
            updateSurroundingGameWorld();
            break;
        case "play":
            update();
            draw();
            break;
    }
    window.requestAnimationFrame(gameLoop);
}

function moveHeroTowards(xCoord, yCoord) {
    // eg. from drag on mobile 
    var xDiff = xCoord - (availableScreenWidth / 2);
    var yDiff = yCoord - (availableScreenHeight / 2);
    // run if the dragged distance is further from the hero:
    key[5] = false;
    if ((Math.abs(xDiff) > (availableScreenWidth / 4)) || (Math.abs(yDiff) > (availableScreenHeight / 4))) {
        key[5] = true;
    }
    key[0] = false;
    key[1] = false;
    key[2] = false;
    key[3] = false;
    if (xDiff < 0) {
        if (yDiff < 0) {

            key[0] = 1;
        } else {

            key[3] = 1;
        }
    } else {
        if (yDiff < 0) {

            key[2] = 1;
        } else {

            key[1] = 1;
        }
    }
}

function update() {
    checkForGamePadInput();
    var now = window.performance.now();
    hero.totalGameTimePlayed++;
    var elapsed = (now - lastTime);
    lastTime = now;
    hero.isMoving = false;
    //oldHeroX = hero.x;
    //oldHeroY = hero.y;
    var thisSpeed = hero.speed;
    if (key[5]) {
        thisSpeed *= 2;
    }
    if (mapTransition != "out") {
        // Handle the Input
        if (key[2]) {
            hero.isMoving = true;
            hero.facing = 'n';
            hero.y -= thisSpeed;
        } else if (key[3]) {
            hero.isMoving = true;
            hero.facing = 's';
            hero.y += thisSpeed;
        } else if (key[1]) {
            hero.isMoving = true;
            hero.facing = 'e';
            hero.x += thisSpeed;
        } else if (key[0]) {
            hero.isMoving = true;
            hero.facing = 'w';
            hero.x -= thisSpeed;
        }
        if (key[4]) {
            checkForActions();
        }
        if (key[6]) {
            checkForChallenges();
        }
        if (key[7]) {
            UI.toggleUI();
            key[7] = false;
        }
        if (key[8]) {
            UI.toggleJournal();
            key[8] = false;
        }
        if (key[9]) {
            UI.moveQuickHold(-1);
            key[9] = false;
        }
        if (key[10]) {
            UI.moveQuickHold(1);
            key[10] = false;
        }

        if (key[11]) {
            printScreen();
            key[11] = false;
        }
        if (key[12]) {
            // escape - cancel any active actions:
            switch (activeAction) {
                case "plotPlacement":
                    document.removeEventListener("mousemove", UI.movePlotPlacementOverlay, false);
                    document.removeEventListener("click", placePlotPlacement, false);
                    break;
                case "survey":
                    surveyingStopped();
                    break;
                case "gather":
                    gatheringPanel.classList.remove("active");
                    gatheringStopped();
                    break;
            }
            activeAction = "";

            key[12] = false;
        }

        //  checkForWorldWrap(hero);
        checkHeroCollisions();

        var heroOldX = hero.tileX;
        var heroOldY = hero.tileY;
        var chestIdSplit;
        hero.tileX = getTileX(hero.x);
        hero.tileY = getTileY(hero.y);
        checkForSlopes(hero);
        if ((hero.tileX != heroOldX) || (hero.tileY != heroOldY)) {
            heroIsInNewTile();
        }
        // check to see if a dialogue balloon is open, and if the hero has moved far from the NPC:
        if (activeObjectForDialogue != '') {
            if (activeObjectForDialogue != null) {
                if (!(isInRange(hero.x, hero.y, activeObjectForDialogue.x, activeObjectForDialogue.y, closeDialogueDistance))) {
                    dialogue.classList.add("slowerFade");
                    dialogue.classList.remove("active");
                    // close the shop
                    if (shopCurrentlyOpen != -1) {
                        activeObjectForDialogue.speechIndex = 0;
                        UI.closeShop();
                    }
                    // close the accept/decline buttons as well in case they're open:
                    acceptQuestChoice.classList.remove('active');
                    // only remove this after dialogue has faded out completely:
                    dialogue.addEventListener(whichTransitionEvent, UI.removeActiveDialogue, false);
                }
            }
        }
        // check if a chest is open and close it if so:
        if (chestIdOpen != -1) {
            chestIdSplit = chestIdOpen.split("-");
            if (!(isInRange(hero.x, hero.y, thisMapData[chestIdSplit[1]].items[chestIdSplit[0]].x, thisMapData[chestIdSplit[1]].items[chestIdSplit[0]].y, closeDialogueDistance / 2))) {
                UI.closeChest();
            }
        }
        if (activeAction == "gather") {

            if (!(isInRange(hero.x, hero.y, gathering.itemObject.x, gathering.itemObject.y, closeDialogueDistance / 2))) {
                gatheringPanel.classList.remove("active");
                gatheringStopped();
            }
        }
        if (postObject.active) {
            if (!(isInRange(hero.x, hero.y, postObject.x, postObject.y, closeDialogueDistance / 2))) {

                UI.closePost();
            }
        }
        if (retinueObject.active) {
            if (!(isInRange(hero.x, hero.y, retinueObject.x, retinueObject.y, closeDialogueDistance / 2))) {

                UI.closeRetinuePanel();

            }
        }





    } else {
        if (jumpMapId == null) {
            // if jumping maps (eg with a home stone, then don't walk forwards)
            hero.isMoving = true;
            // continue the hero moving:
            switch (hero.facing) {
                case 'n':
                    hero.y -= thisSpeed;
                    break;
                case 's':
                    hero.y += thisSpeed;
                    break;
                case 'e':
                    hero.x += thisSpeed;
                    break;
                case 'w':
                    hero.x -= thisSpeed;
                    break;
            }
        }
        mapTransitionCurrentFrames += 2;
        if (mapTransitionCurrentFrames >= mapTransitionMaxFrames) {
            changeMaps(activeDoorX, activeDoorY);
        }
    }
    if (mapTransition == "in") {
        // make it transition in faster:
        mapTransitionCurrentFrames += 2;
        if (mapTransitionCurrentFrames >= mapTransitionMaxFrames) {
            mapTransition = "";
            activeDoorX = -1;
            activeDoorY = -1;
        }
    }
    timeSinceLastFrameSwap += elapsed;
    if (timeSinceLastFrameSwap > animationUpdateTime) {
        currentAnimationFrame++;
        timeSinceLastFrameSwap = 0;
        animateFae();
    }
    if (hero.isMoving) {
        if (key[5]) {
            hero.currentAnimation = 'run';
        } else {
            hero.currentAnimation = 'walk';
        }
    } else {
        hero.currentAnimation = 'idle';
    }
    moveFae();
    moveNPCs();
    movePet();
    movePlatforms();
    updateItems();
    checkForWeatherChange();
    audio.checkForAmbientSounds();
    checkForRespawns();
    UI.updateCooldowns();
    if (activeAction == "gather") {
        processGathering();
    }
    if (activeAction == "dowse") {
        processDowsing();
    }
    if (activeAction == "survey") {
        processSurveying();
    }
    if (retinueObject.active) {
        UI.updateRetinueTimers();
    }
    if (craftingObject.isCreating) {
        processCrafting();
    }
}





function updateVisibleMaps() {

    // left screen edge would be hero.isox - (canvasWidth/2) but use full screen width to allow for padding and loading in before visible
    var leftEdgeIso = hero.isox - canvasWidth;
    var topEdgeIso = hero.isoy - canvasHeight;
    var rightEdgeIso = hero.isox + canvasWidth;
    var bottomEdgeIso = hero.isoy + canvasHeight;

    var leftEdge2D = find2DCoordsX(leftEdgeIso, hero.isoy);
    var topEdge2D = find2DCoordsY(hero.isox, topEdgeIso);
    var rightEdge2D = find2DCoordsX(rightEdgeIso, hero.isoy);
    var bottomEdge2D = find2DCoordsY(hero.isox, bottomEdgeIso);

    var mapDimension2D = worldMapTileLength * tileW;

    var leftEdgeMapPos = Math.floor(leftEdge2D / mapDimension2D);
    var topEdgeMapPos = Math.floor(topEdge2D / mapDimension2D);
    var rightEdgeMapPos = Math.floor(rightEdge2D / mapDimension2D);
    var bottomEdgeMapPos = Math.floor(bottomEdge2D / mapDimension2D);

    var newVisibleMaps = [];

    var isValid;
    for (var i = leftEdgeMapPos; i <= rightEdgeMapPos; i++) {
        for (var j = topEdgeMapPos; j <= bottomEdgeMapPos; j++) {
            isValid = false;
            if (typeof worldMap[j] !== "undefined") {
                if (typeof worldMap[j][i] !== "undefined") {
                    isValid = true;
                }
            }

            if (isValid) {
                newVisibleMaps.push(worldMap[j][i]);
            }

        }
    }

    // check for differences in visibleMaps array and load any new




    // https://stackoverflow.com/questions/1187518/how-to-get-the-difference-between-two-arrays-in-javascript
    var newMapsToLoad = newVisibleMaps.filter(function(i) { return visibleMaps.indexOf(i) < 0; });



    //console.log("new maps:",newMapsToLoad);
    for (var i = 0; i < newMapsToLoad.length; i++) {
        // console.log("loading in new map #"+newMapsToLoad[i]);
        loadNewVisibleMap(newMapsToLoad[i]);

    }

    // and unload any not required now
    // ####

}

function checkForHotspots() {
    var thisHotspot, thisTileCentreX, thisTileCentreY;
    // check for hotspots:
    for (var i = 0; i < thisMapData[currentMap].hotspots.length; i++) {
        thisHotspot = thisMapData[currentMap].hotspots[i];
        thisTileCentreX = getTileCentreCoordX(thisHotspot.centreX);
        thisTileCentreY = getTileCentreCoordY(thisHotspot.centreY);
        if (isInRange(hero.x, hero.y, thisTileCentreX, thisTileCentreY, thisHotspot.radius * tileW)) {
            if (typeof thisHotspot.quest !== "undefined") {
                if (questData[thisHotspot.quest].hasBeenActivated < 1) {
                    UI.showNotification("<p>" + thisHotspot.message + "</p>");
                }
                questData[thisHotspot.quest].hasBeenActivated = 1;
            }
            if (typeof thisHotspot.music !== "undefined") {
                audio.playMusic(thisHotspot.music);
            }
            if (typeof thisHotspot.weather !== "undefined") {
                changeWeather(thisHotspot.weather);
            }
            if (typeof thisHotspot.openInnerDoor !== "undefined") {
                unlockInnerDoor(thisHotspot.openInnerDoor);
                openInnerDoor(thisHotspot.openInnerDoor);
            }
            if (typeof thisHotspot.closeInnerDoor !== "undefined") {
                closeInnerDoor(thisHotspot.closeInnerDoor);
            }
            if (typeof thisHotspot.toggleInnerDoor !== "undefined") {
                toggleInnerDoor(thisHotspot.toggleInnerDoor);
            }
            if (typeof thisHotspot.remove !== "undefined") {
                // remove this hotspot now it's been triggered:
                thisMapData[currentMap].hotspots.splice(i, 1);
                i--;
            }
        }

        if (fae.currentState == "hero") {
            // check if the fae should react to this one:
            if (typeof thisHotspot.faeIgnore === "undefined") {
                // check it's not recently visited this hotspot:
                if (fae.recentHotspots.indexOf(i) === -1) {
                    if (isInRange(fae.x, fae.y, thisTileCentreX, thisTileCentreY, fae.range)) {
                        if (hasLineOfSight(getTileX(fae.x), getTileX(fae.y), thisHotspot.centreX, thisHotspot.centreY)) {
                            fae.targetX = thisTileCentreX;
                            fae.targetY = thisTileCentreY;
                            // add this to the list of hotspots so it doesn't return to it again and again:
                            fae.recentHotspots.push(i);
                            fae.currentState = "away";
                        }
                    }
                }
            }
        }
    }
}




function heroIsInNewTile() {
    //  hero.z = getElevation(hero.tileX, hero.tileY);

    //  updateCartographicMiniMap();
    if (isOverWorldMap) {
        currentMap = findMapNumberFromGlobalCoordinates(hero.tileX, hero.tileY);

        updateVisibleMaps();
    }


    checkForHotspots();

    if (fae.currentState == "wait") {
        // check if hero has moved far away, and return if so:
        if (!(isInRange(fae.x, fae.y, hero.x, hero.y, fae.abandonRadius))) {
            if (hasLineOfSight(getTileX(fae.x), getTileX(fae.y), hero.tileX, hero.tileY)) {
                fae.currentState = "hero";
            }
        }
    }

    // update the hero's breadcrub trail:
    hero.breadcrumb.pop();
    hero.breadcrumb.unshift([hero.tileX, hero.tileY]);
    if (thisMapData[currentMap].showOnlyLineOfSight) {
        updateLightMap();
    }

    if (thisMapData[currentMap].collisions[getLocalCoordinatesY(hero.tileY)][getLocalCoordinatesX(hero.tileX)] == "d") {
        activeDoorX = hero.tileX;
        activeDoorY = hero.tileY;
        startDoorTransition();
    }
    if (activeAction == "survey") {
        surveyingStopped();
    }
}


function openInnerDoor(whichInnerDoor) {
    // animation ######
    thisMapData[currentMap].innerDoors[whichInnerDoor]['isOpen'] = true;
    if (thisMapData[currentMap].showOnlyLineOfSight) {
        updateLightMap();
    }
}

function closeInnerDoor(whichInnerDoor) {
    // make sure nothing's blocking the door (as it would become stuck):
    if (tileIsClear(thisMapData[currentMap].innerDoors[whichInnerDoor]['tileX'], thisMapData[currentMap].innerDoors[whichInnerDoor]['tileY'])) {
        thisMapData[currentMap].innerDoors[whichInnerDoor]['isOpen'] = false;
        if (thisMapData[currentMap].showOnlyLineOfSight) {
            updateLightMap();
        }
    }
}

function toggleInnerDoor(whichInnerDoor) {
    // make sure nothing's blocking the door (as it would become stuck):
    if (tileIsClear(thisMapData[currentMap].innerDoors[whichInnerDoor]['tileX'], thisMapData[currentMap].innerDoors[whichInnerDoor]['tileY'])) {
        thisMapData[currentMap].innerDoors[whichInnerDoor]['isOpen'] = !(thisMapData[currentMap].innerDoors[whichInnerDoor]['isOpen']);
        if (thisMapData[currentMap].showOnlyLineOfSight) {
            updateLightMap();
        }
    }
}

function unlockInnerDoor(whichInnerDoor) {
    audio.playSound(soundEffects['unlock'], 0);
    thisMapData[currentMap].innerDoors[whichInnerDoor]['isLocked'] = false;
    if (thisMapData[currentMap].showOnlyLineOfSight) {
        updateLightMap();
    }
    // play sound ####
}


function getCatalogueMarkup(itemIds, catalogueName) {
    getJSON('http://develop.ae/game-world/getCatalogueContents.php?itemIds=' + itemIds + '&name=' + catalogueName, function(data) {
        catalogueQuestPanels.insertAdjacentHTML('beforeend', data.markup);
        audio.playSound(soundEffects['bookOpen'], 0);
    }, function(status) {
        // try again:
        getCatalogueMarkup(itemIds, catalogueName);
    });
}

function usedActiveTool() {
    var usedToolSuccessfully = false;
    if (hero.holding.type != "") {
        var armsReachTileX = hero.tileX + relativeFacing[hero.facing]["x"]
        var armsReachTileY = hero.tileY + relativeFacing[hero.facing]["y"]
        switch (currentActiveInventoryItems[hero.holding.type].action) {
            case "till":
                // check for any treasure:
                var treasureCoordinates, treasureCentreX, treasureCentreY, tryFacing, facingsRemaining, sourceTileX, sourceTileY, thisChest, thisChestsMap;
                var foundTreasure = false;
                for (var i = 0; i < hero.activeTreasureMaps.length; i++) {
                    treasureCoordinates = hero.activeTreasureMaps[i].split("_");
                    if (getPythagorasDistance(hero.tileX, hero.tileY, treasureCoordinates[0], treasureCoordinates[1]) < 2) {
                        // add chest:
                        thisChest = {
                            "type": 48,
                            "contains": [{
                                    "type": 6
                                },
                                {
                                    "type": 2
                                },
                                {
                                    "type": "$",
                                    "quantity": 5000
                                }
                            ]
                        };

                        tryFacing = hero.facing;
                        switch (tryFacing) {
                            case 'n':
                                facingsRemaining = ['e', 'w', 's'];
                                break;
                            case 'e':
                                facingsRemaining = ['n', 's', 'w'];
                                break;
                            case 's':
                                facingsRemaining = ['n', 's', 'e'];
                                break;
                            case 'w':
                                facingsRemaining = ['e', 'w', 'n'];
                                break;
                        }
                        do {
                            sourceTileX = hero.tileX + relativeFacing[tryFacing]["x"];
                            sourceTileY = hero.tileY + relativeFacing[tryFacing]["y"];
                            tryFacing = facingsRemaining.shift();
                        } while (!tileIsClear(sourceTileX, sourceTileY) && (facingsRemaining.length > 0));
                        if (facingsRemaining.length > 0) {
                            // build chest:
                            thisChest.tileX = sourceTileX;
                            thisChest.tileY = sourceTileY;
                            thisChestsMap = findMapNumberFromGlobalCoordinates(sourceTileX, sourceTileY);
                            thisMapData[thisChestsMap].items.push(thisChest);
                            initialiseItem(thisMapData[thisChestsMap].items[thisMapData[thisChestsMap].items.length - 1]);
                            // find the map item in the inventory and remove that as well:
                            for (var key in hero.inventory) {
                                console.log(hero.inventory[key].contains + " == " + hero.activeTreasureMaps[i]);
                                if (hero.inventory[key].contains == hero.activeTreasureMaps[i]) {
                                    delete hero.inventory[key];
                                    document.getElementById("slot" + key).innerHTML = '';
                                }
                            }
                            // hide the treasure map panel:
                            document.getElementById('treasureMap' + hero.activeTreasureMaps[i]).classList.remove("active");
                            hero.activeTreasureMaps.splice(i, 1);
                            audio.playSound(soundEffects['foundChest'], 0);
                            foundTreasure = true;
                            usedToolSuccessfully = true;
                        } else {
                            console.log("couldn't place chest");
                        }
                    }

                }
                if (!foundTreasure) {
                    if (successfullyTilledEarth(armsReachTileX, armsReachTileY)) {
                        usedToolSuccessfully = true;
                    }
                }
                break;
            case "seed":
                if (successfullyPlantSeed(armsReachTileX, armsReachTileY)) {
                    usedToolSuccessfully = true;
                }
                break;
            case "holds-liquid":
                // check if next to a water source first: 
                var foundSource = false;
                var holdingItemsSlot = findSlotByHash(hero.holding.hash);
                var itemInFront = findItemWithinArmsLength();
                if (itemInFront != null) {

                    if (currentActiveInventoryItems[itemInFront.type].action == "source") {
                        foundSource = true;
                        // fill it (make the actionValue maximum value) with the thing that this contains (defined by actionValue):
                        hero.inventory[holdingItemsSlot].contains[0].type = currentActiveInventoryItems[itemInFront.type].actionValue;
                        hero.inventory[holdingItemsSlot].contains[0].quantity = currentActiveInventoryItems[(hero.inventory[holdingItemsSlot].type)].actionValue;
                        audio.playSound(soundEffects['pouring'], 0);
                        updateGauge(holdingItemsSlot);
                        UI.updateHeldItemGauge();
                    }
                }
                if (!foundSource) {
                    pourLiquid(armsReachTileX, armsReachTileY);
                }
                usedToolSuccessfully = true;
                break;
        }
    }
    return usedToolSuccessfully;
}


function checkForActions() {
    // check to see if a tool is equipped, and can be used:
    if (!usedActiveTool()) {
        var inventoryCheck = [];
        var slotMarkup, thisSlotsId, thisSlotElem, thisNPC;
        for (var m = 0; m < visibleMaps.length; m++) {
            for (var i = 0; i < thisMapData[(visibleMaps[m])].items.length; i++) {
                if (isInRange(hero.x, hero.y, thisMapData[(visibleMaps[m])].items[i].x, thisMapData[(visibleMaps[m])].items[i].y, (thisMapData[(visibleMaps[m])].items[i].width / 2 + hero.width / 2 + 6))) {
                    if (isFacing(hero, thisMapData[(visibleMaps[m])].items[i])) {
                        var actionValue = currentActiveInventoryItems[thisMapData[(visibleMaps[m])].items[i].type].actionValue;

                        switch (currentActiveInventoryItems[thisMapData[(visibleMaps[m])].items[i].type].action) {
                            case "static":
                                // can't interact with it - do nothing
                                break;
                            case "nest":
                                // can't interact with it - do nothing
                                break;
                            case "sound":
                                audio.playSound(soundEffects[actionValue], 0);
                                break;
                            case "questToggle":
                                // toggle value: (1 or 0)
                                questData[actionValue].hasBeenActivated = Math.abs(questData[actionValue].hasBeenActivated - 1);
                                break;
                            case "questSet":
                                questData[actionValue].hasBeenActivated = 1;
                                break;
                            case "questUnset":
                                questData[actionValue].hasBeenActivated = 0;
                                break;
                            case "node":
                                // handled by Action Bar - no effect here
                                break;
                            case "toggleInnerDoor":
                                toggleInnerDoor(thisMapData[(visibleMaps[m])].items[i].additional);
                                audio.playSound(soundEffects['lever'], 0);
                                // toggle the visual state:
                                thisMapData[(visibleMaps[m])].items[i].state = thisMapData[(visibleMaps[m])].items[i].state == "on" ? 'off' : 'on';
                                break;
                            case "openInnerDoor":
                                openInnerDoor(thisMapData[(visibleMaps[m])].items[i].additional);
                                break;
                            case "closeInnerDoor":
                                closeInnerDoor(thisMapData[(visibleMaps[m])].items[i].additional);
                                break;
                            case "key":
                                hero.currency.keys.push(thisMapData[(visibleMaps[m])].items[i].additional);
                                UI.updateCurrencies();
                                audio.playSound(soundEffects['keys'], 0);
                                // remove from map:
                                thisMapData[(visibleMaps[m])].items.splice(i, 1);
                                break;
                            case "gate":
                                // toggle the visual state:
                                thisMapData[(visibleMaps[m])].items[i].state = thisMapData[(visibleMaps[m])].items[i].state == "open" ? 'closed' : 'open';
                                // toggle whether it will have collision done against it:
                                thisMapData[(visibleMaps[m])].items[i].isCollidable = thisMapData[(visibleMaps[m])].items[i].isCollidable == true ? false : true;
                                break;
                            case "notice":
                                processSpeech(thisMapData[(visibleMaps[m])].items[i], thisMapData[(visibleMaps[m])].items[i].contains[0][0], thisMapData[(visibleMaps[m])].items[i].contains[0][1], false, thisMapData[(visibleMaps[m])].items[i].contains[0][2]);
                                break;
                            case "sit":
                                hero.facing = thisMapData[(visibleMaps[m])].items[i].facing;
                                console.log("switch to sit animation");
                                break;
                            case "chest":
                                // open chest and show contents:
                                UI.openChest(visibleMaps[m], i);
                                break;
                            case "post":
                                // open the Post panel:
                                UI.openPost(thisMapData[(visibleMaps[m])].items[i].x, thisMapData[(visibleMaps[m])].items[i].y);
                                break;
                            case "retinue":
                                // open the Retinue panel:
                                UI.openRetinuePanel(thisMapData[(visibleMaps[m])].items[i]);
                                break;
                            case "source":
                                // don't do anything - the equipped item will check for this item
                                break;
                            case "crop":
                                checkCrop(thisMapData[(visibleMaps[m])].items[i]);
                                break;
                            default:
                                // try and pick it up:
                                var canBePickedUp = true;
                                if (thisMapData[(visibleMaps[m])].items[i].lockedToPlayerId) {
                                    if (thisMapData[(visibleMaps[m])].items[i].lockedToPlayerId != characterId) {
                                        canBePickedUp = false;
                                    }
                                }
                                if (canBePickedUp) {
                                    inventoryCheck = canAddItemToInventory([prepareInventoryObject(thisMapData[(visibleMaps[m])].items[i])]);
                                    if (inventoryCheck[0]) {
                                        // remove from map:
                                        thisMapData[(visibleMaps[m])].items.splice(i, 1);
                                        UI.showChangeInInventory(inventoryCheck[1]);
                                    } else {
                                        UI.showNotification("<p>I don't have room in my bags for that</p>");
                                    }
                                } else {
                                    UI.showNotification("<p>I can't pick that up</p>");
                                }
                        }
                    }
                }
            }

            // loop through NPCs:
            for (var i = 0; i < thisMapData[(visibleMaps[m])].npcs.length; i++) {
                thisNPC = thisMapData[(visibleMaps[m])].npcs[i];
                if (thisNPC.speech) {
                    //     if (isInRange(hero.x, hero.y, thisNPC.x, thisNPC.y, (thisNPC.width + hero.width))) {
                    if (isInRange(hero.x, hero.y, thisNPC.x, thisNPC.y, (thisNPC.reactionRange * tileW))) {
                        if (isFacing(hero, thisNPC)) {
                            // if at the end of the NPC's speech list, or the dialogue isn't part of the NPC's normal speech list, then close the balloon with an action click:
                            if ((thisNPC.speechIndex >= thisNPC.speech.length) || (canCloseDialogueBalloonNextClick && activeObjectForDialogue == thisNPC)) {
                                thisNPC.speechIndex = 0;
                                dialogue.classList.remove("active");
                                activeObjectForDialogue = '';
                                canCloseDialogueBalloonNextClick = false;
                                if (shopCurrentlyOpen != -1) {
                                    UI.closeShop();
                                }

                            } else {
                                var thisSpeech = thisNPC.speech[thisNPC.speechIndex][0];
                                var thisSpeechCode = thisNPC.speech[thisNPC.speechIndex][1];
                                thisNPC.drawnFacing = turntoFace(thisNPC, hero);
                                processSpeech(thisNPC, thisSpeech, thisSpeechCode, true);
                                thisNPC.speechIndex++;
                            }
                        }
                    }
                }
            }
        }
    }
    // action processed, so cancel the key event:
    key[4] = 0;
}

function processSpeech(thisObjectSpeaking, thisSpeechPassedIn, thisSpeechCode, isPartOfNPCsNormalSpeech, speechCodeExtraParameter) {
    // thisObjectSpeaking could be an NPC, or could be an item object (if from a Notice for example)
    // thisSpeech is global so it can be edited in the close quest functions:
    thisSpeech = thisSpeechPassedIn;

    // isPartOfNPCsNormalSpeech is false if not set:
    isPartOfNPCsNormalSpeech = typeof isPartOfNPCsNormalSpeech !== 'undefined' ? isPartOfNPCsNormalSpeech : false;
    var individualSpeechCodes = thisSpeechCode.split(",");
    for (var i = 0; i < individualSpeechCodes.length; i++) {
        switch (individualSpeechCodes[i]) {
            case "once":
                thisObjectSpeaking.speech.splice(thisObjectSpeaking.speechIndex, 1);
                // knock this back one so to keep it in step with the removed item:
                thisObjectSpeaking.speechIndex--;
                break;
            case "move":
                thisObjectSpeaking.forceNewMovementCheck = true;
                thisObjectSpeaking.isMoving = true;
                break;
            case "shop":
                // check if the shop is empty:
                if (UI.openedShopSuccessfully(generateHash(thisObjectSpeaking.speech[thisObjectSpeaking.speechIndex][2]))) {
                    //
                } else {
                    // shop is empty:
                    if (typeof thisObjectSpeaking.shopEmptySpeech !== "undefined") {
                        thisSpeech = thisObjectSpeaking.shopEmptySpeech;
                    }
                }
                //thisObjectSpeaking.speechIndex--;
                break;
            case "post":
                UI.openPost(thisObjectSpeaking.x, thisObjectSpeaking.y);
                break;
            case "retinue":
                UI.openRetinuePanel(thisObjectSpeaking);
                break;
            case "sound":
                audio.playSound(soundEffects[thisObjectSpeaking.speech[thisObjectSpeaking.speechIndex][2]], 0);
                break;
            case "profession":
                var professionId = thisObjectSpeaking.speech[thisObjectSpeaking.speechIndex][2];
                if (hero.professionsKnown.indexOf(professionId) == -1) {
                    hero.professionsKnown.push(professionId);
                    UI.showNewProfession(professionId);
                }
                break;
            case "follower":
                var followerId = thisObjectSpeaking.speech[thisObjectSpeaking.speechIndex][2];
                /*
                if (hero.professionsKnown.indexOf(followerId) == -1) {
                    hero.professionsKnown.push(followerId);
                    showNotification('<p>You gained a new follower</p>');
                }
                */
                break;
            case "hire":
                UI.openHireFollowerPanel(thisObjectSpeaking);
                thisObjectSpeaking.speechIndex--;
                break;
            case "collection-quest":
            case "collection-quest-no-open":
                var collectionQuestSpeech = thisSpeech.split("|");
                var collectionQuestZoneName = thisObjectSpeaking.speech[thisObjectSpeaking.speechIndex][2];
                // check if this zone key exists in the hero.collections object
                if (hero.collections.hasOwnProperty(collectionQuestZoneName)) {
                    // key exists - collection is underway.
                    // check if all are negative (if they are, collection is complete):
                    var foundAPositive = false;
                    for (var j in hero.collections[collectionQuestZoneName].required) {
                        if (hero.collections[collectionQuestZoneName].required[j] > 0) {
                            foundAPositive = true;
                            break;
                        }
                    }
                    if (foundAPositive) {
                        // not complete yet:
                        thisSpeech = collectionQuestSpeech[1];
                    } else {
                        var thisFullSpeech = thisObjectSpeaking.speech[thisObjectSpeaking.speechIndex];
                        // complete:
                        if (typeof thisFullSpeech[4] !== "undefined") {

                            awardQuestRewards(thisObjectSpeaking, thisFullSpeech[4], true);
                        }
                        thisSpeech = collectionQuestSpeech[2];
                        hero.collections[collectionQuestZoneName].complete = true;
                        UI.completeCollectionQuestPanel(collectionQuestZoneName);
                        thisObjectSpeaking.speech.splice(thisObjectSpeaking.speechIndex, 1);

                    }
                } else {
                    if (individualSpeechCodes[i] != 'collection-quest-no-open') {
                        // collection not started yet:
                        thisSpeech = collectionQuestSpeech[0];
                        hero.collections[collectionQuestZoneName] = {};
                        hero.collections[collectionQuestZoneName].required = thisObjectSpeaking.speech[thisObjectSpeaking.speechIndex][3];
                        hero.collections[collectionQuestZoneName].complete = false;
                        UI.initiateCollectionQuestPanel(collectionQuestZoneName);
                    } else {
                        thisSpeech = collectionQuestSpeech[1];
                    }
                }
                thisObjectSpeaking.speechIndex--;
                break;
            case "give":
                var thisGiveSpeech = thisSpeech.split("|");
                var itemsToAdd = thisObjectSpeaking.speech[thisObjectSpeaking.speechIndex][2];
                var allItemsToGive = [];
                for (var l = 0; l < itemsToAdd.length; l++) {
                    var thisRewardObject = prepareInventoryObject(itemsToAdd[l]);
                    allItemsToGive.push(thisRewardObject);
                }
                inventoryCheck = canAddItemToInventory(allItemsToGive);
                if (inventoryCheck[0]) {
                    thisSpeech = thisGiveSpeech[0];
                    UI.showChangeInInventory(inventoryCheck[1]);
                    thisObjectSpeaking.speech.splice(thisObjectSpeaking.speechIndex, 1);
                    // knock this back one so to keep it in step with the removed item:
                    thisObjectSpeaking.speechIndex--;
                } else {
                    thisSpeech = thisGiveSpeech[1];
                    // keep the NPC trying to give the item:
                    thisObjectSpeaking.speechIndex--;
                }
                break;

            case "catalogue":
                var catalogueQuestSpeech = thisSpeech.split("|");
                var catalogueQuestName = thisObjectSpeaking.speech[thisObjectSpeaking.speechIndex][2];
                // check if this zone key exists in the hero object
                if (hero.catalogues.hasOwnProperty(catalogueQuestName)) {
                    var foundAPositive = false;
                    for (var j in hero.catalogues[catalogueQuestName].ids) {
                        if (hero.catalogues[catalogueQuestName].ids[j] > 0) {
                            foundAPositive = true;
                            break;
                        }
                    }
                    if (foundAPositive) {
                        // not complete yet:
                        thisSpeech = catalogueQuestSpeech[1];
                    } else {
                        // is complete
                        thisSpeech = catalogueQuestSpeech[2];
                        var thisFullSpeech = thisObjectSpeaking.speech[thisObjectSpeaking.speechIndex];
                        if (typeof thisFullSpeech[3] !== "undefined") {
                            awardQuestRewards(thisObjectSpeaking, thisFullSpeech[3], false);
                        }
                        hero.catalogues[catalogueQuestName].complete = true;
                        thisObjectSpeaking.speech.splice(thisObjectSpeaking.speechIndex, 1);
                        // find the catalogue item in the inventory and remove it:
                        for (var key in hero.inventory) {
                            if (hero.inventory[key].type == 84) {
                                if (hero.inventory[key].contains.catalogueName == catalogueQuestName) {
                                    removeFromInventory(key, 1);
                                    break;
                                }
                            }
                        }
                    }
                } else {
                    thisSpeech = catalogueQuestSpeech[0];
                }
                thisObjectSpeaking.speechIndex--;
                break;

            case "quest":
            case "quest-no-open":
            case "quest-no-close":
            case "quest-no-open-no-close":
            case "quest-optional":
                var questSpeech = thisSpeech.split("|");
                var questId;
                if (typeof thisObjectSpeaking.speech !== "undefined") {
                    questId = thisObjectSpeaking.speech[thisObjectSpeaking.speechIndex][2];
                } else {
                    // something like a notice:
                    questId = speechCodeExtraParameter;
                }


                //   console.log(questData[questId].isUnderway);

                if (questData[questId].isUnderway) {
                    // quest has been opened - check if it's complete:
                    if ((individualSpeechCodes[i] == "quest") || (individualSpeechCodes[i] == "quest-no-open") || (individualSpeechCodes[i] == "quest-optional")) {
                        // ie. it's not a '-no-close' speech

                        switch (questData[questId].whatIsRequiredForCompletion) {
                            case "possess":
                            case "give":
                            case "":
                                if (hasItemsInInventory(questData[questId].itemsNeededForCompletion)) {
                                    if (questData[questId].whatIsRequiredForCompletion == "give") {
                                        // remove items:
                                        for (var i = 0; i < questData[questId].itemsNeededForCompletion.length; i++) {
                                            removeItemTypeFromInventory(questData[questId].itemsNeededForCompletion[i].type, questData[questId].itemsNeededForCompletion[i].quantity);
                                        }
                                    }
                                    // close quest:
                                    thisSpeech = questSpeech[2];
                                    closeQuest(thisObjectSpeaking, questId);
                                } else {
                                    // show 'underway' text:
                                    thisSpeech = questSpeech[1];
                                    // keep the NPC on this quest speech:
                                    thisObjectSpeaking.speechIndex--;
                                }

                                break;
                            case "craft":
                                // build object required:
                                var theseCraftedObjects = [];
                                var thisCraftedObject;
                                for (var i = 0; i < questData[questId].itemsNeededForCompletion.length; i++) {
                                    thisCraftedObject = JSON.parse(JSON.stringify(questData[questId].itemsNeededForCompletion[i]));
                                    // make sure the player has crafted it:
                                    thisCraftedObject.hallmark = 0 - characterId;
                                    theseCraftedObjects.push(thisCraftedObject);
                                }
                                if (hasItemsInInventory(theseCraftedObjects)) {
                                    thisSpeech = questSpeech[2];
                                    closeQuest(thisObjectSpeaking, questId);
                                } else {
                                    // show 'underway' text:
                                    thisSpeech = questSpeech[1];
                                    // keep the NPC on this quest speech:
                                    thisObjectSpeaking.speechIndex--;
                                }
                                break;
                            case "multi":
                                var allSubQuestsRequired = questData[questId].subQuestsRequiredForCompletion.split(",");
                                var allSubQuestsComplete = true;
                                for (var k = 0; k < allSubQuestsRequired.length; k++) {
                                    // check conditions for this sub-quest and set if it's complete
                                    switch (questData[allSubQuestsRequired[k]].whatIsRequiredForCompletion) {
                                        case "possess":
                                        case "give":
                                        case "":
                                            /*
                                            var theseItemsNeededForCompletion = questData[allSubQuestsRequired[k]].itemsNeededForCompletion;
                                            var itemsToGive = questData[allSubQuestsRequired[k]].startItemsReceived.split(",");
                                            var allItemsToGive = [];
                                            for (var j = 0; j < itemsToGive.length; j++) {

                                                if (!hasItemInInventory(itemsToGive[i].type, itemsToGive[i].quantity)) {
                                                    allSubQuestsComplete = false;
                                                }
                                            }
*/

                                            if (!(hasItemsInInventory(questData[allSubQuestsRequired[k]].itemsNeededForCompletion))) {
                                                allSubQuestsComplete = false;
                                            }
                                            break;
                                        case "craft":
                                            var theseCraftedObjects = [];
                                            var thisCraftedObject;
                                            for (var i = 0; i < questData[questId].itemsNeededForCompletion.length; i++) {
                                                thisCraftedObject = JSON.parse(JSON.stringify(questData[questId].itemsNeededForCompletion[i]));
                                                // make sure the player has crafted it:
                                                thisCraftedObject.hallmark = 0 - characterId;
                                                theseCraftedObjects.push(thisCraftedObject);
                                            }
                                            if (!(hasItemsInInventory(theseCraftedObjects))) {
                                                allSubQuestsComplete = false;
                                            }
                                            break;
                                        case "world":
                                            if (questData[allSubQuestsRequired[k]].hasBeenActivated < 1) {
                                                allSubQuestsComplete = false;
                                            }
                                            break;
                                        default:
                                            // threshold quest:
                                            var thresholdValueAtStart = questData[allSubQuestsRequired[k]].valueAtQuestStart;
                                            var currentThresholdValue = accessDynamicVariable(questData[allSubQuestsRequired[k]].whatIsRequiredForCompletion);
                                            // check if it's an absolute value to check for, or an increment (whether there is a '+' at the start):
                                            if (questData[allSubQuestsRequired[k]].thresholdNeededForCompletion.charAt(0) == "+") {
                                                //console.log(currentThresholdValue + " < " + questData[allSubQuestsRequired[k]].thresholdNeededForCompletion.substring(1));
                                                if (currentThresholdValue - thresholdValueAtStart < questData[allSubQuestsRequired[k]].thresholdNeededForCompletion) {
                                                    allSubQuestsComplete = false;
                                                }
                                            } else {
                                                if (currentThresholdValue < questData[allSubQuestsRequired[k]].thresholdNeededForCompletion.substring(1)) {
                                                    allSubQuestsComplete = false;
                                                }
                                            }
                                            break;
                                    }
                                }
                                if (allSubQuestsComplete) {
                                    thisSpeech = questSpeech[2];
                                    closeQuest(thisObjectSpeaking, questId);
                                } else {
                                    // show 'underway' text:
                                    thisSpeech = questSpeech[1];
                                    // keep the NPC on this quest speech:
                                    thisObjectSpeaking.speechIndex--;
                                }
                                break;
                            case "escort":
                                if (typeof thisObjectSpeaking.hasCompletedEscortQuest !== "undefined") {
                                    thisSpeech = questSpeech[2];
                                    closeQuest(thisObjectSpeaking, questId);
                                    delete thisObjectSpeaking.hasCompletedEscortQuest;
                                } else {
                                    // show 'underway' text:
                                    thisSpeech = questSpeech[1];
                                    // keep the NPC on this quest speech:
                                    thisObjectSpeaking.speechIndex--;
                                }
                                break;
                            case "world":
                                if (questData[questId].hasBeenActivated > 0) {
                                    thisSpeech = questSpeech[2];
                                    closeQuest(thisObjectSpeaking, questId);
                                } else {
                                    // show 'underway' text:
                                    thisSpeech = questSpeech[1];
                                    // keep the NPC on this quest speech:
                                    thisObjectSpeaking.speechIndex--;
                                }
                                break;
                            default:
                                // threshold quest:
                                var thresholdValueAtStart = questData[questId].valueAtQuestStart;
                                var currentThresholdValue = accessDynamicVariable(questData[questId].whatIsRequiredForCompletion);
                                var thisQuestIsComplete = false;
                                // check if it's an array of values:
                                if (questData[questId].thresholdNeededForCompletion.charAt(0) == "[") {
                                    // convert all entries in current Value array to string so they can be checked against the required array elements (which will be all strings)
                                    var currentThresholdValueString = currentThresholdValue.map(String);
                                    var requiredArray = questData[questId].thresholdNeededForCompletion.replace('[', '').replace(']', '').split(",");
                                    thisQuestIsComplete = true;
                                    for (var r = 0; r < requiredArray.length; r++) {
                                        if (currentThresholdValueString.indexOf(requiredArray[r]) === -1) {
                                            thisQuestIsComplete = false;
                                        }
                                    }
                                } else if (questData[questId].thresholdNeededForCompletion.charAt(0) == "+") {
                                    // check if it's an absolute value to check for, or an increment (whether there is a '+' at the start):
                                    if (currentThresholdValue - thresholdValueAtStart >= questData[questId].thresholdNeededForCompletion) {
                                        thisQuestIsComplete = true;
                                    }
                                } else {
                                    if (currentThresholdValue >= questData[questId].thresholdNeededForCompletion.substring(1)) {
                                        thisQuestIsComplete = true;
                                    }
                                }
                                if (thisQuestIsComplete) {
                                    // threshold quest is complete:
                                    thisSpeech = questSpeech[2];
                                    closeQuest(thisObjectSpeaking, questId);
                                } else {
                                    // show 'underway' text:
                                    thisSpeech = questSpeech[1];
                                    // keep the NPC on this quest speech:
                                    thisObjectSpeaking.speechIndex--;
                                }
                                break;
                        }


                    } else {
                        // check if it's been closed elsewhere:

                        if (questData[questId].hasBeenCompleted > 0) {

                            thisSpeech = questSpeech[2];
                            //closeQuest(thisObjectSpeaking, questId);
                        } else {
                            // show 'underway' text:

                            thisSpeech = questSpeech[1];
                            // keep the NPC on this quest speech:
                            thisObjectSpeaking.speechIndex--;
                        }
                    }


                } else if (individualSpeechCodes[i] == "quest-optional") {
                    // the player has a choice whether to accept this or not:
                    questResponseNPC = thisObjectSpeaking;
                    acceptQuestChoice.classList.add('active');
                    thisSpeech = questSpeech[0];
                    if (thisObjectSpeaking != null) {
                        // keep the NPC on this quest speech:
                        thisObjectSpeaking.speechIndex--;
                    }
                } else {



                    if ((individualSpeechCodes[i] == "quest") || (individualSpeechCodes[i] == "quest-no-close")) {
                        // ie. don't open the quest if it's "-no-open":
                        openQuest(questId);
                    }
                    thisSpeech = questSpeech[0];
                    if (thisObjectSpeaking != null) {
                        // keep the NPC on this quest speech:
                        thisObjectSpeaking.speechIndex--;

                    }

                }
                break;
            case "play":

                startCardGame(thisObjectSpeaking);
                break;

            case "hnefatafl":
                thisChallengeNPC = thisObjectSpeaking;
                startHnefataflGame(thisObjectSpeaking);
                break;

            default:
                // nothing
        }
    }
    if (thisSpeech != "") {
        // don't show the balloon if there's no speech (which might happen if the NPC just plays a sound instead)
        // check that it's not undefined (eg. a Notice with an opened quest, but the text won't change)
        if (typeof thisSpeech === "undefined") {
            thisSpeech = questSpeech[0];
        }
        UI.showDialogue(thisObjectSpeaking, thisSpeech);
    } else {
        thisObjectSpeaking.speechIndex--;
    }
    canCloseDialogueBalloonNextClick = false;
    if (!isPartOfNPCsNormalSpeech) {
        // set a flag so that pressing action near the NPC will close the balloon:
        canCloseDialogueBalloonNextClick = true;
    }
}




function updateItems() {
    var thisItem, whichCreature, whichStartPoint;
    var startPointsPossible = [
        [0, 1],
        [0, -1],
        [1, 0],
        [-1, 0]
    ];
    // check for any items that do anything based on time (eg. nests):
    for (var m = 0; m < visibleMaps.length; m++) {
        for (var i = 0; i < thisMapData[(visibleMaps[m])].items.length; i++) {
            thisItem = thisMapData[(visibleMaps[m])].items[i];

            if (currentActiveInventoryItems[thisItem.type].action == "nest") {
                if (thisItem.spawnsRemaining > 0) {
                    if (hero.totalGameTimePlayed - thisItem.timeLastSpawned >= currentActiveInventoryItems[thisItem.type].respawnRate) {
                        // pick a random creature from all possible:
                        whichCreature = thisItem.contains[(getRandomIntegerInclusive(1, thisItem.contains.length) - 1)];
                        // find a clear space around the item:
                        whichStartPoint = getRandomElementFromArray(startPointsPossible);
                        whichCreature.tileX = thisItem.tileX + whichStartPoint[0];
                        whichCreature.tileY = thisItem.tileY + whichStartPoint[1];
                        if (tileIsClear(whichCreature.tileX, whichCreature.tileY)) {
                            // create a copy so they are distinct:
                            thisMapData[(visibleMaps[m])].npcs.push(JSON.parse(JSON.stringify(whichCreature)));
                            initialiseNPC(thisMapData[(visibleMaps[m])].npcs[(thisMapData[(visibleMaps[m])].npcs.length - 1)]);
                            thisItem.spawnsRemaining--;
                            // reset timer:
                            thisItem.timeLastSpawned = hero.totalGameTimePlayed;
                        }
                    }
                }
            }
        }
    }
}

function checkForTitlesAwarded(whichQuestId) {
    // check for any titles:
    if (questData[whichQuestId].titleGainedAfterCompletion) {
        var thisTitle = questData[whichQuestId].titleGainedAfterCompletion;
        if (hero.titlesEarned.indexOf(thisTitle) == -1) {
            hero.titlesEarned.push(thisTitle);
            UI.showNotification('<p>I earned the &quot;' + possibleTitles[thisTitle] + '&quot; title</p>');
        }
    }
}


function checkForChallenges() {
    var thisNPC;
    for (var m = 0; m < visibleMaps.length; m++) {
        for (var i = 0; i < thisMapData[(visibleMaps[m])].npcs.length; i++) {
            thisNPC = thisMapData[(visibleMaps[m])].npcs[i];
            if (isInRange(hero.x, hero.y, thisNPC.x, thisNPC.y, (thisNPC.width + hero.width))) {
                if (isFacing(hero, thisNPC)) {
                    if (thisNPC.cardGameSpeech) {
                        thisNPC.drawnFacing = turntoFace(thisNPC, hero);
                        thisChallengeNPC = thisNPC;
                        processSpeech(thisNPC, thisNPC.cardGameSpeech.challenge[0], thisNPC.cardGameSpeech.challenge[1]);
                        break;
                    }
                }
            }
        }
    }
    // challenge processed, so cancel the key event:
    key[6] = 0;
}

function jumpToLocation(mapId, tileX, tileY) {
    activeDoorX = tileX;
    activeDoorY = tileY;
    jumpMapId = mapId;
    startDoorTransition();
}

function moveNPCs() {
    var thisNPC, thisUniqueIdentifier, thisInnerUniqueIdentifier, newTile, thisNextMovement, oldNPCx, oldNPCy, thisOtherNPC, thisItem, thisNextMovement, thisNextMovementCode, thisInnerDoor;
    for (var m = 0; m < visibleMaps.length; m++) {
        for (var i = 0; i < thisMapData[(visibleMaps[m])].npcs.length; i++) {
            //   thisUniqueIdentifier = m+"-"+i;
            thisNPC = thisMapData[(visibleMaps[m])].npcs[i];

            thisNPC.hasJustGotNewPath = false;

            //  if (thisNPC.name == "Warden") {
            // console.log(thisNPC.isMoving, thisNPC.forceNewMovementCheck, thisNPC.movement[thisNPC.movementIndex]);
            // }


            // check if this NPC is playing cards with the hero:
            if (typeof thisNPC.isPlayingCards === "undefined") {
                newTile = false;
                if (thisNPC.isMoving) {
                    oldNPCx = thisNPC.x;
                    oldNPCy = thisNPC.y;
                    thisNPC.drawnFacing = thisNPC.facing;
                    switch (thisNPC.facing) {
                        case 'n':
                            thisNPC.y -= thisNPC.speed;
                            // check for collisions:
                            if ((isATerrainCollision(thisNPC.x - thisNPC.width / 2, thisNPC.y - thisNPC.length / 2)) || (isATerrainCollision(thisNPC.x + thisNPC.width / 2, thisNPC.y - thisNPC.length / 2))) {
                                // find the tile's bottom edge
                                var tileCollidedWith = getTileY(thisNPC.y - thisNPC.length / 2);
                                var tileBottomEdge = (tileCollidedWith + 1) * tileW;
                                // use the +1 to make sure it's just clear of the collision tile
                                thisNPC.y = tileBottomEdge + thisNPC.length / 2 + 1;
                            }
                            break;
                        case 's':
                            thisNPC.y += thisNPC.speed;
                            // check for collisions:
                            if ((isATerrainCollision(thisNPC.x - thisNPC.width / 2, thisNPC.y + thisNPC.length / 2)) || (isATerrainCollision(thisNPC.x + thisNPC.width / 2, thisNPC.y + thisNPC.length / 2))) {
                                var tileCollidedWith = getTileY(thisNPC.y + thisNPC.length / 2);
                                var tileTopEdge = (tileCollidedWith) * tileW;
                                thisNPC.y = tileTopEdge - thisNPC.length / 2 - 1;
                            }
                            break;
                        case 'w':
                            thisNPC.x -= thisNPC.speed;
                            // check for collisions:
                            if ((isATerrainCollision(thisNPC.x - thisNPC.width / 2, thisNPC.y + thisNPC.length / 2)) || (isATerrainCollision(thisNPC.x - thisNPC.width / 2, thisNPC.y - thisNPC.length / 2))) {
                                var tileCollidedWith = getTileX(thisNPC.x - thisNPC.width / 2);
                                var tileRightEdge = (tileCollidedWith + 1) * tileW;
                                thisNPC.x = tileRightEdge + thisNPC.width / 2 + 1;
                            }
                            break;
                        case 'e':
                            thisNPC.x += thisNPC.speed;
                            // check for collisions:
                            if ((isATerrainCollision(thisNPC.x + thisNPC.width / 2, thisNPC.y + thisNPC.length / 2)) || (isATerrainCollision(thisNPC.x + thisNPC.width / 2, thisNPC.y - thisNPC.length / 2))) {
                                var tileCollidedWith = getTileX(thisNPC.x + thisNPC.width / 2);
                                var tileLeftEdge = (tileCollidedWith) * tileW;
                                thisNPC.x = tileLeftEdge - thisNPC.width / 2 - 1;
                            }
                            break;
                    }

                    // check for collision against hero:
                    if (isAnObjectCollision(thisNPC.x, thisNPC.y, thisNPC.width, thisNPC.length, hero.x, hero.y, hero.width, hero.length)) {
                        thisNPC.x = oldNPCx;
                        thisNPC.y = oldNPCy;
                    }

                    // check for collision against pet:
                    if (hasActivePet) {
                        for (var j = 0; j < hero.activePets.length; j++) {
                            if (isAnObjectCollision(thisNPC.x, thisNPC.y, thisNPC.width, thisNPC.length, hero.allPets[hero.activePets[j]].x, hero.allPets[hero.activePets[j]].y, hero.allPets[hero.activePets[j]].width, hero.allPets[hero.activePets[j]].length)) {
                                thisNPC.x = oldNPCx;
                                thisNPC.y = oldNPCy;
                            }
                        }
                    }

                    // check for collisions against other NPCs:
                    var whichNPCShouldMoveOutOfTheWay;
                    for (var n = 0; n < visibleMaps.length; n++) {
                        for (var j = 0; j < thisMapData[(visibleMaps[n])].npcs.length; j++) {
                            thisOtherNPC = thisMapData[(visibleMaps[n])].npcs[j];
                            //  thisInnerUniqueIdentifier = n+"-"+j;
                            if (thisNPC.uniqueIndex != thisOtherNPC.uniqueIndex) {

                                if (thisOtherNPC.isCollidable) {
                                    if (isAnObjectCollision(thisNPC.x, thisNPC.y, thisNPC.width, thisNPC.length, thisOtherNPC.x, thisOtherNPC.y, thisOtherNPC.width, thisOtherNPC.length)) {
                                        thisNPC.x = oldNPCx;
                                        thisNPC.y = oldNPCy;




                                        /*
                                        // work out which one should get out of the way (see if one of them is static and move the other if so)
                                        if (!thisNPC.isMoving) {
                                            whichNPCShouldMoveOutOfTheWay = thisOtherNPC;
                                        } else if (!thisOtherNPC.isMoving) {
                                            whichNPCShouldMoveOutOfTheWay = thisNPC;
                                        } else {
                                            // give the one added to the map earlier precedence:
                                            if (thisNPC.index < thisOtherNPC.index) {
                                                whichNPCShouldMoveOutOfTheWay = thisOtherNPC;
                                            } else {
                                                whichNPCShouldMoveOutOfTheWay = thisNPC;
                                            }
                                        }
                                        console.log(thisNPC.name + ' collided with ' + thisOtherNPC.name+" - "+whichNPCShouldMoveOutOfTheWay.name+" will move out of the way");
                                        */

                                    }
                                }
                            }
                        }
                    }

                    // check for collisions against items:
                    for (var j = 0; j < thisMapData[currentMap].items.length; j++) {
                        thisItem = thisMapData[currentMap].items[j];
                        if (thisItem.isCollidable) {
                            if (isAnObjectCollision(thisNPC.x, thisNPC.y, thisNPC.width, thisNPC.length, thisItem.x, thisItem.y, thisItem.width, thisItem.length)) {
                                thisNPC.x = oldNPCx;
                                thisNPC.y = oldNPCy;
                            }
                        }
                    }


                    // check for inner doors:
                    if (typeof thisMapData[currentMap].innerDoors !== "undefined") {
                        for (var i in thisMapData[currentMap].innerDoors) {
                            thisInnerDoor = thisMapData[currentMap].innerDoors[i];
                            if (!thisInnerDoor.isOpen) {
                                if (isAnObjectCollision(getTileCentreCoordX(thisInnerDoor.tileX), getTileCentreCoordY(thisInnerDoor.tileY), tileW, tileW, thisNPC.x, thisNPC.y, thisNPC.width, thisNPC.length)) {
                                    thisNPC.x = oldNPCx;
                                    thisNPC.y = oldNPCy;
                                }
                            }
                        }
                    }

                    // find the difference for this movement:
                    thisNPC.dx += (thisNPC.x - oldNPCx);
                    thisNPC.dy += (thisNPC.y - oldNPCy);
                    // see if it's at a new tile centre:

                    if (Math.abs(thisNPC.dx) >= tileW) {
                        if (thisNPC.dx > 0) {
                            thisNPC.dx -= tileW;
                        } else {
                            thisNPC.dx += tileW;
                        }
                        newTile = true;

                    }
                    if (Math.abs(thisNPC.dy) >= tileW) {
                        if (thisNPC.dy > 0) {
                            thisNPC.dy -= tileW;
                        } else {
                            thisNPC.dy += tileW;
                        }
                        newTile = true;
                    }
                }

                if (newTile || thisNPC.forceNewMovementCheck) {
                    thisNPC.tileX = getTileX(thisNPC.x);
                    thisNPC.tileY = getTileY(thisNPC.y);
                    if (typeof thisNPC.following !== "undefined") {
                        if (!thisNPC.forceNewMovementCheck) {




                            checkForEscortQuestEnd(thisNPC);

                        }
                    }
                    thisNPC.movementIndex++;
                    if (thisNPC.movementIndex >= thisNPC.movement.length) {
                        thisNPC.movementIndex = 0;
                    }
                    thisNextMovement = thisNPC.movement[thisNPC.movementIndex];



                    if (typeof thisNextMovement !== 'string') {
                        // it's an array, get the first element as the code:
                        thisNextMovementCode = thisNextMovement[0];
                    } else {
                        thisNextMovementCode = thisNextMovement;
                    }
                    switch (thisNextMovementCode) {

                        case '-':
                            // stand still:




                            thisNPC.isMoving = false;
                            thisNPC.forceNewMovementCheck = false;
                            break;
                        case '?':

                            // this code must be able to be optimsed: ########

                            // see if it should turn (randomly, or if destination tile is blocked):



                            if ((getRandomIntegerInclusive(1, 3) == 1) || (!tileIsClear(thisNPC.tileX + relativeFacing[thisNPC.facing]["x"], thisNPC.tileY + relativeFacing[thisNPC.facing]["y"]))) {
                                // try turning left or right, otherwise back the way it came
                                var facingsToPickFrom;
                                if ((thisNPC.facing == "n") || (thisNPC.facing == "s")) {
                                    if (getRandomIntegerInclusive(1, 2) == 1) {
                                        facingsToPickFrom = ["e", "w"];
                                    } else {
                                        facingsToPickFrom = ["w", "e"];
                                    }
                                } else {
                                    if (getRandomIntegerInclusive(1, 2) == 1) {
                                        facingsToPickFrom = ["n", "s"];
                                    } else {
                                        facingsToPickFrom = ["s", "n"];
                                    }
                                }
                                switch (thisNPC.facing) {
                                    case "n":
                                        facingsToPickFrom.push("s");
                                        facingsToPickFrom.push("n");
                                        break;
                                    case "s":
                                        facingsToPickFrom.push("n");
                                        facingsToPickFrom.push("s");
                                        break;
                                    case "e":
                                        facingsToPickFrom.push("w");
                                        facingsToPickFrom.push("e");
                                        break;
                                    case "w":
                                        facingsToPickFrom.push("e");
                                        facingsToPickFrom.push("w");
                                        break;

                                }

                                do {
                                    thisNPC.facing = facingsToPickFrom.shift();
                                } while (!tileIsClear(thisNPC.tileX + relativeFacing[thisNPC.facing]["x"], thisNPC.tileY + relativeFacing[thisNPC.facing]["y"]))
                            }


                            /*
                                                    do {
                                                        // pick a totally random facing:
                                                        thisNPC.facing = facingsPossible[Math.floor(Math.random() * facingsPossible.length)];
                                                        // check that the target tile is walkable:
                                                    } while (isATerrainCollision(thisNPC.x + (relativeFacing[thisNPC.facing]["x"] * tileW), thisNPC.y + (relativeFacing[thisNPC.facing]["y"] * tileW)));
                                                    */
                            thisNPC.forceNewMovementCheck = false;
                            break;

                        case 'find':
                            thisNPC.forceNewMovementCheck = true;
                            if ((!thisNPC.waitingForAPath) && (typeof thisNPC.waitingTimer === "undefined")) {
                                pathfindingWorker.postMessage([thisNextMovement[1], thisNPC, thisMapData, visibleMaps, isOverWorldMap]);
                                // make sure to only request this once:
                                thisNPC.isMoving = false;
                                thisNPC.waitingForAPath = true;
                                thisNPC.waitingTimer = 0;

                                // play animation while waiting
                                thisNPC.currentAnimation = 'wait';
                                // thisNextMovement[2]
                                // #######

                                // keep the NPC waiting:
                                thisNPC.movementIndex--;
                            } else {
                                // check timer:
                                thisNPC.waitingTimer++;
                                if (thisNPC.waitingTimer > thisNextMovement[3]) {
                                    thisNPC.isMoving = true;
                                    // set this so it doesn't do the check for a tile being blocked before it's turned to its new facing:
                                    thisNPC.hasJustGotNewPath = true;
                                    thisNPC.currentAnimation = 'walk';
                                    delete thisNPC.waitingTimer;
                                } else {
                                    // keep waiting until got a path, and the timer has expired
                                    thisNPC.movementIndex--;
                                    thisNPC.isMoving = false;
                                }
                            }
                            break;

                        case 'proximity':
                            // wait for the hero to be nearby
                            thisNPC.forceNewMovementCheck = true;
                            var tileRadius = thisNextMovement[1];
                            if ((isInRange(hero.x, hero.y, thisNPC.x, thisNPC.y, tileRadius * tileW))) {
                                // pick up the next movement code on the next loop round:
                                thisNPC.isMoving = true;
                            } else {
                                thisNPC.isMoving = false;
                                // keep it on the waiting item to keep checking:
                                thisNPC.movementIndex--;
                            }
                            break;

                        case 'remove':
                            // remove the element before, as well as this "remove" instruction (so 2 elements to be removed):
                            thisNPC.movement.splice((thisNPC.movementIndex - 1), 2);
                            break;

                        case 'pathEnd':
                            var thisPreviousMovement;
                            // check if it's a escort quest NPC that's come to the end of their pathfinding path:
                            if (typeof thisNPC.following !== "undefined") {
                                for (j = thisNPC.movementIndex; j >= 0; j--) {
                                    thisPreviousMovement = thisNPC.movement[j];
                                    if (typeof thisPreviousMovement === 'string') {
                                        if (thisPreviousMovement == 'following') {
                                            var numberOfElementsRemoved = thisNPC.movementIndex - (j);
                                            thisNPC.movement.splice(j + 1, numberOfElementsRemoved);
                                            // this needs to be one more than the equivilient for 'find' types:
                                            thisNPC.movementIndex -= (numberOfElementsRemoved + 1);
                                            thisNPC.isMoving = true;
                                            thisNPC.forceNewMovementCheck = true;
                                            delete thisNPC.waitingTimer;
                                            break;
                                        }
                                    }
                                }
                            } else {
                                // it's a 'find' type movement that's just ended:
                                var targetDestination = thisNPC.lastTargetDestination.split("-");
                                thisNPC.drawnFacing = turntoFaceTile(thisNPC, targetDestination[0], targetDestination[1]);
                                // find the "find" before this and remove all elements after that to this index:
                                for (j = thisNPC.movementIndex; j >= 0; j--) {
                                    thisPreviousMovement = thisNPC.movement[j];
                                    if (typeof thisPreviousMovement !== 'string') {
                                        if (thisPreviousMovement[0] == 'find') {
                                            var numberOfElementsRemoved = thisNPC.movementIndex - (j);
                                            thisNPC.movement.splice(j + 1, numberOfElementsRemoved);
                                            thisNPC.movementIndex -= numberOfElementsRemoved;
                                            thisNPC.isMoving = false;
                                            thisNPC.forceNewMovementCheck = true;
                                            delete thisNPC.waitingTimer;
                                            break;
                                        }
                                    }
                                }
                            }
                            break;

                        case 'talkToNeighbour':
                            // find an adjacent NPC and get them to turn to face this NPC
                            for (var j = 0; j < thisMapData[currentMap].npcs.length; j++) {
                                if (i != j) {
                                    thisOtherNPC = thisMapData[currentMap].npcs[j];
                                    if (Math.abs(thisOtherNPC.tileX - thisNPC.tileX) <= 1) {
                                        if (Math.abs(thisOtherNPC.tileY - thisNPC.tileY) <= 1) {
                                            thisOtherNPC.drawnFacing = turntoFace(thisOtherNPC, thisNPC);
                                        }
                                    }
                                }
                            }
                            break;

                        case 'follow':
                            // initialise following another object:

                            switch (thisNextMovement[1]) {
                                case 'hero':
                                    if (hero.npcsFollowing.length > 0) {
                                        // already has an NPC following, so follow that:
                                        thisNPC.following = hero.npcsFollowing[hero.npcsFollowing[(hero.npcsFollowing.length - 1)]];
                                    } else if (hero.activePets.length > 0) {
                                        // follow the last pet:
                                        thisNPC.following = hero.allPets[hero.activePets[(hero.activePets.length - 1)]];
                                    } else {
                                        // follow the hero:
                                        thisNPC.following = hero;
                                    }
                                    hero.npcsFollowing.push(thisNPC);
                                    thisNPC.movement[thisNPC.movementIndex] = "following";
                                    // keep it on the waiting item to keep checking:
                                    thisNPC.movementIndex--;
                                    thisNPC.forceNewMovementCheck = false;
                                    thisNPC.isMoving = true;
                                    break;
                                default:
                                    //
                            }
                            break;
                        case 'following':

                            // is already following, need to process that movement - check proximity to target to see if pet should stop moving: 
                            if ((isInRange(thisNPC.following.x, thisNPC.following.y, thisNPC.x, thisNPC.y, tileW * 2))) {
                                thisNPC.isMoving = false;
                                // keep it on the waiting item to keep checking:
                                thisNPC.movementIndex--;
                                thisNPC.forceNewMovementCheck = true;
                            } else {
                                thisNPC.isMoving = true;
                                // check the breadcrumb for next direction:
                                var breadcrumbFound = false;
                                for (var k = 0; k < thisNPC.following.breadcrumb.length; k++) {
                                    if ((thisNPC.tileY) == thisNPC.following.breadcrumb[k][1]) {
                                        if ((thisNPC.tileX - 1) == thisNPC.following.breadcrumb[k][0]) {
                                            thisNPC.facing = "w";
                                            breadcrumbFound = true;
                                            break;
                                        } else if ((thisNPC.tileX + 1) == thisNPC.following.breadcrumb[k][0]) {
                                            thisNPC.facing = "e";
                                            breadcrumbFound = true;
                                            break;
                                        }
                                    } else if ((thisNPC.tileX) == thisNPC.following.breadcrumb[k][0]) {
                                        if ((thisNPC.tileY + 1) == thisNPC.following.breadcrumb[k][1]) {
                                            thisNPC.facing = "s";
                                            breadcrumbFound = true;
                                            break;
                                        } else if ((thisNPC.tileY - 1) == thisNPC.following.breadcrumb[k][1]) {
                                            thisNPC.facing = "n";
                                            breadcrumbFound = true;
                                            break;
                                        }
                                    }
                                }

                                if (!breadcrumbFound) {
                                    thisNPC.forceNewMovementCheck = true;
                                    if ((!thisNPC.waitingForAPath) && (typeof thisNPC.waitingTimer === "undefined")) {

                                        pathfindingWorker.postMessage(["npcFindFollowing", thisNPC, thisMapData, visibleMaps, isOverWorldMap]);
                                        // make sure to only request this once:
                                        thisNPC.isMoving = false;
                                        thisNPC.waitingForAPath = true;
                                        // play animation while waiting
                                        // thisNPC.currentAnimation = 'wait';
                                        thisNPC.waitingTimer = 0;
                                        // keep it on the waiting item to keep checking:
                                        thisNPC.movementIndex--;
                                    } else {

                                        thisNPC.isMoving = true;
                                        //delete thisNPC.waitingTimer;
                                        // thisNPC.currentAnimation = 'walk';
                                    }
                                } else {
                                    // keep it on the waiting item to keep checking:
                                    thisNPC.movementIndex--;
                                    thisNPC.forceNewMovementCheck = false;
                                }
                            }
                            break;
                        case 'sound':
                            var thisSoundsVolume = 1;
                            if (thisNextMovement[2]) {
                                // determine the distance between the hero and NPC and use that as the volume:
                                
                            
                             //   console.log(getPythagorasDistance(thisNPC.x, thisNPC.y, hero.x, hero.y));
                                thisSoundsVolume = (worldMapWidthPx - getPythagorasDistance(thisNPC.x, thisNPC.y, hero.x, hero.y)) / worldMapWidthPx;
                              //  console.log(thisSoundsVolume);
                            }
                            if (thisSoundsVolume > 0.05) {
                                audio.playSound(soundEffects[thisNextMovement[1]], 0, 0, thisSoundsVolume);
                            }
                            break;
                        case 'animate':
                            if (typeof thisNPC.animationWaitingTimer === "undefined") {
                                thisNPC.currentAnimation = thisNextMovement[1];
                                // needs to stay like this for the number of animation frames multiplied by the number of times the animation is required:
                                // (also need the animation to start from its frame 0, not use the global frame so that it plays from the first frame of the animation)
                                thisNPC.animationWaitingTimer = currentAnimationFrame;
                                thisNPC.movementIndex--;
                                thisNPC.isMoving = false;
                                thisNPC.forceNewMovementCheck = true;
                            } else {
                                // the +1 is because the drawn frame needs +1 so that the first frame is 1 and not 0:
                                if (currentAnimationFrame + 1 < (thisNPC.animation[thisNPC.currentAnimation].length * thisNextMovement[2]) + thisNPC.animationWaitingTimer) {
                                    // keep it on the waiting item to keep checking:
                                    thisNPC.movementIndex--;
                                    thisNPC.forceNewMovementCheck = true;
                                } else {
                                    thisNPC.isMoving = true;
                                    thisNPC.forceNewMovementCheck = true;
                                    thisNPC.currentAnimation = "walk";
                                    delete thisNPC.animationWaitingTimer;
                                }
                            }
                            break;

                        default:
                            thisNPC.facing = thisNextMovement;
                            thisNPC.forceNewMovementCheck = false;
                            break;
                    }
                    if (thisNPC.isMoving && !thisNPC.hasJustGotNewPath) {
                        // check destination tile is clear:
                        var thisNPCsNextTile = relativeFacing[thisNPC.facing];
                        var newTileX = thisNPC.tileX + thisNPCsNextTile['x'];
                        var newTileY = thisNPC.tileY + thisNPCsNextTile['y'];
                        if (!(tileIsClear(newTileX, newTileY))) {
                            // if it's got a destination, add this blocked tile to the map, and re-path to that destination:
                            if (thisNPC.lastTargetDestination != "") {
                                // remove previous path:
                                var targetDestination = thisNPC.lastTargetDestination.split("-");
                                var pathEndIndex;
                                // find the 'pathEnd' index:
                                for (j = thisNPC.movement.length; j >= 0; j--) {
                                    //    console.log("checking:"+thisNPC.movement[j]);
                                    if (thisNPC.movement[j] == "pathEnd") {
                                        pathEndIndex = j;
                                        break;
                                    }
                                }
                                for (j = pathEndIndex; j >= 0; j--) {
                                    thisPreviousMovement = thisNPC.movement[j];
                                    // might not be a 'find', so check if reached the start of the array:
                                    // is there a neater way to remove the previous path? ###############
                                    if ((typeof thisPreviousMovement !== 'string') || (j == 0)) {
                                        if ((thisPreviousMovement[0] == 'find') || (j == 0)) {
                                            var numberOfElementsRemoved = pathEndIndex - (j);
                                            // console.log("numberOfElementsRemoved"+numberOfElementsRemoved);
                                            thisNPC.movement.splice(j + 1, numberOfElementsRemoved);
                                            thisNPC.movementIndex = j;
                                            //   console.log("end"+j);
                                            thisNPC.isMoving = false;
                                            thisNPC.forceNewMovementCheck = true;
                                            delete thisNPC.waitingTimer;
                                            break;
                                        }
                                    }
                                }
                                if ((!thisNPC.waitingForAPath) && (typeof thisNPC.waitingTimer === "undefined")) {
                                    // make a copy of the map with that blocked tile and any surrounding tiles marked, so it doesn't move off and immediately collide at the next tile:
                                    var tempMapData = JSON.parse(JSON.stringify(thisMapData));
                                    var testTileX, testTileY, localTestTileX, localTestTileY, whichTestMap;
                                    for (var k = -3; k <= 3; k++) {
                                        for (var l = -3; l <= 3; l++) {

                                            testTileX = newTileX + k;
                                            testTileY = newTileY + l;





                                            if (!(tileIsClear(testTileX, testTileY))) {

                                                localTestTileX = getLocalCoordinatesX(testTileX);
                                                localTestTileY = getLocalCoordinatesY(testTileY);
                                                whichTestMap = findMapNumberFromGlobalCoordinates(testTileX, testTileY);

                                                tempMapData[whichTestMap].collisions[localTestTileX][localTestTileY] = 1;
                                            }


                                        }
                                    }
                                    pathfindingWorker.postMessage(['tile', targetDestination[0], targetDestination[1], thisNPC, tempMapData, visibleMaps, isOverWorldMap]);
                                    // make sure to only request this once:
                                    thisNPC.isMoving = false;
                                    thisNPC.waitingForAPath = true;
                                    thisNPC.waitingTimer = 0;
                                    // play animation while waiting
                                    thisNPC.currentAnimation = 'wait';
                                    // #####
                                    // keep the NPC waiting:
                                    thisNPC.movementIndex--;
                                }
                                // end duplicated code
                            }
                        }
                    }
                }
                checkForSlopes(thisNPC);
            }
        }
    }
}


function movePlatforms() {
    if (thisMapData[currentMap].movingPlatforms) {
        // check for any items on platforms:
        for (var i = 0; i < thisMapData[currentMap].items.length; i++) {
            if (thisMapData[currentMap].items[i].isOnPlatform != undefined) {
                if (thisMapData[currentMap].movingPlatforms[thisMapData[currentMap].items[i].isOnPlatform].canMove) {
                    thisMapData[currentMap].items[i].x += thisMapData[currentMap].movingPlatforms[thisMapData[currentMap].items[i].isOnPlatform].dx;
                    thisMapData[currentMap].items[i].y += thisMapData[currentMap].movingPlatforms[thisMapData[currentMap].items[i].isOnPlatform].dy;
                    thisMapData[currentMap].items[i].z += thisMapData[currentMap].movingPlatforms[thisMapData[currentMap].items[i].isOnPlatform].dz;
                }
            }
        }
        var thisPlatform, thisPlatformMovements;
        for (var i = 0; i < thisMapData[currentMap].movingPlatforms.length; i++) {
            thisPlatform = thisMapData[currentMap].movingPlatforms[i];
            if (thisPlatform.canMove) {
                thisPlatform.x += thisPlatform.dx;
                thisPlatform.y += thisPlatform.dy;
                thisPlatform.z += thisPlatform.dz;
                // check to see if it's reached it's next target (within in a tolerance):
                //console.log(thisPlatform.targetX, thisPlatform.x,thisPlatform.targetY, thisPlatform.y);
                if (Math.abs(thisPlatform.targetX - thisPlatform.x) < 0.5) {
                    if (Math.abs(thisPlatform.targetY - thisPlatform.y) < 0.5) {
                        if (Math.abs(thisPlatform.targetZ - thisPlatform.z) < 0.5) {
                            // snap to target:
                            thisPlatform.x = thisPlatform.targetX;
                            thisPlatform.y = thisPlatform.targetY;
                            thisPlatform.z = thisPlatform.targetZ;
                            // find next movement:
                            thisPlatformMovements = determinePlatformIncrements(thisPlatform);
                            thisPlatform.dx = thisPlatformMovements[0];
                            thisPlatform.dy = thisPlatformMovements[1];
                            thisPlatform.dz = thisPlatformMovements[2];
                        }
                    }
                }
            }
        }
    }
}

function determinePlatformIncrements(whichPlatform) {
    var nextMovement = whichPlatform.movement[whichPlatform.movementIndex];
    var targetX = getTileCentreCoordX(nextMovement[0]);
    var targetY = getTileCentreCoordY(nextMovement[1]);
    var targetZ = nextMovement[2];
    var dx, dy, dz;
    var totalDistance = getPythagorasDistance(whichPlatform.x, whichPlatform.y, targetX, targetY);
    var numberOfTurns = totalDistance / whichPlatform.speed;
    // determine differences:
    var xDiff = whichPlatform.x - targetX;
    var yDiff = whichPlatform.y - targetY;
    var zDiff = whichPlatform.z - targetZ;
    dx = 0 - xDiff / (numberOfTurns);
    dy = 0 - yDiff / (numberOfTurns);
    dz = 0 - zDiff / (numberOfTurns);
    /*
    if (typeof nextMovement[3] !== "undefined") {
        switch (nextMovement[3]) {
            case 'jump':
                // don't ease to the new location, jump straight to it:
                whichPlatform.x = targetX;
                whichPlatform.y = targetY;
                whichPlatform.z = targetZ;
                dx = dy = dz = 0;
                break;
        }
    }
    */
    whichPlatform.targetX = targetX;
    whichPlatform.targetY = targetY;
    whichPlatform.targetZ = targetZ;
    whichPlatform.movementIndex++;
    if (whichPlatform.movementIndex >= whichPlatform.movement.length) {
        whichPlatform.movementIndex = 0;
    }
    return [dx, dy, dz];
}

function canLearnRecipe(recipeIndex) {
    var wasSuccessful = false;


    console.log(hero.crafting);

    if (hero.recipesKnown.indexOf(recipeIndex) === -1) {
        // check for pre-requisites
        // #####
        hero.recipesKnown.push(parseInt(recipeIndex));

        // reload the recipe data
        // #####
        wasSuccessful = true;
    }
    return wasSuccessful;
}


function initialiseAndPlacePet(petObjectArray, tileOffsetX, tileOffsetY) {
    var petObject = petObjectArray.shift();
    var allPetIndex = hero.allPets.length;
    hero.allPets.push(petObject);
    hero.activePets.push(allPetIndex);
    initialisePet(hero.activePets.length - 1, tileOffsetX, tileOffsetY);
    initialisePetObject(hero.activePets.length - 1);
    Loader.preload([{ name: "activePet" + hero.activePets[allPetIndex], src: '/images/game-world/npcs/' + petObject.src }], function() { activePetImages.push(Loader.getImage("activePet" + hero.activePets[allPetIndex])); if (petObjectArray.length > 0) { initialiseAndPlacePet(thesePetsToAdd.shift(), tileOffsetX, tileOffsetY); } }, function() {});
}


function addPetToWorld() {
    UI.hideYesNoDialogueBox();
    var tileOffsetX = 0;
    var tileOffsetY = 0;
    // have it start 2 tiles away so it's not too close inititally
    switch (hero.facing) {
        case "n":
            tileOffsetY = 2;
            break
        case "s":
            tileOffsetY = -2;
            break
        case "e":
            tileOffsetX = -2;
            break
        case "w":
            tileOffsetX = 2;
            break
    }
    initialiseAndPlacePet(hero.inventory[inventorySlotReference].contains, tileOffsetX, tileOffsetY);
    // remove egg from inventory:
    reducedHeldQuantity(inventorySlotReference);
    hasActivePet = true;
}

function checkAddPetToWorld(petJson) {
    UI.showYesNoDialogueBox("Hatch pet?", "Yes", "No, keep it as an egg", "addPetToWorld", "UI.hideYesNoDialogueBox");
}

function sendUserPost(postData) {
    var postDataToSend = JSON.parse(postData);
    getJSONWithParams("/game-world/sendPost.php", 'postData=' + JSON.stringify(postDataToSend), function(data) {
        if (data.success) {
            console.log("user post sent");
        } else {
            console.log("user post failed #1");
            // let user try again ########
        }
    }, function(status) {
        console.log("user post failed #2");
        // let user try again ########
    });
}

function sendNPCPost(postData, attachments) {
    console.log(postData);
    var postDataToSend = JSON.parse(postData);

    if (attachments) {
        postDataToSend['attachments'] = attachments;
    }
    // console.log(JSON.stringify(postDataToSend));
    getJSONWithParams("/game-world/sendPost.php", 'postData=' + JSON.stringify(postDataToSend), function(data) {
        if (data.success) {
            // show new post notification:
            newPost.classList.add('active');
            // get new post ######
        } else {
            console.log("npc post failed #1");
            // try again? ####
        }
    }, function(status) {
        console.log("npc post failed #2");
        // try again ? #######
    });
}

function saveGame() {
    // save game state:

    // avoid circular references in the Hero object:
    // https://stackoverflow.com/questions/11616630/json-stringify-avoid-typeerror-converting-circular-structure-to-json/11616993#answer-11616993
    var cache = [];
    var heroJSONWithoutCircularReference = JSON.stringify(hero, function(key, value) {
        if (typeof value === 'object' && value !== null) {
            if (cache.indexOf(value) !== -1) {
                // Circular reference found, discard key
                return;
            }
            // Store value in our collection
            cache.push(value);
        }
        return value;
    });
    cache = null;
    getJSONWithParams("/game-world/saveGameState.php", 'chr=' + characterId + '+&postData=' + heroJSONWithoutCircularReference, function(data) {
        if (data.success == 'true') {
            // all ok - no action ?
        } else {

            // try again? 
        }
    }, function(status) {
        // try again ? 
    });
    // save map state:
    // ##########
    // save UI state:
    // ##########

}

function isVisibleOnScreen(isoX, isoY) {
    // canvasWidth
    var horizontalDistance = Math.abs(hero.isox - isoX);
    var verticalDistance = Math.abs(hero.isoy - isoY);
    // needs to take into account the item's width and height ######
    if (horizontalDistance > (canvasWidth / 2) + tileW) {
        return false;
    }
    if (verticalDistance > (canvasHeight / 2) + tileW) {
        return false;
    }
    return true;
}

function printScreen() {
    var fullQualityJpeg = gameCanvas.toDataURL('image/jpeg', 1.0);
    // Chrome currently has a 2Mb maximum, so convert to a blob:
    var objecturl = URL.createObjectURL(dataURItoBlob(fullQualityJpeg));
    var printScreenAnchor = document.getElementById('printScreenAnchor');
    printScreenAnchor.href = objecturl;
    printScreenAnchor.setAttribute("download", "screenshot_" + getCurrentDateTimeFormatted() + ".jpg");
    printScreenAnchor.click();
}

function draw() {

    if (gameMode == "mapLoading") {
        gameContext.fillStyle = "#000000";
        gameContext.fillRect(0, 0, canvasWidth, canvasHeight);
        gameContext.fill();
    } else {
        // get all assets to be drawn in a list
        var thisGraphicCentreX, thisGraphicCentreY, thisX, thisY, thisZ, thisNPC, thisItem, shouldFadeThisObject, thisCentreX, thisCentreY;
        hero.isox = findIsoCoordsX(hero.x, hero.y);
        hero.isoy = findIsoCoordsY(hero.x, hero.y);
        var heroOffsetCol = currentAnimationFrame % hero["animation"][hero.currentAnimation]["length"];
        var heroOffsetRow = (hero["animation"][hero.currentAnimation][hero.facing]) + (hero["animation"][hero.currentAnimation]["start-row"]);
        var assetsToDraw = [
            [findIsoDepth(hero.x, hero.y, hero.z), "sprite", heroImg, heroOffsetCol * hero.spriteWidth, heroOffsetRow * hero.spriteHeight, hero.spriteWidth, hero.spriteHeight, Math.floor(canvasWidth / 2 - hero.centreX), Math.floor(canvasHeight / 2 - hero.centreY - hero.z), hero.spriteWidth, hero.spriteHeight]
        ];
        if (interfaceIsVisible) {
            switch (activeAction) {
                case 'dowse':
                    assetsToDraw.push([0, "dowsingRing", Math.floor(canvasWidth / 2 - dowsingRingSize / 2), Math.floor(canvasHeight / 2 - dowsingRingSize / 4)]);
                    break;
                case 'plotPlacement':
                    assetsToDraw.push([0, "plotPlacementOverlay"]);
                    break;
            }
            if (gameMode == 'housing') {
                if (hero.settings.showFootprintInEditMode) {
                    assetsToDraw.push([0, "houseGroundPlan"]);
                }
                // check if over the plot footprint:
                if (housingNameSpace.mousePosition[0] >= hero.housing.northWestCornerTileX) {
                    if (housingNameSpace.mousePosition[0] < hero.housing.southEastCornerTileX) {
                        if (housingNameSpace.mousePosition[1] >= hero.housing.northWestCornerTileY) {
                            if (housingNameSpace.mousePosition[1] < hero.housing.southEastCornerTileY) {
                                switch (housingNameSpace.activeTool) {


                                    case 'paint':
                                        if (housingNameSpace.whichTileActive != '') {
                                            // draw ghost of the selected tile graphic 
                                            thisZ = 0;
                                            if (housingNameSpace.currentTileCanBeElevated) {
                                                thisZ = housingNameSpace.whichZIndexActive;
                                            }

                                            assetsToDraw.push([findIsoDepth(getTileCentreCoordX(housingNameSpace.mousePosition[0]), getTileCentreCoordY(housingNameSpace.mousePosition[1]), thisZ + getElevation(housingNameSpace.mousePosition[0], housingNameSpace.mousePosition[1])), "ghostSelectedHousingTile"]);

                                        }
                                        break;
                                    case 'remove':
                                        // draw a tile outline over the base footprint:
                                        assetsToDraw.push([0, "ghostRemoveHousingTile"]);
                                        // identify which tile item that is and ghost that slightly
                                        break;
                                }
                            }
                        }
                    }
                }
            }
        }

        if (gameMode == 'housing') {
            // draw any draft housing tiles:
            var whichHousingItem, thisItemCanBeRotated, thisItemSpriteHeight, thisItemSpriteWidth;
            //    for (var i = 0; i < hero.housing.draft.length; i++) {
            var i = housingNameSpace.whichElevationActive;
            for (var j = 0; j < hero.housing.draft[i].length; j++) {
                whichHousingItem = hero.housing.draft[i][j].type;
                // add the half for the tile's centre:
                var thisItemX = (hero.housing.northWestCornerTileX + hero.housing.draft[i][j].tileX + 0.5) * tileW;
                var thisItemY = (hero.housing.northWestCornerTileY + hero.housing.draft[i][j].tileY + 0.5) * tileW;
                var thisItemZ = getElevation(hero.housing.northWestCornerTileX + hero.housing.draft[i][j].tileX, hero.housing.northWestCornerTileY + hero.housing.draft[i][j].tileY);
                thisFileColourSuffix = "";
                if (hero.housing.draft[i][j].colour) {
                    // bypass hasInherent colour checks as won't be in inventory items
                    var thisColourName = colourNames[hero.housing.draft[i][j].colour];
                    if (thisColourName != "") {
                        thisFileColourSuffix = "-" + thisColourName.toLowerCase();
                    }
                }
                thisItemIdentifier = "item" + whichHousingItem + thisFileColourSuffix;
                thisX = findIsoCoordsX(thisItemX, thisItemY);
                thisY = findIsoCoordsY(thisItemX, thisItemY);

                if (hero.housing.draft[i][j].tileZ) {
                    thisItemZ += (hero.housing.draft[i][j].tileZ * tileW);

                }

                shouldFadeThisObject = false;
                // if the remove tool is active, check if this item is on the tile for removal:
                if (housingNameSpace.activeTool == "remove") {
                    if ((hero.housing.northWestCornerTileX + hero.housing.draft[i][j].tileX) == housingNameSpace.mousePosition[0]) {
                        if ((hero.housing.northWestCornerTileY + hero.housing.draft[i][j].tileY) == housingNameSpace.mousePosition[1]) {
                            shouldFadeThisObject = true;
                        }
                    }
                }
                // check inventory data first, and if not use housingData:
                if (typeof currentActiveInventoryItems[whichHousingItem] !== "undefined") {
                    thisCentreX = currentActiveInventoryItems[whichHousingItem].centreX;
                    thisCentreY = currentActiveInventoryItems[whichHousingItem].centreY;
                    thisItemCanBeRotated = currentActiveInventoryItems[whichHousingItem].canBeRotated;

                    thisItemSpriteHeight = currentActiveInventoryItems[whichHousingItem].spriteHeight;
                    thisItemSpriteWidth = currentActiveInventoryItems[whichHousingItem].spriteWidth;
                } else {
                    thisCentreX = housingData[whichHousingItem].centreX;
                    thisCentreY = housingData[whichHousingItem].centreY;
                    thisItemCanBeRotated = housingData[whichHousingItem].canBeRotated;
                    thisItemSpriteHeight = housingData[whichHousingItem].spriteHeight;
                    thisItemSpriteWidth = housingData[whichHousingItem].spriteWidth;
                }
                if (shouldFadeThisObject) {
                    if (thisItemCanBeRotated) {
                        assetsToDraw.push([findIsoDepth(thisItemX, thisItemY, thisItemZ), "sprite", itemImages[thisItemIdentifier], 0, (facingsPossible.indexOf(hero.housing.draft[i][j].facing)) * thisItemSpriteHeight, thisItemSpriteWidth, thisItemSpriteHeight, Math.floor(thisX - hero.isox - thisCentreX + (canvasWidth / 2)), Math.floor(thisY - hero.isoy - thisCentreY + (canvasHeight / 2) - thisItemZ), thisItemSpriteWidth, thisItemSpriteHeight, 0.3]);
                    } else {
                        assetsToDraw.push([findIsoDepth(thisItemX, thisItemY, thisItemZ), "img", itemImages[thisItemIdentifier], Math.floor(thisX - hero.isox - thisCentreX + (canvasWidth / 2)), Math.floor(thisY - hero.isoy - thisCentreY + (canvasHeight / 2) - thisItemZ), 0.3]);
                    }
                } else {
                    if (thisItemCanBeRotated) {
                        assetsToDraw.push([findIsoDepth(thisItemX, thisItemY, thisItemZ), "sprite", itemImages[thisItemIdentifier], 0, (facingsPossible.indexOf(hero.housing.draft[i][j].facing)) * thisItemSpriteHeight, thisItemSpriteWidth, thisItemSpriteHeight, Math.floor(thisX - hero.isox - thisCentreX + (canvasWidth / 2)), Math.floor(thisY - hero.isoy - thisCentreY + (canvasHeight / 2) - thisItemZ), thisItemSpriteWidth, thisItemSpriteHeight]);
                    } else {
                        assetsToDraw.push([findIsoDepth(thisItemX, thisItemY, thisItemZ), "img", itemImages[thisItemIdentifier], Math.floor(thisX - hero.isox - thisCentreX + (canvasWidth / 2)), Math.floor(thisY - hero.isoy - thisCentreY + (canvasHeight / 2) - thisItemZ)]);
                    }
                }
            }
            //  }
        }


        // draw fae:
        thisX = findIsoCoordsX(fae.x, fae.y);
        thisY = findIsoCoordsY(fae.x, fae.y);
        fae.oscillateOffset = ((Math.sin(fae.dz) + 1) * 8) + fae.z + fae.zOffset;
        if (isVisibleOnScreen(thisX, thisY)) {
            assetsToDraw.push([findIsoDepth(fae.x, fae.y, fae.z), "faeCentre", Math.floor(thisX - hero.isox + (canvasWidth / 2)), Math.floor(thisY - hero.isoy + (canvasHeight / 2) - fae.oscillateOffset)]);
        }

        // draw fae particles:
        for (var i = 0; i < fae.particles.length; i++) {
            assetsToDraw.push([fae.particles[i].depth, "faeParticle", Math.floor(fae.particles[i].isoX - hero.isox + (canvasWidth / 2)), Math.floor(fae.particles[i].isoY - hero.isoy + (canvasHeight / 2)), fae.particles[i].alpha]);
        }

        var map, thisMapsGlobalOffsetX, thisMapsGlobalOffsetY;
        var thisNPCOffsetCol = 0;
        var thisNPCOffsetRow = 0;
        var thisFileColourSuffix = '';
        var thisColourName, thisItemIdentifier, thisPlatform, thisNPCIdentifier, thisTerrainIdentifer;
        var thisItemOffsetCol = 0;
        var thisItemOffsetRow = 0;
        var thisTerrainAnimation;
        var thisPetState;

        for (var m = 0; m < visibleMaps.length; m++) {

            map = thisMapData[visibleMaps[m]].terrain;

            if (isOverWorldMap) {
                thisMapsGlobalOffsetX = thisMapData[(visibleMaps[m])].globalCoordinateTile0X * worldMapTileLength;
                thisMapsGlobalOffsetY = thisMapData[(visibleMaps[m])].globalCoordinateTile0Y * worldMapTileLength;
            } else {
                thisMapsGlobalOffsetX = 0;
                thisMapsGlobalOffsetY = 0;
            }
            for (var i = 0; i < mapTilesX; i++) {
                for (var j = 0; j < mapTilesY; j++) {
                    // the tile coordinates should be positioned by i,j but the way the map is drawn, the reference in the array is j,i
                    // this makes the map array more readable when editing
                    if (map[j][i] != "*") {
                        thisX = getTileIsoCentreCoordX(i + thisMapsGlobalOffsetX, j + thisMapsGlobalOffsetY);
                        thisY = getTileIsoCentreCoordY(i + thisMapsGlobalOffsetX, j + thisMapsGlobalOffsetY);
                        if (isVisibleOnScreen(thisX, thisY)) {
                            thisGraphicCentreX = thisMapData[visibleMaps[m]].graphics[(map[j][i])].centreX;
                            thisGraphicCentreY = thisMapData[visibleMaps[m]].graphics[(map[j][i])].centreY;
                            thisTerrainIdentifer = thisMapData[visibleMaps[m]].graphics[(map[j][i])].src;
                            if (thisMapData[visibleMaps[m]].graphics[(map[j][i])].animation) {
                                thisTerrainAnimation = thisMapData[visibleMaps[m]].graphics[(map[j][i])].animation;
                                thisItemOffsetCol = Math.floor(thisTerrainAnimation.currentFrame);
                                thisItemOffsetRow = 0;
                                assetsToDraw.push([findIsoDepth(getTileCentreCoordX(i + thisMapsGlobalOffsetX), getTileCentreCoordY(j + thisMapsGlobalOffsetY), 0), "sprite", tileImages[thisTerrainIdentifer], thisItemOffsetCol * thisTerrainAnimation.spriteWidth, thisItemOffsetRow * thisTerrainAnimation.spriteHeight, thisTerrainAnimation.spriteWidth, thisTerrainAnimation.spriteHeight, Math.floor(thisX - hero.isox - thisGraphicCentreX + (canvasWidth / 2)), Math.floor(thisY - hero.isoy - thisGraphicCentreY + (canvasHeight / 2)), thisTerrainAnimation.spriteWidth, thisTerrainAnimation.spriteHeight]);
                            } else {
                                assetsToDraw.push([findIsoDepth(getTileCentreCoordX(i + thisMapsGlobalOffsetX), getTileCentreCoordY(j + thisMapsGlobalOffsetY), 0), "img", tileImages[thisTerrainIdentifer], Math.floor(thisX - hero.isox - thisGraphicCentreX + (canvasWidth / 2)), Math.floor(thisY - hero.isoy - thisGraphicCentreY + (canvasHeight / 2))]);
                            }
                        }
                    }
                    // look for tilled tiles:

                    if (thisMapData[visibleMaps[m]].properties[j][i].tilled == 1) {
                        thisX = getTileIsoCentreCoordX(i + thisMapsGlobalOffsetX, j + thisMapsGlobalOffsetY);
                        thisY = getTileIsoCentreCoordY(i + thisMapsGlobalOffsetX, j + thisMapsGlobalOffsetY);
                        if (isVisibleOnScreen(thisX, thisY)) {
                            thisGraphicCentreX = tileW / 2;
                            thisGraphicCentreY = tileH / 2;
                            assetsToDraw.push([0, "img", tilledEarth, Math.floor(thisX - hero.isox - thisGraphicCentreX + (canvasWidth / 2)), Math.floor(thisY - hero.isoy - thisGraphicCentreY + (canvasHeight / 2))]);
                        }
                    }
                    // look for watered tiles:
                    if (typeof thisMapData[visibleMaps[m]].properties[j][i].water !== "undefined") {
                        if (thisMapData[visibleMaps[m]].properties[j][i].water.amount > 0) {
                            thisX = getTileIsoCentreCoordX(i + thisMapsGlobalOffsetX, j + thisMapsGlobalOffsetY);
                            thisY = getTileIsoCentreCoordY(i + thisMapsGlobalOffsetX, j + thisMapsGlobalOffsetY);
                            if (isVisibleOnScreen(thisX, thisY)) {
                                thisGraphicCentreX = tileW / 2;
                                thisGraphicCentreY = tileH / 2;
                                for (var k = 0; k < thisMapData[visibleMaps[m]].properties[j][i].water.amount; k++) {
                                    assetsToDraw.push([k + 1, "img", addedWater, Math.floor(thisX - hero.isox - thisGraphicCentreX + (canvasWidth / 2)), Math.floor(thisY - hero.isoy - thisGraphicCentreY + (canvasHeight / 2))]);
                                }
                            }
                        }
                    }
                }
            }

            // loop through all terrain and increment the current frame of with animations (don't do it in the above loop or it will increment for each iteration of that graphic):
            for (var i = 0; i < thisMapData[visibleMaps[m]].graphics.length; i++) {
                if (thisMapData[visibleMaps[m]].graphics[i].animation) {
                    thisMapData[visibleMaps[m]].graphics[i].animation.currentFrame+=0.2;
                     if (thisMapData[visibleMaps[m]].graphics[i].animation.currentFrame >= thisMapData[visibleMaps[m]].graphics[i].animation.length) {
                                    thisMapData[visibleMaps[m]].graphics[i].animation.currentFrame = 0;
                                }
                }
            }



            if (typeof thisMapData[visibleMaps[m]].innerDoors !== "undefined") {
                var thisDoorImage;
                for (var i in thisMapData[visibleMaps[m]].innerDoors) {
                    // check for open status to get the right graphic ###########
                    if (!thisMapData[visibleMaps[m]].innerDoors[i]['isOpen']) {
                        thisX = getTileIsoCentreCoordX(thisMapData[visibleMaps[m]].innerDoors[i]['tileX'], thisMapData[visibleMaps[m]].innerDoors[i]['tileY']);
                        thisY = getTileIsoCentreCoordY(thisMapData[visibleMaps[m]].innerDoors[i]['tileX'], thisMapData[visibleMaps[m]].innerDoors[i]['tileY']);
                        if (isVisibleOnScreen(thisX, thisY)) {
                            thisDoorImage = thisMapData[visibleMaps[m]].innerDoors[i]['graphic'];
                            thisDoorImage = thisMapData[visibleMaps[m]].graphics[(thisDoorImage)].src;
                            thisGraphicCentreX = thisMapData[visibleMaps[m]].graphics[(thisMapData[visibleMaps[m]].innerDoors[i]['graphic'])].centreX;
                            thisGraphicCentreY = thisMapData[visibleMaps[m]].graphics[(thisMapData[visibleMaps[m]].innerDoors[i]['graphic'])].centreY;
                            assetsToDraw.push([findIsoDepth(getTileCentreCoordX(thisMapData[visibleMaps[m]].innerDoors[i]['tileX']), getTileCentreCoordY(thisMapData[visibleMaps[m]].innerDoors[i]['tileY']), 0), "img", tileImages[thisDoorImage], Math.floor(thisX - hero.isox - thisGraphicCentreX + (canvasWidth / 2)), Math.floor(thisY - hero.isoy - thisGraphicCentreY + (canvasHeight / 2))]);
                        }
                    }
                }
            }
        }
        if (hasActivePet) {
            for (var i = 0; i < hero.activePets.length; i++) {
                thisPetState = hero.allPets[hero.activePets[i]].state;
                if(thisPetState != "moving") {
                    // confirm any others to the available animation (eg. queuing or pathfinding):
thisPetState = "wait";
                }
                thisNPCOffsetCol = currentAnimationFrame % hero.allPets[hero.activePets[i]]["animation"][thisPetState]["length"];
                thisNPCOffsetRow = hero.allPets[hero.activePets[i]]["animation"][thisPetState][hero.allPets[hero.activePets[i]].facing];
                thisX = findIsoCoordsX(hero.allPets[hero.activePets[i]].x, hero.allPets[hero.activePets[i]].y);
                thisY = findIsoCoordsY(hero.allPets[hero.activePets[i]].x, hero.allPets[hero.activePets[i]].y);
                if (isVisibleOnScreen(thisX, thisY)) {
                    assetsToDraw.push([findIsoDepth(hero.allPets[hero.activePets[i]].x, hero.allPets[hero.activePets[i]].y, hero.allPets[hero.activePets[i]].z), "sprite", activePetImages[i], thisNPCOffsetCol * hero.allPets[hero.activePets[i]].spriteWidth, thisNPCOffsetRow * hero.allPets[hero.activePets[i]].spriteHeight, hero.allPets[hero.activePets[i]].spriteWidth, hero.allPets[hero.activePets[i]].spriteHeight, Math.floor(thisX - hero.isox - hero.allPets[hero.activePets[i]].centreX + (canvasWidth / 2)), Math.floor(thisY - hero.isoy - hero.allPets[hero.activePets[i]].centreY + (canvasHeight / 2) - hero.allPets[hero.activePets[i]].z), hero.allPets[hero.activePets[i]].spriteWidth, hero.allPets[hero.activePets[i]].spriteHeight]);
                }
            }
        }


        var shouldDrawThisItem;
        for (var m = 0; m < visibleMaps.length; m++) {
            whichVisibleMap = visibleMaps[m];

            for (var i = 0; i < thisMapData[whichVisibleMap].npcs.length; i++) {
                thisNPC = thisMapData[whichVisibleMap].npcs[i];

                if (typeof thisNPC.animationWaitingTimer === "undefined") {
                    thisNPCOffsetCol = currentAnimationFrame % thisNPC["animation"][thisNPC.currentAnimation]["length"];
                } else {
                    // don't use the global animation timer, so that this animation plays from its own first frame through to its end:
                    // (need modulo in case the animation is being played several times)
                    thisNPCOffsetCol = (currentAnimationFrame + 1 - thisNPC.animationWaitingTimer) % thisNPC["animation"][thisNPC.currentAnimation]["length"];
                }

                thisNPCOffsetRow = thisNPC["animation"][thisNPC.currentAnimation][thisNPC.drawnFacing];
                thisX = findIsoCoordsX(thisNPC.x, thisNPC.y);
                thisY = findIsoCoordsY(thisNPC.x, thisNPC.y);
                if (isVisibleOnScreen(thisX, thisY)) {
                    //assetsToDraw.push([findIsoDepth(thisX, thisY), npcImages[i], Math.floor(thisX - hero.isox - thisNPC.centreX + (canvasWidth / 2)), Math.floor(thisY - hero.isoy - thisNPC.centreY + (canvasHeight / 2))]);
                    thisNPCIdentifier = "npc" + thisMapData[whichVisibleMap].npcs[i].src;
                    assetsToDraw.push([findIsoDepth(thisNPC.x, thisNPC.y, thisNPC.z), "sprite", npcImages[thisNPCIdentifier], thisNPCOffsetCol * thisNPC.spriteWidth, thisNPCOffsetRow * thisNPC.spriteHeight, thisNPC.spriteWidth, thisNPC.spriteHeight, Math.floor(thisX - hero.isox - thisNPC.centreX + (canvasWidth / 2)), Math.floor(thisY - hero.isoy - thisNPC.centreY + (canvasHeight / 2) - thisNPC.z), thisNPC.spriteWidth, thisNPC.spriteHeight]);
                }
            }



            for (var i = 0; i < thisMapData[whichVisibleMap].items.length; i++) {
                thisItem = thisMapData[whichVisibleMap].items[i];


                shouldDrawThisItem = true;
                if (gameMode == 'housing') {
                    // if this item is part of the current player's plot, don't draw it here - it'll be drawn as part of the draft (and might be deleted) 
                    if (thisItem.lockedToPlayerId) {
                        if (thisItem.lockedToPlayerId == characterId) {
                            shouldDrawThisItem = false;
                        }
                    }
                }


                if (shouldDrawThisItem) {
                    thisX = findIsoCoordsX(thisItem.x, thisItem.y);
                    thisY = findIsoCoordsY(thisItem.x, thisItem.y);
                    if (isVisibleOnScreen(thisX, thisY)) {
                        //    console.log(whichVisibleMap+" - "+thisItem.type+" : "+thisX+", "+thisY+" : "+thisItem.x+", "+thisItem.y);
                        thisFileColourSuffix = "";
                        if (thisMapData[whichVisibleMap].items[i].colour) {
                            thisColourName = getColourName(thisItem.colour, thisItem.type);
                            if (thisColourName != "") {
                                thisFileColourSuffix = "-" + thisColourName.toLowerCase();

                            }
                        }
                        thisItemIdentifier = "item" + thisMapData[whichVisibleMap].items[i].type + thisFileColourSuffix;





                        // check for User Generated Content:
                        if (typeof thisMapData[whichVisibleMap].items[i].contains !== "undefined") {
                            if (typeof thisMapData[whichVisibleMap].items[i].contains['ugc-id'] !== "undefined") {
                                thisItemIdentifier = "item" + thisMapData[whichVisibleMap].items[i].type + '_' + thisMapData[whichVisibleMap].items[i].contains['ugc-id'];
                            }
                        }

                        if (typeof thisItem.animation !== "undefined") {
                            if (typeof thisItem.state !== "undefined") {
                                thisItemOffsetCol = (thisItem["animation"][thisItem.state]["length"]) - 1;
                                thisItemOffsetRow = thisItem["animation"][thisItem.state]["row"];
                            }
                            assetsToDraw.push([findIsoDepth(thisItem.x, thisItem.y, thisItem.z), "sprite", itemImages[thisItemIdentifier], thisItemOffsetCol * thisItem.spriteWidth, thisItemOffsetRow * thisItem.spriteHeight, thisItem.spriteWidth, thisItem.spriteHeight, Math.floor(thisX - hero.isox - thisItem.centreX + (canvasWidth / 2)), Math.floor(thisY - hero.isoy - thisItem.centreY + (canvasHeight / 2) - thisItem.z), thisItem.spriteWidth, thisItem.spriteHeight]);

                        } else if (thisItem.canBeRotated) {
                            // use facing - always in the format N, E, S, W vertically:


                            thisItemOffsetCol = 0;
                            thisItemOffsetRow = facingsPossible.indexOf(thisItem.facing);

                            assetsToDraw.push([findIsoDepth(thisItem.x, thisItem.y, thisItem.z), "sprite", itemImages[thisItemIdentifier], thisItemOffsetCol * thisItem.spriteWidth, thisItemOffsetRow * thisItem.spriteHeight, thisItem.spriteWidth, thisItem.spriteHeight, Math.floor(thisX - hero.isox - thisItem.centreX + (canvasWidth / 2)), Math.floor(thisY - hero.isoy - thisItem.centreY + (canvasHeight / 2) - thisItem.z), thisItem.spriteWidth, thisItem.spriteHeight]);

                        } else {
                            assetsToDraw.push([findIsoDepth(thisItem.x, thisItem.y, thisItem.z), "img", itemImages[thisItemIdentifier], Math.floor(thisX - hero.isox - thisItem.centreX + (canvasWidth / 2)), Math.floor(thisY - hero.isoy - thisItem.centreY + (canvasHeight / 2) - thisItem.z)]);
                        }
                    }
                }
            }

            if (thisMapData[whichVisibleMap].movingPlatforms) {
                for (var i = 0; i < thisMapData[whichVisibleMap].movingPlatforms.length; i++) {
                    thisPlatform = thisMapData[whichVisibleMap].movingPlatforms[i];
                    thisX = findIsoCoordsX(thisPlatform.x, thisPlatform.y);
                    thisY = findIsoCoordsY(thisPlatform.x, thisPlatform.y);
                    if (isVisibleOnScreen(thisX, thisY)) {
                        thisGraphicCentreX = thisMapData[whichVisibleMap].graphics[thisPlatform.graphic].centreX;
                        thisGraphicCentreY = thisMapData[whichVisibleMap].graphics[thisPlatform.graphic].centreY;
                        assetsToDraw.push([findIsoDepth(thisPlatform.x, thisPlatform.y, thisPlatform.z), "img", tileImages[thisPlatform.graphic], Math.floor(thisX - hero.isox - thisGraphicCentreX + (canvasWidth / 2)), Math.floor(thisY - hero.isoy - thisGraphicCentreY + (canvasHeight / 2))]);
                    }
                }
            }



        }

        assetsToDraw.sort(sortByLowestValue);







        if (isOverWorldMap) {

            // draw the sea:
            gameContext.rect(0, 0, canvasWidth, canvasHeight);
            gameContext.fillStyle = oceanPattern;
            gameContext.fill();


            var thisMapsGlobalOffsetX, thisMapsGlobalOffsetY, currentWorldMapPosX, currentWorldMapPosY;
            // find and draw any visible maps:
            for (var i = 0; i < visibleMaps.length; i++) {

                thisMapsGlobalOffsetX = thisMapData[(visibleMaps[i])].globalCoordinateTile0X * worldMapTileLength;
                thisMapsGlobalOffsetY = thisMapData[(visibleMaps[i])].globalCoordinateTile0Y * worldMapTileLength;
                currentWorldMapPosX = Math.floor((canvasWidth / 2) + getTileIsoCentreCoordX(0 + thisMapsGlobalOffsetX, 0 + thisMapsGlobalOffsetY) - hero.isox - (worldMapWidthPx / 2));
                currentWorldMapPosY = Math.floor((canvasHeight / 2) + getTileIsoCentreCoordY(0 + thisMapsGlobalOffsetX, 0 + thisMapsGlobalOffsetY) - hero.isoy - (tileH / 2));
                // draw the current map background in place:
                if (typeof backgroundImgs[(visibleMaps[i])] !== "undefined") {
                    gameContext.drawImage(backgroundImgs[(visibleMaps[i])], currentWorldMapPosX, currentWorldMapPosY);
                }
            }
        } else {
            // draw a black background:
            gameContext.fillStyle = "#000000";
            gameContext.fillRect(0, 0, canvasWidth, canvasHeight);
            gameContext.fill();


            // need to determine the offset for the top left corner of the map from the top left corner of the image #######

            if (typeof backgroundImgs[currentMap] !== "undefined") {
                gameContext.drawImage(backgroundImgs[currentMap], Math.floor(getTileIsoCentreCoordX(0, mapTilesY - 1) - thisMapData[currentMap].backgroundOffsetX - hero.isox - tileW / 2 + canvasWidth / 2), Math.floor(getTileIsoCentreCoordY(0, 0) - hero.isoy - thisMapData[currentMap].backgroundOffsetY - (tileH / 2) + canvasHeight / 2));
            }
        }



        // draw the sorted assets:
        for (var i = 0; i < assetsToDraw.length; i++) {
            switch (assetsToDraw[i][1]) {
                case "faeCentre":
                    // draw fae:
                    drawCircle("rgba(255,220,255,0.3)", assetsToDraw[i][2], assetsToDraw[i][3], 4);
                    drawCircle("#fec856", assetsToDraw[i][2], assetsToDraw[i][3], getRandomIntegerInclusive(1,2));
                    // draw fae's shadow - make it respond to the fae's height:
                    gameContext.fillStyle = "rgba(0,0,0," + (65 - fae.oscillateOffset) * 0.01 + ")";
                    gameContext.beginPath();
                    gameContext.ellipse(assetsToDraw[i][2] - getXOffsetFromHeight(fae.oscillateOffset), assetsToDraw[i][3] + fae.oscillateOffset, 3, 1, 0, 0, 2 * Math.PI);
                    gameContext.fill();
                    break;
                case "faeParticle":
                    gameContext.fillStyle = "rgba(255,220,255," + assetsToDraw[i][4] + ")";
                    gameContext.fillRect(assetsToDraw[i][2], assetsToDraw[i][3], 1, 1);
                    break;
                case "sprite":
                    // sprite image (needs slicing parameters):
                    if (typeof assetsToDraw[i][2] !== "undefined") {
                        // image has been loaded
                        if (typeof assetsToDraw[i][11] !== "undefined") {
                            gameContext.globalAlpha = assetsToDraw[i][11];
                        }
                        gameContext.drawImage(assetsToDraw[i][2], assetsToDraw[i][3], assetsToDraw[i][4], assetsToDraw[i][5], assetsToDraw[i][6], assetsToDraw[i][7], assetsToDraw[i][8], assetsToDraw[i][9], assetsToDraw[i][10]);
                        if (typeof assetsToDraw[i][11] !== "undefined") {
                            gameContext.globalAlpha = 1;
                        }
                    }
                    break;
                case "dowsingRing":
                    gameContext.globalCompositeOperation = 'lighten';
                    // draw the dowsing ring:
                    drawEllipse(gameContext, assetsToDraw[i][2] + (100 - dowsing.proximity) / 2, assetsToDraw[i][3] + (100 - dowsing.proximity) / 4, dowsingRingSize * dowsing.proximity / 100, (dowsingRingSize * dowsing.proximity / 100) / 2, true, 'rgba(255,255,0,0.3)');
                    // draw the outline:
                    drawEllipse(gameContext, assetsToDraw[i][2], assetsToDraw[i][3], dowsingRingSize, dowsingRingSize / 2, false, 'rgba(255,255,0,0.3)');
                    // restore the composite mode to the default:
                    gameContext.globalCompositeOperation = 'source-over';
                    break;
                case "ghostRemoveHousingTile":
                    drawIsoRectangle(housingNameSpace.mousePosition[0] * tileW, housingNameSpace.mousePosition[1] * tileW, ((housingNameSpace.mousePosition[0]) + 1) * tileW, ((housingNameSpace.mousePosition[1] + 1) * tileW), true, 'rgba(255,0,0,0.3)');
                    break;
                case "ghostSelectedHousingTile":

                    gameContext.globalAlpha = 0.5;
                    // draw ghost tile:
                    thisFileColourSuffix = "";
                    if (housingNameSpace.whichDyeColourActive != "0") {
                        var thisColourName = colourNames[housingNameSpace.whichDyeColourActive];
                        thisFileColourSuffix = "-" + thisColourName.toLowerCase();
                    }
                    thisItemIdentifier = "item" + housingNameSpace.whichTileActive + thisFileColourSuffix;
                    if (typeof itemImages[thisItemIdentifier] !== "undefined") {
                        thisX = getTileIsoCentreCoordX(housingNameSpace.mousePosition[0], housingNameSpace.mousePosition[1]);
                        thisY = getTileIsoCentreCoordY(housingNameSpace.mousePosition[0], housingNameSpace.mousePosition[1]);
                        thisZ = getElevation(housingNameSpace.mousePosition[0], housingNameSpace.mousePosition[1]);
                        if (housingNameSpace.currentTileCanBeElevated) {
                            thisZ += housingNameSpace.whichZIndexActive;
                        }

                        // check inventory data first, and if not use housingData:
                        if (typeof currentActiveInventoryItems[(housingNameSpace.whichTileActive)] !== "undefined") {
                            thisCentreX = currentActiveInventoryItems[(housingNameSpace.whichTileActive)].centreX;
                            thisCentreY = currentActiveInventoryItems[(housingNameSpace.whichTileActive)].centreY;


                            thisItemCanBeRotated = currentActiveInventoryItems[(housingNameSpace.whichTileActive)].canBeRotated;

                            thisItemSpriteHeight = currentActiveInventoryItems[(housingNameSpace.whichTileActive)].spriteHeight;
                            thisItemSpriteWidth = currentActiveInventoryItems[(housingNameSpace.whichTileActive)].spriteWidth;
                        } else {
                            thisCentreX = housingData[housingNameSpace.whichTileActive].centreX;
                            thisCentreY = housingData[housingNameSpace.whichTileActive].centreY
                            thisItemCanBeRotated = housingData[housingNameSpace.whichTileActive].canBeRotated;
                            thisItemSpriteHeight = housingData[housingNameSpace.whichTileActive].spriteHeight;
                            thisItemSpriteWidth = housingData[housingNameSpace.whichTileActive].spriteWidth;
                        }



                        if (thisItemCanBeRotated) {
                            thisItemOffsetRow = facingsPossible.indexOf(housingNameSpace.whichFacingActive);

                            gameContext.drawImage(itemImages[thisItemIdentifier], 0, thisItemOffsetRow * thisItemSpriteHeight, thisItemSpriteWidth, thisItemSpriteHeight, Math.floor(thisX - hero.isox - thisCentreX + (canvasWidth / 2)), Math.floor(thisY - hero.isoy - thisCentreY + (canvasHeight / 2) - thisZ), thisItemSpriteWidth, thisItemSpriteHeight);
                        } else {
                            gameContext.drawImage(itemImages[thisItemIdentifier], Math.floor(thisX - hero.isox - thisCentreX + (canvasWidth / 2)), Math.floor(thisY - hero.isoy - thisCentreY + (canvasHeight / 2) - thisZ));
                        }
                    }
                    gameContext.globalAlpha = 1.0;
                    break;
                case "houseGroundPlan":
                    // draw house foot print:
                    drawIsoRectangle(hero.housing.northWestCornerTileX * tileW, hero.housing.northWestCornerTileY * tileW, (hero.housing.southEastCornerTileX) * tileW, (hero.housing.southEastCornerTileY) * tileW, true, 'rgba(255,255,0,0.2)');
                    break;
                case "plotPlacementOverlay":
                    gameContext.globalCompositeOperation = 'soft-light';
                    var mouseTilePosition = getTileCoordsFromScreenPosition(cursorPositionX, cursorPositionY);
                    // undefined first time:
                    if (cursorPositionX) {
                        var thisOverlayX, thisOverlayY, thisOverlayFill;
                        plotPlacement.numberOfBlockedTiles = 0;
                        for (var j = 0 - plotPlacement.width / 2; j < plotPlacement.width / 2; j++) {
                            for (var k = 0 - plotPlacement.length / 2; k < plotPlacement.length / 2; k++) {
                                thisOverlayX = mouseTilePosition[0] + j;
                                thisOverlayY = mouseTilePosition[1] + k;
                                thisOverlayFill = 'rgba(0,255,0,0.8)';
                                if (!tileIsClear(thisOverlayX, thisOverlayY)) {
                                    thisOverlayFill = 'rgba(255,0,0,0.8)';
                                    plotPlacement.numberOfBlockedTiles++;
                                }
                                drawIsoRectangle(thisOverlayX * tileW, thisOverlayY * tileW, (thisOverlayX + 1) * tileW, (thisOverlayY + 1) * tileW, true, thisOverlayFill);
                            }
                        }
                        //  console.log("number of blocked tiles: " + plotPlacement.numberOfBlockedTiles);
                    }
                    gameContext.globalCompositeOperation = 'source-over';
                    break;
                case "img":
                    // standard image:
                    if (typeof assetsToDraw[i][5] !== "undefined") {
                        gameContext.globalAlpha = assetsToDraw[i][5];
                    }
                    if (typeof assetsToDraw[i][2] !== "undefined") {
                        gameContext.drawImage(assetsToDraw[i][2], assetsToDraw[i][3], assetsToDraw[i][4]);
                    }
                    if (typeof assetsToDraw[i][5] !== "undefined") {
                        gameContext.globalAlpha = 1;
                    }
            }
        }

        if (activeObjectForDialogue != '') {
            UI.updateDialogue(activeObjectForDialogue);
        }

        if (thisMapData[currentMap].showOnlyLineOfSight) {
            // draw light map:
            lightMapContext.clearRect(0, 0, canvasWidth, canvasHeight);
            var thisLightMapValue;
            // start at -1 to cover the back edge tiles:
            for (var i = -1; i < mapTilesX; i++) {
                for (var j = -1; j < mapTilesY; j++) {
                    thisX = getTileIsoCentreCoordX(i, j);
                    thisY = getTileIsoCentreCoordY(i, j);
                    thisGraphicCentreX = 28;
                    thisGraphicCentreY = 17;
                    thisLightMapValue = 1;
                    if ((i > -1) && (j > -1)) {
                        thisLightMapValue = 1.01 - lightMap[j][i];
                    }
                    if (thisLightMapValue > 0) {
                        lightMapContext.save();
                        lightMapContext.globalAlpha = thisLightMapValue;
                        lightMapContext.drawImage(shadowImg, Math.floor(thisX - hero.isox - thisGraphicCentreX + (canvasWidth / 2)) / 4, Math.floor(thisY - hero.isoy - thisGraphicCentreY + (canvasHeight / 2)) / 4);
                        lightMapContext.restore();
                    } else {
                        // no need to shade:
                        lightMapContext.drawImage(shadowImg, Math.floor(thisX - hero.isox - thisGraphicCentreX + (canvasWidth / 2)) / 4, Math.floor(thisY - hero.isoy - thisGraphicCentreY + (canvasHeight / 2)) / 4);
                    }
                }
            }
        }

        // draw the map transition if it's needed:
        if (mapTransition == "out") {
            var gradientSize = (1 - (mapTransitionCurrentFrames / mapTransitionMaxFrames));

            if (gradientSize < 0.02) {
                // draw a rectangle, otherwise a pixel hole is still visible:
                gameContext.fillStyle = "#000000";
                gameContext.fillRect(0, 0, canvasWidth, canvasHeight);
            } else {
                var gradient = gameContext.createRadialGradient(canvasWidth / 2, canvasHeight / 2, gradientSize * canvasWidth / 2, canvasWidth / 2, canvasHeight / 2, 0);
                gradient.addColorStop(0, "rgba(0,0,0,1)");
                gradient.addColorStop(1, "rgba(0,0,0,0)");
                gameContext.fillStyle = gradient;
                gameContext.fillRect(0, 0, canvasWidth, canvasHeight);
            }
        } else if (mapTransition == "in") {
            var gradientSize = ((mapTransitionCurrentFrames / mapTransitionMaxFrames));
            var gradient = gameContext.createRadialGradient(canvasWidth / 2, canvasHeight / 2, gradientSize * canvasWidth / 2, canvasWidth / 2, canvasHeight / 2, 0);
            gradient.addColorStop(0, "rgba(0,0,0,1)");
            gradient.addColorStop(1, "rgba(0,0,0,0)");
            gameContext.fillStyle = gradient;
            gameContext.fillRect(0, 0, canvasWidth, canvasHeight);
        }
    }
}


// check if it cuts the mustard and supports Canvas:
if (('querySelectorAll' in document && 'addEventListener' in window) && (!!window.HTMLCanvasElement)) {
    loadGlobalMapData();
} else {
    // sorry message / fallback? #####
}