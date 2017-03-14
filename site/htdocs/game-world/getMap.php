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
    include($_SERVER['DOCUMENT_ROOT']."/game-world/generateBook.php");
$mapData = json_decode($mapDataFile, true);
// check for any procedural elements that need to be added:


for($i=0;$i<count($mapData['map']['items']); $i++) {
 if(($mapData['map']['items'][$i]['type'] == 32) || ($mapData['map']['items'][$i]['type'] == 33)) {
    if(isset($mapData['map']['items'][$i]['inscription'])) {
if($mapData['map']['items'][$i]['inscription'] == "##procedural##") {
   // generate a book:

$newTimeStamp = new DateTime();
$mapData['map']['items'][$i]['inscription'] = array();
$mapData['map']['items'][$i]['inscription']['title'] = createProceduralTitle();
$mapData['map']['items'][$i]['inscription']['timeCreated'] = $newTimeStamp->getTimestamp();
$mapData['map']['items'][$i]['inscription']['content'] = createProceduralBook();


}
}
}
}

echo json_encode($mapData);
} else {
    // no procedural content, so don't parse it, just output:
    echo $mapDataFile;
}



 
?>