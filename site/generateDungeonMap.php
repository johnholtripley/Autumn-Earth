<?php
// ---------------------------------
// http://www.autumnearth.com/generateDungeonMap.php?playerId=1001&originatingMapId=-1&requestedMap=-2&dungeonName=the-barrow-mines&forceMode=nest&outputMode=test&connectingDoorX=18&connectingDoorY=35



// TO DO






// pathfinding NPCs should do collision detection between themselves and choose one to move out of the way if they get stuck

// with a mine cart, all npcs tend to then aim for the same bit of rock - might need to store a list of 'occupied' tiles and avoid these






// tunnels shouldn't go through stairs
// bug - can get untraversable maps where a tunnel goes back through a staircase
// the pathfinding check to see if the map is traversable needs to look at height differences as well


// bug - rotation of chests isn't always the way it should be


// need a system so that any maps that still have undisocvered treasure in them aren't deleted when the player leaves the dungeon

// write code so that treasure maps placed in chests work

// checking path is connected will need to also take account of static NPCs

// refine the height determination of walls to be clearer and not obstruct view as much:
// - if the tile is walkable, then it shouldn't take account of tiles that will be blanked out, but if it's going to be wall tile, then it should take account of these when averaging
// loop through and set outputdungeonmap to have the blanked tiles so xml and the averaging function don't repeat the same tests

// have some sort of persistence between dungeon visits. keep track of creature populations etc.

// ensure session saving turning value is unique to each dungeon instance

// templates should be able to place items and NPCs
// template areas could include mines, temples and - template objects and npcs too eg. dwarven expedition

// be really nice to have a league table on the website of which characters have achieved the deepest level in each dungeon - could create competition.

// Templates will need height maps and then to put the map start door at the same height as the height of the entrance to the template

// caves could branch if coordinates for each map are saved and checked against before determining exit doors - just to ensure that the maps don't intersect incorrectly

// which npcs (and frequency) should be determined in the dungeon's config


// save changes in Flash for random maps

// bug - it is possible for small incosequential areas to be separated from the main walkable region after edging walls are added back in. not a problem, but does look a little messy.


// rewrite drawFilledCircle so I understand it

// rarer items should be placed more often the deeper in to the dungeon the player has gone

// randomDungeonName needs to be saved with save game in flash so that it is pulled through when starting a new game session from within the dungeon



// to allow unique template maps to used with the relevant quest objectives on - flash map swf will have an array with the relevant quests for the dungeon that can be entered from that map. flash will request a new map and check the status and pass through any open quests. php will have a table with quest number and the range that that template could be found on - if map level exceeds this range, then use this template so will definintely be used (or have a random chance of it occuring that the liklihood increases with the 'depth' of the current map until it's 100% that this map will be used). table might also have another quest that is opened once this template has been used - so can chain templates in correct order. open quests are stored in database - if map #0 is requested then these are cleared and any new ones from flash are used. once template is used then this is removed from database entry - chained quest template will be added to database entry


// error handle script timeout in function abortScript() and default to a fully templated map so that flash has something to load. These template maps would need to have very wide entrance chambers, so that wherever the door was placed to match up with the previous map, a path is connected up. also need to be aware that a treasure map location might need to exist somewhere on the map
// optimise (if required - it does run pretty fast currently)
// after placing items there is no check on the path not being blocked. make sure that the item placement logic is sound
// place NPCs and creatures
// water features - templated or 'tunnel' a river's course?
// mazes? tend to be annoying, but might provide interest - algorithms at http://www.astrolog.org/labyrnth/algrithm.htm
//
// multiple stair cases
//
//
// ---------------------------------
//
//


// start timer to try and catch script timeouts:
$startTime = time();

$thisPlayersId = $_GET["playerId"];
$thisOriginatingMapId = $_GET["originatingMapId"];
$thisMapsId = $_GET["requestedMap"];
$thisDungeonsName = $_GET["dungeonName"];

$clearOldMaps = false;
if(isset($_GET["clearMaps"])) {
  $clearOldMaps = true;
}


$isTreasureMapLevel = false;
if(isset($_GET["isTreasureMap"])) {
  $isTreasureMapLevel = true;
  $treasureLocX = $_GET["treasureLocX"];
  $treasureLocY = $_GET["treasureLocY"];
}

$debugMode = false;
if(isset($_GET["debug"])) {
  $debugMode = true;
}

$dir = "data/chr" . $thisPlayersId . "/dungeon/".$thisDungeonsName;
// check directory exists and create it if not:
 if (!(is_dir($dir))) {
 mkdir($dir, 0777);
 }

if ($clearOldMaps) {
 if (is_dir($dir)) { 
    if ($thisDirectory = opendir($dir)) {
      while (($file = readdir($thisDirectory)) !== false) {
      if(is_file($dir."/".$file)) {
      // don't delete any maps that have undiscovered treasure still on ###########################
        unlink($dir."/".$file);
      }
    }
    closedir($thisDirectory);
    }
    
    // restore session file:
    if (!copy('data/source/session.inc', $dir.'/session.inc')) {
    // error handling ########
    }
    
    
  }
}


if (is_numeric($thisPlayersId)) {
    if (is_numeric($thisMapsId)) {
        $mapFilename = "data/chr" . $thisPlayersId . "/dungeon/".$thisDungeonsName."/" . $thisMapsId . ".xml";
        if (is_file($mapFilename)) {
            header("Location: http://www.autumnearth.com/" . $mapFilename);
        } else {
            createNewDungeonMap($thisMapsId);
        }
    }
}
function XMLStartTag($parser, $name, $attribs) {
    global $inX, $inY, $outX, $outY, $elementType;
    if ($name == "MAP") {
        // read attributes:
        $inX = $attribs["INX"];
        $inY = $attribs["INY"];
        $outX = $attribs["OUTX"];
        $outY = $attribs["OUTY"];
        $elementType = "map";
    } else if ($name == "TILES") {
    $elementType = "tiles";
    }
}
function XMLEndTag($parser, $name) {
    // (no action)
    
}
function XMLTagContents($parser, $data) {
    global $templateRows, $elementType, $templateTiles;
    if ($elementType == "map") {
    // remove whitespace from data:
    array_unshift($templateRows, str_ireplace(" ", "", $data));
    } else if ($elementType == "tiles") {
    array_unshift($templateTiles, str_ireplace(" ", "", $data));
    }
}
function getXMLFile() {
    global $templateRows, $fileToUse, $templateTiles, $thisDungeonsName, $templatesAlreadyPlaced, $templateChosen;
    // read contents of dir and find number of files:
    $dir = "templates/dungeon/".$thisDungeonsName."/";
    
    
    $filesFound = array();
    if (is_dir($dir)) {
        if ($dirHandle = opendir($dir)) {
            while (($file = readdir($dirHandle)) !== false) {
                if ((is_file($dir . '/' . $file)) && ($file != 'index.php')) {
                if (!(in_array($file,$templatesAlreadyPlaced))) {
                    array_push($filesFound, $file);
                    }
                }
            }
            closedir($dirHandle);
        }
    }
    
    
    $randomFile = rand(0, count($filesFound) - 1);
    $fileToUse = $dir . $filesFound[$randomFile];
    
    $templateChosen = $filesFound[$randomFile];
    
  
    
    $templateRows = array();
    $templateTiles = array();
}
function pickTemplate() {
    global $inX, $inY, $outX, $outY, $templateRows, $fileToUse;
    $xmlparser = xml_parser_create();
    xml_set_element_handler($xmlparser, "XMLStartTag", "XMLEndTag");
    xml_set_character_data_handler($xmlparser, "XMLTagContents");
    $xmlParsedOk = true;
    do {
        do {
            getXMLFile();
        }
        while (!($fp = fopen($fileToUse, "r")));
        while ($data = fread($fp, 4096)) {
            // remove whitespace:
            $data = eregi_replace(">" . "[[:space:]]+" . "<", "><", $data);
            if (!xml_parse($xmlparser, $data, feof($fp))) {
                // error handling - try another file
                $xmlParsedOk = false;
            } else {
                $xmlParsedOk = true;
            }
        }
    }
    while (!$xmlParsedOk);
    xml_parser_free($xmlparser);
}








function XMLMapStartTag($parser, $name) {
global $storeValues;
    if ($name == "DOOR") {
    $storeValues = true;
    }
}
function XMLMapEndTag($parser, $name) {
    global $storeValues;
    $storeValues = false;
}
function XMLMapTagContents($parser, $data) {
    global $loadedDoorData, $storeValues;
    // remove whitespace from data:
   if($storeValues) {
   array_push($loadedDoorData, str_ireplace(" ", "", $data));
   }
}


function loadPreviouslyCreatedMap($whichMap) {
global $loadedDoorData, $storeValues;
    $loadedDoorData = array();
    $storeValues = false;
    $xmlparser = xml_parser_create();
    xml_set_element_handler($xmlparser, "XMLMapStartTag", "XMLMapEndTag");
    xml_set_character_data_handler($xmlparser, "XMLMapTagContents");
    
    $fp = fopen($whichMap, "r");
     while ($data = fread($fp, 4096)) {
            // remove whitespace:
            $data = eregi_replace(">" . "[[:space:]]+" . "<", "><", $data);
            if (!xml_parse($xmlparser, $data, feof($fp))) {
                // error handling #################
                
            } 
        }
    
    xml_parser_free($xmlparser);
      
}


function headForDest() {
    global $xDir, $yDir, $targetX, $targetY, $currX, $currY;
    // randomise horizontal or vertical preference:
    if (rand(0, 1) == 0) {
        if ($currX > $targetX) {
            $xDir = - 1;
            $yDir = 0;
        } else if ($currX < $targetX) {
            $xDir = 1;
            $yDir = 0;
        } else if ($currY > $targetY) {
            $xDir = 0;
            $yDir = - 1;
        } else if ($currY < $targetY) {
            $xDir = 0;
            $yDir = 1;
        }
    } else {
        if ($currY > $targetY) {
            $xDir = 0;
            $yDir = - 1;
        } else if ($currY < $targetY) {
            $xDir = 0;
            $yDir = 1;
        } else if ($currX > $targetX) {
            $xDir = - 1;
            $yDir = 0;
        } else if ($currX < $targetX) {
            $xDir = 1;
            $yDir = 0;
        }
    }
}
function randomTurn() {
    global $xDir, $yDir;
    // turn 90 in a random direction:
    if ($yDir == 0) {
        $xDir = 0;
        if (rand(0, 1) == 0) {
            $yDir = - 1;
        } else {
            $yDir = 1;
        }
    } elseif ($xDir == 0) {
        $yDir = 0;
        if (rand(0, 1) == 0) {
            $xDir = - 1;
        } else {
            $xDir = 1;
        }
    }
}
function markTunnel($tunnX, $tunnY) {
    global $dungeonMap, $xDir, $yDir, $width1, $width2, $globalTunnelWidth;
    $dungeonMap[$tunnX][$tunnY] = ".";
    // make tunnels wider if required:
    if ($globalTunnelWidth > 1) {
        // make tunnel widths randomly alternate in case the width is even:
        if (rand(0, 1) == 0) {
            $sideWidth1 = $width1;
            $sideWidth2 = $width2;
        } else {
            $sideWidth1 = $width2;
            $sideWidth2 = $width1;
        }
        if ($yDir == 0) {
            if ($sideWidth1 > 0) {
                // tunnel is travelling left or right
                for ($i = 1;$i <= $sideWidth1;$i++) {
                    $dungeonMap[$tunnX][$tunnY + $i] = ",";
                }
            }
            if ($sideWidth2 > 0) {
                for ($i = 1;$i <= $sideWidth2;$i++) {
                    $dungeonMap[$tunnX][$tunnY - $i] = ",";
                }
            }
        } else if ($xDir == 0) {
            // tunnel is travelling up or down
            if ($sideWidth1 > 0) {
                for ($i = 1;$i <= $sideWidth1;$i++) {
                    $dungeonMap[$tunnX + $i][$tunnY] = ",";
                }
            }
            if ($sideWidth2 > 0) {
                for ($i = 1;$i <= $sideWidth2;$i++) {
                    $dungeonMap[$tunnX - $i][$tunnY] = ",";
                }
            }
        }
    }
}
function abortScript() {
  // called when the script is getting close to timing out
  // default to a fully templated map so that flash has something to load:
  die("ABOUT TO TIMEOUT ==============================================================");
  // load a file from random ###########
  // outputDungeon();
}

