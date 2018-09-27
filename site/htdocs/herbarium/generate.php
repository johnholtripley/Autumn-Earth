<?php

// ---------------------------------------

// TO DO:
// make the pictures look more hand drawn
// add leaves that start from the stem not just a terminal node
// descriptions need more fullstops to allow content to break for twitter
// descriptions need splitting out for aquatic and night flowering plants
// add more flower variation
// add more leaf variation
// pull in countries and gods (from Pantheon) from database
// optional fruits. fruit colours. split out fruits from description and only use if the plant has any
// night flowering descriptions
// Virtues text - replace illnesses, body parts, plant parts, god's names, other plant names, regional names, peoples, references to petal colours, common name, variant names, regions, dates
// colour variation for star petals
// for the dandelion seed head, the angle offset of the stalk should be relative to the size of the seed head, so there's no overlap
// using the stepped brush sizes for the stem thicknesses shows where it jumps to the next size - it would be better to construct a single bezier curve for each edge and then fill the whole
// create function for drawing primitives (teardrop, heart shape, egg shape, spiral, etc). pass in image to draw to, colour, size, rotation, filled (Y/N), outlined (Y/N), coords



// pass in values for the heart's inset for example to better control shape

// http://develop.ae/herbarium/generate.php?seed=1538058200&debug=true

// draw continuous curve for the stalk so it's a smooth curve, then fill


// ---------------------------------------


$debug = false;
if(isset($_GET["debug"])) {
	$debug = true;
}


if($debug) {
$startTime = microtime(true);
}


require_once $_SERVER['DOCUMENT_ROOT'].'/includes/third-party/twitterOAuth/twitteroauth-0.6.2/autoload.php';
use Abraham\TwitterOAuth\TwitterOAuth;



//if(!$isLive) {
include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/functions.php");
//}

function sendToTwitter() {
	global $latinName, $startingText, $plantURL, $commonNameString, $commonNamesJoined, $isAquatic, $isNight, $storedSeed, $connection, $debug;include("auth.php");
	
$twitterConnection = new TwitterOAuth(CONSUMER_KEY, CONSUMER_SECRET, OAUTH_TOKEN, OAUTH_SECRET);
$twitterConnection->setTimeouts(10, 15);

/*
if($isLive) {
// try and get media url length
// https://dev.twitter.com/rest/reference/get/help/configuration
$config = $twitterConnection->get('help/configuration');
$mediaURLLength = intval($config->short_url_length_https);
} else {
	$mediaURLLength = 23;
}
*/
// https://blog.twitter.com/express-even-more-in-140-characters
// media links don't count towards the 140
$mediaURLLength = 0;

$media = $twitterConnection->upload('media/upload', ['media' => $_SERVER['DOCUMENT_ROOT'].'/images/herbarium/plants/'.$plantURL.'.jpg']);



$data = [
  'media_id' => $media->media_id_string,
  'alt_text' => [
    'text' => 'An image generated in the style of a medieval Herbarium'
  ]
];
$metadata = $twitterConnection->upload('media/metadata/create', $data, null, true);

//$status = $twitterConnection->post('statuses/update', ['status' => 'kitten', 'media_ids' => $media->media_id_string]);



/*


$altText = (object) ['text' => 'An image generated in the style of a medieval Herbarium'];
$parameters = [
	     'alt_text' => $altText, 
	    'media_id' => $media->media_id_string
	];
$result = $twitterConnection->post('media/metadata/create', $parameters);

var_dump($result);
*/
$textString = $latinName."\r\n".$commonNameString;
// removing the paragraph tags means a space is needed between the sentences:
$startingTextCorrected = str_replace('</p>', ' ', $startingText);

$textString .= "\r\n".strip_tags($startingTextCorrected);


// twitter doesn't handle html entities:
$textString = str_replace("&rsquo;", "'", $textString);
$textString = strip_tags($textString);
// with 'tweet_mode'=>'extended' can post 280 instead of 140:
$characterLimit = 280-$mediaURLLength;
if(strlen($textString)>$characterLimit) {

// ignore "St." - this shouldn't be the end of a sentence:
$textString = str_replace("St. ", "+ST+", $textString);
$textString = str_replace("viz. ", "+viz+", $textString);

// find the first full stop before this limit
$pos = strrpos($textString,".",0-(strlen($textString)-$characterLimit));
if ($pos !== false) {
$textString = substr($textString, 0, $pos+1);
} else {
	// isn't room for the short description:
	$textString = $latinName."\r\n".$commonNameString;
}

// restore any St.:
$textString = str_replace("+ST+", "St. ", $textString);
$textString = str_replace("+viz+", "viz. ", $textString);

}

echo "<p>Tweeted content:<br>".nl2br($textString)."</p>";




if(!$debug) {
	$parameters = [
	    'status' => $textString,
	    'media_ids' => $media->media_id_string,
	    'tweet_mode'=>'extended'
	];
	$result = $twitterConnection->post('statuses/update', $parameters);
	if ($twitterConnection->getLastHttpCode() == 200) {
	    // Tweet posted succesfully
	} else {
	    // Handle error case
	    echo $twitterConnection->getLastHttpCode();
	    // email the error? ##########
	}
}




if(!$debug) {

$query = "INSERT INTO tblplants (latinName,commonNames,commonNamesJoined,timeCreated,plantDesc,plantUrl,tweetedContent,isAquatic,isNight,plantSeed)
VALUES ('" . $latinName . "','" . mysqli_real_escape_string($connection,$commonNameString) . "','" . mysqli_real_escape_string($connection,$commonNamesJoined) . "',NOW(),'".mysqli_real_escape_string($connection,$startingText)."','".$plantURL."','".mysqli_real_escape_string($connection,$textString)."','".$isAquatic."','".$isNight."','".$storedSeed."')";

$result = mysqli_query($connection, $query) or die ("couldn't execute tblplant query".$query);
}




}



// https://stackoverflow.com/questions/20104611/find-new-coordinates-of-a-point-after-rotation#answer-20105467
function rotateCoordsY($oldX, $oldY, $rotation, $centreOffsetX, $centreOffsetY) {
	// need to translate the coords so the centre is 0,0 not $width,$height, and then translate back after the coord rotation
	$translatedCoordX = $oldX - $centreOffsetX;
	$translatedCoordY = $oldY - $centreOffsetY;
	$rotatedCoordY = $translatedCoordY*cos(deg2rad($rotation)) - $translatedCoordX*sin(deg2rad($rotation));
return ($rotatedCoordY + $centreOffsetY);
}
function rotateCoordsX($oldX, $oldY, $rotation, $centreOffsetX, $centreOffsetY) {
		$translatedCoordX = $oldX - $centreOffsetX;
	$translatedCoordY = $oldY - $centreOffsetY;
$rotatedCoordX = $translatedCoordY*sin(deg2rad($rotation)) + $translatedCoordX*cos(deg2rad($rotation));
return $rotatedCoordX + $centreOffsetX;
}




