<!doctype html>
<html lang="en-gb">
<head>
	<title>The Herbarium</title>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>



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


function generateMonths($startingText) {
    $hasUsedReplacedMonth = false;
    $hasPlacedAMonthAlready = false; 
    // add in month name(s):
if(strpos($startingText, '++month++') !== false) {
    $allMonths = array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
    $nextMonth = mt_rand(0, count($allMonths) - 1);
    do {
        $thisNextMonth = $allMonths[$nextMonth];
     if((!$hasUsedReplacedMonth) && (mt_rand(1,4) == 1) && ($hasPlacedAMonthAlready)) {
        if(mt_rand(1,2) == 1) {
            $thisNextMonth = 'the next month';
        } else {
            $thisNextMonth = 'the month following';
        }
            $hasUsedReplacedMonth = true;
        
    } else {
        $hasPlacedAMonthAlready = true;
    }
        $startingText = str_replace_first('++month++', '<i>'.$thisNextMonth.'</i>', $startingText);
        // for any further occurences, use the subsequent month name to make more sense:
        $nextMonth+=mt_rand(1,2);
        if($nextMonth >= count($allMonths)) {
            $nextMonth = 0;
        }
    } while (strpos($startingText, '++month++') !== false);
}
return $startingText;
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

?>
<p><?php echo $storedSeed; ?></p>
<?php
$entriesAlreadyUsed = [];

// create description:
$jsonResults = file_get_contents($_SERVER['DOCUMENT_ROOT'].'/includes/herbarium/description-grammar.json');
$json = json_decode($jsonResults, true);

// get region names:
$json['region'] = [];
$queryRegions = "select * from tblregions";
$resultRegions = mysqli_query($connection, $queryRegions) or die ("couldn't execute Regions query");
while ($rowRegions = mysqli_fetch_array($resultRegions)) {
    extract($rowRegions);
    array_push($json['region'], $regionName);
}

// get gods names:
$json['godsMale'] = [];
$json['godsFemale'] = [];
$queryPantheon = "select * from tblpantheon";
$resultPantheon = mysqli_query($connection, $queryPantheon) or die ("couldn't execute Pantheon query");
while ($rowPantheon = mysqli_fetch_array($resultPantheon)) {
    extract($rowPantheon);
    array_push($json['gods'.$godSex], $godName);
}


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
$variantCommonName = str_ireplace("*", "", $variantCommonName);
$variantCommonName = str_ireplace("^", "", $variantCommonName);
$variantCommonName = str_replace("  ", " ", $variantCommonName);
} while ($variantCommonName == $primaryCommonName);


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

        
        $startingText .= '<hr style="margin: 24px 0;"><h2>Aquatic:</h2>';

foreach ($json["place-aquatic"] as $value) {
     $placeText = '';
    $entriesAlreadyUsed = [];
$placeText .= '<p>'.ucfirst($value).'</p>';
$placeText = findAndReplaceHashes($placeText);
$startingText .= $placeText;
}




        break;

        case 'bats':
        
    foreach ($json["batDetails"] as $value) {
        $batDetails = '';
//$whichInsectElem = mt_rand(0,(count($json["batDetails"])-1));
$batDetails .= '<p>'.ucfirst($value).'</p>';
$batDetails = findAndReplaceHashes($batDetails)." ";
$batDetails = generateMonths($batDetails);
        $startingText .= $batDetails;
}

        break;


        case 'insects':
        
    foreach ($json["insectDetails"] as $value) {
        $insectDetails = '';
//$whichInsectElem = mt_rand(0,(count($json["insectDetails"])-1));
$insectDetails .= '<p>'.ucfirst($value).'</p>';
$insectDetails = findAndReplaceHashes($insectDetails)." ";
$insectDetails = generateMonths($insectDetails);
        $startingText .= $insectDetails;
}

        break;
          case 'time':
         
foreach ($json["time"] as $value) {
 $timeText = '';
$timeText .= '<p>'.ucfirst($value).'</p>';
$timeText = findAndReplaceHashes($timeText);
$timeText = generateMonths($timeText);
$startingText .= $timeText;
}

        
        break;
        case 'virtues':
        
foreach ($json["virtues"] as $value) {
    $virtueText = '';
$virtueText .= '<p>'.ucfirst($value).'</p>';
$virtueText = findAndReplaceHashes($virtueText);
$virtueText = generateMonths($virtueText);
        $startingText .= $virtueText;
}

        break;
        default:
        

