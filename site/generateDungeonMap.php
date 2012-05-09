<?php
// ---------------------------------
// http://www.autumnearth.com/generateDungeonMap.php?playerId=1001&originatingMapId=-1&requestedMap=-2&dungeonName=the-barrow-mines&forceMode=nest&outputMode=test&connectingDoorX=18&connectingDoorY=35



// TO DO


// going down a long stair case, the _y offset of scrollclip goes out of sync - presumably the offset isn't in propoertion to the new height of the stairs. might need to be a multiple of distance travelled across tile multiplied to height of new tiles (*24)
// tunnels shouldn't go through stairs
// bug - can get untraversable maps where a tunnel goes back through a staircase
// the pathfinding check to see if the map is traversable needs to look at height differences as well






// refine the height determination of walls to be clearer and not obstruct view as much:
// - if the tile is walkable, then it shouldn't take account of tiles that will be blanked out, but if it's going to be wall tile, then it should take account of these when averaging
// loop through and set outputdungeonmap to have the blanked tiles so xml and the averaging function don't repeat the same tests

// have some sort of persistence between dungeon visits. keep track of creature populations etc.

// ensure session saving turning value is unique to each dungeon instance

// templates should be able to place items

// be really nice to have a league table on the website of which characters have achieved the deepest level in each dungeon - could create competition.

// Templates will need height maps and then to put the map start door at the same height as the height of the entrance to the template

// caves could branch if coordinates for each map are saved and checked against before determining exit doors - just to ensure that the maps don't intersect incorrectly





// save changes in Flash for random maps

// bug - it is possible for small incosequential areas to be separated from the main walkable region after edging walls are added back in. not a problem, but does look a little messy.


// rewrite drawFilledCircle so I understand it

// rarer items should be placed more often the deeper in to the dungeon the player has gone

// randomDungeonName needs to be saved with save game in flash so that it is pulled through when starting a new game session from within the dungeon

// template areas could include mines, temples and - template objects and npcs too eg. dwarven expedition

// to allow unique template maps to used with the relevant quest objectives on - flash map swf will have an array with the relevant quests for the dungeon that can be entered from that map. flash will request a new map and check the status and pass through any open quests. php will have a table with quest number and the range that that template could be found on - if map level exceeds this range, then use this template so will definintely be used (or have a random chance of it occuring that the liklihood increases with the 'depth' of the current map until it's 100% that this map will be used). table might also have another quest that is opened once this template has been used - so can chain templates in correct order. open quests are stored in database - if map #0 is requested then these are cleared and any new ones from flash are used. once template is used then this is removed from database entry - chained quest template will be added to database entry

