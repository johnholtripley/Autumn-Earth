<?php



include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");

$whichGrammar = '';
if(isset($_GET['whichGrammar'])) {
$whichGrammar = $_GET['whichGrammar'];
}

function makeSeed() {
    // http://php.net/manual/en/function.mt_srand.php
  list($usec, $sec) = explode(' ', microtime());
  return floor((float) $sec + ((float) $usec * 100000));
}

if(isset($_GET["seed"])) {
    $storedSeed = intval($_GET["seed"]);
} else {
    $storedSeed = makeSeed();
}
mt_srand($storedSeed);


function str_replace_first($from, $to, $subject) {
    // https://stackoverflow.com/questions/1252693/using-str-replace-so-that-it-only-acts-on-the-first-match
    $from = '/'.preg_quote($from, '/').'/';
    return preg_replace($from, $to, $subject, 1);
}



function random_key($array){
	// https://stackoverflow.com/questions/25799466/php-better-than-array-rand-qa
    $keys=array_keys($array);
    return $keys[mt_rand(0, count($keys) - 1)];
}



 
function findAndReplaceHashes($stringToCheck, &$json='') {
    global $entriesAlreadyUsed;
    if(!isset($entriesAlreadyUsed)) {
        $entriesAlreadyUsed = [];
    }
    if ($json == '') {
    global $json;
}
    // check for any '#'s:
    $hashSplit = explode("#", $stringToCheck);
    if(count($hashSplit) > 1) {
        for ($i=0;$i<count($hashSplit);$i++) {
            if(substr($hashSplit[$i],0,1) == "|") {
                $needsToBeUnique = false;
                // look for matching keys
                $keyToMatch = substr($hashSplit[$i],1);
                // a * denotes that this needs to unique and not repeated:
                if(strrpos($keyToMatch, "*") !== false) {
                    $needsToBeUnique = true;
$keyToMatch = str_replace("*", "", $keyToMatch);
                }
                
                if (array_key_exists($keyToMatch, $json)) {

if($needsToBeUnique) {
    // see if this key has already been used:

    do {
  $whichReplaceElem = mt_rand(0,(count($json[$keyToMatch])-1));
    $replacementString = $json[$keyToMatch][$whichReplaceElem];
    } while (in_array($replacementString, $entriesAlreadyUsed));
} else {
    // just get a random entry:
    $whichReplaceElem = mt_rand(0,(count($json[$keyToMatch])-1));
    $replacementString = $json[$keyToMatch][$whichReplaceElem];
}

 array_push($entriesAlreadyUsed, $replacementString);

                    
                    
                    // check this substitution string to see if it has any hashes itself:

                    $replacementString = findAndReplaceHashes($replacementString); 
                    $hashSplit[$i] = '<i>'.$replacementString.'</i>';
                   
                }
            }
        }
        // put it back together:
        $stringToCheck = implode("", $hashSplit); 
    }
    return $stringToCheck;  
}
 
 


function capValues($val,$min,$max) {
	if($val<$min) {
	$val = $min;
	}
	if($val>$max) {
		$val = $max;
	}
	return $val;
}


function addPrefix($thisCommonName, $shouldForcePrefix) {
	

if($shouldForcePrefix) {
$shouldAddPrefix = mt_rand(1,8);
} else {
	$shouldAddPrefix = mt_rand(1,44);
}


switch ($shouldAddPrefix) {
    case 1:
        $thisCommonName = "Lesser ".$thisCommonName;
        break;
    case 2:
         $thisCommonName = "Greater ".$thisCommonName;
        break;
            case 3:
         $thisCommonName = "Common ".$thisCommonName;
        break;
                case 4:
         $thisCommonName = "Wild ".$thisCommonName;
        break;
                  case 5:
         $thisCommonName = "Trailing ".$thisCommonName;
        break;
      case 6:
         $thisCommonName = "Marsh* ".$thisCommonName;
        break;
case 7:
         $thisCommonName = "Autumn ".$thisCommonName;
         break;
         case 8:
         $thisCommonName = "Sweet ".$thisCommonName;
        break;
            case 9:
         $thisCommonName = "Our Lady's ".$thisCommonName;
        break;
    default:
       $thisCommonName = ucfirst($thisCommonName);
} 
return $thisCommonName;
}

?><p><?php echo $storedSeed; ?></p><?php
$entriesAlreadyUsed = [];

// create description:
$jsonResults = file_get_contents($_SERVER['DOCUMENT_ROOT'].'/includes/herbarium/description-grammar.json');
$json = json_decode($jsonResults, true);

