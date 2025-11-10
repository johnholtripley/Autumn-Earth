
function breadthFirstSearch(thisAgent) {
    console.log("running ecology test breadth first");
    // https://www.redblobgames.com/pathfinding/tower-defense/
    // ######################
    // move this back to workerpathfinding once tested ###################
    // ######################
    var targetX = 6;
    var targetY = 6;
    // var frontier = [];
    var reached = [];
    var i, currentTileX, currentTileY, thisTile, thisTileSplit;
    const neighbours = [
        [0,1],
        [0,-1],
        [1,0],
        [-1,0]
    ];
    currentTileX = thisAgent.tileX;
    currentTileY = thisAgent.tileY;

    // don't use array keys - can't iterate in a controlled order
    frontier[currentTileX+"-"+currentTileY] = {};
    reached[currentTileX+"-"+currentTileY] = true;
    
    // console.log(frontier);

    do {
       
        frontier.shift();
        currentTileX = parseInt(thisTileSplit[0]);
        currentTileY = parseInt(thisTileSplit[1]);
        for(i = 0; i<neighbours.length; i++) {
            if(typeof reached[(currentTileX+neighbours[i][0])+"-"+(currentTileY+neighbours[i][1])] == "undefined") {
                // check valid map coords
                frontier[(currentTileX+neighbours[i][0])+"-"+(currentTileY+neighbours[i][1])] = {};
                reached[(currentTileX+neighbours[i][0])+"-"+(currentTileY+neighbours[i][1])] = true;
            } 
        }
         delete frontier[currentTileX+"-"+currentTileY];
    } while (frontier.length>0);

}





var ecology = {

    // https://www.raphkoster.com/2006/06/03/uos-resource-system/

    hungerLevel: 0,
    starvationLevel: -100,

    init: function() {
       console.log("running ecology...");
    },

    update: function() {
       
        for (var m = 0; m < visibleMaps.length; m++) {
            for (var i = 0; i < thisMapData[visibleMaps[m]].npcs.length; i++) {
                
                if(typeof thisMapData[visibleMaps[m]].npcs[i].ecology !== "undefined") {
                    thisMapData[visibleMaps[m]].npcs[i].ecology.food.current--;
                    // check if hungry
                    if(thisMapData[visibleMaps[m]].npcs[i].ecology.food.current == ecology.hungerLevel) {
                        // look for resource producing ecology.food.type using breadth first search
                        if (window.Worker) {
                            console.log(thisMapData[visibleMaps[m]].npcs[i].name+" #"+i+" searching for food");
                            //pathfindingWorker.postMessage(['breadth-first', thisMapData[visibleMaps[m]].npcs[i]]);
                            breadthFirstSearch(thisMapData[visibleMaps[m]].npcs[i]);
                        }
                    } else if(thisMapData[visibleMaps[m]].npcs[i].ecology.food.current == ecology.starvationLevel) {
                        // remove from map 
                        console.log(thisMapData[visibleMaps[m]].npcs[i].name+" #"+i+" removed");
                    }
                }
            }
        }
    }
}