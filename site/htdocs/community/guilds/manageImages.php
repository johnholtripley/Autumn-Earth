<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
<title>manage images</title>
<meta content="Autumn Earth" name="description" />

<meta content="text/html; charset=iso-8859-1" http-equiv="content-type" />
<meta content="no" http-equiv="imagetoolbar" />
<meta content="TRUE" name="MSSmartTagsPreventParsing" />

<?php
$thisGuildName = "TheCapedCrusaders";
?>

<script language="javascript" type="text/javascript">

function imageSetup() {
	selectedImage = "";
	<?php
	echo 'imagePath = "/community/guilds/content/'.$thisGuildName.'/";'."\n"; 
	?>
}

function updatePreview(newImage,newName) {
	document.previewImage.src=newImage;
	document.ImageManagement.ImageName.value=newName;
	selectedImage = newName;
	return false;
}

function sendInsertImage(imageToSend) {
	if (imageToSend != "") {
		window.opener.insertImage(imagePath+imageToSend);
		self.close();
	}
}

function sendInsertFullPathImage(imageToSend) {
	if (imageToSend != "") {
		window.opener.insertImage(imageToSend);
		self.close();
	}
}

</script>



<style type="text/css">
img {
border: 0;
}
</style>

</head>
<body onload="imageSetup();">

<form name="ExternalImage" id="ExternalImage">
<label for="ImagePath">path to name:</label>
<input type="text" name="ImagePath" id="ImagePath" value="" />
<button onclick="sendInsertFullPathImage(document.ExternalImage.ImagePath.value);">insert this image</button>
</form>
<hr />
<div style="width: 300px; height: 300px; overflow: auto; border: 1px solid #bbbbbb; background: #fff;">
<img src="/assets/htmlEditor/no_image_selected.gif" name="previewImage" id="previewImage" alt="ImagePreview" />
</div>

<form name="ImageManagement" id="ImageManagement">
<label for="ImageName">image name:</label>
<input type="text" name="ImageName" id="ImageName" value="" style="border: 0;" />
<button onclick="sendInsertImage(selectedImage);">insert this image</button>
<button onclick="self.close();">cancel</button>
</form>



<?php



$directoryPath = $_SERVER['DOCUMENT_ROOT']."/community/guilds/content/".$thisGuildName;
if (is_dir($directoryPath)) {
    if ($thisDirectory = opendir($directoryPath)) {
    echo '<div style="width: 370px; height: 150px; overflow: auto;">'."\n";
        while (($file = readdir($thisDirectory)) !== false) {
        $thisFileName = $directoryPath.'/'.$file;
        $thisImagePath = "/community/guilds/content/".$thisGuildName."/".$file;
            if (is_file($thisFileName)) {
				
				$thisImgSize = getimagesize($thisFileName);
				

				$thisImgWidth = $thisImgSize[0];
				$thisImgHeight = $thisImgSize[1];
				if ($thisImgHeight>$thisImgWidth) {
					$newHeight = '100';
					$newWidth = floor(($thisImgWidth/$thisImgHeight)*100);
				} else {
					$newWidth = '100';
					$newHeight = floor(($thisImgHeight/$thisImgWidth)*100);
				}
				echo '<div style="width: 60px; height: 60px; overflow: hidden; background: url('.$thisImagePath.') no-repeat center center; border: 1px solid #cecece;float: left; margin: 0 8px 8px 0;">'."\n";
				echo '<a href="#" onclick="return updatePreview(\''.$thisImagePath.'\',\''.$file.'\')");" title="'.$file.'"><img src="/assets/htmlEditor/thumbnail_overlay.gif" width="60" height="60" alt="'.$file.'" /></a>'."\n";
				echo '</div>'."\n";
			}
        }
        closedir($thisDirectory);
        echo '<div style="clear: both; overflow: hidden; height: 1px;">&nbsp;</div>'."\n";
        echo '</div>'."\n";
        
    }
} else {
	echo '<p class="Error">Can\'t find this directory</p>'."\n";
}


// to do:

// upload image - check filename extension and mimetype is an image
// create thumbnail of image when uploaded

// delete image (php: unlink)

// if uploading with same filename, confirm replace image or new image

?> 
</body>
</html>