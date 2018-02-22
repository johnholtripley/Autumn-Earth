<?php

include_once($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include_once($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");

header('Content-Type: application/json');


// trim the first 11 characters to get the MD5 hash of the mail id
$questId = $_GET["id"];
$chr = $_GET["chr"];
$hasReward = false;
$query = "SELECT * FROM tblretinuequests left join tblretinuequestsactive on tblretinuequestsactive.questIdActiveOrComplete = '".$questId."' where tblretinuequestsactive.characterId='".$chr."' and tblretinuequests.questID = '".$questId."'";

      $result = mysql_query($query);
if(mysql_num_rows($result)>0) {
  while ($row = mysql_fetch_array($result)) {
    extract($row);
    if($questReward) {
    
        $hasReward = true;
        $attachmentOutput = $questReward;
      
    }
    $endLocationX = $mapCoordinateX;
    $endLocationY = $mapCoordinateY;
  }
}

$followerIds = array();
// get followers involved in this quest:
$query2 = "SELECT * from tblretinuefollowers where activeQuestId = '".$questId."'";
$result2 = mysql_query($query2);
if(mysql_num_rows($result2)>0) {
  while ($row2 = mysql_fetch_array($result2)) {
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

mysql_free_result($result);
mysql_free_result($result2);

?>