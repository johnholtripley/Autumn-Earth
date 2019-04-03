function addToJournal(whichQuestId) {
    // pass hero.totalGameTimePlayed to allow sorting when loading from scratch? ###
    getJSON("/game-world/getQuestJournalEntries.php?chr="+characterId+"&questID=" + whichQuestId, function(data) {
        UI.addToQuestJournal(data);
    }, function(status) {
        // error - try again:
        addToJournal(whichQuestId);
    });
}

function removeFromJournal(whichQuestId) {
    var elementToRemove = document.getElementById("quest" + whichQuestId);
    // check it exists, in case it was hidden from the Journal:
    if(elementToRemove) {
    elementToRemove.remove();
}
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
        var itemsToAdd = questData[questId].startItemsReceived;
        var allItemsToGive = [];
        for (var l = 0; l < itemsToAdd.length; l++) {



            var thisRewardObject = prepareInventoryObject(itemsToAdd[l]);


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
    // global coordinates are passed in here:

        var destinationTileCentreX = getTileCentreCoordX(destination[0]);
        var destinationTileCentreY = getTileCentreCoordY(destination[1]);
       
        if (isInRange(whichNPC.x, whichNPC.y, destinationTileCentreX, destinationTileCentreY, destination[2] * tileW)) {
            // quest complete
        
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






function closeQuest(whichNPC, whichQuestId) {
    //  if (giveQuestRewards(whichNPC, whichQuestId)) {
    giveQuestRewards(whichNPC, whichQuestId);
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
    /* } else {
         // keep the NPC on the quest dialogue:
         whichNPC.speechIndex--;
     }
     */
    audio.playSound(soundEffects['questComplete'], 0);
    removeFromJournal(whichQuestId);

}


function giveQuestRewards(whichNPC, whichQuestId) {
    // give any reward to the player:
    if (questData[whichQuestId].itemsReceivedOnCompletion) {
        var questRewards = questData[whichQuestId].itemsReceivedOnCompletion;
     
        awardQuestRewards(whichNPC, questRewards, false);
    }
    /*else {
        return true;
    }
    */
}

function awardQuestRewards(whichNPC, questRewards, isACollectionQuest) {
    var allRewardItems = [];
    for (var i = 0; i < questRewards.length; i++) {
        var questRewardToUse = questRewards[i];
        var thisRewardObject = questRewardToUse;
        if (questRewardToUse.type != "follower") {
            thisRewardObject = prepareInventoryObject(questRewardToUse);
            var rewardTypePossibilities = questRewardToUse.type.toString().split("/");
            thisRewardObject.type = parseInt(getRandomElementFromArray(rewardTypePossibilities));
        }
        // check for variation:
        if (!(isNaN(thisRewardObject.type))) {
            // might need to show the name of the item in the speech:           
            thisSpeech = thisSpeech.replace(/##itemName##/i, currentActiveInventoryItems[parseInt(thisRewardObject.type)].shortname);
        }
        allRewardItems.push(thisRewardObject);
    }

    /*
    [{"type":"19/5","quantity":6},{"type":"follower"},{"type":"34","contains":5}]
    */
    //console.log(allRewardItems);

    inventoryCheck = canAddItemToInventory(allRewardItems);

    if (inventoryCheck[0]) {
        UI.showChangeInInventory(inventoryCheck[1]);
    } else {
        // send the item(s) by post:
        var questSpeech = whichNPC.speech[whichNPC.speechIndex][0].split("|");
        if (isACollectionQuest) {
            // use zone name (replace hyphens with spaces)
            var subjectLine = whichNPC.speech[whichNPC.speechIndex][2].replace(/-/g, " ") + " collection";
        } else {
            var whichQuest = whichNPC.speech[whichNPC.speechIndex][2];
            var subjectLine = questData[whichQuest].journalTitle;
        }
        var message = questSpeech[2];
        // add in the name of the item if required:
        message = message.replace(/##itemName##/i, currentActiveInventoryItems[parseInt(allRewardItems[0].type)].shortname);
        sendNPCPost('{"subject":"' + subjectLine + '","message":"' + message + '","senderID":"-1","recipientID":"' + characterId + '","fromName":"' + whichNPC.name + '"}', allRewardItems);
        UI.showNotification("<p>My reward will be sent in the post</p>");
    }
}