// frame rate:
var animationFramesPerSecond = 16;
var lastTime = 0;
var elapsed = 0;
var timeSinceLastFrameSwap = 0;
var currentAnimationFrame = 0;
var animationUpdateTime = (1000 / animationFramesPerSecond);

// map changes:
var mapTransition = "";
var mapTransitionCurrentFrames = 1;
var mapTransitionMaxFrames = 60;
var activeDoorX = -1;
var activeDoorY = -1;

var characterId = 999;
var currentMap = 2;
var newMap = currentMap;
var thisMapData = '';
var mapTilesX = 0;
var mapTilesY = 0;

var tileGraphics = [];
var tileW = 48;
var tileH = tileW/2;
var tileGraphicsToLoad = 0;
var npcGraphicsToLoad = 0;
var canvasWidth = 800;
var canvasHeight = 600;

var randomDungeonName = "";
var randomDungeons = ["","the-barrow-mines"];
var previousZoneName = "";



// key bindings
var key = [0, 0, 0, 0, 0];

var hero = {
    x: 0,
    y: 0,
    dx: 0,
    dy: 0,
    tileX: 12,
    tileY: 12,
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
