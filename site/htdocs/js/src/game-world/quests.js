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
    // show declined speech

    UI.showDialogue(questResponseNPC, questResponseNPC.speech[questResponseNPC.speechIndex][3]);
    canCloseDialogueBalloonNextClick = true;
    questResponseNPC = null;
}

function acceptQuest() {
    acceptQuestChoice.classList.remove('active');
    // show accepted speech 
    openQuest(questResponseNPC.speech[questResponseNPC.speechIndex][2]);


    UI.showDialogue(questResponseNPC, questResponseNPC.speech[questResponseNPC.speechIndex][4]);
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