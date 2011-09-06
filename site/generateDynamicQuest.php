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

$herosItems = array("axe");

// if more than 1 need, determine which is the most urgent:
// ###############
$mostImportantNeed = 0;

$needList = array();
array_push($needList,$thisNPCsNeeds[$mostImportantNeed]);

$currentPlan = array();

do {

$thisNounRef = $needList[0][1];
// see if the noun is an item:
if (array_key_exists($thisNounRef ,$itemsAvailable)) {
  $thisNoun = $itemsAvailable[$thisNounRef];
}

switch($needList[0][0]) {
  case "own":
  // npc needs to own the noun
  array_push($currentPlan, "I need to own ".$thisNoun);
  // check if npc has this item in their inventory:
  if (in_array($thisNounRef ,$thisNPCsItems)) {
    array_push($currentPlan,  "i have one!");
  } else {
  
  // see if hero has one:
  if (in_array($thisNounRef ,$herosItems)) {
    array_push($currentPlan,  "hero has one!");
  } else {
  
    // look through actions to find a way to get one:
    // ########################
    }
  }
  break;
  case "use":
  // npc needs to use the noun
  array_push($currentPlan,  "I want to use ".$thisNoun);
  // look through actions to determine what needs to happen to use object:
  
  $actionFound = -1;
  for ($i=0; $i<count($actionsAvailable); $i++) {
  if($actionsAvailable[$i][0] == "use") {
    $actionFound = $i;
    break;
  }
  }
  if ($actionFound != -1) {
    // check what preconditions are:
    for ($i=0;$i<count($actionsAvailable[$actionFound][1]);$i++) {
    $thisPrecondition = $actionsAvailable[$actionFound][1][$i];
      // array_push($currentPlan,  "precondition: ".$thisPrecondition);
      // add this to the need list:
      array_push($needList, array($thisPrecondition,$thisNounRef));
    }
  } else {
      echo "no corresponding action found";
  }
  
  break;
}

array_shift($needList);


} while (count($needList)>0);
echo '<ul>';
for ($i=0;$i<count($currentPlan);$i++) {
echo '<li>'.$currentPlan[$i].'</li>';
}
echo '</ul>';
?>