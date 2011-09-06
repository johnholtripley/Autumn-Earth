<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
<head>
<title>Autumn Earth</title>
<meta content="salmacis" name="keywords" />
<meta content="john@salmacis.co.uk" name="author" />
<meta content="isometric world" name="description" />
<meta content="text/html; charset=iso-8859-1" http-equiv="content-type" />
<meta content="no" http-equiv="imagetoolbar" />
</head>

<body>


<?php
$newfilename = $_GET["imageSrc"];

if(file_exists($newfilename)) {

// also check that this file belongs to this user ######

echo '<img src="'.$newfilename.'" />'."\n";
}

?>

<p><a href="index.html">Upload again</a></p>

</body>
</html>