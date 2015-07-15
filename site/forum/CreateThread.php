<?php
include($_SERVER['DOCUMENT_ROOT']."/includes/session.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/functions.php");
$error ="";
$postedcontents = @$_POST["postcontents"];
// check if submit button has been pressed:
if (isset($_POST["subbutton"])) {
if ($_POST["subbutton"] == 'create thread') {
$forumID = $_POST["forum"];


if (isset($_POST["threadtitle"])) {
if ($_POST["threadtitle"] =="") {
 $error="please enter a title for your new thread";
}
}

if ($error=="") {

// process form:

$useraccountID = $_POST["useraccount"];
$postcontents = htmlCharsToEntities(cleanText($_POST["postcontents"]));
$threadtitle = htmlCharsToEntities(cleanText($_POST["threadtitle"]));

//


// make sure that cleanURL is unique ###############


$threadURL = "";

$forumURLQuery = "select tblforums.title as forumTitle from tblforums where forumID = '".$forumID."'";
$result = mysql_query($forumURLQuery) or die ("couldn't execute query1");
if (mysql_num_rows($result) > 0) {
	while ($row = mysql_fetch_array($result)) {

	extract($row);
	$threadURL = cleanURL($forumTitle)."/";
}

	}



$cleanedURL = $threadURL.cleanURL($threadtitle);



$query = "INSERT INTO tblthreads (forumID,accountID,viewcount,creationTime,title,cleanURL,status,sticky,postcount)
VALUES ('" . $forumID . "','" . $useraccountID . "','0',NOW(),'".$threadtitle."','".$cleanedURL."','2','0','1')";
$result = mysql_query($query) or die ("couldn't execute query1");

// find what the id of this thread was:

$thisthreadid = mysql_insert_id();



// add post
$query = "INSERT INTO tblPosts (threadID,accountID,creationTime,postContent,status,sticky,edited)
VALUES ('" . $thisthreadid . "','" . $useraccountID . "',NOW(),'" . $postcontents . "','1','0','0')";
$result = mysql_query($query) or die ("couldn't execute query2");

// find what the id of this post was:
$thispostid = mysql_insert_id();
// insert this id into the thread table:
$query = "UPDATE tblthreads SET latestPostID = ".$thispostid." WHERE threadid=" . $thisthreadid;
$result = mysql_query($query) or die ("couldn't execute query3");


// update users post count:
$query = "UPDATE tblacct SET postCount = postCount+1 WHERE accountID=" . $useraccountID;
$result = mysql_query($query) or die ("couldn't execute query4");


// check the user's subscriptions and add this thread to their list if required:
			$query = "select * from tblsubscribedthreads where accountID='".$useraccountID."' AND threadID='".$thisthreadid."'";
			$result = mysql_query($query) or die ("couldn't execute query3");
			$numberofrows = mysql_num_rows($result);
			if ($numberofrows < 1) {
				$query = "insert into tblsubscribedthreads (accountID, threadID, status)
				values ('".$useraccountID."','".$thisthreadid."','0')";
				$result = mysql_query($query) or die ("couldn't execute query4");
			}

// as a new thread this will be post #1, so don't need to pass which page this post will be on

header("Location: ViewThread.php?thread=" . $thisthreadid);
}
}
} 




$jsinclude="addTags";
$onloadfunc="init";
include($_SERVER['DOCUMENT_ROOT']."/includes/header.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/login.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/search.php");
echo '<br /><br />';

// check if username exists in session or they've just logged in:
if (@$_SESSION['username']) {

// check the user's status to see if they can post:



$query = "SELECT * from tblAcct WHERE accountname = '" . $_SESSION['username'] . "'";

$result = mysql_query($query) or die ("couldn't execute query");

$row = mysql_fetch_array($result);
extract($row);
$useraccount = $accountID;

if ($error!="") {
echo '<div class="Error">'.$error.'</div>';
}


if ($accountStatus < 2) {

echo '<p>your account has been locked</p>';
echo '<p>please contact <a href="#">support@</a> to re-activate your account</p>';
} else {
$forumID = $_GET["forum"];
// check that a valid number has been passed:

	if (is_numeric($forumID)) {
	
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
		
		echo '<label for="threadtitle">Thread Title* </label><input name="threadtitle" type="text" id="threadtitle" value="" /><br />';
		
		echo '<label for="postcontents">enter your message:</label><br />';
		echo '<textarea rows="8" cols="20" wrap="soft" id="postcontents" name="postcontents">'.$postedcontents.'</textarea><br />';
		echo '<input type="hidden" name="forum" id="forum" value="' . $forumID . '" />';
		echo '<input type="hidden" name="useraccount" id="useraccount" value="' . $useraccount . '" />';
		echo '<input type="submit" name="subbutton" value="create thread" onclick="return checkpromptclosed();" />';
		echo '</form>';
		} else {
	echo 'not a valid forum id';
	}
}



} else {
echo 'you must be logged in to make a post';
}

echo '<br /><br />';

include($_SERVER['DOCUMENT_ROOT']."/includes/close.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/footer.php");

?>