function canAddItemToInventory(itemObj) {
    console.log(itemObj);
    // takes an array of objects and checks if all of them can be added before adding any of them
    // make copy of inventory:
    var inventoryClone = JSON.parse(JSON.stringify(hero.inventory));
    var slotsUpdated = [];
    var allItemsAdded = true;
    for (var k = 0; k < itemObj.length; k++) {
        var quantityAddedSoFar = 0;
        // check if this type exist in the current inventory:
        var inventoryKeysFound = getObjectKeysForInnerValue(inventoryClone, itemObj[k].type, "type");
        if (inventoryKeysFound.length > 0) {
            // loop through keysFound and add to the slot maximum
            for (var i = 0; i < inventoryKeysFound.length; i++) {
                if (itemAttributesMatch(inventoryClone[inventoryKeysFound[i]], itemObj[k])) {
                   
                    var quantityOnSlotAlready = inventoryClone[inventoryKeysFound[i]].quantity;
                    var amountAddedToThisSlot = (maxNumberOfItemsPerSlot - quantityOnSlotAlready) > (itemObj[k].quantity - quantityAddedSoFar) ? (itemObj[k].quantity - quantityAddedSoFar) : maxNumberOfItemsPerSlot - quantityOnSlotAlready;
                    quantityAddedSoFar += amountAddedToThisSlot;
                    // add item to this slot:
if(amountAddedToThisSlot>0) {
                    slotsUpdated.push((inventoryKeysFound[i]));
                    inventoryClone[inventoryKeysFound[i]].quantity += amountAddedToThisSlot;
                }
                    if (quantityAddedSoFar >= itemObj[k].quantity) {
                        break;
                    }
                }
            }
        }
        if (quantityAddedSoFar < itemObj[k].quantity) {
            // either filled all matching slots, or couldn't find any matching slots - find an empty slot
            outerLoop: for (var i = 0; i < hero.bags.length; i++) {
                var thisBagNumberOfSlots = currentActiveInventoryItems[hero.bags[i].type].actionValue;
                // loop through slots for each bag:
                for (var j = 0; j < thisBagNumberOfSlots; j++) {
                    var thisSlotsID = i + '-' + j;
                    if (!(thisSlotsID in inventoryClone)) {
                        // empty slot:
                        var amountAddedToThisSlot = maxNumberOfItemsPerSlot > (itemObj[k].quantity - quantityAddedSoFar) ? (itemObj[k].quantity - quantityAddedSoFar) : maxNumberOfItemsPerSlot;
                        quantityAddedSoFar += amountAddedToThisSlot;
                        // add item to this slot:
                        slotsUpdated.push(thisSlotsID);
                        inventoryClone[thisSlotsID] = new Object();
                        inventoryClone[thisSlotsID].type = itemObj[k].type;
                        inventoryClone[thisSlotsID].quantity = amountAddedToThisSlot;
                        inventoryClone[thisSlotsID].quality = itemObj[k].quality;
                        inventoryClone[thisSlotsID].durability = itemObj[k].durability;
                        inventoryClone[thisSlotsID].currentWear = itemObj[k].currentWear;
                        inventoryClone[thisSlotsID].effectiveness = itemObj[k].effectiveness;
                        inventoryClone[thisSlotsID].wrapped = itemObj[k].wrapped;
                        inventoryClone[thisSlotsID].colour = itemObj[k].colour;
                        inventoryClone[thisSlotsID].enchanted = itemObj[k].enchanted;
                        inventoryClone[thisSlotsID].hallmark = itemObj[k].hallmark;
                        inventoryClone[thisSlotsID].inscription = {};
                        inventoryClone[thisSlotsID].inscription.title = itemObj[k].inscription.title;
                        inventoryClone[thisSlotsID].inscription.content = itemObj[k].inscription.content;
                        if (quantityAddedSoFar >= itemObj[k].quantity) {
                            // stop both loops:
                            break outerLoop;
                        }
                    }
                }
            }
        }
        if (quantityAddedSoFar != itemObj[k].quantity) {
            allItemsAdded = false;
        }
    }
    if (allItemsAdded) {
        // make the active inventory be the same as the amended one:
        hero.inventory = JSON.parse(JSON.stringify(inventoryClone));
        // update panels if needed:
        UI.updateInscriptionPanel();
        // return success, and the slots that were affected:
        return [true, slotsUpdated];
    } else {
        // don't change the current inventory - return false:
        return [false];
    }
}