function drawStairEndTunnel($thisCaseStartX,$thisCaseStartY,$horizLength,$vertLength,$caseRotation) {
global $dungeonMap;
// draw tunnel extending from both ends of the stairs in the same direction as the stair case to give them more meaning:

$tunnelVertLength = $vertLength;
$tunnelHorizLength = $horizLength;
// these supporting tunnels don't need to be too long:
if($vertLength>6) {
$tunnelVertLength = 6;
}
if($horizLength>6) {
$tunnelHorizLength = 6;
}



if ($caseRotation == 1) {
// horizontal stairs (as far as demo output is concerned)
$thisExitOffset = 0;
$thisEntranceOffset = 0;
for ($i = 0;$i < $tunnelVertLength;$i++) {
// exit block

$randomOffset = rand(0,7);
if($randomOffset==0) {
$thisExitOffset++;
} else if($randomOffset==1) {
$thisExitOffset--;
}
$randomOffset = rand(0,7);
if($randomOffset==0) {
$thisEntranceOffset=-1;
} else if($randomOffset==1) {
$thisEntranceOffset=1;
}
if($thisExitOffset<-1) {
$thisExitOffset = 0;
}
if($thisExitOffset>1) {
$thisExitOffset = 0;
}
if($thisEntranceOffset<-1) {
$thisEntranceOffset = 0;
}
if($thisEntranceOffset>1) {
$thisEntranceOffset = 0;
}

$dungeonMap[$thisCaseStartX+$thisExitOffset][$thisCaseStartY+$i+$vertLength] = ",";
$dungeonMap[$thisCaseStartX+1+$thisExitOffset][$thisCaseStartY+$i+$vertLength] = ",";
$dungeonMap[$thisCaseStartX+2+$thisExitOffset][$thisCaseStartY+$i+$vertLength] = ",";
// entrance block:


$dungeonMap[$thisCaseStartX+$thisEntranceOffset][$thisCaseStartY-$i-1] = ",";
$dungeonMap[$thisCaseStartX+1+$thisEntranceOffset][$thisCaseStartY-$i-1] = ",";
$dungeonMap[$thisCaseStartX+2+$thisEntranceOffset][$thisCaseStartY-$i-1] = ",";
}

// ensure that the tiles either side of the stairs are walkable:
$dungeonMap[$thisCaseStartX][$thisCaseStartY+$vertLength] = ",";
$dungeonMap[$thisCaseStartX+1][$thisCaseStartY+$vertLength] = ",";
$dungeonMap[$thisCaseStartX+2][$thisCaseStartY+$vertLength] = ",";
$dungeonMap[$thisCaseStartX][$thisCaseStartY-1] = ",";
$dungeonMap[$thisCaseStartX+1][$thisCaseStartY-1] = ",";
$dungeonMap[$thisCaseStartX+2][$thisCaseStartY-1] = ",";

} else {







$thisExitOffset = 0;
$thisEntranceOffset = 0;
for ($i = 0;$i < $tunnelHorizLength;$i++) {
// exit block

$randomOffset = rand(0,7);
if($randomOffset==0) {
$thisExitOffset--;
} else if($randomOffset==1) {
$thisExitOffset++;
}

$randomOffset = rand(0,7);
if($randomOffset==0) {
$thisEntranceOffset--;
} else if($randomOffset==1) {
$thisEntranceOffset++;
}
if($thisExitOffset<-1) {
$thisExitOffset = 0;
}
if($thisExitOffset>1) {
$thisExitOffset = 0;
}
if($thisEntranceOffset<-1) {
$thisEntranceOffset = 0;
}
if($thisEntranceOffset>1) {
$thisEntranceOffset = 0;
}


$dungeonMap[$thisCaseStartX+$horizLength+$i][$thisCaseStartY+$thisExitOffset] = ",";
$dungeonMap[$thisCaseStartX+$horizLength+$i][$thisCaseStartY+$thisExitOffset+1] = ",";
$dungeonMap[$thisCaseStartX+$horizLength+$i][$thisCaseStartY+$thisExitOffset+2] = ",";

// entrance block:


$dungeonMap[$thisCaseStartX-$i-1][$thisCaseStartY-$thisEntranceOffset] = ",";
$dungeonMap[$thisCaseStartX-$i-1][$thisCaseStartY-$thisEntranceOffset+1] = ",";
$dungeonMap[$thisCaseStartX-$i-1][$thisCaseStartY-$thisEntranceOffset+2] = ",";

}

// ensure that either side is walkable:
$dungeonMap[$thisCaseStartX+$horizLength][$thisCaseStartY] = ",";
$dungeonMap[$thisCaseStartX+$horizLength][$thisCaseStartY+1] = ",";
$dungeonMap[$thisCaseStartX+$horizLength][$thisCaseStartY+2] = ",";
$dungeonMap[$thisCaseStartX-1][$thisCaseStartY] = ",";
$dungeonMap[$thisCaseStartX-1][$thisCaseStartY+1] = ",";
$dungeonMap[$thisCaseStartX-1][$thisCaseStartY+2] = ",";


}





}


