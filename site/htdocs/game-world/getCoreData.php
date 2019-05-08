<?php

include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/functions.php");


header('Content-Type: application/json');


$debug = false;
if(isset($_GET["debug"])) {
$debug = true;
}
if(!$debug) {
header('Content-Type: application/json');
}

$worldMapTileLength = 50;

$homeBaseContinent = "eastern-continent";
$homeBaseX = 200;
$homeBaseY = 350;

$chr = $_GET['chr'];

$outputJSON = '{';




// get core data:
$query = "SELECT * from tblcharacters where charID='".$chr."'";

   $result = mysqli_query($connection, $query);
if(mysqli_num_rows($result)>0) {

$outputJSON .= '"gameState": {';

  while ($row = mysqli_fetch_array($result)) {
    extract($row);

$outputJSON .= '"characterName": "'.$charName.'",';
//$outputJSON .= '"currentMap": '.$currentMap.',';
$outputJSON .= '"tileX": '.$tileX.',';
$outputJSON .= '"tileY": '.$tileY.',';
$outputJSON .= '"bags": '.$bags.',';
$outputJSON .= '"inventory": '.$inventory.',';
$outputJSON .= '"cards": '.$cards.',';
$outputJSON .= '"stats": '.$stats.',';
$outputJSON .= '"settings": '.$settings.',';
$outputJSON .= '"titlesEarned": '.$titlesEarned.',';
$possibleCurrentTitles = explode(",",   str_replace("[", "", str_replace("]", "", $titlesEarned))         );
$outputJSON .= '"activeTitle": '.$activeTitle.',';
$outputJSON .= '"professionsKnown": '.$professionsKnown.',';
$outputJSON .= '"recipesKnown": '.$recipesKnown.',';
$heroRecipesKnown =  explode(",",   str_replace("[", "", str_replace("]", "", $recipesKnown))         );
$outputJSON .= '"holding": '.$holding.',';
$outputJSON .= '"activeTreasureMaps": '.$activeTreasureMaps.',';
$outputJSON .= '"plantCrossesKnown": '.$plantCrossesKnown.',';
$outputJSON .= '"totalGameTimePlayed": '.$totalGameTimePlayed.',';
$outputJSON .= '"fae": '.$fae.',';
$outputJSON .= '"activePets": '.$activePets.',';
$outputJSON .= '"allPets": '.$allPets.',';
$outputJSON .= '"currency": '.$currency.',';
$outputJSON .= '"npcsFollowing": '.$npcsFollowing.',';
$outputJSON .= '"lineOfSightRange": '.$lineOfSightRange.',';
$outputJSON .= '"retinueMapAreasRevealed": '.$retinueMapAreasRevealed.',';
$outputJSON .= '"collections": '.$collections.',';
$outputJSON .= '"catalogues": '.$catalogues.',';
$outputJSON .= '"actions": '.$actions;
$outputJSON .= '}';





if($activeQuests == "[]") {
$activeQuests = array();
} else {
	$activeQuests = explode(",",   str_replace("[", '', str_replace("]", '', $activeQuests)));
}



  }


}
mysqli_free_result($result);


// getColours:
$query = "SELECT * FROM tblcolours";
$result = mysqli_query($connection, $query) or die ();
$outputJSON .= ',"colours":{ "colourNames":[';
while ($row = mysqli_fetch_array($result)) {
	extract($row);
$outputJSON .= '"'.$colourName.'",';
}
// remove last comma:
$outputJSON = rtrim($outputJSON, ",");
$outputJSON .= ']}';

mysqli_free_result($result);



// check for any unhired followers for this characters that were created more than 24 hours ago, and delete them:

$checkHiredFollowerQuery = "DELETE from tblretinuefollowers where isHired='1' and characterIdFollowing='".$chr."' and isEnabled='0' and generatedAtTime < DATE_SUB(NOW(), INTERVAL 24 HOUR)";
$result = mysqli_query($connection, $checkHiredFollowerQuery) or die ("couldn't execute checkHiredFollowerQuery");



