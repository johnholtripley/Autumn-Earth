<?php



$thisPlayersId = $_GET["playerId"];

$thisDungeonsName = $_GET["dungeonName"];


$dir = "data/chr" . $thisPlayersId . "/dungeon/".$thisDungeonsName;
// check directory exists and create it if not:
 if (!(is_dir($dir))) {
 mkdir($dir, 0777);
 }


       ?>
        <!doctype html>
<html lang="en-gb">
<head>
<style>

body {
background: #fdf4b3;
}

img {
display: block;
float: left;
}

</style>
<title>Map Overview</title>
        </head>
        <body>
        <?php
 // http://www.autumnearth.com/generateDungeonMap.php?playerId=1002&originatingMapId=-1&requestedMap=-2&dungeonName=the-barrow-mines&outputMode=test&connectingDoorX=18&connectingDoorY=35
        
                $originatingMapId = -1;
        $mapRequired = -2;
        $connectingDoorX=18;
        $connectingDoorY=35;

         
        
        
$_GET['playerId'] = $thisPlayersId;
$_GET['originatingMapId'] = $originatingMapId;
$_GET['requestedMap'] = $mapRequired;
$_GET['dungeonName'] = $thisDungeonsName;
$_GET['connectingDoorX'] = $connectingDoorX;
$_GET['connectingDoorY'] = $connectingDoorY;
$_GET['outputMode'] = 'none';
// don't include it each loop, just call the functions needed that are within the code after it's been included once
include('generateDungeonMap.php');
createNewDungeonMap($thisMapsId);
echo'<img src="http://www.autumnearth.com/generateCartographicMap.php?playerId='.$thisPlayersId.'&dungeonName='.$thisDungeonsName.'&requestedMap='.$mapRequired.'&overlay=false">';
        
        
           for ($i = ($mapRequired-1);$i >=-10;$i--) {

        $thisOriginatingMapId = ($i+1);
       createNewDungeonMap($i);
        
        
     echo'<img src="http://www.autumnearth.com/generateCartographicMap.php?playerId='.$thisPlayersId.'&dungeonName='.$thisDungeonsName.'&requestedMap='.$i.'&overlay=false">';
       
       }
       ?>
       </body>
       </html>