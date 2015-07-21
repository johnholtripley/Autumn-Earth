<?php
/* need to be careful of whitespace before and after php tags as these will be sent to flash */

// from live database:

/*
include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");

$returnString="error";
$query="select * from tblcharacters where charid='".$_POST['chrid']."'";
$result = mysql_query($query) or die ("couldn't execute query");
	$numberofrows = mysql_num_rows($result);
	// check that something is returned
	if ($numberofrows == "1") {
		$row = mysql_fetch_array($result);
		extract($row);
		$returnString = htmlspecialchars_decode($gamestate);
		$returnString .= '&journalsave='.htmlspecialchars_decode($journalstate);
		$returnString .= '&questsstatus='.htmlspecialchars_decode($queststate);
		$returnString .= '&petsave='.htmlspecialchars_decode($petstate);
		$returnString .= '&currentbag='.$currentbag;
		$returnString .= '&inventorysave='.htmlspecialchars_decode($inventorystate);
		$returnString .= '&money='.$money;
		$returnString .= '&minutesplayed='.$minutesplayed;
		$returnString .= '&charname='.$charName;
	}


print $returnString;
*/

// temp output:


 
 $gamestate = "playsounds=true&amp;herox=17&amp;heroy=22&amp;dowseskill=0&amp;famskill=70&amp;currentmapnumber=1&amp;heightgained=0";
 $journalstate = "travel to the coast";
 $queststate = "0/0/0/0/0/0/0/0/0/0/0";
 $petstate = "2,0,100,21,13,-1,0,0,0,0,pet,15,12,13";
 $currentbag = "16,1,4,4,4,-1,10,0,0";
 $inventorystate = "38,1,4,100,4,-1,0,0,0,0,-/40,1,4,2,4,-1,4,papyrus,0,0,0<||>25<||>34<||>100<||>-45[*^*]1<||>25<||>34<||>Aldershall/21,1,3,100,4,-1,0,0,0,0,-/19,10,4,100,4,-1,0,1,0,0,-/43,1,4,1234,4,-1,0,John,0,0,More news from Nowhere/12,10,4,100,4,-1,0,16,0,0,-/13,10,4,100,4,-1,0,32,0,0,-/28,1,4,100,4,-1,0,0,0,0,A damaged parchment[**]The damaged parchment's contents/29,4,4,4,4,-1,0,0,0,0,-/1/1/1";
 $money = "299";
 $minutesplayed = "1125";
 $charName = "angel";
 // use for html_entity_decode php4 
	$returnString = html_entity_decode($gamestate);
	$returnString .= '&journalsave='.html_entity_decode($journalstate);
	$returnString .= '&questsstatus='.html_entity_decode($queststate);
	$returnString .= '&petsave='.html_entity_decode($petstate);
	$returnString .= '&currentbag='.$currentbag;
	$returnString .= '&inventorysave='.html_entity_decode($inventorystate);
	$returnString .= '&money='.$money;
	$returnString .= '&minutesplayed='.$minutesplayed;
	$returnString .= '&charname='.$charName;
	print $returnString;
 
 
 
 
 

?>