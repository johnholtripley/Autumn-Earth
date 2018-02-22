<?php

include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/functions.php");


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










$continent  = "Eastern Continent";

$mapCoordinateX  = mt_rand(25,675);
$mapCoordinateY  = mt_rand(25,425);


// load image and determine if it's land or sea:
$landMassImage = imagecreatefromgif("../images/world-maps/land-masses/".cleanURL($continent).".gif");
$colourIndex = imagecolorat($landMassImage, $mapCoordinateX, $mapCoordinateY);


imagedestroy($landMassImage);
$obstacles = array();

$terrainType = "land";

$isOnLand = true;
if($colourIndex!=0) {
// sea or island
array_push($obstacles, "sea");
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
$result = mysql_query($query) or die ();
if(mysql_num_rows($result)>0) {

while ($row = mysql_fetch_array($result, MYSQL_ASSOC)) {
    array_push($questTypes, $row);
}
mysql_free_result($result);
}

$thisType = $questTypes[mt_rand(0, count($questTypes) - 1)];

$questDescription = expandDescriptionGrammar($thisType['questTypeBaseGrammar']);

$questName = expandTitleGrammar($thisType['questTypeBaseTitleGrammar']);
$questCleanURL = cleanURL($questName);
$questDescription = $questDescription;
$questType = $thisType['questTypeName'];




$needsToReturnToBase  = "0";
$questDifficulty  = "0";

$questObstacles  = implode(",",$obstacles);


$questCostToStart  = "0";
$questPartOfCampaign  = "0";
$followersRequiredWeighting = array(1,1,1,1,1,1,2,2,3);
$questNumberOfFollowersRequired  = $followersRequiredWeighting[mt_rand(0, count($followersRequiredWeighting) - 1)];
$questNPCMinimumLevel  = "1";
$questReward  = '[{"type":2,"quantity":2,"quality":100,"durability":100,"currentWear":0,"effectiveness":100,"colour":"0","enchanted":0,"hallmark":0,"inscription":""}]';


$query3 = "SELECT * from tblretinuequests where questCleanURL='".$questCleanURL."'";
$result3 = mysql_query($query3);
if(mysql_num_rows($result3)>0) {
	$attempts = 2;
$originalCleanURL = $questCleanURL;
do {
// check clean URL is unique:
	$questCleanURL = $originalCleanURL.'-'.$attempts;
$query3 = "SELECT * from tblretinuequests where questCleanURL='".$questCleanURL."'";
$result3 = mysql_query($query3);

$attempts++;
} while(mysql_num_rows($result3)>0);
}

mysql_free_result($result3);

// add to database:
$query2 = "INSERT INTO tblretinuequests (questName, questCleanURL, questDescription, questType, continent, mapCoordinateX, mapCoordinateY, needsToReturnToBase, questDifficulty, questObstacles, questCostToStart, questPartOfCampaign, questNumberOfFollowersRequired, questNPCMinimumLevel, questReward, timeCreated, seed) VALUES ('".mysql_escape_string($questName)."','".$questCleanURL."','".mysql_escape_string($questDescription)."','".$questType."','".cleanURL($continent)."',".$mapCoordinateX.",".$mapCoordinateY.",".$needsToReturnToBase.",".$questDifficulty.",'".$questObstacles."',".$questCostToStart.",".$questPartOfCampaign.",".$questNumberOfFollowersRequired.",".$questNPCMinimumLevel.",'".$questReward."',NOW(),'".$storedSeed."')";
echo $query2;
if(!$debug) {
$result2 = mysql_query($query2);
}

if($debug) {
echo "<br>Seed: ".$storedSeed;
}



?>