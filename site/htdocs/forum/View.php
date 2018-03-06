<?php

include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");

$threadID = $_GET["thread"];

if (is_numeric($threadID)) {

	include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");
	
	// add to thread view count
	$query = "UPDATE tblthreads SET viewcount = viewcount+1 WHERE threadid=" . $threadID;
	$result = mysqli_query($connection, $query) or die ("couldn't execute query");
	
	
	
	// redirect
	header("Location: ViewThread.php?thread=" . $threadID);

} else {
echo 'not a valid thread id';
}



?>