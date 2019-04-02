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


<h1>A poem&hellip;</h1>
<?php
include($_SERVER['DOCUMENT_ROOT']."/game-world/generatePoem.php");

$poemOutput = explode('####',createProceduralPoem());

for($i=0;$i<count($poemOutput);$i++) {
	echo '<p>'.$poemOutput[$i].'</p>';
}

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
