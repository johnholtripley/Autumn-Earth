<?php


include($_SERVER['DOCUMENT_ROOT']."/includes/session.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/functions.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/header.php");





?>
<div class="row">

	<div class="column">

		<h1>The Codex</h1>

<?php

if(isset($_GET["profession"])) {
	$thisProfession = $_GET["profession"];
} 

$query = "select * from tblprofessions where cleanurl='".$thisProfession."'";
$result = mysqli_query($connection, $query) or die ("recipes failed");
if(mysqli_num_rows($result) == 0) {
echo "<p>Sorry, that profession wasn't found</p>";
	 	header("HTTP/1.0 404 Not Found");

} else {


	extract(mysqli_fetch_array($result));


// breadcrumb:
	
	echo buildBreadCrumb('codex/crafting/'.$thisProfession.'/recipes','The Codex/');





echo '<h2>'.$thisProfession.' recipes</h2>';


$coloursQuery = "SELECT * from tblcolours";
$allColours = [];
$colourResult = mysqli_query($connection, $coloursQuery) or die ("recipes failed");
while ($colourRow = mysqli_fetch_array($colourResult)) {
	extract($colourRow);
	array_push($allColours, $colourName);
}


$query2 = "SELECT tblrecipes.*, tblprofessions.*, tblcolours.colourName, tblinventoryitems.itemid as productId, 

CASE WHEN tblrecipes.recipename IS NOT NULL THEN tblrecipes.recipename

 WHEN tblrecipes.defaultresultingcolour IS NOT NULL AND tblinventoryitems.hasInherentColour IS NOT NULL THEN CONCAT_WS(' ',tblcolours.colourname, tblinventoryitems.shortname)
  WHEN tblrecipes.recipename IS NULL THEN tblinventoryitems.shortname
 END as 'finalRecipeName',
 tblinventoryitems.description as recipeDescriptionFallback, tblinventoryitems.shortname as recipeProducesName, tblinventoryitems.hasInherentColour as hasInherentColour FROM tblrecipes INNER JOIN tblprofessions on tblrecipes.profession = tblprofessions.professionid INNER JOIN tblinventoryitems on tblrecipes.creates = tblinventoryitems.itemid LEFT JOIN tblcolours on tblrecipes.defaultresultingcolour = tblcolours.colourid where tblrecipes.profession='".$professionID."' order by finalRecipeName ASC";



$result2 = mysqli_query($connection, $query2) or die ("recipes failed:".$query2);


echo '<div class="row medium-3up wide-5up equalHeights" id="recipeCards">';

while ($row = mysqli_fetch_array($result2)) {
	extract($row);
echo '<div class="column" id="recipe'.$recipeID.'"><div>';
$thisColour = '';
$thisColourPrefix = '';
if($hasInherentColour<1) {
if($defaultResultingColour>0) {
	$thisColour = "-".strtolower($allColours[$defaultResultingColour]);
	//$thisColourPrefix = $allColours[$defaultResultingColour]." ";
}
}

echo '<img src="/images/game-world/inventory-items/'.$productId.$thisColour.'.png" alt="'.$finalRecipeName.'" style="width: auto;">';

echo '<h3>'.$finalRecipeName;
if($recipeName != "") {

	echo '<span>(produces '.$recipeProducesName.')</span>';
}
echo '</h3>';
echo '<p>';
if($recipeDescription == "") {
echo $recipeDescriptionFallback;
} else {
	echo $recipeDescription;
}
echo '</p>';
// get the ingredients:

$componentNumbers = "";
$groupItems = [];
$numberOfGroups = 0;
//$componentsSplit = explode(",", $components);

$componentObject = json_decode($components);

foreach($componentObject as $key => $value) {



	if(is_numeric($value->type)) {
$componentNumbers .= $value->type.",";
	} else {

		// add group item

$groupQuery = "select tblinventoryitems.itemgroup, tblinventoryitems.shortname as groupShortName, tblinventoryitems.cleanurl as groupcleanurl from tblinventoryitems where tblinventoryitems.itemgroup = '".$value->type."'";
$result4 = mysqli_query($connection, $groupQuery) or die ("ingredients group failed");
$thisGroupNameJoined = "";
while ($componentsRow = mysqli_fetch_array($result4)) {
	extract($componentsRow);
	$thisGroupNameJoined .= '<a href="/codex/items/'.$groupcleanurl.'">'.$groupShortName.'</a>, ';
}
$thisGroupNameJoined = rtrim($thisGroupNameJoined, ", ");

	// replace last "," with a "or":
	$lastCommaPos = strrpos($thisGroupNameJoined, ",");
	$thisGroupNameJoined = substr($thisGroupNameJoined, 0, $lastCommaPos)   ." or".   substr($thisGroupNameJoined, $lastCommaPos+1);


array_push($groupItems, $thisGroupNameJoined);


	}
}
// remove last comma:

$componentNumbers = rtrim($componentNumbers, ",");
if(($componentNumbers != "") || (count($groupItems)>0)) {
echo '<p>Ingredients:</p><ol>';
	if($componentNumbers != "") {
$componentsQuery = "select tblinventoryitems.itemid, tblinventoryitems.shortname as innerShortName, tblinventoryitems.cleanurl as innerCleanURL from tblinventoryitems where tblinventoryitems.itemid in (".$componentNumbers.")";
$result3 = mysqli_query($connection, $componentsQuery) or die ("ingredients failed");

while ($componentsRow = mysqli_fetch_array($result3)) {
	extract($componentsRow);
echo '<li>';


echo '<a href="/codex/items/'.$innerCleanURL.'">'.$innerShortName.'</a>';

echo '</li>';
}
}

if(count($groupItems >0)) {
	for ($i=0;$i<count($groupItems);$i++) {
		echo '<li>'.$groupItems[$i].'</li>';
	}
}

echo '</ol>';
}
echo '</div></div>';
}
echo '</div>';
}




	


?>





<hr>
</div>
</div>






<div class="row">

	<div class="column">



<ul>
<?php
include($_SERVER['DOCUMENT_ROOT']."/includes/navigation/the-world.php");
?>
</ul>


</div>



</div>









<?php

include($_SERVER['DOCUMENT_ROOT']."/includes/footer.php");
?>
