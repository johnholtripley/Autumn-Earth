<?php
if($_SERVER['SERVER_NAME'] == "autumnearth.com") {
  $connection = @mysql_connect($liveHost,$liveUser,$livePassword) or die ("Can't connect to server");
} else {
  $connection = @mysql_connect($host,$user,$password) or die ("Can't connect to server");
}
$thisdatabase = @mysql_select_db($database,$connection) or die ("Can't select database");
?>