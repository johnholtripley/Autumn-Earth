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
	$outputJson .= '"isRepeatable": "'.$isRepeatable.'",';
	$outputJson .= '"startItemsReceived": "'.$startItemsReceived.'",';
	$outputJson .= '"itemsReceivedOnCompletion": "'.$itemsReceivedOnCompletion.'",';
	$outputJson .= '"whatIsRequiredForCompletion": "'.$whatIsRequiredForCompletion.'",';

	switch ($whatIsRequiredForCompletion) {
		case "possess":
		case "give":
		case "":
		$outputJson .= '"itemsNeededForCompletion": "'.$itemsNeededForCompletion.'",';
		break;
		case "world":
		$outputJson .= '"hasBeenActivated": "'.$hasBeenActivated.'",';
		break;
		default:
		$outputJson .= '"thresholdNeededForCompletion": "'.$thresholdNeededForCompletion.'",';
		$outputJson .= '"valueAtQuestStart": "",';
	}

	$outputJson .= '"titleGainedAfterCompletion": "'.$titleGainedAfterCompletion.'"';
	$outputJson .= '},';
}

// remove last comma:
$outputJson = rtrim($outputJson, ",");

$outputJson .= '}}';

echo $outputJson;
?>