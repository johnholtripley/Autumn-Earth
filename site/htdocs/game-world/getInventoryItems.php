<?php

include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");

$whichIds = '';
if(isset($_GET["whichIds"]));
$whichIds = $_GET["whichIds"];
 
$allIds = explode("|", $whichIds);
$itemIdString="";

$isAnUpdate = false;
if(isset($_GET["isAnUpdate"])) {
$isAnUpdate = true;
}

for($i=0;$i<count($allIds);$i++) {
	if($i!=0) {
		$itemIdString.=", ";
	}
	$itemIdString .= intval($allIds[$i]);
}

// get the required items, additionally get all plants and seeds so that the data for any resultant new species is available when breeding them:
// (might need to change this for plants to fetch them when needed instead ####)
// get housing tiles as well when needed not loading them all initially when some may never be needed #########
$plantAndSeedQuery = ' or itemcategories = 8 or itemcategories = 9 or itemcategories = 10';
if($isAnUpdate) {
$plantAndSeedQuery = '';
}
$query = "SELECT * FROM tblinventoryitems where itemid in (".$itemIdString.")" . $plantAndSeedQuery;
$result = mysqli_query($connection, $query) or die ();


$outputJson = '{';

while ($row = mysqli_fetch_array($result)) {
	extract($row);
	
	$outputJson .= '"'.$itemID.'":{';
$outputJson .= '"shortname":"'.$shortname.'",';
$outputJson .= '"description":"'.$description.'",';
$outputJson .= '"priceCode":"'.$priceCode.'",';
$outputJson .= '"centreX":"'.$centreX.'",';
$outputJson .= '"centreY":"'.$centreY.'",';
$outputJson .= '"width":"'.$width.'",';
$outputJson .= '"length":"'.$length.'",';
$outputJson .= '"spriteWidth":"'.$spriteWidth.'",';
$outputJson .= '"spriteHeight":"'.$spriteHeight.'",';
$outputJson .= '"canBeRotated":'.(boolval($canBeRotated) ? 'true' : 'false').',';
$outputJson .= '"worldSrc":"'.$cleanURL.'",';
$outputJson .= '"action":"'.$action.'",';
// actionValue might be a string or an object:
$actionValue = trim($actionValue);
if(substr($actionValue, 0,1)=="{") {
$outputJson .= '"actionValue":'.$actionValue.',';
} else {
$outputJson .= '"actionValue":"'.$actionValue.'",';
}

$outputJson .= '"dyeable":"'.$dyeable.'",';
$outputJson .= '"holdable":"'.$holdable.'",';
$outputJson .= '"stackable":"'.$stackable.'",';
$outputJson .= '"level":"'.$level.'",';
$outputJson .= '"prerequisites":"'.$prerequisites.'",';
$outputJson .= '"group":"'.$itemGroup.'",';
$outputJson .= '"category":"'.$itemCategories.'",';
$outputJson .= '"inscribable":"'.$inscribable.'",';
$outputJson .= '"colour":"'.$colour.'",';
$outputJson .= '"hasInherentColour":"'.$hasInherentColour.'",';
if($respawnRate) {
	$outputJson .= '"respawnRate":"'.$respawnRate.'",';
}
$outputJson .= '"lockedToThisPlayer":"'.$lockedToThisPlayer.'"';




$outputJson .= '},';
}

// remove last comma:

$outputJson = rtrim($outputJson, ",");

$outputJson .= '}';

echo $outputJson;
mysqli_free_result($result);
?>