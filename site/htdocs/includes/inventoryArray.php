
<?php
$maxitemsperslot = 10;
// get contents of the inventory items table

$query = "SELECT * FROM tblInventoryItems";
$result = mysql_query($query) or die ("error");
$numberofrows = mysql_num_rows($result);
// check that something is returned
if ($numberofrows > 0) {
	$inventoryitemsarray = array();
	$thisrow = array('not used','empty slot','-','0','0','0','-','-');
	array_push($inventoryitemsarray, $thisrow);
	while ($row = mysql_fetch_array($result)) {
		extract($row);
		$thisrow = array($shortname,$description,$priceCode,$tilex,$tiley,$worldGraphic,$requirements,$itemType);
		array_push($inventoryitemsarray, $thisrow);
	}
} else {
	echo '<p class="Error">can\'t locate inventory items</p>';
}

?>

