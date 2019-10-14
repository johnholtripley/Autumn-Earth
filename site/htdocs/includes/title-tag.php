<?php



$protocol = stripos($_SERVER['SERVER_PROTOCOL'],'https') === true ? 'https://' : 'http://';
$fullSitePath = $protocol.$_SERVER['SERVER_NAME'];

// https://webmasters.googleblog.com/2014/02/infinite-scroll-search-friendly.html
$needsSeoPagination = false;



$thisURL = $_SERVER['PHP_SELF'];
$thisURLSection = explode("/",$thisURL);
$thisSection = trim($thisURLSection[1]);

$thisBuiltURL = "https://www.autumnearth.com/";
$shareImagePath = "https://www.autumnearth.com/images/icons/120.png";

  $pagetitle="Autumn Earth";
$longDescription="Autumn Earth Community Site";

$needsAModal = "";
$thisAMPURL = "";
$sectionClass = "";
switch ($thisSection) {
    case "index.php":
        // home
        $pagetitle="Autumn Earth";
$longDescription="Autumn Earth community site";

        break;


case "scriptorium":
	$pagetitle = 'Writings from Autumn Earth';
	$longDescription = 'Tomes, Journals, Almanacs, Scrolls, Manifests, Letters, Illuminated Manuscripts, Poems and Recipes';
break;

    case "forum":
    $sectionClass = "forum";
	$pagetitle = 'Autumn Earth ~ Community forum thread';
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
		$result = mysqli_query($connection, $query) or die ("couldn't execute query1");
		$numberofrows = mysqli_num_rows($result);
		if ($numberofrows > 0) {
			$row = mysqli_fetch_array($result);
			extract ($row);
			$pagetitle = strip_tags($title).' ~ Autumn Earth community site';
			$longDescription = strip_tags($postcontent);

		}
} else {
	
if(isset($_GET["thread"])) {
$query = "select * from tblthreads WHERE threadID = '".cleanURL($_GET["thread"])."'";
$result = mysqli_query($connection, $query) or die ("couldn't execute query1");
		$numberofrows = mysqli_num_rows($result);
		if ($numberofrows > 0) {
			$row = mysqli_fetch_array($result);
			extract ($row);
		$thisBuiltURL = $thisBuiltURL."forum/".$cleanURL."/";
			$pagetitle = strip_tags($title).' ~ Autumn Earth community site';
		}


} else if (isset($_GET["forum"])) {
	//top level forum:

$query = "select * from tblforums WHERE cleanURL = '".cleanURL($_GET["forum"])."'";
$result = mysqli_query($connection, $query) or die ("couldn't execute query1");
		$numberofrows = mysqli_num_rows($result);
		if ($numberofrows > 0) {
			$row = mysqli_fetch_array($result);
			extract ($row);
		$thisBuiltURL = $thisBuiltURL."forum/".$cleanURL."/";
			$pagetitle = strip_tags($title).' - Autumn Earth community site';
		}
} else {
// forum home
	$pagetitle = 'Autumn Earth community forum';
	$longDescription = 'Discussions on the Autumn Earth community site';

}
}


        break;


case "herbarium":
if (isset($_GET["plant"])) {
$query = "select * from tblplants WHERE plantUrl = '".cleanURL($_GET["plant"])."'";
$result = mysqli_query($connection, $query) or die ("couldn't execute query1");
		$numberofrows = mysqli_num_rows($result);
		if ($numberofrows > 0) {
			$row = mysqli_fetch_array($result);
			extract ($row);
		$thisBuiltURL = $thisBuiltURL."herbarium/".$plantUrl."/";
			$pagetitle = $latinName.' - ' .$commonNames. ' - Autumn Earth Herbarium';
			$shareImagePath = 'https://www.autumnearth.com/images/herbarium/'.$plantUrl.'.jpg';
			$longDescription = $plantDesc;
		}
	} else {
		// herbarium home
$needsSeoPagination = true;
$query = "select * from tblplants limit 1";
$result = mysqli_query($connection, $query) or die ("couldn't execute query1");
		$numberofrows = mysqli_num_rows($result);
		if ($numberofrows > 0) {
			$row = mysqli_fetch_array($result);
			extract ($row);
		}


		$thisBuiltURL = $thisBuiltURL."herbarium/";
		$pagetitle = 'Autumn Earth Herbarium';
		$longDescription = 'Catalogue of the flora of Autumn Earth';
		$needsAModal = "herbarium";
		$shareImagePath = 'https://www.autumnearth.com/images/herbarium/'.$plantUrl.'.jpg';
	}

