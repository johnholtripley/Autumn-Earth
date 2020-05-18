<?php

//include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
//include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/functions.php");

$chr = $_GET["chr"];
$map = $_GET["map"];
$debug = false;
if(isset($_GET["debug"])) {
    $debug = true;
}

$homeBaseContinent = "eastern-continent";
$homeBaseX = 200;
$homeBaseY = 350;

$randomDungeonName = '';
$randomDungeonSeed = '';
if(isset($_GET["dungeonName"])) {
         $randomDungeonName = $_GET["dungeonName"];  
}
if(isset($_GET["seed"])) {
         $randomDungeonSeed = $_GET["seed"];  
}


// Shop config: 
$inflationModifier = 10;
$sellPriceModifier = 0.7;
$sellPriceSpecialismModifier = 0.8;
$buyPriceSpecialismModifier = 0.9;
$shopSizePriceLimits = ["small"=>"5", "medium"=>"10", "large"=>"9999999999"];




$jsonMapResults = file_get_contents($_SERVER['DOCUMENT_ROOT'].'/data/world-map.json');
$mapJson = json_decode($jsonMapResults, true);
$worldMap = $mapJson['worldMap'];
$worldMapTileLength = 50;


// helper functions: 
/*
function findRelativeWorldMapPosition($mapNumber) {
    // find the relative position of the passed in map number to the current map in the worldMap array
     $currentMapPosition = findWorldMapPosition($currentMap);
     $targetMapPosition = findWorldMapPosition($mapNumber);
     $xDiff = $targetMapPosition[0] - $currentMapPosition[0];
     $yDiff = $targetMapPosition[1] - $currentMapPosition[1];
     $worldXLength = count($worldMap[0]);
     $worldYLength = count($worldMap);
    // wrap around:
    if ($xDiff >= $worldXLength / 2) {
        $xDiff -= $worldXLength;
    }
    if ($xDiff <= 0 - ($worldXLength / 2)) {
        $xDiff += $worldXLength;
    }
    if ($yDiff >= $worldYLength / 2) {
        $yDiff -= $worldYLength;
    }
    if ($yDiff <= 0 - ($worldYLength / 2)) {
        $yDiff += $worldYLength;
    }
    return (array($xDiff, $yDiff));
}
*/

function generateHash($sourceString) {
    // duplicate function in game world helper-functions:

    // http://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript-jquery
    $hash = 0;
    if (strlen($sourceString) === 0) {
        return hash;
    }
    $allCharacters = str_split($sourceString);
    for ($i = 0; $i < count($allCharacters); $i++) {
        $chr = ord($allCharacters[$i]);
        $hash = (($hash << 5) - $hash) + $chr;
        $hash |= 0; // Convert to 32bit integer
    }
    return $hash;
}

