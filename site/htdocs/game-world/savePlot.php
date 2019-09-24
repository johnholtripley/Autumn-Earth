<?php

include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/functions.php");

$saveAsADraft = false;
if(isset($_POST["chr"])) {
$chr = $_POST["chr"];
$postData = $_POST["postData"];
$northWestCornerTileX = $_POST["northWestCornerTileX"];
$northWestCornerTileY = $_POST["northWestCornerTileY"];
if(isset($_POST["draft"])) {
$saveAsADraft = true;
}

} else {
    $chr = 999;
    $postData = '[[{"type":"95","tileX":2,"tileY":5,"lockedToPlayerId":999},{"type":"95","tileX":2,"tileY":6,"lockedToPlayerId":999,"colour":1},{"type":"91","tileX":4,"tileY":6,"lockedToPlayerId":999},{"type":"95","tileX":3,"tileY":1,"lockedToPlayerId":999},{"type":"89","tileX":3,"tileY":3,"lockedToPlayerId":999},{"type":"91","tileX":4,"tileY":4,"lockedToPlayerId":999}],[{"type":"95","tileX":2,"tileY":5,"lockedToPlayerId":999},{"type":"95","tileX":2,"tileY":6,"lockedToPlayerId":999,"colour":1},{"type":"91","tileX":4,"tileY":6,"lockedToPlayerId":999},{"type":"95","tileX":3,"tileY":1,"lockedToPlayerId":999},{"type":"89","tileX":3,"tileY":3,"lockedToPlayerId":999},{"type":"91","tileX":4,"tileY":4,"lockedToPlayerId":999}]]';
    $northWestCornerTileX = 64;
    $northWestCornerTileY = 144;
}

$postData = json_decode($postData, true);

if(isset($_POST["debug"])) {
    $debug = true;
}


$savedirectory = '../data/chr'.$chr.'/housing/';
if($saveAsADraft) {
$savedirectory .= 'draft/';
} else {
    // remove draft files
    
// https://stackoverflow.com/questions/4594180/deleting-all-files-from-a-folder-using-php
$files = glob($savedirectory.'draft/*');
foreach($files as $file){
  if(is_file($file))
    unlink($file);
}



}

$jsonExternalResults = file_get_contents($_SERVER['DOCUMENT_ROOT'].$savedirectory.'external.json');
$jsonExternal = json_decode($jsonExternalResults, true);



// -1 as external is [0]
for ($i=0;$i<(count($postData)-1);$i++) {
    ${"jsonFloor".$i."Results"} = file_get_contents($_SERVER['DOCUMENT_ROOT'].$savedirectory.'floor'.$i.'.json');
    ${"jsonFloor".$i} = json_decode(${"jsonFloor".$i."Results"}, true);
    ${"jsonFloor".$i}["map"]["items"] = $postData[$i];
    if($i==0) {
        $jsonExternal["map"]["items"] = $postData[$i];
        $saveHandle = fopen($savedirectory.'external.json', 'w');
        fwrite($saveHandle, json_encode($jsonExternal));
        fclose($saveHandle);
    }

    $saveHandle = fopen($savedirectory.'floor'.$i.'.json', 'w');
    fwrite($saveHandle, json_encode(${"jsonFloor".$i}));
    fclose($saveHandle);
}

echo '{"success":true}';


?>