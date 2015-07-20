<?php

function correctAttribute($attr) {
	// strip quotes out:
	$attr = str_ireplace("'","",$attr);
	$attr = str_ireplace('"','',$attr);
	
	// check attribute has http://
	if (strtolower(substr($attr,0,3) == "www")) {
		$attr = "http://".$attr;
	}
	return $attr;
}
//

function cleanText($originaltext) {
// for banned word lists
	$bannedwords = array("fuck", "piss", "cunt", "wanker", "bastard", "twat", "cock", "rape", "wank","shit");
	$replacewords = array("****","****","****","******","*******","****","****","****","****","****");
	$amendedtext = $originaltext;
	for ($i = 0; $i<count($bannedwords); $i++) {
		// loop through banned word list 
		$amendedtext = str_ireplace($bannedwords[$i],$replacewords[$i],$amendedtext);
	}
	

// ensures that any code is nested correctly and has valid open and close pairs
$validopentag = array('b]','i]','u]','s]','h]');
$validclosetag = array('/b]','/i]','/u]','/s]','/h]');
$openlist = array();
$splittext = explode("[", $amendedtext);
if (count($splittext) > 0) {
	$i = 0;
	while ($i < count($splittext)) {
		$tagsearch = (array_search(substr(strtolower($splittext[$i]),0,2), $validopentag));
		if (is_numeric($tagsearch)) {
			// ie. isn't false;	
			array_push($openlist, $tagsearch);
			// add [ back in now it's been checked
			$splittext[$i] = "[".$splittext[$i];
		} else {
			// check for close tags
			$tagsearch = (array_search(substr(strtolower($splittext[$i]),0,3), $validclosetag));
			if (is_numeric($tagsearch)) {	
				// check if there are any tags on the open list:
				if (count($openlist) == 0) {
					// remove this tag:
					$splittext[$i]=substr($splittext[$i],3);
				} else {
					// check if this tag corresponds to the last open tag:
					$lastelement = array_pop($openlist);
					if ($tagsearch == $lastelement) {
						// is fine and can be removed from the list
						// add [ back in now it's been checked
						$splittext[$i] = "[".$splittext[$i];
					} else {
						// add the element back in
						array_push($openlist, $lastelement);
						// remove this tag:
						$splittext[$i]=substr($splittext[$i],3);
					}
				}
			} else {
				// check for [quote] and [link]
				 
				if (substr(strtolower(trim($splittext[$i])),0,4) == "link") {
					// find '=' after link
					$equalpos = stripos($splittext[$i],'=');
					if ($equalpos !== false) {
						// find closing ']'
						$closetag = stripos($splittext[$i],']',$equalpos);
						if ($closetag !== false) {
							// is a valid link tag, add to open list
							array_push($openlist, 100);
							$splittext[$i] = "[".$splittext[$i];
						}
					} else {
					// add [ back in now it's been checked
						$splittext[$i] = "[".$splittext[$i];
					}
				} else if (substr(strtolower(trim($splittext[$i])),0,6) == "/link]") {	
					// is a valid close link tag,
					// check if this tag corresponds to the last open tag:
					$lastelement = array_pop($openlist);
					if ($lastelement != 100) {
						// add the element back in
						array_push($openlist, $lastelement);
						// remove this tag:
						$splittext[$i]=substr($splittext[$i],6);
					} else {
					$splittext[$i] = "[".$splittext[$i];
					}
				} else if (substr(strtolower(trim($splittext[$i])),0,5) == "quote") {
					// find '=' after link
					$equalpos = stripos($splittext[$i],'=');
					if ($equalpos !== false) {
						// find closing ']'
						$closetag = stripos($splittext[$i],']');
						if ($closetag !== false) {
							// is a valid link tag, add to open list
							array_push($openlist, 101);
							$splittext[$i] = "[".$splittext[$i];
						}
					} else {
					// add [ back in now it's been checked
						$splittext[$i] = "[".$splittext[$i];
					}
				} else if (substr(strtolower(trim($splittext[$i])),0,7) == "/quote]") {	
					// is a valid close link tag,
					// check if this tag corresponds to the last open tag:
					$lastelement = array_pop($openlist);
					if ($lastelement != 101) {
						// add the element back in
						array_push($openlist, $lastelement);
						// remove this tag:
						$splittext[$i]=substr($splittext[$i],7);
					} else {
					$splittext[$i] = "[".$splittext[$i];
					}
				} else if (substr(strtolower(trim($splittext[$i])),0,5) == "image") {
					// check for image
					
					// find '=' after link
					$equalpos = stripos($splittext[$i],'=');
					if ($equalpos !== false) {
						// find closing ']'
						$closetag = stripos($splittext[$i],']');
						if ($closetag !== false) {
							// is a valid image tag - check if any open tags and close them all:
							
							$closeTagstoAdd = "";
							// check for any elements within the openlist:
							if (count($openlist) > 0) {
								
								// reverse array so tags are closed in correct order:
								$openlist = array_reverse($openlist);
								$j = 0;
								while ($j < count($openlist)) {
									switch ($openlist[$j]) {
										case 100:
										// need close link
										$closeTagstoAdd .= '[/link]';
										break;
										case 101:
										$closeTagstoAdd .= '[/quote]';
										break;
										default:
										$closeTagstoAdd .= '['.$validclosetag[$openlist[$j]];
									}
									$j++;
								}
							}
							
					
							
							// clear open list now:
							$openlist = array();
							// add [ back in
							$splittext[$i] = $closeTagstoAdd."[".$splittext[$i];
							
													}
					} else {
					// add [ back in now it's been checked
						$splittext[$i] = "[".$splittext[$i];
					}
					
				} else {
					// need to add the [ back in - except on the very first element:
					if ($i != 0) {
						$splittext[$i] = "[".$splittext[$i];
					}
				}
			}
		}
		$i++;
	}
}

// check for any elements within the openlist:
	if (count($openlist) > 0) {
		// reverse array so tags are closed in correct order:
		$openlist = array_reverse($openlist);
		$i = 0;
		while ($i < count($openlist)) {
			switch ($openlist[$i]) {
				case 100:
				// need close link
				array_push($splittext, '[/link]');
				break;
				case 101:
				array_push($splittext, '[/quote]');
				break;
				default:
				array_push($splittext,'['.$validclosetag[$openlist[$i]]);
			}
			$i++;
		}
	}

// rebuild string:
$amendedtext = implode("", $splittext);
return $amendedtext;
}
//


