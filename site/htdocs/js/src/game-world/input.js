var Input = {
    init: function() {
        // Set up the keyboard events
        document.addEventListener('keydown', function(e) { Input.changeKey(e.keyCode, 1, "down") });
        document.addEventListener('keyup', function(e) { Input.changeKey(e.keyCode, 0, "up") });
    },

    // called on key up and key down events
    changeKey: function(which, to, type) {
        switch (which) {
            case KeyBindings.left:
                key[0] = to;
                break;
            case KeyBindings.up:
                key[2] = to;
                break;
            case KeyBindings.right:
                key[1] = to;
                break;
            case KeyBindings.down:
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
