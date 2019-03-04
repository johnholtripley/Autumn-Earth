<?php

include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");



$query = "SELECT * FROM tblcards";
$result = mysqli_query($connection, $query) or die ();

$outputJson = '{ "cards":[';
$outputJson .= '[null, null, null],';

while ($row = mysqli_fetch_array($result)) {
	extract($row);
$outputJson .= '["'.$cardAttack.'", "'.$cardDefense.'", "'.$cardName.'", "'.$cardCraftingCost.'"],';
}

// remove last comma:
$outputJson = rtrim($outputJson, ",");

$chr = $_GET['playerId'];
$query2 = "SELECT * FROM tblcharacters WHERE charID = '".$chr."'";
$result2 = mysqli_query($connection, $query2) or die ();
$row2 = mysqli_fetch_array($result2);
extract($row2);


$outputJson .= '],"backs":';
$outputJson .= $row2['cardBacks'];
$outputJson .= ',"activeBack": "'.$row2['activeCardBack'].'"';





$outputJson .= '}';

echo $outputJson;
mysqli_free_result($result);
mysqli_free_result($result2);
?>