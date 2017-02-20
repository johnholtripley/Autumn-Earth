<?php

include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/functions.php");



$json ='{
"mapNumber": 3,
"shops": [
{
	"name":"shop #1",
	"hash":"zAbCd",
	"uniqueItems":[],
	"shopSpecialism": 2,
	"categories": [1,2],
	"size":"small",
	"currency":"money"
},
{
	"name":"shop #2",
	"hash":"3AbCd",
		"uniqueItems":
			{"14": [{
				"colour":3
			}, 
		
			{
				"colour":7
			}],
			"15": [{
				"colour":1
			}]}
		,
	"shopSpecialism": null,
	"categories": [],
	"size":"small",
	"currency":"money"
}
]

}';

$jsonData = json_decode($json, true);

$shopSizePriceLimits = ["small"=>"5", "medium"=>"10", "large"=>"9999999999"];

$allItemIdsUsed = [];
$markupToOutput = '';

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
	$markupToOutput .= '<div class="shop" id="shop'.$jsonData['shops'][$i]["hash"].'">';
$markupToOutput .= '<div class="draggableBar">'.$jsonData['shops'][$i]["name"]."</div><ol>";
$inventoryData = [];

if(count($jsonData['shops'][$i]["categories"]) > 0) {

$query2 = "SELECT tblinventoryitems.* from tblinventoryitems where tblinventoryitems.itemcategories in (".implode(",",$jsonData['shops'][$i]["categories"]).") and tblinventoryitems.pricecode <= ".$shopSizePriceLimits[($jsonData['shops'][$i]["size"])]." order by tblinventoryitems.shortname ASC";
// Get colour variants as well for relevant items

$result2 = mysql_query($query2) or die ("failed:".$query2);

while ($row = mysql_fetch_array($result2, MYSQL_ASSOC)) {
    array_push($inventoryData, $row);
}
mysql_free_result($result2);

}

// get unique items:

if(count($jsonData['shops'][$i]["uniqueItems"])>0) {
	
	$itemIdsToGet =implode(",",array_keys($jsonData['shops'][$i]["uniqueItems"]));
	



$query3 = "SELECT tblinventoryitems.* from tblinventoryitems where tblinventoryitems.itemID in (".$itemIdsToGet.") order by tblinventoryitems.shortname ASC";

$result3 = mysql_query($query3) or die ("recipes failed:".$query3);
while ($row = mysql_fetch_array($result3, MYSQL_ASSOC)) {
  
	// check if any of the unique data overides the defaults:
	$thisUniqueItem = $jsonData['shops'][$i]["uniqueItems"][$row["itemID"]];
	for ($j=0;$j<count($thisUniqueItem);$j++) {
foreach ($thisUniqueItem[$j] as $key => $value) {
 $row[$key] = $value;
}
array_push($inventoryData, $row);

	}

}
mysql_free_result($result3);
}




// check for items that need colour, add these to the list
// add a colourName attribute so that can be sorted rather than the numeric value
// then sort









$itemIdsThatNeedColourVariants = [12];
$inventoryDataCount = count($inventoryData);
for ($j=0;$j<$inventoryDataCount;$j++) {
	$inventoryData[$j]['colourName'] = "";
	// check if this item needs colours (dyes, inks etc)
	if (in_array($inventoryData[$j]['itemID'], $itemIdsThatNeedColourVariants)) {
		$hasFoundAColourVariant = false;
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
				$newColourItem = $inventoryData[$j];
				$newColourItem['colourName'] = $allColours[($colourIndicesToUse[$k])]." ";
				array_push($inventoryData, $newColourItem);
				$hasFoundAColourVariant = true;
			}
		}
		if($hasFoundAColourVariant) {
			unset($inventoryData[$j]);
		}
	} else {
		// see if its colour needs to be displaying:
		if(($inventoryData[$j]['colour'] != 0) && ($inventoryData[$j]['hasInherentColour'] == 0)) {
			$inventoryData[$j]['colourName'] = $allColours[$inventoryData[$j]['colour']]." ";
		}
	}
}


$inventoryDataToSort = array_values($inventoryData);



// sort by shortname and then colour:
// http://stackoverflow.com/questions/3232965/sort-multidimensional-array-by-multiple-keys/3233009#3233009
unset($shortname);
unset($colour);
foreach ($inventoryDataToSort as $sortkey => $sortrow) {
    $shortname[$sortkey]  = $sortrow['shortname'];
    $colour[$sortkey] = $sortrow['colourName'];
}
array_multisort($shortname, SORT_ASC, $colour, SORT_ASC, $inventoryDataToSort);





for ($j=0;$j<count($inventoryDataToSort);$j++) {
	array_push($allItemIdsUsed, $inventoryDataToSort[$j]['itemID']);
$markupToOutput .= '<li id="shopSlot'.$i.'-'.$j.'">';
$markupToOutput .= '<img src="/images/game-world/inventory-items/'.$inventoryDataToSort[$j]['itemID'].'.png" alt="'.$inventoryDataToSort[$j]['colourName'].$inventoryDataToSort[$j]['shortname'].'">';
$markupToOutput .= '<p><em>'.$inventoryDataToSort[$j]['colourName'].$inventoryDataToSort[$j]['shortname'].'</em>';
$markupToOutput .= '<span class="price">Sell price: '.parseMoney($inventoryDataToSort[$j]['priceCode']).'</span></p>';
$markupToOutput .= '</li>';





}



$markupToOutput .= '</ol></div></div>';




}

echo $markupToOutput;
// output all IDs used so they can be loaded into the game's inventory data:
$allItemIdsUsed = array_unique($allItemIdsUsed);
echo implode(",",$allItemIdsUsed);

?>