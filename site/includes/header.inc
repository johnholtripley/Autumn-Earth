<?php


// check if submit button has been pressed:
// (use hidden form field not submit button as IE doesn't recognise the 'value'
if (isset($_POST["logincheck"])) {
if ($_POST["logincheck"] == 'posted') {

	$processedlogin = htmlCharsToEntities(trim($_POST["loginname"]));
	$processedpassword = htmlCharsToEntities(trim($_POST["pword"]));
	$pwordkey = "AsOiD" . strtolower(substr($processedlogin, 0, 2));
	 $query = "SELECT * FROM tblAcct WHERE accountName='" . $processedlogin . "' AND password=AES_ENCRYPT('" . 		$processedpassword . "','" . $pwordkey . "')";
	// $query = "SELECT * FROM tblAcct WHERE accountName='" . $processedlogin . "'";
	$result = mysql_query($query) or die ("couldn't execute query");
	
	$returned = mysql_num_rows($result);
	



	if ($returned > 0) {
		// name exists, and passwords match
		// check account type:
		$row = mysql_fetch_array($result);
		extract($row);

		switch ($accountType) {
		case "1":
			$ismod = true;
			$isadmin = false;
		break;
		case "2":
			$ismod = false;
			$isadmin = true;
		break;
		default:
			$ismod = false;
			$isadmin = false;
		}
		
		// check for mail:
			$query = "SELECT tblMail.*, tblacct.accountID, tblacct.accountName as useracctid FROM tblMail INNER JOIN tblacct on tblMail.accountID = tblacct.accountID WHERE tblacct.accountName='".$processedlogin."' and tblmail.mailread = '0'";
	$result = mysql_query($query) or die ("couldn't execute query2");
	
		$returned = mysql_num_rows($result);

	if ($returned > 0) {
		// user has new mail
		$hasmail = "true";
	} else {
		$hasmail = "false";
	}
		
	// set session values



	$_SESSION['username'] = $processedlogin;
	$_SESSION['ismod'] = $ismod;
	$_SESSION['isadmin'] = $isadmin;
	$_SESSION['hasmail'] = $hasmail;
	



	// check for remember me feature - cookies need to be set before any output

	if ($_POST["rememberme"] == "yes") {
		// set cookie:
		// expires in 30 days (60*60*24*30)
		// encrypt password for cookie:
		$processedpassword = crypt(trim($_POST["pword"]), $cryptSalt);
		$processedlogin = trim($_POST["loginname"]);
		//$cookiepwd = crypt($processedpassword);
		setcookie("remembername", $processedlogin, time()+2592000, "/");
		setcookie("rememberp", $processedpassword, time()+2592000, "/");
	}

		
	} else {
	 
	session_destroy();
	//unset($username, $_SESSION['username'], $isadmin, $_SESSION['isadmin'], $ismod, $_SESSION['ismod'], $hasmail, $_SESSION['hasmail']);
	

	$loginerror = "account name and password were incorrect - please try again";

	}

}
} 


// check for style selection:
$stylecookie = "";
if (isset($_POST["style"])) {

	if (isset($_POST["styleDefault"])) {
		$chosenstyle = $_POST["style"];
	} else {
		$chosenstyle = $_POST["default"];
	}
	if (($chosenstyle == "default") || ($chosenstyle == "accessible")) {
		//  write cookie:
		// expires in 365 days (60*60*24*365)
		setcookie("stylechosen", $chosenstyle, time()+31536000, "/");
		$stylecookie = $chosenstyle;
	}
} else {
	// try and read style cookie:
	if (isset($_COOKIE['stylechosen'])) {
		$stylecookie = $_COOKIE['stylechosen'];
	}
}




$loggedout = false;

if (@ $_POST["subbutton"] == 'log out') {
	// remove cookies:
	setcookie("remembername", "", time()-2592000, "/");
	setcookie("rememberp", "", time()-2592000, "/");
	// log out and remove session
	session_destroy();
	unset($username, $_SESSION['username'], $isadmin, $_SESSION['isadmin'], $ismod, $_SESSION['ismod'], $hasmail, $_SESSION['hasmail']);
	$loggedout = true;
}


// check for voting on a poll:
if (isset($_POST["mainPollButton"])) {
if ($_POST["mainPollButton"] == "Vote") {
	$vote = $_POST["pollOption"];
	$query = "update tblmainpollchoices set voteCount=voteCount+1 where choiceID='".$vote."'";
	$result = mysql_query($query) or die ("couldn't execute poll query");
	header("Location: ViewPollResults.php?poll=".$_POST["pollID"]);
	
}
}

?>


