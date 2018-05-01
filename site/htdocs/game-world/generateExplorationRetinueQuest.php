<?php

include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/functions.php");


$debug = false;
if(isset($_GET["debug"])) {
$debug = true;
}

$chr = $_GET['chr'];
$allFollowers = explode("|",$_GET['followers']);
$hexCoordX = $_GET['hexCoordX'];
$hexCoordY = $_GET['hexCoordY'];


// for hexes:
$continentMapWidth = 700;
$continentMapHeight = 450;
  $hexSize = 38;
  // https://www.redblobgames.com/grids/hexagons/
  $hexWidth = $hexSize * sqrt(3);
  $hexHeight = $hexSize * 2;
// pixel rounding:
  $hexWidth = 66;
  $tilesToCoverHorizontally = 5;
$tilesToCoverVertically = 3;



    $mapCoordinateX = $continentMapWidth/2 + $hexCoordX * $hexWidth; 
    $mapCoordinateY = $continentMapHeight/2 + $hexCoordY * $hexHeight*3/4; 

        if($hexCoordY%2==0) {
    $mapCoordinateX +=  $hexWidth/2;
    }


$continent  = "Eastern Continent";

// create entry in retinue quests table:
$query = "INSERT INTO tblretinuequests (questName, questCleanURL, questDescription, questType, continent, mapCoordinateX, mapCoordinateY, needsToReturnToBase, questDifficulty, questObstacles, questCostToStart, questPartOfCampaign, questNumberOfFollowersRequired, questNPCMinimumLevel, questReward, timeCreated, seed) VALUES ('".$hexCoordX."_".$hexCoordY."','Exploring','Exploring','Exploring','".cleanURL($continent)."',".$mapCoordinateX.",".$mapCoordinateY.",1,0,'',0,0,".count($allFollowers).",1,'".$hexCoordX."_".$hexCoordY."',NOW(),-1)";
if($debug) {
    echo $query;
}
if(!$debug) {
$result2 = mysqli_query($connection, $query);
}

// create entry to assign followers to it:

$exploreQuestId = mysqli_insert_id($connection);



$query2 = "UPDATE tblretinuefollowers SET activeQuestId='".$exploreQuestId."', questStartedTime=NOW() where followerID IN(".implode(",",$allFollowers).")";
$result = mysqli_query($connection, $query2);


$query3 = "INSERT INTO tblretinuequestsactive (questIdActiveOrComplete, characterId) VALUES (".$exploreQuestId.",".$chr.")";
$result3 = mysqli_query($connection, $query3);

?>