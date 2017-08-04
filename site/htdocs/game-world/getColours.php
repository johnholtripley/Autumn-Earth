<?php

include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");



$query = "SELECT * FROM tblcolours";
$result = mysql_query($query) or die ();

$outputJson = '{ "colourNames":[';


while ($row = mysql_fetch_array($result)) {
	extract($row);
$outputJson .= '"'.$colourName.'",';
}

// remove last comma:
$outputJson = rtrim($outputJson, ",");

$outputJson .= ']}';

echo $outputJson;
mysql_free_result($result);
?>