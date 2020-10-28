<?php

$whichSprite = $_GET["sprite"];
$hex = $_GET["hex"];
$debug = false;
if(isset($_GET["debug"])) {
    $debug = true;
}

// convert hex to RGB - https://stackoverflow.com/questions/15202079/convert-hex-color-to-rgb-values-in-php#answer-15202156
$hexSplit = str_split( $hex, 2 );
$red = hexdec( $hexSplit[0] );
$green = hexdec( $hexSplit[1] );
$blue = hexdec( $hexSplit[2] );




$inputImagePath = '../images/game-world/npcs/'.$whichSprite.'.png';
$overlayImage = imagecreatefrompng($inputImagePath);

// multiply the input image over the required colour:
// kudos https://stackoverflow.com/questions/15554414/multiply-filter-with-phps-gd-library instead

imagealphablending($overlayImage, false);
imagesavealpha($overlayImage, true);

$imagex = imagesx($overlayImage);
$imagey = imagesy($overlayImage);
$transparentColour = imageColorAllocateAlpha($overlayImage, 0, 0, 0, 127);
for ($x = 0; $x <$imagex; ++$x) {
    for ($y = 0; $y <$imagey; ++$y) {
        $rgb = imagecolorat($overlayImage, $x, $y);
        $transparency = ($rgb >> 24) & 0x7F;
        if($transparency == 127) {
            imagesetpixel($overlayImage, $x, $y, $transparentColour);
        } else {
            $TabColors=imagecolorsforindex ( $overlayImage , $rgb );
            $newColourRed=floor($TabColors['red']*$red/255);
            $newColourGreen=floor($TabColors['green']*$green/255);
            $newColourBlue=floor($TabColors['blue']*$blue/255);
            $newcol = imagecolorallocate($overlayImage, $newColourRed,$newColourGreen,$newColourBlue);
            imagesetpixel($overlayImage, $x, $y, $newcol);
        }
    }
}



if($debug) {
    ob_start();
    imagepng($overlayImage,null,0);
    $rawImageBytes = ob_get_clean();
    echo '<style>body{background:#cecece;}img{display:block;margin: 60px auto;}</style>';
    echo '<img src="data:image/jpeg;base64,' . base64_encode( $rawImageBytes ) . '">';
} else {
    header('Content-Type: image/png');   
    imagepng($overlayImage,null,0);
}




?>