<?php

include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/functions.php");
$chr = $_GET["chr"];

$homeBaseContinent = "eastern-continent";
$homeBaseX = 200;
$homeBaseY = 350;


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

$outputJson = '{"quests": {';

while ($row = mysqli_fetch_array($result)) {
	extract($row);
	$outputJson .= '"'.$questID.'": {';
	$outputJson .= '"journalTitle": "'.$journalTitle.'",';
	$outputJson .= '"isRepeatable": "'.$isRepeatable.'",';
	if($startItemsReceived) {
$outputJson .= '"startItemsReceived": '.$startItemsReceived.',';
	} else {
		$outputJson .= '"startItemsReceived": "",';
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
$checkFollowerQuery = mysqli_query($connection, "SELECT * from tblretinuefollowers where followerName='".$newFollower[0]."'");
$numRows = mysqli_num_rows($checkFollowerQuery);
} while ($numRows>0);

// add to database with chr and followerRewardFromQuestId so the journal knows which follower to display:



$followerName = $newFollower[0];
$followerCleanURL = cleanURL($followerName);
$characterIdFollowing = $chr;
$activeQuestId = -1;
$followerRewardFromQuestId = $questID;
$questStartedTime = null;
$followerSex = $newFollower[1];
$followerRace = $newFollower[2];
$currentContinent = $homeBaseContinent;
$followerMapCoordinateX = $homeBaseX;
$followerMapCoordinateY = $homeBaseY;

    $insertQuery = "INSERT INTO tblretinuefollowers (followerName, followerCleanURL, characterIdFollowing, activeQuestId, isEnabled, followerRewardFromQuestId, questStartedTime, followerSex, followerRace, currentContinent, followerMapCoordinateX, followerMapCoordinateY)
    VALUES ('".htmlentities($followerName)."','".$followerCleanURL."','".$characterIdFollowing."','".$activeQuestId."', '0', '".$followerRewardFromQuestId."','".$questStartedTime."','".$followerSex."','".$followerRace."','".$currentContinent."','".$followerMapCoordinateX."','".$followerMapCoordinateY."')";

    $insertResult = mysqli_query($connection, $insertQuery);
   



// create image in /images/retinue folder:
    $followerImage = imagecreatefrompng('../images/retinue/source/'.cleanURL($followerRace).'-'.cleanURL($followerSex).'.png');
imagepng($followerImage, '../images/retinue/' . mysqli_insert_id() . '.png', 0);
    imagedestroy($followerImage);

// add the details to the JSON for the quest rewards:
$itemReceivedJSON[$thisItemKey]['type'] = "follower";
$itemReceivedJSON[$thisItemKey]['id'] = mysqli_insert_id();
$itemReceivedJSON[$thisItemKey]['name'] = htmlentities($newFollower[0]);

}
	}
}
	}


$itemsReceivedOnCompletion = json_encode($itemReceivedJSON);

			$outputJson .= '"itemsReceivedOnCompletion": '.$itemsReceivedOnCompletion.',';
	} else {
	$outputJson .= '"itemsReceivedOnCompletion": "",';
	}

	$outputJson .= '"whatIsRequiredForCompletion": "'.$whatIsRequiredForCompletion.'",';


$innerquery = "SELECT * from tblquestsstatus where charid='".$chr."' AND questid='".$questID."'";
$innerresult = mysqli_query($connection, $innerquery) or die ();
if (mysqli_num_rows($innerresult)>0) {
$innerrow = mysqli_fetch_array($innerresult);
extract($innerrow);
	}

	switch ($whatIsRequiredForCompletion) {
		case "possess":
		case "give":
		
		case "":
		$outputJson .= '"itemsNeededForCompletion": "'.$itemsNeededForCompletion.'",';
		
		break;
		case "craft":
		$outputJson .= '"itemsNeededForCompletion": '.$itemsNeededForCompletion.',';
		break;

		case "multi":
		$outputJson .= '"subQuestsRequiredForCompletion": "'.$subQuestsRequiredForCompletion.'",';
		break;
		case "world":
		if (isset($hasBeenActivated)) {
			$outputJson .= '"hasBeenActivated": "'.$hasBeenActivated.'",';
	} else {
		$outputJson .= '"hasBeenActivated": "0",';
	}
		
		break;
		default:
		$outputJson .= '"thresholdNeededForCompletion": "'.$thresholdNeededForCompletion.'",';
		if (isset($thresholdAtQuestStart)) {
			$outputJson .= '"thresholdAtQuestStart": "'.$thresholdAtQuestStart.'",';
	}
		$outputJson .= '"valueAtQuestStart": "",';
	}

if (isset($isUnderway)) {
			$outputJson .= '"isUnderway": "'.$isUnderway.'",';
	}
	if (isset($hasBeenActivated)) {
			$outputJson .= '"hasBeenCompleted": "'.$hasBeenCompleted.'",';
	} else {
		// false:
		$outputJson .= '"hasBeenCompleted": "0",';
	}

	$outputJson .= '"titleGainedAfterCompletion": "'.$titleGainedAfterCompletion.'"';
	$outputJson .= '},';
}

// remove last comma:
$outputJson = rtrim($outputJson, ",");

$outputJson .= '}}';

echo $outputJson;
mysqli_free_result($result);
?>