function parseCode($toparse) {

$amendedtext = smartPunctuation($toparse);

// for code parsing
$validTags = array('[b]','[i]','[u]','[s]','[h]','[/b]','[/i]','[/u]','[/s]','[/h]','[/link]','[/quote]');
$replaceTags = array('<strong>','<em>','<span class="Underline">','<del>','<span class="Header">','</strong>','</em>','</span>','</del>','</span>','</a>','</p></blockquote><p>');
// for smilies:
$validSmilieCode = array(':)',':(');
$SmilieReplace = array('<img src="/assets/forum/smilie_grin.gif" width="20" height="20" alt="Happy Smilie" />','<img src="/assets/forum/smilie_sad.gif" width="20" height="20" alt="Sad Smilie" />');

	
	for ($i = 0; $i<count($validTags); $i++) {
		$amendedtext = str_ireplace($validTags[$i],$replaceTags[$i],$amendedtext);
	}
	//
	for ($i = 0; $i<count($validSmilieCode); $i++) {
		$amendedtext = str_ireplace($validSmilieCode[$i],$SmilieReplace[$i],$amendedtext);
	}

// check for [link [quote and [image


$splittext = explode("[", $amendedtext);
$linkpos = null;
if (count($splittext) > 0) {
	$i = 0;
	while ($i < count($splittext)) {

	if (substr(strtolower(trim($splittext[$i])),0,4) == "link") {
		// find '=' after link
		$equalpos = stripos($splittext[$i],'=');
		if ($equalpos !== false) {
			// find closing ']'
			$closetag = stripos($splittext[$i],']',$equalpos);
			if ($closetag !== false) {
			$attrlength = $closetag-$equalpos-1;
			 $attribute = trim(substr($splittext[$i], $equalpos+1, $attrlength));
			 $attribute = correctAttribute($attribute);
			 	// check for blank attribute:
				if ($attribute == "") {
					$attribute = "#";
				}
			 // do replacement:
			 $splittext[$i] = substr($splittext[$i], 0, $linkpos) . "<a href=\"" . $attribute. "\" target=\"_blank\" title=\"" . $attribute . "\">" .substr($splittext[$i], ($closetag+1));
			 
			}
		}
	} else if (substr(strtolower(trim($splittext[$i])),0,5) == "quote") {
		// find '=' 
		$equalpos = stripos($splittext[$i],'=');
		if ($equalpos !== false) {
			// find closing ']'
			$closetag = stripos($splittext[$i],']',$equalpos);
			if ($closetag !== false) {
			$attrlength = $closetag-$equalpos-1;
			 $attribute = trim(substr($splittext[$i], $equalpos+1, $attrlength));
			 $attribute = correctAttribute($attribute);
			 
			 	// check for blank attribute:
				if ($attribute == "") {
					// do replacement:
					$splittext[$i] = substr($splittext[$i], 0, $linkpos) . "</p><blockquote><p>Quote<br />" .substr($splittext[$i], ($closetag+1));
				} else {
					// do replacement:
					$splittext[$i] = substr($splittext[$i], 0, $linkpos) . "</p><blockquote><p>Quote - originally posted by <strong>".$attribute."</strong><br />" .substr($splittext[$i], ($closetag+1));
				}
			}
		}
	
	} else if (substr(strtolower(trim($splittext[$i])),0,5) == "image") {
	
	// find '=' 
		$equalpos = stripos($splittext[$i],'=');
		if ($equalpos !== false) {
			// find closing ']'
			$closetag = stripos($splittext[$i],']',$equalpos);
			if ($closetag !== false) {
			$attrlength = $closetag-$equalpos-1;
			 $attribute = trim(substr($splittext[$i], $equalpos+1, $attrlength));
			 $attribute = correctAttribute($attribute);
			 
			 // check for blank attribute:
				if ($attribute == "") {
				// no image path, so don't display anything:
				$splittext[$i] = substr($splittext[$i], 0, $linkpos) . substr($splittext[$i], ($closetag+1));
				} else {
				// do replacement:
			 $splittext[$i] = substr($splittext[$i], 0, $linkpos) . "</p><div class=\"LinkedImage\"><img src=\"" . $attribute. "\" alt=\"Image - " . $attribute . "\" /></div><p>" .substr($splittext[$i], ($closetag+1));
				}
			 
			 
			 
			}
		}
	} else if ($i != 0){
	 $splittext[$i] = '['.$splittext[$i];
	}
	$i ++;


}

}

// rebuild the string:
$amendedtext = implode("", $splittext);

return $amendedtext;
}


