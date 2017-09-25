<?php

// avoid script time out:
set_time_limit(0);

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

function addNode($type, $x, $y)
{
    global $keysUsed;
    $newNode       = new node();
    $newNode->type = $type;

    if (getRNGNumber() > 0.5) {
        $x -= (2 + getRNGNumber());
        $y += (0.5);
    } else {
        $x += (0.5);
        $y -= (2 + getRNGNumber());
    }

    $newNode->x      = $x;
    $newNode->y      = $y;
    $newNode->radius = getRNGNumber() * 15 + 5;
    // might be inefficient to call this every time: ###
    moveNodesApart();
    if ($type == "KEYHOLDER") {
        $newNode->whichKey = $keysUsed;
    }
    return $newNode;
}

function addJoint($connectNodeAId, $connectNodeBId, $isLocked = false)
{
    global $nodeList, $keysUsed;
    $newJoint           = new joint();
    $newJoint->nodeA    = $nodeList[$connectNodeAId]->name;
    $newJoint->nodeB    = $nodeList[$connectNodeBId]->name;
    $newJoint->isLocked = $isLocked;
    if ($newJoint->isLocked) {
        $newJoint->whichKey = $keysUsed;
    }
    return $newJoint;
}

function addNodeAndJointTo($connectNodeId, $type, $x, $y, $isLocked = false)
{
    global $nodeList;
    $newNode = addNode($type, $x, $y);
    addJoint($nodeList[$connectNodeId]->name, $newNode->name, $isLocked);
    return $newNode;
}

function addNodeBetween($connectNodeAId, $connectNodeBId, $isFirstjointLocked = false, $isLastjointLocked = false)
{
    global $nodeList;
    $newNode = addNodeAndJointTo($connectNodeBId, "NORMAL", ($nodeList[$connectNodeAId]->x + $nodeList[$connectNodeBId]->x) / 2, ($nodeList[$connectNodeAId]->y + $nodeList[$connectNodeBId]->y) / 2, $isLastjointLocked);
    removeJoint($connectNodeAId, $connectNodeBId);
    addJoint($connectNodeAId, count($nodeList) - 1, $isFirstjointLocked);
    return $newNode;
}

function addCircularLockAndKeyBetween($connectNodeAId, $connectNodeBId)
{
    global $nodeList, $keysUsed;
    $keysUsed++;
    // add new node between:
    $newNode = addNodeBetween($connectNodeAId, $connectNodeBId, false, true);
    // add key node joined to that:
    $keyNode = addNodeAndJointTo($newNode->name, "KEYHOLDER", $newNode->x + 0.5, $newNode->y + 0.5);
    // add node between first and key node:
    addNodeBetween($connectNodeAId, $keyNode->name);
}