foreach ($json[$whichBaseStringToUse] as $value) {
    $baseText = '';
$baseText .= '<p>'.ucfirst($value).'</p>';
$baseText = findAndReplaceHashes($baseText);
$baseText = generateMonths($baseText);
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

$startingText = str_ireplace("++butterfly++", '<i>'.$combinedButterflyName.'</i>', $startingText);
$startingText = str_ireplace("++butterflies++", '<i>'.$combinedButterflyPluralName.'</i>', $startingText);


// construct a bat name:
$combinedBatName = '';
$batJsonResults = file_get_contents($_SERVER['DOCUMENT_ROOT'].'/includes/herbarium/bat-grammar.json');
$batJson = json_decode($batJsonResults, true);
$whichBatElem = mt_rand(0,(count($batJson['name'])-1));
$combinedBatName = $batJson['name'][$whichBatElem];
$batConnector = 'the ';
$batExtendingName = '';
switch (mt_rand(0,2)) {
case 0:
$batExtendingName = $batJson['prefix'][(mt_rand(0,(count($batJson['prefix'])-1)))];
break;
case 1:
$batExtendingName = $batJson['colour'][(mt_rand(0,(count($batJson['colour'])-1)))];
break;
case 2:
$batExtendingName = $batJson['evocative'][(mt_rand(0,(count($batJson['evocative'])-1)))];
break;
}
$batPhysicalName = $batJson['physical'][(mt_rand(0,(count($batJson['physical'])-1)))];
switch (mt_rand(0,4)) {
case 0:
$combinedBatName = $batExtendingName." ".$combinedBatName;
break;
case 1:
$combinedBatName = $batPhysicalName." ".$combinedBatName;
break;
case 2:
$combinedBatName = $batExtendingName." ".$batPhysicalName." ".$combinedBatName;
break;
}
// potentially add a geographic or a biologist's name:
$batModifer = mt_rand(0,6);
switch ($batModifer) {
    case 0:
    $combinedBatName = $batJson['geography'][(mt_rand(0,(count($batJson['geography'])-1)))].' '.$combinedBatName;
    break;
    case 1:
    $combinedBatName = $batJson['biologist'][(mt_rand(0,(count($batJson['biologist'])-1)))]."&apos;s ".$combinedBatName;;
    // don't want a 'the' before the name:
    $batConnector = '';
    break;
}

// find any colours:
$batColour = $batJson['colour'][(mt_rand(0,(count($batJson['colour'])-1)))];
$combinedBatName = str_replace("#|colour#", $batColour, $combinedBatName);

// if the bat just has a single word, then add 'common' to it:
if(str_word_count($combinedBatName) < 2) {
$combinedBatName = 'common '.$combinedBatName;
}

$combinedBatName = $batConnector . ucfirst($combinedBatName);


if(substr($combinedBatName, -1) == "x") {
    $combinedBatPluralName = $combinedBatName."es";
} else {
   $combinedBatPluralName = $combinedBatName.'s'; 
}


$combinedBatPluralName = str_replace("the ", "", $combinedBatPluralName);


$startingText = str_ireplace("++bat++", $combinedBatName, $startingText);
$startingText = str_ireplace("++bats++", $combinedBatPluralName, $startingText);


$startingText = str_ireplace("++commonname++", '<i>'.$primaryCommonName.'</i>', $startingText);

$startingText = str_ireplace("++variantcommonname++", '<i>'.$variantCommonName.'</i>', $startingText);



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
if(substr($primaryCommonName, -2) == "sh") {
    $primaryCommonNamePlural = $primaryCommonName."es";
}
if(substr($primaryCommonName, -2) == "ch") {
    $primaryCommonNamePlural = $primaryCommonName."es";
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







// add in seasons:
if(strpos($startingText, '++season++') !== false) {
    $allSeasons = array("Spring", "Summer", "Autumn", "Winter");
    // make spring and summer more likely:
    $startingSeasons = array("Spring", "Spring", "Spring", "Summer", "Summer", "Autumn", "Winter");
    $firstSeason = mt_rand(0, count($startingSeasons) - 1);
    $seasonAfter = array_search($startingSeasons[$firstSeason], $allSeasons) + 1;
    if($seasonAfter >= count($allSeasons)) {
            $seasonAfter = 0;
        }
    $startingText = str_replace('++season++', '<i>'.$startingSeasons[$firstSeason].'</i>', $startingText);
    $startingText = str_replace('++seasonafter++', '<i>'.$allSeasons[$seasonAfter].'</i>', $startingText);
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
    } while (strpos($startingText, '++otherplants++') !== false);
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
p:first-letter {
    text-transform: uppercase;
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
    <li><a href="/herbarium/showAllGrammar.php?whichGrammar=insects">Insects</a> ✓</li>
    <li><a href="/herbarium/showAllGrammar.php?whichGrammar=bats">Bats</a> ✓</li>
    <li><a href="/herbarium/showAllGrammar.php?whichGrammar=time">Time</a> ✓</li>
    <li><a href="/herbarium/showAllGrammar.php?whichGrammar=place">Place</a> ✓</li>
    <li><a href="/herbarium/showAllGrammar.php?whichGrammar=virtues">Virtues</a></li>
    <li><a href="/herbarium/showAllGrammar.php?whichGrammar=start">Start</a></li>
</ul>

<?php
echo $startingText;
?>
</body>
</html>

