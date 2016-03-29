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


	<h2><?php echo $latinName; ?></h2>
	<h3><?php echo $commonNames; ?></h3>
	<img src="/images/herbarium/plants/<?php echo $plantUrl; ?>.jpg" alt="<?php echo $latinName; ?>">
	<p><?php echo $plantDesc; ?></p>
<?php
} else {
	
echo"<h2>Sorry, couldn't find that plant</h2>";
	
	header("HTTP/1.0 404 Not Found");
}

?>









</div>
</div>



<?php

include($_SERVER['DOCUMENT_ROOT']."/includes/footer.php");
?>