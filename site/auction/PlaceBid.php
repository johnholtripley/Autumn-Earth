<?php

include($_SERVER['DOCUMENT_ROOT']."/includes/session.inc");
include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/functions.inc");

$error="";

// check to see if the user has logged out on this page:
if (@$_POST["subbutton"] =="log out" ) {
// remove cookies:
	setcookie("remembername", "", time()-2592000, "/");
	setcookie("rememberp", "", time()-2592000, "/");
	// log out and remove session
	session_destroy();
	unset($username, $_SESSION['username'], $isadmin, $_SESSION['isadmin'], $ismod, $_SESSION['ismod'], $hasmail, $_SESSION['hasmail']);
	$loggedout = true;
header("Location: /auction/index.php");
}


// get POST data:
$auctionitemID = $_POST["item"];
// check that a valid number has been passed:

if (is_numeric($auctionitemID)) {


// check if bid has been made:
if (isset($_POST["bidamount"])) {
 
 // determine the current value:
				
// get the highest 2 bids on this item:
			
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
 
 $thisbidderid = $_POST["bidderid"];
 $goldamount = $_POST["goldamount"];
 $silveramount = $_POST["silveramount"];
 
 
 		// check how much money is available:
		$query = "select money from tblcharacters where charid='".$thisbidderid."'";
		$result = mysql_query($query) or die ("couldn't execute query");
		$returned = mysql_num_rows($result);
		if ($returned > 0) {
			$row = mysql_fetch_array($result);
			$biddermoney = $row["money"];
		}
 
 $amountalreadybid = $_POST["alreadybidamount"];

if (is_numeric($goldamount) && is_numeric($silveramount)  && is_numeric($amountalreadybid)) {
	$totalbidamount = ($goldamount*100)+$silveramount;
	
	if($totalbidamount<=$currentprice) {
	$error = "Please bid at least ".formatcurrency($currentprice+1);
	} else if ($totalbidamount>($biddermoney-$amountalreadybid)) {
	$error = "This character does not have enough money to make this bid.<br />
				 Change which character to use in <a href=\"/account/ManageAccount.php\" title=\"Click to change your primary character\">account management</a>";
	
	} else if ($totalbidamount<=$amountalreadybid) {
	$error="You have already bid an equal or higher amount of ".formatcurrency($amountalreadybid);
	
	} else {
	
	
	
			

	
	// enter bid
	
	$query = "insert into tblAuctionBids (auctionID, bidderID, bidAmount) values ('".$auctionitemID."','".$thisbidderid."','".$totalbidamount."')";
	$result = mysql_query($query) or die ("couldn't execute query");
	
	// remove money from character's inventory
	$query = "update tblcharacters set money='".(($biddermoney+$amountalreadybid)-$totalbidamount)."' where charid='".$thisbidderid."'";
	$result = mysql_query($query) or die ("couldn't execute query");
header("Location: BidSuccessful.php");

	}

} else {
$error = "Please enter a number";
}
 
 
 
 
} 


$pagetitle = "Autumn Earth Auction House";
include($_SERVER['DOCUMENT_ROOT']."/includes/header.inc");
// set this value to include the POST data if logging in on this page
$placebid = true;

include($_SERVER['DOCUMENT_ROOT']."/includes/login.inc");

echo'<h1>Autumn Earth Auction</h1>';



 if ($error!="") {


echo '<p class="Error">'.$error.'</p>';
}



$sellerid = $_POST["sellerid"];
$itemGraphic = $_POST["itemgraphic"];
$quantity = $_POST["itemquantity"];

// check if username exists in session:
if (@$_SESSION['username']) {


// get current character for this account:
$query = "select tblacct.accountID, tblacct.accountName, tblacct.currentCharID, tblcharacters.charID, tblcharacters.money as charsmoney, tblcharacters.charName AS thisCharName, tblcharacters.accountID AS charAcctID
from tblacct
inner join tblcharacters on  tblacct.currentCharID = tblcharacters.charID
where tblacct.accountName='".$_SESSION['username']."'";
$result = mysql_query($query) or die ("couldn't execute query");
	

	
		$returned = mysql_num_rows($result);
	
	if ($returned > 0) {
	
	$row = mysql_fetch_array($result);
	
		extract($row); 
	
	
	$thisbidderid = $charID;
	
			// check that the currently logged in character doesn't also belong to the seller:
			$query2 = "select * from tblcharacters
			where accountid = '".$charAcctID."'"; 
			
		
			
			$result2 = mysql_query($query2) or die ("couldn't execute query");
			
			$notseller = 0;
			while ($row = mysql_fetch_array($result2)) {
			extract($row);
			
			if ($charID == $sellerid) {
				$notseller = 1;
			}
			
			}
			if ($notseller == 1) {
			echo '<p class="Error">You cannot bid on items belonging to any characters on the same account as the character selling the item.</p>';
			} else {
				
				
				
				
				// determine the current value:
				
				// get the highest 2 bids on this item:
			
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
			
			echo '<p>'.$thisCharName.' has '.formatcurrency($charsmoney).'</p>';
			// check if they've already made a bid:
	$query6 = "select * from tblauctionbids
	where bidderID='".$thisbidderid."' and auctionid='".$auctionitemID."'
	order by bidAmount DESC";
	
	$result6 = mysql_query($query6) or die ("couldn't execute query6");
	$numberofrows6 = mysql_num_rows($result6);
	$amountAlreadyBid  = 0;
	if ($numberofrows6 > 0) {
	// this character has already bid on this item:
		$row6 = mysql_fetch_array($result6);
		$amountAlreadyBid = $row6["bidAmount"];
		echo '<p>'.$thisCharName.' has already bid '.formatcurrency($amountAlreadyBid).' on this item, and so can bid up to '.formatcurrency(($amountAlreadyBid+$charsmoney)).'</p>'."\n";
	}
				
				
				
			echo'<div class="InventorySlot" style="background-image: url(/assets/inventory/'.$itemGraphic.'.jpg);">';
			echo'<img src="/assets/inventory/quantity'.$quantity.'.gif" width="64" height="64" /></div>'."\n";
			echo'<div class="Clearer">&nbsp;</div>'."\n";
				
				
				
				
				
				// check that this character has enough money to make a higher bid:
				if ($charsmoney > $currentprice) {
				// allow bid:
				echo'<p>Current bid is '.formatcurrency($currentprice).' - please enter a bid of '.formatcurrency($currentprice+1).' or more.</p>';
				
					if ($reservePrice != "-1") {
				// check if reserve has been met:
				if ($currentprice < $reservePrice) {
					echo '<p>The reserve has not been met</p>';
				}
			}
				
				echo'<p>This bid will be taken from '.$thisCharName.'\'s money. It will be refunded if you do not win the item, or partially refunded if you win the item for less than this maximum bid.</p>'."\n";
				
				
	
				
			echo '<form action="'.$thisurl.'" method="post" name="enterbidform" />'."\n";
			echo '<label for="goldamount">enter bid amount (gold)</label>'."\n";
			echo '<input id="goldamount" type="text" name="goldamount" value="0" />'."\n";
			echo '<label for="silveramount"> enter bid amount (silver)</label>'."\n";
			echo '<input id="silveramount" type="text" name="silveramount" value="0" />'."\n";
			echo '<input type="hidden" name="item" value="'.$auctionitemID.'" />'."\n";
			echo '<input type="hidden" name="bidderid" value="'.$thisbidderid.'" />'."\n";
		
			echo '<input type="hidden" name="alreadybidamount" value="'.$amountAlreadyBid.'" />'."\n";
			echo '<input type="hidden" name="sellerid" value="'.$sellerid.'" />'."\n";
			echo '<input type="hidden" name="itemgraphic" value="'.$itemGraphic.'" />'."\n";
			echo '<input type="hidden" name="itemquantity" value="'.$quantity.'" />'."\n";
		
			
		
			
			
			echo '<br />';
			echo '<input type="submit" name="bidamount" value="place bid" />'."\n";
			echo '</form>';
				
							
				} else {
				 echo'<p class="Error">This character does not have enough money to make a higher bid.<br />
				 Change which character to use in <a href="/account/ManageAccount.php" title="Click to change your primary character">account management</a>
				 </p>';
				}
			}
					
			
	
	} else {
	echo'<p class="Error">No characters found for this account</p>';
	
	}

} else {
echo'<p class="Error">You must be logged in to place a bid</p>';
}

} else {
$pagetitle = "Autumn Earth Auction House";
include($_SERVER['DOCUMENT_ROOT']."/includes/header.inc");
// set this value to include the POST data if logging in on this page
$placebid = true;

include($_SERVER['DOCUMENT_ROOT']."/includes/login.inc");

echo'<h1>Autumn Earth Auction</h1>';
echo'<p class="Error">Not a valid auction number</p>';
}


include($_SERVER['DOCUMENT_ROOT']."/includes/close.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/footer.inc");
?>