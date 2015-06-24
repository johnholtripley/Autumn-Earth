<?php
/* need to be careful of whitespace before and after php tags as these will be sent to flash */
include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/functions.inc");



$gamestate = htmlCharsToEntities("&playsounds=".$_POST['playsounds']."&herox=".$_POST['herox']."&heroy=".$_POST['heroy']."&dowseskill=".$_POST['dowseskill']."&famskill=".$_POST['famskill']."&currentmapnumber=".$_POST['currentmapnumber']."&heightgained=" . $_POST['heightgained']);
$journalstate = htmlCharsToEntities($_POST['journalsave']);
$queststate = htmlCharsToEntities($_POST['questsstatus']);
$petstate = htmlCharsToEntities($_POST['petsave']);
$currentbag = $_POST['currentbag'];
$inventorystate = htmlCharsToEntities($_POST['inventorysave']);
$money = $_POST['money'];
$minutesplayed = $_POST['minutesplayed'];

$query = "update tblcharacters SET gamestate = '".$gamestate."',
journalstate = '".$journalstate."',
queststate = '".$queststate."',
petstate = '".$petstate."',
currentbag = '".$currentbag."',
inventorystate = '".$inventorystate."',
money = '".$money."', minutesplayed = '".$minutesplayed."'
WHERE charid='".$_POST['chrid']."'";

if (mysql_query($query)) {
$BaseSavedOk = "true";
} else {
$BaseSavedOk = "false";
}

include($_SERVER['DOCUMENT_ROOT']."/includes/close.php");
print ("basewassuccess=".$BaseSavedOk);
?>