function hasItemInInventory(itemType, amountNeeded) {
    var quantityFound = 0;
    var inventoryKeysFound = getObjectKeysForInnerValue(hero.inventory, parseInt(itemType), "type");
    if (inventoryKeysFound.length > 0) {
        for (var i = 0; i < inventoryKeysFound.length; i++) {
            quantityFound += hero.inventory[inventoryKeysFound[i]].quantity;
        }
    }
    if (quantityFound >= amountNeeded) {
        return true;
    } else {
        return false;
    }
}


function findSlotItemIdInInventory(itemType) {
    var slotsFound = [];
    for (var key in hero.inventory) {
        if (hero.inventory[key].type == itemType) {
            slotsFound.push(key);
        }
    }
    return slotsFound;
}

function hasItemTypeInInventory(itemGroupType) {
    var slotsFound = [];
    for (var key in hero.inventory) {
        if (currentActiveInventoryItems[hero.inventory[key].type].group == itemGroupType) {
            slotsFound.push(key);
        }
    }
    return slotsFound;
}



function removeItemTypeFromInventory(itemType, amount) {
    var quantityStillToRemove = amount;
    var quantityAvailableOnThisSlot;
    var inventoryKeysFound = getObjectKeysForInnerValue(hero.inventory, parseInt(itemType), "type");
    if (inventoryKeysFound.length > 0) {
        for (var i = 0; i < inventoryKeysFound.length; i++) {
            quantityAvailableOnThisSlot = hero.inventory[inventoryKeysFound[i]].quantity;
            if (quantityAvailableOnThisSlot > quantityStillToRemove) {
                removeFromInventory((inventoryKeysFound[i]), quantityStillToRemove);
                quantityStillToRemove = 0;
            } else {
                removeFromInventory((inventoryKeysFound[i]), quantityAvailableOnThisSlot);
                quantityStillToRemove -= quantityAvailableOnThisSlot;
            }
        }
    }
}

function addToInventory(whichSlot, itemObject) {
    // make a copy not a reference:
    hero.inventory[whichSlot] = JSON.parse(JSON.stringify(itemObject));
    document.getElementById("slot" + whichSlot).innerHTML = generateSlotMarkup(whichSlot);
}

function removeFromInventory(whichSlot, amount) {
    var thisCurrentQuantity = hero.inventory[whichSlot].quantity;
    var thisSlotElem = document.getElementById("slot" + whichSlot);
    if (thisCurrentQuantity - amount > 0) {
        // just reduce quantity:
        hero.inventory[whichSlot].quantity -= amount;
    updateQuantity(whichSlot);
    } else {
        // remove the item:
        delete hero.inventory[whichSlot];
        // update visually:
        thisSlotElem.innerHTML = '';
    }
}

function updateQuantity(whichSlot) {
        // update visually:
        var thisSlotElem = document.getElementById("slot" + whichSlot);
        for (var i = 0; i < thisSlotElem.childNodes.length; i++) {
            if (thisSlotElem.childNodes[i].className == "qty") {
                thisSlotElem.childNodes[i].innerHTML = hero.inventory[whichSlot].quantity;
            }
            if (thisSlotElem.childNodes[i].nodeName == "P") {
                thisSlotElem.childNodes[i].childNodes[2].innerHTML = 'Sell price: ' + parseMoney(Math.ceil(hero.inventory[whichSlot].quantity * sellPriceModifier * inflationModifier * currentActiveInventoryItems[hero.inventory[whichSlot].type].priceCode, 0));
            }
        }
}

