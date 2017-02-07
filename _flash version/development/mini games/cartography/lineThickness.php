<?php


$canvaDimension = 500;

$mapCanvas = imagecreatetruecolor($canvaDimension, $canvaDimension);


// Fill the background
$ground = imagecolorallocate($mapCanvas, 253, 243, 178);

imagefilledrectangle($mapCanvas, 0, 0, $canvaDimension, $canvaDimension, $ground);


$brush = imagecreate(2,2);

  $brushtrans = imagecolorallocate($brush, 0, 0, 0);
  imagecolortransparent($brush, $brushtrans);

  $color = imagecolorallocate($brush, 96, 35, 14);
    imagefilledellipse($brush, 1, 1, 2, 2, $color);
  

  imagesetbrush($mapCanvas, $brush);




quadBezier($mapCanvas, 100, 100,600,600,450,300);
quadBezier($mapCanvas, 100, 100,604,604,450,300);



/*


$previousX = $tidiedOrderedPoints[0][0];
$previousY = $tidiedOrderedPoints[0][1];
if($previousX == 0) {
// drawing routine doesn't like zero
$previousX = 0.01;
}
if($previousY == 0) {
$previousY = 0.01;
}
for ($i = 1; $i<count($tidiedOrderedPoints)-2; $i++) {

  $controlX = ($tidiedOrderedPoints[$i][0] + $tidiedOrderedPoints[$i+1][0]) / 2;
  $controlY = ($tidiedOrderedPoints[$i][1] + $tidiedOrderedPoints[$i+1][1]) / 2;
quadBezier($mapCanvas, $previousX, $previousY, $tidiedOrderedPoints[$i][0], $tidiedOrderedPoints[$i][1], $controlX, $controlY);

$previousX = $controlX;
$previousY = $controlY;

}




*/



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






// Output image to the browser
header('Content-type: image/jpg');
imagejpeg($imageResampled);




imagedestroy($mapCanvas);

imagedestroy($imageResampled);
imagedestroy($brush);








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


















?>