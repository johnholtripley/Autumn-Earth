<?php


// get temporary file name:
$tempfilename = $_FILES['imagefile']['tmp_name'];
//
$tempfile = fopen($tempfilename, "r");
$readfilecontents = fread($tempfile, filesize($tempfilename));
$readimage = imagecreatefromstring($readfilecontents);
fclose($tempfile);



$targetpath = "savedfile.jpg";

imagejpeg($readimage, $targetpath, 100);
?>