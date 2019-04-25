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




// get colours:
$coloursQuery = "SELECT * from tblcolours";
$allColours = [];
$colourResult = mysqli_query($connection, $coloursQuery) or die ("recipes failed");
while ($colourRow = mysqli_fetch_array($colourResult)) {
    extract($colourRow);
    array_push($allColours, $colourName);
}
mysqli_free_result($colourResult);




$allMessagePanels = '';
$postPanelMarkup = '<div id="postPanel">';
$postPanelMarkup .= '<div class="draggableBar">Post</div>';
$postPanelMarkup .= '<button class="closePanel">close</button>';
 $postPanelMarkup .= '<div class="tabHeader">';
$postPanelMarkup .= '<button class="tabs active" id="receivedPostTab">Received Post</button>';
$postPanelMarkup .= '<button class="tabs" id="sendPostTab">Send Post</button>';
$postPanelMarkup .= '</div>';

$postPanelMarkup .= '<div id="receivedPostPanel" class="active">';
// get from game state: ####
$chr = 999;
$hasUnReadPost = false;

  $query = "SELECT * FROM tblmail where characterID='".$chr."' and isArchived = false order by senttime DESC LIMIT 12";
      $result = mysqli_query($connection, $query) or die ();
      if(mysqli_num_rows($result)>0) {
      	$postPanelMarkup .= '<ol>';
      	$allSenderNames = array();
      while ($row = mysqli_fetch_array($result)) {
      extract($row);
   if(!(in_array($senderName, $allSenderNames))) {
      array_push($allSenderNames, $senderName);
  }
     $hasBeenReadClass = "";
     if(!$mailRead) {
$hasBeenReadClass = ' class="unread"';
$hasUnReadPost = true;
     }
      $postPanelMarkup .= '<li id="post'.md5($mailID).'"'.$hasBeenReadClass.'>';
      $timeAgo = relativeGameTime(strtotime($sentTime));
      
$postPanelMarkup .= '<div class="previewSlot">';
if($attachment) {
if(!$attachmentTaken) {
$attachmentObject = json_decode($attachment);

	// only want the first here:
$firstElement = reset($attachmentObject);
$isUGC = false;
$isAGameCard = false;
if($firstElement->type == "$") {
$inventoryImage = 'coins';
} else {
$inventoryImage = $firstElement->type;

// check to see if it's User Generated:
if(isset($firstElement->contains)) {
if(intval($firstElement->type) == 34) {
if(is_numeric($firstElement->contains)) {
$isAGameCard = true;
}
} else {

	foreach($firstElement->contains as $key=>$value) {
		if($key=='ugc-id') {
			$isUGC = true;
			$UGCid = $value;
		}
	}
}
}


// check for colours:
if($firstElement->colour > 0) {
$inventoryImage .= '-'.strtolower($allColours[$firstElement->colour]);
}


}

if($isUGC) {
$postPanelMarkup .= '<img src="/images/user-generated/'.$UGCid.'-slot.png" alt=""><span class="qty">'.$firstElement->quantity.'</span>';
} else if ($isAGameCard) {
	$cardId = $firstElement->contains;

	if($cardId < 0) {
		$cardId = abs($cardId).'-rare';

	}
	$postPanelMarkup .= '<img src="/images/card-game/inventory-items/'.$cardId.'.png" alt="" class="players card"><span class="qty">'.$firstElement->quantity.'</span>';
} else {
	$postPanelMarkup .= '<img src="/images/game-world/inventory-items/'.$inventoryImage.'.png" alt=""><span class="qty">'.$firstElement->quantity.'</span>';
}
}
}
$postPanelMarkup .= '</div><p>'.$senderName.' - '.$title.' - '.$timeAgo.'</p>';

$postPanelMarkup .= '</li>';
// convert the escaped new line characters:
$allMessagePanels .= '<div class="postMessagePanel" id="postMessage'.md5($mailID).'"><div class="draggableBar">'.$senderName.' - '.$title.'</div><button class="closePanel">close</button><div class="postParchment"><p>'.nl2br(str_replace("\\n","\n",$mailContents)).'</p>';

if($attachment) {
	if(!$attachmentTaken) {
		foreach ($attachmentObject as &$thisAttachment) {
			if($thisAttachment->type == "$") {
$inventoryImage = 'coins';
			} else {

$isUGC = false;
$isAGameCard = false;
// check to see if it's User Generated:
if(isset($thisAttachment->contains)) {
// or a card:
	
if(intval($firstElement->type) == 34) {
if(is_numeric($firstElement->contains)) {
$isAGameCard = true;
}
}else {


if(!is_string($thisAttachment->contains)) {
	foreach($thisAttachment->contains as $key=>$value) {
		if($key=='ugc-id') {
			$isUGC = true;
			$UGCid = $value;
		}
	}
}
}
}


$inventoryImage = $thisAttachment->type;
// check for colours:
if($thisAttachment->colour > 0) {
$inventoryImage .= '-'.strtolower($allColours[$thisAttachment->colour]);
}
			}


if($isUGC) {
	$allMessagePanels .= '<div class="postSlot"><img src="/images/user-generated/'.$UGCid.'-slot.png" alt=""><span class="qty">'.$thisAttachment->quantity.'</span></div>';
	} else if ($isAGameCard) {

$cardId = $thisAttachment->contains;

	if($cardId < 0) {
		$cardId = abs($cardId).'-rare';

	}
		
	$allMessagePanels .= '<div class="postSlot"><img src="/images/card-game/inventory-items/'.$cardId.'.png" alt="" class="players card"><span class="qty">'.$thisAttachment->quantity.'</span></div>';	
} else {
$allMessagePanels .= '<div class="postSlot"><img src="/images/game-world/inventory-items/'.$inventoryImage.'.png" alt=""><span class="qty">'.$thisAttachment->quantity.'</span></div>';
}

}



}
}
$allMessagePanels .= '</div></div>';




      }
      $postPanelMarkup .= '</ol>';
  }
      mysqli_free_result($result);
$postPanelMarkup .= '</div>';
$postPanelMarkup .= '<div id="sendPostPanel">';

$postPanelMarkup .= '<fieldset>';
$postPanelMarkup .= '<input type="text" list="recentContacts" id="sendPostCharacter" placeholder="To&hellip;">';



$postPanelMarkup .= '<datalist id="recentContacts">';

for($i=0;$i<count($allSenderNames);$i++) {
	$postPanelMarkup .= '<option value="'.$allSenderNames[$i].'">';
}

$postPanelMarkup .= '</datalist>';


$postPanelMarkup .= '<input type="text" id="sendPostSubject" placeholder="Subject line&hellip;">';
$postPanelMarkup .= '<textarea placeholder="Message&hellip;" id="sendPostMessage"></textarea>';


$postPanelMarkup .= '<button id="cancelPost">Cancel</button>';
$postPanelMarkup .= '<button id="sendPost">Send post</button>';
$postPanelMarkup .= '</fieldset>';

$postPanelMarkup .= '</div>';
$postPanelMarkup .= '</div>';

?>