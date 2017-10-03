<?php


/* ----

TO DO:
Create meta levels so can have foreshadowing and hints about future encounters
Map nodes to tiles
Convert locks, valves, hazards and treasue into interesting variants
Add NPCs (with relevant quests)

---- */








// -----------------------------------------
// NOT MINE
http: //codetalk.code-kobold.de/drawing-arrows-with-the-gd-library-in-php/
class GDArrow
{

    /**
     * The referenced canvas
     */
    public $image;

    /**
     * Arrow color
     */
    public $color;

    /**
     * X-Coordinate of arrow's starting point
     */
    public $x1;

    /**
     * Y-Coordinate of arrow's starting point
     */
    public $y1;

    /**
     * X-Coordinate of arrow's endpoint
     */
    public $x2;

    /**
     * Y-Coordinate of arrow's starting point
     */
    public $y2;

    /**
     * Arm angle of the arrowhead
     */
    public $angle;

    /**
     * Length of the arrowhead
     */
    public $radius;

    /**
     * The constructor
     */
    public function __construct()
    {}

    /**
     * Draws the arrow according the given parameters
     */
    public function drawGDArrow()
    {

        $l_m      = null;
        $l_x1     = null;
        $l_y1     = null;
        $l_x2     = null;
        $l_y2     = null;
        $l_angle1 = null;
        $l_angle2 = null;
        $l_cos1   = null;
        $l_sin1   = null;

        // Draws the arrow's line
        Imageline($this->image, $this->x1, $this->y1, $this->x2, $this->y2, $this->color);

        // Gradient infinite?
        if ($this->x2 == $this->x1) {

            $l_m = false;

            if ($this->y1 < $this->y2) {

                $l_x1 = $this->x2 - $this->radius * sin(deg2rad($this->angle));
                $l_y1 = $this->y2 - $this->radius * cos(deg2rad($this->angle));
                $l_x2 = $this->x2 + $this->radius * sin(deg2rad($this->angle));
                $l_y2 = $this->y2 - $this->radius * cos(deg2rad($this->angle));

            } else {

                $l_x1 = $this->x2 - $this->radius * sin(deg2rad($this->angle));
                $l_y1 = $this->y2 + $this->radius * cos(deg2rad($this->angle));
                $l_x2 = $this->x2 + $this->radius * sin(deg2rad($this->angle));
                $l_y2 = $this->y2 + $this->radius * cos(deg2rad($this->angle));

            } // endelse

        } // endif $this -> x2 == $this -> x1

        // Gradient = 0
        elseif ($this->y2 == $this->y1) {

            $l_m = 0;

            if ($this->x1 < $this->x2) {

                $l_x1 = $this->x2 - $this->radius * cos(deg2rad($this->angle));
                $l_y1 = $this->y2 - $this->radius * sin(deg2rad($this->angle));
                $l_x2 = $this->x2 - $this->radius * cos(deg2rad($this->angle));
                $l_y2 = $this->y2 + $this->radius * sin(deg2rad($this->angle));

            } else {

                $l_x1 = $this->x2 + $this->radius * cos(deg2rad($this->angle));
                $l_y1 = $this->y2 + $this->radius * sin(deg2rad($this->angle));
                $l_x2 = $this->x2 + $this->radius * cos(deg2rad($this->angle));
                $l_y2 = $this->y2 - $this->radius * sin(deg2rad($this->angle));

            }

        } // endif $this -> y2 == $this -> y1

        // Gradient positive?
        elseif ($this->x2 > $this->x1) {

            // Calculate gradient
            $l_m = (($this->y2 - $this->y1) / ($this->x2 - $this->x1));

            // Convert gradient (= Arc tangent(m)) from radian to degree
            $l_alpha = rad2deg(atan($l_m));

            // Right arm angle = gradient + 180 + arm angle
            $l_angle1 = $l_alpha + $this->angle + 180;
            // Left arm angle = gradient + 180 - arm angle
            $l_angle2 = $l_alpha - $this->angle + 180;

            // Right arm angle of arrowhead
            // Abscissa = cos(gradient + 180 + arm angle) * radius
            $l_cos1 = $this->radius * cos(deg2rad($l_angle1));
            $l_x1   = $this->x2 + $l_cos1;

            // Ordinate = sin(gradient + 180 + arm angle) * radius
            $l_sin1 = $this->radius * sin(deg2rad($l_angle1));
            $l_y1   = $this->y2 + $l_sin1;

            // Left arm angle of arrowhead
            $RCos2 = $this->radius * cos(deg2rad($l_angle2));
            $RSin2 = $this->radius * sin(deg2rad($l_angle2));

            $l_x2 = $this->x2 + $RCos2;
            $l_y2 = $this->y2 + $RSin2;

        } // endif $this -> x2 > $this -> x1

        // Gradient negative?
        elseif ($this->x2 < $this->x1) {

            $this->angle = 90 - $this->angle;

            // Calculate gradient
            $l_m = (($this->y2 - $this->y1) / ($this->x2 - $this->x1));

            // Convert gradient (= Arc tangent(m)) from radian to degree
            $l_alpha = rad2deg(atan($l_m));

            // Right arm angle = gradient + 180 + arm angle
            $l_angle1 = $l_alpha + $this->angle + 180;
            // Left arm angle = gradient + 180 - arm angle
            $l_angle2 = $l_alpha - $this->angle + 180;

            // Right arm angle of arrowhead
            // Abscissa = cos(gradient + 180 + arm angle) * radius
            $l_cos1 = $this->radius * cos(deg2rad($l_angle1));

            // Ordinate = sin(gradient + 180 + arm angle) * radius
            $l_sin1 = $this->radius * sin(deg2rad($l_angle1));

            // Left arm angle of arrowhead
            $RCos2 = $this->radius * cos(deg2rad($l_angle2));
            $RSin2 = $this->radius * sin(deg2rad($l_angle2));

            $l_x1 = $this->x2 - $l_sin1;
            $l_y1 = $this->y2 + $l_cos1;

            $l_x2 = $this->x2 + $RSin2;
            $l_y2 = $this->y2 - $RCos2;

        } // endif $this -> x2 < $this -> x1

        Imageline($this->image, $l_x1, $l_y1, $this->x2, $this->y2, $this->color);
        Imageline($this->image, $l_x2, $l_y2, $this->x2, $this->y2, $this->color);

    } // drawGDArrow()

} // class GDArrow

