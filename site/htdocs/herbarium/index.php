<?php

include($_SERVER['DOCUMENT_ROOT']."/includes/session.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/functions.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/header.php");

?>
<div class="row">
<div class="column">
<h1>The Herbarium</h1>

<?php
// get all plant data:
$isInitialPageRequest = true;
include($_SERVER['DOCUMENT_ROOT']."/includes/getHerbariumCatalogue.php");

if ($numberOfEntries > 0) {
// pagination:
echo '<div id="paginationEnhanced">';
$thispageurl = "/herbarium/";
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

?>

<div id="cd-modal">
	<div class="modal-content">
		<h1>My Modal Content</h1>
		<p>
			Lorem ipsum dolor sit amet, consectetur adipisicing elit. 
			Ad modi repellendus, optio eveniet eligendi molestiae? 
			Fugiat, temporibus! 
		</p>
	</div>
 	<a href="#0" id="modal-close">Close</a>
</div>
<div id="cd-transition-layer"> 
	<div class="bg-layer"></div>
</div>

<?php

} else {
echo'<p>No plants found.</p>';
}
echo '</div>';
echo '</div>';

include($_SERVER['DOCUMENT_ROOT']."/includes/footer.php");
?>