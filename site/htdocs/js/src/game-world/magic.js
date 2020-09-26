var magic = {
    heroCast: function() {
        if (hero.currentStateAnimation != 'cast') {
            var activeSound = audio.playSound(soundEffects['cast-summon'], 0);
            changeHeroState('cast', 62, "magic.heroCastComplete", activeSound, true);
        }
    },

    heroCastComplete: function() {
        console.log("cast complete");
    },

    heroDraw: function() {
        if (hero.currentStateAnimation != 'draw') {
            var activeSound = audio.playSound(soundEffects['draw-energy'], 0);
            changeHeroState('draw', 52, "magic.heroDrawComplete", activeSound, true);
        }
    },

    heroDrawComplete: function() {
        console.log("draw complete");
    }
}