// getHorticulturalDetails:
$possibleBreedablePlants = [];
$plantNames = [];
// item category 1 is flowers: (use showInTheCodex to remove nodes etc)
$query = 'select itemid, shortname from tblinventoryitems where itemcategories = 9 order by shortname ASC';
$result = mysqli_query($connection, $query);
if(mysqli_num_rows($result)>0) {
  while ($row = mysqli_fetch_array($result)) {
  	array_push($possibleBreedablePlants,$row['itemid']);
    $plantNames[($row['itemid'])] = $row['shortname'];
  	}
  }
  mysqli_free_result($result);
// array built so that "1-2": 3 means if species #1 and species #2 are bred, then the result is species #3
// the smaller number is a;lways first in the key (eg. 1-2, not 2-1)
// do each for flowers, herbs and trees ########
// get which crosses the character knows:
$plantCrossesKnown=[];
$query2 = 'SELECT plantcrossesknown from tblcharacters where charid="'.$chr.'"';
$result2 = mysqli_query($connection, $query2);
if(mysqli_num_rows($result2)>0) {
  while ($row = mysqli_fetch_array($result2)) {
$plantCrossesString = $row['plantcrossesknown'];
// remove [, ] and "
$plantCrossesString = str_replace("[", "", $plantCrossesString);
$plantCrossesString = str_replace("]", "", $plantCrossesString);
$plantCrossesString = str_replace('"', '', $plantCrossesString);
    $plantCrossesKnown = explode(",",$plantCrossesString);
}
}
  mysqli_free_result($result2);
 // sort the results so that they're different for each character, so it can't be spoiled:
// (the player can always buy a particular seed that they're after if they want)
mt_srand($chr);
$sortedPossibleBreedablePlants = $possibleBreedablePlants;
function seededRandomSort($a, $b) {
    if (mt_rand(0,1) == 0) {
        return -1;
    } else {
    	return 1;
    }
}
usort($sortedPossibleBreedablePlants, "seededRandomSort");
$plantBreeding = [];
 $arrayCounter = 0;
 for ( $i = 0; $i < count($sortedPossibleBreedablePlants); $i++) {
        for ( $j = 0; $j < count($sortedPossibleBreedablePlants); $j++) {
            if ($i != $j) {
            	if ($sortedPossibleBreedablePlants[$i] < $sortedPossibleBreedablePlants[$j]) {
                    $thisKey = $sortedPossibleBreedablePlants[$i] . "-" . $sortedPossibleBreedablePlants[$j];
                } else {
                    $thisKey = $sortedPossibleBreedablePlants[$j] . "-" . $sortedPossibleBreedablePlants[$i];
                }
                if (!array_key_exists($thisKey, $plantBreeding)) {

				do {
                        $arrayCounter++;
                        if ($arrayCounter >= count($sortedPossibleBreedablePlants)) {
                            $arrayCounter = 0;
                        }
                        $thisResultType = $sortedPossibleBreedablePlants[$arrayCounter];
                        // make sure this offspring isn't the same as either parent:

                    } while (($thisResultType == $sortedPossibleBreedablePlants[$j]) || ($thisResultType == $sortedPossibleBreedablePlants[$i]));
                    $plantBreeding[$thisKey] = $sortedPossibleBreedablePlants[$arrayCounter];
                }
            }
        }
    }

