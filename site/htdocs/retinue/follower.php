<?php


include($_SERVER['DOCUMENT_ROOT']."/includes/session.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/functions.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/header.php");





?>
<div class="row">

	<div class="column"><h1>Retinue Follower</h1>


<?php

$showAll = false;
if(isset($_GET["show"])) {
	if($_GET["show"] == "all") {
$showAll = true;
	}
}


// follower names should be unique per character, but not globally, so need to check for followers of that name assigned to that character

$possibleFollowerFirstNameSyllables = ["an", "boo", " ", "an", "caa", " ", "ba", "de", "fe", " ", "ba", "fe", "ba", "an", " "];
$possibleFollowerFirstNames = sortSequentialSyllables($possibleFollowerFirstNameSyllables);
echo "<code><pre>";
var_dump($possibleFollowerFirstNameSyllables);
echo "<hr>";
var_dump($possibleFollowerFirstNames);
echo "</pre></code>";
echo $_GET["character"];
echo "<br>";

if($showAll) {
echo '<h2>All followers</h2>';
} else {
echo $_GET["follower"];
}
?>


</div>



</div>









<?php

include($_SERVER['DOCUMENT_ROOT']."/includes/footer.php");
?>
