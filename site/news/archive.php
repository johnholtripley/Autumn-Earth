<?php
$title="Autumn Earth News";
include($_SERVER['DOCUMENT_ROOT']."/includes/session.inc");
include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/functions.inc");
include($_SERVER['DOCUMENT_ROOT']."/includes/header.inc");
include($_SERVER['DOCUMENT_ROOT']."/includes/login.inc");


echo'<h1>News Archive</h1>';




$query = "select * from tblNews WHERE status='1' order by timeAdded DESC";
$result = mysql_query($query) or die ("couldn't execute query");



if (mysql_num_rows($result) > 0) {


while ($row = mysql_fetch_array($result)) {

	extract($row);
	$timeAdded = strtotime($timeAdded);
	echo '<p><strong>'.$newsTitle.'</strong> - '.date('jS F Y',$timeAdded);
	
			// check for posted by info:
if ($postedBy != "") {
echo ' - posted by '.$postedBy;
}
	echo '<br />'.$newsSynopsis.' <a href="/news/index.php?article='.$newsID.'" title="Click for the full article">read more...</a></p>'."\n";
}

} else {
echo'<p class="Error">No news items found.</p>';
}











include($_SERVER['DOCUMENT_ROOT']."/includes/close.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/footer.inc");
?>