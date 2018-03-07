<?php

include($_SERVER['DOCUMENT_ROOT']."/includes/session.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/functions.php");
$pagetitle="Autumn Earth Mail";
include($_SERVER['DOCUMENT_ROOT']."/includes/header.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/login.php");




echo'<h1>Sent Mail</h1>';

echo'<p><a href="SendMail.php" title="Send Mail">Send Mail</a> | <a href="/mail/" title="View your Mail">View Mail</a></p>';

// ensure that the user is logged in:
if (@$_SESSION['username']) {
	// display mail 



// get sender account id
	
	
	$query = "SELECT * from tblacct WHERE accountName='".$_SESSION['username']."'";
	$result = mysqli_query($connection, $query) or die ("couldn't execute query");
			$returned = mysqli_num_rows($result);
			if ($returned > 0) {
			$row = mysqli_fetch_array($result);
			extract($row);
			$senderid = $accountID;
			}



$query = "SELECT tblMail.*, tblacct.accountID, tblacct.accountName as sentuser
FROM tblMail
INNER JOIN tblacct on tblMail.accountID = tblacct.accountID
WHERE tblMail.senderID='".$senderid."' ORDER BY tblMail.sentTime DESC ";
	$result = mysqli_query($connection, $query) or die ("couldn't execute query2");
	
		$returned = mysqli_num_rows($result);
	
	if ($returned > 0) {
	
	echo'<table cellspacing="0" cellpadding="0" class="StyledTable">';
	echo'<tr><th>To</th><th>Subject</th><th>Date Sent</th></tr>';

	while ($row = mysqli_fetch_array($result)) {
		extract($row);

		echo '<tr>';
	
		$sentTime = strtotime($sentTime);
		
	
		
		echo'<td>'.$sentuser.'</td><td><a href="ViewMail.php?item='.$mailID.'" title="View this mail">'.stripCode($title).'</a></td><td>'.date('jS F Y',$sentTime) .' at '.  date('G.i',$sentTime).'</td>';
		
		echo '</tr>';
		
	
		
		}
	echo'</table>';
	
	
	} else {
	echo 'you have no archived mail';
	}


} else {
	echo'<div class="Error">You must be logged in to view your sent items</div>';
}



include($_SERVER['DOCUMENT_ROOT']."/includes/footer.php");
?>