function smartPunctuation($toPunctuate) {


// open quotes = &ldquo;
// close quotes = &rdquo;
// curled apostrophe = &rsquo;


// do open quotes at string start:
$toPunctuate = ereg_replace('(^)"(.)',"\\1&ldquo;\\2",$toPunctuate);
$toPunctuate = ereg_replace('(([[:space:]])"(.))+',"\\2&ldquo;\\3",$toPunctuate);


// do close quotes not at string end:
$toPunctuate = ereg_replace('((.)"([[:space:]]))+',"\\2&rdquo;\\3",$toPunctuate);
// do close quotes at string end:
$toPunctuate = ereg_replace('(.)"($)',"\\1&rdquo;\\2",$toPunctuate);


// do apostrophes:
$toPunctuate = ereg_replace('(.)\'(.)',"\\1&rsquo;\\2",$toPunctuate);

// convert any ... to ellipsis character:
$toPunctuate = str_ireplace("...","&hellip;",$toPunctuate);

// convert any line breaks to <br>
$toPunctuate = nl2br($toPunctuate);

return $toPunctuate;
}

function stripCode($toparse) {
$validTags = array('[b]','[i]','[u]','[s]','[h]','[/b]','[/i]','[/u]','[/s]','[/h]','[/link]','[/quote]',':)',':(');
$amendedtext = $toparse;
	for ($i = 0; $i<count($validTags); $i++) {
		$amendedtext = str_ireplace($validTags[$i],"",$amendedtext);
	}
	// remove any [link], [quote] or [image]:
	
	$splittext = explode("[", $amendedtext);
if (count($splittext) > 0) {
	$i = 0;
	while ($i < count($splittext)) {

	if (substr(strtolower(trim($splittext[$i])),0,4) == "link") {
		// find '=' after link
		$equalpos = stripos($splittext[$i],'=');
		if ($equalpos !== false) {
			// find closing ']'
			$closetag = stripos($splittext[$i],']',$equalpos);
			if ($closetag !== false) {
		
				// is a link tag:
				
				$splittext[$i] = substr($splittext[$i],$closetag+1);
				
			}
		}
	} else if (substr(strtolower(trim($splittext[$i])),0,5) == "quote") {
		// find '=' 
		$equalpos = stripos($splittext[$i],'=');
		if ($equalpos !== false) {
			// find closing ']'
			$closetag = stripos($splittext[$i],']',$equalpos);
			if ($closetag !== false) {


				// is a [quote] tag
$splittext[$i] = substr($splittext[$i],$closetag+1);

			}
		}
	
	} else if (substr(strtolower(trim($splittext[$i])),0,5) == "image") {
	
	// find '=' 
		$equalpos = stripos($splittext[$i],'=');
		if ($equalpos !== false) {
			// find closing ']'
			$closetag = stripos($splittext[$i],']',$equalpos);
			if ($closetag !== false) {
			
			
			
			// is an [image] tag
			 $splittext[$i] = substr($splittext[$i],$closetag+1);
			 
			 
			}
		}
	}
	$i ++;


}

}
	
	// rebuild the string:
$amendedtext = implode("", $splittext);
		
return $amendedtext;
}
//
function highlight($textcontent,$highlight) {
// do a case in-sensitive match to highlight a block of text with a given string
	$tempstring = "";
	$hilightlen = strlen($highlight);
	$i = 0;
	while ($i<strlen($textcontent)) {
		$check = substr($textcontent, $i, $hilightlen);
		if (strcasecmp($check, $highlight) == 0) {
			// have a case in-sensitive match:
			$tempstring .= '<span class="Highlight">'.$check.'</span>';
			$i += $hilightlen;
		} else {
			$tempstring .= substr($textcontent, $i, 1);
			$i++;
		}
	}
	return $tempstring;
}
//
//
function htmlCharsToEntities($textcontent) {
// convert html characters to entites, including single quotes
$textcontent = htmlspecialchars($textcontent, ENT_QUOTES);
//$textcontent = str_replace("'","&#039;",$textcontent);
// check if magic quotes is on, and add slashes if not
if (!get_magic_quotes_gpc()) {
	$textcontent = addslashes($textcontent);
}
return $textcontent;
}
//
function removeItemFromInv($characterId,$slotNumber,$quantity) {
	// get this character's inventory
	$filename = "../data/chr".$characterId."/base.txt";
	if ($fp = fopen($filename, "r")) {
		$data = fread($fp, filesize($filename));
		// separate the whole string into variables
		parse_str($data);
		fclose($fp);
		//
		$inventorycontentsarray = Array();
		// convert inventory array from string:
		$inventorysplit = explode("/",$inventorysave);
		for ($i = 0; $i<count($inventorysplit); $i++) {
			$inventorycontentsarray[$i] = explode(",",$inventorysplit[$i]);
		}
		// reduce quantity
		$inventorycontentsarray[$slotNumber][1] -= $quantity;
		if ($inventorycontentsarray[$slotNumber][1] == 0) {
			// no item, so set type to blank as well:
			$inventorycontentsarray[$slotNumber][0] = "1";
		}
		// rebuild the inventory string:
		$inventorysplit = Array();
		for ($i=0; $i<count($inventorycontentsarray); $i++) {
			$inventorysplit[$i] = implode(",",$inventorycontentsarray[$i]);
		}
		$inventorystring = implode("/",$inventorysplit);
		// rebuild the entire string:
		$toSave = "codeversion=" . $codeversion . "&playsounds=" . $playsounds . "&herox=" . $herox . "&heroy=" . $heroy . "&money=" .$money . "&dowseskill=" . $dowseskill  . "&famskill=" . $famskill  . "&currentmapnumber=" . $currentmapnumber . "&currentbag=" . $currentbag . "&heightgained=" . $heightgained . "&inventorysave=" . $inventorystring . "&journalsave=" . $journalsave . "&questsstatus=" . $questsstatus . "&petsave=" . $petsave . "&charname=" . $charname; 
		// write string:
		if($fs=fopen($filename,"w")) {
			fwrite($fs, $toSave); 
			fclose($fs);
		}
	}
}
//
function timeRemaining($timeremaining) {
	// return days, hours, minutes and seconds to date passed
	$days = floor($timeremaining/86400);
	$timeremaining = $timeremaining - ($days*86400);
	$hours = floor($timeremaining/3600);
	$timeremaining = $timeremaining - ($hours*3600);
	$minutes = floor($timeremaining/60);
	$timeremaining = $timeremaining - ($minutes*60);
	$seconds = $timeremaining;
	//
	if ($days == 0) {
		if ($hours == 0) {
			if ($minutes != 0) {
				if ($minutes == 1) {
					$timeRemainingString = $minutes.' minute, ';
				} else {
					$timeRemainingString = $minutes.' minutes, ';
				}
			}
		} else {
			if ($hours == 1) {
				$timeRemainingString = $hours.' hour, ';
			} else {
				$timeRemainingString = $hours.' hours, ';
			}
			if ($minutes == 1) {
				$timeRemainingString .= $minutes.' minute, ';
			} else {
				$timeRemainingString .= $minutes.' minutes, ';
			}
		}
	} else {
		if ($days == 1) {
			$timeRemainingString = $days.' day, ';
		} else {
			$timeRemainingString = $days.' days, ';
		}
		if ($hours == 1) {
			$timeRemainingString .= $hours.' hour, ';
		} else {
			$timeRemainingString .= $hours.' hours, ';
		}
		if ($minutes == 1) {
			$timeRemainingString .= $minutes.' minute, ';
		} else {
			$timeRemainingString .= $minutes.' minutes, ';
		}
	}
	if ($seconds == 1) {
		$timeRemainingString .= $seconds.' second.';
	} else {
		$timeRemainingString .= $seconds.' seconds.';
	}
	return $timeRemainingString;
}
//
function formatCurrency($totalamount) {
	// convert silver to gold and silver
	$moneystring = "";
	$silver = $totalamount%100;
	$gold = ($totalamount-$silver)/100;
	if ($gold>0) {
		$moneystring = $gold." gold - ";
	}
	$moneystring .= $silver." silver";
	return $moneystring;
}
//
function writeFlash($Fwidth, $Fheight, $Fpath, $Faltimage, $Falttext, $Fobjectname) {
	// write flash with noscript and call JS to avoid IE activex issues
	echo '<script type="text/javascript">'."\n";
	echo 'IEflash("'.$Fwidth.'","'.$Fheight.'","'.$Fpath.'","'.$Faltimage.'","'.$Falttext.'","'.$Fobjectname.'")'."\n";
	echo '</script>'."\n";
	
	echo '<noscript>'."\n";
	echo '<object type="application/x-shockwave-flash" data="'.$Fpath.'" width="'.$Fwidth.'" height="'.$Fheight.'" id="'.$Fobjectname.'" name="'.$Fobjectname.'">'."\n";
	echo '<param name="movie" value="'.$Fpath.'" />'."\n";
	echo '<param name="wmode" value="transparent" />'."\n";
	echo '<param name="quality" value="high" />'."\n";
	echo '<img src="'.$Faltimage.'" width="'.$Fwidth.'" height="'.$Fheight.'" alt="'.$Falttext.'" />'."\n";
	echo '</object>'."\n";
	echo '</noscript>'."\n";
}
//
function validHexColour($hexvalue) {
  // regex to check valid hex values (could be 3 values eg. fff)
  // '#' has already been checked for and removed
  $match = ereg('^([a-f]|[A-F]|[0-9]){3}(([a-f]|[A-F]|[0-9]){3})?$',$hexvalue);
  if ($match == false) {
    return false;
  } else {
    return true;
  }
}
//
function cleanURL($string) {



	$string=trim($string);

// limit to 128 chars:
	$string = substr($string,0,128);
	// http://stackoverflow.com/questions/11330480/strip-php-variable-replace-white-spaces-with-dashes
   //Lower case everything

    $string = strtolower($string);
    //Make alphanumeric (removes all other characters)
    $string = preg_replace("/[^a-z0-9_\s-]/", "", $string);
    //Clean up multiple dashes or whitespaces
    $string = preg_replace("/[\s-]+/", " ", $string);
    //Convert whitespaces and underscore to dash
    $string = preg_replace("/[\s_]/", "-", $string);
    return $string;
}


