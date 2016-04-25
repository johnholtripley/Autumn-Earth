<?php




require_once $_SERVER['DOCUMENT_ROOT'].'/includes/third-party/twitterOAuth/twitteroauth-0.6.2/autoload.php';
use Abraham\TwitterOAuth\TwitterOAuth;

include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");

function sendToTwitter() {
	global $latinName, $startingText, $plantURL, $commonNameString, $commonNamesJoined, $isAquatic, $isNight, $storedSeed;


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



$media = $connection->upload('media/upload', ['media' => $_SERVER['DOCUMENT_ROOT'].'/images/herbarium/plants/'.$plantURL.'.jpg']);






$altText = (object) ['text' => 'An image generated in the style of a medieval Herbarium'];
$parameters = [
	     'alt_text' => $altText, 
	    'media_id' => $media->media_id_string
	];
$result = $connection->post('media/metadata/create', $parameters);

var_dump($result);

$textString = $latinName."\r\n".'('.$commonNameString.')';
$textString .= "\r\n".$startingText;

$characterLimit = 140-$mediaURLLength;
if(strlen($textString)>$characterLimit) {

// find the first full stop before this limit
$pos = strrpos($textString,".",0-(strlen($textString)-$characterLimit));
if ($pos !== false) {
$textString = substr($textString, 0, $pos+1);
} else {
	// isn't room for the short description:
	$textString = $latinName."\r\n".'('.$commonNameString.')';
}
}
echo "<p>Tweeted content: ".$textString."</p>";






if($isLive) {
	$parameters = [
	    'status' => $textString,
	    'media_ids' => $media->media_id_string
	];
	$result = $connection->post('statuses/update', $parameters);
	if ($connection->getLastHttpCode() == 200) {
	    // Tweet posted succesfully
	} else {
	    // Handle error case
	    echo $connection->getLastHttpCode();
	    // email the error? ##########
	}
}







$query = "INSERT INTO tblplants (latinName,commonNames,commonNamesJoined,timeCreated,plantDesc,plantUrl,tweetedContent,isAquatic,isNight,plantSeed)
VALUES ('" . $latinName . "','" . $commonNameString . "','" . $commonNamesJoined . "',NOW(),'".$startingText."','".$plantURL."','".$textString."','".$isAquatic."','".$isNight."','".$storedSeed."')";

$result = mysql_query($query) or die ("couldn't execute tblplant query");











}


function makeSeed() {
	// http://php.net/manual/en/function.mt_srand.php
  list($usec, $sec) = explode(' ', microtime());
  return floor((float) $sec + ((float) $usec * 100000));
}

if(isset($_GET["seed"])) {
	$storedSeed = $_GET["seed"];
} else {
	$storedSeed = makeSeed();
}
mt_srand($storedSeed);


function quadBezier($im, $x1, $y1, $x2, $y2, $x3, $y3) {
// php draw quad bezier:
// https://spottedsun.com/quadratic-bezier-curve-in-php/
    $b = $pre1 = $pre2 = $pre3 = 0;
    $prevx = 0;
    $prevy = 0;
    $d = sqrt(($x1 - $x2) * ($x1 - $x2) + ($y1 - $y2) * ($y1 - $y2)) +
        sqrt(($x2 - $x3) * ($x2 - $x3) + ($y2 - $y3) * ($y2 - $y3));
    $resolution = (1/$d) * 10;
    for ($a = 1; $a >0; $a-=$resolution) {
        $b=1-$a;
        $pre1=($a*$a);
        $pre2=2*$a*$b;
        $pre3=($b*$b);
        $x = $pre1*$x1 + $pre2*$x2  + $pre3*$x3;
        $y = $pre1*$y1 + $pre2*$y2 + $pre3*$y3;
        if ($prevx != 0 && $prevy != 0)
            imageline ($im, $x, $y, $prevx,$prevy, IMG_COLOR_BRUSHED);
        $prevx = $x;
        $prevy = $y;
    }
    imageline ($im, $prevx, $prevy, $x3, $y3, IMG_COLOR_BRUSHED);
}






