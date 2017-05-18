<?php

// https://www.sitepoint.com/data-structures-4/



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
?>