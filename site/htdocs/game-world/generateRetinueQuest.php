<?php

include_once($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include_once($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");
include_once($_SERVER['DOCUMENT_ROOT']."/includes/functions.php");

if(!isset($revealedHexCoordinates)) {
    $chr = 999;
$gameStateString = file_get_contents("../data/chr".$chr."/gameState.json");
$gameState = json_decode($gameStateString, true);
$revealedHexCoordinates = $gameState['retinueMapAreasRevealed'];
$homeBaseX = 200;
$homeBaseY = 350;
}


if(!isset($hexSize)) {
// for hexes:
  $hexSize = 38;
  // https://www.redblobgames.com/grids/hexagons/
  $hexWidth = $hexSize * sqrt(3);
  $hexHeight = $hexSize * 2;
// pixel rounding:
  $hexWidth = 66;
  $tilesToCoverHorizontally = 5;
$tilesToCoverVertically = 3;
}

if(!isset($continentMapWidth)) {
$continentMapWidth = 700;
$continentMapHeight = 450;
}

// 1519377963 for island

$debug = false;
if(isset($_GET["debug"])) {
$debug = true;
}

 if (isset($_GET["seed"])) {
        $storedSeed = intval($_GET["seed"]);
    
    } else {
        // http://php.net/manual/en/function.mt_srand.php
        list($usec, $sec) = explode(' ', microtime());
        $storedSeed       = floor((float) $sec + ((float) $usec * 100000));
    }
  
    mt_srand($storedSeed);

$howManyQuests = 1;
if(isset($retinueQuestsToGenerate)) {
$howManyQuests = $retinueQuestsToGenerate;
}



function replaceKeywords($phrase) {
    global $continent, $region, $terrainType;

    $resources = array(
"land"=>array("stone","food","wood"),
"sea"=>array("kelp"),
"isle"=>array("sand")
        );

    $phrase = str_ireplace("++region++", $region, $phrase);
    $phrase = str_ireplace("++continent++", $continent, $phrase);
    $thisResource = $resources[$terrainType][mt_rand(0, count($resources[$terrainType]) - 1)];
$phrase = str_ireplace("++resource++", $thisResource, $phrase);
    return $phrase;
}


function expandDescriptionGrammar($startingGrammar) {
        $allPossibleStartingDescriptions = explode("|",$startingGrammar);
    $thisDescription = $allPossibleStartingDescriptions[mt_rand(0, count($allPossibleStartingDescriptions) - 1)];
    $thisDescription = replaceKeywords($thisDescription);
    return ucfirst($thisDescription);
}

function expandTitleGrammar($startingGrammar) {
    $allPossibleStartingTitles = explode("|",$startingGrammar);
    $thisTitle = $allPossibleStartingTitles[mt_rand(0, count($allPossibleStartingTitles) - 1)];
    $thisTitle = replaceKeywords($thisTitle);
    return ucfirst($thisTitle);
}



// check that there are enough free tiles:
if(count($revealedHexCoordinates) < $howManyQuests) {
    $howManyQuests = count($revealedHexCoordinates);
}



for($i=0;$i<$howManyQuests;$i++) {




$continent  = "Eastern Continent";


// pick a random revealed hex:
$thisHex = $revealedHexCoordinates[mt_rand(0, count($revealedHexCoordinates) - 1)];



$thisHexCoords = explode(",",$thisHex);


    $mapCoordinateX = $continentMapWidth/2 + $thisHexCoords[0] * $hexWidth; 
    $mapCoordinateY = $continentMapHeight/2 + $thisHexCoords[1] * $hexHeight*3/4; 

        if($thisHexCoords[1]%2==0) {
    $mapCoordinateX +=  $hexWidth/2;
    }

// that is the hex centre, pick a spot within a radius

$offsetRadius = mt_rand(0,($hexWidth/2));
$offsetAngle = deg2rad(mt_rand(0,360));

$offsetX = $offsetRadius*cos($offsetAngle);
$offsetY = $offsetRadius*sin($offsetAngle);

$mapCoordinateX += $offsetX;
$mapCoordinateY += $offsetY;

// load image and determine if it's land or sea:
$landMassImage = imagecreatefromgif("../images/world-maps/land-masses/".cleanURL($continent).".gif");
$colourIndex = imagecolorat($landMassImage, $mapCoordinateX, $mapCoordinateY);


imagedestroy($landMassImage);
$generationObstacles = array();

$terrainType = "land";

$isOnLand = true;
if($colourIndex!=0) {
// sea or island
array_push($generationObstacles, "sea");
}

if($colourIndex==1) {
	// sea
	// change the types of quests that will be generated to suit being at sea #########
	$terrainType = "sea";
$isOnLand = false;
}

if($colourIndex==2) {
    // don't use 'island' otherwise 'land' will show up for it as well:
	$terrainType = "isle";
}

//echo $colourIndex."<br>";
//echo $terrainType."<br>";


// load in the region map to identify which region this is in:
$regionImage = imagecreatefromgif("../images/world-maps/regions/".cleanURL($continent).".gif");
$regionColourIndex = imagecolorat($regionImage, $mapCoordinateX, $mapCoordinateY);

$regionNames = array(
"Eastern Continent" => array("yellow","pink","purple","grey","light green","dark green","red","orange","blue","grey","dark green","black","the sea")
    );

imagedestroy($regionImage);

$region = $regionNames[$continent][$regionColourIndex];

// get a random (but suitable) type:
$query = "SELECT * from tblretinuequesttypes where suitableFor like '%".$terrainType."%'";
$questTypes = array();
$result = mysqli_query($connection, $query) or die ();
if(mysqli_num_rows($result)>0) {

while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
    array_push($questTypes, $row);
}
mysqli_free_result($result);
}

$thisType = $questTypes[mt_rand(0, count($questTypes) - 1)];

$questDescription = expandDescriptionGrammar($thisType['questTypeBaseGrammar']);

$questName = expandTitleGrammar($thisType['questTypeBaseTitleGrammar']);
$questCleanURL = cleanURL($questName);
$questDescription = $questDescription;
$questType = $thisType['questTypeName'];




$needsToReturnToBase  = "0";
$questDifficulty  = "0";

$questObstacles  = implode(",",$generationObstacles);


$questCostToStart  = "0";
$questPartOfCampaign  = "0";
$followersRequiredWeighting = array(1,1,1,1,1,1,2,2,3);
$questNumberOfFollowersRequired  = $followersRequiredWeighting[mt_rand(0, count($followersRequiredWeighting) - 1)];
$questNPCMinimumLevel  = "1";


// quest reward should be greater the further it is from the home base: 
$questDistanceFromHomeBase = sqrt((($homeBaseX-$mapCoordinateX)*($homeBaseX-$mapCoordinateX)) + (($homeBaseY-$mapCoordinateY)*($homeBaseY-$mapCoordinateY)))/$hexWidth;

$questReward  = '[{"type":2,"quantity":'.ceil($questDistanceFromHomeBase).',"quality":100,"durability":100,"currentWear":0,"effectiveness":100,"colour":"0","enchanted":0,"hallmark":0,"inscription":""}]';


$query3 = "SELECT * from tblretinuequests where questCleanURL='".$questCleanURL."'";
$result3 = mysqli_query($connection, $query3);
if(mysqli_num_rows($result3)>0) {
	$attempts = 2;
$originalCleanURL = $questCleanURL;
do {
// check clean URL is unique:
	$questCleanURL = $originalCleanURL.'-'.$attempts;
$query3 = "SELECT * from tblretinuequests where questCleanURL='".$questCleanURL."'";
$result3 = mysqli_query($connection, $query3);

$attempts++;
} while(mysqli_num_rows($result3)>0);
}

mysqli_free_result($result3);

// add to database:
$query2 = "INSERT INTO tblretinuequests (questName, questCleanURL, questDescription, questType, continent, mapCoordinateX, mapCoordinateY, needsToReturnToBase, questDifficulty, questObstacles, questCostToStart, questPartOfCampaign, questNumberOfFollowersRequired, questNPCMinimumLevel, questReward, timeCreated, seed) VALUES ('".mysqli_real_escape_string($connection,$questName)."','".$questCleanURL."','".mysqli_real_escape_string($connection,$questDescription)."','".$questType."','".cleanURL($continent)."',".$mapCoordinateX.",".$mapCoordinateY.",".$needsToReturnToBase.",".$questDifficulty.",'".$questObstacles."',".$questCostToStart.",".$questPartOfCampaign.",".$questNumberOfFollowersRequired.",".$questNPCMinimumLevel.",'".$questReward."',NOW(),'".$storedSeed."')";
if($debug) {
echo $query2;
}
if(!$debug) {
$result2 = mysqli_query($connection, $query2);
}


}



if($debug) {
echo "<br>Seed: ".$storedSeed;
}



?>