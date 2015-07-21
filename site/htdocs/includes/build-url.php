<?php
// check for any GET data:
$getdata = "";
if (isset($HTTP_GET_VARS)) {
foreach($HTTP_GET_VARS as $key => $value) {
if ($key != "action") {
// don't save any action commands (so if log out, then reaction to action isn't preserved on refreshed page) or style options
	if ($getdata != "") {
		// if there's more than one piece of GET data, then need to add an &
		$getdata .= "&";
	}
		$getdata .= $key . "=" . $value;
	}
}
}
// create full URL with GET data added (if any)
$thisurl = $_SERVER['PHP_SELF'];
if ($getdata != "") {
	$thisurl .= "?".$getdata;
}
?>