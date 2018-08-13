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

$query = "select newsid, cleanurl from tblnews WHERE cleanurl = '".$_GET["articleName"]."'";
$result = mysqli_query($connection, $query) or die ("couldn't execute query");

if (mysqli_num_rows($result) > 0) {


$row = mysqli_fetch_array($result);

$articleId = $row["newsid"];

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

$newsQuery = "select * from tblnews WHERE status='1' order by timeadded DESC limit 4";
$result = mysqli_query($connection, $newsQuery) or die ("couldn't execute query");
if (mysqli_num_rows($result) > 0) {
	echo '<div class="row medium-2up wide-4up equalHeights">';
	while ($row = mysqli_fetch_array($result)) {
		extract($row);
		echo '<div class="column"><a href="/chronicle/'.$cleanURL.'/">'.$newsTitle.'</a></div>';
	}
	echo '</div>';
}

} else {

	
	//
	
	$query = "SELECT * FROM tblnews WHERE status ='1' AND newsid = '".$articleId."'";
	$result = mysqli_query($connection, $query) or die ("couldn't execute query");
	
	$numberofrows = mysqli_num_rows($result);
	// check that something is returned
	if ($numberofrows < 1) {
	// get latest news item
	$query = "SELECT * from tblnews WHERE status='1' order by timeadded DESC limit 1";
	$result = mysqli_query($connection, $query) or die ("couldn't execute query");
	}
		$row = mysqli_fetch_array($result);
		extract($row);

?>
<div itemscope itemtype="http://schema.org/NewsArticle">
  <meta itemscope itemprop="mainEntityOfPage"  itemType="https://schema.org/WebPage" itemid="https://google.com/article"/>
<div itemprop="publisher" itemscope itemtype="https://schema.org/Organization">
	<meta itemprop="name" content="The Autumn Earth Chronicle">
   <div itemprop="logo" itemscope itemtype="https://schema.org/ImageObject">
      <img src="/images/the-chronicle.png">
      <meta itemprop="url" content="https://www.autumnearth.com/images/the-chronicle.png">
      <meta itemprop="width" content="233">
      <meta itemprop="height" content="64">
    </div>

</div>
<?php

		echo '<h1 itemprop="headline">'.$newsTitle.'</h1>';
		$thisArticleAdded = $timeAdded;
		$timeAdded = strtotime($timeAdded);
		echo '<h2>'.date('jS F Y',$timeAdded).'</h2>';
		echo'<meta itemprop="datePublished" content="'.date('Y-m-d\TH:i:sO',$timeAdded).'">';
		echo'<meta itemprop="dateModified" content="'.date('Y-m-d\TH:i:sO',$timeAdded).'">';

		// check for posted by info:
if ($postedBy != "") {
echo '<h3 itemprop="author" itemscope itemtype="https://schema.org/Person">posted by <span itemprop="name">'.$postedBy.'</span></h3>';
}


if($bannerContent != "") {

$size = getimagesize($_SERVER['DOCUMENT_ROOT'].'/images/banners/'.$bannerContent);

	?>
<div itemprop="image" itemscope itemtype="https://schema.org/ImageObject">
    <img src="/images/banners/<?php echo $bannerContent; ?>" alt="">
    <meta itemprop="url" content="https://www.autumnearth.com/images/banners/<?php echo $bannerContent; ?>">
<meta itemprop="width" content="<?php echo $size[0]; ?>">
      <meta itemprop="height" content="<?php echo $size[1]; ?>">

  </div>

	<?php
}
		
		// remove any [CONTINUE] tag
		$newsContent = str_ireplace('[CONTINUE]','',$newsContent);
		// use article element to help trigger Reader Mode (https://erikrunyon.com/2018/06/designing-web-content-for-watchos/)
		echo '<article itemprop="description">'.$newsContent.'</article>';
	
?>

</div>

<?php $urlToShare = urlencode($thisBuiltURL); ?>
<p><a class="shareLink" target="_blank" href="https://twitter.com/intent/tweet/?url=<?php echo $urlToShare; ?>">Share</a></p>


<?php




// find previous article:

	$query = "SELECT * FROM tblnews WHERE status ='1' AND timeadded < '".$thisArticleAdded."' order by timeadded DESC";	
	$result = mysqli_query($connection, $query) or die ("couldn't execute query");
if (mysqli_num_rows($result) > 0) {
	$row = mysqli_fetch_array($result);
	extract($row);
	?>
<p><a href="/chronicle/<?php echo $cleanURL; ?>/">Previous article <span>(&quot;<?php echo $newsTitle; ?>&quot;)</span></a></p>
	<?php
}


 
// find next article:

	$query = "SELECT * FROM tblnews WHERE status ='1' AND timeadded > '".$thisArticleAdded."' order by timeadded ASC";	
	$result = mysqli_query($connection, $query) or die ("couldn't execute query");
if (mysqli_num_rows($result) > 0) {
	$row = mysqli_fetch_array($result);
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