include_once($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include_once($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");


$query4 = 'SELECT * from tblcharacters where charid="'.$chr.'"';
$result4 = mysqli_query($connection, $query4);
if(mysqli_num_rows($result4)>0) {
while ($row = mysqli_fetch_array($result4)) {
    extract($row);
    $characterName = $charName;
    $recipesKnown = explode(",",   str_replace("[", "", str_replace("]", "", $recipesKnown)));

    }
    }
    mysqli_free_result($result4);






// get from logged in account ###
$characterClass = "Druid";
$primaryProfession = "Herbalist";

if(!$debug){
header('Content-Type: application/json');
}

$isPlayerHousing = false;
// check for player housing:
if(stripos($map, "housing") !== false) {
    // is player housing:
    $isPlayerHousing = true;
    $housingDetails = explode("-",$map);
    // eg. // house-999-floor0
    $mapDataFile = file_get_contents('../data/chr' .  $housingDetails[1] . '/housing/' . $housingDetails[2] . '.json');
} else {
    if($map>0) {
    $mapDataFile = file_get_contents('../data/chr' .  $chr . '/map' . $map . '.json');
} else {

// get procedural map:
    $isEmbeddedInGetMap = true;
    include($_SERVER['DOCUMENT_ROOT'] . "/game-world/generateCircularDungeonMap.php");


$mapDataFile = $thisMapDataJson;


}
}



$mapDataFile = str_replace('##characterName##', $characterName, $mapDataFile);
$mapDataFile = str_replace('##characterClass##', $characterClass, $mapDataFile);
$mapDataFile = str_replace('##characterProfession##', $primaryProfession, $mapDataFile);

$hasProceduralContent = strrpos($mapDataFile, '##procedural##');
$hasEventContent = strrpos($mapDataFile, 'eventSpecificContent');




$mapData = json_decode($mapDataFile, true);

if(!(isset($mapData['map']['musicOnEnter']))) {
$mapData['map']['musicOnEnter'] = '';
}

if(!(isset($mapData['map']['backgroundOffsetX']))) {
$mapData['map']['backgroundOffsetX'] = '0';
}
if(!(isset($mapData['map']['backgroundOffsetY']))) {
$mapData['map']['backgroundOffsetY'] = '0';
}

$isInside = $mapData['map']['isInside'];

if(!$isInside) {
$globalPosition = findWorldMapPosition($map);
// add map's global position:
$mapData['map']['globalCoordinateTile0X'] = $globalPosition[0];
$mapData['map']['globalCoordinateTile0Y'] = $globalPosition[1];


} else {
    // no global offset required:
    $globalPosition = [0,0];
}

$mapData['map']['mapId'] = $map;



// check which events are active


// get current active events:
$activeEvents = [];
$activeEventsID = [];
$eventsQuery = "SELECT cleanURL, eventID from tblevents WHERE ((repeatsAnnually and ((dayofyear(now()) between (dayofyear(eventstart)) and (dayofyear(eventstart)+eventdurationdays-1)) or (dayofyear(now()) between (dayofyear(eventstart) - 365) and (dayofyear(eventstart)+eventdurationdays-366)))) or ((repeatsAnnually = 0) and (date(now()) between (eventstart) and (eventstart+eventdurationdays))))";

$eventsResult = mysqli_query($connection,  $eventsQuery ) or die ( "couldn't execute events query: ".$eventsQuery );
$numberofrows = mysqli_num_rows( $eventsResult );
if ( $numberofrows>0 ) {
    while ( $row = mysqli_fetch_array( $eventsResult ) ) {
    array_push($activeEvents, $row['cleanURL']);
    array_push($activeEventsID, $row['eventID']);
    }
}
mysqli_free_result($eventsResult);





if(!$isInside) {
// change local coordinates from JSON to global coordinates based on the map's position:
// items:
for ($i = 0; $i < count($mapData['map']['items']); $i++) {
    $mapData['map']['items'][$i]['tileX'] += $globalPosition[0] * $worldMapTileLength;
    $mapData['map']['items'][$i]['tileY'] += $globalPosition[1] * $worldMapTileLength;
}
// NPCs:
for ($i = 0; $i < count($mapData['map']['npcs']); $i++) {
    $mapData['map']['npcs'][$i]['tileX'] += $globalPosition[0] * $worldMapTileLength;
    $mapData['map']['npcs'][$i]['tileY'] += $globalPosition[1] * $worldMapTileLength;
}
// doors:
foreach ($mapData['map']['doors'] as $key => $value) {
$thisKeySplit = explode(",",$key);
$thisNewX = intval($thisKeySplit[0])+$globalPosition[0] * $worldMapTileLength;
$thisNewY = intval($thisKeySplit[1])+$globalPosition[1] * $worldMapTileLength;
$newKey = $thisNewX .",".$thisNewY;
// remove old key, and set new one:
$mapData['map']['doors'][$newKey] = $mapData['map']['doors'][$key];
unset($mapData['map']['doors'][$key]);
}
// hotspots:
for ($i = 0; $i < count($mapData['map']['hotspots']); $i++) {
    $mapData['map']['hotspots'][$i]['centreX'] += $globalPosition[0] * $worldMapTileLength;
    $mapData['map']['hotspots'][$i]['centreY'] += $globalPosition[1] * $worldMapTileLength;
}


// check seasonal content as well:
for ($j=0;$j<count($activeEvents);$j++) {
    if(isset($mapData['map']['eventSpecificContent'][($activeEvents[$j])])) {
    $thisEvent = $mapData['map']['eventSpecificContent'][($activeEvents[$j])];
        if(isset($thisEvent['npcs'])) {
            for($i=0;$i<count($thisEvent['npcs']); $i++) {
                $mapData['map']['eventSpecificContent'][($activeEvents[$j])]['npcs'][$i]['tileX'] += $globalPosition[0] * $worldMapTileLength;
                $mapData['map']['eventSpecificContent'][($activeEvents[$j])]['npcs'][$i]['tileY'] += $globalPosition[1] * $worldMapTileLength;
            }
        }
        if(isset($thisEvent['items'])) {
            for($i=0;$i<count($thisEvent['items']); $i++) {
                  $mapData['map']['eventSpecificContent'][($activeEvents[$j])]['items'][$i]['tileX'] += $globalPosition[0] * $worldMapTileLength;
                $mapData['map']['eventSpecificContent'][($activeEvents[$j])]['items'][$i]['tileY'] += $globalPosition[1] * $worldMapTileLength;
            }
        }


    }
}

}


// loop through doors and if pointing to an overWorld map, then change the coords to global:


if($map > 0) {
foreach ($mapData['map']['doors'] as $key => $value) {
    // load this map and check if it's an over world map or not:
if($value['map']>0) {

$thisDoorJsonMapResults = file_get_contents('../data/chr' .  $chr . '/map' . $value['map'] . '.json');
$thisDoorMapJson = json_decode($thisDoorJsonMapResults, true);


if(!($thisDoorMapJson['map']['isInside'])) {
// convert to global coordinates:
    $thisDoorGlobalPosition = findWorldMapPosition($value['map']);


$mapData['map']['doors'][$key]['startX'] += $thisDoorGlobalPosition[0] * $worldMapTileLength;
 $mapData['map']['doors'][$key]['startY'] += $thisDoorGlobalPosition[1] * $worldMapTileLength;


}

}

    }
}




function pathIsConnected($targetX, $targetY) {
  //  echo "looking for ".$targetX . "_" . $targetY.": ";
    global $mapData, $clearTiles, $mapTilesY, $mapTilesX;
    $connectionFound = false;
    // get first element of the doors array (it's associative):
    reset($mapData['map']['doors']);
$firstKey = key($mapData['map']['doors']);
    $startDoor = explode(",",$firstKey);
    $openList = array($startDoor[0]."_".$startDoor[1]);

    $closedList = array();
    $stillWorking = true;
    do {
       
        if (count($openList) > 0) {
            $thisNode = array_pop($openList);
            array_unshift($closedList, $thisNode);
      
            if ($thisNode == $targetX . "_" . $targetY) {
                  // found exit door:
            
                $stillWorking = false;
                $connectionFound = true;
            } else {
                // add valid neighbours to the open list:
                $nodesPosition = explode("_", $thisNode);
                // needs to be greater than 1 as 0 will be map edge and don't want to include these:

                if ($nodesPosition[0] > 1) {
                  //  echo "true1 ";
                    // check it's clear:
                //    echo "considering ".($nodesPosition[0]-1)."_".$nodesPosition[1]." - ".$clearTiles[$nodesPosition[1]][$nodesPosition[0]+1]." ... ";
                    if($clearTiles[$nodesPosition[1]][$nodesPosition[0]-1] !== '1') {
                        // check it's not already been added:
                        $newNode = ($nodesPosition[0] - 1) . "_" . $nodesPosition[1];
                         if (!(in_array($newNode, $closedList))) {
                            if (!(in_array($newNode, $openList))) {
                                array_unshift($openList, $newNode);
                            }
                        }
                    }
                }
          
             //   echo (intval($mapTilesX)-2);
            
                if ($nodesPosition[0] <= ($mapTilesX - 3)) {
               //     echo "true2 ";
               //     echo "considering ".($nodesPosition[0]+1)."_".$nodesPosition[1]." - ".$clearTiles[$nodesPosition[1]][$nodesPosition[0]+1]." ... ";
                    if($clearTiles[$nodesPosition[1]][$nodesPosition[0]+1] !== '1') {
                          $newNode = ($nodesPosition[0] + 1) . "_" . $nodesPosition[1];
                         if (!(in_array($newNode, $closedList))) {
                            if (!(in_array($newNode, $openList))) {
                                array_unshift($openList, $newNode);
                            }
                        }
                    }
                }
                if ($nodesPosition[1] > 1) {
                 //   echo "true3 ";
                //    echo "considering ".($nodesPosition[0])."_".($nodesPosition[1]-1)." - ".$clearTiles[$nodesPosition[1]-1][$nodesPosition[0]]." ... ";
                    if($clearTiles[$nodesPosition[1]-1][$nodesPosition[0]] !== '1') {
                         $newNode = ($nodesPosition[0]) . "_" . ($nodesPosition[1]-1);
                         if (!(in_array($newNode, $closedList))) {
                            if (!(in_array($newNode, $openList))) {
                                array_unshift($openList, $newNode);
                            }
                        }
                    }
                }
                if ($nodesPosition[1] <= $mapTilesY - 3) {
                 //   echo "true4 ";
                 //   echo "considering ".($nodesPosition[0])."_".($nodesPosition[1]+1)." - ".$clearTiles[$nodesPosition[1]+1][$nodesPosition[0]]." ... ";
                     if($clearTiles[$nodesPosition[1]+1][$nodesPosition[0]] !== '1') {
                        $newNode = ($nodesPosition[0]) . "_" . ($nodesPosition[1]+1);
                         if (!(in_array($newNode, $closedList))) {
                            if (!(in_array($newNode, $openList))) {
                                array_unshift($openList, $newNode);
                            }
                        }
                    }
                }
            }
        } else {
             // run out of open tiles:
            $stillWorking = false;
            $connectionFound = false;
        }
    } while ($stillWorking);
  //  echo " || ended || ";
  //  var_dump($connectionFound);
    return $connectionFound;
}

function capValues($variable, $min, $max) {
if($variable < $min) {
    $variable = $min;
}
if($variable > $max) {
$variable = $max;
}
return $variable;
}

function generatePositionsOfHiddenResourceNodes() {
    global $mapData, $activeEvents, $activeEventsID, $clearTiles, $mapTilesY, $mapTilesX, $connection, $globalPosition, $worldMapTileLength;

 

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


// loop through clearTiles (inset from the edge by 1 though) and any that are blocked, mark the tiles immediately adjacent (N, E, S and W) as blocked as well, to allow space for the resource to be spawned
// ie. 'clear' tiles are themselves and their ordinal neighbours clear:

for ($i = 1; $i < $mapTilesX-1; $i++) {
            for ( $j = 1; $j < $mapTilesY-1; $j++) {
                if ($clearTiles[$j][$i] == "1") {
                    // don't mark these as '1' otherwise it will then block their neighbours as well:
                    $clearTiles[$j-1][$i] = "2";
                    $clearTiles[$j+1][$i] = "2";
                    $clearTiles[$j][$i+1] = "2";
                    $clearTiles[$j][$i-1] = "2";
                    }
                }
            }


for ($i = 1; $i < $mapTilesX-1; $i++) {
            for ( $j = 1; $j < $mapTilesY-1; $j++) {
         if ($clearTiles[$j][$i] == "2") {
$clearTiles[$j][$i] = "1";
         }
            }
        }







$resources = array();

$possibleNodes = array();
$possibleItems = array();
$possibleDyeableItems = array();
foreach ($whichCategories as &$thisCategory) {
    $possibleNodes[$thisCategory] = array();
    $possibleItems[$thisCategory] = array();
    $possibleDyeableItems[$thisCategory] = array();
}


if(count($whichCategories) > 0) {

$activeEventsQuery = '';
if(count($activeEventsID)>0) {
$activeEventsQuery = 'activeduringseason in (".implode(",",$activeEventsID).") or ';
}


// query the database to find all node items of the relevant categories:
$nodeQuery = "SELECT * from tblinventoryitems where (itemcategories in (".implode(",",$whichCategories).") ) and (".$activeEventsQuery."activeduringseason IS NULL)";



$nodeResult = mysqli_query($connection,  $nodeQuery ) or die ( "couldn't execute node query: ".$nodeQuery );
$numberofrows = mysqli_num_rows( $nodeResult );
if ( $numberofrows>0 ) {
    while ( $row = mysqli_fetch_array( $nodeResult ) ) {
        extract($row);
        // check action=='node' or not (if not, goes in contains)
        if($action == "node") {
array_push($possibleNodes[$itemCategories],$itemID);
        } else {
array_push($possibleItems[$itemCategories],$itemID);
        }
        if($dyeable) {
array_push($possibleDyeableItems[$itemCategories],$itemID);
        }
 
    }
}
mysqli_free_result($nodeResult);

$maxAttemptsPerCategory = $mapTilesX * $mapTilesY / 4;

foreach ($whichCategories as &$thisCategory) {
    $resources[$thisCategory] = array();
    $numberOfNodes = mt_rand(2,4);
    $assignedNodes = 0;
    $numberOfAttempts = 0;
    do {
        $thisX = mt_rand(0,$mapTilesX-1);
        $thisY = mt_rand(0,$mapTilesY-1);
        if($clearTiles[$thisY][$thisX] == '0') {
            
         //   $isAccessible = pathIsConnected($thisX,$thisY);
           $isAccessible = true;
            if($isAccessible) {


$containsContent = "";
$colourContent = "0";
$allItemsAreDyeable = true;
$numberOfContains = mt_rand(1,count($possibleItems[$thisCategory]));

for ($i=0;$i<$numberOfContains;$i++) {
    $thisItem = $possibleItems[$thisCategory][mt_rand(0, count($possibleItems[$thisCategory]) - 1)];
    if(!(in_array($thisItem, $possibleDyeableItems[$thisCategory]))) {
        $allItemsAreDyeable = false;

    }
$containsContent .= $thisItem."/";
}
$containsContent = rtrim($containsContent, '/');
if($allItemsAreDyeable) {
    $colourContent = "1/2/4/5/6/8/16";
}

$resourceTier = $mapData['map']['hiddenResourceTier'];
$thisItemQuality = mt_rand($resourceTier*10,($resourceTier+1)*10);
$thisItemStability = mt_rand($resourceTier*10,($resourceTier+1)*10);
$thisItemPurity = mt_rand($resourceTier*10,($resourceTier+1)*10);
$thisItemQuantity = mt_rand($resourceTier+4,($resourceTier+10));
// allow some variation outside of the constraints:
$thisItemQuality *= mt_rand(0.8,1.2);
$thisItemStability *= mt_rand(0.8,1.2);
$thisItemPurity *= mt_rand(0.8,1.2);


$thisItemQuality = capValues($thisItemQuality, 20, 100);
$thisItemStability = capValues($thisItemStability, 20, 100);
$thisItemPurity = capValues($thisItemPurity, 20, 100);
$thisItemQuantity = capValues($thisItemQuantity, 3, 20);

// tileX and tileY are global coordinates:
$thisItemObject = array(
    "type"=>intval($possibleNodes[$thisCategory][mt_rand(0, count($possibleNodes[$thisCategory]) - 1)]),
    "tileX"=>$thisX + $globalPosition[0] * $worldMapTileLength,
    "tileY"=>$thisY + $globalPosition[1] * $worldMapTileLength,
    "quality"=> $thisItemQuality,
    "maxStability"=> $thisItemStability,
    "maxQuantity"=> $thisItemQuantity,
    "purity"=> $thisItemPurity,
    "state"=> "active",
    "animation"=> array(
        "active"=> array("length"=> 1,"row"=>0),
        "inactive"=> array("length"=> 1,"row"=>1)
    ),
    "contains"=>array(array(
        "type"=>$containsContent,
        "colour"=>$colourContent
    )
    ));

                array_push($resources[$thisCategory],$thisItemObject);
       
                $assignedNodes++;
                // mark it as not clear now:
                $clearTiles[$thisY][$thisX] = '1';
            }
        }
        $numberOfAttempts ++;
    } while (($assignedNodes<$numberOfNodes) && ($numberOfAttempts < $maxAttemptsPerCategory));
}




    

   

    $mapData['map']['hiddenResources'] = $resources;
} else {
    $mapData['map']['hiddenResources'] = '';
}
}

if((!$isPlayerHousing) && (!$isInside)) {

// see if this player has any housing:
 //   $externalHousingDataPath = $_SERVER['DOCUMENT_ROOT'].'/data/chr'.$chr.'/housing/external.json';

//if (file_exists($externalHousingDataPath)) {
    
 //   $jsonHousingFile = file_get_contents($externalHousingDataPath);
 //  $externalHousingMapJson = json_decode($jsonHousingFile, true);
 //  $housingWidth = count($externalHousingMapJson['map']['collisions'][0]);
 //  $housingHeight = count($externalHousingMapJson['map']['collisions']);
   // see if any part of this falls within the requested map:


$westEdgeTile = $globalPosition[0]*$worldMapTileLength;
$eastEdgeTile = (($globalPosition[0]+1)*$worldMapTileLength)-1;
$NorthEdgeTile = $globalPosition[1]*$worldMapTileLength;
$SouthEdgeTile = (($globalPosition[1]+1)*$worldMapTileLength)-1;
 

   // house North edge >= $NorthEdgeTile
   // house North edge  <= $SouthEdgeTile - housingHeight

$housingQuery = "SELECT * from tblplayerhousing where NOT ((northWestCornerTileX  >  ".$eastEdgeTile.") OR (southEastCornerTileX  <  ".$westEdgeTile.") OR (northWestCornerTileY > ".$SouthEdgeTile.") OR (southEastCornerTileY  <  ".$NorthEdgeTile.") )";

$housingResult = mysqli_query($connection,  $housingQuery ) or die ( "couldn't execute events query: ".$housingQuery );
$numberOfHouses = mysqli_num_rows( $housingResult );

if ( $numberOfHouses>0) {
    while ( $housingRow = mysqli_fetch_array( $housingResult ) ) {
//var_dump($housingRow);

        $graphicsBeingUsed = array();

for ($i=0;$i<count($mapData['map']['graphics']);$i++) {
$graphicsBeingUsed[$mapData['map']['graphics'][$i]['src']] = $i;
}



 extract($housingRow);
        // load in external housing
        $housingFile = file_get_contents('../data/chr'.$characterID.'/housing/external.json');
        $housingData = json_decode($housingFile, true);

    $thisHouseWidth = count($housingData['map']['terrain'][0]);
        $thisHouseLength = count($housingData['map']['terrain']);

// add items:
  for ($i=0;$i<count($housingData['map']['items']);$i++) {
    $housingData['map']['items'][$i]['tileX'] += $northWestCornerTileX;
    $housingData['map']['items'][$i]['tileY'] += $northWestCornerTileY;
    // check that this item is part of the reqyested map (in case the housing spans 2 or more maps):
    // ##
    if($housingData['map']['items'][$i]['tileY'] >= $NorthEdgeTile) {
    if($housingData['map']['items'][$i]['tileY'] <= $SouthEdgeTile) {
    if($housingData['map']['items'][$i]['tileX'] >= $westEdgeTile) {
    if($housingData['map']['items'][$i]['tileX'] <= $eastEdgeTile) {
          array_push($mapData['map']['items'], $housingData['map']['items'][$i]);
    }
}
}
}
  
  }  


// add shops:
  for ($i=0;$i<count($housingData['map']['shops']);$i++) {
    // see if this shop name exists already:
    // (ideally this check is done when assigning a name to the shop - but just in case)
    $thisShopName = $housingData['map']['shops'][$i]['name'];
    for ($j=0;$j<count($mapData['map']['shops']);$j++) {
        if($thisShopName == $mapData['map']['shops'][$j]['name']) {

$housingData['map']['shops'][$i]['name'] = $characterName."'s ".$thisShopName; 
// find the corresponding NPC's dialogue:

$thisHousesNPCs = json_encode($housingData['map']['npcs']);
$thisHousesNPCs = str_replace($thisShopName, $characterName."'s ".$thisShopName, $thisHousesNPCs);
$housingData['map']['npcs'] = json_decode($thisHousesNPCs, true);


break;
        }
    }
     array_push($mapData['map']['shops'], $housingData['map']['shops'][$i]);
  }


 // add NPCs:
  $thisHousesNPCs = json_encode($housingData['map']['npcs']);
$thisHousesNPCs = str_replace('##characterName##', $characterName, $thisHousesNPCs);
$thisHousesNPCs = str_replace('##characterClass##', $characterClass, $thisHousesNPCs);
$thisHousesNPCs = str_replace('##characterProfession##', $primaryProfession, $thisHousesNPCs);
$housingData['map']['npcs'] = json_decode($thisHousesNPCs, true);
 
    for ($i=0;$i<count($housingData['map']['npcs']);$i++) {
    $housingData['map']['npcs'][$i]['tileX'] += $northWestCornerTileX;
    $housingData['map']['npcs'][$i]['tileY'] += $northWestCornerTileY;
    array_push($mapData['map']['npcs'], $housingData['map']['npcs'][$i]);
  }  

      
      // add doors:
  foreach ($housingData['map']['doors'] as $key => $i) {

$keySplit = explode(",", $key);
$newKey = ($keySplit[0]+$northWestCornerTileX).",".($keySplit[1]+$northWestCornerTileY);

// update with the new key:
$housingData['map']['doors'][$newKey] = $housingData['map']['doors'][$key];
unset($housingData['map']['doors'][$key]);

    $mapData['map']['doors'][$newKey] = $housingData['map']['doors'][$newKey];
  }  


  $graphicsForThisHouse = $housingData['map']['graphics'];


$localNorthWestCornerTileX = $northWestCornerTileX - ($mapData['map']['globalCoordinateTile0X'] * $worldMapTileLength);
$localNorthWestCornerTileY = $northWestCornerTileY - ($mapData['map']['globalCoordinateTile0Y'] * $worldMapTileLength);


for ($i=0;$i<$thisHouseWidth;$i++) {
    for ($j=0;$j<$thisHouseLength;$j++) {
        // check if graphics are already used, if not add them to the list and map the id appropriately:
        // don't overwrite underlying terrain with any "?" items in the housing data:

$thisLocalHousingTileY = $j + $localNorthWestCornerTileY;
$thisLocalHousingTileX = $i + $localNorthWestCornerTileX;
$isAValidHousingTile = true;
if(($thisLocalHousingTileX<0) || ($thisLocalHousingTileY<0)){
$isAValidHousingTile = false;
}

if(($thisLocalHousingTileX>=$worldMapTileLength) || ($thisLocalHousingTileY>=$worldMapTileLength)){
$isAValidHousingTile = false;
}


if($isAValidHousingTile) {
        if($housingData['map']['terrain'][$j][$i] !== "?") {
            if($housingData['map']['terrain'][$j][$i] === "*") {
                $mapData['map']['terrain'][$thisLocalHousingTileY][$thisLocalHousingTileX] = "*";
            } else {
                // check if the same filename has already been added and use that reference instead to avoid duplicating images:
                if(array_key_exists(($graphicsForThisHouse[($housingData['map']['terrain'][$j][$i])]['src']),$graphicsBeingUsed)) {
                    // already being used, so use the reference already held:
                    $mapData['map']['terrain'][$thisLocalHousingTileY][$thisLocalHousingTileX] = $graphicsBeingUsed[($graphicsForThisHouse[($housingData['map']['terrain'][$j][$i])]['src'])];
                } else {
                    // add and store for later:
                    $numberOfGraphicsSoFar = count($graphicsBeingUsed);
                    $mapData['map']['terrain'][$thisLocalHousingTileY][$thisLocalHousingTileX] = $numberOfGraphicsSoFar;
                    $graphicsBeingUsed[($graphicsForThisHouse[($housingData['map']['terrain'][$j][$i])]['src'])] = $numberOfGraphicsSoFar;
                    array_push($mapData['map']['graphics'],  $graphicsForThisHouse[$housingData['map']['terrain'][$j][$i]]  );
                }
            }
            $mapData['map']['collisions'][$thisLocalHousingTileY][$thisLocalHousingTileX] = $housingData['map']['collisions'][$j][$i];
            $mapData['map']['properties'][$thisLocalHousingTileY][$thisLocalHousingTileX] = $housingData['map']['properties'][$j][$i];
        }

}

    }
}
  

    }
    }
    mysqli_free_result($housingResult);
//} 






/*


// see if there's any player housing on this map:
$housingQuery = "SELECT * from tblplayerhousing where mapid = ".$map;

$housingResult = mysqli_query($connection,  $housingQuery ) or die ( "couldn't execute events query: ".$housingQuery );
$numberOfHouses = mysqli_num_rows( $housingResult );
if ( $numberOfHouses>0 ) {
    while ( $row = mysqli_fetch_array( $housingResult ) ) {

$graphicsBeingUsed = array();

for ($i=0;$i<count($mapData['map']['graphics']);$i++) {
$graphicsBeingUsed[$mapData['map']['graphics'][$i]['src']] = $i;
}

        extract($row);
        // load in external housing
        $housingFile = file_get_contents('../data/chr'.$chr.'/housing/external.json');
        $housingData = json_decode($housingFile, true);
        $thisHouseWidth = count($housingData['map']['terrain'][0]);
        $thisHouseLength = count($housingData['map']['terrain']);
$graphicsForThisHouse = $housingData['map']['graphics'];
     for ($i=0;$i<$thisHouseWidth;$i++) {
     for ($j=0;$j<$thisHouseLength;$j++) {

// check if graphics are already used, if not add them to the list and map the id appropriately:
        // don't overwrite underlying terrain with any "?" items in the housing data:
        if($housingData['map']['terrain'][$j][$i] !== "?") {
            if($housingData['map']['terrain'][$j][$i] === "*") {
                $mapData['map']['terrain'][$j+$northWestCornerTileY][$i+$northWestCornerTileX] = "*";
          
            } else {
// check if the same filename has already been added and use that reference instead to avoid duplicating images:
                if(array_key_exists(($graphicsForThisHouse[($housingData['map']['terrain'][$j][$i])]['src']),$graphicsBeingUsed)) {
            // already being used, so use the reference already held:
                     $mapData['map']['terrain'][$j+$northWestCornerTileY][$i+$northWestCornerTileX] = $graphicsBeingUsed[($graphicsForThisHouse[($housingData['map']['terrain'][$j][$i])]['src'])];
                } else {
                    // add and store for later:
                     $numberOfGraphicsSoFar = count($graphicsBeingUsed);
                     $mapData['map']['terrain'][$j+$northWestCornerTileY][$i+$northWestCornerTileX] = $numberOfGraphicsSoFar;
                     $graphicsBeingUsed[($graphicsForThisHouse[($housingData['map']['terrain'][$j][$i])]['src'])] = $numberOfGraphicsSoFar;
                     array_push($mapData['map']['graphics'],  $graphicsForThisHouse[$housingData['map']['terrain'][$j][$i]]  );
                }



             
            }
   $mapData['map']['collisions'][$j+$northWestCornerTileY][$i+$northWestCornerTileX] = $housingData['map']['collisions'][$j][$i];
$mapData['map']['elevation'][$j+$northWestCornerTileY][$i+$northWestCornerTileX] = $housingData['map']['elevation'][$j][$i];
}

     }
     }
    
// add items:
  for ($i=0;$i<count($housingData['map']['items']);$i++) {
    $housingData['map']['items'][$i]['tileX'] += $northWestCornerTileX;
    $housingData['map']['items'][$i]['tileY'] += $northWestCornerTileY;
    array_push($mapData['map']['items'], $housingData['map']['items'][$i]);
  }  




// add shops:
  for ($i=0;$i<count($housingData['map']['shops']);$i++) {
    // see if this shop name exists already:
    // (ideally this check is done when assigning a name to the shop - but just in case)
    $thisShopName = $housingData['map']['shops'][$i]['name'];
    for ($j=0;$j<count($mapData['map']['shops']);$j++) {
        if($thisShopName == $mapData['map']['shops'][$j]['name']) {

$housingData['map']['shops'][$i]['name'] = $characterName."'s ".$thisShopName; 
// find the corresponding NPC's dialogue:

$thisHousesNPCs = json_encode($housingData['map']['npcs']);
$thisHousesNPCs = str_replace($thisShopName, $characterName."'s ".$thisShopName, $thisHousesNPCs);
$housingData['map']['npcs'] = json_decode($thisHousesNPCs, true);


break;
        }
    }
     array_push($mapData['map']['shops'], $housingData['map']['shops'][$i]);
  }




    
      
      // add doors:
  foreach ($housingData['map']['doors'] as $key => $i) {

$keySplit = explode(",", $key);
$newKey = ($keySplit[0]+$northWestCornerTileX).",".($keySplit[1]+$northWestCornerTileY);

// update with the new key:
$housingData['map']['doors'][$newKey] = $housingData['map']['doors'][$key];
unset($housingData['map']['doors'][$key]);

    $mapData['map']['doors'][$newKey] = $housingData['map']['doors'][$newKey];
  }  



    }
}
mysqli_free_result($housingResult);

*/



generatePositionsOfHiddenResourceNodes();

}






if ($hasProceduralContent !== false) {
    
    // check for any procedural elements that need to be added:

    for($i=0;$i<count($mapData['map']['items']); $i++) {
        
            if(isset($mapData['map']['items'][$i]['inscription'])) {
                if($mapData['map']['items'][$i]['inscription'] == "##procedural##") {
                    if(($mapData['map']['items'][$i]['type'] == 32) || ($mapData['map']['items'][$i]['type'] == 33)) {
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
            if(isset($mapData['map']['items'][$i]['contains'])) {


                if(count($mapData['map']['items'][$i]['contains']) >0) {
// loop through items inside (eg. in a chest):
                     for($j=0;$j<count($mapData['map']['items'][$i]['contains']); $j++) {
if(isset($mapData['map']['items'][$i]['contains'][$j]['contains'])) {
                            if($mapData['map']['items'][$i]['contains'][$j]['contains'] == "##procedural##") {
                         if($mapData['map']['items'][$i]['contains'][$j]['type'] == 82) {

                        $mapData['map']['items'][$i]['contains'][$j]['contains'] = generateTreasureMap();
                    }

}
}
                     }
                } else {

                    if($mapData['map']['items'][$i]['contains'] == "##procedural##") {
                         if($mapData['map']['items'][$i]['type'] == 82) {

                        $mapData['map']['items'][$i]['contains'] = generateTreasureMap();
                    }
                }
            }
            }
        
    }

    for($i=0;$i<count($mapData['map']['npcs']); $i++) {
        $removeThisNPC = false;
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
        } else if($mapData['map']['npcs'][$i]['name'] == "##procedural##follower") {


// check if a follower NPC for this character has already been created within the last 24 hours:


$checkHiredFollowerQuery = mysqli_query($connection, "SELECT * from tblretinuefollowers where isHired='1' and characterIdFollowing='".$chr."' and generatedAtTime > DATE_SUB(NOW(), INTERVAL 24 HOUR)");
$numRows = mysqli_num_rows($checkHiredFollowerQuery);
if($numRows == 0) {

// generate new follower:
include_once($_SERVER['DOCUMENT_ROOT']."/game-world/generateRetinueFollower.php");
        
// make sure name is unique for this character:
do {
        $newFollower = generateFollower();
$checkFollowerQuery = mysqli_query($connection, "SELECT * from tblretinuefollowers where followerName='".$newFollower[0]."' and characterIdFollowing='".$chr."'");
$numRows = mysqli_num_rows($checkFollowerQuery);
} while ($numRows>0);

// add to database with chr and followerRewardFromQuestId so the journal knows which follower to display:
$followerName = $newFollower[0];
$followerCleanURL = cleanURL($followerName);
$characterIdFollowing = $chr;
$activeQuestId = -1;
$followerRewardFromQuestId = null;
$questStartedTime = null;
$generatedAtTime = date("Y-m-d H:i:s");
$followerSex = $newFollower[1];
$followerRace = $newFollower[2];
$currentContinent = $homeBaseContinent;
$followerMapCoordinateX = $homeBaseX;
$followerMapCoordinateY = $homeBaseY;

    $insertQuery = "INSERT INTO tblretinuefollowers (followerName, followerCleanURL, characterIdFollowing, activeQuestId, isEnabled, followerRewardFromQuestId, generatedAtTime, questStartedTime, followerSex, followerRace, currentContinent, followerMapCoordinateX, followerMapCoordinateY, isHired)
    VALUES ('".htmlentities($followerName)."','".$followerCleanURL."','".$characterIdFollowing."','".$activeQuestId."', '0', '".$followerRewardFromQuestId."','".$generatedAtTime."','".$questStartedTime."','".$followerSex."','".$followerRace."','".$currentContinent."','".$followerMapCoordinateX."','".$followerMapCoordinateY."',1)";
    $insertResult = mysqli_query($connection, $insertQuery);
// create image in /images/retinue folder:
    $followerImage = imagecreatefrompng('../images/retinue/source/'.cleanURL($followerRace).'-'.cleanURL($followerSex).'.png');
imagepng($followerImage, '../images/retinue/' . mysqli_insert_id($connection) . '.png', 0);
    imagedestroy($followerImage);



$mapData['map']['npcs'][$i]['name'] = $followerName;
$mapData['map']['npcs'][$i]['followerId'] = mysql_insert_id();


foreach ($mapData['map']['npcs'][$i]['speech'] as &$str) {
    $str = str_replace('##name##', $followerName, $str);
}

} else {

// use this one:
//    $followerResult = mysqli_query($connection,  $checkHiredFollowerQuery ) or die ( "couldn't execute follower query: ".$checkHiredFollowerQuery );


while ( $followerRow = mysqli_fetch_array( $checkHiredFollowerQuery ) ) {
extract( $followerRow );

if($isEnabled == '1') {
// don't show this NPC as they're already active:

    $removeThisNPC = true;
} else {
$mapData['map']['npcs'][$i]['name'] = $followerName;
$mapData['map']['npcs'][$i]['followerId'] = $followerID;
foreach ($mapData['map']['npcs'][$i]['speech'] as &$str) {
    $str = str_replace('##name##', $followerName, $str);
}
}




}


}





        }

        // check if speech is procedural:
        if($mapData['map']['npcs'][$i]['speech'] == "##procedural##poem##") {

include_once($_SERVER['DOCUMENT_ROOT']."/game-world/generatePoem.php");

$poemOutput = explode('####',createProceduralPoem());
$poemTextContent = array();
for($p=0;$p<count($poemOutput);$p++) {
    array_push($poemTextContent, [$poemOutput[$p], ""]);
    }

$mapData['map']['npcs'][$i]['speech'] = $poemTextContent;
         //  $mapData['map']['npcs'][$i]['speech'] =  array([createProceduralPoem(), ""]);
        }


if($removeThisNPC){
        unset($mapData['map']['npcs'][$i]);

}



    }

    for($i=0;$i<count($mapData['map']['shops']); $i++) {
        if($mapData['map']['shops'][$i]['uniqueItems'] == "##procedural##") {
            // get random items from database:
            include_once($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
            include_once($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");
            // get random items that aren't locked to events:
            $query = "select itemid from tblinventoryitems where activeduringseason is null and showinthecodex = 1 order by rand() limit 10";
$result = mysqli_query($connection,  $query ) or die ( "couldn't execute events query: ".$query );
        $numberofrows = mysqli_num_rows( $result );
        $itemIds = [];
    if ( $numberofrows>0 ) {
        while ( $row = mysqli_fetch_array( $result ) ) {
        $itemIds[$row['itemid']] = array(array());
           //array_push($itemIds, $row['itemid']);

        }
      
    }
mysqli_free_result($result);
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



$jsonOutput = '{"mapData":'.json_encode($mapData);







$allRecipes = array();
// get all recipes:
// (could be optimised just to get the ones that will be encountered ########)
$query = "SELECT tblrecipes.*, tblprofessions.*, tblcolours.colourName, tblinventoryitems.itemid as productId, tblinventoryitems.itemcategories as createditemcategories,
CASE WHEN tblrecipes.recipename IS NOT NULL THEN tblrecipes.recipename
 WHEN tblrecipes.defaultresultingcolour IS NOT NULL AND tblinventoryitems.hasInherentColour IS NOT NULL THEN CONCAT_WS(' ',tblcolours.colourname, tblinventoryitems.shortname)
  WHEN tblrecipes.recipename IS NULL THEN tblinventoryitems.shortname
 END as 'finalRecipeName',
 tblinventoryitems.description as recipeDescriptionFallback, tblinventoryitems.hasInherentColour as hasInherentColour FROM tblrecipes INNER JOIN tblprofessions on tblrecipes.profession = tblprofessions.professionid INNER JOIN tblinventoryitems on tblrecipes.creates = tblinventoryitems.itemid LEFT JOIN tblcolours on tblrecipes.defaultresultingcolour = tblcolours.colourid
order by tblprofessions.professionid, finalRecipeName ASC";
$result = mysqli_query($connection, $query) or die ("recipes failed");

while ($row = mysqli_fetch_array($result)) {
    extract($row);
$allRecipes[$recipeID] = array($finalRecipeName, $professionName);
}
mysqli_free_result($result);











// determine Shop data:


foreach ($mapData['map']['shops'] as &$thisShop) {

    $thisShop['hash'] = generateHash($thisShop['name']);
}

// {"chr": 999,"region":"Teldrassil","shops": [{"name":"shop #1","uniqueItems":[],"specialism":2,"categories":[1,2],"size":"small","currency":"money","hash":2067019224}]}

$thisMapsRegion = $mapData['map']['region'];
// get any Regional modifiers:
$modifiersQuery = "SELECT * from tblregionalpricemodifiers WHERE whichregion = '".$thisMapsRegion ."'";
$categoryModifier = array();
    $modifiersResult = mysqli_query($connection,  $modifiersQuery ) or die ( "couldn't execute query: ".$modifiersQuery );
$numberofrows = mysqli_num_rows( $modifiersResult );
    if ( $numberofrows>0 ) {
        while ( $modifierRow = mysqli_fetch_array( $modifiersResult ) ) {
            extract( $modifierRow );

            $categoryModifier[$itemCategory] = floatval($priceModifier);
        }
    }
mysqli_free_result($modifiersResult);

$shopAllItemIdsUsed = [];
$shopMarkupToOutput = '';

// get colours:
$coloursQuery = "SELECT * from tblcolours";
$allColours = [];
$colourResult = mysqli_query($connection, $coloursQuery) or die ("colours failed");
while ($colourRow = mysqli_fetch_array($colourResult)) {
    extract($colourRow);
    array_push($allColours, $colourName);
}
mysqli_free_result($colourResult);
// just use "primary" colours:
$colourIndicesToUse = [1,2,4,6,8,16];
 


// get active events:
$activeSeasonQuery = 'tblinventoryitems.activeduringseason is null';
if(count($activeEvents)>0) {
   $activeSeasonQuery = '(tblinventoryitems.activeduringseason in ('.implode(",",$activeEventsID).') or tblinventoryitems.activeduringseason is null)'; 
}


// generate shops:

for ($i=0;$i<count($mapData['map']['shops']);$i++) {


$inventoryData = [];
 
if(count($mapData['map']['shops'][$i]["categories"]) > 0) {

$query2 = "SELECT tblinventoryitems.* from tblinventoryitems where tblinventoryitems.itemcategories in (".implode(",",$mapData['map']['shops'][$i]["categories"]).") and tblinventoryitems.pricecode <= ".$shopSizePriceLimits[($mapData['map']['shops'][$i]["size"])]." and ".$activeSeasonQuery." and tblinventoryitems.showinthecodex = 1 order by tblinventoryitems.shortname ASC";
// Get colour variants as well for relevant items
 
$result2 = mysqli_query($connection, $query2) or die ("failed:".$query2);
 
while ($row = mysqli_fetch_array($result2, MYSQLI_ASSOC)) {
    array_push($inventoryData, $row);
}
mysqli_free_result($result2);
 
}



if($mapData['map']['shops'][$i]["uniqueItems"] == '##transcriptions##') {

// get the transcription files from this user's /data/music/ folder:


$transcriptionFolder = $_SERVER['DOCUMENT_ROOT'].'/data/chr'.$chr.'/music';
$transcribedSongs = scandir($transcriptionFolder);
// remove . and .. :
$transcribedSongs = array_diff(scandir($transcriptionFolder), array('.', '..'));
arsort($transcribedSongs);

$query3 = "SELECT tblinventoryitems.* from tblinventoryitems where tblinventoryitems.action = 'transcription' order by tblinventoryitems.shortname ASC limit 1";
$result3 = mysqli_query($connection, $query3) or die ("tblinventoryitems transcription failed:".$query3);
while ($row = mysqli_fetch_array($result3, MYSQLI_ASSOC)) {
$transcriptionBaseObject = $row;
}
mysqli_free_result($result3);




// generate objects:
 
    foreach ($transcribedSongs as $thisSong) {
        // exclude any mp3s:
 if(strpos($thisSong, ".json")) {
    $thisTranscriptionObject = $transcriptionBaseObject;

$thisSongContents = file_get_contents($transcriptionFolder."/".$thisSong);

  //  $thisTranscriptionObject['inscription'] = "{&quot;title&quot;:&quot;".$thisSong."&quot;,&quot;timeCreated&quot;:&quot;148905266553&quot;,&quot;content&quot;:[[0, &quot;c5-d&quot;],[807.69230769228, &quot;c5-cs&quot;]]}";
    $thisTranscriptionObject['inscription'] = htmlentities($thisSongContents);
    array_push($inventoryData, $thisTranscriptionObject);
}
 }
} else if($mapData['map']['shops'][$i]["uniqueItems"] == '##usergenerated##') {
   
   /*
$UGCQuery = "select * from tblplayergeneratedcontent where characterID='".$chr."' and isActive='1'";
$UGCResult = mysqli_query($connection, $UGCQuery) or die ("UGC failed:".$UGCQuery);
$baseItemTypes = array();
while ($UGCRow = mysqli_fetch_array($UGCResult, MYSQLI_ASSOC)) {
array_push($baseItemTypes, $UGCRow['itemType']);
}
mysqli_free_result($UGCResult);
*/
$query3 = "select tblinventoryitems.*, tblplayergeneratedcontent.itemID as UgcId, tblplayergeneratedcontent.itemTitle as UgcTitle from tblinventoryitems inner join tblplayergeneratedcontent on tblplayergeneratedcontent.itemType = tblinventoryitems.itemID where tblplayergeneratedcontent.isActive = '1' and tblplayergeneratedcontent.characterID='".$chr."'";



//$query3 = "SELECT tblinventoryitems.* from tblinventoryitems where tblinventoryitems.itemID in (".implode(',',$baseItemTypes).") order by tblinventoryitems.shortname ASC";
$result3 = mysqli_query($connection, $query3) or die ("tblinventoryitems failed:".$query3);
while ($row = mysqli_fetch_array($result3, MYSQLI_ASSOC)) {
   
// add contains for UGC content: #######
    // {"ugc-id":"2","ugc-title":"Titian's Venus"}

//$row['contains'] = "{'ugc-id':'".$row['UgcId']."','ugc-title':'".addslashes($row['UgcTitle'])."'}";


    array_push($inventoryData, $row);
    }
    mysqli_free_result($result3);

} else {
// get unique items:
 
if(count($mapData['map']['shops'][$i]["uniqueItems"])>0) {
     
   $itemIdsToGet =implode(",",array_keys($mapData['map']['shops'][$i]["uniqueItems"]));

$query3 = "SELECT tblinventoryitems.* from tblinventoryitems where tblinventoryitems.itemID in (".$itemIdsToGet.") order by tblinventoryitems.shortname ASC";
 
$result3 = mysqli_query($connection, $query3) or die ("tblinventoryitems 2 failed:".$query3);
while ($row = mysqli_fetch_array($result3, MYSQLI_ASSOC)) {
   
    // check if any of the unique data overides the defaults:
    $thisUniqueItem = $mapData['map']['shops'][$i]["uniqueItems"][$row["itemID"]];
    for ($j=0;$j<count($thisUniqueItem);$j++) {
foreach ($thisUniqueItem[$j] as $key => $value) {
 $row[$key] = $value;
}
array_push($inventoryData, $row);
 
    }
 
}
mysqli_free_result($result3);

}
 
 }
 
 
// check for items that need colour, add these to the list
// add a colourName attribute so that can be sorted rather than the numeric value
// then sort
 
 
/*
 echo "<pre><code>";
 var_dump($inventoryData);
 echo "</code></pre>";
 */
 

 
$itemIdsThatNeedColourVariants = [12,40,66];
$inventoryDataCount = count($inventoryData);
for ($j=0;$j<$inventoryDataCount;$j++) {
    $inventoryData[$j]['colourName'] = "";
    // check if this item needs colours (dyes, inks, seeds etc)
    if (in_array($inventoryData[$j]['itemID'], $itemIdsThatNeedColourVariants)) {
        $hasFoundAColourVariant = false;
        for ($k=0;$k<count($colourIndicesToUse);$k++) {
            // make sure that an equivilent named item doesn't exist: 
            $foundEquivilent = false;
            for ($l=0;$l<count($inventoryData);$l++) {
                if($l!=$j) {
                    if($inventoryData[$j]['itemGroup'] == $inventoryData[$l]['itemGroup']) {
                        if($inventoryData[$l]['colour'] == $colourIndicesToUse[$k]) {
                            $foundEquivilent = true;
                        }
                    }
                }
            }
            if(!$foundEquivilent) {
                $newColourItem = $inventoryData[$j];
                $newColourItem['colourName'] = $allColours[($colourIndicesToUse[$k])]." ";
                $newColourItem['colour'] = $colourIndicesToUse[$k];
                array_push($inventoryData, $newColourItem);
                $hasFoundAColourVariant = true;
            }
        }
        if($hasFoundAColourVariant) {
            unset($inventoryData[$j]);
        }
    } else {
        // see if its colour needs displaying:
        if(($inventoryData[$j]['colour'] != 0) && ($inventoryData[$j]['hasInherentColour'] == 0)) {
            $inventoryData[$j]['colourName'] = $allColours[$inventoryData[$j]['colour']]." ";
        }
    }
}
 
 
$inventoryDataToSort = array_values($inventoryData);
 
 
 
// sort by shortname and then colour:
// http://stackoverflow.com/questions/3232965/sort-multidimensional-array-by-multiple-keys/3233009#3233009
unset($shortname);
unset($colour);

foreach ($inventoryDataToSort as $sortkey => $sortrow) {
    $shortname[$sortkey]  = $sortrow['shortname'];
    $colour[$sortkey] = $sortrow['colourName'];
}
if(count($inventoryDataToSort) > 0) {
array_multisort($shortname, SORT_ASC, $colour, SORT_ASC, $inventoryDataToSort);

    $shopMarkupToOutput .= '<div class="shop" id="shop'.$mapData['map']['shops'][$i]["hash"].'" data-currency="'.$mapData['map']['shops'][$i]["currency"].'" data-specialism="'.$mapData['map']['shops'][$i]["specialism"].'">';
$shopMarkupToOutput .= '<div class="draggableBar">'.$mapData['map']['shops'][$i]["name"].'</div><button class="closePanel">close</button><ol>';


 }
 
$thisShopsSpecialism = $mapData['map']['shops'][$i]["specialism"];
 
 

for ($j=0;$j<count($inventoryDataToSort);$j++) {
    array_push($shopAllItemIdsUsed, $inventoryDataToSort[$j]['itemID']);
$shopMarkupToOutput .= '<li id="shopSlot'.$map.'-'.$i.'-'.$j.'">';
$colourSuffix = '';
if($inventoryDataToSort[$j]['colourName'] != '') {
    $colourSuffix = '-'.strtolower(trim($inventoryDataToSort[$j]['colourName']));
}
 
$thisItemsPrice = intval($inventoryDataToSort[$j]['priceCode']);

$specialPriceClass = '';
if($thisShopsSpecialism) {
// compare the specialism as a string:
    if(strrpos($inventoryDataToSort[$j]['itemCategories'], ''.$thisShopsSpecialism) !== false) {
    $thisItemsPrice = $thisItemsPrice*$sellPriceSpecialismModifier;
    $specialPriceClass = ' specialPrice';
   
     
}
} 


// check for regional price variation too
if(isset($categoryModifier[($inventoryDataToSort[$j]['itemCategories'])])) {

 $thisItemsPrice = $thisItemsPrice*$categoryModifier[($inventoryDataToSort[$j]['itemCategories'])];

    $specialPriceClass = ' specialPrice';
}


 
$thisItemsPrice = ceil($thisItemsPrice * $inflationModifier);
 
$imgDataAttributes = 'data-price="'.$thisItemsPrice.'"';
$imgDataAttributes .= ' data-colour="'.$inventoryDataToSort[$j]['colour'].'"';
$imgDataAttributes .= ' data-type="'.$inventoryDataToSort[$j]['itemID'].'"';
 
if(isset($inventoryDataToSort[$j]['contains'])) {
$imgDataAttributes .= ' data-contains="'.$inventoryDataToSort[$j]['contains'].'"';
}
if(isset($inventoryDataToSort[$j]['inscription'])) {
$imgDataAttributes .= ' data-inscription="'.$inventoryDataToSort[$j]['inscription'].'"';
}

if(isset($inventoryDataToSort[$j]['UgcId'])) {
$imgDataAttributes .= ' data-ugcid="'.$inventoryDataToSort[$j]['UgcId'].'"';
}

if(isset($inventoryDataToSort[$j]['UgcTitle'])) {
$imgDataAttributes .= ' data-ugctitle="'.addslashes($inventoryDataToSort[$j]['UgcTitle']).'"';
}
 

$imageFileSrc = '/images/game-world/inventory-items/'.$inventoryDataToSort[$j]['itemID'].$colourSuffix.'.png';
if(isset($inventoryDataToSort[$j]['UgcId'])) {
    // find path to UGC slot image:
//$imageFileSrc = '/images/user-generated/chr'.$chr.'/'.$inventoryDataToSort[$j]['UgcId'].'-slot.png';
$imageFileSrc = '/images/user-generated/'.$inventoryDataToSort[$j]['UgcId'].'-slot.png';
}

$shopMarkupToOutput .= '<img src= "'.$imageFileSrc.'" '.$imgDataAttributes.' alt="'.$inventoryDataToSort[$j]['colourName'].$inventoryDataToSort[$j]['shortname'].'">';

$thisShortName = $inventoryDataToSort[$j]['shortname'];
$thisDescription = $inventoryDataToSort[$j]['description'];

if($inventoryDataToSort[$j]['action'] == "recipe") {
 $thisShortName = $allRecipes[$inventoryDataToSort[$j]['contains']][0]." ".$thisShortName;
$thisDescription .= " (for the ".$allRecipes[$inventoryDataToSort[$j]['contains']][1]." profession).";


if (in_array($inventoryDataToSort[$j]['contains'], $recipesKnown)) {
    $thisDescription .= "(already known)";
}

}

// show inscription information here as well
$shopMarkupToOutput .= '<p><em>'.$inventoryDataToSort[$j]['colourName'].$thisShortName.'</em>';
if(isset($inventoryDataToSort[$j]['UgcTitle'])) {
$shopMarkupToOutput .= $inventoryDataToSort[$j]['UgcTitle'];
} else {

if($inventoryDataToSort[$j]['action'] == "transcription") {
    $thisInscriptionObject = json_decode(html_entity_decode($inventoryDataToSort[$j]['inscription']), true);
    
 $shopMarkupToOutput .= "&quot;" . $thisInscriptionObject['title'] . "&quot;";
} else {
    $shopMarkupToOutput .= $thisDescription;
}

    
}
$shopMarkupToOutput .= ' <span class="price'.$specialPriceClass.'">Buy price: '.parseMoney($thisItemsPrice, $mapData['map']['shops'][$i]["currency"]).'</span></p>';
$shopMarkupToOutput .= '</li>';
 
}
 
 if(count($inventoryDataToSort) > 0) {
$shopMarkupToOutput .= '</ol></div></div>';
}
 
}
 
 // allItemIds won't be needed when inventory items are added to this getMap script ##################
// output all IDs used so they can be loaded into the game's inventory data:
$shopAllItemIdsUsed = array_unique($shopAllItemIdsUsed);


if($debug) {
echo htmlentities($shopMarkupToOutput);
} else {

    
$jsonOutput .= ',"shops":{"markup": ["'.addcslashes($shopMarkupToOutput, '"\\/').'"],"allItemIds": ["'.implode("|",$shopAllItemIdsUsed).'"]}';
}

// end shops





$jsonOutput .= '}';
echo $jsonOutput;





?>