break;


case "codex":
if (isset($_GET["cleanURL"])) {

$query = "select * from tblinventoryitems where cleanurl = '".$_GET["cleanURL"]."' and showinthecodex>0";
$result = mysqli_query($connection, $query) or die ("couldn't execute query");
$numberofrows = mysqli_num_rows($result);
		if ($numberofrows > 0) {
			$row = mysqli_fetch_array($result);
			extract ($row);
			$thisBuiltURL = $thisBuiltURL."codex/".$_GET["cleanURL"];
		$pagetitle = $shortname.' in the Autumn Earth Codex';
		$longDescription = $description;
			} else {
				$thisBuiltURL = $thisBuiltURL."codex/";
		$pagetitle = 'Autumn Earth Codex';
		$longDescription = 'The Codex of Autumn Earth';
			}

	} else {
$thisBuiltURL = $thisBuiltURL."codex/";
		$pagetitle = 'Autumn Earth Codex';
		$longDescription = 'The Codex of Autumn Earth';
	}
break;

     case "auction":
    // if auction item show details for that
if(isset($_GET["item"])) {
    $auctionId = $_GET["item"];
$query = "select tblauctionitems.*, tblinventoryitems.* from tblauctionitems inner join tblinventoryitems on tblauctionitems.itemID = tblinventoryitems.itemID
 where tblauctionitems.auctionID='".$auctionId."'";

$result = mysqli_query($connection, $query) or die ("couldn't execute query1");
		$numberofrows = mysqli_num_rows($result);
		if ($numberofrows > 0) {
			$row = mysqli_fetch_array($result);
			extract ($row);
$pagetitle = $shortname." for sale on the Autumn Earth Auction House";
$longDescription = $description;
	$shareImagePath = "https://www.autumnearth.com/images/inventory/".$itemID.".jpg";
		}
	} else {
			$pagetitle = 'Autumn Earth Auctions';
		$longDescription = 'Auctions in the world of Autumn Earth';
	}
        break;
          case "mail":
    // default
        break;


case "events":


if(isset($_GET["eventName"])) {
$query = "select * from tblEvents where cleanURL='".$_GET["eventName"]."'";
$result = mysqli_query($connection, $query) or die ("couldn't execute query");

if (mysqli_num_rows($result) > 0) {
while ($row = mysqli_fetch_array($result)) {
extract ($row);
	$pagetitle = $title." - an Event in Autumn Earth";
	$longDescription = strip_tags($eventContent);
	$thisBuiltURL = $thisBuiltURL."almanack/".$cleanURL."/"; 
}
}
} else {
$pagetitle = "The Almanack for Autumn Earth`";
	$longDescription = "Latest Events in the Autumn Earth Almanack";
	$thisBuiltURL = $thisBuiltURL."almanack/";
}


break;


          case "news":
     $sectionClass = "news";
$pagetitle = 'Autumn Earth latest news';
	$longDescription = 'Latest news from the Autumn Earth community site';


if(isset($_GET["articleName"])) {
$cleanURL = $_GET["articleName"];
$thisAMPURL = '<link rel="amphtml" href="'.$thisBuiltURL.'amp/chronicle/'.$cleanURL.'/">';
$thisBuiltURL = $thisBuiltURL."chronicle/".$cleanURL."/";


$longDescription = 'A news article from the Autumn Earth community site';
$query ="select * from tblnews where cleanURL='".$cleanURL."'";
$result = mysqli_query($connection, $query) or die ("couldn't execute query1");
		$numberofrows = mysqli_num_rows($result);
		if ($numberofrows > 0) {
			$row = mysqli_fetch_array($result);
			extract ($row);
			$pagetitle = strip_tags($newsTitle).' - Autumn Earth news';
			$longDescription = strip_tags($newsContent);
		}
} else {
	$needsSeoPagination = true;
	$thisBuiltURL = $thisBuiltURL."news/";

}
// so next and prev rel links have the correct url in:
$thisSection = "chronicle";

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

if( $sectionClass != "") {
	$sectionClass = ' class="'.$sectionClass.'"';
}

?>