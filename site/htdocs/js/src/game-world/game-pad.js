function checkForGamePadInput() {
    if (Input.hasGamePadSupport) {
        key[0] = Input.gamePad.axes[1] <= -0.5 // left
        key[1] = Input.gamePad.axes[1] >= 0.5 // right
        key[2] = Input.gamePad.axes[2] <= -0.5 // up
        key[3] = Input.gamePad.axes[2] >= 0.5 // down
        key[4] = Input.gamePad.buttons[2].value > 0
    }
}