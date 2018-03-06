<?php
include($_SERVER['DOCUMENT_ROOT']."/includes/session.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/functions.php");

// check if submit button has been pressed:


if(isset($_POST["subbutton"])) {
if ($_POST["subbutton"] == 'submit reply') {
// process form:
$threadID = $_POST["thread"];
$useraccountID = $_POST["useraccount"];
$postcontents = (htmlCharsToEntities(cleanText($_POST["postcontents"])));

// replace any target blanks to stop malicious code:
// https://mathiasbynens.github.io/rel-noopener/
$postcontents = str_ireplace("target='_blank'","target='_blank' rel='noopener'",$postcontents);
$postcontents = str_ireplace("target=\"_blank\"","target=\"_blank\" rel=\""noopener\"",$postcontents);
$postcontents = str_ireplace("target=_blank","target=\"_blank\" rel=\""noopener\"",$postcontents);

//

//
$query = "INSERT INTO tblPosts (threadID,accountID,creationTime,postContent,status,sticky,edited)
VALUES ('" . $threadID . "','" . $useraccountID . "',NOW(),'" . $postcontents . "','1','0','0')";



$result = mysqli_query($connection, $query) or die ("couldn't execute query1");

// find what the id of this post was:

$thispostid = mysqli_insert_id();


// update users post count:
$query = "UPDATE tblacct SET postCount = postCount+1 WHERE accountID=" . $useraccountID;
$result = mysqli_query($connection, $query) or die ("couldn't execute query2");

// update thread's latest post id:
$query = "UPDATE tblthreads SET latestPostID = ".$thispostid.", postcount = postcount+1 WHERE threadid=" . $threadID;
$result = mysqli_query($connection, $query) or die ("couldn't execute query3");


// check the user's subscriptions and add this thread to their list if required:
			$query = "select * from tblsubscribedthreads where accountID='".$useraccountID."' AND threadID='".$threadID."'";
			$result = mysqli_query($connection, $query) or die ("couldn't execute query3");
			$numberofrows = mysqli_num_rows($result);
			if ($numberofrows < 1) {
				$query = "insert into tblsubscribedthreads (accountID, threadID, status)
				values ('".$useraccountID."','".$threadID."','0')";
				$result = mysqli_query($connection, $query) or die ("couldn't execute query4");
			}

// notify other users if they have subscribed to this thread, but haven't returned


$query = "
SELECT tblsubscribedthreads.*, tblacct.accountID as useracctid, tblacct.emailalerts AS useralert, tblacct.accountName AS useracctname, tblacct.htmlemail AS usermailpref, tblacct.email AS useremail, tblThreads.title AS thisthreadTitle, tblthreads.ThreadID AS thisthreadid
FROM tblsubscribedthreads
INNER JOIN tblacct on tblsubscribedthreads.accountID = tblacct.accountID
INNER JOIN tblthreads on tblsubscribedthreads.threadid = tblthreads.threadid
WHERE tblacct.accountID = tblsubscribedthreads.accountID AND tblthreads.ThreadID = '".$threadID."' AND tblacct.emailalerts='1' AND tblsubscribedthreads.status='0' AND tblacct.accountName != '".$_SESSION['username']."'";



$result = mysqli_query($connection, $query) or die ("couldn't execute query5");
$numberofrows = mysqli_num_rows($result);
if ($numberofrows > 0) {
// send emails

	while ($row = mysqli_fetch_array($result)) {
		extract($row);
		if ($usermailpref == "1") {
			// html email
			$message = '
		<html>
		<head>
		<title>New posting</title>
		</head>
		<body>
		<p>
		'.$useracctname.' - a new posting has been made into a thread you have subscribed to - "'.$thisthreadTitle.'."</p><p><strong>'.$_SESSION['username'].'</strong> posted: "'.stripCode($postcontents).'"</p>
		<p>There may be more posts since then, but you will not receive further notifications until you have viewed the thread in the forum.</p><p>
			Click <a href="http://autumnearth.metafocusclients.co.uk/forum/ViewThread.php?thread='.$thisthreadid.'" title="Click to visit the thread" target="_blank">here</a> to view the thread</p>
			
			<p>
			To unsubscribe from this thread, please uncheck the relevant box on the <a href="http://autumnearth.metafocusclients.co.uk/forum/ManageSubscriptions.php" title="Click to manage your subscriptions" target="_blank">Manage Subscriptions</a> page:
			 
		</p>
		</body>
		</html>
		';
		$headers = "From:Autumn Earth<alerts@autumnearth.com>\r\nContent-type:text/html;charset=iso-8859-1";
		} else {
			// text email
			$message = $useracctname." - a new posting has been made into a thread you have subscribed to - '".$thisthreadTitle."'.".$_SESSION['username']." posted: '".stripCode($postcontents).".
			there may be more posts since then, but you will not receive further notifications until you have viewed the thread in the forum.
			Click below to view the thread:
			http://autumnearth.metafocusclients.co.uk/ViewThread.php?thread=".$thisthreadid."
			
			To unsubscribe from this thread, please uncheck the relevant box on the following page:
			http://autumnearth.metafocusclients.co.uk/ManageSubscriptions.php 
			";
			$headers = "From:Autumn Earth<alerts@autumnearth.com>";
		}
		$subject = "New posts on Autumn Earth";
		if (mail($useremail,$subject,$message,$headers)) {
		// set this user's status to 1 in the subscription table:
		$query = "UPDATE tblsubscribedthreads SET status = '1' WHERE accountID='".$accountID."'";
		$result = mysqli_query($connection, $query) or die ("couldn't execute query7");
		} 		
	
	}

}


// determine which page this post will be on:
$query = "SELECT * from tblposts WHERE tblposts.ThreadID = " . $threadID . " ORDER BY tblposts.Sticky DESC, tblposts.CreationTime ASC";
$result = mysqli_query($connection, $query) or die ("couldn't execute query6");

$numberofrows = mysqli_num_rows($result);

// this post will be on the last page:
$totalpages = ceil($numberofrows/$resultsperpage);

header("Location: ViewThread.php?thread=" . $threadID . "&page=".$totalpages."#post" . $thispostid);
}
} else {




$jsinclude="addTags";
$onloadfunc="init";
include($_SERVER['DOCUMENT_ROOT']."/includes/header.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/login.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/search.php");
echo '<br /><br />';

// check if username exists in session or they've just logged in:

if ($_SESSION['username']) {

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
$threadID = $_GET["thread"];
// check that a valid number has been passed:

	if (is_numeric($threadID)) {
	
	
	
	// check that they can post in this thread (ie. if it's locked, then they need to be a Mod or Admin)
	
	$query = "SELECT * from tblthreads WHERE threadid = ".$threadID;
	$result = mysqli_query($connection, $query) or die ("couldn't execute query");
	$row = mysqli_fetch_array($result);
	extract($row);
	

	
	if (($status > 1) || ($_SESSION['isadmin']) || ($_SESSION['ismod'])) {
	
	// check for any quote data
	$quotedata = "";
	if (isset($_GET["quote"])) {
	$quoteid = $_GET["quote"];
		if (is_numeric($quoteid)) {
		
		// get username for this post id:
		
		$query = "SELECT tblposts.*, tblacct.Accountname AS acctusername
FROM tblposts
INNER JOIN tblacct on tblacct.accountID = tblposts.accountID
WHERE tblposts.postid='".$quoteid."'";
		$result = mysqli_query($connection, $query) or die ("couldn't execute query");
		
		$numrows = mysqli_num_rows($result);
		
		if ($numrows>0) {
		$row = mysqli_fetch_array($result);
		extract($row);
		$quotedata = '[quote='.$acctusername.']'.stripCode($postContent).'[/quote]';
		}
		
		}
	}
	
	// show form:
		echo'<a href="no_javascript.html" onclick="AddTags(\'[b]\',\'[/b]\');return false;">bold</a> | ';
		echo'<a href="no_javascript.html" onclick="AddTags(\'[i]\',\'[/i]\');return false;">italic</a> | ';
		echo'<a href="no_javascript.html" onclick="AddTags(\'[u]\',\'[/u]\');return false;">underline</a> | ';
		echo'<a href="no_javascript.html" onclick="AddTags(\'[s]\',\'[/s]\');return false;">strikethrough</a> | ';
		echo'<a href="no_javascript.html" onclick="AddTags(\'[h]\',\'[/h]\');return false;">heading</a> | ';
		echo'<a href="no_javascript.html" onclick="AddURL();return false;">add link</a> | ';
		echo'<a href="no_javascript.html" onclick="AddImage();return false;">link to image</a>';
		echo'<br />';
		echo '<form action="' . $thisurl . '" method="post" name="postform" id="postform">';
		
		
		
		
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
		
		
		
		
		
		
		
		
		echo '<label for="postcontents">enter your message:</label><br />';
		echo '<textarea rows="8" cols="20" wrap="soft" id="postcontents" name="postcontents">';
		if ($quotedata != "") {
		echo $quotedata;
		}
		echo '</textarea><br />';
		echo '<input type="hidden" name="thread" id="thread" value="' . $threadID . '" />';
		echo '<input type="hidden" name="useraccount" id="useraccount" value="' . $useraccount . '" />';
		echo '<input type="submit" name="subbutton" value="submit reply" onclick="return checkpromptclosed();" />';
		echo '</form>';			
		} else {
		echo 'you cannot post in this thread';
		}
	} else {
	echo 'not a valid thread id';
	}
}



} else {
echo '<div class="Error">you must be logged in to make a post</div>';
}

echo '<br /><br />';


include($_SERVER['DOCUMENT_ROOT']."/includes/footer.php");
}
?>