function displayAuctionItemsEndingSoon($itemLimit) {
	$query = "SELECT tblAuctionItems.*, tblinventoryitems.itemID, tblinventoryitems.shortname
	FROM tblAuctionItems
	inner join tblinventoryitems on tblAuctionItems.itemid = tblinventoryitems.itemid
	WHERE tblAuctionItems.endtime > NOW()
	and tblAuctionItems.auctionClosed = 'true'
	ORDER BY tblAuctionItems.endtime ASC
	LIMIT ".$itemLimit;
	$result = mysql_query($query) or die ("couldn't execute query");
	
	$numberofrows = mysql_num_rows($result);
	if ($numberofrows>0) {
	
	
	
		while ($row = mysql_fetch_array($result)) {
			extract($row);
			$endTime = strtotime($endTime);
			$timeToEnd = $endTime-time();
			//
			
			
			// get the highest 2 bids from different bidders on this item:
			
			$query3 = "select tblauctionbids.auctionID ,tblauctionbids.bidderID, max(tblauctionbids.bidAmount) as bidAmount, tblcharacters.charName, tblcharacters.charID

from tblauctionbids
inner join tblcharacters on tblauctionbids.bidderID = tblcharacters.charID
where auctionID = '".$auctionID."'
group by tblauctionbids.bidderID 
order by tblauctionbids.bidAmount DESC limit 2
			";
			
			$result3 = mysql_query($query3) or die ("couldn't execute query3");
			
			$numberofrows3 = mysql_num_rows($result3);
			
			switch($numberofrows3) {
				case 0:
				// no bids
				$currentprice = $startPrice;
				break;
				case 1:
				// get the one bidder's name:
				$row3 = mysql_fetch_array($result3);
				extract($row3);
				$highbidder = $charName;
				$currentprice = $startPrice;
				break;
				case 2:
				// determine current bid:
				$row3 = mysql_fetch_array($result3);
				extract($row3);
				$highbid = $bidAmount;
				$highbidder = $charName;
				$row3b = mysql_fetch_array($result3);
				extract($row3b);
				$secondhighbid = $bidAmount;
			
				if ($highbid>($secondhighbid+1)) {
					$currentprice = $secondhighbid+1;
				} else {
					$currentprice = $highbid;
				}
				break;
			}
			
			
			
			
			
			
			
			echo'<div class="InventorySlot" style="background-image: url(/images/inventory/'.$itemID.'.jpg);">';
			echo'<a href="/auction/ViewItem.php?item='.$auctionID.'" title="more information"><img src="/images/inventory/quantity'.$quantity.'.gif" width="64" height="64" /></a></div>'."\n";
			echo'<div class="Clearer">&nbsp;</div>'."\n";
			echo'<p><a href="/auction/ViewItem.php?item='.$auctionID.'" title="more information">'.$shortname.'</a>'."\n";
			echo'<br />Current price: '.formatCurrency($currentprice);
			
			if ($reservePrice != "-1") {
				// check if reserve has been met:
				if ($currentprice < $reservePrice) {
					echo ' - reserve not met';
				}
			}
			
			echo'<br />Ends in '.timeRemaining($timeToEnd);
			
			if ($buyItNowPrice != '-1') {
			echo'<br /><a href="#" title="Buy '.$shortname.' now!">Buy it now for '.$buyItNowPrice.'</a>';
			}
			
			echo'</p>'."\n";
		}
		
	} else {
		echo'<p>No items found for sale.</p>';
	}


}



