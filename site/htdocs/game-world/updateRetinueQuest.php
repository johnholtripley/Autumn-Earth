<?php

include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");


$questID = $_GET['questID'];
$chr = $_GET['chr'];
$allFollowers = explode("|",$_GET['followers']);



$query = "UPDATE tblretinuefollowers SET activeQuestId='".$questID."', questStartedTime=NOW() where followerID IN(".implode(",",$allFollowers).")";
$result = mysql_query($query);

$query2 = "INSERT INTO tblretinuequestsactive (questIdActiveOrComplete, characterId) VALUES (".$questID.",".$chr.")";
$result2 = mysql_query($query2);
?>