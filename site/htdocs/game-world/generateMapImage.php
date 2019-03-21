<?php

// http://develop.ae/game-world/generateMapImage.php?mapId=10&playerId=999&sepia=true&tileX=25&tileY=12&radius=6&scale=0.5

$tileW = 48;
$tileH = $tileW/2;
$canvasWidth = 2400;
$canvasHeight = 1200;

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


//$rootFolder = '../images/game-world/maps/'.$whichMap.'/';

if($whichMap < 0) {
// dungeon map:
 // $rootFolder = '../images/game-world/maps/dungeon/'.$_GET["dungeonName"]."/";
  $json = file_get_contents("../data/chr".$playerId."/dungeon/".$_GET["dungeonName"]."/".$whichMap.".json");
} else {
  $json = file_get_contents("../data/chr".$playerId."/map".$whichMap.".json");
}

if (is_numeric($playerId)) {
    if (is_numeric($whichMap)) { 
      $bgImage = imagecreatefrompng("../images/game-world/backgrounds/".$whichMap.".png");
      if($bgImage) {
      $fullImage = imagecreatetruecolor(imagesx($bgImage), imagesy($bgImage));
      imagecopy ( $fullImage, $bgImage, 0, 0, 0, 0, imagesx($bgImage), imagesy($bgImage) );
      $pencilSketchTile = imagecreatefromjpeg("../images/cartography/tile-sketch.jpg");
      $jsonData = json_decode($json, true);
      for ($i=0;$i<count($jsonData["map"]["graphics"]);$i++) {
        ${'assetImg'.$i} = imagecreatefrompng("../images/game-world/terrain/".$jsonData["map"]["graphics"][$i]["src"]);
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
            imagecopy ( $fullImage, ${'assetImg'.$whichAsset}, floor($thisX - $thisGraphicCentreX), floor($thisY - $thisGraphicCentreY  + $tileH/2), 0, 0, imagesx(${'assetImg'.$whichAsset}), imagesy(${'assetImg'.$whichAsset}) );
          }
        }
      }


      if($useSepia) {
        // http://www.phpied.com/image-fun-with-php-part-2/
        // imagefilter($fullImage, IMG_FILTER_EDGEDETECT);
        //imagefilter($fullImage, IMG_FILTER_NEGATE);
        imagefilter($fullImage, IMG_FILTER_GRAYSCALE);
        imagefilter($fullImage, IMG_FILTER_COLORIZE, 108, 77, 14);
        imagefilter($fullImage, IMG_FILTER_CONTRAST, -40);
        imagelayereffect($fullImage, IMG_EFFECT_OVERLAY);
        imagesettile($fullImage, $pencilSketchTile);
        imagefilledrectangle($fullImage, 0, 0, imagesx($bgImage), imagesy($bgImage), IMG_COLOR_TILED);
      }

      if(isset($_GET["radius"])) {
             // crop the image
        $cropSize = $_GET["radius"] * $tileW;
        $scaledSize = $cropSize;
        if(isset($_GET["scale"])) {
        $scaledSize = $cropSize * $_GET["scale"];
        }
   
        $croppedImage = imagecreatetruecolor($scaledSize, $scaledSize);
        $sourceX = 1500;
        $sourceY = 700;
        $sourceX = getTileIsoCentreCoordX($_GET["tileX"],$_GET["tileY"])-$cropSize/2;
        $sourceY = getTileIsoCentreCoordY($_GET["tileX"],$_GET["tileY"])-$cropSize/2;
if(isset($_GET["scale"])) {
   imagecopyresampled($croppedImage,$fullImage,0,0,$sourceX,$sourceY,$scaledSize,$scaledSize,$cropSize,$cropSize);
} else {
  imagecopy($croppedImage,$fullImage,0,0,$sourceX,$sourceY,$cropSize,$cropSize);
}
        
      }


      header('Content-Type: image/jpeg');
       if(isset($_GET["radius"])) {
        imagejpeg($croppedImage, NULL, 90);
        imagedestroy($croppedImage);
      } else {
        imagejpeg($fullImage, NULL, 90);
      }

      imagedestroy($bgImage);
      imagedestroy($fullImage);
      imagedestroy($pencilSketchTile);

      for ($i=0;$i<count($jsonData["map"]["graphics"]);$i++) {
        imagedestroy(${'assetImg'.$i});
      }
      }
  }
}






?>