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




function retinueMissionCompleted(questId) {
    getJSON("/game-world/getRetinueRewards.php?id=" + questId + "&chr=" + characterId, function(data) {
        if (data.item != "null") {
            // try and add to inventory:
            inventoryCheck = canAddItemToInventory(data.item);
            if (inventoryCheck[0]) {
                UI.showChangeInInventory(inventoryCheck[1]);
            } else {
                // post it 
      

       
            var subjectLine = 'Reward for '+document.getElementById('retinueComplete'+questId).getAttribute('data-questname');
        var message = "Your followers continue to make you proud...";
var whichNPC = "Retinue co-ordinator";


        sendNPCPost('{"subject":"' + subjectLine + '","message":"' + message + '","senderID":"-1","recipientID":"' + characterId + '","fromName":"' + whichNPC + '"}', data.item);
        UI.showNotification("<p>Reward send by post to you</p>");
            }
        } else {
            // no reward
        }
        hero.stats.retinueMissionsCompleted++;


var allFollowersOnThisQuest = data.followerIds.split(",");
var newLocationX = (data.endLocationX/700)*100;
var newLocationY = (data.endLocationY/450)*100;
var thisFollower;
for (var i=0;i< allFollowersOnThisQuest.length;i++) {
    // set follower to be available again:
    thisFollower = document.getElementById('retinueFollower'+allFollowersOnThisQuest[i]);
    thisFollower.classList.add("available");
    // move follower to completed location:
    document.getElementById('followerLocation'+allFollowersOnThisQuest[i]).style.cssText = "left: "+newLocationX+"%; top: "+newLocationY+"%;";
    thisFollower.setAttribute('data-locationx',newLocationX);
    thisFollower.setAttribute('data-locationy',newLocationY);
    document.querySelector('#retinueFollower' + allFollowersOnThisQuest[i] + ' p').innerHTML='waiting for a quest';
}

        document.getElementById('retinueComplete' + questId).classList.remove('active');
// update database that these followers are available and with the new location:
sendDataWithoutNeedingAResponse("/game-world/gotRetinueRewards.php?id=" + questId+"&newLocationX="+data.endLocationX+"&newLocationY="+data.endLocationY);

    
        
    }, function(status) {
        // error - try again:
        retinueMissionCompleted(questId);
    });
}