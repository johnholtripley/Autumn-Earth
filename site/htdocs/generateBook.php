<?php

// Second order markov chain to create books. 
// https://docs.google.com/presentation/d/1pAW4WGYrrY46UPVGLinhao-BJIHenr7T7kUmTZEXgrQ/mobilepresent?slide=id.g160567ace3_1_176
// http://www.gutenberg.org/files/42508/42508-h/42508-h.htm


// $textSource = file_get_contents($_SERVER['DOCUMENT_ROOT']."/includes/scriptorium/sources/alices-adventures-in-wonderland-lewis-carroll.txt");
$textSource = file_get_contents($_SERVER['DOCUMENT_ROOT']."/includes/scriptorium/sources/curious-creatures-in-zoology-john-ashton.txt");

// isolate space and full stops:
$textSource = str_ireplace(" ", "####", $textSource);
$textSource = str_ireplace(".", "####.", $textSource);
$textSplit = explode("####", $textSource);
$textLength = count($textSplit);
$startPhrases = array();
$markovSequence = array();
$i=0;
$isAStartPhrase = true;
do {
  // get next 2 words:
  $thisSecondOrder = $textSplit[$i]." ".$textSplit[$i+1];
  if($isAStartPhrase) {
    array_push($startPhrases, $thisSecondOrder);
  }
  if (array_key_exists($thisSecondOrder, $markovSequence)) {
    array_push($markovSequence[($thisSecondOrder)],$textSplit[$i+2]);
  } else {
    $markovSequence[$thisSecondOrder] = array($textSplit[$i+2]);
  }
  $isAStartPhrase = false;
  if($textSplit[$i] == ".") {
    $isAStartPhrase = true;
  }
  $i++;
} while ($i < $textLength-2);


$numberOfSentences = 3;
$numberOfParagraphs = 3;
for ($i=0;$i<$numberOfParagraphs;$i++) {
  $thisPair = $startPhrases[mt_rand(0, count($startPhrases) - 1)];
  $builtSentence = $thisPair;
  for ($j=0;$j<$numberOfSentences;$j++) {
    do {
      // split off second word:
      $thisPairSplit = explode(" ",$thisPair);
      $thisWord = $markovSequence[$thisPair][mt_rand(0,count($markovSequence[$thisPair])-1)];
      $builtSentence .= " ".$thisWord;
      $thisPair = $thisPairSplit[1]." ".$thisWord;
    } while ($thisWord != ".");
  }
  $builtSentence = str_ireplace(" .", ".", $builtSentence);
  echo '<p style="font-family:arial,helvetica,sans-serif;font-size:13px;">'.$builtSentence."</p>";
}


?>