<?php
include($_SERVER['DOCUMENT_ROOT']."/includes/session.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/functions.php");

$months = array("null","January","February","March","April","May","June","July","August","September","October","November","December");

// set up dummy entries for user entered values
$processedaccname = "";
$processedemailaddr = "";

$pnewsletter = "1";
$palerts = "1";
$pupdates = "1";
$phtmlemail = "1";

$error = "";
// check if submit button has been pressed:
if (isset($_POST["createbutton"])) {
if ($_POST["createbutton"] == 'Create Account') {
	// validate form:
	if ($_POST["pword"] == "") {
		$error = "please enter a password";
	}

	if(!eregi("^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$", $_POST["emailaddr"])) {
		$error = "please enter a valid email address";
	}
	
	if (trim($_POST["pword"]) != trim($_POST["cpword"])) {
		$error = "passwords do not match - please re-enter them";
	}
	
	
	if (!(checkdate($_POST["bmonth"], $_POST["bday"], $_POST["byear"]))) {
		$error = "date is not valid - please re-enter it";
	
	}
	
	if (isset($_POST["terms"])) {
	if ($_POST["terms"] != "agreed") {
		$error = "you must agree to the terms and conditions";
	}
} else {
	$error = "you must agree to the terms and conditions";
}
	
	if ($_POST["accname"] == "") {
		$error = "please enter a name for this account";
	}
	
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
	
	$processedaccname = (htmlCharsToEntities(trim(cleanText($_POST["accname"]))));
	$processedemailaddr = (htmlCharsToEntities(trim($_POST["emailaddr"])));
	
	$processedsignature = (htmlCharsToEntities(cleanText($_POST["signature"])));
	$processedpword = trim($_POST["pword"]);
	$pwordkey = $dbpk . strtolower(substr($processedaccname, 0, 2));
	// convert date to standard:
	$processeddate = $_POST["byear"] . "-" . $_POST["bmonth"] . "-" . $_POST["bday"] . " 00:00:00";
	
	// query to establish if account name is unique:

	$query = "SELECT * FROM tblAcct WHERE accountName='" . $processedaccname . "'";
	$result = mysqli_query($connection, $query) or die ("couldn't execute query");
	
	$returned = mysqli_num_rows($result);
	
	if ($returned > 0) {
		// name already exists
		$error = "This account name already exists - please choose another";
	}
	
	if ($error == "") {
		// everything is valid:
			
			
		// create unique id:
		$randomuniqueid = md5(uniqid(mt_rand()));
		// check to make sure this id hasn't already been used
		$query2 = "select accountID from tblacct where uniqueID = '".$randomuniqueid."'";
		$result2 = mysqli_query($connection, $query2) or die ("Error - please try again later");
		while (mysqli_affected_rows()) {
			$randomuniqueid = md5(uniqid(mt_rand()));
			$query2 = "select accountID from tblacct where uniqueID = '".$randomuniqueid."'";
			$result2 = mysqli_query($connection, $query2) or die ("Error - please try again later");
		}
		
		$usersIP = $_SERVER["REMOTE_ADDR"];
			
		$query = "INSERT INTO tblacct (accountName, accountStatus, joinedTime, accountType, postCount, currentCharID, email, birthday, subscribeNews, subscribeUpdates, password, signature, htmlemail, emailalerts, uniqueID, usersIPAddress)
		VALUES ('" . $processedaccname . "','2',NOW(),'0','0','1', '" . $processedemailaddr . "', '" . $processeddate . "','" . $processednews . "','" . $processedupdates . "',AES_ENCRYPT('" . $processedpword . "','" . $pwordkey . "'), '".$processedsignature."','".$processedhtmlemail."','".$processedalerts."', '".$randomuniqueid."','".$usersIP."')";
		
		
		
		
		
		$result = mysqli_query($connection, $query) or die ("couldn't execute query");
		
		
		// set session value:
		$_SESSION['username'] = $processedaccname;
		// 
		
		if ($processedhtmlemail == "1") {
		// send html mail:
		
		$message = '
		<html>
		<head>
		<title>testing mail function</title>
		</head>
		<body>
		<h1>'.$processedaccname.' - welcome to Autumn Earth</h1>
		<p>all good</p>
		<p><a href="http://www.autumnearth.com/development/" target="_blank" title="click to visit the site">visit the site</a></p>
		</body>
		</html>
		';
	// ########## check htmlemail value to determine if html or text email
		// To send HTML mail, the Content-type header must be set
		$headers = "From:Autumn Earth<admin@autumnearth.com>\r\nContent-type:text/html;charset=iso-8859-1";
	
	} else {
	
	// send text mail:
	


$message = $processedaccname. " - welcome to Autumn Earth
all good
http://www.autumnearth.com/development/";
$headers = "From:Autumn Earth<admin@autumnearth.com>";
	
	}
	
	
	$subject = 'Autumn Earth account details';
	
	
	/*
	// temporarily disable mail until it's made secure
	// ##################
	//
		if (mail($_POST["emailaddr"],$subject,$message,$headers)) {
			$mailsent = 1;
		} else {
			$mailsent = 0;
		}
	*/	
		
		header("Location: AccountCreated.php?mail=" . $mailsent);
	} else {
	// save the posted values to re-populate the form
	$pnewsletter = $_POST["newsletter"];
	$pupdates = $_POST["updates"];
	$psignature = $_POST["signature"];
	$phtmlemail = $_POST["htmlemail"];
	$palerts = $_POST["alerts"];
	}
	
	
}
}

