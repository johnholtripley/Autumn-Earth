<?php
include_once($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include_once($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");
include_once($_SERVER['DOCUMENT_ROOT']."/includes/functions.php");


$query = "select * from tblplants WHERE planturl = '".$_GET["plant"]."'";
$result = mysql_query($query) or die ("couldn't execute query");

if (mysql_num_rows($result) > 0) {
$row = mysql_fetch_array($result);
extract($row);
?>

<div class="row" itemscope itemtype="http://schema.org/Thing/Species">
    <div class="medium-6 column">



<?php

picture('/images/herbarium/plants/'.$plantUrl.'.jpg', $latinName, array(300,604), true, ' itemprop="image"');
?>
</div><div class="medium-6 column">
	<h2 itemprop="name"><?php echo $latinName; ?></h2>
	<h3>
        <?php
$allCommonNames = explode("/",$commonNamesJoined);
for ($i=0; $i<count($allCommonNames);$i++) {
    echo '<span itemprop="alternateName">'.$allCommonNames[$i].'</span>';
    if(count($allCommonNames)>1) {
    if($i == count($allCommonNames)-2) {
echo ' or ';
    } else if($i != count($allCommonNames)-1) {
    echo ', ';
}
}
}
        ?>
    </h3>
	<p><?php echo $plantDesc; ?></p>
<?php
// see if any plants are related - same genus and identical night and aquatic flags:
// get Genus:
$latinNameSplit = explode(" ", $latinName);
$genus = $latinNameSplit[0];
$query = "SELECT planturl AS relatedplanturl, commonnamesjoined AS relatedcommonnamesjoined FROM tblplants WHERE latinname REGEXP '^(".$genus.")' AND isaquatic='".$isAquatic."' AND isnight='".$isNight."' AND plantid!='".$plantID."'";

$result = mysql_query($query) or die ("couldn't execute query");
if (mysql_num_rows($result) > 0) {
$row = mysql_fetch_array($result);
extract($row);
$relatedCommonNameSplit = explode("/", $relatedCommonNamesJoined);
echo '<p>Related to <a href="/herbarium/'.$relatedPlantUrl.'">'.$relatedCommonNameSplit[0].'</a>.</p>';
}
?>


<p>Catalogued <?php echo lcfirst(relativePastDate(strtotime($timeCreated))); ?>.</p>




<ul id="socialShareLinks">
    <li class="socialTwitter">

<?php
$thisBuiltURL = "https://www.autumnearth.com/herbarium/".$plantUrl."/";
			$pagetitle = $latinName.' - ' .$commonNames. ' - Autumn Earth Herbarium';
			$shareImagePath = 'https://www.autumnearth.com/images/herbarium/plants/'.$plantUrl.'.jpg';
			$longDescription = $plantDesc;

         $urlToShare = urlencode($thisBuiltURL);
        $imageToShare = urlencode($shareImagePath);
        $descToShare = urlencode($latinName . " - ".$commonNames." - ".$longDescription);
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
        <li class="socialTumblr">
        <a class="popupWindow" target="_blank" href="https://tumblr.com/widgets/share/tool?canonicalUrl=<?php echo $urlToShare; ?>&amp;posttype=photo&amp;caption=<?php echo $descToShare; ?>&amp;content=<?php echo $shareImagePath; ?>">Share on Tumblr</a>
    </li>
    <li class="socialPinterest">
        <a class="largerPopupWindow" target="_blank" href="https://www.pinterest.com/pin/create/button/?url=<?php echo $urlToShare; ?>&amp;media=<?php echo $imageToShare; ?>&amp;description=<?php echo $descToShare; ?>&amp;hashtags=<?php echo $hashTag; ?>">Share on Pinterest</a>
    </li>
<li class="socialReddit">
        <a target="_blank" href="https://www.reddit.com/submit?url=<?php echo $urlToShare; ?>">Share on Reddit</a>
    </li>




</ul>
</div>
</div>

<?php

}

?>