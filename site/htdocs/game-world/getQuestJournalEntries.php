<?php
 
include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");

 // if no quest id is passed in, then get all active

$activeQuests = array(2,4,8);




$regions = array();
$markupToOutput = '<ol>';
$query = "SELECT tblquests.questid, tblquests.journaltitle, tblquests.journaldesc, tblquests.questregion, tblquests.itemsreceivedoncompletion, tblquests.titlegainedaftercompletion, tbltitles.titleName FROM tblquests left join tbltitles ON tblquests.titlegainedaftercompletion = tbltitles.titleid WHERE questid in (".implode(",",$activeQuests).")";

$result = mysql_query($query) or die ();
while ($row = mysql_fetch_array($result)) {
    extract($row);
    $markupToOutput .= '<li data-region="'.$questregion.'">';
    $markupToOutput .= '<h4>'.$journaltitle.'</h4>';
    $markupToOutput .= '<p>'.$journaldesc.'</p>';
    $markupToOutput .= '<h5>Rewards</h5>';

    // build reward items:

    // check for "/" for random ####
    // check for $ for money ####
  $allRewards = explode(",",$itemsreceivedoncompletion);
  foreach ($allRewards as $item) {
    $markupToOutput .= '<img src="/images/game-world/inventory-items/'.$item.'.png">';
  }

/*
$markupToOutput .= '<img src="/images/game-world/inventory-items/'.$inventoryDataToSort[$j]['itemID'].$colourSuffix.'.png" '.$imgDataAttributes.' alt="'.$inventoryDataToSort[$j]['colourName'].$inventoryDataToSort[$j]['shortname'].'">';
$markupToOutput .= '<p><em>'.$inventoryDataToSort[$j]['colourName'].$inventoryDataToSort[$j]['shortname'].'</em>';
$markupToOutput .= '<span class="price'.$specialPriceClass.'">Buy price: '.parseMoney($thisItemsPrice).'</span></p>';
*/



if($titlegainedaftercompletion != null) {
$markupToOutput .= '<p>"'.$titleName.'" title</p>';
}

    $markupToOutput .= '</li>';
    if (!in_array($questregion, $regions)) {
    array_push($regions, $questregion);
}
}

mysql_free_result($result);





$markupToOutput .= "</ol>";



// create JSON response:
echo '{"markup": ["'.addcslashes($markupToOutput, '"\\/').'"],"regions": '.json_encode($regions).'}';

 
 
?>