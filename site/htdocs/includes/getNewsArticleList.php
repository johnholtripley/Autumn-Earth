<?php

include_once($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include_once($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");

if(isset($_GET['page'])) {
	$pagenumber = $_GET['page'];
	
$pos = strrpos($pagenumber, "-");
if ($pos !== false) {
	// is a range
	$startpagenumber = substr($pagenumber,0,$pos);
	$endpagenumber = substr($pagenumber,$pos+1);

} else {
	$startpagenumber = $pagenumber;
	$endpagenumber = $pagenumber;
}



} else {
	$startpagenumber = 1;
	$endpagenumber = 1;
}

$query = "select * from tblNews WHERE status='1' order by timeAdded DESC";
$result = mysql_query($query) or die ("couldn't execute query");
$numberOfEntries = mysql_num_rows($result);
$resultsperpage = 5;
$totalpages = ceil($numberOfEntries/$resultsperpage);
if($endpagenumber > $totalpages) {
$endpagenumber = $totalpages;
}
if($startpagenumber < 1) {
$startpagenumber = 1;
}
if (($startpagenumber>0) && ($endpagenumber <= $totalpages)) {
	$startpoint = ($startpagenumber - 1) * $resultsperpage;
	$endpoint = $endpagenumber * $resultsperpage;
	if ($endpoint > $numberOfEntries) {
		$endpoint = $numberOfEntries;
	}
	if ($numberOfEntries > 0) {
		$rowcount = 0;
		$animationOffset = 0;
		$htmlOutput = "";
		while ($row = mysql_fetch_array($result)) {
			if (($rowcount>= $startpoint) && ($rowcount<$endpoint)) {
				extract($row);
				$timeAdded = strtotime($timeAdded);
				
				if(isset($isInitialPageRequest)) {
					$blockClass = '';
				} else {
					$blockClass = ' class="animateIn animateOffset'.$animationOffset.'"';
					$animationOffset ++;
				}
				$htmlOutput .= '<p'.$blockClass.'><strong>'.$newsTitle.'</strong> - '.date('jS F Y',$timeAdded);
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


// only need to escape double quotes, not single:
echo '{"markup": ["'.addcslashes($htmlOutput, '"\\/').'"],"resultsRemaining": ["'.($numberOfEntries-$endpoint).'"]}';



	}
	}
}

?>