// create common names:
include($_SERVER['DOCUMENT_ROOT']."/includes/herbarium/common-name-prefixes.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/herbarium/common-name-suffixes.php");


$commonNameDistribution = array(1,1,1,1,2,2,3);
$numberOfCommonNames = $commonNameDistribution[mt_rand(0,count($commonNameDistribution)-1)];

$commonNames = array();
$isAquatic = 0;
$isNight = 0;

for($i=0;$i<$numberOfCommonNames;$i++) {
$thisCommonName = $commonPrefixes[mt_rand(0,count($commonPrefixes)-1)];
do {
$thisSecondCommonName = $commonSuffixes[mt_rand(0,count($commonSuffixes)-1)];
// make sure the first and last words aren't identical:
} while ($thisCommonName == $thisSecondCommonName);



// make sure any prefixes ending in '-' don't have a space after them - so don't have "bil lilly", it's "bililly" instead:
if (substr($thisCommonName, -1, 1) == "-") {
	$thisSecondCommonName = trim($thisSecondCommonName);
}
$thisCommonName = str_replace("-", "", $thisCommonName);

if (substr($thisCommonName, -1, 1) == substr($thisSecondCommonName, 0, 1)) {
	// make sure the last character of the first word isn't the same as the first of the last word - so don't get dragonsstar - get dragonstar instead
$thisCommonName = substr($thisCommonName, 0, -1);
}

$thisCommonName .= $thisSecondCommonName;
$thisCommonNameBeforePrefix = $thisCommonName;



$thisCommonName = addPrefix($thisCommonName, false);


// in case the first name has a space at the end, and the second at the start:
$thisCommonName = str_replace("  ", " ", $thisCommonName);

$aquaticPos = strpos($thisCommonName, "*");
if ($aquaticPos !== false) {
	$isAquatic = 1;
	}
	$nightPos = strpos($thisCommonName, "^");
if ($nightPos !== false) {
	$isNight = 1;
	}


	
// remove any property markers:
$thisCommonName = str_ireplace("*", "", $thisCommonName);
$thisCommonName = str_ireplace("^", "", $thisCommonName);
if($i==0) {
	$primaryCommonName = $thisCommonName;
    do {
$variantCommonName = addPrefix($thisCommonNameBeforePrefix, true);
} while ($variantCommonName == $primaryCommonName);
$variantCommonName = str_ireplace("*", "", $variantCommonName);
$variantCommonName = str_ireplace("^", "", $variantCommonName);
$variantCommonName = str_replace("  ", " ", $variantCommonName);
}
array_push($commonNames,$thisCommonName);
}






$commonNameString = implode(", ",$commonNames);
$commonNamesJoined = implode("/",$commonNames);
if(count($commonNames)>1) {
	$lastCommaPos = strrpos($commonNameString, ",");
	$randomDetail = mt_rand(1,8);

if($randomDetail == 1) {
// add in specific detail:
	$commonNameString = substr($commonNameString, 0, $lastCommaPos)   .", and by apothecaries known as".   substr($commonNameString, $lastCommaPos+1);
} else if($randomDetail == 2) {
// add in specific detail:
	$commonNameString = substr($commonNameString, 0, $lastCommaPos)   ."; some call it".   substr($commonNameString, $lastCommaPos+1);
} else {
// replace last "," with an "or":
	
	$commonNameString = substr($commonNameString, 0, $lastCommaPos)   ." or".   substr($commonNameString, $lastCommaPos+1);
}


}

$whichBaseStringToUse = "origin";
if($isAquatic == 1) {
	$whichBaseStringToUse = "origin-aquatic";
} else if($isNight == 1) {
	$whichBaseStringToUse = "origin-night";
}









 $startingText = '';





