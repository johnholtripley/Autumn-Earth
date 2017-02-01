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



















echo $_GET["character"];
echo "<br>";

if($showAll) {
echo '<h2>All followers</h2>';
} else {
echo $_GET["follower"];

include($_SERVER['DOCUMENT_ROOT']."/includes/retinue/male-first-names.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/retinue/female-first-names.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/retinue/human-surnames-medieval.php");
$possibleMaleFirstNames = sortSequentialSyllables($maleFirstNameSyllables);
$possibleFemaleFirstNames = sortSequentialSyllables($femaleFirstNameSyllables);
$possibleSurnames = sortSequentialSyllables($surnamesNameSyllables);


$maleName = selectSyllables($possibleMaleFirstNames,3,5);
$maleName = ucfirst($maleName);

$femaleName = selectSyllables($possibleFemaleFirstNames,3,5);
$femaleName = ucfirst($femaleName);

$surname = selectSyllables($possibleSurnames,3,5);
$surname = ucfirst($surname);

echo "<h3>".$maleName." ".$surname." (male)</h3>";
echo "<p>(/retinue/".$_GET["character"]."/".cleanURL($maleName." ".$surname)."/)</p>";
echo "<h3>".$femaleName." ".$surname." (female)</h3>";
echo "<p>(/retinue/".$_GET["character"]."/".cleanURL($femaleName." ".$surname)."/)</p>";



echo"<h2>Anglo Saxon</h2>";
include($_SERVER['DOCUMENT_ROOT']."/includes/retinue/human-anglo-saxon-male.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/retinue/human-anglo-saxon-female.php");

$possibleAngloSaxonFemaleFirstNames = sortSequentialSyllables($anglosaxonFemaleSyllables);
$possibleAngloSaxonMaleFirstNames = sortSequentialSyllables($anglosaxonMaleSyllables);



$maleName = selectSyllables($possibleAngloSaxonMaleFirstNames,2,4);
$maleName = ucfirst($maleName);

$femaleName = selectSyllables($possibleAngloSaxonFemaleFirstNames,2,4);
$femaleName = ucfirst($femaleName);



echo "<h3>".$maleName." (male)</h3>";
echo "<p>(/retinue/".$_GET["character"]."/".cleanURL($maleName)."/)</p>";
echo "<h3>".$femaleName." (female)</h3>";
echo "<p>(/retinue/".$_GET["character"]."/".cleanURL($femaleName)."/)</p>";




echo"<h2>Elven</h2>";

include($_SERVER['DOCUMENT_ROOT']."/includes/retinue/elven-suname-prefix.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/retinue/elven-suname-suffix.php");


$thisFirstSurname = $elvenSurnamePrefixes[mt_rand(0, count($elvenSurnamePrefixes) - 1)];
$thisSecondSurname = $elvenSurnameSuffixes[mt_rand(0, count($elvenSurnameSuffixes) - 1)];
if (substr($thisFirstSurname, -1, 1) == substr($thisSecondSurname, 0, 1)) {
	// make sure the last character of the first word isn't the same as the first of the last word - so don't get dragonsstar - get dragonstar instead
$thisFirstSurname = substr($thisFirstSurname, 0, -1);
}


$elvenSurname = $thisFirstSurname.$thisSecondSurname;


$elvenSurname = ucfirst($elvenSurname);

$elvenFemale = " ".$elvenSurname;

$femaleElvenFirstName = "eila";
$femaleElvenFirstName = ucfirst($femaleElvenFirstName);

echo "<h3>".$femaleElvenFirstName." ".$elvenSurname." (female)</h3>";
echo "<p>(/retinue/".$_GET["character"]."/".cleanURL($femaleElvenFirstName." ".$elvenFemale)."/)</p>";


}
?>


</div>



</div>









<?php

include($_SERVER['DOCUMENT_ROOT']."/includes/footer.php");
?>