if($debug) {
 var_dump($plantBreeding);
}
$dataOutput = json_encode($plantBreeding);
// build output table:
	     $markup = '<table>';
    for ( $i = 0; $i <= count($possibleBreedablePlants); $i++) {
        $markup .= '<tr>';
        for ( $j = 0; $j <= count($possibleBreedablePlants); $j++) {
           // $markup .= '<td style="border:1px solid #cecece;padding:6px;">';
            if ($i == 0) {
                if ($j == 0) {
                    $markup .= '<td></td>';
                } else {
                    $markup .= '<th><img src="/images/game-world/inventory-items/' . $possibleBreedablePlants[$j - 1] . '.png"><p>'.$plantNames[($possibleBreedablePlants[$j - 1])].'</p></th>';
                }
            } else {
                if ($j == 0) {
                    $markup .= '<th><img src="/images/game-world/inventory-items/' . $possibleBreedablePlants[$i - 1] . '.png"><p>'.$plantNames[($possibleBreedablePlants[$i - 1] )].'</p></th>';
                } else {
                    if ($i == $j) {
                        $markup .= '<td><img src="/images/game-world/inventory-items/' . $possibleBreedablePlants[$i - 1] . '.png"><p>'.$plantNames[($possibleBreedablePlants[$i - 1])].'</p></th>';
                    } else {
                        if ($possibleBreedablePlants[$i - 1] < $possibleBreedablePlants[$j - 1]) {
                            $thisKey = $possibleBreedablePlants[$i - 1] . "-" . $possibleBreedablePlants[$j - 1];
                        } else {
                            $thisKey = $possibleBreedablePlants[$j - 1] . "-" . $possibleBreedablePlants[$i - 1];
                        }
                      
                        if(in_array($thisKey, $plantCrossesKnown)) {
$markup .= '<td><img src="/images/game-world/inventory-items/' . $plantBreeding[$thisKey] . '.png"><p>'.$plantNames[($plantBreeding[$thisKey])].'</p></th>';
                        } else {
                            $markup .= '<td class="parent'.$thisKey.'">?</td>';
                        }
                        
                    }
                }
            }
          //  $markup .= '</td>';
        }
        $markup .= '</tr>';
    }
    $markup .= '</table>';


    if($debug) {
echo '<hr>';
echo $dataOutput;
echo '<hr>';

    echo $markup;
} else {
  
    $markup = str_replace('"', '\"', $markup);
    $outputJSON .= ',"horticulture":{"markup":"'.$markup.'", "data":'.$dataOutput.'}';
}




// getQuestDetails:





/*
{
	"quests": {
		"1": {
		// item quest
			"isRepeatable": false,
			"startItemsReceived": "14,17",
			"itemsReceivedOnCompletion": "2x18",
			"whatIsRequiredForCompletion": "possess | give | null",
			"itemsNeededForCompletion": "5x16,12",
			"titleGainedAfterCompletion": 4
		},
		"4": {
		// location quest
			"isRepeatable": false,
			"startItemsReceived": "",
			"itemsReceivedOnCompletion": "18,20",
			"whatIsRequiredForCompletion": "world",
			"hasBeenActivated": true,
			"titleGainedAfterCompletion": null
		},
		"16": {
		// threshold quest
			"isRepeatable": true,
			"startItemsReceived": "",
			"itemsReceivedOnCompletion": "",
			"whatIsRequiredForCompletion": "hero.stats.cardsFlipped",
			"thresholdNeededForCompletion": 10,
			"valueAtQuestStart": 3,
			"titleGainedAfterCompletion": null
		}
	}
}

*/


$query = "SELECT * FROM tblquests";
$result = mysqli_query($connection, $query) or die ();

$outputJSON .= ',"quests": {';

