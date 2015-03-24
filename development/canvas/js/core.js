// http://www.smashingmagazine.com/2012/10/19/design-your-own-mobile-game/
// https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial








// -----------------------------------------------------------
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
// requestAnimationFrame polyfill by Erik Möller
// fixes from Paul Irish and Tino Zijdel
 
(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
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











// namespace our game
var AE = {

    // set up some initial values
    WIDTH: 320, 
    HEIGHT:  480,
        framesPerSecond: 1,
        isPaused: false,
    documentTitle: document.title,
pausedDocumentTitle: "[paused] - " + document.title,
    // we'll set the rest of these
    // in the init function
    RATIO:  null,
    currentWidth:  null,
    currentHeight:  null,
    canvas: null,
    ctx:  null,


windowVisible: function() {
// don't run the game if the tab isn't active
if(document.hidden) {
document.title = AE.pausedDocumentTitle;
AE.isPaused = true;
} else {
document.title = AE.documentTitle;
AE.isPaused = false;
}


},


    init: function() {

        // the proportion of width to height
        AE.RATIO = AE.WIDTH / AE.HEIGHT;
        // these will change when the screen is resized
        AE.currentWidth = AE.WIDTH;
        AE.currentHeight = AE.HEIGHT;
        // this is our canvas element
        AE.canvas = document.getElementById('primaryCanvas');
        
        
        if (AE.canvas.getContext){
  // the canvas context enables us to interact with the canvas api
        AE.ctx = AE.canvas.getContext('2d');
        
        // stop scaled images from being anti-aliased (for pixel art effect):
        AE.ctx.mozImageSmoothingEnabled = false;
AE.ctx.webkitImageSmoothingEnabled = false;
AE.ctx.msImageSmoothingEnabled = false;
AE.ctx.imageSmoothingEnabled = false;
        
        
} else {
  // canvas not supported - fallback code here
  // ###############
}
        
        
        // setting this is important otherwise the browser will default to 320 x 200
        AE.canvas.width = AE.WIDTH;
        AE.canvas.height = AE.HEIGHT;
      

        // we're ready to resize
        AE.resize();




AE.Draw.loadBackground();
AE.Draw.clear();
AE.Draw.loadSprites();
window.requestAnimationFrame(AE.core.gameLoop);


    },

    resize: function() {

        AE.currentHeight = window.innerHeight;
        // resize the width in proportion to the new height
        AE.currentWidth = AE.currentHeight * AE.RATIO;

        // set the new canvas style width and height
        // note: our canvas is still 320 x 480, but we're essentially scaling it with CSS
      //  AE.canvas.style.width = AE.currentWidth + 'px';
      //  AE.canvas.style.height = AE.currentHeight + 'px';


    }

};

AE.core = {
gameLoop: function() {


    setTimeout(function() {
    
         window.requestAnimationFrame(AE.core.gameLoop);
        // Drawing code goes here
   if(!AE.isPaused) {
AE.Draw.clear();
console.log();
  AE.ctx.drawImage(hero,Math.random()*AE.WIDTH,Math.random()*AE.HEIGHT);
        }
       
    }, (1000 / AE.framesPerSecond));








} 
};

// abstracts various canvas operations into standalone functions
AE.Draw = {

    clear: function() {

    AE.ctx.fillRect(0,0,AE.currentWidth,AE.currentHeight);
    },

loadBackground: function() {
var img = new Image();
  img.src = 'images/background-repeat.png';
  
  img.addEventListener("load", function() {
 
    var backgroundPattern = AE.ctx.createPattern(img,'repeat');
    AE.ctx.fillStyle = backgroundPattern;
    AE.ctx.fillRect(0,0,AE.currentWidth,AE.currentHeight);
   // AE.ctx.save();
}, false);
  

},

loadSprites: function() { 
 hero = new Image();
hero.src = 'images/sprite.png';
}


};

window.addEventListener('load', AE.init, false);
window.addEventListener('resize', AE.resize, false);
document.addEventListener("visibilitychange", AE.windowVisible, false);