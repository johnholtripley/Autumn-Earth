<?php

$debug = false;




// need to find all coordinates
// path find to find linked coordinates
// check all coordinates have been pathed
// remove unrequired nodes so only corner nodes remain





// start points and end points aren't the same way - depends which way the path finder is running. either need to store edges in a different way, or need to check the edge is not itself (or one already checked) and look at either start or end point to find a match ...but need to know current direction?







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
    imagefilledellipse($brush, 50, 50, 2, 2, $color);
  

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
    
    
    $tileLineDimension = floor($canvaDimension/$mapMaxWidth);

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











$edges = array();





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
    // to avoid duplicate edges, don't check to see if the adjoining tiles are different, only draw an edge where current tile is walkable and neighbour is not:
    if($thisTile) {
    
    

    
    
      if(!$thisTileLeft) {
       // add left edge coordinates:
       array_push($edges, $i*$tileLineDimension.",".(($mapMaxHeight-$j)*$tileLineDimension)."|".$i*$tileLineDimension.",".($mapMaxHeight-($j+1))*$tileLineDimension);
       

       
       

       
       
      }
      if(!$thisTileRight) {
       // add right edge coordinates:
    
       
        array_push($edges, ($i+1)*$tileLineDimension.",".(($mapMaxHeight-$j)*$tileLineDimension)."|".($i+1)*$tileLineDimension.",".($mapMaxHeight-($j+1))*$tileLineDimension);
       

       
       
      }
      if(!$thisTileBottom) {
       // add bottom edge coordinates:
  
       
       array_push($edges, $i*$tileLineDimension.",".(($mapMaxHeight-($j+1))*$tileLineDimension)."|".($i+1)*$tileLineDimension.",".($mapMaxHeight-($j+1))*$tileLineDimension);
       

       
       
      }
      if(!$thisTileTop) {
       // add top edge coordinates:
    
       
    array_push($edges, $i*$tileLineDimension.",".(($mapMaxHeight-$j)*$tileLineDimension)."|".($i+1)*$tileLineDimension.",".($mapMaxHeight-$j)*$tileLineDimension);
       

       
       
      }
    }

    

  }
}



// ---------------------------------------------------
// find a path through points:
// find a start point that's on an edge:
$orderedPoints = array();
$orderedDirections = array();
$usedEdges = array();
for ($i = 0;$i < (count($edges));$i++) {
  // check all sides to find a start point #####################
  
  $points = explode("|", $edges[$i]);
  
 
  
  $startPoint = explode(",", $points[0]);
  $endPoint = explode(",", $points[1]);
  
  if($debug) {
 // echo $startPoint[1].",".$canvaDimension."<br>";
  }
  
 
  
   // ################################
  //if($startPoint[1] == $canvaDimension) {
 if($startPoint[1] == 468) {
 // ################################
 
 
 
  // on bottom edge
     array_push($orderedPoints,array($startPoint[0],$startPoint[1]));
      array_push($usedEdges,$edges[$i]);
    $direction = "north";
    array_push($orderedDirections,$direction);
    break;
  }
  
  
  

  
  
  
}








// get target end point - this is the new start point
// from $direction, determine the 3 possible end point.
// look for the edge that has this start and any of the 3 ends, in either order.
// if found, update direction, and get this end point
// keep track of used edges so don't re-use ####



$stillWorking = true;

