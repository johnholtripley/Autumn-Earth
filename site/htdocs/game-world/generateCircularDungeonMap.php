<?php
 

// avoid script time out:
set_time_limit(0);


/*
TO DO

check nodes are within the map boundaries
add locks and keys
check joints don't cross through other nodes too



*/



/*

 
 
 
 
 
$debug = true;



class delayedAddGoal {
  // property declaration:
  public $framesRemaining;
  public $addLock;
  public $anchorNode;
  public $andLockAwayTheKey;
  // method declaration:
  public function delayedAddGoal($param1, $param2) {
    $this->addLock = $param1;
    $this->andLockAwayTheKey = $param2;
  }
}
class keyList {
  public $v;
  public function keyList() {
    $this->v = array();
  }
  public function hasKey($thisKey) {
    $foundKey = in_array($thisKey, $this->v);
    return $foundKey;
  }
  public function sameAs($param1)    {

    return $this == $param1;
  }
  public function sameOrLessThan($param1) {
    $match = true;
    foreach ($this->v as $key => $item) {
      if (!(array_key_exists($key, $param1))) {
        $match = false;
      }
    }
    return $match;
  }
  public function addKey($param1) {
    if (!(in_array($param1, $this->v))) {
      array_push($this->v, $param1);
    }
  }
}
class node {
  public function __construct() {
    global $arbitaryNameCounter, $nodeList;
    $this->radius            = 12;
    $this->type              = "NORMAL";
    $this->j                 = array();
    $this->x                 = 0;
    $this->y                 = 0;
    //$this->isHappy           = true;
    $this->keysNeededToReach = new keyList();
    $this->finalRadius       = (8 + (getRNGNumber() * 10));
    $this->arbitaryName      = chr($arbitaryNameCounter);
    $arbitaryNameCounter++;
    array_push($nodeList, $this);
  }
  public function update() {
    global $nodeList, $scaleFactor;
    if ($this->radius < $this->finalRadius) {
      $this->radius++;
      //$this->type = $this->type;
    }
    foreach ($nodeList as $loc5Node) {
      if ($loc5Node !== $this) {
        $xDifference = $loc5Node->x - $this->x;
        $yDifference = $loc5Node->y - $this->y;
        $distanceBetweenCentres = sqrt($xDifference * $xDifference + $yDifference * $yDifference);
        $spaceBetweenNodes = ($distanceBetweenCentres - ($this->radius + $loc5Node->radius)) * 0.5;
        if ($spaceBetweenNodes <= 0) {
          //if ($spaceBetweenNodes < -1) {
          //  $this->isHappy = false;
          //}
          $xDifference  = $xDifference / $distanceBetweenCentres * $spaceBetweenNodes;
          $yDifference  = $yDifference / $distanceBetweenCentres * $spaceBetweenNodes;
          $this->x     += $xDifference;
          $this->y     += $yDifference;
          $loc5Node->x -= $xDifference;
          $loc5Node->y -= $yDifference;
        }
      }
    }
  }
}
class key {
  public $colour;
  public $nodeWhereFound;
  public function key()
  {
    global $keyColours, $numKeysAdded;
    $this->colour = $keyColours[$numKeysAdded];
  }
}
class joint {
  public $endA = array();
  public $endB = array();
  public $openedByKey;
  function joint($param1Node, $param2Node, $param3Key = null) {
    global $jointList;
    $this->setEndA($param1Node);
    $this->setEndB($param2Node);
    $this->openedByKey = $param3Key;

    array_push($jointList, $this);
    // joint.a.jointLayer.addChild(this);
  }
  private function addJointToList($param1Node) {
    if ($param1Node != null) {
      if (!(in_array($this, $param1Node->j, true))) {
        array_push($param1Node->j, $this);
      }
    }
  }
   
  public function getEndA() {
    return $this->endA;
  }
  public function getEndB() {
    return $this->endB;
  }
   
  public function setEndB($param1Node) {
    if ($param1Node !== $this->endA && $param1Node !== $this->endB) {
      $loc2Node = $this->endB;
      $this->endB = $param1Node;
      $this->removeJointFromList($loc2Node);
      $this->addJointToList($this->endB);
    }
  }
  public function setEndA($param1Node) {
    if ($param1Node != $this->endA && $param1Node != $this->endB) {
      $loc2Node = $this->endA;
      $this->endA = $param1Node;
      $this->removeJointFromList($loc2Node);
      $this->addJointToList($this->endA);
    }
  }
 
  public function giveOtherEnd($param1Node) {
    global $debug;
    if ($param1Node === $this->endA) {
      return $this->endB;
    }
    if ($param1Node === $this->endB) {
      return $this->endA;
    }
    if($debug) {
      echo "FAIL: /joint/giveOtherEnd not supplied with a valid node. ";
      echo "<br>my nodes are:" . $this->endA->arbitaryName . "," . $this->endB->arbitaryName;
      echo "<br>and I was called from: " . $param1Node->arbitaryName."<hr>";
    }
    return null;
  }
  public function update() {
    $loc1Number = $this->endA->x - $this->endB->x;
    $loc2Number = $this->endA->y - $this->endB->y;
    $loc3Number = sqrt($loc1Number * $loc1Number + $loc2Number * $loc2Number);
    $loc4Number = ($loc3Number - ($this->endA->radius + $this->endB->radius)) * 0.5;
    if ($loc4Number >= 0) {
      //if ($loc4Number > 1) {
      //  $this->endA->isHappy = false;
      //  $this->endB->isHappy = false;
      //}
      $loc1Number    = $loc1Number / $loc3Number * $loc4Number;
      $loc2Number    = $loc2Number / $loc3Number * $loc4Number;
      $this->endA->x -= $loc1Number;
      $this->endA->y -= $loc2Number;
      $this->endB->x += $loc1Number;
      $this->endB->y += $loc2Number;
    }
  }
  private function removeJointFromList($param1Node) {
    if ($param1Node != null) {
      $loc2 = array_search($this, $param1Node->j);
      if ($loc2 !== false) {
        array_splice($param1Node->j, $loc2, 1);
      }
    }
  }
}
function worldGraph() {
  global $arbitaryNameCounter, $nodeList, $delayedGoals, $maxJointsPerNode, $numKeysAdded, $keyColours, $jointList, $startNode, $nodesExploredForKeySet, $scaleFactor, $canvaDimension, $framesPassed, $framesSinceFinishedAddingGoals;
  $numberOfGoals          = 3;
  $framesPassed           = 0;
  $framesSinceFinishedAddingGoals = 0;
  $canvaDimension         = 900;
  $delayedGoals           = array();
  $nodeList               = array();
  $jointList              = array();
  $nodesExploredForKeySet = array();
  $numKeysAdded           = 0;
  $scaleFactor            = 50;
  $keyColours             = array(
    array(255,0,64),
    array(255,235,15),
    array(15,134,255),
    array(19,209,46)
  );
  $maxJointsPerNode       = 3;
  $arbitaryNameCounter    = ord("A");
  $startNode              = new node();
  $startNode->type        = "START";
  $startNode->x           = $canvaDimension/2;
  $startNode->y           = $canvaDimension/2;
  $startNode->keysNeededToReach = new keyList();
  $i = 0;
  while ($i < $numberOfGoals) {
    array_push($delayedGoals, new delayedAddGoal(true, false, 30 + 240 * $i));
    $i++;
  }
}
function updateKeyNeedOfNodes() {
  global $startNode, $nodesExploredForKeySet;
  $nodesExploredForKeySet = array();
  setNodeKeyNeed($startNode, new keyList());
}
function setNodeKeyNeed($param1Node, $param2Keylist) {
  global $nodesExploredForKeySet;
  if (!(in_array($param1Node, $nodesExploredForKeySet, true))) {
    array_push($nodesExploredForKeySet, $param1Node);
    $param1Node->keysNeededToReach = $param2Keylist;
    foreach ($param1Node->j as $loc3Joint) {
      if ($loc3Joint->endA === $param1Node) {
        if ($loc3Joint->openedByKey != null && !$param2Keylist->hasKey($loc3Joint->openedByKey)) {
          $loc4Joint = clone $param2Keylist;
          $loc4Joint->addKey($loc3Joint->openedByKey);
          setNodeKeyNeed($loc3Joint->endB, $loc4Joint);
        } else {
          setNodeKeyNeed($loc3Joint->endB, $param2Keylist);
        }
      }
    }
  }
}
function addGoal($param1, $param2, $param3 = false, $param4 = false) {
  global $numKeysAdded, $maxJointsPerNode, $nodeList, $debug;
  $loc8Array = array();
  $loc5Node  = new node();
  $loc6Joint = addBranch($param1, $loc5Node);
  if ($param2) {
    $loc7 = new key();
    $numKeysAdded++;
    $loc6Joint->openedByKey = $loc7;
    updateKeyNeedOfNodes();
    $loc8Array = array();
    foreach ($nodeList as $loc9Node) {
      if ((count($loc9Node->j) < $maxJointsPerNode) && ($loc9Node->keysNeededToReach->sameOrLessThan($param1->keysNeededToReach))) {
        array_push($loc8Array, $loc9Node);
      }
    }
    if (count($loc8Array) > 0) {
      $loc10Node            = addGoal($loc8Array[array_rand($loc8Array,1)], $param3, false);
      $loc10Node->holdsKey  = $loc7;
      $loc10Node->type      = "KEYHOLDER";
      $loc7->nodeWhereFound = $loc10Node;
    } else {
      if($debug) {
        echo ("FAIL: Attempting to add a key, but no anchor node found with a spare joint slot and correct key requirements.");
      }
    }
  }
  return $loc5Node;
}
function addBranch($param1Node, $param2Node) {
  global $scaleFactor;
  $loc3 = getRNGNumber();
  if ($loc3 > 0.2) {
    $param2Node->x = $param1Node->x - (2 + getRNGNumber());
    $param2Node->y = $param1Node->y + (0.5);
  } else {
    $param2Node->x = $param1Node->x + (0.5);
    $param2Node->y = $param1Node->y - (2 + getRNGNumber());
  }
  return new joint($param1Node, $param2Node);
}
function init() {
  global $numberOfGoals;
  $i = 0;
  while ($i < $numberOfGoals) {
    $loc2 = addGoal($nodeList[array_rand($nodeList,1)], true, true);
    $loc2->type = "ENDGOAL";
    $i++;
  }
  updateKeyNeedOfNodes();
}
function insertNodeBeforeJoint($param1) {
  global $scaleFactor;
  $loc2Node     = $param1->endA;
  $loc3Node     = $param1->endB;
  $loc4Node     = new node();
  $loc4Node->x  = $loc3Node->x;
  $loc4Node->y  = $loc3Node->y;
  $loc3Node->x  = $loc3Node->x + (-0.5 + getRNGNumber());
  $loc3Node->y  = $loc3Node->y + (-0.5 + getRNGNumber());
  $param1->endA = $loc4Node;
  $loc5Joint    = new joint($loc2Node, $loc4Node);
  return $loc4Node;
}
function insertNodeAfterJoint($param1) {
  global $scaleFactor;
  $loc2Node     = $param1->endA;
  $loc3Node     = $param1->endB;
  $loc4Node     = new node();
  $loc4Node->x  = $loc3Node->x;
  $loc4Node->y  = $loc3Node->y;
  $loc3Node->x  = $loc3Node->x + (-0.5 + getRNGNumber());
  $loc3Node->y  = $loc3Node->y + (-0.5 + getRNGNumber());
  $param1->endB = $loc4Node;
  $loc5Joint    = new joint($loc4Node, $loc3Node);
  return $loc4Node;
}
function getRNGNumber() {
  $a = 17;
  $c = 3;
  $m = pow(2,12);
  $seed = mt_rand(0, 10000)/10000  * $m;
  $seed = ($a * $seed + $c) % $m;
  return $seed / $m;
  // return mt_rand(0, 10000)/10000;
}
function enterFrame() {
  global $delayedGoals, $nodeList, $maxJointsPerNode, $numKeysAdded, $jointList, $debug, $framesPassed, $framesSinceFinishedAddingGoals;
  $loc13Bool = false;
  if (($framesSinceFinishedAddingGoals < 120) && ($framesPassed % 10 == 0) && (count($jointList) > 0)) {
    $loc6ArrayOfArrays = array();
    foreach ($nodeList as $loc7Node) {
      if (count($loc7Node->j) == 1) {
        array_push($loc6ArrayOfArrays, $loc7Node);
      }
    }
    $loc8Node = $loc6ArrayOfArrays[array_rand($loc6ArrayOfArrays)];
    if (getRNGNumber() > 0.2) {
      insertNodeBeforeJoint($loc8Node->j[0]);
    } else {
      insertNodeAfterJoint($loc8Node->j[0]);
    }
  } else if (($framesSinceFinishedAddingGoals > 120) && ($framesSinceFinishedAddingGoals < 130) && ($framesPassed % 1 == 0) && (count($nodeList) > 0)) {
    updateKeyNeedOfNodes();
    $loc9Node = $nodeList[array_rand($nodeList,1)];
    $loc10KeyList = $loc9Node->keysNeededToReach;
    $loc11Array = array();
    foreach ($nodeList as $loc12Node) {
      if (($loc12Node !== $loc9Node) && ($loc10KeyList->sameAs($loc12Node->keysNeededToReach))) {
        $loc13Bool = false;
        foreach ($loc9Node->j as $loc14Joint) {
          if ($loc14Joint->giveOtherEnd($loc9Node) === $loc12Node) {
            $loc13Bool = true;
            break;
          }
        }
        if (!$loc13Bool) {
          $loc15Num = $loc9Node->x - $loc12Node->x;
          $loc16Num = $loc9Node->y - $loc12Node->y;
          $loc17Num = $loc15Num * $loc15Num + $loc16Num * $loc16Num;
          if ($loc17Num <= ($loc9Node->radius + $loc12Node->radius + 3) * ($loc9Node->radius + $loc12Node->radius + 3)) {
            array_push($loc11Array, $loc12Node);
          }
        }
      }
    }
    if (count($loc11Array) > 0) {
      $loc18Node = $loc11Array[array_rand($loc11Array,1)];
      if($debug) {
      //  echo "adding a joint";
      }
      new joint($loc9Node, $loc18Node);
    }
  }
  foreach ($delayedGoals as $thisDelayedAddGoal) {
    $delayedGoalIndex = array_search($thisDelayedAddGoal, $delayedGoals);
    if ($delayedGoalIndex !== false) {
      array_splice($delayedGoals, $delayedGoalIndex, 1);
    }
    $loc20ArrayOfNodes = array();
    foreach ($nodeList as $loc21Node) {
      if ((count($loc21Node->keysNeededToReach->v) >= ($numKeysAdded - 1)) && (count($loc21Node->j) < $maxJointsPerNode)) {
        array_push($loc20ArrayOfNodes, $loc21Node);
        if($debug) {
          //echo'<code style="display:block;width: 20%;float:left;"><pre>';var_dump($loc21Node);echo'</pre></code>';
        }
      }
    }
    if (count($loc20ArrayOfNodes) > 0) {
      $loc22Node = addGoal($loc20ArrayOfNodes[array_rand($loc20ArrayOfNodes)], $thisDelayedAddGoal->addLock, $thisDelayedAddGoal->andLockAwayTheKey);
      if (count($delayedGoals) == 0) {
        $loc22Node->type = "ENDGOAL";
      } else {
        $loc22Node->type = "SIDEGOAL";
      }
    } else {
      if($debug) {
        echo "FAIL: Adding a (delayed) goal, but no nodes are available with free joint slots";
      }
    }
  }
  // $loc3Number = 1 / this.assumedFPS;
  //foreach ($nodeList as $loc4Node) {
  //  $loc4Node->isHappy = true;
  //}
  foreach ($jointList as $thisJoint) {
    $thisJoint->update();
  }
  foreach ($nodeList as $thisNode) {
    $thisNode->update();
  }
  $framesPassed++;
  if (count($delayedGoals) == 0) {
    $framesSinceFinishedAddingGoals++;
  }
  if($framesSinceFinishedAddingGoals > 130) {
    return false;
  } else {
    return true;
  }
}
 
function makeSeed() {
  // http://php.net/manual/en/function.mt_srand.php
  list($usec, $sec) = explode(' ', microtime());
  return floor((float) $sec + ((float) $usec * 100000));
}
 
if(isset($_GET["seed"])) {
  $storedSeed = $_GET["seed"];
} else {
  $storedSeed = makeSeed();
}



function anyJointHasIntersected() {
  global $jointList;
  foreach ($jointList as $thisJoint) {
    foreach ($jointList as $thisInnerJoint) {
      if($thisJoint !== $thisInnerJoint) {
        if(lineIntersects($thisJoint->endA->x,$thisJoint->endA->y,$thisJoint->endB->x,$thisJoint->endB->y, $thisInnerJoint->endA->x,$thisInnerJoint->endA->y,$thisInnerJoint->endB->x,$thisInnerJoint->endB->y)) {
          return true;
        }
      }
    }
  }
  return false;
}
 
function output() {
  global $debug, $nodeList, $jointList, $canvaDimension;
  if(!$debug) {
    $outputCanvas = imagecreatetruecolor($canvaDimension, $canvaDimension);
    $groundColour = array(219, 215, 190);
    $ground = imagecolorallocate($outputCanvas, $groundColour[0], $groundColour[1], $groundColour[2]);
    imagefilledrectangle($outputCanvas, 0, 0, $canvaDimension, $canvaDimension, $ground);
    // draw nodes:
    foreach ($nodeList as $thisNode) {
      if ($thisNode->type == "KEYHOLDER") {
        if ($thisNode->holdsKey) {
          $thisNodeColour = imagecolorallocate($outputCanvas, $thisNode->holdsKey->colour[0], $thisNode->holdsKey->colour[1], $thisNode->holdsKey->colour[2]);
        }
      } else if ($thisNode->type == "START") {
        $thisNodeColour = imagecolorallocate($outputCanvas, 255, 255, 255);
      } else if ($thisNode->type == "SIDEGOAL") {
        $thisNodeColour = imagecolorallocate($outputCanvas, 90, 90, 90);
      } else if ($thisNode->type == "ENDGOAL") {
        $thisNodeColour = imagecolorallocate($outputCanvas, 0, 0, 0);
      } else {
        $thisNodeColour = imagecolorallocate($outputCanvas, 128, 128, 128);
      }
      imagefilledellipse($outputCanvas, $thisNode->x, $thisNode->y, $thisNode->radius*2, $thisNode->radius*2, $thisNodeColour);
      // imagefilledrectangle($outputCanvas, $thisNode->x-$thisNode->radius, $thisNode->y-$thisNode->radius,$thisNode->x+$thisNode->radius,$thisNode->y+$thisNode->radius, $thisNodeColour);
    }
    // draw joints: 
    imagesetthickness($outputCanvas, 2);   
    foreach ($jointList as $thisJoint) {
      if (isset($thisJoint->openedByKey->colour)) {
        $thisJointColour = imagecolorallocate($outputCanvas, $thisJoint->openedByKey->colour[0], $thisJoint->openedByKey->colour[1], $thisJoint->openedByKey->colour[2]);
      } else {
        $thisJointColour = imagecolorallocate($outputCanvas, 32, 32, 32);
      }
      imageline ($outputCanvas, $thisJoint->endA->x , $thisJoint->endA->y, $thisJoint->endB->x, $thisJoint->endB->y, $thisJointColour);
    }
    header('Content-Type: image/jpeg');
    imagejpeg($outputCanvas, null, 100);
    imagedestroy($outputCanvas);
  }
}
 


do {
  mt_srand($storedSeed);
  worldGraph();
  //init();
  do {
  } while (enterFrame());
} while (anyJointHasIntersected());




output();


*/



