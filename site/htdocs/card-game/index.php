<?php

include($_SERVER['DOCUMENT_ROOT']."/includes/session.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/functions.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/header.php");

?>
<div class="row">
<div class="column">

<?php
// get all card data:

$query = "select * from tblCards";
$result = mysql_query($query) or die ("couldn't execute query");
if (mysql_num_rows($result) > 0) {

$cardDataNeeded = array(array(null,null,null));
while ($row = mysql_fetch_array($result)) {

extract($row);

array_push($cardDataNeeded, array($cardAttack, $cardDefense, $cardName));



	}
}

// check if logged in, get character's cards if so, otherwise use the default deck:
$playersCards = array(1,2,1,1,1,2,1,1,2,1,2,1);

if(isset($_SESSION['username'])) {
$query = "select tblcharacters.currentCards as currentCards, tblcharacters.charId as charID
from tblcharacters
inner join tblacct on tblacct.currentCharID = tblcharacters.charID
where tblacct.accountName='".$_SESSION['username']."'";
$result = mysql_query($query) or die ("couldn't execute query");

		$returned = mysql_num_rows($result);
	
	if ($returned > 0) {
	
	$row = mysql_fetch_array($result);
	
		extract($row); 
	
		if ($currentCards != "") {

// get integer values not strings:
$playersCards = array_map('intval', explode(',', $currentCards));

		}
}
}

$npcsCards = array(1,1,2,3,2,1,2,1,1,1,2,1);
?>







<div class="canvasWrapper">
	<!-- canvas initial width and height dervied from the grid multiplied by the card size: /-->
<canvas id="cardGame" width="1008" height="612">
  <img src="/images/card-game-no-canvas.jpg" alt="Card game">
</canvas>
<script>
var allCardData = <?php echo json_encode($cardDataNeeded); ?>;
var player1Cards = <?php echo json_encode($playersCards); ?>;
var player2Cards = <?php echo json_encode($npcsCards); ?>;
var player2Skill = 1;
</script>
</div>


</div>
</div>




<?php
$additionalAssets = '<script src="card-game.js"></script>'."\n";
include($_SERVER['DOCUMENT_ROOT']."/includes/card-sub-nav.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/footer.php");
?>