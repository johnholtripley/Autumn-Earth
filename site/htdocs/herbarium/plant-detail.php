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

<?php


?>

<img src="<?php echo $fullSitePath; ?>/images/herbarium/plants/<?php echo $plantUrl; ?>.jpg" alt="<?php echo $latinName; ?>" itemprop="image">
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
<p>Catalogued <?php echo lcfirst(relativePastDate( strtotime( $timeCreated ))); ?></p>


<?php

 $urlToShare = urlencode($thisBuiltURL);
 $imageToShare = urlencode($shareImagePath);
 $descToShare = urlencode($latinName . " - ".$commonNames ." - ".$longDescription);
 $hashTag = "AutumnEarth";
// do it this way so the markup can be shared between JS and PHP:
$socialShareMarkup = file_get_contents($_SERVER['DOCUMENT_ROOT'].'/js/src/module/social-share-markup.js');
$socialShareMarkup = str_ireplace("shareString='", "", $socialShareMarkup);
$socialShareMarkup = str_ireplace("';", "", $socialShareMarkup);
$socialShareMarkup = str_ireplace("##urlToShare##", $urlToShare, $socialShareMarkup);
$socialShareMarkup = str_ireplace("##hashTag##", $hashTag, $socialShareMarkup);
$socialShareMarkup = str_ireplace("##imageToShare##", $imageToShare, $socialShareMarkup);
$socialShareMarkup = str_ireplace("##descToShare##", $descToShare, $socialShareMarkup);
echo $socialShareMarkup;
?>



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