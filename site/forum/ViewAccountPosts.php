<?php
$title="Autumn Earth Forum";
include($_SERVER['DOCUMENT_ROOT']."/includes/session.inc");
include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/functions.inc");



	
	$pagetitle = "Autumn Earth Community Forum";
		$metadesc = "Autumn Earth Community Forum";
	include($_SERVER['DOCUMENT_ROOT']."/includes/header.inc");
	include($_SERVER['DOCUMENT_ROOT']."/includes/login.inc");
	include($_SERVER['DOCUMENT_ROOT']."/includes/search.inc");
	
	
	$accname = $HTTP_SESSION_VARS['username'];
	if (!(isset($accname))) {
	 echo '<p>You must been signed in to view your own posts</p>';
	} else {
		
		
	
	
	// show breadcrumb:
	echo '<div id="BreadCrumb"><a href="index.php" title="Forum Lists">Forum</a></div>';
		
			echo '<h1>'.$accname.'\'s posts</h1>'."\n";
			
			
			
			//
	// get accountID for this user:
	$query = "SELECT accountID from tblacct WHERE accountName='".$accname."'";
	$result = mysql_query($query) or die ("couldn't execute query2");
	$numberofrows = mysql_num_rows($result);
	// check that something is returned
	if ($numberofrows > 0) {
	
	$row = mysql_fetch_array($result);
	
	
		extract($row);
		
		
	
	
	
	
	
	$query = "select distinct tblthreads.*, tblposts.accountID, tblposts.threadID
	from tblthreads
	inner join tblposts on tblthreads.threadid = tblposts.threadID
	where tblposts.accountID='".$accountID."' ORDER BY sticky DESC, tblThreads.latestPostID DESC";
	
	
	
	$result = mysql_query($query) or die ("couldn't execute query3");
	
		
	$numberofrows = mysql_num_rows($result);
	// check that something is returned
	if ($numberofrows > 0) {
	
	
		
		$totalpages = ceil($numberofrows/$resultsperpage);
		
		// check if this page is paginated:
		if(isset($_GET['page'])) {
		$pagenumber = $_GET['page'];
		} else {
		$pagenumber = 1;
		}
		
		if ($pagenumber > $totalpages) {
		$pagenumber = 1;
		}
			
		$startpoint = ($pagenumber - 1) * $resultsperpage;
		$endpoint = $pagenumber * $resultsperpage;
		if ($endpoint > $numberofrows) {
		$endpoint = $numberofrows;
		}
		
	
		
		$rowcount = 0;
		while ($row = mysql_fetch_array($result)) {
		
		if (($rowcount>= $startpoint) && ($rowcount<$endpoint)) {
		// show these results
		
		extract($row);
		$CreationTime = strtotime($CreationTime);
			
			echo '<a href="View.php?thread=' . $threadID . '" title="Click to view this thread">'."\n";
					
			if ($sticky == "1") {
			echo '<span class="Sticky">';
			}
			
			echo '<strong>' . stripCode(stripslashes($title)) . '</strong>';
			
			if ($sticky == "1") {
			echo '</span>';
			}
			
			echo '</a>';
			
			echo ' - posted by ' . $userName . " on " . date('jS F Y',$CreationTime) .' at '.  date('G:i',$CreationTime). '<br />'."\n";
			echo 'viewed ' . $viewCount . ' times.';
				
			
			
				
				
				echo '<hr />';
	
			}
			
				
			$rowcount++;
				
		}
		
		// display page numbers if required
		if ($totalpages>1) {
		
			// determine URL (but ignore &page = if one exists)
		
			$getdata = "";
			foreach($HTTP_GET_VARS as $key => $value) {

				if ($key != "page") {
				
				if ($getdata != "") {
					// if there's more than one piece of GET data, then need to add an &
					$getdata .= "&";
				}
				$getdata .= $key . "=" . $value;
				}
			}
			// create full URL with GET data added (if any)
			$thisurl = $_SERVER['PHP_SELF'];
			if ($getdata != "") {
				$thispageurl .= "?".$getdata;
			}
					
		
			echo '<br />| ';
			for($i = 1; $i <= $totalpages; $i++) {
				if($i == $pagenumber) { 
				echo $i.' | ';
				} else {
				echo '<a href="'.$thispageurl.'&page='.$i.'" title="View page '.$i.'">'.$i.'</a> | ';
				}
			} 
			echo '<br /><hr />';
		}
}
				
		
	
		} else {
		echo '<p>Account name not recognised</p>';
		echo '<a href="http://www.autumnearth.com" title="Click to return to the homepage">Return to the homepage</a>'."\n";
		}
	
	
			
			
		
	
	}
	
	
	




include($_SERVER['DOCUMENT_ROOT']."/includes/close.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/footer.inc");
?>