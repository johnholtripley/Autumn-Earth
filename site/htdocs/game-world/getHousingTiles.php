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

$htmlOutput .= '<ul id="housingTileSelection">';

$result = mysqli_query($connection, $query);
if(mysqli_num_rows($result)>0) {
	while ($row = mysqli_fetch_array($result)) {
		extract($row);
		$htmlOutput .= '<li id="housingTile'.$itemID.'" data-price="'.$priceCode.'" data-cleanurl="'.$cleanURL.'" data-id="'.$itemID.'"><img src="/images/game-world/items/'.$cleanURL.'.png" alt="'.$shortname.'">';
		$htmlOutput .= '<p>'.$shortname.' - '.parseMoney($priceCode).'</p></li>';
	}
}
mysqli_free_result($result);

$htmlOutput .= '</ul>';
echo $htmlOutput;

?>