function itemAttributesMatch(item1, item2) {
    if (item1.type == item2.type) {
        if (item1.quality == item2.quality) {
            if (item1.durability == item2.durability) {
                if (item1.currentWear == item2.currentWear) {
                    if (item1.effectiveness == item2.effectiveness) {
                        if (item1.colour == item2.colour) {
                            if (item1.enchanted == item2.enchanted) {
                                if (item1.hallmark == item2.hallmark) {
                                    if (item1.inscription.title == item2.inscription.title) {
                                    if (item1.inscription.content == item2.inscription.content) {
                                        if (item1.contains == item2.contains) {
                                            return true;
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
    }
    return false;
}





function inventoryItemAction(whichSlot, whichAction, whichActionValue) { // remove the 'slot' prefix with the substring(4):
    var whichSlotNumber = whichSlot.parentElement.id.substring(4);
    switch (whichAction) {
        case "container":
            // check it has contents:
            if (typeof hero.inventory[whichSlotNumber].contains !== "undefined") {
                if ((hero.inventory[whichSlotNumber].contains.length == 1) && (hero.inventory[whichSlotNumber].quantity == 1)) {
                    // if just a single wrapped item containing a single type of item, replace the wrapped with the contents:
                    // (need to ensure that when creating containers that they can't hold more than maxNumberOfItemsPerSlot of an item type)
                    hero.inventory[whichSlotNumber] = JSON.parse(JSON.stringify(hero.inventory[whichSlotNumber].contains[0]));
                    document.getElementById("slot" + whichSlotNumber).innerHTML = generateSlotMarkup(whichSlotNumber);
                    UI.showChangeInInventory([whichSlotNumber]);
                } else {
                    var wrappedObject = JSON.parse(JSON.stringify(hero.inventory[whichSlotNumber]));
                    removeFromInventory(whichSlotNumber, 1);
                    var inventoryCheck = canAddItemToInventory(wrappedObject.contains);
                    if (inventoryCheck[0]) {
                        document.getElementById("slot" + whichSlotNumber).innerHTML = generateSlotMarkup(whichSlotNumber);
                        UI.showChangeInInventory(inventoryCheck[1]);
                    } else {
                        // restore the wrapped item:
                        hero.inventory[whichSlotNumber] = JSON.parse(JSON.stringify(wrappedObject));
                        UI.showNotification("<p>You don't have room for all of these items.</p>");
                    }
                }
            }
            break;
        case "booster":
            openBoosterPack();
            removeFromInventory(whichSlotNumber, 1);
            break;
                    case "bag":
            UI.addNewBag(hero.inventory[whichSlotNumber]);
            audio.playSound(soundEffects['bagOpen'],0);
            removeFromInventory(whichSlotNumber, 1);
            break;
            case "inscribe":
            UI.openInscriptionPanel();
            break;
        case "card":
            hero.cards.unshift(whichActionValue);
            UI.updateCardAlbum();
            removeFromInventory(whichSlotNumber, 1);
            break;
        case "book":
            document.getElementById("book" + whichActionValue).classList.add("active");
            audio.playSound(soundEffects['bookOpen'],0);
        case "recipe":
            if (canLearnRecipe(whichActionValue)) {
                removeFromInventory(whichSlotNumber, 1);
            }
            break;
        case "craft":
            if (hero.professionsKnown.indexOf(parseInt(whichActionValue)) != -1) {
                audio.playSound(soundEffects['buttonClick'],0);
                UI.populateRecipeList(whichActionValue);
            } else {
                UI.showNotification("<p>You don't know this profession yet.</p>");
            }
            break;
    }
}






function additionalTooltipDetail(whichSlotID) {
    // get any information that needs displaying in the tooltip:
    var tooltipInformationToAdd = "";
    if (currentActiveInventoryItems[hero.inventory[whichSlotID].type].action == "recipe") {
        // check if it's known already:
        var isKnown = false;
        for (var i=0; i<hero.recipesKnown.length;i++) {
            if(hero.recipesKnown[i][0] == currentActiveInventoryItems[hero.inventory[whichSlotID].type].actionValue) {
isKnown = true;
            }
        }
        if (isKnown) {
            tooltipInformationToAdd += " (already known)";
        }
    }
    return tooltipInformationToAdd;
}

/*
function generateBookContent(thisSlotsId) {
    var paramsList = "isAjax=true&whichSlot=" + thisSlotsId;
                getJSONWithParams("/scriptorium/generateBook.php", paramsList, function(data) {
                    var whichReturnedSlot = data.book.whichSlot;

                    hero.inventory[whichReturnedSlot].inscription.title = data.book.title;
                    hero.inventory[whichReturnedSlot].inscription.content = data.book.content;
                    UI.buildBook(whichReturnedSlot);
                    document.getElementById("slot" + whichReturnedSlot).firstElementChild.setAttribute("data-action", "book");
                    document.getElementById("slot" + whichReturnedSlot).firstElementChild.setAttribute("data-action-value", generateHash(hero.inventory[whichReturnedSlot].inscription.content));

document.getElementById("slot" + whichReturnedSlot).firstElementChild.nextSibling.innerHTML = '<em>'  + currentActiveInventoryItems[hero.inventory[whichReturnedSlot].type].shortname + ' </em>&quot;' + data.book.title + '&quot; <span class="price">Sell price: ' + parseMoney(hero.inventory[whichReturnedSlot].quantity * currentActiveInventoryItems[hero.inventory[whichReturnedSlot].type].priceCode, 0) + '</span>' + additionalTooltipDetail(whichReturnedSlot);

                }, function(status) {
                    // error - try again:
                    generateBookContent(thisSlotsId);
                });
}
*/

function generateSlotMarkup(thisSlotsId) {
    var slotMarkup = '';
    var theColourPrefix = "";
    var thisFileColourSuffix = "";
    var imageClassName = "";
    var thisColourName = getColourName(hero.inventory[thisSlotsId].colour, hero.inventory[thisSlotsId].type);
    if (thisColourName != "") {
        theColourPrefix = thisColourName + " ";
        thisFileColourSuffix = "-" + thisColourName.toLowerCase();
    }
    var thisAction = currentActiveInventoryItems[hero.inventory[thisSlotsId].type].action;
    var isABook = false;
    if (thisAction) {
        if (thisAction == "book") {
            if(hero.inventory[thisSlotsId].inscription.content) {
            isABook = true;
        }
        }
    }
    dataActionMarkup = '';
    if (thisAction) {
        if (isABook) {
            // link this item up to the book panel using the unique hash:
            dataActionMarkup = 'data-action="' + thisAction + '" data-action-value="' + generateHash(hero.inventory[thisSlotsId].inscription.content) + '" ';
            UI.buildBook(thisSlotsId);
        } else {
            dataActionMarkup = 'data-action="' + thisAction + '" data-action-value="' + currentActiveInventoryItems[hero.inventory[thisSlotsId].type].actionValue + '" ';
        }
    }

    var thisCategories = currentActiveInventoryItems[hero.inventory[thisSlotsId].type].category.split(",");
    for (var i = 0; i < thisCategories.length; i++) {
        imageClassName += "itemCategory" + thisCategories[i] + " ";
    }


    // check if it's a card:
    if (currentActiveInventoryItems[hero.inventory[thisSlotsId].type].action == "card") {
        imageClassName += 'players card';
    }

    slotMarkup += '<img src="/images/game-world/inventory-items/' + hero.inventory[thisSlotsId].type + thisFileColourSuffix + '.png" ' + dataActionMarkup + 'alt="' + theColourPrefix + currentActiveInventoryItems[hero.inventory[thisSlotsId].type].shortname + '" class="' + imageClassName + '">';
    if (isABook) {
        var itemsDescription = "&quot;" + hero.inventory[thisSlotsId].inscription.title + "&quot;";
    } else {
        var itemsDescription = currentActiveInventoryItems[hero.inventory[thisSlotsId].type].description;
    }
    if (itemsDescription.indexOf('##contains##') != -1) {
        // check it has got contains content:
        if (typeof hero.inventory[thisSlotsId].contains !== "undefined") {
            var containsItems = '';
            for (var i = 0; i < hero.inventory[thisSlotsId].contains.length; i++) {
                if (i != 0) {
                    containsItems += ", ";
                }
                containsItems += hero.inventory[thisSlotsId].contains[i].quantity + "x " + currentActiveInventoryItems[hero.inventory[thisSlotsId].contains[i].type].shortname;
            }
            itemsDescription = itemsDescription.replace('##contains##', containsItems);
        }
    }
    slotMarkup += '<p><em>' + theColourPrefix + currentActiveInventoryItems[hero.inventory[thisSlotsId].type].shortname + ' </em>' + itemsDescription + ' ';
    slotMarkup += '<span class="price">Sell price: ' + parseMoney(Math.ceil(hero.inventory[thisSlotsId].quantity * sellPriceModifier * inflationModifier * currentActiveInventoryItems[hero.inventory[thisSlotsId].type].priceCode, 0)) + '</span>';
    slotMarkup += '<span class="price specialismPrice">Sell price: ' + parseMoney(Math.ceil(hero.inventory[thisSlotsId].quantity * sellPriceSpecialismModifier * inflationModifier * currentActiveInventoryItems[hero.inventory[thisSlotsId].type].priceCode, 0)) + '</span>';
    slotMarkup += additionalTooltipDetail(thisSlotsId) + '</p>';
    slotMarkup += '<span class="qty">' + hero.inventory[thisSlotsId].quantity + '</span>';
    return slotMarkup;
}




function inventorySplitStackSubmit(e) {
    if (e) {
        e.preventDefault();
    }


    var enteredValue = splitStackInput.value;
    var isValid = true;
    enteredValue = parseInt(enteredValue);
    if (enteredValue < 1) {
        isValid = false;
    }
    if (!(Number.isInteger(enteredValue))) {
        isValid = false;
    }
    if (enteredValue > hero.inventory[UI.sourceSlot].quantity) {
        isValid = false;
    }
    if (isValid) {
        isSplitStackBeingDragged = true;

        var thisNode = document.getElementById("slot" + UI.sourceSlot);
        // clone this slot to draggableInventorySlot:
        UI.activeDragObject = document.getElementById('draggableInventorySlot');
        UI.activeDragObject.innerHTML = thisNode.innerHTML;
        // remove from inventory data:


        removeFromInventory(UI.sourceSlot, enteredValue);

        UI.draggedInventoryObject.quantity = enteredValue;

        // update visually to dragged clone:

        for (var i = 0; i < UI.activeDragObject.childNodes.length; i++) {
            if (UI.activeDragObject.childNodes[i].className == "qty") {
                UI.activeDragObject.childNodes[i].innerHTML = UI.draggedInventoryObject.quantity;
                break;
            }
        }

        UI.inDrag = true;
        var clickedSlotRect = thisNode.getBoundingClientRect();
        var pageScrollTopY = (window.pageYOffset || document.documentElement.scrollTop) - (document.documentElement.clientTop || 0);
        // 3px padding on the slots:
        objInitLeft = clickedSlotRect.left + 3;
        objInitTop = clickedSlotRect.top + 3 + pageScrollTopY;
        // +22 to centre the slot (half the slot width) under the cursor:
        dragStartX = objInitLeft + 22;
        dragStartY = objInitTop + 22;

        UI.activeDragObject.style.cssText = "z-index:2;top: " + objInitTop + "px; left: " + objInitLeft + "px; transform: translate(0px, 0px);";
        document.addEventListener("mousemove", UI.handleDrag, false);
        document.addEventListener("mouseup", UI.endInventoryDrag, false);
    }
    console.log(UI.draggedInventoryObject);
    splitStackPanel.classList.remove("active");

}

function inventorySplitStackCancel() {
    splitStackPanel.classList.remove("active");
}
