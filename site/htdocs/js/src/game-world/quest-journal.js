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
    console.log("remove"+whichQuestId);
    var elementToRemove = document.getElementById("quest" + whichQuestId);
    elementToRemove.remove();
}