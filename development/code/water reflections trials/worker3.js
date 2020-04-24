
var source;
var canvas;


self.onmessage = function(e) {
  //  if(!isAlreadyRunning) {
     //   isAlreadyRunning = true;
 //if(e.data.source) {
    source = e.data.source;
//}

    if(e.data.canvas) {
    canvas = e.data.canvas;
}

var canvasContext = canvas.getContext("2d");

canvasContext.globalCompositeOperation = 'source-over';
// draw passed in source:
canvasContext.putImageData(source,0,0);
// draw another rect:
canvasContext.fillStyle = "teal";
canvasContext.fillRect(120, 120, 180,180);
// erase a part of the canvas:
  canvasContext.globalCompositeOperation = 'destination-out';
canvasContext.fillRect(60, 80, 200,200);
};