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

addNode(0,30,30,array(5));
addNode(1,120,80,array(3));
addNode(2,110,270,array(3,5));
addNode(3,40,220,array(4,2,1,5));
addNode(4,10,130,array(3));
addNode(5,20,60,array(0,3,2));




if($debug) {
	echo '<div class="sequenceBlock">';
	// output the points and connections:
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
		imagefilledellipse($outputCanvas, $thisNode->x * $horizScaling, $thisNode->y * $vertScaling * $ratio, 16, 16, imagecolorallocate($outputCanvas, 64, 64, 64));
		echo '<span style="left: '.(($thisNode->x * $horizScaling)/$canvaDimension*100).'%;top:'.(($thisNode->y * $vertScaling * $ratio)/($canvaDimension*$ratio)*100).'%">'.$thisNode->name.'</span>';
	}


	?>
	<style>
	* {
		padding: 0;
		margin: 0;
		font-family: arial, helvetica, sans-serif;
	}
	.sequenceBlock {
		position: relative;
		width: <?php echo $canvaDimension; ?>px;
		font-size: 10px;
	}
	.sequenceBlock span {
		position: absolute;
		color: #fff;
		text-align: center;
		transform: translate(-50%, -50%);
	}
	</style>
	<?php

	ob_start();
	imagejpeg($outputCanvas, null, 100);
	$rawImageBytes = ob_get_clean();
	echo "<img src='data:image/jpeg;base64," . base64_encode($rawImageBytes) . "'></div>";
	imagedestroy($outputCanvas);
}


$startPoint = $_GET['from'];
$endPoint = $_GET['to'];

// do pathfinding:

$searchNodes = array();
$uncheckedNodes = array();
if(isset($nodeList[$startPoint])) {
	$startNode =  $nodeList[$startPoint];
}
if(isset($nodeList[$endPoint])) {
	$endNode =  $nodeList[$endPoint];
}

$targetFound = false;

if(isset($startNode) && isset($endNode)) {

	$heuristic = sqrt((($endNode->x - $startNode->x) * ($endNode->x - $startNode->x)) + (($endNode->y - $startNode->y) * ($endNode->y - $startNode->y)));

	$searchNodes[$startNode->name] = array('node' => $startNode, 'parentNode' => null, 'cost' => 0, 'summedCost' => $heuristic);
	array_push($uncheckedNodes, $searchNodes[$startNode->name]);


	do {
		// get the next node:
		$thisNextEntry = array_shift($uncheckedNodes);
		$thisNextNode = $thisNextEntry['node'];
		// check if this is the target:
		if ($thisNextNode->name === $endNode->name) {
			$targetFound = true;
		} else {
			// add connected nodes:

			$thisCost  = intval($thisNextEntry['cost']);
			$heuristic = sqrt((($endNode->x - $thisNextNode->x) * ($endNode->x - $thisNextNode->x)) + (($endNode->y - $thisNextNode->y) * ($endNode->y - $thisNextNode->y)));


			foreach ($thisNextNode->connections as $thisJointEntry) {
				$thisJoint = $nodeList[$thisJointEntry];
				if (isset($searchNodes[$thisJoint->name])) {

					// update the details if this is faster
					if ($thisCost < $searchNodes[$thisJoint->name]['cost']) {
						$searchNodes[$thisJoint->name]['parentNode'] = $thisNextEntry;
						$searchNodes[$thisJoint->name]['cost'] = $thisCost;
						$searchNodes[$thisJoint->name]['summedCost'] = $heuristic + $thisCost;
					}
				} else {
					// add connections:
					
						$searchNodes[$thisJoint->name] = array('node' => $thisJoint, 'parentNode' => $thisNextEntry, 'cost' => $thisCost, 'summedCost' => $heuristic + $thisCost);
						array_push($uncheckedNodes, $searchNodes[$thisJoint->name]);
				}
			}

		}
	} while ((count($uncheckedNodes) > 0) && !$targetFound);
}
$reversedOrder = array();
if ($targetFound) {
	while ($thisNextEntry['parentNode'] !== null) {
		array_push($reversedOrder, $thisNextEntry['node']->name);
		$thisNextEntry = $thisNextEntry['parentNode'];
	}
	array_push($reversedOrder, $startNode->name);
	$order = array_reverse($reversedOrder);
	echo implode($order," &rsaquo; ");
} else {
	echo 'target not found';
}

?>