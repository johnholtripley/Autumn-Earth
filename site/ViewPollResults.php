<?php
$pagetitle="Poll Results";
include($_SERVER['DOCUMENT_ROOT']."/includes/session.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/functions.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/header.php");
?>


<h1>poll results</h1>


<?php
// get total number of votes:

$whichpoll = $_GET["poll"];
if (is_numeric($whichpoll)) {

$query = "select SUM(voteCount) AS totalcount from tblmainpollchoices where pollID='".$whichpoll."'";


$result = mysql_query($query) or die ("couldn't execute query");
$numberofrows = mysql_num_rows($result);
// check that something is returned
if ($numberofrows > 0) {
$row = mysql_fetch_array($result);
$totalnumbervotes = $row['totalcount'];

if ($totalnumbervotes > 0) {

$query2 = "select tblmainpoll.*, tblMainpollchoices.response, tblMainpollchoices.voteCount
from tblmainpoll
inner join tblMainpollchoices on tblMainpollchoices.pollid = tblmainpoll.pollid
where tblmainpoll.isCurrent = true";
$result2 = mysql_query($query2) or die ("couldn't execute query");

$numberofrows2 = mysql_num_rows($result2);
// check that something is returned
if ($numberofrows2 > 0) {
$firsttime = true;
while ($row2 = mysql_fetch_array($result2)) {
				extract($row2);
				if ($firsttime) {
				
				echo'<h3>'.$question.'</h3>';
				
				$firsttime = false;
				}
				
				$percent = floor(($voteCount/$totalnumbervotes)*100);
								
				echo'<p>'.$response.' - '.$percent.'%</p>';
				echo'<div class="BarChart"><img src="/assets/poll/bar_chart.gif" alt="poll results - '.$percent.'%" height="12" width="'.$percent.'" /></div>';
				
				}
				echo'<p>Total number of votes: '.$totalnumbervotes.'</p>';
}

} else {
echo'<p>no voting taken place yet</p>';
}

} else {
echo'<p>not a valid poll</p>';
}

} else {
echo'<p>invalid poll reference</p>';
}


include($_SERVER['DOCUMENT_ROOT']."/includes/close.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/footer.php");
?>