do {

// get target end point - this is the new start point:
$thisEdgesStartPoint = $endPoint;


// from $direction, determine the 3 possible end points:
$possibleEdges = array();


// array_push($edges, $i*$tileLineDimension.",".($mapMaxHeight-$j)*$tileLineDimension)."|".($i+1)*$tileLineDimension.",".($mapMaxHeight-$j)*$tileLineDimension);

if(($direction=="north") || ($direction=="east") || ($direction=="west")) {
// add 'north' point:
// array_push($possibleEdges,array(($thisEdgesStartPoint[0]),($thisEdgesStartPoint[1])-1));
 
 
 array_push($possibleEdges,$thisEdgesStartPoint[0].",".$thisEdgesStartPoint[1]."|".($thisEdgesStartPoint[0]).",".(($thisEdgesStartPoint[1])-$tileLineDimension));
 // and add the edge in reverse in case the path finding is travelling in a different direction to the initial edge detection:
  array_push($possibleEdges,($thisEdgesStartPoint[0]).",".(($thisEdgesStartPoint[1])-$tileLineDimension)."|".$thisEdgesStartPoint[0].",".$thisEdgesStartPoint[1]);
 
}
if(($direction=="south") || ($direction=="east") || ($direction=="west")) {
// add 'south' point:
 //array_push($possibleEdges,array(($thisEdgesStartPoint[0]),($thisEdgesStartPoint[1])+1));
 
 
  array_push($possibleEdges,$thisEdgesStartPoint[0].",".(($thisEdgesStartPoint[1])+$tileLineDimension)."|".($thisEdgesStartPoint[0]).",".($thisEdgesStartPoint[1]));
  array_push($possibleEdges,($thisEdgesStartPoint[0]).",".(($thisEdgesStartPoint[1]))."|".$thisEdgesStartPoint[0].",".($thisEdgesStartPoint[1]+$tileLineDimension));
 
 
 
}
if(($direction=="north") || ($direction=="east") || ($direction=="south")) {
// add 'east' point:
// array_push($possibleEdges,array(($thisEdgesStartPoint[0])+1,($thisEdgesStartPoint[1])));
 
 
   array_push($possibleEdges,($thisEdgesStartPoint[0]+$tileLineDimension).",".(($thisEdgesStartPoint[1]))."|".($thisEdgesStartPoint[0]).",".($thisEdgesStartPoint[1]));
  array_push($possibleEdges,($thisEdgesStartPoint[0]).",".(($thisEdgesStartPoint[1]))."|".($thisEdgesStartPoint[0]+$tileLineDimension).",".($thisEdgesStartPoint[1]));
 
 
 
}
if(($direction=="north") || ($direction=="south") || ($direction=="west")) {
// add 'west' point:
// array_push($possibleEdges,array(($thisEdgesStartPoint[0])-1,($thisEdgesStartPoint[1])));

  array_push($possibleEdges,($thisEdgesStartPoint[0]-$tileLineDimension).",".(($thisEdgesStartPoint[1]))."|".($thisEdgesStartPoint[0]).",".($thisEdgesStartPoint[1]));
  array_push($possibleEdges,($thisEdgesStartPoint[0]).",".(($thisEdgesStartPoint[1]))."|".($thisEdgesStartPoint[0]-$tileLineDimension).",".($thisEdgesStartPoint[1]));

}
// 

$foundNewPoint = "";
// check if any of these are valid edges
for ($i = 0;$i < (count($possibleEdges));$i++) {

if ((in_array($possibleEdges[$i],$edges)) && (!(in_array($possibleEdges[$i],$usedEdges)))){
 
 if($debug) {
 echo "<br>found next edge: ".$possibleEdges[$i];
 }
 
 $foundNewPoint = $possibleEdges[$i];
 
  array_push($usedEdges,$possibleEdges[$i]);
 
 // add which point isn't the current point to the list, and set up for the next iteration:
 
  $points = explode("|", $possibleEdges[$i]);
$startEdge = implode(",",$thisEdgesStartPoint);
 if($points[0] == $startEdge) {
 // add the other point:
 
 $newPoint = explode(",", $points[1]);
   
 
 
 } else {
 $newPoint = explode(",", $points[0]);
 }
 array_push($orderedPoints,array($newPoint[0],$newPoint[1]));
  $endPoint = $newPoint;
 break;
}

}




if($foundNewPoint == "") {
$stillWorking = false;
} else {
// determine new direction:


$startX = $thisEdgesStartPoint[0];
$startY = $thisEdgesStartPoint[1];
$endX = $newPoint[0];
$endY = $newPoint[1];

if ($startY == $endY) {
if ($startX < $endX) {
$direction = "east";
} else {
$direction = "west";
}
} else {

if ($startY < $endY) {
$direction = "south";
} else {
$direction = "north";
}

}

array_push($orderedDirections,$direction);
}

} while ($stillWorking);



if($debug) {
echo "<pre>";
var_dump($orderedDirections);
echo "</pre>";
}

// check all edges have been used
// #####################


// remove any intermediary points
// #####################

// find any intermediatry directions and convert these to uppercase:
for ($i = 1; $i<(count($orderedDirections)-1); $i++) {
if(strtolower($orderedDirections[$i]) == strtolower($orderedDirections[$i+1])) {
if(strtolower($orderedDirections[$i]) == strtolower($orderedDirections[$i-1])) {
strtolower($orderedDirections[$i] = strtoupper($orderedDirections[$i]));
}
}
}


if($debug) {
echo "<hr>";
echo "<pre>";
var_dump($orderedDirections);
echo "</pre>";
}


$directionsToRemove = array("NORTH","EAST","SOUTH","WEST");
$tidiedOrderedPoints = array();
for ($i = 0; $i<count($orderedPoints); $i++) {
if (!(in_array($orderedDirections[$i], $directionsToRemove))) {
array_push($tidiedOrderedPoints,array($orderedPoints[$i][0],$orderedPoints[$i][1]));
}
}



// bezier curves:
// http://stackoverflow.com/questions/7054272/how-to-draw-smooth-curve-through-n-points-using-javascript-html5-canvas

$previousX = $tidiedOrderedPoints[0][0];
$previousY = $tidiedOrderedPoints[0][1];
for ($i = 1; $i<count($tidiedOrderedPoints)-2; $i++) {

  $controlX = ($tidiedOrderedPoints[$i][0] + $tidiedOrderedPoints[$i+1][0]) / 2;
  $controlY = ($tidiedOrderedPoints[$i][1] + $tidiedOrderedPoints[$i+1][1]) / 2;
quadBezier($mapCanvas, $previousX, $previousY, $tidiedOrderedPoints[$i][0], $tidiedOrderedPoints[$i][1], $controlX, $controlY);

$previousX = $controlX;
$previousY = $controlY;

}

quadBezier($mapCanvas, $previousX, $previousY,$tidiedOrderedPoints[$i][0], $tidiedOrderedPoints[$i][1], $tidiedOrderedPoints[$i+1][0],$tidiedOrderedPoints[$i+1][1]);

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



if(!$debug) {
// Output image to the browser
header('Content-type: image/png');
imagepng($imageResampled);
}



imagedestroy($mapCanvas);
imagedestroy($overlayTexture);
imagedestroy($imageResampled);
imagedestroy($brush);




?>