while ($row = mysqli_fetch_array($result)) {
	extract($row);
	$outputJSON .= '"'.$questID.'": {';
	$outputJSON .= '"journalTitle": "'.$journalTitle.'",';
	$outputJSON .= '"isRepeatable": "'.$isRepeatable.'",';
	if($startItemsReceived) {
$outputJSON .= '"startItemsReceived": '.$startItemsReceived.',';
	} else {
		$outputJSON .= '"startItemsReceived": "",';
	}
	
	if($itemsReceivedOnCompletion != null) {

$itemReceivedJSON = json_decode($itemsReceivedOnCompletion, true);

foreach ($itemReceivedJSON as $thisItemKey => $thisItem) {

if($thisItem['type'] == "follower") {	


// check the follower isn't already defined:
	if(!(isset($thisItem['id']))) {

// only generate a new follower if it hasn't already created one

		$checkAlreadyCreatedFollowerQuery = mysqli_query($connection, "SELECT * from tblretinuefollowers where followerRewardFromQuestId = '".$questID."' and characterIdFollowing = '".$chr."'");
$numRows = mysqli_num_rows($checkAlreadyCreatedFollowerQuery);
if($numRows == 0) {



// generate new follower:
include_once($_SERVER['DOCUMENT_ROOT']."/game-world/generateRetinueFollower.php");
		
		// make sure name is unique for this character:
do {
		$newFollower = generateFollower();
$checkFollowerQuery = mysqli_query($connection, "SELECT * from tblretinuefollowers where followerName='".$newFollower[0]."' and characterIdFollowing='".$chr."'");
$numRows = mysqli_num_rows($checkFollowerQuery);
} while ($numRows>0);

// add to database with chr and followerRewardFromQuestId so the journal knows which follower to display:



$followerName = $newFollower[0];
$followerCleanURL = cleanURL($followerName);
$characterIdFollowing = $chr;
$activeQuestId = -1;
$followerRewardFromQuestId = $questID;
$questStartedTime = null;
$generatedAtTime = date("Y-m-d H:i:s");
$followerSex = $newFollower[1];
$followerRace = $newFollower[2];
$currentContinent = $homeBaseContinent;
$followerMapCoordinateX = $homeBaseX;
$followerMapCoordinateY = $homeBaseY;

    $insertQuery = "INSERT INTO tblretinuefollowers (followerName, followerCleanURL, characterIdFollowing, activeQuestId, isEnabled, followerRewardFromQuestId, generatedAtTime, questStartedTime, followerSex, followerRace, currentContinent, followerMapCoordinateX, followerMapCoordinateY)
    VALUES ('".htmlentities($followerName)."','".$followerCleanURL."','".$characterIdFollowing."','".$activeQuestId."', '0', '".$followerRewardFromQuestId."','".$generatedAtTime."','".$questStartedTime."','".$followerSex."','".$followerRace."','".$currentContinent."','".$followerMapCoordinateX."','".$followerMapCoordinateY."')";

    $insertResult = mysqli_query($connection, $insertQuery);
   
// create image in /images/retinue folder:
    $followerImage = imagecreatefrompng('../images/retinue/source/'.cleanURL($followerRace).'-'.cleanURL($followerSex).'.png');
imagepng($followerImage, '../images/retinue/' . mysqli_insert_id($connection) . '.png', 0);
    imagedestroy($followerImage);

// add the details to the JSON for the quest rewards:
$itemReceivedJSON[$thisItemKey]['type'] = "follower";
$itemReceivedJSON[$thisItemKey]['id'] = mysqli_insert_id($connection);
$itemReceivedJSON[$thisItemKey]['name'] = htmlentities($newFollower[0]);

}
	}
}



if($thisItem['type'] == "82") {
if(isset($thisItem['contains'])) {
	if($thisItem['contains'] == "##procedural##") {


if(!isset($worldMap)) {
$jsonMapResults = file_get_contents($_SERVER['DOCUMENT_ROOT'].'/data/world-map.json');
$mapJson = json_decode($jsonMapResults, true);
$worldMap = $mapJson['worldMap'];
}




if(!isset($activeEvents)) {
// get current active events:
$activeEvents = [];
$activeEventsID = [];
$eventsQuery = "SELECT cleanURL, eventID from tblevents WHERE ((repeatsAnnually and ((dayofyear(now()) between (dayofyear(eventstart)) and (dayofyear(eventstart)+eventdurationdays-1)) or (dayofyear(now()) between (dayofyear(eventstart) - 365) and (dayofyear(eventstart)+eventdurationdays-366)))) or ((repeatsAnnually = 0) and (date(now()) between (eventstart) and (eventstart+eventdurationdays))))";

$eventsResult = mysqli_query($connection,  $eventsQuery ) or die ( "couldn't execute events query: ".$eventsQuery );
$numberofrows = mysqli_num_rows( $eventsResult );
if ( $numberofrows>0 ) {
    while ( $row = mysqli_fetch_array( $eventsResult ) ) {
    array_push($activeEvents, $row['cleanURL']);
    array_push($activeEventsID, $row['eventID']);
    }
}
mysqli_free_result($eventsResult);
}

	//$thisItem['contains'] = generateTreasureMap();
	$itemReceivedJSON[$thisItemKey]['contains'] = generateTreasureMap();
}
}
}



	}


$itemsReceivedOnCompletion = json_encode($itemReceivedJSON);

			$outputJSON .= '"itemsReceivedOnCompletion": '.$itemsReceivedOnCompletion.',';
	} else {
	$outputJSON .= '"itemsReceivedOnCompletion": "",';
	}

	$outputJSON .= '"whatIsRequiredForCompletion": "'.$whatIsRequiredForCompletion.'",';


$innerquery = "SELECT * from tblquestsstatus where charid='".$chr."' AND questid='".$questID."'";
$innerresult = mysqli_query($connection, $innerquery) or die ();
if (mysqli_num_rows($innerresult)>0) {
$innerrow = mysqli_fetch_array($innerresult);
extract($innerrow);
	}

	switch ($whatIsRequiredForCompletion) {
		case "possess":
		case "give":
		case "craft":
		case "":
		$outputJSON .= '"itemsNeededForCompletion": '.$itemsNeededForCompletion.',';
		
		break;
		
	

		case "multi":
		$outputJSON .= '"subQuestsRequiredForCompletion": "'.$subQuestsRequiredForCompletion.'",';
		break;
		case "world":
		if (isset($hasBeenActivated)) {
			$outputJSON .= '"hasBeenActivated": "'.$hasBeenActivated.'",';
	} else {
		$outputJSON .= '"hasBeenActivated": "0",';
	}
		
		break;
		default:
		$outputJSON .= '"thresholdNeededForCompletion": "'.$thresholdNeededForCompletion.'",';
		if (isset($thresholdAtQuestStart)) {
			$outputJSON .= '"thresholdAtQuestStart": "'.$thresholdAtQuestStart.'",';
	}
		$outputJSON .= '"valueAtQuestStart": "",';
	}

if (isset($isUnderway)) {
			$outputJSON .= '"isUnderway": "'.$isUnderway.'",';
	}
	if (isset($hasBeenActivated)) {
			$outputJSON .= '"hasBeenCompleted": "'.$hasBeenCompleted.'",';
	} else {
		// false:
		$outputJSON .= '"hasBeenCompleted": "0",';
	}

	$outputJSON .= '"titleGainedAfterCompletion": "'.$titleGainedAfterCompletion.'"';

if($titleGainedAfterCompletion != "") {

array_push($possibleCurrentTitles, $titleGainedAfterCompletion);
}

	$outputJSON .= '},';
}

