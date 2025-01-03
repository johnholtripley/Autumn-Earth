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
/*
$actionsAvailable = array(
array('use',array('own')),
array('own',array('buy')),
//array('own',array('gather')),
//array('own',array('steal')),
array('gold',array('sell')),
array('buy',array('at:market','gold')),
array('sell',array('own','at:market')),
array('gather:wheat',array('at:wheatfield')),
array('gather:wheat',array('at:field','plant:wheatseeds')),
array('plant',array('own'))
);
*/


// 'result' => [array of pre-conditions]
$actionsAvailable = array(
'use' => array('own'),
'own' => array('buy'),
'gold' => array('sell'),
'buy' => array('at:market','gold'),
'sell' => array('own','at:market'),
'gather:wheat' => array('at:wheatfield'),
'gather:wheat' => array('at:field','plant:wheatseeds'),
'plant' => array('own')
);




// needs - [verb][noun][value/reward]:
$thisNPCsNeeds = array(array("own","wheat","0"));
$thisNPCsNeeds = array(array("sell","eggs","0"));
$thisNPCsItems = array("eggs");
$thisNPCsLocation = "house";
$thisNPCsGold = 5;
$herosItems = array("pineapple");

// if more than 1 need, determine which is the most urgent:
// ###############
$mostImportantNeed = 0;




$needsQueue = array();
$uncheckedQueue = array();
$allCheckedNeeds = array();
$endNodeList = array();



class NPCneed {
  public function __construct($parent, $key, $npcState, $complete) {
    global $uncheckedQueue, $allCheckedNeeds;
    $this->parent = $parent;

    /*
    // make a unique key
    $thisNewKey = $key."/".$parent;
    $thisNewKeySplit = explode("/", $thisNewKey);
    if(end($thisNewKeySplit) != $location) {
      $thisNewKey .= "/".$location;
    }
    $this->key = $thisNewKey;
    */

    $this->key = $key;
    $this->npcState = $npcState;
    $this->complete = $complete;
    array_push($uncheckedQueue, $this);
  //  array_push($allCheckedNeeds, $this);
    $allCheckedNeeds[$key] = $this;
  }
  /*
  public function getKey() {
    return explode("/",$this->key)[0];
  }
  */
}



$thisArrayKey = $thisNPCsNeeds[$mostImportantNeed][0]."_".$thisNPCsNeeds[$mostImportantNeed][1];
$thisNPCsState = array("location" => $thisNPCsLocation, "gold" => $thisNPCsGold, "items" => $thisNPCsItems);
new NPCneed("targetNeed", $thisArrayKey, $thisNPCsState, "false");


   echo "<pre>";
   print_r(array_values($allCheckedNeeds));
    echo "</pre>";