function drawEllipse($imageResource, $centreX, $centreY, $width, $height, $rotationDegrees, $brushSize, $outlineColour, $fillColour) {
	$primitiveBrush = imagecreate($brushSize,$brushSize);
	$primitiveBrushtrans = imagecolorallocate($primitiveBrush, 0, 0, 0);
	imagecolortransparent($primitiveBrush, $primitiveBrushtrans);
	$thisColour = imagecolorallocate($primitiveBrush, $outlineColour[0], $outlineColour[1], $outlineColour[2]);
	imagefilledellipse($primitiveBrush, $brushSize/2,$brushSize/2,$brushSize,$brushSize, $thisColour);
	imagesetbrush($imageResource, $primitiveBrush);
	// thanks simon nuttall http://php.net/manual/en/function.imageellipse.php
	$step=36;
	$cosangle=cos(deg2rad($rotationDegrees));
	$sinangle=sin(deg2rad($rotationDegrees));
	$px=$width * $cosangle;
	$py=$width * $sinangle;

	for ($angle=$step; $angle<=(180+$step); $angle+=$step) {
		$ox = $width * cos(deg2rad($angle));
		$oy = $height * sin(deg2rad($angle));
		$x = ($ox * $cosangle) - ($oy * $sinangle);
		$y = ($ox * $sinangle) + ($oy * $cosangle);
		if($fillColour != NULL) {
			// draw triangles:
			imagefilledpolygon($imageResource, [$centreX, $centreY, $centreX+$px, $centreY+$py, $centreX+$x, $centreY+$y], 3, imagecolorallocate($imageResource, $fillColour[0], $fillColour[1], $fillColour[2]));
			imagefilledpolygon($imageResource, [$centreX, $centreY, $centreX-$px, $centreY-$py, $centreX-$x, $centreY-$y], 3, imagecolorallocate($imageResource, $fillColour[0], $fillColour[1], $fillColour[2]));
		}
		imageline($imageResource, $centreX+$px, $centreY+$py, $centreX+$x, $centreY+$y, IMG_COLOR_BRUSHED);
		imageline($imageResource, $centreX-$px, $centreY-$py, $centreX-$x, $centreY-$y, IMG_COLOR_BRUSHED);
		$px=$x;
		$py=$y;
	}

/*
	if($fillColour != NULL) {
		imagefill ( $imageResource, $centreX,$centreY, imagecolorallocate($imageResource, $fillColour[0], $fillColour[1], $fillColour[2]) );
	}
*/
	imagedestroy($primitiveBrush);
}


function drawLine($imageResource, $startPointPosX, $startPointPosY, $length, $rotationDegrees, $outlineColour, $lineThickness) {
// create brush for line:
	$primitiveBrush = imagecreate($lineThickness,$lineThickness);
	$primitiveBrushtrans = imagecolorallocate($primitiveBrush, 0, 0, 0);
	imagecolortransparent($primitiveBrush, $primitiveBrushtrans);
	$thisColour = imagecolorallocate($primitiveBrush, $outlineColour[0], $outlineColour[1], $outlineColour[2]);
	imagefilledellipse($primitiveBrush, $lineThickness/2,$lineThickness/2,$lineThickness,$lineThickness, $thisColour);
	imagesetbrush($imageResource, $primitiveBrush);
$radians = deg2rad($rotationDegrees);
$endPointX = $startPointPosX + sin($radians)*$length;
$endPointY = $startPointPosY + cos($radians)*$length;
imageline ( $imageResource , $startPointPosX , $startPointPosY , $endPointX , $endPointY , IMG_COLOR_BRUSHED );
imagedestroy($primitiveBrush);
}





