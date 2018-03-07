<?php
include($_SERVER['DOCUMENT_ROOT']."/includes/session.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/functions.php");





include($_SERVER['DOCUMENT_ROOT']."/includes/header.php");

echo '<br /><br />';

// check if username exists in session or they've just logged in:
if (@$_SESSION['username']) {

// check the user's status to see if they can post:



$query = "SELECT * from tblAcct WHERE accountname = '" . $_SESSION['username'] . "'";

$result = mysqli_query($connection, $query) or die ("couldn't execute query");

$row = mysqli_fetch_array($result);
extract($row);
$useraccount = $accountID;




if ($accountStatus < 2) {

echo '<p>your account has been locked</p>';
echo '<p>please contact <a href="#">support@</a> to re-activate your account</p>';
} else {

?>
<h1>Create contract</h1>

<form>
	<fieldset>

<label for="contractType">Contract type:</label>
<select id="contractType">
	<option value="1">Transportation</option>
	<option value="2">Want to buy</option>
	</select>

choose item(s)

<!-- hide if not transportation /-->

<?php
// get current character's location:

$query = "SELECT tblAcct.*, tbllocations.locName as currentLocation, tbllocations.locID as currentLocationID, tblCharacters.charID, tblCharacters.location FROM tblAcct
INNER JOIN tblCharacters on tblCharacters.charID = tblacct.currentcharid
INNER JOIN tbllocations on tblCharacters.location = tbllocations.locID
WHERE accountname = '" . $_SESSION['username'] . "'";

$result = mysqli_query($connection, $query) or die ("couldn't execute query3");
if(mysqli_num_rows($result) >0) {
$row = mysqli_fetch_array($result);
extract($row);
echo $currentLocation;
} 
?>

<?php


$locationQuery = "SELECT * from tbllocations where locID != '".$currentLocationID."' order by locName ASC";
$locresult = mysqli_query($connection, $locationQuery) or die ("couldn't execute query3");
?>

<br>
<label for="contractStartPoint">Start point</label>
<select id="contractStartPoint">
	<option value="<?php echo $currentLocationID; ?>"><?php echo $currentLocation; ?></option>

<?php

$selectHtml = "";

if(mysqli_num_rows($locresult) >0) {
while ($row = mysqli_fetch_array($locresult)) {
extract($row);
$selectHtml .= '<option value="'.$locID.'">'.$locName.'</option>';
} 
echo $selectHtml;

}
?>	
	</select>

<label for="contractEndPoint">End point</label>
<select id="contractEndPoint">
	<option value="<?php echo $currentLocationID; ?>"><?php echo $currentLocation; ?></option>
	<?php
	echo $selectHtml;
	?>
	</select>

<!-- end hide if not transportation /-->

auto accept if:
user profile >= x
price <= y
	</fieldset>
</form>


<?php
}



} else {
echo 'you must be logged in to create a contract';
}

echo '<br /><br />';


include($_SERVER['DOCUMENT_ROOT']."/includes/footer.php");

?>