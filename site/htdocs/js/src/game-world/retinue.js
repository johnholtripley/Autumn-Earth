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