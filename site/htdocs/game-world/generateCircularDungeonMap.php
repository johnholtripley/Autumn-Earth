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
    public function delayedAddGoal($param1, $param2, $param3)    {
        $this->addLock = $param1;
        $this->andLockAwayTheKey = $param2;
        $this->framesRemaining = $param3;
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

   }

    public function sameOrLessThan($param1) {

    }

    public function clone() {
        return clone $this->v;
    }

    public function addKey($param1) {
        if (!(in_array($param1, $this->v))) {
            array_push($this->v,$param1);
        }
    }
}

class node {
    public $radius = 1;
    public $finalRadius = 12;
    public $type = "NORMAL";
    public $j;
    /*
    this.keysNeededToReach = new keyList();
    this.arbitaryName = String.fromCharCode(node.a.arbitaryNameCounter);
    node.a.arbitaryNameCounter++;
    this.icon = new Shape();
    addChild(this.icon);
    node.a.graphLayer.addChild(this);
    node.a.nodeList.push(this);
    */
}


function worldGraph() {
    $numberOfGoals = 3;
    $delayedGoals = array();
    $numKeysAdded = 0;
    $maxJointsPerNode = 3;

    $startNode = new node();
    $startNode->type = "START";
    $startNode->x = 300;
    $startNode->y = 300;
    $startNode->finalRadius = mt_rand(8,18);

    $i = 0;
    while($i < $numberOfGoals) {
        array_push($delayedGoals, new delayedAddGoal(true,false,30 + 60 * $i));
        $i++;
    }
}



worldGraph();


?>