var audioContext = null;
var soundEffects = {};
var soundsToLoad = {
    'coins': '../sounds/coins-NOT_MINE-wow.mp3',
    'bookOpen': '../sounds/book-open-NOT_MINE-wow.mp3',
    'bagOpen': '../sounds/bag-open-NOT_MINE-wow.mp3',
    'buttonClick': '../sounds/button-press-NOT_MINE-wow.mp3',
    'hen': '../sounds/hen-NOT_MINE.mp3'
};


// https://www.html5rocks.com/en/tutorials/webaudio/intro/

function BufferLoader(context, urlList, callback) {
    this.context = context;
    this.urlList = urlList;
    this.onload = callback;
    this.bufferList = new Array();
    this.loadCount = 0;
}

BufferLoader.prototype.loadBuffer = function(url, index) {
    // Load buffer asynchronously
    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";
    var loader = this;
    request.onload = function() {
        // Asynchronously decode the audio file data in request.response
        loader.context.decodeAudioData(
            request.response,
            function(buffer) {
                if (!buffer) {
                    console.log('error decoding file data: ' + url);
                    return;
                }
                loader.bufferList[index] = buffer;
                if (++loader.loadCount == loader.urlList.length)
                    loader.onload(loader.bufferList);
            },
            function(error) {
                console.log('decodeAudioData error', error);
            }
        );
    }
    request.onerror = function() {
        console.log('BufferLoader: XHR error');
    }
    request.send();
}

BufferLoader.prototype.load = function() {
    for (var i = 0; i < this.urlList.length; ++i)
        this.loadBuffer(this.urlList[i], i);
}

