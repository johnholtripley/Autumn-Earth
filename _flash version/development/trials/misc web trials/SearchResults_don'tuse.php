<?php
include("includes/session.inc");
$title="Search Results";
include("includes/header.inc");

echo '<h1>Search Results</h1>';

include("includes/signalnoise.php");
include("includes/connect.php");
include("includes/parseCode.inc");
include("includes/login.inc");
include("includes/search.inc");

$searchterms = $_GET["searchterms"];



if ($searchterms == "") {
echo '<div class="Error">No search terms entered</div>';
} else {

// replace any single or double quotes with 2 _ so that the term is matched (quotes are escaped so will be two characters:
$searchterms = str_replace("\'","__",$searchterms);
$searchterms = str_replace('\"','__',$searchterms);


addslashes(htmlspecialchars(trim($searchterms)));

$query = "select tblposts.*, tblthreads.title AS threadtitle
FROM tblposts
INNER JOIN tblthreads on tblposts.threadid = tblthreads.threadid
where tblposts.postContent like '%".$searchterms."%' AND tblposts.status>0";
$result = mysql_query($query) or die ("couldn't execute query1");



$numberofrows = mysql_num_rows($result);
// check that something is returned
if ($numberofrows > 0) {

while ($row = mysql_fetch_array($result)) {

// show these results
extract($row);

$thispostcontent = stripslashes($postContent);




$thispostcontent = str_replace(stripslashes($_GET["searchterms"]),'<span class="Highlight">'.stripslashes($_GET["searchterms"]).'</span>',$thispostcontent);
echo '<p><strong>'.stripslashes($threadtitle).'</strong> - <a href="ViewThread.php?thread='.$threadID.'" title="Click to view this thread">view this thread</a><br />'.$thispostcontent.'</p>';
}

} else {
echo '<div class="Error">No results found matching '.$_GET["searchterms"].'</div>';
}

}
	
	


include("includes/close.php");
include("includes/footer.inc");
?>