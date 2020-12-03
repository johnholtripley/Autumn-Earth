var audioContext = null;
var soundGainNode;
//var musicGainNode;
var soundEffects = {};
var soundsToLoad = {
    'coins': '../sounds/coins-NOT_MINE-wow.mp3',
    'bookOpen': '../sounds/book-open-NOT_MINE-wow.mp3',
    'chestOpen': '../sounds/chest-open-NOT_MINE-wow.mp3',
    'bagOpen': '../sounds/bag-open-NOT_MINE-wow.mp3',
    'buttonClick': '../sounds/button-press-NOT_MINE-wow.mp3',
    'hen': '../sounds/hen-NOT_MINE.mp3',
    'horse': '../sounds/horse-NOT_MINE.mp3',
    'doe': '../sounds/doe-NOT_MINE.mp3',
    'lever': '../sounds/lever-NOT_MINE.mp3',
    'keys': '../sounds/keys-NOT_MINE-wow.mp3',
    'unlock': '../sounds/unlock-NOT_MINE-wow.mp3',
    'gather1': '../sounds/gather-herb-NOT_MINE-wow.mp3',
    'gather4': '../sounds/mining-NOT_MINE-wow.mp3',
    'rain': '../sounds/rain-NOT_MINE-youtube.mp3',
    'questComplete': '../sounds/quest-complete-NOT_MINE-wow.mp3',
    'dyeing': '../sounds/dyeing-NOT_MINE-wow.mp3',
    'weaving': '../sounds/tailoring-NOT_MINE.mp3',
    'pouring': '../sounds/pour-water-NOT_MINE.mp3',
    'digging': '../sounds/digging-NOT_MINE.mp3',
    'cardCraft': '../sounds/craft-card-NOT_MINE-hearthstone.mp3',
    'foundChest': '../sounds/found-treasure-NOT_MINE-wow.mp3',
    'splash': '../sounds/water-splash-NOT_MINE-fesliyanstudios.mp3',
    'whistle': '../sounds/whistle-NOT_MINE-wow.mp3',
    'Small hawk': '../sounds/hawk-NOT_MINE-wow.mp3',
    'draw-energy': '../sounds/cast-spell-NOT_MINE-wow.mp3',
    'cast-summon': '../sounds/cast-summon-NOT_MINE-wow.mp3',
    'bees': '../sounds/bee-loop-NOT_MINE-youtube.mp3'
};

subtitles.audio = {
    'coins': 'Coins clink',
    'bookOpen': 'A book\'s pages rustle',
    'chestOpen': 'A rusty chest opens',
    'bagOpen': 'A bug rustles',
    'buttonClick': '',
    'hen': 'A hen clucks',
    'horse': 'A horse neighs',
    'doe': 'A doe calls out',
    'lever': 'A switch clanks',
    'keys': 'Some keys clink',
    'unlock': 'A lock turns',
    'gather1': '',
    'gather4': '',
    'rain': 'Raindrops fall',
    'questComplete': 'A fanfare plays',
    'dyeing': 'A cauldron bubbles',
    'weaving': 'Cloth is moved gently',
    'pouring': 'Some water pours',
    'digging': 'Earth is being dug',
    'cardCraft': 'A game card is formed',
    'foundChest': 'A chest is unearthed',
    'splash': 'Water splashes',
    'whistle': 'Someone whistles',
    'Small hawk': 'A hawk calls out',
    'draw-energy': 'Mystical energy is drawn from the earth',
    'cast-summon': 'Powerful magical energy is released',
    'bees': 'Bees hum',
    'seagull': 'A gull calls out',
    'birdSong': 'A bird sings',
    'birdChirrup': 'A bird chirrups'
}


var loadAudioBuffer = function(url, name) {
    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";
    request.onload = function() {
        audioContext.decodeAudioData(
            request.response,
            function(buffer) {
                if (!buffer) {
                    console.log('error decoding file data: ' + url);
                    return;
                }
                soundEffects[name] = [buffer, name];
            },
            function(error) {
                console.log('decodeAudioData error', error);
            }
        );
    }
    request.onerror = function() {
        console.log('audio XHR error');
    }
    request.send();
};



