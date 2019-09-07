var housingNameSpace = {
    update: function() {
        if (key[12]) {
            // escape - cancel
            if (gameMode == 'housing') {
                gameMode = "play";
            }
            key[12] = false;
        }
    },
    toggleShowPlotFootprint: function(e) {
        console.log(e,e.target);
        if(e.target.checked) {
hero.housing.showFootprintInEditMode = true;
        } else {
            hero.housing.showFootprintInEditMode = false;
        }
        
    }
}