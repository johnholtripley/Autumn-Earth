<?php

// to do:
// bmp support
// tiff support
// correctly read file size, and error catch as appropriate
// ensure script doesn't time out during upload
// when cropping and skewing - ensure that it is correctly sized to keep the full skewed shape
// when resizing and skewing - part of the image is lost (if width is greater than height)
// cropped and skewed images aren't transparent






$uploadError = "";

$uploadedfilesize = $_FILES['imagefile']['size'];
// check file size didin't exceed limit (100k here):
// ###############
// this is mis-reported (ie $uploadedfilesize==0 if large file size)
// ###############
if ($uploadedfilesize > 102400) {
	$uploadError = "file size too large";
} else if ($uploadedfilesize == 0) {
	// no file uploaded
	$uploadError = "no file selected";
} else {
	
	// get temporary file name:
	$temporary_name = $_FILES['imagefile']['tmp_name'];
	
	// check file extension from client's machine:
	$filename = $_FILES['imagefile']['name'];
	$dotposition = strrpos($filename, ".");
	if ($dotposition !== false) {
		$fileextension = strtolower(substr($filename, ($dotposition+1), (strlen($filename))));
	} else {
		$fileextension = "";
	} 
	
	$mimetype = $_FILES['imagefile']['type']; 
	
	
	switch($mimetype) {
		case "image/jpg":
		case "image/jpeg":
		case "image/pjpeg": 
			if (($fileextension == "jpg") || ($fileextension == "jpeg")) {
				$uploadedImage = imagecreatefromjpeg($temporary_name);
			} else {
				$uploadError = "invalid file type";
			}
		break;
		case "image/gif":
			if ($fileextension == "gif") {
				$uploadedImage = imagecreatefromgif($temporary_name);
			} else {
				$uploadError = "invalid file type";
			}
		break;
		case "image/png":
			if ($fileextension == "png") {
				$uploadedImage = imagecreatefrompng($temporary_name);
			} else {
				$uploadError = "invalid file type";
			}
		break;
		/*
		case "image/bmp":
			if ($fileextension == "bmp") {
				$uploadedImage = imagecreatefromwbmp($temporary_name);
			} else {
				$uploadError = "invalid file type";
			}
		break;
		*/
		// bmp limited support - http://uk.php.net/manual/en/function.imagecreatefromwbmp.php
		// check ImageCreateFromBMP on http://uk2.php.net/imagecreate
		// tif not supported
		default:
		$uploadError = "invalid file type";
	} 

}

// check if an image could be created but was set as a valid file type:
if ((!$uploadedImage) && ($uploadError == "")) {
	$uploadError = "Couldn't create image from this file.";
}

if ($uploadError == "") {

// check if any conversion is needed
// direction = 0   - no iso conversion
// direction = 1   - iso left wall
// direction = -1   - iso right wall
if ($_POST["convert"] == "true") {
	// check radio buttons
	$direction = $_POST["skew"];
} else {
	$direction = o;
}


// photoshop set up: width 89.4%   skew 0, 26.6   measured height after = x1.44

$uploadedImage_width=imageSX($uploadedImage);
$uploadedImage_height=imageSY($uploadedImage);

// convert to true colour if required:
if (!imageistruecolor($uploadedImage)) {
	$truecolor = imagecreatetruecolor($uploadedImage_width,$uploadedImage_height);
	imagecopy($truecolor,$uploadedImage,0,0,0,0,$uploadedImage_width,$uploadedImage_height);
	$uploadedImage = $truecolor;
}

if ($direction == 0) {
	$newCanvas = $uploadedImage;
	$new_width = $uploadedImage_width;
	$new_height = $uploadedImage_height;
} else {
	$new_width = $uploadedImage_width*0.894;
	$new_height = $uploadedImage_height*1.44;
	$stretched = imagecreate($new_width, $uploadedImage_height); 
	
	// shrink horizontally:
	imagecopyresampled($stretched, $uploadedImage, 0,0,0,0,$new_width,$uploadedImage_height,$uploadedImage_width,$uploadedImage_height);
	
	
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
			imagecopyresampled($newCanvas, $stretched, $i,$step,$i,0,2,$uploadedImage_height,2,$uploadedImage_height);
			$step++;
		}
	} else {
		// step to create isometric angle:
		$step = 0;
		for ($i=$new_width; $i>=0; $i=$i-2) {
			imagecopyresampled($newCanvas, $stretched, $i,$step,$i,0,2,$uploadedImage_height,2,$uploadedImage_height);
			$step++;
		}
	}
}
// ensure alpha is saved:
imagesavealpha($newCanvas, true);


$maxwidth = 100;
$maxheight = 200;




// check to see if need to resize or crop image:
if ($_POST["imagesizing"] == "scale") {
	// resize:
	

	
	
	// determine new proportions:
	$imageProportion = $new_width/$new_height;
	
	if (($maxwidth/$maxheight) > $imageProportion) {
		$maxwidth = $maxheight*$imageProportion;
	} else {
		$maxheight = $maxwidth/$imageProportion;
	}


// create new image for resized image:
$resizedImage = imagecreatetruecolor($maxwidth, $maxheight);
// fill canvas with 100% alpha 'colour'
$alphafill = imagecolorallocate($resizedImage, 0, 0, 0); 
imagecolortransparent($resizedImage, $alphafill); 
// turn off the alpha blending to keep the alpha channel:
imagealphablending($resizedImage, false);
	
	imagecopyresampled($resizedImage, $newCanvas, 0, 0, 0, 0, $maxwidth, $maxheight, $new_width, $new_height);
} else {
	// crop image:
	
	// create new image for cropped image:
$resizedImage = imagecreatetruecolor($maxwidth, $maxheight);
// fill canvas with 100% alpha 'colour'
$alphafill = imagecolorallocate($resizedImage, 0, 0, 0); 
imagecolortransparent($resizedImage, $alphafill); 
// turn off the alpha blending to keep the alpha channel:
imagealphablending($resizedImage, false);
	
	imagecopy($resizedImage, $newCanvas, 0, 0, 0, 0, $maxwidth, $maxheight);
}

// ensure alpha is saved:
imagesavealpha($resizedImage, true);

// create new unique filename:
$newfilename = md5(time()).'.png';
// ############### - check that this filename doesn't already exist using file_exists

header("content-type: image/png");
imagepng ($resizedImage,'','0');

// ###############
// display the output in flash - or create a jpeg on neutral background to avoid png/alpha issues in IE etc
// ###############

imagedestroy($newCanvas);
imagedestroy($truecolor);
imagedestroy($stretched);
imagedestroy($resizedImage);

} else {
	// upload error
	echo $uploadError;
	// log this error - log error, account name, filename on the client's machine and date/time
	echo '<br /><a href="/development/architect/">back</a>';
}

imagedestroy($uploadedImage);

?>