<?php





// need to find all coordinates
// path find to find linked coordinates
// check all coordinates have been pathed
// remove unrequired nodes so only corner nodes remain













// canvas size should be twice required size as it will be downsampled to anti alias:
$canvaDimension = 500;

// Create the main image
$mapCanvas = imagecreatetruecolor($canvaDimension, $canvaDimension);

//imageantialias($mapCanvas, true);

// Fill the background
$ground = imagecolorallocate($mapCanvas, 253, 243, 178);

imagefilledrectangle($mapCanvas, 0, 0, $canvaDimension, $canvaDimension, $ground);


$brush = imagecreate(100,100);

  $brushtrans = imagecolorallocate($brush, 0, 0, 0);
  imagecolortransparent($brush, $brushtrans);

  $color = imagecolorallocate($brush, 96, 35, 14);
    imagefilledellipse($brush, 15, 15, 5, 5, $color);
  

  imagesetbrush($mapCanvas, $brush);





function quadBezier($im, $x1, $y1, $x2, $y2, $x3, $y3) {
// php draw quad bezier:
// http://spottedsun.com/quadratic-bezier-curve-in-php/
    $b = $pre1 = $pre2 = $pre3 = 0;
    $prevx = 0;
    $prevy = 0;
    $d = sqrt(($x1 - $x2) * ($x1 - $x2) + ($y1 - $y2) * ($y1 - $y2)) +
        sqrt(($x2 - $x3) * ($x2 - $x3) + ($y2 - $y3) * ($y2 - $y3));
    $resolution = (1/$d) * 10;
    for ($a = 1; $a >0; $a-=$resolution) {
        $b=1-$a;
        $pre1=($a*$a);
        $pre2=2*$a*$b;
        $pre3=($b*$b);
        $x = $pre1*$x1 + $pre2*$x2  + $pre3*$x3;
        $y = $pre1*$y1 + $pre2*$y2 + $pre3*$y3;
        if ($prevx != 0 && $prevy != 0)
            imageline ($im, $x, $y, $prevx,$prevy, IMG_COLOR_BRUSHED);
        $prevx = $x;
        $prevy = $y;
    }
    imageline ($im, $prevx, $prevy, $x3, $y3, IMG_COLOR_BRUSHED);
}






















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











$points = array();

// $points = [[[start1x,start1y],[end1x,end1y]],[[start2x,start2y],[end2x,end2y]]];


for ($i = 0;$i < ($mapMaxWidth);$i++) {
  for ($j = 0;$j < ($mapMaxHeight);$j++) {
    $thisTile = $dungeonArray[$i][$j]<=$walkable;
        // 1 is not walkable for random maps:
    if($dungeonArray[$i][$j] == 1) {
    $thisTile = false;
    }
    
    if($i==0) {
      // edge isn't walkable:
      $thisTileLeft = false;
    } else {
      $thisTileLeft = $dungeonArray[$i-1][$j]<=$walkable;
      // 1 is not walkable for random maps:
      if($dungeonArray[$i-1][$j] == 1) {
        $thisTileLeft = false;
      }
    }
    
    
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
    
    if($j==0) {
      // edge isn't walkable:
      $thisTileTop = false;
    } else {
      $thisTileTop = $dungeonArray[$i][$j-1]<=$walkable;
      if($dungeonArray[$i][$j-1] == 1) {
        $thisTileTop = false;
      }
    }
    
    
    
    if($thisTileLeft != $thisTile) {
     // add left edge coordinates:
     array_push($points, array(
     array($i*$tileLineDimension, ($mapMaxHeight-$j)*$tileLineDimension),
     array($i*$tileLineDimension, ($mapMaxHeight-($j+1))*$tileLineDimension)
     ));
    }
    if($thisTileRight != $thisTile) {
     // add right edge coordinates:
     array_push($points, array(
     array(($i+1)*$tileLineDimension, ($mapMaxHeight-$j)*$tileLineDimension),
     array(($i+1)*$tileLineDimension, ($mapMaxHeight-($j+1))*$tileLineDimension)
     ));
    }
    if($thisTileBottom != $thisTile) {
     // add bottom edge coordinates:
     array_push($points, array(
     array($i*$tileLineDimension, ($mapMaxHeight-($j+1))*$tileLineDimension),
     array(($i+1)*$tileLineDimension, ($mapMaxHeight-($j+1))*$tileLineDimension)
     ));
    }
    if($thisTileTop != $thisTile) {
     // add top edge coordinates:
     array_push($points, array(
     array($i*$tileLineDimension, ($mapMaxHeight-$j)*$tileLineDimension),
     array(($i+1)*$tileLineDimension, ($mapMaxHeight-$j)*$tileLineDimension)
     ));
    }
    

  }
}




