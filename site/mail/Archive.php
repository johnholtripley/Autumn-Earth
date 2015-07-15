<?php

include($_SERVER['DOCUMENT_ROOT']."/includes/session.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/functions.php");
$pagetitle="Autumn Earth Mail";
include($_SERVER['DOCUMENT_ROOT']."/includes/header.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/login.php");




echo'<h1>Mail</h1>';

echo'<p><a href="SendMail.php" title="Send Mail">Send Mail</a> | <a href="/mail/" title="View your Mail">View Mail</a> | <a href="SentMail.php" title="View your sent mail">View Sent Mail</a></p>';

// ensure that the user is logged in:
if (@$_SESSION['username']) {
	// display mail 


$query = "SELECT tblMail.*, tblacct.accountID, tblacct.accountName as useracctid, tblcharacters.charname
FROM tblMail
INNER JOIN tblacct on tblMail.accountID = tblacct.accountID
left join tblcharacters
on tblmail.characterID=tblcharacters.charID
WHERE tblacct.accountName='".$_SESSION['username']."' AND tblMail.mailRead = '2' ORDER BY tblMail.sentTime DESC";
	$result = mysql_query($query) or die ("couldn't execute query2");
	
		$returned = mysql_num_rows($result);
	
	if ($returned > 0) {
	
	echo'<table cellspacing="0" cellpadding="0" class="StyledTable">';
	echo'<tr><th>&nbsp;</th><th>To</th><th>From</th><th>Subject</th><th>Date Sent</th></tr>';

	while ($row = mysql_fetch_array($result)) {
		extract($row);

		echo '<tr>';
	
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
		
		echo'<td>'.$characterID.'</td><td>'.$senderName.'</td><td><a href="ViewMail.php?item='.$mailID.'" title="View this mail">'.stripCode($title).'</a></td><td>'.date('jS F Y',$sentTime) .' at '.  date('G.i',$sentTime).'</td>';
		
		echo '</tr>';
		
	
		
		}
	echo'</table>';
	
	
	} else {
	echo 'you have no archived mail';
	}


} else {
	echo'<div class="Error">You must be logged in to view your archive</div>';
}


include($_SERVER['DOCUMENT_ROOT']."/includes/close.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/footer.php");
?>