<?php

include($_SERVER['DOCUMENT_ROOT']."/includes/session.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/functions.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/header.php");


?>

<div class="row">
<div class="column">
<h1>You've wandered off the map&hellip;</h1>




<?php
createMagicSquare();
?>
</div>
</div>
<?php

include($_SERVER['DOCUMENT_ROOT']."/includes/footer.php");
?>