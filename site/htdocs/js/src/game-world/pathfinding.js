if (window.Worker) {
    var pathfindingWorker = new Worker('/js/worker-pathfinding.js');
    pathfindingWorker.onmessage = function(e) {

        var thisAgentsName = e.data[0];
        if (thisAgentsName == 'pet') {
            var thisPet = hero.allPets[hero.activePets[e.data[1]]];
            thisPet.foundPath = e.data[2];
            if (thisPet.foundPath.join() == "-,pathEnd") {
                // couldn't find a path:
                thisPet.state = 'waiting';
                thisPet.foundPath = '';
            } else {
                // found one, so use it:
                thisPet.pathIndex = 1;
                thisPet.state = 'moving';
                thisPet.facing = e.data[2][0];
            }
        } else {
            // pathfinding returned from Worker:
            var thisNPC = null;
            for (var m = 0; m < visibleMaps.length; m++) {

                for (var i = 0; i < thisMapData[(visibleMaps[m])].npcs.length; i++) {
                    //   console.log("checking "+thisMapData[(visibleMaps[m])].npcs[i].name+" is = "+thisAgentsName);
                    if (thisMapData[(visibleMaps[m])].npcs[i].name == thisAgentsName) {
                        thisNPC = thisMapData[(visibleMaps[m])].npcs[i];
                        //console.log(thisNPC);
                    }
                }
            }

            if (thisNPC != null) {
                //     console.log(JSON.parse(JSON.stringify(thisMapData.npcs[thisNPCsIndex].movement)));
                // insert the new path:
                // http://stackoverflow.com/a/7032717/1054212
        
                thisNPC.movement.splice.apply(thisNPC.movement, [thisNPC.movementIndex + 2, 0].concat(e.data[1]));
                   // console.log(JSON.parse(JSON.stringify(thisNPC.movement)));
                 console.log(thisNPC.movementIndex);
                    
              //  console.log((e.data[1]));

                thisNPC.waitingForAPath = false;
                if (typeof e.data[2] !== "undefined") {
                    // store the target tile so it doesn't try and go straight back to it after:
                    thisNPC.lastTargetDestination = e.data[2];
                }
            }
        }
    }
}