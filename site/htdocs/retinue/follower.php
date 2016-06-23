<?php


include($_SERVER['DOCUMENT_ROOT']."/includes/session.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/functions.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/header.php");





?>
<div class="row">

	<div class="column"><h1>Retinue Follower</h1>


<?php

$showAll = false;
if(isset($_GET["show"])) {
	if($_GET["show"] == "all") {
$showAll = true;
	}
}


// follower names should be unique per character, but not globally, so need to check for followers of that name assigned to that character





include($_SERVER['DOCUMENT_ROOT']."/retinue/generation/male-first-names.php");
include($_SERVER['DOCUMENT_ROOT']."/retinue/generation/female-first-names.php");
include($_SERVER['DOCUMENT_ROOT']."/retinue/generation/surnames.php");
$possibleMaleFirstNames = sortSequentialSyllables($maleFirstNameSyllables);
$possibleFemaleFirstNames = sortSequentialSyllables($femaleFirstNameSyllables);
$possibleSurnames = sortSequentialSyllables($surnamesNameSyllables);






$numberOfSyllablesAvailable = count($possibleMaleFirstNames);
do {
	$syllableCount = 0;
	// pick a random start syllable:
	$firstWord = array_rand($possibleMaleFirstNames);
	$maleName = $firstWord;
	//echo $firstWord . " - ";
	do {
		$nextSyllable = $possibleMaleFirstNames[$firstWord][mt_rand(0,count($possibleMaleFirstNames[$firstWord])-1)];
		//echo $nextSyllable . " - ";
		$maleName .= $nextSyllable;
		$firstWord = $nextSyllable;
		$syllableCount ++;
	} while ($nextSyllable != " ");
	//echo " ** ";
} while (!(($syllableCount>=3) && ($syllableCount<=5)));
$maleName = ucfirst($maleName);
//echo "<hr>";
$numberOfSyllablesAvailable = count($possibleFemaleFirstNames);
do {
	$syllableCount = 0;
	// pick a random start syllable:
	$firstWord = array_rand($possibleFemaleFirstNames);
	$femaleName = $firstWord;
	//	echo $firstWord . " - ";
	do {
		$nextSyllable = $possibleFemaleFirstNames[$firstWord][mt_rand(0,count($possibleFemaleFirstNames[$firstWord])-1)];
	//	echo $nextSyllable . " - ";
		$femaleName .= $nextSyllable;
		$firstWord = $nextSyllable;
		$syllableCount ++;
	} while ($nextSyllable != " ");
//	echo " ** ";
} while (!(($syllableCount>=3) && ($syllableCount<=5)));
$femaleName = ucfirst($femaleName);







$numberOfSyllablesAvailable = count($possibleSurnames);
do {
	$syllableCount = 0;
	// pick a random start syllable:
	$firstWord = array_rand($possibleSurnames);
	$surname = $firstWord;
	//	echo $firstWord . " - ";
	do {
		$nextSyllable = $possibleSurnames[$firstWord][mt_rand(0,count($possibleSurnames[$firstWord])-1)];
	//	echo $nextSyllable . " - ";
		$surname .= $nextSyllable;
		$firstWord = $nextSyllable;
		$syllableCount ++;
	} while ($nextSyllable != " ");
//	echo " ** ";
} while (!(($syllableCount>=3) && ($syllableCount<=5)));
$surname = ucfirst($surname);











echo "<h2>".$maleName." ".$surname." (male)</h2>";
echo "<p>(/retinue/".$_GET["character"]."/".cleanURL($maleName." ".$surname)."/)</p>";
echo "<h2>".$femaleName." ".$surname." (female)</h2>";
echo "<p>(/retinue/".$_GET["character"]."/".cleanURL($femaleName." ".$surname)."/)</p>";



















echo $_GET["character"];
echo "<br>";

if($showAll) {
echo '<h2>All followers</h2>';
} else {
echo $_GET["follower"];
}
?>


</div>



</div>









<?php

include($_SERVER['DOCUMENT_ROOT']."/includes/footer.php");
?>
