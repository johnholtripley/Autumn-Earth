<?php




require_once $_SERVER['DOCUMENT_ROOT'].'/includes/third-party/twitterOAuth/twitteroauth-0.6.2/autoload.php';
use Abraham\TwitterOAuth\TwitterOAuth;

$isLive = false;
if($_SERVER['SERVER_NAME'] == "autumnearth.com") {
	$isLive = true;
}

if(!$isLive) {
include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");
}

function sendToTwitter() {
	global $latinName, $startingText, $plantURL, $commonNameString, $commonNamesJoined, $isAquatic, $isNight, $storedSeed, $isLive;




define("CONSUMER_KEY", "tullZGE4wkZibDnr6aXKuFGQ0");
define("CONSUMER_SECRET","y1S7rffnenpYRJtDQxSv8a5bq3QhAAafqJzEaCQq0nDtw3XtAS");
define("OAUTH_TOKEN", "703148355749171202-mwDglZzCgERUC6u7DshkqyPrK7nSrkK");
define("OAUTH_SECRET", "7f8t7rXScvWIk1AgXe20Z6AA9vRCaG7Vp2wJM964bZMEj");
$connection = new TwitterOAuth(CONSUMER_KEY, CONSUMER_SECRET, OAUTH_TOKEN, OAUTH_SECRET);
$connection->setTimeouts(10, 15);

/*
if($isLive) {
// try and get media url length
// https://dev.twitter.com/rest/reference/get/help/configuration
$config = $connection->get('help/configuration');
$mediaURLLength = intval($config->short_url_length_https);
} else {
	$mediaURLLength = 23;
}
*/
// https://blog.twitter.com/express-even-more-in-140-characters
// media links don't count towards the 140
$mediaURLLength = 0;

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






if(!$isLive) {
$query = "INSERT INTO tblplants (latinName,commonNames,commonNamesJoined,timeCreated,plantDesc,plantUrl,tweetedContent,isAquatic,isNight,plantSeed)
VALUES ('" . $latinName . "','" . $commonNameString . "','" . $commonNamesJoined . "',NOW(),'".$startingText."','".$plantURL."','".$textString."','".$isAquatic."','".$isNight."','".$storedSeed."')";

$result = mysql_query($query) or die ("couldn't execute tblplant query");
}










}



