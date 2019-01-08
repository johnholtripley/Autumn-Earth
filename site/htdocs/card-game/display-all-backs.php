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

$playersCardBacks = [];
$characterNameToUse = '';
if(isset($_SESSION['username'])){

	$query3 = "select tblcharacters.cleanURL, tblcharacters.cardBacks from tblcharacters inner join tblacct on tblacct.currentCharID = tblcharacters.charID where tblacct.accountName='".$_SESSION['username']."'";
	$result3 = mysqli_query($connection, $query3) or die ("couldn't execute query3");
	$returned3 = mysqli_num_rows($result3);
	if ($returned3 > 0) {
		$row3 = mysqli_fetch_array($result3);
		$thisPlayersCardBacks = str_replace("[", "", $row3['cardBacks']);
		$thisPlayersCardBacks = str_replace("]", "", $thisPlayersCardBacks);
		$playersCardBacks = explode(",",$thisPlayersCardBacks);
		$characterNameToUse = $row3['cleanURL'];
	}












}



$query = "select * from tblcardbacks";
$result = mysqli_query($connection, $query) or die ("couldn't execute query");
if (mysqli_num_rows($result) > 0) {
echo '<ol id="cardBackList">';
while ($row = mysqli_fetch_array($result)) {
extract($row);
if (in_array($cardBackID, $playersCardBacks)) {
	// player has this back:
	echo '<li class="alreadyGot">';
	} else {
		echo '<li>';
	}

echo '<img src="/images/card-game/card-backs/'.$cardBackID.'.jpg" alt="'.$cardBackName.'">';
echo '<h4>'.$cardBackName.'</h4></li>';

}
echo '</ol>';
}







if($characterNameToUse != '') {

// get an player generated card backs:
$query4 = "select * from tblplayergeneratedcontent inner join tblcharacters on tblplayergeneratedcontent.characterID = tblcharacters.charID where tblcharacters.cleanURL='".$characterNameToUse."' and tblplayergeneratedcontent.isActive = 1";

$result4 = mysqli_query($connection, $query4) or die ("couldn't execute query4");
			$returned4 = mysqli_num_rows($result4);
		if ($returned4 > 0) {
			echo'<h2>Your custom card backs</h2>';
			$dir = "/images/user-generated/";
		  while ($row4 = mysqli_fetch_array($result4)) {
    extract($row4);
   if($itemType == 81) {
        echo '<p>'.$itemTitle.'</p>';
      echo '<img src="'.$dir.$itemID.'-world.jpg" style="width:auto;height:auto;">';
  }
}
}
}


?>


</div>
</div>




<?php

include($_SERVER['DOCUMENT_ROOT']."/includes/navigation/card-game.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/footer.php");
?>