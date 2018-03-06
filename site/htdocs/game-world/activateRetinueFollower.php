<?php


  include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");



  $query = "UPDATE tblretinuefollowers SET isEnabled='1' WHERE followerID = '" . $_GET["followerID"] . "'";
  $result = mysqli_query($connection, $query);

?>