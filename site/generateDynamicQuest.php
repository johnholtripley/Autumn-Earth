<?PHP
// TO DO
//
// some actions need a cost for things that are particularly difficult or lengthy to do, thes would then only be used when no other route (cost as in A* terms, and keep array sorted for low cost items first)
//
// check if a need has sibling conditions that need fulfillin as well before determining that a need has been fulfilled
// but ... first, Find a way to handle branching needs when have multiple preconditions.



// build NPC path follower, put in a reasonable fall back path for them to start on, then request this need driven path that will over-write this. Need to pass NPC's id to ensure the path is applied to correct NPC, and a start tile (so the relative movements make sense) Probably need to path find to this start tile to ensure it all works.


// ====================



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
$thisNPCsGold = 300;
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
grab parent details ($thisNeedsParent = $needsQueue[$thisNeed];)
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

$currentGold = $thisNPCsGold;

do {
$hasFoundPlan = false;

// remove this from list
$thisNeed = array_shift($uncheckedQueue);

$theseParameters = explode("_", $thisNeed);

// if this need can be met, and all of its siblings, then success


switch($theseParameters[0]) {
 case "own":
// check inventory:
if (in_array($theseParameters[1], $thisNPCsItems)) {
$hasFoundPlan = true;
}

break;

case "at":
if ($thisNPCsLocation == $theseParameters[1]) {
$hasFoundPlan = true;
}
break;



case "gold":
if ($currentGold >= intval($theseParameters[1])) {
$currentGold -= intval($theseParameters[1]);
$hasFoundPlan = true;
}
break;

  
  }




if ($hasFoundPlan) {
  // see if this precondition had any 'sibling' conditions:
  for ($i=0; $i<count($actionsAvailable); $i++) {
    if($actionsAvailable[$i][0] == $theseParameters[0]) {
      if( count($actionsAvailable[$i][1])>1) {
        echo "this need has siblings - need to check these too... ###########";
      }
    }
  }
}






if (!$hasFoundPlan) {
// keep looking


// add all preconditions that match this need to the list:


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
    
    echo "for ".$thisNeed." now adding ".$thisArrayKey."<br />";
    
    // add to array with reference to parent:
    $needsQueue[$thisArrayKey] = $thisNeed;
    array_push($uncheckedQueue,$thisArrayKey);
    }
  }

}
}
// keep looping while not success and still options to check
} while ((count($uncheckedQueue) >0) && (!$hasFoundPlan));

echo "<hr />";

if (!$hasFoundPlan) {
echo "no plan found";
// see how far the plan got, and then create quest for un-met need
// #######################
} else {
// iterate through parents to plan
echo "found a plan<br />";
$thisPlan = array();


array_push($thisPlan, $thisNeed);
do {
$thisNeedsParent = $needsQueue[$thisNeed];
array_push($thisPlan, $thisNeedsParent);
$thisNeed = $thisNeedsParent;

} while($needsQueue[$thisNeed] != "null");
 echo "<pre>";
 print_r(array_values($thisPlan));
  echo "</pre>";

}





?>