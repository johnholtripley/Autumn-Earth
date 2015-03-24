<?php

// get source
$sourcefile_id = imagecreatefrompng('purple.png');
$sourcefile_width=imageSX($sourcefile_id);
$sourcefile_height=imageSY($sourcefile_id);

if (!imageistruecolor($sourcefile_id))
{
  $truecolor = imagecreatetruecolor($sourcefile_width,$sourcefile_height);
  imagecopy($truecolor,$sourcefile_id,0,0,0,0,$sourcefile_width,$sourcefile_height);
  $sourcefile_id = $truecolor;
}

// stretch source:
$stretched = imagecreatetruecolor(($sourcefile_width*2),$sourcefile_height);
imagecopyresampled($stretched, $sourcefile_id, 0,0,0,0,($sourcefile_width*2),$sourcefile_height,$sourcefile_width,$sourcefile_height);
$sourcefile_id = $stretched;

// rotate source:
$sourcefile_id = imagerotate($sourcefile_id, 60, -1);

// ensure alpha is set:
imagealphablending($sourcefile_id, true);
imagesavealpha($sourcefile_id, true);

// Create a png of the modified picture
header("content-type: image/png");
imagepng ($sourcefile_id,'','0');

// clean up
imagedestroy($sourcefile_id);
imagedestroy($truecolor);
imagedestroy($stretched);

?>