// remove last comma:
$outputJSON = rtrim($outputJSON, ",");

$outputJSON .= '}';


mysqli_free_result($result);






// getTitles:

$uniqueTitlesRequired = array_unique($possibleCurrentTitles);
$query = "SELECT * FROM tbltitles where titleid in (".implode(", ",$uniqueTitlesRequired).")";
$result = mysqli_query($connection, $query) or die ();
$outputJSON .= ',"titles":{';
while ($row = mysqli_fetch_array($result)) {
	extract($row);

	$outputJSON .= '"'.$titleID.'": "'.$titleName.'",';
}

// remove last comma:
$outputJSON = rtrim($outputJSON, ",");
$outputJSON .= '}';
mysqli_free_result($result);






// getCardDetails:

$query = "SELECT * FROM tblcards";
$result = mysqli_query($connection, $query) or die ();

$outputJSON .= ',"cards":{ "cards":[';
$outputJSON .= '[null, null, null],';

while ($row = mysqli_fetch_array($result)) {
	extract($row);
$outputJSON .= '["'.$cardAttack.'", "'.$cardDefense.'", "'.$cardName.'", "'.$cardCraftingCost.'"],';
}

// remove last comma:
$outputJSON = rtrim($outputJSON, ",");


/*
$query2 = "SELECT * FROM tblcharacters WHERE charID = '".$chr."'";
$result2 = mysqli_query($connection, $query2) or die ();
$row2 = mysqli_fetch_array($result2);
extract($row2);
*/

$outputJSON .= '],"backs":';
$outputJSON .= $cardBacks;
$outputJSON .= ',"activeBack": "'.$activeCardBack.'"';





$outputJSON .= '}';



mysqli_free_result($result);






// get Professions and Recipes:


$coloursQuery = "SELECT * from tblcolours";
$allColours = [];
$allItemGroups = [];
$colourResult = mysqli_query($connection, $coloursQuery) or die ("recipes failed");
while ($colourRow = mysqli_fetch_array($colourResult)) {
	extract($colourRow);
	array_push($allColours, $colourName);
}





$outputJSON .= ',"recipes":{"all": {';

