<?php
// https://www.sitepoint.com/data-structures-4/
/*

function array_remove_by_value($array, $value) {
return array_values(array_diff($array, array($value)));
}


function insertNodeBetween($newNode, $firstNode, $secondNode) {
global $mapNodes;
foreach ($mapNodes as $key => $value) {
if($key == $firstNode) {
// remove the other node:
$mapNodes[$key] = array_remove_by_value($value, $secondNode);
// add the new node:
array_push($mapNodes[$key], $newNode);
} else if($key == $secondNode) {
// remove the other node:
$mapNodes[$key] = array_remove_by_value($value, $firstNode);
// add the new node:
array_push($mapNodes[$key], $newNode);
}
}
// add the new node as a key:
$mapNodes[$newNode] = array($firstNode, $secondNode);
}

function outputGraph() {
global $mapNodes;
foreach ($mapNodes as $key => $value) {
echo $key." connected to ";
for ($i=0;$i<count($value);$i++) {
echo $value[$i].",";
}
echo "<br>";
}
echo "<hr>";
}


echo '<h4>simple</h4>';
// start with a simple graph with A connected to B:
$mapNodes = array(
'a' => array('b'),
'b' => array('a')
);
outputGraph();
insertNodeBetween('c','a','b');
outputGraph();
insertNodeBetween('d','a','c');
outputGraph();


echo '<h4>circular</h4>';
// start with a 'circular' graph
$mapNodes = array(
'a' => array('b','c'),
'b' => array('a','c'),
'c' => array('a','b')
);
outputGraph();
insertNodeBetween('d','a','b');
outputGraph();


// https://github.com/ebobby/Jsqueens
// https://github.com/Hrant-Khachatrian/NiceGraph-js
// http://stackoverflow.com/questions/13318489/algorithm-to-draw-connections-between-nodes-without-overlapping-nodes

*/
class delayedAddGoal {
  // property declaration:
  public $framesRemaining;
  public $addLock;
  public $anchorNode;
  public $andLockAwayTheKey;
  // method declaration:
  public function delayedAddGoal($param1, $param2) {
    $this->addLock           = $param1;
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
  public function sameAs($param1) {
    return ($this->v == $param1);
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
    $this->radius            = 1;
    $this->type              = "NORMAL";
    $this->j                 = array();
    $this->x                 = 0;
    $this->y                 = 0;
    $this->keysNeededToReach = new keyList();
    $this->finalRadius       = mt_rand(8, 18);
    $this->arbitaryName      = chr($arbitaryNameCounter);
    $arbitaryNameCounter++;
    array_push($nodeList, $this);
  }
  public function update() {
    global $nodeList;
    $loc2Number = 50;
    foreach ($nodeList as $loc5Node) {
      if ($loc5Node != $this) {
        $loc3Number = $loc5Node->x - $this->x;
        $loc4Number = $loc5Node->y - $this->y;
        $loc6Number = sqrt($loc3Number * $loc3Number + $loc4Number * $loc4Number);
        $loc7Number = ($loc6Number - ($this->radius + $loc5Node->radius)) * 0.5;
        if ($loc7Number < 0) {
          if ($loc7Number < -1) {
            //this.isHappy = false;
          }
          $loc3Number  = $loc3Number / $loc6Number;
          $loc4Number  = $loc4Number / $loc6Number;
          $loc3Number  = $loc3Number * $loc7Number;
          $loc4Number  = $loc4Number * $loc7Number;
          $this->x     = $this->x + $loc3Number;
          $this->y     = $this->y + $loc4Number;
          $loc5Node->x = $loc5Node->x - $loc3Number;
          $loc5Node->y = $loc5Node->y - $loc4Number;
        }
      }
    }
    if ($this->radius < $this->finalRadius) {
      $this->radius++;
      $this->type = $this->type;
    }
  }
  public function setType($param1String) {
    $this->type = $param1String;
    if ($this->type == "KEYHOLDER") {
      //  $this->icon.graphics.clear();
      if ($this->holdsKey) {
        //   $this->icon.graphics.beginFill($this->holdsKey.colour);
      } else {
        //   $this->icon.graphics.beginFill(4210752);
      }
      // $this->icon.graphics.drawCircle(0,0,$this->radius);
      // $this->icon.graphics.endFill();
    } else if ($this->_type == "START") {
      // $this->icon.graphics.clear();
      //  $this->icon.graphics.beginFill(16711744);
      //  $this->icon.graphics.drawCircle(0,0,$this->radius);
      //  $this->icon.graphics.endFill();
    } else {
      //  $this->icon.graphics.clear();
      //  $this->icon.graphics.beginFill(16777215);
      //  $this->icon.graphics.drawCircle(0,0,$this->radius);
      //  $this->icon.graphics.endFill();
    }
  }
  public function getType() {
    return $this->type;
  }
  /*  
  this.icon = new Shape();
  addChild(this.icon);
  node.a.graphLayer.addChild(this);
  */
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
  private $endA;
  private $endB;
  public $openedByKey;
  function joint($param1Node, $param2Node, $param3Key = null) {
    global $jointList;
    $this->endA        = $param1Node;
    $this->endB        = $param2Node;
    $this->openedByKey = $param3Key;
    /*
    this.lineImage = new Shape();
    addChild(this.lineImage);
    */
    array_push($jointList, $this);
    // joint.a.jointLayer.addChild(this);
  }
  private function addJointToList($param1Node) {
    if ($param1Node != null) {
      if (!(in_array($this, $param1Node->j))) {
        array_push($param1Node->j, $this);
      }
    }
  }
  public function getEndA() {
    return $this->endA;
  }
  public function setEndB($param1Node) {
    $loc2Node = null;
    if ($param1Node != $this->endA && $param1Node != $this->endB) {
      $loc2       = $this->endB;
      $this->endB = $param1Node;
      $this->removeJointFromList($loc2);
      $this->addJointToList($this->endB);
    }
  }
  public function getEndB() {
    return $this->endB;
  }
  public function dumpInformation() {
    /*
    if(this.endA && this.endB)
    {
    return String(this.endA.arbitaryName + " to " + this.endB.arbitaryName);
    }
    if(this.endA)
    {
    return String(this.endA.arbitaryName + " to something");
    }
    if(this.endB)
    {
    return String("Something to " + this.endB.arbitaryName);
    }
    return String("Joint with no known ends");
    */
  }
  public function setEndA($param1Node) {
    $loc2Node = null;
    if ($param1Node != $this->endA && $param1Node != $this->endB) {
      $loc2       = $this->endA;
      $this->endA = $param1Node;
      $this->removeJointFromList($loc2);
      $this->addJointToList($this->endA);
    }
  }
  public function giveOtherEnd($param1Node) {
    if ($param1Node == $this->endA) {
      return $this->endB;
    }
    if ($param1Node == $this->endB) {
      return $this->endA;
    }
    echo "FAIL: worldGraph.as/joint/giveOtherEnd not supplied with a valid node. ";
    echo "<br>my nodes are:" . $this->endA . "," . $this->endB;
    echo "<br>and I was called from: " . $param1Node;
    return null;
  }
  public function update() {
    // $this->lineImage.graphics.clear();
    if ($this->openedByKey) {
      // this.lineImage.graphics.lineStyle(3,this.openedByKey.colour);
    } else {
      // this.lineImage.graphics.lineStyle(3,11579568);
    }
    //this.lineImage.graphics.moveTo(this.endA.x,this.endA.y);
    //this.lineImage.graphics.lineTo(this.endB.x,this.endB.y);
    //this.dBug.x = (this.endA.x + this.endB.x) / 2;
    //this.dBug.y = (this.endA.y + this.endB.y) / 2 + 20;
    $loc1Number = $this->endA->x - $this->endB->x;
    $loc2Number = $this->endA->y - $this->endB->y;
    $loc3Number = sqrt($loc1Number * $loc1Number + $loc2Number * $loc2Number);
    $loc4Number = ($loc3Number - ($this->endA->radius + $this->endB->radius)) * 0.5;
    if ($loc4Number > 0) {
      if ($loc4Number > 1) {
        //this.endA.isHappy = false;
        //this.endB.isHappy = false;
      }
      $loc1Number    = $loc1Number / $loc3Number;
      $loc2Number    = $loc2Number / $loc3Number;
      $loc1Number    = $loc1Number * $loc4Number;
      $loc2Number    = $loc2Number * $loc4Number;
      $this->endA->x = $this->endA->x - $loc1Number;
      $this->endA->y = $this->endA->y - $loc2Number;
      $this->endB->x = $this->endB->x + $loc1Number;
      $this->endB->y = $this->endB->y + $loc2Number;
    }
  }
  private function removeJointFromList($param1Node) {
    if ($param1Node != null) {
      $loc2 = array_search($this, $param1Node->j);
      if ($loc2 !== FALSE) {
        array_splice($param1Node->j, $loc2, 1);
      }
    }
  }
}
function worldGraph() {
  global $arbitaryNameCounter, $nodeList, $delayedGoals, $maxJointsPerNode, $numKeysAdded, $keyColours, $jointList, $startNode, $nodesExploredForKeySet;
  $numberOfGoals          = 3;
  $delayedGoals           = array();
  $nodeList               = array();
  $jointList              = array();
  $nodesExploredForKeySet = array();
  $numKeysAdded           = 0;
  $keyColours             = array(
    "ff0040",
    "ffeb0f",
    "0f86ff",
    "13d12e",
    "ffffff"
  );
  $maxJointsPerNode       = 3;
  $arbitaryNameCounter    = ord("A");
  $startNode              = new node();
  $startNode->type        = "START";
  $startNode->x           = 300;
  $startNode->y           = 300;
  //  $startNode->keysNeededToReach = new keyList();
  $i                      = 0;
  while ($i < $numberOfGoals) {
    array_push($delayedGoals, new delayedAddGoal(true, false));
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
  $loc3Joint = null;
  $loc4Joint = null;
  if (!(in_array($param1Node, $nodesExploredForKeySet))) {
    array_push($nodesExploredForKeySet, $param1Node);
    $param1Node->keysNeededToReach = $param2Keylist;
    foreach ($param1Node->j as $loc3Joint) {
      if ($loc3Joint->endA == $param1Node) {
        if ($loc3Joint->openedByKey != null && !$param2Keylist->hasKey($loc3Joint->openedByKey)) {
          // clone array:
          $loc4Joint = $param2Keylist;
          $loc4Joint . addKey($loc3Joint->openedByKey);
          setNodeKeyNeed($loc3Joint->endB, $loc4Joint);
        } else {
          setNodeKeyNeed($loc3Joint->endB, $param2Keylist);
        }
      }
    }
  }
}
function addGoal($param1, $param2, $param3 = false, $param4 = false) {
  global $numKeysAdded, $maxJointsPerNode, $nodeList;
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
      if (count($loc9Node->j) < $maxJointsPerNode && $loc9Node->keysNeededToReach->sameOrLessThan($param1->keysNeededToReach)) {
        array_push($loc8Array, $loc9Node);
      }
    }
    if (count($loc8Array) > 0) {
      $loc10Node            = addGoal(end($loc8Array), $param3, false);
      $loc10Node->holdsKey  = $loc7;
      $loc10Node->type      = "KEYHOLDER";
      $loc7->nodeWhereFound = $loc10Node;
    } else {
      echo ("FAIL: Attempting to add a key, but no anchor node found with a spare joint slot and correct key requirements.");
    }
  }
  return $loc5Node;
}
function addBranch($param1Node, $param2Node) {
  $loc3 = getRNGNumber();
  if ($loc3 > 0.5) {
    $param2Node->x = $param1Node->x - 2 + getRNGNumber();
    $param2Node->y = $param1Node->y + 0.5;
  } else {
    $param2Node->x = $param1Node->x + 0.5;
    $param2Node->y = $param1Node->y - 2 + getRNGNumber();
  }
  return new joint($param1Node, $param2Node);
}
function init() {
  global $numberOfGoals;
  $i = 0;
  while ($i < $numberOfGoals) {
    $loc2       = addGoal(end($nodeList), true, true);
    $loc2->type = "ENDGOAL";
    $i++;
  }
  updateKeyNeedOfNodes();
}
function insertNodeBeforeJoint($param1) {
  $loc2Node     = null;
  $loc3Node     = null;
  $loc4Node     = null;
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
  $loc2Node     = null;
  $loc3Node     = null;
  $loc4Node     = null;
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
  return mt_rand(-1, 1);
}
function enterFrame() {
  global $delayedGoals, $nodeList, $maxJointsPerNode, $numKeysAdded, $jointList;
  /*
  $loc3Number = -1;
  $loc4Node = null;
  $loc5Joint = null;
  $loc6ArrayOfArrays = null;
  $loc7Node = null;
  $loc8Node = null;
  $loc9Node = null;
  $loc10KeyList = null;
  $loc11Array = null;
  $loc12Node = null;
  */
  $loc13Bool = false;
  /*
  $loc14Joint = null;
  $loc15Num = -1;
  $loc16Num = -1;
  $loc17Num = -1;
  $loc18Node = null;
  $loc21Node = null;
  $loc22Node = null;
  */
  if (count($jointList) > 0) {
    $loc6ArrayOfArrays = array();
    foreach ($nodeList as $loc7Node) {
      if (count($loc7Node->j) == 1) {
        $loc6ArrayOfArrays . push($loc7Node);
      }
    }
    $loc8Node = $loc6ArrayOfArrays[count($loc6ArrayOfArrays)];
    if (mt_rand(0, 10) > 2) {
      insertNodeBeforeJoint($loc8Node->j[0]);
    } else {
      insertNodeAfterJoint($loc8Node->j[0]);
    }
  } else if (count($nodeList) > 0) {
    updateKeyNeedOfNodes();
    //array_push($nodeList, "");
    $loc9Node     = end($nodeList);
    $loc10KeyList = $loc9Node->keysNeededToReach;
    $loc11Array   = array();
    foreach ($nodeList as $loc12Node) {
      if ($loc12Node != $loc9Node && $loc10KeyList->sameAs($loc12Node->keysNeededToReach)) {
        $loc13Bool = false;
        foreach ($loc9Node . j as $loc14Joint) {
          if ($loc14Joint->giveOtherEnd($loc9Node) == $loc12Node) {
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
      $loc18Node = $loc11Array[count($loc11Array)];
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

      //echo count($loc21Node->keysNeededToReach->v) . ">=" . $numKeysAdded . " && " . count($loc21Node->j) . " < " . $maxJointsPerNode."<br>";

      if (count($loc21Node->keysNeededToReach->v) >= $numKeysAdded - 1 && count($loc21Node->j) < $maxJointsPerNode) {
        array_push($loc20ArrayOfNodes, $loc21Node);
        echo'<code style="display:block;width: 20%;float:left;"><pre>';var_dump($loc20ArrayOfNodes);echo'</pre></code>';
      }
    }
    if (count($loc20ArrayOfNodes) > 0) {
      $loc22Node = addGoal(end($loc20ArrayOfNodes), $thisDelayedAddGoal->addLock, $thisDelayedAddGoal->andLockAwayTheKey);
      if (count($delayedGoals) == 0) {
        $loc22Node->type = "ENDGOAL";
      } else {
        $loc22Node->type = "SIDEGOAL";
      }
    } else {
      echo "FAIL: Adding a (delayed) goal, but no nodes are available with free joint slots";
    }
  }
  // $loc3Number = 1 / this.assumedFPS;
  foreach ($nodeList as $loc4Node) {
    $loc4Node->isHappy = true;
  }
  foreach ($jointList as $loc5Joint) {
    $loc5Joint->update();
  }
  foreach ($nodeList as $loc4Node) {
    $loc4Node->update();
  }
  /*
  this.framesPassed++;
  if(this.delayedGoals.length == 0) {
  this.framesSinceFinishedAddingGoals++;
  }
  */
}



worldGraph();
//init();
enterFrame();
?>