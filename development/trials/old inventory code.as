/*
						
						// --- check that the current slot is valid and has something in it, and display details if so
						if ((this[overarray][highlightcurrent][0] != "1") && (highlightcurrent<(parseInt(setsopen[currentset][1])))) {
						// check if the current over slot if the slot that has been clicked and being moved, if so, don't display anything:
						if ((inventoryclickedset == currentset) && (highlightcurrent == inventoryclicked)) {
						// display nothing;
						gamedisplay.inventorysets.outputtitle = "";
						gamedisplay.inventorysets.outputdescription = "";
						} else {
						// check if the current over is the workshop:
						if (overarray == "currentplans") {
						gamedisplay.inventorysets.outputtitle = inventoryitems[parseInt(this[overarray][highlightcurrent+1])][0];
						// determine this plan's requirements:
						var reqarray:Array = (inventoryitems[parseInt(this[overarray][highlightcurrent+1])][6]).split("/");
						reqstring = "requires: ";
						var tempreqarray = new Array();
						for (var i = 0; i<reqarray.length; i++) {
						// check for money being a requirement:
						if (reqarray[i].indexOf("£") != -1) {
						reqstring += parseMoney(parseInt(reqarray[i]))+", ";
						} else {
						tempreqarray = reqarray[i].split(".");
						reqstring += tempreqarray[0]+"x "+inventoryitems[parseInt(tempreqarray[1])][0]+", ";
						}
						}
						// remove final ", "
						reqstring = reqstring.substring(0, reqstring.length-2);
						gamedisplay.inventorysets.outputdescription = inventoryitems[parseInt(this[overarray][highlightcurrent+1])][1]+"\n"+reqstring;
						} else {
						// --- gamedisplay.inventorysets.outputtitle = inventoryitems[(parseInt(this[overarray][highlightcurrent][0]))][0];
						// check if shop is open and display sale price if so
						var saleprice:String = "";
						if (shopisopen) {
						// check if the current over is the shop:
						if (overarray == "shopcontents") {
						saleprice = "\nBuy 1 for "+gamedisplay.inventorysets[setsopen[currentset][0]]["slot"+highlightcurrent].quan.text;
						} else {
						var itemcode:String = inventoryitems[parseInt(this[overarray][highlightcurrent][0])][2];
						// check if the item is a quest item:
						if (itemcode.indexOf("q") != -1) {
						saleprice = "\nThis is a quest item and cannot be sold";
						} else {
						var thisslotquantity:Number = parseInt(this[overarray][highlightcurrent][1]);
						var costofitem:Number = parseInt(itemcode);
						// check if shop is a specialist shop:
						if (itemcode.indexOf(scrollclip.shoptype[storeOwner]) != -1) {
						costofitem = mfloor(costofitem*specialistsell);
						} else {
						// normal sale price:
						costofitem = mfloor(costofitem*salemodifier);
						}
						if (costofitem<1) {
						costofitem = 1;
						}
						costofitem *= thisslotquantity;
						moneystring = parseMoney(costofitem);
						saleprice = "\nSell "+thisslotquantity+" for "+moneystring;
						}
						}
						}
						gamedisplay.inventorysets.outputdescription = inventoryitems[(parseInt(this[overarray][highlightcurrent][0]))][1]+saleprice;
						}
						}
						} else {
						// display nothing;
						gamedisplay.inventorysets.outputtitle = "";
						gamedisplay.inventorysets.outputdescription = "";
						} 
						
						*/
						//
						/* if (whichkeyreleased == keyaction) {
						// check that a quantity isn't being entered:
						if (!(waitingfornumericinput)) {
						// action pressed
						if (inventoryclicked == -1) {
						// check that clicked slot is valid:
						if (highlightcurrent<(parseInt(setsopen[currentset][1]))) {
						// check if the current set clicked is the shop
						if (overarray == "shopcontents") {
						// check the player has enough money:
						shopitemtype = parseInt(shopcontents[highlightcurrent][0]);
						var itempricecode:String = inventoryitems[shopitemtype][2];
						var itemprice:Number = parseInt(itempricecode);
						// only buying one item with single click:
						purchasequantity = 1;
						// check if shop is a specialist shop:
						if (itempricecode.indexOf(scrollclip.shoptype[storeOwner]) != -1) {
						itemprice = mfloor(itemprice*specialistbuy);
						}
						if (itemprice<1) {
						itemprice = 1;
						}
						purchaseprice = itemprice;
						if (money<itemprice) {
						displaytext("Not enough money for this item", -1, false);
						} else if (canadditemtoinventory(shopitemtype, purchasequantity) == purchasequantity) {
						// confirm purchase:
						waitingforresponse = 1;
						confirmingItemPurchase = true;
						gamedisplay.responsebox.choice1 = "yes - buy";
						gamedisplay.responsebox.choice2 = "no - don't buy";
						displaytext("Buy 1x "+inventoryitems[(parseInt(this[overarray][highlightcurrent][0]))][0]+" for "+gamedisplay.inventorysets.ishop["slot"+highlightcurrent].quan.text+"?", -1, false);
						} else {
						displaytext("Not enough room for this item", -1, false);
						}
						} else if (overarray == "currentplans") {
						// determine this plan's requirements:
						makeitemreqarray = (inventoryitems[parseInt(this[overarray][highlightcurrent+1])][6]).split("/");
						meetsrequirements = true;
						var itemFailedOn:String = "";
						var tempreqarray:Array = new Array();
						for (var i = 0; i<makeitemreqarray.length; i++) {
						// check for money being a requirement:
						if (reqarray[i].indexOf("£") != -1) {
						if (money<parseInt(makeitemreqarray[i])) {
						meetsrequirements = false;
						itemFailedOn = "money";
						}
						} else {
						tempreqarray = (makeitemreqarray[i]).split(".");
						if (!hasgotitem(parseInt(tempreqarray[1]), parseInt(tempreqarray[0]))) {
						itemFailedOn = inventoryitems[parseInt(tempreqarray[1])][0];
						meetsrequirements = false;
						}
						}
						}
						if (meetsrequirements) {
						// confirm making item:
						waitingforresponse = 1;
						gamedisplay.responsebox.choice1 = "yes - make";
						gamedisplay.responsebox.choice2 = "no - don't make";
						confirmingMakeItem = true;
						displaytext("have this item made ("+reqstring+")?", -1, false);
						} else {
						displaytext("Don't have enough "+itemFailedOn, -1, false);
						}
						} else {
						beingmovedgraphic = parseInt(this[overarray][highlightcurrent][0]);
						// check that it isn't empty:
						if (beingmovedgraphic != 1) {
						inventoryclicked = highlightcurrent;
						inventoryclickedset = currentset;
						firstarray = overarray;
						//
						// store details of element being moved:
						beingmovedquantity = parseInt(this[firstarray][inventoryclicked][1]);
						// --- gamedisplay.inventorysets.highlightbox.beingmoved.contents.gotoAndStop(beingmovedgraphic);
						// if the slot being copied contains money, then copy the quantity from the original slot:
						if (inventoryitems[(parseInt(this[overarray][highlightcurrent][0]))][2] == "£") {
						// --- gamedisplay.inventorysets.highlightbox.beingmoved.quan.text = gamedisplay.inventorysets[setsopen[currentset][0]]["slot"+highlightcurrent].quan.text;
						} else {
						// --- gamedisplay.inventorysets.highlightbox.beingmoved.quan.text = beingmovedquantity;
						}
						// show slot on highlightbox:
						// --- gamedisplay.inventorysets.highlightbox.beingmoved._visible = true;
						// hide graphic in original slot - but doesn't change the array in any way so it can be restored:
						gamedisplay.inventorysets[setsopen[inventoryclickedset][0]]["slot"+inventoryclicked].contents.gotoAndStop(1);
						gamedisplay.inventorysets[setsopen[inventoryclickedset][0]]["slot"+inventoryclicked].quan.text = " ";
						}
						}
						}
						} else {
						// make sure the target panel isn't the workshop
						if (overarray != "currentplans") {
						// check if the target panel is the shop 
						if (overarray == "shopcontents") {
						// check if the item being moved is a quest item:
						if ((inventoryitems[parseInt(this[firstarray][inventoryclicked][0])][2]).indexOf("q") != -1) {
						displaytext("This is a quest item and cannot be sold", -1, false);
						} else {
						// confirm sale:
						waitingforresponse = 1;
						gamedisplay.responsebox.choice1 = "yes - sell";
						gamedisplay.responsebox.choice2 = "no - don't sell";
						confirmingItemSale = true;
						var itemcode:String = inventoryitems[parseInt(this[firstarray][inventoryclicked][0])][2];
						// if splitting by quantity, get the sale quantity from that, otherwise from the slot's quantity
						if (quantitysplit) {
						var thisslotquantity:Number = beingmovedquantity;
						} else {
						var thisslotquantity:Number = parseInt(this[firstarray][inventoryclicked][1]);
						}
						var costofitem:Number = parseInt(itemcode);
						// check if shop is a specialist shop:
						if (itemcode.indexOf(scrollclip.shoptype[storeOwner]) != -1) {
						costofitem = mfloor(costofitem*specialistsell);
						} else {
						// normal sale price:
						costofitem = mfloor(costofitem*salemodifier);
						}
						if (costofitem<1) {
						costofitem = 1;
						}
						costofitem *= thisslotquantity;
						sellingprice = costofitem;
						moneystring = parseMoney(costofitem);
						displaytext("Sell "+thisslotquantity+"x "+inventoryitems[(parseInt(this[firstarray][inventoryclicked][0]))][0]+" for "+moneystring+"?", -1, false);
						}
						} else {
						// check if current tile is the drop slot and if the current set isn't a chest:
						if (((((highlightcurrent)%setsopen[currentset][2]) == (setsopen[currentset][2]-1)) && (mfloor(highlightcurrent/setsopen[currentset][2]) == mfloor((setsopen[currentset][1])/setsopen[currentset][2]))) && (overarray != "chestarray")) {
						// check if the shop is open:
						if (shopisopen) {
						// check if it is a quest item:
						if ((inventoryitems[parseInt(this[firstarray][inventoryclicked][0])][2]).indexOf("q") != -1) {
						displaytext("This is a quest item and cannot be sold", -1, false);
						} else {
						// confirm sale:
						waitingforresponse = 1;
						gamedisplay.responsebox.choice1 = "yes - sell";
						gamedisplay.responsebox.choice2 = "no - don't sell";
						confirmingItemSale = true;
						var itemcode:String = inventoryitems[parseInt(this[firstarray][inventoryclicked][0])][2];
						// if splitting by quantity, get the sale quantity from that, otherwise from the slot's quantity
						if (quantitysplit) {
						var thisslotquantity:Number = beingmovedquantity;
						} else {
						var thisslotquantity:Number = parseInt(this[firstarray][inventoryclicked][1]);
						}
						var costofitem:Number = parseInt(itemcode);
						// check if shop is a specialist shop:
						if (itemcode.indexOf(scrollclip.shoptype[storeOwner]) != -1) {
						costofitem = mfloor(costofitem*specialistsell);
						} else {
						// normal sale price:
						costofitem = mfloor(costofitem*salemodifier);
						}
						if (costofitem<1) {
						costofitem = 1;
						}
						costofitem *= thisslotquantity;
						sellingprice = costofitem;
						moneystring = parseMoney(costofitem);
						displaytext("Sell "+thisslotquantity+"x "+inventoryitems[(parseInt(this[firstarray][inventoryclicked][0]))][0]+" for "+moneystring+"?", -1, false);
						}
						} else {
						// drop item code - moved to onRelease function
						}
						} else {
						// check that clicked slot is valid:
						if (highlightcurrent<(parseInt(setsopen[currentset][1]))) {
						// check to see if currently moved slot is money - and the current panel isn't the chest:
						if ((inventoryitems[(this[firstarray][inventoryclicked][0])][2] == "£") && (setsopen[currentset][0] != "ichest")) {
						// add money
						playsoundeffect("coins");
						money += beingmovedquantity;
						updatemoney();
						// empty original slot
						this[firstarray][inventoryclicked][0] = "1";
						} else {
						// check if target element is of the same type as the first element
						if (this[overarray][highlightcurrent][0] == this[firstarray][inventoryclicked][0]) {
						// check that it's not the same slot!
						if (!((currentset == inventoryclickedset) && (highlightcurrent == inventoryclicked))) {
						// add first element's quantity to current element's (if total is less than maximum allowed):
						if (quantitysplit) {
						var combinedtotal:Number = (parseInt(this[overarray][highlightcurrent][1]))+beingmovedquantity;
						} else {
						var combinedtotal:Number = (parseInt(this[overarray][highlightcurrent][1]))+(parseInt(this[firstarray][inventoryclicked][1]));
						}
						if (combinedtotal<=maxitemsperslot) {
						if (!(quantitysplit)) {
						// make first element empty:
						this[firstarray][inventoryclicked][0] = "1";
						this[overarray][highlightcurrent][1] = combinedtotal;
						} else {
						this[firstarray][inventoryclicked][1] = quantityavailable-beingmovedquantity;
						this[overarray][highlightcurrent][1] = combinedtotal;
						if ((quantityavailable-beingmovedquantity) == 0) {
						// the remaining quantity is zero, so clear the original slot:
						this[firstarray][inventoryclicked][0] = "1";
						}
						}
						} else {
						// make first element's quantity be the remainder:
						if (quantitysplit) {
						this[firstarray][inventoryclicked][1] = (combinedtotal-maxitemsperslot)+(quantityavailable-beingmovedquantity);
						} else {
						this[firstarray][inventoryclicked][1] = combinedtotal-maxitemsperslot;
						}
						this[overarray][highlightcurrent][1] = maxitemsperslot;
						}
						}
						} else {
						// check to see if the items can be combined:
						var firstCombine:Number = this[firstarray][inventoryclicked][0];
						var secondCombine:Number = this[overarray][highlightcurrent][0];
						combinedItem = -1;
						for (var i = 0; i<combineTable.length; i++) {
						if (combineTable[i][0] == firstCombine) {
						if (combineTable[i][1] == secondCombine) {
						combinedItem = combineTable[i][2];
						break;
						}
						} else if (combineTable[i][1] == firstCombine) {
						if (combineTable[i][0] == secondCombine) {
						combinedItem = combineTable[i][2];
						break;
						}
						}
						}
						if (combinedItem != -1) {
						// produce combined item
						if (!(quantitysplit) || (beingmovedquantity == this[firstarray][inventoryclicked][1])) {
						// to ensure there's going to be an empty slot for the combined item (full slot has been moved)
						if (this[firstarray][inventoryclicked][1]<=this[overarray][highlightcurrent][1]) {
						// produce this[firstarray][inventoryclicked][1] number of items in the first slot:
						// as this will be empty now:
						firstslot = this[firstarray][inventoryclicked];
						slot1type = combinedItem;
						// this[firstarray][inventoryclicked][1] will always be the smaller number here
						slot1quan = this[firstarray][inventoryclicked][1];
						secondslot = this[overarray][highlightcurrent];
						slot2type = this[overarray][highlightcurrent][0];
						// reduce quantity of target slot:
						slot2quan = this[overarray][highlightcurrent][1]-this[firstarray][inventoryclicked][1];
						if (slot2quan == 0) {
						slot2type = 1;
						}
						slot3type = -1;
						// get confirmation of the combining:     
						waitingforresponse = 1;
						confirmingItemCombine = true;
						gamedisplay.responsebox.choice1 = "yes - combine";
						gamedisplay.responsebox.choice2 = "no - don't combine";
						displaytext("combine "+this[firstarray][inventoryclicked][1]+"x "+inventoryitems[(this[firstarray][inventoryclicked][0])][0]+" with "+this[firstarray][inventoryclicked][1]+"x "+inventoryitems[(this[overarray][highlightcurrent][0])][0]+" to make "+this[firstarray][inventoryclicked][1]+"x "+inventoryitems[combinedItem][0]+"?", -1, false);
						} else {
						// produce this[overarray][highlightcurrent][1] number of items in the second slot:
						// as this will be empty now:
						firstslot = this[overarray][highlightcurrent];
						slot1type = combinedItem;
						// this[overarray][highlightcurrent][1] will always be the smaller number here
						slot1quan = this[overarray][highlightcurrent][1];
						secondslot = this[firstarray][inventoryclicked];
						slot2type = this[firstarray][inventoryclicked][0];
						// reduce quantity of target slot:
						slot2quan = this[firstarray][inventoryclicked][1]-this[overarray][highlightcurrent][1];
						if (slot2quan == 0) {
						slot2type = 1;
						}
						slot3type = -1;
						// get confirmation of the combining:     
						waitingforresponse = 1;
						confirmingItemCombine = true;
						gamedisplay.responsebox.choice1 = "yes - combine";
						gamedisplay.responsebox.choice2 = "no - don't combine";
						displaytext("combine "+this[overarray][highlightcurrent][1]+"x "+inventoryitems[(this[firstarray][inventoryclicked][0])][0]+" with "+this[overarray][highlightcurrent][1]+"x "+inventoryitems[(this[overarray][highlightcurrent][0])][0]+" to make "+this[overarray][highlightcurrent][1]+"x "+inventoryitems[combinedItem][0]+"?", -1, false);
						}
						} else {
						// need to see if the combined item could be added to the inventory:
						var quantitytobecombined:Number;
						if (beingmovedquantity<=this[overarray][highlightcurrent][1]) {
						quantitytobecombined = beingmovedquantity;
						} else {
						quantitytobecombined = this[overarray][highlightcurrent][1];
						}
						var amountthatcanbeadded:Number = canadditemtoinventory(combinedItem, quantitytobecombined);
						if (amountthatcanbeadded == quantitytobecombined) {
						// is space for the new item
						firstslot = this[firstarray][inventoryclicked];
						slot1type = this[firstarray][inventoryclicked][0];
						slot1quan = this[firstarray][inventoryclicked][1]-quantitytobecombined;
						if (slot1quan == 0) {
						slot1type = 1;
						}
						secondslot = this[overarray][highlightcurrent];
						slot2type = this[overarray][highlightcurrent][0];
						slot2quan = this[overarray][highlightcurrent][1]-quantitytobecombined;
						if (slot2quan == 0) {
						slot2type = 1;
						}
						slot3type = combinedItem;
						slot3quan = quantitytobecombined;
						// get confirmation of the combining:    
						waitingforresponse = 1;
						confirmingItemCombine = true;
						gamedisplay.responsebox.choice1 = "yes - combine";
						gamedisplay.responsebox.choice2 = "no - don't combine";
						displaytext("combine "+quantitytobecombined+"x "+inventoryitems[(this[firstarray][inventoryclicked][0])][0]+" with "+quantitytobecombined+"x "+inventoryitems[(this[overarray][highlightcurrent][0])][0]+" to make "+quantitytobecombined+"x "+inventoryitems[combinedItem][0]+"?", -1, false);
						} else {
						// no room for the item:
						displaytext("no room in inventory to combine "+quantitytobecombined+"x "+inventoryitems[(this[firstarray][inventoryclicked][0])][0]+" with "+quantitytobecombined+"x "+inventoryitems[(this[overarray][highlightcurrent][0])][0]+" to make "+quantitytobecombined+"x "+inventoryitems[combinedItem][0], -1, false);
						}
						}
						} else {
						// swap slots
						if (!(quantitysplit)) {
						// can't swap slots with a split quantity
						//
						// check if the target for the swap is money and the original slot wasn't another item in the chest
						if ((inventoryitems[(this[overarray][highlightcurrent][0])][2] == "£") && (setsopen[inventoryclickedset][0] != "ichest")) {
						// add money
						playsoundeffect("coins");
						money += parseInt(this[overarray][highlightcurrent][1]);
						updatemoney();
						this[overarray][highlightcurrent] = this[firstarray][inventoryclicked];
						// empty money slot
						this[firstarray][inventoryclicked] = ["1", 0];
						} else {
						savedcurrentelement = this[overarray][highlightcurrent];
						this[overarray][highlightcurrent] = this[firstarray][inventoryclicked];
						this[firstarray][inventoryclicked] = savedcurrentelement;
						}
						} else {
						// check if target slot is empty, if so, then add moved item to array:
						if (this[overarray][highlightcurrent][0] == "1") {
						this[overarray][highlightcurrent][0] = this[firstarray][inventoryclicked][0];
						this[overarray][highlightcurrent][1] = beingmovedquantity;
						if (quantityavailable-beingmovedquantity == 0) {
						// make the first slot empty if all of the quantity available was moved:
						this[firstarray][inventoryclicked][0] = "1";
						} else {
						// reduce quantity of original slot:
						this[firstarray][inventoryclicked][1] = quantityavailable-beingmovedquantity;
						}
						}
						}
						}
						}
						// update visually:
						gamedisplay.inventorysets[setsopen[currentset][0]]["slot"+highlightcurrent].contents.gotoAndStop(parseInt(this[overarray][highlightcurrent][0]));
						if (inventoryitems[(this[overarray][highlightcurrent][0])][2] == "£") {
						// this slot has money in it - quantity needs to be displayed differently:
						var amountofsilvertoadd:Number = parseInt(this[overarray][highlightcurrent][1]);
						moneystring = parseMoney(amountofsilvertoadd);
						gamedisplay.inventorysets[setsopen[currentset][0]]["slot"+highlightcurrent].quan.text = moneystring;
						} else if (this[overarray][highlightcurrent][0] != "1") {
						gamedisplay.inventorysets[setsopen[currentset][0]]["slot"+highlightcurrent].quan.text = parseInt(this[overarray][highlightcurrent][1]);
						} else {
						gamedisplay.inventorysets[setsopen[currentset][0]]["slot"+highlightcurrent].quan.text = " ";
						}
						}
						}
						}
						}
						} else {
						// check to see if the item being moved is a plan:
						var planitemcode:String = inventoryitems[parseInt(this[firstarray][inventoryclicked][0])][2];
						if (planitemcode.indexOf("r") != -1) {
						// check to see if it's a plan of the type used in this workshop:
						if (inventoryitems[parseInt(this[firstarray][inventoryclicked][0])][0] == scrollclip.workshoptype) {
						// check if this plan is already in this workshop:
						var foundplan:Boolean = false;
						for (var i = 1; i<currentplans.length; i++) {
						if (parseInt(this[firstarray][inventoryclicked][0]) == currentplans[i]) {
						foundplan = true;
						break;
						}
						}
						if (!foundplan) {
						// remove this plan from inventory:
						this[firstarray][inventoryclicked][1]--;
						if (this[firstarray][inventoryclicked][1] == 0) {
						this[firstarray][inventoryclicked][0] = "1";
						}
						// populate inventory with current state:                                                                                                                                                                                                                                      
						for (var i = 0; i<currentbagsize; i++) {
						gamedisplay.inventorysets["iinv"]["slot"+i].contents.gotoAndStop(parseInt(inventory[i][0]));
						if (inventory[i][0] != "1") {
						gamedisplay.inventorysets["iinv"]["slot"+i].quan.text = parseInt(inventory[i][1]);
						} else {
						gamedisplay.inventorysets["iinv"]["slot"+i].quan.text = " ";
						}
						}
						// add the plan to the array:
						currentplans.push(parseInt(this[firstarray][inventoryclicked][0]));
						addtochanges([currentmapnumber, 5, 1, (parseInt(this[firstarray][inventoryclicked][0]))]);
						// populate workshop - ignore element[0] as this is the currently made item
						for (var i = 0; i<maximumnumberofslots; i++) {
						if ((i+1)<currentplans.length) {
						// show the player the graphic of what this plan will make:
						var planitemcode:String = (inventoryitems[parseInt(currentplans[i+1])][2]);
						var planitem:Number = parseInt(planitemcode.substring(planitemcode.indexOf("r")+1));
						gamedisplay.inventorysets.iworkshop["slot"+i].contents.gotoAndStop(planitem);
						// use i+1 because element[0] is for currently made item
						gamedisplay.inventorysets.iworkshop["slot"+i].quan.text = " ";
						gamedisplay.inventorysets.iworkshop["slot"+i]._visible = true;
						} else {
						gamedisplay.inventorysets.iworkshop["slot"+i]._visible = false;
						}
						}
						gamedisplay.inventorysets.iworkshop.backgroundblock._y = invtileheight*(mceil((currentplans.length-2)/numberofcolumns)-1);
						gamedisplay.inventorysets.iworkshop.borderrepeat._height = invtileheight*(mceil((currentplans.length-2)/numberofcolumns)-1);
						// update the number of slots in the array:
						for (var i = 0; i<setsopen.length; i++) {
						if (setsopen[i][0] == "iworkshop") {
						setsopen[i][1] = currentplans.length-1;
						break;
						}
						}
						} else {
						displaytext("That plan is already available here", -1, false);
						}
						} else {
						displaytext("That type plan is not used in this workshop", -1, false);
						}
						}
						}
						if (!((confirmingItemDrop) || (confirmingItemSale) || (confirmingItemCombine))) {
						// reset original:
						gamedisplay.inventorysets[setsopen[inventoryclickedset][0]]["slot"+inventoryclicked].contents.gotoAndStop(parseInt(this[firstarray][inventoryclicked][0]));
						if (inventoryitems[(this[firstarray][inventoryclicked][0])][2] == "£") {
						// this slot has money in it - quantity needs to be displayed differently:
						var amountofsilvertoadd:Number = parseInt(this[firstarray][inventoryclicked][1]);
						moneystring = parseMoney(amountofsilvertoadd);
						gamedisplay.inventorysets[setsopen[inventoryclickedset][0]]["slot"+inventoryclicked].quan.text = moneystring;
						} else if (this[firstarray][inventoryclicked][0] != "1") {
						gamedisplay.inventorysets[setsopen[inventoryclickedset][0]]["slot"+inventoryclicked].quan.text = parseInt(this[firstarray][inventoryclicked][1]);
						} else {
						gamedisplay.inventorysets[setsopen[inventoryclickedset][0]]["slot"+inventoryclicked].quan.text = " ";
						}
						// hide slot on highlightbox:
						// --- gamedisplay.inventorysets.highlightbox.beingmoved._visible = false;
						inventoryclicked = -1;
						//
						quantitysplit = false;
						}
						}
						}
						whichkeyreleased = 0;
						}
						*/
						//   
						/*
						if (whichkeyreleased == keysplit) {
						// Shift pressed - split quantity
						//
						// check if a slot is already being moved:
						if (inventoryclicked == -1) {
						// check it's a valid slot:
						if (highlightcurrent<(parseInt(setsopen[currentset][1]))) {
						beingmovedgraphic = parseInt(this[overarray][highlightcurrent][0]);
						// check that it isn't empty:
						if (beingmovedgraphic != 1) {
						// check if the quantity in this slot is only 1, if it is,
						// then just have this set as if CTRL had been pressed,
						// OR that the slot clicked is money and shouldn't be split:
						if ((parseInt(this[overarray][highlightcurrent][1]) == 1) || (inventoryitems[(parseInt(this[overarray][highlightcurrent][0]))][2] == "£")) {
						inventoryclicked = highlightcurrent;
						inventoryclickedset = currentset;
						firstarray = overarray;
						//
						// store details of element being moved:
						beingmovedquantity = parseInt(this[firstarray][inventoryclicked][1]);
						// --- gamedisplay.inventorysets.highlightbox.beingmoved.contents.gotoAndStop(beingmovedgraphic);
						// if the slot being copied contains money, then copy the quantity from the original slot:
						if (inventoryitems[(parseInt(this[overarray][highlightcurrent][0]))][2] == "£") {
						// --- gamedisplay.inventorysets.highlightbox.beingmoved.quan.text = gamedisplay.inventorysets[setsopen[currentset][0]]["slot"+highlightcurrent].quan.text;
						} else {
						// --- gamedisplay.inventorysets.highlightbox.beingmoved.quan.text = beingmovedquantity;
						}
						// show slot on highlightbox:
						// --- gamedisplay.inventorysets.highlightbox.beingmoved._visible = true;
						// hide graphic in original slot - but doesn't change the array in any way so it can be restored:
						gamedisplay.inventorysets[setsopen[inventoryclickedset][0]]["slot"+inventoryclicked].contents.gotoAndStop(1);
						gamedisplay.inventorysets[setsopen[inventoryclickedset][0]]["slot"+inventoryclicked].quan.text = " ";
						} else {
						// set flag to stop numeric key presses being acted upon to toggle sets
						waitingfornumericinput = true;
						// check if a slot is already highlighted:
						if (inventoryclicked != -1) {
						// reset original:
						gamedisplay.inventorysets[setsopen[inventoryclickedset][0]]["slot"+inventoryclicked].contents.gotoAndStop(parseInt(this[firstarray][inventoryclicked][0]));
						if (this[firstarray][inventoryclicked][0] != "1") {
						gamedisplay.inventorysets[setsopen[inventoryclickedset][0]]["slot"+inventoryclicked].quan.text = parseInt(this[firstarray][inventoryclicked][1]);
						} else {
						gamedisplay.inventorysets[setsopen[inventoryclickedset][0]]["slot"+inventoryclicked].quan.text = " ";
						}
						// hide slot on highlightbox:
						// --- gamedisplay.inventorysets.highlightbox.beingmoved._visible = false;
						inventoryclicked = -1;
						}
						// display quantity input                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
						inventoryclicked = highlightcurrent;
						inventoryclickedset = currentset;
						firstarray = overarray;
						// if the current panel is the shop, then maximum number of items if maxitemsperslot
						// otherwise, it's the number held in that slot:
						if (overarray == "shopcontents") {
						quantityavailable = maxitemsperslot;
						} else {
						quantityavailable = parseInt(this[firstarray][inventoryclicked][1]);
						}
						// --- gamedisplay.inventorysets.highlightbox.inputbox.range = "1 - "+quantityavailable;
						// --- gamedisplay.inventorysets.highlightbox.inputbox._visible = true;
						// set focus for input box:
						// --- Selection.setFocus("gamedisplay.inventorysets.highlightbox.inputbox.quantitybeingmoved");
						}
						}
						}
						}
						whichkeyreleased = 0;
						} */