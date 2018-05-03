<?php

include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");



$questID = $_GET['questID'];
$chr = $_GET['chr'];
$allFollowers = explode("|",$_GET['followers']);









$query = "UPDATE tblretinuefollowers SET activeQuestId='".$questID."', questStartedTime=NOW() where followerID IN(".implode(",",$allFollowers).")";
$result = mysqli_query($connection, $query);

$query2 = "INSERT INTO tblretinuequestsactive (questIdActiveOrComplete, characterId) VALUES (".$questID.",".$chr.")";
$result2 = mysqli_query($connection, $query2);

mysqli_free_result($result);
mysqli_free_result($result2);


?>