function drawStar($imageResource, $centreX, $centreY, $points, $outerRadius, $innerRadius, $brushSize, $outlineColour, $fillColour) {
	
	$outerRadius -= $brushSize;
	$petalBrush = imagecreate($brushSize,$brushSize);
	$petalBrushtrans = imagecolorallocate($petalBrush, 0, 0, 0);
	imagecolortransparent($petalBrush, $petalBrushtrans);
	$thisPetalColour = imagecolorallocate($petalBrush, $outlineColour[0], $outlineColour[1], $outlineColour[2]);
	imagefilledellipse($petalBrush, $brushSize/2, $brushSize/2, $brushSize,$brushSize, $thisPetalColour);


	imagesetbrush($imageResource, $petalBrush);
	// http://stackoverflow.com/questions/14580033/algorithm-for-drawing-a-5-point-star
	$RAD_distance = ( 2 * pi() / $points);  
	$RAD_half_PI = pi()/2; 
	$petalPoints = array();

$randomOffset = mt_rand(0,4);

	for ($i=$randomOffset; $i <= $points+$randomOffset; $i++) {
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

	for ($i=0; $i < count($petalPoints)-3; $i++) {
		$controlX = ($petalPoints[$i][0] + $petalPoints[$i+1][0]) / 2;
		$controlY = ($petalPoints[$i][1] + $petalPoints[$i+1][1]) / 2;
		quadBezier($imageResource, $previousX, $previousY, $petalPoints[$i][0], $petalPoints[$i][1], $controlX, $controlY);
		$previousX = $controlX;
		$previousY = $controlY;
	}
	// draw to last point:
	quadBezier($imageResource, $previousX, $previousY,$petalPoints[$i][0], $petalPoints[$i][1], $petalPoints[$i+1][0],$petalPoints[$i+1][1]);

if($fillColour != NULL) {
	imagefill ( $imageResource, $centreX+$brushSize,$centreY+$brushSize, imagecolorallocate($imageResource, $fillColour[0], $fillColour[1], $fillColour[2]) );
}

imagedestroy($petalBrush);
}



function drawTeardrop($imageResource, $pointPosX, $pointPosY, $width, $height, $rotationDegrees, $outlineColour, $outlineThickness, $fillColour) {

$canvasWidth = $width*2;
$canvasHeight = $height*2;

$canvasWidth = max($canvasWidth, $canvasHeight);
$canvasHeight = max($canvasWidth, $canvasHeight);

	// create a new image, so the fill doesn't get blocked by existing images underneath
	// canvas is double size, so centre of it is the 0,0 position for rotation
	$primitiveCanvas = imagecreate($canvasWidth,$canvasHeight);
	  //  imagealphablending($primitiveCanvas, false);
    // imagesavealpha($primitiveCanvas, true);
	$primitiveCanvasTrans = imagecolorallocate($primitiveCanvas, 0, 0, 0);
	imagecolortransparent($primitiveCanvas, $primitiveCanvasTrans);
	// create brush for line:
	$primitiveBrush = imagecreate($outlineThickness,$outlineThickness);
	$primitiveBrushtrans = imagecolorallocate($primitiveBrush, 0, 0, 0);
	imagecolortransparent($primitiveBrush, $primitiveBrushtrans);
	$thisColour = imagecolorallocate($primitiveBrush, $outlineColour[0], $outlineColour[1], $outlineColour[2]);
	imagefilledellipse($primitiveBrush, $outlineThickness/2,$outlineThickness/2,$outlineThickness,$outlineThickness, $thisColour);
	imagesetbrush($primitiveCanvas, $primitiveBrush);



// non rotated:
//quadBezier($primitiveCanvas, $width, $height, $width*2-$outlineThickness, $height*2-$outlineThickness, $width,$height*2-$outlineThickness);
//quadBezier($primitiveCanvas, $width, $height, 0+$outlineThickness, $height*2-$outlineThickness, $width,$height*2-$outlineThickness);



// rotated:
quadBezier($primitiveCanvas, $canvasWidth/2, $canvasHeight/2, rotateCoordsX($canvasWidth/2+$width-($outlineThickness*2), $canvasHeight/2+$height-($outlineThickness*2),$rotationDegrees,$canvasWidth/2, $canvasHeight/2), rotateCoordsY($canvasWidth/2+$width-($outlineThickness*2), $height+$canvasHeight/2-($outlineThickness*2),$rotationDegrees,$canvasWidth/2, $canvasHeight/2), rotateCoordsX($canvasWidth/2,$height+$canvasHeight/2-($outlineThickness*2),$rotationDegrees,$canvasWidth/2, $canvasHeight/2), rotateCoordsY($canvasWidth/2,$height+$canvasHeight/2-($outlineThickness*2),$rotationDegrees,$canvasWidth/2, $canvasHeight/2));

quadBezier($primitiveCanvas, $canvasWidth/2, $canvasHeight/2, rotateCoordsX($canvasWidth/2-$width+($outlineThickness*2), $canvasHeight/2+$height-($outlineThickness*2),$rotationDegrees,$canvasWidth/2, $canvasHeight/2), rotateCoordsY($canvasWidth/2-$width+($outlineThickness*2), $height+$canvasHeight/2-($outlineThickness*2),$rotationDegrees,$canvasWidth/2, $canvasHeight/2), rotateCoordsX($canvasWidth/2,$height+$canvasHeight/2-($outlineThickness*2),$rotationDegrees,$canvasWidth/2, $canvasHeight/2), rotateCoordsY($canvasWidth/2,$height+$canvasHeight/2-($outlineThickness*2),$rotationDegrees,$canvasWidth/2, $canvasHeight/2));



	if($fillColour != NULL) {
		// if $fillColour is NULL, then don't fill:
		imagefill($primitiveCanvas, rotateCoordsX($canvasWidth/2, $canvasHeight/2+$height/4,$rotationDegrees,$canvasWidth/2, $canvasHeight/2), rotateCoordsY($canvasWidth/2, $canvasHeight/2+$height/4,$rotationDegrees,$canvasWidth/2, $canvasHeight/2), imagecolorallocate($primitiveCanvas, $fillColour[0],$fillColour[1], $fillColour[2]));
	}




		// draw this canvas to the source:
		imagecopy($imageResource, $primitiveCanvas, $pointPosX-$canvasWidth/2, $pointPosY-$canvasHeight/2, 0, 0, $canvasWidth, $canvasHeight);

	imagedestroy($primitiveBrush);
	imagedestroy($primitiveCanvas);
}






function drawHeart($imageResource, $pointPosX, $pointPosY, $width, $height, $rotationDegrees, $outlineColour, $outlineThickness, $fillColour) {

$canvasWidth = $width*2;
$canvasHeight = $height*2;

$canvasWidth = max($canvasWidth, $canvasHeight);
$canvasHeight = max($canvasWidth, $canvasHeight);

	// create a new image, so the fill doesn't get blocked by existing images underneath
	// canvas is double size, so centre of it is the 0,0 position for rotation
	$primitiveCanvas = imagecreate($canvasWidth,$canvasHeight);
	  //  imagealphablending($primitiveCanvas, false);
    // imagesavealpha($primitiveCanvas, true);
	$primitiveCanvasTrans = imagecolorallocate($primitiveCanvas, 0, 0, 0);
	imagecolortransparent($primitiveCanvas, $primitiveCanvasTrans);
	// create brush for line:
	$primitiveBrush = imagecreate($outlineThickness,$outlineThickness);
	$primitiveBrushtrans = imagecolorallocate($primitiveBrush, 0, 0, 0);
	imagecolortransparent($primitiveBrush, $primitiveBrushtrans);
	$thisColour = imagecolorallocate($primitiveBrush, $outlineColour[0], $outlineColour[1], $outlineColour[2]);
	imagefilledellipse($primitiveBrush, $outlineThickness/2,$outlineThickness/2,$outlineThickness,$outlineThickness, $thisColour);
	imagesetbrush($primitiveCanvas, $primitiveBrush);

// non rotated:
		//quadBezier($primitiveCanvas, $width, $height, $width*2, $height*2, $width,$height*1.5);
		//quadBezier($primitiveCanvas, $width, $height, 0, $height*2, $width,$height*1.5);

// rotated:
quadBezier($primitiveCanvas, $canvasWidth/2, $canvasHeight/2, rotateCoordsX($canvasWidth/2+$width-($outlineThickness*2), $canvasHeight/2+$height-($outlineThickness*2),$rotationDegrees,$canvasWidth/2, $canvasHeight/2), rotateCoordsY($canvasWidth/2+$width-($outlineThickness*2), $height+$canvasHeight/2-($outlineThickness*2),$rotationDegrees,$canvasWidth/2, $canvasHeight/2), rotateCoordsX($canvasWidth/2,$height/2+$canvasHeight/2-($outlineThickness*2),$rotationDegrees,$canvasWidth/2, $canvasHeight/2), rotateCoordsY($canvasWidth/2,$height/2+$canvasHeight/2-($outlineThickness*2),$rotationDegrees,$canvasWidth/2, $canvasHeight/2));

quadBezier($primitiveCanvas, $canvasWidth/2, $canvasHeight/2, rotateCoordsX($canvasWidth/2-$width+($outlineThickness*2), $canvasHeight/2+$height-($outlineThickness*2),$rotationDegrees,$canvasWidth/2, $canvasHeight/2), rotateCoordsY($canvasWidth/2-$width+($outlineThickness*2), $height+$canvasHeight/2-($outlineThickness*2),$rotationDegrees,$canvasWidth/2, $canvasHeight/2), rotateCoordsX($canvasWidth/2,$height/2+$canvasHeight/2-($outlineThickness*2),$rotationDegrees,$canvasWidth/2, $canvasHeight/2), rotateCoordsY($canvasWidth/2,$height/2+$canvasHeight/2-($outlineThickness*2),$rotationDegrees,$canvasWidth/2, $canvasHeight/2));

	

	if($fillColour != NULL) {
		// if $fillColour is NULL, then don't fill:
		imagefill($primitiveCanvas, rotateCoordsX($canvasWidth/2, $canvasHeight/2+$height/4,$rotationDegrees,$canvasWidth/2, $canvasHeight/2), rotateCoordsY($canvasWidth/2, $canvasHeight/2+$height/4,$rotationDegrees,$canvasWidth/2, $canvasHeight/2), imagecolorallocate($primitiveCanvas, $fillColour[0],$fillColour[1], $fillColour[2]));
	}




		// draw this canvas to the source:
		imagecopy($imageResource, $primitiveCanvas, $pointPosX-$canvasWidth/2, $pointPosY-$canvasHeight/2, 0, 0, $canvasWidth, $canvasHeight);

	imagedestroy($primitiveBrush);
	imagedestroy($primitiveCanvas);
}


function createColourVariation($red, $green, $blue) {
// create variation in the input colour:
$darkenOrLighten = mt_rand(0,1);
$colourAdjustAmount = mt_rand(4,24);
if($darkenOrLighten == 0) {
$colourAdjustAmount = 0-$colourAdjustAmount;
}
$red = $red+$colourAdjustAmount;
$green = $green+$colourAdjustAmount;
$blue = $blue+$colourAdjustAmount;

$red = capValues($red,0,255);
$green = capValues($green,0,255);
$blue = capValues($blue,0,255);
return [$red, $green, $blue];
}

function darkenColourVariation($red, $green, $blue, $colourAdjustAmount) {
$red = $red-$colourAdjustAmount;
$green = $green-$colourAdjustAmount;
$blue = $blue-$colourAdjustAmount;

$red = capValues($red,0,255);
$green = capValues($green,0,255);
$blue = capValues($blue,0,255);
return [$red, $green, $blue];
}



function addPrefix($thisCommonName, $shouldForcePrefix) {
	

if($shouldForcePrefix) {
$shouldAddPrefix = mt_rand(1,10);
} else {
	$shouldAddPrefix = mt_rand(1,44);
}


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
                  case 5:
         $thisCommonName = "Trailing ".$thisCommonName;
        break;
      case 6:
         $thisCommonName = "Marsh* ".$thisCommonName;
        break;
case 7:
         $thisCommonName = "Autumn ".$thisCommonName;
         break;
         case 8:
         $thisCommonName = "Sweet ".$thisCommonName;
        break;
            case 9:
         $thisCommonName = "Our Lady's ".$thisCommonName;
        break;
case 10:
$thisCommonName = "Creeping ".$thisCommonName;
break;
    default:
       $thisCommonName = ucfirst($thisCommonName);
} 
return $thisCommonName;
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
	$storedSeed = intval($_GET["seed"]);
} else {
	$storedSeed = makeSeed();
}
mt_srand($storedSeed);