class node {
  public function __construct() {
    global $nodeList;
    $this->radius = 12;
    $this->type = "NORMAL";
    $this->x = 0;
    $this->y = 0;
    $this->name = count($nodeList);
    array_push($nodeList, $this);
  }
}

class joint {
  public function __construct() {
    global $jointList;
    array_push($jointList, $this);
  }
}

function addNode($type, $x, $y) {
  global $keysUsed;
$newNode = new node();
  $newNode->type = $type;


  if (getRNGNumber() > 0.5) {
    $x -= (2 + getRNGNumber());
    $y += (0.5);
  } else {
    $x += (0.5);
    $y -= (2 + getRNGNumber());
  }


  $newNode->x = $x;
  $newNode->y = $y;
  $newNode->radius = getRNGNumber() * 15 + 5;
  // might be inefficient to call this every time: ###
  moveNodesApart();
  if($type == "KEYHOLDER") {
    $newNode->whichKey = $keysUsed;
  }
  return $newNode;
}

function addJoint($connectNodeAId, $connectNodeBId, $isLocked = false) {
  global $nodeList, $keysUsed;
  $newJoint = new joint();
  $newJoint->nodeA = $nodeList[$connectNodeAId]->name;
  $newJoint->nodeB = $nodeList[$connectNodeBId]->name;
  $newJoint->isLocked = $isLocked;
  if($newJoint->isLocked) {
    $newJoint->whichKey = $keysUsed;
  }
  return $newJoint;
}

