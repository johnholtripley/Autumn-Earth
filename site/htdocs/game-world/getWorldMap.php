<?php

include($_SERVER['DOCUMENT_ROOT']."/includes/functions.php");
header('Content-Type: application/json');
$jsonMapResults = file_get_contents($_SERVER['DOCUMENT_ROOT'].'/data/world-map.json');
$mapJson = json_decode($jsonMapResults, true);
$worldMap = $mapJson['worldMap'];
$worldMapTileLength = 50;
if(isset($mapJson['globalPlatforms'])) {
    foreach ($mapJson['globalPlatforms'] as $map => $value) {
        $globalPosition = findWorldMapPosition($value['startMap']);
      //  $mapJson['globalPlatforms'][$map]['startX'] += $globalPosition[0] * $worldMapTileLength;
      //  $mapJson['globalPlatforms'][$map]['startY'] += $globalPosition[1] * $worldMapTileLength;
    // just do start and end doors
    }
    }
echo json_encode($mapJson);

?>