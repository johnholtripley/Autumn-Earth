<?php
$message = "";
include($_SERVER['DOCUMENT_ROOT']."/includes/session.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/functions.php");
$pagetitle="Autumn Earth Mail";
include($_SERVER['DOCUMENT_ROOT']."/includes/header.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/login.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/inventoryArray.php");

// check to see if any attachment needs to be added:
if ((@ $_POST["subbutton"] == "add to inventory") || (@ $_POST["jssubmit"] == 'true')) {
$primarycharid = $_POST["primarycharid"];
// get the character's name:
$query = "SELECT charName from tblcharacters where charID = '".$primarycharid."'";

$result5 = mysql_query($query) or die ("couldn't execute query");
$row5 = mysql_fetch_array($result5);
extract($row5);

// get this character's inventory
$filename = "../data/chr".$primarycharid."/base.txt";
	if (!($fp = fopen($filename, "r"))) {
		echo'<div class="Error">Couldn\'t open '.$charName.'\'s inventory</div>';
	} else {
		$data = fread($fp, filesize($filename));
		// separate the whole string into variables
		parse_str($data);
		fclose($fp);
		//

		// find the number of slots for the current bag:
		$bagslotspos = strstr($inventoryitemsarray[$currentbag][2], 'b');
		$bagslots = substr($bagslotspos,1);


		$inventorycontentsarray = Array();
		// convert inventory array from string:
		$inventorysplit = explode("/",$inventorysave);
		for ($i = 0; $i<count($inventorysplit); $i++) {
			$inventorycontentsarray[$i] = explode(",",$inventorysplit[$i]);
		}
		// check if there is room in the inventory for this item:
		
		
		
		
		$itemtoadd = $_POST["attachtype"];
		$quantitytoadd = $_POST["attachquantity"];
		$amountsuccessful = 0;
		
		
	$itempricecode = $inventoryitemsarray[$itemtoadd][2];
	$quantityremainingtobeadded = $quantitytoadd;
	// check if the item to be added is a bag:
	$bagpricecode = strstr($itempricecode, 'b');
	// set artificial very high number:
	$newbagsize = 99999;
	
	
	
	if ($bagpricecode !== false) {
		$newbagsize = substr($bagpricecode,1);
	}
	
	
	// check if the item's not a bag, or it's a smaller bag than the current one:                                                                                                                   
	if (($bagpricecode === false) || ($newbagsize<=$bagslots)) {
	
	
		// loop through array and find any existing slots:
		for ($i = 0; $i<$bagslots; $i++) {
			if ($quantityremainingtobeadded>0) {
				if ($inventorycontentsarray[$i][0] == $itemtoadd) {
					$amountavailabletothisslot = $maxitemsperslot-($inventorycontentsarray[$i][1]);
					if ($amountavailabletothisslot>0) {
						if ($amountavailabletothisslot>$quantityremainingtobeadded) {
							
							// add quantity to this slot:
							
							
						
							
							$inventorycontentsarray[$i][1] = $inventorycontentsarray[$i][1]+$quantityremainingtobeadded;
							$quantityremainingtobeadded = 0;
							// no more to be added, so exit loop:
							
							break;
						} else {
							// add what can be added:
						
							$inventorycontentsarray[$i][1] = $inventorycontentsarray[$i][1]+$amountavailabletothisslot;
							
							
							
							$quantityremainingtobeadded -= $amountavailabletothisslot;
						}
					}
				}
			}
		}
		// check if all the items have been added successfully:
		if ($quantityremainingtobeadded == 0) {
		$amountsuccessful = $quantitytoadd;
		
		} else {
			// try and find an empty slot to add the remainder to:
			for ($i = 0; $i<$bagslots; $i++) {
				if ($quantityremainingtobeadded>0) {
					if ($inventorycontentsarray[$i][0] == 1) {
					
						$inventorycontentsarray[$i][0] = $itemtoadd;
					
						if ($quantityremainingtobeadded<$maxitemsperslot) {
							$quantityremainingtobeadded = 0;
						} else {
						$inventorycontentsarray[$i][1] = $maxitemsperslot;
							$quantityremainingtobeadded -= $maxitemsperslot;
						}
					}
				}
			}
			
			if (($quantitytoadd-$quantityremainingtobeadded) == 0) {
			// none were added:
			
			$amountsuccessful = 0;
		} else {
		
			$amountsuccessful = ($quantitytoadd-$quantityremainingtobeadded);
		}
			
		}
		
	} else {
	
	
		// add new elements to the inventory array:
		for ($i = $bagslots; $i<$newbagsize; $i++) {
			array_push($inventorycontentsarray,(array('1', '0')));
		}
		//
	
			// save old bag details:
			$oldbag = $currentbag;
			// make this the current bag:
			$bagslots = $newbagsize;
			$currentbag = $itemtoadd;
			// put old bag into the new bag:
			$foundemptyslot = -1;
			for ($i = 0; $i<$bagslots; $i++) {
				if ($inventorycontentsarray[$i][0] == 1) {
					// is an empty slot
					$foundemptyslot = $i;
					break;
				}
			}
			// add to this slot:
			// will always find an empty slot as the new bag is larger  
			$inventorycontentsarray[$foundemptyslot][0] = $oldbag;
			$inventorycontentsarray[$foundemptyslot][1] = 1;
	
		// check for multiple quantities of this bag being added:
			if ($quantitytoadd>1) {
				// add multiples into free slots
				//
				// reduce quantity by 1 as the main bag has been 'added'
				$quantityremainingtobeadded--;
				// the player can't already have one of these bags, so just need to find free slots:
				for ($i = 0; $i<$bagslots; $i++) {
					if ($quantityremainingtobeadded>0) {
						if ($inventorycontentsarray[$i][0] == 1) {
							$inventorycontentsarray[$i][0] = $itemtoadd;
							if ($quantityremainingtobeadded<$maxitemsperslot) {
								$inventorycontentsarray[$i][1] = $quantityremainingtobeadded;
								$quantityremainingtobeadded = 0;
							} else {
								$inventorycontentsarray[i][1] = $maxitemsperslot;
								$quantityremainingtobeadded -= $maxitemsperslot;
							}
						}
					}
				}
				
				$amountsuccessful =  ($quantitytoadd-$quantityremainingtobeadded);
				
			} else {
			
				$amountsuccessful = $quantitytoadd;
				
			}
	}
	

		
		
		
		
		
		
		
		
		if ($amountsuccessful == $quantitytoadd) {
			// remove from tblMail
			$thismail = $_POST["mailid"];
			$query = "update tblmail set AttachmentType = '0', AttachmentQuantity = '0' where mailID='".$thismail."'";
			$result = mysql_query($query) or die ("couldn't execute query1");
			// add to inventory:
			
			
			// rebuild the inventory string:
		$inventorysplit = Array();
		for ($i=0; $i<count($inventorycontentsarray); $i++) {
			$inventorysplit[$i] = implode(",",$inventorycontentsarray[$i]);
		}
		$inventorystring = implode("/",$inventorysplit);
		// rebuild the entire string:
		$toSave = "codeversion=" . $codeversion . "&playsounds=" . $playsounds . "&herox=" . $herox . "&heroy=" . $heroy . "&money=" .$money . "&dowseskill=" . $dowseskill  . "&famskill=" . $famskill  . "&currentmapnumber=" . $currentmapnumber . "&currentbag=" . $currentbag . "&heightgained=" . $heightgained . "&inventorysave=" . $inventorystring . "&journalsave=" . $journalsave . "&questsstatus=" . $questsstatus . "&petsave=" . $petsave . "&charname=" . $charname; 
		
		
		
		// write string:
		
		
		
		if($fs=fopen($filename,"w")) {
			fwrite($fs, $toSave); 
			fclose($fs);
		}
			
			
			
			$message = "Item successfully added to ".$charName."'s inventory.";
			
		} else {
			// no room
			$message = "There isn't room in ".$charName."'s inventory.";
		}

	}

}

