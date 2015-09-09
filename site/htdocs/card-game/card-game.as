//
// TO DO:
//



// make AI favour edge positions as these are easier to defend (confirm that these are more tactically beneficially first though)
//
// test opponent skill 
//
// add to core - possibly with this AS as an include file so it can be shared with standalone card game on the website
//
// pick a random player to start - show visually like final fantasy?
//
// could player crafters create cards? (eg, have a card template and the feather of a hippogriff to make a hippogriff card?) how would the cards vary, or would it just be success or fail?
//
//if player has 12 cards then bypass card selection process - though need to pick which 2 cards to start with
//
//have check in core to see if player has at least 12 cards before start game
//
//if npc speech needs to be at end of npc array list, then make th start index of that a variable so can keep adding new attributes easil need 3 for cards:
//standard deck
//unique cards (join)
//skill level
//
// check that computer opponent does take higher value cards when it wins
//
// add an animation of board opening and one of board closing
//
// confirm that ai selecting 2 highest defence score cards at start is the better strategy
//
// player card selection needs buttons toorder by attack, defense, combined
//
// player card selection - which could be the same as buying/selling cards from an NPC card vendor
//
//be nice to have a card album to view art, but a pain to select from (if on multiple pages), so might need a more FFIX-like icon selection for the cards
//
//as need to select 12 cards each game, might be good to have a "make this my default deck" option. would need to check that none of these cards were lost in a previous game, but would save plaer some time
//
// the player could upload custom game mats. provide a psd and jpg template. need a mechanism for them to select which to use
//
// IF DOING RECURSION TO END GAME:
// if doing more than 1 loop look ahead then the copied board needs to be the last parent board and not a copy of tempboard
// and if doing more than 1 look ahead, does it take into account which cards have been temporarily placed for the current board state?
//
// do a test to see if var'd variables are unique on subsequent recursive function calls
//
// do a test where the board is setup where my first move allows the computer's next move to flip lots, but then
// my move after that flips much more and see what it does
//

import flash.filters.BlurFilter;