// set up values for the form, including what the user has already entered if the form is submitted before it's complete


$ebday = -1;
$ebmonth = -1;
$ebyear = -1;

if (isset($_POST["accname"])) {
$eaccname = $_POST["accname"];
}
if (isset($_POST["emailaddr"])) {
$eemailaddr = $_POST["emailaddr"];
}
if (isset($_POST["bday"])) {
$ebday = $_POST["bday"];
}
if (isset($_POST["bmonth"])) {
$ebmonth = $_POST["bmonth"];
}
if (isset($_POST["byear"])) {
$ebyear = $_POST["byear"];
}

	
$pagetitle="Create Account";
// hide the contextual help boxes:
$onloadfunc = "hideHelp";
include($_SERVER['DOCUMENT_ROOT']."/includes/header.php");
?>

<h1>Create Account</h1>

<?php

if ($error != "") {
// display error message if there is one:
echo "<p>$error</p>";
}

?>

<form name="newaccountform" method="POST" action="<?php echo $thisurl ?>">

<label for="accname">Account Name* </label><input name="accname" type="text" id="accname" value="<?php echo @$eaccname ?>" autocomplete="username"><br />
<label for="emailaddr">Email Address* </label><input name="emailaddr" type="text" id="emailaddr" automcomplete="email" value="<?php echo @$eemailaddr ?>" /><br />
<div class="ContextHelp" id="Help1"><p>The email address is only used to keep you up to date with news and events. You can choose which information you'd like to receive.</p><div class="ContextHelpBottom">&nbsp;</div></div>
<label for="pword">Password* </label><input name="pword" type="password" id="pword" autocomplete="new-password"><br />
<label for="cpword">Confirm Password* </label><input name="cpword" type="password" id="cpword" /><br />
<label for="signature">Signature </label><input name="signature" type="text" id="signature" value="<?php echo @$psignature ?>" /><br />
<label for="bday">Birthday </label>
<div class="selectWrapper"><select name="bday" id="bday" autocomplete="bday bday-day">

<?php
for($di=1; $di<32; $di++) {
	echo '<option value="' . $di .'"';
	if ($di == $ebday) {
		echo 'selected="selected"';
	}
	echo '>' . $di . '</option>';
}

echo '</select></div>';
echo '<div class="selectWrapper"><select name="bmonth" id="bmonth" autocomplete="bday bday-month">';

for($di=1; $di<13; $di++) {
	echo '<option value="' . $di .'"';
	if ($di == $ebmonth) {
		echo 'selected="selected"';
	}
	echo '>' . $months[$di] . '</option>';
}

echo '</select></div>';


// find the current year:
$thisyear = date("Y", Time());

echo '<div class="selectWrapper"><select name="byear" id="byear" autocomplete="bady bday-year">';
for($di=$thisyear; $di>1900; $di--) {
	echo '<option value="' . $di .'"';
	if ($di == $ebyear) {
		echo 'selected="selected"';
	}
	echo '>' . $di . '</option>';
}

echo '</select></div>';
?>
<div class="ContextHelp" id="Help2"><p>If you'd like to receive a birthday present every year, please enter your birthday. (This isn't changeable once it's been entered)</p><div class="ContextHelpBottom">&nbsp;</div></div>
<br /><br />
<?php

echo '<input type="checkbox"  value="1" name="alerts" id="alerts"';
if ($palerts == "1") {
echo 'checked="checked"';
}
echo '/> ';

echo '<label for="alerts"><span></span>Send an email when a new post has been made in a subscribed thread</label><br />';



echo '<input type="checkbox"  value="1" name="newsletter" id="newsletter"';
if ($pnewsletter == "1") {
echo 'checked="checked"';
}
echo '/> ';

echo '<label for="newsletter"><span></span>Send me the newsletter and notice of in-game events</label><br />';


echo '<input type="checkbox" value="1" name="updates" id="updates"';
if ($pupdates == "1") {
echo 'checked="checked"';
}
echo '/> ';
?>
<label for="updates"><span></span>Send me details of updates and patch releases as they occur</label>
<br /><br />

send emails as

<?php
if ($phtmlemail == "1") {
echo'<input type="radio" name="htmlemail" id="htmlemail1" value="1" checked="checked" /><label for="htmlemail1"><span></span>html</label> <input type="radio" name="htmlemail" id="htmlemail2" value="0" /> <label for="htmlemail2"><span></span>text</label>';
} else {
echo'<input type="radio" name="htmlemail" id="htmlemail1" value="1" /><label for="htmlemail1"><span></span>html</label> <input type="radio" name="htmlemail" id="htmlemail2" value="0" checked="checked" /> <label for="htmlemail2"><span></span>text</label>';
}
?>
 

<br />
<br />
<input type="checkbox" value="agreed" name="terms" id="terms" /> <label for="terms"><span></span>I have read and agree to the <a href="terms.php" target="_blank" title="View the Terms and Conditions">Terms and Conditions</a></label>
<p>You may also wish to view Autumn Earth's <a href="privacy.php" target="_blank" title="View the Privacy Policy">Privacy Policy</a></p>
<br /><br />




<input type='submit' name='createbutton' value='Create Account' />
</form>



<?php

include($_SERVER['DOCUMENT_ROOT']."/includes/footer.php");
?>