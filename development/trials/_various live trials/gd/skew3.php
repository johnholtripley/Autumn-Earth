<?php

// photoshop set up
// width 89.4%
// skew 0, 26.6

// measured height after = x1.44



$sourcefile = ImageCreateFromPng('purple.png'); 
imagealphablending($sourcefile, true); // remove?
$sourcefile_width=imageSX($sourcefile);
$sourcefile_height=imageSY($sourcefile);
if (!imageistruecolor($sourcefile))
{
  $truecolor = imagecreatetruecolor($sourcefile_width,$sourcefile_height);
  imagealphablending($truecolor, true); // remove?
  imagecopy($truecolor,$sourcefile,0,0,0,0,$sourcefile_width,$sourcefile_height);
 
  $sourcefile = $truecolor;
}




$new_width = $sourcefile_width*0.894;
$new_height = $sourcefile_height*1.44;

$stretched = imagecreate($new_width, $sourcefile_height); 
imagealphablending($stretched, true); // remove?


// shrink horizontally:
imagecopyresampled($stretched, $sourcefile, 0,0,0,0,$new_width,$sourcefile_height,$sourcefile_width,$sourcefile_height);

// step to create isometric angle:
$newCanvas = imagecreate($new_width, $new_height);

  // fill canvas with 100% alpha 'colour'
  $alphafill = imagecolorallocatealpha($newCanvas, 0, 0, 0); 
  imagecolortransparent($newCanvas, $alphafill); 
  // turn off the alpha blending to keep the alpha channel:
imagealphablending($newCanvas, false);

$step = 0;
for ($i=0; $i<=$new_width; $i=$i+2) {
imagecopyresampled($newCanvas, $stretched, $i,$step,$i,0,2,$sourcefile_height,2,$sourcefile_height);
$step++;
}

// ensure alpha is saved:
imagesavealpha($newCanvas, true);

header("content-type: image/png");
imagepng ($newCanvas,'','0');
// ###############
// display the output in flash - or create a jpeg on neutral background to avoid png/alpha issues in IE etc
// ###############
imagedestroy($newCanvas);
imagedestroy($sourcefile);
imagedestroy($truecolor);
imagedestroy($stretched);

?>