switch ($whichGrammar) {
    case 'place':
    
foreach ($json["place"] as $value) {
    $placeText = '';
    $entriesAlreadyUsed = [];
$placeText .= '<p>'.ucfirst($value).'</p>';
$placeText = findAndReplaceHashes($placeText);
$startingText .= $placeText;
}

        
        $startingText .= "<h2>Aquatic:</h2>";

foreach ($json["place-aquatic"] as $value) {
     $placeText = '';
    $entriesAlreadyUsed = [];
$placeText .= '<p>'.ucfirst($value).'</p>';
$placeText = findAndReplaceHashes($placeText);
$startingText .= $placeText;
}




        break;
        case 'insects':
        
    foreach ($json["insectDetails"] as $value) {
        $insectDetails = '';
//$whichInsectElem = mt_rand(0,(count($json["insectDetails"])-1));
$insectDetails .= '<p>'.ucfirst($value).'</p>';
$insectDetails = findAndReplaceHashes($insectDetails)." ";
        $startingText .= $insectDetails;
}

        break;
          case 'time':
         
foreach ($json["time"] as $value) {
 $timeText = '';
$timeText .= '<p>'.ucfirst($value).'</p>';
$timeText = findAndReplaceHashes($timeText);
$startingText .= $timeText;
}

        
        break;
        case 'virtues':
        
foreach ($json["virtues"] as $value) {
    $virtueText = '';
$virtueText .= '<p>'.ucfirst($value).'</p>';
$virtueText = findAndReplaceHashes($virtueText);
        $startingText .= $virtueText;
}

        break;
        default:
        

foreach ($json[$whichBaseStringToUse] as $value) {
    $baseText = '';
$baseText .= '<p>'.ucfirst($value).'</p>';
$baseText = findAndReplaceHashes($baseText);
$startingText .= $baseText;
}

    }



// generate a butterfly:
include($_SERVER['DOCUMENT_ROOT']."/includes/herbarium/butterfly-name-prefixes.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/herbarium/butterfly-name-suffixes.php");
$thisButterflyName = $butterflyPrefixes[mt_rand(0,count($butterflyPrefixes)-1)];
do {
$thisSecondButterflyName = $butterflySuffixes[mt_rand(0,count($butterflySuffixes)-1)];
$butterflyColour = $butterflyColourPrefixes[mt_rand(0,count($butterflyColourPrefixes)-1)];
// make sure the first and last words aren't identical:
} while ($thisButterflyName == $thisSecondButterflyName);
$combinedButterflyName = $thisButterflyName." ".$thisSecondButterflyName;
$combinedButterflyPluralName = $thisButterflyName." ".$thisSecondButterflyName;



if($isNight == 1) {
$combinedButterflyName .= " moth";
$combinedButterflyPluralName .= " moths";
} else {
$combinedButterflyName .= " butterfly";
$combinedButterflyPluralName .= " butterflies";
}




$combinedButterflyName = str_ireplace("++colour++", $butterflyColour, $combinedButterflyName);
$combinedButterflyPluralName = str_ireplace("++colour++", $butterflyColour, $combinedButterflyPluralName);

$shouldAddButterflyPrefix = mt_rand(1,30);
switch ($shouldAddButterflyPrefix) {
    case 1:
        $combinedButterflyName = "Lesser ".$combinedButterflyName;
        $combinedButterflyPluralName = "Lesser ".$combinedButterflyPluralName;
        break;
    case 2:
         $combinedButterflyName = "Common ".$combinedButterflyName;
         $combinedButterflyPluralName = "Common ".$combinedButterflyPluralName;
        break;
    default:
       $combinedButterflyName = ucfirst($combinedButterflyName);
       $combinedButterflyPluralName = ucfirst($combinedButterflyPluralName);
} 

$startingText = str_ireplace("++butterfly++", $combinedButterflyName, $startingText);

$startingText = str_ireplace("++butterflies++", $combinedButterflyPluralName, $startingText);


$startingText = str_ireplace("++commonname++", $primaryCommonName, $startingText);

$startingText = str_ireplace("++variantcommonname++", $variantCommonName, $startingText);



$primaryCommonNamePlural = $primaryCommonName."s";
// catch special cases for plurals:
if(substr($primaryCommonName, -4) == "foot") {
$primaryCommonNamePlural = substr($primaryCommonName, 0, -4)."feet";
}
if(substr($primaryCommonName, -2) == "ss") {
    $primaryCommonNamePlural = $primaryCommonName."es";
} else if(substr($primaryCommonName, -1) == "s") {
    $primaryCommonNamePlural = $primaryCommonName;
}
if(substr($primaryCommonName, -1) == "y") {
    // check letter before the Y isn't a vowel:
    if((substr($primaryCommonName, -2, 1) != "a") && (substr($primaryCommonName, -2, 1) != "e") && (substr($primaryCommonName, -2, 1) != "i") && (substr($primaryCommonName, -2, 1) != "o") && (substr($primaryCommonName, -2, 1) != "u")) {
    $primaryCommonNamePlural = substr($primaryCommonName, 0, -1)."ies";
}
}
if(substr($primaryCommonName, -1) == "x") {
    $primaryCommonNamePlural = $primaryCommonName."es";
}

