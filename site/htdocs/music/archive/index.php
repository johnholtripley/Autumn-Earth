<?php


include($_SERVER['DOCUMENT_ROOT']."/includes/session.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/functions.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/header.php");





?>
<div class="row">

	<div class="column"><h1>Music</h1>
<h2>abc notation archive</h2>




<?php

$dir    = '../archive/';
$allFiles = scandir($dir);

$ignoreList = [".","..","index.php"];

echo '<ul>';
for ($i=0;$i<count($allFiles);$i++) {

if (!(in_array($allFiles[$i], $ignoreList))) {
	echo '<li><a href="'.$allFiles[$i].'" download="'.$allFiles[$i].'">'.$allFiles[$i].'</a></li>';
}

}

echo '</ul>';

?>
</div>



</div>









<?php

include($_SERVER['DOCUMENT_ROOT']."/includes/footer.php");
?>
