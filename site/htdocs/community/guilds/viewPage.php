<?php
$title="Autumn Earth News";
include($_SERVER['DOCUMENT_ROOT']."/includes/session.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/functions.php");








if(isset($_GET["cleaned"])) {
// uses clean URLS - find pageId from the URL


$query = "select tblguilds.*, tblfreeformpages.*
from tblFreeformPages
inner join tblGuilds on tblFreeformPages.guildID = tblGuilds.guildID
WHERE tblFreeformPages.status='1' AND tblFreeformPages.cleanURL='".$_GET["page"]."' AND tblguilds.cleanURL='".$_GET["guild"]."'";

$result = mysqli_query($connection, $query) or die ("couldn't execute query");

if (mysqli_num_rows($result) > 0) {


$row = mysqli_fetch_array($result);

	extract($row);
// gives $pageID;
}


	
} else {
	// check for GET data:
$pageID = $_GET["whichpage"];
}

// check that a valid number has been passed:

if (is_numeric($pageID)) {

$query = "select tblFreeformPages.*, tblGuilds.guildName
from tblFreeformPages
inner join tblGuilds on tblFreeformPages.guildID = tblGuilds.guildID
WHERE tblFreeformPages.status='1' AND tblFreeformPages.pageID='".$pageID."'";
$result = mysqli_query($connection, $query) or die ("couldn't execute query");

if (mysqli_num_rows($result) > 0) {


$row = mysqli_fetch_array($result);

	extract($row);
	$pagetitle = $freeformPageTitle;
	include($_SERVER['DOCUMENT_ROOT']."/includes/header.php");
	
	$hasAccess = false;
	
	// check to see if this is a public page:
	if ($public == '1') {
		$hasAccess = true;
	} else {
	
		if (@$_SESSION['username']) {
			// check to see if the user logged in's current character is the correct guild for this page:
			$loggedInName = $_SESSION['username'];
			$query2 = "select tblAcct.currentCharID, tblAcct.accountName, tblGuildMembers.guildID
			from tblAcct
			inner join tblGuildMembers on tblGuildMembers.charID = tblAcct.currentCharID
			where tblAcct.accountName = '".$loggedInName."' and tblGuildMembers.guildID = '".$guildID."'";
				$result2 = mysqli_query($connection, $query2) or die ("couldn't execute query");
			if (mysqli_num_rows($result2) > 0) {
				$hasAccess = true; 
			}
		}
	}
	
	if ($hasAccess) {
	echo '<div id="customWrapper">'."\n";
	echo '<div style="background: #'.$bgColour.'; color: #'.$textColour.'; font-family: '.$fontfamily.';">'."\n";
	echo stripslashes(htmlspecialchars_decode($pageContent))."\n";
	echo '</div>'."\n";
	echo '</div>'."\n";
	} else {
	
	echo '<h3>this page is only viewable to members of '.$guildName.'.</h3>'."\n";
	echo '<p>Please log in if you are a member of this guild, or</p>'."\n";
	echo '<p><a href="#">send mail to the guild leader</a></p>'."\n";
	}
	
	
	
	
	
echo '<br />'."\n";
echo '<a href="editPage.php?whichpage='.$pageID.'">edit this page</a>'."\n";

} else {
echo'<p class="Error">Page not found.</p>';
}

} else {
echo'<p class="Error">Unknown page id</p>';
}



include($_SERVER['DOCUMENT_ROOT']."/includes/footer.php");
?>