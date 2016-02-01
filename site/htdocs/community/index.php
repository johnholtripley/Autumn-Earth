<?php


include($_SERVER['DOCUMENT_ROOT']."/includes/session.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/functions.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/header.php");





?>


















<div class="row masonry">  
    <div class="masonry-cell">
      <div class="masonry-panel">
        <h1>Here is a masonry layout.</h1>
      </div>
    </div>

<div class="masonry-cell">
      <div class="masonry-panel">
        	<img src="http://placekitten.com.s3.amazonaws.com/homepage-samples/408/287.jpg">
        </div>
      </div>






<div class="masonry-cell">
      <div class="masonry-panel">
        	<img src="http://placekitten.com.s3.amazonaws.com/homepage-samples/408/287.jpg">
        </div>
      </div>



<div class="masonry-cell">
      <div class="masonry-panel">
<div class="videoWrapper" style="padding-bottom: 60.88%;">
  <video preload="auto" controls="controls" muted="muted" poster="/images/placeholder.jpg">
    <source src="/videos/placeholder.mp4" type="video/mp4"></source>
    <source src="/videos/placeholder.webm" type="video/webm"></source>
    <source src="/videos/placeholder.ogv" type="video/ogg"></source>
  </video>
</div>
     </div>
      </div>

    <div class="masonry-cell masonry-cluster">
      <div class="masonry-cluster-cell masonry-cluster-group">
        <div class="masonry-cell">
        	<img src="http://placekitten.com.s3.amazonaws.com/homepage-samples/408/287.jpg">
        </div>
         <div class="masonry-cell masonry-cluster-cell">
          <div class="masonry-panel">
            <p>horiz cluster</p>
          </div>
        </div>
      </div>
      
    </div>


    <div class="masonry-cell">
      <div class="masonry-panel">
        <h3>That's pretty cool, thanks for showing me.</h3>
      </div>
    </div>

    
    <div class="masonry-cell masonry-vertical-cluster">
      <div class="masonry-cluster-cell masonry-cluster-group">
        <div class="masonry-cell"><img src="http://placekitten.com.s3.amazonaws.com/homepage-samples/96/139.jpg"></div>
      </div>
      <div class="masonry-cluster-cell masonry-cluster-group">
        <div class="masonry-cell masonry-cluster-cell">
          <div class="masonry-panel">
            <p>VERTICAL This is an image, it's quite nice.</p>
          </div>
        </div>
        <div class="masonry-cell masonry-cluster-cell">
          <div class="masonry-panel"><p><a href="#">Click here to find out more.</a></p></div>
        </div>
      </div>
    </div>
    
    <div class="masonry-cell">
      <div class="masonry-panel">
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis eu justo ex. Praesent mollis augue sagittis eros pharetra feugiat. Phasellus dignissim est lacus. Sed nec imperdiet dolor, sit amet mattis ex.</p>
      </div>
    </div>
    <div class="masonry-cell">
      <div class="masonry-panel">
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis eu justo ex. Praesent mollis augue sagittis eros pharetra feugiat. Phasellus dignissim est lacus. Sed nec imperdiet dolor, sit amet mattis ex. Sed sed augue eu neque tristique commodo. Mauris aliquet tortor sollicitudin nibh molestie, id egestas nisl sollicitudin.</p><p>Aliquam erat volutpat. Donec quis ultrices ligula. Cras sed purus risus. Curabitur quis eros eu tortor semper eleifend. Pellentesque lorem elit, dignissim interdum massa id, malesuada rutrum ligula. Suspendisse tempor quis mauris eu facilisis. Phasellus non volutpat diam, non dapibus ligula. Ut non molestie ex, nec sagittis mi. Curabitur suscipit tellus id dolor pretium blandit. Cras tristique tristique pharetra.</p>
      </div>
    </div>
    <div class="masonry-cell">
      <div class="masonry-panel">
        <h2>Some post about something</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis eu justo ex. Praesent mollis augue sagittis eros pharetra feugiat. Phasellus dignissim est lacus. Sed nec imperdiet dolor, sit amet mattis ex. Sed sed augue eu neque tristique commodo. Mauris aliquet tortor sollicitudin nibh molestie, id egestas nisl sollicitudin. Aliquam erat volutpat. Donec quis ultrices ligula. Cras sed purus risus. Curabitur quis eros eu tortor semper eleifend.</p>
      </div>
    </div>
    <div class="masonry-cell"><img src="http://placekitten.com.s3.amazonaws.com/homepage-samples/408/287.jpg"></div>
    <div class="masonry-cell">
      <div class="masonry-panel">
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis eu justo ex. Praesent mollis augue sagittis eros pharetra feugiat. Phasellus dignissim est lacus. Sed nec imperdiet dolor, sit amet mattis ex.</p>
      </div>
    </div>
    <div class="masonry-cell"><img src="http://placekitten.com.s3.amazonaws.com/homepage-samples/408/287.jpg"></div>
    
  </div>









































<div class="row medium-2up wide-4up equalHeights">

	<div class="column"><div><h4>Latest forum threads with new posts</h4>


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

<div class="column"><div><h4>Latest community pages</h4>
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
<h4>Latest from the Chronicle</h4>
<?php
$newsQuery = "select * from tblNews WHERE status='1' order by timeAdded DESC limit 5";
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
</div></div>

<div class="column"><div><h4>Upcoming Events</h4>
	<?php
displayUpcomingEvents(3);
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
