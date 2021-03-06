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

$query = "select * from tblcards";
$result = mysqli_query($connection, $query) or die ("couldn't execute query");
if (mysqli_num_rows($result) > 0) {

$cardDataNeeded = array(array(null,null,null));
while ($row = mysqli_fetch_array($result)) {

extract($row);

array_push($cardDataNeeded, array($cardAttack, $cardDefense, $cardName));



	}
}

$isNetworkGame = false;
if(isset($_GET["network"])) {
	$isNetworkGame = true;
}

// check if logged in, get character's cards if so, otherwise use the default deck:
$playersCards = array(2,2,1,1,1,1,1,1,1,1,3,3);

if(isset($_SESSION['username'])) {
$query = "select tblcharacters.currentCards as currentCards, tblcharacters.charId as charID
from tblcharacters
inner join tblacct on tblacct.currentCharID = tblcharacters.charID
where tblacct.accountName='".$_SESSION['username']."'";
$result = mysqli_query($connection, $query) or die ("couldn't execute query");

		$returned = mysqli_num_rows($result);
	
	if ($returned > 0) {
	
	$row = mysqli_fetch_array($result);
	
		extract($row); 
	
		if ($currentCards != "") {

// get integer values not strings:
$playersCards = array_map('intval', explode(',', $currentCards));

		}
}
}

$npcsCards = array(1,1,1,1,1,1,1,1,1,3,3,3);
?>







<div class="canvasWrapper">
	<!-- canvas initial width and height dervied from the grid multiplied by the card size: /-->
<canvas id="cardGame" moz-opaque width="1008" height="612">
  <img src="/images/card-game/no-canvas.jpg" alt="Card game">
</canvas>
<script>
var allCardData = <?php echo json_encode($cardDataNeeded); ?>;
var player1Cards = <?php echo json_encode($npcsCards); ?>;
var player2Cards = <?php echo json_encode($playersCards); ?>;
var player1Skill = 1;
</script>
</div>


</div>
</div>




<?php

if($isNetworkGame) {
	$additionalAssets .= '<script src="/socket.io/socket.io.js"></script>'."\n";
	$additionalAssets .= '<script src="/js/card-sockets.'.$cacheVersion.'.js"></script>'."\n";
}
$additionalAssets .= '<script src="/js/src/game-world/helper-functions.'.$cacheVersion.'.js"></script>'."\n";
$additionalAssets .= '<script src="/js/card-game-shared.'.$cacheVersion.'.js"></script>'."\n";
$additionalAssets .= '<script src="/js/card-game.'.$cacheVersion.'.js"></script>'."\n";
?>
<ul>
<?php
include($_SERVER['DOCUMENT_ROOT']."/includes/navigation/card-game.php");
?>
</ul>
<?php include($_SERVER['DOCUMENT_ROOT']."/includes/footer.php");
?>
