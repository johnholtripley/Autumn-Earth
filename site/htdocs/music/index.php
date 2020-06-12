<?php


include($_SERVER['DOCUMENT_ROOT']."/includes/session.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/functions.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/header.php");
?>


<!-- https://paulrosen.github.io/abcjs/ /-->
<script src="/js/third-party/abcjs_basic_5.12.0.js"></script>


<div class="row">

	<div class="column"><h1>Music</h1>
<p><a href="/music/archive/">ABC format archive</a></p>

<h4>To do:</h4>
	<ul>
	<li>upload abc file</li>
	<li>drag abc file</li>
	<li>preview abc with chosen instrument - list all folders within instruments folder</li>
	<li>tidy up code</li>
	<li>Allow player to delete their transcribed files</li>
    <li>be nice for the archive to have preview mp3 features</li>
</ul>





<fieldset>
    <textarea id="abcTextInput" style="width: 400px;height: 360px;"></textarea>
    <button id="startTranscription">Transcribe</button>
    <div id="transcriptionResponse"></div>
</fieldset>

<p>Thanks to <a href="https://paulrosen.github.io/abcjs">https://paulrosen.github.io/abcjs</a></p>



<script>



function postData(url, data, successHandler, errorHandler) {
  
    var xhr = typeof XMLHttpRequest != 'undefined' ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
    xhr.open('post', url, true);
       xhr.onreadystatechange = function() {
        var status;
        var data;
        if (xhr.readyState == 4) { 
              status = xhr.status;
            var wasParsedOk = true;
            if (status == 200) {
                try {
                    data = JSON.parse(xhr.responseText);
                } catch (e) {
                    wasParsedOk = false;
                    errorHandler && errorHandler(status);
                }
                if (wasParsedOk) {
                    successHandler && successHandler(data);
                }
            } else {
                errorHandler && errorHandler(status);
            }
        }
    };
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;');
    xhr.send(data);
}



var transcriptionOutput = [];
var transcriptionTitle = '';
var characterId = 999;
var jsonOutput;

function convertMidiNumber(midiNumber) {
/* midi note 60 = middle c (C4) */
/* Lotro samples are c2 to c5 (midi 36 to 72) - needs adjusting? */
/* my samples start at C3 which is midi note 48 */
return midiMap[(midiNumber-48)];
}


/*
var abcfile = 'X:1\nT:Brandywine Bridge\nC:Composer:\nN:Remarks:\nQ:1/4=120\nV:1\nM:4/4\nL:1/8\nK:F\ne3 f ed \nc2 |B2 d2 c3 z |GB c2 BG F2 |D2 EF G2 G2\nz2 cd cd e2 |c2 f2 ed c2 |z2 fe c2 fe |f g3 g4 |]';
var abcfile = "X:1 %Music\nT:Concerning Hobbits \nC:Composer: \nN:Remarks:\nQ:1/4=104 \nM:4/4 %Meter\nL:1/8 %\nK: D\nd/e/f z2 z f z f |ae de z4 |A/B/c z c cd z B |F2 z A E2 z2 |z4 A2c2 |\nd/e/f z f z2 z a/ z/ |fe z d ec z d/c/ |B8 |d3 c c3 B |F3 G/F/ E3 D/F/ |z F/G/ | E4 |\nc/d/e z2 z e z e |gd cd z4 |G/A/B z B Bc z A |E2 z G D2 z2 |\nz4 G2B2 |c/d/e z e z2 z g/ z/ |ed z c dB z c/B/ |A8 |\nc3 B B3 A |E3 F/E/ D3 C/E/ | z E/F/ | D4 |\nc/d/e z2 z e z e |gd cd z4 |G/A/B z B Bc z A |E2 z G D2 z2 |\nz4 G2B2 |c/d/e z e z2 z g/ z/ |ed z c dB z c/B/ |A8 |\nc3 B B3 A |E3 F/E/ D3 C/E/ | z E/F/ | D4 |\nd/e/f z2 z f z f |ae de z4 |A/B/c z c cd z B |F2 z A E2 z2 |z4 A2c2 |\nd/e/f z f z2 z a/ z/ |fe z d ec z d/c/ |B8 |d3 c c3 B |F3 G/F/ E3 D/F/ |z F/G/ | E4 |\nc/d/e z2 z e z e |gd cd z4 |G/A/B z B Bc z A |E2 z G D2 z2 |\nz4 G2B2 |c/d/e z e z2 z g/ z/ |ed z c dB z c/B/ |A8 |\nc3 B B3 A |E3 F/E/ D3 C/E/ | z E/F/ | D4 |\nc/d/e z2 z e z e |gd cd z4 |G/A/B z B Bc z A |E2 z G D2 z2 |\nz4 G2B2 |c/d/e z e z2 z g/ z/ |ed z c dB z c/B/ |A8 |\nc3 B B3 A |E3 F/E/ D3 C/E/ | z E/F/ | D4 |\nd/e/f z2 z f z f |ae de z4 |A/B/c z c cd z B |F2 z A E2 z2 |z4 A2c2 |";
*/
var midiMap = ["c3-c","c3-cs","c3-d","c3-ds","c3-e","c3-f","c3-fs","c3-g","c3-gs","c3-a","c3-as","c3-b","c4-c","c4-cs","c4-d","c4-ds","c4-e","c4-f","c4-fs","c4-g","c4-gs","c4-a","c4-as","c4-b","c5-c","c5-cs","c5-d","c5-ds","c5-e","c5-f","c5-fs","c5-g","c5-gs","c5-a","c5-as","c5-b","c6-c"];

