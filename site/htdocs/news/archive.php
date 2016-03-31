<?php
$title="Autumn Earth News";
include($_SERVER['DOCUMENT_ROOT']."/includes/session.php");
include_once($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include_once($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/functions.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/header.php");


?>

<div class="row">
<div class="column">
<h1>The Chronicle Archive</h1>




<div id="newsArticleList" class="paginationBlock">
<?php
$isInitialPageRequest = true;
include($_SERVER['DOCUMENT_ROOT']."/includes/getNewsArticleList.php");
?>
</div>
<?php


if ($numberOfEntries > 0) {
// pagination:
echo '<div id="paginationEnhanced">';
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
echo ' (<span id="articlesRemaining">'.($numberOfEntries-$endpoint).'</span> more)';
echo '</div>';


} else {
echo'<p>No news items found.</p>';
}





?>

</div>
</div>
<?php






include($_SERVER['DOCUMENT_ROOT']."/includes/footer.php");
?>