function displayAuctionNewestItems($itemLimit) {
	$query = "SELECT tblAuctionItems.*, tblinventoryitems.itemID, tblinventoryitems.shortname
	FROM tblAuctionItems
	inner join tblinventoryitems on tblAuctionItems.itemid = tblinventoryitems.itemid
	WHERE tblAuctionItems.endtime > NOW()
	and tblAuctionItems.auctionClosed = 'true'
	ORDER BY tblAuctionItems.starttime DESC
	LIMIT ".$itemLimit;
	$result = mysql_query($query) or die ("couldn't execute query");
	
	$numberofrows = mysql_num_rows($result);
	if ($numberofrows>0) {
	
	
	
		while ($row = mysql_fetch_array($result)) {
			extract($row);
			$endTime = strtotime($endTime);
			$timeToEnd = $endTime-time();
			//
			
			
			// get the highest 2 bids from different bidders on this item:
			
			$query3 = "select tblauctionbids.auctionID ,tblauctionbids.bidderID, max(tblauctionbids.bidAmount) as bidAmount, tblcharacters.charName, tblcharacters.charID

from tblauctionbids
inner join tblcharacters on tblauctionbids.bidderID = tblcharacters.charID
where auctionID = '".$auctionID."'
group by tblauctionbids.bidderID 
order by tblauctionbids.bidAmount DESC limit 2
			";
			
			$result3 = mysql_query($query3) or die ("couldn't execute query3");
			
			$numberofrows3 = mysql_num_rows($result3);
			
			switch($numberofrows3) {
				case 0:
				// no bids
				$currentprice = $startPrice;
				break;
				case 1:
				// get the one bidder's name:
				$row3 = mysql_fetch_array($result3);
				extract($row3);
				$highbidder = $charName;
				$currentprice = $startPrice;
				break;
				case 2:
				// determine current bid:
				$row3 = mysql_fetch_array($result3);
				extract($row3);
				$highbid = $bidAmount;
				$highbidder = $charName;
				$row3b = mysql_fetch_array($result3);
				extract($row3b);
				$secondhighbid = $bidAmount;
			
				if ($highbid>($secondhighbid+1)) {
					$currentprice = $secondhighbid+1;
				} else {
					$currentprice = $highbid;
				}
				break;
			}
			
			
			
			
			
			
			
			echo'<div class="InventorySlot" style="background-image: url(/images/inventory/'.$itemID.'.jpg);">';
			echo'<a href="/auction/ViewItem.php?item='.$auctionID.'" title="more information"><img src="/images/inventory/quantity'.$quantity.'.gif" width="64" height="64" /></a></div>'."\n";
			echo'<div class="Clearer">&nbsp;</div>'."\n";
			echo'<p><a href="/auction/ViewItem.php?item='.$auctionID.'" title="more information">'.$shortname.'</a>'."\n";
			echo'<br />Current price: '.formatCurrency($currentprice);
			
			if ($reservePrice != "-1") {
				// check if reserve has been met:
				if ($currentprice < $reservePrice) {
					echo ' - reserve not met';
				}
			}
			
			echo'<br />Ends in '.timeRemaining($timeToEnd);
			
			if ($buyItNowPrice != '-1') {
			echo'<br /><a href="#" title="Buy '.$shortname.' now!">Buy it now for '.$buyItNowPrice.'</a>';
			}
			
			echo'</p>'."\n";
		}
		
	} else {
		echo'<p>No items found for sale.</p>';
	}


}