function makeTunnel($startX, $startY, $endX, $endY, $tunnelWidth, $bendyness, $calledFromLine) {
    global $dungeonMap, $tunnelMaxLength, $xDir, $yDir, $targetX, $targetY, $currX, $currY, $mapMaxWidth, $mapMaxHeight, $width1, $width2, $globalTunnelWidth, $startTime, $debugMode;

    $thisTime = time();
    $totalTimeSoFar = $thisTime - $startTime;
    if ($totalTimeSoFar>25) {
      abortScript();
    }

    $targetX = $endX;
    $targetY = $endY;
    $globalTunnelWidth = $tunnelWidth;
    $currX = $startX;
    $currY = $startY;
    // set up extra tunnel widths to be applied either side of the single tile tunnel:
    $width1 = floor($tunnelWidth / 2);
    $width2 = $tunnelWidth - 1 - $width1;
    $currTunnelLength = 1;
    markTunnel($startX, $startY);
    headForDest();
    $currX+= $xDir;
    $currY+= $yDir;
    do {
        // mark tunnel corridor's center
        markTunnel($currX, $currY);
        if (rand(1, $bendyness) == 1) {
            $oldXDir = $xDir;
            $oldYDir = $yDir;
            randomTurn();
            $tempX = $currX + $xDir;
            $tempY = $currY + $yDir;
            if (($tempX < $mapMaxWidth) && ($tempY < $mapMaxHeight) && ($tempX >= 0) && ($tempY >= 0)) {
                // make sure it hasn't gone out of bounds
                if ($dungeonMap[$tempX][$tempY] == ".") {
                    // already visited this location, so go straight ahead instead
                    $xDir = $oldXDir;
                    $yDir = $oldYDir;
                    headForDest();
                }
            }
        } else {
            headForDest();
        }
        $currX+= $xDir;
        $currY+= $yDir;
        // correct to keep within boundaries:
        if ($currX < ceil($tunnelWidth / 2) -1) {
          $currX = ceil($tunnelWidth / 2) -1;
        }
        if ($currY < ceil($tunnelWidth / 2) -1) {
          $currY = ceil($tunnelWidth / 2) -1;
        }
        if ($currX > $mapMaxWidth  - ceil($tunnelWidth / 2)) {
          $currX = $mapMaxWidth  - ceil($tunnelWidth / 2);
        }
        if ($currY > $mapMaxHeight  - ceil($tunnelWidth / 2)) {
          $currY = $mapMaxHeight  - ceil($tunnelWidth / 2);
        }
        $currTunnelLength++;
    }
    while (($currTunnelLength < $tunnelMaxLength) && (!(($currX == $targetX) && ($currY == $targetY))));
    // mark destination tile as well:
    markTunnel($currX, $currY);
    if($debugMode) {
     echo "tunnel length " . $currTunnelLength . " / " . $tunnelMaxLength . " from " . $calledFromLine . "<br />";
     }
    if ($currTunnelLength < $tunnelMaxLength) {
        return true;
    } else {
        return false;
    }
}
function drawFilledCircle($xp, $yp, $radius) {
    // thanks to http://actionsnippet.com/?p=496
    $xoff = 0;
    $yoff = $radius;
    $balance = - $radius;
    while ($xoff <= $yoff) {
        $p0 = $xp - $xoff;
        $p1 = $xp - $yoff;
        $w0 = $xoff + $xoff;
        $w1 = $yoff + $yoff;
        hLine($p0, $yp + $yoff, $w0);
        hLine($p0, $yp - $yoff, $w0);
        hLine($p1, $yp + $xoff, $w1);
        hLine($p1, $yp - $xoff, $w1);
        if (($balance+= $xoff++ + $xoff) >= 0) {
            $balance-= --$yoff + $yoff;
        }
    }
}
function hLine($xp, $yp, $w) {
    global $dungeonMap;
    for ($i = 0;$i < $w;$i++) {
        $dungeonMap[$xp + $i][$yp] = ".";
    }
}
function drawBresenhamCircle($xc, $yc, $r) {
    // draws circle outline
    global $dungeonMap;
    $x = 0;
    $y = $r;
    $p = 3 - 2 * $r;
    if (!$r) return;
    while ($y >= $x) {
        $dungeonMap[$xc - $x][$yc - $y] = ".";
        $dungeonMap[$xc - $y][$yc - $x] = ".";
        $dungeonMap[$xc + $y][$yc - $x] = ".";
        $dungeonMap[$xc + $x][$yc - $y] = ".";
        $dungeonMap[$xc - $x][$yc + $y] = ".";
        $dungeonMap[$xc - $y][$yc + $x] = ".";
        $dungeonMap[$xc + $y][$yc + $x] = ".";
        $dungeonMap[$xc + $x][$yc + $y] = ".";
        if ($p < 0) {
            $p+= 4 * $x + 6;
        } else {
            $p+= 4 * ($x - $y) + 10;
            $y--;
        }
        $x++;
    }
}
function drawCave($caveCentreX, $caveCentreY, $caveRadius) {
    // draw circles close togther/overlapping:
    for ($i = 0;$i < 3;$i++) {
        $thisCentreX = rand($caveCentreX - floor($caveRadius), $caveCentreX + $caveRadius);
        $thisCentreY = rand($caveCentreY - floor($caveRadius), $caveCentreY + $caveRadius);
        // find the maximum radius that this circle can be to keep it within the main cave's radius:
        $maxRadius = $caveRadius - sqrt(($caveCentreX - $thisCentreX) * (($caveCentreX - $thisCentreX)) + ($caveCentreY - $thisCentreY) * ($caveCentreY - $thisCentreY));
        // make sure this circle is a reasonable size, otherwise skip over it:
        if ($maxRadius > 3) {
            $thisRadius = rand(1, $maxRadius);
            drawFilledCircle($thisCentreX, $thisCentreY, $thisRadius);
            // tunnel from cave centre to this circle so that all these caves are connected:
            $tunnelSuccess = false;
            do {
                $tunnelSuccess = makeTunnel($caveCentreX, $caveCentreY, $thisCentreX, $thisCentreY, 1, 3, 378);
            }
            while (!$tunnelSuccess);
        }
    }
}
function markDoors($doorX, $doorY, $inOut) {
    // assumes a main tunnel width of 3:
    //
    global $dungeonMap, $heightMap, $mapMaxWidth, $mapMaxHeight, $entranceHeight, $exitHeight, $doorsOut, $doorsIn;
    if ($inOut == "in") {
        $heightToUse = $entranceHeight;
        array_push($doorsIn, $doorX.",".$doorY);
    } else {
        $heightToUse = $exitHeight;
        array_push($doorsOut,$doorX.",".$doorY);
    }
    $dungeonMap[$doorX][$doorY] = "O";
    $heightMap[$doorX][$doorY] = $heightToUse;
    if ($doorX == 0) {
        // north wall:
        $dungeonMap[$doorX][$doorY - 1] = "O";
        $dungeonMap[$doorX][$doorY + 1] = "O";
        
        
        
    if ($inOut == "in") {
        array_push($doorsIn, $doorX.",".($doorY-1));
        array_push($doorsIn, $doorX.",".($doorY+1));
    } else {
        array_push($doorsOut,$doorX.",".($doorY-1));
        array_push($doorsOut,$doorX.",".($doorY+1));
    }
        
        
        
        $dungeonMap[$doorX + 1][$doorY - 1] = ".";
        $dungeonMap[$doorX + 1][$doorY] = ".";
        $dungeonMap[$doorX + 1][$doorY + 1] = ".";
        // assign height to door and surrounding tiles:
        for ($offset = - 2;$offset <= 2;$offset++) {
            $heightMap[$doorX][$doorY + $offset] = $heightToUse;
            $heightMap[$doorX + 1][$doorY + $offset] = $heightToUse;
        }
    } else if ($doorX == ($mapMaxWidth - 1)) {
        // south wall:
        $dungeonMap[$doorX][$doorY - 1] = "O";
        $dungeonMap[$doorX][$doorY + 1] = "O";
        
        if ($inOut == "in") {
        array_push($doorsIn, $doorX.",".($doorY-1));
        array_push($doorsIn, $doorX.",".($doorY+1));
    } else {
        array_push($doorsOut,$doorX.",".($doorY-1));
        array_push($doorsOut,$doorX.",".($doorY+1));
    }
        
        
        $dungeonMap[$doorX - 1][$doorY - 1] = ".";
        $dungeonMap[$doorX - 1][$doorY] = ".";
        $dungeonMap[$doorX - 1][$doorY + 1] = ".";
        for ($offset = - 2;$offset <= 2;$offset++) {
            $heightMap[$doorX][$doorY + $offset] = $heightToUse;
            $heightMap[$doorX - 1][$doorY + $offset] = $heightToUse;
        }
    } else if ($doorY == 0) {
        // west wall:
        $dungeonMap[$doorX - 1][$doorY] = "O";
        $dungeonMap[$doorX + 1][$doorY] = "O";
        
        if ($inOut == "in") {
        array_push($doorsIn, ($doorX-1).",".$doorY);
        array_push($doorsIn, ($doorX+1).",".$doorY);
    } else {
        array_push($doorsOut,($doorX-1).",".$doorY);
        array_push($doorsOut,($doorX+1).",".$doorY);
    }
        
        $dungeonMap[$doorX - 1][$doorY + 1] = ".";
        $dungeonMap[$doorX][$doorY + 1] = ".";
        $dungeonMap[$doorX + 1][$doorY + 1] = ".";
        $heightMap[$doorX - 1][$doorY] = $heightToUse;
        $heightMap[$doorX + 1][$doorY] = $heightToUse;
        $heightMap[$doorX - 1][$doorY + 1] = $heightToUse;
        $heightMap[$doorX][$doorY + 1] = $heightToUse;
        $heightMap[$doorX + 1][$doorY + 1] = $heightToUse;
        for ($offset = - 2;$offset <= 2;$offset++) {
            $heightMap[$doorX + $offset][$doorY] = $heightToUse;
            $heightMap[$doorX + $offset][$doorY + 1] = $heightToUse;
        }
    } else if ($doorY == ($mapMaxHeight - 1)) {
        // east wall:
        $dungeonMap[$doorX - 1][$doorY] = "O";
        $dungeonMap[$doorX + 1][$doorY] = "O";
        
        if ($inOut == "in") {
        array_push($doorsIn, ($doorX-1).",".$doorY);
        array_push($doorsIn, ($doorX+1).",".$doorY);
    } else {
        array_push($doorsOut,($doorX-1).",".$doorY);
        array_push($doorsOut,($doorX+1).",".$doorY);
    }
        
        $dungeonMap[$doorX - 1][$doorY - 1] = ".";
        $dungeonMap[$doorX][$doorY - 1] = ".";
        $dungeonMap[$doorX + 1][$doorY - 1] = ".";
        for ($offset = - 2;$offset <= 2;$offset++) {
            $heightMap[$doorX + $offset][$doorY] = $heightToUse;
            $heightMap[$doorX + $offset][$doorY - 1] = $heightToUse;
        }
    }
}
function checkPathIsConnected($doorStartX, $doorStartY) {
    global $dungeonMap, $itemMap, $mapMaxWidth, $mapMaxHeight, $exitDoorX, $exitDoorY, $savedWalkableAreas;
    $connectionFound = false;
 

    $openList = array($doorStartX."_" . $doorStartY);
   

    $closedList = array();
    $stillWorking = true;
    do {
        if (count($openList) > 0) {
            $thisNode = array_pop($openList);
            // add to closed list:
            array_unshift($closedList, $thisNode);
            if ($thisNode == $exitDoorX . "_" . $exitDoorY) {
                // found exit door:
                $stillWorking = false;
                $connectionFound = true;
            } else {
                // add valid neighbours to the open list:
                $nodesPosition = explode("_", $thisNode);
                if ($nodesPosition[0] >= 1) {
                    // needs to be greater than 1 as 0 will be map edge and don't want to include these
                    if (($dungeonMap[($nodesPosition[0] - 1) ][$nodesPosition[1]] != "#") && ($dungeonMap[($nodesPosition[0] - 1) ][$nodesPosition[1]] != "~")) {
                        // is walkable - check it's not already been added:
                        if (!(in_array(($nodesPosition[0] - 1) . "_" . $nodesPosition[1], $closedList))) {
                            if (!(in_array(($nodesPosition[0] - 1) . "_" . $nodesPosition[1], $openList))) {
								if ($itemMap[($nodesPosition[0] - 1)][$nodesPosition[1]] == "") {
									array_unshift($openList, ($nodesPosition[0] - 1) . "_" . $nodesPosition[1]);
                                }
                            }
                        }
                    }
                }
                if ($nodesPosition[0] <= $mapMaxWidth - 2) {
                    if (($dungeonMap[($nodesPosition[0] + 1) ][$nodesPosition[1]] != "#") && ($dungeonMap[($nodesPosition[0] + 1) ][$nodesPosition[1]] != "~")) {
                        if (!(in_array(($nodesPosition[0] + 1) . "_" . $nodesPosition[1], $closedList))) {
                            if (!(in_array(($nodesPosition[0] + 1) . "_" . $nodesPosition[1], $openList))) {
                            if ($itemMap[($nodesPosition[0] + 1)][$nodesPosition[1]] == "") {
                                array_unshift($openList, ($nodesPosition[0] + 1) . "_" . $nodesPosition[1]);
                                }
                            }
                        }
                    }
                }
                if ($nodesPosition[1] >= 1) {
                    if (($dungeonMap[$nodesPosition[0]][($nodesPosition[1] - 1) ] != "#") && ($dungeonMap[$nodesPosition[0]][($nodesPosition[1] - 1) ] != "~")) {
                        if (!(in_array(($nodesPosition[0]) . "_" . ($nodesPosition[1] - 1), $closedList))) {
                            if (!(in_array(($nodesPosition[0]) . "_" . ($nodesPosition[1] - 1), $openList))) {
                            if ($itemMap[$nodesPosition[0]][($nodesPosition[1])-1] == "") {
                                array_unshift($openList, ($nodesPosition[0]) . "_" . ($nodesPosition[1] - 1));
                                }
                            }
                        }
                    }
                }
                if ($nodesPosition[1] <= $mapMaxHeight - 2) {
                    if (($dungeonMap[$nodesPosition[0]][($nodesPosition[1] + 1) ] != "#") && ($dungeonMap[$nodesPosition[0]][($nodesPosition[1] + 1) ] != "~")) {
                        if (!(in_array(($nodesPosition[0]) . "_" . ($nodesPosition[1] + 1), $closedList))) {
                            if (!(in_array(($nodesPosition[0]) . "_" . ($nodesPosition[1] + 1), $openList))) {
                            if ($itemMap[$nodesPosition[0]][($nodesPosition[1])+1] == "") {
                                array_unshift($openList, ($nodesPosition[0]) . "_" . ($nodesPosition[1] + 1));
                                }
                            }
                        }
                    }
                }
            }
        } else {
            // run out of open tiles:
            $stillWorking = false;
            $connectionFound = false;
        }
    }
    while ($stillWorking);
    
    // save closed list for item placement:
    $savedWalkableAreas = $closedList;
    
    return $connectionFound;
}
function floodFillHeight($startPointX, $startPointY, $heightToUse) {

    global $dungeonMap, $heightMap, $mapMaxWidth, $mapMaxHeight, $exitDoorX, $exitDoorY, $debugMode;
    $exitFound = false;
    $openList = array($startPointX . "_" . $startPointY);
    $closedList = array();
    $stillWorking = true;
    do {
        if (count($openList) > 0) {
            $thisNode = array_pop($openList);
            // add to closed list:
            array_unshift($closedList, $thisNode);
            if ($thisNode == $exitDoorX . "_" . $exitDoorY) {
                $exitFound = true;
            }
            // add valid neighbours to the open list:
            $nodesPosition = explode("_", $thisNode);
            $heightMap[$nodesPosition[0]][$nodesPosition[1]] = $heightToUse;
            
            
          if (($nodesPosition[0]>=0) && ($nodesPosition[1]>=0) && ($nodesPosition[0]<$mapMaxWidth) && ($nodesPosition[1]<$mapMaxHeight)) {
            
            
            // add neighbours if this is walkable:
            if (($dungeonMap[($nodesPosition[0]) ][($nodesPosition[1]) ] == ".") || ($dungeonMap[($nodesPosition[0]) ][($nodesPosition[1]) ] == ",")) {
                if ($nodesPosition[0] >= 1) {
                    // needs to be greater than 1 as 0 will be map edge and don't want to include these
                    // check it's not already been added:
                    if (!(in_array(($nodesPosition[0] - 1) . "_" . $nodesPosition[1], $closedList))) {
                        if (!(in_array(($nodesPosition[0] - 1) . "_" . $nodesPosition[1], $openList))) {
                            array_unshift($openList, ($nodesPosition[0] - 1) . "_" . $nodesPosition[1]);
                            if ($debugMode) {
                            echo "from ".$nodesPosition[0].",".$nodesPosition[1]." - adding to array: ".($nodesPosition[0] - 1).",".$nodesPosition[1]."<br />";
                            }
                        }
                    }
                }
                if ($nodesPosition[0] <= $mapMaxWidth - 2) {
                    if (!(in_array(($nodesPosition[0] + 1) . "_" . $nodesPosition[1], $closedList))) {
                        if (!(in_array(($nodesPosition[0] + 1) . "_" . $nodesPosition[1], $openList))) {
                            array_unshift($openList, ($nodesPosition[0] + 1) . "_" . $nodesPosition[1]);
                             if ($debugMode) {
                            echo "from ".$nodesPosition[0].",".$nodesPosition[1]." - adding to array: ".($nodesPosition[0] + 1).",".$nodesPosition[1]."<br />";
                            }
                        }
                    }
                }
                if ($nodesPosition[1] >= 1) {
                    if (!(in_array(($nodesPosition[0]) . "_" . ($nodesPosition[1] - 1), $closedList))) {
                        if (!(in_array(($nodesPosition[0]) . "_" . ($nodesPosition[1] - 1), $openList))) {
                            array_unshift($openList, ($nodesPosition[0]) . "_" . ($nodesPosition[1] - 1));
                             if ($debugMode) {
                            echo "from ".$nodesPosition[0].",".$nodesPosition[1]." - adding to array: ".($nodesPosition[0]).",".($nodesPosition[1]-1)."<br />";
                            }
                            
                        }
                    }
                }
                if ($nodesPosition[1] <= $mapMaxHeight - 2) {
                    if (!(in_array(($nodesPosition[0]) . "_" . ($nodesPosition[1] + 1), $closedList))) {
                        if (!(in_array(($nodesPosition[0]) . "_" . ($nodesPosition[1] + 1), $openList))) {
                            array_unshift($openList, ($nodesPosition[0]) . "_" . ($nodesPosition[1] + 1));
                             if ($debugMode) {
                              echo "from ".$nodesPosition[0].",".$nodesPosition[1]." - adding to array: ".($nodesPosition[0]).",".($nodesPosition[1]+1)."<br />";
                              }
                        }
                    }
                }
                
                
                
                
               if (($nodesPosition[0] >= 1) && ($nodesPosition[1] >= 1)) {
                    if (!(in_array(($nodesPosition[0]-1) . "_" . ($nodesPosition[1] - 1), $closedList))) {
                        if (!(in_array(($nodesPosition[0]-1) . "_" . ($nodesPosition[1] - 1), $openList))) {
                            array_unshift($openList, ($nodesPosition[0]-1) . "_" . ($nodesPosition[1] - 1));
                            
                        }
                    }
                }
                
               if (($nodesPosition[0] >= 1) && ($nodesPosition[1] <= $mapMaxHeight - 2)) {
                    if (!(in_array(($nodesPosition[0]-1) . "_" . ($nodesPosition[1] + 1), $closedList))) {
                        if (!(in_array(($nodesPosition[0]-1) . "_" . ($nodesPosition[1] + 1), $openList))) {
                            array_unshift($openList, ($nodesPosition[0]-1) . "_" . ($nodesPosition[1] + 1));
                            
                        }
                    }
                }
                
                 if (($nodesPosition[0] <= $mapMaxWidth - 2) && ($nodesPosition[1] >= 1)) {
                    if (!(in_array(($nodesPosition[0]+1) . "_" . ($nodesPosition[1] + 1), $closedList))) {
                        if (!(in_array(($nodesPosition[0]+1) . "_" . ($nodesPosition[1] + 1), $openList))) {
                            array_unshift($openList, ($nodesPosition[0]+1) . "_" . ($nodesPosition[1] + 1));
                            
                        }
                    }
                }
                
                     if (($nodesPosition[0] <= $mapMaxWidth - 2) && ($nodesPosition[1] <= $mapMaxHeight - 2)) {
                    if (!(in_array(($nodesPosition[0]+1) . "_" . ($nodesPosition[1] - 1), $closedList))) {
                        if (!(in_array(($nodesPosition[0]+1) . "_" . ($nodesPosition[1] - 1), $openList))) {
                            array_unshift($openList, ($nodesPosition[0]+1) . "_" . ($nodesPosition[1] - 1));
                            
                        }
                    }
                }
                
                
                
                
           }
           }
        } else {
            // run out of open tiles:
            $stillWorking = false;
        }
    }
    while ($stillWorking);
    // if the exit then might need to abort this map as the stairs can be by-passed:
    return $exitFound;
}

