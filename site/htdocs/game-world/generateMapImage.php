<?php

// http://develop.ae/game-world/generateMapImage.php?playerId=999&sepia=true&tileX=34&tileY=22&radius=12&scale=0.3&overlay=true


// check file already exists and redirect if it does

include_once($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include_once($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");

$tileW = 48;
$tileH = $tileW/2;
$canvasWidth = 2400;
$canvasHeight = 1200;
$worldMapTileLength = 50;

$imagePadding = 500;

$playerId=$_GET["playerId"];



function findMapNumberFromGlobalCoordinates($tileX, $tileY) {
  global $worldMap, $worldMapTileLength;
return $worldMap[floor($tileY/$worldMapTileLength)][floor($tileX/$worldMapTileLength)];
}


$requiredTileX = $_GET["tileX"];
$requiredTileY = $_GET["tileY"];


if(isset($_GET["mapId"])) {
$whichMap = $_GET["mapId"];
} else {
  // must be global coordinates passed in, so determine which map it relates to:
  $jsonMapResults = file_get_contents($_SERVER['DOCUMENT_ROOT'].'/data/world-map.json');
  $mapJson = json_decode($jsonMapResults, true);
  $worldMap = $mapJson['worldMap'];
  $worldMapTileLength = 50;
  $whichMap = findMapNumberFromGlobalCoordinates($requiredTileX,$requiredTileY);

$globalRequiredTileX = $requiredTileX;
$globalRequiredTileY = $requiredTileY;

// convert to local coordinates:
$requiredTileX = $requiredTileX%$worldMapTileLength;
$requiredTileY = $requiredTileY%$worldMapTileLength;

}


$eastEdgeTile = $globalRequiredTileX + $_GET["radius"];
$westEdgeTile = $globalRequiredTileX - $_GET["radius"];
$NorthEdgeTile = $globalRequiredTileY - $_GET["radius"]; 
$SouthEdgeTile = $globalRequiredTileY + $_GET["radius"]; 



$filePathToSave = "../data/chr".$playerId."/treasure-maps/".$whichMap."_".$requiredTileX."_".$requiredTileY.".jpg";

$debug = false;
if(isset($_GET["debug"])) {
  $debug = true;
  }


 if ((is_file($filePathToSave)) && !$debug) {
        header("Location: /" . $filePathToSave);
        die();
    }



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
$jsonData = json_decode($json, true);

$allItemTypesRequired = [];
for ($i=0;$i<count($jsonData["map"]["items"]);$i++) {
array_push($allItemTypesRequired, $jsonData["map"]["items"][$i]['type']);
}

$allItemTypesRequired = array_unique($allItemTypesRequired);



//var_dump($allItemTypesRequired);



$inventoryData = [];
//if(count($jsonData["map"]["items"])>0) {
//$query2 = "SELECT tblinventoryitems.* from tblinventoryitems where tblinventoryitems.itemID in (".implode(",",$allItemTypesRequired).") ";

// load in ALL inventory item data, so that any items in Player Housing are also available:
$query2 = "SELECT tblinventoryitems.* from tblinventoryitems";
$result2 = mysqli_query($connection, $query2) or die ("failed:".$query2);
 
while ($row = mysqli_fetch_array($result2, MYSQLI_ASSOC)) {
   // array_push($inventoryData, $row);
  $inventoryData[$row["itemID"]] = [];
  $inventoryData[$row["itemID"]]["centreX"] = $row["centreX"];
  $inventoryData[$row["itemID"]]["centreY"] = $row["centreY"];
  $inventoryData[$row["itemID"]]["cleanURL"] = $row["cleanURL"];
  $inventoryData[$row["itemID"]]["action"] = $row["action"];
}
mysqli_free_result($result2);
//}



   $map = $jsonData["map"]["terrain"];
      $mapTilesY = count($map);
      $mapTilesX = count($map[0]);






      $bgImage = imagecreatefrompng("../images/game-world/backgrounds/".$whichMap.".png");
      if($bgImage) {

$canvasSizeX = imagesx($bgImage)+($imagePadding*2);
$canvasSizeY = imagesy($bgImage)+($imagePadding*2);

      $fullImage = imagecreatetruecolor($canvasSizeX, $canvasSizeY);







// draw the sea underneath:
      $seaImage = imagecreatefromjpeg("../images/cartography/ocean.jpg");
      $seaImageWidth = imagesx($seaImage);
      $seaImageHeight = imagesy($seaImage);
      for($i=0;$i<$canvasSizeX;$i+=$seaImageWidth) {
      for($j=0;$j<$canvasSizeY;$j+=$seaImageHeight) {
imagecopy ( $fullImage, $seaImage, $i, $j, 0, 0, $seaImageWidth, $seaImageHeight );
}
}

// add ornaments to the sea:
// make these sensibly but randomly placed ###########
$ornamentImage = imagecreatefrompng("../images/cartography/ornaments/ship.png");
imagecopy ( $fullImage, $ornamentImage, 290, 60, 0, 0, imagesx($ornamentImage), imagesy($ornamentImage) );

$ornamentImage2 = imagecreatefrompng("../images/cartography/ornaments/unicorn.png");
imagecopy ( $fullImage, $ornamentImage2, 290, 860, 0, 0, imagesx($ornamentImage2), imagesy($ornamentImage2) );



      imagecopy ( $fullImage, $bgImage, $imagePadding, $imagePadding, 0, 0, $canvasSizeX, $canvasSizeY );
      $pencilSketchTile = imagecreatefromjpeg("../images/cartography/tile-sketch.jpg");
      
      for ($i=0;$i<count($jsonData["map"]["graphics"]);$i++) {
        ${'assetImg'.$i} = imagecreatefrompng("../images/game-world/terrain/".$jsonData["map"]["graphics"][$i]["src"]);
      }




$allAssetsToDraw = [];


// needs proper depth sorting with items and terrain:
  for ( $i = 0; $i < $mapTilesX; $i++) {
        for ( $j = 0; $j < $mapTilesY; $j++) {
        // the tile coordinates should be positioned by i,j but the way the map is drawn, the reference in the array is j,i
        // this makes the map array more readable when editing
          if (is_numeric($map[$j][$i])) {

            $thisX = getTileIsoCentreCoordX($i, $j) + $imagePadding;
            $thisY = getTileIsoCentreCoordY($i, $j) + $imagePadding;
         //  echo $i.",".$j." = ".$thisX.",".$thisY."<br>";
            $whichAsset = intval($map[$j][$i]);
            $thisGraphicCentreX = $jsonData["map"]["graphics"][$whichAsset]["centreX"];
            $thisGraphicCentreY = $jsonData["map"]["graphics"][$whichAsset]["centreY"];
            


          //  imagecopy ( $fullImage, ${'assetImg'.$whichAsset}, floor($thisX - $thisGraphicCentreX), floor($thisY - $thisGraphicCentreY  + $tileH/2), 0, 0, imagesx(${'assetImg'.$whichAsset}), imagesy(${'assetImg'.$whichAsset}) );


array_push($allAssetsToDraw, array(${'assetImg'.$whichAsset}, floor($thisX - $thisGraphicCentreX), floor($thisY - $thisGraphicCentreY  + $tileH/2), 0, 0, imagesx(${'assetImg'.$whichAsset}), imagesy(${'assetImg'.$whichAsset})));


          }
        }
      }






      for ($i=0;$i<count($jsonData["map"]["items"]);$i++) {

        $thisItem = $jsonData["map"]["items"][$i];
        $thisItemURL = $inventoryData[$thisItem["type"]]["cleanURL"];
        ${'itemImg'.$i} = imagecreatefrompng("../images/game-world/items/".$thisItemURL.".png");
        $thisX = getTileIsoCentreCoordX($thisItem['tileX'], $thisItem['tileY']) + $imagePadding;
        $thisY = getTileIsoCentreCoordY($thisItem['tileX'], $thisItem['tileY']) + $imagePadding;
        $thisGraphicCentreX = intval($inventoryData[$thisItem["type"]]["centreX"]);
        $thisGraphicCentreY = intval($inventoryData[$thisItem["type"]]["centreY"]);
  //      imagecopy ( $fullImage, ${'itemImg'.$i}, floor($thisX - $thisGraphicCentreX), floor($thisY - $thisGraphicCentreY), 0, 0, imagesx(${'itemImg'.$i}), imagesy(${'itemImg'.$i}) );

array_push($allAssetsToDraw, array(${'itemImg'.$i}, floor($thisX - $thisGraphicCentreX), floor($thisY - $thisGraphicCentreY), 0, 0, imagesx(${'itemImg'.$i}), imagesy(${'itemImg'.$i})));


      }



// get any player housing:

      $playerHousingTerrainAssets = [];





$housingQuery = "SELECT * from tblplayerhousing where northWestCornerTileY <= ".$SouthEdgeTile." and southEastCornerTileY >= ".$NorthEdgeTile." and northWestCornerTileX <= ".$eastEdgeTile." and southEastCornerTileX >= ".$westEdgeTile;

$housingResult = mysqli_query($connection,  $housingQuery ) or die ( "couldn't execute events query: ".$housingQuery );
$numberOfHouses = mysqli_num_rows( $housingResult );

if ( $numberOfHouses>0) {
    while ( $housingRow = mysqli_fetch_array( $housingResult ) ) {

  extract($housingRow);
  // load in external housing
  $housingFile = file_get_contents('../data/chr'.$characterID.'/housing/external.json');
  $housingData = json_decode($housingFile, true);
  $thisHouseWidth = count($housingData['map']['terrain'][0]);
  $thisHouseLength = count($housingData['map']['terrain']);

// get all terrain images for this:
   for ($i=0;$i<count($housingData["map"]["graphics"]);$i++) {
        ${'assetImg'.$characterID."_".$i} = imagecreatefrompng("../images/game-world/terrain/".$housingData["map"]["graphics"][$i]["src"]);
        array_push($playerHousingTerrainAssets, 'assetImg'.$characterID."_".$i);
      }
      

      // get all item images for this:
   for ($i=0;$i<count($housingData["map"]["items"]);$i++) {

        $thisItem = $housingData["map"]["items"][$i];
        $thisItemURL = $inventoryData[$thisItem["type"]]["cleanURL"];
        ${'itemImg'.$characterID."_".$i} = imagecreatefrompng("../images/game-world/items/".$thisItemURL.".png");

$thisLocalHousingTileY = $thisItem['tileY'] + $northWestCornerTileY;
$thisLocalHousingTileX = $thisItem['tileX'] + $northWestCornerTileX;

        $thisX = getTileIsoCentreCoordX($thisLocalHousingTileX, $thisLocalHousingTileY) + $imagePadding;
        $thisY = getTileIsoCentreCoordY($thisLocalHousingTileX, $thisLocalHousingTileY) + $imagePadding;
        $thisGraphicCentreX = intval($inventoryData[$thisItem["type"]]["centreX"]);
        $thisGraphicCentreY = intval($inventoryData[$thisItem["type"]]["centreY"]);
  //      imagecopy ( $fullImage, ${'itemImg'.$i}, floor($thisX - $thisGraphicCentreX), floor($thisY - $thisGraphicCentreY), 0, 0, imagesx(${'itemImg'.$i}), imagesy(${'itemImg'.$i}) );

array_push($allAssetsToDraw, array(${'itemImg'.$characterID."_".$i}, floor($thisX - $thisGraphicCentreX), floor($thisY - $thisGraphicCentreY), 0, 0, imagesx(${'itemImg'.$characterID."_".$i}), imagesy(${'itemImg'.$characterID."_".$i})));
array_push($playerHousingTerrainAssets, 'itemImg'.$characterID."_".$i);


      }




for ($i=0;$i<$thisHouseWidth;$i++) {
    for ($j=0;$j<$thisHouseLength;$j++) {
$thisLocalHousingTileY = $j + $northWestCornerTileY;
$thisLocalHousingTileX = $i + $northWestCornerTileX;
  if (is_numeric($housingData['map']['terrain'][$j][$i])) {
            $thisX = getTileIsoCentreCoordX($thisLocalHousingTileX, $thisLocalHousingTileY) + $imagePadding;
            $thisY = getTileIsoCentreCoordY($thisLocalHousingTileX, $thisLocalHousingTileY) + $imagePadding;
            $whichAsset = intval($housingData['map']['terrain'][$j][$i]);
            $thisGraphicCentreX = $housingData["map"]["graphics"][$whichAsset]["centreX"];
            $thisGraphicCentreY = $housingData["map"]["graphics"][$whichAsset]["centreY"];
array_push($allAssetsToDraw, array(${'assetImg'.$characterID."_".$whichAsset}, floor($thisX - $thisGraphicCentreX), floor($thisY - $thisGraphicCentreY  + $tileH/2), 0, 0, imagesx(${'assetImg'.$characterID."_".$whichAsset}), imagesy(${'assetImg'.$characterID."_".$whichAsset})));


          }



    }
  }


      }
    }
mysqli_free_result($housingResult);
   
    
// sort by the Y position (depth sorting could be improved #########)

function sortByYPos($a, $b) {
  // depth is at index 2:
    if ($a[2] == $b[2]) {
        return 0;
    }
    return ($a[2] < $b[2]) ? -1 : 1;
}

usort($allAssetsToDraw,"sortByYPos");

for ($i=0;$i<count($allAssetsToDraw);$i++) {
  imagecopy($fullImage,$allAssetsToDraw[$i][0],$allAssetsToDraw[$i][1],$allAssetsToDraw[$i][2],$allAssetsToDraw[$i][3],$allAssetsToDraw[$i][4],$allAssetsToDraw[$i][5],$allAssetsToDraw[$i][6]);
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
        $scaledPadding = $imagePadding;
        if(isset($_GET["scale"])) {
        $scaledSize = $cropSize * $_GET["scale"];
        $scaledPadding = $imagePadding * $_GET["scale"];
        }
   
        $croppedImage = imagecreatetruecolor($scaledSize, $scaledSize);

        $sourceX = getTileIsoCentreCoordX($requiredTileX,$requiredTileY)-$cropSize/2;
        $sourceY = getTileIsoCentreCoordY($requiredTileX,$requiredTileY)-$cropSize/2;
if(isset($_GET["scale"])) {

   imagecopyresampled($croppedImage,$fullImage,0,0,$sourceX+$imagePadding,$sourceY+$imagePadding,$scaledSize,$scaledSize,$cropSize,$cropSize);
} else {
  imagecopy($croppedImage,$fullImage,0,0,$sourceX,$sourceY,$cropSize,$cropSize);
}
        
      }

$ifRequiresOverlay = false;
if(isset($_GET["overlay"])) {
$ifRequiresOverlay = true;
}
if($ifRequiresOverlay) {
  $overlayImage = imagecreatefrompng("../images/cartography/map-overlay.png");
  imagealphablending($overlayImage, false);
  imagesavealpha($croppedImage, true);
  imagecopyresampled($croppedImage,$overlayImage,0,0,0,0,$scaledSize,$scaledSize,imagesx($overlayImage),imagesy($overlayImage));
}



    

 // if($debug){
      header('Content-Type: image/jpeg');
   // }
       if(isset($_GET["radius"])) {


        if(!$debug){
 imagejpeg($croppedImage, $filePathToSave, 90);
      }
      imagejpeg($croppedImage, NULL, 90);
        imagedestroy($croppedImage);
      } else {
        if(!$debug){
        
    
        imagejpeg($fullImage, $filePathToSave, 90);
      }
      imagejpeg($fullImage, NULL, 90);
      }

      imagedestroy($bgImage);
      imagedestroy($ornamentImage);
      imagedestroy($seaImage);
      imagedestroy($fullImage);
      imagedestroy($pencilSketchTile);
      if($ifRequiresOverlay) {
        imagedestroy($overlayImage);
      }

      for ($i=0;$i<count($jsonData["map"]["graphics"]);$i++) {
        imagedestroy(${'assetImg'.$i});
      }
      for ($i=0;$i<count($jsonData["map"]["items"]);$i++) {
        imagedestroy(${'itemImg'.$i});
      }

      for ($i=0;$i<count($playerHousingTerrainAssets);$i++) {
        imagedestroy(${$playerHousingTerrainAssets[$i]});
      }



      }
  }
}






?>