var audio = {
    init: function() {
        try {
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            audioContext = new AudioContext();
            var names = [];
            var paths = [];
            for (var name in soundsToLoad) {
                var path = soundsToLoad[name];
                names.push(name);
                paths.push(path);
            }
            bufferLoader = new BufferLoader(audioContext, paths, function(bufferList) {
                for (var i = 0; i < bufferList.length; i++) {
                    var buffer = bufferList[i];
                    var name = names[i];
                    soundEffects[name] = buffer;
                }
            });
            bufferLoader.load();
        } catch (e) {
            // web audio API not supported
            // fallback? 
            // ####
        }
    },

    playSound: function(buffer, delay) {
        var source = audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(audioContext.destination);
        if (!source.start) {
            source.start = source.noteOn;
        } else {
            source.start(delay);
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
    "(light green/lime)",
    "Tawny",
    "Black",
    "Ruby/Maroon",
    "(dark yellow/amber)",
    "(dark orange/sienna)",
    "(dark blue/sapphire)",
    "(indigo/imperial purple)",
    "(dark green/emerald/olive)",
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
var animationFramesPerSecond = 16;
var lastTime = 0;
var elapsed = 0;
var timeSinceLastFrameSwap = 0;
var currentAnimationFrame = 0;
var animationUpdateTime = (1000 / animationFramesPerSecond);


var titleTagPrefix = 'Autumn Earth';

// map changes:
var mapTransition = "";
var mapTransitionCurrentFrames = 1;
var mapTransitionMaxFrames = 60;
var activeDoorX = -1;
var activeDoorY = -1;

var characterId = 999;
var currentMap = 0;
var newMap = 0;
var thisMapData = '';
var mapTilesX = 0;
var mapTilesY = 0;

var tileGraphics = [];
var tileW = 48;
var tileH = tileW/2;
var tileGraphicsToLoad = 0;
var npcGraphicsToLoad = 0;
var itemGraphicsToLoad = 0;
var canvasWidth = 800;
var canvasHeight = 600;

var randomDungeonName = "";
var randomDungeons = ["","the-barrow-mines"];
var previousZoneName = "";

var currentActiveInventoryItems = [];
var maxNumberOfItemsPerSlot = 20;
var isSplitStackBeingDragged = false;

var activeTitles = [];

var inventoryInterfaceIsBuilt = false;

var whichTransitionEvent = '';

var activeNPCForDialogue = '';
var closeDialogueDistance = 200;
var canCloseDialogueBalloonNextClick = false;
var thisSpeech = '';

var boosterCardsRevealed = 0;
var boosterCardsToAdd = [];

var questData = [];

var colourNames = [];

var currentRecipePanelProfession = -1;
var currentItemGroupFilters = "";

var thisMapShopItemIds = '';
var shopCurrentlyOpen = -1;
var inflationModifier = 10;
var sellPriceModifier = 0.7;
var sellPriceSpecialismModifier = 0.8;
var buyPriceSpecialismModifier = 0.9;

// key bindings
var key = [0, 0, 0, 0, 0, 0, 0];

var hero = {
    x: 0,
    y: 0,
    z: 0,
    dx: 0,
    dy: 0,

    width: 20,
    height: 20,
    feetOffsetX: 40,
    feetOffsetY: 69,
    speed: 4,
 //   animationFrameIndex: 0,
 //   timeSinceLastFrameSwap: 0,
 //   animationUpdateTime: (1000 / animationFramesPerSecond),
    isMoving: false,
    facing: 's',
    sequences: {
        'stand-s': [3],
        'stand-n': [10],
        'stand-w': [17],
        'stand-e': [24],
        'walk-s': [3, 4, 5, 6, 5, 4, 3, 2, 1, 0, 1, 2],
        'walk-n': [10, 11, 12, 13, 12, 11, 10, 9, 8, 7, 8, 9],
        'walk-w': [17, 18, 19, 20, 19, 18, 17, 16, 15, 14, 15, 16],
        'walk-e': [24, 25, 26, 27, 26, 25, 24, 23, 22, 21, 22, 23]
    }

};

var fae = {
particles: [],
maxParticles: 18,
radiusAroundHero: 20,
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
if(recipeCustomScrollBar) {
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
    var recipeId = whichRecipe.substring(6);
    var foundItemGroups;
    var thisRecipe = hero.crafting[currentRecipePanelProfession].recipes[recipeId];
    var beingCreatedMarkup = '<img src="/images/game-world/inventory-items/' + thisRecipe.imageId + '.png" alt="' + thisRecipe.recipeName + '"><h3>' + thisRecipe.recipeName + '</h3><p>' + thisRecipe.recipeDescription + '</p><h4>Requires:</h4>';
    // find all components that the player as that are usable for this recipe as well:
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
    beingCreatedMarkup += '<li><img src="/images/game-world/inventory-items/enchant.png" alt="">Optional enchanted item</li>';
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
thisDevicesScrollBarWidth = scrollbarWidth();

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


// find tile from coords:
function getTileX(x) {
    return Math.floor(x/tileW);
}
function getTileY(y) {
    return Math.floor(y/tileW);
}


// find Iso coords from 2d coords:
function findIsoCoordsX(x, y) {
   return Math.floor((mapTilesY * tileW/2) -y/2 + x/2);
}
function findIsoCoordsY(x, y) {
    // the -tileH/2 is because the tile centre was at 0,0, and so the tip would be off the top of the screen
return Math.floor((x/4) + (y/4) - tileH/2);
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


// find current tile based on non-iso coords
function getCurrentTileX(x) {
    return Math.floor(x/tileW);
}
function getCurrentTileY(y) {
    return Math.floor(y/tileW);
}


function getElevation(tileX,tileY) {
 
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



var facingsPossible = ["n","e","s","w"];

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






function hasLineOfSight(startx, starty, endx, endy) {
    var nextx = startx;
    var nexty = starty;
    var pathy = [];
    var pathx = [];
    var deltay = endy - starty;
    var deltax = endx - startx;
    var currentStep = 0;
    var fraction, previousx, previousy, stepx, stepy;
    //
    // path direction calculation:
    if (deltay < 0) {
        stepy = -1;
    } else {
        stepy = 1;
    }
    if (deltax < 0) {
        stepx = -1;
    } else {
        stepx = 1;
    }
    deltay = Math.abs(deltay * 2);
    deltax = Math.abs(deltax * 2);
    previousx = startx;
    previousy = starty;
    // bresenham algorithm:
    if (deltax > deltay) {
        fraction = deltay * 2 - deltax;
        while (nextx != endx) {
            if (fraction >= 0) {
                nexty += stepy;
                fraction -= deltax;
            }
            nextx += stepx;
            fraction += deltay;

            if (thisMapData.collisions[nexty][nextx] != 0) {
                // tile is non-walkable;
                return false;
                break;
            }
            // add relative movement to the array:                                                                                                                  
            pathy[currentStep] = nexty - previousy;
            pathx[currentStep] = nextx - previousx;
            previousy = nexty;
            previousx = nextx;
            currentStep++;
        }
    } else {
        fraction = deltax * 2 - deltay;
        while (nexty != endy) {
            if (fraction >= 0) {
                nextx += stepx;
                fraction -= deltay;
            }
            nexty += stepy;
            fraction += deltax;

            if (thisMapData.collisions[nexty][nextx] != 0) {
                // tile is non-walkable;
                return false;
                break;
            }
            // add relative movement to the array:                                                                                                                  
            pathy[currentStep] = nexty - previousy;
            pathx[currentStep] = nextx - previousx;
            previousy = nexty;
            previousx = nextx;
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



function drawCircle(fillStyle,x,y,radius) {
gameContext.fillStyle = fillStyle;
    gameContext.beginPath();
    gameContext.arc(x,y,radius, 0, 2 * Math.PI);
    gameContext.fill();
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


allCardPacks = [
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
    processPlayerWinSpeech(thisNPC, thisNPC.cardGameSpeech.lose[0], thisNPC.cardGameSpeech.lose[1]);
    closeCardGame();
}

function cardGamePlayer1Wins() {
    // player lost
    hero.stats.cardGamesLost++;
    hero.currency.cardDust += 1;
    UI.updateCurrencies();
    processSpeech(thisNPC, thisNPC.cardGameSpeech.win[0], thisNPC.cardGameSpeech.win[1]);
    closeCardGame();
}

function cardGameIsDrawn() {
    hero.stats.cardGamesDrawn++;
    hero.currency.cardDust += 3;
    UI.updateCurrencies();
    processSpeech(thisNPC, thisNPC.cardGameSpeech.draw[0], thisNPC.cardGameSpeech.draw[1]);
    closeCardGame();
}

function processPlayerWinSpeech(thisNPC, thisSpeechPassedIn, thisSpeechCode) {
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
                UI.showDialogue(thisNPC, thisNPC.cardGameSpeech.lose[0] + questSpeech[2]);
                canCloseDialogueBalloonNextClick = true;
                checkForTitlesAwarded(questId);
            }
        } else {
            // there was a quest, but it's been completed - just show ordinary text:
            processSpeech(thisNPC, thisNPC.cardGameSpeech.lose[0], thisNPC.cardGameSpeech.lose[1]);
        }
    } else {
        // no quest associated, just show ordinary text:
        processSpeech(thisNPC, thisNPC.cardGameSpeech.lose[0], thisNPC.cardGameSpeech.lose[1]);
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

var Input = {
    init: function() {
        // Set up the keyboard events
        document.addEventListener('keydown', function(e) { Input.changeKey(e, 1, "down") });
        document.addEventListener('keyup', function(e) { Input.changeKey(e, 0, "up") });
    },

    // called on key up and key down events
    changeKey: function(e, to, type) {
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
        }
    }
}

function canAddItemToInventory(itemObj) {
    console.log(itemObj);
    // takes an array of objects and checks if all of them can be added before adding any of them
    // make copy of inventory:
    var inventoryClone = JSON.parse(JSON.stringify(hero.inventory));
    var slotsUpdated = [];
    var allItemsAdded = true;
    for (var k = 0; k < itemObj.length; k++) {
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
if(amountAddedToThisSlot>0) {
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
    if (allItemsAdded) {
        // make the active inventory be the same as the amended one:
        hero.inventory = JSON.parse(JSON.stringify(inventoryClone));
        // update panels if needed:
        UI.updateInscriptionPanel();
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
    return false;
}





function inventoryItemAction(whichSlot, whichAction, whichActionValue) { // remove the 'slot' prefix with the substring(4):
    var whichSlotNumber = whichSlot.parentElement.id.substring(4);
    switch (whichAction) {
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
            audio.playSound(soundEffects['bagOpen'],0);
            removeFromInventory(whichSlotNumber, 1);
            break;
            case "inscribe":
            UI.openInscriptionPanel();
            break;
        case "card":
            hero.cards.unshift(whichActionValue);
            UI.updateCardAlbum();
            removeFromInventory(whichSlotNumber, 1);
            break;
        case "book":
            document.getElementById("book" + whichActionValue).classList.add("active");
            audio.playSound(soundEffects['bookOpen'],0);
        case "recipe":
            if (canLearnRecipe(whichActionValue)) {
                removeFromInventory(whichSlotNumber, 1);
            }
            break;
        case "craft":
            if (hero.professionsKnown.indexOf(parseInt(whichActionValue)) != -1) {
                audio.playSound(soundEffects['buttonClick'],0);
                UI.populateRecipeList(whichActionValue);
            } else {
                UI.showNotification("<p>You don't know this profession yet.</p>");
            }
            break;
    }
}






function additionalTooltipDetail(whichSlotID) {
    // get any information that needs displaying in the tooltip:
    var tooltipInformationToAdd = "";
    if (currentActiveInventoryItems[hero.inventory[whichSlotID].type].action == "recipe") {
        // check if it's known already:
        var isKnown = false;
        for (var i=0; i<hero.recipesKnown.length;i++) {
            if(hero.recipesKnown[i][0] == currentActiveInventoryItems[hero.inventory[whichSlotID].type].actionValue) {
isKnown = true;
            }
        }
        if (isKnown) {
            tooltipInformationToAdd += " (already known)";
        }
    }
    return tooltipInformationToAdd;
}

/*
function generateBookContent(thisSlotsId) {
    var paramsList = "isAjax=true&whichSlot=" + thisSlotsId;
                getJSONWithParams("/scriptorium/generateBook.php", paramsList, function(data) {
                    var whichReturnedSlot = data.book.whichSlot;

                    hero.inventory[whichReturnedSlot].inscription.title = data.book.title;
                    hero.inventory[whichReturnedSlot].inscription.content = data.book.content;
                    UI.buildBook(whichReturnedSlot);
                    document.getElementById("slot" + whichReturnedSlot).firstElementChild.setAttribute("data-action", "book");
                    document.getElementById("slot" + whichReturnedSlot).firstElementChild.setAttribute("data-action-value", generateHash(hero.inventory[whichReturnedSlot].inscription.content));

document.getElementById("slot" + whichReturnedSlot).firstElementChild.nextSibling.innerHTML = '<em>'  + currentActiveInventoryItems[hero.inventory[whichReturnedSlot].type].shortname + ' </em>&quot;' + data.book.title + '&quot; <span class="price">Sell price: ' + parseMoney(hero.inventory[whichReturnedSlot].quantity * currentActiveInventoryItems[hero.inventory[whichReturnedSlot].type].priceCode, 0) + '</span>' + additionalTooltipDetail(whichReturnedSlot);

                }, function(status) {
                    // error - try again:
                    generateBookContent(thisSlotsId);
                });
}
*/

function generateSlotMarkup(thisSlotsId) {
    var slotMarkup = '';
    var theColourPrefix = "";
    var thisFileColourSuffix = "";
    var imageClassName = "";
    var thisColourName = getColourName(hero.inventory[thisSlotsId].colour, hero.inventory[thisSlotsId].type);
    if (thisColourName != "") {
        theColourPrefix = thisColourName + " ";
        thisFileColourSuffix = "-" + thisColourName.toLowerCase();
    }
    var thisAction = currentActiveInventoryItems[hero.inventory[thisSlotsId].type].action;
    var isABook = false;
    if (thisAction) {
        if (thisAction == "book") {
            if(hero.inventory[thisSlotsId].inscription.content) {
            isABook = true;
        }
        }
    }
    dataActionMarkup = '';
    if (thisAction) {
        if (isABook) {
            // link this item up to the book panel using the unique hash:
            dataActionMarkup = 'data-action="' + thisAction + '" data-action-value="' + generateHash(hero.inventory[thisSlotsId].inscription.content) + '" ';
            UI.buildBook(thisSlotsId);
        } else {
            dataActionMarkup = 'data-action="' + thisAction + '" data-action-value="' + currentActiveInventoryItems[hero.inventory[thisSlotsId].type].actionValue + '" ';
        }
    }

    var thisCategories = currentActiveInventoryItems[hero.inventory[thisSlotsId].type].category.split(",");
    for (var i = 0; i < thisCategories.length; i++) {
        imageClassName += "itemCategory" + thisCategories[i] + " ";
    }


    // check if it's a card:
    if (currentActiveInventoryItems[hero.inventory[thisSlotsId].type].action == "card") {
        imageClassName += 'players card';
    }

    slotMarkup += '<img src="/images/game-world/inventory-items/' + hero.inventory[thisSlotsId].type + thisFileColourSuffix + '.png" ' + dataActionMarkup + 'alt="' + theColourPrefix + currentActiveInventoryItems[hero.inventory[thisSlotsId].type].shortname + '" class="' + imageClassName + '">';
    if (isABook) {
        var itemsDescription = "&quot;" + hero.inventory[thisSlotsId].inscription.title + "&quot;";
    } else {
        var itemsDescription = currentActiveInventoryItems[hero.inventory[thisSlotsId].type].description;
    }
    if (itemsDescription.indexOf('##contains##') != -1) {
        // check it has got contains content:
        if (typeof hero.inventory[thisSlotsId].contains !== "undefined") {
            var containsItems = '';
            for (var i = 0; i < hero.inventory[thisSlotsId].contains.length; i++) {
                if (i != 0) {
                    containsItems += ", ";
                }
                containsItems += hero.inventory[thisSlotsId].contains[i].quantity + "x " + currentActiveInventoryItems[hero.inventory[thisSlotsId].contains[i].type].shortname;
            }
            itemsDescription = itemsDescription.replace('##contains##', containsItems);
        }
    }
    slotMarkup += '<p><em>' + theColourPrefix + currentActiveInventoryItems[hero.inventory[thisSlotsId].type].shortname + ' </em>' + itemsDescription + ' ';
    slotMarkup += '<span class="price">Sell price: ' + parseMoney(Math.ceil(hero.inventory[thisSlotsId].quantity * sellPriceModifier * inflationModifier * currentActiveInventoryItems[hero.inventory[thisSlotsId].type].priceCode, 0)) + '</span>';
    slotMarkup += '<span class="price specialismPrice">Sell price: ' + parseMoney(Math.ceil(hero.inventory[thisSlotsId].quantity * sellPriceSpecialismModifier * inflationModifier * currentActiveInventoryItems[hero.inventory[thisSlotsId].type].priceCode, 0)) + '</span>';
    slotMarkup += additionalTooltipDetail(thisSlotsId) + '</p>';
    slotMarkup += '<span class="qty">' + hero.inventory[thisSlotsId].quantity + '</span>';
    return slotMarkup;
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

        UI.activeDragObject.style.cssText = "z-index:2;top: " + objInitTop + "px; left: " + objInitLeft + "px; transform: translate(0px, 0px);";
        document.addEventListener("mousemove", UI.handleDrag, false);
        document.addEventListener("mouseup", UI.endInventoryDrag, false);
    }
    console.log(UI.draggedInventoryObject);
    splitStackPanel.classList.remove("active");

}

function inventorySplitStackCancel() {
    splitStackPanel.classList.remove("active");
}

var KeyBindings = {
    'left': 37,
    'right': 39,
    'up': 38,
    'down': 40,
    'pause': 80,
    'action': 17,
    'shift': 16,
    'challenge': 67
}

// global vars:
var recipeSearch = document.getElementById('recipeSearch');
var clearRecipeSearch = document.getElementById('clearRecipeSearch');
var recipeFilter = document.getElementById('recipeFilter');
var splitStackInput = document.getElementById('splitStackInput');
var splitStackPanel = document.getElementById('splitStackPanel');
var shopSplitStackInput = document.getElementById('shopSplitStackInput');
var shopSplitStackPanel = document.getElementById('shopSplitStackPanel');
var craftingRecipeCreateButton = document.getElementById('craftingRecipeCreateButton');
var craftingPanel = document.getElementById('craftingPanel');
var selectComponentsItemBeingCreated = document.getElementById('selectComponentsItemBeingCreated');
var componentsAvailableForThisRecipe = document.getElementById('componentsAvailableForThisRecipe');
var booksAndParchments = document.getElementById('booksAndParchments');
var gameWrapper = document.getElementById('gameWrapper');
var inventoryPanels = document.getElementById('inventoryPanels');
var shopPanel = document.getElementById('shopPanel');
var inscriptionPanel = document.getElementById('inscriptionPanel');
var inscriptionTextArea = document.getElementById('inscriptionTextArea');
var sourceSelection = document.getElementById('sourceSelection');
var materialsSelection = document.getElementById('materialsSelection');
var inkSelection = document.getElementById('inkSelection');



var UI = {
    init: function() {
        // cache all local references to UI elements:
        var displayZoneName = document.getElementById('displayZoneName');
        var activeCartographicMap = document.getElementById('activeCartographicMap');
        var cartographicTitle = document.getElementById('cartographicTitle');
        var dialogue = document.getElementById('dialogue');
        var notification = document.getElementById('notification');
        var cardGameWrapper = document.getElementById('cardGameWrapper');
        var cardAlbumList = document.getElementById('cardAlbumList');
        var boosterPack = document.getElementById('boosterPack');
        var createRecipeList = document.getElementById('createRecipeList');
        var recipeTitleBar = document.getElementById('recipeTitleBar');
        var currencies = document.getElementById('currencies');
        //

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
        var thisAction, thisBagNumberOfSlots, thisSlotsID;

        // loop through number of bags
        for (var i = 0; i < hero.bags.length; i++) {
            inventoryMarkup += '<div class="inventoryBag" id="inventoryBag' + i + '"><div class="draggableBar">' + currentActiveInventoryItems[hero.bags[i].type].shortname + '</div><ol class="active" id="bag' + i + '">';
            thisBagNumberOfSlots = currentActiveInventoryItems[hero.bags[i].type].actionValue;
            // loop through slots for each bag:
            for (var j = 0; j < thisBagNumberOfSlots; j++) {
                thisSlotsID = i + '-' + j;
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

        inventoryPanels.innerHTML = inventoryMarkup;
        gameWrapper.ondblclick = UI.doubleClick;
        document.getElementById('createRecipeList').onclick = UI.craftingPanelSingleClick;
        document.getElementById('craftingRecipeCreateButton').onclick = UI.craftingRecipeCreate;
        splitStackPanel.onsubmit = inventorySplitStackSubmit;
        shopSplitStackPanel.onsubmit = UI.shopSplitStackSubmit;
        document.getElementById('splitStackCancel').onclick = inventorySplitStackCancel;
        document.getElementById('shopSplitStackCancel').onclick = UI.shopSplitStackCancel;
        UI.initInventoryDrag('.inventoryBag ol');
        UI.initShopDrag();
        UI.updateCardAlbum();
        UI.updateCurrencies();
        UI.buildRecipePanel();
        UI.updateInscriptionPanel();
        if (hero.professionsKnown.length > 0) {
            // load and cache the first profession's recipe assets:
            UI.populateRecipeList(hero.professionsKnown[0]);
        }

        gameWrapper.onmousedown = UI.globalMouseDown;
        gameWrapper.onclick = UI.globalClick;

        inventoryInterfaceIsBuilt = true;
    },

    addNewBag: function(newBagObject) {
        // add to object:
        hero.bags.push(newBagObject);
        i = hero.bags.length - 1;
        inventoryMarkup = '<div class="inventoryBag" id="inventoryBag' + i + '"><div class="draggableBar">' + currentActiveInventoryItems[hero.bags[i].type].shortname + '</div><ol class="active" id="bag' + i + '">';
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
        // add a transition end detector to just the first element that will be changed:
        document.getElementById("slot" + whichSlotsToUpdate[0]).addEventListener(whichTransitionEvent, function removeSlotStatus(e) {
            elementList = document.querySelectorAll('#inventoryPanels .changed');
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
        UI.activeDragObject.style.cssText = "z-index:2;top: " + objInitTop + "px; left: " + objInitLeft + "px; transform: translate(" + (e.pageX - dragStartX) + "px, " + (e.pageY - dragStartY) + "px);";
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
                for (j = 0; j < dragTargetsInner.length; j++) {
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
            }
        }


    },

    showDialogue: function(whichNPC, text) {
        // check for random variation in text:
        var textToShow = getRandomElementFromArray(text.split("/"));
        if (activeNPCForDialogue != '') {
            dialogue.removeEventListener(whichTransitionEvent, UI.removeActiveDialogue, false);
        }
        dialogue.innerHTML = textToShow;
        dialogue.classList.remove("slowerFade");
        dialogue.classList.add("active");
        activeNPCForDialogue = whichNPC;
        UI.updateDialogue(activeNPCForDialogue);
    },

    updateDialogue: function(whichNPC) {
        // maybe store these values if NPCs are never going to move while a speech balloon is attached to them? #####
        var thisX = findIsoCoordsX(whichNPC.x, whichNPC.y);
        var thisY = findIsoCoordsY(whichNPC.x, whichNPC.y);
 
        // -40 x so the balloon tip is at '0' x
        var thisTransform = "translate(" + Math.floor(thisX - hero.isox + (canvasWidth / 2) - 40) + "px," + Math.floor(0 - (canvasHeight - (thisY - hero.isoy - whichNPC.centreY + (canvasHeight / 2))) - whichNPC.z) + "px)";
        dialogue.style.transform = thisTransform;
    },

    removeActiveDialogue: function() {
        activeNPCForDialogue = '';
        dialogue.removeEventListener(whichTransitionEvent, UI.removeActiveDialogue, false);
    },


    showNotification: function(markup) {
        notification.classList.remove("active");
        notification.innerHTML = markup;
        void notification.offsetWidth;
        notification.classList.add('active');
    },

    updateCardAlbum: function() {
        var cardAlbumMarkup = '';
        var thisCardsClass, thisCardsQuantityOutput;

        // count quantities for each card:
        // http://stackoverflow.com/questions/5667888/counting-the-occurrences-of-javascript-array-elements#answer-5668029
        var counts = {};
        for (var i = 0; i < hero.cards.length; i++) {
            var num = hero.cards[i];
            counts[num] = counts[num] ? counts[num] + 1 : 1;
        }

        // first element in allCardData is null
        for (var i = 1; i < cardGameNameSpace.allCardData.length; i++) {

            thisCardsClass = 'card players';
            thisCardsQuantityOutput = '';
            if (!(counts[i])) {
                thisCardsClass += ' inactive';
            } else {
                thisCardsQuantityOutput = '<span class="quantity">' + counts[i] + '</span>';
            }
            cardAlbumMarkup += '<li><img src="/images/card-game/cards/' + i + '.png" class="' + thisCardsClass + '" alt="' + cardGameNameSpace.allCardData[i][2] + ' card">' + thisCardsQuantityOutput + '</li>';

            // check for rares - these are the negative of the standard card type:
            if ((counts[(0 - i)])) {
                cardAlbumMarkup += '<li class="rare"><div class="card players" style="background-image:url(/images/card-game/cards/' + (0 - i) + '.png)"></div><span class="quantity">' + counts[(0 - i)] + '</span></li>';
            }

        }
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
            if (recipeCustomScrollBar) {
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

        var thisNode = e.target;
        // find the id of the parent if actual dropped target doesn't have one:
        while (!thisNode.id) {
            thisNode = thisNode.parentNode;
        }
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
                            audio.playSound(soundEffects['coins'],0);
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
                                audio.playSound(soundEffects['coins'],0);
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
                            UI.slideDraggedSlotBack();
                        }
                    } else {
                        // otherwise slide it back
                        UI.slideDraggedSlotBack();
                    }
                }
            }
        } else if (droppedSlot.substring(0, 12) == "inventoryBag") {
            if (isFromAShop) {
                if (hero.currency[thisCurrency] >= buyPriceForOne) {
                    // find an empty slot and drop it in:
                    var emptySlotFound = -1;
                    var thisInventoryPanelId = droppedSlot.substring(12);
                    var sourceSlotHyphenPos = UI.sourceSlot.indexOf("-");
                    var thisSourceInventoryPanelId = UI.sourceSlot.substring(0, sourceSlotHyphenPos);
                    var thisBagNumberOfSlots = currentActiveInventoryItems[hero.bags[thisInventoryPanelId].type].actionValue;
                    // loop through slots for this bag:
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
                        audio.playSound(soundEffects['coins'],0);
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
                var thisInventoryPanelId = droppedSlot.substring(12);
                var sourceSlotHyphenPos = UI.sourceSlot.indexOf("-");
                var thisSourceInventoryPanelId = UI.sourceSlot.substring(0, sourceSlotHyphenPos);
                if (thisInventoryPanelId == thisSourceInventoryPanelId) {
                    UI.slideDraggedSlotBack();
                } else {
                    // otherwise find an empty slot and drop it in:
                    var emptySlotFound = -1;
                    var thisBagNumberOfSlots = currentActiveInventoryItems[hero.bags[thisInventoryPanelId].type].actionValue;
                    // loop through slots for this bag:
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
            
        } else if(thisNode.classList.contains('shop')) {
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
                audio.playSound(soundEffects['coins'],0);
            if (!isSplitStackBeingDragged) {
              
             
            } else {

            }
            UI.droppedSuccessfully();
},

    droppedSuccessfully: function() {
        // hide the clone:





        UI.activeDragObject.style.cssText = "z-index:2;";
        UI.activeDragObject = '';
        if (isSplitStackBeingDragged) {
            isSplitStackBeingDragged = false;
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
                        splitStackPanel.style.cssText = "z-index:2;top: " + objInitTop + "px; left: " + objInitLeft + "px;";
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
                            UI.activeDragObject.style.cssText = "z-index:2;top: " + objInitTop + "px; left: " + objInitLeft + "px; transform: translate(0px, 0px);";
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
        UI.activeDragObject.style.cssText = "z-index:2;left: " + (objInitLeft) + "px; top: " + (objInitTop) + "px;transition: transform 0.4s ease;";
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

    buildBook: function(whichBook) {
        var markupToAdd = '';
        // var parsedDoc, numberOfPages;
     
        
        var thisBooksContent = hero.inventory[(whichBook)].inscription.content;
        var thisBooksHash = generateHash(thisBooksContent);
        // check if the book already has been created:
        if (!document.getElementById('book' + thisBooksHash)) {
            markupToAdd += '<div class="book inkColour'+hero.inventory[(whichBook)].colour+'" id="book' + thisBooksHash + '">';
            markupToAdd += '<div class="draggableBar">&quot;' + hero.inventory[(whichBook)].inscription.title + '&quot;</div>';
            markupToAdd += '<button class="closePanel">close</button>';
            /*
                        // determine the number of pages (identified by the <section> elements):
                        parsedDoc = new DOMParser().parseFromString(hero.inventory[(whichBook)].inscription.content, "text/html");
                        numberOfPages = parsedDoc.getElementsByTagName("SECTION").length;
                        if(numberOfPages>1) {

                        } else {
                             markupToAdd += hero.inventory[(whichBook)].inscription.content;
                        }
                       */
            markupToAdd += hero.inventory[(whichBook)].inscription.content;
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
                    if (activeNPCForDialogue != '') {
                        //  dialogue.classList.add("slowerFade");
                        dialogue.classList.remove("active");
                        activeNPCForDialogue.speechIndex = 0;
                        UI.removeActiveDialogue();

                    }
                }
            }
        }
    },


    updateCurrencies: function() {
        currencies.innerHTML = '<p>' + parseMoney(hero.currency.money) + '</p><p>' + hero.currency.cardDust + '<span class="card"><span></p>';

    },

    buildShop: function(markup) {
        shopPanel.innerHTML = markup;
    },

    openShop: function(shopHash) {
        shopCurrentlyOpen = shopHash;
        document.getElementById("shop" + shopHash).classList.add("active");
        inventoryPanels.classList.add("shopSpecialism"+document.getElementById("shop" + shopHash).getAttribute('data-specialism'));
    },

    closeShop: function() {
        document.getElementById("shop" + shopCurrentlyOpen).classList.remove("active");
        shopCurrentlyOpen = -1;
        inventoryPanels.removeAttribute('class');

    },

    shopSplitStackCancel: function() {
        shopSplitStackPanel.classList.remove("active");
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
                audio.playSound(soundEffects['coins'],0);
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
            if(!isSplitStackBeingDragged) {
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
                        shopSplitStackPanel.style.cssText = "z-index:2;top: " + objInitTop + "px; left: " + objInitLeft + "px;";
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
                        UI.activeDragObject.style.cssText = "z-index:2;top: " + objInitTop + "px; left: " + objInitLeft + "px; transform: translate(0px, 0px);";
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
                audio.playSound(soundEffects['coins'],0);
                UI.showChangeInInventory(inventoryCheck[1]);
            } else {
                UI.showNotification("<p>Oops - sorry, no room in your bags</p>");
            }
        }
        shopSplitStackPanel.classList.remove("active");
    },


    openInscriptionPanel: function() {
        audio.playSound(soundEffects['bookOpen'],0);
        // clear previous content:
        inscriptionTextArea.innerHTML = '';
inscriptionPanel.classList.add("active");
    },

    updateInscriptionPanel: function() {
        var allInksMarkup = '<h3>Inks available:</h3><ol>';
        var allSourceMarkup = '<h3>Documents available:</h3><ol>';
        var allMaterialsMarkup = '<h3>Materials available:</h3><ol>';
        var thisFileColourSuffix, thisColourName, theColourPrefix;
for (var i in hero.inventory) {
    if(hero.inventory[i].type == 40) {

 thisFileColourSuffix = '';
 theColourPrefix = "";
   thisColourName = getColourName(hero.inventory[i].colour, hero.inventory[i].type);
    if (thisColourName != "") {

theColourPrefix = thisColourName + " ";
        thisFileColourSuffix = "-" + thisColourName.toLowerCase();
    }

allInksMarkup += '<li><img src="/images/game-world/inventory-items/40'+thisFileColourSuffix+'.png" alt="'+theColourPrefix+currentActiveInventoryItems[40].shortname+'"><h3>'+theColourPrefix+currentActiveInventoryItems[40].shortname+'</h3><p>'+currentActiveInventoryItems[40].description+'</p></li>';
    } else {

  var thisAction = currentActiveInventoryItems[hero.inventory[i].type].action;
    var isABook = false;
    if (thisAction) {
        if (thisAction == "book") {
            
            isABook = true;
        
        }
    }


if(isABook) {
    if(hero.inventory[i].inscription.content) {
    // has content, so add it to the source list:
allSourceMarkup += '<li><img src="/images/game-world/inventory-items/'+hero.inventory[i].type+'.png" alt="'+currentActiveInventoryItems[hero.inventory[i].type].shortname+'"><h3>'+currentActiveInventoryItems[hero.inventory[i].type].shortname+'</h3><p>'+hero.inventory[i].inscription.title+'</p></li>';

} else {
    // no content, add it to the materials list:
    allMaterialsMarkup += '<li><img src="/images/game-world/inventory-items/'+hero.inventory[i].type+'.png" alt="'+currentActiveInventoryItems[hero.inventory[i].type].shortname+'"><h3>'+currentActiveInventoryItems[hero.inventory[i].type].shortname+'</h3><p>'+currentActiveInventoryItems[hero.inventory[i].type].description+'</p></li>';
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
     
    sizeCanvasSize();


    whichTransitionEvent = determineWhichTransitionEvent();
    gameMode = "mapLoading";

    cartographyCanvas = document.getElementById("cartographyCanvas");
    cartographyContext = cartographyCanvas.getContext('2d');
    offScreenCartographyCanvas = document.getElementById("offScreenCartographyCanvas");
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
        hero.tileX = data.tileX;
        hero.tileY = data.tileY;
        currentMap = data.currentMap;
        newMap = currentMap;
        hero.bags = data.bags;
        hero.cards = data.cards;
        hero.stats = data.stats;
        hero.currency = data.currency;
        hero.titlesEarned = data.titlesEarned;
        hero.activeTitle = data.activeTitle;
        hero.recipesKnown = data.recipesKnown;
        hero.professionsKnown = data.professionsKnown;
        hero.totalGameTimePlayed = data.totalGameTimePlayed;
        // copy the fae properties that will change into the main fae object:
        for (var attrname in data.fae) {
            fae[attrname] = data.fae[attrname];
        }
        hero.inventory = data.inventory;
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
    coreImagesToLoad = [];
    coreImagesToLoad.push({
        name: "heroImg",
        src: '/images/game-world/core/test-iso-hero.png'
    });
    Loader.preload(coreImagesToLoad, prepareCoreAssets, loadingProgress);
}

function prepareCoreAssets() {
    heroImg = Loader.getImage("heroImg");
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
    console.log("mapFilePath: " + mapFilePath);
    getJSON(mapFilePath, function(data) {
        thisMapData = data.map;
        mapTilesY = thisMapData.terrain.length;
        mapTilesX = thisMapData.terrain[0].length;
        if (previousZoneName != thisMapData.zoneName) {
            UI.showZoneName(thisMapData.zoneName);
            document.title = titleTagPrefix + ' - ' + thisMapData.zoneName;
            cartographicTitle.innerHTML = thisMapData.zoneName;
        }
        initCartographicMap();
        findProfessionsAndRecipes();
        fae.recentHotspots = [];
    }, function(status) {
        // try again:
        loadMapJSON(mapFilePath);
    });
}


function loadMap() {
    var mapFilePath;
    console.log("going from " + currentMap + " to " + newMap);
    // check for newly entering a random dungeon:
    if ((newMap < 0) && (currentMap > 0)) {
        randomDungeonName = randomDungeons[Math.abs(newMap)];
        newMap = -1;
    } else {
        mapFilePath = '/data/chr' + characterId + '/map' + newMap + '.json';
    }
    if (newMap < 0) {
        // find door centre:
        var targetDoorX = 0;
        var targetDoorY = 0;
        var doorData = thisMapData.doors;
        for (var i in doorData) {
            if (doorData[i].map == newMap) {
                targetDoorX += doorData[i].startX;
                targetDoorY += doorData[i].startY;
            }
        }
        // this assumes random maps always have a 3x1 doorway (the average of the doors will be the centre door)
        var centreDoorX = targetDoorX / 3;
        var centreDoorY = targetDoorY / 3;
        mapFilePath = '/game-world/generateDungeonMap.php?playerId=' + characterId + '&originatingMapId=' + currentMap + '&requestedMap=' + newMap + '&dungeonName=' + randomDungeonName + '&connectingDoorX=' + centreDoorX + '&connectingDoorY=' + centreDoorY;
         
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
    imagesToLoad.push({
        name: "backgroundImg",
        src: '/images/game-world/maps/' + assetPath + '/bg.png'
    });
    tileGraphicsToLoad = thisMapData.graphics;
    for (var i = 0; i < tileGraphicsToLoad.length; i++) {
        imagesToLoad.push({
            name: "tile" + i,
            src: "/images/game-world/maps/" + assetPath + "/" + tileGraphicsToLoad[i].src
        });
    }
    npcGraphicsToLoad = thisMapData.npcs;
    for (var i = 0; i < npcGraphicsToLoad.length; i++) {
        imagesToLoad.push({
            name: "npc" + npcGraphicsToLoad[i].name,
            src: "/images/game-world/npcs/" + npcGraphicsToLoad[i].src
        });
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

    Loader.preload(imagesToLoad, prepareGame, loadingProgress);
}



function loadTitles() {
    var itemIdsToGet = hero.titlesEarned.join("|");
    getJSON("/game-world/getActiveTitles.php?whichIds=" + itemIdsToGet, function(data) {
        activeTitles = data;
       
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
        var shopData = JSON.parse('{"mapNumber": ' + currentMap + ',"shops": ' + JSON.stringify(thisMapData.shops) + '}');
        // loop through shops and create hashes 
        for (var i = 0; i < shopData.shops.length; i++) {
            shopData.shops[i].hash = generateHash(shopData.shops[i].name);
        }
        loadShopData('shopData=' + JSON.stringify(shopData));
    }
}



function loadShopData(shopJSONData) {
    // post data with getJSONWithParams function ####
    getJSONWithParams("/game-world/getShopItems.php", shopJSONData, function(data) {
        thisMapShopItemIds = data.allItemIds;
        UI.buildShop(data.markup);
        findInventoryItemData();
    }, function(status) {
        // try again:
        loadShopData(shopJSONData);
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
            for (var i=0; i<hero.inventory[arrkey].contains.length;i++) {
                itemIdsToGet.push(hero.inventory[arrkey].contains[i].type);
            }
        }

    }
    // find bag items:
    for (var i = 0; i < hero.bags.length; i++) {
        itemIdsToGet.push(hero.bags[i].type);
    }
    // find items placed on this map:
    for (var i = 0; i < thisMapData.items.length; i++) {
        itemIdsToGet.push(thisMapData.items[i].type);
    }
    // find items in recipes:
    for (var i in hero.crafting) {
        for (var j in hero.crafting[i].filters['All']) {
            // get what's created:
            itemIdsToGet.push(hero.crafting[i].recipes[(hero.crafting[i].filters['All'][j])].creates);
            // get components:
            theseRecipeComponents = hero.crafting[i].recipes[(hero.crafting[i].filters['All'][j])].components.split(",");
            for (k = 0; k < theseRecipeComponents.length; k++) {
                if (!(isNaN(theseRecipeComponents[k]))) {
                    itemIdsToGet.push(theseRecipeComponents[k]);
                }
            }
        }
    }


    // add item available in any shops:
    if(thisMapShopItemIds != '') {
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





function prepareGame() {
    // get map image references:
    tileImages = [];
    for (var i = 0; i < tileGraphicsToLoad.length; i++) {
        tileImages[i] = Loader.getImage("tile" + i);
    }
    npcImages = [];
    for (var i = 0; i < npcGraphicsToLoad.length; i++) {
        npcImages[npcGraphicsToLoad[i].name] = Loader.getImage("npc" + npcGraphicsToLoad[i].name);
    }
    itemImages = [];
    for (var i = 0; i < itemGraphicsToLoad.length; i++) {
        console.log(itemGraphicsToLoad[i]);
        itemImages[itemGraphicsToLoad[i]] = Loader.getImage(itemGraphicsToLoad[i]);
    }
    backgroundImg = Loader.getImage("backgroundImg");
    // initialise and position NPCs:
    for (var i = 0; i < thisMapData.npcs.length; i++) {
        thisMapData.npcs[i].x = getTileCentreCoordX(thisMapData.npcs[i].tileX);
        thisMapData.npcs[i].y = getTileCentreCoordY(thisMapData.npcs[i].tileY);



        thisMapData.npcs[i].z = getElevation(thisMapData.npcs[i].tileX,thisMapData.npcs[i].tileY);
        
thisMapData.npcs[i].drawnFacing = thisMapData.npcs[i].facing;
        thisMapData.npcs[i].dx = 0;
        thisMapData.npcs[i].dy = 0;
        // set index to -1 so when it increases, it'll pick up the first (0) element:
        thisMapData.npcs[i].movementIndex = -1;
    }
    // initialise items:
    for (var i = 0; i < thisMapData.items.length; i++) {
        thisMapData.items[i].x = getTileCentreCoordX(thisMapData.items[i].tileX);
        thisMapData.items[i].y = getTileCentreCoordY(thisMapData.items[i].tileY);


thisMapData.items[i].z = getElevation(thisMapData.items[i].tileX,thisMapData.items[i].tileY);
        thisMapData.items[i].width = currentActiveInventoryItems[thisMapData.items[i].type].width;
        thisMapData.items[i].height = currentActiveInventoryItems[thisMapData.items[i].type].height;

        thisMapData.items[i].centreX = currentActiveInventoryItems[thisMapData.items[i].type].centreX;
        thisMapData.items[i].centreY = currentActiveInventoryItems[thisMapData.items[i].type].centreY;

        // check for node resources:
        if(currentActiveInventoryItems[thisMapData.items[i].type].action == "node") {
            // use the saved value if it has one:
            if(!thisMapData.items[i].timeLastHarvested) {
            // otherwise, set it so it can be instantly harvested:
            thisMapData.items[i].timeLastHarvested = hero.totalGameTimePlayed-currentActiveInventoryItems[thisMapData.items[i].type].respawnRate;
            }
        }
    }
activeNPCForDialogue = '';
    // determine tile offset to centre the hero in the centre
    hero.x = getTileCentreCoordX(hero.tileX);
    hero.y = getTileCentreCoordY(hero.tileY);
hero.z = getElevation(hero.tileX,hero.tileY);

    // initialise fae:
    fae.x = hero.x + tileW * 2;
    fae.y = hero.y + tileH * 2;
    fae.z = hero.z;

    fae.dz = 1;
   // fae.pulse = 0;
    

    timeSinceLastFrameSwap = 0;
    currentAnimationFrame = 0;
    mapTransition = "in";
    mapTransitionCurrentFrames = 1;

    gameMode = "play";
}



function removeMapAssets() {
    for (var i = 0; i < tileGraphicsToLoad.length; i++) {
        tileImages[i].src = '';
        tileImages[i] = null;
    }
    for (var i = 0; i < npcGraphicsToLoad.length; i++) {
        npcImages[thisMapData.npcs[i].name].src = '';
        npcImages[thisMapData.npcs[i].name] = null;
    }
    
    for (var i in itemGraphicsToLoad) {
    
        
        itemImages[itemGraphicsToLoad[i]].src = '';
        itemImages[itemGraphicsToLoad[i]] = null;
    
    }
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
    var doorData = thisMapData.doors;
    var whichDoor = getTileX(doorX) + "," + getTileX(doorY);
    hero.tileX = doorData[whichDoor].startX;
    hero.tileY = doorData[whichDoor].startY;
    newMap = doorData[whichDoor].map;
    loadMap();
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

                activeDoorX = x;
                activeDoorY = y;
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
        if (activeNPCForDialogue != '') {

            //  dialogue.classList.add("slowerFade");
            dialogue.classList.remove("active");
            UI.removeActiveDialogue();
        }
    }
    if (currentMap < 0) {
        saveCartographyMask();
    }
}


function getHeroAsCloseAsPossibleToObject(objx, objy, objw, objh) {
    switch (hero.facing) {
        case "n":
            hero.y = objy + objh / 2 + hero.height / 2 + 1;
            break;
        case "s":
            hero.y = objy - objh / 2 - hero.height / 2 - 1;
            break;
        case "w":
            hero.x = objx + objw / 2 + hero.width / 2 + 1;
            break;
        case "e":
            hero.x = objx - objw / 2 - hero.width / 2 - 1;
            break;
    }
}

function checkHeroCollisions() {
    activeDoorX = -1;
    activeDoorY = -1;

    // tile collisions:
    if (key[2]) {
        // up
        if ((isATerrainCollision(hero.x - hero.width / 2, hero.y - hero.height / 2)) || (isATerrainCollision(hero.x + hero.width / 2, hero.y - hero.height / 2))) {
            // find the tile's bottom edge
            var tileCollidedWith = getTileY(hero.y - hero.height / 2);
            var tileBottomEdge = (tileCollidedWith + 1) * tileW;
            // use the +1 to make sure it's just clear of the collision tile
            hero.y = tileBottomEdge + hero.height / 2 + 1;
        } else if (activeDoorX != -1) {
            startDoorTransition();
        }
    }
    if (key[3]) {
        // down
        if ((isATerrainCollision(hero.x - hero.width / 2, hero.y + hero.height / 2)) || (isATerrainCollision(hero.x + hero.width / 2, hero.y + hero.height / 2))) {
            var tileCollidedWith = getTileY(hero.y + hero.height / 2);
            var tileTopEdge = (tileCollidedWith) * tileW;
            hero.y = tileTopEdge - hero.height / 2 - 1;
        } else if (activeDoorX != -1) {
            startDoorTransition();
        }
    }
    if (key[0]) {
        // left/west
        if ((isATerrainCollision(hero.x - hero.width / 2, hero.y + hero.height / 2)) || (isATerrainCollision(hero.x - hero.width / 2, hero.y - hero.height / 2))) {
            var tileCollidedWith = getTileX(hero.x - hero.width / 2);
            var tileRightEdge = (tileCollidedWith + 1) * tileW;
            hero.x = tileRightEdge + hero.width / 2 + 1;
        } else if (activeDoorX != -1) {
            startDoorTransition();
        }
    }
    if (key[1]) {
        //right/east
        if ((isATerrainCollision(hero.x + hero.width / 2, hero.y + hero.height / 2)) || (isATerrainCollision(hero.x + hero.width / 2, hero.y - hero.height / 2))) {
            var tileCollidedWith = getTileX(hero.x + hero.width / 2);
            var tileLeftEdge = (tileCollidedWith) * tileW;
            hero.x = tileLeftEdge - hero.width / 2 - 1;
        } else if (activeDoorX != -1) {
            startDoorTransition();
        }
    }


    // check for collisions against NPCs:
    for (var i = 0; i < thisMapData.npcs.length; i++) {
        thisNPC = thisMapData.npcs[i];
        if (thisNPC.isCollidable) {
            if (isAnObjectCollision(thisNPC.x, thisNPC.y, thisNPC.width, thisNPC.height, hero.x, hero.y, hero.width, hero.height)) {
                getHeroAsCloseAsPossibleToObject(thisNPC.x, thisNPC.y, thisNPC.width, thisNPC.height);
            }
        }
    }
    // check for collisions against items:
    for (var i = 0; i < thisMapData.items.length; i++) {
        thisItem = thisMapData.items[i];
        if (isAnObjectCollision(thisItem.x, thisItem.y, thisItem.width, thisItem.height, hero.x, hero.y, hero.width, hero.height)) {
            getHeroAsCloseAsPossibleToObject(thisItem.x, thisItem.y, thisItem.width, thisItem.height);
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
            break;
        case "play":
            update();
            draw();
            break;
    }
    window.requestAnimationFrame(gameLoop);
}


function update() {
    var now = window.performance.now();
    hero.totalGameTimePlayed ++;
    var elapsed = (now - lastTime);
    lastTime = now;
    hero.isMoving = false;
    oldHeroX = hero.x;
    oldHeroY = hero.y;
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
        checkHeroCollisions();
        var heroOldX = hero.tileX;
        var heroOldY = hero.tileY;
        hero.tileX = getTileX(hero.x);
        hero.tileY = getTileY(hero.y);
        if ((hero.tileX != heroOldX) || (hero.tileY != heroOldY)) {
            heroIsInNewTile();
        }
        // check to see if a dialogue balloon is open, and if the hero has moved far from the NPC:
        if (activeNPCForDialogue != '') {
            if (!(isInRange(hero.x, hero.y, activeNPCForDialogue.x, activeNPCForDialogue.y, closeDialogueDistance))) {
                dialogue.classList.add("slowerFade");
                dialogue.classList.remove("active");
               
                // close the shop
                

if(shopCurrentlyOpen != -1) {

            activeNPCForDialogue.speechIndex = 0;
            UI.closeShop();
        }
         // only remove this after dialogue has faded out completely:
                dialogue.addEventListener(whichTransitionEvent, UI.removeActiveDialogue, false);

            }
        }
    } else {
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
}

function heroIsInNewTile() {




hero.z = getElevation(getCurrentTileX(hero.x),getCurrentTileY(hero.y));

    if (currentMap < 0) {
        updateCartographicMiniMap();
    }
    var thisHotspot, thisTileCentreX, thisTileCentreY;
    // check for hotspots:
    for (var i = 0; i < thisMapData.hotspots.length; i++) {
        thisHotspot = thisMapData.hotspots[i];
        thisTileCentreX = getTileCentreCoordX(thisHotspot.centreX);
        thisTileCentreY = getTileCentreCoordY(thisHotspot.centreY);
        if (isInRange(hero.x, hero.y, thisTileCentreX, thisTileCentreY, thisHotspot.radius * tileW)) {
            if (questData[thisHotspot.quest].hasBeenActivated < 1) {
                UI.showNotification("<p>" + thisHotspot.message + "</p>");
            }
            questData[thisHotspot.quest].hasBeenActivated = 1;
        }
        if (fae.currentState == "hero") {
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
    if (fae.currentState == "wait") {
        // check if hero has moved far away, and return if so:
        if (!(isInRange(fae.x, fae.y, hero.x, hero.y, fae.abandonRadius))) {
            if (hasLineOfSight(getTileX(fae.x), getTileX(fae.y), hero.tileX, hero.tileY)) {
                fae.currentState = "hero";
            }
        }
    }

}





function checkForActions() {
    var inventoryCheck = [];

    var slotMarkup, thisSlotsId, thisSlotElem, thisNPC;
    // loop through items:
    for (var i = 0; i < thisMapData.items.length; i++) {
        if (isInRange(hero.x, hero.y, thisMapData.items[i].x, thisMapData.items[i].y, (thisMapData.items[i].width / 2 + hero.width / 2 + 6))) {
            if (isFacing(hero, thisMapData.items[i])) {
                var actionValue = currentActiveInventoryItems[thisMapData.items[i].type].actionValue;

                switch (currentActiveInventoryItems[thisMapData.items[i].type].action) {
                    case "static":
                        // can't interact with it - do nothing
                        break;
                        case "sound":
                        audio.playSound(soundEffects[actionValue],0);
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
                        // check it's not still re-spawning:
                        console.log(hero.totalGameTimePlayed+" "+thisMapData.items[i].timeLastHarvested+" > "+currentActiveInventoryItems[thisMapData.items[i].type].respawnRate);
                        if (hero.totalGameTimePlayed - thisMapData.items[i].timeLastHarvested >= currentActiveInventoryItems[thisMapData.items[i].type].respawnRate) {
                            // pick a random item from the possible items:
                            var whichItem = getRandomIntegerInclusive(1, thisMapData.items[i].contains.length);

                            // try and add it:
                            inventoryCheck = canAddItemToInventory([thisMapData.items[i].contains[whichItem - 1]]);
                            if (inventoryCheck[0]) {
                                // reset timer:
                                thisMapData.items[i].timeLastHarvested = hero.totalGameTimePlayed;
                                UI.showChangeInInventory(inventoryCheck[1]);
                            } else {
                                UI.showNotification("<p>Oops - sorry, no room in your bags</p>");
                            }
                        }
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
                    if ((thisNPC.speechIndex >= thisNPC.speech.length) || (canCloseDialogueBalloonNextClick && activeNPCForDialogue == thisNPC)) {
                        thisNPC.speechIndex = 0;
                        dialogue.classList.remove("active");
                        activeNPCForDialogue = '';
                        canCloseDialogueBalloonNextClick = false;

 if(shopCurrentlyOpen != -1) {
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


function processSpeech(thisNPC, thisSpeechPassedIn, thisSpeechCode, isPartOfNPCsNormalSpeech) {
    // thisSpeech is global so it can be edited in the close quest functions:
    thisSpeech = thisSpeechPassedIn;
    // isPartOfNPCsNormalSpeech is false if not set:
    isPartOfNPCsNormalSpeech = typeof isPartOfNPCsNormalSpeech !== 'undefined' ? isPartOfNPCsNormalSpeech : false;
    individualSpeechCodes = thisSpeechCode.split(",");
    for (var i = 0; i < individualSpeechCodes.length; i++) {
        switch (individualSpeechCodes[i]) {
            case "once":
                thisNPC.speech.splice(thisNPC.speechIndex, 1);
                // knock this back one so to keep it in step with the removed item:
                thisNPC.speechIndex--;
                break;
                case "shop":
UI.openShop(generateHash(thisNPC.speech[thisNPC.speechIndex][2]));
//thisNPC.speechIndex--;

                break;
                case "sound":
audio.playSound(soundEffects[thisNPC.speech[thisNPC.speechIndex][2]],0);
break;
            case "profession":
                var professionId = thisNPC.speech[thisNPC.speechIndex][2];
                if (hero.professionsKnown.indexOf(professionId) == -1) {
                    hero.professionsKnown.push(professionId);
                    showNotification('<p>You learned a new profession</p>');
                }
                break;
                case "follower":
                 var followerId = thisNPC.speech[thisNPC.speechIndex][2];

  if (hero.professionsKnown.indexOf(followerId) == -1) {
                    hero.professionsKnown.push(followerId);
                    showNotification('<p>You gained a new follower</p>');
                }

                break;
            case "quest":
            case "quest-no-open":
            case "quest-no-close":
            case "quest-no-open-no-close":
                var questSpeech = thisSpeech.split("|");
                var questId = thisNPC.speech[thisNPC.speechIndex][2];
                if (questData[questId].isUnderway) {
                    // quest has been opened - check if it's complete:
                    switch (questData[questId].whatIsRequiredForCompletion) {
                        case "possess":
                        case "give":
                        case "":
                            if ((individualSpeechCodes[i] == "quest") || (individualSpeechCodes[i] == "quest-no-open")) {
                                // ie. it's not a '-no-close' speech
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
                                    closeQuest(thisNPC, questId);
                                } else {
                                    // show 'underway' text:
                                    thisSpeech = questSpeech[1];
                                    // keep the NPC on this quest speech:
                                    thisNPC.speechIndex--;
                                }
                            } else {
                                // check if it's been closed elsewhere:
                                if (questData[questId].hasBeenCompleted > 0) {
                                    thisSpeech = questSpeech[2];
                                    closeQuest(thisNPC, questId);
                                } else {
                                    // show 'underway' text:
                                    thisSpeech = questSpeech[1];
                                    // keep the NPC on this quest speech:
                                    thisNPC.speechIndex--;
                                }
                            }
                            break;
                        case "multi":
                            var allSubQuestsRequired = questData[questId].subQuestsRequiredForCompletion.split(",");
                            var allSubQuestsComplete = true;
                            for (var k = 0; k < allSubQuestsRequired.length; k++) {
                                // check conditions for this sub-quest and set if it's complete ###############
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
                                            console.log(currentThresholdValue + " < " + questData[allSubQuestsRequired[k]].thresholdNeededForCompletion.substring(1));
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
                                closeQuest(thisNPC, questId);
                            } else {
                                // show 'underway' text:
                                thisSpeech = questSpeech[1];
                                // keep the NPC on this quest speech:
                                thisNPC.speechIndex--;
                            }
                            break;
                        case "world":
                            if (questData[questId].hasBeenActivated > 0) {
                                thisSpeech = questSpeech[2];
                                closeQuest(thisNPC, questId);
                            } else {
                                // show 'underway' text:
                                thisSpeech = questSpeech[1];
                                // keep the NPC on this quest speech:
                                thisNPC.speechIndex--;
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
                                closeQuest(thisNPC, questId);
                            } else {
                                // show 'underway' text:
                                thisSpeech = questSpeech[1];
                                // keep the NPC on this quest speech:
                                thisNPC.speechIndex--;
                            }
                            break;
                    }
                } else {
                    if ((individualSpeechCodes[i] == "quest") || (individualSpeechCodes[i] == "quest-no-close")) {
                        // ie. don't open the quest if it's "-no-open":
                        var okToStartQuest = true;
                        // see if any items need to be given to start the quest:
                        if (questData[questId].startItemsReceived) {
                            var itemsToAdd = questData[questId].startItemsReceived.split(",");
                            var allItemsToGive = [];
                            for (var l = 0; l < itemsToAdd.length; l++) {
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
                                        questData[allSubQuestsRequired[k]].isUnderway = 1;
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
                        }
                    }
                    thisSpeech = questSpeech[0];
                    // keep the NPC on this quest speech:
                    thisNPC.speechIndex--;
                }
                break;
            case "play":
                startCardGame(thisNPC);
                break;
            default:
                // nothing
        }
    }
if(thisSpeech!= "") {
    // don't show the balloon if there's no speech (which might happen if the NPC is just plays a sound instead)
    UI.showDialogue(thisNPC, thisSpeech);
} else {
    thisNPC.speechIndex--;
}
    canCloseDialogueBalloonNextClick = false;
    if (!isPartOfNPCsNormalSpeech) {
        // set a flag so that pressing action near the NPC will close the balloon:
        canCloseDialogueBalloonNextClick = true;
    }
}




function closeQuest(whichNPC, whichQuestId) {
    if (giveQuestRewards(whichQuestId)) {
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
    } else {
        // keep the NPC on the quest dialogue:
        whichNPC.speechIndex--;
    }
}





function giveQuestRewards(whichQuestId) {
    // give any reward to the player:
    if (questData[whichQuestId].itemsReceivedOnCompletion) {
        var allRewardItems = [];
        var questRewards = questData[whichQuestId].itemsReceivedOnCompletion.split(",");
        for (var i = 0; i < questRewards.length; i++) {
            // check for variation:
            var questPossibilities = questRewards[i].split("/");
            var questRewardToUse = getRandomElementFromArray(questPossibilities);
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
            allRewardItems.push(thisRewardObject);
        }
        inventoryCheck = canAddItemToInventory(allRewardItems);
        if (inventoryCheck[0]) {
            UI.showChangeInInventory(inventoryCheck[1]);

            return true;
        } else {
            UI.showNotification("<p>Oops - sorry, no room in your bags</p>");
            // don't close quest
            return false;
        }
    } else {
        return true;
    }
}


function checkForTitlesAwarded(whichQuestId) {
    // check for any titles:
    if (questData[whichQuestId].titleGainedAfterCompletion) {
        var thisTitle = questData[whichQuestId].titleGainedAfterCompletion;
        if (hero.titlesEarned.indexOf(thisTitle) == -1) {
            hero.titlesEarned.push(thisTitle);
            UI.showNotification('<p>You earned the &quot;' + activeTitles[thisTitle] + '&quot; title</p>');
        }
    }
}


function checkForChallenges() {
    for (var i = 0; i < thisMapData.npcs.length; i++) {
        thisNPC = thisMapData.npcs[i];
        if (isInRange(hero.x, hero.y, thisNPC.x, thisNPC.y, (thisNPC.width + hero.width))) {
            if (isFacing(hero, thisNPC)) {
                if(thisNPC.cardGameSpeech) {
                thisNPC.drawnFacing = turntoFace(thisNPC, hero);
                processSpeech(thisNPC, thisNPC.cardGameSpeech.challenge[0], thisNPC.cardGameSpeech.challenge[1]);
            }
            }
        }
    }
    // challenge processed, so cancel the key event:
    key[6] = 0;
}

function moveNPCs() {
    var thisNPC, newTile, thisNextMovement, oldNPCx, oldNPCy;
    for (var i = 0; i < thisMapData.npcs.length; i++) {
        thisNPC = thisMapData.npcs[i];
        if (thisNPC.isMoving) {
            oldNPCx = thisNPC.x;
            oldNPCy = thisNPC.y;

thisNPC.drawnFacing = thisNPC.facing;
            
            switch (thisNPC.facing) {
                case 'n':
                    thisNPC.y -= thisNPC.speed;
                    // check for collisions:
                    if ((isATerrainCollision(thisNPC.x - thisNPC.width / 2, thisNPC.y - thisNPC.height / 2)) || (isATerrainCollision(thisNPC.x + thisNPC.width / 2, thisNPC.y - thisNPC.height / 2))) {
                        // find the tile's bottom edge
                        var tileCollidedWith = getTileY(thisNPC.y - thisNPC.height / 2);
                        var tileBottomEdge = (tileCollidedWith + 1) * tileW;
                        // use the +1 to make sure it's just clear of the collision tile
                        thisNPC.y = tileBottomEdge + thisNPC.height / 2 + 1;
                    }

                    break;
                case 's':
                    thisNPC.y += thisNPC.speed;
                    // check for collisions:
                    if ((isATerrainCollision(thisNPC.x - thisNPC.width / 2, thisNPC.y + thisNPC.height / 2)) || (isATerrainCollision(thisNPC.x + thisNPC.width / 2, thisNPC.y + thisNPC.height / 2))) {
                        var tileCollidedWith = getTileY(thisNPC.y + thisNPC.height / 2);
                        var tileTopEdge = (tileCollidedWith) * tileW;
                        thisNPC.y = tileTopEdge - thisNPC.height / 2 - 1;
                    }
                    break;
                case 'w':
                    thisNPC.x -= thisNPC.speed;
                    // check for collisions:
                    if ((isATerrainCollision(thisNPC.x - thisNPC.width / 2, thisNPC.y + thisNPC.height / 2)) || (isATerrainCollision(thisNPC.x - thisNPC.width / 2, thisNPC.y - thisNPC.height / 2))) {
                        var tileCollidedWith = getTileX(thisNPC.x - thisNPC.width / 2);
                        var tileRightEdge = (tileCollidedWith + 1) * tileW;
                        thisNPC.x = tileRightEdge + thisNPC.width / 2 + 1;
                    }
                    break;
                case 'e':
                    thisNPC.x += thisNPC.speed;
                    // check for collisions:
                    if ((isATerrainCollision(thisNPC.x + thisNPC.width / 2, thisNPC.y + thisNPC.height / 2)) || (isATerrainCollision(thisNPC.x + thisNPC.width / 2, thisNPC.y - thisNPC.height / 2))) {
                        var tileCollidedWith = getTileX(thisNPC.x + thisNPC.width / 2);
                        var tileLeftEdge = (tileCollidedWith) * tileW;
                        thisNPC.x = tileLeftEdge - thisNPC.width / 2 - 1;
                    }
                    break;
            }


            // check for collision against hero:

            if (isAnObjectCollision(thisNPC.x, thisNPC.y, thisNPC.width, thisNPC.height, hero.x, hero.y, hero.width, hero.height)) {
                thisNPC.x = oldNPCx;
                thisNPC.y = oldNPCy;
            }

            // check for collisions against other NPCs:
            for (var j = 0; j < thisMapData.npcs.length; j++) {

                if (i != j) {
                    thisOtherNPC = thisMapData.npcs[j];
                    if (thisOtherNPC.isCollidable) {
                        if (isAnObjectCollision(thisNPC.x, thisNPC.y, thisNPC.width, thisNPC.height, thisOtherNPC.x, thisOtherNPC.y, thisOtherNPC.width, thisOtherNPC.height)) {
                            thisNPC.x = oldNPCx;
                            thisNPC.y = oldNPCy;
                        }
                    }
                }
            }
            // check for collisions against items:
            for (var i = 0; i < thisMapData.items.length; i++) {
                thisItem = thisMapData.items[i];

                if (isAnObjectCollision(thisNPC.x, thisNPC.y, thisNPC.width, thisNPC.height, thisItem.x, thisItem.y, thisItem.width, thisItem.height)) {
                    thisNPC.x = oldNPCx;
                    thisNPC.y = oldNPCy;

                }

            }



            // find the difference for this movement:
            thisNPC.dx += (thisNPC.x - oldNPCx);
            thisNPC.dy += (thisNPC.y - oldNPCy);
            // see if it's at a new tile centre:
            newTile = false;
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
            if (newTile) {
                thisNPC.movementIndex++;
                if (thisNPC.movementIndex >= thisNPC.movement.length) {
                    thisNPC.movementIndex = 0;
                }
                thisNextMovement = thisNPC.movement[thisNPC.movementIndex];

                switch (thisNextMovement) {
                    case '-':
                        // stand still:
                        thisNPC.isMoving = false;
                    case '?':
                        do {
                            // pick a random facing:
                            thisNPC.facing = facingsPossible[Math.floor(Math.random() * facingsPossible.length)];
                            // check that the target tile is walkable:
                        } while (isATerrainCollision(thisNPC.x + (relativeFacing[thisNPC.facing]["x"] * tileW), thisNPC.y + (relativeFacing[thisNPC.facing]["y"] * tileW)));


                        break;
                    default:
                        thisNPC.facing = thisNextMovement;
                        break;
                }
            }
        }
    }
}





function canLearnRecipe(recipeIndex) {
    var wasSuccessful = false;
    if (hero.recipesKnown.indexOf(recipeIndex) === -1) {
        // check for pre-requisites
        // #####
        hero.recipesKnown.push([parseInt(recipeIndex),0]);
        // need to show a notification
        // reload the recipe data
        // ###
    }
    return wasSuccessful;
}






function draw() {
    if (gameMode == "mapLoading") {
        gameContext.fillRect(0, 0, canvasWidth, canvasHeight);
        gameContext.fillStyle = "#000000";
        gameContext.fill();
    } else {
        // get all assets to be drawn in a list - start with the hero:

        var thisGraphicCentreX, thisGraphicCentreY, thisX, thisY, thisNPC, thisItem;

        hero.isox = findIsoCoordsX(hero.x, hero.y);
        hero.isoy = findIsoCoordsY(hero.x, hero.y);
        /*
          var assetsToDraw = [
              [hero.y, heroImg, hero.offsetX, hero.offsetY, hero.width, hero.height, Math.floor(canvasWidth / 2 - hero.feetOffsetX), Math.floor(canvasHeight / 2 - hero.feetOffsetY), hero.width, hero.height]
          ];
          */
        var assetsToDraw = [
            [findIsoDepth(hero.x, hero.y, hero.z), "img", heroImg, Math.floor(canvasWidth / 2 - hero.feetOffsetX), Math.floor(canvasHeight / 2 - hero.feetOffsetY - hero.z)]
        ];


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
        var thisColourName;
        var thisItemIdentifier;

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



        for (var i = 0; i < thisMapData.npcs.length; i++) {
            thisNPC = thisMapData.npcs[i];
            thisNPCOffsetCol = currentAnimationFrame % thisNPC["animation"]["walk"]["length"];
            thisNPCOffsetRow = thisNPC["animation"]["walk"][thisNPC.drawnFacing];
            thisX = findIsoCoordsX(thisNPC.x, thisNPC.y);
            thisY = findIsoCoordsY(thisNPC.x, thisNPC.y);

            //assetsToDraw.push([findIsoDepth(thisX, thisY), npcImages[i], Math.floor(thisX - hero.isox - thisNPC.centreX + (canvasWidth / 2)), Math.floor(thisY - hero.isoy - thisNPC.centreY + (canvasHeight / 2))]);


            assetsToDraw.push([findIsoDepth(thisNPC.x, thisNPC.y, thisNPC.z), "sprite", npcImages[thisMapData.npcs[i].name], thisNPCOffsetCol * thisNPC.spriteWidth, thisNPCOffsetRow * thisNPC.spriteHeight, thisNPC.spriteWidth, thisNPC.spriteHeight, Math.floor(thisX - hero.isox - thisNPC.centreX + (canvasWidth / 2)), Math.floor(thisY - hero.isoy - thisNPC.centreY + (canvasHeight / 2) - thisNPC.z), thisNPC.spriteWidth, thisNPC.spriteHeight]);
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

            assetsToDraw.push([findIsoDepth(thisItem.x, thisItem.y, thisItem.z), "img", itemImages[thisItemIdentifier], Math.floor(thisX - hero.isox - thisItem.centreX + (canvasWidth / 2)), Math.floor(thisY - hero.isoy - thisItem.centreY + (canvasHeight / 2) - thisItem.z)]);
        }

        assetsToDraw.sort(sortByLowestValue);
        // don't need to clear, as the background will overwrite anyway - this means there's less to process.
        // scroll background to match the top tip and left tip of the tile grid:
        // the 400px and 300px are "padding" the edges of the background graphics:
        gameContext.drawImage(backgroundImg, Math.floor(getTileIsoCentreCoordX(0, mapTilesX - 1) - hero.isox - tileW / 2 - 400 + canvasWidth/2), Math.floor(getTileIsoCentreCoordY(0, 0) - hero.isoy - tileH / 2 -300 + canvasHeight/2));
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
                case "img":
                    // standard image:
                    gameContext.drawImage(assetsToDraw[i][2], assetsToDraw[i][3], assetsToDraw[i][4]);
            }
        }

        if (activeNPCForDialogue != '') {
            UI.updateDialogue(activeNPCForDialogue);
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