function startTranscription() {
    /* remove any blank lines - https://stackoverflow.com/questions/16369642/javascript-how-to-use-a-regular-expression-to-remove-blank-lines-from-a-string */
    /* replace double quotes with single as well: */
transcribeABC(document.getElementById('abcTextInput').value.replace(/"/g, "'").replace(/^\s*[\r\n]/gm, ""));
/*console.log(document.getElementById('abcTextInput').value);*/
/*transcribeABC(abcfile);*/


 postData('/game-world/generateTranscriptionObject.php', 'chr=' + characterId + '&transcription=' + jsonOutput, function(data) {
        if (data.success) {
            document.getElementById('transcriptionResponse').innerHTML = '<p>File successfully converted and saved - '+data.filename+'</p><p><a href="/game-world/generateSong.php?chr=999&instrument=lotro-lute&song='+data.songname+'">Listen to lute mp3</a></p>';
        } else {
            document.getElementById('transcriptionResponse').innerHTML = "failed, please try again";
            /* let user try again ######## */
        }
    }, function(status) {
       document.getElementById('transcriptionResponse').innerHTML = "failed, please try again";
    });

}

function transcribeABC(abcfile) {
var visualObj = ABCJS.renderAbc("*", abcfile)[0];
var synthControl = new ABCJS.synth.SynthController();
/*synthControl.load("#audio", null, {displayRestart: false, displayPlay: false, displayProgress: false});*/
synthControl.setTune(visualObj, true);

 jsonOutput = '{"title":"'+transcriptionTitle+'","timeCreated":"'+Date.now()+'","content":[';
for (var i=0;i<transcriptionOutput.length;i++) {
	var thisNoteMapping = convertMidiNumber(transcriptionOutput[i][1]);
	/* convert 60 to c4-c etc ###### */
	jsonOutput += '['+transcriptionOutput[i][0]+', "'+thisNoteMapping+'"]';
	if(i != (transcriptionOutput.length-1)) {
jsonOutput += ',';
	} 
}
jsonOutput += ']}';

/*document.getElementById('transcriptionOutput').innerHTML = jsonOutput;*/
}
 
document.getElementById('startTranscription').onclick = startTranscription;


 /* transcribeABC(abcfile); */
</script>




</div>
</div>







<?php
include($_SERVER['DOCUMENT_ROOT']."/includes/footer.php");
?>