$startingText = str_ireplace("++commonnameplural++", $primaryCommonNamePlural, $startingText);

include($_SERVER['DOCUMENT_ROOT']."/includes/herbarium/petal-colours.php");
$petalColourName = random_key($petalColours);
$displayPetalColourName = $petalColourName;
$petalRed = $petalColours[$petalColourName][0];
$petalGreen = $petalColours[$petalColourName][1];
$petalBlue = $petalColours[$petalColourName][2];
if($isNight) {
	// make a darker colour:
$colourVariation = (mt_rand(1,40))-40;
} else {
$colourVariation = (mt_rand(1,80))-40;
}
$lighterNames = array("light","bright","pale");
$darkerNames = array("dark","deep");
if($colourVariation>20) {
	$displayPetalColourName = $lighterNames[mt_rand(0, count($lighterNames) - 1)]." ".$displayPetalColourName;
} else if($colourVariation<-20) {
	$displayPetalColourName = $darkerNames[mt_rand(0, count($darkerNames) - 1)]." ".$displayPetalColourName;
}
$petalRed += $colourVariation;
$petalGreen += $colourVariation;
$petalBlue += $colourVariation;



$petalRed = capValues($petalRed,0,255);
$petalGreen = capValues($petalGreen,0,255);
$petalBlue = capValues($petalBlue,0,255);


$startingText = str_ireplace("++petalcolour++", $displayPetalColourName, $startingText);

$displayPetalColourIshName = $displayPetalColourName."ish";
if($displayPetalColourIshName == "redish") {
$displayPetalColourIshName = "reddish";
}


$startingText = str_ireplace("++petalcolourish++", $displayPetalColourIshName, $startingText);



// add in month name(s):
if(strpos($startingText, '++month++') !== false) {
    $allMonths = array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");

    $nextMonth = mt_rand(0, count($allMonths) - 1);

    do {
        $startingText = str_replace_first('++month++', $allMonths[$nextMonth], $startingText);
        // for any further occurences, use the subsequent month name to make more sense:
        $nextMonth++;
        if($nextMonth >= count($allMonths)) {
            $nextMonth = 0;
        }
    } while (strpos($startingText, '++month++') !== false);

}

if(strpos($startingText, '++otherplants++') !== false) {
    // find other plant names:
    $plantNameQuery = "SELECT * from tblplants ORDER BY timeCreated DESC LIMIT 36";
    $plantNameResult = mysqli_query($connection, $plantNameQuery) or die ("couldn't execute query");
    $otherPlantNames = array();
    $otherPlantNameURLs = array();
    if (mysqli_num_rows($plantNameResult) > 0) {
      while ($row = mysqli_fetch_array($plantNameResult)) {
        extract($row);
        $otherNames =  explode("/",$commonNamesJoined);
        array_push($otherPlantNames,$otherNames[0]);
        array_push($otherPlantNameURLs,$plantUrl);
      }
    }
    mysqli_free_result($plantNameResult);
    $plantNamesUsed = mt_rand(0, count($otherPlantNames) - 1);
    do {
        $startingText = str_replace_first('++otherplants++', '<a href="https://www.autumnearth.com/herbarium/'.$otherPlantNameURLs[$plantNamesUsed].'/">'.$otherPlantNames[$plantNamesUsed].'</a>', $startingText);
        // for any further occurences, use the subsequent month name to make more sense:
        $plantNamesUsed++;
        if($plantNamesUsed >= count($plantNamesUsed)) {
            $plantNamesUsed = 0;
        }
    } while (strpos($startingText, '++plantNamesUsed++') !== false);
}



?>
<style>
* {
    font-family: arial, helvetica, sans-serif;
    padding: 0;
    margin: 0;
    font-size: 13px;
}
p {
    padding: 0 0 6px 0;
}
i {
    text-decoration: underline;
}
ul {
    margin-bottom: 24px;
}
body {
    padding: 24px;
}
</style>

<ul>
    <li><a href="/herbarium/showAllGrammar.php?whichGrammar=insects">Insects</a></li>
<li><a href="/herbarium/showAllGrammar.php?whichGrammar=time">Time</a></li>
<li><a href="/herbarium/showAllGrammar.php?whichGrammar=place">Place</a></li>

<li><a href="/herbarium/showAllGrammar.php?whichGrammar=virtues">Virtues</a></li>
<li><a href="/herbarium/showAllGrammar.php?whichGrammar=start">Start</a></li>
</ul>
<?php
echo $startingText;
?>