// get all recipes:
// (could be optimised just to get the ones that will be encountered ########)
$query = "SELECT tblrecipes.*, tblprofessions.*, tblcolours.colourName, tblinventoryitems.itemid as productId, tblinventoryitems.itemcategories as createditemcategories,
CASE WHEN tblrecipes.recipename IS NOT NULL THEN tblrecipes.recipename
 WHEN tblrecipes.defaultresultingcolour IS NOT NULL AND tblinventoryitems.hasInherentColour IS NOT NULL THEN CONCAT_WS(' ',tblcolours.colourname, tblinventoryitems.shortname)
  WHEN tblrecipes.recipename IS NULL THEN tblinventoryitems.shortname
 END as 'finalRecipeName',
 tblinventoryitems.description as recipeDescriptionFallback, tblinventoryitems.hasInherentColour as hasInherentColour FROM tblrecipes INNER JOIN tblprofessions on tblrecipes.profession = tblprofessions.professionid INNER JOIN tblinventoryitems on tblrecipes.creates = tblinventoryitems.itemid LEFT JOIN tblcolours on tblrecipes.defaultresultingcolour = tblcolours.colourid
order by tblprofessions.professionid, finalRecipeName ASC";
$result = mysqli_query($connection, $query) or die ("recipes failed");

while ($row = mysqli_fetch_array($result)) {
	extract($row);
$outputJSON .= '"'.$recipeID.'":["'.$finalRecipeName.'", "'.$professionName.'"],';
}
$outputJSON = rtrim($outputJSON, ",");
mysqli_free_result($result);











$outputJSON .= '},"professions": {';






$itemIdString = implode(", ", $heroRecipesKnown);



$query = "SELECT tblrecipes.*, tblprofessions.*, tblcolours.colourName, tblinventoryitems.itemid as productId, tblinventoryitems.itemcategories as createditemcategories,

CASE WHEN tblrecipes.recipename IS NOT NULL THEN tblrecipes.recipename

 WHEN tblrecipes.defaultresultingcolour IS NOT NULL AND tblinventoryitems.hasInherentColour IS NOT NULL THEN CONCAT_WS(' ',tblcolours.colourname, tblinventoryitems.shortname)
  WHEN tblrecipes.recipename IS NULL THEN tblinventoryitems.shortname
 END as 'finalRecipeName',
 tblinventoryitems.description as recipeDescriptionFallback, tblinventoryitems.hasInherentColour as hasInherentColour FROM tblrecipes INNER JOIN tblprofessions on tblrecipes.profession = tblprofessions.professionid INNER JOIN tblinventoryitems on tblrecipes.creates = tblinventoryitems.itemid LEFT JOIN tblcolours on tblrecipes.defaultresultingcolour = tblcolours.colourid where tblrecipes.recipeid in (".$itemIdString.")
order by tblprofessions.professionid, finalRecipeName ASC";


$result = mysqli_query($connection, $query) or die ("recipes failed");


$thisProfession = -1;


