const Input = {
    isUsingGamePad: false,
    gamePad: null,
    gameLastPadTimeStamp: null,
    init: function() {
        // Set up the keyboard events
        document.addEventListener('keydown', function(e) { Input.changeKey(e, 1, "down") });
        document.addEventListener('keyup', function(e) { Input.changeKey(e, 0, "up") });


        if (navigator.getGamepads || navigator.getGamepads()) {

            window.addEventListener("gamepadconnected", function() {
                Input.isUsingGamePad = true;
                Input.gamePad = navigator.getGamepads()[0];
            });
            window.addEventListener("gamepaddisconnected", function(e) {
                Input.isUsingGamePad = false;
                Input.gamePad = null;
            });
        }


    },

    // called on key up and key down events
    changeKey: function(e, to, type) {
        switch (e.keyCode) {
            case KeyBindings.left:
                // prevent the page from scrolling:
                e.preventDefault();
                key[0] = to;
                break;
            case KeyBindings.up:
                e.preventDefault();
                key[2] = to;
                break;
            case KeyBindings.right:
                e.preventDefault();
                key[1] = to;
                break;
            case KeyBindings.down:
                e.preventDefault();
                key[3] = to;
                break;

            case KeyBindings.action:
                // action should only be on key Up:
                key[4] = 0;
                if (type === "up") {
                    key[4] = 1;
                }
                break;
            case KeyBindings.shift:
                key[5] = to;
                break;
            case KeyBindings.challenge:
                key[6] = to;
                break;
        }
    }
}