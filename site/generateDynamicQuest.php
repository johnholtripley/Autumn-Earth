<?PHP

$itemsAvailable = array('axe' => 'an axe', 'oak' => 'an oak tree');

// [result], [array of pre-conditions]
$actionsAvailable = array(
array('use',array('own')),
array('own',array('buy')),
array('own',array('steal')),
array('buy',array('gold:25','at:blacksmith'))
);

// needs - [verb][noun][value/reward]:
$thisNPCsNeeds = array(array("use","axe","0"));
$thisNPCsItems = array("pineapple");
$thisNPCsLocation = "blacksmith";

$herosItems = array("hat");

// if more than 1 need, determine which is the most urgent:
// ###############
$mostImportantNeed = 0;




/* a star method

add current need to queue:
need[use+"_"+axe] = {parent = null}
push to uncheckedlist

while uncheckedlist.length > 0
uncheckedlist.shift

if not, add preconditions to uncheckedlist as objects

if found end need, then 
while objectParent != null,
grab parent details
unshift to array of ordered needs
make the parent the new objectParent


*/



$needsQueue = array();
$uncheckedQueue = array();

// build array key:
$thisArrayKey = $thisNPCsNeeds[$mostImportantNeed][0]."_".$thisNPCsNeeds[$mostImportantNeed][1];
// add array key in with value of parent:
$needsQueue[$thisArrayKey] = "null";

array_push($uncheckedQueue,$thisArrayKey);

do {
$hasFoundPlan = false;

// remove this from list
$thisNeed = array_shift($uncheckedQueue);


// if this need can be met, and all of its siblings, then success
// ############
if (!$hasFoundPlan) {
// keep looking

$theseParameters = explode("_", $thisNeed);
// add all preconditions that match this need to the list:


 for ($i=0; $i<count($actionsAvailable); $i++) {
  if($actionsAvailable[$i][0] == $theseParameters[0]) {
    for ($j=0; $j<count($actionsAvailable[$i][1]); $j++) {
    
    // check if a noun exists for this precondition, if not, use the parent's noun:
    
    if(stristr($actionsAvailable[1][$j], ':') === FALSE) {
    $thisNoun = $theseParameters[1];
    $thisVerb = $actionsAvailable[1][$j];
    } else {
    $splitParameters = explode(":",$actionsAvailable[1][$j]);
    $thisNoun = $splitParameters[0];
    $thisVerb = $splitParameters[1];
    }
    
    $thisArrayKey = $thisVerb."_".$thisNoun;
    
    // add to array with reference to parent:
    $needsQueue[$thisArrayKey] = $thisNeed;
    array_push($uncheckedQueue,$thisArrayKey);
    }
  }

}
}
// keep looping while not success and still options to check
} while ((count($uncheckedQueue) >0) && (!$hasFoundPlan));



if (!$hasFoundPlan) {
echo "no plan found found";
// see how the plan got, and then create quest for un-met need
// #######################
} else {
// iterate through parents to plan
// ###################
}














/*
$needList = array();
array_push($needList,$thisNPCsNeeds[$mostImportantNeed]);
$currentPlan = array();
do {
$thisNounRef = $needList[0][1];
// see if the noun is an item:
if (array_key_exists($thisNounRef ,$itemsAvailable)) {
  $thisNoun = $itemsAvailable[$thisNounRef];
}
$currentNeeds = explode(":", $needList[0][0]);
$currentNeed = $currentNeeds[0];
if(count($currentNeeds)>1) {
$currentParameter = $currentNeeds[1];
}
$specialConditionsMet = false;
switch($currentNeed) {
 case "own":
  // npc needs to own the noun
  array_push($currentPlan, "I need to own ".$thisNoun);
  // check if npc has this item in their inventory:
  if (in_array($thisNounRef ,$thisNPCsItems)) {
    array_push($currentPlan,  "i have one!");
    $specialConditionsMet = true;
  } else {
  // see if hero has one:
  if (in_array($thisNounRef ,$herosItems)) {
    array_push($currentPlan,  "hero has one!");
   $specialConditionsMet = true;
  } 
  }
  break;
  case "at":
  array_push($currentPlan, "I need to be at ".$currentParameter);
  if($thisNPCsLocation == $currentParameter) {
  array_push($currentPlan, "I am there already!");
  $specialConditionsMet = true;
  } else {
   // see if NPC can move there:
   // ##################
  }
  break;
  case "gold":
  array_push($currentPlan, "I need ".$currentParameter." gold");
  break;
 }
 if(!$specialConditionsMet) {
  // other, generic actions
  array_push($currentPlan,  "I want to ".$currentNeed." ".$thisNoun);
  // look through actions:
  $actionFound = array();
  for ($i=0; $i<count($actionsAvailable); $i++) {
  if($actionsAvailable[$i][0] == $currentNeed) {
    array_push($actionFound, $i);
  }
  }
  if (count($actionFound) != 0) {
    // check what preconditions are:
    for ($i=0; $i<count($actionFound); $i++) {
    for ($j=0;$j<count($actionsAvailable[$actionFound[$i]][1]);$j++) {
    $thisPrecondition = $actionsAvailable[$actionFound[$i]][1][$j];
     //  array_push($currentPlan,  "precondition: (".$i.") ".$thisPrecondition);
      // add this to the need list:
      array_push($needList, array($thisPrecondition,$thisNounRef));
    }
    }
  } else {
      array_push($currentPlan, "dead end");
  }
}
array_shift($needList);
} while (count($needList)>0);
echo '<ul>';
for ($i=0;$i<count($currentPlan);$i++) {
echo '<li>'.$currentPlan[$i].'</li>';
}
echo '</ul>';
*/
?>