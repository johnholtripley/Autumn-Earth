<?php
$title="Autumn Earth News";
include($_SERVER['DOCUMENT_ROOT']."/includes/session.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/functions.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/header.php");


?>

<div class="row">
<div class="column">
<h1>The Chronicle Archive</h1>
<?php


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
if ($pagenumber > $totalpages) {
		$pagenumber = 1;
		}

	$startpoint = ($pagenumber - 1) * $resultsperpage;
		$endpoint = $pagenumber * $resultsperpage;
		if ($endpoint > $numberOfEntries) {
		$endpoint = $numberOfEntries;
		}

if ($numberOfEntries > 0) {

$rowcount = 0;
while ($row = mysql_fetch_array($result)) {
if (($rowcount>= $startpoint) && ($rowcount<$endpoint)) {
	extract($row);
	$timeAdded = strtotime($timeAdded);
	echo '<p><strong>'.$newsTitle.'</strong> - '.date('jS F Y',$timeAdded);
	
			// check for posted by info:
if ($postedBy != "") {
echo ' - posted by '.$postedBy;
}
	echo '<br />'.$newsSynopsis.' <a href="/chronicle/'.$cleanURL.'/" title="Click for the full article">read more...</a></p>'."\n";
}
$rowcount++;
}




// pagination:

$thispageurl = "/chronicle/";

if($pagenumber>1) {
	echo '<a href="'.$thispageurl.'page/'.($pagenumber-1).'" title="View page '.($pagenumber-1).'">previous</a> ';
}

	for($i = 1; $i <= $totalpages; $i++) {
				if($i == $pagenumber) { 
				echo $i.' | ';
				} else {
				echo '<a href="'.$thispageurl.'page/'.$i.'" title="View page '.$i.'">'.$i.'</a> | ';
				}
			} 


if($pagenumber<$totalpages) {
	echo '<a href="'.$thispageurl.'page/'.($pagenumber+1).'" title="View page '.($pagenumber+1).'">next</a> ';
}


} else {
echo'<p class="Error">No news items found.</p>';
}





?>

</div>
</div>
<?php






include($_SERVER['DOCUMENT_ROOT']."/includes/footer.php");
?>