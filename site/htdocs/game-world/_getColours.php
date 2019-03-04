<?php

include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");



$query = "SELECT * FROM tblcolours";
$result = mysqli_query($connection, $query) or die ();

$outputJson = '{ "colourNames":[';


while ($row = mysqli_fetch_array($result)) {
	extract($row);
$outputJson .= '"'.$colourName.'",';
}

// remove last comma:
$outputJson = rtrim($outputJson, ",");

$outputJson .= ']}';

echo $outputJson;
mysqli_free_result($result);
?>