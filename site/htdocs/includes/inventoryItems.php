

<?php

// get the character's name:
$query = "SELECT charName, money, currentbag, inventorystate from tblcharacters where charID = '".$primarycharid."'";
$result5 = mysql_query($query) or die ("couldn't execute query");
$row5 = mysql_fetch_array($result5);





	$returned5 = mysql_num_rows($result5);
			if ($returned5 == 0) {
			
			echo'<div class="Error">Couldn\'t open inventory</div>';
			} else {

extract($row5);
echo'<h3>'.$charName.'\'s inventory</h3>';


// find the number of slots for the current bag:
		$bagslotspos = strstr($inventoryitemsarray[$currentbag][2], 'b');
		$bagslots = substr($bagslotspos,1);


	$inventorycontentsarray = Array();
	// convert inventory array from string:
	$inventorysplit = explode("/",$inventorystate);
	for ($i = 0; $i<count($inventorysplit); $i++) {
		$inventorycontentsarray[$i] = explode(",",$inventorysplit[$i]);
	}
	
	echo'<div id="InvPanel">';
	echo'<div id="InvTop">&nbsp;</div>';
	echo'<div id="InvPanelPadding">';
	
	for ($i = 0; $i<$bagslots; $i++) {
$thisitemname = $inventorycontentsarray[$i][0];



// check if this item is a quest or unique item or an empty slot - and don't make it a link if so
$isquestitem = strstr($inventoryitemsarray[$thisitemname][2], 'q');
$isuniqueitem = strstr($inventoryitemsarray[$thisitemname][2], 'u');


echo'<div class="InventorySlot" name="invslot'.$i.'" id="invslot'.$i.'" style="background-image: url(/assets/inventory/'.$inventorycontentsarray[$i][0].'.jpg);">';


if ($isquestitem === false && $isuniqueitem === false && ($inventorycontentsarray[$i][0] != "1")) {
echo'<a href="/no_javascript.html" onmouseover="dyntooltip(\'tooltipinv\',\''.$inventoryitemsarray[$thisitemname][0].'\');" onmouseout="exit(\'tooltipinv\');" onclick="attachItem('.$i.','.$inventorycontentsarray[$i][1].','.$inventorycontentsarray[$i][0].'); return false;">';
} else {
echo'<a href="/no_javascript.html" onmouseover="dyntooltip(\'tooltipinv\',\''.$inventoryitemsarray[$thisitemname][0].' - NOT MAILABLE\');" onmouseout="exit(\'tooltipinv\');" onclick="return false;">';
}

echo'<img src="/assets/inventory/quantity'.$inventorycontentsarray[$i][1].'.gif" name="invgraphic'.$i.'" id="invgraphic'.$i.'" width="64" height="64" /></a></div>';


}
	echo'<div class="Clearer">&nbsp;</div>';
	echo'</div>';
	echo'<div id="InvBottom">&nbsp;</div>';
	echo'</div>';
	
	echo'<noscript><p>Please use the menu below to choose which item you want to attach to this mail item (if any)</p>';
	
	echo '<label for="nojsitem">item </label><select name="nojsitem" id="nojsitem">';
			
			echo '<option value="notset">select...</option>';
			for ($i = 0; $i<$bagslots; $i++) {
$thisitemname = $inventorycontentsarray[$i][0];
// check if this item is a quest or unique item, or is an empty slot - and don't make it a link if so
$isquestitem = strstr($inventoryitemsarray[$thisitemname][2], 'q');
$isuniqueitem = strstr($inventoryitemsarray[$thisitemname][2], 'u');
	if ($isquestitem === false && $isuniqueitem === false && ($inventorycontentsarray[$i][0] != "1")) {
	// option value: slot number - quantity
	echo '<option value="'.$i.'|'.$inventorycontentsarray[$i][1].'|'.$inventorycontentsarray[$i][0].'"';
	echo'>'.$inventorycontentsarray[$i][1].'x '.$inventoryitemsarray[$thisitemname][0].'</option>';
	}

}
			
echo '</select></noscript>';

	
	
	
	
	
	
	// display slot to show dropped item:
	// first check if an item has already been attached and needs displaying still - as long as a new character hasn't been selected:
	if ((isset($_POST["invItemType"])) && ($_POST["refreshInv"] != "true")) {
	
	$invQuantitysubmitted = $_POST["invQuantity"];
	$savedslotnumber = $_POST["invSlotClicked"];
	if (($postedGoldamount>0) || ($postedSilveramount>0)) {
	// is gold, so don't display quantity here
	$invQuantitysubmitted = '0';
	$savedslotnumber = '-1';
	}
	
	echo'<div id="attachedslot" style="background: url(/assets/inventory/'.$_POST["invItemType"].'.jpg);">'."\n";

echo'<img src="/assets/inventory/quantity'.$invQuantitysubmitted.'.gif" width="64" height="64" name="attachedimage" id="attachedimage" /></div>'."\n";
	// send this data to javascript as well:
	
	echo'<script language="javascript" type="text/javascript">'."\n";
	echo'savedslotnumber = '.$savedslotnumber.';'."\n";
	echo'saveditemtype = '.$_POST["invItemType"].';'."\n";
	if ($savedslotnumber != '-1') {
	echo'quantityavailable = '.$inventorycontentsarray[$savedslotnumber][1].';'."\n";
	}
	echo'window.document.postform.invSlotClicked.value = savedslotnumber;'."\n";
	echo'window.document.postform.invItemType.value = saveditemtype;'."\n";
	echo'window.document.postform.invQuantity.value = '.$invQuantitysubmitted.';'."\n";
	
	
	
	
	// need to correct the quanity shown in the slot that is attached 
	if ($savedslotnumber != '-1') {
	
	echo'window.document.invgraphic'.$savedslotnumber.'.src = \'/assets/inventory/quantity'.($inventorycontentsarray[$savedslotnumber][1]-$invQuantitysubmitted).'.gif\';'."\n";
	}
	

	
	echo'</script>'."\n";

	

	} else {
	echo'<div id="attachedslot" style="background: url(/assets/inventory/0.jpg);">'."\n";

echo'<img src="/assets/inventory/quantity0.gif" width="64" height="64" name="attachedimage" id="attachedimage" /></div>'."\n";
	
	
	
		// setups for the inventory
	echo'<script language="javascript" type="text/javascript">'."\n";
	echo 'if (getElement(\'removeAttach\')) {'."\n";
	echo 'if (thiselement) {'."\n";
	echo 'thiselement.style.display = \'none\';'."\n";
	echo '}'."\n";
	echo '}'."\n";
	echo 'savedslotnumber = -1;'."\n";
	echo'</script>'."\n";
	
	
	}
	
	
	
	
echo'<div id="removeAttach"><a href="/no_javascript.html" title="Remove this attachment" onclick="removeItem(); return false;">Remove this attachment</a></div>';
}

?>

<div id="tooltipinv" class="ttip">
<div class="ttiptop">
<div id="ttipdyn" name="ttipdyn"><p>click to add to mail</p></div>
	</div>
	<div class="ttipbottom">&nbsp;</div>
</div>