<?php

header('Content-Type: text/xml');

include($_SERVER['DOCUMENT_ROOT']."/includes/session.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/functions.php");






?>
<?xml version="1.0" encoding="UTF-8"?>
<urlset
      xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
            http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">


<url><loc>https://www.autumnearth.com/</loc><priority>1.0</priority></url>
<url><loc>https://www.autumnearth.com/auction/</loc><priority>0.7</priority></url>
<url><loc>https://www.autumnearth.com/community/</loc><priority>0.7</priority></url>
<url><loc>https://www.autumnearth.com/account/join/</loc><priority>0.7</priority></url>





<?php


// get all forum paginated clean urls ####







echo'<url><loc>https://www.autumnearth.com/forum/</loc><priority>0.7</priority></url>'."\n";


// get top level forum clean urls:
$query = "select * from tblforums where tblforums.status>0";
$result = mysql_query( $query ) or die ( "couldn't execute inner query" );
if ( mysql_num_rows( $result )>0 ) {
while ( $row = mysql_fetch_array( $result ) ) {
extract( $row );
echo '<url><loc>https://www.autumnearth.com/forum/'.$cleanURL.'/</loc><priority>0.7</priority></url>'."\n";
}
}


// get all forum clean urls
$query = "select * from tblthreads where tblthreads.status>0";
$result = mysql_query( $query ) or die ( "couldn't execute inner query" );
if ( mysql_num_rows( $result )>0 ) {
while ( $row = mysql_fetch_array( $result ) ) {
extract( $row );
echo '<url><loc>https://www.autumnearth.com/forum/'.$cleanURL.'/</loc><priority>0.5</priority></url>'."\n";

// get pagination URLs:
$query2 = "select tblposts.*, tblthreads.ThreadID FROM tblposts INNER JOIN tblthreads on tblposts.ThreadID = tblthreads.ThreadID WHERE tblposts.ThreadID = " . $threadID;
$result2 = mysql_query($query2) or die ("couldn't execute query3");
$numberofrows2 = mysql_num_rows($result2);
if ($numberofrows2 > 0) {
$totalpages = ceil($numberofrows2/$resultsperpage);
if($totalpages > 1) {
// show pagination URLs
for ($j=2;$j<=$totalpages;$j++) {
	echo '<url><loc>https://www.autumnearth.com/forum/'.$cleanURL.'/'.$j.'/</loc><priority>0.5</priority></url>'."\n";
}

}
}

}
}


// get News
echo'<url><loc>https://www.autumnearth.com/chronicle/</loc><priority>0.7</priority></url>'."\n";
echo'<url><loc>https://www.autumnearth.com/chronicle/archive/</loc><priority>0.7</priority></url>'."\n";
$query = "select * from tblNews";
$result = mysql_query( $query ) or die ( "couldn't execute inner query" );
if ( mysql_num_rows( $result )>0 ) {
while ( $row = mysql_fetch_array( $result ) ) {
extract( $row );
echo '<url><loc>https://www.autumnearth.com/chronicle/'.$cleanURL.'/</loc><priority>0.5</priority></url>'."\n";
}
}

// get Events
echo'<url><loc>https://www.autumnearth.com/events/</loc><priority>0.7</priority></url>'."\n";
$query = "select * from tblEvents";
$result = mysql_query( $query ) or die ( "couldn't execute inner query" );
if ( mysql_num_rows( $result )>0 ) {
while ( $row = mysql_fetch_array( $result ) ) {
extract( $row );
echo '<url><loc>https://www.autumnearth.com/events/'.$cleanURL.'/</loc><priority>0.5</priority></url>'."\n";
}
}



// get top search results pages
$query = "select * from tblSavedSearches order by searchCount DESC LIMIT 10";
$result = mysql_query( $query ) or die ( "couldn't execute inner query" );
if ( mysql_num_rows( $result )>0 ) {
while ( $row = mysql_fetch_array( $result ) ) {
extract( $row );
echo '<url><loc>https://www.autumnearth.com/search/'.cleanURL($searchTerm).'/</loc><priority>0.3</priority></url>'."\n";
}
}


?>

<url><loc>https://www.autumnearth.com/mail/</loc><priority>0.7</priority></url>
	<url><loc>https://www.autumnearth.com/guide/</loc><priority>0.7</priority></url>
<url><loc>https://www.autumnearth.com/the-world/</loc><priority>0.7</priority></url>
<url><loc>https://www.autumnearth.com/contracts/</loc><priority>0.7</priority></url>
	</urlset>

	
	<?php
mysql_close($connection);
?>
