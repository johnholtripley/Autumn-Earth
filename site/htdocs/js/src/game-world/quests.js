function addToJournal(whichQuestId) {
    // pass hero.totalGameTimePlayed to allow sorting when loading from scratch? ###
    getJSON("/game-world/getQuestJournalEntries.php?questID=" + whichQuestId, function(data) {
        UI.addToQuestJournal(data);
    }, function(status) {
        // error - try again:
        addToJournal(whichQuestId);
    });
}

function removeFromJournal(whichQuestId) {
    var elementToRemove = document.getElementById("quest" + whichQuestId);
    elementToRemove.remove();
}

function declineQuest() {
    acceptQuestChoice.classList.remove('active');
    // show declined speech:
    processSpeech(questResponseNPC, questResponseNPC.speech[questResponseNPC.speechIndex][4], questResponseNPC.speech[questResponseNPC.speechIndex][5], false);
    canCloseDialogueBalloonNextClick = true;
    questResponseNPC = null;
}

function acceptQuest() {
    acceptQuestChoice.classList.remove('active');
    // show accepted speech:
    processSpeech(questResponseNPC, questResponseNPC.speech[questResponseNPC.speechIndex][6], questResponseNPC.speech[questResponseNPC.speechIndex][7], false);
    openQuest(questResponseNPC.speech[questResponseNPC.speechIndex][2]);
    canCloseDialogueBalloonNextClick = true;
    questResponseNPC = null;
}



function openQuest(questId) {

    var okToStartQuest = true;
    // see if any items need to be given to start the quest:
    if (questData[questId].startItemsReceived) {
        var itemsToAdd = questData[questId].startItemsReceived.split(",");
        var allItemsToGive = [];
        for (var l = 0; l < itemsToAdd.length; l++) {
            // check if it's money:
            if (itemsToAdd[l].charAt(0) == "$") {
                thisRewardObject = itemsToAdd[l];
            } else {
                // check for any quantities:
                var thisQuestItem = itemsToAdd[l].split("x");
                var thisQuantity, thisItem;
                if (thisQuestItem.length > 1) {
                    thisQuantity = thisQuestItem[0];
                    thisItem = thisQuestItem[1];
                } else {
                    thisQuantity = 1;
                    thisItem = itemsToAdd[l];
                }
                // build item object:
                var thisRewardObject = {
                    "type": parseInt(thisItem),
                    "quantity": parseInt(thisQuantity),
                    "quality": 100,
                    "durability": 100,
                    "currentWear": 0,
                    "effectiveness": 100,
                    "colour": currentActiveInventoryItems[parseInt(thisItem)].colour,
                    "enchanted": 0,
                    "hallmark": 0,
                    "inscription": ""
                }
            }
            allItemsToGive.push(thisRewardObject);
        }
        inventoryCheck = canAddItemToInventory(allItemsToGive);
        if (inventoryCheck[0]) {
            UI.showChangeInInventory(inventoryCheck[1]);
        } else {
            okToStartQuest = false;
        }
    }
    if (okToStartQuest) {
        // open quest:
        switch (questData[questId].whatIsRequiredForCompletion) {
            case "possess":
            case "give":
            case "":
                // ###
                break;
            case "multi":
                // open all sub quests:
                var allSubQuestsRequired = questData[questId].subQuestsRequiredForCompletion.split(",");

                for (var k = 0; k < allSubQuestsRequired.length; k++) {
                    //questData[allSubQuestsRequired[k]].isUnderway = 1;
                    switch (questData[allSubQuestsRequired[k]].whatIsRequiredForCompletion) {
                        case "possess":
                        case "give":
                        case "":
                            //
                            break;
                        case "world":
                            //
                            break;
                        default:
                            // threshold quest:
                            questData[allSubQuestsRequired[k]].valueAtQuestStart = accessDynamicVariable(questData[allSubQuestsRequired[k]].whatIsRequiredForCompletion);
                            break;
                    }
                    questData[allSubQuestsRequired[k]].isUnderway = true;
                }
                break;
            case "world":
                // ###
                break;
            default:
                // threshold quest:
                questData[questId].valueAtQuestStart = accessDynamicVariable(questData[questId].whatIsRequiredForCompletion);
                break;
        }
        questData[questId].isUnderway = true;
        addToJournal(questId);
    }
}


