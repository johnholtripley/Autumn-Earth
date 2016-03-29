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

$query = "select * from tblplants ORDER BY timeCreated";
$result = mysql_query($query) or die ("couldn't execute query");
if (mysql_num_rows($result) > 0) {
echo '<ul id="herbariumCatalogue" class="row">';
$cardDataNeeded = array(array(null,null,null));
while ($row = mysql_fetch_array($result)) {

extract($row);

?>

<li class="wide-4 column" data-aquatic="<?php echo $isAquatic; ?>">
	<a href="/herbarium/<?php echo $plantUrl; ?>/">
	<img src="/images/herbarium/plants/<?php echo $plantUrl; ?>.jpg" alt="<?php echo $latinName; ?>">
	<h4><?php echo $latinName; ?></h4>
	<h5><?php echo $commonNames; ?></h5>
	<p><?php echo $plantDesc; ?></p>
</a>
</li>

<?php


	}
	echo "</ul>";
}




?>













<?php

include($_SERVER['DOCUMENT_ROOT']."/includes/footer.php");
?>