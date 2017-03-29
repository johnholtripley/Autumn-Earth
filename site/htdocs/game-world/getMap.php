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
if ($hasProceduralContent !== false) {
    $mapData = json_decode($mapDataFile, true);
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
if(!(isset($mapData))) {
    $mapData = json_decode($mapDataFile, true);
}
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

if(isset($mapData)) {
    echo json_encode($mapData);
} else {
    echo $mapDataFile;
}




?>