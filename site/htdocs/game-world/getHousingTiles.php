<?php

include_once($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include_once($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");
include_once($_SERVER['DOCUMENT_ROOT']."/includes/functions.php");

$htmlOutput = '';



$htmlOutput .= '<div class="selectWrapper"><select id="housingTileColour">';
$htmlOutput .= '<option value="0">No additional colour</option>';
// get colours this player can dye walls:
// needs to be unique for each character #########
$colourQuery = 'select * from tblcolours where colourID>0';
$colourResult = mysqli_query($connection, $colourQuery);
if(mysqli_num_rows($colourResult)>0) {
	while ($row = mysqli_fetch_array($colourResult)) {
		extract($row);
		$htmlOutput .= '<option value="'.$colourID.'">'.$colourName.'</option>';
		
	}
}
mysqli_free_result($colourResult);
$htmlOutput .= '</select></div>';



// $inventory will be available from getCoreData when this is included:
if(!(isset($inventory))) {
$query1 = "SELECT inventory from tblcharacters where charID='".$_GET['chr']."'";
   $result1 = mysqli_query($connection, $query1);
if(mysqli_num_rows($result1)>0) {
  while ($row = mysqli_fetch_array($result1)) {
    extract($row);
 }
}
mysqli_free_result($result1);
}

$inventoryJSON = json_decode($inventory);

$allCurrentInventoryTypes = "";

foreach ($inventoryJSON as $key => $value) {
	$lookingFor = " ".$value->type.",";
if(stripos($allCurrentInventoryTypes, $lookingFor) === false) {
$allCurrentInventoryTypes .= " ".$value->type.",";
}
	}

$allCurrentInventoryTypes = rtrim($allCurrentInventoryTypes, ',');



// 10 is the Item Category for housing tiles
$query = 'select * from tblinventoryitems where itemCategories="10" or itemid IN ('.$allCurrentInventoryTypes.') ORDER BY "itemID" ASC';



$housingTileHtml = '';
$housingTabsHtml = '';

$htmlOutputToStore = array();

$result = mysqli_query($connection, $query);
if(mysqli_num_rows($result)>0) {
	while ($row = mysqli_fetch_array($result)) {
		extract($row);

		$thisItemGroup = $itemGroup;
		//$isAnInventoryItem = false;

$shouldIncludeThisItem = true;

		if(stripos($thisItemGroup, "housing-") === false) {
			$thisItemGroup = "housing-items";
			//$isAnInventoryItem = true;
			// hero already owns these items:
			$priceCode = 0;
			if (!(file_exists("../images/game-world/items/".$cleanURL.".png"))) {
			$shouldIncludeThisItem = false;
			}
		}

		if (!(array_key_exists($thisItemGroup, $htmlOutputToStore))) {
			$htmlOutputToStore[$thisItemGroup] = '';
		}
if($shouldIncludeThisItem) {
	$canBeElevated = "false";
	if($thisItemGroup == "housing-items") {
		// only items can be elevated:
$canBeElevated = "true";
	}
		$htmlOutputToStore[$thisItemGroup] .= '<li id="housingTile'.$itemID.'" data-price="'.$priceCode.'" data-canbelevated="'.$canBeElevated.'" data-canberotated="'.(boolval($canBeRotated) ? 'true' : 'false').'" data-cleanurl="'.$cleanURL.'" data-id="'.$itemID.'"><img src="/images/game-world/items/'.$cleanURL.'.png" alt="'.$shortname.'">';
		$htmlOutputToStore[$thisItemGroup] .= '<p>'.$shortname.' - '.parseMoney($priceCode).'</p></li>';
	}
	}
}
mysqli_free_result($result);

krsort($htmlOutputToStore);

$isTheFirstTimeClass = " active";

foreach ($htmlOutputToStore as $key => $value) {
	$housingTileHtml .= '<ul id="'.$key.'" class="housingTileGroup'.$isTheFirstTimeClass.'">'.$value.'</ul>';
	$housingTabsHtml .= '<li><button class="'.trim($isTheFirstTimeClass).'" data-group="'.$key.'">'.ucfirst(str_replace("housing-","",$key)).'</button></li>';
	$isTheFirstTimeClass = "";
}



$htmlOutput .= '<ul id="housingGroupTabs">'.$housingTabsHtml.'</ul>';
$htmlOutput .= '<div id="housingTileSelection">';
$htmlOutput .= $housingTileHtml;

$htmlOutput .= '</div>';
echo $htmlOutput;

?>