function displayContractNewestItems($itemLimit) {

	$query = "SELECT tblcontracts.*, tblinventoryitems.itemID, tbllocations.locName as startLocName, tbllocations.locName as LocName, tblinventoryitems.shortname
	FROM tblcontracts
	inner join tblinventoryitems on tblcontracts.itemid = tblinventoryitems.itemid
	inner join tbllocations on tbllocations.locID = tblcontracts.startLocation
	WHERE tblcontracts.contractEnd > NOW()
	ORDER BY tblcontracts.contractStart DESC
	LIMIT ".$itemLimit;



	$result = mysql_query($query) or die ("couldn't execute query");
	
	$numberofrows = mysql_num_rows($result);
	if ($numberofrows>0) {
	
	
	
		while ($row = mysql_fetch_array($result)) {
			extract($row);



$endTime = strtotime($contractEnd);
			$timeToEnd = $endTime-time();



		echo'<div class="InventorySlot" style="background-image: url(/images/inventory/'.$itemID.'.jpg);">';
			echo'<a href="/contracts/ViewItem.php?item='.$contractID.'" title="more information"><img src="/images/inventory/quantity'.$quantity.'.gif" width="64" height="64" /></a></div>'."\n";
			echo'<div class="Clearer">&nbsp;</div>'."\n";
		echo'<p><a href="/contracts/ViewItem.php?item='.$contractID.'" title="more information">'.$shortname.'</a>'."\n";

echo'<br />Ends in '.timeRemaining($timeToEnd);
		echo'</p>'."\n";











if($contractType == 1) {
// transportation - get end location
	$query = "Select tblcontracts.*, tbllocations.locName as endLocName
FROM tblcontracts
	inner join tbllocations on tbllocations.locID = tblcontracts.endLocation
	where tblcontracts.contractID = '".$contractID."'
	";


	$innerresult = mysql_query($query) or die ("couldn't execute inner query");
	
	$innernumberofrows = mysql_num_rows($innerresult);
	if ($innernumberofrows>0) {
$innerrow = mysql_fetch_array($innerresult);
extract($innerrow);
	}


	echo "<p>Transportation from ".$startLocName." to ".$endLocName."</p>";


// transportation - get current lowest bid:

$query3 = "select tblcontractbids.contractID, min(tblcontractbids.bidAmount) as bidAmount, tblcharacters.charName, tblcharacters.charID
from tblcontractbids
inner join tblcharacters on tblcontractbids.characterID = tblcharacters.charID
where tblcontractbids.contractID = '".$contractID."'
group by tblcontractbids.characterID 
order by tblcontractbids.bidAmount DESC limit 1
			";
		

$innerresult = mysql_query($query3) or die ("couldn't execute inner query");
	
	$innernumberofrows = mysql_num_rows($innerresult);
	if ($innernumberofrows>0) {
$innerrow = mysql_fetch_array($innerresult);
extract($innerrow);
echo "<p>Current best offer: ".$bidAmount."</p>";
	} else {
		echo "<p>No bids so far</p>";
	}



} else {
	// want to buy
	echo "<p>wanted</p>";


// want to buy - get current highest bid:

$query3 = "select tblcontractbids.contractID, max(tblcontractbids.bidAmount) as bidAmount, tblcharacters.charName, tblcharacters.charID
from tblcontractbids
inner join tblcharacters on tblcontractbids.characterID = tblcharacters.charID
where tblcontractbids.contractID = '".$contractID."'
group by tblcontractbids.characterID 
order by tblcontractbids.bidAmount DESC limit 1
			";
		

$innerresult = mysql_query($query3) or die ("couldn't execute inner query");
	
	$innernumberofrows = mysql_num_rows($innerresult);
	if ($innernumberofrows>0) {
$innerrow = mysql_fetch_array($innerresult);
extract($innerrow);
echo "<p>Current best offer: ".$bidAmount."</p>";
	} else {
		echo "<p>No bids so far</p>";
	}


}


		}
	}


}


