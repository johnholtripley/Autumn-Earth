<?php


	$canvaDimension = 500;
	$outputCanvaDimension = 500;
	$plantCanvas = imagecreatetruecolor($canvaDimension, $canvaDimension);
	$groundColour = array(219, 215, 190);
	$ground = imagecolorallocate($plantCanvas, $groundColour[0], $groundColour[1], $groundColour[2]);
	imagefilledrectangle($plantCanvas, 0, 0, $canvaDimension, $canvaDimension, $ground);


function quadBezier($im, $x1, $y1, $x2, $y2, $x3, $y3) {
// php draw quad bezier:
// https://spottedsun.com/quadratic-bezier-curve-in-php/
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


$leafCanvasSize = 200;
$leafInset = 10;
$k=0;


$thisLeafColour = [125,125,128];
	${'leaf'.$k} = imagecreate($leafCanvasSize,$leafCanvasSize);

	$leafTrans = imagecolorallocate(${'leaf'.$k}, 0, 0, 0);
	imagecolortransparent(${'leaf'.$k}, $leafTrans);
	${'leafColour'.$k} = imagecolorallocate(${'leaf'.$k}, $thisLeafColour[0], $thisLeafColour[1], $thisLeafColour[2]);

	${'leafBrush'.$k} = imagecreate(6,6);
	$leafBrushTrans = imagecolorallocate(${'leafBrush'.$k}, 0, 0, 0);
	imagecolortransparent(${'leafBrush'.$k}, $leafBrushTrans);
	${'leafBrushColour'.$k} = imagecolorallocate(${'leafBrush'.$k}, $thisLeafColour[0], $thisLeafColour[1], $thisLeafColour[2]);
	imagefilledellipse(${'leafBrush'.$k}, 3,3,6,6, ${'leafBrushColour'.$k});
	imagesetbrush(${'leaf'.$k}, ${'leafBrush'.$k});


	// ###
	// leaf start needs to be the centre of the leaf image so it can be positioned correctly
	quadBezier(${'leaf'.$k}, $leafCanvasSize/2, $leafCanvasSize/2, $leafCanvasSize-$leafInset, $leafCanvasSize/2-$leafInset, $leafCanvasSize/2,$leafInset);
	quadBezier(${'leaf'.$k}, $leafCanvasSize/2, $leafCanvasSize/2, $leafInset, $leafCanvasSize/2-$leafInset, $leafCanvasSize/2,$leafInset);
	imagefill(${'leaf'.$k}, $leafCanvasSize/2, $leafCanvasSize/2-$leafInset*2, ${'leafBrushColour'.$k});
	imageline ( ${'leaf'.$k} , $leafCanvasSize/2, $leafCanvasSize/2 , $leafCanvasSize/2, $leafInset , imagecolorallocate(${'leaf'.$k}, 6,42,30 ));
	// ###
	

$whichElementToUse = 'leaf0';

$thisRotation = 90;
	$pngTransparency = imagecolorallocatealpha(${$whichElementToUse} , 255, 255, 255, 127);
	$rotatedLeaf = imagerotate(${$whichElementToUse}, $thisRotation, $pngTransparency);
//imagealphablending(${'leaf'.$whichLeafToUse}, false);
//imagesavealpha(${'leaf'.$whichLeafToUse}, true);

$thisNextRotation = 38;
$pngTransparency = imagecolorallocatealpha($rotatedLeaf , 255, 255, 255, 127);
$rotatedLeaf = imagerotate($rotatedLeaf, $thisNextRotation, $pngTransparency);

	$rotatedLeafWidth = imagesx($rotatedLeaf);
	$rotatedLeafHeight = imagesy($rotatedLeaf);
	imagecopyresampled($plantCanvas, $rotatedLeaf, 250, 250, 0, 0, $rotatedLeafWidth, $rotatedLeafHeight, $rotatedLeafWidth, $rotatedLeafHeight);
	


header('Content-Type: image/jpeg');
imagejpeg($plantCanvas);



imagedestroy($rotatedLeaf);
imagedestroy(${'leaf'.$k});
imagedestroy($plantCanvas);
?>