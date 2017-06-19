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
    public function delayedAddGoal($param1, $param2)    {
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

    public function sameAs($param1) {
        return ($this->v == $param1);
    }

    public function sameOrLessThan($param1) {
        $match = true;
        foreach($this->v as $key => $item){
            if (!(array_key_exists($key,$param1))) {
                $match = false;
            }
        }
        return $match;
    }

    public function addKey($param1) {
        if (!(in_array($param1, $this->v))) {
            array_push($this->v,$param1);
        }
    }
}

class node { 
    public function __construct() {
        global $arbitaryNameCounter, $nodeList;
        $this->radius = 1;
        $this->type = "NORMAL";
        $this->j = '';
        $this->keysNeededToReach = '';
        $this->finalRadius = mt_rand(8,18);
        $this->arbitaryName = chr($arbitaryNameCounter);
        $arbitaryNameCounter++;
        array_push($nodeList, $this);
    }

    /*  
    this.icon = new Shape();
    addChild(this.icon);
    node.a.graphLayer.addChild(this);
    */
}


function worldGraph() {
    global $arbitaryNameCounter, $nodeList, $delayedGoals, $maxJointsPerNode, $numKeysAdded, $jointList, $startNode, $nodesExploredForKeySet;
    $numberOfGoals = 3;
    $delayedGoals = array();
    $nodeList = array();
    $jointList = array();
    $nodesExploredForKeySet = array();
    $numKeysAdded = 0;
    $maxJointsPerNode = 3;
    $arbitaryNameCounter = ord("A");


    $startNode = new node();
    $startNode->type = "START";
    $startNode->x = 300;
    $startNode->y = 300;
    
    $startNode->keysNeededToReach = new keyList();

    $i = 0;
    while($i < $numberOfGoals) {
        array_push($delayedGoals, new delayedAddGoal(true,false));
        $i++;
    }
}

function updateKeyNeedOfNodes() {
  global $startNode, $nodesExploredForKeySet;
  $nodesExploredForKeySet = array();
         setNodeKeyNeed($startNode,new keyList());
}

      function setNodeKeyNeed($param1Node, $param2Keylist) {
          $loc3Joint = null;
          $loc4Joint = null;
         

if (!(in_array($param1Node, $nodesExploredForKeySet))) {

array_push($nodesExploredForKeySet, $param1Node);
            
            $param1Node->keysNeededToReach = $param2Keylist;
            foreach ($param1Node->j as $loc3Joint) {
            
               if($loc3Joint->endA == $param1Node) {
                  if($loc3Joint->openedByKey != null && !$param2Keylist->hasKey($loc3Joint->openedByKey)) {
                    // clone array:
                     $loc4Joint = $param2Keylist;
                     $loc4Joint.addKey($loc3Joint->openedByKey);
                     setNodeKeyNeed($loc3Joint->endB,$loc4Joint);
                  } else {
                     setNodeKeyNeed($loc3Joint->endB,$param2Keylist);
                  }
               }
            }
         }
      }

function addGoal($param1, $param2, $param3 = false, $param4 = false) {
  global $numKeysAdded, $maxJointsPerNode;
  $loc7 = null;
         $loc8Array = array();
         $loc9Node = null;
         $loc10Node = null;
         $loc5Node = new node();
         $loc6Joint = addBranch($param1,$loc5Node);
         if($param2) {
            $loc7 = new key();
            $numKeysAdded++;
            $loc6Joint->openedByKey = $loc7;
            updateKeyNeedOfNodes();
            $loc8Array = array();

            foreach ($nodeList as $loc9Node) {
      
               if(count($loc9Node->j) < $maxJointsPerNode && $loc9Node->keysNeededToReach->sameOrLessThan($param1->keysNeededToReach)) {
                  array_push($loc8Array, $loc9Node);
               }
            }
            if(count($loc8Array) > 0) {
               $loc10Node = addGoal($loc8Array[count($loc8Array)],$param3,false);
               $loc10Node->holdsKey = $loc7;
               $loc10Node->type = "KEYHOLDER";
               $loc7->nodeWhereFound = $loc10Node;
            } else {
               trace("FAIL: Attempting to add a key, but no anchor node found with a spare joint slot and correct key requirements.");
            }
         }
         return $loc5Node;
}

function init() {
  global $numberOfGoals;
       
         $i = 0;
         while($i < $numberOfGoals) {
            $loc2 = addGoal($nodeList[count($nodeList)],true,true);
            $loc2->type = "ENDGOAL";
            $i++;
         }
         updateKeyNeedOfNodes();
}

