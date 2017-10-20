<?php


include($_SERVER['DOCUMENT_ROOT']."/includes/session.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/functions.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/header.php");





?>
<div class="row">

	<div class="column">

		<h1>The Codex</h1>


<h2>Items</h2>
<ul>
<li><a href="/codex/items/">Item index</a></li>
</ul>

<h2>Crafting</h2>
<?php

$query = "SELECT * from tblprofessions order by professionName ASC";
$result = mysql_query($query) or die ("failed");




while ($row = mysql_fetch_array($result)) {
	extract($row);

echo'<h3>'.$professionName.'</h3>';



$query2 = "SELECT * from tblrecipes where profession = '".$professionID."'";
$result2 = mysql_query($query2) or die ("failed 2");
if(mysql_num_rows($result2) > 0) {
echo'<ul>';
echo'<li><a href="/codex/crafting/'.$cleanurl.'/recipes/">Recipes</a></li>';
echo'</ul>';
}
mysql_free_result($result2);


	}




mysql_free_result($result);
?>
<hr>
</div>
</div>






<div class="row">

	<div class="column">



<ul>
<?php
include($_SERVER['DOCUMENT_ROOT']."/includes/navigation/the-world.php");
?>
</ul>


</div>



</div>









<?php

include($_SERVER['DOCUMENT_ROOT']."/includes/footer.php");
?>
