<?php

function findAndReplaceHashes($stringToCheck) {
	global $json;
// check for any '#'s:
$hashSplit = explode("#", $stringToCheck);
if(count($hashSplit) > 1) {
for ($i=0;$i<count($hashSplit);$i++) {
	if(substr($hashSplit[$i],0,1) == "|") {
// look for matching keys
		$keyToMatch = substr($hashSplit[$i],1);
		if (array_key_exists($keyToMatch, $json)) {
//echo "found";
//var_dump($json[$keyToMatch]);
$whichReplaceElem = rand(0,(count($json[$keyToMatch])-1));
$replacementString = $json[$keyToMatch][$whichReplaceElem];
// does this have any hashes?
$replacementString = findAndReplaceHashes($replacementString); 

$hashSplit[$i] = $replacementString;

		}
	}
}
// put it back together:
$stringToCheck = implode(" ", $hashSplit); 


}
return $stringToCheck;	
}



$jsonResults = file_get_contents($_SERVER['DOCUMENT_ROOT'].'/includes/botany-bot-description-grammar.json');
$json = json_decode($jsonResults, true);


echo"<code><pre>";
var_dump($json);
echo"</pre></code>";



// pick a random item from the Origin:

 




$whichElem = rand(0,(count($json['origin'])-1));
$startingText = $json['origin'][$whichElem];


$startingText = findAndReplaceHashes($startingText);

echo $startingText;
?>