function quadBezier($im, $x1, $y1, $x2, $y2, $x3, $y3) {
	// x2 and y2 are the coords for the control point
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
				if(strrpos($rules[$c], "|") !== false) {
$alternativeRule = explode("|",$rules[$c]);
// add just 1 of the alternatives:
$result.= $alternativeRule[mt_rand(0, count($alternativeRule) - 1)];

				} else {
					$result.=$rules[$c];
				}
				
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
	$canvaDimension = 2500;
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

	// $allPossibleRules = array(array("X"=>"S2X[+X]X[-X]X"),array("X"=>"S2X[+X]X[-X][X]"),array("X"=>"S3XX-[-X+X+X]+[+X-X-X]"),array("X"=>"S2F[+X]F[-X]+X","F"=>"FF"),array("X"=>"S2F[+X][-X]FX","F"=>"FF"),array("X"=>"S2F-[[X]+X]+F[+FX]-X","F"=>"FF"));
	// a pipe means 'or'
$allPossibleRules = array(array("X"=>"F","F"=>"FF[+FL][-FL]|FF[+FFL][-FFL]"), array("X"=>"F","F"=>"FF[+FFL][-FFL]|FF[+FL][-FFL]|FF[+FFL][-FL]"), array("X"=>"F","F"=>"FF[+FL][-FL]|FF[++FL][-FL]|FF[+FL][--FL]"));





	$allPossibleRuleIterations = array(4,3,4);
$allPossibleRuleDistances = array(50,50,40);

	//$startAngle = mt_rand (-20,20);
	$startAngle = 0;
	$angle = mt_rand(22,40);



// root rules:
$rootAxiom = "F";
$allPossibleRootRules = array(array("F"=>"FF[+X+X][-X-X]"));
$allPossibleRootRuleIterations = array(3);
$allPossibleRootRuleDistances = array(35);




$startRootAngle = 180 + $startAngle;
//$startRootAngle = capValues($startRootAngle,0,360);

if($startRootAngle > 360) {
$startRootAngle -= 360;
}
if($startRootAngle < 360) {
$startRootAngle += 360;
}

$rootAngle = 180 + $startAngle;

if($rootAngle > 360) {
$rootAngle -= 360;
}
if($rootAngle < 360) {
$rootAngle += 360;
}



/*
// testing ------------------------
$allPossibleRules = array(array("X"=>"F","F"=>"FF[+FL][-FL][++FL][--FL]"), array("X"=>"F","F"=>"FF[++FL][--FL]"));
$allPossibleRuleIterations = array(4,4);
$allPossibleRuleDistances = array(50,50);
$startAngle = 0;
$angle = 30;
$startRootAngle = 180 + $startAngle;
$startRootAngle = capValues($startRootAngle,0,360);
// testing ------------------------
*/







	$whichRules = random_key($allPossibleRules);
	$rules = $allPossibleRules[$whichRules];
	$iterations = $allPossibleRuleIterations[$whichRules];
$distance = $allPossibleRuleDistances[$whichRules];
	
	
$commandString = createCommandString($axiom, $rules, $iterations);

$whichRootRules = random_key($allPossibleRootRules);
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
// start at grid 0,0 facing south with no colour index
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


// prepare leaf graphic - pick a leaf type:
$whichLeafType = mt_rand(1,2);



switch ($whichLeafType) {
	case 1:
// simple broad leaf type

$numberOfLeafVariationsToDraw = 4;
$leafCanvasWidth = 100;
$leafCanvasHeight = mt_rand(100,170);
$leafInset = 10;
for ($k=0;$k<$numberOfLeafVariationsToDraw;$k++) {

	${'leaf'.$k} = imagecreate($leafCanvasWidth,$leafCanvasHeight);

	$leafTrans = imagecolorallocate(${'leaf'.$k}, 0, 0, 0);
	imagecolortransparent(${'leaf'.$k}, $leafTrans);


$leafVariation = createColourVariation($thisLeafColour[0],$thisLeafColour[1],$thisLeafColour[2]);





	${'leafColour'.$k} = imagecolorallocate(${'leaf'.$k}, $leafVariation[0], $leafVariation[1], $leafVariation[2]);

	${'leafBrush'.$k} = imagecreate(6,6);
	$leafBrushTrans = imagecolorallocate(${'leafBrush'.$k}, 0, 0, 0);
	imagecolortransparent(${'leafBrush'.$k}, $leafBrushTrans);
	${'leafBrushColour'.$k} = imagecolorallocate(${'leafBrush'.$k}, $leafVariation[0], $leafVariation[1], $leafVariation[2]);
	imagefilledellipse(${'leafBrush'.$k}, 3,3,6,6, ${'leafBrushColour'.$k});
	imagesetbrush(${'leaf'.$k}, ${'leafBrush'.$k});


	
	// leaf start needs to be the centre of the leaf image so it can be positioned correctly
	quadBezier(${'leaf'.$k}, $leafCanvasWidth/2, $leafCanvasHeight/2, $leafCanvasWidth-$leafInset, $leafCanvasHeight/2-$leafInset, $leafCanvasWidth/2,$leafInset);
	quadBezier(${'leaf'.$k}, $leafCanvasWidth/2, $leafCanvasHeight/2, $leafInset, $leafCanvasHeight/2-$leafInset, $leafCanvasWidth/2,$leafInset);
	imagefill(${'leaf'.$k}, $leafCanvasWidth/2, $leafCanvasHeight/2-$leafInset*2, ${'leafBrushColour'.$k});
	imageline ( ${'leaf'.$k} , $leafCanvasWidth/2, $leafCanvasHeight/2 , $leafCanvasWidth/2, $leafInset , imagecolorallocate(${'leaf'.$k}, 6,42,30 ));
	
	// can vary this to get heart shaped, double bladed and teardrop shapes ### 
	
	
}

break;

case 2:
// radiating tear drop shape (clover?)

$numberOfLeafVariationsToDraw = 4;
$leafCanvasWidth = 120;
$leafCanvasHeight = 180;

for ($k=0;$k<$numberOfLeafVariationsToDraw;$k++) {

	${'leaf'.$k} = imagecreate($leafCanvasWidth,$leafCanvasHeight);
	imagealphablending(${'leaf'.$k}, false);
	imagesavealpha(${'leaf'.$k}, true);
	$leafTrans = imagecolorallocate(${'leaf'.$k}, 0, 0, 0);
	imagecolortransparent(${'leaf'.$k}, $leafTrans);
	$leafVariation = createColourVariation($thisLeafColour[0],$thisLeafColour[1],$thisLeafColour[2]);

	$numberOfLeafHeads = mt_rand(5,7);
	$leafHeadRotationOffset = mt_rand(-10,10);
	$leafThickness = mt_rand(8,12);

	$numberOfLeafHeads = 5;
	$leafThickness = 4;

/*
	for ($lh=0;$lh<$numberOfLeafHeads;$lh++) {
		// add 1 to leafHeads number so there's an empty position for the stalk to attach to:
		$thisLeafHeadRotation = ((360/($numberOfLeafHeads+1))*$lh)+$leafHeadRotationOffset+90;
		drawTeardrop(${'leaf'.$k}, $leafCanvasWidth/2, $leafCanvasHeight/2, $leafCanvasWidth/$leafThickness, $leafCanvasHeight/4, $thisLeafHeadRotation, [$leafVariation[0],$leafVariation[1],$leafVariation[2]], 6, [$leafVariation[0],$leafVariation[1],$leafVariation[2]]);
	}
*/

$darkenedOutlineColour = darkenColourVariation($leafVariation[0],$leafVariation[1],$leafVariation[2],50);
	for ($lh=0;$lh<$numberOfLeafHeads;$lh++) {
		// add 1 to leafHeads number so there's an empty position for the stalk to attach to:
		$thisLeafHeadRotation = ((360/($numberOfLeafHeads+1))*$lh)+$leafHeadRotationOffset+90;
		drawTeardrop(${'leaf'.$k}, $leafCanvasWidth/2, $leafCanvasHeight/2, $leafCanvasWidth/$leafThickness, $leafCanvasHeight/4, $thisLeafHeadRotation, [$darkenedOutlineColour[0],$darkenedOutlineColour[1],$darkenedOutlineColour[2]], 2, [$leafVariation[0],$leafVariation[1],$leafVariation[2]]);
		// draw centre line:
		drawLine(${'leaf'.$k}, $leafCanvasWidth/2, $leafCanvasHeight/2, ($leafCanvasHeight/4)*0.707, $thisLeafHeadRotation, [$darkenedOutlineColour[0],$darkenedOutlineColour[1],$darkenedOutlineColour[2]], 2);
	}





}
break;
}



// prepare flower graphic - pick a flower type:
$whichFlowerType = mt_rand(1,3);

switch ($whichFlowerType) {
	case 1:
$numberOfFlowerVariationsToDraw = 4;
$flowerCanvasSize = 90;
for ($k=0;$k<$numberOfFlowerVariationsToDraw;$k++) {
	$petalVariation = createColourVariation($petalRed,$petalGreen,$petalBlue);
	${'flower'.$k} = imagecreate($flowerCanvasSize,$flowerCanvasSize);
	$flowerTrans = imagecolorallocate(${'flower'.$k}, 0, 0, 0);
	imagecolortransparent(${'flower'.$k}, $flowerTrans);
$darkenedOutlineColour = darkenColourVariation($petalVariation[0],$petalVariation[1],$petalVariation[2],50);
drawStar(${'flower'.$k}, $flowerCanvasSize/2, $flowerCanvasSize/2, mt_rand(6,12), ($flowerCanvasSize/2), 20, 2, [$darkenedOutlineColour[0],$darkenedOutlineColour[1],$darkenedOutlineColour[2]],[$petalVariation[0], $petalVariation[1], $petalVariation[2]]);
	imagefilledellipse ( ${'flower'.$k} , $flowerCanvasSize/2, $flowerCanvasSize/2 , $flowerCanvasSize/6 , $flowerCanvasSize/6 , imagecolorallocate(${'flower'.$k}, 184,126,80 ) );
}


break;
case 2:
//radiating circles type (dandelion?)
$numberOfFlowerVariationsToDraw = 3;
$flowerCanvasSize = 90;
for ($k=0;$k<$numberOfFlowerVariationsToDraw;$k++) {
	${'flower'.$k} = imagecreate($flowerCanvasSize,$flowerCanvasSize);
	$flowerTrans = imagecolorallocate(${'flower'.$k}, 0, 0, 0);
	imagecolortransparent(${'flower'.$k}, $flowerTrans);
$numberOfSpokes = mt_rand(5,12);
$numberOfSpokes = 8;
$lengthOfSpoke = 30;
$angleInc = 2*M_PI/$numberOfSpokes;
// make the stalks not be too vertical or horizontal:
$angleOffset = mt_rand(20,100)/100;
$stalkColour = imagecolorallocate(${'flower'.$k}, 6,42,30 );
$petalVariation = createColourVariation($petalRed,$petalGreen,$petalBlue);
$petalColour = imagecolorallocate(${'flower'.$k}, $petalVariation[0], $petalVariation[1], $petalVariation[2] );

for ($i=0; $i<$numberOfSpokes; $i++) {
	$spokeHeadRadius = mt_rand(18,24);
	$angleRandomiseOffset = mt_rand(-50,50)/250;
	$endX = $flowerCanvasSize/2 + $lengthOfSpoke*cos($angleInc*$i+$angleOffset+$angleRandomiseOffset);
$endY = $flowerCanvasSize/2 + $lengthOfSpoke*sin($angleInc*$i+$angleOffset);
imageline ( ${'flower'.$k} , $flowerCanvasSize/2, $flowerCanvasSize/2 , $endX, $endY , $stalkColour);
imagefilledellipse(${'flower'.$k}, $endX, $endY, $spokeHeadRadius, $spokeHeadRadius, $petalColour);
imageellipse(${'flower'.$k}, $endX, $endY, $spokeHeadRadius, $spokeHeadRadius, $stalkColour);
}

}


break;




	case 3:
$numberOfFlowerVariationsToDraw = 4;
$flowerCanvasSize = 200;
for ($k=0;$k<$numberOfFlowerVariationsToDraw;$k++) {
	$petalVariation = createColourVariation($petalRed,$petalGreen,$petalBlue);
	${'flower'.$k} = imagecreate($flowerCanvasSize,$flowerCanvasSize);
	$flowerTrans = imagecolorallocate(${'flower'.$k}, 0, 0, 0);
	imagecolortransparent(${'flower'.$k}, $flowerTrans);
$darkenedOutlineColour = darkenColourVariation($petalVariation[0],$petalVariation[1],$petalVariation[2],50);

$numberOfPetals = mt_rand(4,9);
$petalWidth = 20;
$petalHeight = 40;



for ($l=0;$l<$numberOfPetals;$l++) {
	$thisRotation = 360/$numberOfPetals*$l;
	// offset the petal around the centre:
$radians = deg2rad($thisRotation);
$thisOffsetCentreX = $flowerCanvasSize/2 + sin($radians)*$petalHeight/2;
$thisOffsetCentreY = $flowerCanvasSize/2 + cos($radians)*$petalHeight/2;


drawEllipse(${'flower'.$k}, $thisOffsetCentreX, $thisOffsetCentreY, $petalWidth, $petalHeight, $thisRotation, 2, [$darkenedOutlineColour[0],$darkenedOutlineColour[1],$darkenedOutlineColour[2]],[$petalVariation[0], $petalVariation[1], $petalVariation[2]]);
}





	//imagefilledellipse ( ${'flower'.$k} , $flowerCanvasSize/2, $flowerCanvasSize/2 , $flowerCanvasSize/6 , $flowerCanvasSize/6 , imagecolorallocate(${'flower'.$k}, 184,126,80 ) );
}
break;




}









foreach ($allLeaves as $thisLeaf) {

	$thisPointX = $thisLeaf[0];
	$thisPointY = $thisLeaf[1];
	$thisRotation = $thisLeaf[2];

		if(array_key_exists($thisPointX."_".$thisPointY,$lengthsOfNodes)) {
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

if($thisRotation != 0) {
	$pngTransparency = imagecolorallocatealpha(${$whichElementToUse} , 0, 0, 0, 127);
	imagefill(${$whichElementToUse} , 0, 0, $pngTransparency);

/*
// weird bug on live - if rotating more than 45 degrees it would add black where the transparency should be. So rotate twice - once to get as close as possible in whole 90 degree increments, and then the last bit:
$steppedRotation  = 90 * floor($thisRotation/90);
	$rotatedLeaf = imagerotate(${$whichElementToUse}, $steppedRotation, $pngTransparency);
// now rotate again for the difference:
$thisNextRotation = $thisRotation-$steppedRotation;
$pngTransparency = imagecolorallocatealpha($rotatedLeaf , 255, 255, 255, 127);
$rotatedLeaf = imagerotate($rotatedLeaf, $thisNextRotation, $pngTransparency);
*/


$rotatedLeaf = imagerotate(${$whichElementToUse}, $thisRotation, $pngTransparency);



	$rotatedLeafWidth = imagesx($rotatedLeaf);
	$rotatedLeafHeight = imagesy($rotatedLeaf);
	imagecopyresampled($plantCanvas, $rotatedLeaf, $thisPointX-($rotatedLeafWidth)/2, $thisPointY-($rotatedLeafHeight/2), 0, 0, $rotatedLeafWidth, $rotatedLeafHeight, $rotatedLeafWidth, $rotatedLeafHeight);
	imagedestroy($rotatedLeaf);
} else {
	// no need to rotate them:
	$rotatedLeafWidth = imagesx(${$whichElementToUse});
	$rotatedLeafHeight = imagesy(${$whichElementToUse});
	imagecopyresampled($plantCanvas, ${$whichElementToUse}, $thisPointX-($rotatedLeafWidth)/2, $thisPointY-($rotatedLeafHeight/2), 0, 0, $rotatedLeafWidth, $rotatedLeafHeight, $rotatedLeafWidth, $rotatedLeafHeight);
}
}
}
}

