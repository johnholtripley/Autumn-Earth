<?php


include($_SERVER['DOCUMENT_ROOT']."/includes/session.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/functions.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/header.php");





?>
<div class="row">

	<div class="column">

		<h1>The Codex</h1>




<h2>Item index</h2>



<?php

$cleanURL = "";
if(isset($_GET["cleanURL"])) {
	$cleanURL = $_GET["cleanURL"];
}

$query = "select * from tblinventoryitems where cleanurl = '".$cleanURL."' and showinthecodex>0";
$result = mysql_query($query) or die ("couldn't execute query");

if(mysql_num_rows($result) > 0) {
extract(mysql_fetch_array($result));
echo buildBreadCrumb('codex/items/'.$cleanURL,'The Codex/Item Index/'.$shortname);


	

echo '<h3>'.$shortname.'</h3>';
echo '<img src="/images/game-world/inventory-items/'.$itemID.'.png" style="width: auto;" alt="'.$shortname.'">';
echo '<p>'.$description.'</p>';





 echo'<dl>';
  echo'<dt>Price:</dt><dd>'.$priceCode.'</dd>';
  echo'<dt>Level:</dt><dd>'.$level.'</dd>';
  echo'<dt>Dyeable:</dt><dd>';
  if($dyeable>0) {
  	echo 'Yes';
  } else {
  	echo 'No';
  }
  echo'</dd>';
  echo'<dt>Inscribable:</dt><dd>';
    if($inscribable>0) {
  	echo 'Yes';
  } else {
  	echo 'No';
  }
  echo'</dd>';

echo'</dl>';



// find related items:
if($itemGroup) {
$relatedQuery = "select * from tblinventoryitems where itemgroup = '".$itemGroup."' and showinthecodex>0 and itemid != '".$itemID."'";
$relatedResult = mysql_query($relatedQuery) or die ("couldn't execute related query");
if(mysql_num_rows($result) > 0) {
echo "<h4>Related items</h4>";
echo "<ul>";

while ($relatedRow = mysql_fetch_array($relatedResult)) {
	extract($relatedRow);
	echo '<li><a href="/codex/items/'.$cleanURL.'">'.$shortname.'</a></li>';
}

echo "</ul>";
}
}

} else {
	echo "<p>Sorry, that item wasn't found</p>";
	 	header("HTTP/1.0 404 Not Found");
}



?>

<hr>
</div>
</div>






<div class="row">

	<div class="column">



<ul>
<?php
include($_SERVER['DOCUMENT_ROOT']."/includes/navigation/the-world.php");
?>
</ul>


</div>



</div>









<?php

include($_SERVER['DOCUMENT_ROOT']."/includes/footer.php");
?>
