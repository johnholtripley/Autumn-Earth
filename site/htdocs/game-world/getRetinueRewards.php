<?php

include_once($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include_once($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");

header('Content-Type: application/json');

$homeBaseX = 200;
$homeBaseY = 350;

// trim the first 11 characters to get the MD5 hash of the mail id
$questId = $_GET["id"];
$chr = $_GET["chr"];
$hasReward = false;
$query = "SELECT * FROM tblretinuequests left join tblretinuequestsactive on tblretinuequestsactive.questIdActiveOrComplete = '".$questId."' where tblretinuequestsactive.characterId='".$chr."' and tblretinuequests.questID = '".$questId."'";

      $result = mysqli_query($connection, $query);
if(mysqli_num_rows($result)>0) {
  while ($row = mysqli_fetch_array($result)) {
    extract($row);
    if($questReward) {
    
        $hasReward = true;
        $attachmentOutput = $questReward;
      
    }
    if($needsToReturnToBase) {
       $endLocationX = $homeBaseX;
    $endLocationY = $homeBaseY;
    } else {
        $endLocationX = $mapCoordinateX;
    $endLocationY = $mapCoordinateY;
    }
  
  }
}

$followerIds = array();
// get followers involved in this quest:
$query2 = "SELECT * from tblretinuefollowers where activeQuestId = '".$questId."'";
$result2 = mysqli_query($connection, $query2);
if(mysqli_num_rows($result2)>0) {
  while ($row2 = mysqli_fetch_array($result2)) {
    extract($row2);
    array_push($followerIds, $followerID);
    }
  }

if($hasReward) {
	echo '{"item":';
	echo $attachmentOutput;
	
} else {
  echo '{"item":"null"';
}

echo ', "endLocationX": "'.$endLocationX.'"';
echo ', "endLocationY": "'.$endLocationY.'"';
echo ', "followerIds": "'.implode(",",$followerIds).'"}';

mysqli_free_result($result);
mysqli_free_result($result2);

?>