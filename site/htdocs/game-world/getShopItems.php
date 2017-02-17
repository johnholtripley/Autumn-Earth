<?php

include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");



$json ='{
"mapNumber": 3,
"shops": [
{
	"name":"shop #1",
	"uniqueItems":[],
	"shopSpecialism": 2,
	"categories": [1,2],
	"size":"large",
	"currency":"money"
},
{
	"name":"shop #2",
		"uniqueItems":
			{"14": {
				"colour":3
			},
			"15": {
				"colour":11
			}}
		,
	"shopSpecialism": null,
	"categories": [3],
	"size":"small",
	"currency":"money"
}
]

}';

$jsonData = json_decode($json, true);



// get colours:
$coloursQuery = "SELECT * from tblcolours";
$allColours = [];
$colourResult = mysql_query($coloursQuery) or die ("recipes failed");
while ($colourRow = mysql_fetch_array($colourResult)) {
	extract($colourRow);
	array_push($allColours, $colourName);
}
mysql_free_result($colourResult);
// just use "primary" colours:
$colourIndicesToUse = [1,2,4,5,6,8,16];


for ($i=0;$i<count($jsonData['shops']);$i++) {
echo "<h4>".$jsonData['shops'][$i]["name"]."</h4>";

$query2 = "SELECT tblinventoryitems.* from tblinventoryitems where tblinventoryitems.itemcategories in (".implode(",",$jsonData['shops'][$i]["categories"]).") order by tblinventoryitems.shortname ASC";
// Get colour variants as well for relevant items

$result2 = mysql_query($query2) or die ("failed:".$query2);
$inventoryData = [];
while ($row = mysql_fetch_array($result2, MYSQL_ASSOC)) {
    array_push($inventoryData, $row);
}
mysql_free_result($result2);



// get unique items:

$itemIdsToGet = "";
if(count($jsonData['shops'][$i]["uniqueItems"])>0) {
	
		foreach ($jsonData['shops'][$i]["uniqueItems"] as &$j) {
$itemIdsToGet.=key($j).",";
	}

$itemIdsToGet = rtrim($itemIdsToGet, ',');

echo "<code><pre>";
var_dump($jsonData['shops'][$i]["uniqueItems"]);
echo "</pre></code>";

$query3 = "SELECT tblinventoryitems.* from tblinventoryitems where tblinventoryitems.itemID in (".$itemIdsToGet.") order by tblinventoryitems.shortname ASC";
$result3 = mysql_query($query3) or die ("recipes failed:".$query3);
while ($row = mysql_fetch_array($result3, MYSQL_ASSOC)) {
  
	// check if any of the unique data overides the defaults:
	$thisUniqueItem = $jsonData['shops'][$i]["uniqueItems"][$row["itemID"]];
	var_dump($thisUniqueItem);
}
mysql_free_result($result3);
}








$itemIdsThatNeedColourVariants = [12];
for ($j=0;$j<count($inventoryData);$j++) {
	// check if this item needs colours (dyes, inks etc)
	if (in_array($inventoryData[$j]['itemID'], $itemIdsThatNeedColourVariants)) {

for ($k=0;$k<count($colourIndicesToUse);$k++) {
	// make sure that an equivilent named item doesn't exist: 
	$foundEquivilent = false;
	for ($l=0;$l<count($inventoryData);$l++) {
		if($l!=$j) {
if($inventoryData[$j]['itemGroup'] == $inventoryData[$l]['itemGroup']) {

if($inventoryData[$l]['colour'] == $colourIndicesToUse[$k]) {
	$foundEquivilent = true;
}

}
		}
	}
	if(!$foundEquivilent) {
	echo $allColours[($colourIndicesToUse[$k])]." ".$inventoryData[$j]['shortname']."<br>";
}
	}
	} else {
	echo $inventoryData[$j]['shortname']."<br>";
}
}

}




?>