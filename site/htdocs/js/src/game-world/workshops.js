function workshopSelectHireApprentice(e) {
    //.closest not supported in IE11 ###
    // https://developer.mozilla.org/en-US/docs/Web/API/Element/closest#Polyfill
    var parentPanel = e.target.closest(".hireApprentice");
    var sexAndRaceKey = '';
    var sexAndRaceImgSource = '';
    var workshopSelects = parentPanel.querySelectorAll('select');
    for (i = 0; i < workshopSelects.length; ++i) {
        sexAndRaceKey += workshopSelects[i].value;
        if (sexAndRaceImgSource != '') {
            sexAndRaceImgSource += '-';
        }
        sexAndRaceImgSource += workshopSelects[i].value;
    }
    // change the name - but only if the player hasn't entered one:
    var currentName = parentPanel.querySelector('input[name=hireApprenticeName]').value;
    if (parentPanel.getAttribute('data-allapprenticenames').indexOf(currentName) !== -1) {
        parentPanel.querySelector('input[name=hireApprenticeName]').value = parentPanel.getAttribute('data-' + sexAndRaceKey);
    }
    // change portait:
    parentPanel.querySelector('.apprenticePortrait').src = '/images/retinue/source/' + sexAndRaceImgSource + '.png';

}

function workshopApprenticeNameChange(e) {
    //.closest not supported in IE11 ###
    var parentPanel = e.target.closest(".hireApprentice");
    var currentName = e.target.value;
    if (parentPanel.getAttribute('data-allapprenticenames').indexOf(currentName) !== -1) {
        // highlight the current name to make it easier to over type:
        e.target.setSelectionRange(0, e.target.value.length);
    }
}

function hireApprentice(e) {
    //.closest not supported in IE11 ###
    var parentPanel = e.target.closest(".workshop");
    var cost = e.target.getAttribute('data-cost');

    if (hero.currency['money'] >= cost) {
        hero.currency['money'] -= cost;
        UI.updateCurrencies();
        audio.playSound(soundEffects['coins'], 0);
        var apprenticeName = parentPanel.querySelector('input[name=hireApprenticeName]').value;
        var newApprenticeMapObject = {
            "name": apprenticeName
        };

        // add the new apprentice to the panel:
        var workshopSelects = parentPanel.querySelectorAll('.hireApprentice select');
        var sexAndRaceImgSource = '';
        for (i = 0; i < workshopSelects.length; ++i) {
            if (sexAndRaceImgSource != '') {
                sexAndRaceImgSource += '-';
            }
            sexAndRaceImgSource += workshopSelects[i].value;
            newApprenticeMapObject[workshopSelects[i].getAttribute('data-key')] = workshopSelects[i].value;
        }

        var newApprenticeMarkup = '<li><img src="/images/retinue/source/' + sexAndRaceImgSource + '.png" alt=""><h6>' + apprenticeName + '</h6></li>';
        parentPanel.querySelector('.activeApprentices ol').insertAdjacentHTML('beforeend', newApprenticeMarkup);

        // add the apprentice to the map json:
        var workshopsName = parentPanel.getAttribute('data-workshopname');
        // loop through to find the workshop name:
        for (var i = 0; i < thisMapData[currentMap].workshops.length; i++) {
            if (thisMapData[currentMap].workshops[i].name == workshopsName) {
                thisMapData[currentMap].workshops[i].apprentices.push(newApprenticeMapObject);
                var newNumberOfApprentices = thisMapData[currentMap].workshops[i].apprentices.length;
                break;
            }
        }

        if (newNumberOfApprentices >= parentPanel.getAttribute('data-maxapprentices')) {
            parentPanel.querySelector('.hireApprentice').style.display = 'none';
        } else {
            // increase cost on button
            var nextHireCost = ((newNumberOfApprentices + 1) * (newNumberOfApprentices + 1)) * 10000;
            var newLabel = 'Hire this apprentice (' + parseMoney(nextHireCost) + ')';
            parentPanel.querySelector('.primaryButton').setAttribute('data-cost', nextHireCost);
            parentPanel.querySelector('.primaryButton').innerHTML = newLabel;
        }

        // generate a new name for the next apprentice of this sex and race
        var sexAndRace = sexAndRaceImgSource.split("-");
        var sexAndRaceData = "data-" + sexAndRace[0] + sexAndRace[1];
        sendGetData("/game-world/generateProceduralName.php?sex=" + sexAndRace[1] + "&race=" + sexAndRace[0], function(data) {
            parentPanel.querySelector('input[name=hireApprenticeName]').value = data;
            parentPanel.querySelector('.hireApprentice').setAttribute(sexAndRaceData, data);
            var allPreviousNames = parentPanel.querySelector('.hireApprentice').getAttribute('data-allapprenticenames');
            console.log("was: " + allPreviousNames);
            allPreviousNames = allPreviousNames.replace(apprenticeName, data);
            console.log("now: " + allPreviousNames);
            parentPanel.querySelector('.hireApprentice').setAttribute('data-allapprenticenames', allPreviousNames);
        }, function(status) {
            // try again ?
        });
    } else {
        UI.showNotification("<p>I don't have enough money</p>");
    }
}