function outputDungeon() {
  global $dungeonMap, $dungeonOutputMap, $heightMap, $itemMap, $npcMap, $mapMaxHeight, $mapMaxWidth, $thisDungeonsName, $thisMapsId, $thisPlayersId, $thisAverageCount, $thisAverageTotal, $doorsOut, $doorsIn, $dungeonDetails, $thisOriginatingMapId, $outputMode, $allStairs, $stairsWidth, $entranceHeight, $tileHeight, $itemsAvailable, $isTreasureMapLevel, $startTime, $treasureLocX, $treasureLocY, $templateTiles, $mapMode, $topLeftXPos, $topLeftYPos, $levelLockedNPCs, $turning, $whichDirectionToTurn, $NPCsAlreadyPlaced, $templatesAlreadyPlaced, $levelLockedTemplatesAlreadyPlaced, $templateChosen, $levelLockedTemplateChosen;


  if ($outputMode == "test") {
  echo '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">' . "\n";
echo '<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">' . "\n";
echo '<head>' . "\n";
    echo '<meta content="text/html; charset=iso-8859-1" http-equiv="content-type" />' . "\n";
    echo '<meta content="no" http-equiv="imagetoolbar" />' . "\n";
    echo '<meta content="TRUE" name="MSSmartTagsPreventParsing" />' . "\n";
    echo '<meta name="robots" content="noodp" />' . "\n";
    echo '<title>Autumn Earth - random map</title>' . "\n";
    echo '<meta name="keywords" content="" />' . "\n";
    echo '<meta name="description" content="" />' . "\n";
    echo '<meta http-equiv="content-language" content="en" />' . "\n";
    echo '<meta name="language" content="english" />' . "\n";
echo '</head>' . "\n";
echo '<body style="background: #000; color: #fff;">' . "\n";
  

  echo '<code><pre style="font-family: courier; line-height: 0.75em;">' . "\n";
  
  
  
  $dungeonMap[0][0]="1";
  $dungeonMap[($mapMaxWidth-1)][0]="2";
  $dungeonMap[($mapMaxWidth-1)][($mapMaxHeight-1)]="3";
  $dungeonMap[0][($mapMaxHeight-1)]="4";

 
  for ($j = 0;$j < $mapMaxHeight;$j++) {
    for ($i = 0;$i < $mapMaxWidth;$i++) {
    
      if ($itemMap[$i][$j] != "") {
       echo "<span style=\"color:#8B600D;\">".$itemMap[$i][$j]."</span>";
       } else if ($npcMap[$i][$j] == "n") {
       echo "<span style=\"color:#ffffff;\">n</span>";
       
       }else if ($npcMap[$i][$j] == "n-0") {
        echo "<span style=\"color:#00ff00;\">N</span>";
      } else {
      // show height of this tile (lighter = higher):
      switch ($heightMap[$i][$j]) {
        case "0":
            $thisHeightCol = "909090";
        break;
        case "1":
            $thisHeightCol = "999898";
        break;
        case "2":
            $thisHeightCol = "A1A0A0";
        break;
        case "3":
            $thisHeightCol = "ABAAAA";
        break;
        case "4":
            $thisHeightCol = "B4B4B4";
        break;
        case "5":
            $thisHeightCol = "BDBCBC";
        break;
        case "6":
            $thisHeightCol = "C6C5C5";
        break;
        case "7":
            $thisHeightCol = "CFCFCF";
        break;
        case "8":
            $thisHeightCol = "D9D8D8";
        break;
        case "9":
            $thisHeightCol = "E2E2E2";
        break;
        case "10":
            $thisHeightCol = "ECEBEB";
        break;
        case "11":
            $thisHeightCol = "F5F5F5";
        break;
        case "12":
            $thisHeightCol = "ffffff";
        break;
        default:
            $thisHeightCol = "463F3F";
      }
      if($isTreasureMapLevel) {
      if($j == $treasureLocY) {
      if($i == $treasureLocX) {
      $thisHeightCol = "FFFFFF";
      }
      }
      }
      echo '<span style="color:#' . $thisHeightCol . ';">';
      echo $dungeonMap[$i][$j];
      echo '</span>';
      }
    }
  echo "<br />";
}
echo "</pre></code>" . "\n";

echo '</body>'. "\n";
echo '</html>' . "\n";
}

// copy dungeon map for XML creation:





      $dungeonOutputMap = array();
       
        for ($i = 0;$i < $mapMaxWidth;$i++) {
            $dungeonOutputMap[$i] = array();
            
            for ($j = 0;$j < $mapMaxHeight;$j++) {
                $dungeonOutputMap[$i][$j] = "";
            
            }
           }
           
           

    for ($i = 0;$i < $mapMaxWidth;$i++) {
    for ($j = 0;$j < $mapMaxHeight;$j++) {
                $dungeonOutputMap[$i][$j] = $dungeonMap[$i][$j];
                if (($dungeonOutputMap[$i][$j] == ".") || ($dungeonOutputMap[$i][$j] == ",")) {
                // walkable tile:
                  $dungeonOutputMap[$i][$j] = "2";
                }
            }
        }

// convert walls to be flat or tall depending on whether they're in front a walkable tile or not

for ($i = ($mapMaxWidth-1);$i >= 0;$i--) {
for ($j = ($mapMaxHeight-1);$j >= 0;$j--) {
    if ($dungeonOutputMap[$i][$j] == "#") {
    // check to see if tiles above or to the side are walkable:
    if (  (tileIsWalkable($i-1,$j)) || (tileIsWalkable($i-1,$j+1)) || (tileIsWalkable($i,$j+1)) ) {
 
     
     $dungeonOutputMap[$i][$j] = "100";
     } else {
     $dungeonOutputMap[$i][$j] = "120";
     }
    }
    
    }
    }



// find blank tiles (tiles completely surrounded by non-walkable tiles):
 for ($i = 0;$i < $mapMaxWidth;$i++) {
  for ($j = 0;$j < $mapMaxHeight;$j++) {
  if(   (tileIsSurrounded($i-1,$j))  && (tileIsSurrounded($i+1,$j))  && (tileIsSurrounded($i-1,$j-1))  && (tileIsSurrounded($i-1,$j+1))  && (tileIsSurrounded($i+1,$j-1)) && (tileIsSurrounded($i+1,$j+1)) && (tileIsSurrounded($i,$j-1))  && (tileIsSurrounded($i,$j+1))      ) {
  $dungeonOutputMap[$i][$j] = "999";
  }
  }
  }



// draw stairs:
$stairsWidth = 3;
for ($i = 0;$i < count($allStairs);$i++) {
  $thisCaseStartX = $allStairs[$i][0];
  $thisCaseStartY = $allStairs[$i][1];
  $thisCaseLength = $allStairs[$i][2];
  $caseRotation = $allStairs[$i][3];
  if ($caseRotation == 0) {
    $horizLength = $thisCaseLength;
    $vertLength = $stairsWidth;
    // this StairsBase is the corresponding first frame in the tile set in Flash for this direction of stairs:
    $stairsBase = 580;
    $heightOffset = $thisCaseLength;
    for ($j = 0;$j < $horizLength;$j++) {
      for ($k = 0;$k < $vertLength;$k++) {
        $thisStairTile = $stairsBase + $heightOffset -1;
        $dungeonOutputMap[($thisCaseStartX + $j) ][($thisCaseStartY + $k) ] = $thisStairTile; 
      }
      $heightOffset --;
    }
  } else {
    $horizLength = $stairsWidth;
    $vertLength = $thisCaseLength;
    $stairsBase = 560;
    $heightOffset = $thisCaseLength;
    for ($j = 0;$j < $horizLength;$j++) {
      for ($k = 0;$k < $vertLength;$k++) {
        $thisStairTile = $stairsBase + $heightOffset -1;
        $dungeonOutputMap[($thisCaseStartX + $j) ][($thisCaseStartY - $k) ] = $thisStairTile;
        $heightOffset --;
      }
      $heightOffset = $thisCaseLength;
    }
  }
}







if($mapMode=="template") {

// insert the template tiles here - so that the dungeon walls get averaged in smoothly

$templateWidth = count($templateTiles);
$templateHeight = count(explode(",",$templateTiles[0]));



for ($ti = 0;$ti < $templateWidth;$ti++) {
  $thisRow = explode(",",$templateTiles[$ti]);
  for ($tj = 0;$tj < $templateHeight;$tj++) {
    $dungeonOutputMap[($tj + $topLeftXPos) ][($ti + $topLeftYPos) ] = $thisRow[$tj];
  }
}


}





// average out transitions between flat front non-walkable tiles and tall background non-walkable tiles:
for ($k = 0; $k<2; $k++) {
  // iterate this to sequentially average out the values
  $averageMap = array();
  for ($i = 0;$i < $mapMaxWidth;$i++) {
  $averageMap[$i] = array();
  for ($j = 0;$j < $mapMaxHeight;$j++) {
  $averageMap[$i][$j] = "";
  }
  }
  for ($i = 0;$i < $mapMaxWidth;$i++) {
  for ($j = 0;$j < $mapMaxHeight;$j++) {
  // if it's a nonwalkable tile, not a stairs tile or a blanked tile:
  if (($dungeonOutputMap[$i][$j] >= 100) && ($dungeonOutputMap[$i][$j] < 500)) {
  $thisAverageCount = 0;
  $thisAverageTotal = 0;
  checkAverageNeighbours($i-1,$j,$dungeonOutputMap[$i][$j]);
  checkAverageNeighbours($i+1,$j,$dungeonOutputMap[$i][$j]);
  checkAverageNeighbours($i-1,$j-1,$dungeonOutputMap[$i][$j]);
  checkAverageNeighbours($i+1,$j-1,$dungeonOutputMap[$i][$j]);
  checkAverageNeighbours($i-1,$j+1,$dungeonOutputMap[$i][$j]);
  checkAverageNeighbours($i+1,$j+1,$dungeonOutputMap[$i][$j]);
  checkAverageNeighbours($i,$j-1,$dungeonOutputMap[$i][$j]);
  checkAverageNeighbours($i,$j+1,$dungeonOutputMap[$i][$j]);
  if ($thisAverageTotal>0) {
  $averageMap[$i][$j] = floor(($thisAverageTotal/$thisAverageCount));
  } 
  } else {
  $averageMap[$i][$j] = "";
  }
  }
  }
  for ($i = 0;$i < $mapMaxWidth;$i++) {
  for ($j = 0;$j < $mapMaxHeight;$j++) {
  if($averageMap[$i][$j] != "") {
  // apply new average height:
  $dungeonOutputMap[$i][$j] = $averageMap[$i][$j];
  }
  }
  }
}


// check height map and raise levels appropriately:
// first tile is on frame 600, but height of '1' will need to be tile 600:
$raisedBase = 599;

 for ($i = 0;$i < $mapMaxWidth;$i++) {
    for ($j = 0;$j < $mapMaxHeight;$j++) {
     
     if(($dungeonOutputMap[$i][$j] == "2") || ($dungeonOutputMap[$i][$j] == "O")) {
     // is walkable - add height if required:
     if($heightMap[$i][$j]>0) {
     $dungeonOutputMap[$i][$j] = $heightMap[$i][$j]+$raisedBase;
     }
     
     } else if (($dungeonOutputMap[$i][$j] >= 100) && ($dungeonOutputMap[$i][$j] < 500)) {
     // is a wall tile, raise these up as well:
     if($heightMap[$i][$j]>0) {
     $dungeonOutputMap[$i][$j] += ($heightMap[$i][$j]*30);
     }
    
     }

      
}
}


$atLeastOneCart = false;
// see if a 'mine cart' can be placed in an open space:
for ($i = 0;$i < 10;$i++) {
$mineCartPlaced = true;

$tryTileX = rand(2,($mapMaxWidth-3));
$tryTileY = rand(2,($mapMaxHeight-3));
for($tx = $tryTileX-1; $tx <= $tryTileX+1; $tx++) {
for($ty = $tryTileY-1; $ty <= $tryTileY+1; $ty++) {
if($dungeonOutputMap[$tx][$ty] != "2") {
$mineCartPlaced = false;
}
}
}
if($mineCartPlaced) {
$dungeonOutputMap[$tryTileX][$tryTileY] = 505;
$atLeastOneCart = true;
//break;
}
}


/*
   for ($i = 0;$i < $mapMaxWidth;$i++) {
    for ($j = 0;$j < $mapMaxHeight;$j++) {
               if($dungeonOutputMap[$i][$j] == "2") {
               // randomly mix up the walkable tiles:
               if(rand(0,6)==0) {
               $dungeonOutputMap[$i][$j] = rand(3,7);
               }
               }
                }
                }
*/



// create string so it can be output immediately for Flash to read, and then saved for later recall
$outputString = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><map mname=\"".str_ireplace("-"," ",$thisDungeonsName)."\" inside=\"f\" maxheight=\"".($entranceHeight*$tileHeight)."\">\n";
 
for ($i = 0;$i < $mapMaxWidth;$i++) {
$outputString .= "<row>";
for ($j = 0;$j < $mapMaxHeight;$j++) {
  if($dungeonOutputMap[$i][$j] == "999") {
    // add blank tile:
    $outputString .= "1,";
  } else {
    // add feature tile:
    if($dungeonOutputMap[$i][$j]=="O") {
    // is a door - create hero walkable tile here:
    $outputString .= "8,";
  } else {
    $outputString .= $dungeonOutputMap[$i][$j].",";
  }
  }
}
// remove final comma:
$outputString = substr($outputString, 0, -1);
$outputString .= "</row>\n";
}
    
    
    for ($j = 0;$j < $mapMaxHeight;$j++) {
   $outputString .= "<farm>-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-</farm>\n";
    }
    
    
    
    // re do loop for npcs:
       for ($i = 0;$i < $mapMaxWidth;$i++) {
    for ($j = 0;$j < $mapMaxHeight;$j++) {
   if($npcMap[$i][$j] != "") {
 //  if(rand(0,6) == 0) {
 //      $outputString .= "<npc>0.25,1,2,".$i.",".$j.",0,-1,0,0,0,golem,0,4.3,10,11,4</npc>\n";
  //     } else {
  
  
  // check for level locked NPC:
  
  $llnpc = strrpos($npcMap[$i][$j], "n-");
  
  if ($llnpc !== false) {
  // add specific NPC - get id:
  $npcId = substr($npcMap[$i][$j], ($llnpc+2));
  



  $outputString .= "<npc>".$levelLockedNPCs[$npcId]."</npc>\n";

  
  } else if($atLeastOneCart) {
  // mine and return to cart:
   $outputString .= "<npc>1,2,1,".$i.",".$j.",0,-1,P105-120#acaryAdigg3#P505-505#rAdrop3#x,0,0,dwarven miner,0,4.3,10,11,1,2,3</npc>\n";
     
  } else {
  // just find wall and mine:
       $outputString .= "<npc>1,2,1,".$i.",".$j.",0,-1,P105-120#Adigg999#x,0,0,dwarven miner,0,4.3,10,11,1,2,3</npc>\n";
       }
 
       
  //    }
   }
   }
   }
    
    
    // re do loop for items:


$hasPlacedATreasureMap = false;

    for ($i = 0;$i < $mapMaxWidth;$i++) {
    for ($j = 0;$j < $mapMaxHeight;$j++) {
   if($itemMap[$i][$j] != "") {
   $itemHeight = 0;
   if($heightMap[$i][$j]>0) {
   $itemHeight = $tileHeight*$heightMap[$i][$j];
   
   

   
   }
   if($itemMap[$i][$j] == "22") {
   // it's a chest - build contents:
   $chestSize = rand(1,4);
   $numberOfItems = rand(1,$chestSize);
   $chestContents = "";
   for ($k = 0;$k < $numberOfItems;$k++) {
   $thisQuantity = rand(1,3);
   do {
   // pick a random type from this dungeon's possible items - as long as it's not another chest: (don't place treasure maps in a map that is the destination for another treasure map)
        $thisItemType = $itemsAvailable[(rand(0,count($itemsAvailable)-1))];
   } while (($thisItemType=="22") || (($thisItemType=="35") && $hasPlacedATreasureMap) || (($isTreasureMapLevel) && ($thisItemType=="35")));
  
  if($thisItemType=="35") {
  $hasPlacedATreasureMap = true;
  $thisQuantity = 1;
  }
  
  $chestContents .= $thisItemType.".".$thisQuantity.".4.100.4.-1.0.0.0.0.-|";
  
   }
   for ($k = $numberOfItems;$k < $chestSize;$k++) {
   // fill remainder with empty slots:
  $chestContents .= "1.0.0.0.0.0.0.0.0.0.-|";
   }
   
   // remove final "|":
   $chestContents = substr($chestContents, 0, -1);
   
   // determine this chest's facing:
   // (facing - 1 = towards SW, 2 = towards SE, 3 = towards NE, 4 = towards NW)
 $thisFacing = "1";

$tileSouthIsWalkable = isEmptyTile($i,$j+1);
 $tileNorthIsWalkable = isEmptyTile($i,$j-1);  
 $tileEastIsWalkable = isEmptyTile($i+1,$j);  
 $tileWestIsWalkable = isEmptyTile($i-1,$j); 
 
 
 
if (!$tileNorthIsWalkable) {
  if (!$tileWestIsWalkable) {
    if ($tileSouthIsWalkable) {
      $thisFacing = "1";
    } else {
      $thisFacing = "2";
    }
  } else if (!$tileEastIsWalkable) {
    if ($tileWestIsWalkable) {
      $thisFacing = "4";
    } else {
      $thisFacing = "1";
    }
  } 
} else if (!$tileSouthIsWalkable) {
  if (!$tileWestIsWalkable) {
    if ($tileEastIsWalkable) {
      $thisFacing = "2";
    } else {
      $thisFacing = "1";
    }
  } else if (!$tileEastIsWalkable) {
    if ($tileNorthIsWalkable) {
      $thisFacing = "1";
    } else {
      $thisFacing = "4";
    }
  } 
}
 
  
   
   $outputString .= "<item>".$i.",".$j.",".$itemMap[$i][$j].",".$thisFacing.",".$itemHeight.",".$chestContents."</item>";
   } else if($itemMap[$i][$j] == "35") {
   if (!($hasPlacedATreasureMap) && (!$isTreasureMapLevel)) {
   // it's a treasure map:
   // dungeon id (randomDungeons array in Flash - this is found with $dungeonDetails[$thisDungeonsName][5]), map level, tile x, tile y
   // in format: 1R15|x|y so that it splits on | as conventional treasure maps do
   
   // find target map - make sure it doesn't already exist (might have already been created as a another treasure containing map)
    $treasureDepthInc = 5;
   do {
    $newTargetTreasureMap = $thisMapsId - (rand(2,$treasureDepthInc));
    

    
    $treasureMapFilename = "data/chr" . $thisPlayersId . "/dungeon/".$thisDungeonsName."/" . $newTargetTreasureMap . ".xml";
   // increase depth to get deeper if map already exists:
   $treasureDepthInc += 5;
   } while(is_file($treasureMapFilename));
   
   
   
    $treasuresLocX = rand(8,($mapMaxWidth-8));
    $treasuresLocY = rand(8,($mapMaxHeight-8));
   
   $thisTreasureLocation=$dungeonDetails[$thisDungeonsName][5]."R".$newTargetTreasureMap."|".$treasuresLocX."|".$treasuresLocY;
   $outputString .= "<item>".$i.",".$j.",35,1,".$itemHeight.",35.1.4.100.4.-1.0.".$thisTreasureLocation.".0.0.0</item>";
   $hasPlacedATreasureMap = true;
   } else {
   // choose another item type:
      do {
  // while not a chest or treasure map:
        $thisItemType = $itemsAvailable[(rand(0,count($itemsAvailable)-1))];
   } while ($thisItemType=="22" || $thisItemType == "35");
   $outputString .= "<item>".$i.",".$j.",".$thisItemType.",1,".$itemHeight.",0</item>";
   }
   
   
   
   } else {
   $outputString .= "<item>".$i.",".$j.",".$itemMap[$i][$j].",1,".$itemHeight.",0</item>";
   }
   }
    }
    }


    
    
    // write entrance doors:
    
    
    // sort doors arrays to be ascending order so that they correspond correctly (need to re-assign keys for the sorted array as well
sort($doorsIn);
$doorsIn = array_values($doorsIn);
sort($doorsOut);
$doorsOut = array_values($doorsOut);
    
    
    
    if($thisMapsId == -1) {
      // first map, set entrance doors' targets to hard-coded values (those back to the outside of the dungeon):
      for ($doorLoop=0; $doorLoop<count($doorsIn); $doorLoop++) {

      $outputString .= "<door>";
      $outputString .= $dungeonDetails[$thisDungeonsName][0].",";
      $outputString .= $doorsIn[$doorLoop].",";
      $outputString .= $dungeonDetails[$thisDungeonsName][2][$doorLoop].",0";
      $outputString .= "</door>";
      }
    } else {
    // write door positions implied from what was passed from flash:
      for ($doorLoop=0; $doorLoop<count($doorsIn); $doorLoop++) {

      $outputString .= "<door>";
      $outputString .= $thisOriginatingMapId.",";
      $outputString .= $doorsIn[$doorLoop].",";

      $doorArray = explode(",",$doorsIn[$doorLoop]);
      $doorX = $doorArray[0];
      $doorY = $doorArray[1];
      $outputStartDoorX = $doorX;
      $outputStartDoorY = $doorY;
      if ($doorX == 0) {
      // north wall:
      $outputStartDoorX = ($mapMaxWidth - 2);
      } else if ($doorX == ($mapMaxWidth - 1)) {
      // south wall:
      $outputStartDoorX = 1;
      }
      if ($doorY == 0) {
      // west wall:
      $outputStartDoorY = ($mapMaxHeight - 2);
      } else if ($doorY == ($mapMaxHeight - 1)) {
      // east wall:
      $outputStartDoorY = 1;
      }
      
      // doors back to a previous level will start the hero at height level 0:
      $outputString .= $outputStartDoorX.",".$outputStartDoorY.",0";
      
      $outputString .= "</door>";
      }
  
  
    }
    
    // write exit doors:

  
    
    
    for ($doorLoop=0; $doorLoop<count($doorsOut); $doorLoop++) {
      $outputString .= "<door>";
      $outputString .= ($thisMapsId-1).",";
      $outputString .= $doorsOut[$doorLoop].",";
      // work out corresponding start positions on the next map:
      
      $doorArray = explode(",",$doorsOut[$doorLoop]);
      $doorX = $doorArray[0];
      $doorY = $doorArray[1];
      
    
      
      $newStartDoorX = $doorX;
      $newStartDoorY = $doorY;
      
    
if ($doorX == 0) {
// north wall:
$newStartDoorX = ($mapMaxWidth - 2);
} else if ($doorX == ($mapMaxWidth - 1)) {
// south wall:
$newStartDoorX = 1;
}
if ($doorY == 0) {
// west wall:
$newStartDoorY = ($mapMaxHeight - 2);
} else if ($doorY == ($mapMaxHeight - 1)) {
// east wall:
$newStartDoorY = 1;
}



// don't know what the start height on the next map will be yet:
      $outputString .= $newStartDoorX.",".$newStartDoorY.",-1";
      
      
      $outputString .= "</door>";
      }
    
    if ($outputMode == "xml") {
    
    
    $outputString .= "<weather>1</weather></map>";

if (!$isTreasureMapLevel) {
// echo for immediate use by Flash: (treasure maps only need creating ready for flash, not passing back for immediate use)
echo $outputString;
}
// write this to file:

        $mapFilename = "data/chr" . $thisPlayersId . "/dungeon/".$thisDungeonsName."/" . $thisMapsId . ".xml";
        
	if(!($filename=fopen($mapFilename,"w"))) {
			// error handling?
		}
		
		fwrite($filename, $outputString); 
		fclose($filename);
		
		
		
		
		
		// update session details:
		  if($turning !=0) {
            // this map did turn:
            $whichDirectionToTurn = 0-$whichDirectionToTurn;
            }
            
            if($templateChosen != "") {
            // template has been used:
             array_push($templatesAlreadyPlaced, $templateChosen);
   }
   
   
   
     if($levelLockedTemplateChosen != "") {
            // template has been used:
             array_push($levelLockedTemplatesAlreadyPlaced, $levelLockedTemplateChosen);
   }
            
            
            $sessionOutput = '<?php'."\n";
$sessionOutput .= '// alternate which direction maps turn so don\'t double back and cross:'."\n";
$sessionOutput .= '$whichDirectionToTurn = '.$whichDirectionToTurn.';'."\n";
$sessionOutput .= '// save templates placed:'."\n";

$sessionArray = "";
if(count($templatesAlreadyPlaced)>0) {
$sessionArray = '"'.implode('","',$templatesAlreadyPlaced).'"';
}

$sessionOutput .= '$templatesAlreadyPlaced = array('.$sessionArray.');'."\n";
$sessionOutput .= '// save level locked NPCs placed:'."\n";
$sessionOutput .= '$NPCsAlreadyPlaced = array('.implode(',',$NPCsAlreadyPlaced).');'."\n";
$sessionOutput .= '// save level locked templates placed:'."\n";



$sessionArray = "";
if(count($levelLockedTemplatesAlreadyPlaced)>0) {
$sessionArray = '"'.implode('","',$levelLockedTemplatesAlreadyPlaced).'"';
}

$sessionOutput .= '$levelLockedTemplatesAlreadyPlaced = array('.$sessionArray.');'."\n";
$sessionOutput .= '?>';


		
		$sessionFilename = "data/chr" . $thisPlayersId . "/dungeon/".$thisDungeonsName."/session.inc";    
	if(!($sessionFilename=fopen($sessionFilename,"w"))) {
			// error handling?
		}
		fwrite($sessionFilename, $sessionOutput); 
		fclose($sessionFilename);
		
	
		
}

if ($hasPlacedATreasureMap) {
 // create the target treasure map now, so that it's ready for flash when needed to draw the treasure map hint graphic:
 // reset timer for new map:
 $startTime = time();

 $thisOriginatingMapId = ($newTargetTreasureMap+1);
$thisMapsId = $newTargetTreasureMap;
  $isTreasureMapLevel = true;
  $treasureLocX = $treasuresLocX;
  $treasureLocY = $treasuresLocY;
  
  createNewDungeonMap($thisMapsId);
 
 
}


        
}

