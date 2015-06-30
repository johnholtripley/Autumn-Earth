<?php

include($_SERVER['DOCUMENT_ROOT']."/includes/session.inc");
include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/functions.inc");
$pagetitle = "Autumn Earth Auction House";
include($_SERVER['DOCUMENT_ROOT']."/includes/header.inc");
include($_SERVER['DOCUMENT_ROOT']."/includes/login.inc");

echo'<h1>Autumn Earth Auction</h1>';

// get GET data:
$auctionitemID = $_GET["item"];
// check that a valid number has been passed:

if (is_numeric($auctionitemID)) {



	$query = "SELECT tblAuctionItems.*, tblinventoryitems.itemID, tblinventoryitems.shortname, tblinventoryitems.description, tblcharacters.charName
	FROM tblAuctionItems
	inner join tblinventoryitems on tblAuctionItems.itemID = tblinventoryitems.itemID
	inner join tblcharacters on tblAuctionItems.sellerID = tblcharacters.charID
	WHERE auctionID = '".$auctionitemID."'";
	$result = mysql_query($query) or die ("couldn't execute query1");
	
	$numberofrows = mysql_num_rows($result);
	if ($numberofrows>0) {
		$row = mysql_fetch_array($result);
		extract($row);
		$itemGraphic = $itemID;
		$itemquantity = $quantity;
		$sellerName = $charName;
		
		echo'<h2>'.$shortname.'</h2>'."\n";
		echo'<p>'.$description.'</p>'."\n";
		
		$endTime = strtotime($endTime);
			$timeToEnd = $endTime-time();
			//
			
			
			
			
			
			echo'<div class="InventorySlot" style="background-image: url(/assets/inventory/'.$itemGraphic.'.jpg);">';
			echo'<img src="/assets/inventory/quantity'.$quantity.'.gif" width="64" height="64" /></div>'."\n";
			echo'<div class="Clearer">&nbsp;</div>'."\n";
			echo'<p><br />Quantity '.$quantity."\n";
			
			// get number of bids on this item:
			$query2 = "select COUNT(*) from tblauctionbids  
where auctionID = '".$auctionitemID."'";

			$result2 = mysql_query($query2) or die ("couldn't execute query2");
			$row2 = mysql_fetch_row($result2);
			$numberofbids = $row2[0];
			// get the highest 2 bids on this item:
			// get the highest 2 bids from different bidders on this item:
			
			$query3 = "select tblauctionbids.auctionID ,tblauctionbids.bidderID, max(tblauctionbids.bidAmount) as bidAmount, tblcharacters.charName, tblcharacters.charID

from tblauctionbids
inner join tblcharacters on tblauctionbids.bidderID = tblcharacters.charID
where auctionID = '".$auctionitemID."'
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
			
			
			
			
			echo'<br />Current price: '.formatCurrency($currentprice);
			
			if ($reservePrice != "-1") {
				// check if reserve has been met:
				if ($currentprice < $reservePrice) {
					echo ' - reserve not met';
				}
			}
			
			echo'<br />Number of bids: '.$numberofbids;
			if ($numberofbids>0) {
			
			// get this character's name
			
			$query = "select tblacct.accountID, tblacct.accountName, tblacct.currentCharID, tblcharacters.charID, tblcharacters.charName AS thisCharName, tblcharacters.accountID AS charAcctID
from tblacct
inner join tblcharacters on  tblacct.currentCharID = tblcharacters.charID
where tblacct.accountName='".$_SESSION['username']."'";
$result = mysql_query($query) or die ("couldn't execute query");
	
	
	
		$returned = mysql_num_rows($result);
	
	if ($returned > 0) {
	
	$row = mysql_fetch_array($result);
	
		
			
			
			}
			
			
			if ($highbidder == $row["thisCharName"]) {
			echo'<br /><strong>You are the current highest bidder</strong>';
			} else {
				echo'<br />Current Bidder: '.$highbidder;
				}
			}
			
			echo'</p>'."\n";
			echo'<p>';
			if ($endTime <= time()) {
			echo'This auction has ended.</p>."\n".<p>';
		} else {
			echo'Ends in '.timeRemaining($timeToEnd)."\n";
			}
			echo'<br />Seller: '.$sellerName."\n";
			echo '<img src="/data/chr'.$sellerID.'/portrait.jpg" width="84" height="85" alt="'.$sellerName.'\'s portrait" />';
			


			
			echo'</p>'."\n";
			
		
		// check is a current item:
		if ($endTime > time()) {
			
		
			echo '<form action="PlaceBid.php" method="post" name="placebidform" />'."\n";
			echo '<input type="hidden" name="item" value="'.$auctionitemID.'" />'."\n";
			echo '<input type="hidden" name="sellerid" value="'.$sellerID.'" />'."\n";
			echo '<input type="hidden" name="itemgraphic" value="'.$itemGraphic.'" />'."\n";
			echo '<input type="hidden" name="itemquantity" value="'.$itemquantity.'" />'."\n";
			echo '<input type="submit" name="bidbutton" value="place bid" />'."\n";
			echo '</form>';
			
			
			
			if ($buyItNowPrice != '-1') {
				echo'<br />Buy it now for '.formatCurrency($buyItNowPrice);
				
				echo '<form action="BuyNow.php" method="post" name="buynowform" />'."\n";
			echo '<input type="hidden" name="item" value="'.$auctionitemID.'" />'."\n";
			echo '<input type="hidden" name="sellerid" value="'.$sellerID.'" />'."\n";
			echo '<input type="hidden" name="itemgraphic" value="'.$itemGraphic.'" />'."\n";
			echo '<input type="hidden" name="itemquantity" value="'.$itemquantity.'" />'."\n";
			echo '<input type="submit" name="buybutton" value="buy now" />'."\n";
			echo '</form>';
				
			}
		}
		
	} else {
		echo'<p class="error">Not a valid auction number</p>';
	}


} else {
echo'<p class="error">Not a valid auction number</p>';
}









include($_SERVER['DOCUMENT_ROOT']."/includes/close.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/footer.inc");
?>