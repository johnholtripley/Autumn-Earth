<?php

include($_SERVER[DOCUMENT_ROOT]."/includes/session.inc");
include($_SERVER[DOCUMENT_ROOT]."/includes/signalnoise.php");
include($_SERVER[DOCUMENT_ROOT]."/includes/connect.php");
include($_SERVER[DOCUMENT_ROOT]."/includes/functions.inc");
$pagetitle = "Autumn Earth Auction House";
include($_SERVER[DOCUMENT_ROOT]."/includes/header.inc");
include($_SERVER[DOCUMENT_ROOT]."/includes/login.inc");

echo'<h1>Autumn Earth Auction</h1>';

echo '<p>Bid successfully made</p>';


include($_SERVER[DOCUMENT_ROOT]."/includes/close.php");
include($_SERVER[DOCUMENT_ROOT]."/includes/footer.inc");
?>