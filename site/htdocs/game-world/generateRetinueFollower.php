<?php

include_once($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include_once($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");
include_once($_SERVER['DOCUMENT_ROOT']."/includes/functions.php");
include_once($_SERVER['DOCUMENT_ROOT']."/includes/generateProceduralNameFunction.php");

/*
include($_SERVER['DOCUMENT_ROOT']."/includes/retinue/male-first-names.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/retinue/female-first-names.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/retinue/human-surnames-medieval.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/retinue/human-anglo-saxon-male.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/retinue/human-anglo-saxon-female.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/retinue/elven-surname-prefix.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/retinue/elven-surname-suffix.php");
*/

$charactersName = "eleaddai";
$debug = false;
if(isset($_GET["debug"])) {
$debug = true;
}


function generateFollower() {
global $debug;

$sex = array("female","male");
$race = "huldra";
$thisFollowersSex = $sex[mt_rand(0, count($sex) - 1)];

return array(generateProceduralName($thisFollowersSex, $race), $thisFollowersSex, $race);
}
if($debug) {
	$newFollower = generateFollower();
	echo $newFollower[0];
}
?>