var audioContext = null;
var soundGainNode;
var musicGainNode;
var soundEffects = {};
var soundsToLoad = {
    'coins': '../sounds/coins-NOT_MINE-wow.mp3',
    'bookOpen': '../sounds/book-open-NOT_MINE-wow.mp3',
    'bagOpen': '../sounds/bag-open-NOT_MINE-wow.mp3',
    'buttonClick': '../sounds/button-press-NOT_MINE-wow.mp3',
    'hen': '../sounds/hen-NOT_MINE.mp3'
};


// https://www.html5rocks.com/en/tutorials/webaudio/intro/
function BufferLoader(context, urlList, callback) {
    this.context = context;
    this.urlList = urlList;
    this.onload = callback;
    this.bufferList = new Array();
    this.loadCount = 0;
}

BufferLoader.prototype.loadBuffer = function(url, index) {
    // Load buffer asynchronously
    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";
    var loader = this;
    request.onload = function() {
        // Asynchronously decode the audio file data in request.response
        loader.context.decodeAudioData(
            request.response,
            function(buffer) {
                if (!buffer) {
                    console.log('error decoding file data: ' + url);
                    return;
                }
                loader.bufferList[index] = buffer;
                if (++loader.loadCount == loader.urlList.length)
                    loader.onload(loader.bufferList);
            },
            function(error) {
                console.log('decodeAudioData error', error);
            }
        );
    }
    request.onerror = function() {
        console.log('BufferLoader: XHR error');
    }
    request.send();
}

BufferLoader.prototype.load = function() {
    for (var i = 0; i < this.urlList.length; ++i)
        this.loadBuffer(this.urlList[i], i);
}

var audio = {
    init: function() {
        try {
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            audioContext = new AudioContext();
            soundGainNode = audioContext.createGain();
            soundGainNode.connect(audioContext.destination);
            musicGainNode.createGain();
            var names = [];
            var paths = [];
            for (var name in soundsToLoad) {
                var path = soundsToLoad[name];
                names.push(name);
                paths.push(path);
            }
            bufferLoader = new BufferLoader(audioContext, paths, function(bufferList) {
                for (var i = 0; i < bufferList.length; i++) {
                    var buffer = bufferList[i];
                    var name = names[i];
                    soundEffects[name] = buffer;
                }
            });
            bufferLoader.load();
        } catch (e) {
            // web audio API not supported
            // fallback? 
            // ####
        }
    },

    initMusic: function(songName) {
        audio[songName] = new Audio();
        var src = document.createElement("source");
        src.type = "audio/mpeg";
        src.src = "/music/game-world/" + songName + ".mp3";
        audio[songName].appendChild(src);
        // Create a gain node:
        audio[songName + 'Gain'] = audioContext.createGain();
        // get this from the settings:      
        audio[songName + 'Gain'].gain.setValueAtTime(gameSettings.musicVolume,0);
        audio[songName + 'Source'] = audioContext.createMediaElementSource(audio[songName]);
        audio[songName + 'Source'].connect(audio[songName + 'Gain']);
        audio[songName + 'Gain'].connect(audioContext.destination);
    },

    playSound: function(buffer, delay) {
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
            }
        } else {
            // nothing playing currently:
            audio.initMusic(newTrack);
            audio[newTrack].play();
            audio.activeTrack = newTrack;
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
            audio[audio.activeTrack + 'Gain'].gain.setValueAtTime(gameSettings.musicVolume,audioContext.currentTime);
        }
    }
}
