function canAddItemToInventory(itemObj) {
    // takes an array of objects and checks if all of them can be added before adding any of them
    // make copy of inventory:
    var inventoryClone = JSON.parse(JSON.stringify(hero.inventory));
    var slotsUpdated = [];
    var allItemsAdded = true;
    var moneyToAdd = 0;
    var followersAdded = [];
    var professionsAdded = [];
    var followerMarkupToAdd;
    for (var k = 0; k < itemObj.length; k++) {
        // check for any money items:
        switch (itemObj[k].type) {
            case '$':
                moneyToAdd += itemObj[k].quantity;
                break;
            case 'follower':
                followersAdded.push([itemObj[k].id, itemObj[k].name]);
                break;
            case 'profession':
                professionsAdded.push(itemObj[k].id);
                break;
            default:
                var quantityAddedSoFar = 0;
                // check if this type exist in the current inventory:
                var inventoryKeysFound = getObjectKeysForInnerValue(inventoryClone, itemObj[k].type, "type");
                if (inventoryKeysFound.length > 0) {
                    // loop through keysFound and add to the slot maximum
                    for (var i = 0; i < inventoryKeysFound.length; i++) {
                        // make sure the slot isn't locked:
                        if (!(document.getElementById('slot' + inventoryKeysFound[i]).classList.contains('locked'))) {
                            if (itemAttributesMatch(inventoryClone[inventoryKeysFound[i]], itemObj[k])) {
                                var quantityOnSlotAlready = inventoryClone[inventoryKeysFound[i]].quantity;
                                var amountAddedToThisSlot = (maxNumberOfItemsPerSlot - quantityOnSlotAlready) > (itemObj[k].quantity - quantityAddedSoFar) ? (itemObj[k].quantity - quantityAddedSoFar) : maxNumberOfItemsPerSlot - quantityOnSlotAlready;
                                quantityAddedSoFar += amountAddedToThisSlot;
                                // add item to this slot:
                                if (amountAddedToThisSlot > 0) {
                                    slotsUpdated.push((inventoryKeysFound[i]));
                                    inventoryClone[inventoryKeysFound[i]].quantity += amountAddedToThisSlot;
                                }
                                if (quantityAddedSoFar >= itemObj[k].quantity) {
                                    break;
                                }
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

                                inventoryClone[thisSlotsID] = JSON.parse(JSON.stringify(itemObj[k]));
                                /*
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
                                inventoryClone[thisSlotsID].hash = createItemHash(itemObj[k].type, amountAddedToThisSlot);
                                inventoryClone[thisSlotsID].inscription = "";
                                if (typeof itemObj[k].inscription !== "undefined") {
                                    inventoryClone[thisSlotsID].inscription = {};
                                    inventoryClone[thisSlotsID].inscription.title = itemObj[k].inscription.title;
                                    inventoryClone[thisSlotsID].inscription.content = itemObj[k].inscription.content;
                                    inventoryClone[thisSlotsID].inscription.timeCreated = itemObj[k].inscription.timeCreated;
                                }
                                if (typeof itemObj[k].contains !== "undefined") {
                                    inventoryClone[thisSlotsID].contains = JSON.parse(JSON.stringify(itemObj[k].contains));
                                }
                                */
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
    }
    if (allItemsAdded) {
        // make the active inventory be the same as the amended one:
        hero.inventory = JSON.parse(JSON.stringify(inventoryClone));
        UI.updatePanelsAfterInventoryChange();
        if (moneyToAdd > 0) {
            hero.currency['money'] += moneyToAdd;
            UI.updateCurrencies();
            audio.playSound(soundEffects['coins'], 0);
        }
        if (followersAdded.length > 0) {
            for (var i = 0; i < followersAdded.length; i++) {
                UI.showNewFollower(followersAdded[i][0], followersAdded[i][1]);
                // update database:
                sendDataWithoutNeedingAResponse("/game-world/activateRetinueFollower.php?followerID=" + followersAdded[i][0]);
                // show in retinue panel:
                followerMarkupToAdd = '<li id="retinueFollower' + followersAdded[i][0] + '" class="available" data-locationx="200" data-locationy="350" data-activeonquest="-1"><div class="portrait"><img src="/images/retinue/' + followersAdded[i][0] + '.png" alt=""></div><h3>' + followersAdded[i][1] + '</h3><p>waiting for a quest</p></li>';
                retinueList.insertAdjacentHTML('beforeend', followerMarkupToAdd);
            }
        }
        if (professionsAdded.length > 0) {
            for (var i = 0; i < professionsAdded.length; i++) {
                if (hero.professionsKnown.indexOf(professionsAdded[i]) == -1) {
                    hero.professionsKnown.push(professionsAdded[i]);
                    UI.showNewProfession(professionsAdded[i]);
                }
            }
        }
        // return success, and the slots that were affected:
        return [true, slotsUpdated];
    } else {
        // don't change the current inventory - return false:
        return [false];
    }
}



/*
function hasItemInInventory(itemType, amountNeeded) {
    if (typeof amountNeeded === "undefined") {
        var amountNeeded = 1;
    }

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
*/







function hasItemsInInventory(itemsToAdd) {
    // takes an array of objects and checks if all of them exist in the inventory:
    // (if any value is undefined, it can be any value)
    var allItemsFound = true;
    var quantityForThisItemFound, allOfTheseAttributesMatch;
    for (var i = 0; i < itemsToAdd.length; i++) {
        if (typeof itemsToAdd[i].quantity === "undefined") {
            itemsToAdd[i].quantity = 1;
        }
        quantityForThisItemFound = 0;
        var inventoryKeysFound = getObjectKeysForInnerValue(hero.inventory, itemsToAdd[i].type, "type");
        if (inventoryKeysFound.length > 0) {
            for (var j = 0; j < inventoryKeysFound.length; j++) {
                // check any defined values against this slot
                allOfTheseAttributesMatch = true;
                for (var k in itemsToAdd[i]) {


                    switch (k) {
                        case 'quantity':
                            // ignore quantity attributes:
                            break;
                            // these attributes can be greater than the defined values:
                        case 'durability':
                        case 'quality':
                        case 'effectiveness':
                            if (hero.inventory[(inventoryKeysFound[j])][k] < itemsToAdd[i][k]) {
                                allOfTheseAttributesMatch = false;
                            }
                            break;
                        default:
                            if (hero.inventory[(inventoryKeysFound[j])][k] != itemsToAdd[i][k]) {
                                allOfTheseAttributesMatch = false;
                            }

                    }



                }
                if (allOfTheseAttributesMatch) {
                    quantityForThisItemFound += hero.inventory[(inventoryKeysFound[j])]['quantity'];
                }
            }
        }
        if (quantityForThisItemFound < itemsToAdd[i].quantity) {
            allItemsFound = false;
        }
    }
    return allItemsFound;
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


    if (typeof amount === "undefined") {
        var amount = 1;
    }

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

function addToInventory(whichSlot, itemObject, forceNewHash = false) {
    // make a copy not a reference:
    hero.inventory[whichSlot] = JSON.parse(JSON.stringify(itemObject));

    if ((typeof hero.inventory[whichSlot].hash === "undefined") || forceNewHash) {
        // create one:
        hero.inventory[whichSlot].hash = createItemHash(itemObject.type, itemObject.quantity);
        console.log(itemObject.type, itemObject.quantity, hero.inventory[whichSlot].hash);
    } else {
        console.log("already", hero.inventory[whichSlot].hash);
    }
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
    // would querySelector be faster here? ########
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
                                            if (item1.inscription.timeCreated == item2.inscription.timeCreated) {
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
    }
    return false;
}



function inventoryItemAction(whichSlot, whichAction, allActionValues) {
    // remove the 'slot' prefix with the substring(4):
    var whichSlotNumber = whichSlot.parentElement.id.substring(4);
    // check if it has a cooldown:
    var canBeClicked = true;
    var whichActionValue;
    if (typeof hero.inventory[whichSlotNumber].cooldown !== "undefined") {
        if (hero.inventory[whichSlotNumber].cooldownTimer > 0) {
            canBeClicked = false;
        }
    }

    if (hero.inventory[whichSlotNumber].currentWear >= hero.inventory[whichSlotNumber].durability) {
        canBeClicked = false;
        UI.showNotification("<p>I need to repair this item first</p>");
    }

    if (canBeClicked) {
        var whichActionSplit = whichAction.split(",");
        var allActionValuesSplit = allActionValues.split(",");
        for (var i = 0; i < whichActionSplit.length; i++) {

            whichActionValue = allActionValuesSplit[i];

            switch (whichActionSplit[i]) {
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
                                UI.showNotification("<p>I don't have room for all of these items.</p>");
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
                    audio.playSound(soundEffects['bagOpen'], 0);
                    removeFromInventory(whichSlotNumber, 1);
                    break;
                case "home":
                    var location = hero.inventory[whichSlotNumber].additional.split("|");
                    jumpToLocation(location[0], location[1], location[2]);
                    break;
                case "inscribe":
                    UI.openInscriptionPanel();
                    break;
                case "holdable":
                    UI.holdItem(whichSlotNumber);
                    break;
                case "collection":
                    // check if this zone key exists in the hero.collections object
                    if (hero.collections.hasOwnProperty(whichActionValue)) {
                        // find  in the array and make it negative ####
                        var foundIndex = hero.collections[whichActionValue].required.indexOf(hero.inventory[whichSlotNumber].type);
                        if (foundIndex != -1) {
                            if (hero.collections[whichActionValue].required[foundIndex] > 0) {
                                hero.collections[whichActionValue].required[foundIndex] = 0 - (hero.collections[whichActionValue].required[foundIndex]);
                                // update the panel visually:
                                document.getElementById(whichActionValue + '-' + hero.inventory[whichSlotNumber].type).classList.remove('notCollected');
                                removeFromInventory(whichSlotNumber, 1);
                            } else {
                                UI.showNotification("<p>I already have that in a collection</p>");
                            }
                        }
                    }
                    break;
                case "card":
                    hero.cards.unshift(hero.inventory[whichSlotNumber].contains);
                    UI.updateCardAlbum();
                    removeFromInventory(whichSlotNumber, 1);
                    break;
                case "questSet":
                    if (!questData[whichActionValue].isUnderway) {
                        questData[whichActionValue].isUnderway = true;
                        addToJournal(whichActionValue);
                    }
                    break;
                case "book":
                    document.getElementById("book" + whichActionValue).classList.add("active");
                    audio.playSound(soundEffects['bookOpen'], 0);
                case "recipe":
                    if (canLearnRecipe(whichActionValue)) {
                        removeFromInventory(whichSlotNumber, 1);
                    }
                    break;
                case "craft":
                    if (hero.professionsKnown.indexOf(parseInt(whichActionValue)) != -1) {
                        audio.playSound(soundEffects['buttonClick'], 0);
                        UI.populateRecipeList(whichActionValue, hero.inventory[whichSlotNumber].quality);
                    } else {
                        UI.showNotification("<p>I don't know this profession yet.</p>");
                    }
                    break;
                case "deed":
                    // #####
                    var actionValueSplit = whichActionValue.split('x');
                    plotPlacement.width = actionValueSplit[0];
                    plotPlacement.length = actionValueSplit[1];
                    activeAction = "plotPlacement";
                    document.addEventListener("mousemove", UI.movePlotPlacementOverlay, false);
                    //document.removeEventListener("mousemove", UI.movePlotPlacementOverlay, false);
                    break;
            }
        }
        if (typeof hero.inventory[whichSlotNumber].cooldown !== "undefined") {
            hero.inventory[whichSlotNumber].cooldownTimer = hero.inventory[whichSlotNumber].cooldown;
        }
    }
}



function additionalTooltipDetail(thisItemObject) {
    // get any information that needs displaying in the tooltip:
    var tooltipInformationToAdd = "";
    switch (currentActiveInventoryItems[thisItemObject.type].action) {
        case "recipe":
            // check if it's known already:
            var isKnown = false;
            for (var i = 0; i < hero.recipesKnown.length; i++) {
                if (hero.recipesKnown[i] == currentActiveInventoryItems[thisItemObject.type].actionValue) {
                    isKnown = true;
                }
            }
            if (isKnown) {
                tooltipInformationToAdd += " (already known)";
            }
            break;
        case "collection":
            // see if the hero already has one in a collection:
            var isKnown = false;
            var whichZone = currentActiveInventoryItems[thisItemObject.type].actionValue;
            if (hero.collections.hasOwnProperty(whichZone)) {
                // key exists - collection is underway:
                var foundIndex = hero.collections[whichZone].required.indexOf(thisItemObject.type);
                if (foundIndex != -1) {
                    if (hero.collections[whichZone].required[foundIndex] > 0) {
                        tooltipInformationToAdd += " (needed for an active collection - double click to add)";
                    }
                } else {
                    // collection type is negative, so won't match the item type:
                    tooltipInformationToAdd += " (already added to a collection)";
                }
            }
            break;

    }


    return tooltipInformationToAdd;
}



function generateGenericSlotMarkup(thisItemObject) {

    var slotMarkup = '';
    var theColourPrefix = "";
    var thisFileColourSuffix = "";
    var imageClassName = "";
    var thisColourName = getColourName(thisItemObject.colour, thisItemObject.type);
    if (thisColourName != "") {
        theColourPrefix = thisColourName + " ";
        thisFileColourSuffix = "-" + thisColourName.toLowerCase();
    }
    var thisAction = currentActiveInventoryItems[thisItemObject.type].action;
    var isABook = false;
    var isACard = false;

    if (thisAction) {
        if (thisAction.indexOf("book") != -1) {
            if (thisItemObject.inscription.content) {
                isABook = true;

            }
        }
    }

    var isHoldable = false;
    if (currentActiveInventoryItems[thisItemObject.type].holdable == 1) {
        isHoldable = true;
    }


    var dataActionMarkup = '';
    if (thisAction) {
        if (isABook) {
            var booksActionValue;
            // link this item up to the book panel using the unique hash:
            var thisBooksHash = generateHash(thisItemObject.inscription.title + thisItemObject.colour + thisItemObject.type + thisItemObject.inscription.timeCreated);
            // check if the item has multiple actions, and create the action value accordingly:
            if (thisAction.indexOf(",") == -1) {
                booksActionValue = thisBooksHash;
            } else {
                booksActionValue = currentActiveInventoryItems[thisItemObject.type].actionValue.replace("?", thisBooksHash);
            }
            dataActionMarkup = 'data-action="' + thisAction + '" data-action-value="' + booksActionValue + '" ';
            UI.buildBook(thisItemObject, thisBooksHash);
        } else {
            dataActionMarkup = 'data-action="' + thisAction + '" data-action-value="' + currentActiveInventoryItems[thisItemObject.type].actionValue + '" ';
        }
    }
    if (isHoldable) {
        dataActionMarkup = 'data-action="holdable" data-action-value="' + currentActiveInventoryItems[thisItemObject.type].action + '" ';
    }

    var thisCategories = currentActiveInventoryItems[thisItemObject.type].category.split(",");
    for (var i = 0; i < thisCategories.length; i++) {
        imageClassName += "itemCategory" + thisCategories[i] + " ";
    }



    // check if it's a card:
    if (currentActiveInventoryItems[thisItemObject.type].action == "card") {
        isACard = true;
        imageClassName += 'players card';
        var cardTypeId = thisItemObject.contains;
    }

    // check for User Generated Content:
    var isUGC = false;
    if (typeof thisItemObject.contains !== "undefined") {
        if (typeof thisItemObject.contains['ugc-id'] !== "undefined") {
            isUGC = true;
        }
    }
    var itemsDescription;
    if (!isUGC) {
        if(isACard) {
itemsDescription = "A '"+cardGameNameSpace.allCardData[cardTypeId][2]+"' totem card";
slotMarkup += '<img src="/images/card-game/inventory-items/' + cardTypeId + '.png" ' + dataActionMarkup + 'alt="' + theColourPrefix + currentActiveInventoryItems[thisItemObject.type].shortname + '" class="' + imageClassName + '">';
        } else {
        slotMarkup += '<img src="/images/game-world/inventory-items/' + thisItemObject.type + thisFileColourSuffix + '.png" ' + dataActionMarkup + 'alt="' + theColourPrefix + currentActiveInventoryItems[thisItemObject.type].shortname + '" class="' + imageClassName + '">';
        if (isABook) {
            itemsDescription = "&quot;" + thisItemObject.inscription.title + "&quot;";
        } else {
            itemsDescription = currentActiveInventoryItems[thisItemObject.type].description;
        }
    }
    } else {
        slotMarkup += '<img src="/images/user-generated/' + thisItemObject.contains['ugc-id'] + '-slot.png" ' + dataActionMarkup + 'alt="' + theColourPrefix + currentActiveInventoryItems[thisItemObject.type].shortname + '" class="' + imageClassName + '">';
        if (typeof thisItemObject.contains['ugc-title'] !== "undefined") {
            itemsDescription = thisItemObject.contains['ugc-title'];
        } else {
            itemsDescription = currentActiveInventoryItems[thisItemObject.type].description;
        }

    }
    if (itemsDescription.indexOf('##contains##') != -1) {
        // check it has got contains content:
        if (typeof thisItemObject.contains !== "undefined") {
            var containsItems = '';
            for (var i = 0; i < thisItemObject.contains.length; i++) {
                if (i != 0) {
                    containsItems += ", ";
                }
                containsItems += thisItemObject.contains[i].quantity + "x " + currentActiveInventoryItems[thisItemObject.contains[i].type].shortname;
            }
            itemsDescription = itemsDescription.replace('##contains##', 'Contains: ' + containsItems);
        }
    }
    slotMarkup += '<p><em>' + theColourPrefix + currentActiveInventoryItems[thisItemObject.type].shortname + ' </em>' + itemsDescription + ' ';
    slotMarkup += '<span class="price">Sell price: ' + parseMoney(Math.ceil(thisItemObject.quantity * sellPriceModifier * inflationModifier * currentActiveInventoryItems[thisItemObject.type].priceCode, 0)) + '</span>';
    slotMarkup += '<span class="price specialismPrice">Sell price: ' + parseMoney(Math.ceil(thisItemObject.quantity * sellPriceSpecialismModifier * inflationModifier * currentActiveInventoryItems[thisItemObject.type].priceCode, 0)) + '</span>';

    slotMarkup += additionalTooltipDetail(thisItemObject) + '</p>';
    slotMarkup += addGauge(thisItemObject);
    slotMarkup += '<span class="qty">' + thisItemObject.quantity + '</span>';

    return slotMarkup;
}


function generateSlotMarkup(thisSlotsId) {
    return generateGenericSlotMarkup(hero.inventory[thisSlotsId]) + '<div class="coolDown"></div><div class="lockedOverlay" id="lockedOverlay' + thisSlotsId + '"></div>';
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
        UI.activeDragObject.style.cssText = "z-index:4;top: " + objInitTop + "px; left: " + objInitLeft + "px; transform: translate(0px, 0px);";
        document.addEventListener("mousemove", UI.handleDrag, false);
        document.addEventListener("mouseup", UI.endInventoryDrag, false);
    }

    splitStackPanel.classList.remove("active");
    // remove focus
    document.activeElement.blur();
}

function inventorySplitStackCancel() {
    splitStackPanel.classList.remove("active");
    document.activeElement.blur();
}


function prepareInventoryObject(definedObject) {
    var thisObject = {
        "type": "$",
        "quantity": 1,
        "quality": 100,
        "durability": 100,
        "currentWear": 0,
        "effectiveness": 100,
        "colour": 0,
        "enchanted": 0,
        "hallmark": 0,
        "inscription": ""
    }
    // now copy in any defined attributes - this way don't need to waste space storing default values:
    for (var attrname in definedObject) {
        thisObject[attrname] = definedObject[attrname];
    }
    return thisObject;
}

function createItemHash(type, quantity) {
    return '' + type + quantity + characterId + Date.now();
}

function findSlotByHash(whichHash) {
    var foundHashSlot = -1;
    for (var key in hero.inventory) {
        if (hero.inventory[key].hash == whichHash) {
            foundHashSlot = key;
            break;
        }
    }
    return foundHashSlot;
}


function addGauge(thisItemObject) {
    var gaugeMarkupToAdd = '';
    if (currentActiveInventoryItems[thisItemObject.type].holdable > 0) {
        // check if it contains anything, and show a gauge if so:
        if (typeof thisItemObject.contains !== "undefined") {

            //    tooltipInformationToAdd += " contains "+thisItemObject.contains[0].quantity+"x "+currentActiveInventoryItems[thisItemObject.contains[0].type].shortname; 

            var gaugePercent = thisItemObject.contains[0].quantity / parseInt(currentActiveInventoryItems[thisItemObject.type].actionValue) * 100;

            gaugeMarkupToAdd += '<span class="gauge gauge' + currentActiveInventoryItems[thisItemObject.contains[0].type].shortname + '"><span style="width:' + gaugePercent + '%"></span></span>';

        }
    }
    return gaugeMarkupToAdd;
}


function updateGauge(whichSlotKey) {
    var gaugePercent = hero.inventory[whichSlotKey].contains[0].quantity / parseInt(currentActiveInventoryItems[hero.inventory[whichSlotKey].type].actionValue) * 100;
    document.getElementById('slot' + whichSlotKey).querySelector('.gauge span').style.width = gaugePercent + '%';
}


function reducedHeldQuantity(whichSlot) {
    hero.inventory[whichSlot].quantity--;
    if (hero.inventory[whichSlot].quantity == 0) {
        // stop 'holding' this now all gone:
        hero.holding.hash = '';
        hero.holding.type = '';
        // remove inventory slot as well:
        delete hero.inventory[whichSlot];
        // update visually:
        document.getElementById("slot" + whichSlot).innerHTML = '';
    }
}