/*
drawPrimitive('teardrop',$plantCanvas, $canvaDimension/2, $canvaDimension/2, 120, 180, 240, [255,255,0], 6, [255,0,0]);
drawPrimitive('teardrop',$plantCanvas, $canvaDimension/2, $canvaDimension/2, 120, 180, 120, [255,255,0], 6, [255,0,0]);
drawPrimitive('teardrop',$plantCanvas, $canvaDimension/2, $canvaDimension/2, 120, 180, 30, [255,255,0], 6, [255,0,0]);
drawPrimitive('teardrop',$plantCanvas, $canvaDimension/2, $canvaDimension/2, 120, 180, 300, [255,255,0], 6, [255,0,0]);
*/

//drawPrimitive('teardrop',$plantCanvas, $canvaDimension/2, $canvaDimension/2, 120, 120, 0, [255,255,0], 6, [255,0,0]);
//drawPrimitive('heart',$plantCanvas, $canvaDimension/2, $canvaDimension/2, 120, 120, 90, [255,255,0], 6, [255,0,0]);
//drawPrimitive('teardrop',$plantCanvas, $canvaDimension/2, $canvaDimension/2, 120, 120, 180, [255,255,0], 6, [255,0,0]);
//drawPrimitive('heart',$plantCanvas, $canvaDimension/2, $canvaDimension/2, 120, 120, 270, [255,255,0], 6, [255,0,0]);

