allCardPacks = [
    [1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3],
    [1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3]
];


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
