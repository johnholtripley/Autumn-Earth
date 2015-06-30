<?php

include($_SERVER['DOCUMENT_ROOT']."/includes/session.inc");
include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/functions.inc");

$error="";
$multiplelist= false;
$replyto = '0';
$okToRemoveItem = false;
//


// check to see if the page has been submited by javascript when a new character has been selected:
if ($_POST["refreshInv"] == "true") {
	$mailfrom = $_POST["from"];
	if ($mailfrom == "0") {
		$mailfromname = $_SESSION['username'];
	} else {
		// get character name:
		$query = "SELECT * from tblcharacters WHERE charID='".$mailfrom."'";
		
		
		
		$result = mysql_query($query) or die ("couldn't execute query");
		$row = mysql_fetch_array($result);
		extract($row);
		
		$mailfromname = $charName;
	}
	$mailto=trim($_POST["recipient"]);
	$mailtitle=trim($_POST["messtitle"]);
	$postcontents = (cleanText($_POST["postcontents"]));
	$postedGoldamount = $_POST["attachgold"];
	$postedSilveramount = $_POST["attachsilver"];
	
} else if ($_POST["subbutton"] == "select name") {

	// tidying up has been done already, so just do query - but need strip slashes as they've been POSTed twice
	$postcontents = htmlCharsToEntities(stripslashes($_POST["postcontents"]));
	$mailfromname = stripslashes($_POST["mailfromname"]);
	$mailtitle = stripslashes($_POST["mailtitle"]);
	$senderid = $_POST["senderid"];
	
	$splitstring = explode("|||",$_POST["charselect"]);
	
	$invQuantitysubmitted = $_POST["invQuantity"];
	$invTypesubmitted = $_POST["invItemType"];
		// check for attachments:
	if (($_POST["invSlotClicked"] != 'notset') || ((isset($_POST["nojsitem"])) && (@$_POST["nojsitem"] != 'notset'))) {
		$invcharId = $_POST["InventoryUsed"];
		$invslotToUse = $_POST["invSlotClicked"];
		
		if (isset($_POST["nojsitem"])) {
			// use these values instead as JavaScript was disabled
			// send quantity as total in this slot:
			$noJSsplit = explode("|", $_POST["nojsitem"]);
			$invslotToUse = $noJSsplit[0];
			$invQuantitysubmitted = $noJSsplit[1];
			$invItemToRemove = $noJSsplit[2];
		}
		$okToRemoveItem = true;
		
	}
	
	
	$query = "INSERT INTO tblmail (accountID, senderID, senderName, characterID, title, mailContents, sentTime,mailRead,AttachmentType,AttachmentQuantity)
	VALUES ('".$splitstring[0]."','".$senderid."','".$mailfromname."','".$splitstring[1]."','".$mailtitle."','".$postcontents."',NOW(),'0','".$invTypesubmitted."','".$invQuantitysubmitted."')";
	$result = mysql_query($query) or die ("couldn't execute query");
	
	
if ($okToRemoveItem) {
// remove item from  inventory after query was successful in adding item to mail
removeItemFromInv($invcharId,$invslotToUse,$invQuantitysubmitted);
}
	
	header("Location: /mail/index.php?action=sent");
} else if ($_POST["subbutton"] == "send message") {
	$postedGoldamount = $_POST["attachgold"];
	$postedSilveramount = $_POST["attachsilver"];
	$mailto=trim($_POST["recipient"]);
	$mailtitle=trim($_POST["messtitle"]);
	$postcontents = (cleanText($_POST["postcontents"]));
	if ($mailtitle=="") {
		$mailtitle="(untitled)";
	}
	if ($postcontents=="") {
		$postcontents="(no message)";
	}
	// check for reply post data:
	if (isset($_POST["recipaccountID"])) {
		// use reply data
		$replyid = $_POST["recipaccountID"];
		$senderid= $_POST["senderacctid"];
		$mailfromname = $_POST["replysenderName"];
		$replycharid = $_POST["replycharacterID"];
		
		$invTypesubmitted = $_POST["invItemType"];
		$invQuantitysubmitted = $_POST["invQuantity"];
			// check for attachments:
	if (($_POST["invSlotClicked"] != 'notset') || ((isset($_POST["nojsitem"])) && (@$_POST["nojsitem"] != 'notset'))) {
		$invcharId = $_POST["InventoryUsed"];
		$invslotToUse = $_POST["invSlotClicked"];
		
		if (isset($_POST["nojsitem"])) {
			// use these values instead as JavaScript was disabled
			// send quantity as total in this slot:
			$noJSsplit = explode("|", $_POST["nojsitem"]);
			$invslotToUse = $noJSsplit[0];
			$invQuantitysubmitted = $noJSsplit[1];
			$invItemToRemove = $noJSsplit[2];
		}
		$okToRemoveItem = true;
		
	}
		
		// check how much money is available:
		$query = "select money from tblcharacters where charid='".$invcharId."'";
		$result = mysql_query($query) or die ("couldn't execute query");
		$returned = mysql_num_rows($result);
		if ($returned > 0) {
			$row = mysql_fetch_array($result);
			$moneyavailable = $row["money"];
		}
		
		$moneyattached = false;
		// check if it was money being added instead of an item
		if (($postedGoldamount>0) || ($postedSilveramount>0)) {
		
			$moneyattached = true;
			$okToRemoveItem = true;
			
			if ($postedGoldamount>0) {
			// use gold icon
			$invTypesubmitted = "28";
			} else {
			 // silver icon
			 $invTypesubmitted = "27";
			}
			$invQuantitysubmitted = ($postedGoldamount*100)+$postedSilveramount;
			
			// check that they haven't added more money than the character has (if javascript is disabled):
		
		
		if ($invQuantitysubmitted > $moneyavailable) {
			$invQuantitysubmitted  = $moneyavailable;
		}
		}
		
		$query = "INSERT INTO tblmail (accountID, senderID, senderName, characterID, title, mailContents, sentTime,mailRead,AttachmentType,AttachmentQuantity)
VALUES ('".$replyid ."','".$senderid."','".$mailfromname."','".$replycharid."','".		$mailtitle."','".$postcontents."',NOW(),'0','".$invTypesubmitted."','".$invQuantitysubmitted."')";
		$result = mysql_query($query) or die ("couldn't execute query");
		
if ($okToRemoveItem) {
	if ($moneyattached) {
	// remove money:
	$query = "update tblcharacters set money='".($moneyavailable-$invQuantitysubmitted)."' where charid='".$invcharId."'";
	$result = mysql_query($query) or die ("couldn't execute query");
	
	
	
	} else {
	// remove item from  inventory after query was successful in adding item to mail
	removeItemFromInv($invcharId,$invslotToUse,$invQuantitysubmitted);
	}
}
		
	 header("Location: /mail/index.php?action=sent");
	} else {
		$mailfrom = $_POST["from"];
		if ($mailfrom == "0") {
			$mailfromname = $_SESSION['username'];
		} else {
			// get character name:
			$query = "SELECT * from tblcharacters WHERE charID='".$mailfrom."'";
			$result = mysql_query($query) or die ("couldn't execute query");
			$row = mysql_fetch_array($result);
			extract($row);
			$mailfromname = $charName;
		}
		// 
		if ($mailto=="") {
			$error='Please enter the name of the person this message is for';
		} else {
			// get sender account id
			$query = "SELECT * from tblacct WHERE accountName='".$_SESSION['username']."'";
			$result = mysql_query($query) or die ("couldn't execute query");
			$returned = mysql_num_rows($result);
			if ($returned > 0) {
				$row = mysql_fetch_array($result);
				extract($row);
				$senderid = $accountID;
			}
	
			// get recipient details
			$returnednames = array();
			// - for account names
			$query = "SELECT * from tblacct WHERE accountName='".$mailto."'";
			$result = mysql_query($query) or die ("couldn't execute query");
			$returned = mysql_num_rows($result);
			if ($returned > 0) {
				$row = mysql_fetch_array($result);
				extract($row);
				array_push($returnednames, array('id' => $accountID, 'charid' => '0', 'acctname' => $mailto));
			} 
	
			// - get character names (that aren't the sender's)
			$query2 = "SELECT tblcharacters.*, tblacct.accountName as userName
			from tblacct
			inner join tblcharacters on tblcharacters.accountid = tblacct.accountid
			WHERE tblcharacters.charName='".$mailto."' AND tblcharacters.accountID != '".$senderid."'";
			$result2 = mysql_query($query2) or die ("couldn't execute query");
			$returned2 = mysql_num_rows($result2);
			if ($returned2 > 0) {
				while ($row2 = mysql_fetch_array($result2)) {
					extract($row2);
					array_push($returnednames, array('id' => $accountID, 'charid' => $charID, 'acctname' => $userName));
				}
			}
			$returnednamescount = count($returnednames);
			if ($returnednamescount == 0) {
				$error = 'that name does not exist - please try again';
			} else if ($returnednamescount == 1) {
				// only one found - use that
				
				$invQuantitysubmitted = $_POST["invQuantity"];
				$invTypesubmitted = $_POST["invItemType"];
				
				if (($_POST["invSlotClicked"] != 'notset') || ((isset($_POST["nojsitem"])) && (@$_POST["nojsitem"] != 'notset'))) {
	
		$invcharId = $_POST["InventoryUsed"];
		$invslotToUse = $_POST["invSlotClicked"];
		
		if (isset($_POST["nojsitem"])) {
			// use these values instead as JavaScript was disabled
			// send quantity as total in this slot:
			$noJSsplit = explode("|", $_POST["nojsitem"]);
			$invslotToUse = $noJSsplit[0];
			$invQuantitysubmitted = $noJSsplit[1];
			$invItemToRemove = $noJSsplit[2];
			
		}
		$okToRemoveItem = true;
		
	}
				
		$moneyattached = false;
		// check if it was money being added instead of an item
		if (($postedGoldamount>0) || ($postedSilveramount>0)) {
			$moneyattached = true;
			$okToRemoveItem = true;
			
			if ($postedGoldamount>0) {
			// use gold icon
			$invTypesubmitted = "28";
			} else {
			 // silver icon
			 $invTypesubmitted = "27";
			}
			$invQuantitysubmitted = ($postedGoldamount*100)+$postedSilveramount;
			
			
			// check how much money is available:
			$query = "select money from tblcharacters where charid='".$invcharId."'";
			$result = mysql_query($query) or die ("couldn't execute query");
			$returned = mysql_num_rows($result);
			if ($returned > 0) {
				$row = mysql_fetch_array($result);
				$moneyavailable = $row["money"];
			}
	
			// check that they haven't added more money than the character has (if javascript is disabled):
		
		if ($invQuantitysubmitted > $moneyavailable) {
			$invQuantitysubmitted  = $moneyavailable;
		}
		}

				
				$postcontents = htmlCharsToEntities($postcontents);
				$query = "INSERT INTO tblmail (accountID, senderID, senderName, characterID, title, mailContents, sentTime,mailRead,AttachmentType,AttachmentQuantity)
	VALUES ('".$returnednames[0]['id']."','".$senderid."','".$mailfromname."','".$invcharId."','".		$mailtitle."','".$postcontents."',NOW(),'0','".$invTypesubmitted."','".$invQuantitysubmitted."')";
				$result = mysql_query($query) or die ("couldn't execute query");
				
if ($okToRemoveItem) {
if ($moneyattached) {
	// remove money:
	$query = "update tblcharacters set money='".($moneyavailable-$invQuantitysubmitted)."' where charid='".$invcharId."'";
	$result = mysql_query($query) or die ("couldn't execute query");
	
	
	} else {
	// remove item from  inventory after query was successful in adding item to mail
	removeItemFromInv($invcharId,$invslotToUse,$invQuantitysubmitted);
	}
}
				
				header("Location: /mail/index.php?action=sent");
			} else {
				// multiple found - display list:
				$multiplelist= true;
			}
		} 
	}
} else {
	// is first time
	$mailtitle="";
	$mailto="";
	$postcontents="";
	$mailfrom="0";
	$postedGoldamount = 0;
	$postedSilveramount = 0;
	// check to see if this is a response mail:
	
	if (isset($_GET["replyto"])) {
		$replyto = $_GET["replyto"];
		// get the details of the original post:
		$query = "SELECT tblMail.*, tblacct.accountID, tblacct.accountName as useracctid
		FROM tblMail
		INNER JOIN tblacct on tblMail.accountID = tblacct.accountID
		WHERE tblMail.mailid = '".$replyto."'";
		$result = mysql_query($query) or die ("couldn't execute query");
		$returned = mysql_num_rows($result);
		if ($returned > 0) {
			$row = mysql_fetch_array($result);
			extract($row);
			$mailtitle='Re: '.$title;
			$mailto=$senderName;
			$postcontents='[quote='.$senderName.']'.stripCode($mailContents).'[/quote]';
		}
	}
}


