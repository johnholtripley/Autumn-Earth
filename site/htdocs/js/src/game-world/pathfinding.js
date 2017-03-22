if (window.Worker) {
    var pathfindingWorker = new Worker('/js/worker-pathfinding.min.js');
    pathfindingWorker.onmessage = function(e) {
        console.log('Message received from worker');
        console.log(e.data);
        thisNPCsName = e.data[0];
        console.log("looking for " + thisNPCsName);
        // find which NPC this is:
        // http://stackoverflow.com/a/16100446/1054212
        var thisNPCsIndex = thisMapData.npcs.map(function(x) {
            return x.name; }).indexOf(thisNPCsName);
        console.log("found at " + thisNPCsIndex);
          thisMapData.npcs[thisNPCsIndex].foundPath = e.data[1];
          thisMapData.npcs[thisNPCsIndex].facing = thisMapData.npcs[thisNPCsIndex].foundPath[0];
          thisMapData.npcs[thisNPCsIndex].isMoving = true;

    }

}
