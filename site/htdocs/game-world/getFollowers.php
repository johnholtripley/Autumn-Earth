<?php
// get retinue followers for this character:

include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");


// get from game state: ####
$chr = 999;

$activeQuestsIds = array();
  $query = "SELECT * FROM tblretinuefollowers left join tblretinuequests on tblretinuefollowers.activeQuestId = tblretinuequests.questID where tblretinuefollowers.characterIdFollowing='".$chr."'";

      $result = mysql_query($query) or die ();
      if(mysql_num_rows($result)>0) {
      	echo '<h2>Your retinue:</h2>';
     echo "<ol>";
      while ($row = mysql_fetch_array($result)) {
      extract($row);
      echo '<li><h3>'.$followerName.'</h3>';
      if($activeQuestId == -1) {
echo '<p>waiting for a quest</p>';
      } else {

// check time started and time required
$completedSoFar = floor((time() - strtotime($questStartedTime))/60);
if($completedSoFar >= $questTimeRequired ) {
echo '<p>COMPLETED "'.$questName.'"</p>';

$rewardObject = json_decode($questReward);
		foreach ($rewardObject as &$thisReward) {
			if($thisReward->type == "$") {
$inventoryImage = 'coins';
			} else {
$inventoryImage = $thisReward->type;
			}
echo '<div class="postSlot"><img src="/images/game-world/inventory-items/'.$inventoryImage.'.png"><span class="qty">'.$thisReward->quantity.'</span></div>';
}

} else {
echo '<p>active on "'.$questName.'"" - '.$completedSoFar.' minutes out of '.$questTimeRequired;
}
      }
      echo '</li>';
  }
  echo "</ol>";
}
      mysql_free_result($result);




// get a pool of the latest available quests (all latest quests, that aren;t active or completed by this character)
      $questsQuery = "SELECT * from tblretinuequests where tblretinuequests.questID NOT IN (SELECT questIdActiveOrComplete from tblretinuequestsactive where characterId='".$chr."') order by timeCreated DESC limit 12";

$questsResult = mysql_query($questsQuery) or die ();
if(mysql_num_rows($questsResult)>0) {
	echo'<h2>Available quests:</h2>';
	echo "<ol>";
	while ($questsRow = mysql_fetch_array($questsResult)) {
      extract($questsRow);
echo '<li><h3>'.$questName.'</h3><p>'.$questDescription.' (requires '.$questNumberOfFollowersRequired.')</p></li>';
  }
  echo "</ol>";
}
mysql_free_result($questsResult);
?>











