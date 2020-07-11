function getRetinueQuestTime(followerX, followerY, destinationX, destinationY, hasToReturnToBase) {
    var thisTimerText;
    var thisTimeRequired = getPythagorasDistance(followerX, followerY, destinationX, destinationY);
    if (hasToReturnToBase == 1) {
        // (true)
        thisTimeRequired += getPythagorasDistance(retinueBaseLocationX, retinueBaseLocationY, destinationX, destinationY);
    }

    var seconds = Math.floor((thisTimeRequired * 60) % 60);
    var minutes = Math.floor(thisTimeRequired % 60);
    var hours = Math.floor((thisTimeRequired / 60) % 24);
    var days = Math.floor(thisTimeRequired / (24 * 60));

    if (days > 1) {
        thisTimerText = days + " days";
    } else if (days == 1) {
        thisTimerText = "1 day";
    } else if (hours > 1) {
        thisTimerText = hours + " hours";
    } else if (hours == 1) {
        thisTimerText = "1 hour";
    } else if (minutes > 1) {
        thisTimerText = minutes + " minutes";
    } else if (minutes == 1) {
        thisTimerText = "1 minute";
    } else {
        thisTimerText = seconds + " seconds";
    }

    return ([thisTimeRequired, thisTimerText]);
}


function retinueMissionCompleted(questId, isExplorationQuest) {
    getJSON("/game-world/getRetinueRewards.php?id=" + questId + "&chr=" + characterId, function(data) {
        if (data.item != "null") {
            // try and add to inventory:
            inventoryCheck = canAddItemToInventory(data.item);
            if (inventoryCheck[0]) {
                UI.showChangeInInventory(inventoryCheck[1]);
            } else {
                // post it 
                var subjectLine = 'Reward for ' + document.getElementById('retinueComplete' + questId).getAttribute('data-questname');
                var message = "Your followers continue to make you proud...";
                var whichNPC = "Retinue co-ordinator";
                sendNPCPost('{"subject":"' + subjectLine + '","message":"' + message + '","senderID":"-1","recipientID":"' + characterId + '","fromName":"' + whichNPC + '"}', data.item);
                UI.showNotification("<p>My reward will be sent in the post</p>");
            }
        } else {
            // no reward
        }
        if (!isExplorationQuest) {
            hero.stats.retinueMissionsCompleted++;
        } else {
            hero.stats.retinueExplorationMissionsCompleted++;
            var thisHex = document.getElementById('undiscovered_' + data.explored);


            var thisHexCoords = data.explored.split("_");



            // save this hex as being explored:
            hero.retinueMapAreasRevealed.push(thisHexCoords[0] + "," + thisHexCoords[1]);

            // needs pushing to database:
            saveGame();

            // make neighbouring hexes explorable:
            var thisNeighbouringHex;
            for (var i = -1; i <= 1; i++) {
                for (var j = -1; j <= 1; j++) {
                    thisNeighbouringHex = document.getElementById('undiscovered_' + (parseInt(thisHexCoords[0]) + i) + "_" + (parseInt(thisHexCoords[1]) + j));
                    if (thisNeighbouringHex) {
                        thisNeighbouringHex.classList.add("explorable");
                    }
                }
            }

            // create quest in that hex and plot it:
            getJSON("/game-world/generateRetinueQuest.php?forceHex=" + thisHexCoords[0] + '_' + thisHexCoords[1] + "&isAjaxRequest=true", function(data) {
                retinueAvailableQuestMap.insertAdjacentHTML('beforeend', data.mapPin);
                retinueDetailWrapper.insertAdjacentHTML('beforeend', data.panelMarkup);
            }, function(status) {
                // error ###
            });

            thisHex.classList.remove('explorable');
            // fade hex out:
            thisHex.classList.add('explored');
        }

        // release followers from this quest:
        var allFollowersOnThisQuest = data.followerIds.split(",");
        var newLocationX = (data.endLocationX / 700) * 100;
        var newLocationY = (data.endLocationY / 450) * 100;
        var thisFollower;
        for (var i = 0; i < allFollowersOnThisQuest.length; i++) {
            // set follower to be available again:
            thisFollower = document.getElementById('retinueFollower' + allFollowersOnThisQuest[i]);
            thisFollower.classList.add("available");
            // move follower to completed location:
            document.getElementById('followerLocation' + allFollowersOnThisQuest[i]).style.cssText = "left: " + newLocationX + "%; top: " + newLocationY + "%;";
            document.getElementById('followerLocationTooltip' + allFollowersOnThisQuest[i]).style.cssText = "left: " + newLocationX + "%; top: " + newLocationY + "%;";
            thisFollower.setAttribute('data-locationx', data.endLocationX);
            thisFollower.setAttribute('data-locationy', data.endLocationY);
            thisFollower.removeAttribute('data-activeonquest');
            document.querySelector('#retinueFollower' + allFollowersOnThisQuest[i] + ' p').innerHTML = 'waiting for a quest';

            if (thisFollower.classList.contains('hired')) {
                // offer the option to rehire, or remove this follower:
                document.getElementById('retinueFollowerRehire' + allFollowersOnThisQuest[i]).classList.add('active');
            }
        }
        document.getElementById('retinueComplete' + questId).classList.remove('active');
        // update database that these followers are available and with the new location:
        sendDataWithoutNeedingAResponse("/game-world/gotRetinueRewards.php?id=" + questId + "&newLocationX=" + data.endLocationX + "&newLocationY=" + data.endLocationY);
    }, function(status) {
        // error - try again:
        retinueMissionCompleted(questId);
    });
}

function hireNewFollower() {
    if (hero.currency.money >= costToRehireFollower) {
        hero.currency.money -= costToRehireFollower;
        UI.updateCurrencies();
        audio.playSound(soundEffects['coins'], 0);
        var whichNPCIndex = hireRetinueFollowerPanel.getAttribute('data-NPC');
        // find the relevant NPC:
        var thisNPC;
        var thisFollowerNPC = null;
        for (var m = 0; m < visibleMaps.length; m++) {
            for (var i = 0; i < thisMapData[(visibleMaps[m])].npcs.length; i++) {
                thisNPC = thisMapData[(visibleMaps[m])].npcs[i];
                if (thisNPC.uniqueIndex == whichNPCIndex) {
                    thisFollowerNPC = thisNPC;
                }
            }
        }
        if (thisFollowerNPC !== null) {
            // remove the hiring speech:
            thisFollowerNPC.speech.splice(thisFollowerNPC.speechIndex, 1);
            // update database:
            sendDataWithoutNeedingAResponse("/game-world/activateRetinueFollower.php?followerID=" + thisFollowerNPC.followerId);
            // show in retinue panel:
            var followerMarkupToAdd = '<li id="retinueFollower' + thisFollowerNPC.followerId + '" class="available hired" data-locationx="200" data-locationy="350" data-activeonquest="-1"><div class="portrait"><img src="/images/retinue/' + thisFollowerNPC.followerId + '.png" alt=""></div><h3>' + thisFollowerNPC.name + ' (hired)</h3><p>waiting for a quest</p></li>';
            retinueList.insertAdjacentHTML('beforeend', followerMarkupToAdd);
        }
    } else {
        UI.showNotification('<p>I haven\'t got enough money</p>');
    }
    UI.closeHireFollowerPanel();
}