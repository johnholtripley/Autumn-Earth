<?php

include $_SERVER['DOCUMENT_ROOT'] . "/game-world/generateCircularDungeonMap-third-party-arrow-code.php";

/* ----

TO DO:
Create meta levels so can have foreshadowing and hints about future encounters
Map nodes to tiles
add template sections
Convert locks, valves, hazards and treasure into interesting variants
Add NPCs (with relevant quests)




http://ae.dev/game-world/generateCircularDungeonMap.php?seed=1509565917 - what would this look like on a 50x50 tile grid?


---- */

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

function addNode($type, $x, $y)
{

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
    // might be inefficient to call this every time: ###
    moveNodesApart();

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
    global $nodeList, $jointList, $canvaDimension, $keyColours, $lockedJoints;

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
        echo "<br>joint from " . $thisJoint->nodeA . " (" . strtolower($nodeList[$thisJoint->nodeA]->type) . ") to " . $thisJoint->nodeB . " (" . strtolower($nodeList[$thisJoint->nodeB]->type) . ")";
if($thisJoint->isLocked) {
echo " - is locked";
} 
         
    }

    //header('Content-Type: image/jpeg');
    echo '</div><div class="sequenceBlock">';
    ob_start();
    imagejpeg($outputCanvas, null, 100);
    $rawImageBytes = ob_get_clean();
    echo "<img src='data:image/jpeg;base64," . base64_encode($rawImageBytes) . "'>";
    imagedestroy($outputCanvas);
    echo "</div>";
}

function init()
{
    global $nodeList, $jointList, $canvaDimension, $keyColours, $storedSeed;

    $keyColours = array(
        array(255, 0, 64),
        array(255, 235, 15),
        array(15, 134, 255),
        array(19, 209, 46),
    );
    $canvaDimension = 600;
    $nodeList       = array();
    $jointList      = array();
    if (isset($_GET["seed"])) {
        $storedSeed = intval($_GET["seed"]);
    } else {
        // http://php.net/manual/en/function.mt_srand.php
        list($usec, $sec) = explode(' ', microtime());
        $storedSeed       = floor((float) $sec + ((float) $usec * 100000));
    }
    mt_srand($storedSeed);

}

function growGrammar($thisGrammar, $iterations)
{
    $grammarTransformations = array(
        // simple branching and layout:
        "X" => array("OX", "{OX,O|}", "{OX,O}", "Z"),
        // more intricate 'set piece' arrangements:
        "Z" => array("O[!]O[$]", "O[K#]XO##", "O[K#]O##X"),
        // valves could be lock and keys:
        ">" => array("O[K#]XO##"),
    );
    $currentKey = 0;

    echo '<div class="sequenceBlock"><p>start grammar: ' . htmlentities($thisGrammar) . '<br>';

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
                echo $thisCharacter . " => " . $thisTransform . " &hellip; ";
                $thisGrammar = substr_replace($thisGrammar, $thisTransform, $characterCounter, 1);
                $characterCounter += strlen($thisTransform);
                echo " now " . htmlentities($thisGrammar) . "<br>";
            }
            $characterCounter++;
        } while ($characterCounter < strlen($thisGrammar));
    }
    // remove any remaining non-plottable grammars:
    $thisGrammar = str_replace("X", "O", $thisGrammar);
    $thisGrammar = str_replace("Z", "OO", $thisGrammar);



    echo "final grammar: " . htmlentities($thisGrammar) . "</p>";
    return $thisGrammar;
}

