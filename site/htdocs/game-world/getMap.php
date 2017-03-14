<?php
 
//include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
//include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");
//include($_SERVER['DOCUMENT_ROOT']."/includes/functions.php");
 
 $chr = $_GET["chr"];
 $map = $_GET["map"];
 

 $mapData = file_get_contents('../data/chr' .  $chr . '/map' . $map . '.json');
header('Content-Type: application/json');
 echo $mapData;
?>