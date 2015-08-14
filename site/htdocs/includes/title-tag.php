<?php






$thisURL = $_SERVER['PHP_SELF'];
$thisURLSection = explode("/",$thisURL);
$thisSection = trim($thisURLSection[1]);

$thisBuiltURL = "http://www.autumnearth.com/";
$shareImagePath = "http://www.autumnearth.com/images/icons/120.png";

  $pagetitle="Autumn Earth";
$longDescription="Autumn Earth Community Site";




switch ($thisSection) {
    case "index.php":
        // home
        $pagetitle="Autumn Earth";
$longDescription="Autumn Earth community site";
        break;
    case "forum":
    
	$pagetitle = 'Autumn Earth community forum thread';
	$longDescription = 'A discussion on the Autumn Earth community site';
	// query database to find meta information
		




if(isset($_GET["threadName"])) {
$cleanURL = $_GET["forumName"]."/".$_GET["threadName"];

$thisBuiltURL = $thisBuiltURL."forum/".$cleanURL."/";

		$query = "select tblthreads.*, tblposts.postcontent from 
		tblthreads inner join
		tblposts on tblthreads.threadid = tblposts.threadid
		where tblthreads.cleanURL='".$cleanURL."' order by tblposts.CreationTime limit 1
		";
		$result = mysql_query($query) or die ("couldn't execute query1");
		$numberofrows = mysql_num_rows($result);
		if ($numberofrows > 0) {
			$row = mysql_fetch_array($result);
			extract ($row);
			$pagetitle = stripCode($title).' - Autumn Earth community site';
			$longDescription = stripcode($postcontent);

		}
} else {
	
if(isset($_GET["thread"])) {
$query = "select * from tblthreads WHERE threadID = '".cleanURL($_GET["thread"])."'";
$result = mysql_query($query) or die ("couldn't execute query1");
		$numberofrows = mysql_num_rows($result);
		if ($numberofrows > 0) {
			$row = mysql_fetch_array($result);
			extract ($row);
		$thisBuiltURL = $thisBuiltURL."forum/".$cleanURL."/";
			$pagetitle = stripCode($title).' - Autumn Earth community site';
		}
} else {

	//top level forum:

$query = "select * from tblforums WHERE cleanURL = '".cleanURL($_GET["forum"])."'";
$result = mysql_query($query) or die ("couldn't execute query1");
		$numberofrows = mysql_num_rows($result);
		if ($numberofrows > 0) {
			$row = mysql_fetch_array($result);
			extract ($row);
		$thisBuiltURL = $thisBuiltURL."forum/".$cleanURL."/";
			$pagetitle = stripCode($title).' - Autumn Earth community site';
		}

}
}


        break;
     case "auction":
    // if auction item show details for that

    $auctionId = $_GET["item"];
$query = "select tblauctionitems.*, tblinventoryitems.* from tblauctionitems inner join tblinventoryitems on tblauctionitems.itemID = tblinventoryitems.itemID
 where tblauctionitems.auctionID='".$auctionId."'";

$result = mysql_query($query) or die ("couldn't execute query1");
		$numberofrows = mysql_num_rows($result);
		if ($numberofrows > 0) {
			$row = mysql_fetch_array($result);
			extract ($row);
$pagetitle = $shortname." for sale on the Autumn Earth Auction House";
$longDescription = $description;
	$shareImagePath = "http://www.autumnearth.com/images/inventory/".$itemID.".jpg";
		}
        break;
          case "mail":
    // default
        break;


case "events":



$query = "select * from tblEvents where cleanURL='".$_GET["eventName"]."'";
$result = mysql_query($query) or die ("couldn't execute query");

if (mysql_num_rows($result) > 0) {



while ($row = mysql_fetch_array($result)) {
extract ($row);
	$pagetitle = $title." - an Event in Autumn Earth";
	$longDescription = stripcode($eventContent);
	$thisBuiltURL = $thisBuiltURL."events/".$cleanURL."/"; 
}
}

break;


          case "news":
    
$pagetitle = 'Autumn Earth latest news';
	$longDescription = 'A news article from the Autumn Earth community site';
$cleanURL = $_GET["articleName"];

$thisBuiltURL = $thisBuiltURL."news/".$cleanURL."/";

$query ="select * from tblnews where cleanURL='".$cleanURL."'";
$result = mysql_query($query) or die ("couldn't execute query1");
		$numberofrows = mysql_num_rows($result);
		if ($numberofrows > 0) {
			$row = mysql_fetch_array($result);
			extract ($row);
			$pagetitle = stripCode($newsTitle).' - Autumn Earth news';
			$longDescription = stripcode($newsContent);
		}
        break;
          case "contract":
    // if contract item show details for that
     // ###########
        break;
        default:
      //
}


//  titles under 55 characters
// meta description 155 characters
$pagetitle = substr($pagetitle, 0, 52);
	if(strlen($pagetitle) == 52) {
				$pagetitle = trim($pagetitle)."...";
			}
$longDescription = substr($longDescription, 0, 152);
			if(strlen($longDescription) == 152) {
				$longDescription = trim($longDescription)."...";
			}



echo '<title>'.$pagetitle .'</title>'."\n";

?>