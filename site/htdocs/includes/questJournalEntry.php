<?php

$inflationModifier = 10;
$sellPriceModifier = 0.7;



// get colours:
$coloursQuery = "SELECT * from tblcolours";
$allColours = [];
$colourResult = mysqli_query($connection, $coloursQuery) or die ("recipes failed");
while ($colourRow = mysqli_fetch_array($colourResult)) {
    extract($colourRow);
    array_push($allColours, $colourName);
}
mysqli_free_result($colourResult);

$regions = array();

$allProfessions = array();
$professionsQuery = "SELECT * from tblprofessions";
$professionsResult = mysqli_query($connection, $professionsQuery) or die ();
while ($row = mysqli_fetch_array($professionsResult)) {
    extract($row);
  
    $allProfessions[$professionID] = $professionName;
    }
    mysqli_free_result($professionsResult);




if($numberOfQuests>0) {

// If journaldesc is NULL, it shouldn't be shown in the journal

$query = "SELECT tblquests.questid, tblquests.journaltitle, tblquests.journaldesc, tblquests.questregion, tblquests.itemsreceivedoncompletion, tblquests.titlegainedaftercompletion, tbltitles.titleName FROM tblquests left join tbltitles ON tblquests.titlegainedaftercompletion = tbltitles.titleid WHERE questid in (".implode(",",$activeQuests).") and tblquests.journaldesc IS NOT NULL";

$result = mysqli_query($connection, $query) or die ();

if(mysqli_num_rows($result) > 0) {

while ($row = mysqli_fetch_array($result)) {
    extract($row);
    $journalMarkupToOutput .= '<li class="active" id="quest'.$questid.'" data-region="'.$questregion.'">';
    $journalMarkupToOutput .= '<h4>'.$journaltitle.'</h4>';
    $journalMarkupToOutput .= '<p>'.$journaldesc.'</p>';
   

   

if($itemsreceivedoncompletion) {
     // build reward items:
 $journalMarkupToOutput .= '<h5>Rewards</h5>';
  $allRewards = json_decode($itemsreceivedoncompletion, true);
  foreach ($allRewards as $item) {



switch ($item['type']) {
    case "$":
       $journalMarkupToOutput .= parseMoney($item['quantity']).' silver';
        break;
    case "profession":
        $journalMarkupToOutput .= '<p>You will learn the &quot;'.$allProfessions[($item["id"])].'&quot; profession</p>';
    
        break;
        case "follower":


// find followers assigned to this character, and identified as a reward for this particular quest:
$followerQuery = "SELECT * from tblretinuefollowers where characterIdFollowing='".$chr."' and followerRewardFromQuestId='".$questid."'";
$followerResult = mysqli_query($connection, $followerQuery) or die ();
while ($row = mysqli_fetch_array($followerResult)) {
    extract($row);
         $journalMarkupToOutput .= '<p>You will gain a new follower: &quot;'.$followerName.'&quot;</p>';
     $journalMarkupToOutput .= '<img src="/images/retinue/'.$followerID.'.png">';
    }
    mysqli_free_result($followerResult);


        break;
    default:
               
            // check for "/" for random:
        if (strpos($item['type'], '/') !== false) {
$journalMarkupToOutput .= '<div class="item"><img src="/images/game-world/inventory-items/unknown.png">';
        } else {
              

$itemNameWithColour = $item['type'];
// check for colours:
if(isset($item['colour'])) {
if($item['colour'] > 0) {
$itemNameWithColour .= '-'.strtolower($allColours[($item['colour'])]);
}
}

if(intval($item['type']) == 34) {
    // is a game card:

$cardId = $item['contains'];
if($cardId < 0) {
$cardId = abs($cardId).'-rare';
}

 $journalMarkupToOutput .= '<div class="item"><img class="players card" src="/images/card-game/inventory-items/'.$cardId.'.png">';
} else {
     $journalMarkupToOutput .= '<div class="item"><img src="/images/game-world/inventory-items/'.$itemNameWithColour.'.png">';
}


           
$itemQuery = "SELECT itemid, shortname, description, pricecode from tblinventoryitems where itemid = '".$item['type']."'";
$itemResult = mysqli_query($connection, $itemQuery) or die ();
while ($itemRow = mysqli_fetch_array($itemResult)) {
$journalMarkupToOutput .= '<p><em>'.$itemRow['shortname'].'</em>';
$journalMarkupToOutput .= $itemRow['description'];
$quantity = 1;
if(isset($item['quantity'])) {
$quantity = $item['quantity'];
}
$journalMarkupToOutput .= '<span class="price">Sell price: '.parseMoney($itemRow['pricecode'] * $sellPriceModifier * $inflationModifier * $quantity).'</span>';
$journalMarkupToOutput .= '</p>';
    }
mysqli_free_result($itemResult);
             }


$quantity = 1;
if(isset($item['quantity'])) {
$quantity = $item['quantity'];
}

$journalMarkupToOutput .= '<span class="qty">'.$quantity.'</span></div>';
}









    }
}
    
  

/*
$journalMarkupToOutput .= '<img src="/images/game-world/inventory-items/'.$inventoryDataToSort[$j]['itemID'].$colourSuffix.'.png" '.$imgDataAttributes.' alt="'.$inventoryDataToSort[$j]['colourName'].$inventoryDataToSort[$j]['shortname'].'">';
$journalMarkupToOutput .= '<p><em>'.$inventoryDataToSort[$j]['colourName'].$inventoryDataToSort[$j]['shortname'].'</em>';
$journalMarkupToOutput .= '<span class="price'.$specialPriceClass.'">Buy price: '.parseMoney($thisItemsPrice).'</span></p>';
*/



if($titlegainedaftercompletion != null) {
$journalMarkupToOutput .= '<p>"'.$titleName.'" title</p>';
}

    $journalMarkupToOutput .= '</li>';
    if (!in_array($questregion, $regions)) {
    array_push($regions, $questregion);
}
}
}

mysqli_free_result($result);

}


sort($regions);


?>