function checkForEscortQuestEnd(whichNPC) {
    var destination = whichNPC.speech[whichNPC.speechIndex][3].split("|");
    if (destination[0] == currentMap) {
        var destinationTileCentreX = getTileCentreCoordX(destination[1]);
        var destinationTileCentreY = getTileCentreCoordY(destination[2]);
        if (isInRange(whichNPC.x, whichNPC.y, destinationTileCentreX, destinationTileCentreY, destination[3] * tileW)) {
            // quest complete
            console.log("escort quest complete!!");
            whichNPC.drawnFacing = turntoFace(whichNPC, hero);
            // remove the reference to it in the hero object:
            for (var i = 0; i < hero.npcsFollowing.length; i++) {
                if (hero.npcsFollowing[i] === whichNPC) {
                    hero.npcsFollowing.splice(i, 1);
                    break;
                }
            }
            

      


// get fae to move to this NPC:
fae.targetX = whichNPC.x;
fae.targetY = whichNPC.y;
fae.currentState = "away";



            //whichNPC.movement[whichNPC.movementIndex] = "-";
            whichNPC.isMoving = false;
            whichNPC.movementIndex--;
            whichNPC.forceNewMovementCheck = false;
            whichNPC.hasCompletedEscortQuest = true;
            delete whichNPC.following;
        }
    }
}






function closeQuest(whichNPC, whichQuestId) {
    if (giveQuestRewards(whichQuestId)) {
        if (questData[whichQuestId].isRepeatable > 0) {
            questData[whichQuestId].hasBeenCompleted = false;
            questData[whichQuestId].isUnderway = false;
        } else {
            questData[whichQuestId].hasBeenCompleted = true;
            // remove quest text now:
            whichNPC.speech.splice(whichNPC.speechIndex, 1);
            // knock this back one so to keep it in step with the removed item:
            whichNPC.speechIndex--;
        }
        checkForTitlesAwarded(whichQuestId);
    } else {
        // keep the NPC on the quest dialogue:
        whichNPC.speechIndex--;
    }
    removeFromJournal(whichQuestId);

}


function giveQuestRewards(whichQuestId) {
    // give any reward to the player:
    if (questData[whichQuestId].itemsReceivedOnCompletion) {
        var questRewards = questData[whichQuestId].itemsReceivedOnCompletion.split(",");
        return awardQuestRewards(questRewards);
    } else {
        return true;
    }
}

function awardQuestRewards(questRewards) {

    var allRewardItems = [];

    for (var i = 0; i < questRewards.length; i++) {
        // check for variation:
        var questPossibilities = questRewards[i].split("/");
        var questRewardToUse = getRandomElementFromArray(questPossibilities);
        //  console.log(questRewardToUse);

        // check if it's money:
        if (questRewardToUse.charAt(0) == "$") {
            thisRewardObject = questRewardToUse;
        } else {

            // check for any quantities:
            var thisQuestReward = questRewardToUse.split("x");
            var thisQuantity, thisItem;
            if (thisQuestReward.length > 1) {
                thisQuantity = thisQuestReward[0];
                thisItem = thisQuestReward[1];
            } else {
                thisQuantity = 1;
                thisItem = questRewards[i];
            }

            if (questPossibilities.length > 1) {
                // might need to show the name of the item in the speech:           
                thisSpeech = thisSpeech.replace(/##itemName##/i, currentActiveInventoryItems[parseInt(thisItem)].shortname);
            }
            // build item object:
            var thisRewardObject = {
                "type": parseInt(thisItem),
                "quantity": parseInt(thisQuantity),
                "quality": 100,
                "durability": 100,
                "currentWear": 0,
                "effectiveness": 100,
                "colour": currentActiveInventoryItems[parseInt(thisItem)].colour,
                "enchanted": 0,
                "hallmark": 0,
                "inscription": ""
            }
        }
        allRewardItems.push(thisRewardObject);
    }
    inventoryCheck = canAddItemToInventory(allRewardItems);
    if (inventoryCheck[0]) {
        UI.showChangeInInventory(inventoryCheck[1]);

        return true;
    } else {
        UI.showNotification("<p>Oops - sorry, no room in your bags</p>");
        // don't close quest
        return false;
    }

}