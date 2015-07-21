<?php

include($_SERVER['DOCUMENT_ROOT']."/includes/session.php");

// check if the user is logged in:
if (@$_SESSION['username']) {
	echo 'Accreturn=logged';
} else {
	echo 'Accreturn=notlogged';
}


// get location of the swf that made the request:
if (strtolower($_SERVER['HTTP_REFERER']) == strtolower("http://www.autumnearth.com/development/chat/chatClient.swf")) {
echo '&socketPath=community.autumnearth.com/chat/chatClient.swf';
} else {
echo '&socketPath=falsepath';
}


// ############ does flash need to sendAndLoad to show up as referer??? 

 // echo '&socketPath='.$_SERVER['HTTP_REFERER'];


// print_r(array_values($_SERVER));
 
// echo '>>'.$_SERVER['HTTP_REFERER'].'<<';

?>


