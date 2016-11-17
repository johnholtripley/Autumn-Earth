<?php

include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");


$coloursQuery = "SELECT * from tblcolours";
$allColours = [];
$colourResult = mysql_query($coloursQuery) or die ("recipes failed");
while ($colourRow = mysql_fetch_array($colourResult)) {
	extract($colourRow);
	array_push($allColours, $colourName);
}


$query = "SELECT * FROM tblprofessions";
$result = mysql_query($query) or die ("professions failed");
$outputJson = '{"professions": {';

while ($row = mysql_fetch_array($result)) {
	extract($row);
	$outputJson .= '"'.$professionID.'":{';
	$outputJson .= '"professionName":"'.$professionName.'"';
	$outputJson .= '},';
}

// remove last comma:

$outputJson = rtrim($outputJson, ",");

$outputJson .= '},';
$outputJson .= '"recipes": {';

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

$query = "SELECT tblrecipes.*, tblcolours.colourName, tblinventoryitems.itemid as productId, tblinventoryitems.shortname as recipeFallbackName, tblinventoryitems.description as recipeDescriptionFallback, tblinventoryitems.hasInherentColour as hasInherentColour FROM tblrecipes INNER JOIN tblinventoryitems on tblrecipes.creates = tblinventoryitems.itemid LEFT JOIN tblcolours on tblrecipes.defaultresultingcolour = tblcolours.colourid where tblrecipes.recipeid in (".$itemIdString.")";
$result = mysql_query($query) or die ("recipes failed");




while ($row = mysql_fetch_array($result)) {
	extract($row);
	
	$outputJson .= '"'.$recipeID.'":{';
$outputJson .= '"components":"'.$components.'",';
$outputJson .= '"creates":"'.$creates.'",';
$outputJson .= '"prerequisite":"'.$prerequisite.'",';
$outputJson .= '"profession":"'.$profession.'",';

$thisColour = '';
$thisColourPrefix = '';
if($hasInherentColour<1) {
if($defaultResultingColour>0) {
	$thisColour = "-".strtolower($allColours[$defaultResultingColour]);
	$thisColourPrefix = $allColours[$defaultResultingColour]." ";

}
}



if($recipeName == "") {
$outputJson .= '"recipeName":"'.$thisColourPrefix.$recipeFallbackName.'",';
} else {
$outputJson .= '"recipeName":"'.$thisColourPrefix.$recipeName.'",';
}

$outputJson .= '"imageId":"'.$productId.$thisColour.'",';

if($recipeDescription == "") {
$outputJson .= '"recipeDescription":"'.$recipeDescriptionFallback.'"';
} else {
	$outputJson .= '"recipeDescription":"'.$recipeDescription.'"';
}

$outputJson .= '},';
}

// remove last comma:

$outputJson = rtrim($outputJson, ",");

$outputJson .= '}}';

echo $outputJson;

?>