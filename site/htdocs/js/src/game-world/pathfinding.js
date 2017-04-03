if (window.Worker) {
    var pathfindingWorker = new Worker('/js/worker-pathfinding.js');
    pathfindingWorker.onmessage = function(e) {
        var thisAgentsName = e.data[0];
        if (thisAgentsName == 'pet') {
            var thisPet = hero.allPets[hero.activePets[e.data[1]]];
            thisPet.foundPath = e.data[2];
            thisPet.pathIndex = 1;
            thisPet.state = 'moving';
            thisPet.facing = e.data[2][0];
        } else {
            // find which NPC this is:
            // http://stackoverflow.com/a/16100446/1054212
            var thisNPCsIndex = thisMapData.npcs.map(function(x) {
                return x.name;
            }).indexOf(thisAgentsName);
            // insert the new path:
            // http://stackoverflow.com/a/7032717/1054212
            thisMapData.npcs[thisNPCsIndex].movement.splice.apply(thisMapData.npcs[thisNPCsIndex].movement, [thisMapData.npcs[thisNPCsIndex].movementIndex + 2, 0].concat(e.data[1]));
            thisMapData.npcs[thisNPCsIndex].waitingForAPath = false;
            // store the target tile so it doesn't try and go straight back to it after:
            thisMapData.npcs[thisNPCsIndex].lastTargetDestination = e.data[2];
        }
    }
}
