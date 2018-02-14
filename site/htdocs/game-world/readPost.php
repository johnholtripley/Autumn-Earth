<?php

include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");

// trim the first 4 characters to get the MD5 hash of the post id
$mailId = substr($_GET["id"], 4);

// mark this post item as read:
$query = "UPDATE tblmail SET mailread='1' where MD5(mailId)='".$mailId."'";
$result = mysql_query($query);

?>