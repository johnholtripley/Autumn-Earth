<?php

include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");

header('Content-Type: application/json');




$chr = $_GET['chr'];

$outputJSON = '{';





$query = "SELECT * from tblcharacters where charID='".$chr."'";

   $result = mysqli_query($connection, $query);
if(mysqli_num_rows($result)>0) {
  while ($row = mysqli_fetch_array($result)) {
    extract($row);

$outputJSON .= '"currentMap": '.$currentMap.',';
$outputJSON .= '"tileX": '.$tileX.',';
$outputJSON .= '"tileY": '.$tileY.',';
$outputJSON .= '"bags": '.$bags.',';
$outputJSON .= '"inventory": '.$inventory.',';
$outputJSON .= '"cards": '.$cards.',';
$outputJSON .= '"stats": '.$stats.',';
$outputJSON .= '"settings": '.$settings.',';
$outputJSON .= '"titlesEarned": '.$titlesEarned.',';
$outputJSON .= '"activeTitle": '.$activeTitle.',';
$outputJSON .= '"professionsKnown": '.$professionsKnown.',';
$outputJSON .= '"recipesKnown": '.$recipesKnown.',';
$outputJSON .= '"plantCrossesKnown": '.$plantCrossesKnown.',';
$outputJSON .= '"totalGameTimePlayed": '.$totalGameTimePlayed.',';
$outputJSON .= '"fae": '.$fae.',';
$outputJSON .= '"activePets": '.$activePets.',';
$outputJSON .= '"allPets": '.$allPets.',';
$outputJSON .= '"currency": '.$currency.',';
$outputJSON .= '"npcsFollowing": '.$npcsFollowing.',';
$outputJSON .= '"lineOfSightRange": '.$lineOfSightRange.',';
$outputJSON .= '"retinueMapAreasRevealed": '.$retinueMapAreasRevealed.',';
$outputJSON .= '"collections": '.$collections.',';
$outputJSON .= '"actions": '.$actions;
$outputJSON .= '}';

  }
}

echo $outputJSON;

mysqli_free_result($result);
?>