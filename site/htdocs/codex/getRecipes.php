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
$result = mysql_query($query) or die ("recipes failed");
if(mysql_num_rows($result) == 0) {
echo "<p>Sorry, that profession wasn't found</p>";
	 	header("HTTP/1.0 404 Not Found");

} else {


	extract(mysql_fetch_array($result));


// breadcrumb:
	
	echo buildBreadCrumb('codex/crafting/dyeing/recipes');





echo '<h2>'.$thisProfession.'</h2>';
echo '<h3>Recipes</h3>';
$query2 = "SELECT tblrecipes.*, tblinventoryitems.itemid as productId, tblinventoryitems.shortname as recipeFallbackName, tblinventoryitems.description as recipeDescriptionFallback FROM tblrecipes INNER JOIN tblinventoryitems on tblrecipes.creates = tblinventoryitems.itemid where tblrecipes.profession='".$professionID."'";

$result2 = mysql_query($query2) or die ("recipes failed");


echo '<ul>';

while ($row = mysql_fetch_array($result2)) {
	extract($row);
echo '<li>';

echo '<img src="/images/game-world/inventory-items/'.$productId.'.png" alt="'.$recipeFallbackName.'" style="width: auto;">';

echo '<h4>';
if($recipeName == "") {
echo $recipeFallbackName;
} else {
	echo $recipeName;
}
echo '</h4>';
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
$componentsSplit = explode(",", $components);
for ($i=0;$i<count($componentsSplit);$i++) {
	if(is_numeric($componentsSplit[$i])) {
$componentNumbers .= $componentsSplit[$i].",";
	} else {

		// add group item

$groupQuery = "select tblinventoryitems.group, tblinventoryitems.shortname as groupShortName from tblinventoryitems where tblinventoryitems.group = '".$componentsSplit[$i]."'";
$result4 = mysql_query($groupQuery) or die ("ingredients group failed");
$thisGroupNameJoined = "";
while ($componentsRow = mysql_fetch_array($result4)) {
	extract($componentsRow);
	$thisGroupNameJoined .= $groupShortName.", ";
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
$componentsQuery = "select tblinventoryitems.itemid, tblinventoryitems.shortname as innerShortName from tblinventoryitems where tblinventoryitems.itemid in (".$componentNumbers.")";
$result3 = mysql_query($componentsQuery) or die ("ingredients failed");

while ($componentsRow = mysql_fetch_array($result3)) {
	extract($componentsRow);
echo '<li>';
echo $innerShortName;
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
echo '</li>';
}
echo '</ul>';
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
