<?php
// get retinue followers for this character:

include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");


// get from game state: ####
$chr = 999;


  $query = "SELECT * FROM tblretinuefollowers left join tblretinuequests on tblretinuefollowers.activeQuestId = tblretinuequests.questID where tblretinuefollowers.characterIdFollowing='".$chr."'";

      $result = mysql_query($query) or die ("can't get followers");
      if(mysql_num_rows($result)>0) {
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
} else {
echo '<p>active on "'.$questName.'"" - '.$completedSoFar.' minutes out of '.$questTimeRequired;
}
      }
      echo '</li>';
  }
  echo "</ol>";
}
      mysql_free_result($result);


?>











