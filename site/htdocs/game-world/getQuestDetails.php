<?php

include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");
$chr = $_GET["chr"];

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
$result = mysql_query($query) or die ();

$outputJson = '{"quests": {';

while ($row = mysql_fetch_array($result)) {
	extract($row);
	$outputJson .= '"'.$questID.'": {';
	$outputJson .= '"journalTitle": "'.$journalTitle.'",';
	$outputJson .= '"isRepeatable": "'.$isRepeatable.'",';
	if($startItemsReceived) {
$outputJson .= '"startItemsReceived": '.$startItemsReceived.',';
	} else {
		$outputJson .= '"startItemsReceived": "",';
	}
	
	if($itemsReceivedOnCompletion) {

$itemReceivedJSON = json_decode($itemsReceivedOnCompletion, true);
foreach ($itemReceivedJSON as $thisItem) {
if($thisItem['type'] == "follower") {
// check not already defined:
	if(!(isset($thisItem['id']))) {
// generate new follower:
		// #################
		$itemsReceivedOnCompletion = '[{"type":"follower","id":1,"name":"naileth whisperspringwoodsong"}]';

	}
}
	}

			$outputJson .= '"itemsReceivedOnCompletion": '.$itemsReceivedOnCompletion.',';
	} else {
	$outputJson .= '"itemsReceivedOnCompletion": "",';
	}

	$outputJson .= '"whatIsRequiredForCompletion": "'.$whatIsRequiredForCompletion.'",';


$innerquery = "SELECT * from tblquestsstatus where charid='".$chr."' AND questid='".$questID."'";
$innerresult = mysql_query($innerquery) or die ();
if (mysql_num_rows($innerresult)>0) {
$innerrow = mysql_fetch_array($innerresult);
extract($innerrow);
	}

	switch ($whatIsRequiredForCompletion) {
		case "possess":
		case "give":
		case "":
		$outputJson .= '"itemsNeededForCompletion": "'.$itemsNeededForCompletion.'",';
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
mysql_free_result($result);
?>