<?php

include_once($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include_once($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");
include_once($_SERVER['DOCUMENT_ROOT']."/includes/functions.php");

// 10 is the Item Category for housing tiles
$query = 'select * from tblinventoryitems where itemCategories="10" ORDER BY "itemID" ASC';

$htmlOutput = '<ul id="housingTileSelection">';


$result = mysqli_query($connection, $query);
if(mysqli_num_rows($result)>0) {
	while ($row = mysqli_fetch_array($result)) {
		extract($row);
		$htmlOutput .= '<li id="housingTile'.$itemID.'" data-id="'.$itemID.'"><img src="/images/game-world/items/'.$cleanURL.'.png" alt="'.$shortname.'">';
		$htmlOutput .= '<p>'.$shortname.' - '.parseMoney($priceCode).'</p></li>';
	
	}
	
}
mysqli_free_result($result);

$htmlOutput .= '</ul>';




echo $htmlOutput;





?>