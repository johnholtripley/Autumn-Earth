<?php

function combineimages($overlayfile, $dest_x, $dest_y) {
	global $sourcefile_id, $sourcefile_width, $sourcefile_height;
	
	// Get the resource ids of the overlay
	$overlayfile_id = imagecreatefrompng($overlayfile);
	imageAlphaBlending($overlayfile_id, false);
	imageSaveAlpha($overlayfile_id, true);
		
	// Get the sizes of the overlay 
	$overlayfile_width=imageSX($overlayfile_id);
	$overlayfile_height=imageSY($overlayfile_id);
		
	imagecopy($sourcefile_id, $overlayfile_id, $dest_x, $dest_y, 0, 0, $overlayfile_width, $overlayfile_height);
	imagedestroy($overlayfile_id);
}


// set up body:
$sourcefile_id = imagecreatefrompng('bodycrop.png');
$sourcefile_width=imageSX($sourcefile_id);
$sourcefile_height=imageSY($sourcefile_id);

// shirt overlay offset is 47 pixels from the top of the body
combineimages('shirtcrop.png',0,47);
combineimages('hatcrop.png',0,0);

// Create a jpeg out of the modified picture
header("Content-type: image/jpg");
imagejpeg ($sourcefile_id, '', '100');

imagedestroy($sourcefile_id);

?>