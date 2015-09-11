<?php
$title="Autumn Earth News";
include($_SERVER['DOCUMENT_ROOT']."/includes/session.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/functions.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/header.php");

?>
<div class="row">
<div class="column">

<div class="canvasWrapper">
<canvas id="cardGame" width="1000" height="500">
  <img src="/images/card-game-no-canvas.jpg" alt="Card game">
</canvas>
</div>


</div>
</div>

<?php
$additionalAssets = '<script src="card-game.js"></script>'."\n";
include($_SERVER['DOCUMENT_ROOT']."/includes/footer.php");
?>