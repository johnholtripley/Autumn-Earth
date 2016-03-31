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
</div>
</div>

<?php
// get all card data:

$query = "select * from tblplants ORDER BY timeCreated desc";
$result = mysql_query($query) or die ("couldn't execute query");
if (mysql_num_rows($result) > 0) {
echo '<ul id="herbariumCatalogue" class="row medium-2up wide-5up equalHeights">';
$cardDataNeeded = array(array(null,null,null));
$i = 1;
while ($row = mysql_fetch_array($result)) {

extract($row);
$additionalClass="";
$pictureArray = array(150,300);
if(($i%13 == 1) || ($i%13 == 8)) {
$additionalClass=" spotlight";
$pictureArray = array(300,600);
}

?>

<li class="column<?php echo $additionalClass; ?>" data-aquatic="<?php echo $isAquatic; ?>"><div>
	<a href="/herbarium/<?php echo $plantUrl; ?>/">

<?php
picture('/images/herbarium/plants/'.$plantUrl.'.jpg', $latinName, $pictureArray);
?>

	
	<h4><?php echo $latinName; ?></h4>
	<h5><?php echo $commonNames; ?></h5>
	<p><?php echo $plantDesc; ?></p>
</a></div>
</li>

<?php

$i++;
	}
	echo "</ul>";
}




?>













<?php

include($_SERVER['DOCUMENT_ROOT']."/includes/footer.php");
?>