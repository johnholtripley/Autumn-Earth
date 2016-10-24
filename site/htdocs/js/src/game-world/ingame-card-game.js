allCardPacks = [
    [1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3],
    [1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3]
];


function cardGamePlayer2Wins() {
processSpeech(thisNPC, thisNPC.cardGameSpeech.lose[0], thisNPC.cardGameSpeech.lose[1]);
closeCardGame();
}

function cardGamePlayer1Wins() {
   processSpeech(thisNPC, thisNPC.cardGameSpeech.win[0], thisNPC.cardGameSpeech.win[1]); 
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
    // remove click events etc.
}