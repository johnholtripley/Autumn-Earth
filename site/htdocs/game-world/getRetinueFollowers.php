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






// get current active events:
$activeEvents = [];
$eventsQuery = "SELECT eventid from tblevents WHERE ((repeatsAnnually and ((dayofyear(now()) between (dayofyear(eventstart)) and (dayofyear(eventstart)+eventdurationdays-1)) or (dayofyear(now()) between (dayofyear(eventstart) - 365) and (dayofyear(eventstart)+eventdurationdays-366)))) or ((repeatsAnnually = 0) and (date(now()) between (eventstart) and (eventstart+eventdurationdays))))";

    $eventsResult = mysqli_query($connection,  $eventsQuery ) or die ( "couldn't execute events query: ".$eventsQuery );
$numberofrows = mysqli_num_rows( $eventsResult );
    if ( $numberofrows>0 ) {
        while ( $row = mysqli_fetch_array( $eventsResult ) ) {
            //extract( $row );
            array_push($activeEvents, $row['eventid']);
        }
    }
mysqli_free_result($eventsResult);


$activeSeasonQuery = 'activeduringseason is null';
if(count($activeEvents)>0) {
   $activeSeasonQuery = '(tblretinuequests.activeduringseason in ('.implode(",",$activeEvents).') or tblretinuequests.activeduringseason is null)'; 
}







$retinuePanelOutput = '<div id="retinuePanel">';
$retinuePanelOutput .= '<div class="draggableBar">Retinue</div>';
$retinuePanelOutput .= '<button class="closePanel">close</button>';

$completePanelsCreated = array();
$retinuePanelCompleteOutput = '';

$activeQuestsIds = array();
  $query = "SELECT * FROM tblretinuefollowers left join tblretinuequests on tblretinuefollowers.activeQuestId = tblretinuequests.questID where tblretinuefollowers.characterIdFollowing='".$chr."' and isEnabled";



      $result = mysqli_query($connection, $query) or die ();
      if(mysqli_num_rows($result)>0) {
      	$retinuePanelOutput .= '<h2>Your retinue:</h2>';
     $retinuePanelOutput .= '<ol id="retinueList">';

$followerData = array();
while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
    array_push($followerData, $row);
}
mysqli_free_result($result);



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
  $availableClass='';
  if($thisFollower['activeQuestId'] == -1) {
     $availableClass .= ' class="available"';
  } else {
    
  }
 $retinuePanelOutput .= '<li id="retinueFollower'.$thisFollower['followerID'].'"'.$availableClass.' data-locationx="'.$thisFollower['followerMapCoordinateX'].'" data-locationy="'.$thisFollower['followerMapCoordinateY'].'" data-activeonquest="'.$thisFollower['activeQuestId'].'">'; 
  $retinuePanelOutput .= '<div class="portrait"><img src="/images/retinue/'.$thisFollower['followerID'].'.png" alt=""></div><h3>'.$thisFollower['followerName'].'</h3>';
  if($thisFollower['activeQuestId'] == -1) {
  $retinuePanelOutput .= '<p>waiting for a quest</p>';
  } else {

$thisQuestCompleteClass = '';

  if($thisFollower['completedSoFar'] >= $questTimes[($thisFollower['activeQuestId'])] ) {
  $retinuePanelOutput .= '<p>COMPLETED "'.$thisFollower['questName'].'"</p>';
$thisQuestCompleteClass = ' active';



  } else {
 
  $retinuePanelOutput .= '<p>active on "'.$thisFollower['questName'].'" <span class="retinueQuestTimer" data-minutes="'.($questTimes[($thisFollower['activeQuestId'])] - $thisFollower['completedSoFar']).'"></span></p>';
  if($debug) {
  $retinuePanelOutput .= $thisFollower['completedSoFar']." out of ".$questTimes[($thisFollower['activeQuestId'])] ."<br>";
  }
  }


// don't create another panel if more than 1 follower is on this quest:
if(!(in_array($thisFollower['activeQuestId'], $completePanelsCreated))) {
$retinuePanelCompleteOutput .= '<div class="retinueCompletePanel'.$thisQuestCompleteClass.'" id="retinueComplete'.$thisFollower['activeQuestId'].'" data-questname="'.$thisFollower['questName'].'">';
$retinuePanelCompleteOutput .= '<h2>'.$thisFollower['questName'].'</h2>';
$retinuePanelCompleteOutput .= '<h3>complete</h3>';
  if($thisFollower['questReward']) {
  $rewardObject = json_decode($thisFollower['questReward']);
  foreach ($rewardObject as &$thisReward) {
  if($thisReward->type == "$") {
  $inventoryImage = 'coins';
  } else {
  $inventoryImage = $thisReward->type;
  }
  $retinuePanelCompleteOutput .= '<div class="rewardSlot"><img src="/images/game-world/inventory-items/'.$inventoryImage.'.png" alt=""><span class="qty">'.$thisReward->quantity.'</span></div>';
  }
  $retinuePanelCompleteOutput .= '<button class="takeRewards">Take all</button>';
  } else {
   $retinuePanelCompleteOutput .= '<button class="takeRewards">Complete</button>'; 
  }
  
$retinuePanelCompleteOutput .= '</div>';

array_push($completePanelsCreated, $thisFollower['activeQuestId']);
}



  }
  $retinuePanelOutput .= '</li>';
}





  $retinuePanelOutput .= "</ol>";
}
      


$questPanelDetailsOutput = "";

