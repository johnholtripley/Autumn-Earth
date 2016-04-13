<?php

include($_SERVER['DOCUMENT_ROOT']."/includes/session.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/functions.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/header.php");

?>
<div class="row">
<div class="column">
<h1>The Herbarium</h1>


<?php




$query = "select * from tblplants WHERE plantUrl = '".$_GET["plant"]."'";
$result = mysql_query($query) or die ("couldn't execute query");

if (mysql_num_rows($result) > 0) {


$row = mysql_fetch_array($result);
extract($row);
?>

<ul class="breadcrumbs">
<li><a href="/herbarium/">The Herbarium</a></li>
<li><?php echo $latinName; ?></li>
</ul>

</div>
</div>


<div class="row" itemscope itemtype="http://schema.org/Thing/Species">
    <div class="medium-6 column">
<img src="/images/herbarium/plants/<?php echo $plantUrl; ?>.jpg" alt="<?php echo $latinName; ?>" itemprop="image">
</div><div class="medium-6 column">
	<h2 itemprop="name"><?php echo $latinName; ?></h2>
	<h3 itemprop="alternateName"><?php echo $commonNames; ?></h3>
	
	<p><?php echo $plantDesc; ?></p>
<p>Catalogued <?php echo lcfirst(relativePastDate( strtotime( $timeCreated ))); ?></p>
<ul id="socialShareLinks">
    <li class="socialTwitter">
    	<?php $urlToShare = urlencode($thisBuiltURL);
    	$imageToShare = urlencode($shareImagePath);
    	$descToShare = urlencode($longDescription);
    	$hashTag = "AutumnEarth";
    	?>
        <a class="popupWindow" target="_blank" href="https://twitter.com/intent/tweet/?url=<?php echo $urlToShare; ?>&amp;hashtags=<?php echo $hashTag; ?>">Share on Twitter</a>
    </li>
    <li class="socialFacebook">
        <a class="popupWindow" target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=<?php echo $urlToShare; ?>">Share on Facebook</a>
    </li>
    <li class="socialGoogle">
        <a class="popupWindow" target="_blank" href="https://plus.google.com/share?url=<?php echo $urlToShare; ?>">Share on Google+</a>
    </li>
    <li class="socialPinterest">
        <a class="largerPopupWindow" target="_blank" href="https://www.pinterest.com/pin/create/button/?url=<?php echo $urlToShare; ?>&amp;media=<?php echo $imageToShare; ?>&amp;description=<?php echo $latinName . " - ".$commonNames; ?>&amp;hashtags=<?php echo $hashTag; ?>">Share on Pinterest</a>
    </li>
  



</ul>
</div>
</div>
<?php
} else {
	
echo "<h2>Sorry, couldn't find that plant</h2>";
    echo "</div>";
	echo "</div>";
	header("HTTP/1.0 404 Not Found");
}

?>









</div>
</div>



<?php

include($_SERVER['DOCUMENT_ROOT']."/includes/footer.php");
?>