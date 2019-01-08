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


$query = "select * from tblcardbacks";
$result = mysqli_query($connection, $query) or die ("couldn't execute query");
if (mysqli_num_rows($result) > 0) {
echo '<ol id="cardList">';
while ($row = mysqli_fetch_array($result)) {
extract($row);
echo '<img src="/images/card-game/card-backs/'.$cardBackID.'.jpg" alt="'.$cardBackName.'">';
echo '<h4>'.$cardBackName.'</h4>';

}
echo '</ol>';
}


// if logged in, highlight those thay the current character has #####
// and get their UGC card backs #####

?>









</div>
</div>




<?php

include($_SERVER['DOCUMENT_ROOT']."/includes/navigation/card-game.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/footer.php");
?>