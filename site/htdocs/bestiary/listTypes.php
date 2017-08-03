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








<?php

$creatureType = "";
if(isset($_GET["type"])) {
	$creatureType = $_GET["type"];
}


$query = "select * from tblcreaturetypes where creaturetypeurl = '".$creatureType."'";
$result = mysql_query($query) or die ("couldn't execute query");
if(mysql_num_rows($result) > 0) {
$row = mysql_fetch_array($result);
extract($row);
echo buildBreadCrumb('bestiary/'.$creatureTypeURL.'/','The Bestiary/'.$creatureTypeName.'/');




$letters = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
for ($i=0;$i<count($letters);$i++) {
$query = "select tblcreatures.*, tblcreaturetypes.creaturetypename as creaturetype, tblcreaturetypes.creaturetypeurl as typeURL from tblcreatures INNER JOIN tblcreaturetypes on tblcreatures.creatureType = tblcreaturetypes.creaturetypename where tblcreatures.creaturename LIKE '".$letters[$i]."%' AND tblcreaturetypes.creaturetypeurl = '".$creatureType."'";

$result = mysql_query($query) or die ("couldn't execute query");

if(mysql_num_rows($result) > 0) {



echo '<h3>'.$letters[$i].'</h3>';
echo '<ul>';
while ($row = mysql_fetch_array($result)) {
	extract($row);

echo '<li><a href="/bestiary/'.$typeURL.'/'.$cleanURL.'/">'.$creatureName.'</a></li>';

}
echo '</ul>';
}


}


} else {

  echo "<p>Sorry, that creature type wasn't found</p>";
    header("HTTP/1.0 404 Not Found");
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
