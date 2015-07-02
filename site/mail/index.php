<?php

include($_SERVER['DOCUMENT_ROOT']."/includes/session.inc");
include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/functions.inc");
$pagetitle="Autumn Earth Mail";
$onloadfunc="focusMailClient";
include($_SERVER['DOCUMENT_ROOT']."/includes/header.inc");
include($_SERVER['DOCUMENT_ROOT']."/includes/login.inc");



if(isset($_POST["subbutton"])) {
if ($_POST["subbutton"] == 'archive mail') {
	if (count($_POST) > 1) {
		// (the submit button counts as 1 value)
		foreach ($_POST as $value) {
			if ($value != "unsubscribe" ) {
				// unsubscribe the user from this thread:
				$query = "UPDATE tblMail SET mailRead = '2' WHERE mailID='".$value."'";
				$result = mysql_query($query) or die ("couldn't execute query0");
			}
		}
		echo '<p>you have archived the selected mail item(s)</p>';
	}
}
}





echo'<h1>Mail</h1>';

echo'<p><a href="SendMail.php" title="Send Mail">Send Mail</a> | <a href="Archive.php" title="View your Archive">View Archive</a> | <a href="SentMail.php" title="View your sent mail">View Sent Mail</a></p>';

// ensure that the user is logged in:
if (@$_SESSION['username']) {
	// display mail 

// check for any GET data from mail being sent successfully etc.
if (isset($_GET["action"])) {
	if ($_GET["action"]=="sent") {
		echo '<div class="Notify">Your mail was sent successfully!</div>';
	}
}

$query = "SELECT tblMail.*, tblacct.accountID, tblacct.accountName as useracctid, tblcharacters.charname
FROM tblMail
INNER JOIN tblacct on tblMail.accountID = tblacct.accountID
left join tblcharacters
on tblmail.characterID=tblcharacters.charID
WHERE tblacct.accountName='".$_SESSION['username']."' AND tblMail.mailRead < '2' ORDER BY tblMail.sentTime DESC";



	$result = mysql_query($query) or die ("couldn't execute query2");
	
		$returned = mysql_num_rows($result);
	
	if ($returned > 0) {
	echo'<form name="Mailings" action="' . $thisurl . '" method="post">';
	echo'<table cellspacing="0" cellpadding="0" class="StyledTable">';
	echo'<tr><th>&nbsp;</th><th>To</th><th>From</th><th>Subject</th><th>Date Sent</th><th>move to archive</th></tr>';
	$posti = 0;
	while ($row = mysql_fetch_array($result)) {
		
		extract($row);
		if ($mailRead == '0') {
		echo '<tr class="Unreadmail">';
		} else {
		echo '<tr>';
		}
		
		$sentTime = strtotime($sentTime);
		
		if ($characterID=='0') {
			// use account name:
			$characterID = $_SESSION['username'];
			// ##### show account mail icon
		} else {
			// ############ use character name derived from query
			$characterID = $charname;
			// ##### show character mail icon
		}
		if ($AttachmentType > 0) {
			// show attachment icon
			echo'<td>£</td>';
		} else {
			echo'<td>-</td>';
		}
		echo'<td>'.$characterID.'</td><td>'.$senderName.'</td><td><a href="ViewMail.php?item='.$mailID.'" title="View this mail">'.stripCode($title).'</a></td><td>'.date('jS F Y',$sentTime) .' at '.  date('G.i',$sentTime).'</td><td><input type="checkbox" value="'.$mailID.'" name="mail'.$posti.'" id="mail'.$posti.'" /></td>';
		
		echo '</tr>';
		
		$posti ++;
		
		}
	echo'</table>';
	
	echo'<br /><a href="no_javascript.html" onclick="selectall(\'Mailings\',\'archive mail\');return false;">select all</a> | <a href="no_javascript.html" onclick="unselectall(\'Mailings\',\'archive mail\');return false;">unselect all</a> | ';
		echo '<input type="submit" name="subbutton" value="archive mail" />';
	
	echo'</form>';
	} else {
	echo 'you have no unarchived mail';
	}


} else {
	echo'<div class="Error">You must be logged in to check your mail</div>'."\n";
}


writeFlash('300', '450', '/assets/mail/mailClient.swf', '/assets/mail/mail_client_alt.gif', 'Autumn Earth Mail','MailClient');


include($_SERVER['DOCUMENT_ROOT']."/includes/close.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/footer.inc");
?>