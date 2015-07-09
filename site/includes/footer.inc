

<ul>
<li><a href="/forum/">Forum</a></li>
<li><a href="/auction/">Auction</a></li>
<li><a href="/mail/">Mail</a></li>
<li><a href="/news/">News</a></li>

</ul>

<h5>Community pages</h5>


<?php
// find all publically visible pages, group by guild and show a list of clean URLs for them:

$communityQuery = "select tblguilds.*, tblfreeformpages.*, tblguilds.cleanURL as guildURL, tblfreeformpages.cleanURL as pageURL from tblFreeformPages inner join tblGuilds on tblFreeformPages.guildID = tblGuilds.guildID WHERE tblFreeformPages.public='1'";

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


<h5>news pages</h5>
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

</div>
</body>
</html>
<?php
mysql_close($connection);
?>