<?php
 
//include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
//include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");
//include($_SERVER['DOCUMENT_ROOT']."/includes/functions.php");
 
 $chr = $_GET["chr"];
 $map = $_GET["map"];
 
header('Content-Type: application/json');
 $mapDataFile = file_get_contents('../data/chr' .  $chr . '/map' . $map . '.json');
 $pos = strrpos($mapDataFile, '##procedural##');
if ($pos !== false) {
$mapData = json_decode($mapDataFile, true);
// check for any procedural elements that need to be added:
// ############
echo json_encode($mapData);
} else {
    // no procedural content, so don't parse it, just output:
    echo $mapDataFile;
}



 
?>