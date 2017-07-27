if (window.Worker) {
    var lightMapWorker = new Worker('/js/worker-lightmap.js');
    lightMapWorker.onmessage = function(e) {
        lightMap = e.data;
    }
}

function updateLightMap() {
    lightMapWorker.postMessage([thisMapData, hero.tileX, hero.tileY, hero.lineOfSightRange]);
}