function drawPlant() {
	// thanks to http://www.kevs3d.co.uk/dev/lsystems/
	global $iterations, $angle, $isAquatic, $isNight, $plantURL;
	$canvaDimension = 604;
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

$brushSizes = array(1,2,3,4,5,6,7,8,9,10,11,12,13,14);
$largestBrushSize = array_pop((array_slice($brushSizes, -1)));
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



	$allPossibleRuleIterations = array(5,6,4,6,6,6);

	$allPossibleRuleDistances = array(2,3,8,3,3,3);





	$startAngle = mt_rand (-20,20);
	$angle = mt_rand(12,40);




// testing ------------------------
$allPossibleRules = array(array("X"=>"F","F"=>"FF[+FL][-FL]"));
$allPossibleRuleIterations = array(3);
$allPossibleRuleDistances = array(25);
$startAngle = 0;
$angle = 30;
// testing ------------------------








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
				// make sure leaves are only at terminal nodes: (is this test needed? leaves will alway be at the end of a sequence? ##)
				if(!(($c=="L") && ($i!=$iterations))) {
					$result.=$c;
				}
			}
		}
	} 

	

// make all 'X's into 'F's
$result = str_replace("X", "F", $result);

	
	// find all successive 'F's and count them, so that 'FFFFF' becomes 'F(5)'
	$commandString = "";
	$resultLength = strlen($result);
	$i=0;
	$thisFSequence = 0;
	do {
		if($result{$i} != "F") {
			if($thisFSequence > 0) {
				$commandString .= "F(".$thisFSequence .")";
			}
			$commandString .= $result{$i};
			$thisFSequence = 0;
		} else {
			$thisFSequence ++;
		}
		$i++;
	} while ($i<$resultLength);
	// catch any at the end of the string:
	if($thisFSequence > 0) {
		$commandString .= "F(".$thisFSequence .")";
	}







	$stack = array();
	// start at grid 0,0 facing north with no colour index
		$pos = array("x"=>$canvaDimension/2, "y"=>$canvaDimension, "heading"=>$startAngle, "colour"=>0, "size"=>0);


$allNodes = array();
$allParentNodes = array($pos["x"]."_".$pos["y"]);
$allNodeRelationships = array();

$allLeaves = array();

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

// imagefilledarc($plantCanvas, $pos["x"], $pos["y"]-50, 150, 100, 180, 360 , imagecolorallocate($plantCanvas, 24, 244, 24), IMG_ARC_EDGED);
array_push($allLeaves,array($pos["x"], $pos["y"], $pos["heading"]));

			break;
			case "]": 
				// pop
				$pos = array_pop($stack);
				break;
			default: 
				// "F"

// find how long this line is
	$posInString = stripos($commandString, ")", $i);
		$lengthOfThisNumber = $posInString-($i+2);
		$howLong = intval(substr($commandString,$i+2,$lengthOfThisNumber));
// add some variation - ideally based on the iteration depth: ###
	//	$howLong += mt_rand(0,30)-15;
		 $howLong *= mt_rand(10,16)/10;
		$i += ($lengthOfThisNumber+2);
				$lastX = $pos["x"];
				$lastY = $pos["y"];
				// move the turtle:
				$rad = deg2rad($pos["heading"]);

$rad += (mt_rand(0,10)-5)/20;

					$pos["x"] -= ($distance * $howLong) * sin($rad);
				$pos["y"] -= ($distance * $howLong) * cos($rad);

// add some variation - ideally based on the iteration depth ####
//$pos["x"] += mt_rand(-5,5);
//$pos["y"] += mt_rand(-5,5);

			//	imagesetbrush($plantCanvas, ${'brushcol'.$pos["colour"].'size'.$pos["size"]});
				




// push to array

$allNodeRelationships[$pos["x"]."_".$pos["y"]] = $lastX."_".$lastY;
array_push($allNodes, $pos["x"]."_".$pos["y"]);
array_push($allParentNodes, $lastX."_".$lastY);

// line:
//imageline($plantCanvas, $lastX, $lastY, $pos["x"], $pos["y"], IMG_COLOR_BRUSHED);


		}
	}

// find all nodes that aren't themselves parents (ie. are leaf nodes):
	$allLeafNodes = array_diff( $allNodes,$allParentNodes);


