<?php

include($_SERVER['DOCUMENT_ROOT']."/includes/session.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/functions.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/header.php");



?>

<h1>forum page</h1>



<?php

$query = "SELECT * FROM tblforums ORDER BY title";
$result = mysql_query($query) or die ("couldn't execute query");

while ($row = mysql_fetch_array($result)) {
	extract($row);
	
	if ($status > 0) {
		// if the forum is live:
		echo '<h2>' . stripslashes($title) . '</h2>'."\n";
//		echo '<img src="' . $imagePath . '" width="24" height="24" class="forumIcon" alt="" />'."\n"; 
		echo '<p>' . stripslashes($description);
		echo '<br />'."\n";
		echo '<a href="/forum/'. $cleanURL .'/" title="click to view the ' . $title . ' forum">click to view forum...</a>'."\n";
		echo '</p>'."\n";
	
	}

}

include("../includes/footer.php");
?>