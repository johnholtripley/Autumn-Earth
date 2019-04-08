function hnefataflPlayer2Concedes() {
    delete thisChallengeNPC.isPlayingCards;
    processSpeech(thisChallengeNPC, thisChallengeNPC.HnefataflSpeech.win[0], thisChallengeNPC.HnefataflSpeech.win[1]);
    closeHnefataflGame();
}

function hnefataflPlayer2Wins() {
    // player won
    hero.stats.hnefataflGamesWon++;
    hero.stats.hnefataflGamesPlayed++;


    delete thisChallengeNPC.isPlayingCards;
    processPlayerWinSpeech(thisChallengeNPC, thisChallengeNPC.HnefataflSpeech.lose[0], thisChallengeNPC.HnefataflSpeech.lose[1]);
    closeHnefataflGame();
}

function hnefataflPlayer1Wins() {
    // player lost
    hero.stats.hnefataflGamesLost++;
    hero.stats.hnefataflGamesPlayed++;

    delete thisChallengeNPC.isPlayingCards;
    processSpeech(thisChallengeNPC, thisChallengeNPC.HnefataflSpeech.win[0], thisChallengeNPC.HnefataflSpeech.win[1]);
    closeHnefataflGame();
}

function hnefataflIsDrawn() {

    hero.stats.hnefataflGamesDrawn++;
    hero.stats.hnefataflGamesPlayed++;


    delete thisChallengeNPC.isPlayingCards;
    processSpeech(thisChallengeNPC, thisChallengeNPC.HnefataflSpeech.draw[0], thisChallengeNPC.HnefataflSpeech.draw[1]);
    closeHnefataflGame();
}

function processPlayerWinSpeech(thisChallengeNPC, thisSpeechPassedIn, thisSpeechCode) {
    if (thisSpeechCode != "") {
        var questSpeech = thisSpeechCode.split("|");
        var questId = questSpeech[1];
        if (questData[questId].hasBeenCompleted < 1) {
            if (giveQuestRewards(questId)) {
                if (questData[questId].isRepeatable > 0) {
                    questData[questId].hasBeenCompleted = 0;
                } else {
                    questData[questId].hasBeenCompleted = 1;
                }
                UI.showDialogue(thisChallengeNPC, thisChallengeNPC.HnefataflSpeech.lose[0] + questSpeech[2]);
                canCloseDialogueBalloonNextClick = true;
                checkForTitlesAwarded(questId);
            }
        } else {
            // there was a quest, but it's been completed - just show ordinary text:
            processSpeech(thisChallengeNPC, thisChallengeNPC.HnefataflSpeech.lose[0], thisChallengeNPC.HnefataflSpeech.lose[1]);
        }
    } else {
        // no quest associated, just show ordinary text:
        processSpeech(thisChallengeNPC, thisChallengeNPC.HnefataflSpeech.lose[0], thisChallengeNPC.HnefataflSpeech.lose[1]);
    }
}




function startHnefataflGame(opponentNPC) {
    console.log(opponentNPC.name);


    hnefataflNameSpace.initialisehnefataflGame();
    hnefataflGameWrapper.classList.add("active");
    opponentNPC.isPlayingCards = true;
    //   audio.playMusic('card-game-NOT_MINE-Shuffle-or-Boogie');

}



function closeHnefataflGame() {
    gameMode = "play";
    //   audio.fadeOutMusic('card-game-NOT_MINE-Shuffle-or-Boogie');
    hnefataflGameWrapper.classList.remove("active");
    document.getElementById("cardGame").removeEventListener("click", hnefataflNameSpace.canvasClick, false);
}