function parseStringGrammar($thisGrammar)
{
    global $nodeList, $jointList, $canvaDimension;
    $characterCounter               = 0;
    $thisDepth                      = 0;
    $thisBranchesParents            = array();
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
            case "{":
                // branch opens
                $thisDepth++;
                $thisBranchesParents[$thisDepth]            = $activeParents;
                $thisBranchesTerminalNodes[$thisDepth]      = array();
                $thisBranchesTerminalJointTypes[$thisDepth] = array();
                $thisBranchesTerminalJointLocks[$thisDepth] = array();
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
                $whichKey       = substr($thisGrammar, $characterCounter + 1, ($closingHashPos - $characterCounter - 1));
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
            for ($i = 0; $i < sqrt($numberOfVertices); $i++) {
                for ($j = 0; $j < sqrt($numberOfVertices); $j++) {

                    $newVertex = new delaunayVertex($i * 50 + $edgeBuffer + mt_rand(-10, 10), $j * 50 + $edgeBuffer + mt_rand(-10, 10));

                    array_push($delaunayVertices, $newVertex);
                }
            }

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

    $minX               = INF;
    $minY               = INF;
    $maxX               = 0;
    $maxY               = 0;
    $distanceFromCentre = INF;
    $centreVertex       = null;
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
        $xDifference            = $thisVertex->x - $canvaDimension / 2;
        $yDifference            = $thisVertex->y - $canvaDimension / 2;
        $thisDistanceFromCentre = sqrt($xDifference * $xDifference + $yDifference * $yDifference);
        if ($thisDistanceFromCentre < $distanceFromCentre) {
            $distanceFromCentre = $thisDistanceFromCentre;
            $centreVertex       = $thisVertex;
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
    for ($i = 0; $i < $numberOfVertices; $i++) {
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

function randomEdgeSorting($a, $b)
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
    global $allDelaunayEdges, $delaunayVertices, $verticesUsedOnDelaunayGraph, $edgesUsedOnDelaunayGraph, $delaunayTriangles, $nodesPlottedOnDelaunayGraph, $lockedJoints;
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
    $searchVertices                                          = array();
    $uncheckedVertices                                       = array();
    $heuristic                                               = sqrt((($endVertex->x - $startVertex->x) * ($endVertex->x - $startVertex->x)) + (($endVertex->y - $startVertex->y) * ($endVertex->y - $startVertex->y)));
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



        while ($thisNextVertex['parentNode'] !== null) {
            array_push($edgesUsedOnDelaunayGraph, $thisNextVertex['edge']);
            if (!in_array($thisNextVertex['vertex'], $verticesUsedOnDelaunayGraph)) {
                array_push($verticesUsedOnDelaunayGraph, $thisNextVertex['vertex']);
            }
// mark the used nodes as well so they can't be used:
            if ($thisNextVertex['vertex']->whichNode === null) {
                $thisNextVertex['vertex']->whichNode       = new node();
                $thisNextVertex['vertex']->whichNode->type = "BLOCKED";
                $firstNewNode                              = $thisNextVertex['vertex']->whichNode;
                array_push($nodesPlottedOnDelaunayGraph, $thisNextVertex['vertex']->whichNode);
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
        echo "<br>Didn't find path<br>";
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
    global $centreVertex, $delaunayVertices, $nodeList, $jointList, $delaunayTriangles, $edgesUsedOnDelaunayGraph, $verticesUsedOnDelaunayGraph, $nodesPlottedOnDelaunayGraph, $connectionsPlottedOnDelaunayGraph, $allDelaunayEdges;

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
            usort($sortedRandomEdges, 'randomEdgeSorting');
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
        echo "FAILED... RESTARTING...<br>";
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
    global $canvaDimension, $delaunayVertices, $delaunayTriangles, $delaunayNodeRadius, $centreVertex, $edgesUsedOnDelaunayGraph, $keyColours, $lockedJoints;

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
    echo '<div class="sequenceBlock">';
    ob_start();
    imagejpeg($outputCanvas, null, 100);
    $rawImageBytes = ob_get_clean();

    echo "<img src='data:image/jpeg;base64," . base64_encode($rawImageBytes) . "'></div>";
    imagedestroy($outputCanvas);
}

function sortVerticesByConnections($a, $b)
{
    if (count($a->neighbours) == count($b->neighbours)) {return 0;}
    return (count($a->neighbours) < count($b->neighbours)) ? 1 : -1;
}

        



function createGridLayout()
    {
    global $delaunayVertices, $verticesUsedOnDelaunayGraph, $edgesUsedOnDelaunayGraph, $allDelaunayEdges;
    $maxNodeDimension = 140;
    $sortedVertices = $verticesUsedOnDelaunayGraph;
    usort($sortedVertices, 'sortVerticesByConnections');

    // increase the nodes to be half way between that and the closest other used node:

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

    // plot on a square grid node vertices at the max radius (making sure they don't touch)
    // draw joints from vertex centres to vertex centres to connect rooms up
    // ########

    }




function removeDiagonalEdges()
{
    
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

function outputSizedNodesLayout()
{

    global $canvaDimension, $delaunayVertices, $delaunayTriangles, $delaunayNodeRadius, $centreVertex, $edgesUsedOnDelaunayGraph, $keyColours, $lockedJoints, $allDelaunayEdges, $verticesUsedOnDelaunayGraph, $requiredWidth, $requiredHeight, $minLeft, $minTop;

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

// php needs width not radius:
        //       $outputWidth = $delaunayVertices[$i]->proximityToNeighbours * 2;

        //  imagefilledellipse($outputCanvas, $delaunayVertices[$i]->x, $delaunayVertices[$i]->y, $outputWidth, $outputWidth, $nodeColour);

        imagefilledrectangle($outputCanvas, $delaunayVertices[$i]->x - $delaunayVertices[$i]->proximityToNeighboursHorizontal, $delaunayVertices[$i]->y - $delaunayVertices[$i]->proximityToNeighboursVertical, $delaunayVertices[$i]->x + $delaunayVertices[$i]->proximityToNeighboursHorizontal, $delaunayVertices[$i]->y + $delaunayVertices[$i]->proximityToNeighboursVertical, $nodeColour);

// border:
        imagerectangle($outputCanvas, $delaunayVertices[$i]->x - $delaunayVertices[$i]->proximityToNeighboursHorizontal, $delaunayVertices[$i]->y - $delaunayVertices[$i]->proximityToNeighboursVertical, $delaunayVertices[$i]->x + $delaunayVertices[$i]->proximityToNeighboursHorizontal, $delaunayVertices[$i]->y + $delaunayVertices[$i]->proximityToNeighboursVertical, imagecolorallocate($outputCanvas, 255, 255, 255));

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

// draw edges:
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






    echo '<div class="sequenceBlock">';
    ob_start();
    imagejpeg($outputCanvas, null, 100);
    $rawImageBytes = ob_get_clean();

    echo "<img src='data:image/jpeg;base64," . base64_encode($rawImageBytes) . "'></div>";
    imagedestroy($outputCanvas);

 
}


function gridTileGrid() {
    global $requiredWidth, $requiredHeight, $mapTilesX, $mapTilesY, $canvaDimension, $delaunayVertices, $minLeft, $minTop, $edgesUsedOnDelaunayGraph, $allDelaunayEdges;
    // define the tile area to be used:
    $mapTilesX = 70;
    $mapTilesY = 70;
    // determine the ratio (-2 to allow 1 tile around each edge)
    $ratio = max($mapTilesX-1, $mapTilesY-1) / max($requiredWidth, $requiredHeight);
    // delaunay graph size * ratio = tile size


// work out any space to centre the map:
    $tileMapWidth = floor($requiredWidth * $ratio);
    $tileMapHeight = floor($requiredHeight * $ratio);
    $tileOffsetX = floor(($mapTilesX - $tileMapWidth)/2);
    $tileOffsetY = floor(($mapTilesY - $tileMapHeight)/2);



    echo '<div class="sequenceBlock">';
  //  echo $ratio."<br>";
  //  echo $requiredWidth." x ".$requiredHeight."<br>";

$map = array();

    for ($i = 0; $i < $mapTilesX; $i++) {
        $map[$i] = array();
            for ($j = 0; $j < $mapTilesY; $j++) {
            array_push($map[$i], "#");
            }
        }




for ($i = 0; $i < count($delaunayVertices); $i++) {
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
for ($j = $leftTileEdge+1; $j < $rightTileEdge; $j++) {
for ($k = $topTileEdge+1; $k < $bottomTileEdge; $k++) {
$map[$k][$j] = ".";
}
}
    }


// plot connections:
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

// make paths 3 wide at least:
if($leftTileEdge == $rightTileEdge) {
    $leftTileEdge--;
    $rightTileEdge++;
}
if($topTileEdge == $bottomTileEdge) {
    $topTileEdge--;
    $bottomTileEdge++;
}




for ($j = $leftTileEdge; $j <= $rightTileEdge; $j++) {
for ($k = $topTileEdge; $k <= $bottomTileEdge; $k++) {
$map[$k][$j] = ".";
}
}

         }
     }

}




// output map:

$drawnTileSize = 8; 
$drawnOffset = 20;
   $outputCanvas = imagecreatetruecolor($canvaDimension, $canvaDimension);
    $groundColour = array(219, 215, 190);
    $ground       = imagecolorallocate($outputCanvas, $groundColour[0], $groundColour[1], $groundColour[2]);
    imagefilledrectangle($outputCanvas, 0, 0, $canvaDimension, $canvaDimension, $ground);


  for ($i = 0; $i < $mapTilesX; $i++) {      
            for ($j = 0; $j < $mapTilesY; $j++) {
        
        switch ($map[$j][$i]) {
    case "#":
       imagefilledrectangle($outputCanvas,($i)*$drawnTileSize+$drawnOffset,($j)*$drawnTileSize+$drawnOffset,($i+1)*$drawnTileSize+$drawnOffset,($j+1)*$drawnTileSize+$drawnOffset,  imagecolorallocate($outputCanvas, 60, 60, 60));
        break;
    case ".":
        // empty
        break;
   
       
}

 imagerectangle($outputCanvas,($i)*$drawnTileSize+$drawnOffset,($j)*$drawnTileSize+$drawnOffset,($i+1)*$drawnTileSize+$drawnOffset,($j+1)*$drawnTileSize+$drawnOffset,  imagecolorallocate($outputCanvas, 128, 128, 128));


            }
          
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

// linear connection with 2 nodes between the start and end:
// $startGrammar = "SOOE";

// simple branch with a node on each branch:
// $startGrammar = "S{O,O}E";

// simple branch to dead end:
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

    $grownGrammar = growGrammar($possibleStartGrammars[mt_rand(0, count($possibleStartGrammars) - 1)], mt_rand(3, 4));

    parseStringGrammar($grownGrammar);
    moveNodesApart();

    outputConnections();
    // random, grid, wonky-grid, offset-grid
    $layoutType = "offset-grid";
    createDelaunayGraph($layoutType);
    if (stripos($layoutType, "grid") !== false) {
        removeDiagonalEdges();
    }
} while (!plotConnectivityOnDelaunayGraph());
outputDelaunayGraph();

createGridLayout();
outputSizedNodesLayout();
gridTileGrid();

?>
<style>

body, p {
font-family:arial,helvetica,sans-serif;font-size:14px;
}

.sequenceBlock {
    float: left;
    width: 22.5%;
    margin: 0 2.5% 2.5% 0;
}

.sequenceBlock:nth-child(4n+1) {
    clear: left;
}

img {
    display: block;
   width: 100%;
}
</style>
<?php

echo '<p style="clear:both;padding-top:20px;"><a href="' . explode("?", $_SERVER["REQUEST_URI"])[0] . '?seed=' . $storedSeed . '">' . $storedSeed . '</a> | <a href="' . explode("?", $_SERVER["REQUEST_URI"])[0] . '">New seed</a></p>';
?>
