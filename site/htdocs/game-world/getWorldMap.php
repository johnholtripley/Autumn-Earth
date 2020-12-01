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
        if(isset($mapJson['globalPlatforms'][$map]['startDoors'])) {
            foreach ($mapJson['globalPlatforms'][$map]['startDoors'] as $innerKey => $innerValue) {
                $mapJson['globalPlatforms'][$map]['startDoors'][$innerKey]['startX'] += $globalPosition[0] * $worldMapTileLength;
                $mapJson['globalPlatforms'][$map]['startDoors'][$innerKey]['startY'] += $globalPosition[1] * $worldMapTileLength;
            }
        }
        $globalPosition = findWorldMapPosition($value['endMap']);
        if(isset($mapJson['globalPlatforms'][$map]['endDoors'])) {
            foreach ($mapJson['globalPlatforms'][$map]['endDoors'] as $innerKey => $innerValue) {
                $mapJson['globalPlatforms'][$map]['endDoors'][$innerKey]['startX'] += $globalPosition[0] * $worldMapTileLength;
                $mapJson['globalPlatforms'][$map]['endDoors'][$innerKey]['startY'] += $globalPosition[1] * $worldMapTileLength;
            }
        }
    }
}
echo json_encode($mapJson);

?>