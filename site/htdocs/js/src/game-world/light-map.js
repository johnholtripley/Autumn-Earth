if (window.Worker) {
    var lightMapWorker = new Worker('/js/worker-lightmap.js');
    lightMapWorker.onmessage = function(e) {
        lightMap = e.data;
    }
}

/*
// make a temporary canvas for the tinted items:
const tintCanvas = document.createElement("canvas");

function shadeImage(image, tintAmount) {
    tintCanvas.width = image.width;
    tintCanvas.height = image.height;
    tintCanvas.context = tintCanvas.getContext("2d");
    tintCanvas.context.drawImage(image, 0, 0);
    tintCanvas.context.fillStyle = 'rgba(0,0,0,' + tintAmount + ')';
    tintCanvas.context.fillRect(0, 0, tintCanvas.width, tintCanvas.height);
    tintCanvas.context.globalCompositeOperation = "destination-atop";
    tintCanvas.context.drawImage(image, 0, 0);
    return tintCanvas;
}
*/

function updateLightMap() {
    lightMapWorker.postMessage([thisMapData, hero.tileX, hero.tileY, hero.lineOfSightRange]);
}