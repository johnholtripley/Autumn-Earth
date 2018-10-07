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

$cleanURL = "";
if(isset($_GET["cleanURL"])) {
	$cleanURL = $_GET["cleanURL"];
}






// get events:
$activeEvents = [];
$eventsQuery = "SELECT eventid, title, cleanurl from tblevents";

    $eventsResult = mysqli_query($connection,  $eventsQuery ) or die ( "couldn't execute events query: ".$eventsQuery );
$numberofrows = mysqli_num_rows( $eventsResult );
  
 while ($row = mysqli_fetch_array($eventsResult)) {
  //extract($row);
  
$activeEvents[($row['eventid'])] = [$row['title'],$row['cleanurl']];


  //  array_push($activeEvents, $row);



}
    
mysqli_free_result($eventsResult);







$coloursQuery = "SELECT * from tblcolours";
$allColours = [];
$colourResult = mysqli_query($connection, $coloursQuery) or die ("recipes failed");
while ($colourRow = mysqli_fetch_array($colourResult)) {
  extract($colourRow);
  array_push($allColours, $colourName);
}


mysqli_free_result($colourResult);

$query = "select * from tblinventoryitems where cleanurl = '".$cleanURL."' and showinthecodex>0";
$result = mysqli_query($connection, $query) or die ("couldn't execute query");

if(mysqli_num_rows($result) > 0) {
extract(mysqli_fetch_array($result));
echo buildBreadCrumb('codex/items/'.$cleanURL,'The Codex/Item Index/'.$shortname);


	

echo '<h3>'.$shortname.'</h3>';
echo '<img src="/images/game-world/inventory-items/'.$itemID.'.png" style="width: auto;" alt="'.$shortname.'">';
echo '<p>'.str_replace("##contains##", "", $description).'</p>';





 echo'<dl>';
  echo'<dt>Price:</dt><dd>'.$priceCode.'</dd>';
  echo'<dt>Level:</dt><dd>'.$level.'</dd>';
  echo'<dt>Dyeable:</dt><dd>';
  if($dyeable>0) {
  	echo 'Yes';
  } else {
  	echo 'No';
  }
  echo'</dd>';
   echo'<dt>Holdable:</dt><dd>';
  if($holdable>0) {
    echo 'Yes';
  } else {
    echo 'No';
  }
  echo'</dd>';
  echo'<dt>Inscribable:</dt><dd>';
    if($inscribable>0) {
  	echo 'Yes';
  } else {
  	echo 'No';
  }
  echo'</dd>';

echo'</dl>';



if($activeDuringSeason>0) {
  echo '<p>Only available during <a href="/almanack/'.$activeEvents[$activeDuringSeason][1].'">'.$activeEvents[$activeDuringSeason][0].'</a></p>';
}



// find any recipes this item is used in

$recipeQuery = "SELECT tblrecipes.*, tblprofessions.cleanurl as professionCleanURL, tblcolours.colourName, tblinventoryitems.itemid as productId, tblinventoryitems.shortname as recipeFallbackName, tblinventoryitems.description as recipeDescriptionFallback, tblinventoryitems.hasInherentColour as hasInherentColour FROM tblrecipes INNER JOIN tblprofessions on tblprofessions.professionid = tblrecipes.profession
INNER JOIN tblinventoryitems on tblrecipes.creates = tblinventoryitems.itemid LEFT JOIN tblcolours on tblrecipes.defaultresultingcolour = tblcolours.colourid WHERE tblrecipes.components REGEXP '\"type\":[[:space:]]?".$itemID."' <> 0 OR tblrecipes.components REGEXP '\"type\":[[:space:]]?".$itemGroup."' <> 0";
$recipeResult = mysqli_query($connection, $recipeQuery) or die ("couldn't execute related query");

if(mysqli_num_rows($recipeResult) > 0) {
  echo "<h4>Used in:</h4>";
  echo "<ul>";
  while ($recipeRow = mysqli_fetch_array($recipeResult)) {
  extract($recipeRow);

$thisColourPrefix = '';
if($hasInherentColour<1) {
if($defaultResultingColour>0) {
  $thisColourPrefix = $allColours[$defaultResultingColour]." ";
}
}
echo '<li><a href="/codex/crafting/'.$professionCleanURL.'/recipes#recipe'.$recipeID.'">'.$thisColourPrefix;
if($recipeName == "") {
echo $recipeFallbackName;

} else {
  echo $recipeName;
 
}
echo '</a></li>';
  
}

echo "</ul>";
}

// find related items:
if($itemGroup) {
$relatedQuery = "select * from tblinventoryitems where itemgroup = '".$itemGroup."' and showinthecodex>0 and itemid != '".$itemID."'";
$relatedResult = mysqli_query($connection, $relatedQuery) or die ("couldn't execute related query");
if(mysqli_num_rows($relatedResult) > 0) {
echo "<h4>Related items:</h4>";
echo "<ul>";

while ($relatedRow = mysqli_fetch_array($relatedResult)) {
	extract($relatedRow);
	echo '<li><a href="/codex/items/'.$cleanURL.'">'.$shortname.'</a></li>';
}

echo "</ul>";
}
}

} else {
	echo "<p>Sorry, that item wasn't found</p>";
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