/*
$rotatedLeafWidth = imagesx($leaf0);
$rotatedLeafHeight = imagesy($leaf0);
imagecopyresampled($plantCanvas, $leaf0, 100, 100, 0, 0, $rotatedLeafWidth, $rotatedLeafHeight, $rotatedLeafWidth, $rotatedLeafHeight);
*/
/*
$rotatedLeaf = imagerotate($leaf0, 45, $pngTransparency);
$rotatedLeafWidth = imagesx($rotatedLeaf);
$rotatedLeafHeight = imagesy($rotatedLeaf);
imagecopyresampled($plantCanvas, $rotatedLeaf, 50, 0, 0, 0, $rotatedLeafWidth, $rotatedLeafHeight, $rotatedLeafWidth, $rotatedLeafHeight);
*/









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
} while ( ($limitMinY<$canvaDimension) && ($foundBG));

$x=0;
$limitMaxY=$canvaDimension-1;
do {
	$foundBG = isBackgroundColour($plantCanvas,$x,$limitMaxY);
	$x++;
	if($x>=$canvaDimension) {
	$x=0;
		$limitMaxY --;
	}
} while ( ($limitMaxY>0) && ($foundBG));

$limitMinX=0;
$y=0;
do {
	$foundBG = isBackgroundColour($plantCanvas,$limitMinX,$y);
	$y++;
	if($y>=$canvaDimension) {
	$y=0;
		$limitMinX ++;
	}
} while ( ($limitMinX<$canvaDimension) && ($foundBG));

$y=0;
$limitMaxX=$canvaDimension-1;
do {
	$foundBG = isBackgroundColour($plantCanvas,$limitMaxX,$y);
	$y++;
	if($y>=$canvaDimension) {
	$y=0;
		$limitMaxX --;
	}
} while ( ($limitMaxX>0) && ($foundBG));




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

if(isset($petalBrush)) {
imagedestroy($petalBrush);
}

for ($i=0;$i<count($brushColours);$i++) {
	for ($j=0;$j<count($brushSizes);$j++) {
	imagedestroy(${'brushcol'.$i.'size'.$j});
	}
}
for ($k=0;$k<$numberOfLeafVariationsToDraw;$k++) {
imagedestroy(${'leaf'.$k});
if(isset(${'leafBrush'.$k})) {
imagedestroy(${'leafBrush'.$k});
}
}








}


function random_key($array){
	// https://stackoverflow.com/questions/25799466/php-better-than-array-rand-qa
    $keys=array_keys($array);
    return $keys[mt_rand(0, count($keys) - 1)];
}


// create latin name:
$latinFile = file_get_contents($_SERVER['DOCUMENT_ROOT'].'/includes/herbarium/latin-name-syllables.txt');
$latinSyllables = unserialize($latinFile);
$numberOfSyllablesAvailable = count($latinSyllables);


do {
$syllableCount = 0;
// pick a random start syllable:
$firstWord = random_key($latinSyllables);
$latinName = $firstWord;
do {
	
$nextSyllable = $latinSyllables[$firstWord][mt_rand(0,count($latinSyllables[$firstWord])-1)];
$latinName .= $nextSyllable;
$firstWord = $nextSyllable;
$syllableCount ++;
} while ($nextSyllable != " ");
} while (!(($syllableCount>=3) && ($syllableCount<=6)));

do {
$syllableCount = 0;
$secondWord = random_key($latinSyllables);
$secondLatinName = $secondWord;

do {
$nextSyllable = $latinSyllables[$secondWord][mt_rand(0,count($latinSyllables[$secondWord])-1)];
$secondLatinName .= $nextSyllable;
$secondWord = $nextSyllable;
$syllableCount ++;
} while ($nextSyllable != " ");
} while (!(($syllableCount>=3) && ($syllableCount<=6)));
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

// get region names:
$json['region'] = [];
$queryRegions = "select * from tblregions";
$resultRegions = mysqli_query($connection, $queryRegions) or die ("couldn't execute Regions query");
while ($rowRegions = mysqli_fetch_array($resultRegions)) {
    extract($rowRegions);
    array_push($json['region'], $regionName);
}

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

