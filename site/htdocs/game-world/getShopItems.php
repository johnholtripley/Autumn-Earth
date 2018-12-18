<?php
 
include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/functions.php");
 
// config: 
$inflationModifier = 10;
$sellPriceModifier = 0.7;
$sellPriceSpecialismModifier = 0.8;
$buyPriceSpecialismModifier = 0.9;



 
//$json = $_POST['shopData'];

/*
$json ='{
"mapNumber": 3,
"chr": 999,
"region": "Teldrassil",
"shops": [
{
    "name":"shop #1",
    "hash":"zAbCd",
    "uniqueItems":[],
    "specialism": 2,
    "categories": [1,2],
    "size":"small",
    "currency":"money"
},
{
    "name":"shop #2",
    "hash":"3AbCd",
        "uniqueItems":
            {"14": [{
                "colour":3
            }, 
         
            {
                "colour":7
            }],
            "15": [{
                "colour":1
            }]}
        ,
    "specialism": null,
    "categories": [],
    "size":"small",
    "currency":"money"
},
{
    "name":"shop #3",
    "hash":"zAbCd12",
    "uniqueItems":{"12":[{}],"15":[{"colour":1,"inscription":"stuffffff"}]},
    "specialism": 2,
    "categories": [1,2],
    "size":"small",
    "currency":"money"
},
]
 
}';
*/


/*
$json ='{"mapNumber":2,"chr":999,region":"Teldrassil","shops":[{"name":"shop #1","uniqueItems":[],"specialism":2,"categories":[1,2],"size":"small","currency":"money","hash":2067019224},{"name":"shop #2","uniqueItems":{"14":[{"colour":3},{"colour":7}],"15":[{"colour":1,"inscription":"stuffffff"}]},"specialism":null,"categories":[3],"size":"small","currency":"money","hash":2067019225},{"name":"shop #3","uniqueItems":{"5":[[]],"9":[[]],"11":[[]],"12":[[]],"15":[[]],"20":[[]],"25":[[]],"27":[[]],"37":[[]],"52":[[]]},"specialism":null,"categories":[],"size":"small","currency":"money","hash":2067019226}]}';
*/

 
 //$json = '{"mapNumber":2,"chr":999,"region":"Teldrassil","shops":[{"name":"architect deeds office","uniqueItems":[],"specialism":null,"categories":[6],"size":"large","currency":"money","hash":-551176652}]}';
 

// http://develop.ae/game-world/getShopitems.php
 //$json = '{"chr":999,"mapNumber":"2","region":"Teldrassil","shops":[{"name":"shop #1","uniqueItems":[],"specialism":2,"categories":[1,2],"size":"small","currency":"money","hash":2067019224},{"name":"shop #2","uniqueItems":{"14":[{"colour":3},{"colour":7}],"15":[{"colour":1,"inscription":"stuffffff"}]},"specialism":null,"categories":[3],"size":"small","currency":"money","hash":2067019225},{"name":"shop #3","uniqueItems":{"2":[[]],"6":[[]],"11":[[]],"15":[[]],"17":[[]],"31":[[]],"33":[[]],"37":[[]],"70":[[]],"71":[[]]},"specialism":null,"categories":[],"size":"small","currency":"money","hash":2067019226},{"name":"architect deeds office","uniqueItems":[],"specialism":null,"categories":[6],"size":"large","currency":"money","hash":-551176652},{"name":"Farming Supplies","uniqueItems":[],"specialism":null,"categories":[8],"size":"medium","currency":"money","hash":1904598977},{"name":"User Generated Content","uniqueItems":"##usergenerated##","specialism":null,"categories":[],"size":"small","currency":"money","hash":1889001907},{"name":"Eleaddais architect deeds office","uniqueItems":[],"specialism":null,"categories":[3],"size":"large","currency":"money","hash":216204093}]}';
 $json = '{"chr":999,"mapNumber":"2","region":"Teldrassil","shops":[{"name":"User Generated Content","uniqueItems":"##usergenerated##","specialism":null,"categories":[],"size":"small","currency":"money","hash":1889001907}]}';
 
$jsonData = json_decode($json, true);
$thisMapsRegion = $jsonData['region'];
$chr = $jsonData['chr'];



// get any Regional modifiers:
$modifiersQuery = "SELECT * from tblregionalpricemodifiers WHERE whichregion = '".$thisMapsRegion ."'";
$categoryModifier = array();
    $modifiersResult = mysqli_query($connection,  $modifiersQuery ) or die ( "couldn't execute query: ".$modifiersQuery );
$numberofrows = mysqli_num_rows( $modifiersResult );
    if ( $numberofrows>0 ) {
        while ( $modifierRow = mysqli_fetch_array( $modifiersResult ) ) {
            extract( $modifierRow );

            $categoryModifier[$itemCategory] = floatval($priceModifier);
        }
    }
mysqli_free_result($modifiersResult);




$shopSizePriceLimits = ["small"=>"5", "medium"=>"10", "large"=>"9999999999"];
 
$allItemIdsUsed = [];
$markupToOutput = '';
 
