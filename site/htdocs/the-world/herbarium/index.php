<?php
require_once $_SERVER['DOCUMENT_ROOT'].'/includes/third-party/twitterOAuth/twitteroauth-0.6.2/autoload.php';
use Abraham\TwitterOAuth\TwitterOAuth;
function sendToTwitter() {
	global $latinName, $commonNames, $startingText;


$isLive = false;
if($_SERVER['SERVER_NAME'] == "autumnearth.com") {
	$isLive = true;
}

define("CONSUMER_KEY", "tullZGE4wkZibDnr6aXKuFGQ0");
define("CONSUMER_SECRET","y1S7rffnenpYRJtDQxSv8a5bq3QhAAafqJzEaCQq0nDtw3XtAS");
define("OAUTH_TOKEN", "703148355749171202-mwDglZzCgERUC6u7DshkqyPrK7nSrkK");
define("OAUTH_SECRET", "7f8t7rXScvWIk1AgXe20Z6AA9vRCaG7Vp2wJM964bZMEj");
$connection = new TwitterOAuth(CONSUMER_KEY, CONSUMER_SECRET, OAUTH_TOKEN, OAUTH_SECRET);
$connection->setTimeouts(10, 15);


if($isLive) {
// try and get media url length
// https://dev.twitter.com/rest/reference/get/help/configuration
$config = $connection->get('help/configuration');
$mediaURLLength = intval($config->short_url_length_https);
} else {
	$mediaURLLength = 23;
}



$media = $connection->upload('media/upload', ['media' => 'https://autumnearth.com/images/herbarium/output.jpg']);
$textString = $latinName."\r\n".'('.implode(", ",$commonNames).')';
$textString .= "\r\n".$startingText;

$characterLimit = 140-$mediaURLLength;
if(strlen($textString)>$characterLimit) {

// find the first full stop before this limit
$pos = strrpos($textString,".",0-(strlen($textString)-$characterLimit));
if ($pos !== false) {
$textString = substr($textString, 0, $pos+1);
} else {
	// isn't room for the short description:
	$textString = $latinName."\r\n".'('.implode(", ",$commonNames).')';
}
}
echo "<p>Tweeted content: ".$textString."</p>";
if($isLive) {
	$parameters = [
	    'status' => $textString,
	    'media_ids' => $media->media_id_string,
	];
	$result = $connection->post('statuses/update', $parameters);
	if ($connection->getLastHttpCode() == 200) {
	    // Tweet posted succesfully
	} else {
	    // Handle error case
	    echo $connection->getLastHttpCode();
	}
}















}


function makeSeed() {
	// http://php.net/manual/en/function.srand.php
  list($usec, $sec) = explode(' ', microtime());
  return floor((float) $sec + ((float) $usec * 100000));
}

if(isset($_GET["seed"])) {
	$storedSeed = $_GET["seed"];
} else {
	$storedSeed = makeSeed();
}
srand($storedSeed);
/*
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


function drawSimpleRecursivePlant() {
	global $openNodes, $depthToStopAt, $plantCanvas, $lengthModifier, $numberOfBranches, $branchingAngle;
	$canvaDimension = 600;
	$plantCanvas = imagecreatetruecolor($canvaDimension, $canvaDimension);
	$ground = imagecolorallocate($plantCanvas, 222, 213, 156);
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
*/