function displayContractItemsEndingSoon($itemLimit) {

	$query = "SELECT tblcontracts.*, tblinventoryitems.itemID, tbllocations.locName as startLocName, tbllocations.locName as LocName, tblinventoryitems.shortname
	FROM tblcontracts
	inner join tblinventoryitems on tblcontracts.itemid = tblinventoryitems.itemid
	inner join tbllocations on tbllocations.locID = tblcontracts.startLocation
	WHERE tblcontracts.contractEnd > NOW()
	ORDER BY tblcontracts.contractEnd ASC
	LIMIT ".$itemLimit;







	$result = mysql_query($query) or die ("couldn't execute query");
	
	$numberofrows = mysql_num_rows($result);
	if ($numberofrows>0) {
	
	
	
		while ($row = mysql_fetch_array($result)) {
			extract($row);



$endTime = strtotime($contractEnd);
			$timeToEnd = $endTime-time();



		echo'<div class="InventorySlot" style="background-image: url(/images/inventory/'.$itemID.'.jpg);">';
			echo'<a href="/contracts/ViewItem.php?item='.$contractID.'" title="more information"><img src="/images/inventory/quantity'.$quantity.'.gif" width="64" height="64" /></a></div>'."\n";
			echo'<div class="Clearer">&nbsp;</div>'."\n";
		echo'<p><a href="/contracts/ViewItem.php?item='.$contractID.'" title="more information">'.$shortname.'</a>'."\n";

echo'<br />Ends in '.timeRemaining($timeToEnd);
		echo'</p>'."\n";

if($contractType == 1) {
// transportation - get end location
	$query = "Select tblcontracts.*, tbllocations.locName as endLocName
FROM tblcontracts
	inner join tbllocations on tbllocations.locID = tblcontracts.endLocation
	where tblcontracts.contractID = '".$contractID."'
	";


	$innerresult = mysql_query($query) or die ("couldn't execute inner query");
	
	$innernumberofrows = mysql_num_rows($innerresult);
	if ($innernumberofrows>0) {
$innerrow = mysql_fetch_array($innerresult);
extract($innerrow);
	}


	echo "<p>Transportation from ".$startLocName." to ".$endLocName."</p>";

// transportation - get current lowest bid:

$query3 = "select tblcontractbids.contractID, min(tblcontractbids.bidAmount) as bidAmount, tblcharacters.charName, tblcharacters.charID
from tblcontractbids
inner join tblcharacters on tblcontractbids.characterID = tblcharacters.charID
where tblcontractbids.contractID = '".$contractID."'
group by tblcontractbids.characterID 
order by tblcontractbids.bidAmount DESC limit 1
			";
		

$innerresult = mysql_query($query3) or die ("couldn't execute inner query");
	
	$innernumberofrows = mysql_num_rows($innerresult);
	if ($innernumberofrows>0) {
$innerrow = mysql_fetch_array($innerresult);
extract($innerrow);
echo "<p>Current best offer: ".$bidAmount."</p>";
	} else {
		echo "<p>No bids so far</p>";
	}
	
} else {
	// want to buy
	echo "<p>wanted</p>";

	// want to buy - get current highest bid:

$query3 = "select tblcontractbids.contractID, max(tblcontractbids.bidAmount) as bidAmount, tblcharacters.charName, tblcharacters.charID
from tblcontractbids
inner join tblcharacters on tblcontractbids.characterID = tblcharacters.charID
where tblcontractbids.contractID = '".$contractID."'
group by tblcontractbids.characterID 
order by tblcontractbids.bidAmount DESC limit 1
			";
		

$innerresult = mysql_query($query3) or die ("couldn't execute inner query");
	
	$innernumberofrows = mysql_num_rows($innerresult);
	if ($innernumberofrows>0) {
$innerrow = mysql_fetch_array($innerresult);
extract($innerrow);
echo "<p>Current best offer: ".$bidAmount."</p>";
	} else {
		echo "<p>No bids so far</p>";
	}
}


		}
	}


}


?>
