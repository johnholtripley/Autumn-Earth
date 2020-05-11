<?php

// use
// http://develop.ae/game-world/generateSong.php?chr=999&instrument=lotro-lute&song=concerning-hobbits


// https://github.com/falahati/PHP-MP3 
require_once("../includes/third-party/falahati-php-mp3/vendor/autoload.php"); 

//echo \falahati\PHPMP3\MpegAudio::fromFile("../music/game-world/darnassus-WoW-NOT-MINE.mp3")->getTotalDuration();
/*
Cut a MP3 file to extract a 30sec preview starting at the 10th second:

\falahati\PHPMP3\MpegAudio::fromFile("old.mp3")->trim(10, 30)->saveFile("new.mp3");
Append memory stored MP3 data to the end of a MP3 file:

\falahati\PHPMP3\MpegAudio::fromFile("old.mp3")->append(\falahati\PHPMP3\MpegAudio::fromData(base64_decode("{{BASE64-DATA}}")


$audio1 = \falahati\PHPMP3\MpegAudio::fromFile("1.mp3")->stripTags();
$audio2 = \falahati\PHPMP3\MpegAudio::fromFile("2.mp3")->stripTags();
$audio1->append($audio2)->saveFile("3.mp3");


*/





$thisCharId = $_GET['chr'];
$whichInstrument = $_GET["instrument"];
$whichSongName = $_GET["song"];

$songPath = "../data/chr".$thisCharId."/music/";

$thisSongContents = file_get_contents($songPath."/".$whichSongName.".json");
$thisSongJSON = json_decode($thisSongContents, true);



$thisInstrumentPath = '../music/instruments/'.$whichInstrument."/";

// get first note:
$thisNote = $thisSongJSON['content'][0][1];
$thisNotesDuration = $thisSongJSON['content'][1][0];
$currentAudio = \falahati\PHPMP3\MpegAudio::fromFile($thisInstrumentPath.$thisNote.".mp3")->trim(0, $thisNotesDuration/1000)->stripTags();
//$firstNoteTrimmed->saveFile("1.mp3");
//$timeSoFar = $thisNotesDuration;


// add the last note:
$thisNote = $thisSongJSON['content'][(count($thisSongJSON['content'])-1)][1];
$thisNoteAudio = \falahati\PHPMP3\MpegAudio::fromFile($thisInstrumentPath.$thisNote.".mp3")->stripTags();
$currentAudio->append($thisNoteAudio);

// loop backwards through the remaining notes (except the last):
$numberOfNotesToLoop = count($thisSongJSON['content'])-2;
for ($i=$numberOfNotesToLoop; $i>0; $i--) {
$thisNote = $thisSongJSON['content'][$i][1];

$thisNotesDuration = (($thisSongJSON['content'][($i+1)][0])-($thisSongJSON['content'][($i)][0]));
//$timeSoFar += $thisNotesDuration;
$thisNoteAudio = \falahati\PHPMP3\MpegAudio::fromFile($thisInstrumentPath.$thisNote.".mp3")->trim(0, $thisNotesDuration/1000)->stripTags();
$currentAudio->append($thisNoteAudio);
}



// set duration header
// set title header
// ##########

$currentAudio->saveFile('../data/chr'.$thisCharId.'/music/'.$thisSongJSON['title'].".mp3");


?>