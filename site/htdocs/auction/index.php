<?php

include($_SERVER['DOCUMENT_ROOT']."/includes/session.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/functions.php");
$pagetitle = "Autumn Earth Auction House";
include($_SERVER['DOCUMENT_ROOT']."/includes/header.php");





echo'<h1>Autumn Earth Auction</h1>';

echo'items ending soon:';

// show 3 soonest to end items
displayAuctionItemsEndingSoon(3);

echo'<ul>'."\n";
echo'<li>View all items being auctioned</li>'."\n";
echo'<li>Place an item up for auction</li>'."\n";
echo'<li>Search for an item</li>'."\n";
echo'<li>View items you are selling</li>'."\n";
echo'</ul>'."\n";


include($_SERVER['DOCUMENT_ROOT']."/includes/footer.php");
?>