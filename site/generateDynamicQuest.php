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

$needList = array();
array_push($needList,$thisNPCsNeeds[$mostImportantNeed]);

$currentPlan = array();









/* a star method

add current need to queue:
need[use+"_"+axe] = {parent = null}
push to uncheckedlist

while uncheckedlist.length > 0
uncheckedlist.shift
see if this is the goal.
if not, add preconditions to uncheckedlist as objects

if found end need, then 
while objectParent != null,
grab parent details
unshift to array of ordered needs
make the parent the new objectParent


/*













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
?>