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
        if (music.isTranscribing) {
            music.currentTranscriptionStartTime = performance.now();
        }
    },
    exitMusicMode: function() {
        music.currentInstrument = '';
        music.isTranscribing = false;
        music.isPlayingBackTranscription = false;
    },
    playCurrentInstrumentNote: function(whichNote) {
        if (music.isTranscribing) {
            music.currentTranscription.push([(performance.now() - music.currentTranscriptionStartTime), whichNote]);
        }
        audio.playSound(soundEffects[music.currentInstrument + '-' + whichNote], 0);
    },
    checkKeyPresses: function() {
        if (key[17]) {
            music.playCurrentInstrumentNote('c5-c');
        }
        if (key[18]) {
            music.playCurrentInstrumentNote('c5-d');
        }
        if (key[19]) {
            music.playCurrentInstrumentNote('c5-e');
        }
        if (key[20]) {
            music.playCurrentInstrumentNote('c5-f');
        }
        if (key[21]) {
            music.playCurrentInstrumentNote('c5-g');
        }
        if (key[22]) {
            music.playCurrentInstrumentNote('c5-a');
        }
        if (key[23]) {
            music.playCurrentInstrumentNote('c5-b');
        }
        if (key[24]) {
            music.playCurrentInstrumentNote('c6-c');
        }
    },
    startplayBackTranscription: function(transcription, whichInstrument) {
        music.playbackTranscriptionStartTime = performance.now();
        music.activePlayBackTranscription = transcription;
        music.isPlayingBackTranscription = true;
        music.isTranscribing = false;
        // 'lute-lotro':
        music.currentInstrument = whichInstrument;
    },
    playBackTranscription: function() {
        if (music.activePlayBackTranscription.length > 0) {
            if ((performance.now() - music.playbackTranscriptionStartTime) >= music.activePlayBackTranscription[0][0]) {
                music.playCurrentInstrumentNote(music.activePlayBackTranscription[0][1]);
                music.activePlayBackTranscription.shift();
            }
        } else {
            music.currentInstrument = '';
            music.isPlayingBackTranscription = false;
        }
    }
}