// get a pool of the latest available quests (all latest quests, that aren;t active or completed by this character)
      $questsQuery = "SELECT * from tblretinuequests where tblretinuequests.questID NOT IN (SELECT questIdActiveOrComplete from tblretinuequestsactive where characterId='".$chr."') and ".$activeSeasonQuery." order by timeCreated DESC limit 12";

$questsResult = mysqli_query($connection, $questsQuery) or die ();
  $retinuePanelOutput .= '<h2>Available quests:</h2>';
  $retinuePanelOutput .= '<div id="retinueAvailableQuestMap"><img src="/images/world-maps/eastern-continent.jpg" id="activeContinent" alt="Eastern Continent">';
if(mysqli_num_rows($questsResult)>0) {

//	$retinuePanelOutput .= "<ol>";
	while ($questsRow = mysqli_fetch_array($questsResult)) {
      extract($questsRow);
      // map is 700 x 450
      $returnToBaseClass='';
      if($needsToReturnToBase) {
$returnToBaseClass = ' needsToReturnToBase';
      }
$retinuePanelOutput .= '<button id="retinueQuestLocation'.($questID).'" class="mapLocation active'.$returnToBaseClass.'" style="left:'.(($mapCoordinateX/700)*100).'%;top:'.(($mapCoordinateY/450)*100).'%;"></button><div class="mapLocationTooltip" style="left:'.(($mapCoordinateX/700)*100).'%;top:'.(($mapCoordinateY/450)*100).'%;"><h4>'.$questName.'</h4><p>'.$questDescription.' (requires '.$questNumberOfFollowersRequired;

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


$questPanelDetailsOutput .= '<div id="retinueQuestLocationDetail'.($questID).'" class="retinueQuestLocationDetailPanel" data-requires="'.$questNumberOfFollowersRequired.'" data-locationx="'.$mapCoordinateX.'" data-locationy="'.$mapCoordinateY.'" data-requiresreturn="'.$needsToReturnToBase.'" data-questname="'.$questName.'">';
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
  $questPanelDetailsOutput .= '<div class="rewardSlot"><img src="/images/game-world/inventory-items/'.$inventoryImage.'.png" alt=""><span class="qty">'.$thisReward->quantity.'</span></div>';
  }
  }


  for ($i=0;$i<$questNumberOfFollowersRequired;$i++) {
    $questPanelDetailsOutput .= '<div class="followerSlot" id="dropFollowersPanel'.($questID).'-'.$i.'"></div>';
  }


$questPanelDetailsOutput .= '</div>';


  }

// plot followers:
  foreach ($followerData as $followerKey => $thisFollower) {
$retinuePanelOutput .= '<div class="followerLocation" style="left:'.(($thisFollower['followerMapCoordinateX']/700)*100).'%;top:'.(($thisFollower['followerMapCoordinateY']/450)*100).'%;" id="followerLocation'.$thisFollower['followerID'].'"><img src="/images/retinue/'.$thisFollower['followerID'].'.png" alt=""></div>';
$retinuePanelOutput .= '<div class="mapLocationTooltip" id="followerLocationTooltip'.$thisFollower['followerID'].'" style="left:'.(($thisFollower['followerMapCoordinateX']/700)*100).'%;top:'.(($thisFollower['followerMapCoordinateY']/450)*100).'%;">'.$thisFollower['followerName'].'</div>';
  }

  // plot home base:
  
  $retinuePanelOutput .= '<div id="homeBaseLocation" style="left:'.(($homeBaseX/700)*100).'%;top:'.(($homeBaseY/450)*100).'%;"></div>';


   $retinuePanelOutput .= '</div>';
 
 // $retinuePanelOutput .= "</ol>";
} else {
$retinuePanelOutput .= "<p>No quests currently available</p>";
}
  $retinuePanelOutput .= '<p id="retinueQuestTimeRequired">Time required:</p>';
   $retinuePanelOutput .= '<button id="retinueQuestStart" disabled="disabled">Start quest</button>';
mysqli_free_result($questsResult);

$retinuePanelOutput .= '<div id="retinueDetailWrapper">'.$questPanelDetailsOutput.'</div>';

$retinuePanelOutput .= $retinuePanelCompleteOutput;

$retinuePanelOutput .= '</div>';


$retinuePanelOutput .= '<div id="draggableFollower"></div>';


if($debug) {
  echo '<style>.mapWrapper{position:relative;max-width:400px;}.mapWrapper img{display:block;width:100%}.mapLocation{position:absolute;width:20px;height:20px;background:rgba(200,200,20,0.6);border:2px solid #fff;-webkit-border-radius:20px;-moz-border-radius:20px;border-radius:20px;-webkit-transform:translate(-10px, -10px);-moz-transform:translate(-10px, -10px);-o-transform:translate(-10px, -10px);transform:translate(-10px, -10px);z-index:1}@media only all{.mapLocation{-webkit-border-radius:1.25rem;-moz-border-radius:1.25rem;border-radius:1.25rem}}.mapLocation:hover+.mapLocationTooltip,.mapLocation:active+.mapLocationTooltip,.mapLocation:focus+.mapLocationTooltip{opacity:1}.mapLocationTooltip{pointer-events:none;opacity:0;-webkit-transition:opacity 0.4s ease;-moz-transition:opacity 0.4s ease;-o-transition:opacity 0.4s ease;transition:opacity 0.4s ease;padding:6px;position:absolute;width:200px;-webkit-transform:translate(15px, -10px);-moz-transform:translate(15px, -10px);-o-transform:translate(15px, -10px);transform:translate(15px, -10px);background:#572800;color:#fff;z-index:2}.mapLocationTooltip h4,.mapLocationTooltip p{margin:0;padding:0;font-size:11px}</style>';
  echo $retinuePanelOutput;
  
}

?>