$jsinclude="addTags";
$onloadfunc="init";

include($_SERVER['DOCUMENT_ROOT']."/includes/header.inc");
include($_SERVER['DOCUMENT_ROOT']."/includes/login.inc");

echo'<h1>Send Mail</h1>';
echo'<p><a href="/mail/" title="View Mail">View Mail</a> | <a href="Archive.php" title="View your Archive">View Archive</a> | <a href="SentMail.php" title="View your sent mail">View Sent Mail</a></p>';

if ($error != "") {
echo'<div class="Error">'.$error.'</div>';
}

// ensure that the user is logged in:
if (@$_SESSION['username']) {
	// don't need to preserve GET data
	$thisurl = $_SERVER['PHP_SELF'];

	if ($multiplelist) {
		echo '<p>Found the following "'.$mailto.'"s - please select which one you want send your mail to:</p><form action="' . $thisurl . '" method="post" name="charselection">';
		for ($j=0; $j<$returnednamescount; $j++) {
			$valuestring = $returnednames[$j]['id'].'|||'.$returnednames[$j]['charid'];
			echo '<input type="radio" value="'.$valuestring.'" name="charselect" id="charsel'.$j.'" ';
			if ($j == 0) {
				echo 'checked="checked"';
			}
			echo '><label for="charsel'.$j.'">';
			if ($returnednames[$j]['charid'] == '0') {
				// is an account name:
				echo ' account name';
			} else {
				echo ' character name - belonging to '.$returnednames[$j]['acctname'];
			}
			echo'</label><br />';
		}
		echo '<input type="hidden" name="mailfromname" id="mailfromname" value="'.$mailfromname.'" />';
		echo '<input type="hidden" name="mailtitle" id="mailtitle" value="'.$mailtitle.'" />';
		echo '<input type="hidden" name="postcontents" id="postcontents" value="'.$postcontents.'" />';
		echo '<input type="hidden" name="senderid" id="senderid" value="'.$senderid.'" />';
		
		// hidden fields for inventory attachments:
		$invslotclicked = $_POST["invSlotClicked"];
		$invQuantity = $_POST["invQuantity"];
		$InventoryUsed = $_POST["InventoryUsed"];
		$invItemType = $_POST["invItemType"];
		echo '<input type="hidden" name="invSlotClicked" id="invSlotClicked" value="'.$invSlotClicked.'" />';
		echo '<input type="hidden" name="invItemType" id="invItemType" value="'.$invItemType.'" />';
		echo '<input type="hidden" name="invQuantity" id="invQuantity" value="'.$invQuantity.'" />';
		echo '<input type="hidden" name="InventoryUsed" id="InventoryUsed" value="'.$InventoryUsed.'" />';
		
		echo '<input type="submit" name="subbutton" value="select name" />';
		echo'</form>';
	} else {
	
		echo'<a href="no_javascript.html" onclick="AddTags(\'[b]\',\'[/b]\');return false;">bold</a> | ';
		echo'<a href="/no_javascript.html" onclick="AddTags(\'[i]\',\'[/i]\');return false;">italic</a> | ';
		echo'<a href="/no_javascript.html" onclick="AddTags(\'[u]\',\'[/u]\');return false;">underline</a> | ';
		echo'<a href="/no_javascript.html" onclick="AddTags(\'[s]\',\'[/s]\');return false;">strikethrough</a> | ';
		echo'<a href="/no_javascript.html" onclick="AddTags(\'[h]\',\'[/h]\');return false;">heading</a> | ';
		echo'<a href="/no_javascript.html" onclick="AddURL();return false;">add link</a> | ';
		echo'<a href="/no_javascript.html" onclick="AddImage();return false;">link to image</a>';
		echo'<br />';
		
		
		
	
	echo '<form action="' . $thisurl . '" method="post" name="postform" id="postform">';
		
		echo'<div id="QuantityPromptWrapper">';
		echo'<div id="DynQuanText"><label for="quanuserinput">Quantity?</label></div>';
		echo'<input name="quanuserinput" id="quanuserinput" type="text" />';
		echo'<a href="no_javascript.html" onclick="closeQuanPrompt(\'submit\');return false;">submit</a> <a href="no_javascript.html" onclick="closeQuanPrompt(\'cancel\');return false;">cancel</a>';
		echo'</div>';
		
		
		echo'<div id="PromptWrapper">';
		echo'<label for="userinput">Please enter the link address</label>';
		echo'<input name="userinput" id="userinput" type="text" />';
		echo'<a href="no_javascript.html" onclick="closeURLPrompt(\'submit\');return false;">submit</a> <a href="no_javascript.html" onclick="closeURLPrompt(\'cancel\');return false;">cancel</a>';
		echo'</div>';
	
		echo'<div id="PromptImgWrapper">';
		echo'<label for="imguserinput">Please enter the image path</label>';
		echo'<input name="imguserinput" id="imguserinput" type="text" />';
		echo'<a href="no_javascript.html" onclick="closeImgPrompt(\'submit\');return false;">submit</a> <a href="no_javascript.html" onclick="closeImgPrompt(\'cancel\');return false;">cancel</a>';
		echo'</div>';

		
		if ($replyto=="0") {
			
			// get the characters associated with this account:
			$query = "SELECT tblCharacters.*, tblacct.accountid, tblacct.accountname, tblacct.currentCharID
			from tblcharacters
			inner join tblacct on tblacct.accountid = tblcharacters.accountid
			WHERE tblacct.accountname='".$_SESSION['username']."'";
			$result = mysql_query($query) or die ("couldn't execute query");
			
			echo '<label for="from">From </label><select onchange="charchange()" name="from" id="from">';
			echo '<option value="0" ';
	
			if ($mailfrom == 0) {
				echo ' selected="selected"';
			}
			echo '>';
			echo $_SESSION['username'];
			echo '</option>';
			while ($row = mysql_fetch_array($result)) {
				extract($row);
				echo '<option value="'.$charID.'"';
				if ($mailfrom == $charID) {
					echo ' selected="selected" ';
				}
				echo'>'.$charName.'</option>';
			}
			
			echo '</select><br />';
			
			if ($mailfrom == 0) {
				// account name - use the primary character's inventory
				$primarycharid = $currentCharID;
			} else {
				// character name - use the selected character's inventory
				$primarycharid = $mailfrom;
			}
			
			echo '<label for="recipient">To* </label><input name="recipient" type="text" id="recipient" value="'.$mailto.'" /><br />'."\n";
			
			
			
		} else {
			// show reply data - get details of who the mail was made to:
			
			$query = "select tblmail.*, tblcharacters.charname from tblmail left join tblcharacters
on tblmail.characterID=tblcharacters.charID where tblmail.mailID = '".$replyto."'";



			$result4 = mysql_query($query) or die ("couldn't execute query");
			$row4 = mysql_fetch_array($result4);
			extract($row4);
			// the new recipient account id = the old sender account id:
			$recipaccountID = $senderID;
			// the new sender account id = the old recipient account id:
			$senderacctid = $accountID;
			//
			$originalsendername = $senderName;
			//
			if (!isset($charname)) {
				$charname=$_SESSION['username'];
				// find primary character id
				$query = "SELECT currentCharID from tblacct where accountName = '".$charname."'";
				$result8 = mysql_query($query) or die ("couldn't execute query");
				$row8 = mysql_fetch_array($result8);
				extract($row8);
				$primarycharid  = $currentCharID;
			} else {
				$primarycharid  = $characterID;
			}
			$newsendername = $charname;
			//
			
			
			
			// query to determine the new sender's character id:
			$query="select * from tblcharacters WHERE accountID='".$senderID."' and
			charName='".$originalsendername."'";
			$result3 = mysql_query($query) or die ("couldn't execute query");
			$returned3 = mysql_num_rows($result3);
			if ($returned3 > 0) {
				// found the character name:
				$row3 = mysql_fetch_array($result3);
				extract($row3);
				$charid = $charID;
			} else {
				// was an account name:
				$charid ='0';
			}
			
			echo 'From <span class="FakeInput">'.$newsendername.'</span><br />'."\n";
			echo 'To <span class="FakeInput">'.$senderName.'</span><br />'."\n";
			echo '<input type="hidden" name="recipaccountID" id="recipaccountID" value="'.$recipaccountID.'" />'."\n";
			echo '<input type="hidden" name="senderacctid" id="senderacctid" value="'.$senderacctid.'" />'."\n";
			echo '<input type="hidden" name="replysenderName" id="replysenderName" value="'.$newsendername.'" />'."\n";
			echo '<input type="hidden" name="replycharacterID" id="replycharacterID" value="'.$charid.'" />'."\n";
		}
		echo '<label for="messtitle">Message Title </label><input name="messtitle" type="text" id="messtitle" value="'.$mailtitle.'" /><br />'."\n";
		echo '<label for="postcontents">enter your message:</label><br />'."\n";
		echo '<textarea rows="8" cols="20" wrap="soft" id="postcontents" name="postcontents">'.$postcontents.'</textarea><br />'."\n";
		

		
		// hidden fields for inventory attachments:
		echo '<input type="hidden" name="invSlotClicked" id="invSlotClicked" value="notset" />'."\n";
		echo '<input type="hidden" name="invQuantity" id="invQuantity" value="0" />'."\n";
		echo '<input type="hidden" name="invItemType" id="invItemType" value="0" />'."\n";
		echo '<input type="hidden" name="refreshInv" id="refreshInv" value="false" />'."\n";
		echo '<input type="hidden" name="InventoryUsed" id="InventoryUsed" value="'.$primarycharid.'" />'."\n";
		
		
		include($_SERVER['DOCUMENT_ROOT']."/includes/inventoryArray.php");
		include($_SERVER['DOCUMENT_ROOT']."/includes/inventoryitems.php");
		
	
		echo '<p>'.$charName.' has '.formatcurrency($money).'</p>'."\n";
		
		// get amount of money readable by javascript
		echo '<script type="text/javascript">'."\n";
		echo 'moneyavailable ='.$money;
		echo '</script>'."\n";
		
		// error message display:
		echo '<div id="ErrorMessage" name="ErrorMessage" style="display:none;">'."\n";
		echo '<p>You don\'t have that much money - your full amount has been entered</p>'."\n";
		echo '</div>'."\n";
		
		
		
		// display inputs for money to attach:
		echo '<label for="attachgold">Gold </label><input name="attachgold" type="text" onchange="moneyAttached();" id="attachgold" value="'.$postedGoldamount.'" /><br />'."\n";
		echo '<label for="attachsilver">Silver </label><input onchange="moneyAttached();" maxlength="2" name="attachsilver" type="text" id="attachsilver" value="'.$postedSilveramount.'" /><br />'."\n";
		echo '<br /><br />';
		echo '<input type="submit" name="subbutton" value="send message" onclick="return checkpromptclosed();" />'."\n";
		
		echo '</form>'."\n";

		

	}

} else {
	echo'<div class="Error">You must be logged in to send mail</div>'."\n";
}


include($_SERVER['DOCUMENT_ROOT']."/includes/close.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/footer.inc");
?>