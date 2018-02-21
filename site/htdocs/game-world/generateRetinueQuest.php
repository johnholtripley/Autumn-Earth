<?php

include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/functions.php");

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



function expandDescriptionGrammar($startingGrammar) {
return $startingGrammar;
}
function expandTitleGrammar($startingGrammar) {
return $startingGrammar;
}


// get all retinue quest types:
$query = "SELECT * from tblretinuequesttypes";
$questTypes = array();
$result = mysql_query($query) or die ();
if(mysql_num_rows($result)>0) {

while ($row = mysql_fetch_array($result, MYSQL_ASSOC)) {
    array_push($questTypes, $row);
}
mysql_free_result($result);
}


// get a random type:
$thisType = $questTypes[mt_rand(0, count($questTypes) - 1)];

$questDescription = expandDescriptionGrammar($thisType['questTypeBaseGrammar']);

$questName = expandTitleGrammar($thisType['questTypeBaseTitleGrammar']);
$questCleanURL = cleanURL($questName);
$questDescription = $questDescription;
$questType = $thisType['questTypeName'];
$continent  = "eastern-continent";
$mapCoordinateX  = mt_rand(25,675);
$mapCoordinateY  = mt_rand(25,425);


// load image and determine if it's land or sea:
// #########
$landMassImage = imagecreatefromgif("../images/world-maps/land-masses/".$continent.".gif");
$colourIndex = imagecolorat($landMassImage, $mapCoordinateX, $mapCoordinateY);




echo $colourIndex."<br>";


imagedestroy($landMassImage);
$obstacles = array();

$isOnLand = true;
if($colourIndex!=0) {

// sea or island
array_push($obstacles, "sea");

}





if($colourIndex==1) {
	// sea
	// change the types of quests that will be generated to suit being at sea #########
	$questName .= " at sea";
$isOnLand = false;
}

if($colourIndex==2) {

	$questName .= " on island";

}


$needsToReturnToBase  = "0";
$questDifficulty  = "0";

$questObstacles  = implode(",",$obstacles);


$questCostToStart  = "0";
$questPartOfCampaign  = "0";
$questNumberOfFollowersRequired  = "1";
$questNPCMinimumLevel  = "1";
$questReward  = "";


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
$query2 = "INSERT INTO tblretinuequests (questName, questCleanURL, questDescription, questType, continent, mapCoordinateX, mapCoordinateY, needsToReturnToBase, questDifficulty, questObstacles, questCostToStart, questPartOfCampaign, questNumberOfFollowersRequired, questNPCMinimumLevel, questReward, timeCreated) VALUES ('".mysql_escape_string($questName)."','".$questCleanURL."','".mysql_escape_string($questDescription)."','".$questType."','".$continent."',".$mapCoordinateX.",".$mapCoordinateY.",".$needsToReturnToBase.",".$questDifficulty.",'".$questObstacles."',".$questCostToStart.",".$questPartOfCampaign.",".$questNumberOfFollowersRequired.",".$questNPCMinimumLevel.",'".$questReward."',NOW())";
echo $query2;
if(!$debug) {
$result2 = mysql_query($query2);
}

if($debug) {
echo "<br>Seed: ".$storedSeed;
}



?>