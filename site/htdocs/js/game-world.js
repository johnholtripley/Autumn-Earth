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
    'lever': '../sounds/lever-NOT_MINE.mp3',
    'keys': '../sounds/keys-NOT_MINE-wow.mp3',
    'unlock': '../sounds/unlock-NOT_MINE-wow.mp3',
    'gather1': '../sounds/gather-herb-NOT_MINE-wow.mp3',
    'gather4': '../sounds/mining-NOT_MINE-wow.mp3',
    'rain': '../sounds/rain-NOT_MINE-youtube.mp3'
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

    playSound: function(buffer, delay) {
        var source = audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(soundGainNode);
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

    adjustEffectsVolume: function() {
        gameSettings.soundVolume = soundVolume.value;
        if (typeof soundGainNode !== "undefined") {
            soundGainNode.gain.setValueAtTime(gameSettings.soundVolume,0);
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
        if (thisMapData.ambientSounds) {
            if ((hero.totalGameTimePlayed - timeSinceLastAmbientSoundWasPlayed) > minTimeBetweenAmbientSounds) {
                if (getRandomIntegerInclusive(1, 240) == 1) {
                    timeSinceLastAmbientSoundWasPlayed = hero.totalGameTimePlayed;
                    audio.playSound(soundEffects[getRandomKeyFromObject(thisMapData.ambientSounds)], 0);
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
    // check it's not got an inherent colour:
    if (currentActiveInventoryItems[itemType].hasInherentColour != 1) {
        colourName = colourNames[colour];
    }
    return colourName;
}



function mixColours() {
    // use to get the resulting colour from any number of colours passed in.
    // eg. resultingColour = mixColours(4,2,8,16,16,16,16,16,16,16,16,16);
    // display name would then be colourNames[resultingColour]
    var colIndex = 0;
    var amountOfBlack = 0;
    var amountOfWhite = 0;
    var colourQuantities = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (var i = 0; i < arguments.length; i++) {
        colourQuantities[(arguments[i])]++;
        colIndex |= arguments[i];
        // check for black and white bit in this colour:
        if (arguments[i] == (16 | arguments[i])) {
            amountOfBlack++;
        }
        if (arguments[i] == (8 | arguments[i])) {
            amountOfWhite++;
        }
    }
    // determine if there was one colour more prevalent than the others - if so, make the output colour this colour:
    for (var i = 0; i < colourQuantities.length; i++) {
        if (colourQuantities[i] / arguments.length > 0.7) {
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
var animationUpdateTime = (1000 / animationFramesPerSecond);

var gameCanvas, gameContext, gameMode, cartographyContext, cartographyCanvas, offScreenCartographyCanvas, offScreenCartographyContext, canvasMapImage, canvasMapImage, canvasMapMaskImage, heroImg, shadowImg, imagesToLoad, tileImages, npcImages, itemImages, backgroundImg, objInitLeft, objInitTop, dragStartX, dragStartY, inventoryCheck, timeSinceLastAmbientSoundWasPlayed, gameSettings, lightMap, lightMapOverlay, lightMapContext, activeGatheredObject, questResponseNPC, cursorPositionX, cursorPositionY;
var chestIdOpen = -1;
var currentWeather = "";
var outsideWeather = "";
var weatherLastChangedTime = 0;
const minTimeBetweenWeatherChanges = 5000;
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
    "active": true
};
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
var thisMapData = '';
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

var currentActiveInventoryItems = [];
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

// key bindings
var key = [0, 0, 0, 0, 0, 0, 0];

var hero = {
    x: 0,
    y: 0,
    z: 0,
    dx: 0,
    dy: 0,

    breadcrumb: [],

    width: 20,
    length: 20,
    centreX: 40,
    centreY: 69,
    speed: 4,
    //   animationFrameIndex: 0,
    //   timeSinceLastFrameSwap: 0,
    //   animationUpdateTime: (1000 / animationFramesPerSecond),
    spriteWidth: 62,
    spriteHeight: 79,
    isMoving: false,
    facing: 'n',
    "animation": {
        "walk": {
            "length": 1,
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
    for (i = 0; i < foundKeys.length; i++) {
        // only show those keys that are in this filter set:
        if (recipeFilter.value.indexOf(foundKeys[i]) != -1) {
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
    craftingSelectComponentsPanel.classList.add("active");
    var recipeId = whichRecipe.substring(6);
    var foundItemGroups;
    var thisRecipe = hero.crafting[currentRecipePanelProfession].recipes[recipeId];
    var beingCreatedMarkup = '<img src="/images/game-world/inventory-items/' + thisRecipe.imageId + '.png" alt="' + thisRecipe.recipeName + '"><h3>' + thisRecipe.recipeName + '</h3><p>' + thisRecipe.recipeDescription + '</p><h4>Requires:</h4>';
    // find all components that the player has that are usable for this recipe as well:
    var availableComponentMarkup = '<h4>Available:</h4><ul>';
    var componentsRequired = thisRecipe.components.split(",");
    var componentsFound = 0;
    beingCreatedMarkup += '<ul>';
    for (var i = 0; i < componentsRequired.length; i++) {
        if (!(isNaN(componentsRequired[i]))) {
            // specific item:
            beingCreatedMarkup += '<li><img src="/images/game-world/inventory-items/' + componentsRequired[i] + '.png" alt="' + currentActiveInventoryItems[componentsRequired[i]].shortname + '">' + currentActiveInventoryItems[componentsRequired[i]].shortname + '</li>';
            foundItemGroups = findSlotItemIdInInventory(componentsRequired[i]);
            if (foundItemGroups.length > 0) {
                for (var j = 0; j < foundItemGroups.length; j++) {
                    availableComponentMarkup += '<li id="fromSlot'+foundItemGroups[j]+'">' + generateSlotMarkup(foundItemGroups[j]) + '</li>';
                    componentsFound++;
                }
            }
        } else {
            // item group:
            beingCreatedMarkup += '<li><img src="/images/game-world/inventory-items/' + componentsRequired[i] + '.png" alt="">' + currentItemGroupFilters[(componentsRequired[i])] + '</li>';
            foundItemGroups = hasItemTypeInInventory(componentsRequired[i]);
            if (foundItemGroups.length > 0) {
                for (var j = 0; j < foundItemGroups.length; j++) {
                    availableComponentMarkup += '<li id="fromSlot'+foundItemGroups[j]+'">' + generateSlotMarkup(foundItemGroups[j]) + '</li>';
                    componentsFound++;
                }
            }
        }
    }
    if (componentsFound == 0) {
        availableComponentMarkup += "<li><p>You don't have any of the required components for this recipe.</p></li>";
    }
    // add the dye slot, only if the created item can be dyed:
    if (currentActiveInventoryItems[thisRecipe.creates].dyeable > 0) {
        beingCreatedMarkup += '<li><img src="/images/game-world/inventory-items/dye.png" alt="">Optional dye</li>';
    }
    // add the enchant slot:
    beingCreatedMarkup += '<li><img src="/images/game-world/inventory-items/enchant.png" alt="">Imbue item (optional)</li>';
    beingCreatedMarkup += '</ul>';
    availableComponentMarkup += '</ul>';
    selectComponentsItemBeingCreated.innerHTML = beingCreatedMarkup;
    componentsAvailableForThisRecipe.innerHTML = availableComponentMarkup;
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
    if (thisMapData.hiddenResources[dowsing.category]) {
        var closestDistance = Infinity;
        var thisDistance;
        var whichIndex = -1;
        // find the nearest node - of the correct type and react to that:
        for (var i = 0; i < thisMapData.hiddenResources[dowsing.category].length; i++) {
            thisDistance = getPythagorasDistance(hero.tileX, hero.tileY, thisMapData.hiddenResources[dowsing.category][i].tileX, thisMapData.hiddenResources[dowsing.category][i].tileY);
            if (thisDistance < closestDistance) {
                closestDistance = thisDistance;
                whichIndex = i;
            }
        }
        if (whichIndex != -1) {
            dowsing.proximity = 100 - (100 * ((closestDistance) / dowsing.range));
            dowsing.proximity = capValues(dowsing.proximity, 0, 100);
        } else {
            dowsing.proximity = 0;
        }
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
    if (thisMapData.hiddenResources[surveying.category]) {
        for (var i = 0; i < thisMapData.hiddenResources[surveying.category].length; i++) {
            thisResource = thisMapData.hiddenResources[surveying.category][i];
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
                    thisMapData.items.push(thisResource);
                    initialiseItem(thisMapData.items.length - 1);
                    resourceFound = true;
                } else {
                    console.log("Error - Couldn't place resource node");
                }
                break;
            }
        }
    }
    if (!resourceFound) {
        UI.showNotification('<p>No resources found</p>');
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

function checkForGamePadInput() {
    if (Input.isUsingGamePad) {
        // added these next 3 lines to prevent occassional errors in Chrome:
        if (typeof Input.gamePad !== "undefined") {
            if (Input.gamePad !== null) {
                if (typeof Input.gamePad.timestamp !== "undefined") {
                    // check if an update has happened since the last one that was acted on:
                    if (Input.gamePad.timestamp != Input.gameLastPadTimeStamp) {
                        Input.gameLastPadTimeStamp = Input.gamePad.timestamp;
                        // left:
                        key[0] = Input.gamePad.axes[1] <= -0.5;
                        // right:
                        key[1] = Input.gamePad.axes[1] >= 0.5;
                        // up: 
                        key[2] = Input.gamePad.axes[2] <= -0.5;
                        // down:
                        key[3] = Input.gamePad.axes[2] >= 0.5;
                        // action (X):
                        key[4] = Input.gamePad.buttons[2].value > 0;
                        // shift (right shoulder 1):
                        key[5] = Input.gamePad.buttons[7].value > 0;
                    }
                }
            }
        }
    }
}
function checkForRespawns() {
    for (var i = 0; i < thisMapData.items.length; i++) {
        if (currentActiveInventoryItems[thisMapData.items[i].type].action == "node") {
            if (thisMapData.items[i].state != "active") {
                //console.log("check re-spawn: " + hero.totalGameTimePlayed + "-" + thisMapData.items[i].timeLastHarvested + " (" + (hero.totalGameTimePlayed - thisMapData.items[i].timeLastHarvested) + ") >= " + currentActiveInventoryItems[thisMapData.items[i].type].respawnRate);
                if (hero.totalGameTimePlayed - thisMapData.items[i].timeLastHarvested >= currentActiveInventoryItems[thisMapData.items[i].type].respawnRate) {
                    thisMapData.items[i].state = "active";
                }
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
        UI.showNotification('<p>Resource failed - nothing was gathered</p>');
        gatheringPanel.classList.remove('active');
    } else {
        var generatedObject = gathering.node.contains[0];
        var quantityOfItem = Math.floor((gathering.purity / 100) * (gathering.node.maxQuantity - gathering.quantity));
        // console.log("gathered " + quantityOfItem + "x " + currentActiveInventoryItems[generatedObject.type].shortname + " of " + gathering.quality + " quality");
        var createdMarkup = '<ol><li>';
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
        createdMarkup += generateGenericSlotMarkup(activeGatheredObject);
        createdMarkup += '</li></ol>';
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
        // loop through hidden resources (of this type) and remove it:
        for (var i = 0; i < thisMapData.hiddenResources[(currentActiveInventoryItems[gathering.node.type].category)].length; i++) {
            if (thisMapData.hiddenResources[(currentActiveInventoryItems[gathering.node.type].category)][i] === gathering.node) {
                thisMapData.hiddenResources[(currentActiveInventoryItems[gathering.node.type].category)].splice(i, 1);
                break;
            }
        }
        // loop through items and remove it:
        for (var i = 0; i < thisMapData.items.length; i++) {
            if (thisMapData.items[i] === gathering.node) {
                thisMapData.items.splice(i, 1);
                break;
            }
        }
    }
    gathering = {};
}




// find Iso coords from 2d coords:
function findIsoCoordsX(x, y) {
   // return Math.floor((mapTilesY * tileW/2) -y/2 + x/2);
   return Math.floor((mapTilesY * tileW - y + x)/2);
}
function findIsoCoordsY(x, y) {
    // the -tileH/2 is because the tile centre was at 0,0, and so the tip would be off the top of the screen
//return Math.floor((x/4) + (y/4) - tileH/2);
return Math.floor((x + y - (tileH * 2))/4);
}



// find 2d coords from iso coords:
function find2DCoordsX(isoX, isoY) {
    return isoX + tileH + (2*isoY) - (mapTilesY*tileW)/2;
}

function find2DCoordsY(isoX, isoY) {
    return 2*isoY + tileH - isoX + (mapTilesY*tileW)/2;
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
return (findIsoCoordsY(x,y) * tileW/2) + (z * 2);
// ----------------------------



}


// find non-iso coords for a tile
function getTileCentreCoordX(tileX) {
    return tileX*tileW + tileW/2;
}
function getTileCentreCoordY(tileY) {
    return tileY*tileW + tileW/2;
}


// find iso coords for a tile
function getTileIsoCentreCoordX(tileX, tileY) {
    return tileW / 2 * (mapTilesY - tileY + tileX);
}
function getTileIsoCentreCoordY(tileX, tileY) {
    return tileH / 2 * (tileY + tileX);
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
    return Math.floor(x/tileW);
}
function getTileY(y) {
    return Math.floor(y/tileW);
}


function getElevation(tileX, tileY) {
    return thisMapData.elevation[tileY][tileX];
}


function getXOffsetFromHeight(height) {
    // for determining a shadow's offset (for example).
    return (Math.sqrt(2) / 2 * height);
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

function accessDynamicVariable(variableToUse) {
    var variableComponents = variableToUse.split(".");
    var currentElement = window;
    for (var i = 0; i < variableComponents.length; i++) {
        if (currentElement[variableComponents[i]]) {
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



 function getObjectKeysForInnerValue( testObject, value, attribute ) {
   // console.log("looking for "+value);
    // return an array of all keys in the object that have a value that match the one passed in
   var keysFound = [];
    for(var prop in testObject) {
        if( testObject.hasOwnProperty(prop)) {
       //     console.log("checking:"+testObject[prop][attribute]);
             if(testObject[prop][attribute] === value) {

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
        var context = this, args = arguments;
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


const facingsPossible = ["n","e","s","w"];

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
    return keys[ keys.length * Math.random() << 0];
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
    return moneyOutput;
}





function hasLineOfSight(startX, startY, endX, endY) {

    var nextX = startX;
    var nextY = startY;
    var pathY = [];
    var pathX = [];
    var deltaY = endY - startY;
    var deltaX = endX - startX;
    var currentStep = 0;
    var fraction, previousX, previousY, stepX, stepY, thisInnerDoor;



    var needToCheckInnerDoors = false;
    if (typeof thisMapData.innerDoors !== "undefined") {
        needToCheckInnerDoors = true;
    }


// check the starting tile:
   if (thisMapData.collisions[startY][startX] != 0) {
                // tile is non-walkable;
                return false;
                
            }
                    if (needToCheckInnerDoors) {
                thisInnerDoor = currentMap + "-" + startX + "-" + startY;
                if (thisMapData.innerDoors.hasOwnProperty(thisInnerDoor)) {
                    // an Inner Door exists at this location:
                    if (!thisMapData.innerDoors[thisInnerDoor]['isOpen']) {
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
            if (thisMapData.collisions[nextY][nextX] != 0) {
                // tile is non-walkable:
                return false;
                break;
            }
            if (needToCheckInnerDoors) {
                thisInnerDoor = currentMap + "-" + nextX + "-" + nextY;
                if (thisMapData.innerDoors.hasOwnProperty(thisInnerDoor)) {
                    // an Inner Door exists at this location:
                    if (!thisMapData.innerDoors[thisInnerDoor]['isOpen']) {
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
            if (thisMapData.collisions[nextY][nextX] != 0) {
                // tile is non-walkable;
                return false;
                break;
            }
            if (needToCheckInnerDoors) {
                thisInnerDoor = currentMap + "-" + nextX + "-" + nextY;
                if (thisMapData.innerDoors.hasOwnProperty(thisInnerDoor)) {
                    // an Inner Door exists at this location:
                    if (!thisMapData.innerDoors[thisInnerDoor]['isOpen']) {
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

function sortByHighestValue(a,b) {
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



function drawCircle(fillStyle,x,y,radius) {
    gameContext.fillStyle = fillStyle;
    gameContext.beginPath();
    gameContext.arc(x,y,radius, 0, 2 * Math.PI);
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
                if(wasParsedOk) {
                successHandler && successHandler(data);
            }
            } else {
                errorHandler && errorHandler(status);
            }
        }
    };
    xhr.send();
};


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




function sendDataWithoutNeedingAResponse(url) {
// send data to the server, without needing to listen for a response:
var xhr = typeof XMLHttpRequest != 'undefined' ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
    xhr.open('get', url, true);
    xhr.send();
}

function postData(url,data) {
// send data to the server, without needing to listen for a response:
var xhr = typeof XMLHttpRequest != 'undefined' ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');

    xhr.open('post', url, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;');
    xhr.send(data);
}


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
            //  console.log("Load complete.");
            onComplete();
        }

    };

    function onImageError(e) {
        console.log("Error on loading the image: " + e.srcElement);
    }

    function loadImage(name, src) {
        //console.log("loading "+name+" - "+src);
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


var allCardPacks = [
    [1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3],
    [1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3]
];

//tempCardData = '{[[null, null, null],["5", "10", "Bomb"],["5", "10", "Chocobo"],["5", "10", "Mog"],["5", "10", "Cactuar"],["5", "10", "Shiva"],["5", "10", "Tonberry"],["5", "10", "Slime"]]}';
  //  cardGameNameSpace.allCardData = tempCardData;

function cardGamePlayer2Wins() {
    // player won
    hero.stats.cardGamesWon++;
    hero.currency.cardDust += 7;
    UI.updateCurrencies();
    delete thisChallengeNPC.isPlayingCards;
    processPlayerWinSpeech(thisChallengeNPC, thisChallengeNPC.cardGameSpeech.lose[0], thisChallengeNPC.cardGameSpeech.lose[1]);
    closeCardGame();
}

function cardGamePlayer1Wins() {
    console.log(thisChallengeNPC);
    // player lost
    hero.stats.cardGamesLost++;
    hero.currency.cardDust += 1;
    UI.updateCurrencies();
     delete thisChallengeNPC.isPlayingCards;
    processSpeech(thisChallengeNPC, thisChallengeNPC.cardGameSpeech.win[0], thisChallengeNPC.cardGameSpeech.win[1]);
    closeCardGame();
}

function cardGameIsDrawn() {
     console.log(thisChallengeNPC);
    hero.stats.cardGamesDrawn++;
    hero.currency.cardDust += 3;
    UI.updateCurrencies();
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
    if (hero.cards.length >= 12) {
        cardGameNameSpace.player2Cards = hero.cards.slice(0, 12);
        // combine the NPC's unique cards with their base pack and pick the first 12:
        cardGameNameSpace.player1Cards = opponentNPC.uniqueCards.concat(allCardPacks[opponentNPC.baseCardPack]).slice(0, 12);
        cardGameNameSpace.player1Skill = opponentNPC.cardSkill;
        if (opponentNPC.cardBackColour) {
            cardGameNameSpace.NPCCardBackColour = opponentNPC.cardBackColour;
        } else {
            cardGameNameSpace.NPCCardBackColour = undefined;
        }
        cardGameNameSpace.initialiseCardGame();
        cardGameWrapper.classList.add("active");
        opponentNPC.isPlayingCards = true;
    } else {
        UI.showNotification('<p>You don\'t have enough cards</p>');
    }
}



function closeCardGame() {
    gameMode = "play";
    
    cardGameWrapper.classList.remove("active");
    document.getElementById("cardGame").removeEventListener("click", cardGameNameSpace.canvasClick, false);
}

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
                Input.gamePad = navigator.getGamepads()[0];
            });
            window.addEventListener("gamepaddisconnected", function(e) {
                Input.isUsingGamePad = false;
                Input.gamePad = null;
            });
        }


    },

    // called on key up and key down events
    changeKey: function(e, to, type) {
        var focussedTagType = document.activeElement.tagName;
        // don't react to key presses if the currently focussed element is an input:
        if ((focussedTagType != "INPUT") && (focussedTagType != "TEXTAREA") && (focussedTagType != "SELECT")) {
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
            }
        }
    }
}
function canAddItemToInventory(itemObj) {
    // takes an array of objects and checks if all of them can be added before adding any of them
    // make copy of inventory:
    var inventoryClone = JSON.parse(JSON.stringify(hero.inventory));
    var slotsUpdated = [];
    var allItemsAdded = true;
    var moneyToAdd = 0;
    for (var k = 0; k < itemObj.length; k++) {
        // check for any money items:
    

        if ((typeof(itemObj[k]) === 'string') && (itemObj[k].charAt(0) == "$")) {
            moneyToAdd += parseInt(itemObj[k].substring(1));
           
        } else if (itemObj[k].type == "$") {
            moneyToAdd += itemObj[k].quantity;
        } else {
            var quantityAddedSoFar = 0;
            // check if this type exist in the current inventory:
            var inventoryKeysFound = getObjectKeysForInnerValue(inventoryClone, itemObj[k].type, "type");
            if (inventoryKeysFound.length > 0) {
                // loop through keysFound and add to the slot maximum
                for (var i = 0; i < inventoryKeysFound.length; i++) {
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
                            inventoryClone[thisSlotsID].inscription = {};
                            inventoryClone[thisSlotsID].inscription.title = itemObj[k].inscription.title;
                            inventoryClone[thisSlotsID].inscription.content = itemObj[k].inscription.content;
                            inventoryClone[thisSlotsID].inscription.timeCreated = itemObj[k].inscription.timeCreated;
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
        // return success, and the slots that were affected:
        return [true, slotsUpdated];
    } else {
        // don't change the current inventory - return false:
        return [false];
    }
}

function hasItemInInventory(itemType, amountNeeded) {
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

function addToInventory(whichSlot, itemObject) {
    // make a copy not a reference:
    hero.inventory[whichSlot] = JSON.parse(JSON.stringify(itemObject));
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
                                UI.showNotification("<p>You don't have room for all of these items.</p>");
                            }
                        }
                    }
                    break;
                case "booster":
                    openBoosterPack();
                    removeFromInventory(whichSlotNumber, 1);
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
                case "inscribe":
                    UI.openInscriptionPanel();
                    break;
                case "collection":
                    // check if this zone key exists in the hero.collections object
                    if (hero.collections.hasOwnProperty(whichActionValue)) {
                        // find  in the array and make it negative ####
                        var foundIndex = hero.collections[whichActionValue].required.indexOf(hero.inventory[whichSlotNumber].type);
                        if (foundIndex != -1) {
                            if (hero.collections[whichActionValue].required[foundIndex] > 0) {
                                hero.collections[whichActionValue].required[foundIndex] = 0 - (hero.collections[whichActionValue].required[foundIndex]);
                                // update the panel visually:
                                document.getElementById(whichActionValue + '-' + hero.inventory[whichSlotNumber].type).classList.remove('notCollected');
                                removeFromInventory(whichSlotNumber, 1);
                            } else {
                                UI.showNotification("<p>Already added to a collection</p>");
                            }
                        }
                    }
                    break;
                case "card":
                    hero.cards.unshift(whichActionValue);
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
                    document.getElementById("book" + whichActionValue).classList.add("active");
                    audio.playSound(soundEffects['bookOpen'], 0);
                case "recipe":
                    if (canLearnRecipe(whichActionValue)) {
                        removeFromInventory(whichSlotNumber, 1);
                    }
                    break;
                case "craft":
                    if (hero.professionsKnown.indexOf(parseInt(whichActionValue)) != -1) {
                        audio.playSound(soundEffects['buttonClick'], 0);
                        UI.populateRecipeList(whichActionValue);
                    } else {
                        UI.showNotification("<p>You don't know this profession yet.</p>");
                    }
                    break;
                case "deed":
                    // #####
                    var actionValueSplit = whichActionValue.split('x');
                    plotPlacement.width = actionValueSplit[0];
                    plotPlacement.length = actionValueSplit[1];
                    activeAction = "plotPlacement";
                    document.addEventListener("mousemove", UI.movePlotPlacementOverlay, false);
                    //document.removeEventListener("mousemove", UI.movePlotPlacementOverlay, false);
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
                if (hero.recipesKnown[i][0] == currentActiveInventoryItems[thisItemObject.type].actionValue) {
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
    if (thisAction) {
        if (thisAction.indexOf("book") != -1) {
            if (thisItemObject.inscription.content) {
                isABook = true;

            }
        }
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

    var thisCategories = currentActiveInventoryItems[thisItemObject.type].category.split(",");
    for (var i = 0; i < thisCategories.length; i++) {
        imageClassName += "itemCategory" + thisCategories[i] + " ";
    }



    // check if it's a card:
    if (currentActiveInventoryItems[thisItemObject.type].action == "card") {
        imageClassName += 'players card';
    }

    slotMarkup += '<img src="/images/game-world/inventory-items/' + thisItemObject.type + thisFileColourSuffix + '.png" ' + dataActionMarkup + 'alt="' + theColourPrefix + currentActiveInventoryItems[thisItemObject.type].shortname + '" class="' + imageClassName + '">';
    if (isABook) {
        var itemsDescription = "&quot;" + thisItemObject.inscription.title + "&quot;";
    } else {
        var itemsDescription = currentActiveInventoryItems[thisItemObject.type].description;
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
            itemsDescription = itemsDescription.replace('##contains##', containsItems);
        }
    }
    slotMarkup += '<p><em>' + theColourPrefix + currentActiveInventoryItems[thisItemObject.type].shortname + ' </em>' + itemsDescription + ' ';
    slotMarkup += '<span class="price">Sell price: ' + parseMoney(Math.ceil(thisItemObject.quantity * sellPriceModifier * inflationModifier * currentActiveInventoryItems[thisItemObject.type].priceCode, 0)) + '</span>';
    slotMarkup += '<span class="price specialismPrice">Sell price: ' + parseMoney(Math.ceil(thisItemObject.quantity * sellPriceSpecialismModifier * inflationModifier * currentActiveInventoryItems[thisItemObject.type].priceCode, 0)) + '</span>';
    slotMarkup += additionalTooltipDetail(thisItemObject) + '</p>';
    slotMarkup += '<span class="qty">' + thisItemObject.quantity + '</span>';
    slotMarkup += '<div class="coolDown"></div>';
    return slotMarkup;
}


function generateSlotMarkup(thisSlotsId) {
    return generateGenericSlotMarkup(hero.inventory[thisSlotsId]);
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
    'toggleJournal': 81
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

            // find which NPC this is:
            // http://stackoverflow.com/a/16100446/1054212
            var thisNPCsIndex = thisMapData.npcs.map(function(x) {
                return x.name;
            }).indexOf(thisAgentsName);  
             
            // insert the new path:
            // http://stackoverflow.com/a/7032717/1054212
            thisMapData.npcs[thisNPCsIndex].movement.splice.apply(thisMapData.npcs[thisNPCsIndex].movement, [thisMapData.npcs[thisNPCsIndex].movementIndex + 2, 0].concat(e.data[1]));




            thisMapData.npcs[thisNPCsIndex].waitingForAPath = false;
            if (typeof e.data[2] !== "undefined") {
                // store the target tile so it doesn't try and go straight back to it after:
                thisMapData.npcs[thisNPCsIndex].lastTargetDestination = e.data[2];
            }
        }
    }
}
function isAPetTerrainCollision(object, x, y) {
    // check map bounds first:
    var tileX = getTileX(x);
    var tileY = getTileY(y);
    if ((tileX < 0) || (tileY < 0) || (tileX >= mapTilesX) || (tileY >= mapTilesY)) {
        // is out of the bounds of the current map:
        return 1;
    } else {
        switch (thisMapData.collisions[tileY][tileX]) {
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

                    // check for collisions against NPCs:
                    for (var j = 0; j < thisMapData.npcs.length; j++) {
                        thisNPC = thisMapData.npcs[j];
                        if (thisNPC.isCollidable) {
                            if (isAnObjectCollision(thisPet.x, thisPet.y, thisPet.width, thisPet.length, thisNPC.x, thisNPC.y, thisNPC.width, thisNPC.length)) {
                                thisPet.x = oldPetX;
                                thisPet.y = oldPetY;
                            }
                        }
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


                    // check for inner doors:
                    if (typeof thisMapData.innerDoors !== "undefined") {
                        for (var i in thisMapData.innerDoors) {
                            thisInnerDoor = thisMapData.innerDoors[i];
                            if (!thisInnerDoor.isOpen) {
                                if (isAnObjectCollision(getTileCentreCoordX(thisInnerDoor.tileX), getTileCentreCoordY(thisInnerDoor.tileY), tileW, tileW, thisPet.x, thisPet.y, thisPet.width, thisPet.length)) {
                                     thisPet.x = oldPetX;
                                                thisPet.y = oldPetY;
                                }
                            }
                        }
                    }


                    // check for collisions against items:
                    for (var j = 0; j < thisMapData.items.length; j++) {
                        thisItem = thisMapData.items[j];
                        if (isAnObjectCollision(thisPet.x, thisPet.y, thisPet.width, thisPet.length, thisItem.x, thisItem.y, thisItem.width, thisItem.length)) {
                            thisPet.x = oldPetX;
                            thisPet.y = oldPetY;
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

                        // check for collisions against NPCs:
                        for (var j = 0; j < thisMapData.npcs.length; j++) {
                            thisNPC = thisMapData.npcs[j];
                            if (thisNPC.isCollidable) {
                                if (isAnObjectCollision(thisPet.x, thisPet.y, thisPet.width, thisPet.length, thisNPC.x, thisNPC.y, thisNPC.width, thisNPC.length)) {
                                    thisPet.x = oldPetX;
                                    thisPet.y = oldPetY;
                                }
                            }
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

                        // check for collisions against items:
                        for (var j = 0; j < thisMapData.items.length; j++) {
                            thisItem = thisMapData.items[j];
                            if (isAnObjectCollision(thisPet.x, thisPet.y, thisPet.width, thisPet.length, thisItem.x, thisItem.y, thisItem.width, thisItem.length)) {
                                thisPet.x = oldPetX;
                                thisPet.y = oldPetY;
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
                                pathfindingWorker.postMessage(['petToHero', hero.allPets[hero.activePets[p]], thisMapData, thisPetsTarget.tileX, thisPetsTarget.tileY, p]);
                                thisPet.state = "findingPath";
                                thisPet.foundPath = '';
                            }
                        } else {
                            if (thisPet.state != 'findingPath') {
                                // pathfind to hero
                                pathfindingWorker.postMessage(['petToHero', hero.allPets[hero.activePets[p]], thisMapData, thisPetsTarget.tileX, thisPetsTarget.tileY, p]);
                                thisPet.state = "findingPath";
                            }
                        }
                    }
                }
            }
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
    getJSON("/game-world/getQuestJournalEntries.php?questID=" + whichQuestId, function(data) {
        UI.addToQuestJournal(data);
    }, function(status) {
        // error - try again:
        addToJournal(whichQuestId);
    });
}

function removeFromJournal(whichQuestId) {
    var elementToRemove = document.getElementById("quest" + whichQuestId);
    elementToRemove.remove();
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



function openQuest(questId) {

    var okToStartQuest = true;
    // see if any items need to be given to start the quest:
    if (questData[questId].startItemsReceived) {
        var itemsToAdd = questData[questId].startItemsReceived.split(",");
        var allItemsToGive = [];
        for (var l = 0; l < itemsToAdd.length; l++) {
            // check if it's money:
            if (itemsToAdd[l].charAt(0) == "$") {
                thisRewardObject = itemsToAdd[l];
            } else {
                // check for any quantities:
                var thisQuestItem = itemsToAdd[l].split("x");
                var thisQuantity, thisItem;
                if (thisQuestItem.length > 1) {
                    thisQuantity = thisQuestItem[0];
                    thisItem = thisQuestItem[1];
                } else {
                    thisQuantity = 1;
                    thisItem = itemsToAdd[l];
                }
                // build item object:
                var thisRewardObject = {
                    "type": parseInt(thisItem),
                    "quantity": parseInt(thisQuantity),
                    "quality": 100,
                    "durability": 100,
                    "currentWear": 0,
                    "effectiveness": 100,
                    "colour": currentActiveInventoryItems[parseInt(thisItem)].colour,
                    "enchanted": 0,
                    "hallmark": 0,
                    "inscription": ""
                }
            }
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
    if (destination[0] == currentMap) {
        var destinationTileCentreX = getTileCentreCoordX(destination[1]);
        var destinationTileCentreY = getTileCentreCoordY(destination[2]);
        if (isInRange(whichNPC.x, whichNPC.y, destinationTileCentreX, destinationTileCentreY, destination[3] * tileW)) {
            // quest complete
            console.log("escort quest complete!!");
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
    removeFromJournal(whichQuestId);

}


function giveQuestRewards(whichNPC, whichQuestId) {
    // give any reward to the player:
    if (questData[whichQuestId].itemsReceivedOnCompletion) {
        var questRewards = questData[whichQuestId].itemsReceivedOnCompletion.split(",");
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
        // check for variation:
        var questPossibilities = questRewards[i].split("/");
        var questRewardToUse = getRandomElementFromArray(questPossibilities);
        //  console.log(questRewardToUse);

        // check if it's money:
        if (questRewardToUse.charAt(0) == "$") {
            thisRewardObject = questRewardToUse;
        } else {

            // check for any quantities:
            var thisQuestReward = questRewardToUse.split("x");
            var thisQuantity, thisItem;
            if (thisQuestReward.length > 1) {
                thisQuantity = thisQuestReward[0];
                thisItem = thisQuestReward[1];
            } else {
                thisQuantity = 1;
                thisItem = questRewards[i];
            }

            if (questPossibilities.length > 1) {
                // might need to show the name of the item in the speech:           
                thisSpeech = thisSpeech.replace(/##itemName##/i, currentActiveInventoryItems[parseInt(thisItem)].shortname);
            }
            // build item object:
            var thisRewardObject = {
                "type": parseInt(thisItem),
                "quantity": parseInt(thisQuantity),
                "quality": 100,
                "durability": 100,
                "currentWear": 0,
                "effectiveness": 100,
                "colour": currentActiveInventoryItems[parseInt(thisItem)].colour,
                "enchanted": 0,
                "hallmark": 0,
                "inscription": ""
            }
        }
        allRewardItems.push(thisRewardObject);
    }

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
        UI.showNotification("<p>Reward send by post to you</p>");
    }
}

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
const surveyingTimeBar = document.querySelector('#surveyingTimeBar .progressBar');
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

var notificationQueue = [];
var notificationIsShowing = false;

var retinueQuestTimeRemaining = [];
var allRetinueQuestTimers = document.getElementsByClassName('retinueQuestTimer');

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
        document.getElementById('craftingRecipeCreateButton').onclick = UI.craftingRecipeCreate;
        splitStackPanel.onsubmit = inventorySplitStackSubmit;
        shopSplitStackPanel.onsubmit = UI.shopSplitStackSubmit;
        toggleActiveCards.onclick = UI.toggleCardsDisplayed;
        document.getElementById('splitStackCancel').onclick = UI.inventorySplitStackCancel;
        document.getElementById('shopSplitStackCancel').onclick = UI.shopSplitStackCancel;
        toggleFullscreenSwitch.onchange = UI.toggleFullScreen;
        document.onfullscreenchange = UI.fullScreenChangeDetected;
        document.onmozfullscreenchange = UI.fullScreenChangeDetected;
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

        if (hero.professionsKnown.length > 0) {
            // load and cache the first profession's recipe assets:
            UI.populateRecipeList(hero.professionsKnown[0]);
            // but hide the panel initially:
            craftingPanel.classList.remove("active");
        }

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
        // check for startting a drag:
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
        }
    },

    doubleClick: function(e) {
        var thisItemsAction = e.target.getAttribute('data-action');
        if (thisItemsAction) {
            inventoryItemAction(e.target, thisItemsAction, e.target.getAttribute('data-action-value'));
        } else {
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
            }
        }
    },

    showDialogue: function(thisObjectSpeaking, text) {

        // check for random variation in text:
        var textToShow = getRandomElementFromArray(text.split("/"));
        if (activeObjectForDialogue != '') {
            dialogue.removeEventListener(whichTransitionEvent, UI.removeActiveDialogue, false);
        }
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
                parentClass = ' class="inactive"';
            } else {
                thisCardsQuantityOutput = '<span class="quantity">' + counts[i] + '</span>';
                foundThisType = true;
            }
            cardAlbumMarkup += '<li' + parentClass + '><img src="/images/card-game/cards/' + i + '.png" class="' + thisCardsClass + '" alt="' + cardGameNameSpace.allCardData[i][2] + ' card">' + thisCardsQuantityOutput + '</li>';

            // check for rares - these are the negative of the standard card type:
            if ((counts[(0 - i)])) {
                foundThisType = true;
                cardAlbumMarkup += '<li class="rare"><div class="card players" style="background-image:url(/images/card-game/cards/' + (0 - i) + '.png)"></div><span class="quantity">' + counts[(0 - i)] + '</span></li>';
            }
            if (foundThisType) {
                typesFound++;
            }
        }
        cardAlbumMarkup += '</ul>';
        cardAlbumMarkup += '<p>' + typesFound + ' types out of ' + (cardGameNameSpace.allCardData.length - 1) + '. Total individual cards: ' + hero.cards.length + '</p>';
        cardAlbumList.innerHTML = cardAlbumMarkup;
    },

    populateRecipeList: function(whichProfession) {
        if (currentRecipePanelProfession != whichProfession) {
            // clear previous searches:
            recipeSearch.value = '';
            clearRecipeSearch.classList.remove("active");
            var recipeMarkup = '<li id="noRecipesFound"><p>No recipes found.</p></li>';
            var thisRecipe;
            var filterMarkup = '';
            var thisFilter;

            for (var i = 0; i < hero.crafting[whichProfession].sortOrder.length; i++) {
                thisRecipe = hero.crafting[whichProfession].recipes[(hero.crafting[whichProfession].sortOrder[i])];
                recipeMarkup += '<li class="active" id="recipe' + hero.crafting[whichProfession].sortOrder[i] + '"><img src="/images/game-world/inventory-items/' + thisRecipe.imageId + '.png" alt="' + thisRecipe.recipeName + '"><h3>' + thisRecipe.recipeName + '</h3><p>' + thisRecipe.recipeDescription + '</p></li>';
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
            if (thisSlotImageElement.hasAttribute('data-contains')) {
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
                    addToInventory(droppedSlotId, UI.draggedInventoryObject);
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
                            UI.showNotification("<p>Not enough money</p>");
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
                                UI.showNotification("<p>Not enough money</p>");
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
                    UI.showNotification("<p>Not enough money</p>");
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

                } else if (e.target.parentNode.id == "gatheringPanel") {
                    if (activeAction == "gather") {
                        gatheringStopped();
                    }
                } else if (e.target.parentNode.id == "surveyingPanel") {
                    if (activeAction == "survey") {
                        surveyingStopped();
                    }
                } else if (e.target.parentNode.id == "inscriptionPanel") {

                    UI.resetInscriptionPanel();
                } else if (e.target.parentNode.id == "chestPanel") {
                    UI.closeChest();
                } else if (e.target.parentNode.id == "postPanel") {
                    UI.closePost();
                } else if (e.target.parentNode.id == "retinuePanel") {
                    UI.closeRetinuePanel();
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
        shopPanel.innerHTML = markup;
    },

    openShop: function(shopHash) {
        shopCurrentlyOpen = shopHash;
        document.getElementById("shop" + shopHash).classList.add("active");
        inventoryPanels.classList.add("shopSpecialism" + document.getElementById("shop" + shopHash).getAttribute('data-specialism'));
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
            if (thisSlotImageElement.hasAttribute('data-contains')) {
                thisBoughtObject.contains = thisSlotImageElement.getAttribute('data-contains');
            }
            inventoryCheck = canAddItemToInventory([thisBoughtObject]);
            if (inventoryCheck[0]) {
                hero.currency[thisCurrency] -= buyPriceForOne;
                UI.updateCurrencies();
                audio.playSound(soundEffects['coins'], 0);
                UI.showChangeInInventory(inventoryCheck[1]);
            } else {
                UI.showNotification("<p>Oops - sorry, no room in your bags</p>");
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
                UI.showNotification("<p>Oops - sorry, no room in your bags</p>");
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
                    UI.showNotification("<p>Oops - sorry, no room in your bags</p>");
                }
                break;
        }
    },

    updatePanelsAfterInventoryChange: function() {
        // called after any inventory add, remove or move so any panels can be updated to reflect the change
        UI.updateInscriptionPanel();
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

    toggleCardsDisplayed: function(e) {
        cardAlbumList.classList.toggle('showOnlyPlayers');
        toggleActiveCards.innerHTML = (toggleActiveCards.innerHTML == 'Show only collected cards' ? 'Show all cards' : 'Show only collected cards');
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

    openChest: function(itemReference) {
        var contents = thisMapData.items[itemReference].contains;
        audio.playSound(soundEffects['chestOpen'], 0);
        // open chest animation (thisMapData.items[itemReference]) ####

        // show container item name in the title:
        chestTitle.innerHTML = currentActiveInventoryItems[(thisMapData.items[itemReference].type)].shortname;

        // build contents:
        var chestContents = '';
        var thisChestObject;
        for (var i = 0; i < currentActiveInventoryItems[(thisMapData.items[itemReference].type)].actionValue; i++) {
            chestContents += '<li id="chestSlot-' + itemReference + '-' + i + '">';
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
        chestIdOpen = itemReference;
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
        var chestItemContains = thisMapData.items[(itemDetails[1])].contains;
        var whichChestItem = chestItemContains[(itemDetails[2])];
        if (typeof whichChestItem !== "undefined") {
            if (whichChestItem.type == "$") {
                // money:
                hero.currency.money += whichChestItem.quantity;
                audio.playSound(soundEffects['coins'], 0);
                UI.updateCurrencies();
                thisMapData.items[(itemDetails[1])].contains[(itemDetails[2])] = "";
                document.getElementById(chestSlotId).innerHTML = "";
            } else {
                inventoryCheck = canAddItemToInventory([whichChestItem]);
                if (inventoryCheck[0]) {
                    thisMapData.items[(itemDetails[1])].contains[(itemDetails[2])] = "";
                    UI.showChangeInInventory(inventoryCheck[1]);
                    document.getElementById(chestSlotId).innerHTML = "";
                } else {
                    UI.showNotification("<p>Oops - sorry, no room in your bags</p>");
                }
            }
        }
    },

    toggleUI: function() {
        interfaceWrapper.classList.toggle('active');
        interfaceIsVisible = !interfaceIsVisible;
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
                        var armsLengthXTile = hero.tileX + relativeFacing[hero.facing]["x"];
                        var armsLengthYTile = hero.tileY + relativeFacing[hero.facing]["y"];
                        var foundItem = -1;
                        var thisItem;
                        for (var i = 0; i < thisMapData.items.length; i++) {
                            thisItem = thisMapData.items[i];

                            if (hero.tileX == thisItem.tileX) {
                                if (hero.tileY == thisItem.tileY) {
                                    foundItem = i;
                                    break;
                                }
                            }
                            if (armsLengthXTile == thisItem.tileX) {
                                if (armsLengthYTile == thisItem.tileY) {
                                    foundItem = i;
                                    break;
                                }
                            }
                        }
                        if (foundItem != -1) {
                            // found an item - check source node and the action match categories:
                            if (currentActiveInventoryItems[thisMapData.items[foundItem].type].category == thisNode.dataset.category) {
                                // check it's not still re-spawning:
                                if (thisMapData.items[foundItem].state != "inactive") {
                                    gathering.itemIndex = foundItem;
                                    gathering.quality = parseInt(thisMapData.items[foundItem].quality);

                                    gathering.quantity = 100;
                                    gathering.maxQuantity = parseInt(thisMapData.items[foundItem].quantity);
                                    gathering.purity = parseInt(thisMapData.items[foundItem].purity);
                                    gathering.stability = parseInt(thisMapData.items[foundItem].stability);
                                    gathering.node = thisMapData.items[foundItem];
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
                                UI.showNotification('<p>Wrong resource type for this action</p>');
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
                            surveyingPanel.offsetHeight;
                            surveyingPanel.classList.add('active');
                        } else {
                            surveyingStopped();
                        }
                    }
                    break;
                case "mount":
                    // ###
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
        surveyingTimeBar.style.width = surveying.timeRemaining + '%';
    },

    addFromGathering: function() {
        inventoryCheck = canAddItemToInventory([activeGatheredObject]);
        if (inventoryCheck[0]) {
            gatheringOutputSlot.innerHTML = "";
            UI.showChangeInInventory(inventoryCheck[1]);
            gatheringPanel.classList.remove('active');
        } else {
            UI.showNotification("<p>Oops - sorry, no room in your bags</p>");
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
        // store the coordinates of the NPC or item that triggered this opening:
        postObject.x = postObjectX;
        postObject.y = postObjectY;
        postObject.active = true;
        postPanel.classList.add('active');
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
                    UI.showNotification("<p>Oops - sorry, no room in your bags</p>");
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
                sendUserPost('{"subject":"' + sendPostSubject.value + '","message":"' + sendPostMessage.value + '","senderID":"' + characterId + '","attachments":0,"recipientCharacterName":"' + sendPostCharacter.value + '","fromName":"Eleaddai"}');
                break;
            case 'cancelPost':
                // ####
                break;
        }
    },
    initRetinueTimers: function() {
        for (var i = 0; i < allRetinueQuestTimers.length; i++) {
            retinueQuestTimeRemaining.push(new Date().getTime() + (allRetinueQuestTimers[i].dataset.minutes) * 60 * 1000);
        }
    },

    updateRetinueTimers: function() {
        var remainingTime, seconds, minutes, hours, days;
        var currentTime = new Date().getTime();
        for (var i = 0; i < allRetinueQuestTimers.length; i++) {
            remainingTime = retinueQuestTimeRemaining[i] - currentTime;

            var seconds = Math.floor((remainingTime / 1000) % 60);
            var minutes = Math.floor((remainingTime / (60 * 1000)) % 60);
            var hours = Math.floor((remainingTime / (60 * 60 * 1000)) % 24);
            var days = Math.floor(remainingTime / (24 * 60 * 60 * 1000));

            if (days > 1) {
                allRetinueQuestTimers[i].innerHTML = days + " days remaining";
            } else if (days == 1) {
                allRetinueQuestTimers[i].innerHTML = "1 day remaining";
            } else if (hours > 1) {
                allRetinueQuestTimers[i].innerHTML = hours + " hours remaining";
            } else if (hours == 1) {
                allRetinueQuestTimers[i].innerHTML = "1 hour remaining";
            } else if (minutes > 1) {
                allRetinueQuestTimers[i].innerHTML = minutes + " minutes remaining";
            } else if (minutes == 1) {
                allRetinueQuestTimers[i].innerHTML = "1 minute remaining";
            } else if (seconds > 1) {
                allRetinueQuestTimers[i].innerHTML = seconds + " seconds remaining";
            } else if (seconds == 1) {
                allRetinueQuestTimers[i].innerHTML = "1 second remaining";
            } else {
                allRetinueQuestTimers[i].innerHTML = "complete";
            }
        }
    },
    openRetinuePanel: function(retinueObjectX, retinueObjectY) {
        retinuePanel.classList.add("active");
        retinueObject.active = true;
        retinueObject.x = retinueObjectX;
        retinueObject.y = retinueObjectY;
    },
    closeRetinuePanel: function() {
        retinuePanel.classList.remove("active");
        retinueObject.active = false;
    }
}
function setupWeather() {
    if (!thisMapData.isInside) {
        // check if any outside weather is stored:
        if (outsideWeather != "") {
            changeWeather(outsideWeather);
        } else {
            var previousWeather = currentWeather;
            if (thisMapData.weather.length == 1) {
                changeWeather(thisMapData.weather[0]);
            } else {
                // check if previous weather is an option here, and use that if so:
                if (thisMapData.weather.indexOf(previousWeather) !== -1) {
                    changeWeather(previousWeather);
                } else {
                    changeWeather(getRandomElementFromArray(thisMapData.weather));
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
}

function checkForWeatherChange() {
    if (!thisMapData.isInside) {
        if (thisMapData.weather.length > 1) {
            if ((hero.totalGameTimePlayed - weatherLastChangedTime) > minTimeBetweenWeatherChanges) {
                changeWeather(getRandomElementFromArray(thisMapData.weather));
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
        scope: '/game-world/'
    });
}

function sizeCanvasSize() {
    // size it to the screen:
    gameContext.canvas.width = window.innerWidth;
    gameContext.canvas.height = window.innerHeight;
    lightMapContext.canvas.width = window.innerWidth / 4;
    lightMapContext.canvas.height = window.innerHeight / 4;
    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight;
}

var debouncedResize = debounce(function() {
    sizeCanvasSize();
}, 250);
window.addEventListener('resize', debouncedResize);


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
        canvasMapImage = document.createElement('img');
        canvasMapMaskImage = document.createElement('img');
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
    getJSON("/data/chr" + characterId + "/gameState.json", function(data) {
        //  thisMapData = data.map;
        // copy the data to the hero object:
        for (var attribute in data) {
            hero[attribute] = data[attribute];
        }
        currentMap = data.currentMap;
        newMap = currentMap;
        gameSettings = data.settings;

        timeSinceLastAmbientSoundWasPlayed = hero.totalGameTimePlayed + (minTimeBetweenAmbientSounds * 1.25);
        if (data.allPets) {
            if (data.activePets.length > 0) {
                hasActivePet = true;
            }
            // hero.activePets = data.activePets;
            // hero.allPets = data.allPets;
        }
        // copy the fae properties that will change into the main fae object:
        for (var attrname in data.fae) {
            fae[attrname] = data.fae[attrname];
        }
        //  hero.inventory = data.inventory;
        if (currentMap > 0) {
            //clean old procedural maps: (don't need a response here)
            sendDataWithoutNeedingAResponse('/game-world/generateDungeonMap.php?playerId=' + characterId + '&clearMaps=true');
        }
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
    if (hasActivePet) {
        for (var i = 0; i < hero.activePets.length; i++) {
            activePetImages[i] = Loader.getImage("activePet" + hero.activePets[i]);
        }
    }
    getColours();
}




function loadCardData() {
    getJSON("/game-world/getCardDetails.php", function(data) {
        cardGameNameSpace.allCardData = data.cards;
        loadMap();
    }, function(status) {
        // error - try again:
        loadCardData();
    });
}

function loadMapJSON(mapFilePath) {
    getJSON(mapFilePath, function(data) {
            thisMapData = data.map;
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
                hero.tileX = thisMapData.entrance[0] + startTileOffsetXNum;
            }
            if (hero.tileY.toString().indexOf("?") != -1) {
                startTileOffsetY = hero.tileY.toString().substring(1);
                if (startTileOffsetY.length > 0) {
                    startTileOffsetYNum = parseInt(startTileOffsetY);
                }
                hero.tileY = thisMapData.entrance[1] + startTileOffsetYNum;
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
                    hero.allPets[hero.activePets[i]].tileX = hero.tileX + (tileOffsetX * (i + 1));
                    hero.allPets[hero.activePets[i]].tileY = hero.tileY + (tileOffsetY * (i + 1));



                    if (i == 0) {
                        hero.allPets[hero.activePets[i]].state = "moving";
                    } else {
                        // will be placed out of the normal map grid:
                        hero.allPets[hero.activePets[i]].state = "queuing";
                    }
                    hero.allPets[hero.activePets[i]].facing = hero.facing;

                }
            }


            mapTilesY = thisMapData.terrain.length;
            mapTilesX = thisMapData.terrain[0].length;
            if (previousZoneName != thisMapData.zoneName) {
                UI.showZoneName(thisMapData.zoneName);
                document.title = titleTagPrefix + ' - ' + thisMapData.zoneName;
                cartographicTitle.innerHTML = thisMapData.zoneName;
            }

            initCartographicMap();

            if (thisMapData.showOnlyLineOfSight) {
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
            if (thisMapData.ambientSounds) {
                audio.loadAmbientSounds(thisMapData.ambientSounds);
            }
            fae.recentHotspots = [];
            findProfessionsAndRecipes();
        },
        function(status) {
            // try again:
            console.log("retrying..." + mapFilePath);
            loadMapJSON(mapFilePath);
        });
}


function loadMap() {
    var mapFilePath;
    // check for newly entering a random dungeon:
    if ((newMap < 0) && (currentMap > 0)) {
        randomDungeonName = randomDungeons[Math.abs(newMap)];
        newMap = -1;
    } else {
        //mapFilePath = '/data/chr' + characterId + '/map' + newMap + '.json';
        mapFilePath = '/game-world/getMap.php?chr=' + characterId + '&map=' + newMap;
    }
    if (newMap < 0) {
        //   mapFilePath = '/game-world/generateDungeonMap.php?playerId=' + characterId + '&originatingMapId=' + currentMap + '&requestedMap=' + newMap + '&dungeonName=' + randomDungeonName + '&connectingDoorX=' + centreDoorX + '&connectingDoorY=' + centreDoorY;

        mapFilePath = '/game-world/generateCircularDungeonMap.php?dungeonName=' + randomDungeonName + '&requestedMap=' + newMap;
        //  mapFilePath = '/game-world/generateCircularDungeonMap.php?dungeonName='+randomDungeonName+'&requestedMap=' + newMap + '&seed=1512098741';

    }




    currentMap = newMap;
    loadMapJSON(mapFilePath);
}




function loadMapAssets() {
    imagesToLoad = [];
    var thisFileColourSuffix, thisColourName;
    var assetPath = currentMap;
    if (currentMap < 0) {
        assetPath = 'dungeon/' + randomDungeonName;
    }
    if (newMap.toString().indexOf('housing') !== -1) {

        imagesToLoad.push({
            name: "backgroundImg",
            src: '/images/game-world/maps/housing/bg-' + mapTilesX + 'x' + mapTilesY + '.png'
        });
    } else {
        imagesToLoad.push({
            name: "backgroundImg",
            src: '/images/game-world/maps/' + assetPath + '/bg.png'
        });
    }
    tileGraphicsToLoad = thisMapData.graphics;
    for (var i = 0; i < tileGraphicsToLoad.length; i++) {
        if (tileGraphicsToLoad[i].src.indexOf('housing') !== -1) {
            imagesToLoad.push({
                name: "tile" + i,
                src: "/images/game-world/maps/" + tileGraphicsToLoad[i].src
            });
        } else {
            imagesToLoad.push({
                name: "tile" + i,
                src: "/images/game-world/maps/" + assetPath + "/" + tileGraphicsToLoad[i].src
            });
        }

    }
    npcGraphicsToLoad = [];
    var thisNPCIdentifier;
    for (var i = 0; i < thisMapData.npcs.length; i++) {
        thisNPCIdentifier = "npc" + thisMapData.npcs[i].name;
        if (npcGraphicsToLoad.indexOf(thisNPCIdentifier) == -1) {
            imagesToLoad.push({
                name: thisNPCIdentifier,
                src: "/images/game-world/npcs/" + thisMapData.npcs[i].src
            });
            npcGraphicsToLoad.push(thisNPCIdentifier);
        }
    }
    // check for nests, and get the graphics for any creatures they will spawn:
    for (var i = 0; i < thisMapData.items.length; i++) {
        if (currentActiveInventoryItems[thisMapData.items[i].type].action == "nest") {
            for (var j = 0; j < thisMapData.items[i].contains.length; j++) {
                thisNPCIdentifier = "npc" + thisMapData.items[i].contains[j].name;
                if (npcGraphicsToLoad.indexOf(thisNPCIdentifier) == -1) {
                    imagesToLoad.push({
                        name: thisNPCIdentifier,
                        src: "/images/game-world/npcs/" + thisMapData.items[i].contains[j].src
                    });
                    npcGraphicsToLoad.push(thisNPCIdentifier);
                }
            }
        }
    }



    itemGraphicsToLoad = [];
    var thisItemIdentifier = '';
    for (var i = 0; i < thisMapData.items.length; i++) {
        // get colour name 
        thisFileColourSuffix = "";
        if (thisMapData.items[i].colour) {
            thisColourName = getColourName(thisMapData.items[i].colour, thisMapData.items[i].type);
            if (thisColourName != "") {
                thisFileColourSuffix = "-" + thisColourName.toLowerCase();
            }
        }
        thisItemIdentifier = "item" + thisMapData.items[i].type + thisFileColourSuffix;
        // only add unique images:
        if (itemGraphicsToLoad.indexOf(thisItemIdentifier) == -1) {
            imagesToLoad.push({
                name: thisItemIdentifier,
                src: "/images/game-world/items/" + currentActiveInventoryItems[thisMapData.items[i].type].worldSrc + thisFileColourSuffix + ".png"
            });
            itemGraphicsToLoad.push(thisItemIdentifier);
        }
    }

    // check for hidden resources:
    for (var i in thisMapData.hiddenResources) {
        for (var j in thisMapData.hiddenResources[i]) {
            thisItemIdentifier = "item" + thisMapData.hiddenResources[i][j].type;
            if (itemGraphicsToLoad.indexOf(thisItemIdentifier) == -1) {
                imagesToLoad.push({
                    name: thisItemIdentifier,
                    src: "/images/game-world/items/" + currentActiveInventoryItems[thisMapData.hiddenResources[i][j].type].worldSrc + ".png"
                });
                itemGraphicsToLoad.push(thisItemIdentifier);
            }
        }
    }



    Loader.preload(imagesToLoad, prepareGame, loadingProgress);
}



function loadTitles() {

    var possibleTitleIds = [];
    // loop through quests and get any titles needs:

    for (var i in questData) {

        if (questData[i].titleGainedAfterCompletion != "") {
            possibleTitleIds.push(questData[i].titleGainedAfterCompletion);
        }
    }


    var allTitleIdsToGet = possibleTitleIds.concat(hero.titlesEarned).join("|");
    // john
    getJSON("/game-world/getTitles.php?whichIds=" + allTitleIdsToGet, function(data) {
        possibleTitles = data;

        loadCardData();
    }, function(status) {
        // try again:
        loadTitles();
    });
}

function getColours() {
    getJSON("/game-world/getColours.php", function(data) {
        colourNames = data.colourNames;
        getQuestDetails();
    }, function(status) {
        // try again:
        getColours();
    });
}

function getQuestDetails() {
    getJSON("/game-world/getQuestDetails.php?chr=" + characterId, function(data) {
        questData = data.quests;
        loadTitles();
    }, function(status) {
        // try again:
        getQuestDetails();
    });
}


function findProfessionsAndRecipes() {
    var recipeIdsToGet = "";
    for (var i = 0; i < hero.recipesKnown.length; i++) {
        recipeIdsToGet += hero.recipesKnown[i][0] + "|";
    }
    // remove final pipe:
    recipeIdsToGet = recipeIdsToGet.slice(0, -1);
    loadProfessionsAndRecipes(recipeIdsToGet);
}



function loadProfessionsAndRecipes(recipeIdsToLoad) {
    getJSON("/game-world/getProfessionsAndRecipes.php?whichIds=" + recipeIdsToLoad, function(data) {
        hero.crafting = data.professions;
        currentItemGroupFilters = data.itemGroups;
        getShopData();
    }, function(status) {
        // try again:
        loadProfessionsAndRecipes(recipeIdsToLoad);
    });
}



function getShopData() {
    thisMapShopItemIds = '';
    if (thisMapData.shops.length == 0) {
        findInventoryItemData();
    } else {
        var shopData = JSON.parse('{"mapNumber": "' + currentMap + '","region":"' + thisMapData.region + '","shops": ' + JSON.stringify(thisMapData.shops) + '}');
        // loop through shops and create hashes 
        for (var i = 0; i < shopData.shops.length; i++) {
            shopData.shops[i].hash = generateHash(shopData.shops[i].name);
        }
        loadShopData('shopData=' + JSON.stringify(shopData));
    }
}



function loadShopData(shopJSONData) {
    // post data with getJSONWithParams function
    getJSONWithParams("/game-world/getShopItems.php", shopJSONData, function(data) {
        thisMapShopItemIds = data.allItemIds;
        UI.buildShop(data.markup);
        getQuestJournal();
    }, function(status) {
        // try again:
        loadShopData(shopJSONData);
    });
}


function getQuestJournal() {
    getJSON("/game-world/getQuestJournalEntries.php", function(data) {
        UI.buildQuestJournal(data.markup, data.regions);
        findInventoryItemData();
    }, function(status) {
        // try again:
        getQuestJournal();
    });
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
    // find items placed on this map:
    var itemChoices;
    for (var i = 0; i < thisMapData.items.length; i++) {
        itemIdsToGet.push(thisMapData.items[i].type);
        // check if any are containers or chests:
        if (typeof thisMapData.items[i].contains !== "undefined") {
            for (var j = 0; j < thisMapData.items[i].contains.length; j++) {
                if (typeof thisMapData.items[i].contains[j].type !== "undefined") {
                    itemChoices = thisMapData.items[i].contains[j].type.toString().split("/");
                    for (var k = 0; k < itemChoices.length; k++) {
                        if (itemChoices[k] != "$") {
                            // make sure it's not money in a chest:
                            itemIdsToGet.push(itemChoices[k]);
                        }
                    }
                }
            }
        }
    }

    // find items in hidden resources (and their contents):
    var containsSplit;
    for (var i in thisMapData.hiddenResources) {
        for (var j in thisMapData.hiddenResources[i]) {
            itemIdsToGet.push(thisMapData.hiddenResources[i][j].type);
            if (thisMapData.hiddenResources[i][j].contains) {
                for (var k in thisMapData.hiddenResources[i][j].contains) {
                    containsSplit = thisMapData.hiddenResources[i][j].contains[k].type.split("/");
                    for (var l = 0; l < containsSplit.length; l++) {
                        itemIdsToGet.push(containsSplit[l]);
                    }

                }

            }
        }
    }

    // find items in recipes:
    for (var i in hero.crafting) {
        for (var j in hero.crafting[i].filters['All']) {
            // get what's created:
            itemIdsToGet.push(hero.crafting[i].recipes[(hero.crafting[i].filters['All'][j])].creates);
            // get components:
            theseRecipeComponents = hero.crafting[i].recipes[(hero.crafting[i].filters['All'][j])].components.split(",");
            for (var k = 0; k < theseRecipeComponents.length; k++) {
                if (!(isNaN(theseRecipeComponents[k]))) {
                    itemIdsToGet.push(theseRecipeComponents[k]);
                }
            }
        }
    }


    // add item available in any shops:
    if (thisMapShopItemIds != '') {
        itemIdsToGet.push(thisMapShopItemIds);
    }

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
    thisMapData.npcs[whichNPC].x = getTileCentreCoordX(thisMapData.npcs[whichNPC].tileX);
    thisMapData.npcs[whichNPC].y = getTileCentreCoordY(thisMapData.npcs[whichNPC].tileY);
    thisMapData.npcs[whichNPC].z = getElevation(thisMapData.npcs[whichNPC].tileX, thisMapData.npcs[whichNPC].tileY);
    thisMapData.npcs[whichNPC].drawnFacing = thisMapData.npcs[whichNPC].facing;
    thisMapData.npcs[whichNPC].dx = 0;
    thisMapData.npcs[whichNPC].dy = 0;
    if (typeof thisMapData.npcs[whichNPC].speechIndex === "undefined") {
        thisMapData.npcs[whichNPC].speechIndex = 0;
    }
    thisMapData.npcs[whichNPC].currentAnimation = 'walk';
    // set index to -1 so when it increases, it'll pick up the first (0) element:
    thisMapData.npcs[whichNPC].movementIndex = -1;
    // allow NPCs to pick up their facing without moving to that first tile:
    thisMapData.npcs[whichNPC].forceNewMovementCheck = true;
    // used for making sure that pathfinding NPCs don't head straight back to the last place they visited:
    thisMapData.npcs[whichNPC].lastTargetDestination = "";
}

function initialiseItem(whichItem) {
    thisMapData.items[whichItem].x = getTileCentreCoordX(thisMapData.items[whichItem].tileX);
    thisMapData.items[whichItem].y = getTileCentreCoordY(thisMapData.items[whichItem].tileY);
    thisMapData.items[whichItem].z = getElevation(thisMapData.items[whichItem].tileX, thisMapData.items[whichItem].tileY);
    thisMapData.items[whichItem].width = currentActiveInventoryItems[thisMapData.items[whichItem].type].width;
    thisMapData.items[whichItem].length = currentActiveInventoryItems[thisMapData.items[whichItem].type].length;
    thisMapData.items[whichItem].centreX = currentActiveInventoryItems[thisMapData.items[whichItem].type].centreX;
    thisMapData.items[whichItem].centreY = currentActiveInventoryItems[thisMapData.items[whichItem].type].centreY;
    thisMapData.items[whichItem].spriteWidth = currentActiveInventoryItems[thisMapData.items[whichItem].type].spriteWidth;
    thisMapData.items[whichItem].spriteHeight = currentActiveInventoryItems[thisMapData.items[whichItem].type].spriteHeight;
    // check for node resources:
    if (currentActiveInventoryItems[thisMapData.items[whichItem].type].action == "node") {
        // use the saved value if it has one:
        if (!thisMapData.items[whichItem].timeLastHarvested) {
            // otherwise, set it so it can be instantly harvested:
            thisMapData.items[whichItem].timeLastHarvested = hero.totalGameTimePlayed - currentActiveInventoryItems[thisMapData.items[whichItem].type].respawnRate;
        }

        // add stability and quantity values if it doesn't have them
        if (typeof thisMapData.items[whichItem].stability === "undefined") {
            thisMapData.items[whichItem].stability = thisMapData.items[whichItem].maxStability;
        }
        if (typeof thisMapData.items[whichItem].quantity === "undefined") {
            thisMapData.items[whichItem].quantity = thisMapData.items[whichItem].maxQuantity;
        }

    }
    if (currentActiveInventoryItems[thisMapData.items[whichItem].type].action == "nest") {
        thisMapData.items[whichItem].timeLastSpawned = hero.totalGameTimePlayed;
        thisMapData.items[whichItem].spawnsRemaining = thisMapData.items[whichItem].additional;
    }
}


function prepareGame() {




    // get map image references:
    tileImages = [];
    for (var i = 0; i < tileGraphicsToLoad.length; i++) {
        tileImages[i] = Loader.getImage("tile" + i);
    }
    npcImages = [];
    for (var i = 0; i < npcGraphicsToLoad.length; i++) {
        npcImages[npcGraphicsToLoad[i]] = Loader.getImage(npcGraphicsToLoad[i]);

    }
    itemImages = [];
    for (var i = 0; i < itemGraphicsToLoad.length; i++) {

        itemImages[itemGraphicsToLoad[i]] = Loader.getImage(itemGraphicsToLoad[i]);
        // ####
        //  itemImages[itemGraphicsToLoad[i]].spriteWidth = Loader.getImage(itemGraphicsToLoad[i]).width;
        //  itemImages[itemGraphicsToLoad[i]].spriteHeight = Loader.getImage(itemGraphicsToLoad[i]).length;
    }
    backgroundImg = Loader.getImage("backgroundImg");
    // initialise and position NPCs:
    for (var i = 0; i < thisMapData.npcs.length; i++) {
        initialiseNPC(i);
    }
    // initialise pet:
    if (hasActivePet) {
        for (var i = 0; i < hero.activePets.length; i++) {

            hero.allPets[hero.activePets[i]].x = getTileCentreCoordX(hero.allPets[hero.activePets[i]].tileX);
            hero.allPets[hero.activePets[i]].y = getTileCentreCoordY(hero.allPets[hero.activePets[i]].tileY);
            // check these tiles are within the normal grid - if not use the pet in front's z depth:
            if ((hero.allPets[hero.activePets[i]].tileX < 0) || (hero.allPets[hero.activePets[i]].tileY < 0) || (hero.allPets[hero.activePets[i]].tileX >= mapTilesX) || (hero.allPets[hero.activePets[i]].tileY >= mapTilesY)) {
                hero.allPets[hero.activePets[i]].z = hero.allPets[hero.activePets[i - 1]].z;

            } else {
                hero.allPets[hero.activePets[i]].z = getElevation(hero.allPets[hero.activePets[i]].tileX, hero.allPets[hero.activePets[i]].tileY);
            }
            hero.allPets[hero.activePets[i]].dx = 0;
            hero.allPets[hero.activePets[i]].dy = 0;
            hero.allPets[hero.activePets[i]].foundPath = '';
            if (hero.allPets[hero.activePets[i]].state != "queuing") {
                hero.allPets[hero.activePets[i]].state = "wait";
            }
            if (i == 0) {
                // first pet follows the hero:
                hero.allPets[hero.activePets[i]].following = hero;
            } else {
                // subsequent pets follow the one in front:
                hero.allPets[hero.activePets[i]].following = hero.allPets[hero.activePets[i - 1]];
            }
            // if (i != (hero.activePets.length - 1)) {
            // even the last one should drop a breadcrumb in case an escort quest NPC needs it
            hero.allPets[hero.activePets[i]].breadcrumb = [];
            for (var j = 0; j < breadCrumbLength; j++) {
                hero.allPets[hero.activePets[i]].breadcrumb[j] = [hero.allPets[hero.activePets[i]].tileX, hero.allPets[hero.activePets[i]].tileY];
            }
            //  }
        }
    }

    if (thisMapData.movingPlatforms) {
        // initialise moving platforms:
        var thisPlatform, thisPlatformMovements;
        for (var i = 0; i < thisMapData.movingPlatforms.length; i++) {
            thisPlatform = thisMapData.movingPlatforms[i];
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

    // initialise items:
    for (var i = 0; i < thisMapData.items.length; i++) {
        initialiseItem(i);
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
}


function removeMapAssets() {
    for (var i = 0; i < tileGraphicsToLoad.length; i++) {
        // remove the on error handler so it doesn't fire when the image is removed:
        tileImages[i].onerror = '';
        tileImages[i].src = '';
        tileImages[i] = null;
    }

    for (var i in npcGraphicsToLoad) {
        npcImages[npcGraphicsToLoad[i]].onerror = '';
        npcImages[npcGraphicsToLoad[i]].src = '';
        npcImages[npcGraphicsToLoad[i]] = null;
    }
    for (var i in itemGraphicsToLoad) {
        itemImages[itemGraphicsToLoad[i]].onerror = '';
        itemImages[itemGraphicsToLoad[i]].src = '';
        itemImages[itemGraphicsToLoad[i]] = null;
    }
    backgroundImg.onerror = '';
    backgroundImg.src = '';
    backgroundImg = null;
}


function loadingProgress() {
    // make this graphical where appropriate ####
    //  console.log("loading - " + Loader.getProgress());
}


function changeMaps(doorX, doorY) {
    previousZoneName = thisMapData.zoneName;
    gameMode = "mapLoading";
    removeMapAssets();
    if (jumpMapId == null) {
        var doorData = thisMapData.doors;
        var whichDoor = doorX + "," + doorY;
        hero.tileX = doorData[whichDoor].startX;
        hero.tileY = doorData[whichDoor].startY;
        newMap = doorData[whichDoor].map;
    } else {
        newMap = jumpMapId;
        jumpMapId = null;
        hero.tileX = parseInt(doorX);
        hero.tileY = parseInt(doorY);
    }

    loadMap();
}



function tileIsClear(tileX, tileY) {
    if ((tileX < 0) || (tileY < 0) || (tileX >= mapTilesX) || (tileY >= mapTilesY)) {
        // is out of the bounds of the current map:
        return false;
    } else {
        switch (thisMapData.collisions[tileY][tileX]) {
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
    }
    // check against hero:
    if (tileX == hero.tileX) {
        if (tileY == hero.tileY) {
            return false;
        }
    }
    // against items:
    for (var i = 0; i < thisMapData.items.length; i++) {
        if (tileX == thisMapData.items[i].tileX) {
            if (tileY == thisMapData.items[i].tileY) {
                return false;
            }
        }
    }
    // against pets:
    if (hasActivePet) {
        for (var i = 0; i < hero.activePets.length; i++) {
            if (tileX == hero.allPets[hero.activePets[i]].tileX) {
                if (tileY == hero.allPets[hero.activePets[i]].tileY) {
                    return false;
                }
            }
        }
    }
    // against NPCs:
    for (var i = 0; i < thisMapData.npcs.length; i++) {
        if (thisMapData.npcs[i].isCollidable) {
            if (tileX == thisMapData.npcs[i].tileX) {
                if (tileY == thisMapData.npcs[i].tileY) {
                    return false;
                }
            }
        }
    }
    return true;
}


function isATerrainCollision(x, y) {
    // check map bounds first:
    var tileX = getTileX(x);
    var tileY = getTileY(y);
    if ((tileX < 0) || (tileY < 0) || (tileX >= mapTilesX) || (tileY >= mapTilesY)) {
        // is out of the bounds of the current map:
        return 1;
    } else {
        switch (thisMapData.collisions[tileY][tileX]) {
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
    if (thisMapData.movingPlatforms) {
        for (var i = 0; i < thisMapData.movingPlatforms.length; i++) {
            thisPlatform = thisMapData.movingPlatforms[i];
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
                    hero.y = thisMapData.movingPlatforms[isOnAPlatform(hero.x - hero.width / 2, hero.y + hero.length / 2)].y - (tileW / 2) + (hero.length / 2) + 1;
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
                    hero.y = (thisMapData.movingPlatforms[isOnAPlatform(hero.x - hero.width / 2, hero.y - hero.length / 2)].y + tileW / 2 + (thisMapData.movingPlatforms[isOnAPlatform(hero.x - hero.width / 2, hero.y - hero.length / 2)].length - 1) * tileW) - (hero.length / 2) - 1;
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
                    hero.x = thisMapData.movingPlatforms[isOnAPlatform(hero.x + hero.width / 2, hero.y - hero.length / 2)].x - tileW / 2 + (hero.length / 2) + 1;
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
                    hero.x = thisMapData.movingPlatforms[isOnAPlatform(hero.x - hero.width / 2, hero.y - hero.length / 2)].x + tileW / 2 + ((thisMapData.movingPlatforms[isOnAPlatform(hero.x - hero.width / 2, hero.y - hero.length / 2)].width - 1) * tileW) - (hero.length / 2) - 1;
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
    if (thisMapData.movingPlatforms) {
        for (var i = 0; i < thisMapData.movingPlatforms.length; i++) {
            thisMapData.movingPlatforms[i].canMove = true;
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
            hero.x += thisMapData.movingPlatforms[topLeftIsOnAPlatform].dx;
            hero.y += thisMapData.movingPlatforms[topLeftIsOnAPlatform].dy;
            hero.z += thisMapData.movingPlatforms[topLeftIsOnAPlatform].dz;
        }
    } else {
        if (topLeftIsOnAPlatform >= 0) {
            thisMapData.movingPlatforms[topLeftIsOnAPlatform].canMove = false;
        }
        if (topRightIsOnAPlatform >= 0) {
            thisMapData.movingPlatforms[topRightIsOnAPlatform].canMove = false;
        }
        if (bottomLeftIsOnAPlatform >= 0) {
            thisMapData.movingPlatforms[bottomLeftIsOnAPlatform].canMove = false;
        }
        if (bottomRightIsOnAPlatform >= 0) {
            thisMapData.movingPlatforms[bottomRightIsOnAPlatform].canMove = false;
        }
    }


    var thisNPC, thisItem;
    // check for collisions against NPCs:
    for (var i = 0; i < thisMapData.npcs.length; i++) {
        thisNPC = thisMapData.npcs[i];
        if (thisNPC.isCollidable) {
            if (isAnObjectCollision(thisNPC.x, thisNPC.y, thisNPC.width, thisNPC.length, hero.x, hero.y, hero.width, hero.length)) {
                getHeroAsCloseAsPossibleToObject(thisNPC.x, thisNPC.y, thisNPC.width, thisNPC.length);
            }
        }
    }

    // check for collisions against items:
    for (var i = 0; i < thisMapData.items.length; i++) {
        thisItem = thisMapData.items[i];
        if (isAnObjectCollision(thisItem.x, thisItem.y, thisItem.width, thisItem.length, hero.x, hero.y, hero.width, hero.length)) {
            getHeroAsCloseAsPossibleToObject(thisItem.x, thisItem.y, thisItem.width, thisItem.length);
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
    if (typeof thisMapData.innerDoors !== "undefined") {
        var thisInnerDoor;
        for (var i in thisMapData.innerDoors) {
            thisInnerDoor = thisMapData.innerDoors[i];
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



function gameLoop() {
    switch (gameMode) {
        case "mapLoading":
            //    console.log("loading map assets...");
            break;
        case "paused":
            //
            break;
        case "cardGame":
            cardGameNameSpace.update();
            cardGameNameSpace.draw();
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
            break;
        case "play":
            update();
            draw();
            break;
    }
    window.requestAnimationFrame(gameLoop);
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
        checkHeroCollisions();
        var heroOldX = hero.tileX;
        var heroOldY = hero.tileY;
        hero.tileX = getTileX(hero.x);
        hero.tileY = getTileY(hero.y);
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
            if (!(isInRange(hero.x, hero.y, thisMapData.items[chestIdOpen].x, thisMapData.items[chestIdOpen].y, closeDialogueDistance / 2))) {
                UI.closeChest();
            }
        }
        if (activeAction == "gather") {
            if (!(isInRange(hero.x, hero.y, thisMapData.items[gathering.itemIndex].x, thisMapData.items[gathering.itemIndex].y, closeDialogueDistance / 2))) {
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
        mapTransitionCurrentFrames++;
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
}


function heroIsInNewTile() {
    hero.z = getElevation(getTileX(hero.x), getTileY(hero.y));
    //  if (currentMap < 0) {
    updateCartographicMiniMap();
    //  }
    var thisHotspot, thisTileCentreX, thisTileCentreY;
    // check for hotspots:
    for (var i = 0; i < thisMapData.hotspots.length; i++) {
        thisHotspot = thisMapData.hotspots[i];
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
                thisMapData.hotspots.splice(i, 1);
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
    if (thisMapData.showOnlyLineOfSight) {
        updateLightMap();
    }

    if (thisMapData.collisions[hero.tileY][hero.tileX] == "d") {
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
    thisMapData.innerDoors[whichInnerDoor]['isOpen'] = true;
    if (thisMapData.showOnlyLineOfSight) {
        updateLightMap();
    }
}

function closeInnerDoor(whichInnerDoor) {
    // make sure nothing's blocking the door (as it would become stuck):
    if (tileIsClear(thisMapData.innerDoors[whichInnerDoor]['tileX'], thisMapData.innerDoors[whichInnerDoor]['tileY'])) {
        thisMapData.innerDoors[whichInnerDoor]['isOpen'] = false;
        if (thisMapData.showOnlyLineOfSight) {
            updateLightMap();
        }
    }
}

function toggleInnerDoor(whichInnerDoor) {
    // make sure nothing's blocking the door (as it would become stuck):
    if (tileIsClear(thisMapData.innerDoors[whichInnerDoor]['tileX'], thisMapData.innerDoors[whichInnerDoor]['tileY'])) {
        thisMapData.innerDoors[whichInnerDoor]['isOpen'] = !(thisMapData.innerDoors[whichInnerDoor]['isOpen']);
        if (thisMapData.showOnlyLineOfSight) {
            updateLightMap();
        }
    }
}

function unlockInnerDoor(whichInnerDoor) {
    audio.playSound(soundEffects['unlock'], 0);
    thisMapData.innerDoors[whichInnerDoor]['isLocked'] = false;
    if (thisMapData.showOnlyLineOfSight) {
        updateLightMap();
    }
    // play sound ####
}


function checkForActions() {
    var inventoryCheck = [];
    var slotMarkup, thisSlotsId, thisSlotElem, thisNPC;
    for (var i = 0; i < thisMapData.items.length; i++) {
        if (isInRange(hero.x, hero.y, thisMapData.items[i].x, thisMapData.items[i].y, (thisMapData.items[i].width / 2 + hero.width / 2 + 6))) {
            if (isFacing(hero, thisMapData.items[i])) {
                var actionValue = currentActiveInventoryItems[thisMapData.items[i].type].actionValue;

                switch (currentActiveInventoryItems[thisMapData.items[i].type].action) {
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
                        toggleInnerDoor(thisMapData.items[i].additional);
                        audio.playSound(soundEffects['lever'], 0);
                        // toggle the visual state:
                        thisMapData.items[i].state = thisMapData.items[i].state == "on" ? 'off' : 'on';
                        break;
                    case "openInnerDoor":
                        openInnerDoor(thisMapData.items[i].additional);
                        break;
                    case "closeInnerDoor":
                        closeInnerDoor(thisMapData.items[i].additional);
                        break;
                    case "key":
                        hero.currency.keys.push(thisMapData.items[i].additional);
                        UI.updateCurrencies();
                        audio.playSound(soundEffects['keys'], 0);
                        // remove from map:
                        thisMapData.items.splice(i, 1);
                        break;
                    case "notice":
                        processSpeech(thisMapData.items[i], thisMapData.items[i].contains[0][0], thisMapData.items[i].contains[0][1], false, thisMapData.items[i].contains[0][2]);
                        break;
                    case "sit":
                        hero.facing = thisMapData.items[i].facing;
                        console.log("switch to sit animation");
                        break;
                    case "chest":
                        // open chest and show contents:
                        UI.openChest(i);
                        break;
                    case "post":
                        // open the Post panel:
                        UI.openPost(thisMapData.items[i].x, thisMapData.items[i].y);
                        break;
                    case "retinue":
                        // open the Retinue panel:
                        UI.openRetinuePanel(thisMapData.items[i].x, thisMapData.items[i].y);
                        break;
                    default:
                        // try and pick it up:
                        inventoryCheck = canAddItemToInventory([thisMapData.items[i]]);
                        if (inventoryCheck[0]) {
                            // remove from map:
                            thisMapData.items.splice(i, 1);
                            UI.showChangeInInventory(inventoryCheck[1]);
                        } else {
                            UI.showNotification("<p>Oops - sorry, no room in your bags</p>");
                        }
                }
            }
        }
    }

    // loop through NPCs:
    for (var i = 0; i < thisMapData.npcs.length; i++) {
        thisNPC = thisMapData.npcs[i];
        if (thisNPC.speech) {
            if (isInRange(hero.x, hero.y, thisNPC.x, thisNPC.y, (thisNPC.width + hero.width))) {
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
                UI.openShop(generateHash(thisObjectSpeaking.speech[thisObjectSpeaking.speechIndex][2]));
                //thisObjectSpeaking.speechIndex--;
                break;
            case "post":
                UI.openPost(thisObjectSpeaking.x, thisObjectSpeaking.y);
                break;
            case "retinue":
                UI.openRetinuePanel(thisObjectSpeaking.x, thisObjectSpeaking.y);
                break;
            case "sound":
                audio.playSound(soundEffects[thisObjectSpeaking.speech[thisObjectSpeaking.speechIndex][2]], 0);
                break;
            case "profession":
                var professionId = thisObjectSpeaking.speech[thisObjectSpeaking.speechIndex][2];
                if (hero.professionsKnown.indexOf(professionId) == -1) {
                    hero.professionsKnown.push(professionId);
                    showNotification('<p>You learned a new profession</p>');
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
            case "collection-quest":
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
                        if (typeof thisFullSpeech[3] !== "undefined") {
                            awardQuestRewards(thisObjectSpeaking, [thisFullSpeech[3]], true);
                        }
                        thisSpeech = collectionQuestSpeech[2];
                        hero.collections[collectionQuestZoneName].complete = true;
                        UI.completeCollectionQuestPanel(collectionQuestZoneName);
                    }
                } else {
                    // collection not started yet:
                    thisSpeech = collectionQuestSpeech[0];
                    hero.collections[collectionQuestZoneName] = {};
                    hero.collections[collectionQuestZoneName].required = thisMapData.collection;
                    hero.collections[collectionQuestZoneName].complete = false;
                    UI.initiateCollectionQuestPanel(collectionQuestZoneName);
                }
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
                if (questData[questId].isUnderway) {
                    // quest has been opened - check if it's complete:
                    if ((individualSpeechCodes[i] == "quest") || (individualSpeechCodes[i] == "quest-no-open") || (individualSpeechCodes[i] == "quest-optional")) {
                        // ie. it's not a '-no-close' speech

                        switch (questData[questId].whatIsRequiredForCompletion) {
                            case "possess":
                            case "give":
                            case "":

                                // check items:
                                var theseItemsNeededForCompletion = questData[questId].itemsNeededForCompletion;
                                var allItemsFound = true;
                                var itemsToGive = questData[questId].startItemsReceived.split(",");
                                var allItemsToGive = [];
                                for (var i = 0; i < itemsToGive.length; i++) {
                                    // check for any quantities:
                                    var thisQuestItem = itemsToGive[i].split("x");
                                    var thisQuantity, thisItem;
                                    if (thisQuestItem.length > 1) {
                                        thisQuantity = thisQuestItem[0];
                                        thisItem = thisQuestItem[1];
                                    } else {
                                        thisQuantity = 1;
                                        thisItem = itemsToGive[i];
                                    }
                                    if (!hasItemInInventory(thisItem, thisQuantity)) {
                                        allItemsFound = false;
                                    }
                                }
                                if (allItemsFound) {
                                    if (questData[questId].whatIsRequiredForCompletion == "give") {
                                        // remove items:
                                        for (var i = 0; i < itemsToGive.length; i++) {
                                            // check for any quantities:
                                            var thisQuestItem = itemsToGive[i].split("x");
                                            var thisQuantity, thisItem;
                                            if (thisQuestItem.length > 1) {
                                                thisQuantity = thisQuestItem[0];
                                                thisItem = thisQuestItem[1];
                                            } else {
                                                thisQuantity = 1;
                                                thisItem = itemsToGive[i];
                                            }
                                            removeItemTypeFromInventory(thisItem, thisQuantity);
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
                            case "multi":
                                var allSubQuestsRequired = questData[questId].subQuestsRequiredForCompletion.split(",");
                                var allSubQuestsComplete = true;
                                for (var k = 0; k < allSubQuestsRequired.length; k++) {
                                    // check conditions for this sub-quest and set if it's complete
                                    switch (questData[allSubQuestsRequired[k]].whatIsRequiredForCompletion) {
                                        case "possess":
                                        case "give":
                                        case "":
                                            var theseItemsNeededForCompletion = questData[allSubQuestsRequired[k]].itemsNeededForCompletion;
                                            var itemsToGive = questData[allSubQuestsRequired[k]].startItemsReceived.split(",");
                                            var allItemsToGive = [];
                                            for (var j = 0; j < itemsToGive.length; j++) {
                                                // check for any quantities:
                                                var thisQuestItem = itemsToGive[j].split("x");
                                                var thisQuantity, thisItem;
                                                if (thisQuestItem.length > 1) {
                                                    thisQuantity = thisQuestItem[0];
                                                    thisItem = thisQuestItem[1];
                                                } else {
                                                    thisQuantity = 1;
                                                    thisItem = itemsToGive[i];
                                                }
                                                if (!hasItemInInventory(thisItem, thisQuantity)) {
                                                    allSubQuestsComplete = false;
                                                }
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
                                // check if it's an absolute value to check for, or an increment (whether there is a '+' at the start):
                                if (questData[questId].thresholdNeededForCompletion.charAt(0) == "+") {
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
    for (var i = 0; i < thisMapData.items.length; i++) {
        thisItem = thisMapData.items[i];
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
                        thisMapData.npcs.push(JSON.parse(JSON.stringify(whichCreature)));
                        initialiseNPC(thisMapData.npcs.length - 1);
                        thisItem.spawnsRemaining--;
                        // reset timer:
                        thisItem.timeLastSpawned = hero.totalGameTimePlayed;
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
            UI.showNotification('<p>You earned the &quot;' + possibleTitles[thisTitle] + '&quot; title</p>');
        }
    }
}


function checkForChallenges() {
    for (var i = 0; i < thisMapData.npcs.length; i++) {
        thisChallengeNPC = thisMapData.npcs[i];
        if (isInRange(hero.x, hero.y, thisChallengeNPC.x, thisChallengeNPC.y, (thisChallengeNPC.width + hero.width))) {
            if (isFacing(hero, thisChallengeNPC)) {
                if (thisChallengeNPC.cardGameSpeech) {
                    thisChallengeNPC.drawnFacing = turntoFace(thisChallengeNPC, hero);
                    processSpeech(thisChallengeNPC, thisChallengeNPC.cardGameSpeech.challenge[0], thisChallengeNPC.cardGameSpeech.challenge[1]);
                    break;
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
    var thisNPC, newTile, thisNextMovement, oldNPCx, oldNPCy, thisOtherNPC, thisItem, thisNextMovement, thisNextMovementCode, thisInnerDoor;
    for (var i = 0; i < thisMapData.npcs.length; i++) {
        thisNPC = thisMapData.npcs[i];
        // check this NPC is playing cards with the hero:
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
                for (var j = 0; j < thisMapData.npcs.length; j++) {
                    if (i != j) {
                        thisOtherNPC = thisMapData.npcs[j];
                        if (thisOtherNPC.isCollidable) {
                            if (isAnObjectCollision(thisNPC.x, thisNPC.y, thisNPC.width, thisNPC.length, thisOtherNPC.x, thisOtherNPC.y, thisOtherNPC.width, thisOtherNPC.length)) {
                                thisNPC.x = oldNPCx;
                                thisNPC.y = oldNPCy;
                            }
                        }
                    }
                }

                // check for collisions against items:
                for (var j = 0; j < thisMapData.items.length; j++) {
                    thisItem = thisMapData.items[j];
                    if (isAnObjectCollision(thisNPC.x, thisNPC.y, thisNPC.width, thisNPC.length, thisItem.x, thisItem.y, thisItem.width, thisItem.length)) {
                        thisNPC.x = oldNPCx;
                        thisNPC.y = oldNPCy;
                    }
                }


                // check for inner doors:
                if (typeof thisMapData.innerDoors !== "undefined") {
                    for (var i in thisMapData.innerDoors) {
                        thisInnerDoor = thisMapData.innerDoors[i];
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
                        do {
                            // pick a random facing:
                            thisNPC.facing = facingsPossible[Math.floor(Math.random() * facingsPossible.length)];
                            // check that the target tile is walkable:
                        } while (isATerrainCollision(thisNPC.x + (relativeFacing[thisNPC.facing]["x"] * tileW), thisNPC.y + (relativeFacing[thisNPC.facing]["y"] * tileW)));
                        thisNPC.forceNewMovementCheck = false;
                        break;

                    case 'find':
                        thisNPC.forceNewMovementCheck = true;
                        if ((!thisNPC.waitingForAPath) && (typeof thisNPC.waitingTimer === "undefined")) {
                            pathfindingWorker.postMessage([thisNextMovement[1], thisNPC, thisMapData]);
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
                        for (var j = 0; j < thisMapData.npcs.length; j++) {
                            if (i != j) {
                                thisOtherNPC = thisMapData.npcs[j];
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

                                    pathfindingWorker.postMessage(["npcFindFollowing", thisNPC, thisMapData]);
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

                    default:

                        thisNPC.facing = thisNextMovement;
                        thisNPC.forceNewMovementCheck = false;
                        break;
                }
            }
        }
    }
}


function movePlatforms() {
    if (thisMapData.movingPlatforms) {
        // check for any items on platforms:
        for (var i = 0; i < thisMapData.items.length; i++) {
            if (thisMapData.items[i].isOnPlatform != undefined) {
                if (thisMapData.movingPlatforms[thisMapData.items[i].isOnPlatform].canMove) {
                    thisMapData.items[i].x += thisMapData.movingPlatforms[thisMapData.items[i].isOnPlatform].dx;
                    thisMapData.items[i].y += thisMapData.movingPlatforms[thisMapData.items[i].isOnPlatform].dy;
                    thisMapData.items[i].z += thisMapData.movingPlatforms[thisMapData.items[i].isOnPlatform].dz;
                }
            }
        }
        var thisPlatform, thisPlatformMovements;
        for (var i = 0; i < thisMapData.movingPlatforms.length; i++) {
            thisPlatform = thisMapData.movingPlatforms[i];
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
    if (hero.recipesKnown.indexOf(recipeIndex) === -1) {
        // check for pre-requisites
        // #####
        hero.recipesKnown.push([parseInt(recipeIndex), 0]);
        // need to show a notification
        // reload the recipe data
        // #####
    }
    return wasSuccessful;
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
    //console.log(postData);
    var postDataToSend = JSON.parse(postData);

    if (attachments) {
        postDataToSend['attachments'] = attachments;
    }

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


function draw() {
    if (gameMode == "mapLoading") {
        gameContext.fillStyle = "#000000";
        gameContext.fillRect(0, 0, canvasWidth, canvasHeight);
        gameContext.fill();
    } else {
        // get all assets to be drawn in a list
        var thisGraphicCentreX, thisGraphicCentreY, thisX, thisY, thisNPC, thisItem;

        hero.isox = findIsoCoordsX(hero.x, hero.y);
        hero.isoy = findIsoCoordsY(hero.x, hero.y);

        var heroOffsetCol = currentAnimationFrame % hero["animation"]["walk"]["length"];
        var heroOffsetRow = hero["animation"]["walk"][hero.facing];
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

        }

        // draw fae:
        thisX = findIsoCoordsX(fae.x, fae.y);
        thisY = findIsoCoordsY(fae.x, fae.y);
        fae.oscillateOffset = ((Math.sin(fae.dz) + 1) * 8) + fae.z + fae.zOffset;
        assetsToDraw.push([findIsoDepth(fae.x, fae.y, fae.z), "faeCentre", Math.floor(thisX - hero.isox + (canvasWidth / 2)), Math.floor(thisY - hero.isoy + (canvasHeight / 2) - fae.oscillateOffset)]);

        // draw fae particles:
        for (var i = 0; i < fae.particles.length; i++) {
            assetsToDraw.push([fae.particles[i].depth, "faeParticle", Math.floor(fae.particles[i].isoX - hero.isox + (canvasWidth / 2)), Math.floor(fae.particles[i].isoY - hero.isoy + (canvasHeight / 2)), fae.particles[i].alpha]);
        }

        var map = thisMapData.terrain;
        var thisNPCOffsetCol = 0;
        var thisNPCOffsetRow = 0;
        var thisFileColourSuffix = '';
        var thisColourName, thisItemIdentifier, thisPlatform, thisNPCIdentifier;
        var thisItemOffsetCol = 0;
        var thisItemOffsetRow = 0;

        for (var i = 0; i < mapTilesX; i++) {
            for (var j = 0; j < mapTilesY; j++) {
                // the tile coordinates should be positioned by i,j but the way the map is drawn, the reference in the array is j,i
                // this makes the map array more readable when editing
                if (map[j][i] != "*") {
                    thisX = getTileIsoCentreCoordX(i, j);
                    thisY = getTileIsoCentreCoordY(i, j);
                    thisGraphicCentreX = thisMapData.graphics[(map[j][i])].centreX;
                    thisGraphicCentreY = thisMapData.graphics[(map[j][i])].centreY;
                    assetsToDraw.push([findIsoDepth(getTileCentreCoordX(i), getTileCentreCoordY(j), 0), "img", tileImages[(map[j][i])], Math.floor(thisX - hero.isox - thisGraphicCentreX + (canvasWidth / 2)), Math.floor(thisY - hero.isoy - thisGraphicCentreY + (canvasHeight / 2))]);
                }
            }
        }

        if (typeof thisMapData.innerDoors !== "undefined") {
            for (var i in thisMapData.innerDoors) {
                // check for open status to get the right graphic ###########
                if (!thisMapData.innerDoors[i]['isOpen']) {
                    thisX = getTileIsoCentreCoordX(thisMapData.innerDoors[i]['tileX'], thisMapData.innerDoors[i]['tileY']);
                    thisY = getTileIsoCentreCoordY(thisMapData.innerDoors[i]['tileX'], thisMapData.innerDoors[i]['tileY']);
                    thisGraphicCentreX = thisMapData.graphics[(thisMapData.innerDoors[i]['graphic'])].centreX;
                    thisGraphicCentreY = thisMapData.graphics[(thisMapData.innerDoors[i]['graphic'])].centreY;
                    assetsToDraw.push([findIsoDepth(getTileCentreCoordX(thisMapData.innerDoors[i]['tileX']), getTileCentreCoordY(thisMapData.innerDoors[i]['tileY']), 0), "img", tileImages[(thisMapData.innerDoors[i]['graphic'])], Math.floor(thisX - hero.isox - thisGraphicCentreX + (canvasWidth / 2)), Math.floor(thisY - hero.isoy - thisGraphicCentreY + (canvasHeight / 2))]);
                }
            }
        }

        if (hasActivePet) {
            for (var i = 0; i < hero.activePets.length; i++) {
                thisNPCOffsetCol = currentAnimationFrame % hero.allPets[hero.activePets[i]]["animation"]["walk"]["length"];
                thisNPCOffsetRow = hero.allPets[hero.activePets[i]]["animation"]["walk"][hero.allPets[hero.activePets[i]].facing];
                thisX = findIsoCoordsX(hero.allPets[hero.activePets[i]].x, hero.allPets[hero.activePets[i]].y);
                thisY = findIsoCoordsY(hero.allPets[hero.activePets[i]].x, hero.allPets[hero.activePets[i]].y);
                assetsToDraw.push([findIsoDepth(hero.allPets[hero.activePets[i]].x, hero.allPets[hero.activePets[i]].y, hero.allPets[hero.activePets[i]].z), "sprite", activePetImages[i], thisNPCOffsetCol * hero.allPets[hero.activePets[i]].spriteWidth, thisNPCOffsetRow * hero.allPets[hero.activePets[i]].spriteHeight, hero.allPets[hero.activePets[i]].spriteWidth, hero.allPets[hero.activePets[i]].spriteHeight, Math.floor(thisX - hero.isox - hero.allPets[hero.activePets[i]].centreX + (canvasWidth / 2)), Math.floor(thisY - hero.isoy - hero.allPets[hero.activePets[i]].centreY + (canvasHeight / 2) - hero.allPets[hero.activePets[i]].z), hero.allPets[hero.activePets[i]].spriteWidth, hero.allPets[hero.activePets[i]].spriteHeight]);
            }
        }

        for (var i = 0; i < thisMapData.npcs.length; i++) {
            thisNPC = thisMapData.npcs[i];
            thisNPCOffsetCol = currentAnimationFrame % thisNPC["animation"][thisNPC.currentAnimation]["length"];
            thisNPCOffsetRow = thisNPC["animation"][thisNPC.currentAnimation][thisNPC.drawnFacing];
            thisX = findIsoCoordsX(thisNPC.x, thisNPC.y);
            thisY = findIsoCoordsY(thisNPC.x, thisNPC.y);
            //assetsToDraw.push([findIsoDepth(thisX, thisY), npcImages[i], Math.floor(thisX - hero.isox - thisNPC.centreX + (canvasWidth / 2)), Math.floor(thisY - hero.isoy - thisNPC.centreY + (canvasHeight / 2))]);
            thisNPCIdentifier = "npc" + thisMapData.npcs[i].name;
            assetsToDraw.push([findIsoDepth(thisNPC.x, thisNPC.y, thisNPC.z), "sprite", npcImages[thisNPCIdentifier], thisNPCOffsetCol * thisNPC.spriteWidth, thisNPCOffsetRow * thisNPC.spriteHeight, thisNPC.spriteWidth, thisNPC.spriteHeight, Math.floor(thisX - hero.isox - thisNPC.centreX + (canvasWidth / 2)), Math.floor(thisY - hero.isoy - thisNPC.centreY + (canvasHeight / 2) - thisNPC.z), thisNPC.spriteWidth, thisNPC.spriteHeight]);
        }
        for (var i = 0; i < thisMapData.items.length; i++) {
            thisItem = thisMapData.items[i];
            thisX = findIsoCoordsX(thisItem.x, thisItem.y);
            thisY = findIsoCoordsY(thisItem.x, thisItem.y);
            thisFileColourSuffix = "";
            if (thisMapData.items[i].colour) {
                thisColourName = getColourName(thisMapData.items[i].colour, thisMapData.items[i].type);
                if (thisColourName != "") {
                    thisFileColourSuffix = "-" + thisColourName.toLowerCase();
                }
            }
            thisItemIdentifier = "item" + thisMapData.items[i].type + thisFileColourSuffix;
            if (typeof thisItem.animation !== "undefined") {
                if (typeof thisItem.state !== "undefined") {
                    thisItemOffsetCol = (thisItem["animation"][thisItem.state]["length"]) - 1;
                    thisItemOffsetRow = thisItem["animation"][thisItem.state]["row"];
                } else {
                    // use facing:
                    thisItemOffsetCol = (thisItem["animation"]['facing']["length"]) - 1;
                    thisItemOffsetRow = thisItem["animation"]['facing'][thisItem.facing];
                }
                assetsToDraw.push([findIsoDepth(thisItem.x, thisItem.y, thisItem.z), "sprite", itemImages[thisItemIdentifier], thisItemOffsetCol * thisItem.spriteWidth, thisItemOffsetRow * thisItem.spriteHeight, thisItem.spriteWidth, thisItem.spriteHeight, Math.floor(thisX - hero.isox - thisItem.centreX + (canvasWidth / 2)), Math.floor(thisY - hero.isoy - thisItem.centreY + (canvasHeight / 2) - thisItem.z), thisItem.spriteWidth, thisItem.spriteHeight]);
            } else {
                assetsToDraw.push([findIsoDepth(thisItem.x, thisItem.y, thisItem.z), "img", itemImages[thisItemIdentifier], Math.floor(thisX - hero.isox - thisItem.centreX + (canvasWidth / 2)), Math.floor(thisY - hero.isoy - thisItem.centreY + (canvasHeight / 2) - thisItem.z)]);
            }
        }

        if (thisMapData.movingPlatforms) {
            for (var i = 0; i < thisMapData.movingPlatforms.length; i++) {
                thisPlatform = thisMapData.movingPlatforms[i];
                thisX = findIsoCoordsX(thisPlatform.x, thisPlatform.y);
                thisY = findIsoCoordsY(thisPlatform.x, thisPlatform.y);
                thisGraphicCentreX = thisMapData.graphics[thisPlatform.graphic].centreX;
                thisGraphicCentreY = thisMapData.graphics[thisPlatform.graphic].centreY;
                assetsToDraw.push([findIsoDepth(thisPlatform.x, thisPlatform.y, thisPlatform.z), "img", tileImages[thisPlatform.graphic], Math.floor(thisX - hero.isox - thisGraphicCentreX + (canvasWidth / 2)), Math.floor(thisY - hero.isoy - thisGraphicCentreY + (canvasHeight / 2))]);
            }
        }

        assetsToDraw.sort(sortByLowestValue);
        // don't need to clear, as the background will overwrite anyway - this means there's less to process.
        // scroll background to match the top tip and left tip of the tile grid:
        // the 400px and 300px are "padding" the edges of the background graphics:
        gameContext.drawImage(backgroundImg, Math.floor(getTileIsoCentreCoordX(0, mapTilesX - 1) - hero.isox - tileW / 2 - 400 + canvasWidth / 2), Math.floor(getTileIsoCentreCoordY(0, 0) - hero.isoy - tileH / 2 - 300 + canvasHeight / 2));
        // draw the sorted assets:
        for (var i = 0; i < assetsToDraw.length; i++) {
            switch (assetsToDraw[i][1]) {
                case "faeCentre":
                    // draw fae:
                    drawCircle("#ffdc0c", assetsToDraw[i][2], assetsToDraw[i][3], 2);
                    drawCircle("rgba(255,220,255,0.3)", assetsToDraw[i][2], assetsToDraw[i][3], 4);
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
                    gameContext.drawImage(assetsToDraw[i][2], assetsToDraw[i][3], assetsToDraw[i][4], assetsToDraw[i][5], assetsToDraw[i][6], assetsToDraw[i][7], assetsToDraw[i][8], assetsToDraw[i][9], assetsToDraw[i][10]);
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
                case "plotPlacementOverlay":
                    gameContext.globalCompositeOperation = 'soft-light';
                    // centre under the cursor - but 'snap' to nearest tiles
                    // find the difference in position between the cursor and the hero (at the centre of the screen):
                    var xDiff = cursorPositionX - (canvasWidth / 2);
                    var yDiff = cursorPositionY - (canvasHeight / 2);
                    // undefined first time:
                    if (cursorPositionX) {
                        // use the hero's iso position and that difference and calculate the non-iso coordinates:
                        var nonIsoCoordX = find2DCoordsX(hero.isox + xDiff, hero.isoy + yDiff);
                        var nonIsoCoordY = find2DCoordsY(hero.isox + xDiff, hero.isoy + yDiff);
                        var thisOverlayX, thisOverlayY, thisOverlayFill;
                        plotPlacement.numberOfBlockedTiles = 0;
                        for (var j = 0 - plotPlacement.width / 2; j < plotPlacement.width / 2; j++) {
                            for (var k = 0 - plotPlacement.length / 2; k < plotPlacement.length / 2; k++) {
                                thisOverlayX = nonIsoCoordX + tileW * j;
                                thisOverlayY = nonIsoCoordY + tileW * k;
                                thisOverlayFill = 'rgba(0,255,0,0.8)';
                                if (!tileIsClear(getTileX(thisOverlayX), getTileY(thisOverlayY))) {
                                    thisOverlayFill = 'rgba(255,0,0,0.8)';
                                    plotPlacement.numberOfBlockedTiles++;
                                }
                                // snap to tiles:
                                thisOverlayX = Math.floor(thisOverlayX / tileW) * tileW;
                                thisOverlayY = Math.floor(thisOverlayY / tileW) * tileW;
                                drawIsoRectangle(thisOverlayX, thisOverlayY, thisOverlayX + tileW, thisOverlayY + tileW, true, thisOverlayFill);
                            }
                        }
                        console.log("number of blocked tiles: " + plotPlacement.numberOfBlockedTiles);
                    }
                    gameContext.globalCompositeOperation = 'source-over';
                    break;
                case "img":
                    // standard image:
                    gameContext.drawImage(assetsToDraw[i][2], assetsToDraw[i][3], assetsToDraw[i][4]);
            }
        }

        if (activeObjectForDialogue != '') {
            UI.updateDialogue(activeObjectForDialogue);
        }

        if (thisMapData.showOnlyLineOfSight) {
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
    init();
} else {
    // sorry message / fallback? #####
}