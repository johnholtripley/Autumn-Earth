<?php
// get retinue followers for this character:




// get from game state: ####
$chr = 999;
$homeBaseContinent = "eastern-continent";
$homeBaseX = 200;
$homeBaseY = 350;




// a list of possible obstacles and their required solution:
$obstacles = [
"sea" => "boat"
];





$debug = false;
if(isset($_GET["debug"])) {
  $debug = true;
  include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");
}


$retinuePanelOutput = '<div id="retinuePanel">';
$retinuePanelOutput .= '<div class="draggableBar">Retinue</div>';
$retinuePanelOutput .= '<button class="closePanel">close</button>';

$activeQuestsIds = array();
  $query = "SELECT * FROM tblretinuefollowers left join tblretinuequests on tblretinuefollowers.activeQuestId = tblretinuequests.questID where tblretinuefollowers.characterIdFollowing='".$chr."'";

      $result = mysql_query($query) or die ();
      if(mysql_num_rows($result)>0) {
      	$retinuePanelOutput .= '<h2>Your retinue:</h2>';
     $retinuePanelOutput .= "<ol>";

$followerData = array();
while ($row = mysql_fetch_array($result, MYSQL_ASSOC)) {
    array_push($followerData, $row);
}
mysql_free_result($result);



// loop through and find any active quests with more than 1 follower on - and use the slowest time
$questTimes = array();
foreach ($followerData as $followerKey => $thisFollower) {
  // check time started and time required
  $followerData[$followerKey]['completedSoFar'] = floor((time() - strtotime($thisFollower['questStartedTime']))/60);
  // determine the time required based on the distance:
  $followerData[$followerKey]['questMinutesRequired'] = sqrt((($thisFollower['followerMapCoordinateX']-$thisFollower['mapCoordinateX'])*($thisFollower['followerMapCoordinateX']-$thisFollower['mapCoordinateX']))+(($thisFollower['followerMapCoordinateY']-$thisFollower['mapCoordinateY'])*($thisFollower['followerMapCoordinateY']-$thisFollower['mapCoordinateY'])));
  if($thisFollower['needsToReturnToBase']) {
  // add the time to return to base as well:
  $followerData[$followerKey]['questMinutesRequired'] += sqrt((($thisFollower['mapCoordinateX']-$homeBaseX)*($thisFollower['mapCoordinateX']-$homeBaseX))+(($thisFollower['mapCoordinateY']-$homeBaseY)*($thisFollower['mapCoordinateY']-$homeBaseY)));
  }
  if($thisFollower['activeQuestId'] != -1) {
    if (array_key_exists($thisFollower['activeQuestId'], $questTimes)) {
      // check if this is slower:
      if($followerData[$followerKey]['questMinutesRequired'] > $questTimes[($thisFollower['activeQuestId'])]) {
        $questTimes[($thisFollower['activeQuestId'])] = $followerData[$followerKey]['questMinutesRequired'];
      }
    } else {
      $questTimes[($thisFollower['activeQuestId'])] = $followerData[$followerKey]['questMinutesRequired'];
    }
    
  }
  
}


foreach ($followerData as $followerKey => $thisFollower) {
  $retinuePanelOutput .= '<li><h3>'.$thisFollower['followerName'].'</h3>';
  if($thisFollower['activeQuestId'] == -1) {
  $retinuePanelOutput .= '<p>waiting for a quest</p>';
  } else {


  if($thisFollower['completedSoFar'] >= $questTimes[($thisFollower['activeQuestId'])] ) {
  $retinuePanelOutput .= '<p>COMPLETED "'.$thisFollower['questName'].'"</p>';
  if($thisFollower['questReward']) {
  $rewardObject = json_decode($thisFollower['questReward']);
  foreach ($rewardObject as &$thisReward) {
  if($thisReward->type == "$") {
  $inventoryImage = 'coins';
  } else {
  $inventoryImage = $thisReward->type;
  }
  $retinuePanelOutput .= '<div class="postSlot"><img src="/images/game-world/inventory-items/'.$inventoryImage.'.png"><span class="qty">'.$thisReward->quantity.'</span></div>';
  }
  }

  } else {
 
  $retinuePanelOutput .= '<p>active on "'.$thisFollower['questName'].'" <span class="retinueQuestTimer" data-minutes="'.($questTimes[($thisFollower['activeQuestId'])] - $thisFollower['completedSoFar']).'"></span></p>';
  if($debug) {
  $retinuePanelOutput .= $thisFollower['completedSoFar']." out of ".$questTimes[($thisFollower['activeQuestId'])] ."<br>";
  }
  }
  }
  $retinuePanelOutput .= '</li>';
}





  $retinuePanelOutput .= "</ol>";
}
      


