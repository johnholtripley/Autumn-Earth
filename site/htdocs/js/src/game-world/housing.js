var housingNameSpace = {
    update: function() {
        if (key[12]) {
            // escape - cancel
            if (gameMode == 'housing') {
                gameMode = "play";
            }
            key[12] = false;
        }
    }
}