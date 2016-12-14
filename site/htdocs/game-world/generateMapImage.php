<?php

$tileW = 48;
$tileH = $tileW/2;
$canvasWidth = 800;
$canvasHeight = 600;

$playerId=$_GET["playerId"];
$whichMap = $_GET["mapId"];

$useSepia = false;
if(isset($_GET["sepia"])) {
$useSepia = true;
}
// find iso coords for a tile
function getTileIsoCentreCoordX($tileX, $tileY) {
  global $tileW, $mapTilesY;
    return $tileW / 2 * ($mapTilesY - $tileY + $tileX);
}

function getTileIsoCentreCoordY($tileX, $tileY) {
  global $tileH;
    return $tileH / 2 * ($tileY + $tileX);
}


$rootFolder = '../images/game-world/maps/'.$whichMap.'/';

if($whichMap < 0) {
// dungeon map:
  $rootFolder = '../images/game-world/maps/dungeon/'.$_GET["dungeonName"]."/";
  $json = file_get_contents("../data/chr".$playerId."/dungeon/".$_GET["dungeonName"]."/".$whichMap.".json");
} else {
  $json = file_get_contents("../data/chr".$playerId."/map".$whichMap.".json");
}

if (is_numeric($playerId)) {
    if (is_numeric($whichMap)) {
 

  
  $bgImage = imagecreatefrompng($rootFolder."bg.png");
if($bgImage) {

$fullImage = imagecreatetruecolor(imagesx($bgImage), imagesy($bgImage));

imagecopy ( $fullImage, $bgImage, 0, 0, 0, 0, imagesx($bgImage), imagesy($bgImage) );

    

$jsonData = json_decode($json, true);

for ($i=0;$i<count($jsonData["map"]["graphics"]);$i++) {
  ${'assetImg'.$i} = imagecreatefrompng($rootFolder.$jsonData["map"]["graphics"][$i]["src"]);

}

   $map = $jsonData["map"]["terrain"];
        $mapTilesY = count($map);
        $mapTilesX = count($map[0]);
for ( $i = 0; $i < $mapTilesX; $i++) {
            for ( $j = 0; $j < $mapTilesY; $j++) {
                // the tile coordinates should be positioned by i,j but the way the map is drawn, the reference in the array is j,i
                // this makes the map array more readable when editing
         


                if (is_numeric($map[$j][$i])) {
 
                   $thisX = getTileIsoCentreCoordX($i, $j);
                    $thisY = getTileIsoCentreCoordY($i, $j);
                   $whichAsset = intval($map[$j][$i]);
                 
                     $thisGraphicCentreX = $jsonData["map"]["graphics"][$whichAsset]["centreX"];
                    $thisGraphicCentreY = $jsonData["map"]["graphics"][$whichAsset]["centreY"];
                   
// need to offset by half a tile to match starting hero position at tile centre:
                    imagecopy ( $fullImage, ${'assetImg'.$whichAsset}, floor($thisX - $thisGraphicCentreX + ($canvasWidth / 2)), floor($thisY - $thisGraphicCentreY + ($canvasHeight / 2) + $tileH/2), 0, 0, imagesx(${'assetImg'.$whichAsset}), imagesy(${'assetImg'.$whichAsset}) );
                  }
                }
              }


if($useSepia) {
  // http://www.phpied.com/image-fun-with-php-part-2/
  imagefilter($fullImage, IMG_FILTER_GRAYSCALE);
imagefilter($fullImage, IMG_FILTER_COLORIZE, 100, 50, 0);
}


header('Content-Type: image/jpeg');
imagejpeg($fullImage, NULL, 90);

imagedestroy($bgImage);
imagedestroy($fullImage);
for ($i=0;$i<count($jsonData["map"]["graphics"]);$i++) {
imagedestroy(${'assetImg'.$i});
  }
}
}
}






?>