// get colours:
$coloursQuery = "SELECT * from tblcolours";
$allColours = [];
$colourResult = mysqli_query($connection, $coloursQuery) or die ("recipes failed");
while ($colourRow = mysqli_fetch_array($colourResult)) {
    extract($colourRow);
    array_push($allColours, $colourName);
}
mysqli_free_result($colourResult);
// just use "primary" colours:
$colourIndicesToUse = [1,2,4,6,8,16];
 

 

// get current active events:
$activeEvents = [];
$eventsQuery = "SELECT eventid from tblevents WHERE ((repeatsAnnually and ((dayofyear(now()) between (dayofyear(eventstart)) and (dayofyear(eventstart)+eventdurationdays-1)) or (dayofyear(now()) between (dayofyear(eventstart) - 365) and (dayofyear(eventstart)+eventdurationdays-366)))) or ((repeatsAnnually = 0) and (date(now()) between (eventstart) and (eventstart+eventdurationdays))))";

    $eventsResult = mysqli_query($connection,  $eventsQuery ) or die ( "couldn't execute events query: ".$eventsQuery );
$numberofrows = mysqli_num_rows( $eventsResult );
    if ( $numberofrows>0 ) {
        while ( $row = mysqli_fetch_array( $eventsResult ) ) {
            //extract( $row );
            array_push($activeEvents, $row['eventid']);
        }
    }
mysqli_free_result($eventsResult);


