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





include($_SERVER['DOCUMENT_ROOT']."/includes/retinue/male-first-names.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/retinue/female-first-names.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/retinue/surnames.php");
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



echo"<h2>Hobbits</h2>";
include($_SERVER['DOCUMENT_ROOT']."/includes/retinue/hobbit-male-first-names.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/retinue/hobbit-female-first-names.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/retinue/hobbit-surnames.php");
$possibleHobbitMaleFirstNames = sortSequentialSyllables($hobbitMaleFirstNameSyllables);
$possibleHobbitFemaleFirstNames = sortSequentialSyllables($hobbitFemaleFirstNameSyllables);
$possibleHobbitSurnames = sortSequentialSyllables($hobbitSurnamesNameSyllables);


$maleName = selectSyllables($possibleHobbitMaleFirstNames,2,4);
$maleName = ucfirst($maleName);

$femaleName = selectSyllables($possibleHobbitFemaleFirstNames,2,4);
$femaleName = ucfirst($femaleName);

$surname = selectSyllables($possibleHobbitSurnames,2,5);
$surname = ucfirst($surname);

echo "<h3>".$maleName." ".$surname." (male)</h3>";
echo "<p>(/retinue/".$_GET["character"]."/".cleanURL($maleName." ".$surname)."/)</p>";
echo "<h3>".$femaleName." ".$surname." (female)</h3>";
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
