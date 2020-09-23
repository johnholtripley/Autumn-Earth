var magic = {
    heroCast: function() {
        if (hero.currentStateAnimation != 'cast') {
            var activeSound = audio.playSound(soundEffects['cast-summon'], 0);
            hero.animationWaitingTimer = currentAnimationFrame;

            changeHeroState('cast');
            // number of frames to trigger the callback, and then the callback function name
            // (don't use animation frame end, as the action will have visually completed and then there's an animated reset after)
            hero.animationCallback = [62, "magic.heroCastComplete", activeSound];
           
        }
    },

    heroCastComplete: function() {
        console.log("cast complete");
    },

    heroDraw: function() {
        if (hero.currentStateAnimation != 'draw') {
            var activeSound = audio.playSound(soundEffects['draw-energy'], 0);
            hero.animationWaitingTimer = currentAnimationFrame;
            
            changeHeroState('draw');
            hero.animationCallback = [52, "magic.heroDrawComplete", activeSound];
        }
    },

    heroDrawComplete: function() {
        console.log("draw complete");
    }
}