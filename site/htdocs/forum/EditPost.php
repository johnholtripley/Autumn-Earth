<?php
include($_SERVER['DOCUMENT_ROOT']."/includes/session.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/functions.php");


// check if submit button has been pressed:
if ($_POST["subbutton"] == 'submit changes') {
$thispostid=$_POST["postid"];
$threadlocID=$_POST["threadloc"];

$postcontents = htmlCharsToEntities(cleanText($_POST["postcontents"]));

$query = "update tblposts SET postContent = '".$postcontents."',edited=NOW()
WHERE postid='".$thispostid."'";
$result = mysql_query($query) or die ("couldn't execute query");



// check that the page passed is valid:
$query = "SELECT * from tblposts WHERE tblposts.ThreadID = " . $threadlocID . " AND tblposts.status>0 ORDER BY tblposts.Sticky DESC, tblposts.CreationTime ASC";
$result = mysql_query($query) or die ("couldn't execute query2");

$numberofrows = mysql_num_rows($result);
$totalpages = ceil($numberofrows/$resultsperpage);

$pagenumber = $_GET["page"];

if (!(is_numeric($pagenumber)) || $pagenumber>$totalpages) {
$pagenumber = 1;
}


header("Location: ViewThread.php?thread=" . $threadlocID . "&page=".$pagenumber."#post" . $thispostid);
}







// check that the value passed is valid... 
$postid = $_GET["post"];
$error = "";
if (!(is_numeric($postid))) {
 $error = "in-valid post id";
}


// ...and matches the session user
if (@$_SESSION['username']) {
$thisuser = $_SESSION['username'];

$query = "SELECT tblposts.*, tblacct.Accountname AS acctusername
FROM tblposts
INNER JOIN tblacct on tblacct.accountID = tblposts.accountID
WHERE tblacct.accountname = '" . $thisuser . "' AND tblposts.postid='".$postid."'";

$result = mysql_query($query) or die ("couldn't execute query");

$returned = mysql_num_rows($result);
	
	if ($returned == 0) {
	$error = "you cannot edit this post as it is not yours";
	} else {
	$row = mysql_fetch_array($result);
		extract($row);
	$postedcontents = $postContent;
	
	}

} else {
$error = "you must log in to change a post";
}

$jsinclude="addTags";
$onloadfunc="init";
include($_SERVER['DOCUMENT_ROOT']."/includes/header.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/login.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/search.php");

if ($error != "") {

 echo '<p>'.$error.'</p>';
} else {
// just check they haven't just logged out:
if (@$_SESSION['username']) {
// show form:
		echo'<div id="PromptWrapper">';
		echo'<p>Please enter the link address</p>';
		echo'<form name="InputPrompt" action="' . $thisurl . '" method="post">';
		echo'<input name="userinput" id="userinput" type="text">';
		echo'</form>';
		echo'<a href="no_javascript.html" onclick="closeURLPrompt(\'submit\');return false;">submit</a> <a href="no_javascript.html" onclick="closeURLPrompt(\'cancel\');return false;">cancel</a>';
		echo'</div>';
	
			echo'<div id="PromptImgWrapper">';
		echo'<p>Please enter the image path</p>';
		echo'<form name="ImagePrompt" action="' . $thisurl . '" method="post">';
		echo'<input name="imguserinput" id="imguserinput" type="text">';
		echo'</form>';
		echo'<a href="no_javascript.html" onclick="closeImgPrompt(\'submit\');return false;">submit</a> <a href="no_javascript.html" onclick="closeImgPrompt(\'cancel\');return false;">cancel</a>';
		echo'</div>';
		echo'<a href="no_javascript.html" onclick="AddTags(\'[b]\',\'[/b]\');return false;">bold</a> | ';
		echo'<a href="no_javascript.html" onclick="AddTags(\'[i]\',\'[/i]\');return false;">italic</a> | ';
		echo'<a href="no_javascript.html" onclick="AddTags(\'[u]\',\'[/u]\');return false;">underline</a> | ';
		echo'<a href="no_javascript.html" onclick="AddTags(\'[s]\',\'[/s]\');return false;">strikethrough</a> | ';
		echo'<a href="no_javascript.html" onclick="AddTags(\'[h]\',\'[/h]\');return false;">heading</a> | ';
		echo'<a href="no_javascript.html" onclick="AddURL();return false;">add link</a> | ';
		echo'<a href="no_javascript.html" onclick="AddImage();return false;">link to image</a>';
		echo'<br />';
		echo '<form action="' . $thisurl . '" method="post" name="postform">';
		echo '<label for="postcontents">edit your message:</label><br />';
		echo '<textarea rows="8" cols="20" wrap="soft" id="postcontents" name="postcontents">'.stripslashes($postedcontents).'</textarea><br />';
		echo '<input type="hidden" name="postid" id="postid" value="' . $postid . '" />';
		echo '<input type="hidden" name="useraccount" id="useraccount" value="' . $thisuser . '" />';
		echo '<input type="hidden" name="threadloc" id="threadloc" value="' . $threadID . '" />';
		echo '<input type="submit" name="subbutton" value="submit changes" />';
		echo '</form>';
		

}
}


include($_SERVER['DOCUMENT_ROOT']."/includes/footer.php");

?>