// frame rate:
var animationFramesPerSecond = 16;
var lastTime = 0;
var elapsed = 0;

var characterId = 'chr-html5';
var currentMap = 1;
var thisMapData = '';
var mapTilesX = 0;
var mapTilesY = 0;

var tileGraphics = [];
var tileW = 48;
var tileH = tileW/2;
var tileGraphicsToLoad = 0;
var canvasWidth = 256;
var canvasHeight = 176;
var worldOffsetX = 0;
var worldOffsety = 0;

// key bindings
var key = [0, 0, 0, 0, 0];

var hero = {
    x: 0,
    y: 0,
    dx: 0,
    dy: 0,
    tileX: 1,
    tileY: 1,
    width: 17,
    height: 25,
    feetOffsetX: 8,
    feetOffsetY: 21,
    speed: 2,
    animationFrameIndex: 0,
    timeSinceLastFrameSwap: 0,
    animationUpdateTime: (1000 / animationFramesPerSecond),
    isMoving: false,
    facing: 'down',
    sequences: {
        'stand-down': [3],
        'stand-up': [10],
        'stand-right': [17],
        'stand-left': [24],
        'walk-down': [3, 4, 5, 6, 5, 4, 3, 2, 1, 0, 1, 2],
        'walk-up': [10, 11, 12, 13, 12, 11, 10, 9, 8, 7, 8, 9],
        'walk-right': [17, 18, 19, 20, 19, 18, 17, 16, 15, 14, 15, 16],
        'walk-left': [24, 25, 26, 27, 26, 25, 24, 23, 22, 21, 22, 23]
    }

};