while ($row = mysqli_fetch_array($result)) {
	extract($row);

    if($thisProfession != $profession) {
if($thisProfession != -1) {
    // if not first time:

// remove last comma:
$outputJSON = rtrim($outputJSON, ",");

$outputJSON .= '},';
$outputJSON .= '"sortOrder": ['.implode(",", $thisRecipeOrder).'],';
ksort($thisProfessionsFilters);
$outputJSON .= '"filters": '.json_encode($thisProfessionsFilters).',';
$outputJSON .= '"filterOrder": [';
//implode(",", array_keys($thisProfessionsFilters));
$professionsKeys = array_keys($thisProfessionsFilters);

foreach ($professionsKeys as $value) {
    $outputJSON .= '"'.$value.'",';
}
// remove last comma:

$outputJSON = rtrim($outputJSON, ",");
$outputJSON .= ']';
$outputJSON .= '},';
} 
$thisRecipeOrder = [];
$thisProfessionsFilters = [];

$outputJSON .= '"'.$profession.'": { "name": "'.$professionName.'", ';
$outputJSON .= '"recipes": {';
$thisProfession = $profession;
    }
	
	$outputJSON .= '"'.$recipeID.'":{';
$outputJSON .= '"components":'.$components.',';

$componentsSplit = explode(",", $components);



$componentObject = json_decode($components);

foreach($componentObject as $key => $value) {



    if(!is_numeric($value->type)) {


        array_push($allItemGroups, $value->type);
        }
    }

$outputJSON .= '"creates":"'.$creates.'",';
$outputJSON .= '"hiddenCreates":"'.$hiddenCreates.'",';
$outputJSON .= '"defaultColour":"'.$defaultResultingColour.'",';


$thisRecipesFilters = "Miscellaneous";
if(isset($createditemcategories)) {
// get categories for this item:
$catQuery = "SELECT * FROM tblitemcategories WHERE categoryid in (".$createditemcategories.")";
$catResult = mysqli_query($connection, $catQuery) or die ("categories failed");
 
while ($catRow = mysqli_fetch_array($catResult)) {
    extract($catRow);
    $thisRecipesFilters = $categoryName; 
}
} 


if (array_key_exists($thisRecipesFilters, $thisProfessionsFilters)) {
    array_push($thisProfessionsFilters[$thisRecipesFilters], $recipeID);
} else {
// add new key:
$thisProfessionsFilters[$thisRecipesFilters] = array($recipeID);
}

// add this to the 'all' category
if (array_key_exists("All", $thisProfessionsFilters)) {
    array_push($thisProfessionsFilters["All"], $recipeID);
} else {
// add new key:
$thisProfessionsFilters["All"] = array($recipeID);
}






$outputJSON .= '"prerequisite":"'.$prerequisite.'",';
$outputJSON .= '"tier":"'.$recipeTier.'",';
array_push($thisRecipeOrder, $recipeID);

$thisColour = '';
if($hasInherentColour<1) {
if($defaultResultingColour>0) {
	$thisColour = "-".strtolower($allColours[$defaultResultingColour]);
}
}



$outputJSON .= '"recipeName":"'.$finalRecipeName.'",';


$outputJSON .= '"imageId":"'.$productId.$thisColour.'",';

if($recipeDescription == "") {
$outputJSON .= '"recipeDescription":"'.$recipeDescriptionFallback.'"';
} else {
	$outputJSON .= '"recipeDescription":"'.$recipeDescription.'"';
}

$outputJSON .= '},';

}
// remove last comma:

$outputJSON = rtrim($outputJSON, ",");


$outputJSON .= '},';
$outputJSON .= '"sortOrder": ['.implode(",", $thisRecipeOrder).'],';
ksort($thisProfessionsFilters);
$outputJSON .= '"filters": '.json_encode($thisProfessionsFilters).',';
$outputJSON .= '"filterOrder": [';
//implode(",", array_keys($thisProfessionsFilters));
$professionsKeys = array_keys($thisProfessionsFilters);
foreach ($professionsKeys as $value) {
    $outputJSON .= '"'.$value.'",';
}
// remove last comma:

$outputJSON = rtrim($outputJSON, ",");
$outputJSON .= ']';


$outputJSON .= '}}';


if(count($allItemGroups)>0) {
$outputJSON .= ',"itemGroups": {';

$groupQuery = "select * from tblitemgroups where itemgroupcode in (";

for($i=0;$i<count($allItemGroups);$i++) {
$groupQuery .= '"'.$allItemGroups[$i].'",';
}
   
$groupQuery = rtrim($groupQuery, ",");
$groupQuery .= ")";




$groupResult = mysqli_query($connection, $groupQuery) or die ("item groups failed");

while ($groupRow = mysqli_fetch_array($groupResult)) {
    extract($groupRow);
    //echo $itemGroupCode." - ".$itemGroupDescription."<br />";

$outputJSON .= '"'.$itemGroupCode.'": "'.$itemGroupDescription.'",';

}
$outputJSON = rtrim($outputJSON, ",");
$outputJSON .= '}';

}



$outputJSON .= '}';




// get journal content: 
$isAnUpdate = false;

$numberOfQuests = count($activeQuests);


$journalMarkupToOutput = '<ol>';

include($_SERVER['DOCUMENT_ROOT']."/includes/questJournalEntry.php");

$journalMarkupToOutput .= "</ol>";


$outputJSON .= ',"journal":{"markup": ["'.addcslashes($journalMarkupToOutput, '"\\/').'"],"regions": '.json_encode($regions).'}';





$outputJSON .= '}';
echo $outputJSON;


?>