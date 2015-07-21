<?php

$metadesc="Autumn Earth";

if ($_SERVER['PHP_SELF'] == '/forum/ViewThread.php') {
	$pagetitle = 'Autumn Earth Community Forum Thread';
	$longDescription = 'A discussion on the Autumn Earth Community Site';
	// query database to find meta information
		if(isset($_GET["thread"])) {
	$metathread = $_GET["thread"];

	if (is_numeric($metathread)) {
		$query = "select tblthreads.*, tblposts.postcontent, tblposts.CreationTime from 
		tblthreads inner join
		tblposts on tblthreads.threadid = tblposts.threadid
		where tblthreads.threadID='".$metathread."' order by tblposts.CreationTime limit 1
		";
		$result = mysql_query($query) or die ("couldn't execute query1");
		$numberofrows = mysql_num_rows($result);
		if ($numberofrows > 0) {
			$row = mysql_fetch_array($result);
			extract ($row);
			$pagetitle = stripCode($title).' - a discussion on the Autumn Earth Community Site';
			$longDescription = '\''.stripcode($postcontent).'\' - a discussion on the Autumn Earth Community Site';
		}
	}
}
}



if (!(isset($pagetitle))) {
$pagetitle="Autumn Earth";
}

echo '<title>'.$pagetitle .'</title>'."\n";

?>