<?php


include($_SERVER['DOCUMENT_ROOT']."/includes/session.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/functions.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/header.php");





?>
<div class="row">

	<div class="column">

		<h1>The Bestiary</h1>






<?php

$cleanURL = "";
if(isset($_GET["cleanURL"])) {
	$cleanURL = $_GET["cleanURL"];
}











$creatureResultQuery = "select tblcreatures.*, tblcreaturetypes.creaturetypename as creaturetype, tblcreaturetypes.creaturetypeurl as typeURL from tblcreatures INNER JOIN tblcreaturetypes on tblcreatures.creatureType = tblcreaturetypes.creaturetypename where tblcreatures.cleanurl = '".$cleanURL."'";

    $creatureResult = mysqli_query($connection,  $creatureResultQuery ) or die ( "couldn't execute events query: ".$creatureResultQuery );
$numberofrows = mysqli_num_rows( $creatureResult );
  if($numberofrows>0) {
 while ($row = mysqli_fetch_array($creatureResult)) {
  extract($row);
  




}
echo buildBreadCrumb('bestiary/'.$typeURL.'/'.$cleanURL,'The Bestiary/'.$creaturetype.'/'.$creatureName);
?>
<h2><?php echo $creatureName; ?></h2>
<p><?php echo $creatureDescription; ?></p>
<img src="/images/game-world/npcs/<?php echo $cleanURL; ?>.png" alt="<?php echo $creatureName; ?>">
<?php

} else {
  echo "<p>Sorry, that creature wasn't found</p>";
    header("HTTP/1.0 404 Not Found");
}
    
mysqli_free_result($creatureResult);






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
