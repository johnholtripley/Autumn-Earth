var audioContext = null;
var soundGainNode;
//var musicGainNode;
var soundEffects = {};
var soundsToLoad = {
    'coins': '../sounds/coins-NOT_MINE-wow.mp3',
    'bookOpen': '../sounds/book-open-NOT_MINE-wow.mp3',
    'bagOpen': '../sounds/bag-open-NOT_MINE-wow.mp3',
    'buttonClick': '../sounds/button-press-NOT_MINE-wow.mp3',
    'hen': '../sounds/hen-NOT_MINE.mp3'
};


var loadBuffer = function(url, name) {
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
                soundEffects[name] = buffer;
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
    init: function() {
        try {
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            audioContext = new AudioContext();
            soundGainNode = audioContext.createGain();
            soundGainNode.connect(audioContext.destination);
            for (var name in soundsToLoad) {
                loadBuffer(soundsToLoad[name], name);
            }
        } catch (e) {
            // web audio API not supported
            // fallback? 
            // ####
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
        audio[songName + 'Gain'].gain.setValueAtTime(gameSettings.musicVolume, 0);
        audio[songName + 'Source'] = audioContext.createMediaElementSource(audio[songName]);
        audio[songName + 'Source'].connect(audio[songName + 'Gain']);
        audio[songName + 'Gain'].connect(audioContext.destination);
        audio[songName].addEventListener("ended", audio.removeMusic, false);
    },

    removeMusic: function(e) {
        var songName = e.target.id;
        console.log("removing music: " + songName);
        audio[songName].removeEventListener("ended", audio.removeMusic, false);
        delete audio[songName];
        delete audio[songName + 'Source'];
        delete audio[songName + 'Gain'];
        if (audio.activeTrack == songName) {
            audio.activeTrack = undefined;
        }
    },

    playSound: function(buffer, delay) {
        console.log(buffer);
        var source = audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(soundGainNode);
        if (!source.start) {
            source.start = source.noteOn;
        } else {
            source.start(delay);
        }
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
            }
        }
    },

    adjustEffectsVolume: function() {
        gameSettings.soundVolume = soundVolume.value;
        if (typeof soundGainNode !== "undefined") {
            soundGainNode.gain.value = gameSettings.soundVolume;
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
            loadBuffer(soundsToLoad[soundName], soundName);
        }
    },

    checkForAmbientSounds: function() {
        if(thisMapData.ambientSounds) {
        if(hero.totalGameTimePlayed == 320) {


audio.playSound(soundEffects[getRandomKeyFromObject(thisMapData.ambientSounds)], 0);

        }
    }
    }
}
