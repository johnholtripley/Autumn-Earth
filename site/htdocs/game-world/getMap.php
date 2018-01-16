<?php

//include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
//include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");
//include($_SERVER['DOCUMENT_ROOT']."/includes/functions.php");

$chr = $_GET["chr"];
$map = $_GET["map"];

header('Content-Type: application/json');
$mapDataFile = file_get_contents('../data/chr' .  $chr . '/map' . $map . '.json');

$hasProceduralContent = strrpos($mapDataFile, '##procedural##');
$hasEventContent = strrpos($mapDataFile, 'eventSpecificContent');
$mapData = json_decode($mapDataFile, true);



// check which events are active
include_once($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include_once($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");

// get current active events:
$activeEvents = [];
$eventsQuery = "SELECT cleanURL from tblevents WHERE ((repeatsAnnually and ((dayofyear(now()) between (dayofyear(eventstart)) and (dayofyear(eventstart)+eventdurationdays-1)) or (dayofyear(now()) between (dayofyear(eventstart) - 365) and (dayofyear(eventstart)+eventdurationdays-366)))) or ((repeatsAnnually = 0) and (date(now()) between (eventstart) and (eventstart+eventdurationdays))))";

$eventsResult = mysql_query( $eventsQuery ) or die ( "couldn't execute events query: ".$eventsQuery );
$numberofrows = mysql_num_rows( $eventsResult );
if ( $numberofrows>0 ) {
    while ( $row = mysql_fetch_array( $eventsResult ) ) {
    array_push($activeEvents, $row['cleanURL']);
    }
}
mysql_free_result($eventsResult);




function generatePositionsOfHiddenResourceNodes() {
    global $mapData, $activeEvents;

 
    // try and space out so not clustered together #########
    $whichCategories = $mapData['map']['hiddenResourceCategories'];
    

   // make sure not blocked by item, static npcs, or active  items or npcs:
    $clearTiles = $mapData['map']['collisions'];
    // loop through items and mark those tiles:
    for($i=0;$i<count($mapData['map']['items']); $i++) {
        $clearTiles[($mapData['map']['items'][$i]['tileY'])][($mapData['map']['items'][$i]['tileX'])] = '1';
    }
    // loop through and mark any static NPCs:
    for($i=0;$i<count($mapData['map']['npcs']); $i++) {
        if ($mapData['map']['npcs'][$i]['movement'][0] == '-') {
            if ($mapData['map']['npcs'][$i]['isCollidable']) {
                $clearTiles[($mapData['map']['npcs'][$i]['tileY'])][($mapData['map']['npcs'][$i]['tileX'])] = '1';
            }
        }
    }

    // check seasonal content as well:
    for ($j=0;$j<count($activeEvents);$j++) {
        if(isset($mapData['map']['eventSpecificContent'][($activeEvents[$j])])) {
            $thisEvent = $mapData['map']['eventSpecificContent'][($activeEvents[$j])];

            if(isset($thisEvent['hiddenResourceCategories'])) {
                array_push($whichCategories, $thisEvent['hiddenResourceCategories']);
            }

            if(isset($thisEvent['items'])) {
                for($i=0;$i<count($thisEvent['items']); $i++) {
                    $clearTiles[($thisEvent['items'][$i]['tileY'])][($thisEvent['items'][$i]['tileX'])] = '1';
                }
            }

            if(isset($thisEvent['npcs'])) {
                for($i=0;$i<count($thisEvent['npcs']); $i++) {
                    if ($thisEvent['npcs'][$i]['movement'][0] == '-') {
                        if ($thisEvent['npcs'][$i]['isCollidable']) {
                            $clearTiles[($thisEvent['npcs'][$i]['tileY'])][($thisEvent['npcs'][$i]['tileX'])] = '1';
                        }
                    }
                }
            }
        }
    }


$mapTilesY = count($mapData['map']['terrain']);
$mapTilesX = count($mapData['map']['terrain'][0]);

$resources = array();

foreach ($whichCategories as &$thisCategory) {
    $resources[$thisCategory] = array();
    $numberOfNodes = mt_rand(2,4);
    $assignedNodes = 0;
    do {
        $thisX = mt_rand(0,$mapTilesX-1);
        $thisY = mt_rand(0,$mapTilesY-1);
        if($clearTiles[$thisY][$thisX] == '0') {
            // check it's accessible from the entrance: ##############
            $isAccessible = true;
            if($isAccessible) {
                array_push($resources[$thisCategory],array($thisX,$thisY));
                $assignedNodes++;
                // mark it as not clear now:
                $clearTiles[$thisY][$thisX] == '1';
            }
        }
    } while ($assignedNodes<$numberOfNodes);
}






    

   

    $mapData['map']['hiddenResources'] = $resources;
}




generatePositionsOfHiddenResourceNodes();

if ($hasProceduralContent !== false) {
    
    // check for any procedural elements that need to be added:

    for($i=0;$i<count($mapData['map']['items']); $i++) {
        if(($mapData['map']['items'][$i]['type'] == 32) || ($mapData['map']['items'][$i]['type'] == 33)) {
            if(isset($mapData['map']['items'][$i]['inscription'])) {
                if($mapData['map']['items'][$i]['inscription'] == "##procedural##") {
                    // generate a book:
                    include_once($_SERVER['DOCUMENT_ROOT']."/game-world/generateBook.php");
                    $newTimeStamp = new DateTime();
                    $mapData['map']['items'][$i]['inscription'] = array();
                    $mapData['map']['items'][$i]['inscription']['title'] = createProceduralTitle();
                    $mapData['map']['items'][$i]['inscription']['timeCreated'] = $newTimeStamp->getTimestamp();
                    $mapData['map']['items'][$i]['inscription']['content'] = createProceduralBook();
                }
            }
        }
    }

    for($i=0;$i<count($mapData['map']['npcs']); $i++) {
        if($mapData['map']['npcs'][$i]['name'] == "##procedural##") {
            // create a procedural NPC:
            include_once($_SERVER['DOCUMENT_ROOT']."/includes/replaceImageHue.php");
            $mapData['map']['npcs'][$i]['name'] = "Person";
            $newColour = substr(md5(rand()), 0, 6);
            replaceHue('npcs/labourer.png','ffbc47',$newColour,40);
            $mapData['map']['npcs'][$i]['src'] = "procedural/labourer-".$newColour.".png";
            $mapData['map']['npcs'][$i]['width'] = 20;
            $mapData['map']['npcs'][$i]['height'] = 20;
            $mapData['map']['npcs'][$i]['spriteWidth'] = 75;
            $mapData['map']['npcs'][$i]['spriteHeight'] = 85;
            $mapData['map']['npcs'][$i]['centreX'] = 56;
            $mapData['map']['npcs'][$i]['centreY'] = 73;
            $mapData['map']['npcs'][$i]['movement'] = array("-");
            $mapData['map']['npcs'][$i]['facing'] = 'e';
            $mapData['map']['npcs'][$i]['walkThroughDoors'] = false;
            $mapData['map']['npcs'][$i]['speed'] = 2;
            $mapData['map']['npcs'][$i]['speech'] = array(["hi, I'm random/fancy that/procedurally generated and everything/amazing...", ""]);
            $mapData['map']['npcs'][$i]['speechIndex'] = 0;
            $mapData['map']['npcs'][$i]['cardGameSpeech'] = array("challenge"=>array("Do you play? Fancy a game then?", "play"),"win"=>array("Woo! I won!", ""),"lose"=>array("Ahh, you beat me...", ""),"draw"=>array("Well played", ""));
            $mapData['map']['npcs'][$i]['isCollidable'] = true;
            $mapData['map']['npcs'][$i]['isMoving'] = false;
            $mapData['map']['npcs'][$i]['cardSkill'] = 1;
            $mapData['map']['npcs'][$i]['baseCardPack'] = 0;
            $mapData['map']['npcs'][$i]['uniqueCards'] = array(rand(1, 5));
            $mapData['map']['npcs'][$i]['animation']["walk"] = array("length"=>"1", "n"=>"2", "e"=>"3", "s"=>"0", "w"=>"1");
        }
    }

    for($i=0;$i<count($mapData['map']['shops']); $i++) {
        if($mapData['map']['shops'][$i]['uniqueItems'] == "##procedural##") {
            // get random items from database:
            include_once($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
            include_once($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");
            // get random items that aren't locked to events:
            $query = "select itemid from tblinventoryitems where activeduringseason is null and showinthecodex = 1 order by rand() limit 10";
$result = mysql_query( $query ) or die ( "couldn't execute events query: ".$query );
        $numberofrows = mysql_num_rows( $result );
        $itemIds = [];
    if ( $numberofrows>0 ) {
        while ( $row = mysql_fetch_array( $result ) ) {
        $itemIds[$row['itemid']] = array(array());
           //array_push($itemIds, $row['itemid']);

        }
      
    }
mysql_free_result($result);
$mapData['map']['shops'][$i]['uniqueItems'] = $itemIds;
        }
    }
    
} 

if ($hasEventContent !== false) {

/*if(!(isset($mapData))) {
    $mapData = json_decode($mapDataFile, true);
}
*/
for ($i=0;$i<count($activeEvents);$i++) {
    if(isset($mapData['map']['eventSpecificContent'][($activeEvents[$i])])) {
        $thisGroup = $mapData['map']['eventSpecificContent'][($activeEvents[$i])];
        foreach ($thisGroup as $key => $j) {
            for ($k=0;$k<count($j);$k++) {
                array_push($mapData['map'][$key],$j[$k]);
            }
        }
    }
}
// remove events data so it doesn't get passed to the game:
unset($mapData['map']['eventSpecificContent']);
}

//if(isset($mapData)) {
    echo json_encode($mapData);
//} else {
//    echo $mapDataFile;
//}




?>