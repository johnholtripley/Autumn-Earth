var Input = {
    init: function() {
        // Set up the keyboard events
        document.addEventListener('keydown', function(e) { Input.changeKey(e.keyCode, 1) });
        document.addEventListener('keyup', function(e) { Input.changeKey(e.keyCode, 0) });
    },

    // called on key up and key down events
    changeKey: function(which, to) {
        switch (which) {
            case 37:
                // left
                key[0] = to;
                break;
            case 38:
                // up
                key[2] = to;
                break;
            case 39:
                // right
                key[1] = to;
                break;
            case 40:
                // down
                key[3] = to;
                break;
            case 32:
                // space bar
                key[4] = to;
                break;
        }
    }
}
