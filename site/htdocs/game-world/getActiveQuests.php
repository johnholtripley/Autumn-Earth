<?php
$chr = $_GET["chr"];
?>
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






