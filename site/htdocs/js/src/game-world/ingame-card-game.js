allCardPacks = [
    [1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3],
    [1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3]
];

//tempCardData = '{[[null, null, null],["5", "10", "Bomb"],["5", "10", "Chocobo"],["5", "10", "Mog"],["5", "10", "Cactuar"],["5", "10", "Shiva"],["5", "10", "Tonberry"],["5", "10", "Slime"]]}';
  //  cardGameNameSpace.allCardData = tempCardData;

function cardGamePlayer2Wins() {
    // player won
   
    hero.stats.cardGamesWon++;
    
    processSpeech(thisNPC, thisNPC.cardGameSpeech.lose[0], thisNPC.cardGameSpeech.lose[1]);
    whichCardWon = pickBestCardToTake(cardGameNameSpace.player1Cards);
    hero.cards.unshift((cardGameNameSpace.player1Cards[whichCardWon]));
    // need to find this card type in the NPC's unique card array (if it's from the basic deck then don't need to try and remove it):
    var foundIndexInUniqueCards = thisNPC.uniqueCards.indexOf(cardGameNameSpace.player1Cards[whichCardWon]);
    if (foundIndexInUniqueCards != -1) {
        thisNPC.uniqueCards.splice(foundIndexInUniqueCards, 1);
    }
    UI.showNotification('<p>You won a ' + cardGameNameSpace.allCardData[(cardGameNameSpace.player1Cards[whichCardWon])][2] + '</p><img class="card players" src="/images/card-game/cards/' + (cardGameNameSpace.player1Cards[whichCardWon]) + '.png">');
    UI.updateCardAlbum();
    closeCardGame();
}

function cardGamePlayer1Wins() {
    // player lost
    
    hero.stats.cardGamesLost++;
    
    processSpeech(thisNPC, thisNPC.cardGameSpeech.win[0], thisNPC.cardGameSpeech.win[1]);
    whichCardWon = pickBestCardToTake(cardGameNameSpace.player2Cards);
    // add it to NPC's unique cards so the player can win it back:
    thisNPC.uniqueCards.unshift((cardGameNameSpace.player2Cards[whichCardWon]));
    var foundIndexInUniqueCards = hero.cards.indexOf(cardGameNameSpace.player2Cards[whichCardWon]);
    if (foundIndexInUniqueCards != -1) {
        hero.cards.splice(foundIndexInUniqueCards, 1);
    }
    UI.showNotification('<p>You lost a ' + cardGameNameSpace.allCardData[(cardGameNameSpace.player2Cards[whichCardWon])][2] + '</p><img class="card npcs" src="/images/card-game/cards/' + (cardGameNameSpace.player2Cards[whichCardWon]) + '.png">');
    UI.updateCardAlbum();
    closeCardGame();
}

function cardGameIsDrawn() {
    processSpeech(thisNPC, thisNPC.cardGameSpeech.draw[0], thisNPC.cardGameSpeech.draw[1]);
    closeCardGame();
}

function startCardGame(opponentNPC) {
    if (hero.cards.length >= 12) {



        cardGameNameSpace.player2Cards = hero.cards.slice(0, 12);
        // combine the NPC's unique cards with their base pack and pick the first 12:
        cardGameNameSpace.player1Cards = opponentNPC.uniqueCards.concat(allCardPacks[opponentNPC.baseCardPack]).slice(0, 12);
        cardGameNameSpace.player1Skill = opponentNPC.cardSkill;




        cardGameNameSpace.initialiseCardGame();
        cardGameWrapper.classList.add("active");
    } else {
        UI.showNotification('<p>You don\'t have enough cards</p>');
    }
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

function openBoosterPack() {
    // pick 5 random, but different, cards:
    boosterCardsToAdd = [];
    var thisCardToAdd;
    do {
        thisCardToAdd = getRandomInteger(1, cardGameNameSpace.allCardData.length);
        if (boosterCardsToAdd.indexOf(thisCardToAdd) == -1) {
            boosterCardsToAdd.push(thisCardToAdd);

        }

    } while (boosterCardsToAdd.length < 5);


 var boosterPackCards = document.getElementsByClassName('cardFlip');
    for (var i = 0; i < boosterPackCards.length; i++) {
        boosterPackCards[i].classList.remove('active');
    }

    
    // wait for these to load? #######





    for (var i = 0; i < 5; i++) {
        document.getElementById("boosterCard" + i).innerHTML = '<img src="/images/card-game/cards/' + boosterCardsToAdd[i] + '.png" alt="' + cardGameNameSpace.allCardData[(boosterCardsToAdd[i][3])] + '">';
    }

    boosterPack.classList.add('active');
    boosterCardsRevealed = 0;
    boosterPack.addEventListener("click", revealBoosterCard, false);

}

function revealBoosterCard(e) {

    if (e.target.nodeName == "IMG") {
        e.target.parentNode.parentNode.parentNode.classList.add('active');
        boosterCardsRevealed++;
        if (boosterCardsRevealed >= 5) {
            hero.cards = boosterCardsToAdd.concat(hero.cards);
            UI.updateCardAlbum();
            boosterPack.classList.remove('active');

        }
    }
}
