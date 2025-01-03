<?php

include_once($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include_once($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");
$pagenumber = 1;
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

$query = "select * from tblnews WHERE status='1' order by timeadded DESC";
$result = mysqli_query($connection, $query) or die ("couldn't execute query");
$numberOfEntries = mysqli_num_rows($result);
$resultsperpage = 5;
$totalpages = ceil($numberOfEntries/$resultsperpage);
if($endpagenumber > $totalpages) {
$endpagenumber = $totalpages;
// google recommends a 404 if the page goes out of bounds: https://webmasters.googleblog.com/2014/02/infinite-scroll-search-friendly.html
header("HTTP/1.0 404 Not Found");
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
		while ($row = mysqli_fetch_array($result)) {
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