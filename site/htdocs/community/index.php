<?php


include($_SERVER['DOCUMENT_ROOT']."/includes/session.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/functions.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/header.php");




// Seconds to cache feed (Default : 3 minutes).
$cachetime = 3*60;
$cache_file = $_SERVER['DOCUMENT_ROOT'].'/includes/social.txt';
// Time that the cache was last updtaed.
$cache_file_created  = ((file_exists($cache_file))) ? filemtime($cache_file) : 0;
if (time() - $cachetime < $cache_file_created) {
$socialOutput = stripslashes(file_get_contents($cache_file));
} else {


include($_SERVER['DOCUMENT_ROOT']."/includes/social-apis.php");
display_latest_tweets('autumnearth');

$socialContent = array();
for ($i=0;$i<count($allYouTubeVideos);$i++) {
  array_push($socialContent,array('<div class="videoWrapper youtube"><iframe width="420" height="315" src="https://www.youtube.com/embed/'.$allYouTubeVideos[$i][0].'?rel=0&amp;showinfo=0&amp;modestbranding=1" frameborder="0" allowfullscreen></iframe></div>',$allYouTubeVideos[$i][1]));
}
$socialContent = array_merge($socialContent, $tweetsList);
$socialContent = array_merge($socialContent, $allTumblrImages);

// get latest news:
$newsQuery = "select * from tblNews WHERE status='1' order by timeAdded DESC limit 10";
$result = mysql_query($newsQuery) or die ("couldn't execute query");

if (mysql_num_rows($result) > 0) {
  while ($row = mysql_fetch_array($result)) {
    extract($row);
   
    array_push($socialContent,array('<div class="chronicle"><a href="/chronicle/'.$cleanURL.'/"><h3>'.$newsTitle.'</h3><p>'.$newsSynopsis.'</p></a></div>',strtotime($timeAdded)));
  }
}
// sort by date: 
function sortByDate($a, $b) {
    return $b[1] - $a[1];
}
usort($socialContent, 'sortByDate');





$socialOutput = "";
for ($i=0;$i<count($socialContent);$i++) {

$socialOutput .= '<div class="masonry-cell">';
      $socialOutput .= '<div class="masonry-panel">';

$socialOutput .= $socialContent[$i][0];


$socialOutput .= '</div>';
$socialOutput .= '</div>';

}

// Generate a new cache file.
          $file = fopen($cache_file, 'w');
 
          // Save the contents of output buffer to the file:
          fwrite($file, addslashes($socialOutput)); 
          fclose($file); 
}
?>


<div class="row masonry">  

<?php
  echo $socialOutput;

?>





      

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
