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

<ul class="breadcrumbs" vocab="http://schema.org/" typeof="BreadcrumbList">
<li property="itemListElement" typeof="ListItem"><a property="item" typeof="WebPage" href="<?php echo $fullSitePath; ?>/herbarium/"><span property="name">The Herbarium</span></a><meta property="position" content="1"></li>
<li property="itemListElement" typeof="ListItem"><a property="item" typeof="WebPage" href="<?php echo $fullSitePath; ?>/herbarium/<?php echo $plantUrl; ?>"><span property="name"><?php echo $latinName; ?></span></a><meta property="position" content="2"></li>
</ul>

</div>
</div>














<?php

include($_SERVER['DOCUMENT_ROOT']."/includes/herbarium/plant-detail.php");

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