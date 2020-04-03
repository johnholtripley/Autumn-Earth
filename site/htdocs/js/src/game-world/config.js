// frame rate:
const animationFramesPerSecond = 16;
var lastTime = 0;
var elapsed = 0;
var timeSinceLastFrameSwap = 0;
var currentAnimationFrame = 0;
const animationUpdateTime = (1000 / animationFramesPerSecond);
var gameCanvas, gameContext, reflectedCanvas, reflectionContext, waterCanvas, waterContext, gameMode, cartographyContext, cartographyCanvas, offScreenCartographyCanvas, offScreenCartographyContext, canvasMapImage, canvasMapImage, canvasMapMaskImage, heroImg, shadowImg, tilledEarth, addedWater, ocean, oceanPattern, imagesToLoad, objInitLeft, objInitTop, dragStartX, dragStartY, inventoryCheck, timeSinceLastAmbientSoundWasPlayed, gameSettings, lightMap, lightMapOverlay, lightMapContext, activeGatheredObject, questResponseNPC, cursorPositionX, cursorPositionY, whichVisibleMap, allRecipes, availableScreenWidth, availableScreenHeight, housingData, inventorySlotReference;
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