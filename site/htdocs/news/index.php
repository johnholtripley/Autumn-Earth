<?php
$title="Autumn Earth News";
include($_SERVER['DOCUMENT_ROOT']."/includes/session.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/functions.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/header.php");

?>
<div class="row">
<div class="column">
<?php
if(isset($_GET["cleaned"])) {
// uses clean URLS - find articleId from the URL

$query = "select newsID, cleanURL from tblnews WHERE cleanURL = '".$_GET["articleName"]."'";
$result = mysql_query($query) or die ("couldn't execute query");

if (mysql_num_rows($result) > 0) {


$row = mysql_fetch_array($result);

$articleId = $row["newsID"];

}

} else {


$articleId = "default";
if(isset($_GET["article"])) {
$articleId = $_GET["article"];
}
}
// check that a valid number has been passed:


if (!(isset($articleId))) {
	$articleId = 'default';
}

if (!(is_numeric($articleId))) {
// get the most recent news article and display that instead:
	header("HTTP/1.0 404 Not Found");
?>
<h1>Whoops</h1>
<p>Couldn't find that Chronicle entry</p>
<h2>Recent entries:</h2>
<?php

$newsQuery = "select * from tblNews WHERE status='1' order by timeAdded DESC limit 4";
$result = mysql_query($newsQuery) or die ("couldn't execute query");
if (mysql_num_rows($result) > 0) {
	echo '<div class="row medium-2up wide-4up equalHeights">';
	while ($row = mysql_fetch_array($result)) {
		extract($row);
		echo '<div class="column"><a href="/chronicle/'.$cleanURL.'/">'.$newsTitle.'</a></div>';
	}
	echo '</div>';
}

} else {

	
	//
	// get forum title information:
	$query = "SELECT * FROM tblnews WHERE status ='1' AND newsID = '".$articleId."'";
	$result = mysql_query($query) or die ("couldn't execute query");
	
	$numberofrows = mysql_num_rows($result);
	// check that something is returned
	if ($numberofrows < 1) {
	// get latest news item
	$query = "SELECT * from tblNews WHERE status='1' order by timeAdded DESC limit 1";
	$result = mysql_query($query) or die ("couldn't execute query");
	}
		$row = mysql_fetch_array($result);
		extract($row);



		echo '<h1>'.$newsTitle.'</h1>';
		$thisArticleAdded = $timeAdded;
		$timeAdded = strtotime($timeAdded);
		echo '<h2>'.date('jS F Y',$timeAdded);
		
		// check for posted by info:
if ($postedBy != "") {
echo ' - posted by '.$postedBy;
}
echo '</h2>';
		
		// remove any [CONTINUE] tag
		$newsContent = str_ireplace('[CONTINUE]','',$newsContent);
		echo $newsContent;
	




// find previous article:

	$query = "SELECT * FROM tblnews WHERE status ='1' AND timeAdded < '".$thisArticleAdded."' order by timeAdded DESC";	
	$result = mysql_query($query) or die ("couldn't execute query");
if (mysql_num_rows($result) > 0) {
	$row = mysql_fetch_array($result);
	extract($row);
	?>
<p><a href="/chronicle/<?php echo $cleanURL; ?>/">Previous article <span>(&quot;<?php echo $newsTitle; ?>&quot;)</span></a></p>
	<?php
}


 
// find next article:

	$query = "SELECT * FROM tblnews WHERE status ='1' AND timeAdded > '".$thisArticleAdded."' order by timeAdded ASC";	
	$result = mysql_query($query) or die ("couldn't execute query");
if (mysql_num_rows($result) > 0) {
	$row = mysql_fetch_array($result);
	extract($row);
	?>
<p><a href="/chronicle/<?php echo $cleanURL; ?>/">Next article <span>(&quot;<?php echo $newsTitle; ?>&quot;)</span></a></p>
	<?php
}


}


echo '<p><a href="/chronicle/archive/" title="The Chronicle Archive">The Chronicle Archives</a></p>';

?>
</div>
</div>

<?php

include($_SERVER['DOCUMENT_ROOT']."/includes/footer.php");
?>