
var Input = {



init: function() {
        // Set up the keyboard events
        document.addEventListener('keydown', function(e) { Input.changeKey(e.keyCode, 1) });
        document.addEventListener('keyup',    function(e) { Input.changeKey(e.keyCode, 0) });

      
    },

    // called on key up and key down events
    changeKey: function(which, to) {
        switch (which){
            case 37: key[0]=to; break; // left
            case 38: key[2]=to; break; // up
            case 39: key[1]=to; break; // right
            case 40: key[3]=to; break;// down
            case 32: key[4]=to; break; // attack (space bar)
            case 91: key[5]=to; break; // use item (cmd)
            case 88: key[6]=to; break; // start (x)
            case 90: key[7]=to; break; // select (z)
        }
    }

  

}