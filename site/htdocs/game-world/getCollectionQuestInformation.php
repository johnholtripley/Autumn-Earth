<?php

include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");

$whichCollectionQuest = '';
if(isset($_GET["whichCollectionQuest"])) {
$whichCollectionQuest = $_GET["whichCollectionQuest"];
}

$query = "SELECT * FROM tblcollectionquests WHERE cleanurl = '".$whichCollectionQuest."'";
$result = mysql_query($query) or die ();
if (mysql_num_rows($result) > 0) {
	$outputJson = '{ "'.$whichCollectionQuest.'":{';
	$row = mysql_fetch_array($result);
	extract($row);
	$outputJson .= '"questName": "'.$collectionQuestName.'",';
	$outputJson .= '"questLore": "'.addcslashes($collectionQuestLore, '"\\/').'"';
	$outputJson .= '}}';
} else {
	$outputJson = 'unknown';
}
echo $outputJson;
mysql_free_result($result);
?>