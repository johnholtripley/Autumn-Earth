<?php


include($_SERVER['DOCUMENT_ROOT']."/includes/session.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/functions.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/header.php");





?>
<div class="row">

	<div class="column">

		<h1>The Bestiary</h1>


<h2>Creature types</h2>

<?php
$query = "select * from tblcreaturetypes";
$result = mysqli_query($connection, $query) or die ("couldn't execute query");

if(mysqli_num_rows($result) > 0) {
echo '<ul>';
while ($row = mysqli_fetch_array($result)) {
	extract($row);
echo '<li><a href="/bestiary/'.$creatureTypeURL.'/">'.$creatureTypeName.'</a></li>';


}
echo '</ul>';
}

?>

<h2>Creatures</h2>
<div class="row small-2up medium-4up wide-8up equalHeights">
<?php

$letters = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
for ($i=0;$i<count($letters);$i++) {
$query = "select tblcreatures.*, tblcreaturetypes.creaturetypename as creaturetype, tblcreaturetypes.creaturetypeurl as typeURL from tblcreatures INNER JOIN tblcreaturetypes on tblcreatures.creatureType = tblcreaturetypes.creaturetypename where tblcreatures.creaturename LIKE '".$letters[$i]."%' ORDER BY tblcreatures.creaturename ASC";
$result = mysqli_query($connection, $query) or die ("couldn't execute query");

if(mysqli_num_rows($result) > 0) {
echo '<div class="column"><div>';
echo '<h3>'.$letters[$i].'</h3>';
echo '<ul>';
while ($row = mysqli_fetch_array($result)) {
	extract($row);

echo '<li><a href="/bestiary/'.$typeURL.'/'.$cleanURL.'/">'.$creatureName.'</a></li>';

}
echo '</ul>';
echo '</div></div>';
}


}
?>
</div>



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
