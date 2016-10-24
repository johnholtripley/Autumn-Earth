allCardPacks = [
    [1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3],
    [1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3]
];


function cardGamePlayer2Wins() {

    console.log("hero: " + hero.cards.join(","));
    console.log("npc: " + thisNPC.uniqueCards.join(","));

    // player won
    processSpeech(thisNPC, thisNPC.cardGameSpeech.lose[0], thisNPC.cardGameSpeech.lose[1]);
    whichCardWon = pickBestCardToTake(cardGameNameSpace.player1Cards);
    hero.cards.unshift((cardGameNameSpace.player1Cards[whichCardWon]));
    // need to find this card type in the NPC's unique card array (if it's from the basic deck then don't need to try and remove it):
    var foundIndexInUniqueCards = thisNPC.uniqueCards.indexOf(cardGameNameSpace.player1Cards[whichCardWon]);
    if (foundIndexInUniqueCards != -1) {
        thisNPC.uniqueCards.splice(foundIndexInUniqueCards, 1);
    }
    UI.showNotification('<p>You won a ' + cardGameNameSpace.allCardData[(cardGameNameSpace.player1Cards[whichCardWon])][2] + '</p><img class="card players" src="/images/card-game/cards/' + (cardGameNameSpace.player1Cards[whichCardWon]) + '.png">');

    console.log("hero: " + hero.cards.join(","));
    console.log("npc: " + thisNPC.uniqueCards.join(","));


    closeCardGame();



}

function cardGamePlayer1Wins() {
    // player lost
    processSpeech(thisNPC, thisNPC.cardGameSpeech.win[0], thisNPC.cardGameSpeech.win[1]);
    whichCardWon = pickBestCardToTake(cardGameNameSpace.player2Cards);
    thisNPC.uniqueCards.unshift((cardGameNameSpace.player2Cards[whichCardWon]));
    var foundIndexInUniqueCards = hero.cards.indexOf(cardGameNameSpace.player2Cards[whichCardWon]);
    if (foundIndexInUniqueCards != -1) {
        hero.cards.splice(foundIndexInUniqueCards, 1);
    }
    UI.showNotification('<p>You lost a ' + cardGameNameSpace.allCardData[(cardGameNameSpace.player2Cards[whichCardWon])][2] + '</p><img class="card npcs" src="/images/card-game/cards/' + (cardGameNameSpace.player2Cards[whichCardWon]) + '.png">');
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
    var whichIndex = 0;
    var thisCardsScore;
    for (var i = 0; i < whichDeck.length; i++) {
        // square the results so that a 10/1 card is favoured to a 5/6 card:
        thisCardsScore = cardGameNameSpace.allCardData[whichDeck[i]][0] * cardGameNameSpace.allCardData[whichDeck[i]][0] + cardGameNameSpace.allCardData[whichDeck[i]][1] * cardGameNameSpace.allCardData[whichDeck[i]][1];
        if (thisCardsScore > highestScoreSoFar) {
            highestScoreSoFar = thisCardsScore;
            whichIndex = i;
        }
    }
    return whichIndex;
}