// be nice not to have such obviously large circles - or do they look ok in iso?
// error handle script timeout in function abortScript() and default to a fully templated map so that flash has something to load. These template maps would need to have very wide entrance chambers, so that wherever the door was placed to match up with the previous map, a path is connected up.
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
        unlink($dir."/".$file);
      }
    }
    closedir($thisDirectory);
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
    global $inX, $inY, $outX, $outY;
    if ($name == "MAP") {
        // read attributes:
        $inX = $attribs["INX"];
        $inY = $attribs["INY"];
        $outX = $attribs["OUTX"];
        $outY = $attribs["OUTY"];
    }
}
function XMLEndTag($parser, $name) {
    // (no action)
    
}
function XMLTagContents($parser, $data) {
    global $templateRows;
    // remove whitespace from data:
    array_push($templateRows, str_ireplace(" ", "", $data));
}
function getXMLFile() {
    global $templateRows, $fileToUse;
    // read contents of dir and find number of files:
    $dir = "templates/dungeon/area";
    $filesFound = array();
    if (is_dir($dir)) {
        if ($dirHandle = opendir($dir)) {
            while (($file = readdir($dirHandle)) !== false) {
                if ((is_file($dir . '/' . $file)) && ($file != 'index.php')) {
                    array_push($filesFound, $file);
                }
            }
            closedir($dirHandle);
        }
    }
    $fileToUse = $dir . "/" . $filesFound[(rand(0, count($filesFound) - 1)) ];
    $templateRows = array();
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
  global $dungeonMap, $dungeonOutputMap, $heightMap, $itemMap, $mapMaxHeight, $mapMaxWidth, $thisDungeonsName, $thisMapsId, $thisPlayersId, $thisAverageCount, $thisAverageTotal, $doorsOut, $doorsIn, $dungeonDetails, $thisOriginatingMapId, $outputMode, $allStairs, $stairsWidth, $entranceHeight, $tileHeight;


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
  if (($dungeonOutputMap[$i][$j] >= 100) && ($dungeonOutputMap[$i][$j] < 560)) {
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
     
     } else if (($dungeonOutputMap[$i][$j] >= 100) && ($dungeonOutputMap[$i][$j] < 560)) {
     // is a wall tile, raise these up as well:
     if($heightMap[$i][$j]>0) {
     $dungeonOutputMap[$i][$j] += ($heightMap[$i][$j]*30);
     }
    
     }

      
}
}



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
    // is a door - create walkable tile here:
    $outputString .= "2,";
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
    
    // re do loop for items:




    for ($i = 0;$i < $mapMaxWidth;$i++) {
    for ($j = 0;$j < $mapMaxHeight;$j++) {
   if($itemMap[$i][$j] != "") {
   $itemHeight = 0;
   if($heightMap[$i][$j]>0) {
   $itemHeight = $tileHeight*$heightMap[$i][$j];
   
   

   
   }
   $outputString .= "<item>".$i.",".$j.",".$itemMap[$i][$j].",1,".$itemHeight.",0</item>";
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

// echo for immediate use by Flash:
echo $outputString;

// write this to file:

        $mapFilename = "data/chr" . $thisPlayersId . "/dungeon/".$thisDungeonsName."/" . $thisMapsId . ".xml";
        
	if(!($filename=fopen($mapFilename,"w"))) {
			// error handling?
		}
		
		fwrite($filename, $outputString); 
		fclose($filename);
}



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

function placeItems() {

  global $dungeonMap, $itemMap, $mapMaxHeight, $mapMaxWidth, $savedWalkableAreas, $startTime, $dungeonDetails, $thisDungeonsName;
 

   
   $itemChance = $dungeonDetails[$thisDungeonsName][3];
   $itemsAvailable = $dungeonDetails[$thisDungeonsName][4];
   
  $numberOfItems = $itemChance[(rand(0,count($itemChance)-1))];
  
  
  
  if ($itemChance > 0) {
    for ($i = 1; $i<=$numberOfItems; $i++) {
      $thisTime = time();
      $totalTimeSoFar = $thisTime - $startTime;
      if ($totalTimeSoFar>25) {
        abortScript();
      } else {
      
      // have 10 goes at finding a suitable spot, else skip this item:
      $isAValidItemPosition = false;
      $attempts = 0;
      do {
      // pick random walkable region:
      $thisNode = $savedWalkableAreas[(rand(0,count($savedWalkableAreas)-1))];
        $nodesPosition = explode("_", $thisNode);
       
       // make sure this node is well away from edges (ie. away from doors)
       if ($nodesPosition[0]>2 && $nodesPosition[0]<$mapMaxWidth-3 && $nodesPosition[1]>2 && $nodesPosition[1]<$mapMaxHeight-3) {
     
       // try and find an open space where 3 tiles on a corner are walkable while the 3 in the opposite corner aren't:
       // make sure existing items aren't over the walkable tiles as well
       
       if ((($dungeonMap[($nodesPosition[0])][($nodesPosition[1])+1] == ".") || ($dungeonMap[($nodesPosition[0])][($nodesPosition[1])+1] == ",")) && ($itemMap[($nodesPosition[0])][($nodesPosition[1])+1] == "")) {
		$tileSouthWalkable = true;
       } else {
       $tileSouthWalkable = false;
       }
       
              if ((($dungeonMap[($nodesPosition[0])][($nodesPosition[1])-1] == ".") || ($dungeonMap[($nodesPosition[0])][($nodesPosition[1])-1] == ",")) && ($itemMap[($nodesPosition[0])][($nodesPosition[1])-1] == "")) {
		$tileNorthWalkable = true;
       } else {
       $tileNorthWalkable = false;
       }
       
       
                if ((($dungeonMap[($nodesPosition[0])+1][($nodesPosition[1])] == ".") || ($dungeonMap[($nodesPosition[0])+1][($nodesPosition[1])] == ",")) && ($itemMap[($nodesPosition[0])+1][($nodesPosition[1])] == "")) {
		$tileEastWalkable = true;
       } else {
       $tileEastWalkable = false;
       }
       
              if ((($dungeonMap[($nodesPosition[0])-1][($nodesPosition[1])] == ".") || ($dungeonMap[($nodesPosition[0])-1][($nodesPosition[1])] == ",")) && ($itemMap[($nodesPosition[0])-1][($nodesPosition[1])] == "")) {
		$tileWestWalkable = true;
       } else {
       $tileWestWalkable = false;
       }
       
       
               if ((($dungeonMap[($nodesPosition[0])-1][($nodesPosition[1])-1] == ".") || ($dungeonMap[($nodesPosition[0])-1][($nodesPosition[1])-1] == ",")) && ($itemMap[($nodesPosition[0])-1][($nodesPosition[1])-1] == "")) {
		$tileNorthWestWalkable = true;
       } else {
       $tileNorthWestWalkable = false;
       }
       
            if ((($dungeonMap[($nodesPosition[0])+1][($nodesPosition[1])-1] == ".") || ($dungeonMap[($nodesPosition[0])+1][($nodesPosition[1])-1] == ",")) && ($itemMap[($nodesPosition[0])+1][($nodesPosition[1])-1] == "")) {
		$tileNorthEastWalkable = true;
       } else {
       $tileNorthEastWalkable = false;
       }
       
       if ((($dungeonMap[($nodesPosition[0])+1][($nodesPosition[1])+1] == ".") || ($dungeonMap[($nodesPosition[0])+1][($nodesPosition[1])+1] == ",")) && ($itemMap[($nodesPosition[0])+1][($nodesPosition[1])+1] == "")) {
		$tileSouthEastWalkable = true;
       } else {
       $tileSouthEastWalkable = false;
       }
       
        if ((($dungeonMap[($nodesPosition[0])-1][($nodesPosition[1])+1] == ".") || ($dungeonMap[($nodesPosition[0])-1][($nodesPosition[1])+1] == ",")) && ($itemMap[($nodesPosition[0])-1][($nodesPosition[1])+1] == "")) {
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
      if ($isAValidItemPosition) {
     
        $itemType = $itemsAvailable[(rand(0,count($itemsAvailable)-1))];
        $itemMap[($nodesPosition[0])][($nodesPosition[1])] = $itemType;
      }
    }
  }
}

}

function createNewDungeonMap($mapID) {
    global $dungeonMap, $itemMap, $tunnelMaxLength, $mapMaxWidth, $mapMaxHeight, $inX, $inY, $outX, $outY, $templateRows, $exitDoorX, $exitDoorY, $heightMap, $entranceHeight, $exitHeight, $debugMode, $dungeonDetails, $doorsIn, $doorsOut, $connectingDoorX, $connectingDoorY, $dungeonDetails, $thisDungeonsName, $thisMapsId, $outputMode, $allStairs, $tileHeight;
    $outputMode = "xml";
  if(isset($_GET["outputMode"])) {
  $outputMode = $_GET["outputMode"];
  }
    // set up exit doors from each dungeon to the originating map: [destination map number][centre entrance door x and y][tile x and y when leaving dungeon][item frequency][items available]
$dungeonDetails = array(
'the-barrow-mines' => array(
"1",
array("25","35"),
array("16,20","17,20","18,20"),
array(1,1,2,2,3,4,5,6,7,8,9),
array("6","6","6","6","2","2","3","3","4","5")
)
);


if (isset($_GET["connectingDoorX"])) {
   $connectingDoorX = $_GET["connectingDoorX"];
   $connectingDoorY = $_GET["connectingDoorY"];
}

$tileHeight = 24;
     
     
     session_start();
     if (isset($_SESSION['whichTurn'])) {
      $whichDirectionToTurn = (0-$_SESSION['whichTurn']);
     } else {
     // get this from database: ##########
        $whichDirectionToTurn = - 1;
     }
     $_SESSION['whichTurn'] = $whichDirectionToTurn;
     
     
     
     
     
    $mapMaxWidth = 36;
    $mapMaxHeight = 36;
    $tunnelMaxLength = 150;
    $isFullyConnected = false;
    do {
    $doorsIn = array();
$doorsOut = array();
        $stairsAreOk = true;
        $dungeonMap = array();
        $heightMap = array();
        $itemMap = array();
        $allStairs = array();
        for ($i = 0;$i < $mapMaxWidth;$i++) {
            $dungeonMap[$i] = array();
            $heightMap[$i] = array();
            for ($j = 0;$j < $mapMaxHeight;$j++) {
                $dungeonMap[$i][$j] = "#";
                $heightMap[$i][$j] = "*";
                $itemMap[$i][$j] = "";
            }
        }
        $entranceHeight = "*";
        $exitHeight = "*";
        // determine what type of map this will be:
        $mapMode = "standard";
        if (rand(0, 4) == 0) {
            // is a feature map:
            $whichFeature = rand(0,4);
            switch ($whichFeature) {
              case 0:
              $mapMode = "template";
              break;
              case 1:
              $mapMode = "nest";
              break;
              default:
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
        
        
        // testing #############################
        $mapMode = "stairs";
  
           
        $turning = 0;
        if (rand(0, 4) == 0) {
            // this map will turn:
            $turning = $whichDirectionToTurn;
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
                
                
                // testing ###############
                 $numberOfStairs = 1;
           
                
                
                switch ($numberOfStairs) {
                    case 1:
                        // can be placed anywhere within safe zone (at least 6 tiles away from edge)
                        $thisCaseLength = rand(3, floor(12 / $numberOfStairs));
                    
                    
                    
           
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
                        
                        
                    //    echo "test: ".$thisCaseStartX.",".$thisCaseStartY." => ".$exitPointX.",".$exitPointY."<br/>";
                        
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
                                $dungeonMap[($i + $topLeftXPos) ][($j + $topLeftYPos) ] = $thisRow[$j];
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
            placeItems();
            outputDungeon();
            
            // save which direction to turn to database: ####################
            // $whichDirectionToTurn
            
        }
       
?>