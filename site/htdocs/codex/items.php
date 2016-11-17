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




<h2>Item index</h2>


<?php

$letters = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
for ($i=0;$i<count($letters);$i++) {
$query = "select * from tblinventoryitems where shortname LIKE '".$letters[$i]."%' and showinthecodex>0";
$result = mysql_query($query) or die ("couldn't execute query");

if(mysql_num_rows($result) > 0) {

echo '<h3>'.$letters[$i].'</h3>';
echo '<ul>';
while ($row = mysql_fetch_array($result)) {
	extract($row);

echo '<li><a href="/codex/items/'.$cleanURL.'">'.$shortname.'</a></li>';

}
echo '</ul>';
}


}
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
