<?php







// bezier curves:
// http://stackoverflow.com/questions/7054272/how-to-draw-smooth-curve-through-n-points-using-javascript-html5-canvas

/*

// move to the first point
   ctx.moveTo(points[0].x, points[0].y);


   for (i = 1; i < points.length - 2; i ++)
   {
      var xc = (points[i].x + points[i + 1].x) / 2;
      var yc = (points[i].y + points[i + 1].y) / 2;
      ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
   }
 // curve through the last two points
 ctx.quadraticCurveTo(points[i].x, points[i].y, points[i+1].x,points[i+1].y);


*/


$canvaDimension = 250;

// Create the main image
$mapCanvas = imagecreatetruecolor($canvaDimension, $canvaDimension);

// Fill the background
$ground = imagecolorallocate($mapCanvas, 253, 243, 178);

imagefilledrectangle($mapCanvas, 0, 0, $canvaDimension, $canvaDimension, $ground);


$lineColour  = imagecolorallocate($mapCanvas, 96, 35, 14);




// imageantialias($mapCanvas, true);



    $mapMaxWidth = 36;
    $mapMaxHeight = 36;
    
    
    $tileLineDimension = $canvaDimension/$mapMaxWidth;

      $dungeonArray = array();
       
        for ($i = 0;$i < $mapMaxWidth;$i++) {
            $dungeonArray[$i] = array();
             for ($j = 0;$j < $mapMaxHeight;$j++) {
                $dungeonArray[$i][$j] = "";
            
            }
            }



$xmlString="1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1||1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1||1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1||1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1||1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1||1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1||1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1||1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1||1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,116,116,119,120,120,1,1,1,1,1,1,1,1,1||1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,113,113,2,2,5,120,120,1,1,1,1,1,1,1,1||1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,111,2,2,6,2,2,119,1,1,1,1,1,1,1,1||1,1,1,1,1,1,1,1,1,1,1,1,1,116,117,119,1,1,1,1,1,109,2,2,2,2,2,116,1,1,1,1,1,1,1,1||1,1,1,1,1,1,1,1,1,1,1,1,1,112,2,119,120,120,120,118,112,109,2,2,2,2,115,116,1,1,1,1,1,1,1,1||1,1,1,1,1,1,1,1,1,1,1,1,1,111,7,2,2,2,2,2,2,2,2,2,2,113,114,1,1,1,1,1,1,1,1,1||1,1,1,1,1,1,1,1,1,1,1,1,1,110,107,106,106,2,2,2,2,100,100,2,2,115,1,1,1,1,1,1,1,1,1,1||120,120,120,120,120,120,119,1,117,117,119,119,115,111,109,107,106,2,7,2,2,2,2,2,115,116,1,1,1,1,1,1,1,1,1,1||2,2,2,2,2,2,119,118,117,2,2,2,2,2,2,2,2,2,2,2,7,2,2,2,116,1,1,1,1,1,1,1,1,1,1,1||2,2,2,2,2,2,6,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,115,116,1,1,1,1,1,1,1,1,1,1,1||2,5,2,2,2,2,2,2,2,2,2,2,2,2,2,3,2,2,4,2,2,2,2,117,1,1,1,1,1,1,1,1,1,1,1,1||100,100,100,100,100,100,2,2,2,2,107,105,103,100,100,100,100,100,100,2,2,2,114,117,118,1,1,1,1,1,1,1,1,1,1,1||1,1,1,1,1,100,100,100,103,105,108,1,1,1,1,1,1,1,100,100,7,2,2,2,119,1,1,1,1,1,1,1,1,1,1,1||1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,100,2,2,2,4,120,1,1,1,1,1,1,1,1,1,1,1||1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,100,2,6,2,2,120,120,1,1,1,116,116,119,120,120,1,1||1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,100,3,2,2,2,2,120,1,1,1,112,2,2,2,120,120,120||1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,100,100,100,5,2,2,120,120,1,1,109,2,2,2,2,2,2||1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,100,100,2,2,2,119,118,1,105,2,2,7,3,2,2||1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,100,2,3,3,2,115,111,109,2,2,2,2,2,2||1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,100,100,2,2,2,2,110,3,2,4,109,110,109,112||1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,100,100,2,7,2,2,2,2,2,112,1,1,1||1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,100,100,2,2,2,2,2,2,117,1,1,1||1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,100,100,2,2,2,2,2,116,1,1,1||1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,100,100,100,100,106,112,116,1,1,1||1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1||1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1||1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1||1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1";

