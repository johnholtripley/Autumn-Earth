<?php



if (strpos($_SERVER['SERVER_NAME'], 'autumnearth.com') !== false) {

  $connection = @mysql_connect($liveHost,$liveUser,$livePassword) or die ("Can't connect to server 1");
} else {
  $connection = @mysql_connect($host,$user,$password) or die ("Can't connect to server 2");
}
$thisdatabase = @mysql_select_db($database,$connection) or die ("Can't select database");
?>