






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