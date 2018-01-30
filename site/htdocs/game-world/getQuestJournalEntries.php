<?php
 
include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/functions.php");

 // if no quest id is passed in, then get all active
$isAnUpdate = false;
if(isset($_GET["questID"])) {
    // it's set, just find the details for the quest and return it as an update
$activeQuests = array($_GET["questID"]);
$isAnUpdate = true;
$markupToOutput = '';
$numberOfQuests = 1;
} else {
// hard coded - needs to come from saved Game State ###########
$activeQuests = array();
$numberOfQuests = count($activeQuests);
$markupToOutput = '<ol>';
}



$regions = array();

if($numberOfQuests>0) {


$query = "SELECT tblquests.questid, tblquests.journaltitle, tblquests.journaldesc, tblquests.questregion, tblquests.itemsreceivedoncompletion, tblquests.titlegainedaftercompletion, tbltitles.titleName FROM tblquests left join tbltitles ON tblquests.titlegainedaftercompletion = tbltitles.titleid WHERE questid in (".implode(",",$activeQuests).")";

$result = mysql_query($query) or die ();
while ($row = mysql_fetch_array($result)) {
    extract($row);
    $markupToOutput .= '<li class="active" id="quest'.$questid.'" data-region="'.$questregion.'">';
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
    $markupToOutput .= '<div class="item"><img src="/images/game-world/inventory-items/'.$item.'.png">';
$itemQuery = "SELECT itemid, shortname, description, pricecode from tblinventoryitems where itemid = '".$item."'";
$itemResult = mysql_query($itemQuery) or die ();
while ($itemRow = mysql_fetch_array($itemResult)) {
$markupToOutput .= '<p><em>'.$itemRow['shortname'].'</em>';
$markupToOutput .= $itemRow['description'];
$markupToOutput .= '<span class="price">Sell price: '.parseMoney($itemRow['pricecode']).'</span>';
$markupToOutput .= '</p>';
    }
mysql_free_result($itemResult);



$markupToOutput .= '<span class="qty">'.$quantity.'</span></div>';
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

}


if(!$isAnUpdate) {
$markupToOutput .= "</ol>";
}


// create JSON response:
echo '{"markup": ["'.addcslashes($markupToOutput, '"\\/').'"],"regions": '.json_encode($regions).'}';

 
 
?>