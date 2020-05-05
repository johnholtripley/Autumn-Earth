const music = {
    currentInstrument: '',
    isTranscribing: true,
    currentTranscriptionStartTime: '',
    currentTranscription: [],
    isPlayingBackTranscription: false,
    activePlayBackTranscription: [],
    playbackTranscriptionStartTime: '',
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
        if (music.isTranscribing) {
            music.stopTranscription();
        }
        music.isPlayingBackTranscription = false;
    },
    playCurrentInstrumentNote: function(whichNote) {
        if (music.isTranscribing) {
            if (music.currentTranscriptionStartTime == -1) {
                // this is the first note:
                music.currentTranscriptionStartTime = performance.now();
            }
            music.currentTranscription.push([(performance.now() - music.currentTranscriptionStartTime), whichNote]);
        }
        audio.playSound(soundEffects[music.currentInstrument + '-' + whichNote], 0);
    },
    checkKeyPresses: function() {
        if (key[17]) {
            music.playCurrentInstrumentNote('c5-c');
            key[17] = 0;
        }
        if (key[18]) {
            music.playCurrentInstrumentNote('c5-d');
            key[18] = 0;
        }
        if (key[19]) {
            music.playCurrentInstrumentNote('c5-e');
            key[19] = 0;
        }
        if (key[20]) {
            music.playCurrentInstrumentNote('c5-f');
            key[20] = 0;
        }
        if (key[21]) {
            music.playCurrentInstrumentNote('c5-g');
            key[21] = 0;
        }
        if (key[22]) {
            music.playCurrentInstrumentNote('c5-a');
            key[22] = 0;
        }
        if (key[23]) {
            music.playCurrentInstrumentNote('c5-b');
            key[23] = 0;
        }
        if (key[24]) {
            music.playCurrentInstrumentNote('c6-c');
            key[24] = 0;
        }
    },

    startTranscription: function() {
        music.currentTranscription = [];
        music.isTranscribing = true;
        music.currentTranscriptionStartTime = -1;
    },

    stopTranscription: function() {
        music.isTranscribing = false;
        // create item:
        console.log(music.currentTranscription);
    },

    startplayBackTranscription: function(transcription) {
        music.playbackTranscriptionStartTime = performance.now();
        music.activePlayBackTranscription = transcription;
        music.isPlayingBackTranscription = true;
        music.isTranscribing = false;
    },

    playBackTranscription: function() {
        if (music.activePlayBackTranscription.length > 0) {
            // [timestamp, note]
            if ((performance.now() - music.playbackTranscriptionStartTime) >= music.activePlayBackTranscription[0][0]) {
                music.playCurrentInstrumentNote(music.activePlayBackTranscription[0][1]);
                music.activePlayBackTranscription.shift();
            }
        } else {

            music.isPlayingBackTranscription = false;
        }
    }
}