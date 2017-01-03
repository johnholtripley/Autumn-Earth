<?php
error_reporting(0);
// to do:
// bmp support - http://www.php.net/manual/en/function.imagecreatefromwbmp.php#86214
// upload zip, extract all images and process as requested: http://php.net/manual/en/ziparchive.extractto.php
// correctly read file size, and error catch as appropriate
// ensure script doesn't time out during upload
// when cropping and skewing - ensure that it is correctly sized to keep the full skewed shape
// when resizing and skewing - part of the image is lost (if width is greater than height)
// when resizing and skewing, it looks as it the left most column is missed out
// cropped and skewed images aren't transparent
// test beforeunload event
// replace standard JS onbeforeunload alert with stylable modal popup (if possible)
// upload multiple files and process all indivually
// allow multiple files to be uploaded at once



$uploadError = "";
$thisErrorMessage = $_FILES['Filedata']['error'];

$uploadedfilesize = $_FILES['Filedata']['size'];



// possibly could check if $_FILES and $_POST are empty, this can be due to
// - the limit set by post_max_size in php.ini
// - the limit set by upload_max_filesize in php.ini
// so could catch that happening by checking those:
// http://us3.php.net/manual/en/function.is-uploaded-file.php

// or the  if (!(is_uploaded_file($temporary_name)) { will catch this error










// check file size didn't exceed limit (1000k here):
if ($uploadedfilesize > 1024000) {
	$uploadError = "file size too large";
} else if (($uploadedfilesize == 0) || ($thisErrorMessage !=0)) {
	// no file uploaded
	$uploadError = "no file selected - or files[error] error code:".$thisErrorMessage;
	// http://uk2.php.net/manual/en/features.file-upload.errors.php

} else {
	
	// get temporary file name:
	$temporary_name = $_FILES['Filedata']['tmp_name'];
	
	// check the file has actually been sent by POST
  if (!(is_uploaded_file($_FILES['Filedata']['tmp_name']))) {
    $uploadError = "this file wasn't uploaded";
  }

	// check file extension from client's machine:
	$filename = $_FILES['Filedata']['name'];
	$dotposition = strrpos($filename, ".");
	if ($dotposition !== false) {
		$fileextension = strtolower(substr($filename, ($dotposition+1), (strlen($filename))));
	} else {
		$fileextension = "";
	} 
	
	$mimetype = $_FILES['Filedata']['type']; 
	
	
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
		// psd support on http://www.kingsquare.nl/phppsdreader/
		// tif not supported
		
		case "application/octet-stream":
		// if uploaded from flash. Determine type from file extension
		// not very secure though ? ###############
		
		if (($fileextension == "jpg") || ($fileextension == "jpeg")) {
				$uploadedImage = imagecreatefromjpeg($temporary_name);
				} else if ($fileextension == "gif") {
				$uploadedImage = imagecreatefromgif($temporary_name);
			} else if ($fileextension == "png") {
				$uploadedImage = imagecreatefrompng($temporary_name);
			}
		
		break;
		
		
		default:
		$uploadError = "invalid file type";
	} 

}

// check if an image couldn't be created but was set as a valid file type:
if ((!isset($uploadedImage)) && ($uploadError == "")) {
	$uploadError = "Couldn't create image from this file.";
}

if ($uploadError == "") {

// check if any conversion is needed
// direction = 0   - no iso conversion
// direction = 1   - iso left wall
// direction = -1   - iso right wall

	// check radio buttons
	$direction = $_POST["skew"];



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

// create new unique non-numeric filename:
do {
$newfilename = "u".md5(time()).'.png';
} while (file_exists($newfilename));

imagepng ($resizedImage,$newfilename,'0');

imagedestroy($newCanvas);
if (!imageistruecolor($uploadedImage)) {
imagedestroy($truecolor);
}
imagedestroy($stretched);
imagedestroy($resizedImage);
imagedestroy($uploadedImage);

if ($_POST["sentFromFlash"] == "true") {
// let flash know that this was successful:
echo $newfilename;
} else {
 // standard form upload - redirect to new image:
 header("Location: displayImage.php?imageSrc=".$newfilename);
}

} else {
	// upload error
	
	if ($_POST["sentFromFlash"] == "true") {
	echo "!error";
	} else {
	
	echo $uploadError;
	echo '<br /><a href="/development/architect/">back</a>';
	}
	// log this error - log error, account name, IP address, filename on the client's machine and date/time
	
	
	if(!($filename=fopen("errorlog.txt","w"))) {
		
		}
	
		fwrite($filename, $uploadError); 
		fclose($filename);

}



?>