$activeSeasonQuery = 'tblinventoryitems.activeduringseason is null';
if(count($activeEvents)>0) {
   $activeSeasonQuery = '(tblinventoryitems.activeduringseason in ('.implode(",",$activeEvents).') or tblinventoryitems.activeduringseason is null)'; 
}

 
for ($i=0;$i<count($jsonData['shops']);$i++) {

    $markupToOutput .= '<div class="shop" id="shop'.$jsonData['shops'][$i]["hash"].'" data-currency="'.$jsonData['shops'][$i]["currency"].'" data-specialism="'.$jsonData['shops'][$i]["specialism"].'">';
$markupToOutput .= '<div class="draggableBar">'.$jsonData['shops'][$i]["name"].'</div><button class="closePanel">close</button><ol>';
$inventoryData = [];
 
if(count($jsonData['shops'][$i]["categories"]) > 0) {

$query2 = "SELECT tblinventoryitems.* from tblinventoryitems where tblinventoryitems.itemcategories in (".implode(",",$jsonData['shops'][$i]["categories"]).") and tblinventoryitems.pricecode <= ".$shopSizePriceLimits[($jsonData['shops'][$i]["size"])]." and ".$activeSeasonQuery." and tblinventoryitems.showinthecodex = 1 order by tblinventoryitems.shortname ASC";
// Get colour variants as well for relevant items
 
$result2 = mysqli_query($connection, $query2) or die ("failed:".$query2);
 
while ($row = mysqli_fetch_array($result2, MYSQLI_ASSOC)) {
    array_push($inventoryData, $row);
}
mysqli_free_result($result2);
 
}


if($jsonData['shops'][$i]["uniqueItems"] == '##usergenerated##') {
    echo "got UGC";
$UGCQuery = "select * from tblplayergeneratedcontent where characterID='".$chr."' and isActive='1'";
} else {
// get unique items:
 
if(count($jsonData['shops'][$i]["uniqueItems"])>0) {
     



    $itemIdsToGet =implode(",",array_keys($jsonData['shops'][$i]["uniqueItems"]));
     
 
 
 
$query3 = "SELECT tblinventoryitems.* from tblinventoryitems where tblinventoryitems.itemID in (".$itemIdsToGet.") order by tblinventoryitems.shortname ASC";
 
$result3 = mysqli_query($connection, $query3) or die ("recipes failed:".$query3);
while ($row = mysqli_fetch_array($result3, MYSQLI_ASSOC)) {
   
    // check if any of the unique data overides the defaults:
    $thisUniqueItem = $jsonData['shops'][$i]["uniqueItems"][$row["itemID"]];
    for ($j=0;$j<count($thisUniqueItem);$j++) {
foreach ($thisUniqueItem[$j] as $key => $value) {
 $row[$key] = $value;
}
array_push($inventoryData, $row);
 
    }
 
}
mysqli_free_result($result3);

}
 
 }
 
 
// check for items that need colour, add these to the list
// add a colourName attribute so that can be sorted rather than the numeric value
// then sort
 
 
/*
 echo "<pre><code>";
 var_dump($inventoryData);
 echo "</code></pre>";
 */
 

 
$itemIdsThatNeedColourVariants = [12,40,66];
$inventoryDataCount = count($inventoryData);
for ($j=0;$j<$inventoryDataCount;$j++) {
    $inventoryData[$j]['colourName'] = "";
    // check if this item needs colours (dyes, inks, seeds etc)
    if (in_array($inventoryData[$j]['itemID'], $itemIdsThatNeedColourVariants)) {
        $hasFoundAColourVariant = false;
        for ($k=0;$k<count($colourIndicesToUse);$k++) {
            // make sure that an equivilent named item doesn't exist: 
            $foundEquivilent = false;
            for ($l=0;$l<count($inventoryData);$l++) {
                if($l!=$j) {
                    if($inventoryData[$j]['itemGroup'] == $inventoryData[$l]['itemGroup']) {
                        if($inventoryData[$l]['colour'] == $colourIndicesToUse[$k]) {
                            $foundEquivilent = true;
                        }
                    }
                }
            }
            if(!$foundEquivilent) {
                $newColourItem = $inventoryData[$j];
                $newColourItem['colourName'] = $allColours[($colourIndicesToUse[$k])]." ";
                $newColourItem['colour'] = $colourIndicesToUse[$k];
                array_push($inventoryData, $newColourItem);
                $hasFoundAColourVariant = true;
            }
        }
        if($hasFoundAColourVariant) {
            unset($inventoryData[$j]);
        }
    } else {
        // see if its colour needs displaying:
        if(($inventoryData[$j]['colour'] != 0) && ($inventoryData[$j]['hasInherentColour'] == 0)) {
            $inventoryData[$j]['colourName'] = $allColours[$inventoryData[$j]['colour']]." ";
        }
    }
}
 
 
$inventoryDataToSort = array_values($inventoryData);
 
 
 
// sort by shortname and then colour:
// http://stackoverflow.com/questions/3232965/sort-multidimensional-array-by-multiple-keys/3233009#3233009
unset($shortname);
unset($colour);

foreach ($inventoryDataToSort as $sortkey => $sortrow) {
    $shortname[$sortkey]  = $sortrow['shortname'];
    $colour[$sortkey] = $sortrow['colourName'];
}
array_multisort($shortname, SORT_ASC, $colour, SORT_ASC, $inventoryDataToSort);
 
 
$thisShopsSpecialism = $jsonData['shops'][$i]["specialism"];
 
 

for ($j=0;$j<count($inventoryDataToSort);$j++) {
    array_push($allItemIdsUsed, $inventoryDataToSort[$j]['itemID']);
$markupToOutput .= '<li id="shopSlot'.$i.'-'.$j.'">';
$colourSuffix = '';
if($inventoryDataToSort[$j]['colourName'] != '') {
    $colourSuffix = '-'.strtolower(trim($inventoryDataToSort[$j]['colourName']));
}
 
$thisItemsPrice = intval($inventoryDataToSort[$j]['priceCode']);

$specialPriceClass = '';
if($thisShopsSpecialism) {
// compare the specialism as a string:
    if(strrpos($inventoryDataToSort[$j]['itemCategories'], ''.$thisShopsSpecialism) !== false) {
    $thisItemsPrice = $thisItemsPrice*$sellPriceSpecialismModifier;
    $specialPriceClass = ' specialPrice';
   
     
}
} 


// check for regional price variation too
if(isset($categoryModifier[($inventoryDataToSort[$j]['itemCategories'])])) {

 $thisItemsPrice = $thisItemsPrice*$categoryModifier[($inventoryDataToSort[$j]['itemCategories'])];

    $specialPriceClass = ' specialPrice';
}


 
$thisItemsPrice = ceil($thisItemsPrice * $inflationModifier);
 
$imgDataAttributes = 'data-price="'.$thisItemsPrice.'"';
$imgDataAttributes .= ' data-colour="'.$inventoryDataToSort[$j]['colour'].'"';
$imgDataAttributes .= ' data-type="'.$inventoryDataToSort[$j]['itemID'].'"';
 
if(isset($inventoryDataToSort[$j]['contains'])) {
$imgDataAttributes .= ' data-contains="'.$inventoryDataToSort[$j]['contains'].'"';
}
if(isset($inventoryDataToSort[$j]['inscription'])) {
$imgDataAttributes .= ' data-inscription="'.$inventoryDataToSort[$j]['inscription'].'"';
}
 
$markupToOutput .= '<img src="/images/game-world/inventory-items/'.$inventoryDataToSort[$j]['itemID'].$colourSuffix.'.png" '.$imgDataAttributes.' alt="'.$inventoryDataToSort[$j]['colourName'].$inventoryDataToSort[$j]['shortname'].'">';
$markupToOutput .= '<p><em>'.$inventoryDataToSort[$j]['colourName'].$inventoryDataToSort[$j]['shortname'].'</em>'.$inventoryDataToSort[$j]['description']." ";
$markupToOutput .= '<span class="price'.$specialPriceClass.'">Buy price: '.parseMoney($thisItemsPrice).'</span></p>';
$markupToOutput .= '</li>';
 
}
 
$markupToOutput .= '</ol></div></div>';
 
}
 
 
// output all IDs used so they can be loaded into the game's inventory data:
$allItemIdsUsed = array_unique($allItemIdsUsed);

// create JSON response:
echo '{"markup": ["'.addcslashes($markupToOutput, '"\\/').'"],"allItemIds": ["'.implode("|",$allItemIdsUsed).'"]}';
//echo htmlentities($markupToOutput);
 
 
?>