<?php
function splitNodes() {
	global $openNodes, $depthToStopAt, $branchAngleIncrement, $lengthModifier, $plantCanvas, $numberOfBranches, $branchingAngle;
	$thisNode = array_shift($openNodes);
	if($thisNode[2]<$depthToStopAt) {
		// draw 2 lines either side of this node's normal
		// add the end points to the node array
		$newNodeStartX = $thisNode[0];
		$newNodeStartY = $thisNode[1];
		$newNodesLength = intval($thisNode[3]) * $lengthModifier;
		$thisNodesAngle = intval($thisNode[4]) - $branchingAngle;
		for($i=0;$i<$numberOfBranches;$i++) {
			$newNodesEndX = $newNodeStartX - (sin(deg2rad($thisNodesAngle))*$newNodesLength);
			$newNodesEndY = $newNodeStartY - (cos(deg2rad($thisNodesAngle))*$newNodesLength);
			imageline($plantCanvas, $newNodeStartX, $newNodeStartY, $newNodesEndX, $newNodesEndY, IMG_COLOR_BRUSHED);
			array_push($openNodes, array($newNodesEndX,$newNodesEndY,$thisNode[2]+1,$newNodesLength,$thisNodesAngle));
			$thisNodesAngle += ($branchingAngle*2)/($numberOfBranches-1);
		}
		splitNodes();
	}
}

function drawPlant() {
	global $openNodes, $depthToStopAt, $branchAngleIncrement, $plantCanvas, $lengthModifier, $numberOfBranches, $branchingAngle;
	$canvaDimension = 600;
	$plantCanvas = imagecreatetruecolor($canvaDimension, $canvaDimension);
	$ground = imagecolorallocate($plantCanvas, 222, 213, 156);
	$walkableColour = imagecolorallocate($plantCanvas, 253, 243, 178);
	imagefilledrectangle($plantCanvas, 0, 0, $canvaDimension, $canvaDimension, $ground);
	$brush = imagecreate(2,2);
	$brushtrans = imagecolorallocate($brush, 0, 0, 0);
	imagecolortransparent($brush, $brushtrans);
	$colour = imagecolorallocate($brush, 96, 35, 14);
	imagefilledellipse($brush, 1, 1, 2, 2, $colour);
	imagesetbrush($plantCanvas, $brush);

	$lengthModifier = 0.5;

	// draw initial line
	$startX = $canvaDimension/2;
	$startY = $canvaDimension;
	$endX = $startX;
	$endY = $startY * $lengthModifier;

	imageline($plantCanvas, $startX, $startY, $endX, $endY, IMG_COLOR_BRUSHED);
	$currentDepth = 1;
	$currentLength = ($endY);

	$currentAngle = 0;

	$depthToStopAt = 6;
		$branchingAngle = 60;
	$numberOfBranches = 5;
	$branchAngleIncrement = 40;

	$openNodes = array(array($endX,$endY,$currentDepth,$currentLength,$currentAngle));
	splitNodes();

	// output:
	imagejpeg($plantCanvas,$_SERVER['DOCUMENT_ROOT'].'/images/botany-bot/output.jpg',95);
}

function findAndReplaceHashes($stringToCheck) {
	global $json;
	// check for any '#'s:
	$hashSplit = explode("#", $stringToCheck);
	if(count($hashSplit) > 1) {
		for ($i=0;$i<count($hashSplit);$i++) {
			if(substr($hashSplit[$i],0,1) == "|") {
				// look for matching keys
				$keyToMatch = substr($hashSplit[$i],1);
				if (array_key_exists($keyToMatch, $json)) {
					$whichReplaceElem = rand(0,(count($json[$keyToMatch])-1));
					$replacementString = $json[$keyToMatch][$whichReplaceElem];
					// check this substitution string to see if it has any hashes itself:
					$replacementString = findAndReplaceHashes($replacementString); 
					$hashSplit[$i] = $replacementString;
				}
			}
		}
		// put it back together:
		$stringToCheck = implode(" ", $hashSplit); 
	}
	return $stringToCheck;	
}

drawPlant(); 

$jsonResults = file_get_contents($_SERVER['DOCUMENT_ROOT'].'/includes/botany-bot-description-grammar.json');
$json = json_decode($jsonResults, true);



// pick a random item from the Origin to start from:
$whichElem = rand(0,(count($json['origin'])-1));
$startingText = $json['origin'][$whichElem];
$startingText = findAndReplaceHashes($startingText);

echo '<h2>'.$startingText.'</h2>';
echo '<img src="/images/botany-bot/output.jpg">';

echo"<code><pre>";
var_dump($json);
echo"</pre></code>";
?>