function capValues($val,$min,$max) {
	if($val<$min) {
	$val = $min;
	}
	if($val>$max) {
		$val = $max;
	}
	return $val;
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


function createCommandString($axiom, $rules, $iterations) {

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
return $commandString;
}


function drawPlant() {
	// thanks to http://www.kevs3d.co.uk/dev/lsystems/
	global $iterations, $angle, $isAquatic, $isNight, $plantURL, $petalRed, $petalGreen, $petalBlue, $groundColour, $plantCanvas;
	$canvaDimension = 2000;
	$outputCanvaDimension = 754;
	$plantCanvas = imagecreatetruecolor($canvaDimension, $canvaDimension);
	$groundColour = array(219, 215, 190);
	$ground = imagecolorallocate($plantCanvas, $groundColour[0], $groundColour[1], $groundColour[2]);
	imagefilledrectangle($plantCanvas, 0, 0, $canvaDimension, $canvaDimension, $ground);


// load brush images:
$brushSizes = array(3,4,5,7,11,15,19,24);
$largestBrushSize = count($brushSizes);
$brushColours = array(array(97,113,77),array(102,150,138));
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


include($_SERVER['DOCUMENT_ROOT']."/includes/herbarium/root-colours.php");
for ($i=0;$i<count($rootColours);$i++) {
	for ($j=0;$j<count($brushSizes);$j++) {
	//	${'brushcol'.$i.'size'.$j} = imagecreatefrompng($_SERVER['DOCUMENT_ROOT'].'/images/herbarium/brushes/brush'.$i.'-'.$j.'.png');
		${'rootbrushcol'.$i.'size'.$j} = imagecreate($brushSizes[$j],$brushSizes[$j]);
	$brushtrans = imagecolorallocate(${'rootbrushcol'.$i.'size'.$j}, 0, 0, 0);
	imagecolortransparent(${'rootbrushcol'.$i.'size'.$j}, $brushtrans);
	$thisColour = imagecolorallocate(${'rootbrushcol'.$i.'size'.$j}, $rootColours[$i][0], $rootColours[$i][1], $rootColours[$i][2]);
	imagefilledellipse(${'rootbrushcol'.$i.'size'.$j}, ($brushSizes[$j]/2), ($brushSizes[$j]/2), $brushSizes[$j], $brushSizes[$j], $thisColour);
	}
}




	// generate command string:
	
	$axiom = "X";

	$allPossibleRules = array(array("X"=>"S2X[+X]X[-X]X"),array("X"=>"S2X[+X]X[-X][X]"),array("X"=>"S3XX-[-X+X+X]+[+X-X-X]"),array("X"=>"S2F[+X]F[-X]+X","F"=>"FF"),array("X"=>"S2F[+X][-X]FX","F"=>"FF"),array("X"=>"S2F-[[X]+X]+F[+FX]-X","F"=>"FF"));

	$allPossibleRuleIterations = array(5,6,4,6,6,6);
	$allPossibleRuleDistances = array(2,3,8,3,3,3);

	$startAngle = mt_rand (-20,20);
	$angle = mt_rand(12,40);


// root rules:
$rootAxiom = "F";
$allPossibleRootRules = array(array("F"=>"FF[+X+X][-X-X]"));
$allPossibleRootRuleIterations = array(3);
$allPossibleRootRuleDistances = array(35);
$startRootAngle = 180 + $startAngle;
$startRootAngle = capValues($startRootAngle,0,360);
$rootAngle = 30;






// testing ------------------------
$allPossibleRules = array(array("X"=>"F","F"=>"FF[+FL][-FL][++FL][--FL]"));
$allPossibleRuleIterations = array(4);
$allPossibleRuleDistances = array(50);
$startAngle = 0;
$angle = 30;
$startRootAngle = 180 + $startAngle;
$startRootAngle = capValues($startRootAngle,0,360);
// testing ------------------------








	$whichRules = array_rand($allPossibleRules);
	$rules = $allPossibleRules[$whichRules];
	$iterations = $allPossibleRuleIterations[$whichRules];
$distance = $allPossibleRuleDistances[$whichRules];
	
	
$commandString = createCommandString($axiom, $rules, $iterations);

$whichRootRules = array_rand($allPossibleRootRules);
	$rootRules = $allPossibleRootRules[$whichRootRules];
	$rootIterations = $allPossibleRootRuleIterations[$whichRootRules];
$rootDistance = $allPossibleRootRuleDistances[$whichRootRules];

$rootCommandString = createCommandString($rootAxiom, $rootRules, $rootIterations);



$stack = array();
// start at grid 0,0 facing north with no colour index
$pos = array("x"=>$canvaDimension/2, "y"=>$canvaDimension*2/3, "heading"=>$startAngle, "colour"=>0, "size"=>0);
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
			// push to array
			$allNodeRelationships[$pos["x"]."_".$pos["y"]] = $lastX."_".$lastY;
			array_push($allNodes, $pos["x"]."_".$pos["y"]);
			array_push($allParentNodes, $lastX."_".$lastY);
	}
}


// repeat for roots:
$rootStack = array();
// start at grid 0,0 facing north with no colour index
$pos = array("x"=>$canvaDimension/2, "y"=>$canvaDimension*2/3, "heading"=>$startRootAngle, "colour"=>0, "size"=>0);
$allRootNodes = array();
$allRootParentNodes = array($pos["x"]."_".$pos["y"]);
$allRootNodeRelationships = array();
for ($i=0;$i<strlen($rootCommandString);$i++) {
	$c = substr($rootCommandString,$i,1);
	switch ($c) {
		case "C": 
			// get colour index from next character
			$pos["colour"] = substr($rootCommandString,$i+1,1);
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
			array_push($rootStack,array("x"=>$pos["x"], "y"=>$pos["y"], "heading"=>$pos["heading"], "colour"=>$pos["colour"], "size"=>$pos["size"]));
			break;
			case "S":
			// change size
			$pos["size"] = substr($rootCommandString,$i+1,1);
			$i++;
			break;
		case "]": 
			// pop
			$pos = array_pop($rootStack);
			break;
		default: 
			// "F"
			// find how long this line is
			$posInString = stripos($rootCommandString, ")", $i);
			$lengthOfThisNumber = $posInString-($i+2);
			$howLong = intval(substr($rootCommandString,$i+2,$lengthOfThisNumber));
			// add some variation - ideally based on the iteration depth: ###
			//	$howLong += mt_rand(0,30)-15;
			$howLong *= mt_rand(10,16)/10;
			$i += ($lengthOfThisNumber+2);
			$lastX = $pos["x"];
			$lastY = $pos["y"];
			// move the turtle:
			$rad = deg2rad($pos["heading"]);
			$rad += (mt_rand(0,10)-5)/20;
			$pos["x"] -= ($rootDistance * $howLong) * sin($rad);
			$pos["y"] -= ($rootDistance * $howLong) * cos($rad);
			// push to array
			$allRootNodeRelationships[$pos["x"]."_".$pos["y"]] = $lastX."_".$lastY;
			array_push($allRootNodes, $pos["x"]."_".$pos["y"]);
			array_push($allRootParentNodes, $lastX."_".$lastY);
	}
}