function drawPlant() {
	// thanks to http://www.kevs3d.co.uk/dev/lsystems/
	global $iterations, $angle;
	$canvaDimension = 600;
	$plantCanvas = imagecreatetruecolor($canvaDimension, $canvaDimension);
	$ground = imagecolorallocate($plantCanvas, 240, 240, 240);
	imagefilledrectangle($plantCanvas, 0, 0, $canvaDimension, $canvaDimension, $ground);
	/*
	$brush = imagecreate(2,2);
	$brushtrans = imagecolorallocate($brush, 0, 0, 0);
	imagecolortransparent($brush, $brushtrans);
	$colour = imagecolorallocate($brush, 96, 35, 14);
	imagefilledellipse($brush, 1, 1, 2, 2, $colour);
	imagesetbrush($plantCanvas, $brush);
	*/

// load brush images:

$brushSizes = array(20,10,5,1);
$brushColours = array(array(27,113,27),array(24,180,24),array(48,220,48),array(54,220,54));
for ($i=0;$i<count($brushColours);$i++) {
	for ($j=0;$j<count($brushSizes);$j++) {
	//	${'brushcol'.$i.'size'.$j} = imagecreatefrompng($_SERVER['DOCUMENT_ROOT'].'/images/herbarium/brushes/brush'.$i.'-'.$j.'.png');
		${'brushcol'.$i.'size'.$j} = imagecreate($brushSizes[$j],$brushSizes[$j]);
	$brushtrans = imagecolorallocate(${'brushcol'.$i.'size'.$j}, 0, 0, 0);
	imagecolortransparent(${'brushcol'.$i.'size'.$j}, $brushtrans);
	$thisColour = imagecolorallocate(${'brushcol'.$i.'size'.$j}, $brushColours[$i][0], $brushColours[$i][1], $brushColours[$i][2]);
	imagefilledellipse(${'brushcol'.$i.'size'.$j}, ($brushSizes[$j]/2), ($brushSizes[$j]/2), $brushSizes[$j], $brushSizes[$j], $thisColour);
	}
}

	// generate command string:
	
	$axiom = "X";

	$allPossibleRules = array(array("X"=>"S2X[+X]X[-X]X"),array("X"=>"S2X[+X]X[-X][X]"),array("X"=>"S3XX-[-X+X+X]+[+X-X-X]"),array("X"=>"S2F[+X]F[-X]+X","F"=>"FF"),array("X"=>"S2F[+X][-X]FX","F"=>"FF"),array("X"=>"S2F-[[X]+X]+F[+FX]-X","F"=>"FF"));

$allPossibleRules = array(array("X"=>"L"));

	$allPossibleRuleIterations = array(5,6,4,6,6,6);
	$allPossibleRuleDistances = array(2,3,8,3,3,3);
	$startAngle = rand (-20,20);
	$angle = rand(12,40);


	$whichRules = array_rand($allPossibleRules);
	$rules = $allPossibleRules[$whichRules];
	$iterations = $allPossibleRuleIterations[$whichRules];
$distance = $allPossibleRuleDistances[$whichRules];
	
	$result="";
	for ($i=0;$i<$iterations;$i++) {
		if($i==0) {
			$thisAxiom = $axiom;
		} else {
			$thisAxiom = $result;
		}
		$result="";
		// process each character of the axiom:
		for ($j=0;$j<strlen($thisAxiom);$j++) {
			$c = substr($thisAxiom,$j,1);
			if(array_key_exists($c,$rules)) {
				$result.=$rules[$c];
			} else {
				$result.=$c;
			}
		}
	} 

	$commandString = $result;
	

	$stack = array();
	// start at grid 0,0 facing north with no colour index
	$pos = array("x"=>$canvaDimension/2, "y"=>$canvaDimension, "heading"=>$startAngle, "colour"=>0, "size"=>0);
	for ($i=0;$i<strlen($commandString);$i++) {
	$c = substr($commandString,$i,1);
		switch ($c) {
			case "C": 
				// get colour index from next character
				$pos["colour"] = substr($commandString,$i+1,1);
				$i++;
				break;
			case "-": 
				// anticlockwise
				$pos["heading"] += $angle;
				break;
			case "+": 
				// clockwise
				$pos["heading"] -= $angle;
				break;
			case "[": 
				// push
				array_push($stack,array("x"=>$pos["x"], "y"=>$pos["y"], "heading"=>$pos["heading"], "colour"=>$pos["colour"], "size"=>$pos["size"]));
				break;
			case "S":
				// change size
			$pos["size"] = substr($commandString,$i+1,1);
				$i++;
			break;
			case "L":
			// draw a leaf at the current size and heading

imagefilledarc($plantCanvas, $pos["x"], $pos["y"]-50, 150, 100, 180, 360 , imagecolorallocate($plantCanvas, 24, 244, 24), IMG_ARC_EDGED);

			break;
			case "]": 
				// pop
				$pos = array_pop($stack);
				break;
			default: 
				// (F)
				$lastX = $pos["x"];
				$lastY = $pos["y"];
				// move the turtle
				$rad = deg2rad($pos["heading"]);
				$pos["x"] -= $distance * sin($rad);
				$pos["y"] -= $distance * cos($rad);
				// imageline($plantCanvas, $lastX, $lastY, $pos["x"], $pos["y"], ${'penColour'.$pos["colour"]});

				imagesetbrush($plantCanvas, ${'brushcol'.$pos["colour"].'size'.$pos["size"]});
				imageline($plantCanvas, $lastX, $lastY, $pos["x"], $pos["y"], IMG_COLOR_BRUSHED);
		}
	}

// add a texture overlay:
	$textureOverlay = imagecreatefrompng($_SERVER['DOCUMENT_ROOT']."/images/herbarium/overlays/watercolour.png");
imageAlphaBlending($textureOverlay, false);
imagecopy($plantCanvas, $textureOverlay, 0, 0, 0, 0, $canvaDimension, $canvaDimension);


	// output:
	imagejpeg($plantCanvas,$_SERVER['DOCUMENT_ROOT'].'/images/herbarium/output.jpg',95);
	imagedestroy($plantCanvas);
	imagedestroy($textureOverlay);

for ($i=0;$i<count($brushColours);$i++) {
	for ($j=0;$j<count($brushSizes);$j++) {
	imagedestroy(${'brushcol'.$i.'size'.$j});
	}
}


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



// create latin name:
$latinFile = file_get_contents($_SERVER['DOCUMENT_ROOT'].'/includes/herbarium/latin-name-syllables.txt');
$latinSyllables = unserialize($latinFile);
$numberOfSyllablesAvailable = count($latinSyllables);


do {
$syllableCount = 0;
// pick a random start syllable:
$firstWord = array_rand($latinSyllables);
$latinName = $firstWord;
do {
	
$nextSyllable = $latinSyllables[$firstWord][rand(0,count($latinSyllables[$firstWord])-1)];
$latinName .= $nextSyllable;
$firstWord = array_rand($latinSyllables);
$syllableCount ++;
} while ($nextSyllable != " ");
} while (!(($syllableCount>=3) && ($syllableCount<=5)));

do {
$syllableCount = 0;
$secondWord = array_rand($latinSyllables);
$secondLatinName = $secondWord;

do {
$nextSyllable = $latinSyllables[$secondWord][rand(0,count($latinSyllables[$secondWord])-1)];
$secondLatinName .= $nextSyllable;
$secondWord = array_rand($latinSyllables);
$syllableCount ++;
} while ($nextSyllable != " ");
} while (!(($syllableCount>=3) && ($syllableCount<=5)));
$latinName .= $secondLatinName;
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

drawPlant(); 

echo "<h1><em>".$latinName."</em></h1>";

// create description:
$jsonResults = file_get_contents($_SERVER['DOCUMENT_ROOT'].'/includes/herbarium/description-grammar.json');
$json = json_decode($jsonResults, true);

// create common names:
include($_SERVER['DOCUMENT_ROOT']."/includes/herbarium/common-name-prefixes.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/herbarium/common-name-suffixes.php");


$commonNameDistribution = array(1,1,1,1,2,2,3);
$numberOfCommonNames = $commonNameDistribution[rand(0,count($commonNameDistribution)-1)];

$commonNames = array();

for($i=0;$i<$numberOfCommonNames;$i++) {
$thisCommonName = $commonPrefixes[rand(0,count($commonPrefixes)-1)];
do {
$thisSecondCommonName = $commonSuffixes[rand(0,count($commonSuffixes)-1)];
// make sure the first and last words aren't identical:
} while ($thisCommonName == $thisSecondCommonName);

if (substr($thisCommonName, -1, 1) == substr($thisSecondCommonName, 0, 1)) {
	// make sure the last character of the first word isn't the same as the first of the last word - so don't get dragonsstar - get dragonstar instead
$thisCommonName = substr($thisCommonName, 0, -1);
}

$thisCommonName .= $thisSecondCommonName;

$shouldAddPrefix = rand(1,42);
switch ($shouldAddPrefix) {
    case 1:
        $thisCommonName = "Lesser ".$thisCommonName;
        break;
    case 2:
         $thisCommonName = "Greater ".$thisCommonName;
        break;
            case 3:
         $thisCommonName = "Common ".$thisCommonName;
        break;
                case 4:
         $thisCommonName = "Wild ".$thisCommonName;
        break;
    default:
       $thisCommonName = ucfirst($thisCommonName);
} 

// in case the first name has a space at the end, and the second at the start:
$thisCommonName = str_replace("  ", " ", $thisCommonName);

array_push($commonNames,$thisCommonName);
}

echo "<h2>Common names: ".implode(", ",$commonNames)."</h2>";

// pick a random item from the Origin to start from:
$whichElem = rand(0,(count($json['origin'])-1));
$startingText = $json['origin'][$whichElem];
$startingText = findAndReplaceHashes($startingText);

echo '<p>'.$startingText.'</p>';
//$cacheBustURL = "/images/herbarium/output.jpg?".$depthToStopAt."-".$branchingAngle."-".$numberOfBranches;
$cacheBustURL = "/images/herbarium/output.jpg?".$iterations."-".$angle;
echo '<img src="'.$cacheBustURL.'" width="480" height="480" alt="'.$latinName.'">';

echo '<p style="font-size:0.7em;">seed: '.$storedSeed.'</p>';

sendToTwitter();
?>
</body>
</html>