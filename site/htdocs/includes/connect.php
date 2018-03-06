<?php



if (strpos($_SERVER['SERVER_NAME'], 'autumnearth.com') !== false) {

  $connection = @mysqli_connect($liveHost,$liveUser,$livePassword) or die ("Can't connect to server 1");
} else {
  $connection = @mysqli_connect($host,$user,$password) or die ("Can't connect to server 2");
}
$thisdatabase = @mysqli_select_db($connection, $dbname) or die ("Can't select database");
?>