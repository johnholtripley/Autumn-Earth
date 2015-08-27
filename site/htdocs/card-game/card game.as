function cardGameInit()
{
   boardObject = new Object();
   cardSelected._visible = false;
   cardPickerHolder.popUp._visible = false;
   cardPickerHolder._visible = false;
   cardTooltip._visible = false;
   boardObject.okToPlay = false;
   startCardGameButton.gotoAndStop(1);
   boardObject.whosMove = 1;
   boardObject.computerOpponent = true;
   boardObject.opponentSkillRank = 1;
   thisNPCsDeck = 1;
   thisNPCsUniqueCards = [4,3,4];
   thisNPCsUniqueCards = [3,3,3];
   boardObject.cardSelected = -1;
   boardObject.cardsPlaced = 0;
   whosMoveIndicator._x = 350;
   boardObject.cardsAvailable = ["",[5,10,"goat"],[5,10,"piranha"],[5,10,"grendel"],[5,10,"fish"]];
   boardObject.player1AllCardsInDeck = ["",12,1,4,9,1,2,3,1,2,2,3,1,2,3,1,2,3,1,2,3,1,2,3,1,2,3,1,2,3,1,1,1,4,3];
   standardDecksAvailable = [[1,1,1,1,1,1,1,1,2,2,2,3,3,3],[3,3,3,3,3,3,3,3,3,3,3,3,3,3],[2,2,2,3,3,3,3,3,4,4,4,4,4,4]];
   if(boardObject.computerOpponent)
   {
      boardObject.player2AllCardsInDeck = standardDecksAvailable[thisNPCsDeck].concat(thisNPCsUniqueCards);
   }
}
function playerChooseCards(whichPlayer)
{
   if(whichPlayer == 2)
   {
      if(boardObject.computerOpponent)
      {
         var _loc8_ = [];
         var _loc1_ = [[-99999999]];
         var _loc3_ = 0;
         while(_loc3_ < boardObject.player2AllCardsInDeck.length)
         {
            var _loc2_ = boardObject.cardsAvailable[[boardObject.player2AllCardsInDeck[_loc3_]][0]][0] * boardObject.cardsAvailable[[boardObject.player2AllCardsInDeck[_loc3_]][0]][0] + boardObject.cardsAvailable[[boardObject.player2AllCardsInDeck[_loc3_]][0]][1] * boardObject.cardsAvailable[[boardObject.player2AllCardsInDeck[_loc3_]][0]][1];
            q = 0;
            while(q < _loc1_.length)
            {
               if(_loc2_ > _loc1_[q][0])
               {
                  _loc1_.splice(q,0,[_loc2_,[boardObject.player2AllCardsInDeck[_loc3_]]]);
                  break;
               }
               if(_loc2_ == _loc1_[q][0])
               {
                  _loc1_[q][1].push(boardObject.player2AllCardsInDeck[_loc3_]);
                  break;
               }
               q++;
            }
            if(_loc2_ < _loc1_[_loc1_.length - 1][0])
            {
               _loc1_.push([_loc2_,[boardObject.player2AllCardsInDeck[_loc3_]]]);
            }
            _loc3_ = _loc3_ + 1;
         }
         if(_loc1_[_loc1_.length - 1][0] == -99999999)
         {
            _loc1_.pop();
         }
         var _loc7_ = 0;
         var _loc4_ = "";
         _loc3_ = 0;
         while(_loc3_ < _loc1_.length)
         {
            thisScoresRandomCards = _loc1_[_loc3_][1].sort(shuffle);
            if(_loc3_ > 0)
            {
               _loc4_ = _loc4_ + ",";
            }
            _loc4_ = _loc4_ + thisScoresRandomCards.join(",");
            _loc3_ = _loc3_ + 1;
         }
         randomlySortedWithinScoresCardsArray = _loc4_.split(",");
         boardObject.player2Cards = randomlySortedWithinScoresCardsArray.slice(0,12);
         boardObject.player2Cards.sort(shuffle);
         var _loc5_ = -1;
         var _loc6_ = -1;
         _loc3_ = 0;
         while(_loc3_ < 12)
         {
            if(boardObject.cardsAvailable[boardObject.player2Cards[_loc3_]][1] > _loc5_)
            {
               _loc5_ = boardObject.cardsAvailable[boardObject.player2Cards[_loc3_]][1];
               highestDefenceCardPos = _loc3_;
               _loc6_ = boardObject.player2Cards[_loc3_];
            }
            _loc3_ = _loc3_ + 1;
         }
         boardObject.player2Cards.splice(highestDefenceCardPos,1);
         boardObject.player2Cards.unshift(_loc6_);
         _loc5_ = -1;
         _loc6_ = -1;
         _loc3_ = 1;
         while(_loc3_ < 12)
         {
            if(boardObject.cardsAvailable[boardObject.player2Cards[_loc3_]][1] > _loc5_)
            {
               _loc5_ = boardObject.cardsAvailable[boardObject.player2Cards[_loc3_]][1];
               highestDefenceCardPos = _loc3_;
               _loc6_ = boardObject.player2Cards[_loc3_];
            }
            _loc3_ = _loc3_ + 1;
         }
         boardObject.player2Cards.splice(highestDefenceCardPos,1);
         boardObject.player2Cards.unshift(_loc6_);
      }
   }
   else
   {
      humanPlayerPickCards();
   }
}
function humanPlayerPickCards()
{
   var _loc3_ = 0;
   var _loc5_ = 0;
   var _loc6_ = 55;
   var _loc1_ = 0;
   var _loc2_ = 1;
   while(_loc2_ < boardObject.player1AllCardsInDeck.length)
   {
      if(_loc3_ > 410)
      {
         _loc3_ = 0;
         _loc5_ = _loc5_ + _loc6_;
      }
      var _loc4_ = 0;
      while(_loc4_ < boardObject.player1AllCardsInDeck[_loc2_])
      {
         cardSelectionHolder.scrollListing.listAttach.cardHolder.attachMovie("smallCards","smallCard" + _loc1_,_loc1_);
         cardSelectionHolder.scrollListing.listAttach.cardHolder["smallCard" + _loc1_]._x = _loc3_;
         cardSelectionHolder.scrollListing.listAttach.cardHolder["smallCard" + _loc1_]._y = _loc5_;
         cardSelectionHolder.scrollListing.listAttach.cardHolder["smallCard" + _loc1_].origX = _loc3_;
         cardSelectionHolder.scrollListing.listAttach.cardHolder["smallCard" + _loc1_].origY = _loc5_;
         cardSelectionHolder.scrollListing.listAttach.cardHolder["smallCard" + _loc1_].gotoAndStop(_loc2_);
         cardSelectionHolder.scrollListing.listAttach.cardHolder["smallCard" + _loc1_].cardBG.gotoAndStop(1);
         cardSelectionHolder.scrollListing.listAttach.cardHolder["smallCard" + _loc1_].cardRef = _loc2_;
         cardSelectionHolder.scrollListing.listAttach.cardHolder["smallCard" + _loc1_].destX = 0;
         cardSelectionHolder.scrollListing.listAttach.cardHolder["smallCard" + _loc1_].destY = 0;
         cardSelectionHolder.scrollListing.listAttach.cardHolder["smallCard" + _loc1_].isMoving = 0;
         cardSelectionHolder.scrollListing.listAttach.cardHolder["smallCard" + _loc1_].uniqueCardId = _loc1_;
         cardSelectionHolder.scrollListing.listAttach.cardHolder["smallCard" + _loc1_].onRollOver = showTooltip;
         cardSelectionHolder.scrollListing.listAttach.cardHolder["smallCard" + _loc1_].onRollOut = hideTooltip;
         cardSelectionHolder.scrollListing.listAttach.cardHolder["smallCard" + _loc1_].onRelease = addCardSelection;
         _loc1_ = _loc1_ + 1;
         _loc4_ = _loc4_ + 1;
      }
      if(boardObject.player1AllCardsInDeck[_loc2_] > 1)
      {
         cardSelectionHolder.scrollListing.listAttach.quantityHolder.attachMovie("selectionQuantity","selectionQuantity" + _loc2_,_loc2_);
         cardSelectionHolder.scrollListing.listAttach.quantityHolder["selectionQuantity" + _loc2_].thisQuantity.text = boardObject.player1AllCardsInDeck[_loc2_];
         cardSelectionHolder.scrollListing.listAttach.quantityHolder["selectionQuantity" + _loc2_]._x = _loc3_;
         cardSelectionHolder.scrollListing.listAttach.quantityHolder["selectionQuantity" + _loc2_]._y = _loc5_;
         _loc1_ = _loc1_ + 1;
      }
      if(boardObject.player1AllCardsInDeck[_loc2_] > 0)
      {
         _loc3_ = _loc3_ + 45;
      }
      _loc2_ = _loc2_ + 1;
   }
   displaySelectedList();
   scrollListHeight = _loc5_ + _loc6_;
   minScrollItemHeight = 60;
   listSpacing = 0;
   listScrollSpeed = 15;
   listBoxHeight = 150;
   scrollTrackHeight = 100;
   boardObject.playerCurrentlyPickedCards = ["x","x","x","x","x","x","x","x","x","x","x","x"];
   displayScrollList();
   animationController.onEnterFrame = function()
   {
      cardTooltip._x = _xmouse + 10;
      cardTooltip._y = _ymouse;
      animationSelectionCards();
   };
}
function addCardSelection()
{
   var _loc3_ = -1;
   var _loc2_ = 0;
   while(_loc2_ < 12)
   {
      if(boardObject.playerCurrentlyPickedCards[_loc2_] == "x")
      {
         _loc3_ = _loc2_;
         break;
      }
      _loc2_ = _loc2_ + 1;
   }
   if(_loc3_ != -1)
   {
      cardsPickedHolder.attachMovie("smallCards","smallCard" + this.uniqueCardId,cardsPickedHolder.getNextHighestDepth());
      var _loc4_ = cardsPickedHolder["smallCard" + this.uniqueCardId];
      _loc4_.destX = cardsPickedHolder["cardSelectedPosition" + _loc3_]._x;
      _loc4_.destY = cardsPickedHolder["cardSelectedPosition" + _loc3_]._y;
      _loc4_.isMoving = 1;
      _loc4_._x = cardSelectionHolder._x - (cardsPickedHolder._x - this._x);
      _loc4_._y = cardSelectionHolder._y - (cardsPickedHolder._y - this._y) + cardSelectionHolder.scrollListing.listAttach._y;
      _loc4_.pickedSlot = _loc3_;
      _loc4_.gotoAndStop(this.cardRef);
      _loc4_.cardBG.gotoAndStop(1);
      _loc4_.cardRef = this.cardRef;
      _loc4_.origX = this.origX;
      _loc4_.origY = this.origY;
      _loc4_.uniqueCardId = this.uniqueCardId;
      boardObject.playerCurrentlyPickedCards[_loc3_] = this.cardRef;
      var _loc5_ = parseInt(cardSelectionHolder.scrollListing.listAttach.quantityHolder["selectionQuantity" + this.cardRef].thisQuantity.text);
      cardSelectionHolder.scrollListing.listAttach.quantityHolder["selectionQuantity" + this.cardRef].thisQuantity.text = _loc5_ - 1;
      if(_loc5_ == 2)
      {
         cardSelectionHolder.scrollListing.listAttach.quantityHolder["selectionQuantity" + this.cardRef]._visible = false;
      }
      _loc3_ = -1;
      _loc2_ = 0;
      while(_loc2_ < 12)
      {
         if(boardObject.playerCurrentlyPickedCards[_loc2_] == "x")
         {
            _loc3_ = _loc2_;
            break;
         }
         _loc2_ = _loc2_ + 1;
      }
      if(_loc3_ == -1)
      {
         startCardGameButton.gotoAndStop(2);
      }
      this._visible = false;
   }
}
function animationSelectionCards()
{
   for(var _loc3_ in cardsPickedHolder)
   {
      var _loc1_ = cardsPickedHolder[_loc3_];
      if(_loc1_.isMoving != 0)
      {
         _loc1_._x = _loc1_._x - (_loc1_._x - _loc1_.destX) / 2;
         _loc1_._y = _loc1_._y - (_loc1_._y - _loc1_.destY) / 2;
         if(Math.abs(_loc1_._x - _loc1_.destX) < 8)
         {
            _loc1_._x = _loc1_.destX;
            _loc1_._y = _loc1_.destY;
            if(_loc1_.isMoving == 1)
            {
               _loc1_.isMoving = 0;
               _loc1_.onRelease = deSelectCard;
               _loc1_.onRollOver = showTooltip;
               _loc1_.onRollOut = hideTooltip;
            }
            else
            {
               cardSelectionHolder.scrollListing.listAttach.cardHolder["smallCard" + _loc1_.uniqueCardId]._visible = true;
               var _loc2_ = parseInt(cardSelectionHolder.scrollListing.listAttach.quantityHolder["selectionQuantity" + _loc1_.cardRef].thisQuantity.text);
               cardSelectionHolder.scrollListing.listAttach.quantityHolder["selectionQuantity" + _loc1_.cardRef].thisQuantity.text = _loc2_ + 1;
               if(_loc2_ > 0)
               {
                  cardSelectionHolder.scrollListing.listAttach.quantityHolder["selectionQuantity" + _loc1_.cardRef]._visible = true;
               }
               _loc1_.isMoving = 0;
               _loc1_.removeMovieClip();
            }
         }
      }
   }
}
function deSelectCard()
{
   hideTooltip();
   boardObject.playerCurrentlyPickedCards[this.pickedSlot] = "x";
   startCardGameButton.gotoAndStop(1);
   delete this.onRelease;
   delete this.onRollOver;
   delete this.onRollOut;
   this.destX = cardSelectionHolder._x - (cardsPickedHolder._x - this.origX);
   this.destY = cardSelectionHolder._y - (cardsPickedHolder._y - this.origY) + cardSelectionHolder.scrollListing.listAttach._y;
   this.isMoving = -1;
}
function cancelGame()
{
   cleanUpSelection();
}
function playerReady()
{
   boardObject.firstPlaced = 0;
   boardObject.secondPlaced = 1;
   if(boardObject.secondPlaced < boardObject.firstPlaced)
   {
      var _loc3_ = boardObject.firstPlaced;
      boardObject.firstPlaced = boardObject.secondPlaced;
      boardObject.secondPlaced = _loc3_;
   }
   var _loc1_ = boardObject.playerCurrentlyPickedCards[boardObject.firstPlaced];
   var _loc2_ = boardObject.playerCurrentlyPickedCards[boardObject.secondPlaced];
   boardObject.playerCurrentlyPickedCards.splice(boardObject.firstPlaced,1);
   boardObject.playerCurrentlyPickedCards.splice(boardObject.secondPlaced - 1,1);
   boardObject.player1Cards = boardObject.playerCurrentlyPickedCards.slice();
   boardObject.player1Cards.unshift(_loc2_);
   boardObject.player1Cards.unshift(_loc1_);
   cleanUpSelection();
   gotoAndStop("startCardGame");
   play();
}
function cleanUpSelection()
{
   delete animationController.onEnterFrame;
   for(var _loc1_ in cardSelectionHolder.scrollListing.listAttach.cardHolder)
   {
      cardSelectionHolder.scrollListing.listAttach.cardHolder[_loc1_].removeMovieClip();
   }
   for(var _loc1_ in cardSelectionHolder.scrollListing.listAttach.quantityHolder)
   {
      cardSelectionHolder.scrollListing.listAttach.quantityHolder[_loc1_].removeMovieClip();
   }
}
function displaySelectedList()
{
   var _loc2_ = 0;
   var _loc3_ = 0;
   var _loc1_ = 0;
   while(_loc1_ < 12)
   {
      cardsPickedHolder.attachMovie("cardSelectedPosition","cardSelectedPosition" + _loc1_,_loc1_);
      cardsPickedHolder["cardSelectedPosition" + _loc1_]._x = _loc2_;
      cardsPickedHolder["cardSelectedPosition" + _loc1_]._y = _loc3_;
      cardsPickedHolder["cardSelectedPosition" + _loc1_].fakeRadioButton.radioId = _loc1_;
      cardsPickedHolder["cardSelectedPosition" + _loc1_].fakeRadioButton.onRelease = toggleInitialSelected;
      _loc2_ = _loc2_ + 70;
      if(_loc1_ % 2 != 0)
      {
         _loc3_ = _loc3_ + 55;
         _loc2_ = 0;
      }
      _loc1_ = _loc1_ + 1;
   }
   cardsPickedHolder.cardSelectedPosition0.fakeRadioButton.gotoAndStop("radioSelected");
   cardsPickedHolder.cardSelectedPosition1.fakeRadioButton.gotoAndStop("radioSelected");
   boardObject.firstPlaced = 0;
   boardObject.secondPlaced = 1;
}
function toggleInitialSelected()
{
   trace(this.radioId);
}
function displayScrollList()
{
   boardObject.currentScrollPos = 0;
   scrollTrackProportion = listBoxHeight / scrollListHeight;
   cardSelectionHolder.scrollListing.scrollTrackAll.dragger._height = scrollTrackProportion * scrollTrackHeight;
   cardSelectionHolder.scrollListing.scrollTrackAll.dragger._y = cardSelectionHolder.scrollListing.scrollTrackAll.scrollTrackBG._y;
   if(scrollListHeight <= listBoxHeight)
   {
      cardSelectionHolder.scrollListing.scrollTrackAll._visible = false;
   }
   else
   {
      cardSelectionHolder.scrollListing.scrollTrackAll._visible = true;
      scrollMouseListener = new Object();
      scrollMouseListener.onMouseWheel = function(delta)
      {
         clearInterval(scrollListInterval);
         if(delta > 0)
         {
            scrollUp(1);
         }
         else
         {
            scrollDown(1);
         }
      };
      Mouse.addListener(scrollMouseListener);
      cardSelectionHolder.scrollListing.scrollTrackAll.dragger.onPress = function()
      {
         this.startDrag(false,cardSelectionHolder.scrollListing.scrollTrackAll.scrollTrackBG._x,cardSelectionHolder.scrollListing.scrollTrackAll.scrollTrackBG._y,cardSelectionHolder.scrollListing.scrollTrackAll.scrollTrackBG._x,cardSelectionHolder.scrollListing.scrollTrackAll.scrollTrackBG._y + cardSelectionHolder.scrollListing.scrollTrackAll.scrollTrackBG._height - cardSelectionHolder.scrollListing.scrollTrackAll.dragger._height);
         this.onEnterFrame = function()
         {
            boardObject.currentScrollPos = - (cardSelectionHolder.scrollListing.scrollTrackAll.dragger._y - cardSelectionHolder.scrollListing.scrollTrackAll.scrollTrackBG._y) / scrollTrackHeight * scrollListHeight;
            cardSelectionHolder.scrollListing.listAttach._y = boardObject.currentScrollPos;
         };
      };
      cardSelectionHolder.scrollListing.scrollTrackAll.dragger.onRelease = cardSelectionHolder.scrollListing.scrollTrackAll.dragger.onReleaseOutside = function()
      {
         this.stopDrag();
         delete this.onEnterFrame;
      };
   }
}
function scrollUp(speedFactor)
{
   singleScrollUp(speedFactor);
   clearInterval(scrollListInterval);
}
function scrollDown(speedFactor)
{
   singleScrollDown(speedFactor);
   clearInterval(scrollListInterval);
}
function smoothScroll(whichWay)
{
   scrollListInterval = setInterval(doSmoothScroll,50,whichWay);
}
function doSmoothScroll(whichWay)
{
   if(whichWay == -1)
   {
      singleScrollUp(1);
   }
   else
   {
      singleScrollDown(1);
   }
}
function singleScrollUp(speedFactor)
{
   if(boardObject.currentScrollPos < 0)
   {
      proposedScrollPos = boardObject.currentScrollPos + listScrollSpeed * speedFactor;
      if(proposedScrollPos > 0)
      {
         proposedScrollPos = 0;
      }
      cardSelectionHolder.scrollListing.listAttach._y = proposedScrollPos;
      boardObject.currentScrollPos = cardSelectionHolder.scrollListing.listAttach._y;
      cardSelectionHolder.scrollListing.scrollTrackAll.dragger._y = cardSelectionHolder.scrollListing.scrollTrackAll.scrollTrackBG._y + (- boardObject.currentScrollPos / scrollListHeight) * scrollTrackHeight;
   }
}
function singleScrollDown(speedFactor)
{
   if(boardObject.currentScrollPos > - scrollListHeight - listBoxHeight)
   {
      proposedScrollPos = boardObject.currentScrollPos - listScrollSpeed * speedFactor;
      if(proposedScrollPos < - scrollListHeight - listBoxHeight)
      {
         proposedScrollPos = - scrollListHeight - listBoxHeight;
      }
      cardSelectionHolder.scrollListing.listAttach._y = proposedScrollPos;
      boardObject.currentScrollPos = cardSelectionHolder.scrollListing.listAttach._y;
      cardSelectionHolder.scrollListing.scrollTrackAll.dragger._y = cardSelectionHolder.scrollListing.scrollTrackAll.scrollTrackBG._y + (- boardObject.currentScrollPos / scrollListHeight) * scrollTrackHeight;
   }
}
function shuffle(a, b)
{
   var _loc1_ = Math.round(Math.random() * 2) - 1;
   return _loc1_;
}
function drawBoard()
{
   boardObject.board = [["X","X",["-","-"],["-","-"],"X","X"],["X",["-","-"],["-","-"],["-","-"],["-","-"],"X"],[["-","-"],["-","-"],["-","-"],["-","-"],["-","-"],["-","-"]],[["-","-"],["-","-"],["-","-"],["-","-"],["-","-"],["-","-"]],["X",["-","-"],["-","-"],["-","-"],["-","-"],"X"],["X","X",["-","-"],["-","-"],"X","X"]];
   boardObject.whoOwnedCard = [["X","X",0,0,"X","X"],["X",0,0,0,0,"X"],[0,0,0,0,0,0],[0,0,0,0,0,0],["X",0,0,0,0,"X"],["X","X",0,0,"X","X"]];
   counter = 0;
   var _loc2_ = 0;
   while(_loc2_ < boardObject.board.length)
   {
      var _loc1_ = 0;
      while(_loc1_ < boardObject.board[_loc2_].length)
      {
         if(boardObject.board[_loc2_][_loc1_] != "X")
         {
            boardContainer.attachMovie("boardTile","board_" + _loc2_ + "_" + _loc1_,counter);
            boardContainer["board_" + _loc2_ + "_" + _loc1_]._x = _loc2_ * 78;
            boardContainer["board_" + _loc2_ + "_" + _loc1_]._y = _loc1_ * 105;
            boardContainer["board_" + _loc2_ + "_" + _loc1_].tileRef = _loc2_ + "_" + _loc1_;
            boardContainer["board_" + _loc2_ + "_" + _loc1_].onRelease = boardTilePressed;
            counter++;
         }
         _loc1_ = _loc1_ + 1;
      }
      _loc2_ = _loc2_ + 1;
   }
   placeCards("player1");
   placeSingleCard(2,2,1,boardObject.player1Cards[0],0);
   placeSingleCard(3,3,1,boardObject.player1Cards[1],1);
   placeCards("player2");
   placeSingleCard(3,2,2,boardObject.player2Cards[0],0);
   placeSingleCard(2,3,2,boardObject.player2Cards[1],1);
}
function placeCards(whichPlayer)
{
   xPos = 0;
   yPos = 0;
   var _loc3_ = 2;
   while(_loc3_ < boardObject[whichPlayer + "Cards"].length)
   {
      this[whichPlayer + "CardsClip"].attachMovie("gameCards",whichPlayer + "_" + _loc3_,_loc3_);
      this[whichPlayer + "CardsClip"][whichPlayer + "_" + _loc3_]._x = xPos;
      this[whichPlayer + "CardsClip"][whichPlayer + "_" + _loc3_]._y = yPos;
      this[whichPlayer + "CardsClip"][whichPlayer + "_" + _loc3_].gotoAndStop(parseInt(boardObject[whichPlayer + "Cards"][_loc3_]));
      this[whichPlayer + "CardsClip"][whichPlayer + "_" + _loc3_].cardBG.gotoAndStop(whichPlayer);
      this[whichPlayer + "CardsClip"][whichPlayer + "_" + _loc3_].playerRef = parseInt(whichPlayer.substring(6));
      this[whichPlayer + "CardsClip"][whichPlayer + "_" + _loc3_].cardRef = boardObject[whichPlayer + "Cards"][_loc3_];
      this[whichPlayer + "CardsClip"][whichPlayer + "_" + _loc3_].playersCardRef = _loc3_;
      if(!(boardObject.computerOpponent && whichPlayer == "player2"))
      {
         this[whichPlayer + "CardsClip"][whichPlayer + "_" + _loc3_].onRelease = cardPressed;
      }
      yPos = yPos + 105;
      if(yPos > 420)
      {
         xPos = 78;
         yPos = 0;
      }
      _loc3_ = _loc3_ + 1;
   }
   this[whichPlayer + "CardsClip"].attachMovie("cardSelected","cardSelected",boardObject[whichPlayer + "Cards"].length);
   this[whichPlayer + "CardsClip"].cardSelected._visible = false;
}
function setupAIMove()
{
   clearInterval(initAIinterval);
   boardObject.Opponent = 1;
   findBestMove(boardObject.board,boardObject.whosMove,boardObject.player2Cards,boardObject.player1Cards);
   makeCardMove(bestTileX,bestTileY,bestCardRef,bestCardArrayRef);
}
function boardTilePressed()
{
   if(boardObject.cardSelected != -1)
   {
      var _loc4_ = this.tileRef.split("_");
      var _loc3_ = parseInt(_loc4_[0]);
      var _loc2_ = parseInt(_loc4_[1]);
      isValid = false;
      if(boardObject.board[_loc3_][_loc2_][0] == "-")
      {
         if(!isNaN(boardObject.board[_loc3_ - 1][_loc2_][0]))
         {
            isValid = true;
         }
         else if(!isNaN(boardObject.board[_loc3_ + 1][_loc2_][0]))
         {
            isValid = true;
         }
         else if(!isNaN(boardObject.board[_loc3_][_loc2_ + 1][0]))
         {
            isValid = true;
         }
         else if(!isNaN(boardObject.board[_loc3_][_loc2_ - 1][0]))
         {
            isValid = true;
         }
         else if(!isNaN(boardObject.board[_loc3_ - 1][_loc2_ - 1][0]))
         {
            isValid = true;
         }
         else if(!isNaN(boardObject.board[_loc3_ + 1][_loc2_ - 1][0]))
         {
            isValid = true;
         }
         else if(!isNaN(boardObject.board[_loc3_ - 1][_loc2_ + 1][0]))
         {
            isValid = true;
         }
         else if(!isNaN(boardObject.board[_loc3_ + 1][_loc2_ + 1][0]))
         {
            isValid = true;
         }
      }
      if(isValid)
      {
         makeCardMove(_loc3_,_loc2_,boardObject.cardSelected,boardObject.cardInPlayerArrayRef);
      }
   }
}
function makeCardMove(whichTileX, whichTileY, whichCardRef, whichCardArrayRef)
{
   player1CardsClip.cardSelected._visible = false;
   player2CardsClip.cardSelected._visible = false;
   storedMoveTileX = whichTileX;
   storedMoveTileY = whichTileY;
   storedMoveWhichCardRef = whichCardRef;
   storedMoveWhichCardArrayRef = whichCardArrayRef;
   boardObject.endX = - this["player" + boardObject.whosMove + "CardsClip"]._x - boardContainer._x + boardContainer["board_" + whichTileX + "_" + whichTileY]._x;
   boardObject.endY = - this["player" + boardObject.whosMove + "CardsClip"]._y - boardContainer._y + boardContainer["board_" + whichTileX + "_" + whichTileY]._y;
   animationController.onEnterFrame = function()
   {
      var _loc3_ = this._parent["player" + boardObject.whosMove + "CardsClip"]["player" + boardObject.whosMove + "_" + storedMoveWhichCardArrayRef]._x;
      var _loc2_ = this._parent["player" + boardObject.whosMove + "CardsClip"]["player" + boardObject.whosMove + "_" + storedMoveWhichCardArrayRef]._y;
      this._parent["player" + boardObject.whosMove + "CardsClip"]["player" + boardObject.whosMove + "_" + storedMoveWhichCardArrayRef]._x = this._parent["player" + boardObject.whosMove + "CardsClip"]["player" + boardObject.whosMove + "_" + storedMoveWhichCardArrayRef]._x - (_loc3_ - boardObject.endX) * 0.7;
      this._parent["player" + boardObject.whosMove + "CardsClip"]["player" + boardObject.whosMove + "_" + storedMoveWhichCardArrayRef]._y = this._parent["player" + boardObject.whosMove + "CardsClip"]["player" + boardObject.whosMove + "_" + storedMoveWhichCardArrayRef]._y - (_loc2_ - boardObject.endY) * 0.7;
      if(Math.abs(_loc3_ - boardObject.endX) < 10)
      {
         if(Math.abs(_loc2_ - boardObject.endY) < 10)
         {
            delete animationController.onEnterFrame;
            afterCardPlacedOnBoard();
         }
      }
   };
}
function afterCardPlacedOnBoard()
{
   if(boardObject.whosMove == 1)
   {
      boardObject.Opponent = 2;
      whosMoveIndicator._x = -320;
   }
   else
   {
      boardObject.Opponent = 1;
      whosMoveIndicator._x = 350;
   }
   this["player" + boardObject.whosMove + "CardsClip"]["player" + boardObject.whosMove + "_" + storedMoveWhichCardArrayRef].removeMovieClip();
   placeSingleCard(storedMoveTileX,storedMoveTileY,boardObject.whosMove,storedMoveWhichCardRef,storedMoveWhichCardArrayRef);
   checkAttack(storedMoveTileX,storedMoveTileY,-1,0);
   checkAttack(storedMoveTileX,storedMoveTileY,1,0);
   checkAttack(storedMoveTileX,storedMoveTileY,0,-1);
   checkAttack(storedMoveTileX,storedMoveTileY,0,1);
   checkAttack(storedMoveTileX,storedMoveTileY,-1,-1);
   checkAttack(storedMoveTileX,storedMoveTileY,1,1);
   checkAttack(storedMoveTileX,storedMoveTileY,-1,1);
   checkAttack(storedMoveTileX,storedMoveTileY,1,-1);
   storedMoveWhichCardRef = -1;
   boardObject.whosMove = boardObject.Opponent;
   if(boardObject.computerOpponent)
   {
      if(boardObject.whosMove == 2)
      {
         initAIinterval = setInterval(setupAIMove,1000);
      }
   }
}
function cardPressed()
{
   if(boardObject.whosMove == this.playerRef)
   {
      boardObject.cardSelected = this.cardRef;
      boardObject.cardInPlayerArrayRef = this.playersCardRef;
      this._parent.cardSelected._visible = true;
      this._parent.cardSelected._x = this._x;
      this._parent.cardSelected._y = this._y;
   }
}
function checkAttack(placedTileX, placedTileY, xDir, yDir)
{
   var _loc4_ = 0;
   var _loc3_ = [];
   var _loc1_ = placedTileX + xDir;
   var _loc2_ = placedTileY + yDir;
   while(boardObject.board[_loc1_][_loc2_][1] == boardObject.Opponent)
   {
      _loc3_.push([_loc1_,_loc2_]);
      _loc4_ = _loc4_ + getCardDetails(boardObject.board[_loc1_][_loc2_][0],"def");
      _loc1_ = _loc1_ + xDir;
      _loc2_ = _loc2_ + yDir;
   }
   var _loc7_ = getCardDetails(boardObject.board[placedTileX][placedTileY][0],"att");
   if(boardObject.board[_loc1_][_loc2_][1] == boardObject.whosMove)
   {
      var _loc8_ = getCardDetails(boardObject.board[_loc1_][_loc2_][0],"att");
      if(_loc7_ + _loc8_ >= _loc4_)
      {
         i = 0;
         while(i < _loc3_.length)
         {
            flipCard(_loc3_[i][0],_loc3_[i][1],boardObject.whosMove);
            i++;
         }
      }
   }
}
function getCardDetails(cardsType, cardAttribute)
{
   switch(cardAttribute)
   {
      case "def":
         return boardObject.cardsAvailable[cardsType][1];
      case "att":
         return boardObject.cardsAvailable[cardsType][0];
      default:
   }
}
function flipCard(whichTileX, whichTileY, newOwner)
{
   boardObject.board[whichTileX][whichTileY][1] = newOwner;
   boardContainer["placed_card_" + whichTileX + "_" + whichTileY].cardBG.gotoAndStop("player" + newOwner);
   boardContainer["placed_card_" + whichTileX + "_" + whichTileY].cardBorder.gotoAndPlay("captured");
}
function placeSingleCard(tileX, tileY, whichPlayer, cardId, playersCardRef)
{
   boardContainer.attachMovie("gameCards","placed_card_" + tileX + "_" + tileY,boardContainer.getNextHighestDepth());
   boardContainer["placed_card_" + tileX + "_" + tileY].gotoAndStop(cardId);
   boardContainer["placed_card_" + tileX + "_" + tileY].cardBG.gotoAndStop("player" + whichPlayer);
   boardContainer["placed_card_" + tileX + "_" + tileY]._x = boardContainer["board_" + tileX + "_" + tileY]._x;
   boardContainer["placed_card_" + tileX + "_" + tileY]._y = boardContainer["board_" + tileX + "_" + tileY]._y;
   boardObject.whoOwnedCard[tileX][tileY] = whichPlayer;
   boardObject.board[tileX][tileY][0] = cardId;
   boardObject.board[tileX][tileY][1] = whichPlayer;
   boardObject["player" + whichPlayer + "Cards"][playersCardRef] = - parseInt(boardObject["player" + whichPlayer + "Cards"][playersCardRef]);
   boardObject.cardsPlaced = boardObject.cardsPlaced + 1;
   if(boardObject.cardsPlaced == 24)
   {
      gameOver();
   }
   delete boardContainer["board_" + tileX + "_" + tileY].onRelease;
}
function findBestMove(boardState, whichPlayer, thisPlayersCards, opponentsCards)
{
   var _loc20_ = [];
   if(whichPlayer == 1)
   {
      boardObject.tempOpponent = 2;
   }
   else
   {
      boardObject.tempOpponent = 1;
   }
   boardObject.listOfPossibleBestMoves = [[-99999999]];
   var _loc14_ = opponentsCards.slice();
   var _loc11_ = thisPlayersCards.slice();
   bestImmediatePlayerMove = [];
   boardObject.tempBoard = new Array();
   var _loc5_ = 0;
   while(_loc5_ < boardState.length)
   {
      boardObject.tempBoard[_loc5_] = new Array();
      var _loc6_ = 0;
      while(_loc6_ < boardState[_loc5_].length)
      {
         if(boardState[_loc5_][_loc6_] == "X")
         {
            boardObject.tempBoard[_loc5_][_loc6_] = "X";
         }
         else
         {
            boardObject.tempBoard[_loc5_][_loc6_] = boardState[_loc5_][_loc6_].slice();
         }
         _loc6_ = _loc6_ + 1;
      }
      _loc5_ = _loc5_ + 1;
   }
   var _loc13_ = findSubsequentMove(boardObject.tempOpponent,_loc14_,_loc11_,1,boardObject.cardsPlaced);
   var _loc2_ = 0;
   while(_loc2_ < boardState.length)
   {
      var _loc1_ = 0;
      while(_loc1_ < boardState[_loc2_].length)
      {
         if(boardState[_loc2_][_loc1_] != "X")
         {
            if(boardState[_loc2_][_loc1_][0] == "-")
            {
               var _loc9_ = false;
               if(!isNaN(boardState[_loc2_ - 1][_loc1_][0]))
               {
                  _loc9_ = true;
               }
               else if(!isNaN(boardState[_loc2_ + 1][_loc1_][0]))
               {
                  _loc9_ = true;
               }
               else if(!isNaN(boardState[_loc2_][_loc1_ + 1][0]))
               {
                  _loc9_ = true;
               }
               else if(!isNaN(boardState[_loc2_][_loc1_ - 1][0]))
               {
                  _loc9_ = true;
               }
               else if(!isNaN(boardState[_loc2_ - 1][_loc1_ - 1][0]))
               {
                  _loc9_ = true;
               }
               else if(!isNaN(boardState[_loc2_ + 1][_loc1_ - 1][0]))
               {
                  _loc9_ = true;
               }
               else if(!isNaN(boardState[_loc2_ - 1][_loc1_ + 1][0]))
               {
                  _loc9_ = true;
               }
               else if(!isNaN(boardState[_loc2_ + 1][_loc1_ + 1][0]))
               {
                  _loc9_ = true;
               }
               if(_loc9_)
               {
                  blockingModifier = 0;
                  var _loc10_ = 0;
                  while(_loc10_ < bestImmediatePlayerMove.length)
                  {
                     if(_loc2_ == bestImmediatePlayerMove[_loc10_][0])
                     {
                        if(_loc1_ == bestImmediatePlayerMove[_loc10_][1])
                        {
                           blockingModifier = 0.01;
                        }
                     }
                     _loc10_ = _loc10_ + 1;
                  }
                  cardTypesTriedAtThisPosition = [];
                  var _loc3_ = 0;
                  while(_loc3_ < thisPlayersCards.length)
                  {
                     if(thisPlayersCards[_loc3_] > 0)
                     {
                        var _loc12_ = false;
                        _loc5_ = 0;
                        while(_loc5_ < cardTypesTriedAtThisPosition.length)
                        {
                           if(cardTypesTriedAtThisPosition[_loc5_] == thisPlayersCards[_loc3_])
                           {
                              _loc12_ = true;
                              break;
                           }
                           _loc5_ = _loc5_ + 1;
                        }
                        if(!_loc12_)
                        {
                           cardTypesTriedAtThisPosition.push(thisPlayersCards[_loc3_]);
                           boardObject.opponentCardsFlipped = 0;
                           boardObject.tempBoard = new Array();
                           _loc5_ = 0;
                           while(_loc5_ < boardState.length)
                           {
                              boardObject.tempBoard[_loc5_] = new Array();
                              _loc6_ = 0;
                              while(_loc6_ < boardState[_loc5_].length)
                              {
                                 if(boardState[_loc5_][_loc6_] == "X")
                                 {
                                    boardObject.tempBoard[_loc5_][_loc6_] = "X";
                                 }
                                 else
                                 {
                                    boardObject.tempBoard[_loc5_][_loc6_] = boardState[_loc5_][_loc6_].slice();
                                 }
                                 _loc6_ = _loc6_ + 1;
                              }
                              _loc5_ = _loc5_ + 1;
                           }
                           boardObject.tempBoard[_loc2_][_loc1_][0] = parseInt(thisPlayersCards[_loc3_]);
                           boardObject.tempBoard[_loc2_][_loc1_][1] = whichPlayer;
                           checkAIAttack(_loc2_,_loc1_,-1,0);
                           checkAIAttack(_loc2_,_loc1_,1,0);
                           checkAIAttack(_loc2_,_loc1_,0,-1);
                           checkAIAttack(_loc2_,_loc1_,0,1);
                           checkAIAttack(_loc2_,_loc1_,-1,-1);
                           checkAIAttack(_loc2_,_loc1_,1,1);
                           checkAIAttack(_loc2_,_loc1_,-1,1);
                           checkAIAttack(_loc2_,_loc1_,1,-1);
                           if(boardObject.cardsPlaced < 24)
                           {
                              _loc14_ = opponentsCards.slice();
                              _loc11_ = thisPlayersCards.slice();
                              _loc11_[_loc3_] = - parseInt(_loc11_[_loc3_]);
                              var _loc7_ = boardObject.opponentCardsFlipped;
                              _loc13_ = findSubsequentMove(boardObject.tempOpponent,_loc14_,_loc11_,1,boardObject.cardsPlaced);
                              if(_loc7_ > 0)
                              {
                                 _loc7_ = _loc7_ + 0.02 * _loc7_;
                              }
                              _loc7_ = _loc7_ + blockingModifier;
                              _loc7_ = _loc7_ - _loc13_;
                           }
                           q = 0;
                           while(q < boardObject.listOfPossibleBestMoves.length)
                           {
                              if(_loc7_ > boardObject.listOfPossibleBestMoves[q][0])
                              {
                                 boardObject.listOfPossibleBestMoves.splice(q,0,[_loc7_,[parseInt(thisPlayersCards[_loc3_]),_loc2_,_loc1_,_loc3_]]);
                                 break;
                              }
                              if(_loc7_ == boardObject.listOfPossibleBestMoves[q][0])
                              {
                                 boardObject.listOfPossibleBestMoves[q].push([parseInt(thisPlayersCards[_loc3_]),_loc2_,_loc1_,_loc3_]);
                                 break;
                              }
                              q++;
                           }
                           if(_loc7_ < boardObject.listOfPossibleBestMoves[boardObject.listOfPossibleBestMoves.length - 1][0])
                           {
                              boardObject.listOfPossibleBestMoves.push([_loc7_,[parseInt(thisPlayersCards[_loc3_]),_loc2_,_loc1_,_loc3_]]);
                           }
                           if(boardObject.listOfPossibleBestMoves.length > 10)
                           {
                              boardObject.listOfPossibleBestMoves.pop();
                           }
                        }
                     }
                     _loc3_ = _loc3_ + 1;
                  }
               }
            }
         }
         _loc1_ = _loc1_ + 1;
      }
      _loc2_ = _loc2_ + 1;
   }
   if(boardObject.listOfPossibleBestMoves[boardObject.listOfPossibleBestMoves.length - 1][0] == -99999999)
   {
      boardObject.listOfPossibleBestMoves.pop();
   }
   var _loc19_ = boardObject.opponentSkillRank;
   if(_loc19_ > boardObject.listOfPossibleBestMoves.length)
   {
      _loc19_ = boardObject.listOfPossibleBestMoves.length - 1;
   }
   var _loc17_ = Math.floor(Math.random() * _loc19_);
   var _loc18_ = Math.floor(Math.random() * (boardObject.listOfPossibleBestMoves[_loc17_].length - 1)) + 1;
   bestCardRef = boardObject.listOfPossibleBestMoves[_loc17_][_loc18_][0];
   bestTileX = boardObject.listOfPossibleBestMoves[_loc17_][_loc18_][1];
   bestTileY = boardObject.listOfPossibleBestMoves[_loc17_][_loc18_][2];
   bestCardArrayRef = boardObject.listOfPossibleBestMoves[_loc17_][_loc18_][3];
   junkoutput = "possible scores were";
   junki = 0;
   while(junki < boardObject.listOfPossibleBestMoves.length)
   {
      junkoutput = junkoutput + ("," + boardObject.listOfPossibleBestMoves[junki][0]);
      junki++;
   }
}
function findSubsequentMove(subseqWhichPlayer, subseqThisPlayersCards, subseqOpponentsCards, subseqRecurssiveDepth, subseqMovesMadeSoFar)
{
   if(subseqWhichPlayer == 1)
   {
      boardObject.subseqTempOpponent = 2;
   }
   else
   {
      boardObject.subseqTempOpponent = 1;
   }
   var _loc9_ = -99999999;
   var _loc2_ = 0;
   while(_loc2_ < boardObject.tempBoard.length)
   {
      var _loc1_ = 0;
      while(_loc1_ < boardObject.tempBoard[_loc2_].length)
      {
         if(boardObject.tempBoard[_loc2_][_loc1_] != "X")
         {
            if(boardObject.tempBoard[_loc2_][_loc1_][0] == "-")
            {
               var _loc6_ = false;
               if(!isNaN(boardObject.tempBoard[_loc2_ - 1][_loc1_][0]))
               {
                  _loc6_ = true;
               }
               else if(!isNaN(boardObject.tempBoard[_loc2_ + 1][_loc1_][0]))
               {
                  _loc6_ = true;
               }
               else if(!isNaN(boardObject.tempBoard[_loc2_][_loc1_ + 1][0]))
               {
                  _loc6_ = true;
               }
               else if(!isNaN(boardObject.tempBoard[_loc2_][_loc1_ - 1][0]))
               {
                  _loc6_ = true;
               }
               else if(!isNaN(boardObject.tempBoard[_loc2_ - 1][_loc1_ - 1][0]))
               {
                  _loc6_ = true;
               }
               else if(!isNaN(boardObject.tempBoard[_loc2_ + 1][_loc1_ - 1][0]))
               {
                  _loc6_ = true;
               }
               else if(!isNaN(boardObject.tempBoard[_loc2_ - 1][_loc1_ + 1][0]))
               {
                  _loc6_ = true;
               }
               else if(!isNaN(boardObject.tempBoard[_loc2_ + 1][_loc1_ + 1][0]))
               {
                  _loc6_ = true;
               }
               if(_loc6_)
               {
                  subseqCardTypesTriedAtThisPosition = [];
                  var _loc5_ = 0;
                  while(_loc5_ < subseqThisPlayersCards.length)
                  {
                     if(subseqThisPlayersCards[_loc5_] > 0)
                     {
                        var _loc8_ = false;
                        var _loc3_ = 0;
                        while(_loc3_ < subseqCardTypesTriedAtThisPosition.length)
                        {
                           if(subseqCardTypesTriedAtThisPosition[_loc3_] == subseqThisPlayersCards[_loc5_])
                           {
                              _loc8_ = true;
                              break;
                           }
                           _loc3_ = _loc3_ + 1;
                        }
                        if(!_loc8_)
                        {
                           subseqCardTypesTriedAtThisPosition.push(subseqThisPlayersCards[_loc5_]);
                           boardObject.subseqOpponentCardsFlipped = 0;
                           boardObject.subseqTempBoard = new Array();
                           _loc3_ = 0;
                           while(_loc3_ < boardObject.tempBoard.length)
                           {
                              boardObject.subseqTempBoard[_loc3_] = new Array();
                              var _loc4_ = 0;
                              while(_loc4_ < boardObject.tempBoard[_loc3_].length)
                              {
                                 if(boardObject.tempBoard[_loc3_][_loc4_] == "X")
                                 {
                                    boardObject.subseqTempBoard[_loc3_][_loc4_] = "X";
                                 }
                                 else
                                 {
                                    boardObject.subseqTempBoard[_loc3_][_loc4_] = boardObject.tempBoard[_loc3_][_loc4_].slice();
                                 }
                                 _loc4_ = _loc4_ + 1;
                              }
                              _loc3_ = _loc3_ + 1;
                           }
                           boardObject.subseqTempBoard[_loc2_][_loc1_][0] = parseInt(subseqThisPlayersCards[_loc5_]);
                           boardObject.subseqTempBoard[_loc2_][_loc1_][1] = subseqWhichPlayer;
                           checkSubseqPlayerAttack(_loc2_,_loc1_,-1,0);
                           checkSubseqPlayerAttack(_loc2_,_loc1_,1,0);
                           checkSubseqPlayerAttack(_loc2_,_loc1_,0,-1);
                           checkSubseqPlayerAttack(_loc2_,_loc1_,0,1);
                           checkSubseqPlayerAttack(_loc2_,_loc1_,-1,-1);
                           checkSubseqPlayerAttack(_loc2_,_loc1_,1,1);
                           checkSubseqPlayerAttack(_loc2_,_loc1_,-1,1);
                           checkSubseqPlayerAttack(_loc2_,_loc1_,1,-1);
                           if(boardObject.subseqOpponentCardsFlipped > 0)
                           {
                              if(boardObject.subseqOpponentCardsFlipped == _loc9_)
                              {
                                 bestImmediatePlayerMove.push([_loc2_,_loc1_]);
                              }
                              else if(boardObject.subseqOpponentCardsFlipped > _loc9_)
                              {
                                 bestImmediatePlayerMove = [[_loc2_,_loc1_]];
                                 _loc9_ = boardObject.subseqOpponentCardsFlipped;
                              }
                           }
                        }
                     }
                     _loc5_ = _loc5_ + 1;
                  }
               }
            }
         }
         _loc1_ = _loc1_ + 1;
      }
      _loc2_ = _loc2_ + 1;
   }
   if(_loc9_ == -99999999)
   {
      _loc9_ = 0;
   }
   return _loc9_;
}
function checkAIAttack(placedTileX, placedTileY, xDir, yDir)
{
   var _loc4_ = 0;
   var _loc3_ = [];
   var _loc1_ = placedTileX + xDir;
   var _loc2_ = placedTileY + yDir;
   while(boardObject.tempBoard[_loc1_][_loc2_][1] == 1)
   {
      _loc3_.push([_loc1_,_loc2_]);
      _loc4_ = _loc4_ + getCardDetails(boardObject.tempBoard[_loc1_][_loc2_][0],"def");
      _loc1_ = _loc1_ + xDir;
      _loc2_ = _loc2_ + yDir;
   }
   var _loc7_ = getCardDetails(boardObject.tempBoard[placedTileX][placedTileY][0],"att");
   if(boardObject.tempBoard[_loc1_][_loc2_][1] == 2)
   {
      var _loc8_ = getCardDetails(boardObject.tempBoard[_loc1_][_loc2_][0],"att");
      if(_loc7_ + _loc8_ >= _loc4_)
      {
         boardObject.opponentCardsFlipped = boardObject.opponentCardsFlipped + _loc3_.length;
         i = 0;
         while(i < _loc3_.length)
         {
            boardObject.tempBoard[_loc3_[i][0]][_loc3_[i][1]][1] = 2;
            i++;
         }
      }
   }
}
function checkSubseqPlayerAttack(placedTileX, placedTileY, xDir, yDir)
{
   var _loc3_ = 0;
   var _loc4_ = 0;
   var _loc1_ = placedTileX + xDir;
   var _loc2_ = placedTileY + yDir;
   while(boardObject.subseqTempBoard[_loc1_][_loc2_][1] == 2)
   {
      _loc4_ = _loc4_ + 1;
      _loc3_ = _loc3_ + getCardDetails(boardObject.subseqTempBoard[_loc1_][_loc2_][0],"def");
      _loc1_ = _loc1_ + xDir;
      _loc2_ = _loc2_ + yDir;
   }
   var _loc7_ = getCardDetails(boardObject.subseqTempBoard[placedTileX][placedTileY][0],"att");
   if(boardObject.subseqTempBoard[_loc1_][_loc2_][1] == 1)
   {
      var _loc8_ = getCardDetails(boardObject.subseqTempBoard[_loc1_][_loc2_][0],"att");
      if(_loc7_ + _loc8_ >= _loc3_)
      {
         boardObject.subseqOpponentCardsFlipped = boardObject.subseqOpponentCardsFlipped + _loc4_;
      }
   }
}
function gameOver()
{
   var _loc4_ = 0;
   var _loc3_ = 0;
   var _loc2_ = 0;
   while(_loc2_ < boardObject.board.length)
   {
      var _loc1_ = 0;
      while(_loc1_ < boardObject.board[_loc2_].length)
      {
         if(boardObject.board[_loc2_][_loc1_][1] == 1)
         {
            _loc4_ = _loc4_ + 1;
         }
         else if(boardObject.board[_loc2_][_loc1_][1] == 2)
         {
            _loc3_ = _loc3_ + 1;
         }
         _loc1_ = _loc1_ + 1;
      }
      _loc2_ = _loc2_ + 1;
   }
   if(_loc4_ == _loc3_)
   {
      outcome.gotoAndPlay("draw");
   }
   else if(boardObject.computerOpponent)
   {
      if(_loc4_ > _loc3_)
      {
         outcome.gotoAndPlay("player1Single");
      }
      else
      {
         outcome.gotoAndPlay("player2Single");
      }
   }
   else if(_loc4_ > _loc3_)
   {
      outcome.gotoAndPlay("player1");
   }
   else
   {
      outcome.gotoAndPlay("player2");
   }
}
function afterGame()
{
   trace("clean up etc");
   trace("core will detail ");
   if(boardObject.winningPlayer == 1)
   {
      trace("received");
   }
   else
   {
      trace("lost");
   }
   trace(boardObject.cardsAvailable[boardObject.winCardTypeSelected][2] + " card");
   cleanUpAfterGame();
}
function cleanUpAfterGame()
{
   delete animationController.onEnterFrame;
   delete boardObject;
}
function pickWonCard(whichPlayerLost)
{
   cardPickerHolder._visible = true;
   boardObject.winCardSelected = -1;
   boardObject.winCardTypeSelected = -1;
   if(whichPlayerLost == 1)
   {
      boardObject.winningPlayer = 2;
   }
   else
   {
      boardObject.winningPlayer = 1;
   }
   boardObject.losingPlayer = whichPlayerLost;
   boardObject.boardBlurAmount = 0;
   boardObject.boardBlur = new flash.filters.BlurFilter(0,0,2);
   boardObject.cardsAvailableToBePicked = [];
   boardObject.cardsCaptured = 0;
   cardPickerOffsetX = cardPickerHolder._x - boardContainer._x;
   cardPickerOffsetY = cardPickerHolder._y - boardContainer._y;
   var _loc5_ = 0;
   while(_loc5_ < boardObject.board.length)
   {
      var _loc1_ = 0;
      while(_loc1_ < boardObject.board[_loc5_].length)
      {
         if(boardObject.board[_loc5_][_loc1_][1] != whichPlayerLost)
         {
            if(boardObject.whoOwnedCard[_loc5_][_loc1_] == whichPlayerLost)
            {
               var _loc2_ = boardObject.board[_loc5_][_loc1_][0];
               boardObject.cardsAvailableToBePicked.push(_loc2_);
               boardContainer["placed_card_" + _loc5_ + "_" + _loc1_]._visible = false;
               cardPickerHolder.cardPicker.attachMovie("gameCards","placed_card_" + boardObject.cardsCaptured,cardPickerHolder.cardPicker.getNextHighestDepth());
               cardPickerHolder.cardPicker["placed_card_" + boardObject.cardsCaptured].gotoAndStop(_loc2_);
               cardPickerHolder.cardPicker["placed_card_" + boardObject.cardsCaptured].cardBG.gotoAndStop("player" + whichPlayerLost);
               cardPickerHolder.cardPicker["placed_card_" + boardObject.cardsCaptured]._x = boardContainer["placed_card_" + _loc5_ + "_" + _loc1_]._x - cardPickerOffsetX;
               cardPickerHolder.cardPicker["placed_card_" + boardObject.cardsCaptured]._y = boardContainer["placed_card_" + _loc5_ + "_" + _loc1_]._y - cardPickerOffsetY;
               cardPickerHolder.cardPicker["placed_card_" + boardObject.cardsCaptured].cardRef = _loc2_;
               cardPickerHolder.cardPicker["placed_card_" + boardObject.cardsCaptured].playersCardRef = boardObject.cardsCaptured;
               boardObject.cardsCaptured = boardObject.cardsCaptured + 1;
            }
         }
         _loc1_ = _loc1_ + 1;
      }
      _loc5_ = _loc5_ + 1;
   }
   var _loc3_ = 85;
   boardObject.cardsMoving = new Array();
   _loc5_ = 0;
   while(_loc5_ < boardObject.cardsAvailableToBePicked.length)
   {
      boardObject.cardsMoving.push("1");
      if(boardObject.cardsAvailableToBePicked.length < 7)
      {
         cardPickerHolder.cardPicker["placed_card_" + _loc5_].destX = _loc3_ * _loc5_ + (900 - _loc3_ * boardObject.cardsAvailableToBePicked.length) / 2 + cardPickerHolder._x;
         cardPickerHolder.cardPicker["placed_card_" + _loc5_].destY = 100;
      }
      else
      {
         var _loc6_ = Math.floor(boardObject.cardsAvailableToBePicked.length / 2);
         var _loc7_ = Math.ceil(boardObject.cardsAvailableToBePicked.length / 2);
         if(_loc5_ < _loc6_)
         {
            cardPickerHolder.cardPicker["placed_card_" + _loc5_].destX = _loc3_ * _loc5_ + (900 - _loc3_ * _loc6_) / 2 + cardPickerHolder._x;
            cardPickerHolder.cardPicker["placed_card_" + _loc5_].destY = 60;
         }
         else
         {
            cardPickerHolder.cardPicker["placed_card_" + _loc5_].destX = _loc3_ * (_loc5_ - _loc6_) + (900 - _loc3_ * _loc7_) / 2 + cardPickerHolder._x;
            cardPickerHolder.cardPicker["placed_card_" + _loc5_].destY = 170;
         }
      }
      _loc5_ = _loc5_ + 1;
   }
   animationController.onEnterFrame = function()
   {
      if(boardObject.boardBlurAmount < 20)
      {
         boardObject.boardBlurAmount = boardObject.boardBlurAmount + 1;
         boardObject.boardBlur.blurX = boardObject.boardBlurAmount;
         boardObject.boardBlur.blurY = boardObject.boardBlurAmount;
         boardContainer.filters = [boardObject.boardBlur];
      }
      var _loc2_ = 0;
      while(_loc2_ < boardObject.cardsAvailableToBePicked.length)
      {
         var _loc1_ = cardPickerHolder.cardPicker["placed_card_" + _loc2_];
         _loc1_._x = _loc1_._x - (_loc1_._x - _loc1_.destX) * 0.2;
         _loc1_._y = _loc1_._y - (_loc1_._y - _loc1_.destY) * 0.2;
         if(Math.abs(_loc1_._x - _loc1_.destX) < 6)
         {
            if(Math.abs(_loc1_._y - _loc1_.destY) < 6)
            {
               _loc1_._x = _loc1_.destX;
               _loc1_._y = _loc1_.destY;
               boardObject.cardsMoving[_loc2_] = "0";
            }
         }
         if(boardObject.cardsMoving.join(",").indexOf("1") == -1)
         {
            delete animationController.onEnterFrame;
            playerCanSelectCards();
         }
         _loc2_ = _loc2_ + 1;
      }
   };
}
function playerCanSelectCards()
{
   if(!(boardObject.computerOpponent && boardObject.winningPlayer == 2))
   {
      var _loc3_ = 0;
      while(_loc3_ < boardObject.cardsAvailableToBePicked.length)
      {
         cardPickerHolder.cardPicker["placed_card_" + _loc3_].onRelease = selectCardToWin;
         cardPickerHolder.cardPicker["placed_card_" + _loc3_].onRollOver = showTooltip;
         cardPickerHolder.cardPicker["placed_card_" + _loc3_].onRollOut = hideTooltip;
         animationController.onEnterFrame = function()
         {
            cardTooltip._x = _xmouse + 10;
            cardTooltip._y = _ymouse;
         };
         _loc3_ = _loc3_ + 1;
      }
   }
   else
   {
      var _loc1_ = [[-99999999]];
      _loc3_ = 0;
      while(_loc3_ < boardObject.cardsAvailableToBePicked.length)
      {
         var _loc2_ = boardObject.cardsAvailable[[boardObject.cardsAvailableToBePicked[_loc3_]][0]][0] * boardObject.cardsAvailable[[boardObject.cardsAvailableToBePicked[_loc3_]][0]][0] + boardObject.cardsAvailable[[boardObject.cardsAvailableToBePicked[_loc3_]][0]][1] * boardObject.cardsAvailable[[boardObject.cardsAvailableToBePicked[_loc3_]][0]][1];
         q = 0;
         while(q < _loc1_.length)
         {
            if(_loc2_ > _loc1_[q][0])
            {
               _loc1_.splice(q,0,[_loc2_,[boardObject.cardsAvailableToBePicked[_loc3_]]]);
               break;
            }
            if(_loc2_ == _loc1_[q][0])
            {
               _loc1_[q][1].push(boardObject.cardsAvailableToBePicked[_loc3_]);
               break;
            }
            q++;
         }
         if(_loc2_ < _loc1_[_loc1_.length - 1][0])
         {
            _loc1_.push([_loc2_,[boardObject.cardsAvailableToBePicked[_loc3_]]]);
         }
         _loc3_ = _loc3_ + 1;
      }
      if(_loc1_[_loc1_.length - 1][0] == -99999999)
      {
         _loc1_.pop();
      }
      boardObject.sortedCardsArray = [];
      _loc3_ = 0;
      while(_loc3_ < _loc1_.length)
      {
         var _loc4_ = _loc1_[_loc3_][1];
         boardObject.sortedCardsArray = boardObject.sortedCardsArray.concat(_loc4_);
         _loc3_ = _loc3_ + 1;
      }
      var _loc6_ = _loc1_[0][1].length;
      if(_loc1_[1][1].length > 0)
      {
         _loc6_ = _loc6_ + _loc1_[1][1].length;
      }
      var _loc5_ = Math.floor(Math.random() * _loc6_);
      boardObject.winCardSelected = _loc5_;
      boardObject.winCardTypeSelected = cardPickerHolder.cardPicker["placed_card_" + _loc5_].cardRef;
      cardPickerHolder.cardPicker["placed_card_" + _loc5_].cardBG.gotoAndStop("player" + boardObject.winningPlayer);
      cardPickerHolder.chooseCardButton._visible = false;
      pickedCardAnimation();
   }
}
function showTooltip()
{
   cardTooltip.cardText.text = boardObject.cardsAvailable[this.cardRef][2];
   cardTooltip._visible = true;
}
function hideTooltip()
{
   cardTooltip._visible = false;
}
function confirmCardPicked()
{
   if(boardObject.winCardSelected == -1)
   {
      confirmMessage = "you haven\'t selected a card. is this ok?";
   }
   else
   {
      confirmMessage = "select \'" + boardObject.cardsAvailable[boardObject.winCardTypeSelected][2] + "\' card?";
   }
   cardPickerHolder.popUp.outputMessage.text = confirmMessage;
   cardPickerHolder.popUp._visible = true;
}
function pickedCardAnimation()
{
   cardPickerHolder.popUp._visible = false;
   animationController.onEnterFrame = function()
   {
      if(cardPickerHolder.cardPicker["placed_card_" + boardObject.winCardSelected]._alpha <= 0)
      {
         delete animationController.onEnterFrame;
         afterGame();
      }
      else
      {
         cardPickerHolder.cardPicker["placed_card_" + boardObject.winCardSelected]._width = cardPickerHolder.cardPicker["placed_card_" + boardObject.winCardSelected]._width * 1.1;
         cardPickerHolder.cardPicker["placed_card_" + boardObject.winCardSelected]._height = cardPickerHolder.cardPicker["placed_card_" + boardObject.winCardSelected]._height * 1.1;
         cardPickerHolder.cardPicker["placed_card_" + boardObject.winCardSelected]._alpha = cardPickerHolder.cardPicker["placed_card_" + boardObject.winCardSelected]._alpha - 10;
      }
   };
}
function popupResponse(responseType)
{
   if(responseType == "yes")
   {
      delete animationController.onEnterFrame;
      if(boardObject.winCardSelected == -1)
      {
         afterGame();
      }
      else
      {
         if(boardObject.computerOpponent)
         {
            if(boardObject.winningPlayer == 1)
            {
               var _loc2_ = false;
               var _loc1_ = 0;
               while(_loc1_ < thisNPCsUniqueCards.length)
               {
                  if(thisNPCsUniqueCards[_loc1_] == boardObject.winCardTypeSelected)
                  {
                     _loc2_ = true;
                     break;
                  }
                  _loc1_ = _loc1_ + 1;
               }
               if(_loc2_)
               {
               }
            }
         }
         pickedCardAnimation();
      }
   }
   else
   {
      cardPickerHolder.popUp._visible = false;
      cardPickerHolder.cardPicker["placed_card_" + boardObject.winCardSelected].cardBG.gotoAndStop("player" + boardObject.losingPlayer);
      boardObject.winCardSelected = -1;
      boardObject.winCardTypeSelected = -1;
   }
}
function selectCardToWin()
{
   this._parent["placed_card_" + boardObject.winCardSelected].cardBG.gotoAndStop("player" + boardObject.losingPlayer);
   boardObject.winCardSelected = this.playersCardRef;
   boardObject.winCardTypeSelected = this.cardRef;
   this.cardBG.gotoAndStop("player" + boardObject.winningPlayer);
}
cardGameInit();
playerChooseCards(1);
playerChooseCards(2);
stop();
