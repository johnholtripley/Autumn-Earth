<?php
include($_SERVER['DOCUMENT_ROOT']."/includes/session.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/functions.php");


$error = "";

// set up values for the form
$thisurl = $_SERVER["PHP_SELF"];

$eaccname = $_SESSION['username'];


// check if submit button has been pressed:
if ($_POST["changebutton"] == 'Update Account') {

// validate form:

// check that the password is correct before making changes:
	
	$processedpword = $_POST["pword"];
	$pwordkey = $dbpk . strtolower(substr($eaccname, 0, 2));
	
	$query = "SELECT * FROM tblAcct WHERE accountName='" . $eaccname . "' AND password=AES_ENCRYPT('" . 		$processedpword . "','" . $pwordkey . "')";
	$result = mysqli_query($connection, $query) or die ("couldn't execute query");
	
	$returned = mysqli_num_rows($result);
	
	if ($returned < 1) {
		// name and password do not match
		$error = "password was incorrect - please try again";
	}

	if ($_POST["cnword"] != $_POST["npword"]) {
	$error = "new passwords do not match - please try again";
	}

	if ($_POST["cnword"] == "") {
	$error = "please confirm your new password";
	}

	if ($_POST["npword"] == "") {
	$error = "please enter a new password";
	}

	if ($_POST["pword"] == "") {
	$error = "please enter your current password";
	}

	if ($error == "") {
	// everything is valid:
	
	$processedpword = $_POST["npword"];
	$pwordkey = $dbpk . strtolower(substr($eaccname, 0, 2));
	
	$query = "UPDATE tblacct SET password=AES_ENCRYPT('" . $processedpword . "','" . $pwordkey . "') WHERE accountname = '" . $eaccname . "'";
	$result = mysqli_query($connection, $query) or die ("couldn't execute query");
	header("Location: AccountUpdated.php");
	}

}




$pagetitle="Manage Account";
include($_SERVER['DOCUMENT_ROOT']."/includes/header.php");
?>

<h1>Manage Account</h1>

<?php
if ($error != "") {
// display error message if there is one:
echo "<p>$error</p>";
}
?>

Account Name: <?php echo stripslashes($eaccname) ?><br />


<form name="changedetailform" method="POST" action="<?php echo $thisurl ?>">
  
  <label for="pword">Current password* </label>
  <input name="pword" type="password" id="pword" /><br />

  <label for="pword">New password* </label>
  <input name="npword" type="password" id="npword" /><br />
  
    <label for="pword">Confirm new password* </label>
  <input name="cnword" type="password" id="cnword" />
<br />
  <input type='submit' name='changebutton' value='Update Account' />
  </form>

<p>please email <a href="#">support@</a> if you have any difficulties with your account</p>
<?php

include($_SERVER['DOCUMENT_ROOT']."/includes/footer.php");
?>
