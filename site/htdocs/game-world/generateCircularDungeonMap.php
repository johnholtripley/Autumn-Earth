<?php

include_once($_SERVER['DOCUMENT_ROOT'] . "/game-world/generateCircularDungeonMap-third-party-arrow-code.php");
include_once($_SERVER['DOCUMENT_ROOT'] . "/includes/dungeonMapConfig.php");
include_once($_SERVER['DOCUMENT_ROOT'] . "/game-world/generateBook.php");




if (isset($_GET["debug"])) {
    $proceduralDebug = true;
} else {
    $proceduralDebug = false;
}

if($proceduralDebug) {
    include_once($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
    include_once($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");
}


// see if this file is an include in getMap.php:
$isIncluded = false;
if (isset($isEmbeddedInGetMap)) {
    $isIncluded = true;
}

$isFirstTime = true;

if($proceduralDebug) {
?>
<style>
body, p {
font-family:arial,helvetica,sans-serif;font-size:14px;
}

.sequenceBlock {
    float: left;
    width: 22.5%;
    margin: 0 1.25% 2.5% 1.25%;
}

.sequenceBlock p {
    padding: 0;
    margin: 0;
}

.clearer {
    width: 100%;
    clear: both;
}

.wider {
    width: 97.5%;
}

/*
.sequenceBlock:nth-child(4n+1) {
    clear: left;
}
*/

img {
    display: block;
   width: 100%;
}
</style>
<?php
}




// avoid script time out:
set_time_limit(0);









if(isset($_GET["clearMaps"])) {

    if($isIncluded) {

$thisPlayersId = $chr;
} else {

    $thisPlayersId = 999;
        if(isset($_GET['chr'])) {
    $thisPlayersId = $_GET['chr'];
}
}


foreach ($dungeonDetails as $thisDungeonsName => $thisDungeonObject) {
   
  $dir = "../data/chr" . $thisPlayersId . "/dungeon/".$thisDungeonsName;
  
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
    
    /*
    // restore session file:
    if (!copy('../data/source/session.php', $dir.'/session.php')) {
    // error handling ########
    }
    */
    
    
  }

// delete cartography too:
  $cartographyDirectory = "../data/chr" . $thisPlayersId . "/cartography/".$thisDungeonsName;
 if (is_dir($cartographyDirectory)) { 
    if ($thisDirectory = opendir($cartographyDirectory)) {
      while (($file = readdir($thisDirectory)) !== false) {
      if(is_file($cartographyDirectory."/".$file)) {
        unlink($cartographyDirectory."/".$file);
      }
    }
    closedir($thisDirectory);
    }
  }

  // delete backgrounds too:
  $backgroundsDirectory = "../data/chr" . $thisPlayersId . "/dungeon/".$thisDungeonsName."/backgrounds";
 if (is_dir($backgroundsDirectory)) { 
    if ($thisDirectory = opendir($backgroundsDirectory)) {
      while (($file = readdir($thisDirectory)) !== false) {
      if(is_file($backgroundsDirectory."/".$file)) {
        unlink($backgroundsDirectory."/".$file);
      }
    }
    closedir($thisDirectory);
    }
  }

}

die();



}










class node
{
    public function __construct()
    {
        global $nodeList;
        $this->radius = 12;
        $this->type   = "NORMAL";
        $this->x      = 0;
        $this->y      = 0;
        $this->name   = count($nodeList);
        array_push($nodeList, $this);
    }
}

class joint
{
    public function __construct()
    {
        global $jointList;
        array_push($jointList, $this);
    }
}

class delaunayVertex
{
    public function __construct($x, $y)
    {
        $this->x                               = $x;
        $this->y                               = $y;
        $this->whichNode                       = null;
        $this->proximityToNeighboursVertical   = INF;
        $this->proximityToNeighboursHorizontal = INF;
        $this->neighbours                      = array();
    }
}

class delaunayEdge
{
    public function __construct($v0, $v1)
    {
        $this->v0 = $v0;
        $this->v1 = $v1;

    }

    public function equals($other)
    {
        return ($this->v0 === $other->v0 && $this->v1 === $other->v1);
    }

    public function inverse()
    {
        return new delaunayEdge($this->v1, $this->v0);
    }

}

class delaunayTriangle
{
    public function __construct($v0, $v1, $v2)
    {
        $this->v0 = $v0;
        $this->v1 = $v1;
        $this->v2 = $v2;

// calculate the circumcircle:
        // From: http://www.exaflop.org/docs/cgafaq/cga1.html

        $A = $this->v1->x - $this->v0->x;
        $B = $this->v1->y - $this->v0->y;
        $C = $this->v2->x - $this->v0->x;
        $D = $this->v2->y - $this->v0->y;

        $E = $A * ($this->v0->x + $this->v1->x) + $B * ($this->v0->y + $this->v1->y);
        $F = $C * ($this->v0->x + $this->v2->x) + $D * ($this->v0->y + $this->v2->y);

        $G = 2.0 * ($A * ($this->v2->y - $this->v1->y) - $B * ($this->v2->x - $this->v1->x));

// var EPSILON = 1.0e-6;
        if (abs($G) < 0.000001) {
            // Collinear - find extremes and use the midpoint:

            $minX = min($this->v0->x, $this->v1->x, $this->v2->x);
            $minY = min($this->v0->y, $this->v1->y, $this->v2->y);
            $maxX = max($this->v0->x, $this->v1->x, $this->v2->x);
            $maxY = max($this->v0->y, $this->v1->y, $this->v2->y);

            $this->center = new delaunayVertex(($minX + $maxX) / 2, ($minY + $maxY) / 2);

            $dx = $this->center->x - $minX;
            $dy = $this->center->y - $minY;
        } else {
            $cx = ($D * $E - $B * $F) / $G;
            $cy = ($A * $F - $C * $E) / $G;

            $this->center = new delaunayVertex($cx, $cy);

            $dx = $this->center->x - $this->v0->x;
            $dy = $this->center->y - $this->v0->y;
        }

        $this->radius_squared = $dx * $dx + $dy * $dy;
        $this->radius         = sqrt($this->radius_squared);

    }

    public function inCircumcircle($v)
    {
        $dx           = $this->center->x - $v->x;
        $dy           = $this->center->y - $v->y;
        $dist_squared = $dx * $dx + $dy * $dy;

        return ($dist_squared <= $this->radius_squared);
    }
}

function addNode($type, $x, $y) {
global $proceduralDebug;
    $newNode       = new node();
    $newNode->type = $type;

    if (getRNGNumber() > 0.5) {
        $x -= (2 + getRNGNumber());
        $y += (0.5);
    } else {
        $x += (0.5);
        $y -= (2 + getRNGNumber());
    }

    $newNode->x           = $x;
    $newNode->y           = $y;
    $newNode->hazards     = 0;
    $newNode->treasure    = 0;
    $newNode->radius      = getRNGNumber() * 10 + 15;
    $newNode->connections = 0;
  //  $newNode->connectedTo = array();
    // might be inefficient to call this every time:
    if($proceduralDebug) {
    moveNodesApart();
}

    return $newNode;
}

function addJoint($connectNodeAId, $connectNodeBId, $jointType = "", $whichKey = "")
{
    global $nodeList;
    $newJoint           = new joint();
    $newJoint->nodeA    = $nodeList[$connectNodeAId]->name;
    $newJoint->nodeB    = $nodeList[$connectNodeBId]->name;
    $newJoint->type     = $jointType;
    $newJoint->whichKey = $whichKey;
    if ($newJoint->whichKey != "") {
        $newJoint->isLocked = true;
    } else {
        $newJoint->isLocked = false;
    }

    $nodeList[$connectNodeAId]->connections++;
    $nodeList[$connectNodeBId]->connections++;
 //   array_push($nodeList[$connectNodeAId]->connectedTo, $connectNodeBId);
//    array_push($nodeList[$connectNodeBId]->connectedTo, $connectNodeAId);
    return $newJoint;
}

function lineIntersects($a, $b, $c, $d, $p, $q, $r, $s)
{
    // https://stackoverflow.com/questions/9043805/test-if-two-lines-intersect-javascript-function#answer-24392281
    // returns true if the line from (a,b)->(c,d) intersects with (p,q)->(r,s)
    $delta = ($c - $a) * ($s - $q) - ($r - $p) * ($d - $b);
    if ($delta == 0) {
        //return false;
    } else {
        $lambda = (($s - $q) * ($r - $a) + ($p - $r) * ($s - $b)) / $delta;
        $gamma  = (($b - $d) * ($r - $a) + ($c - $a) * ($s - $b)) / $delta;
        return (0 < $lambda && $lambda < 1) && (0 < $gamma && $gamma < 1);
    }
}

function anyJointHasIntersected()
{
    global $jointList, $nodeList;
    foreach ($jointList as $thisJoint) {
        foreach ($jointList as $thisInnerJoint) {
            if ($thisJoint !== $thisInnerJoint) {

                if (lineIntersects($nodeList[$thisJoint->nodeA]->x, $nodeList[$thisJoint->nodeA]->y, $nodeList[$thisJoint->nodeB]->x, $nodeList[$thisJoint->nodeB]->y, $nodeList[$thisInnerJoint->nodeA]->x, $nodeList[$thisInnerJoint->nodeA]->y, $nodeList[$thisInnerJoint->nodeB]->x, $nodeList[$thisInnerJoint->nodeB]->y)) {
                    return true;
                }
            }
        }
    }
    return false;
}

function getRNGNumber()
{
    return mt_rand(0, 10000) / 10000;
}

function moveNodesApart()
{
    global $nodeList;
    foreach ($nodeList as $thisOuterNode) {
        foreach ($nodeList as $thisNode) {
            if ($thisNode !== $thisOuterNode) {

                $xDifference            = $thisNode->x - $thisOuterNode->x;
                $yDifference            = $thisNode->y - $thisOuterNode->y;
                $distanceBetweenCentres = sqrt($xDifference * $xDifference + $yDifference * $yDifference);
                $spaceBetweenNodes      = ($distanceBetweenCentres - ($thisOuterNode->radius + $thisNode->radius)) * 0.5;
                if ($spaceBetweenNodes <= 0) {
                    // avoid division by zero:
                    if ($distanceBetweenCentres == 0) {
                        $distanceBetweenCentres = 0.1;
                    }
                    $xDifference = $xDifference / $distanceBetweenCentres * $spaceBetweenNodes;
                    $yDifference = $yDifference / $distanceBetweenCentres * $spaceBetweenNodes;
                    $thisOuterNode->x += $xDifference;
                    $thisOuterNode->y += $yDifference;
                    $thisNode->x -= $xDifference;
                    $thisNode->y -= $yDifference;
                }
            }
        }
    }
}

function outputConnections()
{
    global $nodeList, $jointList, $canvaDimension, $keyColours, $lockedJoints, $proceduralDebug;

    $outputCanvas = imagecreatetruecolor($canvaDimension, $canvaDimension);
    $groundColour = array(219, 215, 190);
    $ground       = imagecolorallocate($outputCanvas, $groundColour[0], $groundColour[1], $groundColour[2]);
    imagefilledrectangle($outputCanvas, 0, 0, $canvaDimension, $canvaDimension, $ground);
    // draw nodes:
    foreach ($nodeList as $thisNode) {
        if ($thisNode->type == "KEYHOLDER") {

            $thisNodeColour = imagecolorallocate($outputCanvas, $keyColours[$thisNode->whichKey][0], $keyColours[$thisNode->whichKey][1], $keyColours[$thisNode->whichKey][2]);

//$thisNodeColour = imagecolorallocate($outputCanvas, 255,235,15);
        } else if ($thisNode->type == "START") {
            $thisNodeColour = imagecolorallocate($outputCanvas, 255, 255, 255);
        } else if ($thisNode->type == "END") {
            $thisNodeColour = imagecolorallocate($outputCanvas, 64, 64, 64);
        } else {
            $thisNodeColour = imagecolorallocate($outputCanvas, 128, 128, 128);
        }
        imagefilledellipse($outputCanvas, $thisNode->x, $thisNode->y, $thisNode->radius * 2, $thisNode->radius * 2, $thisNodeColour);
        // imagefilledrectangle($outputCanvas, $thisNode->x-$thisNode->radius, $thisNode->y-$thisNode->radius,$thisNode->x+$thisNode->radius,$thisNode->y+$thisNode->radius, $thisNodeColour);

// check for contents:

        // echo "Node #" . $thisNode->name . " has " . $thisNode->hazards . " hazards and £" . $thisNode->treasure . "<br>";

        if ($thisNode->hazards > 0) {
            imagearc($outputCanvas, $thisNode->x, $thisNode->y, $thisNode->radius * 2, $thisNode->radius * 2, 0, 360, imagecolorallocate($outputCanvas, 255, 0, 0));
        }
        if ($thisNode->treasure > 0) {
            imagearc($outputCanvas, $thisNode->x, $thisNode->y, $thisNode->radius * 2, $thisNode->radius * 2, 0, 360, imagecolorallocate($outputCanvas, 0, 255, 0));
        }
    }
    // draw joints:
    imagesetthickness($outputCanvas, 2);
    $lockedJoints = array();
    foreach ($jointList as $thisJoint) {
        if ($thisJoint->isLocked) {
            $thisJointColour = imagecolorallocate($outputCanvas, $keyColours[$thisJoint->whichKey][0], $keyColours[$thisJoint->whichKey][1], $keyColours[$thisJoint->whichKey][2]);
            //$thisJointColour = imagecolorallocate($outputCanvas, 255,235,15);

            $lockedJoints["-" . $nodeList[$thisJoint->nodeA]->name . "-" . $nodeList[$thisJoint->nodeB]->name] = $thisJoint->whichKey;
// add the reverse in as well to be able to check both directions:
            $lockedJoints["-" . $nodeList[$thisJoint->nodeB]->name . "-" . $nodeList[$thisJoint->nodeA]->name] = $thisJoint->whichKey;

        } else {
            $thisJointColour = imagecolorallocate($outputCanvas, 32, 32, 32);
        }

        if ($thisJoint->type == "") {
            imageline($outputCanvas, $nodeList[$thisJoint->nodeA]->x, $nodeList[$thisJoint->nodeA]->y, $nodeList[$thisJoint->nodeB]->x, $nodeList[$thisJoint->nodeB]->y, $thisJointColour);
        } else if ($thisJoint->type == "?") {

            //imagedashedline($outputCanvas, $nodeList[$thisJoint->nodeA]->x, $nodeList[$thisJoint->nodeA]->y, $nodeList[$thisJoint->nodeB]->x, $nodeList[$thisJoint->nodeB]->y, $thisJointColour);
            $thisJointColour = imagecolorallocate($outputCanvas, 255, 255, 255);
            imageline($outputCanvas, $nodeList[$thisJoint->nodeA]->x, $nodeList[$thisJoint->nodeA]->y, $nodeList[$thisJoint->nodeB]->x, $nodeList[$thisJoint->nodeB]->y, $thisJointColour);
        } else if ($thisJoint->type == ":") {
// window 'joint':
            imagedashedline($outputCanvas, $nodeList[$thisJoint->nodeA]->x, $nodeList[$thisJoint->nodeA]->y, $nodeList[$thisJoint->nodeB]->x, $nodeList[$thisJoint->nodeB]->y, $thisJointColour);

        } else {
            // draw valve:

            $myArrow        = new GDArrow();
            $myArrow->image = $outputCanvas;
            $myArrow->color = $thisJointColour;

            if ($thisJoint->type == ">") {
                // forward valve
                $myArrow->x1 = $nodeList[$thisJoint->nodeA]->x;
                $myArrow->y1 = $nodeList[$thisJoint->nodeA]->y;
                $myArrow->x2 = $nodeList[$thisJoint->nodeB]->x;
                $myArrow->y2 = $nodeList[$thisJoint->nodeB]->y;
            } else {
                // backward valve
                $myArrow->x1 = $nodeList[$thisJoint->nodeB]->x;
                $myArrow->y1 = $nodeList[$thisJoint->nodeB]->y;
                $myArrow->x2 = $nodeList[$thisJoint->nodeA]->x;
                $myArrow->y2 = $nodeList[$thisJoint->nodeA]->y;

            }
            $myArrow->angle  = 25;
            $myArrow->radius = 12;
            $myArrow->drawGDArrow();
        }


        if($proceduralDebug) {
        echo "<br>joint from " . $thisJoint->nodeA . " (" . strtolower($nodeList[$thisJoint->nodeA]->type) . ") to " . $thisJoint->nodeB . " (" . strtolower($nodeList[$thisJoint->nodeB]->type) . ")";
if($thisJoint->isLocked) {
echo " - is locked";
} 
}
         
    }

if($proceduralDebug) {
    echo '</div><div class="sequenceBlock">';
    ob_start();
    imagejpeg($outputCanvas, null, 100);
    $rawImageBytes = ob_get_clean();
    echo "<img src='data:image/jpeg;base64," . base64_encode($rawImageBytes) . "'>";
}
    imagedestroy($outputCanvas);
 if($proceduralDebug) {
    echo "</div>";
}
}


function chooseRandomElements($inputString) {
    $processedString = $inputString;
    while (strpos($processedString, '{% random %}') !== false) {
        $thisStep = $processedString;
        $randomStartPos = strpos($processedString, '{% random %}');
        $randomEndPos = strpos($processedString, '{% end-random %}');
        $theseChoices = substr($processedString, $randomStartPos+12, $randomEndPos-$randomStartPos-12);
        $theseChoicesArray = explode('{% or %}', $theseChoices);
        $thisChoiceMade = $theseChoicesArray[mt_rand(0, count($theseChoicesArray) - 1)];
        $thisStep = substr($processedString, 0, $randomStartPos);
        $thisStep .= $thisChoiceMade;
        $thisStep .= substr($processedString, $randomEndPos+16, (strlen($processedString) - $randomEndPos));
        $processedString = $thisStep;
    }
    
    return $processedString;
}


function init() {
    global $nodeList, $jointList, $canvaDimension, $keyColours, $storedSeed, $unadjustedSeed, $proceduralDebug, $thisMapsId, $thisPlayersId, $dungeonName, $thisMapsId, $isFirstTime, $isIncluded, $proceduralMap, $map, $chr, $randomDungeonName, $randomDungeonSeed;
if($isIncluded) {
$thisMapsId = intval($map);
$thisPlayersId = $chr;
} else {
      $thisMapsId = $_GET['requestedMap'];
    $thisPlayersId = 999;
        if(isset($_GET['chr'])) {
    $thisPlayersId = $_GET['chr'];
}
}
  

    $keyColours = array(
        array(255, 0, 64),
        array(255, 235, 15),
        array(15, 134, 255),
        array(19, 209, 46)
    );
    $canvaDimension = 600;
    $nodeList = array();
    $jointList = array();


if($isIncluded) {

   if (($randomDungeonSeed != '') && $isFirstTime) {
        $storedSeed = intval($_GET["seed"]);
        // allow the seed to be regenerated if this seed fails:
        $isFirstTime = false;
    } else {
        // http://php.net/manual/en/function.mt_srand.php
        list($usec, $sec) = explode(' ', microtime());
        $storedSeed       = floor((float) $sec + ((float) $usec * 100000));
    }

} else {


    if (isset($_GET["seed"]) && $isFirstTime) {
        $storedSeed = intval($_GET["seed"]);
        // allow the seed to be regenerated if this seed fails:
        $isFirstTime = false;
    } else {
        // http://php.net/manual/en/function.mt_srand.php
        list($usec, $sec) = explode(' ', microtime());
        $storedSeed       = floor((float) $sec + ((float) $usec * 100000));
    }
}

    if($isIncluded) {
$dungeonName = $randomDungeonName;
    } else {
    $dungeonName = $_GET["dungeonName"];
}



    


    $unadjustedSeed = $storedSeed;
    // make sure the level is unique even if the same seed is used:
    $storedSeed -= intval($thisMapsId);
  
    mt_srand($storedSeed);
}

function growGrammar($thisGrammar, $iterations)
{
    global $proceduralDebug;
    $grammarTransformations = array(
        
        "X" => array("{O[K#]|,##OX}","{O[K#]|,}O##X","O{##X,}O[K#]"),

        // valves could be lock and keys:
        //">" => array("O[K#]XO##"),
    );
    $currentKey = 0;

if($proceduralDebug) {
    echo '<div class="clearer"></div>';
    echo '<div class="sequenceBlock"><p>start grammar: ' . htmlentities($thisGrammar) . '<br>';
}
    for ($i = 0; $i < $iterations; $i++) {
        $characterCounter = 0;
        do {
            $thisCharacter = substr($thisGrammar, $characterCounter, 1);

            if (array_key_exists($thisCharacter, $grammarTransformations)) {
                $thisTransform = $grammarTransformations[$thisCharacter][mt_rand(0, count($grammarTransformations[$thisCharacter]) - 1)];
                // check for locks and keys:
                if (strpos($thisTransform, 'K#') !== false) {
                    $thisTransform = str_replace("K#", "K#" . $currentKey, $thisTransform);
                    $thisTransform = str_replace("##", "#" . $currentKey . "#", $thisTransform);

                    $currentKey++;
                }
                if($proceduralDebug) {
                echo $thisCharacter . " => " . $thisTransform . " &hellip; ";
            }
                $thisGrammar = substr_replace($thisGrammar, $thisTransform, $characterCounter, 1);
                $characterCounter += strlen($thisTransform);
             if($proceduralDebug) {
                echo " now " . htmlentities($thisGrammar) . "<br>";
            }
            }
            $characterCounter++;
        } while ($characterCounter < strlen($thisGrammar));
    }
    // remove any remaining non-plottable grammars:
    $thisGrammar = str_replace("X", "O", $thisGrammar);
    $thisGrammar = str_replace("Z", "OO", $thisGrammar);


if($proceduralDebug) {
    echo "final grammar: " . htmlentities($thisGrammar) . "</p>";
}
    return $thisGrammar;
}

function parseStringGrammar($thisGrammar) {
    global $nodeList, $jointList, $canvaDimension;
    $characterCounter               = 0;
    $thisDepth                      = 0;
    $thisBranchesParents            = array();
    $thisLoopingBranchesParents     = array();
    $thisBranchesTerminalNodes      = array();
    $nextJointTypes                 = array();
    $thisBranchesTerminalJointTypes = array();
    $nextJointLock                  = array();
    $thisBranchesTerminalJointLocks = array();
    do {
        $thisCharacter = substr($thisGrammar, $characterCounter, 1);
        switch ($thisCharacter) {
            case "S":
                // start node:
                $newNode        = addNode("START", $canvaDimension / 2, $canvaDimension / 2);
                $activeParents  = array($newNode);
                $nextJointTypes = array("");
                $nextJointLock  = array("");
                break;
            case "E":
                // end node:
                $newNode = addNode("END", $activeParents[0]->x + mt_rand(-10, 10), $activeParents[0]->y + mt_rand(-10, 10));

                for ($i = 0; $i < count($activeParents); $i++) {
                    // make sure it's not a dead end:
                    if ($nextJointTypes[$i] != "|") {
                        $newJoint = addJoint($activeParents[$i]->name, $newNode->name, $nextJointTypes[$i], $nextJointLock[$i]);
                    }
                }

                $nextJointTypes = array("");
                $nextJointLock  = array("");
                break;
            case "O":
                // add node:
                $newNode = addNode("NORMAL", $activeParents[0]->x + mt_rand(-10, 10), $activeParents[0]->y + mt_rand(-10, 10));
                for ($i = 0; $i < count($activeParents); $i++) {
                    // make sure it's not a dead end:
                    if ($nextJointTypes[$i] != "|") {
                        $newJoint = addJoint($activeParents[$i]->name, $newNode->name, $nextJointTypes[$i], $nextJointLock[$i]);
                    }
                }
                $activeParents = array($newNode);

                $nextJointTypes = array("");
                $nextJointLock  = array("");
                break;
            case "(":
                $thisLoopingBranchesParents[$thisDepth] = $activeParents;
                break;
            case ")":
                // create joint between last node and the original opening node:
                for ($i = 0; $i < count($activeParents); $i++) {
                    // make sure it's not a dead end:
                    if ($nextJointTypes[$i] != "|") {
                        $newJoint = addJoint($activeParents[$i]->name, $thisLoopingBranchesParents[$thisDepth][0]->name, $nextJointTypes[$i], $nextJointLock[$i]);
                    }
                }
                // looping closed - restore the pointer to the opening node:
                $activeParents = $thisLoopingBranchesParents[$thisDepth];
                 break;
            case "{":
                // branch opens
                $thisDepth++;
                $thisBranchesParents[$thisDepth]            = $activeParents;
                $thisBranchesTerminalNodes[$thisDepth]      = array();
                $thisBranchesTerminalJointTypes[$thisDepth] = array();
                $thisBranchesTerminalJointLocks[$thisDepth] = array();
                echo $thisDepth."...";
                break;

            case "}":
                // branching closes - add in this last branch's terminal nodes:
                for ($i = 0; $i < count($activeParents); $i++) {
                    array_push($thisBranchesTerminalNodes[$thisDepth], $activeParents[$i]);
                }
                for ($i = 0; $i < count($nextJointTypes); $i++) {
                    array_push($thisBranchesTerminalJointTypes[$thisDepth], $nextJointTypes[$i]);
                }
                for ($i = 0; $i < count($nextJointLock); $i++) {
                    array_push($thisBranchesTerminalJointLocks[$thisDepth], $nextJointLock[$i]);
                }
                $activeParents  = $thisBranchesTerminalNodes[$thisDepth];
                $nextJointTypes = $thisBranchesTerminalJointTypes[$thisDepth];
                $nextJointLock  = $thisBranchesTerminalJointLocks[$thisDepth];
                $thisDepth--;
                break;
            case ",":
                // end of this branch - keep track of the terminal nodes
                for ($i = 0; $i < count($activeParents); $i++) {
                    array_push($thisBranchesTerminalNodes[$thisDepth], $activeParents[$i]);
                }
                for ($i = 0; $i < count($nextJointTypes); $i++) {
                    array_push($thisBranchesTerminalJointTypes[$thisDepth], $nextJointTypes[$i]);
                }
                for ($i = 0; $i < count($nextJointLock); $i++) {
                    array_push($thisBranchesTerminalJointLocks[$thisDepth], $nextJointLock[$i]);
                }
                // reset to the parent:
                $activeParents  = $thisBranchesParents[$thisDepth];
                $nextJointTypes = array("");
                $nextJointLock  = array("");
                break;
            case "[":
                // node contains something - get all characters up to the closing ] to see what needs to be added:
                $closingBracketPos = strpos($thisGrammar, "]", $characterCounter);
                $nodeContents      = substr($thisGrammar, $characterCounter + 1, ($closingBracketPos - $characterCounter - 1));
                $characterCounter += strlen($nodeContents);
                // contents are comma separated:
                $nodeContentsArray = explode(",", $nodeContents);
                for ($i = 0; $i < count($nodeContentsArray); $i++) {
                    switch (substr($nodeContentsArray[$i], 0, 1)) {
                        case "!":
                            // hazard - add to last created node:
                            $newNode->hazards++;
                            break;
                        case "$":
                            // treasure
                            $newNode->treasure++;
                            break;
                        case "K":
                            // K#1 = key for lock #1
                            $keyArray          = explode("#", $nodeContentsArray[$i]);
                            $newNode->type     = "KEYHOLDER";
                            $newNode->whichKey = $keyArray[1];
                            break;
                        default:
                            // nothing
                    }
                }
                break;
            case ">":
                // forward valve:
                $nextJointTypes[count($nextJointTypes) - 1] = ">";
                break;
            case "<":
                // backward valve:
                $nextJointTypes[count($nextJointTypes) - 1] = "<";
                break;
            case "?":
                // secret passage:
                $nextJointTypes[count($nextJointTypes) - 1] = "?";
                break;
            case ":":
                // 'window' - the nodes are visible from each other, but not directly traversable:
                $nextJointTypes[count($nextJointTypes) - 1] = ":";
                break;
            case "|":
                // dead end:
                $nextJointTypes[count($nextJointTypes) - 1] = "|";
                break;
            case "#":
                // locked joint
                // #1# = lock for key #1
                // #12# = lock for key #12
                $closingHashPos = strpos($thisGrammar, "#", $characterCounter + 1);
                $whichKey = substr($thisGrammar, $characterCounter + 1, ($closingHashPos - $characterCounter - 1));
                $characterCounter += strlen($whichKey) + 1;
                $nextJointLock[count($nextJointLock) - 1] = $whichKey;
                break;

            default:
                // nothing
        }
        $characterCounter++;
    } while ($characterCounter < strlen($thisGrammar));
}

function inCircumcircle($triangle)
{
    global $delaunayEdges, $activeDelaunayVertex;
    if ($triangle->inCircumcircle($activeDelaunayVertex)) {
        array_push($delaunayEdges, new delaunayEdge($triangle->v0, $triangle->v1));
        array_push($delaunayEdges, new delaunayEdge($triangle->v1, $triangle->v2));
        array_push($delaunayEdges, new delaunayEdge($triangle->v2, $triangle->v0));

        return false;
    }

    return true;
}

function addDelaunayVertex($vertex, $triangles)
{
    global $delaunayEdges, $activeDelaunayVertex;
    $delaunayEdges = array();
// Remove triangles with circumcircles containing the vertex:

    $activeDelaunayVertex = $vertex;
    $triangles            = array_filter($triangles, "inCircumcircle");

    $delaunayEdges = uniqueDelaunayEdges($delaunayEdges);
    // Create new triangles from the unique edges and new vertex
    for ($i = 0; $i < count($delaunayEdges); $i++) {

        array_push($triangles, new delaunayTriangle($delaunayEdges[$i]->v0, $delaunayEdges[$i]->v1, $activeDelaunayVertex));
    }

    return $triangles;
}

function uniqueDelaunayEdges($edges)
{
    //  remove duplicate edges from the array
    $uniqueEdges = array();
    for ($i = 0; $i < count($edges); $i++) {
        $thisEdge = $edges[$i];
        $isUnique = true;
        for ($j = 0; $j < count($edges); $j++) {
            if ($i != $j) {
                $thisInnerEdge = $edges[$j];
                if ($thisEdge->equals($thisInnerEdge) || $thisEdge->inverse()->equals($thisInnerEdge)) {
                    $isUnique = false;
                    break;
                }
            }
        }
        if ($isUnique) {
            array_push($uniqueEdges, $thisEdge);
        }
    }
    return $uniqueEdges;
}

function createDelaunayGraph($graphType)
{
    global $delaunayVertices, $delaunayTriangles, $canvaDimension, $boundingTriangle, $delaunayNodeRadius, $centreVertex, $allDelaunayEdges;
    $delaunayVertices = array();

    $edgeBuffer       = 80;
    $numberOfVertices = 64;

    $delaunayNodeRadius = 10;

    $delaunayTriangles = array();

    switch ($graphType) {
        case "random":
            for ($i = 0; $i < $numberOfVertices; $i++) {
                $newVertex = new delaunayVertex(mt_rand($edgeBuffer, $canvaDimension - $edgeBuffer), mt_rand($edgeBuffer, $canvaDimension - $edgeBuffer));
                array_push($delaunayVertices, $newVertex);
            }
            break;
        case "grid":
            for ($i = 0; $i < sqrt($numberOfVertices); $i++) {
                for ($j = 0; $j < sqrt($numberOfVertices); $j++) {

                    $newVertex = new delaunayVertex($i * 50 + $edgeBuffer, $j * 50 + $edgeBuffer);

                    array_push($delaunayVertices, $newVertex);
                }
            }
            break;

        case "wonky-grid":
   
        // set the surrounds of the graph to be regular to avoid 'bunching' of edges:

for ($j = 0; $j <= sqrt($numberOfVertices); $j++) {
$i=0;
    $newVertex = new delaunayVertex($i * 50 + $edgeBuffer, $j * 50 + $edgeBuffer);
    array_push($delaunayVertices, $newVertex);
    $i=sqrt($numberOfVertices);
        $newVertex = new delaunayVertex($i * 50 + $edgeBuffer, $j * 50 + $edgeBuffer);
    array_push($delaunayVertices, $newVertex);
}

for ($i = 1; $i < sqrt($numberOfVertices)-1; $i++) {
$j=0;
  $newVertex = new delaunayVertex($i * 50 + $edgeBuffer, $j * 50 + $edgeBuffer);
    array_push($delaunayVertices, $newVertex);
    $j=sqrt($numberOfVertices);
       $newVertex = new delaunayVertex($i * 50 + $edgeBuffer, $j * 50 + $edgeBuffer);
    array_push($delaunayVertices, $newVertex);
}

// draw the inner 'wonky' vertices:
            for ($i = 1; $i < sqrt($numberOfVertices)-1; $i++) {
                for ($j = 1; $j < sqrt($numberOfVertices)-1; $j++) {

                    $newVertex = new delaunayVertex($i * 50 + $edgeBuffer + mt_rand(-10, 10), $j * 50 + $edgeBuffer + mt_rand(-10, 10));

                    array_push($delaunayVertices, $newVertex);
                }
            }
break;
        case "offset-grid":
            $colOffsets = array();
            $rowOffsets = array();

            for ($i = 0; $i < sqrt($numberOfVertices); $i++) {
                array_push($colOffsets, mt_rand(-25, 25));
                array_push($rowOffsets, mt_rand(-25, 25));
            }
            for ($i = 0; $i < sqrt($numberOfVertices); $i++) {
                for ($j = 0; $j < sqrt($numberOfVertices); $j++) {

                    $newVertex = new delaunayVertex($i * 50 + $edgeBuffer + $colOffsets[$i], $j * 50 + $edgeBuffer + $colOffsets[$j]);

                    array_push($delaunayVertices, $newVertex);
                }
            }
            break;

    }

    $minDistance = 20;
// push nodes apart a bit:
    for ($i = 0; $i < 6; $i++) {
        foreach ($delaunayVertices as &$thisOuterVertex) {
            foreach ($delaunayVertices as &$thisVertex) {
                if ($thisVertex !== $thisOuterVertex) {

                    $xDifference            = $thisVertex->x - $thisOuterVertex->x;
                    $yDifference            = $thisVertex->y - $thisOuterVertex->y;
                    $distanceBetweenCentres = sqrt($xDifference * $xDifference + $yDifference * $yDifference);
                    // $spaceBetweenNodes      = ($distanceBetweenCentres - ($delaunayNodeRadius * 6));
                    if ($distanceBetweenCentres <= $minDistance) {
                        // avoid division by zero:
                        if ($distanceBetweenCentres == 0) {
                            $distanceBetweenCentres = 0.1;
                        }
                        // $xDifference = $xDifference / $distanceBetweenCentres * $spaceBetweenNodes;
                        // $yDifference = $yDifference / $distanceBetweenCentres * $spaceBetweenNodes;
                        $thisOuterVertex->x += $minDistance;
                        $thisOuterVertex->y -= $minDistance;
                        $thisVertex->x -= $minDistance;
                        $thisVertex->y += $minDistance;
                    }
                }
            }
        }
    }

    $minX = INF;
    $minY = INF;
    $maxX = 0;
    $maxY = 0;
    $distanceFromCentre = INF;
    $centreVertex = null;
// find boundaries
    foreach ($delaunayVertices as &$thisVertex) {
        if ($thisVertex->x < $minX) {
            $minX = $thisVertex->x;
        }
        if ($thisVertex->y < $minY) {
            $minY = $thisVertex->y;
        }
        if ($thisVertex->x > $maxX) {
            $maxX = $thisVertex->x;
        }
        if ($thisVertex->y > $maxY) {
            $maxY = $thisVertex->y;
        }

// find closest node to the centre:
        $xDifference = $thisVertex->x - $canvaDimension / 2;
        $yDifference = $thisVertex->y - $canvaDimension / 2;
        $thisDistanceFromCentre = sqrt($xDifference * $xDifference + $yDifference * $yDifference);
        if ($thisDistanceFromCentre < $distanceFromCentre) {
            $distanceFromCentre = $thisDistanceFromCentre;
            $centreVertex = $thisVertex;
        }

    }

    // do triangulation:
    // thanks - Joshua Bell. https://travellermap.com/tmp/delaunay.htm

    // create a bounding triangle for all vertices:
    $dx = ($maxX - $minX) * 10;
    $dy = ($maxY - $minY) * 10;

    $boundingTriangle = new delaunayTriangle(
        new delaunayVertex($minX - $dx, $minY - $dy * 3),
        new delaunayVertex($minX - $dx, $maxY + $dy),
        new delaunayVertex($maxX + $dx * 3, $maxY + $dy)
    );

    array_push($delaunayTriangles, $boundingTriangle);

// do triangulation for each vertex:
    for ($i = 0; $i < count($delaunayVertices); $i++) {
        $delaunayTriangles = addDelaunayVertex($delaunayVertices[$i], $delaunayTriangles);
    }

// remove triangles with shared edges with the bounding triangle:
    $delaunayTriangles = array_filter($delaunayTriangles, "removeSharedTriangleEdges");

// find all edges used in the graph:
    $allDelaunayEdges = array();
    foreach ($delaunayTriangles as &$thisTriangle) {

        if ((!in_array(new delaunayEdge($thisTriangle->v0, $thisTriangle->v1), $allDelaunayEdges)) && (!in_array(new delaunayEdge($thisTriangle->v1, $thisTriangle->v0), $allDelaunayEdges))) {
            array_push($allDelaunayEdges, new delaunayEdge($thisTriangle->v0, $thisTriangle->v1));
        }
        if ((!in_array(new delaunayEdge($thisTriangle->v1, $thisTriangle->v2), $allDelaunayEdges)) && (!in_array(new delaunayEdge($thisTriangle->v2, $thisTriangle->v1), $allDelaunayEdges))) {
            array_push($allDelaunayEdges, new delaunayEdge($thisTriangle->v1, $thisTriangle->v2));
        }
        if ((!in_array(new delaunayEdge($thisTriangle->v0, $thisTriangle->v2), $allDelaunayEdges)) && (!in_array(new delaunayEdge($thisTriangle->v2, $thisTriangle->v0), $allDelaunayEdges))) {
            array_push($allDelaunayEdges, new delaunayEdge($thisTriangle->v0, $thisTriangle->v2));
        }
    }

}

function sortNodesByConnections($a, $b)
{
    if ($a->connections == $b->connections) {return 0;}
    return ($a->connections < $b->connections) ? 1 : -1;
}

function randomArraySorting($a, $b)
{
    return mt_rand(-1, 1);
}

function findUnusedNeighbouringDelaunayVertex($whichEdge, $whichVertex, $partnerNode, $activeVertex, $activeNode)
{
    global $verticesUsedOnDelaunayGraph, $nodesPlottedOnDelaunayGraph, $edgesUsedOnDelaunayGraph, $connectionsPlottedOnDelaunayGraph, $allDelaunayEdges;
    $otherVertices = array(
        'v0' => 'v1',
        'v1' => 'v0'
    );

   
    $firstVertexToCheck  = $otherVertices[$whichVertex];
 

    if (($whichEdge->$whichVertex === $activeVertex) && (!in_array($whichEdge->$firstVertexToCheck, $verticesUsedOnDelaunayGraph))) {
        $whichEdge->$firstVertexToCheck->whichNode = $partnerNode;
        array_push($nodesPlottedOnDelaunayGraph, $partnerNode);
        array_push($verticesUsedOnDelaunayGraph, $whichEdge->$firstVertexToCheck);
        array_push($edgesUsedOnDelaunayGraph, new delaunayEdge($whichEdge->$whichVertex, $whichEdge->$firstVertexToCheck));
        array_push($connectionsPlottedOnDelaunayGraph, $activeNode->name . "-" . $partnerNode->name);

        return $whichEdge->$firstVertexToCheck;
    } 

    return false;
}

function findPartnerNode($activeNode)
{
    global $jointList, $nodeList, $connectionsPlottedOnDelaunayGraph;
    $partnerNode = null;
    foreach ($jointList as $thisJoint) {
        if ($nodeList[$thisJoint->nodeA]->name === $activeNode->name) {
            // make sure this connection hasn't already been plotted:
            if (!in_array($nodeList[$thisJoint->nodeB]->name . "-" . $activeNode->name, $connectionsPlottedOnDelaunayGraph)) {
                if (!in_array($activeNode->name . "-" . $nodeList[$thisJoint->nodeB]->name, $connectionsPlottedOnDelaunayGraph)) {
                    $partnerNode = $nodeList[$thisJoint->nodeB];
                }
            }

        } else if ($nodeList[$thisJoint->nodeB]->name === $activeNode->name) {
            if (!in_array($nodeList[$thisJoint->nodeA]->name . "-" . $activeNode->name, $connectionsPlottedOnDelaunayGraph)) {
                if (!in_array($activeNode->name . "-" . $nodeList[$thisJoint->nodeA]->name, $connectionsPlottedOnDelaunayGraph)) {
                    $partnerNode = $nodeList[$thisJoint->nodeA];
                }
            }
        }
    }
    return $partnerNode;
}

function canPathfindThroughDelaunayGraph($startNode, $endNode)
{
    global $allDelaunayEdges, $delaunayVertices, $verticesUsedOnDelaunayGraph, $edgesUsedOnDelaunayGraph, $delaunayTriangles, $nodesPlottedOnDelaunayGraph, $lockedJoints, $proceduralDebug, $jointList;
    // find start and end vertices:
    foreach ($delaunayVertices as $thisVertex) {
        if ($thisVertex->whichNode === $startNode) {
            $startVertex = $thisVertex;
        }
        if ($thisVertex->whichNode === $endNode) {
            $endVertex = $thisVertex;
        }
    }

    // find edges that connect those (moving through unused vertices)
    $searchVertices = array();
    $uncheckedVertices = array();
    $heuristic = sqrt((($endVertex->x - $startVertex->x) * ($endVertex->x - $startVertex->x)) + (($endVertex->y - $startVertex->y) * ($endVertex->y - $startVertex->y)));
    $searchVertices[$startVertex->x . "-" . $startVertex->y] = array('vertex' => $startVertex, 'parentNode' => null, 'edge' => null, 'cost' => 0, 'summedCost' => $heuristic);
    array_push($uncheckedVertices, $searchVertices[$startVertex->x . "-" . $startVertex->y]);
    $targetFound = false;

    // create an array with all unused edges in:
    $unusedEdges = array();
    foreach ($allDelaunayEdges as $thisEdge) {
        if (!((in_array(new delaunayEdge($thisEdge->v0, $thisEdge->v1), $edgesUsedOnDelaunayGraph)) || (in_array(new delaunayEdge($thisEdge->v1, $thisEdge->v0), $edgesUsedOnDelaunayGraph)))) {
            if (!(in_array($thisEdge, $unusedEdges))) {
                array_push($unusedEdges, $thisEdge);
            }
        }
    }

    do {
        // get the next vertex:
        $thisNextVertex = array_shift($uncheckedVertices);
        // check if this is the target:
        if (($thisNextVertex['vertex'] === $endVertex)) {
            $targetFound = true;

        } else {
            // add connected vertices:
            foreach ($allDelaunayEdges as $thisEdge) {
                if ($thisEdge->v1 == $thisNextVertex['vertex']) {
                    // check the edge hasn't already been used:
                    if (in_array($thisEdge, $unusedEdges)) {
                        $otherVertex = $thisEdge->v0;
                        // Check new vertex isn't a node that has already been used (unless it's the target node)
                        if (($otherVertex->whichNode === null) || ($otherVertex === $endVertex)) {
                            array_push($unusedEdges, $thisEdge);

                            $thisCost  = intval($thisNextVertex['cost']);
                            $heuristic = sqrt((($endVertex->x - $otherVertex->x) * ($endVertex->x - $otherVertex->x)) + (($endVertex->y - $otherVertex->y) * ($endVertex->y - $otherVertex->y)));
                            if (isset($searchVertices[$otherVertex->x . "-" . $otherVertex->y])) {
                                // update the details if this is faster
                                if ($thisCost < $searchVertices[$otherVertex->x . "-" . $otherVertex->y]['cost']) {
                                    $searchVertices[$otherVertex->x . "-" . $otherVertex->y]['parentNode'] = $thisNextVertex;
                                    $searchVertices[$otherVertex->x . "-" . $otherVertex->y]['cost']       = $thisCost;
                                    $searchVertices[$otherVertex->x . "-" . $otherVertex->y]['edge']       = $thisEdge;
                                    $searchVertices[$otherVertex->x . "-" . $otherVertex->y]['summedCost'] = $heuristic + $thisCost;
                                }
                            } else {

                                $searchVertices[$otherVertex->x . "-" . $otherVertex->y] = array('vertex' => $otherVertex, 'parentNode' => $thisNextVertex, 'edge' => $thisEdge, 'cost' => $thisCost, 'summedCost' => $heuristic + $thisCost);
                                array_push($uncheckedVertices, $searchVertices[$otherVertex->x . "-" . $otherVertex->y]);
                            }
                        }
                    }
                } else if ($thisEdge->v0 == $thisNextVertex['vertex']) {
                    // check the edge hasn't already been used:

                    if (in_array($thisEdge, $unusedEdges)) {
                        $otherVertex = $thisEdge->v1;

                        if (($otherVertex->whichNode === null) || ($otherVertex === $endVertex)) {

                            array_push($unusedEdges, $thisEdge);
                            $thisCost  = intval($thisNextVertex['cost']);
                            $heuristic = sqrt((($endVertex->x - $otherVertex->x) * ($endVertex->x - $otherVertex->x)) + (($endVertex->y - $otherVertex->y) * ($endVertex->y - $otherVertex->y)));
                            if (isset($searchVertices[$otherVertex->x . "-" . $otherVertex->y])) {
                                // update the details if this is faster
                                if ($thisCost < $searchVertices[$otherVertex->x . "-" . $otherVertex->y]['cost']) {
                                    $searchVertices[$otherVertex->x . "-" . $otherVertex->y]['parentNode'] = $thisNextVertex;
                                    $searchVertices[$otherVertex->x . "-" . $otherVertex->y]['cost']       = $thisCost;
                                    $searchVertices[$otherVertex->x . "-" . $otherVertex->y]['edge']       = $thisEdge;
                                    $searchVertices[$otherVertex->x . "-" . $otherVertex->y]['summedCost'] = $heuristic + $thisCost;
                                }
                            } else {

                                $searchVertices[$otherVertex->x . "-" . $otherVertex->y] = array('vertex' => $otherVertex, 'parentNode' => $thisNextVertex, 'edge' => $thisEdge, 'cost' => $thisCost, 'summedCost' => $heuristic + $thisCost);
                                array_push($uncheckedVertices, $searchVertices[$otherVertex->x . "-" . $otherVertex->y]);
                            }
                        }
                    }
                }
            }
        }
        // echo count($uncheckedVertices) . ", ";
    } while ((count($uncheckedVertices) > 0) && !$targetFound);
    if ($targetFound) {

$savedThisNextVertex = $thisNextVertex;
$blockedNodeName = 0;
        while ($thisNextVertex['parentNode'] !== null) {
            array_push($edgesUsedOnDelaunayGraph, $thisNextVertex['edge']);
            if (!in_array($thisNextVertex['vertex'], $verticesUsedOnDelaunayGraph)) {
                array_push($verticesUsedOnDelaunayGraph, $thisNextVertex['vertex']);
            }
// mark the used nodes as well so they can't be used:
            
            if ($thisNextVertex['vertex']->whichNode === null) {
                $thisNextVertex['vertex']->whichNode       = new node();
                $thisNextVertex['vertex']->whichNode->type = "BLOCKED";
                // use the start and end node in the name to make each path found route unique:
                $thisNextVertex['vertex']->whichNode->name = "blocked".$startNode->name."-".$endNode->name."-".$blockedNodeName;
                $blockedNodeName++;
                $firstNewNode = $thisNextVertex['vertex']->whichNode;
                array_push($nodesPlottedOnDelaunayGraph, $thisNextVertex['vertex']->whichNode);

               // $newJoint = addJoint($thisNextVertex['vertex']->whichNode->name, $thisNextVertex['parentNode']['vertex']->whichNode->name);
            }

            $thisNextVertex = $thisNextVertex['parentNode'];
        }


        // update lockedJoints to have the start node and the first added node instead of the start and end node (so the first connection can be marked if it's locked)
if(isset($firstNewNode)) {
        $originalLockedConnection    = "-" . $startNode->name . "-" . $endNode->name;
        $originalLockedConnectionRev = "-" . $endNode->name . "-" . $startNode->name;

        $newLockedConnection    = "-" . $startNode->name . "-" . $firstNewNode->name;
        $newLockedConnectionRev = "-" . $firstNewNode->name . "-" . $startNode->name;

        if (isset($lockedJoints[$originalLockedConnection])) {
            $lockedJoints[$newLockedConnection] = $lockedJoints[$originalLockedConnection];
            unset($lockedJoints[$originalLockedConnection]);
        }

        if (isset($lockedJoints[$originalLockedConnectionRev])) {
            $lockedJoints[$newLockedConnectionRev] = $lockedJoints[$originalLockedConnectionRev];

            unset($lockedJoints[$originalLockedConnectionRev]);
        }
    }





    } else {
        if($proceduralDebug) {
        echo '<div class="sequenceBlock"><p>Couldn\'t find path through the Delaunay graph.</p></div>';
    }
    }
    return $targetFound;
}

function compareByEdges($a, $b)
{
    if (($a->v0 === $b->v0) && ($a->v1 === $b->v1)) {

        return 1;
    }
    if (($a->v0 === $b->v1) && ($a->v1 === $b->v0)) {

        return 1;
    }
    return -1;
}

function plotConnectivityOnDelaunayGraph()
{
    global $centreVertex, $delaunayVertices, $nodeList, $jointList, $delaunayTriangles, $edgesUsedOnDelaunayGraph, $verticesUsedOnDelaunayGraph, $nodesPlottedOnDelaunayGraph, $connectionsPlottedOnDelaunayGraph, $allDelaunayEdges, $proceduralDebug;

    // for each strand, plot the entire path out. mark used edges and whether a node has all of its connections used. pathfind to find unused edges

    // find the graph node with the most connections:
    $sortedNodeList = $nodeList;
    usort($sortedNodeList, 'sortNodesByConnections');

    $nodesPlottedOnDelaunayGraph       = array();
    $verticesUsedOnDelaunayGraph       = array();
    $edgesUsedOnDelaunayGraph          = array();
    $connectionsPlottedOnDelaunayGraph = array();

    $activeNode = $sortedNodeList[0];

    // find the centre vertex:
    for ($i = 0; $i < count($delaunayVertices); $i++) {
        if ($delaunayVertices[$i] === $centreVertex) {
            $delaunayVertices[$i]->whichNode = $activeNode;
            array_push($nodesPlottedOnDelaunayGraph, $activeNode);
            array_push($verticesUsedOnDelaunayGraph, $centreVertex);
            break;
        }
    }

    //   echo "centre node picked is " . $activeNode->name . "<br>";

    $activeVertex = $centreVertex;

    $connectionsRemainingToBePlotted = 0;
    foreach ($nodeList as $thisNode) {
        $connectionsRemainingToBePlotted += $thisNode->connections;
    }
    // connections are counted at each node, so for the joint number, only need half that number:
    $connectionsRemainingToBePlotted /= 2;

    do {
// find a node connected to the active Node:
        $partnerNode       = findPartnerNode($activeNode);
        $foundUnusedVertex = false;
        if ($partnerNode === null) {
            //   echo "end of this branch<br>";
            // find another node that hasn't been plotted yet (ideally one that's already been plotted):

            $foundAlreadyUsedNodeToConnectTo = false;
            foreach ($sortedNodeList as $thisNode) {
                if ($thisNode->connections > 0) {
                    if (in_array($thisNode, $nodesPlottedOnDelaunayGraph)) {
                        $activeNode                      = $thisNode;
                        $partnerNode                     = findPartnerNode($activeNode);
                        $foundAlreadyUsedNodeToConnectTo = true;
                        // find the vertex that has this node:
                        foreach ($verticesUsedOnDelaunayGraph as $thisVertex) {
                            if ($thisVertex->whichNode === $activeNode) {
                                $activeVertex = $thisVertex;
                            }
                        }
                        if ($partnerNode === null) {
                            // is a check needed here - or will it just fail the foundUnusedVertex check?  ###
                        }
                    }
                }
            }
            if (!$foundAlreadyUsedNodeToConnectTo) {
                foreach ($sortedNodeList as $thisNode) {
                    if ($thisNode->connections > 0) {

                        $activeNode  = $thisNode;
                        $partnerNode = findPartnerNode($activeNode);

                        // find the vertex that has this node:
                        foreach ($verticesUsedOnDelaunayGraph as $thisVertex) {
                            if ($thisVertex->whichNode === $activeNode) {
                                $activeVertex = $thisVertex;
                            }
                        }
                        if ($partnerNode === null) {

                            // is a check needed here - or will it just fail the foundUnusedVertex check?  ###
                        }
                    }
                }
            }
        }

        // check if the partner node has already been plotted
        // check if the edge has been plotted already:
        if (in_array($partnerNode, $nodesPlottedOnDelaunayGraph)) {
            if (!(in_array($activeNode->name . "-" . $partnerNode->name, $connectionsPlottedOnDelaunayGraph)) && !(in_array($partnerNode->name . "-" . $activeNode->name, $connectionsPlottedOnDelaunayGraph))) {
                //   echo "need pathfinding from " . $activeNode->name . " -- " . $partnerNode->name;
                if (canPathfindThroughDelaunayGraph($activeNode, $partnerNode)) {
                    //     echo " ...found path<br>";
                    array_push($connectionsPlottedOnDelaunayGraph, $activeNode->name . "-" . $partnerNode->name);
                    $activeNode->connections--;
                    $partnerNode->connections--;
                    $activeNode = $partnerNode;
                    $connectionsRemainingToBePlotted--;
                    // find the vertex that has this node:
                    foreach ($verticesUsedOnDelaunayGraph as $thisVertex) {
                        if ($thisVertex->whichNode === $activeNode) {
                            $activeVertex = $thisVertex;
                        }
                    }
                    $foundUnusedVertex = true;
                }
            } else {
                // connection has been already plotted
                $activeNode->connections--;
                $partnerNode->connections--;
                $activeNode = $partnerNode;
                $connectionsRemainingToBePlotted--;
                // find the vertex that has this node:
                foreach ($verticesUsedOnDelaunayGraph as $thisVertex) {
                    if ($thisVertex->whichNode === $activeNode) {
                        $activeVertex = $thisVertex;
                    }
                }
                $foundUnusedVertex = true;
            }

        } else {
            // find an unused vertex that joins the active vertex:

            // randomly order edges for more variation:
            $sortedRandomEdges = $allDelaunayEdges;
            usort($sortedRandomEdges, 'randomArraySorting');
            foreach ($sortedRandomEdges as &$thisEdge) {
                $checkVertex = findUnusedNeighbouringDelaunayVertex($thisEdge, 'v0', $partnerNode, $activeVertex, $activeNode);
                if ($checkVertex !== false) {
                    array_push($connectionsPlottedOnDelaunayGraph, $activeNode->name . "-" . $partnerNode->name);
                    //     echo "plotted " . $activeNode->name . "(" . $activeNode->type . ") -- " . $partnerNode->name . "(" . $partnerNode->type . ")<br>";
                    $activeNode->connections--;
                    $partnerNode->connections--;
                    $activeNode   = $partnerNode;
                    $activeVertex = $checkVertex;
                    $connectionsRemainingToBePlotted--;
                    $foundUnusedVertex = true;
                    break;
                }
                $checkVertex = findUnusedNeighbouringDelaunayVertex($thisEdge, 'v1', $partnerNode, $activeVertex, $activeNode);
                if ($checkVertex !== false) {
                    array_push($connectionsPlottedOnDelaunayGraph, $activeNode->name . "-" . $partnerNode->name);
                    //   echo "plotted " . $activeNode->name . "(" . $activeNode->type . ") -- " . $partnerNode->name . "(" . $partnerNode->type . ")<br>";
                    $activeNode->connections--;
                    $partnerNode->connections--;
                    $activeNode   = $partnerNode;
                    $activeVertex = $checkVertex;
                    $connectionsRemainingToBePlotted--;
                    $foundUnusedVertex = true;
                    break;
                }
               

            }

        }

    } while (($connectionsRemainingToBePlotted > 0) && ($foundUnusedVertex));
    if (!$foundUnusedVertex) {
        if($proceduralDebug) {
        echo '<div class="sequenceBlock"><p>Failed to find connections on the Delaunay graph.<br>RESTARTING&hellip;</p></div>';
    
    }
    }
    return $foundUnusedVertex;
}

function removeSharedTriangleEdges($triangle)
{
    global $boundingTriangle;
    return !($triangle->v0 == $boundingTriangle->v0 || $triangle->v0 == $boundingTriangle->v1 || $triangle->v0 == $boundingTriangle->v2 ||
        $triangle->v1 == $boundingTriangle->v0 || $triangle->v1 == $boundingTriangle->v1 || $triangle->v1 == $boundingTriangle->v2 ||
        $triangle->v2 == $boundingTriangle->v0 || $triangle->v2 == $boundingTriangle->v1 || $triangle->v2 == $boundingTriangle->v2);
}

function outputDelaunayGraph()
{
    global $canvaDimension, $delaunayVertices, $delaunayTriangles, $delaunayNodeRadius, $centreVertex, $edgesUsedOnDelaunayGraph, $keyColours, $lockedJoints, $proceduralDebug;

    $outputCanvas = imagecreatetruecolor($canvaDimension, $canvaDimension);
    $groundColour = array(219, 215, 190);
    $ground       = imagecolorallocate($outputCanvas, $groundColour[0], $groundColour[1], $groundColour[2]);
    imagefilledrectangle($outputCanvas, 0, 0, $canvaDimension, $canvaDimension, $ground);

    // draw triangles:

    //for ($i = 0; $i < count($delaunayTriangles); $i++) {
    foreach ($delaunayTriangles as &$thisTriangle) {
        //  imagepolygon($outputCanvas, array($thisTriangle->v0->x, $thisTriangle->v0->y, $thisTriangle->v1->x, $thisTriangle->v1->y, $thisTriangle->v2->x, $thisTriangle->v2->y), 3, $edgeColour);
        if ((in_array(new delaunayEdge($thisTriangle->v0, $thisTriangle->v1), $edgesUsedOnDelaunayGraph)) || (in_array(new delaunayEdge($thisTriangle->v1, $thisTriangle->v0), $edgesUsedOnDelaunayGraph))) {
            imagesetthickness($outputCanvas, 2);

// check nodes attached to these vertices to see if a joint exists which is locked
            $theseConnectedNodes = "";
            foreach ($delaunayVertices as $thisVertex) {
                if ($thisVertex->whichNode === $thisTriangle->v0->whichNode) {
                    $theseConnectedNodes .= "-" . $thisVertex->whichNode->name;
                }
                if ($thisVertex->whichNode === $thisTriangle->v1->whichNode) {
                    $theseConnectedNodes .= "-" . $thisVertex->whichNode->name;
                }
            }
            if (isset($lockedJoints[$theseConnectedNodes])) {
                $edgeColour = imagecolorallocate($outputCanvas, $keyColours[$lockedJoints[$theseConnectedNodes]][0], $keyColours[$lockedJoints[$theseConnectedNodes]][1], $keyColours[$lockedJoints[$theseConnectedNodes]][2]);

            } else {
                $edgeColour = imagecolorallocate($outputCanvas, 50, 50, 50);
            }
        } else {
            imagesetthickness($outputCanvas, 1);
            $edgeColour = imagecolorallocate($outputCanvas, 194, 190, 169);
        }
        imageline($outputCanvas, $thisTriangle->v0->x, $thisTriangle->v0->y, $thisTriangle->v1->x, $thisTriangle->v1->y, $edgeColour);
        if ((in_array(new delaunayEdge($thisTriangle->v2, $thisTriangle->v1), $edgesUsedOnDelaunayGraph)) || (in_array(new delaunayEdge($thisTriangle->v1, $thisTriangle->v2), $edgesUsedOnDelaunayGraph))) {
            imagesetthickness($outputCanvas, 2);
            // check nodes attached to these vertices to see if a joint exists which is locked
            $theseConnectedNodes = "";
            foreach ($delaunayVertices as $thisVertex) {
                if ($thisVertex->whichNode === $thisTriangle->v1->whichNode) {
                    $theseConnectedNodes .= "-" . $thisVertex->whichNode->name;
                }
                if ($thisVertex->whichNode === $thisTriangle->v2->whichNode) {
                    $theseConnectedNodes .= "-" . $thisVertex->whichNode->name;
                }
            }
            if (isset($lockedJoints[$theseConnectedNodes])) {
                $edgeColour = imagecolorallocate($outputCanvas, $keyColours[$lockedJoints[$theseConnectedNodes]][0], $keyColours[$lockedJoints[$theseConnectedNodes]][1], $keyColours[$lockedJoints[$theseConnectedNodes]][2]);

            } else {
                $edgeColour = imagecolorallocate($outputCanvas, 50, 50, 50);
            }
        } else {
            imagesetthickness($outputCanvas, 1);
            $edgeColour = imagecolorallocate($outputCanvas, 194, 190, 169);
        }
        imageline($outputCanvas, $thisTriangle->v1->x, $thisTriangle->v1->y, $thisTriangle->v2->x, $thisTriangle->v2->y, $edgeColour);
        if ((in_array(new delaunayEdge($thisTriangle->v0, $thisTriangle->v2), $edgesUsedOnDelaunayGraph)) || (in_array(new delaunayEdge($thisTriangle->v2, $thisTriangle->v0), $edgesUsedOnDelaunayGraph))) {
            imagesetthickness($outputCanvas, 2);
            // check nodes attached to these vertices to see if a joint exists which is locked
            $theseConnectedNodes = "";
            foreach ($delaunayVertices as $thisVertex) {
                if ($thisVertex->whichNode === $thisTriangle->v0->whichNode) {
                    $theseConnectedNodes .= "-" . $thisVertex->whichNode->name;
                }
                if ($thisVertex->whichNode === $thisTriangle->v2->whichNode) {
                    $theseConnectedNodes .= "-" . $thisVertex->whichNode->name;
                }
            }
            if (isset($lockedJoints[$theseConnectedNodes])) {
                $edgeColour = imagecolorallocate($outputCanvas, $keyColours[$lockedJoints[$theseConnectedNodes]][0], $keyColours[$lockedJoints[$theseConnectedNodes]][1], $keyColours[$lockedJoints[$theseConnectedNodes]][2]);

            } else {
                $edgeColour = imagecolorallocate($outputCanvas, 50, 50, 50);
            }
        } else {
            imagesetthickness($outputCanvas, 1);
            $edgeColour = imagecolorallocate($outputCanvas, 194, 190, 169);
        }
        imageline($outputCanvas, $thisTriangle->v2->x, $thisTriangle->v2->y, $thisTriangle->v0->x, $thisTriangle->v0->y, $edgeColour);

    }

    // draw nodes:

    for ($i = 0; $i < count($delaunayVertices); $i++) {
        if (isset($delaunayVertices[$i]->whichNode)) {
            // $nodeColour = imagecolorallocate($outputCanvas, 255, 255, 255);

            if ($delaunayVertices[$i]->whichNode->type == "KEYHOLDER") {
                $nodeColour = imagecolorallocate($outputCanvas, $keyColours[$delaunayVertices[$i]->whichNode->whichKey][0], $keyColours[$delaunayVertices[$i]->whichNode->whichKey][1], $keyColours[$delaunayVertices[$i]->whichNode->whichKey][2]);
            } else if ($delaunayVertices[$i]->whichNode->type == "START") {
                $nodeColour = imagecolorallocate($outputCanvas, 255, 255, 255);
            } else if ($delaunayVertices[$i]->whichNode->type == "END") {
                $nodeColour = imagecolorallocate($outputCanvas, 64, 64, 64);
            } else if ($delaunayVertices[$i]->whichNode->type == "BLOCKED") {
                $nodeColour = imagecolorallocate($outputCanvas, 200, 200, 200);
            } else {

                $nodeColour = imagecolorallocate($outputCanvas, 128, 128, 128);
            }

        } else {
// unused node:
            $nodeColour = imagecolorallocate($outputCanvas, 227, 224, 205);
        }
        imagefilledellipse($outputCanvas, $delaunayVertices[$i]->x, $delaunayVertices[$i]->y, $delaunayNodeRadius, $delaunayNodeRadius, $nodeColour);
    }
    if($proceduralDebug) {
    echo '<div class="sequenceBlock">';
    ob_start();
    imagejpeg($outputCanvas, null, 100);
    $rawImageBytes = ob_get_clean();

    echo "<img src='data:image/jpeg;base64," . base64_encode($rawImageBytes) . "'></div>";
}
    imagedestroy($outputCanvas);
}

function sortVerticesByConnections($a, $b)
{
    if (count($a->neighbours) == count($b->neighbours)) {return 0;}
    return (count($a->neighbours) < count($b->neighbours)) ? 1 : -1;
}

        



function createGridLayout()
    {
    global $delaunayVertices, $verticesUsedOnDelaunayGraph, $edgesUsedOnDelaunayGraph, $allDelaunayEdges, $proceduralDebug, $dungeonDetails, $dungeonName;
    $maxNodeDimension = 140;

    $sortedVertices = $verticesUsedOnDelaunayGraph;
    usort($sortedVertices, 'sortVerticesByConnections');

    // increase the nodes to be half way between that and the closest other used node:

switch ($dungeonDetails[$dungeonName]['roomType']) {
    case "adjoining-rooms":


    // make the rooms as large as possible within their own grid:
    foreach($verticesUsedOnDelaunayGraph as $thisVertex) {
        foreach($verticesUsedOnDelaunayGraph as $thisNeighbour) {
            if ($thisVertex !== $thisNeighbour) {

                // calculate distance between them:

                $halfWayBetweenTheseTwoVerticesHorizontal = abs($thisNeighbour->x - $thisVertex->x) / 2;
                $halfWayBetweenTheseTwoVerticesVertical = abs($thisNeighbour->y - $thisVertex->y) / 2;

                // if there's no difference (on the same axis) then don't use it to determine size:

                if ($halfWayBetweenTheseTwoVerticesHorizontal == 0) {
                    $halfWayBetweenTheseTwoVerticesHorizontal = INF;
                    }

                if ($halfWayBetweenTheseTwoVerticesVertical == 0) {
                    $halfWayBetweenTheseTwoVerticesVertical = INF;
                    }

                // make sure this vertex has a node (so should be considered):

                if ($thisNeighbour->whichNode !== null) {
                    if ($halfWayBetweenTheseTwoVerticesHorizontal < $thisVertex->proximityToNeighboursHorizontal) {
                        $thisVertex->proximityToNeighboursHorizontal = $halfWayBetweenTheseTwoVerticesHorizontal;
                        }

                    if ($halfWayBetweenTheseTwoVerticesVertical < $thisVertex->proximityToNeighboursVertical) {
                        $thisVertex->proximityToNeighboursVertical = $halfWayBetweenTheseTwoVerticesVertical;
                        }
                    }
                }
            }
        }

    

if($dungeonDetails[$dungeonName]['fullyExpandRooms']) {
    outputSizedNodesLayout();
            foreach($sortedVertices as $thisVertex) {
        $smallestHorizontalSpacingAvailable = INF;
        $smallestVerticalSpacingAvailable = INF;
        foreach($sortedVertices as $thisNeighbour) {
            if ($thisVertex !== $thisNeighbour) {
                $horizontalSpaceBetweenExpandedBlock = abs($thisNeighbour->x - $thisVertex->x) - $thisVertex->proximityToNeighboursHorizontal - $thisNeighbour->proximityToNeighboursHorizontal;
                $verticalSpaceBetweenExpandedBlock = abs($thisNeighbour->y - $thisVertex->y) - $thisVertex->proximityToNeighboursVertical - $thisNeighbour->proximityToNeighboursVertical;
                if ($horizontalSpaceBetweenExpandedBlock < $smallestHorizontalSpacingAvailable) {
                    if ($horizontalSpaceBetweenExpandedBlock >= 0) {
                        $smallestHorizontalSpacingAvailable = $horizontalSpaceBetweenExpandedBlock;
                    }
                }

                if ($verticalSpaceBetweenExpandedBlock < $smallestVerticalSpacingAvailable) {
                    if ($verticalSpaceBetweenExpandedBlock >= 0)
                        {
                        $smallestVerticalSpacingAvailable = $verticalSpaceBetweenExpandedBlock;
                        }
                    }
                }
            }

        $thisVertex->proximityToNeighboursHorizontal+= $smallestHorizontalSpacingAvailable;
        $thisVertex->proximityToNeighboursVertical+= $smallestVerticalSpacingAvailable;

        // make sure they don't get too big:

        if ($thisVertex->proximityToNeighboursHorizontal > $maxNodeDimension) {
            $thisVertex->proximityToNeighboursHorizontal = $maxNodeDimension;
            }

        if ($thisVertex->proximityToNeighboursVertical > $maxNodeDimension) {
            $thisVertex->proximityToNeighboursVertical = $maxNodeDimension;
            }
        }
    }
        break;
    case "cavern":
        // make the rooms as large as possible without hitting another room:
   
   
    foreach($sortedVertices as $thisVertex) {
      // make the circular nodes reach at least half way:
       $largestRadiusAvailable = INF;
        foreach($sortedVertices as $thisNeighbour) {
            if ($thisVertex !== $thisNeighbour) {
                    $radiusBetweenNodes = sqrt( (abs($thisNeighbour->x - $thisVertex->x)*abs($thisNeighbour->x - $thisVertex->x))  + (abs($thisNeighbour->y - $thisVertex->y) * abs($thisNeighbour->y - $thisVertex->y))  )/2;
                      if ($radiusBetweenNodes < $largestRadiusAvailable) {
                    if ($radiusBetweenNodes >= 0) {
                        $largestRadiusAvailable = $radiusBetweenNodes;
                    }
                }
                }
            }
        $thisVertex->proximityToNeighboursHorizontal = $largestRadiusAvailable;
$thisVertex->proximityToNeighboursVertical = $largestRadiusAvailable;
}
// run again to get as close as possible:
    outputSizedNodesLayout();


foreach($sortedVertices as $thisVertex) {
    $smallestRadiusSpacingAvailable = INF;
    foreach($sortedVertices as $thisNeighbour) {
        if ($thisVertex !== $thisNeighbour) {
            $radiusBetweenNodes = sqrt( (abs($thisNeighbour->x - $thisVertex->x)*abs($thisNeighbour->x - $thisVertex->x))  + (abs($thisNeighbour->y - $thisVertex->y) * abs($thisNeighbour->y - $thisVertex->y))  )/2;
            $radiusSpaceRemaining = $radiusBetweenNodes*2 - $thisNeighbour->proximityToNeighboursHorizontal - $thisVertex->proximityToNeighboursHorizontal;
         //   echo $radiusBetweenNodes.", ".$thisNeighbour->proximityToNeighboursHorizontal.", ".$thisVertex->proximityToNeighboursHorizontal."<br>";
            if($radiusSpaceRemaining<$smallestRadiusSpacingAvailable) {
            if($radiusSpaceRemaining>=0) {
 $smallestRadiusSpacingAvailable = $radiusSpaceRemaining;


}
            }
        }
    }
    
    $thisVertex->proximityToNeighboursHorizontal+= $smallestRadiusSpacingAvailable;
$thisVertex->proximityToNeighboursVertical+= $smallestRadiusSpacingAvailable;

}









    
        break;

}









    }




function removeDiagonalEdges() {
    
global $allDelaunayEdges;
foreach ($allDelaunayEdges as $key => $thisEdge) {
//echo $thisEdge->v0->x.", ".$thisEdge->v1->x."   ---    "  .$thisEdge->v0->y.", ".$thisEdge->v1->y;

if(($thisEdge->v0->x != $thisEdge->v1->x) && ($thisEdge->v0->y != $thisEdge->v1->y)) {
// not on the same axis, so remove:
//     echo "  remove";
unset($allDelaunayEdges[$key]);
}
//   echo"<br>";
}
 
}

function outputSizedNodesLayout() {

    global $canvaDimension, $delaunayVertices, $delaunayTriangles, $delaunayNodeRadius, $centreVertex, $edgesUsedOnDelaunayGraph, $keyColours, $lockedJoints, $allDelaunayEdges, $verticesUsedOnDelaunayGraph, $requiredWidth, $requiredHeight, $minLeft, $minTop, $proceduralDebug, $dungeonDetails, $dungeonName;

    $outputCanvas = imagecreatetruecolor($canvaDimension, $canvaDimension);
    $groundColour = array(219, 215, 190);
    $ground       = imagecolorallocate($outputCanvas, $groundColour[0], $groundColour[1], $groundColour[2]);
    imagefilledrectangle($outputCanvas, 0, 0, $canvaDimension, $canvaDimension, $ground);

// find boundary of the drawn area:
    $minLeft = INF;
    $minTop = INF;
    $maxRight = 0;
    $maxBottom = 0;


    // draw nodes:

    for ($i = 0; $i < count($delaunayVertices); $i++) {
        if (isset($delaunayVertices[$i]->whichNode)) {
            // $nodeColour = imagecolorallocate($outputCanvas, 255, 255, 255);

            if ($delaunayVertices[$i]->whichNode->type == "KEYHOLDER") {
                $nodeColour = imagecolorallocate($outputCanvas, $keyColours[$delaunayVertices[$i]->whichNode->whichKey][0], $keyColours[$delaunayVertices[$i]->whichNode->whichKey][1], $keyColours[$delaunayVertices[$i]->whichNode->whichKey][2]);
            } else if ($delaunayVertices[$i]->whichNode->type == "START") {
                $nodeColour = imagecolorallocate($outputCanvas, 255, 255, 255);
            } else if ($delaunayVertices[$i]->whichNode->type == "END") {
                $nodeColour = imagecolorallocate($outputCanvas, 64, 64, 64);
            } else if ($delaunayVertices[$i]->whichNode->type == "BLOCKED") {
                $nodeColour = imagecolorallocate($outputCanvas, 200, 200, 200);
            } else {

                $nodeColour = imagecolorallocate($outputCanvas, 128, 128, 128);
            }

        } else {
// unused node:
            $nodeColour = imagecolorallocate($outputCanvas, 227, 224, 205);
        }



switch ($dungeonDetails[$dungeonName]['roomType']) {
case "adjoining-rooms":


if($proceduralDebug) {

// does this need debugging to find out why it's still INF rather than just ignore any that are? ##########
if($delaunayVertices[$i]->proximityToNeighboursHorizontal != INF) {

        imagefilledrectangle($outputCanvas, $delaunayVertices[$i]->x - $delaunayVertices[$i]->proximityToNeighboursHorizontal, $delaunayVertices[$i]->y - $delaunayVertices[$i]->proximityToNeighboursVertical, $delaunayVertices[$i]->x + $delaunayVertices[$i]->proximityToNeighboursHorizontal, $delaunayVertices[$i]->y + $delaunayVertices[$i]->proximityToNeighboursVertical, $nodeColour);

// border:
        imagerectangle($outputCanvas, $delaunayVertices[$i]->x - $delaunayVertices[$i]->proximityToNeighboursHorizontal, $delaunayVertices[$i]->y - $delaunayVertices[$i]->proximityToNeighboursVertical, $delaunayVertices[$i]->x + $delaunayVertices[$i]->proximityToNeighboursHorizontal, $delaunayVertices[$i]->y + $delaunayVertices[$i]->proximityToNeighboursVertical, imagecolorallocate($outputCanvas, 255, 255, 255));
    }
}
break;
case "cavern":
// php needs width not radius:
              $outputWidth = $delaunayVertices[$i]->proximityToNeighboursHorizontal * 2;

          imagefilledellipse($outputCanvas, ($delaunayVertices[$i]->x), ($delaunayVertices[$i]->y), intval($outputWidth), intval($outputWidth), $nodeColour);
          // border:
imageellipse($outputCanvas, $delaunayVertices[$i]->x, $delaunayVertices[$i]->y, intval($outputWidth), intval($outputWidth), imagecolorallocate($outputCanvas, 255, 255, 255));
break;
}



// find the limits of any drawn rooms:
if (isset($delaunayVertices[$i]->whichNode)) {
if(($delaunayVertices[$i]->x - $delaunayVertices[$i]->proximityToNeighboursHorizontal) < $minLeft) {
$minLeft = $delaunayVertices[$i]->x - ($delaunayVertices[$i]->proximityToNeighboursHorizontal);
}

if(($delaunayVertices[$i]->y - $delaunayVertices[$i]->proximityToNeighboursVertical) <  $minTop) {
     $minTop = ($delaunayVertices[$i]->y - $delaunayVertices[$i]->proximityToNeighboursVertical);

}
if(($delaunayVertices[$i]->x + $delaunayVertices[$i]->proximityToNeighboursHorizontal) > $maxRight) {
$maxRight = ($delaunayVertices[$i]->x + $delaunayVertices[$i]->proximityToNeighboursHorizontal);
}
if(($delaunayVertices[$i]->y + $delaunayVertices[$i]->proximityToNeighboursVertical)>$maxBottom) {
$maxBottom = ($delaunayVertices[$i]->y + $delaunayVertices[$i]->proximityToNeighboursVertical);
}
}

    }

// draw the boundary:
imagerectangle($outputCanvas,$minLeft,$minTop,$maxRight,$maxBottom,imagecolorallocate($outputCanvas, 255, 255, 255));

$requiredWidth = $maxRight - $minLeft;
$requiredHeight = $maxBottom - $minTop;

// draw edges (corridors):
    foreach($allDelaunayEdges as $thisEdge) {
         if ((in_array(new delaunayEdge($thisEdge->v0, $thisEdge->v1), $edgesUsedOnDelaunayGraph)) || (in_array(new delaunayEdge($thisEdge->v1, $thisEdge->v0), $edgesUsedOnDelaunayGraph))) {
        imagesetthickness($outputCanvas, 2);
          // check nodes attached to these vertices to see if a joint exists which is locked
            $theseConnectedNodes = "";
            foreach ($verticesUsedOnDelaunayGraph as $thisVertex) {
                if ($thisVertex->whichNode === $thisEdge->v0->whichNode) {
                    $theseConnectedNodes .= "-" . $thisVertex->whichNode->name;
                }
                if ($thisVertex->whichNode === $thisEdge->v1->whichNode) {
                    $theseConnectedNodes .= "-" . $thisVertex->whichNode->name;
                }
            }
            if (isset($lockedJoints[$theseConnectedNodes])) {

                $edgeColour = imagecolorallocate($outputCanvas, $keyColours[$lockedJoints[$theseConnectedNodes]][0], $keyColours[$lockedJoints[$theseConnectedNodes]][1], $keyColours[$lockedJoints[$theseConnectedNodes]][2]);

            } else {
                $edgeColour = imagecolorallocate($outputCanvas, 50, 50, 50);
            }
    } else {
        imagesetthickness($outputCanvas, 1);
            $edgeColour = imagecolorallocate($outputCanvas, 194, 190, 169);
    }
    
          
            imageline($outputCanvas, $thisEdge->v0->x, $thisEdge->v0->y, $thisEdge->v1->x, $thisEdge->v1->y, $edgeColour);
    }





if($proceduralDebug) {
    echo '<div class="sequenceBlock">';
    ob_start();
    imagejpeg($outputCanvas, null, 100);
    $rawImageBytes = ob_get_clean();

    echo "<img src='data:image/jpeg;base64," . base64_encode($rawImageBytes) . "'></div>";
}
    imagedestroy($outputCanvas);

 
}


function outputJSONContent() {
global $proceduralDebug, $proceduralMap, $itemMap, $drawnTileDoors, $drawnTileKeys, $proceduralMapTilesX, $proceduralMapTilesY, $storedSeed, $thisMapsId, $thisPlayersId, $entranceX, $entranceY, $exitX, $exitY, $dungeonName, $dungeonDetails, $outputJSON, $templateGraphicsToAppend, $templateNPCsToAppend, $templateItemsToAppend, $templateHotspotsToAppend, $allTemplateJSON, $templateOffsetX, $templateOffsetY, $placedItems, $doorsJSON, $unadjustedSeed, $isIncluded, $proceduralMapTrack;



$outputJSON = '{"map":{"zoneName": "'.$dungeonDetails[$dungeonName]['fullName'].' - level #'.abs($thisMapsId).' ('.$unadjustedSeed.')",';
$outputJSON .='"region": "Teldrassil", ';
$outputJSON .='"isInside": true, ';
if(isset($dungeonDetails[$dungeonName]['ambientSounds'])){

$outputJSON .= '"ambientSounds": '.json_encode(json_decode($dungeonDetails[$dungeonName]['ambientSounds'])).',';
}
$outputJSON .='"seed": '.$storedSeed.', ';
$outputJSON .= '"entrance": ['.$entranceX.','.$entranceY.'],';


$collisionsString ='"collisions": [';


  for ($i = 0; $i < $proceduralMapTilesX; $i++) {   
  $collisionsString .= '[';   
            for ($j = 0; $j < $proceduralMapTilesY; $j++) {
        if($proceduralMap[$i][$j] == "e") {
            // entrance or exit:
            $collisionsString.= '"d", ';
        } else if($proceduralMap[$i][$j] == "#") {
            $collisionsString.= '1, ';
        } else {
            $collisionsString.= '0, ';
        }

    }

    // remove last comma:
$collisionsString = rtrim($collisionsString, ', ');

    $collisionsString .= '],'; 
}
// remove last comma:
$collisionsString = rtrim($collisionsString, ', ');
$collisionsString .= ']';


 $terrainString = '"terrain": [';

 for ($i = 0; $i < $proceduralMapTilesX; $i++) {   
  $terrainString .= '[';   
            for ($j = 0; $j < $proceduralMapTilesY; $j++) {



switch ($proceduralMap[$i][$j]) {
    case "e":
        $terrainString.= '4, ';
        break;
    case "-":
    if($dungeonDetails[$dungeonName]['needsDynamicallyCreatedBackground']) {
        // these tiles will be drawn onto the background:
        $terrainString.= '"*", ';
    } else {
        $terrainString.= '0, ';
    }
        
        break;
    case "#":
        $terrainString.= '1, ';
        break;
    default:
        $terrainString.= '"*", ';
        break;
}


    
    }
    // remove last comma:
$terrainString = rtrim($terrainString, ', ');
    $terrainString .= '],'; 
}
// remove last comma:
$terrainString = rtrim($terrainString, ', ');

$terrainString .= ']';



$elevationString = '"properties": [';

  for ($i = 0; $i < $proceduralMapTilesX; $i++) {   
  $elevationString .= '[';   
            for ($j = 0; $j < $proceduralMapTilesY; $j++) {
                if($proceduralMapTrack[$i][$j] != ".") {
                    // make anything walking on a track be raised slightly:
                    $elevationString.= '{"elevation":8}, ';
                } else {
                    $elevationString.= '{}, ';
                }
               
                }
                // remove last comma:
$elevationString = rtrim($elevationString, ', ');
                $elevationString .= '],'; 
            }
            // remove last comma:
$elevationString = rtrim($elevationString, ', ');
$elevationString .= ']';

// map templates in (add the {} to get it to convert):
$collisions = json_decode('{'.$collisionsString.'}', true);



$terrain = json_decode('{'.$terrainString.'}', true);
$elevations = json_decode('{'.$elevationString.'}', true);




$graphicsToAdd = array();
$graphicsBeingUsedForThisMap = json_decode('['.$dungeonDetails[$dungeonName]['graphics'].']');
for ($i=0;$i<count($graphicsBeingUsedForThisMap);$i++) {
$graphicsToAdd[$graphicsBeingUsedForThisMap[$i]->src] = $i;

}

$templateGraphicsToAppend = '';


for ($t = 0; $t < count($allTemplateJSON); $t++) {
    $templateHeight = count($allTemplateJSON[$t]['template']['terrain']);
    $templateWidth = count($allTemplateJSON[$t]['template']['terrain'][0]);
    $graphicsBeingUsedForThisTemplate = $allTemplateJSON[$t]['template']['graphics'];
    for ($i = 0; $i < $templateHeight; $i++) {
        for ($j = 0; $j < $templateWidth; $j++) {
            // don't overwrite underlying terrain with any "?" items in the template:
            if($allTemplateJSON[$t]['template']['terrain'][$i][$j] !== "?") {
        if($allTemplateJSON[$t]['template']['terrain'][$i][$j] === "*") {
            $terrain['terrain'][$i+$templateOffsetY[$t]][$j+$templateOffsetX[$t]] = "*";
        } else {
            // check if the same filename has already been added and use that reference instead to avoid duplicating images:
            if(array_key_exists(($graphicsBeingUsedForThisTemplate[($allTemplateJSON[$t]['template']['terrain'][$i][$j])]['src']),$graphicsToAdd)) {
            // already being used, so use the reference already held:
            $terrain['terrain'][$i+$templateOffsetY[$t]][$j+$templateOffsetX[$t]] = $graphicsToAdd[($graphicsBeingUsedForThisTemplate[($allTemplateJSON[$t]['template']['terrain'][$i][$j])]['src'])];
            } else {
            // add and store for later:
            $numberOfGraphicsSoFar = count($graphicsToAdd);
            $terrain['terrain'][$i+$templateOffsetY[$t]][$j+$templateOffsetX[$t]] = $numberOfGraphicsSoFar;
            $graphicsToAdd[($graphicsBeingUsedForThisTemplate[($allTemplateJSON[$t]['template']['terrain'][$i][$j])]['src'])] = $numberOfGraphicsSoFar;
            $templateGraphicsToAppend .= ', '.json_encode($graphicsBeingUsedForThisTemplate[$allTemplateJSON[$t]['template']['terrain'][$i][$j]]);
            }
        }
        $collisions['collisions'][$i+$templateOffsetY[$t]][$j+$templateOffsetX[$t]] = $allTemplateJSON[$t]['template']['collisions'][$i][$j];
        $elevation['elevation'][$i+$templateOffsetY[$t]][$j+$templateOffsetX[$t]] = $allTemplateJSON[$t]['template']['elevation'][$i][$j];
        }
    }
    }
}






// substr(1,-1) to remove the added { and } earlier:
$outputJSON .= substr(json_encode($collisions),1,-1).", ".substr(json_encode($terrain),1,-1).", ".substr(json_encode($elevations),1,-1);

$outputJSON .= ',"graphics": ['.$dungeonDetails[$dungeonName]['graphics'].$templateGraphicsToAppend.'],';
$outputJSON .= '"weather": [""],';
$outputJSON .= '"shops": [],';
$outputJSON .= '"npcs": ['.$templateNPCsToAppend.'],';


//$outputJSON .= '"doors": {"'.($exitX-1).','.$exitY.'": {  "map": '.($thisMapsId-1).',  "startX": "?-1",  "startY": "?"},"'.$exitX.','.$exitY.'": {  "map": '.($thisMapsId-1).',  "startX": "?",  "startY": "?"},"'.($exitX+1).','.$exitY.'": {  "map": '.($thisMapsId-1).',  "startX": "?+1",  "startY": "?"}},';


$outputJSON .= '"doors": '.$doorsJSON.",";

$outputJSON .= '"innerDoors": {';

if(count($drawnTileDoors)>0) {
  
//array_push($drawnTileDoors, array($j,$k, $lockedJoints[("-" . $thisEdge->v1->whichNode->name."-" . $thisEdge->v0->whichNode->name)]));
for ($i = 0; $i < count($drawnTileDoors); $i++) {
  
$thisDoorIsLocked = false;
$thisdoorsGraphic = 3;
 if($drawnTileDoors[$i][2] != -1) {
$thisDoorIsLocked = true;
$thisdoorsGraphic = 2;
 }
 $thisDoorsReference = $thisMapsId.'-'.$drawnTileDoors[$i][0].'-'.$drawnTileDoors[$i][1];
$outputJSON .= '"'.$thisDoorsReference.'":{"tileX": '.$drawnTileDoors[$i][0].', "tileY": '.$drawnTileDoors[$i][1].', "isOpen": false, "isLocked": '.json_encode($thisDoorIsLocked).', "graphic": '.$thisdoorsGraphic.', "animation": { "opening": { "length": 8, "row": 0 }, "closing": { "length": 8, "row": 1 } }},';
// push this door reference:
$drawnTileDoors[$i][3] = $thisDoorsReference;

}
     // remove last comma:
$outputJSON = rtrim($outputJSON, ', ');

}





$outputJSON .= '},';








$outputJSON .= '"items": [';

if(count($drawnTileKeys)>0) {
 for ($i = 0; $i < count($drawnTileKeys); $i++) { 




// find the door reference for this lock:
$doorReference = "";
for ($j = 0; $j < count($drawnTileDoors); $j++) {

    if($drawnTileDoors[$j][2] == $drawnTileKeys[$i][2]) {
$doorReference = $drawnTileDoors[$j][3];
break;
    }

}


// randomly pick a key type:
$keyType = $dungeonDetails[$dungeonName]['keyTypes'][mt_rand(0, count($dungeonDetails[$dungeonName]['keyTypes']) - 1)];


$animationString = '';
if($keyType == 42) {
// 42 is a lever - needs animation details:
    $animationString = ', "state": "off", "animation": {"off": {"length": 1,"row":0},"on": {"length": 1,"row":1}}';
}

 $outputJSON .= '{"type": '.$keyType.', "tileX": '.$drawnTileKeys[$i][0].', "tileY": '.$drawnTileKeys[$i][1].', "additional": "'.$doorReference.'"'.$animationString.'},';

    }

}



if(count($placedItems)>0) {
 for ($i = 0; $i < count($placedItems); $i++) { 
    // check for any procedural books or parchments:
    if(($placedItems[$i][0] == 32) || ($placedItems[$i][0] == 33)) {
    $outputJSON .= '{"type": '.$placedItems[$i][0].',"tileX": '.$placedItems[$i][1].',"tileY": '.$placedItems[$i][2].',';


     $outputJSON .= '"quantity": 1,"quality": 100,"durability": 100,"currentWear": 0,"effectiveness": 100,"wrapped": 0,"colour": 0,"enchanted": 0,"hallmark": 0,';


$newTimeStamp = new DateTime();


 //   $outputJSON .= '"inscription": { "title":"'.str_replace('"', '\"', createProceduralTitle()).'", "timeCreated":"'.$newTimeStamp->getTimestamp().'", "content":"'.str_replace('"', '\"', createProceduralBook()).'"}},';
$bookContent = createProceduralBook();

    $outputJSON .= '"inscription": { "title":"'.str_replace('"', '\"', createProceduralTitle()).'", "timeCreated":"'.$newTimeStamp->getTimestamp().'", "content":"'.preg_replace( "/\r|\n/", "",(str_replace('"', '\"', $bookContent))).'"}},';
    } else {
     $outputJSON .= '{"type": '.$placedItems[$i][0].', "tileX": '.$placedItems[$i][1].', "tileY": '.$placedItems[$i][2].',';

$outputJSON .= '"quantity": 1,"quality": 100,"durability": 100,"currentWear": 0,"effectiveness": 100,"wrapped": 0,"colour": 0,"enchanted": 0,"hallmark": 0,"inscription":""},';

 }
 }
}

     // remove last comma:
$outputJSON = rtrim($outputJSON, ', ');

// temporarily add a chest to mark the exit ###########
//$outputJSON .= '{"type": 48, "tileX": '.$exitX.', "tileY": '.$exitY.', "contains": [{"type": 1},{"type": 3},{"type": "$", "quantity": 2500}]}';


if($templateItemsToAppend != '') {
$outputJSON .= ', ';
}
$outputJSON .= $templateItemsToAppend;


$outputJSON .= '],';




$outputJSON .= '"hotspots": ['.$templateHotspotsToAppend.'],';


$outputJSON .= '"hiddenResourceCategories": ['.$dungeonDetails[$dungeonName]['possibleHiddenResourceCategories'][mt_rand(0,count($dungeonDetails[$dungeonName]['possibleHiddenResourceCategories'])-1)].'],';


$resourceTier = 3;
// deeper levels should have better resources:
$resourceTier += floor(abs($thisMapsId)/10);
if($resourceTier>10) {
    $resourceTier = 10;
}

$outputJSON .= '"hiddenResourceTier": '.$resourceTier;


//$outputJSON .= ',"showOnlyLineOfSight": true';
$outputJSON .= '}}';
if(!$proceduralDebug && !$isIncluded) {
    header("Content-Type: application/json");
}



if(!$proceduralDebug) {



  $proceduralMapFilename = "../data/chr" . $thisPlayersId . "/dungeon/".$dungeonName."/" . $thisMapsId . ".json";  
    if(!($filename=fopen($proceduralMapFilename,"w"))) {
            // error handling?
        }
        fwrite($filename, $outputJSON); 
        fclose($filename);
    }





}



function doErosion($inputMap) {
    global $proceduralMapTilesX, $proceduralMapTilesY;

    $birthLimit = 3;
    $iterations = 3;

    $outputMap = array();
    for ($i = 0; $i < $proceduralMapTilesX; $i++) {    
        $outputMap[$i] = array();
        for ($j = 0; $j < $proceduralMapTilesY; $j++) {
            array_push($outputMap[$i], $inputMap[$i][$j]);
        }
    }

    for ($k = 0; $k < $iterations; $k++) {
        for ($i = 0; $i < $proceduralMapTilesX; $i++) {
            for ($j = 0; $j < $proceduralMapTilesY; $j++) {
                $numberOfNeighbours = countAliveNeighbours($outputMap, $i, $j);
             if ($outputMap[$j][$i] == ".") {
                    if($numberOfNeighbours > $birthLimit){
                         if(mt_rand(1,2) == 1) {
                            $outputMap[$j][$i] = "#";
                        }
                    }
                }
            }
        }
    }

    return $outputMap;
}


function countAliveNeighbours($map, $x, $y) {
    global $proceduralMapTilesX, $proceduralMapTilesY;
    $count = 0;
    for($i = -1; $i < 2; $i++){
        for($j = -1; $j < 2; $j++){
            $nb_x = $i+$x;
            $nb_y = $j+$y;
            if(!($i == 0 && $j == 0)){
                // if it's at the edges, count it was solid:
                if(($nb_x < 0) || ($nb_y < 0) || ($nb_x >= $proceduralMapTilesX) || ($nb_y >= $proceduralMapTilesY)){
                    $count++;   
                } else if($map[$nb_y][$nb_x] == "#"){
                    $count++; 
                }
            }
        }
    }
    return $count;
}

/*

function doCellularAutomata($inputMap) {
global $proceduralMapTilesX, $proceduralMapTilesY;

$deathLimit = 3;
$birthLimit = 4;
$iterations = 3;

$outputMap = array();
for ($i = 0; $i < $proceduralMapTilesX; $i++) {    
    $outputMap[$i] = array();
    for ($j = 0; $j < $proceduralMapTilesY; $j++) {
        array_push($outputMap[$i], $inputMap[$i][$j]);
    }
}

for ($k = 0; $k < $iterations; $k++) {
    for ($i = 0; $i < $proceduralMapTilesX; $i++) {
        for ($j = 0; $j < $proceduralMapTilesY; $j++) {
            $numberOfNeighbours = countAliveNeighbours($outputMap, $i, $j);
            // if this tile is blocked:
            if($outputMap[$j][$i] == "#") {
                if($numberOfNeighbours < $deathLimit){
                        $outputMap[$j][$i] = ".";
                }
            } else if ($outputMap[$j][$i] == ".") {
                if($numberOfNeighbours > $birthLimit){
                        $outputMap[$j][$i] = "#";
                }
            }
        }
    }
}

return $outputMap;
}
*/


function outputTileMap() {
global $proceduralMap, $proceduralMapTilesX, $proceduralMapTilesY, $canvaDimension, $drawnTileDoors, $proceduralDebug, $keyColours, $drawnTileKeys;

if($proceduralDebug) {
    echo '<div class="sequenceBlock">';


$drawnTileSize = 8; 
$drawnOffset = 20;
   $outputCanvas = imagecreatetruecolor($canvaDimension, $canvaDimension);
    $groundColour = array(219, 215, 190);
    $ground       = imagecolorallocate($outputCanvas, $groundColour[0], $groundColour[1], $groundColour[2]);
    imagefilledrectangle($outputCanvas, 0, 0, $canvaDimension, $canvaDimension, $ground);




  for ($i = 0; $i < $proceduralMapTilesX; $i++) {      
            for ($j = 0; $j < $proceduralMapTilesY; $j++) {
        
        switch ($proceduralMap[$j][$i]) {
    case "#":
    // non-walkable tile:
       imagefilledrectangle($outputCanvas,($i)*$drawnTileSize+$drawnOffset,($j)*$drawnTileSize+$drawnOffset,($i+1)*$drawnTileSize+$drawnOffset,($j+1)*$drawnTileSize+$drawnOffset,  imagecolorallocate($outputCanvas, 75, 75, 75));
        break;
        case "-":
        // 'removed' blank non-walkable tile:
         imagefilledrectangle($outputCanvas,($i)*$drawnTileSize+$drawnOffset,($j)*$drawnTileSize+$drawnOffset,($i+1)*$drawnTileSize+$drawnOffset,($j+1)*$drawnTileSize+$drawnOffset,  imagecolorallocate($outputCanvas, 0, 0, 0));
        break;
      /*  case "?":
        // debugging
            imagefilledrectangle($outputCanvas,($i)*$drawnTileSize+$drawnOffset,($j)*$drawnTileSize+$drawnOffset,($i+1)*$drawnTileSize+$drawnOffset,($j+1)*$drawnTileSize+$drawnOffset,  imagecolorallocate($outputCanvas, 0, 40, 120));
            break;
            */
            case "e":
            // entrance or exit:
            imagefilledrectangle($outputCanvas,($i)*$drawnTileSize+$drawnOffset,($j)*$drawnTileSize+$drawnOffset,($i+1)*$drawnTileSize+$drawnOffset,($j+1)*$drawnTileSize+$drawnOffset,  imagecolorallocate($outputCanvas, 0, 0, 0));
            break;
        case "d":
        // door
         imagefilledrectangle($outputCanvas,($i)*$drawnTileSize+$drawnOffset,($j)*$drawnTileSize+$drawnOffset,($i+1)*$drawnTileSize+$drawnOffset,($j+1)*$drawnTileSize+$drawnOffset,  imagecolorallocate($outputCanvas, 255, 255, 255));
         break;
               case "D":
        // locked door - get the colour:


   for ($m = 0; $m < count($drawnTileDoors); $m++) {
   
    if($i == $drawnTileDoors[$m][0]) {
    if($j == $drawnTileDoors[$m][1]) {
$thisKeyColour = imagecolorallocate($outputCanvas, $keyColours[($drawnTileDoors[$m][2])][0], $keyColours[($drawnTileDoors[$m][2])][1], $keyColours[($drawnTileDoors[$m][2])][2]);
break;
}
    }

    }

         imagefilledrectangle($outputCanvas,($i)*$drawnTileSize+$drawnOffset,($j)*$drawnTileSize+$drawnOffset,($i+1)*$drawnTileSize+$drawnOffset,($j+1)*$drawnTileSize+$drawnOffset, $thisKeyColour);
        break;
    case ".":
        // empty
        break;
   



       
}

// draw border:
 imagerectangle($outputCanvas,($i)*$drawnTileSize+$drawnOffset,($j)*$drawnTileSize+$drawnOffset,($i+1)*$drawnTileSize+$drawnOffset,($j+1)*$drawnTileSize+$drawnOffset,  imagecolorallocate($outputCanvas, 128, 128, 128));


            }
          
        }



        // draw keys:

 for ($i = 0; $i < count($drawnTileKeys); $i++) { 
    $thisKeyColour = imagecolorallocate($outputCanvas, $keyColours[($drawnTileKeys[$i][2])][0], $keyColours[($drawnTileKeys[$i][2])][1], $keyColours[($drawnTileKeys[$i][2])][2]);

imagefilledellipse($outputCanvas, ($drawnTileKeys[$i][0])*$drawnTileSize+$drawnOffset+($drawnTileSize/2), ($drawnTileKeys[$i][1])*$drawnTileSize+$drawnOffset+($drawnTileSize/2),$drawnTileSize,$drawnTileSize,$thisKeyColour);

    }







/*
// draw border:
        imagefilledrectangle($outputCanvas,0,0,$drawnOffset,$canvaDimension,imagecolorallocate($outputCanvas, 60, 60, 60));
        imagefilledrectangle($outputCanvas,$canvaDimension-$drawnOffset,0,$canvaDimension,$canvaDimension,imagecolorallocate($outputCanvas, 60, 60, 60));
imagefilledrectangle($outputCanvas,0,0,$canvaDimension,$drawnOffset,imagecolorallocate($outputCanvas, 60, 60, 60));
imagefilledrectangle($outputCanvas,0,$canvaDimension-$drawnOffset,$canvaDimension,$canvaDimension,imagecolorallocate($outputCanvas, 60, 60, 60));
*/

       ob_start();
    imagejpeg($outputCanvas, null, 100);
    $rawImageBytes = ob_get_clean();

    echo "<img src='data:image/jpeg;base64," . base64_encode($rawImageBytes) . "'></div>";

    imagedestroy($outputCanvas);
    }
    }



function tileIsSurrounded($tileCheckX,$tileCheckY) {
  global $proceduralMap, $proceduralMapTilesX, $proceduralMapTilesY;
  $thisTileIsSurrounded = false;
  if($tileCheckX>=0) {
    if($tileCheckY>=0) {
      if($tileCheckX<$proceduralMapTilesX) {
        if($tileCheckY<$proceduralMapTilesY) {
          if(($proceduralMap[$tileCheckY][$tileCheckX] == "#") || ($proceduralMap[$tileCheckY][$tileCheckX] == "-")){
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




function flipArray($inputArray) {

    // mirror vertically:
    $outputArray = array();
  foreach($inputArray as $key => $val) {
    $outputArray[$key] = array_reverse($val);
}



    return $outputArray;
}







// https://stackoverflow.com/questions/27422640/alternate-to-array-column#answer-27422723
// support older PHP:
if (! function_exists('array_column')) {
    function array_column(array $input, $columnKey, $indexKey = null) {
        $array = array();
        foreach ($input as $value) {
            if ( !array_key_exists($columnKey, $value)) {
                trigger_error("Key \"$columnKey\" does not exist in array");
                return false;
            }
            if (is_null($indexKey)) {
                $array[] = $value[$columnKey];
            }
            else {
                if ( !array_key_exists($indexKey, $value)) {
                    trigger_error("Key \"$indexKey\" does not exist in array");
                    return false;
                }
                if ( ! is_scalar($value[$indexKey])) {
                    trigger_error("Key \"$indexKey\" does not contain scalar value");
                    return false;
                }
                $array[$value[$indexKey]] = $value[$columnKey];
            }
        }
        return $array;
    }
}
















function rotateArray90Clockwise( $inputArray ) {
    // kudos https://stackoverflow.com/questions/30087158/how-can-i-rotate-a-2d-array-in-php-by-90-degrees#answer-43108722
    $inputArray = array_values( $inputArray );
    $outputArray = array();
    // make each new row = reversed old column
    foreach( array_keys( $inputArray[0] ) as $column ){
        $outputArray[] = array_reverse( array_column( $inputArray, $column ) );
    }
    return $outputArray;
}

function rotateArray90Anticlockwise( $inputArray ) {
    $inputArray = array_values( $inputArray );
    $outputArray = array();
    // make each new row = reversed old column
    foreach( array_keys( $inputArray[0] ) as $column ){
        array_unshift($outputArray , array_column( $inputArray, $column ) );
    }
    return $outputArray;
}

function rotateArray180($inputArray) {
    $outputArray = array();
    for ($i=0;$i<count($inputArray);$i++) {
        array_unshift($outputArray, array_reverse($inputArray[$i]));
    }
    return $outputArray;
}


function flipCoordinatesHorizontally($position, $templateWidth, $templateHeight) {
   
    $position[0] = $templateWidth - $position[0] -1;
    return $position;
}

function rotateCoordinates180($position, $templateWidth, $templateHeight) {
$storePositionOne = $position[1];
    $position[0] = $templateWidth - $position[0] -1;
    $position[1] = $templateHeight - $storePositionOne -1;
    return $position;
}

function rotateCoordinates90Clockwise($position, $templateWidth, $templateHeight) {
    $storePositionOne = $position[1];
   $position[1] = $position[0];
    $position[0] = $templateHeight - $storePositionOne -1;
 
    return $position;
}

function rotateCoordinates90Anticlockwise($position, $templateWidth, $templateHeight) {
$storePositionZero = $position[0];
    $position[0] = $position[1];
    $position[1] = $templateWidth - $storePositionZero -1;
    return $position;
}






   function findRelevantTemplates() {
    global $dungeonName, $thisMapsId, $dungeonDetails, $thisMapsId, $drawnTileRooms, $proceduralMap, $templateGraphicsToAppend, $templateNPCsToAppend, $templateItemsToAppend, $allTemplateJSON, $templateOffsetX, $templateOffsetY, $templateHotspotsToAppend, $proceduralDebug;
    // read contents of dir and find number of files:
    $dir = $_SERVER['DOCUMENT_ROOT']."/templates/dungeon/".$dungeonName."/";
    $filesFound = array();
    if (is_dir($dir)) {
        if ($dirHandle = opendir($dir)) {
            while (($file = readdir($dirHandle)) !== false) {
                if ((is_file($dir.'/'.$file))) {
                    array_push($filesFound, $file);
                }
            }
            closedir($dirHandle);
        }
    }

    if(count($filesFound) > 0) {

if($proceduralDebug) {
echo '<div class="sequenceBlock">';
}
    // have a few goes at finding an in-level template:
    $attempt = 0;
    $templatesToUse = array();
    $numberOfTemplatesToUse = mt_rand($dungeonDetails[$dungeonName]['templatesMin'], $dungeonDetails[$dungeonName]['templatesMax']);
    for ($i = 0; $i < $numberOfTemplatesToUse; $i++) {
        $randomFile = mt_rand(0, count($filesFound) - 1);
        $templateName = explode(".json", $filesFound[$randomFile])[0];
        $proceduralMapIdAbsolute = abs($thisMapsId);
        // check if this map level is within the min and max for this template:
        if (isset($dungeonDetails[$dungeonName]['levelLockedTemplates'][$templateName])) {
            if ($proceduralMapIdAbsolute >= $dungeonDetails[$dungeonName]['levelLockedTemplates'][$templateName][0]) {
                if ($proceduralMapIdAbsolute <= $dungeonDetails[$dungeonName]['levelLockedTemplates'][$templateName][1]) {
                    array_push($templatesToUse, $templateName);
                }
            }
        } else {
            // no restrictions on it, so can use it:
            array_push($templatesToUse, $templateName);
        }
    }

    $templateGraphicsToAppend = '';
    $templateNPCsToAppend = '';
    $templateHotspotsToAppend = '';
    $templateItemsToAppend = '';
    $templateOffsetX = array();
    $templateOffsetY = array();
    $allTemplateJSON = array();
    $templatesPlacedOnThisLevel = array();
    $uniquePerLevelTemplatesUsed = array();

    if (count($templatesToUse > 0)) {
        $randomDrawnTileRooms = $drawnTileRooms;
        for ($i = 0; $i < count($templatesToUse); $i++) {
            // randomly order the rooms for some variation:
            usort($randomDrawnTileRooms, 'randomArraySorting');
            $fileToUse = $dir.$templatesToUse[$i].'.json';
            $templateJSONFile = file_get_contents($fileToUse);
            $templateJSONFile = chooseRandomElements($templateJSONFile);
            $templateJSON = json_decode($templateJSONFile, true);
            $rotation = 1;
            $flip = 1;
            // determine this template's dimensions:
            $templateNonRotatedHeight = count($templateJSON['template']['terrain']);
            $templateNonRotatedWidth = count($templateJSON['template']['terrain'][0]);
            $templateType = $templateJSON['template']['type'];
            $isUniquePerLevel = $templateJSON['template']['uniquePerLevel'];

            if($proceduralDebug) {
                echo "trying to place (".$templateType.") template ".$templatesToUse[$i]." ";
            }


            if ($templateJSON['template']['rotatable']) {
                $rotation = mt_rand(1, 4);
                $flip = mt_rand(1, 2);
             //   if($proceduralDebug) {echo "#".$i." - ".$rotation.", ".$flip.", type: ".$templateType."<br>";}
                // case 1 is no rotation
                switch ($rotation) {
                    case 2:
                        $templateJSON['template']['terrain'] = rotateArray90Clockwise($templateJSON['template']['terrain']);
                        $templateJSON['template']['collisions'] = rotateArray90Clockwise($templateJSON['template']['collisions']);
                        $templateJSON['template']['elevation'] = rotateArray90Clockwise($templateJSON['template']['elevation']);
                        break;
                    case 3:
                        $templateJSON['template']['terrain'] = rotateArray90Anticlockwise($templateJSON['template']['terrain']);
                        $templateJSON['template']['collisions'] = rotateArray90Anticlockwise($templateJSON['template']['collisions']);
                        $templateJSON['template']['elevation'] = rotateArray90Anticlockwise($templateJSON['template']['elevation']);
                        break;
                    case 4:
                        $templateJSON['template']['terrain'] = rotateArray180($templateJSON['template']['terrain']);
                        $templateJSON['template']['collisions'] = rotateArray180($templateJSON['template']['collisions']);
                        $templateJSON['template']['elevation'] = rotateArray180($templateJSON['template']['elevation']);
                        break;
                }

                // determine this template's dimensions:
                $templateHeight = count($templateJSON['template']['terrain']);
                $templateWidth = count($templateJSON['template']['terrain'][0]);




          

                // rotate items, npcs and hotspot positions:
                switch ($rotation) {
                    case 2:
                        for ($j = 0; $j < count($templateJSON['template']['npcs']); $j++) {
                            $thisNPC = $templateJSON['template']['npcs'][$j];
                            $newPosition = rotateCoordinates90Clockwise(array($thisNPC['tileX'], $thisNPC['tileY']), $templateNonRotatedWidth, $templateNonRotatedHeight);
                            $templateJSON['template']['npcs'][$j]['tileX'] = $newPosition[0];
                            $templateJSON['template']['npcs'][$j]['tileY'] = $newPosition[1];
                        }
                        for ($j = 0; $j < count($templateJSON['template']['hotspots']); $j++) {
                            $thisHotspot = $templateJSON['template']['hotspots'][$j];
                            $newPosition = rotateCoordinates90Clockwise(array($thisHotspot['centreX'], $thisHotspot['centreY']), $templateNonRotatedWidth, $templateNonRotatedHeight);
                            $templateJSON['template']['hotspots'][$j]['centreX'] = $newPosition[0];
                            $templateJSON['template']['hotspots'][$j]['centreY'] = $newPosition[1];
                        }


  

                        
                        for ($j = 0; $j < count($templateJSON['template']['items']); $j++) {
                            $thisItem = $templateJSON['template']['items'][$j];
                            $newPosition = rotateCoordinates90Clockwise(array($thisItem['tileX'], $thisItem['tileY']), $templateNonRotatedWidth, $templateNonRotatedHeight);
                            $templateJSON['template']['items'][$j]['tileX'] = $newPosition[0];
                            $templateJSON['template']['items'][$j]['tileY'] = $newPosition[1];
                        }

                       


                        break;
                    case 3:
                        for ($j = 0; $j < count($templateJSON['template']['npcs']); $j++) {
                            $thisNPC = $templateJSON['template']['npcs'][$j];
                            $newPosition = rotateCoordinates90Anticlockwise(array($thisNPC['tileX'], $thisNPC['tileY']), $templateNonRotatedWidth, $templateNonRotatedHeight);
                            $templateJSON['template']['npcs'][$j]['tileX'] = $newPosition[0];
                            $templateJSON['template']['npcs'][$j]['tileY'] = $newPosition[1];
                        }
                        for ($j = 0; $j < count($templateJSON['template']['hotspots']); $j++) {
                            $thisHotspot = $templateJSON['template']['hotspots'][$j];
                            $newPosition = rotateCoordinates90Anticlockwise(array($thisHotspot['centreX'], $thisHotspot['centreY']), $templateNonRotatedWidth, $templateNonRotatedHeight);
                            $templateJSON['template']['hotspots'][$j]['centreX'] = $newPosition[0];
                            $templateJSON['template']['hotspots'][$j]['centreY'] = $newPosition[1];
                        }




                        for ($j = 0; $j < count($templateJSON['template']['items']); $j++) {
                            $thisItem = $templateJSON['template']['items'][$j];
                            $newPosition = rotateCoordinates90Anticlockwise(array($thisItem['tileX'], $thisItem['tileY']), $templateNonRotatedWidth, $templateNonRotatedHeight);
                            $templateJSON['template']['items'][$j]['tileX'] = $newPosition[0];
                            $templateJSON['template']['items'][$j]['tileY'] = $newPosition[1];
                        }




                        break;
                    case 4:
                        for ($j = 0; $j < count($templateJSON['template']['npcs']); $j++) {
                            $thisNPC = $templateJSON['template']['npcs'][$j];
                            $newPosition = rotateCoordinates180(array($thisNPC['tileX'], $thisNPC['tileY']), $templateNonRotatedWidth, $templateNonRotatedHeight);
                            $templateJSON['template']['npcs'][$j]['tileX'] = $newPosition[0];
                            $templateJSON['template']['npcs'][$j]['tileY'] = $newPosition[1];
                        }
                        for ($j = 0; $j < count($templateJSON['template']['hotspots']); $j++) {
                            $thisHotspot = $templateJSON['template']['hotspots'][$j];
                            $newPosition = rotateCoordinates180(array($thisHotspot['centreX'], $thisHotspot['centreY']), $templateNonRotatedWidth, $templateNonRotatedHeight);
                            $templateJSON['template']['hotspots'][$j]['centreX'] = $newPosition[0];
                            $templateJSON['template']['hotspots'][$j]['centreY'] = $newPosition[1];
                        }
                        for ($j = 0; $j < count($templateJSON['template']['items']); $j++) {
                            $thisItem = $templateJSON['template']['items'][$j];
                            $newPosition = rotateCoordinates180(array($thisItem['tileX'], $thisItem['tileY']), $templateNonRotatedWidth, $templateNonRotatedHeight);
                            $templateJSON['template']['items'][$j]['tileX'] = $newPosition[0];
                            $templateJSON['template']['items'][$j]['tileY'] = $newPosition[1];
                        }
                        break;
                }




                if ($templateType == "outer") {
                    // rotate entrance point:
                    switch ($rotation) {
                        case 2:
                            $newPosition = rotateCoordinates90Clockwise(array($templateJSON['template']['entranceX'], $templateJSON['template']['entranceY']), $templateNonRotatedWidth, $templateNonRotatedHeight);
                            $templateJSON['template']['entranceX'] = $newPosition[0];
                            $templateJSON['template']['entranceY'] = $newPosition[1];
                            break;
                        case 3:
                      //  echo "was: ".$templateJSON['template']['entranceX'].", ".$templateJSON['template']['entranceY']."<br>";
                            $newPosition = rotateCoordinates90Anticlockwise(array($templateJSON['template']['entranceX'], $templateJSON['template']['entranceY']), $templateNonRotatedWidth, $templateNonRotatedHeight);
                            $templateJSON['template']['entranceX'] = $newPosition[0];
                            $templateJSON['template']['entranceY'] = $newPosition[1];
                          //   echo "now: ".$templateJSON['template']['entranceX'].", ".$templateJSON['template']['entranceY']."<br>";
                            break;
                        case 4:
                            $newPosition = rotateCoordinates180(array($templateJSON['template']['entranceX'], $templateJSON['template']['entranceY']), $templateNonRotatedWidth, $templateNonRotatedHeight);
                            $templateJSON['template']['entranceX'] = $newPosition[0];
                            $templateJSON['template']['entranceY'] = $newPosition[1];
                            break;
                    }
                }

                if ($flip == 2) {
                    $templateJSON['template']['terrain'] = flipArray($templateJSON['template']['terrain']);
                    $templateJSON['template']['collisions'] = flipArray($templateJSON['template']['collisions']);
                    $templateJSON['template']['elevation'] = flipArray($templateJSON['template']['elevation']);
                    // flip items, npcs and hotspot positions:
                    for ($j = 0; $j < count($templateJSON['template']['npcs']); $j++) {
                        $thisNPC = $templateJSON['template']['npcs'][$j];
                        $newPosition = flipCoordinatesHorizontally(array($thisNPC['tileX'], $thisNPC['tileY']), $templateWidth, $templateHeight);
                        $templateJSON['template']['npcs'][$j]['tileX'] = $newPosition[0];
                        $templateJSON['template']['npcs'][$j]['tileY'] = $newPosition[1];
                    }
                    for ($j = 0; $j < count($templateJSON['template']['hotspots']); $j++) {
                        $thisHotspot = $templateJSON['template']['hotspots'][$j];
                        $newPosition = flipCoordinatesHorizontally(array($thisHotspot['centreX'], $thisHotspot['centreY']), $templateWidth, $templateHeight);
                        $templateJSON['template']['hotspots'][$j]['centreX'] = $newPosition[0];
                        $templateJSON['template']['hotspots'][$j]['centreY'] = $newPosition[1];
                    }
                    for ($j = 0; $j < count($templateJSON['template']['items']); $j++) {
                        $thisItem = $templateJSON['template']['items'][$j];
                        $newPosition = flipCoordinatesHorizontally(array($thisItem['tileX'], $thisItem['tileY']), $templateWidth, $templateHeight);
                        $templateJSON['template']['items'][$j]['tileX'] = $newPosition[0];
                        $templateJSON['template']['items'][$j]['tileY'] = $newPosition[1];
                    }
                    if ($templateType == "outer") {
                        $newPosition = flipCoordinatesHorizontally(array($templateJSON['template']['entranceX'], $templateJSON['template']['entranceY']), $templateWidth, $templateHeight);
                        $templateJSON['template']['entranceX'] = $newPosition[0];
                        $templateJSON['template']['entranceY'] = $newPosition[1];
                    }
                }



            }

            $foundRoom = null;
            if (!in_array($fileToUse, $uniquePerLevelTemplatesUsed)) {
                if ($templateType == "inner") {
                    // find a room big enough:      
                    foreach($randomDrawnTileRooms as & $thisRoom) {
                        // make sure it's not already found a room:
                        if ($foundRoom == null) {
                            $thisRoomsWidth = $thisRoom[2] - $thisRoom[0];
                            $thisRoomsHeight = $thisRoom[3] - $thisRoom[1];
                            if ($thisRoomsHeight >= $templateHeight) {
                                if ($thisRoomsWidth >= $templateWidth) {
                                   
                                    $attempts = 0;
                                    do {
                                        // position the template randomly within the available space:
                                        $thisTemplateOffsetX = $thisRoom[0] + mt_rand(0, ($thisRoomsWidth - $templateWidth));
                                        $thisTemplateOffsetY = $thisRoom[1] + mt_rand(0, ($thisRoomsHeight - $templateHeight));
                                        $overlapsExistingStructure = false;
                                        // check a template hasn't already been placed here:
                                        for ($j = 0; $j < count($templatesPlacedOnThisLevel); $j++) {
                                            if (($thisTemplateOffsetX + $templateWidth) > $templatesPlacedOnThisLevel[$j][0]) {
                                                if ($thisTemplateOffsetX < $templatesPlacedOnThisLevel[$j][2]) {
                                                    if ($thisTemplateOffsetY < $templatesPlacedOnThisLevel[$j][3]) {
                                                        if (($thisTemplateOffsetY + $templateHeight) > $templatesPlacedOnThisLevel[$j][1]) {
                                                            $overlapsExistingStructure = true;
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                        // check it doesn't block the doors, or the tiles around the door:
                                        for ($k = 0; $k < $templateWidth; $k++) {
                                            for ($j = 0; $j < $templateHeight; $j++) {
                                                for ($l = -1; $l <=1; $l++) {
                                                    for ($m = -1; $m <=1; $m++) {
                                                        
                                                            switch ($proceduralMap[$j + $thisTemplateOffsetY + $l][$k + $thisTemplateOffsetX + $m]) {
                                                                case "e":
                                                                case "d":
                                                                case "D":
                                                                $overlapsExistingStructure = true;
                                                                break;

                                                            }
                                                            
                                                           
                                                    }
                                                }
                                            }
                                        }
                                        $attempts++;
                                    } while ($overlapsExistingStructure && $attempts < 4);
                                    if (!$overlapsExistingStructure) {
                                         $foundRoom = $thisRoom;
                                        array_push($templateOffsetX, $thisTemplateOffsetX);
                                        array_push($templateOffsetY, $thisTemplateOffsetY);
                                        array_push($allTemplateJSON, $templateJSON);
                                        array_push($templatesPlacedOnThisLevel, $foundRoom);
                                        // plot room
                                        for ($k = 0; $k < $templateWidth; $k++) {
                                            for ($j = 0; $j < $templateHeight; $j++) {
                                                // don't overwrite underlying terrain for any "?"s:
                                                if($templateJSON['template']['terrain'][$j][$k] !== "?") {
                                                if($templateJSON['template']['collisions'][$j][$k] == 1) {
                                                    $proceduralMap[$j + $thisTemplateOffsetY][$k + $thisTemplateOffsetX] = "#";
                                                } else {
                                                    $proceduralMap[$j + $thisTemplateOffsetY][$k + $thisTemplateOffsetX] = ".";
                                                }
                                            }
                                                
                                            }
                                        }

                                    }
                                }
                            }
                        }
                    }
                } else {
                    // 'outer' type:

                    // check what side the template needs to connect to
                    $thisEntranceX = $templateJSON['template']['entranceX'];
                    $thisEntranceY = $templateJSON['template']['entranceY'];
                //    echo $thisEntranceX.",".$thisEntranceY."<br>";
                //    echo $templateWidth." x ".$templateHeight."<br>";
                    $sideToConnectTo = "south";
                    if ($thisEntranceX == 0) {
                        $sideToConnectTo = "east";
                    }
                    if ($thisEntranceX == $templateWidth-1) {
                        $sideToConnectTo = "west";
                    }
                  
                    if ($thisEntranceY == $templateHeight-1) {
                        $sideToConnectTo = "north";
                    }
                    // loop through rooms, find a corner on the relevant side that is adajcent to the black, 'empty' tile
              //      echo "<hr>".$sideToConnectTo;
                    foreach($randomDrawnTileRooms as & $thisRoom) {
                        if ($foundRoom == null) {
                            switch ($sideToConnectTo) {
                                case "west":
                                    // pick randomly from top or bottom edge:
                                    $thisTemplateOffsetY = $thisRoom[1]-1;
                                    if(mt_rand(1,2) == 2) {
                                        $thisTemplateOffsetY = $thisRoom[3] - $templateHeight +1;
                                         if($thisTemplateOffsetY<($foundRoom[1]-1)) {
                                        $thisTemplateOffsetY = $thisRoom[1]-1;
                                    }
                                    }
                                    $thisTemplateOffsetX = $thisRoom[0] - $templateWidth;
                                    $isBlocked = false;
                                    // -1 on the width as don't need to test the overlapping wall as it'll be over-written:
                                    for ($k = 0; $k < $templateWidth-1; $k++) {
                                        for ($j = 0; $j < $templateHeight; $j++) {
                                            if(isset($proceduralMap[$thisTemplateOffsetY+$j][$thisTemplateOffsetX+$k])){
                                                if ($proceduralMap[$thisTemplateOffsetY+$j][$thisTemplateOffsetX+$k] != "-") {
                                                    $isBlocked = true;
                                                }
                                            } else {
                                                $isBlocked = true;
                                            }
                                        }
                                    }
                                    if(!$isBlocked) {
                                        $foundRoom = $thisRoom;
                                    }
                                break;

                                case "east":
                                $thisTemplateOffsetY = $thisRoom[1]-1;
                                if(mt_rand(1,2) == 2) {
                                    $thisTemplateOffsetY = $thisRoom[3] - $templateHeight +1;
                                      if($thisTemplateOffsetY<($foundRoom[1]-1)) {
                                        $thisTemplateOffsetY = $thisRoom[1]-1;
                                    }
                                }
                                $thisTemplateOffsetX = $thisRoom[2];
                                $isBlocked = false;
                                // 1 on the width as don't need to test the overlapping wall as it'll be over-written:
                                for ($k = 1; $k < $templateWidth; $k++) {
                                    for ($j = 0; $j < $templateHeight; $j++) {
                                        if(isset($proceduralMap[$thisTemplateOffsetY+$j][$thisTemplateOffsetX+$k])){
                                            if ($proceduralMap[$thisTemplateOffsetY+$j][$thisTemplateOffsetX+$k] != "-") {
                                                $isBlocked = true;
                                            }
                                        } else {
                                            $isBlocked = true;
                                        }
                                    }
                                }
                                 if(!$isBlocked) {
                                    $foundRoom = $thisRoom;
                                   
                                }
                                break;

                                case "south":
                                $thisTemplateOffsetX = $thisRoom[0]-1;
                                if(mt_rand(1,2) == 2) {
                                    $thisTemplateOffsetX = $thisRoom[2]-$templateWidth+1;
                                    if($thisTemplateOffsetX<$thisRoom[0]) {
                                        $thisTemplateOffsetX = $thisRoom[0]-1;
                                    }
                                }
                                $thisTemplateOffsetY = $thisRoom[3];
                                $isBlocked = false;
// -1 on the width so it can nudge against neighbouring rooms - eg. http://ae.dev/game-world/generateCircularDungeonMap.php?debug=true&dungeonName=the-barrow-mines&requestedMap=-1&seed=1511924848
                                 for ($k = 0; $k < $templateWidth-1; $k++) {
                                    // 1 on the height as don't need to test the overlapping wall as it'll be over-written:
                                    for ($j = 1; $j < $templateHeight; $j++) {
                                        if(isset($proceduralMap[$thisTemplateOffsetY+$j][$thisTemplateOffsetX+$k])){
                                            if ($proceduralMap[$thisTemplateOffsetY+$j][$thisTemplateOffsetX+$k] != "-") {
                                               $isBlocked = true;
                                            }
                                        } else {
                                            $isBlocked = true;
                                        }
                                    }
                                }
                                 if(!$isBlocked) {
                                    $foundRoom = $thisRoom;
                                   
                                }
                                break;


                                case "north":
                                 $thisTemplateOffsetX = $thisRoom[0]-1;
                                if(mt_rand(1,2) == 2) {
                                    $thisTemplateOffsetX = $thisRoom[2]-$templateWidth+1;
                                    if($thisTemplateOffsetX<$thisRoom[0]) {
                                        $thisTemplateOffsetX = $thisRoom[0]-1;
                                    }
                                }
                                $thisTemplateOffsetY = $thisRoom[1]-$templateHeight;
                                $isBlocked = false;
                                //echo "<code><pre>";var_dump($thisRoom);echo "</pre></code>";
                                 for ($k = 0; $k < $templateWidth; $k++) {
                                    // -1 on the height as don't need to test the overlapping wall as it'll be over-written:
                                    for ($j = 0; $j < $templateHeight-1; $j++) {
                                        if(isset($proceduralMap[$thisTemplateOffsetY+$j][$thisTemplateOffsetX+$k])){
                                            if ($proceduralMap[$thisTemplateOffsetY+$j][$thisTemplateOffsetX+$k] != "-") {
                                               $isBlocked = true;
                                            }
                                        } else {
                                            $isBlocked = true;
                                        }
                                    }
                                }
                                 if(!$isBlocked) {
                                    $foundRoom = $thisRoom; 
                                }
                                break;
                            }
                            if ($foundRoom != null) {
                                // check it doesn't overlap an existing template:
                                $overlapsExistingTemplate = false;          
                                for ($j = 0; $j < count($templatesPlacedOnThisLevel); $j++) {
                                    if (($thisTemplateOffsetX + $templateWidth) > $templatesPlacedOnThisLevel[$j][0]) {
                                        if ($thisTemplateOffsetX < $templatesPlacedOnThisLevel[$j][2]) {
                                            if ($thisTemplateOffsetY < $templatesPlacedOnThisLevel[$j][3]) {
                                                if (($thisTemplateOffsetY + $templateHeight) > $templatesPlacedOnThisLevel[$j][1]) {
                                                    $overlapsExistingTemplate = true;
                                                }
                                            }
                                        }
                                    }
                                }
                                if(!$overlapsExistingTemplate) {
                                 //   if($proceduralDebug) {echo "#".$i." - ".$thisTemplateOffsetX.", ".$thisTemplateOffsetY."<br>";}
                                    array_push($templateOffsetX, $thisTemplateOffsetX);
                                    array_push($templateOffsetY, $thisTemplateOffsetY);
                                    array_push($allTemplateJSON, $templateJSON);
                                    array_push($templatesPlacedOnThisLevel, $foundRoom);
                                    // plot room
                                    for ($k = 0; $k < $templateWidth; $k++) {
                                        for ($j = 0; $j < $templateHeight; $j++) {
                                            // don't overwrite underlying terrain for any "?"s:
                                                if($templateJSON['template']['terrain'][$j][$k] !== "?") {
                                            if($templateJSON['template']['collisions'][$j][$k] == 1) {
                                                $proceduralMap[$j + $thisTemplateOffsetY][$k + $thisTemplateOffsetX] = "#";
                                            } else {
                                                $proceduralMap[$j + $thisTemplateOffsetY][$k + $thisTemplateOffsetX] = ".";
                                            }
                                       }
                                            
                                        }
                                    }
                                } else {
                                    $foundRoom = null;
                                }
                            }
                        }   
                    }
                }
                if ($foundRoom != null) {

  if($proceduralDebug) {
echo '(placed at '.$thisTemplateOffsetX.", ".$thisTemplateOffsetY.")";
}

                    if ($isUniquePerLevel) {
                        // don't use it again:
                        array_push($uniquePerLevelTemplatesUsed, $fileToUse);
                    }

                    // map JSON from the template across:
        

                    for ($j = 0; $j < count($templateJSON['template']['npcs']); $j++) {
                        $thisNPC = $templateJSON['template']['npcs'][$j];
                        // map their location:
                        $thisNPC['tileX'] += $thisTemplateOffsetX;
                        $thisNPC['tileY'] += $thisTemplateOffsetY;
                        $templateNPCsToAppend .= json_encode($thisNPC).', ';
                    }

                    for ($j = 0; $j < count($templateJSON['template']['hotspots']); $j++) {
                        $thisHotspot = $templateJSON['template']['hotspots'][$j];
                        // map their location:
                        $thisHotspot['centreX'] += $thisTemplateOffsetX;
                        $thisHotspot['centreY'] += $thisTemplateOffsetY;
                        $templateHotspotsToAppend .= json_encode($thisHotspot).', ';
                    }


                    for ($j = 0; $j < count($templateJSON['template']['items']); $j++) {
                        $thisItem = $templateJSON['template']['items'][$j];
                        // map their location:



                        $thisItem['tileX'] += $thisTemplateOffsetX;
                        $thisItem['tileY'] += $thisTemplateOffsetY;

                        $templateItemsToAppend .= json_encode($thisItem).', ';
                    }
                }
                  if($proceduralDebug) {
echo '<br>';
}
            }
        }
        // remove last comma:
        $templateNPCsToAppend = rtrim($templateNPCsToAppend, ', ');
        // remove last comma:
        $templateItemsToAppend = rtrim($templateItemsToAppend, ', ');
        $templateHotspotsToAppend = rtrim($templateHotspotsToAppend, ', ');
    }
    if($proceduralDebug) {
echo '</div>';
}
}
}




function drawFilledGridCircle($xp, $yp, $radius) {
    // thanks to http://actionsnippet.com/?p=496
    // -1 on bottom and lower bottom otherwise circles are 1 taller than they are wide
    $xoff = 0;
    $yoff = $radius;
    $balance = - $radius;
    while ($xoff <= $yoff) {
        $p0 = $xp - $xoff;
        $p1 = $xp - $yoff;
        $w0 = $xoff + $xoff;
        $w1 = $yoff + $yoff;
        // bottom:
        gridHLine($p0, $yp + $yoff-1, $w0);
        // top:
        gridHLine($p0, $yp - $yoff, $w0);
        // lower centre:
       gridHLine($p1, $yp + $xoff-1, $w1);
        // upper centre:
        gridHLine($p1, $yp - $xoff, $w1);
        if (($balance+= $xoff++ + $xoff) >= 0) {
            $balance-= --$yoff + $yoff;
        }
    }
}
function gridHLine($xp, $yp, $w) {
    global $proceduralMap;
    for ($i = 0;$i < $w;$i++) {
        $proceduralMap[$yp][$xp + $i] = ".";
    }
}



function createTileGrid() {
    global $requiredWidth, $requiredHeight, $proceduralMapTilesX, $proceduralMapTilesY, $canvaDimension, $delaunayVertices, $minLeft, $minTop, $edgesUsedOnDelaunayGraph, $allDelaunayEdges, $lockedJoints, $keyColours, $proceduralDebug, $proceduralMap, $itemMap, $drawnTileDoors, $drawnTileKeys, $drawnTileRooms, $entranceX, $entranceY, $exitX, $exitY, $dungeonDetails, $dungeonName, $jointList, $nodeList, $verticesUsedOnDelaunayGraph, $ratio;
    // define the tile area to be used:
    $proceduralMapTilesX = 70;
    $proceduralMapTilesY = 70;
    // determine the ratio (-2 to allow 1 tile around each edge)
    $ratio = max($proceduralMapTilesX-1, $proceduralMapTilesY-1) / max($requiredWidth, $requiredHeight);
    // delaunay graph size * ratio = tile size


// work out any space to centre the map:
    $tileMapWidth = floor($requiredWidth * $ratio);
    $tileMapHeight = floor($requiredHeight * $ratio);
    $tileOffsetX = floor(($proceduralMapTilesX - $tileMapWidth)/2);
    $tileOffsetY = floor(($proceduralMapTilesY - $tileMapHeight)/2);



  //  echo $ratio."<br>";
  //  echo $requiredWidth." x ".$requiredHeight."<br>";

$proceduralMap = array();
$itemMap = array();
$drawnTileRooms = array();
$drawnTileDoors = array();
$drawnTileKeys = array();

    for ($i = 0; $i < $proceduralMapTilesX; $i++) {
        $proceduralMap[$i] = array();
        $itemMap[$i] = array();
            for ($j = 0; $j < $proceduralMapTilesY; $j++) {
            array_push($proceduralMap[$i], "#");
            array_push($itemMap[$i], "");
            }
        }




for ($i = 0; $i < count($delaunayVertices); $i++) {
    $thisKeyPlotted = false;
    if (isset($delaunayVertices[$i]->whichNode)) {
// plot this on to the tile map:

$leftEdge = $delaunayVertices[$i]->x - $delaunayVertices[$i]->proximityToNeighboursHorizontal - $minLeft;
$rightEdge = $delaunayVertices[$i]->x + $delaunayVertices[$i]->proximityToNeighboursHorizontal - $minLeft;
$topEdge = $delaunayVertices[$i]->y - $delaunayVertices[$i]->proximityToNeighboursVertical - $minTop;
$bottomEdge = $delaunayVertices[$i]->y + $delaunayVertices[$i]->proximityToNeighboursVertical - $minTop;

// draw rooms:
$leftTileEdge = floor($leftEdge * $ratio);
$rightTileEdge = floor($rightEdge * $ratio);
$topTileEdge = floor($topEdge * $ratio);
$bottomTileEdge = floor($bottomEdge * $ratio);


// centre the map:
$leftTileEdge += $tileOffsetX;
$rightTileEdge += $tileOffsetX;
$topTileEdge += $tileOffsetY;
$bottomTileEdge += $tileOffsetY;



// nudge this in to leave walls between rooms intact:
$leftTileEdge++;
$topTileEdge++;


array_push($drawnTileRooms, array($leftTileEdge, $topTileEdge, $rightTileEdge, $bottomTileEdge, $delaunayVertices[$i]->whichNode->name));

switch ($dungeonDetails[$dungeonName]['roomType']) {
    case "adjoining-rooms":
for ($j = $leftTileEdge; $j < $rightTileEdge; $j++) {
for ($k = $topTileEdge; $k < $bottomTileEdge; $k++) {
$proceduralMap[$k][$j] = ".";
}
}
break;

case "cavern":
drawFilledGridCircle(floor(($leftTileEdge+$rightTileEdge)/2),floor(($topTileEdge+$bottomTileEdge)/2),floor(abs($rightTileEdge-$leftTileEdge)/2));
break;
}

// check if it's got a key:
  if ($delaunayVertices[$i]->whichNode->type == "KEYHOLDER") {
    if(!$thisKeyPlotted) {
        $thisKeyPlotted = true;

// draw it in the centre:
  array_push($drawnTileKeys, array(floor(($leftTileEdge+$rightTileEdge)/2),floor(($topTileEdge+$bottomTileEdge)/2), $delaunayVertices[$i]->whichNode->whichKey));

}
    }


    }

    if(isset($delaunayVertices[$i]->whichNode)) {
    if ($delaunayVertices[$i]->whichNode->type == "START") {
        $entranceX = floor(($leftTileEdge+$rightTileEdge)/2);
        $entranceY = floor(($topTileEdge+$bottomTileEdge)/2);
    } else if ($delaunayVertices[$i]->whichNode->type == "END") {
        $exitX = floor(($leftTileEdge+$rightTileEdge)/2);
        $exitY = floor(($topTileEdge+$bottomTileEdge)/2);
    }
}
}

// make sure that the edges are still blocked:
for ($i = 0; $i < $proceduralMapTilesX; $i++) {
$proceduralMap[0][$i] = "#";
$proceduralMap[$proceduralMapTilesY-1][$i] = "#";
}
for ($j = 0; $j < $proceduralMapTilesY; $j++) {
$proceduralMap[$j][0] = "#";
$proceduralMap[$j][$proceduralMapTilesX-1] = "#";
}



if($dungeonDetails[$dungeonName]['needsErosion']) {
    outputTileMap();
    $proceduralMap = doErosion($proceduralMap);
    outputTileMap();
}












// plot connections (corridors):

switch ($dungeonDetails[$dungeonName]['roomType']) {
    case "adjoining-rooms":
        foreach($allDelaunayEdges as $thisEdge) {
         if ((in_array(new delaunayEdge($thisEdge->v0, $thisEdge->v1), $edgesUsedOnDelaunayGraph)) || (in_array(new delaunayEdge($thisEdge->v1, $thisEdge->v0), $edgesUsedOnDelaunayGraph))) {
       
$leftEdge = $thisEdge->v0->x  - $minLeft;
$rightEdge = $thisEdge->v1->x  - $minLeft;
$topEdge = $thisEdge->v0->y  - $minTop;
$bottomEdge = $thisEdge->v1->y  - $minTop;

$leftTileEdge = floor($leftEdge * $ratio);
$rightTileEdge = floor($rightEdge * $ratio);
$topTileEdge = floor($topEdge * $ratio);
$bottomTileEdge = floor($bottomEdge * $ratio);

// centre the map:
$leftTileEdge += $tileOffsetX;
$rightTileEdge += $tileOffsetX;
$topTileEdge += $tileOffsetY;
$bottomTileEdge += $tileOffsetY;

if($topTileEdge > $bottomTileEdge) {
    // reverse them:
$storedEdge = $topTileEdge;
$topTileEdge = $bottomTileEdge;
$bottomTileEdge = $storedEdge;
}
if($leftTileEdge > $rightTileEdge) {
$storedEdge = $leftTileEdge;
$leftTileEdge = $rightTileEdge;
$rightTileEdge = $storedEdge;
}
    for ($j = $leftTileEdge; $j <= $rightTileEdge; $j++) {
        for ($k = $topTileEdge; $k <= $bottomTileEdge; $k++) {
            // check if this is in a room or not:
            $isInRoom = false;
            for ($l = 0; $l < count($drawnTileRooms); $l++) {
                if($j>=$drawnTileRooms[$l][0]) {
                    if($k>=$drawnTileRooms[$l][1]) {
                        if($j<=$drawnTileRooms[$l][2]) {
                            if($k<=$drawnTileRooms[$l][3]) {
                                $isInRoom = true;
                                if($proceduralMap[$k][$j] != ".") {
                                    // not already been plotted by the room, so it's a door:
                                    $proceduralMap[$k][$j] = "d";
                                    // check if it's locked:
                                    if (isset($lockedJoints[("-" . $thisEdge->v1->whichNode->name."-" . $thisEdge->v0->whichNode->name)])) {
                                        $proceduralMap[$k][$j] = "D";
                                        array_push($drawnTileDoors, array($j,$k, $lockedJoints[("-" . $thisEdge->v1->whichNode->name."-" . $thisEdge->v0->whichNode->name)]));
                                    } else {
                                        array_push($drawnTileDoors, array($j,$k, -1));
                                    }
                                }
                            }
                        }
                    }
                }
            }
            if(!$isInRoom) {
                // make paths 3 wide at least:
                if($leftTileEdge == $rightTileEdge) {
                    $proceduralMap[$k][$j-1] = "|";
                    $proceduralMap[$k][$j+1] = "|";
                }
                if($topTileEdge == $bottomTileEdge) {
                    $proceduralMap[$k-1][$j] = "|";
                    $proceduralMap[$k+1][$j] = "|";
                }
                $proceduralMap[$k][$j] = "|";
            }
        }
    }
}
}

break;

case "cavern":
// don't use $leftTileEdge, $rightTileEdge, $topTileEdge and $bottomTileEdge - they're not quite the same for different edges - instead use the centre of the room

    $pointsToConnect = array();
    foreach($allDelaunayEdges as $thisEdge) {
        if ((in_array(new delaunayEdge($thisEdge->v0, $thisEdge->v1), $edgesUsedOnDelaunayGraph)) || (in_array(new delaunayEdge($thisEdge->v1, $thisEdge->v0), $edgesUsedOnDelaunayGraph))) {
            //echo "<hr>".$thisEdge->v0->whichNode->name." to ".$thisEdge->v1->whichNode->name."   ";
            array_push($pointsToConnect, array());
            // find room coordinates for each room
            for ($k = 0; $k < count($drawnTileRooms); $k++) {
                if(($thisEdge->v0->whichNode->name === $drawnTileRooms[$k][4])) {
                    $roomCentreX = floor(($drawnTileRooms[$k][0]+$drawnTileRooms[$k][2])/2);
                    $roomCentreY = floor(($drawnTileRooms[$k][1]+$drawnTileRooms[$k][3])/2);
                    //echo " connecting (".$thisEdge->v0->whichNode->name.")".$roomCentreX.", ".$roomCentreY;
                    $proceduralMap[$roomCentreY][$roomCentreX] = "#";
                    array_push($pointsToConnect[(count($pointsToConnect) - 1)], array($roomCentreX,$roomCentreY));
                }
                if(($thisEdge->v1->whichNode->name === $drawnTileRooms[$k][4])) {
                    $roomCentreX = floor(($drawnTileRooms[$k][0]+$drawnTileRooms[$k][2])/2);
                    $roomCentreY = floor(($drawnTileRooms[$k][1]+$drawnTileRooms[$k][3])/2);
                    //echo " connecting (".$thisEdge->v1->whichNode->name.")".$roomCentreX.", ".$roomCentreY;
                    $proceduralMap[$roomCentreY][$roomCentreX] = "#";
                    array_push($pointsToConnect[(count($pointsToConnect) - 1)], array($roomCentreX,$roomCentreY));
                }
            }
        }
    }


    for ($k = 0; $k < count($pointsToConnect); $k++) {
        drawWonkyPath($pointsToConnect[$k][0],$pointsToConnect[$k][1]);
    }


/*
if($proceduralDebug){
echo'<hr><pre style="display:block;width:100%;clear:both;"><code>';
var_dump($pointsToConnect);
echo "</code></pre>";
}
*/







break;

}



protectDoors();    

outputTileMap();





// find blank tiles (tiles completely surrounded by non-walkable tiles):
 for ($i = 0; $i < $proceduralMapTilesX; $i++) {
 for ($j = 0; $j < $proceduralMapTilesY; $j++) {
  if(   (tileIsSurrounded($i-1,$j))  && (tileIsSurrounded($i+1,$j))  && (tileIsSurrounded($i-1,$j-1))  && (tileIsSurrounded($i-1,$j+1))  && (tileIsSurrounded($i+1,$j-1)) && (tileIsSurrounded($i+1,$j+1)) && (tileIsSurrounded($i,$j-1))  && (tileIsSurrounded($i,$j+1))      ) {
  $proceduralMap[$j][$i] = "-";
  }
  }
  }


   
}


function bresenhamLinePath($x1,$y1,$x2,$y2) {
       global $proceduralDebug, $proceduralMap;

   $dy = $y2 - $y1;
     $dx = $x2 - $x1;
    if ($dy < 0) { $dy = -$dy;  $stepy = -1; } else { $stepy = 1; }
    if ($dx < 0) { $dx = -$dx;  $stepx = -1; } else { $stepx = 1; }
    $dy <<= 1;        // $dy is now 2*$dy
    $dx <<= 1;        // $dx is now 2*$dx
    $proceduralMap[$y1][$x1] = ".";
    if ($dx > $dy) 
    {
         $fraction = $dy - ($dx >> 1);  // same as 2*$dy - $dx
        while ($x1 != $x2) 
        {
           if ($fraction >= 0) 
           {
               $y1 += $stepy;
               $fraction -= $dx;          // same as $fraction -= 2*$dx
           }
           $x1 += $stepx;
           $fraction += $dy;              // same as $fraction -= 2*$dy
           $proceduralMap[$y1][$x1] = ".";
        }
     } else {
         $fraction = $dx - ($dy >> 1);
        while ($y1 != $y2) {
           if ($fraction >= 0) {
               $x1 += $stepx;
               $fraction -= $dy;
           }
           $y1 += $stepy;
           $fraction += $dx;
           $proceduralMap[$y1][$x1] = ".";
        }
     }
}

function drawWonkyPath($from, $to) {
    global $proceduralDebug;
/*    if($proceduralDebug) {
        echo "from ".$from[0].",".$from[1]." to ".$to[0].",".$to[1]."<br>";
    }
*/
bresenhamLinePath($from[0],$from[1],$to[0],$to[1]);
// thicken up the path:
bresenhamLinePath($from[0]-1,$from[1],$to[0]-1,$to[1]);
bresenhamLinePath($from[0],$from[1]-1,$to[0],$to[1]-1);
}





function addRandomItems() {
    global $proceduralMap, $placedItems, $dungeonDetails, $dungeonName, $proceduralMapTilesX, $proceduralMapTilesY, $templateNPCsToAppend, $templateItemsToAppend;
    

    $numberOfItems = mt_rand($dungeonDetails[$dungeonName]['randomItemsMin'], $dungeonDetails[$dungeonName]['randomItemsMax']);


// find all clear tiles:
    $allSuitableCornerTiles = array();
     for ($i = 1; $i < $proceduralMapTilesX-1; $i++) {      
            for ($j = 1; $j < $proceduralMapTilesY-1; $j++) {
        
        if ($proceduralMap[$j][$i] == ".") {
             // try and find an open space where 3 tiles on a corner are walkable while the 3 in the opposite corner aren't:

$tileSouthWalkable = false;
$tileNorthWalkable = false;
$tileEastWalkable = false;
$tileWestWalkable = false;
$tileNorthWestWalkable = false;
$tileNorthEastWalkable = false;
$tileSouthEastWalkable = false;
$tileSouthWestWalkable = false;

if ($proceduralMap[$j+1][$i] == ".") {
    $tileSouthWalkable = true;
}
if ($proceduralMap[$j-1][$i] == ".") {
    $tileNorthWalkable = true;
}
if ($proceduralMap[$j][$i+1] == ".") {
    $tileEastWalkable = true;
}
if ($proceduralMap[$j][$i-1] == ".") {
    $tileWestWalkable = true;
}
if ($proceduralMap[$j-1][$i-1] == ".") {
    $tileNorthWestWalkable = true;
}
if ($proceduralMap[$j-1][$i+1] == ".") {
    $tileNorthEastWalkable = true;
}
if ($proceduralMap[$j+1][$i+1] == ".") {
    $tileSouthEastWalkable = true;
}
if ($proceduralMap[$j+1][$i-1] == ".") {
    $tileSouthWestWalkable = true;
}


$isAValidItemPosition = false;
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


// check if a template item or npc has been placed here already:

$templateItems = json_decode('['.$templateItemsToAppend.']');
$templateNPCs = json_decode('['.$templateNPCsToAppend.']');
/*echo"<code><pre>";
var_dump($templateItems);
echo"</pre></code>";
die();
*/
for ($k = 0; $k < count($templateItems); $k++) {
   //echo $i.",".$j." == ".$templateItems[$k]->tileX.",".$templateItems[$k]->tileY."<br>";
if($templateItems[$k]->tileX == $i) {
if($templateItems[$k]->tileY == $j) {
$isAValidItemPosition = false;
}
}
}
for ($k = 0; $k < count($templateNPCs); $k++) {
if($templateNPCs[$k]->tileX == $i) {
if($templateNPCs[$k]->tileY == $j) {
$isAValidItemPosition = false;
}
}
    }

if($isAValidItemPosition) {
array_push($allSuitableCornerTiles, array($i, $j));
}
        }
    }
}

// random order:
   $randomSuitableCornerTiles = $allSuitableCornerTiles;
            usort($randomSuitableCornerTiles, 'randomArraySorting');

$placedItems = array();

for ($i = 0; $i < $numberOfItems; $i++) {
 // add random item from all possible to the next suitable location:
array_push($placedItems, array(($dungeonDetails[$dungeonName]['possibleRandomItems'][mt_rand(0, count($dungeonDetails[$dungeonName]['possibleRandomItems']) - 1)]),$randomSuitableCornerTiles[$i][0],$randomSuitableCornerTiles[$i][1]));
}

/*
echo"<code><pre>";
var_dump($placedItems);
echo"</pre></code>";
*/
}







function outputTileTrackMap() {
global $proceduralMapTrack, $proceduralDebug, $proceduralMapTilesX, $proceduralMapTilesY, $canvaDimension;



if($proceduralDebug) {
    echo '<div class="sequenceBlock">';


$drawnTileSize = 8; 
$drawnOffset = 20;
   $outputCanvas = imagecreatetruecolor($canvaDimension, $canvaDimension);
    $groundColour = array(219, 215, 190);
    $ground = imagecolorallocate($outputCanvas, $groundColour[0], $groundColour[1], $groundColour[2]);
    imagefilledrectangle($outputCanvas, 0, 0, $canvaDimension, $canvaDimension, $ground);

  for ($i = 0; $i < $proceduralMapTilesX; $i++) {      
            for ($j = 0; $j < $proceduralMapTilesY; $j++) {
                switch ($proceduralMapTrack[$j][$i]) {
    case "|":
    case "-":
  
    // non-walkable tile:
       imagefilledrectangle($outputCanvas,($i)*$drawnTileSize+$drawnOffset,($j)*$drawnTileSize+$drawnOffset,($i+1)*$drawnTileSize+$drawnOffset,($j+1)*$drawnTileSize+$drawnOffset,  imagecolorallocate($outputCanvas, 75, 75, 75));
        break;
       
      
    case ".":
        // empty
        break;      
}

// draw border:
  imagerectangle($outputCanvas,($i)*$drawnTileSize+$drawnOffset,($j)*$drawnTileSize+$drawnOffset,($i+1)*$drawnTileSize+$drawnOffset,($j+1)*$drawnTileSize+$drawnOffset,  imagecolorallocate($outputCanvas, 128, 128, 128));


            }
          
        }



       ob_start();
    imagejpeg($outputCanvas, null, 100);
    $rawImageBytes = ob_get_clean();

    echo "<img src='data:image/jpeg;base64," . base64_encode($rawImageBytes) . "'></div>";

    imagedestroy($outputCanvas);
    }
    }


function removeInnerDoor($doorX, $doorY) {
   
    global $proceduralMap, $drawnTileDoors;
$proceduralMap[$doorX][$doorY] = "|";
//foreach($drawnTileDoors as $key => $thisDrawnDoor) {
for ($i = 0; $i < count($drawnTileDoors); $i++) {
    if($drawnTileDoors[$i][0] == $doorY) {
    if($drawnTileDoors[$i][1] == $doorX) {
        array_splice($drawnTileDoors, $i, 1);
    }
}
    }


// clear any walls either side of it:
    if($proceduralMap[$doorX-1][$doorY] == "#") {
        $proceduralMap[$doorX-1][$doorY] = "|";
    }
        if($proceduralMap[$doorX+1][$doorY] == "#") {
        $proceduralMap[$doorX+1][$doorY] = "|";
    }
        if($proceduralMap[$doorX][$doorY-1] == "#") {
        $proceduralMap[$doorX][$doorY-1] = "|";
    }
       if($proceduralMap[$doorX][$doorY+1] == "#") {
        $proceduralMap[$doorX][$doorY+1] = "|";
    }
    
    


}


function addTracks() {
    global $allDelaunayEdges, $edgesUsedOnDelaunayGraph, $verticesUsedOnDelaunayGraph, $lockedJoints, $proceduralDebug, $drawnTileRooms, $proceduralMapTilesX, $proceduralMapTilesY, $proceduralMapTrack, $proceduralMap, $dungeonDetails, $dungeonName, $minLeft, $minTop, $ratio, $requiredWidth, $requiredHeight;

            // find all unlocked edges:

$allUnlockedEdges = array();
$allRelevantNodes = array();
foreach($allDelaunayEdges as $thisEdge) {
     if ((in_array(new delaunayEdge($thisEdge->v0, $thisEdge->v1), $edgesUsedOnDelaunayGraph)) || (in_array(new delaunayEdge($thisEdge->v1, $thisEdge->v0), $edgesUsedOnDelaunayGraph))) {
// check nodes attached to these vertices to see if a joint exists which is locked
        $theseConnectedNodes = "";
        foreach ($verticesUsedOnDelaunayGraph as $thisVertex) {
            if ($thisVertex->whichNode === $thisEdge->v0->whichNode) {
                $theseConnectedNodes .= "|" . $thisVertex->whichNode->name;
            }
            if ($thisVertex->whichNode === $thisEdge->v1->whichNode) {
                $theseConnectedNodes .= "|" . $thisVertex->whichNode->name;
            }
        }
        $testTheseConnectedNodes = str_replace("|", "-", $theseConnectedNodes);
        if (isset($lockedJoints[$testTheseConnectedNodes])) {
       // locked - ignore
        } else {
        // remove first pipe, and then split node names into an array:
            $edgesToAdd = explode("|", ltrim($theseConnectedNodes, '|'));
        array_push($allUnlockedEdges, $edgesToAdd);
        array_push($allRelevantNodes, $edgesToAdd[0]);
        array_push($allRelevantNodes, $edgesToAdd[1]);
        }
     }
    }
    // loop through all of these, and find the longest stretch of connections - or a loop back to the start node

    $allRelevantNodes = array_unique($allRelevantNodes);

    $longestConnectionofNodes = array();
    foreach($allRelevantNodes as $thisNode) {
        $nodesToCheck = array();
        array_push($nodesToCheck, array("whichNode"=>$thisNode, "lengthSoFar"=>0, "nodesAlreadyUsed"=>array($thisNode),"edgesAlreadyUsed"=>array()));

        do {
            $thisInnerNode = array_shift($nodesToCheck);
            // find connections for this node:
            foreach($allUnlockedEdges as $thisEdge) {
                $thisEdgeReference = implode(",", $thisEdge);
                if(strval($thisEdge[0]) == strval($thisInnerNode['whichNode'])) {
                    //echo " connected to ".$thisEdge[1];
                    if (!(in_array($thisEdge[1], $thisInnerNode['nodesAlreadyUsed']))) {
                        $nodesAlreadyUsed = $thisInnerNode['nodesAlreadyUsed'];
                        array_push($nodesAlreadyUsed, $thisEdge[1]);
                        $edgesAlreadyUsed = $thisInnerNode['edgesAlreadyUsed'];
                        array_push($edgesAlreadyUsed, $thisEdgeReference);
                        $newLength = $thisInnerNode['lengthSoFar']+1;
                        array_push($nodesToCheck, array("whichNode"=>$thisEdge[1], "lengthSoFar"=>$newLength, "nodesAlreadyUsed"=>$nodesAlreadyUsed,"edgesAlreadyUsed"=>$edgesAlreadyUsed));
                        if($newLength > count($longestConnectionofNodes)) {
                            $longestConnectionofNodes = $nodesAlreadyUsed;
                        }
                    }
                    // check for loops:
                    if(strval($thisEdge[1]) == strval($thisNode)) {
                        // but make sure that this edge hasn't been used before, to determine if it's a loop:
                        if (!(in_array($thisEdgeReference, $thisInnerNode['edgesAlreadyUsed']))) {
                            $nodesAlreadyUsed = $thisInnerNode['nodesAlreadyUsed'];
                            array_push($nodesAlreadyUsed, $thisEdge[1]);
                            // favour loops:
                            $newLength = INF;
                            array_push($nodesToCheck, array("whichNode"=>$thisEdge[1], "lengthSoFar"=>$newLength, "nodesAlreadyUsed"=>$nodesAlreadyUsed,"edgesAlreadyUsed"=>$edgesAlreadyUsed));
                            $longestConnectionofNodes = $nodesAlreadyUsed;
                            //echo "loop found<br>";
                        }
                    }
                }
                if(strval($thisEdge[1]) == strval($thisInnerNode['whichNode'])) {
                    //echo " connected to ".$thisEdge[0];
                      if (!(in_array($thisEdge[0], $thisInnerNode['nodesAlreadyUsed']))) {
                        $nodesAlreadyUsed = $thisInnerNode['nodesAlreadyUsed'];
                        array_push($nodesAlreadyUsed, $thisEdge[0]);
                        $edgesAlreadyUsed = $thisInnerNode['edgesAlreadyUsed'];
                        array_push($edgesAlreadyUsed, $thisEdgeReference);
                        $newLength = $thisInnerNode['lengthSoFar']+1;
                        array_push($nodesToCheck, array("whichNode"=>$thisEdge[0], "lengthSoFar"=>$newLength, "nodesAlreadyUsed"=>$nodesAlreadyUsed,"edgesAlreadyUsed"=>$edgesAlreadyUsed));
                        if($newLength > count($longestConnectionofNodes)) {
                            $longestConnectionofNodes = $nodesAlreadyUsed;
                        }
                    }
                    // check for loops:
                    if(strval($thisEdge[0]) == strval($thisNode)) {
                        // but make sure that this edge hasn't been used before, to determine if it's a loop:
                        if (!(in_array($thisEdgeReference, $thisInnerNode['edgesAlreadyUsed']))) {
                            $nodesAlreadyUsed = $thisInnerNode['nodesAlreadyUsed'];
                            array_push($nodesAlreadyUsed, $thisEdge[0]);
                            // favour loops:
                            $newLength = INF;
                            array_push($nodesToCheck, array("whichNode"=>$thisEdge[0], "lengthSoFar"=>$newLength, "nodesAlreadyUsed"=>$nodesAlreadyUsed,"edgesAlreadyUsed"=>$edgesAlreadyUsed));
                            $longestConnectionofNodes = $nodesAlreadyUsed;
                            //echo "loop found<br>";
                        }
                    }
                }
            }
        } while (count($nodesToCheck)>0);
    }
    
    /*
    if($proceduralDebug) {
        echo '<div class="sequenceBlock">';
        echo "longest unlocked sequence found:<br>";
        foreach($longestConnectionofNodes as $thisNode) {
            echo $thisNode." to ";
        }
        echo "</div>";
    }
    */


// track drawing should use the same corridor code from createTileGrid so that they're in the centre of corridors
// can then alter the track when it's within a room to be more interesting, but needs to be central for doors and corridors



   for ($i = 0; $i < $proceduralMapTilesX; $i++) {
        $proceduralMapTrack[$i] = array();
            for ($j = 0; $j < $proceduralMapTilesY; $j++) {
            array_push($proceduralMapTrack[$i], ".");
            }
        }

  $tileMapWidth = floor($requiredWidth * $ratio);
    $tileMapHeight = floor($requiredHeight * $ratio);
  $tileOffsetX = floor(($proceduralMapTilesX - $tileMapWidth)/2);
    $tileOffsetY = floor(($proceduralMapTilesY - $tileMapHeight)/2);


$currentNode = $longestConnectionofNodes[0];
for ($n = 1; $n < count($longestConnectionofNodes); $n++) {

// start a lot of code duplication from createTileGrid():


switch ($dungeonDetails[$dungeonName]['roomType']) {
    case "adjoining-rooms":
        foreach($allDelaunayEdges as $thisEdge) {
         if ((in_array(new delaunayEdge($thisEdge->v0, $thisEdge->v1), $edgesUsedOnDelaunayGraph)) || (in_array(new delaunayEdge($thisEdge->v1, $thisEdge->v0), $edgesUsedOnDelaunayGraph))) {
     // use strval so nodes called 0 or 1 don't evaluate to true or false:
        if(((strval($thisEdge->v0->whichNode->name) == strval($currentNode)) && (strval($thisEdge->v1->whichNode->name) == strval($longestConnectionofNodes[$n]))) || ((strval($thisEdge->v1->whichNode->name) == strval($currentNode)) && (strval($thisEdge->v0->whichNode->name) == strval($longestConnectionofNodes[$n])))){
             //  echo $thisEdge->v0->whichNode->name . " to ". $thisEdge->v1->whichNode->name ."(".$currentNode." and ".$longestConnectionofNodes[$n].")";
       
$leftEdge = $thisEdge->v0->x  - $minLeft;
$rightEdge = $thisEdge->v1->x  - $minLeft;
$topEdge = $thisEdge->v0->y  - $minTop;
$bottomEdge = $thisEdge->v1->y  - $minTop;

$leftTileEdge = floor($leftEdge * $ratio);
$rightTileEdge = floor($rightEdge * $ratio);
$topTileEdge = floor($topEdge * $ratio);
$bottomTileEdge = floor($bottomEdge * $ratio);

// centre the map:
$leftTileEdge += $tileOffsetX;
$rightTileEdge += $tileOffsetX;
$topTileEdge += $tileOffsetY;
$bottomTileEdge += $tileOffsetY;

if($topTileEdge > $bottomTileEdge) {
    // reverse them:
$storedEdge = $topTileEdge;
$topTileEdge = $bottomTileEdge;
$bottomTileEdge = $storedEdge;
}
if($leftTileEdge > $rightTileEdge) {
$storedEdge = $leftTileEdge;
$leftTileEdge = $rightTileEdge;
$rightTileEdge = $storedEdge;
}
    for ($j = $leftTileEdge; $j <= $rightTileEdge; $j++) {
        for ($k = $topTileEdge; $k <= $bottomTileEdge; $k++) {
            // check if this is in a room or not:
            for ($l = 0; $l < count($drawnTileRooms); $l++) {
                if($j>=$drawnTileRooms[$l][0]) {
                    if($k>=$drawnTileRooms[$l][1]) {
                        if($j<=$drawnTileRooms[$l][2]) {
                            if($k<=$drawnTileRooms[$l][3]) {
                                if($proceduralMap[$k][$j] != ".") {
                                    // not already been plotted by the room, so it's a door:
                                    removeInnerDoor($k,$j);
                                }
                            }
                        }
                    }
                }
            }
            if($topTileEdge == $bottomTileEdge) {
$proceduralMapTrack[$k][$j] = "-";
            } else {
                $proceduralMapTrack[$k][$j] = "|";
            }
            
        }
    }
}
}
}

break;

case "cavern":
// how to find track path through cavern corridors? #####
break;

}
// end code from createTileGrid
$currentNode = $longestConnectionofNodes[$n];
}

    outputTileTrackMap();

}

function protectDoors() {
    // make sure that there is space around each entrance and exit:
    global $exitX,$exitY,$entranceX,$entranceY,$proceduralMap;
    for ($i=-2;$i<=2;$i++) {
        for ($j=-2;$j<=2;$j++) {
            $proceduralMap[$exitY+$j][$exitX+$i] = '.';
            $proceduralMap[$entranceY+$j][$entranceX+$i] = '.';
        }
    }
}

function placeDoors() {
    global $doorsJSON, $exitX, $exitY, $thisMapsId, $proceduralMap, $thisPlayersId, $dungeonName, $entranceX, $entranceY, $dungeonDetails;

// place exit:
$doorsJSON = '{';
for ($i=-1;$i<=1;$i++) {
    $doorsJSON .= '"'.($exitX+$i).','.$exitY.'": {  "map": '.($thisMapsId-1).',  "startX": "?';
    if($i ==-1) {
        $doorsJSON .= "-1";
    }
    if($i ==1) {
        $doorsJSON .= "+1";
    }
    $doorsJSON .= '",  "startY": "?"},';
    $proceduralMap[$exitY][($exitX+$i)] = "e";
}

/*
echo'<code style="width:100%;display:block;clear:both;"><pre>';
var_dump($doorsJSON);
echo"</pre></code>";
*/

$previousMap = $thisMapsId+1;



if($previousMap == 0) {
 // get data from config:
$exitX = $dungeonDetails[$dungeonName]['doorCentreWhenLeavingTheDungeon'][0];
$exitY = $dungeonDetails[$dungeonName]['doorCentreWhenLeavingTheDungeon'][1];
$targetMap = $dungeonDetails[$dungeonName]['mapWhenLeavingTheDungeon']; 
// +1 on Y to place the doors just before the place the hero will start:
    for ($i=-1;$i<=1;$i++) {
    $doorsJSON .= '"'.($entranceX+$i).','.($entranceY+1).'": {  "map": '.$targetMap.',  "startX": ';
         $doorsJSON .= ($exitX+$i);
    $doorsJSON .= ',  "startY": '.$exitY.'},';
    $proceduralMap[$entranceY+1][($entranceX+$i)] = "e";
    // set the position that the hero wil start on to be blank:
    $proceduralMap[$entranceY][($entranceX+$i)] = ".";
}
   
} else {


// load previous procedural map json 
    $jsonPath = $_SERVER['DOCUMENT_ROOT'].'/data/chr'.$thisPlayersId.'/dungeon/'.$dungeonName.'/'.$previousMap.'.json';
    $previousMapFile = file_get_contents($jsonPath);
$previousMapJSON = json_decode($previousMapFile, TRUE);
$previousMapsExitDoors = array();
foreach ($previousMapJSON['map']['doors'] as $thisDoorKey => $thisDoor) {
if($thisDoor["map"] == $thisMapsId) {
$thisDoorLocation = explode(",",$thisDoorKey);
array_push($previousMapsExitDoors, array($thisDoorLocation[0],$thisDoorLocation[1]));
}
}



for ($i=-1;$i<=1;$i++) {
    // +1 on Y to place the doors just before the place the hero will start:
    $doorsJSON .= '"'.($entranceX+$i).','.($entranceY+1).'": {  "map": '.$previousMap.',  "startX": "'.$previousMapsExitDoors[($i+1)][0].'",  "startY": "'.$previousMapsExitDoors[($i+1)][1].'"},';
    $proceduralMap[$entranceY+1][($entranceX+$i)] = "e";
    $proceduralMap[$entranceY][($entranceX+$i)] = ".";
}
}

// remove last comma:
$doorsJSON = rtrim($doorsJSON, ',');

$doorsJSON.="}";

/*
echo'<code style="width:100%;display:block;clear:both;"><pre>';
var_dump($doorsJSON);
echo"</pre></code>";
*/

  
}


function drawFilledCircle($xp, $yp, $radius, $elevation) {
    // thanks to http://actionsnippet.com/?p=496
    $xoff = 0;
    $yoff = $radius;
    $balance = - $radius;
    while ($xoff <= $yoff) {
        $p0 = $xp - $xoff;
        $p1 = $xp - $yoff;
        $w0 = $xoff + $xoff;
        $w1 = $yoff + $yoff;
        hLine($p0, $yp + $yoff, $w0, $elevation);
        hLine($p0, $yp - $yoff, $w0, $elevation);
        hLine($p1, $yp + $xoff, $w1, $elevation);
        hLine($p1, $yp - $xoff, $w1, $elevation);
        if (($balance+= $xoff++ + $xoff) >= 0) {
            $balance-= --$yoff + $yoff;
        }
    }
}
function hLine($xp, $yp, $w, $elevation) {
    global $elevationMap;
    for ($i = 0;$i < $w;$i++) {
        $elevationMap[$yp][$xp + $i] = $elevation;
    }
}



function createElevationMap() {
    global $proceduralDebug, $proceduralMapTilesX, $proceduralMapTilesY, $canvaDimension, $dungeonDetails, $dungeonName, $elevationMap;

    $drawnTileSize = 8; 
    $drawnOffset = 20;

    $maximumElevation = $dungeonDetails[$dungeonName]['maxElevation'];

    for ($i = 0; $i < $proceduralMapTilesX; $i++) {      
        for ($j = 0; $j < $proceduralMapTilesY; $j++) {
            $elevationMap[$j][$i] = 0;
        }
    }


    if($maximumElevation > 0) {
    $elevationPoints = mt_rand(0,6);

    for ($i = 0; $i < $elevationPoints; $i++) {
        // 
//$elevationMap[mt_rand(0,$proceduralMapTilesY)][mt_rand(0,$proceduralMapTilesX)] = mt_rand(0,$maximumElevation);
        drawFilledCircle(mt_rand(0,$proceduralMapTilesX),mt_rand(0,$proceduralMapTilesY),mt_rand(5,15),mt_rand(0,$maximumElevation));
    }

    // smooth (// http://nic-gamedev.blogspot.co.uk/2013/02/simple-terrain-smoothing.html)
$numberOfPasses = 4;
for ($i = 0; $i < $numberOfPasses; $i++) {
    $newElevationMap = $elevationMap;
    
  for ($y = 0; $y < $proceduralMapTilesX; $y++) {
  for ($x = 0; $x < $proceduralMapTilesY; $x++) {
     $adjacentSections = 0;
     $sectionsTotal = 0;
    if ($x - 1 > 0) {
      // Check to left
      $sectionsTotal += $elevationMap[$x - 1][$y];
      $adjacentSections++;

      if ($y - 1 > 0) {
        // Check up and to the left
        $sectionsTotal += $elevationMap[$x - 1][$y - 1];
        $adjacentSections++;
      }

      if ($y + 1 < $proceduralMapTilesY) {
        // Check down and to the left
        $sectionsTotal += $elevationMap[$x - 1][$y + 1];
        $adjacentSections++;
      }
    }

    if ($x + 1 < $proceduralMapTilesX) {
      // Check to right

      $sectionsTotal += $elevationMap[$x + 1][$y];
      $adjacentSections++;

      if ($y - 1 > 0) {
        // Check up and to the right
        $sectionsTotal += $elevationMap[$x + 1][$y - 1];
        $adjacentSections++;
      }

      if ($y + 1 < $proceduralMapTilesY) {
        // Check down and to the right
        $sectionsTotal += $elevationMap[$x + 1][$y + 1];
        $adjacentSections++;
      }
    }

    if ($y - 1 > 0) {
      // Check above
      $sectionsTotal += $elevationMap[$x][$y - 1];
      $adjacentSections++;
    }
    if ($y + 1 < $proceduralMapTilesY) {
      // Check below
      $sectionsTotal += $elevationMap[$x][$y + 1];
      $adjacentSections++;
    }
    $newElevationMap[$x][$y] = ($elevationMap[$x][$y] + ($sectionsTotal / $adjacentSections)) * 0.5;
  }
}

$elevationMap = $newElevationMap;
    }

}
    if($proceduralDebug) {
        $outputCanvas = imagecreatetruecolor($canvaDimension, $canvaDimension);
        $groundColour = array(219, 215, 190);
        $ground       = imagecolorallocate($outputCanvas, $groundColour[0], $groundColour[1], $groundColour[2]);
        imagefilledrectangle($outputCanvas, 0, 0, $canvaDimension, $canvaDimension, $ground);

        for ($i = 0; $i < $proceduralMapTilesX; $i++) {      
            for ($j = 0; $j < $proceduralMapTilesY; $j++) {
                $thisTilesColour = 255-(2.55*$elevationMap[$j][$i]);
          imagefilledrectangle($outputCanvas,($i)*$drawnTileSize+$drawnOffset,($j)*$drawnTileSize+$drawnOffset,($i+1)*$drawnTileSize+$drawnOffset,($j+1)*$drawnTileSize+$drawnOffset, imagecolorallocate($outputCanvas, $thisTilesColour, $thisTilesColour, $thisTilesColour));
        }
        }


        echo '<div class="sequenceBlock">';
        ob_start();
        imagejpeg($outputCanvas, null, 100);
        $rawImageBytes = ob_get_clean();
        echo "<img src='data:image/jpeg;base64," . base64_encode($rawImageBytes) . "'></div>";
        imagedestroy($outputCanvas);
        echo '</div>';
    }
    
}






function getTileIsoCentreCoordX($tileX, $tileY) {
  global $tileW, $proceduralMapTilesY;
    return $tileW / 2 * ($proceduralMapTilesY - $tileY + $tileX);
}

function getTileIsoCentreCoordY($tileX, $tileY) {
  global $tileH;
    return $tileH / 2 * ($tileY + $tileX);
}

function createBackgroundImage() {
    global $dungeonDetails, $dungeonName, $tileW,$tileH, $thisPlayersId, $thisMapsId, $proceduralMap, $proceduralMapTrack, $proceduralMapTilesX, $proceduralMapTilesY;

    // create unique background image for this map:
    if($dungeonDetails[$dungeonName]['needsDynamicallyCreatedBackground']) {
        $bgImage = imagecreatefrompng('../images/game-world/backgrounds/'.$dungeonName.'.png');
        // dynamically draw the floor tiles:
        $canvasWidth =  imagesx($bgImage); 
        $canvasHeight =  imagesy($bgImage); 
        $fullImage = imagecreatetruecolor($canvasWidth, $canvasHeight);
        $rootFolder = '../images/game-world/dungeon-terrain/';
        $canvasOffsetX = 0;
        $canvasOffsetY = 0;

        imagecopy ( $fullImage, $bgImage, 0, 0, 0, 0, imagesx($bgImage), imagesy($bgImage) );

        // draw walkable floors:
         for ($i=1;$i<=2;$i++) {
          ${'roomFloorTile'.$i} = imagecreatefrompng($rootFolder.$dungeonName.'/stone-'.$i.'.png');
        }
        for ($i=1;$i<=2;$i++) {
          ${'corridorFloorTile'.$i} = imagecreatefrompng($rootFolder.$dungeonName.'/wood-'.$i.'.png');
        }
        $trackTileEW = imagecreatefrompng($rootFolder.$dungeonName.'/track-1.png');
        $trackTileNS = imagecreatefrompng($rootFolder.$dungeonName.'/track-2.png');

        for ($i = 0; $i < $proceduralMapTilesX; $i++) {   
            for ($j = 0; $j < $proceduralMapTilesY; $j++) {
                if($proceduralMap[$j][$i] == '.') {
                    $thisX = getTileIsoCentreCoordX($i, $j);
                    $thisY = getTileIsoCentreCoordY($i, $j);
                    $whichHardFloorAsset = mt_rand(1,2);
                    imagecopy ( $fullImage, ${'roomFloorTile'.$whichHardFloorAsset}, floor($thisX - $tileW/2 + $canvasOffsetX ), floor($thisY - $tileH/2 + $canvasOffsetY + $tileH/2), 0, 0, imagesx(${'roomFloorTile'.$whichHardFloorAsset}), imagesy(${'roomFloorTile'.$whichHardFloorAsset}) );
                } else if(($proceduralMap[$j][$i] == '|') || ($proceduralMap[$j][$i] == 'd') || ($proceduralMap[$j][$i] == 'D')) {
                    $thisX = getTileIsoCentreCoordX($i, $j);
                    $thisY = getTileIsoCentreCoordY($i, $j);
                    $whichHardFloorAsset = mt_rand(1,2);
                    imagecopy ( $fullImage, ${'corridorFloorTile'.$whichHardFloorAsset}, floor($thisX - $tileW/2 + $canvasOffsetX ), floor($thisY - $tileH/2 + $canvasOffsetY + $tileH/2), 0, 0, imagesx(${'corridorFloorTile'.$whichHardFloorAsset}), imagesy(${'corridorFloorTile'.$whichHardFloorAsset}) );
                }
                if(isset($proceduralMapTrack)) {

                    if($proceduralMapTrack[$j][$i] == '-') {
                        $thisX = getTileIsoCentreCoordX($i, $j);
                        $thisY = getTileIsoCentreCoordY($i, $j);
                        imagecopy ( $fullImage, $trackTileEW, floor($thisX - $tileW/2 + $canvasOffsetX ), floor($thisY - $tileH/2 + $canvasOffsetY + $tileH/2), 0, 0, imagesx($trackTileEW), imagesy($trackTileEW) );
                    }
                    if($proceduralMapTrack[$j][$i] == '|') {
                        $thisX = getTileIsoCentreCoordX($i, $j);
                        $thisY = getTileIsoCentreCoordY($i, $j);
                        imagecopy ( $fullImage, $trackTileNS, floor($thisX - $tileW/2 + $canvasOffsetX ), floor($thisY - $tileH/2 + $canvasOffsetY + $tileH/2), 0, 0, imagesx($trackTileNS), imagesy($trackTileNS) );
                    }

                }
            }
        }

        imagedestroy($bgImage);
    } else {
        // just copy the base one:
        $fullImage = imagecreatefrompng('../images/game-world/backgrounds/'.$dungeonName.'.png');
    }
    imagejpeg($fullImage, "../data/chr" . $thisPlayersId . "/dungeon/". $dungeonName ."/backgrounds/" . $thisMapsId . ".jpg", 95);
    imagedestroy($fullImage);
}

function outputIsometricView() {
global $connection,$dungeonDetails,$tileW,$tileH, $thisMapsId, $thisPlayersId, $proceduralDebug, $dungeonName, $outputJSON, $proceduralMapTilesX, $proceduralMapTilesY, $canvaDimension;

    echo '<div class="sequenceBlock wider">';
$rootFolder = '../images/game-world/';

    $bgImage = imagecreatefromjpeg("../data/chr" . $thisPlayersId . "/dungeon/". $dungeonName ."/backgrounds/" . $thisMapsId . ".jpg");




$canvasWidth =  imagesx($bgImage); 
 $canvasHeight =  imagesy($bgImage); 

$canvasOffsetX = 0;
$canvasOffsetY = 0;

$fullImage = imagecreatetruecolor(imagesx($bgImage), imagesy($bgImage));

$allNPCsToDraw = array();
$allItemsToDraw = array();

imagecopy ( $fullImage, $bgImage, 0, 0, 0, 0, imagesx($bgImage), imagesy($bgImage) );
$decodedJSON = json_decode($outputJSON, true);
for ($i=0;$i<count($decodedJSON["map"]["graphics"]);$i++) {
  ${'assetImg'.$i} = imagecreatefrompng($rootFolder.'terrain/'.$decodedJSON["map"]["graphics"][$i]["src"]);

}
for ($i=0;$i<count($decodedJSON["map"]["npcs"]);$i++) {
  ${'assetNPCImg'.$i} = imagecreatefrompng($rootFolder.'npcs/'.$decodedJSON["map"]["npcs"][$i]["src"]);
  $allNPCsToDraw[$decodedJSON["map"]["npcs"][$i]["tileX"]."-".$decodedJSON["map"]["npcs"][$i]["tileY"]] = array($decodedJSON["map"]["npcs"][$i], ${'assetNPCImg'.$i});
}
$allInteriorDoors = array();
foreach ($decodedJSON["map"]["innerDoors"] as &$thisInnerDoor) {
  ${'assetDoorImg'.$i} = imagecreatefrompng($rootFolder.'terrain/'.$decodedJSON["map"]["graphics"][($thisInnerDoor["graphic"])]["src"]);
  $allInteriorDoors[$thisInnerDoor["tileX"]."-".$thisInnerDoor["tileY"]] = array($thisInnerDoor,$decodedJSON["map"]["graphics"][($thisInnerDoor["graphic"])],${'assetDoorImg'.$i});
}


$allItemsRequired = array();
for ($i=0;$i<count($decodedJSON["map"]["items"]);$i++) {
  array_push($allItemsRequired, $decodedJSON["map"]["items"][$i]["type"]);
}

$allItemsRequired = array_unique($allItemsRequired);
$itemIdsToGet =implode(",",$allItemsRequired);
$inventoryItemData = array();
$query3 = "SELECT tblinventoryitems.* from tblinventoryitems where tblinventoryitems.itemID in (".$itemIdsToGet.")";
$result3 = mysqli_query($connection, $query3) or die ("tblinventoryitems 2 failed:".$query3);
while ($row = mysqli_fetch_array($result3, MYSQLI_ASSOC)) {
    extract($row);
    $inventoryItemData[$itemID] = $row;
}
mysqli_free_result($result3);



for ($i=0;$i<count($decodedJSON["map"]["items"]);$i++) {
    ${'assetItemImg'.$i} = imagecreatefrompng($rootFolder.'items/'.$inventoryItemData[($decodedJSON["map"]["items"][$i]["type"])]["cleanURL"].'.png');
  $allItemsToDraw[$decodedJSON["map"]["items"][$i]["tileX"]."-".$decodedJSON["map"]["items"][$i]["tileY"]] = array($inventoryItemData[($decodedJSON["map"]["items"][$i]["type"])], ${'assetItemImg'.$i});
}



$isoMap = $decodedJSON["map"]["terrain"];
// draw tiles
for ( $i = 0; $i < $proceduralMapTilesX; $i++) {
            for ( $j = 0; $j < $proceduralMapTilesY; $j++) {
                // the tile coordinates should be positioned by i,j but the way the map is drawn, the reference in the array is j,i
                // this makes the map array more readable when editing
                 $thisX = getTileIsoCentreCoordX($i, $j);
                    $thisY = getTileIsoCentreCoordY($i, $j);
    if (is_numeric($isoMap[$j][$i])) {


                   
                   $whichAsset = intval($isoMap[$j][$i]); 
                     $thisGraphicCentreX = $decodedJSON["map"]["graphics"][$whichAsset]["centreX"];
                    $thisGraphicCentreY = $decodedJSON["map"]["graphics"][$whichAsset]["centreY"];  
// need to offset by half a tile to match starting hero position at tile centre:
                    imagecopy ( $fullImage, ${'assetImg'.$whichAsset}, floor($thisX - $thisGraphicCentreX + $canvasOffsetX ), floor($thisY - $thisGraphicCentreY + $canvasOffsetY + $tileH/2), 0, 0, imagesx(${'assetImg'.$whichAsset}), imagesy(${'assetImg'.$whichAsset}) );
                  }
// check for NPCs:
                  $tileReference = $i."-".$j;
                  if (array_key_exists($tileReference, $allNPCsToDraw)) {
                    // this does ignore facing #####
                    imagecopy ( $fullImage , $allNPCsToDraw[$tileReference][1] , floor($thisX - $allNPCsToDraw[$tileReference][0]['centreX'] + $canvasOffsetX ), floor($thisY - $allNPCsToDraw[$tileReference][0]['centreY'] + $canvasOffsetY + $tileH/2) , 0 , 0 , $allNPCsToDraw[$tileReference][0]['spriteWidth'] , $allNPCsToDraw[$tileReference][0]['spriteHeight'] );
                  }
                  // check for items:
                  if (array_key_exists($tileReference, $allItemsToDraw)) {
                    $spriteWidth = imagesx($allItemsToDraw[$tileReference][1]);
                    $spriteHeight = imagesy($allItemsToDraw[$tileReference][1]);

                    if($allItemsToDraw[$tileReference][0]["spriteWidth"] !== NULL) {
$spriteWidth = $allItemsToDraw[$tileReference][0]["spriteWidth"];
                    }
                     if($allItemsToDraw[$tileReference][0]["spriteHeight"] !== NULL) {
$spriteHeight = $allItemsToDraw[$tileReference][0]["spriteHeight"];
                    }
                    imagecopy ( $fullImage , $allItemsToDraw[$tileReference][1] , floor($thisX - $allItemsToDraw[$tileReference][0]["centreX"] + $canvasOffsetX ), floor($thisY - $allItemsToDraw[$tileReference][0]["centreY"] + $canvasOffsetY + $tileH/2) , 0 , 0 , $spriteWidth, $spriteHeight );
                  }
                  // check for inner doors:
                  if (array_key_exists($tileReference, $allInteriorDoors)) {
                    // inner door object, graphic object, graphic asset
                    imagecopy ( $fullImage , $allInteriorDoors[$tileReference][2] , floor($thisX - $allInteriorDoors[$tileReference][1]["centreX"] + $canvasOffsetX ), floor($thisY - $allInteriorDoors[$tileReference][1]["centreY"] + $canvasOffsetY + $tileH/2) , 0 , 0 , imagesx($allInteriorDoors[$tileReference][2]), imagesy($allInteriorDoors[$tileReference][2]) );
                  }

            }
        }




       ob_start();
    imagejpeg($fullImage, null, 100);
    $rawImageBytes = ob_get_clean();

    echo "<img src='data:image/jpeg;base64," . base64_encode($rawImageBytes) . "'></div>";

    imagedestroy($bgImage);
imagedestroy($fullImage);
}

// linear connection with 2 nodes between the start and end:
// $startGrammar = "SOOE";

// simple branch with a node on each branch:
// $startGrammar = "S{O,O}E";

// simple branch to one dead end:
// $startGrammer = "S{O,O|}E";

// a one-way valve between 2 nodes:
// $startGrammar = "SO>OE";

// A node containing 2 hazards and 1 lot of treasure:
// $startGrammar = "SO[!,!,$]E";

// a secret joint between 2 central nodes:
// $startGrammar = "SO?OE";

// a branch with one of the connecting branches being a secret:
// $startGrammar = "SO{O,O?}OE";

// A node containing a key, followed by a locked joint that can be opened by the key:
// $startGrammar = "SO[K#1]O#1#OE";

// a sequence of 2 locks and keys:
// $startGrammar = "SOO[K#1]OO#1#O[K#2]#2#OE";

// a branching structure with one of the closing joints being locked:
// $startGrammar = "SO[K#1]{O,O#1#}OE";

// a nested branching structure:
// $startGrammar = "S{OOO,O{O,O}O}E";

// nested branches with secret terminal nodes:
// $startGrammar = "S{O{O,O?},O?}E";

// nested locks:
// $startGrammar = "S{O[K#2#]{O,O#2#},O[K#1]O#1#}E";

// 'window' - the 2 nodes are visible but not accessible from each other:
// $startGrammar = "S:E";

// triangular branch:
// $startGrammar = "S{,O}E";



$fileIsAlreadyGenerated = false;
// check if the file has already been created:


if($isIncluded) {
$thisMapsId = intval($map);
$thisPlayersId = $chr;
} else {
      $thisMapsId = $_GET['requestedMap'];
    $thisPlayersId = 999;
        if(isset($_GET['chr'])) {
    $thisPlayersId = $_GET['chr'];
}
}

if($isIncluded) {
    $dungeonName = $randomDungeonName;
} else {
    $dungeonName = $_GET["dungeonName"];
}
$proceduralMapFilename = "../data/chr" . $thisPlayersId . "/dungeon/".$dungeonName."/" . $thisMapsId . '.json';
 if (!$proceduralDebug) {
    if (is_file($proceduralMapFilename)) {
        if ($isIncluded) {
            $thisMapDataJson = file_get_contents($proceduralMapFilename);
            $fileIsAlreadyGenerated = true;
        } else {
            header("Location: /" . $proceduralMapFilename);
            die();
        }
    }
}





if(!($fileIsAlreadyGenerated)) {
    do {
        init();

        $possibleStartGrammars = array(
            // really simple, linear path:
            "SXE",
        );

    // secret to treasure (with one way continuation back to the main path):
        $grownGrammar = "S{?O[$]>,O}E";

    // dramatic cycle (see the goal early on, but can't get to it yet, so builds anticipation):
        $grownGrammar = "S{:,OO}E";

    // simple lock and key cycle:
        $grownGrammar = "S{,O[K#1]>}O#1#E";

    // variant lock and key cycle:
        $grownGrammar = "SO{,<O[K#1]}O#1#E";

    // branching with a shorter but more hazardous path:
        $grownGrammar = "S{O[!!],OOOOO}E";

    // double lock and key:
        $grownGrammar = "S{O[K#1],#1#O[K#2]>}O#2#E";

    // unknown return path (eg. bridge collapses behind to get to the goal):
        $grownGrammar = "S{<,>O[K#1#],#1#E|}O";

    // gambit with visible reward on alternate path:
        $grownGrammar = "S{,:O[$]O[!]}E";

    // key item cycle:
        $grownGrammar = "S{#1#,O{,#1#E|}}>O[K#1]";

     
    // 3 way branch:
        $grownGrammar = "S{O,O,O}OOE";

    // zelda gnarled root dungeon:
    $grownGrammar = "S{O[K#2]|,#2#O{#0#O[K#1#]|,}O{O[K#3#]|,}O#3#O[K#0#]|,}O#1#E";


// hub rooms - where a branch returns to its first node (needs a non-regular delaunay graph though)
$grownGrammar = "SO{(OO),(OO)|}OE";

       $grownGrammar = growGrammar($possibleStartGrammars[mt_rand(0, count($possibleStartGrammars) - 1)], mt_rand(3, 4));





   //    $grownGrammar = "SO(OO)(OO)OE";
if(isset($_GET["grammar"])) {
$grownGrammar = $_GET["grammar"];
}

        parseStringGrammar($grownGrammar);
        moveNodesApart();
       

        outputConnections();

        // random, grid, wonky-grid, offset-grid
        $layoutType = $dungeonDetails[$dungeonName]['underlyingGridLayout'];




        createDelaunayGraph($layoutType);
        if (($layoutType == "offset-grid") || ($layoutType == "grid")) {
           removeDiagonalEdges();
        }
    } while (!plotConnectivityOnDelaunayGraph());


    $tileW = 48;
    $tileH = $tileW/2;

    outputDelaunayGraph();
    createGridLayout();
    outputSizedNodesLayout();
    createTileGrid();
    //createElevationMap();
    placeDoors();
    findRelevantTemplates();
    outputTileMap();
    if(mt_rand(1,100) <= $dungeonDetails[$dungeonName]['percentChanceOfTracks']) {
        addTracks();
        // will need a dynamic background to draw the tracks:
        $dungeonDetails[$dungeonName]['needsDynamicallyCreatedBackground'] = true;
    }
    addRandomItems();
    outputJSONContent();
    createBackgroundImage();
    if($proceduralDebug) {
        outputIsometricView();
    }


    if($proceduralDebug) {
    echo '<code style="width:100%;clear:both;display:block;font-size:0.8em;">';
    echo htmlentities($outputJSON);
    } else {
        if($isIncluded) {
    $thisMapDataJson = $outputJSON;
        } else {
        echo $outputJSON;
    }
    }

    if($proceduralDebug) {
    echo '</code>';
    }



    if($proceduralDebug) {
    echo '<p style="clear:both;padding-top:20px;"><a href="' . explode("?", $_SERVER["REQUEST_URI"])[0] . '?debug=true&amp;dungeonName='.$dungeonName.'&amp;requestedMap='.$thisMapsId.'&amp;seed=' . $unadjustedSeed . '">' . $unadjustedSeed . '</a> | <a href="' . explode("?", $_SERVER["REQUEST_URI"])[0] . '?debug=true&amp;dungeonName='.$dungeonName.'&amp;requestedMap='.$thisMapsId.'">New seed</a></p>';
    }
}
?>
