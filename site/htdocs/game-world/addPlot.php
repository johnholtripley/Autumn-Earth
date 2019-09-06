<?php

include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/functions.php");

$chr = $_GET["chr"];
$plotWidth = intval($_GET["width"]);
$plotHeight = intval($_GET["height"]);
$plotNorthWestX = intval($_GET["tileX"]);
$plotNorthWestY = intval($_GET["tileY"]);
$debug = false;
if(isset($_GET["debug"])) {
    $debug = true;
}



// ##########
// return json to add to local map (or whatever is added as a placeholder)



// determine map that this will be placed on, and create region name accordingly
$jsonMapResults = file_get_contents($_SERVER['DOCUMENT_ROOT'].'/data/world-map.json');
$mapJson = json_decode($jsonMapResults, true);
$worldMap = $mapJson['worldMap'];
$worldMapTileLength = 50;
$whichMapX = floor($plotNorthWestX / $worldMapTileLength);
$whichMapY = floor($plotNorthWestY / $worldMapTileLength);
$worldMapRequired = $worldMap[$whichMapY][$whichMapX];
$thisPlacementJsonMapResults = file_get_contents('../data/chr' .  $chr . '/map' . $worldMapRequired . '.json');
$thisPlacementMapJson = json_decode($thisPlacementJsonMapResults, true);




// get charcter's name:
$queryCharacter = 'select charName from tblcharacters where charID = "'.$chr.'"';
$resultCharacter = mysqli_query($connection, $queryCharacter) or die ("character check failed");
while ($row = mysqli_fetch_array($resultCharacter)) {
    extract($row);
}
mysqli_free_result($resultCharacter);



// create JSON files, based on width and height:
$externalJSONOutput = '{"map":{"isInside": false,';
$internalJSONOutput = '{"map":{"isInside": true, "region": "'.$thisPlacementMapJson['map']['region'].'", "zoneName": "'.$charName.'\'s plot",';
$baseJSONOutput = '';

$collisionsOutput = '';
$terrainOutput = '';
$propertiesOutput = '';

for($i=0;$i<$plotHeight;$i++) {
    if($i!=0) {
        $collisionsOutput .= ', ';
        $terrainOutput .= ', ';
        $propertiesOutput .= ', ';
    }
    $collisionsOutput .= "[";
    $terrainOutput .= "[";
    $propertiesOutput .= "[";
    for($j=0;$j<$plotWidth;$j++) {
        if($j!=0) {
            $collisionsOutput .= ', ';
            $terrainOutput .= ', ';
            $propertiesOutput .= ', ';
        }
        $collisionsOutput .= '0';
        $terrainOutput .= '"*"';
        $propertiesOutput .= '{}';
    }
    $collisionsOutput .= "]";
    $terrainOutput .= "]";
    $propertiesOutput .= "]";
}

$baseJSONOutput .= ' "collisions": ['.$collisionsOutput.'],';
$baseJSONOutput .= ' "terrain": ['.$terrainOutput.'],';
$baseJSONOutput .= ' "properties": ['.$propertiesOutput.'],';
$baseJSONOutput .= ' "graphics": [], "shops": [], "npcs": [], "doors": { }, "items": [], "hotspots": [""]}}';

$externalJSONOutput .= $baseJSONOutput;
$internalJSONOutput .= $baseJSONOutput;

$query = "insert into tblplayerhousing (characterID, northWestCornerTileX, northWestCornerTileY, southEastCornerTileX, southEastCornerTileY) values ('".$chr."','".$plotNorthWestX."','".$plotNorthWestY."','".($plotNorthWestX + $plotWidth)."','".($plotNorthWestY + $plotHeight)."')";

header('Content-Type: application/json');


if($debug) {
echo $externalJSONOutput;
//echo "<hr>";
//echo $internalJSONOutput;
//echo "<hr>";
//echo $query; 
} else {
    $savedirectory = '../data/chr'.$chr.'/housing/';
    if(!file_exists($savedirectory)) {
mkdir($savedirectory);
    }
    $saveHandle = fopen($savedirectory.'external.json', 'w');
fwrite($saveHandle, $externalJSONOutput);
fclose($saveHandle);
    $saveHandle = fopen($savedirectory.'floor0.json', 'w');
fwrite($saveHandle, $internalJSONOutput);
fclose($saveHandle);


    
// add to database:
$result = mysqli_query($connection, $query) or die ("couldn't execute insert");


}

?>