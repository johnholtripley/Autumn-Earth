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

//drawPlant(); 

// create latin name:
$latinFile = file_get_contents($_SERVER['DOCUMENT_ROOT'].'/includes/herbarium/latin-name-syllables.txt');
$latinSyllables = unserialize($latinFile);
$numberOfSyllablesAvailable = count($latinSyllables);

// pick a random start syllable:
$firstWord = array_rand($latinSyllables);

$latinName = $firstWord;

do {
$nextSyllable = $latinSyllables[$firstWord][rand(0,count($latinSyllables[$firstWord])-1)];
$latinName .= $nextSyllable;
$firstWord = array_rand($latinSyllables);
} while ($nextSyllable != " ");


$secondWord = array_rand($latinSyllables);
$latinName .= $secondWord;

do {
$nextSyllable = $latinSyllables[$secondWord][rand(0,count($latinSyllables[$secondWord])-1)];
$latinName .= $nextSyllable;
$secondWord = array_rand($latinSyllables);
} while ($nextSyllable != " ");
$latinName = ucfirst($latinName);
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

// create common names:
include($_SERVER['DOCUMENT_ROOT']."/includes/herbarium/common-name-prefixes.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/herbarium/common-name-suffixes.php");

$numberOfCommonNames = rand(1,3);
$commonNames = array();

for($i=0;$i<=$numberOfCommonNames;$i++) {
$thisCommonName = $commonPrefixes[rand(0,count($commonPrefixes)-1)];
$thisCommonName .= $commonSuffixes[rand(0,count($commonSuffixes)-1)];
$thisCommonName = ucfirst($thisCommonName);
array_push($commonNames,$thisCommonName);
}

echo "<h2>Common names: ".implode(", ",$commonNames)."</h2>";

// pick a random item from the Origin to start from:
$whichElem = rand(0,(count($json['origin'])-1));
$startingText = $json['origin'][$whichElem];
$startingText = findAndReplaceHashes($startingText);

echo '<p>'.$startingText.'</p>';
$cacheBustURL = "/images/herbarium/output.jpg?".$depthToStopAt."-".$branchingAngle."-".$numberOfBranches;
echo '<img src="'.$cacheBustURL.'" width="480" height="480" alt="'.$latinName.'">';

?>
</body>
</html>