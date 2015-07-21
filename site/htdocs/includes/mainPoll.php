
<hr />
<h3>current poll</h3>

<?php



$query = "select tblmainpoll.*, tblMainpollchoices.response, tblMainpollchoices.choiceID
from tblmainpoll
inner join tblMainpollchoices on tblMainpollchoices.pollid = tblmainpoll.pollid
where tblmainpoll.isCurrent = true";
$result = mysql_query($query) or die ("couldn't execute query");

$numberofrows = mysql_num_rows($result);
// check that something is returned
if ($numberofrows > 0) {
$firsttime = true;
while ($row = mysql_fetch_array($result)) {
				extract($row);
				if ($firsttime) {
				// output form head:
				echo'<form name="pollForm" id="pollForm" method="post" action="'.$thisurl.'">'."\n";
				echo'<p>'.$question.'</p>'."\n";
				echo'<input type="radio" name="pollOption" checked="checked" id="pollOption'.$choiceID.'" value="'.$choiceID.'" /> <label for="pollOption'.$choiceID.'">'.$response.'</label><br />'."\n";
				$firsttime = false;
				} else {
				
				echo'<input type="radio" name="pollOption" id="pollOption'.$choiceID.'" value="'.$choiceID.'" /> <label for="pollOption'.$choiceID.'">'.$response.'</label><br />'."\n";
				}
				
				}

echo'<input type="hidden" name="pollID" value="'.$pollID.'" />'."\n";
echo'<input type="submit" name="mainPollButton" value="Vote" />'."\n";
echo'</form>'."\n";
echo'<p><a href="ViewPollResults.php?poll='.$pollID.'" title="display the results for this poll">show results</a></p>'."\n";
} else {
echo '<p>No poll currently</p>'."\n";
}



?>

<hr />