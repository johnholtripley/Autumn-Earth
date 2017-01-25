<?php

// Second order markov chain to create books. 
// https://docs.google.com/presentation/d/1pAW4WGYrrY46UPVGLinhao-BJIHenr7T7kUmTZEXgrQ/mobilepresent?slide=id.g160567ace3_1_176
// http://www.gutenberg.org/files/42508/42508-h/42508-h.htm

include_once($_SERVER['DOCUMENT_ROOT']."/includes/functions.php");

$jsonResults = file_get_contents($_SERVER['DOCUMENT_ROOT'].'/includes/scriptorium/sources/title-grammar.json');
$json = json_decode($jsonResults, true);

function createProceduralTitle() {
  global $json;
// pick a random item from the Origin to start from:
  $whichBaseStringToUse = "origin-english";
$whichElem = mt_rand(0,(count($json[$whichBaseStringToUse])-1));
$startingText = $json[$whichBaseStringToUse][$whichElem];
$startingText = findAndReplaceHashes($startingText);

return $startingText;

}

function createProceduralBook() {


 // $textSource = file_get_contents($_SERVER['DOCUMENT_ROOT']."/includes/scriptorium/sources/alices-adventures-in-wonderland-lewis-carroll.txt");
// $textSource = file_get_contents($_SERVER['DOCUMENT_ROOT']."/includes/scriptorium/sources/curious-creatures-in-zoology-john-ashton.txt");

$textSource = file_get_contents($_SERVER['DOCUMENT_ROOT']."/includes/scriptorium/sources/prince-henry-the-navigator-raymond-beazley.txt");
$textSource .= file_get_contents($_SERVER['DOCUMENT_ROOT']."/includes/scriptorium/sources/the-discovery-of-guiana-sir-walter-raleigh.txt");

 // $textSource = file_get_contents($_SERVER['DOCUMENT_ROOT']."/includes/scriptorium/sources/test.txt");

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
  if($textSplit[$i+1] != ".") {
  $thisSecondOrder = $textSplit[$i]." ".$textSplit[$i+1];
  if($isAStartPhrase) {
    array_push($startPhrases, $thisSecondOrder);
  }
  if (array_key_exists($thisSecondOrder, $markovSequence)) {
    array_push($markovSequence[($thisSecondOrder)],$textSplit[$i+2]);
  } else {
    $markovSequence[$thisSecondOrder] = array(($textSplit[$i+2]));
  }
} else {
  // skip the full stop
  $i++;
}
  $isAStartPhrase = false;
  if($textSplit[$i] == ".") {
    $isAStartPhrase = true;
  }
  $i++;
} while ($i < $textLength-2);




$numberOfSentences = 4;



$numberOfParagraphs = 3;
$builtSentence = '';
for ($i=0;$i<$numberOfParagraphs;$i++) {
$builtSentence .= '<section><h1>Chapter '.($i+1).'</h1><p>';
  
  
  for ($j=0;$j<$numberOfSentences;$j++) {
    if($j!=0) {
      $builtSentence .= '<p>';
    } 
    $thisPair = $startPhrases[mt_rand(0, count($startPhrases) - 1)];
  $builtSentence .= $thisPair;
    do {
      // split off second word:
      $thisPairSplit = explode(" ",$thisPair);
      
      $thisWord = $markovSequence[$thisPair][mt_rand(0,count($markovSequence[$thisPair])-1)];

      $builtSentence .= " ".$thisWord;

      $thisPair = $thisPairSplit[1]." ".$thisWord;
    



    } while ($thisWord != ".");

$builtSentence .= '</p>';
  }
 $builtSentence .= '</section>';
}
 $builtSentence = str_ireplace(" .", ". ", $builtSentence);


//remove all line breaks:
 $builtSentence = preg_replace( "/\r|\n/", "", $builtSentence );
return $builtSentence;

}

/*
$isAjax = false;
if(isset($_POST["isAjax"])) {
  if($_POST["isAjax"]==true) {
    // generating a book for the game:
    $isAjax = true;
  }
}

if($isAjax) {
$outputJson = '{"book": {';
$outputJson .= '"title": "a procedurally generated book",';
// escape quotes:
$outputJson .= '"content": "'.str_replace('"', '\"', createProceduralBook()).'",';
$outputJson .= '"whichSlot": "'.$_POST["whichSlot"].'"';
$outputJson .= '}}';
echo $outputJson;
} 
*/
?>