function appendRecipeData(thisNewRecipeData) {
    for (var i in thisNewRecipeData) {
        if (!(detailedRecipeData.hasOwnProperty(i))) {
            detailedRecipeData[i] = thisNewRecipeData[i];
        }
    }
}

function addItemToWorkshopQueue() {
    hero.stats.itemsCraftedAtWorkshop++;
    // prepare map object:
    var newWorkshopItem = {
        "item": craftingObject.craftedItem,
        "fromWhichRecipe": craftingObject.recipeId,
        "finalImageSrc": craftingObject.finalImageSrc,
        "finalItemName": craftingObject.finalItemName,
        "startTime": Date.now()
    }
    // find the workshop with that name in thisMapData[currentMap]['workshops']:
    for (var i = 0; i < thisMapData[currentMap]['workshops'].length; i++) {
        if (thisMapData[currentMap]['workshops'][i]['name'] == craftingObject.whichWorkshop) {
            thisMapData[currentMap]['workshops'][i]['itemsQueued'].push(newWorkshopItem);
            break;
        }
    }
    // console.log(thisMapData[currentMap]);
    releaseLockedSlots();
    updateInventoryAfterCrafting();
    // update the available items:
    recipeSelectComponents(craftingObject.whichRecipe, true);
}

function loadNewWorkshopRecipeData(whichRecipe, whichWorkshop) {
    getJSON("/game-world/getRecipeDetails.php?recipe=" + whichRecipe, function(data) {

        appendRecipeData(data.recipe);

        var thisMarkup = '<li data-recipe="' + whichRecipe + '">';
        thisMarkup += '<img src="/images/game-world/inventory-items/' + data.recipe[whichRecipe].imageId + '.png" alt=""><h3>' + data.recipe[whichRecipe].recipeName + '</h3><p>' + data.recipe[whichRecipe].recipeDescription + '</p></li>';

        whichWorkshop.querySelector('.availableRecipes ol').insertAdjacentHTML('beforeend', thisMarkup);
        // resize the scroll bar (if it's used):
        if (thisDevicesScrollBarWidth > 0) {
            window[whichWorkshop.id].init();
        }



    }, function(status) {
        // try again:
        loadNewWorkshopRecipeData(whichRecipe);
    });
}

function addRecipeToWorkshop(whichRecipe, whichWorkshop) {
    // does this need a showYesNoDialogueBox? ###
    var thisWorkshopName = whichWorkshop.getAttribute('data-workshopname');
    for (var i = 0; i < thisMapData[currentMap]['workshops'].length; i++) {
        if (thisMapData[currentMap]['workshops'][i]['name'] == thisWorkshopName) {
            // add to map json:
            thisMapData[currentMap]['workshops'][i]['recipesKnown'].push(whichRecipe.contains);
            break;
        }
    }
    loadNewWorkshopRecipeData(whichRecipe.contains, whichWorkshop);
}

function checkIfWorkshopItemIsComplete(whichItemNode) {
    if (whichItemNode.hasAttribute('data-complete')) {
        var workshopItem = JSON.parse(whichItemNode.getAttribute('data-item'));
        var inventoryCheck = canAddItemToInventory([workshopItem]);
        if (inventoryCheck[0]) {
            UI.showChangeInInventory(inventoryCheck[1]);
        } else {
            // send the item by post:
            var subjectLine = "Your crafted " + whichItemNode.getAttribute('data-name');
            var message = "Some of our finest work...";
            var whichNPC = activeObjectForDialogue.name;
            sendNPCPost('{"subject":"' + subjectLine + '","message":"' + message + '","senderID":"-1","recipientID":"' + characterId + '","fromName":"' + whichNPC + '"}', [workshopItem]);
            UI.showNotification("<p>My workshop item is in the post</p>");
        }
        // remove it from the map JSON as well:
        var workshopsName = whichItemNode.closest('.workshop').getAttribute('data-workshopname');
        for (var i = 0; i < thisMapData[currentMap]['workshops'].length; i++) {
            if (thisMapData[currentMap]['workshops'][i]['name'] == workshopsName) {
                delete thisMapData[currentMap]['workshops'][i]['itemsQueued'];
                break;
            }
        }
        whichItemNode.remove();
    }
}