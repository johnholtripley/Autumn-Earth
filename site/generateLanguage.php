<?php


// TO DO
// fix issue with single letter at start of sentence meaning next word starts wih capital too
// trigger words to respond to player's dialogue - maye vowels swapped to make it more like chosen language
// Check rendered words so no swearimg. 

/*
---------------------
inspired by http://www.raphkoster.com/2006/06/09/why-dont-our-npcs/

Based on my species, pick one of the following syllable libraries:

Orcish (heavy on the ughg gaghs)
Chittery (heavy on the kth chkhth)
Slithery (heavy on the ssiss sisshtsh)
Wispish (every consonant, plus the letter y)

Also based on my species, set a length of words (in syllables) and a length of sentence (in words).
Every once in a while, saySomething(with no parameters)
If you hear text, you have a chance of calling saySomething(with the overheard text as a parameter)
saySomething(text):
if the passed in text has any of the following words: food, eat, gold, any of the city names, any of the virtue names, any of the major fictional character names like British or Blackthorn, words related to combat, words related to gameplay
pick from the following list of other words: kill, eat, no afraid, scared, attack, hunt, ugly, puny, hate, love, etc.
Build words up to sentence length. If random chance hits, insert one of the list of words instead, or one of the overheard words. End the sentence with a bit of punctuation: ? ! . or … (and capitalize sentences appropriately).
Building words: grab random syllables from your syllable list, up to the word length.
This meant, of course, that if you were near a wisp, and happened to say the word “moongate,” the wisp might respond with “Zthgtts zzkzyz moongate? Yjjkkjwh virtue shrine.”
---------------------
*/


// need trigger words to include in output to refer to what the player said

$textToAnalyse = strtolower("Tail lîn danner vain erin iúriel hi enni. Lebid lîn edrannel gaded i hîr rhîw. Rainc nîn aníranner ennas le hebed ar ethiriannel. Mi naergon hen garant nen.");
$textToAnalyse .=" ";

$ignoreList= array(".",",",":",";","\"","'","(",")","!","?", " ", "-");

$punctuationToUse = array(".", ".", ".", "?", "...");

$lettersFound = array();
$wordCount = array();

$startLetters = array();

$currentWordCount = 1;

$isFirstLetter = true;
do {

$thisLetter = substr( $textToAnalyse, 0, 1 );
$nextLetter = substr( $textToAnalyse, 1, 1 );

if (!in_array($thisLetter, $ignoreList)) {
if (!in_array($nextLetter, $ignoreList)) {

if($isFirstLetter) {
array_push($startLetters, $thisLetter);
}
$isFirstLetter = false;

// see if this has already been found:
if (array_key_exists($thisLetter, $lettersFound)) {
array_push($lettersFound[$thisLetter], $nextLetter);

} else {
// add new key:
$lettersFound[$thisLetter] = array($nextLetter);
}
$currentWordCount++;

} else {
array_push($wordCount, $currentWordCount);
$currentWordCount = 1;
$isFirstLetter = true;
}
}

// remove first letter
$textToAnalyse = substr( $textToAnalyse, 1 );

} while (strlen($textToAnalyse) >1);

// determine average word count:
$averageWordLength = round(array_sum($wordCount)/count($wordCount));




// start to build output:

$numberOfSentences = rand(1,4);

$output = "";

for ($i = 1; $i <= $numberOfSentences; $i++) {
$isACapital = true;
$numberOfWords = rand(4,9);
// get number of words from analysis? ###########

for ($j = 1; $j <= $numberOfWords; $j++) {

$thisLetter = $startLetters[rand(0,count($startLetters)-1)];
if($isACapital) {
$output .= strtoupper ($thisLetter);
} else {
$output .= $thisLetter;
}

$thisWordsLength = $averageWordLength + rand(0,6) - 3;
if($thisWordsLength<1) {
$thisWordsLength = 0;
}
for ($k = 2; $k <= $thisWordsLength; $k++) {

if (array_key_exists($thisLetter, $lettersFound)) {
$newLetter = $lettersFound[$thisLetter][rand(0,count($lettersFound[$thisLetter])-1)];
} else {
// this letter was at the end of a word:
break;
}

$output .= $newLetter;
$thisLetter = $newLetter;
$isACapital = false;
} 
if($j != $numberOfWords) {
$output .= " ";
}
}

$output .= $punctuationToUse[rand(0,count($punctuationToUse)-1)];

if($i != $numberOfSentences) {
$output .= " ";
}



}

echo $output;


?>