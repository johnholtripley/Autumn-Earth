<?php

include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");

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

$query = "SELECT * FROM tblinventoryitems where itemID in (".$itemIdString.")";
$result = mysql_query($query) or die ();


$outputJson = '{';

while ($row = mysql_fetch_array($result)) {
	extract($row);
	
	$outputJson .= '"'.$itemID.'":{';
$outputJson .= '"shortname":"'.$shortname.'",';
$outputJson .= '"description":"'.$description.'",';
$outputJson .= '"priceCode":"'.$priceCode.'",';
$outputJson .= '"centreX":"'.$centreX.'",';
$outputJson .= '"centreY":"'.$centreY.'",';
$outputJson .= '"width":"'.$width.'",';
$outputJson .= '"height":"'.$height.'",';
$outputJson .= '"worldSrc":"'.$worldSrc.'",';
$outputJson .= '"action":"'.$action.'",';
$outputJson .= '"actionValue":"'.$actionValue.'",';
$outputJson .= '"dyeable":"'.$dyeable.'",';
$outputJson .= '"level":"'.$level.'",';
$outputJson .= '"prerequisites":"'.$prerequisites.'",';
$outputJson .= '"group":"'.$group.'",';
$outputJson .= '"inscribable":"'.$inscribable.'",';
$outputJson .= '"colour":"'.$colour.'",';
$outputJson .= '"hasInherentColour":"'.$hasInherentColour.'"';


$outputJson .= '},';
}

// remove last comma:

$outputJson = rtrim($outputJson, ",");

$outputJson .= '}';

echo $outputJson;

?>