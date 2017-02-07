<?php
/**
 * Compose a PNG file over a src file.
 * If new width/ height are defined, then resize the PNG (and keep all the transparency info)
 * Author:  Alex Le - http://www.alexle.net
 */
function imageComposeAlpha( &$src, &$ovr, $ovr_x, $ovr_y, $ovr_w = false, $ovr_h = false)
{
	if( $ovr_w && $ovr_h )
		$ovr = imageResizeAlpha( $ovr, $ovr_w, $ovr_h );
 
	/* Noew compose the 2 images */
	imagecopy($src, $ovr, $ovr_x, $ovr_y, 0, 0, imagesx($ovr), imagesy($ovr) );
}
 
/**
 * Resize a PNG file with transparency to given dimensions
 * and still retain the alpha channel information
 * Author:  Alex Le - http://www.alexle.net
 */
function imageResizeAlpha(&$src, $w, $h)
{
		/* create a new image with the new width and height */
		$temp = imagecreatetruecolor($w, $h);
 
		/* making the new image transparent */
		$background = imagecolorallocate($temp, 0, 0, 0);
		ImageColorTransparent($temp, $background); // make the new temp image all transparent
		imagealphablending($temp, false); // turn off the alpha blending to keep the alpha channel
 
		/* Resize the PNG file */
		/* use imagecopyresized to gain some performance but loose some quality */
		imagecopyresized($temp, $src, 0, 0, 0, 0, $w, $h, imagesx($src), imagesy($src));
		/* use imagecopyresampled if you concern more about the quality */
		//imagecopyresampled($temp, $src, 0, 0, 0, 0, $w, $h, imagesx($src), imagesy($src));
		return $temp;
}




header('Content-type: image/png');
 
/* Open the photo and the overlay image */
$photoImage = ImageCreateFromPNG('purple.png');
$overlay = ImageCreateFromPNG('bodycrop.png');
 
$percent = 1;
$newW = ceil(imagesx($overlay) * $percent);
$newH = ceil(imagesy($overlay) * $percent);
 
/* Compose the overlay photo over the target image */
imageComposeAlpha( $photoImage, $overlay, 0, 0, $newW, $newH );
 


Imagepng($photoImage); // output to browser
 
ImageDestroy($photoImage);
ImageDestroy($overlay);
ImageDestroy($watermark);
?>