echo'<h1>Mail</h1>';
echo'<p><a href="/mail/" title="View Mail">View inbox</a> | <a href="SendMail.php" title="Send Mail">Send Mail</a> | <a href="Archive.php" title="View your Archive">View Archive</a> | <a href="SentMail.php" title="View your sent mail">View Sent Mail</a></p>';

// ensure that the user is logged in:
if (@$_SESSION['username']) {
	// display mail 

// get GET data - check it's numeric and check that it does belong to the session user:
$mailarticle = $_GET["item"];
if (is_numeric($mailarticle)) {


$query = "SELECT tblMail.*, tblacct.accountID, tblacct.accountName as useracctid, tblacct.currentCharID as currentcharacterid, tblcharacters.charname
FROM tblMail
INNER JOIN tblacct on tblMail.accountID = tblacct.accountID
left join tblcharacters
on tblmail.characterID=tblcharacters.charID
WHERE (tblacct.accountName='".$_SESSION['username']."' OR  tblMail.senderName='".$_SESSION['username']."') AND tblMail.mailid = '".$mailarticle."'";



$result = mysql_query($query) or die ("couldn't execute query2");
	
		$returned = mysql_num_rows($result);
	
	if ($returned > 0) {
	
	 $row = mysql_fetch_array($result);
		
		extract($row);
	
	if ($characterID=='0') {
			// use account name:
			$characterID = $useracctid;
			$primarycharid = $currentcharacterid;
			// ##### show account mail icon
		} else {
			// use character name derived from query
			$primarycharid = $characterID;
			$characterID = $charname;
			
			// ##### show character mail icon
		}
	
	?>
	
	<div id="tooltipinv" class="ttip">
<div class="ttiptop">
<div id="ttipdyn"><p>click to add to inventory</p></div>
	</div>
	<div class="ttipbottom">&nbsp;</div>
</div>
	
	<?php
	
	if ($message != "") {
	echo'<h3>'.$message.'</h3>';
	}
	
	// display mail
	$sentTime = strtotime($sentTime);
	
	echo'<h2>'.$title.'</h2>';
	echo'<p>mail item for '.$characterID.' from '.$senderName.' sent on '.date("jS F Y",$sentTime) .' at '.  date("G.i",$sentTime).'</p>';
	
	echo'<p>'.parseCode($mailContents).'</p>';
	
	// check for attachments:
	if ($AttachmentType > 0) {
	
	
	
	echo'<div id="attacheditem" style="background: url(/assets/inventory/'.$AttachmentType.'.jpg);">';
	
	echo'<a href="/no_javascript.html" onmouseover="dyntooltip(\'tooltipinv\',\''.$inventoryitemsarray[$AttachmentType][0].'\');" onmouseout="exit(\'tooltipinv\');" onclick="addItem();return false;">';	
	echo'<img src="/assets/inventory/quantity'.$AttachmentQuantity.'.gif" width="64" height="64" name="attachedimage" id="attachedimage" /></a></div>';
	echo'<form name="attachmentForm" id="attachmentForm" method="post" action="'.$thisurl.'">';
	echo'<input type="hidden" name="attachtype" id="attachtype" value="'.$AttachmentType.'" />';
	echo'<input type="hidden" name="attachquantity" id="attachquantity" value="'.$AttachmentQuantity.'" />';
	echo'<input type="hidden" name="primarycharid" id="primarycharid" value="'.$primarycharid.'" />';
	echo'<input type="hidden" name="mailid" id="mailid" value="'.$mailarticle.'" />';
	echo'<input type="hidden" name="jssubmit" id="jssubmit" value="false" />';
	echo '<input type="submit" name="subbutton" value="add to inventory" />';
	echo'</form>';
	}
	
	if ($senderID > 0) {
	// is from another user:
	echo'<p><a href="SendMail.php?replyto='.$mailarticle.'" title="Send a reply">send reply</a></p>';
	}
	echo'<p><a href="mailto:reports@autumnearth.com?subject=Reporting Mail Policy Infringment" title="Report this mail item">Report this mail item</a></p>';
	
	if ($mailRead == '0') {

		// has been read now, so set status to '1'
		$query = "UPDATE tblMail SET mailRead = '1' WHERE mailID='".$mailarticle."'";
		$result2 = mysql_query($query) or die ("couldn't execute query3");
		// check if that was the last piece of un-read mail and update session value if needed
		
		$query = "SELECT tblMail.*, tblacct.accountID, tblacct.accountName as useracctid
	FROM tblMail
	INNER JOIN tblacct on tblMail.accountID = tblacct.accountID
	WHERE tblacct.accountName='".$processedlogin."' and tblmail.mailread = '0'";
		$result3 = mysql_query($query) or die ("couldn't execute query2");
		
			$returned3 = mysql_num_rows($result3);
		
		if ($returned3 == 0) {
		 // user has no more mail un-read - alter session:
		 $_SESSION['hasmail'] = "false";
		}
	
	}
	
	} else {
	// probably not their mail:
	echo'<div class="Error">You cannot view this mail item</div>';
	}


} else {
echo'<div class="Error">invalid mail item</div>';
}



} else {
	echo'<div class="Error">You must be logged in to check your mail</div>';
}



include($_SERVER['DOCUMENT_ROOT']."/includes/footer.php");
?>