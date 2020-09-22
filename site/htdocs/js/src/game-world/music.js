const music = {
    currentInstrument: '',
    isTranscribing: false,
    currentTranscriptionStartTime: '',
    currentTranscription: [],
    isPlayingBackTranscription: false,
    activePlayBackTranscription: [],
    playbackTranscriptionStartTime: '',
    notesToLoad: ["c3-a", "c3-as", "c3-b", "c3-c", "c3-cs", "c3-d", "c3-ds", "c3-e", "c3-f", "c3-fs", "c3-g", "c3-gs", "c4-a", "c4-as", "c4-b", "c4-c", "c4-cs", "c4-d", "c4-ds", "c4-e", "c4-f", "c4-fs", "c4-g", "c4-gs", "c5-a", "c5-as", "c5-b", "c5-c", "c5-cs", "c5-d", "c5-ds", "c5-e", "c5-f", "c5-fs", "c5-g", "c5-gs", "c6-c"],
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
        var whichOctave = 4;
        if (key[5]) {
            // shift:
            whichOctave = 3;
        }
        if (key[25]) {
            // ctrl:
            whichOctave = 5;
        }
        if (key[17]) {
            music.playCurrentInstrumentNote('c' + whichOctave + '-c');
            key[17] = 0;
        }
        if (key[18]) {
            music.playCurrentInstrumentNote('c' + whichOctave + '-d');
            key[18] = 0;
        }
        if (key[19]) {
            music.playCurrentInstrumentNote('c' + whichOctave + '-e');
            key[19] = 0;
        }
        if (key[20]) {
            music.playCurrentInstrumentNote('c' + whichOctave + '-f');
            key[20] = 0;
        }
        if (key[21]) {
            music.playCurrentInstrumentNote('c' + whichOctave + '-g');
            key[21] = 0;
        }
        if (key[22]) {
            music.playCurrentInstrumentNote('c' + whichOctave + '-a');
            key[22] = 0;
        }
        if (key[23]) {
            music.playCurrentInstrumentNote('c' + whichOctave + '-b');
            key[23] = 0;
        }
        if (key[24]) {
            music.playCurrentInstrumentNote('c' + (whichOctave + 1) + '-c');
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
        if (music.currentTranscription.length > 0) {
            // create item:
            var transcriptionObject = {
                "type": 114,
                "inscription": {
                    "title": transcriptionTitle.value,
                    "timeCreated": Date.now(),
                    "content": music.currentTranscription
                }
            }
            transcriptionObject = prepareInventoryObject(transcriptionObject);
            inventoryCheck = canAddItemToInventory([transcriptionObject]);
            if (inventoryCheck[0]) {
                UI.showChangeInInventory(inventoryCheck[1]);
            } else {
                // post it:
                var subjectLine = "Your transcription of '" + transcriptionTitle.value + "'";
                var message = "Beautifully composed";
                var whichNPC = "Taliesin the bard";
                sendNPCPost('{"subject":"' + subjectLine + '","message":"' + message + '","senderID":"-1","recipientID":"' + characterId + '","fromName":"' + whichNPC + '"}', [transcriptionObject]);
                UI.showNotification("<p>My transcription is in the post</p>");
            }
            // create a copy in the hero's transcribed folder so it can be copied later:
            postData('/game-world/generateTranscriptionObject.php', 'chr=' + characterId + '&transcription=' + JSON.stringify(transcriptionObject['inscription']));
        }
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