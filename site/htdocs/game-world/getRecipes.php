<?php

include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");

$query = "SELECT * FROM tblprofessions";
$result = mysql_query($query) or die ("professions failed");
$outputJson = '{';

while ($row = mysql_fetch_array($result)) {
	extract($row);
	$outputJson .= '"'.$professionID.'":{';
	$outputJson .= '"professionName":"'.$professionName.'",';
	$outputJson .= '},';
}

// remove last comma:

$outputJson = rtrim($outputJson, ",");

$whichIds = '';
if(isset($_GET["whichIds"]));
$whichIds = $_GET["whichIds"];
 
$allIds = explode("|", $whichIds);
$itemIdString="";

for($i=0;$i<count($allIds);$i++) {
	if($i!=0) {
		$itemIdString.=", ";
	}
	$itemIdString .= intval($allIds[$i]);
}

$query = "SELECT * FROM tblrecipes where recipeid in (".$itemIdString.")";
$result = mysql_query($query) or die ("recipes failed");




while ($row = mysql_fetch_array($result)) {
	extract($row);
	
	$outputJson .= '"'.$recipeID.'":{';
$outputJson .= '"components":"'.$components.'",';
$outputJson .= '"creates":"'.$creates.'",';
$outputJson .= '"baseColour":"'.$baseColour.'",';
$outputJson .= '"prerequisite":"'.$prerequisite.'",';
$outputJson .= '"profession":"'.$profession.'",';
$outputJson .= '"recipeName":"'.$recipeName.'",';
$outputJson .= '"recipeDescription":"'.$recipeDescription.'"';



$outputJson .= '},';
}

// remove last comma:

$outputJson = rtrim($outputJson, ",");

$outputJson .= '}';

echo $outputJson;

?>