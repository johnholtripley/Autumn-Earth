<?php

include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");



$json ='{
"mapNumber": 3,
"shops": [
{
	"name":"shop #1",
	"uniqueItems":[6,19],
	"shopSpecialism": 2,
	"categories": [1,2],
	"size":"large",
	"currency":"money"
},
{
	"name":"shop #2",
	"uniqueItems":[],
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
// just use "primary" colours:
$colourIndicesToUse = [1,2,4,5,6,8,16];


for ($i=0;$i<count($jsonData['shops']);$i++) {
echo "<h4>".$jsonData['shops'][$i]["name"]."</h4>";
$query2 = "SELECT tblinventoryitems.* from tblinventoryitems where tblinventoryitems.itemcategories in (".implode(",",$jsonData['shops'][$i]["categories"]).") order by tblinventoryitems.shortname ASC";
// Get colour variants as well for relevant items #####
$result2 = mysql_query($query2) or die ("recipes failed:".$query2);
$inventoryData = [];
while ($row = mysql_fetch_array($result2, MYSQL_ASSOC)) {
    array_push($inventoryData, $row);
}
mysql_free_result($result2);

for ($j=0;$j<count($inventoryData);$j++) {
	// check if this item is dyeable, but doesn't have inherent colour:
	if(($inventoryData[$j]['dyeable'] > 0) && ($inventoryData[$j]['hasInherentColour'] <1)) {

for ($k=0;$k<count($colourIndicesToUse);$k++) {
	// make sure that an equivilent named item doesn't exist: 
	$foundEquivilent = false;
	for ($l=0;$l<count($inventoryData);$l++) {
		if($l!=$j) {
if($inventoryData[$j]['itemGroup'] == $inventoryData[$l]['itemGroup']) {
if($inventoryData[$j]['hasInherentColour'] == $inventoryData[$l]['hasInherentColour']) {
if($inventoryData[$l]['colour'] == $colourIndicesToUse[$k]) {
	$foundEquivilent = true;
}
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