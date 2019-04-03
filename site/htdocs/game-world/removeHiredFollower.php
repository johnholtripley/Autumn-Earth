<?php

include_once($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include_once($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");



$followerId = $_GET["id"];


// update the followers as not enabled so it will be deleted:

$query = "UPDATE tblretinuefollowers SET isEnabled='0' where followerId='".$followerId."'";
$result = mysqli_query($connection, $query);



?>