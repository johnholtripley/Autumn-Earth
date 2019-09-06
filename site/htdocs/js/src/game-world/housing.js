var housingNameSpace = {
    //draw: function() {
    //}
    update: function() {
        if (key[12]) {
            // escape - cancel any active actions:

            if (gameMode == 'housing') {
                gameMode = "play";
            }
            key[12] = false;
        }
    }
}