$thisMaxDepth = 0;
// loop through all leaf nodes, finding each parent until run out
	foreach ($allLeafNodes as $thisOuterNode) {

		$thisNode = $thisOuterNode;
		$thisStartPoint = explode("_", $thisNode);
		$previousX = $thisStartPoint[0];
		$previousY = $thisStartPoint[1];
		$thisDepth = 0;
		//echo "outer - examining ".$thisNode."<br>";
		while (array_key_exists($thisNode, $allNodeRelationships)) {
//echo "inner - examining ".$thisNode."<br>";
$thisPoint = explode("_", $thisNode);
$thisEndPoint = explode("_", $allNodeRelationships[$thisNode]);

  $controlX = ($thisPoint[0] + $thisEndPoint[0]) / 2;
  $controlY = ($thisPoint[1] + $thisEndPoint[1]) / 2;
  // bezier curve:
  imagesetbrush($plantCanvas, ${'brushcol'.$pos["colour"].'size'.$thisDepth});
quadBezier($plantCanvas, $previousX, $previousY, $thisPoint[0], $thisPoint[1], $controlX, $controlY);
// line:
//imageline($plantCanvas, $lastX, $lastY, $pos["x"], $pos["y"], IMG_COLOR_BRUSHED);


//echo "target ".$thisPoint[0].",".$thisPoint[1]." to ".$thisEndPoint[0].",".$thisEndPoint[1]."<br />";
//echo "drawing ".$previousX.",".$previousY." to ".$thisEndPoint[0].",".$thisEndPoint[1]."<br />";
$previousX = $controlX;
$previousY = $controlY;
$thisNode = $allNodeRelationships[$thisNode];
$thisDepth ++;

if($thisDepth >= $largestBrushSize) {
	$thisDepth = $largestBrushSize-1;
}

if($thisDepth>$thisMaxDepth) {
	$thisMaxDepth = $thisDepth;
}
		}
	}

	// draw to last point
	imagesetbrush($plantCanvas, ${'brushcol'.$pos["colour"].'size'.$thisMaxDepth});
	quadBezier($plantCanvas, $previousX, $previousY,$thisPoint[0], $thisPoint[1], $thisEndPoint[0],$thisEndPoint[1]);

// draw leaves:
foreach ($allLeaves as $thisLeaf) {
$thisPointX = $thisLeaf[0];
$thisPointY = $thisLeaf[1];
$thisRotation = $thisLeaf[2];
// tear drop leaf:
// needs variable size, and rotating to heading ########

$leafLength = 15;

imagefilledarc($plantCanvas, $thisPointX, $thisPointY, $leafLength, $leafLength, 360-$thisRotation, 180-$thisRotation, imagecolorallocate($plantCanvas, 24, 244, 24), IMG_ARC_EDGED);
//imagefilledarc($plantCanvas, $thisPointX, $thisPointY, $leafLength, $leafLength*2, 270, 360, imagecolorallocate($plantCanvas, 24, 244, 24), IMG_ARC_EDGED);
//imagefilledarc($plantCanvas, $thisPointX, $thisPointY, $leafLength, $leafLength*2, 180, 270, imagecolorallocate($plantCanvas, 24, 244, 24), IMG_ARC_EDGED);
}

// add a texture overlay:
	$textureOverlay = imagecreatefrompng($_SERVER['DOCUMENT_ROOT']."/images/herbarium/overlays/watercolour.png");
imageAlphaBlending($textureOverlay, false);
imagecopy($plantCanvas, $textureOverlay, 0, 0, 0, 0, $canvaDimension, $canvaDimension);


	// output:
	imagejpeg($plantCanvas,$_SERVER['DOCUMENT_ROOT'].'/images/herbarium/plants/'.$plantURL.'.jpg',95);
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
					$whichReplaceElem = mt_rand(0,(count($json[$keyToMatch])-1));
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
	
$nextSyllable = $latinSyllables[$firstWord][mt_rand(0,count($latinSyllables[$firstWord])-1)];
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
$nextSyllable = $latinSyllables[$secondWord][mt_rand(0,count($latinSyllables[$secondWord])-1)];
$secondLatinName .= $nextSyllable;
$secondWord = array_rand($latinSyllables);
$syllableCount ++;
} while ($nextSyllable != " ");
} while (!(($syllableCount>=3) && ($syllableCount<=5)));
$latinName .= $secondLatinName;
$latinName = ucfirst(trim($latinName));
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

 



// create description:
$jsonResults = file_get_contents($_SERVER['DOCUMENT_ROOT'].'/includes/herbarium/description-grammar.json');
$json = json_decode($jsonResults, true);

