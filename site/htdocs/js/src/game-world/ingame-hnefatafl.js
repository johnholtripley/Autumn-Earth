

function hnefataflPlayer2Concedes() {
  
delete thisChallengeNPC.isPlayingCards;

 processSpeech(thisChallengeNPC, thisChallengeNPC.cardGameSpeech.win[0], thisChallengeNPC.cardGameSpeech.win[1]);
    closeHnefataflGame();
}

function hnefataflPlayer2Wins() {
    // player won
    hero.stats.cardGamesWon++;
    hero.currency.cardDust += 7;
    UI.updateCurrencies();UI.updateCardAlbum();

    delete thisChallengeNPC.isPlayingCards;
    processPlayerWinSpeech(thisChallengeNPC, thisChallengeNPC.cardGameSpeech.lose[0], thisChallengeNPC.cardGameSpeech.lose[1]);
    closeHnefataflGame();
}

function hnefataflPlayer1Wins() {
    // player lost
    hero.stats.cardGamesLost++;
    hero.currency.cardDust += 1;
    UI.updateCurrencies();UI.updateCardAlbum();
     delete thisChallengeNPC.isPlayingCards;
    processSpeech(thisChallengeNPC, thisChallengeNPC.cardGameSpeech.win[0], thisChallengeNPC.cardGameSpeech.win[1]);
    closeHnefataflGame();
}

function hnefataflIsDrawn() {
     console.log(thisChallengeNPC);
    hero.stats.cardGamesDrawn++;
    hero.currency.cardDust += 3;
    UI.updateCurrencies();UI.updateCardAlbum();
     delete thisChallengeNPC.isPlayingCards;
    processSpeech(thisChallengeNPC, thisChallengeNPC.cardGameSpeech.draw[0], thisChallengeNPC.cardGameSpeech.draw[1]);
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
                UI.showDialogue(thisChallengeNPC, thisChallengeNPC.cardGameSpeech.lose[0] + questSpeech[2]);
                canCloseDialogueBalloonNextClick = true;
                checkForTitlesAwarded(questId);
            }
        } else {
            // there was a quest, but it's been completed - just show ordinary text:
            processSpeech(thisChallengeNPC, thisChallengeNPC.cardGameSpeech.lose[0], thisChallengeNPC.cardGameSpeech.lose[1]);
        }
    } else {
        // no quest associated, just show ordinary text:
        processSpeech(thisChallengeNPC, thisChallengeNPC.cardGameSpeech.lose[0], thisChallengeNPC.cardGameSpeech.lose[1]);
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