function removeJoint($connectNodeAId, $connectNodeBId)
{
    global $jointList, $debug;
    foreach ($jointList as $jointKey => $jointElement) {

        if ((($jointElement->nodeA === $connectNodeAId) && ($jointElement->nodeB === $connectNodeBId)) || (($jointElement->nodeB === $connectNodeAId) && ($jointElement->nodeA === $connectNodeBId))) {

            unset($jointList[$jointKey]);
            break;
        }

    }
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
    global $nodeList, $debug;
    foreach ($nodeList as $thisOuterNode) {
        foreach ($nodeList as $thisNode) {
            if ($thisNode !== $thisOuterNode) {
                if ($debug) {
                    //  echo $thisNode->name." !== ".$thisOuterNode->name."<br>";
                }
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

function output()
{
    global $debug, $nodeList, $jointList, $canvaDimension, $keyColours;

    if (!$debug) {
        $outputCanvas = imagecreatetruecolor($canvaDimension, $canvaDimension);
        $groundColour = array(219, 215, 190);
        $ground       = imagecolorallocate($outputCanvas, $groundColour[0], $groundColour[1], $groundColour[2]);
        imagefilledrectangle($outputCanvas, 0, 0, $canvaDimension, $canvaDimension, $ground);
        // draw nodes:
        foreach ($nodeList as $thisNode) {
            if ($thisNode->type == "KEYHOLDER") {
                //  if ($thisNode->holdsKey) {
                $thisNodeColour = imagecolorallocate($outputCanvas, $keyColours[$thisNode->whichKey][0], $keyColours[$thisNode->whichKey][1], $keyColours[$thisNode->whichKey][2]);
                //  }

//$thisNodeColour = imagecolorallocate($outputCanvas, 255,235,15);
            } else if ($thisNode->type == "START") {
                $thisNodeColour = imagecolorallocate($outputCanvas, 255, 255, 255);
            } else if ($thisNode->type == "SIDEGOAL") {
                $thisNodeColour = imagecolorallocate($outputCanvas, 90, 90, 90);
            } else if ($thisNode->type == "ENDGOAL") {
                $thisNodeColour = imagecolorallocate($outputCanvas, 0, 0, 0);
            } else {
                $thisNodeColour = imagecolorallocate($outputCanvas, 128, 128, 128);
            }
            imagefilledellipse($outputCanvas, $thisNode->x, $thisNode->y, $thisNode->radius * 2, $thisNode->radius * 2, $thisNodeColour);
            // imagefilledrectangle($outputCanvas, $thisNode->x-$thisNode->radius, $thisNode->y-$thisNode->radius,$thisNode->x+$thisNode->radius,$thisNode->y+$thisNode->radius, $thisNodeColour);
        }
        // draw joints:
        imagesetthickness($outputCanvas, 2);
        foreach ($jointList as $thisJoint) {
            if ($thisJoint->isLocked) {
                $thisJointColour = imagecolorallocate($outputCanvas, $keyColours[$thisJoint->whichKey][0], $keyColours[$thisJoint->whichKey][1], $keyColours[$thisJoint->whichKey][2]);
                //$thisJointColour = imagecolorallocate($outputCanvas, 255,235,15);
            } else {
                $thisJointColour = imagecolorallocate($outputCanvas, 32, 32, 32);
            }
            imageline($outputCanvas, $nodeList[$thisJoint->nodeA]->x, $nodeList[$thisJoint->nodeA]->y, $nodeList[$thisJoint->nodeB]->x, $nodeList[$thisJoint->nodeB]->y, $thisJointColour);
        }

        header('Content-Type: image/jpeg');
        imagejpeg($outputCanvas, null, 100);
        imagedestroy($outputCanvas);
    }
}

function fillUpWithMoreNodes($howMany)
{
    global $nodeList;
    for ($i = 0; $i < $howMany; $i++) {
        addNodeBetween(0, count($nodeList) - 1);
    }
}

function init()
{
    global $nodeList, $jointList, $debug, $canvaDimension, $keyColours, $keysUsed;
    $debug = false;
    if (isset($_GET['debug'])) {
        $debug = boolval($_GET['debug']);
    }
    $keyColours = array(
        array(255, 0, 64),
        array(255, 235, 15),
        array(15, 134, 255),
        array(19, 209, 46),
    );
    $keysUsed       = 0;
    $canvaDimension = 600;
    $nodeList       = array();
    $jointList      = array();
    if (isset($_GET["seed"])) {
        $storedSeed = $_GET["seed"];
    } else {
        // http://php.net/manual/en/function.mt_srand.php
        list($usec, $sec) = explode(' ', microtime());
        $storedSeed       = floor((float) $sec + ((float) $usec * 100000));
    }
    mt_srand($storedSeed);

}

function growGrammar()
{

}

function parseStringGrammar($thisGrammar)
{
    global $nodeList, $jointList, $debug, $canvaDimension;
    $characterCounter    = 0;
    $thisDepth           = 0;
    $thisBranchesParents = array();
    //  $thisBranchesParents[$thisDepth]       = null;
    $thisBranchesTerminalNodes = array();
    //  $thisBranchesTerminalNodes[$thisDepth] = null;
    do {
        $thisCharacter = substr($thisGrammar, $characterCounter, 1);
        // echo $thisCharacter."<br>";
        switch ($thisCharacter) {
            case "S":
                // start node:
                $newNode       = addNode("START", $canvaDimension / 2, $canvaDimension / 2);
                $activeParents = array($newNode);
                break;
            case "E":
                // end node:

                $newNode = addNode("ENDGOAL", $activeParents[0]->x + mt_rand(-10, 10), $activeParents[0]->y + mt_rand(-10, 10));
                for ($i = 0; $i < count($activeParents); $i++) {
                    addJoint($activeParents[$i]->name, $newNode->name);
                }
                break;
            case "O":
                // add node:
                $newNode = addNode("NORMAL", $activeParents[0]->x + mt_rand(-10, 10), $activeParents[0]->y + mt_rand(-10, 10));

                for ($i = 0; $i < count($activeParents); $i++) {
                    addJoint($activeParents[$i]->name, $newNode->name);
                }
                $activeParents = array($newNode);
                break;
            case "{":
                // branch opens
                $thisDepth++;
                $thisBranchesParents[$thisDepth]       = $activeParents;
                $thisBranchesTerminalNodes[$thisDepth] = array();
                break;
            case "}":
                // branching closes
                // end of this branch - keep track of the terminal nodes
                for ($i = 0; $i < count($activeParents); $i++) {
                    array_push($thisBranchesTerminalNodes[$thisDepth], $activeParents[$i]);
                }

                $activeParents = $thisBranchesTerminalNodes[$thisDepth];

                //$thisBranchesParents[$thisDepth] = null;
                $thisDepth--;
                break;
            case ",":
                // end of this branch - keep track of the terminal nodes

                for ($i = 0; $i < count($activeParents); $i++) {
                    array_push($thisBranchesTerminalNodes[$thisDepth], $activeParents[$i]);
                }

// reset to the parent
                $activeParents = $thisBranchesParents[$thisDepth];
                break;
            default:
                // nothing
        }
        $characterCounter++;
    } while ($characterCounter <= strlen($thisGrammar));
}

do {
    init();

    //$startGrammar = "SO(,>O[K#1]>)O(L#1)E";
    $startGrammar = "S{OOO,O{O,O}O}E";
    $startGrammar = "S{O,O}E";
    $startGrammar = "S{OO,O}E";
    //  $startGrammar = "SOOE";
    growGrammar();
    parseStringGrammar($startGrammar);
    moveNodesApart();
} while (anyJointHasIntersected());

output();
