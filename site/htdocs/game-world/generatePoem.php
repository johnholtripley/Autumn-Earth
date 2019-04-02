<?php

// Second order markov chain to create books:
// https://docs.google.com/presentation/d/1pAW4WGYrrY46UPVGLinhao-BJIHenr7T7kUmTZEXgrQ/mobilepresent?slide=id.g160567ace3_1_176

// source text:
// http://www.gutenberg.org/files/42508/42508-h/42508-h.htm

include_once($_SERVER['DOCUMENT_ROOT']."/includes/functions.php");

// TO DO:

// http://develop.ae/scriptorium/?seed=1554226629 - quote closing




function removePunctuation($input) {
  $output = str_replace(",", "", $input);
  $output = str_replace(".", "", $output);
return $output;
}



function createProceduralPoem() {
$availablePunctuation = array(".", ",", "!", ";", "?", ":");

 if (isset($_GET["seed"])) {
        $storedSeed = intval($_GET["seed"]);
    } else {
        // http://php.net/manual/en/function.mt_srand.php
        list($usec, $sec) = explode(' ', microtime());
        $storedSeed       = floor((float) $sec + ((float) $usec * 100000));
    }
mt_srand($storedSeed);
//echo '<p style="font-size:0.6em"><a href="/scriptorium/?seed='.$storedSeed.'">'.$storedSeed.'</a> | <a href="/scriptorium/">New seed</a></p>';

//$textSource = file_get_contents($_SERVER['DOCUMENT_ROOT']."/includes/scriptorium/sources/the-canterbury-tales-by-geoffrey-chaucer.txt");
$textSource = file_get_contents($_SERVER['DOCUMENT_ROOT']."/includes/scriptorium/sources/the-canterbury-tales-by-geoffrey-chaucer_CHECKED.txt");


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
$firstRhymingWord = removePunctuation($thisPairSplit[0]);
$secondRhymingWord = removePunctuation($thisPairSplit[1]);



// find a markov key that has this first word in:
$firstMatchingKeys = array();
$secondMatchingKeys = array();
foreach ($markovSequence as $key => $value) {


$keySplit = explode(" ", $key);

$wordLookingFor = removePunctuation($keySplit[0]);




if($wordLookingFor == $firstRhymingWord) {

array_push($firstMatchingKeys, $key);

  }
  if($wordLookingFor == $secondRhymingWord) {

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
do {
$secondLineKey = $secondMatchingKeys[mt_rand(0, count($secondMatchingKeys) - 1)];
// make sure they're not the same word:
} while ($firstLineKey == $secondLineKey);





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





/*
var_dump($firstLineKey);
echo "<br>".$secondLineKey."<hr>";
var_dump($markovSequence[$firstLineKey]);
*/

// check for any open brackets

$thisNewSentence = $builtSentence.$secondBuiltSentence;

if(strpos($thisNewSentence, "(") !== false) {
if(strpos($thisNewSentence, ")") === false) {
  // has an open, but no close
$thisNewSentence .= ')';
}
}

if(strpos($thisNewSentence, ")") !== false) {
if(strpos($thisNewSentence, "(") === false) {
// has a close, but no open:
  $thisNewSentence = str_replace(")", "", $thisNewSentence);
}
}



// fix quotes:

$numberOfOpenQuotes = substr_count($thisNewSentence,'“');
$numberOfCloseQuotes = substr_count($thisNewSentence,'”');


// check they're in the right order:



if($numberOfOpenQuotes > $numberOfCloseQuotes) {
$thisNewSentence .= '”';
}
if($numberOfOpenQuotes < $numberOfCloseQuotes) {
$thisNewSentence = '“'.$thisNewSentence;
}



// http://develop.ae/scriptorium/?seed=1554226629
// http://develop.ae/scriptorium/?seed=1554266517





/*
// do the same thing for opening and closing quotes:
if(strpos($thisNewSentence, "“") !== false) {
if(strpos($thisNewSentence, "”") === false) {
  // has an open, but no close
$thisNewSentence .= '”';
}
}

if(strpos($thisNewSentence, "”") !== false) {
if(strpos($thisNewSentence, "“") === false) {
// has a close, but no open:
  $thisNewSentence = str_replace("”", "", $thisNewSentence);
} else {
  // check that the open comes before the close:
  if(strpos($thisNewSentence, "“") > strpos($thisNewSentence, "”")) {
// remove both:
    $thisNewSentence = str_replace("“", "", $thisNewSentence);
    $thisNewSentence = str_replace("”", "", $thisNewSentence);
  }
}
}
*/


if($i == ($numberOfPairsOfLines-1)) {
// check last character - make sure it's a '.'
  $lastCharacter = substr($thisNewSentence, -1);
  if(in_array($lastCharacter, $availablePunctuation)) {
// force it to be a full stop:

$thisNewSentence = substr($thisNewSentence, 0, -1);

  } 
  $thisNewSentence.=".";

} else {
  $thisNewSentence.="<br>";
}


$outputText .= $thisNewSentence;

}




return $outputText;

}


?>