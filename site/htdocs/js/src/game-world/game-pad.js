function checkForGamePadInput() {
    if (Input.isUsingGamePad) {
        // added these next 3 lines to prevent occassional errors in Chrome:
        if (typeof Input.gamePad !== "undefined") {
            if (Input.gamePad !== null) {
                if (typeof Input.gamePad.timestamp !== "undefined") {
                    // check if an update has happened since the last one that was acted on:
                    if (Input.gamePad.timestamp != Input.gameLastPadTimeStamp) {
                        Input.gameLastPadTimeStamp = Input.gamePad.timestamp;
                        // left:
                        key[0] = Input.gamePad.axes[1] <= -0.5;
                        // right:
                        key[1] = Input.gamePad.axes[1] >= 0.5;
                        // up: 
                        key[2] = Input.gamePad.axes[2] <= -0.5;
                        // down:
                        key[3] = Input.gamePad.axes[2] >= 0.5;
                        // action (X):
                        key[4] = Input.gamePad.buttons[2].value > 0;
                        // shift (right shoulder 1):
                        key[5] = Input.gamePad.buttons[7].value > 0;
                    }
                }
            }
        }
    }
}