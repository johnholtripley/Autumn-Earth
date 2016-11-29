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
        console.log('getting mask - /game-world/getCartographicMapMask.php?chr=' + characterId + '&dungeonName=' + randomDungeonName + '&currentMap=' + newMap);
        canvasMapMaskImage.src = '/game-world/getCartographicMapMask.php?chr=' + characterId + '&dungeonName=' + randomDungeonName + '&currentMap=' + newMap + '&cache=' + Date.now();
        canvasMapMaskImage.onload = function() {
            console.log('canvasMapMaskImage onload');
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

var activeTitles = [];

var inventoryInterfaceIsBuilt = false;

var whichTransitionEvent = '';

var activeNPCForDialogue = '';
var closeDialogueDistance = 200;
var canCloseDialogueBalloonNextClick = false;

var boosterCardsRevealed = 0;
var boosterCardsToAdd = [];

var questData = [];

var colourNames = [];

var currentRecipePanelProfession = -1;

// key bindings
var key = [0, 0, 0, 0, 0, 0, 0];

var hero = {
    x: 0,
    y: 0,
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
maxParticles: 10
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
    if(numberBeingShown == 0) {
document.getElementById("noRecipesFound").classList.add('active');
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



/*
function findIsoDepth(x, y) {
 return y;
 //   return x*tileW + y*(mapTilesX+1)*tileW;
}
*/

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
    var range = Math.sqrt(((ax - bx) * (ax - bx)) + ((ay - by) * (ay - by)));
    if (range <= ra) {
        return true;
    } else {
        return false;
    }
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


function parseMoney(amount,whichCurrency) {
    // whichCurrency passed in case alternative currencies are added
var moneyOutput = "";
    var silver = amount % 100;
    var gold = (amount - silver) / 100;
    if (gold > 0) {
        moneyOutput = gold + "G ";
    }
    if (silver != 0) {
        moneyOutput += silver + "S";
    }
    return moneyOutput;
}




// ---------------------
// http://youmightnotneedjquery.com/ - IE8+
function addClass(whichElement, className) {
  if (whichElement.classList) {
    whichElement.classList.add(className);
  } else {
    whichElement.className += ' ' + className;
  }
}

function removeClass(el, className) {
  if (el.classList) {
    el.classList.remove(className);
  } else {
    el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
  }
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
    
    processSpeech(thisNPC, thisNPC.cardGameSpeech.lose[0], thisNPC.cardGameSpeech.lose[1]);
    whichCardWon = pickBestCardToTake(cardGameNameSpace.player1Cards);
    hero.cards.unshift((cardGameNameSpace.player1Cards[whichCardWon]));
    // need to find this card type in the NPC's unique card array (if it's from the basic deck then don't need to try and remove it):
    var foundIndexInUniqueCards = thisNPC.uniqueCards.indexOf(cardGameNameSpace.player1Cards[whichCardWon]);
    if (foundIndexInUniqueCards != -1) {
        thisNPC.uniqueCards.splice(foundIndexInUniqueCards, 1);
    }
    UI.showNotification('<p>You won a ' + cardGameNameSpace.allCardData[(cardGameNameSpace.player1Cards[whichCardWon])][2] + '</p><img class="card players" src="/images/card-game/cards/' + (cardGameNameSpace.player1Cards[whichCardWon]) + '.png">');
    UI.updateCardAlbum();
    closeCardGame();
}

function cardGamePlayer1Wins() {
    // player lost
    
    hero.stats.cardGamesLost++;
    
    processSpeech(thisNPC, thisNPC.cardGameSpeech.win[0], thisNPC.cardGameSpeech.win[1]);
    whichCardWon = pickBestCardToTake(cardGameNameSpace.player2Cards);
    // add it to NPC's unique cards so the player can win it back:
    thisNPC.uniqueCards.unshift((cardGameNameSpace.player2Cards[whichCardWon]));
    var foundIndexInUniqueCards = hero.cards.indexOf(cardGameNameSpace.player2Cards[whichCardWon]);
    if (foundIndexInUniqueCards != -1) {
        hero.cards.splice(foundIndexInUniqueCards, 1);
    }
    UI.showNotification('<p>You lost a ' + cardGameNameSpace.allCardData[(cardGameNameSpace.player2Cards[whichCardWon])][2] + '</p><img class="card npcs" src="/images/card-game/cards/' + (cardGameNameSpace.player2Cards[whichCardWon]) + '.png">');
    UI.updateCardAlbum();
    closeCardGame();
}

function cardGameIsDrawn() {
    processSpeech(thisNPC, thisNPC.cardGameSpeech.draw[0], thisNPC.cardGameSpeech.draw[1]);
    closeCardGame();
}

function startCardGame(opponentNPC) {
    if (hero.cards.length >= 12) {



        cardGameNameSpace.player2Cards = hero.cards.slice(0, 12);
        // combine the NPC's unique cards with their base pack and pick the first 12:
        cardGameNameSpace.player1Cards = opponentNPC.uniqueCards.concat(allCardPacks[opponentNPC.baseCardPack]).slice(0, 12);
        cardGameNameSpace.player1Skill = opponentNPC.cardSkill;




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
    boosterCardsToAdd = [];
    var thisCardToAdd;
    do {
        thisCardToAdd = getRandomInteger(1, cardGameNameSpace.allCardData.length);
        if (boosterCardsToAdd.indexOf(thisCardToAdd) == -1) {
            boosterCardsToAdd.push(thisCardToAdd);

        }

    } while (boosterCardsToAdd.length < 5);


 var boosterPackCards = document.getElementsByClassName('cardFlip');
    for (var i = 0; i < boosterPackCards.length; i++) {
        boosterPackCards[i].classList.remove('active');
    }

    
    // wait for these to load? #######





    for (var i = 0; i < 5; i++) {
        document.getElementById("boosterCard" + i).innerHTML = '<img src="/images/card-game/cards/' + boosterCardsToAdd[i] + '.png" alt="' + cardGameNameSpace.allCardData[(boosterCardsToAdd[i][3])] + '">';
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
        document.addEventListener('keydown', function(e) { Input.changeKey(e.keyCode, 1, "down") });
        document.addEventListener('keyup', function(e) { Input.changeKey(e.keyCode, 0, "up") });
    },

    // called on key up and key down events
    changeKey: function(which, to, type) {
        switch (which) {
            case KeyBindings.left:
                key[0] = to;
                break;
            case KeyBindings.up:
                key[2] = to;
                break;
            case KeyBindings.right:
                key[1] = to;
                break;
            case KeyBindings.down:
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

                    slotsUpdated.push((inventoryKeysFound[i]));
                    inventoryClone[inventoryKeysFound[i]].quantity += amountAddedToThisSlot;
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
                        inventoryClone[thisSlotsID].inscription = itemObj[k].inscription;
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
        // update visually:
        for (var i = 0; i < thisSlotElem.childNodes.length; i++) {
            if (thisSlotElem.childNodes[i].className == "qty") {
                thisSlotElem.childNodes[i].innerHTML = hero.inventory[whichSlot].quantity;
                break;
            }
        }
    } else {
        // remove the item:
        delete hero.inventory[whichSlot];
        // update visually:
        thisSlotElem.innerHTML = '';
    }
}

function itemAttributesMatch(item1, item2) {
    // 'type' has already been checked
    if (item1.quality == item2.quality) {
        if (item1.durability == item2.durability) {
            if (item1.currentWear == item2.currentWear) {
                if (item1.effectiveness == item2.effectiveness) {
                    if (item1.wrapped == item2.wrapped) {
                        if (item1.colour == item2.colour) {
                            if (item1.enchanted == item2.enchanted) {
                                if (item1.hallmark == item2.hallmark) {
                                    if (item1.inscription == item2.inscription) {
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
    return false;
}



function inventoryItemAction(whichSlot, whichAction, whichActionValue) {
    switch (whichAction) {
        case "booster":
            openBoosterPack();
            // remove the 'slot' prefix with the substring(4):
            removeFromInventory(whichSlot.parentElement.id.substring(4), 1);
            break;
        case "recipe":
            learnRecipe(whichActionValue);
            // remove the 'slot' prefix with the substring(4):
            removeFromInventory(whichSlot.parentElement.id.substring(4), 1);
    }
}


function additionalTooltipDetail(whichSlotID) {
    // get any information that needs displaying in the tooltip:
    var tooltipInformationToAdd = "";
    if (currentActiveInventoryItems[hero.inventory[whichSlotID].type].action == "recipe") {
        // check if it's known already:
        if (hero.recipesKnown.indexOf(parseInt(currentActiveInventoryItems[hero.inventory[whichSlotID].type].actionValue)) != -1) {
            tooltipInformationToAdd += " (already known)";
        }
    }
    return tooltipInformationToAdd;
}

function generateSlotMarkup(thisSlotsId) {
    var slotMarkup = '<img src="/images/game-world/inventory-items/' + hero.inventory[thisSlotsId].type + '.png" alt="">';
    slotMarkup += '<span class="qty">' + hero.inventory[thisSlotsId].quantity + '</span>';
    slotMarkup += '<p><em>' + currentActiveInventoryItems[hero.inventory[thisSlotsId].type].shortname + ' </em>' + currentActiveInventoryItems[hero.inventory[thisSlotsId].type].description + ' <span class="price">Sell price: ' + parseMoney(hero.inventory[thisSlotsId].quantity * currentActiveInventoryItems[hero.inventory[thisSlotsId].type].priceCode, 0) + '</span>' + additionalTooltipDetail(thisSlotsId) + '</p>';
    return slotMarkup;
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
        var thisColourName, theColourPrefix, thisFileColourSuffix, thisAction, dataActionMarkup;
        // loop through number of bags
        for (var i = 0; i < hero.bags.length; i++) {
            inventoryMarkup += '<div class="inventoryBag" id="inventoryBag' + i + '"><div class="draggableBar">' + currentActiveInventoryItems[hero.bags[i].type].shortname + '</div><ol class="active" id="bag' + i + '">';
            //console.log(hero.bags[i].type);
            var thisBagNumberOfSlots = currentActiveInventoryItems[hero.bags[i].type].actionValue;
            // loop through slots for each bag:
            for (var j = 0; j < thisBagNumberOfSlots; j++) {
                var thisSlotsID = i + '-' + j
                inventoryMarkup += '<li id="slot' + thisSlotsID + '">';
                // check if that key exists in inventory:
                if (thisSlotsID in hero.inventory) {
                    theColourPrefix = "";
                    thisFileColourSuffix = "";
                    thisColourName = getColourName(hero.inventory[thisSlotsID].colour, hero.inventory[thisSlotsID].type);
                    if (thisColourName != "") {
                        theColourPrefix = thisColourName + " ";
                        thisFileColourSuffix = "-" + thisColourName.toLowerCase();
                    }
                    thisAction = currentActiveInventoryItems[hero.inventory[thisSlotsID].type].action;

                    dataActionMarkup = '';
                    if (thisAction) {
                        dataActionMarkup = 'data-action="' + thisAction + '" data-action-value="' + currentActiveInventoryItems[hero.inventory[thisSlotsID].type].actionValue + '" ';
                    }
                    inventoryMarkup += '<img src="/images/game-world/inventory-items/' + hero.inventory[thisSlotsID].type + thisFileColourSuffix + '.png" ' + dataActionMarkup + 'alt="">';
                    inventoryMarkup += '<span class="qty">' + hero.inventory[thisSlotsID].quantity + '</span>';
                    inventoryMarkup += '<p><em>' + theColourPrefix + currentActiveInventoryItems[hero.inventory[thisSlotsID].type].shortname + ' </em>' + currentActiveInventoryItems[hero.inventory[thisSlotsID].type].description + ' <span class="price">Sell price: ' + parseMoney(hero.inventory[thisSlotsID].quantity * currentActiveInventoryItems[hero.inventory[thisSlotsID].type].priceCode, 0) + '</span>' + additionalTooltipDetail(thisSlotsID) + '</p>';
                } else {
                    inventoryMarkup += '';
                }
                // add item there
                inventoryMarkup += '</li>';
            }
            inventoryMarkup += '</ol></div></div>';
        }
        document.getElementById('inventoryPanels').innerHTML = inventoryMarkup;
        document.getElementById('inventoryPanels').ondblclick = UI.inventoryItemDoubleClick;
        UI.initDrag(".draggableBar");
        UI.initInventoryDrag();
        UI.updateCardAlbum();

        UI.buildRecipePanel();
        if (hero.professionsKnown.length > 0) {
            // load and cache the first profession's recipe assets:
            UI.populateRecipeList(hero.professionsKnown[0]);
        }

        inventoryInterfaceIsBuilt = true;
    },



    showChangeInInventory: function(whichSlotsToUpdate) {


        // add a transition end detector to just the first element that will be changed:
        document.getElementById("slot" + whichSlotsToUpdate[0]).addEventListener(whichTransitionEvent, function removeSlotStatus(e) {
            elementList = document.querySelectorAll('#inventoryPanels .changed');
            for (var i = 0; i < elementList.length; i++) {
                removeClass(elementList[i], 'changed');
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

            addClass(thisSlotElem, "changed");
        }
    },


    handleDrag: function(e) {
        if (UI.inDrag) {
            // don't access the element multiple times - do it all in one go:
            UI.activeDragObject.style.cssText = "z-index:2;top: " + objInitTop + "px; left: " + objInitLeft + "px; transform: translate(" + (e.pageX - dragStartX) + "px, " + (e.pageY - dragStartY) + "px);";
        }
    },

    endDrag: function(e) {
        UI.inDrag = false;
        // tidy up and remove event listeners:
        document.removeEventListener("mousemove", UI.handleDrag, false);
        document.removeEventListener("mouseup", UI.endDrag, false);
        UI.activeDragObject = '';
    },

    initDrag: function(whichElement) {

        var dragTargets = document.querySelectorAll(whichElement);
        for (var i = 0; i < dragTargets.length; i++) {
            dragTargets[i].addEventListener("mousedown", function(e) {
                // make sure it's not a right click:
                if (e.button != 2) {
                    UI.activeDragObject = this.parentElement;
                    UI.inDrag = true;

var pageScrollTopY = (window.pageYOffset || document.documentElement.scrollTop)  - (document.documentElement.clientTop || 0);

                    var clickedSlotRect = this.getBoundingClientRect();
                    objInitLeft = clickedSlotRect.left;
                    objInitTop = clickedSlotRect.top + pageScrollTopY;
                    dragStartX = e.pageX;
                    dragStartY = e.pageY;

                    document.addEventListener("mousemove", UI.handleDrag, false);
                    document.addEventListener("mouseup", UI.endDrag, false);
                    // remove z-index of other draggable elements:
                    var dragTargetsInner = document.querySelectorAll(whichElement);
                    for (j = 0; j < dragTargetsInner.length; j++) {
                        dragTargets[j].parentElement.style.zIndex = 1;
                    }
                }
            }, false);
        }
    },

    inventoryItemDoubleClick: function(e) {
        console.log("double click called");
        var thisItemsAction = e.target.getAttribute('data-action');

        if (thisItemsAction) {

            inventoryItemAction(e.target, thisItemsAction, e.target.getAttribute('data-action-value'));
        }
    },

    showDialogue: function(whichNPC, text) {
        dialogue.innerHTML = text;
        dialogue.classList.remove("slowerFade");
        dialogue.classList.add("active");
        activeNPCForDialogue = whichNPC;
        UI.updateDialogue(activeNPCForDialogue);
    },

    updateDialogue: function(whichNPC) {
        // maybe store these values if NPCs are never going to move while a speech balloon is attached to them? #####
        var thisX = findIsoCoordsX(whichNPC.x, whichNPC.y);
        var thisY = findIsoCoordsY(whichNPC.x, whichNPC.y);
        // +40 y for the toolbar height at the bottom of the canvas:
        // -40 x so the balloon tip is at '0' x
        var thisTransform = "translate(" + Math.floor(thisX - hero.isox + (canvasWidth / 2) - 40) + "px," + Math.floor(0 - (canvasHeight - (thisY - hero.isoy - whichNPC.centreY + (canvasHeight / 2)) + 40)) + "px)";
        dialogue.style.transform = thisTransform;
    },

    showNotification: function(markup) {
        notification.classList.remove("active");
        notification.innerHTML = markup;
        void notification.offsetWidth;
        notification.classList.add('active');
    },

    updateCardAlbum: function() {
        var cardAlbumMarkup = '';
        for (var i = 0; i < 30; i++) {
            if (hero.cards[i]) {
                cardAlbumMarkup += '<li><img src="/images/card-game/cards/' + hero.cards[i] + '.png" class="card players" alt="' + cardGameNameSpace.allCardData[(hero.cards[i])][2] + ' card"></li>';
            } else {
                cardAlbumMarkup += '<li></li>';
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
        }
    },

    buildRecipePanel: function() {
        recipeSearch.onkeyup = recipeSearchInput;
        recipeFilter.onchange = recipeSearchAndFilter;
        clearRecipeSearch.onclick = recipeSearchClear;
    },

    endInventoryDrag: function(e) {
        UI.inDrag = false;
        var thisNode = e.target;
        // find the id of the parent if actual dropped target doesn't have one:
        while (!thisNode.id) {
            thisNode = thisNode.parentNode;
        }
        var droppedSlot = thisNode.id;

        // console.log("dropped on: " + droppedSlot);
        // check if this has "slot" or "inventorybag" in
        // if not, slide back - restore to inventory data
        // if ok, add to inventory data, update slot
        //  console.log("came from: " + UI.sourceSlot);



        if (droppedSlot.substring(0, 4) == "slot") {
            // check it's empty:
            var droppedSlotId = droppedSlot.substring(4);
            if (hero.inventory[droppedSlotId] == undefined) {
                if (UI.sourceSlot != droppedSlotId) {
                    document.getElementById("slot" + UI.sourceSlot).innerHTML = '';
                    addToInventory(droppedSlotId, UI.draggedInventoryObject);
                } else {
                    hero.inventory[droppedSlotId] = JSON.parse(JSON.stringify(UI.draggedInventoryObject));
                }
                document.getElementById("slot" + UI.sourceSlot).classList.remove("hidden");
                UI.droppedSuccessfully();
            } else {
                if (itemAttributesMatch(UI.draggedInventoryObject, hero.inventory[droppedSlotId])) {
                    if (parseInt(UI.draggedInventoryObject.quantity) + parseInt(hero.inventory[droppedSlotId].quantity) <= maxNumberOfItemsPerSlot) {
                        hero.inventory[droppedSlotId].quantity += parseInt(UI.draggedInventoryObject.quantity);
                        // update visually:
                        var thisSlotElem = document.getElementById("slot" + droppedSlotId);
                        for (var i = 0; i < thisSlotElem.childNodes.length; i++) {
                            if (thisSlotElem.childNodes[i].className == "qty") {
                                thisSlotElem.childNodes[i].innerHTML = hero.inventory[droppedSlotId].quantity;
                                break;
                            }
                        }
                        document.getElementById("slot" + UI.sourceSlot).innerHTML = '';
                        document.getElementById("slot" + UI.sourceSlot).classList.remove("hidden");
                        UI.droppedSuccessfully();
                    } else {
                        // add in the max, and slide the remainder back:
                        var amountAddedToThisSlot = maxNumberOfItemsPerSlot - parseInt(hero.inventory[droppedSlotId].quantity);
                        hero.inventory[droppedSlotId].quantity = maxNumberOfItemsPerSlot;
                        // update visually:
                        var thisSlotElem = document.getElementById("slot" + droppedSlotId);
                        for (var i = 0; i < thisSlotElem.childNodes.length; i++) {
                            if (thisSlotElem.childNodes[i].className == "qty") {
                                thisSlotElem.childNodes[i].innerHTML = hero.inventory[droppedSlotId].quantity;
                                break;
                            }
                        }
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
        } else if (droppedSlot.substring(0, 12) == "inventoryBag") {

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


                    document.getElementById("slot" + UI.sourceSlot).innerHTML = '';
                    addToInventory(thisInventoryPanelId+"-"+emptySlotFound, UI.draggedInventoryObject);
                    document.getElementById("slot" + UI.sourceSlot).classList.remove("hidden");
                    UI.droppedSuccessfully();


                } else {
                    UI.slideDraggedSlotBack();
                }


            }


        } else {
            UI.slideDraggedSlotBack();
        }

        // tidy up and remove event listeners:
        document.removeEventListener("mousemove", UI.handleDrag, false);
        document.removeEventListener("mouseup", UI.endInventoryDrag, false);
    },

    droppedSuccessfully: function() {
        // hide the clone:
        UI.activeDragObject.style.cssText = "z-index:2;";
        UI.activeDragObject = '';
    },

    initInventoryDrag: function() {
        var dragTargets = document.querySelectorAll('.inventoryBag ol');
        for (var i = 0; i < dragTargets.length; i++) {
            dragTargets[i].addEventListener("mousedown", function(e) {
                e.preventDefault();
                // make sure it's not a right click:
                if (e.button != 2) {


 var thisNode = e.target;
                    // find the id of the parent if actual dragged target doesn't have one:
                    while (!thisNode.id) {
                        thisNode = thisNode.parentNode;
                    }
                    UI.sourceSlot = thisNode.id.substring(4);
                    UI.draggedInventoryObject = hero.inventory[UI.sourceSlot];

                    // check if the shift key is pressed as well:
                    if (key[5]) {
                        // it is - split stack:
                        // ######
                        // john
                         console.log("split stack");



document.getElementById('splitStackInput').setAttribute("max",hero.inventory[UI.sourceSlot].quantity);

                        key[5] = 0;
                    }
                   
                    // clone this slot to draggableInventorySlot:
                    UI.activeDragObject = document.getElementById('draggableInventorySlot');
                    UI.activeDragObject.innerHTML = thisNode.innerHTML;
                    // remove from inventory data:
                    delete hero.inventory[UI.sourceSlot];
                    thisNode.classList.add("hidden");
                    UI.inDrag = true;
                    var clickedSlotRect = thisNode.getBoundingClientRect();



var pageScrollTopY = (window.pageYOffset || document.documentElement.scrollTop)  - (document.documentElement.clientTop || 0);

                    // 3px padding on the slots:
                    objInitLeft = clickedSlotRect.left + 3;
                    objInitTop = clickedSlotRect.top + 3 + pageScrollTopY;
                    dragStartX = e.pageX;
                    dragStartY = e.pageY;
                    UI.activeDragObject.style.cssText = "z-index:2;top: " + objInitTop + "px; left: " + objInitLeft + "px; transform: translate(" + (e.pageX - dragStartX) + "px, " + (e.pageY - dragStartY) + "px);";
                    document.addEventListener("mousemove", UI.handleDrag, false);
                    document.addEventListener("mouseup", UI.endInventoryDrag, false);
                }
            }, false);
        }
    },

    slideDraggedSlotBack: function() {
        // slide it back visually - add a transition:
        UI.activeDragObject.style.cssText = "z-index:2;left: " + (objInitLeft) + "px; top: " + (objInitTop) + "px;transition: transform 0.4s ease;";
        UI.activeDragObject.addEventListener(whichTransitionEvent, function snapDraggedSlotBack(e) {
            // it's now back, so restore to the inventory:
            hero.inventory[UI.sourceSlot] = JSON.parse(JSON.stringify(UI.draggedInventoryObject));
            document.getElementById("slot" + UI.sourceSlot).classList.remove("hidden");
            // hide the clone:
            UI.droppedSuccessfully();
            // remove this event listener now:
            return e.currentTarget.removeEventListener(whichTransitionEvent, snapDraggedSlotBack, false);
        }, false);
    }
}

// service worker:
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/game-world/serviceWorker.min.js', {
        scope: '/game-world/'
    });
}

function init() {
    gameCanvas = document.getElementById("gameWorld");
    if (gameCanvas.getContext) {
        gameContext = gameCanvas.getContext('2d');
        canvasWidth = gameCanvas.width;
        canvasHeight = gameCanvas.height;
    
    whichTransitionEvent = determineWhichTransitionEvent();
    gameMode = "mapLoading";

    cartographyCanvas = document.getElementById("cartographyCanvas");
    cartographyContext = cartographyCanvas.getContext('2d');
    offScreenCartographyCanvas = document.getElementById("offScreenCartographyCanvas");
    offScreenCartographyContext = offScreenCartographyCanvas.getContext('2d');

    canvasMapImage = document.createElement('img');
canvasMapMaskImage = document.createElement('img');

    UI.init();
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
        hero.titlesEarned = data.titlesEarned;
        hero.activeTitle = data.activeTitle;
        hero.recipesKnown = data.recipesKnown;
        hero.professionsKnown = data.professionsKnown;
       
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
            document.title = titleTagPrefix+' - '+thisMapData.zoneName;
             cartographicTitle.innerHTML = thisMapData.zoneName;
        }
       initCartographicMap();
        findInventoryItemData();

    }, function(status) {
        // alert('Error loading data for map #' + currentMap+" --- "+mapFilePath);
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
        for (var i = 0 in doorData) {
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
            name: "npc" + i,
            src: "/images/game-world/npcs/" + npcGraphicsToLoad[i].src
        });
    }

    itemGraphicsToLoad = thisMapData.items;
    for (var i = 0; i < itemGraphicsToLoad.length; i++) {
        // get colour name 

thisFileColourSuffix = "";
if(itemGraphicsToLoad[i].colour) {
 thisColourName = getColourName(itemGraphicsToLoad[i].colour, itemGraphicsToLoad[i].type);

                    if (thisColourName != "") {
                       
                        thisFileColourSuffix = "-" + thisColourName.toLowerCase();
                    }
                }


        imagesToLoad.push({
            name: "item" + i,
            src: "/images/game-world/items/" + currentActiveInventoryItems[itemGraphicsToLoad[i].type].worldSrc + thisFileColourSuffix+".png"
        });
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
    var recipeIdsToGet = hero.recipesKnown.join("|");
    loadProfessionsAndRecipes(recipeIdsToGet);
}


function loadProfessionsAndRecipes(recipeIdsToLoad) {
    getJSON("/game-world/getProfessionsAndRecipes.php?whichIds=" + recipeIdsToLoad, function(data) {

        hero.crafting = data.professions;
        if (!inventoryInterfaceIsBuilt) {
            UI.buildInventoryInterface();
        }
        loadMapAssets();
    }, function(status) {
        // try again:
        loadProfessionsAndRecipes(recipeIdsToLoad);
    });
}




function findInventoryItemData() {
    var itemIdsToGet = [];
    // find out all items in the hero's inventory:
    for (var arrkey in hero.inventory) {
        if (hero.inventory.hasOwnProperty(arrkey)) {
            //console.log(key + " -> " + hero.inventory[arrkey].type);
            // make sure it's not already added:
            if (itemIdsToGet.indexOf(hero.inventory[arrkey].type) == -1) {
                itemIdsToGet.push(hero.inventory[arrkey].type);
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

    // find item available in any shops:
    // ####
    loadInventoryItemData(itemIdsToGet.join("|"));
}



function loadInventoryItemData(itemIdsToLoad) {
    getJSON("/game-world/getInventoryItems.php?whichIds=" + itemIdsToLoad, function(data) {
        currentActiveInventoryItems = data;
    
        findProfessionsAndRecipes();
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
        npcImages[i] = Loader.getImage("npc" + i);
    }
    itemImages = [];
    for (var i = 0; i < itemGraphicsToLoad.length; i++) {
        itemImages[i] = Loader.getImage("item" + i);
    }
    backgroundImg = Loader.getImage("backgroundImg");
    // initialise and position NPCs:
    for (var i = 0; i < thisMapData.npcs.length; i++) {
        thisMapData.npcs[i].x = getTileCentreCoordX(thisMapData.npcs[i].tileX);
        thisMapData.npcs[i].y = getTileCentreCoordY(thisMapData.npcs[i].tileY);

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

        thisMapData.items[i].width = currentActiveInventoryItems[thisMapData.items[i].type].width;
        thisMapData.items[i].height = currentActiveInventoryItems[thisMapData.items[i].type].height;

        thisMapData.items[i].centreX = currentActiveInventoryItems[thisMapData.items[i].type].centreX;
        thisMapData.items[i].centreY = currentActiveInventoryItems[thisMapData.items[i].type].centreY;
    }

activeNPCForDialogue = '';
    // determine tile offset to centre the hero in the centre
    hero.x = getTileCentreCoordX(hero.tileX);
    hero.y = getTileCentreCoordY(hero.tileY);

    // initialise fae:
    fae.x = hero.x + tileW * 2;
    fae.y = hero.y + tileH * 2;
    fae.z = 40;
    fae.dz = 1;
    fae.pulse = 0;
    fae.state = 'idle';

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
        npcImages[i].src = '';
        npcImages[i] = null;
    }
    for (var i = 0; i < itemGraphicsToLoad.length; i++) {
        itemImages[i].src = '';
        itemImages[i] = null;
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
    }
    if(currentMap < 0) {
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
            console.log("loading map assets...");
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
        if((hero.tileX != heroOldX) || (hero.tileY != heroOldY)) {
            heroIsInNewTile();
        }
// check to see if a dialogue balloon is open, and if the hero has moved far from the NPC:
if (activeNPCForDialogue != '') {
    if (!(isInRange(hero.x, hero.y, activeNPCForDialogue.x, activeNPCForDialogue.y, closeDialogueDistance))) {
        dialogue.classList.add("slowerFade");
        dialogue.classList.remove("active");
        // only remove this after dialogue has faded out completely:


    dialogue.addEventListener(whichTransitionEvent, function removeActiveDialogue(e) {
                               activeNPCForDialogue = '';
                                return e.currentTarget.removeEventListener(whichTransitionEvent, removeActiveDialogue, false);
                            }, false);


        
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

    moveNPCs();
}

function heroIsInNewTile() {
    if (currentMap < 0) {
        updateCartographicMiniMap();
    }
    var thisHotspot;
    // check for hotspots:
    for (var i=0; i<thisMapData.hotspots.length; i++) {
       thisHotspot = thisMapData.hotspots[i];
       if(isInRange(hero.x, hero.y, getTileCentreCoordX(thisHotspot.centreX), getTileCentreCoordY(thisHotspot.centreY), thisHotspot.radius * tileW)) {
        if(questData[thisHotspot.quest].hasBeenActivated < 1) {
UI.showNotification("<p>"+thisHotspot.message+"</p>");
        }
questData[thisHotspot.quest].hasBeenActivated = 1;
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
                var actionValue = currentActiveInventoryItems[itemGraphicsToLoad[i].type].actionValue;
                switch (currentActiveInventoryItems[itemGraphicsToLoad[i].type].action) {
                    case "static":
                        // can't interact with it - do nothing
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

function processSpeech(thisNPC, thisSpeech, thisSpeechCode, isPartOfNPCsNormalSpeech) {
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
                                            console.log(currentThresholdValue + " < "+questData[allSubQuestsRequired[k]].thresholdNeededForCompletion.substring(1));
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
                            console.log("allSubQuestsComplete: "+allSubQuestsComplete);
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
                                    "wrapped": 0,
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

    UI.showDialogue(thisNPC, thisSpeech);
    canCloseDialogueBalloonNextClick = false;
    if (!isPartOfNPCsNormalSpeech) {
        // set a flag so that pressing action near the NPC will close the balloon:
        canCloseDialogueBalloonNextClick = true;
    }
}



function closeQuest(whichNPC, whichQestId) {
    if (giveQuestRewards(whichQestId)) {
        if (questData[whichQestId].isRepeatable > 0) {
            questData[whichQestId].hasBeenCompleted = false;
            questData[whichQestId].isUnderway = false;
        } else {
            questData[whichQestId].hasBeenCompleted = true;
            // remove quest text now:
            whichNPC.speech.splice(whichNPC.speechIndex, 1);
            // knock this back one so to keep it in step with the removed item:
            whichNPC.speechIndex--;
        }
        checkForTitlesAwarded(whichQestId);
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
            // check for any quantities:
            var thisQuestReward = questRewards[i].split("x");
            var thisQuantity, thisItem;
            if (thisQuestReward.length > 1) {
                thisQuantity = thisQuestReward[0];
                thisItem = thisQuestReward[1];
            } else {
                thisQuantity = 1;
                thisItem = questRewards[i];
            }

            // build item object:
            var thisRewardObject = {
                "type": parseInt(thisItem),
                "quantity": parseInt(thisQuantity),
                "quality": 100,
                "durability": 100,
                "currentWear": 0,
                "effectiveness": 100,
                "wrapped": 0,
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


function animateFae() {
    fae.z = Math.floor((Math.sin(fae.dz) + 1) * 8 + 40);
    fae.dz += 0.2;
// fae.y+=8;
    for (var i = 0; i < fae.particles.length; i++) {
        fae.particles[i].alpha -= 0.1;
        if(fae.particles[i].alpha<=0) {
            fae.particles.splice(i, 1);
        }
    }

    // add particles:
    if (fae.particles.length < fae.maxParticles) {
        if (getRandomInteger(1, 4) == 1) {
            var faeIsoX = findIsoCoordsX(fae.x, fae.y);
            var faeIsoY = findIsoCoordsY(fae.x, fae.y) - fae.z;
            var particleIsoX = faeIsoX + getRandomInteger(0, 8) - 4;
            var particleIsoY = faeIsoY + getRandomInteger(0, 8) - 4;
            // check it's in a circle from the fae's centre:
            if (isInRange(faeIsoX, faeIsoY, particleIsoX, particleIsoY, 6)) {

                fae.particles.push({ 'depth': findIsoCoordsY(fae.x, fae.y),'isoX': particleIsoX, 'isoY': particleIsoY, 'alpha': 1 });
            
            }
        }
    }
}



function learnRecipe(recipeIndex) {
    if (hero.recipesKnown.indexOf(recipeIndex) === -1) {
        hero.recipesKnown.push(parseInt(recipeIndex));
    }
}







function draw() {
    if (gameMode == "mapLoading") {
        gameContext.fillRect(0, 0, canvasWidth, canvasHeight);
        gameContext.fillStyle = "black";
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
            [hero.isoy, "img", heroImg, Math.floor(canvasWidth / 2 - hero.feetOffsetX), Math.floor(canvasHeight / 2 - hero.feetOffsetY)]
        ];


        // draw fae:
        thisX = findIsoCoordsX(fae.x, fae.y);
        thisY = findIsoCoordsY(fae.x, fae.y);

        assetsToDraw.push([thisY, "faeCentre", Math.floor(thisX - hero.isox + (canvasWidth / 2)), Math.floor(thisY - hero.isoy + (canvasHeight / 2) - fae.z)]);

        // draw fae particles:
        for (var i = 0; i < fae.particles.length; i++) {
            assetsToDraw.push([fae.particles[i].depth, "faeParticle", Math.floor(fae.particles[i].isoX - hero.isox + (canvasWidth / 2)), Math.floor(fae.particles[i].isoY - hero.isoy + (canvasHeight / 2)), fae.particles[i].alpha]);
        }

        var map = thisMapData.terrain;

        var thisNPCOffsetCol = 0;
        var thisNPCOffsetRow = 0;

        for (var i = 0; i < mapTilesX; i++) {
            for (var j = 0; j < mapTilesY; j++) {
                // the tile coordinates should be positioned by i,j but the way the map is drawn, the reference in the array is j,i
                // this makes the map array more readable when editing
                if (map[j][i] != "*") {
                    thisX = getTileIsoCentreCoordX(i, j);
                    thisY = getTileIsoCentreCoordY(i, j);
                    thisGraphicCentreX = thisMapData.graphics[(map[j][i])].centreX;
                    thisGraphicCentreY = thisMapData.graphics[(map[j][i])].centreY;
                    assetsToDraw.push([thisY, "img", tileImages[(map[j][i])], Math.floor(thisX - hero.isox - thisGraphicCentreX + (canvasWidth / 2)), Math.floor(thisY - hero.isoy - thisGraphicCentreY + (canvasHeight / 2))]);
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
   

            assetsToDraw.push([thisY, "sprite", npcImages[i], thisNPCOffsetCol * thisNPC.spriteWidth, thisNPCOffsetRow * thisNPC.spriteHeight, thisNPC.spriteWidth, thisNPC.spriteHeight, Math.floor(thisX - hero.isox - thisNPC.centreX + (canvasWidth / 2)), Math.floor(thisY - hero.isoy - thisNPC.centreY + (canvasHeight / 2)), thisNPC.spriteWidth, thisNPC.spriteHeight]);
        }


        for (var i = 0; i < thisMapData.items.length; i++) {
            thisItem = thisMapData.items[i];
            thisX = findIsoCoordsX(thisItem.x, thisItem.y);
            thisY = findIsoCoordsY(thisItem.x, thisItem.y);
            assetsToDraw.push([thisY, "img", itemImages[i], Math.floor(thisX - hero.isox - thisItem.centreX + (canvasWidth / 2)), Math.floor(thisY - hero.isoy - thisItem.centreY + (canvasHeight / 2))]);
        }

        assetsToDraw.sort(sortByLowestValue);

        // don't need to clear, as the background will overwrite anyway - this means there's less to process:
        //  gameContext.clearRect(0, 0, canvasWidth, canvasHeight);



        // scroll background to match the top tip and left tip of the tile grid:
        gameContext.drawImage(backgroundImg, Math.floor(getTileIsoCentreCoordX(0, mapTilesX - 1) - hero.isox - tileW / 2), Math.floor(getTileIsoCentreCoordY(0, 0) - hero.isoy - tileH / 2));
        // draw the sorted assets:
        for (var i = 0; i < assetsToDraw.length; i++) {


switch(assetsToDraw[i][1]) {
    case "faeCentre":
                // draw fae:
                drawCircle("#ffdc0c", assetsToDraw[i][2], assetsToDraw[i][3], 2);
                drawCircle("rgba(255,220,255,0.3)", assetsToDraw[i][2], assetsToDraw[i][3], 4);

                // draw fae's shadow - make it respond to the fae's height:
                gameContext.fillStyle = "rgba(0,0,0," + (65 - fae.z) * 0.01 + ")";
                gameContext.beginPath();
                gameContext.ellipse(assetsToDraw[i][2] - getXOffsetFromHeight(fae.z), assetsToDraw[i][3] + fae.z, 3, 1, 0, 0, 2 * Math.PI);
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



if(activeNPCForDialogue != '') {
    UI.updateDialogue(activeNPCForDialogue);
}

        // draw the map transition if it's needed:
        if (mapTransition == "out") {
            var gradientSize = (1 - (mapTransitionCurrentFrames / mapTransitionMaxFrames));
            var gradient = gameContext.createRadialGradient(canvasWidth / 2, canvasHeight / 2, gradientSize * canvasWidth / 2, canvasWidth / 2, canvasHeight / 2, 0);
            gradient.addColorStop(0, "rgba(0,0,0,1)");
            gradient.addColorStop(1, "rgba(0,0,0,0)");
            gameContext.fillStyle = gradient;
            gameContext.fillRect(0, 0, canvasWidth, canvasHeight);
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

