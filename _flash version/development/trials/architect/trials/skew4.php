<?php
// photoshop set up: width 89.4%   skew 0, 26.6   measured height after = x1.44

$source = 'red.png';
$direction = 1;
// direction = 0   - no iso conversion
// direction = 1   - iso left wall
// direction = -1   - iso right wall

$sourcefile = ImageCreateFromPng($source); 
$sourcefile_width=imageSX($sourcefile);
$sourcefile_height=imageSY($sourcefile);

// convert to true colour if required:
if (!imageistruecolor($sourcefile)) {
	$truecolor = imagecreatetruecolor($sourcefile_width,$sourcefile_height);
	imagecopy($truecolor,$sourcefile,0,0,0,0,$sourcefile_width,$sourcefile_height);
	$sourcefile = $truecolor;
}

if ($direction == 0) {
	$newCanvas = $sourcefile;
} else {
	$new_width = $sourcefile_width*0.894;
	$new_height = $sourcefile_height*1.44;
	$stretched = imagecreate($new_width, $sourcefile_height); 
	
	// shrink horizontally:
	imagecopyresampled($stretched, $sourcefile, 0,0,0,0,$new_width,$sourcefile_height,$sourcefile_width,$sourcefile_height);
	
	
	$newCanvas = imagecreate($new_width, $new_height);
	// fill canvas with 100% alpha 'colour'
	$alphafill = imagecolorallocate($newCanvas, 0, 0, 0); 
	imagecolortransparent($newCanvas, $alphafill); 
	// turn off the alpha blending to keep the alpha channel:
	imagealphablending($newCanvas, false);
	
	if ($direction == 1) {
		// step to create isometric angle:
		$step = 0;
		for ($i=0; $i<=$new_width; $i=$i+2) {
			imagecopyresampled($newCanvas, $stretched, $i,$step,$i,0,2,$sourcefile_height,2,$sourcefile_height);
			$step++;
		}
	} else {
		// step to create isometric angle:
		$step = 0;
		for ($i=$new_width; $i>=0; $i=$i-2) {
			imagecopyresampled($newCanvas, $stretched, $i,$step,$i,0,2,$sourcefile_height,2,$sourcefile_height);
			$step++;
		}
	}
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