function isEmptyTile($tileCheckX,$tileCheckY) {
  global $dungeonOutputMap, $mapMaxHeight, $mapMaxWidth, $itemMap;
  if($tileCheckX>=0) {
    if($tileCheckY>=0) {
      if($tileCheckX<$mapMaxWidth) {
      if($tileCheckY<$mapMaxHeight) { 
        if($dungeonOutputMap[$tileCheckX][$tileCheckY] < 100) {
          // is walkable tile
          if($itemMap[$tileCheckX][$tileCheckY] =="") {
            return true;
          }
        }
      }
      }
    }
  }
  return false;
}

function checkAverageNeighbours($tileCheckX,$tileCheckY,$currentTileValue) {
  global $dungeonOutputMap, $mapMaxHeight, $mapMaxWidth, $thisAverageCount, $thisAverageTotal;
  if($tileCheckX>=0) {
    if($tileCheckY>=0) {
      if($tileCheckX<$mapMaxWidth) {
        if($tileCheckY<$mapMaxHeight) {  
          if($dungeonOutputMap[$tileCheckX][$tileCheckY] >= 100) {
           
           if($dungeonOutputMap[$tileCheckX][$tileCheckY] == "999") {
            // is a blank tile - this should increase the height of 120 tiles, but not affect 100 tiles:
            if($currentTileValue >= 110) {
            $thisAverageCount++;
              $thisAverageTotal += $currentTileValue;    
            }
           } else if($dungeonOutputMap[$tileCheckX][$tileCheckY] < 360) {
           // ...and it's not a stairs or elevated tile:
              $thisAverageCount++;
              $thisAverageTotal += $dungeonOutputMap[$tileCheckX][$tileCheckY]; 
              }      
            
          }
        }
      }               
    } 
  }
}

function tileIsWalkable($tileCheckX,$tileCheckY) {
 global $dungeonOutputMap, $mapMaxHeight, $mapMaxWidth;
  $thisTileIsWalkable = false;


if($tileCheckX>=0) {
    if($tileCheckY>=0) {
      if($tileCheckX<$mapMaxWidth) {
        if($tileCheckY<$mapMaxHeight) {
          if($dungeonOutputMap[$tileCheckX][$tileCheckY] == "2") {
            $thisTileIsWalkable = true;
          }
  
}
}
}
}

return $thisTileIsWalkable;

}