function addNodeAndJointTo($connectNodeId, $type, $x, $y, $isLocked = false) {
  global $nodeList;
$newNode = addNode($type, $x, $y);
addJoint($nodeList[$connectNodeId]->name, $newNode->name, $isLocked);
return $newNode;
}

function addNodeBetween($connectNodeAId, $connectNodeBId, $isFirstjointLocked = false, $isLastjointLocked = false) {
  global $nodeList;
  $newNode = addNodeAndJointTo($connectNodeBId, "NORMAL", ($nodeList[$connectNodeAId]->x + $nodeList[$connectNodeBId]->x)/2, ($nodeList[$connectNodeAId]->y + $nodeList[$connectNodeBId]->y)/2, $isLastjointLocked);
removeJoint($connectNodeAId, $connectNodeBId);
  addJoint($connectNodeAId,count($nodeList)-1,$isFirstjointLocked);
return $newNode;
}

function addCircularLockAndKeyBetween($connectNodeAId, $connectNodeBId) {
  global $nodeList, $keysUsed;
  $keysUsed ++;
  // add new node between:
  $newNode = addNodeBetween($connectNodeAId, $connectNodeBId, false, true);
  // add key node joined to that:
  $keyNode = addNodeAndJointTo($newNode->name, "KEYHOLDER",$newNode->x+0.5,$newNode->y+0.5);
  // add node between first and key node:
  addNodeBetween($connectNodeAId, $keyNode->name);
  }