// ---------------------------------------------------
// find a path through points:
// find a start point that's on an edge:


for ($i = 0;$i < (count($points));$i++) {
  // check all sides to find a start point #####################
  if($points[$i][0][1] == 0) {
    $openList = array($points[$i][0][0]."_" . $points[$i][0][1]."-".$points[$i][1][0]."_" . $points[$i][1][1]);
    break;
  }
}

$closedList = array();

$stillWorking = true;
do {
        if (count($openList) > 0) {
            $thisEdge = array_pop($openList);
            // add to closed list:
            array_unshift($closedList, $thisEdge);
            
            // determine this edge's points:
                $edgePoints = explode("-", $thisEdge);
        //    $startPoints = explode("_",$edgePoints[0]);
        //    $endPoints = explode("_",$edgePoints[1]);
            
            // find another edge that has this edge's end point as it's start point:
            for ($i = 0;$i < (count($points));$i++) {
            if($points[$i][0][0]."_" . $points[$i][0][1] == $edgePoints[1]) {
            array_unshift($openList, $points[$i][0][0]."_" . $points[$i][0][1]."-".$points[$i][1][0]."_" . $points[$i][1][1]);
            break;
            }
            }
            
            
               } else {
        
            $stillWorking = false;
         
        }
            
           } while ($stillWorking);




$orderedPoints = array();
for ($i = 0;$i < (count($closedList));$i++) {
$edgePoints = explode("-", $closedList[$i]);
$startPoints = explode("_",$edgePoints[0]);
$endPoints = explode("_",$edgePoints[1]);
array_push($orderedPoints,array($startPoints[0],$startPoints[1]),array($endPoints[0],$endPoints[1]));
}


echo "<pre>".var_export($orderedPoints, true)."</pre>";


/*
$orderedPoints = array(
array(250,500),


array(250,350),
array(300,350),
array(300,300),
array(300,200),
array(250,200),
array(250,100)
);
*/


// bezier curves:
// http://stackoverflow.com/questions/7054272/how-to-draw-smooth-curve-through-n-points-using-javascript-html5-canvas

$previousX = $orderedPoints[0][0];
$previousY = $orderedPoints[0][1];
for ($i = 1; $i<count($orderedPoints)-2; $i++) {

  $controlX = ($orderedPoints[$i][0] + $orderedPoints[$i+1][0]) / 2;
  $controlY = ($orderedPoints[$i][1] + $orderedPoints[$i+1][1]) / 2;
quadBezier($mapCanvas, $previousX, $previousY, $orderedPoints[$i][0], $orderedPoints[$i][1], $controlX, $controlY);

$previousX = $controlX;
$previousY = $controlY;

}

quadBezier($mapCanvas, $previousX, $previousY,$orderedPoints[$i][0], $orderedPoints[$i][1], $orderedPoints[$i+1][0],$orderedPoints[$i+1][1]);

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

 imagefilter($mapCanvas, IMG_FILTER_GAUSSIAN_BLUR);
$imageResampled = imagecreatetruecolor($canvaDimension/2, $canvaDimension/2);

imagecopyresampled($imageResampled, $mapCanvas, 0, 0, 0, 0, $canvaDimension/2, $canvaDimension/2, $canvaDimension, $canvaDimension);

$overlayTexture = imagecreatefrompng("temp-overlay.png");
imageAlphaBlending($overlayTexture, false);
imagecopy($imageResampled, $overlayTexture, 0, 0, 0, 0, $canvaDimension, $canvaDimension);



/*
// Output image to the browser
header('Content-type: image/png');
imagepng($imageResampled);
*/



imagedestroy($mapCanvas);
imagedestroy($overlayTexture);
imagedestroy($imageResampled);
imagedestroy($brush);




?>