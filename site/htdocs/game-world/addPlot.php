<?php

include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/functions.php");

$chr = $_GET["chr"];
$plotWidth = $_GET["width"];
$plotHeight = $_GET["height"];
$plotNorthWestX = $_GET["tileX"];
$plotNorthWestY = $_GET["tileY"];
$debug = false;
if(isset($_GET["debug"])) {
    $debug = true;
}




?>