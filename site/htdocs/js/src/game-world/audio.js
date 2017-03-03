var audioContext = null;
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

    playSound: function(buffer, delay) {
        var source = audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(audioContext.destination);
        if (!source.start) {
            source.start = source.noteOn;
        } else {
            source.start(delay);
        }
    }
}
