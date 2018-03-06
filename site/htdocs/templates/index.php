<?php
$title="Autumn Earth News";
include($_SERVER['DOCUMENT_ROOT']."/includes/session.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/functions.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/header.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/login.php");

$articleId = $_GET["article"];
// check that a valid number has been passed:

if (!(is_numeric($articleId))) {
// get the most recent news article and display that instead:
$query = "select newsID, status, timeAdded from tblNews WHERE status='1' order by timeAdded DESC limit 1";
$result = mysqli_query($connection, $query) or die ("couldn't execute query");
$row = mysqli_fetch_array($result);
$articleId = $row["newsID"];
} 

	
	//
	// get forum title information:
	$query = "SELECT * FROM tblnews WHERE status ='1' AND newsID = '".$articleId."'";
	$result = mysqli_query($connection, $query) or die ("couldn't execute query");
	
	$numberofrows = mysqli_num_rows($result);
	// check that something is returned
	if ($numberofrows < 1) {
	// get latest news item
	$query = "SELECT * from tblNews WHERE status='1' order by timeAdded DESC limit 1";
	$result = mysqli_query($connection, $query) or die ("couldn't execute query");
	}
		$row = mysqli_fetch_array($result);
		extract($row);
		echo '<h1>'.$newsTitle.'</h1>';
		$timeAdded = strtotime($timeAdded);
		echo '<p>'.date('jS F Y',$timeAdded);
		
		// check for posted by info:
if ($postedBy != "") {
echo ' - posted by '.$postedBy;
}
echo '</p>';
		
		// remove any [CONTINUE] tag
		$newsContent = str_ireplace('[CONTINUE]','',$newsContent);
		echo $newsContent;
	

echo '<p><a href="archive.php" title="News Archive">News Archive</a></p>';


include($_SERVER['DOCUMENT_ROOT']."/includes/footer.php");
?>