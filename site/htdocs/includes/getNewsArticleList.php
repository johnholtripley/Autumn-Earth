<?php

include_once($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include_once($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");

if(isset($_GET['page'])) {
	$pagenumber = $_GET['page'];
} else {
	$pagenumber = 1;
}

$query = "select * from tblNews WHERE status='1' order by timeAdded DESC";
$result = mysql_query($query) or die ("couldn't execute query");
$numberOfEntries = mysql_num_rows($result);
$resultsperpage = 5;
$totalpages = ceil($numberOfEntries/$resultsperpage);
if (($pagenumber>0) && ($pagenumber <= $totalpages)) {
	$startpoint = ($pagenumber - 1) * $resultsperpage;
	$endpoint = $pagenumber * $resultsperpage;
	if ($endpoint > $numberOfEntries) {
		$endpoint = $numberOfEntries;
	}
	if ($numberOfEntries > 0) {
		$rowcount = 0;
		$htmlOutput = "";
		while ($row = mysql_fetch_array($result)) {
			if (($rowcount>= $startpoint) && ($rowcount<$endpoint)) {
				extract($row);
				$timeAdded = strtotime($timeAdded);
				$htmlOutput .= '<p><strong>'.$newsTitle.'</strong> - '.date('jS F Y',$timeAdded);
				// check for posted by info:
				if ($postedBy != "") {
					$htmlOutput .= ' - posted by '.$postedBy;
				}
				$htmlOutput .= '<br>'.$newsSynopsis.' <a href="/chronicle/'.$cleanURL.'/" title="Click for the full article">read more...</a></p>';
			}
			$rowcount++;
		}
		if(isset($isInitialPageRequest)) {
		echo $htmlOutput;
	} else {
		// construct JSON response:

echo '{"markup": ["'.addslashes($htmlOutput).'"],"resultsRemaining": ["'.($numberOfEntries-$endpoint).'"]}';



	}
	}
}

?>