// http://www.smashingmagazine.com/2012/10/19/design-your-own-mobile-game/
// https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial

// namespace our game
var AE = {

    // set up some initial values
    WIDTH: 320, 
    HEIGHT:  480, 
    // we'll set the rest of these
    // in the init function
    RATIO:  null,
    currentWidth:  null,
    currentHeight:  null,
    canvas: null,
    ctx:  null,

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
  // canvas-unsupported code here
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

AE.Draw.clear();
  AE.ctx.drawImage(hero,Math.random()*AE.WIDTH,Math.random()*AE.HEIGHT);

  window.requestAnimationFrame(AE.core.gameLoop);
} 
};

// abstracts various canvas operations into standalone functions
AE.Draw = {

    clear: function() {
       // AE.ctx.clearRect(0, 0, AE.WIDTH, AE.HEIGHT);
  //  AE.ctx.restore();
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
  /*  rect: function(x, y, w, h, col) {
        AE.ctx.fillStyle = col;
        AE.ctx.fillRect(x, y, w, h);
    },

    circle: function(x, y, r, col) {
        AE.ctx.fillStyle = col;
        AE.ctx.beginPath();
        AE.ctx.arc(x, y, r, 0,  Math.PI * 2, true);
     
     // fill automatically closes the path
     //   AE.ctx.closePath();
       
       
        AE.ctx.fill();
    },


    text: function(string, x, y, size, col) {
        AE.ctx.font = 'bold '+size+'px Monospace';
        AE.ctx.fillStyle = col;
        AE.ctx.fillText(string, x, y);
    }
    */

};

window.addEventListener('load', AE.init, false);
window.addEventListener('resize', AE.resize, false);