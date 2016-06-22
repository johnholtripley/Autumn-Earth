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
$possibleMaleFirstNames = sortSequentialSyllables($maleFirstNameSyllables);
$possibleFemaleFirstNames = sortSequentialSyllables($femaleFirstNameSyllables);






$numberOfSyllablesAvailable = count($possibleMaleFirstNames);
do {
$syllableCount = 0;
// pick a random start syllable:
$firstWord = array_rand($possibleMaleFirstNames);
$maleName = $firstWord;
do {
	
$nextSyllable = $possibleMaleFirstNames[$firstWord][mt_rand(0,count($possibleMaleFirstNames[$firstWord])-1)];
$maleName .= $nextSyllable;
$firstWord = array_rand($possibleMaleFirstNames);
$syllableCount ++;
} while ($nextSyllable != " ");
} while (!($syllableCount>=3));



echo "<h2>".$maleName."</h2>";




















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
