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
if($questReward) {
$rewardObject = json_decode($questReward);
		foreach ($rewardObject as &$thisReward) {
			if($thisReward->type == "$") {
$inventoryImage = 'coins';
			} else {
$inventoryImage = $thisReward->type;
			}
echo '<div class="postSlot"><img src="/images/game-world/inventory-items/'.$inventoryImage.'.png"><span class="qty">'.$thisReward->quantity.'</span></div>';
}
}

} else {
//echo '<p>active on "'.$questName.'"" - '.$completedSoFar.' minutes out of '.$questTimeRequired;
echo '<p>active on "'.$questName.'" <span class="retinueQuestTimer" data-minutes="'.($questTimeRequired - $completedSoFar).'">'.($questTimeRequired - $completedSoFar).'</span></p>';
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

<script>

var retinueQuestTimeRemaining = [];
const allRetinueQuestTimers = document.getElementsByClassName('retinueQuestTimer');
for (var i=0;i<allRetinueQuestTimers.length;i++) {
retinueQuestTimeRemaining.push(new Date().getTime() + (allRetinueQuestTimers[i].dataset.minutes)*60*1000);
}



 function updateQuestTimers() {
  var remainingTime, seconds, minutes, hours, days;
  var currentTime = new Date().getTime();
  for (var i=0;i<allRetinueQuestTimers.length;i++) {
  remainingTime = retinueQuestTimeRemaining[i] - currentTime;
    var seconds = Math.floor((remainingTime / 1000) % 60);
    var minutes = Math.floor((remainingTime / (60 * 1000)) % 60);
    var hours = Math.floor((remainingTime / (60 * 60 * 1000)) % 24);
    var days = Math.floor(remainingTime / (24 * 60 * 60 * 1000));




 if(days>1) {
  allRetinueQuestTimers[i].innerHTML = days+" days remaining";
} else if (days == 1) {
  allRetinueQuestTimers[i].innerHTML = "1 day remaining";
} else if (hours>1){
  allRetinueQuestTimers[i].innerHTML = hours+" hours remaining";
} else if(hours ==1) {
  allRetinueQuestTimers[i].innerHTML = "1 hour remaining";
} else if (minutes>1){
  allRetinueQuestTimers[i].innerHTML = minutes+" minutes remaining";
} else if (minutes==1) {
          allRetinueQuestTimers[i].innerHTML = "1 minute remaining"; 
           } else if (seconds>1){
             allRetinueQuestTimers[i].innerHTML = seconds+" seconds remaining";
           } else if(seconds==1) {
             allRetinueQuestTimers[i].innerHTML = "1 second remaining"; 
           } else {
             allRetinueQuestTimers[i].innerHTML = "complete";
           }
}
    requestAnimationFrame(updateQuestTimers);
 }

requestAnimationFrame(updateQuestTimers);
</script>









