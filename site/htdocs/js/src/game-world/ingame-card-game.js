allCardPacks = [
    [1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3],
    [1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3]
];


function cardGamePlayer2Wins() {
    processSpeech(thisNPC, thisNPC.cardGameSpeech.lose[0], thisNPC.cardGameSpeech.lose[1]);
    whichCardWon = pickBestCardToTake(cardGameNameSpace.player1Cards);
    console.log("You won a " + cardGameNameSpace.allCardData[(cardGameNameSpace.player1Cards[whichCardWon])][2]);
    closeCardGame();

}

function cardGamePlayer1Wins() {
    processSpeech(thisNPC, thisNPC.cardGameSpeech.win[0], thisNPC.cardGameSpeech.win[1]);
    whichCardWon = pickBestCardToTake(cardGameNameSpace.player2Cards);
    console.log(whichCardWon);
    console.log(cardGameNameSpace.player2Cards.join(","));
    console.log(cardGameNameSpace.player2Cards[whichCardWon]);
    console.log("You lost a " + cardGameNameSpace.allCardData[(cardGameNameSpace.player2Cards[whichCardWon])][2]);
    closeCardGame();
}


function cardGameIsDrawn() {
    processSpeech(thisNPC, thisNPC.cardGameSpeech.draw[0], thisNPC.cardGameSpeech.draw[1]);
    closeCardGame();
}


function startCardGame(opponentNPC) {
    cardGameNameSpace.allCardData = [
        [null, null, null],
        ["5", "10", "Bomb"],
        ["5", "17", "Chocobo"],
        ["15", "10", "Mog"]
    ];
    cardGameNameSpace.player2Cards = hero.cards.slice(0, 12);
    // combine the NPC's unique cards with their base pack and pick the first 12:
    cardGameNameSpace.player1Cards = opponentNPC.uniqueCards.concat(allCardPacks[opponentNPC.baseCardPack]).slice(0, 12);
    cardGameNameSpace.player1Skill = opponentNPC.cardSkill;
    cardGameNameSpace.initialiseCardGame();
    cardGameWrapper.classList.add("active");



}

function closeCardGame() {
    gameMode = "play";
    cardGameWrapper.classList.remove("active");
    document.getElementById("cardGame").removeEventListener("click", cardGameNameSpace.canvasClick, false);
}

function pickBestCardToTake(whichDeck) {
    // find the best opponent's card and give it to the winner
    var highestScoreSoFar = -1;
    var whichIndex = -1;
    var thisCardsScore;
    for (var i = 0; i < whichDeck.length; i++) {
        // square the results so that a 10/1 card is favoured to a 5/6 card:
        thisCardsScore = cardGameNameSpace.allCardData[whichDeck[i]][0] * cardGameNameSpace.allCardData[whichDeck[i]][0] + cardGameNameSpace.allCardData[whichDeck[i]][1] * cardGameNameSpace.allCardData[whichDeck[i]][1];
        if (thisCardsScore > highestScoreSoFar) {
            highestScoreSoFar = thisCardsScore;
            whichIndex = i;
        }
    }
    return i;
}
