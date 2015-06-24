<?php
$pagetitle="Account Created";
include($_SERVER['DOCUMENT_ROOT']."/includes/session.inc");
include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/functions.inc");
include($_SERVER['DOCUMENT_ROOT']."/includes/header.inc");
?>


<h1>account page</h1>
<p>Your account has been created</p>

<?php
// check if mail was sent or not
if ($_GET["mail"] == 1) {
	echo '<p>An email has been sent confirming your details</p>';
} else {
	echo '<p>An email has attempted to be sent but failed - your account has been created though</p>';
}
?>





<?php
include($_SERVER['DOCUMENT_ROOT']."/includes/login.inc");
include($_SERVER['DOCUMENT_ROOT']."/includes/search.inc");
include($_SERVER['DOCUMENT_ROOT']."/includes/close.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/footer.inc");

?>