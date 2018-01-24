// frame rate:
const animationFramesPerSecond = 16;
var lastTime = 0;
var elapsed = 0;
var timeSinceLastFrameSwap = 0;
var currentAnimationFrame = 0;
var animationUpdateTime = (1000 / animationFramesPerSecond);

var gameCanvas, gameContext, gameMode, cartographyContext, cartographyCanvas, offScreenCartographyCanvas, offScreenCartographyContext, canvasMapImage, canvasMapImage, canvasMapMaskImage, heroImg, shadowImg, imagesToLoad, tileImages, npcImages, itemImages, backgroundImg, objInitLeft, objInitTop, dragStartX, dragStartY, inventoryCheck, timeSinceLastAmbientSoundWasPlayed, gameSettings, lightMap, lightMapOverlay, lightMapContext, activeGatheredObject;
var chestIdOpen = -1;
var currentWeather = "";
var weatherLastChangedTime = 0;
var interfaceIsVisible = true;
var activeAction = "";
var dowsing = {};
var gathering = {};
var surveying = {};
var jumpMapId = null;
const titleTagPrefix = 'Autumn Earth';


// map changes:
var mapTransition = "";
var mapTransitionCurrentFrames = 1;
const mapTransitionMaxFrames = 60;
var activeDoorX = -1;
var activeDoorY = -1;

var characterId = 999;
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

var activeTitles = [];

var inventoryInterfaceIsBuilt = false;

var whichTransitionEvent = '';
var whichAnimationEvent = '';

var activeNPCForDialogue = '';
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
    feetOffsetX: 40,
    feetOffsetY: 69,
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

