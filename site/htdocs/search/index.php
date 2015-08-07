<?php
include($_SERVER['DOCUMENT_ROOT']."/includes/session.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/functions.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/header.php");



echo '<div class="row">';
echo '<div class="column">';
echo '<h1>Search Results</h1>';
$searchterms = htmlCharsToEntities(trim($_GET["searchterms"]));

$searchterms = str_replace("-", " ", $searchterms);

if ($searchterms == "") {
echo '<div class="Error">No search terms entered</div>';
} else {


// check for magic square from 404 page:

$showSearchResults = true;
$magicSquareNumber = -1;
// get current character for this account:
$query = "select tblcharacters.404MagicSquareSum as magicSquareNumber, tblcharacters.charId as charID
from tblcharacters
inner join tblacct on tblacct.currentCharID = tblcharacters.charID
where tblacct.accountName='".$_SESSION['username']."'";
$result = mysql_query($query) or die ("couldn't execute query");
	

	
		$returned = mysql_num_rows($result);
	
	if ($returned > 0) {
	
	$row = mysql_fetch_array($result);
	
		extract($row); 
}
if($magicSquareNumber != -1) {
	$magicNumberSplits = explode("|", $magicSquareNumber);
	$summedFigure = $magicNumberSplits[0]+$magicNumberSplits[1]+$magicNumberSplits[2];



if($searchterms == $summedFigure) {
 echo "<h2>Check your mail for a new quest</h2>";
 // send in game mail with an item that starts a quest ###########
 // as long as the mail has been sent
$showSearchResults = false;
}

}





if($showSearchResults) {

// do search:
$query = "select distinct tblposts.*, tblthreads.title AS threadtitle, tblthreads.cleanURL as cleanURL
FROM tblposts
INNER JOIN tblthreads on tblposts.threadid = tblthreads.threadid
where (((tblposts.postContent like '%".$searchterms."%') or (tblthreads.title like '%".$searchterms."%')) AND tblposts.status>0) order by tblthreads.creationtime DESC";
$result = mysql_query($query) or die ("couldn't execute query1");



$numberofrows = mysql_num_rows($result);
// check that something is returned
if ($numberofrows > 0) {


// store this search as something was found:
$query2 = "select * from tblsavedsearches where searchTerm='".$searchterms."'";
$result2 = mysql_query($query2) or die ("couldn't execute query2");
$numberofrows2 = mysql_num_rows($result2);
if ($numberofrows2 > 0) {
	// search already exists - increase count:
	$query3 = "update tblsavedsearches set searchCount=searchCount+1 where searchTerm='".$searchterms."'";
	$result3 = mysql_query($query3) or die ("couldn't execute query3");
} else {
	// add new search:
	$query3 = "insert into tblsavedsearches (searchTerm,searchCount) values ('".$searchterms."','1')";
	$result3 = mysql_query($query3) or die ("couldn't execute query3");
}
	
	
	
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

// show these results
extract($row);

$thispostcontent = highlight(stripslashes($postContent),stripslashes($searchterms));
echo '<h3><a href="/forum/'.$cleanURL.'" title="Click to view this thread">'.highlight(stripslashes($threadtitle),stripslashes($searchterms)).'</a></h3>'."\n";

// trim the post content to show so many characters before the first occurence and after the last occurence
$firstOccurence = strpos($postContent, $searchterms);
$lastOccurence = strrpos ($postContent, $searchterms);
$postLength = strlen($postContent);
$endPoint = $postLength;
$startPoint = 0;
$characterCountEitherSide = 250;
$prefix = "";
$suffix = "";



if($firstOccurence !== false) {
if($firstOccurence > $characterCountEitherSide) {
$startPoint = $firstOccurence - $characterCountEitherSide;
$prefix = "&hellip;";
}
}

if($lastOccurence !== false) {
if(($postLength - $lastOccurence)>$characterCountEitherSide) {
$endPoint = $lastOccurence + $characterCountEitherSide;
$suffix = "&hellip;";
}
} else {
	// trim to max:
	if($postLength > ($characterCountEitherSide*2)) {
	$endPoint = ($characterCountEitherSide*2);
	$suffix = "&hellip;";
}
}



if($endPoint<$postLength) {
echo '<p>'.$prefix.trim(substr($thispostcontent,$startPoint,$endPoint-$startPoint)).$suffix.'</p>'."\n";
} else {
	echo '<p>'.$prefix.trim(substr($thispostcontent,$startPoint)).$suffix.'</p>'."\n";
}



echo '<p><a href="/forum/'.$cleanURL.'" title="Click to view this thread">View this thread</a></p>';
}
$rowcount++;
}

// display page numbers if required
		if ($totalpages>1) {
		
			// determine URL (but ignore &page - if one exists)
		
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
					
		
			echo '<hr />| ';
			for($i = 1; $i <= $totalpages; $i++) {
				if($i == $pagenumber) { 
				echo $i.' | ';
				} else {
				echo '<a href="'.$thispageurl.'&page='.$i.'" title="View page '.$i.'">'.$i.'</a> | ';
				}
			} 
			echo '<br /><hr />';
		}


} else {
// save the search term with a zero count:
$query5 = "insert into tblsavedsearches (searchTerm,searchCount) values ('".$searchterms."','0')";
$result5 = mysql_query($query5) or die ("couldn't execute query5");



// see if we can find any similar results from saved searches:

// grab previous search terms:
$query4 = "select searchTerm from tblsavedsearches where searchCount>0";
$result4 = mysql_query($query4) or die ("couldn't execute query4");
$previousSearches = array();
while ($row4 = mysql_fetch_array($result4)) {
		array_push($previousSearches, strtolower($row4["searchTerm"]));
}

$shortestDistance = 101;
foreach ($previousSearches as $word) {
  // determine the score as a percentage of the word's length:
	$levPercent = ((levenshtein(strtolower($searchterms), $word))/strlen($searchterms))*100;
	if ($levPercent<$shortestDistance) {
		$closestMatch = $word;
		$shortestDistance = $levPercent;
	}
}
// create a GET data-safe version of the searchterms (ie. convert spaces to +):
$closestMatchEncoded = str_replace(" ", "+",$closestMatch);

echo '<div class="Error">No results found matching '.stripslashes($searchterms).'</div>'."\n";
echo '<p>Did you mean <a href="SearchResults.php?searchterms='.$closestMatchEncoded.'&action=search">'.$closestMatch.'</a>? ('.$shortestDistance.'%)</p>';
}

}
	
}
echo '</div>';
echo '</div>';

include($_SERVER['DOCUMENT_ROOT']."/includes/footer.php");
?>