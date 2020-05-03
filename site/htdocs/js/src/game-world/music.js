const music = {
    currentInstrument: '',
    notesToLoad: ["c5-c", "c5-d", "c5-e", "c5-f", "c5-g", "c5-a", "c5-b", "c6-c"],
    loadInstrumentSounds: function(whichInstrument) {
        for (var i = 0; i < music.notesToLoad.length; i++) {
            loadAudioBuffer('../music/instruments/' + whichInstrument + '/' + music.notesToLoad[i] + '.mp3', whichInstrument+"-"+music.notesToLoad[i]);
        }
    },
    enterMusicMode: function(whichInstrument) {
        music.currentInstrument = whichInstrument;
    },
    exitMusicMode: function() {
        music.currentInstrument = '';
    }
}