<?php


include($_SERVER['DOCUMENT_ROOT']."/includes/session.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/functions.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/header.php");





?>
<div class="row">

	<div class="column"><h1>The Scriptorium</h1>
<ul>
<?php
include($_SERVER['DOCUMENT_ROOT']."/includes/navigation/the-world.php");
?>
</ul>



<?php
include($_SERVER['DOCUMENT_ROOT']."/game-world/generatePoem.php");
echo createProceduralPoem();
?>



<?php
include($_SERVER['DOCUMENT_ROOT']."/game-world/generateBook.php");
echo '<h1>'.createProceduralTitle().'</h1>';
echo createProceduralBook();
?>
</div>



</div>









<?php

include($_SERVER['DOCUMENT_ROOT']."/includes/footer.php");
?>