// -----------------------------------------

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

    $newNode       = new node();
    $newNode->type = $type;

    if (getRNGNumber() > 0.5) {
        $x -= (2 + getRNGNumber());
        $y += (0.5);
    } else {
        $x += (0.5);
        $y -= (2 + getRNGNumber());
    }

    $newNode->x        = $x;
    $newNode->y        = $y;
    $newNode->hazards  = 0;
    $newNode->treasure = 0;
    $newNode->radius   = getRNGNumber() * 10 + 15;
    // might be inefficient to call this every time: ###
    moveNodesApart();

    return $newNode;
}

function addJoint($connectNodeAId, $connectNodeBId, $jointType = "", $whichKey = "")
{
    global $nodeList;
    $newJoint        = new joint();
    $newJoint->nodeA = $nodeList[$connectNodeAId]->name;
    $newJoint->nodeB = $nodeList[$connectNodeBId]->name;
    $newJoint->type  = $jointType;

    $newJoint->whichKey = $whichKey;
    if ($newJoint->whichKey != "") {
        $newJoint->isLocked = true;
    } else {
        $newJoint->isLocked = false;
    }

    return $newJoint;
}

/*
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
global $jointList;
foreach ($jointList as $jointKey => $jointElement) {

if ((($jointElement->nodeA === $connectNodeAId) && ($jointElement->nodeB === $connectNodeBId)) || (($jointElement->nodeB === $connectNodeAId) && ($jointElement->nodeA === $connectNodeBId))) {

unset($jointList[$jointKey]);
break;
}

}
}
 */

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

function output()
{
    global $nodeList, $jointList, $canvaDimension, $keyColours;

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
        } else if ($thisNode->type == "ENDGOAL") {
            $thisNodeColour = imagecolorallocate($outputCanvas, 0, 0, 0);
        } else {
            $thisNodeColour = imagecolorallocate($outputCanvas, 128, 128, 128);
        }
        imagefilledellipse($outputCanvas, $thisNode->x, $thisNode->y, $thisNode->radius * 2, $thisNode->radius * 2, $thisNodeColour);
        // imagefilledrectangle($outputCanvas, $thisNode->x-$thisNode->radius, $thisNode->y-$thisNode->radius,$thisNode->x+$thisNode->radius,$thisNode->y+$thisNode->radius, $thisNodeColour);

