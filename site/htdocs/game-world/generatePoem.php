<?php

// Second order markov chain to create books:
// https://docs.google.com/presentation/d/1pAW4WGYrrY46UPVGLinhao-BJIHenr7T7kUmTZEXgrQ/mobilepresent?slide=id.g160567ace3_1_176

// source text:
// http://www.gutenberg.org/files/42508/42508-h/42508-h.htm

include_once($_SERVER['DOCUMENT_ROOT']."/includes/functions.php");




function createProceduralPoem() {


//$textSource = file_get_contents($_SERVER['DOCUMENT_ROOT']."/includes/scriptorium/sources/the-canterbury-tales-by-geoffrey-chaucer.txt");
$textSource = file_get_contents($_SERVER['DOCUMENT_ROOT']."/includes/scriptorium/sources/the-canterbury-tales-by-geoffrey-chaucer_TEST.txt");


// split on new line:
$textSplitUnTrimmed = explode(PHP_EOL, $textSource);
$textSplit = array_map('trim', $textSplitUnTrimmed);

$outputText = '';


$rhymingPairs = array();

$numberOfLines = count($textSplit);

// build rhyming pairs:
for ($i=0;$i<$numberOfLines;$i+=2) {
  $firstPairLineWords = explode(" ", $textSplit[$i]);
  $secondPairLineWords = explode(" ", $textSplit[$i+1]);
$firstEndWord = array_values(array_slice($firstPairLineWords, -1))[0];
$secondEndWord = array_values(array_slice($secondPairLineWords, -1))[0];
array_push($rhymingPairs, $firstEndWord." ".$secondEndWord);
}


//var_dump($rhymingPairs);


// build markov chain from the end of the line:
$markovSequence = array();

for ($i=0;$i<$numberOfLines;$i++) {

$thisLineSplit = explode(" ", $textSplit[$i]);
$thisLineLength = count($thisLineSplit);

for ($j=$thisLineLength-1;$j>=0;$j--) {
  if($j>1) {
  $thisSecondOrder = $thisLineSplit[$j]." ".$thisLineSplit[$j-1];
    if (array_key_exists($thisSecondOrder, $markovSequence)) {
      array_push($markovSequence[($thisSecondOrder)],$thisLineSplit[$j-2]);
    } else {
      $markovSequence[$thisSecondOrder] = array(($thisLineSplit[$j-2]));
    }
  }
}

}


//var_dump($markovSequence);echo"<hr>";
$outputText = '';
$numberOfPairsOfLines = 6;

for ($i=0;$i<$numberOfPairsOfLines;$i++) {

   $thisPair = $rhymingPairs[mt_rand(0, count($rhymingPairs) - 1)];
   $thisPairSplit = explode(" ",$thisPair);
$firstRhymingWord = $thisPairSplit[0];
$secondRhymingWord = $thisPairSplit[1];

// find a markov key that has this first word in:
$firstMatchingKeys = array();
$secondMatchingKeys = array();
foreach ($markovSequence as $key => $value) {
  if (strpos($key, $firstRhymingWord) !== false) {
array_push($firstMatchingKeys, $key);

  }
  if (strpos($key, $secondRhymingWord) !== false) {
array_push($secondMatchingKeys, $key);
  }
}

/*
echo $firstRhymingWord;
var_dump($firstMatchingKeys);
echo $secondRhymingWord;
var_dump($secondMatchingKeys);
*/

$firstLineKey = $firstMatchingKeys[mt_rand(0, count($firstMatchingKeys) - 1)];
$secondLineKey = $secondMatchingKeys[mt_rand(0, count($secondMatchingKeys) - 1)];

$thisFirstKeySplit = explode(" ",$firstLineKey);
$builtSentence = $thisFirstKeySplit[1]." ".$thisFirstKeySplit[0];
$thisKey = $firstLineKey;
do {
$thisKeySplit = explode(" ",$thisKey);
$thisWord = $markovSequence[$thisKey][mt_rand(0,count($markovSequence[$thisKey])-1)];
$builtSentence = $thisWord." ".$builtSentence;
$thisKey = $thisKeySplit[1]." ".$thisWord;
} while (array_key_exists($thisKey, $markovSequence));
$builtSentence.="<br>";


$secondBuiltSentence = '';
$thisSecondKeySplit = explode(" ",$secondLineKey);
$secondBuiltSentence .= $thisSecondKeySplit[1]." ".$thisSecondKeySplit[0];
$thisKey = $secondLineKey;
do {
$thisKeySplit = explode(" ",$thisKey);
$thisWord = $markovSequence[$thisKey][mt_rand(0,count($markovSequence[$thisKey])-1)];
$secondBuiltSentence = $thisWord." ".$secondBuiltSentence;
$thisKey = $thisKeySplit[1]." ".$thisWord;
} while (array_key_exists($thisKey, $markovSequence));
$secondBuiltSentence.="<br>";




/*
var_dump($firstLineKey);
echo "<br>".$secondLineKey."<hr>";
var_dump($markovSequence[$firstLineKey]);
*/

$outputText .= $builtSentence.$secondBuiltSentence;

}

/*
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



$numberOfParagraphs = 1;
$numberOfSentences = 4;



for ($i=0;$i<$numberOfParagraphs;$i++) {
  for ($j=0;$j<$numberOfSentences;$j++) {
    $builtSentence = '';
    $thisPair = $startPhrases[mt_rand(0, count($startPhrases) - 1)];
  $builtSentence .= $thisPair;
    do {
      // split off second word:
      $thisPairSplit = explode(" ",$thisPair);   
      $thisWord = $markovSequence[$thisPair][mt_rand(0,count($markovSequence[$thisPair])-1)];
      $builtSentence .= " ".$thisWord;
      $thisPair = $thisPairSplit[1]." ".$thisWord;
    } while ($thisWord != ".");
$outputText .= '<p>'.$builtSentence.'</p>';

  }
 $outputText .= '</section>';
}
 $outputText = str_ireplace(" .", ". ", $outputText);


//remove all line breaks:
 $outputText = preg_replace( "/\r|\n/", "", $outputText );
*/


return $outputText;

}


?>