// find all nodes that aren't themselves parents (ie. are leaf nodes):
	$allLeafNodes = array_diff( $allNodes,$allParentNodes);
$allterminalRootNodes = array_diff( $allRootNodes,$allRootParentNodes);







// draw roots:
$thisMaxDepth = 0;
// loop through all leaf nodes, finding each parent until run out
foreach ($allterminalRootNodes as $thisOuterNode) {
	$thisNode = $thisOuterNode;
	$thisStartPoint = explode("_", $thisNode);
	$previousX = $thisStartPoint[0];
	$previousY = $thisStartPoint[1];
	$thisDepth = 0;
	while (array_key_exists($thisNode, $allRootNodeRelationships)) {
		$thisPoint = explode("_", $thisNode);
		$thisEndPoint = explode("_", $allRootNodeRelationships[$thisNode]);
		$controlX = ($thisPoint[0] + $thisEndPoint[0]) / 2;
		$controlY = ($thisPoint[1] + $thisEndPoint[1]) / 2;
		// bezier curve:
		imagesetbrush($plantCanvas, ${'rootbrushcol'.$pos["colour"].'size'.$thisDepth});
		quadBezier($plantCanvas, $previousX, $previousY, $thisPoint[0], $thisPoint[1], $controlX, $controlY);
		// line:
		//imageline($plantCanvas, $lastX, $lastY, $pos["x"], $pos["y"], IMG_COLOR_BRUSHED);
		$previousX = $controlX;
		$previousY = $controlY;
		$thisNode = $allRootNodeRelationships[$thisNode];
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
imagesetbrush($plantCanvas, ${'rootbrushcol'.$pos["colour"].'size'.$thisMaxDepth});
quadBezier($plantCanvas, $previousX, $previousY,$thisPoint[0], $thisPoint[1], $thisEndPoint[0],$thisEndPoint[1]);









// draw stems:

$thisMaxDepth = 0;
$lengthsOfNodes = array();
// loop through all leaf nodes, finding each parent until run out
foreach ($allLeafNodes as $thisOuterNode) {
	$thisNode = $thisOuterNode;
	$thisStartPoint = explode("_", $thisNode);
	$previousX = $thisStartPoint[0];
	$previousY = $thisStartPoint[1];
	$thisDepth = 0;
	while (array_key_exists($thisNode, $allNodeRelationships)) {
		$thisPoint = explode("_", $thisNode);
		$thisEndPoint = explode("_", $allNodeRelationships[$thisNode]);
		$controlX = ($thisPoint[0] + $thisEndPoint[0]) / 2;
		$controlY = ($thisPoint[1] + $thisEndPoint[1]) / 2;
		// bezier curve:
		imagesetbrush($plantCanvas, ${'brushcol'.$pos["colour"].'size'.$thisDepth});
		quadBezier($plantCanvas, $previousX, $previousY, $thisPoint[0], $thisPoint[1], $controlX, $controlY);
		// line:
		//imageline($plantCanvas, $lastX, $lastY, $pos["x"], $pos["y"], IMG_COLOR_BRUSHED);
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
	// store this node's length:
	$lengthsOfNodes[$thisOuterNode] = $thisDepth;
}
// draw to last point
imagesetbrush($plantCanvas, ${'brushcol'.$pos["colour"].'size'.$thisMaxDepth});
quadBezier($plantCanvas, $previousX, $previousY,$thisPoint[0], $thisPoint[1], $thisEndPoint[0],$thisEndPoint[1]);












// draw leaves:

include($_SERVER['DOCUMENT_ROOT']."/includes/herbarium/leaf-colours.php");
$thisLeafColour = $leafColours[mt_rand(0, count($leafColours) - 1)];

$numberOfLeafVariationsToDraw = 1;
$leafCanvasSize = 100;
$leafInset = 10;
for ($k=0;$k<count($numberOfLeafVariationsToDraw);$k++) {
	${'leaf'.$k} = imagecreate($leafCanvasSize,$leafCanvasSize);

	$leafTrans = imagecolorallocate(${'leaf'.$k}, 0, 0, 0);
	imagecolortransparent(${'leaf'.$k}, $leafTrans);
	${'leafColour'.$k} = imagecolorallocate(${'leaf'.$k}, $thisLeafColour[0], $thisLeafColour[1], $thisLeafColour[2]);

	${'leafBrush'.$k} = imagecreate(6,6);
	$leafBrushTrans = imagecolorallocate(${'leafBrush'.$k}, 0, 0, 0);
	imagecolortransparent(${'leafBrush'.$k}, $leafBrushTrans);
	${'leafBrushColour'.$k} = imagecolorallocate(${'leafBrush'.$k}, $thisLeafColour[0], $thisLeafColour[1], $thisLeafColour[2]);
	imagefilledellipse(${'leafBrush'.$k}, 3,3,6,6, ${'leafBrushColour'.$k});
	imagesetbrush(${'leaf'.$k}, ${'leafBrush'.$k});


	// ###
	// leaf start needs to be the centre of the leaf image so it can be positioned correctly
	quadBezier(${'leaf'.$k}, $leafCanvasSize/2, $leafCanvasSize/2, $leafCanvasSize-$leafInset, $leafCanvasSize/2-$leafInset, $leafCanvasSize/2,$leafInset);
	quadBezier(${'leaf'.$k}, $leafCanvasSize/2, $leafCanvasSize/2, $leafInset, $leafCanvasSize/2-$leafInset, $leafCanvasSize/2,$leafInset);
	imagefill(${'leaf'.$k}, $leafCanvasSize/2, $leafCanvasSize/2-$leafInset*2, ${'leafBrushColour'.$k});
	imageline ( ${'leaf'.$k} , $leafCanvasSize/2, $leafCanvasSize/2 , $leafCanvasSize/2, $leafInset , imagecolorallocate(${'leaf'.$k}, 6,42,30 ));
	// ###
	
}


$petalBrushSize = 2;
	$petalBrush = imagecreate($petalBrushSize,$petalBrushSize);
	$petalBrushtrans = imagecolorallocate($petalBrush, 0, 0, 0);
	imagecolortransparent($petalBrush, $petalBrushtrans);
	$thisPetalColour = imagecolorallocate($petalBrush, $petalRed, $petalGreen, $petalBlue);
	imagefilledellipse($petalBrush, $petalBrushSize/2, $petalBrushSize/2, $petalBrushSize,$petalBrushSize, $thisPetalColour);


// prepare flower graphic:
$numberOfFlowerVariationsToDraw = 1;
$flowerCanvasSize = 90;
for ($k=0;$k<count($numberOfFlowerVariationsToDraw);$k++) {
	${'flower'.$k} = imagecreate($flowerCanvasSize,$flowerCanvasSize);
	$flowerTrans = imagecolorallocate(${'flower'.$k}, 0, 0, 0);
	imagecolortransparent(${'flower'.$k}, $flowerTrans);


	// draw star:
	$centreX = $flowerCanvasSize/2;
	$centreY =$flowerCanvasSize/2;
	$points = mt_rand(6,12);
	$outerRadius = ($flowerCanvasSize/2)-$petalBrushSize;
	$innerRadius = 20;
	imagesetbrush(${'flower'.$k}, $petalBrush);
	// http://stackoverflow.com/questions/14580033/algorithm-for-drawing-a-5-point-star
	$RAD_distance = ( 2 * pi() / $points);  
	$RAD_half_PI = pi()/2; 
	$petalPoints = array(array($centreX, $centreY));

	for ($i=0; $i <= $points; $i++) {
		$new_outer_RAD = ($i + 1) * $RAD_distance;     
		$half_new_outer_RAD = $new_outer_RAD - ($RAD_distance / 2); 
		// don't have this line for a poly (need for a star):
		$midPointX = $centreX + round(cos($half_new_outer_RAD - $RAD_half_PI) * $innerRadius);
		$midPointY = $centreY + round(sin($half_new_outer_RAD - $RAD_half_PI) * $innerRadius);
		//imageline ( ${'flower'.$k} , $startX , $startY , $midPointX , $midPointY, IMG_COLOR_BRUSHED);
		array_push($petalPoints, array($midPointX, $midPointY));
		//
		$nextPointX = $centreX + round(cos($new_outer_RAD - $RAD_half_PI) * $outerRadius);
		$nextPointY = $centreY + round(sin($new_outer_RAD - $RAD_half_PI) * $outerRadius);
		array_push($petalPoints, array($nextPointX, $nextPointY));
		//	imageline ( ${'flower'.$k} , $midPointX , $midPointY , $nextPointX , $nextPointY ,IMG_COLOR_BRUSHED);
	}
	$previousX = $petalPoints[0][0];
	$previousY = $petalPoints[0][1];
	for ($i=0; $i < count($petalPoints)-2; $i++) {
		$controlX = ($petalPoints[$i][0] + $petalPoints[$i+1][0]) / 2;
		$controlY = ($petalPoints[$i][1] + $petalPoints[$i+1][1]) / 2;
		quadBezier(${'flower'.$k}, $previousX, $previousY, $petalPoints[$i][0], $petalPoints[$i][1], $controlX, $controlY);
		$previousX = $controlX;
		$previousY = $controlY;
	}
	// draw to last point:
	quadBezier(${'flower'.$k}, $previousX, $previousY,$petalPoints[$i][0], $petalPoints[$i][1], $petalPoints[$i+1][0],$petalPoints[$i+1][1]);
	imagefill ( ${'flower'.$k}, $centreX+$petalBrushSize,$centreY+$petalBrushSize, imagecolorallocate(${'flower'.$k}, $petalRed, $petalGreen, $petalBlue) );
	imagefilledellipse ( ${'flower'.$k} , $centreX, $centreY , $flowerCanvasSize/6 , $flowerCanvasSize/6 , imagecolorallocate(${'flower'.$k}, 184,126,80 ) );
	// end star draw routine
}






foreach ($allLeaves as $thisLeaf) {
	$thisPointX = $thisLeaf[0];
	$thisPointY = $thisLeaf[1];
	$thisRotation = $thisLeaf[2];
	// Preserve transparency
	//imagesavealpha(${'leaf0'} , true);

$whichElementToUse = 'leaf'.mt_rand(0,($numberOfLeafVariationsToDraw-1));

// check node length, if it's the maximum, then draw a flower instead
$thisNodesLength = $lengthsOfNodes[$thisPointX."_".$thisPointY];
if($thisNodesLength == $thisMaxDepth) {
	$whichElementToUse = 'flower'.mt_rand(0,($numberOfFlowerVariationsToDraw-1));
	$flowerWidth = imagesx(${$whichElementToUse});
	$flowerHeight = imagesy(${$whichElementToUse});
	imagecopyresampled($plantCanvas, ${$whichElementToUse}, $thisPointX-($flowerWidth)/2, $thisPointY-($flowerHeight/2), 0, 0, $flowerWidth, $flowerHeight, $flowerWidth, $flowerHeight);
} else {

	$pngTransparency = imagecolorallocatealpha(${$whichElementToUse} , 0, 0, 0, 127);
	imagefill(${$whichElementToUse} , 0, 0, $pngTransparency);
	//leaves at 90deg multiples have a small border along the edge:
	if($thisRotation%90 == 0) {
		$thisRotation += 5;
	}
	$rotatedLeaf = imagerotate(${$whichElementToUse}, $thisRotation, $pngTransparency);
//imagealphablending(${'leaf'.$whichLeafToUse}, false);
//imagesavealpha(${'leaf'.$whichLeafToUse}, true);
	$rotatedLeafWidth = imagesx($rotatedLeaf);
	$rotatedLeafHeight = imagesy($rotatedLeaf);
	imagecopyresampled($plantCanvas, $rotatedLeaf, $thisPointX-($rotatedLeafWidth)/2, $thisPointY-($rotatedLeafHeight/2), 0, 0, $rotatedLeafWidth, $rotatedLeafHeight, $rotatedLeafWidth, $rotatedLeafHeight);
	imagedestroy($rotatedLeaf);
}
}





// find the bounds of what's been drawn:
function isBackgroundColour($plantCanvas,$x,$y) {
	global $groundColour;
	$rgb = imagecolorat($plantCanvas, $x, $y);
	//$alpha = ($rgba & 0x7F000000) >> 24;
	//return $alpha==127;
	$r = ($rgb >> 16) & 0xFF;
	$g = ($rgb >> 8) & 0xFF;
	$b = $rgb & 0xFF;
	if($r == $groundColour[0]) {
		if($g == $groundColour[1]) {
			if($b == $groundColour[2]) {
				return true;
			}	
		}
	}
	return false;
}

$x=0;
$limitMinY=0;
do {
	$foundBG = isBackgroundColour($plantCanvas,$x,$limitMinY);
	$x++;
	if($x>=$canvaDimension) {
	$x=0;
		$limitMinY ++;
	}
} while ( ($limitMinY<$canvaDimension) and ($foundBG));

$x=0;
$limitMaxY=$canvaDimension-1;
do {
	$foundBG = isBackgroundColour($plantCanvas,$x,$limitMaxY);
	$x++;
	if($x>=$canvaDimension) {
	$x=0;
		$limitMaxY --;
	}
} while ( ($limitMaxY>0) and ($foundBG));

$limitMinX=0;
$y=0;
do {
	$foundBG = isBackgroundColour($plantCanvas,$limitMinX,$y);
	$y++;
	if($y>=$canvaDimension) {
	$y=0;
		$limitMinX ++;
	}
} while ( ($limitMinX<$canvaDimension) and ($foundBG));

$y=0;
$limitMaxX=$canvaDimension-1;
do {
	$foundBG = isBackgroundColour($plantCanvas,$limitMaxX,$y);
	$y++;
	if($y>=$canvaDimension) {
	$y=0;
		$limitMaxX --;
	}
} while ( ($limitMaxX>0) and ($foundBG));




// add some spacing:
$spacing = 35;


$sourceWidth = ($limitMaxX-$limitMinX);
$sourceHeight = ($limitMaxY-$limitMinY);

// make sure it doesn't distort the image:
$longestSourceDimension = max($sourceWidth, $sourceHeight);

$destOffsetX = $spacing;
$destOffsetY = $spacing;

if($sourceWidth<$sourceHeight) {
$destinationWidth = ($outputCanvaDimension-($spacing*2))*$sourceWidth/$sourceHeight;
$destOffsetX += ((($outputCanvaDimension-($spacing*2))-$destinationWidth)/2);
} else if($sourceHeight<$sourceWidth) {
$destinationHeight = ($outputCanvaDimension-($spacing*2))*$sourceHeight/$sourceWidth;
$destOffsetY += ((($outputCanvaDimension-($spacing*2))-$destinationHeight)/2);
}



$imageResampled = imagecreatetruecolor($outputCanvaDimension, $outputCanvaDimension);
$resizedGround = imagecolorallocate($imageResampled, $groundColour[0], $groundColour[1], $groundColour[2]);
imagefilledrectangle($imageResampled, 0, 0, $outputCanvaDimension, $outputCanvaDimension, $resizedGround);
imagecopyresampled($imageResampled, $plantCanvas, $destOffsetX, $destOffsetY, $limitMinX, $limitMinY, $outputCanvaDimension-($spacing*2), $outputCanvaDimension-($spacing*2), $longestSourceDimension, $longestSourceDimension);


// add a texture overlay:
	$textureOverlay = imagecreatefrompng($_SERVER['DOCUMENT_ROOT']."/images/herbarium/overlays/watercolour.png");
imageAlphaBlending($textureOverlay, false);
imagecopy($imageResampled, $textureOverlay, 0, 0, 0, 0, $outputCanvaDimension, $outputCanvaDimension);

	// output:
	imagejpeg($imageResampled,$_SERVER['DOCUMENT_ROOT'].'/images/herbarium/plants/'.$plantURL.'.jpg',95);
	imagedestroy($plantCanvas);
	imagedestroy($textureOverlay);
	imagedestroy($imageResampled);
imagedestroy($petalBrush);

for ($i=0;$i<count($brushColours);$i++) {
	for ($j=0;$j<count($brushSizes);$j++) {
	imagedestroy(${'brushcol'.$i.'size'.$j});
	}
}
for ($k=0;$k<count($numberOfLeafVariationsToDraw);$k++) {
imagedestroy(${'leaf'.$k});
imagedestroy(${'leafBrush'.$k});
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



// make sure any prefixes ending in '-' don't have a space after them - so don't have "bil lilly", it's "bililly" instead:
if (substr($thisCommonName, -1, 1) == "-") {
	$thisSecondCommonName = trim($thisSecondCommonName);
}
$thisCommonName = str_replace("-", "", $thisCommonName);

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
if($i==0) {
	$primaryCommonName = $thisCommonName;
}
array_push($commonNames,$thisCommonName);
}

$commonNameString = implode(", ",$commonNames);
$commonNamesJoined = implode("/",$commonNames);
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
$butterflyColour = $butterflyColourPrefixes[mt_rand(0,count($butterflyColourPrefixes)-1)];
// make sure the first and last words aren't identical:
} while ($thisButterflyName == $thisSecondButterflyName);
$combinedButterflyName = $thisButterflyName." ".$thisSecondButterflyName;



if($isNight == 1) {
$combinedButterflyName .= " moth";
} else {
$combinedButterflyName .= " butterfly";
}


$combinedButterflyName = str_ireplace("++colour++", $butterflyColour, $combinedButterflyName);

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

$startingText = str_ireplace("++butterfly++", $combinedButterflyName, $startingText);




$startingText = str_ireplace("++commonname++", $primaryCommonName, $startingText);
$primaryCommonNamePlural = $primaryCommonName."s";
// catch special cases for plurals:
if(substr($primaryCommonName, -4) == "foot") {
$primaryCommonNamePlural = substr($primaryCommonName, 0, -4)."feet";
}
$startingText = str_ireplace("++commonnameplural++", $primaryCommonNamePlural, $startingText);

include($_SERVER['DOCUMENT_ROOT']."/includes/herbarium/petal-colours.php");
$petalColourName = array_rand($petalColours, 1);
$displayPetalColourName = $petalColourName;
$petalRed = $petalColours[$petalColourName][0];
$petalGreen = $petalColours[$petalColourName][1];
$petalBlue = $petalColours[$petalColourName][2];
if($isNight) {
	// make a darker colour:
$colourVariation = (mt_rand(1,40))-40;
} else {
$colourVariation = (mt_rand(1,80))-40;
}
$lighterNames = array("light","bright","pale");
$darkerNames = array("dark","deep");
if($colourVariation>20) {
	$displayPetalColourName = $lighterNames[mt_rand(0, count($lighterNames) - 1)]." ".$displayPetalColourName;
} else if($colourVariation<-20) {
	$displayPetalColourName = $darkerNames[mt_rand(0, count($darkerNames) - 1)]." ".$displayPetalColourName;
}
$petalRed += $colourVariation;
$petalGreen += $colourVariation;
$petalBlue += $colourVariation;



$petalRed = capValues($petalRed,0,255);
$petalGreen = capValues($petalGreen,0,255);
$petalBlue = capValues($petalBlue,0,255);


$startingText = str_ireplace("++petalcolour++", $displayPetalColourName, $startingText);


echo '<h1 style="font-style:italic;">'.$latinName.'</h1>';
echo "<h2>Common names: ".$commonNameString."</h2>";
echo '<p>'.$startingText.'</p>';

$plantURL = str_ireplace(" ", "-", trim(strtolower($latinName)));
drawPlant();

echo '<img style="display:block;" src="/images/herbarium/plants/'.$plantURL.'.jpg" width="480" height="480" alt="'.$latinName.'">';
echo '<p style="padding: 12px;display:inline-block;background:rgb('.$petalRed.','.$petalGreen.','.$petalBlue.')">Petal colour: '.$displayPetalColourName.'</p>';
echo '<p>Associated with the '.$combinedButterflyName.'.</p>';
echo '<p style="font-size:0.7em;">seed: '.$storedSeed.'</p>';





sendToTwitter();
?>
</body>
</html>