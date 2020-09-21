var magic = {
     heroCast: function() {
        hero.currentStateAnimation = 'cast';
        // save currentAnimationFrame so this can start at frame 1
        // need callback on animation end
        // ###ss
     },
     heroDraw: function () {
        hero.currentStateAnimation = 'draw';
     }
}