$debugCounter = 0;
$metNeed = false;
do {
  $thisNeed = array_shift($uncheckedQueue);
  $thisLoopNeedMeet = false;
  echo "<br>".$debugCounter.". checking ".$thisNeed->key ." (from ".$thisNeed->parent.") - current status: loc:".$thisNeed->npcState['location'].", £".$thisNeed->npcState['gold'].", items: ".implode(", ",$thisNeed->npcState['items'])." - complete: ".$thisNeed->complete."<br>";
  $theseParameters = explode("_", $thisNeed->key);

  switch($theseParameters[0]) {
    case "own":
    if (in_array($theseParameters[1], $thisNeed->npcState['items'])) {
      echo "has needed item<br>";
      $thisLoopNeedMeet = true;
    }
    break;


    case "goto":
    //$thisNPCsLocation = $theseParameters[1];
    $thisNeed->npcState['location'] = $theseParameters[1];
    echo "moved to ".$theseParameters[1]."<br>";
    $thisLoopNeedMeet = true;
    break;

    case "at":



    if ($thisNeed->npcState['location'] == $theseParameters[1]) {
    //$thisNeedHasBeenMet = true;
      echo "already at ".$theseParameters[1]."<br>";
      $thisLoopNeedMeet = true;
    } else {
      // add a need to get there
      echo "need to move to ".$theseParameters[1];
     new NPCneed($thisNeed->key, 'goto_'.$theseParameters[1], $thisNeed->npcState, "false");
    }
    break;

    default: 


            echo "checking ".$theseParameters[0]."... ";
      foreach ($actionsAvailable as $key => $value) {     
        if($key == $theseParameters[0]) {
          for ($j=0; $j<count($value); $j++) {
            // check if a noun exists for this precondition, if not, use the parent's noun:
            if(stristr($value[$j], ':') === FALSE) {
              $thisNoun = $theseParameters[1];
              $thisVerb = $value[$j];
              if($thisVerb == "sell") {
                // check for items to sell, don't use the parent (target) noun:
                // check all sellable items and check if sell price covers the buy price of the target noun ################
                $thisNoun = $thisNPCsItems[0];
              }
            } else {
              $splitParameters = explode(":",$value[$j]);
              $thisNoun = $splitParameters[1];
              $thisVerb = $splitParameters[0];
            }
            $thisNewArrayKey = $thisVerb."_".$thisNoun;
            // can't buy gold:
            if($thisNewArrayKey != "buy_gold") {
              //  array_push($uncheckedQueue,$thisArrayKey);
              echo "adding need of ".$thisNewArrayKey.". ";
              new NPCneed($thisNeed->key, $thisNewArrayKey, $thisNeed->npcState, "false");
            }
          }
        }
      }



    break;

  }

  $debugCounter++;

if($thisLoopNeedMeet) {
  // mark this need as being satisfied:
  $allCheckedNeeds[$thisNeed->key]->complete = 'true';
  echo $thisNeed->key." complete<br>";


  // check the parent to see if all siblings (if any) are also complete
  $thisNeedsParentKey = $thisNeed->parent;
  echo "looking for parent key: ".$thisNeedsParentKey;
  

$shouldKeepLooping = false;
do {

  $allSiblingsComplete = true; 
  // find siblings:
  foreach ($allCheckedNeeds as $key => $value) {
    if($value->parent == $thisNeedsParentKey) {
      // check it's not this key:
      if($key != $thisNeed->key) {
        echo ". found sibling: ".$key;
        if($value->complete == 'false') {
          $allSiblingsComplete = false;
          echo ". sibling not complete ";
        } else {
          echo ". sibling is complete ";
        }
      }
    } 
  }

  if($allSiblingsComplete) {
    echo " - all siblings complete. mark the parent as complete<br>";

    // repeat while there are siblings, or reached the targetNeed
    $allCheckedNeeds[$thisNeed->parent]->complete = 'true';
    // process this so the NPC's state is correct
    


  $theseParameters = explode("_", $thisNeed->parent);
  switch($theseParameters[0]) {
    case "sell":
    echo "processing selling: BEFORE<br>";
    var_dump($allCheckedNeeds[$thisNeed->parent]->npcState);

$salePrice = $priceList[$theseParameters[1]];
$allCheckedNeeds[$thisNeed->parent]->npcState['gold'] += $salePrice;

foreach ($allCheckedNeeds[$thisNeed->parent]->npcState['items'] as $inventoryKey => $inventoryValue) {
  if($inventoryValue == $theseParameters[1]) {
unset($allCheckedNeeds[$thisNeed->parent]->npcState['items'][$inventoryKey]);
  }
}
echo "AFTER<br>";
var_dump($allCheckedNeeds[$thisNeed->parent]->npcState);
    break;
    /*
    case "at":
    $allCheckedNeeds[$thisNeed->parent]->npcState['location'] = $theseParameters[1];
    break;
    */
  }



    $shouldKeepLooping = true;
    $thisNeed = $allCheckedNeeds[$thisNeed->parent];
    $thisNeedsParentKey = $thisNeed->parent;
    if($thisNeedsParentKey == "targetNeed") {
      echo "Got to parent need";
      $metNeed = true;
$shouldKeepLooping = false;
    }
  }



} while ($shouldKeepLooping);




}



} while (count($uncheckedQueue) >0);


if($metNeed) {
  echo "<br>successfully found a sequence";
} else {
  echo "<br>couldn't find a solution";
}
  echo "<br>After wards status: loc:".$thisNeed->npcState['location'].", £".$thisNeed->npcState['gold'].", items: ".implode(", ",$thisNeed->npcState['items'])."<br>";


   

