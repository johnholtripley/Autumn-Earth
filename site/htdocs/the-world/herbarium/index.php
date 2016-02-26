<?php
function splitNodes() {
	global $openNodes, $depthToStopAt, $lengthModifier, $plantCanvas, $numberOfBranches, $branchingAngle;
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
	global $openNodes, $depthToStopAt, $plantCanvas, $lengthModifier, $numberOfBranches, $branchingAngle;
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
	$branchingAngle = rand(30,80);
	$numberOfBranches = rand(3,7);

	if(isset($_GET["depth"])) {
		$depthToStopAt = $_GET["depth"];
	}
	if(isset($_GET["angle"])) {
		$branchingAngle = $_GET["angle"];
	}
	if(isset($_GET["branches"])) {
		$numberOfBranches = $_GET["branches"];
	}

	$openNodes = array(array($endX,$endY,$currentDepth,$currentLength,$currentAngle));
	splitNodes();

	// output:
	imagejpeg($plantCanvas,$_SERVER['DOCUMENT_ROOT'].'/images/herbarium/output.jpg',95);
	imagedestroy($plantCanvas);
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
		$stringToCheck = implode("", $hashSplit); 
	}
	return $stringToCheck;	
}

drawPlant(); 

// create latin name:
$latinFile = file($_SERVER['DOCUMENT_ROOT'].'/includes/herbarium/latin-name-syllables.txt');
$latinSyllables = explode(", ",$latinFile[0]);
$syllablesInFirstWord = rand(3,6); 
$syllablesInSecondWord = rand(3,6);
$numberOfSyllablesAvailable = count($latinSyllables);

$latinName = "";

for($i=0;$i<=$syllablesInFirstWord;$i++) {
	$latinName .= $latinSyllables[rand(0,$numberOfSyllablesAvailable)];
}
$latinName = ucfirst($latinName)." ";
for($i=0;$i<=$syllablesInSecondWord;$i++) {
	$latinName .= $latinSyllables[rand(0,$numberOfSyllablesAvailable)];
}

?>
<!doctype html>
<html lang="en-gb">
<head>
	<title>The Herbarium</title>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<style>
	img {
		max-width: 100%;
		height: auto;
	}
	</style>
</head>
<body>
<?php

echo "<h1>".$latinName."</h1>";

// create description:
$jsonResults = file_get_contents($_SERVER['DOCUMENT_ROOT'].'/includes/herbarium/description-grammar.json');
$json = json_decode($jsonResults, true);

// pick a random item from the Origin to start from:
$whichElem = rand(0,(count($json['origin'])-1));
$startingText = $json['origin'][$whichElem];
$startingText = findAndReplaceHashes($startingText);

echo '<p>'.$startingText.'</p>';
$cacheBustURL = "/images/herbarium/output.jpg?".$depthToStopAt."-".$branchingAngle."-".$numberOfBranches;
echo '<img src="'.$cacheBustURL.'" width="480" height="480" alt="Latin name">';

?>
</body>
</html>