function removeJoint($connectNodeAId, $connectNodeBId) {
  global $jointList, $debug;
  foreach ($jointList as $jointKey => $jointElement) {

if((($jointElement->nodeA === $connectNodeAId) && ($jointElement->nodeB === $connectNodeBId)) || (($jointElement->nodeB === $connectNodeAId) && ($jointElement->nodeA === $connectNodeBId))) {

unset($jointList[$jointKey]);
break;
}

  }
}

function lineIntersects($a,$b,$c,$d,$p,$q,$r,$s) {
  // https://stackoverflow.com/questions/9043805/test-if-two-lines-intersect-javascript-function#answer-24392281
  // returns true if the line from (a,b)->(c,d) intersects with (p,q)->(r,s)
  $delta = ($c - $a) * ($s - $q) - ($r - $p) * ($d - $b);
  if ($delta == 0) {
    //return false;
  } else {
    $lambda = (($s - $q) * ($r - $a) + ($p - $r) * ($s - $b)) / $delta;
    $gamma = (($b - $d) * ($r - $a) + ($c - $a) * ($s - $b)) / $delta;
    return (0 < $lambda && $lambda < 1) && (0 < $gamma && $gamma < 1);
  }
}

function anyJointHasIntersected() {
  global $jointList, $nodeList;
  foreach ($jointList as $thisJoint) {
    foreach ($jointList as $thisInnerJoint) {
      if($thisJoint !== $thisInnerJoint) {

        if(lineIntersects($nodeList[$thisJoint->nodeA]->x,$nodeList[$thisJoint->nodeA]->y,$nodeList[$thisJoint->nodeB]->x,$nodeList[$thisJoint->nodeB]->y, $nodeList[$thisInnerJoint->nodeA]->x,$nodeList[$thisInnerJoint->nodeA]->y,$nodeList[$thisInnerJoint->nodeB]->x,$nodeList[$thisInnerJoint->nodeB]->y)) {
          return true;
        }
      }
    }
  }
  return false;
}

