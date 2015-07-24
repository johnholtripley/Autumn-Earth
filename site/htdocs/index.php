<?php

include($_SERVER['DOCUMENT_ROOT']."/includes/session.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/functions.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/header.php");





?>

<div class="row medium-2up wide-4up equalHeights">

	<div class="column"><div><h2>Latest forum threads with new posts</h2>


<?php


$forumQuery = "select * from tblthreads where tblthreads.status>0 order by tblthreads.CreationTime DESC limit 5";
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

<div class="column"><div><h2>Latest community pages</h2>
<?php
// find all publically visible pages, group by guild and show a list of clean URLs for them:

$communityQuery = "select tblguilds.*, tblfreeformpages.*, tblguilds.cleanURL as guildURL, tblfreeformpages.cleanURL as pageURL from tblFreeformPages inner join tblGuilds on tblFreeformPages.guildID = tblGuilds.guildID WHERE tblFreeformPages.public='1' order by tblfreeformpages.creationTime DESC limit 5";

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
<h2>Latest news</h2>
<?php
$newsQuery = "select * from tblNews WHERE status='1' order by timeAdded DESC limit 5";
$result = mysql_query($newsQuery) or die ("couldn't execute query");

if (mysql_num_rows($result) > 0) {
echo "<ul>";
while ($row = mysql_fetch_array($result)) {
extract($row);
echo '<li><a href="/news/'.$cleanURL.'/">'.$newsTitle.'</a></li>';


	


}
echo "</ul>";

}
?>
</div></div>

<div class="column"><div><h2>Upcoming Events</h2>
	<?php
displayUpcomingEvents(3);
?>
</div></div>

</div>



<div class="row medium-2up wide-4up widest-5up equalHeights">



<div class="column"><div><h2>Auction items ending soon</h2>
	<?php
	displayAuctionItemsEndingSoon(3);
	?>
</div></div>

<div class="column"><div><h2>new Auction items</h2>
	<?php
displayAuctionNewestItems(3);
	?>
</div></div>

<div class="column"><div>	<h2>New contracts</h2>

<?php
displayContractNewestItems(3);
	?>

</div></div>


<div class="column"><div>	<h2>Contracts ending soon</h2>

<?php
displayContractItemsEndingSoon(3);
	?>

</div></div>





<div class="column"><div><h2>Deepest delvers</h2>
	<?php
displayDeepestDelvers();
	?>
</div></div>



</div>








</div>





<?php
/*
echo '<!-- <script type="text/javascript" src="http://static.ak.connect.facebook.com/js/api_lib/v0.4/FeatureLoader.js.php/en_US"></script><script type="text/javascript">FB.init("f36928a0f3b8ccc280a3097b8894147a");</script><fb:fan profile_id="141824743233" stream="1" connections="10" width="300"></fb:fan><div style="font-size:8px; padding-left:10px"><a href="http://www.facebook.com/pages/Autumn-Earth/141824743233">Autumn Earth on Facebook</a> </div> /--> ';
*/



include($_SERVER['DOCUMENT_ROOT']."/includes/footer.php");
?>