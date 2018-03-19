<?php



/*
// http://stackoverflow.com/questions/6054033/pretty-printing-json-with-php
function prettyPrint( $json )
{
    $result = '';
    $level = 0;
    $in_quotes = false;
    $in_escape = false;
    $ends_line_level = NULL;
    $json_length = strlen( $json );

    for( $i = 0; $i < $json_length; $i++ ) {
        $char = $json[$i];
        $new_line_level = NULL;
        $post = "";
        if( $ends_line_level !== NULL ) {
            $new_line_level = $ends_line_level;
            $ends_line_level = NULL;
        }
        if ( $in_escape ) {
            $in_escape = false;
        } else if( $char === '"' ) {
            $in_quotes = !$in_quotes;
        } else if( ! $in_quotes ) {
            switch( $char ) {
                case '}': case ']':
                    $level--;
                    $ends_line_level = NULL;
                    $new_line_level = $level;
                    break;

                case '{': case '[':
                    $level++;
                case ',':
                    $ends_line_level = $level;
                    break;

                case ':':
                    $post = " ";
                    break;

                case " ": case "\t": case "\n": case "\r":
                    $char = "";
                    $ends_line_level = $new_line_level;
                    $new_line_level = NULL;
                    break;
            }
        } else if ( $char === '\\' ) {
            $in_escape = true;
        }
        if( $new_line_level !== NULL ) {
            $result .= "\n".str_repeat( "\t", $new_line_level );
        }
        $result .= $char.$post;
    }

    return $result;
}
// just temp while working
*/





include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");


$coloursQuery = "SELECT * from tblcolours";
$allColours = [];
$allItemGroups = [];
$colourResult = mysqli_query($connection, $coloursQuery) or die ("recipes failed");
while ($colourRow = mysqli_fetch_array($colourResult)) {
	extract($colourRow);
	array_push($allColours, $colourName);
}

$outputJson = '{"professions": {';



$whichIds = '';
if(isset($_GET["whichIds"]));
$whichIds = $_GET["whichIds"];
 
$allIds = explode("|", $whichIds);
$itemIdString="";

for($i=0;$i<count($allIds);$i++) {
	if($i!=0) {
		$itemIdString.=", ";
	}
	$itemIdString .= intval($allIds[$i]);
}




$query = "SELECT tblrecipes.*, tblprofessions.*, tblcolours.colourName, tblinventoryitems.itemid as productId, tblinventoryitems.itemcategories as createditemcategories,

CASE WHEN tblrecipes.recipename IS NOT NULL THEN tblrecipes.recipename

 WHEN tblrecipes.defaultresultingcolour IS NOT NULL AND tblinventoryitems.hasInherentColour IS NOT NULL THEN CONCAT_WS(' ',tblcolours.colourname, tblinventoryitems.shortname)
  WHEN tblrecipes.recipename IS NULL THEN tblinventoryitems.shortname
 END as 'finalRecipeName',
 tblinventoryitems.description as recipeDescriptionFallback, tblinventoryitems.hasInherentColour as hasInherentColour FROM tblrecipes INNER JOIN tblprofessions on tblrecipes.profession = tblprofessions.professionid INNER JOIN tblinventoryitems on tblrecipes.creates = tblinventoryitems.itemid LEFT JOIN tblcolours on tblrecipes.defaultresultingcolour = tblcolours.colourid where tblrecipes.recipeid in (".$itemIdString.")
order by tblprofessions.professionid, finalRecipeName ASC";


$result = mysqli_query($connection, $query) or die ("recipes failed");


$thisProfession = -1;


