<?php

include($_SERVER[DOCUMENT_ROOT]."/includes/session.inc");
include($_SERVER[DOCUMENT_ROOT]."/includes/signalnoise.php");
include($_SERVER[DOCUMENT_ROOT]."/includes/connect.php");
include($_SERVER[DOCUMENT_ROOT]."/includes/functions.inc");
$pagetitle = "Autumn Earth Auction House";
include($_SERVER[DOCUMENT_ROOT]."/includes/header.inc");
include($_SERVER[DOCUMENT_ROOT]."/includes/login.inc");




echo'<h1>Autumn Earth Auction</h1>';

echo'items ending soon:';

// show 3 soonest to end items
	$query = "SELECT tblAuctionItems.*, tblinventoryitems.itemID, tblinventoryitems.shortname
	FROM tblAuctionItems
	inner join tblinventoryitems on tblAuctionItems.itemid = tblinventoryitems.itemid
	WHERE tblAuctionItems.endtime > NOW()
	and tblAuctionItems.auctionClosed = 'true'
	ORDER BY tblAuctionItems.endtime ASC
	LIMIT 3";
	$result = mysql_query($query) or die ("couldn't execute query");
	
	$numberofrows = mysql_num_rows($result);
	if ($numberofrows>0) {
	
	
	
		while ($row = mysql_fetch_array($result)) {
			extract($row);
			$endTime = strtotime($endTime);
			$timeToEnd = $endTime-time();
			//
			
			
			// get the highest 2 bids from different bidders on this item:
			
			$query3 = "select tblauctionbids.auctionID ,tblauctionbids.bidderID, max(tblauctionbids.bidAmount) as bidAmount, tblcharacters.charName, tblcharacters.charID

from tblauctionbids
inner join tblcharacters on tblauctionbids.bidderID = tblcharacters.charID
where auctionID = '".$auctionID."'
group by tblauctionbids.bidderID 
order by tblauctionbids.bidAmount DESC limit 2
			";
			
			$result3 = mysql_query($query3) or die ("couldn't execute query3");
			
			$numberofrows3 = mysql_num_rows($result3);
			
			switch($numberofrows3) {
				case 0:
				// no bids
				$currentprice = $startPrice;
				break;
				case 1:
				// get the one bidder's name:
				$row3 = mysql_fetch_array($result3);
				extract($row3);
				$highbidder = $charName;
				$currentprice = $startPrice;
				break;
				case 2:
				// determine current bid:
				$row3 = mysql_fetch_array($result3);
				extract($row3);
				$highbid = $bidAmount;
				$highbidder = $charName;
				$row3b = mysql_fetch_array($result3);
				extract($row3b);
				$secondhighbid = $bidAmount;
			
				if ($highbid>($secondhighbid+1)) {
					$currentprice = $secondhighbid+1;
				} else {
					$currentprice = $highbid;
				}
				break;
			}
			
			
			
			
			
			
			
			echo'<div class="InventorySlot" style="background-image: url(/assets/inventory/'.$itemID.'.jpg);">';
			echo'<a href="ViewItem.php?item='.$auctionID.'" title="more information"><img src="/assets/inventory/quantity'.$quantity.'.gif" width="64" height="64" /></a></div>'."\n";
			echo'<div class="Clearer">&nbsp;</div>'."\n";
			echo'<p><a href="ViewItem.php?item='.$auctionID.'" title="more information">'.$shortname.'</a>'."\n";
			echo'<br />Current price: '.formatCurrency($currentprice);
			
			if ($reservePrice != "-1") {
				// check if reserve has been met:
				if ($currentprice < $reservePrice) {
					echo ' - reserve not met';
				}
			}
			
			echo'<br />Ends in '.timeRemaining($timeToEnd);
			
			if ($buyItNowPrice != '-1') {
			echo'<br /><a href="#" title="Buy '.$shortname.' now!">Buy it now for '.$buyItNowPrice.'</a>';
			}
			
			echo'</p>'."\n";
		}
		
	} else {
		echo'<p>No items found for sale.</p>';
	}

echo'<ul>'."\n";
echo'<li>View all items being auctioned</li>'."\n";
echo'<li>Place an item up for auction</li>'."\n";
echo'<li>Search for an item</li>'."\n";
echo'<li>View items you are selling</li>'."\n";
echo'</ul>'."\n";

include($_SERVER[DOCUMENT_ROOT]."/includes/close.php");
include($_SERVER[DOCUMENT_ROOT]."/includes/footer.inc");
?>