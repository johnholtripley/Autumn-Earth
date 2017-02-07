/*








if(supportsCanvas && !hasACanvasElement) {

      // initialise the exploded image, first load in the additional assets:
         var imagesToLoad = "";
    // var imagePath = "images/sequence";
     //   var imagePath = $originalImage.attr('src');
     //   imagePath = imagePath.substring(0, imagePath.lastIndexOf('/'));
        for (var i = 1; i < 46; i++) {
            imagesToLoad += '<img role="hidden" id="twist'+i+'" src="images/sequence/twist' + i + '.jpg"' + '>';
           // preload, but don't attach to DOM
        //   $('<img/>')[0].src = "images/sequence/twist" + i + ".jpg";
           
        }
        
   $('#devicesOrganicLoader').append(imagesToLoad);

$('img').load(function() {
// ensure all images are loaded before creating canvas element:
domContentLoaded = true;
});



canvas = document.createElement('canvas');
//canvas.width = 700;
//canvas.height = 494;

// get percentage-based canvas size:
var canvasHolder = document.getElementById('canvasHolder');



canvas.width = canvasHolder.offsetWidth;
canvas.height = canvasHolder.offsetHeight;



canvasHolder.appendChild(canvas);
hasACanvasElement = true;





function updateDisplay(timestamp) {



if(domContentLoaded) {



   if (currentTwisted != imageToUse) {
   
  
   
   targetImage = document.getElementById("twist"+imageToUse);
// updateCanvasImage(canvas,targetImage);

// target image size is 700 x 494

canvas.getContext("2d").drawImage(targetImage, 0, 0, canvas.width, canvas.height);
   imageToUse = currentTwisted;
   }
}
 // request new frame
   requestAnimationFrame(updateDisplay);

}



imageToUse = 1;
currentTwisted = 0;



//targetImage = document.getElementById("twist1");
//updateCanvasImage(canvas,targetImage);




}











// the twist effect is in panel #4
if (panelIsInView(3)) {



if(supportsCanvas) {



// ------------------------
    //  make sure it's all in view before running the explosion
                   topPoint = thisPanelOffsetTop - windowHeight;
                    bottomPoint = thisPanelOffsetTop + thisPanelHeight;
                    difference = bottomPoint - topPoint;

                    positionThroughThisPanel = ((bottomPoint - topPoint) - (bottomPoint - windowScrollTop)) / difference;
                    
                    

                    // determine which frame of the exploded animation is required:
                    imageToUse = Math.floor(38 * positionThroughThisPanel) + 1;
                    // constrain these values:
                    imageToUse = (imageToUse < 1) ? 1 : imageToUse;
                    imageToUse = (imageToUse > 38) ? 38 : imageToUse;

                    // don't do anything if there's no need:
                 
                 //   $devicesOrganic.css("background-image","url(images/sequence/twist" + imageToUse + ".jpg)");
                        //$originalImage.attr("src", "iamges/sequence/twist" + imageToUse + ".gif");
                        
                      //  targetImage = document.getElementById("twist"+imageToUse);
                    //   canvas.getContext("2d").drawImage(targetImage, 0, 0);
                        
                        
                     //   currentTwisted = imageToUse;
                   // }
// ------------------------
}


}



}









*/
















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





// config ----------------------------------------------------

framesPerSecond = 24;

 

// -----------------------------------------------------------



function supportsCanvas() {
    // http://diveintohtml5.info/detect.html#canvas
    return !!document.createElement('canvas').getContext;
}

function initAnimations() {
if (supportsCanvas()) {

// allAnimations array is an array of all the animations on the page [root image file name][file extension][number of images in the sequence]
allAnimations = new Array();
// set array to store the current index of each sequence:
animationCounter = new Array();
allAnimationsLength = 0;

// find all images in the page that need animating:

var thisImgSrc = "";
var thisImgExtension = "jpg";
var thisDotPosition = -1;
$("img[data-animation-frames]").each(function( index ) {

thisImgSrc = $(this).attr('src');

thisDotPosition = thisImgSrc.lastIndexOf(".");
thisImgExtension = thisImgSrc.substring(thisDotPosition);
thisImgSrc = thisImgSrc.substring(0,thisDotPosition-1);


allAnimations.push([thisImgSrc,thisImgExtension,$(this).data("animation-frames")]);

animationCounter[index] = "1";
allAnimationsLength++;




// create canvas element for each
// canvas = document.createElement('canvas');
// canvas.width = 700;
// canvas.height = 494;
// canvasHolder.appendChild(canvas);




});







// load all of the images in:


imagesToLoad = "";
for (var i=0;i<allAnimationsLength;i++) {
for (var j = 1; j <= allAnimations[i][2]; j++) {
imagesToLoad += '<img role="hidden" id="'+allAnimations[i][0]+j+'" src="'+ allAnimations[i][0] + j +allAnimations[i][1] + '">';
}
}

$('#animationSequences').append(imagesToLoad);


$( window ).load(function() {
// start the animations:
cycleAnimations();
});

/*
$('img').load(function() {
// ensure all images are loaded before creating canvas element:

// move cycleAnimations() in here once using canvas and not changing src of the image
// #############

$( "img").unbind( "l" );


});
*/




}
}

function cycleAnimations() {
    setTimeout(function() {
        window.requestAnimationFrame(cycleAnimations);
        // Drawing code goes here
   
   $("img[data-animation-frames]").each(function( index ) {
   $(this).attr('src',allAnimations[index][0] + animationCounter[index] +allAnimations[index][1]);
   animationCounter[index]++;
   if(animationCounter[index] > allAnimations[index][2]) {
   animationCounter[index] = 1;
   }
   });
        
       
    }, (1000 / framesPerSecond));
}

initAnimations();

