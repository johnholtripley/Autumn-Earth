<?php
 
include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/functions.php");

 // if no quest id is passed in, then get all active

$activeQuests = array(1,2,4,8);




$regions = array();
$markupToOutput = '<ol>';
$query = "SELECT tblquests.questid, tblquests.journaltitle, tblquests.journaldesc, tblquests.questregion, tblquests.itemsreceivedoncompletion, tblquests.titlegainedaftercompletion, tbltitles.titleName FROM tblquests left join tbltitles ON tblquests.titlegainedaftercompletion = tbltitles.titleid WHERE questid in (".implode(",",$activeQuests).")";

$result = mysql_query($query) or die ();
while ($row = mysql_fetch_array($result)) {
    extract($row);
    $markupToOutput .= '<li class="active" data-region="'.$questregion.'">';
    $markupToOutput .= '<h4>'.$journaltitle.'</h4>';
    $markupToOutput .= '<p>'.$journaldesc.'</p>';
    $markupToOutput .= '<h5>Rewards</h5>';

    // build reward items:


  $allRewards = explode(",",$itemsreceivedoncompletion);
  foreach ($allRewards as $item) {
        // check for $ for money:
    if (strpos($item, '$') !== false) {
        $markupToOutput .= parseMoney(str_replace('$','',$item)).' silver';
    } else {
        $quantity = 1;
            // check for "/" for random:
        if (strpos($item, '/') !== false) {
$item = "unknown";
        } else {

// check for x for quantity:
$xPos = strpos($item, 'x');
 if ($xPos !== false) {
    $quantity = substr($item,0,$xPos);
    $item = substr($item,$xPos+1);
    }
    }
    
$markupToOutput .= '<img src="/images/game-world/inventory-items/'.$item.'.png">';

$markupToOutput .= '<span class="qty">'.$quantity.'</span>';
    }
    
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