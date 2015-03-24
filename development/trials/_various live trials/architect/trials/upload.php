<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
<title>Autumn Earth</title>
<meta content="salmacis" name="keywords" />
<meta content="john@salmacis.co.uk" name="author" />
<meta content="isometric world" name="description" />
<meta content="text/html; charset=iso-8859-1" http-equiv="content-type" />
<meta content="no" http-equiv="imagetoolbar" />

<link rel="stylesheet" href="../elements/ae.css" type="text/css" />
</head>
<body>
<div align="center" class="blockcentred">
<?php
// check password:

$filename = "../elements/" . $_POST["username"] ."/base.txt";
	if (!($fp = fopen($filename, "r"))) {
		//return error
		
		print ("failed to read file");
	} else {
		$data = fread($fp, filesize($filename));

		// separate the whole string into variables
		parse_str($data);

		fclose($fp);
		//
		$encryptedinput = crypt($_POST["password"], $codeversion);
		// let the salt be automatically generated
		// You should pass the entire results of crypt() as the salt for comparing a
		// password, to avoid problems when different hashing algorithms are used.
		if ($encryptedinput == $codeversion) {
			/* send variable to flash: */
			print ("correct password");
			print("<br />");


			if ($_POST["design"] == "1") {
				print("first design was chosen");
			} else {
				print("second design was chosen");
			}
			print("<br />");
			if ($_POST["convert"] == "true") {
				print("image will be converted");
			} else {
				print("image will be left as it is");
			}
			

		} else {
			/* send variable to flash: */
			print ("incorrect password");
		}
	}
	// get user's uploaded file name:
	$userfilename = $_FILES['imagefile']['name'];
	if ($userfilename) {
	// get uploaded file information:
	$uploadfilesize = $_FILES['imagefile']['size'];
	// get temporary file name:
	$tempfilename = $_FILES['imagefile']['tmp_name'];
	//
	$tempfile = fopen($tempfilename, "r");
	$readfilecontents = fread($tempfile, filesize($tempfilename));
	$readimage = imagecreatefromstring($readfilecontents);
	fclose($tempfile);
	//
	//
	/*
	if ($uploadedfiletype == "image/jpeg") {
	// attempt file save:
	$targetpath = "custom/uploadfile.jpg";
	
	if (move_uploaded_file($_FILES['imagefile']['tmp_name'], $targetpath)) {
	print("saved successfully");
	} else {
	print("couldn't be saved");
	}
	
	}
	//
	*/
	


				// things worth trying...
				/*
				$image =  imagecreatefromjpeg($_FILES['imagefile']
				['tmp_name']);
				imagejpeg($image, 'images/image.jpg');
				*/
				/*
				<?
				$loadFile = "http://static.php.net/images/php.gif";
				
				$im = imagecreatefromstring(file_get_contents($loadFile));
				// identical to imagecreatefromgif($loadFile);
				imagegif($im);
				?>
				
				http://uk2.php.net/manual/en/function.is-uploaded-file.php
					
				http://terra.di.fct.unl.pt/docs/php/features.file-upload.php.htm
								*/

	
	
	
	//
	$imagewidth = imagesx($readimage);
	$imageheight = imagesy($readimage);
	//
	$uploadedfiletype = $_FILES['imagefile']['type'];
	//
	print("<br />");
	print("file info:");
	print("<br />");
	print("file type is " . $uploadedfiletype);
	print("<br />");
	print("file size is " . $uploadfilesize);
	//
	if ($uploadfilesize == 0) {
	print("<br />");
	print("file failed to upload - filesize is 0");
	print("<br />");
	}
	//
	if ($uploadfilesize > 102400) {
	print("<br />");
	print("image size exceeded limit");
	
	} else {
	print("<br />");
	print("image size was within limit");
	
	}
	print("<br />");
	print("image width is " . $imagewidth);
	print("<br />");
	print("image height is " . $imageheight);
	} else {
	
print("file failed to upload");	
}

?>
</div>
</body>
</html>