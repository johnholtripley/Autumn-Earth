var magic = {
     heroCast: function() {
          audio.playSound(soundEffects['cast-summon'], 0);
        hero.currentStateAnimation = 'cast';
        // save currentAnimationFrame so this can start at frame 1
        // need callback on animation end
        // ###ss
     },
     heroDraw: function () {
        audio.playSound(soundEffects['draw-energy'], 0);
        hero.currentStateAnimation = 'draw';
     }
}