// create common names:
include($_SERVER['DOCUMENT_ROOT']."/includes/herbarium/common-name-prefixes.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/herbarium/common-name-suffixes.php");


$commonNameDistribution = array(1,1,1,1,2,2,3);
$numberOfCommonNames = $commonNameDistribution[mt_rand(0,count($commonNameDistribution)-1)];

$commonNames = array();
$isAquatic = 0;
$isNight = 0;

for($i=0;$i<$numberOfCommonNames;$i++) {
$thisCommonName = $commonPrefixes[mt_rand(0,count($commonPrefixes)-1)];
do {
$thisSecondCommonName = $commonSuffixes[mt_rand(0,count($commonSuffixes)-1)];
// make sure the first and last words aren't identical:
} while ($thisCommonName == $thisSecondCommonName);

if (substr($thisCommonName, -1, 1) == substr($thisSecondCommonName, 0, 1)) {
	// make sure the last character of the first word isn't the same as the first of the last word - so don't get dragonsstar - get dragonstar instead
$thisCommonName = substr($thisCommonName, 0, -1);
}

$thisCommonName .= $thisSecondCommonName;

$shouldAddPrefix = mt_rand(1,42);
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

$aquaticPos = strpos($thisCommonName, "*");
if ($aquaticPos !== false) {
	$isAquatic = 1;
	}
	$nightPos = strpos($thisCommonName, "^");
if ($nightPos !== false) {
	$isNight = 1;
	}
// remove any property markers:
$thisCommonName = str_ireplace("*", "", $thisCommonName);
$thisCommonName = str_ireplace("^", "", $thisCommonName);

array_push($commonNames,$thisCommonName);
}

$commonNameString = implode(", ",$commonNames);
$commonNameStringJoined = implode("/",$commonNames);
if(count($commonNames)>1) {
	// replace last "," with a "or":
	$lastCommaPos = strrpos($commonNameString, ",");
	$commonNameString = substr($commonNameString, 0, $lastCommaPos)   ." or".   substr($commonNameString, $lastCommaPos+1);
}

$whichBaseStringToUse = "origin";
if($isAquatic == 1) {
	$whichBaseStringToUse = "origin-aquatic";
} else if($isNight == 1) {
	$whichBaseStringToUse = "origin-night";
}

// pick a random item from the Origin to start from:
$whichElem = mt_rand(0,(count($json[$whichBaseStringToUse])-1));
$startingText = $json[$whichBaseStringToUse][$whichElem];
$startingText = findAndReplaceHashes($startingText);

// generate a butterfly:
include($_SERVER['DOCUMENT_ROOT']."/includes/herbarium/butterfly-name-prefixes.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/herbarium/butterfly-name-suffixes.php");
$thisButterflyName = $butterflyPrefixes[mt_rand(0,count($butterflyPrefixes)-1)];
do {
$thisSecondButterflyName = $butterflySuffixes[mt_rand(0,count($butterflySuffixes)-1)];
// make sure the first and last words aren't identical:
} while ($thisButterflyName == $thisSecondButterflyName);
$combinedButterflyName = $thisButterflyName." ".$thisSecondButterflyName;

$shouldAddButterflyPrefix = mt_rand(1,30);
switch ($shouldAddButterflyPrefix) {
    case 1:
        $combinedButterflyName = "Lesser ".$combinedButterflyName;
        break;
    case 2:
         $combinedButterflyName = "Common ".$combinedButterflyName;
        break;
    default:
       $combinedButterflyName = ucfirst($combinedButterflyName);
} 
$combinedButterflyName .= " butterfly";
$startingText = str_ireplace("++butterfly++", $combinedButterflyName, $startingText);



echo '<h1 style="font-style:italic;">'.$latinName.'</h1>';
echo "<h2>Common names: ".$commonNameString."</h2>";
echo '<p>'.$startingText.'</p>';

$plantURL = str_ireplace(" ", "-", trim(strtolower($latinName)));
drawPlant();

echo '<img src="/images/herbarium/plants/'.$plantURL.'.jpg" width="480" height="480" alt="'.$latinName.'">';

echo '<p style="font-size:0.7em;">seed: '.$storedSeed.'</p>';





//sendToTwitter();
?>
</body>
</html>