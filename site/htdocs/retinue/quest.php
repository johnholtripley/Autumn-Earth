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

// need to check for http://develop.ae/retinue/quest/Exploring/ ?
// it sohludn't be linked to

$query = "SELECT * from tblretinuequests where questCleanURL='".$_GET["questName"]."'";
$result = mysqli_query($connection, $query);
if(mysqli_num_rows($result)>0) {

  	while ($row = mysqli_fetch_array($result)) {
   
  		extract($row);
  		echo'<h2>'.$questName.'</h2>';
  		echo'<p>'.$questDescription.'</p>';

echo'<dl>';
  echo'<dt>Type</dt><dd>'.$questType.'</dd>';
  echo'<dt>Continent</dt><dd>'.ucfirst(str_replace("-", " ",$continent)).'</dd>';
  echo'<dt>Obstacles</dt><dd>'.$questObstacles.'</dd>';

echo'</dl>';


}

// see if any followers active on this:
$query2 = "SELECT * from tblretinuefollowers inner join tblcharacters on tblcharacters.charId = tblretinuefollowers.characterIdFollowing WHERE activeQuestId = '".$questID."'";
$result2 = mysqli_query($connection, $query2);
if(mysqli_num_rows($result2)>0) {
	echo '<p>Currently active on this quest:</p>';
	  	while ($row = mysqli_fetch_array($result2)) {
   
  		extract($row);
  echo '<h4><a href="/retinue/'.$charName.'/'.$followerCleanURL.'/">'.$followerName.'</a></h4>';
  	}
}


mysqli_free_result($result2);

} else {
	echo '<p>Sorry - couldn\'t find that quest</p>';
 header("HTTP/1.0 404 Not Found");
}
mysqli_free_result($result);
?>


</div>



</div>









<?php

include($_SERVER['DOCUMENT_ROOT']."/includes/footer.php");
?>