$questPanelDetailsOutput = "";

// get a pool of the latest available quests (all latest quests, that aren;t active or completed by this character)
      $questsQuery = "SELECT * from tblretinuequests where tblretinuequests.questID NOT IN (SELECT questIdActiveOrComplete from tblretinuequestsactive where characterId='".$chr."') order by timeCreated DESC limit 12";

$questsResult = mysql_query($questsQuery) or die ();
if(mysql_num_rows($questsResult)>0) {
	$retinuePanelOutput .= '<h2>Available quests:</h2>';
  $retinuePanelOutput .= '<div id="retinueAvailableQuestMap"><img src="/images/world-maps/eastern-continent.jpg" alt="Eastern Continent">';
//	$retinuePanelOutput .= "<ol>";
	while ($questsRow = mysql_fetch_array($questsResult)) {
      extract($questsRow);
      // map is 700 x 450
$retinuePanelOutput .= '<button id="retinueQuestLocation'.md5($questID).'" class="mapLocation" style="left:'.(($mapCoordinateX/700)*100).'%;top:'.(($mapCoordinateY/450)*100).'%;"></button><div class="mapLocationTooltip" style="left:'.(($mapCoordinateX/700)*100).'%;top:'.(($mapCoordinateY/450)*100).'%;"><h4>'.$questName.'</h4><p>'.$questDescription.' (requires '.$questNumberOfFollowersRequired;

if($questObstacles) {
  $retinuePanelOutput .= ' and ';
  $allObstacles = explode(",", $questObstacles);
  for ($i=0;$i<count($allObstacles);$i++) {
    $retinuePanelOutput .= $obstacles[($allObstacles[$i])].", ";
  }
    // remove last comma:
$retinuePanelOutput = rtrim($retinuePanelOutput, ', ');
}

  $retinuePanelOutput .= ')</p></div>';


$questPanelDetailsOutput .= '<div id="retinueQuestLocationDetail'.md5($questID).'" class="retinueQuestLocationDetailPanel">';
$questPanelDetailsOutput .= '<div class="draggableBar">Retinue</div>';
$questPanelDetailsOutput .= '<button class="closePanel">close</button>';
$questPanelDetailsOutput .= '<h4>'.$questName.' <span>('.$questType.')</span></h4>';
$questPanelDetailsOutput .= '<p>'.$questDescription.'</p>';

  if($questReward) {
  $rewardObject = json_decode($questReward);
  foreach ($rewardObject as &$thisReward) {
  if($thisReward->type == "$") {
  $inventoryImage = 'coins';
  } else {
  $inventoryImage = $thisReward->type;
  }
  $questPanelDetailsOutput .= '<div class="rewardSlot"><img src="/images/game-world/inventory-items/'.$inventoryImage.'.png"><span class="qty">'.$thisReward->quantity.'</span></div>';
  }
  }

$questPanelDetailsOutput .= '</div>';


  }
   $retinuePanelOutput .= '</div>';
 // $retinuePanelOutput .= "</ol>";
} else {
$retinuePanelOutput .= "<p>No quests currently available</p>";
}
mysql_free_result($questsResult);

$retinuePanelOutput .= '</div>';


if($debug) {
  echo '<style>.mapWrapper{position:relative;max-width:400px;}.mapWrapper img{display:block;width:100%}.mapLocation{position:absolute;width:20px;height:20px;background:rgba(200,200,20,0.6);border:2px solid #fff;-webkit-border-radius:20px;-moz-border-radius:20px;border-radius:20px;-webkit-transform:translate(-10px, -10px);-moz-transform:translate(-10px, -10px);-o-transform:translate(-10px, -10px);transform:translate(-10px, -10px);z-index:1}@media only all{.mapLocation{-webkit-border-radius:1.25rem;-moz-border-radius:1.25rem;border-radius:1.25rem}}.mapLocation:hover+.mapLocationTooltip,.mapLocation:active+.mapLocationTooltip,.mapLocation:focus+.mapLocationTooltip{opacity:1}.mapLocationTooltip{pointer-events:none;opacity:0;-webkit-transition:opacity 0.4s ease;-moz-transition:opacity 0.4s ease;-o-transition:opacity 0.4s ease;transition:opacity 0.4s ease;padding:6px;position:absolute;width:200px;-webkit-transform:translate(15px, -10px);-moz-transform:translate(15px, -10px);-o-transform:translate(15px, -10px);transform:translate(15px, -10px);background:#572800;color:#fff;z-index:2}.mapLocationTooltip h4,.mapLocationTooltip p{margin:0;padding:0;font-size:11px}</style>';
  echo $retinuePanelOutput;
  echo $questPanelDetailsOutput;
}

?>