// remove any property markers now:
$thisCommonName = str_ireplace("*", "", $thisCommonName);
$thisCommonName = str_ireplace("^", "", $thisCommonName);




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
$thisCommonNameBeforePrefix = $thisCommonName;



$thisCommonName = addPrefix($thisCommonName, false);







if($i==0) {
	$primaryCommonName = $thisCommonName;
	do {
$variantCommonName = addPrefix($thisCommonNameBeforePrefix, true);
} while ($variantCommonName == $primaryCommonName);
$variantCommonName = str_ireplace("*", "", $variantCommonName);
$variantCommonName = str_ireplace("^", "", $variantCommonName);
$variantCommonName = str_replace("  ", " ", $variantCommonName);
}
array_push($commonNames,$thisCommonName);
}




$commonNameString = implode(", ",$commonNames);
$commonNamesJoined = implode("/",$commonNames);
if(count($commonNames)>1) {
	$lastCommaPos = strrpos($commonNameString, ",");
	$randomDetail = mt_rand(1,9);

if($randomDetail == 1) {
// add in specific detail:
	$commonNameString = substr($commonNameString, 0, $lastCommaPos)   .", and by apothecaries known as".   substr($commonNameString, $lastCommaPos+1);
} else if($randomDetail == 2) {
// add in specific detail:
	$commonNameString = substr($commonNameString, 0, $lastCommaPos)   ."; some call it".   substr($commonNameString, $lastCommaPos+1);

} else if($randomDetail == 3) {
// add in specific detail:

$commonNameString = substr($commonNameString, 0, $lastCommaPos)   ."; alchymists know it as".   substr($commonNameString, $lastCommaPos+1);

} else {
// replace last "," with an "or":
	
	$commonNameString = substr($commonNameString, 0, $lastCommaPos)   ." or".   substr($commonNameString, $lastCommaPos+1);
}


}

$whichBaseStringToUse = "origin";
if($isAquatic == 1) {
	$whichBaseStringToUse = "origin-aquatic";
} else if($isNight == 1) {
	$whichBaseStringToUse = "origin-night";
}


$entriesAlreadyUsed = [];
// pick a random item from the Origin to start from:
$whichElem = mt_rand(0,(count($json[$whichBaseStringToUse])-1));
$startingText = $json[$whichBaseStringToUse][$whichElem];
$startingText = findAndReplaceHashes($startingText);


$entriesAlreadyUsed = [];
if($isAquatic != 1) {
$whichPlaceElem = mt_rand(0,(count($json["place"])-1));
$placeText = $json["place"][$whichPlaceElem];
} else {
	$whichPlaceElem = mt_rand(0,(count($json["place-aquatic"])-1));
$placeText = $json["place-aquatic"][$whichPlaceElem];
}
$placeText = findAndReplaceHashes($placeText);

$entriesAlreadyUsed = [];
$whichTimeElem = mt_rand(0,(count($json["time"])-1));
$timeText = $json["time"][$whichTimeElem];
$timeText = findAndReplaceHashes($timeText);

$entriesAlreadyUsed = [];
$whichVirtuesElem = mt_rand(0,(count($json["virtues"])-1));
$virtueText = $json["virtues"][$whichVirtuesElem];
$virtueText = findAndReplaceHashes($virtueText);

$insectDetails = "";

$entriesAlreadyUsed = [];
if($isAquatic != 1) {
	// aquatic plants shouldn't refer to butterflies
if(mt_rand(1,3) == 1) {

if($isNight == 1) {
if(mt_rand(1,2) == 1) {
// use a bat instead:
$whichInsectElem = mt_rand(0,(count($json["batDetails"])-1));
$insectDetails = $json["batDetails"][$whichInsectElem];
$insectDetails = findAndReplaceHashes($insectDetails)." ";
} else {
$whichInsectElem = mt_rand(0,(count($json["insectDetails"])-1));
$insectDetails = $json["insectDetails"][$whichInsectElem];
$insectDetails = findAndReplaceHashes($insectDetails)." ";	
}
} else {
$whichInsectElem = mt_rand(0,(count($json["insectDetails"])-1));
$insectDetails = $json["insectDetails"][$whichInsectElem];
$insectDetails = findAndReplaceHashes($insectDetails)." ";
}


}
}

$startingText = '<p>'.ucfirst($startingText).'</p>';

$startingText .= '<p>'.ucfirst($placeText) .'</p><p>'. ucfirst($insectDetails) . '</p><p>'.ucfirst($timeText) . '</p><p>'.ucfirst($virtueText).'</p>';


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
$combinedButterflyPluralName = $thisButterflyName." ".$thisSecondButterflyName;



if($isNight == 1) {
$combinedButterflyName .= " moth";
$combinedButterflyPluralName .= " moths";
} else {
$combinedButterflyName .= " butterfly";
$combinedButterflyPluralName .= " butterflies";
}


$combinedButterflyName = str_ireplace("++colour++", $butterflyColour, $combinedButterflyName);
$combinedButterflyPluralName = str_ireplace("++colour++", $butterflyColour, $combinedButterflyPluralName);

$shouldAddButterflyPrefix = mt_rand(1,30);
switch ($shouldAddButterflyPrefix) {
    case 1:
        $combinedButterflyName = "Lesser ".$combinedButterflyName;
        $combinedButterflyPluralName = "Lesser ".$combinedButterflyPluralName;
        break;
    case 2:
         $combinedButterflyName = "Common ".$combinedButterflyName;
         $combinedButterflyPluralName = "Common ".$combinedButterflyPluralName;
        break;
    default:
       $combinedButterflyName = ucfirst($combinedButterflyName);
       $combinedButterflyPluralName = ucfirst($combinedButterflyPluralName);
} 

$startingText = str_ireplace("++butterfly++", $combinedButterflyName, $startingText);
$startingText = str_ireplace("++butterflies++", $combinedButterflyPluralName, $startingText);


// construct a bat name:
$combinedBatName = '';
$batJsonResults = file_get_contents($_SERVER['DOCUMENT_ROOT'].'/includes/herbarium/bat-grammar.json');
$batJson = json_decode($batJsonResults, true);
$whichBatElem = mt_rand(0,(count($batJson['name'])-1));
$combinedBatName = $batJson['name'][$whichBatElem];
$batConnector = 'the ';
$batExtendingName = '';
switch (mt_rand(0,2)) {
case 0:
$batExtendingName = $batJson['prefix'][(mt_rand(0,(count($batJson['prefix'])-1)))];
break;
case 1:
$batExtendingName = $batJson['colour'][(mt_rand(0,(count($batJson['colour'])-1)))];
break;
case 2:
$batExtendingName = $batJson['evocative'][(mt_rand(0,(count($batJson['evocative'])-1)))];
break;
}
$batPhysicalName = $batJson['physical'][(mt_rand(0,(count($batJson['physical'])-1)))];
switch (mt_rand(0,4)) {
case 0:
$combinedBatName = $batExtendingName." ".$combinedBatName;
break;
case 1:
$combinedBatName = $batPhysicalName." ".$combinedBatName;
break;
case 2:
$combinedBatName = $batExtendingName." ".$batPhysicalName." ".$combinedBatName;
break;
}
// potentially add a geographic or a biologist's name:
$batModifer = mt_rand(0,6);
switch ($batModifer) {
    case 0:
    $combinedBatName = $batJson['geography'][(mt_rand(0,(count($batJson['geography'])-1)))].' '.$combinedBatName;
    break;
    case 1:
    $combinedBatName = $batJson['biologist'][(mt_rand(0,(count($batJson['biologist'])-1)))]."&apos;s ".$combinedBatName;;
    // don't want a 'the' before the name:
    $batConnector = '';
    break;
}

