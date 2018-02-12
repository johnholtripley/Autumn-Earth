<?php
// get post for this character:



function relativeGameTime($time) {

	$interval = time() - $time;
	$relyears = floor(($interval) / 31536000);
	$relmonths = floor(($interval) / 2592000);
	$reldays = floor(($interval) / 86400);
	$relhours = floor(($interval) / 3600);
	$relminutes = floor(($interval) / 60);

	if ($relhours < 1) {
		if ($relminutes < 2) {
			return "just now";
		} else {
			return ($relminutes).
			" minutes ago";
		}
	} else if ($reldays < 1) {
		if ($relhours == 1) {
			return "an hour ago";
		} else {
			return ($relhours).
			" hours ago";
		}
	} else if ($reldays < 2) {
		return 'yesterday';
	} else if ($relmonths < 1) {
		$reldays = ($reldays);
		return $reldays.
		" days ago";
	} else if ($relyears < 1) {
		if ($relmonths == 1) {
			return "a month ago";
		} else {
			return ($relmonths).
			" months ago";
		}
	} else {
		if ($relyears == 1) {
			return "a year ago";
		} else {
			return ($relyears).
			" years ago";
		}
	}

}


$allMessagePanels = '';
$postPanelMarkup = '<div id="postPanel" class="active">';
$postPanelMarkup .= '<div class="draggableBar">Post</div>';
$postPanelMarkup .= '<button class="closePanel">close</button>';
      

// get from game state: ####
$chr = 999;
$hasUnReadPost = false;

  $query = "SELECT * FROM tblmail where accountID='".$chr."' order by senttime DESC LIMIT 12";
      $result = mysql_query($query) or die ();
      if(mysql_num_rows($result)>0) {
      	$postPanelMarkup .= '<ol>';
      while ($row = mysql_fetch_array($result)) {
      extract($row);
     $hasBeenReadClass = "";
     if(!$mailRead) {
$hasBeenReadClass = ' class="unread"';
$hasUnReadPost = true;
     }
      $postPanelMarkup .= '<li id="post'.md5($mailID).'"'.$hasBeenReadClass.'>';
      $timeAgo = relativeGameTime(strtotime($sentTime));
      $postPanelMarkup .= '<p>'.$senderName.' - '.$title.' - '.$timeAgo.'</p>';


$postPanelMarkup .= '</li>';
$allMessagePanels .= '<div class="postMessagePanel" id="postMessage'.md5($mailID).'"><div class="draggableBar">'.$senderName.' - '.$title.'</div><button class="closePanel">close</button><p>'.$mailContents.'</p></div>';

      }
      $postPanelMarkup .= '</ol>';
  }
      mysql_free_result($result);

$postPanelMarkup .= '</div>';
?>











