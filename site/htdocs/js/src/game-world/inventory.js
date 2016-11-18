function canAddItemToInventory(itemObj) {
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

                    slotsUpdated.push((inventoryKeysFound[i]));
                    inventoryClone[inventoryKeysFound[i]].quantity += amountAddedToThisSlot;
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
                        inventoryClone[thisSlotsID].inscription = itemObj[k].inscription;
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



function removeFromInventory(whichSlot, amount) {
    var thisCurrentQuantity = hero.inventory[whichSlot].quantity;
    var thisSlotElem = document.getElementById("slot" + whichSlot);
    if (thisCurrentQuantity - amount > 0) {
        // just reduce quantity:
        hero.inventory[whichSlot].quantity -= amount;
        // update visually:
        for (var i = 0; i < thisSlotElem.childNodes.length; i++) {
            if (thisSlotElem.childNodes[i].className == "qty") {
                thisSlotElem.childNodes[i].innerHTML = hero.inventory[whichSlot].quantity;
                break;
            }
        }
    } else {
        // remove the item:
        delete hero.inventory[whichSlot];
        // update visually:
        thisSlotElem.innerHTML = '<img alt="Empty slot" src="/images/game-world/inventory-items/blank.png">';
    }
}

function itemAttributesMatch(item1, item2) {
    // 'type' has already been checked
    if (item1.quality == item2.quality) {
        if (item1.durability == item2.durability) {
            if (item1.currentWear == item2.currentWear) {
                if (item1.effectiveness == item2.effectiveness) {
                    if (item1.wrapped == item2.wrapped) {
                        if (item1.colour == item2.colour) {
                            if (item1.enchanted == item2.enchanted) {
                                if (item1.hallmark == item2.hallmark) {
                                    if (item1.inscription == item2.inscription) {
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
    return false;
}



function inventoryItemAction(whichSlot, whichAction, whichActionValue) {
    switch (whichAction) {
        case "booster":
            openBoosterPack();
            // remove the 'slot' prefix with the substring(4):
            removeFromInventory(whichSlot.parentElement.id.substring(4), 1);
            break;
            case "recipe":
          learnRecipe(whichActionValue);
                        // remove the 'slot' prefix with the substring(4):
            removeFromInventory(whichSlot.parentElement.id.substring(4), 1);
    }
}


function additionalTooltipDetail(whichSlotID) {
// get any information that needs displaying in the tooltip:
var tooltipInformationToAdd = "";




if (currentActiveInventoryItems[hero.inventory[whichSlotID].type].action == "recipe") {
    // check if it's known already:
    if (hero.recipesKnown.indexOf(parseInt(currentActiveInventoryItems[hero.inventory[whichSlotID].type].actionValue)) != -1) {
        tooltipInformationToAdd += " (already known)";
    }
}


return tooltipInformationToAdd;
}