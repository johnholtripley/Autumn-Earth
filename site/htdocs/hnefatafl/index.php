<?php

include($_SERVER['DOCUMENT_ROOT']."/includes/session.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/functions.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/header.php");

?>
<div class="row">
<div class="column" id="hnefataflGameWrapper">
<div class="canvasWrapper">
	<!-- canvas initial width and height dervied from the grid multiplied by the card size: /-->
<canvas id="hnefataflGame" moz-opaque width="612" height="612">
  <img src="/images/card-game/no-canvas.jpg" alt="Hnefatafl game">
</canvas>
</div>
</div>
</div>




<?php
$additionalAssets .= '<script src="/js/src/game-world/helper-functions.'.$cacheVersion.'.js"></script>'."\n";
$additionalAssets .= '<script src="/js/hnefatafl-shared.'.$cacheVersion.'.js"></script>'."\n";
$additionalAssets .= '<script src="/js/hnefatafl.'.$cacheVersion.'.js"></script>'."\n";
include($_SERVER['DOCUMENT_ROOT']."/includes/footer.php");
?>
