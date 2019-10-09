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





// 10 is the Item Category for housing tiles
$query = 'select * from tblinventoryitems where itemCategories="10" ORDER BY "itemID" ASC';



$housingTileHtml = '';
$housingTabsHtml = '';

$htmlOutputToStore = array();

$result = mysqli_query($connection, $query);
if(mysqli_num_rows($result)>0) {
	while ($row = mysqli_fetch_array($result)) {
		extract($row);


if (!(array_key_exists($itemGroup, $htmlOutputToStore))) {
	$htmlOutputToStore[$itemGroup] = '';
}

		$htmlOutputToStore[$itemGroup] .= '<li id="housingTile'.$itemID.'" data-price="'.$priceCode.'" data-cleanurl="'.$cleanURL.'" data-id="'.$itemID.'"><img src="/images/game-world/items/'.$cleanURL.'.png" alt="'.$shortname.'">';
		$htmlOutputToStore[$itemGroup] .= '<p>'.$shortname.' - '.parseMoney($priceCode).'</p></li>';
	}
}
mysqli_free_result($result);

$isTheFirstTimeClass = " active";

foreach ($htmlOutputToStore as $key => $value) {
	$housingTileHtml .= '<ul id="'.$key.'" class="housingTileGroup'.$isTheFirstTimeClass.'">'.$value.'</ul>';
	$housingTabsHtml .= '<li><button data-group="'.$key.'">'.ucfirst(str_replace("housing-","",$key)).'</button></li>';
	$isTheFirstTimeClass = "";
}


$htmlOutput .= '<ul id="housingGroupTabs">'.$housingTabsHtml.'</ul>';
$htmlOutput .= '<div id="housingTileSelection">';
$htmlOutput .= $housingTileHtml;

$htmlOutput .= '</div>';
echo $htmlOutput;

?>