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
                    // used to see if the ctrl key is being held down:
                    key[25] = to;
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
                case KeyBindings.escape:
                    key[12] = to;
                    break;
                case KeyBindings.cursorUp:
                    key[13] = to;
                    break;
                case KeyBindings.cursorDown:
                    key[14] = to;
                    break;
                case KeyBindings.cursorLeft:
                    key[15] = to;
                    break;
                case KeyBindings.cursorRight:
                    key[16] = to;
                    break;

                    // instrument notes:
                case KeyBindings['c']:
                    key[17] = 0;
                    // stop browser switching tabs if ctrl is held down:
                    e.preventDefault();
                    if (type === "up") {
                        key[17] = 1;
                    }
                    break;
                case KeyBindings['d']:
                    key[18] = 0;e.preventDefault();
                    if (type === "up") {
                        key[18] = 1;
                    }
                    break;
                case KeyBindings['e']:
                    key[19] = 0;e.preventDefault();
                    if (type === "up") {
                        key[19] = 1;
                    }
                    break;
                case KeyBindings['f']:
                    key[20] = 0;e.preventDefault();
                    if (type === "up") {
                        key[20] = 1;
                    }
                    break;
                case KeyBindings['g']:
                    key[21] = 0;e.preventDefault();
                    if (type === "up") {
                        key[21] = 1;
                    }
                    break;
                case KeyBindings['a']:
                    key[22] = 0;e.preventDefault();
                    if (type === "up") {
                        key[22] = 1;
                    }
                    break;
                case KeyBindings['b']:
                    key[23] = 0;e.preventDefault();
                    if (type === "up") {
                        key[23] = 1;
                    }
                    break;
                case KeyBindings['c^']:
                    key[24] = 0;e.preventDefault();
                    if (type === "up") {
                        key[24] = 1;
                    }
                    break;


            }
        }
    },
    initTouchEvents: function() {
        document.getElementById('touchTapAction').style.display = 'block';
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