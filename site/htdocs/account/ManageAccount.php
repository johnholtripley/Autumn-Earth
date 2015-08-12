<?php
include($_SERVER['DOCUMENT_ROOT']."/includes/session.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/functions.php");



$error = "";


// set up values for the form
$thisurl = $_SERVER["PHP_SELF"];

$eaccname = $_SESSION['username'];

$processedbirthday = null;
if(isset($processedbirthday)) {
$processedbirthday = $_POST["processedbirthdate"];
}
// check if submit button has been pressed:

if(isset($_POST["createbutton"])){
if ($_POST["createbutton"] == 'Update Account') {
	// validate form:
	if ($_POST["pword"] == "") {
	$error = "please enter a password";
	}
	
	if(!eregi("^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$", $_POST["emailaddr"])) {
		$error = "please enter a valid email address";
	}
	
	// check that the password is correct before making changes:
	
	$processedpword = trim($_POST["pword"]);
	$pwordkey = $dbpk . strtolower(substr($eaccname, 0, 2));
	
	$query = "SELECT * FROM tblAcct WHERE accountName='" . $eaccname . "' AND password=AES_ENCRYPT('" . 		$processedpword . "','" . $pwordkey . "')";
	$result = mysql_query($query) or die ("couldn't execute query1");
	
	$returned = mysql_num_rows($result);
	
	if ($returned < 1) {
		// name and password do not match
		$error = "password was incorrect - please try again";
	}
	
	if ($error == "") {
	// everything is valid:
	//
	
	
	if ($_POST["updates"] == "1") {
		$processedupdates = "1";
	} else {
		$processedupdates = "0";
	}
	
	if ($_POST["newsletter"] == "1") {
		$processednews = "1";
	} else {
		$processednews = "0";
	}
	
		if ($_POST["htmlemail"] == "1") {
		$processedhtmlemail = "1";
	} else {
		$processedhtmlemail = "0";
	}
	
		if ($_POST["alerts"] == "1") {
		$processedalerts = "1";
	} else {
		$processedalerts = "0";
	}
	
	$processedemailaddr = (htmlCharsToEntities(trim($_POST["emailaddr"])));
	

	
	$processedcharid = $_POST["charselect"];
	
	$processedsignature = (htmlCharsToEntities(cleanText($_POST["signature"])));
	
	
	$query = "UPDATE tblacct SET email='" . $processedemailaddr . "', subscribeNews = '" . $processednews . "', subscribeUpdates='" . $processedupdates . "', signature = '".$processedsignature."', htmlemail = '".$processedhtmlemail."', emailalerts = '".$processedalerts."', currentCharID ='".$processedcharid."'
	WHERE accountname = '" . $eaccname . "'";
	$result = mysql_query($query) or die ("couldn't execute query2");
	
	
	
	
	
	header("Location: AccountUpdated.php");
	} else {
		// save the posted values to re-populate the form
		$pnewsletter = $_POST["newsletter"];
		$pupdates = $_POST["updates"];
		$pemailaddr = $_POST["emailaddr"];
		$psignature = $_POST["signature"];
		$phtmlemail = $_POST["htmlemail"];
		$palerts = $_POST["alerts"];
		
		
	}

}
} else {

// get data
$query = "select * from tblacct where accountname = '" . $eaccname . "'";
$result = mysql_query($query) or die ("couldn't execute query3");

$returned = mysql_num_rows($result);
// check that something is returned
if ($returned == "1") {
$row = mysql_fetch_array($result);
extract($row);

$pemailaddr = stripslashes($email);


// strip off time from birthday:
$birthday = strtotime($birthday);
$processedbirthday = date('jS F',$birthday);
//
$pnewsletter = $subscribeNews;
$pupdates = $subscribeUpdates;
$phtmlemail = $htmlemail;
$palerts = $emailalerts;
$psignature = stripslashes($signature);
} else {
$error = "Couldn't load account information - please try again later";
}
}

$pagetitle="Manage Account";
include($_SERVER['DOCUMENT_ROOT']."/includes/header.php");
?>

<h1>Manage Account</h1>
<?php

if ($error != "") {
// display error message if there is one:
echo '<div class="Error">'.$error.'</div>';
}