// check for contents:

           echo "Node #" . $thisNode->name . " has " . $thisNode->hazards . " hazards and £" . $thisNode->treasure . "<br>";

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

        if ($thisJoint->type == "") {
            imageline($outputCanvas, $nodeList[$thisJoint->nodeA]->x, $nodeList[$thisJoint->nodeA]->y, $nodeList[$thisJoint->nodeB]->x, $nodeList[$thisJoint->nodeB]->y, $thisJointColour);
        } else if ($thisJoint->type == "?") {

            //imagedashedline($outputCanvas, $nodeList[$thisJoint->nodeA]->x, $nodeList[$thisJoint->nodeA]->y, $nodeList[$thisJoint->nodeB]->x, $nodeList[$thisJoint->nodeB]->y, $thisJointColour);
            $thisJointColour = imagecolorallocate($outputCanvas, 255, 255, 255);
            imageline($outputCanvas, $nodeList[$thisJoint->nodeA]->x, $nodeList[$thisJoint->nodeA]->y, $nodeList[$thisJoint->nodeB]->x, $nodeList[$thisJoint->nodeB]->y, $thisJointColour);
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
        echo "<br>joint from " . $thisJoint->nodeA . " (" . $nodeList[$thisJoint->nodeA]->type . ") to " . $thisJoint->nodeB . " (" . $nodeList[$thisJoint->nodeB]->type . ") - type " . $thisJoint->type . " locked: ".$thisJoint->isLocked;
    }

    //header('Content-Type: image/jpeg');
    ob_start();
    imagejpeg($outputCanvas, null, 100);
    $rawImageBytes = ob_get_clean();
    echo "<br><img src='data:image/jpeg;base64," . base64_encode($rawImageBytes) . "' />";
    imagedestroy($outputCanvas);

}

/*
function fillUpWithMoreNodes($howMany)
{
    global $nodeList;
    for ($i = 0; $i < $howMany; $i++) {
        addNodeBetween(0, count($nodeList) - 1);
    }
}
*/

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
        "X" => array("O", "OX", "{OX,O|}", "{OX,O}", "O[!]O[$]", "O[K#]XO##", "O[K#]O##X"),
    );
    $currentKey = 0;

    echo "<p>start grammar: " . $thisGrammar . "<br>";

    for ($i = 0; $i < $iterations; $i++) {
        $characterCounter = 0;
        do {
            $thisCharacter = substr($thisGrammar, $characterCounter, 1);

            if (array_key_exists($thisCharacter, $grammarTransformations)) {
                $thisTransform = $grammarTransformations[$thisCharacter][mt_rand(0, count($grammarTransformations[$thisCharacter]) - 1)];
                // check for locks and keys:
                if (strpos($thisTransform, 'K#') !== false) {
                $thisTransform = str_replace("K#", "K#".$currentKey, $thisTransform);
                $thisTransform = str_replace("##", "#".$currentKey."#", $thisTransform);

                $currentKey ++;
                }
                echo $thisCharacter . " => " . $thisTransform . " &hellip; ";
                $thisGrammar = substr_replace($thisGrammar, $thisTransform, $characterCounter, 1);
                $characterCounter += strlen($thisTransform);
                echo " now " . $thisGrammar . "<br>";
            }
            $characterCounter++;
        } while ($characterCounter < strlen($thisGrammar));
    }
    // remove any remaining 'X's:
    $thisGrammar = str_replace("X", "", $thisGrammar);
    echo "final grammar: " . $thisGrammar . "</p>";
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
                $newNode = addNode("ENDGOAL", $activeParents[0]->x + mt_rand(-10, 10), $activeParents[0]->y + mt_rand(-10, 10));

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

// triangular branch:
// $startGrammar = "S{,O}E";

init();

$possibleStartGrammars = array("SXE");

$grownGrammar = growGrammar($possibleStartGrammars[mt_rand(0, count($possibleStartGrammars) - 1)], mt_rand(2, 3));


// secret to treasure (with one way exit):
$grownGrammar = "S{?O[£]>,OOO}E";

// circular lock and key:






//do {
parseStringGrammar($grownGrammar);
moveNodesApart();
//} while (anyJointHasIntersected());

output();
?>
<style>
body, p {
font-family:arial,helvetica,sans-serif;font-size:14px;
}
</style>
<?php
echo '<p>' . htmlentities($grownGrammar) . '</p>';
echo '<p><a href="'.explode("?",$_SERVER['REQUEST_URI'])[0].'?seed=' . $storedSeed . '">' . $storedSeed . '</a></p>';
?>
