
import flash.display.*;
import flash.geom.Matrix;
import flash.geom.Rectangle;
//
function attachempty() {
	gamedisplay.swapDepths(framedepth - 1);
	gamedisplay._x = 62;
	gamedisplay._y = 226;
	attachMovie("all_weather","weatherclip",framedepth - 2);
	// place above flat tiles, but below all structures and npcs etc:
	// tileOverlay holds all footprints and the targetting cursor
	scrollclip.attachMovie("all_footprints","tileOverlay",tilemaxdepth);
	scrollclip.tileOverlay._x = 0;
	scrollclip.tileOverlay._y = 0;
	scrollclip.tileOverlay.attachMovie("targetingCursor","targetCursor",1);
	scrollclip.tileOverlay.attachMovie("drawMagicCursor","drawMagicClip",2);
	// (draw magic clip indicates the magic being drawn from the earth and focussed through the caster)
	scrollclip.onRelease = function() {
		_root.targetClicked();
	};
	for (var i = 0; i < numberOfFootprints; i++) {
		// attach prints for hero:
		scrollclip.tileOverlay.attachMovie("humanFootprints","heroPrints" + i,i + footPrintOffset);
		scrollclip.tileOverlay["heroPrints" + i]._x = -9999;
		scrollclip.tileOverlay["heroPrints" + i]._y = -9999;
		// attach prints for pet - will need to match the current pet's species #########
		scrollclip.tileOverlay.attachMovie("humanFootprints","petPrints" + i,numberOfFootprints + i + footPrintOffset);
		scrollclip.tileOverlay["petPrints" + i]._x = -9999;
		scrollclip.tileOverlay["petPrints" + i]._y = -9999;
	}
}
function buildmap() {
	var i:Number = herox - visx - 2;
	var j:Number;
	var counter:Number;
	// -2 as needs to be 1 below the range of the loop
	while (++i <= (herox + visx + 1)) {
		j = heroy - visy - 2;
		while (++j <= (heroy + visy + 1)) {
			frame = parseInt(currentmap[i][j]);
			// if tile is defined in array, create tile
			if (frame) {
				if (frame < structureframe) {
					counter = calculatedepth(i, j);
				} else {
					counter = calculateobjectdepth(((spacing * (i + j)) + 1), (spacing / 2 * (i - j)));
					// all tiles are depth sorted at +1 so their 0,0 can't be the same as any sprites
				}
				scrollclip.attachMovie("tile","t_" + i + "_" + j,(counter));
				scrollclip["t_" + i + "_" + j]._x = spacing * (i + j);
				scrollclip["t_" + i + "_" + j]._y = (spacing / 2 * (i - j));
				scrollclip["t_" + i + "_" + j].gotoAndStop(frame);
			}
		}
	}
	scrollclipwidth = (maplengthx + maplengthy) * spacing;
	calculatescrolloffset((maplengthx - 1) / 2,(maplengthy - 1) / 2,herox,heroy);
	scrollclip._x = 400 - (scrollclipwidth / 2) + buildxoffset;
	scrollclip._y = 240 + buildyoffset;
	//
	weatherclip._x = 400 - (scrollclipwidth / 2) + buildxoffset;
	weatherclip._y = 240 + buildyoffset;
	//
	placeitems();
	checkitemsvisible();
	createnpcs();
	// set weather conditions
	weatherclip.gotoAndStop(currentweather);
	// set paused layer off
	gamedisplay.showpaused._visible = 0;
	// set saving layer off
	gamedisplay.saving._visible = 0;
	// remove covering now world built
	gamedisplay.cover._visible = false;
	// hide response dialogue box
	gamedisplay.responsebox._visible = false;
	// move pointer:
	gamedisplay.responsebox.pointer._y = responsePointerOffset;
	responsePointerIndex = 0;
	//
	// set up and hide dialogue boxes:
	gamedisplay.dialoguebox._visible = false;
	// attach shouting box to scrollclip:
	handCursor.swapDepths(framedepth);
	scrollclip.attachMovie("box","timeddialoguebox",framedepth - 4);
	scrollclip.timeddialoguebox._visible = false;
	dialogueboxdisplayed = false;
	// check for distant scroll:
	if (scrollclip.hasDistantScroll) {
		scrollclip.attachMovie("distant","distantscroll",1);
		scrollclip.distantscroll._x = scrollclip.distantScrollx;
		scrollclip.distantscroll._y = scrollclip.distantScrolly;
	}
	scrollclip.attachMovie("groundGraphic","groundClip",2);
	scrollclip.groundClip._x = 0;
	scrollclip.groundClip._y = 0;
}
function placehero(hx:Number, hy:Number) {
	// attach hero to scrollclip
	var herostartdepth:Number = calculateobjectdepth((spacing * (hx + hy) + spacing), ((spacing / 2) * (hx - hy)));
	scrollclip.attachMovie("heromovie","hero",herostartdepth);
	// init hero object non-iso position:
	scrollclip.hero.px = ((hx + 0.5) * spacing);
	scrollclip.hero.py = ((hy + 0.5) * spacing);
	// the ...(+0.5)s ensures that the hero is centred tile 
	// these 2 lines...
	scrollclip.hero._x = (scrollclip.hero.px) + (scrollclip.hero.py);
	scrollclip.hero._y = ((scrollclip.hero.px) - (scrollclip.hero.py)) / 2;
	// ... hold the equations that govern the relationship
	// between on screen coords (_x, _y) and the tile/grid positions (x, y)
	// screen (0,0) needs to be the same as grid (0,0)
	// _x has an additional +spacing to centre hero on the tile
	//
	herowidth = (scrollclip.hero._width) / 2;
	heroheight = (scrollclip.hero._width) / 2;
	initialheightsetup();

}
function heightoftile(proposedmovex:Number, proposedmovey:Number) {
	// check for raised heights:
	var tileoffsetstr:String = String(scrollclip["t_" + proposedmovex + "_" + proposedmovey].h);
	if (tileoffsetstr.indexOf("/") != -1) {
		// is a split height tile, check hero's current height against both options
		var tilesheight:Array = tileoffsetstr.split("/");
		if (heightgained == parseInt(tilesheight[0])) {
			var thistileoffset:Number = parseInt(tilesheight[0]);
		} else if (heightgained == parseInt(tilesheight[1])) {
			var thistileoffset:Number = parseInt(tilesheight[1]);
		}
	} else {
		var thistileoffset:Number = parseInt(tileoffsetstr);
	}
	var heightchange:Number = thistileoffset - heightgained;
	return heightchange;
}
function scrolltiles() {
	// all tiles are depth sorted at ._x+1 so their 0,0 can't be the same as any sprites
	var frame:Number;
	//
	var newk:Number;
	var newj:Number;
	var counter:Number;
	if ((storedydir == 1)) {
		// moving towards NE or checking to see if moving up a height and force scrolling here
		var k:Number = heroy - visy - 2;
		var j:Number = herox - visx - 2;
		newk = heroy + visy + 1;
		while (j++ <= (herox + visx)) {
			frame = currentmap[j][newk];
			// calc depth
			if (frame < structureframe) {
				counter = calculatedepth(j, newk);
			} else {
				counter = calculateobjectdepth(((spacing * (j + newk)) + 1), (spacing / 2 * (j - newk)));
			}
			if (scrollclip["t_" + j + "_" + k]) {
				// if corresponding tile exists to move
				if (frame) {
					// ...and new tile to add exists in the array
					scrollclip["t_" + j + "_" + k]._x = spacing * (j + newk);
					scrollclip["t_" + j + "_" + k]._y = spacing / 2 * (j - newk);
					scrollclip["t_" + j + "_" + k].gotoAndStop(frame);
					scrollclip["t_" + j + "_" + k].swapDepths(counter);
					scrollclip["t_" + j + "_" + k]._name = "t_" + j + "_" + newk;
				} else {
					// remove old tile
					removeMovieClip(scrollclip["t_" + j + "_" + k]);
				}
			} else {
				// create new tile
				if (frame) {
					scrollclip.attachMovie("tile","t_" + j + "_" + newk,(counter));
					scrollclip["t_" + j + "_" + newk]._x = spacing * (j + newk);
					scrollclip["t_" + j + "_" + newk]._y = spacing / 2 * (j - newk);
					scrollclip["t_" + j + "_" + newk].gotoAndStop(frame);
				}
			}
		}
	} else if (storedydir == -1) {
		// moving towards SW
		var k:Number = heroy + visy + 2;
		var j:Number = herox - visx - 2;
		newk = heroy - visy - 1;
		while (j++ <= (herox + visx)) {
			frame = currentmap[j][newk];
			// calc depth
			if (frame < structureframe) {
				counter = calculatedepth(j, newk);
			} else {
				counter = calculateobjectdepth(((spacing * (j + newk)) + 1), (spacing / 2 * (j - newk)));
			}
			if (scrollclip["t_" + j + "_" + k]) {
				// if corresponding tile exists to move
				if (frame) {
					// ...and new tile to add exists in the array
					scrollclip["t_" + j + "_" + k]._x = spacing * (j + newk);
					scrollclip["t_" + j + "_" + k]._y = spacing / 2 * (j - newk);
					scrollclip["t_" + j + "_" + k].gotoAndStop(frame);
					scrollclip["t_" + j + "_" + k].swapDepths(counter);
					scrollclip["t_" + j + "_" + k]._name = "t_" + j + "_" + newk;
				} else {
					// remove old tile
					removeMovieClip(scrollclip["t_" + j + "_" + k]);
				}
			} else {
				// create new tile
				if (frame) {
					scrollclip.attachMovie("tile","t_" + j + "_" + newk,(counter));
					scrollclip["t_" + j + "_" + newk]._x = spacing * (j + newk);
					scrollclip["t_" + j + "_" + newk]._y = spacing / 2 * (j - newk);
					scrollclip["t_" + j + "_" + newk].gotoAndStop(frame);
				}
			}
		}
	}
	if (storedxdir == 1) {
		// moving towards SE
		var k:Number = heroy - visy - 2;
		var j:Number = herox - visx - 2;
		newj = herox + visx + 1;
		while (k++ <= (heroy + visy)) {
			frame = currentmap[newj][k];
			// calc depth
			if (frame < structureframe) {
				counter = calculatedepth(newj, k);
			} else {
				counter = calculateobjectdepth(((spacing * (newj + k)) + 1), (spacing / 2 * (newj - k)));
			}
			if (scrollclip["t_" + j + "_" + k]) {
				// if corresponding tile exists to move
				if (frame) {
					// ...and new tile to add exists in the array
					scrollclip["t_" + j + "_" + k]._x = spacing * (newj + k);
					scrollclip["t_" + j + "_" + k]._y = spacing / 2 * (newj - k);
					scrollclip["t_" + j + "_" + k].gotoAndStop(frame);
					scrollclip["t_" + j + "_" + k].swapDepths(counter);
					scrollclip["t_" + j + "_" + k]._name = "t_" + newj + "_" + k;
				} else {
					// remove old tile
					removeMovieClip(scrollclip["t_" + j + "_" + k]);
				}
			} else {
				// create new tile
				if (frame) {
					scrollclip.attachMovie("tile","t_" + newj + "_" + k,(counter));
					scrollclip["t_" + newj + "_" + k]._x = spacing * (newj + k);
					scrollclip["t_" + newj + "_" + k]._y = spacing / 2 * (newj - k);
					scrollclip["t_" + newj + "_" + k].gotoAndStop(frame);
				}
			}
		}
	} else if ((storedxdir == -1)) {
		// moving towards NW
		var k:Number = heroy - visy - 2;
		var j:Number = herox + visx + 2;
		newj = herox - visx - 1;
		while (k++ <= (heroy + visy)) {
			frame = currentmap[newj][k];
			// calc depth
			if (frame < structureframe) {
				counter = calculatedepth(newj, k);
			} else {
				counter = calculateobjectdepth(((spacing * (newj + k)) + 1), (spacing / 2 * (newj - k)));
			}
			if (scrollclip["t_" + j + "_" + k]) {
				// if corresponding tile exists to move
				if (frame) {
					// ...and new tile to add exists in the array
					scrollclip["t_" + j + "_" + k]._x = spacing * (newj + k);
					scrollclip["t_" + j + "_" + k]._y = spacing / 2 * (newj - k);
					scrollclip["t_" + j + "_" + k].gotoAndStop(frame);
					scrollclip["t_" + j + "_" + k].swapDepths(counter);
					scrollclip["t_" + j + "_" + k]._name = "t_" + newj + "_" + k;
				} else {
					// remove old tile
					removeMovieClip(scrollclip["t_" + j + "_" + k]);
				}
			} else {
				// create new tile
				if (frame) {
					scrollclip.attachMovie("tile","t_" + newj + "_" + k,(counter));
					scrollclip["t_" + newj + "_" + k]._x = spacing * (newj + k);
					scrollclip["t_" + newj + "_" + k]._y = spacing / 2 * (newj - k);
					scrollclip["t_" + newj + "_" + k].gotoAndStop(frame);
				}
			}
		}
	}
}
function findtilenumber(coordinatex:Number, coordinatey:Number, type:String) {
	// to determine x and y from any given _x and _y use:
	// x = (_x/spacing + 2*_y/spacing)/2;
	// y = (_x/spacing - 2*_y/spacing)/2;
	// 
	if (type == "x") {
		return mfloor((coordinatex / spacing));
	} else {
		return mfloor((coordinatey / spacing));
	}
}
function changemaps(newmap:Number, newherox:Number, newheroy:Number) {
	// stop main loop:
	oktoloop = false;
	oldmap = currentmapnumber;
	var oldmapbuilding = mapbuilding;
	var pathremaining:String;
	var totalpath:String;
	oldherox = herox;
	oldheroy = heroy;
	// check for newly entering a random dungeon:
	if ((newmap < 0) && (currentmapnumber > 0)) {
		randomDungeonName = randomDungeons[mabs(newmap)][0];
		currentmapnumber = -1;
		// empty the current map drawings:
		currentDungeonCartographicMap = [];
	} else {
		currentmapnumber = newmap;
	}
	herox = newherox;
	heroy = newheroy;
	//
	// before removing NPCs need to check any path followers and save their current position to their array
	for (g in currentnpcs) {
		var thisnpc:Object = scrollclip["n_" + g];
		switch (currentnpcs[g][1]) {
			case "1" :
				// is a random mover
				break;
			case "2" :
				// need to check for any "T", "/" or ">" in the remaining part of the NPC's path
				// so that they can be moved to their end location or removed as appropriate.
				// find path remaining:
				totalpath = currentnpcs[g][7];
				pathremaining = totalpath.substr(thisnpc.pathmarker, totalpath.length);
				var indexoft:Number = pathremaining.indexOf("T");
				var indexofslash:Number = pathremaining.indexOf("/");
				// find which point to use, as both / and T need the same behaviour, but there may be both of these present in the remaining path:
				var pointtouse:Number = -1;
				if (indexofslash != -1) {
					pointtouse = indexofslash;
				}
				// the "T" always will come before the "/" so check to that point:                                                                                                                         
				if (indexoft != -1) {
					pointtouse = indexoft;
				}
				if (pointtouse != -1) {
					// need to forward the npc so that they are fully on the next tile's centre:
					while ((thisnpc.xdistance < spacing) && (thisnpc.ydistance < spacing)) {
						if (thisnpc.xdir != 0) {
							thisnpc.xdistance += thisnpc.speed;
						} else if (thisnpc.ydir != 0) {
							thisnpc.ydistance += thisnpc.speed;
						}
					}
					// is now at tile centre - continue its path until it comes to the "T":
					// find current tile:
					npcxtile = findtilenumber(thisnpc.px, thisnpc.py, "x");
					npcytile = findtilenumber(thisnpc.px, thisnpc.py, "y");
					var pathrunthrough:Number = -1;
					while (++pathrunthrough < (pointtouse - 1)) {
						// get new xdir,ydir from string
						thisdirection = pathremaining.substr(pathrunthrough, 1);
						switch (thisdirection) {
							case "1" :
								// move NE - change facing and move to tile
								npcytile++;
								break;
							case "2" :
								// move SE
								npcxtile++;
								break;
							case "3" :
								// move SW
								npcytile--;
								break;
							case "4" :
								// move NW
								npcxtile--;
								break;
						}
					}
					thisnpc.xtile = npcxtile;
					thisnpc.ytile = npcytile;
					// now know which title the npc stops at - 
					// find their facing:
					thisdirection = totalpath.substr(pointtouse + 1, 1);
					thisnpc.xdir = 0;
					thisnpc.ydir = 0;
					switch (thisdirection) {
						case "1" :
							// move NE 
							thisnpc.ydir = 1;
							break;
						case "2" :
							// move SE
							thisnpc.xdir = 1;
							break;
						case "3" :
							// move SW
							thisnpc.ydir = -1;
							break;
						case "4" :
							// move NW
							thisnpc.xdir = -1;
							break;
					}
					// set them up to talk
					thisnpc.nottalking = 0;
					thisnpc.xdir = 0;
					thisnpc.ydir = 0;
					// ########### how to store facing, but not have them move? (ie need xdir and ydir = 0 to not be stationary
					thisnpc.hasStopped = 1;
					thisnpc.followingpath = 0;
					// ########### remove the preceeding part of their path, up to indexoft:
					//save changes to changes array:
					addtochanges([oldmap, 1, g, (currentnpcs[g].join(","))]);
				} else if (pathremaining.indexOf(">") != -1) {
					// remove npc from this map, find details for which map to add it to and add those
					// check if the destination map is the new currentmap and add path to move to the start location
					var newnpcdatatoadd = scrollclip.npcnewinfo;
					if (scrollclip.npcnewmap == currentmapnumber) {
						var newnpcdata = newnpcdatatoadd.split(",");
						// add path:
						newnpcdata[7] = scrollclip.npcpathtolocation + newnpcdata[7];
						newnpcdatatoadd = newnpcdata.join(",");
					}
					addtochanges([oldmap, 1, g, -1]);
					addtochanges([scrollclip.npcnewmap, 1, 0, "add", newnpcdatatoadd]);
				} else {
					// is an ordinary path follower, so save value
					currentnpcs[g][8] = scrollclip["n_" + g].pathmarker;
					//save changes to changes array:
					addtochanges([oldmap, 1, g, (currentnpcs[g].join(","))]);
				}
				break;
			default :
				// do nothing
		}
		currentnpcs[g][3] = thisnpc.xtile;
		currentnpcs[g][4] = thisnpc.ytile;
		currentnpcs[g][5] = thisnpc.xdir;
		currentnpcs[g][6] = thisnpc.ydir;
		//save changes to changes array:
		addtochanges([oldmap, 1, g, (currentnpcs[g].join(","))]);
		// now remove previous npcs
		removeMovieClip(scrollclip["n_" + g]);
	}
	// 
	pathmarkeroffset = 0;
	// this offset will hold how far along the path any path-follow NPCs would have got
	// perform tests to see if hero has moved into or out of a building
	if (mapbuilding == "t") {
		// is in a building
		if (oldmapbuilding == "f") {
			// and previous map wasn't
			// start timer
			countedframes = 0;
		}
	} else if (oldmapbuilding == "f") {
		// previous map wasn't in a building
		// randomly pick start index
		pathmarkeroffset = -1;
	} else {
		// hero has exited a building
		// stop timer
		// calculate pathfollower's movement along path
		pathmarkeroffset = ((countedframes) / spacing);
	}
	// set all waterd tiles and plant's timers to now
	for (var tilex = 0; tilex < maplengthx; tilex++) {
		for (var tiley = 0; tiley < maplengthy; tiley++) {
			if (farmTiles[tilex][tiley][0] == 1) {
				farmTiles[tilex][tiley][2] = minutesplayed;
				// ########### add to changes
			}
		}
	}
	for (g in displayitems) {
		if (inventoryitems[parseInt(displayitems[g][2])][2].indexOf("k") != -1) {
			displayitems[g][5] = minutesplayed;
			// ########### add to changes
		}
	}
	// remove npc footprints:
	for (var g in scrollclip.tileOverlay) {
		if (scrollclip.tileOverlay[g]._name.indexOf("npc") != -1) {
			scrollclip.tileOverlay[g].removeMovieClip();
		}
	}
	// remove all old tiles
	var ix:Number = oldherox - visx - 3;
	// -3 to be 1 below the range of the loop
	while (++ix <= (oldherox + visx + 2)) {
		var iy:Number = (oldheroy - visy - 3);
		while (++iy <= (oldheroy + visy + 2)) {
			// if tile exists, remove it, and any items on it
			removeMovieClip(scrollclip["t_" + ix + "_" + iy]);
			removeMovieClip(scrollclip["i_" + ix + "_" + iy]);
		}
	}
	// remove heroclip as new one will be loaded in from shared library again:
	removeMovieClip(scrollclip["hero"]);
	// remove pet
	if (haspet) {
		removeMovieClip(scrollclip["pet"]);
	}
	removeMovieClip(scrollclip["timeddialoguebox"]);
	// load in map specific functions:     
	if (currentmapnumber < 0) {
		cleanDungeonURL = randomDungeonName.split(" ").join("-").toLowerCase();
		var scrollclipLoadPath = "data/maps/" + cleanDungeonURL + ".swf";
	} else {
		var scrollclipLoadPath = "data/maps/map" + currentmapnumber + ".swf";
	}
	var mapLoader:MovieClipLoader = new MovieClipLoader();
	mapLoader.loadClip(scrollclipLoadPath,scrollclip);
	var mapLoaderListener:Object = new Object();
	mapLoader.addListener(mapLoaderListener);
	mapLoaderListener.onLoadInit = function(target) {
		loadxmlmap(currentmapnumber);
	};
	mapLoaderListener.onLoadError = function(target:MovieClip, errorCode:String, httpStatus:Number) {
		errorloading("failed on changemaps load data map");
		trace(">> errorCode: " + errorCode);
		trace(">> httpStatus: " + httpStatus);
	};
}
function newmapinit() {
	// check to see if hero left a random dungeon:
	if (oldmap < 0) {
		if (currentmapnumber > 0) {
			// set the time that the hero was last in the dungeon:
			randomDungeons[mabs(currentmapnumber)][1] = minutesplayed;
		}
	}
	clearInterval(checkingLotteryAmount);
	// loop through changes array and update current information if appropriate
	for (var i = 0; i < changes.length; i++) {
		if (changes[i][0] == currentmapnumber) {
			// this change is relevant, so needs to added:
			switch (changes[i][1]) {
				case 5 :
					// is a plans change
					if (changes[i][2] == 1) {
						// is an addition
						currentplans.push(changes[i][3]);
					} else {
						// is a change to currently made item:
						currentplans[0] = changes[i][3];
					}
				case 4 :
					// is a weather change
					currentweather = parseInt(changes[i][2]);
					break;
				case 3 :
					// is an item change
					var itemindex:Number = changes[i][2];
					if (changes[i][3] == -1) {
						// is a removal
						displayitems.splice(itemindex,1);
					} else if (changes[i][3] == "add") {
						// is an addition:
						displayitems.push((changes[i][4]).split(","));
					} else {
						// is a change
						displayitems[itemindex] = (changes[i][3]).split(",");
					}
					break;
				case 2 :
					// is a tile change
					currentmap[(changes[i][2])][(changes[i][3])] = changes[i][4];
					break;
				case 1 :
					// is an npc change
					if (changes[i][3] == -1) {
						// is a removal
						currentnpcs.splice((changes[i][2]),1);
					} else if (changes[i][3] == "add") {
						// is an addition:
						currentnpcs.push((changes[i][4]).split(","));
					} else {
						// is an update
						currentnpcs[(changes[i][2])] = (changes[i][3]).split(",");
					}
					break;
				default :
					// do nothing
			}
		}
	}
	// check if this map contains any treasure maps that needs destroying:
	var storedUserContentToLoadLength = userContentToLoad.length;
	for (var i = 0; i < mapsToDestroy; i++) {
		for (g in displayitems) {
			invArrayRef = parseInt(displayitems[g][2]);
			if (inventoryitems[invArrayRef][6] == "map") {
				var thisItemsAttributes = displayitems[g][5].split("|");
				if (thisItemsAttributes[7] == mapsToDestroy[i]) {
					mapsToDestroy.splice(i,1);
					scrollclip["i_" + displayitems[g][0] + "_" + displayitems[g][1]].removeMovieClip();
					displayitems.splice(g,1);
					// add to changes #################
				}
			} else if (inventoryitems[invArrayRef][6] == "chest") {
				// check the contents of this chest for the map:
				var thisChestsContents = displayitems[g][5].split("|");
				for (var j = 0; j < thisChestsContents.length; j++) {
					var thisItemInTheChest = thisChestsContents[j].split(".");
					if (thisItemInTheChest[7] == mapsToDestroy[i]) {
						mapsToDestroy.splice(i,1);
						// remove this element and rebuild the array for this chest:
						thisChestsContents.splice(j,1);
						displayitems[g][5] = thisChestsContents.join("|");
						// add to changes #################
						break;
					}
					// check for any user generated content as well:                                                                                                                                                                                                                                                                                                                                                              
					if (inventoryitems[(thisItemInTheChest[0])][2].indexOf("U") != -1) {
						userContentToLoad.push(thisItemInTheChest[7]);
					}
				}
			}
			// check for any user generated content as well:                                                                                                                                                                                                                                                                                                                                                              
			if (inventoryitems[invArrayRef][2].indexOf("U") != -1) {
				var thisItemsAttributes = displayitems[g][5].split("|");
				userContentToLoad.push(thisItemsAttributes[7]);
			}
		}
	}
	// check if there is a user generated content vendor on this map - preload all user content icons if so:
	var userGeneratedVendorFound = false;
	for (var i = 0; i < scrollclip.shopcontents.length; i++) {
		if (scrollclip.shopcontents[i][0] == "userGeneratedVendor") {
			userGeneratedVendorFound = true;
			break;
		}
	}
	if (userGeneratedVendorFound) {
		for (var i = 0; i < thisPlayersContent.length; i++) {
			userContentToLoad.push(thisPlayersContent[i][1]);
		}
	}
	// start preloading the user content: (if new items have been added and the list was empty before - if the list wasn't empty, don't want to interrupt whichever one is loading currently)                                                                                                                                                                                                                                                                                                                                                         
	if ((userContentToLoad.length > 0) && (storedUserContentToLoadLength == 0)) {
		gamedisplay.preloadUserContent.gotoAndPlay("startLoad");
	}
	//                                                                                                                                                                                                                                                                                                                                                              
	var herostartdepth:Number = calculateobjectdepth((spacing * (herox + heroy) + spacing), ((spacing / 2) * (herox - heroy)));
	scrollclip.attachMovie("heromovie","hero",herostartdepth);
	// attach shouting box to scrollclip - 1048575 is the highest depth an MC can have:
	scrollclip.attachMovie("box","timeddialoguebox",1048574);
	scrollclip.timeddialoguebox._visible = false;
	//
	// fill breadcrumb array with herox and heroy:
	for (var i = 0; i < breadcrumblength; i++) {
		breadcrumbx[i] = herox;
		breadcrumby[i] = heroy;
	}
	// display familiar if the hero has one:
	if (FamiliarSkillLevel > 0) {
		scrollclip.hero.familiar._visible = true;
	} else {
		scrollclip.hero.familiar._visible = false;
	}
	if (familiarstate != 0) {
		// if the hero left the last map with the familiar away, then show animation of familiar rejoining hero:
		// show animation ############
		familiarstate = 0;
	}
	//                                                                                                                         
	familiarfoundindex = -1;
	// draw new tiles
	buildmap();
	for (var i = 0; i < numberOfFootprints; i++) {
		// hide prints until required:
		scrollclip.tileOverlay["heroPrints" + i]._x = -9999;
		scrollclip.tileOverlay["heroPrints" + i]._y = -9999;
		scrollclip.tileOverlay["petPrints" + i]._x = -9999;
		scrollclip.tileOverlay["petPrints" + i]._y = -9999;
	}
	if (currentweather == 6) {
		// show snowy footprints:
		scrollclip.tileOverlay._visible = true;
	} else {
		scrollclip.tileOverlay._visible = false;
	}
	// check for the door that the hero has just come through, and ensure that it is set to its fully open frame
	var useddoorx:Number = herox - storedxdir;
	var useddoory:Number = heroy - storedydir;
	scrollclip["t_" + useddoorx + "_" + useddoory].facing.a.gotoAndPlay(10);
	//
	petismoving = false;
	petiscalculatingpath = false;
	if (haspet) {
		// pet will start on the door tile
		var petdepth:Number = calculateobjectdepth(((spacing * (useddoorx + useddoory)) + spacing), (spacing / 2 * (useddoorx - useddoory)));
		scrollclip.attachMovie("npc" + currentpet[2],"pet",petdepth);
		scrollclip.pet.speed = parseInt(currentpet[0]);
		// init pet object non-iso position:
		scrollclip.pet.px = ((useddoorx + 0.5) * spacing);
		scrollclip.pet.py = ((useddoory + 0.5) * spacing);
		scrollclip.pet._x = (scrollclip.pet.px) + (scrollclip.pet.py);
		scrollclip.pet._y = ((scrollclip.pet.px) - (scrollclip.pet.py)) / 2;
		scrollclip.pet.awidth = (scrollclip.pet._width) / 2;
		scrollclip.pet.aheight = (scrollclip.pet._width) / 2;
		scrollclip.pet.xtile = useddoorx;
		scrollclip.pet.ytile = useddoory;
		scrollclip.pet.xdir = storedxdir;
		scrollclip.pet.ydir = storedydir;
		scrollclip.pet.gotoAndStop((scrollclip.pet.xdir) + (scrollclip.pet.ydir) * 2 + 3);
		scrollclip.pet.petclip.stop();
		petstate = 1;
		petismovingawayfromhero = false;
	}
	challengeissued = false;
	// move hero to new position
	scrollclip.hero.px = ((herox + 0.5) * spacing);
	scrollclip.hero.py = ((heroy + 0.5) * spacing);
	// the ...(+0.5)s ensures that the hero is centred tile 
	scrollclip.hero._x = (scrollclip.hero.px) + (scrollclip.hero.py);
	scrollclip.hero._y = ((scrollclip.hero.px) - (scrollclip.hero.py)) / 2;
	// turn hero to stored facing:
	scrollclip.hero.gotoAndStop(storedxdir + storedydir * 2 + 3);
	movedx = (spacing / 2);
	movedy = (spacing / 2);
	// reset this as will be in centre of tile
	npcwaitingfordialogue = 0;
	//
	isDowsing = false;
	initialheightsetup();

	// reset oldpos
	oldheroposx = scrollclip.hero._x;
	oldheroposy = scrollclip.hero._y;
	// check if there is a lottery vendor on this map:
	var allDialogue = scrollclip.dialogue.join(",");
	if (allDialogue.indexOf("*") != -1) {
		getPrizeFundAmount();
		checkingLotteryAmount = setInterval(getPrizeFundAmount, 60000);
	}
	checkFarmNewMap();

	checkUserContentInterval = setInterval(checkUserContentLoaded, 100);
	// re-init the targetting click:
	scrollclip.onRelease = function() {
		_root.targetClicked();
	};
}
function calculatescrolloffset(newx:Number, newy:Number, centreX, centreY) {
	// sets up offsets so that the map is centred on screen
	buildxoffset = 0;
	buildyoffset = 0;
	var xdiff:Number = mabs(newx - centreX);
	var ydiff:Number = mabs(newy - centreY);
	if (centreX < newx) {
		buildxoffset += spacing * xdiff;
		buildyoffset += spacing * xdiff / 2;
	} else if (centreX > newx) {
		buildxoffset -= spacing * xdiff;
		buildyoffset -= spacing * xdiff / 2;
	}
	if (centreY < newy) {
		buildxoffset += spacing * ydiff;
		buildyoffset -= spacing * ydiff / 2;
	} else if (centreY > newy) {
		buildxoffset -= spacing * ydiff;
		buildyoffset += spacing * ydiff / 2;
	}
}
function placeitems() {
	var g:Number;
	var itemgraphic:Number;
	var itemxtile:Number;
	var itemytile:Number;
	var invArrayRef:Number;
	var itemFacing:Number;
	var itemYOffset:Number;
	var counter:Number;
	var thisitem:Object;
	var itemoffsetx:Number;
	var itemoffsety:Number;
	userContentToDownload = [];
	for (g in displayitems) {
		itemxtile = parseInt(displayitems[g][0]);
		itemytile = parseInt(displayitems[g][1]);
		invArrayRef = parseInt(displayitems[g][2]);
		itemFacing = parseInt(displayitems[g][3]);
		itemYOffset = parseInt(displayitems[g][4]);
		itemoffsetx = parseFloat(inventoryitems[invArrayRef][3]);
		itemoffsety = parseFloat(inventoryitems[invArrayRef][4]);
		itemgraphic = parseInt(inventoryitems[invArrayRef][5]);


		// check if the item is a placeholder for a harvestable resource - don't place a graphic if it is:
		if (inventoryitems[invArrayRef][6] == "ph") {
			// allow a chance that the resource has re-spawned while the hero was away from this map (more likely than while hero is on map):
			if (!((herox == itemxtile) && (heroy == itemytile))) {
				if (!((scrollclip.pet.xtile == itemxtile) && (scrollclip.pet.ytile == itemytile))) {
					// check if the resource should respawn yet or not:
					var respawnRate:Number = parseInt(inventoryitems[(displayitems[g][2])][7]);
					// (random integer between 0-99) 
					if ((mfloor(mrand() * 100)) <= respawnRate) {
						// resource is always the one before the placeholder:   
						displayitems[g][2] = (parseInt(displayitems[g][2])) - 1;
						// add graphic:
						var invArrayRef = parseInt(displayitems[g][2]);
						var itemoffsetx = parseFloat(inventoryitems[invArrayRef][3]);
						var itemoffsety = parseFloat(inventoryitems[invArrayRef][4]);
						var itemgraphic = parseInt(inventoryitems[invArrayRef][5]);
						counter = calculateobjectdepth((itemxtile + itemoffsetx + itemytile + itemoffsety) * spacing, (itemxtile + itemoffsetx - itemytile - itemoffsety) * spacing / 2);
						scrollclip.attachMovie("items","i_" + itemxtile + "_" + itemytile,counter);
						// init item non-iso position:
						thisitem = scrollclip["i_" + itemxtile + "_" + itemytile];
						thisitem.px = ((itemxtile + itemoffsetx) * spacing);
						thisitem.py = ((itemytile + itemoffsety) * spacing);
						//
						thisitem._x = thisitem.px + thisitem.py;
						thisitem._y = ((thisitem.px) - (thisitem.py)) / 2;
						thisitem.gotoAndStop(itemgraphic);
						thisitem.facing.gotoAndStop(itemFacing);
						// add to changes:
						addtochanges([currentmapnumber, 3, g, (displayitems[g].join(","))]);
					}
				}
			}
		} else {
			counter = calculateobjectdepth((itemxtile + itemoffsetx + itemytile + itemoffsety) * spacing, (itemxtile + itemoffsetx - itemytile - itemoffsety) * spacing / 2);
			scrollclip.attachMovie("items","i_" + itemxtile + "_" + itemytile,counter);
			// init item non-iso position:
			thisitem = scrollclip["i_" + itemxtile + "_" + itemytile];
			thisitem.px = ((itemxtile + itemoffsetx) * spacing);
			thisitem.py = ((itemytile + itemoffsety) * spacing);
			thisitem._x = thisitem.px + thisitem.py;
			thisitem._y = (((thisitem.px) - (thisitem.py)) / 2) - itemYOffset;
			thisitem.gotoAndStop(itemgraphic);
			thisitem.facing.gotoAndStop(itemFacing);
			// check this item's attributes to see if it is has user generated content:
			if (inventoryitems[invArrayRef][2] == "U") {
				// filename is stored in colour attribute
				var thisItemsAttributes = displayitems[g][5].split(".");
				userContentToDownload.push(thisItemsAttributes[7]);
				thisitem.a.filePath = thisItemsAttributes[7];
				thisitem.a.gotoAndPlay("loadImage");
			}
			// check if it's an Activate or Toggle type, and check the relevant questEvents entry to see what state it should be in:                    
			var itemActionType = inventoryitems[displayitems[g][2]][6];
			if ((itemActionType == "toggle") || (itemActionType == "activate")) {
				var thisAssociatedQuestEventState = questEvents[(displayitems[g][5])];
				if (thisAssociatedQuestEventState == 1) {
					thisitem.a.gotoAndStop("turnedOn");
				}
				// (the default will be 'turned off')                    
			}
			//                                                                                                                                                                                                                                            
			//
			//
			// ############ these map preparing routines need checking:
			//
			// check if this a standard map and prepare the map if so:
			if (inventoryitems[invArrayRef][2].indexOf("m") != -1) {
				drawStandardMap(displayitems[g][5].split("|"));
			}
			if (inventoryitems[invArrayRef][6] == "chest") {
				// check the contents of this chest for a map:
				var thisChestsContents = displayitems[g][5].split("|");
				for (var j = 0; j < thisChestsContents.length; j++) {
					var thisItemInTheChest = thisChestsContents[j].split(".");
					if (inventoryitems[(thisItemInTheChest[j][0])][2].indexOf("m") != -1) {
						// temp removed as not correct attributes being passed: ##############
						// drawStandardMap(thisItemInTheChest[j][5].split("|"));
					}
				}
			}
			// ############# ... end need checking                                                                                                                                                                                                                                            
		}
	}
	// check for collection objects:
	if (scrollclip.collectionLocationsX.length > 0) {
		// randomly determine number:
		var numberOfCollectionItems = scrollclip.objectChance[mfloor(mrand() * ((scrollclip.objectChance.length)))];
		var itemsAlreadyPlacedX = [];
		var itemsAlreadyPlacedY = [];
		for (var i = 0; i <= numberOfCollectionItems; i++) {
			// get location:
			var locationIndex = mfloor(mrand() * ((scrollclip.collectionLocationsX.length)));
			var collectionXTarget = parseInt(scrollclip.collectionLocationsX[locationIndex]);
			var collectionYTarget = parseInt(scrollclip.collectionLocationsY[locationIndex]);
			var okToPlaceThisItem = true;
			// check this isn't where the hero is, the pet is, or another collection item already is:
			if ((collectionXTarget == herox) && (collectionYTarget == heroy)) {
				okToPlaceThisItem = false;
			}
			if (haspet) {
				if ((collectionXTarget == scrollclip.pet.xtile) && (collectionYTarget == scrollclip.pet.ytile)) {
					okToPlaceThisItem = false;
				}
			}
			for (var j = 0; j < itemsAlreadyPlacedX.length; j++) {
				if ((itemsAlreadyPlacedX[j] == collectionXTarget) && (itemsAlreadyPlacedY[j] == collectionYTarget)) {
					okToPlaceThisItem = false;
					break;
				}
			}
			if (okToPlaceThisItem) {
				itemsAlreadyPlacedX.push(collectionXTarget);
				itemsAlreadyPlacedY.push(collectionYTarget);
				invArrayRef = scrollclip.collectionItems[mfloor(mrand() * ((scrollclip.collectionItems.length)))];
				itemoffsetx = parseFloat(inventoryitems[invArrayRef][3]);
				itemoffsety = parseFloat(inventoryitems[invArrayRef][4]);
				itemgraphic = parseInt(inventoryitems[invArrayRef][5]);
				counter = calculateobjectdepth((collectionXTarget + itemoffsetx + collectionYTarget + itemoffsety) * spacing, (collectionXTarget + itemoffsetx - collectionYTarget - itemoffsety) * spacing / 2);
				scrollclip.attachMovie("items","i_" + collectionXTarget + "_" + collectionYTarget,counter);
				// init item non-iso position:
				thisitem = scrollclip["i_" + collectionXTarget + "_" + collectionYTarget];
				thisitem.px = ((collectionXTarget + itemoffsetx) * spacing);
				thisitem.py = ((collectionYTarget + itemoffsety) * spacing);
				thisitem._x = thisitem.px + thisitem.py;
				thisitem._y = ((thisitem.px) - (thisitem.py)) / 2;
				thisitem.gotoAndStop(itemgraphic);
				displayitems.push([collectionXTarget, collectionYTarget, invArrayRef, 1, 0]);
			}
		}
	}
}
function checkitemsvisible() {
	var g:Number;
	var itemtype:Number;
	var itemxtile:Number;
	var itemytile:Number;
	var itemvisible:Boolean;
	for (g in displayitems) {
		itemxtile = parseInt(displayitems[g][0]);
		itemytile = parseInt(displayitems[g][1]);
		if (inventoryitems[parseInt(displayitems[g][2])][6] != "ph") {
			itemvisible = false;
			if (itemxtile >= (herox - visx)) {
				if (itemxtile <= (herox + visx)) {
					if (itemytile >= (heroy - visy - 1)) {
						if (itemytile <= (heroy + visy)) {
							itemvisible = true;
						}
					}
				}
			}
			scrollclip["i_" + itemxtile + "_" + itemytile]._visible = itemvisible;
		} else {
			// is a placeholder for resource:
			// check that hero or pet isn't standing where the resource should re-spawn:
			if (!((herox == itemxtile) && (heroy == itemytile))) {
				if (haspet && !((scrollclip.pet.xtile == itemxtile) && (scrollclip.pet.ytile == itemytile))) {
					// check if the resource should respawn yet or not:
					var respawnRate:Number = parseInt(inventoryitems[(displayitems[g][2])][7]);
					// (random integer between 0-999) 
					if ((mfloor(mrand() * 1000)) <= respawnRate) {
						// resource is always the one before the placeholder:   
						displayitems[g][2] = (parseInt(displayitems[g][2])) - 1;
						// add graphic:
						var invArrayRef = parseInt(displayitems[g][2]);
						var itemoffsetx = parseFloat(inventoryitems[invArrayRef][3]);
						var itemoffsety = parseFloat(inventoryitems[invArrayRef][4]);
						var itemgraphic = parseInt(inventoryitems[invArrayRef][5]);
						counter = calculateobjectdepth((itemxtile + itemoffsetx + itemytile + itemoffsety) * spacing, (itemxtile + itemoffsetx - itemytile - itemoffsety) * spacing / 2);
						scrollclip.attachMovie("items","i_" + itemxtile + "_" + itemytile,counter);
						// init item non-iso position:
						thisitem = scrollclip["i_" + itemxtile + "_" + itemytile];
						thisitem.px = ((itemxtile + itemoffsetx) * spacing);
						thisitem.py = ((itemytile + itemoffsety) * spacing);
						//
						thisitem._x = thisitem.px + thisitem.py;
						thisitem._y = ((thisitem.px) - (thisitem.py)) / 2;
						thisitem.gotoAndStop(itemgraphic);
						// add to changes:
						addtochanges([currentmapnumber, 3, g, (displayitems[g].join(","))]);
						// set re-growth animation ready:
						thisitem.a.gotoAndStop(2);
					}
				}
			}
		}
		if (scrollclip["i_" + itemxtile + "_" + itemytile].ply) {
			// show animation:
			scrollclip["i_" + itemxtile + "_" + itemytile].facing.a.play();
		}
	}
}
function createnpcs() {
	// NPCs - speed, movement type (0-static, 1-random-moving, 2-path following, 3-pathfinder), graphic, position , direction, path (if one), [either 'end location for pathfinder' or 'pathfollower start index,null'] , name, response to a card challenge and speech
	var g:Number;
	var npcxtile:Number;
	var npcytile:Number;
	var counter:Number;
	var thisnpc:Object;
	var adirection:String;
	var thisdirection:String;
	var pathrunthrough:Number;
	var thisnpcmarkeroffset:Number;
	// clear previous npcPrints and set up prints for this map
	// npcPrints = [[currentIndex], [lastPrintX], [lastPrintY]] where the NPC's index matches this array's index
	npcPrints = [];
	npcsLookingForPaths = [];
	for (g in currentnpcs) {
		var npctype:Number = parseInt(currentnpcs[g][1]);
		npcxtile = parseInt(currentnpcs[g][3]);
		npcytile = parseInt(currentnpcs[g][4]);
		counter = calculateobjectdepth(((spacing * (npcxtile + npcytile)) + spacing), (spacing / 2 * (npcxtile - npcytile)));
		if (npctype == 10) {
			// is a ghost
			// offset depth: 
			counter = calculateobjectdepth((((spacing * (npcxtile + npcytile)) + spacing) + 1), (spacing / 2 * (npcxtile - npcytile)));
		}
		scrollclip.attachMovie("npc" + parseInt(currentnpcs[g][2]),"n_" + g,(counter));
		thisnpc = scrollclip["n_" + g];
		thisnpc.xtile = npcxtile;
		thisnpc.ytile = npcytile;
		thisnpc.speed = parseFloat(currentnpcs[g][0]);
		// init npc object non-iso position:
		thisnpc.px = ((npcxtile + 0.5) * spacing);
		thisnpc.py = ((npcytile + 0.5) * spacing);
		thisnpc._x = (thisnpc.px) + (thisnpc.py);
		thisnpc._y = ((thisnpc.px) - (thisnpc.py)) / 2;
		thisnpc.awidth = (thisnpc._width) / 2;
		thisnpc.aheight = (thisnpc._width) / 2;
		thisnpc.speechcounter = 0;
		// followingpath is used to determine whether the npc should follow a path or not
		thisnpc.followingpath = 0;
		thisnpc.xdir = parseInt(currentnpcs[g][5]);
		thisnpc.ydir = parseInt(currentnpcs[g][6]);
		thisnpc.isSpeaking = true;
		thisnpc.animationLookaheadPathFind = false;
		thisnpc.pathfindingTargetTerrain = -1;
		thisnpc.tilesToAvoid = "";
		thisnpc.hitTargetTerrain = false;
		thisnpc.currentWalkingAnimation = "walk";
		// .i is used to count animation sequences:
		thisnpc.npcclip.i = 9999;
		thisnpc.nottalking = 0;
		thisnpc.hasStopped = 0;
		// stopped is used to make sure that when un-pausing, then NPC doesn't re-animate when it shouldn't
		switch (npctype) {
			case 0 :
				// standing still NPC
				thisnpc.gotoAndStop((thisnpc.xdir) + (thisnpc.ydir) * 2 + 3);
				thisnpc.npcclip.gotoAndStop("stand");

				thisnpc.hasStopped = 1;
				break;
			case 1 :
				// moving NPC
				thisnpc.xdistance = 0;
				thisnpc.ydistance = 0;
				thisnpc.followingpath = 2;
				thisnpc.gotoAndStop((thisnpc.xdir) + (thisnpc.ydir) * 2 + 3);
				thisnpc.npcclip.gotoAndStop(thisnpc.currentWalkingAnimation);
				break;
			case 2 :
				// path following NPC:
				thisnpc.followingpath = 1;
				thisnpc.xdistance = 0;
				thisnpc.ydistance = 0;
				thisnpc.gotoAndStop((thisnpc.xdir) + (thisnpc.ydir) * 2 + 3);
				thisnpc.pathmarker = 0;
				// check to see if it needs to find a path:


				if (currentnpcs[g][7].substr(thisnpc.pathmarker, 1) == "P") {
					thisnpc.npcclip.gotoAndStop("stand");
					doNPCPathfind(g);

				}

				break;
			case 3 :
				// pathfinding NPC
				// can use  initial xdir,ydir, then subsequent xdir,ydir come from string
				thisnpc.gotoAndStop((thisnpc.xdir) + (thisnpc.ydir) * 2 + 3);
				thisnpc.npcclip.gotoAndStop(thisnpc.currentWalkingAnimation);
				thisnpc.pathmarker = 0;
				// path marker tracks the next target direction from the string
				thisnpc.xdistance = spacing;
				thisnpc.ydistance = 0;
				// tracks _x distance travelled from 1 tile to the next
				// setting it equal to spacing forces it to pick up the direction from the string
				// rather than start heading off in the direction it happened to be facing in
				thisnpc.reactiondist = 3;
				// maximum distance in tiles that the hero will be to get a reaction
				thisnpc.initialspeech = 9;
				// used to check if the NPC has spoken to the hero yet or not
				break;
			case 10 :
				thisnpc.gotoAndStop((thisnpc.xdir) + (thisnpc.ydir) * 2 + 3);
				thisnpc.npcclip.gotoAndStop(thisnpc.currentWalkingAnimation);
				break;
			default :
				// do nothing
		}

		thisnpc.storedxdir = thisnpc.xdir;
		thisnpc.storedydir = thisnpc.ydir;

		if (currentnpcs[g][7].substr(thisnpc.pathmarker, 1) != "P") {

			if (thisnpc.followingpath == 1) {
				// check that the npc has a path first:
				if (currentnpcs[g][7] != "0") {
					//
					// can use initial xdir,ydir, then subsequent xdir,ydir come from string
					if (pathmarkeroffset == -1) {
						// randomly set start
						thisnpcmarkeroffset = random(((currentnpcs[g][7]).length) - 1);
						// -1 to remove 'x' at the end of the string
					} else {
						// calculate how far along path it would have travelled from saved position
						thisnpcmarkeroffset = mfloor((((pathmarkeroffset / thisnpc.speed) + (parseInt(currentnpcs[g][8]))) % (((currentnpcs[g][7]).length) - 1))) + 1;
						// +1 to ensure that it's moved along at least 1 tile, otherwise if hero returns quickly, could look like NPC went backwards
					}
					// 
					// nudge forwards to first tile, and then begin loop to find location from there
					if (thisnpc.ydir == 1) {
						npcytile++;
					} else if (thisnpc.xdir == 1) {
						npcxtile++;
					} else if (thisnpc.ydir == -1) {
						npcytile--;
					} else if (thisnpc.xdir == -1) {
						npcxtile--;
					}
					// run through path and calculate start tile and direction                                                                                                                   
					var runthroughmarker:Number = 0;
					pathrunthrough = -1;
					var adirection:String = currentnpcs[g][7];
					//
					while (++pathrunthrough < (thisnpcmarkeroffset - 1)) {
						// get new xdir,ydir from string
						thisdirection = adirection.substr(runthroughmarker, 1);
						runthroughmarker++;
						if (thisdirection == "x") {
							// end of sequence, need to reset
							runthroughmarker = 0;
							thisdirection = adirection.substr(runthroughmarker, 1);
						}
						thisnpc.ydir = thisnpc.xdir = 0;
						if (thisdirection == "1") {
							// move NE - change facing and move to tile
							thisnpc.ydir = 1;
							npcytile++;
						} else if (thisdirection == "2") {
							// move SE
							thisnpc.xdir = 1;
							npcxtile++;
						} else if (thisdirection == "3") {
							// move SW
							thisnpc.ydir = -1;
							npcytile--;
						} else if (thisdirection == "4") {
							// move NW
							thisnpc.xdir = -1;
							npcxtile--;
						}
					}
					// found correct tile, now find new facing
					thisdirection = adirection.substr(runthroughmarker, 1);
					if (thisdirection == "x") {
						// end of sequence, need to reset
						runthroughmarker = 0;
						thisdirection = adirection.substr(runthroughmarker, 1);
					}
					thisnpc.ydir = thisnpc.xdir = 0;
					if (thisdirection == "1") {
						// move NE - change facing and move to tile
						thisnpc.ydir = 1;
					} else if (thisdirection == "2") {
						// move SE
						thisnpc.xdir = 1;
					} else if (thisdirection == "3") {
						// move SW
						thisnpc.ydir = -1;
					} else if (thisdirection == "4") {
						// move NW
						thisnpc.xdir = -1;
					}
					//                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
					// move NPC to this new position
					if (npctype == 10) {
						//is a ghost - offset swapdepths
						counter = calculateobjectdepth((((spacing * (npcxtile + npcytile)) + spacing) + 1), (spacing / 2 * (npcxtile - npcytile)));
						thisnpc.swapDepths(counter);
					} else if (npctype > 0) {
						// no point swapping depths if it's stationary
						counter = calculateobjectdepth(((spacing * (npcxtile + npcytile)) + spacing), (spacing / 2 * (npcxtile - npcytile)));
						thisnpc.swapDepths(counter);
					}
					thisnpc.gotoAndStop((thisnpc.xdir) + (thisnpc.ydir) * 2 + 3);
					thisnpc.npcclip.gotoAndStop(thisnpc.currentWalkingAnimation);
					thisnpc.xtile = npcxtile;
					thisnpc.ytile = npcytile;
					thisnpc.px = ((npcxtile + 0.5) * spacing);
					thisnpc.py = ((npcytile + 0.5) * spacing);
					thisnpc._x = (thisnpc.px) + (thisnpc.py);
					thisnpc._y = ((thisnpc.px) - (thisnpc.py)) / 2;
					thisnpc.xdistance = 0;
					thisnpc.ydistance = 0;
					// tracks _x distance travelled from 1 tile to the next
					thisnpc.pathmarker = thisnpcmarkeroffset;
					thisnpc.storedxdir = thisnpc.xdir;
					thisnpc.storedydir = thisnpc.ydir;
				} else {
					// has no path yet
					thisnpc.pathmarker = 0;
					thisnpc.storedxdir = 0;
					thisnpc.storedydir = 0;
				}
			}
		} else {
			thisnpc.storedxdir = 0;
			thisnpc.storedydir = 0;
		}
		// attach footprints for this NPC: (will need to graphically match NPC type #######)                                                                                                                 
		for (var i = 0; i < numberOfFootprints; i++) {
			scrollclip.tileOverlay.attachMovie("humanFootprints","npcPrints" + g + "_" + i,(numberOfFootprints * 2) + i + footPrintOffset);
			scrollclip.tileOverlay["npcPrints" + g + "_" + i]._x = -9999;
			scrollclip.tileOverlay["npcPrints" + g + "_" + i]._y = -9999;
		}
		npcPrints.push([0, -1, -1]);





	}
	checknpcsvisible();




}
function checknpcsvisible() {
	// check whether each npc is visible to the hero, and if not, make it invisible
	var g:Number;
	var npctype:Number;
	var counter:Number;
	var avisible:Boolean;
	for (g in currentnpcs) {
		npctype = parseInt(currentnpcs[g][1]);
		var thisnpc:Object = scrollclip["n_" + g];
		avisible = false;
		if ((thisnpc.xtile) >= (herox - visx - 1)) {
			if ((thisnpc.xtile) <= (herox + visx + 1)) {
				if ((thisnpc.ytile) >= (heroy - visy - 1)) {
					if ((thisnpc.ytile) <= (heroy + visy + 1)) {
						avisible = true;
						// calculate NPC's depth if visible
						if (npctype == 10) {
							// is a ghost - offset depth
							counter = calculateobjectdepth((thisnpc._x + 1), thisnpc._y);
							thisnpc.swapDepths(counter);
						} else if (npctype > 0) {
							// don't swap depth's if it's not moving
							counter = calculateobjectdepth(thisnpc._x, thisnpc._y);
							thisnpc.swapDepths(counter);
						}
					}
				}
			}
		}
		thisnpc._visible = avisible;
	}
}
function movenpcs() {
	// move any moving type NPCs
	var npctype:Number;
	var thisnpc:Object;
	var thischecknpc:Object;
	var thisitem:Object;
	var whichspeech:Number;
	var whatsaid:String;
	var islessx:Boolean;
	var ismorex:Boolean;
	var islessy:Boolean;
	var ismorey:Boolean;
	var ymove:Number;
	var xmove:Number;
	var npcleftcoord:Number;
	var npcrightcoord:Number;
	var npctopcoord:Number;
	var npcbottomcoord:Number;
	var npcbottomleftx:Number;
	var npcbottomlefty:Number;
	var npctopleftx:Number;
	var npctoplefty:Number;
	var npcbottomrightx:Number;
	var npcbottomrighty:Number;
	var npctoprightx:Number;
	var npctoprighty:Number;
	var moveok:Number;
	var tempx:Number;
	var tempy:Number;
	var h:Number;
	var q:Number;
	var itemtype:Number;
	var itemxtile:Number;
	var itemytile:Number;
	var endlocx:Number;
	var endlocy:Number;
	var adirection:String;
	var thisdirection:String;
	var proposedydir:Number;
	var proposedxdir:Number;
	var thisnpcattilecentre:Number;
	var storedframe:Number;
	var npcbeingremoved:Number = -1;
	var g:Number;
	for (g in currentnpcs) {
		npctype = parseInt(currentnpcs[g][1]);
		thisnpc = scrollclip["n_" + g];
		// 
		whichspeech = parseInt((currentnpcs[g][NPCStartSpeechIndex + (thisnpc.speechcounter)])) - 1;
		// -1 so that first reference is to array position '0'
		whatsaid = scrollclip.dialogue[whichspeech];
		// check if next bit of dialogue has a ']' and should be shouted out:
		if (whatsaid.indexOf("]") != -1) {
			// if it's within range:
			if (isinrange(scrollclip.hero.px, scrollclip.hero.py, thisnpc.px, thisnpc.py, (spacing * 3))) {
				islessx = (thisnpc.xtile < herox);
				ismorex = (thisnpc.xtile > herox);
				islessy = (thisnpc.ytile < heroy);
				ismorey = (thisnpc.ytile > heroy);
				// turn NPC to face hero
				if (ismorey) {
					thisnpc.gotoAndStop(1);
				} else if (islessy) {
					thisnpc.gotoAndStop(5);
				} else if (islessx) {
					thisnpc.gotoAndStop(4);
				} else if (ismorex) {
					thisnpc.gotoAndStop(2);
				}
				// store direction it was travelling into its array                                                                                                                                      
				if (!((thisnpc.xdir == 0) && (thisnpc.ydir == 0))) {
					// if to ensure that original stored xdir & ydir aren't overwritten (with 0,0)
					// if ctrl is pressed again
					thisnpc.storedxdir = thisnpc.xdir;
					thisnpc.storedydir = thisnpc.ydir;
					// temporarily stop it moving
					thisnpc.xdir = 0;
					thisnpc.ydir = 0;
				}
				// stop movement animation                                                                                                                         
				thisnpc.npcclip.gotoAndStop("stand");

				thisnpc.hasStopped = 1;
				updatePrints(g);
				// 
				speak(whatsaid,g);
			}
		} else {




			if (isinrange(scrollclip.hero.px, scrollclip.hero.py, thisnpc.px, thisnpc.py, spacing) && (thisnpc.nottalking != 1)) {
				// hero in proximity, and is talking (check both together, so that an npc can start moving to a new location
				// if prompted in their mapspecific code, without waiting for the hero to move away)
				// nottalking = 1 - isn't currently not responding (ie. racing, moving to new location etc)
				if (whichkeyreleased == keychallenge) {
					// 'C' pressed for a challenge to a card game - see if have enough cards:
					var cardsOwned = 0;
					for (var countCards = 1; countCards < playingCardsOwned.length; countCards++) {
						cardsOwned += playingCardsOwned[countCards];
					}
					if (cardsOwned < 12) {
						statusMessage("you need at least 12 cards to play");
					} else {
						challengeissued = true;
					}
				}
				if ((whichkeyreleased == keyaction) || (challengeissued == true)) {



					whichspeech = parseInt((currentnpcs[g][NPCStartSpeechIndex + (thisnpc.speechcounter)])) - 1;
					// -1 so that first reference is to array position '0'
					if (challengeissued) {
						whichspeech = (parseInt((currentnpcs[g][(NPCStartSpeechIndex - 1)]))) - 1;
						//[g][(NPCStartSpeechIndex-1)] dialogue is always for a card challenge
					}
					whatsaid = scrollclip.dialogue[whichspeech];
					// check to see if this npc is silent or not:
					if (whatsaid != "silent") {
						// is in adjacent tile, now check if hero is facing the NPC, unless the NPC is initiating the conversation
						islessx = (thisnpc.xtile < herox);
						ismorex = (thisnpc.xtile > herox);
						islessy = (thisnpc.ytile < heroy);
						ismorey = (thisnpc.ytile > heroy);
						if (((ismorey && (storedydir == 1)) or (islessy && (storedydir == -1)) or (islessx && (storedxdir == -1)) or (ismorex && (storedxdir == 1)))) {
							// turn NPC to face hero
							if (ismorey) {
								thisnpc.gotoAndStop(1);
							} else if (islessy) {
								thisnpc.gotoAndStop(5);
							} else if (islessx) {
								thisnpc.gotoAndStop(4);
							} else if (ismorex) {
								thisnpc.gotoAndStop(2);
							}
							// store direction it was travelling into its array                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
							if (!((thisnpc.xdir == 0) && (thisnpc.ydir == 0))) {
								// if to ensure that original stored xdir & ydir aren't overwritten (with 0,0)
								// if ctrl is pressed again
								thisnpc.storedxdir = thisnpc.xdir;
								thisnpc.storedydir = thisnpc.ydir;
								// temporarily stop it moving
								thisnpc.xdir = 0;
								thisnpc.ydir = 0;
							}
							// stop movement animation                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
							thisnpc.npcclip.gotoAndStop("stand");

							thisnpc.hasStopped = 1;
							updatePrints(g);
							// 
							speak(whatsaid,g);
							if (!challengeissued) {
								// don't increment speechcounter if it was a challenge:
								thisnpc.speechcounter++;
								if (thisnpc.speechcounter >= ((currentnpcs[g].length) - NPCStartSpeechIndex)) {
									thisnpc.speechcounter = 0;
								}
							}
						}
					} else {
						// cancel challenge if the npc is silent
						challengeissued = false;
					}
					whichkeyreleased = 0;
				}
			} else if (npcshouting != g) {
				// get direction from array as hero not in vicinity - if the npc isn't currently shouting something
				thisnpc.xdir = thisnpc.storedxdir;
				thisnpc.ydir = thisnpc.storedydir;
				if (!((npctype != 0) && (thisnpc.xdir == 0) && (thisnpc.ydir == 0))) {
					thisnpc.gotoAndStop((thisnpc.xdir) + (thisnpc.ydir) * 2 + 3);
					if (npctype == 0) {
						thisnpc.npcclip.gotoAndStop("stand");

						thisnpc.hasStopped = 1;
					} else {
						thisnpc.npcclip.gotoAndStop(thisnpc.currentWalkingAnimation);
						thisnpc.hasStopped = 0;
					}
				} else {
					if (thisnpc.npcclip.i == 9999) {
						// is a random moving npc that has been stopped by its animation, or a path follower stopped to speak as part of their path

						thisnpc.npcclip.gotoAndStop("stand");

						thisnpc.hasStopped = 1;
						updatePrints(g);
					}
				}
				if (npctype == 2) {
					if (currentnpcs[g][7] == "0") {
						// is a path follower, with no current path, so stop animation:
						thisnpc.npcclip.gotoAndStop("stand");

						thisnpc.hasStopped = 1;
						updatePrints(g);
					}
				}
			}
			if (npctype > 0) {











				if ((!((thisnpc.xdir == 0) && (thisnpc.ydir == 0))) || (thisnpc.hasStopped)) {

					// ie isn't stationary unless it's a random mover in which case it may have been stopped by the animation 
					// and needs to go through this loop to randomly choose a new direction
					if (thisnpc.followingpath != 0) {
						// move each walking NPC in turn, if it's not stationary (ie. talking), or a pathfinder with no current path
						ymove = thisnpc.speed * thisnpc.ydir;
						xmove = thisnpc.speed * thisnpc.xdir;
						moveok = 1;
						if (npctype != 10) {
							// ghost's don't do collision detection
							// work out tile that these xmove, ymove will move the NPC to
							// check all 4 corners...
							npcleftcoord = (xmove + thisnpc.px) - (thisnpc.awidth / 2);
							npcrightcoord = (xmove + thisnpc.px) + (thisnpc.awidth / 2);
							npctopcoord = (ymove + thisnpc.py) + (thisnpc.aheight / 2);
							// heightgained should only affect graphic placement, not collisions
							npcbottomcoord = (ymove + thisnpc.py) - (thisnpc.aheight / 2);
							//
							//
							npcbottomleftx = findtilenumber(npcleftcoord, npcbottomcoord, "x");
							npcbottomlefty = findtilenumber(npcleftcoord, npcbottomcoord, "y");
							npctopleftx = findtilenumber(npcleftcoord, npctopcoord, "x");
							npctoplefty = findtilenumber(npcleftcoord, npctopcoord, "y");
							npcbottomrightx = findtilenumber(npcrightcoord, npcbottomcoord, "x");
							npcbottomrighty = findtilenumber(npcrightcoord, npcbottomcoord, "y");
							npctoprightx = findtilenumber(npcrightcoord, npctopcoord, "x");
							npctoprighty = findtilenumber(npcrightcoord, npctopcoord, "y");
							// 
							// see if the NPC can move to target tile
							moveok = 0;

							var hitTerrainType = -1;


							if (thisnpc.ydir == 1) {
								if (islocationproperty(4, npctopleftx, npctoplefty)) {
									if (islocationproperty(4, npctoprightx, npctoprighty)) {
										moveok = 1;
									} else {

										hitTerrainType = currentmap[npctoprightx][npctoprighty];
									}
								} else {
									hitTerrainType = currentmap[npctopleftx][npctoplefty];
								}
							} else if (thisnpc.ydir == -1) {
								if (islocationproperty(4, npcbottomleftx, npcbottomlefty)) {
									if (islocationproperty(4, npcbottomrightx, npcbottomrighty)) {
										moveok = 1;
									} else {
										hitTerrainType = currentmap[npcbottomrightx][npcbottomrighty];
									}
								} else {
									hitTerrainType = currentmap[npcbottomleftx][npcbottomlefty];
								}
							}
							if (thisnpc.xdir == -1) {
								if (islocationproperty(4, npctopleftx, npctoplefty)) {
									if (islocationproperty(4, npcbottomleftx, npcbottomlefty)) {
										moveok = 1;
									} else {
										hitTerrainType = currentmap[npcbottomleftx][npcbottomlefty];
									}
								} else {
									hitTerrainType = currentmap[npctopleftx][npctoplefty];
								}
							} else if (thisnpc.xdir == 1) {
								if (islocationproperty(4, npcbottomrightx, npcbottomrighty)) {
									if (islocationproperty(4, npctoprightx, npctoprighty)) {
										moveok = 1;
									} else {
										hitTerrainType = currentmap[npctoprightx][npctoprighty];
									}
								} else {
									hitTerrainType = currentmap[npcbottomrightx][npcbottomrighty];
								}
							}
							if (npctype > 0) {
								if ((thisnpc.xdir == 0) && (thisnpc.ydir == 0)) {
									// has been stopped by animation, set moveok to 1, so can check against other NPCs and hero before trying a move:
									moveok = 1;
								}
							}

							if (moveok == 1) {
								//if (!((thisnpc.xdir == 0) && (thisnpc.ydir == 0))) {
								//if (thisnpc.hitTargetTerrain) {
								//gamedisplay.characterPanel.charName.text += " reset moveok 1 ";
								//}
								thisnpc.hitTargetTerrain = false;
								//}
							}


							if (npctype == 2) {





								//  check for doors:
								if (thisnpc.ydir == 1) {
									targettile1x = npctopleftx;
									targettile1y = npctoplefty;
									targettile2x = npctoprightx;
									targettile2y = npctoprighty;
								} else if (thisnpc.ydir == -1) {
									targettile1x = npcbottomleftx;
									targettile1y = npcbottomlefty;
									targettile2x = npcbottomrightx;
									targettile2y = npcbottomrighty;
								}
								if (thisnpc.xdir == 1) {
									targettile1x = npctoprightx;
									targettile1y = npctoprighty;
									targettile2x = npcbottomrightx;
									targettile2y = npcbottomrighty;
								} else if (thisnpc.xdir == -1) {
									targettile1x = npctopleftx;
									targettile1y = npctoplefty;
									targettile2x = npcbottomleftx;
									targettile2y = npcbottomlefty;
								}
								if (islocationproperty(16, targettile1x, targettile1y)) {
									if (islocationproperty(16, targettile2x, targettile2y)) {
										// npc is about to move onto a door
										var doorlocationx:Number;
										var doorlocationy:Number;
										for (npcdoor in thisMapsDoors) {
											doorlocationx = thisMapsDoors[npcdoor][1];
											doorlocationy = thisMapsDoors[npcdoor][2];
											if (mabs(doorlocationx - thisnpc.xtile) <= 1) {
												if (mabs(doorlocationy - thisnpc.ytile) <= 1) {
													// ie. npc.xtile is either on the door tile, or on an adjacent one
													// (as target1x etc. were used to detect the door, herox and heroy may not yet be on the door tile fully)
													// play door open animation and sound
													//  Before starting door opening animation, need to check that (door._currentframe == 1)
													//  so that it doesn’t play the animation if the door is already open
													if (scrollclip["t_" + doorlocationx + "_" + doorlocationy].facing.a._currentframe == 1) {
														//if no animation for this door, then the above will be false anyway
														scrollclip["t_" + doorlocationx + "_" + doorlocationy].facing.a.gotoAndPlay(2);
														playsoundeffect("dooropen");
													}
													break;
												}
											}
										}
									}
								}
								if (moveok == 0) {
									// if terrain is blocked, check if it's the same type as the destination required by path finding:
									if (thisnpc.pathfindingTargetTerrain != -1) {

										var collisionTerrainRange = thisnpc.pathfindingTargetTerrain.split("-");

										if ((hitTerrainType >= collisionTerrainRange[0]) && (hitTerrainType <= collisionTerrainRange[1])) {
											//gamedisplay.characterPanel.charName.text = "dunk: " + hitTerrainType + " " + thisnpc.pathfindingTargetTerrain + " " + thisnpc.xdistance + "," + thisnpc.ydistance;

											thisnpc.hitTargetTerrain = true;

										}


									}
								}
							}
							// check to see if NPC will collide with other NPCs                                                                      
							var hasHitNPC = -1;
							tempx = thisnpc.px + xmove;
							tempy = thisnpc.py + ymove;
							for (h in currentnpcs) {
								if (h != g) {
									// ie. NPC exists and isn't the one being checked in the main loop
									thischecknpc = scrollclip["n_" + h];
									if (hascollided(thischecknpc.px, thischecknpc.py, thischecknpc.awidth, thischecknpc.aheight, tempx, tempy, thisnpc.awidth, thisnpc.aheight)) {
										if (parseInt(currentnpcs[h][1]) != 10) {
											// ie. isn't a ghost
											moveok = 0;
											hasHitNPC = h;
										}
									}
								}
							}


							if (hasHitNPC != -1) {
								// statusMessage("npc collision");
								// #############
							}
							// check against pet                                                             
							if (haspet) {
								if (hascollided(scrollclip.pet.px, scrollclip.pet.py, scrollclip.pet.awidth, scrollclip.pet.aheight, tempx, tempy, thisnpc.awidth, thisnpc.aheight)) {
									moveok = 0;
								}
							}
							// check against items (make sure it's not a resource placeholder, or a player planted item that has started growing)                                                                                                                                                                                                       
							for (q in displayitems) {
								if ((inventoryitems[parseInt(displayitems[q][2])][6] != "ph") && (!((inventoryitems[parseInt(displayitems[q][2])][2].indexOf("k") != -1) && (determinePlantGrowthStage(displayitems[q][6]) == 0)))) {
									itemxtile = parseInt(displayitems[q][0]);
									itemytile = parseInt(displayitems[q][1]);
									thisitem = scrollclip["i_" + itemxtile + "_" + itemytile];
									if (hascollided(thisitem.px, thisitem.py, thisitem.w, thisitem.w, tempx, tempy, thisnpc.awidth, thisnpc.aheight)) {
										moveok = 0;
									}
								}
							}
							// check against hero
							if (hascollided(scrollclip.hero.px, scrollclip.hero.py, herowidth, heroheight, tempx, tempy, thisnpc.awidth, thisnpc.aheight)) {
								moveok = 0;
							}
						}







						if ((moveok == 1) || (thisnpc.hitTargetTerrain)) {





							if (npctype == 2) {
								if (thisnpc.hasStopped == 1) {
									if (thisnpc.npcclip.i == 9999) {


										// if is a path follower and had been previously blocked then restart animation
										thisnpc.hasStopped = 0;
										thisnpc.npcclip.gotoAndStop(thisnpc.currentWalkingAnimation);
									}
								}
							}
							// ... only if valid                                                                                                                                                                                                       
							thisnpcattilecentre = 0;

							if (thisnpc.followingpath > 0) {
								// is a random mover or path follower
								if (npctype != 1) {
									// if it isn't a random mover then can just check total distance moved, and ignore direction
									if (thisnpc.xdir != 0) {
										thisnpc.xdistance += thisnpc.speed;
									} else if (thisnpc.ydir != 0) {
										thisnpc.ydistance += thisnpc.speed;
									}
									if ((thisnpc.xdistance >= spacing) || (thisnpc.ydistance >= spacing)) {
										thisnpcattilecentre = 1;
										// reset movement travelled
										thisnpc.xdistance = 0;
										thisnpc.ydistance = 0;



									}




								} else {
									// is a random mover, so do need to take into account changes in direction
									thisnpc.xdistance += thisnpc.speed * thisnpc.xdir;
									thisnpc.ydistance += thisnpc.speed * thisnpc.ydir;
									if (((mabs(thisnpc.xdistance)) + (mabs(thisnpc.ydistance)) >= spacing) || (thisnpc.xdistance == 0 && thisnpc.ydistance == 0)) {
										// if either direction has moved spacing (either positively or negatively)
										// OR the npc has returned to its previous tile after being blocked, then needs to find a new tile
										thisnpcattilecentre = 1;
									}
								}






								var shouldStopAnimating = false;
								if (thisnpc.npcclip.i) {
									// (could be undefined at init)
									if (thisnpc.npcclip.i <= 0) {
										if (!thisnpc.animationLookaheadPathFind) {
											thisnpc.npcclip.i = 9999;
											shouldStopAnimating = true;
										}
									}
								}


								if ((thisnpcattilecentre == 1) || (shouldStopAnimating) || (thisnpc.hitTargetTerrain)) {

									if (npctype != 1) {

										// get new xdir,ydir from string if it's not a random mover
										adirection = currentnpcs[g][7];
										thisdirection = adirection.substr(thisnpc.pathmarker, 1);

										thisnpc.pathmarker++;



										switch (thisdirection) {
											case ">" :
												// has gone through a door and needs to be removed:
												npcbeingremoved = g;
												break;
											case "/" :
												// termination of found path
												// set direction as previous (-2 as has just had +1 added to it and need value before that)
												thisdirection = adirection.substr(thisnpc.pathmarker - 2, 1);
												thisnpc.pathmarker = 0;
												// set blank path
												currentnpcs[g][7] = "0";
												thisnpc.followingpath = 0;
												thisnpc.hasStopped = 1;
												thisnpc.nottalking = 0;
												//save changes to changes array:
												currentnpcs[g][5] = thisnpc.xdir;
												currentnpcs[g][6] = thisnpc.ydir;
												currentnpcs[g][3] = findtilenumber(thisnpc.px, thisnpc.py, "x");
												currentnpcs[g][4] = findtilenumber(thisnpc.px, thisnpc.py, "y");
												addtochanges([currentmapnumber, 1, g, (currentnpcs[g].join(","))]);
												break;


											case "A" :
												// play animation:
												var whichAnime = adirection.substr(thisnpc.pathmarker, 4);

												thisnpc.npcclip.gotoAndStop(whichAnime);

												var countMarker = adirection.indexOf('#', thisnpc.pathmarker + 4);



												var numberOfTimesToPlayAnime = parseInt(adirection.substring(thisnpc.pathmarker + 4, countMarker));
												thisnpc.pathmarker = countMarker + 1;



												thisnpc.npcclip.i = numberOfTimesToPlayAnime;

												thisnpc.storedAnimxdir = thisnpc.xdir;
												thisnpc.storedAnimydir = thisnpc.ydir;
												thisnpc.storedxdir = 0;
												thisnpc.storedydir = 0;


												thisnpc.xdir = 0;
												thisnpc.ydir = 0;

												thisnpc.hasStopped = 1;

												// check ahead to see if pathfinding will be needed: 




												var nextPathMarkerCode = adirection.substr(thisnpc.pathmarker, 1);
												if (nextPathMarkerCode == "P") {
													thisnpc.animationLookaheadPathFind = true;
													doNPCPathfind(g);
												} else if ((nextPathMarkerCode == "x") || (nextPathMarkerCode == "X")) {
													if (adirection.substr(0, 1) == "P") {
														thisnpc.pathmarker = 0;
														thisnpc.animationLookaheadPathFind = true;
														doNPCPathfind(g);
													}
												}

												break;


											case "|" :
												// this means it's hit the end of a dynamically created path (from an earlier 'A' code)
												// remove the code wrapped in the | markers:

												var firstPipe = adirection.indexOf("|");
												var lastPipe = adirection.lastIndexOf("|");

												//gamedisplay.characterPanel.charName.text = adirection+" ";

												var newString = adirection.substring(0, firstPipe) + adirection.substring(lastPipe + 1);
												//gamedisplay.characterPanel.charName.text += newString;
												currentnpcs[g][7] = newString;
												// adjust the pathmarker accordingly:
												thisnpc.pathmarker = firstPipe;
												//gamedisplay.characterPanel.charName.text += " "+newString.substr(thisnpc.pathmarker, 1);
												// force it to immediately check the next code without moving forwards:


												if (!thisnpc.hitTargetTerrain) {
													//gamedisplay.characterPanel.charName.text += " reset centre 1 ";
													thisnpc.xdistance = spacing;
													thisnpc.ydistance = 0;
												}
												delete thisnpc.findclosestpath;

												break;


											case "^" :
												// return to current tile centre


												//gamedisplay.characterPanel.charName.text += " recentre " + thisnpc.xdistance + "," + thisnpc.ydistance+" - ";

												//if ((thisnpc.xdistance == 0) && (thisnpc.ydistance == 0)) {
												// not needed - continue
												//thisnpc.xdistance = spacing;
												//thisnpc.ydistance = 0;
												//} else {

												//if (g == 7) {
												//gamedisplay.characterPanel.charName.text = "2. " + thisnpc.storedAnimxdir + "," + thisnpc.storedAnimydir;
												//}






												if (thisnpc.xdistance != 0) {
													thisnpc.xdistance = spacing - thisnpc.xdistance;

												}

												if (thisnpc.ydistance != 0) {
													thisnpc.ydistance = spacing - thisnpc.ydistance;
												}



												if (thisnpc.storedAnimxdir < 0) {
													thisnpc.xdir = 1;
												} else if (thisnpc.storedAnimxdir > 0) {
													thisnpc.xdir = -1;
												}

												if (thisnpc.storedAnimydir < 0) {
													thisnpc.ydir = 1;
												} else if (thisnpc.storedAnimydir > 0) {
													thisnpc.ydir = -1;
												}
												//}                                                                              

												break;


											case "a" :
												// change default walk animation:
												var whichAnime = adirection.substr(thisnpc.pathmarker, 4);
												thisnpc.currentWalkingAnimation = whichAnime;



												thisnpc.pathmarker += 4;
												// force it to pick up the next code immediately:




												if (!thisnpc.hitTargetTerrain) {
													//gamedisplay.characterPanel.charName.text += " reset centre 2 ";
													thisnpc.xdistance = spacing;
													thisnpc.ydistance = 0;
												}
												break;

											case "r" :
												// reset default walk animation
												thisnpc.currentWalkingAnimation = "walk";
												if (!thisnpc.hitTargetTerrain) {
													thisnpc.xdistance = spacing;
													thisnpc.ydistance = 0;
												}
												break;
											case "w" :
												// wait until hero is within the specified range before continuning
												// could be used for fleeing NPC for example
												// #####################
												break;
											case "P" :
												// pathfind to tile type


												if (!thisnpc.animationLookaheadPathFind) {
													// stop npc from moving forward:
													thisnpc.xdir = 0;
													thisnpc.ydir = 0;

													thisnpc.hasStopped = 1;
													thisnpc.npcclip.gotoAndStop("stand");
													// minus one here to set up the code correctly for the pathfinding routine:
													thisnpc.pathmarker--;
													doNPCPathfind(g);
												}
												break;

											case "T" :
												// npc should stop and talk:
												// stop it, turn to face its next direction:
												thisnpc.hasStopped = 1;
												thisnpc.followingpath = 0;
												// find facing:
												thisdirection = adirection.substr(thisnpc.pathmarker, 1);
												thisnpc.pathmarker++;
												switch (thisdirection) {
													case "1" :
														// face NE
														thisnpc.gotoAndStop(5);
														break;
													case "2" :
														// face SE
														thisnpc.gotoAndStop(4);
														break;
													case "3" :
														// face SW
														thisnpc.gotoAndStop(1);
														break;
													case "4" :
														// face NW
														thisnpc.gotoAndStop(2);
														break;
													default :
														// nothing
												}
												thisnpc.npcclip.gotoAndStop("stand");

												thisnpc.xdir = 0;
												thisnpc.ydir = 0;
												thisnpc.storedxdir = 0;
												thisnpc.storedydir = 0;
												// say dialogue - if hero is visible:
												if (isinrange(scrollclip.hero.px, scrollclip.hero.py, thisnpc.px, thisnpc.py, spacing * visx)) {
													whichspeech = (parseInt((currentnpcs[g][NPCStartSpeechIndex + (thisnpc.speechcounter)])));
													whatsaid = scrollclip.dialogue[whichspeech];
													speak(whatsaid,g);
													// remove this bit of dialogue from npc's array:
													currentnpcs[g].splice(11,1);
													// look ahead to see what to do next:
													thisdirection = adirection.substr(thisnpc.pathmarker, 1);
													if (thisdirection != "/") {
														// store which npc is waiting for the dialogue to be closed:
														npcwaitingfordialogue = g + 1;
														// (is +1 so that npc index 0 is 1 (and so, can be -1 when dialogue closed);
														thisnpc.pathmarker++;
													} else {
														// is end of path, allow npc to speak again:
														thisnpc.nottalking = 0;
														thisnpc.speechcounter++;
														currentnpcs[g][7] = "0";
													}
												} else {
													// stop npc from moving - and allow it to start speaking, so can respond with what it would
													// have said if the hero had been on the screen, but now said if the hero goes and talks to them.
													// dialogue will need to be removed once said though
													thisnpc.nottalking = 0;
													// remove previous bit of dialogue from npc's array:
													currentnpcs[g].splice(11,1);
													thisnpc.xdir = 0;
													thisnpc.ydir = 0;
													thisnpc.hasStopped = 1;
													thisnpc.followingpath = 0;
												}
												// save new tile coords to npc array:
												currentnpcs[g][5] = thisnpc.xdir;
												currentnpcs[g][6] = thisnpc.ydir;
												currentnpcs[g][3] = findtilenumber(thisnpc.px, thisnpc.py, "x");
												currentnpcs[g][4] = findtilenumber(thisnpc.px, thisnpc.py, "y");
												addtochanges([currentmapnumber, 1, g, (currentnpcs[g].join(","))]);
												break;
											default :
												if (thisdirection == "x") {
													thisnpc.pathmarker = 0;
													thisdirection = adirection.substr(thisnpc.pathmarker, 1);




												} else if (thisdirection == "X") {
													thisnpc.pathmarker = 0;
													thisdirection = adirection.substr(thisnpc.pathmarker, 1);

													thisnpc.pathmarker = 1;
												}
												thisnpc.ydir = thisnpc.xdir = 0;





												switch (thisdirection) {
													case "1" :
														// move NE
														thisnpc.ydir = 1;

														break;
													case "2" :
														// move SE
														thisnpc.xdir = 1;
														break;
													case "3" :
														// move SW
														thisnpc.ydir = -1;
														break;
													case "4" :
														// move NW
														thisnpc.xdir = -1;
														break;
													case "P" :
														if (!thisnpc.animationLookaheadPathFind) {
															doNPCPathfind(g);
														}
														break;
													default :
														// nothing
												}




												// before moving - pathfinders should look ahead and see if any npcs might collide with them in the new tile



												if (npctype == 2) {
													var npcTargetXTile = thisnpc.xtile + thisnpc.xdir;
													var npcTargetYTile = thisnpc.ytile + thisnpc.ydir;




													for (var h in currentnpcs) {

														thischecknpc = scrollclip["n_" + h];

														if (thischecknpc.xtile == npcTargetXTile) {
															if (thischecknpc.ytile == npcTargetYTile) {

																if (parseInt(currentnpcs[h][1]) == 2) {



																	var otherNPCisAnObstacle = false;

																	if (thischecknpc.hasStopped) {

																		otherNPCisAnObstacle = true;
																	}

																	if (thischecknpc.xdir + thisnpc.xdir == 0) {
																		if (thischecknpc.ydir + thisnpc.ydir == 0) {
																			otherNPCisAnObstacle = true;
																		}

																	}
																	// check the target npc's direction:                                                                  
																	if (otherNPCisAnObstacle) {
																		//gamedisplay.characterPanel.charName.text = "npc collision";


																		// move to clear tile either side:
																		var tileLeftIsClear = false;
																		var tileRightIsClear = false;

																		if (thisnpc.xdir == 0) {
																			if (islocationproperty(4, thisnpc.xtile - 1, thisnpc.ytile)) {
																				tileLeftIsClear = true;

																			}
																			if (islocationproperty(4, thisnpc.xtile + 1, thisnpc.ytile)) {
																				tileRightIsClear = true;

																			}
																		} else {

																			if (islocationproperty(4, thisnpc.xtile, thisnpc.ytile - 1)) {
																				tileLeftIsClear = true;

																			}
																			if (islocationproperty(4, thisnpc.xtile, thisnpc.ytile + 1)) {
																				tileRightIsClear = true;

																			}



																		}
																		if ((!tileLeftIsClear) && (!tileRightIsClear)) {
																			thisnpc.ydir = thisnpc.xdir = 0;
																			gamedisplay.characterPanel.charName.text = "no where to go";
																		}

																		if (tileLeftIsClear && tileRightIsClear) {
																			// pick one at random:

																			if (mfloor(mrand() * 2) == 0) {
																				tileLeftIsClear = false;
																			} else {
																				tileRightIsClear = false;
																			}


																		}

																		if (tileLeftIsClear) {
																			if (thisnpc.xdir == 0) {
																				thisnpc.xdir = -1;
																				thisnpc.ydir = 0;
																			} else {
																				thisnpc.xdir = 0;
																				thisnpc.ydir = -1;
																			}
																		}
																		if (tileRightIsClear) {
																			if (thisnpc.xdir == 0) {
																				thisnpc.xdir = 1;
																				thisnpc.ydir = 0;
																			} else {
																				thisnpc.xdir = 0;
																				thisnpc.ydir = 1;
																			}
																		}
																		// remove current path from string                                                              
																		var firstPipe = adirection.indexOf("|");
																		var lastPipe = adirection.lastIndexOf("|");



																		var newString = adirection.substring(0, firstPipe) + adirection.substring(lastPipe + 1);

																		currentnpcs[g][7] = adirection = newString;
																		// adjust the pathmarker so that a new path is searched for next time: 
																		// find the P just before the current path:
																		thisnpc.pathmarker = adirection.lastIndexOf("P", firstPipe);





																		// mark the current tile and the blocked tile as no-go areas:
																		thisnpc.tilesToAvoid = thisnpc.xtile + "," + thisnpc.ytile + "|" + npcTargetXTile + "," + npcTargetYTile;






																	}

																}

															}

														}

													}




												}



										}
									} else {
										// is a random mover
										// Get random number from -1 to 10
										var ran:Number = mrand() * 100;
										var ranint:Number = (mfloor(ran)) - 1;
										if (mabs(ranint) == 1) {
											// see if npc can turn
											if (thisnpc.xdir == 0) {
												proposedydir = 0;
												proposedxdir = ranint;
											} else {
												var proposedydir:Number = ranint;
												var proposedxdir:Number = 0;
											}
											// check proposed target tile:
											if (islocationproperty(4, thisnpc.xtile + proposedxdir, thisnpc.ytile + proposedydir)) {
												if ((thisnpc.xdir == 0) && (thisnpc.ydir == 0)) {
													// had been stopped by its animtion:
													thisnpc.hasStopped = 0;
													thisnpc.npcclip.gotoAndStop(thisnpc.currentWalkingAnimation);
													// reset movement travelled now it's found a new heading
													thisnpc.xdistance = 0;
													thisnpc.ydistance = 0;
												}
												thisnpc.xdir = proposedxdir;
												thisnpc.ydir = proposedydir;
											} else {
												if (islocationproperty(4, thisnpc.xtile + thisnpc.xdir, thisnpc.ytile + thisnpc.ydir)) {
													// straight ahead is ok - carry on moving forwards
												} else {
													// turn round:
													thisnpc.xdir *= -1;
													thisnpc.ydir *= -1;
												}
											}
										} else {
											// moving forward, check ahead, if walkable carry on:
											if (islocationproperty(4, thisnpc.xtile + thisnpc.xdir, thisnpc.ytile + thisnpc.ydir)) {
												// is fine - keep keep going
											} else {
												// use whether the randominteger was odd or even to determine whether it checks left or right,
												if (thisnpc.xdir == 0) {
													proposedydir = 0;
													//ranint%2 will give either 0 or 1, so *2 -1 gives either -1 or 1
													proposedxdir = ((ranint % 2) * 2) - 1;
												} else {
													proposedydir = ((ranint % 2) * 2) - 1;
													proposedxdir = 0;
												}
												// check that this tile is walkable:
												if (islocationproperty(4, thisnpc.xtile + proposedxdir, thisnpc.ytile + proposedydir)) {
													thisnpc.xdir = proposedxdir;
													thisnpc.ydir = proposedydir;
												} else {
													// turn around
													thisnpc.xdir *= -1;
													thisnpc.ydir *= -1;
												}
											}
										}

									}
								}
							}


							thisnpc.px += xmove;
							thisnpc.py += ymove;
							// update graphic's position
							thisnpc._x = (thisnpc.px) + (thisnpc.py);
							thisnpc._y = ((thisnpc.px) - (thisnpc.py)) / 2;
							if (!((thisnpc.xdir == 0) && (thisnpc.ydir == 0))) {
								// change facing, if not moving
								thisnpc.gotoAndStop(thisnpc.xdir + thisnpc.ydir * 2 + 3);

							}
							// update current tile                                                                                                                                                                                                       
							var newXTile = findtilenumber(thisnpc.px, thisnpc.py, "x");
							var newYTile = findtilenumber(thisnpc.px, thisnpc.py, "y");
							if ((thisnpc.xtile != newXTile) || (thisnpc.ytile != newYTile)) {
								updatePrints(g);
							}
							thisnpc.xtile = newXTile;
							thisnpc.ytile = newYTile;
						} else if (npctype == 1) {
							// reverse direction if random mover
							thisnpc.xdir = (0 - thisnpc.xdir);
							thisnpc.ydir = (0 - thisnpc.ydir);
							// in case it is a jumping creature, store the current animation frame,
							// reverse the npc clip and start the reverse animation from that frame,
							// so that it looks like the npc just bounced off the object it collided with:
							storedframe = thisnpc.npcclip._currentframe;
							// turn npc to new heading:
							thisnpc.gotoAndStop(thisnpc.xdir + thisnpc.ydir * 2 + 3);
							thisnpc.npcclip.gotoAndPlay(storedframe);
						} else if (npctype == 2) {
							if (thisnpc.npcclip.i == 9999) {
								// pause animation (is a pathfollower and is blocked)
								thisnpc.npcclip.gotoAndStop("stand");

								thisnpc.hasStopped = 1;
							}
						}
						// store direction it's travelling into its array                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
						thisnpc.storedxdir = thisnpc.xdir;
						thisnpc.storedydir = thisnpc.ydir;
					}
				}
			}
		}
		// check if an npc is waiting to continue on its path now dialogue box has been closed:                                                                                                                                                                                                                                                                                                                                        
		if (npcwaitingfordialogue == (g + 1) * -1) {
			npcwaitingfordialogue = 0;
			adirection = currentnpcs[g][7];
			thisnpc.hasStopped = 0;
			thisnpc.followingpath = 1;
			// find facing:
			thisdirection = adirection.substr(thisnpc.pathmarker, 1);
			thisnpc.pathmarker++;
			thisnpc.ydir = thisnpc.xdir = 0;
			switch (thisdirection) {
				case "1" :
					// move NE
					thisnpc.ydir = 1;
					break;
				case "2" :
					// move SE
					thisnpc.xdir = 1;
					break;
				case "3" :
					// move SW
					thisnpc.ydir = -1;
					break;
				case "4" :
					// move NW
					thisnpc.xdir = -1;
					break;
				default :
					// nothing
			}
			// store direction it's travelling into its array
			thisnpc.storedxdir = thisnpc.xdir;
			thisnpc.storedydir = thisnpc.ydir;
		}
	}

	if (npcbeingremoved != -1) {
		// save to remove now at the end of loop:
		removeMovieClip(scrollclip["n_" + npcbeingremoved]);
		// need to go through the remaining npc movieclips and bring the references back one
		// (ie. if npc[2] is removed, then npc[3] now needs to be npc[2], npc[4] needs to be npc[3] and so on...
		//
		// currentnpcs.length-1 gives last index of npc movieclip
		npcindextracker = npcbeingremoved;
		npcindextracker++;
		do {
			scrollclip["n_" + npcindextracker]._name = "n_" + (npcindextracker - 1);
			npcindextracker++;
		} while (npcindextracker < currentnpcs.length);
		// remove from array:
		currentnpcs.splice(npcbeingremoved,1);
		addtochanges([currentmapnumber, 1, npcbeingremoved, -1]);
		// add information about the map that the npc will reappear on:
		addtochanges([scrollclip.npcnewmap, 1, 0, "add", scrollclip.npcnewinfo]);
	}
}
function hascollided(objectonex:Number, objectoney:Number, objectonewidth:Number, objectoneheight:Number, objecttwox:Number, objecttwoy:Number, objecttwowidth:Number, objecttwoheight:Number) {
	var collision:Boolean = false;
	// test verticals
	if ((objectoney - (objectoneheight / 2)) <= (objecttwoy + (objecttwoheight / 2))) {
		if ((objectoney + (objectoneheight / 2)) >= (objecttwoy - (objecttwoheight / 2))) {
			//now test horizontals
			if ((objectonex - (objectonewidth / 2)) <= (objecttwox + (objecttwowidth / 2))) {
				if ((objectonex + (objectonewidth / 2)) >= (objecttwox - (objecttwowidth / 2))) {
					collision = true;
				}
			}
		}
	}
	return collision;
}
function calculatedepth(tilecoordx:Number, tilecoordy:Number) {
	// calculates depth for tiles according to position on map
	var tiledepth:Number = (tilecoordx * (maplengthy)) + (((maplengthy) - tilecoordy));
	// +2 to bring above ground graphics:
	return findClearDepth(mfloor(tiledepth + 2));
}
function calculateobjectdepth(objcoordx:Number, objcoordy:Number) {
	// http://www.kirupa.com/developer/isometric/depth_sorting.htm
	// but add floor tiles' max depth and also ensure that _y is postive, by adding the maximum plane height
	var objectdepth:Number = ((objcoordx / 4) + ((objcoordy / 4) + isoplaneheighthalved) * isoplanewidth) + tilemaxdepth;
	return findClearDepth(mfloor(objectdepth));
}
function calculateHiddenMapDepth(tilecoordx:Number, tilecoordy:Number) {
	// calculates depth for tiles according to position on map
	var tiledepth:Number = (tilecoordx * (treasureMaplengthy)) + (((treasureMaplengthy) - tilecoordy));
	return mfloor(tiledepth);
}
function calculateHiddenMapObjectDepth(objcoordx:Number, objcoordy:Number) {
	// http://www.kirupa.com/developer/isometric/depth_sorting.htm
	// but add floor tiles' max depth and also ensure that _y is postive, by adding the maximum plane height
	var objectdepth:Number = ((objcoordx / 4) + ((objcoordy / 4) + isoplaneheighthalved) * isoplanewidth) + tilemaxdepth;
	return findClearDepth(mfloor(objectdepth));
}
function isinrange(ax:Number, ay:Number, bx:Number, by:Number, ra:Number) {
	// determines if one sprite is within range of another
	var range:Number = msqrt(((ax - bx) * (ax - bx)) + ((ay - by) * (ay - by)));
	if (range <= ra) {
		return true;
	} else {
		return false;
	}
}
function checkforitems() {
	for (var g:Number = 0; g < displayitems.length; g++) {
		var itemxtile:Number = parseInt(displayitems[g][0]);
		var itemytile:Number = parseInt(displayitems[g][1]);
		var item:Object = scrollclip["i_" + itemxtile + "_" + itemytile];
		if (whichkeyreleased == keyaction) {
			// CTRL pressed
			if (isinrange(scrollclip.hero.px, scrollclip.hero.py, item.px, item.py, (item.w / 2 + herowidth / 2 + 6))) {
				// find a better distance than this, but does need to be based on item width,
				// so that wide items are detected (otherwise their centre could be a way away from
				// hero's centre, but their edges are touching
				//
				// is in adjacent tile, now check if hero is facing the chest
				var islessx:Boolean = (item.px < scrollclip.hero.px);
				var ismorex:Boolean = (item.px > scrollclip.hero.px);
				var islessy:Boolean = (item.py < scrollclip.hero.py);
				var ismorey:Boolean = (item.py > scrollclip.hero.py);
				if (((ismorey && (storedydir == 1)) or (islessy && (storedydir == -1)) or (islessx && (storedxdir == -1)) or (ismorex && (storedxdir == 1)))) {
					// hero is facing item 
					// check 'action' attribute of this item:
					switch (inventoryitems[displayitems[g][2]][6]) {
						case "chest" :
							// is a chest - check that hero and the chest are at the same height:
							if (heightgained == displayitems[g][4]) {
								// ensure chest panel isn't already open:
								if (!(inventorySetIsOpen("ichest"))) {
									// save references to the array object:
									chestindex = g;
									chestobject = item;
									// create chest array from string:
									chestarray = new Array();
									var cheststring:Array = displayitems[g][5].split("|");
									for (var i = 0; i < cheststring.length; i++) {
										chestarray[i] = cheststring[i].split(".");
									}
									item.facing.a.gotoAndPlay("opening");
									chestarraysize = chestarray.length;
									//
									setsopen.push(["ichest", chestarraysize, numberofcolumns]);
									setsopen.push(["iinv", currentbagsize, numberofcolumns]);
									resetinventory();
									numberofslotstoadd = currentbagsize;
									whicharray = "inventory";
									settoggle = "iinv";
									populateInventorySet();
									placeinventorysets();
									// populate chest with current state:
									for (var i = 0; i < maximumnumberofslots; i++) {
										if (i < chestarraysize) {
											// show this slot:
											if (chestarray[i][0] != "1") {
												attachSingleInvIcon("ichest",i);
											}
											gamedisplay.inventorysets.ichest["slot" + i]._visible = true;
										} else {
											gamedisplay.inventorysets.ichest["slot" + i]._visible = false;
										}
									}
									gamedisplay.inventorysets.ichest.backgroundblock._y = invtileheight * (mceil(chestarraysize / numberofcolumns) - 1);
									gamedisplay.inventorysets.ichest.borderrepeat._height = invtileheight * (mceil(chestarraysize / numberofcolumns) - 1);
									gamedisplay.inventorysets.ichest._visible = true;
									gamedisplay.inventorysets.iinv._visible = true;
									HeroCannotMove = true;
									chestOpenInv = setInterval(openInventory, 500);
								}
							}
							break;
						case "node" :
							// is a harvestable resource - check if it's player planted, and if so, whether it can be harvested from:
							var okToHarvest = false;
							var okToHarvestPollen = false;
							var hasPollen = (inventoryitems[displayitems[g][2]][7]).indexOf("P");
							if (inventoryitems[parseInt(displayitems[g][2])][2].indexOf("k") == -1) {
								okToHarvest = true;
								playerPlantedPlant = false;
							} else {
								if ((determinePlantGrowthStage(displayitems[g][6]) > 0) && determinePlantGrowthStage(displayitems[g][6] < 4) && hasPollen != -1) {
									// plant is at the right stage and can have pollen harvested from it
									okToHarvestPollen = true;
									playerPlantedPlant = true;
								} else if ((determinePlantGrowthStage(displayitems[g][6]) >= 4) && determinePlantGrowthStage(displayitems[g][6] < 10)) {
									okToHarvest = true;
									playerPlantedPlant = true;
								} else {
									statusMessage("plant not ready to harvest yet");
								}
							}
							if (okToHarvest || okToHarvestPollen) {
								//determine if the hero has enough skill to gather this: 
								var thisNodesLevel = parseInt(inventoryitems[displayitems[g][2]][10]);
								var thisNodesGroup = parseInt(inventoryitems[displayitems[g][2]][12]);
								var herosSkillForThisGroup = -9999;
								switch (thisNodesGroup) {
									case 20 :
										// herbalism skill - herbalism is skill #2
										herosSkillForThisGroup = playerCraftingSkill[2];
										break;
								}
								var skillGatheringDiff = herosSkillForThisGroup - thisNodesLevel;
								if (mfloor(mrand() * 30) + skillGatheringDiff > 15) {
									// determine any skill gain:
									if (Math.floor(mrand() * 20) - skillGatheringDiff < 12) {
										switch (thisNodesGroup) {
											case 20 :
												playerCraftingSkill[2]++;
												break;
										}
									}
									// determine what items are received (this is in the actionValue attribute):                                                                                                                                                                                                                                                                                                                                                                                                                                                             
									if (okToHarvestPollen) {
										var itemsreceived:Array = (inventoryitems[displayitems[g][2]][7].substr(0, hasPollen)).split("/");
									} else {
										if (hasPollen != -1) {
											var itemsreceived:Array = (inventoryitems[displayitems[g][2]][7].substr(hasPollen + 1)).split("/");
										} else {
											var itemsreceived:Array = inventoryitems[displayitems[g][2]][7].split("/");
										}
									}
									// get random number between 0 and length of array
									var randomnumber:Number = mfloor(mrand() * (itemsreceived.length - 1));
									// check for multiple items:
									var multipleitems:Number = itemsreceived[randomnumber].indexOf("|");
									if (multipleitems == -1) {
										// only 1 item:
										var resourceitem:Array = itemsreceived[randomnumber].split(".");
										var objectColour = displayitems[g][9];
										var objectType = resourceitem[0];
										if ((inventoryitems[objectType][2]).indexOf("S") != -1) {
											// it's a seed, so check whether the plant was pollinated and combine colour and see if a new plant species was created:
											if (displayitems[g][7] > 0) {
												coloursToMix = [];
												coloursToMix.push(parseInt(displayitems[g][9]));
												coloursToMix.push(parseInt(displayitems[g][8]));
												objectColour = mixColours();
												// check if a new plant species was created
												for (var newPlantSpecies = 0; newPlantSpecies < crossBreeding.length; newPlantSpecies++) {
													if (crossBreeding[newPlantSpecies][0] == displayitems[g][5]) {
														if (crossBreeding[newPlantSpecies][1] == displayitems[g][7]) {
															objectType = crossBreeding[newPlantSpecies][2];
															break;
														}
													}
												}
											}
										}
										var objectColourText = "";
										if (objectColour != 0) {
											objectColourText = colours[objectColour][0] + " ";
										}
										// resources will always have top quality, effectiveness etc.                                                                                                                                                                                                                                                                                                                                                                                                                                                        
										if (canadditemtoinventory(objectType, resourceitem[0], 4, 100, 4, -1, 0, objectColour, 0, 0, "-") != 0) {
											statusMessage("received " + resourceitem[0] + "x " + objectColourText + inventoryitems[objectType][0]);
											additemtoinventory(objectType,resourceitem[0],4,100,4,-1,0,objectColour,0,0,"-");
											showItemAddedAnimation(objectType);
											if (!(playerPlantedPlant)) {
												// placeholder is always the one after the resource:                                                                                                                                
												displayitems[g][2] = (parseInt(displayitems[g][2])) + 1;
												// add to changes:
												addtochanges([currentmapnumber, 3, g, (displayitems[g].join(","))]);
												item.removeMovieClip();
												if (g == parseInt(familiarfoundindex)) {
													// then return familiar to hero clip as hero has collected the item the familar was over
													familiarfoundindex = -1;
													familiarstate = 0;
													scrollclip.hero.familiar._visible = true;
													removeMovieClip(scrollclip.familiar);
												}
											}
										} else {
											statusMessage("inventory full");
										}
									} else {
										// two items:
										var resourceitem1:Array = itemsreceived[randomnumber].substring(0, multipleitems).split(".");
										var resourceitem2:Array = itemsreceived[randomnumber].substring(multipleitems + 1).split(".");
										var objectColour1 = displayitems[g][9];
										var objectColour2 = displayitems[g][9];
										var objectType1 = resourceitem1[0];
										var objectType2 = resourceitem2[0];
										if ((inventoryitems[objectType1][2]).indexOf("S") != -1) {
											// it's a seed, so check whether the plant was pollinated and combine colour and see if a new plant species was created:
											if (displayitems[g][7] > 0) {
												coloursToMix = [];
												coloursToMix.push(parseInt(displayitems[g][9]));
												coloursToMix.push(parseInt(displayitems[g][8]));
												objectColour1 = mixColours();
												// check if a new plant species was created
												for (var newPlantSpecies = 0; newPlantSpecies < crossBreeding.length; newPlantSpecies++) {
													if (crossBreeding[newPlantSpecies][0] == displayitems[g][5]) {
														if (crossBreeding[newPlantSpecies][1] == displayitems[g][7]) {
															objectType1 = crossBreeding[newPlantSpecies][2];
															break;
														}
													}
												}
											}
										}
										var objectColour1Text = "";
										if (objectColour1 != 0) {
											objectColour1Text = colours[objectColour1][0] + " ";
										}
										if ((inventoryitems[objectType2][2]).indexOf("S") != -1) {
											// it's a seed, so check whether the plant was pollinated and combine colour and see if a new plant species was created:
											if (displayitems[g][7] > 0) {
												coloursToMix = [];
												coloursToMix.push(parseInt(displayitems[g][9]));
												coloursToMix.push(parseInt(displayitems[g][8]));
												objectColour2 = mixColours();
												// check if a new plant species was created
												for (var newPlantSpecies = 0; newPlantSpecies < crossBreeding.length; newPlantSpecies++) {
													if (crossBreeding[newPlantSpecies][0] == displayitems[g][5]) {
														if (crossBreeding[newPlantSpecies][1] == displayitems[g][7]) {
															objectType2 = crossBreeding[newPlantSpecies][2];
															break;
														}
													}
												}
											}
										}
										var objectColour2Text = "";
										if (objectColour2 != 0) {
											objectColour2Text = colours[objectColour2][0] + " ";
										}
										if (canadditemtoinventory(objectType1, resourceitem1[0], 4, 100, 4, -1, 0, objectColour1, 0, 0, "-") != 0) {
											if (canadditemtoinventory(objectType2, resourceitem2[0], 4, 100, 4, -1, 0, objectColour2, 0, 0, "-") != 0) {
												additemtoinventory(objectType1,resourceitem1[0],4,100,4,-1,0,objectColour1,0,0,"-");
												additemtoinventory(objectType2,resourceitem2[0],4,100,4,-1,0,objectColour2,0,0,"-");
												showItemAddedAnimation(resourceitem2[1]);
												statusMessage("received " + resourceitem1[0] + "x " + objectColour1Text + inventoryitems[(resourceitem1[1])][0] + " and " + resourceitem2[0] + "x " + objectColour2Text + inventoryitems[(resourceitem2[1])][0]);
												if (!(playerPlantedPlant)) {
													// placeholder is always the one after the resource:                                                                                                                                
													displayitems[g][2] = (parseInt(displayitems[g][2])) + 1;
													// add to changes:
													addtochanges([currentmapnumber, 3, g, (displayitems[g].join(","))]);
													item.removeMovieClip();
													if (g == parseInt(familiarfoundindex)) {
														// then return familiar to hero clip as hero has collected the item the familar was over
														familiarfoundindex = -1;
														familiarstate = 0;
														scrollclip.hero.familiar._visible = true;
														removeMovieClip(scrollclip.familiar);
													}
												}
											} else {
												// the hero only has room for the first item
												statusMessage("received " + objectColour1Text + inventoryitems[(resourceitem1[0])][0]);
												additemtoinventory(objectType1,resourceitem1[0],4,100,4,-1,0,objectColour1,0,0,"-");
												showItemAddedAnimation(resourceitem1[1]);
												if (!(playerPlantedPlant)) {
													// placeholder is always the one after the resource:                                                                                                                                
													displayitems[g][2] = (parseInt(displayitems[g][2])) + 1;
													// add to changes:
													addtochanges([currentmapnumber, 3, g, (displayitems[g].join(","))]);
													item.removeMovieClip();
													if (g == parseInt(familiarfoundindex)) {
														// then return familiar to hero clip as hero has collected the item the familar was over
														familiarfoundindex = -1;
														familiarstate = 0;
														scrollclip.hero.familiar._visible = true;
														removeMovieClip(scrollclip.familiar);
													}
												}
											}
										} else {
											statusMessage("inventory full");
										}
									}
								} else {
									statusMessage("failed to harvest anything");
								}
							}
							break;
						case "sign" :
							// is a signpost - display the description:
							speak(inventoryitems[(displayitems[g][2])][1],-1);
							break;


						case "toggle" :
							if (questEvents[(displayitems[g][5])] != 1) {
								// not already active, show animation:
								item.a.gotoAndPlay("turnOn");
								questEvents[(displayitems[g][5])] = 1;
							} else {
								item.a.gotoAndPlay("turnOff");
								questEvents[(displayitems[g][5])] = 0;
							}


							// check if anything needs to change in the world beyond the quest event (eg. terrain changing):
							scrollclip.checkWorldEvent();

							break;


						case "activate" :
							if (questEvents[(displayitems[g][5])] != 1) {
								// not already active, show animation:
								item.a.gotoAndPlay("turnOn");
							}
							// set a quest event to be true:                      
							questEvents[(displayitems[g][5])] = 1;
							// check if anything needs to change in the world beyond the quest event (eg. terrain changing):
							scrollclip.checkWorldEvent();

							break;

						default :
							// is a standard item
							// check to see if there is room in the inventory:
							// ###############
							// this was [g][5] but then Collection items didn't work - changed to [4]:
							if (displayitems[g][4] == "0") {
								// use default property values:
								var itemPropertiesString = displayitems[g][2] + ".1.4.100.4.-1.0.0.0.0.0";
							} else {
								var itemPropertiesString = displayitems[g][5];
							}
							var thisItemsProperties = itemPropertiesString.split(".");





							if (canadditemtoinventory(thisItemsProperties[0], thisItemsProperties[1], thisItemsProperties[2], thisItemsProperties[3], thisItemsProperties[4], thisItemsProperties[5], thisItemsProperties[6], thisItemsProperties[7], thisItemsProperties[8], thisItemsProperties[9], thisItemsProperties[10]) == parseInt(thisItemsProperties[1])) {
								additemtoinventory(thisItemsProperties[0],thisItemsProperties[1],thisItemsProperties[2],thisItemsProperties[3],thisItemsProperties[4],thisItemsProperties[5],thisItemsProperties[6],thisItemsProperties[7],thisItemsProperties[8],thisItemsProperties[9],thisItemsProperties[10]);
								showItemAddedAnimation(displayitems[g][2]);
								// remove item
								removeMovieClip(scrollclip["i_" + itemxtile + "_" + itemytile]);
								// remove item from array
								statusMessage("received " + inventoryitems[(displayitems[g][2])][0]);
								displayitems.splice(g,1);
								// add this removal to changes array:
								// mapnumber, type 3 = item, item's index, new value (if newvalue == -1 then remove from array)
								addtochanges([currentmapnumber, 3, g, -1]);
								// check if this new item was a treasure map, and generate the map if so:
								if (thisItemsProperties[0] == "35") {
									var treasureMapProperties = thisItemsProperties[7].split("|");
									initNewTreasureMap(treasureMapProperties[0],treasureMapProperties[1],treasureMapProperties[2]);
								}
								//                                                                                                                    
								if (g == parseInt(familiarfoundindex)) {
									// then return familiar to hero clip as hero has collected the item the familar was over
									familiarfoundindex = -1;
									familiarstate = 0;
									scrollclip.hero.familiar._visible = true;
									removeMovieClip(scrollclip.familiar);
									// clear reference to this item as it no longer exists:
									familiarsLastItem = -1;
								}
								// check if this item's index is less than the familiarfoundindex, if it is then this will point to the wrong                                                                                                                      
								// item index now the item has been removed from the array, so it will need to be reduced by 1 accordingly:
								if (g < parseInt(familiarfoundindex)) {
									familiarfoundindex = parseInt(familiarfoundindex) - 1;
								}
							} else {



								statusMessage("inventory full");
							}
							break;
					}
					whichkeyreleased = 0;
					break;
				}
			}
		}
	}
}
function checkforlockeddoors() {
	// see if target tile is a locked door
	if (whichkeyreleased == keyaction) {
		// CTRL pressed
		if (doorplayinganimation != 1) {
			var lockeddoortile = scrollclip["t_" + (herox + storedxdir) + "_" + (heroy + storedydir)];
			var lockeddoortilekey:Number = parseInt(lockeddoortile.k);
			if (lockeddoortilekey) {
				// check it is a locked door (ie. has a k value)
				// then check if hero has this item
				if (hasgotitem(lockeddoortilekey, 1)) {
					// play animation
					lockeddoortile.a.gotoAndPlay(2);
					openingdoorx = (herox + storedxdir);
					openingdoory = (heroy + storedydir);
					// remove key from inventory...
					removeitemfrominventory(lockeddoortilekey,1);
					// ...and add used key if it'll fit
					if (canadditemtoinventory(lockeddoortilekey + 1, 1, 4, 100, 4, -1, 0, 0, 0, 0, "-") == 1) {
						additemtoinventory(lockeddoortilekey + 1,1,4,100,4,-1,0,0,0,0,"-");
					}
				} else {
					statusMessage("this door is locked");
				}
				whichkeyreleased = 0;
			}
		}
	}
}
function islocationproperty(attribute:Number, tilepx:Number, tilepy:Number) {
	// attributes listed in frame 1 of tile movieclip
	var tileproperty:Number = scrollclip["t_" + tilepx + "_" + tilepy].p;
	if (tileproperty == (attribute | tileproperty)) {
		return true;
	} else {
		return false;
	}
}

function initialheightsetup() {
	if (initialheight == -1) {
		// tile height can't be determined (random map etc) - get value from maximum possible for this map
		initialheight = parseInt(maxPossibleHeightForThisMap);
		scrollclip._y = 240 + buildyoffset + initialheight;
	}
	// check if there is a new height offset                                                                                                                         
	heightgained = initialheight;
	heightchange = initialheight;
	previousoffset = initialheight;
	scrollclip.hero._y -= initialheight;
	scrollclip.pet._y -= initialheight;
	// calculate hero's depth based on its centre
	var heronewdepth:Number;
	if (initialheight == 0) {
		// ie. not on a raised section
		heronewdepth = calculateobjectdepth(scrollclip.hero._x, (scrollclip.hero._y + heightgained));
	} else {
		// hero is on a raised section
		heronewdepth = scrollclip["t_" + herox + "_" + heroy].getDepth() + 1;
		// move pet up as well
		scrollclip.hero.swapDepths(scrollclip["t_" + herox + "_" + heroy].getDepth() + 1);
	}
	scrollclip.hero.swapDepths(heronewdepth);

}
function speak(whattosay:String, whosaiditindex) {
	// don't run through this again if waiting for a response:
	if (waitingforresponse != 1) {
		if (whatslefttoshout != "") {
			if (whosaiditindex == mabs(npcshouting - 1)) {
				// this npc's pair is currently shouting, so clear the shout box:
				scrollclip.timeddialoguebox._visible = false;
				npcshouting = -1;
				clearInterval(shoutOuttext);
			}
		}
		if (npcshouting == whosaiditindex) {
			// this npc is currently shouting, so clear the shout box:
			scrollclip.timeddialoguebox._visible = false;
			npcshouting = -1;
			clearInterval(shoutOuttext);
		}
		if (whattosay.indexOf(";") != -1) {
			// play sound effect instead:
			playsoundeffect(whattosay.substring(1));
		} else {
			var sharp:Number = whattosay.indexOf("#");
			var removethisspeech:Boolean = false;

			var firstLessThan = whattosay.indexOf("<");
			if (firstLessThan != -1) {
				// give the hero an item
				var lastLessThan = whattosay.lastIndexOf("<");

				var thisItemToBeGiven = whattosay.substring(firstLessThan + 1, lastLessThan);
				whattosay = whattosay.substr(lastLessThan + 1);

				var npcitemreceived = thisItemToBeGiven.toString().split(".");
				npcitemquantity = parseInt(npcitemreceived[0]);
				npcitemtype = parseInt(npcitemreceived[1]);


				var thisItemsColour = 0;
				var thisItemsInscription = "-";

				// check if this is a quest catalogue item:
				if (inventoryitems[npcitemtype][6] == "catalogue") {
					thisItemsColour = "!!!";
					if (currentmapnumber < 0) {
						thisItemsInscription = cleanDungeonURL;
					} else {
						thisItemsInscription = currentmapnumber;
					}
				}




				if (canadditemtoinventory(npcitemtype, npcitemquantity, 4, 100, 4, -1, 0, thisItemsColour, 0, 0, thisItemsInscription) == npcitemquantity) {
					additemtoinventory(npcitemtype,npcitemquantity,4,100,4,-1,0,thisItemsColour,0,0,thisItemsInscription);
					showItemAddedAnimation(npcitemtype);
					// remove this dialogue now successfully given:
					removethisspeech = true;

					// check for a quest catalogue item:
					if (inventoryitems[npcitemtype][6] == "catalogue") {
						cataloguesThatNeedData++;
						checkForNewCatalogues();
					}

				} else {
					whattosay += "\nbut inventory is full";
					// keep the speech counter on this one:
					scrollclip["n_" + whosaiditindex].speechcounter -= 1;
				}
			}

			if (whattosay.indexOf("%") != -1) {
				removethisspeech = true;
				// remove the % (which will be at the start of the dialogue - before any other codes)
				whattosay = whattosay.substring(1);
			}
			var replacethisspeech:Boolean = false;
			if (whattosay.indexOf("^") != -1) {
				replacethisspeech = true;
				// remove the ^ (which will be at the start of the dialogue - before any other codes)
				whattosay = whattosay.substring(1);
			}
			if (whattosay.indexOf("{") != -1) {
				// is workshop related speech - check if this npc has anything ready for the hero:
				if (currentplans[0] != 0) {
					// npc has an item for the hero:
					whattosay = scrollclip.dialogue[0];
					if (canadditemtoinventory(currentplans[0], 1, 4, 100, 4, -1, 0, 0, 0, 0, "-") == 1) {
						additemtoinventory(currentplans[0],1,4,100,4,-1,0,0,0,0,"-");
						currentplans[0] = 0;
						addtochanges([currentmapnumber, 5, 0, 0]);
					} else {
						whattosay += "\nbut inventory is full";
					}
				} else {
					// remove the "{"
					whattosay = whattosay.substring(1);
				}
			}
			if (whattosay.indexOf("/") != -1) {
				// is a question/response dialogue
				var questionresponse:Array = whattosay.split("/");
				gamedisplay.responsebox.choices = [];
				gamedisplay.responsebox.responses = [];
				if (challengeissued) {
					// [question],[response if no],[npc wins],[hero wins]
					gamedisplay.responsebox.choices = ["accept", "decline"];
					gamedisplay.responsebox.responses[1] = questionresponse[1];
					cardplayerlost = questionresponse[2];
					cardplayerwins = questionresponse[3];
				} else {
					// [question],[hero yes],[response to yes],[hero no],[response to no],...[hero other choice #1],[response to hero other choice #1]...
					for (var addResponses = 1; addResponses < questionresponse.length; addResponses = addResponses + 2) {
						gamedisplay.responsebox.choices.push(questionresponse[addResponses]);
						gamedisplay.responsebox.responses.push(questionresponse[(addResponses + 1)]);
					}
				}
				waitingforresponse = 1;
				// say question:
				displaytext(questionresponse[0],whosaiditindex,true);
			} else if (sharp != -1) {
				// is a quest dialogue - determine quest number
				var questnumber:Number = parseInt(whattosay.substring(0, sharp));
				// strip quest number and # from string and split to array:
				var questresponse:Array = (whattosay.substring(sharp + 1)).split("~");



				if (questnumber == 0) {
					if (quests[0][0] == "1") {
						// there is a complete collection
						displaytext(questresponse[1],whosaiditindex,true);

						// determine the reward:
						if (completedCollections[whichCollectionComplete] == 1) {
							// collection has been completed before:
							var rewardItem = collections[whichCollectionComplete][2];
							if (rewardItem == "R") {
								// is repeatable, use the primary reward:
								rewardItem = collections[whichCollectionComplete][1];
							}
						} else {



							var rewardItem = collections[whichCollectionComplete][1];
						}
						if (rewardItem.substr(0, 1) == "S") {
							// it's money:
							quantitytoadd = parseInt(rewardItem.substring(1));
							money += quantitytoadd;
							showMoneyReceived(quantitytoadd);
							updatemoney();



						} else {

							if (canadditemtoinventory(rewardItem, 1, 4, 100, 4, -1, 0, 0, 0, 0, "-") == 1) {
								additemtoinventory(rewardItem,1,4,100,4,-1,0,0,0,0,"-");
								showItemAddedAnimation(rewardItem);
								// clear this collection
								for (var ci = 0; ci < currentCollections[whichCollectionComplete].length; ci++) {
									currentCollections[whichCollectionComplete][ci] = 0;
								}

								updateCollectionAlbumPages();

								quests[0][0] = "0";

								// there might be another collection complete though, so check for this:
								if (collectionIsComplete()) {
									quests[0][0] = "1";
								}
								hotSpotQuestChange();
							} else {
								statusMessage("inventory full");
							}
						}
					} else {
						// no collection complete:
						displaytext(questresponse[0],whosaiditindex,true);
					}
				} else {
					var herohasquestitems:Boolean = true;
					// create item required array from string:
					itemreqarray = new Array();
					var itemreqstring:Array = quests[questnumber][2].split("|");



					for (var i = 0; i < itemreqstring.length; i++) {
						itemreqarray[i] = itemreqstring[i].split(".");
					}


					// check if hero has all the required items to complete the quest:
					if (itemreqarray[i][2] == "a") {
						// player needs to have made the items:
						for (var i in itemreqarray) {
							if (itemreqarray[i].indexOf("!") != -1) {
								// is a quest event 
								if (questEvents[itemreqarray[i].toString().substring(1)] == 0) {
									herohasquestitems = false;
								}

							} else {

								var quantityCarrying = 0;
								foundItemInSet = "";
								foundItemInSlot = -1;
								for (j in inventory) {
									if (inventory[j][0] == objectrequired) {
										if (inventory[j][9] == charnumber) {
											quantityCarrying += parseInt(inventory[j][1]);
										}
									}
								}
								if (petcarrying.length != 0) {
									if (isinrange(scrollclip.hero.px, scrollclip.hero.py, scrollclip.pet.px, scrollclip.pet.py, (spacing * 1.5))) {
										for (var j = 0; j < petcarrying.length; i++) {
											if (petcarrying[j][0] == objectrequired) {
												if (inventory[j][9] == charnumber) {
													quantityCarrying += parseInt(petcarrying[j][1]);
												}
											}
										}
									}
								}
								if (quantityCarrying < quantityrequired) {
									herohasquestitems = false;
								}
							}
						}
					} else {



						for (var i in itemreqarray) {




							if (itemreqarray[i].toString().indexOf("!") != -1) {
								// is a quest event 
								if (questEvents[itemreqarray[i].toString().substring(1)] == 0) {
									herohasquestitems = false;
								}

							} else {

								if (!(hasgotitem(parseInt(itemreqarray[i][1]), parseInt(itemreqarray[i][0])))) {
									herohasquestitems = false;
								}
							}
						}
					}




					itemexchangenpc = whosaiditindex;
					// determine status of quest:



					switch (quests[questnumber][0]) {
						case 0 :
							if (questresponse[0].indexOf("`") != -1) {
								if (quests[questnumber][4] != 0) {
									// the npc must give an item to the hero to start this quest
									itemAddarray = new Array();
									var itemAddstring:Array = quests[questnumber][4].split("|");
									for (var i = 0; i < itemAddstring.length; i++) {
										itemAddarray[i] = itemAddstring[i].split(".");
									}
									// check hero has room for all items
									var oktoreceiveitem:Boolean = true;
									for (var i in itemAddarray) {
										if (canadditemtoinventory(parseInt(itemAddarray[i][1]), parseInt(itemAddarray[i][0]), 4, 100, 4, -1, 0, 0, 0, 0, "-") != parseInt(itemAddarray[i][0])) {
											oktoreceiveitem = false;
										}
									}
									if (oktoreceiveitem) {
										for (var i in itemAddarray) {
											additemtoinventory(parseInt(itemAddarray[i][1]),parseInt(itemAddarray[i][0]),4,100,4,-1,0,0,0,0,"-");
										}
										showItemAddedAnimation(parseInt(itemAddarray[i][1]));
										displaytext(questresponse[0].substring(1),whosaiditindex,true);
										scrollclip["n_" + whosaiditindex].speechcounter -= 1;
										// open quest:
										quests[questnumber][0] = 1;

										trackQuestItem(questnumber);

										hotSpotQuestChange();
									} else {
										displaytext(questresponse[0].substring(1) + " - but inventory full",whosaiditindex,true);
										scrollclip["n_" + whosaiditindex].speechcounter -= 1;
									}
								} else {
									// this should open the quest, but not check if it's complete:
									displaytext(questresponse[0].substring(1),whosaiditindex,true);
									// reduce the NPC's speechcounter by 1, so that when the normal increment occurs,                                                                                                                                                                                                                                    
									// it will bring it back to this quest dialogue
									scrollclip["n_" + whosaiditindex].speechcounter -= 1;
									// open quest:
									quests[questnumber][0] = 1;

									trackQuestItem(questnumber);
									hotSpotQuestChange();
								}
							} else {
								// quest not open yet, so say first part of dialogue if hero hasn't already got items:



								if (herohasquestitems) {
									switch (quests[questnumber][1]) {
										case 1 :




											// receive item from NPC
											// split the reward if there are random items
											var npcPossibleRewards = (quests[questnumber][3]).split("*");
											var randomItem = mfloor(mrand() * (npcPossibleRewards.length));
											var npcitemreceived = npcPossibleRewards[randomItem].toString().split(".");
											npcitemquantity = parseInt(npcitemreceived[0]);
											npcitemtype = parseInt(npcitemreceived[1]);
											if (canadditemtoinventory(npcitemtype, npcitemquantity, 4, 100, 4, -1, 0, 0, 0, 0, "-") == npcitemquantity) {
												additemtoinventory(npcitemtype,npcitemquantity,4,100,4,-1,0,0,0,0,"-");
												showItemAddedAnimation(npcitemtype);

												if (!itemexchangenpcthanks) {
													var itemexchangenpcthanks = whosaiditindex;
												}



												if (questresponse[2].indexOf("[") != -1) {



													// is a repeatable quest
													displaytext(questresponse[2].substring(1),itemexchangenpc,true);
													quests[questnumber][0] = 1;

													trackQuestItem(questnumber);
												} else {

													displaytext(questresponse[2],whosaiditindex,true);
													// close quest
													quests[questnumber][0] = 3;
													// remove quest related dialogue from the NPCs array:                                                                                                                                                                                                                                  
													currentnpcs[itemexchangenpc].splice(11,1);

													stopTrackingQuestItem(questnumber);
													scrollclip["n_" + whosaiditindex].speechcounter -= 1;
													addtochanges([currentmapnumber, 1, itemexchangenpc, (currentnpcs[itemexchangenpc].join(","))]);
													checkForTitleGain(questnumber);
												}
												hotSpotQuestChange();
											} else {
												// push speech counter back to keep it on the quest speech:
												scrollclip["n_" + whosaiditindex].speechcounter -= 1;
												statusMessage("Inventory full");
											}
											break;
										case 2 :
											// exchange item with NPC
											var npcitemreceived:Array = (quests[questnumber][3]).split(".");
											npcitemquantity = parseInt(npcitemreceived[0]);
											npcitemtype = parseInt(npcitemreceived[1]);
											waitingforresponse = 2;
											//gamedisplay.responsebox.choice1 = "yes";
											//gamedisplay.responsebox.choice2 = "no";
											gamedisplay.responsebox.choices = [];
											gamedisplay.responsebox.choices.push("yes","no");
											itemexchangenpcthanks = questresponse[3];
											itemexchangequest = questnumber;
											scrollclip["n_" + whosaiditindex].speechcounter -= 1;
											displaytext(questresponse[2],whosaiditindex,true);
											break;
										default :
											// just speaking

											if (itemexchangenpcthanks.indexOf("[") != -1) {

												// is a repeatable quest
												displaytext(questresponse[2].substring(1),itemexchangenpc,true);
												quests[questnumber][0] = 1;

												trackQuestItem(questnumber);
											} else {
												displaytext(questresponse[2],whosaiditindex,true);
												// close quest
												quests[questnumber][0] = 3;

												stopTrackingQuestItem(questnumber);
												// remove quest related dialogue from the NPCs array:                                                                                                                                                                                                                                  
												currentnpcs[itemexchangenpc].splice(11,1);
												scrollclip["n_" + whosaiditindex].speechcounter -= 1;
												addtochanges([currentmapnumber, 1, itemexchangenpc, (currentnpcs[itemexchangenpc].join(","))]);
												checkForTitleGain(questnumber);
											}
											hotSpotQuestChange();
									}
								} else if (questresponse[0].indexOf("¬") != -1) {
									// this can't open the quest - so don't say this bit of dialogue
									// display the speech that follows this in the dialogue array 
									var nextbitofspeech:String = scrollclip.dialogue[((parseInt((currentnpcs[whosaiditindex][NPCStartSpeechIndex + (scrollclip["n_" + whosaiditindex].speechcounter)]))))];
									displaytext(nextbitofspeech,whosaiditindex,true);
									scrollclip["n_" + whosaiditindex].speechcounter -= 1;
								} else {
									if (quests[questnumber][4] != 0) {
										// the npc must give an item to the hero to start this quest
										itemAddarray = new Array();
										var itemAddstring:Array = quests[questnumber][4].split("|");
										for (var i = 0; i < itemAddstring.length; i++) {
											itemAddarray[i] = itemAddstring[i].split(".");
										}
										// check hero has room for all items
										var oktoreceiveitem:Boolean = true;
										for (var i in itemAddarray) {
											if (canadditemtoinventory(parseInt(itemAddarray[i][1]), parseInt(itemAddarray[i][0]), 4, 100, 4, -1, 0, 0, 0, 0, "-") != parseInt(itemAddarray[i][0])) {
												oktoreceiveitem = false;
											}
										}
										if (oktoreceiveitem) {
											for (var i in itemAddarray) {
												additemtoinventory(parseInt(itemAddarray[i][1]),parseInt(itemAddarray[i][0]),4,100,4,-1,0,0,0,0,"-");
											}
											showItemAddedAnimation(parseInt(itemAddarray[i][1]));
											displaytext(questresponse[0],whosaiditindex,true);
											scrollclip["n_" + whosaiditindex].speechcounter -= 1;
											// open quest:
											quests[questnumber][0] = 1;

											trackingQuestItem(questnumber);
											hotSpotQuestChange();
										} else {
											displaytext(questresponse[0] + " - but inventory full",whosaiditindex,true);
											scrollclip["n_" + whosaiditindex].speechcounter -= 1;
										}
									} else {

										displaytext(questresponse[0],whosaiditindex,true);
										// reduce the NPC's speechcounter by 1, so that when the normal increment occurs,                                                                                                                                                                                                                                    
										// it will bring it back to this quest dialogue
										scrollclip["n_" + whosaiditindex].speechcounter -= 1;
										// open quest:
										quests[questnumber][0] = 1;
										trackQuestItem(questnumber);

										hotSpotQuestChange();
									}
								}
							}
							break;
						case 1 :
							if (questresponse[0].indexOf("`") != -1) {
								// this can't close the quest - so don't check if hero has items
								displaytext(questresponse[1],whosaiditindex,true);
								scrollclip["n_" + whosaiditindex].speechcounter -= 1;
							} else {
								// quest is open, but not complete - check if items required are in the hero's inventory:


								if (herohasquestitems) {
									switch (quests[questnumber][1]) {
										case 1 :
											// receive item from NPC


											// split the reward if there are random items
											var npcPossibleRewards = (quests[questnumber][3]).split("*");
											if (npcPossibleRewards.length > 1) {
												var randomItem = mfloor(mrand() * (npcPossibleRewards.length)) + 1;
											} else {
												var randomItem = 0;
											}

											var npcitemreceived:Array = npcPossibleRewards[randomItem].split(".");
											npcitemquantity = parseInt(npcitemreceived[0]);
											npcitemtype = parseInt(npcitemreceived[1]);


											if (canadditemtoinventory(npcitemtype, npcitemquantity, 4, 100, 4, -1, 0, 0, 0, 0, "-") == npcitemquantity) {
												additemtoinventory(npcitemtype,npcitemquantity,4,100,4,-1,0,0,0,0,"-");
												showItemAddedAnimation(npcitemtype);


												if (questresponse[2].indexOf("[") != -1) {

													displaytext(questresponse[2].substring(1),whosaiditindex,true);
													quests[questnumber][0] = 1;

												} else {
													// close quest
													quests[questnumber][0] = 3;
													displaytext(questresponse[2],whosaiditindex,true);
													// remove quest related dialogue from the NPCs array:                                                                                                                                                                                                                                  
													currentnpcs[itemexchangenpc].splice(11,1);
												}


												stopTrackingQuestItem(questnumber);
												hotSpotQuestChange();


												scrollclip["n_" + whosaiditindex].speechcounter -= 1;
												addtochanges([currentmapnumber, 1, itemexchangenpc, (currentnpcs[itemexchangenpc].join(","))]);
												checkForTitleGain(questnumber);
											} else {

												statusMessage("Inventory full");
												// push speech counter back to keep it on the quest speech:
												scrollclip["n_" + whosaiditindex].speechcounter -= 1;
											}
											break;
										case 2 :
											// exchange item with NPC
											var npcitemreceived:Array = (quests[questnumber][3]).split(".");
											npcitemquantity = parseInt(npcitemreceived[0]);
											npcitemtype = parseInt(npcitemreceived[1]);
											waitingforresponse = 2;
											gamedisplay.responsebox.choices = [];
											gamedisplay.responsebox.choices.push("yes","no");
											itemexchangenpc = whosaiditindex;
											itemexchangenpcthanks = questresponse[3];
											itemexchangequest = questnumber;
											scrollclip["n_" + whosaiditindex].speechcounter -= 1;
											displaytext(questresponse[2],whosaiditindex,true);
											break;
										default :
											// just speaking
											displaytext(questresponse[2],whosaiditindex,true);
											// close quest
											quests[questnumber][0] = 3;

											stopTrackingQuestItem(questnumber);
											hotSpotQuestChange();
											// remove quest related dialogue from the NPCs array:                                                                                                                                                                                                                                  
											currentnpcs[itemexchangenpc].splice(11,1);
											scrollclip["n_" + whosaiditindex].speechcounter -= 1;
											addtochanges([currentmapnumber, 1, itemexchangenpc, (currentnpcs[itemexchangenpc].join(","))]);
											checkForTitleGain(questnumber);
									}
								} else {
									displaytext(questresponse[1],whosaiditindex,true);
									// reduce the NPC's speechcounter by 1, so that when the normal increment occurs,                                                                                                                                                                                                                                    
									// it will bring it back to this quest dialogue
									scrollclip["n_" + whosaiditindex].speechcounter -= 1;
								}
							}
							break;
						case 2 :
							if (questresponse[0].indexOf("`") != -1) {
								// this can't close the quest - so don't check if hero has items
								displaytext(questresponse[1],whosaiditindex,true);
								scrollclip["n_" + whosaiditindex].speechcounter -= 1;
							} else {
								// hero has completed quest but not spoken to NPC yet
								// won't be an item exchange - as this will be successful according to some event not possession of an item
								if ((quests[questnumber][1]) == 1) {
									// receive item from NPC
									// split the reward if there are random items
									var npcPossibleRewards = (quests[questnumber][3]).split("*");
									var randomItem = mfloor(mrand() * (npcPossibleRewards.length)) + 1;
									var npcitemreceived:Array = npcPossibleRewards[randomItem].split(".");
									var npcitemquantity = parseInt(npcitemreceived[0]);
									if (canadditemtoinventory(npcitemtype, npcitemquantity, 4, 100, 4, -1, 0, 0, 0, 0, "-") == npcitemquantity) {
										additemtoinventory(npcitemtype,npcitemquantity,4,100,4,-1,0,0,0,0,"-");
										showItemAddedAnimation(npcitemtype);
										displaytext(questresponse[2],whosaiditindex,true);
										// completely close quest:
										quests[questnumber][0] = 3;

										stopTrackingQuestItem(questnumber);
										hotSpotQuestChange();
										// remove quest related dialogue from the NPCs array:
										currentnpcs[itemexchangenpc].splice(11,1);
										scrollclip["n_" + whosaiditindex].speechcounter -= 1;
										addtochanges([currentmapnumber, 1, itemexchangenpc, (currentnpcs[itemexchangenpc].join(","))]);
										checkForTitleGain(questnumber);
									}
								} else {
									// just speaking
									displaytext(questresponse[2],whosaiditindex,true);
									// completely close quest:
									quests[questnumber][0] = 3;

									stopTrackingQuestItem(questnumber);
									hotSpotQuestChange();
									// remove quest related dialogue from the NPCs array:
									currentnpcs[itemexchangenpc].splice(11,1);
									scrollclip["n_" + whosaiditindex].speechcounter -= 1;
									addtochanges([currentmapnumber, 1, itemexchangenpc, (currentnpcs[itemexchangenpc].join(","))]);
									checkForTitleGain(questnumber);
								}
							}
							break;
						case 3 :
							// quest is closed - this will only be displayed by wanted posters etc., as
							// NPCs will have the quest dialogue removed once closed
							displaytext(questresponse[2],whosaiditindex,true);
							break;
						default :
							//
					}
				}
			} else if (whattosay.indexOf("*") != -1) {
				// is a lottery related piece of dialogue:
				whattosay = whattosay.substring(1);
				thisLotterySpeech = whattosay.split("|");
				// check if the prize amount has been found yet:
				if (currentLotteryAmount == -1) {
					// hasn't been found, just display the decision to buy a ticket or not
					var thisLotteryDecision = thisLotterySpeech[1];
				} else {
					// replace '£x' with the prize fund amount
					var replaceIndex = thisLotterySpeech[0].indexOf("£x");
					var lotteryGold = parseMoney(currentLotteryAmount);
					var thisLotteryDecision = thisLotterySpeech[0].substring(0, replaceIndex) + lotteryGold + thisLotterySpeech[0].substring(replaceIndex + 2) + thisLotterySpeech[1];
				}
				confirmAction = "confirmingLotteryPurchase";
				gamedisplay.responsebox.choices = ["yes please", "no thanks"];
				waitingforresponse = 1;
				displaytext(thisLotteryDecision,whosaiditindex,true);
			} else {
				if (whattosay.indexOf("]") != -1) {
					// display as a shout - pass whattosay but without the ']' at the start:
					displayshouttext(whattosay.substring(1),whosaiditindex,true);
				} else {
					// is just normal text 
					displaytext(whattosay,whosaiditindex,true);
					if (challengeissued) {
						// npc doesn't want to play (ie. just a spoken response), so remove challenge:
						challengeissued = false;
					}
				}
			}
			if (removethisspeech) {
				// remove dialogue from the NPC's array:                                                                                                                                                                                                                                  
				currentnpcs[whosaiditindex].splice(11,1);
				scrollclip["n_" + whosaiditindex].speechcounter -= 1;
				addtochanges([currentmapnumber, 1, whosaiditindex, (currentnpcs[whosaiditindex].join(","))]);
			}
			if (replacethisspeech) {
				// replace this dialogue with the one after it
				var whichreplacespeech:Number = (parseInt((currentnpcs[whosaiditindex][NPCStartSpeechIndex + (scrollclip["n_" + whosaiditindex].speechcounter)])));
				currentnpcs[whosaiditindex][NPCStartSpeechIndex + (scrollclip["n_" + whosaiditindex].speechcounter)] = whichreplacespeech + 1;
				addtochanges([currentmapnumber, 1, whosaiditindex, (currentnpcs[whosaiditindex].join(","))]);
			}
			if (whattosay.indexOf("]") != -1) {
				// if it was shouted out, then move the counter on to the next bit of dialogue
				scrollclip["n_" + whosaiditindex].speechcounter++;
				if (scrollclip["n_" + whosaiditindex].speechcounter >= ((currentnpcs[whosaiditindex].length) - NPCStartSpeechIndex)) {
					scrollclip["n_" + whosaiditindex].speechcounter = 0;
				}
			}
		}
	}
}
//
function displaytext(whattexttoshow:String, npcspeechindex:Number, shoulddisplayname:Boolean) {
	if (whattexttoshow == "SHOP") {
		openShop();
	} else {
		// stop hero animation:
		scrollclip.hero.heroclip.stop();
		//check to see if there's any continuation text:
		var continuetext:Number = whattexttoshow.indexOf("+");
		if (continuetext == -1) {
			// no run-on text:
			whatslefttosay = "";
		} else {
			// is continuation text, but only 1 npc talking, or is the current npc of the pair
			whatslefttosay = (whattexttoshow.substring(continuetext + 1, whattexttoshow.length));
			whattexttoshow = (whattexttoshow.substring(0, continuetext));
			whatsleftnpcindex = npcspeechindex;
			// check for paired conversation 
			var pairedtext:Number = whattexttoshow.indexOf("*");
			if (pairedtext != -1) {
				// find the paired npc, so that the box appears over them:
				var pairednpc:Number = mabs(npcspeechindex - 1);
				npcspeechindex = pairednpc;
				// remove *:
				whattexttoshow = (whattexttoshow.substring(pairedtext + 1, whattexttoshow.length));
				// display names with paired text:
				shoulddisplayname = true;
			}
			if ((whatslefttosay.indexOf("*")) != -1) {
				// then this speaker is part of a paired dialogue, so display their name:
				shoulddisplayname = true;
			}
			if (whatslefttosay == "*") {
				// check that any remaining * (used to display the name of the last paired speaker)
				// is ignored:
				whatslefttosay = "";
			}
		}
		// check to see if it's text needs to be added to the journal
		var break1:Number = whattexttoshow.indexOf("@");
		if (break1 != -1) {
			// add to journal - npc's name, location and what was said;
			var whattoaddtojournal:String = unescape("'" + currentnpcs[npcspeechindex][10] + ", " + locationname + " - " + (whattexttoshow.substring((break1 + 1), whattexttoshow.length)) + "'");
			journal.push(whattoaddtojournal);
			// strip off beginning of text (NPC's name/location) and just display the rest
			whattexttoshow = (whattexttoshow.substring(break1 + 1, whattexttoshow.length));
		}
		if (shoulddisplayname) {
			// add npc's name:
			whattexttoshow = (currentnpcs[npcspeechindex][10]) + "\n" + "'" + whattexttoshow + "'";
			whattexttoshow = unescape(whattexttoshow);
		}
		gamedisplay.dialoguebox.speech = whattexttoshow;
		gamedisplay.dialoguebox.backgroundbox._height = gamedisplay.dialoguebox.speechbox.textHeight + 6;
		gamedisplay.dialoguebox.boxbottom._y = gamedisplay.dialoguebox.speechbox.textHeight + 6;
		if (npcspeechindex == -1) {
			// is a general 'you have found' type of display, so centre above hero
			gamedisplay.dialoguebox._x = scrollclip.hero._x + scrollclip._x - gamedisplay._x - ((scrollclip.hero._width) / 2);
			gamedisplay.dialoguebox._y = scrollclip.hero._y + scrollclip._y - gamedisplay._y - (scrollclip.hero._height) - gamedisplay.dialoguebox.backgroundbox._height;
		} else {
			gamedisplay.dialoguebox._x = scrollclip["n_" + npcspeechindex]._x + scrollclip._x - gamedisplay._x - ((scrollclip["n_" + npcspeechindex]._width) / 2);
			if (scrollclip.hero._y <= scrollclip["n_" + npcspeechindex]._y) {
				gamedisplay.dialoguebox._y = scrollclip["n_" + npcspeechindex]._y + scrollclip._y - gamedisplay._y + (scrollclip["n_" + npcspeechindex]._width / 2);
			} else {
				gamedisplay.dialoguebox._y = scrollclip["n_" + npcspeechindex]._y + scrollclip._y - gamedisplay._y - scrollclip["n_" + npcspeechindex]._height - gamedisplay.dialoguebox.backgroundbox._height;
			}
		}
		// reveal dialogue box:
		gamedisplay.dialoguebox._visible = true;
		dialogueboxdisplayed = true;
		// check for and display response box if needed:
		if (waitingforresponse > 0) {
			gamedisplay.responsebox._x = gamedisplay.dialoguebox._x;
			gamedisplay.responsebox._y = gamedisplay.dialoguebox._y + gamedisplay.dialoguebox.backgroundbox._height + 8;
			// display choices:
			var possibleResponsesYPos = 0;
			for (var possibleResponsesLoop = 0; possibleResponsesLoop < 6; possibleResponsesLoop++) {
				if (possibleResponsesLoop < gamedisplay.responsebox.choices.length) {
					gamedisplay.responsebox["choice" + possibleResponsesLoop].text = gamedisplay.responsebox.choices[possibleResponsesLoop];
					gamedisplay.responsebox["choice" + possibleResponsesLoop]._y = possibleResponsesYPos;
					possibleResponsesYPos += gamedisplay.responsebox["choice" + possibleResponsesLoop].textHeight + 6;
					gamedisplay.responsebox["choice" + possibleResponsesLoop]._visible = true;
				} else {
					gamedisplay.responsebox["choice" + possibleResponsesLoop]._visible = false;
				}
			}
			gamedisplay.responsebox.backgroundbox._height = possibleResponsesYPos + 4;
			gamedisplay.responsebox.boxbottom._y = possibleResponsesYPos + 4;
			gamedisplay.responsebox._visible = true;
		}
		whosaiditindex = npcspeechindex;
	}
}
//
function displayshouttext(whattexttoshow:String, npcspeechindex:Number, shoulddisplayname:Boolean) {
	// check to see if there's any continuation text:
	var continuetext:Number = whattexttoshow.indexOf("+");
	if (continuetext == -1) {
		// no run-on text:
		whatslefttoshout = "";
	} else {
		// is continuation text, but only 1 npc talking, or is the current npc of the pair
		whatslefttoshout = (whattexttoshow.substring(continuetext + 1, whattexttoshow.length));
		whattexttoshow = (whattexttoshow.substring(0, continuetext));
		whatsleftshoutnpcindex = npcspeechindex;
		// check for paired conversation 
		var pairedtext:Number = whattexttoshow.indexOf("*");
		if (pairedtext != -1) {
			// find the paired npc, so that the box appears over them:
			var pairednpc:Number = mabs(npcspeechindex - 1);
			npcspeechindex = pairednpc;
			// remove *:
			whattexttoshow = (whattexttoshow.substring(pairedtext + 1, whattexttoshow.length));
			// display names with paired text:
			shoulddisplayname = true;
		}
		if ((whatslefttoshout.indexOf("*")) != -1) {
			// then this speaker is part of a paired dialogue, so display their name:
			shoulddisplayname = true;
		}
		if (whatslefttoshout == "*") {
			// check that any remaining * (used to display the name of the last paired speaker)
			// is ignored:
			whatslefttoshout = "";
		}
	}
	if (shoulddisplayname) {
		// add npc's name:
		// add another row's worth of height:
		scrollclip.timeddialoguebox.backgroundbox._height += 17;
		scrollclip.timeddialoguebox.boxbottom._y += 17;
		whattexttoshow = (currentnpcs[npcspeechindex][10]) + "\n" + "'" + whattexttoshow + "'";
		whattexttoshow = unescape(whattexttoshow);
	}
	scrollclip.timeddialoguebox.speech = whattexttoshow;
	scrollclip.timeddialoguebox.backgroundbox._height = scrollclip.timeddialoguebox.speechbox.textHeight + 6;
	scrollclip.timeddialoguebox.boxbottom._y = scrollclip.timeddialoguebox.speechbox.textHeight + 6;
	scrollclip.timeddialoguebox._x = scrollclip["n_" + npcspeechindex]._x - ((scrollclip["n_" + npcspeechindex]._width) / 2);
	if (scrollclip.hero._y <= scrollclip["n_" + npcspeechindex]._y) {
		scrollclip.timeddialoguebox._y = scrollclip["n_" + npcspeechindex]._y + (scrollclip["n_" + npcspeechindex]._width / 2);
	} else {
		scrollclip.timeddialoguebox._y = scrollclip["n_" + npcspeechindex]._y - scrollclip["n_" + npcspeechindex]._height - gamedisplay.dialoguebox.backgroundbox._height;
	}
	// reveal dialogue box:
	scrollclip.timeddialoguebox._visible = true;
	// set time out:
	shoutOuttext = setInterval(hideShout, displayshouting);
	npcshouting = npcspeechindex;
}
//
function playsoundeffect(whichsound:String) {
	if (playsounds) {
		gamedisplay.soundeffects.gotoAndPlay(whichsound);
	}
}
//
function removeitemfrominventory(itemtoremove:Number, quantitytoremove:Number) {
	// #########################
	// this will need amending
	var amountcarried:Number = 0;
	for (var i = 0; i < currentbagsize; i++) {
		if (inventory[i][0] == itemtoremove) {
			amountcarried += parseInt(inventory[i][1]);
		}
	}
	if (amountcarried < quantitytoremove) {
		return false;
	} else {
		var amountremoved:Number = quantitytoremove;
		for (var i = 0; i < currentbagsize; i++) {
			if (amountremoved > 0) {
				if (parseInt(inventory[i][0]) == itemtoremove) {
					if (parseInt(inventory[i][1]) > amountremoved) {
						inventory[i][1] = parseInt(inventory[i][1]) - amountremoved;
						amountremoved = 0;
					} else {
						// remove what there is from this slot:
						amountremoved -= parseInt(inventory[i][1]);
						inventory[i][0] = 1;
						inventory[i][1] = 0;
					}
				}
			}
		}
		return true;
	}
}
//
function canadditemtoinventory(itemtoaddstr, quantitybeingadded, qualitybeingadded, durabeingadded, effecbeingadded, wrappingbeingadded, wearbeingadded, colourbeingadded, enchantbeingadded, hallmarkbeingadded, inscribebeingadded) {
	itemtoadd = parseInt(itemtoaddstr);
	quantitytoadd = parseInt(quantitybeingadded);
	qualitybeingadded = parseInt(qualitybeingadded);
	durabeingadded = parseInt(durabeingadded);
	effecbeingadded = parseInt(effecbeingadded);
	wrappingbeingadded = parseInt(wrappingbeingadded);
	wearbeingadded = parseInt(wearbeingadded);
	colourbeingadded = parseInt(colourbeingadded);
	enchantbeingadded = parseInt(enchantbeingadded);
	hallmarkbeingadded = parseInt(hallmarkbeingadded);
	// check if item to be added is just gold:
	itempricecode = inventoryitems[itemtoadd][2];
	if ((inventoryitems[itemtoaddstr][2]).indexOf("£") != -1) {
		// is money, so can be added:
		return quantitytoadd;
	} else {
		// isn't money:
		var quantityremainingtobeadded:Number = quantitytoadd;
		// check if the item to be added is a bag:
		var bagpricecode:Number = itempricecode.indexOf("b");
		// set artificial very high number:
		var newbagsize:Number = 99999;
		if (bagpricecode != -1) {
			newbagsize = parseInt(itempricecode.substring(bagpricecode + 1, itempricecode.length));
		}
		// check if the item's not a bag, or it's a smaller bag than the current one:                                                                                                                                                                                                                                                                                                 
		if ((bagpricecode == -1) || (newbagsize <= currentbagsize)) {
			// loop through array and find any existing slots:
			for (var i = 0; i < currentbagsize; i++) {
				if (quantityremainingtobeadded > 0) {
					// if item types and properties match, and the item to be added and the slot item aren't wrapped (which can't stack)
					if ((parseInt(inventory[i][0]) == itemtoadd) && (parseInt(inventory[i][2]) == qualitybeingadded) && (parseInt(inventory[i][3]) == durabeingadded) && (parseInt(inventory[i][4]) == effecbeingadded) && (wrappingbeingadded == -1) && (parseInt(inventory[i][5]) == -1) && (parseInt(inventory[i][6]) == wearbeingadded) && (parseInt(inventory[i][7]) == colourbeingadded) && (parseInt(inventory[i][8]) == enchantbeingadded) && (parseInt(inventory[i][9]) == hallmarkbeingadded) && (inventory[i][10] == inscribebeingadded)) {
						var amountavailabletothisslot:Number = maxitemsperslot - parseInt(inventory[i][1]);
						if (amountavailabletothisslot > 0) {
							if (amountavailabletothisslot > quantityremainingtobeadded) {
								quantityremainingtobeadded = 0;
								// no more to be added, so exit loop:
								break;
							} else {
								// add what can be added:
								quantityremainingtobeadded -= amountavailabletothisslot;
							}
						}
					}
				}
			}
			// if pet is in range and not all items have been added, then check petcarrying:
			if (petcarrying.length != 0) {
				if (isinrange(scrollclip.hero.px, scrollclip.hero.py, scrollclip.pet.px, scrollclip.pet.py, (spacing * 1.5))) {
					for (var i = 0; i < petcarrying.length; i++) {
						if (quantityremainingtobeadded > 0) {
							// if item types and properties match, and the item to be added isn't wrapped (which can't stack)
							if ((parseInt(petcarrying[i][0]) == itemtoadd) && (parseInt(petcarrying[i][2]) == qualitybeingadded) && (parseInt(petcarrying[i][3]) == durabeingadded) && (parseInt(petcarrying[i][4]) == effecbeingadded) && (wrappingbeingadded == -1) && (parseInt(inventory[i][5]) == -1) && (parseInt(petcarrying[i][6]) == wearbeingadded) && (parseInt(petcarrying[i][7]) == colourbeingadded) && (parseInt(petcarrying[i][8]) == enchantbeingadded) && (parseInt(petcarrying[i][9]) == hallmarkbeingadded) && (petcarrying[i][10] == inscribebeingadded)) {
								var amountavailabletothisslot:Number = maxitemsperslot - parseInt(petcarrying[i][1]);
								if (amountavailabletothisslot > 0) {
									if (amountavailabletothisslot > quantityremainingtobeadded) {
										quantityremainingtobeadded = 0;
										// no more to be added, so exit loop:
										break;
									} else {
										// add what can be added:
										quantityremainingtobeadded -= amountavailabletothisslot;
									}
								}
							}
						}
					}
				}
			}
			// check if all the items have been added successfully:                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
			if (quantityremainingtobeadded == 0) {
				return quantitytoadd;
			} else {
				// try and find an empty slot to add the remainder to:
				for (var i = 0; i < currentbagsize; i++) {
					if (quantityremainingtobeadded > 0) {
						if (inventory[i][0] == 1) {
							if (quantityremainingtobeadded <= maxitemsperslot) {
								quantityremainingtobeadded = 0;
							} else {
								quantityremainingtobeadded -= maxitemsperslot;
							}
						}
					}
				}
				// look in pet carrying for empty slots:
				if (petcarrying.length != 0) {
					if (isinrange(scrollclip.hero.px, scrollclip.hero.py, scrollclip.pet.px, scrollclip.pet.py, (spacing * 1.5))) {
						for (var i = 0; i < petcarrying.length; i++) {
							if (quantityremainingtobeadded > 0) {
								if (petcarrying[i][0] == 1) {
									if (quantityremainingtobeadded <= maxitemsperslot) {
										quantityremainingtobeadded = 0;
									} else {
										quantityremainingtobeadded -= maxitemsperslot;
									}
								}
							}
						}
					}
				}
			}
			if ((quantitytoadd - quantityremainingtobeadded) == 0) {
				// none were added:
				return 0;
			} else {
				return (quantitytoadd - quantityremainingtobeadded);
			}
		} else {
			return quantitytoadd;
		}
	}
}
//
function additemtoinventory(itemtoaddstr, quantitybeingadded, qualitybeingadded, durabeingadded, effecbeingadded, wrappingbeingadded, wearbeingadded, colourbeingadded, enchantbeingadded, hallmarkbeingadded, inscribebeingadded) {
	itemtoadd = parseInt(itemtoaddstr);
	quantitytoadd = parseInt(quantitybeingadded);
	qualitybeingadded = parseInt(qualitybeingadded);
	durabeingadded = parseInt(durabeingadded);
	effecbeingadded = parseInt(effecbeingadded);
	wrappingbeingadded = parseInt(wrappingbeingadded);
	// colour and wear aren't necessarily numbers - could be a user generated filename reference
	enchantbeingadded = parseInt(enchantbeingadded);
	hallmarkbeingadded = parseInt(hallmarkbeingadded);
	// slotsuccessful & setsuccessful is the location of the slot where the item is added
	slotsuccessful = -1;
	setsuccessful = "null";
	// check if item to be added is just gold:
	itempricecode = inventoryitems[itemtoadd][2];
	if ((inventoryitems[itemtoaddstr][2]).indexOf("£") != -1) {
		// is money:
		money += quantitytoadd;
		showMoneyReceived(quantitytoadd);
		updatemoney();
		return quantitytoadd;
	} else {
		// isn't money:
		var quantityremainingtobeadded:Number = quantitytoadd;



		// check if the item to be added is a bag: 
		var bagpricecode:Number = itempricecode.indexOf("b");
		// set artificial very high number:
		var newbagsize:Number = 99999;
		if (bagpricecode != -1) {
			newbagsize = parseInt(itempricecode.substring(bagpricecode + 1, itempricecode.length));
		}
		// check if the item's not a bag, or it's a smaller bag than the current one:                                                                                                                    
		if ((bagpricecode == -1) || (newbagsize <= currentbagsize)) {
			// loop through array and add to any existing slots:
			for (var i = 0; i < currentbagsize; i++) {
				if (quantityremainingtobeadded > 0) {
					// if item types and properties match, and the item to be added isn't wrapped (which can't stack)
					if ((parseInt(inventory[i][0]) == itemtoadd) && (parseInt(inventory[i][2]) == qualitybeingadded) && (parseInt(inventory[i][3]) == durabeingadded) && (parseInt(inventory[i][4]) == effecbeingadded) && (wrappingbeingadded == -1) && (parseInt(inventory[i][5]) == -1) && (parseInt(inventory[i][6]) == wearbeingadded) && (parseInt(inventory[i][7]) == colourbeingadded) && (parseInt(inventory[i][8]) == enchantbeingadded) && (parseInt(inventory[i][9]) == hallmarkbeingadded) && (inventory[i][10] == inscribebeingadded)) {
						var amountavailabletothisslot:Number = maxitemsperslot - parseInt(inventory[i][1]);
						if (amountavailabletothisslot > 0) {
							if (amountavailabletothisslot > quantityremainingtobeadded) {
								// add item to this slot:
								inventory[i][1] = parseInt(inventory[i][1]) + quantityremainingtobeadded;
								quantityremainingtobeadded = 0;
								slotsuccessful = i;
								setsuccessful = "iinv";
								// no more to be added, so exit loop:
								break;
							} else {
								// add what can be added:
								inventory[i][1] = parseInt(inventory[i][1]) + amountavailabletothisslot;
								quantityremainingtobeadded -= amountavailabletothisslot;
								slotsuccessful = i;
								setsuccessful = "iinv";
							}
						}
					}
				}
			}
			// if pet is in range (and can carry items) and not all items have been added, then check petcarrying:
			if (petcarrying.length != 0) {
				if (isinrange(scrollclip.hero.px, scrollclip.hero.py, scrollclip.pet.px, scrollclip.pet.py, (spacing * 1.5))) {
					for (var i = 0; i < petcarrying.length; i++) {
						if (quantityremainingtobeadded > 0) {
							// if item types and properties match, and the item to be added isn't wrapped (which can't stack)
							if ((parseInt(petcarrying[i][0]) == itemtoadd) && (parseInt(petcarrying[i][2]) == qualitybeingadded) && (parseInt(petcarrying[i][3]) == durabeingadded) && (parseInt(petcarrying[i][4]) == effecbeingadded) && (wrappingbeingadded == -1) && (parseInt(inventory[i][5]) == -1) && (parseInt(petcarrying[i][6]) == wearbeingadded) && (parseInt(petcarrying[i][7]) == colourbeingadded) && (parseInt(petcarrying[i][8]) == enchantbeingadded) && (parseInt(petcarrying[i][9]) == hallmarkbeingadded) && (petcarrying[i][10] == inscribebeingadded)) {
								var amountavailabletothisslot:Number = maxitemsperslot - parseInt(petcarrying[i][1]);
								if (amountavailabletothisslot > 0) {
									if (amountavailabletothisslot > quantityremainingtobeadded) {
										// add item to this slot:
										petcarrying[i][1] = parseInt(petcarrying[i][1]) + quantityremainingtobeadded;
										quantityremainingtobeadded = 0;
										slotsuccessful = i;
										setsuccessful = "ipet";
										// no more to be added, so exit loop:
										break;
									} else {
										// add what can be added:
										petcarrying[i][1] = parseInt(petcarrying[i][1]) + amountavailabletothisslot;
										quantityremainingtobeadded -= amountavailabletothisslot;
										slotsuccessful = i;
										setsuccessful = "ipet";
									}
								}
							}
						}
					}
				}
			}
			// check if all the items have been added successfully:                                                                                                                    
			if (quantityremainingtobeadded == 0) {
				return quantitytoadd;
			} else {
				// try and find an empty slot to add the remainder to:
				for (var i = 0; i < currentbagsize; i++) {
					if (quantityremainingtobeadded > 0) {
						if (inventory[i][0] == 1) {
							inventory[i][0] = itemtoadd;
							inventory[i][2] = qualitybeingadded;
							inventory[i][3] = durabeingadded;
							inventory[i][4] = effecbeingadded;
							inventory[i][5] = wrappingbeingadded;
							inventory[i][6] = wearbeingadded;
							inventory[i][7] = colourbeingadded;
							inventory[i][8] = enchantbeingadded;
							inventory[i][9] = hallmarkbeingadded;
							inventory[i][10] = inscribebeingadded;
							if (quantityremainingtobeadded <= maxitemsperslot) {
								inventory[i][1] = quantityremainingtobeadded;
								quantityremainingtobeadded = 0;
								slotsuccessful = i;
								setsuccessful = "iinv";
							} else {
								inventory[i][1] = maxitemsperslot;
								quantityremainingtobeadded -= maxitemsperslot;
								slotsuccessful = i;
								setsuccessful = "iinv";
							}
						}
					}
				}
				if (petcarrying.length != 0) {
					if (isinrange(scrollclip.hero.px, scrollclip.hero.py, scrollclip.pet.px, scrollclip.pet.py, (spacing * 1.5))) {
						for (var i = 0; i < petcarrying.length; i++) {
							if (quantityremainingtobeadded > 0) {
								if (petcarrying[i][0] == 1) {
									petcarrying[i][0] = itemtoadd;
									petcarrying[i][2] = qualitybeingadded;
									petcarrying[i][3] = durabeingadded;
									petcarrying[i][4] = effecbeingadded;
									petcarrying[i][5] = wrappingbeingadded;
									petcarrying[i][6] = wearbeingadded;
									petcarrying[i][7] = colourbeingadded;
									petcarrying[i][8] = enchantbeingadded;
									petcarrying[i][9] = hallmarkbeingadded;
									petcarrying[i][10] = inscribebeingadded;
									if (quantityremainingtobeadded <= maxitemsperslot) {
										petcarrying[i][1] = quantityremainingtobeadded;
										quantityremainingtobeadded = 0;
										slotsuccessful = i;
										setsuccessful = "ipet";
									} else {
										petcarrying[i][1] = maxitemsperslot;
										quantityremainingtobeadded -= maxitemsperslot;
										slotsuccessful = i;
										setsuccessful = "ipet";
									}
								}
							}
						}
					}
				}
			}
			if ((quantitytoadd - quantityremainingtobeadded) == 0) {
				// none were added:
				//statusMessage("inventory full");
				return 0;
			} else {
				return (quantitytoadd - quantityremainingtobeadded);
			}
		} else {
			// add new elements to the inventory array:
			for (var i = currentbagsize; i < newbagsize; i++) {
				inventory.push([1, 0]);
			}
			//
			// loop through and display new slots:
			for (var i = currentbagsize; i < newbagsize; i++) {
				gamedisplay.inventorysets.iinv["slot" + i]._visible = true;
				gamedisplay.inventorysets.iinv["slot" + i].contents.gotoAndStop(parseInt(inventory[i][0]));
				if (inventory[i][0] != "1") {
					gamedisplay.inventorysets.iinv["slot" + i].quan.text = parseInt(inventory[i][1]);
				} else {
					gamedisplay.inventorysets.iinv["slot" + i].quan.text = " ";
				}
			}
			//
			gamedisplay.inventorysets.iinv.backgroundblock._y = invtileheight * (mceil(newbagsize / numberofcolumns) - 1);
			gamedisplay.inventorysets.iinv.borderrepeat._height = invtileheight * (mceil(newbagsize / numberofcolumns) - 1);
			//
			// find which element in setsopen is the inventory
			for (var i = 0; i < setsopen.length; i++) {
				if (setsopen[i][0] == "iinv") {
					setsopen[i][1] = newbagsize;
					break;
				}
			}
			// save old bag details:
			oldbag = currentbag[0];
			oldqualitybeingadded = currentbag[2];
			olddurabeingadded = currentbag[3];
			oldeffecbeingadded = currentbag[4];
			oldwrappingbeingadded = currentbag[5];
			oldwearbeingadded = currentbag[6];
			oldcolourbeingadded = currentbag[7];
			oldenchantbeingadded = currentbag[8];
			oldhallmarkbeingadded = currentbag[9];
			oldinscribebeingadded = currentbag[10];
			// make this the current bag:
			currentbagsize = newbagsize;
			currentbag[0] = itemtoadd;
			currentbag[2] = qualitybeingadded;
			currentbag[3] = durabeingadded;
			currentbag[4] = effecbeingadded;
			currentbag[5] = wrappingbeingadded;
			currentbag[6] = wearbeingadded;
			currentbag[7] = colourbeingadded;
			currentbag[8] = enchantbeingadded;
			currentbag[9] = hallmarkbeingadded;
			currentbag[10] = inscribebeingadded;
			// put old bag into the new bag:
			var foundemptyslot:Number = -1;
			for (var i = 0; i < currentbagsize; i++) {
				if (inventory[i][0] == 1) {
					// is an empty slot
					foundemptyslot = i;
					break;
				}
			}
			// add to this slot (will always find an empty slot as the new bag is larger):
			inventory[foundemptyslot][0] = oldbag;
			inventory[foundemptyslot][1] = 1;
			inventory[foundemptyslot][2] = oldqualitybeingadded;
			inventory[foundemptyslot][3] = olddurabeingadded;
			inventory[foundemptyslot][4] = oldeffecbeingadded;
			inventory[foundemptyslot][5] = oldwrappingbeingadded;
			inventory[foundemptyslot][6] = oldwearbeingadded;
			inventory[foundemptyslot][7] = oldcolourbeingadded;
			inventory[foundemptyslot][8] = oldenchantbeingadded;
			inventory[foundemptyslot][9] = oldhallmarkbeingadded;
			inventory[foundemptyslot][10] = oldinscribebeingadded;
			// check for multiple quantities of this bag being added:
			if (quantitytoadd > 1) {
				// add multiples into free slots
				//
				// reduce quantity by 1 as the main bag has been 'added'
				quantityremainingtobeadded--;
				// the player can't already have one of these bags, so just need to find free slots:
				for (var i = 0; i < currentbagsize; i++) {
					if (quantityremainingtobeadded > 0) {
						if (inventory[i][0] == 1) {
							inventory[i][0] = itemtoadd;
							inventory[i][2] = qualitybeingadded;
							inventory[i][3] = durabeingadded;
							inventory[i][4] = effecbeingadded;
							inventory[i][5] = wrappingbeingadded;
							inventory[i][6] = wearbeingadded;
							inventory[i][7] = colourbeingadded;
							inventory[i][8] = enchantbeingadded;
							inventory[i][9] = hallmarkbeingadded;
							inventory[i][10] = inscribebeingadded;
							if (quantityremainingtobeadded <= maxitemsperslot) {
								inventory[i][1] = quantityremainingtobeadded;
								quantityremainingtobeadded = 0;
							} else {
								inventory[i][1] = maxitemsperslot;
								quantityremainingtobeadded -= maxitemsperslot;
							}
						}
					}
				}
				if (petcarrying.length != 0) {
					if (isinrange(scrollclip.hero.px, scrollclip.hero.py, scrollclip.pet.px, scrollclip.pet.py, (spacing * 1.5))) {
						for (var i = 0; i < petcarrying.length; i++) {
							if (quantityremainingtobeadded > 0) {
								if (petcarrying[i][0] == 1) {
									petcarrying[i][0] = itemtoadd;
									petcarrying[i][2] = qualitybeingadded;
									petcarrying[i][3] = durabeingadded;
									petcarrying[i][4] = effecbeingadded;
									petcarrying[i][5] = wrappingbeingadded;
									petcarrying[i][6] = wearbeingadded;
									petcarrying[i][7] = colourbeingadded;
									petcarrying[i][8] = enchantbeingadded;
									petcarrying[i][9] = hallmarkbeingadded;
									petcarrying[i][10] = inscribebeingadded;
									if (quantityremainingtobeadded <= maxitemsperslot) {
										petcarrying[i][1] = quantityremainingtobeadded;
										quantityremainingtobeadded = 0;
									} else {
										petcarrying[i][1] = maxitemsperslot;
										quantityremainingtobeadded -= maxitemsperslot;
									}
								}
							}
						}
					}
				}
				return (quantitytoadd - quantityremainingtobeadded);
			} else {
				return quantitytoadd;
			}
		}
	}






}
function hasgotitem(objectrequired:Number, quantityrequired:Number) {
	// go through array and check for item
	var i;
	var quantityCarrying = 0;
	foundItemInSet = "";
	foundItemInSlot = -1;
	for (i in inventory) {
		if (inventory[i][0] == objectrequired) {
			quantityCarrying += parseInt(inventory[i][1]);
			foundItemInSet = "inventory";
			foundItemInSlot = i;
		}
	}
	if (petcarrying.length != 0) {
		if (isinrange(scrollclip.hero.px, scrollclip.hero.py, scrollclip.pet.px, scrollclip.pet.py, (spacing * 1.5))) {
			for (var i = 0; i < petcarrying.length; i++) {
				if (petcarrying[i][0] == objectrequired) {
					quantityCarrying += parseInt(petcarrying[i][1]);
					foundItemInSet = "petcarrying";
					foundItemInSlot = i;
				}
			}
		}
	}
	if (quantityCarrying >= quantityrequired) {
		return true;
	} else {
		return false;
	}
}
function processxml(thisxml) {
	var thisobject = {map:[], npcs:[], mapitems:[], plans:[], farmtiles:[], mapdoors:[], questHotSpots:[]};
	locationname = thisxml.firstChild.attributes.mname;
	mapbuilding = thisxml.firstChild.attributes.inside;
	maxPossibleHeightForThisMap = thisxml.firstChild.attributes.maxheight;
	var thisxml = thisxml.firstChild.childNodes;
	for (obj in thisxml) {
		node = thisxml[obj];
		switch (node.nodeName) {
			case "row" :
				thisobject.map.unshift(node.firstChild.nodeValue.split(","));
				// unshift adds to end of array - use split(",") to turn a,a,a into ["a","a","a"]
				break;
			case "farm" :
				thisobject.farmtiles.unshift(node.firstChild.nodeValue.split(","));
				break;
			case "questHotSpot" :
				thisobject.questHotSpots.unshift(node.firstChild.nodeValue.split(","));
				break;
			case "npc" :
				thisobject.npcs.unshift(node.firstChild.nodeValue.split(","));
				break;
			case "item" :
				thisobject.mapitems.unshift(node.firstChild.nodeValue.split(","));
				break;
			case "weather" :
				currentweather = parseInt(node.firstChild.nodeValue);
				break;
			case "plans" :
				thisobject.plans = node.firstChild.nodeValue.split(",");
				break;
			case "door" :
				thisobject.mapdoors.unshift(node.firstChild.nodeValue.split(","));
				break;
			default :
				//
		}
	}
	// loop through farm tiles and split:
	for (var i = 0; i < thisobject.farmtiles.length; i++) {
		for (var j = 0; j < thisobject.farmtiles[i].length; j++) {
			thisobject.farmtiles[i][j] = thisobject.farmtiles[i][j].split("|");
		}
	}

	return thisobject;
}
function processTreasureXml(thisxml) {
	var thisobject = {map:[], npcs:[], mapitems:[], plans:[], farmtiles:[], mapdoors:[]};

	var thisxml = thisxml.firstChild.childNodes;
	for (obj in thisxml) {
		node = thisxml[obj];
		switch (node.nodeName) {
			case "row" :
				thisobject.map.unshift(node.firstChild.nodeValue.split(","));
				// unshift adds to end of array - use split(",") to turn a,a,a into ["a","a","a"]
				break;
			case "farm" :
				thisobject.farmtiles.unshift(node.firstChild.nodeValue.split(","));
				break;
			case "npc" :
				thisobject.npcs.unshift(node.firstChild.nodeValue.split(","));
				break;
			case "item" :
				thisobject.mapitems.unshift(node.firstChild.nodeValue.split(","));
				break;
			case "weather" :
				currentweather = parseInt(node.firstChild.nodeValue);
				break;
			case "plans" :
				thisobject.plans = node.firstChild.nodeValue.split(",");
				break;
			case "door" :
				thisobject.mapdoors.unshift(node.firstChild.nodeValue.split(","));
				break;
			default :
				//
		}
	}
	// loop through farm tiles and split:
	for (var i = 0; i < thisobject.farmtiles.length; i++) {
		for (var j = 0; j < thisobject.farmtiles[i].length; j++) {
			thisobject.farmtiles[i][j] = thisobject.farmtiles[i][j].split("|");
		}
	}
	return thisobject;
}
function loadinitialxmlmap(whichxmlmap) {
	// set xml object
	var mapxml = new XML();
	mapxml.ignoreWhite = true;
	mapxml.contentType = "text/xml";
	mapxml.onLoad = function(success) {
		if (success) {
			var mapobject:Object = processxml(mapxml);
			currentLocationName = locationname;
			currentmap = mapobject.map;
			currentplans = mapobject.plans;
			currentnpcs = mapobject.npcs;
			maplengthx = currentmap[0].length;
			maplengthy = currentmap.length;
			displayitems = mapobject.mapitems;
			farmTiles = mapobject.farmtiles;
			thisMapsDoors = mapobject.mapdoors;
			thisMapsQuestHotSpots = mapobject.questHotSpots;

			// set up array to store status of quests
			// arranged by quest number, within that
			// array is placeholder to determine if quest is active or not,
			// and the quest type (0 = just NPC speaking, 1 = receive item from NPC, 2 = exchange item with NPC,
			// and then the item to give to NPC (if exchanging) and the item received from NPC, and the quest number that this new item refers to (for quest chains)
			pathmarkeroffset = 0;
			//this offset will hold how far along the path any path-follow NPCs would have got
			//
			// set low quality to improve speed:
			_quality = "Low";
			// attach empty container clip:
			attachempty();
			// check if there is a user generated content vendor on this map - preload all user content icons if so:
			var storedUserContentToLoadLength = userContentToLoad.length;
			var userGeneratedVendorFound = false;
			for (var i = 0; i < scrollclip.shopcontents.length; i++) {
				if (scrollclip.shopcontents[i][0] == "userGeneratedVendor") {
					userGeneratedVendorFound = true;
					break;
				}
			}
			if (userGeneratedVendorFound) {
				for (var i = 0; i < thisPlayersContent.length; i++) {
					userContentToLoad.push(thisPlayersContent[i][1]);
				}
			}
			// start preloading the user content: (if new items have been added and the list was empty before - if the list wasn't empty, don't want to interrupt whichever one is loading currently)                                                                                                                                                                                                                                                                                                                                                         
			if ((userContentToLoad.length > 0) && (storedUserContentToLoadLength == 0)) {
				gamedisplay.preloadUserContent.gotoAndPlay("startLoad");
			}
			// place the hero                                                                                                                                                                                     
			placehero(herox,heroy);
			// display familiar if the hero has one:
			if (FamiliarSkillLevel > 0) {
				scrollclip.hero.familiar._visible = true;
			} else {
				scrollclip.hero.familiar._visible = false;
			}
			// display money correctly from loaded data
			updatemoney();
			// set this to false here, so that if there is no pet then the pet movement function won't be called:
			petismoving = false;
			// attach pet if the hero has one currently:
			if (haspet) {
				var petxtile:Number = parseInt(currentpet[3]);
				var petytile:Number = parseInt(currentpet[4]);
				var petdepth:Number = calculateobjectdepth(((spacing * (petxtile + petytile)) + spacing), (spacing / 2 * (petxtile - petytile)));
				scrollclip.attachMovie("npc" + currentpet[2],"pet",petdepth);
				scrollclip.pet.speed = parseInt(currentpet[0]);
				// init pet object non-iso position:
				scrollclip.pet.px = ((petxtile + 0.5) * spacing);
				scrollclip.pet.py = ((petytile + 0.5) * spacing);
				scrollclip.pet._x = (scrollclip.pet.px) + (scrollclip.pet.py);
				scrollclip.pet._y = ((scrollclip.pet.px) - (scrollclip.pet.py)) / 2;
				scrollclip.pet.awidth = (scrollclip.pet._width) / 2;
				scrollclip.pet.aheight = (scrollclip.pet._width) / 2;
				scrollclip.pet.xtile = petxtile;
				scrollclip.pet.ytile = petytile;
				scrollclip.pet.xdir = parseInt(currentpet[5]);
				scrollclip.pet.ydir = parseInt(currentpet[6]);
				scrollclip.pet.gotoAndStop((scrollclip.pet.xdir) + (scrollclip.pet.ydir) * 2 + 3);
				scrollclip.pet.petclip.stop();
				petstate = 1;
				petismovingawayfromhero = false;
			}
			// check if there is a lottery vendor on this map:                                                                                                                                                                                                                                                                                                                                            
			var allDialogue = scrollclip.dialogue.join(",");
			if (allDialogue.indexOf("*") != -1) {
				getPrizeFundAmount();
				checkingLotteryAmount = setInterval(getPrizeFundAmount, 60000);
			}
			// get this map's hotspots:                                                                                                                         
			thisMapsHotspots = hotspots[whichxmlmap];
			// then build map according to what's visible
			buildmap();
			if (currentweather == 6) {
				// show snowy footprints:
				scrollclip.tileOverlay._visible = true;
			} else {
				scrollclip.tileOverlay._visible = false;
			}
			if (allMapsOwned.length > 0) {
				// there are maps that need to be created - start with first:
				var newMap = allMapsOwned.shift();
				initNewTreasureMap(newMap[0],newMap[1],newMap[2]);
			} else {
				checkMapPopups();
			}
			checkForDoorsToDungeons();
			loadCartographyMap();
			checkForNewCatalogues();
			checkQuestHotSpots();
		} else {
			errorloading("initial xml load failed");
		}
	};
	if (whichxmlmap < 0) {
		// load random dungeon map - map has already been generated, so just load it directly
		mapxml.load("http://www.autumnearth.com/data/chr" + charnumber + "/dungeon/" + cleanDungeonURL + "/" + whichxmlmap + ".xml?uniq=" + new Date().getTime());
	} else {
		mapxml.load("http://www.autumnearth.com/data/chr" + charnumber + "/map" + whichxmlmap + ".xml?uniq=" + new Date().getTime());
	}
}
//
function loadxmlmap(whichxmlmap) {
	// set xml object
	var mapxml = new XML();
	mapxml.ignoreWhite = true;
	mapxml.contentType = "text/xml";
	mapxml.onLoad = function(success) {
		if (success) {
			var mapobject:Object = processxml(mapxml);
			currentmap = mapobject.map;
			currentnpcs = mapobject.npcs;
			currentplans = mapobject.plans;
			maplengthx = currentmap[0].length;
			maplengthy = currentmap.length;
			displayitems = mapobject.mapitems;
			farmTiles = mapobject.farmtiles;
			thisMapsDoors = mapobject.mapdoors;
			// get this map's hotspots:
			thisMapsHotspots = hotspots[whichxmlmap];
			thisMapsQuestHotSpots = mapobject.questHotSpots;

			newmapinit();
			checkForDoorsToDungeons();
			loadCartographyMap();
			checkQuestHotSpots();
			checkForNewCatalogues();
		} else {
			errorloading(whichxmlmap + " xml map failed to load");
		}
	};
	if (whichxmlmap < 0) {
		// load random dungeon map:
		var connectingDoorString = "";
		if (DungeonExitDoorX != -1) {
			// pass door details through:
			connectingDoorString = "&connectingDoorX=" + DungeonExitDoorX + "&connectingDoorY=" + DungeonExitDoorY;
		}
		mapxml.load("http://www.autumnearth.com/generateDungeonMap.php?playerId=" + charnumber + "&originatingMapId=" + oldmap + connectingDoorString + "&requestedMap=" + whichxmlmap + "&dungeonName=" + cleanDungeonURL);
	} else {
		mapxml.load("http://www.autumnearth.com/data/chr" + charnumber + "/map" + whichxmlmap + ".xml?uniq=" + new Date().getTime());
	}
}
//
function loadTreasureXmlMap(whichxmlmap, targetXTile, targetYTile) {
	var mapxml = new XML();
	mapxml.ignoreWhite = true;
	mapxml.contentType = "text/xml";
	mapxml.onLoad = function(success) {
		if (success) {
			var mapobject:Object = processTreasureXml(mapxml);
			treasuremap = mapobject.map;
			treasureMaplengthx = treasuremap[0].length;
			treasureMaplengthy = treasuremap.length;
			processTreasureMap(targetXTile,targetYTile);
		} else {
			errorloading(whichxmlmap + " xml map failed to load");
		}
	};
	// check to see if it's a random dungeon map:
	if (whichxmlmap.indexOf("R") != -1) {
		var randomTreasureMapDetails = whichxmlmap.split("R");
		var randomDungeonName = randomDungeons[(randomTreasureMapDetails[0])][0];
		var cleanDungeonURL = randomDungeonName.split(" ").join("-").toLowerCase();
		var dungeonMapRequired = randomTreasureMapDetails[1];
		mapxml.load("http://www.autumnearth.com/generateDungeonMap.php?playerId=" + charnumber + "&originatingMapId=" + (dungeonMapRequired - 1) + "&requestedMap=" + dungeonMapRequired + "&dungeonName=" + cleanDungeonURL + "&isTreasureMap=true&treasureLocX=" + targetXTile + "&treasureLocY=" + targetYTile);
	} else {
		mapxml.load("http://www.autumnearth.com/data/chr" + charnumber + "/map" + whichxmlmap + ".xml?uniq=" + new Date().getTime());
	}
}
//
function serverTimedOut(whereTimedOut) {
	// function called by setinteerval to see if the server hasn't responded:
	clearInterval(checkServerResponse);
	errorloading("server response timed out at " + whereTimedOut);
}
//
function clearFamiliarRefs() {
	// function called by setinterval to clear familiar's references to last visited item
	clearInterval(familiarLastItemTimer);
	familiarsLastItem = -1;
}
function clearFamiliarHotSpots() {
	// function called by setinterval to clear familiar's references to last visited hotspot
	clearInterval(familiarLastSpotTimer);
	familiarsLastHotspot = -1;
}
//
function errorloading(errormessage:String) {
	trace(errormessage);
	gamedisplay.statusMessages.activeLog.logText.htmlText += "<p>ERROR: " + errormessage + "</p>";
	// error handling
}
function savegame() {
	// #####################
	if (isOnBoat) {
		// determine the boat's destination and save the game at that location
	}
	pauseGame();
	oktoloop = false;
	gamedisplay.saving.gotoAndStop(1);
	gamedisplay.saving._visible = true;
	//
	var saveobject = new LoadVars();
	var checksavedok = new LoadVars();
	var savechanges = new LoadVars();
	var checkchangessavedok = new LoadVars();
	//
	// check for moving npcs and save their latest progress:
	for (g in currentnpcs) {
		switch (currentnpcs[g][1]) {
			case "1" :
				// is a random mover, so save current tile and direction:
				currentnpcs[g][3] = scrollclip["n_" + g].xtile;
				currentnpcs[g][4] = scrollclip["n_" + g].ytile;
				currentnpcs[g][5] = scrollclip["n_" + g].xdir;
				currentnpcs[g][6] = scrollclip["n_" + g].ydir;
				//save changes to changes array:
				addtochanges([currentmapnumber, 1, g, (currentnpcs[g].join(","))]);
				break;
			case "2" :
				// is path follower, so save value
				currentnpcs[g][8] = scrollclip["n_" + g].pathmarker;
				//save changes to changes array:
				addtochanges([currentmapnumber, 1, g, (currentnpcs[g].join(","))]);
				break;
			case "3" :
				if (currentnpcs[g][7] != "0") {
					// also check for pathfinder which has found a path and is moving
					// stop npc being pathfinder and move to end location
					currentnpcs[g][1] = 0;
					currentnpcs[g][3] = currentnpcs[g][8];
					currentnpcs[g][4] = currentnpcs[g][9];
					//save changes to changes array:
					addtochanges([currentmapnumber, 1, g, (currentnpcs[g].join(","))]);
				}
				break;
			default :
				// do nothing
		}
	}
	//
	checkchangessavedok.onLoad = function(success) {
		if (success) {
			// check variable returned from php to see if the file was saved successfully or not
			if (this.changeswassuccess != "true") {
				errorloading("changes failed to save - " + this.changeswassuccess);
				// error handling
			} else {
				//empty changes array now that all of the information has been overwritten in the xml:
				changes = [];
				//
				gamedisplay.saving._visible = false;
				unpauseGame();
				oktoloop = true;
			}
		}
	};
	checksavedok.onLoad = function(success) {
		if (success) {
			// check variable returned from php to see if the file was saved successfully or not
			if (this.basewassuccess != "true") {
				errorloading("base failed to save");
				// error handling
			} else {
				gamedisplay.saving.gotoAndStop(2);
				//
				//create string from changes array
				var changes2:Array = new Array();
				for (var i in changes) {
					changes2[i] = changes[i].join("*");
				}
				var changesstring:String = changes2.join("_");
				savechanges.changes = changesstring;
				//
				savechanges.username = username;
				//
				savechanges.sendAndLoad("http://www.autumnearth.com/changes.php",checkchangessavedok);
			}
		}
	};
	saveobject.playsounds = playsounds;
	saveobject.herox = herox;
	saveobject.heroy = heroy;
	saveobject.money = money;
	// need to save time in random dungeons - randomDungeons[1] values ##############
	saveobject.minutesplayed = minutesplayed;
	saveobject.dowseskill = DowsingSkillLevel;
	saveobject.famskill = FamiliarSkillLevel;
	saveobject.currentmapnumber = currentmapnumber;
	saveobject.heightgained = heightgained;
	saveobject.username = username;
	saveobject.currentbag = currentbag.join(",");
	saveobject.chrid = charnumber;
	if (haspet) {
		// put the pet's current state into its array before saving:
		currentpet[3] = scrollclip.pet.xtile;
		currentpet[4] = scrollclip.pet.ytile;
		currentpet[5] = scrollclip.pet.xdir;
		currentpet[6] = scrollclip.pet.ydir;
		saveobject.petsave = currentpet.join(",");
	} else {
		saveobject.petsave = "-";
	}
	//
	var journalstring:String = journal.join("/");
	saveobject.journalsave = journalstring;
	// create string from inventory array:
	var inventorysplit:Array = new Array();
	for (var i in inventory) {
		inventorysplit[i] = inventory[i].join(",");
	}
	var inventorystring:String = inventorysplit.join("/");
	saveobject.inventorysave = inventorystring;
	//
	// create string for quest status:
	var queststring:String = "";
	for (var i = 0; i < quests.length; i++) {
		queststring += quests[i][0] + "/";
	}
	//remove final '/':
	queststring = queststring.substr(0, queststring.length - 1);
	saveobject.questsstatus = queststring;
	saveobject.sendAndLoad("http://www.autumnearth.com/base.php",checksavedok);
}
function addtochanges(elementtoadd) {
	// type 1 = npc change
	// type 2 = tile change
	// type 3 = item change
	// type 4 = weather change 
	//npc - mapnumber, 1, npc's index, whole npc data, npc data (only if whole npc data == "add") - (if whole npc data == -1 then remove from array) 
	//tile - mapnumber, 2, tilex, tiley, newvalue
	//item - mapnumber, 3, item's index, new value, item data (only if new value == "add") - (if newvalue == -1 then remove from array)
	//weather - mapnumber, 4, newvalue
	//
	if (changes.length == 0) {
		// no other changes currently
		changes = [elementtoadd];
	} else {
		for (j in changes) {
			if (parseInt(changes[j]) <= currentmapnumber) {
				break;
			}
		}
		j++;
		// add 1 to j so that element is inserted after the index
		changes.splice(j,0,elementtoadd);
		//need 0 as no deletion occurring
		//
	}
}
function unpauseGame() {
	gamepaused = 0;
	var x:Number = herox - visx - 2;
	var y:Number;
	// run through all NPCs and start their animations
	var g:Number;
	for (g in currentnpcs) {
		if ((currentnpcs[g][1] != 0) && (scrollclip["n_" + g].hasStopped == 0)) {
			// check it's not a static NPC, and it's stopped while talking
			scrollclip["n_" + g].npcclip.play();
		}
	}
	// resume locked door animation (if there is one)
	scrollclip["t_" + openingdoorx + "_" + openingdoory].a.play();
	//
	//resume tile animations if any
	while (++x <= (herox + visx + 1)) {
		y = heroy - visy - 2;
		while (++y <= (heroy + visy + 1)) {
			scrollclip["t_" + x + "_" + y].a.play();
		}
	}
}
function pauseGame() {
	gamepaused = 1;
	var x:Number = herox - visx - 2;
	var y:Number;
	// run thorugh all NPCs and stop their animations
	var g:Number;
	for (g in currentnpcs) {
		scrollclip["n_" + g].npcclip.stop();
	}
	// pause locked door animation (if there is one)
	scrollclip["t_" + openingdoorx + "_" + openingdoory].a.stop();
	// pause all tile animations if any:
	while (++x <= (herox + visx + 1)) {
		y = heroy - visy - 2;
		while (++y <= (heroy + visy + 1)) {
			scrollclip["t_" + x + "_" + y].a.stop();
		}
	}
}
function hasLOS(startx, starty, endx, endy) {
	//path initialization:
	//
	var nextx:Number = startx;
	var nexty:Number = starty;
	//
	pathy = [];
	pathx = [];
	var deltay:Number = endy - starty;
	var deltax:Number = endx - startx;
	var currentStep:Number = 0;
	var fraction:Number;
	var previousx:Number;
	var previousy:Number;
	//
	// path direction calculation:
	if (deltay < 0) {
		stepy = -1;
	} else {
		stepy = 1;
	}
	if (deltax < 0) {
		stepx = -1;
	} else {
		stepx = 1;
	}
	deltay = mabs(deltay * 2);
	deltax = mabs(deltax * 2);
	previousx = startx;
	previousy = starty;
	// bresenham algorithm:
	if (deltax > deltay) {
		fraction = deltay * 2 - deltax;
		while (nextx != endx) {
			if (fraction >= 0) {
				nexty += stepy;
				fraction -= deltax;
			}
			nextx += stepx;
			fraction += deltay;
			// check tile is walkable:
			if (!(islocationproperty(1, nextx, nexty))) {
				// tile is non-walkable;
				return false;
				break;
			}
			// add relative movement to the array:                                                                                                                  
			pathy[currentStep] = nexty - previousy;
			pathx[currentStep] = nextx - previousx;
			previousy = nexty;
			previousx = nextx;
			currentStep++;
		}
	} else {
		fraction = deltax * 2 - deltay;
		while (nexty != endy) {
			if (fraction >= 0) {
				nextx += stepx;
				fraction -= deltay;
			}
			nexty += stepy;
			fraction += deltax;
			// check tile is walkable:
			if (!(islocationproperty(1, nextx, nexty))) {
				// tile is non-walkable;
				return false;
				break;
			}
			// add relative movement to the array:                                                                                                                  
			pathy[currentStep] = nexty - previousy;
			pathx[currentStep] = nextx - previousx;
			previousy = nexty;
			previousx = nextx;
			currentStep++;
		}
	}
	//
	return true;
}
function movefamiliar() {
	var familiardepth:Number;
	// set default horizontal speed:
	var familiarspeed:Number = 12;
	// check for diagonal movement, and reduce speed accordingly:
	if ((mabs(scrollclip.familiar.xdir) + mabs(scrollclip.familiar.ydir)) == 2) {
		familiarspeed = 6;
	}
	scrollclip.familiar.px += familiarspeed * scrollclip.familiar.xdir;
	scrollclip.familiar.py += familiarspeed * scrollclip.familiar.ydir;
	// convert to iso position:
	scrollclip.familiar._x = (scrollclip.familiar.px) + (scrollclip.familiar.py);
	scrollclip.familiar._y = ((scrollclip.familiar.px) - (scrollclip.familiar.py)) / 2;
	// offset the depth sorting by adding 1 after the calculation has been done, this
	// gives the correct result, rather than offsetting the x coordinate
	familiardepth = (calculateobjectdepth((scrollclip.familiar._x), scrollclip.familiar._y)) + 1;
	scrollclip.familiar.swapDepths(familiardepth);
	scrollclip.familiar.distx += mabs(familiarspeed * scrollclip.familiar.xdir);
	scrollclip.familiar.disty += mabs(familiarspeed * scrollclip.familiar.ydir);
	familiarOnNewTile = false;
	if (scrollclip.familiar.distx >= spacing) {
		scrollclip.familiar.distx -= spacing;
		familiarOnNewTile = true;
	}
	if (scrollclip.familiar.disty >= spacing) {
		scrollclip.familiar.disty -= spacing;
		familiarOnNewTile = true;
	}
	if (familiarOnNewTile) {
		if (scrollclip.familiar.nextposition != scrollclip.familiar.lastposition) {
			var crumbtrailfound:Boolean = false;
			// check for breadcrumb - only if moving towards hero:
			if (familiarstate == 3) {
				scrollclip.familiar.xdir = 0;
				scrollclip.familiar.ydir = 0;
				var familiarcurrenttilex:Number = findtilenumber(scrollclip.familiar.px, scrollclip.familiar.py, "x");
				var familiarcurrenttiley:Number = findtilenumber(scrollclip.familiar.px, scrollclip.familiar.py, "y");
				for (var i = 0; i < breadcrumblength; i++) {
					if ((familiarcurrenttiley) == breadcrumby[i]) {
						if ((familiarcurrenttilex - 1) == breadcrumbx[i]) {
							scrollclip.familiar.xdir = -1;
							scrollclip.familiar.ydir = 0;
							crumbtrailfound = true;
							break;
						} else if ((familiarcurrenttilex + 1) == breadcrumbx[i]) {
							scrollclip.familiar.xdir = 1;
							scrollclip.familiar.ydir = 0;
							crumbtrailfound = true;
							break;
						}
					} else if ((familiarcurrenttilex) == breadcrumbx[i]) {
						if ((familiarcurrenttiley + 1) == breadcrumby[i]) {
							scrollclip.familiar.xdir = 0;
							scrollclip.familiar.ydir = 1;
							crumbtrailfound = true;
							break;
						} else if ((familiarcurrenttiley - 1) == breadcrumby[i]) {
							scrollclip.familiar.xdir = 0;
							scrollclip.familiar.ydir = -1;
							crumbtrailfound = true;
							break;
						}
					}
				}
			}
			if (!(crumbtrailfound)) {
				// no breadcrumb found, find new facing from LoS path;
				scrollclip.familiar.xdir = pathx[scrollclip.familiar.nextposition];
				scrollclip.familiar.ydir = pathy[scrollclip.familiar.nextposition];
				scrollclip.familiar.nextposition++;
			}
			if (familiarstate != 1) {
				if (isinrange(scrollclip.familiar.px, scrollclip.familiar.py, scrollclip.hero.px, scrollclip.hero.py, 12)) {
					// found the hero, and isn't moving away to an item - adjust the '12' to suit
					familiarfoundindex = -1;
					familiarstate = 0;
					scrollclip.hero.familiar._visible = true;
					removeMovieClip(scrollclip.familiar);
				}
			}
		} else {
			if (familiarstate == 1) {
				if (familiarfoundindex != -1) {
					// familiar was moving towards item, and has found it now
					scrollclip.familiar.xdir = 0;
					scrollclip.familiar.ydir = 0;
					// set familiar to exactly above item
					var familiarfounditem:Object = scrollclip["i_" + parseInt(displayitems[familiarfoundindex][0]) + "_" + parseInt(displayitems[familiarfoundindex][1])];
					scrollclip.familiar.px = familiarfounditem.px;
					scrollclip.familiar.py = familiarfounditem.py;
					scrollclip.familiar._x = (scrollclip.familiar.px) + (scrollclip.familiar.py);
					scrollclip.familiar._y = ((scrollclip.familiar.px) - (scrollclip.familiar.py)) / 2;
					// depth sort familiar to item depth +1:
					scrollclip.familiar.swapDepths((familiarfounditem.getDepth() + 1));
					familiarstate = 2;
					familiarsLastItem = familiarfoundindex;
				} else if (familiarfoundHotspot != -1) {
					// familiar has reached the hotspot
					scrollclip.familiar.xdir = 0;
					scrollclip.familiar.ydir = 0;
					familiarstate = 2;
					familiarsLastHotspot = familiarfoundHotspot;
				}
			} else {
				// looking for hero, but got to the end of the LOS path and breadcrumb trail has faded
				familiarstate = 4;
			}
		}
	}
}
function inventorysetup() {
	setsopen = new Array();
	waitingforinventory = false;
	splitQuantityAllMoved = false;
	numberofcolumns = 3;
	numberofbankcolumns = 6;
	maximumnumberofslots = 15;
	invtilewidth = 64;
	invtileheight = 64;
	maxitemsperslot = 10;
	borderwidth = 30;
	numberOfInventorySets = 10;
	gamedisplay.inventorysets._x = -35;
	gamedisplay.inventorysets._y = -100;
	// put the booster pack animation in the same position:
	gamedisplay.boosterAnime._x = -35;
	gamedisplay.boosterAnime._y = -100;
	drawinventorysets();
	currentToolTipSet = -1;
	currentToolTipSlot = -1;
}
//
function drawinventorysets() {
	gamedisplay.inventorysets._visible = false;
	// draw current bag display:
	var currentx:Number = 0;
	var currenty:Number = 0;
	for (var i = 0; i < maximumnumberofslots; i++) {
		gamedisplay.inventorysets.iinv.attachMovie("inventoryslot","slot" + i,i);
		thisslot = gamedisplay.inventorysets.iinv["slot" + i];
		thisslot._x = currentx;
		thisslot._y = currenty;
		currentx += invtilewidth;
		if (currentx >= (invtilewidth * numberofcolumns)) {
			currentx = 0;
			currenty += invtileheight;
		}
		if (i < currentbagsize) {
			// show this slot:
			thisslot._visible = true;
		} else {
			thisslot._visible = false;
		}
	}
	gamedisplay.inventorysets.iinv.backgroundblock._y = invtileheight * (mceil(currentbagsize / numberofcolumns) - 1);
	gamedisplay.inventorysets.iinv.borderrepeat._y = 0;
	gamedisplay.inventorysets.iinv.borderrepeat._height = invtileheight * (mceil(currentbagsize / numberofcolumns) - 1);
	//
	currentx = 0;
	currenty = 0;
	// draw pet display:
	currentx = 0;
	currenty = 0;
	for (var i = 0; i < maximumnumberofslots; i++) {
		gamedisplay.inventorysets.ipet.attachMovie("inventoryslot","slot" + i,i);
		thisslot = gamedisplay.inventorysets.ipet["slot" + i];
		thisslot._x = currentx;
		thisslot._y = currenty;
		currentx += invtilewidth;
		if (currentx >= (invtilewidth * numberofcolumns)) {
			currentx = 0;
			currenty += invtileheight;
		}
		if (i < petcarrying.length) {
			// show this slot:
			thisslot._visible = true;
		} else {
			thisslot._visible = false;
		}
	}
	gamedisplay.inventorysets.ipet.backgroundblock._y = invtileheight * (mceil(petcarrying.length / numberofcolumns) - 1);
	gamedisplay.inventorysets.ipet.borderrepeat._y = 0;
	gamedisplay.inventorysets.ipet.borderrepeat._height = invtileheight * (mceil(petcarrying.length / numberofcolumns) - 1);
	//
	// draw bank display:
	currentx = 0;
	currenty = 0;
	for (var i = 0; i < maximumnumberofslots; i++) {
		gamedisplay.inventorysets.ibank.attachMovie("inventoryslot","slot" + i,i);
		thisslot = gamedisplay.inventorysets.ibank["slot" + i];
		thisslot._x = currentx;
		thisslot._y = currenty;
		//gamedisplay.inventorysets.ibank["slot"+i].contents.gotoAndStop(parseInt(bankarray[i][0]));
		currentx += invtilewidth;
		if (currentx >= (invtilewidth * numberofbankcolumns)) {
			currentx = 0;
			currenty += invtileheight;
		}
		if (i < bankslots) {
			// show this slot:
			thisslot._visible = true;
		} else {
			thisslot._visible = false;
		}
	}
	gamedisplay.inventorysets.ibank.backgroundblock._y = invtileheight * (mceil(bankslots / numberofbankcolumns) - 1);
	gamedisplay.inventorysets.ibank.borderrepeat._y = 0;
	gamedisplay.inventorysets.ibank.borderrepeat._height = invtileheight * (mceil(bankslots / numberofbankcolumns) - 1);
	//
	// draw chest display:
	currentx = 0;
	currenty = 0;
	for (var i = 0; i < maximumnumberofslots; i++) {
		gamedisplay.inventorysets.ichest.attachMovie("inventoryslot","slot" + i,i);
		thisslot = gamedisplay.inventorysets.ichest["slot" + i];
		thisslot._x = currentx;
		thisslot._y = currenty;
		currentx += invtilewidth;
		if (currentx >= (invtilewidth * numberofcolumns)) {
			currentx = 0;
			currenty += invtileheight;
		}
		// chest contents will vary so no need to show or hide any yet - or set the bottom border                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
	}
	gamedisplay.inventorysets.ichest.borderrepeat._y = 0;
	//
	// draw shop display:
	currentx = 0;
	currenty = 0;
	for (var i = 0; i < maximumnumberofslots; i++) {
		gamedisplay.inventorysets.ishop.attachMovie("inventoryslot","slot" + i,i);
		thisslot = gamedisplay.inventorysets.ishop["slot" + i];
		thisslot._x = currentx;
		thisslot._y = currenty;
		currentx += invtilewidth;
		if (currentx >= (invtilewidth * numberofcolumns)) {
			currentx = 0;
			currenty += invtileheight;
		}
		// shop contents will vary so no need to show or hide any yet - or set the bottom border                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
	}
	gamedisplay.inventorysets.ishop.borderrepeat._y = 0;
	//
	// draw workshop display:
	currentx = 0;
	currenty = 0;
	for (var i = 0; i < maximumnumberofslots; i++) {
		gamedisplay.inventorysets.iworkshop.attachMovie("inventoryslot","slot" + i,i);
		thisslot = gamedisplay.inventorysets.iworkshop["slot" + i];
		thisslot._x = currentx;
		thisslot._y = currenty;
		currentx += invtilewidth;
		if (currentx >= (invtilewidth * numberofcolumns)) {
			currentx = 0;
			currenty += invtileheight;
		}
		// shop contents will vary so no need to show or hide any yet - or set the bottom border                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
	}
	gamedisplay.inventorysets.iworkshop.borderrepeat._y = 0;
	//
	// hide clips until needed, and set them to initial depths:
	gamedisplay.inventorysets.iinv._visible = false;
	gamedisplay.inventorysets.iinv.swapDepths(1);
	gamedisplay.inventorysets.iequip._visible = false;
	gamedisplay.inventorysets.iequip.swapDepths(2);
	gamedisplay.inventorysets.ipet._visible = false;
	gamedisplay.inventorysets.ipet.swapDepths(3);
	gamedisplay.inventorysets.ibank._visible = false;
	gamedisplay.inventorysets.ibank.swapDepths(4);
	gamedisplay.inventorysets.ichest._visible = false;
	gamedisplay.inventorysets.ichest.swapDepths(5);
	gamedisplay.inventorysets.ishop._visible = false;
	gamedisplay.inventorysets.ishop.swapDepths(6);
	gamedisplay.inventorysets.iworkshop._visible = false;
	gamedisplay.inventorysets.iworkshop.swapDepths(7);
	gamedisplay.inventorysets.icrafting._visible = false;
	gamedisplay.inventorysets.icrafting.swapDepths(8);
	gamedisplay.inventorysets.craftingPanel._visible = false;
	gamedisplay.inventorysets.craftingPanel.swapDepths(9);
	gamedisplay.inventorysets.ipost._visible = false;
	gamedisplay.inventorysets.ipost.swapDepths(10);
	// place glow and targetting cursor above all sets
	gamedisplay.inventorysets.slotGlow.swapDepths(1048574);
	gamedisplay.targettingInvCursor.swapDepths(1048575);
	gamedisplay.targettingInvCursor._visible = false;
}
function placeinventorysets() {
	startposx = 0;
	for (var i = 0; i < setsopen.length; i++) {
		gamedisplay.inventorysets[setsopen[i][0]]._visible = true;
		gamedisplay.inventorysets[setsopen[i][0]]._x = startposx;
		if (setsopen[i][0] == "ibank") {
			startposx += (invtilewidth * setsopen[i][2]) + borderwidth;
		} else {
			startposx += (invtilewidth * numberofcolumns) + borderwidth;
		}
		gamedisplay.inventorysets[setsopen[i][0]]._y = 0;
	}
}
//
function resetinventory() {
	quantitysplit = false;
	waitingfornumericinput = false;
	shopisopen = false;
	gamedisplay.inputbox._visible = false;
}
//
function movepet() {
	var ymove:Number = scrollclip.pet.speed * scrollclip.pet.ydir;
	var xmove:Number = scrollclip.pet.speed * scrollclip.pet.xdir;
	// work out tile that these xmove, ymove will move the pet to
	// check all 4 corners...
	var petleftcoord:Number = (xmove + scrollclip.pet.px) - (scrollclip.pet.awidth / 2);
	var petrightcoord:Number = (xmove + scrollclip.pet.px) + (scrollclip.pet.awidth / 2);
	var pettopcoord:Number = (ymove + scrollclip.pet.py) + (scrollclip.pet.aheight / 2);
	var petbottomcoord:Number = (ymove + scrollclip.pet.py) - (scrollclip.pet.aheight / 2);
	//
	var petbottomleftx:Number = findtilenumber(petleftcoord, petbottomcoord, "x");
	var petbottomlefty:Number = findtilenumber(petleftcoord, petbottomcoord, "y");
	var pettopleftx:Number = findtilenumber(petleftcoord, pettopcoord, "x");
	var pettoplefty:Number = findtilenumber(petleftcoord, pettopcoord, "y");
	var petbottomrightx:Number = findtilenumber(petrightcoord, petbottomcoord, "x");
	var petbottomrighty:Number = findtilenumber(petrightcoord, petbottomcoord, "y");
	var pettoprightx:Number = findtilenumber(petrightcoord, pettopcoord, "x");
	var pettoprighty:Number = findtilenumber(petrightcoord, pettopcoord, "y");
	// 
	// see if the pet can move to target tile
	var moveok:Boolean = false;
	if (scrollclip.pet.ydir == 1) {
		if (islocationproperty(2, pettopleftx, pettoplefty)) {
			if (islocationproperty(2, pettoprightx, pettoprighty)) {
				moveok = true;
			}
		}
	} else if (scrollclip.pet.ydir == -1) {
		if (islocationproperty(2, petbottomleftx, petbottomlefty)) {
			if (islocationproperty(2, petbottomrightx, petbottomrighty)) {
				moveok = true;
			}
		}
	}
	if (scrollclip.pet.xdir == -1) {
		if (islocationproperty(2, pettopleftx, pettoplefty)) {
			if (islocationproperty(2, petbottomleftx, petbottomlefty)) {
				moveok = true;
			}
		}
	} else if (scrollclip.pet.xdir == 1) {
		if (islocationproperty(2, petbottomrightx, petbottomrighty)) {
			if (islocationproperty(2, pettoprightx, pettoprighty)) {
				moveok = true;
			}
		}
	}
	//                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
	var tempx:Number = scrollclip.pet.px + xmove;
	var tempy:Number = scrollclip.pet.py + ymove;
	//
	// check against items (make sure it's not a resource placeholder)
	for (q in displayitems) {
		if ((inventoryitems[parseInt(displayitems[q][2])][6] != "ph") && (!((inventoryitems[parseInt(displayitems[q][2])][2].indexOf("k") != -1) && (determinePlantGrowthStage(displayitems[q][6]) == 0)))) {
			itemxtile = parseInt(displayitems[q][0]);
			itemytile = parseInt(displayitems[q][1]);
			thisitem = scrollclip["i_" + itemxtile + "_" + itemytile];
			if (hascollided(thisitem.px, thisitem.py, thisitem.w, thisitem.w, tempx, tempy, scrollclip.pet.awidth, scrollclip.pet.aheight)) {
				moveok = false;
			}
		}
	}
	if (!(moveok)) {
		// has hit terrain or item, so turn around:
		scrollclip.pet.xdir *= -1;
		scrollclip.pet.ydir *= -1;
	} else {
		for (h in currentnpcs) {
			var thischecknpc:Object = scrollclip["n_" + h];
			if (hascollided(thischecknpc.px, thischecknpc.py, thischecknpc.awidth, thischecknpc.aheight, tempx, tempy, scrollclip.pet.awidth, scrollclip.pet.aheight)) {
				if (parseInt(currentnpcs[h][1]) == 2) {
					// is a path follower - check directions that they're both facing:
					if ((scrollclip.pet.xdir == 0 - thischecknpc.xdir) && (scrollclip.pet.ydir == 0 - thischecknpc.ydir)) {
						// they are facing opposite each other - pet needs to do path-finding
						petstate = 2;
						// return to last tile, as long as it's clear:
						// (if the pet was stationary and the NPC collided with it, then the pet may try and walk into a blocked tile)
						petproposedmovex = scrollclip.pet.xdir * -1;
						petproposedmovey = scrollclip.pet.ydir * -1;
						petproposedtilex = scrollclip.pet.xtile + petproposedmovex;
						petproposedtiley = scrollclip.pet.ytile + petproposedmovey;
						if ((islocationproperty(4, petproposedtilex, petproposedtiley)) && (!(scrollclip["i_" + petproposedtilex + "_" + petproposedtiley]))) {
							// is ok
							scrollclip.pet.xdir = petproposedmovex;
							scrollclip.pet.ydir = petproposedmovey;
							moveok = false;
						} else {
							// check to the side of that facing:
							if (petproposedmovex != 0) {
								petproposedmovex = 0;
								petproposedmovey = 1;
								petproposedtilex = scrollclip.pet.xtile + petproposedmovex;
								petproposedtiley = scrollclip.pet.ytile + petproposedmovey;
								if ((islocationproperty(4, petproposedtilex, petproposedtiley)) && (!(scrollclip["i_" + petproposedtilex + "_" + petproposedtiley]))) {
									// is ok
									scrollclip.pet.xdir = petproposedmovex;
									scrollclip.pet.ydir = petproposedmovey;
									moveok = false;
								} else {
									// check the other side:
									petproposedmovey = -1;
									petproposedtilex = scrollclip.pet.xtile + petproposedmovex;
									petproposedtiley = scrollclip.pet.ytile + petproposedmovey;
									if ((islocationproperty(4, petproposedtilex, petproposedtiley)) && (!(scrollclip["i_" + petproposedtilex + "_" + petproposedtiley]))) {
										// is ok
										scrollclip.pet.xdir = petproposedmovex;
										scrollclip.pet.ydir = petproposedmovey;
										moveok = false;
									} else {
										// do pathfinding:
										petstate = 3;
										findPath(scrollclip.pet.xtile,scrollclip.pet.ytile,herox,heroy,true);
									}
								}
							} else {
								petproposedmovex = 1;
								petproposedmovey = 0;
								petproposedtilex = scrollclip.pet.xtile + petproposedmovex;
								petproposedtiley = scrollclip.pet.ytile + petproposedmovey;
								if ((islocationproperty(4, petproposedtilex, petproposedtiley)) && (!(scrollclip["i_" + petproposedtilex + "_" + petproposedtiley]))) {
									// is ok
									scrollclip.pet.xdir = petproposedmovex;
									scrollclip.pet.ydir = petproposedmovey;
									moveok = false;
								} else {
									// check the other side:
									petproposedmovex = -1;
									petproposedtilex = scrollclip.pet.xtile + petproposedmovex;
									petproposedtiley = scrollclip.pet.ytile + petproposedmovey;
									if ((islocationproperty(4, petproposedtilex, petproposedtiley)) && (!(scrollclip["i_" + petproposedtilex + "_" + petproposedtiley]))) {
										// is ok
										scrollclip.pet.xdir = petproposedmovex;
										scrollclip.pet.ydir = petproposedmovey;
										moveok = false;
									} else {
										// do pathfinding:
										petstate = 3;
										findPath(scrollclip.pet.xtile,scrollclip.pet.ytile,herox,heroy,true);
									}
								}
							}
						}
					} else {
						// pet should just stop, as the npc will move out of its way:
						scrollclip.pet.petclip.stop();
						updatePrints("pet");
					}
				}
				if (petstate != 2) {
					// if hit an npc but doesn't need pathfinding:
					if (parseInt(currentnpcs[h][1]) != 10) {
						// ie. isn't a ghost
						if (parseInt(currentnpcs[h][1]) == 0) {
							// static NPC, pet needs to turn around:
							scrollclip.pet.xdir *= -1;
							scrollclip.pet.ydir *= -1;
						}
						moveok = false;
					}
				}
			}
		}
		// check against hero
		if (hascollided(scrollclip.hero.px, scrollclip.hero.py, herowidth, heroheight, tempx, tempy, scrollclip.pet.awidth, scrollclip.pet.aheight)) {
			moveok = false;
		}
	}
	if (moveok) {
		scrollclip.pet.px += xmove;
		scrollclip.pet.py += ymove;
		//
		// update graphic's position
		scrollclip.pet._x = (scrollclip.pet.px) + (scrollclip.pet.py);
		scrollclip.pet._y = ((scrollclip.pet.px) - (scrollclip.pet.py)) / 2;
		// temp ########################
		gamedisplay.crosshair._x = displayFromWorldCoordX(scrollclip.pet._x);
		gamedisplay.crosshair._y = displayFromWorldCoordY(scrollclip.pet._y);
		// temp ########################
		scrollclip.pet.gotoAndStop(scrollclip.pet.xdir + scrollclip.pet.ydir * 2 + 3);
		//
		scrollclip.pet.petclip.play();
		// update current tile           
		scrollclip.pet.xtile = findtilenumber(scrollclip.pet.px, scrollclip.pet.py, "x");
		scrollclip.pet.ytile = findtilenumber(scrollclip.pet.px, scrollclip.pet.py, "y");
		var counter:Number = calculateobjectdepth(scrollclip.pet._x, scrollclip.pet._y);
		scrollclip.pet.swapDepths(counter);
		// check if pet is at tile centre in direction of travel:
		if (scrollclip.pet.xdir != 0) {
			if ((scrollclip.pet.px % spacing) == (spacing / 2)) {
				updatePrints("pet");
				petismoving = false;
				petismovingawayfromhero = false;
				// check if pet has returned to previous tile after hitting something and needs to calculate pathfinding
				if (petstate == 2) {
					petstate = 3;
					findPath(scrollclip.pet.xtile,scrollclip.pet.ytile,herox,heroy,true);
				}
			}
		}
		if (scrollclip.pet.ydir != 0) {
			if ((scrollclip.pet.py % spacing) == (spacing / 2)) {
				updatePrints("pet");
				petismoving = false;
				petismovingawayfromhero = false;
				// check if pet has returned to previous tile after hitting something and needs to calculate pathfinding
				if (petstate == 2) {
					petstate = 3;
					findPath(scrollclip.pet.xtile,scrollclip.pet.ytile,herox,heroy,true);
				}
			}
		}
	} else {
		// stop animation:
		scrollclip.pet.petclip.stop();
		updatePrints("pet");
	}
}
//
function addNode(parentnode, nodex, nodey) {
	// check is a valid tile (use a positive test here so that invalid tiles (ie. out of range of map) aren't added)
	if (islocationproperty(2, nodex, nodey)) {
		// check no item on that tile:
		if (!(scrollclip["i_" + nodex + "_" + nodey])) {
			// check that this isn't the tile that the NPC blocking the pet is on (if there is one)
			if (!((nodex == petpath.blockedtilex) && (nodey == petpath.blockedtiley))) {
				if (petpath["node_" + nodex + "_" + nodey].cost == undefined) {
					// calculate cost:
					var cost:Number = mabs(nodex - petpath.endx) + mabs(nodey - petpath.endy);
					// make new node:
					petpath["node_" + nodex + "_" + nodey] = {nx:nodex, ny:nodey, parentx:parentnode.nx, parenty:parentnode.ny, cost:cost};
					//scrollclip["t_"+nodex+"_"+nodey].colour.gotoAndStop(6);
					counter++;
					scrollclip["t_" + nodex + "_" + nodey].considered = counter;
					// add it to the array:
					for (var i = 0; i < petpath.uncheckedtiles.length; i++) {
						if (cost < petpath.uncheckedtiles[i].cost) {
							petpath.uncheckedtiles.splice(i,0,petpath["node_" + nodex + "_" + nodey]);
							break;
						}
					}
					if (i >= petpath.uncheckedtiles.length) {
						// add to end of array:
						petpath.uncheckedtiles.push(petpath["node_" + nodex + "_" + nodey]);
					}
				}
			}
		}
	}
}
//
function findPath(startxstr, startystr, endxstr, endystr, blockedbyNPC) {
	// create path object to hold everything:
	petpath = {};
	petpath.startx = parseInt(startxstr);
	petpath.starty = parseInt(startystr);
	petpath.endx = parseInt(endxstr);
	petpath.endy = parseInt(endystr);
	petpath.uncheckedtiles = [];
	petpath.done = false;
	pathisready = false;
	if (blockedbyNPC) {
		// determine the tile that the blocking NPC is in:
		petpath.blockedtilex = petpath.startx - scrollclip.pet.xdir;
		petpath.blockedtiley = petpath.starty - scrollclip.pet.ydir;
		// remove this tile and all those after it from the breadcrumb:
		var foundpointtoremove:Boolean = false;
		for (var i = 0; i < breadcrumblength; i++) {
			if ((petpath.blockedtiley) == breadcrumby[i]) {
				if ((petpath.blockedtilex) == breadcrumbx[i]) {
					foundpointtoremove = true;
				}
			}
			if (foundpointtoremove) {
				breadcrumbx[i] = -1;
				breadcrumby[i] = -1;
			}
		}
	} else {
		petpath.blockedtilex = -1;
		petpath.blockedtiley = -1;
	}
	// create first node:
	var cost:Number = mabs(petpath.startx - petpath.endx) + mabs(petpath.starty - petpath.endy);
	petpath["node_" + petpath.startx + "_" + petpath.starty] = {nx:petpath.startx, ny:petpath.starty, parentx:null, parenty:null, cost:cost};
	// add to array:
	petpath.uncheckedtiles.push(petpath["node_" + petpath.startx + "_" + petpath.starty]);
	petiscalculatingpath = true;
}
//
function makePath(pathobj) {
	// make new array:
	foundpetpathx = [];
	foundpetpathy = [];
	// loop until no more parents:
	while (pathobj.parentx != null) {
		foundpetpathx.unshift(pathobj.nx);
		foundpetpathy.unshift(pathobj.ny);
		// make its parent the new object:
		pathobj = petpath["node_" + pathobj.parentx + "_" + pathobj.parenty];
	}
	pathisready = true;
}
//
function closechest() {
	// convert what's left in the chest array to a string:
	var chestremaining:Array = new Array();
	for (var i in chestarray) {
		chestremaining[i] = chestarray[i].join(".");
	}
	displayitems[chestindex][5] = chestremaining.join("|");
	chestobject.facing.a.gotoAndPlay("closing");
	// add to changes:   
	addtochanges([currentmapnumber, 3, chestindex, (displayitems[chestindex].join(","))]);
	//
	if (chestindex == parseInt(familiarfoundindex)) {
		// then return familiar to hero clip as hero has collected the item the familar was over
		familiarfoundindex = -1;
		familiarstate = 0;
		scrollclip.hero.familiar._visible = true;
		removeMovieClip(scrollclip.familiar);
	}
	// don't alter familiarfoundindex as the chest still exists in the items array                                                                                                                      
}
//
function openInventory() {
	// called from set interval to allow time for the chest opening animation to be seen
	gamedisplay.inventorysets._visible = true;
	waitingforinventory = true;
	clearInterval(chestOpenInv);
	HeroCannotMove = false;
}
//
function hideShout() {
	clearInterval(shoutOuttext);
	if (whatslefttoshout == "") {
		scrollclip.timeddialoguebox._visible = false;
		npcshouting = -1;
	} else {
		displayshouttext(whatslefttoshout,whatsleftshoutnpcindex,false);
	}
}
//
function updatemoney() {
	var moneystring:String = "";
	var silver:Number = money % 100;
	var gold:Number = (money - silver) / 100;
	if (gold > 0) {
		moneystring = gold + " gold - ";
	}
	moneystring += silver + " silver";
	gamedisplay.inventorysets.displaymoney = moneystring;
}
//
function parseMoney(amounttoparse:Number) {
	var moneystring:String = "";
	var silver:Number = amounttoparse % 100;
	var gold:Number = (amounttoparse - silver) / 100;
	if (gold > 0) {
		moneystring = gold + "G ";
	}
	if (silver != 0) {
		moneystring += silver + "S";
	}
	return moneystring;
}
//
function gameloop() {
	// store if a key has been pressed, to check if it can be cleared after the entire loop has run:
	keyhasbeenpressed = whichkeyreleased;
	//
	// check for transition to display new map:
	if (transition == 2) {
		// stop hero animation
		scrollclip.hero.heroclip.stop();
		gamedisplay.transitionclip._alpha -= 10;
		if (gamedisplay.transitionclip._alpha <= 0) {
			// end transition
			transition = 0;
			gamedisplay.transitionclip._visible = false;
			// show location name if the player has changed regions:
			if (locationname != currentLocationName) {
				gamedisplay.locationName.locationNameText.mapName.text = locationname;
				gamedisplay.locationName.gotoAndPlay(2);
				currentLocationName = locationname;
			}
		}
	} else {
		var xdir:Number = 0;
		var ydir:Number = 0;
		var keypressed:Number = 0;
		var herospeed:Number = 2;
		// speed needs to be even to display graphics properly
		//
		// test save routine
		if (keydown(83)) {
			savegame();
		}
		//                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
		if (whichkeyreleased == keyquit) {
			whichkeyreleased = 0;
			fscommand("quit", "");
		}
		//                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
		if (whichkeyreleased == keypause) {
			// 'p' pressed for pause
			if (gamepaused) {
				// already paused, so resume
				gamedisplay.showpaused._visible = 0;
				unpauseGame();
			} else {
				// pause everything
				gamedisplay.showpaused._visible = 1;
				pauseGame();
			}
			whichkeyreleased = 0;
		}
		if (!gamepaused) {
			// if ctrl pressed, check that dialogue box is displayed:
			if ((dialogueboxdisplayed) && (waitingforresponse == 0)) {
				// if waiting for response, then that code will trap key presses
				if (whichkeyreleased == keyaction) {
					if (whatslefttosay == "") {
						// close dialogue box
						gamedisplay.dialoguebox._visible = false;
						dialogueboxdisplayed = false;
						thisnpc = scrollclip["n_" + whatsleftnpcindex];
						// now that dialogue has ended, check if an NPC is waiting to carry along their path:
						if (npcwaitingfordialogue != 0) {
							// make the index negative, to show that dialogue has been closed:
							npcwaitingfordialogue *= -1;
						} else if (String(currentnpcs[whatsleftnpcindex][7]).substr((thisnpc.pathmarker) - 2, 1) == "T") {
							// the -2 is because after the "T" was the stopped facing, and then the pathmarker has been advanced after that
							// this npc has a "T" in their path, but when they got to it, the hero was too far away.
							// the hero has gone back and spoken to them, and the npc has now finished what they've said, so need to resume their path again:
							thisnpc.hasStopped = 0;
							thisnpc.followingpath = 1;
							thisnpc.nottalking = 1;
							thisnpc.pathmarker++;
							// find facing 
							thisdirection = String(currentnpcs[whatsleftnpcindex][7]).substr(thisnpc.pathmarker, 1);
							switch (thisdirection) {
								case "1" :
									// move NE
									thisnpc.ydir = 1;
									break;
								case "2" :
									// move SE
									thisnpc.xdir = 1;
									break;
								case "3" :
									// move SW
									thisnpc.ydir = -1;
									break;
								case "4" :
									// move NW
									thisnpc.xdir = -1;
									break;
								default :
									// nothing
							}
							thisnpc.pathmarker++;
							thisnpc.storedxdir = thisnpc.xdir;
							thisnpc.storedydir = thisnpc.ydir;
						}
						whatsleftnpcindex = -1;
					} else {
						// don't display name this time
						displaytext(whatslefttosay,whatsleftnpcindex,false);
					}
					whichkeyreleased = 0;
				}
			} else {
				// 
				if (waitingforresponse == 0) {
					if (validinventorypresses.indexOf("," + whichkeyreleased + ",") != -1) {
						// an inventory key has been pressed
						settoggle = "null";
						if (!(waitingfornumericinput)) {
							switch (whichkeyreleased) {
								case keytoggleinv :
									settoggle = "iinv";
									numberofslotstoadd = currentbagsize;
									whicharray = "inventory";
									break;
								case keytoggleother :
									// determine if the shop panel or a chest panel is open:
									for (var i = 0; i < setsopen.length; i++) {
										switch (setsopen[i][0]) {
											case "ichest" :
												settoggle = "ichest";
												numberofslotstoadd = chestarraysize;
												whicharray = "chestarray";
												break;
											case "ishop" :
												settoggle = "ishop";
												numberofslotstoadd = shopcontents.length;
												whicharray = "shopcontents";
												break;
											case "iworkshop" :
												settoggle = "iworkshop";
												numberofslotstoadd = currentplans.length;
												whicharray = "currentplans";
												break;
											default :
												//
										}
									}
									break;
								case keytogglepet :
									// check pet can carry anything:
									if (petcarrying.length != 0) {
										// check pet is in range:
										if (isinrange(scrollclip.hero.px, scrollclip.hero.py, scrollclip.pet.px, scrollclip.pet.py, (spacing * 1.5))) {
											settoggle = "ipet";
											numberofslotstoadd = petcarrying.length;
											whicharray = "petcarrying";
										} else {
											// isn't in range - player can't view pet inventory:
											settoggle = "null";
											statusMessage(currentpet[10] + " is too far away");
										}
									} else {
										settoggle = "null";
										statusMessage(currentpet[10] + " cannot carry anything");
									}
									break;
								case keytoggleequip :
									settoggle = "iequip";
									whicharray = "currentlyEquipped";
									numberofslotstoadd = currentlyEquipped.length;
									break;
								case keyescape :
									settoggle = "all";
									break;
								case keytogglecardalbum :
									openCardAlbum();
									break;


								case keytogglealbum :
									toggleCollectionAlbum();
									break;

								default :
									//
							}
							//
							if (settoggle == "all") {
								// close all open slots
								for (var i = 0; i < setsopen.length; i++) {
									gamedisplay.inventorysets[setsopen[i][0]]._visible = false;
									// check if closing a chest:
									if (setsopen[i][0] == "ichest") {
										closechest();
									}
									if (setsopen[i][0] == "icrafting") {
										closeCraftingPanel();
									}
									// remove all clips in this set:                                                                                                                    
									for (var checkInvClip in gamedisplay.inventorysets[setsopen[i][0]]) {
										// check it's an inventory icon:
										if (gamedisplay.inventorysets[setsopen[i][0]][checkInvClip]._name.indexOf("inventoryIcon") != -1) {
											gamedisplay.inventorysets[setsopen[i][0]][checkInvClip].removeMovieClip();
										}
									}
								}
								shopisopen = false;
								setsopen = [];
								gamedisplay.inventorysets._visible = false;
								handCursor.inventoryToolTip._visible = false;
								waitingforinventory = false;
							} else if (settoggle != "null") {
								inventoryPanels();
							}
							whichkeyreleased = 0;
						}
					}
					if (waitingfornumericinput) {
						if (whichkeyreleased == keyconfirm) {
							gamedisplay.inputbox._visible = false;
							waitingfornumericinput = false;
							valueentered = gamedisplay.inputbox.quantitybeingmoved;
							if (!(isNaN(valueentered))) {
								beingmovedquantity = parseInt(valueentered);
								if (beingmovedquantity == quantityavailable) {
									// treat as normal drag:
									splitQuantityAllMoved = true;
									allowDrag(splitParentItem,splitQuanFromSet);
								} else {
									// check is within range (ie. >1 and <=quantity of slot):
									if ((beingmovedquantity > 0) && (beingmovedquantity < quantityavailable)) {
										quantitysplit = true;
										// attach new clip with details of element being moved:
										attachFloatingInvIcon(splitQuanFromSet,(gamedisplay.inventorysets[splitQuanFromSet]["inventoryIcon" + splitParentItem].invIcons._currentframe),beingmovedquantity,(gamedisplay.inventorysets[splitQuanFromSet]["inventoryIcon" + splitParentItem].qual._currentframe),(gamedisplay.inventorysets[splitQuanFromSet]["inventoryIcon" + splitParentItem].dura),(gamedisplay.inventorysets[splitQuanFromSet]["inventoryIcon" + splitParentItem].effec),(gamedisplay.inventorysets[splitQuanFromSet]["inventoryIcon" + splitParentItem].wrapping),(gamedisplay.inventorysets[splitQuanFromSet]["inventoryIcon" + splitParentItem].wear),(gamedisplay.inventorysets[splitQuanFromSet]["inventoryIcon" + splitParentItem].col),(gamedisplay.inventorysets[splitQuanFromSet]["inventoryIcon" + splitParentItem].enchant),(gamedisplay.inventorysets[splitQuanFromSet]["inventoryIcon" + splitParentItem].hallmark),(gamedisplay.inventorysets[splitQuanFromSet]["inventoryIcon" + splitParentItem].inscr));
										// start drag:
										allowDrag(999,splitQuanFromSet);
										if (splitQuanFromSet != "ishop") {
											// update quantity on remaining slot:
											quantityLeftOnParent = quantityavailable - beingmovedquantity;
											gamedisplay.inventorysets[splitQuanFromSet]["inventoryIcon" + splitParentItem].quan.text = quantityLeftOnParent;
											this[fromarray][splitParentItem][1] = quantityLeftOnParent;
										}
									}
								}
							}
						}
					}
					//                                                                                                                                                                                                                                    
					if (!waitingforinventory) {
						if (whichkeyreleased == keydowse) {
							// toggle whether hero is dowsing or not
							isDowsing = !isDowsing;
							whichkeyreleased = 0;
							trace("dowsing" + isDowsing);
						}
						var shallowsoffset:Number = 3;
						// check for shallows (3 was used for the basic equation)
						if (islocationproperty(8, herox, heroy)) {
							// is in shallows
							shallowsoffset = 12;
							herospeed = 2;
							// make hero move more slowly (herospeed normally is 4)
						} else if (keydown(16)) {
							// isn't in shallows and ctrl pressed so make hero run
							herospeed = 4;
						}
						if (isDowsing) {
							// slow hero down - if the hero can dowse (ie. skill is >0)
							if (DowsingSkillLevel > 0) {
								herospeed = 2;
							}
						}
						if (keydown(keymoveup)) {
							ydir = 1;
							keypressed = 1;
						} else if (keydown(keymovedown)) {
							ydir = -1;
							keypressed = 1;
						} else if (keydown(keymoveleft)) {
							// left
							xdir = -1;
							keypressed = 1;
						} else if (keydown(keymoveright)) {
							// right
							xdir = 1;
							keypressed = 1;
						}
						// check for transition in progress:                                                                                                                                                                                                      
						if (transition == 1) {
							gamedisplay.transitionclip._alpha += 10;
							// move hero forward by faking key press:
							keypressed = 1;
							xdir = storedxdir;
							ydir = storedydir;
							// display transition:
							if (gamedisplay.transitionclip._alpha >= 100) {
								// cover is fully black so change maps:
								transition = 0;
								changemaps(newmapnumeric,newcharx,newchary);
								// break out of loop and stop any further checks in this loop:
								return false;
							}
						}
						var xmove:Number = xdir * herospeed;
						var ymove:Number = ydir * herospeed;
						// check if the hero should stay still (eg. chest is opening)
						if (HeroCannotMove) {
							keypressed = 0;
						}
						// animate hero if a key is being pressed                                                                                                                         
						if (keypressed == 0) {
							scrollclip.hero.heroclip.stop();
							updatePrints("hero");
						} else {
							scrollclip.hero.heroclip.play();
							// change hero's facing
							scrollclip.hero.gotoAndStop(xdir + ydir * 2 + shallowsoffset);
						}
						if (keypressed == 1) {
							// store facing of hero
							storedxdir = xdir;
							storedydir = ydir;
							// 
							// work out tile that these xmove, ymove will move the hero to
							// check all 4 corners...
							var heroleftcoord:Number = (xmove + scrollclip.hero.px) - (herowidth / 2);
							var herorightcoord:Number = (xmove + scrollclip.hero.px) + (herowidth / 2);
							var herotopcoord:Number = (ymove + scrollclip.hero.py) + (heroheight / 2);
							// heightgained should only affect graphic placement, not collisions
							var herobottomcoord:Number = (ymove + scrollclip.hero.py) - (heroheight / 2);
							// 
							herobottomleftx = findtilenumber(heroleftcoord, herobottomcoord, "x");
							herobottomlefty = findtilenumber(heroleftcoord, herobottomcoord, "y");
							herotopleftx = findtilenumber(heroleftcoord, herotopcoord, "x");
							herotoplefty = findtilenumber(heroleftcoord, herotopcoord, "y");
							herobottomrightx = findtilenumber(herorightcoord, herobottomcoord, "x");
							herobottomrighty = findtilenumber(herorightcoord, herobottomcoord, "y");
							herotoprightx = findtilenumber(herorightcoord, herotopcoord, "x");
							herotoprighty = findtilenumber(herorightcoord, herotopcoord, "y");
							// 
							var moveok:Number = 0;
							var tile1height:Number;
							var tile2height:Number;
							// these variables are used in checking for locked doors:
							var targettile1x:Number;
							var targettile1y:Number;
							var targettile2x:Number;
							var targettile2y:Number;
							if (ydir == 1) {
								if (islocationproperty(2, herotopleftx, herotoplefty)) {
									if (islocationproperty(2, herotoprightx, herotoprighty)) {
										// up key pressed and top of hero's base and right edge of hero's base are valid tiles
										// for height:
										tile1height = heightoftile(herotopleftx, herotoplefty);
										tile2height = heightoftile(herotoprightx, herotoprighty);
										targettile1x = herotopleftx;
										targettile1y = herotoplefty;
										targettile2x = herotoprightx;
										targettile2y = herotoprighty;
										moveok = 1;

									}
								}
							} else if (ydir == -1) {
								if (islocationproperty(2, herobottomleftx, herobottomlefty)) {
									if (islocationproperty(2, herobottomrightx, herobottomrighty)) {
										tile1height = heightoftile(herobottomleftx, herobottomlefty);
										tile2height = heightoftile(herobottomrightx, herobottomrighty);
										targettile1x = herobottomleftx;
										targettile1y = herobottomlefty;
										targettile2x = herobottomrightx;
										targettile2y = herobottomrighty;
										moveok = 1;

									}
								}
							}
							if (xdir == -1) {
								if (islocationproperty(2, herotopleftx, herotoplefty)) {
									if (islocationproperty(2, herobottomleftx, herobottomlefty)) {
										tile1height = heightoftile(herotopleftx, herotoplefty);
										tile2height = heightoftile(herobottomleftx, herobottomlefty);
										targettile1x = herotopleftx;
										targettile1y = herotoplefty;
										targettile2x = herobottomleftx;
										targettile2y = herobottomlefty;
										moveok = 1;

									}
								}
							} else if (xdir == 1) {
								if (islocationproperty(2, herotoprightx, herotoprighty)) {
									if (islocationproperty(2, herobottomrightx, herobottomrighty)) {
										tile1height = heightoftile(herobottomrightx, herobottomrighty);
										tile2height = heightoftile(herotoprightx, herotoprighty);
										targettile1x = herobottomrightx;
										targettile1y = herobottomrighty;
										targettile2x = herotoprightx;
										targettile2y = herotoprighty;
										moveok = 1;

									}
								}
							}
							// check to see if hero will collide with NPCs                                                                                                                         
							herotempx = scrollclip.hero.px + xmove;
							herotempy = scrollclip.hero.py + ymove;
							// check against NPCs
							var h:Number;
							var thisnpc:Object;
							for (h in currentnpcs) {
								thisnpc = scrollclip["n_" + h];
								if (hascollided(thisnpc.px, thisnpc.py, thisnpc.awidth, thisnpc.aheight, herotempx, herotempy, herowidth, heroheight)) {
									if (currentnpcs[h][1] != 10) {
										//ie. isn't a ghost
										moveok = 0;
									}
								}
							}
							if (haspet) {
								// check for pet collision
								if (hascollided(scrollclip.pet.px, scrollclip.pet.py, scrollclip.pet.awidth, scrollclip.pet.aheight, herotempx, herotempy, herowidth, heroheight)) {
									moveok = 0;
									movePetAway();
								}
							}
							if (familiarstate == 0) {
								checkForHotspots();
							}
							// declaring variables before use in a loop is faster                                                                                                                         
							var itemtype:Number;
							var itemxtile:Number;
							var itemytile:Number;
							var thisitem:Object;
							var remove:Number = 0;
							var g:Number;
							for (g in displayitems) {
								// ignore placeholders:
								if ((inventoryitems[parseInt(displayitems[g][2])][6] != "ph") && (!((inventoryitems[parseInt(displayitems[g][2])][2].indexOf("k") != -1) && (determinePlantGrowthStage(displayitems[g][6]) == 0)))) {
									itemxtile = parseInt(displayitems[g][0]);
									itemytile = parseInt(displayitems[g][1]);
									thisitem = scrollclip["i_" + itemxtile + "_" + itemytile];
									if (hascollided(thisitem.px, thisitem.py, thisitem.w, thisitem.w, herotempx, herotempy, herowidth, heroheight)) {
										moveok = 0;

										break;
									}
									if (familiarstate == 0) {
										// check for familiar being able to see special items:
										// after making sure it's not already found something


										if (!(isinplayershouse)) {
											// make sure that the current map isn't the player's house - as the player may have dropped some special items there, and don't want the familiar reacting to these
											if ((thisitem.sp == 1) || (isAQuestItem(displayitems[g][2]))) {
												// is a special item - check it wasn't the last item visited:
												if (g != familiarsLastItem) {
													if (isinrange(herox, heroy, itemxtile, itemytile, (FamiliarSkillLevel / 10))) {
														if (hasLOS(herox, heroy, itemxtile, itemytile)) {
															// set index to this item's index:
															familiarfoundindex = g;
															familiarstate = 1;
															// hide hero familiar clip and create independant clip:
															var familiardepth:Number = findClearDepth(scrollclip.hero.getDepth() + 1);
															// offset the familiar's clip by +1 so it's on the same location as hero
															scrollclip.hero.familiar._visible = false;
															scrollclip.attachMovie("familiarmovie","familiar",familiardepth);
															// init hero object non-iso position:
															scrollclip.familiar.px = ((herox + 0.5) * spacing);
															scrollclip.familiar.py = ((heroy + 0.5) * spacing);
															// the ...(+0.5)s ensures that the clip is centred tile 
															scrollclip.familiar._x = (scrollclip.familiar.px) + (scrollclip.familiar.py);
															scrollclip.familiar._y = ((scrollclip.familiar.px) - (scrollclip.familiar.py)) / 2;
															//
															scrollclip.familiar.lastposition = pathx.length;
															scrollclip.familiar.xdir = pathx[0];
															scrollclip.familiar.ydir = pathy[0];
															scrollclip.familiar.nextposition = 1;
															scrollclip.familiar.distx = 0;
															scrollclip.familiar.disty = 0;
														}
													}
												}
											}
										}
									} else if (familiarstate == 3) {
										// familiar is returning to hero, but check for other items still
										if (!(isinplayershouse)) {
											if (thisitem.sp == 1) {
												// is a special item - check it wasn't the last item visited:
												if (g != familiarsLastItem) {
													var familiarcurrenttilex:Number = findtilenumber(scrollclip.familiar.px, scrollclip.familiar.py, "x");
													var familiarcurrenttiley:Number = findtilenumber(scrollclip.familiar.px, scrollclip.familiar.py, "y");
													if (isinrange(familiarcurrenttilex, familiarcurrenttiley, itemxtile, itemytile, (FamiliarSkillLevel / 10))) {
														if (hasLOS(familiarcurrenttilex, familiarcurrenttiley, itemxtile, itemytile)) {
															// set index to this item's index:
															familiarfoundindex = g;
															familiarstate = 1;
															scrollclip.familiar.lastposition = pathx.length;
															scrollclip.familiar.xdir = pathx[0];
															scrollclip.familiar.ydir = pathy[0];
															scrollclip.familiar.nextposition = 1;
														}
													}
												}
											}
										}
									}
								}
							}
							// check for doors
							if (transition == 0) {
								// check that a map change transition isn't in progress already
								var foundDoor = false;
								/*
								
								if (islocationproperty(16, targettile1x, targettile1y)) {
								if (islocationproperty(16, targettile2x, targettile2y)) {
								// hero is about to move onto a door
								trace("found a door "+targettile1x+","+targettile1y);
								
								*/
								var i:Number;
								var doorlocationx:Number;
								var doorlocationy:Number;
								for (i in thisMapsDoors) {
									doorlocationx = thisMapsDoors[i][1];
									doorlocationy = thisMapsDoors[i][2];
									if (doorlocationx == herox) {
										if (doorlocationy == heroy) {
											// ie. herox is either on the door tile, or on an adjacent one
											// (as target1x etc. were used to detect the door, herox and heroy may not yet be on the door tile fully)
											newmapnumeric = parseInt(thisMapsDoors[i][0]);
											newcharx = parseInt(thisMapsDoors[i][3]);
											newchary = parseInt(thisMapsDoors[i][4]);
											foundDoor = true;
											initialheight = parseInt(thisMapsDoors[i][5]);

											// play door open animation and sound
											// Before starting door opening animation, need to check that (door._currentframe == 1)
											// so that it doesn’t play the animation if the door is already open
											if (scrollclip["t_" + doorlocationx + "_" + doorlocationy].a._currentframe == 1) {
												//if no animation for this door, then the above will be false anyway
												scrollclip["t_" + doorlocationx + "_" + doorlocationy].a.gotoAndPlay(2);
												playsoundeffect("dooropen");
											}
											// set flag so that the transition will occur:                                                                                                                         
											transition = 1;
											// display transition cover
											gamedisplay.transitionclip._alpha = 0;
											gamedisplay.transitionclip._visible = true;
											break;
										}
									}
									/*
									}
									}
									*/ 
								}
								// not a door, but check to see if it's a map edge:
								if (!foundDoor) {
									if (herox == (maplengthx - 1)) {
										newmapnumeric = scrollclip.nextmap[0];
										// 1 is the facing, so 0 is off top of map, 1 is off to right etc.
										// heroy will stay the same, and in this case herox will be 1
										// set flag so that the transition will occur:
										transition = 1;
										// display transition cover
										gamedisplay.transitionclip._alpha = 0;
										gamedisplay.transitionclip._visible = true;
										newcharx = 1;
										newchary = heroy;
										initialheight = scrollclip.nextmap[1];
									} else if (herox == 0) {
										newmapnumeric = scrollclip.nextmap[2];
										// heroy stays the same
										// set flag so that the tranistion will occur:
										transition = 1;
										// display transition cover
										gamedisplay.transitionclip._alpha = 0;
										gamedisplay.transitionclip._visible = true;
										newcharx = scrollclip.nextmap[4];
										newchary = heroy;
										initialheight = scrollclip.nextmap[3];
									} else if (heroy == (maplengthy - 1)) {
										newmapnumeric = scrollclip.nextmap[5];
										//set flag so that the tranistion will occur:
										transition = 1;
										// display transition cover
										gamedisplay.transitionclip._alpha = 0;
										gamedisplay.transitionclip._visible = true;
										newcharx = herox;
										newchary = 1;
										initialheight = scrollclip.nextmap[6];
									} else if (heroy == 0) {
										newmapnumeric = scrollclip.nextmap[7];
										//set flag so that the tranistion will occur:
										transition = 1;
										// display transition cover
										gamedisplay.transitionclip._alpha = 0;
										gamedisplay.transitionclip._visible = true;
										newcharx = herox;
										newchary = scrollclip.nextmap[9];
										initialheight = scrollclip.nextmap[8];
									}
								}
							}

							if (tile1height != tile2height) {
								// both tiles that will be under hero's new position are at different heights
								if (!(islocationproperty(32, herox, heroy))) {
									// and not on stairs, so don't allow move
									moveok = 0;
								} else {
									// are on stairs, so because tile1height is used from now on to test,
									// make it equal to the average of the two:
									tile1height = (tile1height + tile2height) / 2;
									// IS THIS REQUIRED?????? ####################
								}
							}
							// now only need to check tile1height as established that tile1 and tile2 have same height (or moveok already set to 0)                                                                                                                                                                                                   
							if (tile1height < -30) {
								// is a drop, but too far
								moveok = 0;
							} else if (tile1height > 15) {
								// is too great
								moveok = 0;
							}
							// don't need collision detection during a transition:                                                                                                                                                                    
							if ((moveok == 1) || (transition == 1)) {
								// update objects position
								scrollclip.hero.px += xmove;
								scrollclip.hero.py += ymove;

								var previousHeroX = herox;
								var previousHeroY = heroy;
								// update current tile position
								herox = findtilenumber(scrollclip.hero.px, scrollclip.hero.py, "x");
								heroy = findtilenumber(scrollclip.hero.px, scrollclip.hero.py, "y");


								if (!((previousHeroX == herox) && (previousHeroY == heroy))) {
									revealCartographicMap(herox,heroy);
								}
								// check for dowsable tiles:                                                                                                              
								if (isDowsing) {
									if (islocationproperty(256, herox, heroy)) {
										// run check to see if dowsing was successful:
										if ((mrand() * 125) < DowsingSkillLevel) {
											//125 applies if 100 if the highest dowsing skill (ie. won't get success every time)
											trace("successful dowse!");
										}
									}
								}
								var familiarcurrenttilex:Number = findtilenumber(scrollclip.familiar.px, scrollclip.familiar.py, "x");
								var familiarcurrenttiley:Number = findtilenumber(scrollclip.familiar.px, scrollclip.familiar.py, "y");
								if (familiarstate == 2) {
									if (!(isinrange(herox, heroy, familiarcurrenttilex, familiarcurrenttiley, 6))) {
										// ie. if the familar has found something, but the hero is out of the range of the familiar,
										// then set familiar on path back to hero:
										if (hasLOS(familiarcurrenttilex, familiarcurrenttiley, herox, heroy)) {
											familiarstate = 3;
											scrollclip.familiar.lastposition = pathx.length;
											scrollclip.familiar.xdir = pathx[0];
											scrollclip.familiar.ydir = pathy[0];
											scrollclip.familiar.nextposition = 1;
											scrollclip.familiar.distx = 0;
											scrollclip.familiar.disty = 0;
											// start timer to clear the LastItem reference
											familiarLastItemTimer = setInterval(clearFamiliarRefs, 10000);
											familiarLastSpotTimer = setInterval(clearFamiliarHotSpots, 10000);
										}
									}
								} else if (familiarstate == 4) {
									// breadcrumb faded - check LoS path to return to hero
									if (isinrange(herox, heroy, familiarcurrenttilex, familiarcurrenttiley, (FamiliarSkillLevel / 10))) {
										if (hasLOS(familiarcurrenttilex, familiarcurrenttiley, herox, heroy)) {
											familiarstate = 3;
											scrollclip.familiar.lastposition = pathx.length;
											scrollclip.familiar.xdir = pathx[0];
											scrollclip.familiar.ydir = pathy[0];
											scrollclip.familiar.nextposition = 1;
											scrollclip.familiar.distx = 0;
											scrollclip.familiar.disty = 0;
										}
									}
								}
								if (ydir != 0) {
									// movedx stores the distance moved parallel to the y-axis across the current tile
									movedy += ymove;
									if (movedy >= spacing) {
										movedy -= spacing;
										dropBreadcrumb();
										updatePrints("hero");
										scrolltiles();
										checkProximityQuestHotSpots();
									} else if (movedy < 0) {
										movedy += spacing;
										scrolltiles();
										dropBreadcrumb();
										updatePrints("hero");
										checkProximityQuestHotSpots();
									}
								}
								if (xdir != 0) {
									movedx += xmove;
									if (movedx >= spacing) {
										movedx -= spacing;
										dropBreadcrumb();
										scrolltiles();
										updatePrints("hero");
										checkProximityQuestHotSpots();
									} else if (movedx < 0) {
										movedx += (spacing);
										dropBreadcrumb();
										scrolltiles();
										updatePrints("hero");
										checkProximityQuestHotSpots();
									}
								}
								// check for raised heights:                                                                                                                         
								var tileoffsetnum:Number = scrollclip["t_" + herox + "_" + heroy].h;
								var tileoffsetstr:String = String(tileoffsetnum);
								if (tileoffsetstr.indexOf("/") != -1) {
									// is a split height tile, check hero's current height against both options
									var tilesheight:Array = tileoffsetstr.split("/");
									if (heightgained == parseInt(tilesheight[0])) {
										var tileoffset:Number = parseInt(tilesheight[0]);
									} else if (heightgained == parseInt(tilesheight[1])) {
										var tileoffset:Number = parseInt(tilesheight[1]);
									}
								} else {
									var tileoffset:Number = parseInt(tileoffsetstr);
								}
								if (tileoffset == undefined) {
									// tile doesn't exist as hero is moving through a transition
									tileoffset = heightgained;
								}
								if (islocationproperty(32, herox, heroy)) {
									// is on a stairs - check direction:
									switch (scrollclip["t_" + herox + "_" + heroy].s) {
										case 1 :
											tileoffset = tileoffsetnum + (spacing - movedx);
											// ie. tiles min height and the distance travelled across the tile (for a 45degree slope, this will equal the height offset required)
											break;
										case 2 :
											tileoffset = tileoffsetnum + (spacing - movedy);
											break;
										case 3 :
											tileoffset = tileoffsetnum + movedx;
											break;
										default :
											// direction 0 is default:
											tileoffset = tileoffsetnum + movedy;
									}
								}
								var heightchange:Number = tileoffset - heightgained;


								heightgained += heightchange;
								previousoffset = tileoffset;
								//
								// update graphic's position
								scrollclip.hero._x = (scrollclip.hero.px) + (scrollclip.hero.py);
								scrollclip.hero._y = (((scrollclip.hero.px) - (scrollclip.hero.py)) / 2) - heightgained;
								// 
								// calculate difference for container clip scroll:
								var heromovediffx:Number = scrollclip.hero._x - oldheroposx;
								var heromovediffy:Number = scrollclip.hero._y - oldheroposy;
								oldheroposx = scrollclip.hero._x;
								oldheroposy = scrollclip.hero._y;
								//
								// move container clip accordingly:
								scrollclip._y -= heromovediffy;
								scrollclip._x -= heromovediffx;
								// check for distant scroll and move by lesser amount:
								if (scrollclip.hasDistantScroll) {
									// it's already been moved by scrollclip, so set it back by half
									scrollclip.distantscroll._x += heromovediffx / 2;
									scrollclip.distantscroll._y += heromovediffy / 2;
								}
								// calculate hero's depth based on its centre                                                                                                                            
								var heronewdepth:Number;
								if (tileoffset > 0) {
									// hero is on a raised tile
									depthsorttargettilex = herox;
									depthsorttargettiley = heroy;
									if (scrollclip["t_" + herox + "_" + heroy].s > 1) {
										// is a stairs tile, heading up towards SE or SW
										heronewdepth = calculateobjectdepth(scrollclip.hero._x, scrollclip.hero._y);
									} else {
										// check to see if the hero is passing from an identical height tile (or lower - eg.stairs)
										// if so, depth sort based on the tile under the hero's lowest point
										var tileoffsetstr:String = String(scrollclip["t_" + herobottomrightx + "_" + herobottomrighty].h);
										if (tileoffsetstr.indexOf("/") != -1) {
											// is a split height tile, check hero's current height against both options
											var tilesheight:Array = tileoffsetstr.split("/");
											if (heightgained == parseInt(tilesheight[0])) {
												var thistileoffset:Number = parseInt(tilesheight[0]);
											} else if (heightgained == parseInt(tilesheight[1])) {
												var thistileoffset:Number = parseInt(tilesheight[1]);
											}
										} else {
											var thistileoffset:Number = parseInt(tileoffsetstr);
										}
										if (thistileoffset <= tileoffset) {
											// check that the bottom right is a raised tile:
											if (thistileoffset > 0) {
												depthsorttargettilex = herobottomrightx;
												depthsorttargettiley = herobottomrighty;
											}
										}
										heronewdepth = scrollclip["t_" + depthsorttargettilex + "_" + depthsorttargettiley].getDepth() + 1;
									}
								} else {
									heronewdepth = calculateobjectdepth(scrollclip.hero._x, scrollclip.hero._y);
								}
								scrollclip.hero.swapDepths(heronewdepth);
							}
						}
					}
				} else {
					// waiting for dialogue response
					if (keydown(38)) {
						// up key pressed
						if (responsePointerIndex > 0) {
							responsePointerIndex--;
							gamedisplay.responsebox.pointer._y -= (gamedisplay.responsebox["choice" + responsePointerIndex].textHeight + 6);
						}
					} else if (keydown(40)) {
						if (responsePointerIndex < gamedisplay.responsebox.choices.length - 1) {
							gamedisplay.responsebox.pointer._y += (gamedisplay.responsebox["choice" + responsePointerIndex].textHeight + 6);
							responsePointerIndex++;
						}
					}
					if (waitingforresponse == 1) {
						if (whichkeyreleased == keyaction) {
							determineResponse();
							waitingforresponse = 0;
							// hide dialogue box
							gamedisplay.responsebox._visible = false;
							// reset pointer:
							gamedisplay.responsebox.pointer._y = responsePointerOffset;
							responsePointerIndex = 0;
							//
							whichkeyreleased = 0;
						}
					} else {
						// trading yes/no
						if (whichkeyreleased == keyaction) {
							if (responsePointerIndex == 0) {
								// yes
								// go through array and remove item given (already know that the player has that item and quantity)
								// make copy of inventory and pet array to restore to if required:
								var inventoryRestore = inventory.slice(0);
								var petRestore = petcarrying.slice(0);
								// loop through and remove items required to complete quest:
								for (var i in itemreqarray) {
									removeitemfrominventory(parseInt(itemreqarray[i][1]),parseInt(itemreqarray[i][0]));
								}
								if (canadditemtoinventory(npcitemtype, npcitemquantity, 4, 100, 4, -1, 0, 0, 0, 0, "-") == npcitemquantity) {
									additemtoinventory(npcitemtype,npcitemquantity,4,100,4,-1,0,0,0,0,"-");
									showItemAddedAnimation(npcitemtype);
									// check if this is a repeatable quest:

									if (itemexchangenpcthanks.indexOf("[") != -1) {

										displaytext(itemexchangenpcthanks.substring(1),itemexchangenpc,true);
										quests[itemexchangequest][0] = 1;
									} else {
										displaytext(itemexchangenpcthanks,itemexchangenpc,true);
										// completely close quest:
										quests[itemexchangequest][0] = 3;

										stopTrackingQuestItem(itemexchangequest);
										// remove quest related dialogue from the NPCs array:
										currentnpcs[itemexchangenpc].splice(11,1);
										addtochanges([currentmapnumber, 1, itemexchangenpc, (currentnpcs[itemexchangenpc].join(","))]);
										checkForTitleGain(questnumber);
									}
									hotSpotQuestChange();
								} else {
									// put removed items back:
									inventory = inventoryRestore.slice(0);
									petcarrying = petRestore.slice(0);
								}
							} else {
								// no
								// remove dialogue box
								gamedisplay.dialoguebox._visible = false;
								dialogueboxdisplayed = false;
							}
							waitingforresponse = 0;
							// reset pointer:
							gamedisplay.responsebox.pointer._y = responsePointerOffset;
							responsePointerIndex = 0;
							whichkeyreleased = 0;
							// hide dialogue box
							gamedisplay.responsebox._visible = false;
						}
					}
				}
				checkforitems();
				checkforlockeddoors();
				// =====================
				// fps counter
				gamedisplay.fpscounter.calcFPS();
				// =====================
				// check if hero inside, if so, increase frame counter
				if (mapbuilding == "t") {
					countedframes++;
				}
				// check for door opening animation                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
				if (dooropened == 1) {
					// opening door animation has completed
					var newframe:Number = parseInt(currentmap[openingdoorx][openingdoory]) + 1;
					//gamedisplay.xmlmessage = newframe;
					currentmap[openingdoorx][openingdoory] = newframe;
					// save this change to changes array - is a tile change so type 2 is used:
					addtochanges([currentmapnumber, 2, openingdoorx, openingdoory, newframe]);
					counter = calculatedepth(openingdoorx, openingdoory);
					scrollclip["t_" + openingdoorx + "_" + openingdoory].gotoAndStop(newframe);
					scrollclip["t_" + openingdoorx + "_" + openingdoory].swapDepths(counter);
					dooropened = 0;
					// set the playing animation back off
					doorplayinganimation = 0;
				}
			}
			movenpcs();
			if ((familiarstate == 1) || (familiarstate == 3)) {
				// is either moving to item, or to hero
				movefamiliar();
			}
			//                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
			// check if pet is in range of hero or not:
			if (haspet) {
				if (!(petismoving)) {
					checkPet();
				}
			}
			if (petismoving) {
				movepet();
			}
			if (petiscalculatingpath) {
				if (petpath.uncheckedtiles.length > 0) {
					// get the next node:
					var N:Object = petpath.uncheckedtiles.shift();
					// check if this is the target:
					if ((N.nx == petpath.endx) && (N.ny == petpath.endy)) {
						petpath.done = true;
						makePath(N);
						break;
					} else {
						addNode(N,N.nx + 1,N.ny);
						addNode(N,N.nx - 1,N.ny);
						addNode(N,N.nx,N.ny + 1);
						addNode(N,N.nx,N.ny - 1);
					}
				} else {
					// no path found, try again:
					delete petpath;
					findPath(scrollclip.pet.xtile,scrollclip.pet.ytile,herox,heroy,false);
				}
				if (pathisready) {
					petstate = 4;
					petiscalculatingpath = false;
					var nextpettilex:Number = foundpetpathx.shift();
					var nextpettiley:Number = foundpetpathy.shift();
					// find direction from path:
					scrollclip.pet.xdir = 0;
					scrollclip.pet.xdir = 0;
					// get next tile from array:
					if ((scrollclip.pet.ytile) == nextpettiley) {
						if ((scrollclip.pet.xtile - 1) == nextpettilex) {
							scrollclip.pet.xdir = -1;
							scrollclip.pet.ydir = 0;
						} else if ((scrollclip.pet.xtile + 1) == nextpettilex) {
							scrollclip.pet.xdir = 1;
							scrollclip.pet.ydir = 0;
						}
					} else if ((scrollclip.pet.xtile) == nextpettilex) {
						if ((scrollclip.pet.ytile + 1) == nextpettiley) {
							scrollclip.pet.xdir = 0;
							scrollclip.pet.ydir = 1;
						} else if ((scrollclip.pet.ytile - 1) == nextpettiley) {
							scrollclip.pet.xdir = 0;
							scrollclip.pet.ydir = -1;
						}
					}
					petismoving = true;
					scrollclip.pet.gotoAndStop((scrollclip.pet.xdir) + (scrollclip.pet.ydir) * 2 + 3);
					scrollclip.pet.petclip.play();
					delete petpath;
				}
			}
			//                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
			checknpcsvisible();
			checkitemsvisible();
			scrollclip.mapspecificloop();
			//
			if (whichkeyreleased == keyQuickEquip) {
				if (Key.isDown(keyaction)) {
					// ctrl held down and tab released for quick equip
					if (!quickEquipVisible) {
						// loop through inv and determine all items that can be equipped (with currently equipped item first):
						if (currentlyEquipped[0][0] != 1) {
							allEquippableItems = [["currentlyEquipped", 0]];
						} else {
							allEquippableItems = [];
						}
						for (var i = 0; i < currentbagsize; i++) {
							if (inventory[i][0] != 1) {
								if (inventoryitems[parseInt(inventory[i][0])][13] != "-") {
									allEquippableItems.push(["inventory", i]);
								}
							}
						}
						if (petcarrying.length != 0) {
							if (isinrange(scrollclip.hero.px, scrollclip.hero.py, scrollclip.pet.px, scrollclip.pet.py, (spacing * 1.5))) {
								for (var i = 0; i < petcarrying.length; i++) {
									if (petcarrying[i][0] != 1) {
										if (inventoryitems[parseInt(petcarrying[i][0])][13] != "-") {
											allEquippableItems.push(["petcarrying", i]);
										}
									}
								}
							}
						}
						var currQuickEquipXPos = 0;
						for (var i = 0; i < allEquippableItems.length; i++) {
							gamedisplay.quickEquipHolder.attachMovie("inventoryIcons","equip" + i,i);
							gamedisplay.quickEquipHolder["equip" + i].gotoAndStop(_root[(allEquippableItems[i][0])][(allEquippableItems[i][1])][0]);
							if (i != 0) {
								gamedisplay.quickEquipHolder["equip" + i]._width = 32;
								gamedisplay.quickEquipHolder["equip" + i]._height = 32;
							}
							gamedisplay.quickEquipHolder["equip" + i]._x = currQuickEquipXPos;
							currQuickEquipXPos += gamedisplay.quickEquipHolder["equip" + i]._width + 5;
						}
						quickEquipVisible = true;
						gamedisplay.quickEquipHolder._visible = true;
						quickEquipCurrent = 0;
					} else {
						// cycle through items:
						gamedisplay.quickEquipHolder["equip" + quickEquipCurrent]._width = 32;
						gamedisplay.quickEquipHolder["equip" + quickEquipCurrent]._height = 32;
						quickEquipCurrent++;
						if (quickEquipCurrent >= allEquippableItems.length) {
							quickEquipCurrent = 0;
						}
						gamedisplay.quickEquipHolder["equip" + quickEquipCurrent]._width = 64;
						gamedisplay.quickEquipHolder["equip" + quickEquipCurrent]._height = 64;
						// reposition items after they've been resized:
					}
				}
				whichkeyreleased = 0;
			} else if (whichkeyreleased == keyaction) {
				// check what item's equipped 
				if (currentlyEquipped[0][0] != 1) {
					var thisEquippedItemsAction = inventoryitems[parseInt(currentlyEquipped[0][0])][6];
					getTileAtArmsReach();
					switch (thisEquippedItemsAction) {
						case "watercarry" :
							// check if next to a water supply, or a tile to add the water to
							if (scrollclip["t_" + armsReachX + "_" + armsReachY].c.indexOf("w") != -1) {
								// fill up water container (ie. set 'wear' to zero):
								currentlyEquipped[0][6] = 0;
							} else {
								if (currentlyEquipped[0][6] < currentlyEquipped[0][3]) {
									// if the item has some uses left check that the tile has been cultivated:
									if (farmTiles[armsReachX][armsReachY][0] == 1) {
										if (addWaterToTile(armsReachX, armsReachY, 0)) {
											// add to changes ######
										}
									}
									currentlyEquipped[0][6] = parseInt(currentlyEquipped[0][6]) + 1;
								}
							}
							updateCurrentlyEquippedItemsWear();
							break;
						case "spade" :
							if (currentlyEquipped[0][6] < currentlyEquipped[0][3]) {
								// check tile at arms reach, if it is a known treasure tile then reveal treasure chest:
								var foundTreasure = -1;
								for (var g = 0; g < currentTreasureMaps.length; g++) {

									var treasureMapRequired = currentTreasureMaps[g][0];

									if (currentTreasureMaps[g][0].indexOf("R") != -1) {
										var randomTreasureMapDetails = currentTreasureMaps[g][0].split("R");
										treasureMapRequired = randomTreasureMapDetails[1];

									}



									if (treasureMapRequired = currentmapnumber) {
										if (currentTreasureMaps[g][1] == armsReachX) {
											if (currentTreasureMaps[g][2] == armsReachY) {
												foundTreasure = g;
												break;
											}
										}
									}
								}
								if (foundTreasure != -1) {
									// remove references to this treasure location:
									var thisMapClip = gamedisplay.treasureMapHolder["map" + currentTreasureMaps[foundTreasure][0] + "_" + currentTreasureMaps[foundTreasure][1] + "_" + currentTreasureMaps[foundTreasure][2]];
									thisMapClip.removeMovieClip();
									// remove map in inventory:
									var thisMapString = currentTreasureMaps[foundTreasure][0] + "|" + currentTreasureMaps[foundTreasure][1] + "|" + currentTreasureMaps[foundTreasure][2];
									var thisMapInvFound = false;
									for (var g = 0; g < inventory.length; g++) {
										if (inventory[g][7] == thisMapString) {
											// remove this item
											inventory[g][0] = 1;
											if (inventorySetIsOpen("iinv")) {
												for (var checkInvClip in gamedisplay.inventorysets.iinv) {
													// check it's an inventory icon:
													if (gamedisplay.inventorysets.iinv[checkInvClip]._name.indexOf("inventoryIcon") != -1) {
														gamedisplay.inventorysets.iinv[checkInvClip].removeMovieClip();
													}
												}
												whicharray = "inventory";
												settoggle = "iinv";
												numberofslotstoadd = currentbagsize;
												populateInventorySet();
											}
											thisMapInvFound = true;
											break;
										}
									}
									if (!thisMapInvFound) {
										for (var g = 0; g < petcarrying.length; g++) {
											if (petcarrying[g][7] == thisMapString) {
												// remove this item
												petcarrying[g][0] = 1;
												if (inventorySetIsOpen("ipet")) {
													for (var checkInvClip in gamedisplay.inventorysets.ipet) {
														// check it's an inventory icon:
														if (gamedisplay.inventorysets.ipet[checkInvClip]._name.indexOf("inventoryIcon") != -1) {
															gamedisplay.inventorysets.ipet[checkInvClip].removeMovieClip();
														}
													}
													whicharray = "petcarrying";
													settoggle = "ipet";
													numberofslotstoadd = petcarrying.length;
													populateInventorySet();
												}
												thisMapInvFound = true;
												break;
											}
										}
									}
									if (!thisMapInvFound) {
										// not found, so must be in player's house or in a chest.
										// put into a queue and check when entering a new map if this map item exists - destroy it if so
										mapsToDestroy.push(currentmapnumber + "|" + armsReachX + "|" + armsReachY);
									}
									currentTreasureMaps.splice(foundTreasure,1);
									// check that this tile has nothing in it:
									var tileIsBlocked = false;
									if (herox == armsReachX) {
										if (heroy == armsReachY) {
											tileIsBlocked = true;
										}
									}
									if (scrollclip.pet.xtile == armsReachX) {
										if (scrollclip.pet.ytile == armsReachY) {
											tileIsBlocked = true;
										}
									}
									if (scrollclip["i_" + armsReachX + "_" + armsReachY]) {
										tileIsBlocked = true;
									}
									for (g in currentnpcs) {
										if (parseInt(currentnpcs[g][3]) == armsReachX) {
											if (parseInt(currentnpcs[g][4]) == armsReachY) {
												tileIsBlocked = true;
												break;
											}
										}
									}
									// populate and create treasure chest item:
									if (!tileIsBlocked) {
										var invArrayRef = 22;
										// create items to reward - between 3 and 5 items:
										var numberOfItems = mfloor(mrand() * 3) + 3;
										var possibleTreasureItems = ["11.10.4.100.4.-1.0.0.0.0", "36.1.4.20.4.-1.0.0.0.0", "30.1.4.20.4.-1.0.0.0.0", "29.1.4.20.4.-1.0.0.0.0", "28.1.4.20.4.-1.0.0.0.0"];
										var treasureItemsString = "";
										var randomItem = mfloor(mrand() * possibleTreasureItems.length);
										treasureItemsString += possibleTreasureItems[randomItem];
										possibleTreasureItems.splice(randomItem,1);
										for (var g = 1; g < numberOfItems; g++) {
											var randomItem = mfloor(mrand() * possibleTreasureItems.length);
											treasureItemsString += "|" + possibleTreasureItems[randomItem];
											possibleTreasureItems.splice(randomItem,1);
										}
										displayitems.push([armsReachX, armsReachY, invArrayRef, 1, 0, treasureItemsString]);
										addtochanges([currentmapnumber, 3, displayitems.length, (displayitems[displayitems.length].join(","))]);
										var itemoffsetx = parseFloat(inventoryitems[invArrayRef][3]);
										var itemoffsety = parseFloat(inventoryitems[invArrayRef][4]);
										var itemgraphic = parseInt(inventoryitems[invArrayRef][5]);
										var counter = calculateobjectdepth((armsReachX + itemoffsetx + armsReachY + itemoffsety) * spacing, (armsReachX + itemoffsetx - armsReachY - itemoffsety) * spacing / 2);
										scrollclip.attachMovie("items","i_" + armsReachX + "_" + armsReachY,counter);
										// init item non-iso position:
										var thisitem = scrollclip["i_" + armsReachX + "_" + armsReachY];
										thisitem.px = ((armsReachX + itemoffsetx) * spacing);
										thisitem.py = ((armsReachY + itemoffsety) * spacing);
										thisitem._x = thisitem.px + thisitem.py;
										thisitem._y = ((thisitem.px) - (thisitem.py)) / 2;
										thisitem.gotoAndStop(itemgraphic);
									} else {
										// reward with money:
										var CashAmount = mfloor(mrand() * 200) + 50;
										money += CashAmount;
										showMoneyReceived(CashAmount);
										updatemoney();
									}
								} else {
									// give small random chance of finding something (less valuable):
									if (mfloor(mrand() * 100) < 5) {
										// opportunity for some colourful (but essentially useless) items - eg. "old boot" etc.
										// or useful items with no uses left in them, but could be repaired
										var possibleTreasureItems = [[11, 10, 4, 100, 4, -1, 0, 0, 0, 0], [36, 1, 4, 20, 4, -1, 0, 0, 0, 0]];
										var randomItem = mfloor(mrand() * possibleTreasureItems.length);
										if (canadditemtoinventory(possibleTreasureItems[randomItem][0], possibleTreasureItems[randomItem][1], possibleTreasureItems[randomItem][2], possibleTreasureItems[randomItem][3], possibleTreasureItems[randomItem][4], possibleTreasureItems[randomItem][5], possibleTreasureItems[randomItem][6], possibleTreasureItems[randomItem][7], possibleTreasureItems[randomItem][8], possibleTreasureItems[randomItem][9], possibleTreasureItems[randomItem][10]) == parseInt(possibleTreasureItems[randomItem][1])) {
											additemtoinventory(possibleTreasureItems[randomItem][0],possibleTreasureItems[randomItem][1],possibleTreasureItems[randomItem][2],possibleTreasureItems[randomItem][3],possibleTreasureItems[randomItem][4],possibleTreasureItems[randomItem][5],possibleTreasureItems[randomItem][6],possibleTreasureItems[randomItem][7],possibleTreasureItems[randomItem][8],possibleTreasureItems[randomItem][9],possibleTreasureItems[randomItem][10]);
											showItemAddedAnimation(possibleTreasureItems[randomItem][0]);
										} else {
											// reward with small amount money:
											var CashAmount = mfloor(mrand() * 18) + 2;
											money += CashAmount;
											showMoneyReceived(CashAmount);
											updatemoney();
										}
									}
								}
								// increase usage
								currentlyEquipped[0][6] = parseInt(currentlyEquipped[0][6]) + 1;
								updateCurrentlyEquippedItemsWear();
							}
							break;
						case "hoe" :
							if (currentlyEquipped[0][6] < currentlyEquipped[0][3]) {
								if (farmTiles[armsReachX][armsReachY][0] != "-") {
									// check it's not an underwater farm tile:
									if (farmTiles[armsReachX][armsReachY][1] < 5) {
										// check if this is already cultivated:
										if (farmTiles[armsReachX][armsReachY][0] == 0) {
											farmTiles[armsReachX][armsReachY][0] = 1;
											// change tile graphic:
											scrollclip["t_" + armsReachX + "_" + armsReachY].gotoAndStop("cultivated");
											scrollclip["t_" + armsReachX + "_" + armsReachY].cultivated.gotoAndStop(1);
											// add to changes ######
										} else {
											// remove any plants on this tile:
											if (scrollclip["i_" + armsReachX + "_" + armsReachY]) {
												for (g in displayitems) {
													if (parseInt(displayitems[g][0]) == armsReachX) {
														if (parseInt(displayitems[g][1]) == armsReachY) {
															displayitems.splice(g,1);
															addtochanges([currentmapnumber, 3, g, -1]);
															// item index now the item has been removed from the array, so it will need to be reduced by 1 accordingly:
															if (g < parseInt(familiarfoundindex)) {
																familiarfoundindex = parseInt(familiarfoundindex) - 1;
															}
															break;
														}
													}
												}
												scrollclip["i_" + armsReachX + "_" + armsReachY].removeMovieClip();
											}
										}
									}
								}
								// increase usage                                                                                                                 
								currentlyEquipped[0][6] = parseInt(currentlyEquipped[0][6]) + 1;
								updateCurrentlyEquippedItemsWear();
							}
							break;
						case "pollen" :
							// check that it is a player planted plant on this tile
							for (g in displayitems) {
								if (displayitems[g][0] == armsReachX) {
									if (displayitems[g][1] == armsReachY) {
										if (inventoryitems[(displayitems[g][2])][2].indexOf("k") != -1) {
											// check it's at the right growth stage to be pollinated:
											if ((determinePlantGrowthStage(displayitems[g][6]) > 0) && determinePlantGrowthStage(displayitems[g][6] < 4)) {
												// check it's not already pollinated:
												if (displayitems[g][7] > 0) {
													displayitems[g][7] = currentlyEquipped[0][0];
													displayitems[g][8] = currentlyEquipped[0][7];
													// ############# add to changes
													// see if there's any identical pollen to use from inv:
													reEquipItemFromInv();
												}
											}
										}
									}
								}
							}
							break;
						case "seed" :
							// check tile has been cultivated:
							if (farmTiles[armsReachX][armsReachY][0] == 1) {
								// check that plant (or a placeholder for a plant exists here) :
								var plantAlreadyExistsHere = false;
								for (g in displayitems) {
									if (displayitems[g][0] == armsReachX) {
										if (displayitems[g][1] == armsReachY) {
											plantAlreadyExistsHere = true;
											break;
										}
									}
								}
								if (!plantAlreadyExistsHere) {
									var thisNewSeedType = inventoryitems[parseInt(currentlyEquipped[0][0])][7];
									displayitems.push([armsReachX, armsReachY, thisNewSeedType, 1, 0, minutesplayed, 0]);
									addtochanges([currentmapnumber, 3, displayitems.length, (displayitems[displayitems.length].join(","))]);
									// see if there's any identical seeds to use from inv:
									reEquipItemFromInv();
								}
							}
							break;
						default :
							// do nothing
					}
					whichkeyreleased = 0;
				}
			}
			// clear key press now that there's definitely been a whole loop to act on it:                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
			if (keyhasbeenpressed > 0) {
				whichkeyreleased = 0;
			}
			// check if quick equip is open and the action has now been released:                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
			if (quickEquipVisible) {
				if (!(Key.isDown(keyaction))) {
					if (quickEquipCurrent > 0) {
						// if something other than the currently equipped icon is picked:
						fromarray = allEquippableItems[quickEquipCurrent][0];
						droparray = "currentlyEquipped";
						fromWhichArraySlot = allEquippableItems[quickEquipCurrent][1];
						doubleClickEquip = true;
						if (fromarray == "inventory") {
							// if inventory isn't open, then this clip doesn't exist, so invisibly populate the inventory
							if (!inventorySetIsOpen("iinv")) {
								whicharray = "inventory";
								settoggle = "iinv";
								numberofslotstoadd = currentbagsize;
								populateInventorySet();
							}
							processEquipping(gamedisplay.inventorysets.iinv["inventoryIcon" + fromWhichArraySlot]);
							if (!inventorySetIsOpen("iinv")) {
								// if inventory not open, now remove inventory clips:
								for (var checkInvClip in gamedisplay.inventorysets.iinv) {
									// check it's an inventory icon:
									if (gamedisplay.inventorysets.iinv[checkInvClip]._name.indexOf("inventoryIcon") != -1) {
										gamedisplay.inventorysets.iinv[checkInvClip].removeMovieClip();
									}
								}
							}
						} else {
							// has come from pet carrying
							// if inventory isn't open, then this clip doesn't exist, so invisibly populate the inventory
							if (!inventorySetIsOpen("ipet")) {
								whicharray = "petcarrying";
								settoggle = "ipet";
								numberofslotstoadd = petcarrying.length;
								populateInventorySet();
							}
							processEquipping(gamedisplay.inventorysets.ipet["inventoryIcon" + fromWhichArraySlot]);
							if (!inventorySetIsOpen("ipet")) {
								// if inventory not open, now remove inventory clips:
								for (var checkInvClip in gamedisplay.inventorysets.ipet) {
									// check it's an inventory icon:
									if (gamedisplay.inventorysets.ipet[checkInvClip]._name.indexOf("inventoryIcon") != -1) {
										gamedisplay.inventorysets.ipet[checkInvClip].removeMovieClip();
									}
								}
							}
						}
					}
					// remove all clips                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
					for (var checkquickEquipClip in gamedisplay.quickEquipHolder) {
						gamedisplay.quickEquipHolder[checkquickEquipClip].removeMovieClip();
					}
					gamedisplay.quickEquipHolder._visible = false;
					quickEquipVisible = false;
				}
			}
			internaltimer++;
			if (internaltimer % 20 == 0) {
				// ie. frame rate x 60 (should be 720 frames a minute)
				internaltimer = 0;
				minutesplayed++;

				checkFarm();
			}


			if (internaltimer % 50 == 0) {
				checkForCatalogueQuestItemsNearby();
			}


			if (npcsLookingForPaths.length > 0) {

				npcFindNextNode();
			}

			updateTargetting();
		}
		if (isCrafting) {
			craftItem();
		}
	}
}
// 
function checkPet() {
	// check for breadcrumb - only if moving towards hero:
	if (((petstate == 1) && (!(isinrange(scrollclip.hero.px, scrollclip.hero.py, scrollclip.pet.px, scrollclip.pet.py, (spacing * 2))))) || (petstate == 4)) {
		var petcrumbtrailfound:Boolean = false;
		scrollclip.pet.xdir = 0;
		scrollclip.pet.ydir = 0;
		var petxtile:Number = scrollclip.pet.xtile;
		var petytile:Number = scrollclip.pet.ytile;
		for (var i = 0; i < breadcrumblength; i++) {
			if ((petytile) == breadcrumby[i]) {
				if ((petxtile - 1) == breadcrumbx[i]) {
					scrollclip.pet.xdir = -1;
					petcrumbtrailfound = true;
					break;
				} else if ((petxtile + 1) == breadcrumbx[i]) {
					scrollclip.pet.xdir = 1;
					petcrumbtrailfound = true;
					break;
				}
			} else if ((petxtile) == breadcrumbx[i]) {
				if ((petytile + 1) == breadcrumby[i]) {
					scrollclip.pet.ydir = 1;
					petcrumbtrailfound = true;
					break;
				} else if ((petytile - 1) == breadcrumby[i]) {
					scrollclip.pet.ydir = -1;
					petcrumbtrailfound = true;
					break;
				}
			}
		}
		if (petcrumbtrailfound) {
			petismoving = true;
			scrollclip.pet.gotoAndStop((scrollclip.pet.xdir) + (scrollclip.pet.ydir) * 2 + 3);
			scrollclip.pet.petclip.play();
			// in case pet was following path - change state to following breadcrumb:
			petstate = 1;
		} else if (petstate == 4) {
			// no breadcrumb found, but has a path:
			if (foundpetpathx.length > 0) {
				var nextpettilex:Number = foundpetpathx.shift();
				var nextpettiley:Number = foundpetpathy.shift();
				// find direction from path:
				scrollclip.pet.xdir = 0;
				scrollclip.pet.ydir = 0;
				// get next tile from array:
				if ((scrollclip.pet.ytile) == nextpettiley) {
					if ((scrollclip.pet.xtile - 1) == nextpettilex) {
						scrollclip.pet.xdir = -1;
					} else if ((scrollclip.pet.xtile + 1) == nextpettilex) {
						scrollclip.pet.xdir = 1;
					}
				} else if ((scrollclip.pet.xtile) == nextpettilex) {
					if ((scrollclip.pet.ytile + 1) == nextpettiley) {
						scrollclip.pet.ydir = 1;
					} else if ((scrollclip.pet.ytile - 1) == nextpettiley) {
						scrollclip.pet.ydir = -1;
					}
				}
				petismoving = true;
				scrollclip.pet.gotoAndStop((scrollclip.pet.xdir) + (scrollclip.pet.ydir) * 2 + 3);
				scrollclip.pet.petclip.play();
			} else {
				// reached the end of the path and no breadcrumb found - do pathfinding again:
				petismoving = false;
				petstate = 3;
				findPath(scrollclip.pet.xtile,scrollclip.pet.ytile,herox,heroy,false);
			}
		} else {
			// breadcrumb has faded:
			petismoving = false;
			petstate = 3;
			findPath(scrollclip.pet.xtile,scrollclip.pet.ytile,herox,heroy,false);
		}
	} else {
		scrollclip.pet.petclip.stop();
	}
}
//
function determineResponse() {
	if (responsePointerIndex == 0) {
		if (confirmAction == "confirmingItemDrop") {
			// drop item:
			if (!(quantitysplit)) {
				// remove item:
				if (storedRefID == "overflow") {
					_root.storedCraftedItem[0] = "1";
					gamedisplay.inventorysets.icrafting.overflowSlot.inventoryIconOverflow.removeMovieClip();
				} else {
					this[fromarray][storedRefID][0] = "1";
					gamedisplay.inventorysets[storedSetRef]["inventoryIcon" + storedRefID].removeMovieClip();
				}
			} else {
				gamedisplay.inventorysets[storedSetRef]["inventoryIcon" + storedRefID].removeMovieClip();
			}
			gamedisplay.dialoguebox._visible = false;
			dialogueboxdisplayed = false;
			confirmAction = "";
			//
			quantitysplit = false;
		} else if (confirmAction == "confirmingMakeItem") {
			inventoryclicked = -1;
			gamedisplay.dialoguebox._visible = false;
			dialogueboxdisplayed = false;
			// remove required items from inv:
			var tempreqarray:Array = new Array();
			for (var i = 0; i < makeitemreqarray.length; i++) {
				// check for money being a requirement:
				if (makeitemreqarray[i].indexOf("£") != -1) {
					money -= parseInt(makeitemreqarray[i]);
				} else {
					tempreqarray = makeitemreqarray[i].split(".");
					removeitemfrominventory(parseInt(tempreqarray[1]),parseInt(tempreqarray[0]));
				}
			}
			updatemoney();
			for (var i = 0; i < currentbagsize; i++) {
				gamedisplay.inventorysets["iinv"]["slot" + i].contents.gotoAndStop(parseInt(inventory[i][0]));
				if (inventory[i][0] != "1") {
					gamedisplay.inventorysets["iinv"]["slot" + i].quan.text = parseInt(inventory[i][1]);
				} else {
					gamedisplay.inventorysets["iinv"]["slot" + i].quan.text = " ";
				}
			}
			// store the item being made:
			var planitemcode:String = (inventoryitems[parseInt(currentplans[highlightcurrent + 1])][2]);
			var planitemindex:Number = parseInt(planitemcode.substring(planitemcode.indexOf("r") + 1));
			currentplans[0] = planitemindex;
			addtochanges([currentmapnumber, 5, 0, planitemindex]);
			// add item name to dialogue:
			scrollclip.dialogue[0] = "here's your " + inventoryitems[planitemindex][0];
			scrollclip["n_0"].speechcounter = 0;
			scrollclip["n_0"].isSpeaking = false;
			// add the 'is ready' speech to the NPC's dialogue array:
			currentnpcs[0].splice(NPCStartSpeechIndex,0,2);
			addtochanges([currentmapnumber, 1, 0, (currentnpcs[0].join(","))]);
			// close all inventory panels:
			for (var i = 0; i < setsopen.length; i++) {
				gamedisplay.inventorysets[setsopen[i][0]]._visible = false;
			}
			setsopen = [];
			gamedisplay.inventorysets._visible = false;
			handCursor.inventoryToolTip._visible = false;
			waitingforinventory = false;
			confirmAction = "";
		} else if (confirmAction == "confirmingItemCombine") {
			// accept item combining:
			confirmAction = "";
			gamedisplay.dialoguebox._visible = false;
			dialogueboxdisplayed = false;
			// set dragged to array entry to new combined item:
			if (quantitysplit) {
				quantitysplit = false;
				// if enchantments match, then use that, if not, set no enchantment
				if (this[droparray][toWhichArraySlot][8] == this[fromarray][splitParentItem][8]) {
					var newEnchantment = this[droparray][toWhichArraySlot][8];
				} else {
					var newEnchantment = 0;
				}
				coloursToMix = [this[droparray][toWhichArraySlot][7], this[fromarray][splitParentItem][7]];
				var newColour = mixColours();
				var newQuantity = _root[droparray][toWhichArraySlot][1];
				var itemQuality = mfloor((parseInt(this[droparray][toWhichArraySlot][2]) + parseInt(this[fromarray][splitParentItem][2])) / 2);
				var itemDurability = mfloor((parseInt(this[droparray][toWhichArraySlot][3]) + parseInt(this[fromarray][splitParentItem][3])) / 2);
				var itemEffectiveness = mfloor((parseInt(this[droparray][toWhichArraySlot][4]) + parseInt(this[fromarray][splitParentItem][4])) / 2);
				// combined item type, same quantity as each parent, averages of attributes, not wrapped,  combined colour and hallmark of player
				this[droparray][toWhichArraySlot] = [itemsCombineToMake, newQuantity, itemQuality, itemDurability, itemEffectiveness, -1, 0, newColour, newEnchantment, charnumber];
				// remove dragged icon
				if (storedRefID == "overflow") {
					gamedisplay.inventorysets.icrafting.overflowSlot.inventoryIconOverflow.removeMovieClip();
				} else {
					gamedisplay.inventorysets[storedSetRef]["inventoryIcon" + storedRefID].removeMovieClip();
				}
			} else {
				// if enchantments match, then use that, if not, set no enchantment
				if (this[droparray][toWhichArraySlot][8] == this[fromarray][storedRefID][8]) {
					var newEnchantment = this[droparray][toWhichArraySlot][8];
				} else {
					var newEnchantment = 0;
				}
				coloursToMix = [this[droparray][toWhichArraySlot][7], this[fromarray][storedRefID][7]];
				var newColour = mixColours();
				var newQuantity = _root[droparray][toWhichArraySlot][1];
				var itemQuality = mfloor((parseInt(this[droparray][toWhichArraySlot][2]) + parseInt(this[fromarray][storedRefID][2])) / 2);
				var itemDurability = mfloor((parseInt(this[droparray][toWhichArraySlot][3]) + parseInt(this[fromarray][storedRefID][3])) / 2);
				var itemEffectiveness = mfloor((parseInt(this[droparray][toWhichArraySlot][4]) + parseInt(this[fromarray][storedRefID][4])) / 2);
				var itemInscription = "-";
				if (this[droparray][toWhichArraySlot][10] == this[fromarray][storedRefID][10]) {
					itemInscription = this[droparray][toWhichArraySlot][10];
				}
				// combined item type, same quantity as each parent, averages of attributes, not wrapped,  combined colour and hallmark of player, inscription if both are identical                                                                                                                                                                                                                                                                                                 
				this[droparray][toWhichArraySlot] = [itemsCombineToMake, newQuantity, itemQuality, itemDurability, itemEffectiveness, -1, 0, newColour, newEnchantment, charnumber, itemInscription];
				// remove dragged array entry 
				this[fromarray][storedRefID][0] = "1";
				// remove dragged icon
				if (storedRefID == "overflow") {
					gamedisplay.inventorysets.icrafting.overflowSlot.inventoryIconOverflow.removeMovieClip();
				} else {
					gamedisplay.inventorysets[storedSetRef]["inventoryIcon" + storedRefID].removeMovieClip();
				}
			}
			// remove dragged over icon:
			thisDroppedOverIcon.removeMovieClip();
			// attach new combined item
			attachSingleInvIcon(storedSetRef,toWhichArraySlot);
		} else if (confirmAction == "confirmingLotteryPurchase") {
			confirmAction = "";
			if (money > 5) {
				openLotteryTicket();
			} else {
				// display can't afford ticket text:
				displaytext(thisLotterySpeech[6],whosaiditindex,true);
			}
		} else if (challengeissued) {
			// accept card game :
			cardchallenger = whosaiditindex;
			challengeissued = false;
			gamedisplay.dialoguebox._visible = false;
			dialogueboxdisplayed = false;
			gamedisplay.cardGame.gotoAndPlay(2);
		} else if (gamedisplay.responsebox.responses[0] == "WORKSHOP") {
			openWorkshop();
		} else if (gamedisplay.responsebox.responses[0] == "SHOP") {
			openShop();
		} else if (gamedisplay.responsebox.responses[0] == "POST") {
			createMessage(true);
		} else {
			displaytext(gamedisplay.responsebox.responses[0],whosaiditindex,true);
		}
	} else if (responsePointerIndex == 1) {
		if (gamedisplay.responsebox.responses[1] == "SHOP") {
			openShop();
		} else if (gamedisplay.responsebox.responses[1] == "WORKSHOP") {
			openWorkshop();
		} else if (gamedisplay.responsebox.responses[1] == "POST") {
			createMessage(true);
		} else if (confirmAction == "confirmingItemDrop") {
			// don't drop item
			confirmAction = "";
			gamedisplay.dialoguebox._visible = false;
			dialogueboxdisplayed = false;
			if (quantitysplit) {
				// restore the split quantity to its original slot:
				_root[fromarray][splitParentItem][1] += beingmovedquantity;
				gamedisplay.inventorysets[storedSetRef]["inventoryIcon" + splitParentItem].quan.text = parseInt(_root[fromarray][splitParentItem][1]);
				gamedisplay.inventorysets[storedSetRef]["inventoryIcon" + storedRefID].removeMovieClip();
			} else {
				if (storedRefID == "overflow") {
					gamedisplay.inventorysets.icrafting.overflowSlot.inventoryIconOverflow._x = gamedisplay.inventorysets.icrafting.overflowSlot.inventoryIconOverflow.xorigin;
					gamedisplay.inventorysets.icrafting.overflowSlot.inventoryIconOverflow._y = gamedisplay.inventorysets.icrafting.overflowSlot.inventoryIconOverflow.yorigin;
					// reset original:
					gamedisplay.inventorysets.icrafting.overflowSlot.inventoryIconOverflow._visible = true;
				} else {
					gamedisplay.inventorysets[storedSetRef]["inventoryIcon" + storedRefID]._x = gamedisplay.inventorysets[storedSetRef]["inventoryIcon" + storedRefID].xorigin;
					gamedisplay.inventorysets[storedSetRef]["inventoryIcon" + storedRefID]._y = gamedisplay.inventorysets[storedSetRef]["inventoryIcon" + storedRefID].yorigin;
					// reset original:
					gamedisplay.inventorysets[storedSetRef]["inventoryIcon" + storedRefID]._visible = true;
				}
			}
			quantitysplit = false;
		} else if (confirmAction == "confirmingItemCombine") {
			// don't combine items
			confirmAction = "";
			gamedisplay.dialoguebox._visible = false;
			dialogueboxdisplayed = false;
			if (quantitysplit) {
				// restore the split quantity to its original slot:
				_root[fromarray][splitParentItem][1] += beingmovedquantity;
				gamedisplay.inventorysets[storedSetRef]["inventoryIcon" + splitParentItem].quan.text = parseInt(_root[fromarray][splitParentItem][1]);
				gamedisplay.inventorysets[storedSetRef]["inventoryIcon" + storedRefID].removeMovieClip();
			} else {
				if (storedRefID == "overflow") {
					gamedisplay.inventorysets.icrafting.overflowSlot.inventoryIconOverflow._x = gamedisplay.inventorysets.icrafting.overflowSlot.inventoryIconOverflow.xorigin;
					gamedisplay.inventorysets.icrafting.overflowSlot.inventoryIconOverflow._y = gamedisplay.inventorysets.icrafting.overflowSlot.inventoryIconOverflow.yorigin;
					// reset original:
					gamedisplay.inventorysets.icrafting.overflowSlot.inventoryIconOverflow._visible = true;
				} else {
					gamedisplay.inventorysets[storedSetRef]["inventoryIcon" + storedRefID]._x = gamedisplay.inventorysets[storedSetRef]["inventoryIcon" + storedRefID].xorigin;
					gamedisplay.inventorysets[storedSetRef]["inventoryIcon" + storedRefID]._y = gamedisplay.inventorysets[storedSetRef]["inventoryIcon" + storedRefID].yorigin;
					// reset original:
					gamedisplay.inventorysets[storedSetRef]["inventoryIcon" + storedRefID]._visible = true;
				}
			}
			quantitysplit = false;
		} else if (confirmAction == "confirmingMakeItem") {
			confirmAction = "";
			gamedisplay.dialoguebox._visible = false;
			dialogueboxdisplayed = false;
			inventoryclicked = -1;
		} else if (confirmAction == "confirmingItemSale") {
			/*
			confirmAction = "";
			// --- gamedisplay.inventorysets.highlightbox.beingmoved._visible = false;
			inventoryclicked = -1;
			gamedisplay.dialoguebox._visible = false;
			dialogueboxdisplayed = false;
			// populate inventory with current state (in case of a split quantity, the full quantity needs restoring):
			for (var i = 0; i<currentbagsize; i++) {
			gamedisplay.inventorysets["iinv"]["slot"+i].contents.gotoAndStop(parseInt(inventory[i][0]));
			if (inventory[i][0] != "1") {
			gamedisplay.inventorysets["iinv"]["slot"+i].quan.text = parseInt(inventory[i][1]);
			} else {
			gamedisplay.inventorysets["iinv"]["slot"+i].quan.text = " ";
			}
			}
			*/
		} else if (confirmAction == "confirmingLotteryPurchase") {
			// display refusal text:
			confirmAction = "";
			displaytext(thisLotterySpeech[2],whosaiditindex,true);
		} else {
			displaytext(gamedisplay.responsebox.responses[1],whosaiditindex,true);
			challengeissued = false;
		}
	} else {
		displaytext(gamedisplay.responsebox.responses[responsePointerIndex],whosaiditindex,true);
	}
}
//
function activateBoat() {
	isOnBoat = true;
	// change map in memory to be that of the boat:
	currentmap = scrollclip.boatmap;
	maplengthx = currentmap[0].length;
	maplengthy = currentmap.length;
	//
	var newtilex:Number;
	var newtiley:Number;
	var newtilearray:Array;
	// remove all non-boat tiles:
	var tx:Number = herox - visx - 3;
	// -3 to be 1 below the range of the loop
	while (++tx <= (herox + visx + 2)) {
		var ty:Number = (heroy - visy - 3);
		while (++ty <= (heroy + visy + 2)) {
			// if tile exists, remove it, and any items on it
			var thistilename = scrollclip["t_" + tx + "_" + ty];
			var boatproperty = thistilename.b;
			if (boatproperty == "0") {
				removeMovieClip(thistilename);
			} else {
				if (thistilename) {
					// split x and y coord of this tile
					newtilearray = boatproperty.split("|");
					newtilex = parseInt(newtilearray[0]);
					newtiley = parseInt(newtilearray[1]);
					thistilename._x = spacing * (newtilex + newtiley);
					thistilename._y = (spacing / 2 * (newtilex - newtiley));
					//gamedisplay.xmlmessage = thistilename._y;
					// get new depth:
					counter = calculateobjectdepth(((spacing * (newtilex + newtiley)) + 1), (spacing / 2 * (newtilex - newtiley)));
					thistilename.swapDepths(counter);
					// rename this tile:
					// check if the new name tile already exists, and remove it if so:
					if (scrollclip["t_" + newtilex + "_" + newtiley]) {
						removeMovieClip(scrollclip["t_" + newtilex + "_" + newtiley]);
					}
					thistilename._name = "t_" + newtilex + "_" + newtiley;
				}
			}
		}
	}
	// reposition scrollclip
	scrollclipwidth = (maplengthx + maplengthy) * spacing;
	// get new herox, heroy
	herox -= scrollclip.boatXOffset;
	heroy -= scrollclip.boatYOffset;
	//
	calculatescrolloffset((maplengthx - 1) / 2,(maplengthy - 1) / 2,herox,heroy);
	scrollclip._x = 400 - (scrollclipwidth / 2) + buildxoffset;
	scrollclip._y = 240 + buildyoffset;
	weatherclip._x = 400 - (scrollclipwidth / 2) + buildxoffset;
	weatherclip._y = 240 + buildyoffset;
	// position the hero on the new tile, at the same distance across the tile that they were on previously
	scrollclip.hero.px = (herox * spacing) + (scrollclip.hero.px % spacing);
	scrollclip.hero.py = (heroy * spacing) + (scrollclip.hero.py % spacing);
	scrollclip.hero._x = (scrollclip.hero.px) + (scrollclip.hero.py);
	scrollclip.hero._y = ((scrollclip.hero.px) - (scrollclip.hero.py)) / 2;
	initialheight = heightgained;
	heightchange = initialheight;
	previousoffset = initialheight;
	scrollclip.hero._y -= initialheight;
	//
	// calculate hero's depth based on its centre
	depthsorttargettilex = herox;
	depthsorttargettiley = heroy;
	// (the start tile will be raised)
	var herorightcoord:Number = (scrollclip.hero.px) + (herowidth / 2);
	var herobottomcoord:Number = (scrollclip.hero.py) - (heroheight / 2);
	herobottomrightx = findtilenumber(herorightcoord, herobottomcoord, "x");
	herobottomrighty = findtilenumber(herorightcoord, herobottomcoord, "y");
	var tileoffsetstr:String = String(scrollclip["t_" + herobottomrightx + "_" + herobottomrighty].h);
	var thistileoffset:Number = parseInt(tileoffsetstr);
	if (thistileoffset <= initialheight) {
		// (the bottom right tile will be raised as well)
		depthsorttargettilex = herobottomrightx;
		depthsorttargettiley = herobottomrighty;
	}
	scrollclip.hero.swapDepths(scrollclip["t_" + depthsorttargettilex + "_" + depthsorttargettiley].getDepth() + 1);
	//
	oldheroposx = scrollclip.hero._x;
	oldheroposy = scrollclip.hero._y;
	//
	if (haspet) {
		// ####################
		// reposition pet as well
	}
	//                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
	// move any crew on the boat if there are any
	// crew npc indexes must remain consistent, so they need to be before (in the array) any npcs that might be removed
	for (var g = 0; g < scrollclip.crew.length; g++) {
		thisnpc = scrollclip["n_" + g];
		thisnpc.xtile -= scrollclip.boatXOffset;
		thisnpc.ytile -= scrollclip.boatYOffset;
		thisnpc.px = (thisnpc.xtile * spacing) + (thisnpc.xtile % spacing);
		thisnpc.py = (thisnpc.ytile * spacing) + (thisnpc.ytile % spacing);
		thisnpc._x = (thisnpc.px) + (thisnpc.py);
		thisnpc._y = ((thisnpc.xtile.px) - (thisnpc.xtile.py)) / 2;
		thisnpc.swapDepths(scrollclip["t_" + thisnpc.xtile + "_" + thisnpc.ytile].getDepth() + 1);
	}
}
//
function displayFromWorldCoordX(displayx) {
	// convert world screen coords to display screen coords:
	return (displayx - scrollclip.hero._x + 330);
}
function displayFromWorldCoordY(displayy) {
	return (displayy - scrollclip.hero._y - 2);
}
function movePetAway() {
	// check if pet is already trying to get out of hero's way before altering pet's course:
	// unless pet is moving directly opposite to hero, in which case, turn pet around
	if (!(petismovingawayfromhero) || ((scrollclip.pet.xdir == (storedxdir * -1)) && (scrollclip.pet.ydir == (storedydir * -1)))) {
		// need to get pet to move away from hero - so move in direction hero is facing if that way is clear.
		// check destination tiles:
		var petproposedmovex:Number = storedxdir;
		var petproposedmovey:Number = storedydir;
		var petproposedtilex:Number = scrollclip.pet.xtile + petproposedmovex;
		var petproposedtiley:Number = scrollclip.pet.ytile + petproposedmovey;
		// check that the terrain is walkable and there is no item there:
		// use islocationproperty(4 ... instead of pet's usual 2 to avoid doors and terrain height
		if ((islocationproperty(4, petproposedtilex, petproposedtiley)) && (!(scrollclip["i_" + petproposedtilex + "_" + petproposedtiley]))) {
			// is ok
		} else {
			// check to the side of that facing:
			if (petproposedmovex != 0) {
				petproposedmovex = 0;
				petproposedmovey = 1;
				petproposedtilex = scrollclip.pet.xtile + petproposedmovex;
				petproposedtiley = scrollclip.pet.ytile + petproposedmovey;
				if ((islocationproperty(4, petproposedtilex, petproposedtiley)) && (!(scrollclip["i_" + petproposedtilex + "_" + petproposedtiley]))) {
					// is ok
				} else {
					// check the other side:
					petproposedmovey = -1;
					petproposedtilex = scrollclip.pet.xtile + petproposedmovex;
					petproposedtiley = scrollclip.pet.ytile + petproposedmovey;
					if ((islocationproperty(4, petproposedtilex, petproposedtiley)) && (!(scrollclip["i_" + petproposedtilex + "_" + petproposedtiley]))) {
						// is ok
					} else {
						// turn around:
						petproposedmovex = storedxdir * (-1);
						petproposedmovey = storedydir * (-1);
					}
				}
			} else {
				petproposedmovex = 1;
				petproposedmovey = 0;
				petproposedtilex = scrollclip.pet.xtile + petproposedmovex;
				petproposedtiley = scrollclip.pet.ytile + petproposedmovey;
				if ((islocationproperty(4, petproposedtilex, petproposedtiley)) && (!(scrollclip["i_" + petproposedtilex + "_" + petproposedtiley]))) {
					// is ok
				} else {
					// check the other side:
					petproposedmovex = -1;
					petproposedtilex = scrollclip.pet.xtile + petproposedmovex;
					petproposedtiley = scrollclip.pet.ytile + petproposedmovey;
					if ((islocationproperty(4, petproposedtilex, petproposedtiley)) && (!(scrollclip["i_" + petproposedtilex + "_" + petproposedtiley]))) {
						// is ok
					} else {
						// turn around:
						petproposedmovex = storedxdir * (-1);
						petproposedmovey = storedydir * (-1);
					}
				}
			}
		}
		//   
		scrollclip.pet.xdir = petproposedmovex;
		scrollclip.pet.ydir = petproposedmovey;
		petismoving = true;
		petismovingawayfromhero = true;
		scrollclip.pet.gotoAndStop((scrollclip.pet.xdir) + (scrollclip.pet.ydir) * 2 + 3);
		scrollclip.pet.petclip.play();
	}
}
//
function dropBreadcrumb() {
	breadcrumbx.pop();
	breadcrumbx.unshift(herox);
	breadcrumby.pop();
	breadcrumby.unshift(heroy);
}
//
function updatePrints(whichSprite) {
	if (whichSprite == "hero") {
		// make sure that a footprint hasn't already been dropped here (if standing still):
		if (!((lastHeroPrintx == scrollclip.hero._x) && (lastHeroPrinty == scrollclip.hero._y))) {
			// fade the print before this one:
			var lastHeroPrint = currentHeroPrints - 1;
			if (lastHeroPrint == -1) {
				lastHeroPrint = numberOfFootprints - 1;
			}
			// make sure it hasn't already faded: ('holdFade' is on frame 2)                                                                                                                                                                                                        
			if (scrollclip.tileOverlay["heroPrints" + lastHeroPrint].fade._currentFrame == 2) {
				scrollclip.tileOverlay["heroPrints" + lastHeroPrint].fade.gotoAndPlay("startFade");
			}
			// check this tile has snow:                                                                                                                                                                                                          
			if (scrollclip["t_" + herox + "_" + heroy].t == 1) {
				scrollclip.tileOverlay["heroPrints" + currentHeroPrints]._x = scrollclip.hero._x;
				scrollclip.tileOverlay["heroPrints" + currentHeroPrints]._y = scrollclip.hero._y;
				scrollclip.tileOverlay["heroPrints" + currentHeroPrints].gotoAndStop(storedxdir + storedydir * 2 + 3);
				scrollclip.tileOverlay["heroPrints" + currentHeroPrints].fade.gotoAndStop("holdFade");
				scrollclip.tileOverlay["heroPrints" + currentHeroPrints].swapDepths(scrollclip.tileOverlay.getNextHighestDepth());
				currentHeroPrints++;
				if (currentHeroPrints == numberOfFootprints) {
					currentHeroPrints = 0;
				}
			}
			lastHeroPrintx = scrollclip.hero._x;
			lastHeroPrinty = scrollclip.hero._y;
		}
	} else if (whichSprite == "pet") {
		if (!((lastPetPrintx == scrollclip.pet._x) && (lastPetPrinty == scrollclip.pet._y))) {
			var lastPetPrint = currentPetPrints - 1;
			if (lastPetPrint == -1) {
				lastPetPrint = numberOfFootprints - 1;
			}
			if (scrollclip.tileOverlay["petPrints" + lastPetPrint].fade._currentFrame == 2) {
				scrollclip.tileOverlay["petPrints" + lastPetPrint].fade.gotoAndPlay("startFade");
			}
			// don't need check hasPet here as this is only called from movePet                                                                                                                                                                                                         
			if (scrollclip["t_" + scrollclip.pet.xtile + "_" + scrollclip.pet.ytile].t == 1) {
				scrollclip.tileOverlay["petPrints" + currentPetPrints]._x = scrollclip.pet._x;
				scrollclip.tileOverlay["petPrints" + currentPetPrints]._y = scrollclip.pet._y;
				scrollclip.tileOverlay["petPrints" + currentPetPrints].gotoAndStop(scrollclip.pet.xdir + scrollclip.pet.ydir * 2 + 3);
				scrollclip.tileOverlay["petPrints" + currentPetPrints].fade.gotoAndStop("holdFade");
				scrollclip.tileOverlay["petPrints" + currentPetPrints].swapDepths(scrollclip.tileOverlay.getNextHighestDepth());
				currentPetPrints++;
				if (currentPetPrints == numberOfFootprints) {
					currentPetPrints = 0;
				}
			}
			lastPetPrintx = scrollclip.pet._x;
			lastPetPrinty = scrollclip.pet._y;
		}
	} else {
		// is an npc, use this index from the array to get current values:
		// npcPrints = [[currentIndex], [lastPrintX], [lastPrintY]]
		var currentNPCPrint = npcPrints[whichSprite][0];
		if (!((npcPrints[whichSprite][1] == scrollclip["n_" + whichSprite]._x) && (npcPrints[whichSprite][2] == scrollclip["n_" + whichSprite]._y))) {
			var lastNPCPrint = currentNPCPrint - 1;
			if (lastNPCPrint == -1) {
				lastNPCPrint = numberOfFootprints - 1;
			}
			if (scrollclip.tileOverlay["npcPrints" + whichSprite + "_" + lastNPCPrint].fade._currentFrame == 2) {
				scrollclip.tileOverlay["npcPrints" + whichSprite + "_" + lastNPCPrint].fade.gotoAndPlay("startFade");
			}
			// don't need check hasPet here as this is only called from movePet                                                                                                                                                                                                         
			if (scrollclip["t_" + scrollclip["n_" + whichSprite].xtile + "_" + scrollclip["n_" + whichSprite].ytile].t == 1) {
				scrollclip.tileOverlay["npcPrints" + whichSprite + "_" + currentNPCPrint]._x = scrollclip["n_" + whichSprite]._x;
				scrollclip.tileOverlay["npcPrints" + whichSprite + "_" + currentNPCPrint]._y = scrollclip["n_" + whichSprite]._y;
				scrollclip.tileOverlay["npcPrints" + whichSprite + "_" + currentNPCPrint].gotoAndStop(scrollclip["n_" + whichSprite].xdir + scrollclip["n_" + whichSprite].ydir * 2 + 3);
				scrollclip.tileOverlay["npcPrints" + whichSprite + "_" + currentNPCPrint].fade.gotoAndStop("holdFade");
				scrollclip.tileOverlay["npcPrints" + whichSprite + "_" + currentNPCPrint].swapDepths(scrollclip.tileOverlay.getNextHighestDepth());
				npcPrints[whichSprite][0]++;
				if (npcPrints[whichSprite][0] == numberOfFootprints) {
					npcPrints[whichSprite][0] = 0;
				}
			}
			npcPrints[whichSprite][1] = scrollclip["n_" + whichSprite]._x;
			npcPrints[whichSprite][2] = scrollclip["n_" + whichSprite]._y;
		}
	}
}
// 
function checkForHotspots() {
	for (g = 0; g < thisMapsHotspots.length; g++) {
		if (g != familiarsLastHotspot) {
			thisQuestHotspot = thisMapsHotspots[g][0];
			foundHotSpot = -1;
			if (thisQuestHotspot < 1) {
				// only react if quest is open (use <1 as could be -0 for a collection quest)
				if ((quests[mabs(thisQuestHotspot)][0] == 1) || (quests[mabs(thisQuestHotspot)][0] == 2)) {
					if (isinrange(herox, heroy, thisMapsHotspots[g][1], thisMapsHotspots[g][2], (FamiliarSkillLevel / 10))) {
						if (hasLOS(herox, heroy, thisMapsHotspots[g][1], thisMapsHotspots[g][2])) {
							// use this hotspot
							foundHotSpot = g;
						}
					}
				}
			} else if (thisQuestHotspot >= 1) {
				if (quests[thisQuestHotspot][0] != 3) {
					if (isinrange(herox, heroy, thisMapsHotspots[g][1], thisMapsHotspots[g][2], (FamiliarSkillLevel / 10))) {
						if (hasLOS(herox, heroy, thisMapsHotspots[g][1], thisMapsHotspots[g][2])) {
							// use this hotspot
							foundHotSpot = g;
						}
					}
				}
			}
			if (foundHotSpot != -1) {
				familiarstate = 1;
				// hide hero familiar clip and create independant clip:
				var familiardepth:Number = findClearDepth(scrollclip.hero.getDepth() + 1);
				// offset the familiar's clip by +1 so it's on the same location as hero
				scrollclip.hero.familiar._visible = false;
				scrollclip.attachMovie("familiarmovie","familiar",familiardepth);
				// init hero object non-iso position:
				scrollclip.familiar.px = ((herox + 0.5) * spacing);
				scrollclip.familiar.py = ((heroy + 0.5) * spacing);
				// the ...(+0.5)s ensures that the clip is centred tile 
				scrollclip.familiar._x = (scrollclip.familiar.px) + (scrollclip.familiar.py);
				scrollclip.familiar._y = ((scrollclip.familiar.px) - (scrollclip.familiar.py)) / 2;
				//
				scrollclip.familiar.lastposition = pathx.length;
				scrollclip.familiar.xdir = pathx[0];
				scrollclip.familiar.ydir = pathy[0];
				scrollclip.familiar.nextposition = 1;
				scrollclip.familiar.distx = 0;
				scrollclip.familiar.disty = 0;
				familiarfoundHotspot = foundHotSpot;
			}
		}
	}
}
//
function findClearDepth(idealdepth) {
	// check if there's any movie at this depth:
	if (scrollclip.getInstanceAtDepth(idealdepth) != undefined) {
		// ################
		// trace("clip at "+scrollclip.getInstanceAtDepth(idealdepth));
		// there is a clip there, try alternatives:
		if (scrollclip.getInstanceAtDepth(idealdepth + 1) == undefined) {
			// safe to use
			idealdepth++;
		} else if (scrollclip.getInstanceAtDepth(idealdepth - 1) == undefined) {
			// safe to use
			idealdepth--;
		} else {
			// how many other offsets to try and find a clear depth?
			// ###############
		}
	}
	return idealdepth;
}
//
function hotSpotQuestChange() {
	// check if the fae is over the hotspot that the npc is standing on which relates to this quest:
	if (thisMapsHotspots[familiarfoundHotspot][1] == scrollclip["n_" + whosaiditindex].xtile) {
		if (thisMapsHotspots[familiarfoundHotspot][2] == scrollclip["n_" + whosaiditindex].ytile) {
			// fae is over this npc's hotspot - rejoin hero
			familiarfoundHotspot = -1;
			familiarstate = 0;
			scrollclip.hero.familiar._visible = true;
			removeMovieClip(scrollclip.familiar);
			familiarLastSpotTimer = setInterval(clearFamiliarHotSpots, 10000);
		}
	}
}
//
function inventoryPanels() {
	if (setsopen.length > 0) {
		// check if that set is open or not currently:                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
		setisopen = -1;
		for (var i = 0; i < setsopen.length; i++) {
			if (setsopen[i][0] == settoggle) {
				setisopen = i;
				break;
			}
		}
		if (setisopen != -1) {
			// set is open
			// check if it's a chest:                                                                                                                                                                                                                                                                                                                                                                                              
			if (setsopen[setisopen][0] == "ichest") {
				closechest();
			}
			if (setsopen[setisopen][0] == "ishop") {
				shopisopen = false;
			}
			// remove all clips in this set:                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
			for (var checkInvClip in gamedisplay.inventorysets[setsopen[setisopen][0]]) {
				// check it's an inventory icon:
				if (gamedisplay.inventorysets[setsopen[setisopen][0]][checkInvClip]._name.indexOf("inventoryIcon") != -1) {
					gamedisplay.inventorysets[setsopen[setisopen][0]][checkInvClip].removeMovieClip();
				}
			}
			gamedisplay.inventorysets[setsopen[setisopen][0]]._visible = false;
			setsopen.splice(setisopen,1);
			handCursor.inventoryToolTip._visible = false;
			// check if that was the last open window to be closed:
			if (setsopen.length == 0) {
				gamedisplay.inventorysets._visible = false;
				waitingforinventory = false;
			} else if (setsopen.length == 1) {
				// ie. there is only 1 set left open
				if (setsopen[0][0] == "ichest") {
					// as the only set left open is a chest, then close this panel as well
					gamedisplay.inventorysets.ichest._visible = false;
					// remove all clips in this set:
					for (var checkInvClip in gamedisplay.inventorysets[setsopen[0][0]]) {
						// check it's an inventory icon:
						if (gamedisplay.inventorysets[setsopen[0][0]][checkInvClip]._name.indexOf("inventoryIcon") != -1) {
							gamedisplay.inventorysets[setsopen[0][0]][checkInvClip].removeMovieClip();
						}
					}
					setsopen = [];
					gamedisplay.inventorysets._visible = false;
					waitingforinventory = false;
					closechest();
				} else if (setsopen[0][0] == "ishop") {
					// as the only set left open is the shop, then close this panel as well
					gamedisplay.inventorysets.ishop._visible = false;
					// remove all clips in this set:
					for (var checkInvClip in gamedisplay.inventorysets[setsopen[0][0]]) {
						// check it's an inventory icon:
						if (gamedisplay.inventorysets[setsopen[0][0]][checkInvClip]._name.indexOf("inventoryIcon") != -1) {
							gamedisplay.inventorysets[setsopen[0][0]][checkInvClip].removeMovieClip();
						}
					}
					setsopen = [];
					gamedisplay.inventorysets._visible = false;
					waitingforinventory = false;
					shopisopen = false;
				} else if (setsopen[0][0] == "iworkshop") {
					// as the only set left open is the workshop, then close this panel as well
					gamedisplay.inventorysets.iworkshop._visible = false;
					// remove all clips in this set:
					for (var checkInvClip in gamedisplay.inventorysets[setsopen[0][0]]) {
						// check it's an inventory icon:
						if (gamedisplay.inventorysets[setsopen[0][0]][checkInvClip]._name.indexOf("inventoryIcon") != -1) {
							gamedisplay.inventorysets[setsopen[0][0]][checkInvClip].removeMovieClip();
						}
					}
					setsopen = [];
					gamedisplay.inventorysets._visible = false;
					waitingforinventory = false;
				}
			}
			// reposition sets to close any gaps                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
			placeinventorysets();
		} else {
			// first check that player isn't trying to open the bank, shop or a chest window:
			if ((settoggle != "ibank") || (settoggle != "ichest") || (settoggle != "ishop")) {
				// set isn't open, add to array:
				setsopen.push([settoggle, numberofslotstoadd, numberofcolumns]);
				gamedisplay.inventorysets[setsopen[(setsopen.length - 1)][0]]._visible = true;
				// position all sets:
				startposx = 0;
				for (var i = 0; i < setsopen.length; i++) {
					gamedisplay.inventorysets[setsopen[i][0]]._x = startposx;
					startposx += (invtilewidth * setsopen[i][2]) + borderwidth;
					gamedisplay.inventorysets[setsopen[i][0]]._y = 0;
				}
				populateInventorySet();
			}
		}
	} else {
		// first check that player isn't trying to open the bank or a chest window:
		if ((settoggle != "ibank") || (settoggle != "ichest") || (settoggle != "ishop")) {
			// set isn't open, add to array:
			setsopen.push([settoggle, numberofslotstoadd, numberofcolumns]);
			gamedisplay.inventorysets[setsopen[(setsopen.length - 1)][0]]._visible = true;
		}
		placeinventorysets();
		resetinventory();
		populateInventorySet();
		//
		gamedisplay.inventorysets._visible = true;
		gamedisplay.inventorysets[settoggle]._visible = true;
	}
	// check which panels are open to see if the hero can move or not:
	waitingforinventory = false;
	for (var i = 0; i < setsopen.length; i++) {
		// need ipet here otherwise hero and pet could be move apart with the panel open
		if ((setsopen[i][0] == "ipet") || (setsopen[i][0] == "ibank") || (setsopen[i][0] == "icrafting") || (setsopen[i][0] == "ichest") || (setsopen[i][0] == "ishop")) {
			waitingforinventory = true;
			break;
		}
	}
}
//
function populateInventorySet() {
	for (var i = 0; i < numberofslotstoadd; i++) {
		if (this[whicharray][i][0] != "1") {
			attachSingleInvIcon(settoggle,i);
		}
	}
}
//
function attachSingleInvIcon(whichSet, whichSlot) {
	var thisInventoryIconDepth = gamedisplay.inventorysets[whichSet].getNextHighestDepth();
	gamedisplay.inventorysets[whichSet].attachMovie("inventoryIcon","inventoryIcon" + whichSlot,thisInventoryIconDepth);
	whicharray = arraySettoArray(whichSet);
	// icons are centred while slots are top left, so add half the slot size to compensate
	gamedisplay.inventorysets[whichSet]["inventoryIcon" + whichSlot]._x = gamedisplay.inventorysets[whichSet]["slot" + whichSlot]._x + (invtilewidth / 2);
	gamedisplay.inventorysets[whichSet]["inventoryIcon" + whichSlot]._y = gamedisplay.inventorysets[whichSet]["slot" + whichSlot]._y + (invtileheight / 2);
	// check if it's wrapped
	var giftWrapped = parseInt(this[whicharray][whichSlot][5]);
	// check if it's money:
	if (inventoryitems[(parseInt(this[whicharray][whichSlot][0]))][2] == "£") {
		gamedisplay.inventorysets[whichSet]["inventoryIcon" + whichSlot].qual._visible = false;
		gamedisplay.inventorysets[whichSet]["inventoryIcon" + whichSlot].quan.text = parseMoney(parseInt(this[whicharray][whichSlot][1]));
		gamedisplay.inventorysets[whichSet]["inventoryIcon" + whichSlot].iconDesc = "";
		gamedisplay.inventorysets[whichSet]["inventoryIcon" + whichSlot].wrapping = -1;
		gamedisplay.inventorysets[whichSet]["inventoryIcon" + whichSlot].invIcons.gotoAndStop(parseInt(this[whicharray][whichSlot][0]));
	} else {
		if (giftWrapped != -1) {
			gamedisplay.inventorysets[whichSet]["inventoryIcon" + whichSlot].invIcons.gotoAndStop(giftWrapped);
			gamedisplay.inventorysets[whichSet]["inventoryIcon" + whichSlot].iconDesc = inventoryitems[giftWrapped][1];
			gamedisplay.inventorysets[whichSet]["inventoryIcon" + whichSlot].qual._visible = false;
			gamedisplay.inventorysets[whichSet]["inventoryIcon" + whichSlot].quan.text = 1;
		} else {
			gamedisplay.inventorysets[whichSet]["inventoryIcon" + whichSlot].invIcons.gotoAndStop(parseInt(this[whicharray][whichSlot][0]));
			gamedisplay.inventorysets[whichSet]["inventoryIcon" + whichSlot].iconDesc = inventoryitems[(parseInt(this[whicharray][whichSlot][0]))][1] + "\nEffectiveness: " + this[whicharray][whichSlot][4] + "\nUses: " + (this[whicharray][whichSlot][3] - this[whicharray][whichSlot][6]) + "/" + this[whicharray][whichSlot][3];
			gamedisplay.inventorysets[whichSet]["inventoryIcon" + whichSlot].quan.text = parseInt(this[whicharray][whichSlot][1]);
		}
		gamedisplay.inventorysets[whichSet]["inventoryIcon" + whichSlot].dura = parseInt(this[whicharray][whichSlot][3]);
		gamedisplay.inventorysets[whichSet]["inventoryIcon" + whichSlot].effec = parseInt(this[whicharray][whichSlot][4]);
		gamedisplay.inventorysets[whichSet]["inventoryIcon" + whichSlot].wrapping = parseInt(this[whicharray][whichSlot][5]);
		gamedisplay.inventorysets[whichSet]["inventoryIcon" + whichSlot].wear = this[whicharray][whichSlot][6];
		gamedisplay.inventorysets[whichSet]["inventoryIcon" + whichSlot].col = this[whicharray][whichSlot][7];
		if (parseInt(this[whicharray][whichSlot][7]) > 0) {
			// (+1 as frame 1 will be the undyed form, so frame 2 will colour #1 and so on)
			gamedisplay.inventorysets[whichSet]["inventoryIcon" + whichSlot].invIcons.variant.gotoAndStop(parseInt(this[whicharray][whichSlot][7]) + 1);
		}
		gamedisplay.inventorysets[whichSet]["inventoryIcon" + whichSlot].enchant = parseInt(this[whicharray][whichSlot][8]);
		gamedisplay.inventorysets[whichSet]["inventoryIcon" + whichSlot].hallmark = parseInt(this[whicharray][whichSlot][9]);
		gamedisplay.inventorysets[whichSet]["inventoryIcon" + whichSlot].inscr = this[whicharray][whichSlot][10];
	}
	var itemcode:String = inventoryitems[parseInt(this[whicharray][whichSlot][0])][2];
	if (itemcode.indexOf("U") != -1) {
		// has user generated content, so load the image into the icon:
		duplicateDynamicContent(gamedisplay.preloadUserContent[(this[whicharray][whichSlot][7])],gamedisplay.inventorysets[whichSet]["inventoryIcon" + whichSlot].invIcons.variant);
	}
	var pricecode:String = inventoryitems[parseInt(this[whicharray][whichSlot][0])][8];
	// check if the item is for sale in a shop:
	if (whichSet == "ishop") {
		// show sale price:
		var costofitem:Number = parseInt(pricecode);
		if (this[whicharray][whichSlot][1] != 0) {
			// is the previously sold slot, so multiply by quantity:
			costofitem *= parseInt(this[whicharray][whichSlot][1]);
		}
		// check if shop is a specialist shop:                                                                                                                                                                                                                                                                                           
		// #############
		// regional prices here instead
		if (pricecode.indexOf(scrollclip.shoptype[storeOwner]) != -1) {
			// costofitem = mfloor(costofitem*specialistbuy);
		}
		if (whichSlot == lastSoldItemSlot) {
			// get price from last item sold array in case it was sold at a regional discount etc.
			costofitem = parseInt(lastSoldItems[0][1]);
		}
		var silverAmount:Number = costofitem % 100;
		var goldAmount:Number = (costofitem - silverAmount) / 100;
		if (goldAmount == 0) {
			gamedisplay.inventorysets[whichSet]["inventoryIcon" + whichSlot].price.gold._visible = false;
		}
		if (silverAmount == 0) {
			gamedisplay.inventorysets[whichSet]["inventoryIcon" + whichSlot].price.silver._visible = false;
			gamedisplay.inventorysets[whichSet]["inventoryIcon" + whichSlot].price.gold._x = 30;
		} else if (silverAmount < 10) {
			gamedisplay.inventorysets[whichSet]["inventoryIcon" + whichSlot].price.gold._x = 9;
		}
		gamedisplay.inventorysets[whichSet]["inventoryIcon" + whichSlot].quan._visible = false;
		gamedisplay.inventorysets[whichSet]["inventoryIcon" + whichSlot].price._visible = true;
		gamedisplay.inventorysets[whichSet]["inventoryIcon" + whichSlot].price.gold.goldAmount.text = goldAmount;
		gamedisplay.inventorysets[whichSet]["inventoryIcon" + whichSlot].price.silver.silverAmount.text = silverAmount;
	} else {
		gamedisplay.inventorysets[whichSet]["inventoryIcon" + whichSlot].quan._visible = true;
		gamedisplay.inventorysets[whichSet]["inventoryIcon" + whichSlot].price._visible = false;
	}
	gamedisplay.inventorysets[whichSet]["inventoryIcon" + whichSlot].qual.gotoAndStop(parseInt(this[whicharray][whichSlot][2]));
	gamedisplay.inventorysets[whichSet]["inventoryIcon" + whichSlot].lastTime = 0;
	gamedisplay.inventorysets[whichSet]["inventoryIcon" + whichSlot].refID = whichSlot;
	gamedisplay.inventorysets[whichSet]["inventoryIcon" + whichSlot].setRef = whichSet;
	gamedisplay.inventorysets[whichSet]["inventoryIcon" + whichSlot].iconTitle = inventoryitems[(parseInt(this[whicharray][whichSlot][0]))][0];
	gamedisplay.inventorysets[whichSet]["inventoryIcon" + whichSlot].itemCode = itemcode;
	gamedisplay.inventorysets[whichSet]["inventoryIcon" + whichSlot].priceCode = pricecode;
	gamedisplay.inventorysets[whichSet]["inventoryIcon" + whichSlot].onRollOver = inventoryIconRollover;
	gamedisplay.inventorysets[whichSet]["inventoryIcon" + whichSlot].onRollOut = gamedisplay.inventorysets[whichSet]["inventoryIcon" + whichSlot].onDragOut = inventoryIconRollout;
	gamedisplay.inventorysets[whichSet]["inventoryIcon" + whichSlot].onPress = inventoryIconPress;
	gamedisplay.inventorysets[whichSet]["inventoryIcon" + whichSlot].onRelease = gamedisplay.inventorysets[whichSet]["inventoryIcon" + whichSlot].onReleaseOutside = inventoryIconRelease;
}
function attachFloatingInvIcon(whichSet, whichItemType, whatQuantity, whatQuality, whatDurability, whatEffectiveness, whatWrapping, whatWear, whatCol, whatEnchant, whatHallmark, whatInscr) {
	// primarily used for split quantity icon
	var thisInventoryIconDepth = gamedisplay.inventorysets[whichSet].getNextHighestDepth();
	gamedisplay.inventorysets[whichSet].attachMovie("inventoryIcon","inventoryIcon999",thisInventoryIconDepth);
	whicharray = arraySettoArray(whichSet);
	var itemcode:String = inventoryitems[parseInt(whichItemType)][2];
	var pricecode:String = inventoryitems[parseInt(whichItemType)][8];
	gamedisplay.inventorysets[whichSet]["inventoryIcon999"].invIcons.gotoAndStop(parseInt(whichItemType));
	gamedisplay.inventorysets[whichSet]["inventoryIcon999"].quan.text = whatQuantity;
	gamedisplay.inventorysets[whichSet]["inventoryIcon999"].quan._visible = true;
	gamedisplay.inventorysets[whichSet]["inventoryIcon999"].price._visible = false;
	gamedisplay.inventorysets[whichSet]["inventoryIcon999"].dura = whatDurability;
	gamedisplay.inventorysets[whichSet]["inventoryIcon999"].effec = whatEffectiveness;
	gamedisplay.inventorysets[whichSet]["inventoryIcon999"].wrapping = whatWrapping;
	gamedisplay.inventorysets[whichSet]["inventoryIcon999"].wear = whatWear;
	gamedisplay.inventorysets[whichSet]["inventoryIcon999"].col = whatCol;
	if (whatCol > 0) {
		gamedisplay.inventorysets[whichSet]["inventoryIcon999"].invIcons.variant.gotoAndStop(parseInt(whatCol) + 1);
	}
	gamedisplay.inventorysets[whichSet]["inventoryIcon999"].enchant = whatEnchant;
	gamedisplay.inventorysets[whichSet]["inventoryIcon999"].hallmark = whatHallmark;
	gamedisplay.inventorysets[whichSet]["inventoryIcon999"].inscr = whatInscr;
	gamedisplay.inventorysets[whichSet]["inventoryIcon999"].qual.gotoAndStop(parseInt(whatQuality));
	gamedisplay.inventorysets[whichSet]["inventoryIcon999"].refID = 999;
	gamedisplay.inventorysets[whichSet]["inventoryIcon999"].setRef = whichSet;
	gamedisplay.inventorysets[whichSet]["inventoryIcon999"].itemCode = itemcode;
	gamedisplay.inventorysets[whichSet]["inventoryIcon999"].priceCode = pricecode;
	gamedisplay.inventorysets[whichSet]["inventoryIcon999"].onRelease = gamedisplay.inventorysets[whichSet]["inventoryIcon999"].onReleaseOutside = inventoryIconRelease;
}
function attachSingleCompIcon(whichSlot, quantityRequired) {
	// (used to attach an inventory icon to the components panel before crafting)
	if (whichSlot == "dye") {
		var slotRef = "dyeSlot";
		whicharray = thisDyeSlot[0];
	} else {
		var slotRef = "slot" + whichSlot;
		// get most recent item added to the array
		whicharray = componentsAdded[(componentsAdded.length - 1)][0];
	}
	var thisInventoryIconDepth = gamedisplay.inventorysets.icrafting.getNextHighestDepth();
	gamedisplay.inventorysets.icrafting.attachMovie("inventoryIcon","inventoryIcon" + whichSlot,thisInventoryIconDepth);
	// icons are centred while slots are top left, so add half the slot size to compensate
	gamedisplay.inventorysets.icrafting["inventoryIcon" + whichSlot]._x = gamedisplay.inventorysets.icrafting[slotRef]._x + (invtilewidth / 2);
	gamedisplay.inventorysets.icrafting["inventoryIcon" + whichSlot]._y = gamedisplay.inventorysets.icrafting[slotRef]._y + (invtileheight / 2);
	gamedisplay.inventorysets.icrafting["inventoryIcon" + whichSlot].invIcons.gotoAndStop(parseInt(whicharray[0]));
	gamedisplay.inventorysets.icrafting["inventoryIcon" + whichSlot].iconDesc = inventoryitems[(parseInt(whicharray[0]))][1] + "\nEffectiveness: " + whicharray[4] + "\nUses: " + (whicharray[3] - whicharray[6]) + "/" + whicharray[3];
	if (whichSlot == "dye") {
		// 1x dye has been added and this is the maximum allowed:
		gamedisplay.inventorysets.icrafting["inventoryIcon" + whichSlot].quan.text = "1/1";
	} else {
		// component quantites need to show how many added and how many required
		var displayQuantity = parseInt(whicharray[1]);
		if (displayQuantity > thisRecipesComponents[whichSlot][1]) {
			displayQuantity = thisRecipesComponents[whichSlot][1];
		}
		gamedisplay.inventorysets.icrafting["inventoryIcon" + whichSlot].quan.text = displayQuantity + "/" + thisRecipesComponents[whichSlot][1];
	}
	gamedisplay.inventorysets.icrafting["inventoryIcon" + whichSlot].dura = parseInt(whicharray[3]);
	gamedisplay.inventorysets.icrafting["inventoryIcon" + whichSlot].effec = parseInt(whicharray[4]);
	gamedisplay.inventorysets.icrafting["inventoryIcon" + whichSlot].wrapping = parseInt(whicharray[5]);
	gamedisplay.inventorysets.icrafting["inventoryIcon" + whichSlot].wear = parseInt(whicharray[6]);
	gamedisplay.inventorysets.icrafting["inventoryIcon" + whichSlot].col = parseInt(whicharray[7]);
	if (parseInt(whicharray[7]) > 0) {
		// (+1 as frame 1 will be the undyed form, so frame 2 will colour #1 and so on)
		gamedisplay.inventorysets.icrafting["inventoryIcon" + whichSlot].invIcons.variant.gotoAndStop(parseInt(whicharray[7]) + 1);
	}
	gamedisplay.inventorysets.icrafting["inventoryIcon" + whichSlot].enchant = parseInt(whicharray[8]);
	gamedisplay.inventorysets.icrafting["inventoryIcon" + whichSlot].hallmark = parseInt(whicharray[9]);
	gamedisplay.inventorysets.icrafting["inventoryIcon" + whichSlot].inscr = whicharray[10];
	var itemcode:String = inventoryitems[parseInt(whicharray[0])][2];
	var pricecode:String = inventoryitems[parseInt(whicharray[0])][8];
	gamedisplay.inventorysets.icrafting["inventoryIcon" + whichSlot].quan._visible = true;
	gamedisplay.inventorysets.icrafting["inventoryIcon" + whichSlot].price._visible = false;
	gamedisplay.inventorysets.icrafting["inventoryIcon" + whichSlot].qual.gotoAndStop(parseInt(whicharray[2]));
	gamedisplay.inventorysets.icrafting["inventoryIcon" + whichSlot].lastTime = 0;
	gamedisplay.inventorysets.icrafting["inventoryIcon" + whichSlot].refID = whichSlot;
	gamedisplay.inventorysets.icrafting["inventoryIcon" + whichSlot].setRef = "icrafting";
	gamedisplay.inventorysets.icrafting["inventoryIcon" + whichSlot].iconTitle = inventoryitems[(parseInt(whicharray[0]))][0];
	gamedisplay.inventorysets.icrafting["inventoryIcon" + whichSlot].itemCode = itemcode;
	gamedisplay.inventorysets.icrafting["inventoryIcon" + whichSlot].priceCode = pricecode;
	gamedisplay.inventorysets.icrafting["inventoryIcon" + whichSlot].quanReq = quantityRequired;
	gamedisplay.inventorysets.icrafting["inventoryIcon" + whichSlot].onRollOver = inventoryIconRollover;
	gamedisplay.inventorysets.icrafting["inventoryIcon" + whichSlot].onRollOut = gamedisplay.inventorysets.icrafting["inventoryIcon" + whichSlot].onDragOut = inventoryIconRollout;
	// the onpress/release behaviours will need to be different, as the icon itself will not be able to dragged back to the inventory
	// the component icon may represent 2 or more inventory slots worth of items and so each individual slot will need to be created as
	// a floating icon on press so that each can be independtly put back (and so preserve their individual attributes)
	gamedisplay.inventorysets.icrafting["inventoryIcon" + whichSlot].onPress = removeLastComponent;
	gamedisplay.inventorysets.icrafting["inventoryIcon" + whichSlot].onRelease = gamedisplay.inventorysets.icrafting["inventoryIcon" + whichSlot].onReleaseOutside = compIconRelease;
}
//
function inventoryIconRollover() {
	// ensure that this isn't a split quantity that took the whole slot's worth (and so wasn't pressed to start the drag):
	if (!splitQuantityAllMoved) {
		var showComparison = false;
		if (inventoryitems[this.invIcons._currentframe][6] == "post") {
			// is a post item, so display the message title if it has one:
			handCursor.inventoryToolTip.outputtitle.text = this.iconTitle;
			if (this.inscr == "-") {
				handCursor.inventoryToolTip.outputdescription.text = "(blank)";
			} else {
				var messageSplit = this.inscr.split("[**]");
				handCursor.inventoryToolTip.outputdescription.text = messageSplit[0];
			}
			handCursor.inventoryToolTip.saleprice._visible = false;
		} else if (inventoryitems[this.invIcons._currentframe][6] == "map") {
			// is a treasure map, so display the clue for this map:
			handCursor.inventoryToolTip.outputtitle.text = this.iconTitle;
			// parse this item's colour to get the map details:


			if (this.col.indexOf("R") != -1) {
				// is a random map
				var randomTreasureMap = this.col.split("|");
				var randomTreasureMapDetails = randomTreasureMap[0].split("R");
				var randomDungeonName = randomDungeonTreasureMapsAvailable[(randomTreasureMapDetails[0])];

				var dungeonMapRequired = randomTreasureMapDetails[1];


				handCursor.inventoryToolTip.outputdescription.text = "\"" + randomDungeonName + dungeonMapRequired + "\"";


			} else {

				whichMapRef = findMapDetails(this.col);
				handCursor.inventoryToolTip.outputdescription.text = "\"" + treasureMapsAvailable[whichMapRef][1] + "\"";
			}
			handCursor.inventoryToolTip.saleprice._visible = false;
		} else if (inventoryitems[this.invIcons._currentframe][2].indexOf("U") != -1) {
			// is user generated content, so show the item's type, and the user's description:
			handCursor.inventoryToolTip.outputtitle.text = this.iconTitle;
			// re-convert any "[*^*]" to "." (as these were used to delimit the item in the XML)
			var thisUserDescSplit = this.wear.split("[*^*]");
			var thisUserDesc = thisUserDescSplit.join(".");
			handCursor.inventoryToolTip.outputdescription.text = "\"" + thisUserDesc + "\"";
			handCursor.inventoryToolTip.saleprice._visible = false;
		} else if (inventoryitems[this.invIcons._currentframe][6] == "card") {
			// show this single card's name in the description:
			handCursor.inventoryToolTip.outputtitle.text = this.iconTitle;
			// card's id is its colour:
			handCursor.inventoryToolTip.outputdescription.text = allPlayingCardsAvailable[this.col][0];
		} else if (inventoryitems[this.invIcons._currentframe][6] == "recipe") {
			// show this recipe's details (recipe's id is its colour):
			if (_root.recipesAvailable[this.col][5] != "-") {
				var thisName = recipesAvailable[this.col][5];
			} else {
				var thisName = inventoryitems[(recipesAvailable[this.col][1])][0];
			}
			// prefix with colour if this item will be coloured
			if (recipesAvailable[this.col][4] != "0") {
				thisName = colours[(recipesAvailable[this.col][4])][0] + " " + thisName;
			}
			handCursor.inventoryToolTip.outputtitle.text = "Recipe for " + thisName;
			// find skill this recipe relates to:
			var thisRecipeDesc = "Relates to " + professionsAvailable[(recipesAvailable[this.col][0])] + " profession";
			// find prequisite for this recipe
			var thisRecipesPrerequisite = recipesAvailable[this.col][6];
			if (thisRecipesPrerequisite != "-") {
				if (_root.recipesAvailable[thisRecipesPrerequisite][5] != "-") {
					var thisPreReqName = recipesAvailable[thisRecipesPrerequisite][5];
				} else {
					var thisPreReqName = inventoryitems[(recipesAvailable[thisRecipesPrerequisite][1])][0];
				}
				// prefix with colour:
				if (recipesAvailable[thisRecipesPrerequisite][4] != "0") {
					thisPreReqName = colours[(recipesAvailable[thisRecipesPrerequisite][4])][0] + " " + thisPreReqName;
				}
				thisRecipeDesc += "\nRequires knowledge of " + thisPreReqName;
			}
			// show whether the player knows this recipe already or not:                                                                                                                                                                                                                                 
			for (var checkRecipe = 0; checkRecipe < recipesKnown.length; checkRecipe++) {
				if (recipesKnown[checkRecipe] == this.col) {
					recipeAlreadyKnown = true;
				}
			}
			if (recipeAlreadyKnown) {
				thisRecipeDesc += "\nAlready know this recipe";
			} else {
				thisRecipeDesc += "\nDon't know this recipe";
			}
			handCursor.inventoryToolTip.outputdescription.text = thisRecipeDesc;
		} else if (inventoryitems[this.invIcons._currentframe][2].indexOf("m") != -1) {
			// show this map's name in the description:
			handCursor.inventoryToolTip.outputtitle.text = this.iconTitle;
			// map's id is its durability:
			handCursor.inventoryToolTip.outputdescription.text = standardMapsAvailable[this.dura][0];
		} else if (inventoryitems[this.invIcons._currentframe][2].indexOf("i") != -1) {
			handCursor.inventoryToolTip.outputtitle.text = this.iconTitle;
			// show this songs's name and transcriber in the description:
			handCursor.inventoryToolTip.outputdescription.text = "\"" + this.inscr + "\" - transcribed by " + this.col;



		} else if (inventoryitems[this.invIcons._currentframe][6] == "catalogue") {
			handCursor.inventoryToolTip.outputtitle.text = this.iconTitle;
			handCursor.inventoryToolTip.outputdescription.text = this.inscr;

		} else {
			if (this.wrapping != -1) {
				handCursor.inventoryToolTip.outputtitle = inventoryitems[this.wrapping][0];
			} else {
				if ((this.col > 0) && ((inventoryitems[this.invIcons._currentframe][2]).indexOf("c") == -1)) {
					// has been dyed, so show colour before the title: (unless the colour is inherent (eg. a mordant))
					handCursor.inventoryToolTip.outputtitle.text = colours[this.col][0] + " " + this.iconTitle;
				} else {
					handCursor.inventoryToolTip.outputtitle.text = this.iconTitle;
				}
			}
			var tempDesc = this.iconDesc;
			if (this.inscr != "-") {
				var messageSplit = this.inscr.split("[**]");
				tempDesc += "\n\"" + messageSplit[0] + "\"";
			}
			handCursor.inventoryToolTip.outputdescription.text = tempDesc;
			// check to see if this is a collection item and if the player has it already or not:
			if (inventoryitems[this.invIcons._currentframe][6] == "collect") {
				handCursor.inventoryToolTip.outputdescription.text += " - collection item";
				var collectionDetails = inventoryitems[this.invIcons._currentframe][7].split("|");
				if (_root["currentCollections"][collectionDetails[0]][collectionDetails[1]] == 1) {
					handCursor.inventoryToolTip.outputdescription.text += " - already added to a collection";
				} else {
					handCursor.inventoryToolTip.outputdescription.text += " - need";
				}
			}
			handCursor.inventoryToolTip.outputdescription._y = (handCursor.inventoryToolTip.outputtitle.textHeight) + 8;
			// ##########
			// if this item has an action, then add an appropriate message to .outputdescription
			// eg. if action == "repair" and actionValue == "c"
			// then outputdescription += "\nDouble click to repair a cloth item";
			// ##########
			// if shop is open and the current icon isn't in the shop and the item isn't a quest item or a unique item then show sale price:
			if ((shopisopen) && (this.setRef != "ishop") && (this.itemCode.indexOf("q") == -1) && (this.itemCode.indexOf("u") == -1)) {
				// check if shop is a specialist shop:
				// ############# alter this to check for regional price modifiers instead
				saleprice = (parseInt(this.priceCode)) * (parseInt(this.quan.text));
				if (this.itemCode.indexOf(scrollclip.shoptype[storeOwner]) != -1) {
					// saleprice = mfloor(saleprice*specialistbuy);
				}
				displayTooltipPrice(saleprice);
			} else {
				handCursor.inventoryToolTip.saleprice._visible = false;
			}
			if (this.setRef != "iequip") {
				// if this isn't an equipped item, then check to see if it's in the same group as any equipped items
				// and show details of the equipped item so the player can compare the two:
				var thisItemsGroup = inventoryitems[(this.invIcons._currentframe)][12];
				for (var i = 0; i < currentlyEquipped.length; i++) {
					if (inventoryitems[(currentlyEquipped[0][i][0])][12] == thisItemsGroup) {
						var thisComparisonOutputTitle = inventoryitems[(parseInt(currentlyEquipped[0][i][0]))][0];
						var thisComparisonOutputDesc = inventoryitems[(parseInt(currentlyEquipped[0][i][0]))][1] + "\nEffectiveness: " + currentlyEquipped[0][i][4] + "\nUses: " + (currentlyEquipped[0][i][3] - currentlyEquipped[0][i][6]) + "/" + currentlyEquipped[0][i][3];
						// equipped items won't be wrapped, but might be coloured:
						var thisComparisonCol = parseInt(currentlyEquipped[0][i][7]);
						if ((thisComparisonCol > 0) && ((inventoryitems[(parseInt(currentlyEquipped[0][i][0]))][2]).indexOf("c") == -1)) {
							// has been dyed, so show colour before the title: (unless the colour is inherent (eg. a mordant))
							thisComparisonOutputTitle = colours[thisComparisonCol][0] + " " + thisComparisonOutputTitle;
						}
						handCursor.inventoryToolTip.comparison.outputtitle.text = thisComparisonOutputTitle;
						handCursor.inventoryToolTip.comparison.outputdescription.text = thisComparisonOutputDesc;
						handCursor.inventoryToolTip.comparison.outputdescription._y = (handCursor.inventoryToolTip.comparison.outputtitle.textHeight) + 8;
						showComparison = true;
						break;
					}
				}
			}
		}
		handCursor.inventoryToolTip.comparison._visible = showComparison;
		handCursor.inventoryToolTip._visible = true;
		currentToolTipSet = this.setRef;
		currentToolTipSlot = this.refID;
	}
	if (isTargetting) {
		// targetting type 2 is for items
		if (targetingType == 2) {
			_root.targetInventory(this._x,this._y,this.setRef);
		}
	}
}
function inventoryIconRollout() {
	handCursor.inventoryToolTip._visible = false;
	currentToolTipSet = -1;
	currentToolTipSlot = -1;
	if (isTargetting) {
		if (targetingType == 2) {
			_root.targetWorld();
		}
	}
}
function inventoryIconPress() {
	// make sure not waiting for confirmation:
	if (confirmAction == "") {
		// ensure that this isn't a split quantity that took the whole slot's worth (and so wasn't pressed to start the drag):
		if (!splitQuantityAllMoved) {
			// make sure this isn't a shop item that the player can't afford:
			if (!((this.setRef == "ishop") && (this._alpha == 50))) {
				// start timer to see if the mouse button is released very shortly after this press
				// if it isn't released then can start dragging
				clearInterval(_root.allowDragTimer);
				if (!(Key.isDown(keysplit))) {
					// make sure if attempting to split quantites (by holding shift) that don't start dragging
					_root.allowDragTimer = setInterval(_root.allowDrag, (_root.doubleClickSpeed * 0.6), this.refID, this.setRef);
				}
			}
			if (waitingfornumericinput) {
				// close and cancel input box
				waitingfornumericinput = false;
				gamedisplay.inputbox._visible = false;
			}
			beingDragged = false;
		}
	}
}
function inventoryIconRelease() {
	doubleClickEquip = false;
	clearInterval(_root.allowDragTimer);
	// make sure not waiting for confirmation:
	if (confirmAction == "") {
		if (isTargettingInventory) {
			// trace("targetted item in inventory: " + this.setRef + " - " + this.refID);
			cancelTargetting();
		} else {
			// check for double click:
			this.now = getTimer();
			var doubleClicked = false;
			if (((this.now - this.lastTime) < _root.doubleClickSpeed) && (beingDragged == false)) {
				doubleClicked = true;
				if (this.wrapping != -1) {
					// check if the item is wrapped and unwrap it if so:
					this.wrapping = -1;
					this.qual._visible = true;
					whicharray = arraySettoArray(this.setRef);
					_root[whicharray][this.refID][5] = -1;
					// show correct details:
					this.quan.text = parseInt(_root[whicharray][this.refID][2]);
					this.iconDesc = inventoryitems[(parseInt(_root[whicharray][this.refID][0]))][1] + "\nEffectiveness: " + _root[whicharray][this.refID][4] + "\nUses: " + (_root[whicharray][this.refID][3] - _root[whicharray][this.refID][6]) + "/" + _root[whicharray][this.refID][3];
					this.invIcons.gotoAndStop(parseInt(_root[whicharray][this.refID][0]));
					// check if the wrapped item was dyed:
					if (parseInt(this[whicharray][this.refID][7]) > 0) {
						// (+1 as frame 1 will be the undyed form, so frame 2 will colour #1 and so on)
						this.invIcons.variant.gotoAndStop(parseInt(this[whicharray][this.refID][7]) + 1);
					}
					// update tooltip as this will be showing:                                                                                                                                                                                                                                                                                                           
					handCursor.inventoryToolTip.outputtitle.text = this.iconTitle;
					var tempDesc = this.iconDesc;
					if (inventoryitems[this.invIcons._currentframe][6] == "card") {
						// show this single card's name in the description:
						tempDesc = allPlayingCardsAvailable[this.col][0];
					} else if (inventoryitems[this.invIcons._currentframe][2].indexOf("m") != -1) {
						// show this map's name in the description:
						tempDesc = standardMapsAvailable[this.dura][0];
					} else if (inventoryitems[this.invIcons._currentframe][2].indexOf("i") != -1) {
						// show this songs's name and transcriber in the description:
						tempDesc = "\"" + this.inscr + "\" - transcribed by " + this.col;
					}
					if (this.inscr != "-") {
						var messageSplit = this.inscr.split("[**]");
						tempDesc += "\n\"" + messageSplit[0] + "\"";
					}
					handCursor.inventoryToolTip.outputdescription.text = tempDesc;
					handCursor.inventoryToolTip.outputdescription._y = (handCursor.inventoryToolTip.outputtitle.textHeight) + 8;
				} else if (shopisopen) {
					// if shop is open double clicking it will either buy or sell accordingly:
					if (this.setRef != "ishop") {
						// sell
						fromarray = arraySettoArray(this.setRef);
						checkItemisUniqueOrQuest(this,"sold");
						if (itemCanBeDroppedorSold) {
							saleprice = (parseInt(this.priceCode)) * (parseInt(this.quan.text));
							// ############# check for regional price modifiers here:
							money += saleprice;
							gradeItemsForSale();
							updatemoney();
							quantitysplit = false;
							handCursor.inventoryToolTip._visible = false;
							lastSoldItems.unshift([[this.invIcons._currentframe, this.quan.text, this.qual._currentframe, this.dura, this.effec, this.wrapping, this.wear, this.col, this.enchant, this.hallmark, this.inscr], saleprice]);
							if (lastSoldItems.length > maximumSoldItemHistory) {
								// remove oldest in queue:
								lastSoldItems.pop();
							}
							// visually update slot (remove existing clip first):                                                                                                                                                                                                                                                                     
							gamedisplay.inventorysets.ishop["inventoryIcon" + lastSoldItemSlot].removeMovieClip();
							shopcontents[lastSoldItemSlot] = lastSoldItems[0][0];
							attachSingleInvIcon("ishop",lastSoldItemSlot);
							_root[fromarray][this.refID][0] = "1";
							gamedisplay.inventorysets[this.setRef]["inventoryIcon" + this.refID].removeMovieClip();
						}
					} else {
						// buy - check player has enough money (ie. hasn't been greyed out in gradeItemsForSale):
						if (this._alpha != 50) {
							var quantityToBeBought = 1;
							// check if this is on the previously sold slot:
							var thisInvSlotsName = this._name;
							var thisInvSlotsNumber = (parseInt(thisInvSlotsName.substring(13)));
							var costofitem:Number = parseInt(this.priceCode) * quantityToBeBought;
							if (thisInvSlotsNumber == lastSoldItemSlot) {
								quantityToBeBought = parseInt(shopcontents[lastSoldItemSlot][1]);
								costofitem = parseInt(lastSoldItems[0][1]);
							}
							if (canadditemtoinventory(this.invIcons._currentframe, quantityToBeBought, this.qual._currentframe, this.dura, this.effec, this.wrapping, this.wear, this.col, this.enchant, this.hallmark, this.inscr) == quantityToBeBought) {
								money -= costofitem;
								updatemoney();
								gradeItemsForSale();
								additemtoinventory(this.invIcons._currentframe,quantityToBeBought,this.qual._currentframe,this.dura,this.effec,this.wrapping,this.wear,this.col,this.enchant,this.hallmark,this.inscr);
								showItemAddedAnimation(this.invIcons._currentframe);
								if (thisInvSlotsNumber == lastSoldItemSlot) {
									// remove this from the array now
									lastSoldItems.shift();
									this.removeMovieClip();
									if (lastSoldItems.length != 0) {
										// attach next clip
										shopcontents[lastSoldItemSlot] = lastSoldItems[0][0];
										attachSingleInvIcon("ishop",lastSoldItemSlot);
									}
								}
							} else {
								statusMessage("no room in inventory");
							}
						} else {
							statusMessage("you can't afford this");
						}
					}
				} else if (inventoryitems[parseInt(this.invIcons._currentframe)][13] != "-") {
					// this item can be equipped
					if (this.setRef == "iequip") {
						// try and unequip this item
						if (canadditemtoinventory(currentlyEquipped[0][this.refID][0], currentlyEquipped[0][this.refID][1], currentlyEquipped[0][this.refID][2], currentlyEquipped[0][this.refID][3], currentlyEquipped[0][this.refID][4], currentlyEquipped[0][this.refID][5], currentlyEquipped[0][this.refID][6], currentlyEquipped[0][this.refID][7], currentlyEquipped[0][this.refID][8], currentlyEquipped[0][this.refID][9], currentlyEquipped[0][this.refID][10]) == 1) {
							additemtoinventory(currentlyEquipped[0][this.refID][0],currentlyEquipped[0][this.refID][1],currentlyEquipped[0][this.refID][2],currentlyEquipped[0][this.refID][3],currentlyEquipped[0][this.refID][4],currentlyEquipped[0][this.refID][5],currentlyEquipped[0][this.refID][6],currentlyEquipped[0][this.refID][7],currentlyEquipped[0][this.refID][8],currentlyEquipped[0][this.refID][9],currentlyEquipped[0][this.refID][10]);
							showItemAddedAnimation(currentlyEquipped[0][this.refID][0]);
							currentlyEquipped[0][this.refID][0] = 1;
							gamedisplay.inventorysets.iequip["inventoryIcon" + this.refID].removeMovieClip();
						} else {
							statusMessage("no room to unequip this to the inventory");
						}
					} else {
						// try and equip this item
						fromarray = arraySettoArray(this.setRef);
						droparray = "currentlyEquipped";
						fromWhichArraySlot = this.refID;
						doubleClickEquip = true;
						processEquipping(this);
					}
				} else {
					// use this item
					fromarray = arraySettoArray(this.setRef);
					var thisItemAction = inventoryitems[(_root[fromarray][this.refID][0])][6];
					var thisItemActionValue = inventoryitems[(_root[fromarray][this.refID][0])][7];
					switch (thisItemAction) {
						case "tailor" :
							// 0 is the index in professionsAvailable for Tailoring
							openCraftingPanel(0,thisItemActionValue);
							break;
						case "dyer" :
							// 1 is the index in professionsAvailable for Dyeing
							//
							// check that the hero is at a dye workstation:
							if (scrollclip["t_" + herox + "_" + heroy].c.indexOf("d") != -1) {
								openCraftingPanel(1,thisItemActionValue);
							} else {
								statusMessage("you need to be at a dye workstation to start dyeing");
							}
							break;
						case "QuO" :
							// opens a quest if the quest hasn't been opened yet:
							if (quests[thisItemActionValue][0] == 0) {
								quests[thisItemActionValue][0] = 1;
							}
							break;
						case "QuC" :
							// closes a quest
							quests[thisItemActionValue][0] = 2;
							break;
						case "post" :
							// opens a message
							openMessage(inventoryitems[this.invIcons._currentframe][7],this);
							break;
						case "map" :
							// opens a treasure map
							openMap(this.col);
							break;



						case "catalogue" :
							// opens the catalogue quest item
							openCatalogueQuestItem(this.inscr,this.wear);
							break;

						case "stndmap" :
							// opens a standard map
							var thisMapsUniqueId = this.qual._currentframe + "_" + this.dura + "_" + this.col + "_" + this.inscr + "_" + this.wear;
							gamedisplay.standardMapHolder[thisMapsUniqueId]._visible = true;
							// bring to the front:
							var newStandardMapDepth = gamedisplay.standardMapHolder.getNextHighestDepth();
							gamedisplay.standardMapHolder[thisMapsUniqueId].swapDepths(newStandardMapDepth);
							break;
						case "playsong" :
							// check that a musical instrument is equiped:
							if (inventoryitems[(currentlyEquipped[0][0])][2].indexOf("I") != -1) {
								// find musical instrument's actionValue:
								var instrumentsActionValue = inventoryitems[(currentlyEquipped[0][0])][7];
								playSong(instrumentsActionValue,this.dura,this.inscr,(currentlyEquipped[0][0]));
							} else {
								statusMessage("Need to equip an instrument before playing this song");
							}
							break;
						case "card" :
							// add this card to the card album
							addPlayingCardsToAlbum(this.col,parseInt(this.quan.text));
							_root[fromarray][this.refID][0] = "1";
							this.removeMovieClip();
							break;
						case "booster" :
							// show the cards in this booster
							openBoosterPack(this._x,this._y,this.setRef);
							_root[fromarray][this.refID][0] = "1";
							this.removeMovieClip();
							break;
						case "recipe" :
							// add recipe if not already known
							var recipeAlreadyKnown = false;
							for (var checkRecipe = 0; checkRecipe < recipesKnown.length; checkRecipe++) {
								if (recipesKnown[checkRecipe] == this.col) {
									recipeAlreadyKnown = true;
								}
							}
							if (recipeAlreadyKnown) {
								statusMessage("you already know this recipe");
							} else {
								// check for prerequisites:
								var okToLearnRecipe = false;
								var thisRecipesPrerequisite = recipesAvailable[this.col][6];
								if (thisRecipesPrerequisite == "-") {
									okToLearnRecipe = true;
								} else {
									// see if player has the required recipe already:
									for (var checkRecipe = 0; checkRecipe < recipesKnown.length; checkRecipe++) {
										if (recipesKnown[checkRecipe] == thisRecipesPrerequisite) {
											okToLearnRecipe = true;
										}
									}
								}
								if (okToLearnRecipe) {
									learnNewRecipe(this.col);
									if (this.quan.text == 1) {
										_root[fromarray][this.refID][0] = "1";
										this.removeMovieClip();
									} else {
										// remove 1 of the recipe that was learnt, leaving the rest to sell or trade
										_root[fromarray][this.refID][1] = parseInt(_root[fromarray][this.refID][1]) - 1;
										this.quan.text = _root[fromarray][this.refID][1];
									}
								} else {
									statusMessage("you need to learn the required recipe before learning this");
								}
							}
							break;
						case "collect" :
							// check if needed for collection:
							var collectionDetails = inventoryitems[this.invIcons._currentframe][7].split("|");

							var collectionItemToAdd = this.invIcons._currentframe;


							if (_root["currentCollections"][collectionDetails[0]][collectionDetails[1]] == 1) {
								// already in a collection:
								statusMessage("you already have one of this in a collection");
							} else {
								// check quantity - if 1 remove this item else reduce quantity by 1:
								if (this.quan.text > 1) {
									this.quan.text = parseInt(this.quan.text) - 1;
									_root[fromarray][this.refID][1] = this.quan.text;
									// update tooltip details:
									var tempDesc = this.iconDesc;
									if (this.inscr != "-") {
										var messageSplit = this.inscr.split("[**]");
										tempDesc += "\n\"" + messageSplit[0] + "\"";
									}
									_root.handCursor.inventoryToolTip.outputdescription.text = tempDesc;
									_root.handCursor.inventoryToolTip.outputdescription.text += " - collection item";
									_root.handCursor.inventoryToolTip.outputdescription.text += " - already added to a collection";
								} else {
									handCursor.inventoryToolTip._visible = false;
									_root[fromarray][this.refID][0] = "1";
									this.removeMovieClip();
								}




								if (!collectionAlbumVisible) {
									// show it going into album



									gamedisplay.bagIcons.ialbum.bagInvIcons.gotoAndStop(collectionItemToAdd);
									gamedisplay.bagIcons.ialbum.gotoAndPlay(2);
								} else {
									updateVisibleAlbum(collectionDetails[0],collectionDetails[1]);
								}

								_root["currentCollections"][collectionDetails[0]][collectionDetails[1]] = 1;
								if (collectionIsComplete()) {
									// quest[0] is for collection quests
									quests[0][0] = "1";

									hotSpotQuestChange();
								}
							}
							break;
						default :
							// do nothing
					}
				}
			} else if (Key.isDown(keysplit)) {
				if (((this.quan.text > 1) || (this.setRef == "ishop")) && (inventoryitems[(_root[arraySettoArray(this.setRef)][this.refID][0])][2] != "£") && (this.wrapping == -1)) {
					// checking if shift is being held down & that there is more than 1 quantity (or it's in the shop), and that it's not money and not wrapped(ie. can be split)
					waitingfornumericinput = true;
					if (this.setRef == "ishop") {
						// determine how many the player can afford:
						var costofitem:Number = parseInt(this.priceCode);
						var numberCanAfford:Number = mfloor(money / costofitem);
						if (numberCanAfford <= maxitemsperslot) {
							quantityavailable = numberCanAfford;
						} else {
							quantityavailable = maxitemsperslot;
						}
						// check if this is the last sold item slot and set max to this quantity
						var thisInvSlotsName = this._name;
						var thisInvSlotsNumber = (parseInt(thisInvSlotsName.substring(13)));
						if (thisInvSlotsNumber == lastSoldItemSlot) {
							quantityavailable = parseInt(lastSoldItems[0][0][1]);
						}
					} else {
						quantityavailable = this.quan.text;
					}
					splitQuanFromSet = this.setRef;
					splitParentItem = this.refID;
					gamedisplay.inputbox.quantitybeingmoved = "0";
					gamedisplay.inputbox.showRange = "1 - " + quantityavailable;
					// set focus for input box:
					Selection.setFocus("gamedisplay.inputbox.quantitybeingmoved");
					gamedisplay.inputbox._visible = true;
				}
			} else if (beingDragged) {
				// hide cursor so it doesn't register as the droptarget
				handCursor._visible = false;
				this.stopDrag();
				thisDropTarget = eval(this._droptarget);
				// restore cursor:
				handCursor._visible = true;
				//
				dropTargetsName = thisDropTarget._name.toString();
				indexOfSlot = dropTargetsName.indexOf("slot");
				indexOfInvIcon = dropTargetsName.indexOf("inventoryIcon");
				// player may have released icon over the quantity or quality clips, so these might register as drop target:
				if (indexOfInvIcon == -1) {
					indexOfInvIcon = thisDropTarget._parent._name.toString().indexOf("inventoryIcon");
				}
				// player may have released icon over the variant clip of the movieclip, so check for this:                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
				if (this._droptarget.toString().indexOf("variant") != -1) {
					indexOfInvIcon = thisDropTarget._parent._parent._name.toString().indexOf("inventoryIcon");
				}
				if (this._droptarget.toString().indexOf("icrafting") != -1) {
					// was dropped over crafting panel (this takes priority over other actions) - check if specifically dropped to dye slot
					if ((this._droptarget.toString().indexOf("dyeSlot") != -1) || (this._droptarget.toString().indexOf("inventoryIcondye") != -1)) {
						// was dropped to dye slot (or an existing dye icon) - check it is a dye for this type of profession (is a dye and has a dyeing actionvalue)
						var isADye:Boolean = false;
						switch (currentProfession) {
							case 0 :
								// dyes for tailoring:
								if (fromWhichArraySlot == "overflow") {
									if ((inventoryitems[(parseInt(_root.storedCraftedItem[0]))][2].indexOf("d") != -1) && (inventoryitems[(parseInt(_root.storedCraftedItem[0]))][7].indexOf("l") != -1)) {
										isADye = true;
									}
									break;
								} else {
									if ((inventoryitems[(parseInt(_root[fromarray][fromWhichArraySlot][0]))][2].indexOf("d") != -1) && (inventoryitems[(parseInt(_root[fromarray][fromWhichArraySlot][0]))][7].indexOf("l") != -1)) {
										isADye = true;
									}
									break;
								}
							case 1 :
								// dyes for dyeing:
								if (fromWhichArraySlot == "overflow") {
									if ((inventoryitems[(parseInt(_root.storedCraftedItem[0]))][2].indexOf("d") != -1) && (inventoryitems[(parseInt(_root.storedCraftedItem[0]))][7].indexOf("l") != -1)) {
										isADye = true;
									}
									break;
								} else {
									if ((inventoryitems[(parseInt(_root[fromarray][fromWhichArraySlot][0]))][2].indexOf("d") != -1) && (inventoryitems[(parseInt(_root[fromarray][fromWhichArraySlot][0]))][7].indexOf("l") != -1)) {
										isADye = true;
									}
									break;
								}
						}
						if (isADye) {
							var okToAddNewDye = true;
							if (thisDyeSlot.length > 0) {
								// restore previous dye:
								var whicharray = arraySettoArray(thisDyeSlot[1]);
								if (thisDyeSlot[2] == "overflow") {
									// will be ok to add
								} else {
									if (((_root[whicharray][(thisDyeSlot[2])][0] == 1) || ((thisDyeSlot[0][0] == _root[whicharray][(thisDyeSlot[2])][0]) && (thisDyeSlot[0][1] == _root[whicharray][(thisDyeSlot[2])][1]) && (thisDyeSlot[0][2] == _root[whicharray][(thisDyeSlot[2])][2]) && (thisDyeSlot[0][3] == _root[whicharray][(thisDyeSlot[2])][3]) && (thisDyeSlot[0][4] == _root[whicharray][(thisDyeSlot[2])][4]) && (thisDyeSlot[0][5] == -1) && (_root[whicharray][(thisDyeSlot[2])][5] == -1) && (thisDyeSlot[0][6] == _root[whicharray][(thisDyeSlot[2])][6]) && (thisDyeSlot[0][7] == _root[whicharray][(thisDyeSlot[2])][7]) && (thisDyeSlot[0][8] == _root[whicharray][(thisDyeSlot[2])][8]) && (thisDyeSlot[0][9] == _root[whicharray][(thisDyeSlot[2])][9]) && (thisDyeSlot[0][10] == _root[whicharray][(thisDyeSlot[2])][10]) && (parseInt(thisDyeSlot[0][1]) + parseInt(_root[whicharray][(thisDyeSlot[2])][1]) <= maxitemsperslot))) && (thisDyeSlot[1] != "ishop")) {
										// ok to add
									} else if (canadditemtoinventory(thisDyeSlot[0][0], thisDyeSlot[0][1], thisDyeSlot[0][2], thisDyeSlot[0][3], thisDyeSlot[0][4], thisDyeSlot[0][5], thisDyeSlot[0][6], thisDyeSlot[0][7], thisDyeSlot[0][8], thisDyeSlot[0][9], thisDyeSlot[0][10]) != parseInt(thisDyeSlot[0][1])) {
										okToAddNewDye = false;
									}
								}
								if (okToAddNewDye) {
									var whicharray = arraySettoArray(thisDyeSlot[1]);
									if (thisDyeSlot[2] == "overflow") {
										// restore to overflow
										storedCraftedItem[0] = thisDyeSlot[0][0];
										storedCraftedItem[1] = thisDyeSlot[0][1];
										storedCraftedItem[2] = thisDyeSlot[0][2];
										storedCraftedItem[3] = thisDyeSlot[0][3];
										storedCraftedItem[4] = thisDyeSlot[0][4];
										storedCraftedItem[5] = thisDyeSlot[0][5];
										storedCraftedItem[6] = thisDyeSlot[0][6];
										storedCraftedItem[7] = thisDyeSlot[0][7];
										storedCraftedItem[8] = thisDyeSlot[0][8];
										storedCraftedItem[9] = thisDyeSlot[0][9];
										storedCraftedItem[10] = thisDyeSlot[0][10];
										showCraftingOverflow();
										slotsuccessful = -1;
										setsuccessful = "";
									} else if (_root[whicharray][(thisDyeSlot[2])][0] == 1) {
										_root[whicharray][(thisDyeSlot[2])][0] = thisDyeSlot[0][0];
										_root[whicharray][(thisDyeSlot[2])][1] = thisDyeSlot[0][1];
										_root[whicharray][(thisDyeSlot[2])][2] = thisDyeSlot[0][2];
										_root[whicharray][(thisDyeSlot[2])][3] = thisDyeSlot[0][3];
										_root[whicharray][(thisDyeSlot[2])][4] = thisDyeSlot[0][4];
										_root[whicharray][(thisDyeSlot[2])][5] = thisDyeSlot[0][5];
										_root[whicharray][(thisDyeSlot[2])][6] = thisDyeSlot[0][6];
										_root[whicharray][(thisDyeSlot[2])][7] = thisDyeSlot[0][7];
										_root[whicharray][(thisDyeSlot[2])][8] = thisDyeSlot[0][8];
										_root[whicharray][(thisDyeSlot[2])][9] = thisDyeSlot[0][9];
										_root[whicharray][(thisDyeSlot[2])][10] = thisDyeSlot[0][10];
										attachSingleInvIcon(thisDyeSlot[1],(thisDyeSlot[2]));
										slotsuccessful = parseInt(thisDyeSlot[2]);
										setsuccessful = thisDyeSlot[1];
									} else if (((thisDyeSlot[0][0] == _root[whicharray][(thisDyeSlot[2])][0]) && (thisDyeSlot[0][1] == _root[whicharray][(thisDyeSlot[2])][1]) && (thisDyeSlot[0][2] == _root[whicharray][(thisDyeSlot[2])][2]) && (thisDyeSlot[0][3] == _root[whicharray][(thisDyeSlot[2])][3]) && (thisDyeSlot[0][4] == _root[whicharray][(thisDyeSlot[2])][4]) && (thisDyeSlot[0][5] == -1) && (_root[whicharray][(thisDyeSlot[2])][5] == -1) && (thisDyeSlot[0][6] == _root[whicharray][(thisDyeSlot[2])][6]) && (thisDyeSlot[0][7] == _root[whicharray][(thisDyeSlot[2])][7]) && (thisDyeSlot[0][8] == _root[whicharray][(thisDyeSlot[2])][8]) && (thisDyeSlot[0][9] == _root[whicharray][(thisDyeSlot[2])][9]) && (thisDyeSlot[0][10] == _root[whicharray][(thisDyeSlot[2])][10]) && (parseInt(thisDyeSlot[0][1]) + parseInt(_root[whicharray][(thisDyeSlot[2])][1]) <= maxitemsperslot))) {
										// matching type then, just increase quantity:
										_root[whicharray][(thisDyeSlot[2])][1] = parseInt(_root[whicharray][(thisDyeSlot[2])][1]) + parseInt(thisDyeSlot[0][1]);
										gamedisplay.inventorysets[(thisDyeSlot[1])]["inventoryIcon" + thisDyeSlot[2]].quan.text = _root[whicharray][(thisDyeSlot[2])][1];
										slotsuccessful = parseInt(thisDyeSlot[2]);
										setsuccessful = thisDyeSlot[1];
									} else {
										additemtoinventory(thisDyeSlot[0][0],thisDyeSlot[0][1],thisDyeSlot[0][2],thisDyeSlot[0][3],thisDyeSlot[0][4],thisDyeSlot[0][5],thisDyeSlot[0][6],thisDyeSlot[0][7],thisDyeSlot[0][8],thisDyeSlot[0][9],thisDyeSlot[0][10]);
									}
									showItemAddedAnimation(thisDyeSlot[0][0]);
								} else {
									this._x = this.xorigin;
									this._y = this.yorigin;
									statusMessage("can't restore the current dye, please do this manually before adding a new dye");
								}
							}
							if (okToAddNewDye) {
								// add this dye to thisDyeSlot   
								if (quantitysplit) {
									thisDyeSlot = [_root[fromarray][splitParentItem].slice(), this.setRef, splitParentItem];
								} else if (fromWhichArraySlot == "overflow") {
									thisDyeSlot = [_root.storedCraftedItem.slice(), this.setRef, "overflow"];
								} else {
									thisDyeSlot = [_root[fromarray][fromWhichArraySlot].slice(), this.setRef, this.refID];
								}
								// correct quantity to be only 1:
								thisDyeSlot[0][1] = "1";
								// return any excess to parent slot and update inventory:
								if (quantitysplit) {
									if (beingmovedquantity > 1) {
										// restore excess to parent clip:
										_root[fromarray][splitParentItem][1] = parseInt(_root[fromarray][splitParentItem][1]) + (beingmovedquantity - 1);
										gamedisplay.inventorysets[this.setRef]["inventoryIcon" + splitParentItem].quan.text = _root[fromarray][splitParentItem][1];
									}
									gamedisplay.inventorysets[this.setRef]["inventoryIcon999"].removeMovieClip();
									quantitysplit = false;
								} else {
									if (_root[fromarray][fromWhichArraySlot][1] > 1) {
										if (fromWhichArraySlot == "overflow") {
											_root.storedCraftedItem[1] = parseInt(_root.storedCraftedItem[1]) - 1;
											gamedisplay.inventorysets.icrafting.overflowSlot.inventoryIconOverflow.quan.text = _root.storedCraftedItem[1];
										} else {
											_root[fromarray][fromWhichArraySlot][1] = parseInt(_root[fromarray][fromWhichArraySlot][1]) - 1;
											gamedisplay.inventorysets[this.setRef]["inventoryIcon" + this.refID].quan.text = _root[fromarray][fromWhichArraySlot][1];
										}
										this._x = this.xorigin;
										this._y = this.yorigin;
									} else {
										// remove this clip
										if (fromWhichArraySlot == "overflow") {
											gamedisplay.inventorysets.icrafting.overflowSlot.inventoryIconOverflow.removeMovieClip();
											_root.storedCraftedItem[0] = "1";
										} else {
											gamedisplay.inventorysets[this.setRef]["inventoryIcon" + this.refID].removeMovieClip();
											_root[fromarray][fromWhichArraySlot][0] = "1";
										}
									}
								}
								// remove any previous icon and attach new icon to dyeslot:
								gamedisplay.inventorysets.icrafting.inventoryIcondye.removeMovieClip();
								attachSingleCompIcon("dye",1);
							}
						} else {
							// snap back
							this._x = this.xorigin;
							this._y = this.yorigin;
						}
					} else {
						thisItemIsRequiredAsComponents = -1;
						for (var i = 0; i < thisRecipesComponents.length; i++) {
							// check if this item is in the same group as component required
							if (inventoryitems[(thisRecipesComponents[i][0])][12] == inventoryitems[(this.invIcons._currentframe)][12]) {
								// make sure that the item is equal to or greater in level than the recipe stated item
								// (otherwise inferior items could replace rare items):
								if (parseInt(inventoryitems[(thisRecipesComponents[i][0])][10]) >= parseInt(inventoryitems[(this.invIcons._currentframe)][10])) {
									// make sure the item isn't wrapped 
									if (this.wrapping == -1) {
										thisItemIsRequiredAsComponents = i;
										break;
									}
								}
							}
						}
						if (thisItemIsRequiredAsComponents != -1) {
							// check quantities  
							if (quantitysplit) {
								var quantityBeingAdded = beingmovedquantity;
							} else if (fromWhichArraySlot == "overflow") {
								var quantityBeingAdded = parseInt(_root.storedCraftedItem[1]);
							} else {
								var quantityBeingAdded = parseInt(_root[fromarray][fromWhichArraySlot][1]);
							}
							quantityOnThisSlot = 0;
							// see if this component type has already been added:
							if (quantitysplit) {
								var refToUse = splitParentItem;
							} else {
								var refToUse = fromWhichArraySlot;
							}
							for (var i = 0; i < componentsAdded.length; i++) {
								if (fromWhichArraySlot == "overflow") {
									if (componentsAdded[i][0][0] == _root.storedCraftedItem[0]) {
										quantityOnThisSlot += parseInt(componentsAdded[i][0][1]);
									}
								} else {
									if (componentsAdded[i][0][0] == _root[fromarray][refToUse][0]) {
										quantityOnThisSlot += parseInt(componentsAdded[i][0][1]);
									}
								}
							}
							var quantityRequired = parseInt(thisRecipesComponents[thisItemIsRequiredAsComponents][1]);
							// check if this component has already been added - if less than quantity required, increase quantty (if same quality etc.)
							// if not same quality etc. then loop through and take the lowest of each atribute for the component (without altering what's restored if they don't craft this item)
							// check for quantities that exceed the required amount:
							if (quantityBeingAdded > (quantityRequired - quantityOnThisSlot)) {
								excessQuantity = quantityBeingAdded - (quantityRequired - quantityOnThisSlot);
								quantityActuallyAdded = quantityRequired - quantityOnThisSlot;
								// restore these back to bag
								// check if bought from shop - need to be paid for if so ############
								// add to components added list (unless the slot is already full) - but then correct quantity
								if (quantityOnThisSlot != quantityRequired) {
									if (quantitysplit) {
										componentsAdded.push([[gamedisplay.inventorysets[this.setRef]["inventoryIcon" + this.refID].invIcons._currentframe, quantityActuallyAdded, gamedisplay.inventorysets[this.setRef]["inventoryIcon" + this.refID].qual._currentframe, gamedisplay.inventorysets[this.setRef]["inventoryIcon" + this.refID].dura, gamedisplay.inventorysets[this.setRef]["inventoryIcon" + this.refID].effec, gamedisplay.inventorysets[this.setRef]["inventoryIcon" + this.refID].wrapping, gamedisplay.inventorysets[this.setRef]["inventoryIcon" + this.refID].wear, gamedisplay.inventorysets[this.setRef]["inventoryIcon" + this.refID].col, gamedisplay.inventorysets[this.setRef]["inventoryIcon" + this.refID].enchant, gamedisplay.inventorysets[this.setRef]["inventoryIcon" + this.refID].hallmark, gamedisplay.inventorysets[this.setRef]["inventoryIcon" + this.refID].inscr], splitQuanFromSet, splitParentItem]);
									} else {
										if (fromWhichArraySlot == "overflow") {
											componentsAdded.push([_root.storedCraftedItem.slice(), this.setRef, this.refID]);
										} else {
											componentsAdded.push([_root[fromarray][fromWhichArraySlot].slice(), this.setRef, this.refID]);
										}
										componentsAdded[(componentsAdded.length - 1)][0][1] = quantityActuallyAdded;
									}
								}
								if (quantitysplit) {
									// restore the split quantity to its original slot:
									_root[fromarray][splitParentItem][1] += excessQuantity;
									gamedisplay.inventorysets[splitQuanFromSet]["inventoryIcon" + splitParentItem].quan.text = parseInt(_root[fromarray][splitParentItem][1]);
									gamedisplay.inventorysets[this.setRef]["inventoryIcon" + this.refID].removeMovieClip();
								} else {
									if (fromWhichArraySlot == "overflow") {
										_root.storedCraftedItem[1] = excessQuantity;
										gamedisplay.inventorysets.icrafting.overflowSlot.inventoryIconOverflow.quan.text = excessQuantity;
									} else {
										_root[fromarray][fromWhichArraySlot][1] = excessQuantity;
										gamedisplay.inventorysets[this.setRef]["inventoryIcon" + this.refID].quan.text = excessQuantity;
									}
									this._x = this.xorigin;
									this._y = this.yorigin;
								}
							} else {
								quantityActuallyAdded = quantityBeingAdded;
								// add to components added list ([component details][original array it came from][original slot if came from]):
								if (quantitysplit) {
									componentsAdded.push([[gamedisplay.inventorysets[this.setRef]["inventoryIcon" + this.refID].invIcons._currentframe, quantityBeingAdded, gamedisplay.inventorysets[this.setRef]["inventoryIcon" + this.refID].qual._currentframe, gamedisplay.inventorysets[this.setRef]["inventoryIcon" + this.refID].dura, gamedisplay.inventorysets[this.setRef]["inventoryIcon" + this.refID].effec, gamedisplay.inventorysets[this.setRef]["inventoryIcon" + this.refID].wrapping, gamedisplay.inventorysets[this.setRef]["inventoryIcon" + this.refID].wear, gamedisplay.inventorysets[this.setRef]["inventoryIcon" + this.refID].col, gamedisplay.inventorysets[this.setRef]["inventoryIcon" + this.refID].enchant, gamedisplay.inventorysets[this.setRef]["inventoryIcon" + this.refID].hallmark, gamedisplay.inventorysets[this.setRef]["inventoryIcon" + this.refID].inscr], splitQuanFromSet, splitParentItem]);
								} else {
									// NB use .slice to create a copy of the array and not a reference to it
									if (fromWhichArraySlot == "overflow") {
										componentsAdded.push([_root.storedCraftedItem.slice(), this.setRef, this.refID]);
									} else {
										componentsAdded.push([_root[fromarray][fromWhichArraySlot].slice(), this.setRef, this.refID]);
									}
									// remove from bag:
									if ((this.setRef == "iinv") || (this.setRef == "ipet")) {
										_root[fromarray][fromWhichArraySlot][0] = "1";
									} else if (this.setRef == "ishop") {
										// if item came from shop, then it needs paying for
										// ###########
									} else if (fromWhichArraySlot == "overflow") {
										_root.storedCraftedItem[0] = "1";
									}
								}
								if (fromWhichArraySlot == "overflow") {
									gamedisplay.inventorysets.icrafting.overflowSlot.inventoryIconOverflow.removeMovieClip();
								} else {
									gamedisplay.inventorysets[this.setRef]["inventoryIcon" + this.refID].removeMovieClip();
								}
							}
							if (quantityOnThisSlot > 0) {
								// update existing icon
								var displayQuantity = quantityActuallyAdded + quantityOnThisSlot;
								if (displayQuantity > quantityRequired) {
									displayQuantity = quantityRequired;
								}
								gamedisplay.inventorysets.icrafting["inventoryIcon" + thisItemIsRequiredAsComponents].quan.text = displayQuantity + "/" + quantityRequired;
							} else {
								// add new icon to components panel
								attachSingleCompIcon(thisItemIsRequiredAsComponents,quantityRequired);
							}
							//    
							// check if this is the final component - if all components have been added in correct quantites, then un-grey the 'start crafting' button:
							var totalAchieved:Boolean = true;
							for (var i = 0; i < thisRecipesComponents.length; i++) {
								var thisTotalQuantityRequired = parseInt(thisRecipesComponents[i][1]);
								for (var j = 0; j < componentsAdded.length; j++) {
									if (inventoryitems[parseInt(componentsAdded[j][0][0])][12] == inventoryitems[(thisRecipesComponents[i][0])][12]) {
										thisTotalQuantityRequired = thisTotalQuantityRequired - parseInt(componentsAdded[j][0][1]);
									}
								}
								if (thisTotalQuantityRequired != 0) {
									totalAchieved = false;
									break;
								}
							}
							if (totalAchieved) {
								gamedisplay.inventorysets.icrafting.craftingButton.gotoAndStop(2);
							}
						} else {
							// snap back
							this._x = this.xorigin;
							this._y = this.yorigin;
						}
					}
					quantitysplit = false;
				} else if (this._droptarget.toString().indexOf("iequip") != -1) {
					processEquipping(this);
				} else if (this._droptarget.toString().indexOf("ishop") != -1) {
					// was dropped on shop - check if it was dropped on the repair panel or not: (this takes priority over remaining actions)
					if (this._droptarget.toString().indexOf("repair") != -1) {
						if (quantitysplit) {
							// check item can be repaired:
							if (inventoryitems[(this.invIcons._currentframe)][2].indexOf("R") != -1) {
								// check the repaired item can be stored (as will have a different attribute to its parent now)
								if (canadditemtoinventory(this.invIcons._currentframe, beingmovedquantity, this.qual._currentframe, this.dura, this.effec, this.wrapping, 0, this.col, this.enchant, this.hallmark, this.inscr) == beingmovedquantity) {
									var moneyRequired = mceil(getRepairCost(this.invIcons._currentframe, beingmovedquantity, this.wear, this.dura));
									if (money >= moneyRequired) {
										money -= moneyRequired;
										gradeItemsForSale();
										updatemoney();
										additemtoinventory(this.invIcons._currentframe,beingmovedquantity,this.qual._currentframe,this.dura,this.effec,this.wrapping,0,this.col,this.enchant,this.hallmark,this.inscr);
										showItemAddedAnimation(this.invIcons._currentframe);
									} else {
										statusMessage("can't afford to repair this item");
										// restore quantity back to parent:
										_root[fromarray][splitParentItem][1] = parseInt(_root[fromarray][splitParentItem][1]) + beingmovedquantity;
										gamedisplay.inventorysets[this.setRef]["inventoryIcon" + splitParentItem].quan.text = _root[fromarray][splitParentItem][1];
									}
								} else {
									statusMessage("no room in inventory for this item once repaired");
									// restore quantity back to parent:
									_root[fromarray][splitParentItem][1] = parseInt(_root[fromarray][splitParentItem][1]) + beingmovedquantity;
									gamedisplay.inventorysets[this.setRef]["inventoryIcon" + splitParentItem].quan.text = _root[fromarray][splitParentItem][1];
								}
							} else {
								statusMessage("this item can't be repaired");
								// restore quantity back to parent:
								_root[fromarray][splitParentItem][1] = parseInt(_root[fromarray][splitParentItem][1]) + beingmovedquantity;
								gamedisplay.inventorysets[this.setRef]["inventoryIcon" + splitParentItem].quan.text = _root[fromarray][splitParentItem][1];
							}
							// remove split quan clip:
							gamedisplay.inventorysets[this.setRef]["inventoryIcon" + this.refID].removeMovieClip();
						} else {
							// check item can be repaired:
							if (inventoryitems[(this.invIcons._currentframe)][2].indexOf("R") != -1) {
								var moneyRequired = mceil(getRepairCost(this.invIcons._currentframe, parseInt(this.quan.text), this.wear, this.dura));
								if (money >= moneyRequired) {
									money -= moneyRequired;
									gradeItemsForSale();
									updatemoney();
									this.wear = 0;
									_root[fromarray][this.refID][6] = 0;
									// update tooltip info:
									this.iconDesc = inventoryitems[(parseInt(_root[fromarray][this.refID][0]))][1] + "\nEffectiveness: " + _root[fromarray][this.refID][4] + "\nUses: " + (_root[fromarray][this.refID][3] - _root[fromarray][this.refID][6]) + "/" + _root[fromarray][this.refID][3];
									if (this.inscr != "-") {
										var messageSplit = this.inscr.split("[**]");
										this.iconDesc += "\n\"" + messageSplit[0] + "\"";
									}
								} else {
									statusMessage("can't afford to repair this item");
								}
							} else {
								statusMessage("this item can't be repaired");
							}
							// restore dragged element:
							this._x = this.xorigin;
							this._y = this.yorigin;
						}
					} else {
						//  sell item(s) - make sure the item wasn't dragged from the shop to start with:
						if (this.setRef == "ishop") {
							// was dragged from shop, but not released over iinv or ipet, so just snap back to shop
							this._x = this.xorigin;
							this._y = this.yorigin;
						} else {
							checkItemisUniqueOrQuest(this,"sold");
							if (itemCanBeDroppedorSold) {
								saleprice = (parseInt(this.priceCode)) * (parseInt(this.quan.text));
								// ############# check for regional price modifiers here:
								money += saleprice;
								gradeItemsForSale();
								updatemoney();
								lastSoldItems.unshift([[this.invIcons._currentframe, this.quan.text, this.qual._currentframe, this.dura, this.effec, this.wrapping, this.wear, this.col, this.enchant, this.hallmark, this.inscr], saleprice]);
								if (lastSoldItems.length > maximumSoldItemHistory) {
									// remove oldest in queue:
									lastSoldItems.pop();
								}
								if (!(quantitysplit)) {
									// remove item:
									_root[fromarray][this.refID][0] = "1";
									gamedisplay.inventorysets[this.setRef]["inventoryIcon" + this.refID].removeMovieClip();
								} else {
									gamedisplay.inventorysets[this.setRef]["inventoryIcon" + this.refID].removeMovieClip();
								}
								quantitysplit = false;
								// visually update slot (remove existing clip first):   
								gamedisplay.inventorysets.ishop["inventoryIcon" + lastSoldItemSlot].removeMovieClip();
								shopcontents[lastSoldItemSlot] = lastSoldItems[0][0];
								attachSingleInvIcon("ishop",lastSoldItemSlot);
							}
						}
					}
				} else if ((inventoryitems[(parseInt(_root[fromarray][fromWhichArraySlot][0]))][2] == "£") && ((this._droptarget.toString().indexOf("iinv") != -1) || (this._droptarget.toString().indexOf("ipet") != -1) || (this._droptarget.toString().indexOf("iequip") != -1))) {
					// check if it was money and if the drop set is either the inventory, pet inventory or the equip slot:
					money += parseInt(_root[fromarray][fromWhichArraySlot][1]);
					updatemoney();
					// remove from the first array :
					_root[fromarray][fromWhichArraySlot][0] = "1";
					gamedisplay.inventorysets[this.setRef]["inventoryIcon" + this.refID].removeMovieClip();
				} else if (this.setRef == "ishop" && ((this._droptarget.toString().indexOf("iinv") != -1) || (this._droptarget.toString().indexOf("ipet") != -1))) {
					// item has been dragged from the shop to either the inventory or pet inventory - so buy this item:
					if (this._alpha != 50) {
						findInventorySet();
						// check if this is on the previously sold slot:
						var thisInvSlotsName = this._name;
						var thisInvSlotsNumber = (parseInt(thisInvSlotsName.substring(13)));
						// determine if it was dropped over an empty slot or not:
						toWhichArraySlot = parseInt(dropTargetsName.substring(indexOfSlot + 4));
						if (indexOfSlot != -1) {
							// determine if this slot is empty:
							if (_root[droparray][toWhichArraySlot][0] == "1") {
								_root[droparray][toWhichArraySlot][0] = this.invIcons._currentframe;
								var costofitem:Number = parseInt(this.priceCode);
								var checkingSlotNumber = thisInvSlotsNumber;
								if (quantitysplit) {
									var checkingSlotNumber = splitParentItem;
								}
								if (checkingSlotNumber == lastSoldItemSlot) {
									costofitem = parseInt(lastSoldItems[0][1]);
									if (quantitysplit) {
										_root[droparray][toWhichArraySlot][1] = beingmovedquantity;
										costofitem = mceil(costofitem * (beingmovedquantity / parseInt(lastSoldItems[0][0][1])));
									} else {
										_root[droparray][toWhichArraySlot][1] = parseInt(lastSoldItems[0][0][1]);
									}
								} else {
									if (quantitysplit) {
										_root[droparray][toWhichArraySlot][1] = beingmovedquantity;
										costofitem *= beingmovedquantity;
									} else {
										_root[droparray][toWhichArraySlot][1] = 1;
									}
								}
								_root[droparray][toWhichArraySlot][2] = this.qual._currentframe;
								_root[droparray][toWhichArraySlot][3] = this.dura;
								_root[droparray][toWhichArraySlot][4] = this.effec;
								_root[droparray][toWhichArraySlot][5] = this.wrapping;
								_root[droparray][toWhichArraySlot][6] = this.wear;
								_root[droparray][toWhichArraySlot][7] = this.col;
								_root[droparray][toWhichArraySlot][8] = this.enchant;
								_root[droparray][toWhichArraySlot][9] = this.hallmark;
								_root[droparray][toWhichArraySlot][10] = this.inscr;
								money -= costofitem;
								updatemoney();
								gradeItemsForSale();
								if (checkingSlotNumber == lastSoldItemSlot) {
									if (quantitysplit) {
										// alter price required for remaining items
										lastSoldItems[0][1] = parseInt(lastSoldItems[0][1]) - costofitem;
										lastSoldItems[0][0][1] = parseInt(lastSoldItems[0][0][1]) - beingmovedquantity;
										this.removeMovieClip();
										if (lastSoldItems[0][0][1] == 0) {
											// remove this from the array now 
											lastSoldItems.shift();
											if (lastSoldItems.length != 0) {
												// attach next clip
												shopcontents[lastSoldItemSlot] = lastSoldItems[0][0];
												attachSingleInvIcon("ishop",lastSoldItemSlot);
											}
										}
									} else {
										this.removeMovieClip();
										// remove this from the array now 
										lastSoldItems.shift();
										if (lastSoldItems.length != 0) {
											// attach next clip
											shopcontents[lastSoldItemSlot] = lastSoldItems[0][0];
											attachSingleInvIcon("ishop",lastSoldItemSlot);
										}
									}
								} else {
									if (quantitysplit) {
										// remove the floating icon
										gamedisplay.inventorysets[this.setRef]["inventoryIcon" + this.refID].removeMovieClip();
									} else {
										// restore original clip to the shop:                     
										this._x = this.xorigin;
										this._y = this.yorigin;
									}
								}
								// visually update:
								if (droparray == "inventory") {
									for (var checkInvClip in gamedisplay.inventorysets.iinv) {
										// check it's an inventory icon:
										if (gamedisplay.inventorysets.iinv[checkInvClip]._name.indexOf("inventoryIcon") != -1) {
											gamedisplay.inventorysets.iinv[checkInvClip].removeMovieClip();
										}
									}
									whicharray = "inventory";
									settoggle = "iinv";
									numberofslotstoadd = currentbagsize;
									populateInventorySet();
								} else if (droparray == "petcarrying") {
									for (var checkInvClip in gamedisplay.inventorysets.ipet) {
										// check it's an inventory icon:
										if (gamedisplay.inventorysets.ipet[checkInvClip]._name.indexOf("inventoryIcon") != -1) {
											gamedisplay.inventorysets.ipet[checkInvClip].removeMovieClip();
										}
									}
									whicharray = "petcarrying";
									settoggle = "ipet";
									numberofslotstoadd = petcarrying.length;
									populateInventorySet();
								}
							} else {
								// see if item can be added somewhere else:
								var costofitem:Number = parseInt(this.priceCode);
								if (thisInvSlotsNumber == lastSoldItemSlot) {
									costofitem = parseInt(lastSoldItems[0][1]);
									if (quantitysplit) {
										canAddQuantity = beingmovedquantity;
										costofitem = mceil(costofitem * (beingmovedquantity / parseInt(lastSoldItems[0][0][1])));
									} else {
										canAddQuantity = parseInt(lastSoldItems[0][0][1]);
										costofitem = parseInt(lastSoldItems[0][1]);
									}
								} else {
									if (quantitysplit) {
										canAddQuantity = parseInt(beingmovedquantity);
										costofitem *= canAddQuantity;
									} else {
										canAddQuantity = 1;
									}
								}
								if (canadditemtoinventory(this.invIcons._currentframe, canAddQuantity, this.qual._currentframe, this.dura, this.effec, this.wrapping, this.wear, this.col, this.enchant, this.hallmark, this.inscr) == canAddQuantity) {
									money -= costofitem;
									updatemoney();
									gradeItemsForSale();
									additemtoinventory(this.invIcons._currentframe,canAddQuantity,this.qual._currentframe,this.dura,this.effec,this.wrapping,this.wear,this.col,this.enchant,this.hallmark,this.inscr);
									showItemAddedAnimation(this.invIcons._currentframe);
								} else {
									statusMessage("no room in inventory");
								}
								if (thisInvSlotsNumber == lastSoldItemSlot) {
									// remove this from the array now
									lastSoldItems.shift();
									this.removeMovieClip();
									if (lastSoldItems.length != 0) {
										// attach next clip
										shopcontents[lastSoldItemSlot] = lastSoldItems[0][0];
										attachSingleInvIcon("ishop",lastSoldItemSlot);
									}
								} else {
									if (quantitysplit) {
										// remove the floating icon
										gamedisplay.inventorysets[this.setRef]["inventoryIcon" + this.refID].removeMovieClip();
									} else {
										// restore original clip to the shop:                     
										this._x = this.xorigin;
										this._y = this.yorigin;
									}
								}
							}
						} else if ((_root[droparray][toWhichArraySlot][0] == this.invIcons._currentframe) && (_root[droparray][toWhichArraySlot][2] == this.qual._currentframe) && (_root[droparray][toWhichArraySlot][3] == this.dura) && (_root[droparray][toWhichArraySlot][4] == this.effec) && (_root[droparray][toWhichArraySlot][5] == -1) && (this.wrapping == -1) && (_root[droparray][toWhichArraySlot][6] == this.wear) && (_root[droparray][toWhichArraySlot][7] == this.col) && (_root[droparray][toWhichArraySlot][8] == this.enchant) && (_root[droparray][toWhichArraySlot][9] == this.hallmark) && (_root[droparray][toWhichArraySlot][10] == this.inscr) && (parseInt(_root[droparray][toWhichArraySlot][1]) <= maxitemsperslot)) {
							if (quantitysplit) {
								canAddQuantity = parseInt(beingmovedquantity);
							} else {
								canAddQuantity = 1;
							}
							// item was dropped over a slot with identical properties and the slot's quantity allows this new addition
							_root[droparray][toWhichArraySlot][1] = parseInt(_root[droparray][toWhichArraySlot][1]) + canAddQuantity;
							var costofitem:Number = parseInt(this.priceCode);
							costofitem *= canAddQuantity;
							money -= costofitem;
							updatemoney();
							gradeItemsForSale();
							// visually update:
							gamedisplay.inventorysets[droppedInvSet]["inventoryIcon" + toWhichArraySlot].quan.text = _root[droparray][toWhichArraySlot][1];
							if (quantitysplit) {
								// remove the floating icon
								gamedisplay.inventorysets[this.setRef]["inventoryIcon" + this.refID].removeMovieClip();
							} else {
								// restore original clip to the shop:                     
								this._x = this.xorigin;
								this._y = this.yorigin;
							}
						} else {
							// see if item can be added somewhere:
							var costofitem:Number = parseInt(this.priceCode);
							var checkingSlotNumber = thisInvSlotsNumber;
							if (quantitysplit) {
								var checkingSlotNumber = splitParentItem;
							}
							if (checkingSlotNumber == lastSoldItemSlot) {
								costofitem = parseInt(lastSoldItems[0][1]);
								if (quantitysplit) {
									canAddQuantity = beingmovedquantity;
									costofitem = mceil(costofitem * (beingmovedquantity / parseInt(lastSoldItems[0][0][1])));
								} else {
									canAddQuantity = parseInt(lastSoldItems[0][0][1]);
									costofitem = parseInt(lastSoldItems[0][1]);
								}
							} else {
								if (quantitysplit) {
									canAddQuantity = parseInt(beingmovedquantity);
									costofitem *= canAddQuantity;
								} else {
									canAddQuantity = 1;
								}
							}
							if (canadditemtoinventory(this.invIcons._currentframe, canAddQuantity, this.qual._currentframe, this.dura, this.effec, this.wrapping, this.wear, this.col, this.enchant, this.hallmark, this.inscr) == canAddQuantity) {
								money -= costofitem;
								updatemoney();
								gradeItemsForSale();
								additemtoinventory(this.invIcons._currentframe,canAddQuantity,this.qual._currentframe,this.dura,this.effec,this.wrapping,this.wear,this.col,this.enchant,this.hallmark,this.inscr);
								showItemAddedAnimation(this.invIcons._currentframe);
							} else {
								statusMessage("no room in inventory");
							}
							if (checkingSlotNumber == lastSoldItemSlot) {
								if (quantitysplit) {
									// alter price required for remaining items
									lastSoldItems[0][1] = parseInt(lastSoldItems[0][1]) - costofitem;
									lastSoldItems[0][0][1] = parseInt(lastSoldItems[0][0][1]) - beingmovedquantity;
									this.removeMovieClip();
									if (lastSoldItems[0][0][1] == 0) {
										// remove this from the array now 
										lastSoldItems.shift();
										if (lastSoldItems.length != 0) {
											// attach next clip
											shopcontents[lastSoldItemSlot] = lastSoldItems[0][0];
											attachSingleInvIcon("ishop",lastSoldItemSlot);
										}
									}
								} else {
									this.removeMovieClip();
									// remove this from the array now 
									lastSoldItems.shift();
									if (lastSoldItems.length != 0) {
										// attach next clip
										shopcontents[lastSoldItemSlot] = lastSoldItems[0][0];
										attachSingleInvIcon("ishop",lastSoldItemSlot);
									}
								}
							} else {
								if (quantitysplit) {
									// remove the floating icon
									gamedisplay.inventorysets[this.setRef]["inventoryIcon" + this.refID].removeMovieClip();
								} else {
									// restore original clip to the shop:                     
									this._x = this.xorigin;
									this._y = this.yorigin;
								}
							}
						}
					} else {
						statusMessage("you can't afford this");
					}
				} else if (this.setRef == "ishop") {
					// was dragged from shop, but not released over the shop, iinv or ipet, so just snap back to shop
					if (quantitysplit) {
						// remove the floating icon
						gamedisplay.inventorysets[this.setRef]["inventoryIcon" + this.refID].removeMovieClip();
					} else {
						this._x = this.xorigin;
						this._y = this.yorigin;
					}
				} else if (indexOfSlot != -1) {
					// snap to this slot:
					this._x = thisDropTarget._x + (invtilewidth / 2);
					this._y = thisDropTarget._y + (invtileheight / 2);
					findInventorySet();
					// determine which slot was dropped in to: (use indexOfSlot+4 to remove the word "slot")
					toWhichArraySlot = parseInt(dropTargetsName.substring(indexOfSlot + 4));
					if (quantitysplit) {
						_root[droparray][toWhichArraySlot][0] = this.invIcons._currentframe;
						_root[droparray][toWhichArraySlot][1] = beingmovedquantity;
						_root[droparray][toWhichArraySlot][2] = this.qual._currentframe;
						_root[droparray][toWhichArraySlot][3] = this.dura;
						_root[droparray][toWhichArraySlot][4] = this.effec;
						_root[droparray][toWhichArraySlot][5] = this.wrapping;
						_root[droparray][toWhichArraySlot][6] = this.wear;
						_root[droparray][toWhichArraySlot][7] = this.col;
						_root[droparray][toWhichArraySlot][8] = this.enchant;
						_root[droparray][toWhichArraySlot][9] = this.hallmark;
						_root[droparray][toWhichArraySlot][10] = this.inscr;
						// remove floating clip and add new standard icon in its place
						gamedisplay.inventorysets[this.setRef]["inventoryIcon" + this.refID].removeMovieClip();
						attachSingleInvIcon(droppedInvSet,toWhichArraySlot);
						quantitysplit = false;
					} else {
						// make sure the user hasn't just pressed and released (or double clicked) the icon without dragging
						if (beingDragged) {
							// check that the icon wasn't dropped back to its original slot: 
							if (!((droparray == fromarray) && (toWhichArraySlot == fromWhichArraySlot))) {
								if (fromWhichArraySlot == "overflow") {
									// add to the second array: 
									_root[droparray][toWhichArraySlot][0] = _root.storedCraftedItem[0];
									_root[droparray][toWhichArraySlot][1] = _root.storedCraftedItem[1];
									_root[droparray][toWhichArraySlot][2] = _root.storedCraftedItem[2];
									_root[droparray][toWhichArraySlot][3] = _root.storedCraftedItem[3];
									_root[droparray][toWhichArraySlot][4] = _root.storedCraftedItem[4];
									_root[droparray][toWhichArraySlot][5] = _root.storedCraftedItem[5];
									_root[droparray][toWhichArraySlot][6] = _root.storedCraftedItem[6];
									_root[droparray][toWhichArraySlot][7] = _root.storedCraftedItem[7];
									_root[droparray][toWhichArraySlot][8] = _root.storedCraftedItem[8];
									_root[droparray][toWhichArraySlot][9] = _root.storedCraftedItem[9];
									_root[droparray][toWhichArraySlot][10] = _root.storedCraftedItem[10];
									// remove from the first array :
									_root.storedCraftedItem[0] = "1";
								} else {
									// add to the second array: 
									_root[droparray][toWhichArraySlot][0] = _root[fromarray][fromWhichArraySlot][0];
									_root[droparray][toWhichArraySlot][1] = _root[fromarray][fromWhichArraySlot][1];
									_root[droparray][toWhichArraySlot][2] = _root[fromarray][fromWhichArraySlot][2];
									_root[droparray][toWhichArraySlot][3] = _root[fromarray][fromWhichArraySlot][3];
									_root[droparray][toWhichArraySlot][4] = _root[fromarray][fromWhichArraySlot][4];
									_root[droparray][toWhichArraySlot][5] = _root[fromarray][fromWhichArraySlot][5];
									_root[droparray][toWhichArraySlot][6] = _root[fromarray][fromWhichArraySlot][6];
									_root[droparray][toWhichArraySlot][7] = _root[fromarray][fromWhichArraySlot][7];
									_root[droparray][toWhichArraySlot][8] = _root[fromarray][fromWhichArraySlot][8];
									_root[droparray][toWhichArraySlot][9] = _root[fromarray][fromWhichArraySlot][9];
									_root[droparray][toWhichArraySlot][10] = _root[fromarray][fromWhichArraySlot][10];
									// remove from the first array :
									_root[fromarray][fromWhichArraySlot][0] = "1";
								}
							}
							//                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
							if (droparray != fromarray) {
								// remove the clip from the old set and attach it to the new set:
								if (fromWhichArraySlot == "overflow") {
									gamedisplay.inventorysets.icrafting.overflowSlot.inventoryIconOverflow.removeMovieClip();
								} else {
									gamedisplay.inventorysets[this.setRef]["inventoryIcon" + this.refID].removeMovieClip();
								}
								attachSingleInvIcon(droppedInvSet,toWhichArraySlot);
							} else {
								// change the clip's refID and its name to point to the new slot
								this.refID = toWhichArraySlot;
								this._name = "inventoryIcon" + toWhichArraySlot;
							}
						}
					}
				} else if (indexOfInvIcon != -1) {
					// determine which slot was dropped in to: (use indexOfInvIcon+13 to remove the word "inventoryIcon")
					// has been dropped on another icon
					findInventorySet();
					if (!quantitysplit) {
						if (fromWhichArraySlot == "overflow") {
							var thisFromArrayRef = _root.storedCraftedItem;
						} else {
							var thisFromArrayRef = _root[fromarray][fromWhichArraySlot];
						}
						// check for item combine:
						itemsCombineToMake = -1;
						// need to be of the same quantity:
						if (_root[droparray][toWhichArraySlot][1] == thisFromArrayRef[1]) {
							// make sure neither are wrapped:
							if ((thisFromArrayRef[5] == -1) && (_root[droparray][toWhichArraySlot][5] == -1)) {
								for (var ci = 0; ci < combineTable.length; ci++) {
									if ((_root[droparray][toWhichArraySlot][0]) == combineTable[ci][0]) {
										if (thisFromArrayRef[0] == combineTable[ci][1]) {
											itemsCombineToMake = combineTable[ci][2];
											break;
										}
									} else if (thisFromArrayRef[0] == combineTable[ci][0]) {
										if ((_root[droparray][toWhichArraySlot][0]) == combineTable[ci][1]) {
											itemsCombineToMake = combineTable[ci][2];
											break;
										}
									}
								}
							}
						}
						if (itemsCombineToMake != -1) {
							// snap dragged icon to the slot while player decides what to do:
							this._x = thisDroppedOverIcon._x;
							this._y = thisDroppedOverIcon._y;
							waitingforresponse = 1;
							confirmAction = "confirmingItemCombine";
							storedSetRef = this.setRef;
							storedRefID = this.refID;
							gamedisplay.responsebox.choices = [];
							gamedisplay.responsebox.choices.push("yes, combine","no, don't combine");
							displaytext("combine " + inventoryitems[(_root[droparray][toWhichArraySlot][0])][0] + " with " + inventoryitems[(thisFromArrayRef[0])][0] + " to produce " + inventoryitems[itemsCombineToMake][0] + "?",-1,false);
						} else {
							// check if these items can stack (same type, same quality, same durabilty, same effectivness and not wrapped): 
							if ((_root[droparray][toWhichArraySlot][0] == thisFromArrayRef[0]) && (_root[droparray][toWhichArraySlot][2] == thisFromArrayRef[2]) && (_root[droparray][toWhichArraySlot][3] == thisFromArrayRef[3]) && (_root[droparray][toWhichArraySlot][4] == thisFromArrayRef[4]) && (thisFromArrayRef[5] == -1) && (_root[droparray][toWhichArraySlot][5] == -1) && (_root[droparray][toWhichArraySlot][6] == thisFromArrayRef[6]) && (_root[droparray][toWhichArraySlot][7] == thisFromArrayRef[7]) && (_root[droparray][toWhichArraySlot][8] == thisFromArrayRef[8]) && (_root[droparray][toWhichArraySlot][9] == thisFromArrayRef[9]) && (_root[droparray][toWhichArraySlot][10] == thisFromArrayRef[10])) {
								// check if combined total exceeds stack maximum:
								combinedTotal = parseInt(_root[droparray][toWhichArraySlot][1]) + parseInt(thisFromArrayRef[1]);
								if (combinedTotal <= maxitemsperslot) {
									// clear dragged item
									thisFromArrayRef[0] = "1";
									// remove clip:
									if (fromWhichArraySlot == "overflow") {
										gamedisplay.inventorysets.icrafting.overflowSlot.inventoryIconOverflow.removeMovieClip();
									} else {
										gamedisplay.inventorysets[this.setRef]["inventoryIcon" + this.refID].removeMovieClip();
									}
									// increase dropped clip's quantity
									_root[droparray][toWhichArraySlot][1] = combinedTotal;
									gamedisplay.inventorysets[droppedInvSet]["inventoryIcon" + toWhichArraySlot].quan.text = combinedTotal;
								} else {
									this._x = this.xorigin;
									this._y = this.yorigin;
									thisFromArrayRef[1] = combinedTotal - maxitemsperslot;
									gamedisplay.inventorysets[this.setRef]["inventoryIcon" + fromWhichArraySlot].quan.text = combinedTotal - maxitemsperslot;
									_root[droparray][toWhichArraySlot][1] = maxitemsperslot;
									gamedisplay.inventorysets[droppedInvSet]["inventoryIcon" + toWhichArraySlot].quan.text = maxitemsperslot;
								}
							} else {
								if (fromWhichArraySlot == "overflow") {
									// don't swap items, but see if the overflow will fit into another slot in this set:
									if (canadditemtoinventory(_root.storedCraftedItem[0], _root.storedCraftedItem[1], _root.storedCraftedItem[2], _root.storedCraftedItem[3], _root.storedCraftedItem[4], _root.storedCraftedItem[5], _root.storedCraftedItem[6], _root.storedCraftedItem[7], _root.storedCraftedItem[8], _root.storedCraftedItem[9], _root.storedCraftedItem[10]) == parseInt(_root.storedCraftedItem[1])) {
										// add to array and update visually
										additemtoinventory(_root.storedCraftedItem[0],_root.storedCraftedItem[1],_root.storedCraftedItem[2],_root.storedCraftedItem[3],_root.storedCraftedItem[4],_root.storedCraftedItem[5],_root.storedCraftedItem[6],_root.storedCraftedItem[7],_root.storedCraftedItem[8],_root.storedCraftedItem[9],_root.storedCraftedItem[10]);
										showItemAddedAnimation(_root.storedCraftedItem[0]);
										gamedisplay.inventorysets.icrafting.overflowSlot.inventoryIconOverflow.removeMovieClip();
									} else {
										// snap back:
										this._x = this.xorigin;
										this._y = this.yorigin;
									}
								} else {
									findInventorySet();
									swapIcons(this);
								}
							}
						}
					} else {
						// check for item combine:
						itemsCombineToMake = -1;
						// need to be of the same quantity:
						if (_root[droparray][toWhichArraySlot][1] == beingmovedquantity) {
							// make sure neither are wrapped:
							if ((_root[fromarray][splitParentItem][5] == -1) && (_root[droparray][toWhichArraySlot][5] == -1)) {
								for (var ci = 0; ci < combineTable.length; ci++) {
									if ((_root[droparray][toWhichArraySlot][0]) == combineTable[ci][0]) {
										if (_root[fromarray][splitParentItem][0] == combineTable[ci][1]) {
											itemsCombineToMake = combineTable[ci][2];
											break;
										}
									} else if (_root[fromarray][splitParentItem][0] == combineTable[ci][0]) {
										if ((_root[droparray][toWhichArraySlot][0]) == combineTable[ci][1]) {
											itemsCombineToMake = combineTable[ci][2];
											break;
										}
									}
								}
							}
						}
						if (itemsCombineToMake != -1) {
							// snap dragged icon to the slot while player decides what to do:
							this._x = thisDroppedOverIcon._x;
							this._y = thisDroppedOverIcon._y;
							waitingforresponse = 1;
							confirmAction = "confirmingItemCombine";
							storedSetRef = this.setRef;
							storedRefID = this.refID;
							gamedisplay.responsebox.choices = [];
							gamedisplay.responsebox.choices.push("yes, combine","no, don't combine");
							displaytext("combine " + inventoryitems[(_root[droparray][toWhichArraySlot][0])][0] + " with " + inventoryitems[(thisFromArrayRef[0])][0] + " to produce " + inventoryitems[itemsCombineToMake][0] + "?",-1,false);
						} else {
							// check if these items can stack (same type and same quality etc and not wrapped):
							if ((_root[droparray][toWhichArraySlot][0] == this.invIcons._currentframe) && (_root[droparray][toWhichArraySlot][2] == this.qual._currentframe) && (_root[droparray][toWhichArraySlot][3] == this.dura) && (_root[droparray][toWhichArraySlot][4] == this.effec) && (_root[droparray][toWhichArraySlot][5] == -1) && (this.wrapping == -1) && (_root[droparray][toWhichArraySlot][6] == this.wear) && (_root[droparray][toWhichArraySlot][7] == this.col) && (_root[droparray][toWhichArraySlot][8] == this.enchant) && (_root[droparray][toWhichArraySlot][9] == this.hallmark) && (_root[droparray][toWhichArraySlot][10] == this.inscr)) {
								// check if combined total exceeds stack maximum:
								combinedTotal = parseInt(_root[droparray][toWhichArraySlot][1]) + beingmovedquantity;
								if (combinedTotal <= maxitemsperslot) {
									_root[droparray][toWhichArraySlot][1] = combinedTotal;
									gamedisplay.inventorysets[droppedInvSet]["inventoryIcon" + toWhichArraySlot].quan.text = combinedTotal;
									gamedisplay.inventorysets[this.setRef]["inventoryIcon" + this.refID].removeMovieClip();
								} else {
									_root[droparray][toWhichArraySlot][1] = maxitemsperslot;
									_root[fromarray][splitParentItem][1] = parseInt(_root[fromarray][splitParentItem][1]) + combinedTotal - maxitemsperslot;
									gamedisplay.inventorysets[droppedInvSet]["inventoryIcon" + toWhichArraySlot].quan.text = maxitemsperslot;
									gamedisplay.inventorysets[this.setRef]["inventoryIcon" + splitParentItem].quan.text = _root[fromarray][splitParentItem][1];
									gamedisplay.inventorysets[this.setRef]["inventoryIcon" + this.refID].removeMovieClip();
								}
							} else {
								// restore the split quantity to its original slot:
								_root[fromarray][splitParentItem][1] += beingmovedquantity;
								gamedisplay.inventorysets[this.setRef]["inventoryIcon" + splitParentItem].quan.text = parseInt(_root[fromarray][splitParentItem][1]);
								gamedisplay.inventorysets[this.setRef]["inventoryIcon" + this.refID].removeMovieClip();
							}
							quantitysplit = false;
						}
					}
				} else if ((this._droptarget.toString().indexOf("iinv") != -1) || (this._droptarget.toString().indexOf("ipet") != -1) || (this._droptarget.toString().indexOf("iequip") != -1) || (this._droptarget.toString().indexOf("ichest") != -1) || (this._droptarget.toString().indexOf("ibank") != -1)) {
					// was dropped over an inventory set, but not over a slot or another icon, so just snap back to origin - unless dragged from overflow:
					if (fromWhichArraySlot == "overflow") {
						if (canadditemtoinventory(_root.storedCraftedItem[0], _root.storedCraftedItem[1], _root.storedCraftedItem[2], _root.storedCraftedItem[3], _root.storedCraftedItem[4], _root.storedCraftedItem[5], _root.storedCraftedItem[6], _root.storedCraftedItem[7], _root.storedCraftedItem[8], _root.storedCraftedItem[9], _root.storedCraftedItem[10]) == parseInt(_root.storedCraftedItem[1])) {
							// add to array and update visually
							additemtoinventory(_root.storedCraftedItem[0],_root.storedCraftedItem[1],_root.storedCraftedItem[2],_root.storedCraftedItem[3],_root.storedCraftedItem[4],_root.storedCraftedItem[5],_root.storedCraftedItem[6],_root.storedCraftedItem[7],_root.storedCraftedItem[8],_root.storedCraftedItem[9],_root.storedCraftedItem[10]);
							showItemAddedAnimation(_root.storedCraftedItem[0]);
							gamedisplay.inventorysets.icrafting.overflowSlot.inventoryIconOverflow.removeMovieClip();
						} else {
							// snap back:
							this._x = this.xorigin;
							this._y = this.yorigin;
						}
					} else {
						this._x = this.xorigin;
						this._y = this.yorigin;
					}
				} else {
					// item not dragged to any known location, so player may want to drop the item
					checkItemisUniqueOrQuest(this,"dropped here");
					if (itemCanBeDroppedorSold) {
						if (!(isinplayershouse)) {
							// is not in player's house, drop item - confirm player wants to lose item:
							waitingforresponse = 1;
							confirmAction = "confirmingItemDrop";
							storedSetRef = this.setRef;
							storedRefID = this.refID;
							if (parseInt(_root[fromarray][this.refID][1]) == 1) {
								// is only 1 item being moved:
								gamedisplay.responsebox.choices = [];
								gamedisplay.responsebox.choices.push("drop item","keep item");
								displaytext("dropping this item here will mean it is lost forever - continue?",-1,false);
							} else {
								//gamedisplay.responsebox.choice1 = "drop items";
								//gamedisplay.responsebox.choice2 = "keep items";
								gamedisplay.responsebox.choices = [];
								gamedisplay.responsebox.choices.push("drop items","keep items");
								displaytext("dropping these items here will mean there are lost forever - continue?",-1,false);
							}
						} else {
							// placed item in player's house #############
						}
					}
				}
			}
		}
		if (doubleClicked) {
			// ensure that the icon can't be triple clicked:
			this.lastTime = -9999;
		} else {
			this.lastTime = this.now;
		}
		splitQuantityAllMoved = false;
	}
}
//
function allowDrag(whichClip, whichSet) {
	clearInterval(_root.allowDragTimer);
	handCursor.inventoryToolTip._visible = false;
	if (whichClip == "overflow") {
		var thisClipRef = gamedisplay.inventorysets.icrafting.overflowSlot.inventoryIconOverflow;
	} else {
		var thisClipRef = gamedisplay.inventorysets[whichSet]["inventoryIcon" + whichClip];
	}
	thisClipRef.startDrag(true);
	thisClipRef.swapDepths(gamedisplay.inventorysets[whichSet].getNextHighestDepth());
	// bring the set to the top as well so the icon will be above all other set's icons:
	gamedisplay.inventorysets[whichSet].swapDepths(numberOfInventorySets);
	thisClipRef.xorigin = thisClipRef._x;
	thisClipRef.yorigin = thisClipRef._y;
	//
	fromarray = arraySettoArray(whichSet);
	fromWhichArraySlot = whichClip;
	beingDragged = true;
}
//
function findInventorySet() {
	// determine which inventory set this slot is in:
	// in case the player dropped the icon over the quantity, check the _parent._parent to make sure it's "inventorysets"
	// might also have dropped over variant
	if (thisDropTarget._parent._parent._name.toString() == "inventorysets") {
		// eg. droptarget = "inventoryIcon7"
		droppedInvSet = thisDropTarget._parent._name.toString();
		toWhichArraySlot = parseInt(thisDropTarget._name.toString().substring(13));
		thisDroppedOverIcon = thisDropTarget;
		indexOfInvIcon = thisDropTarget._name.toString().indexOf("inventoryIcon");
	} else if (thisDropTarget._parent._parent._parent._name.toString() == "inventorysets") {
		// droptarget = "invIcons"
		droppedInvSet = thisDropTarget._parent._parent._name.toString();
		toWhichArraySlot = parseInt(thisDropTarget._parent._name.toString().substring(13));
		thisDroppedOverIcon = thisDropTarget._parent;
		indexOfInvIcon = thisDropTarget._parent._name.toString().indexOf("inventoryIcon");
	} else {
		// droptarget = "variant"
		droppedInvSet = thisDropTarget._parent._parent._parent._name.toString();
		toWhichArraySlot = parseInt(thisDropTarget._parent._parent._name.toString().substring(13));
		thisDroppedOverIcon = thisDropTarget._parent._parent;
		indexOfInvIcon = thisDropTarget._parent._parent._name.toString().indexOf("inventoryIcon");
	}
	droparray = arraySettoArray(droppedInvSet);
}
function arraySettoArray(whichInvSet) {
	switch (whichInvSet) {
		case "iinv" :
			return "inventory";
			break;
		case "iequip" :
			return "currentlyEquipped";
			break;
		case "ipet" :
			return "petcarrying";
			break;
		case "ibank" :
			return "bankarray";
			break;
		case "ichest" :
			return "chestarray";
			break;
		case "ishop" :
			return "shopcontents";
			break;
		case "iworkshop" :
			return "currentplans";
			break;
		case "icrafting" :
			return "componentsAdded";
			break;
		default :
			//
	}
}
//
function showCurrentInventoryState() {
	// populate inventory with current state:
	for (var i = 0; i < currentbagsize; i++) {
		if (inventory[i][0] != "1") {
			gamedisplay.inventorysets["iinv"]["inventoryIcon" + i].quan.text = parseInt(inventory[i][1]);
		} else {
			gamedisplay.inventorysets["iinv"]["inventoryIcon" + i].quan.text = " ";
		}
	}
}
//
function checkItemisUniqueOrQuest(iconRef, itemAction) {
	itemCanBeDroppedorSold = true;
	if (!quantitysplit) {
		// check if it is a quest item:  
		if (fromWhichArraySlot != "overflow") {
			// anything in the overflow slot can be dropped (won't be a quest or unique item)
			if ((inventoryitems[parseInt(_root[fromarray][iconRef.refID][0])][2]).indexOf("q") != -1) {
				// if it is, check if this item be dropped at this location:
				if (scrollclip.itemcanbedroppedhere(_root[fromarray][iconRef.refID][0])) {
				} else {
					statusMessage("This is a quest item and cannot be " + itemAction);
					itemCanBeDroppedorSold = false;
					// restore clip:
					iconRef._x = iconRef.xorigin;
					iconRef._y = iconRef.yorigin;
				}
			} else if ((inventoryitems[parseInt(_root[fromarray][iconRef.refID][0])][2]).indexOf("u") != -1) {
				// checking if it's a unique item - if it is, check if this item be dropped at this location:
				if (scrollclip.itemcanbedroppedhere(_root[fromarray][iconRef.refID][0])) {
				} else {
					statusMessage("This is a unique item and cannot be " + itemAction);
					itemCanBeDroppedorSold = false;
					// restore clip:
					iconRef._x = iconRef.xorigin;
					iconRef._y = iconRef.yorigin;
				}
			}
		}
	} else {
		// check if it is a quest item:  
		if ((inventoryitems[parseInt(_root[fromarray][iconRef._currentframe][0])][2]).indexOf("q") != -1) {
			// if it is, check if this item be dropped at this location:
			if (scrollclip.itemcanbedroppedhere(_root[fromarray][iconRef.refID][0])) {
			} else {
				statusMessage("This is a quest item and cannot be " + itemAction);
				itemCanBeDroppedorSold = false;
				// restore the split quantity to its original slot:
				_root[fromarray][splitParentItem][1] += beingmovedquantity;
				gamedisplay.inventorysets[iconRef.setRef]["inventoryIcon" + splitParentItem].quan.text = parseInt(_root[fromarray][splitParentItem][1]);
				gamedisplay.inventorysets[iconRef.setRef]["inventoryIcon" + iconRef.refID].removeMovieClip();
				quantitysplit = false;
			}
		} else if ((inventoryitems[parseInt(_root[fromarray][iconRef._currentframe][0])][2]).indexOf("u") != -1) {
			// checking if it's a unique item - if it is, check if this item be dropped at this location:
			if (scrollclip.itemcanbedroppedhere(_root[fromarray][iconRef.refID][0])) {
			} else {
				statusMessage("This is a unique item and cannot be " + itemAction);
				itemCanBeDroppedorSold = false;
				// restore the split quantity to its original slot:
				_root[fromarray][splitParentItem][1] += beingmovedquantity;
				gamedisplay.inventorysets[iconRef.setRef]["inventoryIcon" + splitParentItem].quan.text = parseInt(_root[fromarray][splitParentItem][1]);
				gamedisplay.inventorysets[iconRef.setRef]["inventoryIcon" + iconRef.refID].removeMovieClip();
				quantitysplit = false;
			}
		}
	}
}
//
function gradeItemsForSale() {
	var costofitem:Number;
	for (var i = 0; i < shopcontents.length; i++) {
		if (shopcontents[i][0] != "1") {
			// apply regional modifiers here: ###############
			costofitem = parseInt(gamedisplay.inventorysets.ishop["inventoryIcon" + i].priceCode);
			if (shopcontents[i][1] != 0) {
				// is the slot with the previous sold items, so multiply by the quantity:
				costofitem *= parseInt(shopcontents[i][1]);
			}
			// grey out this icon if it costs more than the player has                                                                                                                                                                                                                                                                                           
			if (costofitem > money) {
				gamedisplay.inventorysets.ishop["inventoryIcon" + i]._alpha = 50;
			} else {
				gamedisplay.inventorysets.ishop["inventoryIcon" + i]._alpha = 100;
			}
		}
	}
	// check if the player has enough money to repair all items as well:
	costToRepairAllItems = 0;
	if (inventoryitems[(currentlyEquipped[0][0])][2].indexOf("R") != -1) {
		costToRepairAllItems += getRepairCost(currentlyEquipped[0][0], currentlyEquipped[0][1], currentlyEquipped[0][6], currentlyEquipped[0][3]);
	}
	for (var i = 0; i < inventory.length; i++) {
		if (inventoryitems[(inventory[i][0])][2].indexOf("R") != -1) {
			costToRepairAllItems += getRepairCost(inventory[i][0], inventory[i][1], inventory[i][6], inventory[i][3]);
		}
	}
	for (var i = 0; i < petcarrying.length; i++) {
		if (inventoryitems[(petcarrying[i][0])][2].indexOf("R") != -1) {
			costToRepairAllItems += getRepairCost(petcarrying[i][0], petcarrying[i][1], petcarrying[i][6], petcarrying[i][3]);
		}
	}
	costToRepairAllItems = mceil(costToRepairAllItems);
	if (money >= costToRepairAllItems) {
		gamedisplay.inventorysets.ishop.repair.repairAllButton.gotoAndStop(2);
	} else {
		gamedisplay.inventorysets.ishop.repair.repairAllButton.gotoAndStop(1);
	}
}
//
function showItemAddedAnimation(itemTypeBeingAdded) {
	if (inventorySetIsOpen(setsuccessful)) {
		if (setsuccessful == "iinv") {
			// might need to attach a new icon, depending if new item was in a blank slot or added to existing - easiest to remove all and re-attach:
			for (var checkInvClip in gamedisplay.inventorysets.iinv) {
				// check it's an inventory icon:
				if (gamedisplay.inventorysets.iinv[checkInvClip]._name.indexOf("inventoryIcon") != -1) {
					gamedisplay.inventorysets.iinv[checkInvClip].removeMovieClip();
				}
			}
			whicharray = "inventory";
			settoggle = "iinv";
			numberofslotstoadd = currentbagsize;
		} else if (setsuccessful == "ipet") {
			for (var checkInvClip in gamedisplay.inventorysets.ipet) {
				// check it's an inventory icon:
				if (gamedisplay.inventorysets.ipet[checkInvClip]._name.indexOf("inventoryIcon") != -1) {
					gamedisplay.inventorysets.ipet[checkInvClip].removeMovieClip();
				}
			}
			whicharray = "petcarrying";
			settoggle = "ipet";
			numberofslotstoadd = petcarrying.length;
		}
		// update display:                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
		populateInventorySet();
		// show glow animation over that slot:
		gamedisplay.inventorysets.slotGlow._x = (gamedisplay.inventorysets[setsuccessful]["slot" + slotsuccessful]._x) + (gamedisplay.inventorysets[setsuccessful]._x);
		gamedisplay.inventorysets.slotGlow._y = (gamedisplay.inventorysets[setsuccessful]["slot" + slotsuccessful]._y) + (gamedisplay.inventorysets[setsuccessful]._y);
		gamedisplay.inventorysets.slotGlow.gotoAndPlay(2);
	} else {
		// show icon drop into set:
		gamedisplay.bagIcons[setsuccessful].bagInvIcons.gotoAndStop(itemTypeBeingAdded);
		if (setsuccessful == "icard") {
			// show card variant:
			var colourVariant = parseInt(slotsuccessful);
		} else {
			// this needs testing: #########################
			if (setsuccessful == "iinv") {
				var colourVariant = parseInt(this["inventory"][slotsuccessful][7]);
			} else if (setsuccessful == "ipet") {
				var colourVariant = parseInt(this["petcarrying"][slotsuccessful][7]);
			}
			// end needs testing #########################                                                                                                                                                                                                                                                       
		}
		if (colourVariant > 0) {
			// show colour variant:
			gamedisplay.bagIcons[setsuccessful].bagInvIcons.variant.gotoAndStop(colourVariant + 1);
		}
		gamedisplay.bagIcons[setsuccessful].gotoAndPlay(2);
	}
}
//
function openCraftingPanel(whichProfession, craftingModifier) {
	// check if crafting panel is already open:
	var craftingAlreadyOpen = false;
	for (var i = 0; i < setsopen.length; i++) {
		if (setsopen[i][0] == "icrafting") {
			craftingAlreadyOpen = true;
		}
	}
	if (craftingAlreadyOpen && (canClearComponentsAdded() == false)) {
		// don't open the set until components can be cleared
	} else {
		componentsAdded = [];
		storedcraftingModifier = craftingModifier;
		currentProfession = whichProfession;
		thisDyeSlot = [];
		thisEnchantSlot = [];
		// show crafting and panels if they aren't already open:
		if (!craftingAlreadyOpen) {
			setsopen.push(["icrafting", -1, numberofcolumns]);
		}
		placeinventorysets();
		gamedisplay.inventorysets.icrafting.panelHeading.text = professionsAvailable[currentProfession];
		// set up scroll list:
		gamedisplay.inventorysets.icrafting.scrollListing.minScrollItemHeight = 60;
		gamedisplay.inventorysets.icrafting.scrollListing.listSpacing = 0;
		gamedisplay.inventorysets.icrafting.scrollListing.listScrollSpeed = 15;
		gamedisplay.inventorysets.icrafting.scrollListing.listBoxHeight = 150;
		gamedisplay.inventorysets.icrafting.scrollListing.scrollTrackHeight = 100;
		thisSkillsRecipes = [];
		// define all known recipes for this profession:
		for (var i:Number = 0; i < recipesKnown.length; i++) {
			// check that this recipe relates to this profession:
			if (recipesAvailable[(recipesKnown[i])][0] == currentProfession) {
				thisSkillsRecipes.push(recipesAvailable[(recipesKnown[i])]);
			}
		}
		// thisSkillsRecipes[i][3] gives the difficulty - so sort on this element
		thisSkillsRecipes.sort(function (a, b) {
		return a[3] < b[3];
		});
		gamedisplay.inventorysets.icrafting.scrollListing.displayScrollList();
		gamedisplay.inventorysets.icrafting.craftingButton.gotoAndStop(1);
		//
		// ##########
		// filter on whether player has components for each recipe (ie. show only those that the player can make immediately)
		//
		// check if an overflow crafted item needs to be displayed here
		if (storedCraftedItem[0] != 1) {
			showCraftingOverflow();
		} else {
			gamedisplay.inventorysets.icrafting.overflowSlot._visible = false;
		}
	}
}
//
function showCraftingOverflow() {
	gamedisplay.inventorysets.icrafting.overflowSlot.attachMovie("inventoryIcon","inventoryIconOverflow",1000);
	// icons are centred while slots are top left, so add half the slot size to compensate
	gamedisplay.inventorysets.icrafting.overflowSlot.inventoryIconOverflow._x = gamedisplay.inventorysets.icrafting.overflowSlot.overflowBG._x + (invtilewidth / 2);
	gamedisplay.inventorysets.icrafting.overflowSlot.inventoryIconOverflow._y = gamedisplay.inventorysets.icrafting.overflowSlot.overflowBG._y + (invtileheight / 2);
	// check if it's wrapped
	var giftWrapped = storedCraftedItem[5];
	if (giftWrapped != -1) {
		gamedisplay.inventorysets.icrafting.overflowSlot.inventoryIconOverflow.invIcons.gotoAndStop(giftWrapped);
		gamedisplay.inventorysets.icrafting.overflowSlot.inventoryIconOverflow.iconDesc = inventoryitems[giftWrapped][1];
		gamedisplay.inventorysets.icrafting.overflowSlot.inventoryIconOverflow.qual._visible = false;
		gamedisplay.inventorysets.icrafting.overflowSlot.inventoryIconOverflow.quan.text = 1;
	} else {
		gamedisplay.inventorysets.icrafting.overflowSlot.inventoryIconOverflow.invIcons.gotoAndStop(storedCraftedItem[0]);
		gamedisplay.inventorysets.icrafting.overflowSlot.inventoryIconOverflow.iconDesc = inventoryitems[(storedCraftedItem[0])][1] + "\nEffectiveness: " + storedCraftedItem[4] + "\nUses: " + (storedCraftedItem[3] - storedCraftedItem[6]) + "/" + storedCraftedItem[3];
		gamedisplay.inventorysets.icrafting.overflowSlot.inventoryIconOverflow.quan.text = storedCraftedItem[1];
	}
	gamedisplay.inventorysets.icrafting.overflowSlot.inventoryIconOverflow.dura = storedCraftedItem[3];
	gamedisplay.inventorysets.icrafting.overflowSlot.inventoryIconOverflow.effec = storedCraftedItem[4];
	gamedisplay.inventorysets.icrafting.overflowSlot.inventoryIconOverflow.wrapping = storedCraftedItem[5];
	gamedisplay.inventorysets.icrafting.overflowSlot.inventoryIconOverflow.wear = storedCraftedItem[6];
	gamedisplay.inventorysets.icrafting.overflowSlot.inventoryIconOverflow.col = storedCraftedItem[7];
	if (storedCraftedItem[7] > 0) {
		// (+1 as frame 1 will be the undyed form, so frame 2 will colour #1 and so on)
		gamedisplay.inventorysets.icrafting.overflowSlot.inventoryIconOverflow.invIcons.variant.gotoAndStop((storedCraftedItem[7]) + 1);
	}
	gamedisplay.inventorysets.icrafting.overflowSlot.inventoryIconOverflow.enchant = storedCraftedItem[8];
	gamedisplay.inventorysets.icrafting.overflowSlot.inventoryIconOverflow.hallmark = storedCraftedItem[9];
	gamedisplay.inventorysets.icrafting.overflowSlot.inventoryIconOverflow.inscr = storedCraftedItem[10];
	var itemcode:String = inventoryitems[storedCraftedItem[0]][2];
	var pricecode:String = inventoryitems[storedCraftedItem[0]][8];
	gamedisplay.inventorysets.icrafting.overflowSlot.inventoryIconOverflow.quan._visible = true;
	gamedisplay.inventorysets.icrafting.overflowSlot.inventoryIconOverflow.price._visible = false;
	gamedisplay.inventorysets.icrafting.overflowSlot.inventoryIconOverflow.qual.gotoAndStop(storedCraftedItem[2]);
	gamedisplay.inventorysets.icrafting.overflowSlot.inventoryIconOverflow.lastTime = 0;
	gamedisplay.inventorysets.icrafting.overflowSlot.inventoryIconOverflow.refID = "overflow";
	gamedisplay.inventorysets.icrafting.overflowSlot.inventoryIconOverflow.setRef = "icrafting";
	gamedisplay.inventorysets.icrafting.overflowSlot.inventoryIconOverflow.iconTitle = inventoryitems[storedCraftedItem[0]][0];
	gamedisplay.inventorysets.icrafting.overflowSlot.inventoryIconOverflow.itemCode = itemcode;
	gamedisplay.inventorysets.icrafting.overflowSlot.inventoryIconOverflow.priceCode = pricecode;
	gamedisplay.inventorysets.icrafting.overflowSlot.inventoryIconOverflow.onRollOver = inventoryIconRollover;
	gamedisplay.inventorysets.icrafting.overflowSlot.inventoryIconOverflow.onRollOut = gamedisplay.inventorysets.icrafting.overflowSlot.inventoryIconOverflow.onDragOut = inventoryIconRollout;
	gamedisplay.inventorysets.icrafting.overflowSlot.inventoryIconOverflow.onPress = inventoryIconPress;
	gamedisplay.inventorysets.icrafting.overflowSlot.inventoryIconOverflow.onRelease = gamedisplay.inventorysets.icrafting.overflowSlot.inventoryIconOverflow.onReleaseOutside = inventoryIconRelease;
	gamedisplay.inventorysets.icrafting.overflowSlot._visible = true;
}
//
function gradeAttempt(thisitemdifficulty) {
	thisitemdifficulty = parseInt(thisitemdifficulty);
	skillDifference = levelFromExp(playerCraftingSkill[currentProfession]) - thisitemdifficulty;
	if (skillDifference < (skillIncCap - 1)) {
		if (skillDifference >= 0) {
			// medium attempt - guaranteed success with skill exp increase
			return "0xffcc33";
		} else {
			// difficult attempt - guaranteed larger skill exp increase on success
			return "0xff0000";
		}
	} else {
		// easy attempt - guaranteed success but v small increase of skill exp 
		return "0x00cc00";
	}
}
//
function showComponents(forWhichRecipe) {
	if (canClearComponentsAdded(forWhichRecipe)) {
		// remove any previous components:
		gamedisplay.inventorysets.icrafting.slot0.removeMovieClip();
		gamedisplay.inventorysets.icrafting.slot1.removeMovieClip();
		gamedisplay.inventorysets.icrafting.slot2.removeMovieClip();
		gamedisplay.inventorysets.icrafting.slot3.removeMovieClip();
		gamedisplay.inventorysets.icrafting.craftingButton.gotoAndStop(1);
		finalCraftedItemType = parseInt(thisSkillsRecipes[forWhichRecipe][1]);
		thisRecipesComponents = thisSkillsRecipes[forWhichRecipe][2].split("/");
		thisRecipesDifficulty = thisSkillsRecipes[forWhichRecipe][3];
		currentlySelectedRecipe = forWhichRecipe;
		for (var i = 0; i < 4; i++) {
			if (i < thisRecipesComponents.length) {
				thisRecipesComponents[i] = thisRecipesComponents[i].split(".");
				// will mean the item reference is in [0] and the quantity in [1]
				gamedisplay.inventorysets.icrafting["slot" + i].compIcon.gotoAndStop(thisRecipesComponents[i][0]);
				gamedisplay.inventorysets.icrafting["slot" + i].quan.text = thisRecipesComponents[i][1];
				gamedisplay.inventorysets.icrafting["slot" + i]._visible = true;
				gamedisplay.inventorysets.icrafting["slot" + i].iconTitle = inventoryitems[(thisRecipesComponents[i][0])][0];
				gamedisplay.inventorysets.icrafting["slot" + i].iconDesc = inventoryitems[(thisRecipesComponents[i][0])][1];
				gamedisplay.inventorysets.icrafting["slot" + i].onRollOver = function() {
					handCursor.inventoryToolTip.outputtitle.text = this.iconTitle;
					var tempDesc = this.iconDesc;




					if (inventoryitems[this.invIcons._currentframe][6] == "card") {
						// show this single card's name in the description:
						tempDesc = allPlayingCardsAvailable[this.col][0];
					} else if (inventoryitems[this.invIcons._currentframe][2].indexOf("m") != -1) {
						// show this map's name in the description:
						tempDesc = standardMapsAvailable[this.dura][0];
					} else if (inventoryitems[this.invIcons._currentframe][2].indexOf("i") != -1) {
						// show this songs's name and transcriber in the description:
						tempDesc = "\"" + this.inscr + "\" - transcribed by " + this.col;
					}
					if (this.inscr != "-") {
						var messageSplit = this.inscr.split("[**]");
						tempDesc += "\n\"" + messageSplit[0] + "\"";
					}
					handCursor.inventoryToolTip.outputdescription.text = tempDesc;
					handCursor.inventoryToolTip.outputdescription._y = (handCursor.inventoryToolTip.outputtitle.textHeight) + 8;
					handCursor.inventoryToolTip._visible = true;
				};
				gamedisplay.inventorysets.icrafting["slot" + i].onRollOut = gamedisplay.inventorysets.icrafting["slot" + i].onDragOut = inventoryIconRollout;
			} else {
				gamedisplay.inventorysets.icrafting["slot" + i]._visible = false;
			}
		}
		// hide the dye slot if this final item can't be dyed:
		if (inventoryitems[finalCraftedItemType][9] == -1) {
			gamedisplay.inventorysets.icrafting.dyeSlot._visible = false;
		} else {
			gamedisplay.inventorysets.icrafting.dyeSlot._visible = true;
		}
	}
}
//
function removeLastComponent() {
	// start timer to see if the mouse button is released very shortly after this press
	// if it isn't released then can start dragging
	clearInterval(_root.allowDragTimer);
	_root.allowDragTimer = setInterval(_root.allowComponentDrag, (_root.doubleClickSpeed / 3), this.refID, this.quanReq);
	if (waitingfornumericinput) {
		// close and cancel input box
		waitingfornumericinput = false;
		gamedisplay.inputbox._visible = false;
	}
	beingDragged = false;
}
function allowComponentDrag(whichClip, quantityRequired) {
	handCursor.inventoryToolTip._visible = false;
	clearInterval(_root.allowDragTimer);
	// loop backwards through the array to find the most recent slot of components of this type:
	var componentTypeOnSlot = [];
	if (whichClip == "dye") {
		// create new floating icon
		componentParent = whichClip;
		attachFloatingInvIcon("icrafting",(thisDyeSlot[0][0]),(thisDyeSlot[0][1]),(thisDyeSlot[0][2]),(thisDyeSlot[0][3]),(thisDyeSlot[0][4]),(thisDyeSlot[0][5]),(thisDyeSlot[0][6]),(thisDyeSlot[0][7]),(thisDyeSlot[0][8]),(thisDyeSlot[0][9]),(thisDyeSlot[0][10]));
		allowDrag(999,"icrafting");
	} else {
		for (var i = (componentsAdded.length - 1); i >= 0; i--) {
			if (componentsAdded[i][0][0] == gamedisplay.inventorysets.icrafting["inventoryIcon" + whichClip].invIcons._currentframe) {
				componentTypeOnSlot.push(i);
			}
		}
		// create new floating icon
		componentParent = whichClip;
		componentsAddedRef = componentTypeOnSlot[0];
		attachFloatingInvIcon("icrafting",(componentsAdded[componentsAddedRef][0][0]),(componentsAdded[componentsAddedRef][0][1]),(componentsAdded[componentsAddedRef][0][2]),(componentsAdded[componentsAddedRef][0][3]),(componentsAdded[componentsAddedRef][0][4]),(componentsAdded[componentsAddedRef][0][5]),(componentsAdded[componentsAddedRef][0][6]),(componentsAdded[componentsAddedRef][0][7]),(componentsAdded[componentsAddedRef][0][8]),(componentsAdded[componentsAddedRef][0][9]),(componentsAdded[componentsAddedRef][0][10]));
		allowDrag(999,"icrafting");
	}
	// check if this is the only slot of this type
	displayQuantity = 0;
	if (componentTypeOnSlot.length > 1) {
		// visually update quantity on remaining icon - check through components added for items of the same type
		for (var i = 0; i < componentsAdded.length; i++) {
			// make sure that the one being removed isn't included in the remaining total:
			// (the icon to remove will be the first one found)
			if (i != componentTypeOnSlot[0]) {
				if (componentsAdded[componentsAddedRef][0][0] == componentsAdded[i][0][0]) {
					displayQuantity += parseInt(componentsAdded[i][0][1]);
				}
			}
		}
		gamedisplay.inventorysets.icrafting["inventoryIcon" + whichClip].quan.text = displayQuantity + "/" + quantityRequired;
	} else {
		// hide component icon - it's still needed to control the release of the newly attached clip ############################ needs to be removed later
		gamedisplay.inventorysets.icrafting["inventoryIcon" + whichClip]._visible = false;
	}
}
function compIconRelease() {
	clearInterval(_root.allowDragTimer);
	if (beingDragged) {
		// hide cursor so it doesn't register as the droptarget
		handCursor._visible = false;
		gamedisplay.inventorysets.icrafting["inventoryIcon999"].stopDrag();
		thisDropTarget = eval(gamedisplay.inventorysets.icrafting["inventoryIcon999"]._droptarget);
		// restore cursor:
		handCursor._visible = true;
		// check if it's dropped over the bank, inventory or pet inventory:
		if ((gamedisplay.inventorysets.icrafting["inventoryIcon999"]._droptarget.indexOf("iinv") != -1) || (gamedisplay.inventorysets.icrafting["inventoryIcon999"]._droptarget.indexOf("ipet") != -1) || (gamedisplay.inventorysets.icrafting["inventoryIcon999"]._droptarget.indexOf("ibank") != -1)) {
			dropTargetsName = thisDropTarget._name.toString();
			indexOfSlot = dropTargetsName.indexOf("slot");
			findInventorySet();
			if (indexOfSlot != -1) {
				// determine which slot was dropped in to: (use indexOfSlot+4 to remove the word "slot")
				toWhichArraySlot = parseInt(dropTargetsName.substring(indexOfSlot + 4));
				// add to array and attach new clip to new set:
				if (componentParent == "dye") {
					_root[droparray][toWhichArraySlot][0] = thisDyeSlot[0][0];
					_root[droparray][toWhichArraySlot][1] = thisDyeSlot[0][1];
					_root[droparray][toWhichArraySlot][2] = thisDyeSlot[0][2];
					_root[droparray][toWhichArraySlot][3] = thisDyeSlot[0][3];
					_root[droparray][toWhichArraySlot][4] = thisDyeSlot[0][4];
					_root[droparray][toWhichArraySlot][5] = thisDyeSlot[0][5];
					_root[droparray][toWhichArraySlot][6] = thisDyeSlot[0][6];
					_root[droparray][toWhichArraySlot][7] = thisDyeSlot[0][7];
					_root[droparray][toWhichArraySlot][8] = thisDyeSlot[0][8];
					_root[droparray][toWhichArraySlot][9] = thisDyeSlot[0][9];
					_root[droparray][toWhichArraySlot][10] = thisDyeSlot[0][10];
					thisDyeSlot = [];
					gamedisplay.inventorysets.icrafting["inventoryIcondye"].removeMovieClip();
				} else {
					_root[droparray][toWhichArraySlot][0] = componentsAdded[componentsAddedRef][0][0];
					_root[droparray][toWhichArraySlot][1] = componentsAdded[componentsAddedRef][0][1];
					_root[droparray][toWhichArraySlot][2] = componentsAdded[componentsAddedRef][0][2];
					_root[droparray][toWhichArraySlot][3] = componentsAdded[componentsAddedRef][0][3];
					_root[droparray][toWhichArraySlot][4] = componentsAdded[componentsAddedRef][0][4];
					_root[droparray][toWhichArraySlot][5] = componentsAdded[componentsAddedRef][0][5];
					_root[droparray][toWhichArraySlot][6] = componentsAdded[componentsAddedRef][0][6];
					_root[droparray][toWhichArraySlot][7] = componentsAdded[componentsAddedRef][0][7];
					_root[droparray][toWhichArraySlot][8] = componentsAdded[componentsAddedRef][0][8];
					_root[droparray][toWhichArraySlot][9] = componentsAdded[componentsAddedRef][0][9];
					_root[droparray][toWhichArraySlot][10] = componentsAdded[componentsAddedRef][0][10];
					// remove from componentsAdded array:
					componentsAdded.splice(componentsAddedRef,1);
					// un-grey crafting button now a component has been removed:
					gamedisplay.inventorysets.icrafting.craftingButton.gotoAndStop(1);
				}
				attachSingleInvIcon(droppedInvSet,toWhichArraySlot);
				// remove floating icon:
				gamedisplay.inventorysets.icrafting["inventoryIcon999"].removeMovieClip();
			} else {
				// check if item types/attributes match, neither are wrapped and combined total don't exceed max per slot:
				if ((_root[droparray][toWhichArraySlot][0] == gamedisplay.inventorysets.icrafting["inventoryIcon999"].invIcons._currentframe) && (_root[droparray][toWhichArraySlot][2] == gamedisplay.inventorysets.icrafting["inventoryIcon999"].qual._currentframe) && (_root[droparray][toWhichArraySlot][3] == gamedisplay.inventorysets.icrafting["inventoryIcon999"].dura) && (_root[droparray][toWhichArraySlot][4] == gamedisplay.inventorysets.icrafting["inventoryIcon999"].effec) && (_root[droparray][toWhichArraySlot][5] == -1) && (gamedisplay.inventorysets.icrafting["inventoryIcon999"].wrapping == -1) && (_root[droparray][toWhichArraySlot][6] == gamedisplay.inventorysets.icrafting["inventoryIcon999"].wear) && (_root[droparray][toWhichArraySlot][7] == gamedisplay.inventorysets.icrafting["inventoryIcon999"].col) && (_root[droparray][toWhichArraySlot][8] == gamedisplay.inventorysets.icrafting["inventoryIcon999"].enchant) && (_root[droparray][toWhichArraySlot][9] == gamedisplay.inventorysets.icrafting["inventoryIcon999"].hallmark) && (_root[droparray][toWhichArraySlot][10] == gamedisplay.inventorysets.icrafting["inventoryIcon999"].inscr) && (parseInt(_root[droparray][toWhichArraySlot][1]) + parseInt(gamedisplay.inventorysets.icrafting["inventoryIcon999"].quan.text) <= maxitemsperslot)) {
					if (componentParent == "dye") {
						// update array with new quantity:
						_root[droparray][toWhichArraySlot][1] = parseInt(_root[droparray][toWhichArraySlot][1]) + parseInt(thisDyeSlot[0][1]);
						thisDyeSlot = [];
						gamedisplay.inventorysets.icrafting["inventoryIcondye"].removeMovieClip();
					} else {
						// update array with new quantity:
						_root[droparray][toWhichArraySlot][1] = parseInt(_root[droparray][toWhichArraySlot][1]) + parseInt(componentsAdded[componentsAddedRef][0][1]);
						// remove from componentsAdded array:
						componentsAdded.splice(componentsAddedRef,1);
						// un-grey crafting button now a component has been removed:
						gamedisplay.inventorysets.icrafting.craftingButton.gotoAndStop(1);
					}
					// update quantity visually:
					gamedisplay.inventorysets[droppedInvSet]["inventoryIcon" + toWhichArraySlot].quan.text = _root[droparray][toWhichArraySlot][1];
				} else {
					// was dropped onto a bag panel but not to an empty slot or a slot of that item type, so see if it can be added anywhere else:
					var compQuantityToAdd = parseInt(gamedisplay.inventorysets.icrafting["inventoryIcon999"].quan.text);
					if (canadditemtoinventory(gamedisplay.inventorysets.icrafting["inventoryIcon999"].invIcons._currentframe, compQuantityToAdd, gamedisplay.inventorysets.icrafting["inventoryIcon999"].qual._currentframe, gamedisplay.inventorysets.icrafting["inventoryIcon999"].dura, gamedisplay.inventorysets.icrafting["inventoryIcon999"].effec, gamedisplay.inventorysets.icrafting["inventoryIcon999"].wrapping, gamedisplay.inventorysets.icrafting["inventoryIcon999"].wear, gamedisplay.inventorysets.icrafting["inventoryIcon999"].col, gamedisplay.inventorysets.icrafting["inventoryIcon999"].enchant, gamedisplay.inventorysets.icrafting["inventoryIcon999"].hallmark, gamedisplay.inventorysets.icrafting["inventoryIcon999"].inscr) == compQuantityToAdd) {
						// add to array and update visually
						additemtoinventory(gamedisplay.inventorysets.icrafting["inventoryIcon999"].invIcons._currentframe,compQuantityToAdd,gamedisplay.inventorysets.icrafting["inventoryIcon999"].qual._currentframe,gamedisplay.inventorysets.icrafting["inventoryIcon999"].dura,gamedisplay.inventorysets.icrafting["inventoryIcon999"].effec,gamedisplay.inventorysets.icrafting["inventoryIcon999"].wrapping,gamedisplay.inventorysets.icrafting["inventoryIcon999"].wear,gamedisplay.inventorysets.icrafting["inventoryIcon999"].col,gamedisplay.inventorysets.icrafting["inventoryIcon999"].enchant,gamedisplay.inventorysets.icrafting["inventoryIcon999"].hallmark,gamedisplay.inventorysets.icrafting["inventoryIcon999"].inscr);
						showItemAddedAnimation(gamedisplay.inventorysets.icrafting["inventoryIcon999"].invIcons._currentframe);
						if (componentParent == "dye") {
							thisDyeSlot = [];
							gamedisplay.inventorysets.icrafting["inventoryIcondye"].removeMovieClip();
						} else {
							// remove from componentsAdded array:
							componentsAdded.splice(componentsAddedRef,1);
							// un-grey crafting button now a component has been removed:
							gamedisplay.inventorysets.icrafting.craftingButton.gotoAndStop(1);
						}
					} else {
						// drop this back on the component slot it came from:
						if (componentParent == "dye") {
							// just restore the hidden parent icon
							gamedisplay.inventorysets.icrafting["inventoryIcondye"]._visible = true;
						} else {
							if (displayQuantity == 0) {
								// just restore the hidden parent icon
								gamedisplay.inventorysets.icrafting["inventoryIcon" + componentParent]._visible = true;
							} else {
								// update quantity
								displayQuantity = displayQuantity + parseInt(gamedisplay.inventorysets.icrafting["inventoryIcon999"].quan.text);
								gamedisplay.inventorysets.icrafting["inventoryIcon" + componentParent].quan.text = displayQuantity + "/" + gamedisplay.inventorysets.icrafting["inventoryIcon" + componentParent].quanReq;
							}
						}
					}
				}
				gamedisplay.inventorysets.icrafting["inventoryIcon999"].removeMovieClip();
			}
			if (componentParent != "dye") {
				if (displayQuantity == 0) {
					// there aren't any components remaining on the parent slot, so delete that icon now:
					gamedisplay.inventorysets.icrafting["inventoryIcon" + componentParent].removeMovieClip();
				}
			}
		} else {
			// drop this back on the component slot it came from:
			if (displayQuantity == 0) {
				// just restore the hidden parent icon
				gamedisplay.inventorysets.icrafting["inventoryIcon" + componentParent]._visible = true;
			} else {
				// update quantity
				displayQuantity = displayQuantity + parseInt(gamedisplay.inventorysets.icrafting["inventoryIcon999"].quan.text);
				gamedisplay.inventorysets.icrafting["inventoryIcon" + componentParent].quan.text = displayQuantity + "/" + gamedisplay.inventorysets.icrafting["inventoryIcon" + componentParent].quanReq;
			}
			gamedisplay.inventorysets.icrafting["inventoryIcon999"].removeMovieClip();
		}
	}
}
//
function canClearComponentsAdded(whichRecipeReleased) {
	// restores components for current recipe before showing newly clicked recipe (or after crafting panel is closed)
	if (whichRecipeReleased != currentlySelectedRecipe) {
		var canRestoreAll = true;
		// loop through and see if target array slot is empty or filled slot is identical type and target panel isn't shop #########
		for (var i = 0; i < componentsAdded.length; i++) {
			var whicharray = arraySettoArray(componentsAdded[i][1]);
			if (((_root[whicharray][(componentsAdded[i][2])][0] == 1) || ((componentsAdded[i][0][0] == _root[whicharray][(componentsAdded[i][2])][0]) && (componentsAdded[i][0][1] == _root[whicharray][(componentsAdded[i][2])][1]) && (componentsAdded[i][0][2] == _root[whicharray][(componentsAdded[i][2])][2]) && (componentsAdded[i][0][3] == _root[whicharray][(componentsAdded[i][2])][3]) && (componentsAdded[i][0][4] == _root[whicharray][(componentsAdded[i][2])][4]) && (componentsAdded[i][0][5] == -1) && (_root[whicharray][(componentsAdded[i][2])][5] == -1) && (componentsAdded[i][0][6] == _root[whicharray][(componentsAdded[i][2])][6]) && (componentsAdded[i][0][7] == _root[whicharray][(componentsAdded[i][2])][7]) && (componentsAdded[i][0][8] == _root[whicharray][(componentsAdded[i][2])][8]) && (componentsAdded[i][0][9] == _root[whicharray][(componentsAdded[i][2])][9]) && (componentsAdded[i][0][10] == _root[whicharray][(componentsAdded[i][2])][10]) && (parseInt(componentsAdded[i][0][1]) + parseInt(_root[whicharray][(componentsAdded[i][2])][1]) <= maxitemsperslot))) && (componentsAdded[i][1] != "ishop")) {
				// ok to add
			} else if (canadditemtoinventory(componentsAdded[i][0][0], componentsAdded[i][0][1], componentsAdded[i][0][2], componentsAdded[i][0][3], componentsAdded[i][0][4], componentsAdded[i][0][5], componentsAdded[i][0][6], componentsAdded[i][0][7], componentsAdded[i][0][8], componentsAdded[i][0][9], componentsAdded[i][0][10]) == parseInt(componentsAdded[i][0][1])) {
				// ok to add
			} else if (componentsAdded[i][2] == "overflow") {
				// ok to add (as this came from the overflow, so just put it back)
			} else {
				canRestoreAll = false;
				break;
			}
		}
		if (thisDyeSlot.length > 0) {
			var whicharray = arraySettoArray(thisDyeSlot[1]);
			if (((_root[whicharray][(thisDyeSlot[2])][0] == 1) || ((thisDyeSlot[0][0] == _root[whicharray][(thisDyeSlot[2])][0]) && (thisDyeSlot[0][1] == _root[whicharray][(thisDyeSlot[2])][1]) && (thisDyeSlot[0][2] == _root[whicharray][(thisDyeSlot[2])][2]) && (thisDyeSlot[0][3] == _root[whicharray][(thisDyeSlot[2])][3]) && (thisDyeSlot[0][4] == _root[whicharray][(thisDyeSlot[2])][4]) && (thisDyeSlot[0][5] == -1) && (_root[whicharray][(thisDyeSlot[2])][5] == -1) && (thisDyeSlot[0][6] == _root[whicharray][(thisDyeSlot[2])][6]) && (thisDyeSlot[0][7] == _root[whicharray][(thisDyeSlot[2])][7]) && (thisDyeSlot[0][8] == _root[whicharray][(thisDyeSlot[2])][8]) && (thisDyeSlot[0][9] == _root[whicharray][(thisDyeSlot[2])][9]) && (thisDyeSlot[0][10] == _root[whicharray][(thisDyeSlot[2])][10]) && (parseInt(thisDyeSlot[0][1]) + parseInt(_root[whicharray][(thisDyeSlot[2])][1]) <= maxitemsperslot))) && (thisDyeSlot[1] != "ishop")) {
				// ok to add
			} else if (canadditemtoinventory(thisDyeSlot[0][0], thisDyeSlot[0][1], thisDyeSlot[0][2], thisDyeSlot[0][3], thisDyeSlot[0][4], thisDyeSlot[0][5], thisDyeSlot[0][6], thisDyeSlot[0][7], thisDyeSlot[0][8], thisDyeSlot[0][9], thisDyeSlot[0][10]) == parseInt(thisDyeSlot[0][1])) {
				// ok to add
			} else if (thisDyeSlot[2] == "overflow") {
				// ok to add (as this came from the overflow, so just put it back)
			} else {
				canRestoreAll = false;
			}
		}
		if (canRestoreAll) {
			// loop through and restore components:
			if (thisDyeSlot.length > 0) {
				// (for the sake of restoring, treat the dye slot as an additional component)
				componentsAdded.push(thisDyeSlot.slice());
			}
			for (var i = 0; i < componentsAdded.length; i++) {
				var whicharray = arraySettoArray(componentsAdded[i][1]);
				if (_root[whicharray][(componentsAdded[i][2])][0] == 1) {
					_root[whicharray][(componentsAdded[i][2])][0] = componentsAdded[i][0][0];
					_root[whicharray][(componentsAdded[i][2])][1] = componentsAdded[i][0][1];
					_root[whicharray][(componentsAdded[i][2])][2] = componentsAdded[i][0][2];
					_root[whicharray][(componentsAdded[i][2])][3] = componentsAdded[i][0][3];
					_root[whicharray][(componentsAdded[i][2])][4] = componentsAdded[i][0][4];
					_root[whicharray][(componentsAdded[i][2])][5] = componentsAdded[i][0][5];
					_root[whicharray][(componentsAdded[i][2])][6] = componentsAdded[i][0][6];
					_root[whicharray][(componentsAdded[i][2])][7] = componentsAdded[i][0][7];
					_root[whicharray][(componentsAdded[i][2])][8] = componentsAdded[i][0][8];
					_root[whicharray][(componentsAdded[i][2])][9] = componentsAdded[i][0][9];
					_root[whicharray][(componentsAdded[i][2])][10] = componentsAdded[i][0][10];
					attachSingleInvIcon(componentsAdded[i][1],(componentsAdded[i][2]));
					slotsuccessful = parseInt(componentsAdded[i][2]);
					setsuccessful = componentsAdded[i][1];
				} else if (((componentsAdded[i][0][0] == _root[whicharray][(componentsAdded[i][2])][0]) && (componentsAdded[i][0][1] == _root[whicharray][(componentsAdded[i][2])][1]) && (componentsAdded[i][0][2] == _root[whicharray][(componentsAdded[i][2])][2]) && (componentsAdded[i][0][3] == _root[whicharray][(componentsAdded[i][2])][3]) && (componentsAdded[i][0][4] == _root[whicharray][(componentsAdded[i][2])][4]) && (componentsAdded[i][0][5] == -1) && (_root[whicharray][(componentsAdded[i][2])][5] == -1) && (componentsAdded[i][0][6] == _root[whicharray][(componentsAdded[i][2])][6]) && (componentsAdded[i][0][7] == _root[whicharray][(componentsAdded[i][2])][7]) && (componentsAdded[i][0][8] == _root[whicharray][(componentsAdded[i][2])][8]) && (componentsAdded[i][0][9] == _root[whicharray][(componentsAdded[i][2])][9]) && (componentsAdded[i][0][10] == _root[whicharray][(componentsAdded[i][2])][10]) && (parseInt(componentsAdded[i][0][1]) + parseInt(_root[whicharray][(componentsAdded[i][2])][1]) <= maxitemsperslot))) {
					// matching type then, just increase quantity:
					_root[whicharray][(componentsAdded[i][2])][1] = parseInt(_root[whicharray][(componentsAdded[i][2])][1]) + parseInt(componentsAdded[i][0][1]);
					gamedisplay.inventorysets[(componentsAdded[i][1])]["inventoryIcon" + componentsAdded[i][2]].quan.text = _root[whicharray][(componentsAdded[i][2])][1];
					slotsuccessful = parseInt(componentsAdded[i][2]);
					setsuccessful = componentsAdded[i][1];
				} else if (canadditemtoinventory(componentsAdded[i][0][0], componentsAdded[i][0][1], componentsAdded[i][0][2], componentsAdded[i][0][3], componentsAdded[i][0][4], componentsAdded[i][0][5], componentsAdded[i][0][6], componentsAdded[i][0][7], componentsAdded[i][0][8], componentsAdded[i][0][9], componentsAdded[i][0][10]) == parseInt(componentsAdded[i][0][1])) {
					additemtoinventory(componentsAdded[i][0][0],componentsAdded[i][0][1],componentsAdded[i][0][2],componentsAdded[i][0][3],componentsAdded[i][0][4],componentsAdded[i][0][5],componentsAdded[i][0][6],componentsAdded[i][0][7],componentsAdded[i][0][8],componentsAdded[i][0][9],componentsAdded[i][0][10]);
				} else {
					// must have come from overflow, so restore to that:
					storedCraftedItem[0] = componentsAdded[i][0][0];
					storedCraftedItem[1] = componentsAdded[i][0][1];
					storedCraftedItem[2] = componentsAdded[i][0][2];
					storedCraftedItem[3] = componentsAdded[i][0][3];
					storedCraftedItem[4] = componentsAdded[i][0][4];
					storedCraftedItem[5] = componentsAdded[i][0][5];
					storedCraftedItem[6] = componentsAdded[i][0][6];
					storedCraftedItem[7] = componentsAdded[i][0][7];
					storedCraftedItem[8] = componentsAdded[i][0][8];
					storedCraftedItem[9] = componentsAdded[i][0][9];
					storedCraftedItem[10] = componentsAdded[i][0][10];
					showCraftingOverflow();
				}
				showItemAddedAnimation(componentsAdded[i][0][0]);
			}
			// remove all component clips:
			gamedisplay.inventorysets.icrafting.inventoryIcon0.removeMovieClip();
			gamedisplay.inventorysets.icrafting.inventoryIcon1.removeMovieClip();
			gamedisplay.inventorysets.icrafting.inventoryIcon2.removeMovieClip();
			gamedisplay.inventorysets.icrafting.inventoryIcon3.removeMovieClip();
			gamedisplay.inventorysets.icrafting.inventoryIcondye.removeMovieClip();
			componentsAdded = [];
			thisDyeSlot = [];
			return true;
		} else {
			statusMessage("can't restore all components, please do this manually before closing the crafting panel");
			return false;
		}
	} else {
		return false;
	}
}
//
function prepareToCraft() {
	gamedisplay.inventorysets.icrafting.craftingButton.gotoAndStop(1);
	// finalCraftedItemType was defined when selecting the recipe
	// storedcraftingModifier has already been set when opening crafting panel
	finalCraftedItemQuantity = 1;
	var numberOfIndividualItemsAdded = 0;
	var qualityTotal = 0;
	maxCraftItemDura = 999;
	maxCraftItemEffec = 999;
	finalCraftedItemEnchant = 999;
	coloursToMix = [];
	// find average quality across all items added, and minimum durability and effectiveness
	// if enchants are different, then lose all enchants.
	for (var i = 0; i < componentsAdded.length; i++) {
		numberOfIndividualItemsAdded = numberOfIndividualItemsAdded + parseInt(componentsAdded[i][0][1]);
		qualityTotal = qualityTotal + (parseInt(componentsAdded[i][0][2]) * parseInt(componentsAdded[i][0][1]));
		if (parseInt(componentsAdded[i][0][3]) < maxCraftItemDura) {
			maxCraftItemDura = parseInt(componentsAdded[i][0][3]);
		}
		if (parseInt(componentsAdded[i][0][4]) < maxCraftItemEffec) {
			maxCraftItemEffec = parseInt(componentsAdded[i][0][4]);
		}
		if (finalCraftedItemEnchant != 999) {
			// enchant already present, check if this component's enchant value conflicts
			if (parseInt(componentsAdded[i][0][8]) != finalCraftedItemEnchant) {
				finalCraftedItemEnchant = 0;
			}
		} else {
			finalCraftedItemEnchant = parseInt(componentsAdded[i][0][8]);
		}
		coloursToMix.push(parseInt(componentsAdded[i][0][7]));
	}
	maxCraftItemQual = (qualityTotal / numberOfIndividualItemsAdded);
	finalCraftedItemWrapped = -1;
	finalCraftedItemWear = 0;
	finalHallmark = charnumber;
	// allow player to inscribe item during the crafting process ?    #######################
	finalInscription = "-";
	// check if there is a dye in the dye slot:
	if (thisDyeSlot.length > 0) {
		coloursToMix.push(parseInt(thisDyeSlot[0][7]));
	}
	// check inventory items - if item is dyeable then average colours                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
	if (inventoryitems[finalCraftedItemType][9] != -1) {
		finalCraftedItemColour = mixColours();
	} else {
		finalCraftedItemColour = 0;
	}
	maxCraftItemQual = tierToPercent(maxCraftItemQual);
	maxCraftItemEffec = tierToPercent(maxCraftItemEffec);
	// apply craft tool modifier:
	var actionValue = parseInt(storedcraftingModifier.substr(1));
	switch (storedcraftingModifier.substr(0, 1)) {
		case "q" :
			maxCraftItemQual += actionValue;
			break;
		case "d" :
			maxCraftItemDura += actionValue;
			break;
		case "e" :
			maxCraftItemEffec += actionValue;
			break;
	}
	// ensure maximums are retained:
	if (maxCraftItemQual > 100) {
		maxCraftItemQual = 100;
	}
	if (maxCraftItemDura > 100) {
		maxCraftItemDura = 100;
	}
	if (maxCraftItemEffec > 100) {
		maxCraftItemEffec = 100;
	}
	// remove all component clips:                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
	gamedisplay.inventorysets.icrafting.inventoryIcon0.removeMovieClip();
	gamedisplay.inventorysets.icrafting.inventoryIcon1.removeMovieClip();
	gamedisplay.inventorysets.icrafting.inventoryIcon2.removeMovieClip();
	gamedisplay.inventorysets.icrafting.inventoryIcon3.removeMovieClip();
	// show relevant skill buttons:
	butOffsetX = 0;
	hotkeyCounter = 1;
	for (var i = 0; i < knownSkills.length; i++) {
		if (availableSkills[(knownSkills[i])][4] == currentProfession) {
			gamedisplay.inventorysets.craftingPanel.buttonsWrapper.attachMovie("skillClip","skillClip" + hotkeyCounter,hotkeyCounter);
			gamedisplay.inventorysets.craftingPanel.buttonsWrapper["skillClip" + hotkeyCounter]._x = butOffsetX;
			gamedisplay.inventorysets.craftingPanel.buttonsWrapper["skillClip" + hotkeyCounter].textLabel.text = availableSkills[(knownSkills[i])][0];
			gamedisplay.inventorysets.craftingPanel.buttonsWrapper["skillClip" + hotkeyCounter].iconGraphic.gotoAndStop(availableSkills[(knownSkills[i])][1]);
			gamedisplay.inventorysets.craftingPanel.buttonsWrapper["skillClip" + hotkeyCounter].coolDownSpeed = availableSkills[(knownSkills[i])][2];
			gamedisplay.inventorysets.craftingPanel.buttonsWrapper["skillClip" + hotkeyCounter].skillEffect = availableSkills[(knownSkills[i])][3];
			gamedisplay.inventorysets.craftingPanel.buttonsWrapper["skillClip" + hotkeyCounter].rollOverText = "";
			gamedisplay.inventorysets.craftingPanel.buttonsWrapper["skillClip" + hotkeyCounter].hotkey = hotkeyCounter;
			for (var j = 0; j < availableSkills[(knownSkills[i])][3].length; j++) {
				gamedisplay.inventorysets.craftingPanel.buttonsWrapper["skillClip" + hotkeyCounter].rolloverClip.textBox.text += availableSkills[(knownSkills[i])][3][j][0] + " " + availableSkills[(knownSkills[i])][3][j][1] + availableSkills[(knownSkills[i])][3][j][2] + "\n";
			}
			gamedisplay.inventorysets.craftingPanel.buttonsWrapper["skillClip" + hotkeyCounter].rolloverClip._visible = false;
			butOffsetX += 60;
			hotkeyCounter++;
		}
	}
	gamedisplay.inventorysets.craftingPanel.swapDepths(numberOfInventorySets);
	gamedisplay.inventorysets.craftingPanel._visible = true;
	setupCraftingBars();
}
//
function mixColours() {
	var colIndex = 0;
	var amountOfBlack = 0;
	var amountOfWhite = 0;
	var colourQuantities = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	for (var i = 0; i < coloursToMix.length; i++) {
		if (isNaN(coloursToMix[i])) {
			// is a filename for user content or a treasure map reference
			// don't attempt to mix colours, just return this filename/reference:
			return coloursToMix[i];
		}
		coloursToMix[i] = parseInt(coloursToMix[i]);
		colourQuantities[(coloursToMix[i])]++;
		colIndex |= coloursToMix[i];
		// check for black and white bit in this colour:
		if (coloursToMix[i] == (32 | coloursToMix[i])) {
			amountOfBlack++;
		}
		if (coloursToMix[i] == (16 | coloursToMix[i])) {
			amountOfWhite++;
		}
	}
	// determine if there was one colour more prevalent than the others - if so, make the output colour this colour:
	for (var i = 0; i < colourQuantities.length; i++) {
		if (colourQuantities[i] / coloursToMix.length > 0.7) {
			colIndex = i;
			break;
		}
	}
	if (colIndex > 48) {
		// colour has both black and white - see if one outweighs the other:
		if (amountOfBlack > amountOfWhite) {
			colIndex -= 16;
		} else if (amountOfBlack < amountOfWhite) {
			colIndex -= 32;
		} else {
			// equal amounts:
			colIndex -= 48;
		}
	}
	return colIndex;
}
//
function setupCraftingBars() {
	durabilityDecRate = (106 - ((levelFromExp(playerCraftingSkill[currentProfession])) - thisRecipesDifficulty)) / (100 / timeDec);
	// (using 106 above balances so with no player intervention a green item will always be successful and a yellow will fail without intervention)
	craftingdurability = maxCraftItemDura;
	// initial quality is a percentage of maximum possible:
	craftingeffectiveness = maxCraftItemEffec;
	craftingquality = maxCraftItemQual / 5;
	craftingtimeremaining = 100;
	gamedisplay.inventorysets.craftingPanel.durabilityrating.bar._width = currentdurability * craftBarToPercentRatio;
	gamedisplay.inventorysets.craftingPanel.timeremaining.bar._width = currenttimeremaining * craftBarToPercentRatio;
	gamedisplay.inventorysets.craftingPanel.qualityrating.bar._width = currentquality * craftBarToPercentRatio;
	gamedisplay.inventorysets.craftingPanel.effectivenessrating.bar._width = currenteffectiveness * craftBarToPercentRatio;
	//
	currentdurability = craftingdurability;
	currentquality = craftingquality;
	currenteffectiveness = craftingeffectiveness;
	currenttimeremaining = craftingtimeremaining;
	//
	hotkeyCounter = 1;
	for (var i = 0; i < knownSkills.length; i++) {
		if (availableSkills[(knownSkills[i])][4] == currentProfession) {
			gamedisplay.inventorysets.craftingPanel.buttonsWrapper["skillClip" + hotkeyCounter].skillPressed = false;
			gamedisplay.inventorysets.craftingPanel.buttonsWrapper["skillClip" + hotkeyCounter].coolDown = 0;
			gamedisplay.inventorysets.craftingPanel.buttonsWrapper["skillClip" + hotkeyCounter].cooldownAnime.gotoAndStop(101);
			hotkeyCounter++;
		}
	}
	// ########## set this after build animation:
	isCrafting = true;
}
//
function tierToPercent(tierValue) {
	tierValue = mfloor(tierValue);
	// convert crafting tier to maximum percent for that band
	// (0 - 57 = tier 1,  58 - 78 = tier 2, 79 - 93 = tier 3, 94 - 100 = tier 4)
	switch (tierValue) {
		case 4 :
			return 100;
			break;
		case 3 :
			return 93;
			break;
		case 2 :
			return 78;
			break;
		default :
			return 57;
	}
}
function percentToTier(percentValue) {
	// find the tier from a given percentage
	if (percentValue >= 94) {
		return 4;
	} else if (percentValue >= 79) {
		return 3;
	} else if (percentValue >= 58) {
		return 2;
	} else {
		return 1;
	}
}
//
function craftItem() {
	// check skills:   
	hotkeyCounter = 1;
	for (var i = 0; i < knownSkills.length; i++) {
		if (availableSkills[(knownSkills[i])][4] == currentProfession) {
			if (gamedisplay.inventorysets.craftingPanel.buttonsWrapper["skillClip" + hotkeyCounter].coolDown > 0) {
				if (gamedisplay.inventorysets.craftingPanel.buttonsWrapper["skillClip" + hotkeyCounter].coolDownSpeed == 0) {
					gamedisplay.inventorysets.craftingPanel.buttonsWrapper["skillClip" + hotkeyCounter].cooldownAnime.gotoAndStop(1);
				} else {
					gamedisplay.inventorysets.craftingPanel.buttonsWrapper["skillClip" + hotkeyCounter].coolDown += gamedisplay.inventorysets.craftingPanel.buttonsWrapper["skillClip" + hotkeyCounter].coolDownSpeed;
					gamedisplay.inventorysets.craftingPanel.buttonsWrapper["skillClip" + hotkeyCounter].cooldownAnime.gotoAndStop(gamedisplay.inventorysets.craftingPanel.buttonsWrapper["skillClip" + hotkeyCounter].coolDown + 1);
				}
			}
			if (gamedisplay.inventorysets.craftingPanel.buttonsWrapper["skillClip" + hotkeyCounter].coolDown > 100) {
				// skill ready again:
				gamedisplay.inventorysets.craftingPanel.buttonsWrapper["skillClip" + hotkeyCounter].coolDown = 0;
			}
			if (gamedisplay.inventorysets.craftingPanel.buttonsWrapper["skillClip" + hotkeyCounter].skillPressed == true) {
				if (gamedisplay.inventorysets.craftingPanel.buttonsWrapper["skillClip" + hotkeyCounter].coolDown <= 0) {
					// check for effect(s) of this skill:  
					for (var j = 0; j < gamedisplay.inventorysets.craftingPanel.buttonsWrapper["skillClip" + hotkeyCounter].skillEffect.length; j++) {
						switch (gamedisplay.inventorysets.craftingPanel.buttonsWrapper["skillClip" + hotkeyCounter].skillEffect[j][0]) {
							case "quality" :
								switch (gamedisplay.inventorysets.craftingPanel.buttonsWrapper["skillClip" + hotkeyCounter].skillEffect[j][1]) {
									case "+" :
										craftingquality += gamedisplay.inventorysets.craftingPanel.buttonsWrapper["skillClip" + hotkeyCounter].skillEffect[j][2];
										break;
									case "-" :
										craftingquality -= gamedisplay.inventorysets.craftingPanel.buttonsWrapper["skillClip" + hotkeyCounter].skillEffect[j][2];
										break;
									case "*" :
										craftingquality *= gamedisplay.inventorysets.craftingPanel.buttonsWrapper["skillClip" + hotkeyCounter].skillEffect[j][2];
										break;
									case "/" :
										craftingquality /= gamedisplay.inventorysets.craftingPanel.buttonsWrapper["skillClip" + hotkeyCounter].skillEffect[j][2];
										break;
								}
								break;
							case "durability" :
								switch (gamedisplay.inventorysets.craftingPanel.buttonsWrapper["skillClip" + hotkeyCounter].skillEffect[j][1]) {
									case "+" :
										craftingdurability += gamedisplay.inventorysets.craftingPanel.buttonsWrapper["skillClip" + hotkeyCounter].skillEffect[j][2];
										break;
									case "-" :
										craftingdurability -= gamedisplay.inventorysets.craftingPanel.buttonsWrapper["skillClip" + hotkeyCounter].skillEffect[j][2];
										break;
									case "*" :
										craftingdurability *= gamedisplay.inventorysets.craftingPanel.buttonsWrapper["skillClip" + hotkeyCounter].skillEffect[j][2];
										break;
									case "/" :
										craftingdurability /= gamedisplay.inventorysets.craftingPanel.buttonsWrapper["skillClip" + hotkeyCounter].skillEffect[j][2];
										break;
								}
								break;
							case "effectiveness" :
								switch (gamedisplay.inventorysets.craftingPanel.buttonsWrapper["skillClip" + hotkeyCounter].skillEffect[j][1]) {
									case "+" :
										craftingeffectiveness += gamedisplay.inventorysets.craftingPanel.buttonsWrapper["skillClip" + hotkeyCounter].skillEffect[j][2];
										break;
									case "-" :
										craftingeffectiveness -= gamedisplay.inventorysets.craftingPanel.buttonsWrapper["skillClip" + hotkeyCounter].skillEffect[j][2];
										break;
									case "*" :
										craftingeffectiveness *= gamedisplay.inventorysets.craftingPanel.buttonsWrapper["skillClip" + hotkeyCounter].skillEffect[j][2];
										break;
									case "/" :
										craftingeffectiveness /= gamedisplay.inventorysets.craftingPanel.buttonsWrapper["skillClip" + hotkeyCounter].skillEffect[j][2];
										break;
								}
								break;
							case "time" :
								switch (gamedisplay.inventorysets.craftingPanel.buttonsWrapper["skillClip" + hotkeyCounter].skillEffect[j][1]) {
									case "+" :
										crafttimeremaining += gamedisplay.inventorysets.craftingPanel.buttonsWrapper["skillClip" + hotkeyCounter].skillEffect[j][2];
										break;
									case "-" :
										crafttimeremaining -= gamedisplay.inventorysets.craftingPanel.buttonsWrapper["skillClip" + hotkeyCounter].skillEffect[j][2];
										break;
									case "*" :
										crafttimeremaining *= gamedisplay.inventorysets.craftingPanel.buttonsWrapper["skillClip" + hotkeyCounter].skillEffect[j][2];
										break;
									case "/" :
										crafttimeremaining /= gamedisplay.inventorysets.craftingPanel.buttonsWrapper["skillClip" + hotkeyCounter].skillEffect[j][2];
										break;
								}
								break;
						}
					}
					// start cooldown timer:                                                  
					gamedisplay.inventorysets.craftingPanel.buttonsWrapper["skillClip" + hotkeyCounter].coolDown = 1;
					gamedisplay.inventorysets.craftingPanel.buttonsWrapper["skillClip" + hotkeyCounter].cooldownAnime.gotoAndStop(1);
				}
				gamedisplay.inventorysets.craftingPanel.buttonsWrapper["skillClip" + hotkeyCounter].skillPressed = false;
			}
			hotkeyCounter++;
		}
	}
	//  
	craftingdurability -= durabilityDecRate;
	craftingquality -= (timeDec / 8);
	craftingtimeremaining -= timeDec;
	// clean up
	if (craftingdurability > maxCraftItemDura) {
		craftingdurability = maxCraftItemDura;
	} else if (craftingdurability < 0) {
		craftingdurability = 0;
	}
	if (craftingeffectiveness > maxCraftItemEffec) {
		craftingeffectiveness = maxCraftItemEffec;
	} else if (craftingeffectiveness < 0) {
		craftingeffectiveness = 0;
	}
	if (craftingquality > maxCraftItemQual) {
		craftingquality = maxCraftItemQual;
	} else if (craftingquality < 0) {
		craftingquality = 0;
	}
	if (crafttimeremaining > 100) {
		crafttimeremaining = 100;
	} else if (crafttimeremaining < 0) {
		crafttimeremaining = 0;
	}
	// clean up current values too                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
	if (currentdurability > maxCraftItemDura) {
		currentdurability = maxCraftItemDura;
	} else if (currentdurability < 0) {
		currentdurability = 0;
	}
	if (currenteffectiveness > maxCraftItemEffec) {
		currenteffectiveness = maxCraftItemEffec;
	} else if (currenteffectiveness < 0) {
		currenteffectiveness = 0;
	}
	if (currentquality > maxCraftItemQual) {
		currentquality = maxCraftItemQual;
	} else if (currentquality < 0) {
		currentquality = 0;
	}
	if (currenttimeremaining > 100) {
		currenttimeremaining = 100;
	} else if (currenttimeremaining < 0) {
		currenttimeremaining = 0;
	}
	if ((craftingdurability <= 0) && (craftingtimeremaining > 0)) {
		isCrafting = false;
		trace("failure");
		componentsAdded = [];
		// force all bars to target values:
		gamedisplay.inventorysets.craftingPanel.durabilityrating.bar._width = craftingdurability * craftBarToPercentRatio;
		gamedisplay.inventorysets.craftingPanel.qualityrating.bar._width = craftingquality * craftBarToPercentRatio;
		gamedisplay.inventorysets.craftingPanel.effectivenessrating.bar._width = craftingeffectiveness * craftBarToPercentRatio;
		gamedisplay.inventorysets.craftingPanel.timeremaining.bar._width = craftingtimeremaining * craftBarToPercentRatio;
	} else if (craftingquality <= 0) {
		isCrafting = false;
		componentsAdded = [];
		trace("quality failure");
		// force all bars to target values:
		gamedisplay.inventorysets.craftingPanel.durabilityrating.bar._width = craftingdurability * craftBarToPercentRatio;
		gamedisplay.inventorysets.craftingPanel.qualityrating.bar._width = craftingquality * craftBarToPercentRatio;
		gamedisplay.inventorysets.craftingPanel.effectivenessrating.bar._width = craftingeffectiveness * craftBarToPercentRatio;
		gamedisplay.inventorysets.craftingPanel.timeremaining.bar._width = craftingtimeremaining * craftBarToPercentRatio;
	} else if (craftingtimeremaining <= 0) {
		isCrafting = false;
		componentsAdded = [];
		trace("success!");
		// force all bars to target values:
		gamedisplay.inventorysets.craftingPanel.durabilityrating.bar._width = craftingdurability * craftBarToPercentRatio;
		gamedisplay.inventorysets.craftingPanel.qualityrating.bar._width = craftingquality * craftBarToPercentRatio;
		gamedisplay.inventorysets.craftingPanel.effectivenessrating.bar._width = craftingeffectiveness * craftBarToPercentRatio;
		gamedisplay.inventorysets.craftingPanel.timeremaining.bar._width = craftingtimeremaining * craftBarToPercentRatio;
		if (canadditemtoinventory(finalCraftedItemType, finalCraftedItemQuantity, percentToTier(craftingquality), mceil(craftingdurability), percentToTier(craftingeffectiveness), finalCraftedItemWrapped, finalCraftedItemWear, finalCraftedItemColour, finalCraftedItemEnchant, finalHallmark, finalInscription) == finalCraftedItemQuantity) {
			gamedisplay.inventorysets.craftingPanel._visible = false;
			// add to array and update visually
			additemtoinventory(finalCraftedItemType,finalCraftedItemQuantity,percentToTier(craftingquality),mceil(craftingdurability),percentToTier(craftingeffectiveness),finalCraftedItemWrapped,finalCraftedItemWear,finalCraftedItemColour,finalCraftedItemEnchant,finalHallmark,finalInscription);
			showItemAddedAnimation(finalCraftedItemType);
		} else {
			// store on overflow
			storedCraftedItem[0] = finalCraftedItemType;
			storedCraftedItem[1] = finalCraftedItemQuantity;
			storedCraftedItem[2] = percentToTier(craftingquality);
			storedCraftedItem[3] = mceil(craftingdurability);
			storedCraftedItem[4] = percentToTier(craftingeffectiveness);
			storedCraftedItem[5] = finalCraftedItemWrapped;
			storedCraftedItem[6] = finalCraftedItemWear;
			storedCraftedItem[7] = finalCraftedItemColour;
			storedCraftedItem[8] = finalCraftedItemEnchant;
			storedCraftedItem[9] = finalHallmark;
			storedCraftedItem[10] = finalInscription;
			showCraftingOverflow();
		}
		increaseSkill();
	} else {
		// move current bar value towards required value: 
		currentdurability += (craftingdurability - currentdurability) * accelerateFactor;
		currentquality += (craftingquality - currentquality) * accelerateFactor;
		currenteffectiveness += (craftingeffectiveness - currenteffectiveness) * accelerateFactor;
		currenttimeremaining += (craftingtimeremaining - currenttimeremaining) * accelerateFactor;
		// check if current bar value is within the tolerance of the required value
		if (mabs(currentdurability - craftingdurability) < tolerance) {
			currentdurability = craftingdurability;
		}
		if (mabs(currentquality - craftingquality) < tolerance) {
			currentquality = craftingquality;
		}
		if (mabs(currenteffectiveness - craftingeffectiveness) < tolerance) {
			currenteffectiveness = craftingeffectiveness;
		}
		if (mabs(currenttimeremaining - craftingtimeremaining) < tolerance) {
			currenttimeremaining = craftingtimeremaining;
		}
		//                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
		gamedisplay.inventorysets.craftingPanel.durabilityrating.bar._width = currentdurability * craftBarToPercentRatio;
		gamedisplay.inventorysets.craftingPanel.qualityrating.bar._width = currentquality * craftBarToPercentRatio;
		gamedisplay.inventorysets.craftingPanel.effectivenessrating.bar._width = currenteffectiveness * craftBarToPercentRatio;
		gamedisplay.inventorysets.craftingPanel.timeremaining.bar._width = currenttimeremaining * craftBarToPercentRatio;
	}
}
//
function levelFromExp(amountOfExp) {
	return mfloor(msqrt(amountOfExp / 150));
}
function ExpFromLevel(expLevel) {
	return ((expLevel * expLevel) * 150);
}
//
function increaseSkill() {
	// after successful crafting, determine what experience to award
	// 'score' the successfully created item:
	var itemScore = percentToTier(craftingquality) + (mceil(craftingdurability) / 25) + percentToTier(craftingeffectiveness);
	// additional score for the item being enchanted or dyed:
	if (finalCraftedItemColour != -1) {
		itemScore += 2;
	}
	if (finalCraftedItemEnchant != -1) {
		itemScore += 2;
	}
	// then modify score by how easy it was to create                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
	trace("item score: " + itemScore);
	trace("score modifier: " + (thisRecipesDifficulty / (levelFromExp(playerCraftingSkill[currentProfession]) + 1)) * 10);
	// +1 below so if player is level 0, then don't get a divde by zero:
	itemScore = mfloor(itemScore * (thisRecipesDifficulty / (levelFromExp(playerCraftingSkill[currentProfession]) + 1)) * 10);
	trace("exp gained: " + itemScore);
	var oldLevel = levelFromExp(playerCraftingSkill[currentProfession]);
	playerCraftingSkill[currentProfession] += itemScore;
	if (levelFromExp(playerCraftingSkill[currentProfession]) > oldLevel) {
		trace("gained level!");
	}
}
//
function showSkillValues() {
	// show indivdual skill values as a percent to achieve the next level:
	for (var i = 0; i < playerCraftingSkill.length; i++) {
		// find exp for the start of the level, and max for this level:
		var thisLevel = levelFromExp(playerCraftingSkill[i]);
		var startThisLevelExp = ExpFromLevel(thisLevel);
		var nextLevelExp = ExpFromLevel(thisLevel + 1) - 1;
		var expPercent = mfloor((playerCraftingSkill[i] - startThisLevelExp) / (nextLevelExp - startThisLevelExp) * 100);
		gamedisplay.skillDisplay.individualSkills["skillPercent" + i].bar._width = expPercent * craftBarToPercentRatio;
		gamedisplay.skillDisplay.individualSkills["skillPercent" + i].levelOutput.text = thisLevel;
		gamedisplay.skillDisplay.individualSkills["skillPercent" + i].valueOutput.text = playerCraftingSkill[i] + "/" + nextLevelExp;
	}
	gamedisplay.skillDisplay._visible = true;
}
//
function showSkillsInProportion() {
	// show all absolute skill scores in proportion to each other
	// find highest skill score:
	highestSkill = -1;
	for (var i = 0; i < playerCraftingSkill.length; i++) {
		if (playerCraftingSkill[i] > highestSkill) {
			highestSkill = playerCraftingSkill[i];
		}
	}
	for (var i = 0; i < playerCraftingSkill.length; i++) {
		var thisLevel = levelFromExp(playerCraftingSkill[i]);
		var nextLevelExp = ExpFromLevel(thisLevel + 1) - 1;
		var expPercent = mfloor((playerCraftingSkill[i] / highestSkill) * 100);
		gamedisplay.skillDisplay.ProportionSkills["skillPercent" + i].bar._width = expPercent * craftBarToPercentRatio;
		gamedisplay.skillDisplay.ProportionSkills["skillPercent" + i].levelOutput.text = thisLevel;
		gamedisplay.skillDisplay.ProportionSkills["skillPercent" + i].valueOutput.text = playerCraftingSkill[i] + "/" + nextLevelExp;
	}
	gamedisplay.skillDisplay._visible = true;
}
//
function collectionIsComplete() {
	for (var i = 0; i < currentCollections.length; i++) {
		var thisCollectionSet = currentCollections[i].join("");
		if (thisCollectionSet.indexOf("0") == -1) {
			// are all 1s so collection is complete:
			whichCollectionComplete = i;
			completedCollections[i] == 1;
			statusMessage(collections[whichCollectionComplete][0] + " collection is complete");
			// check to see if a title should be awarded now:
			var numberOfCompletedQuests = 0;
			for (var ci = 0; ci < completedCollections.length; ci++) {
				if (completedCollections[ci] == 1) {
					numberOfCompletedQuests++;
				}
			}
			for (var ct = 0; ct < collectionTitles.length; ct++) {
				if (numberOfCompletedQuests >= numberOfCompletedQuests[ct][0]) {
					// check not already awarded:
					if (thisPlayersTitles.indexOf(numberOfCompletedQuests[ct][1]) == -1) {
						thisPlayersTitles.push(numberOfCompletedQuests[ct][1]);
					}
				}
			}


			return true;
		}
	}
	whichCollectionComplete = -1;
	return false;
}
//
function openWorkshop() {
	// increase the workshopkeeper's speech counter so that it stays on opening the shop speech
	scrollclip["n_0"].speechcounter++;
	if (scrollclip["n_0"].speechcounter >= ((currentnpcs[0].length) - NPCStartSpeechIndex)) {
		scrollclip["n_0"].speechcounter = 0;
	}
	// hide the question:                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
	gamedisplay.dialoguebox._visible = false;
	dialogueboxdisplayed = false;
	// open the workshop:
	setsopen.push(["iworkshop", currentplans.length - 1, numberofcolumns]);
	placeinventorysets();
	resetinventory();
	// populate workshop - ignore element[0] as this is the currently made item
	for (var i = 0; i < maximumnumberofslots; i++) {
		if ((i + 1) < currentplans.length) {
			// show the player the graphic of what this plan will make:
			var planitemcode:String = (inventoryitems[parseInt(currentplans[i + 1])][2]);
			var planitem:Number = parseInt(planitemcode.substring(planitemcode.indexOf("r") + 1));
			gamedisplay.inventorysets.iworkshop["slot" + i].contents.gotoAndStop(planitem);
			// use i+1 because element[0] is for currently made item
			gamedisplay.inventorysets.iworkshop["slot" + i].quan.text = " ";
			gamedisplay.inventorysets.iworkshop["slot" + i]._visible = true;
		} else {
			gamedisplay.inventorysets.iworkshop["slot" + i]._visible = false;
		}
	}
	gamedisplay.inventorysets.iworkshop.backgroundblock._y = invtileheight * (mceil(currentplans.length / numberofcolumns) - 1);
	gamedisplay.inventorysets.iworkshop.borderrepeat._height = invtileheight * (mceil(currentplans.length / numberofcolumns) - 1);
	//
	gamedisplay.inventorysets.iworkshop._visible = true;
	gamedisplay.inventorysets._visible = true;
	waitingforinventory = true;
}
//
function openShop() {
	// increase the shopkeeper's speech counter so that it stays on opening the shop speech
	// why?
	// ####################scrollclip["n_"+whosaiditindex].speechcounter++;
	// hide the question:
	gamedisplay.dialoguebox._visible = false;
	dialogueboxdisplayed = false;
	// store the shop owner:
	storeOwner = whosaiditindex;
	// make a copy of the array (in case "repair" needs removing, it will remain in the source array still)
	shopcontents = scrollclip.shopcontents[storeOwner].slice();
	var okToOpenShop = true;
	if (shopcontents[0] == "userGeneratedVendor") {
		// this is a user generated content vendor - so prepare list of items that the player has created:
		if (thisPlayersContent.length == 0) {
			okToOpenShop = false;
			displaytext("you haven't created any art to sell yet",whosaiditindex,true);
		} else {
			shopcontents = [];
			for (var i = 0; i < thisPlayersContent.length; i++) {
				// all user generated items should have the player's hallmark
				shopcontents.push([thisPlayersContent[i][0], "1000", "4", "100", "4", "-1", thisPlayersContent[i][2], thisPlayersContent[i][1], "0", charnumber]);
			}
		}
	}
	if (shopcontents[0][0] == "repair") {
		var showRepairPanel = true;
		// remove this 'repair' element from the array:
		shopcontents.shift();
	} else {
		var showRepairPanel = false;
	}
	lastSoldItemSlot = -1;
	if (lastSoldItems.length > 0) {
		shopcontents.push(lastSoldItems[0][0]);
		lastSoldItemSlot = shopcontents.length - 1;
	}
	if (okToOpenShop) {
		// open the shop:
		setsopen.push(["ishop", shopcontents.length, numberofcolumns]);
		if (!(inventorySetIsOpen("iinv"))) {
			setsopen.push(["iinv", currentbagsize, numberofcolumns]);
			numberofslotstoadd = currentbagsize;
			whicharray = "inventory";
			settoggle = "iinv";
			populateInventorySet();
		}
		resetinventory();
		placeinventorysets();
		shopisopen = true;
		// populate shop:
		var currentx = 0;
		var currenty = 0;
		for (var i = 0; i < maximumnumberofslots; i++) {
			// restore this slot to its natural position (in case it was moved as the list of items sold by the player)
			gamedisplay.inventorysets.ishop["slot" + i]._x = currentx;
			gamedisplay.inventorysets.ishop["slot" + i]._y = currenty;
			if (i == lastSoldItemSlot) {
				// move this slot away visually to be the slot where the user can buy back the previously sold items:
				gamedisplay.inventorysets.ishop["slot" + i]._y += invtileheight;
			}
			currentx += invtilewidth;
			if (currentx >= (invtilewidth * numberofcolumns)) {
				currentx = 0;
				currenty += invtileheight;
			}
			if (i < shopcontents.length) {
				// show this slot:
				if (shopcontents[i][0] != "1") {
					attachSingleInvIcon("ishop",i);
				}
				gamedisplay.inventorysets.ishop["slot" + i]._visible = true;
			} else {
				gamedisplay.inventorysets.ishop["slot" + i]._visible = false;
			}
		}
		gamedisplay.inventorysets.ishop.backgroundblock._y = invtileheight * (mceil((shopcontents.length) / numberofcolumns) - 1);
		gamedisplay.inventorysets.ishop.borderrepeat._height = invtileheight * (mceil((shopcontents.length) / numberofcolumns) - 1);
		if (showRepairPanel) {
			gamedisplay.inventorysets.ishop.repair._y = invtileheight * (mceil((shopcontents.length) / numberofcolumns) - 1) + 55;
			gamedisplay.inventorysets.ishop.repair._visible = true;
		} else {
			gamedisplay.inventorysets.ishop.repair._visible = false;
		}
		gradeItemsForSale();
		gamedisplay.inventorysets.ishop._visible = true;
		gamedisplay.inventorysets.iinv._visible = true;
		gamedisplay.inventorysets._visible = true;
		waitingforinventory = true;
	}
}
//
function createMessage(atPostOffice) {
	// check the player has some blank paper:
	// ############
	var playerHasPaper = false;
	for (var i = 0; i < currentbagsize; i++) {
		if (inventoryitems[(inventory[i][0])][6] == "post") {
			// is paper, check now if it's blank:
			if (inventory[i][6] == -1) {
				playerHasPaper = true;
				break;
			}
		}
	}
	if (petcarrying.length != 0) {
		if (isinrange(scrollclip.hero.px, scrollclip.hero.py, scrollclip.pet.px, scrollclip.pet.py, (spacing * 1.5))) {
			for (var i = 0; i < petcarrying.length; i++) {
				if (inventoryitems[(petcarrying[i][0])][6] == "post") {
					// is paper, check now if it's blank:
					if (petcarrying[i][6] == -1) {
						playerHasPaper = true;
						break;
					}
				}
			}
		}
	}
	if (playerHasPaper) {
		// ##################  
		if (atPostOffice == false) {
			// then can't send post, only save for later (ie. change the 'wear' value)
			// #####
			// show 'SAVE' button
		} else {
			// #####
			// show 'SEND' button
		}
		gamedisplay.dialoguebox._visible = false;
		dialogueboxdisplayed = false;
		// check if post panel is already open:
		var postAlreadyOpen = false;
		for (var i = 0; i < setsopen.length; i++) {
			if (setsopen[i][0] == "ipost") {
				postAlreadyOpen = true;
				break;
			}
		}
		if (!postAlreadyOpen) {
			setsopen.push(["ipost", -1, numberofcolumns]);
		}
		// check if iinv panel is already open:                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
		var iinvAlreadyOpen = false;
		for (var i = 0; i < setsopen.length; i++) {
			if (setsopen[i][0] == "iinv") {
				iinvAlreadyOpen = true;
				break;
			}
		}
		if (!iinvAlreadyOpen) {
			setsopen.push(["iinv", currentbagsize, numberofcolumns]);
			numberofslotstoadd = currentbagsize;
			whicharray = "inventory";
			settoggle = "iinv";
			populateInventorySet();
		}
		resetinventory();
		placeinventorysets();
		gamedisplay.inventorysets.ipost._visible = true;
		gamedisplay.inventorysets.iinv._visible = true;
		gamedisplay.inventorysets._visible = true;
		if (atPostOffice) {
			waitingforinventory = true;
		}
	} else {
		if (atPostOffice) {
			// post master opens shop to sell player some paper
			displaytext("you need some blank paper. I can sell you some if you'd like?+SHOP",whosaiditindex,true);
		} else {
			statusMessage("you need some blank paper");
		}
	}
}
//
function openMessage(questToOpen, messageIndex) {

	// check to see if this is a blank parchment or not:
	if (messageIndex != -1) {

		/*
		// see if reading this opens a quest:
		if (questToOpen != -1) {
		if (quests[questToOpen][0] == 0) {
		quests[questToOpen][0] = 1;
		}
		}
		*/
		var messageSplit = messageIndex.inscr.split("[**]");
		var messageToDisplay = messageSplit[1];



		var sharp = messageToDisplay.indexOf("#");
		if (sharp != -1) {
			var questnumber = parseInt(messageToDisplay.substring(0, sharp));


			if (quests[questnumber][0] == 0) {
				quests[questnumber][0] = 1;
			}
			// check if this relates to a quest event:  
			if (quests[questnumber][2].charAt(0) == "!") {
				// complete quest event:
				questEvents[parseInt(quests[questnumber][2].substring(1))] = 1;
			}


			messageToDisplay = messageToDisplay.substring(sharp + 1);
		}
		// check if this message is already being displayed:  
		if (gamedisplay.parchmentHolder["parchment" + messageIndex] == undefined) {
			// create new parchment:
			var newParchDepth = gamedisplay.parchmentHolder.getNextHighestDepth();
			gamedisplay.parchmentHolder.attachMovie("parchmentPanel","parchment" + messageIndex,newParchDepth);
			gamedisplay.parchmentHolder["parchment" + messageIndex]._x = 0;
			gamedisplay.parchmentHolder["parchment" + messageIndex]._y = 0;
			gamedisplay.parchmentHolder["parchment" + messageIndex].parchmentOutput.text = messageToDisplay;
		} else {
			// bring existing one to the front and re-centre:
			var newParchDepth = gamedisplay.parchmentHolder.getNextHighestDepth();
			gamedisplay.parchmentHolder["parchment" + messageIndex].swapDepths(newParchDepth);
			gamedisplay.parchmentHolder["parchment" + messageIndex]._x = 0;
			gamedisplay.parchmentHolder["parchment" + messageIndex]._y = 0;
		}
	} else {
		// open post panel to create a message:
		// ################## but can't be sent until at a post office.
		createMessage(false);
	}
}
//
function swapIcons(iconRef) {
	// swap icons over
	var okToSwap = true;
	if (fromarray == "currentlyEquipped") {
		// need to make sure that this icon can be equipped to the same slot as the one being moved first:
		var currentEquipSlot = parseInt(inventoryitems[parseInt(iconRef.invIcons._currentframe)][13]);
		var swapEquipSlot = inventoryitems[parseInt(_root[droparray][toWhichArraySlot][0])][13];
		if (currentEquipSlot != swapEquipSlot) {
			okToSwap = false;
			statusMessage("can't swap these items as the second item can't be equipped here");
			// snap back
			iconRef._x = iconRef.xorigin;
			iconRef._y = iconRef.yorigin;
		}
		// check the quantity to swap in, if more than 1 then need to find a place for the currently equipped icon and restore the swapped icon's excess:                                                                                                                  
		if (parseInt(_root[droparray][toWhichArraySlot][1]) > 1) {
			// check if currently equipped icon can be added somewhere
			if (canadditemtoinventory(currentlyEquipped[0][currentEquipSlot][0], currentlyEquipped[0][currentEquipSlot][1], currentlyEquipped[0][currentEquipSlot][2], currentlyEquipped[0][currentEquipSlot][3], currentlyEquipped[0][currentEquipSlot][4], currentlyEquipped[0][currentEquipSlot][5], currentlyEquipped[0][currentEquipSlot][6], currentlyEquipped[0][currentEquipSlot][7], currentlyEquipped[0][currentEquipSlot][8], currentlyEquipped[0][currentEquipSlot][9], currentlyEquipped[0][currentEquipSlot][10]) == 1) {
				// can't be a quantity split in this instance
				// restore excess
				iconRef._x = iconRef.xorigin;
				iconRef._y = iconRef.yorigin;
				_root[droparray][toWhichArraySlot][1] = parseInt(_root[droparray][toWhichArraySlot][1]) - 1;
				var swappedIconRef = gamedisplay.inventorysets[droppedInvSet]["inventoryIcon" + toWhichArraySlot];
				swappedIconRef.quan.text = _root[droparray][toWhichArraySlot][1];
				additemtoinventory(currentlyEquipped[0][currentEquipSlot][0],currentlyEquipped[0][currentEquipSlot][1],currentlyEquipped[0][currentEquipSlot][2],currentlyEquipped[0][currentEquipSlot][3],currentlyEquipped[0][currentEquipSlot][4],currentlyEquipped[0][currentEquipSlot][5],currentlyEquipped[0][targetEquipSlot][6],currentlyEquipped[0][currentEquipSlot][7],currentlyEquipped[0][currentEquipSlot][8],currentlyEquipped[0][currentEquipSlot][9],currentlyEquipped[0][currentEquipSlot][10]);
				showItemAddedAnimation(currentlyEquipped[0][targetEquipSlot][0]);
				currentlyEquipped[0][currentEquipSlot][0] = swappedIconRef.invIcons._currentframe;
				currentlyEquipped[0][currentEquipSlot][1] = 1;
				currentlyEquipped[0][currentEquipSlot][2] = swappedIconRef.qual._currentframe;
				currentlyEquipped[0][currentEquipSlot][3] = swappedIconRef.dura;
				currentlyEquipped[0][currentEquipSlot][4] = swappedIconRef.effec;
				currentlyEquipped[0][currentEquipSlot][5] = swappedIconRef.wrapping;
				currentlyEquipped[0][currentEquipSlot][6] = swappedIconRef.wear;
				currentlyEquipped[0][currentEquipSlot][7] = swappedIconRef.col;
				currentlyEquipped[0][currentEquipSlot][8] = swappedIconRef.enchant;
				currentlyEquipped[0][currentEquipSlot][9] = swappedIconRef.hallmark;
				currentlyEquipped[0][currentEquipSlot][10] = swappedIconRef.inscr;
				// remove old icon:         
				gamedisplay.inventorysets.iequip["inventoryIcon" + currentEquipSlot].removeMovieClip();
				// attach new icon:
				attachSingleInvIcon("iequip",currentEquipSlot);
				okToSwap = false;
			} else {
				okToSwap = false;
				statusMessage("no room in the inventory for the currently equipped item");
				// snap back
				iconRef._x = iconRef.xorigin;
				iconRef._y = iconRef.yorigin;
			}
		}
	}
	if (okToSwap) {
		// store second array details
		var storedItemType = _root[droparray][toWhichArraySlot][0];
		var storedItemquan = _root[droparray][toWhichArraySlot][1];
		var storedItemqual = _root[droparray][toWhichArraySlot][2];
		var storedItemdura = _root[droparray][toWhichArraySlot][3];
		var storedItemeffec = _root[droparray][toWhichArraySlot][4];
		var storedItemwrapping = _root[droparray][toWhichArraySlot][5];
		var storedCurrentWear = _root[droparray][toWhichArraySlot][6];
		var storedColour = _root[droparray][toWhichArraySlot][7];
		var storedEnchanted = _root[droparray][toWhichArraySlot][8];
		var storedHallmark = _root[droparray][toWhichArraySlot][9];
		var storedInscribe = _root[droparray][toWhichArraySlot][10];
		// check if the second icon is money:
		if (inventoryitems[(parseInt(_root[droparray][toWhichArraySlot][0]))][2] == "£") {
			money += parseInt(_root[droparray][toWhichArraySlot][1]);
			updatemoney();
			// make change to the second array:
			_root[droparray][toWhichArraySlot][0] = _root[fromarray][fromWhichArraySlot][0];
			_root[droparray][toWhichArraySlot][1] = _root[fromarray][fromWhichArraySlot][1];
			_root[droparray][toWhichArraySlot][2] = _root[fromarray][fromWhichArraySlot][2];
			_root[droparray][toWhichArraySlot][3] = _root[fromarray][fromWhichArraySlot][3];
			_root[droparray][toWhichArraySlot][4] = _root[fromarray][fromWhichArraySlot][4];
			_root[droparray][toWhichArraySlot][5] = _root[fromarray][fromWhichArraySlot][5];
			_root[droparray][toWhichArraySlot][6] = _root[fromarray][fromWhichArraySlot][6];
			_root[droparray][toWhichArraySlot][7] = _root[fromarray][fromWhichArraySlot][7];
			_root[droparray][toWhichArraySlot][8] = _root[fromarray][fromWhichArraySlot][8];
			_root[droparray][toWhichArraySlot][9] = _root[fromarray][fromWhichArraySlot][9];
			_root[droparray][toWhichArraySlot][10] = _root[fromarray][fromWhichArraySlot][10];
			// empty first array :
			_root[fromarray][fromWhichArraySlot][0] = "1";
			var storedRefID = iconRef.refID;
			if (droparray != fromarray) {
				// remove both clips and only attach the new one in the dropped location
				gamedisplay.inventorysets[iconRef.setRef]["inventoryIcon" + iconRef.refID].removeMovieClip();
				gamedisplay.inventorysets[droppedInvSet]["inventoryIcon" + toWhichArraySlot].removeMovieClip();
				attachSingleInvIcon(droppedInvSet,toWhichArraySlot);
			} else {
				// change the clip's refID and its name to point to the new slot
				var storedX = iconRef.xorigin;
				var storedY = iconRef.yorigin;
				var storedName = iconRef._name;
				iconRef._x = thisDroppedOverIcon._x;
				iconRef._y = thisDroppedOverIcon._y;
				iconRef.refID = toWhichArraySlot;
				var newName = "inventoryIcon" + toWhichArraySlot;
				thisDroppedOverIcon._x = storedX;
				thisDroppedOverIcon._y = storedY;
				thisDroppedOverIcon.refID = storedRefID;
				thisDroppedOverIcon._name = storedName;
				iconRef._name = newName;
			}
		} else {
			// make change to the second array:
			_root[droparray][toWhichArraySlot][0] = _root[fromarray][fromWhichArraySlot][0];
			_root[droparray][toWhichArraySlot][1] = _root[fromarray][fromWhichArraySlot][1];
			_root[droparray][toWhichArraySlot][2] = _root[fromarray][fromWhichArraySlot][2];
			_root[droparray][toWhichArraySlot][3] = _root[fromarray][fromWhichArraySlot][3];
			_root[droparray][toWhichArraySlot][4] = _root[fromarray][fromWhichArraySlot][4];
			_root[droparray][toWhichArraySlot][5] = _root[fromarray][fromWhichArraySlot][5];
			_root[droparray][toWhichArraySlot][6] = _root[fromarray][fromWhichArraySlot][6];
			_root[droparray][toWhichArraySlot][7] = _root[fromarray][fromWhichArraySlot][7];
			_root[droparray][toWhichArraySlot][8] = _root[fromarray][fromWhichArraySlot][8];
			_root[droparray][toWhichArraySlot][9] = _root[fromarray][fromWhichArraySlot][9];
			_root[droparray][toWhichArraySlot][10] = _root[fromarray][fromWhichArraySlot][10];
			// make change to first array :
			_root[fromarray][fromWhichArraySlot][0] = storedItemType;
			_root[fromarray][fromWhichArraySlot][1] = storedItemquan;
			_root[fromarray][fromWhichArraySlot][2] = storedItemqual;
			_root[fromarray][fromWhichArraySlot][3] = storedItemdura;
			_root[fromarray][fromWhichArraySlot][4] = storedItemeffec;
			_root[fromarray][fromWhichArraySlot][5] = storedItemwrapping;
			_root[fromarray][fromWhichArraySlot][6] = storedCurrentWear;
			_root[fromarray][fromWhichArraySlot][7] = storedColour;
			_root[fromarray][fromWhichArraySlot][8] = storedEnchanted;
			_root[fromarray][fromWhichArraySlot][9] = storedHallmark;
			_root[fromarray][fromWhichArraySlot][10] = storedInscribe;
			var storedRefID = iconRef.refID;
			if (droparray != fromarray) {
				// remove the clip from the old set and attach it to the new set:
				var storedSetRef = iconRef.setRef;
				gamedisplay.inventorysets[iconRef.setRef]["inventoryIcon" + iconRef.refID].removeMovieClip();
				gamedisplay.inventorysets[droppedInvSet]["inventoryIcon" + toWhichArraySlot].removeMovieClip();
				// could be swapped using quick Equip, in which case the panels might not be open, so check for this:
				if (inventorySetIsOpen(droppedInvSet)) {
					attachSingleInvIcon(droppedInvSet,toWhichArraySlot);
				}
				if (inventorySetIsOpen(storedSetRef)) {
					attachSingleInvIcon(storedSetRef,storedRefID);
				}
			} else {
				// change the clip's refID and its name to point to the new slot
				var storedX = iconRef.xorigin;
				var storedY = iconRef.yorigin;
				var storedName = iconRef._name;
				iconRef._x = thisDroppedOverIcon._x;
				iconRef._y = thisDroppedOverIcon._y;
				iconRef.refID = toWhichArraySlot;
				var newName = "inventoryIcon" + toWhichArraySlot;
				thisDroppedOverIcon._x = storedX;
				thisDroppedOverIcon._y = storedY;
				thisDroppedOverIcon.refID = storedRefID;
				thisDroppedOverIcon._name = storedName;
				iconRef._name = newName;
			}
		}
	}
}
//
function processEquipping(iconRef) {
	// make sure this wasn't dragged from the equip panel
	if (iconRef.setRef != "iequip") {
		// see if this item can be equiped:
		if (inventoryitems[parseInt(iconRef.invIcons._currentframe)][13] != "-") {
			// check if the item is wrapped:
			if (iconRef.wrapping == -1) {
				// check if this slot is free:
				var targetEquipSlot = parseInt(inventoryitems[parseInt(iconRef.invIcons._currentframe)][13]);
				if (currentlyEquipped[0][targetEquipSlot][0] == 1) {
					// is empty so equip to that slot:
					findInventorySet();
					if (fromWhichArraySlot == "overflow") {
						currentlyEquipped[0][targetEquipSlot][0] = _root.storedCraftedItem[0];
						currentlyEquipped[0][targetEquipSlot][1] = 1;
						currentlyEquipped[0][targetEquipSlot][2] = _root.storedCraftedItem[2];
						currentlyEquipped[0][targetEquipSlot][3] = _root.storedCraftedItem[3];
						currentlyEquipped[0][targetEquipSlot][4] = _root.storedCraftedItem[4];
						currentlyEquipped[0][targetEquipSlot][5] = _root.storedCraftedItem[5];
						currentlyEquipped[0][targetEquipSlot][6] = _root.storedCraftedItem[6];
						currentlyEquipped[0][targetEquipSlot][7] = _root.storedCraftedItem[7];
						currentlyEquipped[0][targetEquipSlot][8] = _root.storedCraftedItem[8];
						currentlyEquipped[0][targetEquipSlot][9] = _root.storedCraftedItem[9];
						currentlyEquipped[0][targetEquipSlot][10] = _root.storedCraftedItem[10];
					} else {
						currentlyEquipped[0][targetEquipSlot][0] = _root[fromarray][fromWhichArraySlot][0];
						currentlyEquipped[0][targetEquipSlot][1] = 1;
						currentlyEquipped[0][targetEquipSlot][2] = _root[fromarray][fromWhichArraySlot][2];
						currentlyEquipped[0][targetEquipSlot][3] = _root[fromarray][fromWhichArraySlot][3];
						currentlyEquipped[0][targetEquipSlot][4] = _root[fromarray][fromWhichArraySlot][4];
						currentlyEquipped[0][targetEquipSlot][5] = _root[fromarray][fromWhichArraySlot][5];
						currentlyEquipped[0][targetEquipSlot][6] = _root[fromarray][fromWhichArraySlot][6];
						currentlyEquipped[0][targetEquipSlot][7] = _root[fromarray][fromWhichArraySlot][7];
						currentlyEquipped[0][targetEquipSlot][8] = _root[fromarray][fromWhichArraySlot][8];
						currentlyEquipped[0][targetEquipSlot][9] = _root[fromarray][fromWhichArraySlot][9];
						currentlyEquipped[0][targetEquipSlot][10] = _root[fromarray][fromWhichArraySlot][10];
					}
					if (parseInt(iconRef.quan.text) != 1) {
						if (quantitysplit) {
							// restore the split quantity (-1 that's now equipped) to its original slot:
							_root[fromarray][splitParentItem][1] += beingmovedquantity - 1;
							gamedisplay.inventorysets[iconRef.setRef]["inventoryIcon" + splitParentItem].quan.text = parseInt(_root[fromarray][splitParentItem][1]);
						} else {
							// restore excess
							iconRef._x = iconRef.xorigin;
							iconRef._y = iconRef.yorigin;
							_root[fromarray][fromWhichArraySlot][1] = parseInt(_root[fromarray][fromWhichArraySlot][1]) - 1;
							iconRef.quan.text = _root[fromarray][fromWhichArraySlot][1];
						}
					} else {
						if (fromWhichArraySlot == "overflow") {
							// remove from the first array :
							_root.storedCraftedItem[0] = "1";
						} else {
							// remove from the first array :
							_root[fromarray][fromWhichArraySlot][0] = "1";
						}
						// remove the clip from the old set and attach it to the new set:
						if (fromWhichArraySlot == "overflow") {
							gamedisplay.inventorysets.icrafting.overflowSlot.inventoryIconOverflow.removeMovieClip();
						} else {
							gamedisplay.inventorysets[iconRef.setRef]["inventoryIcon" + iconRef.refID].removeMovieClip();
						}
					}
					if (inventorySetIsOpen("iequip")) {
						attachSingleInvIcon("iequip",targetEquipSlot);
					}
				} else {
					// need to swap currently equipped item out
					// check that the currently equipped item can be added to the inventory
					if (parseInt(iconRef.quan.text) == 1) {
						if (quantitysplit) {
							if (canadditemtoinventory(currentlyEquipped[0][targetEquipSlot][0], currentlyEquipped[0][targetEquipSlot][1], currentlyEquipped[0][targetEquipSlot][2], currentlyEquipped[0][targetEquipSlot][3], currentlyEquipped[0][targetEquipSlot][4], currentlyEquipped[0][targetEquipSlot][5], currentlyEquipped[0][targetEquipSlot][6], currentlyEquipped[0][targetEquipSlot][7], currentlyEquipped[0][targetEquipSlot][8], currentlyEquipped[0][targetEquipSlot][9], currentlyEquipped[0][targetEquipSlot][10]) == 1) {
								additemtoinventory(currentlyEquipped[0][targetEquipSlot][0],currentlyEquipped[0][targetEquipSlot][1],currentlyEquipped[0][targetEquipSlot][2],currentlyEquipped[0][targetEquipSlot][3],currentlyEquipped[0][targetEquipSlot][4],currentlyEquipped[0][targetEquipSlot][5],currentlyEquipped[0][targetEquipSlot][6],currentlyEquipped[0][targetEquipSlot][7],currentlyEquipped[0][targetEquipSlot][8],currentlyEquipped[0][targetEquipSlot][9],currentlyEquipped[0][targetEquipSlot][10]);
								// check if a musical instrument was equipped before and stop song if so:
								if (inventoryitems[(currentlyEquipped[0][0])][2].indexOf("I") != -1) {
									// ######## this needs testing: ########
									gamedisplay.musicalInstrument._visible = false;
									playNewSong.stop();
								}
								showItemAddedAnimation(currentlyEquipped[0][targetEquipSlot][0]);
								// equip item:
								currentlyEquipped[0][targetEquipSlot][0] = iconRef.invIcons._currentframe;
								currentlyEquipped[0][targetEquipSlot][1] = 1;
								currentlyEquipped[0][targetEquipSlot][2] = iconRef.qual._currentframe;
								currentlyEquipped[0][targetEquipSlot][3] = iconRef.dura;
								currentlyEquipped[0][targetEquipSlot][4] = iconRef.effec;
								currentlyEquipped[0][targetEquipSlot][5] = iconRef.wrapping;
								currentlyEquipped[0][targetEquipSlot][6] = iconRef.wear;
								currentlyEquipped[0][targetEquipSlot][7] = iconRef.col;
								currentlyEquipped[0][targetEquipSlot][8] = iconRef.enchant;
								currentlyEquipped[0][targetEquipSlot][9] = iconRef.hallmark;
								currentlyEquipped[0][targetEquipSlot][10] = iconRef.inscr;
								// remove old icon:
								gamedisplay.inventorysets.iequip["inventoryIcon" + targetEquipSlot].removeMovieClip();
								// remove dragged icon:
								gamedisplay.inventorysets[iconRef.setRef]["inventoryIcon" + iconRef.refID].removeMovieClip();
								if (inventorySetIsOpen("iequip")) {
									// show newly equipped icon:
									attachSingleInvIcon("iequip",targetEquipSlot);
								}
							} else {
								// restore the split quantity to its original slot:
								_root[fromarray][splitParentItem][1] += beingmovedquantity;
								gamedisplay.inventorysets[iconRef.setRef]["inventoryIcon" + splitParentItem].quan.text = parseInt(_root[fromarray][splitParentItem][1]);
								gamedisplay.inventorysets[iconRef.setRef]["inventoryIcon" + iconRef.refID].removeMovieClip();
								statusMessage("no room in inventory for currently equipped item");
							}
							quantitysplit = false;
						} else {
							// if there's only 1 item being dragged then the currently equipped item can always go in that now empty slot
							findInventorySet();
							toWhichArraySlot = targetEquipSlot;
							if (doubleClickEquip) {
								// droparray will now be undefined as there's no droptarget for findInventorySet() to read from:
								droparray = "currentlyEquipped";
								droppedInvSet = "iequip";
							}
							swapIcons(iconRef);
						}
					} else {
						if (canadditemtoinventory(currentlyEquipped[0][targetEquipSlot][0], currentlyEquipped[0][targetEquipSlot][1], currentlyEquipped[0][targetEquipSlot][2], currentlyEquipped[0][targetEquipSlot][3], currentlyEquipped[0][targetEquipSlot][4], currentlyEquipped[0][targetEquipSlot][5], currentlyEquipped[0][targetEquipSlot][6], currentlyEquipped[0][targetEquipSlot][7], currentlyEquipped[0][targetEquipSlot][8], currentlyEquipped[0][targetEquipSlot][9], currentlyEquipped[0][targetEquipSlot][10]) == 1) {
							if (quantitysplit) {
								// restore the split quantity (-1 that's now equipped) to its original slot:
								_root[fromarray][splitParentItem][1] += beingmovedquantity - 1;
								gamedisplay.inventorysets[iconRef.setRef]["inventoryIcon" + splitParentItem].quan.text = parseInt(_root[fromarray][splitParentItem][1]);
							} else {
								// restore excess
								iconRef._x = iconRef.xorigin;
								iconRef._y = iconRef.yorigin;
								_root[fromarray][fromWhichArraySlot][1] = parseInt(_root[fromarray][fromWhichArraySlot][1]) - 1;
								iconRef.quan.text = _root[fromarray][fromWhichArraySlot][1];
							}
							additemtoinventory(currentlyEquipped[0][targetEquipSlot][0],currentlyEquipped[0][targetEquipSlot][1],currentlyEquipped[0][targetEquipSlot][2],currentlyEquipped[0][targetEquipSlot][3],currentlyEquipped[0][targetEquipSlot][4],currentlyEquipped[0][targetEquipSlot][5],currentlyEquipped[0][targetEquipSlot][6],currentlyEquipped[0][targetEquipSlot][7],currentlyEquipped[0][targetEquipSlot][8],currentlyEquipped[0][targetEquipSlot][9],currentlyEquipped[0][targetEquipSlot][10]);
							showItemAddedAnimation(currentlyEquipped[0][targetEquipSlot][0]);
							currentlyEquipped[0][targetEquipSlot][0] = iconRef.invIcons._currentframe;
							currentlyEquipped[0][targetEquipSlot][1] = 1;
							currentlyEquipped[0][targetEquipSlot][2] = iconRef.qual._currentframe;
							currentlyEquipped[0][targetEquipSlot][3] = iconRef.dura;
							currentlyEquipped[0][targetEquipSlot][4] = iconRef.effec;
							currentlyEquipped[0][targetEquipSlot][5] = iconRef.wrapping;
							currentlyEquipped[0][targetEquipSlot][6] = iconRef.wear;
							currentlyEquipped[0][targetEquipSlot][7] = iconRef.col;
							currentlyEquipped[0][targetEquipSlot][8] = iconRef.enchant;
							currentlyEquipped[0][targetEquipSlot][9] = iconRef.hallmark;
							currentlyEquipped[0][targetEquipSlot][10] = iconRef.inscr;
							if (quantitysplit) {
								gamedisplay.inventorysets[iconRef.setRef]["inventoryIcon" + iconRef.refID].removeMovieClip();
								quantitysplit = false;
							}
							if (inventorySetIsOpen("iequip")) {
								// remove old icon:                         
								gamedisplay.inventorysets.iequip["inventoryIcon" + targetEquipSlot].removeMovieClip();
								// attach new icon:
								attachSingleInvIcon("iequip",targetEquipSlot);
							}
						} else {
							statusMessage("please remove currently equipped item first");
							// snap back:
							iconRef._x = iconRef.xorigin;
							iconRef._y = iconRef.yorigin;
						}
					}
				}
			} else {
				statusMessage("unwrap item before trying to equip it");
				iconRef._x = iconRef.xorigin;
				iconRef._y = iconRef.yorigin;
			}
		} else {
			// snap back:
			iconRef._x = iconRef.xorigin;
			iconRef._y = iconRef.yorigin;
		}
	} else {
		// snap back:
		iconRef._x = iconRef.xorigin;
		iconRef._y = iconRef.yorigin;
	}
}
//
function closeCraftingPanel() {
	if (canClearComponentsAdded(-1)) {
		// remove scroll event listener
		Mouse.removeListener(gamedisplay.inventorysets.icrafting.scrollListing.scrollMouseListener);
		// remove and hide panel:
		for (var i = 0; i < setsopen.length; i++) {
			if (setsopen[i][0] == "icrafting") {
				setsopen.splice(i,1);
				break;
			}
		}
		gamedisplay.inventorysets.icrafting._visible = false;
		// reposition sets to close any gaps
		placeinventorysets();
		handCursor.inventoryToolTip._visible = false;
		// check which panels are open to see if the hero can move or not:
		waitingforinventory = false;
		for (var i = 0; i < setsopen.length; i++) {
			// need ipet here otherwise hero and pet could be move apart with the panel open
			if ((setsopen[i][0] == "ipet") || (setsopen[i][0] == "ibank") || (setsopen[i][0] == "icrafting") || (setsopen[i][0] == "ichest") || (setsopen[i][0] == "ishop")) {
				waitingforinventory = true;
				break;
			}
		}
	} else {
		statusMessage("can't close this set as still have components attached to it");
	}
}
//
function inventorySetIsOpen(whichInvSet) {
	for (var i = 0; i < setsopen.length; i++) {
		if (setsopen[i][0] == whichInvSet) {
			return true;
			break;
		}
	}
	return false;
}
//
function updateCurrentlyEquippedItemsWear() {
	// if equip panel is open, update icon's wear:
	if (inventorySetIsOpen("iequip")) {
		gamedisplay.inventorysets.iequip["inventoryIcon0"].wear = currentlyEquipped[0][6];
		gamedisplay.inventorysets.iequip["inventoryIcon0"].iconDesc = inventoryitems[(parseInt(currentlyEquipped[0][0]))][1] + "\nEffectiveness: " + currentlyEquipped[0][4] + "\nUses: " + (currentlyEquipped[0][3] - currentlyEquipped[0][6]) + "/" + currentlyEquipped[0][3];
		if (currentToolTipSet == "iequip") {
			if (currentToolTipSlot == 0) {
				// current tooltip is over the currently equipped slot, so update:
				handCursor.inventoryToolTip.outputdescription.text = inventoryitems[(parseInt(currentlyEquipped[0][0]))][1] + "\nEffectiveness: " + currentlyEquipped[0][4] + "\nUses: " + (currentlyEquipped[0][3] - currentlyEquipped[0][6]) + "/" + currentlyEquipped[0][3];
			}
		}
	}
}
//
function addWaterToTile(tilex, tiley, recursionLevel) {
	// check not too much recursion:
	if (recursionLevel < 6) {
		// check tile exists:
		if (scrollclip["t_" + tilex + "_" + tiley]) {
			// check it's farmable (but not an underwater tile)
			if (farmTiles[tilex][tiley][0] == 1) {
				if (farmTiles[tilex][tiley][0] < 5) {
					farmTiles[tilex][tiley][1] = parseInt(farmTiles[tilex][tiley][1]) + 1;
					farmTiles[tilex][tiley][2] = minutesplayed;
					if (farmTiles[tilex][tiley][1] == 5) {
						// overflow - but can't be 5 by player intervention. 4 is max
						farmTiles[tilex][tiley][1] = 4;
						// pick random side to flow to:
						overflowSide = mfloor(mrand() * 4);
						switch (overflowSide) {
							case 0 :
								if (addWaterToTile(tilex, tiley - 1, (recursionLevel + 1))) {
								} else {
									// try other sides:
									if (addWaterToTile(tilex, tiley + 1, (recursionLevel + 1))) {
									} else if (addWaterToTile(tilex - 1, tiley, (recursionLevel + 1))) {
									} else {
										addWaterToTile(tilex + 1,tiley,(recursionLevel + 1));
									}
								}
								break;
							case 1 :
								if (addWaterToTile(tilex, tiley + 1, (recursionLevel + 1))) {
								} else {
									// try other sides:
									if (addWaterToTile(tilex, tiley - 1, (recursionLevel + 1))) {
									} else if (addWaterToTile(tilex - 1, tiley, (recursionLevel + 1))) {
									} else {
										addWaterToTile(tilex + 1,tiley,(recursionLevel + 1));
									}
								}
								break;
							case 2 :
								if (addWaterToTile(tilex - 1, tiley, (recursionLevel + 1))) {
								} else {
									// try other sides:
									if (addWaterToTile(tilex + 1, tiley, (recursionLevel + 1))) {
									} else if (addWaterToTile(tilex, tiley - 1, (recursionLevel + 1))) {
									} else {
										addWaterToTile(tilex,tiley + 1,(recursionLevel + 1));
									}
								}
								break;
							default :
								if (addWaterToTile(tilex + 1, tiley, (recursionLevel + 1))) {
								} else {
									// try other sides:
									if (addWaterToTile(tilex - 1, tiley, (recursionLevel + 1))) {
									} else if (addWaterToTile(tilex, tiley - 1, (recursionLevel + 1))) {
									} else {
										addWaterToTile(tilex,tiley + 1,(recursionLevel + 1));
									}
								}
						}
					}
					scrollclip["t_" + tilex + "_" + tiley].cultivated.gotoAndStop(farmTiles[tilex][tiley][1] + 1);
					return true;
				}
			}
		}
	}
	return false;
}
//
function getTileAtArmsReach() {
	// return the tile clip that is just in front of the hero:
	var thisArmsX = (scrollclip.hero.px) + storedxdir * (spacing / 2);
	var thisArmsY = (scrollclip.hero.py) + storedydir * (spacing / 2);
	armsReachX = findtilenumber(thisArmsX, thisArmsY, "x");
	armsReachY = findtilenumber(thisArmsX, thisArmsY, "y");
}
//
function checkFarm() {
	for (g in displayitems) {
		invArrayRef = parseInt(displayitems[g][2]);
		// find all player planted items:
		if (inventoryitems[invArrayRef][2].indexOf("k") != -1) {
			itemxtile = parseInt(displayitems[g][0]);
			itemytile = parseInt(displayitems[g][1]);
			// ensure the hero and the pet aren't on this tile (this will stop growth if they are):
			if (!((herox == itemxtile) && (heroy == itemytile))) {
				if (!((petxtile == itemxtile) && (petytile == itemytile))) {
					thisPlantsMinutesplayed = minutesplayed;
					determinePlantGrowth();
				}
			}
		}
	}
	// loop through all farm tiles and see if water levels need changing:
	for (var tilex = 0; tilex < maplengthx; tilex++) {
		for (var tiley = 0; tiley < maplengthy; tiley++) {
			if (farmTiles[tilex][tiley][0] == 1) {
				// every 8 minutes reduce water level:
				if ((minutesplayed - farmTiles[tilex][tiley][2]) % 8 == 0) {
					if (minutesplayed > farmTiles[tilex][tiley][2]) {
						farmTiles[tilex][tiley][1] = parseInt(farmTiles[tilex][tiley][1]) - 1;
						if (farmTiles[tilex][tiley][1] < 1) {
							farmTiles[tilex][tiley][1] = 0;
						}
						scrollclip["t_" + tilex + "_" + tiley].cultivated.gotoAndStop(farmTiles[tilex][tiley][1] + 1);
					}
				}
			}
		}
	}
}
//
function determinePlantGrowthStage(thisPlantsGrowthLevel) {
	return mfloor(thisPlantsGrowthLevel / 5);
}
//
function determinePlantGrowth() {
	// plant's display items: [x coord][y coord][inventory array reference][time planted][current growth level]
	var TilesWaterLevel = farmTiles[(displayitems[g][0])][(displayitems[g][1])][1];
	var mapsTemp = scrollclip.thisMapsTemp;
	var timePlanted = displayitems[g][5];
	var plantCurrentGrowthLevel = displayitems[g][6];
	// split these values from the item's description (as this item will never be in the player's inventory):
	var plantPreferences = inventoryitems[(displayitems[g][2])][1].split("|");
	var preferredWaterLevel = parseInt(plantPreferences[0]);
	var preferredTemp = parseInt(plantPreferences[1]);
	var plantsGrowthRate = parseInt(plantPreferences[2]);
	//
	var waterFactor = 1 - (Math.abs((TilesWaterLevel - preferredWaterLevel)) / 2);
	var tempFactor = 1 - (Math.abs((mapsTemp - preferredTemp)) / 4);
	var thisGrowth = (thisPlantsMinutesplayed - timePlanted) * waterFactor * tempFactor * (1 / plantsGrowthRate);
	var previousGrowthStage = determinePlantGrowthStage(plantCurrentGrowthLevel);
	plantCurrentGrowthLevel += thisGrowth;
	var newGrowthStage = determinePlantGrowthStage(plantCurrentGrowthLevel);
	if (newGrowthStage > previousGrowthStage) {
		if (newGrowthStage == 1) {
			// is a new seedling - create graphic object:
			var itemoffsetx = parseFloat(inventoryitems[invArrayRef][3]);
			var itemoffsety = parseFloat(inventoryitems[invArrayRef][4]);
			var itemgraphic = parseInt(inventoryitems[invArrayRef][5]);
			var counter = calculateobjectdepth((itemxtile + itemoffsetx + itemytile + itemoffsety) * spacing, (itemxtile + itemoffsetx - itemytile - itemoffsety) * spacing / 2);
			scrollclip.attachMovie("items","i_" + itemxtile + "_" + itemytile,counter);
			// init item non-iso position:
			var thisitem = scrollclip["i_" + itemxtile + "_" + itemytile];
			thisitem.px = ((itemxtile + itemoffsetx) * spacing);
			thisitem.py = ((itemytile + itemoffsety) * spacing);
			thisitem._x = thisitem.px + thisitem.py;
			thisitem._y = ((thisitem.px) - (thisitem.py)) / 2;
			thisitem.gotoAndStop(itemgraphic);
			// show seedling stage:
			thisitem.a.gotoAndPlay("stage1");
		} else if (newGrowthStage < 5) {
			// update existing graphic:
			thisitem.a.gotoAndPlay("stage" + newGrowthStage);
		} else if (newGrowthStage > 9) {
			thisitem.a.gotoAndPlay("withered");
		}
		displayitems[g][6] = plantCurrentGrowthLevel;
	}
}
//
function checkFarmNewMap() {
	// update farm tile's water levels and any plant growth since the hero was last on this map:
	for (var tilex = 0; tilex < maplengthx; tilex++) {
		for (var tiley = 0; tiley < maplengthy; tiley++) {
			if (farmTiles[tilex][tiley][0] == 1) {
				// check if there is a plant on this tile:
				if (scrollclip["i_" + tilex + "_" + tiley]) {
					for (var minutesElapsed = 0; minutesElapsed < (minutesplayed - parseInt(farmTiles[tilex][tiley][2])); minutesElapsed++) {
						thisPlantsMinutesplayed = minutesElapsed;
						determinePlantGrowth();
						// for every 8 minutes elapsed reduce water level:
						if ((minutesplayed - minutesElapsed) % 8 == 0) {
							farmTiles[tilex][tiley][1] = parseInt(farmTiles[tilex][tiley][1]) - 1;
						}
					}
				} else {
					// just update this tile's water level (lose 1 water for every 8 minutes):
					farmTiles[tilex][tiley][1] = parseInt(farmTiles[tilex][tiley][1]) - ((minutesplayed - parseInt(farmTiles[tilex][tiley][2])) / 8);
				}
				if (farmTiles[tilex][tiley][1] < 1) {
					farmTiles[tilex][tiley][1] = 0;
				}
				scrollclip["t_" + tilex + "_" + tiley].cultivated.gotoAndStop(farmTiles[tilex][tiley][1] + 1);
			}
		}
	}
}
function reEquipItemFromInv() {
	// equipped item has been used, so see if the same item can be found in inv:
	if (hasgotitem(currentlyEquipped[0][0], 1)) {
		if (_root[foundItemInSet][foundItemInSlot][1] > 1) {
			_root[foundItemInSet][foundItemInSlot][1] = parseInt(_root[foundItemInSet][foundItemInSlot][1]) - 1;
		} else {
			_root[foundItemInSet][foundItemInSlot][0] = 1;
		}
		// visually update this slot (if open)
		var amountOnThisSlot = parseInt(_root[foundItemInSet][foundItemInSlot][1]);
		if (foundItemInSet == "inventory") {
			if (inventorySetIsOpen("iinv")) {
				if (inventory[foundItemInSlot][0] != 1) {
					gamedisplay.inventorysets["iinv"]["inventoryIcon" + foundItemInSlot].quan.text = amountOnThisSlot;
				} else {
					gamedisplay.inventorysets["iinv"]["inventoryIcon" + foundItemInSlot].removeMovieClip();
				}
			}
		} else if (foundItemInSet == "petcarrying") {
			if (inventorySetIsOpen("ipet")) {
				if (inventory[foundItemInSlot][0] != 1) {
					gamedisplay.inventorysets["ipet"]["inventoryIcon" + foundItemInSlot].quan.text = amountOnThisSlot;
				} else {
					gamedisplay.inventorysets["ipet"]["inventoryIcon" + foundItemInSlot].removeMovieClip();
				}
			}
		}
	} else {
		// remove this item now:
		currentlyEquipped[0][0] = 1;
		if (inventorySetIsOpen("iequip")) {
			gamedisplay.inventorysets.iequip["inventoryIcon0"].removeMovieClip();
		}
	}
}
function initNewTreasureMap(thisTreasureMapToUse, treasureMapXTile, treasureMapYTile) {
	treasureMapToUse = thisTreasureMapToUse;
	var isRandomDungeon = false;
	// check to see if it's a random dungeon map:
	if (treasureMapToUse.indexOf("R") != -1) {
		isRandomDungeon = true;
		var randomTreasureMapDetails = treasureMapToUse.split("R");
		var randomDungeonName = randomDungeons[(randomTreasureMapDetails[0])][0];
		var cleanDungeonURL = randomDungeonName.split(" ").join("-").toLowerCase();
		// var dungeonMapRequired = randomTreasureMapDetails[1];
	}
	// add this new map to currentTreasureMaps                                                                                                                   
	currentTreasureMaps.push([treasureMapToUse, treasureMapXTile, treasureMapYTile]);
	var hiddenMapLoader:MovieClipLoader = new MovieClipLoader();
	hiddenMapLoader.loadClip("data/shared.swf",hiddenMapScrollclip);
	var hiddenMapLoaderListener:Object = new Object();
	hiddenMapLoader.addListener(hiddenMapLoaderListener);
	hiddenMapLoaderListener.onLoadInit = function(target) {
		var hiddenScrollClipLoader:MovieClipLoader = new MovieClipLoader();
		if (isRandomDungeon) {
			hiddenScrollClipLoader.loadClip("data/maps/" + cleanDungeonURL + ".swf",hiddenMapScrollclip);
		} else {
			hiddenScrollClipLoader.loadClip("data/maps/map" + treasureMapToUse + ".swf",hiddenMapScrollclip);
		}
		var hiddenScrollLoaderListener:Object = new Object();
		hiddenScrollClipLoader.addListener(hiddenScrollLoaderListener);
		hiddenScrollLoaderListener.onLoadInit = function(target) {
			loadTreasureXmlMap(treasureMapToUse,treasureMapXTile,treasureMapYTile);
		};
		hiddenScrollLoaderListener.onLoadError = function(target:MovieClip, errorCode:String, httpStatus:Number) {
			errorloading("failed on hiddenScrollClipLoader swf");
			trace(">> errorCode: " + errorCode);
			trace(">> httpStatus: " + httpStatus);
		};
	};
	hiddenMapLoaderListener.onLoadError = function(target:MovieClip, errorCode:String, httpStatus:Number) {
		errorloading("failed on hiddenMapLoaderListener swf");
		trace(">> errorCode: " + errorCode);
		trace(">> httpStatus: " + httpStatus);
	};
}
//
function createRandomTreasureMap(targetMapProperties) {
	// create timeout in case the process takes too long. if does time, pick 1 of half a dozen pre-created treasure maps ##########
	// allMapsOwned = [];

	if (targetMapProperties == "0") {
		// randomly choose a map from those available:
		randomMap = mfloor(mrand() * treasureMapsAvailable.length);
		treasureMapToUse = treasureMapsAvailable[randomMap][0];
		treasureDestX = -1;
		treasureDestY = -1;
	} else {
		targetMap = targetMapProperties.split("|");
		treasureMapToUse = targetMap[0];
		treasureDestX = targetMap[1];
		treasureDestY = targetMap[2];
	}
	var hiddenMapLoader:MovieClipLoader = new MovieClipLoader();
	hiddenMapLoader.loadClip("data/shared.swf",hiddenMapScrollclip);
	var hiddenMapLoaderListener:Object = new Object();
	hiddenMapLoader.addListener(hiddenMapLoaderListener);
	hiddenMapLoaderListener.onLoadInit = function(target) {
		var hiddenScrollClipLoader:MovieClipLoader = new MovieClipLoader();
		hiddenScrollClipLoader.loadClip("data/maps/map" + treasureMapToUse + ".swf",hiddenMapScrollclip);
		var hiddenScrollLoaderListener:Object = new Object();
		hiddenScrollClipLoader.addListener(hiddenScrollLoaderListener);
		hiddenScrollLoaderListener.onLoadInit = function(target) {
			loadTreasureXmlMap(treasureMapToUse,treasureDestX,treasureDestY);
		};
		hiddenScrollLoaderListener.onLoadError = function(target:MovieClip, errorCode:String, httpStatus:Number) {
			errorloading("failed on hiddenScrollClipLoader - createRandomTreasureMap");
			trace(">> errorCode: " + errorCode);
			trace(">> httpStatus: " + httpStatus);
		};
	};
	hiddenMapLoaderListener.onLoadError = function(target:MovieClip, errorCode:String, httpStatus:Number) {
		errorloading("failed on hiddenMapLoaderListener - createRandomTreasureMap");
		trace(">> errorCode: " + errorCode);
		trace(">> httpStatus: " + httpStatus);
	};
}
//
function processTreasureMap(targetTileX, targetTileY) {
	// (called once the XML for this map has been loaded succesfully.)
	targetTileX = parseInt(targetTileX);
	targetTileY = parseInt(targetTileY);

	if (targetTileX == -1) {
		// is a new randomly created map, so choose random tile - ensure it's walkable, and doesn't already exist in the current map locations:
		do {
			var targetTileX = mfloor(mrand() * treasureMaplengthx);
			var targetTileY = mfloor(mrand() * treasureMaplengthy);
			var thisMapAlreadyExists = false;
			for (var i = 0; i < currentTreasureMaps.length; i++) {
				if (currentTreasureMaps[i][0] == treasureMapToUse) {
					if (currentTreasureMaps[i][1] == targetTileX) {
						if (currentTreasureMaps[i][2] == targetTileY) {
							thisMapAlreadyExists = true;
						}
					}
				}
			}
		} while ((islocationproperty(2, targetTileX, targetTileY)) && (!thisMapAlreadyExists));
	}
	// draw map off stage:                                                                                                                    
	var i:Number = targetTileX - visx - 2;
	var j:Number;
	var counter:Number;
	// -2 as needs to be 1 below the range of the loop
	while (++i <= (targetTileX + visx + 1)) {
		j = targetTileY - visy - 2;
		while (++j <= (targetTileY + visy + 1)) {
			frame = parseInt(treasuremap[i][j]);
			// if tile is defined in array, create tile
			if (frame) {
				if (frame < structureframe) {
					counter = calculateHiddenMapDepth(i, j);
				} else {
					counter = calculateHiddenMapObjectDepth(((spacing * (i + j)) + 1), (spacing / 2 * (i - j)));
				}
				hiddenMapScrollclip.attachMovie("tile","t_" + i + "_" + j,counter);
				hiddenMapScrollclip["t_" + i + "_" + j]._x = spacing * (i + j);
				hiddenMapScrollclip["t_" + i + "_" + j]._y = (spacing / 2 * (i - j));
				hiddenMapScrollclip["t_" + i + "_" + j].gotoAndStop(frame);
			}
		}
	}
	createTreasureMap(treasureMapToUse,targetTileX,targetTileY);
}
//
function createTreasureMap(whichMap, targetTileX, targetTileY) {

	var transformMatrix = new Matrix();
	transformMatrix.scale(0.5,0.5);
	// determine translation to center on target tile:
	var transformX = 38 - 12 * (targetTileX + targetTileY);
	var transformY = 6 * (targetTileY - targetTileX) + 51;
	transformMatrix.translate(transformX,transformY);
	var clippingMask = new Rectangle(0, 0, 100, 100);
	copiedBitmap = new BitmapData(100, 100, false, 0x00FFFFFF);
	copiedBitmap.draw(hiddenMapScrollclip,transformMatrix,new ColorTransform(),"normal",clippingMask,true);
	// start building image data to send to PHP script (copy in 5m/s chunks to not overload the computer):
	postedImageCurrentRow = 0;
	postedImageData = new LoadVars();
	postedImageDataReturn = new LoadVars();
	postedImageDataReturn.onLoad = function(success) {
		if (success) {
			trace("xml success");
			trace(this);
			if (this.processResult == 1) {
				// check for further maps to create:
				//if (allMapsOwned.length > 0) {
				//var newMap = allMapsOwned.shift();
				//initNewTreasureMap(newMap[0],newMap[1],newMap[2]);
				//} else {
				checkMapPopups();
				//}
			}
		} else {
			trace("create image failed");
		}
	};
	postedImageData.iwidth = 100;
	postedImageData.iheight = 100;
	postedImageData.playerId = charnumber;
	postedImageData.filename = "map" + whichMap + "-" + targetTileX + "-" + targetTileY;
	postedImageData.pixelData = "";
	postImageDataInterval = setInterval(postImageData, 5, copiedBitmap);
}
//
function postImageData(imageBeingSent) {
	for (var ix = 0; ix <= imageBeingSent.width; ix++) {
		var pixelColor = imageBeingSent.getPixel(ix, postedImageCurrentRow);
		var pixelString = pixelColor.toString(16);
		// don't send white pixels as the PHP will re-build the image on a white background: (minimises data length)
		if (pixelString == "ffffff") {
			pixelString = "";
		}
		postedImageData.pixelData += pixelString + ",";
	}
	postedImageData.pixelData += pixelString + "|";
	postedImageCurrentRow++;
	if (postedImageCurrentRow > imageBeingSent.height) {
		// stop the process and remove the generated bitmap from memory
		clearInterval(postImageDataInterval);
		copiedBitmap.dispose();
		//remove all tiles from hiddenMapScrollclip:
		for (var checkClip in hiddenMapScrollclip) {
			hiddenMapScrollclip[checkClip].removeMovieClip();
		}
		postedImageData.sendAndLoad("http://www.autumnearth.com/createMapImage.php",postedImageDataReturn);
	}
}
//
function openMap(mapDetails) {

	var thisMapDetails = mapDetails.split("|");
	var thisMap = gamedisplay.treasureMapHolder["map" + thisMapDetails[0] + "_" + thisMapDetails[1] + "_" + thisMapDetails[2]];

	thisMap._visible = true;
}
//
function findMapDetails(mapDetails) {
	var treasureMapDetails = mapDetails.split("|");
	for (var i = 0; i < treasureMapsAvailable.length; i++) {
		if (treasureMapsAvailable[i][0] == treasureMapDetails[0]) {
			return i;
			break;
		}
	}
}
//
function checkMapPopups() {
	trace("runnnnnnnnng this");
	// determine if the graphics themselves need loading into memory - whether it's all or just the new one
	for (var i = 0; i < currentTreasureMaps.length; i++) {
		// check if this map clip exists already:
		if (!(gamedisplay.treasureMapHolder["map" + currentTreasureMaps[i][0] + "_" + currentTreasureMaps[i][1] + "_" + currentTreasureMaps[i][2]])) {
			// create this clip:
			gamedisplay.treasureMapHolder.attachMovie("treasureMap","map" + currentTreasureMaps[i][0] + "_" + currentTreasureMaps[i][1] + "_" + currentTreasureMaps[i][2],gamedisplay.treasureMapHolder.getNextHighestDepth());
			var thisMap = gamedisplay.treasureMapHolder["map" + currentTreasureMaps[i][0] + "_" + currentTreasureMaps[i][1] + "_" + currentTreasureMaps[i][2]];
			thisMap._visible = false;
			// don't loadmovie here - pass file path to new clip and let it handle preloading, then fade map in once loaded:
			thisMap.treasureMapPath = "http://www.autumnearth.com/data/chr" + charnumber + "/map" + currentTreasureMaps[i][0] + "-" + currentTreasureMaps[i][1] + "-" + currentTreasureMaps[i][2] + ".jpg";
			for (var j = 0; j < treasureMapsAvailable.length; j++) {
				if (treasureMapsAvailable[j][0] == currentTreasureMaps[i][0]) {
					thisMap.mapClue.clueText.text = treasureMapsAvailable[j][1];
					break;
				}
			}
			thisMap._x = 130 * i;
			thisMap.gotoAndPlay("loadMap");
		}
	}
	// this is called after all maps have been created
	checkUserContentInterval = setInterval(checkUserContentLoaded, 100);
}
//
function showMoneyReceived(amountOfMoneyAdded) {
	amountOfMoneyAdded = parseInt(amountOfMoneyAdded);
	var moneystring:String = "";
	var silver:Number = amountOfMoneyAdded % 100;
	var gold:Number = (amountOfMoneyAdded - silver) / 100;
	if (gold > 0) {
		moneystring = gold + " gold - ";
	}
	moneystring += silver + " silver";
	statusMessage("received " + moneystring);
}
//
function checkUserContentLoaded() {
	if (userContentToDownload.length == 0) {
		// and check that the icons for inventory are preloaded as well:
		if (userContentToLoad.length == 0) {
			// and check any user content in a standard map is loaded:
			if (standardMapsToLoad.length == 0) {
				clearInterval(checkUserContentInterval);
				// set transition out:
				gamedisplay.transitionclip._visible = false;
				transition = 2;
				// start main loop:
				oktoloop = true;
			}
		}
	}
}
//
function duplicateDynamicContent(originalClip, destinationClip) {
	var copiedBitmap = new BitmapData(originalClip._width, originalClip._height);
	copiedBitmap.draw(originalClip);
	// 1 is the new depth:
	destinationClip.attachBitmap(copiedBitmap,1);
}
//
function openLotteryTicket() {
	// reset details:
	gamedisplay.lotteryPanel.lotterySubmit.gotoAndStop(1);
	gamedisplay.lotteryPanel._visible = false;
	playerLotteryNumbers = [];
	for (var i = 0; i < 10; i++) {
		gamedisplay.lotteryPanel["lotteryButton" + i].buttonNumber = i;
		gamedisplay.lotteryPanel["lotteryButton" + i].hasBeenClicked = false;
		gamedisplay.lotteryPanel["lotteryButton" + i].gotoAndStop(1);
		gamedisplay.lotteryPanel["lotteryButton" + i].buttonBorder.gotoAndStop(1);
	}
	gamedisplay.dialoguebox._visible = false;
	gamedisplay.lotteryPanel._visible = true;
}
//
function checkLotteryNumbersAdded() {
	if (_root.playerLotteryNumbers.length == 7) {
		// enable button
		gamedisplay.lotteryPanel.lotterySubmit.gotoAndStop(2);
	} else {
		// disable button
		gamedisplay.lotteryPanel.lotterySubmit.gotoAndStop(1);
	}
}
//
function setUpLotteryPanel() {
	gamedisplay.lotteryPanel.lotterySubmit.gotoAndStop(1);
	gamedisplay.lotteryPanel._visible = false;
	playerLotteryNumbers = [];
	for (var i = 0; i < 10; i++) {
		gamedisplay.lotteryPanel["lotteryButton" + i].buttonNumber = i;
		gamedisplay.lotteryPanel.hasBeenClicked = false;
		gamedisplay.lotteryPanel["lotteryButton" + i].gotoAndStop(1);
		gamedisplay.lotteryPanel["lotteryButton" + i].buttonBorder.gotoAndStop(1);
		gamedisplay.lotteryPanel["lotteryButton" + i].onRollOver = function() {
			this.buttonBorder.gotoAndStop(2);
		};
		gamedisplay.lotteryPanel["lotteryButton" + i].onRollOut = this["lotteryButton" + i].onDragOut = function () {
			this.buttonBorder.gotoAndStop(1);
		};
		gamedisplay.lotteryPanel["lotteryButton" + i].onRelease = function() {
			if (this.hasBeenClicked) {
				this.gotoAndStop(1);
				this.hasBeenClicked = false;
				// remove this number:
				for (var i = 0; i < _root.playerLotteryNumbers.length; i++) {
					if (_root.playerLotteryNumbers[i] == this.buttonNumber) {
						_root.playerLotteryNumbers.splice(i,1);
						break;
					}
				}
				_root.checkLotteryNumbersAdded();
			} else {
				this.gotoAndStop(2);
				this.hasBeenClicked = true;
				// add this number:
				_root.playerLotteryNumbers.push(this.buttonNumber);
				_root.checkLotteryNumbersAdded();
			}
		};
	}
}
//
function getPrizeFundAmount() {
	var checkLottery = new LoadVars();
	lotteryResponse = new LoadVars();
	lotteryResponse.onLoad = function(success) {
		if (success) {
			currentLotteryAmount = this.prize;
		}
	};
	checkLottery.sendAndLoad("http://www.autumnearth.com/getLotteryFund.php",lotteryResponse);
}
//
function submitLotteryNumbers() {
	// disable submit button:
	gamedisplay.lotteryPanel.lotterySubmit.gotoAndStop(1);
	money -= 5;
	updatemoney();
	var checkLottery = new LoadVars();
	checkLottery.lotteryNumbers = playerLotteryNumbers.join("-");
	lotteryCheckWin = new LoadVars();
	lotteryCheckWin.onLoad = function(success) {
		if (success) {
			gamedisplay.lotteryPanel._visible = false;
			numbersMatched = parseInt(this.matched);
			amountWon = parseInt(this.won);
			var lotteryGold = parseMoney(amountWon);
			switch (numbersMatched) {
				case 7 :
					// big win
					displaytext(thisLotterySpeech[4] + " " + lotteryGold,whosaiditindex,true);
					// show animation - fireworks etc. #############
					break;
				case 6 :
					// small win - just larger amount
				case 5 :
					// small win
					displaytext(thisLotterySpeech[3] + " " + lotteryGold,whosaiditindex,true);
					break;
				default :
					// no win
					displaytext(thisLotterySpeech[5],whosaiditindex,true);
			}
			money += amountWon;
			updatemoney();
		}
	};
	checkLottery.sendAndLoad("http://www.autumnearth.com/checkLottery.php",lotteryCheckWin);
}
//
function getRepairCost(repairedItemType, repairedQuantity, repairedItemWear, repairedItemDurability) {
	// repairing a completely worn out item costs 2/3 of its original price:
	return (inventoryitems[repairedItemType][8]) * repairedItemWear / repairedItemDurability * (2 / 3) * repairedQuantity;
}
function displayTooltipPrice(priceToDisplay) {
	var silverAmount:Number = priceToDisplay % 100;
	var goldAmount:Number = (priceToDisplay - silverAmount) / 100;
	if (goldAmount == 0) {
		handCursor.inventoryToolTip.saleprice.price.gold._visible = false;
	} else {
		handCursor.inventoryToolTip.saleprice.price.gold._visible = true;
	}
	if (silverAmount == 0) {
		handCursor.inventoryToolTip.saleprice.price.silver._visible = false;
		handCursor.inventoryToolTip.saleprice.price.gold._x = 30;
	} else if (silverAmount < 10) {
		handCursor.inventoryToolTip.saleprice.price.gold._x = 9;
		handCursor.inventoryToolTip.saleprice.price.silver._visible = true;
	} else {
		handCursor.inventoryToolTip.saleprice.price.silver._visible = true;
		handCursor.inventoryToolTip.saleprice.price.gold._x = 3;
	}
	handCursor.inventoryToolTip.saleprice.price.gold.goldAmount.text = goldAmount;
	handCursor.inventoryToolTip.saleprice.price.silver.silverAmount.text = silverAmount;
	handCursor.inventoryToolTip.saleprice._visible = true;
}
//
function repairAllItems() {
	money -= costToRepairAllItems;
	gradeItemsForSale();
	updatemoney();
	if (inventoryitems[(currentlyEquipped[0][0])][2].indexOf("R") != -1) {
		currentlyEquipped[0][6] = 0;
		if (inventorySetIsOpen("iequip")) {
			gamedisplay.inventorysets.iequip["inventoryIcon0"].wear = 0;
			gamedisplay.inventorysets.iequip["inventoryIcon0"].iconDesc = inventoryitems[(parseInt(currentlyEquipped[0][0]))][1] + "\nEffectiveness: " + currentlyEquipped[0][4] + "\nUses: " + (currentlyEquipped[0][3] - currentlyEquipped[0][6]) + "/" + currentlyEquipped[0][3];
		}
	}
	for (var i = 0; i < inventory.length; i++) {
		if (inventoryitems[(inventory[i][0])][2].indexOf("R") != -1) {
			inventory[i][6] = 0;
			if (inventorySetIsOpen("iinv")) {
				gamedisplay.inventorysets.iinv["inventoryIcon" + i].wear = 0;
				gamedisplay.inventorysets.iinv["inventoryIcon" + i].iconDesc = inventoryitems[(parseInt(inventory[i][0]))][1] + "\nEffectiveness: " + inventory[i][4] + "\nUses: " + (inventory[i][3] - inventory[i][6]) + "/" + inventory[i][3];
			}
		}
	}
	for (var i = 0; i < petcarrying.length; i++) {
		if (inventoryitems[(petcarrying[i][0])][2].indexOf("R") != -1) {
			petcarrying[i][6] = 0;
			if (inventorySetIsOpen("ipet")) {
				gamedisplay.inventorysets.ipet["inventoryIcon" + i].wear = 0;
				gamedisplay.inventorysets.ipet["inventoryIcon" + i].iconDesc = inventoryitems[(parseInt(petcarrying[i][0]))][1] + "\nEffectiveness: " + petcarrying[i][4] + "\nUses: " + (petcarrying[i][3] - petcarrying[i][6]) + "/" + petcarrying[i][3];
			}
		}
	}
}
//
function addPlayingCardsToAlbum(cardTypeToAdd, numberOfCardsToAdd) {
	setsuccessful = "icard";
	slotsuccessful = cardTypeToAdd;
	// single playing cards are all item #39:
	showItemAddedAnimation(39);
	playingCardsOwned[cardTypeToAdd] = playingCardsOwned[cardTypeToAdd] + parseInt(numberOfCardsToAdd);
}
function openBoosterPack(invIconsXCoord, invIconsYCoord, invIconsParentSet) {
	// ###########
	//
	// redo this. Each booster pack will have detail which common cards it can have, which rares it can have and which loot cards it can have
	// each pack will have 1 rare - except for 1 in 10 packs which will have a loot card instead
	//
	//[colour] for boosters will detail the commons, rares and loot cards available. common|rare|loot
	//then can have a range, dot separated or both eg. 1-5.9.12 would mean 1,2,3,4,5,9,12 where available
	//(it's hardcoded that there's a 1 in 10 chance that a rare will be replaced with a loot card if any are available in this pack)
	//
	/*
	// randomly determine booster pack's contents:
	boosterPackContents = [];
	var tempCommonPlayingCards = commonPlayingCards.slice();
	// pick 5 commons...
	for (var i = 0; i<5; i++) {
	var thisCommonId = mfloor(mrand()*((tempCommonPlayingCards.length)));
	boosterPackContents.push(tempCommonPlayingCards[thisCommonId]);
	// remove this card from temp array so it can be picked twice:
	tempCommonPlayingCards.splice(thisCommonId, 1);
	}
	// ... and 1 rare:
	boosterPackContents.push(rarePlayingCards[mfloor(mrand()*((rarePlayingCards.length)))]);
	for (var i = 0; i<6; i++) {
	gamedisplay.boosterAnime["boosterCard"+i].cardArt.gotoAndStop(boosterPackContents[i]);
	}
	boosterAnimeStartX = invIconsXCoord+gamedisplay.inventorysets[invIconsParentSet]._x;
	boosterAnimeStartY = invIconsYCoord;
	gamedisplay.boosterAnime._visible = true;
	gamedisplay.boosterAnime.gotoAndPlay("animeStart");
	*/
}
function closeBoosterCards() {
	gamedisplay.boosterAnime._visible = false;
	for (var i = 0; i < 6; i++) {
		addPlayingCardsToAlbum(boosterPackContents[i],1);
	}
}
//
function drawStandardMap(thisStandardMapsDetails) {
	var thisMapsUniqueId = thisStandardMapsDetails[2] + "_" + thisStandardMapsDetails[3] + "_" + thisStandardMapsDetails[7] + "_" + thisStandardMapsDetails[10] + "_" + thisStandardMapsDetails[6];
	gamedisplay.standardMapHolder.attachMovie("standardMap",thisMapsUniqueId,gamedisplay.standardMapHolder.getNextHighestDepth());
	// check if this map needs to load any user content:
	if (isNaN(thisStandardMapsDetails[7])) {
		standardMapsToLoad.push(thisStandardMapsDetails[7]);
		gamedisplay.standardMapHolder[thisMapsUniqueId].parchmentGraphic.filePath = thisStandardMapsDetails[7];
		gamedisplay.standardMapHolder[thisMapsUniqueId].parchmentGraphic.gotoAndPlay("loadUserContent");
		gamedisplay.standardMapHolder[thisMapsUniqueId].standardMapOverlay.gotoAndStop("noOverlay");
	} else {
		// is a predefined graphic:
		gamedisplay.standardMapHolder[thisMapsUniqueId].parchmentGraphic.gotoAndStop(parseInt(thisStandardMapsDetails[7]));
		gamedisplay.standardMapHolder[thisMapsUniqueId].standardMapOverlay.gotoAndStop(parseInt(thisStandardMapsDetails[7]));
	}
	// show which region this map is of:
	gamedisplay.standardMapHolder[thisMapsUniqueId].allMaps.gotoAndStop(thisStandardMapsDetails[3]);
	// show map at appropriate quality:
	if (thisStandardMapsDetails[2] == 4) {
		gamedisplay.standardMapHolder[thisMapsUniqueId].allMaps.whichQuality.gotoAndStop(3);
	} else if (thisStandardMapsDetails[2] == 3) {
		gamedisplay.standardMapHolder[thisMapsUniqueId].allMaps.whichQuality.gotoAndStop(2);
	} else {
		gamedisplay.standardMapHolder[thisMapsUniqueId].allMaps.whichQuality.gotoAndStop(1);
	}
	// draw markers:
	var thisMapsMarkers = thisStandardMapsDetails[10].split("[*^*]");
	for (var i = 0; i < thisMapsMarkers.length; i++) {
		var thisMarkersAttributes = thisMapsMarkers[i].split("[**]");
		if (thisMarkersAttributes[0] == 0) {
			// is a dotted line marker:
			gamedisplay.standardMapHolder[thisMapsUniqueId].allMaps.markerHolder.attachMovie("stndMapDottedLine","marker" + i,i);
			gamedisplay.standardMapHolder[thisMapsUniqueId].allMaps.markerHolder["marker" + i]._x = thisMarkersAttributes[1];
			gamedisplay.standardMapHolder[thisMapsUniqueId].allMaps.markerHolder["marker" + i]._y = thisMarkersAttributes[2];
			gamedisplay.standardMapHolder[thisMapsUniqueId].allMaps.markerHolder["marker" + i].dottedLineMask._height = thisMarkersAttributes[3];
			gamedisplay.standardMapHolder[thisMapsUniqueId].allMaps.markerHolder["marker" + i]._rotation = thisMarkersAttributes[4];
		} else {
			gamedisplay.standardMapHolder[thisMapsUniqueId].allMaps.markerHolder.attachMovie("standardMapMarker","marker" + i,i);
			gamedisplay.standardMapHolder[thisMapsUniqueId].allMaps.markerHolder["marker" + i].gotoAndStop(thisMarkersAttributes[0]);
			gamedisplay.standardMapHolder[thisMapsUniqueId].allMaps.markerHolder["marker" + i]._x = thisMarkersAttributes[1];
			gamedisplay.standardMapHolder[thisMapsUniqueId].allMaps.markerHolder["marker" + i]._y = thisMarkersAttributes[2];
			gamedisplay.standardMapHolder[thisMapsUniqueId].allMaps.markerHolder["marker" + i].markerLabel.text = thisMarkersAttributes[3];
		}
	}
	// set ink colour:
	var thisMapsInkColour = new Color(gamedisplay.standardMapHolder[thisMapsUniqueId].allMaps);
	thisMapsInkColour.setRGB(colours[thisStandardMapsDetails[6]][1]);
	gamedisplay.standardMapHolder[thisMapsUniqueId]._visible = false;
}
//
function learnNewRecipe(recipeIndex) {
	recipesKnown.push(parseInt(recipeIndex));
	recipesKnown.sort();
	trace("learnt new recipe #" + recipeIndex);
	// need notifaction of newly learnt recipe ###########
}
//
function playSong(thisInstrumentsId, thisSongsId, thisSongsTitle, thisInstrument) {
	// check song isn't already playing:
	if (_root.currentSongPlayed != thisInstrument + "-" + thisSongsId) {

		// ############## do i need to stop a song if it is already playing, or will the new one overwrite it?

		_root.currentSongPlayed = thisInstrument + "-" + thisSongsId;
		gamedisplay.musicalInstrument._visible = true;
		gamedisplay.musicalInstrument.songTitle.text = thisSongsTitle;
		gamedisplay.musicalInstrument.invIcon.gotoAndStop(thisInstrument);
		playNewSong = new Sound(gamedisplay.musicalInstrument.songPlayer);
		playNewSong.loadSound("http://www.autumnearth.com/music/playSong.php?instrId=" + thisInstrumentsId + "&songId=" + thisSongsId,true);
		// loop song:
		playNewSong.onSoundComplete = function() {
			playNewSong.start(0);
		};
	}
}
function stopSong() {
	gamedisplay.musicalInstrument._visible = false;
	playNewSong.stop();
	_root.currentSongPlayed = "";
}
//
function getCoordsFromIsoCoords(xiso, yiso, whichRequired) {
	var xCoord = (xiso - (2 * yiso)) / (2 * spacing) + ((2 * yiso) / spacing);
	var yCoord = (xiso - (2 * yiso)) / (2 * spacing);
	if (whichRequired == "x") {
		return Math.floor(xCoord);
	} else {
		return Math.floor(yCoord);
	}
}
//
function startTargetting(targetType, radiusOfEffect) {
	isTargetting = true;
	scrollclip.tileOverlay.targetCursor.gotoAndStop(targetType);
	targetingType = targetType;
	updateTargetting();
	scrollclip.tileOverlay.targetCursor._visible = true;
	scrollclip.tileOverlay.drawMagicClip._visible = true;
	scrollclip.tileOverlay.drawMagicClip._x = scrollclip.hero._x;
	scrollclip.tileOverlay.drawMagicClip._y = scrollclip.hero._y;
	_root.handCursor.gotoAndStop(2);
}
function cancelTargetting() {
	scrollclip.tileOverlay.targetCursor._visible = false;
	scrollclip.tileOverlay.drawMagicClip._visible = false;
	isTargetting = false;
	gamedisplay.targettingInvCursor._visible = false;
	isTargettingInventory = false;
	_root.handCursor.gotoAndStop(1);
}
function targetClicked() {
	if (isTargetting) {
		var targetTilePosX = getCoordsFromIsoCoords(targetPosX, targetPosY, "x");
		var targetTilePosY = getCoordsFromIsoCoords(targetPosX, targetPosY, "y");
		var targetValidTarget = isValidTarget(targetTilePosX, targetTilePosY);
		trace("tile " + targetTilePosX + "," + targetTilePosY + " was targetted and valid=" + targetValidTarget + ".");


		// eg spell Push + Earth might do this:

		// check caster has LOS to the target ( hasLOS(startx, starty, endx, endy)  )#######

		// coords seem to need to be swapped!? ########
		destroyTerrain(targetTilePosY,targetTilePosX,2,1,"earth");

		cancelTargetting();
	}
}
function isValidTarget() {
	switch (targetingType) {
		case 1 :
			// looking for an empty, walkable tile
			isAValidTarget = true;
			if (!(islocationproperty(2, targetTilePosX, targetTilePosY))) {
				// could be outside of map as well - but still invalid
				isAValidTarget = false;
			}
			// check an item isn't blocking:                                                                                                                                                                                           
			if (scrollclip["i_" + targetTilePosX + "_" + targetTilePosY]) {
				isAValidTarget = false;
			}
			// check npcs aren't blocking:                                                                                                                                                                                           
			for (g in currentnpcs) {
				var thisnpcxtile = parseInt(currentnpcs[g][3]);
				var thisnpcytile = parseInt(currentnpcs[g][4]);
				if ((thisnpcxtile == targetTilePosX) && (thisnpcytile == targetTilePosY)) {
					isAValidTarget = false;
					break;
				}
			}
			// check hero isn't blocking:
			if ((herox == targetTilePosX) && (heroy == targetTilePosY)) {
				isAValidTarget = false;
			}
			// check pet isn't blocking:                                                                                                                                                                                           
			if ((scrollclip.pet.xtile == targetTilePosX) && (scrollclip.pet.ytile == targetTilePosY)) {
				isAValidTarget = false;
			}
			break;
		case 2 :
			// looking for any item - in the world or in inventory:
			isAValidTarget = false;
			if (scrollclip["i_" + targetTilePosX + "_" + targetTilePosY]) {
				isAValidTarget = true;
			}
			break;
	}
	return isAValidTarget;
}
function updateTargetting() {
	if (isTargetting) {
		if (!isTargettingInventory) {
			targetPosX = scrollclip._xmouse;
			targetPosY = scrollclip._ymouse;
			scrollclip.tileOverlay.targetCursor._x = targetPosX;
			scrollclip.tileOverlay.targetCursor._y = targetPosY;
			// determine map tile this is over:
			targetTilePosX = getCoordsFromIsoCoords(targetPosX, targetPosY, "x");
			targetTilePosY = getCoordsFromIsoCoords(targetPosX, targetPosY, "y");
			var isAValidTargetTile = isValidTarget();
			if (isAValidTargetTile) {
				scrollclip.tileOverlay.targetCursor.validTarget.gotoAndStop(1);
			} else {
				scrollclip.tileOverlay.targetCursor.validTarget.gotoAndStop(2);
			}
		}
	}
}
function targetInventory(invSlotRefX, invSlotRefY, invSlotSetRef) {
	// is targetting an item and cursor is over the inventory:
	scrollclip.tileOverlay.targetCursor._visible = false;
	gamedisplay.targettingInvCursor._visible = true;
	isTargettingInventory = true;
	// ( the 35 and 100 are the offsets in inventorysetup() )
	gamedisplay.targettingInvCursor._x = invSlotRefX + gamedisplay.inventorysets[invSlotSetRef]._x - (invtilewidth / 2) - 35;
	gamedisplay.targettingInvCursor._y = invSlotRefY + gamedisplay.inventorysets[invSlotSetRef]._y - (invtileheight / 2) - 100;
}
function targetWorld() {
	// has rolled back out from inventory to world:
	scrollclip.tileOverlay.targetCursor._visible = true;
	gamedisplay.targettingInvCursor._visible = false;
	isTargettingInventory = false;
}
function openCardAlbum() {
	trace("show cards:");
	trace(playingCardsOwned.join(","));
}
function statusMessage(messageToShow) {
	gamedisplay.statusMessages.activeLog.logText.htmlText += "<p>" + messageToShow + "</p>";
}
function checkForTitleGain(whichQuestNumber) {
	// after a quest is closed, determine if this confers a title or not
	if (quests[whichQuestNumber][5] >= 0) {
		// add title:
		thisPlayersTitles.push(quests[whichQuestNumber][5]);
		statusMessage("Gained the title '" + allTitlesAvailable[(quests[whichQuestNumber][5])] + "'");
	}
}
//
function checkForDoorsToDungeons() {
	// called when a new map has been loaded, this checks to see if any doors to random dungeons exist
	// if they do, then the XML for the next map is prepared ahead of time
	for (i in thisMapsDoors) {
		var checkDoorNumeric = parseInt(thisMapsDoors[i][0]);
		if (checkDoorNumeric < 0) {
			// found a door to a random dungeon - make sure that it's a door to a new map (ie. less than current map number):
			if (checkDoorNumeric < currentmapnumber) {
				var newDungeonMap = new LoadVars();
				var newDungeonMapResponse = new LoadVars();
				newDungeonMapResponse.onLoad = function(success) {
					if (success) {
						// don't need response - XML file is ready on server
					}
				};
				DungeonExitDoorX = -1;
				DungeonExitDoorY = -1;
				if (currentmapnumber > 0) {
					// current map isn't a random dungeon - check how long it was since the player was last in that dungeon:
					var lastTimeInDungeon = randomDungeons[mabs(checkDoorNumeric)][1];
					if ((minutesplayed - lastTimeInDungeon) > 10) {
						// clear old maps and build a new one:
						newDungeonMap.clearMaps = "true";
					}
				} else {
					// going from random map to random map - locate the exit door and pass that to PHP:
					var dungeonExitDoor = new Array();
					for (j in thisMapsDoors) {
						var checkDoorNumericInner = parseInt(thisMapsDoors[j][0]);
						if (checkDoorNumericInner < 0) {
							// check it's not the door back to the previous map:
							if (checkDoorNumericInner < currentmapnumber) {
								dungeonExitDoor.push(new Array(parseInt(thisMapsDoors[j][1]), parseInt(thisMapsDoors[j][2])));
							}
						}
					}
					// find the centre of this exit door:
					if ((dungeonExitDoor[0][1] == 0) || (dungeonExitDoor[0][1] == (maplengthy - 1))) {
						// north wall or south wall - average the 3 x values to get the centre of the three:
						DungeonExitDoorX = (dungeonExitDoor[0][0] + dungeonExitDoor[1][0] + dungeonExitDoor[2][0]) / 3;
						DungeonExitDoorY = dungeonExitDoor[0][1];
					}
					if ((dungeonExitDoor[0][0] == 0) || (dungeonExitDoor[0][0] == (maplengthx - 1))) {
						// east or west wall
						DungeonExitDoorX = dungeonExitDoor[0][0];
						DungeonExitDoorY = (dungeonExitDoor[0][1] + dungeonExitDoor[1][1] + dungeonExitDoor[2][1]) / 3;
					}
				}
				newDungeonMap.playerId = charnumber;
				newDungeonMap.originatingMapId = currentmapnumber;
				newDungeonMap.requestedMap = checkDoorNumeric;
				if ((checkDoorNumeric < 0) && (currentmapnumber > 0)) {
					// create dungeon name if not existing already:
					randomDungeonName = randomDungeons[mabs(checkDoorNumeric)][0];
				}
				cleanDungeonURL = randomDungeonName.split(" ").join("-").toLowerCase();
				newDungeonMap.dungeonName = cleanDungeonURL;
				if (DungeonExitDoorX != -1) {
					// pass door details through:
					newDungeonMap.connectingDoorX = DungeonExitDoorX;
					newDungeonMap.connectingDoorY = DungeonExitDoorY;
				}
				// newDungeonMap.forceMode = "nest";                                                                                                                                          
				newDungeonMap.sendAndLoad("http://www.autumnearth.com/generateDungeonMap.php",newDungeonMapResponse,"GET");
				// only request the map once, even though there may be 3 door tiles to the next map:
				break;
			}
		}
	}
}
//

function stopTrackingQuestItem(whichQuestNumber) {
	// find the item(s) for this quest and remove them from the array

	var itemreqstring:Array = quests[whichQuestNumber][2].split("|");
	for (var i = 0; i < itemreqstring.length; i++) {
		var thisQuestItem = itemreqstring[i].split(".");

		for (var j = 0; j < questItemsNeeded.length; j++) {
			// check quantity too in case there's another active quest that requires the same item
			if (thisQuestItem[0] == questItemsNeeded[j][0]) {
				if (thisQuestItem[1] == questItemsNeeded[j][1]) {

					questItemsNeeded.splice(j,1);
				}
			}
		}
	}

}

function trackQuestItem(whichQuestNumber) {
	// determine the required items and add them to the array for the familiar to look out for
	var itemreqstring:Array = quests[whichQuestNumber][2].split("|");
	for (var i = 0; i < itemreqstring.length; i++) {
		var thisQuestItem = itemreqstring[i].split(".");
		questItemsNeeded.push(new Array(thisQuestItem[0], thisQuestItem[1]));
	}

}

function isAQuestItem(itemCode) {
	for (var i = 0; i < questItemsNeeded.length; i++) {
		if (questItemsNeeded[i][1] == itemCode) {
			// make sure the hero hasn't already got the number required for this quest:
			if (!(hasgotitem(questItemsNeeded[i][1], questItemsNeeded[i][0]))) {



				return true;
			}
		}
	}
	return false;
}

function loadCartographyMap() {

	if (currentmapnumber < 0) {
		// load random dungeon map:
		gamedisplay.cartographyPanel.mapLoader.cartoMapPath = "http://www.autumnearth.com/generateCartographicMap.php?playerId=" + charnumber + "&dungeonName=" + cleanDungeonURL + "&requestedMap=" + currentmapnumber + "&uniq=" + new Date().getTime();
		gamedisplay.cartographyPanel.mapLoader.gotoAndPlay("loadMap");
	}



	if ((0 - currentmapnumber) > currentDungeonCartographicMap.length) {

		currentDungeonCartographicMap.push(new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0));
	}
	revealCartographicMap(herox,heroy);
}


function duplicateCartographicMap() {
	// do this at root level to save having to re-import the drawing classes to the cartography panel
	var pathToCartographyClip = gamedisplay.cartographyPanel.mapLoader;

	var col = 0;
	var row = 0;



	for (var i = 0; i < 36; i++) {
		// .dispose() of all of these when leaving map? ##################### 
		// 88 is the size of the gradient mask:
		var copiedBitmap = new BitmapData(88, 88);
		copiedBitmap.draw(pathToCartographyClip.imageHolder,new Matrix(1, 0, 0, 1, col + 23, row + 23));

		// 1 is the new depth:
		pathToCartographyClip["cartographyTile" + i].anime.tile.attachBitmap(copiedBitmap,1);
		pathToCartographyClip["cartographyTile" + i].anime.tile.cacheAsBitmap = true;
		pathToCartographyClip["cartographyTile" + i].anime.tileMask.cacheAsBitmap = true;
		pathToCartographyClip["cartographyTile" + i].anime.tile.setMask(pathToCartographyClip["cartographyTile" + i].anime.tileMask);
		// 41 is the size of the grid discounting the faded overlap:
		col -= 41;


		if (currentDungeonCartographicMap[((0 - currentmapnumber) - 1)][i] == 0) {
			pathToCartographyClip["cartographyTile" + i].gotoAndStop(1);
		} else {



			pathToCartographyClip["cartographyTile" + i].gotoAndPlay("fadeIn");
		}

		if (col <= -246) {
			col = 0;
			row -= 41;
		}
	}

}

function revealCartographicMap(tileX, tileY) {
	// save whichTile to an array, in case the bitmap has been loaded and copied yet #################
	var whichTile = mfloor(tileX / 6) + (mfloor((36 - tileY) / 6) * 6);


	if (currentmapnumber < 0) {
		var pathToCartographyClip = gamedisplay.cartographyPanel.mapLoader;
		if (currentDungeonCartographicMap[((0 - currentmapnumber) - 1)][whichTile] == 0) {
			pathToCartographyClip["cartographyTile" + whichTile].gotoAndPlay("fadeIn");



			currentDungeonCartographicMap[((0 - currentmapnumber) - 1)][whichTile] = 1;
		}
	}
}

function doNPCPathfind(whichNpc) {
	var thisnpc = scrollclip["n_" + whichNpc];

	var adirection = currentnpcs[whichNpc][7];
	//thisdirection = adirection.substr(thisnpc.pathmarker, 1);
	var countMarker = adirection.indexOf('#', thisnpc.pathmarker);
	//var tileTargetRange = adirection.substring(thisnpc.pathmarker+1, countMarker).split("-");
	//thisnpc.pathmarker = countMarker;



	// create path object to hold everything:
	thisnpc.findclosestpath = {};
	thisnpc.findclosestpath.startx = parseInt(thisnpc.xtile);
	thisnpc.findclosestpath.starty = parseInt(thisnpc.ytile);



	thisnpc.findclosestpath.targettileRange = adirection.substring(thisnpc.pathmarker + 1, countMarker);


	thisnpc.pathfindingTargetTerrain = thisnpc.findclosestpath.targettileRange;



	thisnpc.findclosestpath.uncheckedtiles = [];
	//thisnpc.findclosestpath.done = false;
	// create first node:
	// no heuristic:
	var cost = 1;
	thisnpc.findclosestpath["node_" + thisnpc.findclosestpath.startx + "_" + thisnpc.findclosestpath.starty] = {nx:thisnpc.findclosestpath.startx, ny:thisnpc.findclosestpath.starty, parentx:null, parenty:null, cost:cost};
	// add to array:
	thisnpc.findclosestpath.uncheckedtiles.push(thisnpc.findclosestpath["node_" + thisnpc.findclosestpath.startx + "_" + thisnpc.findclosestpath.starty]);

	npcsLookingForPaths.push(whichNpc);



	thisnpc.findclosestpath.hitTargetTerrain = thisnpc.hitTargetTerrain;


}
function npcFindNextNode() {
	//gamedisplay.characterPanel.charName.text = "";
	for (g in npcsLookingForPaths) {
		var whichNpc = npcsLookingForPaths[g];
		//gamedisplay.characterPanel.charName.text += whichNpc+", ";
		var thisnpc = scrollclip["n_" + whichNpc];


		if (thisnpc.findclosestpath.uncheckedtiles.length > 0) {
			// get the next node:

			var N:Object = thisnpc.findclosestpath.uncheckedtiles.shift();
			// check if this is the target:


			var tileTargetRange = thisnpc.findclosestpath.targettileRange.split("-");



			if ((currentmap[N.nx][N.ny] >= tileTargetRange[0]) && (currentmap[N.nx][N.ny] <= tileTargetRange[1])) {
				//thisnpc.findclosestpath.done = true;

				// remove this from array:


				for (var findNPCRemove = 0; findNPCRemove < npcsLookingForPaths.length; findNPCRemove++) {
					if (npcsLookingForPaths[findNPCRemove] == whichNpc) {
						npcsLookingForPaths.splice(findNPCRemove,1);
					}
				}



				makeNPCPath(whichNpc,N);
				break;
			} else {

				// check that this tile is walkable to be able to access the neighbouring nodes:

				if (islocationproperty(4, N.nx, N.ny)) {




					// randomise the order of preference:

					var randomOrder = mfloor(mrand() * (4));

					switch (randomOrder) {
						case 0 :
							addNPCNode(whichNpc,N,N.nx + 1,N.ny);

							addNPCNode(whichNpc,N,N.nx,N.ny + 1);
							addNPCNode(whichNpc,N,N.nx,N.ny - 1);
							addNPCNode(whichNpc,N,N.nx - 1,N.ny);
							break;
						case 1 :
							addNPCNode(whichNpc,N,N.nx,N.ny + 1);
							addNPCNode(whichNpc,N,N.nx - 1,N.ny);
							addNPCNode(whichNpc,N,N.nx + 1,N.ny);
							addNPCNode(whichNpc,N,N.nx,N.ny - 1);
							break;
						case 2 :
							addNPCNode(whichNpc,N,N.nx - 1,N.ny);

							addNPCNode(whichNpc,N,N.nx,N.ny - 1);
							addNPCNode(whichNpc,N,N.nx + 1,N.ny);
							addNPCNode(whichNpc,N,N.nx,N.ny + 1);

							break;
						case 3 :
							addNPCNode(whichNpc,N,N.nx,N.ny - 1);
							addNPCNode(whichNpc,N,N.nx + 1,N.ny);
							addNPCNode(whichNpc,N,N.nx,N.ny + 1);
							addNPCNode(whichNpc,N,N.nx - 1,N.ny);


							break;


					}


				}
			}
		} else {
			// no path found, try again:
			delete thisnpc.findclosestpath;
			thisnpc.pathfindingTargetTerrain = -1;
			for (var findNPCRemove = 0; findNPCRemove < npcsLookingForPaths.length; findNPCRemove++) {
				if (npcsLookingForPaths[findNPCRemove] == whichNpc) {
					npcsLookingForPaths.splice(findNPCRemove,1);
				}
			}
			doNPCPathfind(whichNpc);
		}
	}


}

function addNPCNode(whichNpc, parentnode, nodex, nodey) {

	var thisnpc = scrollclip["n_" + whichNpc];

	if (thisnpc.findclosestpath["node_" + nodex + "_" + nodey].cost == undefined) {

		if (currentmap[nodex][nodey] != undefined) {
			// check no item here:
			if (!(scrollclip["i_" + nodex + "_" + nodey])) {


				var tileShouldBeAvoided = false;
				// check this tile isn't on the avoid list
				if (thisnpc.tilesToAvoid != "") {
					var avoidedTheseTiles = thisnpc.tilesToAvoid.split("|");

					for (var avt = 0; avt < avoidedTheseTiles.length; avt++) {
						var avoidTileCoords = avoidedTheseTiles[avt].split(",");
						if (avoidTileCoords[0] == nodex) {
							if (avoidTileCoords[1] == nodey) {
								tileShouldBeAvoided = true;
							}
						}
					}

				}


				if (!tileShouldBeAvoided) {




					var foundStaticNPC = false;
					// check no static npc here:

					for (var h in currentnpcs) {

						thischecknpc = scrollclip["n_" + h];

						if (thischecknpc.xtile == nodex) {
							if (thischecknpc.ytile == nodey) {

								if (parseInt(currentnpcs[h][1]) == 1) {



									foundStaticNPC = true;
								}

							}

						}

					}


					if (!foundStaticNPC) {
						// calculate cost:
						//var cost:Number = mabs(nodex - scrollclip["npc" + whichNpc].findclosestpath.endx) + mabs(nodey - scrollclip["npc" + whichNpc].findclosestpath.endy);
						var cost = 1;
						// make new node:
						thisnpc.findclosestpath["node_" + nodex + "_" + nodey] = {nx:nodex, ny:nodey, parentx:parentnode.nx, parenty:parentnode.ny, cost:cost};

						// add it to the array:
						for (var i = 0; i < thisnpc.findclosestpath.uncheckedtiles.length; i++) {
							if (cost < thisnpc.findclosestpath.uncheckedtiles[i].cost) {
								thisnpc.findclosestpath.uncheckedtiles.splice(i,0,thisnpc.findclosestpath["node_" + nodex + "_" + nodey]);
								break;
							}
						}
						if (i >= thisnpc.findclosestpath.uncheckedtiles.length) {
							// add to end of array:
							thisnpc.findclosestpath.uncheckedtiles.push(thisnpc.findclosestpath["node_" + nodex + "_" + nodey]);
						}
					}
				}
			}
		}
	}

}

function makeNPCPath(whichNpc, pathobj) {

	var thisnpc = scrollclip["n_" + whichNpc];

	var thisNPCPathX;
	var thisNPCPathY;
	var thisNPCPathString = "";
	// loop until no more parents:





	var thisNPCTiles = [];


	while (pathobj.parentx != null) {
		thisNPCTiles.unshift([pathobj.nx, pathobj.ny]);
		// make its parent the new object: 
		pathobj = thisnpc.findclosestpath["node_" + pathobj.parentx + "_" + pathobj.parenty];

	}

	thisNPCPathX = thisnpc.findclosestpath.startx;
	thisNPCPathY = thisnpc.findclosestpath.starty;
	for (var i = 0; i < thisNPCTiles.length; i++) {
		if (thisNPCTiles[i][0] == thisNPCPathX) {
			if (thisNPCTiles[i][1] < thisNPCPathY) {
				thisNPCPathString += "3";
			} else {
				thisNPCPathString += "1";
			}

		} else if (thisNPCTiles[i][0] < thisNPCPathX) {
			thisNPCPathString += "4";
		} else {
			thisNPCPathString += "2";
		}
		thisNPCPathX = thisNPCTiles[i][0];
		thisNPCPathY = thisNPCTiles[i][1];
	}




	if (thisnpc.findclosestpath.hitTargetTerrain) {
		thisNPCPathString = "^" + thisNPCPathString;

	}
	// insert the string into the npc's full pathstring:                                                                           


	var adirection = currentnpcs[whichNpc][7];
	//gamedisplay.characterPanel.charName.text = adirection;
	var countMarker = adirection.indexOf('#', thisnpc.pathmarker) + 1;
	var newString = adirection.substring(0, countMarker) + "|" + thisNPCPathString + "|" + adirection.substring(countMarker);

	currentnpcs[whichNpc][7] = newString;

	thisnpc.pathmarker = countMarker + 1;

	thisnpc.animationLookaheadPathFind = false;

	thisnpc.tilesToAvoid = "";


	// set values to force this new path to be picked up:
	if (!thisnpc.findclosestpath.hitTargetTerrain) {
		thisnpc.hasStopped = 1;
		thisnpc.xdistance = spacing;
		thisnpc.ydistance = 0;
	}

}

//

function destroyTerrain(centreX, centreY, coreRadius, DropoffRadius, terrainType) {
	var outerRadius = coreRadius + DropoffRadius;
	var destroyTerrainDifference = scrollclip.terrainMax - scrollclip.terrainBase;
	var newTerrainDepth, thisCurrentTile, thisPythagoreanDistance, requiredGraphic, needsChanging, g;
	// constrain search:
	var areaMinX = centreX - outerRadius;
	var areaMaxX = centreX + outerRadius;
	var areaMinY = centreY - outerRadius;
	var areaMaxY = centreY + outerRadius;
	var edgeSearch = false;
	if (areaMinX <= 0) {
		areaMinX = 0;
		edgeSearch = true;
	}
	if (areaMinY <= 0) {
		areaMinY = 0;
		edgeSearch = true;
	}
	if (areaMaxX >= (maplengthx - 1)) {
		areaMaxX = (maplengthx - 1);
		edgeSearch = true;
	}
	if (areaMaxY >= (maplengthy - 1)) {
		areaMaxY = (maplengthy - 1);
		edgeSearch = true;
	}
	for (i = areaMinY; i <= areaMaxY; i++) {
		for (j = areaMinX; j <= areaMaxX; j++) {
			thisCurrentTile = currentmap[i][j];
			if (thisCurrentTile == scrollclip.voidTerrain) {
				// blank space, but is solid rock:
				thisCurrentTile = scrollclip.terrainMax;
			}
			//  check if this tile is destructible by this type of force (eg. earth force will destroy earth terrain)                                                              
			// do this with a tile clip property #######
			thisPythagoreanDistance = msqrt(((i - centreY) * (i - centreY)) + ((j - centreX) * (j - centreX)));
			needsChanging = false;
			if (thisPythagoreanDistance <= coreRadius) {
				requiredGraphic = scrollclip.floorTerrain;
				if (edgeSearch) {
					if (i == 0) {
						requiredGraphic = scrollclip.terrainBase;
					} else if (j == 0) {
						requiredGraphic = scrollclip.terrainBase;
					} else if (i == maplengthy - 1) {
						requiredGraphic = scrollclip.terrainBase;
					} else if (j == maplengthx - 1) {
						requiredGraphic = scrollclip.terrainBase;
					}
				}
				needsChanging = true;
				// check for items
				// need to check the item's material type to see if it will be affected by this: ####################
				if (scrollclip["i_" + i + "_" + j]) {

					for (g in displayitems) {
						if (parseInt(displayitems[g][0]) == i) {
							if (parseInt(displayitems[g][1]) == j) {
								displayitems.splice(g,1);
								addtochanges([currentmapnumber, 3, g, -1]);
								if (g < parseInt(familiarfoundindex)) {
									familiarfoundindex = parseInt(familiarfoundindex) - 1;
								}
								break;
							}
						}
					}
					scrollclip["i_" + i + "_" + j].removeMovieClip();
				}

			} else if (thisPythagoreanDistance <= outerRadius) {
				var requiredGraphic = mfloor((thisPythagoreanDistance - coreRadius) / (DropoffRadius + 1) * (thisCurrentTile - scrollclip.terrainBase)) + scrollclip.terrainBase;
				if (edgeSearch) {
					if (i == 0) {
						if (requiredGraphic < scrollclip.terrainBase) {
							requiredGraphic = scrollclip.terrainBase;
						}
					} else if (j == 0) {
						if (requiredGraphic < scrollclip.terrainBase) {
							requiredGraphic = scrollclip.terrainBase;
						}
					} else if (i == maplengthy - 1) {
						if (requiredGraphic < scrollclip.terrainBase) {
							requiredGraphic = scrollclip.terrainBase;
						}
					} else if (j == maplengthx - 1) {
						if (requiredGraphic < scrollclip.terrainBase) {
							requiredGraphic = scrollclip.terrainBase;
						}
					}
				}
				needsChanging = true;
			}
			if (needsChanging) {
				// avoid things like doors and already flat terrain:
				if (thisCurrentTile >= scrollclip.terrainBase) {
					if (thisCurrentTile <= scrollclip.terrainMax) {
						//statusMessage(thisPythagoreanDistance + "," + thisCurrentTile + "," + scrollclip.terrainBase + "," + scrollclip.floorTerrain + "," + requiredGraphic + "," + (thisPythagoreanDistance <= coreRadius));
						scrollclip["t_" + i + "_" + j].gotoAndStop(requiredGraphic);
						currentmap[i][j] = requiredGraphic;
						// re-depth sort the tile:
						if (requiredGraphic < structureframe) {
							newTerrainDepth = calculatedepth(i, j);
						} else {
							newTerrainDepth = calculateobjectdepth(((spacing * (i + j)) + 1), (spacing / 2 * (i - j)));
							// all tiles are depth sorted at +1 so their 0,0 can't be the same as any sprites
						}
						scrollclip["t_" + i + "_" + j].swapDepths(newTerrainDepth);
					}
				}
			}
		}
	}


	// loop through NPCs and see if they're interacting with terrain that has been affected:
	var g, thisnpc;
	for (g in currentnpcs) {
		thisnpc = scrollclip["n_" + g];

		// x and y are swapped:
		if (thisnpc.ytile <= areaMaxX) {
			if (thisnpc.ytile >= areaMinX) {
				if (thisnpc.xtile <= areaMaxY) {
					if (thisnpc.xtile >= areaMinY) {
						// this NPC is in or very near to the blast
						// check if they're mining:
						if (thisnpc.npcclip._currentframe == 20) {
							// this will only work in the dwarf mining instance, needs to be made more generic ########
							// reset - find a new area to mine
							// needs to return to tile centre first ########

							// if it's going to move off to an ore-deposit area, then just jump straight to that:

							if (currentnpcs[g][7].indexOf("cary")) {
								thisnpc.i = 0;
								thisnpc.npcclip.gotoAndStop("stand");
							} else {
								// stop animation
								// move back to tile centre
								// reset path marker, and find new path
								// ###########
							}


							/*
							//thisnpc.xdir *= -1;
							//thisnpc.ydir *= -1;
							thisnpc.currentWalkingAnimation = "walk";
							thisnpc.followingpath = 1;
							thisnpc.gotoAndStop((thisnpc.xdir) + (thisnpc.ydir) * 2 + 3);
							thisnpc.pathmarker = 0;
							// check to see if it needs to find a path:
							//if (currentnpcs[g][7].substr(thisnpc.pathmarker, 1) == "P") {
							thisnpc.npcclip.gotoAndStop("stand");
							doNPCPathfind(g);
							//}
							*/
						}
					}

				}

			}

		}
	}


	// save map changes:

	var updateMap = new LoadVars();

	updateMap.currentmap = currentmapnumber;
	updateMap.username = charnumber;

	if (currentmapnumber < 0) {
		updateMap.cleanDungeonURL = randomDungeonName.split(" ").join("-").toLowerCase();
	} else {
		updateMap.cleanDungeonURL = "";

	}

	// pass map data
	var mapDataString = "";
	for (var updatetilex = 0; updatetilex < maplengthx; updatetilex++) {
		mapDataString += currentmap[updatetilex].join(",") + "|";
	}
	//remove final '|':
	mapDataString = mapDataString.substr(0, mapDataString.length - 1);

	updateMap.mapData = mapDataString;


	var updateMapResponse = new LoadVars();
	updateMapResponse.onLoad = function(success) {
		if (success) {
			if (this.changeswassuccess == "false") {
				// try again #######
			} else {
				// update minimap graphic - pass an additional variable so that PHP can return a value here to know when to load the new graphic in #####
				var updateMiniMap = new LoadVars();
				var updateMiniMapResponse = new LoadVars();
				updateMiniMapResponse.onLoad = function(success) {
					if (success) {
						if (this.changeswassuccess == "true") {
							// load image in once ready
							if (currentmapnumber < 0) {
								// load random dungeon map:
								// it's working, but Flash is caching the graphic ##########
								gamedisplay.cartographyPanel.mapLoader.cartoMapPath = "http://www.autumnearth.com/generateCartographicMap.php?playerId=" + charnumber + "&dungeonName=" + cleanDungeonURL + "&requestedMap=" + currentmapnumber + "&uniq=" + new Date().getTime();

								// this could be loaded in so it overlays rather than the initial fade in ########
								copiedBitmap.dispose();
								gamedisplay.cartographyPanel.mapLoader.gotoAndPlay("loadMap");
							}
						}
					}
				};
				updateMiniMap.sendAndLoad("http://www.autumnearth.com/generateCartographicMap.php?playerId=" + charnumber + "&dungeonName=" + cleanDungeonURL + "&requestedMap=" + currentmapnumber + "&update=true",updateMiniMapResponse);
			}
			//
		}
	};
	updateMap.sendAndLoad("http://www.autumnearth.com/updateMap.php",updateMapResponse);


	// TO DO:
	// add tile clip property for destructible by terrain type
	// add LOS check before spell is cast

	// Check raised terrain and stairs.
	// ...magic system

}

function toggleCollectionAlbum() {

	if (!collectionAlbumVisible) {
		gamedisplay.collectionAlbum._visible = true;
		collectionAlbumVisible = true;
	} else {
		gamedisplay.collectionAlbum._visible = false;
		collectionAlbumVisible = false;
	}
}

function initCollectionAlbum() {
	numberOfCollectionSlots = 12;
	for (var i = 1; i < (numberOfCollectionSlots + 1); i++) {
		// hide the inventory slot background:
		gamedisplay.collectionAlbum.collectionAlbumTiles["collectionTile" + i].slotBG._visible = false;
	}
	updateCollectionAlbumPages();
}

function updateCollectionAlbumPages() {
	gamedisplay.collectionAlbum.collectionAlbumTitle.text = collections[currentCollectionAlbumPage][0];
	if (completedCollections[currentCollectionAlbumPage] == 1) {
		// show lore
		gamedisplay.collectionAlbum.collectionAlbumLore.text = collections[currentCollectionAlbumPage][3];
		gamedisplay.collectionAlbum.collectionAlbumLore._visible = true;
	} else {
		gamedisplay.collectionAlbum.collectionAlbumLore._visible = false;
	}
	// position the tiles clear of the title:
	gamedisplay.collectionAlbum.collectionAlbumTiles._y = gamedisplay.collectionAlbum.collectionAlbumTitle._y + gamedisplay.collectionAlbum.collectionAlbumTitle.textHeight;
	for (var i = 4; i < collections[currentCollectionAlbumPage].length; i++) {
		gamedisplay.collectionAlbum.collectionAlbumTiles["collectionTile" + (i - 3)].gotoAndStop(collections[currentCollectionAlbumPage][i]);

		if (currentCollections[currentCollectionAlbumPage][(i - 4)] == 0) {
			// this isn't currently complete:
			gamedisplay.collectionAlbum.collectionAlbumTiles["collectionTile" + (i - 3)]._alpha = 50;
		} else {
			gamedisplay.collectionAlbum.collectionAlbumTiles["collectionTile" + (i - 3)]._alpha = 100;
		}
	}
	// ensure the remainder are cleared:
	for (var i = collections[currentCollectionAlbumPage].length; i < (numberOfCollectionSlots + 4); i++) {
		gamedisplay.collectionAlbum.collectionAlbumTiles["collectionTile" + (i - 3)].gotoAndStop(1);
	}
}

function turnCollectionAlbumPageLeft() {
	if (currentCollectionAlbumPage > 0) {
		currentCollectionAlbumPage--;
		updateCollectionAlbumPages();
	}
}

function turnCollectionAlbumPageRight() {
	if (currentCollectionAlbumPage < (completedCollections.length - 1)) {
		currentCollectionAlbumPage++;
		updateCollectionAlbumPages();
	}
}

function updateVisibleAlbum(whichAlbumCollection, whichAlbumItem) {

	whichAlbumItem = parseInt(whichAlbumItem);

	if (currentCollectionAlbumPage == whichAlbumCollection) {
		thisAlbumTile = gamedisplay.collectionAlbum.collectionAlbumTiles["collectionTile" + (whichAlbumItem + 1)];
		thisAlbumTile._alpha = 100;
		gamedisplay.collectionAlbum.collectionAlbumTiles.albumGlow._x = thisAlbumTile._x - thisAlbumTile._width / 2;
		gamedisplay.collectionAlbum.collectionAlbumTiles.albumGlow._y = thisAlbumTile._y - thisAlbumTile._height / 2;
		gamedisplay.collectionAlbum.collectionAlbumTiles.albumGlow.gotoAndPlay(2);
	} else if (whichAlbumCollection < currentCollectionAlbumPage) {
		gamedisplay.collectionAlbum.albumGlowLeftAnime.gotoAndPlay(2);
	} else {
		gamedisplay.collectionAlbum.albumGlowRightAnime.gotoAndPlay(2);
	}
}

function checkQuestHotSpots() {
	for (var i = 0; i < thisMapsQuestHotSpots.length; i++) {
		// replace hyphens in the name with spaces:
		thisMapsQuestHotSpots[i][1] = thisMapsQuestHotSpots[i][1].split("-").join(" ");
		if (thisMapsQuestHotSpots[i][2] == "all") {
			// trigger this now:
			questEvents[(thisMapsQuestHotSpots[i][0])] = 1;
			gamedisplay.questHotSpotName.locationNameText.hotspotName.text = thisMapsQuestHotSpots[i][1];
			gamedisplay.questHotSpotName.gotoAndPlay(2);
		}
	}
	checkProximityQuestHotSpots();

}

function checkProximityQuestHotSpots() {
	// also call this for every new tile the hero enters
	// check ifinradius of centre, and trigger if so
	for (var i = 0; i < thisMapsQuestHotSpots.length; i++) {
		if (thisMapsQuestHotSpots[i][2] != "all") {
			var thisQuestHotSpotX = thisMapsQuestHotSpots[i][2];
			var thisQuestHotSpotY = thisMapsQuestHotSpots[i][3];
			var thisQuestHotSpotRadius = thisMapsQuestHotSpots[i][4];
			if (isinrange(herox, heroy, thisQuestHotSpotX, thisQuestHotSpotY, thisQuestHotSpotRadius)) {
				if (questEvents[(thisMapsQuestHotSpots[i][0])] != 1) {
					// need to look at the height of the target tile and height of the hero as well #############
					questEvents[(thisMapsQuestHotSpots[i][0])] = 1;
					gamedisplay.questHotSpotName.locationNameText.hotspotName.text = thisMapsQuestHotSpots[i][1];
					gamedisplay.questHotSpotName.gotoAndPlay(2);
				}
			}
		}
	}
}

function checkForNewCatalogues() {
	var foundCatalogueItem = false;
	if (cataloguesThatNeedData > 0) {
		// find the item that needs the catalogue data adding:
		for (var i = 0; i < inventory.length; i++) {
			if (inventoryitems[(inventory[i][0])][6] == "catalogue") {
				if (inventory[i][7] == "!!!") {
					getCatalogueDetails(inventory[i]);
					foundCatalogueItem = true;
					break;
				}
			}
		}
		if (!foundCatalogueItem) {
			for (var i = 0; i < petcarrying.length; i++) {
				if (inventoryitems[(petcarrying[i][0])][6] == "catalogue") {
					if (petcarrying[i][7] == "!!!") {
						getCatalogueDetails(petcarrying[i]);
						foundCatalogueItem = true;
						break;
					}
				}
			}
		}
	}
}
function getCatalogueDetails(catalogueItemDetails) {
	var catalogueSend = new LoadVars();
	var catalogueResponse = new LoadVars();
	catalogueSend.sendAndLoad("http://www.autumnearth.com/generateCollectionQuest.php?requestingZone=" + catalogueItemDetails[10],catalogueResponse);
	catalogueResponse.onLoad = function(success) {
		if (success) {
			if (this.catalogueListOK == "true") {
				// find the item (based on thisCataloguezoneRequesting) and populate it with this data:
				var thisCatalogueItems = this.allItems;
				var thisCataloguezoneRequesting = this.zoneRequesting;
				var thisCataloguezoneName = this.zoneName;
				var thisCatalogieItemList = thisCatalogueItems.split(",");
				var thisCatalogueItemsFound = "";
				for (var i = 0; i < thisCatalogieItemList.length; i++) {
					thisCatalogueItemsFound += "0";
				}
				var foundCatalogueItem = false;
				for (var i = 0; i < inventory.length; i++) {
					if (inventoryitems[(inventory[i][0])][6] == "catalogue") {
						if (inventory[i][7] == "!!!") {
							if (inventory[i][10] == thisCataloguezoneRequesting) {
								inventory[i][7] = thisCatalogueItems;
								inventory[i][6] = thisCatalogueItemsFound;
								inventory[i][10] = thisCataloguezoneName;
								foundCatalogueItem = true;
								break;
							}
						}
					}
				}
				if (!foundCatalogueItem) {
					for (var i = 0; i < petcarrying.length; i++) {
						if (inventoryitems[(petcarrying[i][0])][6] == "catalogue") {
							if (petcarrying[i][7] == "!!!") {
								if (petcarrying[i][10] == thisCataloguezoneRequesting) {
									petcarrying[i][7] = thisCatalogueItems;
									petcarrying[i][6] = thisCatalogueItemsFound;
									petcarrying[i][10] = thisCataloguezoneName;
									foundCatalogueItem = true;
									break;
								}
							}
						}
					}
				}
				if (foundCatalogueItem) {
					createCatalogueItemPanel(thisCataloguezoneName,thisCatalogueItems);
					cataloguesThatNeedData--;
				}
			}
		}
	};
}

function createCatalogueItemPanel(zoneName, zoneItemsList) {
	var newCatItemDepth = gamedisplay.catalogueItemPanelHolder.getNextHighestDepth();
	if (gamedisplay.catalogueItemPanelHolder["catalogueItem" + zoneName] == undefined) {
		// create new panel:
		gamedisplay.catalogueItemPanelHolder.attachMovie("catalogueItemPanel","catalogueItem" + zoneName,newCatItemDepth);
		var thisItemPanel = gamedisplay.catalogueItemPanelHolder["catalogueItem" + zoneName];
		thisItemPanel.zoneName.text = zoneName;
		thisItemPanel._x = 0;
		thisItemPanel._y = 0;
		var allItemsNeed = zoneItemsList.split(",");
		// push to array
		var newDataToAdd = [];
		newDataToAdd.push(zoneName);
		activeCatalogueQuests.push(newDataToAdd.concat(allItemsNeed));
		thisItemPanel.listHolder._y = thisItemPanel.zoneName._y + thisItemPanel.zoneName.textHeight + 10;
		var yPosition = 0;
		for (var i = 0; i < allItemsNeed.length; i++) {
			thisItemPanel.listHolder.attachMovie("cataloguePanelText","catalogueEntry" + i,i + 1000);
			var thisItemPanelEntry = thisItemPanel.listHolder["catalogueEntry" + i];
			thisItemPanelEntry.strikeThrough.gotoAndStop((i % 6) + 1);
			thisItemPanelEntry.strikeThrough._visible = false;
			thisItemPanelEntry.catalogueText.text = inventoryitems[(allItemsNeed[i])][0];
			thisItemPanelEntry._x = 0;
			thisItemPanelEntry._y = yPosition;
			yPosition += thisItemPanelEntry.catalogueText.textHeight + 6;
		}
		thisItemPanel._visible = false;
	}
}
function openCatalogueQuestItem(whichPanel, whichHaveBeenSeen) {
	// check for updates to how many have been seen:
	for (var i = 0; i < whichHaveBeenSeen.length; i++) {
		if (whichHaveBeenSeen.charAt(i) == "1") {
			gamedisplay.catalogueItemPanelHolder["catalogueItem" + whichPanel].listHolder["catalogueEntry" + i].strikeThrough._visible = true;
		}
	}
	gamedisplay.catalogueItemPanelHolder["catalogueItem" + whichPanel]._visible = true;
}


function checkForCatalogueQuestItemsNearby() {
	var currentZone = "";
	if (currentmapnumber < 0) {
		currentZone = randomDungeonName.toLowerCase();
	} else {
		// need to divide up non-dynamic regions into zones ########
	}
	if (activeCatalogueQuests.length > 0) {
		for (var i = 0; i < activeCatalogueQuests.length; i++) {
			if ((activeCatalogueQuests[i][0]).toLowerCase() == currentZone) {
				for (var g in displayitems) {
					var itemxtile = parseInt(displayitems[g][0]);
					var itemytile = parseInt(displayitems[g][1]);
					var invArrayRef = parseInt(displayitems[g][2]);
					// check the item is visible:
					if (scrollclip["i_" + itemxtile + "_" + itemytile]._visible == true) {
						// check item is close by:
						if (isinrange(herox, heroy, itemxtile, itemytile, catalogueQuestSkillRadius)) {
							var positionofThisItem = -1;
							for (var j = 0; j < activeCatalogueQuests[i].length; j++) {
								if (activeCatalogueQuests[i][j] == invArrayRef) {
									positionofThisItem = j;
									break;
								}
							}
							if (positionofThisItem != -1) {
								// loop through inventory and find the item which has this.inscr == randomDungeonName
								var foundTheCatalogue = false;
								for (var j in inventory) {
									if (inventory[j][10] == randomDungeonName) {
										var foundItemInSet = "inventory";
										var foundItemInSlot = j;
										foundTheCatalogue = true;
										break;
									}
								}
								if (petcarrying.length != 0) {
									for (var j = 0; j < petcarrying.length; j++) {
										if (petcarrying[j][10] == randomDungeonName) {
											var foundItemInSet = "petcarrying";
											var foundItemInSlot = j;
											foundTheCatalogue = true;
											break;
										}
									}
								}
								if (foundTheCatalogue) {
									// set to '1' on the item's tracking for items
									var currentViewedState = _root[foundItemInSet][foundItemInSlot][6];
									//  activeCatalogueQuests[i][0] is the name of the zone, so subtract 1 to match this index with the index of elements in currentViewedState
									var requiredIndex = (positionofThisItem - 1);
									var updatedString = currentViewedState.substr(0, requiredIndex) + "1" + currentViewedState.substr(requiredIndex + 1);
									_root[foundItemInSet][foundItemInSlot][6] = updatedString;
									// update the panel's strikethrough 
									gamedisplay.catalogueItemPanelHolder["catalogueItem" + (_root[foundItemInSet][foundItemInSlot][10])].listHolder["catalogueEntry" + requiredIndex].strikeThrough._visible = true;
									if (updatedString.indexOf("0") == -1) {
										// catalogue is complete - change to Complete Catalogue (which is the next entry in Inventory Items array)
										_root[foundItemInSet][foundItemInSlot][0]++;
										statusMessage("Catalogue completed");
										// update the inventory icon:

										gamedisplay.inventorysets[foundItemInSet]["inventoryIcon" + foundItemInSlot].removeMovieClip();
										attachSingleInvIcon(foundItemInSet,foundItemInSlot);
										// remove this from activeCatalogueQuests:
										activeCatalogueQuests.splice(i,1);
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