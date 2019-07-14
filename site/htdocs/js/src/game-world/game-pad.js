function checkForGamePadInput() {
    if (Input.isUsingGamePad) {
        // added these next 3 lines to prevent occassional errors in Chrome:
        //if (typeof navigator.getGamepads()[0] !== "undefined") {
          //  if (navigator.getGamepads()[0] !== null) {
            //    if (typeof navigator.getGamepads()[0].timestamp !== "undefined") {
                    // check if an update has happened since the last one that was acted on:
                    if (navigator.getGamepads()[0].timestamp != Input.gameLastPadTimeStamp) {
                        // chrome needs the full navigator method to get the updated details, not a reference
                        Input.gameLastPadTimeStamp = navigator.getGamepads()[0].timestamp;
                        // left:
                        key[0] = navigator.getGamepads()[0].axes[0] <= -0.5;
                        // right:
                        key[1] = navigator.getGamepads()[0].axes[0] >= 0.5;
                        // up: 
                        key[2] = navigator.getGamepads()[0].axes[1] <= -0.5;
                        // down:
                        key[3] = navigator.getGamepads()[0].axes[1] >= 0.5;
                        // action (X):
                        key[4] = navigator.getGamepads()[0].buttons[2].value > 0;
                        // shift (right shoulder 1):
                        key[5] = navigator.getGamepads()[0].buttons[7].value > 0;
                    }
                }
         //   }
     //   }
 //   }
}