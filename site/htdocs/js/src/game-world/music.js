const music = {
    currentInstrument: '',
    notesToLoad: ["c5-c", "c5-d", "c5-e", "c5-f", "c5-g", "c5-a", "c5-b", "c6-c"],
    loadInstrumentSounds: function(whichInstrument) {
        for (var i = 0; i < music.notesToLoad.length; i++) {
            loadAudioBuffer('../music/instruments/' + whichInstrument + '/' + music.notesToLoad[i] + '.mp3', whichInstrument + "-" + music.notesToLoad[i]);
        }
    },
    enterMusicMode: function(whichInstrument) {
        music.currentInstrument = whichInstrument;
    },
    exitMusicMode: function() {
        music.currentInstrument = '';
    },
    checkKeyPresses: function() {
        if (key[17]) {
            audio.playSound(soundEffects[music.currentInstrument + '-c5-c'], 0);
        }
        if (key[18]) {
            audio.playSound(soundEffects[music.currentInstrument + '-c5-d'], 0);
        }
        if (key[19]) {
            audio.playSound(soundEffects[music.currentInstrument + '-c5-e'], 0);
        }
        if (key[20]) {
            audio.playSound(soundEffects[music.currentInstrument + '-c5-f'], 0);
        }
        if (key[21]) {
            audio.playSound(soundEffects[music.currentInstrument + '-c5-g'], 0);
        }
        if (key[22]) {
            audio.playSound(soundEffects[music.currentInstrument + '-c5-a'], 0);
        }
        if (key[23]) {
            audio.playSound(soundEffects[music.currentInstrument + '-c5-b'], 0);
        }
        if (key[24]) {
            audio.playSound(soundEffects[music.currentInstrument + '-c6-c'], 0);
        }
    }
}