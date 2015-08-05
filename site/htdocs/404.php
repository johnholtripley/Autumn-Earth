<?php

include($_SERVER['DOCUMENT_ROOT']."/includes/session.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/functions.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/header.php");


?>

<h1>Whoops</h1>



<?php
createMagicSquare();

include($_SERVER['DOCUMENT_ROOT']."/includes/footer.php");
?>