function cardGameInit() {
	boardObject = new Object();
	cardSelected._visible = false;
	cardPickerHolder.popUp._visible = false;
	cardPickerHolder._visible = false;
	cardTooltip._visible = false;
	boardObject.okToPlay = false;
	startCardGameButton.gotoAndStop(1);
	boardObject.whosMove = 1;
	//
	boardObject.computerOpponent = true;
	boardObject.opponentSkillRank = 1;
	thisNPCsDeck = 1;
	thisNPCsUniqueCards = [4, 3, 4];
	thisNPCsUniqueCards = [3, 3, 3];
	//
	boardObject.cardSelected = -1;
	boardObject.cardsPlaced = 0;
	whosMoveIndicator._x = 350;
	// cardsAvailable = [attack Score, defense Score, card's name]
	boardObject.cardsAvailable = ["", [5, 10, "goat"], [5, 10, "piranha"], [5, 10, "grendel"], [5, 10, "fish"]];
	// human players cards will store the quantity of cards for each type:
	boardObject.player1AllCardsInDeck = ["", 12, 1, 4, 9, 1, 2, 3, 1, 2, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 1, 1, 4, 3];
	standardDecksAvailable = [[1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 3, 3, 3], [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3], [2, 2, 2, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4]];
	if (boardObject.computerOpponent) {
		// build the AI player's deck
		boardObject.player2AllCardsInDeck = standardDecksAvailable[thisNPCsDeck].concat(thisNPCsUniqueCards);
	}
}
//
function playerChooseCards(whichPlayer) {
	if (whichPlayer == 2) {
		if (boardObject.computerOpponent) {
			// AI choose cards - loop through all cards in NPC's deck and score according to attack strength and defense combined:
			var highestScoringCardsFromDeck = [];
			var allCardsSortedByScore = [[-99999999]];
			for (var i = 0; i<boardObject.player2AllCardsInDeck.length; i++) {
				// square the attack ad defense score before summing hem so that a 10+1 is higher than a 5+6
				var thisCardsCombinedScore = (boardObject.cardsAvailable[[(boardObject.player2AllCardsInDeck[i])][0]][0])*(boardObject.cardsAvailable[[(boardObject.player2AllCardsInDeck[i])][0]][0])+(boardObject.cardsAvailable[[(boardObject.player2AllCardsInDeck[i])][0]][1])*(boardObject.cardsAvailable[[(boardObject.player2AllCardsInDeck[i])][0]][1]);
				for (q=0; q<allCardsSortedByScore.length; q++) {
					if (thisCardsCombinedScore>allCardsSortedByScore[q][0]) {
						allCardsSortedByScore.splice(q, 0, [thisCardsCombinedScore, [(boardObject.player2AllCardsInDeck[i])]]);
						break;
					} else if (thisCardsCombinedScore == allCardsSortedByScore[q][0]) {
						allCardsSortedByScore[q][1].push((boardObject.player2AllCardsInDeck[i]));
						break;
					}
				}
				if (thisCardsCombinedScore<allCardsSortedByScore[(allCardsSortedByScore.length-1)][0]) {
					allCardsSortedByScore.push([thisCardsCombinedScore, [(boardObject.player2AllCardsInDeck[i])]]);
				}
			}
			// remove the -99999999:
			if (allCardsSortedByScore[(allCardsSortedByScore.length-1)][0] == -99999999) {
				allCardsSortedByScore.pop();
			}
			// pick the 12 highest ranking cards:                                                            
			var currentScoreIndex = 0;
			// build a array of the cards, with highest scoring cards first:
			var randomlySortedWithinScoresCards = "";
			for (var i = 0; i<allCardsSortedByScore.length; i++) {
				// randomly sort the cards within this score:
				thisScoresRandomCards = allCardsSortedByScore[i][1].sort(shuffle);
				if (i>0) {
					randomlySortedWithinScoresCards += ",";
				}
				randomlySortedWithinScoresCards += thisScoresRandomCards.join(",");
			}
			// get first 12 cards:
			randomlySortedWithinScoresCardsArray = randomlySortedWithinScoresCards.split(",");
			boardObject.player2Cards = randomlySortedWithinScoresCardsArray.slice(0, 12);
			// randomly sort these cards:
			boardObject.player2Cards.sort(shuffle);
			// find the two highest defensive cards and bring these to the front of the array so they are placed first:
			var highestDefenceFound = -1;
			var highestDefenceCardRef = -1;
			for (var i = 0; i<12; i++) {
				if (boardObject.cardsAvailable[(boardObject.player2Cards[i])][1]>highestDefenceFound) {
					highestDefenceFound = boardObject.cardsAvailable[(boardObject.player2Cards[i])][1];
					highestDefenceCardPos = i;
					highestDefenceCardRef = boardObject.player2Cards[i];
				}
			}
			boardObject.player2Cards.splice(highestDefenceCardPos, 1);
			boardObject.player2Cards.unshift(highestDefenceCardRef);
			// find second highest - ignore first card as this will be the first highest defensive card:
			var highestDefenceFound = -1;
			var highestDefenceCardRef = -1;
			for (var i = 1; i<12; i++) {
				if (boardObject.cardsAvailable[(boardObject.player2Cards[i])][1]>highestDefenceFound) {
					highestDefenceFound = boardObject.cardsAvailable[(boardObject.player2Cards[i])][1];
					highestDefenceCardPos = i;
					highestDefenceCardRef = boardObject.player2Cards[i];
				}
			}
			boardObject.player2Cards.splice(highestDefenceCardPos, 1);
			boardObject.player2Cards.unshift(highestDefenceCardRef);
		}
	} else {
		humanPlayerPickCards();
	}
}
//
function humanPlayerPickCards() {
	// UI for player to pick cards:
	var currX = 0;
	var currY = 0;
	var rowIncrement = 55;
	var cardCounter = 0;
	for (var i = 1; i<boardObject.player1AllCardsInDeck.length; i++) {
		// 410 = width of mask - card width:
		if (currX>410) {
			currX = 0;
			currY += rowIncrement;
		}
		for (var j = 0; j<boardObject.player1AllCardsInDeck[i]; j++) {
			cardSelectionHolder.scrollListing.listAttach.cardHolder.attachMovie("smallCards", "smallCard"+cardCounter, cardCounter);
			cardSelectionHolder.scrollListing.listAttach.cardHolder["smallCard"+cardCounter]._x = currX;
			cardSelectionHolder.scrollListing.listAttach.cardHolder["smallCard"+cardCounter]._y = currY;
			cardSelectionHolder.scrollListing.listAttach.cardHolder["smallCard"+cardCounter].origX = currX;
			cardSelectionHolder.scrollListing.listAttach.cardHolder["smallCard"+cardCounter].origY = currY;
			cardSelectionHolder.scrollListing.listAttach.cardHolder["smallCard"+cardCounter].gotoAndStop(i);
			cardSelectionHolder.scrollListing.listAttach.cardHolder["smallCard"+cardCounter].cardBG.gotoAndStop(1);
			cardSelectionHolder.scrollListing.listAttach.cardHolder["smallCard"+cardCounter].cardRef = i;
			cardSelectionHolder.scrollListing.listAttach.cardHolder["smallCard"+cardCounter].destX = 0;
			cardSelectionHolder.scrollListing.listAttach.cardHolder["smallCard"+cardCounter].destY = 0;
			cardSelectionHolder.scrollListing.listAttach.cardHolder["smallCard"+cardCounter].isMoving = 0;
			// isMoving values: 0 = not moving, 1 = selected, moving to picked list, -1 = deselected, moving back to listAttach
			cardSelectionHolder.scrollListing.listAttach.cardHolder["smallCard"+cardCounter].uniqueCardId = cardCounter;
			cardSelectionHolder.scrollListing.listAttach.cardHolder["smallCard"+cardCounter].onRollOver = showTooltip;
			cardSelectionHolder.scrollListing.listAttach.cardHolder["smallCard"+cardCounter].onRollOut = hideTooltip;
			cardSelectionHolder.scrollListing.listAttach.cardHolder["smallCard"+cardCounter].onRelease = addCardSelection;
			cardCounter++;
		}
		if (boardObject.player1AllCardsInDeck[i]>1) {
			// add quantity icon:
			cardSelectionHolder.scrollListing.listAttach.quantityHolder.attachMovie("selectionQuantity", "selectionQuantity"+i, i);
			cardSelectionHolder.scrollListing.listAttach.quantityHolder["selectionQuantity"+i].thisQuantity.text = boardObject.player1AllCardsInDeck[i];
			cardSelectionHolder.scrollListing.listAttach.quantityHolder["selectionQuantity"+i]._x = currX;
			cardSelectionHolder.scrollListing.listAttach.quantityHolder["selectionQuantity"+i]._y = currY;
			cardCounter++;
		}
		if (boardObject.player1AllCardsInDeck[i]>0) {
			currX += 45;
		}
	}
	displaySelectedList();
	scrollListHeight = currY+rowIncrement;
	minScrollItemHeight = 60;
	listSpacing = 0;
	listScrollSpeed = 15;
	listBoxHeight = 150;
	scrollTrackHeight = 100;
	boardObject.playerCurrentlyPickedCards = ["x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x"];
	displayScrollList();
	animationController.onEnterFrame = function() {
		// move tooltip:
		cardTooltip._x = _xmouse+10;
		cardTooltip._y = _ymouse;
		animationSelectionCards();
	};
}
//
function addCardSelection() {
	// see if all slots are taken or not:
	var firstFreeSlot = -1;
	for (var i = 0; i<12; i++) {
		if (boardObject.playerCurrentlyPickedCards[i] == "x") {
			firstFreeSlot = i;
			break;
		}
	}
	if (firstFreeSlot != -1) {
		cardsPickedHolder.attachMovie("smallCards", "smallCard"+this.uniqueCardId, cardsPickedHolder.getNextHighestDepth());
		var newAttachedCard = cardsPickedHolder["smallCard"+this.uniqueCardId];
		newAttachedCard.destX = cardsPickedHolder["cardSelectedPosition"+firstFreeSlot]._x;
		newAttachedCard.destY = cardsPickedHolder["cardSelectedPosition"+firstFreeSlot]._y;
		newAttachedCard.isMoving = 1;
		newAttachedCard._x = cardSelectionHolder._x-(cardsPickedHolder._x-this._x);
		newAttachedCard._y = cardSelectionHolder._y-(cardsPickedHolder._y-this._y)+cardSelectionHolder.scrollListing.listAttach._y;
		newAttachedCard.pickedSlot = firstFreeSlot;
		newAttachedCard.gotoAndStop(this.cardRef);
		newAttachedCard.cardBG.gotoAndStop(1);
		newAttachedCard.cardRef = this.cardRef;
		newAttachedCard.origX = this.origX;
		newAttachedCard.origY = this.origY;
		newAttachedCard.uniqueCardId = this.uniqueCardId;
		boardObject.playerCurrentlyPickedCards[firstFreeSlot] = this.cardRef;
		// check for multiple quantities and update quantity icon:
		var thisQuantity = parseInt(cardSelectionHolder.scrollListing.listAttach.quantityHolder["selectionQuantity"+this.cardRef].thisQuantity.text);
		cardSelectionHolder.scrollListing.listAttach.quantityHolder["selectionQuantity"+this.cardRef].thisQuantity.text = thisQuantity-1;
		if (thisQuantity == 2) {
			cardSelectionHolder.scrollListing.listAttach.quantityHolder["selectionQuantity"+this.cardRef]._visible = false;
		}
		// see if all slots are filled now:      
		firstFreeSlot = -1;
		for (var i = 0; i<12; i++) {
			if (boardObject.playerCurrentlyPickedCards[i] == "x") {
				firstFreeSlot = i;
				break;
			}
		}
		if (firstFreeSlot == -1) {
			// make play button active:
			startCardGameButton.gotoAndStop(2);
		}
		this._visible = false;
	}
}
function animationSelectionCards() {
	// loop through and check for any moving cards: 
	for (var checkClip in cardsPickedHolder) {
		var thisCheckingClip = cardsPickedHolder[checkClip];
		if (thisCheckingClip.isMoving != 0) {
			// is moving:
			thisCheckingClip._x -= (thisCheckingClip._x-thisCheckingClip.destX)/2;
			thisCheckingClip._y -= (thisCheckingClip._y-thisCheckingClip.destY)/2;
			if (Math.abs(thisCheckingClip._x-thisCheckingClip.destX)<8) {
				thisCheckingClip._x = thisCheckingClip.destX;
				thisCheckingClip._y = thisCheckingClip.destY;
				if (thisCheckingClip.isMoving == 1) {
					// card has been picked:
					thisCheckingClip.isMoving = 0;
					thisCheckingClip.onRelease = deSelectCard;
					thisCheckingClip.onRollOver = showTooltip;
					thisCheckingClip.onRollOut = hideTooltip;
				} else {
					// card has been deselected:
					cardSelectionHolder.scrollListing.listAttach.cardHolder["smallCard"+thisCheckingClip.uniqueCardId]._visible = true;
					// increase/show quantity clip:
					var thisQuantity = parseInt(cardSelectionHolder.scrollListing.listAttach.quantityHolder["selectionQuantity"+thisCheckingClip.cardRef].thisQuantity.text);
					cardSelectionHolder.scrollListing.listAttach.quantityHolder["selectionQuantity"+thisCheckingClip.cardRef].thisQuantity.text = thisQuantity+1;
					if (thisQuantity>0) {
						cardSelectionHolder.scrollListing.listAttach.quantityHolder["selectionQuantity"+thisCheckingClip.cardRef]._visible = true;
					}
					// clean up and remove animated card:   
					thisCheckingClip.isMoving = 0;
					thisCheckingClip.removeMovieClip();
				}
			}
		}
	}
}
//
function deSelectCard() {
	hideTooltip();
	boardObject.playerCurrentlyPickedCards[this.pickedSlot] = "x";
	// grey out play button as won't have the full number of cards now:
	startCardGameButton.gotoAndStop(1);
	delete this.onRelease;
	delete this.onRollOver;
	delete this.onRollOut;
	this.destX = cardSelectionHolder._x-(cardsPickedHolder._x-this.origX);
	this.destY = cardSelectionHolder._y-(cardsPickedHolder._y-this.origY)+cardSelectionHolder.scrollListing.listAttach._y;
	this.isMoving = -1;
}
//
function cancelGame() {
	cleanUpSelection();
}
//
function playerReady() {
	// bring chosen initially placed cards to the front:
	boardObject.firstPlaced = 0;
	boardObject.secondPlaced = 1;
	
	// do some validation on first and second placed to ensure that at least the slot0 and slot1 are selected if not by the player:
	
	
	if (boardObject.secondPlaced<boardObject.firstPlaced) {
		// swap so that first is lower than second
		var tempPlaced = boardObject.firstPlaced;
		boardObject.firstPlaced = boardObject.secondPlaced;
		boardObject.secondPlaced = tempPlaced;
	}
	
	
	var firstSelectedRef = boardObject.playerCurrentlyPickedCards[boardObject.firstPlaced];
	var secondSelectedRef = boardObject.playerCurrentlyPickedCards[boardObject.secondPlaced];
	boardObject.playerCurrentlyPickedCards.splice(boardObject.firstPlaced, 1);
	// secondPlaced-1 because an element before it has been removed now:
	boardObject.playerCurrentlyPickedCards.splice(boardObject.secondPlaced-1, 1);
	boardObject.player1Cards = boardObject.playerCurrentlyPickedCards.slice();
	boardObject.player1Cards.unshift(secondSelectedRef);
	boardObject.player1Cards.unshift(firstSelectedRef);
	cleanUpSelection();
	gotoAndPlay("startCardGame");
}
//
function cleanUpSelection() {
	delete animationController.onEnterFrame;
	for (var checkClip in cardSelectionHolder.scrollListing.listAttach.cardHolder) {
		cardSelectionHolder.scrollListing.listAttach.cardHolder[checkClip].removeMovieClip();
	}
	for (var checkClip in cardSelectionHolder.scrollListing.listAttach.quantityHolder) {
		cardSelectionHolder.scrollListing.listAttach.quantityHolder[checkClip].removeMovieClip();
	}
}
//
function displaySelectedList() {
	// draw the area that the cards will drop into once selected:
	var currX = 0;
	var currY = 0;
	for (var i = 0; i<12; i++) {
		cardsPickedHolder.attachMovie("cardSelectedPosition", "cardSelectedPosition"+i, i);
		cardsPickedHolder["cardSelectedPosition"+i]._x = currX;
		cardsPickedHolder["cardSelectedPosition"+i]._y = currY;
		cardsPickedHolder["cardSelectedPosition"+i].fakeRadioButton.radioId = i;
		cardsPickedHolder["cardSelectedPosition"+i].fakeRadioButton.onRelease = toggleInitialSelected;
		currX += 70;
		if (i%2 != 0) {
			currY += 55;
			currX = 0;
		}
	}
	cardsPickedHolder.cardSelectedPosition0.fakeRadioButton.gotoAndStop("radioSelected");
	cardsPickedHolder.cardSelectedPosition1.fakeRadioButton.gotoAndStop("radioSelected");
	boardObject.firstPlaced = 0;
	boardObject.secondPlaced = 1;
}
function toggleInitialSelected() {
	trace(this.radioId);
	// if both are already selected, deselect the first selected

	// set boardObject.firstPlaced
	// update graphically
}
//
function displayScrollList() {
	boardObject.currentScrollPos = 0;
	// size dragger:
	scrollTrackProportion = (listBoxHeight/scrollListHeight);
	cardSelectionHolder.scrollListing.scrollTrackAll.dragger._height = scrollTrackProportion*scrollTrackHeight;
	cardSelectionHolder.scrollListing.scrollTrackAll.dragger._y = cardSelectionHolder.scrollListing.scrollTrackAll.scrollTrackBG._y;
	if (scrollListHeight<=listBoxHeight) {
		cardSelectionHolder.scrollListing.scrollTrackAll._visible = false;
	} else {
		cardSelectionHolder.scrollListing.scrollTrackAll._visible = true;
		// set up event for mouse wheel:
		scrollMouseListener = new Object();
		scrollMouseListener.onMouseWheel = function(delta) {
			clearInterval(scrollListInterval);
			if (delta>0) {
				scrollUp(1);
			} else {
				scrollDown(1);
			}
		};
		Mouse.addListener(scrollMouseListener);
		//
		cardSelectionHolder.scrollListing.scrollTrackAll.dragger.onPress = function() {
			this.startDrag(false, cardSelectionHolder.scrollListing.scrollTrackAll.scrollTrackBG._x, cardSelectionHolder.scrollListing.scrollTrackAll.scrollTrackBG._y, cardSelectionHolder.scrollListing.scrollTrackAll.scrollTrackBG._x, (cardSelectionHolder.scrollListing.scrollTrackAll.scrollTrackBG._y+cardSelectionHolder.scrollListing.scrollTrackAll.scrollTrackBG._height)-cardSelectionHolder.scrollListing.scrollTrackAll.dragger._height);
			this.onEnterFrame = function() {
				boardObject.currentScrollPos = 0-((cardSelectionHolder.scrollListing.scrollTrackAll.dragger._y-cardSelectionHolder.scrollListing.scrollTrackAll.scrollTrackBG._y)/scrollTrackHeight*scrollListHeight);
				cardSelectionHolder.scrollListing.listAttach._y = boardObject.currentScrollPos;
			};
		};
		cardSelectionHolder.scrollListing.scrollTrackAll.dragger.onRelease = cardSelectionHolder.scrollListing.scrollTrackAll.dragger.onReleaseOutside=function () {
			this.stopDrag();
			delete this.onEnterFrame;
		};
	}
}
//
function scrollUp(speedFactor) {
	singleScrollUp(speedFactor);
	clearInterval(scrollListInterval);
}
function scrollDown(speedFactor) {
	singleScrollDown(speedFactor);
	clearInterval(scrollListInterval);
}
//
function smoothScroll(whichWay) {
	scrollListInterval = setInterval(doSmoothScroll, 50, whichWay);
}
function doSmoothScroll(whichWay) {
	if (whichWay == -1) {
		singleScrollUp(1);
	} else {
		singleScrollDown(1);
	}
}
//
function singleScrollUp(speedFactor) {
	if (boardObject.currentScrollPos<0) {
		// check if this move will scroll just too far
		proposedScrollPos = boardObject.currentScrollPos+(listScrollSpeed*speedFactor);
		if (proposedScrollPos>0) {
			proposedScrollPos = 0;
		}
		cardSelectionHolder.scrollListing.listAttach._y = proposedScrollPos;
		boardObject.currentScrollPos = cardSelectionHolder.scrollListing.listAttach._y;
		cardSelectionHolder.scrollListing.scrollTrackAll.dragger._y = cardSelectionHolder.scrollListing.scrollTrackAll.scrollTrackBG._y+((0-boardObject.currentScrollPos/scrollListHeight)*scrollTrackHeight);
	}
}
function singleScrollDown(speedFactor) {
	if (boardObject.currentScrollPos>0-(scrollListHeight-listBoxHeight)) {
		// check if this move will scroll just too far
		proposedScrollPos = boardObject.currentScrollPos-(listScrollSpeed*speedFactor);
		if (proposedScrollPos<(0-(scrollListHeight-listBoxHeight))) {
			proposedScrollPos = (0-(scrollListHeight-listBoxHeight));
		}
		cardSelectionHolder.scrollListing.listAttach._y = proposedScrollPos;
		boardObject.currentScrollPos = cardSelectionHolder.scrollListing.listAttach._y;
		cardSelectionHolder.scrollListing.scrollTrackAll.dragger._y = cardSelectionHolder.scrollListing.scrollTrackAll.scrollTrackBG._y+((0-boardObject.currentScrollPos/scrollListHeight)*scrollTrackHeight);
	}
}
//
function shuffle(a, b) {
	var shuffleNumber = Math.round(Math.random()*2)-1;
	return shuffleNumber;
}
//
function drawBoard() {
	// board [position][which card placed here, who owns that card]
	boardObject.board = [["X", "X", ["-", "-"], ["-", "-"], "X", "X"], ["X", ["-", "-"], ["-", "-"], ["-", "-"], ["-", "-"], "X"], [["-", "-"], ["-", "-"], ["-", "-"], ["-", "-"], ["-", "-"], ["-", "-"]], [["-", "-"], ["-", "-"], ["-", "-"], ["-", "-"], ["-", "-"], ["-", "-"]], ["X", ["-", "-"], ["-", "-"], ["-", "-"], ["-", "-"], "X"], ["X", "X", ["-", "-"], ["-", "-"], "X", "X"]];
	// use this to store who originally placed the card (as 'ownership' will change during the game):
	boardObject.whoOwnedCard = [["X", "X", 0, 0, "X", "X"], ["X", 0, 0, 0, 0, "X"], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], ["X", 0, 0, 0, 0, "X"], ["X", "X", 0, 0, "X", "X"]];
	// draw board:
	counter = 0;
	for (var i = 0; i<boardObject.board.length; i++) {
		for (var j = 0; j<boardObject.board[i].length; j++) {
			if (boardObject.board[i][j] != "X") {
				boardContainer.attachMovie("boardTile", "board_"+i+"_"+j, counter);
				boardContainer["board_"+i+"_"+j]._x = i*78;
				boardContainer["board_"+i+"_"+j]._y = j*105;
				boardContainer["board_"+i+"_"+j].tileRef = i+"_"+j;
				boardContainer["board_"+i+"_"+j].onRelease = boardTilePressed;
				counter++;
			}
		}
	}
	placeCards("player1");
	// place first 2 cards in their starting positions:
	placeSingleCard(2, 2, 1, boardObject.player1Cards[0], 0);
	placeSingleCard(3, 3, 1, boardObject.player1Cards[1], 1);
	placeCards("player2");
	placeSingleCard(3, 2, 2, boardObject.player2Cards[0], 0);
	placeSingleCard(2, 3, 2, boardObject.player2Cards[1], 1);
}
function placeCards(whichPlayer) {
	xPos = 0;
	yPos = 0;
	for (var i = 2; i<boardObject[whichPlayer+"Cards"].length; i++) {
		this[whichPlayer+"CardsClip"].attachMovie("gameCards", whichPlayer+"_"+i, i);
		this[whichPlayer+"CardsClip"][whichPlayer+"_"+i]._x = xPos;
		this[whichPlayer+"CardsClip"][whichPlayer+"_"+i]._y = yPos;
		this[whichPlayer+"CardsClip"][whichPlayer+"_"+i].gotoAndStop(parseInt(boardObject[whichPlayer+"Cards"][i]));
		this[whichPlayer+"CardsClip"][whichPlayer+"_"+i].cardBG.gotoAndStop(whichPlayer);
		// remove the "player" and just save the number itself:
		this[whichPlayer+"CardsClip"][whichPlayer+"_"+i].playerRef = parseInt(whichPlayer.substring(6));
		this[whichPlayer+"CardsClip"][whichPlayer+"_"+i].cardRef = boardObject[whichPlayer+"Cards"][i];
		this[whichPlayer+"CardsClip"][whichPlayer+"_"+i].playersCardRef = i;
		if (!((boardObject.computerOpponent) && (whichPlayer == "player2"))) {
			// only enable cards to be active if player 1 or not playing a computer opponent
			this[whichPlayer+"CardsClip"][whichPlayer+"_"+i].onRelease = cardPressed;
		}
		yPos += 105;
		if (yPos>420) {
			xPos = 78;
			yPos = 0;
		}
	}
	this[whichPlayer+"CardsClip"].attachMovie("cardSelected", "cardSelected", boardObject[whichPlayer+"Cards"].length);
	this[whichPlayer+"CardsClip"].cardSelected._visible = false;
}
//
function setupAIMove() {
	clearInterval(initAIinterval);
	boardObject.Opponent = 1;
	findBestMove(boardObject.board, boardObject.whosMove, boardObject.player2Cards, boardObject.player1Cards);
	makeCardMove(bestTileX, bestTileY, bestCardRef, bestCardArrayRef);
}
//
function boardTilePressed() {
	if (boardObject.cardSelected != -1) {
		// try and place card - find board coords
		var boardCoords = this.tileRef.split("_");
		var tileX = parseInt(boardCoords[0]);
		var tileY = parseInt(boardCoords[1]);
		isValid = false;
		// check no card there already:
		if (boardObject.board[tileX][tileY][0] == "-") {
			// check that it adjoins another card (ie. that the board has a number there and not X, - or undefined):
			if (!isNaN(boardObject.board[tileX-1][tileY][0])) {
				isValid = true;
			} else if (!isNaN(boardObject.board[tileX+1][tileY][0])) {
				isValid = true;
			} else if (!isNaN(boardObject.board[tileX][tileY+1][0])) {
				isValid = true;
			} else if (!isNaN(boardObject.board[tileX][tileY-1][0])) {
				isValid = true;
			} else if (!isNaN(boardObject.board[tileX-1][tileY-1][0])) {
				isValid = true;
			} else if (!isNaN(boardObject.board[tileX+1][tileY-1][0])) {
				isValid = true;
			} else if (!isNaN(boardObject.board[tileX-1][tileY+1][0])) {
				isValid = true;
			} else if (!isNaN(boardObject.board[tileX+1][tileY+1][0])) {
				isValid = true;
			}
		}
		if (isValid) {
			makeCardMove(tileX, tileY, boardObject.cardSelected, boardObject.cardInPlayerArrayRef);
		}
	}
}
function makeCardMove(whichTileX, whichTileY, whichCardRef, whichCardArrayRef) {
	// hide card selection highlight:
	player1CardsClip.cardSelected._visible = false;
	player2CardsClip.cardSelected._visible = false;
	// store details for after animation:
	storedMoveTileX = whichTileX;
	storedMoveTileY = whichTileY;
	storedMoveWhichCardRef = whichCardRef;
	storedMoveWhichCardArrayRef = whichCardArrayRef;
	// need to determine board position relative to player's card holder clip:
	boardObject.endX = 0-(this["player"+boardObject.whosMove+"CardsClip"]._x-boardContainer._x)+boardContainer["board_"+whichTileX+"_"+whichTileY]._x;
	boardObject.endY = 0-(this["player"+boardObject.whosMove+"CardsClip"]._y-boardContainer._y)+boardContainer["board_"+whichTileX+"_"+whichTileY]._y;
	animationController.onEnterFrame = function() {
		var thisCardCurrentX = this._parent["player"+boardObject.whosMove+"CardsClip"]["player"+boardObject.whosMove+"_"+storedMoveWhichCardArrayRef]._x;
		var thisCardCurrentY = this._parent["player"+boardObject.whosMove+"CardsClip"]["player"+boardObject.whosMove+"_"+storedMoveWhichCardArrayRef]._y;
		this._parent["player"+boardObject.whosMove+"CardsClip"]["player"+boardObject.whosMove+"_"+storedMoveWhichCardArrayRef]._x -= (thisCardCurrentX-boardObject.endX)*0.7;
		this._parent["player"+boardObject.whosMove+"CardsClip"]["player"+boardObject.whosMove+"_"+storedMoveWhichCardArrayRef]._y -= (thisCardCurrentY-boardObject.endY)*0.7;
		if (Math.abs(thisCardCurrentX-boardObject.endX)<10) {
			if (Math.abs(thisCardCurrentY-boardObject.endY)<10) {
				delete animationController.onEnterFrame;
				afterCardPlacedOnBoard();
			}
		}
	};
}
function afterCardPlacedOnBoard() {
	if (boardObject.whosMove == 1) {
		boardObject.Opponent = 2;
		whosMoveIndicator._x = -320;
	} else {
		boardObject.Opponent = 1;
		whosMoveIndicator._x = 350;
	}
	// remove card from player's deck:
	this["player"+boardObject.whosMove+"CardsClip"]["player"+boardObject.whosMove+"_"+storedMoveWhichCardArrayRef].removeMovieClip();
	// add card to board array
	placeSingleCard(storedMoveTileX, storedMoveTileY, boardObject.whosMove, storedMoveWhichCardRef, storedMoveWhichCardArrayRef);
	// check to see if any opponent's cards should be flipped:
	checkAttack(storedMoveTileX, storedMoveTileY, -1, 0);
	checkAttack(storedMoveTileX, storedMoveTileY, 1, 0);
	checkAttack(storedMoveTileX, storedMoveTileY, 0, -1);
	checkAttack(storedMoveTileX, storedMoveTileY, 0, 1);
	checkAttack(storedMoveTileX, storedMoveTileY, -1, -1);
	checkAttack(storedMoveTileX, storedMoveTileY, 1, 1);
	checkAttack(storedMoveTileX, storedMoveTileY, -1, 1);
	checkAttack(storedMoveTileX, storedMoveTileY, 1, -1);
	// set to being the other player's turn now       
	storedMoveWhichCardRef = -1;
	boardObject.whosMove = boardObject.Opponent;
	if (boardObject.computerOpponent) {
		if (boardObject.whosMove == 2) {
			// ai move:
			initAIinterval = setInterval(setupAIMove, 1000);
		}
	}
}
function cardPressed() {
	if (boardObject.whosMove == this.playerRef) {
		boardObject.cardSelected = this.cardRef;
		boardObject.cardInPlayerArrayRef = this.playersCardRef;
		this._parent.cardSelected._visible = true;
		this._parent.cardSelected._x = this._x;
		this._parent.cardSelected._y = this._y;
	}
}
function checkAttack(placedTileX, placedTileY, xDir, yDir) {
	var defenceRunningTotal = 0;
	var opponentsCardsFound = [];
	// trace a path from selected tile, in direction set until a card that isn't an opponent's is encountered:
	var lineTracedX = placedTileX+xDir;
	var lineTracedY = placedTileY+yDir;
	while (boardObject.board[lineTracedX][lineTracedY][1] == boardObject.Opponent) {
		opponentsCardsFound.push([lineTracedX, lineTracedY]);
		defenceRunningTotal += getCardDetails(boardObject.board[lineTracedX][lineTracedY][0], "def");
		lineTracedX += xDir;
		lineTracedY += yDir;
	}
	var placedCardsAttack = getCardDetails(boardObject.board[placedTileX][placedTileY][0], "att");
	// then check card after is current player's card, not the board edge:
	if (boardObject.board[lineTracedX][lineTracedY][1] == boardObject.whosMove) {
		var existingCardsAttack = getCardDetails(boardObject.board[lineTracedX][lineTracedY][0], "att");
		if (placedCardsAttack+existingCardsAttack>=defenceRunningTotal) {
			for (i=0; i<opponentsCardsFound.length; i++) {
				flipCard(opponentsCardsFound[i][0], opponentsCardsFound[i][1], boardObject.whosMove);
			}
		}
	}
}
function getCardDetails(cardsType, cardAttribute) {
	//var cardsOriginalOwner = boardContainer["placed_card_"+cardTileX+"_"+cardTileY].originalOwner;
	//var cardsDeckRef = boardContainer["placed_card_"+cardTileX+"_"+cardTileY].ownersDeckRef;
	switch (cardAttribute) {
	case "def" :
		return boardObject.cardsAvailable[cardsType][1];
		break;
	case "att" :
		return boardObject.cardsAvailable[cardsType][0];
		break;
	}
}
function flipCard(whichTileX, whichTileY, newOwner) {
	boardObject.board[whichTileX][whichTileY][1] = newOwner;
	boardContainer["placed_card_"+whichTileX+"_"+whichTileY].cardBG.gotoAndStop("player"+newOwner);
	boardContainer["placed_card_"+whichTileX+"_"+whichTileY].cardBorder.gotoAndPlay("captured");
}
function placeSingleCard(tileX, tileY, whichPlayer, cardId, playersCardRef) {
	boardContainer.attachMovie("gameCards", "placed_card_"+tileX+"_"+tileY, boardContainer.getNextHighestDepth());
	boardContainer["placed_card_"+tileX+"_"+tileY].gotoAndStop(cardId);
	boardContainer["placed_card_"+tileX+"_"+tileY].cardBG.gotoAndStop("player"+whichPlayer);
	boardContainer["placed_card_"+tileX+"_"+tileY]._x = boardContainer["board_"+tileX+"_"+tileY]._x;
	boardContainer["placed_card_"+tileX+"_"+tileY]._y = boardContainer["board_"+tileX+"_"+tileY]._y;
	boardObject.whoOwnedCard[tileX][tileY] = whichPlayer;
	boardObject.board[tileX][tileY][0] = cardId;
	boardObject.board[tileX][tileY][1] = whichPlayer;
	// set the value of the card to be negative to indicate that it has been placed:
	boardObject["player"+whichPlayer+"Cards"][playersCardRef] = 0-parseInt(boardObject["player"+whichPlayer+"Cards"][playersCardRef]);
	boardObject.cardsPlaced++;

	if (boardObject.cardsPlaced == 24) {
		gameOver();
	}
	delete boardContainer["board_"+tileX+"_"+tileY].onRelease;
}
function findBestMove(boardState:Array, whichPlayer:Number, thisPlayersCards:Array, opponentsCards:Array) {
	var bestMoveFound = [];
	if (whichPlayer == 1) {
		boardObject.tempOpponent = 2;
	} else {
		boardObject.tempOpponent = 1;
	}
	boardObject.listOfPossibleBestMoves = [[-99999999]];
	var thisOpponentsCards = opponentsCards.slice();
	var thisThisPlayersCards = thisPlayersCards.slice();
	bestImmediatePlayerMove = [];
	// copy current board to tempboard:
	boardObject.tempBoard = new Array();
	for (var l = 0; l<boardState.length; l++) {
		boardObject.tempBoard[l] = new Array();
		for (var m = 0; m<boardState[l].length; m++) {
			// copy the single element...
			if (boardState[l][m] == "X") {
				boardObject.tempBoard[l][m] = "X";
			} else {
				// ... or copy this array:
				boardObject.tempBoard[l][m] = boardState[l][m].slice();
			}
		}
	}
	var nextMove = findSubsequentMove(boardObject.tempOpponent, thisOpponentsCards, thisThisPlayersCards, 1, boardObject.cardsPlaced);
	// count number of flips for this player to determine best move       
	for (var i = 0; i<boardState.length; i++) {
		for (var j = 0; j<boardState[i].length; j++) {
			// ignore empty cells or those with a card already:
			if (boardState[i][j] != "X") {
				if (boardState[i][j][0] == "-") {
					// check if this space adjoins a space with a card in (ie. would be a valid move)
					var isValid = false;
					if (!isNaN(boardState[i-1][j][0])) {
						isValid = true;
					} else if (!isNaN(boardState[i+1][j][0])) {
						isValid = true;
					} else if (!isNaN(boardState[i][j+1][0])) {
						isValid = true;
					} else if (!isNaN(boardState[i][j-1][0])) {
						isValid = true;
					} else if (!isNaN(boardState[i-1][j-1][0])) {
						isValid = true;
					} else if (!isNaN(boardState[i+1][j-1][0])) {
						isValid = true;
					} else if (!isNaN(boardState[i-1][j+1][0])) {
						isValid = true;
					} else if (!isNaN(boardState[i+1][j+1][0])) {
						isValid = true;
					}
					if (isValid) {
						// check if this position is worth blocking:
						blockingModifier = 0;
						for (var z = 0; z<bestImmediatePlayerMove.length; z++) {
							if (i == bestImmediatePlayerMove[z][0]) {
								if (j == bestImmediatePlayerMove[z][1]) {
									// is a player move to block
									blockingModifier = 0.01;
								}
							}
						}
						// loop through all cards remaining to this player (ie. positive values) and try them in this position:
						cardTypesTriedAtThisPosition = [];
						for (var k = 0; k<thisPlayersCards.length; k++) {
							if (thisPlayersCards[k]>0) {
								// check if a card of identical type has already been tried at this position:
								var sameCardTypeAlreadyTried = false;
								for (var l = 0; l<cardTypesTriedAtThisPosition.length; l++) {
									if (cardTypesTriedAtThisPosition[l] == thisPlayersCards[k]) {
										sameCardTypeAlreadyTried = true;
										break;
									}
								}
								if (!sameCardTypeAlreadyTried) {
									cardTypesTriedAtThisPosition.push(thisPlayersCards[k]);
									// try this card at this location:
									boardObject.opponentCardsFlipped = 0;
									// copy multidimensional array:
									boardObject.tempBoard = new Array();
									for (var l = 0; l<boardState.length; l++) {
										boardObject.tempBoard[l] = new Array();
										for (var m = 0; m<boardState[l].length; m++) {
											// copy the single element...
											if (boardState[l][m] == "X") {
												boardObject.tempBoard[l][m] = "X";
											} else {
												// ... or copy this array:
												boardObject.tempBoard[l][m] = boardState[l][m].slice();
											}
										}
									}
									boardObject.tempBoard[i][j][0] = parseInt(thisPlayersCards[k]);
									boardObject.tempBoard[i][j][1] = whichPlayer;
									checkAIAttack(i, j, -1, 0);
									checkAIAttack(i, j, 1, 0);
									checkAIAttack(i, j, 0, -1);
									checkAIAttack(i, j, 0, 1);
									checkAIAttack(i, j, -1, -1);
									checkAIAttack(i, j, 1, 1);
									checkAIAttack(i, j, -1, 1);
									checkAIAttack(i, j, 1, -1);
									// call this function again with this tempboard which will return the best case for the next move:
									// stop if at the end of the search tree
									if (boardObject.cardsPlaced<24) {
										// need to copy player cards arrays to pass with this 'k' card removed:
										var thisOpponentsCards = opponentsCards.slice();
										var thisThisPlayersCards = thisPlayersCards.slice();
										thisThisPlayersCards[k] = 0-parseInt(thisThisPlayersCards[k]);
										var cardsFlippedByThisMove = boardObject.opponentCardsFlipped;
										var nextMove = findSubsequentMove(boardObject.tempOpponent, thisOpponentsCards, thisThisPlayersCards, 1, boardObject.cardsPlaced);
										// subtract the best case for the opponent's next move from this move's score:
										// weight the move so that any move that flips a player's card is preferred to no flips
										// (otherwise a computer flip (+1) and then the player flips next turn (-1) is the same as no flips in either 2 turns, which leads to a boring game)
										if (cardsFlippedByThisMove>0) {
											cardsFlippedByThisMove += 0.02*cardsFlippedByThisMove;
										}
										cardsFlippedByThisMove += blockingModifier;
										//trace("tile: "+i+","+j+"  best: "+boardObject.mostFlipsSoFar+"   "+cardsFlippedByThisMove+"-"+nextMove+" = "+(cardsFlippedByThisMove-nextMove));   
										cardsFlippedByThisMove -= nextMove;
									}
									// store all best values in an array (card id, tilex, tiley)                                                                                                                            
									for (q=0; q<boardObject.listOfPossibleBestMoves.length; q++) {
										if (cardsFlippedByThisMove>boardObject.listOfPossibleBestMoves[q][0]) {
											boardObject.listOfPossibleBestMoves.splice(q, 0, [cardsFlippedByThisMove, [parseInt(thisPlayersCards[k]), i, j, k]]);
											break;
										} else if (cardsFlippedByThisMove == boardObject.listOfPossibleBestMoves[q][0]) {
											boardObject.listOfPossibleBestMoves[q].push([parseInt(thisPlayersCards[k]), i, j, k]);
											break;
										}
									}
									if (cardsFlippedByThisMove<boardObject.listOfPossibleBestMoves[(boardObject.listOfPossibleBestMoves.length-1)][0]) {
										boardObject.listOfPossibleBestMoves.push([cardsFlippedByThisMove, [parseInt(thisPlayersCards[k]), i, j, k]]);
									}
									if (boardObject.listOfPossibleBestMoves.length>10) {
										boardObject.listOfPossibleBestMoves.pop();
									}
								}
							}
						}
					}
				}
			}
		}
	}
	// remove the -99999999 if it's still present:
	if (boardObject.listOfPossibleBestMoves[(boardObject.listOfPossibleBestMoves.length-1)][0] == -99999999) {
		boardObject.listOfPossibleBestMoves.pop();
	}
	// pick best move at random from those possible, according to rank:                                                                            
	var pickMoveRange = boardObject.opponentSkillRank;
	if (pickMoveRange>boardObject.listOfPossibleBestMoves.length) {
		pickMoveRange = boardObject.listOfPossibleBestMoves.length-1;
	}
	var bestScoreChosen = Math.floor(Math.random()*(pickMoveRange));
	// the first element is the score, so offset for that
	var bestMoveChosen = Math.floor(Math.random()*(boardObject.listOfPossibleBestMoves[bestScoreChosen].length-1))+1;
	bestCardRef = boardObject.listOfPossibleBestMoves[bestScoreChosen][bestMoveChosen][0];
	bestTileX = boardObject.listOfPossibleBestMoves[bestScoreChosen][bestMoveChosen][1];
	bestTileY = boardObject.listOfPossibleBestMoves[bestScoreChosen][bestMoveChosen][2];
	bestCardArrayRef = boardObject.listOfPossibleBestMoves[bestScoreChosen][bestMoveChosen][3];
	//trace("score chosen: "+bestScoreChosen);
	//trace("best move was: "+boardObject.listOfPossibleBestMoves[0][1][1]+","+boardObject.listOfPossibleBestMoves[0][1][2]);
	junkoutput = "possible scores were";
	for (junki=0; junki<boardObject.listOfPossibleBestMoves.length; junki++) {
		junkoutput += ","+boardObject.listOfPossibleBestMoves[junki][0];
	}
	//trace(junkoutput);
	//trace("-----------------");
}
//
function findSubsequentMove(subseqWhichPlayer, subseqThisPlayersCards, subseqOpponentsCards, subseqRecurssiveDepth, subseqMovesMadeSoFar) {
	if (subseqWhichPlayer == 1) {
		boardObject.subseqTempOpponent = 2;
	} else {
		boardObject.subseqTempOpponent = 1;
	}
	var maxFlipsPossibleThisTurn = -99999999;
	// count number of flips for this player to determine best move   
	for (var i = 0; i<boardObject.tempBoard.length; i++) {
		for (var j = 0; j<boardObject.tempBoard[i].length; j++) {
			// ignore empty cells or those with a card already:
			if (boardObject.tempBoard[i][j] != "X") {
				if (boardObject.tempBoard[i][j][0] == "-") {
					// check if this space adjoins a space with a card in (ie. would be a valid move)
					var isValid = false;
					if (!isNaN(boardObject.tempBoard[i-1][j][0])) {
						isValid = true;
					} else if (!isNaN(boardObject.tempBoard[i+1][j][0])) {
						isValid = true;
					} else if (!isNaN(boardObject.tempBoard[i][j+1][0])) {
						isValid = true;
					} else if (!isNaN(boardObject.tempBoard[i][j-1][0])) {
						isValid = true;
					} else if (!isNaN(boardObject.tempBoard[i-1][j-1][0])) {
						isValid = true;
					} else if (!isNaN(boardObject.tempBoard[i+1][j-1][0])) {
						isValid = true;
					} else if (!isNaN(boardObject.tempBoard[i-1][j+1][0])) {
						isValid = true;
					} else if (!isNaN(boardObject.tempBoard[i+1][j+1][0])) {
						isValid = true;
					}
					if (isValid) {
						// loop through all cards remaining to this player (ie. positive values) and try them in this position:
						subseqCardTypesTriedAtThisPosition = [];
						for (var k = 0; k<subseqThisPlayersCards.length; k++) {
							if (subseqThisPlayersCards[k]>0) {
								// check if a card of identical type has already been tried at this position:
								var subseqSameCardTypeAlreadyTried = false;
								for (var l = 0; l<subseqCardTypesTriedAtThisPosition.length; l++) {
									if (subseqCardTypesTriedAtThisPosition[l] == subseqThisPlayersCards[k]) {
										subseqSameCardTypeAlreadyTried = true;
										break;
									}
								}
								if (!subseqSameCardTypeAlreadyTried) {
									subseqCardTypesTriedAtThisPosition.push(subseqThisPlayersCards[k]);
									// try this card at this location:
									boardObject.subseqOpponentCardsFlipped = 0;
									// make copy of the state of the board from the AI move being analysed:
									boardObject.subseqTempBoard = new Array();
									for (var l = 0; l<boardObject.tempBoard.length; l++) {
										boardObject.subseqTempBoard[l] = new Array();
										for (var m = 0; m<boardObject.tempBoard[l].length; m++) {
											// copy the single element...
											if (boardObject.tempBoard[l][m] == "X") {
												boardObject.subseqTempBoard[l][m] = "X";
											} else {
												// ... or copy this array:
												boardObject.subseqTempBoard[l][m] = boardObject.tempBoard[l][m].slice();
											}
										}
									}
									boardObject.subseqTempBoard[i][j][0] = parseInt(subseqThisPlayersCards[k]);
									boardObject.subseqTempBoard[i][j][1] = subseqWhichPlayer;
									checkSubseqPlayerAttack(i, j, -1, 0);
									checkSubseqPlayerAttack(i, j, 1, 0);
									checkSubseqPlayerAttack(i, j, 0, -1);
									checkSubseqPlayerAttack(i, j, 0, 1);
									checkSubseqPlayerAttack(i, j, -1, -1);
									checkSubseqPlayerAttack(i, j, 1, 1);
									checkSubseqPlayerAttack(i, j, -1, 1);
									checkSubseqPlayerAttack(i, j, 1, -1);
									/*
									// call this function again with this tempboard which will return the best case for the next move:
									// don't go too deep recurrsively and stop if at the end of the search tree
									if ((subseqRecurssiveDepth<0) && (subseqMovesMadeSoFar<24)) {
									// need to copy player cards arrays to pass with this 'k' card removed:
									var thissubseqOpponentsCards = subseqOpponentsCards.slice();
									var thissubseqThisPlayersCards = subseqThisPlayersCards.slice();
									thissubseqThisPlayersCards[k] = 0-parseInt(thissubseqThisPlayersCards[k]);
									//trace("calling best move for "+i+","+j+" with card "+k);
									var nextMove = findSubsequentMove(boardObject.subseqTempBoard, boardObject.subseqTempOpponent, thissubseqOpponentsCards, thissubseqThisPlayersCards, (subseqRecurssiveDepth+1), (subseqMovesMadeSoFar+1));
									// subtract the best case for the opponent's next move from this move's score:
									// trace("pos "+i+","+j+" with card "+k+" gives "+boardObject.opponentCardsFlipped+" next move best = "+nextMove);
									boardObject.opponentCardsFlipped -= nextMove;
									}
									*/
									if (boardObject.subseqOpponentCardsFlipped>0) {
										// only need to save positions that flip cards
										if (boardObject.subseqOpponentCardsFlipped == maxFlipsPossibleThisTurn) {
											bestImmediatePlayerMove.push([i, j]);
										} else if (boardObject.subseqOpponentCardsFlipped>maxFlipsPossibleThisTurn) {
											// clear previous results and just have this new value initially:
											bestImmediatePlayerMove = [[i, j]];
											maxFlipsPossibleThisTurn = boardObject.subseqOpponentCardsFlipped;
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
	if (maxFlipsPossibleThisTurn == -99999999) {
		// if no cards were found to flip:
		maxFlipsPossibleThisTurn = 0;
	}
	// return the best case found so far:                                                                           
	return maxFlipsPossibleThisTurn;
}
//
function checkAIAttack(placedTileX, placedTileY, xDir, yDir) {
	var defenceRunningTotal = 0;
	var opponentsCardsFound = [];
	// trace a path from selected tile, in direction set until a card that isn't an opponent's is encountered:
	var lineTracedX = placedTileX+xDir;
	var lineTracedY = placedTileY+yDir;
	// (opponent will always be '1' against an AI opponent:)
	while (boardObject.tempBoard[lineTracedX][lineTracedY][1] == 1) {
		opponentsCardsFound.push([lineTracedX, lineTracedY]);
		defenceRunningTotal += getCardDetails(boardObject.tempBoard[lineTracedX][lineTracedY][0], "def");
		lineTracedX += xDir;
		lineTracedY += yDir;
	}
	var placedCardsAttack = getCardDetails(boardObject.tempBoard[placedTileX][placedTileY][0], "att");
	// then check card after is current player's card, not the board edge:
	// AI opponent will always be '2':
	if (boardObject.tempBoard[lineTracedX][lineTracedY][1] == 2) {
		var existingCardsAttack = getCardDetails(boardObject.tempBoard[lineTracedX][lineTracedY][0], "att");
		if (placedCardsAttack+existingCardsAttack>=defenceRunningTotal) {
			boardObject.opponentCardsFlipped += opponentsCardsFound.length;
			for (i=0; i<opponentsCardsFound.length; i++) {
				boardObject.tempBoard[(opponentsCardsFound[i][0])][(opponentsCardsFound[i][1])][1] = 2;
			}
		}
	}
}
//
function checkSubseqPlayerAttack(placedTileX, placedTileY, xDir, yDir) {
	var defenceRunningTotal = 0;
	var opponentsCardsFound = 0;
	// trace a path from selected tile, in direction set until a card that isn't an opponent's is encountered:
	var lineTracedX = placedTileX+xDir;
	var lineTracedY = placedTileY+yDir;
	// checking for the AI's own cards:
	while (boardObject.subseqTempBoard[lineTracedX][lineTracedY][1] == 2) {
		opponentsCardsFound++;
		defenceRunningTotal += getCardDetails(boardObject.subseqTempBoard[lineTracedX][lineTracedY][0], "def");
		lineTracedX += xDir;
		lineTracedY += yDir;
	}
	var placedCardsAttack = getCardDetails(boardObject.subseqTempBoard[placedTileX][placedTileY][0], "att");
	// then check card after is current player's card, not the board edge:
	// human player (whose turn it will be after the AI move) is player 1:
	if (boardObject.subseqTempBoard[lineTracedX][lineTracedY][1] == 1) {
		var existingCardsAttack = getCardDetails(boardObject.subseqTempBoard[lineTracedX][lineTracedY][0], "att");
		if (placedCardsAttack+existingCardsAttack>=defenceRunningTotal) {
			boardObject.subseqOpponentCardsFlipped += opponentsCardsFound;
		}
	}
}
//
function gameOver() {
	// count up cards for each player:
	var cardsForPlayer1 = 0;
	var cardsForPlayer2 = 0;
	for (var i = 0; i<boardObject.board.length; i++) {
		for (var j = 0; j<boardObject.board[i].length; j++) {
			if (boardObject.board[i][j][1] == 1) {
				cardsForPlayer1++;
			} else if (boardObject.board[i][j][1] == 2) {
				cardsForPlayer2++;
			}
		}
	}
	if (cardsForPlayer1 == cardsForPlayer2) {
		outcome.gotoAndPlay("draw");
	} else if (boardObject.computerOpponent) {
		if (cardsForPlayer1>cardsForPlayer2) {
			outcome.gotoAndPlay("player1Single");
		} else {
			outcome.gotoAndPlay("player2Single");
		}
	} else {
		if (cardsForPlayer1>cardsForPlayer2) {
			outcome.gotoAndPlay("player1");
		} else {
			outcome.gotoAndPlay("player2");
		}
	}
}
//
function afterGame() {
	// store result so that NPC can respond appropriately #######
	trace("clean up etc");
	trace("core will detail ");
	if (boardObject.winningPlayer == 1) {
		trace("received");
	} else {
		trace("lost");
	}
	trace(boardObject.cardsAvailable[boardObject.winCardTypeSelected][2]+" card");
	cleanUpAfterGame();
}
function cleanUpAfterGame() {
	
	delete animationController.onEnterFrame;
	 delete boardObject;
	 // gotoAndPlay("closeBoard");
}
//
function pickWonCard(whichPlayerLost) {
	 cardPickerHolder._visible = true;
	boardObject.winCardSelected = -1;
	boardObject.winCardTypeSelected = -1;
	if (whichPlayerLost == 1) {
		boardObject.winningPlayer = 2;
	} else {
		boardObject.winningPlayer = 1;
	}
	boardObject.losingPlayer = whichPlayerLost;
	
	
	// blur board:
	boardObject.boardBlurAmount = 0;
	boardObject.boardBlur = new BlurFilter(0, 0, 2);
	 

	// draw out cards that be selected from (all that where captured):
	boardObject.cardsAvailableToBePicked = [];
	boardObject.cardsCaptured = 0;

// ideally this should be zero (align graphics in Flash IDE):
cardPickerOffsetX = cardPickerHolder._x-boardContainer._x;
cardPickerOffsetY = cardPickerHolder._y-boardContainer._y;


	for (var i = 0; i<boardObject.board.length; i++) {
		for (var j = 0; j<boardObject.board[i].length; j++) {
 
      if ((boardObject.board[i][j][1]) != whichPlayerLost) {
        if ((boardObject.whoOwnedCard[i][j]) == whichPlayerLost) {
          
       var thisCard = boardObject.board[i][j][0];
       
		boardObject.cardsAvailableToBePicked.push(thisCard);
         
         // hide card on board:
	boardContainer["placed_card_"+i+"_"+j]._visible = false;
          cardPickerHolder.cardPicker.attachMovie("gameCards", "placed_card_"+boardObject.cardsCaptured, cardPickerHolder.cardPicker.getNextHighestDepth());
		cardPickerHolder.cardPicker["placed_card_"+boardObject.cardsCaptured].gotoAndStop(thisCard);
		cardPickerHolder.cardPicker["placed_card_"+boardObject.cardsCaptured].cardBG.gotoAndStop("player"+whichPlayerLost);
		
		// position these cards 'on' the board:
		cardPickerHolder.cardPicker["placed_card_"+boardObject.cardsCaptured]._x = boardContainer["placed_card_"+i+"_"+j]._x-cardPickerOffsetX;
		cardPickerHolder.cardPicker["placed_card_"+boardObject.cardsCaptured]._y = boardContainer["placed_card_"+i+"_"+j]._y-cardPickerOffsetY;
	

	
    cardPickerHolder.cardPicker["placed_card_"+boardObject.cardsCaptured].cardRef = thisCard;
          	
		cardPickerHolder.cardPicker["placed_card_"+boardObject.cardsCaptured].playersCardRef = boardObject.cardsCaptured;
		 boardObject.cardsCaptured ++;

          
        }
      }
      
		}
	}
	
	var widthOfOneCard = 85;
	boardObject.cardsMoving = new Array()
	for(var i=0; i<boardObject.cardsAvailableToBePicked.length;i++) {
	boardObject.cardsMoving.push("1");
	// stage is 900 wide
	
	
  if (boardObject.cardsAvailableToBePicked.length<7) {
    // single, centred row:
    cardPickerHolder.cardPicker["placed_card_"+i].destX = (widthOfOneCard*i)+((900-(widthOfOneCard*boardObject.cardsAvailableToBePicked.length))/2)+cardPickerHolder._x;
    cardPickerHolder.cardPicker["placed_card_"+i].destY = 100;
  } else {
  
  var breakPointFloor = Math.floor(boardObject.cardsAvailableToBePicked.length/2);
  var breakPointCeil = Math.ceil(boardObject.cardsAvailableToBePicked.length/2);
  
  
  
  if (i<breakPointFloor) {

  cardPickerHolder.cardPicker["placed_card_"+i].destX = (widthOfOneCard*i)+((900-(widthOfOneCard*breakPointFloor))/2)+cardPickerHolder._x;
  cardPickerHolder.cardPicker["placed_card_"+i].destY = 60;
  } else {

  cardPickerHolder.cardPicker["placed_card_"+i].destX = (widthOfOneCard*(i-breakPointFloor))+((900-(widthOfOneCard*breakPointCeil))/2)+cardPickerHolder._x;
  cardPickerHolder.cardPicker["placed_card_"+i].destY = 170;
  }
 }
	
	}

	
animationController.onEnterFrame = function() {

  if (boardObject.boardBlurAmount<20) {
    boardObject.boardBlurAmount ++;
    boardObject.boardBlur.blurX = boardObject.boardBlurAmount;
    boardObject.boardBlur.blurY = boardObject.boardBlurAmount;
    boardContainer.filters = [boardObject.boardBlur];
  }
  for(var i=0; i<boardObject.cardsAvailableToBePicked.length;i++) {
    var thisCard = cardPickerHolder.cardPicker["placed_card_"+i];
    thisCard._x -= (thisCard._x-thisCard.destX)*0.2;
    thisCard._y -= (thisCard._y-thisCard.destY)*0.2;

    
    if (Math.abs(thisCard._x-thisCard.destX)<6) {
      if (Math.abs(thisCard._y-thisCard.destY)<6) {
        thisCard._x = thisCard.destX;
        thisCard._y = thisCard.destY;
        boardObject.cardsMoving[i] = "0";
      }
    }
    // check if any cards are moving still:

    if(boardObject.cardsMoving.join(",").indexOf("1") == -1) {
           delete animationController.onEnterFrame;
       playerCanSelectCards();
    }
  }

}
	
}
//

function playerCanSelectCards() {
	if (!((boardObject.computerOpponent) && (boardObject.winningPlayer == 2))) {
	for(var i=0; i<boardObject.cardsAvailableToBePicked.length;i++) {
			cardPickerHolder.cardPicker["placed_card_"+i].onRelease = selectCardToWin;
			cardPickerHolder.cardPicker["placed_card_"+i].onRollOver = showTooltip;
			cardPickerHolder.cardPicker["placed_card_"+i].onRollOut = hideTooltip;
			animationController.onEnterFrame = function() {
				// move tooltip:
				cardTooltip._x = _xmouse+10;
				cardTooltip._y = _ymouse;
			};
		}
		} else {
		
		
		
		
			// order these by card score:
	
	var allCardsSortedByScore = [[-99999999]];
	for (var i = 0; i<boardObject.cardsAvailableToBePicked.length; i++) {
		// square the attack ad defense score before summing hem so that a 10+1 is higher than a 5+6
		var thisCardsCombinedScore = (boardObject.cardsAvailable[[(boardObject.cardsAvailableToBePicked[i])][0]][0])*(boardObject.cardsAvailable[[(boardObject.cardsAvailableToBePicked[i])][0]][0])+(boardObject.cardsAvailable[[(boardObject.cardsAvailableToBePicked[i])][0]][1])*(boardObject.cardsAvailable[[(boardObject.cardsAvailableToBePicked[i])][0]][1]);
		for (q=0; q<allCardsSortedByScore.length; q++) {
			if (thisCardsCombinedScore>allCardsSortedByScore[q][0]) {
				allCardsSortedByScore.splice(q, 0, [thisCardsCombinedScore, [(boardObject.cardsAvailableToBePicked[i])]]);
				break;
			} else if (thisCardsCombinedScore == allCardsSortedByScore[q][0]) {
				allCardsSortedByScore[q][1].push((boardObject.cardsAvailableToBePicked[i]));
				break;
			}
		}
		if (thisCardsCombinedScore<allCardsSortedByScore[(allCardsSortedByScore.length-1)][0]) {
			allCardsSortedByScore.push([thisCardsCombinedScore, [(boardObject.cardsAvailableToBePicked[i])]]);
		}
	}
	// remove the -99999999:
	if (allCardsSortedByScore[(allCardsSortedByScore.length-1)][0] == -99999999) {
		allCardsSortedByScore.pop();
	}
	boardObject.sortedCardsArray = [];
	for (var i = 0; i<allCardsSortedByScore.length; i++) {
		// ignore first element as this is the score:
		var arrayToBeAdded = allCardsSortedByScore[i][1];
		boardObject.sortedCardsArray = boardObject.sortedCardsArray.concat(arrayToBeAdded);
	}
	// store the number of cards that the AI should pick from:
	var AICanPickRange = allCardsSortedByScore[0][1].length;
	// make the AI pick from the top 2 ranges of top scoring cards:
	if (allCardsSortedByScore[1][1].length>0) {
		AICanPickRange += allCardsSortedByScore[1][1].length;
	}
	//          
	
	           
	
	

			// ai chooses player's card to take - pick random card from the top two scoring ranges:
			var cardIndexPicked = Math.floor(Math.random()*(AICanPickRange));
			boardObject.winCardSelected = cardIndexPicked;
			boardObject.winCardTypeSelected = cardPickerHolder.cardPicker["placed_card_"+cardIndexPicked].cardRef;
			cardPickerHolder.cardPicker["placed_card_"+cardIndexPicked].cardBG.gotoAndStop("player"+boardObject.winningPlayer);
			cardPickerHolder.chooseCardButton._visible = false;
			pickedCardAnimation();

		
	}	
		
}

//
function showTooltip() {
	cardTooltip.cardText.text = boardObject.cardsAvailable[this.cardRef][2];
	cardTooltip._visible = true;
}
//
function hideTooltip() {
	cardTooltip._visible = false;
}
//
function confirmCardPicked() {
	if (boardObject.winCardSelected == -1) {
		// no card selected:
		confirmMessage = "you haven't selected a card. is this ok?";
	} else {
		confirmMessage = "select '"+boardObject.cardsAvailable[boardObject.winCardTypeSelected][2]+"' card?";
	}
	cardPickerHolder.popUp.outputMessage.text = confirmMessage;
	cardPickerHolder.popUp._visible = true;
}
//
function pickedCardAnimation() {
	cardPickerHolder.popUp._visible = false;
	animationController.onEnterFrame = function() {
		if (cardPickerHolder.cardPicker["placed_card_"+boardObject.winCardSelected]._alpha<=0) {
			delete animationController.onEnterFrame;
			afterGame();
		} else {
			cardPickerHolder.cardPicker["placed_card_"+boardObject.winCardSelected]._width *= 1.1;
			cardPickerHolder.cardPicker["placed_card_"+boardObject.winCardSelected]._height *= 1.1;
			cardPickerHolder.cardPicker["placed_card_"+boardObject.winCardSelected]._alpha -= 10;
		}
	};
}
//
function popupResponse(responseType) {
	if (responseType == "yes") {
		// stop tooltip enter frame:
		delete animationController.onEnterFrame;
		if (boardObject.winCardSelected == -1) {
			// no card selected - but the player is ok with this:
			afterGame();
		} else {
			// take this card:
			if (boardObject.computerOpponent) {
				if (boardObject.winningPlayer == 1) {
					// see if this card was one of the NPC's unique cards:
					var isAUniqueCard = false;
					for (var i = 0; i<thisNPCsUniqueCards.length; i++) {
						if (thisNPCsUniqueCards[i] == boardObject.winCardTypeSelected) {
							isAUniqueCard = true;
							break;
						}
					}
					if (isAUniqueCard) {
						// remove from list:
						// #### addToChanges in core.swf
					}
					// add this card to player's card list ####                                         
				} else {
					// remove from player's card list:
					// add this card to the NPC's unique card list:
					// #### addToChanges in core.swf
				}
			} else {
				// whatever database entry is required to pass this card
				// remove from boardObject.losingPlayer
				// add to boardObject.winningPlayer
				// ###############
			}
			pickedCardAnimation();
		}
	} else {
		// reset:
		cardPickerHolder.popUp._visible = false;
		cardPickerHolder.cardPicker["placed_card_"+boardObject.winCardSelected].cardBG.gotoAndStop("player"+boardObject.losingPlayer);
		boardObject.winCardSelected = -1;
		boardObject.winCardTypeSelected = -1;
	}
}
function selectCardToWin() {
	// restore previous flipped card
	this._parent["placed_card_"+boardObject.winCardSelected].cardBG.gotoAndStop("player"+boardObject.losingPlayer);
	boardObject.winCardSelected = this.playersCardRef;
	boardObject.winCardTypeSelected = this.cardRef;

	this.cardBG.gotoAndStop("player"+boardObject.winningPlayer);
}
//
cardGameInit();
playerChooseCards(1);
playerChooseCards(2);
stop();