function tileIsSurrounded($tileCheckX,$tileCheckY) {
  global $dungeonOutputMap, $mapMaxHeight, $mapMaxWidth;
  $thisTileIsSurrounded = false;
  if($tileCheckX>=0) {
    if($tileCheckY>=0) {
      if($tileCheckX<$mapMaxWidth) {
        if($tileCheckY<$mapMaxHeight) {
          if($dungeonOutputMap[$tileCheckX][$tileCheckY] > 10){
            $thisTileIsSurrounded = true;
          }
        } else {
          // is outside of the map, and therefore counts as bounding the tile being checked:
          $thisTileIsSurrounded = true;
        }
      } else {
        $thisTileIsSurrounded = true;
      }
    } else {
      $thisTileIsSurrounded = true;
    }
  } else {
    $thisTileIsSurrounded = true;
  }
  return $thisTileIsSurrounded;
}

function placeItemsandNPCs() {

  global $dungeonMap, $itemMap, $npcMap, $mapMaxHeight, $mapMaxWidth, $savedWalkableAreas, $startTime, $dungeonDetails, $thisDungeonsName, $itemsAvailable, $thisMapsId, $levelLockedNPCs, $npcPositionsTaken, $isAValidItemPosition, $nodesPosition, $NPCsAlreadyPlaced, $templatesAlreadyPlaced, $levelLockedTemplatesAlreadyPlaced;

   $itemChance = $dungeonDetails[$thisDungeonsName][3];
   $itemsAvailable = $dungeonDetails[$thisDungeonsName][4];
   
  $numberOfItems = $itemChance[(rand(0,count($itemChance)-1))];
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  $levelLockedNPCs = array();
  // get this from $dungeonDetails: #######################
  $numberOfNPCs = rand(4,8);
  
  $npcPositionsTaken = array();
  
  
  
  
// check for level-locked NPCs
// whether the NPC has already been placed will be in database

if(count($dungeonDetails[$thisDungeonsName][6])>0) {
  for ($ll = 0;$ll < count($dungeonDetails[$thisDungeonsName][6]);$ll++) {

// see if it's already placed:
if (!(in_array($ll, $NPCsAlreadyPlaced))) {

    // check current level against NPC max and min
    $thisMinLevel = $dungeonDetails[$thisDungeonsName][6][$ll][1];
    $thisMaxLevel = $dungeonDetails[$thisDungeonsName][6][$ll][2];
    $thisCurrentLevel = abs($thisMapsId);
    $thisLevelStepPercent = 100/($thisMaxLevel+1-$thisMinLevel);
    $chanceOfEncounter = $thisLevelStepPercent * (($thisCurrentLevel+1)-$thisMinLevel);
     
 if(rand(0,100) <= $chanceOfEncounter) {
      $isAValidItemPosition = false;
        findAValidPosition();
            if ($isAValidItemPosition) {
      $thisNpcXTile = $nodesPosition[0];
    $thisNpcYTile = $nodesPosition[1];
       
    // add NPC
    $numberOfNPCs --;
    
    array_push($NPCsAlreadyPlaced,$ll);

$npcString = $dungeonDetails[$thisDungeonsName][6][$ll][0];
$npcString = str_replace("lockedNPCPos", $thisNpcXTile.",".$thisNpcYTile, $npcString);
$npcString = str_replace("lockedNPCDir", "0,1", $npcString);

$npcMap[($thisNpcXTile)][($thisNpcYTile)] = "n-".count($levelLockedNPCs);
array_push($levelLockedNPCs, $npcString );
array_push($npcPositionsTaken,($thisNpcXTile)."_".($thisNpcYTile));
    }
    
    }
    }
  }
}  
  
  
  
  
  
  
  
  
  
  
  
  
  



  $loopIterations = $numberOfItems + $numberOfNPCs;
  
  
    for ($i = 1; $i<=$loopIterations; $i++) {

    
   
    
      $thisTime = time();
      $totalTimeSoFar = $thisTime - $startTime;
      if ($totalTimeSoFar>25) {
        abortScript();
      } else {
      
      // have 10 goes at finding a suitable spot, else skip this item:
      $isAValidItemPosition = false;
    
   
   
   
   findAValidPosition();
      
      
      
      if ($isAValidItemPosition) {
     
     
      if ($i<=$numberOfItems) {
    if($itemChance>0) {
     // place item:
        $itemType = $itemsAvailable[(rand(0,count($itemsAvailable)-1))];
        $itemMap[($nodesPosition[0])][($nodesPosition[1])] = $itemType;
        }
        } else {
        // place NPC:
        // double check no item here - can happen. shouldn't need this check - need to fix code above instead #######################
        
        if($itemMap[($nodesPosition[0])][($nodesPosition[1])] == "") {        
array_push($npcPositionsTaken,($nodesPosition[0])."_".($nodesPosition[1]));
         $npcMap[($nodesPosition[0])][($nodesPosition[1])] = "n";
         }
        }
      }
      
      // end else:
    }
  
}

}







function findAValidPosition() {
global $savedWalkableAreas, $isAValidItemPosition, $mapMaxWidth, $mapMaxHeight, $dungeonMap, $itemMap, $npcPositionsTaken, $isAValidItemPosition, $nodesPosition;
 $attempts = 0;
 do {
      // pick random walkable region:
      $thisNode = $savedWalkableAreas[(rand(0,count($savedWalkableAreas)-1))];
        $nodesPosition = explode("_", $thisNode);
       
       // make sure this node is well away from edges (ie. away from doors)
       if ($nodesPosition[0]>2 && $nodesPosition[0]<$mapMaxWidth-3 && $nodesPosition[1]>2 && $nodesPosition[1]<$mapMaxHeight-3) {
     
       // try and find an open space where 3 tiles on a corner are walkable while the 3 in the opposite corner aren't:
       // make sure existing items aren't over the walkable tiles as well
       
       
        
       
       if ((($dungeonMap[($nodesPosition[0])][($nodesPosition[1])+1] == ".") || ($dungeonMap[($nodesPosition[0])][($nodesPosition[1])+1] == ",")) && (($itemMap[($nodesPosition[0])][($nodesPosition[1])+1] == "") && (!(in_array(($nodesPosition[0])."_".(($nodesPosition[1])+1), $npcPositionsTaken))))) {
		$tileSouthWalkable = true;
       } else {
       $tileSouthWalkable = false;
       }
       
              if ((($dungeonMap[($nodesPosition[0])][($nodesPosition[1])-1] == ".") || ($dungeonMap[($nodesPosition[0])][($nodesPosition[1])-1] == ",")) && (($itemMap[($nodesPosition[0])][($nodesPosition[1])-1] == "") && (!(in_array(($nodesPosition[0])."_".(($nodesPosition[1])-1), $npcPositionsTaken))))) {
		$tileNorthWalkable = true;
       } else {
       $tileNorthWalkable = false;
       }
       
       
                if ((($dungeonMap[($nodesPosition[0])+1][($nodesPosition[1])] == ".") || ($dungeonMap[($nodesPosition[0])+1][($nodesPosition[1])] == ",")) && (($itemMap[($nodesPosition[0])+1][($nodesPosition[1])] == "") && (!(in_array((($nodesPosition[0])+1)."_".($nodesPosition[1]), $npcPositionsTaken))))) {
		$tileEastWalkable = true;
       } else {
       $tileEastWalkable = false;
       }
       
              if ((($dungeonMap[($nodesPosition[0])-1][($nodesPosition[1])] == ".") || ($dungeonMap[($nodesPosition[0])-1][($nodesPosition[1])] == ",")) && (($itemMap[($nodesPosition[0])-1][($nodesPosition[1])] == "") && (!(in_array((($nodesPosition[0])-1)."_".($nodesPosition[1]), $npcPositionsTaken))))) {
		$tileWestWalkable = true;
       } else {
       $tileWestWalkable = false;
       }
       
       
               if ((($dungeonMap[($nodesPosition[0])-1][($nodesPosition[1])-1] == ".") || ($dungeonMap[($nodesPosition[0])-1][($nodesPosition[1])-1] == ",")) && (($itemMap[($nodesPosition[0])-1][($nodesPosition[1])-1] == "") && (!(in_array((($nodesPosition[0])-1)."_".(($nodesPosition[1])-1), $npcPositionsTaken))))) {
		$tileNorthWestWalkable = true;
       } else {
       $tileNorthWestWalkable = false;
       }
       
            if ((($dungeonMap[($nodesPosition[0])+1][($nodesPosition[1])-1] == ".") || ($dungeonMap[($nodesPosition[0])+1][($nodesPosition[1])-1] == ",")) && (($itemMap[($nodesPosition[0])+1][($nodesPosition[1])-1] == "") && (!(in_array((($nodesPosition[0])+1)."_".(($nodesPosition[1])-1), $npcPositionsTaken))))) {
		$tileNorthEastWalkable = true;
       } else {
       $tileNorthEastWalkable = false;
       }
       
       if ((($dungeonMap[($nodesPosition[0])+1][($nodesPosition[1])+1] == ".") || ($dungeonMap[($nodesPosition[0])+1][($nodesPosition[1])+1] == ",")) && (($itemMap[($nodesPosition[0])+1][($nodesPosition[1])+1] == "") && (!(in_array((($nodesPosition[0])+1)."_".(($nodesPosition[1])+1), $npcPositionsTaken))))) {
		$tileSouthEastWalkable = true;
       } else {
       $tileSouthEastWalkable = false;
       }
       
        if ((($dungeonMap[($nodesPosition[0])-1][($nodesPosition[1])+1] == ".") || ($dungeonMap[($nodesPosition[0])-1][($nodesPosition[1])+1] == ",")) && (($itemMap[($nodesPosition[0])-1][($nodesPosition[1])+1] == "") && (!(in_array((($nodesPosition[0])-1)."_".(($nodesPosition[1])+1), $npcPositionsTaken))))) {
		$tileSouthWestWalkable = true;
       } else {
       $tileSouthWestWalkable = false;
       }
       
       if($tileWestWalkable && $tileNorthWestWalkable && $tileNorthWalkable) {
       if(!$tileEastWalkable && !$tileSouthEastWalkable && !$tileSouthWalkable) {
       $isAValidItemPosition = true;
       }
       }
       if($tileEastWalkable && $tileSouthEastWalkable && $tileSouthWalkable) {
              if(!$tileWestWalkable && !$tileNorthWestWalkable && !$tileNorthWalkable) {
       
       $isAValidItemPosition = true;
       }
       }
       
          if($tileEastWalkable && $tileNorthEastWalkable && $tileNorthWalkable) {
       if(!$tileWestWalkable && !$tileSouthWestWalkable && !$tileSouthWalkable) {
       $isAValidItemPosition = true;
       }
       }
        if($tileWestWalkable && $tileSouthWestWalkable && $tileSouthWalkable) {
          if(!$tileEastWalkable && !$tileNorthEastWalkable && !$tileNorthWalkable) {
      
       $isAValidItemPosition = true;
       }
       }
       
       // check this position isn't adjacent to some stairs:
       
       for ($ix=-1; $ix<2; $ix++) {
       for ($iy=-1; $iy<2; $iy++) {
       if ($dungeonMap[($nodesPosition[0])+$ix][($nodesPosition[1])+$iy] == "s") {
         $isAValidItemPosition = false;
       }
       }
       }
       
       }
        $attempts ++;
      } while (($isAValidItemPosition == false) && ($attempts<10));
      
    
      
}










