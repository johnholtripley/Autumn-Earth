<?php


include($_SERVER['DOCUMENT_ROOT']."/includes/session.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/functions.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/header.php");





?>
<div class="row">
	<div class="column">
		<p style="text-align:center;margin: 3% auto;"><a href="/game-world/" class="button">Enter the world</a></p>
	</div>
	</div>
<div class="row medium-2up wide-4up equalHeights">

	<div class="column"><div><h4>Latest forum threads with new posts</h4>


<?php


$forumQuery = "select * from tblthreads where tblthreads.status>0 order by tblthreads.creationtime DESC limit 5";
$result = mysql_query($forumQuery) or die ("couldn't execute query");

if (mysql_num_rows($result) > 0) {

	echo "<ul>";
	while ($row = mysql_fetch_array($result)) {
		extract($row);
		echo '<li><a href="/forum/'.$cleanURL.'/">'.$title.'</a></li>';
	}
	echo "</ul>";
}
?>
</div></div>

<div class="column"><div><h4>Latest community pages</h4>
<?php
// find all publically visible pages, group by guild and show a list of clean URLs for them:

$communityQuery = "select tblguilds.*, tblfreeformpages.*, tblguilds.cleanurl as guildURL, tblfreeformpages.cleanurl as pageURL from tblfreeformpages inner join tblguilds on tblfreeformpages.guildid = tblguilds.guildid WHERE tblfreeformpages.public='1' order by tblfreeformpages.creationtime DESC limit 5";

$result = mysql_query($communityQuery) or die ("couldn't execute query");

if (mysql_num_rows($result) > 0) {

	echo "<ul>";



	while ($row = mysql_fetch_array($result)) {

		extract($row);




		echo '<li><a href="/community/'.$guildURL.'/'.$pageURL.'/">'.$guildName.' - '.$freeformPageTitle.'</a></li>';

	}

	echo "</ul>";

}

?>
</div></div>

<div class="column"><div>
<h4>Latest from the Chronicle</h4>
<?php
$newsQuery = "select * from tblnews WHERE status='1' order by timeadded DESC limit 5";
$result = mysql_query($newsQuery) or die ("couldn't execute query");

if (mysql_num_rows($result) > 0) {
	echo "<ul>";
	while ($row = mysql_fetch_array($result)) {
		extract($row);
		echo '<li><a href="/chronicle/'.$cleanURL.'/">'.$newsTitle.'</a></li>';





	}
	echo "</ul>";

}
?>
<p>More <a href="/chronicle/">Chronicle articles</a></p>
</div></div>

<div class="column" id="homeEventsList"><div><h4>Upcoming Events</h4>
	<?php
displayUpcomingEvents(5);
?>
</div></div>

</div>



<div class="row medium-2up wide-4up widest-5up equalHeights">



<div class="column"><div><h4>Auction items ending soon</h4>
	<?php
displayAuctionItemsEndingSoon(3);
?>
</div></div>

<div class="column"><div><h4>new Auction items</h4>
	<?php
displayAuctionNewestItems(3);
?>
</div></div>

<div class="column"><div>	<h4>New contracts</h4>

<?php
displayContractNewestItems(3);
?>

</div></div>


<div class="column"><div>	<h4>Contracts ending soon</h4>

<?php
displayContractItemsEndingSoon(3);
?>

</div></div>





<div class="column"><div><h4>Deepest delvers</h4>
	<?php
displayDeepestDelvers();
?>
</div></div>



</div>









<?php

include($_SERVER['DOCUMENT_ROOT']."/includes/footer.php");
?>
