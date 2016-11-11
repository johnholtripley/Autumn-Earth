<?php

include($_SERVER['DOCUMENT_ROOT']."/includes/session.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/functions.php");
/*
$pagetitle="Autumn Earth Community Forum - ".stripslashes($forumTitle)." - ".stripslashes($threadTitle);
$metadesc = stripCode(stripslashes($postContent));
*/
include($_SERVER['DOCUMENT_ROOT']."/includes/header.php");

$pageNumber = 1;

if(isset($_GET["cleaned"])) {
$threadURL = $_GET["threadName"];
$forumURL = $_GET["forumName"];
$fullCleanedURL = $forumURL."/".$threadURL;


$query = "select threadid, cleanurl from tblthreads WHERE cleanurl = '".$fullCleanedURL."'";
$result = mysql_query($query) or die ("couldn't execute query");

if (mysql_num_rows($result) > 0) {


$row = mysql_fetch_array($result);

$threadID = $row["threadid"];

}

if (isset($_GET["pageNumber"])) {
$pageNumber = $_GET["pageNumber"];

}

} else {
if(isset($_GET["thread"])) {
$threadID = $_GET["thread"];
}
}




// check that a valid number has been passed:

if (is_numeric($threadID)) {

if (isset($_SESSION['username'])) {
// check the status of this user and this thread - if the user is subscribed to this thread, there their status for this thread should be set to 0
$query = "
SELECT tblsubscribedthreads.*, tblacct.accountname, tblacct.accountid AS useracctid, tblthreads.threadid, tblthreads.cleanurl as cleanURL
FROM tblsubscribedthreads
INNER JOIN tblacct on tblsubscribedthreads.accountid = tblacct.accountid
INNER JOIN tblthreads on tblsubscribedthreads.threadid = tblthreads.threadid
WHERE tblacct.accountid = tblsubscribedthreads.accountid AND tblthreads.threadid = '".$threadID."' AND tblsubscribedthreads.status='1' AND tblacct.accountname = '".$_SESSION['username']."'";

$result = mysql_query($query) or die ("couldn't execute query1");
$numberofrows = mysql_num_rows($result);
if ($numberofrows > 0) {
$row = mysql_fetch_array($result);
extract ($row);
// update status
$query = "update tblsubscribedthreads SET status='0' WHERE accountid='".$useracctid."' AND threadid='".$threadID."'";
$result = mysql_query($query) or die ("couldn't execute query2");
}
	}
	
	// get all the information required in one query:
	$query = "SELECT tblposts.*, tblthreads.title AS threadTitle, tblthreads.status AS threadstatus, tblforums.title AS forumTitle, tblforums.imagepath, tblforums.forumid AS thisforumid, tblacct.accountname AS acctusername, tblacct.signature AS acctsignature, tblacct.currentcharid as currentcharid, tbllocations.locname AS charlocation, tblcharacters.charname AS charname 
FROM tblposts
INNER JOIN tblthreads on tblposts.threadid = tblthreads.threadid
INNER JOIN tblforums on tblthreads.forumid = tblforums.forumid
INNER JOIN tblacct on tblacct.accountid = tblposts.accountid
INNER JOIN tblcharacters on tblcharacters.charid = tblacct.currentcharid
INNER JOIN tbllocations on tblcharacters.location = tbllocations.locid
WHERE tblposts.threadid = " . $threadID . " ORDER BY tblposts.sticky DESC, tblposts.creationtime ASC";


	
		$result = mysql_query($query) or die ("couldn't execute query3");
	
	$numberofrows = mysql_num_rows($result);
	
	
// check that something is returned
	if ($numberofrows > 0) {
		
	
		
		$totalpages = ceil($numberofrows/$resultsperpage);
		
		// check if this page is paginated:
	
		
		if ($pageNumber > $totalpages) {
		$pageNumber = 1;
		}
			
		$startpoint = ($pageNumber - 1) * $resultsperpage;
		$endpoint = $pageNumber * $resultsperpage;
		if ($endpoint > $numberofrows) {
		$endpoint = $numberofrows;
		}
		
		$isfirsttime = true;
		
		$rowcount = 0;
		while ($row = mysql_fetch_array($result)) {
		
		if (($rowcount>= $startpoint) && ($rowcount<$endpoint)) {
		// show these results
		
		extract($row);
			
			if ($isfirsttime) {
			
				
				
			
			
			// show breadcrumb:
	echo '<div id="BreadCrumb"><a href="/forum/" title="Forum Lists">Forum</a> &gt; <a href="/forum/'.cleanURL($forumTitle).'" title="View '.stripslashes($forumTitle).'">'.stripslashes($forumTitle).'</a> &gt; '.stripCode(stripslashes($threadTitle)).'</div>'."\n";
			
			// only display headers on the first row
			
			echo '<h1>' . stripslashes($forumTitle) . '</h1>'."\n";
		//	echo '<img src="' . stripslashes($imagePath) . '" width="24" height="24" alt="" />'."\n"; 
			echo '<h2>' . stripCode(stripslashes($threadTitle)) . '</h2>'."\n";
			
			echo '<hr />'."\n";
			$isfirsttime = false;
			}
			
			
				
			
			
			
				$creationTime = strtotime($creationTime);
					// add anchor with the post id:
				echo '<p id="post' . $postID . '"><strong>' . $acctusername . '</strong> posted on ' . date('jS F Y',$creationTime) .' at '.  date('G:i',$creationTime).'<br />'."\n";
				if ($status>0) {
					echo parseCode(stripslashes($postContent));
				} else {
					echo 'This post has been hidden by a Moderator.';
				}
				echo '</p>'."\n";
				echo '<img src="/data/chr'.$currentcharid.'/portrait.jpg" class="characterPortrait" alt="'.$acctusername.'\'s portrait" /><br />'."\n".'<strong>'.$charname.'</strong> - currently in '.$charlocation.'<br />'."\n";
				echo '<em>'.parseCode(stripslashes($acctsignature)).'</em>';
				if (strtolower($acctusername) == strtolower($_SESSION['username'])) {
				// add edit link
				echo '<br /><a href="/forum/EditPost.php?post='.$postID.'&amp;page='.$pageNumber.'" title="Edit post">edit post</a>'."\n";
				}
				if ($edited != "0000-00-00 00:00:00") {
					// add edited time:
					$edited = strtotime($edited);
					echo '<br />edited on '.date('jS F Y',$edited) .' at '.  date('G:i',$edited).'<br />'."\n";
				}
				
				echo '<br /><a href="/forum/CreatePost.php?thread=' . $threadID . '&amp;quote='.$postID.'" title="quote this post">Quote</a> | <a href="#" title="Report this post">Report this post</a>';
				
				echo '<hr />'."\n";
	
			}
			
				
			$rowcount++;
				
		}
		
		// display page numbers if required
		if ($totalpages>1) {
		


/*
			// determine URL (but ignore &page = if one exists)
		
			$getdata = "";
			if(isset($_GET)) {
			foreach($_GET as $key => $value) {

				if ($key != "page") {
				
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
			$thispageurl = $thisurl;
			if ($getdata != "") {
				$thispageurl .= "?".$getdata;
			}
			*/
					
		
			echo '<ul class="pagination">'."\n";
			for($i = 1; $i <= $totalpages; $i++) {
				if($i == $pageNumber) { 
				echo '<li class="current">'.$i.'</li>'."\n";
				} else {
				echo '<li><a href="/forum/'.$cleanURL.'/'.$i.'/" title="View page '.$i.'">'.$i.'</a></li>'."\n";
				}
			} 
			echo '</ul>'."\n";
		}
	} else {

		echo '<p>There are no posts to view in this thread</p>';
		echo '<a href="/" title="Click to return to the homepage">Return to the homepage</a>'."\n";
	}
	
	
if (($threadstatus > 1) || ($_SESSION['isadmin']) || ($_SESSION['ismod'])) {
		echo '<a href="/forum/CreatePost.php?thread=' . $threadID . '" title="post a reply">post reply</a>'."\n";
		
		}
		
		echo ' | <a href="/account/ManageSubscriptions.php?subscribe=' . $threadID . '" title="subscribe to this thread">subscribe to this thread</a>'."\n";
	
	} else {

echo '<div class="Error">not a valid thread id</div>'."\n";
}



include($_SERVER['DOCUMENT_ROOT']."/includes/footer.php");
?>