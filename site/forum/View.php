<?php

include($_SERVER[DOCUMENT_ROOT]."/includes/signalnoise.php");

$threadID = $_GET["thread"];

if (is_numeric($threadID)) {

	include($_SERVER[DOCUMENT_ROOT]."/includes/connect.php");
	
	// add to thread view count
	$query = "UPDATE tblThreads SET viewCount = viewCount+1 WHERE threadID=" . $threadID;
	$result = mysql_query($query) or die ("couldn't execute query");
	
	include($_SERVER[DOCUMENT_ROOT]."/includes/close.php");
	
	// redirect
	header("Location: ViewThread.php?thread=" . $threadID);

} else {
echo 'not a valid thread id';
}



?>