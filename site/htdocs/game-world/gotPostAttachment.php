<?php

include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");

// trim the first 4 characters to get the MD5 hash of the mail id
$mailId = $_GET["id"];

$query = "UPDATE tblmail SET attachmentTaken='1' where MD5(mailId)='".$mailId."'";
$result = mysql_query($query);

?>