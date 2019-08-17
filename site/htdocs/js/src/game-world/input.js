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
                //   Input.gamePad = navigator.getGamepads()[0];

            });
            window.addEventListener("gamepaddisconnected", function(e) {
                Input.isUsingGamePad = false;
                //  Input.gamePad = null;
            });
        }

        if ("ontouchstart" in document.documentElement) {
            Input.initTouchEvents();
        }


    },

    // called on key up and key down events
    changeKey: function(e, to, type) {
        var focussedTagType = document.activeElement.tagName;
        var isContentEditable = document.activeElement.hasAttribute('contenteditable');
        // don't react to key presses if the currently focussed element is an input:
        if ((focussedTagType != "INPUT") && (focussedTagType != "TEXTAREA") && (focussedTagType != "SELECT") && (!isContentEditable)) {
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
                case KeyBindings.toggleUI:
                    key[7] = to;
                    break;
                case KeyBindings.toggleJournal:
                    key[8] = to;
                    break;
                case KeyBindings.toggleToolLeft:
                    key[9] = to;
                    break;
                case KeyBindings.toggleToolRight:
                    key[10] = to;
                    break;
                case KeyBindings.printScreen:
                    // action should only be on key Up:
                    key[11] = 0;
                    if (type === "up") {
                        key[11] = 1;
                    }
                    break;
            }
        }
    },
    initTouchEvents: function() {
        /*
        document.body.addEventListener("touchstart", function(e) {
            // startPointX = e.touches[0].pageX;
            // startPointY = e.touches[0].pageY;
        }, false);
        */
        document.body.addEventListener("touchmove", function(e) {
            // ignore multiple touches etc:
            if (e.touches.length > 1 || e.scale && e.scale !== 1) {
                return;
            }
            // stop the map being dragged (needs the passive: false to work):
            e.preventDefault();
            //   deltaX = e.touches[0].pageX - startPointX;
            // console.log("drag: client: " + e.touches[0].clientX + ", " + e.touches[0].clientY);
            moveHeroTowards(e.touches[0].clientX, e.touches[0].clientY);
        }, { passive: false });
        document.body.addEventListener("touchend", function(e) {
            //    console.log("tap: client: " + e.changedTouches[0].clientX + ", " + e.changedTouches[0].clientY);


            // check if was dragging, and if so:
            key[0] = false;
            key[1] = false;
            key[2] = false;
            key[3] = false;
            key[5] = false;
        }, false);
    }
}