// find any colours:
$batColour = $batJson['colour'][(mt_rand(0,(count($batJson['colour'])-1)))];
$combinedBatName = str_replace("#|colour#", $batColour, $combinedBatName);

// if the bat just has a single word, then add 'common' to it:
if(str_word_count($combinedBatName) < 2) {
$combinedBatName = 'common '.$combinedBatName;
}

$combinedBatName = $batConnector . ucfirst($combinedBatName);


if(substr($combinedBatName, -1) == "x") {
    $combinedBatPluralName = $combinedBatName."es";
} else {
   $combinedBatPluralName = $combinedBatName.'s'; 
}
$combinedBatPluralName = str_replace("the ", "", $combinedBatPluralName);


$startingText = str_ireplace("++bat++", $combinedBatName, $startingText);
$startingText = str_ireplace("++bats++", $combinedBatPluralName, $startingText);



$startingText = str_ireplace("++commonname++", $primaryCommonName, $startingText);

$startingText = str_ireplace("++variantcommonname++", $variantCommonName, $startingText);



$primaryCommonNamePlural = $primaryCommonName."s";
// catch special cases for plurals:
if(substr($primaryCommonName, -4) == "foot") {
$primaryCommonNamePlural = substr($primaryCommonName, 0, -4)."feet";
}
if(substr($primaryCommonName, -2) == "ss") {
    $primaryCommonNamePlural = $primaryCommonName."es";
} else if(substr($primaryCommonName, -1) == "s") {
    $primaryCommonNamePlural = $primaryCommonName;
}




if(substr($primaryCommonName, -1) == "y") {
	// check letter before the Y isn't a vowel:
	if((substr($primaryCommonName, -2, 1) != "a") && (substr($primaryCommonName, -2, 1) != "e") && (substr($primaryCommonName, -2, 1) != "i") && (substr($primaryCommonName, -2, 1) != "o") && (substr($primaryCommonName, -2, 1) != "u")) {
    $primaryCommonNamePlural = substr($primaryCommonName, 0, -1)."ies";
}
}
if(substr($primaryCommonName, -1) == "x") {
    $primaryCommonNamePlural = $primaryCommonName."es";
}

$startingText = str_ireplace("++commonnameplural++", $primaryCommonNamePlural, $startingText);

include($_SERVER['DOCUMENT_ROOT']."/includes/herbarium/petal-colours.php");
$petalColourName = random_key($petalColours);
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
$darkerNames = array("dark","deep", "sombre");
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

$displayPetalColourIshName = $displayPetalColourName."ish";
if($displayPetalColourIshName == "redish") {
$displayPetalColourIshName = "reddish";
}


$startingText = str_ireplace("++petalcolourish++", $displayPetalColourIshName, $startingText);






function str_replace_first($from, $to, $subject) {
	// https://stackoverflow.com/questions/1252693/using-str-replace-so-that-it-only-acts-on-the-first-match
    $from = '/'.preg_quote($from, '/').'/';
    return preg_replace($from, $to, $subject, 1);
}




// add in month name(s):
if(strpos($startingText, '++month++') !== false) {
	$allMonths = array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");

	$nextMonth = mt_rand(0, count($allMonths) - 1);

	do {
		$startingText = str_replace_first('++month++', $allMonths[$nextMonth], $startingText);
		// for any further occurences, use the subsequent month name to make more sense:
		$nextMonth++;
		if($nextMonth >= count($allMonths)) {
			$nextMonth = 0;
		}
	} while (strpos($startingText, '++month++') !== false);

}

if(strpos($startingText, '++otherplants++') !== false) {
	// find other plant names:
	$plantNameQuery = "SELECT * from tblplants ORDER BY timeCreated DESC LIMIT 36";
	$plantNameResult = mysqli_query($connection, $plantNameQuery) or die ("couldn't execute query");
	$otherPlantNames = array();
	$otherPlantNameURLs = array();
	if (mysqli_num_rows($plantNameResult) > 0) {
	  while ($row = mysqli_fetch_array($plantNameResult)) {
	    extract($row);
	    $otherNames =  explode("/",$commonNamesJoined);
	    array_push($otherPlantNames,$otherNames[0]);
	    array_push($otherPlantNameURLs,$plantUrl);
	  }
	}
	mysqli_free_result($plantNameResult);
	$plantNamesUsed = mt_rand(0, count($otherPlantNames) - 1);
	do {
		$startingText = str_replace_first('++otherplants++', '<a href="https://www.autumnearth.com/herbarium/'.$otherPlantNameURLs[$plantNamesUsed].'/">'.$otherPlantNames[$plantNamesUsed].'</a>', $startingText);
	
		$plantNamesUsed++;
		if($plantNamesUsed >= count($plantNamesUsed)) {
			$plantNamesUsed = 0;
		}
	} while (strpos($startingText, '++otherplants++') !== false);
}

$commonNameIntro = array(
"It is likewise known as ",
"It is likewise called ",
"Called also ",
"",
"",
"",
"",
"",
"Also known as ",
"It is also called ",
"It is called ",
"Many know this as ",
"This is called by many as ",
"Which is also called "
);


$commonNameOutroString = "";

if(mt_rand(1,10) == 1) {
$commonNameOutro = array(
" and many others",
" and too many others to rehearse"
	);
$commonNameOutroString = $commonNameOutro[mt_rand(0, count($commonNameOutro) - 1)];
}

$commonNameString = $commonNameIntro[mt_rand(0, count($commonNameIntro) - 1)].trim($commonNameString).$commonNameOutroString;

?>
<style>
body, p {
font-family:arial,helvetica,sans-serif;font-size:14px;
}
</style>
<?php

echo '<h1 style="font-style:italic;">'.$latinName.'</h1>';
echo "<h2>".$commonNameString.".</h2>";
echo '<p>'.$startingText.'</p>';

$plantURL = str_ireplace(" ", "-", trim(strtolower($latinName)));
drawPlant();

echo '<img style="display:block;" src="/images/herbarium/plants/'.$plantURL.'.jpg" width="480" height="480" alt="'.$latinName.'">';
echo '<p style="padding: 12px;display:inline-block;background:rgb('.$petalRed.','.$petalGreen.','.$petalBlue.')">Petal colour: '.$displayPetalColourName.'</p>';
echo '<p>Associated with the '.$combinedButterflyName.', and '.$combinedBatName.'.</p>';
$debugQueryString = '';
if($debug) {
$debugQueryString = '&debug=true';
}
echo '<p style="font-size:0.7em;"><a href="'.explode("?", $_SERVER["REQUEST_URI"])[0].'?seed='.$storedSeed.$debugQueryString.'">Seed: '.$storedSeed.'</a></p>';
echo '<p style="font-size:0.7em;"><a href="'.explode("?", $_SERVER["REQUEST_URI"])[0].'">New seed</a></p>';


$lastError = error_get_last();

if(stripos($lastError["file"], "generate.php") === false) {
	// don't Tweet if any errors within this file (may be error reported in connection include for example):

	sendToTwitter();

}



if($debug) {
$timeElapsedSecs = microtime(true) - $startTime;
echo '<p style="font-size:0.7em;">Took '.$timeElapsedSecs.' seconds</p>';
}


?>
</body>
</html>