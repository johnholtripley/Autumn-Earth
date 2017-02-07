clientVersion = "1.0.0";
tilewidth = 48;
spacing = tilewidth / 2;
gamedisplay.inputbox._visible = false;
gamedisplay.skillDisplay._visible = false;
gamedisplay.quickEquipHolder._visible = false;
gamedisplay.boosterAnime._visible = false;
gamedisplay.musicalInstrument._visible = false;
gamedisplay.auctionHousePanel._visible = false;
collectionAlbumVisible = false;
gamedisplay.collectionAlbum._visible = false;
quickEquipVisible = false;
_root.currentSongPlayed = "";
colours = [["", ""], ["Red", "0xff0000"], ["Yellow", "0xffff00"], ["Orange", "0xff8800"], ["Blue", "0x0000ff"], ["Purple", "0xff00ff"], ["Green", "0x00ff00"], ["Brown", "0x724545"], ["Irid Essence", "0x000000"], ["(iridescent red)", "0x000000"], ["Gold", "0x000000"], ["(iridescent orange)", "0x000000"], ["(iridescent blue)", "0x000000"], ["(iridescent purple)", "0x000000"], ["(iridescent green)", "0x000000"], ["bronze", "0x000000"], ["White", "0xffffff"], ["Pink", "0xff8888"], ["(light yellow)", "0xfff088"], ["(light orange)", "0xffa067"], ["aquamarine", "0x000000"], ["violet", "0x000000"], ["(light green)", "0x000000"], ["(light brown)", "0x000000"], ["(light silver)", "0x000000"], ["coral", "0x000000"], ["(light gold)", "0x000000"], ["(light orange iridescent)", "0x000000"], ["azure", "0x000000"], ["(light purple iridescent)", "0x000000"], ["emerald", "0x000000"], ["(light bronze)", "0x000000"], ["Black", "0x000000"], ["Ruby", "0x000000"], ["(dark yellow)", "0x000000"], ["(dark orange)", "0x000000"], ["(dark blue)", "0x000000"], ["(dark purple)", "0x000000"], ["(dark green)", "0x000000"], ["(dark brown)", "0x000000"], ["(dark silver)", "0x000000"], ["(dark red iridescent)", "0x000000"], ["(dark gold)", "0x000000"], ["(dark orange iridescent)", "0x000000"], ["(dark blue iridescent)", "0x000000"], ["(dark purple iridescent)", "0x000000"], ["(dark green iridescent)", "0x000000"], ["(dark bronze)", "0x000000"], ["Grey", "0x000000"]];
craftBarToPercentRatio = 2.500000;
isCrafting = false;
timeDec = 1;
tolerance = 0.500000;
accelerateFactor = 0.666667;
skillIncCap = 6;
NPCStartSpeechIndex = 15;
petcarrying = [["37", "1", "4", "20", "4", "-1", "Titian\'s Venus[*^*]", "titian", "0", "0", "-"], ["5", "10", "4", "100", "4", "-1", "0", "0", "0", "0", "-"], ["35", "1", "4", "100", "4", "-1", "0", "1|12|14", "0", "0", "-"], ["32", "2", "4", "1", "4", "-1", "0", "0", "0", "0", "-"], ["31", "5", "4", "100", "4", "-1", "0", "0", "0", "0", "-"]];
currentlyEquipped = [["36", "1", "4", "20", "4", "-1", "0", "0", "0", "0", "-"]];
internaltimer = 0;
combineTable = [[32, 31, 5]];
treasureMapsAvailable = [["1", "Over the hills and far away..."]];
randomDungeonTreasureMapsAvailable = ["", "In the mines of the Barrows somewhere on level #"];
standardMapsAvailable = [["standard map name #1", 1], ["standard map name #2", 3], ["standard map name #3", 1], ["standard map name #4", 1]];
allTitlesAvailable = ["of Brambleton", "spider friend", "master craftsperson", "of Burntwood", "the fortunate", "collector", "expert collector"];
acctcharname = "Eleaddai";
charnumber = "1001";
enteredpassword = "dowsing";
transition = 0;
gamepaused = 0;
waitingforresponse = 0;
displayshouting = 3000;
HeroCannotMove = false;
shopisopen = false;
structureframe = 100;
isOnBoat = false;
dooropened = 0;
openingdoorx = 0;
openingdoory = 0;
numberOfFootprints = 8;
footPrintOffset = 10;
isTargetting = false;
isTargettingInventory = false;
currentHeroPrints = 0;
lastHeroPrintx = -1;
lastHeroPrinty = -1;
currentPetPrints = 0;
lastPetPrintx = -1;
lastPetPrinty = -1;
challengeissued = false;
isinplayershouse = false;
responsePointerOffset = 9;
responsePointerIndex = 0;
specialistbuy = 0.800000;
salemodifier = 0.600000;
specialistsell = 0.700000;
npcshouting = -1;
visx = 10;
visy = 10;
setUpLotteryPanel();
confirmAction = "";
currentLotteryAmount = -1;
breadcrumblength = 13;
breadcrumbx = new Array(breadcrumblength);
breadcrumby = new Array(breadcrumblength);
movedx = spacing / 2;
movedy = spacing / 2;
previousoffset = 0;
nudgescrollx = nudgescrolly = 0;
npcwaitingfordialogue = 0;
familiarfoundindex = -1;
familiarfoundHotspot = -1;
familiarsLastItem = -1;
familiarsLastHotspot = -1;
familiarstate = 0;
mabs = Math.abs;
msqrt = Math.sqrt;
mfloor = Math.floor;
mrand = Math.random;
mmax = Math.max;
mceil = Math.ceil;
keydown = Key.isDown;
framedepth = 1048575;
countedframes = 0;
tilemaxdepth = 1333;
maxobjdepthvalue = 36 * spacing;
isoplanewidth = 36 * tilewidth;
isoplaneheighthalved = 36 * spacing / 2;
storedxdir = 0;
storedydir = -1;
mapstatus = new Array();
var i = -1;
while (++i < 36)
{
    mapstatus[i] = new Array();
} // end while
isDowsing = false;
maxPossibleHeightForThisMap = 0;
whatslefttosay = "";
whatslefttoshout = "";
whatsleftnpcindex = -1;
whatsleftshoutnpcindex = -1;
keychallenge = 67;
keyaction = 17;
keypause = 80;
keydowse = 68;
keyQuickEquip = 9;
keyQuickEquip = 32;
keychallenge = 67;
keytoggleinv = 49;
keytogglepet = 50;
keytogglealbum = 90;
keytogglecardalbum = 65;
keytoggleother = 52;
keytoggleequip = 48;
keymoveleft = 37;
keymoveup = 38;
keymoveright = 39;
keymovedown = 40;
keysplit = 16;
keyconfirm = 13;
keyescape = 27;
keyquit = 81;
validkeypresses = ",48,49,50,51,52,53,54,55,56,57," + keychallenge + "," + keyaction + "," + keypause + "," + keydowse + "," + keychallenge + "," + keytoggleinv + "," + keytogglepet + "," + keyconfirm + "," + keyescape + "," + keytoggleother + "," + keyquit + "," + keyQuickEquip + "," + keytogglealbum + ",";
validkeydownpresses = "," + keymoveleft + "," + keymoveup + "," + keymoveright + "," + keymovedown + ",";
validinventorypresses = "," + keytoggleinv + "," + keytogglepet + "," + keyescape + "," + keytoggleother + "," + keytoggleequip + "," + keytogglecardalbum + "," + keytogglealbum + ",";
keyPressesThatCancelTargetting = "," + keymoveup + "," + keymovedown + "," + keymoveleft + "," + keymoveright + "," + keyescape + "," + keychallenge + ",";
whichkeyreleased = 0;
keypresslistener = new Object();
keypresslistener.onKeyUp = function ()
{
    var _loc1 = Key.getCode();
    if (validkeypresses.indexOf("," + _loc1 + ",") != -1)
    {
        if (isCrafting)
        {
            gamedisplay.inventorysets.craftingPanel.buttonsWrapper["skillClip" + (_loc1 - 48)].skillPressed = true;
        }
        else
        {
            whichkeyreleased = _loc1;
        } // end if
    } // end else if
    if (isTargetting)
    {
        if (keyPressesThatCancelTargetting.indexOf("," + _loc1 + ",") != -1)
        {
            cancelTargetting();
        } // end if
    } // end if
};
keypresslistener.onKeyDown = function ()
{
    var _loc1 = Key.getCode();
    if (validkeydownpresses.indexOf("," + _loc1 + ",") != -1)
    {
        whichkeyreleased = _loc1;
    } // end if
    if (isTargetting)
    {
        if (keyPressesThatCancelTargetting.indexOf("," + _loc1 + ",") != -1)
        {
            cancelTargetting();
        } // end if
    } // end if
};
Key.addListener(keypresslistener);
quests = [[0], [0, 2, "2.4.a", "1.2", "2.4", -1], [0, 2, "6.6.a", "1.10", 0, -1], [0, 0, "1.10.a", 0, 0, -1], [0, 0, "1.14.a", 0, 0, -1], [0, 0, "2.15.a", 0, 0, -1], [0, 2, "1.8.a", "1.10", "1.8", -1], [0, 0, "!0", 0, 0, -1], [0, 1, "!1|!2|!3", "2.4", 0, -1], [0, 2, "1.46.a", "1.10", 0, -1], [0, 1, "!4", "1.10", 0, -1]];
hotspots = [[0], [[1, 23, 4], [-1, 23, 14], [0, 8, 10]]];
randomDungeons = [[], ["The Barrow Mines", 0]];
collections = [["shell", 20, "R", "Shell lore example will go here quis nisl at nisi hendrerit laoreet sit amet interdum dui.", 25, 26, 27], ["cloth threads", 2, S100, "cloth lore", 6, 7]];
currentCollections = [[0, 0, 0], [0, 0]];
completedCollections = [0, 0];
currentCollectionAlbumPage = 0;
collectionTitles = [[2, 5], [10, 6]];
allPlayingCardsAvailable = ["", [5, 10, "goat", 2], [5, 10, "piranha", 2], [5, 10, "grendel", 2], [5, 10, "fish", 5]];
standardDecksAvailable = [[4, 4, 4, 4, 3, 3, 3, 4, 4, 4, 4, 3, 3, 3, 4, 4, 4, 4, 3, 3, 3], [1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 4], [2, 2, 2, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4]];
availableSkills = [["add durability #1", 1, 2, [["durability", "+", 20]], 0], ["add quality #1", 3, 0.500000, [["quality", "+", 10]], 0], ["add quality #2", 3, 0.200000, [["quality", "+", 50]], 0], ["increase 2 effectiveness", 2, 2, [["quality", "-", 5], ["effectiveness", "+", 10]], 2], ["finish quickly", 4, 2, [["time", "-", 10], ["quality", "+", 70]], 0], ["add quality #1", 3, 0.500000, [["durability", "+", 10]], 1], ["add quality #2", 3, 0.200000, [["durability", "+", 50]], 1], ["increase 2 effectiveness", 2, 2, [["quality", "-", 5], ["effectiveness", "+", 10]], 1], ["finish quickly", 4, 2, [["time", "-", 10], ["quality", "+", 70]], 1]];
professionsAvailable = ["Tailoring", "Dyeing", "Herbalism"];
changes = [];
inventory = new Array();
journal = new Array();
pets = new Array();
petiscalculatingpath = false;
var loadInv = new LoadVars();
loadInv.onLoad = function (success)
{
    if (success)
    {
        clearInterval(checkServerResponse);
        inventoryitems = new Array();
        recipesAvailable = new Array();
        crossBreeding = [[0, 0, 0]];
        var _loc3 = this.inventoryitems.split("|||");
        for (var _loc2 = 0; _loc2 < _loc3.length; ++_loc2)
        {
            inventoryitems[_loc2] = _loc3[_loc2].split("^^^");
        } // end of for
        var _loc4 = this.recipesavailable.split("|||");
        for (var _loc2 = 0; _loc2 < _loc4.length; ++_loc2)
        {
            recipesAvailable[_loc2] = _loc4[_loc2].split("^^^");
        } // end of for
        checkServerResponse = setInterval(serverTimedOut, 15000, "loadState");
        loadState.chrid = charnumber;
        loadState.sendAndLoad("http://www.autumnearth.com/getGameState.php", loadText);
    }
    else
    {
        clearInterval(checkServerResponse);
        errorloading("failed on loadInv");
    } // end else if
};
var loadState = new LoadVars();
var loadText = new LoadVars();
loadText.onLoad = function (success)
{
    if (success)
    {
        clearInterval(checkServerResponse);
        playsounds = this.playsounds;
        herox = parseInt(this.herox);
        heroy = parseInt(this.heroy);
        money = parseInt(this.money);
        minutesplayed = parseInt(this.minutesplayed);
        FamiliarSkillLevel = parseInt(this.famskill);
        catalogueQuestSkillRadius = 6;
        activeCatalogueQuests = [];
        currentmapnumber = parseInt(this.currentmapnumber);
        randomDungeonName = "";
        initialheight = parseInt(this.heightgained);
        _root.doubleClickSpeed = 300;
        charname = this.charname;
        if (this.petsave == "-")
        {
            haspet = false;
        }
        else
        {
            haspet = true;
            currentpet = unescape(this.petsave).split(",");
        } // end else if
        this.questItemsNeeded = "";
        questItemsNeeded = this.questItemsNeeded.split("|");
        this.mapstodestroy = "";
        mapsToDestroy = this.mapstodestroy.split("|");
        journal = unescape(this.journalsave).split("/");
        thisRecipesKnown = "0,1,2,3,4,5,6,8,9,10,11,12,13,14,15,16,17";
        recipesKnown = thisRecipesKnown.split(",");
        for (var _loc5 = 0; _loc5 < recipesKnown.length; ++_loc5)
        {
            recipesKnown[_loc5] = parseInt(recipesKnown[_loc5]);
        } // end of for
        thisPlayersTitles = [0, 3, 2];
        thisPlayersActiveTitle = 3;
        _root.characterNameWithTitle = acctcharname + " " + allTitlesAvailable[thisPlayersActiveTitle];
        gamedisplay.characterPanel.charName.text = _root.characterNameWithTitle;
        thisplayerCraftingSkill = "20034, 0, 0, 0";
        playerCraftingSkill = thisplayerCraftingSkill.split(",");
        for (var _loc5 = 0; _loc5 < playerCraftingSkill.length; ++_loc5)
        {
            playerCraftingSkill[_loc5] = parseInt(playerCraftingSkill[_loc5]);
        } // end of for
        thisknownSkills = "0, 1, 3, 4, 5, 6, 7, 8";
        knownSkills = thisknownSkills.split(",");
        for (var _loc5 = 0; _loc5 < knownSkills.length; ++_loc5)
        {
            knownSkills[_loc5] = parseInt(knownSkills[_loc5]);
        } // end of for
        thisPlayersContent = [[37, "titian", "Titian\'s Venus[*^*]"], [37, "velazquez", "Velazquez portrait"]];
        var _loc7 = unescape(this.inventorysave).split("/");
        for (var _loc5 = 0; _loc5 < _loc7.length; ++_loc5)
        {
            inventory[_loc5] = _loc7[_loc5].split(",");
        } // end of for
        currentbag = this.currentbag.split(",");
        var _loc9 = inventoryitems[currentbag[0]][2];
        var _loc14 = _loc9.indexOf("b");
        currentbagsize = parseInt(_loc9.substring(_loc14 + 1, _loc9.length));
        currentbagsize = 12;
        thisPlayingCardsOwned = "-,4,12,3,1";
        playingCardsOwned = thisPlayingCardsOwned.split(",");
        for (var _loc4 = 1; _loc4 < playingCardsOwned.length; ++_loc4)
        {
            playingCardsOwned[_loc4] = parseInt(playingCardsOwned[_loc4]);
        } // end of for
        thisStoredCraftedItem = "9,1,4,100,4,-1,0,2,0,0";
        storedCraftedItem = thisStoredCraftedItem.split(",");
        for (var _loc5 = 0; _loc5 < storedCraftedItem.length; ++_loc5)
        {
            storedCraftedItem[_loc5] = parseInt(storedCraftedItem[_loc5]);
        } // end of for
        lastSoldItems = [[["32", "8", "4", "1", "4", "-1", "0", "0", "0", "0", "-"], 199], [["36", "1", "4", "20", "4", "-1", "2", "0", "0", "0", "-"], 50]];
        maximumSoldItemHistory = 6;
        inventorysetup();
        initCollectionAlbum();
        var _loc8 = unescape(this.questsstatus).split("/");
        for (var _loc5 = 0; _loc5 < quests.length; ++_loc5)
        {
            quests[_loc5][0] = parseInt(_loc8[_loc5]);
        } // end of for
        questEvents = [0, 0, 0, 0, 0];
        currentTreasureMaps = [[1, 20, 13], [1, 12, 14]];
        allMapsOwned = [];
        userContentToLoad = [];
        standardMapsToLoad = [];
        for (var _loc5 = 0; _loc5 < inventory.length; ++_loc5)
        {
            if (inventoryitems[inventory[_loc5][0]][6] == "map")
            {
                var _loc6 = inventory[_loc5][7].split("|");
                allMapsOwned.push(_loc6);
            } // end if
            if (inventoryitems[inventory[_loc5][0]][2].indexOf("U") != -1)
            {
                userContentToLoad.push(inventory[_loc5][7]);
            } // end if
            if (inventoryitems[inventory[_loc5][0]][2].indexOf("m") != -1)
            {
                drawStandardMap(inventory[_loc5]);
            } // end if
        } // end of for
        for (var _loc5 = 0; _loc5 < petcarrying.length; ++_loc5)
        {
            if (inventoryitems[petcarrying[_loc5][0]][6] == "map")
            {
                _loc6 = petcarrying[_loc5][7].split("|");
                allMapsOwned.push(_loc6);
            } // end if
            if (inventoryitems[petcarrying[_loc5][0]][2].indexOf("U") != -1)
            {
                userContentToLoad.push(petcarrying[_loc5][7]);
            } // end if
            if (inventoryitems[petcarrying[_loc5][0]][2].indexOf("m") != -1)
            {
                drawStandardMap(petcarrying[_loc5]);
            } // end if
        } // end of for
        if (userContentToLoad.length > 0)
        {
            gamedisplay.preloadUserContent.gotoAndPlay("startLoad");
        } // end if
        for (var _loc5 in allMapsOwned)
        {
            for (var _loc3 = 0; _loc3 < currentTreasureMaps.length; ++_loc3)
            {
                if (allMapsOwned[_loc5][0] == currentTreasureMaps[_loc3][0])
                {
                    if (allMapsOwned[_loc5][1] == currentTreasureMaps[_loc3][1])
                    {
                        if (allMapsOwned[_loc5][2] == currentTreasureMaps[_loc3][2])
                        {
                            allMapsOwned.splice(_loc5, 1);
                        } // end if
                    } // end if
                } // end if
            } // end of for
        } // end of for...in
        cataloguesThatNeedData = 0;
        oldherox = herox;
        oldheroy = heroy;
        targettile1x = herox;
        targettile1y = heroy;
        targettile2x = herox;
        targettile2y = heroy;
        for (var _loc5 = 0; _loc5 < breadcrumblength; ++_loc5)
        {
            breadcrumbx[_loc5] = herox;
            breadcrumby[_loc5] = heroy;
        } // end of for
        attachMovie("empty", "scrollclip", 2);
        attachMovie("empty", "hiddenMapScrollclip", 3);
        hiddenMapScrollclip._x = 2000;
        hiddenMapScrollclip._y = -1000;
        var _loc12 = new MovieClipLoader();
        _loc12.loadClip("data/shared.swf", scrollclip);
        var _loc11 = new Object();
        _loc12.addListener(_loc11);
        _loc11.onLoadInit = function (target)
        {
            var _loc2 = new MovieClipLoader();
            _loc2.loadClip("data/maps/map" + currentmapnumber + ".swf", scrollclip);
            var _loc1 = new Object();
            _loc2.addListener(_loc1);
            _loc1.onLoadInit = function (target)
            {
                loadinitialxmlmap(currentmapnumber);
            };
            _loc1.onLoadError = function (target, errorCode, httpStatus)
            {
                errorloading("failed on init loading currentmapnumber swf");
                trace (">> errorCode: " + errorCode);
                trace (">> httpStatus: " + httpStatus);
            };
        };
        _loc11.onLoadError = function (target, errorCode, httpStatus)
        {
            errorloading("failed on init loading shared swf");
            trace (">> errorCode: " + errorCode);
            trace (">> httpStatus: " + httpStatus);
        };
    }
    else
    {
        clearInterval(checkServerResponse);
        errorloading("failed on loadText");
    } // end else if
};
var passtologin = new LoadVars();
var checkloginok = new LoadVars();
checkloginok.onLoad = function (success)
{
    if (success)
    {
        clearInterval(checkServerResponse);
        if (this.reply == "clientoutdated")
        {
            errorloading("client out of date");
        }
        else
        {
            this.reply = "passwordtrue";
            if (this.reply == "passwordtrue")
            {
                checkServerResponse = setInterval(serverTimedOut, 15000, "loadInv");
                loadInv.load("http://www.autumnearth.com/inventoryitems.php");
            }
            else if (this.reply == "passwordfalse")
            {
                
            } // end else if
        } // end else if
    }
    else
    {
        clearInterval(checkServerResponse);
        errorloading("failed checking log in");
    } // end else if
};
passtologin.username = acctcharname;
passtologin.enteredpassword = enteredpassword;
passtologin.clientversion = clientVersion;
checkServerResponse = setInterval(serverTimedOut, 15000, "passtologin");
passtologin.sendAndLoad("http://www.autumnearth.com/login.php", checkloginok);
stop ();
