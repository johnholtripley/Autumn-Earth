<?PHP
// TO DO
//
// some actions need a cost for things that are particularly difficult or lengthy to do, thes would then only be used when no other route (cost as in A* terms, and keep array sorted for low cost items first)
//
// build NPC path follower, put in a reasonable fall back path for them to start on, then request this need driven path that will over-write this. Need to pass NPC's id to ensure the path is applied to correct NPC, and a start tile (so the relative movements make sense) Probably need to path find to this start tile to ensure it all works.
//
//
// ====================



$itemsAvailable = array('wheat' => 'some wheat', 'field' => 'an empty field', 'wheatfield' => 'a wheat field', 'wheatseeds' => 'some wheat seeds');
$priceList = array('wheat' => '100','eggs' => '200','wheatseeds' => '100');
// [result], [array of pre-conditions]
$actionsAvailable = array(
array('use',array('own')),
array('own',array('buy')),
array('own',array('gather')),
array('own',array('steal')),
array('own:gold',array('sell')),
array('buy',array('gold','at:market')),
array('sell',array('x','at:market')),
array('gather:wheat',array('at:wheatfield')),
array('gather:wheat',array('at:field','plant:wheatseeds')),
array('plant',array('own'))
);




// needs - [verb][noun][value/reward]:
$thisNPCsNeeds = array(array("own","wheat","0"));
$thisNPCsItems = array("pineapple");
$thisNPCsLocation = "house";
$thisNPCsGold = 500;
$herosItems = array("eggs");

// if more than 1 need, determine which is the most urgent:
// ###############
$mostImportantNeed = 0;




$needsQueue = array();
$uncheckedQueue = array();
$endNodeList = array();

// build array key:
$thisArrayKey = $thisNPCsNeeds[$mostImportantNeed][0]."_".$thisNPCsNeeds[$mostImportantNeed][1];
// add array key in with value of parent:
$needsQueue[$thisArrayKey] = "targetNeed";

array_push($uncheckedQueue,$thisArrayKey);

$currentGold = $thisNPCsGold;


do {

$thisNeedHasBeenMet = false;

// remove this from list
$thisNeed = array_shift($uncheckedQueue);

echo "<br>checking ".$thisNeed ."...<br>";

$theseParameters = explode("_", $thisNeed);



switch($theseParameters[0]) {
 case "own":
// check inventory:
if (in_array($theseParameters[1], $thisNPCsItems)) {
$thisNeedHasBeenMet = true;
}
break;

 case "gold":
// see if NPC can afford it
if($currentGold>=$priceList[$theseParameters[1]]) {
$thisNeedHasBeenMet = true;
$currentGold -=$priceList[$theseParameters[1]];
} else {
// add a need of acquiring some gold:
$thisArrayKey = "own_gold";
        array_push($uncheckedQueue,$thisArrayKey);
echo "adding ".$thisArrayKey." from ".$thisNeed." to queue<br />";
        $needsQueue[$thisArrayKey] = $thisNeed; 
}
break;

case "goto":
$thisNPCsLocation = $theseParameters[1];
$thisNeedHasBeenMet = true;
break;

case "at":
if ($thisNPCsLocation == $theseParameters[1]) {
$thisNeedHasBeenMet = true;
} else {
// add a need of getting to location:
$thisArrayKey = "goto_".$theseParameters[1];
        array_push($uncheckedQueue,$thisArrayKey);
echo "adding ".$thisArrayKey." from ".$thisNeed." to queue<br />";
        $needsQueue[$thisArrayKey] = $thisNeed; 
}
break;
  
  }
    
    
    
if (!$thisNeedHasBeenMet) {
  for ($i=0; $i<count($actionsAvailable); $i++) {
    if($actionsAvailable[$i][0] == $theseParameters[0]) {
      for ($j=0; $j<count($actionsAvailable[$i][1]); $j++) {
        // check if a noun exists for this precondition, if not, use the parent's noun:
        if(stristr($actionsAvailable[$i][1][$j], ':') === FALSE) {
        $thisNoun = $theseParameters[1];
        $thisVerb = $actionsAvailable[$i][1][$j];
        } else {
        $splitParameters = explode(":",$actionsAvailable[$i][1][$j]);
        $thisNoun = $splitParameters[1];
        $thisVerb = $splitParameters[0];
        }
        $thisArrayKey = $thisVerb."_".$thisNoun;
        array_push($uncheckedQueue,$thisArrayKey);
        // add reference to parent:
        echo "adding ".$thisArrayKey." from ".$thisNeed." to queue<br />";
        $needsQueue[$thisArrayKey] = $thisNeed; 
      }
    }
  }
} else {



array_push($endNodeList,$thisNeed);

echo "need met at ".$thisNeed.".<br>";
}





// keep looping while still options to check
} while (count($uncheckedQueue) >0);

echo "<hr />";


// iterate through parents to determine plan

$thisPlan = array();

// find an end node:
if( count($endNodeList) != 0) {



for ($i=0; $i<count($endNodeList); $i++) {
$thisLoopsPlan = array();
$thisNode = $endNodeList[$i];
array_push($thisLoopsPlan, $thisNode);
$thisChainInEntirety = "";
do {
$thisNeedsParent = $needsQueue[$thisNode];


if (in_array($thisNeedsParent, $thisPlan)) {
$thisChainInEntirety = $thisNeedsParent;
break;
}


array_push($thisLoopsPlan, $thisNeedsParent);
$thisNode = $thisNeedsParent;

// check this node, if it already exists in the overall plan, that add the chain in after the shared node:

} while($needsQueue[$thisNode] != "targetNeed");
if($thisChainInEntirety == "") {
// add whole chain:
$thisPlan = array_merge($thisPlan, $thisLoopsPlan);
} else {
// find the node to insert fragment at:
$insertNode = array_search($thisChainInEntirety, $thisPlan);
// need to insert before this node:
array_splice($thisPlan, $insertNode, 0, $thisLoopsPlan);


}
}





 echo "<pre>";
 print_r(array_values($thisPlan));
  echo "</pre>";


} else {
echo "<br>no plan found.<br>";
}




?>