var audio = {
    lastTrack: "",
    playingHourChime: false,
    proximitySounds: [],
    init: function() {
        try {
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            audioContext = new AudioContext();
            soundGainNode = audioContext.createGain();
            soundGainNode.connect(audioContext.destination);
            for (var name in soundsToLoad) {
                loadAudioBuffer(soundsToLoad[name], name);
            }
        } catch (e) {
            // web audio API not supported
        }
    },

    initMusic: function(songName) {
        audio[songName] = new Audio();
        audio[songName].id = songName;
        var src = document.createElement("source");
        src.type = "audio/mpeg";
        src.src = "/music/game-world/" + songName + ".mp3";
        audio[songName].appendChild(src);
        audio[songName + 'Gain'] = audioContext.createGain();
        // get this from the settings:      

        audio[songName + 'Source'] = audioContext.createMediaElementSource(audio[songName]);
        audio[songName + 'Source'].connect(audio[songName + 'Gain']);
        audio[songName + 'Gain'].connect(audioContext.destination);
        audio[songName].addEventListener("ended", audio.removeMusic, false);
    },

    removeMusic: function(e) {
        var songName = e.target.id;
        audio[songName].removeEventListener("ended", audio.removeMusic, false);
        delete audio[songName];
        delete audio[songName + 'Source'];
        delete audio[songName + 'Gain'];
        if (audio.activeTrack == songName) {
            audio.activeTrack = undefined;
        }
    },

    playSound: function(buffer, delay, numberToPlay = 0, volumeAdjustment) {
        if(gameSettings.showSubtitles) {
            // needs to be delayed if a delay is set ##
            UI.showSubtitle(subtitles.audio[buffer[1]]);
        }
        var source = audioContext.createBufferSource();
        source.buffer = buffer[0];
        source.numberToPlay = numberToPlay;
        if (typeof volumeAdjustment !== "undefined") {
            // don't use 100% of the main sound volume:
            // volumeAdjustment will be in the range 0 - 1
            var variableVolumeSoundGainNode = audioContext.createGain();
            variableVolumeSoundGainNode.gain.value = gameSettings.soundVolume * volumeAdjustment;
            variableVolumeSoundGainNode.connect(audioContext.destination);
            source.connect(variableVolumeSoundGainNode);
        } else {
            // use the main gain volume:
            source.connect(soundGainNode);
        }
        if (numberToPlay > 1) {
            source.addEventListener('ended', function soundEnded(e) {
                if (this.numberToPlay > 1) {
                    audio.playSound(this.buffer, 0, this.numberToPlay - 1);
                }
                // remove this event listener:
                return e.currentTarget.removeEventListener('ended', soundEnded, false);
            }, false);
        }
        if (!source.start) {
            source.start = source.noteOn;
        } else {
            source.start(delay);
        }
        return source;
    },

    playProximitySound: function(buffer) {
        var source = audioContext.createBufferSource();
        if(gameSettings.showSubtitles) {
            // needs to be delayed if a delay is set ##
            UI.showSubtitle(subtitles.audio[buffer[1]]);
        }
        source.buffer = buffer[0];
        var variableVolumeSoundGainNode = audioContext.createGain();
        variableVolumeSoundGainNode.gain.value = gameSettings.soundVolume;
        variableVolumeSoundGainNode.connect(audioContext.destination);
        source.connect(variableVolumeSoundGainNode);
        source.addEventListener('ended', function soundEnded(e) {
            var proximityAudioGain;

            // find the existing entry:
            for (var i = 0; i < audio.proximitySounds.length; i++) {
                if (this.buffer == buffer) {
                    // recreate the buffer and update the array with the new one:
                    proximityAudioGain = audio.playProximitySound(this.buffer);
                    proximityAudioGain.gain.value = gameSettings.soundVolume * getTileProximityScale(hero.tileX, hero.tileY, audio.proximitySounds[i][1], audio.proximitySounds[i][2]);
                    audio.proximitySounds[i][0] = proximityAudioGain;
                    break;
                }
            }

            // remove this event listener:
            return e.currentTarget.removeEventListener('ended', soundEnded, false);
        }, false);
        if (!source.start) {
            source.start = source.noteOn;
        } else {
            source.start(0);
        }
        return variableVolumeSoundGainNode;
    },


    playMusic: function(newTrack) {
        if (typeof audio.activeTrack !== "undefined") {
            if (audio.activeTrack != newTrack) {

                audio.initMusic(newTrack);
                var fadeTime = 6;
                var currentTime = audioContext.currentTime;
                // fade current out:
                audio[audio.activeTrack + 'Gain'].gain.linearRampToValueAtTime(gameSettings.musicVolume, currentTime);
                audio[audio.activeTrack + 'Gain'].gain.linearRampToValueAtTime(0, currentTime + fadeTime);
                // fade new in:
                audio[newTrack + 'Gain'].gain.linearRampToValueAtTime(0, 0);
                audio[newTrack + 'Gain'].gain.linearRampToValueAtTime(gameSettings.musicVolume, fadeTime);
                audio[newTrack].play();
                audio.activeTrack = newTrack;
                audio.lastTrack = newTrack;
            }

        } else {
            // make sure it wasn't just played:
            if (newTrack != audio.lastTrack) {
                // nothing playing currently:
                audio.initMusic(newTrack);
                audio[newTrack].play();
                audio.activeTrack = newTrack;
                audio.lastTrack = newTrack;
                // set initial volume to match settings:
                audio[audio.activeTrack + 'Gain'].gain.setValueAtTime(gameSettings.musicVolume, audioContext.currentTime);
            }
        }
    },

    fadeOutMusic: function(whichTrack, fadeTime) {


        if (typeof audio[whichTrack] !== undefined) {
            //  audio[whichTrack].pause();

            var currentTime = audioContext.currentTime;
            audio[whichTrack + 'Gain'].gain.linearRampToValueAtTime(gameSettings.musicVolume, currentTime);
            audio[whichTrack + 'Gain'].gain.linearRampToValueAtTime(0, currentTime + fadeTime);
            audio[whichTrack].removeEventListener("ended", audio.removeMusic, false);
            audio.lastTrack = '';
            audio.activeTrack = undefined;
            delete audio[whichTrack];
            delete audio[whichTrack + 'Source'];
            delete audio[whichTrack + 'Gain'];
        }
    },

    adjustEffectsVolume: function() {
        gameSettings.soundVolume = soundVolume.value;
        if (typeof soundGainNode !== "undefined") {
            soundGainNode.gain.setValueAtTime(gameSettings.soundVolume, 0);
        }
    },

    adjustMusicVolume: function() {
        gameSettings.musicVolume = musicVolume.value;
        if (typeof audio.activeTrack !== "undefined") {
            audio[audio.activeTrack + 'Gain'].gain.setValueAtTime(gameSettings.musicVolume, audioContext.currentTime);
        }
    },

    loadAmbientSounds: function(soundsToLoad) {
        for (var soundName in soundsToLoad) {
            console.log(soundName);
            loadAudioBuffer(soundsToLoad[soundName], soundName);
        }
    },

    checkForAmbientSounds: function() {
        var combinedVisbleAmbientSounds = [];
        for (var m = 0; m < visibleMaps.length; m++) {
            if (thisMapData[visibleMaps[m]].ambientSounds) {
                for (var thisSound in thisMapData[visibleMaps[m]].ambientSounds) {
                    if (!(thisSound in combinedVisbleAmbientSounds)) {
                        combinedVisbleAmbientSounds[thisSound] = thisMapData[visibleMaps[m]].ambientSounds[thisSound];
                    }
                }
            }
        }
        if ((hero.totalGameTimePlayed - timeSinceLastAmbientSoundWasPlayed) > minTimeBetweenAmbientSounds) {
            if (getRandomIntegerInclusive(1, 240) == 1) {
                timeSinceLastAmbientSoundWasPlayed = hero.totalGameTimePlayed;
                audio.playSound(soundEffects[getRandomKeyFromObject(combinedVisbleAmbientSounds)], 0);
            }
        }
        for (var m = 0; m < visibleMaps.length; m++) {
            if (thisMapData[visibleMaps[m]].hourChime) {
                var now = new Date();
                if (now.getMinutes() < 1) {
                    if (!audio.playingHourChime) {
                        audio.playingHourChime = true;
                        audio.playSound(soundEffects["hourChime"], 0, keepWithinRange(now.getHours(), 1, 12));
                    }
                } else {
                    audio.playingHourChime = false;
                }
            }
        }
    }
}