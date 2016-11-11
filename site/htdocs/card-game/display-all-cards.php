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
$result = mysql_query($query) or die ("couldn't execute query");
if (mysql_num_rows($result) > 0) {
echo '<ol id="cardList">';
$cardDataNeeded = array(array(null,null,null));
while ($row = mysql_fetch_array($result)) {

extract($row);

?>

<li>
	<img src="/images/card-game/cards/<?php echo $cardID; ?>.png" alt="<?php echo $cardName; ?>">
	<h4><?php echo $cardName; ?></h4>
	 <dl>
  <dt>Attack</dt>
  <dd><?php echo $cardAttack; ?></dd>
  <dt>Defense</dt>
  <dd><?php echo $cardDefense; ?></dd>
</dl> 
</li>

<?php




	}
	echo "</ol>";
}




?>









</div>
</div>




<?php
$additionalAssets = '<script src="card-game.js"></script>'."\n";
include($_SERVER['DOCUMENT_ROOT']."/includes/card-sub-nav.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/footer.php");
?>