/*
// build array key:
$thisArrayKey = $thisNPCsNeeds[$mostImportantNeed][0]."_".$thisNPCsNeeds[$mostImportantNeed][1];
// add array key in with value of parent:
$needsQueue[$thisArrayKey] = "targetNeed";

// array_push($uncheckedQueue,$thisArrayKey);
new NPCneed("targetNeed", $thisArrayKey, $thisNPCsLocation);

$currentGold = $thisNPCsGold;

$debugCounter = 0;
do {
$thisNeedHasBeenMet = false;
// remove this from list
$thisNeed = array_shift($uncheckedQueue);
echo "<br>".$debugCounter.". checking ".$thisNeed->getKey() ." (".$thisNeed->parent.")...<br>";
$theseParameters = explode("_", $thisNeed->getKey());

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
     //   array_push($uncheckedQueue,$thisArrayKey);
         new NPCneed($thisNeed->key, $thisArrayKey, $thisNeed->location);
echo $debugCounter.". adding £ ".$thisArrayKey." from ".$thisNeed->getKey()." to queue<br />";
     //   $needsQueue[$thisArrayKey] = $thisNeed; 
}
break;

case "goto":
//$thisNPCsLocation = $theseParameters[1];
$thisNeed->location = $theseParameters[1];
$thisNeedHasBeenMet = true;
break;

case "at":
if ($thisNeed->location == $theseParameters[1]) {
$thisNeedHasBeenMet = true;
} else {
// add a need of getting to location:
$thisArrayKey = "goto_".$theseParameters[1];
     // array_push($uncheckedQueue,$thisArrayKey);
        new NPCneed($thisNeed->key, $thisArrayKey, $theseParameters[1]);
echo $debugCounter.". adding ".$thisArrayKey." from ".$thisNeed->getKey()." to queue<br />";
      //  $needsQueue[$thisArrayKey] = $thisNeed; 
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
if($thisVerb == "sell") {
  // check for items to sell, don't use the parent (target) noun:
  // check all sellable items and check if sell price covers the buy price of the target noun ################
  $thisNoun = $thisNPCsItems[0];
}
        } else {
        $splitParameters = explode(":",$actionsAvailable[$i][1][$j]);
        $thisNoun = $splitParameters[1];
        $thisVerb = $splitParameters[0];
        }
        $thisArrayKey = $thisVerb."_".$thisNoun;

        // can't buy gold:
if($thisArrayKey != "buy_gold") {
     //  array_push($uncheckedQueue,$thisArrayKey);
        new NPCneed($thisNeed->key, $thisArrayKey, $thisNeed->location);
        // add reference to parent:
        echo $debugCounter.". adding ".$thisArrayKey." from ".$thisNeed->getKey()." to queue.<br />";
        //$needsQueue[$thisArrayKey] = $thisNeed; 
}

 
      }
    }
  }
} else {



array_push($endNodeList,$thisNeed);

echo $debugCounter.". need met at ".$thisNeed->getKey()." - ".count($uncheckedQueue)." remaining<br>";
}



$debugCounter++;

// keep looping while still options to check
} while (count($uncheckedQueue) >0);

echo "<hr />";



   echo "<pre>";
   print_r(array_values($endNodeList));
    echo "</pre>";



// iterate through parents to determine plan

$thisPlan = array();



function findNodeByKey($keyToLookFor) {
  global $allCheckedNeeds;
    $item = null;
foreach($allCheckedNeeds as $nodeKey => $nodeValue) {
    if ($nodeValue->key == $keyToLookFor) {
        $item = $nodeValue;
        break;
    }
}
return $item;
}


// find an end node:
if( count($endNodeList) != 0) {


// loop backwards finding each node's parent:
  $sequence = array();

do {
  $thisNeedToBuild = array_shift($endNodeList); 
  echo "new loop: ";
  $thisNodeToCheck = $thisNeedToBuild;
  echo $thisNodeToCheck->getKey()." (parent =".$thisNodeToCheck->parent.")<br>";
  do {
    $newNode = findNodeByKey($thisNodeToCheck->parent);
    echo $newNode->getKey()." (parent =".$newNode->parent.")<br>";
    $thisNodeToCheck = $newNode;
  } while ($thisNodeToCheck->parent != "targetNeed");


} while(count($endNodeList)>0);






   echo "<pre>";
  // print_r(array_values($thisPlan));
    echo "</pre>";


} else {
echo "<br>no plan found.<br>";
}

*/


?>