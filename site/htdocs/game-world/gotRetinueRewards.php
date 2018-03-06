<?php

include_once($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include_once($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");



$questId = $_GET["id"];
$newLocationX = $_GET["newLocationX"];
$newLocationY = $_GET["newLocationY"];

// update the followers to new location, and set them as available

$query = "UPDATE tblretinuefollowers SET activeQuestId='-1', followerMapCoordinateX='".$newLocationX."', followerMapCoordinateY='".$newLocationY."' where activeQuestId='".$questId."'";
$result = mysqli_query($connection, $query);



?>