function insertNodeBeforeJoint($param1) {
          $loc2Node = null;
         $loc3Node = null;
         $loc4Node = null;
         $loc2Node = $param1->endA;
         $loc3Node = $param1->endB;
         $loc4Node = new node();
         $loc4Node->x = $loc3Node->x;
         $loc4Node->y = $loc3Node->y;
         $loc3Node->x = $loc3Node->x + (-0.5 + mt_rand(-1,1));
         $loc3Node->y = $loc3Node->y + (-0.5 + mt_rand(-1,1));
         $param1->endA = $loc4Node;
         $loc5Joint = new joint($loc2Node,$loc4Node);
         return $loc4Node;
}

function insertNodeAfterJoint($param1) {
     $loc2Node = null;
         $loc3Node = null;
         $loc4Node = null;
         $loc2Node = $param1->endA;
         $loc3Node = $param1->endB;
         $loc4Node = new node();
         $loc4Node->x = $loc3Node->x;
         $loc4Node->y = $loc3Node->y;
         $loc3Node->x = $loc3Node->x + (-0.5 + mt_rand(-1,1));
         $loc3Node->y = $loc3Node->y + (-0.5 + mt_rand(-1,1));
         $param1->endB = $loc4Node;
         $loc5Joint = new joint($loc4Node,$loc3Node);
         return $loc4Node;
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
         if(count($jointList) > 0) {
            $loc6ArrayOfArrays = array();
foreach ($nodeList as $loc7Node) {
               if(count($loc7Node.j) == 1) {
                  $loc6ArrayOfArrays.push($loc7Node);
               }
            }
            $loc8Node = $loc6ArrayOfArrays[count($loc6ArrayOfArrays)];
            if(mt_rand(0,10) > 2) {
               insertNodeBeforeJoint($loc8Node->j[0]);
            } else {
               insertNodeAfterJoint($loc8Node->j[0]);
            }
            
         } else if(count($nodeList) > 0) {
            updateKeyNeedOfNodes();
array_push($nodeList, "");
            $loc9Node = end($nodeList);
            $loc10KeyList = $loc9Node->keysNeededToReach;
            $loc11Array = array();
            foreach ($nodeList as $loc12Node) {
               if($loc12Node != $loc9Node && $loc10KeyList->sameAs($loc12Node->keysNeededToReach)) {
                  $loc13Bool = false;
foreach ($loc9Node.j as $loc14Joint) {
                     if($loc14Joint->giveOtherEnd($loc9Node) == $loc12Node) {
                        $loc13Bool = true;
                        break;
                     }
                  }
                  if(!$loc13Bool) {
                     $loc15Num = $loc9Node->x - $loc12Node->x;
                     $loc16Num = $loc9Node->y - $loc12Node->y;
                     $loc17Num = $loc15Num * $loc15Num + $loc16Num * $loc16Num;
                     if($loc17Num <= ($loc9Node->radius + $loc12Node->radius + 3) * ($loc9Node->radius + $loc12Node->radius + 3)) {
                        array_push($loc11Array, $loc12Node);
                     }
                  }
               }
            }
            if(count($loc11Array) > 0) {
               $loc18Node = $loc11Array[count($loc11Array)];
               new joint($loc9Node,$loc18Node);
            }
         }
           foreach ($delayedGoals as $thisDelayedAddGoal) {
               $delayedGoalIndex =   array_search($thisDelayedAddGoal, $delayedGoals);
               if($delayedGoalIndex !== false) {
                     array_splice($delayedGoals, $delayedGoalIndex, 1);
               }
$loc20ArrayOfNodes = array();
                 foreach ($nodeList as $loc21Node) {
                  if(count($loc21Node->keysNeededToReach->v) >= $numKeysAdded - 1 && count($loc21Node->j) < $maxJointsPerNode) {
                     array_push($loc20ArrayOfNodes, $loc21Node);
                  }
               }
               if(count($loc20ArrayOfNodes) > 0) {
                  $loc22Node = addGoal($loc20ArrayOfNodes[count($loc20ArrayOfNodes)],$thisDelayedAddGoal->addLock,$thisDelayedAddGoal->andLockAwayTheKey);
                  if(count($delayedGoals) == 0) {
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
            $loc5Joint.update();
         }
          foreach ($nodeList as $loc4Node) {
            $loc4Node.update();
         }
         /*
         this.framesPassed++;
         if(this.delayedGoals.length == 0) {
            this.framesSinceFinishedAddingGoals++;
         }
         */
 
      }


worldGraph();
enterFrame();


?>