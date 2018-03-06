
<hr />
<h2>news</h2>



<?php
$query = "select * from tblNews WHERE status='1' order by timeAdded DESC limit 5";
$result = mysqli_query($connection, $query) or die ("couldn't execute query");



if (mysqli_num_rows($result) > 0) {
// get the first news item
$row = mysqli_fetch_array($result);
extract($row);

echo '<h3>'.$newsTitle.'</h3>';
$timeAdded = strtotime($timeAdded);
echo '<p><strong>'.date('jS F Y',$timeAdded).'</strong>';

// check for posted by info:
if ($postedBy != "") {
echo ' - posted by '.$postedBy;
}

echo'</p>'."\n";

// check for [continue] break
$pos = strpos($newsContent, '[CONTINUE]');
if ($pos === false) {
$newcontent = smartPunctuation($newsContent);
} else {
// one was found:
$newcontent = smartPunctuation(substr($newsContent, 0, $pos)) . '<br /><a href="/chronicle/index.php?article='.$newsID.'" title="Click for the full article">continues...</a>';
}

echo $newcontent."\n".'<br />';
// get the rest:
while ($row = mysqli_fetch_array($result)) {
echo '----------------';
	extract($row);
	$timeAdded = strtotime($timeAdded);
	echo '<p><strong>'.$newsTitle.'</strong> - '.date('jS F Y',$timeAdded);
	
	// check for posted by info:
if ($postedBy != "") {
echo ' - posted by '.$postedBy;
}
	echo'<br />'.$newsSynopsis.' <a href="/chronicle/index.php?article='.$newsID.'" title="Click for the full article">read more...</a></p>'."\n";
}

} else {
echo'<p class="Error">No news items found.</p>';
}


?>


<hr />