?>
Account Name: <?php echo stripslashes($eaccname) ?><br />
<form name="accountform" method="POST" action="<?php echo $thisurl ?>">
  
  <label for="emailaddr">Email Address* </label>
  <input name="emailaddr" type="text" id="emailaddr" value="<?php echo $pemailaddr ?>" />
  <br />
  <label for="pword">Password* </label>
  <input name="pword" type="password" id="pword" />
  <br />
  <label for="signature">Signature </label><input name="signature" type="text" id="signature" value="<?php echo @$psignature ?>" /><br />
  <br />
  birthday: <?php echo $processedbirthday ?><br />
  <?php
echo '<input type="hidden" name="processedbirthdate" id="processedbirthdate" value="' . $processedbirthday . '" />';

echo '<input type="checkbox"  value="1" name="alerts" id="alerts"';
if ($palerts == "1") {
echo 'checked="checked"';
}
echo '/> ';

echo '<label for="alerts">Send an email when a new post has been made in a subscribed thread</label><br />';

echo '<input type="checkbox" value="1" name="newsletter" id="newsletter"';
if (@ $pnewsletter == "1") {
echo 'checked="checked"';
}
echo '/> ';
?>
  <label for="newsletter">Send me the newsletter and notice of in-game events</label>
  <br />
  <?php
echo '<input type="checkbox" value="1" name="updates" id="updates"';
if (@ $pupdates == "1") {
echo 'checked="checked"';
}
echo '/> ';
?>
  <label for="updates">Send me details of updates and patch releases as they occur</label>
  <br /><br />
  
  send emails as

<?php
if ($phtmlemail == "1") {
echo'<input type="radio" name="htmlemail" id="htmlemail1" value="1" checked="checked" /> <label for="htmlemail1">html</label> <input type="radio" name="htmlemail" id="htmlemail2" value="0" /> <label for="htmlemail2">text</label>';
} else {
echo'<input type="radio" name="htmlemail" id="htmlemail1" value="1" /> <label for="htmlemail1">html</label> <input type="radio" name="htmlemail" id="htmlemail2" value="0" checked="checked" /> <label for="htmlemail2">text</label>';
}
?>

  <br />
  
  <?php
// get the characters associated with this account:
$query = "SELECT tblCharacters.*, tblacct.accountid, tblacct.accountname, tblacct.currentCharID
from tblcharacters
inner join tblacct on tblacct.accountid = tblcharacters.accountid
WHERE tblacct.accountname='".$_SESSION['username']."'";
	$result = mysql_query($query) or die ("couldn't execute query");
$numberofrows = mysql_num_rows($result);

	if ($numberofrows > 1) {
	$c = 0;
	// there is only characters associated with this account
	while ($row = mysql_fetch_array($result)) {
	extract($row);
	
	if ($_POST["createbutton"] == 'Update Account') {
	// use saved result (if the submit has been pressed)
		$pcurrentCharID = $_POST["charselect"];

		} else {
		$pcurrentCharID = $currentCharID;
		}
	
	
	echo '<img src="/data/chr'.$charID.'/portrait.jpg" width="84" height="85" alt="'.$charName.'\'s portrait" />';
	
	echo '<input type="radio" value="'.$charID.'" name="charselect" id="charsel'.$c.'" ';
	
	if ($pcurrentCharID == $charID) {
	echo 'checked="checked" ';
	}
	
	echo '/><label for="charsel'.$c.'"><strong>'.$charName.'</strong> - currently in '.$location.'</label><br />';
	$c ++;
	}

	
	} else if ($numberofrows == 1) {
	$row = mysql_fetch_array($result);
	extract($row);
	echo '<img src="/data/chr'.$charID.'/portrait.jpg" class="characterPortrait" alt="'.$charName.'\'s portrait" />';
	
	echo '<input type="hidden" value="'.$charID.'" name="charselect" id="charsel0" />';
	}
?>
  
  
  
  
  <br />
  <input type='submit' name='createbutton' value='Update Account' />
</form>
<br />



<p><a href="ChangeDetail.php">Change password</a></p>
<p><a href="/forum/ViewAccountPosts.php">View all threads you have posted in</a></p>
<p><a href="ManageSubscriptions.php">Manage Subscriptions</a></p>
<p>please email <a href="#">support@</a> if you have any difficulties with your account</p>
<?php

include($_SERVER['DOCUMENT_ROOT']."/includes/footer.php");
?>