$xmlRows = explode("||", $xmlString);

// code that created the xml:
for ($i = 0;$i < $mapMaxWidth;$i++) {
$thisRow = explode(",", $xmlRows[$i]);
for ($j = 0;$j < $mapMaxHeight;$j++) {
  
  $dungeonArray[$i][$j] = $thisRow[$j];
  
  }
}



$walkable = 10;
// loop through all tiles and check the right and bottom edges to see if they transition from walkable to non-walkable and if so, draw an edge







// loop through and check walkable tiles against neighbours. binary edges, set graphic number, then look for special cases (eg 3 x '8' in a row)










for ($i = 0;$i < ($mapMaxWidth);$i++) {

for ($j = 0;$j < ($mapMaxHeight);$j++) {


$thisTile = $dungeonArray[$i][$j]<=$walkable;



if($i==($mapMaxWidth-1)) {
// edge isn't walkable:
$thisTileRight = false;
} else {
$thisTileRight = $dungeonArray[$i+1][$j]<=$walkable;
// 1 is not walkable for random maps:
if($dungeonArray[$i+1][$j] == 1) {
$thisTileRight = false;
}
}

if($j==($mapMaxHeight-1)) {
// edge isn't walkable:
$thisTileBottom = false;
} else {
$thisTileBottom = $dungeonArray[$i][$j+1]<=$walkable;

if($dungeonArray[$i][$j+1] == 1) {
$thisTileBottom = false;
}
}



// 1 is not walkable for random maps:

if($dungeonArray[$i][$j] == 1) {
$thisTile = false;
}


$needsRightLine = false;
$needsBottomLine = false;

if($thisTile != $thisTileRight) {

$needsRightLine = true;

}
if($thisTile != $thisTileBottom) {

$needsBottomLine = true;

}


if($needsRightLine) {
// draw line to right:
imageline($mapCanvas, ($i+1)*$tileLineDimension, ($mapMaxHeight-$j)*$tileLineDimension, ($i+1)*$tileLineDimension, ($mapMaxHeight-($j+1))*$tileLineDimension, $lineColour);
}
if($needsBottomLine) {
// draw line to bottom:
imageline($mapCanvas, ($i)*$tileLineDimension, ($mapMaxHeight-($j+1))*$tileLineDimension, ($i+1)*$tileLineDimension, ($mapMaxHeight-($j+1))*$tileLineDimension, $lineColour);
}




}

}

 imagefilter($mapCanvas, IMG_FILTER_GAUSSIAN_BLUR);
 imagefilter($mapCanvas, IMG_FILTER_GAUSSIAN_BLUR);
 imagefilter($mapCanvas, IMG_FILTER_GAUSSIAN_BLUR);
 imagefilter($mapCanvas, IMG_FILTER_MEAN_REMOVAL);
 imagefilter($mapCanvas, IMG_FILTER_CONTRAST, -20);

$overlayTexture = imagecreatefrompng("temp-overlay.png");
imageAlphaBlending($overlayTexture, false);
imagecopy($mapCanvas, $overlayTexture, 0, 0, 0, 0, $canvaDimension, $canvaDimension);

// Output image to the browser
header('Content-type: image/png');

imagepng($mapCanvas);
imagedestroy($mapCanvas);




?>