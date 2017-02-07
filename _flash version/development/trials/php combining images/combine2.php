<?php

function combineimages($overlayfile, $sourcefile, $dest_x, $dest_y, $overlay2, $dest2_x, $dest2_y) {
	// Get the resource ids of the pictures
	$overlayfile_id = imagecreatefrompng($overlayfile);
	imageAlphaBlending($overlayfile_id, false);
	imageSaveAlpha($overlayfile_id, true);
	$overlay2file_id = imagecreatefrompng($overlay2);
	imageAlphaBlending($overlay2file_id, false);
	imageSaveAlpha($overlay2file_id, true);
	$sourcefile_id = imagecreatefrompng($sourcefile);
	
	// Get the sizes of both pix 
	$sourcefile_width=imageSX($sourcefile_id);
	$sourcefile_height=imageSY($sourcefile_id);
	$overlayfile_width=imageSX($overlayfile_id);
	$overlayfile_height=imageSY($overlayfile_id);
	$overlay2file_width=imageSX($overlay2file_id);
	$overlay2file_height=imageSY($overlay2file_id);
	
	imagecopy($sourcefile_id, $overlayfile_id, $dest_x, $dest_y, 0, 0, $overlayfile_width, $overlayfile_height);
	imagecopy($sourcefile_id, $overlay2file_id, $dest2_x, $dest2_y, 0, 0, $overlay2file_width, $overlay2file_height);
	
	// Create a jpeg out of the modified picture
	header("Content-type: image/jpg");
	imagejpeg ($sourcefile_id, '', '100');
	
	imagedestroy($sourcefile_id);
	imagedestroy($overlayfile_id);
}
// shirt overlay offset is 47 pixels from the top of the body
combineimages('shirtcrop.png','bodycrop.png',0,47,'hatcrop.png',0,0);

?>