function getRNGNumber() {
  return mt_rand(0, 10000)/10000;
}



function moveNodesApart() {
  global $nodeList, $debug;
  foreach ($nodeList as $thisOuterNode) {
  foreach ($nodeList as $thisNode) {
      if ($thisNode !== $thisOuterNode) {
     if($debug) {
      //  echo $thisNode->name." !== ".$thisOuterNode->name."<br>";
      }
        $xDifference = $thisNode->x - $thisOuterNode->x;
        $yDifference = $thisNode->y - $thisOuterNode->y;
        $distanceBetweenCentres = sqrt($xDifference * $xDifference + $yDifference * $yDifference);
        $spaceBetweenNodes = ($distanceBetweenCentres - ($thisOuterNode->radius + $thisNode->radius)) * 0.5;
        if ($spaceBetweenNodes <= 0) {
          // avoid division by zero:
          if($distanceBetweenCentres == 0) {
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

function output() {
  global $debug, $nodeList, $jointList, $canvaDimension, $keyColours;




  if(!$debug) {
    $outputCanvas = imagecreatetruecolor($canvaDimension, $canvaDimension);
    $groundColour = array(219, 215, 190);
    $ground = imagecolorallocate($outputCanvas, $groundColour[0], $groundColour[1], $groundColour[2]);
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
      imagefilledellipse($outputCanvas, $thisNode->x, $thisNode->y, $thisNode->radius*2, $thisNode->radius*2, $thisNodeColour);
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
      imageline ($outputCanvas, $nodeList[$thisJoint->nodeA]->x , $nodeList[$thisJoint->nodeA]->y, $nodeList[$thisJoint->nodeB]->x, $nodeList[$thisJoint->nodeB]->y, $thisJointColour);
    }
    header('Content-Type: image/jpeg');
    imagejpeg($outputCanvas, null, 100);
    imagedestroy($outputCanvas);
  }
}

function fillUpWithMoreNodes() {
  global $nodeList;
  for ($i =0; $i<8; $i++) {
    addNodeBetween(0,count($nodeList)-1);
  }
}

function init() {
global $nodeList, $jointList, $debug, $canvaDimension, $keyColours, $keysUsed;
$debug = false;
  $keyColours = array(
    array(255,0,64),
    array(255,235,15),
    array(15,134,255),
    array(19,209,46)
  );
  $keysUsed = 0;
  $canvaDimension = 600;
  $nodeList = array();
  $jointList = array();
if(isset($_GET["seed"])) {
  $storedSeed = $_GET["seed"];
} else {
 // http://php.net/manual/en/function.mt_srand.php
   list($usec, $sec) = explode(' ', microtime());
  $storedSeed = floor((float) $sec + ((float) $usec * 100000));
}
mt_srand($storedSeed);



/*
addNode("START",$canvaDimension/2,$canvaDimension/2+10);
addNodeAndJointTo(0, "ENDGOAL", $canvaDimension/2,$canvaDimension/2);
//addNodeAndJointTo(0, "NORMAL", $canvaDimension/2,$canvaDimension/2-10);
//addJoint(1,2);
//addNodeBetween(1,2);
//addNodeBetween(1,0);
addCircularLockAndKeyBetween(0,1);
addCircularLockAndKeyBetween(0,4);
*/

// http://garethrees.org/2004/12/01/ocarina-of-time/
// 0:
addNode("START",$canvaDimension/2,$canvaDimension/2);
// 1:
addNodeAndJointTo(0, "ENDGOAL", $canvaDimension/2,$canvaDimension/2);
// 2:
addNodeBetween(0,1);
// 3:
addNodeBetween(0,1);
addJoint(2,3);
// 4:
addNodeBetween(0,3);
// 5:
addNodeBetween(2,1);

 fillUpWithMoreNodes();

}

do {
init();
moveNodesApart();
} while (anyJointHasIntersected());
output();
?>