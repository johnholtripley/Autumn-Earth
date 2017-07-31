function checkForGamePadInput() {
    if (Input.hasGamePadSupport) {
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