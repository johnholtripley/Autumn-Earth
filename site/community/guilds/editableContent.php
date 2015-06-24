<?php
include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
<meta content="no" http-equiv="imagetoolbar" />
<meta content="TRUE" name="MSSmartTagsPreventParsing" />

<style type="text/css">
td, th {
/* show table cell edges while editing */
border: 1px dotted #cecece;
}
</style>

<?php
// check for GET data:
$pageID = $_GET["whichpage"];
// check that a valid number has been passed:

if (is_numeric($pageID)) {
$query = "select * from tblFreeformPages WHERE status='1' AND pageID='".$pageID."'";
$result = mysql_query($query) or die ("couldn't execute query");



if (mysql_num_rows($result) > 0) {
$row = mysql_fetch_array($result);
	extract($row);
	
	// apply saved style to the iFrame: (without writing it into the iframe's contents)
echo '<style type="text/css">'."\n";
echo 'body { background: #'.$bgColour.'; color: #'.$textColour.'; font-family: '.$fontfamily.';}'."\n";
echo '</style>'."\n";
	echo '</head>'."\n";
	echo '<body onload="convertAttributes();">'."\n";
	
	echo stripslashes(htmlspecialchars_decode($pageContent))."\n";
	
	} else {
	echo 'can\'t find page data';
	}
	} else {
	echo 'invalid page id';
	}
	include($_SERVER['DOCUMENT_ROOT']."/includes/close.php");
?>
</body>
</html>