<!doctype html>
<html lang="en-gb">
<head>
<?php

if ($_SERVER['PHP_SELF'] == '/forum/ViewThread.php') {
	$pagetitle = 'Autumn Earth Community Forum Thread';
	$metadesc = 'A discussion on the Autumn Earth Community Site';
	// query database to find meta information
	$metathread = $_GET["thread"];
	if (is_numeric($metathread)) {
		$query = "select tblthreads.*, tblposts.postcontent, tblposts.CreationTime from 
		tblthreads inner join
		tblposts on tblthreads.threadid = tblposts.threadid
		where tblthreads.threadID='".$metathread."' order by tblposts.CreationTime limit 1
		";
		$result = mysql_query($query) or die ("couldn't execute query1");
		$numberofrows = mysql_num_rows($result);
		if ($numberofrows > 0) {
			$row = mysql_fetch_array($result);
			extract ($row);
			$pagetitle = stripCode($title).' - a discussion on the Autumn Earth Community Site';
			$metadesc = '\''.stripcode($postcontent).'\' - a discussion on the Autumn Earth Community Site';
		}
	}
}



if (!(isset($pagetitle))) {
$pagetitle="Autumn Earth";
}

echo '<title>'.$pagetitle .'</title>'."\n";
?>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">
<?php
if (!(isset($metadesc))) {
	$metadesc="Autumn Earth Community Forums";
}
echo '<meta content="'.$metadesc.'" name="description" />'."\n";
?>

<meta http-equiv="content-type" content="text/html; charset=iso-8859-1"  />
<meta http-equiv="imagetoolbar" content="no"  />
<meta name="MSSmartTagsPreventParsing" content="TRUE"  />
<meta name="robots" content="noodp" />

<?php // allows for animated favicons in firefox: ?>
<link rel="shortcut icon" href="favicon.ico" />
<link rel="shortcut icon" href="favicon.gif" type="image/gif" />


<?php
// check for refresh data:
if (isset($metarefresh)) {
	echo '<meta content="2;url='.$metarefresh.'" http-equiv="refresh" />'."\n";
}
?>


<link rel="alternate" type="application/rss+xml" title="RSS 2.0" href="http://www.autumnearth.com/feed/" />
<link rel="alternate" type="application/atom+xml" title="Atom 1.0" href="http://www.autumnearth.com/feed/atom.php" />


<link rel="stylesheet" href="/css/global.css" type="text/css" media="all" />
<link rel="stylesheet" href="/css/print.css" type="text/css" media="print" />

<?php
if ($stylecookie != "") {
	if ($stylecookie == "default") {
		echo '<link rel="stylesheet" title="default style" href="/css/default.css" type="text/css" media="screen" />'."\n";
		echo '<link rel="alternate stylesheet" title="accessible style" href="/css/accessible.css" type="text/css" media="screen" />'."\n";
	} else {
		echo '<link rel="alternate stylesheet" title="default style" href="/css/default.css" type="text/css" media="screen" />'."\n";
		echo '<link rel="stylesheet" title="accessible style" href="/css/accessible.css" type="text/css" media="screen" />'."\n";
	}
} else {
	echo '<link rel="stylesheet" title="default style" href="/css/default.css" type="text/css" media="screen" />'."\n";
	echo '<link rel="alternate stylesheet" title="accessible style" href="/css/accessible.css" type="text/css" media="screen" />'."\n";
}


// use javascript to write out style to hide any dynamic elements:
// (although this seems to cause problems with the page validating)
?>
<script language="javascript" type="text/javascript">
	document.write('<link rel="stylesheet" href="/css/dynamic.css" type="text/css" media="screen" />');
</script>

<?php
echo'<script language="javascript" src="/includes/core.js" type="text/javascript"></script>'."\n";
if (isset($jsinclude)) {
	echo'<script language="javascript" src="/includes/'.$jsinclude.'.js" type="text/javascript"></script>'."\n";
}
?>

</head>
<?php
$bodyattributes = "";
if (isset($onloadfunc)) {
$bodyattributes = ' onload="'.$onloadfunc.'();preloads(\'/css/tooltips/ttip_topbig.gif\',\'/css/tooltips/ttip_bottom.gif\',\'/css/login_over.gif\')"';
} else {
$bodyattributes = ' onload="preloads(\'/css/tooltips/ttip_topbig.gif\',\'/css/tooltips/ttip_bottom.gif\',\'/css/login_over.gif\')"';
}
if (isset($onunloadfunct)) {
$bodyattributes .= ' onunload="'.$onunloadfunct.'()"';
}
echo '<body'.$bodyattributes.'>'."\n";

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