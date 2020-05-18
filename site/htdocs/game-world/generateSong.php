<?php

// use
// http://develop.ae/game-world/generateSong.php?chr=999&instrument=lotro-lute&song=concerning-hobbits


// TO DO
// ##########
// set duration header - $currentAudio->getTotalDuration()
// ##########












// library to trim and append mp3 files:
// COULD USE GETID3 TO DO THIS INSTEAD AND HAVE ONE LESS LIBRARY
// D:\github\getID3\demos\demo.joinmp3.php
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


// ID3 tag library:
// include getID3() library (can be in a different directory if full path is specified)
// https://github.com/JamesHeinrich/getID3
$TextEncoding = 'UTF-8';
require_once('../includes/third-party/getid3/getid3.php');
// Initialize getID3 engine
$getID3 = new getID3;
$getID3->setOption(array('encoding'=>$TextEncoding));
require_once('../includes/third-party/getid3/write.php');
require_once('../includes/third-party/getid3/write.id3v2.php');








$thisCharId = $_GET['chr'];
$whichInstrument = $_GET["instrument"];
$whichSongName = $_GET["song"];
$songPath = "../data/chr".$thisCharId."/music/";
$thisSongContents = file_get_contents($songPath."/".$whichSongName.".json");
$thisSongJSON = json_decode($thisSongContents, true);
$thisInstrumentPath = '../music/instruments/'.$whichInstrument."/";





include_once($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include_once($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");
$query4 = 'SELECT * from tblcharacters where charid="'.$thisCharId.'"';
$result4 = mysqli_query($connection, $query4);
if(mysqli_num_rows($result4)>0) {
while ($row = mysqli_fetch_array($result4)) {
extract($row);
$characterName = $charName;
}
}
mysqli_free_result($result4);






// get first note:
$thisNote = $thisSongJSON['content'][0][1];
$thisNotesDuration = $thisSongJSON['content'][1][0];
$currentAudio = \falahati\PHPMP3\MpegAudio::fromFile($thisInstrumentPath.$thisNote.".mp3")->trim(0, $thisNotesDuration/1000)->stripTags();

// add the last note:
$thisNote = $thisSongJSON['content'][(count($thisSongJSON['content'])-1)][1];
$thisNoteAudio = \falahati\PHPMP3\MpegAudio::fromFile($thisInstrumentPath.$thisNote.".mp3")->stripTags();
$currentAudio->append($thisNoteAudio);

// loop backwards through the remaining notes (except the last):
$numberOfNotesToLoop = count($thisSongJSON['content'])-2;
for ($i=$numberOfNotesToLoop; $i>0; $i--) {
  $thisNote = $thisSongJSON['content'][$i][1];
  $thisNotesDuration = (($thisSongJSON['content'][($i+1)][0])-($thisSongJSON['content'][($i)][0]));
  $thisNoteAudio = \falahati\PHPMP3\MpegAudio::fromFile($thisInstrumentPath.$thisNote.".mp3")->trim(0, $thisNotesDuration/1000)->stripTags();
  $currentAudio->append($thisNoteAudio);
}


// find unique filename:
$songFilePath = '../data/chr'.$thisCharId.'/music/'.$thisSongJSON['title'];
$version = 1;
do {
  if($version == 1) {
    $filename = $songFilePath.".mp3";
  } else {
      $filename = $songFilePath.'-'.$version.".mp3";
  }
  $version++;
} while(file_exists($filename));

// save the file:
$currentAudio->saveFile($filename);






// set title, comment, image and year metadata:

// Initialize getID3 tag-writing module
$tagwriter = new getid3_writetags;
$tagwriter->filename = $filename;
$tagwriter->tagformats = array('id3v2.3');
$tagwriter->overwrite_tags = true;
$tagwriter->remove_other_tags = true;

$pictureFile=file_get_contents("../images/icons/android-chrome-512x512.png");

$TagData = array(
    'title' => array($thisSongJSON['title']),
    'artist' => array($characterName),
    'comment' => array('Created within Autumn Earth'),
    'year' => array(date("Y")),
    'attached_picture' => array(
        array (
            'data'=> $pictureFile,
            'picturetypeid'=> 3,
            'mime'=> 'image/png',
            'description' => 'Autumn Earth'
        )
    )
);

$tagwriter->tag_data = $TagData;
if ($tagwriter->WriteTags()) {
  //	echo 'Successfully wrote tags<br>';
  // success, redirect to the file:
  header("Location: ".$filename); 
  //	if (!empty($tagwriter->warnings)) {
  //		echo 'There were some warnings:<br>'.implode('<br><br>', $tagwriter->warnings);
  //	}
} else {
  echo 'Failed to write tags!<br>'.implode('<br><br>', $tagwriter->errors);
}

?>