function createNewDungeonMap($mapID) {
    global $dungeonMap, $itemMap, $npcMap, $tunnelMaxLength, $mapMaxWidth, $mapMaxHeight, $inX, $inY, $outX, $outY, $templateRows, $exitDoorX, $exitDoorY, $heightMap, $entranceHeight, $exitHeight, $debugMode, $dungeonDetails, $doorsIn, $doorsOut, $connectingDoorX, $connectingDoorY, $dungeonDetails, $thisDungeonsName, $thisMapsId, $outputMode, $allStairs, $tileHeight, $isTreasureMapLevel, $treasureLocX, $treasureLocY, $thisPlayersId, $loadedDoorData, $mapMode, $topLeftXPos, $topLeftYPos, $turning, $whichDirectionToTurn, $NPCsAlreadyPlaced, $templatesAlreadyPlaced, $levelLockedTemplatesAlreadyPlaced, $templateChosen, $levelLockedTemplateChosen;
    $outputMode = "xml";
  if(isset($_GET["outputMode"])) {
  $outputMode = $_GET["outputMode"];
  }
  
  
  include("includes/dungeonMapConfig.inc");



if (isset($_GET["connectingDoorX"])) {
   $connectingDoorX = $_GET["connectingDoorX"];
   $connectingDoorY = $_GET["connectingDoorY"];
}

$tileHeight = 24;
     
     if(!$isTreasureMapLevel) {
     // session will already be set, and map won't turn
  
  
//  $whichDirectionToTurn = - 1;
  
 
  
    include("data/chr" . $thisPlayersId . "/dungeon/".$thisDungeonsName."/session.inc");
  
  
  
  /*
     session_start();
     if (isset($_SESSION['whichTurn'])) {
      $whichDirectionToTurn = (0-$_SESSION['whichTurn']);
     } else {
     // get this from database: ##########
        $whichDirectionToTurn = - 1;
     }
     $_SESSION['whichTurn'] = $whichDirectionToTurn;
     */
     }
     
     
     
     
    $mapMaxWidth = 36;
    $mapMaxHeight = 36;
    $tunnelMaxLength = 150;
    $isFullyConnected = false;
    do {
    $templateChosen = "";
    $levelLockedTemplateChosen = "";
    $doorsIn = array();
$doorsOut = array();
        $stairsAreOk = true;
        $dungeonMap = array();
        $heightMap = array();
        $itemMap = array();
        $npcMap = array();
        $allStairs = array();
        for ($i = 0;$i < $mapMaxWidth;$i++) {
            $dungeonMap[$i] = array();
            $heightMap[$i] = array();
            for ($j = 0;$j < $mapMaxHeight;$j++) {
                $dungeonMap[$i][$j] = "#";
                $heightMap[$i][$j] = "*";
                $itemMap[$i][$j] = "";
                $npcMap[$i][$j] = "";
            }
        }
        $entranceHeight = "*";
        $exitHeight = "*";
        // determine what type of map this will be:
        $mapMode = "standard";
        if (rand(0, 2) == 0) {
            // is a feature map:
            $whichFeature = rand(0,6);
            
            
            if($whichFeature==0) {
            $mapMode = "template";
            } else if ($whichFeature<4) {
            $mapMode = "nest";
            } else {
            $mapMode = "stairs";
            }
            
            
     
            
     
        }
        
        
        
        // development force mode:
    
        if(isset($_GET["forceMode"])) {
          $mapMode = $_GET["forceMode"];
        }
        
        if($mapID == -1) {
          // first map can't be a stairs map as the height of the start doors is hardcoded to zero:
          if ($mapMode == "stairs") {
          $mapMode = "standard";
          }
        }
        
        $turning = 0;
       if($isTreasureMapLevel) {
        $mapMode = "nest";
        // won't turn
        } else {
        if (rand(0, 4) == 0) {
            // this map will turn:
            $turning = $whichDirectionToTurn;
        }
        }
        
 
        
        
        
        
if($thisMapsId == -1) {
    // hard code door position of first map:
    $startDoorX = $dungeonDetails[$thisDungeonsName][1][0];
    $startDoorY = $dungeonDetails[$thisDungeonsName][1][1];
  } else {
    // determine door position based on connecting door's position:
    $startDoorX = $connectingDoorX;
    $startDoorY = $connectingDoorY;
    if ($connectingDoorX == 0) {
    // north wall:
    $startDoorX = ($mapMaxWidth - 1);
    } else if ($connectingDoorX == ($mapMaxWidth - 1)) {
    // south wall:
    $startDoorX = 0;
    }
    if ($connectingDoorY == 0) {
    // west wall:
    $startDoorY = ($mapMaxHeight - 1);
    } else if ($connectingDoorY == ($mapMaxHeight - 1)) {
    // east wall:
    $startDoorY = 0;
    }
}

if($isTreasureMapLevel) {


$testNextMapFilename = "data/chr" . $thisPlayersId . "/dungeon/".$thisDungeonsName."/" . ($thisMapsId+1) . ".xml";
        if (is_file($testNextMapFilename)) {
        // previous map exists - get the exit doors for that map and create corresponding entrances doors for this current map to connect up nicely
        
        
        
        loadPreviouslyCreatedMap($testNextMapFilename);
           
            $doorX = 0;
            $doorY = 0;
            for ($d = 0;$d < count($loadedDoorData);$d++) {
            // find doors that connect to this map:
            $doorData = explode(",", $loadedDoorData[$d]);
            if($doorData[0] == $thisMapsId) {
              $doorX += $doorData[1];
              $doorY += $doorData[2];
            }
            }
            // get the average door locations to find the centre of the door:
            $doorX /= 3;
            $doorY /= 3;
               
        // find the corresponding entrance door to match to this exit:
         $startDoorX = $doorX;
         $startDoorY = $doorY;
        
   
        
        if ($doorX == 0) {
// north wall:
$startDoorX = ($mapMaxWidth - 1);
} else if ($doorX == ($mapMaxWidth - 1)) {
// south wall:
$startDoorX = 0;
}
if ($doorY == 0) {
// west wall:
$startDoorY = ($mapMaxHeight - 1);
} else if ($doorY == ($mapMaxHeight - 1)) {
// east wall:
$startDoorY = 0;
}

        
        } else {
        // make start doors be on the same edge as the first level of this dungeon, so that any of the possible map directions can connect up to it
            $originalStartDoorX = $dungeonDetails[$thisDungeonsName][1][0];
    $originalStartDoorY = $dungeonDetails[$thisDungeonsName][1][1];
    $startDoorX = $originalStartDoorX;
    $startDoorY = $originalStartDoorY;
    // randomise this, but keep it on the same edge: 
    if (($startDoorX == 0) || ($startDoorX == ($mapMaxWidth - 1))) {
   $startDoorY  = rand(5,($mapMaxHeight - 5));
   } else if (($startDoorY == 0) || ($startDoorY == ($mapMaxHeight - 1))) {
   $startDoorX  = rand(5,($mapMaxWidth - 5));
   }
        }
}

       // create indented points to tunnel from:
       $tunnelStartX = $startDoorX;
       $tunnelStartY = $startDoorY;
       if ($startDoorX == 0) {
       $tunnelStartX = 1;
       } else if ($startDoorX == ($mapMaxWidth - 1)) {
       $tunnelStartX = ($mapMaxWidth - 2);
       }
         if ($startDoorY == 0) {
       $tunnelStartY = 1;
       } else if ($startDoorY == ($mapMaxHeight - 1)) {
       $tunnelStartY = ($mapMaxHeight - 2);
       }
       
       
       

       
        

// set up some random points - this assumes that the map is always square:
$randomPointX = rand(floor($mapMaxWidth / 2), $mapMaxWidth - 3);
$randomPointY = rand(floor($mapMaxHeight / 2), $mapMaxHeight - 3);
if($turning == 0) {
  // try and make the exit point not too directly opposite the entrance point:



  // again, assume square map:
  $halfWayPoint = (floor($mapMaxWidth / 2));
        
  if(($startDoorY == 0) || ($startDoorY == ($mapMaxWidth - 1))) {
    if($startDoorX > $halfWayPoint) {
      $randomPointX = rand(3 , $halfWayPoint);
    } else {
      $randomPointX = rand($halfWayPoint,($mapMaxWidth - 3));
    }
  }

  if(($startDoorX == 0) || ($startDoorX == ($mapMaxHeight - 1))) {
    if($startDoorY > $halfWayPoint) {
      $randomPointY = rand(3 , $halfWayPoint);
    } else {
      $randomPointY = rand($halfWayPoint,($mapMaxHeight - 3));
    }
  }
}
      

   // check to see if the map after this one already exists (ie. the next map has treasure on it and has already been created)
       $testNextMapFilename = "data/chr" . $thisPlayersId . "/dungeon/".$thisDungeonsName."/" . ($thisMapsId-1) . ".xml";
        if (is_file($testNextMapFilename)) {
           // load the xml for the next map and find the entrance doors, and connect to these
           loadPreviouslyCreatedMap($testNextMapFilename);
           
            $doorX = 0;
            $doorY = 0;
            for ($d = 0;$d < count($loadedDoorData);$d++) {
            // find doors that connect to this map:
            $doorData = explode(",", $loadedDoorData[$d]);
            if($doorData[0] == $thisMapsId) {
              $doorX += $doorData[1];
              $doorY += $doorData[2];
            }
            }
            // get the average door locations to find the centre of the door:
            $doorX /= 3;
            $doorY /= 3;
               
        // find the corresponding exit door to match to this entrance:
         $exitDoorX = $doorX;
         $exitDoorY = $doorY;
      
    
if ($doorX == 0) {
// north wall:
$exitDoorX = ($mapMaxWidth - 1);
} else if ($doorX == ($mapMaxWidth - 1)) {
// south wall:
$exitDoorX = 0;
}
if ($doorY == 0) {
// west wall:
$exitDoorY = ($mapMaxHeight - 1);
} else if ($doorY == ($mapMaxHeight - 1)) {
// east wall:
$exitDoorY = 0;
}
        

        } else {
   
   
   
if ($startDoorY == 0) {
  // entering on bottom left iso edge:
  switch ($turning) {
    case 1:
      // turning right:
      $exitDoorX = $mapMaxWidth - 1;
      $exitDoorY = $randomPointY;
    break;
    case -1:
      // turning left:
      $exitDoorX = 0;
      $exitDoorY = $randomPointY;
    break;
    default:
      // straight on:
      $exitDoorX = $randomPointX;
      $exitDoorY = $mapMaxHeight - 1;
  }  
} else if ($startDoorY == ($mapMaxHeight - 1)) {

  // entering on top right iso edge:
  switch ($turning) {
    case 1:
      // turning right:
      $exitDoorX = 0;
      $exitDoorY = $randomPointY;
    break;
    case -1:
      // turning left:
      $exitDoorX = $mapMaxWidth - 1;
      $exitDoorY = $randomPointY;
    break;
    default:
      // straight on:
      $exitDoorX = $randomPointX;
      $exitDoorY = 0;
  }  


} else if ($startDoorX == 0) {
// entering from top left iso edge:
  switch ($turning) {
    case 1:
      // turning right:
      $exitDoorX = $randomPointX;
      $exitDoorY = 0;
    break;
    case -1:
      // turning left:
      $exitDoorX = $randomPointX;
      $exitDoorY = $mapMaxHeight - 1;
    break;
    default:
      // straight on:
      $exitDoorX = $mapMaxWidth - 1;
      $exitDoorY = $randomPointY;
  } 

} else {
// entering from bottom right iso edge:

  switch ($turning) {
    case 1:
      // turning right:
      $exitDoorX = $randomPointX;
      $exitDoorY = $mapMaxHeight - 1;
    break;
    case -1:
      // turning left:
      $exitDoorX = $randomPointX;
      $exitDoorY = 0;
    break;
    default:
      // straight on:
      $exitDoorX = 0;
      $exitDoorY = $randomPointY;
  } 


}
        
   }    
 
  
       // create indented points to tunnel to:
       $exitPointToConnectToX = $exitDoorX;
       $exitPointToConnectToY = $exitDoorY;

       if ($exitDoorX == 0) {
       $exitPointToConnectToX = 1;
       } else if ($exitDoorX == ($mapMaxWidth - 1)) {
       $exitPointToConnectToX = ($mapMaxWidth - 2);
       }
         if ($exitDoorY == 0) {
       $exitPointToConnectToY = 1;
       } else if ($exitDoorY == ($mapMaxHeight - 1)) {
       $exitPointToConnectToY = ($mapMaxHeight - 2);
       }      
        
        
        
        
        
   
        switch ($mapMode) {
            case "stairs":
              
                $numberOfStairs = rand(1, 3);
                // give width appropriate to tunnel widths:
                $stairsWidth = 3;
               
                
                $totalStairsHeight = 0;
                $caseRotation = rand(0, 1);
                
                
                // temporary: ###############
                 $numberOfStairs = 1;
           
                
                
                switch ($numberOfStairs) {
                    case 1:
                        // can be placed anywhere within safe zone (at least 6 tiles away from edge)
                        $thisCaseLength = rand(3,8);
                    
                    
                    
           
                        if ($caseRotation == 0) {
                            // east west stairs
                            $horizLength = $thisCaseLength;
                            $vertLength = $stairsWidth;
                        } else {
                            // north south stairs - it's the y value that's increasing for the array
                            $horizLength = $stairsWidth;
                            $vertLength = $thisCaseLength;
                        }
                        
                        $stairsSafeZone = ($thisCaseLength+2);
                        
                        $tunnelVertLength = $vertLength;
                        $tunnelHorizLength = $horizLength;
                        // these supporting tunnels don't need to be too long:
                        if($vertLength>6) {
                        $tunnelVertLength = 6;
                        }
                        if($horizLength>6) {
                        $tunnelHorizLength = 6;
                        }
                        
                        $thisCaseStartX = rand($stairsSafeZone, $mapMaxWidth - $horizLength - $stairsSafeZone);
                        $thisCaseStartY = rand($stairsSafeZone, $mapMaxHeight - $vertLength - $stairsSafeZone);
                        array_push($allStairs, array($thisCaseStartX, $thisCaseStartY, $thisCaseLength, $caseRotation));
                        $totalStairsHeight = $thisCaseLength;
                        if ($caseRotation == 0) {
                            $exitPointX = $thisCaseStartX + ($tunnelHorizLength*2);
                            $exitPointY = $thisCaseStartY;
                        } else {
                            $exitPointX = $thisCaseStartX;
                            $exitPointY = $thisCaseStartY - ($tunnelVertLength *2);
                        }
                        
       
                        
                        // tunnel from entrance to stair case tunnel:
                        $tunnelSuccess = false;
                        do {
                        if($caseRotation == 1) {
                        $tunnelSuccess = makeTunnel($tunnelStartX, $tunnelStartY, $thisCaseStartX, $thisCaseStartY-$tunnelVertLength, 3, 3, 795);
                        } else {
                        $tunnelSuccess = makeTunnel($tunnelStartX, $tunnelStartY, $thisCaseStartX-$tunnelHorizLength, $thisCaseStartY, 3, 3, 795);
                        }
                            
                        }
                        while (!$tunnelSuccess);
                        // tunnel from case to exit tunnel:
                        $tunnelSuccess = false;
                        do {
                        $tunnelSuccess = makeTunnel($exitPointX, $exitPointY, $exitPointToConnectToX, $exitPointToConnectToY, 3, 3, 804);
                        } while (!$tunnelSuccess);
                        
                        
                        break;
                    case 2:
                        // place first case
                        $thisCaseLength = rand(3, floor(12 / $numberOfStairs));
                        if ($caseRotation == 0) {
                            // east west stairs
                            $horizLength = $thisCaseLength;
                            $vertLength = $stairsWidth;
                        } else {
                            // north south stairs
                            $horizLength = $stairsWidth;
                            $vertLength = $thisCaseLength;
                        }
                        $thisCaseStartX = rand(9, $mapMaxWidth - $horizLength - 9);
                        $thisCaseStartY = rand(9, floor($mapMaxHeight / 2));
                        array_push($allStairs, array($thisCaseStartX, $thisCaseStartY, $thisCaseLength, $caseRotation));
                        $totalStairsHeight+= $thisCaseLength;
                        $previousCaseEndY = $thisCaseStartY + $thisCaseStartY;
                        // tunnel from entrance to first stair case:
                        $tunnelSuccess = false;
                        do {
                            $tunnelSuccess = makeTunnel($tunnelStartX, $tunnelStartY, $thisCaseStartX, $thisCaseStartY, 3, 3, 836);
                        }
                        while (!$tunnelSuccess);
                        if ($caseRotation == 0) {
                            $exitPointX = $thisCaseStartX + $horizLength + 1;
                            $exitPointY = $thisCaseStartY + floor($vertLength / 2);
                        } else {
                            $exitPointX = $thisCaseStartX + floor($horizLength / 2);
                            $exitPointY = $thisCaseStartY + $vertLength + 1;
                        }
                        // place second case
                        $thisCaseLength = rand(3, floor(12 / $numberOfStairs));
                        // alternate case rotation from previous:
                        if ($caseRotation == 0) {
                            $caseRotation = 1;
                        } else {
                            $caseRotation = 0;
                        }
                        if ($caseRotation == 0) {
                            // east west stairs
                            $horizLength = $thisCaseLength;
                            $vertLength = $stairsWidth;
                        } else {
                            // north south stairs
                            $horizLength = $stairsWidth;
                            $vertLength = $thisCaseLength;
                        }
                        $thisCaseStartX = rand(9, $mapMaxWidth - $horizLength - 9);
                        $thisCaseStartY = rand($previousCaseEndY + 7, $mapMaxHeight - $vertLength - 9);
                        array_push($allStairs, array($thisCaseStartX, $thisCaseStartY, $thisCaseLength, $caseRotation));
                        $totalStairsHeight+= $thisCaseLength;
                        // tunnel from first to second case:
                        $tunnelSuccess = false;
                         if ($debugMode) {
                        echo "first case to second case - aiming for ".$exitPointToConnectToX.",".$exitPointToConnectToY."<br />";
                        }
                      //    do {
                        $tunnelSuccess = makeTunnel($exitPointX, $exitPointY, $thisCaseStartX, $thisCaseStartY, 3, 3, 750);
                     //     } while (!$tunnelSuccess);
                        // set exit point from second case:
                        if ($caseRotation == 0) {
                            $exitPointX = $thisCaseStartX + $horizLength + 1;
                            $exitPointY = $thisCaseStartY + floor($vertLength / 2);
                        } else {
                            $exitPointX = $thisCaseStartX + floor($horizLength / 2);
                            $exitPointY = $thisCaseStartY + $vertLength + 1;
                        }
                        // tunnel from second case to exit:
                        $tunnelSuccess = false;
                        do {
                        $tunnelSuccess = makeTunnel($exitPointX, $exitPointY, $exitPointToConnectToX, $exitPointToConnectToY, 3, 3, 902);
                        } while (!$tunnelSuccess);
                        break;
                    }
                    
                    
                    
                    
                    
                    // draw stairs:
                    for ($i = 0;$i < count($allStairs);$i++) {
                        $thisCaseStartX = $allStairs[$i][0];
                        $thisCaseStartY = $allStairs[$i][1];
                        $thisCaseLength = $allStairs[$i][2];
                        $caseRotation = $allStairs[$i][3];
                       
                        if ($caseRotation == 0) {
                            $horizLength = $thisCaseLength;
                            $vertLength = $stairsWidth;
                            
                        } else {
                            $horizLength = $stairsWidth;
                            $vertLength = $thisCaseLength;
                        
                        }
                        
                         // tunnel away from both ends of the staircase in the same direction as the stairs to give the stairs more meaning:
                        drawStairEndTunnel($thisCaseStartX,$thisCaseStartY,$horizLength,$vertLength, $caseRotation);
                        
                        
                        for ($j = (0);$j < $horizLength;$j++) {
                            for ($k = (0);$k < $vertLength;$k++) {
                                if ($caseRotation == 0) {
                                $dungeonMap[($thisCaseStartX + $j) ][($thisCaseStartY + $k) ] = "s";
                                } else {
                                $dungeonMap[($thisCaseStartX + $j) ][($thisCaseStartY - $k) ] = "s";
                                }
                            }
                        }
                        
                        
                       
                        
                        
                        
                    }
                    $entranceHeight = $totalStairsHeight;
                    $lastCaseHeight = 0;
                    
                    
                    for ($i = 0;$i < count($allStairs);$i++) {
                        if (floodFillHeight($tunnelStartX, $tunnelStartY, $totalStairsHeight - $lastCaseHeight)) {
                            // found the exit - so stairs were by-passed - abort this map:
                            $stairsAreOk = false;
                        }
                        $thisCaseStartX = $allStairs[$i][0];
                        $thisCaseStartY = $allStairs[$i][1];
                        $thisCaseLength = $allStairs[$i][2];
                        $caseRotation = $allStairs[$i][3];
                        if ($caseRotation == 0) {
                            $exitCaseX = $thisCaseStartX + $thisCaseLength;
                            $exitCaseY = $thisCaseStartY;
                        } else {
                            $exitCaseX = $thisCaseStartX;
                            $exitCaseY = $thisCaseStartY + $thisCaseLength;
                        }
                        $lastCaseHeight = $thisCaseLength;
                    }
                    
                   
                    
                    // assign height from end of last case to exit:
                    // (ignore the false that this will return as the exit should be reached here)
                   // floodFillHeight($exitCaseX, $exitCaseY, $totalStairsHeight - $lastCaseHeight);
                    $exitHeight = $totalStairsHeight - $lastCaseHeight;
                    // assign height to stairs - should all be the lowest height that the stairs touch
                    if ($caseRotation == 0) {
                        $horizLength = $thisCaseLength;
                        $vertLength = $stairsWidth;
                        for ($i = 0;$i < $horizLength ;$i++) {
                            for ($j = 0;$j < $vertLength ;$j++) {
                                $heightMap[($thisCaseStartX + $i) ][($thisCaseStartY + $j) ] = $exitHeight;
                             
                            }
                        }
                    } else {
                        $horizLength = $stairsWidth;
                        $vertLength = $thisCaseLength;
                        for ($i = 0;$i < $horizLength;$i++) {
                            for ($j = 0;$j < $vertLength;$j++) {
                                $heightMap[($thisCaseStartX + $i) ][($thisCaseStartY - $j) ] = $exitHeight;
                                
                            }
                        }
                    }
                    break;
                case "template":
                    pickTemplate();
                    $templateWidth = count($templateRows);
                    $templateHeight = strlen($templateRows[0]);
                    // find a location for this template: (allow room for the tunnel to get between template and map edge)
                    $topLeftXPos = rand(5, $mapMaxWidth - $templateWidth - 5);
                    $topLeftYPos = rand(5, $mapMaxHeight - $templateHeight - 5);
                    // check if the template stretches across the full map:
                    if ($templateWidth == $mapMaxWidth) {
                        $topLeftXPos = 0;
                    }
                    if ($templateHeight == $mapMaxHeight) {
                        $topLeftYPos = 0;
                    }
                    // tunnel from map start door to the template's 'in' point:
                    $tunnelSuccess = false;
                    do {
                        $tunnelSuccess = makeTunnel($tunnelStartX, $tunnelStartY, ($topLeftXPos + $inX), ($topLeftYPos + $inY), 3, 3, 857);
                    }
                    while (!$tunnelSuccess);
                    // tunnel from the template's 'out' point to the map's exit point:
                     do {
                    $tunnelSuccess = makeTunnel(($topLeftXPos + $outX), ($topLeftYPos + $outY), $exitPointToConnectToX, $exitPointToConnectToY, 3, 3, 862);
                      } while (!$tunnelSuccess);
                    // place template:
                    for ($i = 0;$i < $templateWidth;$i++) {
                        $thisRow = str_split($templateRows[$i], 1);
                        for ($j = 0;$j < $templateHeight;$j++) {
                            if ($thisRow[$j] != "X") {
                                // X means leave the terrain underneath untouched
                                $dungeonMap[($j + $topLeftXPos) ][($i + $topLeftYPos) ] = $thisRow[$j];
                            }
                        }
                    }
                    break;
                    
                case "nest":    
                    // pick hub point:
                    $hubPointX = rand(3, $mapMaxWidth - 3);
                    $hubPointY = rand(3, $mapMaxHeight - 3);
                    // tunnel to and from this point
                    $tunnelSuccess = false;
                     do {
                       
                        $tunnelSuccess = makeTunnel($tunnelStartX, $tunnelStartY, $hubPointX, $hubPointY, 3, 3, 1128);
                    } while (!$tunnelSuccess);
                    $tunnelSuccess = false;
                     do {
                        $tunnelSuccess = makeTunnel($hubPointX,$hubPointY,$exitPointToConnectToX,$exitPointToConnectToY,3,3,1132);
                     } while (!$tunnelSuccess);
                    
                    // pick a number of chambers:
                    $numberOfChambers = rand(5,8);
                    for ($drawChambers = 0; $drawChambers<$numberOfChambers; $drawChambers++) {
                    
                    $caveRadius = rand (1,4);
                    $caveCentreX = rand(($caveRadius + 1),($mapMaxWidth - $caveRadius - 1));
                    $caveCentreY = rand(($caveRadius + 1),($mapMaxHeight - $caveRadius - 1));
                    drawFilledCircle($caveCentreX, $caveCentreY, $caveRadius);
                    // tunnel to this chamber from hub spot:
                    $tunnelSuccess = false;
                    do {
                        $tunnelSuccess = makeTunnel($hubPointX, $hubPointY, $caveCentreX, $caveCentreY, 1, 3, 1146);
                    } while (!$tunnelSuccess);
                    
                    }
                    
                    if($isTreasureMapLevel) {
                     // create a new chamber for the treasure to be hidden in:
                     $caveRadius = rand (3,4);
                     drawFilledCircle($treasureLocX, $treasureLocY, $caveRadius);
                       // tunnel to this chamber from hub spot:
                    $tunnelSuccess = false;
                    do {
                        $tunnelSuccess = makeTunnel($hubPointX, $hubPointY, $treasureLocX, $treasureLocY, 1, 3, 1146);
                    } while (!$tunnelSuccess);
                    }
                    
                    
                    break;
                default:
                    // standard map:
                    // draw tunnels that connect start point to random end point on destination wall via a single way point:
                    $wayPoint1X = rand(3, $mapMaxWidth - 3);
                    $wayPoint1Y = rand(3, $mapMaxHeight - 3);
                    $tunnelSuccess = false;
                
                    do {
                        // start tunnel just away from the map edge:
                        $tunnelSuccess = makeTunnel($tunnelStartX, $tunnelStartY, $wayPoint1X, $wayPoint1Y, 3, 3, 884);
                    } while (!$tunnelSuccess);
                    $tunnelSuccess = false;
                     do {
                        $tunnelSuccess = makeTunnel($wayPoint1X,$wayPoint1Y,$exitPointToConnectToX,$exitPointToConnectToY,3,3,905);
                     } while (!$tunnelSuccess);
                    // find a random point and draw a cave:
                    $validopenTunnelFound = false;
                    while (!$validopenTunnelFound) {
                        $tunnelBlankX = rand(3, $mapMaxWidth - 3);
                        $tunnelBlankY = rand(3, $mapMaxHeight - 3);
                        if ($dungeonMap[$tunnelBlankX][$tunnelBlankY] == ".") {
                            $validopenTunnelFound = true;
                        }
                    }
                    // find random start point within boundaries:
                    do {
                        $caveRadius = rand(10, 20);
                        $min = $caveRadius + 2;
                        // (assume map is square and mapMaxWidth == mapMaxHeight)
                        $max = $mapMaxWidth - $caveRadius - 2;
                    }
                    while ($min >= $max);
                    $caveCentreX = rand($min, $max);
                    $caveCentreY = rand($min, $max);
                    drawCave($caveCentreX, $caveCentreY, $caveRadius);
                    // tunnel to this cave from a known pre-tunnelled space:
                    $tunnelSuccess = false;
                    do {
                        $tunnelSuccess = makeTunnel($tunnelBlankX, $tunnelBlankY, $caveCentreX, $caveCentreY, 3, 3, 1130);
                    } while (!$tunnelSuccess);
                }
                // ensure boundaries are intact:
                for ($i = 0;$i < $mapMaxHeight;$i++) {
                    $dungeonMap[0][$i] = "#";
                    $dungeonMap[$mapMaxWidth - 1][$i] = "#";
                }
                for ($i = 0;$i < $mapMaxWidth;$i++) {
                    $dungeonMap[$i][0] = "#";
                    $dungeonMap[$i][$mapMaxHeight - 1] = "#";
                }
                
                

      
      
      if($thisMapsId == -1) {
       markDoors($dungeonDetails[$thisDungeonsName][1][0], $dungeonDetails[$thisDungeonsName][1][1], "in");
    
      } else {
      markDoors($startDoorX, $startDoorY, "in");
      }
      
    markDoors($exitDoorX, $exitDoorY, "out");
                
                $isFullyConnected = checkPathIsConnected($startDoorX,$startDoorY);
            
            
            if($mapMode == "stairs") {
            // check if stairs, and if so, if height of entrance and exit are the same - if so, path has run through stairs, need to abort
            // if more than 1 stair case, check each flight #####################
       if($heightMap[$startDoorX][$startDoorY] == $heightMap[$exitDoorX][$exitDoorY]) {
       $isFullyConnected = false;
       }
       }
            
            
            } while ((!$isFullyConnected) || (!$stairsAreOk));
            placeItemsandNPCs();
            outputDungeon();
            
           
            
          
            
        }
       
?>