while ($row = mysqli_fetch_array($result)) {
	extract($row);

    if($thisProfession != $profession) {
if($thisProfession != -1) {
    // if not first time:

// remove last comma:
$outputJson = rtrim($outputJson, ",");

$outputJson .= '},';
$outputJson .= '"sortOrder": ['.implode(",", $thisRecipeOrder).'],';
ksort($thisProfessionsFilters);
$outputJson .= '"filters": '.json_encode($thisProfessionsFilters).',';
$outputJson .= '"filterOrder": [';
//implode(",", array_keys($thisProfessionsFilters));
$professionsKeys = array_keys($thisProfessionsFilters);

foreach ($professionsKeys as $value) {
    $outputJson .= '"'.$value.'",';
}
// remove last comma:

$outputJson = rtrim($outputJson, ",");
$outputJson .= ']';
$outputJson .= '},';
} 
$thisRecipeOrder = [];
$thisProfessionsFilters = [];

$outputJson .= '"'.$profession.'": { "name": "'.$professionName.'", ';
$outputJson .= '"recipes": {';
$thisProfession = $profession;
    }
	
	$outputJson .= '"'.$recipeID.'":{';
$outputJson .= '"components":"'.$components.'",';

$componentsSplit = explode(",", $components);



$componentObject = json_decode($components);

foreach($componentObject as $key => $value) {



    if(is_numeric($value->type)) {


        array_push($allItemGroups, $value->type);
        }
    }

$outputJson .= '"creates":"'.$creates.'",';


$thisRecipesFilters = "Miscellaneous";
if(isset($createditemcategories)) {
// get categories for this item:
$catQuery = "SELECT * FROM tblitemcategories WHERE categoryid in (".$createditemcategories.")";
$catResult = mysqli_query($connection, $catQuery) or die ("categories failed");
 
while ($catRow = mysqli_fetch_array($catResult)) {
    extract($catRow);
    $thisRecipesFilters = $categoryName; 
}
} 


if (array_key_exists($thisRecipesFilters, $thisProfessionsFilters)) {
    array_push($thisProfessionsFilters[$thisRecipesFilters], $recipeID);
} else {
// add new key:
$thisProfessionsFilters[$thisRecipesFilters] = array($recipeID);
}

// add this to the 'all' category
if (array_key_exists("All", $thisProfessionsFilters)) {
    array_push($thisProfessionsFilters["All"], $recipeID);
} else {
// add new key:
$thisProfessionsFilters["All"] = array($recipeID);
}






$outputJson .= '"prerequisite":"'.$prerequisite.'",';
array_push($thisRecipeOrder, $recipeID);

$thisColour = '';
if($hasInherentColour<1) {
if($defaultResultingColour>0) {
	$thisColour = "-".strtolower($allColours[$defaultResultingColour]);
}
}



$outputJson .= '"recipeName":"'.$finalRecipeName.'",';


$outputJson .= '"imageId":"'.$productId.$thisColour.'",';

if($recipeDescription == "") {
$outputJson .= '"recipeDescription":"'.$recipeDescriptionFallback.'"';
} else {
	$outputJson .= '"recipeDescription":"'.$recipeDescription.'"';
}

$outputJson .= '},';

}
// remove last comma:

$outputJson = rtrim($outputJson, ",");


$outputJson .= '},';
$outputJson .= '"sortOrder": ['.implode(",", $thisRecipeOrder).'],';
ksort($thisProfessionsFilters);
$outputJson .= '"filters": '.json_encode($thisProfessionsFilters).',';
$outputJson .= '"filterOrder": [';
//implode(",", array_keys($thisProfessionsFilters));
$professionsKeys = array_keys($thisProfessionsFilters);
foreach ($professionsKeys as $value) {
    $outputJson .= '"'.$value.'",';
}
// remove last comma:

$outputJson = rtrim($outputJson, ",");
$outputJson .= ']';


$outputJson .= '}}';


if(count($allItemGroups)>0) {
$outputJson .= ',"itemGroups": {';

$groupQuery = "select * from tblitemgroups where itemgroupcode in (";

for($i=0;$i<count($allItemGroups);$i++) {
$groupQuery .= '"'.$allItemGroups[$i].'",';
}
   
$groupQuery = rtrim($groupQuery, ",");
$groupQuery .= ")";




$groupResult = mysqli_query($connection, $groupQuery) or die ("item groups failed");

while ($groupRow = mysqli_fetch_array($groupResult)) {
    extract($groupRow);
    //echo $itemGroupCode." - ".$itemGroupDescription."<br />";

$outputJson .= '"'.$itemGroupCode.'": "'.$itemGroupDescription.'",';

}
$outputJson = rtrim($outputJson, ",");
$outputJson .= '}';

}



$outputJson .= '}';

echo $outputJson;
//echo '<code><pre>'.prettyPrint($outputJson).'</pre></code>';

?>