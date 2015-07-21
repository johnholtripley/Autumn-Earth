<?php
include($_SERVER['DOCUMENT_ROOT']."/includes/session.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/functions.php");
$pagetitle="Manage Subscriptions";
$jsinclude="core";
include($_SERVER['DOCUMENT_ROOT']."/includes/header.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/login.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/search.php");
?>

<h1>Manage Subscriptions</h1>
<?php


// check if username exists in session or they've just logged in:
if (@$_SESSION['username']) {

	// get user's account ID:
	$query = "select * from tblacct where accountName='".$_SESSION['username']."'";
	$result = mysql_query($query) or die ("couldn't execute query1");
	$row = mysql_fetch_array($result);
	extract ($row);
	
	
	// check user status and output approriate message:

	$receivingemails = "";
	if ($emailalerts == '0') {
		$receivingemails = "not ";
	}
	echo'<p>You are currently '.$receivingemails.'receiving email notifications whenever these threads have new posts.<br />This setting can be changed in the <a href="ManageAccount.php" title="click to manage your account">account management</a> page.</p>';
	
	// check if the user is subscribing to a new thread:
	if (isset($_GET["subscribe"])) {

	$subscribethread = $_GET["subscribe"];
		if (is_numeric($subscribethread)) {
			// check if they are already subscribed:
			$query = "select * from tblsubscribedthreads where accountID='".$accountID."' AND threadID='".$subscribethread."'";
			$result = mysql_query($query) or die ("couldn't execute query3");
			$numberofrows = mysql_num_rows($result);
			if ($numberofrows > 0) {
				echo '<p>you are already subscribed to this thread</p>';
			} else {
				$query = "insert into tblsubscribedthreads (accountID, threadID, status)
				values ('".$accountID."','".$subscribethread."','0')";
				$result = mysql_query($query) or die ("couldn't execute query4");
				echo '<p>you have been subscribed to this thread</p>';
			}
		}
	} else if ($_POST["subbutton"] == 'unsubscribe') {
	
	if (count($_POST) > 1) {
	// (the submit button counts as 1 value)
		foreach ($_POST as $value) {
		if ($value != "unsubscribe" ) {
			// unsubscribe the user from this thread:
			$query = "DELETE FROM tblsubscribedthreads WHERE subthreadID='".$value."'";
			$result = mysql_query($query) or die ("couldn't execute query5");
		}
		}
		echo '<p>you have been removed from the selected thread(s)</p>';
	}
	
	}
	
	// get list of subscribed threads:
	$query = "select tblSubscribedThreads.*, tblThreads.title AS threadTitle, tblThreads.latestPostID
	FROM tblSubscribedThreads
	INNER JOIN tblThreads on tblSubscribedThreads.threadID = tblthreads.ThreadID
	WHERE tblSubscribedThreads.accountID = ".$accountID." ORDER BY tblThreads.latestPostID";
	$result = mysql_query($query) or die ("couldn't execute query2");
	
	$numberofrows = mysql_num_rows($result);
	// check that something is returned
	if ($numberofrows > 0) {
	
	$thisposturl = $_SERVER['PHP_SELF'];
	// remove any GET data as this will have been handled by now
	echo'<form name="Subscriptions" action="' . $thisposturl . '" method="post">';
	
		echo'<table cellspacing="0" cellpadding="0" class="StyledTable" summary="This table displays the threads that are currently subscribed to">';
		// display output:
		$checkcounter = 0;
		while ($row = mysql_fetch_array($result)) {
		echo'<tr>';
		extract($row);
		echo '<td>'.$threadTitle.'</td>'.'<td>';
		
		
		echo '<input type="checkbox" value="'.$subthreadID.'" name="unsub'.$checkcounter.'" id="unsub'.$checkcounter.'" />';
		echo '<label for="unsub'.$checkcounter.'"> unsubscribe</label> ';
		echo'</td></tr>';
	
		$checkcounter ++;
	
		}
		echo'</table>';
		echo'<a href="no_javascript.html" onclick="selectall(\'Subscriptions\',\'unsubscribe\');return false;">select all</a> | <a href="no_javascript.html" onclick="unselectall(\'Subscriptions\',\'unsubscribe\');return false;">unselect all</a><br />';
		echo '<input type="submit" name="subbutton" value="unsubscribe" />';
		
		echo'</form>';
	} else {
		echo '<p>you have no subscriptions at present</p>';
	}

} else {
	echo '<div class="Error">you must be logged in to manage your subscriptions</div>';
}


include($_SERVER['DOCUMENT_ROOT']."/includes/footer.php");
?>
