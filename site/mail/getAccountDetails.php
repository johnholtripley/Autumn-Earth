<?php

include($_SERVER['DOCUMENT_ROOT']."/includes/session.php");

// check if the user is logged in:
if (@$_SESSION['username']) {
	echo 'Accreturn=logged';
} else {
	echo 'Accreturn=notlogged';
}

// get location of the swf that made the request:
// (although maybe HTTP_HOST is safer as REFERER can be modified)
echo '&Accref='.$_SERVER['HTTP_REFERER'];
?>