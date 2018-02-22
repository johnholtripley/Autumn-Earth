<?php


include($_SERVER['DOCUMENT_ROOT']."/includes/session.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/functions.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/header.php");





?>
<div class="row">

	<div class="column"><h1>Retinue Quest</h1>


<?php


$query = "SELECT * from tblretinuequests where questCleanURL='".$_GET["questName"]."'";
$result = mysql_query($query);
if(mysql_num_rows($result)>0) {

  	while ($row = mysql_fetch_array($result)) {
   
  		extract($row);
  		echo'<h2>'.$questName.'</h2>';
  		echo'<p>'.$questDescription.'</p>';

echo'<dl>';
  echo'<dt>Type</dt><dd>'.$questType.'</dd>';
  echo'<dt>Continent</dt><dd>'.ucfirst(str_replace("-", " ",$continent)).'</dd>';
  echo'<dt>Obstacles</dt><dd>'.$questObstacles.'</dd>';

echo'</dl>';


}

} else {
	echo '<p>Sorry - couldn\'t find that quest</p>';
 header("HTTP/1.0 404 Not Found");
}
mysql_free_result($result);
?>


</div>



</div>









<?php

include($_SERVER['DOCUMENT_ROOT']."/includes/footer.php");
?>
