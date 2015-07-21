<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
<title>palette</title>
<meta content="Autumn Earth" name="description" />

<meta content="text/html; charset=iso-8859-1" http-equiv="content-type" />
<meta content="no" http-equiv="imagetoolbar" />
<meta content="TRUE" name="MSSmartTagsPreventParsing" />



<style type="text/css">
img {
border: 0;
}

.paletteElem {
width: 12px;
height: 12px;
overflow: hidden;
float: left;
margin: 0 1px 1px 0;
}
</style>

</head>
<body>
<div style="width: 156px; margin: 5px auto; height: 260px; background: #fff url(/assets/htmlEditor/palette_loading.gif) no-repeat center center;">

<?php
// get GET data to see which element to return the colour to:

$targetElement = $_GET["picker"];
$paletteActionBefore = "";
$paletteActionAfter = "";
switch($targetElement) {

case "text":
$paletteActionBefore = "javascript:window.opener.document.saveContentForm.wrappertextColour.value='";
$paletteActionAfter = "';window.opener.updateColours();self.close();";
break;

case "background":
$paletteActionBefore = "javascript:window.opener.document.saveContentForm.wrapperbackgroundColour.value='";
$paletteActionAfter = "';window.opener.updateColours();self.close();";
break;

case "forecolour":
$paletteActionBefore = "javascript:window.opener.wrapHTMLTags('span','color: #";
$paletteActionAfter = "');self.close();";
break;

case "bgcolour":
$paletteActionBefore = "javascript:window.opener.wrapHTMLTags('span','background-color: #";
$paletteActionAfter = "');self.close();";
break;

case "tablebordercolour":
$paletteActionBefore = "javascript:window.opener.document.insertTableForm.borderColour.value='";
$paletteActionAfter = "';window.opener.drawPreview();self.close();";
break;

case "tablebackgroundcolour":
$paletteActionBefore = "javascript:window.opener.document.insertTableForm.backgroundColour.value='";
$paletteActionAfter = "';window.opener.drawPreview();self.close();";
break;
}


// create palette:
for ($i=0; $i<=255; $i=$i+51) {
for ($j=0; $j<=255; $j=$j+51) {
for ($k=0; $k<=255; $k=$k+51) {
  $thisWebColour = sprintf('%02X%02X%02X', $k, $j, $i);
  echo '<div class="paletteElem" style="background: #'.$thisWebColour.'"><a href="'.$paletteActionBefore.$thisWebColour.$paletteActionAfter.'" title="#'.$thisWebColour.'"><img src="/images/htmlEditor/palette_overlay.gif" alt="#'.$thisWebColour.'" width="12" height="12"></a></div>'."\n";
}

}

}

?>
<div style="clear:both;overflow:hidden;height:1px;">&nbsp;</div>
<button onclick="self.close();">cancel</button>
</div>
</body>
</html>