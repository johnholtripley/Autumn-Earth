<?php
 
include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");

$debug = false;
if (isset($_GET["debug"])) {
    $debug = true;
}

// duplicate from getMap.php:
$jsonMapResults = file_get_contents($_SERVER['DOCUMENT_ROOT'].'/data/world-map.json');
$mapJson = json_decode($jsonMapResults, true);
$worldMap = $mapJson['worldMap'];
$worldMapTileLength = 50;
// end duplicate


$nodeList = array();
$canvaDimension = 300;

$horizNumberOfMaps = count($worldMap[0]);
$vertNumberOfMaps = count($worldMap);
$ratio = $vertNumberOfMaps/$horizNumberOfMaps;
$horizScaling = $canvaDimension / ($worldMapTileLength * $horizNumberOfMaps);
$vertScaling = $canvaDimension / ($worldMapTileLength * $vertNumberOfMaps);


class node {
    public function __construct() {
        global $nodeList;
        //$this->x = 0;
        //$this->y = 0;
        //$this->name = count($nodeList);
        array_push($nodeList, $this);
    }
}

function addNode($name, $x, $y, $connections) {
    $newNode = new node();
    $newNode->name = $name;
    $newNode->x = $x;
    $newNode->y = $y;
    $newNode->connections = $connections;
    return $newNode;
}

addNode(0,30,30,array(3));
addNode(1,120,80,array(3));
addNode(2,70,270,array(3));
addNode(3,90,200,array(0,1,2));

if($debug) {
//echo '<pre><code>';
//var_dump($nodeList);
//echo '</code></pre>';
}



if($debug) {

$outputCanvas = imagecreatetruecolor($canvaDimension, $canvaDimension*$ratio);
$groundColour = array(219, 215, 190);
$ground = imagecolorallocate($outputCanvas, $groundColour[0], $groundColour[1], $groundColour[2]);
imagefilledrectangle($outputCanvas, 0, 0, $canvaDimension, $canvaDimension*$ratio, $ground);

foreach ($nodeList as $thisNode) {
	foreach ($thisNode->connections as $thisJoint) {
		imageline($outputCanvas, $thisNode->x * $horizScaling, $thisNode->y * $vertScaling * $ratio, $nodeList[$thisJoint]->x * $horizScaling, $nodeList[$thisJoint]->y * $vertScaling * $ratio, imagecolorallocate($outputCanvas, 128, 128, 128));
	}
}
foreach ($nodeList as $thisNode) {
	imagefilledellipse($outputCanvas, $thisNode->x * $horizScaling, $thisNode->y * $vertScaling * $ratio, 12, 12, imagecolorallocate($outputCanvas, 64, 64, 64));
}

echo '<div class="sequenceBlock">';
ob_start();
imagejpeg($outputCanvas, null, 100);
$rawImageBytes = ob_get_clean();
echo "<img src='data:image/jpeg;base64," . base64_encode($rawImageBytes) . "'></div>";
imagedestroy($outputCanvas);
}



?>