<?php

include_once($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include_once($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");
//include_once($_SERVER['DOCUMENT_ROOT']."/includes/functions.php");

// this duplicates a lot of code from getCoreData - could use an include or function to prevent that duplication

$debug = false;
if(isset($_GET["debug"])) {
$debug = true;
}
if(!$debug) {
header('Content-Type: application/json');
}

$recipeID = $_GET["recipe"];
$outputJSON = '{"recipe":{';


$coloursQuery = "SELECT * from tblcolours";
$allColours = [];
$allItemGroups = [];
$colourResult = mysqli_query($connection, $coloursQuery) or die ("recipes failed");
while ($colourRow = mysqli_fetch_array($colourResult)) {
	extract($colourRow);
	array_push($allColours, $colourName);
}





$query = "SELECT tblrecipes.*, tblprofessions.*, tblcolours.colourName, tblinventoryitems.itemid as productId, tblinventoryitems.itemcategories as createditemcategories,

CASE WHEN tblrecipes.recipename IS NOT NULL THEN tblrecipes.recipename

 WHEN tblrecipes.defaultresultingcolour IS NOT NULL AND tblinventoryitems.hasInherentColour IS NOT NULL THEN CONCAT_WS(' ',tblcolours.colourname, tblinventoryitems.shortname)
  WHEN tblrecipes.recipename IS NULL THEN tblinventoryitems.shortname
 END as 'finalRecipeName',
 tblinventoryitems.description as recipeDescriptionFallback, tblinventoryitems.hasInherentColour as hasInherentColour FROM tblrecipes INNER JOIN tblprofessions on tblrecipes.profession = tblprofessions.professionid INNER JOIN tblinventoryitems on tblrecipes.creates = tblinventoryitems.itemid LEFT JOIN tblcolours on tblrecipes.defaultresultingcolour = tblcolours.colourid where tblrecipes.recipeid = '".$recipeID."'
order by tblprofessions.professionid, finalRecipeName ASC";


$result = mysqli_query($connection, $query) or die ("recipes failed");


$thisProfession = -1;


while ($row = mysqli_fetch_array($result)) {
	extract($row);


	$outputJSON .= '"'.$recipeID.'":{';
$outputJSON .= '"components":'.$components.',';

$componentsSplit = explode(",", $components);

$componentObject = json_decode($components);

foreach($componentObject as $key => $value) {


    if(!is_numeric($value->type)) {


        array_push($allItemGroups, $value->type);
        }
    }

$outputJSON .= '"creates":"'.$creates.'",';
$outputJSON .= '"hiddenCreates":"'.$hiddenCreates.'",';
$outputJSON .= '"defaultColour":"'.$defaultResultingColour.'",';
$outputJSON .= '"prerequisite":"'.$prerequisite.'",';
$outputJSON .= '"tier":"'.$recipeTier.'",';

$thisColour = '';
if($hasInherentColour<1) {
if($defaultResultingColour>0) {
	$thisColour = "-".strtolower($allColours[$defaultResultingColour]);
}
}

$outputJSON .= '"recipeName":"'.$finalRecipeName.'",';
$outputJSON .= '"imageId":"'.$productId.$thisColour.'",';
if($recipeDescription == "") {
$outputJSON .= '"recipeDescription":"'.$recipeDescriptionFallback.'"';
} else {
	$outputJSON .= '"recipeDescription":"'.$recipeDescription.'"';
}

$outputJSON .= '},';

}
// remove last comma:

$outputJSON = rtrim($outputJSON, ",");
$outputJSON .= '},"profession":'.$profession.'}';
echo $outputJSON;

?>