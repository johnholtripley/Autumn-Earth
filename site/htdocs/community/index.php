<?php


include($_SERVER['DOCUMENT_ROOT']."/includes/session.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/functions.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/header.php");




// Seconds to cache feed (Default : 3 minutes).
$cachetime = 3;
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
  array_push($socialContent,array('<div class="videoWrapper youtube"><iframe width="420" height="315" src="https://www.youtube.com/embed/'.$allYouTubeVideos[$i][0].'?rel=0&amp;showinfo=0&amp;modestbranding=1" frameborder="0" allowfullscreen></iframe></div>',$allYouTubeVideos[$i][1],$allYouTubeVideos[$i][2]));
}
$socialContent = array_merge($socialContent, $tweetsList);
$socialContent = array_merge($socialContent, $allTumblrImages);

// get latest news:
$newsQuery = "select * from tblNews WHERE status='1' order by timeAdded DESC limit 10";
$result = mysql_query($newsQuery) or die ("couldn't execute query");

if (mysql_num_rows($result) > 0) {
  while ($row = mysql_fetch_array($result)) {
    extract($row);
    array_push($socialContent,array('<div class="chronicle"><a href="/chronicle/'.$cleanURL.'/"><h3>'.$newsTitle.'</h3><p>'.$newsSynopsis.'</p></a></div>',strtotime($timeAdded),"chronicle"));
  }
}
// sort by date: 
function sortByDate($a, $b) {
    return $b[1] - $a[1];
}
usort($socialContent, 'sortByDate');





$socialOutput = "";
for ($i=0;$i<count($socialContent);$i++) {


// see if can create some clusters:
  $canDoACluster = false;
  if($i<count($socialContent)-1) {
if($socialContent[$i][2] == "tumblr") {
if($socialContent[$i+1][2] == "chronicle") {



    $socialOutput .= '<div class="masonry-cell masonry-cluster">';
     $socialOutput .= ' <div class="masonry-cluster-cell masonry-cluster-group">';
       $socialOutput .= ' <div class="masonry-cell">';
       
        $socialOutput .= $socialContent[$i][0];
   
       $socialOutput .= ' </div>';
        $socialOutput .= ' <div class="masonry-cell masonry-cluster-cell">';
        $socialOutput .= '  <div class="masonry-panel">';
             $socialOutput .= $socialContent[$i+1][0];
        $socialOutput .= '  </div>';
       $socialOutput .= ' </div>';
     $socialOutput .= ' </div>';
   $socialOutput .= ' </div>';


  $canDoACluster = true;
$i++;
}
}
  }
if(!$canDoACluster) {
  $socialOutput .= '<div class="masonry-cell">';
  $socialOutput .= '<div class="masonry-panel">';
  $socialOutput .= $socialContent[$i][0];
  $socialOutput .= '</div>';
  $socialOutput .= '</div>';
}
}


// Generate a new cache file.
$file = fopen($cache_file, 'w');
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






































<ul>
<?php
include($_SERVER['DOCUMENT_ROOT']."/includes/navigation/community.php");
?>
</ul>







<?php

include($_SERVER['DOCUMENT_ROOT']."/includes/footer.php");
?>
