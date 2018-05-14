<?php

include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");



$chr = $_GET["chr"];



$debug = false;
if(isset($_GET["debug"])) {
$debug = true;
}




$possibleBreedablePlants = [];
$plantNames = [];
// item category 1 is flowers: (use showInTheCodex to remove nodes etc)
$query = 'select itemid, shortname from tblinventoryitems where itemcategories = 1 and showInTheCodex="1" order by shortname ASC';
$result = mysqli_query($connection, $query);
if(mysqli_num_rows($result)>0) {
  while ($row = mysqli_fetch_array($result)) {
  	array_push($possibleBreedablePlants,$row['itemid']);
    $plantNames[($row['itemid'])] = $row['shortname'];
  	}
  }
  mysqli_free_result($result);



// array built so that "1-2": 3 means if species #1 and species #2 are bred, then the result is species #3
// the smaller number is a;lways first in the key (eg. 1-2, not 2-1)



// do each for flowers, herbs and trees ########



// get which crosses the character knows:

$plantCrossesKnown=[];

$query2 = 'SELECT plantcrossesknown from tblcharacters where charid="'.$chr.'"';
$result2 = mysqli_query($connection, $query2);
if(mysqli_num_rows($result2)>0) {
  while ($row = mysqli_fetch_array($result2)) {

$plantCrossesString = $row['plantcrossesknown'];
// remove [, ] and "
$plantCrossesString = str_replace("[", "", $plantCrossesString);
$plantCrossesString = str_replace("]", "", $plantCrossesString);
$plantCrossesString = str_replace('"', '', $plantCrossesString);
    $plantCrossesKnown = explode(",",$plantCrossesString);
}
}
  mysqli_free_result($result2);




 // sort the results so that they're different for each character, so it can't be spoiled:
// (the player can always buy a particular seed that they're after if they want)
mt_srand($chr);

    

$sortedPossibleBreedablePlants = $possibleBreedablePlants;

function seededRandomSort($a, $b) {
    if (mt_rand(0,1) == 0) {
        return -1;
    } else {
    	return 1;
    }
}

usort($sortedPossibleBreedablePlants, "seededRandomSort");

$plantBreeding = [];
 $arrayCounter = 0;
 for ( $i = 0; $i < count($sortedPossibleBreedablePlants); $i++) {
        for ( $j = 0; $j < count($sortedPossibleBreedablePlants); $j++) {
            if ($i != $j) {
            	if ($sortedPossibleBreedablePlants[$i] < $sortedPossibleBreedablePlants[$j]) {
                    $thisKey = $sortedPossibleBreedablePlants[$i] . "-" . $sortedPossibleBreedablePlants[$j];
                } else {
                    $thisKey = $sortedPossibleBreedablePlants[$j] . "-" . $sortedPossibleBreedablePlants[$i];
                }
                if (!array_key_exists($thisKey, $plantBreeding)) {

				do {
                        $arrayCounter++;
                        if ($arrayCounter >= count($sortedPossibleBreedablePlants)) {
                            $arrayCounter = 0;
                        }
                        $thisResultType = $sortedPossibleBreedablePlants[$arrayCounter];
                        // make sure this offspring isn't the same as either parent:

                    } while (($thisResultType == $sortedPossibleBreedablePlants[$j]) || ($thisResultType == $sortedPossibleBreedablePlants[$i]));
                    $plantBreeding[$thisKey] = $sortedPossibleBreedablePlants[$arrayCounter];


                }
            }
        }
    }


if($debug) {
 var_dump($plantBreeding);
}





// build output table:
	     $markup = '<table>';
    for ( $i = 0; $i <= count($possibleBreedablePlants); $i++) {
        $markup .= '<tr>';
        for ( $j = 0; $j <= count($possibleBreedablePlants); $j++) {
           // $markup .= '<td style="border:1px solid #cecece;padding:6px;">';
            if ($i == 0) {
                if ($j == 0) {
                    $markup .= '<td></td>';
                } else {
                    $markup .= '<th><img src="/images/game-world/inventory-items/' . $possibleBreedablePlants[$j - 1] . '.png"><p>'.$plantNames[($possibleBreedablePlants[$j - 1])].'</p></th>';
                }
            } else {
                if ($j == 0) {
                    $markup .= '<th><img src="/images/game-world/inventory-items/' . $possibleBreedablePlants[$i - 1] . '.png"><p>'.$plantNames[($possibleBreedablePlants[$i - 1] )].'</p></th>';
                } else {
                    if ($i == $j) {
                        $markup .= '<td><img src="/images/game-world/inventory-items/' . $possibleBreedablePlants[$i - 1] . '.png"><p>'.$plantNames[($possibleBreedablePlants[$i - 1])].'</p></th>';
                    } else {
                        if ($possibleBreedablePlants[$i - 1] < $possibleBreedablePlants[$j - 1]) {
                            $thisKey = $possibleBreedablePlants[$i - 1] . "-" . $possibleBreedablePlants[$j - 1];
                        } else {
                            $thisKey = $possibleBreedablePlants[$j - 1] . "-" . $possibleBreedablePlants[$i - 1];
                        }
                      
                        if(in_array($thisKey, $plantCrossesKnown)) {
$markup .= '<td><img src="/images/game-world/inventory-items/' . $plantBreeding[$thisKey] . '.png"><p>'.$plantNames[($plantBreeding[$thisKey])].'</p></th>';
                        } else {
                            $markup .= '<td>?</td>';
                        }
                        
                    }
                }
            }
          //  $markup .= '</td>';
        }
        $markup .= '</tr>';
    }
    $markup .= '</table>';



if($debug) {
    echo $markup;
} else {
    header('Content-Type: application/json');
    $markup = str_replace('"', '\"', $markup);
    echo '{"markup":"'.$markup.'"}';
}







?>