<?php

include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/functions.php");


if(isset($_POST["chr"])) {
$chr = $_POST["chr"];
} else {
    $chr = 999;
    $postData = '[]';
}

$postData = json_decode($postData, true);
if(isset($_POST["debug"])) {
    $debug = true;
}

$housingDirectory = 'data/chr'.$chr.'/housing/';
$savedirectory = '../'.$housingDirectory;
$draftDirectory = $savedirectory.'draft/';

// delete all draft files in case there are any new elevation files that need removing:
$files = glob($draftDirectory.'{,.}*', GLOB_BRACE);
foreach($files as $file){
  if(is_file($file)) {
    unlink($file);
}
}

// save the committed design to the drafts folder:
$files = glob($savedirectory.'{,.}*', GLOB_BRACE);
foreach($files as $file){
  if(is_file($file)) {
$justFileName = explode("/", $file);
copy($file, $draftDirectory.end($justFileName));
}
}




// get the committed designs and return that as the new draft version:
$housing["draft"] = array();
$housingFiles = scandir($savedirectory);
// sort into external, then floor0, floor1 etc:
sort($housingFiles);
foreach ($housingFiles as &$fileName) {
    if (strpos($fileName, '.json') !== false) {
        $thisFileContents = file_get_contents($_SERVER['DOCUMENT_ROOT'].'/'.$housingDirectory.$fileName);
        $thisFileContentsJson = json_decode($thisFileContents, true);
        array_push($housing["draft"],$thisFileContentsJson["map"]["items"]);
    }
}





echo '{"housing":{';
echo '"success":true,';
echo '"draft":'.json_encode($housing["draft"]).'}}';


?>